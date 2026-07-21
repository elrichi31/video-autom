"use client";

import { useEffect, useState, useRef } from "react";
import type { AnyVideoScript } from "@/lib/types";
import { getSceneKeys, getSceneLabels } from "@/lib/types";
import type { VoiceoverScript, ElevenLabsVoice, VoiceSettings } from "@/lib/voiceover-types";
import { DEFAULT_VOICE_SETTINGS, getSceneDurations, getTimelineSceneDurations, getVoicePreset, isExpressiveVoiceModel, WORDS_PER_SECOND, DEFAULT_TARGET_DURATION } from "@/lib/voiceover-types";

const MODELS = [
  { id: "eleven_multilingual_v2", label: "Multilingual v2 — recomendado: natural en español" },
  { id: "eleven_v3",              label: "v3 — expresivo (tags y textos más largos)" },
  { id: "eleven_flash_v2_5",      label: "Flash v2.5 — borradores rápidos" },
];

function isSpanishVoice(voice: ElevenLabsVoice): boolean {
  const metadata = Object.values(voice.labels ?? {}).join(" ").toLowerCase();
  return /\b(spanish|español|espanol|es-mx|es-es|mexic|latam|latin)/.test(metadata);
}

// ─── Word count badge ────────────────────────────────────────────────────────

