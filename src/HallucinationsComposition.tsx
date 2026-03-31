import type {CSSProperties, FC, ReactNode} from "react";
import {
	AbsoluteFill,
	Audio,
	Sequence,
	interpolate,
	random,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

type HallucinationsVideoProps = {
	backgroundMusicFile?: string | null;
};

type Tip = {
	index: number;
	icon: string;
	label: string;
	title: string;
	subtitle: string;
	detail: string;
	exampleBad?: string;
	exampleGood?: string;
	accent: [string, string];
};

const fps = 30;
const hookDuration = 5 * fps;
const problemDuration = 5 * fps;
const tipDuration = 6 * fps;
const outroDuration = 7 * fps;

export const hallucinationsDuration =
	hookDuration + problemDuration + 5 * tipDuration + outroDuration;

const fullScreenStyle: CSSProperties = {
	backgroundColor: "#040707",
	color: "white",
	fontFamily:
		'"Inter", "Poppins", "Avenir Next", "SF Pro Display", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
	overflow: "hidden",
};

const safeX = 56;
const safeTop = 76;
const safeBottom = 96;

const clamp = {
	extrapolateLeft: "clamp" as const,
	extrapolateRight: "clamp" as const,
};

const tips: Tip[] = [
	{
		index: 1,
		icon: "🧠",
		label: "TIP 1",
		title: "Sé específico en tu prompt",
		subtitle: "Evita preguntas vagas",
		detail: "Define formato, objetivo y límite",
		exampleBad: "❌ “Explícame esto”",
		exampleGood: "✅ “Explícame en 3 puntos con ejemplos”",
		accent: ["#7bffb5", "#14d8a6"],
	},
	{
		index: 2,
		icon: "📚",
		label: "TIP 2",
		title: "Pide fuentes o referencias",
		subtitle: "Reduce respuestas inventadas",
		detail: "Obliga a justificar la respuesta",
		accent: ["#97ff8f", "#1fd18d"],
	},
	{
		index: 3,
		icon: "🔍",
		label: "TIP 3",
		title: "Divide el problema",
		subtitle: "Haz preguntas paso a paso",
		detail: "Menos salto mental, más precisión",
		accent: ["#7cff9d", "#2ecb71"],
	},
	{
		index: 4,
		icon: "⚠️",
		label: "TIP 4",
		title: "Valida la información",
		subtitle: "Verifica datos importantes",
		detail: "Confirma fechas, cifras y nombres",
		accent: ["#87ffa6", "#10b981"],
	},
	{
		index: 5,
		icon: "🧩",
		label: "TIP 5",
		title: "Define contexto",
		subtitle: "Quién eres y qué necesitas",
		detail: "La IA responde mejor con contexto claro",
		accent: ["#90ff8d", "#34d399"],
	},
];

const sceneOpacity = (frame: number, durationInFrames: number) =>
	interpolate(frame, [0, 8, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], clamp);

const springIn = (frame: number, fpsValue: number, delay = 0) =>
	spring({
		fps: fpsValue,
		frame: frame - delay,
		config: {
			damping: 18,
			stiffness: 170,
			mass: 0.9,
		},
	});

const loopY = (frame: number, amplitude = 10, cycle = 120, phase = 0) =>
	interpolate((frame + phase) % cycle, [0, cycle / 2, cycle], [0, -amplitude, 0], clamp);

const loopScale = (frame: number, min = 1, max = 1.05, cycle = 150, phase = 0) =>
	interpolate((frame + phase) % cycle, [0, cycle / 2, cycle], [min, max, min], clamp);

const panel = (accent: string, radius = 30): CSSProperties => ({
	borderRadius: radius,
	border: `1px solid ${accent}2f`,
	background:
		"linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%), rgba(5,10,10,0.64)",
	boxShadow: `0 22px 56px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 30px ${accent}14`,
	backdropFilter: "blur(18px)",
});

const GlowDot: FC<{accent: string; size?: number}> = ({accent, size = 12}) => {
	const frame = useCurrentFrame();
	const scale = loopScale(frame, 0.85, 1.18, 54);

	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: 999,
				background: accent,
				boxShadow: `0 0 ${24 * scale}px ${accent}`,
				transform: `scale(${scale})`,
			}}
		/>
	);
};

