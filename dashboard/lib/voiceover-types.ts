export interface SceneVoiceover {
  text: string;
  durationSeconds: number;
  wordCount: number;
}

export interface VoiceoverScript {
  scenes: {
    intro:   SceneVoiceover;
    layers:  SceneVoiceover;
    phase1:  SceneVoiceover;
    phase2:  SceneVoiceover;
    phase3:  SceneVoiceover;
    reality: SceneVoiceover;
    close:   SceneVoiceover;
  };
  fullScript: string;
  totalDurationSeconds: number;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  preview_url: string | null;
}

export interface VoiceSettings {
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
  style: number;
  speed: number;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  voiceId:        "pNInz6obpgDQGcFmaJgB", // Adam — deep, professional
  modelId:        "eleven_multilingual_v2",
  stability:      0.55,
  similarityBoost: 0.75,
  style:          0.35,
  speed:          1.0,
};

// Speaking rate for timing: ~155 words per minute in Spanish at speed 1.0
export const WORDS_PER_SECOND = 155 / 60; // ≈ 2.58

export const SCENE_DURATIONS: Record<string, number> = {
  intro:   3,
  layers:  6,
  phase1:  7,
  phase2:  7,
  phase3:  7,
  reality: 7,
  close:   4,
};
