import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const REPO_ROOT = path.join(process.cwd(), "..", "remotion");

export interface TikTokCaption {
  title: string;
  description: string;
  hashtags: string[];
  savedAt?: string;
}

function filePath(slug: string) {
  return path.join(REPO_ROOT, "src", slug, "tiktok-caption.json");
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const raw = await readFile(filePath(params.slug), "utf-8");
    return NextResponse.json(JSON.parse(raw) as TikTokCaption);
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const body: TikTokCaption = await req.json();
  const fp = filePath(params.slug);
  await mkdir(path.dirname(fp), { recursive: true });
  await writeFile(fp, JSON.stringify({ ...body, savedAt: new Date().toISOString() }, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
