import type { FC } from "react";
import { Audio, Img, Sequence, staticFile } from "remotion";
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
} from "../dark-web/components";
import {
  DEEPFAKES_ACCENTS as ACCENTS,
  DEEPFAKES_CLOSE as CLOSE,
  DEEPFAKES_DURATIONS as D,
  DEEPFAKES_INTRO as INTRO,
  DEEPFAKES_LAYERS as LAYERS,
  DEEPFAKES_PHASE1 as PHASE1,
  DEEPFAKES_PHASE2 as PHASE2,
  DEEPFAKES_PHASE3 as PHASE3,
  DEEPFAKES_REALITY as REALITY,
  DEEPFAKES_TOTAL_DURATION as TOTAL,
} from "./deepfakes/data";

export const deepfakesDuration = TOTAL;

type Props = { voiceoverFile?: string | null };

/* ─── helpers ─── */

const BgImg: FC<{ src: string }> = ({ src }) => (
  <Img
    src={staticFile(src)}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }}
  />
);

/* ─── intro ─── */
const IntroScene: FC = () => (
  <DarkShell accent={ACCENTS.intro} durationInFrames={D.intro} variant="alert">
    <BgImg src={"deepfakes/deepfakes-intro.png"} />
    <AlertLayout
      tag={<BlockSequence from={0} durationInFrames={D.intro}><Reveal y={12} blurFrom={8}><PhaseLabel text={INTRO.tag} accent={ACCENTS.intro[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={6} durationInFrames={D.intro - 6}><Reveal y={50} scaleFrom={0.88} blurFrom={30} durationInFrames={38}><GlitchTitle text={INTRO.title} accent={ACCENTS.intro} size={136} /></Reveal></BlockSequence>}
      subtitle={<BlockSequence from={24} durationInFrames={D.intro - 24}><Reveal y={16} blurFrom={10}><DetailText text={INTRO.subtitle} size={30} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── layers ─── */
const LayersScene: FC = () => (
  <DarkShell accent={ACCENTS.layers} durationInFrames={D.layers} variant="terminal">
    <BgImg src={"deepfakes/deepfakes-layers.png"} />
    <ExplainLayout
      tag={<BlockSequence from={0} durationInFrames={D.layers}><Reveal y={12} blurFrom={8}><PhaseLabel text={LAYERS.tag} accent={ACCENTS.layers[0]} /></Reveal></BlockSequence>}
      terminal={<BlockSequence from={10} durationInFrames={D.layers - 10}><Reveal y={20} blurFrom={14}><TerminalBlock lines={LAYERS.terminal} accent={ACCENTS.layers} startFrame={12} /></Reveal></BlockSequence>}
      definition={<BlockSequence from={60} durationInFrames={D.layers - 60}><Reveal y={36} scaleFrom={0.94} blurFrom={22}><NarrativeText text={LAYERS.definition} size={62} /></Reveal></BlockSequence>}
      detail={<BlockSequence from={90} durationInFrames={D.layers - 90}><Reveal y={16} blurFrom={10}><DetailText text={LAYERS.detail} size={34} maxWidth={680} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── phase scene ─── */
type PhaseKey = "phase1" | "phase2" | "phase3";
const PhaseScene: FC<{ pk: PhaseKey }> = ({ pk }) => {
  const data   = pk === "phase1" ? PHASE1 : pk === "phase2" ? PHASE2 : PHASE3;
  const accent = ACCENTS[pk];
  const dur    = D[pk];
  const imgSrc = pk === "phase1" ? "deepfakes/deepfakes-phase1.png" : pk === "phase2" ? "deepfakes/deepfakes-phase2.png" : "deepfakes/deepfakes-phase3.png";
  return (
    <DarkShell accent={accent} durationInFrames={dur} variant="body">
      <BgImg src={imgSrc} />
      <PhaseLayout
        phase={<BlockSequence from={0} durationInFrames={dur}><Reveal y={12} blurFrom={8}><PhaseLabel text={data.phase} accent={accent[0]} /></Reveal></BlockSequence>}
        timestamp={<BlockSequence from={6} durationInFrames={dur - 6}><Reveal y={10} blurFrom={6}><TimestampDisplay time={data.timestamp} accent={accent} /></Reveal></BlockSequence>}
        title={<BlockSequence from={12} durationInFrames={dur - 12}><Reveal y={44} scaleFrom={0.9} blurFrom={28} durationInFrames={36}><GlitchTitle text={data.title} accent={accent} size={130} /></Reveal></BlockSequence>}
        narrative={<BlockSequence from={28} durationInFrames={dur - 28}><Reveal y={22} blurFrom={14}><NarrativeText text={data.narrative} size={52} /></Reveal></BlockSequence>}
        detail={<BlockSequence from={46} durationInFrames={dur - 46}><Reveal y={16} blurFrom={10}><DetailText text={data.detail} size={34} maxWidth={700} /></Reveal></BlockSequence>}
        indicator={<BlockSequence from={62} durationInFrames={dur - 62}><Reveal y={20} blurFrom={12}><IndicatorCard accent={accent} items={data.indicator} /></Reveal></BlockSequence>}
      />
    </DarkShell>
  );
};

/* ─── reality ─── */
const RealityScene: FC = () => (
  <DarkShell accent={ACCENTS.reality} durationInFrames={D.reality} variant="body">
    <BgImg src={"deepfakes/deepfakes-reality.png"} />
    <DefenseLayout
      tag={<BlockSequence from={0} durationInFrames={D.reality}><Reveal y={12} blurFrom={8}><PhaseLabel text={REALITY.tag} accent={ACCENTS.reality[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={10} durationInFrames={D.reality - 10}><Reveal y={38} scaleFrom={0.93} blurFrom={24}><NarrativeText text={REALITY.title} size={58} /></Reveal></BlockSequence>}
      actions={<BlockSequence from={34} durationInFrames={D.reality - 34}><Reveal y={24} blurFrom={14}><ActionList items={REALITY.actions} accent={ACCENTS.reality} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── close ─── */
const CloseScene: FC = () => (
  <DarkShell accent={ACCENTS.close} durationInFrames={D.close} variant="close">
    <BgImg src={"deepfakes/deepfakes-close.png"} />
    <CloseLayout
      tag={<BlockSequence from={0} durationInFrames={D.close}><Reveal y={12} blurFrom={8}><PhaseLabel text={CLOSE.tag} accent={ACCENTS.close[0]} /></Reveal></BlockSequence>}
      title={<BlockSequence from={8} durationInFrames={D.close - 8}><Reveal y={40} scaleFrom={0.92} blurFrom={26} durationInFrames={36}><GlitchTitle text={CLOSE.title} accent={ACCENTS.close} size={96} /></Reveal></BlockSequence>}
      subtitle={<BlockSequence from={30} durationInFrames={D.close - 30}><Reveal y={18} blurFrom={10}><NarrativeText text={CLOSE.subtitle} size={46} accent="rgba(255,255,255,0.85)" /></Reveal></BlockSequence>}
      bar={<BlockSequence from={40} durationInFrames={D.close - 40}><Reveal y={10} blurFrom={6}><AccentBar accent={ACCENTS.close} /></Reveal></BlockSequence>}
    />
  </DarkShell>
);

/* ─── main ─── */
export const DeepfakesComposition: FC<Props> = ({ voiceoverFile = null }) => {
  const off = {
    intro:   0,
    layers:  D.intro,
    phase1:  D.intro + D.layers,
    phase2:  D.intro + D.layers + D.phase1,
    phase3:  D.intro + D.layers + D.phase1 + D.phase2,
    reality: D.intro + D.layers + D.phase1 + D.phase2 + D.phase3,
    close:   D.intro + D.layers + D.phase1 + D.phase2 + D.phase3 + D.reality,
  };
  return (
    <>
      {voiceoverFile && <Audio src={staticFile(voiceoverFile)} volume={1} />}
      <Sequence from={off.intro}   durationInFrames={D.intro}>   <IntroScene /></Sequence>
      <Sequence from={off.layers}  durationInFrames={D.layers}>  <LayersScene /></Sequence>
      <Sequence from={off.phase1}  durationInFrames={D.phase1}>  <PhaseScene pk="phase1" /></Sequence>
      <Sequence from={off.phase2}  durationInFrames={D.phase2}>  <PhaseScene pk="phase2" /></Sequence>
      <Sequence from={off.phase3}  durationInFrames={D.phase3}>  <PhaseScene pk="phase3" /></Sequence>
      <Sequence from={off.reality} durationInFrames={D.reality}> <RealityScene /></Sequence>
      <Sequence from={off.close}   durationInFrames={D.close}>   <CloseScene /></Sequence>
    </>
  );
};
