"use client";

import { useState } from "react";
import TavolaAtlanteCard from "@/components/atlante/TavolaAtlanteCard";
import type { TavolaAtlante } from "@/lib/atlante";

const CHIP =
  "min-h-11 shrink-0 rounded-full border px-4 py-1.5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
const CHIP_ON = "border-brand-700 bg-brand-700 text-white";
const CHIP_OFF = "border-slate-300 bg-white text-slate-800 hover:border-brand-600 hover:text-brand-700";

/** Indice delle tavole con filtri per classe e area. Senza JavaScript si vedono tutte. */
export default function AtlanteIndice({
  tavole,
  aree,
}: {
  tavole: TavolaAtlante[];
  /** Codice area → nome, solo le aree che hanno almeno una tavola */
  aree: { codice: string; nome: string }[];
}) {
  const [classe, setClasse] = useState<number | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const visibili = tavole.filter((t) => (classe === null || t.classe === classe) && (area === null || t.area === area));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
        <div role="group" aria-label="Filtra per classe" className="flex flex-wrap gap-2">
          {[null, 1, 2, 3].map((c) => (
            <button
              key={c ?? "tutte"}
              type="button"
              aria-pressed={classe === c}
              onClick={() => setClasse(c)}
              className={`${CHIP} ${classe === c ? CHIP_ON : CHIP_OFF}`}
            >
              {c === null ? "Tutte le classi" : `Classe ${c}ª`}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Filtra per area" className="flex flex-wrap gap-2">
          {[{ codice: null as string | null, nome: "Tutte le aree" }, ...aree].map((a) => (
            <button
              key={a.codice ?? "tutte"}
              type="button"
              aria-pressed={area === a.codice}
              onClick={() => setArea(a.codice)}
              className={`${CHIP} ${area === a.codice ? CHIP_ON : CHIP_OFF}`}
            >
              {a.nome}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600" aria-live="polite">
        {visibili.length === 1 ? "1 tavola" : `${visibili.length} tavole`}
      </p>

      {visibili.length > 0 ? (
        <ul className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibili.map((t) => (
            <li key={t.slug}>
              <TavolaAtlanteCard tavola={t} headingLevel={2} etichetta={`${t.codice} · Classe ${t.classe}ª`} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-base text-slate-700">
          Per questa combinazione non c&apos;è ancora una tavola. L&apos;Atlante cresce un oggetto alla volta.
        </p>
      )}
    </div>
  );
}
