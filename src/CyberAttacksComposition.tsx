import type { FC } from "react";
import { Audio, Sequence, staticFile } from "remotion";
import {
  AccentBar,
  AttackLayout,
  BlockSequence,
  ChipRow,
  EyebrowLabel,
  HeroLayout,
  HeroTitle,
  LeadText,
  Reveal,
  SceneShell,
  SectionTitle,
  SignalCard,
} from "./cyber/components";
import {
  CONTEXT_COPY,
  CYBER_ATTACKS,
  CYBER_DURATIONS,
  CYBER_TOTAL_DURATION,
  HOOK_COPY,
  OUTRO_COPY,
  type AttackSceneData,
} from "./cyber/data";

export const cyberAttacksDuration = CYBER_TOTAL_DURATION;

type CyberAttacksCompositionProps = {
  voiceoverFile?: string | null;
};

const hookAccent = CYBER_ATTACKS[0].accent;
const contextAccent = CYBER_ATTACKS[1].accent;
const outroAccent = CYBER_ATTACKS[4].accent;

const HookScene: FC = () => {
  return (
    <SceneShell accent={hookAccent} durationInFrames={CYBER_DURATIONS.hook} variant="hero">
      <HeroLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={CYBER_DURATIONS.hook}>
            <Reveal y={18} blurFrom={10}>
              <EyebrowLabel text={HOOK_COPY.eyebrow} accent={hookAccent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={8} durationInFrames={CYBER_DURATIONS.hook - 8}>
            <Reveal y={44} scaleFrom={0.92} blurFrom={28} durationInFrames={36}>
              <HeroTitle text={HOOK_COPY.title} accent={hookAccent} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={22} durationInFrames={CYBER_DURATIONS.hook - 22}>
            <Reveal y={20} blurFrom={12}>
              <LeadText text={HOOK_COPY.subtitle} maxWidth={720} size={58} />
            </Reveal>
          </BlockSequence>
        }
        footer={
          <BlockSequence from={34} durationInFrames={CYBER_DURATIONS.hook - 34}>
            <Reveal y={16} blurFrom={10}>
              <ChipRow labels={HOOK_COPY.chips} accent={hookAccent} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

const ContextScene: FC = () => {
  return (
    <SceneShell accent={contextAccent} durationInFrames={CYBER_DURATIONS.context} variant="body">
      <HeroLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={CYBER_DURATIONS.context}>
            <Reveal y={16} blurFrom={10}>
              <EyebrowLabel text={CONTEXT_COPY.eyebrow} accent={contextAccent[1]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={10} durationInFrames={CYBER_DURATIONS.context - 10}>
            <Reveal y={36} scaleFrom={0.95} blurFrom={22}>
              <HeroTitle text={CONTEXT_COPY.title} accent={contextAccent} size={138} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={28} durationInFrames={CYBER_DURATIONS.context - 28}>
            <Reveal y={18} blurFrom={12}>
              <LeadText text={CONTEXT_COPY.subtitle} accent={contextAccent[0]} size={68} maxWidth={680} />
            </Reveal>
          </BlockSequence>
        }
        detail={
          <BlockSequence from={44} durationInFrames={CYBER_DURATIONS.context - 44}>
            <Reveal y={26} blurFrom={14}>
              <SignalCard accent={contextAccent} title="SEÑAL" items={CONTEXT_COPY.markers} />
            </Reveal>
          </BlockSequence>
        }
        footer={
          <BlockSequence from={66} durationInFrames={CYBER_DURATIONS.context - 66}>
            <Reveal y={16} blurFrom={10}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <AccentBar accent={contextAccent} />
                <LeadText text={CONTEXT_COPY.detail} size={38} maxWidth={700} accent="rgba(233,244,237,0.82)" />
              </div>
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

const AttackScene: FC<{ attack: AttackSceneData }> = ({ attack }) => {
  return (
    <SceneShell accent={attack.accent} durationInFrames={CYBER_DURATIONS.attack} variant="body">
      <AttackLayout
        header={
          <BlockSequence from={0} durationInFrames={CYBER_DURATIONS.attack}>
            <Reveal y={14} blurFrom={10}>
              <EyebrowLabel text={attack.label} accent={attack.accent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={8} durationInFrames={CYBER_DURATIONS.attack - 8}>
            <Reveal y={40} scaleFrom={0.93} blurFrom={26}>
              <SectionTitle text={attack.title} accent={attack.accent} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={20} durationInFrames={CYBER_DURATIONS.attack - 20}>
            <Reveal y={20} blurFrom={12}>
              <LeadText text={attack.subtitle} accent={attack.accent[0]} size={68} maxWidth={680} />
            </Reveal>
          </BlockSequence>
        }
        detail={
          <BlockSequence from={31} durationInFrames={CYBER_DURATIONS.attack - 31}>
            <Reveal y={16} blurFrom={10}>
              <LeadText text={attack.detail} size={40} maxWidth={720} accent="rgba(232,241,236,0.78)" />
            </Reveal>
          </BlockSequence>
        }
        card={
          <BlockSequence from={38} durationInFrames={CYBER_DURATIONS.attack - 38}>
            <Reveal y={24} blurFrom={14}>
              <SignalCard accent={attack.accent} title="ALERTA" items={attack.signals} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

const OutroScene: FC = () => {
  return (
    <SceneShell accent={outroAccent} durationInFrames={CYBER_DURATIONS.outro} variant="outro">
      <HeroLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={CYBER_DURATIONS.outro}>
            <Reveal y={16} blurFrom={10}>
              <EyebrowLabel text={OUTRO_COPY.eyebrow} accent={outroAccent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={10} durationInFrames={CYBER_DURATIONS.outro - 10}>
            <Reveal y={36} scaleFrom={0.94} blurFrom={24}>
              <HeroTitle text={OUTRO_COPY.title} accent={outroAccent} size={126} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={34} durationInFrames={CYBER_DURATIONS.outro - 34}>
            <Reveal y={18} blurFrom={10}>
              <LeadText text={OUTRO_COPY.subtitle} size={54} maxWidth={700} />
            </Reveal>
          </BlockSequence>
        }
        footer={
          <BlockSequence from={48} durationInFrames={CYBER_DURATIONS.outro - 48}>
            <Reveal y={16} blurFrom={10}>
              <AccentBar accent={outroAccent} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

export const CyberAttacksComposition: FC<CyberAttacksCompositionProps> = ({
  voiceoverFile = null,
}) => {
  return (
    <>
      {voiceoverFile ? <Audio src={staticFile(voiceoverFile)} volume={1} /> : null}

      <Sequence durationInFrames={CYBER_DURATIONS.hook}>
        <HookScene />
      </Sequence>

      <Sequence from={CYBER_DURATIONS.hook} durationInFrames={CYBER_DURATIONS.context}>
        <ContextScene />
      </Sequence>

      {CYBER_ATTACKS.map((attack, index) => {
        const from = CYBER_DURATIONS.hook + CYBER_DURATIONS.context + index * CYBER_DURATIONS.attack;
        return (
          <Sequence key={attack.id} from={from} durationInFrames={CYBER_DURATIONS.attack}>
            <AttackScene attack={attack} />
          </Sequence>
        );
      })}

      <Sequence
        from={CYBER_DURATIONS.hook + CYBER_DURATIONS.context + CYBER_ATTACKS.length * CYBER_DURATIONS.attack}
        durationInFrames={CYBER_DURATIONS.outro}
      >
        <OutroScene />
      </Sequence>
    </>
  );
};
