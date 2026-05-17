export type AccentPair = [string, string];

export type AttackSceneData = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  detail: string;
  signals: [string, string];
  accent: AccentPair;
};

export const CYBER_FPS = 30;

export const CYBER_DURATIONS = {
  hook: 4 * CYBER_FPS,
  context: 6 * CYBER_FPS,
  attack: 9 * CYBER_FPS,
  outro: 5 * CYBER_FPS,
} as const;

export const HOOK_COPY = {
  eyebrow: "CIBERSEGURIDAD · 5 ATAQUES",
  title: "5 ataques\nque debes\nreconocer",
  subtitle: "antes del clic equivocado",
  chips: ["Phishing", "Malware", "Ransomware", "DDoS", "Claves"],
};

export const CONTEXT_COPY = {
  eyebrow: "ANTES DE QUE PEGUE",
  title: "Casi siempre\nparece normal.",
  subtitle: "ahí está el riesgo",
  detail: "Lo urgente también se verifica.",
  markers: ["Urgencia falsa", "Link raro"] as [string, string],
};

export const CYBER_ATTACKS: AttackSceneData[] = [
  {
    id: "phishing",
    label: "ATAQUE 01",
    title: "Phishing",
    subtitle: "Roba tus claves.",
    detail: "Se disfraza de algo real.",
    signals: ["Correo falso", "Link falso"],
    accent: ["#8CFF74", "#19D47B"],
  },
  {
    id: "malware",
    label: "ATAQUE 02",
    title: "Malware",
    subtitle: "Infecta tu equipo.",
    detail: "Entra por archivos o apps.",
    signals: ["Archivo raro", "Descarga dudosa"],
    accent: ["#74FFBC", "#17B3A7"],
  },
  {
    id: "ransomware",
    label: "ATAQUE 03",
    title: "Ransomware",
    subtitle: "Secuestra archivos.",
    detail: "Bloquea todo en minutos.",
    signals: ["Todo bloqueado", "Piden rescate"],
    accent: ["#B0FF73", "#49D61D"],
  },
  {
    id: "ddos",
    label: "ATAQUE 04",
    title: "DDoS",
    subtitle: "Tumba tu servicio.",
    detail: "Lo satura con tráfico falso.",
    signals: ["Picos raros", "Caídas seguidas"],
    accent: ["#6AF7FF", "#1EDC89"],
  },
  {
    id: "credential-stuffing",
    label: "ATAQUE 05",
    title: "Credential\nStuffing",
    subtitle: "Prueban claves robadas.",
    detail: "Aprovecha claves reutilizadas.",
    signals: ["Muchos intentos", "Claves repetidas"],
    accent: ["#C9FF7B", "#18C97A"],
  },
];

export const CYBER_TOTAL_DURATION =
  CYBER_DURATIONS.hook +
  CYBER_DURATIONS.context +
  CYBER_ATTACKS.length * CYBER_DURATIONS.attack +
  CYBER_DURATIONS.outro;

export const OUTRO_COPY = {
  eyebrow: "QUÉDATE CON ESTO",
  title: "Detecta la señal.\nNo hagas clic.",
  subtitle: "Guárdalo y compártelo.",
};
