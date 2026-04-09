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
  HACKER_CONTEXT,
  HACKER_DURATIONS,
  HACKER_GROUPS,
  HACKER_HOOK,
  HACKER_OUTRO,
  HACKER_TOTAL_DURATION,
  type HackerGroupData,
} from "./hacker-groups/data";

export const hackerGroupsDuration = HACKER_TOTAL_DURATION;

type HackerGroupsCompositionProps = {
  voiceoverFile?: string | null;
};

const hookAccent = HACKER_GROUPS[0].accent;
const contextAccent = HACKER_GROUPS[1].accent;
const outroAccent = HACKER_GROUPS[4].accent;

const HookScene: FC = () => {
  return (
    <SceneShell accent={hookAccent} durationInFrames={HACKER_DURATIONS.hook} variant="hero">
      <HeroLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={HACKER_DURATIONS.hook}>
            <Reveal y={18} blurFrom={10}>
              <EyebrowLabel text={HACKER_HOOK.eyebrow} accent={hookAccent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={8} durationInFrames={HACKER_DURATIONS.hook - 8}>
            <Reveal y={44} scaleFrom={0.92} blurFrom={28} durationInFrames={36}>
              <HeroTitle text={HACKER_HOOK.title} accent={hookAccent} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={22} durationInFrames={HACKER_DURATIONS.hook - 22}>
            <Reveal y={20} blurFrom={12}>
              <LeadText text={HACKER_HOOK.subtitle} maxWidth={720} size={58} />
            </Reveal>
          </BlockSequence>
        }
        footer={
          <BlockSequence from={34} durationInFrames={HACKER_DURATIONS.hook - 34}>
            <Reveal y={16} blurFrom={10}>
              <ChipRow labels={HACKER_HOOK.chips} accent={hookAccent} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

const ContextScene: FC = () => {
  return (
    <SceneShell accent={contextAccent} durationInFrames={HACKER_DURATIONS.context} variant="body">
      <HeroLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={HACKER_DURATIONS.context}>
            <Reveal y={16} blurFrom={10}>
              <EyebrowLabel text={HACKER_CONTEXT.eyebrow} accent={contextAccent[1]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={10} durationInFrames={HACKER_DURATIONS.context - 10}>
            <Reveal y={36} scaleFrom={0.95} blurFrom={22}>
              <HeroTitle text={HACKER_CONTEXT.title} accent={contextAccent} size={138} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={28} durationInFrames={HACKER_DURATIONS.context - 28}>
            <Reveal y={18} blurFrom={12}>
              <LeadText text={HACKER_CONTEXT.subtitle} accent={contextAccent[0]} size={68} maxWidth={680} />
            </Reveal>
          </BlockSequence>
        }
        detail={
          <BlockSequence from={44} durationInFrames={HACKER_DURATIONS.context - 44}>
            <Reveal y={26} blurFrom={14}>
              <SignalCard accent={contextAccent} title="REALIDAD" items={HACKER_CONTEXT.markers} />
            </Reveal>
          </BlockSequence>
        }
        footer={
          <BlockSequence from={66} durationInFrames={HACKER_DURATIONS.context - 66}>
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
                <LeadText text={HACKER_CONTEXT.detail} size={38} maxWidth={700} accent="rgba(233,244,237,0.82)" />
              </div>
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

const GroupScene: FC<{ group: HackerGroupData }> = ({ group }) => {
  return (
    <SceneShell accent={group.accent} durationInFrames={HACKER_DURATIONS.group} variant="body">
      <AttackLayout
        header={
          <BlockSequence from={0} durationInFrames={HACKER_DURATIONS.group}>
            <Reveal y={14} blurFrom={10}>
              <EyebrowLabel text={group.label} accent={group.accent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={8} durationInFrames={HACKER_DURATIONS.group - 8}>
            <Reveal y={40} scaleFrom={0.93} blurFrom={26}>
              <SectionTitle text={group.title} accent={group.accent} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={20} durationInFrames={HACKER_DURATIONS.group - 20}>
            <Reveal y={20} blurFrom={12}>
              <LeadText text={group.subtitle} accent={group.accent[0]} size={68} maxWidth={680} />
            </Reveal>
          </BlockSequence>
        }
        detail={
          <BlockSequence from={31} durationInFrames={HACKER_DURATIONS.group - 31}>
            <Reveal y={16} blurFrom={10}>
              <LeadText text={group.detail} size={40} maxWidth={720} accent="rgba(232,241,236,0.78)" />
            </Reveal>
          </BlockSequence>
        }
        card={
          <BlockSequence from={38} durationInFrames={HACKER_DURATIONS.group - 38}>
            <Reveal y={24} blurFrom={14}>
              <SignalCard accent={group.accent} title="AMENAZA" items={group.signals} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

const OutroScene: FC = () => {
  return (
    <SceneShell accent={outroAccent} durationInFrames={HACKER_DURATIONS.outro} variant="outro">
      <HeroLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={HACKER_DURATIONS.outro}>
            <Reveal y={16} blurFrom={10}>
              <EyebrowLabel text={HACKER_OUTRO.eyebrow} accent={outroAccent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={10} durationInFrames={HACKER_DURATIONS.outro - 10}>
            <Reveal y={36} scaleFrom={0.94} blurFrom={24}>
              <HeroTitle text={HACKER_OUTRO.title} accent={outroAccent} size={126} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={34} durationInFrames={HACKER_DURATIONS.outro - 34}>
            <Reveal y={18} blurFrom={10}>
              <LeadText text={HACKER_OUTRO.subtitle} size={54} maxWidth={700} />
            </Reveal>
          </BlockSequence>
        }
        footer={
          <BlockSequence from={48} durationInFrames={HACKER_DURATIONS.outro - 48}>
            <Reveal y={16} blurFrom={10}>
              <AccentBar accent={outroAccent} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

export const HackerGroupsComposition: FC<HackerGroupsCompositionProps> = ({
  voiceoverFile = null,
}) => {
  return (
    <>
      {voiceoverFile ? <Audio src={staticFile(voiceoverFile)} volume={1} /> : null}

      <Sequence durationInFrames={HACKER_DURATIONS.hook}>
        <HookScene />
      </Sequence>

      <Sequence from={HACKER_DURATIONS.hook} durationInFrames={HACKER_DURATIONS.context}>
        <ContextScene />
      </Sequence>

      {HACKER_GROUPS.map((group, index) => {
        const from = HACKER_DURATIONS.hook + HACKER_DURATIONS.context + index * HACKER_DURATIONS.group;
        return (
          <Sequence key={group.id} from={from} durationInFrames={HACKER_DURATIONS.group}>
            <GroupScene group={group} />
          </Sequence>
        );
      })}

      <Sequence
        from={HACKER_DURATIONS.hook + HACKER_DURATIONS.context + HACKER_GROUPS.length * HACKER_DURATIONS.group}
        durationInFrames={HACKER_DURATIONS.outro}
      >
        <OutroScene />
      </Sequence>
    </>
  );
};
