"use client";

import { useState } from "react";

interface ProcedureListProps {
  steps: string[];
  titolo?: string;
}

export default function ProcedureList({ steps, titolo }: ProcedureListProps) {
  const [checked, setChecked] = useState<boolean[]>(() => steps.map(() => false));

  function toggle(i: number) {
    setChecked((prev) => prev.map((v, idx) => idx === i ? !v : v));
  }

  const done = checked.filter(Boolean).length;

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50">
      <div className="border-b border-emerald-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔬</span>
          <p className="text-sm font-black text-emerald-800">
            {titolo ?? "Procedura di laboratorio"}
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-600">
          {done}/{steps.length} completati
        </span>
      </div>
      <ol className="divide-y divide-emerald-100">
        {steps.map((step, i) => (
          <li key={i}>
            <button
              onClick={() => toggle(i)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-emerald-100 ${checked[i] ? "opacity-60" : ""}`}
            >
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black transition-colors ${
                checked[i]
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-emerald-300 text-emerald-500"
              }`}>
                {checked[i] ? "✓" : i + 1}
              </span>
              <span className={`text-sm leading-relaxed ${checked[i] ? "line-through text-slate-400" : "text-emerald-900"}`}>
                {step}
              </span>
            </button>
          </li>
        ))}
      </ol>
      {done === steps.length && (
        <div className="bg-emerald-100 px-4 py-3 text-center text-sm font-bold text-emerald-700">
          🎉 Procedura completata!
        </div>
      )}
    </div>
  );
}
