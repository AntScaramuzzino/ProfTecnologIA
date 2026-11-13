"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

type ProiettoreEmbedProps = {
  /** indirizzo del proiettore in modalità incorporata (lib/geogebra-proiezioni.ts › proiettoreSrc) */
  src: string;
  /** lo stesso proiettore a schermo intero per la LIM */
  limSrc: string;
  title: string;
  className?: string;
};

/** Il proiettore ortogonale (public/embeds/proiettore) dentro una pagina del libro. */
export default function ProiettoreEmbed({ src, limSrc, title, className = "" }: ProiettoreEmbedProps) {
  const titleId = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [iframeHeight, setIframeHeight] = useState(900);

  const syncIframeHeight = useCallback(() => {
    const documentElement = iframeRef.current?.contentDocument?.documentElement;
    if (!documentElement) return;

    const updateHeight = () => {
      setIframeHeight(Math.max(520, documentElement.scrollHeight + 2));
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
          <p className="text-xs font-black uppercase tracking-widest text-blue-700">Proiettore ortogonale · 3D</p>
          <h2 id={titleId} className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            {title}
          </h2>
        </div>
        <a
          href={limSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900"
        >
          Apri alla LIM ↗
        </a>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
        <iframe
          ref={iframeRef}
          src={src}
          title={`Proiettore ortogonale: ${title.toLowerCase()}`}
          className="block w-full border-0 transition-[height] duration-200"
          style={{ height: iframeHeight }}
          allow="fullscreen"
          onLoad={syncIframeHeight}
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        Trascina il solido per ruotarlo. Le tre lastre mostrano la vista di fronte (prospetto), la vista dall’alto
        (pianta) e la vista di fianco; gli spigoli nascosti sono tratteggiati.
      </p>
    </section>
  );
}
