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
  const navRef   = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId  = useId();
  // Flag per saltare lo scroll al mount iniziale
  const isFirstMount = useRef(true);

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

  // Mobile — porta il tab attivo al centro della barra scorrendo SOLO in orizzontale.
  // (scrollIntoView muoveva anche la pagina in verticale, al mount e al cambio tab)
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || nav.scrollWidth <= nav.clientWidth) return;
    const btn = nav.querySelector<HTMLElement>(`[data-tab="${activeId}"]`);
    if (!btn) return;
    const left = btn.offsetLeft - (nav.clientWidth - btn.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, left), behavior: isFirstMount.current ? "auto" : "smooth" });
  }, [activeId]);

  // Mobile — sfumature ai bordi solo se ci sono tab nascosti da quel lato
  const [edges, setEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const update = () => {
      const max = nav.scrollWidth - nav.clientWidth;
      setEdges({ left: nav.scrollLeft > 4, right: nav.scrollLeft < max - 4 });
    };
    update();
    nav.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(nav);
    return () => { nav.removeEventListener("scroll", update); ro.disconnect(); };
  }, [activeId]);

  // P2.4 — scroll-to-top del pannello al cambio tab (UX mobile e desktop)
  // Salta il mount iniziale: l'utente arriva sulla pagina nella posizione corretta.
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    const panel = panelRef.current;
    if (!panel) return;
    // 56 px SiteHeader + 48 px tab bar = 104 px di offset sticky cumulativo
    const panelTop = panel.getBoundingClientRect().top + window.scrollY - 104;
    window.scrollTo({ top: Math.max(0, panelTop), behavior: "smooth" });
  }, [activeId]);

  return (
    <div className="flex flex-col gap-0">
      {/* ── Tab bar ── */}
      {/* top-14 = 56 px — offset per il SiteHeader sticky (h ≈ 56 px) */}
      <div className="sticky top-14 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div
        aria-hidden
        className={cx(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-white to-transparent transition-opacity sm:hidden",
          edges.left ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden
        className={cx(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-white to-transparent transition-opacity sm:hidden",
          edges.right ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={navRef}
        role="tablist"
        aria-label="Sezioni della micro-competenza"
        className={cx(
          "flex overflow-x-auto overscroll-x-contain",
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
              title={tab.label}
              className={cx(
                // mobile: riga compatta, target ≥ 44 px, tutti i tab visibili
                "flex shrink-0 items-center justify-center gap-1.5 min-h-[44px] px-2 text-center",
                "text-[11px] font-black uppercase tracking-tight transition-colors duration-150",
                isActive ? "flex-none px-3 bg-[var(--tab-tint)] sm:bg-transparent" : "flex-1 min-w-[40px]",
                // desktop (sm+): layout originale a colonna con etichette sempre visibili
                "sm:flex-none sm:flex-col sm:gap-0.5 sm:min-w-[80px] sm:px-4 sm:py-3 sm:text-sm sm:tracking-wider",
                "border-b-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
                isActive
                  ? "border-b-current text-slate-900"
                  : "border-b-transparent text-slate-400 hover:text-slate-700",
              )}
              style={
                isActive && areaHex
                  ? ({ borderBottomColor: areaHex, color: "#0f172a", "--tab-tint": `${areaHex}14` } as React.CSSProperties)
                  : undefined
              }
            >
              {tab.emoji && (
                <span
                  className={cx(
                    "text-lg leading-none transition-[filter,opacity] sm:text-lg",
                    !isActive && "opacity-60 grayscale sm:opacity-100 sm:grayscale-0",
                  )}
                  aria-hidden
                >
                  {tab.emoji}
                </span>
              )}
              <span className={cx("whitespace-nowrap", !isActive && "sr-only sm:not-sr-only")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      </div>

      {/* ── Contenuto del tab attivo ── */}
      <div
        ref={panelRef}
        role="tabpanel"
        id={`${panelId}-panel`}
        aria-labelledby={`tab-${activeId}`}
        tabIndex={0}
        /* scroll-mt-28 = 112 px — accounts for sticky SiteHeader (~56px) + this tab bar (~48px)
           so keyboard-focus / scroll-into-view never hides the first panel element */
        className="min-h-[40vh] scroll-mt-28 focus-visible:outline-none"
      >
        {children(activeId)}
      </div>
    </div>
  );
}
