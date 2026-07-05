export type AccentPair = [string, string];

export const QUE_ES_LA_DEEPWEB_FPS = 30;

// Target duration: 60s — scene durations scaled proportionally
export const QUE_ES_LA_DEEPWEB_DURATIONS = {
  intro:   4   * QUE_ES_LA_DEEPWEB_FPS,
  layers:  9  * QUE_ES_LA_DEEPWEB_FPS,
  phase1:  10  * QUE_ES_LA_DEEPWEB_FPS,
  phase2:  11  * QUE_ES_LA_DEEPWEB_FPS,
  phase3:  10  * QUE_ES_LA_DEEPWEB_FPS,
  reality: 10 * QUE_ES_LA_DEEPWEB_FPS,
  close:   6   * QUE_ES_LA_DEEPWEB_FPS,
} as const;

export const QUE_ES_LA_DEEPWEB_TOTAL_DURATION =
  QUE_ES_LA_DEEPWEB_DURATIONS.intro +
  QUE_ES_LA_DEEPWEB_DURATIONS.layers +
  QUE_ES_LA_DEEPWEB_DURATIONS.phase1 +
  QUE_ES_LA_DEEPWEB_DURATIONS.phase2 +
  QUE_ES_LA_DEEPWEB_DURATIONS.phase3 +
  QUE_ES_LA_DEEPWEB_DURATIONS.reality +
  QUE_ES_LA_DEEPWEB_DURATIONS.close;

export type VideoNiche = "cybersecurity" | "ai" | "history" | "fraud" | "news" | "general";
export type HookStyle = "shock" | "curiosity" | "contrarian" | "countdown" | "real-story";

export const QUE_ES_LA_DEEPWEB_NICHE: VideoNiche = "general";

export const QUE_ES_LA_DEEPWEB_HOOK_STYLE: HookStyle = "curiosity";

export const QUE_ES_LA_DEEPWEB_ACCENTS = {
  intro:   ["#FF4500","#FFD700"] as AccentPair,
  layers:  ["#00FF7F","#32CD32"] as AccentPair,
  phase1:  ["#1E90FF","#00BFFF"] as AccentPair,
  phase2:  ["#9400D3","#9932CC"] as AccentPair,
  phase3:  ["#FF6347","#FF4500"] as AccentPair,
  reality: ["#FFD700","#FF8C00"] as AccentPair,
  close:   ["#00FA9A","#7CFC00"] as AccentPair,
};

export const QUE_ES_LA_DEEPWEB_INTRO = {
  "tag": "DESCUBRE",
  "title": "LA DEEP WEB\nNO ES LO QUE\nCREES",
  "subtitle": "la parte oculta de internet"
};

export const QUE_ES_LA_DEEPWEB_LAYERS = {
  "tag": "CAPAS DE INTERNET",
  "terminal": [
    "> internet.visible  = 4%",
    "> deep.web         = 90%",
    "> dark.web         = 6%",
    "> contenido.total  = 96% OCULTO"
  ],
  "definition": "La Deep Web es la\nparte de Internet que\nno está indexada.",
  "detail": "Incluye bases de datos, archivos académicos y sitios protegidos por contraseñas."
};

export const QUE_ES_LA_DEEPWEB_PHASE1 = {
  "phase": "FASE 01",
  "timestamp": "INICIO",
  "title": "Acceso\nRestringido",
  "narrative": "La Deep Web requiere enlaces directos o credenciales. No aparece en motores de búsqueda.",
  "detail": "Muchos servicios legítimos operan aquí, como bases de datos médicas.",
  "indicator": [
    "Acceso limitado",
    "Contenido seguro"
  ]
};

export const QUE_ES_LA_DEEPWEB_PHASE2 = {
  "phase": "FASE 02",
  "timestamp": "PROFUNDIDAD",
  "title": "Datos\nOcultos",
  "narrative": "Contiene información valiosa para empresas y académicos.",
  "detail": "El 90% de la web es Deep Web. Incluye archivos de investigación.",
  "indicator": [
    "Información valiosa",
    "Acceso especializado"
  ]
};

export const QUE_ES_LA_DEEPWEB_PHASE3 = {
  "phase": "FASE 03",
  "timestamp": "RIESGOS",
  "title": "Zona\nPeligrosa",
  "narrative": "La Dark Web es una pequeña parte de la Deep Web, accesible solo con navegadores especiales.",
  "detail": "Solo el 6% de la Deep Web es Dark Web, donde ocurre actividad ilegal.",
  "indicator": [
    "Navegador TOR",
    "Actividad ilegal"
  ]
};

export const QUE_ES_LA_DEEPWEB_REALITY = {
  "tag": "LA VERDAD",
  "title": "La Deep Web\nes mayormente benigna,\nuna herramienta para\ninvestigación y privacidad",
  "actions": [
    "Investiga antes de acceder",
    "Utiliza herramientas seguras",
    "Mantente informado",
    "Comparte conocimiento responsablemente"
  ]
};

export const QUE_ES_LA_DEEPWEB_CLOSE = {
  "tag": "DEEP WEB · CONCLUSIÓN",
  "title": "La Deep Web\nes un mundo\npor descubrir",
  "subtitle": "Explora con precaución y conocimiento."
};