const ParticleBackground: FC<{accent: [string, string]; disperse?: boolean}> = ({accent, disperse = false}) => {
	const frame = useCurrentFrame();

	return (
		<>
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle at top, rgba(123,255,181,0.1), transparent 28%), linear-gradient(180deg, #08110d 0%, #030706 52%, #010202 100%)",
					transform: `scale(${interpolate(frame, [0, 180], [1.06, 1], clamp)})`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: -180,
					left: -130 + interpolate(frame % 220, [0, 110, 220], [-40, 26, -40], clamp),
					width: 520,
					height: 520,
					borderRadius: 999,
					background: `radial-gradient(circle, ${accent[0]} 0%, rgba(0,0,0,0) 72%)`,
					filter: "blur(34px)",
					opacity: 0.2,
				}}
			/>
			<div
				style={{
					position: "absolute",
					right: -160,
					bottom: -220,
					width: 620,
					height: 620,
					borderRadius: 999,
					background: `radial-gradient(circle, ${accent[1]} 0%, rgba(0,0,0,0) 72%)`,
					filter: "blur(38px)",
					opacity: 0.16,
				}}
			/>
			{Array.from({length: 24}).map((_, index) => {
				const startX = 8 + random(`hx-${index}`) * 84;
				const startY = 10 + random(`hy-${index}`) * 80;
				const size = 3 + random(`hs-${index}`) * 5;
				const cycle = 140 + Math.floor(random(`hc-${index}`) * 70);
				const progress = ((frame + index * 6) % cycle) / cycle;
				const driftX = (random(`hdx-${index}`) - 0.5) * (disperse ? 140 : 34);
				const driftY = (random(`hdy-${index}`) - 0.5) * (disperse ? 140 : 22);
				const left = startX + driftX * progress;
				const top = disperse ? startY + driftY * progress : startY - progress * 20 + driftY * 0.2;
				const opacity = interpolate(progress, [0, 0.18, 0.82, 1], [0, 0.4, 0.28, 0], clamp);

				return (
					<div
						key={`particle-${index}`}
						style={{
							position: "absolute",
							left: `${left}%`,
							top: `${top}%`,
							width: size,
							height: size,
							borderRadius: 999,
							background: index % 2 === 0 ? accent[0] : accent[1],
							opacity,
							boxShadow: `0 0 18px ${index % 2 === 0 ? accent[0] : accent[1]}`,
						}}
					/>
				);
			})}
			{Array.from({length: 6}).map((_, index) => (
				<div
					key={`grid-h-${index}`}
					style={{
						position: "absolute",
						left: "8%",
						right: "8%",
						top: `${16 + index * 12}%`,
						height: 1,
						opacity: interpolate((frame + index * 12) % 140, [0, 70, 140], [0.01, 0.05, 0.01], clamp),
						background: `linear-gradient(90deg, transparent 0%, ${accent[0]} 18%, ${accent[1]} 50%, ${accent[0]} 82%, transparent 100%)`,
					}}
				/>
			))}
		</>
	);
};

const SceneShell: FC<{children: ReactNode; accent: [string, string]; disperse?: boolean}> = ({
	children,
	accent,
	disperse = false,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const opacity = sceneOpacity(frame, durationInFrames);
	const scale = interpolate(frame, [0, durationInFrames], [1, 1.02], clamp);

	return (
		<AbsoluteFill style={{opacity, transform: `scale(${scale})`}}>
			<ParticleBackground accent={accent} disperse={disperse} />
			<AbsoluteFill style={fullScreenStyle}>
				<div
					style={{
						position: "absolute",
						left: safeX,
						right: safeX,
						top: safeTop,
						bottom: safeBottom,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div style={{width: "100%", maxWidth: 980}}>{children}</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const BigText: FC<{children: ReactNode; delay?: number; maxWidth?: number; fontSize?: number}> = ({
	children,
	delay = 0,
	maxWidth = 980,
	fontSize = 124,
}) => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue, delay);
	const blur = interpolate(frame - delay, [0, 12], [18, 0], clamp);

	return (
		<div
			style={{
				maxWidth,
				fontSize,
				lineHeight: 0.94,
				letterSpacing: -6.2,
				fontWeight: 900,
				textAlign: "center",
				opacity: reveal,
				transform: `translateY(${interpolate(reveal, [0, 1], [38, 0], clamp)}px) scale(${interpolate(reveal, [0, 1], [0.94, 1], clamp)})`,
				filter: `blur(${Math.max(0, blur)}px)`,
			}}
		>
			{children}
		</div>
	);
};

const Kicker: FC<{text: string; accent: string}> = ({text, accent}) => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue);

	return (
		<div
			style={{
				...panel(accent, 999),
				padding: "16px 20px",
				display: "inline-flex",
				alignItems: "center",
				gap: 12,
				fontSize: 24,
				fontWeight: 800,
				textTransform: "uppercase",
				letterSpacing: 1.6,
				opacity: reveal,
				transform: `translateY(${interpolate(reveal, [0, 1], [24, 0], clamp)}px)`,
				alignSelf: "center",
			}}
		>
			<GlowDot accent={accent} size={10} />
			{text}
		</div>
	);
};

const TipHeader: FC<{text: string; accent: string}> = ({text, accent}) => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue);

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap: 16,
				fontSize: 42,
				fontWeight: 900,
				letterSpacing: 2.8,
				textTransform: "uppercase",
				color: accent,
				textShadow: `0 0 24px ${accent}44`,
				opacity: reveal,
				transform: `translateY(${interpolate(reveal, [0, 1], [24, 0], clamp)}px)`,
			}}
		>
			<GlowDot accent={accent} size={12} />
			{text}
		</div>
	);
};

