import Link from "next/link";
import { TAVOLE_ASS_PRONTE, hrefTavolaAss } from "@/lib/geogebra-assonometrie";

/** Richiamo alle tavole guidate di assonometria, nella scheda SPERIMENTA di MC-DIS-2-02 e di MC-DIS-3-01. */
export default function AssonometrieCallout({ className = "" }: { className?: string }) {
  return (
    <aside className={`rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950 ${className}`}>
      <p className="text-xs font-black uppercase tracking-widest text-blue-700">Tavole guidate · assonometro + GeoGebra</p>
      <p className="mt-1 text-lg font-black tracking-tight text-slate-950">Assonometrie passo per passo</p>
      <p className="mt-1">
        Prima guardi il solido nell’assonometro, con gli assi, le misure e le tre viste. Poi costruisci il disegno sul
        foglio, un passo alla volta.
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-bold">
        {TAVOLE_ASS_PRONTE.map((t) => (
          <li key={t.slug}>
            <Link href={hrefTavolaAss(t)} className="text-blue-800 underline underline-offset-4">
              {t.numero}. {t.titolo}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/assonometrie" className="mt-3 inline-block font-black text-blue-800 underline underline-offset-4">
        Apri tutte le tavole e l’assonometro →
      </Link>
    </aside>
  );
}
