"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cercaCompetenza, type CompetenzaEntry } from "@/lib/competenze-glossario";

interface CompetenzaTagProps {
  competenza: string;
  areaHex?: string;
}

interface PopoverState {
  visible: boolean;
  entry: CompetenzaEntry | null;
  label: string;
}

export default function CompetenzaTag({ competenza, areaHex }: CompetenzaTagProps) {
  const [popover, setPopover] = useState<PopoverState>({
    visible: false,
    entry: null,
    label: "",
  });
  const tagRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const entry = cercaCompetenza(competenza);

  const close = useCallback(() => {
    setPopover({ visible: false, entry: null, label: "" });
  }, []);

  const toggle = () => {
    if (popover.visible) {
      close();
    } else {
      setPopover({ visible: true, entry, label: competenza });
    }
  };

  // Chiudi su click fuori
  useEffect(() => {
    if (!popover.visible) return;
    const handle = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        tagRef.current &&
        !tagRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [popover.visible, close]);

  // Chiudi su ESC
  useEffect(() => {
    if (!popover.visible) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [popover.visible, close]);

  // Stile del tag — con definizione = cliccabile e sottolineato tratteggiato
  const hasDefinition = !!entry;
  const borderColor = areaHex ? `${areaHex}55` : "#d1d5db";
  const bgColor = areaHex ? `${areaHex}0D` : "#f8fafc";

  return (
    <span className="relative inline-block">
      <button
        ref={tagRef}
        type="button"
        onClick={toggle}
        aria-expanded={popover.visible}
        aria-haspopup={hasDefinition ? "dialog" : undefined}
        className={[
          "rounded-full border px-2.5 py-0.5 text-xs font-semibold text-slate-700 transition-all",
          hasDefinition
            ? "cursor-pointer underline decoration-dotted underline-offset-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-1"
            : "cursor-default",
        ].join(" ")}
        style={{ borderColor, backgroundColor: bgColor }}
        title={hasDefinition ? `Clicca per vedere la definizione di "${competenza}"` : competenza}
      >
        {entry?.emoji ? `${entry.emoji} ` : ""}{competenza}
      </button>

      {popover.visible && popover.entry && (
        <>
          {/* Overlay mobile semi-trasparente */}
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            aria-hidden="true"
            onClick={close}
          />

          {/* Popover */}
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={`Definizione: ${popover.label}`}
            className={[
              "absolute z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white shadow-xl",
              // posizionamento sotto il tag, allineato a sinistra
              "left-0 top-full mt-2",
              // su mobile: fixed centrato
              "sm:absolute sm:left-0 sm:top-full",
            ].join(" ")}
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between gap-2 rounded-t-2xl px-4 py-3"
              style={{ backgroundColor: areaHex ? `${areaHex}15` : "#f8fafc" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">
                  {popover.entry.emoji}
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {popover.entry.categoria}
                  </p>
                  <p className="text-sm font-black leading-tight text-slate-900 capitalize">
                    {popover.label}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Chiudi"
                className="shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M1.5 1.5l11 11M12.5 1.5l-11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Corpo */}
            <div className="space-y-3 px-4 py-4">
              {/* Definizione */}
              <p className="text-sm leading-6 text-slate-700">
                {popover.entry.definizione}
              </p>

              {/* Esempio */}
              {popover.entry.esempio && (
                <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-amber-600">
                    Esempio concreto
                  </p>
                  <p className="text-xs leading-5 text-amber-900">
                    {popover.entry.esempio}
                  </p>
                </div>
              )}

              {/* Area correlata */}
              {popover.entry.area_correlata && (
                <p className="text-[10px] text-slate-400">
                  Area correlata:{" "}
                  <span className="font-mono font-semibold">
                    {popover.entry.area_correlata}
                  </span>
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </span>
  );
}
