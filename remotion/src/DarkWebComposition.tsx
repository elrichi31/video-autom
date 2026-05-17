import type { FC } from "react";
import { Audio, Sequence, staticFile } from "remotion";
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
  DARK_WEB_ACCENTS,
  DARK_WEB_ACTORS,
  DARK_WEB_CLOSE,
  DARK_WEB_DURATIONS,
  DARK_WEB_INTRO,
  DARK_WEB_LAYERS,
  DARK_WEB_MARKETS,
  DARK_WEB_REALITY,
  DARK_WEB_TOTAL_DURATION,
  DARK_WEB_TOR,
} from "./dark-web/data";

export const darkWebDuration = DARK_WEB_TOTAL_DURATION;

type DarkWebCompositionProps = {
  voiceoverFile?: string | null;
};

/* ─── INTRO SCENE ─── */

const IntroScene: FC = () => (
  <DarkShell accent={DARK_WEB_ACCENTS.intro} durationInFrames={DARK_WEB_DURATIONS.intro} variant="alert">
    <AlertLayout
      tag={
        <BlockSequence from={0} durationInFrames={DARK_WEB_DURATIONS.intro}>
          <Reveal y={12} blurFrom={8}>
            <PhaseLabel text={DARK_WEB_INTRO.tag} accent={DARK_WEB_ACCENTS.intro[0]} />
          </Reveal>
        </BlockSequence>
      }
      title={
        <BlockSequence from={6} durationInFrames={DARK_WEB_DURATIONS.intro - 6}>
          <Reveal y={50} scaleFrom={0.88} blurFrom={30} durationInFrames={38}>
            <GlitchTitle text={DARK_WEB_INTRO.title} accent={DARK_WEB_ACCENTS.intro} size={136} />
          </Reveal>
        </BlockSequence>
      }
      subtitle={
        <BlockSequence from={24} durationInFrames={DARK_WEB_DURATIONS.intro - 24}>
          <Reveal y={16} blurFrom={10}>
            <DetailText text={DARK_WEB_INTRO.subtitle} size={30} />
          </Reveal>
        </BlockSequence>
      }
    />
  </DarkShell>
);

/* ─── LAYERS SCENE ─── */

const LayersScene: FC = () => (
  <DarkShell accent={DARK_WEB_ACCENTS.layers} durationInFrames={DARK_WEB_DURATIONS.layers} variant="terminal">
    <ExplainLayout
      tag={
        <BlockSequence from={0} durationInFrames={DARK_WEB_DURATIONS.layers}>
          <Reveal y={12} blurFrom={8}>
            <PhaseLabel text={DARK_WEB_LAYERS.tag} accent={DARK_WEB_ACCENTS.layers[0]} />
          </Reveal>
        </BlockSequence>
      }
      terminal={
        <BlockSequence from={10} durationInFrames={DARK_WEB_DURATIONS.layers - 10}>
          <Reveal y={20} blurFrom={14}>
            <TerminalBlock lines={DARK_WEB_LAYERS.terminal} accent={DARK_WEB_ACCENTS.layers} startFrame={12} />
          </Reveal>
        </BlockSequence>
      }
      definition={
        <BlockSequence from={60} durationInFrames={DARK_WEB_DURATIONS.layers - 60}>
          <Reveal y={36} scaleFrom={0.94} blurFrom={22}>
            <NarrativeText text={DARK_WEB_LAYERS.definition} size={62} />
          </Reveal>
        </BlockSequence>
      }
      detail={
        <BlockSequence from={90} durationInFrames={DARK_WEB_DURATIONS.layers - 90}>
          <Reveal y={16} blurFrom={10}>
            <DetailText text={DARK_WEB_LAYERS.detail} size={34} maxWidth={680} />
          </Reveal>
        </BlockSequence>
      }
    />
  </DarkShell>
);

/* ─── PHASE SCENE (reusable for tor, markets, actors) ─── */

type PhaseData = {
  phase: string;
  timestamp: string;
  title: string;
  narrative: string;
  detail: string;
  indicator: readonly string[];
};

const PhaseScene: FC<{ data: PhaseData; accentKey: keyof typeof DARK_WEB_ACCENTS; durKey: keyof typeof DARK_WEB_DURATIONS }> = ({
  data,
  accentKey,
  durKey,
}) => {
  const accent = DARK_WEB_ACCENTS[accentKey];
  const dur = DARK_WEB_DURATIONS[durKey];

  return (
    <DarkShell accent={accent} durationInFrames={dur} variant="body">
      <PhaseLayout
        phase={
          <BlockSequence from={0} durationInFrames={dur}>
            <Reveal y={12} blurFrom={8}>
              <PhaseLabel text={data.phase} accent={accent[0]} />
            </Reveal>
          </BlockSequence>
        }
        timestamp={
          <BlockSequence from={6} durationInFrames={dur - 6}>
            <Reveal y={10} blurFrom={6}>
              <TimestampDisplay time={data.timestamp} accent={accent} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={12} durationInFrames={dur - 12}>
            <Reveal y={44} scaleFrom={0.9} blurFrom={28} durationInFrames={36}>
              <GlitchTitle text={data.title} accent={accent} size={130} />
            </Reveal>
          </BlockSequence>
        }
        narrative={
          <BlockSequence from={28} durationInFrames={dur - 28}>
            <Reveal y={22} blurFrom={14}>
              <NarrativeText text={data.narrative} size={52} />
            </Reveal>
          </BlockSequence>
        }
        detail={
          <BlockSequence from={46} durationInFrames={dur - 46}>
            <Reveal y={16} blurFrom={10}>
              <DetailText text={data.detail} size={34} maxWidth={700} />
            </Reveal>
          </BlockSequence>
        }
        indicator={
          <BlockSequence from={62} durationInFrames={dur - 62}>
            <Reveal y={20} blurFrom={12}>
              <IndicatorCard accent={accent} items={data.indicator} />
            </Reveal>
          </BlockSequence>
        }
      />
    </DarkShell>
  );
};

