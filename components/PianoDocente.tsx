"use client";

// Pagina /docenti: il piano dell'anno settimana per settimana, per ciascuna classe del docente (fino a nove).
// Ogni classe parte dalla proposta del libro per il suo anno (lib/lezione-settimanale.ts); le modifiche
// restano nel browser (lib/piano-docente.ts) e la home le usa per la «Lezione della settimana».

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ANNO_SCOLASTICO, SETTIMANE, SETTIMANE_DI_LEZIONE, etichettaSettimana, indiceSettimana,
} from "@/lib/calendario-scolastico";
import {
  BINARI, MAX_CLASSI, MAX_NOME_CLASSE, MAX_NOTA, MAX_TITOLO, NOME_BINARIO, anticipa, fuoriCalendario, haAppunti, leggiClassi, nuovoId,
  personalizzato, rimanda, ripulisciClassi, risolvi, salvaClassi, slotDi,
  type Binario, type ClasseDocente, type PianoSettimane, type Slot, type VoceSettimana,
} from "@/lib/piano-docente";
import { cx } from "@/lib/ui";

const ANNI = [1, 2, 3];
const CHIAVE_CLASSE_DOCENTE = "tecnologia_app_lezione_classe_docente";

function etichettaVoce(v: VoceSettimana): string {
  return v.mcTitolo ? `${v.mcTitolo} — ${v.titolo}` : v.titolo;
}

const BOTTONE =
  "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-40";
const CAMPO = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";
const SI = "rounded-full bg-red-700 px-3 py-1 font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400";
const NO = "rounded-full border border-red-300 bg-white px-3 py-1 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400";

