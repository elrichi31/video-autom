export type AccentPair = [string, string];

export const ESCASEZ_TOKENS_IA_FPS = 30;

// Target duration: 60s — scene durations scaled proportionally
export const ESCASEZ_TOKENS_IA_DURATIONS = {
  intro:   4   * ESCASEZ_TOKENS_IA_FPS,
  layers:  9  * ESCASEZ_TOKENS_IA_FPS,
  phase1:  10  * ESCASEZ_TOKENS_IA_FPS,
  phase2:  11  * ESCASEZ_TOKENS_IA_FPS,
  phase3:  10  * ESCASEZ_TOKENS_IA_FPS,
  reality: 10 * ESCASEZ_TOKENS_IA_FPS,
  close:   6   * ESCASEZ_TOKENS_IA_FPS,
} as const;

export const ESCASEZ_TOKENS_IA_TOTAL_DURATION =
  ESCASEZ_TOKENS_IA_DURATIONS.intro +
  ESCASEZ_TOKENS_IA_DURATIONS.layers +
  ESCASEZ_TOKENS_IA_DURATIONS.phase1 +
  ESCASEZ_TOKENS_IA_DURATIONS.phase2 +
  ESCASEZ_TOKENS_IA_DURATIONS.phase3 +
  ESCASEZ_TOKENS_IA_DURATIONS.reality +
  ESCASEZ_TOKENS_IA_DURATIONS.close;

export const ESCASEZ_TOKENS_IA_ACCENTS = {
  intro:   ["#FF4500","#FF6347"] as AccentPair,
  layers:  ["#FFD700","#FFA500"] as AccentPair,
  phase1:  ["#00FF00","#32CD32"] as AccentPair,
  phase2:  ["#1E90FF","#00BFFF"] as AccentPair,
  phase3:  ["#8A2BE2","#9400D3"] as AccentPair,
  reality: ["#FFFFFF","#C0C0C0"] as AccentPair,
  close:   ["#FF0000","#8B0000"] as AccentPair,
};

export const ESCASEZ_TOKENS_IA_INTRO = {
  "tag": "CRISIS SILENCIOSA",
  "title": "TOKENS\nAL LÍMITE",
  "subtitle": "La inteligencia artificial está sufriendo un problema inesperado"
};

export const ESCASEZ_TOKENS_IA_LAYERS = {
  "tag": "ENTENDIENDO LA BASE",
  "terminal": [
    "> ia.tokens         = unidades básicas de lenguaje",
    "> procesamiento.natural = depende de tokens",
    "> demanda.creciente = 1000% en 2023",
    "> tokens.escasos    = EL PROBLEMA OCULTO"
  ],
  "definition": "Los tokens son la base del procesamiento\nde lenguaje natural. Sin ellos,\nla IA no puede funcionar.",
  "detail": "En 2023, la demanda de tokens ha aumentado un 1000% debido al auge en aplicaciones IA."
};

export const ESCASEZ_TOKENS_IA_PHASE1 = {
  "phase": "DEMANDA EXPLOSIVA",
  "timestamp": "AUMENTO",
  "title": "Consumo\nDescontrolado",
  "narrative": "La demanda de tokens ha crecido exponencialmente. Las aplicaciones que usamos cada día están consumiendo más de lo esperado.",
  "detail": "En 2023, se generaron 5 trillones de tokens cada día, saturando el sistema.",
  "indicator": [
    "5 trillones de tokens diarios",
    "Crecimiento del 1000%"
  ]
};

export const ESCASEZ_TOKENS_IA_PHASE2 = {
  "phase": "CONSECUENCIAS REALES",
  "timestamp": "IMPACTO",
  "title": "Sistemas\nAl Límite",
  "narrative": "La escasez de tokens no solo afecta a las grandes corporaciones. También está impactando a las pequeñas startups y a los desarrolladores independientes.",
  "detail": "El 74% de las pequeñas empresas han reportado problemas de acceso a tokens.",
  "indicator": [
    "74% de empresas afectadas",
    "Problemas de acceso"
  ]
};

export const ESCASEZ_TOKENS_IA_PHASE3 = {
  "phase": "GOLPE INESPERADO",
  "timestamp": "SORPRESA",
  "title": "El Coste\nOculto",
  "narrative": "El costo de los tokens ha incrementado los gastos operativos. Las empresas están gastando más en tokens que en infraestructura.",
  "detail": "El costo de los tokens ha superado los $10 millones mensuales para algunas empresas.",
  "indicator": [
    "$10 millones al mes",
    "Coste mayor que infraestructura"
  ]
};

export const ESCASEZ_TOKENS_IA_REALITY = {
  "tag": "REALIDAD · CONTEXTO",
  "title": "El Futuro\ndepende de\nnuestras acciones",
  "actions": [
    "Optimiza el uso de tokens inmediatamente",
    "Investiga alternativas más eficientes",
    "Colabora en el desarrollo de nuevas soluciones",
    "Comparte la realidad del problema"
  ]
};

export const ESCASEZ_TOKENS_IA_CLOSE = {
  "tag": "LA ERA DE LOS TOKENS",
  "title": "La escasez\nnos obliga\na innovar",
  "subtitle": "La IA necesita más que nunca nuestra atención y acción"
};
