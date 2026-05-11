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
];

export function MCNavigator({ tabs = DEFAULT_TABS, areaHex, forcedActiveId, onForcedTabConsumed, children }: MCNavigatorProps) {
  // P1.2 — localStorage persistence (mcId opzionale per namespace per MC)
  const storageKey = `mc-nav-tab-${tabs.map(t => t.id).join(",")}`;
  const [activeId, setActiveId] = useState<string>(() => {
    // Non accedere a localStorage durante SSR
    if (typeof window === "undefined") return tabs[0]?.id ?? "INNESCA";
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved && tabs.some((t) => t.id === saved)) return saved;
    } catch { /* ignore */ }
    return tabs[0]?.id ?? "INNESCA";
  });

  // Persiste la tab attiva su localStorage ad ogni cambio
  const persistTab = useCallback((id: string) => {
    setActiveId(id);
    try { window.localStorage.setItem(storageKey, id); } catch { /* ignore */ }
  }, [storageKey]);
  const navRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

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
              className={cx(
                "flex shrink-0 flex-col items-center gap-0.5 px-3 py-2.5 text-center",
                "text-xs font-black uppercase tracking-wider transition-colors duration-150",
                "min-w-[72px] sm:min-w-[88px] sm:px-4 sm:py-3 sm:text-sm",
                "border-b-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                isActive
                  ? "border-b-current text-slate-900"
                  : "border-b-transparent text-slate-400 hover:text-slate-700",
              )}
              style={isActive && areaHex ? { borderBottomColor: areaHex, color: "#0f172a" } : undefined}
            >
              {tab.emoji && (
                <span className="text-base leading-none sm:text-lg" aria-hidden>
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
