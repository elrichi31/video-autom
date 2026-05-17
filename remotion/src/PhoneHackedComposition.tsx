import type { FC } from "react";
import { Audio, Sequence, staticFile } from "remotion";
import {
  AccentBar,
  BlockSequence,
  DetailText,
  EyebrowLabel,
  HookLayout,
  MediaFrame,
  NumberBadge,
  OutroLayout,
  Reveal,
  SceneShell,
  SceneTitle,
  SignalLayout,
  SubtitleText,
} from "./phone-hacked/components";
import {
  PH_DURATIONS,
  PH_HOOK,
  PH_OUTRO,
  PH_SIGNALS,
  PH_TOTAL_DURATION,
  type SignalData,
} from "./phone-hacked/data";

export const phoneHackedDuration = PH_TOTAL_DURATION;

type PhoneHackedCompositionProps = {
  voiceoverFile?: string | null;
  /**
   * Imagen o video para la escena del hook.
   * Poné el nombre del archivo en public/
   * Ejemplo: "hook-phone.png"
   */
  hookMedia?: string | null;
  /**
   * Array de 5 archivos (imagen o video), uno por cada señal.
   * Poné el nombre del archivo en public/
   * Ejemplo: ["signal-1.png", "signal-2.mp4", "signal-3.png", "signal-4.png", "signal-5.png"]
   */
  mediaFiles?: (string | null)[];
};

/* ─── HOOK ─── */

const HookScene: FC<{ media: string | null }> = ({ media }) => {
  const accent = PH_SIGNALS[0].accent;
  return (
    <SceneShell accent={accent} durationInFrames={PH_DURATIONS.hook} variant="hero">
      <HookLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={PH_DURATIONS.hook}>
            <Reveal y={14} blurFrom={8}>
              <EyebrowLabel text={PH_HOOK.eyebrow} accent={accent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={6} durationInFrames={PH_DURATIONS.hook - 6}>
            <Reveal y={44} scaleFrom={0.9} blurFrom={28} durationInFrames={36}>
              <SceneTitle text={PH_HOOK.title} accent={accent} size={108} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={22} durationInFrames={PH_DURATIONS.hook - 22}>
            <Reveal y={16} blurFrom={10}>
              <SubtitleText text={PH_HOOK.subtitle} size={42} />
            </Reveal>
          </BlockSequence>
        }
        media={
          <BlockSequence from={14} durationInFrames={PH_DURATIONS.hook - 14}>
            <Reveal y={30} scaleFrom={0.92} blurFrom={20} durationInFrames={38}>
              <MediaFrame src={media} accent={accent} width={820} height={480} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

/* ─── SIGNAL SCENE ─── */

const SignalScene: FC<{ signal: SignalData; media: string | null }> = ({ signal, media }) => (
  <SceneShell accent={signal.accent} durationInFrames={PH_DURATIONS.point} variant="body">
    <SignalLayout
      badge={
        <BlockSequence from={0} durationInFrames={PH_DURATIONS.point}>
          <Reveal y={12} blurFrom={8}>
            <NumberBadge number={signal.number} accent={signal.accent} />
          </Reveal>
        </BlockSequence>
      }
      media={
        <BlockSequence from={4} durationInFrames={PH_DURATIONS.point - 4}>
          <Reveal y={28} scaleFrom={0.9} blurFrom={22} durationInFrames={36}>
            <MediaFrame src={media} accent={signal.accent} width={820} height={470} />
          </Reveal>
        </BlockSequence>
      }
      title={
        <BlockSequence from={14} durationInFrames={PH_DURATIONS.point - 14}>
          <Reveal y={38} scaleFrom={0.93} blurFrom={24}>
            <SceneTitle text={signal.title} accent={signal.accent} size={96} />
          </Reveal>
        </BlockSequence>
      }
      subtitle={
        <BlockSequence from={26} durationInFrames={PH_DURATIONS.point - 26}>
          <Reveal y={18} blurFrom={12}>
            <SubtitleText text={signal.subtitle} accent={signal.accent[0]} size={44} />
          </Reveal>
        </BlockSequence>
      }
      detail={
        <BlockSequence from={36} durationInFrames={PH_DURATIONS.point - 36}>
          <Reveal y={14} blurFrom={10}>
            <DetailText text={signal.detail} size={34} maxWidth={740} />
          </Reveal>
        </BlockSequence>
      }
    />
  </SceneShell>
);

/* ─── OUTRO ─── */

const OutroScene: FC = () => {
  const accent = PH_SIGNALS[4].accent;
  return (
    <SceneShell accent={accent} durationInFrames={PH_DURATIONS.outro} variant="outro">
      <OutroLayout
        eyebrow={
          <BlockSequence from={0} durationInFrames={PH_DURATIONS.outro}>
            <Reveal y={14} blurFrom={8}>
              <EyebrowLabel text={PH_OUTRO.eyebrow} accent={accent[0]} />
            </Reveal>
          </BlockSequence>
        }
        title={
          <BlockSequence from={8} durationInFrames={PH_DURATIONS.outro - 8}>
            <Reveal y={38} scaleFrom={0.93} blurFrom={24} durationInFrames={36}>
              <SceneTitle text={PH_OUTRO.title} accent={accent} size={110} />
            </Reveal>
          </BlockSequence>
        }
        subtitle={
          <BlockSequence from={28} durationInFrames={PH_DURATIONS.outro - 28}>
            <Reveal y={16} blurFrom={10}>
              <SubtitleText text={PH_OUTRO.subtitle} size={36} maxWidth={700} />
            </Reveal>
          </BlockSequence>
        }
        bar={
          <BlockSequence from={38} durationInFrames={PH_DURATIONS.outro - 38}>
            <Reveal y={10} blurFrom={6}>
              <AccentBar accent={accent} />
            </Reveal>
          </BlockSequence>
        }
      />
    </SceneShell>
  );
};

/* ─── MAIN COMPOSITION ─── */

export const PhoneHackedComposition: FC<PhoneHackedCompositionProps> = ({
  voiceoverFile = null,
  hookMedia = null,
  mediaFiles = [null, null, null, null, null],
}) => {
  return (
    <>
      {voiceoverFile ? <Audio src={staticFile(voiceoverFile)} volume={1} /> : null}

      <Sequence durationInFrames={PH_DURATIONS.hook}>
        <HookScene media={hookMedia} />
      </Sequence>

      {PH_SIGNALS.map((signal, index) => {
        const from = PH_DURATIONS.hook + index * PH_DURATIONS.point;
        return (
          <Sequence key={signal.id} from={from} durationInFrames={PH_DURATIONS.point}>
            <SignalScene signal={signal} media={mediaFiles[index] ?? null} />
          </Sequence>
        );
      })}

      <Sequence
        from={PH_DURATIONS.hook + PH_SIGNALS.length * PH_DURATIONS.point}
        durationInFrames={PH_DURATIONS.outro}
      >
        <OutroScene />
      </Sequence>
    </>
  );
};
