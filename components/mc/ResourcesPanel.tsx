"use client";

/**
 * ResourcesPanel — mappa dei materiali della MC, nella zona INNESCA.
 * Elenca, zona per zona, tutto ciò che la MC offre (audio, testo, immagini e video animati,
 * presentazione, costruzioni GeoGebra, laboratorio interattivo, escape room, compito di realtà,
 * microlearning, quiz, flashcard, professioni, CLIL) con i conteggi e un pulsante che porta alla zona.
 *
 * Non carica i dati: riceve i conteggi da MCPageClient (Server Component → Client Component).
 */

import { useState } from "react";
import { cx } from "@/lib/ui";

export interface ResourcesSummary {
  /** Audio hook della zona INNESCA */
  hasAudio: boolean;
  /** Video della playlist: i primi 3 in INNESCA (flipped classroom), gli altri in OSSERVA */
  videoCount: number;
  /** Paragrafi del testo ESPLORA */
  esploraParagraphCount?: number;
  /** Immagini illustrative dei paragrafi ESPLORA */
  esploraImageCount?: number;
  /** Schemi didattici disegnati per i paragrafi ESPLORA */
  schemaCount?: number;
  /** Video animati dei paragrafi ESPLORA */
  esploraVideoCount?: number;
  /** Slide della presentazione (deck in ESPLORA) */
  deckSlideCount?: number;
  /** Costruzioni e animazioni GeoGebra (ESPLORA / SPERIMENTA) */
  geogebraCount?: number;
  /** Immagini e schemi nelle gallerie di ESPLORA, OSSERVA, RIPASSA, AGISCI */
  visualCount: number;
  /** Laboratorio interattivo (SPERIMENTA) */
  laboratorio?: { titolo: string; archetipo: string } | null;
  /** Escape room (SPERIMENTA) */
  escapeRoom?: { titolo: string } | null;
  /** Compito di realtà (AGISCI) */
  hasCompito?: boolean;
  /** Attività di microlearning (processo, checklist) in RIPASSA */
  microlearningCount?: number;
  quizCount: number;
  flashcardCount: number;
  /** Professioni del futuro */
  professioniCount?: number;
  /** Termini CLIL + appendice in inglese */
  clilCount?: number;
  hasAppendice?: boolean;
}

interface ResourcesPanelProps {
  summary: ResourcesSummary;
  /** Naviga a una zona del MCNavigator */
  onNavigate?: (zoneId: string) => void;
  /** Zone presenti in questa MC (le altre non sono cliccabili) */
  availableZones?: string[];
  areaHex?: string;
  className?: string;
}

interface ResourceItem {
  icon: string;
  label: string;
  detail?: string;
  count: number | null;
  available: boolean;
}

interface ZoneGroup {
  zoneId: string;
  label: string;
  items: ResourceItem[];
}

