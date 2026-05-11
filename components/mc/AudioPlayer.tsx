"use client";

import { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
  titolo: string;
  durata?: number;      // minuti stimati
  transcript?: string;  // testo trascrizione (CARBLE-CDD criterio L)
}

export default function AudioPlayer({ src, titolo, durata, transcript }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]     = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [progress, setProgress]   = useState(0);   // 0-100
  const [current, setCurrent]     = useState(0);   // secondi
  const [duration, setDuration]   = useState(0);   // secondi
  const [loaded, setLoaded]       = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => { setDuration(audio.duration); setLoaded(true); };
    const onTime   = () => {
      setCurrent(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onEnded  = () => { setPlaying(false); setProgress(0); setCurrent(0); };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); } else { audio.play(); }
    setPlaying(!playing);
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  }

  function fmt(sec: number) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-4 sm:mt-4">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Intestazione */}
      <div className="mb-3 flex items-start gap-3">
        <span className="mt-0.5 text-xl">🎙️</span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-orange-600">
            Hook audio
          </p>
          <p className="truncate text-sm font-bold text-slate-800">{titolo}</p>
          {durata && !loaded && (
            <p className="text-xs text-slate-500">~{durata} min</p>
          )}
          {loaded && (
            <p className="text-xs text-slate-500">{fmt(duration)}</p>
          )}
        </div>
      </div>

      {/* Controlli */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
          aria-label={playing ? "Pausa" : "Riproduci"}
        >
          {playing ? (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <rect x="5" y="4" width="3" height="12" rx="1" />
              <rect x="12" y="4" width="3" height="12" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 translate-x-0.5">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>

        {/* Barra progresso */}
        <div className="flex flex-1 flex-col gap-1">
          <div
            className="h-2 w-full cursor-pointer overflow-hidden rounded-full bg-orange-200"
            onClick={seek}
            role="slider"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Tempi */}
          {loaded && (
            <div className="flex justify-between text-xs text-slate-500">
              <span>{fmt(current)}</span>
              <span>{fmt(duration)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Trascrizione — accessibilità (CARBLE-CDD criterio L) */}
      {transcript && (
        <div className="mt-3 border-t border-orange-100 pt-3">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex w-full items-center justify-between text-xs font-semibold text-orange-600 hover:text-orange-800"
            aria-expanded={showTranscript}
          >
            <span>📄 {showTranscript ? "Nascondi" : "Leggi"} la trascrizione</span>
            <span>{showTranscript ? "▲" : "▼"}</span>
          </button>
          {showTranscript && (
            <div className="mt-3 max-h-72 overflow-y-auto rounded-lg bg-white p-4 text-xs leading-6 text-slate-600 shadow-inner">
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-orange-400">
                Trascrizione — {titolo}
              </p>
              <p className="whitespace-pre-line">{transcript}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
