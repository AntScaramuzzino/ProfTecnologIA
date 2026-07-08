"use client";

import { useState, useEffect, useCallback } from "react";
import type { VisualAsset } from "@/lib/content-loader";

interface MCVisualProps {
  asset: VisualAsset | null;
  alt: string;
  className?: string;
  /**
   * true  → immagine hero above-the-fold: eager + fetchPriority=high, niente lazy.
   * false → immagini below-fold (carousel, card): lazy + decoding=async.
   */
  priority?: boolean;
  /**
   * true → click sull'immagine apre un lightbox fullscreen con zoom.
   */
  zoomable?: boolean;
}

export default function MCVisual({
  asset,
  alt,
  className = "",
  priority = false,
  zoomable = false,
}: MCVisualProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!asset) {
    return (
      <div
        className={`flex min-h-48 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 sm:min-h-72 ${className}`}
      >
        Visual non ancora generato
      </div>
    );
  }

  // Alt text descrittivo (CARBLE-CDD criterio L — accessibilità)
  const descriptiveAlt = alt || `${asset.label} — immagine didattica generata con AI`;

  const imgEl = (
    <img
      src={asset.src}
      alt={descriptiveAlt}
      className="h-full w-full max-w-full rounded-lg object-contain"
      width={1600}
      height={900}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      {...(priority ? { fetchPriority: "high" } : {})}
    />
  );

  return (
    <>
      <figure className={`w-full overflow-hidden ${className}`}>
        {zoomable ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="Apri immagine ingrandita"
            className="group relative cursor-zoom-in"
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpen(true);
            }}
          >
            {imgEl}
            {/* Icona lente — appare on-hover */}
            <span className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </span>
          </div>
        ) : (
          imgEl
        )}
        <figcaption className="mt-2 text-xs text-slate-500">
          {asset.label}
          {asset.kind === "generated" || asset.kind === "hero" ? (
            <span className="ml-1 text-slate-400">· Immagine AI</span>
          ) : null}
          {zoomable && (
            <span className="ml-1 text-slate-400">· Tocca per ingrandire</span>
          )}
        </figcaption>
      </figure>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={close}
          aria-modal="true"
          role="dialog"
          aria-label="Immagine ingrandita"
        >
          {/* Pulsante chiudi */}
          <button
            onClick={close}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25"
            aria-label="Chiudi"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Immagine fullscreen — click interno non propaga close */}
          <img
            src={asset.src}
            alt={descriptiveAlt}
            className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
