"use client";

import { useState } from "react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

interface VideoGalleryProps {
  videos: Video[];
  mcTitolo: string;
}

export default function VideoGallery({ videos, mcTitolo }: VideoGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!videos || videos.length === 0) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">▶️</span>
        <div>
          <p className="text-sm font-black text-slate-500">Video correlati</p>
          <p className="text-xs text-slate-400">{videos.length} video su YouTube · {mcTitolo}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div key={video.id} className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
            {activeId === video.id ? (
              /* Player YouTube inline */
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=it`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              /* Thumbnail con play button */
              <button
                onClick={() => setActiveId(video.id)}
                className="group relative block w-full"
                aria-label={`Riproduci: ${video.title}`}
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay scuro al hover */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-100" />
                  {/* Pulsante play */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 shadow-lg transition duration-200 group-hover:scale-110 group-hover:bg-red-700">
                      <svg viewBox="0 0 20 20" fill="white" className="h-5 w-5 translate-x-0.5">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Titolo video */}
            <div className="px-3 py-2">
              <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-700">
                {video.title}
              </p>
              {activeId !== video.id && (
                <p className="mt-1 text-xs text-slate-400">YouTube</p>
              )}
              {activeId === video.id && (
                <button
                  onClick={() => setActiveId(null)}
                  className="mt-1 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕ Chiudi
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
