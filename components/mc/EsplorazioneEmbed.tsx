"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { esplorazioneEmbedSrc, esplorazioneSrc, type EsplorazioneImmersiva } from "@/lib/esplorazioni";

/** Identificativo di una scena in dati.js: lettere, cifre, trattini */
const SCENA = /^[a-z0-9][a-z0-9_-]{0,39}$/i;

/**
 * Esplorazione immersiva della MC (public/embeds/esplorazioni/<slug>/) in un iframe.
 * Con ?incorporata la pagina interna mette il testo sotto l'immagine, lascia la rotella e lo scorrimento verticale
 * a questa pagina e non aggiunge voci alla cronologia; il suo pulsante «Schermo intero» porta l'iframe a tutto
 * schermo (LIM). I messaggi passano solo tra pagine della stessa origine:
 * - iframe → qui  { type: "proftec-esplorazione", id, pronta: true }   all'avvio: chiede le scene già viste
 * - qui → iframe  { type: "proftec-esplorazione-viste", id, scene }    le scene dello studente (non del dispositivo)
 * - iframe → qui  { type: "proftec-esplorazione", id, scena, totale }  a ogni scena raggiunta
 */
export default function EsplorazioneEmbed({
  esplorazione,
  viste,
  className = "",
  onScene,
}: {
  esplorazione: EsplorazioneImmersiva;
  /** Scene già visitate dallo studente; null finché i progressi non sono stati letti */
  viste: string[] | null;
  className?: string;
  /** Scena raggiunta nell'esplorazione (messaggio dall'iframe) */
  onScene?: (esplorazione: EsplorazioneImmersiva, scena: string) => void;
}) {
  const titleId = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const visteRef = useRef(viste);
  const inAttesa = useRef(false); // l'iframe ha chiesto le scene prima che i progressi fossero letti

  const inviaViste = useCallback(() => {
    const scene = visteRef.current;
    if (!scene) return false;
    iframeRef.current?.contentWindow?.postMessage(
      { type: "proftec-esplorazione-viste", id: esplorazione.slug, scene },
      window.location.origin,
    );
    return true;
  }, [esplorazione.slug]);

  useEffect(() => {
    visteRef.current = viste;
    if (viste && inAttesa.current) {
      inAttesa.current = false;
      inviaViste();
    }
  }, [viste, inviaViste]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== iframeRef.current?.contentWindow) return;
      const d = e.data;
      if (!d || d.type !== "proftec-esplorazione" || d.id !== esplorazione.slug) return;
      if (d.pronta === true) {
        inAttesa.current = !inviaViste();
        return;
      }
      if (typeof d.scena !== "string" || !SCENA.test(d.scena)) return;
      onScene?.(esplorazione, d.scena);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [esplorazione, onScene, inviaViste]);

  return (
    <section className={className} aria-labelledby={titleId}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-teal-800">Esplorazione immersiva</p>
          <h2 id={titleId} className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            {esplorazione.titolo}
          </h2>
        </div>
        <a
          href={esplorazioneSrc(esplorazione.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-950"
        >
          Apri in una nuova scheda ↗
        </a>
      </div>
      {/* Altezza dalla larghezza del riquadro: l'immagine in 16:9 più il testo sotto; in un riquadro stretto
          (telefono) la scena è in verticale. Il tetto lascia fuori l'intestazione e le schede, che restano fisse
          in alto. Le proporzioni fisse valgono per i browser senza unità cq. */}
      <div className="@container overflow-hidden rounded-xl border border-slate-200 bg-[#0a1113] shadow-sm">
        <iframe
          ref={iframeRef}
          src={esplorazioneEmbedSrc(esplorazione.slug)}
          title={`Esplorazione immersiva: ${esplorazione.titolo}`}
          className="block aspect-[9/16] h-[min(177cqw,calc(100dvh-8.5rem))] min-h-[26rem] w-full border-0 sm:aspect-[5/4] @lg:h-[min(calc(56.25cqw+13.75rem),calc(100dvh-8.5rem))]"
          loading="lazy"
          allow="fullscreen; autoplay"
          allowFullScreen
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        Tocca i punti sull&apos;immagine per entrare nelle {esplorazione.scene} scene. Per vederla in grande usa lo schermo
        intero (pulsante in alto a destra) o aprila in una nuova scheda. Le scene che visiti da qui entrano nei tuoi
        progressi.
      </p>
    </section>
  );
}
