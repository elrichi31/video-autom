import type { FC } from "react";
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
  ESCASEZ_TOKENS_IA_ACCENTS as ACCENTS,
  ESCASEZ_TOKENS_IA_CLOSE as CLOSE,
  ESCASEZ_TOKENS_IA_DURATIONS as D,
  ESCASEZ_TOKENS_IA_INTRO as INTRO,
  ESCASEZ_TOKENS_IA_LAYERS as LAYERS,
  ESCASEZ_TOKENS_IA_PHASE1 as PHASE1,
  ESCASEZ_TOKENS_IA_PHASE2 as PHASE2,
  ESCASEZ_TOKENS_IA_PHASE3 as PHASE3,
  ESCASEZ_TOKENS_IA_REALITY as REALITY,
  ESCASEZ_TOKENS_IA_TOTAL_DURATION as TOTAL,
} from "./escasez-tokens-ia/data";

const FPS = 30;
const SIL = 45;

export const escasezTokensIaDuration = TOTAL + 7 * SIL;

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
      frames = Math.ceil(secs * FPS) + SIL;
    } else {
      frames = (D as Record<string, number>)[key] + SIL;
    }
    sd[key] = frames;
    total += frames;
  }
  return { durationInFrames: total, props: { ...props, sceneDurations: sd } };
};


