export type AccentPair = [string, string];

export const DARK_WEB_FPS = 30;

export const DARK_WEB_DURATIONS = {
  intro:   3 * DARK_WEB_FPS,  //  90f - gancho dramático
  layers:  6 * DARK_WEB_FPS,  // 180f - las 3 capas del internet
  tor:     7 * DARK_WEB_FPS,  // 210f - cómo funciona Tor
  markets: 7 * DARK_WEB_FPS,  // 210f - qué se vende
  actors:  7 * DARK_WEB_FPS,  // 210f - quién opera ahí
  reality: 7 * DARK_WEB_FPS,  // 210f - la realidad sin filtros
  close:   4 * DARK_WEB_FPS,  // 120f - cierre
} as const;

export const DARK_WEB_TOTAL_DURATION =
  DARK_WEB_DURATIONS.intro +
  DARK_WEB_DURATIONS.layers +
  DARK_WEB_DURATIONS.tor +
  DARK_WEB_DURATIONS.markets +
  DARK_WEB_DURATIONS.actors +
  DARK_WEB_DURATIONS.reality +
  DARK_WEB_DURATIONS.close;

export const DARK_WEB_ACCENTS = {
  intro:   ["#7C3AED", "#4C1D95"] as AccentPair,
  layers:  ["#8B5CF6", "#5B21B6"] as AccentPair,
  tor:     ["#06B6D4", "#164E63"] as AccentPair,
  markets: ["#F43F5E", "#881337"] as AccentPair,
  actors:  ["#F97316", "#7C2D12"] as AccentPair,
  reality: ["#10B981", "#064E3B"] as AccentPair,
  close:   ["#A78BFA", "#4C1D95"] as AccentPair,
};

export const DARK_WEB_INTRO = {
  tag: "ALERTA DE CONTENIDO",
  title: "LA\nDARK WEB",
  subtitle: "el 96% del internet que nadie ve",
};

export const DARK_WEB_LAYERS = {
  tag: "LAS 3 CAPAS DEL INTERNET",
  terminal: [
    "> surface.web  = 4%   visible · indexado",
    "> deep.web     = 96%  invisible · sin indexar",
    "> dark.web     = ???  cifrado · acceso anónimo",
    "> protocolo    = TOR  requerido",
  ],
  definition: "No es el fondo del internet.\nEs una red paralela\nque corre junto a la tuya.",
  detail: "Creada por la Marina de los EE.UU. para proteger comunicaciones de inteligencia.",
};

export const DARK_WEB_TOR = {
  phase: "CAPA 01",
  timestamp: "ANONIMATO",
  title: "Red Tor",
  narrative: "Tu tráfico rebota por tres nodos cifrados alrededor del mundo.",
  detail: "Cada nodo solo conoce el paso anterior y el siguiente. Nadie puede trazar el origen ni el destino completo.",
  indicator: ["3 capas de cifrado", "IP completamente oculta"],
};

export const DARK_WEB_MARKETS = {
  phase: "CAPA 02",
  timestamp: "ECONOMÍA ILEGAL",
  title: "Mercados\nOscuros",
  narrative: "Datos robados, malware y documentos falsos. Todo tiene precio.",
  detail: "Una tarjeta de crédito robada: $5 USD. Un pasaporte falso: $1,000. Acceso a un servidor corporativo: $50.",
  indicator: ["$1.5B anuales", "Solo criptomonedas"],
};

export const DARK_WEB_ACTORS = {
  phase: "CAPA 03",
  timestamp: "QUIÉN ESTÁ AHÍ",
  title: "Los Actores",
  narrative: "No solo criminales.\nTambién estados, periodistas y activistas.",
  detail: "La CIA tiene un sitio .onion oficial. WikiLeaks opera ahí. Periodistas en zonas de guerra también lo usan.",
  indicator: ["Criminales y carteles", "Agencias de inteligencia"],
};

export const DARK_WEB_REALITY = {
  tag: "LA REALIDAD",
  title: "No todo es\ncrimen. Pero\nel riesgo es real.",
  actions: [
    "El 57% del contenido sí es ilegal",
    "Las agencias vigilan activamente",
    "Un clic equivocado puede infectarte",
    "Nunca uses tu correo real ahí",
  ],
};

export const DARK_WEB_CLOSE = {
  tag: "DARK WEB · CONCLUSIÓN",
  title: "La misma red que\nprotege al periodista\nfinancia al criminal.",
  subtitle: "Existe. Funciona. Y nadie la controla.",
};
