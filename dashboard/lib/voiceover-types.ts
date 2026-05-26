export interface SceneVoiceover {
  text: string;
  durationSeconds: number;
  wordCount: number;
}

export interface VoiceoverScript {
  scenes: Record<string, SceneVoiceover>;
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
  voiceId:         "pNInz6obpgDQGcFmaJgB", // Adam — deep, professional
  modelId:         "eleven_v3",             // más expresivo, ideal TikTok
  stability:       0.45,                    // más expresividad dramática
  similarityBoost: 0.80,
  style:           0.55,                    // emoción y énfasis
  speed:           1.10,                    // ritmo TikTok (ligeramente más rápido)
};

// Speaking rate for timing: ~155 words per minute in Spanish at speed 1.0
export const WORDS_PER_SECOND = 155 / 60; // ≈ 2.58

export const DEFAULT_TARGET_DURATION = 45;

// Proportions derived from the original 41s structure
const SCENE_PROPORTIONS: Record<string, number> = {
  intro:   3 / 41,
  layers:  6 / 41,
  phase1:  7 / 41,
  phase2:  7 / 41,
  phase3:  7 / 41,
  reality: 7 / 41,
  close:   4 / 41,
};

/** Scales scene durations proportionally to a target total, fixing rounding on phase2. */
export function getSceneDurations(totalSeconds: number): Record<string, number> {
  const result: Record<string, number> = {};
  let sum = 0;
  for (const key of Object.keys(SCENE_PROPORTIONS)) {
    result[key] = Math.max(2, Math.round(SCENE_PROPORTIONS[key] * totalSeconds));
    sum += result[key];
  }
  const diff = totalSeconds - sum;
  if (diff !== 0) result["phase2"] = Math.max(2, result["phase2"] + diff);
  return result;
}

// Kept for backwards-compat — existing callers that don't pass a duration
export const SCENE_DURATIONS = getSceneDurations(DEFAULT_TARGET_DURATION);

// ─── Timeline scene durations ─────────────────────────────────────────────────
// 3 + 7*4 + 8 + 6 = 45 for a 45s video
const TIMELINE_SCENE_PROPORTIONS: Record<string, number> = {
  intro:  3 / 45,
  event1: 7 / 45,
  event2: 7 / 45,
  event3: 7 / 45,
  event4: 7 / 45,
  today:  8 / 45,
  close:  6 / 45,
};

export function getTimelineSceneDurations(totalSeconds: number): Record<string, number> {
  const result: Record<string, number> = {};
  let sum = 0;
  for (const key of Object.keys(TIMELINE_SCENE_PROPORTIONS)) {
    result[key] = Math.max(2, Math.round(TIMELINE_SCENE_PROPORTIONS[key] * totalSeconds));
    sum += result[key];
  }
  const diff = totalSeconds - sum;
  if (diff !== 0) result["today"] = Math.max(2, result["today"] + diff);
  return result;
}
