"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { VisualAsset } from "@/lib/content-loader";

interface MCImageCarouselProps {
  visuals: VisualAsset[];
  mcTitolo: string;
}

export default function MCImageCarousel({ visuals, mcTitolo }: MCImageCarouselProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const total = visuals.length;
  const selected = visuals[selectedIdx];

  const prev = useCallback(() => {
    setSelectedIdx((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setSelectedIdx((i) => (i + 1) % total);
  }, [total]);

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, prev, next]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  // Touch swipe handlers (carousel + lightbox)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  if (total === 0) return null;

  // Single image — no carousel chrome needed, just render cleanly
  if (total === 1) {
    return (
      <figure className="w-full">
        <div
          className="group relative cursor-zoom-in overflow-hidden rounded-xl bg-slate-50"
          onClick={openLightbox}
          role="button"
          tabIndex={0}
          aria-label={`Ingrandisci: ${selected.label}`}
          onKeyDown={(e) => e.key === "Enter" && openLightbox()}
        >
          <img
            src={selected.src}
            alt={`${selected.label} — ${mcTitolo}`}
            className="max-h-[480px] w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <span className="absolute bottom-3 right-3 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
            <ZoomIcon />
          </span>
        </div>
        <figcaption className="mt-2 text-xs text-slate-500">
          {selected.label}
          {(selected.kind === "generated" || selected.kind === "hero") && (
            <span className="ml-1 text-slate-400">· Immagine AI</span>
          )}
        </figcaption>
        {lightboxOpen && (
          <Lightbox
            visuals={visuals}
            selectedIdx={selectedIdx}
            mcTitolo={mcTitolo}
            onClose={closeLightbox}
            onPrev={prev}
            onNext={next}
            onSelect={setSelectedIdx}
            lightboxRef={lightboxRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        )}
      </figure>
    );
  }

  return (
    <div className="w-full">
      {/* ── Main image ─────────────────────────────────────────────────────── */}
      <div
        className="group relative cursor-zoom-in overflow-hidden rounded-xl bg-slate-50"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={selected.src}
          alt={`${selected.label} — ${mcTitolo}`}
          className="max-h-[480px] w-full object-contain transition-all duration-300"
          onClick={openLightbox}
          role="img"
        />

        {/* Zoom hint */}
        <button
          onClick={openLightbox}
          className="absolute bottom-3 right-3 rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          aria-label="Ingrandisci immagine"
        >
          <ZoomIcon />
        </button>

        {/* Prev arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          aria-label="Immagine precedente"
        >
          <ChevronLeft />
        </button>

        {/* Next arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          aria-label="Immagine successiva"
        >
          <ChevronRight />
        </button>

        {/* Dot indicator */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
          {visuals.map((_, i) => (
            <span
              key={i}
              className={`block h-1.5 rounded-full transition-all duration-200 ${
                i === selectedIdx
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Caption */}
      <p className="mt-2 text-xs text-slate-500">
        {selected.label}
        {(selected.kind === "generated" || selected.kind === "hero") && (
          <span className="ml-1 text-slate-400">· Immagine AI</span>
        )}
        <span className="ml-2 text-slate-400">{selectedIdx + 1} / {total}</span>
      </p>

      {/* ── Thumbnail strip ─────────────────────────────────────────────────── */}
      <div
        className="mt-3 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Seleziona immagine"
      >
        {visuals.map((asset, i) => (
          <button
            key={asset.src}
            role="tab"
            aria-selected={i === selectedIdx}
            aria-label={asset.label}
            onClick={() => setSelectedIdx(i)}
            className={`shrink-0 overflow-hidden rounded-md border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              i === selectedIdx
                ? "border-blue-500 ring-2 ring-blue-300"
                : "border-transparent hover:border-slate-300"
            }`}
          >
            <img
              src={asset.src}
              alt={asset.label}
              className="h-14 w-20 object-cover sm:h-16 sm:w-24"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* ── Lightbox ───────────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <Lightbox
          visuals={visuals}
          selectedIdx={selectedIdx}
          mcTitolo={mcTitolo}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
          onSelect={setSelectedIdx}
          lightboxRef={lightboxRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      )}
    </div>
  );
}

// ── Lightbox component ───────────────────────────────────────────────────────

interface LightboxProps {
  visuals: VisualAsset[];
  selectedIdx: number;
  mcTitolo: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
  lightboxRef: React.RefObject<HTMLDivElement | null>;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

function Lightbox({
  visuals,
  selectedIdx,
  mcTitolo,
  onClose,
  onPrev,
  onNext,
  onSelect,
  lightboxRef,
  onTouchStart,
  onTouchEnd,
}: LightboxProps) {
  const asset = visuals[selectedIdx];
  const total = visuals.length;

  return (
    <div
      ref={lightboxRef}
      className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`Galleria visuale — ${mcTitolo}`}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <p className="text-sm font-medium text-white/80">
          {asset.label}
          {(asset.kind === "generated" || asset.kind === "hero") && (
            <span className="ml-1 text-white/50">· Immagine AI</span>
          )}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/50">{selectedIdx + 1} / {total}</span>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Chiudi"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-12">
        {total > 1 && (
          <button
            onClick={onPrev}
            className="absolute left-2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
            aria-label="Immagine precedente"
          >
            <ChevronLeft />
          </button>
        )}

        <img
          src={asset.src}
          alt={`${asset.label} — ${mcTitolo}`}
          className="max-h-full max-w-full object-contain"
          style={{ userSelect: "none" }}
        />

        {total > 1 && (
          <button
            onClick={onNext}
            className="absolute right-2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
            aria-label="Immagine successiva"
          >
            <ChevronRight />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="flex shrink-0 justify-center gap-2 overflow-x-auto px-4 py-3">
          {visuals.map((v, i) => (
            <button
              key={v.src}
              onClick={() => onSelect(i)}
              className={`shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                i === selectedIdx ? "border-white" : "border-transparent opacity-50 hover:opacity-80"
              }`}
              aria-label={v.label}
            >
              <img
                src={v.src}
                alt={v.label}
                className="h-12 w-16 object-cover sm:h-14 sm:w-20"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────

function ZoomIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
