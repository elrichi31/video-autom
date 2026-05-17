import type { FC, ReactNode } from "react";
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

const fontStack =
  '"Poppins", "Inter", "Avenir Next", "SF Pro Display", ui-sans-serif, system-ui, sans-serif';
const monoStack =
  '"JetBrains Mono", "Fira Code", "SF Mono", "Cascadia Code", monospace';

const safeBounds = {
  left: 86,
  right: 86,
  top: 108,
  bottom: 120,
};

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
    config: { damping: 200, stiffness: 180, mass: 0.9 },
  });

/* ─── SCENE SHELL (RED VARIANT) ─── */

export const DarkShell: FC<{
  accent: AccentPair;
  durationInFrames: number;
  children: ReactNode;
  variant?: "alert" | "body" | "terminal" | "close";
}> = ({ accent, durationInFrames, children, variant = "body" }) => {
  const frame = useCurrentFrame();
  const contentOpacity = interpolate(
    frame,
    [0, 10, durationInFrames - 14, durationInFrames - 1],
    [0.72, 1, 1, 0.82],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );
  const driftY = loop(frame, [8, 0, 8], 200);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050101", color: "white", overflow: "hidden" }}>
      <DarkBackground accent={accent} variant={variant} />
      {variant === "alert" && <AlertBorder accent={accent} />}
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
            transformOrigin: "center center",
          }}
        >
          {children}
        </div>
      </div>
      <ScanLine />
    </AbsoluteFill>
  );
};

/* ─── DARK BACKGROUND ─── */

const DarkBackground: FC<{ accent: AccentPair; variant: string }> = ({ accent, variant }) => {
  const frame = useCurrentFrame();
  const pulseOpacity = variant === "alert"
    ? interpolate((frame * 2) % 60, [0, 30, 60], [0.08, 0.22, 0.08], clamp)
    : 0.12;

  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${accent[1]}33 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${accent[0]}18 0%, transparent 40%), linear-gradient(180deg, #0a0204 0%, #050101 50%, #020001 100%)`,
        }}
      />
      {/* Grid */}
      <AbsoluteFill
        style={{
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.3) 100%)",
        }}
      />
      {/* Center pulse */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${accent[0]}${Math.round(pulseOpacity * 255).toString(16).padStart(2, "0")} 0%, transparent 45%)`,
          transform: `scale(${loop(frame, [1, 1.06, 1], 120)})`,
        }}
      />
      {/* Floating particles */}
      {Array.from({ length: 14 }).map((_, i) => {
        const size = 2 + random(`zd-p-s-${i}`) * 3;
        const baseLeft = 5 + random(`zd-p-l-${i}`) * 90;
        const baseTop = 10 + random(`zd-p-t-${i}`) * 80;
        const cycle = 100 + Math.floor(random(`zd-p-c-${i}`) * 60);
        const progress = ((frame + i * 9) % cycle) / cycle;
        const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 0.35, 0.2, 0], clamp);
        return (
          <div
            key={`zd-p-${i}`}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: 999,
              left: `${baseLeft}%`,
              top: `${baseTop - progress * 6}%`,
              opacity,
              background: i % 2 === 0 ? accent[0] : accent[1],
              boxShadow: `0 0 12px ${accent[0]}`,
            }}
          />
        );
      })}
    </>
  );
};

/* ─── SCAN LINE (CRT effect) ─── */

const ScanLine: FC = () => {
  const frame = useCurrentFrame();
  const y = interpolate((frame * 3) % 240, [0, 240], [-5, 105], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${y}%`,
        height: 3,
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent 100%)",
        pointerEvents: "none",
      }}
    />
  );
};

/* ─── ALERT BORDER ─── */

const AlertBorder: FC<{ accent: AccentPair }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate((frame * 3) % 60, [0, 30, 60], [0.15, 0.55, 0.15], clamp);

  return (
    <div
      style={{
        position: "absolute",
        inset: 24,
        border: `3px solid ${accent[0]}`,
        borderRadius: 32,
        opacity: pulse,
        boxShadow: `inset 0 0 60px ${accent[0]}22, 0 0 40px ${accent[0]}33`,
        pointerEvents: "none",
      }}
    />
  );
};

/* ─── GLITCH TITLE ─── */

