import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import type { VoiceSettings } from "@/lib/voiceover-types";

const REPO_ROOT = path.join(process.cwd(), "..", "remotion");

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

export async function POST(req: NextRequest) {
  const {
    slug,
    fullScript,
    settings,
  }: { slug: string; fullScript: string; settings: VoiceSettings } = await req.json();

  if (!fullScript?.trim()) {
    return NextResponse.json({ error: "El guión está vacío" }, { status: 400 });
  }

  // Generate audio with ElevenLabs
  const audioStream = await client.textToSpeech.convert(settings.voiceId, {
    text: fullScript,
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

  // Collect stream into a Buffer
  const arrayBuffer = await new Response(audioStream as unknown as ReadableStream).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Save to remotion/public/[slug]/[slug]-voiceover.mp3
  const pubDir  = path.join(REPO_ROOT, "public", slug);
  const filename = `${slug}-voiceover.mp3`;
  const filepath = path.join(pubDir, filename);

  await mkdir(pubDir, { recursive: true });
  await writeFile(filepath, buffer);

  // Return the relative path (for use in Remotion as staticFile)
  return NextResponse.json({
    filename,
    remotionPath: `${slug}/${filename}`,
    sizeKb: Math.round(buffer.byteLength / 1024),
  });
}
