"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { getEscapeRoom, getLaboratorio, labSrc, escapeSrc } from "@/lib/laboratori";

type LabLevel = "F" | "I" | "A";
type LimApi = { set: (on: boolean) => void };

/**
 * Laboratorio interattivo (kind="lab") o escape room (kind="escape") della MC, in un iframe che si adatta all'altezza.
 * Il pulsante «Schermo intero (LIM)» della pagina interna porta l'iframe a schermo intero e ne attiva la modalità LIM
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
      {/* Tipo e titolo sono già nell'intestazione della pagina interna (con il suo pulsante «Schermo intero (LIM)»):
          qui restano solo per i lettori di schermo, per non ripeterli a video. */}
      <p className="sr-only">{kicker}</p>
      <h2 id={titleId} className="sr-only">
        {meta.titolo}
      </h2>
      <div className="mb-2 flex justify-end">
        <a
          href={`${src}?lim=1`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold underline underline-offset-4"
          style={{ color, textDecorationColor: `${color}55` }}
        >
          Apri in una nuova scheda ↗
        </a>
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
