import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT, buildUserPrompt, TIMELINE_SYSTEM_PROMPT, buildTimelineUserPrompt } from "@/lib/script-prompt";
import type { AnyVideoScript } from "@/lib/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { topic, targetDurationSeconds, compositionType = "standard" } = await req.json();

  if (!topic?.trim()) {
    return NextResponse.json({ error: "El tema es requerido" }, { status: 400 });
  }

  const isTimeline = compositionType === "timeline";
  const systemPrompt = isTimeline ? TIMELINE_SYSTEM_PROMPT : SYSTEM_PROMPT;
  const userPrompt   = isTimeline ? buildTimelineUserPrompt(topic) : buildUserPrompt(topic);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
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

  return NextResponse.json({ script });
}