function buildGroups(s: ResourcesSummary): ZoneGroup[] {
  const flipped = Math.min(3, s.videoCount);
  const osserva = Math.max(0, s.videoCount - 3);
  const groups: ZoneGroup[] = [
    {
      zoneId: "INNESCA",
      label: "Innesca",
      items: [
        { icon: "🎧", label: "Audio di apertura", count: null, available: s.hasAudio },
        { icon: "▶️", label: "Video per la classe capovolta", count: flipped, available: flipped > 0 },
      ],
    },
    {
      zoneId: "ESPLORA",
      label: "Esplora",
      items: [
        { icon: "📖", label: "Paragrafi del testo", count: s.esploraParagraphCount ?? null, available: (s.esploraParagraphCount ?? 1) > 0 },
        { icon: "📽️", label: "Slide della presentazione", count: s.deckSlideCount ?? 0, available: (s.deckSlideCount ?? 0) > 0 },
        { icon: "🖼️", label: "Illustrazioni dei paragrafi", count: s.esploraImageCount ?? 0, available: (s.esploraImageCount ?? 0) > 0 },
        { icon: "📊", label: "Schemi didattici", count: s.schemaCount ?? 0, available: (s.schemaCount ?? 0) > 0 },
        { icon: "🎞️", label: "Video animati", count: s.esploraVideoCount ?? 0, available: (s.esploraVideoCount ?? 0) > 0 },
        { icon: "📐", label: "Costruzioni GeoGebra", count: s.geogebraCount ?? 0, available: (s.geogebraCount ?? 0) > 0 },
      ],
    },
    {
      zoneId: "OSSERVA",
      label: "Osserva",
      items: [{ icon: "🎬", label: "Video", count: osserva, available: osserva > 0 }],
    },
    {
      zoneId: "SPERIMENTA",
      label: "Sperimenta",
      items: [
        {
          icon: "🧪",
          label: "Laboratorio interattivo",
          detail: s.laboratorio ? `${s.laboratorio.titolo} · ${s.laboratorio.archetipo} · 3 livelli` : undefined,
          count: null,
          available: !!s.laboratorio,
        },
        {
          icon: "🔐",
          label: "Escape room",
          detail: s.escapeRoom ? `${s.escapeRoom.titolo} · 5 lucchetti` : undefined,
          count: null,
          available: !!s.escapeRoom,
        },
      ],
    },
    {
      zoneId: "AGISCI",
      label: "Agisci",
      items: [{ icon: "🌍", label: "Compito di realtà", count: null, available: !!s.hasCompito }],
    },
    {
      zoneId: "RIPASSA",
      label: "Ripassa",
      items: [
        { icon: "⚡", label: "Microlearning", count: s.microlearningCount ?? 0, available: (s.microlearningCount ?? 0) > 0 },
        { icon: "✏️", label: "Domande di quiz", count: s.quizCount, available: s.quizCount > 0 },
        { icon: "🃏", label: "Flashcard", count: s.flashcardCount, available: s.flashcardCount > 0 },
      ],
    },
    {
      zoneId: "PROFESSIONE",
      label: "Professioni",
      items: [{ icon: "💼", label: "Professioni del futuro", count: s.professioniCount ?? 0, available: (s.professioniCount ?? 0) > 0 }],
    },
    {
      zoneId: "CLIL",
      label: "CLIL",
      items: [
        { icon: "🇬🇧", label: "Termini in inglese", count: s.clilCount ?? 0, available: (s.clilCount ?? 0) > 0 },
        { icon: "📎", label: "Tech in English", count: null, available: !!s.hasAppendice },
      ],
    },
  ];
  return groups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.available) }))
    .filter((g) => g.items.length > 0);
}

export function ResourcesPanel({
  summary,
  onNavigate,
  availableZones,
  areaHex,
  className = "",
}: ResourcesPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const groups = buildGroups(summary);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const color = areaHex ?? "#64748b";

  return (
    <div className={cx("overflow-hidden rounded-xl border border-slate-200 bg-slate-50", className)}>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className={cx(
          "flex w-full items-center justify-between px-4 py-3 text-left",
          "text-sm font-black text-slate-700 transition-colors hover:bg-slate-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
        )}
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden>📦</span>
          Materiali di questa micro-competenza
          <span className="ml-1 rounded-full px-2 py-0.5 text-xs font-black text-white" style={{ backgroundColor: color }}>
            {total}
          </span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={cx("size-4 shrink-0 text-slate-400 transition-transform duration-200", expanded ? "rotate-180" : "rotate-0")}
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className={cx(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <ul className="grid gap-3 px-4 pb-4 pt-1 sm:grid-cols-2">
            {groups.map((g) => {
              const canGo = !!onNavigate && (!availableZones || availableZones.includes(g.zoneId));
              return (
                <li key={g.zoneId} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>
                      {g.label}
                    </span>
                    {canGo && (
                      <button
                        type="button"
                        onClick={() => onNavigate!(g.zoneId)}
                        className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2"
                        aria-label={`Vai alla zona ${g.label}`}
                      >
                        Vai →
                      </button>
                    )}
                  </div>
                  <ul className="space-y-1.5">
                    {g.items.map((i) => (
                      <li key={i.label} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="text-base leading-none" aria-hidden>
                          {i.icon}
                        </span>
                        <span className="flex-1 leading-snug">
                          <span className="font-semibold">{i.label}</span>
                          {i.detail && <span className="block text-[11px] text-slate-500">{i.detail}</span>}
                        </span>
                        {i.count !== null && (
                          <span
                            className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-black text-white"
                            style={{ backgroundColor: color }}
                          >
                            {i.count}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
