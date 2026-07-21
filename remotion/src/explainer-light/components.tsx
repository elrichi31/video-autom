import type { FC, ReactNode } from "react";
import { useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * EXPLAINER-LIGHT THEME
 * ---------------------
 * A clean, light ("quiet flex") counterpart to the dark hacker themes
 * (dark-web / cyber / phone-hacked / zero-day). It exposes the EXACT same
 * component API so any composition can switch to it by changing a single
 * import line:
 *
 *   import { ... } from "./dark-web/components";
 *   →  import { ... } from "./explainer-light/components";
 *
 * The purely structural layouts (AlertLayout, ExplainLayout, PhaseLayout,
 * DefenseLayout, CloseLayout, EventLayout) plus the generic Reveal and
 * BlockSequence carry no colour, so they are re-exported from zero-day rather
 * than duplicated. Everything visual is re-styled here for a light surface.
 */
export {
  Reveal,
  BlockSequence,
  AlertLayout,
  ExplainLayout,
  PhaseLayout,
  DefenseLayout,
  CloseLayout,
  EventLayout,
} from "../zero-day/components";

// AccentPair is a simple [primary, secondary] tuple of brand colours provided
// per-video by that video's data.ts. Defined locally so this theme folder has
// no data.ts dependency.
type AccentPair = [string, string];

type MotionSceneKey =
  | "intro"
  | "layers"
  | "phase1"
  | "phase2"
  | "phase3"
  | "reality"
  | "close"
  | "event1"
  | "event2"
  | "event3"
  | "event4"
  | "today";

/* ─── DESIGN TOKENS ─── */

const INK = "#151b2b"; // primary text
const INK_SOFT = "rgba(21,27,43,0.60)"; // muted text
const CARD_BG = "rgba(255,255,255,0.82)";
const CARD_BORDER = "rgba(21,27,43,0.08)";
const CARD_SHADOW = "0 18px 46px rgba(21,27,43,0.10), 0 2px 6px rgba(21,27,43,0.05)";

const fontStack =
  '"Poppins", "Inter", "Avenir Next", "SF Pro Display", ui-sans-serif, system-ui, sans-serif';
const monoStack =
  '"JetBrains Mono", "Fira Code", "SF Mono", "Cascadia Code", monospace';

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const safeBounds = { left: 86, right: 86, top: 108, bottom: 120 };

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

// Turns "#RRGGBB" + 0..1 alpha into an rgba() string. Falls back gracefully if
// an accent ever arrives in a non-hex form.
const withAlpha = (hex: string, alpha: number): string => {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Background image that quietly disappears if the file is missing, so a video
// can be previewed before every scene image has been generated.
const OptionalBg: FC<{ src: string; style: React.CSSProperties }> = ({ src, style }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <Img src={src} style={style} onError={() => setFailed(true)} />;
};

/* ─── SCENE SHELL (LIGHT VARIANT) ─── */

export const DarkShell: FC<{
  accent: AccentPair;
  durationInFrames: number;
  children: ReactNode;
  variant?: "alert" | "body" | "terminal" | "close";
  bgSrc?: string;
  niche?: string;
  hookStyle?: string;
  sceneKey?: MotionSceneKey;
}> = ({ accent, durationInFrames, children, variant = "body", bgSrc, sceneKey }) => {
  const frame = useCurrentFrame();

  // Gentle Ken Burns on the (subtle) scene image.
  const imageProgress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], clamp);
  const bgScale = interpolate(imageProgress, [0, 1], [1.06, 1.14], clamp);
  const bgX = interpolate(imageProgress, [0, 1], [-6, 6], clamp);
  const bgY = interpolate(imageProgress, [0, 1], [-3, 3], clamp);

  const contentOpacity = interpolate(
    frame,
    [0, 10, durationInFrames - 14, durationInFrames - 1],
    [0.78, 1, 1, 0.9],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );
  const driftY = loop(frame, [6, 0, 6], 220);

  return (
    <AbsoluteFill style={{ backgroundColor: "#f5f6fb", color: INK, overflow: "hidden" }}>
      {/* Scene image, kept faint behind a light veil so dark text stays legible */}
      {bgSrc && (
        <OptionalBg
          src={bgSrc}
          style={{
            position: "absolute",
            inset: -24,
            width: "calc(100% + 48px)",
            height: "calc(100% + 48px)",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.16,
            filter: "saturate(1.05)",
            transform: `translate3d(${bgX}px, ${bgY}px, 0) scale(${bgScale})`,
          }}
        />
      )}
      <LightBackground accent={accent} variant={variant} sceneKey={sceneKey} />
      {variant === "alert" && <AlertRibbon accent={accent} />}
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
    </AbsoluteFill>
  );
};

/* ─── LIGHT BACKGROUND ─── */

