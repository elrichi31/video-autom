import type { FC, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { AccentPair } from "./data";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const fontStack =
  '"Poppins", "Inter", "Avenir Next", "SF Pro Display", ui-sans-serif, system-ui, sans-serif';

const safeBounds = { left: 72, right: 72, top: 90, bottom: 100 };

const loop = (
  frame: number,
  values: [number, number, number],
  cycle: number,
  phase = 0,
) => interpolate((frame + phase) % cycle, [0, cycle / 2, cycle], values, clamp);

const revealSpring = (frame: number, fps: number, dur = 32) =>
  spring({ fps, frame, durationInFrames: dur, config: { damping: 200, stiffness: 180, mass: 0.9 } });

/* ─── SCENE SHELL ─── */

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
  const driftY = loop(frame, [10, 0, 10], 190);

  return (
    <AbsoluteFill style={{ backgroundColor: "#030508", color: "white", overflow: "hidden" }}>
      <Background accent={accent} variant={variant} />
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
            transform: `translateY(${driftY}px)`,
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── BACKGROUND ─── */

const Background: FC<{ accent: AccentPair; variant: string }> = ({ accent, variant }) => {
  const frame = useCurrentFrame();

  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${accent[0]}18 0%, transparent 50%), radial-gradient(circle at 80% 75%, ${accent[1]}12 0%, transparent 40%), linear-gradient(180deg, #060a10 0%, #030508 50%, #010204 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.15,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          maskImage: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 40%, ${accent[0]}15 0%, transparent 45%)`,
          transform: `scale(${loop(frame, [1, 1.05, 1], 140)})`,
        }}
      />
      {Array.from({ length: 12 }).map((_, i) => {
        const size = 2 + random(`ph-p-s-${i}`) * 3;
        const baseLeft = 6 + random(`ph-p-l-${i}`) * 88;
        const baseTop = 10 + random(`ph-p-t-${i}`) * 80;
        const cycle = 100 + Math.floor(random(`ph-p-c-${i}`) * 50);
        const progress = ((frame + i * 10) % cycle) / cycle;
        const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 0.3, 0.15, 0], clamp);
        return (
          <div
            key={`ph-p-${i}`}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: 999,
              left: `${baseLeft}%`,
              top: `${baseTop - progress * 5}%`,
              opacity,
              background: i % 2 === 0 ? accent[0] : accent[1],
              boxShadow: `0 0 10px ${accent[0]}`,
            }}
          />
        );
      })}
    </>
  );
};

/* ─── MEDIA FRAME ─── */

export const MediaFrame: FC<{
  src: string | null;
  accent: AccentPair;
  width?: number;
  height?: number;
}> = ({ src, accent, width = 820, height = 540 }) => {
  const frame = useCurrentFrame();
  const isVideo = src?.match(/\.(mp4|webm|mov)$/i);
  const shimmer = interpolate((frame * 2.2) % 160, [0, 160], [-300, 1200], clamp);

  return (
    <div
      style={{
        width,
        height,
        margin: "0 auto",
        borderRadius: 28,
        border: `2px solid ${accent[0]}33`,
        background: "rgba(8,12,18,0.8)",
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${accent[0]}15, inset 0 1px 0 rgba(255,255,255,0.06)`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Shimmer effect on border */}
      <div
        style={{
          position: "absolute",
          inset: -2,
          borderRadius: 28,
          border: `2px solid transparent`,
          background: `linear-gradient(105deg, transparent 0%, ${accent[0]}44 45%, ${accent[0]}88 50%, ${accent[0]}44 55%, transparent 100%)`,
          backgroundSize: "200% 100%",
          backgroundPosition: `${shimmer}px 0`,
          maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: 2,
          pointerEvents: "none",
          opacity: 0.6,
        }}
      />
      {src ? (
        isVideo ? (
          <OffthreadVideo
            src={staticFile(src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 26,
            }}
          />
        ) : (
          <Img
            src={staticFile(src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 26,
            }}
          />
        )
      ) : (
        <MediaPlaceholder accent={accent} width={width} height={height} />
      )}
    </div>
  );
};

const MediaPlaceholder: FC<{ accent: AccentPair; width: number; height: number }> = ({
  accent,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const pulse = loop(frame, [0.4, 0.7, 0.4], 100);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: `radial-gradient(circle, ${accent[0]}0a 0%, transparent 70%)`,
      }}
    >
      {/* Icon placeholder */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          border: `2px dashed ${accent[0]}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: pulse,
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "18px solid rgba(255,255,255,0.4)",
            borderTop: "12px solid transparent",
            borderBottom: "12px solid transparent",
            marginLeft: 4,
          }}
        />
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "rgba(255,255,255,0.25)",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        IMAGEN O VIDEO
      </div>
    </div>
  );
};

/* ─── NUMBER BADGE ─── */

