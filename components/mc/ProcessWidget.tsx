"use client";

import { useState } from "react";

export interface ProcessStep {
  numero: number;
  titolo: string;
  attore: string;
  domanda?: string;
  impatto?: string;
}

export interface ProcessWidgetProps {
  titolo: string;
  steps: ProcessStep[];
  areaHex?: string;
}

export default function ProcessWidget({ titolo, steps, areaHex }: ProcessWidgetProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [visited, setVisited] = useState<Set<number>>(new Set());

  const accent = areaHex ?? "#2563eb";

  function handleStep(numero: number) {
    if (activeStep === numero) {
      setActiveStep(null);
    } else {
      setActiveStep(numero);
      setVisited((prev) => new Set(prev).add(numero));
    }
  }

  const tuttiVisitati = visited.size === steps.length;

  return (
    <div className="overflow-hidden rounded-xl border border-blue-200 bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 bg-blue-50 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="text-base">🔄</span>
          <span className="text-sm font-semibold text-blue-900">{titolo}</span>
        </div>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
          {visited.size}/{steps.length} esplorat{visited.size === 1 ? "o" : "i"}
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Istruzione */}
        <p className="text-sm text-slate-500 italic">
          Clicca su ogni fase per scoprire chi la gestisce e su cosa puoi riflettere.
        </p>

        {/* Steps — griglia orizzontale su sm+, colonna su mobile */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
          {steps.map((step, idx) => {
            const isActive = activeStep === step.numero;
            const isVisited = visited.has(step.numero);

            return (
              <div key={step.numero} className="flex sm:flex-col items-center gap-1 sm:gap-0 sm:items-stretch">
                {/* Step button */}
                <button
                  onClick={() => handleStep(step.numero)}
                  className={`flex items-center sm:flex-col gap-2 sm:gap-1.5 rounded-lg border px-3 py-2.5 text-left sm:text-center transition-all sm:min-w-[90px] sm:max-w-[110px] ${
                    isActive
                      ? "border-blue-400 bg-blue-50 shadow-sm"
                      : isVisited
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  style={isActive ? { borderColor: accent } : undefined}
                >
                  {/* Numero */}
                  <span
                    className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-black ${
                      isActive
                        ? "text-white"
                        : isVisited
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                    style={isActive ? { backgroundColor: accent } : undefined}
                  >
                    {isVisited && !isActive ? "✓" : step.numero}
                  </span>
                  {/* Titolo */}
                  <span
                    className={`text-sm font-bold leading-tight ${
                      isActive ? "text-blue-900" : isVisited ? "text-emerald-800" : "text-slate-700"
                    }`}
                  >
                    {step.titolo}
                  </span>
                </button>

                {/* Freccia connettore — solo tra step, non dopo l'ultimo */}
                {idx < steps.length - 1 && (
                  <span className="text-slate-300 text-sm font-black sm:self-center sm:mt-1 flex-shrink-0">
                    <span className="hidden sm:inline">→</span>
                    <span className="sm:hidden">↓</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Dettaglio step attivo */}
        {activeStep !== null && (() => {
          const step = steps.find((s) => s.numero === activeStep);
          if (!step) return null;
          return (
            <div
              className="rounded-lg border-l-4 bg-slate-50 p-4 space-y-2 transition-all"
              style={{ borderLeftColor: accent }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-black text-white"
                  style={{ backgroundColor: accent }}
                >
                  {step.numero}
                </span>
                <span className="font-black text-sm text-slate-900">{step.titolo}</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sm font-semibold text-slate-400 w-16 flex-shrink-0 mt-0.5">Chi:</span>
                <span className="text-sm font-semibold text-slate-700">{step.attore}</span>
              </div>

              {step.impatto && (
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold text-slate-400 w-16 flex-shrink-0 mt-0.5">Impatto:</span>
                  <span className="text-sm text-slate-600">{step.impatto}</span>
                </div>
              )}

              {step.domanda && (
                <div className="mt-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2">
                  <p className="text-sm font-black text-yellow-700 mb-0.5">Domanda riflessiva</p>
                  <p className="text-sm italic text-yellow-900">{step.domanda}</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* Completamento */}
        {tuttiVisitati && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center">
            <p className="text-sm font-bold text-blue-800">
              ✅ Hai esplorato tutte le fasi del ciclo tecnologico.
            </p>
            <p className="mt-1 text-sm text-blue-600">
              Ora prova a compilare il passaporto tecnologico con un oggetto reale.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
