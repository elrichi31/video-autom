"use client";

import { useState } from "react";
import type { AnyVideoScript, GeneratedImage } from "@/lib/types";
import { getSceneKeys, getSceneLabels } from "@/lib/types";
import { VideoList } from "@/components/VideoList";
import { VideoEditor } from "@/components/VideoEditor";
import { VoiceoverPanel } from "@/components/VoiceoverPanel";

// ─── NAV ─────────────────────────────────────────────────────────────────────

type View =
  | { name: "home" }
  | { name: "wizard"; step: 1 | 2 | 3 | 4 | 5 }
  | { name: "videos" }
  | { name: "editor"; slug: string; compositionId: string };

function Nav({
  view,
  onNav,
}: {
  view: View;
  onNav: (v: View) => void;
}) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <button
        onClick={() => onNav({ name: "home" })}
        className="flex items-center gap-2.5 hover:opacity-80 transition"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-sm font-bold">
          V
        </div>
        <div>
          <h1 className="text-sm font-bold leading-none">Video Generator</h1>
          <p className="text-[#444] text-[10px] mono">Remotion + OpenAI</p>
        </div>
      </button>

      <div className="flex items-center gap-1">
        <NavBtn
          label="+ Nuevo video"
          active={view.name === "wizard"}
          onClick={() => onNav({ name: "wizard", step: 1 })}
          highlight
        />
        <NavBtn
          label="Mis videos"
          active={view.name === "videos" || view.name === "editor"}
          onClick={() => onNav({ name: "videos" })}
        />
      </div>
    </header>
  );
}

function NavBtn({
  label, active, onClick, highlight,
}: {
  label: string; active: boolean; onClick: () => void; highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition
        ${active
          ? "bg-white/10 text-white"
          : highlight
            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
            : "text-[#666] hover:text-white hover:bg-white/5"
        }`}
    >
      {label}
    </button>
  );
}

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = ["Tema", "Guión", "Imágenes", "Voz", "Guardar"];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = current > n;
        const active = current === n;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${done   ? "bg-emerald-500 text-black"  : ""}
              ${active ? "bg-emerald-500 text-white"   : ""}
              ${!done && !active ? "bg-[#2a2a2a] text-[#666]" : ""}`}>
              {done ? "✓" : n}
            </div>
            <span className={`text-sm ${active ? "text-white font-semibold" : "text-[#666]"}`}>{label}</span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-[#2a2a2a] mx-1" />}
          </div>
        );
      })}
    </div>
  );
}

// ─── WIZARD STEP 1 ───────────────────────────────────────────────────────────

const DURATION_PRESETS = [30, 45, 60, 90];

