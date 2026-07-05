import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { AnyVideoScript, VideoScript, VideoScriptTimeline } from "@/lib/types";
import type { VoiceoverScript } from "@/lib/voiceover-types";
import {
  VOICEOVER_SYSTEM_PROMPT, buildVoiceoverUserPrompt,
  TIMELINE_VOICEOVER_SYSTEM_PROMPT, buildTimelineVoiceoverUserPrompt,
} from "@/lib/voiceover-prompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const VOICEOVER_SCRIPT_MODEL = process.env.OPENAI_VOICEOVER_SCRIPT_MODEL ?? "gpt-4o-mini";

export async function POST(req: NextRequest) {
  const { script, context }: { script: AnyVideoScript; context?: string } = await req.json();

  const contextStr = typeof context === "string" ? context : undefined;
  const isTimeline = script.compositionType === "timeline";
  const systemPrompt = isTimeline ? TIMELINE_VOICEOVER_SYSTEM_PROMPT : VOICEOVER_SYSTEM_PROMPT;
  const userPrompt   = isTimeline
    ? buildTimelineVoiceoverUserPrompt(script as VideoScriptTimeline, contextStr)
    : buildVoiceoverUserPrompt(script as VideoScript, contextStr);

  const completion = await openai.chat.completions.create({
    model: VOICEOVER_SCRIPT_MODEL,
    // Lower temperature anchors facts/dates and reduces fabricated stats.
    temperature: 0.4,
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
