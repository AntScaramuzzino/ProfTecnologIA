"use client";

// «Lezione della settimana» in home: per ogni classe propone una lezione di teoria e una di
// disegno/coding, seguendo il calendario scolastico (lib/calendario-scolastico.ts).
// Il sito è statico: la settimana corrente si calcola nel browser, dopo il caricamento.

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ANNO_SCOLASTICO, SETTIMANE, SETTIMANE_DI_LEZIONE, etichettaSettimana, indiceSettimana,
} from "@/lib/calendario-scolastico";
import {
  leggiClassi, risolvi, slotDi, type ClasseDocente, type PianoSettimane, type VoceSettimana,
} from "@/lib/piano-docente";
import { cx } from "@/lib/ui";

const CLASSI = [1, 2, 3];
const CHIAVE_CLASSE = "tecnologia_app_lezione_classe";
const CHIAVE_CLASSE_DOCENTE = "tecnologia_app_lezione_classe_docente";

function Scheda({ voce, tono }: { voce: VoceSettimana; tono: "teoria" | "pratica" }) {
  const colori = tono === "teoria"
    ? { bordo: "border-emerald-200", fascia: "bg-gradient-to-br from-emerald-100 to-white", badge: "bg-emerald-700", link: "text-emerald-800", chip: "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-500" }
    : { bordo: "border-blue-200", fascia: "bg-gradient-to-br from-blue-100 to-white", badge: "bg-blue-700", link: "text-blue-800", chip: "border-blue-200 bg-blue-50 text-blue-900 hover:border-blue-500" };
  return (
    <article className={cx("flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-sm", colori.bordo)}>
      {/* Immagine in testa: anteprime delle tavole, immagine della lezione oppure una fascia colorata */}
      {voce.tavole && voce.tavole.length > 0 ? (
        <div className={cx("grid gap-px border-b border-slate-200 bg-slate-200", voce.tavole.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
          {voce.tavole.map((t) => (
            <Link key={t.href} href={t.href} tabIndex={-1} aria-hidden="true" className="block bg-white">
              <img src={t.src} alt="" width={640} height={394} loading="lazy" decoding="async" className="h-32 w-full object-contain sm:h-36" />
            </Link>
          ))}
        </div>
      ) : voce.immagine && voce.mc ? (
        <Link href={`/mc/${voce.mc}`} tabIndex={-1} aria-hidden="true" className="block border-b border-slate-200 bg-slate-100">
          <img src={voce.immagine} alt="" loading="lazy" decoding="async" className="h-44 w-full object-cover sm:h-52" />
        </Link>
      ) : (
        <div aria-hidden="true" className={cx("flex h-24 items-center justify-center border-b border-slate-200 text-4xl", colori.fascia)}>
          {tono === "teoria" ? "📖" : "📐"}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
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
      {voce.nota && (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
          <span className="font-bold">Nota del docente:</span> {voce.nota}
        </p>
      )}

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
      </div>
    </article>
  );
}

export default function LezioneSettimana({ piano }: { piano: PianoSettimane }) {
  // null finché il browser non ha calcolato la data: evita differenze con l'HTML generato al build.
  const [oggi, setOggi] = useState<number | null>(null);
  const [indice, setIndice] = useState(0);
  const [classe, setClasse] = useState(1);
  // Classi del docente, se su questo dispositivo ne ha salvate (pagina /docenti): sostituiscono 1ª, 2ª, 3ª.
  const [classi, setClassi] = useState<ClasseDocente[]>([]);
  const [idDocente, setIdDocente] = useState<string | null>(null);

  useEffect(() => {
    const i = indiceSettimana(new Date());
    setOggi(i);
    setIndice(Math.min(Math.max(i, 0), SETTIMANE.length - 1));
    const mie = leggiClassi(piano);
    setClassi(mie);
    let idSalvato: string | null = null;
    try {
      const salvata = Number(localStorage.getItem(CHIAVE_CLASSE));
      if (CLASSI.includes(salvata)) setClasse(salvata);
      idSalvato = localStorage.getItem(CHIAVE_CLASSE_DOCENTE);
    } catch {
      // localStorage non disponibile
    }
    setIdDocente(mie.find((c) => c.id === idSalvato)?.id ?? mie[0]?.id ?? null);
  }, [piano]);

  function scegliDocente(id: string) {
    setIdDocente(id);
    try {
      localStorage.setItem(CHIAVE_CLASSE_DOCENTE, id);
    } catch {
      // localStorage non disponibile
    }
  }

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
  const mia = classi.find((c) => c.id === idDocente);
  const anno = mia?.anno ?? classe;
  const slotTeoria = slotDi(mia, piano, anno, "teoria");
  const slotPratica = slotDi(mia, piano, anno, "pratica");
  const schede = classi.length > 0
    ? classi.map((c) => ({ chiave: c.id, nome: c.nome, attiva: c.id === idDocente, scegli: () => scegliDocente(c.id) }))
    : CLASSI.map((c) => ({ chiave: String(c), nome: `${c}ª`, attiva: classe === c, scegli: () => scegliClasse(c) }));
  const voci = numero
    ? {
        teoria: risolvi(piano, anno, "teoria", slotTeoria[numero - 1]),
        pratica: risolvi(piano, anno, "pratica", slotPratica[numero - 1]),
      }
    : null;

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
            <div role="group" aria-label="Scegli la classe" className="flex flex-wrap rounded-3xl border border-slate-300 bg-white p-1">
              {schede.map((c) => (
                <button
                  key={c.chiave}
                  type="button"
                  aria-pressed={c.attiva}
                  onClick={c.scegli}
                  className={cx(
                    "rounded-full px-4 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                    c.attiva ? "bg-emerald-700 text-white" : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {c.nome}
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

        <div className={cx("mt-5 grid gap-4 md:grid-cols-2 md:gap-5", (oggi === null || voci) && "min-h-[24rem]")}>
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
          {ANNO_SCOLASTICO.etichetta} della Regione {ANNO_SCOLASTICO.regione}; {mia ? `qui vedi il piano della tua ${mia.nome}, salvato su questo dispositivo.` : "è una proposta, ogni classe può andare più piano o più veloce."}{" "}
          <Link href="/docenti" className="font-bold text-emerald-800 underline underline-offset-4">
            {mia ? "Modifica il piano →" : "Sei docente? Pianifica il tuo anno →"}
          </Link>
        </p>
      </div>
    </section>
  );
}
