"use client";

import { useState, useEffect, useRef, useId } from "react";
import { cx } from "@/lib/ui";

interface RubricaRow {
  criterio: string;
  base: string;
  intermedio: string;
  avanzato: string;
}

interface RubricaDrawerProps {
  /** Testo grezzo della sezione AGISCI (body string dal content-loader) */
  agisciBody: string;
  /** Colore hex area per i dettagli cromatici */
  areaHex?: string;
  className?: string;
}

// ── Parser: estrae la prima tabella Markdown dalla sezione AGISCI ────────────

function parseRubricaTable(body: string): RubricaRow[] {
  // Cerca il blocco che contiene "Rubrica di valutazione"
  const rubricaMatch = body.match(
    /(?:#{1,4}\s*📋\s*Rubrica[^\n]*\n)([\s\S]*?)(?=\n#{1,4}|\n---|\n@@SUBHEAD:|$)/i,
  ) ??
  body.match(
    /(?:📋\s*Rubrica[^\n]*\n|@@SUBHEAD:.*?Rubrica[^\n]*\n)([\s\S]*?)(?=\n#{1,4}|\n---|\n@@SUBHEAD:|$)/i,
  );

  const tableSource = rubricaMatch ? rubricaMatch[1] : body;

  const lines = tableSource
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Trova le righe della tabella Markdown (iniziano con |)
  const tableLines = lines.filter(
    (l) => l.startsWith("|") && !/^\|?[\s:-]+\|[\s|:-]+$/.test(l),
  );

  if (tableLines.length < 2) return [];

  // Header (prima riga) — lo ignoriamo, usiamo label fisse
  const dataLines = tableLines.slice(1);

  return dataLines.map((line) => {
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c !== "");

    return {
      criterio:  cells[0] ?? "",
      base:      cells[1] ?? "",
      intermedio: cells[2] ?? "",
      avanzato:  cells[3] ?? "",
    };
  }).filter((r) => r.criterio);
}

// ── Componente ───────────────────────────────────────────────────────────────

export function RubricaDrawer({ agisciBody, areaHex, className = "" }: RubricaDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const drawerId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const rows = parseRubricaTable(agisciBody);

  // Chiudi con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Focus trap semplice: quando il drawer si apre, sposta il focus
  useEffect(() => {
    if (isOpen) {
      drawerRef.current?.focus();
    }
  }, [isOpen]);

  if (rows.length === 0) return null;

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={drawerId}
        onClick={() => setIsOpen(true)}
        className={cx(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black",
          "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2",
          "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
          className,
        )}
        style={areaHex ? { borderColor: areaHex, color: areaHex } : undefined}
      >
        <span aria-hidden>📋</span>
        Rubrica di valutazione
      </button>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm"
          aria-hidden
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Drawer panel (slide-in dal basso su mobile, da destra su desktop) ── */}
      <div
        ref={drawerRef}
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-label="Rubrica di valutazione"
        tabIndex={-1}
        className={cx(
          "fixed z-50 bg-white shadow-2xl outline-none",
          // Mobile: drawer dal basso (full-width, max 90vh)
          "bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl",
          // Desktop (≥768px): pannello laterale fisso a destra
          "md:bottom-0 md:left-auto md:right-0 md:top-0 md:h-full md:max-h-none md:w-[600px] md:max-w-[90vw] md:rounded-none md:rounded-l-2xl",
          "overflow-y-auto transition-transform duration-300 ease-out focus-visible:outline-none",
          isOpen
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-x-full",
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Rubrica di valutazione
            </p>
            <h2 className="text-base font-black text-slate-900 sm:text-lg">
              Criteri e livelli
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              triggerRef.current?.focus();
            }}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2"
            aria-label="Chiudi rubrica"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Legenda livelli */}
        <div className="flex gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-blue-700">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-400" aria-hidden /> ● Base
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden /> ●● Intermedio
          </span>
          <span className="flex items-center gap-1.5 text-orange-700">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-400" aria-hidden /> ●●● Avanzato
          </span>
        </div>

        {/* Criteri */}
        <div className="divide-y divide-slate-100 px-5 pb-8 pt-4">
          {rows.map((row, i) => (
            <RubricaRowCard key={i} row={row} areaHex={areaHex} />
          ))}
        </div>
      </div>
    </>
  );
}

function RubricaRowCard({ row, areaHex }: { row: RubricaRow; areaHex?: string }) {
  // Strip bold markdown from cell text
  const clean = (s: string) => s.replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1").trim();

  return (
    <div className="py-5">
      <h3
        className="mb-3 text-sm font-black text-slate-900"
        style={areaHex ? { color: areaHex } : undefined}
      >
        {clean(row.criterio)}
      </h3>
      <div className="grid gap-2 sm:grid-cols-3">
        <LevelCell dots="●" label="Base" text={clean(row.base)} colorClass="border-blue-300 bg-blue-50 text-blue-900" />
        <LevelCell dots="●●" label="Intermedio" text={clean(row.intermedio)} colorClass="border-emerald-300 bg-emerald-50 text-emerald-900" />
        <LevelCell dots="●●●" label="Avanzato" text={clean(row.avanzato)} colorClass="border-orange-300 bg-orange-50 text-orange-900" />
      </div>
    </div>
  );
}

function LevelCell({
  dots,
  label,
  text,
  colorClass,
}: {
  dots: string;
  label: string;
  text: string;
  colorClass: string;
}) {
  return (
    <div className={cx("rounded-lg border px-3 py-2.5 text-xs leading-5", colorClass)}>
      <p className="mb-1 font-black">
        <span className="mr-1 font-mono" aria-hidden>{dots}</span>
        {label}
      </p>
      <p>{text}</p>
    </div>
  );
}
