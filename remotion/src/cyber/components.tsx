import type { CSSProperties, FC, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { AccentPair } from "./data";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const safeBounds = {
  left: 86,
  right: 86,
  top: 108,
  bottom: 120,
};

const fontStack =
  '"Poppins", "Inter", "Avenir Next", "SF Pro Display", ui-sans-serif, system-ui, sans-serif';

const loop = (
  frame: number,
  values: [number, number, number],
  cycle: number,
  phase = 0,
) => interpolate((frame + phase) % cycle, [0, cycle / 2, cycle], values, clamp);

const revealSpring = (frame: number, fps: number, durationInFrames = 32) =>
  spring({
    fps,
    frame,
    durationInFrames,
    config: {
      damping: 200,
      stiffness: 180,
      mass: 0.9,
    },
  });

export const Reveal: FC<{
  children: ReactNode;
  y?: number;
  scaleFrom?: number;
  blurFrom?: number;
  durationInFrames?: number;
}> = ({
  children,
  y = 30,
  scaleFrom = 0.96,
  blurFrom = 18,
  durationInFrames = 32,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = revealSpring(frame, fps, durationInFrames);

  return (
    <div
      style={{
        opacity: interpolate(progress, [0, 1], [0, 1], clamp),
        transform: `translateY(${interpolate(progress, [0, 1], [y, 0], clamp)}px) scale(${interpolate(
          progress,
          [0, 1],
          [scaleFrom, 1],
          clamp,
        )})`,
        filter: `blur(${interpolate(progress, [0, 1], [blurFrom, 0], clamp)}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const SceneShell: FC<{
  accent: AccentPair;
  durationInFrames: number;
  children: ReactNode;
  variant?: "hero" | "body" | "outro";
}> = ({ accent, durationInFrames, children, variant = "body" }) => {
  const frame = useCurrentFrame();
  const contentOpacity = interpolate(
    frame,
    [0, 10, durationInFrames - 14, durationInFrames - 1],
    [0.72, 1, 1, 0.82],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );
  const driftY = loop(frame, [12, 0, 12], 180);
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.02], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#020403", color: "white", overflow: "hidden" }}>
      <MotionBackground accent={accent} variant={variant} />
      <div
        style={{
          position: "absolute",
          left: safeBounds.left,
          right: safeBounds.right,
          top: safeBounds.top,
          bottom: safeBounds.bottom,
          fontFamily: fontStack,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: contentOpacity,
            transform: `translateY(${driftY}px) scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          {children}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: safeBounds.left,
          right: safeBounds.right,
          top: safeBounds.top,
          bottom: safeBounds.bottom,
          border: "1px solid rgba(255,255,255,0.03)",
          borderRadius: 44,
          pointerEvents: "none",
          opacity: 0.18,
        }}
      />
    </AbsoluteFill>
  );
};

const MotionBackground: FC<{ accent: AccentPair; variant: "hero" | "body" | "outro" }> = ({
  accent,
  variant,
}) => {
  const frame = useCurrentFrame();
  const fieldOpacity = variant === "hero" ? 0.42 : 0.32;
  const beamOffset = interpolate((frame * 1.6) % 180, [0, 180], [-220, 1280], clamp);

  return (
    <>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 16%, rgba(112,255,176,0.11), transparent 25%), radial-gradient(circle at 12% 84%, rgba(26,209,124,0.10), transparent 30%), linear-gradient(180deg, #07110d 0%, #030705 46%, #010202 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: fieldOpacity,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          transform: `perspective(1800px) rotateX(74deg) translateY(${interpolate(frame, [0, 180], [40, -30], clamp)}px) scale(1.3)`,
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 28%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(115deg, transparent 0%, ${accent[0]}1f 38%, transparent 58%)`,
          transform: `translateX(${beamOffset}px) skewX(-18deg)`,
          filter: "blur(10px)",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 36%, ${accent[0]}22 0%, transparent 42%)`,
          transform: `scale(${loop(frame, [1, 1.035, 1], 160)})`,
        }}
      />
      {Array.from({ length: 11 }).map((_, index) => {
        const x = 4 + random(`line-x-${index}`) * 92;
        const opacity = interpolate(
          (frame + index * 8) % 90,
          [0, 45, 90],
          [0.06, 0.24, 0.06],
          clamp,
        );
        return (
          <div
            key={`line-${index}`}
            style={{
              position: "absolute",
              top: `${8 + index * 7.5}%`,
              left: `${x - 14}%`,
              width: "28%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${accent[1]} 50%, transparent 100%)`,
              opacity,
              transform: `translateX(${loop(frame, [-12, 18, -12], 110 + index * 5, index * 8)}px)`,
            }}
          />
        );
      })}
      {Array.from({ length: 18 }).map((_, index) => {
        const size = 3 + random(`particle-size-${index}`) * 4;
        const baseLeft = 8 + random(`particle-left-${index}`) * 84;
        const baseTop = 12 + random(`particle-top-${index}`) * 72;
        const cycle = 90 + Math.floor(random(`particle-cycle-${index}`) * 50);
        const progress = ((frame + index * 7) % cycle) / cycle;
        const opacity = interpolate(progress, [0, 0.25, 0.82, 1], [0, 0.42, 0.28, 0], clamp);
        return (
          <div
            key={`particle-${index}`}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: 999,
              left: `${baseLeft + (random(`particle-drift-x-${index}`) - 0.5) * 4}%`,
              top: `${baseTop - progress * 5}%`,
              opacity,
              background: index % 3 === 0 ? accent[1] : accent[0],
              boxShadow: `0 0 16px ${index % 3 === 0 ? accent[1] : accent[0]}`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, transparent 56%, rgba(0,0,0,0.22) 100%)",
        }}
      />
    </>
  );
};

export const EyebrowLabel: FC<{ text: string; accent: string; align?: CSSProperties["alignItems"] }> = ({
  text,
  accent,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const pulse = loop(frame, [0.92, 1.16, 0.92], 66);

  return (
    <div
      style={{
        display: "flex",
        alignItems: align,
        justifyContent: "center",
        gap: 16,
        letterSpacing: 4.8,
        textTransform: "uppercase",
        fontSize: 28,
        fontWeight: 700,
        color: "rgba(240,255,247,0.74)",
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: accent,
          boxShadow: `0 0 ${26 * pulse}px ${accent}`,
          transform: `scale(${pulse})`,
        }}
      />
      <span>{text}</span>
    </div>
  );
};

export const HeroTitle: FC<{ text: string; accent: AccentPair; size?: number }> = ({
  text,
  accent,
  size = 156,
}) => (
  <div
    style={{
      fontSize: size,
      lineHeight: 0.92,
      fontWeight: 800,
      letterSpacing: -5.6,
      textAlign: "center",
      whiteSpace: "pre-line",
      color: "#F5FFF7",
      textShadow: `0 0 34px ${accent[0]}18`,
    }}
  >
    {text}
  </div>
);

export const SectionTitle: FC<{ text: string; accent: AccentPair }> = ({ text, accent }) => (
  <div
    style={{
      fontSize: 148,
      lineHeight: 0.9,
      fontWeight: 800,
      letterSpacing: -5.4,
      textAlign: "center",
      whiteSpace: "pre-line",
      color: "#F5FFF7",
      textShadow: `0 0 34px ${accent[0]}16`,
    }}
  >
    {text}
  </div>
);

export const LeadText: FC<{ text: string; accent?: string; maxWidth?: number; size?: number }> = ({
  text,
  accent = "rgba(255,255,255,0.92)",
  maxWidth = 680,
  size = 58,
}) => (
  <div
    style={{
      maxWidth,
      margin: "0 auto",
      fontSize: size,
      lineHeight: 1.14,
      fontWeight: 600,
      textAlign: "center",
      color: accent,
    }}
  >
    {text}
  </div>
);

export const DetailText: FC<{ text: string; maxWidth?: number }> = ({ text, maxWidth = 800 }) => (
  <div
    style={{
      maxWidth,
      margin: "0 auto",
      fontSize: 34,
      lineHeight: 1.2,
      fontWeight: 500,
      textAlign: "center",
      color: "rgba(220,234,225,0.82)",
    }}
  >
    {text}
  </div>
);

const glassCard = (accent: AccentPair): CSSProperties => ({
  borderRadius: 34,
  border: `1px solid ${accent[0]}2C`,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%), rgba(3,10,7,0.66)",
  boxShadow: `0 24px 60px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 34px ${accent[0]}18`,
  backdropFilter: "blur(20px)",
});

export const SignalCard: FC<{
  accent: AccentPair;
  title: string;
  items: readonly string[];
}> = ({ accent, title, items }) => {
  const frame = useCurrentFrame();
  const sweep = interpolate((frame * 1.8) % 150, [0, 150], [-220, 1120], clamp);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: 680,
        margin: "0 auto",
        padding: "28px 28px 26px",
        ...glassCard(accent),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 200,
          background: `linear-gradient(90deg, transparent 0%, ${accent[0]}20 50%, transparent 100%)`,
          transform: `translateX(${sweep}px) skewX(-18deg)`,
          filter: "blur(8px)",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 3.6,
            textTransform: "uppercase",
            color: accent[0],
          }}
        >
          {title}
        </div>
        {items.map((item, index) => (
          <SignalRow key={item} accent={index === 1 ? accent[1] : accent[0]} text={item} delay={index * 10} />
        ))}
      </div>
    </div>
  );
};

