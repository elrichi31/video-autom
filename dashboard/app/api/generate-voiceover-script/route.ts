import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { AnyVideoScript, VideoScript, VideoScriptTimeline } from "@/lib/types";
import type { VoiceoverScript } from "@/lib/voiceover-types";
import {
  VOICEOVER_SYSTEM_PROMPT, buildVoiceoverUserPrompt,
  TIMELINE_VOICEOVER_SYSTEM_PROMPT, buildTimelineVoiceoverUserPrompt,
} from "@/lib/voiceover-prompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { script }: { script: AnyVideoScript } = await req.json();

  const isTimeline = script.compositionType === "timeline";
  const systemPrompt = isTimeline ? TIMELINE_VOICEOVER_SYSTEM_PROMPT : VOICEOVER_SYSTEM_PROMPT;
  const userPrompt   = isTimeline
    ? buildTimelineVoiceoverUserPrompt(script as VideoScriptTimeline)
    : buildVoiceoverUserPrompt(script as VideoScript);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.6,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt },
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
