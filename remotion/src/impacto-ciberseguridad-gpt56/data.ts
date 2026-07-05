export type AccentPair = [string, string];

export const IMPACTO_CIBERSEGURIDAD_GPT56_FPS = 30;

// Target duration: 60s — scene durations scaled proportionally
export const IMPACTO_CIBERSEGURIDAD_GPT56_DURATIONS = {
  intro:   4   * IMPACTO_CIBERSEGURIDAD_GPT56_FPS,
  layers:  9  * IMPACTO_CIBERSEGURIDAD_GPT56_FPS,
  phase1:  10  * IMPACTO_CIBERSEGURIDAD_GPT56_FPS,
  phase2:  11  * IMPACTO_CIBERSEGURIDAD_GPT56_FPS,
  phase3:  10  * IMPACTO_CIBERSEGURIDAD_GPT56_FPS,
  reality: 10 * IMPACTO_CIBERSEGURIDAD_GPT56_FPS,
  close:   6   * IMPACTO_CIBERSEGURIDAD_GPT56_FPS,
} as const;

export const IMPACTO_CIBERSEGURIDAD_GPT56_TOTAL_DURATION =
  IMPACTO_CIBERSEGURIDAD_GPT56_DURATIONS.intro +
  IMPACTO_CIBERSEGURIDAD_GPT56_DURATIONS.layers +
  IMPACTO_CIBERSEGURIDAD_GPT56_DURATIONS.phase1 +
  IMPACTO_CIBERSEGURIDAD_GPT56_DURATIONS.phase2 +
  IMPACTO_CIBERSEGURIDAD_GPT56_DURATIONS.phase3 +
  IMPACTO_CIBERSEGURIDAD_GPT56_DURATIONS.reality +
  IMPACTO_CIBERSEGURIDAD_GPT56_DURATIONS.close;

export type VideoNiche = "cybersecurity" | "ai" | "history" | "fraud" | "news" | "general";
export type HookStyle = "shock" | "curiosity" | "contrarian" | "countdown" | "real-story";

export const IMPACTO_CIBERSEGURIDAD_GPT56_NICHE: VideoNiche = "cybersecurity";

export const IMPACTO_CIBERSEGURIDAD_GPT56_HOOK_STYLE: HookStyle = "shock";

export const IMPACTO_CIBERSEGURIDAD_GPT56_ACCENTS = {
  intro:   ["#FF0000","#000000"] as AccentPair,
  layers:  ["#FF4500","#000000"] as AccentPair,
  phase1:  ["#FF6347","#000000"] as AccentPair,
  phase2:  ["#FF7F50","#000000"] as AccentPair,
  phase3:  ["#FF8C00","#000000"] as AccentPair,
  reality: ["#FF4500","#000000"] as AccentPair,
  close:   ["#FF0000","#FFFFFF"] as AccentPair,
};

export const IMPACTO_CIBERSEGURIDAD_GPT56_INTRO = {
  "tag": "ALERTA",
  "title": "GPT-5.6\nCAMBIA JUEGO",
  "subtitle": "¿Puede la IA salvarnos de los hackers?"
};

export const IMPACTO_CIBERSEGURIDAD_GPT56_LAYERS = {
  "tag": "CONTEXTUALIZACIÓN",
  "terminal": [
    "> OpenAI lanza GPT-5.6 Sol, Terra y Luna",
    "> Sol es el modelo más potente para ciberseguridad",
    "> Acceso limitado a socios de confianza",
    "> Salvaguardas robustas implementadas"
  ],
  "definition": "OpenAI ha revelado una nueva familia de modelos.\nGPT-5.6 promete revolucionar la ciberseguridad.\nPero, ¿a qué costo?",
  "detail": "El anuncio fue realizado el 26 de junio de 2026."
};

export const IMPACTO_CIBERSEGURIDAD_GPT56_PHASE1 = {
  "phase": "MODELO SOL",
  "timestamp": "MODELO PRINCIPAL",
  "title": "GPT-5.6 SOL\nLA FUERZA DETRÁS",
  "narrative": "Sol mejora la investigación de vulnerabilidades y la revisión de código.\nEs el modelo más capaz para enfrentar amenazas cibernéticas.",
  "detail": "OpenAI dedicó más de 700,000 horas de GPU a fortalecer salvaguardas.",
  "indicator": [
    "700,000 horas de GPU dedicadas",
    "Modelo más fuerte en ciberseguridad"
  ]
};

export const IMPACTO_CIBERSEGURIDAD_GPT56_PHASE2 = {
  "phase": "RIESGOS POTENCIALES",
  "timestamp": "DOBLE USO",
  "title": "LA OTRA CARA\nDE LA MONEDA",
  "narrative": "Aunque Sol ayuda a defensores, también puede ser mal utilizado.\nEl acceso restringido responde a preocupaciones de seguridad.",
  "detail": "El acceso limitado fue coordinado con el gobierno de EE.UU.",
  "indicator": [
    "Acceso limitado a socios de confianza",
    "Preocupaciones del gobierno de EE.UU."
  ]
};

export const IMPACTO_CIBERSEGURIDAD_GPT56_PHASE3 = {
  "phase": "IMPACTO EN SEGURIDAD",
  "timestamp": "FUTURO INCIERTO",
  "title": "¿UN MUNDO MÁS SEGURO?\nO MÁS RÁPIDO PARA LOS HACKERS",
  "narrative": "El potencial de Sol para transformar la ciberseguridad es inmenso.\nPero la pregunta persiste: ¿será suficiente?",
  "detail": "Sol no produce exploits completos bajo condiciones probadas.",
  "indicator": [
    "No produce exploits completos",
    "Riesgo de mal uso sigue presente"
  ]
};

export const IMPACTO_CIBERSEGURIDAD_GPT56_REALITY = {
  "tag": "REALIDAD · CONTEXTO",
  "title": "La ciberseguridad\nfrente a un dilema",
  "actions": [
    "Investiga sobre las capacidades de GPT-5.6",
    "Considera cómo usar la IA de forma responsable",
    "Mantente informado sobre las regulaciones de IA",
    "Participa en debates sobre ética en tecnología"
  ]
};

export const IMPACTO_CIBERSEGURIDAD_GPT56_CLOSE = {
  "tag": "REFLEXIÓN FINAL",
  "title": "¿La IA\nnos protegerá\nO nos hará más vulnerables?",
  "subtitle": "La respuesta está en nuestras manos."
};
