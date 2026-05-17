import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { VideoScript } from "@/lib/types";
import type { VoiceoverScript } from "@/lib/voiceover-types";
import { VOICEOVER_SYSTEM_PROMPT, buildVoiceoverUserPrompt } from "@/lib/voiceover-prompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { script }: { script: VideoScript } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.6,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: VOICEOVER_SYSTEM_PROMPT },
      { role: "user",   content: buildVoiceoverUserPrompt(script) },
    ],
  });

  const raw = completion.choices[0].message.content ?? "{}";

  let voiceover: VoiceoverScript;
  try {
    voiceover = JSON.parse(raw) as VoiceoverScript;
  } catch {
    return NextResponse.json({ error: "JSON inválido de GPT-4o", raw }, { status: 500 });
  }

  return NextResponse.json({ voiceover });
}
