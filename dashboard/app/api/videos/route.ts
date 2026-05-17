import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import path from "path";

const REPO_ROOT = path.join(process.cwd(), "..");
const SRC_DIR   = path.join(REPO_ROOT, "src");
const PUB_DIR   = path.join(REPO_ROOT, "public");

export interface VideoMeta {
  slug: string;
  displayTitle: string;
  hasScript: boolean;
  thumbnailPath: string | null;
  createdAt: string;
}

export async function GET() {
  const entries = await readdir(SRC_DIR, { withFileTypes: true });
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

      videos.push({
        slug,
        displayTitle,
        hasScript,
        thumbnailPath,
        createdAt: dataStat.birthtime.toISOString(),
      });
    } catch {
      // No data.ts → skip
    }
  }

  videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ videos });
}
