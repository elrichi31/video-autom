import type { VideoScript } from "./types";

export function generateDataTs(script: VideoScript): string {
  const { slug, accents, scenes } = script;
  const CONST = slug.toUpperCase().replace(/-/g, "_");

  return `export type AccentPair = [string, string];

export const ${CONST}_FPS = 30;

export const ${CONST}_DURATIONS = {
  intro:   3 * ${CONST}_FPS,
  layers:  6 * ${CONST}_FPS,
  phase1:  7 * ${CONST}_FPS,
  phase2:  7 * ${CONST}_FPS,
  phase3:  7 * ${CONST}_FPS,
  reality: 7 * ${CONST}_FPS,
  close:   4 * ${CONST}_FPS,
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