export const GlitchTitle: FC<{ text: string; accent: AccentPair; size?: number }> = ({
  text,
  accent,
  size = 140,
}) => {
  const frame = useCurrentFrame();
  const glitchActive = (frame % 90) > 82 || (frame % 60) > 55;
  const offsetR = glitchActive ? interpolate(random(`g-r-${frame}`), [0, 1], [-6, 6]) : 0;
  const offsetB = glitchActive ? interpolate(random(`g-b-${frame}`), [0, 1], [-4, 4]) : 0;
  const skew = glitchActive ? interpolate(random(`g-s-${frame}`), [0, 1], [-1.5, 1.5]) : 0;

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      {/* Red ghost */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          fontSize: size,
          lineHeight: 0.9,
          fontWeight: 900,
          letterSpacing: -6,
          whiteSpace: "pre-line",
          color: "transparent",
          WebkitTextStroke: `2px ${accent[0]}66`,
          transform: `translate(${offsetR}px, ${-offsetR * 0.5}px) skewX(${skew}deg)`,
          opacity: glitchActive ? 0.7 : 0,
        }}
      >
        {text}
      </div>
      {/* Blue ghost */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          fontSize: size,
          lineHeight: 0.9,
          fontWeight: 900,
          letterSpacing: -6,
          whiteSpace: "pre-line",
          color: "transparent",
          WebkitTextStroke: `2px #4488ff66`,
          transform: `translate(${offsetB}px, ${offsetB * 0.5}px) skewX(${-skew}deg)`,
          opacity: glitchActive ? 0.5 : 0,
        }}
      >
        {text}
      </div>
      {/* Main text */}
      <div
        style={{
          position: "relative",
          fontSize: size,
          lineHeight: 0.9,
          fontWeight: 900,
          letterSpacing: -6,
          whiteSpace: "pre-line",
          color: "#FFFFFF",
          textShadow: `0 0 40px ${accent[0]}44, 0 0 80px ${accent[0]}22`,
          transform: `skewX(${skew * 0.3}deg)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ─── TIMESTAMP DISPLAY ─── */

export const TimestampDisplay: FC<{ time: string; accent: AccentPair }> = ({ time, accent }) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          background: accent[0],
          boxShadow: `0 0 20px ${accent[0]}`,
          opacity: blink ? 1 : 0.3,
        }}
      />
      <div
        style={{
          fontFamily: monoStack,
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: 4,
          color: accent[0],
          textShadow: `0 0 16px ${accent[0]}66`,
        }}
      >
        {time}
      </div>
    </div>
  );
};

/* ─── TERMINAL BLOCK ─── */

export const TerminalBlock: FC<{
  lines: readonly string[];
  accent: AccentPair;
  startFrame?: number;
}> = ({ lines, accent, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const charsPerFrame = 1.2;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 780,
        margin: "0 auto",
        padding: "28px 32px",
        borderRadius: 20,
        border: `1px solid ${accent[0]}33`,
        background: "rgba(10,4,4,0.85)",
        backdropFilter: "blur(12px)",
        boxShadow: `0 0 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {lines.map((line, i) => {
        const lineStart = startFrame + i * 28;
        const elapsed = Math.max(0, frame - lineStart);
        const visibleChars = Math.min(line.length, Math.floor(elapsed * charsPerFrame));
        const showCursor = elapsed > 0 && visibleChars < line.length;
        const lineOpacity = elapsed > 0 ? 1 : 0;

        return (
          <div
            key={`term-${i}`}
            style={{
              fontFamily: monoStack,
              fontSize: 28,
              lineHeight: 1.7,
              fontWeight: 500,
              color: i === lines.length - 1 ? accent[0] : "rgba(255,255,255,0.72)",
              opacity: lineOpacity,
              textShadow: i === lines.length - 1 ? `0 0 8px ${accent[0]}44` : "none",
            }}
          >
            {line.substring(0, visibleChars)}
            {showCursor && (
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 24,
                  background: accent[0],
                  marginLeft: 2,
                  opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
                  verticalAlign: "middle",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ─── PHASE LABEL ─── */

export const PhaseLabel: FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const pulse = loop(frame, [0.85, 1.2, 0.85], 70);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        letterSpacing: 5,
        textTransform: "uppercase",
        fontSize: 28,
        fontWeight: 700,
        color: accent,
        textShadow: `0 0 12px ${accent}66`,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: accent,
          boxShadow: `0 0 ${22 * pulse}px ${accent}`,
          transform: `scale(${pulse})`,
        }}
      />
      <span>{text}</span>
    </div>
  );
};

/* ─── NARRATIVE TEXT ─── */

export const NarrativeText: FC<{
  text: string;
  size?: number;
  maxWidth?: number;
  accent?: string;
}> = ({ text, size = 64, maxWidth = 700, accent = "rgba(255,255,255,0.92)" }) => (
  <div
    style={{
      maxWidth,
      margin: "0 auto",
      fontSize: size,
      lineHeight: 1.12,
      fontWeight: 700,
      textAlign: "center",
      whiteSpace: "pre-line",
      color: accent,
    }}
  >
    {text}
  </div>
);

/* ─── DETAIL TEXT ─── */

export const DetailText: FC<{
  text: string;
  size?: number;
  maxWidth?: number;
}> = ({ text, size = 36, maxWidth = 720 }) => (
  <div
    style={{
      maxWidth,
      margin: "0 auto",
      fontSize: size,
      lineHeight: 1.22,
      fontWeight: 500,
      textAlign: "center",
      color: "rgba(230,220,220,0.78)",
    }}
  >
    {text}
  </div>
);

/* ─── INDICATOR CARD ─── */

export const IndicatorCard: FC<{
  accent: AccentPair;
  items: readonly string[];
}> = ({ accent, items }) => {
  const frame = useCurrentFrame();
  const sweep = interpolate((frame * 2) % 150, [0, 150], [-250, 1150], clamp);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: 660,
        margin: "0 auto",
        padding: "24px 28px",
        borderRadius: 24,
        border: `1px solid ${accent[0]}30`,
        background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%), rgba(10,4,4,0.7)",
        boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${accent[0]}14`,
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 180,
          background: `linear-gradient(90deg, transparent 0%, ${accent[0]}18 50%, transparent 100%)`,
          transform: `translateX(${sweep}px) skewX(-18deg)`,
          filter: "blur(6px)",
          opacity: 0.6,
        }}
      />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((item, i) => (
          <IndicatorRow key={item} text={item} accent={accent} index={i} />
        ))}
      </div>
    </div>
  );
};

const IndicatorRow: FC<{ text: string; accent: AccentPair; index: number }> = ({ text, accent, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = revealSpring(frame - index * 8, fps, 26);
  const pulse = loop(frame + index * 12, [0.8, 1.25, 0.8], 80);
  const color = index === 0 ? accent[0] : accent[1];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: interpolate(progress, [0, 1], [0, 1], clamp),
        transform: `translateX(${interpolate(progress, [0, 1], [20, 0], clamp)}px)`,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 ${16 * pulse}px ${color}`,
          transform: `scale(${pulse})`,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontSize: 40,
          lineHeight: 1.1,
          fontWeight: 600,
          color: "rgba(255,248,248,0.92)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ─── ACTION LIST (for defense scene) ─── */

export const ActionList: FC<{
  items: readonly string[];
  accent: AccentPair;
}> = ({ items, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 740,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {items.map((item, i) => {
        const delay = i * 14;
        const progress = revealSpring(frame - delay, fps, 28);
        return (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "16px 24px",
              borderRadius: 18,
              border: `1px solid ${accent[0]}22`,
              background: "rgba(255,255,255,0.04)",
              opacity: interpolate(progress, [0, 1], [0, 1], clamp),
              transform: `translateX(${interpolate(progress, [0, 1], [-30, 0], clamp)}px)`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${accent[0]}22`,
                border: `1px solid ${accent[0]}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 800,
                color: accent[0],
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                fontSize: 34,
                lineHeight: 1.15,
                fontWeight: 600,
                color: "rgba(255,252,252,0.9)",
              }}
            >
              {item}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ─── ACCENT BAR ─── */

export const AccentBar: FC<{ accent: AccentPair }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const width = interpolate((frame * 1.8) % 100, [0, 50, 100], [160, 260, 160], clamp);

  return (
    <div
      style={{
        width,
        height: 5,
        borderRadius: 999,
        background: `linear-gradient(90deg, ${accent[1]} 0%, ${accent[0]} 100%)`,
        boxShadow: `0 0 20px ${accent[0]}55`,
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

export const AlertLayout: FC<{
  tag?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
}> = ({ tag, title, subtitle }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <Slot top={340} height={80}>{tag}</Slot>
    <Slot top={480} height={500}>{title}</Slot>
    <Slot top={1050} height={80}>{subtitle}</Slot>
  </div>
);

export const ExplainLayout: FC<{
  tag?: ReactNode;
  terminal?: ReactNode;
  definition?: ReactNode;
  detail?: ReactNode;
}> = ({ tag, terminal, definition, detail }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <Slot top={100} height={70}>{tag}</Slot>
    <Slot top={220} height={320}>{terminal}</Slot>
    <Slot top={610} height={340}>{definition}</Slot>
    <Slot top={1020} height={160}>{detail}</Slot>
  </div>
);

export const PhaseLayout: FC<{
  phase?: ReactNode;
  timestamp?: ReactNode;
  title?: ReactNode;
  narrative?: ReactNode;
  detail?: ReactNode;
  indicator?: ReactNode;
}> = ({ phase, timestamp, title, narrative, detail, indicator }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <Slot top={100} height={70}>{phase}</Slot>
    <Slot top={190} height={60}>{timestamp}</Slot>
    <Slot top={310} height={220}>{title}</Slot>
    <Slot top={590} height={200}>{narrative}</Slot>
    <Slot top={850} height={170}>{detail}</Slot>
    <Slot top={1080} height={250}>{indicator}</Slot>
  </div>
);

export const DefenseLayout: FC<{
  tag?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
}> = ({ tag, title, actions }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <Slot top={100} height={70}>{tag}</Slot>
    <Slot top={220} height={340}>{title}</Slot>
    <Slot top={630} height={650}>{actions}</Slot>
  </div>
);

export const CloseLayout: FC<{
  tag?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  bar?: ReactNode;
}> = ({ tag, title, subtitle, bar }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <Slot top={320} height={70}>{tag}</Slot>
    <Slot top={440} height={440}>{title}</Slot>
    <Slot top={960} height={80}>{subtitle}</Slot>
    <Slot top={1100} height={40}>{bar}</Slot>
  </div>
);
