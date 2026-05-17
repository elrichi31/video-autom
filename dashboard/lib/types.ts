export type AccentPair = [string, string];

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

export interface GeneratedImage {
  sceneKey: SceneKey;
  filename: string;
  b64: string;
}
