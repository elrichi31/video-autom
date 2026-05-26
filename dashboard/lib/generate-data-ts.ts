import type { AnyVideoScript, VideoScript, VideoScriptTimeline } from "./types";
import { getSceneDurations, getTimelineSceneDurations, DEFAULT_TARGET_DURATION } from "./voiceover-types";

export function generateDataTs(script: AnyVideoScript): string {
  if (script.compositionType === "timeline") return generateTimelineDataTs(script as VideoScriptTimeline);
  return generateStandardDataTs(script as VideoScript);
}

function generateStandardDataTs(script: VideoScript): string {
  const { slug, accents, scenes } = script;
  const CONST = slug.toUpperCase().replace(/-/g, "_");
  const total = script.targetDurationSeconds ?? DEFAULT_TARGET_DURATION;
  const d = getSceneDurations(total);

  return `export type AccentPair = [string, string];

export const ${CONST}_FPS = 30;

// Target duration: ${total}s — scene durations scaled proportionally
export const ${CONST}_DURATIONS = {
  intro:   ${d.intro}   * ${CONST}_FPS,
  layers:  ${d.layers}  * ${CONST}_FPS,
  phase1:  ${d.phase1}  * ${CONST}_FPS,
  phase2:  ${d.phase2}  * ${CONST}_FPS,
  phase3:  ${d.phase3}  * ${CONST}_FPS,
  reality: ${d.reality} * ${CONST}_FPS,
  close:   ${d.close}   * ${CONST}_FPS,
} as const;

export const ${CONST}_TOTAL_DURATION =
  ${CONST}_DURATIONS.intro +
  ${CONST}_DURATIONS.layers +
  ${CONST}_DURATIONS.phase1 +
  ${CONST}_DURATIONS.phase2 +
  ${CONST}_DURATIONS.phase3 +
  ${CONST}_DURATIONS.reality +
  ${CONST}_DURATIONS.close;

export const ${CONST}_ACCENTS = {
  intro:   ${JSON.stringify(accents.intro)} as AccentPair,
  layers:  ${JSON.stringify(accents.layers)} as AccentPair,
  phase1:  ${JSON.stringify(accents.phase1)} as AccentPair,
  phase2:  ${JSON.stringify(accents.phase2)} as AccentPair,
  phase3:  ${JSON.stringify(accents.phase3)} as AccentPair,
  reality: ${JSON.stringify(accents.reality)} as AccentPair,
  close:   ${JSON.stringify(accents.close)} as AccentPair,
};

export const ${CONST}_INTRO = ${JSON.stringify(scenes.intro, null, 2)};

export const ${CONST}_LAYERS = ${JSON.stringify(scenes.layers, null, 2)};

export const ${CONST}_PHASE1 = ${JSON.stringify(scenes.phase1, null, 2)};

export const ${CONST}_PHASE2 = ${JSON.stringify(scenes.phase2, null, 2)};

export const ${CONST}_PHASE3 = ${JSON.stringify(scenes.phase3, null, 2)};

export const ${CONST}_REALITY = ${JSON.stringify(scenes.reality, null, 2)};

export const ${CONST}_CLOSE = ${JSON.stringify(scenes.close, null, 2)};
`;
}

function generateTimelineDataTs(script: VideoScriptTimeline): string {
  const { slug, accents, scenes } = script;
  const CONST = slug.toUpperCase().replace(/-/g, "_");
  const total = script.targetDurationSeconds ?? DEFAULT_TARGET_DURATION;
  const d = getTimelineSceneDurations(total);

  return `export type AccentPair = [string, string];

export const ${CONST}_FPS = 30;

// Target duration: ${total}s — timeline scene durations
export const ${CONST}_DURATIONS = {
  intro:  ${d.intro}  * ${CONST}_FPS,
  event1: ${d.event1} * ${CONST}_FPS,
  event2: ${d.event2} * ${CONST}_FPS,
  event3: ${d.event3} * ${CONST}_FPS,
  event4: ${d.event4} * ${CONST}_FPS,
  today:  ${d.today}  * ${CONST}_FPS,
  close:  ${d.close}  * ${CONST}_FPS,
} as const;

export const ${CONST}_TOTAL_DURATION =
  ${CONST}_DURATIONS.intro +
  ${CONST}_DURATIONS.event1 +
  ${CONST}_DURATIONS.event2 +
  ${CONST}_DURATIONS.event3 +
  ${CONST}_DURATIONS.event4 +
  ${CONST}_DURATIONS.today +
  ${CONST}_DURATIONS.close;

export const ${CONST}_ACCENTS = {
  intro:  ${JSON.stringify(accents.intro)}  as AccentPair,
  event1: ${JSON.stringify(accents.event1)} as AccentPair,
  event2: ${JSON.stringify(accents.event2)} as AccentPair,
  event3: ${JSON.stringify(accents.event3)} as AccentPair,
  event4: ${JSON.stringify(accents.event4)} as AccentPair,
  today:  ${JSON.stringify(accents.today)}  as AccentPair,
  close:  ${JSON.stringify(accents.close)}  as AccentPair,
};

export const ${CONST}_INTRO = ${JSON.stringify(scenes.intro, null, 2)};

export const ${CONST}_EVENT1 = ${JSON.stringify(scenes.event1, null, 2)};

export const ${CONST}_EVENT2 = ${JSON.stringify(scenes.event2, null, 2)};

export const ${CONST}_EVENT3 = ${JSON.stringify(scenes.event3, null, 2)};

export const ${CONST}_EVENT4 = ${JSON.stringify(scenes.event4, null, 2)};

export const ${CONST}_TODAY = ${JSON.stringify(scenes.today, null, 2)};

export const ${CONST}_CLOSE = ${JSON.stringify(scenes.close, null, 2)};
`;
}
