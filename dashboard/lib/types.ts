export type AccentPair = [string, string];

// ─── Standard scenes ─────────────────────────────────────────────────────────

export interface SceneIntro {
  tag: string;
  title: string;
  subtitle: string;
}

export interface SceneLayers {
  tag: string;
  terminal: string[];
  definition: string;
  detail: string;
}

export interface ScenePhase {
  phase: string;
  timestamp: string;
  title: string;
  narrative: string;
  detail: string;
  indicator: [string, string];
}

export interface SceneReality {
  tag: string;
  title: string;
  actions: [string, string, string, string];
}

export interface SceneClose {
  tag: string;
  title: string;
  subtitle: string;
}

export interface VideoScript {
  slug: string;
  displayTitle: string;
  compositionType?: "standard";
  targetDurationSeconds: number;
  accents: {
    intro:   AccentPair;
    layers:  AccentPair;
    phase1:  AccentPair;
    phase2:  AccentPair;
    phase3:  AccentPair;
    reality: AccentPair;
    close:   AccentPair;
  };
  scenes: {
    intro:   SceneIntro;
    layers:  SceneLayers;
    phase1:  ScenePhase;
    phase2:  ScenePhase;
    phase3:  ScenePhase;
    reality: SceneReality;
    close:   SceneClose;
  };
  imagePrompts: {
    intro:   string;
    layers:  string;
    phase1:  string;
    phase2:  string;
    phase3:  string;
    reality: string;
    close:   string;
  };
}

// ─── Timeline scenes ──────────────────────────────────────────────────────────

export interface SceneEvent {
  event: string;    // e.g. "PRIMER ATAQUE"
  year: string;     // e.g. "2010"
  headline: string; // e.g. "STUXNET\nDESCUBIERTO"
  impact: string;   // brief impact — máx 120 chars
}

export type SceneKeyTimeline = "intro" | "event1" | "event2" | "event3" | "event4" | "today" | "close";

export interface VideoScriptTimeline {
  slug: string;
  displayTitle: string;
  compositionType: "timeline";
  targetDurationSeconds: number;
  accents: Record<SceneKeyTimeline, AccentPair>;
  scenes: {
    intro:  SceneIntro;
    event1: SceneEvent;
    event2: SceneEvent;
    event3: SceneEvent;
    event4: SceneEvent;
    today:  SceneReality;
    close:  SceneClose;
  };
  imagePrompts: Record<SceneKeyTimeline, string>;
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type AnyVideoScript = VideoScript | VideoScriptTimeline;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export type SceneKey = keyof VideoScript["scenes"];

export const SCENE_LABELS: Record<SceneKey, string> = {
  intro:   "Introducción",
  layers:  "Explicación",
  phase1:  "Fase 01",
  phase2:  "Fase 02",
  phase3:  "Fase 03",
  reality: "Realidad",
  close:   "Cierre",
};

export const SCENE_LABELS_TIMELINE: Record<SceneKeyTimeline, string> = {
  intro:  "Introducción",
  event1: "Evento 01",
  event2: "Evento 02",
  event3: "Evento 03",
  event4: "Evento 04",
  today:  "Actualidad",
  close:  "Cierre",
};

export function getSceneLabels(script: AnyVideoScript): Record<string, string> {
  return script.compositionType === "timeline"
    ? (SCENE_LABELS_TIMELINE as Record<string, string>)
    : (SCENE_LABELS as Record<string, string>);
}

export function getSceneKeys(script: AnyVideoScript): string[] {
  return script.compositionType === "timeline"
    ? ["intro", "event1", "event2", "event3", "event4", "today", "close"]
    : ["intro", "layers", "phase1", "phase2", "phase3", "reality", "close"];
}

export interface GeneratedImage {
  sceneKey: string;
  filename: string;
  b64: string;
}
