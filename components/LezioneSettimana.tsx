"use client";

// «Lezione della settimana» in home: per ogni classe propone una lezione di teoria e una di
// disegno/coding, seguendo il calendario scolastico (lib/calendario-scolastico.ts).
// Il sito è statico: la settimana corrente si calcola nel browser, dopo il caricamento.

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ANNO_SCOLASTICO, SETTIMANE, SETTIMANE_DI_LEZIONE, etichettaSettimana, indiceSettimana,
} from "@/lib/calendario-scolastico";
import { cx } from "@/lib/ui";

export interface VoceSettimana {
  mc?: string;
  mcTitolo?: string;
  emoji?: string;
  /** «Teoria», «Disegno» o «Coding». */
  tipo: string;
  titolo: string;
  cosa: string;
  link?: { href: string; label: string }[];
}

export type PianoSettimane = Record<number, { teoria: VoceSettimana[]; pratica: VoceSettimana[] }>;

const CLASSI = [1, 2, 3];
const CHIAVE_CLASSE = "tecnologia_app_lezione_classe";

function Scheda({ voce, tono }: { voce: VoceSettimana; tono: "teoria" | "pratica" }) {
  const colori = tono === "teoria"
    ? { bordo: "border-emerald-200", badge: "bg-emerald-700", link: "text-emerald-800", chip: "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-500" }
    : { bordo: "border-blue-200", badge: "bg-blue-700", link: "text-blue-800", chip: "border-blue-200 bg-blue-50 text-blue-900 hover:border-blue-500" };
  return (
    <article className={cx("flex h-full flex-col rounded-2xl border-2 bg-white p-5 shadow-sm sm:p-6", colori.bordo)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cx("rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide text-white", colori.badge)}>
          {voce.tipo}
        </span>
        {voce.mc && <span className="font-mono text-xs font-semibold text-slate-500">{voce.mc}</span>}
      </div>

      {voce.mc && voce.mcTitolo ? (
        <>
          <h3 className="mt-3 text-lg font-black leading-snug text-slate-950 sm:text-xl">
            <Link href={`/mc/${voce.mc}`} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              {voce.emoji} {voce.mcTitolo}
            </Link>
          </h3>
          <p className="mt-2 text-sm font-bold text-slate-800">{voce.titolo}</p>
        </>
      ) : (
        <h3 className="mt-3 text-lg font-black leading-snug text-slate-950 sm:text-xl">{voce.titolo}</h3>
      )}
      <p className="mt-1 text-sm leading-6 text-slate-600">{voce.cosa}</p>

      {voce.link && voce.link.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {voce.link.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={cx("inline-block rounded-full border px-3 py-1.5 text-xs font-semibold", colori.chip)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {voce.mc && (
        <div className="mt-auto pt-4">
          <Link href={`/mc/${voce.mc}`} className={cx("text-sm font-bold underline underline-offset-4", colori.link)}>
            Apri la lezione →
          </Link>
        </div>
      )}
    </article>
  );
}

export default function LezioneSettimana({ piano }: { piano: PianoSettimane }) {
  // null finché il browser non ha calcolato la data: evita differenze con l'HTML generato al build.
  const [oggi, setOggi] = useState<number | null>(null);
  const [indice, setIndice] = useState(0);
  const [classe, setClasse] = useState(1);

  useEffect(() => {
    const i = indiceSettimana(new Date());
    setOggi(i);
    setIndice(Math.min(Math.max(i, 0), SETTIMANE.length - 1));
    try {
      const salvata = Number(localStorage.getItem(CHIAVE_CLASSE));
      if (CLASSI.includes(salvata)) setClasse(salvata);
    } catch {
      // localStorage non disponibile
    }
  }, []);

  function scegliClasse(c: number) {
    setClasse(c);
    try {
      localStorage.setItem(CHIAVE_CLASSE, String(c));
    } catch {
      // localStorage non disponibile
    }
  }

  const settimana = SETTIMANE[indice];
  const fuoriAnno = oggi !== null && (oggi < 0 || oggi >= SETTIMANE.length);
  const eOggi = oggi !== null && !fuoriAnno && indice === oggi;

  // Nelle settimane di pausa si mostra la lezione con cui si riprende.
  const ripresa = SETTIMANE.slice(indice).find((s) => s.numero !== null);
  const numero = settimana.numero ?? ripresa?.numero ?? null;
  const voci = numero ? { teoria: piano[classe].teoria[numero - 1], pratica: piano[classe].pratica[numero - 1] } : null;

  let occhiello = "Lezione della settimana";
  if (oggi !== null) {
    if (fuoriAnno) occhiello = oggi < 0 ? "Si comincia così" : "Anno scolastico concluso";
    else if (eOggi) occhiello = [0, 6].includes(new Date().getDay()) ? "La prossima settimana" : "Questa settimana";
    else occhiello = indice < (oggi ?? 0) ? "Settimana passata" : "Settimana in arrivo";
  }

  return (
    <section aria-labelledby="titolo-lezione-settimana" className="border-b border-slate-200 bg-gradient-to-b from-emerald-50/60 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{occhiello}</p>
            <h2 id="titolo-lezione-settimana" className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              La lezione della settimana
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-600" aria-live="polite">
              {oggi === null ? (
                "Cerco la settimana giusta nel calendario…"
              ) : (
                <>
                  {etichettaSettimana(settimana)}
                  {settimana.numero !== null
                    ? ` · settimana ${settimana.numero} di ${SETTIMANE_DI_LEZIONE}`
                    : ` · ${settimana.motivo}`}
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Scegli la classe" className="flex rounded-full border border-slate-300 bg-white p-1">
              {CLASSI.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={classe === c}
                  onClick={() => scegliClasse(c)}
                  className={cx(
                    "rounded-full px-4 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                    classe === c ? "bg-emerald-700 text-white" : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {c}ª
                </button>
              ))}
            </div>
            <div role="group" aria-label="Cambia settimana" className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIndice((i) => Math.max(0, i - 1))}
                disabled={oggi === null || indice === 0}
                aria-label="Settimana precedente"
                className="h-10 w-10 rounded-full border border-slate-300 bg-white text-lg font-bold text-slate-700 hover:border-slate-500 disabled:opacity-40"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => oggi !== null && setIndice(Math.min(Math.max(oggi, 0), SETTIMANE.length - 1))}
                disabled={oggi === null || eOggi || fuoriAnno}
                className="h-10 rounded-full border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-slate-500 disabled:opacity-40"
              >
                Oggi
              </button>
              <button
                type="button"
                onClick={() => setIndice((i) => Math.min(SETTIMANE.length - 1, i + 1))}
                disabled={oggi === null || indice === SETTIMANE.length - 1}
                aria-label="Settimana successiva"
                className="h-10 w-10 rounded-full border border-slate-300 bg-white text-lg font-bold text-slate-700 hover:border-slate-500 disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {oggi !== null && settimana.numero === null && (
          <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            {ripresa
              ? `${settimana.motivo}: in questa settimana si fa poca scuola o nessuna. Alla ripresa (${etichettaSettimana(ripresa)}) si continua da qui.`
              : `${settimana.motivo}: il programma è finito. È il momento di ripassare e di sistemare tavole e lavori.`}
          </p>
        )}

        <div className={cx("mt-5 grid gap-4 md:grid-cols-2 md:gap-5", (oggi === null || voci) && "min-h-[16rem]")}>
          {oggi !== null && voci ? (
            <>
              <Scheda voce={voci.teoria} tono="teoria" />
              <Scheda voce={voci.pratica} tono="pratica" />
            </>
          ) : (
            oggi === null && (
              <>
                <div className="rounded-2xl border-2 border-emerald-100 bg-white" />
                <div className="rounded-2xl border-2 border-blue-100 bg-white" />
              </>
            )
          )}
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Due ore a settimana: una di teoria e una di disegno o coding. Il ritmo segue il calendario scolastico{" "}
          {ANNO_SCOLASTICO.etichetta} della Regione {ANNO_SCOLASTICO.regione}; è una proposta, ogni classe può andare più piano o più veloce.
        </p>
      </div>
    </section>
  );
}
