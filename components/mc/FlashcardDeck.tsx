"use client";

import { useState, useCallback } from "react";

export interface Flashcard {
  front: string;   // termine / domanda
  back: string;    // definizione / risposta
  tag?: string;    // categoria (opzionale)
}

interface FlashcardDeckProps {
  cards: Flashcard[];
  mcTitolo: string;
}

type CardStatus = "unknown" | "known" | "review";

export default function FlashcardDeck({ cards, mcTitolo }: FlashcardDeckProps) {
  const [order, setOrder]     = useState<number[]>(() => cards.map((_, i) => i));
  const [index, setIndex]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus]   = useState<Record<number, CardStatus>>({});
  const [done, setDone]       = useState(false);

  if (!cards || cards.length === 0) return null;

  const current = order[index];
  const card    = cards[current];
  const known   = Object.values(status).filter((s) => s === "known").length;
  const pct     = Math.round((known / cards.length) * 100);

  function flip() { setFlipped((f) => !f); }

  function mark(s: CardStatus) {
    setStatus((prev) => ({ ...prev, [current]: s }));
    next();
  }

  function next() {
    setFlipped(false);
    if (index < order.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }

  function prev() {
    if (index > 0) { setFlipped(false); setIndex((i) => i - 1); }
  }

  function shuffle() {
    const arr = [...order];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr);
    setIndex(0);
    setFlipped(false);
    setDone(false);
  }

  function restart() {
    setIndex(0); setFlipped(false); setDone(false);
    setStatus({});
    setOrder(cards.map((_, i) => i));
  }

  const cardStatus = status[current] ?? "unknown";

  return (
    <section className="mx-auto mt-8 max-w-3xl rounded-lg border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm sm:p-5">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase tracking-wide text-indigo-600">
            Flashcard — {mcTitolo}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {cards.length} card · {known} già note · {pct}% completato
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={shuffle}
            className="rounded-full border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
          >
            Rimescola
          </button>
          <button
            onClick={restart}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
          >
            Ricomincia
          </button>
        </div>
      </div>

      {/* Barra progresso */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${((index + 1) / cards.length) * 100}%` }}
        />
      </div>

      {done ? (
        /* Schermata risultati */
        <div className="py-6 text-center">
          <p className="text-xl font-black text-slate-800">
            {known} / {cards.length} card già note!
          </p>
          <div className="mx-auto mt-3 h-3 w-48 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-rose-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-500">{pct}%</p>
          {pct < 100 && (
            <p className="mt-3 text-sm text-slate-500">
              {cards.length - known} card da ripassare — riprova!
            </p>
          )}
          <button
            onClick={restart}
            className="mt-5 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
          >
            Ripeti le flashcard
          </button>
        </div>
      ) : (
        <>
          {/* Card con flip */}
          <div className="flashcard-scene mb-3 cursor-pointer" onClick={flip}>
            <div className={`flashcard-card ${flipped ? "is-flipped" : ""}`}>
              {/* Fronte */}
              <div className="flashcard-face flashcard-front">
                {card.tag && (
                  <span className="mb-2 inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                    {card.tag}
                  </span>
                )}
                <p className="mb-2 text-xs font-semibold text-indigo-400">Termine / Domanda</p>
                <p className="text-lg font-black leading-snug text-slate-900 sm:text-xl">
                  {card.front}
                </p>
                <p className="mt-3 text-xs text-slate-400">Tocca per vedere la risposta</p>
              </div>
              {/* Retro */}
              <div className="flashcard-face flashcard-back">
                <p className="mb-2 text-xs font-semibold text-emerald-300">Definizione / Risposta</p>
                <p className="text-sm leading-6 text-slate-100 sm:text-base">
                  {card.back}
                </p>
              </div>
            </div>
          </div>

          {/* Contatore */}
          <p className="mb-3 text-center text-xs text-slate-400">
            {index + 1} di {cards.length}
          </p>

          {/* Azioni */}
          {flipped ? (
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => mark("review")}
                className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100"
              >
                Da ripassare
              </button>
              <button
                onClick={() => mark("known")}
                className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
              >
                ✓ La so
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={prev}
                disabled={index === 0}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-30"
              >
                Precedente
              </button>
              <button
                onClick={flip}
                className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Gira la card
              </button>
              <button
                onClick={next}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                Salta
              </button>
            </div>
          )}

          {/* Stato card corrente */}
          {cardStatus !== "unknown" && (
            <p className={`mt-3 text-center text-xs font-semibold ${cardStatus === "known" ? "text-emerald-600" : "text-rose-500"}`}>
              {cardStatus === "known" ? "Segnata come nota" : "Segnata per ripasso"}
            </p>
          )}
        </>
      )}

      {/* CSS 3D flip — injected inline per evitare import esterni */}
      <style>{`
        .flashcard-scene {
          perspective: 900px;
          height: 190px;
          max-width: 620px;
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 640px) { .flashcard-scene { height: 180px; } }
        .flashcard-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
        }
        .flashcard-card.is-flipped { transform: rotateY(180deg); }
        .flashcard-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 0.85rem;
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .flashcard-front {
          background: white;
          border: 1px solid #c7d2fe;
          box-shadow: 0 2px 16px 0 rgba(99,102,241,0.08);
        }
        .flashcard-back {
          background: #1e1b4b;
          border: 1px solid #3730a3;
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
}
