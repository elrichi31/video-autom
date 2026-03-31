import type {CSSProperties, FC, ReactNode} from "react";
import {
	AbsoluteFill,
	Audio,
	Img,
	Sequence,
	interpolate,
	random,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

type BestAiVideoProps = {
	backgroundMusicFile?: string | null;
	popSfxFile?: string | null;
	transitionSfxFile?: string | null;
};

type SceneVariant = "chatgpt" | "claude" | "midjourney" | "runway" | "notion";

type AiTool = {
	rank: string;
	name: string;
	hook: string;
	subtitle: string;
	benefits: string[];
	image: string;
	accent: [string, string];
	tags: string[];
	variant: SceneVariant;
};

const fps = 30;
const introDuration = 3 * fps;
const toolDuration = 12 * fps;
const outroDuration = 5 * fps;

export const totalDuration = introDuration + 5 * toolDuration + outroDuration;

const clamp = {
	extrapolateLeft: "clamp" as const,
	extrapolateRight: "clamp" as const,
};

const safeX = 72;
const safeTop = 84;
const safeBottom = 112;

const aiTools: AiTool[] = [
	{
		rank: "01",
		name: "ChatGPT",
		hook: "La IA que más uso",
		subtitle: "Trabajo más rápido con esto",
		benefits: ["Resuelve cosas complejas", "Genera contenido", "Ayuda a programar"],
		image: "chatgpt.png",
		accent: ["#b9ff66", "#2bbf69"],
		tags: ["Prompt", "Ideas", "Code"],
		variant: "chatgpt",
	},
	{
		rank: "02",
		name: "Claude",
		hook: "Para pensar mejor",
		subtitle: "Más contexto, mejores respuestas",
		benefits: ["Analiza textos largos", "Resume con claridad"],
		image: "claude.png",
		accent: ["#d8ff8f", "#6fda57"],
		tags: ["Long context", "Thinking", "Clarity"],
		variant: "claude",
	},
	{
		rank: "03",
		name: "Midjourney",
		hook: "Nivel visual PRO",
		subtitle: "Visuales premium en segundos",
		benefits: ["Imágenes impactantes", "Moodboards rápidos"],
		image: "midjourney.png",
		accent: ["#9eff86", "#1eb77b"],
		tags: ["Moodboards", "Concept art", "Visual dev"],
		variant: "midjourney",
	},
	{
		rank: "04",
		name: "Runway",
		hook: "Video con IA",
		subtitle: "Edición y prototipos rápidos",
		benefits: ["Clips con IA", "Efectos rápidos"],
		image: "runway.png",
		accent: ["#8dffb7", "#00b86b"],
		tags: ["Scan", "Edit", "Preview"],
		variant: "runway",
	},
	{
		rank: "05",
		name: "Notion AI",
		hook: "Organiza todo",
		subtitle: "Convierte ideas en sistema",
		benefits: ["Resume contenido", "Organiza tareas"],
		image: "notion-ai.png",
		accent: ["#e4ff9e", "#70c84e"],
		tags: ["Ideas", "Tasks", "System"],
		variant: "notion",
	},
];

const fullScreenStyle: CSSProperties = {
	backgroundColor: "#030605",
	color: "white",
	fontFamily:
		'"Inter", "Poppins", "Avenir Next", "SF Pro Display", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
	overflow: "hidden",
};

const glassPanel = (accent: string, radius = 30): CSSProperties => ({
	borderRadius: radius,
	border: `1px solid ${accent}38`,
	background:
		"linear-gradient(180deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.02) 100%), rgba(5,11,8,0.62)",
	boxShadow: `0 18px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 38px ${accent}18`,
	backdropFilter: "blur(18px)",
});

const sceneVisibility = (frame: number, durationInFrames: number) =>
	interpolate(frame, [0, 8, durationInFrames - 16, durationInFrames], [0, 1, 1, 0], clamp);

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

const floatLoop = (frame: number, offset = 0, amplitude = 12, cycle = 120) =>
	interpolate((frame + offset) % cycle, [0, cycle / 2, cycle], [0, -amplitude, 0], clamp);

const pulseLoop = (frame: number, min = 0.88, max = 1.14, cycle = 58) =>
	interpolate(frame % cycle, [0, cycle / 2, cycle], [min, max, min], clamp);

const titleSize = (name: string) => {
	if (name.length >= 10) {
		return 104;
	}

	if (name.length >= 8) {
		return 112;
	}

	return 122;
};

const ParticleField: FC<{accent: string; spread?: number; outward?: boolean}> = ({
	accent,
	spread = 80,
	outward = false,
}) => {
	const frame = useCurrentFrame();

	return (
		<>
			{Array.from({length: 22}).map((_, index) => {
				const originX = 10 + random(`px-${index}`) * 80;
				const originY = 12 + random(`py-${index}`) * 76;
				const size = 3 + random(`ps-${index}`) * 6;
				const cycle = 150 + Math.floor(random(`pc-${index}`) * 60);
				const progress = ((frame + index * 7) % cycle) / cycle;
				const horizontalDrift = (random(`pdx-${index}`) - 0.5) * spread;
				const verticalDrift = (random(`pdy-${index}`) - 0.5) * spread;
				const x = outward ? originX + horizontalDrift * progress : originX + horizontalDrift * progress * 0.38;
				const y = outward ? originY + verticalDrift * progress : originY - progress * 16 + verticalDrift * 0.12;
				const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.42, 0.32, 0], clamp);

				return (
					<div
						key={`particle-${index}`}
						style={{
							position: "absolute",
							left: `${x}%`,
							top: `${y}%`,
							width: size,
							height: size,
							borderRadius: 999,
							background: accent,
							opacity,
							boxShadow: `0 0 16px ${accent}`,
							transform: `scale(${pulseLoop(frame + index * 4, 0.8, 1.15, 70)})`,
						}}
					/>
				);
			})}
		</>
	);
};