/* ─── REALITY SCENE ─── */

const RealityScene: FC = () => (
  <DarkShell accent={DARK_WEB_ACCENTS.reality} durationInFrames={DARK_WEB_DURATIONS.reality} variant="body">
    <DefenseLayout
      tag={
        <BlockSequence from={0} durationInFrames={DARK_WEB_DURATIONS.reality}>
          <Reveal y={12} blurFrom={8}>
            <PhaseLabel text={DARK_WEB_REALITY.tag} accent={DARK_WEB_ACCENTS.reality[0]} />
          </Reveal>
        </BlockSequence>
      }
      title={
        <BlockSequence from={10} durationInFrames={DARK_WEB_DURATIONS.reality - 10}>
          <Reveal y={38} scaleFrom={0.93} blurFrom={24}>
            <NarrativeText text={DARK_WEB_REALITY.title} size={58} />
          </Reveal>
        </BlockSequence>
      }
      actions={
        <BlockSequence from={34} durationInFrames={DARK_WEB_DURATIONS.reality - 34}>
          <Reveal y={24} blurFrom={14}>
            <ActionList items={DARK_WEB_REALITY.actions} accent={DARK_WEB_ACCENTS.reality} />
          </Reveal>
        </BlockSequence>
      }
    />
  </DarkShell>
);

/* ─── CLOSE SCENE ─── */

const CloseScene: FC = () => (
  <DarkShell accent={DARK_WEB_ACCENTS.close} durationInFrames={DARK_WEB_DURATIONS.close} variant="close">
    <CloseLayout
      tag={
        <BlockSequence from={0} durationInFrames={DARK_WEB_DURATIONS.close}>
          <Reveal y={12} blurFrom={8}>
            <PhaseLabel text={DARK_WEB_CLOSE.tag} accent={DARK_WEB_ACCENTS.close[0]} />
          </Reveal>
        </BlockSequence>
      }
      title={
        <BlockSequence from={8} durationInFrames={DARK_WEB_DURATIONS.close - 8}>
          <Reveal y={40} scaleFrom={0.92} blurFrom={26} durationInFrames={36}>
            <GlitchTitle text={DARK_WEB_CLOSE.title} accent={DARK_WEB_ACCENTS.close} size={96} />
          </Reveal>
        </BlockSequence>
      }
      subtitle={
        <BlockSequence from={30} durationInFrames={DARK_WEB_DURATIONS.close - 30}>
          <Reveal y={18} blurFrom={10}>
            <NarrativeText text={DARK_WEB_CLOSE.subtitle} size={46} accent="rgba(167,139,250,0.95)" />
          </Reveal>
        </BlockSequence>
      }
      bar={
        <BlockSequence from={40} durationInFrames={DARK_WEB_DURATIONS.close - 40}>
          <Reveal y={10} blurFrom={6}>
            <AccentBar accent={DARK_WEB_ACCENTS.close} />
          </Reveal>
        </BlockSequence>
      }
    />
  </DarkShell>
);

/* ─── MAIN COMPOSITION ─── */

export const DarkWebComposition: FC<DarkWebCompositionProps> = ({ voiceoverFile = null }) => {
  const d = DARK_WEB_DURATIONS;
  const offsets = {
    intro:   0,
    layers:  d.intro,
    tor:     d.intro + d.layers,
    markets: d.intro + d.layers + d.tor,
    actors:  d.intro + d.layers + d.tor + d.markets,
    reality: d.intro + d.layers + d.tor + d.markets + d.actors,
    close:   d.intro + d.layers + d.tor + d.markets + d.actors + d.reality,
  };

  return (
    <>
      {voiceoverFile ? <Audio src={staticFile(voiceoverFile)} volume={1} /> : null}

      <Sequence from={offsets.intro} durationInFrames={d.intro}>
        <IntroScene />
      </Sequence>

      <Sequence from={offsets.layers} durationInFrames={d.layers}>
        <LayersScene />
      </Sequence>

      <Sequence from={offsets.tor} durationInFrames={d.tor}>
        <PhaseScene data={DARK_WEB_TOR} accentKey="tor" durKey="tor" />
      </Sequence>

      <Sequence from={offsets.markets} durationInFrames={d.markets}>
        <PhaseScene data={DARK_WEB_MARKETS} accentKey="markets" durKey="markets" />
      </Sequence>

      <Sequence from={offsets.actors} durationInFrames={d.actors}>
        <PhaseScene data={DARK_WEB_ACTORS} accentKey="actors" durKey="actors" />
      </Sequence>

      <Sequence from={offsets.reality} durationInFrames={d.reality}>
        <RealityScene />
      </Sequence>

      <Sequence from={offsets.close} durationInFrames={d.close}>
        <CloseScene />
      </Sequence>
    </>
  );
};
