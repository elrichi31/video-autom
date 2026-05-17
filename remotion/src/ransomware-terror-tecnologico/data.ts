export type AccentPair = [string, string];

export const RANSOMWARE_TERROR_TECNOLOGICO_FPS = 30;

export const RANSOMWARE_TERROR_TECNOLOGICO_DURATIONS = {
  intro:   3 * RANSOMWARE_TERROR_TECNOLOGICO_FPS,
  layers:  6 * RANSOMWARE_TERROR_TECNOLOGICO_FPS,
  phase1:  7 * RANSOMWARE_TERROR_TECNOLOGICO_FPS,
  phase2:  7 * RANSOMWARE_TERROR_TECNOLOGICO_FPS,
  phase3:  7 * RANSOMWARE_TERROR_TECNOLOGICO_FPS,
  reality: 7 * RANSOMWARE_TERROR_TECNOLOGICO_FPS,
  close:   4 * RANSOMWARE_TERROR_TECNOLOGICO_FPS,
} as const;

export const RANSOMWARE_TERROR_TECNOLOGICO_TOTAL_DURATION =
  RANSOMWARE_TERROR_TECNOLOGICO_DURATIONS.intro +
  RANSOMWARE_TERROR_TECNOLOGICO_DURATIONS.layers +
  RANSOMWARE_TERROR_TECNOLOGICO_DURATIONS.phase1 +
  RANSOMWARE_TERROR_TECNOLOGICO_DURATIONS.phase2 +
  RANSOMWARE_TERROR_TECNOLOGICO_DURATIONS.phase3 +
  RANSOMWARE_TERROR_TECNOLOGICO_DURATIONS.reality +
  RANSOMWARE_TERROR_TECNOLOGICO_DURATIONS.close;

export const RANSOMWARE_TERROR_TECNOLOGICO_ACCENTS = {
  intro:   ["#FF0000","#8B0000"] as AccentPair,
  layers:  ["#FF4500","#FF6347"] as AccentPair,
  phase1:  ["#FFA500","#FFD700"] as AccentPair,
  phase2:  ["#FFFF00","#ADFF2F"] as AccentPair,
  phase3:  ["#32CD32","#008000"] as AccentPair,
  reality: ["#00CED1","#4682B4"] as AccentPair,
  close:   ["#1E90FF","#0000CD"] as AccentPair,
};

export const RANSOMWARE_TERROR_TECNOLOGICO_INTRO = {
  "tag": "PELIGRO",
  "title": "RANSOMWARE\nEL TERROR\nDIGITAL",
  "subtitle": "la amenaza invisible"
};

export const RANSOMWARE_TERROR_TECNOLOGICO_LAYERS = {
  "tag": "CAPAS DEL RIESGO",
  "terminal": [
    "> tipo.ataque = malware",
    "> objetivo    = datos sensibles",
    "> rescate     = criptomonedas",
    "> impacto     = GLOBAL"
  ],
  "definition": "Ransomware es un tipo\nde malware que cifra\nlos datos de la víctima",
  "detail": "El primer ransomware, llamado AIDS, apareció en 1989 y se distribuía por disquetes."
};

export const RANSOMWARE_TERROR_TECNOLOGICO_PHASE1 = {
  "phase": "FASE 01",
  "timestamp": "INFILTRACIÓN",
  "title": "Infiltración\nSutil",
  "narrative": "El ransomware se infiltra en el sistema a través de correos o descargas.",
  "detail": "El 54% de las infecciones provienen de correos electrónicos maliciosos.",
  "indicator": [
    "Correos maliciosos",
    "Descargas inseguras"
  ]
};

export const RANSOMWARE_TERROR_TECNOLOGICO_PHASE2 = {
  "phase": "FASE 02",
  "timestamp": "CIFRADO",
  "title": "Cifrado\nIrreversible",
  "narrative": "El malware cifra archivos críticos, haciendo inaccesible la información.",
  "detail": "En 2021, los ataques de ransomware aumentaron un 150%.",
  "indicator": [
    "Cifrado de datos",
    "Pérdida de acceso"
  ]
};

export const RANSOMWARE_TERROR_TECNOLOGICO_PHASE3 = {
  "phase": "FASE 03",
  "timestamp": "RESCATE",
  "title": "Exigencia\nde Rescate",
  "narrative": "Se solicita un pago para recuperar el acceso, generalmente en criptomonedas.",
  "detail": "Los rescates promedian $170,000 por incidente en 2021.",
  "indicator": [
    "Pago en criptomonedas",
    "Costo financiero"
  ]
};

export const RANSOMWARE_TERROR_TECNOLOGICO_REALITY = {
  "tag": "REALIDAD DIGITAL",
  "title": "El ransomware\nno discrimina:\nempresas, hospitales\ny gobiernos son víctimas",
  "actions": [
    "Actualiza tu software",
    "Usa copias de seguridad",
    "Desconfía de correos sospechosos",
    "Educa a tu equipo"
  ]
};

export const RANSOMWARE_TERROR_TECNOLOGICO_CLOSE = {
  "tag": "RANSOMWARE · CONCLUSIÓN",
  "title": "La prevención\nes tu mejor\narma",
  "subtitle": "Protégete antes de que sea demasiado tarde."
};
