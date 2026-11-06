"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { getLaboratorio, labSrc } from "@/lib/laboratori";

type LabLevel = "F" | "I" | "A";

export default function LabInterattivoEmbed({
  mcId,
  className = "",
  onResult,
}: {
  mcId: string;
  className?: string;
  /** Verifica di fine livello completata nel laboratorio (messaggio dall'iframe) */
  onResult?: (level: LabLevel, score: number, total: number) => void;
}) {
  const lab = getLaboratorio(mcId);
  const titleId = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState(1200);

  const syncHeight = useCallback(() => {
    const doc = iframeRef.current?.contentDocument?.documentElement;
    if (!doc) return;
    const update = () => setHeight(Math.max(600, doc.scrollHeight + 2));
    observerRef.current?.disconnect();
    observerRef.current = new ResizeObserver(update);
    observerRef.current.observe(doc);
    update();
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  // Il laboratorio (stessa origine) invia { type: "proftec-lab-result", mcId, level, score, total }
  useEffect(() => {
    if (!onResult) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== iframeRef.current?.contentWindow) return;
      const d = e.data;
      if (!d || d.type !== "proftec-lab-result" || d.mcId !== mcId) return;
      if (!["F", "I", "A"].includes(d.level) || !Number.isInteger(d.score) || !Number.isInteger(d.total)) return;
      onResult(d.level as LabLevel, d.score, d.total);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [mcId, onResult]);

  if (!lab) return null;
  const src = labSrc(mcId);

  return (
    <section className={className} aria-labelledby={titleId}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#00695C" }}>
            Laboratorio interattivo · {lab.archetipo}
          </p>
          <h2 id={titleId} className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            {lab.titolo}
          </h2>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-950"
        >
          Apri a tutto schermo ↗
        </a>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <iframe
          ref={iframeRef}
          src={src}
          title={`Laboratorio interattivo: ${lab.titolo}`}
          className="block w-full border-0"
          style={{ height }}
          loading="lazy"
          onLoad={syncHeight}
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        Il laboratorio ha tre livelli, come le attività qui sotto, e ognuno si chiude con una verifica di 4 domande. I risultati delle verifiche entrano nei tuoi progressi; gli appunti restano su questo dispositivo.
      </p>
    </section>
  );
}
