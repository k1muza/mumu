// Emits public/sw.js from src/sw/service-worker.js with this build's stamp
// baked in. Runs from the `prebuild`/`predev` npm hooks, before Next copies
// public/ — the generated file is gitignored so builds don't dirty the tree.
//
// Why it matters: the browser only notices a service-worker update when the
// script's bytes change. The hand-written worker never changes on a content or
// UI edit, so without a stamp an installed PWA would keep running old code
// forever.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function git(args) {
  return execFileSync("git", args, {
    cwd: root,
    stdio: ["ignore", "pipe", "ignore"],
  })
    .toString()
    .trim();
}

// Prefer the commit SHA so rebuilding the same commit is a no-op for clients.
// A dirty tree (local iteration) gets a timestamp appended, otherwise testing
// the update flow against uncommitted edits would never produce a new stamp.
function buildStamp() {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
  if (fromEnv) return fromEnv.slice(0, 12);
  try {
    const head = git(["rev-parse", "HEAD"]).slice(0, 12);
    const dirty = git(["status", "--porcelain"]) !== "";
    return dirty ? `${head}-${Date.now().toString(36)}` : head;
  } catch {
    return Date.now().toString(36);
  }
}

const stamp = buildStamp();
const source = readFileSync(join(root, "src/sw/service-worker.js"), "utf8");
if (!source.includes("__LU_BUILD__")) {
  throw new Error("service-worker.js is missing the __LU_BUILD__ placeholder");
}

const out = join(root, "public/sw.js");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, source.replaceAll("__LU_BUILD__", stamp));
console.log(`public/sw.js written (build ${stamp})`);
