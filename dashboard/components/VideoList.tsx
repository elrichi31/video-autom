"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { VideoMeta } from "@/app/api/videos/route";

// ─── Modal open/close animation (transitions-dev: 06-modal) ───────────────────

const MODAL_CLOSE_MS = 150; // keep in sync with --modal-close-dur in globals.css

/**
 * Defers the real onClose until the scale-down animation finishes, and exposes
 * the data-state ("open" | "closing") for the backdrop + dialog elements.
 */
function useModalAnimation(onClose: () => void) {
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    setClosing(true);
    const t = setTimeout(onClose, MODAL_CLOSE_MS);
    return () => clearTimeout(t);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") requestClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [requestClose]);

  return { state: closing ? "closing" : "open", requestClose } as const;
}

// ─── Remotion Studio Preview Modal (embedded iframe via proxy) ────────────────

function RemotionPreviewModal({
  compositionId,
  title,
  onClose,
}: {
  compositionId: string;
  title: string;
  onClose: () => void;
}) {
  const { state, requestClose } = useModalAnimation(onClose);

  return (
    <div
      data-state={state}
      className="t-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={requestClose}
    >
      <div
        data-state={state}
        className="t-modal relative flex flex-col rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#0d0d0d]"
        style={{ width: "min(380px, 92vw)", maxHeight: "95vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e] shrink-0">
          <p className="text-white text-sm font-semibold truncate pr-4">{title}</p>
          <button onClick={requestClose} className="text-[#555] hover:text-white transition text-lg leading-none">
            ✕
          </button>
        </div>
        <div className="relative bg-black" style={{ aspectRatio: "9/16" }}>
          <iframe
            src={`http://localhost:3000/${encodeURIComponent(compositionId)}`}
            className="w-full h-full border-0"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}

// ─── MP4 Preview Modal ────────────────────────────────────────────────────────

function Mp4PreviewModal({
  slug,
  title,
  onClose,
}: {
  slug: string;
  title: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleClose() {
    videoRef.current?.pause();
    onClose();
  }

  const { state, requestClose } = useModalAnimation(handleClose);

  return (
    <div
      data-state={state}
      className="t-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={requestClose}
    >
      <div
        data-state={state}
        className="t-modal relative flex flex-col rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#0d0d0d]"
        style={{ width: "min(340px, 90vw)", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
          <p className="text-white text-sm font-semibold truncate pr-4">{title}</p>
          <button onClick={requestClose} className="text-[#555] hover:text-white transition text-lg leading-none">
            ✕
          </button>
        </div>
        <div className="relative bg-black" style={{ aspectRatio: "9/16" }}>
          <video ref={videoRef} controls autoPlay playsInline className="w-full h-full object-contain">
            <source src={`/api/download-video/${slug}.mp4`} type="video/mp4" />
          </video>
        </div>
        <div className="p-3">
          <a
            href={`/api/download-video/${slug}.mp4?download=1`}
            download={`${slug}.mp4`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                       text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 transition text-white"
          >
            ↓ Descargar MP4
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Video List ───────────────────────────────────────────────────────────────

type PreviewMode =
  | { slug: string; compositionId: string; title: string; mode: "remotion" }
  | { slug: string; title: string; mode: "mp4" };

export function VideoList({
  onEdit,
  onRegenerate,
}: {
  onEdit: (slug: string, compositionId: string) => void;
  onRegenerate: (title: string) => void;
}) {
  const [videos,  setVideos]  = useState<VideoMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<PreviewMode | null>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((d) => setVideos(d.videos ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-[#1e1e1e] bg-[#141414]">
            <div className="bg-[#1a1a1a] animate-pulse" style={{ aspectRatio: "9/16" }} />
            <div className="p-3 space-y-2">
              <div className="h-3 w-4/5 rounded bg-[#1f1f1f] animate-pulse" />
              <div className="h-2 w-3/5 rounded bg-[#1a1a1a] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-24 border border-dashed border-[#262626] rounded-2xl">
        <p className="text-5xl mb-4">📼</p>
        <p className="text-lg font-semibold text-[#888]">Aún no hay videos</p>
        <p className="text-sm mt-1 text-[#555]">Genera tu primer video con el botón de arriba.</p>
      </div>
    );
  }

  return (
    <>
      {preview?.mode === "remotion" && (
        <RemotionPreviewModal
          compositionId={preview.compositionId}
          title={preview.title}
          onClose={() => setPreview(null)}
        />
      )}
      {preview?.mode === "mp4" && (
        <Mp4PreviewModal
          slug={preview.slug}
          title={preview.title}
          onClose={() => setPreview(null)}
        />
      )}

      <p className="text-[#555] text-xs mb-4">
        {videos.length} {videos.length === 1 ? "video" : "videos"}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {videos.map((v) => (
          <VideoCard
            key={v.slug}
            video={v}
            onEdit={() => onEdit(v.slug, v.compositionId)}
            onRegenerate={onRegenerate}
            onPreviewRemotion={() =>
              setPreview({ slug: v.slug, compositionId: v.compositionId, title: v.displayTitle, mode: "remotion" })
            }
            onPreviewMp4={() => setPreview({ slug: v.slug, title: v.displayTitle, mode: "mp4" })}
          />
        ))}
      </div>
    </>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────

function VideoCard({
  video,
  onEdit,
  onRegenerate,
  onPreviewRemotion,
  onPreviewMp4,
}: {
  video: VideoMeta;
  onEdit: () => void;
  onRegenerate: (title: string) => void;
  onPreviewRemotion: () => void;
  onPreviewMp4: () => void;
}) {
  const [hasVideo, setHasVideo] = useState(false);
  const imgSrc = video.thumbnailPath ? `/api/images/${video.thumbnailPath}` : null;

  useEffect(() => {
    fetch(`/api/download-video/${video.slug}.mp4`, { method: "HEAD" })
      .then((r) => setHasVideo(r.ok))
      .catch(() => setHasVideo(false));
  }, [video.slug]);

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-[#242424]
                    bg-[#141414] hover:border-[#3a3a3a] hover:shadow-lg hover:shadow-black/40
                    hover:-translate-y-0.5 transition-all duration-200">
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{ aspectRatio: "9/16" }}
        onClick={onPreviewRemotion}
      >
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={video.displayTitle}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        ) : (
          // Themed placeholder for videos without a generated thumbnail
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2
                          bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0d0d0d]">
            <div className="text-[#2e2e2e] text-4xl">🎬</div>
            <span className="text-[#3a3a3a] text-[10px] font-semibold uppercase tracking-wider">
              Sin imagen
            </span>
          </div>
        )}

        {/* Gradient for legibility of title + badges */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center
                        bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl
                          scale-90 group-hover:scale-100 transition-transform duration-200">
            <svg viewBox="0 0 24 24" fill="black" className="w-6 h-6 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pr-2">
          {video.hasScript && (
            <span className="px-1.5 py-0.5 rounded-md bg-black/55 backdrop-blur-sm border border-white/10
                             text-emerald-300 text-[9px] font-bold uppercase tracking-wide">
              ✦ IA
            </span>
          )}
          <span className={`px-1.5 py-0.5 rounded-md backdrop-blur-sm border text-[9px] font-bold uppercase tracking-wide
            ${hasVideo
              ? "bg-emerald-600/85 border-emerald-400/30 text-white"
              : "bg-black/55 border-white/10 text-[#888]"}`}>
            {hasVideo ? "✓ MP4" : "○ Sin render"}
          </span>
        </div>

        {/* Title over the image */}
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <p className="text-white text-xs font-bold leading-tight line-clamp-2 drop-shadow-sm">
            {video.displayTitle}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-stretch gap-1.5 p-2">
        <button
          onClick={onPreviewRemotion}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg
                     bg-[#1c1c1c] hover:bg-[#242424] text-[#bbb] hover:text-white
                     text-[10px] font-semibold transition"
          title="Preview en Remotion Studio"
        >
          ▶ Preview
        </button>
        {hasVideo && (
          <button
            onClick={onPreviewMp4}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg
                       bg-emerald-700/25 hover:bg-emerald-700/40 text-emerald-300
                       text-[10px] font-semibold transition"
            title="Ver MP4 renderizado"
          >
            MP4
          </button>
        )}
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg
                     bg-emerald-600 hover:bg-emerald-500 text-white
                     text-[10px] font-semibold transition"
          title="Editar guión, escenas y voz"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