const TipMotionBackdrop: FC<{accent: [string, string]; index: number}> = ({accent, index}) => {
	const frame = useCurrentFrame();
	const beamX = interpolate((frame + index * 22) % 240, [0, 120, 240], [-18, 54, -18], clamp);
	const lineOffsetA = interpolate((frame + index * 12) % 260, [0, 260], [-220, 220], clamp);
	const lineOffsetB = interpolate((frame + index * 18) % 220, [0, 220], [220, -220], clamp);
	const lineOffsetC = interpolate((frame + index * 9) % 280, [0, 280], [-180, 180], clamp);

	return (
		<div style={{position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none"}}>
			<div
				style={{
					position: "absolute",
					left: beamX + "%",
					top: "12%",
					bottom: "12%",
					width: 180,
					background: `linear-gradient(180deg, transparent 0%, ${accent[0]}18 24%, ${accent[1]}28 50%, ${accent[0]}18 76%, transparent 100%)`,
					filter: "blur(12px)",
					opacity: 0.65,
					transform: "skewX(-12deg)",
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: -80 + lineOffsetA,
					top: 180,
					width: 520,
					height: 2,
					background: `linear-gradient(90deg, transparent 0%, ${accent[0]}00 8%, ${accent[0]}88 28%, ${accent[1]}cc 50%, ${accent[0]}88 72%, ${accent[0]}00 92%, transparent 100%)`,
					boxShadow: `0 0 24px ${accent[0]}44`,
					transform: "rotate(-14deg)",
					opacity: 0.72,
				}}
			/>
			<div
				style={{
					position: "absolute",
					right: -120 + lineOffsetB,
					top: 320,
					width: 480,
					height: 2,
					background: `linear-gradient(90deg, transparent 0%, ${accent[1]}00 8%, ${accent[1]}88 30%, ${accent[0]}cc 50%, ${accent[1]}88 70%, ${accent[1]}00 92%, transparent 100%)`,
					boxShadow: `0 0 22px ${accent[1]}40`,
					transform: "rotate(18deg)",
					opacity: 0.68,
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: 120,
					bottom: 220 + lineOffsetC * 0.18,
					width: 420,
					height: 1,
					background: `linear-gradient(90deg, transparent 0%, ${accent[0]}66 32%, ${accent[1]}aa 50%, ${accent[0]}66 68%, transparent 100%)`,
					boxShadow: `0 0 18px ${accent[0]}36`,
					transform: "rotate(8deg)",
					opacity: 0.6,
				}}
			/>
			<div
				style={{
					position: "absolute",
					right: 90,
					top: 154,
					bottom: 154,
					width: 1,
					background: `linear-gradient(180deg, transparent 0%, ${accent[1]}00 12%, ${accent[1]}70 50%, ${accent[1]}00 88%, transparent 100%)`,
					boxShadow: `0 0 18px ${accent[1]}30`,
					opacity: 0.5,
				}}
			/>
			{Array.from({length: 5}).map((_, diagIndex) => (
				<div
					key={`tip-diag-${diagIndex}`}
					style={{
						position: "absolute",
						left: `${8 + diagIndex * 16}%`,
						top: `${18 + diagIndex * 10 + loopY(frame, 6, 90, diagIndex * 14)}%`,
						width: 220,
						height: 1,
						background: `linear-gradient(90deg, transparent 0%, ${diagIndex % 2 === 0 ? accent[0] : accent[1]}99 50%, transparent 100%)`,
						transform: `rotate(${diagIndex % 2 === 0 ? -24 : 24}deg)`,
						opacity: 0.34,
					}}
				/>
			))}
			{Array.from({length: 7}).map((_, glowIndex) => (
				<div
					key={`tip-grid-${glowIndex}`}
					style={{
						position: "absolute",
						left: "12%",
						right: "12%",
						top: `${20 + glowIndex * 9}%`,
						height: 1,
						opacity: interpolate((frame + glowIndex * 16) % 150, [0, 75, 150], [0.01, 0.045, 0.01], clamp),
						background: `linear-gradient(90deg, transparent 0%, ${accent[0]} 30%, ${accent[1]} 50%, ${accent[0]} 70%, transparent 100%)`,
					}}
				/>
			))}
		</div>
	);
};

const LineCard: FC<{children: ReactNode; accent: string; delay?: number; compact?: boolean}> = ({
	children,
	accent,
	delay = 0,
	compact = false,
}) => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue, delay);
	const drift = loopY(frame, compact ? 5 : 8, compact ? 100 : 130, delay * 2);

	return (
		<div
			style={{
				...panel(accent, compact ? 24 : 28),
				padding: compact ? "20px 22px" : "24px 26px",
				display: "flex",
				alignItems: "center",
				gap: 16,
				fontSize: compact ? 32 : 40,
				lineHeight: 1.08,
				fontWeight: 700,
				textAlign: "center",
				justifyContent: "center",
				maxWidth: compact ? 920 : 980,
				width: "100%",
				justifySelf: "center",
				opacity: reveal,
				transform: `translateY(${interpolate(reveal, [0, 1], [30, drift], clamp)}px)`,
			}}
		>
			<GlowDot accent={accent} />
			<div>{children}</div>
		</div>
	);
};

