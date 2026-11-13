import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import {
  APPROFONDIMENTI_PO,
  MC_PROIEZIONI,
  TAVOLE_PO,
  TAVOLE_PO_PRONTE,
  costruzioneSrc,
  hrefTavolaPO,
  proiettoreSrc,
} from "@/lib/geogebra-proiezioni";

export const metadata: Metadata = {
  title: "Proiezioni ortogonali — Book ProfTecnologIA",
  description:
    "Tavole guidate di proiezioni ortogonali: il solido da ruotare nel proiettore e la costruzione delle tre viste passo per passo con GeoGebra, dal punto ai solidi.",
};

const COME_SI_USA = [
  { nome: "Guarda", testo: "Se la tavola ha il proiettore, ruota il solido e osserva che figura diventa da sopra, di fronte e di fianco." },
  { nome: "Costruisci", testo: "Segui la costruzione un passo alla volta e ripeti ogni passo sul tuo foglio." },
  { nome: "Controlla", testo: "Fai la prova con misure nuove e controlla il tuo foglio con l’elenco «Controlla da solo». Se c’è il proiettore, confronta anche le tre viste." },
];

const LEGENDA = [
  { colore: "#93C5FD", nome: "Azzurro", testo: "il piano verticale (PV): la vista di fronte" },
  { colore: "#FDE047", nome: "Giallo", testo: "il piano orizzontale (PO): la vista dall’alto" },
  { colore: "#F9A8D4", nome: "Rosa", testo: "il piano laterale (PL): la vista di fianco" },
  { colore: "#64748B", nome: "Grigio sottile", testo: "le linee di proiezione, che collegano le viste" },
  { colore: "#1E40AF", nome: "Blu", testo: "le linee della figura mentre la costruisci" },
  { colore: "#EF4444", nome: "Rosso", testo: "i punti con il nome" },
  { colore: "#D97706", nome: "Arancione", testo: "gli archi di compasso e le misure" },
  { colore: "#111827", nome: "Nero", testo: "gli spigoli da ripassare; tratteggiati se sono nascosti" },
];

export default function ProiezioniOrtogonaliPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb
        items={[
          { label: "Book ProfTecnologIA", href: "/" },
          { label: MC_PROIEZIONI, href: `/mc/${MC_PROIEZIONI}`, emoji: "📐", color: "#1A3A7A" },
          { label: "Proiezioni ortogonali", color: "#1A3A7A" },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-800">
            Disegno tecnico · Classe 2ª · {MC_PROIEZIONI}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Proiezioni ortogonali</h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Tavole guidate per passare da un oggetto alle sue tre viste. Nelle tavole dei solidi prima guardi il solido
            in tre dimensioni nel proiettore. In tutte costruisci il foglio un passo alla volta e alla fine controlli il
            tuo disegno.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
            <p className="font-black">Come si usa una tavola</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              {COME_SI_USA.map((p) => (
                <li key={p.nome}>
                  <strong>{p.nome}.</strong> {p.testo}
                </li>
              ))}
            </ol>
            <p className="mt-2">
              Alla LIM: i link «LIM» aprono proiettore e costruzione a schermo intero, con testo e pulsanti grandi.
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

        <section
          aria-labelledby="titolo-proiettore"
          className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-900 bg-slate-900 p-5 text-slate-100"
        >
          <div className="max-w-2xl">
            <h2 id="titolo-proiettore" className="text-xl font-black tracking-tight text-white">
              Il proiettore ortogonale
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-200">
              Quattordici solidi da ruotare con il dito o con il mouse. Tre lastre disegnano dal vivo la vista di
              fronte (prospetto), la vista dall’alto (pianta) e la vista di fianco (vista laterale), con gli spigoli
              nascosti tratteggiati. Puoi usarlo anche da solo, senza una tavola.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-black">
            <a
              href={proiettoreSrc()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white px-4 py-2.5 text-slate-950 hover:bg-amber-200"
            >
              Apri il proiettore ↗
            </a>
            <a
              href={proiettoreSrc({ modo: "lim" })}
              target="_blank"
              rel="noopener noreferrer"
              className="self-center text-white underline underline-offset-4"
            >
              LIM ↗
            </a>
          </div>
        </section>

        <section id="fondamentali" aria-labelledby="titolo-fondamentali" className="mt-10 scroll-mt-28">
          <h2 id="titolo-fondamentali" className="text-2xl font-black tracking-tight text-slate-950">
            Tavole fondamentali{" "}
            <span className="text-base font-bold text-slate-500">
              · {TAVOLE_PO_PRONTE.length} pronte su {TAVOLE_PO.length}
            </span>
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-700">
            Il percorso per tutti: un solo oggetto alla volta, con la base parallela a uno dei piani. Si comincia dal
            foglio e dal punto e si arriva ai solidi.
          </p>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TAVOLE_PO.map((t) =>
              t.pronta ? (
                <li key={t.slug} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  {/* L'immagine è un secondo accesso alla stessa pagina: il link con il nome è sotto */}
                  <Link href={hrefTavolaPO(t)} tabIndex={-1} aria-hidden="true" className="block border-b border-slate-100 bg-white">
                    <img
                      src={`${basePath}/assets/proiezioni/${t.slug}.webp`}
                      alt=""
                      width={640}
                      height={498}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[640/498] w-full object-contain"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-900">
                      Tavola {t.numero}
                      {t.proiettore ? " · con proiettore" : ""}
                    </p>
                    <h3 className="text-lg font-black leading-snug tracking-tight text-slate-950">{t.titolo}</h3>
                    <p className="text-sm leading-6 text-slate-700">{t.descrizione}</p>
                    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm font-bold">
                      <Link href={hrefTavolaPO(t)} className="text-blue-800 underline underline-offset-4">
                        Apri la tavola →
                      </Link>
                      <a
                        href={costruzioneSrc(t, true)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 underline underline-offset-4"
                      >
                        LIM ↗
                      </a>
                    </div>
                  </div>
                </li>
              ) : (
                <li
                  key={t.slug}
                  className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5"
                >
                  <p className="font-mono text-xs font-black uppercase tracking-widest text-slate-500">
                    Tavola {t.numero} · in preparazione
                  </p>
                  <h3 className="text-lg font-black leading-snug tracking-tight text-slate-700">{t.titolo}</h3>
                  <p className="text-sm leading-6 text-slate-600">{t.descrizione}</p>
                </li>
              ),
            )}
          </ol>
        </section>

        <section id="approfondimenti" aria-labelledby="titolo-approfondimenti" className="mt-10 scroll-mt-28">
          <h2 id="titolo-approfondimenti" className="text-2xl font-black tracking-tight text-slate-950">
            Approfondimenti <span className="text-base font-bold text-slate-500">· in preparazione</span>
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-700">
            Per chi ha finito i fondamentali: solidi ruotati o inclinati, più solidi insieme, pezzi con forme
            composte.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {APPROFONDIMENTI_PO.map((a) => (
              <li key={a.lettera} className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <p className="font-mono text-xs font-black uppercase tracking-widest text-slate-500">Tema {a.lettera}</p>
                <h3 className="mt-1 text-base font-black leading-snug text-slate-700">{a.titolo}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{a.descrizione}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          <p className="font-black">⚠️ Sicurezza</p>
          <p className="mt-1">
            Il compasso ha una punta metallica. Non rivolgerla verso i compagni, non camminare con il compasso in mano e,
            quando non lo usi, chiudilo o appoggialo sul banco.
          </p>
        </div>

        <p className="mt-6 text-sm font-bold">
          <Link href={`/mc/${MC_PROIEZIONI}`} className="text-blue-800 underline underline-offset-4">
            Torna alla micro-competenza {MC_PROIEZIONI} →
          </Link>
        </p>
      </div>
    </div>
  );
}
