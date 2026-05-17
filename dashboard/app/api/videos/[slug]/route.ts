import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, readdir } from "fs/promises";
import path from "path";
import type { VideoScript } from "@/lib/types";
import { generateDataTs } from "@/lib/generate-data-ts";

const REPO_ROOT = path.join(process.cwd(), "..", "remotion");

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const scriptPath = path.join(REPO_ROOT, "src", slug, "script.json");
  const pubDir     = path.join(REPO_ROOT, "public", slug);

  let script: VideoScript | null = null;
  try {
    const raw = await readFile(scriptPath, "utf-8");
    script = JSON.parse(raw) as VideoScript;
  } catch {}

  let imagePaths: string[] = [];
  try {
    const files = await readdir(pubDir);
    imagePaths = files
      .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
      .map((f) => `${slug}/${f}`);
  } catch {}

  return NextResponse.json({ script, imagePaths });
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const { script }: { script: VideoScript } = await req.json();

  const scriptPath = path.join(REPO_ROOT, "src", slug, "script.json");
  const dataPath   = path.join(REPO_ROOT, "src", slug, "data.ts");

  await writeFile(scriptPath, JSON.stringify(script, null, 2), "utf-8");
  await writeFile(dataPath, generateDataTs(script), "utf-8");

  return NextResponse.json({ ok: true });
}
