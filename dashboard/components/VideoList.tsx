"use client";

import { useEffect, useState } from "react";
import type { VideoMeta } from "@/app/api/videos/route";

export function VideoList({
  onEdit,
  onRegenerate,
}: {
  onEdit: (slug: string) => void;
  onRegenerate: (title: string) => void;
}) {
  const [videos, setVideos] = useState<VideoMeta[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {videos.map((v) => (
        <VideoCard key={v.slug} video={v} onEdit={onEdit} onRegenerate={onRegenerate} />
      ))}
    </div>
  );
}

function VideoCard({
  video,
  onEdit,
  onRegenerate,
}: {
  video: VideoMeta;
  onEdit: (slug: string) => void;
  onRegenerate: (title: string) => void;
}) {
  const imgSrc = video.thumbnailPath
    ? `/api/images/${video.thumbnailPath}`
    : null;

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#161616]
                    hover:border-[#444] transition">
      {/* Thumbnail */}
      <div className="relative bg-[#0d0d0d]" style={{ aspectRatio: "9/16" }}>
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt={video.displayTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#333] text-4xl">🎬</div>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition
                        flex flex-col items-center justify-center gap-2 p-3">
          {video.hasScript ? (
            <button
              onClick={() => onEdit(video.slug)}
              className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white
                         text-xs font-semibold transition"
            >
              Editar
            </button>
          ) : (
            <button
              onClick={() => onRegenerate(video.displayTitle)}
              className="w-full py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-[#aaa]
                         text-xs font-semibold transition"
            >
              Re-generar con IA
            </button>
          )}
        </div>
        {/* Badge */}
        {video.hasScript && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-violet-600/80
                          text-white text-[10px] font-bold backdrop-blur-sm">
            IA
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
          {video.displayTitle}
        </p>
        <p className="text-[#555] text-[10px] mono mt-1 truncate">{video.slug}</p>
      </div>
    </div>
  );
}
