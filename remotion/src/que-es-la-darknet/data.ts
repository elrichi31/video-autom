export type AccentPair = [string, string];

export const QUE_ES_LA_DARKNET_FPS = 30;

// Target duration: 60s — scene durations scaled proportionally
export const QUE_ES_LA_DARKNET_DURATIONS = {
  intro:   4   * QUE_ES_LA_DARKNET_FPS,
  layers:  9  * QUE_ES_LA_DARKNET_FPS,
  phase1:  10  * QUE_ES_LA_DARKNET_FPS,
  phase2:  11  * QUE_ES_LA_DARKNET_FPS,
  phase3:  10  * QUE_ES_LA_DARKNET_FPS,
  reality: 10 * QUE_ES_LA_DARKNET_FPS,
  close:   6   * QUE_ES_LA_DARKNET_FPS,
} as const;

export const QUE_ES_LA_DARKNET_TOTAL_DURATION =
  QUE_ES_LA_DARKNET_DURATIONS.intro +
  QUE_ES_LA_DARKNET_DURATIONS.layers +
  QUE_ES_LA_DARKNET_DURATIONS.phase1 +
  QUE_ES_LA_DARKNET_DURATIONS.phase2 +
  QUE_ES_LA_DARKNET_DURATIONS.phase3 +
  QUE_ES_LA_DARKNET_DURATIONS.reality +
  QUE_ES_LA_DARKNET_DURATIONS.close;

export const QUE_ES_LA_DARKNET_ACCENTS = {
  intro:   ["#000000","#1a1a1a"] as AccentPair,
  layers:  ["#1a1a1a","#333333"] as AccentPair,
  phase1:  ["#333333","#4d4d4d"] as AccentPair,
  phase2:  ["#4d4d4d","#666666"] as AccentPair,
  phase3:  ["#666666","#808080"] as AccentPair,
  reality: ["#ff0000","#990000"] as AccentPair,
  close:   ["#000000","#1a1a1a"] as AccentPair,
};

export const QUE_ES_LA_DARKNET_INTRO = {
  "tag": "DARKNET",
  "title": "EL LADO\nOSCURO\nDE INTERNET",
  "subtitle": "explora lo desconocido"
};

export const QUE_ES_LA_DARKNET_LAYERS = {
  "tag": "CIBERESPACIO",
  "terminal": [
    "> internet.visible = 4% de la web",
    "> internet.oculta  = 96% restante",
    "> darknet.acceso   = especial",
    "> tráfico.ilícito  = 100 TIENDAS"
  ],
  "definition": "La Darknet es una parte\nde la Deep Web,\ninaccesible por navegadores comunes",
  "detail": "El 96% de la web es la Deep Web, donde se encuentra la Darknet."
};

export const QUE_ES_LA_DARKNET_PHASE1 = {
  "phase": "ACCESO",
  "timestamp": "CONEXIÓN",
  "title": "Cómo\nEntrar",
  "narrative": "El acceso a la Darknet requiere software especial como Tor, que oculta identidades y ubicaciones.",
  "detail": "Tor fue descargado más de 2 millones de veces en 2021.",
  "indicator": [
    "Tor",
    "2 millones"
  ]
};

export const QUE_ES_LA_DARKNET_PHASE2 = {
  "phase": "CONTENIDO",
  "timestamp": "DENTRO",
  "title": "Lo que\nEncontrarás",
  "narrative": "Desde foros de discusión hasta mercados ilegales, la Darknet es un refugio para diversos tipos de contenido.",
  "detail": "Existen más de 100 mercados ilegales activos en la Darknet.",
  "indicator": [
    "Mercados ilegales",
    "100 activos"
  ]
};

export const QUE_ES_LA_DARKNET_PHASE3 = {
  "phase": "RIESGOS",
  "timestamp": "PELIGRO",
  "title": "Peligros\nOcultos",
  "narrative": "Riesgos de entrar a la Darknet incluyen estafas, contenido ilegal y vigilancia gubernamental.",
  "detail": "El FBI ha cerrado múltiples sitios en operaciones encubiertas.",
  "indicator": [
    "Estafas",
    "Vigilancia"
  ]
};

export const QUE_ES_LA_DARKNET_REALITY = {
  "tag": "REALIDAD",
  "title": "La Darknet no\nes ilegal, pero\nmucho de su\ncontenido sí lo es.",
  "actions": [
    "Reflexiona antes de entrar",
    "Infórmate sobre riesgos",
    "Usa tecnología segura",
    "Conoce las leyes locales"
  ]
};

export const QUE_ES_LA_DARKNET_CLOSE = {
  "tag": "DARKNET · CONCLUSIÓN",
  "title": "Conocer\nes prevenir\npeligros",
  "subtitle": "La información es tu mejor defensa. Mantente seguro."
};
