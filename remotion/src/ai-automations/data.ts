export type AccentPair = [string, string];

export type AutomationSceneData = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  detail: string;
  signals: [string, string];
  accent: AccentPair;
};

export const AI_AUTOMATIONS_FPS = 30;

export const AI_AUTOMATIONS_DURATIONS = {
  hook: 4 * AI_AUTOMATIONS_FPS,
  context: 6 * AI_AUTOMATIONS_FPS,
  point: 9 * AI_AUTOMATIONS_FPS,
  outro: 5 * AI_AUTOMATIONS_FPS,
} as const;

export const AI_AUTOMATIONS_HOOK = {
  eyebrow: "IA AGENTS · WORKFLOWS",
  title: "Tu negocio\ncorriendo\nsolo.",
  subtitle: "los agentes no responden — ejecutan",
  chips: ["Ventas", "Soporte", "Contenido", "Reportes"],
};

export const AI_AUTOMATIONS_CONTEXT = {
  eyebrow: "CÓMO FUNCIONA",
  title: "Un trigger.\nUn agente.\nResultado real.",
  subtitle: "el flujo completo sin intervención humana",
  detail: "El agente recibe un evento, toma decisiones y ejecuta múltiples pasos encadenados.",
  markers: ["Multi-paso", "Sin fricción"] as [string, string],
};

export const AI_AUTOMATIONS_POINTS: AutomationSceneData[] = [
  {
    id: "sales",
    label: "FLUJO 01",
    title: "Ventas",
    subtitle: "Lead entra, demo agendada.",
    detail: "Califica el lead, manda el email personalizado y agenda la reunión automáticamente.",
    signals: ["Calificación instantánea", "CRM actualizado"],
    accent: ["#74DFFF", "#1A8DD4"],
  },
  {
    id: "support",
    label: "FLUJO 02",
    title: "Soporte",
    subtitle: "Ticket resuelto sin humanos.",
    detail: "Clasifica la urgencia, responde o escala y cierra el ticket con un resumen.",
    signals: ["Resolución 24/7", "Escala inteligente"],
    accent: ["#83EEFF", "#23B5D9"],
  },
  {
    id: "content",
    label: "FLUJO 03",
    title: "Contenido",
    subtitle: "Idea a publicación en minutos.",
    detail: "Investiga el tema, redacta, adapta el formato y publica en todas las plataformas.",
    signals: ["Multi-plataforma", "Sin editor manual"],
    accent: ["#70FFD4", "#1AD5A0"],
  },
  {
    id: "reports",
    label: "FLUJO 04",
    title: "Reportes",
    subtitle: "Datos listos cada mañana.",
    detail: "Recoge métricas, las analiza y manda el informe al equipo antes de que empiece el día.",
    signals: ["Análisis automático", "Entrega puntual"],
    accent: ["#A4FF84", "#38D927"],
  },
];

export const AI_AUTOMATIONS_TOTAL_DURATION =
  AI_AUTOMATIONS_DURATIONS.hook +
  AI_AUTOMATIONS_DURATIONS.context +
  AI_AUTOMATIONS_POINTS.length * AI_AUTOMATIONS_DURATIONS.point +
  AI_AUTOMATIONS_DURATIONS.outro;

export const AI_AUTOMATIONS_OUTRO = {
  eyebrow: "EL FUTURO YA LLEGÓ",
  title: "No contratas\nmás personas.\nDespliegas\nagentes.",
  subtitle: "tu operación escala sin límites.",
};