const HighlightWord: FC<{text: string; accent: string}> = ({text, accent}) => (
	<span
		style={{
			color: accent,
			textShadow: `0 0 18px ${accent}55`,
		}}
	>
		{text}
	</span>
);

const FixedSlot: FC<{
	height: number;
	children: ReactNode;
	width?: string | number;
	align?: "center" | "start";
	gap?: number;
}> = ({height, children, width = "100%", align = "center", gap = 0}) => (
	<div
		style={{
			height,
			width,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: align === "center" ? "center" : "flex-start",
			gap,
			flexShrink: 0,
		}}
	>
		{children}
	</div>
);

const HookScene: FC = () => {
	return (
		<SceneShell accent={["rgba(124,255,174,0.32)", "rgba(45,212,140,0.28)"]}>
			<div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 24, height: "100%"}}>
				<Sequence durationInFrames={hookDuration} layout="none">
					<Kicker text="IA · Respuestas mejores" accent="#7bffb5" />
				</Sequence>
				<Sequence from={8} durationInFrames={hookDuration - 8} layout="none">
					<BigText maxWidth={1040} fontSize={142}>La IA NO siempre tiene razón</BigText>
				</Sequence>
				<Sequence from={34} durationInFrames={hookDuration - 34} layout="none">
					<BigText delay={0} maxWidth={920} fontSize={130}>Así evito que alucine 👇</BigText>
				</Sequence>
			</div>
		</SceneShell>
	);
};

const ProblemScene: FC = () => {
	return (
		<SceneShell accent={["rgba(124,255,174,0.3)", "rgba(34,197,94,0.24)"]}>
			<div style={{display: "grid", justifyItems: "center", textAlign: "center", gap: 20}}>
				<FixedSlot height={72} width={420}>
					<Sequence durationInFrames={problemDuration} layout="none">
						<Kicker text="El problema" accent="#7bffb5" />
					</Sequence>
				</FixedSlot>
				<FixedSlot height={106}>
					<Sequence from={16} durationInFrames={problemDuration - 16} layout="none">
						<LineCard accent="#7bffb5">
							A veces <HighlightWord text="inventa" accent="#7bffb5" /> datos
						</LineCard>
					</Sequence>
				</FixedSlot>
				<FixedSlot height={106}>
					<Sequence from={54} durationInFrames={problemDuration - 54} layout="none">
						<LineCard accent="#9eff8d">
							Respuestas seguras… pero <HighlightWord text="incorrectas" accent="#9eff8d" />
						</LineCard>
					</Sequence>
				</FixedSlot>
			</div>
		</SceneShell>
	);
};