const TechGrid: FC<{accent: string}> = ({accent}) => {
	const frame = useCurrentFrame();

	return (
		<>
			{Array.from({length: 7}).map((_, index) => (
				<div
					key={`grid-h-${index}`}
					style={{
						position: "absolute",
						left: "7%",
						right: "7%",
						top: `${14 + index * 11}%`,
						height: 1,
						opacity: interpolate((frame + index * 10) % 120, [0, 60, 120], [0.015, 0.06, 0.015], clamp),
						background: `linear-gradient(90deg, transparent 0%, ${accent} 14%, ${accent} 86%, transparent 100%)`,
					}}
				/>
			))}
			{Array.from({length: 4}).map((_, index) => (
				<div
					key={`grid-v-${index}`}
					style={{
						position: "absolute",
						top: "10%",
						bottom: "10%",
						left: `${18 + index * 21}%`,
						width: 1,
						opacity: interpolate((frame + index * 15) % 150, [0, 75, 150], [0.01, 0.04, 0.01], clamp),
						background: `linear-gradient(180deg, transparent 0%, ${accent} 20%, ${accent} 80%, transparent 100%)`,
					}}
				/>
			))}
		</>
	);
};

const TechBackdrop: FC<{
	accent: [string, string];
	scanlines?: boolean;
	outwardParticles?: boolean;
	logoWatermark?: string | null;
	logoOpacity?: number;
}> = ({accent, scanlines = false, outwardParticles = false, logoWatermark = null, logoOpacity = 0.08}) => {
	const frame = useCurrentFrame();
	const orbShift = interpolate(frame % 240, [0, 120, 240], [-60, 34, -60], clamp);
	const scale = interpolate(frame, [0, toolDuration], [1.01, 1.06], clamp);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle at top, rgba(125,255,142,0.08), transparent 30%), linear-gradient(180deg, #08100c 0%, #030605 48%, #010201 100%)",
					transform: `scale(${scale})`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: -180,
					left: -120 + orbShift,
					width: 560,
					height: 560,
					borderRadius: 999,
					background: `radial-gradient(circle, ${accent[0]} 0%, rgba(0,0,0,0) 72%)`,
					filter: "blur(30px)",
					opacity: 0.18,
				}}
			/>
			<div
				style={{
					position: "absolute",
					right: -180 - orbShift,
					bottom: -220,
					width: 620,
					height: 620,
					borderRadius: 999,
					background: `radial-gradient(circle, ${accent[1]} 0%, rgba(0,0,0,0) 72%)`,
					filter: "blur(36px)",
					opacity: 0.18,
				}}
			/>
			{logoWatermark ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						opacity: logoOpacity,
						transform: `scale(${interpolate(frame, [0, toolDuration], [1.02, 1.12], clamp)})`,
						filter: "blur(1px)",
					}}
				>
					<Img src={staticFile(logoWatermark)} style={{width: 760, height: 760, objectFit: "contain"}} />
				</div>
			) : null}
			<TechGrid accent="rgba(156,255,169,0.28)" />
			<ParticleField accent="rgba(198,255,188,0.62)" spread={outwardParticles ? 180 : 84} outward={outwardParticles} />
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 16%, transparent 84%, rgba(255,255,255,0.03) 100%)",
				}}
			/>
			{scanlines ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage:
							"repeating-linear-gradient(180deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 8px)",
						opacity: 0.12,
					}}
				/>
			) : null}
		</AbsoluteFill>
	);
};

const GlowDot: FC<{accent: string; size?: number}> = ({accent, size = 14}) => {
	const frame = useCurrentFrame();
	const pulse = pulseLoop(frame, 0.8, 1.2, 54);

	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: 999,
				background: accent,
				boxShadow: `0 0 ${26 * pulse}px ${accent}`,
				transform: `scale(${pulse})`,
			}}
		/>
	);
};

