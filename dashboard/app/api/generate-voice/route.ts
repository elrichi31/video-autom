import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isExpressiveVoiceModel, type VoiceSettings } from "@/lib/voiceover-types";
import { normalizeTextForTts } from "@/lib/tts-text";

const REPO_ROOT = path.join(process.cwd(), "..", "remotion");
const SCENE_KEYS = ["intro", "layers", "phase1", "phase2", "phase3", "reality", "close"] as const;

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

async function generateAudio(
  voiceId: string,
  settings: VoiceSettings,
  text: string,
): Promise<Buffer> {
  const voiceSettings = isExpressiveVoiceModel(settings.modelId)
    ? { stability: settings.stability }
    : {
        stability: settings.stability,
        similarityBoost: settings.similarityBoost,
        style: settings.style,
        speed: settings.speed,
      };

  const audioStream = await client.textToSpeech.convert(voiceId, {
    text,
    modelId: settings.modelId,
    languageCode: "es",
    voiceSettings,
    // 128 kbps is available on every plan and remains transparent after the
    // additional compression applied by TikTok/Reels.
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
    takeCount?: number;
    // Single-file fallback:
    fullScript?: string;
  };

  const { slug, settings, sceneTexts, fullScript } = body;
  const takeCount = Math.min(3, Math.max(1, Math.floor(body.takeCount ?? 1)));
  const pubDir = path.join(REPO_ROOT, "public", slug);
  await mkdir(pubDir, { recursive: true });

  // ── Per-scene mode (one file per scene) ──────────────────────────────────
  if (sceneTexts) {
    const entries = SCENE_KEYS.filter((k) => sceneTexts[k]?.trim());

    const results: [string, string][] = [];
    const takes: Record<string, string[]> = {};
    const normalizedTexts: Record<string, string> = {};
    for (const key of entries) {
      const text = normalizeTextForTts(sceneTexts[key]);
      normalizedTexts[key] = text;
      const sceneTakes: string[] = [];
      for (let take = 1; take <= takeCount; take++) {
        const buf = await generateAudio(settings.voiceId, settings, text);
        const suffix = takeCount === 1 ? "" : `-take-${take}`;
        const filename = `${slug}-voiceover-${key}${suffix}.mp3`;
        await writeFile(path.join(pubDir, filename), buf);
        sceneTakes.push(`${slug}/${filename}`);
      }
      takes[key] = sceneTakes;
      results.push([key, sceneTakes[0]]);
    }

    const files = Object.fromEntries(results) as Record<string, string>;
    return NextResponse.json({ files, takes, normalizedTexts });
  }

  // ── Single-file fallback ──────────────────────────────────────────────────
  if (!fullScript?.trim()) {
    return NextResponse.json({ error: "Falta fullScript o sceneTexts" }, { status: 400 });
  }

  const normalizedText = normalizeTextForTts(fullScript);
  const buf      = await generateAudio(settings.voiceId, settings, normalizedText);
  const filename = `${slug}-voiceover.mp3`;
  await writeFile(path.join(pubDir, filename), buf);

  return NextResponse.json({
    filename,
    remotionPath: `${slug}/${filename}`,
    sizeKb: Math.round(buf.byteLength / 1024),
    normalizedText,
  });
}