export default function PianoDocente({ proposta }: { proposta: PianoSettimane }) {
  const [pronto, setPronto] = useState(false);
  const [classi, setClassi] = useState<ClasseDocente[]>([]);
  const [idSel, setIdSel] = useState<string | null>(null);
  /** Anno mostrato quando il docente non ha ancora classi: si sfoglia la proposta. */
  const [annoSfoglia, setAnnoSfoglia] = useState(1);
  const [nuovoAnno, setNuovoAnno] = useState(1);
  const [nuovaSezione, setNuovaSezione] = useState("");
  const [oggi, setOggi] = useState(-1);
  /** Editor aperto: «numeroSettimana-binario». */
  const [aperto, setAperto] = useState<string | null>(null);
  const [conferma, setConferma] = useState<"ripristina" | "elimina" | null>(null);
  /** Classe da cui copiare il piano, in attesa di conferma. */
  const [copiaIn, setCopiaIn] = useState<string | null>(null);
  /** Classi lette da un file, in attesa di conferma perché sostituiscono quelle presenti. */
  const [daImportare, setDaImportare] = useState<ClasseDocente[] | null>(null);
  const [avviso, setAvviso] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mie = leggiClassi(proposta);
    setClassi(mie);
    let idSalvato: string | null = null;
    try {
      idSalvato = localStorage.getItem(CHIAVE_CLASSE_DOCENTE);
    } catch {
      // localStorage non disponibile
    }
    setIdSel(mie.find((c) => c.id === idSalvato)?.id ?? mie[0]?.id ?? null);
    setOggi(indiceSettimana(new Date()));
    setPronto(true);
  }, [proposta]);

  const mia = classi.find((c) => c.id === idSel);
  const anno = mia?.anno ?? annoSfoglia;
  const modificabile = !!mia;

  function aggiorna(nuove: ClasseDocente[]) {
    setClassi(nuove);
    setAvviso(salvaClassi(nuove) ? "" : "Non riesco a salvare su questo browser: esporta il piano in un file per non perderlo.");
  }

  function scegli(id: string | null) {
    setIdSel(id);
    setAperto(null);
    setConferma(null);
    setCopiaIn(null);
    try {
      if (id) localStorage.setItem(CHIAVE_CLASSE_DOCENTE, id);
    } catch {
      // localStorage non disponibile
    }
  }

  function aggiungi() {
    if (classi.length >= MAX_CLASSI) return;
    const sezione = nuovaSezione.trim().toUpperCase();
    const nuova: ClasseDocente = { id: nuovoId(), nome: sezione ? `${nuovoAnno}${sezione}` : `${nuovoAnno}ª`, anno: nuovoAnno };
    aggiorna([...classi, nuova]);
    setNuovaSezione("");
    scegli(nuova.id);
  }

  function cambiaMia(modifica: (c: ClasseDocente) => ClasseDocente) {
    if (!mia) return;
    aggiorna(classi.map((c) => (c.id === mia.id ? modifica(c) : c)));
  }

  function scriviSlot(binario: Binario, slots: Slot[]) {
    cambiaMia((c) => {
      const nuova = { ...c };
      if (personalizzato(slots)) nuova[binario] = slots;
      else delete nuova[binario];
      return nuova;
    });
  }

  function cambiaSlot(binario: Binario, i: number, modifica: Partial<Slot>) {
    const attuali = slotDi(mia, proposta, anno, binario);
    // Se la lezione scelta è già in un'altra settimana, le due settimane si scambiano la lezione.
    const scambio =
      typeof modifica.base === "number" && modifica.base !== attuali[i].base
        ? attuali.findIndex((s, j) => j !== i && s.base === modifica.base)
        : -1;
    const nuovi = attuali.map((s, j) => {
      if (j === scambio) {
        const altro: Slot = { ...s, base: attuali[i].base };
        if (altro.base === null && attuali[i].titolo) altro.titolo = attuali[i].titolo;
        return altro;
      }
      if (j !== i) return s;
      const nuovo: Slot = { ...s, ...modifica };
      if (!nuovo.nota) delete nuovo.nota;
      if (!nuovo.fatto) delete nuovo.fatto;
      if (!nuovo.titolo || nuovo.base !== null) delete nuovo.titolo;
      return nuovo;
    });
    scriviSlot(binario, nuovi);
  }

  function ripristina() {
    cambiaMia((c) => ({ id: c.id, nome: c.nome, anno: c.anno }));
    setConferma(null);
    setAperto(null);
  }

  function elimina() {
    if (!mia) return;
    const rimaste = classi.filter((c) => c.id !== mia.id);
    aggiorna(rimaste);
    scegli(rimaste[0]?.id ?? null);
  }

  /** Copia l'ordine delle lezioni e le note da un'altra classe dello stesso anno; i «fatta» di questa classe restano. */
  function copiaDa(id: string) {
    const origine = classi.find((c) => c.id === id);
    if (!origine || !mia) return;
    cambiaMia((c) => {
      const nuova: ClasseDocente = { id: c.id, nome: c.nome, anno: c.anno };
      for (const b of BINARI) {
        const copiati = slotDi(origine, proposta, c.anno, b).map((s, i) => {
          const { fatto: _fatto, ...resto } = s;
          return c[b]?.[i]?.fatto ? { ...resto, fatto: true } : resto;
        });
        if (personalizzato(copiati)) nuova[b] = copiati;
      }
      return nuova;
    });
    setCopiaIn(null);
    setAperto(null);
  }

  function esporta() {
    const blob = new Blob([JSON.stringify({ annoScolastico: ANNO_SCOLASTICO.etichetta, classi }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `piano-tecnologia-${ANNO_SCOLASTICO.etichetta.replace("/", "-")}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function confermaImporta(pulite: ClasseDocente[]) {
    aggiorna(pulite);
    scegli(pulite[0].id);
    setDaImportare(null);
  }

  async function importa(file: File | undefined) {
    if (!file) return;
    try {
      const dati = JSON.parse(await file.text());
      const pulite = ripulisciClassi(dati?.classi, proposta);
      if (pulite.length === 0) {
        setAvviso("Nel file non ho trovato classi valide per questo anno scolastico.");
        return;
      }
      if (classi.length > 0) setDaImportare(pulite);
      else confermaImporta(pulite);
    } catch {
      setAvviso("Non riesco a leggere il file: scegli un piano esportato da questa pagina.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const slots: Record<Binario, Slot[]> = {
    teoria: slotDi(mia, proposta, anno, "teoria"),
    pratica: slotDi(mia, proposta, anno, "pratica"),
  };
  const modificato = BINARI.some((b) => personalizzato(slots[b]));
  const esclusi = BINARI.flatMap((b) => fuoriCalendario(slots[b]).map((i) => `${NOME_BINARIO[b]}: ${etichettaVoce(proposta[anno][b][i])}`));
  const sorelle = mia ? classi.filter((c) => c.id !== mia.id && c.anno === mia.anno) : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="max-w-3xl">
        <p className="font-mono text-xs font-black uppercase tracking-widest text-brand-800">
          Per i docenti · anno scolastico {ANNO_SCOLASTICO.etichetta}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Pianifica l’anno</h1>
        <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8 print:hidden">
          Il programma settimana per settimana: una lezione di teoria e una di disegno o coding, sul calendario
          scolastico della Regione {ANNO_SCOLASTICO.regione} ({SETTIMANE_DI_LEZIONE} settimane di lezione). Aggiungi le
          tue classi, fino a {MAX_CLASSI}: ognuna parte dalla proposta del libro e poi va per conto suo. Segna le
          lezioni fatte, rimanda quelle saltate, cambia l’ordine, aggiungi le tue note.
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600 print:hidden">
          Il piano si salva solo su questo browser, senza account. Per portarlo su un altro dispositivo esportalo in
          un file e importalo lì. Sul dispositivo dove lo salvi, la «Lezione della settimana» in home mostra le tue classi.
        </p>
      </div>

      {/* Le classi del docente */}
      <section aria-labelledby="titolo-classi" className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 print:hidden">
        <h2 id="titolo-classi" className="text-sm font-black uppercase tracking-wide text-slate-700">
          Le tue classi{pronto && ` · ${classi.length} di ${MAX_CLASSI}`}
        </h2>

        {classi.length > 0 ? (
          <div role="group" aria-label="Scegli la classe" className="mt-3 flex flex-wrap gap-2">
            {classi.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={c.id === idSel}
                onClick={() => scegli(c.id)}
                className={cx(
                  "rounded-full border px-4 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                  c.id === idSel ? "border-brand-700 bg-brand-700 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                )}
              >
                {c.nome.trim() || "senza nome"}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm leading-6 text-slate-600">
              Non hai ancora aggiunto classi. Intanto puoi sfogliare la proposta del libro:
            </p>
            <div role="group" aria-label="Scegli l’anno della proposta" className="mt-2 flex flex-wrap gap-2">
              {ANNI.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={annoSfoglia === a}
                  onClick={() => setAnnoSfoglia(a)}
                  className={cx(
                    "rounded-full border px-4 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                    annoSfoglia === a ? "border-slate-800 bg-slate-800 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                  )}
                >
                  Proposta {a}ª
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Aggiungi una classe */}
        <form
          className="mt-4 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4"
          onSubmit={(e) => {
            e.preventDefault();
            aggiungi();
          }}
        >
          <label className="text-sm font-semibold text-slate-700">
            Anno
            <select className={cx(CAMPO, "mt-1 block")} value={nuovoAnno} onChange={(e) => setNuovoAnno(Number(e.target.value))}>
              {ANNI.map((a) => <option key={a} value={a}>{a}ª</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Sezione
            <input
              type="text"
              maxLength={4}
              placeholder="A"
              className={cx(CAMPO, "mt-1 block w-24")}
              value={nuovaSezione}
              onChange={(e) => setNuovaSezione(e.target.value)}
            />
          </label>
          <button type="submit" className="rounded-full border border-brand-700 bg-brand-700 px-4 py-2 text-sm font-bold text-white hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-40" disabled={!pronto || classi.length >= MAX_CLASSI}>
            Aggiungi classe
          </button>
          {classi.length >= MAX_CLASSI && <p className="text-sm text-slate-600">Hai raggiunto il massimo di {MAX_CLASSI} classi.</p>}
        </form>

        {/* Comandi della classe scelta */}
        {mia && (
          <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
            <label className="text-sm font-semibold text-slate-700">
              Nome della classe
              <input
                type="text"
                maxLength={MAX_NOME_CLASSE}
                className={cx(CAMPO, "mt-1 block w-32")}
                value={mia.nome}
                onChange={(e) => cambiaMia((c) => ({ ...c, nome: e.target.value }))}
              />
            </label>
            {sorelle.length > 0 && (
              <label className="text-sm font-semibold text-slate-700">
                Copia il piano da
                <select className={cx(CAMPO, "mt-1 block")} value={copiaIn ?? ""} onChange={(e) => setCopiaIn(e.target.value || null)}>
                  <option value="">Scegli…</option>
                  {sorelle.map((c) => <option key={c.id} value={c.id}>{c.nome.trim() || "senza nome"}</option>)}
                </select>
              </label>
            )}
            {copiaIn ? (
              <span role="alert" className="flex flex-wrap items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-900">
                Sostituisco ordine e note della {mia.nome} con quelli della {classi.find((c) => c.id === copiaIn)?.nome}? Le lezioni fatte restano segnate.
                <button type="button" className={SI} onClick={() => copiaDa(copiaIn)}>Sì</button>
                <button type="button" className={NO} onClick={() => setCopiaIn(null)}>No</button>
              </span>
            ) : conferma ? (
              <span role="alert" className="flex flex-wrap items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-900">
                {conferma === "elimina" ? `Elimino la classe ${mia.nome} con il suo piano?` : `Cancello ordine, note e lezioni fatte della ${mia.nome}?`}
                <button type="button" className={SI} onClick={conferma === "elimina" ? elimina : ripristina}>Sì</button>
                <button type="button" className={NO} onClick={() => setConferma(null)}>No</button>
              </span>
            ) : (
              <>
                <button type="button" className={BOTTONE} onClick={() => setConferma("ripristina")} disabled={!modificato}>Torna alla proposta</button>
                <button type="button" className={BOTTONE} onClick={() => setConferma("elimina")}>Elimina classe</button>
              </>
            )}
          </div>
        )}

        {/* Comandi generali */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
          {pronto && oggi >= 0 && oggi < SETTIMANE.length && (
            <a href="#questa-settimana" className={BOTTONE}>Vai a questa settimana</a>
          )}
          <button type="button" className={BOTTONE} onClick={() => window.print()}>Stampa</button>
          <button type="button" className={BOTTONE} onClick={esporta} disabled={classi.length === 0}>Esporta</button>
          <button type="button" className={BOTTONE} onClick={() => fileRef.current?.click()}>Importa</button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" aria-label="File del piano da importare" onChange={(e) => importa(e.target.files?.[0])} />
          {daImportare && (
            <span role="alert" className="flex flex-wrap items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-900">
              Sostituisco le {classi.length} classi presenti con le {daImportare.length} del file?
              <button type="button" className={SI} onClick={() => confermaImporta(daImportare)}>Sì</button>
              <button type="button" className={NO} onClick={() => setDaImportare(null)}>No</button>
            </span>
          )}
        </div>
      </section>

      <h2 className="mt-6 text-xl font-black text-slate-950">
        {mia ? `Classe ${mia.nome}` : `Proposta per la classe ${anno}ª`}
      </h2>

      {avviso && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900">{avviso}</p>
      )}

      {/* Riepilogo */}
      {mia && (
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {BINARI.map((b) => (
            <span key={b} className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700">
              {NOME_BINARIO[b]}: {slots[b].filter((s) => s.fatto).length} di {SETTIMANE_DI_LEZIONE} fatte
            </span>
          ))}
        </div>
      )}
      {esclusi.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-bold">
            {esclusi.length === 1 ? "Una lezione della proposta non entra più nel calendario:" : `${esclusi.length} lezioni della proposta non entrano più nel calendario:`}
          </p>
          <ul className="mt-1 list-disc pl-5">
            {esclusi.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
          <p className="mt-1 print:hidden">Puoi rimetterle al posto di una settimana libera con «Modifica».</p>
        </div>
      )}

      {/* Settimane */}
      <ol className="mt-6 space-y-3">
        {SETTIMANE.map((s, indice) => {
          const corrente = pronto && indice === oggi;
          if (s.numero === null) {
            return (
              <li
                key={s.lunedi}
                id={corrente ? "questa-settimana" : undefined}
                className="scroll-mt-28 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900"
              >
                {etichettaSettimana(s)} · {s.motivo}
              </li>
            );
          }
          const n = s.numero;
          return (
            <li
              key={s.lunedi}
              id={corrente ? "questa-settimana" : undefined}
              className={cx(
                "scroll-mt-28 break-inside-avoid rounded-2xl border bg-white p-4 shadow-sm sm:p-5",
                corrente ? "border-brand-500 ring-2 ring-brand-200" : "border-slate-200"
              )}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-base font-black text-slate-950">Settimana {n}</h3>
                <p className="text-sm font-semibold text-slate-600">{etichettaSettimana(s)}</p>
                {s.giorni < 5 && <p className="text-xs font-semibold text-amber-800">{s.giorni} giorni di scuola</p>}
                {corrente && <p className="rounded-full bg-brand-700 px-2.5 py-0.5 text-xs font-bold text-white">Questa settimana</p>}
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {BINARI.map((b) => {
                  const slot = slots[b][n - 1];
                  const voce = risolvi(proposta, anno, b, slot);
                  const chiave = `${n}-${b}`;
                  const spostata = slot.base !== n - 1;
                  return (
                    <div
                      key={b}
                      className={cx(
                        "rounded-xl border p-3",
                        b === "teoria" ? "border-brand-200 bg-brand-50/40" : "border-blue-200 bg-blue-50/40",
                        slot.fatto && "opacity-70"
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cx("rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-wide text-white", b === "teoria" ? "bg-brand-700" : "bg-blue-700")}>
                          {voce.tipo}
                        </span>
                        {voce.mc && <span className="font-mono text-xs font-semibold text-slate-500">{voce.mc}</span>}
                        {spostata && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">modificata</span>}
                      </div>
                      <p className={cx("mt-2 text-sm font-bold leading-snug text-slate-950", slot.fatto && "line-through")}>
                        {voce.mc && voce.mcTitolo ? (
                          <Link href={`/mc/${voce.mc}`} className="underline-offset-4 hover:underline">{voce.emoji} {voce.mcTitolo}</Link>
                        ) : (
                          voce.titolo
                        )}
                      </p>
                      {voce.mc && voce.mcTitolo && <p className="text-sm text-slate-700">{voce.titolo}</p>}
                      {slot.nota && <p className="mt-1 text-sm italic text-slate-700">Nota: {slot.nota}</p>}

                      {modificabile && <div className="mt-2 flex flex-wrap items-center gap-3 print:hidden">
                        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            className="h-5 w-5 accent-brand-700"
                            aria-label={`Fatta: settimana ${n}, ${NOME_BINARIO[b].toLowerCase()}`}
                            checked={!!slot.fatto}
                            onChange={(e) => cambiaSlot(b, n - 1, { fatto: e.target.checked })}
                          />
                          Fatta
                        </label>
                        <button
                          type="button"
                          aria-expanded={aperto === chiave}
                          aria-label={`${aperto === chiave ? "Chiudi" : "Modifica"}: settimana ${n}, ${NOME_BINARIO[b].toLowerCase()}`}
                          onClick={() => setAperto(aperto === chiave ? null : chiave)}
                          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-bold text-slate-700 hover:border-slate-500"
                        >
                          {aperto === chiave ? "Chiudi" : "Modifica"}
                        </button>
                      </div>}

                      {modificabile && aperto === chiave && (
                        <div className="mt-3 space-y-3 rounded-lg border border-slate-200 bg-white p-3 print:hidden">
                          <label className="block text-sm font-semibold text-slate-700">
                            Lezione di questa settimana
                            <select
                              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                              value={slot.base ?? -1}
                              onChange={(e) => {
                                const v = Number(e.target.value);
                                cambiaSlot(b, n - 1, { base: v === -1 ? null : v });
                              }}
                            >
                              <option value={-1}>Settimana libera (recupero, verifica, altro)</option>
                              {proposta[anno][b].map((v, i) => (
                                <option key={i} value={i}>
                                  {i + 1}. {etichettaVoce(v)}
                                </option>
                              ))}
                            </select>
                          </label>
                          {slot.base === null && (
                            <label className="block text-sm font-semibold text-slate-700">
                              Che cosa si fa
                              <input
                                type="text"
                                maxLength={MAX_TITOLO}
                                placeholder="Per esempio: verifica, uscita didattica, recupero"
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                value={slot.titolo ?? ""}
                                onChange={(e) => cambiaSlot(b, n - 1, { titolo: e.target.value })}
                              />
                            </label>
                          )}
                          <label className="block text-sm font-semibold text-slate-700">
                            Nota
                            <textarea
                              rows={2}
                              maxLength={MAX_NOTA}
                              placeholder="Materiali da portare, compiti, cose da riprendere…"
                              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              value={slot.nota ?? ""}
                              onChange={(e) => cambiaSlot(b, n - 1, { nota: e.target.value })}
                            />
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 hover:border-slate-500 disabled:opacity-40"
                              disabled={haAppunti(slots[b][slots[b].length - 1])}
                              onClick={() => scriviSlot(b, rimanda(slots[b], n - 1))}
                            >
                              Rimanda di una settimana
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 hover:border-slate-500"
                              onClick={() => scriviSlot(b, anticipa(slots[b], n - 1))}
                            >
                              Togli e anticipa le successive
                            </button>
                          </div>
                          <p className="text-xs leading-5 text-slate-500">
                            «Rimanda» lascia libera questa settimana e sposta in avanti questa lezione e tutte le
                            successive di {NOME_BINARIO[b].toLowerCase()}: l’ultima dell’anno esce dal calendario.
                            «Togli» elimina dal calendario la lezione di questa settimana e anticipa le successive:
                            l’ultima settimana resta libera. Se scegli una lezione che è già in un’altra settimana,
                            le due si scambiano.
                            {haAppunti(slots[b][slots[b].length - 1]) && " Per rimandare, togli prima la nota o il segno «fatta» dall’ultima settimana dell’anno."}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
