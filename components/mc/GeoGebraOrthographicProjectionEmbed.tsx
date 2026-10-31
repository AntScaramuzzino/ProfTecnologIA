"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

export default function GeoGebraOrthographicProjectionEmbed({
  className = "",
}: {
  className?: string;
}) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const src = `${basePath}/embeds/geogebra/proiezioni-ortogonali-prisma-ottagonale/index.html`;
  const titleId = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [iframeHeight, setIframeHeight] = useState(1150);

  const syncIframeHeight = useCallback(() => {
    const documentElement = iframeRef.current?.contentDocument?.documentElement;
    if (!documentElement) return;

    const updateHeight = () => {
      setIframeHeight(Math.max(820, documentElement.scrollHeight + 2));
    };

    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = new ResizeObserver(updateHeight);
    resizeObserverRef.current.observe(documentElement);
    updateHeight();
  }, []);

  useEffect(() => () => resizeObserverRef.current?.disconnect(), []);

  return (
    <section className={className} aria-labelledby={titleId}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-blue-700">
            Laboratorio interattivo · GeoGebra
          </p>
          <h2 id={titleId} className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            Dal prisma ottagonale alle tre viste
          </h2>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900"
        >
          Apri a tutto schermo ↗
        </a>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
        <iframe
          ref={iframeRef}
          src={src}
          title="Laboratorio GeoGebra: proiezioni ortogonali di un prisma a base ottagonale"
          className="block w-full border-0 transition-[height] duration-200"
          style={{ height: iframeHeight }}
          loading="lazy"
          allow="fullscreen"
          onLoad={syncIframeHeight}
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        L’attività carica GeoGebra da geogebra.org e richiede una connessione Internet.
      </p>
    </section>
  );
}
