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
  intro:   ["#FF0000", "#8B0000"] as AccentPair,
  layers:  ["#FF3300", "#CC1100"] as AccentPair,
  phase1:  ["#FF6600", "#CC4400"] as AccentPair,
  phase2:  ["#FF9900", "#CC7700"] as AccentPair,
  phase3:  ["#FFCC00", "#CC9900"] as AccentPair,
  reality: ["#00AAFF", "#0077CC"] as AccentPair,
  close:   ["#FF0000", "#8B0000"] as AccentPair,
};

export const RANSOMWARE_TERROR_TECNOLOGICO_INTRO = {
  "tag": "CIBERATAQUE",
  "title": "EN 23\nMINUTOS\nPARALIZADO",
  "subtitle": "el secuestro digital que no para"
};

export const RANSOMWARE_TERROR_TECNOLOGICO_LAYERS = {
  "tag": "CÓMO FUNCIONA",
  "terminal": [
    "> vector.entrada   = email malicioso (94% de los casos)",
    "> tiempo.detección = 278 días en promedio",
    "> cifrado.activo   = en menos de 23 minutos",
    "> rescate.promedio = $1.540.000 en 2023"
  ],
  "definition": "No borra tus datos.\nLos cifra — y solo ellos\ntienen la clave.",
  "detail": "En 2023 los ataques de ransomware costaron 1,1 billones de dólares a nivel global. Récord absoluto."
};

export const RANSOMWARE_TERROR_TECNOLOGICO_PHASE1 = {
  "phase": "INFILTRACIÓN",
  "timestamp": "EL ENGAÑO",
  "title": "Un Email.\nUn Clic.\nTodo Perdido.",
  "narrative": "El 94% de los ataques empiezan con un correo. Alguien del equipo hace clic. En menos de 23 minutos los archivos ya están cifrados.",
  "detail": "Los atacantes permanecen ocultos en la red un promedio de 278 días antes de activar el ransomware.",
  "indicator": [
    "94% entran por email",
    "278 días sin ser detectados"
  ]
};

export const RANSOMWARE_TERROR_TECNOLOGICO_PHASE2 = {
  "phase": "CIFRADO",
  "timestamp": "EL SECUESTRO",
  "title": "Tus Archivos\nYa No Son\nTuyos",
  "narrative": "Hospitales que no pueden acceder a historiales. Fábricas detenidas. Municipios sin servicios. El ransomware no discrimina objetivo.",
  "detail": "El Hospital Universitario de Düsseldorf (2020): primer muerte documentada causada por un ataque de ransomware.",
  "indicator": [
    "1er muerte confirmada · Düsseldorf 2020",
    "$1,1 billones perdidos en 2023"
  ]
};

export const RANSOMWARE_TERROR_TECNOLOGICO_PHASE3 = {
  "phase": "RESCATE",
  "timestamp": "EL PRECIO",
  "title": "Colonial\nPipeline:\n$4,4M",
  "narrative": "Mayo 2021. Colonial Pipeline pagó 4,4 millones de dólares en bitcoin en pocas horas. El FBI recuperó 2,3 millones. El resto, desaparecido.",
  "detail": "El rescate promedio en 2023 fue de 1.542.333 dólares. Un 89% más que el año anterior.",
  "indicator": [
    "$4,4M · Colonial Pipeline 2021",
    "+89% aumento de rescates en 2023"
  ]
};

export const RANSOMWARE_TERROR_TECNOLOGICO_REALITY = {
  "tag": "DEFENSA · AHORA",
  "title": "Pagar\nno garantiza\nrecuperar.\nJamás.",
  "actions": [
    "Backup offline diario — desconectado de la red",
    "Autenticación en dos pasos en todo el equipo",
    "Simula ataques de phishing con tu organización",
    "Plan de respuesta escrito antes del ataque"
  ]
};

export const RANSOMWARE_TERROR_TECNOLOGICO_CLOSE = {
  "tag": "RANSOMWARE · CONCLUSIÓN",
  "title": "El ataque\nperfecto solo\nnecesita un clic",
  "subtitle": "La pregunta no es si te atacarán. Es cuándo."
};
