export type AccentPair = [string, string];

export const DEEPFAKES_FPS = 30;

export const DEEPFAKES_DURATIONS = {
  intro:   3 * DEEPFAKES_FPS,
  layers:  6 * DEEPFAKES_FPS,
  phase1:  7 * DEEPFAKES_FPS,
  phase2:  7 * DEEPFAKES_FPS,
  phase3:  7 * DEEPFAKES_FPS,
  reality: 7 * DEEPFAKES_FPS,
  close:   4 * DEEPFAKES_FPS,
} as const;

export const DEEPFAKES_TOTAL_DURATION =
  DEEPFAKES_DURATIONS.intro +
  DEEPFAKES_DURATIONS.layers +
  DEEPFAKES_DURATIONS.phase1 +
  DEEPFAKES_DURATIONS.phase2 +
  DEEPFAKES_DURATIONS.phase3 +
  DEEPFAKES_DURATIONS.reality +
  DEEPFAKES_DURATIONS.close;

export const DEEPFAKES_ACCENTS = {
  intro:   ["#CC00FF", "#7B00FF"] as AccentPair,
  layers:  ["#9B00E8", "#5A00CC"] as AccentPair,
  phase1:  ["#FF00AA", "#CC0088"] as AccentPair,
  phase2:  ["#FF3366", "#CC0033"] as AccentPair,
  phase3:  ["#FF6600", "#CC4400"] as AccentPair,
  reality: ["#00CCFF", "#0088CC"] as AccentPair,
  close:   ["#CC00FF", "#7B00FF"] as AccentPair,
};

export const DEEPFAKES_INTRO = {
  "tag": "IDENTIDAD",
  "title": "TU CARA\nYA NO ES\nTUYA",
  "subtitle": "la IA que destruye la realidad"
};

export const DEEPFAKES_LAYERS = {
  "tag": "CÓMO FUNCIONA",
  "terminal": [
    "> tecnología.base  = GAN (redes generativas)",
    "> tiempo.creación  = menos de 60 segundos",
    "> detección.humana = falla el 71% de las veces",
    "> crecimiento.2023 = +550% vs año anterior"
  ],
  "definition": "Una red neuronal aprende\ntu cara — y puede ponerla\nen cualquier cuerpo o voz",
  "detail": "En 2017 eran un experimento. En 2024 se usaron para robar 25 millones de dólares en una sola llamada."
};

export const DEEPFAKES_PHASE1 = {
  "phase": "ORIGEN",
  "timestamp": "EL INICIO",
  "title": "De Reddit\nal Crimen",
  "narrative": "Empezó como entretenimiento en foros. Hoy es una industria del fraude valorada en miles de millones.",
  "detail": "En 2023 se detectaron más de 96.000 deepfakes en circulación — un 550% más que el año anterior.",
  "indicator": [
    "+96.000 deepfakes en 2023",
    "550% de aumento en un año"
  ]
};

export const DEEPFAKES_PHASE2 = {
  "phase": "FRAUDE",
  "timestamp": "EL ROBO",
  "title": "25 Millones\nEn Una\nLlamada",
  "narrative": "Hong Kong, 2024. Un empleado transfirió 25 millones de dólares tras una videollamada con su \"CFO\". Era un deepfake.",
  "detail": "El 71% de las personas no distingue un deepfake de un video real en una primera visualización.",
  "indicator": [
    "$25M robados · Hong Kong 2024",
    "71% de humanos incapaces de detectarlo"
  ]
};

export const DEEPFAKES_PHASE3 = {
  "phase": "ELECCIONES",
  "timestamp": "LA AMENAZA",
  "title": "Democracia\nen Jaque",
  "narrative": "En el ciclo electoral de 2024, más de 500.000 deepfakes políticos circularon en redes. Candidatos diciendo lo que nunca dijeron.",
  "detail": "El 96% de los deepfakes detectados siguen siendo contenido sexual no consentido — mayormente mujeres.",
  "indicator": [
    "+500.000 deepfakes políticos · 2024",
    "96% de víctimas: mujeres"
  ]
};

export const DEEPFAKES_REALITY = {
  "tag": "REALIDAD · AHORA",
  "title": "Ver ya no\nes creer.\nEsa era\nla regla.",
  "actions": [
    "Verifica con una segunda fuente antes de compartir",
    "Busca micromovimientos: parpadeo, bordes de cara",
    "Usa herramientas: Deepware, Microsoft Video Authenticator",
    "Desconfía de cualquier urgencia en videollamada"
  ]
};

export const DEEPFAKES_CLOSE = {
  "tag": "DEEPFAKES · CONCLUSIÓN",
  "title": "La mentira\nperfecta ya\nexiste",
  "subtitle": "La pregunta no es si te engañarán. Es cuándo."
};
