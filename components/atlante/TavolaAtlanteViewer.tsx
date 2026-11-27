"use client";

import { useEffect, useRef, useState } from "react";
import { atlanteCopertina, atlanteSrc, type TavolaAtlante } from "@/lib/atlante";

/**
 * Tavola interattiva dell'Atlante: prima la figura ferma (copertina.webp), l'HTML della tavola (150–320 KB, offline)
 * si carica solo al clic. La tavola è della stessa origine: l'iframe prende l'altezza del suo contenuto, così
 * si scorre una sola pagina e non due. Senza JavaScript resta il link «Apri a tutta pagina».
 */
export default function TavolaAtlanteViewer({ tavola }: { tavola: TavolaAtlante }) {
  const [attiva, setAttiva] = useState(false);
  const [altezza, setAltezza] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const src = atlanteSrc(tavola.slug);

  useEffect(() => {
    if (!attiva) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    let observer: ResizeObserver | null = null;

    const misura = () => {
      const doc = iframe.contentDocument;
      if (!doc?.documentElement) return;
      setAltezza(Math.ceil(doc.documentElement.scrollHeight));
    };
    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      misura();
      observer?.disconnect();
      observer = new ResizeObserver(misura);
      observer.observe(doc.body);
      iframe.focus();
    };

    iframe.addEventListener("load", onLoad);
    if (iframe.contentDocument?.readyState === "complete" && iframe.contentWindow?.location.href !== "about:blank") onLoad();
    return () => {
      iframe.removeEventListener("load", onLoad);
      observer?.disconnect();
    };
  }, [attiva]);

  return (
    <section aria-label={`Tavola interattiva: ${tavola.titolo}`}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {attiva ? (
          <iframe
            ref={iframeRef}
            src={src}
            title={`Tavola interattiva: ${tavola.titolo}`}
            className="block w-full border-0"
            style={{ height: altezza ? `${altezza}px` : "min(80dvh, 56rem)" }}
            allow="fullscreen"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAttiva(true)}
            className="group relative block w-full cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand-500"
          >
            <img
              src={atlanteCopertina(tavola.slug)}
              alt=""
              width={960}
              height={540}
              decoding="async"
              className="aspect-video max-h-[52dvh] w-full object-contain"
            />
            <span className="absolute bottom-4 left-1/2 inline-flex min-h-11 -translate-x-1/2 items-center whitespace-nowrap rounded-lg bg-brand-700 px-5 py-2.5 text-base font-bold text-white shadow-md group-hover:bg-brand-800 sm:bottom-6">
              Avvia la tavola interattiva
            </span>
          </button>
        )}
      </div>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm leading-6 text-slate-600">
        <span>{tavola.interazione}</span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-brand-600 underline underline-offset-4 hover:text-brand-800"
        >
          Apri a tutta pagina, anche alla LIM ↗
        </a>
      </p>
    </section>
  );
}
