import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  SYSTEM_PROMPT,
  TIMELINE_SYSTEM_PROMPT,
  buildTimelineUserPrompt,
  buildUserPrompt,
  normalizeHookStyle,
  normalizeNiche,
} from "@/lib/script-prompt";
import type { AnyVideoScript } from "@/lib/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SCRIPT_MODEL = process.env.OPENAI_SCRIPT_MODEL ?? "gpt-4o-mini";

export async function POST(req: NextRequest) {
  const { topic, targetDurationSeconds, compositionType = "standard", context } = await req.json();

  if (!topic?.trim()) {
    return NextResponse.json({ error: "El tema es requerido" }, { status: 400 });
  }

  const contextStr = typeof context === "string" ? context : undefined;
  const isTimeline = compositionType === "timeline";
  const systemPrompt = isTimeline ? TIMELINE_SYSTEM_PROMPT : SYSTEM_PROMPT;
  const durationSecs = typeof targetDurationSeconds === "number" ? targetDurationSeconds : undefined;
  const userPrompt   = isTimeline
    ? buildTimelineUserPrompt(topic, contextStr, durationSecs)
    : buildUserPrompt(topic, contextStr, durationSecs);

  const completion = await openai.chat.completions.create({
    model: SCRIPT_MODEL,
    // Lower temperature keeps the writing creative but anchors facts/numbers,
    // reducing fabricated stats and wrong dates.
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt },
    ],
  });

  const raw = completion.choices[0].message.content ?? "{}";

  let script: AnyVideoScript;
  try {
    script = JSON.parse(raw) as AnyVideoScript;
  } catch {
    return NextResponse.json({ error: "GPT-4o devolvió JSON inválido", raw }, { status: 500 });
  }

  script.targetDurationSeconds = typeof targetDurationSeconds === "number" ? targetDurationSeconds : 45;
  script.niche = normalizeNiche(script.niche, topic);
  script.hookStyle = normalizeHookStyle(script.hookStyle);

  if (isTimeline) {
    script.compositionType = "timeline";
  }

  return NextResponse.json({ script });
}
