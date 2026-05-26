"use client";

import { useEffect, useState, useCallback } from "react";
import type { AnyVideoScript } from "@/lib/types";
import { getSceneKeys, getSceneLabels } from "@/lib/types";
import { VoiceoverPanel } from "./VoiceoverPanel";
import { RemotionPlayer } from "./RemotionPlayer";

type Tab = "scenes" | "voiceover" | "render" | "tiktok";

// ─── Field helpers ─────────────────────────────────────────────────────────

function Field({
  label, value, onChange, multiline = false, mono = false, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; mono?: boolean; hint?: string;
}) {
  const base = `w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm
                focus:outline-none focus:border-violet-500 transition resize-none
                ${mono ? "font-mono" : ""}`;
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">
        {label}
        {hint && <span className="ml-2 font-normal normal-case text-[#444]">{hint}</span>}
      </label>
      {multiline ? (
        <textarea
          className={`${base} min-h-[72px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className={base} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function ArrayField({
  label, items, onChange,
}: {
  label: string; items: string[]; onChange: (items: string[]) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <input
            key={i}
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2
                       text-white text-sm focus:outline-none focus:border-violet-500 transition"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Scene editors ─────────────────────────────────────────────────────────

function SceneFields({
  sceneKey, scene, onChange,
}: {
  sceneKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scene: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (updated: any) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = scene as any;

  function set(field: string, value: unknown) {
    onChange({ ...s, [field]: value });
  }

  if (sceneKey === "intro" || sceneKey === "close") {
    return (
      <div className="space-y-3">
        <Field label="Tag" value={String(s.tag ?? "")} onChange={(v) => set("tag", v)} />
        <Field label="Título" value={String(s.title ?? "")} onChange={(v) => set("title", v)}
          multiline hint="usa \n para saltos de línea" />
        <Field label="Subtítulo" value={String(s.subtitle ?? "")} onChange={(v) => set("subtitle", v)} />
      </div>
    );
  }

  if (sceneKey === "layers") {
    return (
      <div className="space-y-3">
        <Field label="Tag" value={String(s.tag ?? "")} onChange={(v) => set("tag", v)} />
        <ArrayField label="Terminal (4 líneas)" items={s.terminal as string[]}
          onChange={(v) => set("terminal", v)} />
        <Field label="Definición" value={String(s.definition ?? "")} onChange={(v) => set("definition", v)}
          multiline hint="usa \n para saltos de línea" />
        <Field label="Detalle" value={String(s.detail ?? "")} onChange={(v) => set("detail", v)} />
      </div>
    );
  }

  if (sceneKey === "reality" || sceneKey === "today") {
    return (
      <div className="space-y-3">
        <Field label="Tag" value={String(s.tag ?? "")} onChange={(v) => set("tag", v)} />
        <Field label="Título" value={String(s.title ?? "")} onChange={(v) => set("title", v)}
          multiline hint="usa \n para saltos de línea" />
        {s.actions && (
          <ArrayField label="Acciones (4 items)" items={s.actions as string[]}
            onChange={(v) => set("actions", v)} />
        )}
      </div>
    );
  }

  if (sceneKey === "event1" || sceneKey === "event2" || sceneKey === "event3" || sceneKey === "event4") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Evento" value={String(s.event ?? "")} onChange={(v) => set("event", v)} />
          <Field label="Año" value={String(s.year ?? "")} onChange={(v) => set("year", v)} />
        </div>
        <Field label="Headline" value={String(s.headline ?? "")} onChange={(v) => set("headline", v)}
          multiline hint="usa \n para saltos de línea" />
        <Field label="Impacto" value={String(s.impact ?? "")} onChange={(v) => set("impact", v)} multiline />
      </div>
    );
  }

  // phase1 / phase2 / phase3
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fase" value={String(s.phase ?? "")} onChange={(v) => set("phase", v)} />
        <Field label="Timestamp / Etiqueta" value={String(s.timestamp ?? "")} onChange={(v) => set("timestamp", v)} />
      </div>
      <Field label="Título" value={String(s.title ?? "")} onChange={(v) => set("title", v)}
        multiline hint="usa \n para saltos de línea" />
      <Field label="Narrativa" value={String(s.narrative ?? "")} onChange={(v) => set("narrative", v)} multiline />
      <Field label="Detalle" value={String(s.detail ?? "")} onChange={(v) => set("detail", v)} />
      <ArrayField label="Indicadores (2 items)" items={s.indicator as string[]}
        onChange={(v) => set("indicator", v)} />
    </div>
  );
}

// ─── Scene panel ──────────────────────────────────────────────────────────

function ScenePanel({
  sceneKey, sceneLabel, script, imagePath, onSceneChange, onRegenerateImage, regenerating, accent,
}: {
  sceneKey: string;
  sceneLabel: string;
  script: AnyVideoScript;
  imagePath: string | undefined;
  onSceneChange: (key: string, updated: unknown) => void;
  onRegenerateImage: (key: string) => void;
  regenerating: boolean;
  accent: string;
}) {
  const [open, setOpen] = useState(false);
  const accents = script.accents as Record<string, [string, string]>;
  const scenes  = script.scenes  as Record<string, unknown>;
  const prompts = script.imagePrompts as Record<string, string>;

  return (
    <div
      className="border rounded-xl overflow-hidden"
      style={{ borderColor: accent + "44", background: accent + "08" }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: accent }} />
          <span className="text-sm font-semibold text-white">{sceneLabel}</span>
          {imagePath && (
            <span className="text-[10px] text-emerald-500 font-bold">● imagen</span>
          )}
        </div>
        <span className="text-[#444] text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          {/* Image row */}
          <div className="flex gap-4 items-start">
            <div
              className="flex-shrink-0 rounded-lg overflow-hidden border border-[#2a2a2a] bg-[#0d0d0d]"
              style={{ width: 80, aspectRatio: "9/16" }}
            >
              {imagePath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/images/${imagePath}`}
                  alt={sceneLabel}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#333] text-lg">+</div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-xs text-[#666]">Imagen de escena · gpt-image-1</p>
              <button
                onClick={() => onRegenerateImage(sceneKey)}
                disabled={regenerating}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#2a2a2a]
                           text-[#888] hover:text-white hover:border-[#444] disabled:opacity-40 transition w-fit"
              >
                {regenerating ? "Generando..." : imagePath ? "↺ Regenerar imagen" : "+ Generar imagen"}
              </button>
              <p className="text-[10px] text-[#444] leading-tight">
                Prompt: {prompts[sceneKey]?.slice(0, 80)}...
              </p>
            </div>
          </div>

          {/* Fields */}
          <SceneFields
            sceneKey={sceneKey}
            scene={scenes[sceneKey]}
            onChange={(updated) => onSceneChange(sceneKey, updated)}
          />
        </div>
      )}
    </div>
  );

  void accents; // suppress unused warning — used indirectly via accent prop
}

