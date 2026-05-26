import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import type { VoiceSettings } from "@/lib/voiceover-types";

const REPO_ROOT = path.join(process.cwd(), "..", "remotion");
const SCENE_KEYS = ["intro", "layers", "phase1", "phase2", "phase3", "reality", "close"] as const;

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

async function generateAudio(
  voiceId: string,
  settings: VoiceSettings,
  text: string,
): Promise<Buffer> {
  const audioStream = await client.textToSpeech.convert(voiceId, {
    text,
    modelId: settings.modelId,
    languageCode: "es",
    voiceSettings: {
      stability:       settings.stability,
      similarityBoost: settings.similarityBoost,
      style:           settings.style,
      speed:           settings.speed,
    },
    outputFormat: "mp3_44100_128",
  });
  const arrayBuffer = await new Response(audioStream as unknown as ReadableStream).arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    slug: string;
    settings: VoiceSettings;
    // Per-scene mode (preferred):
    sceneTexts?: Record<string, string>;
    // Single-file fallback:
    fullScript?: string;
  };

  const { slug, settings, sceneTexts, fullScript } = body;
  const pubDir = path.join(REPO_ROOT, "public", slug);
  await mkdir(pubDir, { recursive: true });

  // ── Per-scene mode (one file per scene) ──────────────────────────────────
  if (sceneTexts) {
    const entries = SCENE_KEYS.filter((k) => sceneTexts[k]?.trim());

    const results: [string, string][] = [];
    for (const key of entries) {
      const text = sceneTexts[key].trim();
      const buf  = await generateAudio(settings.voiceId, settings, text);
      const filename = `${slug}-voiceover-${key}.mp3`;
      await writeFile(path.join(pubDir, filename), buf);
      results.push([key, `${slug}/${filename}`]);
    }

    const files = Object.fromEntries(results) as Record<string, string>;
    return NextResponse.json({ files });
  }

  // ── Single-file fallback ──────────────────────────────────────────────────
  if (!fullScript?.trim()) {
    return NextResponse.json({ error: "Falta fullScript o sceneTexts" }, { status: 400 });
  }

  const buf      = await generateAudio(settings.voiceId, settings, fullScript);
  const filename = `${slug}-voiceover.mp3`;
  await writeFile(path.join(pubDir, filename), buf);

  return NextResponse.json({
    filename,
    remotionPath: `${slug}/${filename}`,
    sizeKb: Math.round(buf.byteLength / 1024),
  });
}