function WordBadge({ text, maxWords }: { text: string; maxWords: number }) {
  const count = text.trim().split(/\s+/).filter(Boolean).length;
  const over  = count > maxWords;
  return (
    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
      over ? "bg-red-900/40 text-red-400" : "bg-[#1e1e1e] text-[#666]"
    }`}>
      {count}/{maxWords} palabras{over ? " ⚠" : ""}
    </span>
  );
}

// ─── Slider ──────────────────────────────────────────────────────────────────

function Slider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-[10px] text-[#666] uppercase tracking-wider font-bold">{label}</label>
        <span className="text-[10px] font-mono text-[#aaa]">{value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-emerald-500 h-1.5 rounded" />
    </div>
  );
}

// ─── Main Panel ──────────────────────────────────────────────────────────────

function emptyVoiceover(keys: string[], durations: Record<string, number>, total: number): VoiceoverScript {
  const scenes: VoiceoverScript["scenes"] = {};
  for (const k of keys) {
    scenes[k] = { text: "", durationSeconds: durations[k] ?? 0, wordCount: 0 };
  }
  return { scenes, fullScript: "", totalDurationSeconds: total };
}

export function VoiceoverPanel({ script, slug }: { script: AnyVideoScript; slug: string }) {
  const sceneKeys   = getSceneKeys(script);
  const sceneLabels = getSceneLabels(script);

  function getSceneDurationsForScript(secs: number): Record<string, number> {
    return script.compositionType === "timeline"
      ? getTimelineSceneDurations(secs)
      : getSceneDurations(secs);
  }

  // Duration is owned by Step 1 (the topic form / script). The voiceover panel
  // only reads it so the on-screen script and narration share the same pacing.
  const targetDuration = script.targetDurationSeconds ?? DEFAULT_TARGET_DURATION;
  const [voiceover,   setVoiceover]   = useState<VoiceoverScript | null>(null);
  const [voices,      setVoices]      = useState<ElevenLabsVoice[]>([]);
  const [settings,    setSettings]    = useState<VoiceSettings>(DEFAULT_VOICE_SETTINGS);
  const [audioPath,    setAudioPath]    = useState<string | null>(null);
  const [audioKey,     setAudioKey]     = useState(0);
  const [unsaved,      setUnsaved]      = useState(false);
  const [savedAt,      setSavedAt]      = useState<string | null>(null);
  const [sceneFiles,   setSceneFiles]   = useState<Record<string, string> | null>(null);
  const [sceneTakes,   setSceneTakes]   = useState<Record<string, string[]> | null>(null);
  const [takeCount,    setTakeCount]    = useState(1);
  const [genProgress,  setGenProgress]  = useState<string>("");

  const [context,        setContext]        = useState("");
  const [contextFileName, setContextFileName] = useState("");
  const [showContext,    setShowContext]    = useState(false);

  const [initLoading,      setInitLoading]      = useState(true);
  const [genScriptLoading, setGenScriptLoading] = useState(false);
  const [genVoiceLoading,  setGenVoiceLoading]  = useState(false);
  const [saveLoading,      setSaveLoading]      = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load everything in parallel on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/list-voices").then((r) => r.json()).catch(() => ({ voices: [] })),
      fetch(`/api/voiceover-script/${slug}`).then((r) => r.json()).catch(() => null),
      fetch(`/api/images/${slug}/${slug}-voiceover.mp3`, { method: "HEAD" }).catch(() => null),
    ]).then(([voicesData, savedData, audioRes]) => {
      const list: ElevenLabsVoice[] = voicesData.voices ?? [];
      setVoices(list);

      if (savedData?.voiceover) {
        setVoiceover(savedData.voiceover);
        setSettings(savedData.settings ?? DEFAULT_VOICE_SETTINGS);
        setSavedAt(savedData.savedAt ?? null);
        if (savedData.voiceoverFiles) setSceneFiles(savedData.voiceoverFiles);
        if (savedData.voiceoverTakes) setSceneTakes(savedData.voiceoverTakes);
      } else {
        // No saved data — show empty editable scenes right away
        const dur = getSceneDurationsForScript(script.targetDurationSeconds ?? DEFAULT_TARGET_DURATION);
        setVoiceover(emptyVoiceover(sceneKeys, dur, script.targetDurationSeconds ?? DEFAULT_TARGET_DURATION));
        if (list.length > 0) {
          const preferred = list.find(isSpanishVoice) ?? list[0];
          setSettings((s) => ({ ...s, voiceId: preferred.voice_id }));
        }
      }

      if (audioRes && (audioRes as Response).ok) {
        setAudioPath(`/api/images/${slug}/${slug}-voiceover.mp3`);
      }
    }).finally(() => setInitLoading(false));
  }, [slug, script.targetDurationSeconds]);

  async function saveVoiceover(
    vo: VoiceoverScript,
    s: VoiceSettings,
    dur: number,
    files?: Record<string, string>,
    takes?: Record<string, string[]>,
  ) {
    setSaveLoading(true);
    try {
      await fetch(`/api/voiceover-script/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceover: vo,
          settings: s,
          targetDuration: dur,
          voiceoverFiles: files ?? sceneFiles ?? undefined,
          voiceoverTakes: takes ?? sceneTakes ?? undefined,
        }),
      });
      setSavedAt(new Date().toISOString());
      setUnsaved(false);
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleContextFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContext(text);
    setContextFileName(file.name);
    setShowContext(true);
    e.target.value = "";
  }

  async function generateScript() {
    setGenScriptLoading(true);
    setError("");
    try {
      const scriptWithDuration = { ...script, targetDurationSeconds: targetDuration };
      const res = await fetch("/api/generate-voiceover-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptWithDuration, context: context.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setVoiceover(data.voiceover);
      setUnsaved(false);
      // Auto-save after generation
      await saveVoiceover(data.voiceover, settings, targetDuration);
    } catch (err) {
      setError(String(err));
    } finally {
      setGenScriptLoading(false);
    }
  }

  const hasAnyText = voiceover
    ? sceneKeys.some((k) => voiceover.scenes[k]?.text.trim().length > 0)
    : false;

  async function generateVoice() {
    if (!voiceover || !hasAnyText) return;
    setGenVoiceLoading(true);
    setGenProgress("Generando audio por escena...");
    setError("");
    try {
      // Build per-scene texts (only non-empty scenes)
      const sceneTexts: Record<string, string> = {};
      for (const k of sceneKeys) {
        const t = voiceover.scenes[k]?.text.trim();
        if (t) sceneTexts[k] = t;
      }

      const res = await fetch("/api/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, settings, sceneTexts, takeCount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");

      const files: Record<string, string> = data.files;
      const takes: Record<string, string[]> = data.takes ?? {};
      const normalizedTexts: Record<string, string> = data.normalizedTexts ?? {};
      const normalizedVoiceover: VoiceoverScript = {
        ...voiceover,
        scenes: Object.fromEntries(sceneKeys.map((key) => {
          const text = normalizedTexts[key] ?? voiceover.scenes[key]?.text ?? "";
          return [key, {
            ...voiceover.scenes[key],
            text,
            wordCount: text.trim().split(/\s+/).filter(Boolean).length,
          }];
        })),
      };
      normalizedVoiceover.fullScript = sceneKeys
        .map((key) => normalizedVoiceover.scenes[key]?.text ?? "")
        .filter(Boolean)
        .join(" ");
      setSceneFiles(files);
      setSceneTakes(takes);
      setVoiceover(normalizedVoiceover);
      setAudioKey((k) => k + 1);

      // Set preview to intro file (or first available)
      const firstFile = files[sceneKeys.find((k) => files[k]) ?? ""] ?? null;
      if (firstFile) setAudioPath(`/api/images/${firstFile}`);

      // Save everything including file paths
      await saveVoiceover(normalizedVoiceover, settings, targetDuration, files, takes);
      setGenProgress("");
    } catch (err) {
      setError(String(err));
      setGenProgress("");
    } finally {
      setGenVoiceLoading(false);
    }
  }

  function updateSceneText(key: string, text: string) {
    if (!voiceover) return;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const updated = {
      ...voiceover,
      scenes: {
        ...voiceover.scenes,
        [key]: { ...voiceover.scenes[key as keyof typeof voiceover.scenes], text, wordCount },
      },
    };
    updated.fullScript = sceneKeys.map((k) => updated.scenes[k]?.text ?? "").join(" ... ");
    setVoiceover(updated);
    setUnsaved(true);
  }

  function updateSettings(patch: Partial<VoiceSettings>) {
    setSettings((s) => {
      const next = { ...s, ...patch };
      setUnsaved(true);
      return next;
    });
  }

  const sceneDurations = getSceneDurationsForScript(targetDuration);
  const expressiveMode = isExpressiveVoiceModel(settings.modelId);
  const effectiveSpeed = expressiveMode ? 1 : settings.speed;

  function formatSavedAt(iso: string) {
    const diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 1) return "justo ahora";
    if (diff < 60) return `hace ${diff} min`;
    return new Date(iso).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  }

  if (initLoading) {
    return (
      <div className="flex items-center gap-3 text-[#555] py-8">
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        Cargando guión guardado...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Duration (read-only — owned by Step 1 / the script) ── */}
      <div className="border border-[#2a2a2a] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-white">Duración del video</p>
            <p className="text-[#666] text-xs mt-0.5">
              Definida al crear el video · cambia el ritmo desde el guión, no aquí
            </p>
          </div>
          <span className="text-emerald-400 font-mono text-sm font-bold">{targetDuration}s</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(sceneDurations).map(([key, secs]) => (
            <span key={key} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e1e1e] text-[#555]">
              {key} {secs}s
            </span>
          ))}
        </div>
      </div>

      {/* ── Step 1: Generate / Edit Script ── */}
      <div className="border border-[#2a2a2a] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-white">Guión de voz en off</p>
            <p className="text-[#666] text-xs mt-0.5">
              {savedAt
                ? <span className="text-emerald-500">✓ Guardado {formatSavedAt(savedAt)}</span>
                : "Escribe tú mismo o usa IA para sugerir el texto"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {voiceover && unsaved && (
              <button
                onClick={() => saveVoiceover(voiceover, settings, targetDuration)}
                disabled={saveLoading}
                className="px-3 py-2 rounded-lg text-xs font-semibold border border-emerald-700/60
                           text-emerald-400 hover:bg-emerald-900/20 disabled:opacity-40 transition"
              >
                {saveLoading ? "Guardando..." : "Guardar cambios"}
              </button>
            )}
            <button onClick={generateScript} disabled={genScriptLoading}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500
                         disabled:opacity-40 transition flex items-center gap-2">
              {genScriptLoading
                ? <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Generando...</>
                : "✦ Sugerir con IA"
              }
            </button>
          </div>
        </div>

        {/* ── Context for AI generation (paste / upload .md) ── */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowContext((v) => !v)}
              className="text-[11px] font-semibold text-[#888] hover:text-white transition flex items-center gap-1.5"
            >
              <span className="text-[#555]">{showContext ? "▾" : "▸"}</span>
              Contexto para la IA
              {context.trim() && (
                <span className="text-emerald-500 normal-case">
                  · {contextFileName ? `📄 ${contextFileName}` : `${context.trim().length.toLocaleString()} car.`}
                </span>
              )}
              <span className="text-[#444] font-normal">(opcional)</span>
            </button>
            {context.trim() && (
              <button type="button" onClick={() => { setContext(""); setContextFileName(""); }}
                className="text-[10px] text-[#666] hover:text-red-400 transition">
                Limpiar
              </button>
            )}
          </div>

          {showContext && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] text-[#555]">
                  Pega o sube info actualizada. La IA la usará como fuente de verdad (datos, cifras, fechas).
                </p>
                <label className="text-[10px] px-2 py-1 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a]
                                  text-[#888] hover:text-white hover:border-[#444] transition cursor-pointer shrink-0 ml-2">
                  Subir .md / .txt
                  <input type="file" accept=".md,.txt,text/markdown,text/plain"
                    onChange={handleContextFile} className="hidden" />
                </label>
              </div>
              <textarea
                value={context}
                onChange={(e) => { setContext(e.target.value); if (contextFileName) setContextFileName(""); }}
                placeholder="Ej: OpenAI lanzó GPT-5.6 en 2026 con tres modelos. Sol detecta vulnerabilidades..."
                rows={4}
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white
                           placeholder-[#444] focus:outline-none focus:border-emerald-500 transition resize-y mono"
              />
            </div>
          )}
        </div>

        {voiceover && (
          <div className="space-y-3 mt-4">
            {sceneKeys.map((key) => {
              const scene    = voiceover.scenes[key];
              const maxWords = Math.floor((sceneDurations[key] ?? 5) * WORDS_PER_SECOND * effectiveSpeed * 0.9);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#888]">{sceneLabels[key] ?? key}</span>
                      <span className="text-[10px] text-[#444] mono">{sceneDurations[key]}s</span>
                    </div>
                    <WordBadge text={scene?.text ?? ""} maxWords={maxWords} />
                  </div>
                  <textarea
                    value={scene?.text ?? ""}
                    onChange={(e) => updateSceneText(key, e.target.value)}
                    rows={2}
                    placeholder="Escribe la narración para esta escena..."
                    className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white
                               text-sm focus:outline-none focus:border-emerald-500 transition resize-none
                               placeholder:text-[#333]"
                  />
                  {(script.imagePrompts as Record<string, string>)?.[key] && (
                    <p className="text-[10px] text-[#444] leading-relaxed mt-1 pl-1">
                      <span className="text-[#555] font-semibold">Imagen: </span>
                      {(script.imagePrompts as Record<string, string>)[key]}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Full script preview — only when there's content */}
            {hasAnyText && (
              <div className="mt-2">
                <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">
                  Guión completo (enviado a ElevenLabs)
                </p>
                <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 text-sm text-[#aaa] leading-relaxed">
                  {sceneKeys.map((k) => voiceover.scenes[k]?.text.trim()).filter(Boolean).join(" ... ")}
                </div>
              </div>
            )}

            {/* Inline save reminder when unsaved */}
            {unsaved && (
              <button
                onClick={() => saveVoiceover(voiceover, settings, targetDuration)}
                disabled={saveLoading}
                className="w-full py-2 rounded-lg text-xs font-semibold border border-emerald-700/40
                           text-emerald-500 hover:bg-emerald-900/20 disabled:opacity-40 transition"
              >
                {saveLoading ? "Guardando..." : "↑ Guardar cambios en el guión"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Step 2: Voice Settings ── */}
      {voiceover && (
        <div className="border border-[#2a2a2a] rounded-xl p-4 space-y-4">
          <p className="text-sm font-semibold text-white">Configuración de voz</p>

          {/* Voice selector */}
          <div>
            <label className="block text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">
              Voz
            </label>
            <select
              value={settings.voiceId}
              onChange={(e) => updateSettings({ voiceId: e.target.value })}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white
                         text-sm focus:outline-none focus:border-emerald-500 transition"
            >
              {voices.map((v) => (
                <option key={v.voice_id} value={v.voice_id}>
                  {v.name}
                  {v.labels?.accent ? ` · ${v.labels.accent}` : ""}
                  {v.labels?.gender ? ` · ${v.labels.gender}` : ""}
                </option>
              ))}
              {voices.length === 0 && (
                <option value={DEFAULT_VOICE_SETTINGS.voiceId}>Adam (default)</option>
              )}
            </select>
          </div>

          {/* Model selector */}
          <div>
            <label className="block text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">Modelo</label>
            <select
              value={settings.modelId}
              onChange={(e) => updateSettings({
                voiceId: settings.voiceId,
                ...getVoicePreset(e.target.value),
              })}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white
                         text-sm focus:outline-none focus:border-emerald-500 transition"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <Slider label="Estabilidad" value={settings.stability} min={0} max={1} step={0.05} onChange={(v) => updateSettings({ stability: v })} />
            {!expressiveMode && <>
              <Slider label="Similitud" value={settings.similarityBoost} min={0} max={1} step={0.05} onChange={(v) => updateSettings({ similarityBoost: v })} />
              <Slider label="Estilo" value={settings.style} min={0} max={0.3} step={0.05} onChange={(v) => updateSettings({ style: v })} />
              <Slider label="Velocidad" value={settings.speed} min={0.85} max={1.1} step={0.05} onChange={(v) => updateSettings({ speed: v })} />
            </>}
          </div>

          {expressiveMode && (
            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              v3 controla la expresividad con el texto y la puntuación. No usa velocidad ni similitud; úsalo solo si cada escena tiene suficiente contexto.
            </p>
          )}

          <div className="flex items-center justify-between gap-3 rounded-lg bg-[#111] border border-[#242424] px-3 py-2">
            <div>
              <p className="text-xs text-[#bbb] font-medium">Tomas por escena</p>
              <p className="text-[10px] text-[#555]">Genera alternativas para elegir la interpretación más humana.</p>
            </div>
            <select
              value={takeCount}
              onChange={(e) => setTakeCount(Number(e.target.value))}
              className="bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-xs text-white"
            >
              <option value={1}>1 toma</option>
              <option value={2}>2 tomas</option>
              <option value={3}>3 tomas</option>
            </select>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">{error}</p>
          )}
          {genProgress && (
            <p className="text-emerald-400 text-xs text-center animate-pulse">{genProgress}</p>
          )}
          <button onClick={generateVoice} disabled={genVoiceLoading || !hasAnyText}
            className="w-full py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500
                       disabled:opacity-40 transition flex items-center justify-center gap-2">
            {genVoiceLoading
              ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Generando 7 escenas...</>
              : sceneFiles ? "↺ Regenerar audio sincronizado" : `Generar audio sincronizado (${sceneKeys.length} escenas)`
            }
          </button>
        </div>
      )}

      {/* ── Per-scene audio status ── */}
      {sceneFiles && (
        <div className="border border-emerald-800/40 bg-emerald-900/10 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-emerald-400">Audio sincronizado por escena ✓</p>
          <div className="grid grid-cols-1 gap-2">
            {sceneKeys.map((key) => {
              const file = sceneFiles[key];
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${file ? "bg-emerald-500" : "bg-[#333]"}`} />
                    <span className="text-xs text-[#888]">{sceneLabels[key] ?? key}</span>
                  </div>
                  {file ? (
                    <div className="flex items-center gap-2">
                      {(sceneTakes?.[key]?.length ?? 0) > 1 && (
                        <select
                          value={file}
                          onChange={(e) => {
                            const nextFiles = { ...sceneFiles, [key]: e.target.value };
                            setSceneFiles(nextFiles);
                            setAudioKey((value) => value + 1);
                            if (voiceover) void saveVoiceover(voiceover, settings, targetDuration, nextFiles, sceneTakes ?? undefined);
                          }}
                          className="bg-[#111] border border-[#333] rounded px-1.5 py-1 text-[10px] text-[#bbb]"
                          aria-label={`Elegir toma para ${sceneLabels[key] ?? key}`}
                        >
                          {sceneTakes![key].map((take, index) => (
                            <option key={take} value={take}>Toma {index + 1}</option>
                          ))}
                        </select>
                      )}
                      <audio
                        key={`${audioKey}-${key}`}
                        controls
                        className="h-7"
                        style={{ colorScheme: "dark", width: 200 }}
                      >
                        <source src={`/api/images/${file}?v=${audioKey}`} type="audio/mpeg" />
                      </audio>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#444]">sin texto</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[#444] text-[10px]">
            Cada escena reproduce su audio al inicio — sincronización perfecta
          </p>
        </div>
      )}
    </div>
  );
}
