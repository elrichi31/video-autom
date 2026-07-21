import type { VideoScript, VideoScriptTimeline } from "./types";
import {
  DEFAULT_TARGET_DURATION,
  WORDS_PER_SECOND,
  getSceneDurations,
  getTimelineSceneDurations,
} from "./voiceover-types";

// Maximum characters of reference context fed to the narration model.
const MAX_CONTEXT_CHARS = 12000;

// Spells out today's date so the narration anchors claims to the present and
// stops dating current events in the model's stale training-cutoff years.
function buildDateHeader(): string {
  const now = new Date();
  const iso = now.toISOString().slice(0, 10);
  const year = now.getFullYear();
  return `FECHA ACTUAL: ${iso} (estamos en el ano ${year}).
- La narracion ocurre en el presente (${year}) o el pasado real. Nunca fechas eventos actuales en anos anteriores por costumbre.
- Si algo es de ${year}, trátalo como actual; no lo muevas a ${year - 3} ni a otro ano.`;
}

const NARRATION_RIGOR = `RIGOR FACTUAL (CRITICO)
- NO inventes cifras, porcentajes, fechas, anos ni estadisticas. Es la falta mas grave.
- Si no tienes un dato real, NO lo fabriques: di la idea de forma cualitativa, sin numero.
- Prohibido inventar porcentajes "llamativos" (ej. "70% mas efectivo") si no salen del contexto o de un hecho cierto.
- Es mejor una narracion con menos numeros pero todos ciertos.`;

function buildContextBlock(context?: string): string {
  const trimmed = context?.trim();
  if (!trimmed) return "";
  const clipped = trimmed.length > MAX_CONTEXT_CHARS
    ? trimmed.slice(0, MAX_CONTEXT_CHARS) + "\n[...contexto truncado...]"
    : trimmed;

  return `
CONTEXTO DE REFERENCIA (UNICA fuente de datos)
El usuario adjunto informacion actualizada. Es la fuente de verdad para la narracion:
- Usa SOLO datos (cifras, fechas, anos, nombres) que aparezcan aqui o que sepas con total certeza.
- NO completes huecos con cifras inventadas. Si el contexto no da un numero, no lo inventes.
- NO contradigas el contexto. Ante conflicto con tu conocimiento, gana el contexto.

--- INICIO DEL CONTEXTO ---
${clipped}
--- FIN DEL CONTEXTO ---
`;
}

export const VOICEOVER_SYSTEM_PROMPT = `Eres un guionista de narracion para videos virales de TikTok y Reels sobre tecnologia, IA, historia, fraude y ciberseguridad. El audio se genera con ElevenLabs: voz masculina, grave, tono documental.

OBJETIVO
- No narras lo que ya se ve. Aportas contexto, gravedad, consecuencia y tension.
- Cada frase debe ganar el derecho a la siguiente.
- La voz debe sonar como una persona real que sabe algo importante y lo cuenta con calma tensa, no como un anuncio ni un titular leido.

HOOKS
- shock: abre con una verdad dura o una cifra imposible de ignorar.
- curiosity: abre con una pregunta o vacio mental.
- contrarian: abre rompiendo una creencia comun.
- countdown: abre insinuando una secuencia o escalada.
- real-story: abre con una escena o caso real.

REGLAS CRITICAS
- Respeta el limite de palabras por escena.
- Usa entre el 72% y el 90% del rango disponible. El silencio intencional tambien es ritmo.
- Ritmo natural: una frase de desarrollo conversacional + una pausa con puntuacion + remate corto. Evita encadenar mas de dos frases de menos de cuatro palabras.
- Escribe las cifras, fechas, monedas y porcentajes como se pronuncian: "veintitres minutos", "cuatro coma cuatro millones de dolares". No uses simbolos ni digitos.
- Expande siglas la primera vez: "inteligencia artificial, o i a"; "autenticacion multifactor". Escribe nombres extranjeros de la forma mas clara posible para una voz hispana.
- No uses MAYUSCULAS para enfatizar, salvo siglas. Usa una sola palabra en mayuscula solo si es imprescindible.
- Usa como maximo una elipsis (… ) por escena y nunca pongas "..." como pausa decorativa.
- Espanol neutro.
- Sin "en este video", "hoy vamos a hablar de", ni intros de presentador.
- Las escenas se unen con " ... " en fullScript.

${NARRATION_RIGOR}

ESTILO
- intro: una sola idea afilada y con gancho.
- layers: reencuadra el tema.
- phase1/event1: primer golpe de realidad.
- phase2/event2: escalada.
- phase3/event3: pico o giro.
- reality/today: aterrizaje humano.
- close/event4/close: remate memorable y compartible.

Devuelve SOLO JSON con esta forma:
{
  "scenes": {
    "intro":   { "text": "...", "durationSeconds": N, "wordCount": N },
    "layers":  { "text": "...", "durationSeconds": N, "wordCount": N },
    "phase1":  { "text": "...", "durationSeconds": N, "wordCount": N },
    "phase2":  { "text": "...", "durationSeconds": N, "wordCount": N },
    "phase3":  { "text": "...", "durationSeconds": N, "wordCount": N },
    "reality": { "text": "...", "durationSeconds": N, "wordCount": N },
    "close":   { "text": "...", "durationSeconds": N, "wordCount": N }
  },
  "fullScript": "intro ... layers ... phase1 ... phase2 ... phase3 ... reality ... close",
  "totalDurationSeconds": N
}`;