const HookChip: FC<{text: string; accent: string; align?: "left" | "center"}> = ({
	text,
	accent,
	align = "left",
}) => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue);
	const blur = interpolate(frame, [0, 14], [16, 0], clamp);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: align === "center" ? "center" : "flex-start",
				opacity: reveal,
				transform: `translateY(${interpolate(reveal, [0, 1], [26, 0], clamp)}px) scale(${interpolate(reveal, [0, 1], [0.92, 1], clamp)})`,
				filter: `blur(${blur}px)`,
			}}
		>
			<div
				style={{
					...glassPanel(accent, 999),
					padding: "14px 20px",
					display: "inline-flex",
					alignItems: "center",
					gap: 12,
					fontSize: 22,
					fontWeight: 800,
					letterSpacing: 0.2,
				}}
			>
				<GlowDot accent={accent} size={12} />
				{text}
			</div>
		</div>
	);
};

const TitleBlock: FC<{name: string; subtitle: string; align?: "left" | "center"}> = ({
	name,
	subtitle,
	align = "left",
}) => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const titleIn = springIn(frame, fpsValue);
	const subtitleIn = springIn(frame, fpsValue, 10);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: align === "center" ? "center" : "flex-start",
				textAlign: align,
				gap: 16,
			}}
		>
			<div
				style={{
					fontSize: titleSize(name),
					lineHeight: 0.92,
					letterSpacing: -4.6,
					fontWeight: 900,
					background: "linear-gradient(180deg, #ffffff 0%, rgba(223,255,222,0.88) 100%)",
					backgroundClip: "text",
					color: "transparent",
					textShadow: "0 16px 42px rgba(0,0,0,0.18)",
					opacity: titleIn,
					transform: `translateY(${interpolate(titleIn, [0, 1], [34, 0], clamp)}px)`,
				}}
			>
				{name}
			</div>
			<div
				style={{
					fontSize: 34,
					lineHeight: 1.14,
					fontWeight: 600,
					color: "rgba(237,255,236,0.8)",
					opacity: subtitleIn,
					transform: `translateY(${interpolate(subtitleIn, [0, 1], [28, 0], clamp)}px)`,
				}}
			>
				{subtitle}
			</div>
		</div>
	);
};

const BenefitCard: FC<{text: string; accent: string; compact?: boolean}> = ({text, accent, compact = false}) => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue);
	const drift = floatLoop(frame, 0, compact ? 5 : 8, compact ? 92 : 120);

	return (
		<div
			style={{
				...glassPanel(accent, compact ? 26 : 30),
				padding: compact ? "20px 22px" : "22px 24px",
				display: "flex",
				alignItems: "center",
				gap: 16,
				opacity: reveal,
				transform: `translateY(${interpolate(reveal, [0, 1], [30, drift], clamp)}px) scale(${interpolate(reveal, [0, 1], [0.94, 1], clamp)})`,
			}}
		>
			<GlowDot accent={accent} size={compact ? 12 : 14} />
			<div style={{fontSize: compact ? 28 : 32, lineHeight: 1.1, fontWeight: 700, color: "rgba(247,255,247,0.95)"}}>{text}</div>
		</div>
	);
};

const FloatingTag: FC<{text: string; accent: string}> = ({text, accent}) => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue);
	const bob = floatLoop(frame, 8, 14, 110);

	return (
		<div
			style={{
				...glassPanel(accent, 999),
				padding: "12px 18px",
				fontSize: 20,
				fontWeight: 700,
				opacity: reveal,
				transform: `translateY(${interpolate(reveal, [0, 1], [18, 0], clamp) + bob}px)`,
				whiteSpace: "nowrap",
			}}
		>
			{text}
		</div>
	);
};

const LogoStage: FC<{
	src: string;
	accent: string;
	height?: number;
	rounded?: number;
	zoomTo?: number;
	rotate?: number;
	fit?: "contain" | "cover";
}> = ({src, accent, height = 740, rounded = 38, zoomTo = 1.08, rotate = 0, fit = "contain"}) => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue, 4);
	const slowZoom = interpolate(frame, [0, toolDuration], [1, zoomTo], clamp);
	const drift = floatLoop(frame, 20, 10, 150);
	const turn = floatLoop(frame, 0, rotate, 180);

	return (
		<div style={{position: "relative", width: "100%", display: "flex", justifyContent: "center"}}>
			<div
				style={{
					position: "absolute",
					width: "88%",
					height: height - 70,
					borderRadius: rounded + 18,
					background: `radial-gradient(circle, ${accent} 0%, rgba(0,0,0,0) 70%)`,
					filter: "blur(24px)",
					opacity: 0.26,
					transform: `scale(${pulseLoop(frame, 0.92, 1.04, 90)})`,
				}}
			/>
			<div
				style={{
					...glassPanel(accent, rounded),
					width: "100%",
					height,
					padding: 26,
					display: "grid",
					placeItems: "center",
					overflow: "hidden",
					opacity: reveal,
					transform: `translateY(${interpolate(reveal, [0, 1], [38, drift], clamp)}px) scale(${interpolate(reveal, [0, 1], [0.94, 1], clamp)})`,
				}}
			>
				<Img
					src={staticFile(src)}
					style={{
						width: fit === "cover" ? "100%" : "auto",
						height: fit === "contain" ? "auto" : "100%",
						maxWidth: "94%",
						maxHeight: "94%",
						objectFit: fit,
						transform: `scale(${slowZoom}) rotate(${turn}deg)`,
					}}
				/>
				<div
					style={{
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(180deg, rgba(2,8,2,0.02) 0%, rgba(2,8,2,0.01) 44%, rgba(2,8,2,0.22) 100%)",
					}}
				/>
			</div>
		</div>
	);
};

