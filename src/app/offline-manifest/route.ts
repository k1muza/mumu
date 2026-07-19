import { createHash } from "node:crypto";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { ALL_CONTENT } from "@/content";
import { STORIES } from "@/content/stories";

// Baked at build time so `fs` scans the repo's public/ dir, not the deploy target.
export const dynamic = "force-static";

function universeAssets(): string[] {
  const root = join(process.cwd(), "public");
  const urls: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(join(root, dir))) {
      const rel = `${dir}/${entry}`;
      if (statSync(join(root, rel)).isDirectory()) walk(rel);
      else urls.push(`/${rel.replace(/\\/g, "/")}`);
    }
  };
  walk("universe");
  return urls.sort();
}

export function GET() {
  const routes = [
    "/",
    "/rewards",
    "/parent",
    "/stories",
    ...ALL_CONTENT.map((c) => `/world/${c.subject.id}`),
    ...ALL_CONTENT.flatMap((c) =>
      c.badges.map((b) => `/lesson/${b.subjectId}/${b.slug}`)
    ),
    ...STORIES.map((s) => `/stories/${s.id}`),
  ];
  const assets = universeAssets();
  const version = createHash("sha256")
    .update(JSON.stringify({ routes, assets }))
    .digest("hex")
    .slice(0, 12);

  return Response.json({ version, routes, assets });
}