const SignalRow: FC<{ accent: string; text: string; delay: number }> = ({ accent, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = revealSpring(frame - delay, fps, 28);
  const pulse = loop(frame + delay, [0.82, 1.22, 0.82], 72);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: interpolate(progress, [0, 1], [0, 1], clamp),
        transform: `translateY(${interpolate(progress, [0, 1], [16, 0], clamp)}px)`,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: accent,
          boxShadow: `0 0 ${20 * pulse}px ${accent}`,
          transform: `scale(${pulse})`,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontSize: 44,
          lineHeight: 1.05,
          fontWeight: 600,
          letterSpacing: -1,
          color: "rgba(244,255,248,0.94)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const ChipRow: FC<{ labels: string[]; accent: AccentPair }> = ({ labels, accent }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 16,
      maxWidth: 840,
      margin: "0 auto",
    }}
  >
    {labels.map((label, index) => (
      <Chip key={label} label={label} accent={index % 2 === 0 ? accent[0] : accent[1]} />
    ))}
  </div>
);

const Chip: FC<{ label: string; accent: string }> = ({ label, accent }) => {
  const frame = useCurrentFrame();
  const glow = loop(frame, [0.16, 0.34, 0.16], 76);

  return (
    <div
      style={{
        padding: "18px 24px",
        borderRadius: 999,
        border: `1px solid ${accent}3A`,
        background: "rgba(7, 13, 10, 0.62)",
        boxShadow: `0 0 24px rgba(0,0,0,0.22), 0 0 24px rgba(0,255,145,${glow})`,
        fontSize: 28,
        lineHeight: 1,
        fontWeight: 700,
        color: "rgba(247,255,249,0.92)",
        letterSpacing: -0.6,
      }}
    >
      {label}
    </div>
  );
};