const ContextStream: FC<{accent: string}> = ({accent}) => {
	const frame = useCurrentFrame();

	return (
		<div style={{position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none"}}>
			{Array.from({length: 6}).map((_, index) => {
				const y = 120 + index * 110 + floatLoop(frame, index * 18, 22, 160);
				const opacity = 0.08 + ((index + 1) % 3) * 0.04;

				return (
					<div
						key={`context-line-${index}`}
						style={{
							position: "absolute",
							left: `${index % 2 === 0 ? 6 : 14}%`,
							right: `${index % 2 === 0 ? 14 : 6}%`,
							top: y,
							height: 64,
							borderRadius: 20,
							background: `linear-gradient(90deg, ${accent}10 0%, rgba(255,255,255,0.05) 40%, ${accent}10 100%)`,
							opacity,
						}}
					/>
				);
			})}
		</div>
	);
};

const RunwayPreview: FC<{accent: [string, string]; image: string}> = ({accent, image}) => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue, 6);
	const scrub = interpolate(frame, [0, toolDuration], [0.12, 0.92], clamp);
	const scanline = interpolate(frame % 48, [0, 48], [0, 100], clamp);

	return (
		<div
			style={{
				...glassPanel(accent[1], 40),
				padding: 18,
				height: 760,
				position: "relative",
				overflow: "hidden",
				opacity: reveal,
				transform: `translateY(${interpolate(reveal, [0, 1], [40, 0], clamp)}px) scale(${interpolate(reveal, [0, 1], [0.94, 1], clamp)})`,
			}}
		>
			<div style={{position: "relative", width: "100%", height: "100%", borderRadius: 28, overflow: "hidden"}}>
				<Img
					src={staticFile(image)}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						filter: "brightness(0.75) saturate(1.08)",
						transform: `scale(${interpolate(frame, [0, toolDuration], [1.02, 1.1], clamp)})`,
					}}
				/>
				<div
					style={{
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.02) 28%, rgba(0,0,0,0.5) 100%)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						top: `${scanline}%`,
						height: 3,
						background: `linear-gradient(90deg, transparent 0%, ${accent[0]} 30%, white 50%, ${accent[1]} 70%, transparent 100%)`,
						opacity: 0.55,
						boxShadow: `0 0 24px ${accent[0]}`,
					}}
				/>
				{Array.from({length: 5}).map((_, index) => (
					<div
						key={`glitch-${index}`}
						style={{
							position: "absolute",
							left: `${6 + index * 6}%`,
							right: `${20 - index * 2}%`,
							top: `${12 + index * 16 + floatLoop(frame, index * 12, 8, 90)}%`,
							height: 2,
							background: index % 2 === 0 ? accent[0] : accent[1],
							opacity: 0.14,
						}}
					/>
				))}
				<div
					style={{
						position: "absolute",
						left: 18,
						right: 18,
						bottom: 18,
						display: "grid",
						gap: 12,
					}}
				>
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
						<div style={{fontSize: 18, letterSpacing: 2.8, textTransform: "uppercase", color: "rgba(240,255,240,0.62)", fontWeight: 700}}>
							AI Edit Preview
						</div>
						<div style={{display: "inline-flex", alignItems: "center", gap: 8, color: "white", fontWeight: 700}}>
							<GlowDot accent={accent[0]} size={10} /> Render
						</div>
					</div>
					<div style={{...glassPanel(accent[0], 999), padding: "10px 14px", height: 18, position: "relative"}}>
						<div
							style={{
								position: "absolute",
								left: 12,
								right: 12,
								top: "50%",
								height: 4,
								borderRadius: 999,
								transform: "translateY(-50%)",
								background: "rgba(255,255,255,0.08)",
							}}
						/>
						<div
							style={{
								position: "absolute",
								left: 12,
								top: "50%",
								height: 4,
								borderRadius: 999,
								transform: "translateY(-50%)",
								width: `${scrub * 100 - 12}%`,
								background: `linear-gradient(90deg, ${accent[0]}, ${accent[1]})`,
								boxShadow: `0 0 18px ${accent[0]}`,
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

const NotionBoard: FC<{accent: [string, string]}> = ({accent}) => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue);
	const organize = interpolate(frame, [0, 90], [0, 1], clamp);

	const items = [
		{text: "Ideas del video", from: {x: 0, y: 20}, to: {x: 0, y: 0}},
		{text: "Resumen del contenido", from: {x: 120, y: 170}, to: {x: 0, y: 132}},
		{text: "Tareas de publicación", from: {x: 42, y: 330}, to: {x: 0, y: 264}},
	];

	return (
		<div
			style={{
				...glassPanel(accent[1], 34),
				padding: 24,
				height: 760,
				position: "relative",
				opacity: reveal,
				transform: `translateY(${interpolate(reveal, [0, 1], [38, 0], clamp)}px)`,
			}}
		>
			<div style={{position: "absolute", inset: 24}}>
				{items.map((item, index) => {
					const x = interpolate(organize, [0, 1], [item.from.x, item.to.x], clamp);
					const y = interpolate(organize, [0, 1], [item.from.y, item.to.y], clamp);
					const width = interpolate(organize, [0, 1], [420 - index * 36, 100], clamp);
					const bg = index === 0 ? accent[0] : "rgba(255,255,255,0.06)";

					return (
						<div
							key={item.text}
							style={{
								position: "absolute",
								left: x,
								top: y,
								width: `calc(100% - ${width}px)`,
								padding: "18px 20px",
								borderRadius: 24,
								background: bg,
								border: `1px solid ${index === 0 ? `${accent[0]}4f` : "rgba(255,255,255,0.08)"}`,
								boxShadow: index === 0 ? `0 0 24px ${accent[0]}24` : "none",
								color: index === 0 ? "#021205" : "white",
								fontSize: 24,
								fontWeight: 700,
							}}
						>
							<div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16}}>
								<div>{item.text}</div>
								{organize > 0.58 ? <GlowDot accent={accent[index === 0 ? 1 : 0]} size={10} /> : null}
							</div>
						</div>
					);
				})}
				<div
					style={{
						position: "absolute",
						right: 0,
						top: 0,
						width: 232,
						height: "100%",
						...glassPanel(accent[0], 28),
						padding: 22,
						opacity: interpolate(organize, [0.28, 1], [0, 1], clamp),
						transform: `translateX(${interpolate(organize, [0.28, 1], [24, 0], clamp)}px)`,
					}}
				>
					<div style={{fontSize: 18, letterSpacing: 2.4, textTransform: "uppercase", color: "rgba(240,255,240,0.6)", fontWeight: 700}}>
						Sistema
					</div>
					<div style={{marginTop: 22, display: "grid", gap: 14}}>
						{["Resumen listo", "Checklist clara", "Próximo paso"].map((item) => (
							<div key={item} style={{display: "flex", gap: 12, alignItems: "center", fontSize: 22, fontWeight: 700}}>
								<GlowDot accent={accent[0]} size={10} />
								{item}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const SceneFrame: FC<{
	tool: AiTool;
	children: ReactNode;
	scanlines?: boolean;
	logoWatermark?: string | null;
	logoOpacity?: number;
}> = ({tool, children, scanlines = false, logoWatermark = null, logoOpacity = 0.08}) => {
	const frame = useCurrentFrame();
	const visibility = sceneVisibility(frame, toolDuration);
	const stageScale = interpolate(frame, [0, toolDuration], [1, 1.02], clamp);
	const sweep = interpolate(frame, [6 * fps, 8 * fps], [0, 1], clamp);

	return (
		<AbsoluteFill style={{opacity: visibility, transform: `scale(${stageScale})`}}>
			<TechBackdrop accent={tool.accent} scanlines={scanlines} logoWatermark={logoWatermark} logoOpacity={logoOpacity} />
			<AbsoluteFill style={fullScreenStyle}>
				<div
					style={{
						position: "absolute",
						left: safeX,
						top: safeTop,
						fontSize: 18,
						letterSpacing: 3.4,
						textTransform: "uppercase",
						fontWeight: 700,
						color: "rgba(228,255,228,0.56)",
					}}
				>
					2026 AI STACK
				</div>
				<div
					style={{
						position: "absolute",
						right: safeX,
						top: safeTop - 4,
						fontSize: 92,
						fontWeight: 900,
						lineHeight: 1,
						letterSpacing: -5,
						color: "rgba(255,255,255,0.11)",
					}}
				>
					{tool.rank}
				</div>
				<div style={{position: "absolute", left: safeX, right: safeX, top: 186, bottom: safeBottom}}>{children}</div>
				<div
					style={{
						position: "absolute",
						left: `${-20 + sweep * 100}%`,
						top: 0,
						bottom: 0,
						width: 220,
						background: `linear-gradient(90deg, transparent 0%, ${tool.accent[0]}12 45%, ${tool.accent[1]}22 50%, transparent 100%)`,
						filter: "blur(12px)",
						opacity: 0.85,
						pointerEvents: "none",
					}}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const IntroScene: FC = () => {
	const frame = useCurrentFrame();
	const visibility = sceneVisibility(frame, introDuration);
	const globalZoom = interpolate(frame, [0, introDuration], [1.08, 1], clamp);

	return (
		<AbsoluteFill style={{opacity: visibility, transform: `scale(${globalZoom})`}}>
			<TechBackdrop accent={["rgba(145,255,114,0.24)", "rgba(49,196,102,0.32)"]} />
			<AbsoluteFill style={{...fullScreenStyle, padding: `${safeTop}px ${safeX}px ${safeBottom}px`, justifyContent: "center"}}>
				<div style={{display: "flex", flexDirection: "column", gap: 28, maxWidth: 900}}>
					<Sequence durationInFrames={introDuration} layout="none">
						<div style={{position: "relative"}}>
							<HookChip text="Estas son las IAs que uso TODOS los días" accent="#b9ff66" />
						</div>
					</Sequence>
					<Sequence from={24} durationInFrames={introDuration - 24} layout="none">
						<div style={{position: "relative"}}>
							<IntroHeadline />
						</div>
					</Sequence>
					<Sequence from={44} durationInFrames={introDuration - 44} layout="none">
						<div
							style={{
								...glassPanel("#b9ff66", 30),
								padding: "20px 24px",
								fontSize: 26,
								fontWeight: 700,
								maxWidth: 640,
								color: "rgba(235,255,235,0.88)",
							}}
						>
							Las 5 mejores IAs que uso en 2026 🚀
						</div>
					</Sequence>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const IntroHeadline: FC = () => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue);
	const blur = interpolate(frame, [0, 16], [24, 0], clamp);

	return (
		<div
			style={{
				opacity: reveal,
				transform: `translateY(${interpolate(reveal, [0, 1], [44, 0], clamp)}px) scale(${interpolate(reveal, [0, 1], [0.94, 1], clamp)})`,
				filter: `blur(${blur}px)`,
			}}
		>
			<div style={{fontSize: 118, lineHeight: 0.92, fontWeight: 900, letterSpacing: -5.6, maxWidth: 940}}>Si no usas esto, vas tarde 🚀</div>
		</div>
	);
};

const ChatGPTScene: FC<{tool: AiTool}> = ({tool}) => {
	return (
		<SceneFrame tool={tool}>
			<div style={{display: "grid", gridTemplateColumns: "1.02fr 0.98fr", gap: 26, height: "100%"}}>
				<div style={{display: "grid", gridTemplateRows: "auto auto 1fr", gap: 22}}>
					<Sequence durationInFrames={fps} layout="none">
						<HookChip text={tool.hook} accent={tool.accent[0]} />
					</Sequence>
					<Sequence from={fps} durationInFrames={toolDuration - fps} layout="none">
						<TitleBlock name={tool.name} subtitle={tool.subtitle} />
					</Sequence>
					<div style={{display: "grid", alignContent: "end", gap: 16}}>
						{tool.benefits.map((benefit, index) => (
							<Sequence
								key={benefit}
								from={3 * fps + index * 24}
								durationInFrames={toolDuration - (3 * fps + index * 24)}
								layout="none"
							>
								<BenefitCard text={benefit} accent={index === 1 ? tool.accent[1] : tool.accent[0]} compact />
							</Sequence>
						))}
						<Sequence from={6 * fps + 10} durationInFrames={toolDuration - (6 * fps + 10)} layout="none">
							<div style={{display: "flex", alignItems: "center", gap: 14, color: "rgba(238,255,238,0.7)", fontSize: 24, fontWeight: 700}}>
								<GlowDot accent={tool.accent[0]} size={10} /> Prompt → respuesta → acción
							</div>
						</Sequence>
					</div>
				</div>
				<div style={{position: "relative"}}>
					<Sequence from={fps} durationInFrames={toolDuration - fps} layout="none">
						<LogoStage src={tool.image} accent={tool.accent[0]} height={760} zoomTo={1.1} />
					</Sequence>
					<div style={{position: "absolute", left: 22, top: 66}}>
						<Sequence from={3 * fps} durationInFrames={toolDuration - 3 * fps} layout="none">
							<FloatingTag text={tool.tags[0]} accent={tool.accent[0]} />
						</Sequence>
					</div>
					<div style={{position: "absolute", right: 18, top: 220}}>
						<Sequence from={3 * fps + 20} durationInFrames={toolDuration - (3 * fps + 20)} layout="none">
							<FloatingTag text={tool.tags[1]} accent={tool.accent[1]} />
						</Sequence>
					</div>
					<div style={{position: "absolute", left: 170, bottom: 72}}>
						<Sequence from={4 * fps + 8} durationInFrames={toolDuration - (4 * fps + 8)} layout="none">
							<FloatingTag text={tool.tags[2]} accent={tool.accent[0]} />
						</Sequence>
					</div>
				</div>
			</div>
		</SceneFrame>
	);
};

const ClaudeScene: FC<{tool: AiTool}> = ({tool}) => {
	return (
		<SceneFrame tool={tool} logoWatermark={tool.image} logoOpacity={0.05}>
			<ContextStream accent={tool.accent[0]} />
			<div style={{display: "grid", gridTemplateRows: "auto auto 1fr auto", gap: 18, height: "100%", justifyItems: "center"}}>
				<Sequence durationInFrames={fps} layout="none">
					<HookChip text={tool.hook} accent={tool.accent[0]} align="center" />
				</Sequence>
				<Sequence from={fps} durationInFrames={toolDuration - fps} layout="none">
					<TitleBlock name={tool.name} subtitle={tool.subtitle} align="center" />
				</Sequence>
				<div style={{width: 460}}>
					<Sequence from={fps + 12} durationInFrames={toolDuration - (fps + 12)} layout="none">
						<LogoStage src={tool.image} accent={tool.accent[1]} height={640} rounded={42} zoomTo={1.06} rotate={1.4} />
					</Sequence>
				</div>
				<div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%"}}>
					{tool.benefits.map((benefit, index) => (
						<Sequence
							key={benefit}
							from={3 * fps + index * 30}
							durationInFrames={toolDuration - (3 * fps + index * 30)}
							layout="none"
						>
							<BenefitCard text={benefit} accent={index === 0 ? tool.accent[0] : tool.accent[1]} compact />
						</Sequence>
					))}
				</div>
			</div>
		</SceneFrame>
	);
};

const MidjourneyScene: FC<{tool: AiTool}> = ({tool}) => {
	return (
		<SceneFrame tool={tool} logoWatermark={tool.image} logoOpacity={0.09}>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(90deg, rgba(2,4,2,0.86) 0%, rgba(2,4,2,0.4) 42%, rgba(2,4,2,0.72) 100%), linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.42) 100%)",
				}}
			/>
			<div style={{position: "relative", display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: 28, height: "100%"}}>
				<div style={{display: "grid", alignContent: "space-between"}}>
					<div style={{display: "grid", gap: 20}}>
						<Sequence durationInFrames={fps} layout="none">
							<HookChip text={tool.hook} accent={tool.accent[0]} />
						</Sequence>
						<Sequence from={fps} durationInFrames={toolDuration - fps} layout="none">
							<TitleBlock name={tool.name} subtitle={tool.subtitle} />
						</Sequence>
					</div>
					<div style={{display: "grid", gap: 16, maxWidth: 430}}>
						{tool.benefits.map((benefit, index) => (
							<Sequence
								key={benefit}
								from={3 * fps + index * 28}
								durationInFrames={toolDuration - (3 * fps + index * 28)}
								layout="none"
							>
								<BenefitCard text={benefit} accent={index === 0 ? tool.accent[0] : tool.accent[1]} compact />
							</Sequence>
						))}
					</div>
				</div>
				<div style={{position: "relative"}}>
					<div style={{position: "absolute", right: 0, top: 80}}>
						<Sequence from={3 * fps} durationInFrames={toolDuration - 3 * fps} layout="none">
							<FloatingTag text={tool.tags[0]} accent={tool.accent[0]} />
						</Sequence>
					</div>
					<div style={{position: "absolute", right: 50, top: 240}}>
						<Sequence from={3 * fps + 18} durationInFrames={toolDuration - (3 * fps + 18)} layout="none">
							<FloatingTag text={tool.tags[1]} accent={tool.accent[1]} />
						</Sequence>
					</div>
					<div style={{position: "absolute", right: 18, top: 400}}>
						<Sequence from={4 * fps} durationInFrames={toolDuration - 4 * fps} layout="none">
							<FloatingTag text={tool.tags[2]} accent={tool.accent[0]} />
						</Sequence>
					</div>
				</div>
			</div>
		</SceneFrame>
	);
};

const RunwayScene: FC<{tool: AiTool}> = ({tool}) => {
	return (
		<SceneFrame tool={tool} scanlines>
			<div style={{display: "grid", gridTemplateRows: "auto auto 1fr auto", gap: 18, height: "100%"}}>
				<Sequence durationInFrames={fps} layout="none">
					<HookChip text={tool.hook} accent={tool.accent[0]} />
				</Sequence>
				<Sequence from={fps} durationInFrames={toolDuration - fps} layout="none">
					<TitleBlock name={tool.name} subtitle={tool.subtitle} />
				</Sequence>
				<Sequence from={fps + 14} durationInFrames={toolDuration - (fps + 14)} layout="none">
					<RunwayPreview accent={tool.accent} image={tool.image} />
				</Sequence>
				<div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18}}>
					{tool.benefits.map((benefit, index) => (
						<Sequence
							key={benefit}
							from={3 * fps + index * 28}
							durationInFrames={toolDuration - (3 * fps + index * 28)}
							layout="none"
						>
							<BenefitCard text={benefit} accent={index === 0 ? tool.accent[0] : tool.accent[1]} compact />
						</Sequence>
					))}
				</div>
			</div>
		</SceneFrame>
	);
};

