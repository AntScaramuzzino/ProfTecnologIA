"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { getEscapeRoom, getLaboratorio, labSrc, escapeSrc } from "@/lib/laboratori";

type LabLevel = "F" | "I" | "A";
type LimApi = { set: (on: boolean) => void };

/**
 * Laboratorio interattivo (kind="lab") o escape room (kind="escape") della MC, in un iframe che si adatta all'altezza.
 * «Schermo intero (LIM)» porta l'iframe a schermo intero e attiva la modalità LIM della pagina interna
 * (contenuto ingrandito, bersagli grandi per il tocco: scripts/laboratori/lim.js).
 */
export default function LabInterattivoEmbed({
  mcId,
  kind = "lab",
  className = "",
  onResult,
}: {
  mcId: string;
  kind?: "lab" | "escape";
  className?: string;
  /** Verifica di fine livello completata nel laboratorio (messaggio dall'iframe) */
  onResult?: (level: LabLevel, score: number, total: number) => void;
}) {
  const lab = kind === "lab" ? getLaboratorio(mcId) : undefined;
  const esc = kind === "escape" ? getEscapeRoom(mcId) : undefined;
  const titleId = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState(kind === "lab" ? 1200 : 900);
  const [canFullscreen, setCanFullscreen] = useState(false);

  const syncHeight = useCallback(() => {
    const doc = iframeRef.current?.contentDocument?.documentElement;
    if (!doc) return;
    const update = () => {
      if (document.fullscreenElement === iframeRef.current) return; // a schermo intero comanda il browser
      setHeight(Math.max(kind === "lab" ? 600 : 500, doc.scrollHeight + 2));
    };
    observerRef.current?.disconnect();
    observerRef.current = new ResizeObserver(update);
    observerRef.current.observe(doc);
    update();
  }, [kind]);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  useEffect(() => {
    setCanFullscreen(typeof document !== "undefined" && !!document.fullscreenEnabled);
    const onChange = () => {
      const on = document.fullscreenElement === iframeRef.current;
      const w = iframeRef.current?.contentWindow as (Window & { PROFTEC_LIM?: LimApi }) | null | undefined;
      try {
        w?.PROFTEC_LIM?.set(on);
      } catch {
        /* pagina interna non pronta */
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const goFullscreen = useCallback(() => {
    iframeRef.current?.requestFullscreen?.().catch(() => {
      /* il browser ha rifiutato: resta il link alla pagina */
    });
  }, []);

  // Il laboratorio (stessa origine) invia { type: "proftec-lab-result", mcId, level, score, total }
  useEffect(() => {
    if (!onResult || kind !== "lab") return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== iframeRef.current?.contentWindow) return;
      const d = e.data;
      if (!d || d.type !== "proftec-lab-result" || d.mcId !== mcId) return;
      if (!["F", "I", "A"].includes(d.level) || !Number.isInteger(d.score) || !Number.isInteger(d.total)) return;
      onResult(d.level as LabLevel, d.score, d.total);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [mcId, onResult, kind]);

  const meta = lab ?? esc;
  if (!meta) return null;
  const src = kind === "lab" ? labSrc(mcId) : escapeSrc(mcId);
  const kicker = lab ? `Laboratorio interattivo · ${lab.archetipo}` : "Escape room";
  const color = kind === "lab" ? "#00695C" : "#9A3412";

  return (
    <section className={className} aria-labelledby={titleId}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-widest" style={{ color }}>
            {kicker}
          </p>
          <h2 id={titleId} className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            {meta.titolo}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {canFullscreen && (
            <button
              type="button"
              onClick={goFullscreen}
              className="rounded-full border-2 border-teal-700 bg-teal-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-800"
              title="Schermo intero con testo e pulsanti grandi, per la lavagna interattiva"
            >
              ⛶ Schermo intero (LIM)
            </button>
          )}
          <a
            href={`${src}?lim=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-950"
          >
            Apri in una nuova scheda ↗
          </a>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <iframe
          ref={iframeRef}
          src={src}
          title={`${kind === "lab" ? "Laboratorio interattivo" : "Escape room"}: ${meta.titolo}`}
          className="block w-full border-0"
          style={{ height }}
          loading="lazy"
          allow="fullscreen"
          allowFullScreen
          onLoad={syncHeight}
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        {kind === "lab"
          ? "Il laboratorio ha tre livelli, come le attività qui sotto, e ognuno si chiude con una verifica di 4 domande. I risultati delle verifiche entrano nei tuoi progressi; gli appunti restano su questo dispositivo."
          : "Cinque lucchetti da aprire con i contenuti della micro-competenza: ogni lucchetto dà un simbolo del codice della porta. Si gioca da soli o in squadra alla LIM; il record resta su questo dispositivo."}
      </p>
    </section>
  );
}