const LightBackground: FC<{
  accent: AccentPair;
  variant: string;
  sceneKey?: MotionSceneKey;
}> = ({ accent, variant, sceneKey }) => {
  const frame = useCurrentFrame();
  const glowScale = loop(frame, [1, 1.05, 1], 160);
  const isIntro = sceneKey === "intro";

  return (
    <>
      {/* Soft paper gradient */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, #f4f6fb 45%, #eef1f8 100%)",
        }}
      />
      {/* Faint brand glow, top-centre */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 22%, ${withAlpha(accent[0], isIntro ? 0.14 : 0.1)} 0%, transparent 55%), radial-gradient(circle at 82% 84%, ${withAlpha(accent[1], 0.08)} 0%, transparent 42%)`,
          transform: `scale(${glowScale})`,
        }}
      />
      {/* Subtle dotted grid */}
      <AbsoluteFill
        style={{
          opacity: 0.5,
          backgroundImage: `radial-gradient(${withAlpha(INK, 0.05)} 1.5px, transparent 1.5px)`,
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 45%, transparent 60%, rgba(0,0,0,0.4) 100%)",
        }}
      />
      {/* Top + bottom hairlines tinted with the brand accent */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 70,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${withAlpha(accent[0], 0.5)} 30%, ${withAlpha(accent[1], 0.5)} 70%, transparent 100%)`,
          opacity: 0.5,
        }}
      />
      {/* A few slow floating dots for life, kept very quiet */}
      {Array.from({ length: 10 }).map((_, i) => {
        const size = 4 + random(`el-p-s-${i}`) * 5;
        const left = 6 + random(`el-p-l-${i}`) * 88;
        const top = 12 + random(`el-p-t-${i}`) * 76;
        const cycle = 150 + Math.floor(random(`el-p-c-${i}`) * 90);
        const progress = ((frame + i * 14) % cycle) / cycle;
        const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 0.22, 0.14, 0], clamp);
        return (
          <div
            key={`el-p-${i}`}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: 999,
              left: `${left}%`,
              top: `${top - progress * 5}%`,
              opacity,
              background: i % 2 === 0 ? accent[0] : accent[1],
            }}
          />
        );
      })}
      {variant === "close" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 60%, ${withAlpha(accent[0], 0.08)} 0%, transparent 45%)`,
          }}
        />
      )}
    </>
  );
};

/* ─── ALERT RIBBON (soft, non-flashing) ─── */

const AlertRibbon: FC<{ accent: AccentPair }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const glow = loop(frame, [0.35, 0.6, 0.35], 70);

  return (
    <div
      style={{
        position: "absolute",
        inset: 26,
        borderRadius: 34,
        border: `2px solid ${withAlpha(accent[0], 0.35)}`,
        boxShadow: `inset 0 0 60px ${withAlpha(accent[0], 0.06)}`,
        opacity: glow,
        pointerEvents: "none",
      }}
    />
  );
};

/* ─── TITLE (clean, layered — replaces the dark GlitchTitle) ─── */

export const GlitchTitle: FC<{ text: string; accent: AccentPair; size?: number }> = ({
  text,
  accent,
  size = 140,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = revealSpring(frame, fps, 34);
  const y = interpolate(progress, [0, 1], [26, 0], clamp);
  const op = interpolate(progress, [0, 1], [0, 1], clamp);

  return (
    <div style={{ position: "relative", textAlign: "center", transform: `translateY(${y}px)`, opacity: op }}>
      {/* Soft accent echo behind the title */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          fontSize: size,
          lineHeight: 0.9,
          fontWeight: 800,
          letterSpacing: -4,
          whiteSpace: "pre-line",
          color: "transparent",
          WebkitTextStroke: `2px ${withAlpha(accent[0], 0.22)}`,
          transform: "translate(0, 6px)",
        }}
      >
        {text}
      </div>
      <div
        style={{
          position: "relative",
          fontSize: size,
          lineHeight: 0.9,
          fontWeight: 800,
          letterSpacing: -4,
          whiteSpace: "pre-line",
          color: INK,
          textShadow: "0 2px 20px rgba(21,27,43,0.10)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ─── TIMESTAMP / STEP PILL ─── */

export const TimestampDisplay: FC<{ time: string; accent: AccentPair }> = ({ time, accent }) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 22px",
        borderRadius: 999,
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: CARD_SHADOW,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: accent[0],
          opacity: blink ? 1 : 0.35,
        }}
      />
      <div
        style={{
          fontFamily: monoStack,
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: 3,
          color: INK,
        }}
      >
        {time}
      </div>
    </div>
  );
};

/* ─── CODE / TERMINAL BLOCK (light card) ─── */

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
        borderRadius: 22,
        border: `1px solid ${CARD_BORDER}`,
        background: "rgba(255,255,255,0.9)",
        boxShadow: CARD_SHADOW,
        overflow: "hidden",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 24px",
          borderBottom: `1px solid ${CARD_BORDER}`,
          background: "rgba(21,27,43,0.02)",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 999, background: c }} />
        ))}
      </div>
      <div style={{ padding: "24px 32px" }}>
        {lines.map((line, i) => {
          const lineStart = startFrame + i * 28;
          const elapsed = Math.max(0, frame - lineStart);
          const visibleChars = Math.min(line.length, Math.floor(elapsed * charsPerFrame));
          const showCursor = elapsed > 0 && visibleChars < line.length;
          const isLast = i === lines.length - 1;

          return (
            <div
              key={`term-${i}`}
              style={{
                fontFamily: monoStack,
                fontSize: 28,
                lineHeight: 1.7,
                fontWeight: 500,
                color: isLast ? accent[0] : "rgba(21,27,43,0.7)",
                opacity: elapsed > 0 ? 1 : 0,
              }}
            >
              {line.substring(0, visibleChars)}
              {showCursor && (
                <span
                  style={{
                    display: "inline-block",
                    width: 11,
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
    </div>
  );
};

/* ─── PHASE / SECTION LABEL (accent pill) ─── */

export const PhaseLabel: FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const pulse = loop(frame, [0.85, 1.15, 0.85], 70);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 22px",
        borderRadius: 999,
        background: withAlpha(accent, 0.1),
        border: `1px solid ${withAlpha(accent, 0.28)}`,
        letterSpacing: 4,
        textTransform: "uppercase",
        fontSize: 24,
        fontWeight: 700,
        color: accent,
      }}
    >
      <div
        style={{
          width: 11,
          height: 11,
          borderRadius: 999,
          background: accent,
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
}> = ({ text, size = 64, maxWidth = 720, accent = INK }) => (
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
      textShadow: "0 1px 2px rgba(255,255,255,0.6)",
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
}> = ({ text, size = 36, maxWidth = 740 }) => (
  <div
    style={{
      maxWidth,
      margin: "0 auto",
      fontSize: size,
      lineHeight: 1.28,
      fontWeight: 500,
      textAlign: "center",
      color: INK_SOFT,
    }}
  >
    {text}
  </div>
);

/* ─── INDICATOR CARD ─── */

export const IndicatorCard: FC<{
  accent: AccentPair;
  items: readonly string[];
}> = ({ accent, items }) => (
  <div
    style={{
      width: "100%",
      maxWidth: 680,
      margin: "0 auto",
      padding: "26px 30px",
      borderRadius: 26,
      border: `1px solid ${CARD_BORDER}`,
      background: CARD_BG,
      boxShadow: CARD_SHADOW,
      backdropFilter: "blur(10px)",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {items.map((item, i) => (
        <IndicatorRow key={item} text={item} accent={accent} index={i} />
      ))}
    </div>
  </div>
);

const IndicatorRow: FC<{ text: string; accent: AccentPair; index: number }> = ({ text, accent, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = revealSpring(frame - index * 8, fps, 26);
  const color = index % 2 === 0 ? accent[0] : accent[1];

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
          width: 12,
          height: 12,
          borderRadius: 999,
          background: color,
          flexShrink: 0,
          boxShadow: `0 0 0 5px ${withAlpha(color, 0.14)}`,
        }}
      />
      <div style={{ fontSize: 38, lineHeight: 1.14, fontWeight: 600, color: INK }}>{text}</div>
    </div>
  );
};

/* ─── ACTION LIST (numbered steps) ─── */

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
        maxWidth: 760,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {items.map((item, i) => {
        const progress = revealSpring(frame - i * 14, fps, 28);
        return (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "18px 26px",
              borderRadius: 20,
              border: `1px solid ${CARD_BORDER}`,
              background: CARD_BG,
              boxShadow: CARD_SHADOW,
              opacity: interpolate(progress, [0, 1], [0, 1], clamp),
              transform: `translateX(${interpolate(progress, [0, 1], [-30, 0], clamp)}px)`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: withAlpha(accent[0], 0.12),
                border: `1px solid ${withAlpha(accent[0], 0.3)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 800,
                color: accent[0],
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ fontSize: 34, lineHeight: 1.16, fontWeight: 600, color: INK }}>{item}</div>
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
        height: 6,
        borderRadius: 999,
        background: `linear-gradient(90deg, ${accent[1]} 0%, ${accent[0]} 100%)`,
        boxShadow: `0 4px 14px ${withAlpha(accent[0], 0.35)}`,
      }}
    />
  );
};

/* ─── YEAR BADGE (timeline) ─── */

export const YearBadge: FC<{ year: string; accent: AccentPair }> = ({ year, accent }) => {
  const frame = useCurrentFrame();
  const pulse = loop(frame, [1, 1.015, 1], 80);

  return (
    <div style={{ position: "relative", textAlign: "center", transform: `scale(${pulse})` }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          fontFamily: monoStack,
          fontSize: 148,
          fontWeight: 900,
          letterSpacing: -6,
          lineHeight: 1,
          color: withAlpha(accent[0], 0.16),
          filter: "blur(2px)",
        }}
      >
        {year}
      </div>
      <div
        style={{
          position: "relative",
          fontFamily: monoStack,
          fontSize: 148,
          fontWeight: 900,
          letterSpacing: -6,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `3px ${accent[0]}`,
        }}
      >
        {year}
      </div>
    </div>
  );
};