const NotionScene: FC<{tool: AiTool}> = ({tool}) => {
	return (
		<SceneFrame tool={tool} logoWatermark={tool.image} logoOpacity={0.045}>
			<div style={{display: "grid", gridTemplateRows: "auto auto 1fr auto", gap: 18, height: "100%"}}>
				<Sequence durationInFrames={fps} layout="none">
					<HookChip text={tool.hook} accent={tool.accent[0]} />
				</Sequence>
				<Sequence from={fps} durationInFrames={toolDuration - fps} layout="none">
					<TitleBlock name={tool.name} subtitle={tool.subtitle} />
				</Sequence>
				<Sequence from={3 * fps} durationInFrames={toolDuration - 3 * fps} layout="none">
					<NotionBoard accent={tool.accent} />
				</Sequence>
				<div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
					{tool.benefits.map((benefit, index) => (
						<Sequence
							key={benefit}
							from={4 * fps + index * 26}
							durationInFrames={toolDuration - (4 * fps + index * 26)}
							layout="none"
						>
							<BenefitCard text={benefit} accent={index === 0 ? tool.accent[0] : tool.accent[1]} compact />
						</Sequence>
					))}
				</div>
			</div>
		</SceneFrame>
	);
};

const ToolScene: FC<{tool: AiTool}> = ({tool}) => {
	if (tool.variant === "chatgpt") {
		return <ChatGPTScene tool={tool} />;
	}

	if (tool.variant === "claude") {
		return <ClaudeScene tool={tool} />;
	}

	if (tool.variant === "midjourney") {
		return <MidjourneyScene tool={tool} />;
	}

	if (tool.variant === "runway") {
		return <RunwayScene tool={tool} />;
	}

	return <NotionScene tool={tool} />;
};

