"use client";

import { useState } from "react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

interface FlippedVideosProps {
  videos: Video[];   // esattamente 3
}

export default function FlippedVideos({ videos }: FlippedVideosProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!videos || videos.length === 0) return null;

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-indigo-100 px-4 py-3">
        <span className="text-lg">🏠</span>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-700">
            Flipped classroom — guarda prima della lezione
          </p>
          <p className="text-xs text-slate-500">
            {videos.length} video selezionati · da guardare a casa
          </p>
        </div>
      </div>

      {/* Griglia 3 video */}
      <div className="grid grid-cols-1 gap-px bg-indigo-100 sm:grid-cols-3">
        {videos.map((video, i) => (
          <div key={video.id} className="bg-indigo-50">
            {activeId === video.id ? (
              /* Player inline */
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
              /* Thumbnail */
              <button
                onClick={() => setActiveId(video.id)}
                className="group relative block w-full"
                aria-label={`Riproduci: ${video.title}`}
              >
                <div className="relative overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-100" />
                  {/* Numero + play */}
                  <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white shadow">
                    {i + 1}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 shadow-lg transition group-hover:scale-110 group-hover:bg-red-700">
                      <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4 translate-x-0.5">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Titolo */}
            <div className="px-3 py-2">
              <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-700">
                {video.title}
              </p>
              {activeId === video.id ? (
                <button
                  onClick={() => setActiveId(null)}
                  className="mt-1 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕ Chiudi
                </button>
              ) : (
                <p className="mt-0.5 text-xs text-indigo-400">Video {i + 1} di {videos.length}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
