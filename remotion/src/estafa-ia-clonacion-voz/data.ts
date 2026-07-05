export type AccentPair = [string, string];

export const ESTAFA_IA_CLONACION_VOZ_FPS = 30;

// Target duration: 60s — scene durations scaled proportionally
export const ESTAFA_IA_CLONACION_VOZ_DURATIONS = {
  intro:   4   * ESTAFA_IA_CLONACION_VOZ_FPS,
  layers:  9  * ESTAFA_IA_CLONACION_VOZ_FPS,
  phase1:  10  * ESTAFA_IA_CLONACION_VOZ_FPS,
  phase2:  11  * ESTAFA_IA_CLONACION_VOZ_FPS,
  phase3:  10  * ESTAFA_IA_CLONACION_VOZ_FPS,
  reality: 10 * ESTAFA_IA_CLONACION_VOZ_FPS,
  close:   6   * ESTAFA_IA_CLONACION_VOZ_FPS,
} as const;

export const ESTAFA_IA_CLONACION_VOZ_TOTAL_DURATION =
  ESTAFA_IA_CLONACION_VOZ_DURATIONS.intro +
  ESTAFA_IA_CLONACION_VOZ_DURATIONS.layers +
  ESTAFA_IA_CLONACION_VOZ_DURATIONS.phase1 +
  ESTAFA_IA_CLONACION_VOZ_DURATIONS.phase2 +
  ESTAFA_IA_CLONACION_VOZ_DURATIONS.phase3 +
  ESTAFA_IA_CLONACION_VOZ_DURATIONS.reality +
  ESTAFA_IA_CLONACION_VOZ_DURATIONS.close;

export type VideoNiche = "cybersecurity" | "ai" | "history" | "fraud" | "news" | "general";
export type HookStyle = "shock" | "curiosity" | "contrarian" | "countdown" | "real-story";

export const ESTAFA_IA_CLONACION_VOZ_NICHE: VideoNiche = "ai";

export const ESTAFA_IA_CLONACION_VOZ_HOOK_STYLE: HookStyle = "shock";

export const ESTAFA_IA_CLONACION_VOZ_ACCENTS = {
  intro:   ["#FF0000","#000000"] as AccentPair,
  layers:  ["#FF0000","#FFFFFF"] as AccentPair,
  phase1:  ["#FF4500","#000000"] as AccentPair,
  phase2:  ["#FF4500","#FFFFFF"] as AccentPair,
  phase3:  ["#FF0000","#000000"] as AccentPair,
  reality: ["#FF4500","#FFFFFF"] as AccentPair,
  close:   ["#FF0000","#000000"] as AccentPair,
};

export const ESTAFA_IA_CLONACION_VOZ_INTRO = {
  "tag": "ALERTA",
  "title": "La próxima estafa\npuede ser tu jefe",
  "subtitle": "¿Te atreverías a transferir dinero?"
};

export const ESTAFA_IA_CLONACION_VOZ_LAYERS = {
  "tag": "CONTEXTUALIZACIÓN",
  "terminal": [
    "> 2025: 22,000 denuncias de estafas con IA",
    "> Pérdidas de 893 millones de dólares",
    "> BEC: más de 3,046 millones en pérdidas",
    "> La IA hace más fácil clonar voces"
  ],
  "definition": "La clonación de voz con IA es una amenaza real\nque puede afectar a cualquier negocio digital.",
  "detail": "El FBI reportó que las estafas BEC causaron\nmás de 3 mil millones de dólares en 2025."
};

export const ESTAFA_IA_CLONACION_VOZ_PHASE1 = {
  "phase": "CLONACIÓN DE VOZ",
  "timestamp": "ESTAFAS EN AUGE",
  "title": "Estafadores al acecho\ncon voces falsas",
  "narrative": "Los estafadores investigan tu empresa y clonan voces\npara hacer solicitudes urgentes.",
  "detail": "Más de 30 millones de dólares en pérdidas\npor BEC con participación de IA.",
  "indicator": [
    "Cifras alarmantes de pérdidas",
    "Estafas que usan IA"
  ]
};

export const ESTAFA_IA_CLONACION_VOZ_PHASE2 = {
  "phase": "EL ATAQUE",
  "timestamp": "MÉTODOS MODERNOS",
  "title": "Así funciona el ataque\ncon IA",
  "narrative": "Recibes un mensaje de voz que parece real,\ndiciendo que transfieras dinero urgentemente.",
  "detail": "El FBI advierte sobre campañas de suplantación\ncon voces generadas por IA.",
  "indicator": [
    "Urgencia + secreto = estafa",
    "Ejemplo de mensaje falso"
  ]
};

export const ESTAFA_IA_CLONACION_VOZ_PHASE3 = {
  "phase": "CONSECUENCIAS GRAVES",
  "timestamp": "CASOS REALES",
  "title": "Un CEO engañado\npor una voz falsa",
  "narrative": "En 2019, un CEO transfirió 243,000 dólares\npensando que hablaba con su jefe.",
  "detail": "La voz era un deepfake, un engaño costoso.",
  "indicator": [
    "243,000 dólares perdidos",
    "Un caso que podría repetirse"
  ]
};

export const ESTAFA_IA_CLONACION_VOZ_REALITY = {
  "tag": "REALIDAD · PREVENCIÓN",
  "title": "Protege tu negocio\ncon estas acciones",
  "actions": [
    "Nunca apruebes pagos solo por voz.",
    "Crea una palabra clave interna para confirmar.",
    "Verifica por otro canal antes de actuar.",
    "Desconfía de solicitudes urgentes y secretas."
  ]
};

export const ESTAFA_IA_CLONACION_VOZ_CLOSE = {
  "tag": "CONCLUSIÓN",
  "title": "La IA puede ser\nuna amenaza real",
  "subtitle": "¡Infórmate y protege tu negocio!"
};
