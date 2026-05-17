"use client";

import { useEffect, useState, useRef } from "react";
import type { VideoScript } from "@/lib/types";
import type { VoiceoverScript, ElevenLabsVoice, VoiceSettings } from "@/lib/voiceover-types";
import { DEFAULT_VOICE_SETTINGS, SCENE_DURATIONS, WORDS_PER_SECOND } from "@/lib/voiceover-types";

const SCENE_KEYS = ["intro", "layers", "phase1", "phase2", "phase3", "reality", "close"] as const;
const SCENE_LABELS: Record<string, string> = {
  intro: "Introducción", layers: "Explicación", phase1: "Fase 01",
  phase2: "Fase 02", phase3: "Fase 03", reality: "Realidad", close: "Cierre",
};

const MODELS = [
  { id: "eleven_multilingual_v2", label: "Multilingual v2 — mejor calidad en español" },
  { id: "eleven_flash_v2_5",      label: "Flash v2.5 — rápido y económico" },
  { id: "eleven_v3",              label: "v3 — más expresivo (beta)" },
];

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
        className="w-full accent-violet-500 h-1.5 rounded" />
    </div>
  );
}

// ─── Main Panel ──────────────────────────────────────────────────────────────

export function VoiceoverPanel({ script, slug }: { script: VideoScript; slug: string }) {
  const [voiceover,   setVoiceover]   = useState<VoiceoverScript | null>(null);
  const [voices,      setVoices]      = useState<ElevenLabsVoice[]>([]);
  const [settings,    setSettings]    = useState<VoiceSettings>(DEFAULT_VOICE_SETTINGS);
  const [audioPath,   setAudioPath]   = useState<string | null>(null);
  const [audioKey,    setAudioKey]    = useState(0);

  const [genScriptLoading, setGenScriptLoading] = useState(false);
  const [genVoiceLoading,  setGenVoiceLoading]  = useState(false);
  const [voicesLoading,    setVoicesLoading]    = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load voices on mount; auto-select the first voice from the account
  useEffect(() => {
    setVoicesLoading(true);
    fetch("/api/list-voices")
      .then((r) => r.json())
      .then((d) => {
        const list: ElevenLabsVoice[] = d.voices ?? [];
        setVoices(list);
        if (list.length > 0) {
          setSettings((s) => ({ ...s, voiceId: list[0].voice_id }));
        }
      })
      .finally(() => setVoicesLoading(false));
  }, []);

  // Check if voiceover audio already exists
  useEffect(() => {
    const path = `/api/images/${slug}/${slug}-voiceover.mp3`;
    fetch(path, { method: "HEAD" }).then((r) => {
      if (r.ok) setAudioPath(path);
    });
  }, [slug]);

  async function generateScript() {
    setGenScriptLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-voiceover-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setVoiceover(data.voiceover);
    } catch (err) {
      setError(String(err));
    } finally {
      setGenScriptLoading(false);
    }
  }

  async function generateVoice() {
    if (!voiceover?.fullScript) return;
    setGenVoiceLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, fullScript: voiceover.fullScript, settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setAudioPath(`/api/images/${slug}/${data.filename}`);
      setAudioKey((k) => k + 1);
    } catch (err) {
      setError(String(err));
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
    // Rebuild fullScript in order
    updated.fullScript = SCENE_KEYS.map((k) => updated.scenes[k].text).join(" ");
    setVoiceover(updated);
  }

  return (
    <div className="space-y-6">

      {/* ── Step 1: Generate Script ── */}
      <div className="border border-[#2a2a2a] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-white">Guión de voz en off</p>
            <p className="text-[#666] text-xs mt-0.5">GPT-4o genera narración sincronizada con cada escena</p>
          </div>
          <button onClick={generateScript} disabled={genScriptLoading}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500
                       disabled:opacity-40 transition flex items-center gap-2">
            {genScriptLoading
              ? <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Generando...</>
              : voiceover ? "↺ Regenerar guión" : "Generar guión con GPT-4o"
            }
          </button>
        </div>

        {voiceover && (
          <div className="space-y-3 mt-4">
            {SCENE_KEYS.map((key) => {
              const scene   = voiceover.scenes[key];
              const maxWords = Math.floor(SCENE_DURATIONS[key] * WORDS_PER_SECOND);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#888]">{SCENE_LABELS[key]}</span>
                      <span className="text-[10px] text-[#444] mono">{SCENE_DURATIONS[key]}s</span>
                    </div>
                    <WordBadge text={scene.text} maxWords={maxWords} />
                  </div>
                  <textarea
                    value={scene.text}
                    onChange={(e) => updateSceneText(key, e.target.value)}
                    rows={2}
                    className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white
                               text-sm focus:outline-none focus:border-violet-500 transition resize-none"
                  />
                </div>
              );
            })}

            {/* Full script preview */}
            <div className="mt-2">
              <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">
                Guión completo (enviado a ElevenLabs)
              </p>
              <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 text-sm text-[#aaa] leading-relaxed">
                {voiceover.fullScript}
              </div>
            </div>
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
              Voz {voicesLoading && <span className="text-[#444]">(cargando...)</span>}
            </label>
            <select
              value={settings.voiceId}
              onChange={(e) => setSettings((s) => ({ ...s, voiceId: e.target.value }))}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white
                         text-sm focus:outline-none focus:border-violet-500 transition"
            >
              {voices.map((v) => (
                <option key={v.voice_id} value={v.voice_id}>
                  {v.name}
                  {v.labels?.accent ? ` · ${v.labels.accent}` : ""}
                  {v.labels?.gender ? ` · ${v.labels.gender}` : ""}
                </option>
              ))}
              {voices.length === 0 && !voicesLoading && (
                <option value={DEFAULT_VOICE_SETTINGS.voiceId}>Adam (default)</option>
              )}
            </select>
          </div>

          {/* Model selector */}
          <div>
            <label className="block text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1">Modelo</label>
            <select
              value={settings.modelId}
              onChange={(e) => setSettings((s) => ({ ...s, modelId: e.target.value }))}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white
                         text-sm focus:outline-none focus:border-violet-500 transition"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <Slider label="Estabilidad"  value={settings.stability}       min={0} max={1} step={0.05} onChange={(v) => setSettings((s) => ({ ...s, stability: v }))} />
            <Slider label="Similitud"    value={settings.similarityBoost} min={0} max={1} step={0.05} onChange={(v) => setSettings((s) => ({ ...s, similarityBoost: v }))} />
            <Slider label="Estilo"       value={settings.style}           min={0} max={1} step={0.05} onChange={(v) => setSettings((s) => ({ ...s, style: v }))} />
            <Slider label="Velocidad"    value={settings.speed}           min={0.7} max={1.2} step={0.05} onChange={(v) => setSettings((s) => ({ ...s, speed: v }))} />
          </div>

          {/* Generate voice button */}
          {error && (
            <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">{error}</p>
          )}
          <button onClick={generateVoice} disabled={genVoiceLoading}
            className="w-full py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500
                       disabled:opacity-40 transition flex items-center justify-center gap-2">
            {genVoiceLoading
              ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Generando audio con ElevenLabs...</>
              : audioPath ? "↺ Regenerar audio" : "Generar audio con ElevenLabs"
            }
          </button>
        </div>
      )}

      {/* ── Audio preview ── */}
      {audioPath && (
        <div className="border border-emerald-800/40 bg-emerald-900/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-emerald-400">Audio generado</p>
            <a href={audioPath} download className="text-xs text-[#666] hover:text-white transition">
              ↓ Descargar MP3
            </a>
          </div>
          <audio
            key={audioKey}
            ref={audioRef}
            controls
            className="w-full h-10"
            style={{ colorScheme: "dark" }}
          >
            <source src={`${audioPath}?v=${audioKey}`} type="audio/mpeg" />
          </audio>
          <p className="text-[#555] text-xs mt-2 mono">
            Archivo: {slug}/{slug}-voiceover.mp3 · usado en Remotion como voiceoverFile
          </p>
        </div>
      )}
    </div>
  );
}
