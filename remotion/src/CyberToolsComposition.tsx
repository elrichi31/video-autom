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
  CYBER_TOOLS_CONTEXT,
  CYBER_TOOLS_DURATIONS,
  CYBER_TOOLS_HOOK,
  CYBER_TOOLS_OUTRO,
  CYBER_TOOLS_POINTS,
  CYBER_TOOLS_TOTAL_DURATION,
  type CyberToolSceneData,
} from "./cyber-tools/data";

export const cyberToolsDuration = CYBER_TOOLS_TOTAL_DURATION;

type CyberToolsCompositionProps = {
  voiceoverFile?: string | null;
};

const hookAccent = CYBER_TOOLS_POINTS[0].accent;
const contextAccent = CYBER_TOOLS_POINTS[2].accent;
const outroAccent = CYBER_TOOLS_POINTS[4].accent;

const HookScene: FC = () => {
  return (
    <SceneShell accent={hookAccent} durationInFrames={CYBER_TOOLS_DURATIONS.hook} variant="hero">
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
          <BlockSequence from={0} durationInFrames={CYBER_TOOLS_DURATIONS.hook}>
            <Reveal y={18} blurFrom={10}>
              <EyebrowLabel text={CYBER_TOOLS_HOOK.eyebrow} accent={hookAccent[0]} />
            </Reveal>
          </BlockSequence>
        </div>
        <div style={{ width: "100%", minHeight: 540, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BlockSequence from={8} durationInFrames={CYBER_TOOLS_DURATIONS.hook - 8}>
            <Reveal y={44} scaleFrom={0.92} blurFrom={28} durationInFrames={36}>
              <HeroTitle text={CYBER_TOOLS_HOOK.title} accent={hookAccent} size={128} />
            </Reveal>
          </BlockSequence>
        </div>
        <div style={{ width: "100%", minHeight: 92, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BlockSequence from={22} durationInFrames={CYBER_TOOLS_DURATIONS.hook - 22}>
            <Reveal y={20} blurFrom={12}>
              <LeadText text={CYBER_TOOLS_HOOK.subtitle} maxWidth={760} size={50} />
            </Reveal>
          </BlockSequence>
        </div>
        <div style={{ width: "100%", minHeight: 108, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BlockSequence from={34} durationInFrames={CYBER_TOOLS_DURATIONS.hook - 34}>
            <Reveal y={16} blurFrom={10}>
              <ChipRow labels={CYBER_TOOLS_HOOK.chips} accent={hookAccent} />
            </Reveal>
          </BlockSequence>
        </div>
      </div>
    </SceneShell>
  );
};

const ContextScene: FC = () => {
  return (
    <SceneShell accent={contextAccent} durationInFrames={CYBER_TOOLS_DURATIONS.context} variant="body">
      <HeroLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={CYBER_TOOLS_DURATIONS.context}>
            <Reveal y={16} blurFrom={10}>
              <EyebrowLabel text={CYBER_TOOLS_CONTEXT.eyebrow} accent={contextAccent[1]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={10} durationInFrames={CYBER_TOOLS_DURATIONS.context - 10}>
            <Reveal y={36} scaleFrom={0.95} blurFrom={22}>
              <HeroTitle text={CYBER_TOOLS_CONTEXT.title} accent={contextAccent} size={138} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={28} durationInFrames={CYBER_TOOLS_DURATIONS.context - 28}>
            <Reveal y={18} blurFrom={12}>
              <LeadText text={CYBER_TOOLS_CONTEXT.subtitle} accent={contextAccent[0]} size={68} maxWidth={700} />
            </Reveal>
          </BlockSequence>
        }
        detail={
          <BlockSequence from={44} durationInFrames={CYBER_TOOLS_DURATIONS.context - 44}>
            <Reveal y={26} blurFrom={14}>
              <SignalCard accent={contextAccent} title="LA REALIDAD" items={CYBER_TOOLS_CONTEXT.markers} />
            </Reveal>
          </BlockSequence>
        }
        footer={
          <BlockSequence from={66} durationInFrames={CYBER_TOOLS_DURATIONS.context - 66}>
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
                  text={CYBER_TOOLS_CONTEXT.detail}
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

const ToolStepScene: FC<{ point: CyberToolSceneData }> = ({ point }) => {
  return (
    <SceneShell accent={point.accent} durationInFrames={CYBER_TOOLS_DURATIONS.point} variant="body">
      <AttackLayout
        header={
          <BlockSequence from={0} durationInFrames={CYBER_TOOLS_DURATIONS.point}>
            <Reveal y={14} blurFrom={10}>
              <EyebrowLabel text={point.label} accent={point.accent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={8} durationInFrames={CYBER_TOOLS_DURATIONS.point - 8}>
            <Reveal y={40} scaleFrom={0.93} blurFrom={26}>
              <SectionTitle text={point.title} accent={point.accent} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={20} durationInFrames={CYBER_TOOLS_DURATIONS.point - 20}>
            <Reveal y={20} blurFrom={12}>
              <LeadText text={point.subtitle} accent={point.accent[0]} size={52} maxWidth={690} />
            </Reveal>
          </BlockSequence>
        }
        detail={
          <BlockSequence from={31} durationInFrames={CYBER_TOOLS_DURATIONS.point - 31}>
            <Reveal y={16} blurFrom={10}>
              <LeadText text={point.detail} size={40} maxWidth={740} accent="rgba(232,241,236,0.78)" />
            </Reveal>
          </BlockSequence>
        }
        card={
          <BlockSequence from={38} durationInFrames={CYBER_TOOLS_DURATIONS.point - 38}>
            <Reveal y={24} blurFrom={14}>
              <SignalCard accent={point.accent} title="BENEFICIO" items={point.signals} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

const OutroScene: FC = () => {
  return (
    <SceneShell accent={outroAccent} durationInFrames={CYBER_TOOLS_DURATIONS.outro} variant="outro">
      <HeroLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={CYBER_TOOLS_DURATIONS.outro}>
            <Reveal y={16} blurFrom={10}>
              <EyebrowLabel text={CYBER_TOOLS_OUTRO.eyebrow} accent={outroAccent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={10} durationInFrames={CYBER_TOOLS_DURATIONS.outro - 10}>
            <Reveal y={36} scaleFrom={0.94} blurFrom={24}>
              <HeroTitle text={CYBER_TOOLS_OUTRO.title} accent={outroAccent} size={126} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={34} durationInFrames={CYBER_TOOLS_DURATIONS.outro - 34}>
            <Reveal y={18} blurFrom={10}>
              <LeadText text={CYBER_TOOLS_OUTRO.subtitle} size={54} maxWidth={700} />
            </Reveal>
          </BlockSequence>
        }
        footer={
          <BlockSequence from={48} durationInFrames={CYBER_TOOLS_DURATIONS.outro - 48}>
            <Reveal y={16} blurFrom={10}>
              <AccentBar accent={outroAccent} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

export const CyberToolsComposition: FC<CyberToolsCompositionProps> = ({ voiceoverFile = null }) => {
  return (
    <>
      {voiceoverFile ? <Audio src={staticFile(voiceoverFile)} volume={1} /> : null}

      <Sequence durationInFrames={CYBER_TOOLS_DURATIONS.hook}>
        <HookScene />
      </Sequence>

      <Sequence from={CYBER_TOOLS_DURATIONS.hook} durationInFrames={CYBER_TOOLS_DURATIONS.context}>
        <ContextScene />
      </Sequence>

      {CYBER_TOOLS_POINTS.map((point, index) => {
        const from = CYBER_TOOLS_DURATIONS.hook + CYBER_TOOLS_DURATIONS.context + index * CYBER_TOOLS_DURATIONS.point;
        return (
          <Sequence key={point.id} from={from} durationInFrames={CYBER_TOOLS_DURATIONS.point}>
            <ToolStepScene point={point} />
          </Sequence>
        );
      })}

      <Sequence
        from={CYBER_TOOLS_DURATIONS.hook + CYBER_TOOLS_DURATIONS.context + CYBER_TOOLS_POINTS.length * CYBER_TOOLS_DURATIONS.point}
        durationInFrames={CYBER_TOOLS_DURATIONS.outro}
      >
        <OutroScene />
      </Sequence>
    </>
  );
};
