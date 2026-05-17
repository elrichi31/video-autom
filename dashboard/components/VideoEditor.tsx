"use client";

import { useEffect, useState, useCallback } from "react";
import type { VideoScript, SceneKey } from "@/lib/types";
import { SCENE_LABELS } from "@/lib/types";
import { VoiceoverPanel } from "./VoiceoverPanel";

type Tab = "scenes" | "voiceover" | "render";

const SCENE_KEYS: SceneKey[] = ["intro", "layers", "phase1", "phase2", "phase3", "reality", "close"];

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
  sceneKey: SceneKey;
  scene: VideoScript["scenes"][SceneKey];
  onChange: (updated: VideoScript["scenes"][SceneKey]) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = scene as any;

  function set(field: string, value: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange({ ...s, [field]: value } as any);
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

  if (sceneKey === "reality") {
    return (
      <div className="space-y-3">
        <Field label="Tag" value={String(s.tag ?? "")} onChange={(v) => set("tag", v)} />
        <Field label="Título" value={String(s.title ?? "")} onChange={(v) => set("title", v)}
          multiline hint="usa \n para saltos de línea" />
        <ArrayField label="Acciones (4 items)" items={s.actions as string[]}
          onChange={(v) => set("actions", v)} />
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
  sceneKey, script, imagePath, onSceneChange, onRegenerateImage, regenerating, accent,
}: {
  sceneKey: SceneKey;
  script: VideoScript;
  imagePath: string | undefined;
  onSceneChange: (key: SceneKey, updated: VideoScript["scenes"][SceneKey]) => void;
  onRegenerateImage: (key: SceneKey) => void;
  regenerating: boolean;
  accent: string;
}) {
  const [open, setOpen] = useState(false);

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
          <span className="text-sm font-semibold text-white">{SCENE_LABELS[sceneKey]}</span>
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
                  alt={SCENE_LABELS[sceneKey]}
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
                Prompt: {script.imagePrompts[sceneKey]?.slice(0, 80)}...
              </p>
            </div>
          </div>

          {/* Fields */}
          <SceneFields
            sceneKey={sceneKey}
            scene={script.scenes[sceneKey]}
            onChange={(updated) => onSceneChange(sceneKey, updated)}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────

export function VideoEditor({
  slug,
  onBack,
}: {
  slug: string;
  onBack: () => void;
}) {
  const [script, setScript]   = useState<VideoScript | null>(null);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [regenerating, setRegenerating] = useState<SceneKey | null>(null);
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
    (key: SceneKey) => imagePaths.find((p) => p.includes(`-${key}.`)),
    [imagePaths],
  );

  function handleSceneChange(key: SceneKey, updated: VideoScript["scenes"][SceneKey]) {
    setScript((prev) => prev ? { ...prev, scenes: { ...prev.scenes, [key]: updated } } : prev);
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

  async function handleRegenerateImage(key: SceneKey) {
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
          { id: "scenes",   label: "Escenas" },
          { id: "voiceover", label: "Voz en off" },
          { id: "render",   label: "Render & Descarga" },
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
          <div className="flex items-center gap-2 mb-4">
            {SCENE_KEYS.map((k) => (
              <div key={k} className="w-3 h-3 rounded-full" style={{ background: script.accents[k][0] }} title={SCENE_LABELS[k]} />
            ))}
            <span className="text-[#444] text-xs ml-1">paleta</span>
          </div>
          <div className="space-y-2 mb-6">
            {SCENE_KEYS.map((key) => (
              <ScenePanel key={key} sceneKey={key} script={script}
                imagePath={getImagePath(key)} onSceneChange={handleSceneChange}
                onRegenerateImage={handleRegenerateImage} regenerating={regenerating === key}
                accent={script.accents[key][0]} />
            ))}
          </div>
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
        <RenderPanel slug={slug} />
      )}
    </div>
  );
}

// ─── Render Panel ─────────────────────────────────────────────────────────────

function RenderPanel({ slug }: { slug: string }) {
  const [rendering, setRendering] = useState(false);
  const [rendered,  setRendered]  = useState(false);
  const [error,     setError]     = useState("");
  const [log,       setLog]       = useState("");

  // Check if video already exists
  useEffect(() => {
    fetch(`/api/download-video/${slug}.mp4`, { method: "HEAD" })
      .then((r) => { if (r.ok) setRendered(true); });
  }, [slug]);

  async function handleRender() {
    setRendering(true);
    setError("");
    setLog("");
    try {
      // Get voiceover path if it exists
      const voiceRes = await fetch(`/api/images/${slug}/${slug}-voiceover.mp3`, { method: "HEAD" });
      const voiceoverFile = voiceRes.ok ? `${slug}/${slug}-voiceover.mp3` : undefined;

      const res = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, voiceoverFile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al renderizar");
      setRendered(true);
      setLog(data.stdout ?? "");
    } catch (err) {
      setError(String(err));
    } finally {
      setRendering(false);
    }
  }

  return (
    <div className="space-y-4">
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

        {log && (
          <pre className="mb-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 text-[#666] text-[10px] font-mono overflow-auto max-h-32">
            {log}
          </pre>
        )}

        <button onClick={handleRender} disabled={rendering}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-500
                     disabled:opacity-40 transition flex items-center justify-center gap-2">
          {rendering
            ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Renderizando (puede tardar unos minutos)...</>
            : rendered ? "↺ Re-renderizar" : "Renderizar video"
          }
        </button>
      </div>

      {rendered && (
        <div className="border border-emerald-800/40 bg-emerald-900/10 rounded-xl p-4">
          <p className="text-emerald-400 font-semibold mb-3">Video listo para descargar</p>
          <a
            href={`/api/download-video/${slug}.mp4`}
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
      )}
    </div>
  );
}
