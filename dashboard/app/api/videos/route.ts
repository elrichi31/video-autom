import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import path from "path";

const REPO_ROOT = path.join(process.cwd(), "..", "remotion");
const SRC_DIR   = path.join(REPO_ROOT, "src");
const PUB_DIR   = path.join(REPO_ROOT, "public");

export interface VideoMeta {
  slug: string;
  displayTitle: string;
  hasScript: boolean;
  thumbnailPath: string | null;
  createdAt: string;
  compositionId: string;
}

// Reads Root.tsx and builds a map of { ComponentName → compositionId }
async function buildCompositionIdMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const rootContent = await readFile(path.join(REPO_ROOT, "src", "Root.tsx"), "utf-8");
    const blockRegex = /<Composition[\s\S]*?\/>/g;
    const idRx = /id="([^"]+)"/;
    const compRx = /component=\{(\w+)\}/;
    for (const block of rootContent.matchAll(blockRegex)) {
      const id   = block[0].match(idRx)?.[1];
      const comp = block[0].match(compRx)?.[1];
      if (id && comp) map.set(comp, id);
    }
  } catch {}
  return map;
}

function slugToComponentName(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("") + "Composition";
}

function slugToFallbackCompositionId(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("") + "VerticalPremium";
}

export async function GET() {
  const [entries, compositionIdMap] = await Promise.all([
    readdir(SRC_DIR, { withFileTypes: true }),
    buildCompositionIdMap(),
  ]);
  const videos: VideoMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const dataPath   = path.join(SRC_DIR, slug, "data.ts");
    const scriptPath = path.join(SRC_DIR, slug, "script.json");

    try {
      const dataStat = await stat(dataPath);

      // Check for script.json (AI-generated)
      let hasScript = false;
      try { await stat(scriptPath); hasScript = true; } catch {}

      // Derive display title from slug or script.json
      let displayTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      if (hasScript) {
        try {
          const raw = await readFile(scriptPath, "utf-8");
          const json = JSON.parse(raw);
          if (json.displayTitle) displayTitle = json.displayTitle;
        } catch {}
      }

      // Find thumbnail (intro image)
      let thumbnailPath: string | null = null;
      try {
        const pubSlugDir = path.join(PUB_DIR, slug);
        const imgs = await readdir(pubSlugDir);
        const intro = imgs.find((f) => f.includes("-intro."));
        if (intro) thumbnailPath = `${slug}/${intro}`;
      } catch {}

      const componentName = slugToComponentName(slug);
      const compositionId = compositionIdMap.get(componentName) ?? slugToFallbackCompositionId(slug);

      videos.push({
        slug,
        displayTitle,
        hasScript,
        thumbnailPath,
        createdAt: dataStat.birthtime.toISOString(),
        compositionId,
      });
    } catch {
      // No data.ts → skip
    }
  }

  videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ videos });
}
