"use client";

import { useState } from "react";

export interface Flashcard {
  front: string;
  back: string;
  tag?: string;
}

interface FlashcardDeckProps {
  cards: Flashcard[];
  mcTitolo: string;
}

type CardStatus = "unknown" | "known" | "review";

export default function FlashcardDeck({ cards, mcTitolo }: FlashcardDeckProps) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [status, setStatus]     = useState<Record<number, CardStatus>>({});
  const [shuffled, setShuffled] = useState<number[]>(() => cards.map((_, i) => i));

  if (!cards || cards.length === 0) return null;

  const known   = Object.values(status).filter((s) => s === "known").length;
  const review  = Object.values(status).filter((s) => s === "review").length;
  const pct     = Math.round((known / cards.length) * 100);

  function toggle(i: number) {
    setRevealed((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  function mark(i: number, s: CardStatus) {
    setStatus((prev) => ({ ...prev, [i]: s }));
    // Rivela automaticamente la risposta quando si segna
    setRevealed((prev) => ({ ...prev, [i]: true }));
  }

  function shuffle() {
    const arr = [...shuffled];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
    setRevealed({});
    setStatus({});
  }

  function reset() {
    setRevealed({});
    setStatus({});
    setShuffled(cards.map((_, i) => i));
  }

  const statusColor: Record<CardStatus, string> = {
    unknown: "border-slate-200 bg-white",
    known:   "border-emerald-300 bg-emerald-50",
    review:  "border-rose-300 bg-rose-50",
  };

  return (
    <div>
      {/* Header toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">
            {cards.length} card · <span className="font-semibold text-emerald-600">{known} note</span>
            {review > 0 && <> · <span className="font-semibold text-rose-500">{review} da ripassare</span></>}
          </p>
          {known > 0 && (
            <div className="mt-1.5 h-1 w-40 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={shuffle}
            className="rounded-full border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            🔀 Rimescola
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
          >
            Ricomincia
          </button>
        </div>
      </div>

      {/* Griglia card verticali */}
      <div className="grid gap-3 sm:grid-cols-2">
        {shuffled.map((cardIdx) => {
          const card = cards[cardIdx];
          const isRevealed = !!revealed[cardIdx];
          const cardStatus = status[cardIdx] ?? "unknown";

          return (
            <div
              key={cardIdx}
              className={`rounded-xl border transition-colors duration-200 ${statusColor[cardStatus]}`}
            >
              {/* Fronte — sempre visibile */}
              <button
                className="w-full cursor-pointer px-4 py-4 text-left"
                onClick={() => toggle(cardIdx)}
                aria-expanded={isRevealed}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {card.tag && (
                      <span className="mb-1.5 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-600">
                        {card.tag}
                      </span>
                    )}
                    <p className="font-black leading-snug text-slate-900">{card.front}</p>
                  </div>
                  <span className={`mt-0.5 shrink-0 text-slate-400 transition-transform duration-200 ${isRevealed ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </div>
              </button>

              {/* Retro — espandibile */}
              {isRevealed && (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Risposta</p>
                  <p className="text-sm leading-6 text-slate-700">{card.back}</p>

                  {/* Azioni */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => mark(cardIdx, "known")}
                      className={`flex-1 rounded-lg border py-1.5 text-xs font-bold transition-colors ${
                        cardStatus === "known"
                          ? "border-emerald-400 bg-emerald-100 text-emerald-800"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      ✓ La so
                    </button>
                    <button
                      onClick={() => mark(cardIdx, "review")}
                      className={`flex-1 rounded-lg border py-1.5 text-xs font-bold transition-colors ${
                        cardStatus === "review"
                          ? "border-rose-400 bg-rose-100 text-rose-800"
                          : "border-rose-200 text-rose-600 hover:bg-rose-50"
                      }`}
                    >
                      Ripassare
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Riepilogo finale */}
      {known + review === cards.length && cards.length > 0 && (
        <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-center">
          <p className="font-black text-slate-800">
            {known === cards.length
              ? "🎉 Perfetto! Conosci tutte le card."
              : `${known} note, ${review} da ripassare — continua così!`}
          </p>
          <button
            onClick={reset}
            className="mt-3 rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700"
          >
            Ripeti
          </button>
        </div>
      )}
    </div>
  );
}
