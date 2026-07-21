import type { AnyVideoScript, VideoScript, VideoScriptTimeline } from "./types";

export interface CompositionValidationError {
  file: string;
  rule: string;
  detail: string;
}

export function validateCompositionTsx(content: string, slug: string): CompositionValidationError[] {
  const errors: CompositionValidationError[] = [];
  const file = `${slug}Composition.tsx`;

  const checks: Array<{ rule: string; detail: string; pass: boolean }> = [
    {
      rule: "correct-import-path",
      detail: "Import must use './dark-web/components', not '../dark-web/components'",
      pass: content.includes("./dark-web/components") && !content.includes("../dark-web/components"),
    },
    {
      rule: "voiceover-files-prop",
      detail: "Component must accept voiceoverFiles prop (SceneAudio type)",
      pass: content.includes("voiceoverFiles") && content.includes("SceneAudio"),
    },
    {
      rule: "per-scene-audio-helper",
      detail: "Must have per-scene audio helper a(key)",
      pass: content.includes("const a = (key"),
    },
    {
      rule: "duration-export-camelcase",
      detail: "Duration export must be camelCase (e.g. mySlugDuration = TOTAL + 7 * SIL)",
      pass: /export const [a-z][a-zA-Z0-9]+Duration = TOTAL/.test(content),
    },
    {
      rule: "silence-buffer",
      detail: "Must have SIL silence buffer (const SIL = ...) and use sceneDurations offsets",
      pass: content.includes("const SIL =") && content.includes("sceneDurations"),
    },
  ];

  for (const check of checks) {
    if (!check.pass) {
      errors.push({ file, rule: check.rule, detail: check.detail });
    }
  }
  return errors;
}

export function generateCompositionTsx(script: AnyVideoScript): string {
  if (script.compositionType === "timeline") return generateTimelineCompositionTsx(script as VideoScriptTimeline);
  return generateStandardCompositionTsx(script as VideoScript);
}