const OutroScene: FC = () => {
	const frame = useCurrentFrame();
	const visibility = sceneVisibility(frame, outroDuration);
	const zoomOut = interpolate(frame, [0, outroDuration], [1, 0.94], clamp);

	return (
		<AbsoluteFill style={{opacity: visibility, transform: `scale(${zoomOut})`}}>
			<TechBackdrop accent={["rgba(163,255,117,0.22)", "rgba(35,160,77,0.3)"]} outwardParticles />
			<AbsoluteFill style={{...fullScreenStyle, padding: `${safeTop}px ${safeX}px ${safeBottom}px`, justifyContent: "center", alignItems: "center", textAlign: "center"}}>
				<div style={{display: "grid", gap: 22, maxWidth: 820}}>
					<Sequence durationInFrames={outroDuration} layout="none">
						<OutroQuestion />
					</Sequence>
					<Sequence from={18} durationInFrames={outroDuration - 18} layout="none">
						<div style={{fontSize: 36, lineHeight: 1.18, color: "rgba(240,255,240,0.8)", fontWeight: 600}}>Sígueme para más 🚀</div>
					</Sequence>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const OutroQuestion: FC = () => {
	const frame = useCurrentFrame();
	const {fps: fpsValue} = useVideoConfig();
	const reveal = springIn(frame, fpsValue);

	return (
		<div
			style={{
				opacity: reveal,
				transform: `translateY(${interpolate(reveal, [0, 1], [36, 0], clamp)}px)`,
			}}
		>
			<div style={{fontSize: 24, letterSpacing: 3.6, textTransform: "uppercase", color: "rgba(240,255,240,0.58)", fontWeight: 700}}>Tu turno</div>
			<div style={{fontSize: 108, lineHeight: 0.94, fontWeight: 900, letterSpacing: -5.4, marginTop: 14}}>¿Cuál usas tú?</div>
		</div>
	);
};

export const MyComposition: FC<BestAiVideoProps> = ({
	backgroundMusicFile = null,
	popSfxFile = null,
	transitionSfxFile = null,
}) => {
	return (
		<AbsoluteFill style={fullScreenStyle}>
			{backgroundMusicFile ? <Audio src={staticFile(backgroundMusicFile)} volume={0.18} /> : null}

			{transitionSfxFile
				? [
					introDuration,
					introDuration + toolDuration,
					introDuration + toolDuration * 2,
					introDuration + toolDuration * 3,
					introDuration + toolDuration * 4,
					introDuration + toolDuration * 5,
				].map((from, index) => (
					<Sequence key={`transition-sfx-${index}`} from={from} durationInFrames={20}>
						<Audio src={staticFile(transitionSfxFile)} volume={0.42} />
					</Sequence>
				))
				: null}

			{popSfxFile
				? aiTools.flatMap((tool, sceneIndex) =>
					tool.benefits.map((benefit, benefitIndex) => ({
						key: `${tool.name}-${benefit}`,
						from: introDuration + sceneIndex * toolDuration + 3 * fps + benefitIndex * 26,
					})),
				).map((item) => (
					<Sequence key={item.key} from={item.from} durationInFrames={16}>
						<Audio src={staticFile(popSfxFile)} volume={0.34} />
					</Sequence>
				))
				: null}

			<Sequence durationInFrames={introDuration}>
				<IntroScene />
			</Sequence>

			{aiTools.map((tool, index) => (
				<Sequence
					key={tool.name}
					from={introDuration + index * toolDuration}
					durationInFrames={toolDuration}
				>
					<ToolScene tool={tool} />
				</Sequence>
			))}

			<Sequence from={introDuration + aiTools.length * toolDuration} durationInFrames={outroDuration}>
				<OutroScene />
			</Sequence>
		</AbsoluteFill>
	);
};