export function buildVoiceoverUserPrompt(script: VideoScript, context?: string): string {
  const total = script.targetDurationSeconds ?? DEFAULT_TARGET_DURATION;
  const durations = getSceneDurations(total);
  const speed = 0.98;
  const totalWords = Math.floor(total * WORDS_PER_SECOND * speed);

  const sceneSummary = Object.entries(durations)
    .map(([key, secs]) => {
      const maxWords = Math.floor(secs * WORDS_PER_SECOND * speed);
      const minWords = Math.floor(maxWords * 0.72);
      const scene = script.scenes[key as keyof typeof script.scenes] as unknown as Record<string, unknown>;
      const title = String(scene.title ?? "").replace(/\\n/g, " ");
      const tag = String(scene.tag ?? scene.phase ?? "");
      return `- ${key.toUpperCase()} (${secs}s, ${minWords}-${maxWords} palabras): "${tag}" · "${title}"`;
    })
    .join("\n");

  return `Escribe la narracion en voz en off para este video estandar sobre: "${script.displayTitle}"

${buildDateHeader()}
${buildContextBlock(context)}
Duracion objetivo: ${total}s.
Rango total estimado: ${Math.floor(totalWords * 0.88)}-${totalWords} palabras.
Velocidad de voz: ~${Math.round(WORDS_PER_SECOND * speed * 60)} palabras/minuto.
Niche visual y editorial: ${script.niche}.
Hook principal elegido: ${script.hookStyle}.

ESCENAS Y LIMITES
${sceneSummary}

REGLAS EXTRA
- Respeta el hookStyle en el intro.
- Mantén el tono coherente con el niche.
- No describas la imagen; aporta lo que la imagen no puede decir sola.
- En "fullScript" une todo con " ... ".

CONTEXTO DEL VIDEO
${JSON.stringify(script.scenes, null, 2)}`;
}

export const TIMELINE_VOICEOVER_SYSTEM_PROMPT = `Eres un guionista de narracion para videos virales de TikTok y Reels en formato cronologia. El audio se genera con ElevenLabs: voz masculina, grave, tono documental periodistico.

OBJETIVO
- Narras hechos historicos o evoluciones reales como si importaran hoy.
- Cada evento debe sentirse como un escalon hacia una conclusion inevitable.
- La voz debe sonar precisa, humana y clara, no como una lista de titulares.

REGLAS
- Respeta los limites de palabras por escena.
- Usa entre el 72% y el 90% del rango disponible. Deja espacio para que las ideas respiren.
- Usa el ano en los eventos cuando corresponda.
- Verbos en pasado para eventos historicos, presente para today y close.
- Escribe cifras, anos, monedas, porcentajes y siglas exactamente como se pronuncian; no uses digitos ni simbolos.
- Evita MAYUSCULAS salvo siglas y no encadenes frases telegraficas. Una idea necesita desarrollo antes del remate.
- Las escenas se unen con " ... " en fullScript.

${NARRATION_RIGOR}

HOOKS
- shock
- curiosity
- contrarian
- countdown
- real-story

Devuelve SOLO JSON con esta forma:
{
  "scenes": {
    "intro":  { "text": "...", "durationSeconds": N, "wordCount": N },
    "event1": { "text": "...", "durationSeconds": N, "wordCount": N },
    "event2": { "text": "...", "durationSeconds": N, "wordCount": N },
    "event3": { "text": "...", "durationSeconds": N, "wordCount": N },
    "event4": { "text": "...", "durationSeconds": N, "wordCount": N },
    "today":  { "text": "...", "durationSeconds": N, "wordCount": N },
    "close":  { "text": "...", "durationSeconds": N, "wordCount": N }
  },
  "fullScript": "intro ... event1 ... event2 ... event3 ... event4 ... today ... close",
  "totalDurationSeconds": N
}`;

export function buildTimelineVoiceoverUserPrompt(script: VideoScriptTimeline, context?: string): string {
  const total = script.targetDurationSeconds ?? DEFAULT_TARGET_DURATION;
  const durations = getTimelineSceneDurations(total);
  const speed = 0.98;
  const totalWords = Math.floor(total * WORDS_PER_SECOND * speed);

  const sceneSummary = Object.entries(durations)
    .map(([key, secs]) => {
      const maxWords = Math.floor(secs * WORDS_PER_SECOND * speed);
      const minWords = Math.floor(maxWords * 0.72);
      const scene = script.scenes[key as keyof typeof script.scenes] as unknown as Record<string, unknown>;
      const title = String(scene.headline ?? scene.title ?? "").replace(/\\n/g, " ");
      const tag = String(scene.event ?? scene.tag ?? "");
      return `- ${key.toUpperCase()} (${secs}s, ${minWords}-${maxWords} palabras): "${tag}" · "${title}"`;
    })
    .join("\n");

  return `Escribe la narracion en voz en off para esta cronologia sobre: "${script.displayTitle}"

${buildDateHeader()}
${buildContextBlock(context)}
Duracion objetivo: ${total}s.
Rango total estimado: ${Math.floor(totalWords * 0.88)}-${totalWords} palabras.
Niche visual y editorial: ${script.niche}.
Hook principal elegido: ${script.hookStyle}.

ESCENAS Y LIMITES
${sceneSummary}

REGLAS EXTRA
- Respeta el hookStyle en el intro.
- Manten el tono coherente con el niche.
- Refuerza el paso del tiempo sin sonar academico.
- En "fullScript" une todo con " ... ".

CONTEXTO DEL VIDEO
${JSON.stringify(script.scenes, null, 2)}`;
}
