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
} from "./zero-day/components";
import {
  ZERO_DAY_ACCENTS,
  ZERO_DAY_ALERT,
  ZERO_DAY_CLOSE,
  ZERO_DAY_DEFENSE,
  ZERO_DAY_DURATIONS,
  ZERO_DAY_EXPLAIN,
  ZERO_DAY_PHASES,
  ZERO_DAY_TOTAL_DURATION,
} from "./zero-day/data";

export const zeroDayDuration = ZERO_DAY_TOTAL_DURATION;

type ZeroDayCompositionProps = {
  voiceoverFile?: string | null;
};

/* ─── ALERT SCENE ─── */

const AlertScene: FC = () => (
  <DarkShell accent={ZERO_DAY_ACCENTS.alert} durationInFrames={ZERO_DAY_DURATIONS.alert} variant="alert">
    <AlertLayout
      tag={
        <BlockSequence from={0} durationInFrames={ZERO_DAY_DURATIONS.alert}>
          <Reveal y={12} blurFrom={8}>
            <PhaseLabel text={ZERO_DAY_ALERT.tag} accent={ZERO_DAY_ACCENTS.alert[0]} />
          </Reveal>
        </BlockSequence>
      }
      title={
        <BlockSequence from={6} durationInFrames={ZERO_DAY_DURATIONS.alert - 6}>
          <Reveal y={50} scaleFrom={0.88} blurFrom={30} durationInFrames={38}>
            <GlitchTitle text={ZERO_DAY_ALERT.title} accent={ZERO_DAY_ACCENTS.alert} size={136} />
          </Reveal>
        </BlockSequence>
      }
      subtitle={
        <BlockSequence from={24} durationInFrames={ZERO_DAY_DURATIONS.alert - 24}>
          <Reveal y={16} blurFrom={10}>
            <DetailText text={ZERO_DAY_ALERT.subtitle} size={30} />
          </Reveal>
        </BlockSequence>
      }
    />
  </DarkShell>
);

/* ─── EXPLAIN SCENE ─── */

const ExplainScene: FC = () => (
  <DarkShell accent={ZERO_DAY_ACCENTS.explain} durationInFrames={ZERO_DAY_DURATIONS.explain} variant="terminal">
    <ExplainLayout
      tag={
        <BlockSequence from={0} durationInFrames={ZERO_DAY_DURATIONS.explain}>
          <Reveal y={12} blurFrom={8}>
            <PhaseLabel text={ZERO_DAY_EXPLAIN.tag} accent={ZERO_DAY_ACCENTS.explain[0]} />
          </Reveal>
        </BlockSequence>
      }
      terminal={
        <BlockSequence from={10} durationInFrames={ZERO_DAY_DURATIONS.explain - 10}>
          <Reveal y={20} blurFrom={14}>
            <TerminalBlock lines={ZERO_DAY_EXPLAIN.terminal} accent={ZERO_DAY_ACCENTS.explain} startFrame={12} />
          </Reveal>
        </BlockSequence>
      }
      definition={
        <BlockSequence from={60} durationInFrames={ZERO_DAY_DURATIONS.explain - 60}>
          <Reveal y={36} scaleFrom={0.94} blurFrom={22}>
            <NarrativeText text={ZERO_DAY_EXPLAIN.definition} size={62} />
          </Reveal>
        </BlockSequence>
      }
      detail={
        <BlockSequence from={90} durationInFrames={ZERO_DAY_DURATIONS.explain - 90}>
          <Reveal y={16} blurFrom={10}>
            <DetailText text={ZERO_DAY_EXPLAIN.detail} size={34} maxWidth={680} />
          </Reveal>
        </BlockSequence>
      }
    />
  </DarkShell>
);

/* ─── PHASE SCENES ─── */

const PhaseScene: FC<{ index: number }> = ({ index }) => {
  const phase = ZERO_DAY_PHASES[index];
  const accentKey = `phase${index + 1}` as keyof typeof ZERO_DAY_ACCENTS;
  const accent = ZERO_DAY_ACCENTS[accentKey];
  const dur = index === 0 ? ZERO_DAY_DURATIONS.phase1 : index === 1 ? ZERO_DAY_DURATIONS.phase2 : ZERO_DAY_DURATIONS.phase3;

  return (
    <DarkShell accent={accent} durationInFrames={dur} variant="body">
      <PhaseLayout
        phase={
          <BlockSequence from={0} durationInFrames={dur}>
            <Reveal y={12} blurFrom={8}>
              <PhaseLabel text={phase.phase} accent={accent[0]} />
            </Reveal>
          </BlockSequence>
        }
        timestamp={
          <BlockSequence from={6} durationInFrames={dur - 6}>
            <Reveal y={10} blurFrom={6}>
              <TimestampDisplay time={phase.timestamp} accent={accent} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={12} durationInFrames={dur - 12}>
            <Reveal y={44} scaleFrom={0.9} blurFrom={28} durationInFrames={36}>
              <GlitchTitle text={phase.title} accent={accent} size={130} />
            </Reveal>
          </BlockSequence>
        }
        narrative={
          <BlockSequence from={28} durationInFrames={dur - 28}>
            <Reveal y={22} blurFrom={14}>
              <NarrativeText text={phase.narrative} size={52} />
            </Reveal>
          </BlockSequence>
        }
        detail={
          <BlockSequence from={46} durationInFrames={dur - 46}>
            <Reveal y={16} blurFrom={10}>
              <DetailText text={phase.detail} size={34} maxWidth={700} />
            </Reveal>
          </BlockSequence>
        }
        indicator={
          <BlockSequence from={62} durationInFrames={dur - 62}>
            <Reveal y={20} blurFrom={12}>
              <IndicatorCard accent={accent} items={phase.indicator} />
            </Reveal>
          </BlockSequence>
        }
      />
    </DarkShell>
  );
};

