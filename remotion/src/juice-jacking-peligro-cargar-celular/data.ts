export type AccentPair = [string, string];

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_FPS = 30;

// Target duration: 60s — scene durations scaled proportionally
export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_DURATIONS = {
  intro:   4   * JUICE_JACKING_PELIGRO_CARGAR_CELULAR_FPS,
  layers:  9  * JUICE_JACKING_PELIGRO_CARGAR_CELULAR_FPS,
  phase1:  10  * JUICE_JACKING_PELIGRO_CARGAR_CELULAR_FPS,
  phase2:  11  * JUICE_JACKING_PELIGRO_CARGAR_CELULAR_FPS,
  phase3:  10  * JUICE_JACKING_PELIGRO_CARGAR_CELULAR_FPS,
  reality: 10 * JUICE_JACKING_PELIGRO_CARGAR_CELULAR_FPS,
  close:   6   * JUICE_JACKING_PELIGRO_CARGAR_CELULAR_FPS,
} as const;

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_TOTAL_DURATION =
  JUICE_JACKING_PELIGRO_CARGAR_CELULAR_DURATIONS.intro +
  JUICE_JACKING_PELIGRO_CARGAR_CELULAR_DURATIONS.layers +
  JUICE_JACKING_PELIGRO_CARGAR_CELULAR_DURATIONS.phase1 +
  JUICE_JACKING_PELIGRO_CARGAR_CELULAR_DURATIONS.phase2 +
  JUICE_JACKING_PELIGRO_CARGAR_CELULAR_DURATIONS.phase3 +
  JUICE_JACKING_PELIGRO_CARGAR_CELULAR_DURATIONS.reality +
  JUICE_JACKING_PELIGRO_CARGAR_CELULAR_DURATIONS.close;

export type VideoNiche = "cybersecurity" | "ai" | "history" | "fraud" | "news" | "general";
export type HookStyle = "shock" | "curiosity" | "contrarian" | "countdown" | "real-story";

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_NICHE: VideoNiche = "cybersecurity";

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_HOOK_STYLE: HookStyle = "shock";

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_ACCENTS = {
  intro:   ["#FF0000","#000000"] as AccentPair,
  layers:  ["#FF0000","#FFFFFF"] as AccentPair,
  phase1:  ["#FF4500","#000000"] as AccentPair,
  phase2:  ["#FF8C00","#FFFFFF"] as AccentPair,
  phase3:  ["#FF6347","#000000"] as AccentPair,
  reality: ["#FFD700","#FFFFFF"] as AccentPair,
  close:   ["#B22222","#FFFFFF"] as AccentPair,
};

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_INTRO = {
  "tag": "ALERTA",
  "title": "¡CARGAR TU\nCELULAR PUEDE SER LETAL!",
  "subtitle": "¿Sabías que el 80% de los ataques cibernéticos empiezan así?"
};

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_LAYERS = {
  "tag": "CONCEPTOS CLAVE",
  "terminal": [
    "> Juice Jacking = hackeo a través de USB",
    "> 2023 = 30% de ataques cibernéticos son por puertos USB públicos",
    "> Instituciones = aeropuertos y cafés como focos de riesgo",
    "> 90% de los usuarios ignoran el peligro"
  ],
  "definition": "El Juice Jacking es una técnica utilizada por hackers para robar datos a través de puertos USB públicos. Es un ataque invisible y creciente.",
  "detail": "En 2023, el 30% de los ataques cibernéticos se originaron en puertos USB públicos, según Cybersecurity Ventures."
};

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_PHASE1 = {
  "phase": "EL RIESGO REAL",
  "timestamp": "1 MINUTO",
  "title": "¿CÓMO FUNCIONA EL JUICE JACKING?",
  "narrative": "Un hacker conecta un dispositivo a un puerto USB público y puede acceder a tu información en segundos.",
  "detail": "Los datos pueden ser robados en menos de 30 segundos.",
  "indicator": [
    "30 segundos = datos robados",
    "Hackeo en aeropuertos reportado en 2022"
  ]
};

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_PHASE2 = {
  "phase": "CONSECUENCIAS",
  "timestamp": "2 MINUTOS",
  "title": "DAÑOS A TU PRIVACIDAD",
  "narrative": "Las consecuencias son devastadoras: robo de identidad, pérdidas económicas y datos sensibles expuestos.",
  "detail": "En 2023, 1 de cada 5 usuarios sufrió robo de identidad tras un Juice Jacking.",
  "indicator": [
    "20% = robo de identidad tras Juice Jacking",
    "Datos de 500,000 usuarios comprometidos"
  ]
};

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_PHASE3 = {
  "phase": "UN MUNDO INSEGURO",
  "timestamp": "3 MINUTOS",
  "title": "¿QUÉ PASA SI TE ROBA TU INFORMACIÓN?",
  "narrative": "El giro más oscuro: tu información puede ser vendida en el mercado negro, afectando tu vida financiera y personal.",
  "detail": "Los datos personales pueden alcanzan precios de hasta $200 en la dark web.",
  "indicator": [
    "$200 = precio de datos personales en la dark web",
    "Más de 1 millón de datos vendidos en 2023"
  ]
};

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_REALITY = {
  "tag": "PROTEGE TU INFORMACIÓN",
  "title": "No dejes que un simple cargador\narruine tu vida",
  "actions": [
    "Usa tu propio cargador portátil.",
    "Evita puertos USB públicos siempre que sea posible.",
    "Informa a otros sobre este peligro.",
    "Mantén tus dispositivos actualizados con software de seguridad."
  ]
};

export const JUICE_JACKING_PELIGRO_CARGAR_CELULAR_CLOSE = {
  "tag": "CONCLUSIÓN",
  "title": "Cargar tu celular\npuede ser un error",
  "subtitle": "Piensa dos veces antes de conectar tu dispositivo."
};