/* ─── intro ─── */
const IntroScene: FC = () => (
  <DarkShell accent={ACCENTS.intro} durationInFrames={D.intro} variant="alert" bgSrc={staticFile("escasez-tokens-ia/escasez-tokens-ia-intro.png")}>
    <AlertLayout
      tag={<BlockSequence from={0} durationInFrames={D.intro}><Reveal y={12} blurFrom={8}><PhaseLabel text={INTRO.tag} accent={ACCENTS.intro[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={6} durationInFrames={D.intro - 6}><Reveal y={50} scaleFrom={0.88} blurFrom={30} durationInFrames={38}><GlitchTitle text={INTRO.title} accent={ACCENTS.intro} size={136} /></Reveal></BlockSequence>}
      subtitle={<BlockSequence from={24} durationInFrames={D.intro - 24}><Reveal y={16} blurFrom={10}><DetailText text={INTRO.subtitle} size={30} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── layers ─── */
const LayersScene: FC = () => (
  <DarkShell accent={ACCENTS.layers} durationInFrames={D.layers} variant="terminal" bgSrc={staticFile("escasez-tokens-ia/escasez-tokens-ia-layers.png")}>
    <ExplainLayout
      tag={<BlockSequence from={0} durationInFrames={D.layers}><Reveal y={12} blurFrom={8}><PhaseLabel text={LAYERS.tag} accent={ACCENTS.layers[0]} /></Reveal></BlockSequence>}
      terminal={<BlockSequence from={10} durationInFrames={D.layers - 10}><Reveal y={20} blurFrom={14}><TerminalBlock lines={LAYERS.terminal} accent={ACCENTS.layers} startFrame={12} /></Reveal></BlockSequence>}
      definition={<BlockSequence from={60} durationInFrames={D.layers - 60}><Reveal y={36} scaleFrom={0.94} blurFrom={22}><NarrativeText text={LAYERS.definition} size={62} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── phase scene ─── */
type PhaseKey = "phase1" | "phase2" | "phase3";
const PhaseScene: FC<{ pk: PhaseKey }> = ({ pk }) => {
  const data   = pk === "phase1" ? PHASE1 : pk === "phase2" ? PHASE2 : PHASE3;
  const accent = ACCENTS[pk];
  const dur    = D[pk];
  const imgSrc = pk === "phase1" ? "escasez-tokens-ia/escasez-tokens-ia-phase1.png" : pk === "phase2" ? "escasez-tokens-ia/escasez-tokens-ia-phase2.png" : "escasez-tokens-ia/escasez-tokens-ia-phase3.png";
  return (
    <DarkShell accent={accent} durationInFrames={dur} variant="body" bgSrc={staticFile(imgSrc)}>
      <PhaseLayout
        timestamp={<BlockSequence from={6} durationInFrames={dur - 6}><Reveal y={10} blurFrom={6}><TimestampDisplay time={data.timestamp} accent={accent} /></Reveal></BlockSequence>}
        title={<BlockSequence from={12} durationInFrames={dur - 12}><Reveal y={44} scaleFrom={0.9} blurFrom={28} durationInFrames={36}><GlitchTitle text={data.title} accent={accent} size={130} /></Reveal></BlockSequence>}
        indicator={<BlockSequence from={62} durationInFrames={dur - 62}><Reveal y={20} blurFrom={12}><IndicatorCard accent={accent} items={data.indicator} /></Reveal></BlockSequence>}
      />
    </DarkShell>
  );
};

/* ─── reality ─── */
const RealityScene: FC = () => (
  <DarkShell accent={ACCENTS.reality} durationInFrames={D.reality} variant="body" bgSrc={staticFile("escasez-tokens-ia/escasez-tokens-ia-reality.png")}>
    <DefenseLayout
      tag={<BlockSequence from={0} durationInFrames={D.reality}><Reveal y={12} blurFrom={8}><PhaseLabel text={REALITY.tag} accent={ACCENTS.reality[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={10} durationInFrames={D.reality - 10}><Reveal y={38} scaleFrom={0.93} blurFrom={24}><NarrativeText text={REALITY.title} size={58} /></Reveal></BlockSequence>}
      actions={<BlockSequence from={34} durationInFrames={D.reality - 34}><Reveal y={24} blurFrom={14}><ActionList items={REALITY.actions} accent={ACCENTS.reality} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── close ─── */
const CloseScene: FC = () => (
  <DarkShell accent={ACCENTS.close} durationInFrames={D.close} variant="close" bgSrc={staticFile("escasez-tokens-ia/escasez-tokens-ia-close.png")}>
    <CloseLayout
      tag={<BlockSequence from={0} durationInFrames={D.close}><Reveal y={12} blurFrom={8}><PhaseLabel text={CLOSE.tag} accent={ACCENTS.close[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={8} durationInFrames={D.close - 8}><Reveal y={40} scaleFrom={0.92} blurFrom={26} durationInFrames={36}><GlitchTitle text={CLOSE.title} accent={ACCENTS.close} size={96} /></Reveal></BlockSequence>}
      subtitle={<BlockSequence from={30} durationInFrames={D.close - 30}><Reveal y={18} blurFrom={10}><NarrativeText text={CLOSE.subtitle} size={46} accent="rgba(255,255,255,0.85)" /></Reveal></BlockSequence>}
      bar={<BlockSequence from={40} durationInFrames={D.close - 40}><Reveal y={10} blurFrom={6}><AccentBar accent={ACCENTS.close} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── main ─── */
export const EscasezTokensIaComposition: FC<Props> = ({ voiceoverFile = null, voiceoverFiles = null, sceneDurations = null }) => {
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
      <Sequence from={off.intro}   durationInFrames={dur("intro")}>   {a("intro")}   <IntroScene /></Sequence>
      <Sequence from={off.layers}  durationInFrames={dur("layers")}>  {a("layers")}  <LayersScene /></Sequence>
      <Sequence from={off.phase1}  durationInFrames={dur("phase1")}>  {a("phase1")}  <PhaseScene pk="phase1" /></Sequence>
      <Sequence from={off.phase2}  durationInFrames={dur("phase2")}>  {a("phase2")}  <PhaseScene pk="phase2" /></Sequence>
      <Sequence from={off.phase3}  durationInFrames={dur("phase3")}>  {a("phase3")}  <PhaseScene pk="phase3" /></Sequence>
      <Sequence from={off.reality} durationInFrames={dur("reality")}> {a("reality")} <RealityScene /></Sequence>
      <Sequence from={off.close}   durationInFrames={dur("close")}>   {a("close")}   <CloseScene /></Sequence>
    </>
  );
};