export const HeroLayout: FC<{
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  detail?: ReactNode;
  footer?: ReactNode;
}> = ({ eyebrow, title, subtitle, detail, footer }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <Slot top={130} height={84}>{eyebrow}</Slot>
    <Slot top={270} height={430}>{title}</Slot>
    <Slot top={780} height={130}>{subtitle}</Slot>
    <Slot top={1030} height={220}>{detail}</Slot>
    <Slot top={1420} height={170}>{footer}</Slot>
  </div>
);

export const AttackLayout: FC<{
  header?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  detail?: ReactNode;
  card?: ReactNode;
  kicker?: ReactNode;
}> = ({ header, title, subtitle, detail, card, kicker }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <Slot top={110} height={82}>{header}</Slot>
    <Slot top={270} height={250}>{title}</Slot>
    <Slot top={610} height={130}>{subtitle}</Slot>
    <Slot top={810} height={80}>{detail}</Slot>
    <Slot top={970} height={290}>{card}</Slot>
    <Slot top={1380} height={110}>{kicker}</Slot>
  </div>
);

const Slot: FC<{ top: number; height: number; children?: ReactNode }> = ({ top, height, children }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      width: "100%",
      height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

export const BlockSequence: FC<{
  from: number;
  durationInFrames: number;
  children: ReactNode;
}> = ({ from, durationInFrames, children }) => (
  <Sequence layout="none" from={from} durationInFrames={durationInFrames}>
    {children}
  </Sequence>
);

export const AccentBar: FC<{ accent: AccentPair }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const width = interpolate((frame * 1.6) % 100, [0, 50, 100], [180, 240, 180], clamp);

  return (
    <div
      style={{
        width,
        height: 6,
        borderRadius: 999,
        background: `linear-gradient(90deg, ${accent[1]} 0%, ${accent[0]} 100%)`,
        boxShadow: `0 0 24px ${accent[0]}66`,
      }}
    />
  );
};
