import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/script-prompt";
import type { VideoScript } from "@/lib/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { topic } = await req.json();

  if (!topic?.trim()) {
    return NextResponse.json({ error: "El tema es requerido" }, { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user",   content: buildUserPrompt(topic) },
    ],
  });

  const raw = completion.choices[0].message.content ?? "{}";

  let script: VideoScript;
  try {
    script = JSON.parse(raw) as VideoScript;
  } catch {
    return NextResponse.json({ error: "GPT-4o devolvió JSON inválido", raw }, { status: 500 });
  }

  return NextResponse.json({ script });
}
