export type AccentPair = [string, string];

export type CyberToolSceneData = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  detail: string;
  signals: [string, string];
  accent: AccentPair;
};

export const CYBER_TOOLS_FPS = 30;

export const CYBER_TOOLS_DURATIONS = {
  hook: 4 * CYBER_TOOLS_FPS,
  context: 6 * CYBER_TOOLS_FPS,
  point: 9 * CYBER_TOOLS_FPS,
  outro: 5 * CYBER_TOOLS_FPS,
} as const;

export const CYBER_TOOLS_HOOK = {
  eyebrow: "CIBERSEGURIDAD · HERRAMIENTAS GRATIS",
  title: "5 herramientas\ngratis para\nproteger tu negocio",
  subtitle: "seguridad profesional sin gastar un peso",
  chips: ["Gratis", "Empresarial", "Open Source", "Fácil"],
};

export const CYBER_TOOLS_CONTEXT = {
  eyebrow: "POR QUÉ IMPORTA",
  title: "El 43% de\nciberataques\napuntan a PyMEs.",
  subtitle: "y la mayoría no tiene protección básica",
  detail: "No necesitas presupuesto. Necesitas las herramientas correctas.",
  markers: ["Protección real", "Costo cero"] as [string, string],
};

export const CYBER_TOOLS_POINTS: CyberToolSceneData[] = [
  {
    id: "bitwarden",
    label: "01 · BITWARDEN",
    title: "Bitwarden",
    subtitle: "Gestor de contraseñas.",
    detail: "Genera y almacena contraseñas únicas para cada cuenta. Open source con cifrado de extremo a extremo.",
    signals: ["Contraseñas únicas", "Cifrado E2E"],
    accent: ["#175DDC", "#6BA5FF"],
  },
  {
    id: "haveibeenpwned",
    label: "02 · HAVE I BEEN PWNED",
    title: "Have I Been\nPwned",
    subtitle: "Verificá filtraciones.",
    detail: "Revisá si tus correos aparecen en filtraciones masivas. Activá alertas para enterarte antes que los hackers.",
    signals: ["Alertas en tiempo real", "Base de datos global"],
    accent: ["#2EC4F3", "#0A7EAD"],
  },
  {
    id: "opendns-quad9",
    label: "03 · OPENDNS / QUAD9",
    title: "OpenDNS\n& Quad9",
    subtitle: "Filtrado DNS gratuito.",
    detail: "Bloqueá phishing a nivel de red. Solo cambiás el DNS y toda tu empresa queda protegida.",
    signals: ["Bloqueo automático", "Sin instalar nada"],
    accent: ["#F5A623", "#D4780A"],
  },
  {
    id: "duplicati",
    label: "04 · DUPLICATI",
    title: "Duplicati",
    subtitle: "Backups encriptados.",
    detail: "Respaldos cifrados en la nube o disco local. Si un ransomware ataca, recuperás todo sin pagar rescate.",
    signals: ["Anti-ransomware", "Respaldo cifrado"],
    accent: ["#27AE60", "#6FCF97"],
  },
  {
    id: "wazuh",
    label: "05 · WAZUH",
    title: "Wazuh",
    subtitle: "Monitoreo de seguridad.",
    detail: "Detectá intrusiones y amenazas en tiempo real. SIEM open source de nivel empresarial.",
    signals: ["Detección de intrusos", "SIEM gratuito"],
    accent: ["#E74C3C", "#FF8A80"],
  },
];

export const CYBER_TOOLS_TOTAL_DURATION =
  CYBER_TOOLS_DURATIONS.hook +
  CYBER_TOOLS_DURATIONS.context +
  CYBER_TOOLS_POINTS.length * CYBER_TOOLS_DURATIONS.point +
  CYBER_TOOLS_DURATIONS.outro;

export const CYBER_TOOLS_OUTRO = {
  eyebrow: "PROTEGÉ TU NEGOCIO HOY",
  title: "No esperes\na ser víctima.\nActuá ahora.",
  subtitle: "5 herramientas. 0 excusas.",
};
