import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { AnyVideoScript, GeneratedImage } from "@/lib/types";
import { getSceneKeys } from "@/lib/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { script, sceneKey }: { script: AnyVideoScript; sceneKey?: string } = await req.json();
  const SCENE_KEYS = getSceneKeys(script);

  const scenesToGenerate = sceneKey ? [sceneKey] : SCENE_KEYS;
  const results: GeneratedImage[] = [];
  const errors: { sceneKey: string; error: string }[] = [];

  for (const key of scenesToGenerate) {
    const prompt = (script.imagePrompts as Record<string, string>)[key];
    if (!prompt) continue;

    try {
      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1536",
        quality: "medium",
        n: 1,
      });

      const b64 = response.data?.[0]?.b64_json;
      if (!b64) throw new Error("Sin datos de imagen en la respuesta");

      results.push({
        sceneKey: key,
        filename: `${script.slug}-${key}.png`,
        b64,
      });
    } catch (err) {
      errors.push({ sceneKey: key, error: String(err) });
    }
  }

  return NextResponse.json({ results, errors });
}
