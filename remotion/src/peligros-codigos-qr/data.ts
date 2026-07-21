export type AccentPair = [string, string];

export const PELIGROS_CODIGOS_QR_FPS = 30;

// Target duration: 60s — scene durations scaled proportionally
export const PELIGROS_CODIGOS_QR_DURATIONS = {
  intro:   4   * PELIGROS_CODIGOS_QR_FPS,
  layers:  9  * PELIGROS_CODIGOS_QR_FPS,
  phase1:  10  * PELIGROS_CODIGOS_QR_FPS,
  phase2:  11  * PELIGROS_CODIGOS_QR_FPS,
  phase3:  10  * PELIGROS_CODIGOS_QR_FPS,
  reality: 10 * PELIGROS_CODIGOS_QR_FPS,
  close:   6   * PELIGROS_CODIGOS_QR_FPS,
} as const;

export const PELIGROS_CODIGOS_QR_TOTAL_DURATION =
  PELIGROS_CODIGOS_QR_DURATIONS.intro +
  PELIGROS_CODIGOS_QR_DURATIONS.layers +
  PELIGROS_CODIGOS_QR_DURATIONS.phase1 +
  PELIGROS_CODIGOS_QR_DURATIONS.phase2 +
  PELIGROS_CODIGOS_QR_DURATIONS.phase3 +
  PELIGROS_CODIGOS_QR_DURATIONS.reality +
  PELIGROS_CODIGOS_QR_DURATIONS.close;

export type VideoNiche = "cybersecurity" | "ai" | "history" | "fraud" | "news" | "general";
export type HookStyle = "shock" | "curiosity" | "contrarian" | "countdown" | "real-story";

export const PELIGROS_CODIGOS_QR_NICHE: VideoNiche = "cybersecurity";

export const PELIGROS_CODIGOS_QR_HOOK_STYLE: HookStyle = "shock";

export const PELIGROS_CODIGOS_QR_ACCENTS = {
  intro:   ["#FF0000","#000000"] as AccentPair,
  layers:  ["#FF0000","#FF7F00"] as AccentPair,
  phase1:  ["#FF7F00","#FFFFFF"] as AccentPair,
  phase2:  ["#FF7F00","#FF0000"] as AccentPair,
  phase3:  ["#FF0000","#FFFFFF"] as AccentPair,
  reality: ["#FFFFFF","#FF7F00"] as AccentPair,
  close:   ["#FF0000","#000000"] as AccentPair,
};

export const PELIGROS_CODIGOS_QR_INTRO = {
  "tag": "ALERTA",
  "title": "Ese pequeño sticker\npodría no pertenecer\na tu negocio",
  "subtitle": "¡Cuidado con los códigos QR!"
};

export const PELIGROS_CODIGOS_QR_LAYERS = {
  "tag": "QUISHING",
  "terminal": [
    "> Quishing = QR + phishing",
    "> Códigos QR falsos en lugares públicos",
    "> Delincuentes roban datos personales",
    "> Códigos pegados sobre otros"
  ],
  "definition": "El quishing utiliza códigos QR para robar datos.\nLos delincuentes engañan a las víctimas con páginas falsas.",
  "detail": "Más de 716,000 códigos QR maliciosos detectados en 2025."
};

export const PELIGROS_CODIGOS_QR_PHASE1 = {
  "phase": "CÓDIGOS FALSOS",
  "timestamp": "ADVERTENCIA",
  "title": "Cuidado con los códigos\npegados sobre otros",
  "narrative": "Los delincuentes colocan códigos falsos en parquímetros y carteles.\nRevisa si el adhesivo parece manipulado.",
  "detail": "El FBI advierte sobre códigos QR alterados.",
  "indicator": [
    "Códigos QR falsos en lugares públicos",
    "FBI advierte sobre manipulaciones"
  ]
};

export const PELIGROS_CODIGOS_QR_PHASE2 = {
  "phase": "PÁGINAS FRAUDULENTAS",
  "timestamp": "RIESGO ALTO",
  "title": "Páginas que parecen legítimas\npero son un engaño",
  "narrative": "Al escanear, puedes ser dirigido a un sitio que roba tus datos.\nLos delincuentes imitan bancos y empresas.",
  "detail": "La FTC alerta sobre páginas que roban información personal.",
  "indicator": [
    "Códigos QR maliciosos detectados",
    "Páginas que imitan entidades legítimas"
  ]
};

export const PELIGROS_CODIGOS_QR_PHASE3 = {
  "phase": "CONSECUENCIAS GRAVES",
  "timestamp": "ALERTA MÁXIMA",
  "title": "Robo de credenciales\ncon un solo escaneo",
  "narrative": "Si introduces tus datos, los delincuentes pueden acceder a tu información bancaria.\nEl riesgo es real y creciente.",
  "detail": "Más de 3 millones de códigos QR maliciosos en 2025.",
  "indicator": [
    "Cifras alarmantes de códigos maliciosos",
    "Robo de datos personales"
  ]
};

export const PELIGROS_CODIGOS_QR_REALITY = {
  "tag": "REALIDAD · PREVENCIÓN",
  "title": "Antes de escanear,\nrevisa siempre la dirección",
  "actions": [
    "Desconfía de errores ortográficos en la URL.",
    "Confirma con un trabajador antes de usarlo.",
    "No introduzcas datos sensibles desde un QR desconocido.",
    "Abre manualmente la aplicación oficial para pagos."
  ]
};

export const PELIGROS_CODIGOS_QR_CLOSE = {
  "tag": "CONCLUSIÓN · CUIDADO",
  "title": "El problema no es el QR;\nes no saber quién lo colocó\nni a dónde te está enviando.",
  "subtitle": "¡Infórmate y mantente seguro!"
};
