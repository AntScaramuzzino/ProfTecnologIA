"use client";

/**
 * WikiImage — immagine da Wikimedia Commons con attribuzione obbligatoria
 *
 * Usato nella tab ESPLORA delle MC che hanno il campo `immagine_esplora`
 * nel loro JSON. Solo immagini con licenza CC BY, CC BY-SA, CC0 o Public Domain.
 *
 * Posizionamento: sopra l'AccordionSection, prima del testo narrativo.
 */

interface WikiImageProps {
  /** Path relativo a /public/ — es. "/images/wiki/MC-MAT-1-02/fotosintesi.jpg" */
  src: string;
  /** Testo alternativo descrittivo per accessibilità */
  alt: string;
  /** Attribuzione — es. "Autore: John Doe, via Wikimedia Commons" */
  caption: string;
  /** Licenza — es. "CC BY-SA 4.0" | "CC BY 4.0" | "CC0" | "Public Domain" */
  license: string;
  /** Link alla pagina Wikimedia Commons dell'immagine (opzionale) */
  wikimedia_url?: string;
}

export function WikiImage({
  src,
  alt,
  caption,
  license,
  wikimedia_url,
}: WikiImageProps) {
  return (
    <figure className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      {/* Immagine */}
      <div className="flex items-center justify-center bg-slate-100 p-2">
        <img
          src={src}
          alt={alt}
          className="max-h-72 w-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Barra attribuzione */}
      <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-slate-200 bg-white px-3 py-2">
        {/* Icona CC */}
        <svg
          className="h-4 w-4 shrink-0 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M10 9.5A2.5 2.5 0 0 0 7.5 12a2.5 2.5 0 0 0 2.5 2.5" />
          <path d="M15.5 9.5A2.5 2.5 0 0 0 13 12a2.5 2.5 0 0 0 2.5 2.5" />
        </svg>

        {/* Testo attribuzione */}
        <span className="flex-1 text-xs leading-snug text-slate-500">
          {caption}
        </span>

        {/* Badge licenza */}
        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
          {license}
        </span>

        {/* Link Wikimedia Commons */}
        {wikimedia_url && (
          <a
            href={wikimedia_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs text-blue-500 hover:underline"
            aria-label="Vedi su Wikimedia Commons"
          >
            Wikimedia ↗
          </a>
        )}
      </figcaption>
    </figure>
  );
}
