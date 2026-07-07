"use client";

import { useState, useId, useRef } from "react";
import { cx } from "@/lib/ui";

export type DigCompLevel = "F" | "I" | "A";

export interface LevelTab {
  level: DigCompLevel;
  label: string;
  /** simbolo pallini ●/●●/●●● */
  dots: string;
  children: React.ReactNode;
}

interface LevelTabsProps {
  tabs: LevelTab[];
  /** Livello DigComp della MC — determina il tab aperto di default */
  defaultLevel?: DigCompLevel;
  className?: string;
}

const LEVEL_STYLES: Record<DigCompLevel, { active: string; badge: string; dot: string }> = {
  F: {
    active: "border-blue-500 text-blue-800 bg-blue-50",
    badge:  "bg-blue-100 text-blue-800",
    dot:    "text-blue-500",
  },
  I: {
    active: "border-emerald-500 text-emerald-800 bg-emerald-50",
    badge:  "bg-emerald-100 text-emerald-800",
    dot:    "text-emerald-500",
  },
  A: {
    active: "border-orange-500 text-orange-800 bg-orange-50",
    badge:  "bg-orange-100 text-orange-800",
    dot:    "text-orange-500",
  },
};

const LEVEL_LABEL: Record<DigCompLevel, string> = {
  F: "Base",
  I: "Intermedio",
  A: "Avanzato",
};

export function LevelTabs({ tabs, defaultLevel, className = "" }: LevelTabsProps) {
  const baseId = useId();
  // Default: livello MC, oppure il primo tab disponibile
  const initialLevel =
    defaultLevel && tabs.find((t) => t.level === defaultLevel)
      ? defaultLevel
      : tabs[0]?.level ?? "F";
  const [active, setActive] = useState<DigCompLevel>(initialLevel);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeTab = tabs.find((t) => t.level === active) ?? tabs[0];

  // WAI-ARIA Tabs: frecce spostano il focus E selezionano il tab (automatic activation)
  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    let targetIdx: number | null = null;
    if (e.key === "ArrowRight") targetIdx = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") targetIdx = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") targetIdx = 0;
    else if (e.key === "End") targetIdx = tabs.length - 1;
    if (targetIdx !== null) {
      e.preventDefault();
      const target = tabs[targetIdx];
      setActive(target.level);
      tabRefs.current[target.level]?.focus();
    }
  }

  return (
    <div className={cx("rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden", className)}>
      {/* ── Tab bar livelli ── */}
      <div
        role="tablist"
        aria-label="Livello di difficoltà"
        className="flex border-b border-slate-200 bg-slate-50"
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.level === active;
          const s = LEVEL_STYLES[tab.level];
          return (
            <button
              key={tab.level}
              ref={(el) => { tabRefs.current[tab.level] = el; }}
              role="tab"
              id={`${baseId}-tab-${tab.level}`}
              aria-controls={`${baseId}-panel-${tab.level}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab.level)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cx(
                "flex-1 py-3 px-2 text-center text-xs font-black uppercase tracking-wider",
                "border-b-[3px] transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
                "sm:py-4 sm:text-sm",
                isActive
                  ? cx("border-b-current", s.active)
                  : "border-b-transparent text-slate-400 hover:text-slate-700 hover:bg-white",
              )}
            >
              {/* dots */}
              <span className={cx("mr-1 font-mono", isActive ? s.dot : "text-slate-300")} aria-hidden>
                {tab.dots}
              </span>
              {tab.label || LEVEL_LABEL[tab.level]}
            </button>
          );
        })}
      </div>

      {/* ── Contenuto livello attivo ── */}
      {activeTab && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeTab.level}`}
          aria-labelledby={`${baseId}-tab-${activeTab.level}`}
          tabIndex={0}
          className="p-4 focus-visible:outline-none sm:p-6"
        >
          {activeTab.children}
        </div>
      )}
    </div>
  );
}

/** Helper per costruire i tab da un array di sezioni già splittate dal content-loader */
export function buildLevelTabs(
  sections: { level: DigCompLevel; title: string; children: React.ReactNode }[],
): LevelTab[] {
  const dotsMap: Record<DigCompLevel, string> = { F: "●", I: "●●", A: "●●●" };
  return sections.map((s) => ({
    level: s.level,
    label: s.title || LEVEL_LABEL[s.level],
    dots: dotsMap[s.level],
    children: s.children,
  }));
}
