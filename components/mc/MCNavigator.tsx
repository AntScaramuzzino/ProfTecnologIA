"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import { cx } from "@/lib/ui";

export interface NavigatorTab {
  /** ID univoco della tab, corrisponde al titolo della sezione MD */
  id: string;
  /** Etichetta visualizzata */
  label: string;
  /** Emoji/icona opzionale */
  emoji?: string;
}

interface MCNavigatorProps {
  tabs: NavigatorTab[];
  /** areaHex per il colore dell'indicatore attivo */
  areaHex?: string;
  /** P1.3 — tab da attivare programmaticamente (es. da ResourcesPanel) */
  forcedActiveId?: string | null;
  /** Callback chiamata dopo che il forcedActiveId è stato consumato */
  onForcedTabConsumed?: () => void;
  children: (activeId: string) => React.ReactNode;
}

const DEFAULT_TABS: NavigatorTab[] = [
  { id: "INNESCA",   label: "INNESCA",   emoji: "⚡" },
  { id: "ESPLORA",   label: "ESPLORA",   emoji: "📖" },
  { id: "OSSERVA",   label: "OSSERVA",   emoji: "🔍" },
  { id: "SPERIMENTA",label: "SPERIMENTA",emoji: "🔬" },
  { id: "AGISCI",    label: "AGISCI",    emoji: "🌍" },
  { id: "RIPASSA",   label: "RIPASSA",   emoji: "🃏" },
];

export function MCNavigator({ tabs = DEFAULT_TABS, areaHex, forcedActiveId, onForcedTabConsumed, children }: MCNavigatorProps) {
  // Sempre parte da INNESCA (tabs[0]) — non legge localStorage per l'apertura iniziale
  const [activeId, setActiveId] = useState<string>(tabs[0]?.id ?? "INNESCA");

  const persistTab = useCallback((id: string) => {
    setActiveId(id);
  }, []);
  const navRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // WCAG 2.1.1 — keyboard navigation: ArrowLeft/ArrowRight tra i tab (WAI-ARIA Tabs pattern)
  const handleKeyDown = useCallback((e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = tabs[nextIndex];
      persistTab(nextTab.id);
      const btn = navRef.current?.querySelector<HTMLElement>(`[data-tab="${nextTab.id}"]`);
      btn?.focus();
    }
  }, [tabs, persistTab]);

  // P1.3 — forza navigazione programmatica dall'esterno (ResourcesPanel)
  useEffect(() => {
    if (forcedActiveId && tabs.some((t) => t.id === forcedActiveId)) {
      persistTab(forcedActiveId);
      onForcedTabConsumed?.();
    }
  }, [forcedActiveId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scorri il tab attivo in vista su mobile
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const btn = nav.querySelector<HTMLElement>(`[data-tab="${activeId}"]`);
    if (btn) {
      btn.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <div className="flex flex-col gap-0">
      {/* ── Tab bar ── */}
      <div
        ref={navRef}
        role="tablist"
        aria-label="Sezioni della micro-competenza"
        className={cx(
          "sticky top-0 z-20 flex overflow-x-auto bg-white/95 backdrop-blur-sm",
          "border-b border-slate-200 shadow-sm",
          // nasconde la scrollbar ma mantiene la funzionalità
          "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`${panelId}-panel`}
              aria-selected={isActive}
              data-tab={tab.id}
              onClick={() => persistTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tabs.indexOf(tab))}
              tabIndex={isActive ? 0 : -1}
              className={cx(
                "flex shrink-0 flex-col items-center gap-0 px-2 py-2 text-center",
                "text-[10px] font-black uppercase tracking-tight transition-colors duration-150",
                "min-w-[56px] sm:min-w-[80px] sm:gap-0.5 sm:px-4 sm:py-3 sm:text-sm sm:tracking-wider",
                "border-b-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                isActive
                  ? "border-b-current text-slate-900"
                  : "border-b-transparent text-slate-400 hover:text-slate-700",
              )}
              style={isActive && areaHex ? { borderBottomColor: areaHex, color: "#0f172a" } : undefined}
            >
              {tab.emoji && (
                <span className="text-sm leading-none sm:text-lg" aria-hidden>
                  {tab.emoji}
                </span>
              )}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Contenuto del tab attivo ── */}
      <div
        role="tabpanel"
        id={`${panelId}-panel`}
        aria-labelledby={`tab-${activeId}`}
        tabIndex={0}
        className="min-h-[40vh] focus-visible:outline-none"
      >
        {children(activeId)}
      </div>
    </div>
  );
}
