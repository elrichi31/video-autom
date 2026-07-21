import { NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import type { ElevenLabsVoice } from "@/lib/voiceover-types";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

// Fallback favourites. Spanish-labelled voices always rank above these.
const FEATURED_VOICE_IDS = new Set([
  "pNInz6obpgDQGcFmaJgB", // Adam
  "ErXwobaYiN019PkySvjV", // Antoni
  "VR6AewLTigWG4xSOukaG", // Arnold
  "TxGEqnHWrfWFTfGW9XjX", // Josh
  "yoZ06aMxZJJ28mfd3POQ", // Sam
  "EXAVITQu4vr4xnSDxMaL", // Bella
  "21m00Tcm4TlvDq8ikWAM", // Rachel
  "AZnzlk1XvdvUeBnXmlld", // Domi
]);

function isSpanishVoice(labels: Record<string, string>): boolean {
  const metadata = Object.values(labels).join(" ").toLowerCase();
  return /\b(spanish|español|espanol|es-mx|es-es|mexic|latam|latin)/.test(metadata);
}

export async function GET() {
  try {
    const response = await client.voices.search({ pageSize: 100 });
    const all = response.voices ?? [];

    const voices: ElevenLabsVoice[] = all
      .filter((v) => v.voiceId && v.name)
      .map((v) => ({
        voice_id:    v.voiceId!,
        name:        v.name!,
        category:    v.category ?? "premade",
        labels:      (v.labels as Record<string, string>) ?? {},
        preview_url: v.previewUrl ?? null,
      }))
      // A native Spanish voice is the most meaningful quality decision for
      // Spanish narration. Favourites only act as a fallback.
      .sort((a, b) => {
        const aSpanish = isSpanishVoice(a.labels) ? 0 : 1;
        const bSpanish = isSpanishVoice(b.labels) ? 0 : 1;
        if (aSpanish !== bSpanish) return aSpanish - bSpanish;
        const aFeat = FEATURED_VOICE_IDS.has(a.voice_id) ? 0 : 1;
        const bFeat = FEATURED_VOICE_IDS.has(b.voice_id) ? 0 : 1;
        if (aFeat !== bFeat) return aFeat - bFeat;
        return a.name.localeCompare(b.name);
      });

    return NextResponse.json({ voices });
  } catch (err) {
    return NextResponse.json({ error: String(err), voices: [] }, { status: 500 });
  }
}
