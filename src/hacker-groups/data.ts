export type AccentPair = [string, string];

export type HackerGroupData = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  detail: string;
  signals: [string, string];
  accent: AccentPair;
};

export const HACKER_FPS = 30;

export const HACKER_DURATIONS = {
  hook: 4 * HACKER_FPS,
  context: 6 * HACKER_FPS,
  group: 9 * HACKER_FPS,
  outro: 5 * HACKER_FPS,
} as const;

/* ── HOOK ── */
export const HACKER_HOOK = {
  eyebrow: "CIBERCRIMEN · GRUPOS ACTIVOS",
  title: "5 grupos\nque hackean\nempresas ahora",
  subtitle: "y la mayoría no se entera a tiempo",
  chips: ["Lazarus", "APT28", "LockBit", "Carbanak", "Conti"],
};

/* ── CONTEXT ── */
export const HACKER_CONTEXT = {
  eyebrow: "LA REALIDAD",
  title: "No son genios\nen un sótano.",
  subtitle: "son operaciones con presupuesto",
  detail: "Tienen equipos, infraestructura y objetivos claros. Como cualquier empresa... pero del otro lado.",
  markers: ["Estructura corporativa", "Financiación estatal"] as [string, string],
};

/* ── GROUPS ── */
export const HACKER_GROUPS: HackerGroupData[] = [
  {
    id: "lazarus",
    label: "GRUPO 01",
    title: "Lazarus Group",
    subtitle: "Respaldados por un estado.",
    detail: "Robaron 620M en cripto de un solo golpe. Financian un régimen entero con teclados.",
    signals: ["Robo financiero masivo", "Ingeniería social avanzada"],
    accent: ["#FF4D4D", "#D62828"],
  },
  {
    id: "lockbit",
    label: "GRUPO 02",
    title: "LockBit",
    subtitle: "Ransomware como servicio.",
    detail: "Cualquiera puede usar su plataforma para atacar. Cobran comisión por cada rescate.",
    signals: ["Modelo SaaS criminal", "Automatización total"],
    accent: ["#FF6B35", "#E85D04"],
  },
  {
    id: "apt28",
    label: "GRUPO 03",
    title: "APT28 · Fancy Bear",
    subtitle: "Inteligencia militar rusa.",
    detail: "Atacaron elecciones, gobiernos y empresas estratégicas. Operan con impunidad.",
    signals: ["Espionaje industrial", "Infraestructura crítica"],
    accent: ["#FF8C42", "#D4760A"],
  },
  {
    id: "carbanak",
    label: "GRUPO 04",
    title: "Carbanak / FIN7",
    subtitle: "Objetivo: tu banco.",
    detail: "Extrajeron más de 1,000 millones de dólares infiltrando sistemas financieros desde adentro.",
    signals: ["Infiltración bancaria", "Operación quirúrgica"],
    accent: ["#E63946", "#A4161A"],
  },
  {
    id: "conti",
    label: "GRUPO 05",
    title: "Conti",
    subtitle: "El cartel del ransomware.",
    detail: "Paralizaron hospitales, escuelas y empresas. Publicaban tus datos si no pagabas.",
    signals: ["Triple extorsión", "Sin piedad"],
    accent: ["#BC4749", "#8B1A1A"],
  },
];

/* ── OUTRO ── */
export const HACKER_OUTRO = {
  eyebrow: "REFLEXIÓN",
  title: "Ellos ya tienen\nestrategia.\n¿Y tu empresa?",
  subtitle: "La pregunta no es si van a intentarlo.",
};

/* ── TOTAL ── */
export const HACKER_TOTAL_DURATION =
  HACKER_DURATIONS.hook +
  HACKER_DURATIONS.context +
  HACKER_GROUPS.length * HACKER_DURATIONS.group +
  HACKER_DURATIONS.outro;
