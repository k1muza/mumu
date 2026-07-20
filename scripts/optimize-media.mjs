import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MEDIA_DIRS = [
  path.join(PUBLIC_DIR, "assets", "learning-objects"),
  path.join(PUBLIC_DIR, "universe"),
];

async function findPngs(directory) {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findPngs(filename));
    else if (entry.name.toLowerCase().endsWith(".png")) files.push(filename);
  }

  return files;
}

function outputPlan(filename) {
  const relative = path.relative(PUBLIC_DIR, filename).replaceAll("\\", "/");

  if (relative.startsWith("assets/learning-objects/")) {
    return {
      resize: { width: 512, height: 512, fit: "inside", withoutEnlargement: true },
      webp: { quality: 84, alphaQuality: 92, effort: 6, smartSubsample: true },
    };
  }

  if (/^universe\/stories\/story-[^/]+-cover(?:-alt)?\.png$/.test(relative)) {
    return {
      resize: { width: 800, height: 1067, fit: "cover", position: "centre" },
      webp: { quality: 84, alphaQuality: 92, effort: 6, smartSubsample: true },
    };
  }

  if (/^universe\/stories\/story-[^/]+-p\d+\.png$/.test(relative)) {
    return {
      resize: { width: 1024, height: 768, fit: "cover", position: "centre" },
      webp: { quality: 84, alphaQuality: 92, effort: 6, smartSubsample: true },
    };
  }

  if (/^universe\/stories\/story-[^/]+-q\d+-c\d+(?:-alt)?\.png$/.test(relative)) {
    return {
      resize: { width: 512, height: 512, fit: "cover", position: "centre" },
      webp: { quality: 84, alphaQuality: 92, effort: 6, smartSubsample: true },
    };
  }

  if (relative === "universe/ui/logo_learning_universe.png") {
    return {
      resize: { width: 640, withoutEnlargement: true },
      webp: { quality: 90, alphaQuality: 95, effort: 6, smartSubsample: true },
    };
  }

  return {
    webp: { quality: 88, alphaQuality: 95, effort: 6, smartSubsample: true },
  };
}

async function optimize(filename) {
  const output = filename.replace(/\.png$/i, ".webp");
  const inputBytes = (await stat(filename)).size;
  const plan = outputPlan(filename);
  let pipeline = sharp(filename).rotate();

  if (plan.resize) pipeline = pipeline.resize(plan.resize);
  await pipeline.webp(plan.webp).toFile(output);

  const outputBytes = (await stat(output)).size;
  if (outputBytes >= inputBytes) {
    await unlink(output);
    return { converted: false, inputBytes, outputBytes: inputBytes };
  }

  await unlink(filename);
  return { converted: true, inputBytes, outputBytes };
}

const pngs = (await Promise.all(MEDIA_DIRS.map(findPngs))).flat().sort();
let inputBytes = 0;
let outputBytes = 0;
let converted = 0;

for (const filename of pngs) {
  const result = await optimize(filename);
  inputBytes += result.inputBytes;
  outputBytes += result.outputBytes;
  if (result.converted) converted += 1;
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
console.log(
  `Converted ${converted}/${pngs.length} PNGs to WebP: ${mb(inputBytes)} MB -> ${mb(outputBytes)} MB`,
);
