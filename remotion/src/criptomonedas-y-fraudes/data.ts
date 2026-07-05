export type AccentPair = [string, string];

export const CRIPTOMONEDAS_Y_FRAUDES_FPS = 30;

// Target duration: 60s — scene durations scaled proportionally
export const CRIPTOMONEDAS_Y_FRAUDES_DURATIONS = {
  intro:   4   * CRIPTOMONEDAS_Y_FRAUDES_FPS,
  layers:  9  * CRIPTOMONEDAS_Y_FRAUDES_FPS,
  phase1:  10  * CRIPTOMONEDAS_Y_FRAUDES_FPS,
  phase2:  11  * CRIPTOMONEDAS_Y_FRAUDES_FPS,
  phase3:  10  * CRIPTOMONEDAS_Y_FRAUDES_FPS,
  reality: 10 * CRIPTOMONEDAS_Y_FRAUDES_FPS,
  close:   6   * CRIPTOMONEDAS_Y_FRAUDES_FPS,
} as const;

export const CRIPTOMONEDAS_Y_FRAUDES_TOTAL_DURATION =
  CRIPTOMONEDAS_Y_FRAUDES_DURATIONS.intro +
  CRIPTOMONEDAS_Y_FRAUDES_DURATIONS.layers +
  CRIPTOMONEDAS_Y_FRAUDES_DURATIONS.phase1 +
  CRIPTOMONEDAS_Y_FRAUDES_DURATIONS.phase2 +
  CRIPTOMONEDAS_Y_FRAUDES_DURATIONS.phase3 +
  CRIPTOMONEDAS_Y_FRAUDES_DURATIONS.reality +
  CRIPTOMONEDAS_Y_FRAUDES_DURATIONS.close;

export type VideoNiche = "cybersecurity" | "ai" | "history" | "fraud" | "news" | "general";
export type HookStyle = "shock" | "curiosity" | "contrarian" | "countdown" | "real-story";

export const CRIPTOMONEDAS_Y_FRAUDES_NICHE: VideoNiche = "general";

export const CRIPTOMONEDAS_Y_FRAUDES_HOOK_STYLE: HookStyle = "curiosity";

export const CRIPTOMONEDAS_Y_FRAUDES_ACCENTS = {
  intro:   ["#FF0000","#000000"] as AccentPair,
  layers:  ["#008000","#000000"] as AccentPair,
  phase1:  ["#FF4500","#000000"] as AccentPair,
  phase2:  ["#FF6347","#000000"] as AccentPair,
  phase3:  ["#FF1493","#000000"] as AccentPair,
  reality: ["#FFFFFF","#000000"] as AccentPair,
  close:   ["#FFD700","#000000"] as AccentPair,
};

export const CRIPTOMONEDAS_Y_FRAUDES_INTRO = {
  "tag": "FRAUDE DIGITAL",
  "title": "CRIPTO-\nCAOS",
  "subtitle": "la verdad detrás del ascenso de las criptomonedas"
};

export const CRIPTOMONEDAS_Y_FRAUDES_LAYERS = {
  "tag": "DESMONTANDO MITOS",
  "terminal": [
    "> mercado.global     = $3 billones en 2021",
    "> fraude.criptos     = $14 mil millones en 2021",
    "> estafas.piramide   = 40% de los fraudes",
    "> dato.revelador     = 70% víctimas no lo denuncian"
  ],
  "definition": "Las criptomonedas prometen riqueza,\npero esconden un lado oscuro.\nEl fraude es más común de lo que crees.",
  "detail": "En 2021, se reportaron $14 mil millones en fraudes de criptomonedas."
};

export const CRIPTOMONEDAS_Y_FRAUDES_PHASE1 = {
  "phase": "TACTICAS DE ENGAÑO",
  "timestamp": "ESTAFAS COMUNES",
  "title": "Promesas\nVacías",
  "narrative": "Los estafadores prometen retornos rápidos y garantizados. Usan tácticas psicológicas para atraer a inversores desprevenidos.",
  "detail": "Casi un 40% de los fraudes de criptomonedas son esquemas piramidales.",
  "indicator": [
    "40% esquemas piramidales",
    "$14 mil millones perdidos"
  ]
};

export const CRIPTOMONEDAS_Y_FRAUDES_PHASE2 = {
  "phase": "MÁQUINA DEL MIEDO",
  "timestamp": "PRESIÓN PSICOLÓGICA",
  "title": "El Miedo\nVende",
  "narrative": "Muchos fraudes se aprovechan del miedo de perder la 'próxima gran oportunidad'. Los estafadores manipulan emociones para cerrar el trato.",
  "detail": "El 60% de las víctimas reportan presión emocional para invertir.",
  "indicator": [
    "60% presión emocional",
    "70% no lo denuncian"
  ]
};

export const CRIPTOMONEDAS_Y_FRAUDES_PHASE3 = {
  "phase": "EL GIRO OCULTO",
  "timestamp": "LO QUE NO VES",
  "title": "La Verdad\nSe Esconde",
  "narrative": "A pesar de las pérdidas, un 70% de las víctimas nunca denuncia el fraude por vergüenza o miedo. Esto perpetúa el ciclo.",
  "detail": "El 70% de las víctimas no reportan los fraudes a las autoridades.",
  "indicator": [
    "70% no denuncia",
    "Culpa y vergüenza"
  ]
};

export const CRIPTOMONEDAS_Y_FRAUDES_REALITY = {
  "tag": "REALIDAD · CONTEXTO",
  "title": "Protege tu\nInversión\ncon Conocimiento",
  "actions": [
    "Investiga antes de invertir",
    "Desconfía de promesas exageradas",
    "Consulta expertos en criptomonedas",
    "Reporta fraudes a las autoridades"
  ]
};

export const CRIPTOMONEDAS_Y_FRAUDES_CLOSE = {
  "tag": "CONCLUSIÓN",
  "title": "El conocimiento\nes tu\nmayor defensa",
  "subtitle": "Comparte para que otros no caigan en la trampa"
};
