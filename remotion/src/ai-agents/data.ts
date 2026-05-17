export type AccentPair = [string, string];

export type AgentSceneData = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  detail: string;
  signals: [string, string];
  accent: AccentPair;
};

export const AI_AGENTS_FPS = 30;

export const AI_AGENTS_DURATIONS = {
  hook: 4 * AI_AGENTS_FPS,
  context: 6 * AI_AGENTS_FPS,
  point: 9 * AI_AGENTS_FPS,
  outro: 5 * AI_AGENTS_FPS,
} as const;

export const AI_AGENTS_HOOK = {
  eyebrow: "AGENTES DE IA · AUTOMATIZACIÓN",
  title: "La IA que trabaja\nmientras tú\nduermes",
  subtitle: "ya no solo responde — actúa sola",
  chips: ["Autónoma", "24/7", "Sin supervisión", "Multi-tarea"],
};

export const AI_AGENTS_CONTEXT = {
  eyebrow: "QUÉ ES UN AGENTE",
  title: "No es un chat.\nEs un empleado\ndigital.",
  subtitle: "recibe una meta y la ejecuta solo",
  detail: "Piensa, decide, actúa y se corrige sin que le digas cómo.",
  markers: ["Toma decisiones", "Usa herramientas"] as [string, string],
};

export const AI_AGENTS_POINTS: AgentSceneData[] = [
  {
    id: "research",
    label: "PASO 01",
    title: "Investiga",
    subtitle: "Busca información solo.",
    detail: "Navega la web, lee documentos y filtra lo relevante.",
    signals: ["Búsqueda autónoma", "Datos en tiempo real"],
    accent: ["#74DFFF", "#1A8DD4"],
  },
  {
    id: "analyze",
    label: "PASO 02",
    title: "Analiza",
    subtitle: "Conecta los datos.",
    detail: "Cruza fuentes, detecta patrones y saca conclusiones.",
    signals: ["Razonamiento", "Conexión de datos"],
    accent: ["#83EEFF", "#23B5D9"],
  },
  {
    id: "execute",
    label: "PASO 03",
    title: "Ejecuta",
    subtitle: "Actúa sin que le digas.",
    detail: "Manda emails, llena formularios, agenda reuniones.",
    signals: ["Acción directa", "Cero fricción"],
    accent: ["#70FFD4", "#1AD5A0"],
  },
  {
    id: "report",
    label: "PASO 04",
    title: "Reporta",
    subtitle: "Te entrega el resultado.",
    detail: "Resumen claro de todo lo que hizo y lo que encontró.",
    signals: ["Resumen listo", "Trazabilidad total"],
    accent: ["#A4FF84", "#38D927"],
  },
];

export const AI_AGENTS_TOTAL_DURATION =
  AI_AGENTS_DURATIONS.hook +
  AI_AGENTS_DURATIONS.context +
  AI_AGENTS_POINTS.length * AI_AGENTS_DURATIONS.point +
  AI_AGENTS_DURATIONS.outro;

export const AI_AGENTS_OUTRO = {
  eyebrow: "EL FUTURO ES AHORA",
  title: "No automatices\ntareas.\nAutomatiza\ndecisiones.",
  subtitle: "Los agentes ya están aquí.",
};
