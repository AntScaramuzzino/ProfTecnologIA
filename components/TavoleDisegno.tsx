import Link from "next/link";
import {
  CATEGORIE_COSTRUZIONI,
  COSTRUZIONI_GEOGEBRA,
  MC_COSTRUZIONI,
  hrefCostruzione,
} from "@/lib/geogebra-costruzioni";
import {
  MC_PROIEZIONI,
  TAVOLE_PO,
  TAVOLE_PO_PRONTE,
  hrefTavolaPO,
  proiettoreSrc,
} from "@/lib/geogebra-proiezioni";

/** Quante tavole guidate ha l'area Disegno Tecnico (per l'intestazione della pagina dell'area). */
export const NUMERO_TAVOLE_DISEGNO = COSTRUZIONI_GEOGEBRA.length + TAVOLE_PO_PRONTE.length;

type Tessera = { href: string; numero: number; titolo: string; immagine: string; altezza: number };

function Tessere({ tavole, etichetta }: { tavole: Tessera[]; etichetta: string }) {
  return (
    <ul aria-label={etichetta} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {tavole.map((t) => (
        <li key={t.href}>
          <Link
            href={t.href}
            className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-blue-700"
          >
            <img
              src={t.immagine}
              alt=""
              width={640}
              height={t.altezza}
              loading="lazy"
              decoding="async"
              className="w-full border-b border-slate-100 bg-white object-contain"
              style={{ aspectRatio: `640 / ${t.altezza}` }}
            />
            <span className="flex gap-2 p-3 text-sm font-bold leading-snug text-slate-900">
              <span className="font-mono text-xs font-black leading-5 text-blue-800">{t.numero}</span>
              <span>{t.titolo}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Le tavole GeoGebra dell'area Disegno Tecnico, dentro la pagina /area/DIS:
 * sotto le MC di prima le costruzioni geometriche, sotto quelle di seconda le proiezioni ortogonali.
 * Legge i due registri (lib/geogebra-costruzioni.ts e lib/geogebra-proiezioni.ts): una tavola nuova compare da sola.
 */
export default function TavoleDisegno({ anno }: { anno: number }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (anno === 1) {
    return (
      <div id="tavole-costruzioni" className="mt-8 scroll-mt-28 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-800">
              Tavole guidate · {MC_COSTRUZIONI}
            </p>
            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
              Costruzioni geometriche{" "}
              <span className="text-base font-bold text-slate-600">· {COSTRUZIONI_GEOGEBRA.length} tavole</span>
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              Righello e compasso, un passaggio alla volta: ogni tavola è un’animazione GeoGebra con la spiegazione e
              una prova da fare sul foglio.
            </p>
          </div>
          <Link href="/costruzioni-geometriche" className="text-sm font-black text-blue-800 underline underline-offset-4">
            Pagina delle costruzioni →
          </Link>
        </div>
        {CATEGORIE_COSTRUZIONI.map((cat) => {
          const tavole = COSTRUZIONI_GEOGEBRA.filter((c) => c.categoria === cat.id);
          if (tavole.length === 0) return null;
          return (
            <div key={cat.id} className="mt-6">
              <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">
                {cat.titolo} <span className="font-bold text-slate-500">· {tavole.length}</span>
              </h4>
              <Tessere
                etichetta={cat.titolo}
                tavole={tavole.map((c) => ({
                  href: hrefCostruzione(c),
                  numero: c.numero,
                  titolo: c.titolo,
                  immagine: `${basePath}/assets/costruzioni/${c.slug}.webp`,
                  altezza: 394,
                }))}
              />
            </div>
          );
        })}
      </div>
    );
  }

  if (anno === 2) {
    const inPreparazione = TAVOLE_PO.length - TAVOLE_PO_PRONTE.length;
    return (
      <div id="tavole-proiezioni" className="mt-8 scroll-mt-28 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-800">
              Tavole guidate · {MC_PROIEZIONI}
            </p>
            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
              Proiezioni ortogonali{" "}
              <span className="text-base font-bold text-slate-600">· {TAVOLE_PO_PRONTE.length} tavole</span>
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              Il solido da ruotare nel proiettore e la costruzione delle tre viste, un passo alla volta.
              {inPreparazione > 0 ? ` Altre ${inPreparazione} tavole sono in preparazione.` : ""}
            </p>
          </div>
          <Link href="/proiezioni-ortogonali" className="text-sm font-black text-blue-800 underline underline-offset-4">
            Pagina delle proiezioni →
          </Link>
        </div>
        <div className="mt-6">
          <Tessere
            etichetta="Tavole di proiezioni ortogonali"
            tavole={TAVOLE_PO_PRONTE.map((t) => ({
              href: hrefTavolaPO(t),
              numero: t.numero,
              titolo: t.titolo,
              immagine: `${basePath}/assets/proiezioni/${t.slug}.webp`,
              altezza: 498,
            }))}
          />
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-700">
          <strong className="text-slate-950">Il proiettore ortogonale</strong> si può usare anche da solo: quattordici
          solidi da ruotare, con le tre viste che cambiano dal vivo.{" "}
          <a
            href={proiettoreSrc()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-black text-blue-800 underline underline-offset-4"
          >
            Apri il proiettore ↗
          </a>
        </p>
      </div>
    );
  }

  return null;
}
