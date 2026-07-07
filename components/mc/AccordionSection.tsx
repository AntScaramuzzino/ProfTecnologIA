"use client";

import { useState, useId, useRef } from "react";
import { cx } from "@/lib/ui";

export interface AccordionItem {
  id: string;
  title: string;
  children: React.ReactNode;
}

interface AccordionSectionProps {
  items: AccordionItem[];
  /** Se true, il primo item è aperto per default */
  defaultFirstOpen?: boolean;
  /** Colore hex area per il bordo dell'item attivo */
  areaHex?: string;
  className?: string;
}

export function AccordionSection({
  items,
  defaultFirstOpen = true,
  areaHex,
  className = "",
}: AccordionSectionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(defaultFirstOpen && items[0] ? [items[0].id] : []),
  );

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className={cx("divide-y divide-slate-100", className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const headerId = `${baseId}-h-${item.id}`;
        const panelId = `${baseId}-p-${item.id}`;

        return (
          <div key={item.id} className="group">
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className={cx(
                  "flex w-full items-center justify-between gap-3 py-4 text-left",
                  "text-base font-black leading-snug text-slate-900 transition-colors",
                  "hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                  "sm:text-lg",
                )}
                style={
                  isOpen && areaHex
                    ? { color: areaHex }
                    : undefined
                }
              >
                <span>{item.title}</span>
                {/* Chevron animato */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={cx(
                    "size-5 shrink-0 transition-transform duration-200",
                    isOpen ? "rotate-180" : "rotate-0",
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
            </h3>

            {/* Pannello collassabile — usa grid-rows per animazione CSS senza JS height calc.
                inert quando chiuso: impedisce il focus su elementi interni (WCAG 2.1.1). */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={cx(
                "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore — inert è un attributo HTML5 standard, non ancora tipizzato in React */}
              <div className="min-h-0" {...(!isOpen ? { inert: "" } : {})}>
                <div className="pb-6 pt-1">
                  {item.children}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