export const NumberBadge: FC<{ number: string; accent: AccentPair }> = ({ number, accent }) => {
  const frame = useCurrentFrame();
  const glow = loop(frame, [0.3, 0.7, 0.3], 80);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 18,
          background: `linear-gradient(135deg, ${accent[0]}33 0%, ${accent[1]}22 100%)`,
          border: `2px solid ${accent[0]}55`,
          boxShadow: `0 0 ${30 * glow}px ${accent[0]}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          fontWeight: 900,
          color: accent[0],
          letterSpacing: 1,
        }}
      >
        {number}
      </div>
    </div>
  );
};

/* ─── TITLE ─── */

export const SceneTitle: FC<{ text: string; accent: AccentPair; size?: number }> = ({
  text,
  accent,
  size = 96,
}) => (
  <div
    style={{
      fontSize: size,
      lineHeight: 0.92,
      fontWeight: 800,
      letterSpacing: -4,
      textAlign: "center",
      whiteSpace: "pre-line",
      color: "#F5F8FF",
      textShadow: `0 0 30px ${accent[0]}18`,
    }}
  >
    {text}
  </div>
);

/* ─── SUBTITLE ─── */

export const SubtitleText: FC<{
  text: string;
  accent?: string;
  size?: number;
  maxWidth?: number;
}> = ({ text, accent = "rgba(255,255,255,0.88)", size = 46, maxWidth = 700 }) => (
  <div
    style={{
      maxWidth,
      margin: "0 auto",
      fontSize: size,
      lineHeight: 1.15,
      fontWeight: 600,
      textAlign: "center",
      color: accent,
    }}
  >
    {text}
  </div>
);

/* ─── DETAIL ─── */

export const DetailText: FC<{
  text: string;
  size?: number;
  maxWidth?: number;
}> = ({ text, size = 34, maxWidth = 720 }) => (
  <div
    style={{
      maxWidth,
      margin: "0 auto",
      fontSize: size,
      lineHeight: 1.22,
      fontWeight: 500,
      textAlign: "center",
      color: "rgba(210,218,230,0.78)",
    }}
  >
    {text}
  </div>
);

/* ─── EYEBROW ─── */

export const EyebrowLabel: FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const pulse = loop(frame, [0.88, 1.18, 0.88], 68);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        letterSpacing: 4.5,
        textTransform: "uppercase",
        fontSize: 26,
        fontWeight: 700,
        color: "rgba(230,240,255,0.72)",
      }}
    >
      <div
        style={{
          width: 11,
          height: 11,
          borderRadius: 999,
          background: accent,
          boxShadow: `0 0 ${24 * pulse}px ${accent}`,
          transform: `scale(${pulse})`,
        }}
      />
      <span>{text}</span>
    </div>
  );
};

/* ─── ACCENT BAR ─── */

export const AccentBar: FC<{ accent: AccentPair }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const width = interpolate((frame * 1.6) % 100, [0, 50, 100], [160, 240, 160], clamp);

  return (
    <div
      style={{
        width,
        height: 5,
        borderRadius: 999,
        background: `linear-gradient(90deg, ${accent[1]} 0%, ${accent[0]} 100%)`,
        boxShadow: `0 0 22px ${accent[0]}55`,
        margin: "0 auto",
      }}
    />
  );
};

/* ─── REVEAL ─── */

export const Reveal: FC<{
  children: ReactNode;
  y?: number;
  scaleFrom?: number;
  blurFrom?: number;
  durationInFrames?: number;
}> = ({ children, y = 30, scaleFrom = 0.96, blurFrom = 18, durationInFrames = 32 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = revealSpring(frame, fps, durationInFrames);

  return (
    <div
      style={{
        opacity: interpolate(progress, [0, 1], [0, 1], clamp),
        transform: `translateY(${interpolate(progress, [0, 1], [y, 0], clamp)}px) scale(${interpolate(progress, [0, 1], [scaleFrom, 1], clamp)})`,
        filter: `blur(${interpolate(progress, [0, 1], [blurFrom, 0], clamp)}px)`,
      }}
    >
      {children}
    </div>
  );
};

/* ─── BLOCK SEQUENCE ─── */

export const BlockSequence: FC<{
  from: number;
  durationInFrames: number;
  children: ReactNode;
}> = ({ from, durationInFrames, children }) => (
  <Sequence layout="none" from={from} durationInFrames={durationInFrames}>
    {children}
  </Sequence>
);

/* ─── LAYOUTS ─── */

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

/** Hook: eyebrow + big title + subtitle + media */
export const HookLayout: FC<{
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  media?: ReactNode;
}> = ({ eyebrow, title, subtitle, media }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <Slot top={110} height={70}>{eyebrow}</Slot>
    <Slot top={230} height={380}>{title}</Slot>
    <Slot top={660} height={70}>{subtitle}</Slot>
    <Slot top={790} height={540}>{media}</Slot>
  </div>
);

/** Signal: number + media + title + detail */
export const SignalLayout: FC<{
  badge?: ReactNode;
  media?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  detail?: ReactNode;
}> = ({ badge, media, title, subtitle, detail }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <Slot top={70} height={80}>{badge}</Slot>
    <Slot top={170} height={500}>{media}</Slot>
    <Slot top={730} height={280}>{title}</Slot>
    <Slot top={1040} height={100}>{subtitle}</Slot>
    <Slot top={1180} height={160}>{detail}</Slot>
  </div>
);

/** Outro: eyebrow + title + subtitle + bar */
export const OutroLayout: FC<{
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  bar?: ReactNode;
}> = ({ eyebrow, title, subtitle, bar }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <Slot top={300} height={70}>{eyebrow}</Slot>
    <Slot top={420} height={400}>{title}</Slot>
    <Slot top={900} height={100}>{subtitle}</Slot>
    <Slot top={1060} height={40}>{bar}</Slot>
  </div>
);
