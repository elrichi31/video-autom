export type AccentPair = [string, string];

export const PH_FPS = 30;

export const PH_DURATIONS = {
  hook: 4 * PH_FPS,
  point: 8 * PH_FPS,
  outro: 4 * PH_FPS,
} as const;

export type SignalData = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  detail: string;
  accent: AccentPair;
};

export const PH_HOOK = {
  eyebrow: "INTELIGENCIA · CÓDIGO ABIERTO",
  title: "¿Qué es OSINT\ny por qué\nimporta?",
  subtitle: "lo que se puede encontrar con info pública",
};

export const PH_SIGNALS: SignalData[] = [
  {
    id: "what-is",
    number: "01",
    title: "Inteligencia de\nfuentes abiertas",
    subtitle: "Información pública, poder real.",
    detail: "OSINT es recolectar y analizar datos de fuentes públicas: redes, registros, sitios web, foros.",
    accent: ["#64B5F6", "#1565C0"],
  },
  {
    id: "social",
    number: "02",
    title: "Redes sociales\ndicen todo",
    subtitle: "Tu perfil revela más de lo que pensás.",
    detail: "Ubicación, rutinas, contactos, trabajo. Un atacante arma tu perfil completo sin hackear nada.",
    accent: ["#BA68C8", "#7B1FA2"],
  },
  {
    id: "business",
    number: "03",
    title: "Tu empresa\nestá expuesta",
    subtitle: "Datos corporativos en la superficie.",
    detail: "Emails filtrados, tecnologías usadas, empleados clave. Todo visible con las herramientas correctas.",
    accent: ["#FFB74D", "#E65100"],
  },
  {
    id: "defense",
    number: "04",
    title: "OSINT como\ndefensa",
    subtitle: "Usalo antes que los atacantes.",
    detail: "Las empresas usan OSINT para auditar su propia exposición y cerrar brechas antes de un ataque.",
    accent: ["#4DB6AC", "#00695C"],
  },
  {
    id: "tools",
    number: "05",
    title: "Herramientas\nal alcance",
    subtitle: "Shodan, Maltego, theHarvester y más.",
    detail: "Herramientas gratuitas que cualquiera puede usar para investigar la huella digital de un objetivo.",
    accent: ["#E57373", "#C62828"],
  },
];

export const PH_OUTRO = {
  eyebrow: "OSINT · CONCLUSIÓN",
  title: "Todo lo que\npublicás es\nun arma.",
  subtitle: "Controlá tu huella digital antes de que otros la usen",
};

export const PH_TOTAL_DURATION =
  PH_DURATIONS.hook +
  PH_SIGNALS.length * PH_DURATIONS.point +
  PH_DURATIONS.outro;

/**
 * ════════════════════════════════════════════
 *  INSTRUCCIONES PARA AGREGAR IMÁGENES/VIDEOS
 * ════════════════════════════════════════════
 *
 * 1. Poné tus archivos en la carpeta /public/
 *    Ejemplo: public/osint-social.png
 *             public/osint-shodan.mp4
 *
 * 2. En Root.tsx, composición "OsintVerticalPremium",
 *    cambiá los null por el nombre del archivo:
 *
 *    hookMedia: "osint-hook.png",
 *    mediaFiles: [
 *      "osint-fuentes.png",    // 01 - qué es OSINT
 *      "osint-redes.png",      // 02 - redes sociales
 *      "osint-empresa.png",    // 03 - empresa expuesta
 *      "osint-defensa.mp4",    // 04 - OSINT defensivo
 *      "osint-tools.png",      // 05 - herramientas
 *    ]
 *
 * Formatos soportados: .png, .jpg, .webp, .mp4, .webm
 * Tamaño recomendado: 900x900px para imágenes
 */
