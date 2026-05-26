export type AccentPair = [string, string];

export const QUE_ES_LA_DEEPWEB_FPS = 30;

// Target duration: 60s — scene durations scaled proportionally
export const QUE_ES_LA_DEEPWEB_DURATIONS = {
  intro:   4  * QUE_ES_LA_DEEPWEB_FPS,
  layers:  9  * QUE_ES_LA_DEEPWEB_FPS,
  phase1:  10 * QUE_ES_LA_DEEPWEB_FPS,
  phase2:  11 * QUE_ES_LA_DEEPWEB_FPS,
  phase3:  10 * QUE_ES_LA_DEEPWEB_FPS,
  reality: 10 * QUE_ES_LA_DEEPWEB_FPS,
  close:   6  * QUE_ES_LA_DEEPWEB_FPS,
} as const;

export const QUE_ES_LA_DEEPWEB_TOTAL_DURATION =
  QUE_ES_LA_DEEPWEB_DURATIONS.intro +
  QUE_ES_LA_DEEPWEB_DURATIONS.layers +
  QUE_ES_LA_DEEPWEB_DURATIONS.phase1 +
  QUE_ES_LA_DEEPWEB_DURATIONS.phase2 +
  QUE_ES_LA_DEEPWEB_DURATIONS.phase3 +
  QUE_ES_LA_DEEPWEB_DURATIONS.reality +
  QUE_ES_LA_DEEPWEB_DURATIONS.close;

export const QUE_ES_LA_DEEPWEB_ACCENTS = {
  intro:   ["#00FFCC", "#00CCAA"] as AccentPair,
  layers:  ["#00DDFF", "#0099CC"] as AccentPair,
  phase1:  ["#3399FF", "#1166DD"] as AccentPair,
  phase2:  ["#9933FF", "#6600CC"] as AccentPair,
  phase3:  ["#FF3300", "#CC1100"] as AccentPair,
  reality: ["#FFAA00", "#DD8800"] as AccentPair,
  close:   ["#00FFCC", "#00CCAA"] as AccentPair,
};

export const QUE_ES_LA_DEEPWEB_INTRO = {
  "tag": "INTERNET OCULTO",
  "title": "EL 96%\nDE INTERNET\nINVISIBLE",
  "subtitle": "lo que Google nunca te enseña"
};

export const QUE_ES_LA_DEEPWEB_LAYERS = {
  "tag": "CAPAS DE INTERNET",
  "terminal": [
    "> surface.web      = 4%  (Google, redes sociales)",
    "> deep.web         = 90% (bases de datos, intranets)",
    "> dark.web         = 6%  (solo con Tor)",
    "> tamaño.total     = 500x más grande que la web visible"
  ],
  "definition": "La Deep Web no es ilegal.\nEs simplemente internet\nque los buscadores no ven.",
  "detail": "Los servidores de la Deep Web almacenan 7.500 terabytes de datos. La web visible: apenas 19."
};

export const QUE_ES_LA_DEEPWEB_PHASE1 = {
  "phase": "LO QUE USAS",
  "timestamp": "SURFACE WEB",
  "title": "Solo Ves\nel 4%",
  "narrative": "Google indexa menos del 4% de internet. El resto existe, funciona, y tiene miles de millones de páginas — simplemente no aparece en búsquedas.",
  "detail": "Hay más de 550 mil millones de documentos en la Deep Web. Google indexa unos 4.500 millones.",
  "indicator": [
    "550.000M de documentos ocultos",
    "Google indexa solo 4.500M"
  ]
};

export const QUE_ES_LA_DEEPWEB_PHASE2 = {
  "phase": "QUIÉN VIVE AHÍ",
  "timestamp": "DEEP WEB",
  "title": "No Son\nCriminales",
  "narrative": "Hospitales, universidades, gobiernos y empresas almacenan aquí sus datos. También periodistas y activistas que necesitan privacidad real.",
  "detail": "2,5 millones de personas usan Tor cada día — la mayoría en países con censura gubernamental.",
  "indicator": [
    "2,5M usuarios de Tor al día",
    "Mayoría en países censurados"
  ]
};

export const QUE_ES_LA_DEEPWEB_PHASE3 = {
  "phase": "DARK WEB",
  "timestamp": "EL 6% OSCURO",
  "title": "Ahí Sí\nHay Que\nTener Miedo",
  "narrative": "El 6% más profundo es la Dark Web. Mercados de datos robados, credenciales, armas. En 2023, más de 100.000 contraseñas robadas se vendieron ahí cada día.",
  "detail": "Una credencial bancaria robada se vende por un promedio de 15 dólares en mercados de Dark Web.",
  "indicator": [
    "+100.000 contraseñas/día vendidas",
    "Precio medio: $15 por cuenta"
  ]
};

export const QUE_ES_LA_DEEPWEB_REALITY = {
  "tag": "LA VERDAD",
  "title": "La Deep Web\nno es el problema.\nTus datos ahí\ndentro, sí.",
  "actions": [
    "Comprueba si tu email está comprometido: haveibeenpwned.com",
    "Usa un gestor de contraseñas — nunca repitas",
    "Activa 2FA en todas las cuentas críticas",
    "Monitoriza alertas de filtraciones de datos"
  ]
};

export const QUE_ES_LA_DEEPWEB_CLOSE = {
  "tag": "DEEP WEB · CONCLUSIÓN",
  "title": "No todo\nlo oculto\nes peligroso",
  "subtitle": "Pero todo lo peligroso sabe cómo ocultarse."
};