const TipScene: FC<{tip: Tip}> = ({tip}) => {
	const frame = useCurrentFrame();
	const scale = loopScale(frame, 1, 1.05, 140, tip.index * 8);

	return (
		<SceneShell accent={[`${tip.accent[0]}44`, `${tip.accent[1]}44`]}>
			<div
				style={{
					position: "relative",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					textAlign: "center",
					gap: 34,
					transform: `scale(${scale})`,
					transformOrigin: "center center",
				}}
			>
				<TipMotionBackdrop accent={tip.accent} index={tip.index} />
				<div style={{position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 34, width: "100%"}}>
				<FixedSlot height={94} width={520}>
					<Sequence durationInFrames={tipDuration} layout="none">
						<TipHeader text={`${tip.label} · ${tip.icon}`} accent={tip.accent[0]} />
					</Sequence>
				</FixedSlot>
				<FixedSlot height={238}>
					<Sequence from={14} durationInFrames={tipDuration - 14} layout="none">
						<div style={{display: "grid", justifyItems: "center", gap: 22}}>
							<div style={{fontSize: 112, lineHeight: 0.92, letterSpacing: -5.8, fontWeight: 900, maxWidth: 940}}>{tip.title}</div>
							<div style={{fontSize: 42, lineHeight: 1.1, color: "rgba(236,255,236,0.84)", fontWeight: 600, maxWidth: 900}}>{tip.subtitle}</div>
						</div>
					</Sequence>
				</FixedSlot>
				<div style={{display: "grid", justifyItems: "center", gap: 22, width: "100%"}}>
					<FixedSlot height={100}>
						<Sequence from={50} durationInFrames={tipDuration - 50} layout="none">
							<LineCard accent={tip.accent[0]} compact>
								{tip.detail}
							</LineCard>
						</Sequence>
					</FixedSlot>
					<FixedSlot height={tip.exampleBad ? 100 : 0}>
						{tip.exampleBad ? (
							<Sequence from={82} durationInFrames={tipDuration - 82} layout="none">
								<LineCard accent={tip.accent[1]} delay={0} compact>
									{tip.exampleBad}
								</LineCard>
							</Sequence>
						) : null}
					</FixedSlot>
					<FixedSlot height={tip.exampleGood ? 100 : 0}>
						{tip.exampleGood ? (
							<Sequence from={106} durationInFrames={tipDuration - 106} layout="none">
								<LineCard accent={tip.accent[0]} delay={0} compact>
									{tip.exampleGood}
								</LineCard>
							</Sequence>
						) : null}
					</FixedSlot>
				</div>
				<FixedSlot height={54}>
					<Sequence from={132} durationInFrames={tipDuration - 132} layout="none">
						<div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 28, color: "rgba(238,255,238,0.78)", fontWeight: 700, textAlign: "center"}}>
							<GlowDot accent={tip.accent[0]} size={10} />
							Aplícalo en el siguiente prompt
						</div>
					</Sequence>
				</FixedSlot>
				</div>
			</div>
		</SceneShell>
	);
};

const OutroScene: FC = () => {
	return (
		<SceneShell accent={["rgba(124,255,174,0.32)", "rgba(45,212,140,0.28)"]} disperse>
			<div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 24, height: "100%"}}>
				<Sequence durationInFrames={outroDuration} layout="none">
					<BigText maxWidth={920}>La IA es poderosa… si la usas bien</BigText>
				</Sequence>
				<Sequence from={28} durationInFrames={outroDuration - 28} layout="none">
					<div style={{fontSize: 48, fontWeight: 700, color: "rgba(240,255,240,0.86)"}}>Sígueme para más 🚀</div>
				</Sequence>
			</div>
		</SceneShell>
	);
};

export const HallucinationsComposition: FC<HallucinationsVideoProps> = ({backgroundMusicFile = null}) => {
	return (
		<AbsoluteFill style={fullScreenStyle}>
			{backgroundMusicFile ? <Audio src={staticFile(backgroundMusicFile)} volume={0.18} /> : null}

			<Sequence durationInFrames={hookDuration}>
				<HookScene />
			</Sequence>

			<Sequence from={hookDuration} durationInFrames={problemDuration}>
				<ProblemScene />
			</Sequence>

			{tips.map((tip, index) => (
				<Sequence
					key={tip.title}
					from={hookDuration + problemDuration + index * tipDuration}
					durationInFrames={tipDuration}
				>
					<TipScene tip={tip} />
				</Sequence>
			))}

			<Sequence from={hookDuration + problemDuration + tips.length * tipDuration} durationInFrames={outroDuration}>
				<OutroScene />
			</Sequence>
		</AbsoluteFill>
	);
};
