import Link from "next/link";
import { TAVOLE_PO_PRONTE, hrefTavolaPO } from "@/lib/geogebra-proiezioni";

/** Richiamo alle tavole guidate di proiezioni ortogonali, nella scheda SPERIMENTA di MC-DIS-2-01. */
export default function ProiezioniCallout({ className = "" }: { className?: string }) {
  return (
    <aside className={`rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950 ${className}`}>
      <p className="text-xs font-black uppercase tracking-widest text-blue-700">Tavole guidate · proiettore + GeoGebra</p>
      <p className="mt-1 text-lg font-black tracking-tight text-slate-950">Proiezioni ortogonali passo per passo</p>
      <p className="mt-1">
        Costruisci le tre viste sul foglio, un passo alla volta. Nelle tavole dei solidi prima ruoti il solido nel
        proiettore.
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-bold">
        {TAVOLE_PO_PRONTE.map((t) => (
          <li key={t.slug}>
            <Link href={hrefTavolaPO(t)} className="text-blue-800 underline underline-offset-4">
              {t.numero}. {t.titolo}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/proiezioni-ortogonali" className="mt-3 inline-block font-black text-blue-800 underline underline-offset-4">
        Apri tutte le tavole →
      </Link>
    </aside>
  );
}
