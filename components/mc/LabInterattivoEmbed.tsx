"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { getLaboratorio, labSrc } from "@/lib/laboratori";

export default function LabInterattivoEmbed({
  mcId,
  className = "",
}: {
  mcId: string;
  className?: string;
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
        Il laboratorio ha tre livelli, come le attività qui sotto. Il livello scelto e gli appunti restano su questo dispositivo.
      </p>
    </section>
  );
}
