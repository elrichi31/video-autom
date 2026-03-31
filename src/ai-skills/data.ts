export type AccentPair = [string, string];

export type SkillSceneData = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  detail: string;
  signals: [string, string];
  accent: AccentPair;
};

export const AI_SKILLS_FPS = 30;

export const AI_SKILLS_DURATIONS = {
  hook: 4 * AI_SKILLS_FPS,
  context: 6 * AI_SKILLS_FPS,
  point: 9 * AI_SKILLS_FPS,
  outro: 5 * AI_SKILLS_FPS,
} as const;

export const AI_SKILLS_HOOK = {
  eyebrow: "MODELOS DE IA · SKILLS",
  title: "Por qué las skills\ncambian un modelo\ngenérico",
  subtitle: "y lo vuelven útil de verdad",
  chips: ["Contexto", "Workflow", "Tools", "Calidad", "Escala"],
};

export const AI_SKILLS_CONTEXT = {
  eyebrow: "EL CAMBIO REAL",
  title: "Sin skill,\nla IA improvisa.",
  subtitle: "con skill, ejecuta mejor",
  detail: "Pasa de responder... a operar con criterio.",
  markers: ["Más contexto", "Menos fricción"] as [string, string],
};

export const AI_SKILLS_POINTS: SkillSceneData[] = [
  {
    id: "context",
    label: "SKILL 01",
    title: "Contexto",
    subtitle: "Le das marco experto.",
    detail: "Qué sabe, qué evita y para quién responde.",
    signals: ["Rol claro", "Límites claros"],
    accent: ["#8CFF74", "#19D47B"],
  },
  {
    id: "workflow",
    label: "SKILL 02",
    title: "Workflow",
    subtitle: "Le das pasos concretos.",
    detail: "No adivina el proceso. Lo sigue.",
    signals: ["Orden fijo", "Menos saltos"],
    accent: ["#9CFF83", "#23D98D"],
  },
  {
    id: "tools",
    label: "SKILL 03",
    title: "Tools",
    subtitle: "Le das herramientas.",
    detail: "Busca, calcula, valida o edita cuando hace falta.",
    signals: ["Tool correcta", "Uso exacto"],
    accent: ["#70F7FF", "#1AD590"],
  },
  {
    id: "quality",
    label: "SKILL 04",
    title: "Calidad",
    subtitle: "Le bajas el error.",
    detail: "Reduce respuestas genéricas y fallos repetidos.",
    signals: ["Menos ruido", "Más precisión"],
    accent: ["#C2FF72", "#50DB27"],
  },
  {
    id: "scale",
    label: "SKILL 05",
    title: "Escala",
    subtitle: "Repites lo que funciona.",
    detail: "Lo bueno deja de depender de un prompt suelto.",
    signals: ["Consistencia", "Velocidad"],
    accent: ["#A7FF84", "#14C97B"],
  },
];

export const AI_SKILLS_TOTAL_DURATION =
  AI_SKILLS_DURATIONS.hook +
  AI_SKILLS_DURATIONS.context +
  AI_SKILLS_POINTS.length * AI_SKILLS_DURATIONS.point +
  AI_SKILLS_DURATIONS.outro;

export const AI_SKILLS_OUTRO = {
  eyebrow: "QUÉDATE CON ESTO",
  title: "Una skill no solo\nenseña.\nOrquesta.",
  subtitle: "Por eso el output cambia.",
};