function generateStandardCompositionTsx(script: VideoScript): string {
  const { slug } = script;
  const CONST = slug.toUpperCase().replace(/-/g, "_");
  const ComponentName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("") + "Composition";

  const imageFiles = [
    "intro", "layers", "phase1", "phase2", "phase3", "reality", "close",
  ].map((k) => `"${slug}/${slug}-${k}.png"`);

  const durationVar = ComponentName.replace("Composition", "Duration");
  const durationExport = durationVar.charAt(0).toLowerCase() + durationVar.slice(1);
  const camelSlug = slug.replace(/-(\w)/g, (_: string, c: string) => c.toUpperCase());

  return `import type { FC } from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import {
  AccentBar,
  ActionList,
  AlertLayout,
  BlockSequence,
  CloseLayout,
  DarkShell,
  DefenseLayout,
  DetailText,
  ExplainLayout,
  GlitchTitle,
  IndicatorCard,
  NarrativeText,
  PhaseLabel,
  PhaseLayout,
  Reveal,
  TerminalBlock,
  TimestampDisplay,
} from "./dark-web/components";
import {
  ${CONST}_ACCENTS as ACCENTS,
  ${CONST}_CLOSE as CLOSE,
  ${CONST}_DURATIONS as D,
  ${CONST}_HOOK_STYLE as HOOK_STYLE,
  ${CONST}_INTRO as INTRO,
  ${CONST}_LAYERS as LAYERS,
  ${CONST}_NICHE as NICHE,
  ${CONST}_PHASE1 as PHASE1,
  ${CONST}_PHASE2 as PHASE2,
  ${CONST}_PHASE3 as PHASE3,
  ${CONST}_REALITY as REALITY,
  ${CONST}_TOTAL_DURATION as TOTAL,
} from "./${slug}/data";

const FPS = 30;
// A short breath after each scene prevents clipped finals without turning a
// 45-second narration into a minute-long video. TAIL covers minor MP3
// duration under-reporting by getAudioDurationInSeconds.
const SIL = 12;
const TAIL = 4;

type SceneKey = "intro"|"layers"|"phase1"|"phase2"|"phase3"|"reality"|"close";
type SceneAudio = Partial<Record<SceneKey, string>>;
type SceneDurations = Partial<Record<SceneKey, number>>;
type Props = {
  voiceoverFile?: string | null;
  voiceoverFiles?: SceneAudio | null;
  sceneDurations?: SceneDurations | null;
};

const SCENE_KEYS: SceneKey[] = ["intro","layers","phase1","phase2","phase3","reality","close"];

export const calculateMetadata = async ({ props }: { props: Props }) => {
  if (!props.voiceoverFiles) return {};
  const sd: SceneDurations = {};
  let total = 0;
  for (const key of SCENE_KEYS) {
    const file = props.voiceoverFiles[key];
    let frames: number;
    if (file) {
      const secs = await getAudioDurationInSeconds(staticFile(file));
      frames = Math.ceil(secs * FPS) + TAIL + SIL;
    } else {
      frames = (D as Record<string, number>)[key] + SIL;
    }
    sd[key] = frames;
    total += frames;
  }
  return { durationInFrames: total, props: { ...props, sceneDurations: sd } };
};

export const ${durationExport} = TOTAL + 7 * SIL;

const INTRO_MOTION = HOOK_STYLE === "shock"
  ? { titleFrom: 4, subtitleFrom: 18, titleSize: 148, titleY: 62, subtitleSize: 32 }
  : HOOK_STYLE === "countdown"
    ? { titleFrom: 8, subtitleFrom: 22, titleSize: 142, titleY: 56, subtitleSize: 30 }
    : HOOK_STYLE === "contrarian"
      ? { titleFrom: 10, subtitleFrom: 24, titleSize: 132, titleY: 48, subtitleSize: 31 }
      : HOOK_STYLE === "real-story"
        ? { titleFrom: 12, subtitleFrom: 28, titleSize: 126, titleY: 42, subtitleSize: 33 }
        : { titleFrom: 9, subtitleFrom: 26, titleSize: 136, titleY: 50, subtitleSize: 31 };

const TITLE_SCALE = NICHE === "history" ? 0.94 : NICHE === "news" ? 0.92 : 1;
const BODY_TITLE_SIZE = Math.round((NICHE === "history" ? 118 : NICHE === "news" ? 114 : 130) * TITLE_SCALE);
const CLOSE_TITLE_SIZE = Math.round((NICHE === "history" ? 104 : NICHE === "news" ? 92 : 96) * TITLE_SCALE);

/* ─── intro ─── */
const IntroScene: FC<{ d: number }> = ({ d }) => (
  <DarkShell accent={ACCENTS.intro} durationInFrames={d} variant="alert" bgSrc={staticFile(${imageFiles[0]})} niche={NICHE} hookStyle={HOOK_STYLE} sceneKey="intro">
    <AlertLayout
      tag={<BlockSequence from={0} durationInFrames={d}><Reveal y={12} blurFrom={8}><PhaseLabel text={INTRO.tag} accent={ACCENTS.intro[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={INTRO_MOTION.titleFrom} durationInFrames={d - INTRO_MOTION.titleFrom}><Reveal y={INTRO_MOTION.titleY} scaleFrom={0.88} blurFrom={30} durationInFrames={38}><GlitchTitle text={INTRO.title} accent={ACCENTS.intro} size={Math.round(INTRO_MOTION.titleSize * TITLE_SCALE)} /></Reveal></BlockSequence>}
      subtitle={<BlockSequence from={INTRO_MOTION.subtitleFrom} durationInFrames={d - INTRO_MOTION.subtitleFrom}><Reveal y={16} blurFrom={10}><DetailText text={INTRO.subtitle} size={INTRO_MOTION.subtitleSize} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── layers ─── */
const LayersScene: FC<{ d: number }> = ({ d }) => (
  <DarkShell accent={ACCENTS.layers} durationInFrames={d} variant="terminal" bgSrc={staticFile(${imageFiles[1]})} niche={NICHE} hookStyle={HOOK_STYLE} sceneKey="layers">
    <ExplainLayout
      tag={<BlockSequence from={0} durationInFrames={d}><Reveal y={12} blurFrom={8}><PhaseLabel text={LAYERS.tag} accent={ACCENTS.layers[0]} /></Reveal></BlockSequence>}
      terminal={<BlockSequence from={10} durationInFrames={d - 10}><Reveal y={20} blurFrom={14}><TerminalBlock lines={LAYERS.terminal} accent={ACCENTS.layers} startFrame={12} /></Reveal></BlockSequence>}
      definition={<BlockSequence from={60} durationInFrames={d - 60}><Reveal y={36} scaleFrom={0.94} blurFrom={22}><NarrativeText text={LAYERS.definition} size={62} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── phase scene ─── */
type PhaseKey = "phase1" | "phase2" | "phase3";
const PhaseScene: FC<{ pk: PhaseKey; d: number }> = ({ pk, d }) => {
  const data   = pk === "phase1" ? PHASE1 : pk === "phase2" ? PHASE2 : PHASE3;
  const accent = ACCENTS[pk];
  const dur    = d;
  const imgSrc = pk === "phase1" ? ${imageFiles[2]} : pk === "phase2" ? ${imageFiles[3]} : ${imageFiles[4]};
  return (
    <DarkShell accent={accent} durationInFrames={dur} variant="body" bgSrc={staticFile(imgSrc)} niche={NICHE} hookStyle={HOOK_STYLE} sceneKey={pk}>
      <PhaseLayout
        timestamp={<BlockSequence from={6} durationInFrames={dur - 6}><Reveal y={10} blurFrom={6}><TimestampDisplay time={data.timestamp} accent={accent} /></Reveal></BlockSequence>}
        title={<BlockSequence from={12} durationInFrames={dur - 12}><Reveal y={44} scaleFrom={0.9} blurFrom={28} durationInFrames={36}><GlitchTitle text={data.title} accent={accent} size={BODY_TITLE_SIZE} /></Reveal></BlockSequence>}
        indicator={<BlockSequence from={62} durationInFrames={dur - 62}><Reveal y={20} blurFrom={12}><IndicatorCard accent={accent} items={data.indicator} /></Reveal></BlockSequence>}
      />
    </DarkShell>
  );
};

/* ─── reality ─── */
const RealityScene: FC<{ d: number }> = ({ d }) => (
  <DarkShell accent={ACCENTS.reality} durationInFrames={d} variant="body" bgSrc={staticFile(${imageFiles[5]})} niche={NICHE} hookStyle={HOOK_STYLE} sceneKey="reality">
    <DefenseLayout
      tag={<BlockSequence from={0} durationInFrames={d}><Reveal y={12} blurFrom={8}><PhaseLabel text={REALITY.tag} accent={ACCENTS.reality[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={10} durationInFrames={d - 10}><Reveal y={38} scaleFrom={0.93} blurFrom={24}><NarrativeText text={REALITY.title} size={58} /></Reveal></BlockSequence>}
      actions={<BlockSequence from={34} durationInFrames={d - 34}><Reveal y={24} blurFrom={14}><ActionList items={REALITY.actions} accent={ACCENTS.reality} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── close ─── */
const CloseScene: FC<{ d: number }> = ({ d }) => (
  <DarkShell accent={ACCENTS.close} durationInFrames={d} variant="close" bgSrc={staticFile(${imageFiles[6]})} niche={NICHE} hookStyle={HOOK_STYLE} sceneKey="close">
    <CloseLayout
      tag={<BlockSequence from={0} durationInFrames={d}><Reveal y={12} blurFrom={8}><PhaseLabel text={CLOSE.tag} accent={ACCENTS.close[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={8} durationInFrames={d - 8}><Reveal y={40} scaleFrom={0.92} blurFrom={26} durationInFrames={36}><GlitchTitle text={CLOSE.title} accent={ACCENTS.close} size={CLOSE_TITLE_SIZE} /></Reveal></BlockSequence>}
      subtitle={<BlockSequence from={30} durationInFrames={d - 30}><Reveal y={18} blurFrom={10}><NarrativeText text={CLOSE.subtitle} size={46} accent="rgba(255,255,255,0.85)" /></Reveal></BlockSequence>}
      bar={<BlockSequence from={40} durationInFrames={d - 40}><Reveal y={10} blurFrom={6}><AccentBar accent={ACCENTS.close} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── main ─── */
export const ${ComponentName}: FC<Props> = ({ voiceoverFile = null, voiceoverFiles = null, sceneDurations = null }) => {
  const dur = (key: SceneKey) => sceneDurations?.[key] ?? (D as Record<string, number>)[key] + SIL;
  const off = {
    intro:   0,
    layers:  dur("intro"),
    phase1:  dur("intro") + dur("layers"),
    phase2:  dur("intro") + dur("layers") + dur("phase1"),
    phase3:  dur("intro") + dur("layers") + dur("phase1") + dur("phase2"),
    reality: dur("intro") + dur("layers") + dur("phase1") + dur("phase2") + dur("phase3"),
    close:   dur("intro") + dur("layers") + dur("phase1") + dur("phase2") + dur("phase3") + dur("reality"),
  };
  const a = (key: SceneKey) => voiceoverFiles?.[key]
    ? <Audio src={staticFile(voiceoverFiles[key]!)} volume={1} />
    : null;
  return (
    <>
      {!voiceoverFiles && voiceoverFile && <Audio src={staticFile(voiceoverFile)} volume={1} />}
      <Sequence from={off.intro}   durationInFrames={dur("intro")}>   {a("intro")}   <IntroScene d={dur("intro")} /></Sequence>
      <Sequence from={off.layers}  durationInFrames={dur("layers")}>  {a("layers")}  <LayersScene d={dur("layers")} /></Sequence>
      <Sequence from={off.phase1}  durationInFrames={dur("phase1")}>  {a("phase1")}  <PhaseScene pk="phase1" d={dur("phase1")} /></Sequence>
      <Sequence from={off.phase2}  durationInFrames={dur("phase2")}>  {a("phase2")}  <PhaseScene pk="phase2" d={dur("phase2")} /></Sequence>
      <Sequence from={off.phase3}  durationInFrames={dur("phase3")}>  {a("phase3")}  <PhaseScene pk="phase3" d={dur("phase3")} /></Sequence>
      <Sequence from={off.reality} durationInFrames={dur("reality")}> {a("reality")} <RealityScene d={dur("reality")} /></Sequence>
      <Sequence from={off.close}   durationInFrames={dur("close")}>   {a("close")}   <CloseScene d={dur("close")} /></Sequence>
    </>
  );
};
`;
  void camelSlug; // used by registerInRoot caller
}

