"use client";

import { useEffect, useState, useRef } from "react";
import type { VideoMeta } from "@/app/api/videos/route";

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
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#0d0d0d]"
        style={{ width: "min(380px, 92vw)", maxHeight: "95vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e] shrink-0">
          <p className="text-white text-sm font-semibold truncate pr-4">{title}</p>
          <button onClick={onClose} className="text-[#555] hover:text-white transition text-lg leading-none">
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleClose() {
    videoRef.current?.pause();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative flex flex-col rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#0d0d0d]"
        style={{ width: "min(340px, 90vw)", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
          <p className="text-white text-sm font-semibold truncate pr-4">{title}</p>
          <button onClick={handleClose} className="text-[#555] hover:text-white transition text-lg leading-none">
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
      <div className="flex items-center gap-3 text-[#555]">
        <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        Cargando videos...
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20 text-[#444]">
        <p className="text-5xl mb-4">📼</p>
        <p className="text-lg font-semibold text-[#666]">Aún no hay videos</p>
        <p className="text-sm mt-1">Genera tu primer video con el botón de arriba.</p>
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
    <div className="group relative flex flex-col rounded-xl overflow-hidden border border-[#2a2a2a]
                    bg-[#161616] hover:border-[#444] transition">
      {/* Thumbnail */}
      <div
        className="relative bg-[#0d0d0d] cursor-pointer"
        style={{ aspectRatio: "9/16" }}
        onClick={onPreviewRemotion}
      >
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt={video.displayTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#333] text-4xl">🎬</div>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center
                        bg-black/50 opacity-0 group-hover:opacity-100 transition">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="black" className="w-6 h-6 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {video.hasScript && (
            <span className="px-2 py-0.5 rounded-md bg-violet-600/80 text-white text-[10px] font-bold backdrop-blur-sm">
              IA
            </span>
          )}
          {hasVideo && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-600/80 text-white text-[10px] font-bold backdrop-blur-sm">
              MP4
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{video.displayTitle}</p>
        <p className="text-[#555] text-[10px] mono mt-1 truncate">{video.slug}</p>

        {/* Action buttons */}
        <div className="flex gap-1 mt-2">
          <button
            onClick={onPreviewRemotion}
            className="flex-1 py-1.5 rounded-lg bg-violet-700/30 hover:bg-violet-700/50
                       text-violet-400 text-[10px] font-semibold transition"
            title="Preview en Remotion Studio"
          >
            ▶ Preview
          </button>
          {hasVideo && (
            <button
              onClick={onPreviewMp4}
              className="flex-1 py-1.5 rounded-lg bg-emerald-700/30 hover:bg-emerald-700/50
                         text-emerald-400 text-[10px] font-semibold transition"
              title="Ver MP4 renderizado"
            >
              MP4
            </button>
          )}
          <button
            onClick={onEdit}
            className="flex-1 py-1.5 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a]
                       text-[#888] hover:text-white text-[10px] font-semibold transition"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
