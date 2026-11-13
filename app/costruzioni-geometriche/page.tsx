import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import {
  CATEGORIE_COSTRUZIONI,
  COSTRUZIONI_GEOGEBRA,
  MC_COSTRUZIONI,
  hrefCostruzione,
} from "@/lib/geogebra-costruzioni";

export const metadata: Metadata = {
  title: "Costruzioni geometriche — Book ProfTecnologIA",
  description:
    "Tutte le costruzioni geometriche con righello e compasso, animate passo per passo con GeoGebra: perpendicolari e parallele, poligoni, triangoli, ovali e spirali.",
};

const LEGENDA = [
  { colore: "#D97706", nome: "Arancione", testo: "i segni del compasso: archi e circonferenze" },
  { colore: "#0E7490", nome: "Azzurro", testo: "le linee di costruzione, leggere" },
  { colore: "#111827", nome: "Nero", testo: "il risultato, da ripassare con tratto deciso" },
];

export default function CostruzioniGeometrichePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb
        items={[
          { label: "Book ProfTecnologIA", href: "/" },
          { label: MC_COSTRUZIONI, href: `/mc/${MC_COSTRUZIONI}`, emoji: "📐", color: "#1A3A7A" },
          { label: "Costruzioni geometriche", color: "#1A3A7A" },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-800">
            Disegno tecnico · Classe 1ª · {MC_COSTRUZIONI}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Costruzioni geometriche</h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            {COSTRUZIONI_GEOGEBRA.length} tavole animate con righello e compasso. Ogni tavola mostra la costruzione un
            passaggio alla volta, spiega perché funziona e ti propone una prova da fare sul foglio.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
            <p className="font-black">Come si usa una tavola</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Guarda l’animazione intera una volta, senza disegnare.</li>
              <li>Riparti dall’inizio e fermati dopo ogni passo: ripetilo sul tuo foglio.</li>
              <li>Alla fine fai il controllo indicato in «Prova tu».</li>
            </ol>
            <p className="mt-2">
              Alla LIM: il link «LIM» apre la tavola a schermo intero, con testo e pulsanti grandi.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
            <p className="font-black text-slate-950">I colori delle tavole</p>
            <ul className="mt-2 space-y-1.5">
              {LEGENDA.map((l) => (
                <li key={l.nome} className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-1.5 w-10 shrink-0 rounded-full" style={{ backgroundColor: l.colore }} />
                  <span>
                    <strong className="text-slate-950">{l.nome}:</strong> {l.testo}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2">Ti servono: matita, righello, due squadre e compasso.</p>
          </div>
        </div>

        <nav aria-label="Gruppi di costruzioni" className="mt-6 flex flex-wrap gap-2">
          {CATEGORIE_COSTRUZIONI.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-slate-300 bg-white px-3.5 py-2 text-sm font-bold text-slate-800 hover:border-blue-700 hover:text-blue-800"
            >
              {cat.titolo}{" "}
              <span className="text-slate-500">· {COSTRUZIONI_GEOGEBRA.filter((c) => c.categoria === cat.id).length}</span>
            </a>
          ))}
        </nav>

        {CATEGORIE_COSTRUZIONI.map((cat) => {
          const tavole = COSTRUZIONI_GEOGEBRA.filter((c) => c.categoria === cat.id);
          return (
            <section key={cat.id} id={cat.id} aria-labelledby={`titolo-${cat.id}`} className="mt-10 scroll-mt-28">
              <h2 id={`titolo-${cat.id}`} className="text-2xl font-black tracking-tight text-slate-950">
                {cat.titolo}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-700">{cat.descrizione}</p>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tavole.map((c) => {
                  const lim = c.href
                    ? null
                    : `${basePath}/embeds/geogebra/costruzioni-base/index.html?activity=${c.slug}&lim=1`;
                  return (
                    <li
                      key={c.slug}
                      className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      {/* L'immagine è un secondo accesso alla stessa pagina: il link con il nome è sotto */}
                      <Link href={hrefCostruzione(c)} tabIndex={-1} aria-hidden="true" className="block border-b border-slate-100 bg-white">
                        <img
                          src={`${basePath}/assets/costruzioni/${c.slug}.webp`}
                          alt=""
                          width={640}
                          height={394}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[640/394] w-full object-contain"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-900">
                          Costruzione {c.numero}
                        </p>
                        <h3 className="text-lg font-black leading-snug tracking-tight text-slate-950">{c.titolo}</h3>
                        <p className="text-sm leading-6 text-slate-700">{c.descrizione}</p>
                        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm font-bold">
                          <Link href={hrefCostruzione(c)} className="text-blue-800 underline underline-offset-4">
                            Apri la tavola →
                          </Link>
                          {lim && (
                            <a href={lim} target="_blank" rel="noopener noreferrer" className="text-slate-600 underline underline-offset-4">
                              LIM ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          <p className="font-black">⚠️ Sicurezza</p>
          <p className="mt-1">
            Il compasso ha una punta metallica. Non rivolgerla verso i compagni, non camminare con il compasso in mano e,
            quando non lo usi, chiudilo o appoggialo sul banco.
          </p>
        </div>

        <p className="mt-6 text-sm font-bold">
          <Link href={`/mc/${MC_COSTRUZIONI}`} className="text-blue-800 underline underline-offset-4">
            Torna alla micro-competenza {MC_COSTRUZIONI} →
          </Link>
        </p>
      </div>
    </div>
  );
}