function TopicForm({
  initialTopic,
  onScript,
}: {
  initialTopic?: string;
  onScript: (s: AnyVideoScript) => void;
}) {
  const [topic, setTopic] = useState(initialTopic ?? "");
  const [targetDuration, setTargetDuration] = useState(45);
  const [compositionType, setCompositionType] = useState<"standard" | "timeline">("standard");
  const [context, setContext] = useState("");
  const [contextFileName, setContextFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContext(text);
    setContextFileName(file.name);
    e.target.value = ""; // allow re-selecting the same file
  }

  function clearContext() {
    setContext("");
    setContextFileName("");
  }

  const SUGGESTIONS = [
    "Ransomware", "Ingeniería social", "Inteligencia artificial en 2025",
    "Quantum computing", "Deepfakes", "Criptomonedas y fraudes",
    "Vulnerabilidades en móviles", "Espionaje corporativo",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, targetDurationSeconds: targetDuration, compositionType, context: context.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      onScript(data.script);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-2">¿Sobre qué es el video?</h2>
      <p className="text-[#888] mb-6 text-sm">
        GPT-4o generará el guión completo con estructura de 7 escenas lista para Remotion.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ej: Ransomware, Deepfakes, Dark Web..."
          className="w-full bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white
                     placeholder-[#555] focus:outline-none focus:border-emerald-500 transition text-base"
        />
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => setTopic(s)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a]
                         text-[#888] hover:text-white hover:border-[#444] transition">
              {s}
            </button>
          ))}
        </div>

        {/* Context (.md / .txt upload or paste) */}
        <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-[#666] uppercase tracking-wider">
              Contexto del video <span className="text-[#444] normal-case font-normal">(opcional)</span>
            </p>
            <label className="text-xs px-2.5 py-1 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a]
                              text-[#888] hover:text-white hover:border-[#444] transition cursor-pointer">
              Subir .md / .txt
              <input type="file" accept=".md,.txt,text/markdown,text/plain"
                onChange={handleFile} className="hidden" />
            </label>
          </div>
          <textarea
            value={context}
            onChange={(e) => { setContext(e.target.value); if (contextFileName) setContextFileName(""); }}
            placeholder="Pega aquí info actualizada (datos, cifras, fechas, fuentes). GPT la usará como fuente de verdad para el guión."
            rows={4}
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white
                       placeholder-[#555] focus:outline-none focus:border-emerald-500 transition resize-y mono"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-[#444]">
              {contextFileName
                ? <span className="text-emerald-400">📄 {contextFileName}</span>
                : "El tema sigue siendo obligatorio · el contexto enriquece los datos"}
              {context.trim() && ` · ${context.trim().length.toLocaleString()} caracteres`}
            </p>
            {context.trim() && (
              <button type="button" onClick={clearContext}
                className="text-[10px] text-[#666] hover:text-red-400 transition">
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Duration selector */}
        <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-[#666] uppercase tracking-wider">Duración del video</p>
            <span className="text-emerald-400 font-mono text-xs font-bold">{targetDuration}s</span>
          </div>
          <div className="flex gap-2">
            {DURATION_PRESETS.map((secs) => (
              <button
                key={secs}
                type="button"
                onClick={() => setTargetDuration(secs)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition
                  ${targetDuration === secs
                    ? "bg-emerald-600 text-white"
                    : "bg-[#1e1e1e] border border-[#2a2a2a] text-[#666] hover:text-white hover:border-[#444]"}`}
              >
                {secs}s
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#444] mt-2">
            Las escenas se escalan proporcionalmente · variación natural de ±2s
          </p>
        </div>

        {/* Composition type selector */}
        <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-3">
          <p className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Tipo de composición</p>
          <div className="flex gap-2">
            {(["standard", "timeline"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setCompositionType(type)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition text-left px-3
                  ${compositionType === type
                    ? "bg-emerald-600 text-white"
                    : "bg-[#1e1e1e] border border-[#2a2a2a] text-[#666] hover:text-white hover:border-[#444]"}`}
              >
                <span className="block text-sm">{type === "standard" ? "Estándar" : "Timeline"}</span>
                <span className="block text-[10px] opacity-70 mt-0.5">
                  {type === "standard" ? "7 escenas temáticas" : "Cronología de eventos"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">{error}</p>
        )}
        <button type="submit" disabled={loading || !topic.trim()}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500
                     disabled:opacity-40 disabled:cursor-not-allowed transition">
          {loading ? "Generando guión con GPT-4o..." : "Generar guión →"}
        </button>
      </form>
    </div>
  );
}

// ─── WIZARD STEP 2 ───────────────────────────────────────────────────────────

function ScriptPreview({ script, onContinue }: { script: AnyVideoScript; onContinue: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const sceneLabels = getSceneLabels(script);
  const sceneEntries = Object.entries(script.scenes);
  const accents = script.accents as Record<string, [string, string]>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{script.displayTitle}</h2>
          <p className="text-[#666] text-sm mono mt-1">{script.slug}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2.5 py-1 rounded-full border border-emerald-700/40 bg-emerald-900/10 text-[11px] font-semibold text-emerald-300">
              niche: {script.niche}
            </span>
            <span className="px-2.5 py-1 rounded-full border border-emerald-700/40 bg-emerald-900/10 text-[11px] font-semibold text-emerald-300">
              hook: {script.hookStyle}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {Object.keys(accents).map((k) => (
            <div key={k} className="w-4 h-4 rounded-full" style={{ background: accents[k][0] }} title={k} />
          ))}
        </div>
      </div>
      <div className="space-y-2 mb-6">
        {sceneEntries.map(([key, scene]) => (
          <div key={key}
            className="border rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition"
            style={{ borderColor: (accents[key]?.[0] ?? "#444") + "55", background: (accents[key]?.[0] ?? "#444") + "0d" }}
            onClick={() => setExpanded(expanded === key ? null : key)}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: accents[key]?.[0] ?? "#444" }} />
                <span className="text-sm font-semibold">{sceneLabels[key] ?? key}</span>
                {"title" in (scene as Record<string, unknown>)
                  ? <span className="text-[#666] text-xs mono ml-2 truncate max-w-[200px]">
                      {String((scene as Record<string, unknown>).title).replace(/\\n/g, " · ")}
                    </span>
                  : null}
              </div>
              <span className="text-[#444] text-xs">{expanded === key ? "▲" : "▼"}</span>
            </div>
            {expanded === key && (
              <pre className="px-4 pb-3 text-xs text-[#aaa] mono overflow-auto max-h-60 whitespace-pre-wrap">
                {JSON.stringify(scene, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
      <button onClick={onContinue}
        className="w-full py-3 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 transition">
        Generar imágenes con gpt-image-1 →
      </button>
    </div>
  );
}

// ─── WIZARD STEP 3 ───────────────────────────────────────────────────────────

function ImageGallery({
  script, images, onImages, onContinue,
}: {
  script: AnyVideoScript; images: GeneratedImage[];
  onImages: (imgs: GeneratedImage[]) => void; onContinue: () => void;
}) {
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [errors, setErrors]         = useState<string[]>([]);

  const sceneKeys   = getSceneKeys(script);
  const sceneLabels = getSceneLabels(script);

  function getImage(key: string) { return images.find((i) => i.sceneKey === key); }

  async function generate(sceneKey?: string) {
    if (sceneKey) setLoadingKey(sceneKey); else setLoadingAll(true);
    setErrors([]);
    try {
      const res = await fetch("/api/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, sceneKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Error generando imágenes");
      if (data.errors?.length) setErrors(data.errors.map((e: { error: string }) => e.error));
      const newImgs = data.results as GeneratedImage[];
      onImages([
        ...images.filter((img) => !newImgs.some((n) => n.sceneKey === img.sceneKey)),
        ...newImgs,
      ]);
    } catch (err) {
      setErrors([String(err)]);
    } finally {
      setLoadingAll(false);
      setLoadingKey(null);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Imágenes por escena</h2>
          <p className="text-[#666] text-sm mt-1">
            {images.length}/{sceneKeys.length} generadas · gpt-image-1 · 1024×1536
          </p>
        </div>
        <button onClick={() => generate()} disabled={loadingAll}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500
                     disabled:opacity-40 transition">
          {loadingAll ? "Generando todas..." : "Generar todas"}
        </button>
      </div>
      {errors.length > 0 && (
        <div className="mb-4 space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-red-400 text-xs bg-red-900/20 px-3 py-2 rounded-lg border border-red-800/30">{e}</p>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {sceneKeys.map((key) => {
          const img = getImage(key);
          const isLoading = loadingKey === key || (loadingAll && !img);
          return (
            <div key={key} className="relative rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#161616]"
              style={{ aspectRatio: "9/16" }}>
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`data:image/png;base64,${img.b64}`} alt={sceneLabels[key] ?? key}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  {isLoading
                    ? <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    : <div className="text-[#333] text-2xl">+</div>}
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-white text-xs font-semibold">{sceneLabels[key] ?? key}</p>
              </div>
              {img && (
                <button onClick={() => generate(key)} disabled={loadingKey === key}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 text-xs
                             flex items-center justify-center hover:bg-black/80 transition" title="Regenerar">
                  ↺
                </button>
              )}
              {!img && !isLoading && (
                <button onClick={() => generate(key)}
                  className="absolute inset-0 flex items-center justify-center text-[#555]
                             hover:text-emerald-400 transition text-xs font-semibold">
                  Generar
                </button>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={onContinue}
        className="w-full py-3 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 transition">
        {images.length === 0
          ? "Saltar imágenes por ahora →"
          : images.length < sceneKeys.length
            ? `Continuar con ${images.length}/${sceneKeys.length} imágenes →`
            : "Continuar a voz en off →"}
      </button>
      {images.length < sceneKeys.length && (
        <p className="text-[#555] text-xs mt-2 text-center">
          Las imágenes que falten se generan después desde el editor, sin perder el guión ni la voz.
        </p>
      )}
    </div>
  );
}

// ─── WIZARD STEP 4 ───────────────────────────────────────────────────────────

function VoiceoverStep({
  script,
  onContinue,
  onBack,
}: {
  script: AnyVideoScript;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Voz en off del video</h2>
        <p className="text-[#666] text-sm">
          Genera la narracion dentro del mismo flujo. Es opcional, pero si la creas aqui el preview y el render la podran usar.
        </p>
      </div>

      <VoiceoverPanel script={script} slug={script.slug} />

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-sm border border-[#2a2a2a]
                     text-[#888] hover:text-white hover:border-[#444] transition"
        >
          Volver a imagenes
        </button>
        <button
          onClick={onContinue}
          className="flex-1 py-3 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 transition"
        >
          Continuar a guardar {"->"}
        </button>
      </div>
    </div>
  );
}

function SavePanel({
  script, images, onReset, onGoToVideos,
}: {
  script: AnyVideoScript; images: GeneratedImage[];
  onReset: () => void; onGoToVideos: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState<string[]>([]);
  const [error,   setError]   = useState("");

  async function handleSave() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/save-output", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, images }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error guardando");
      setSaved(data.saved);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-2">Guardar en el proyecto</h2>
      <p className="text-[#666] text-sm mb-6">
        Escribe el <span className="mono text-[#aaa]">data.ts</span>, la composición y registra en <span className="mono text-[#aaa]">Root.tsx</span>.
        Si ya generaste voz, el render del sitio la detectará automáticamente desde <span className="mono text-[#aaa]">public/{script.slug}/</span>.
      </p>

      {saved.length > 0 ? (
        <div className="space-y-4">
          <div className="border border-emerald-800/40 bg-emerald-900/10 rounded-xl p-4">
            <p className="text-emerald-400 font-semibold mb-3">Archivos guardados</p>
            <ul className="space-y-1">
              {saved.map((f) => (
                <li key={f} className="text-sm mono text-[#aaa] flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-emerald-800/30 bg-emerald-900/10 rounded-xl p-4">
            <p className="text-emerald-300 text-sm font-semibold mb-2">Todo listo en Remotion</p>
            <p className="text-[#888] text-sm">
              La composición y el registro en <span className="mono text-[#aaa]">Root.tsx</span> se generaron automáticamente.
              Abre el Remotion Studio para previsualizar el video.
            </p>
            <pre className="mt-3 text-xs mono text-emerald-400 bg-[#0d0d0d] rounded-lg p-3">
              npm run dev  ← en la carpeta raíz del repo
            </pre>
          </div>
          <div className="flex gap-3">
            <button onClick={onGoToVideos}
              className="flex-1 py-3 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 transition">
              Ver en Mis videos →
            </button>
            <button onClick={onReset}
              className="flex-1 py-3 rounded-xl font-semibold text-sm border border-[#2a2a2a]
                         text-[#888] hover:text-white hover:border-[#444] transition">
              Generar otro video
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-[#2a2a2a] rounded-xl p-4 space-y-2">
            <p className="text-sm text-[#666]">Se guardarán:</p>
            <p className="mono text-sm text-[#aaa]">src/{script.slug}/data.ts</p>
            <p className="mono text-sm text-[#aaa]">src/{script.slug}/script.json</p>
            <p className="mono text-sm text-[#aaa]">src/{script.slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("")}Composition.tsx</p>
            {images.map((img) => (
              <p key={img.sceneKey} className="mono text-sm text-[#aaa]">
                public/{script.slug}/{img.filename}
              </p>
            ))}
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">{error}</p>
          )}
          <button onClick={handleSave} disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500
                       disabled:opacity-40 transition">
            {loading ? "Guardando archivos..." : "Guardar en el repo →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── HOME VIEW ───────────────────────────────────────────────────────────────

function HomeView({ onNew, onVideos }: { onNew: () => void; onVideos: () => void }) {
  return (
    <div className="max-w-xl">
      <h2 className="text-3xl font-bold mb-2">Video Generator</h2>
      <p className="text-[#666] mb-8">Genera guiones e imágenes para tus videos de IA y ciberseguridad.</p>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={onNew}
          className="p-6 rounded-2xl border border-emerald-700/40 bg-emerald-900/10 text-left
                     hover:border-emerald-500/60 hover:bg-emerald-900/20 transition group">
          <div className="text-3xl mb-3">✨</div>
          <p className="font-bold text-white text-base mb-1">Nuevo video</p>
          <p className="text-[#888] text-xs">Genera guión + imágenes con GPT-4o y gpt-image-1</p>
        </button>
        <button onClick={onVideos}
          className="p-6 rounded-2xl border border-[#2a2a2a] bg-[#161616] text-left
                     hover:border-[#444] hover:bg-[#1e1e1e] transition group">
          <div className="text-3xl mb-3">📼</div>
          <p className="font-bold text-white text-base mb-1">Mis videos</p>
          <p className="text-[#888] text-xs">Ver y editar todos los videos generados</p>
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Home() {
  const [view, setView] = useState<View>({ name: "home" });

  // Wizard state
  const [script, setScript]   = useState<AnyVideoScript | null>(null);
  const [images, setImages]   = useState<GeneratedImage[]>([]);
  const [preTopic, setPreTopic] = useState("");

  function goWizard(topic = "") {
    setPreTopic(topic);
    setScript(null);
    setImages([]);
    setView({ name: "wizard", step: 1 });
  }

  function resetWizard() {
    setScript(null);
    setImages([]);
    setView({ name: "wizard", step: 1 });
  }

  const wizardStep = view.name === "wizard" ? view.step : 1;

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      <Nav view={view} onNav={setView} />

      {view.name === "home" && (
        <HomeView onNew={() => goWizard()} onVideos={() => setView({ name: "videos" })} />
      )}

      {view.name === "wizard" && (
        <>
          <StepIndicator current={wizardStep} />

          {wizardStep === 1 && (
            <TopicForm
              initialTopic={preTopic}
              onScript={(s) => { setScript(s); setView({ name: "wizard", step: 2 }); }}
            />
          )}
          {wizardStep === 2 && script && (
            <ScriptPreview
              script={script}
              onContinue={() => setView({ name: "wizard", step: 3 })}
            />
          )}
          {wizardStep === 3 && script && (
            <ImageGallery
              script={script}
              images={images}
              onImages={setImages}
              onContinue={() => setView({ name: "wizard", step: 4 })}
            />
          )}
          {wizardStep === 4 && script && (
            <VoiceoverStep
              script={script}
              onBack={() => setView({ name: "wizard", step: 3 })}
              onContinue={() => setView({ name: "wizard", step: 5 })}
            />
          )}
          {wizardStep === 5 && script && (
            <SavePanel
              script={script}
              images={images}
              onReset={resetWizard}
              onGoToVideos={() => setView({ name: "videos" })}
            />
          )}
        </>
      )}

      {view.name === "videos" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Mis videos</h2>
            <button onClick={() => goWizard()}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 transition">
              + Nuevo video
            </button>
          </div>
          <VideoList
            onEdit={(slug, compositionId) => setView({ name: "editor", slug, compositionId })}
            onRegenerate={(title) => goWizard(title)}
          />
        </div>
      )}

      {view.name === "editor" && (
        <VideoEditor
          slug={view.slug}
          compositionId={view.compositionId}
          onBack={() => setView({ name: "videos" })}
        />
      )}
    </main>
  );
}