/* ─── DEFENSE SCENE ─── */

const DefenseScene: FC = () => (
  <DarkShell accent={ZERO_DAY_ACCENTS.defense} durationInFrames={ZERO_DAY_DURATIONS.defense} variant="body">
    <DefenseLayout
      tag={
        <BlockSequence from={0} durationInFrames={ZERO_DAY_DURATIONS.defense}>
          <Reveal y={12} blurFrom={8}>
            <PhaseLabel text={ZERO_DAY_DEFENSE.tag} accent={ZERO_DAY_ACCENTS.defense[0]} />
          </Reveal>
        </BlockSequence>
      }
      title={
        <BlockSequence from={10} durationInFrames={ZERO_DAY_DURATIONS.defense - 10}>
          <Reveal y={38} scaleFrom={0.93} blurFrom={24}>
            <NarrativeText text={ZERO_DAY_DEFENSE.title} size={58} />
          </Reveal>
        </BlockSequence>
      }
      actions={
        <BlockSequence from={34} durationInFrames={ZERO_DAY_DURATIONS.defense - 34}>
          <Reveal y={24} blurFrom={14}>
            <ActionList items={ZERO_DAY_DEFENSE.actions} accent={ZERO_DAY_ACCENTS.defense} />
          </Reveal>
        </BlockSequence>
      }
    />
  </DarkShell>
);

/* ─── CLOSE SCENE ─── */

const CloseScene: FC = () => (
  <DarkShell accent={ZERO_DAY_ACCENTS.close} durationInFrames={ZERO_DAY_DURATIONS.close} variant="close">
    <CloseLayout
      tag={
        <BlockSequence from={0} durationInFrames={ZERO_DAY_DURATIONS.close}>
          <Reveal y={12} blurFrom={8}>
            <PhaseLabel text={ZERO_DAY_CLOSE.tag} accent={ZERO_DAY_ACCENTS.close[0]} />
          </Reveal>
        </BlockSequence>
      }
      title={
        <BlockSequence from={8} durationInFrames={ZERO_DAY_DURATIONS.close - 8}>
          <Reveal y={40} scaleFrom={0.92} blurFrom={26} durationInFrames={36}>
            <GlitchTitle text={ZERO_DAY_CLOSE.title} accent={ZERO_DAY_ACCENTS.close} size={110} />
          </Reveal>
        </BlockSequence>
      }
      subtitle={
        <BlockSequence from={30} durationInFrames={ZERO_DAY_DURATIONS.close - 30}>
          <Reveal y={18} blurFrom={10}>
            <NarrativeText text={ZERO_DAY_CLOSE.subtitle} size={54} accent="rgba(105,240,174,0.95)" />
          </Reveal>
        </BlockSequence>
      }
      bar={
        <BlockSequence from={40} durationInFrames={ZERO_DAY_DURATIONS.close - 40}>
          <Reveal y={10} blurFrom={6}>
            <AccentBar accent={ZERO_DAY_ACCENTS.close} />
          </Reveal>
        </BlockSequence>
      }
    />
  </DarkShell>
);

/* ─── MAIN COMPOSITION ─── */

export const ZeroDayComposition: FC<ZeroDayCompositionProps> = ({ voiceoverFile = null }) => {
  const d = ZERO_DAY_DURATIONS;
  const offsets = {
    alert: 0,
    explain: d.alert,
    phase1: d.alert + d.explain,
    phase2: d.alert + d.explain + d.phase1,
    phase3: d.alert + d.explain + d.phase1 + d.phase2,
    defense: d.alert + d.explain + d.phase1 + d.phase2 + d.phase3,
    close: d.alert + d.explain + d.phase1 + d.phase2 + d.phase3 + d.defense,
  };

  return (
    <>
      {voiceoverFile ? <Audio src={staticFile(voiceoverFile)} volume={1} /> : null}

      <Sequence from={offsets.alert} durationInFrames={d.alert}>
        <AlertScene />
      </Sequence>

      <Sequence from={offsets.explain} durationInFrames={d.explain}>
        <ExplainScene />
      </Sequence>

      <Sequence from={offsets.phase1} durationInFrames={d.phase1}>
        <PhaseScene index={0} />
      </Sequence>

      <Sequence from={offsets.phase2} durationInFrames={d.phase2}>
        <PhaseScene index={1} />
      </Sequence>

      <Sequence from={offsets.phase3} durationInFrames={d.phase3}>
        <PhaseScene index={2} />
      </Sequence>

      <Sequence from={offsets.defense} durationInFrames={d.defense}>
        <DefenseScene />
      </Sequence>

      <Sequence from={offsets.close} durationInFrames={d.close}>
        <CloseScene />
      </Sequence>
    </>
  );
};
