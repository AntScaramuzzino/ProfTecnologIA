"use client";

/**
 * ResourcesPanel — P1.3
 * Pannello aggregato che elenca tutte le risorse disponibili per una MC
 * (audio hook, video playlist, flashcard, quiz) con contatori e link rapidi.
 *
 * Posizionamento: dentro la zona INNESCA, dopo il player audio,
 * oppure come sezione separata nella aside desktop.
 *
 * Non carica i dati — riceve i contatori come props per restare
 * compatibile con il pattern Server Component → Client Component.
 */

import { useState } from "react";
import { cx } from "@/lib/ui";

export interface ResourcesSummary {
  /** true se c'è un audio hook disponibile */
  hasAudio: boolean;
  /** numero di video nella playlist */
  videoCount: number;
  /** numero di flashcard disponibili */
  flashcardCount: number;
  /** numero di domande quiz disponibili */
  quizCount: number;
  /** numero di immagini nella galleria visuale */
  visualCount: number;
  /** numero di slide della presentazione (deck NotebookLM in ESPLORA) */
  deckSlideCount?: number;
}

interface ResourcesPanelProps {
  summary: ResourcesSummary;
  /** Callback per navigare a una zona specifica via MCNavigator */
  onNavigate?: (zoneId: string) => void;
  /** Colore hex area */
  areaHex?: string;
  className?: string;
}

interface ResourceItem {
  icon: string;
  label: string;
  count: number | null;
  available: boolean;
  zoneId?: string;
  ariaLabel: string;
}

function buildItems(summary: ResourcesSummary): ResourceItem[] {
  return [
    {
      icon: "🎧",
      label: "Audio hook",
      count: null,
      available: summary.hasAudio,
      zoneId: "INNESCA",
      ariaLabel: summary.hasAudio ? "Audio hook disponibile" : "Audio hook non disponibile",
    },
    {
      icon: "📖",
      label: "Testo ESPLORA",
      count: null,
      available: true,
      zoneId: "ESPLORA",
      ariaLabel: "Vai alla zona ESPLORA",
    },
    {
      icon: "🎬",
      label: "Video",
      count: summary.videoCount,
      available: summary.videoCount > 0,
      zoneId: "OSSERVA",
      ariaLabel: `${summary.videoCount} video disponibili`,
    },
    {
      icon: "🔬",
      label: "Attività",
      count: null,
      available: true,
      zoneId: "SPERIMENTA",
      ariaLabel: "Attività in 3 livelli",
    },
    {
      icon: "📽️",
      label: "Presentazione",
      count: summary.deckSlideCount ?? null,
      available: (summary.deckSlideCount ?? 0) > 0,
      zoneId: "ESPLORA",
      ariaLabel:
        (summary.deckSlideCount ?? 0) > 0
          ? `Presentazione con ${summary.deckSlideCount} slide in ESPLORA`
          : "Presentazione non disponibile",
    },
    {
      icon: "🃏",
      label: "Flashcard",
      count: summary.flashcardCount,
      available: summary.flashcardCount > 0,
      zoneId: undefined,
      ariaLabel: `${summary.flashcardCount} flashcard per il ripasso`,
    },
    {
      icon: "✏️",
      label: "Quiz",
      count: summary.quizCount,
      available: summary.quizCount > 0,
      zoneId: undefined,
      ariaLabel: `${summary.quizCount} domande quiz`,
    },
  ];
}

export function ResourcesPanel({
  summary,
  onNavigate,
  areaHex,
  className = "",
}: ResourcesPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const items = buildItems(summary);
  const availableCount = items.filter((i) => i.available).length;

  return (
    <div
      className={cx(
        "rounded-xl border border-slate-200 bg-slate-50 overflow-hidden",
        className,
      )}
    >
      {/* Header — sempre visibile */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className={cx(
          "flex w-full items-center justify-between px-4 py-3 text-left",
          "text-sm font-black text-slate-700 hover:bg-slate-100 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
        )}
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden>📦</span>
          Risorse disponibili
          <span
            className="ml-1 rounded-full px-2 py-0.5 text-xs font-black text-white"
            style={{ backgroundColor: areaHex ?? "#64748b" }}
          >
            {availableCount}
          </span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={cx(
            "size-4 shrink-0 text-slate-400 transition-transform duration-200",
            expanded ? "rotate-180" : "rotate-0",
          )}
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Griglia risorse — collassabile */}
      <div
        className={cx(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <div className="grid grid-cols-2 gap-2 px-4 pb-4 pt-2 sm:grid-cols-3">
            {items.map((item) => (
              <ResourceChip
                key={item.label}
                item={item}
                areaHex={areaHex}
                onNavigate={item.zoneId && onNavigate ? () => onNavigate(item.zoneId!) : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceChip({
  item,
  areaHex,
  onNavigate,
}: {
  item: ResourceItem;
  areaHex?: string;
  onNavigate?: () => void;
}) {
  const base = cx(
    "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
    "border focus-visible:outline-none focus-visible:ring-2",
    item.available
      ? "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      : "border-slate-100 bg-slate-50 text-slate-300 cursor-default",
  );

  const inner = (
    <>
      <span className="text-base leading-none" aria-hidden>{item.icon}</span>
      <span className="flex-1 leading-snug">{item.label}</span>
      {item.count !== null && item.available && (
        <span
          className="ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-black text-white"
          style={{ backgroundColor: areaHex ?? "#64748b" }}
        >
          {item.count}
        </span>
      )}
      {!item.available && (
        <span className="ml-auto text-[10px] text-slate-300" aria-hidden>—</span>
      )}
    </>
  );

  if (onNavigate && item.available) {
    return (
      <button
        type="button"
        onClick={onNavigate}
        className={base}
        aria-label={item.ariaLabel}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={base} aria-label={item.ariaLabel} role="img">
      {inner}
    </div>
  );
}
