export type AccentPair = [string, string];

export const ZERO_DAY_FPS = 30;

export const ZERO_DAY_DURATIONS = {
  alert: 3 * ZERO_DAY_FPS,       // 90 frames - dramatic red warning
  explain: 6 * ZERO_DAY_FPS,     // 180 frames - what is a zero-day
  phase1: 7 * ZERO_DAY_FPS,      // 210 frames - discovery
  phase2: 7 * ZERO_DAY_FPS,      // 210 frames - exploitation
  phase3: 7 * ZERO_DAY_FPS,      // 210 frames - business impact
  defense: 7 * ZERO_DAY_FPS,     // 210 frames - how to defend
  close: 4 * ZERO_DAY_FPS,       // 120 frames - call to action
} as const;

export const ZERO_DAY_TOTAL_DURATION =
  ZERO_DAY_DURATIONS.alert +
  ZERO_DAY_DURATIONS.explain +
  ZERO_DAY_DURATIONS.phase1 +
  ZERO_DAY_DURATIONS.phase2 +
  ZERO_DAY_DURATIONS.phase3 +
  ZERO_DAY_DURATIONS.defense +
  ZERO_DAY_DURATIONS.close;

export const ZERO_DAY_ACCENTS = {
  alert: ["#FF1744", "#D50000"] as AccentPair,
  explain: ["#FF6E40", "#BF360C"] as AccentPair,
  phase1: ["#FFAB40", "#E65100"] as AccentPair,
  phase2: ["#FF1744", "#B71C1C"] as AccentPair,
  phase3: ["#FF0040", "#880E4F"] as AccentPair,
  defense: ["#00E676", "#1B5E20"] as AccentPair,
  close: ["#69F0AE", "#2E7D32"] as AccentPair,
};

export const ZERO_DAY_ALERT = {
  tag: "ALERTA DE SEGURIDAD",
  title: "ZERO—DAY\nDETECTADO",
  subtitle: "amenaza activa · sin parche disponible",
};

export const ZERO_DAY_EXPLAIN = {
  tag: "¿QUÉ ES UN ZERO-DAY?",
  terminal: [
    "> vulnerability.status = UNKNOWN",
    "> patch.available = FALSE",
    "> exposure.time = INDEFINIDO",
    "> risk.level = CRITICAL",
  ],
  definition: "Una falla que nadie conoce.\nNi el fabricante.\nNi tu antivirus.",
  detail: "Se llama 'día cero' porque hay cero días de ventaja para defenderte.",
};

export const ZERO_DAY_PHASES = [
  {
    id: "discovery",
    phase: "FASE 01",
    timestamp: "T-00:00:00",
    title: "Descubrimiento",
    narrative: "Un hacker encuentra una falla en software que usás todos los días.",
    detail: "La vulnerabilidad se vende en la dark web por miles de dólares. El fabricante no sabe que existe.",
    indicator: ["Sin parche", "Sin detección"],
  },
  {
    id: "exploitation",
    phase: "FASE 02",
    timestamp: "T+00:04:22",
    title: "Explotación",
    narrative: "El ataque se lanza.\nTu sistema no lo detecta.",
    detail: "El malware entra por una actualización falsa, un email, o una web legítima comprometida.",
    indicator: ["Acceso total", "Silencioso"],
  },
  {
    id: "impact",
    phase: "FASE 03",
    timestamp: "T+02:17:41",
    title: "Impacto",
    narrative: "Tu negocio se detiene.\nDatos robados. Sistemas caídos.",
    detail: "El costo promedio de un ciberataque a una PyME es de $120,000 USD. El 60% cierra en 6 meses.",
    indicator: ["$120K promedio", "60% no se recupera"],
  },
] as const;

export const ZERO_DAY_DEFENSE = {
  tag: "CÓMO PROTEGERTE",
  title: "No podés prevenir\nlo desconocido.\nPero sí prepararte.",
  actions: [
    "Actualizá todo. Siempre.",
    "Segmentá tu red interna",
    "Monitoreá comportamiento anómalo",
    "Tené backups offline listos",
  ],
};

export const ZERO_DAY_CLOSE = {
  tag: "ZERO-DAY · CONCLUSIÓN",
  title: "La pregunta no es\nsi va a pasar.\nEs cuándo.",
  subtitle: "Preparate hoy.",
};
