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
  AI_AGENTS_CONTEXT,
  AI_AGENTS_DURATIONS,
  AI_AGENTS_HOOK,
  AI_AGENTS_OUTRO,
  AI_AGENTS_POINTS,
  AI_AGENTS_TOTAL_DURATION,
  type AgentSceneData,
} from "./ai-agents/data";

export const aiAgentsDuration = AI_AGENTS_TOTAL_DURATION;

type AiAgentsCompositionProps = {
  voiceoverFile?: string | null;
};

const hookAccent = AI_AGENTS_POINTS[0].accent;
const contextAccent = AI_AGENTS_POINTS[2].accent;
const outroAccent = AI_AGENTS_POINTS[3].accent;

const HookScene: FC = () => {
  return (
    <SceneShell accent={hookAccent} durationInFrames={AI_AGENTS_DURATIONS.hook} variant="hero">
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          transform: "translateY(70px)",
        }}
      >
        <div style={{ width: "100%", minHeight: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BlockSequence from={0} durationInFrames={AI_AGENTS_DURATIONS.hook}>
            <Reveal y={18} blurFrom={10}>
              <EyebrowLabel text={AI_AGENTS_HOOK.eyebrow} accent={hookAccent[0]} />
            </Reveal>
          </BlockSequence>
        </div>
        <div style={{ width: "100%", minHeight: 540, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BlockSequence from={8} durationInFrames={AI_AGENTS_DURATIONS.hook - 8}>
            <Reveal y={44} scaleFrom={0.92} blurFrom={28} durationInFrames={36}>
              <HeroTitle text={AI_AGENTS_HOOK.title} accent={hookAccent} size={128} />
            </Reveal>
          </BlockSequence>
        </div>
        <div style={{ width: "100%", minHeight: 92, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BlockSequence from={22} durationInFrames={AI_AGENTS_DURATIONS.hook - 22}>
            <Reveal y={20} blurFrom={12}>
              <LeadText text={AI_AGENTS_HOOK.subtitle} maxWidth={760} size={50} />
            </Reveal>
          </BlockSequence>
        </div>
        <div style={{ width: "100%", minHeight: 108, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BlockSequence from={34} durationInFrames={AI_AGENTS_DURATIONS.hook - 34}>
            <Reveal y={16} blurFrom={10}>
              <ChipRow labels={AI_AGENTS_HOOK.chips} accent={hookAccent} />
            </Reveal>
          </BlockSequence>
        </div>
      </div>
    </SceneShell>
  );
};

const ContextScene: FC = () => {
  return (
    <SceneShell accent={contextAccent} durationInFrames={AI_AGENTS_DURATIONS.context} variant="body">
      <HeroLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={AI_AGENTS_DURATIONS.context}>
            <Reveal y={16} blurFrom={10}>
              <EyebrowLabel text={AI_AGENTS_CONTEXT.eyebrow} accent={contextAccent[1]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={10} durationInFrames={AI_AGENTS_DURATIONS.context - 10}>
            <Reveal y={36} scaleFrom={0.95} blurFrom={22}>
              <HeroTitle text={AI_AGENTS_CONTEXT.title} accent={contextAccent} size={138} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={28} durationInFrames={AI_AGENTS_DURATIONS.context - 28}>
            <Reveal y={18} blurFrom={12}>
              <LeadText text={AI_AGENTS_CONTEXT.subtitle} accent={contextAccent[0]} size={68} maxWidth={700} />
            </Reveal>
          </BlockSequence>
        }
        detail={
          <BlockSequence from={44} durationInFrames={AI_AGENTS_DURATIONS.context - 44}>
            <Reveal y={26} blurFrom={14}>
              <SignalCard accent={contextAccent} title="LO QUE CAMBIA" items={AI_AGENTS_CONTEXT.markers} />
            </Reveal>
          </BlockSequence>
        }
        footer={
          <BlockSequence from={66} durationInFrames={AI_AGENTS_DURATIONS.context - 66}>
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
                <LeadText
                  text={AI_AGENTS_CONTEXT.detail}
                  size={38}
                  maxWidth={720}
                  accent="rgba(233,244,237,0.82)"
                />
              </div>
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

const AgentStepScene: FC<{ point: AgentSceneData }> = ({ point }) => {
  return (
    <SceneShell accent={point.accent} durationInFrames={AI_AGENTS_DURATIONS.point} variant="body">
      <AttackLayout
        header={
          <BlockSequence from={0} durationInFrames={AI_AGENTS_DURATIONS.point}>
            <Reveal y={14} blurFrom={10}>
              <EyebrowLabel text={point.label} accent={point.accent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={8} durationInFrames={AI_AGENTS_DURATIONS.point - 8}>
            <Reveal y={40} scaleFrom={0.93} blurFrom={26}>
              <SectionTitle text={point.title} accent={point.accent} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={20} durationInFrames={AI_AGENTS_DURATIONS.point - 20}>
            <Reveal y={20} blurFrom={12}>
              <LeadText text={point.subtitle} accent={point.accent[0]} size={68} maxWidth={690} />
            </Reveal>
          </BlockSequence>
        }
        detail={
          <BlockSequence from={31} durationInFrames={AI_AGENTS_DURATIONS.point - 31}>
            <Reveal y={16} blurFrom={10}>
              <LeadText text={point.detail} size={40} maxWidth={740} accent="rgba(232,241,236,0.78)" />
            </Reveal>
          </BlockSequence>
        }
        card={
          <BlockSequence from={38} durationInFrames={AI_AGENTS_DURATIONS.point - 38}>
            <Reveal y={24} blurFrom={14}>
              <SignalCard accent={point.accent} title="RESULTADO" items={point.signals} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

const OutroScene: FC = () => {
  return (
    <SceneShell accent={outroAccent} durationInFrames={AI_AGENTS_DURATIONS.outro} variant="outro">
      <HeroLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={AI_AGENTS_DURATIONS.outro}>
            <Reveal y={16} blurFrom={10}>
              <EyebrowLabel text={AI_AGENTS_OUTRO.eyebrow} accent={outroAccent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={10} durationInFrames={AI_AGENTS_DURATIONS.outro - 10}>
            <Reveal y={36} scaleFrom={0.94} blurFrom={24}>
              <HeroTitle text={AI_AGENTS_OUTRO.title} accent={outroAccent} size={126} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={34} durationInFrames={AI_AGENTS_DURATIONS.outro - 34}>
            <Reveal y={18} blurFrom={10}>
              <LeadText text={AI_AGENTS_OUTRO.subtitle} size={54} maxWidth={700} />
            </Reveal>
          </BlockSequence>
        }
        footer={
          <BlockSequence from={48} durationInFrames={AI_AGENTS_DURATIONS.outro - 48}>
            <Reveal y={16} blurFrom={10}>
              <AccentBar accent={outroAccent} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

export const AiAgentsComposition: FC<AiAgentsCompositionProps> = ({ voiceoverFile = null }) => {
  return (
    <>
      {voiceoverFile ? <Audio src={staticFile(voiceoverFile)} volume={1} /> : null}

      <Sequence durationInFrames={AI_AGENTS_DURATIONS.hook}>
        <HookScene />
      </Sequence>

      <Sequence from={AI_AGENTS_DURATIONS.hook} durationInFrames={AI_AGENTS_DURATIONS.context}>
        <ContextScene />
      </Sequence>

      {AI_AGENTS_POINTS.map((point, index) => {
        const from = AI_AGENTS_DURATIONS.hook + AI_AGENTS_DURATIONS.context + index * AI_AGENTS_DURATIONS.point;
        return (
          <Sequence key={point.id} from={from} durationInFrames={AI_AGENTS_DURATIONS.point}>
            <AgentStepScene point={point} />
          </Sequence>
        );
      })}

      <Sequence
        from={AI_AGENTS_DURATIONS.hook + AI_AGENTS_DURATIONS.context + AI_AGENTS_POINTS.length * AI_AGENTS_DURATIONS.point}
        durationInFrames={AI_AGENTS_DURATIONS.outro}
      >
        <OutroScene />
      </Sequence>
    </>
  );
};
