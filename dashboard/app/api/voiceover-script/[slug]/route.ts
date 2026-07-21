import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { VoiceoverScript, VoiceSettings } from "@/lib/voiceover-types";

const REPO_ROOT = path.join(process.cwd(), "..", "remotion");

export interface SavedVoiceoverData {
  voiceover: VoiceoverScript;
  settings: VoiceSettings;
  targetDuration: number;
  savedAt: string;
  voiceoverFiles?: Record<string, string>; // per-scene audio paths (remotion relative)
  voiceoverTakes?: Record<string, string[]>; // alternate takes, first is active by default
}

function filePath(slug: string) {
  return path.join(REPO_ROOT, "public", slug, `${slug}-voiceover-script.json`);
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const raw = await readFile(filePath(params.slug), "utf-8");
    return NextResponse.json(JSON.parse(raw) as SavedVoiceoverData);
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const body: SavedVoiceoverData = await req.json();
  const fp = filePath(params.slug);
  await mkdir(path.dirname(fp), { recursive: true });
  await writeFile(fp, JSON.stringify({ ...body, savedAt: new Date().toISOString() }, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