// ─── Main editor ──────────────────────────────────────────────────────────

export function VideoEditor({
  slug,
  compositionId,
  onBack,
}: {
  slug: string;
  compositionId: string;
  onBack: () => void;
}) {
  const [script, setScript]   = useState<AnyVideoScript | null>(null);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("scenes");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/videos/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setScript(d.script);
        setImagePaths(d.imagePaths ?? []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const getImagePath = useCallback(
    (key: string) => imagePaths.find((p) => p.includes(`-${key}.`)),
    [imagePaths],
  );

  function handleSceneChange(key: string, updated: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setScript((prev) => prev ? ({ ...prev, scenes: { ...prev.scenes, [key]: updated } } as AnyVideoScript) : prev);
    setSaved(false);
  }

  async function handleSave() {
    if (!script) return;
    setSaving(true);
    setSaved(false);
    await fetch(`/api/videos/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script }),
    });
    setSaving(false);
    setSaved(true);
  }

  async function handleRegenerateImage(key: string) {
    if (!script) return;
    setRegenerating(key);
    try {
      const res = await fetch("/api/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, sceneKey: key }),
      });
      const data = await res.json();
      const img = data.results?.[0];
      if (!img) return;

      // Save image via save-output-like call (reuse generate-images b64 → write file)
      await fetch("/api/save-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, filename: img.filename, b64: img.b64 }),
      });

      setImagePaths((prev) => {
        const filtered = prev.filter((p) => !p.includes(`-${key}.`));
        return [...filtered, `${slug}/${img.filename}`];
      });
    } finally {
      setRegenerating(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-[#555]">
        <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        Cargando video...
      </div>
    );
  }

  if (!script) {
    return (
      <div className="max-w-lg">
        <button onClick={onBack} className="text-[#666] hover:text-white text-sm mb-6 flex items-center gap-2">
          ← Volver
        </button>
        <div className="border border-amber-800/40 bg-amber-900/10 rounded-xl p-6 text-center">
          <p className="text-amber-400 font-semibold mb-2">Video sin guión editable</p>
          <p className="text-[#888] text-sm">
            Este video fue creado manualmente y no tiene un <span className="mono text-[#aaa]">script.json</span>.
            Para editarlo, genera un nuevo video con el mismo tema desde el dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-[#666] hover:text-white text-sm flex items-center gap-1.5">
            ← Volver
          </button>
          <div className="w-px h-4 bg-[#2a2a2a]" />
          <div>
            <h2 className="text-xl font-bold">{script.displayTitle}</h2>
            <p className="text-[#555] text-xs mono">{slug}</p>
          </div>
        </div>
        {tab === "scenes" && (
          <button onClick={handleSave} disabled={saving}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition
              ${saved ? "bg-emerald-700 text-emerald-200" : "bg-violet-600 hover:bg-violet-500 text-white"}
              disabled:opacity-40`}>
            {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar cambios"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#161616] border border-[#2a2a2a] rounded-xl p-1">
        {([
          { id: "scenes",    label: "Escenas" },
          { id: "voiceover", label: "Voz en off" },
          { id: "render",    label: "Render" },
          { id: "tiktok",    label: "TikTok" },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
              ${tab === t.id ? "bg-[#2a2a2a] text-white" : "text-[#555] hover:text-[#888]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Escenas ── */}
      {tab === "scenes" && (
        <>
          {(() => {
            const sceneKeys   = getSceneKeys(script);
            const sceneLabels = getSceneLabels(script);
            const accents     = script.accents as Record<string, [string, string]>;
            return (
              <>
                <div className="flex items-center gap-2 mb-4">
                  {sceneKeys.map((k) => (
                    <div key={k} className="w-3 h-3 rounded-full" style={{ background: accents[k]?.[0] ?? "#666" }} title={sceneLabels[k]} />
                  ))}
                  <span className="text-[#444] text-xs ml-1">paleta</span>
                </div>
                <div className="space-y-2 mb-6">
                  {sceneKeys.map((key) => (
                    <ScenePanel key={key} sceneKey={key} sceneLabel={sceneLabels[key] ?? key} script={script}
                      imagePath={getImagePath(key)} onSceneChange={handleSceneChange}
                      onRegenerateImage={handleRegenerateImage} regenerating={regenerating === key}
                      accent={accents[key]?.[0] ?? "#666"} />
                  ))}
                </div>
              </>
            );
          })()}
          <button onClick={handleSave} disabled={saving}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-500 disabled:opacity-40 transition">
            {saving ? "Guardando..." : "Guardar todos los cambios →"}
          </button>
        </>
      )}


      {/* ── Tab: Voiceover ── */}
      {tab === "voiceover" && (
        <VoiceoverPanel script={script} slug={slug} />
      )}

      {/* ── Tab: Render ── */}
      {tab === "render" && (
        <RenderPanel slug={slug} compositionId={compositionId} />
      )}

      {/* ── Tab: TikTok ── */}
      {tab === "tiktok" && script && (
        <TikTokPanel script={script} slug={slug} />
      )}
    </div>
  );
}

// ─── Render Panel ─────────────────────────────────────────────────────────────

function RenderPanel({ slug, compositionId }: { slug: string; compositionId: string }) {
  const [rendering, setRendering] = useState(false);
  const [rendered,  setRendered]  = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState("");

  useEffect(() => {
    fetch(`/api/download-video/${slug}.mp4`, { method: "HEAD" })
      .then((r) => { if (r.ok) setRendered(true); });
  }, [slug]);

  async function handleRender() {
    setRendering(true);
    setRendered(false);
    setProgress(0);
    setError("");
    try {
      const voiceRes = await fetch(`/api/images/${slug}/${slug}-voiceover.mp3`, { method: "HEAD" });
      const voiceoverFile = voiceRes.ok ? `${slug}/${slug}-voiceover.mp3` : undefined;

      const res = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, voiceoverFile }),
      });

      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        for (const line of text.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const evt = JSON.parse(line.slice(6));
            if (evt.progress !== undefined) setProgress(evt.progress);
            if (evt.done) setRendered(true);
            if (evt.error) throw new Error(evt.error);
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== "Unexpected end of JSON input") {
              throw parseErr;
            }
          }
        }
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setRendering(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Live composition preview */}
      <div className="rounded-xl overflow-hidden border border-[#2a2a2a] bg-black"
           style={{ aspectRatio: "9/16", maxHeight: 500, margin: "0 auto", width: "min(280px, 100%)" }}>
        <RemotionPlayer compositionId={compositionId} />
      </div>

      <div className="border border-[#2a2a2a] rounded-xl p-4">
        <p className="text-sm font-semibold text-white mb-1">Renderizar video</p>
        <p className="text-[#666] text-xs mb-4">
          Ejecuta <span className="mono text-[#aaa]">npx remotion render</span> con la voz en off si está disponible.
          El proceso puede tardar 1-3 minutos.
        </p>

        {error && (
          <div className="mb-4 bg-red-900/20 border border-red-800/30 rounded-lg p-3">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        {rendering && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-[#666] mb-1.5">
              <span>Renderizando...</span>
              <span className="font-mono text-violet-400">{progress}%</span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button onClick={handleRender} disabled={rendering}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-500
                     disabled:opacity-40 transition flex items-center justify-center gap-2">
          {rendering
            ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Procesando frames...</>
            : rendered ? "↺ Re-renderizar" : "Renderizar video"
          }
        </button>
      </div>

      {rendered && (
        <div className="border border-emerald-800/40 bg-emerald-900/10 rounded-xl overflow-hidden">
          {/* Video preview */}
          <div className="relative bg-black" style={{ aspectRatio: "9/16", maxHeight: 480, margin: "0 auto" }}>
            <video
              key={slug}
              controls
              playsInline
              className="w-full h-full object-contain"
              style={{ maxHeight: 480 }}
            >
              <source src={`/api/download-video/${slug}.mp4`} type="video/mp4" />
            </video>
          </div>

          {/* Download */}
          <div className="p-4">
            <a
              href={`/api/download-video/${slug}.mp4?download=1`}
              download={`${slug}.mp4`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold
                         text-sm bg-emerald-600 hover:bg-emerald-500 transition text-white"
            >
              ↓ Descargar {slug}.mp4
            </a>
            <p className="text-[#555] text-xs mt-2 text-center mono">
              remotion/out/{slug}.mp4
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TikTok Caption Panel ─────────────────────────────────────────────────────

type Caption = { title: string; description: string; hashtags: string[] };

function TikTokPanel({ script, slug }: { script: AnyVideoScript; slug: string }) {
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [caption,  setCaption]  = useState<Caption | null>(null);
  const [error,    setError]    = useState("");
  const [copied,   setCopied]   = useState<string | null>(null);

  // Load saved caption on mount
  useEffect(() => {
    fetch(`/api/tiktok-caption/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) { setCaption(data); setSaved(true); } })
      .catch(() => {});
  }, [slug]);

  async function saveCaption(cap: Caption) {
    setSaving(true);
    try {
      await fetch(`/api/tiktok-caption/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cap),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function generate() {
    setLoading(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/generate-tiktok-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setCaption(data);
      await saveCaption(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="border border-[#2a2a2a] rounded-xl p-4">
        <p className="text-sm font-semibold text-white mb-1">Caption para TikTok / Reels</p>
        <p className="text-[#666] text-xs mb-4">
          Genera título, descripción y hashtags optimizados para el algoritmo de TikTok e Instagram.
        </p>
        {error && (
          <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2 mb-3">{error}</p>
        )}
        <div className="flex items-center gap-2">
          <button onClick={generate} disabled={loading}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-500
                       disabled:opacity-40 transition flex items-center justify-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Generando...</>
              : caption ? "↺ Regenerar caption" : "✦ Generar caption con IA"
            }
          </button>
          {caption && (
            <div className="text-[10px] font-mono shrink-0">
              {saving ? <span className="text-[#555]">Guardando...</span>
                : saved ? <span className="text-emerald-500">✓ Guardado</span>
                : null}
            </div>
          )}
        </div>
      </div>

      {caption && (
        <div className="space-y-3">
          {/* Title */}
          <div className="border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider">Título</p>
              <button onClick={() => copy(caption.title, "title")}
                className="text-[10px] text-[#555] hover:text-violet-400 transition font-mono">
                {copied === "title" ? "✓ copiado" : "copiar"}
              </button>
            </div>
            <p className="text-white text-sm font-semibold leading-snug">{caption.title}</p>
            <p className="text-[#444] text-[10px] mono mt-1">{caption.title.length}/80 chars</p>
          </div>

          {/* Description */}
          <div className="border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider">Descripción</p>
              <button onClick={() => copy(caption.description, "desc")}
                className="text-[10px] text-[#555] hover:text-violet-400 transition font-mono">
                {copied === "desc" ? "✓ copiado" : "copiar"}
              </button>
            </div>
            <p className="text-[#ccc] text-sm leading-relaxed">{caption.description}</p>
          </div>

          {/* Hashtags */}
          <div className="border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider">Hashtags</p>
              <button onClick={() => copy(caption.hashtags.join(" "), "tags")}
                className="text-[10px] text-[#555] hover:text-violet-400 transition font-mono">
                {copied === "tags" ? "✓ copiados" : "copiar todos"}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {caption.hashtags.map((tag) => (
                <button key={tag} onClick={() => copy(tag, tag)}
                  className="text-xs px-2 py-1 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]
                             text-violet-400 hover:border-violet-500 transition font-mono">
                  {copied === tag ? "✓" : tag}
                </button>
              ))}
            </div>
          </div>

          {/* Full copy */}
          <button
            onClick={() => copy(`${caption.title}\n\n${caption.description}\n\n${caption.hashtags.join(" ")}`, "all")}
            className="w-full py-2.5 rounded-xl font-semibold text-sm border border-emerald-700/40
                       text-emerald-400 hover:bg-emerald-900/20 transition">
            {copied === "all" ? "✓ Todo copiado" : "↑ Copiar todo (listo para pegar)"}
          </button>
        </div>
      )}
    </div>
  );
}
