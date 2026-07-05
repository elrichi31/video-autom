export type AccentPair = [string, string];

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_FPS = 30;

// Target duration: 45s — scene durations scaled proportionally
export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_DURATIONS = {
  intro:   3   * TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_FPS,
  layers:  7  * TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_FPS,
  phase1:  8  * TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_FPS,
  phase2:  7  * TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_FPS,
  phase3:  8  * TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_FPS,
  reality: 8 * TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_FPS,
  close:   4   * TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_FPS,
} as const;

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_TOTAL_DURATION =
  TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_DURATIONS.intro +
  TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_DURATIONS.layers +
  TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_DURATIONS.phase1 +
  TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_DURATIONS.phase2 +
  TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_DURATIONS.phase3 +
  TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_DURATIONS.reality +
  TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_DURATIONS.close;

export type VideoNiche = "cybersecurity" | "ai" | "history" | "fraud" | "news" | "general";
export type HookStyle = "shock" | "curiosity" | "contrarian" | "countdown" | "real-story";

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_NICHE: VideoNiche = "general";

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_HOOK_STYLE: HookStyle = "curiosity";

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_ACCENTS = {
  intro:   ["#C70039","#FFC300"] as AccentPair,
  layers:  ["#FF5733","#FFC300"] as AccentPair,
  phase1:  ["#FF5733","#FFC300"] as AccentPair,
  phase2:  ["#C70039","#FFC300"] as AccentPair,
  phase3:  ["#900C3F","#FFC300"] as AccentPair,
  reality: ["#581845","#FFC300"] as AccentPair,
  close:   ["#900C3F","#FFC300"] as AccentPair,
};

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_INTRO = {
  "tag": "INICIO IMPACTANTE",
  "title": "LA VERDAD\nSIN FILTROS",
  "subtitle": "Descubre por qué tu negocio se queda atrás sin una tienda online."
};

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_LAYERS = {
  "tag": "CONCEPTO CLAVE",
  "terminal": [
    "> ecommerce.2023       = 6.3 billones de dólares en ventas",
    "> negocios.sin.online   = 70% fracasan en 3 años",
    "> crecimiento.global     = 20% anual en ventas online",
    "> mito.tienda.física    = NO es suficiente en la era digital"
  ],
  "definition": "Las tiendas en línea no son solo una opción, son\nuna necesidad para competir hoy en día.\nEl mundo se ha digitalizado y tú también debes hacerlo.",
  "detail": "En 2023, el comercio electrónico alcanzará\n6.3 billones de dólares en ventas globales."
};

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_PHASE1 = {
  "phase": "REALIDAD CRUDA",
  "timestamp": "HECHO IMPACTANTE",
  "title": "Las estadísticas\nno mienten",
  "narrative": "El 70% de los negocios que no tienen presencia online\ncierran en menos de 3 años. ¿Te arriesgarías a ser uno de ellos?",
  "detail": "70% de negocios sin tienda online fracasan en 3 años. Fuente: Forbes.",
  "indicator": [
    "$4.9M costo medio de una quiebra",
    "70% de nuevos negocios fracasan"
  ]
};

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_PHASE2 = {
  "phase": "LA ESCALADA",
  "timestamp": "CIFRAS REALES",
  "title": "El crecimiento\nes imparable",
  "narrative": "Las ventas online crecen un 20% anual. Cada vez más,\nlos consumidores prefieren comprar desde casa.",
  "detail": "Las ventas online crecerán un 20% anual hasta 2025. Fuente: Statista.",
  "indicator": [
    "$6.3B en ventas online en 2023",
    "20% de crecimiento anual"
  ]
};

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_PHASE3 = {
  "phase": "EL GOLPE FINAL",
  "timestamp": "LA VERDAD DOLOROSA",
  "title": "Sin tienda online,\nno tienes futuro",
  "narrative": "Imagínate perder clientes cada día. Sin una tienda online,\ntu competencia te está robando ventas. ¡Despierta!",
  "detail": "El 80% de los consumidores investigan online antes de comprar. Fuente: Google.",
  "indicator": [
    "80% de consumidores investigan antes de comprar",
    "90% prefiere comprar online"
  ]
};

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_REALITY = {
  "tag": "REALIDAD · CONTEXTO",
  "title": "Es hora de actuar:\nla digitalización es clave",
  "actions": [
    "Crea tu tienda online hoy mismo",
    "Explora plataformas como Shopify o WooCommerce",
    "Invierte en marketing digital para atraer clientes",
    "No te quedes atrás, el futuro es digital"
  ]
};

export const TIENDAS_EN_LINEA_NECESSIDAD_NEGOCIOS_CLOSE = {
  "tag": "CONCLUSIÓN IMPACTANTE",
  "title": "Sin digitalización,\ntu negocio está condenado",
  "subtitle": "El futuro es online o nada. ¡No lo ignores!"
};
