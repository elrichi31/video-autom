import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { VideoScript } from "@/lib/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { script }: { script: VideoScript } = await req.json();

  const prompt = `Eres un experto en crecimiento de contenido en TikTok e Instagram Reels en español.
Genera el texto para publicar este video en TikTok/Reels sobre: "${script.displayTitle}"

REGLAS:
- Título: máximo 80 caracteres, con gancho fuerte, puede tener 1-2 emojis
- Descripción: 2-3 oraciones directas que generen curiosidad (max 300 chars). Sin emojis excesivos.
- Hashtags: 15 hashtags relevantes en español e inglés, mezcla nichos grandes y pequeños

Devuelve SOLO este JSON:
{
  "title": "...",
  "description": "...",
  "hashtags": ["#tag1", "#tag2", ...]
}

Contexto del video:
Intro: "${(script.scenes.intro as { subtitle?: string }).subtitle ?? (script.scenes.intro as { tag?: string }).tag ?? ""}"
Cierre: "${(script.scenes.close as { subtitle?: string }).subtitle ?? ""}"`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.8,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const data = JSON.parse(completion.choices[0].message.content ?? "{}");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Error generando caption" }, { status: 500 });
  }
}
