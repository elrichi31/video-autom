import type { VideoScript } from "./types";
import { SCENE_DURATIONS, WORDS_PER_SECOND } from "./voiceover-types";

export const VOICEOVER_SYSTEM_PROMPT = `Eres un guionista de voz en off para videos cortos de TikTok/Reels sobre tecnología y ciberseguridad.

Tu trabajo es escribir narración que se SINCRONICE PERFECTAMENTE con el video. Cada escena tiene una duración exacta en segundos y un límite de palabras que NO puedes superar.

REGLAS CRÍTICAS:
- Español neutro. Sin regionalismos.
- Tono: serio, dramático, periodístico. Como una narración de documental.
- La voz COMPLEMENTA lo que se ve en pantalla, no lo repite.
- Respeta el límite de palabras de cada escena — es matemático: velocidad de voz × tiempo.
- Las pausas naturales (comas, puntos) cuentan como tiempo. Sé conciso.
- El texto debe fluir como una sola narrativa coherente, no como partes desconectadas.
- NO uses signos raros, emojis, ni texto entre corchetes.
- Las transiciones entre escenas deben sonar naturales.

Devuelve SOLO el JSON, sin markdown, sin explicaciones.

ESTRUCTURA EXACTA:
{
  "scenes": {
    "intro":   { "text": "...", "durationSeconds": 3,  "wordCount": N },
    "layers":  { "text": "...", "durationSeconds": 6,  "wordCount": N },
    "phase1":  { "text": "...", "durationSeconds": 7,  "wordCount": N },
    "phase2":  { "text": "...", "durationSeconds": 7,  "wordCount": N },
    "phase3":  { "text": "...", "durationSeconds": 7,  "wordCount": N },
    "reality": { "text": "...", "durationSeconds": 7,  "wordCount": N },
    "close":   { "text": "...", "durationSeconds": 4,  "wordCount": N }
  },
  "fullScript": "texto completo concatenado de todas las escenas",
  "totalDurationSeconds": 41
}`;

export function buildVoiceoverUserPrompt(script: VideoScript): string {
  const sceneSummary = Object.entries(SCENE_DURATIONS)
    .map(([key, secs]) => {
      const maxWords = Math.floor(secs * WORDS_PER_SECOND);
      const s = script.scenes[key as keyof typeof script.scenes] as unknown as Record<string, unknown>;
      const title = String(s.title ?? "").replace(/\\n/g, " ");
      const tag = String(s.tag ?? "");
      return `- ${key.toUpperCase()} (${secs}s, máx ${maxWords} palabras): "${tag}" · "${title}"`;
    })
    .join("\n");

  return `Escribe la narración en voz en off para este video sobre: "${script.displayTitle}"

ESCENAS Y LÍMITES DE TIEMPO:
${sceneSummary}

CONTENIDO DEL GUIÓN (para contexto, no repetir):
${JSON.stringify(script.scenes, null, 2)}`;
}