function generateTimelineCompositionTsx(script: VideoScriptTimeline): string {
  const { slug } = script;
  const CONST = slug.toUpperCase().replace(/-/g, "_");
  const ComponentName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("") + "Composition";

  const durationVar = ComponentName.replace("Composition", "Duration");
  const durationExport = durationVar.charAt(0).toLowerCase() + durationVar.slice(1);
  const camelSlug = slug.replace(/-(\w)/g, (_: string, c: string) => c.toUpperCase());

  void camelSlug;

  return `import type { FC } from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import {
  AccentBar,
  ActionList,
  AlertLayout,
  BlockSequence,
  CloseLayout,
  DarkShell,
  DefenseLayout,
  EventLayout,
  GlitchTitle,
  NarrativeText,
  PhaseLabel,
  Reveal,
  YearBadge,
} from "./dark-web/components";
import {
  ${CONST}_ACCENTS as ACCENTS,
  ${CONST}_CLOSE as CLOSE,
  ${CONST}_DURATIONS as D,
  ${CONST}_HOOK_STYLE as HOOK_STYLE,
  ${CONST}_INTRO as INTRO,
  ${CONST}_EVENT1 as EVENT1,
  ${CONST}_EVENT2 as EVENT2,
  ${CONST}_EVENT3 as EVENT3,
  ${CONST}_EVENT4 as EVENT4,
  ${CONST}_NICHE as NICHE,
  ${CONST}_TODAY as TODAY,
  ${CONST}_TOTAL_DURATION as TOTAL,
} from "./${slug}/data";

const FPS = 30;
// A short breath after each scene prevents clipped finals without turning a
// 45-second narration into a minute-long video. TAIL covers minor MP3
// duration under-reporting by getAudioDurationInSeconds.
const SIL = 12;
const TAIL = 4;

type SceneKey = "intro"|"event1"|"event2"|"event3"|"event4"|"today"|"close";
type SceneAudio = Partial<Record<SceneKey, string>>;
type SceneDurations = Partial<Record<SceneKey, number>>;
type Props = {
  voiceoverFile?: string | null;
  voiceoverFiles?: SceneAudio | null;
  sceneDurations?: SceneDurations | null;
};

const SCENE_KEYS: SceneKey[] = ["intro","event1","event2","event3","event4","today","close"];

export const calculateMetadata = async ({ props }: { props: Props }) => {
  if (!props.voiceoverFiles) return {};
  const sd: SceneDurations = {};
  let total = 0;
  for (const key of SCENE_KEYS) {
    const file = props.voiceoverFiles[key];
    let frames: number;
    if (file) {
      const secs = await getAudioDurationInSeconds(staticFile(file));
      frames = Math.ceil(secs * FPS) + TAIL + SIL;
    } else {
      frames = (D as Record<string, number>)[key] + SIL;
    }
    sd[key] = frames;
    total += frames;
  }
  return { durationInFrames: total, props: { ...props, sceneDurations: sd } };
};

export const ${durationExport} = TOTAL + 7 * SIL;

const INTRO_MOTION = HOOK_STYLE === "shock"
  ? { titleFrom: 4, subtitleFrom: 18, titleSize: 148, titleY: 62, subtitleSize: 32 }
  : HOOK_STYLE === "countdown"
    ? { titleFrom: 8, subtitleFrom: 22, titleSize: 142, titleY: 56, subtitleSize: 30 }
    : HOOK_STYLE === "contrarian"
      ? { titleFrom: 10, subtitleFrom: 24, titleSize: 132, titleY: 48, subtitleSize: 31 }
      : HOOK_STYLE === "real-story"
        ? { titleFrom: 12, subtitleFrom: 28, titleSize: 126, titleY: 42, subtitleSize: 33 }
        : { titleFrom: 9, subtitleFrom: 26, titleSize: 136, titleY: 50, subtitleSize: 31 };

const TITLE_SCALE = NICHE === "history" ? 0.94 : NICHE === "news" ? 0.92 : 1;
const EVENT_TITLE_SIZE = Math.round((NICHE === "history" ? 102 : NICHE === "news" ? 98 : 110) * TITLE_SCALE);
const CLOSE_TITLE_SIZE = Math.round((NICHE === "history" ? 104 : NICHE === "news" ? 92 : 96) * TITLE_SCALE);

/* ─── intro ─── */
const IntroScene: FC<{ d: number }> = ({ d }) => (
  <DarkShell accent={ACCENTS.intro} durationInFrames={d} variant="alert" bgSrc={staticFile("${slug}/${slug}-intro.png")} niche={NICHE} hookStyle={HOOK_STYLE} sceneKey="intro">
    <AlertLayout
      tag={<BlockSequence from={0} durationInFrames={d}><Reveal y={12} blurFrom={8}><PhaseLabel text={INTRO.tag} accent={ACCENTS.intro[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={INTRO_MOTION.titleFrom} durationInFrames={d - INTRO_MOTION.titleFrom}><Reveal y={INTRO_MOTION.titleY} scaleFrom={0.88} blurFrom={30} durationInFrames={38}><GlitchTitle text={INTRO.title} accent={ACCENTS.intro} size={Math.round(INTRO_MOTION.titleSize * TITLE_SCALE)} /></Reveal></BlockSequence>}
      subtitle={<BlockSequence from={INTRO_MOTION.subtitleFrom} durationInFrames={d - INTRO_MOTION.subtitleFrom}><Reveal y={16} blurFrom={10}><NarrativeText text={INTRO.subtitle} size={INTRO_MOTION.subtitleSize} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── event scene ─── */
type EventKey = "event1" | "event2" | "event3" | "event4";
const EventScene: FC<{ ek: EventKey; d: number }> = ({ ek, d }) => {
  const data   = ek === "event1" ? EVENT1 : ek === "event2" ? EVENT2 : ek === "event3" ? EVENT3 : EVENT4;
  const accent = ACCENTS[ek];
  const dur    = d;
  const imgSrc = \`${slug}/${slug}-\${ek}.png\`;
  return (
    <DarkShell accent={accent} durationInFrames={dur} variant="body" bgSrc={staticFile(imgSrc)} niche={NICHE} hookStyle={HOOK_STYLE} sceneKey={ek}>
      <EventLayout
        tag={<BlockSequence from={0} durationInFrames={dur}><Reveal y={12} blurFrom={8}><PhaseLabel text={data.event} accent={accent[0]} /></Reveal></BlockSequence>}
        year={<BlockSequence from={8} durationInFrames={dur - 8}><Reveal y={30} scaleFrom={0.85} blurFrom={22} durationInFrames={36}><YearBadge year={data.year} accent={accent} /></Reveal></BlockSequence>}
        headline={<BlockSequence from={20} durationInFrames={dur - 20}><Reveal y={18} blurFrom={14} durationInFrames={30}><GlitchTitle text={data.headline} accent={accent} size={EVENT_TITLE_SIZE} /></Reveal></BlockSequence>}
        impact={<BlockSequence from={54} durationInFrames={dur - 54}><Reveal y={14} blurFrom={10}><NarrativeText text={data.impact} size={40} /></Reveal></BlockSequence>}
      />
    </DarkShell>
  );
};

/* ─── today ─── */
const TodayScene: FC<{ d: number }> = ({ d }) => (
  <DarkShell accent={ACCENTS.today} durationInFrames={d} variant="body" bgSrc={staticFile("${slug}/${slug}-today.png")} niche={NICHE} hookStyle={HOOK_STYLE} sceneKey="today">
    <DefenseLayout
      tag={<BlockSequence from={0} durationInFrames={d}><Reveal y={12} blurFrom={8}><PhaseLabel text={TODAY.tag} accent={ACCENTS.today[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={10} durationInFrames={d - 10}><Reveal y={38} scaleFrom={0.93} blurFrom={24}><NarrativeText text={TODAY.title} size={58} /></Reveal></BlockSequence>}
      actions={<BlockSequence from={34} durationInFrames={d - 34}><Reveal y={24} blurFrom={14}><ActionList items={TODAY.actions} accent={ACCENTS.today} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── close ─── */
const CloseScene: FC<{ d: number }> = ({ d }) => (
  <DarkShell accent={ACCENTS.close} durationInFrames={d} variant="close" bgSrc={staticFile("${slug}/${slug}-close.png")} niche={NICHE} hookStyle={HOOK_STYLE} sceneKey="close">
    <CloseLayout
      tag={<BlockSequence from={0} durationInFrames={d}><Reveal y={12} blurFrom={8}><PhaseLabel text={CLOSE.tag} accent={ACCENTS.close[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={8} durationInFrames={d - 8}><Reveal y={40} scaleFrom={0.92} blurFrom={26} durationInFrames={36}><GlitchTitle text={CLOSE.title} accent={ACCENTS.close} size={CLOSE_TITLE_SIZE} /></Reveal></BlockSequence>}
      subtitle={<BlockSequence from={30} durationInFrames={d - 30}><Reveal y={18} blurFrom={10}><NarrativeText text={CLOSE.subtitle} size={46} accent="rgba(255,255,255,0.85)" /></Reveal></BlockSequence>}
      bar={<BlockSequence from={40} durationInFrames={d - 40}><Reveal y={10} blurFrom={6}><AccentBar accent={ACCENTS.close} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── main ─── */
export const ${ComponentName}: FC<Props> = ({ voiceoverFile = null, voiceoverFiles = null, sceneDurations = null }) => {
  const dur = (key: SceneKey) => sceneDurations?.[key] ?? (D as Record<string, number>)[key] + SIL;
  const off = {
    intro:  0,
    event1: dur("intro"),
    event2: dur("intro") + dur("event1"),
    event3: dur("intro") + dur("event1") + dur("event2"),
    event4: dur("intro") + dur("event1") + dur("event2") + dur("event3"),
    today:  dur("intro") + dur("event1") + dur("event2") + dur("event3") + dur("event4"),
    close:  dur("intro") + dur("event1") + dur("event2") + dur("event3") + dur("event4") + dur("today"),
  };
  const a = (key: SceneKey) => voiceoverFiles?.[key]
    ? <Audio src={staticFile(voiceoverFiles[key]!)} volume={1} />
    : null;
  return (
    <>
      {!voiceoverFiles && voiceoverFile && <Audio src={staticFile(voiceoverFile)} volume={1} />}
      <Sequence from={off.intro}  durationInFrames={dur("intro")}>  {a("intro")}  <IntroScene d={dur("intro")} /></Sequence>
      <Sequence from={off.event1} durationInFrames={dur("event1")}> {a("event1")} <EventScene ek="event1" d={dur("event1")} /></Sequence>
      <Sequence from={off.event2} durationInFrames={dur("event2")}> {a("event2")} <EventScene ek="event2" d={dur("event2")} /></Sequence>
      <Sequence from={off.event3} durationInFrames={dur("event3")}> {a("event3")} <EventScene ek="event3" d={dur("event3")} /></Sequence>
      <Sequence from={off.event4} durationInFrames={dur("event4")}> {a("event4")} <EventScene ek="event4" d={dur("event4")} /></Sequence>
      <Sequence from={off.today}  durationInFrames={dur("today")}>  {a("today")}  <TodayScene d={dur("today")} /></Sequence>
      <Sequence from={off.close}  durationInFrames={dur("close")}>  {a("close")}  <CloseScene d={dur("close")} /></Sequence>
    </>
  );
};
`;
}
