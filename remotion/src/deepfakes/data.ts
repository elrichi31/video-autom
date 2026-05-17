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
  intro:   ["#FF5733","#C70039"] as AccentPair,
  layers:  ["#900C3F","#581845"] as AccentPair,
  phase1:  ["#FFC300","#FF5733"] as AccentPair,
  phase2:  ["#DAF7A6","#FFC300"] as AccentPair,
  phase3:  ["#C70039","#900C3F"] as AccentPair,
  reality: ["#581845","#DAF7A6"] as AccentPair,
  close:   ["#900C3F","#FF5733"] as AccentPair,
};

export const DEEPFAKES_INTRO = {
  "tag": "ALERTA",
  "title": "EL PELIGRO\nDE LOS\nDEEPFAKES",
  "subtitle": "la tecnología que engaña"
};

export const DEEPFAKES_LAYERS = {
  "tag": "CAPAS",
  "terminal": [
    "> deepfake.origen = 2017",
    "> tecnología.base = IA",
    "> riesgo          = alto",
    "> impacto.global  = CRECIENTE"
  ],
  "definition": "Deepfakes son videos\ndigitalmente alterados\npor inteligencia artificial",
  "detail": "El término 'deepfake' proviene de 'deep learning' y 'fake'."
};

export const DEEPFAKES_PHASE1 = {
  "phase": "FASE 01",
  "timestamp": "INICIO",
  "title": "Creación\nInicial",
  "narrative": "Los deepfakes comenzaron como una curiosidad tecnológica, generando rostros falsos.",
  "detail": "En 2019, se detectaron más de 14,000 videos deepfake en línea.",
  "indicator": [
    "14,000 videos",
    "2019"
  ]
};

export const DEEPFAKES_PHASE2 = {
  "phase": "FASE 02",
  "timestamp": "EVOLUCIÓN",
  "title": "Avances\nTecnológicos",
  "narrative": "La tecnología mejoró, permitiendo reemplazar rostros en videos con creciente realismo.",
  "detail": "Deepfakes ahora se usan para manipular discursos políticos.",
  "indicator": [
    "Manipulación política",
    "Realismo avanzado"
  ]
};

export const DEEPFAKES_PHASE3 = {
  "phase": "FASE 03",
  "timestamp": "AMENAZA",
  "title": "Riesgos\nReales",
  "narrative": "Los deepfakes representan un peligro para la veracidad de la información y la seguridad personal.",
  "detail": "En 2021, el 96% de los deepfakes detectados eran pornográficos.",
  "indicator": [
    "96% pornografía",
    "Seguridad en riesgo"
  ]
};

export const DEEPFAKES_REALITY = {
  "tag": "REALIDAD",
  "title": "Aunque la\ntecnología mejora,\ndepende de nosotros\ndetectar la verdad",
  "actions": [
    "Verifica fuentes de información",
    "Cuestiona videos sospechosos",
    "Utiliza herramientas de detección",
    "No confíes ciegamente en videos"
  ]
};

export const DEEPFAKES_CLOSE = {
  "tag": "DEEPFAKES · CONCLUSIÓN",
  "title": "El futuro está\nen nuestras manos,\nno en los algoritmos",
  "subtitle": "La responsabilidad es de todos. Protejamos la verdad."
};
