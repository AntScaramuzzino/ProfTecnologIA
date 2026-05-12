"use client";

import { useState } from "react";

export interface ChecklistWidgetProps {
  titolo: string;
  istruzione?: string;
  voci: string[];
  areaHex?: string;
}

export default function ChecklistWidget({ titolo, istruzione, voci, areaHex }: ChecklistWidgetProps) {
  const [checked, setChecked] = useState<boolean[]>(() => new Array(voci.length).fill(false));

  const completate = checked.filter(Boolean).length;
  const tutteCompletate = completate === voci.length;
  const pct = voci.length > 0 ? Math.round((completate / voci.length) * 100) : 0;

  const accent = areaHex ?? "#059669"; // emerald-600 fallback

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  function reset() {
    setChecked(new Array(voci.length).fill(false));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-emerald-200 bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 bg-emerald-50 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="text-base">☑️</span>
          <span className="text-sm font-semibold text-emerald-900">{titolo}</span>
        </div>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
          {completate}/{voci.length} completat{completate === 1 ? "a" : "e"}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Istruzione */}
        {istruzione && (
          <p className="text-sm leading-6 text-slate-600 italic">{istruzione}</p>
        )}

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                backgroundColor: tutteCompletate ? "#10b981" : accent,
              }}
            />
          </div>
          <span className="text-xs font-bold text-slate-500 w-8 text-right">{pct}%</span>
        </div>

        {/* Voci */}
        <ul className="space-y-2">
          {voci.map((voce, i) => (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                className={`w-full flex items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                  checked[i]
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                    checked[i]
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {checked[i] && (
                    <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className={checked[i] ? "line-through opacity-70" : ""}>{voce}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Completamento */}
        {tutteCompletate && (
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-center">
            <p className="text-sm font-bold text-emerald-800">
              🎉 Ottimo! Hai completato tutte le voci del passaporto tecnologico.
            </p>
            <p className="mt-1 text-xs text-emerald-600">
              Ora sei pronto per il compito di realtà.
            </p>
          </div>
        )}

        {/* Reset */}
        {completate > 0 && (
          <div className="flex justify-end">
            <button
              onClick={reset}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline"
            >
              Ricomincia da capo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
