"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SDGBadgeDefinition } from "@/lib/sdg-badges";

interface BadgeUnlockToastProps {
  badge: SDGBadgeDefinition;
  onClose: () => void;
  publicBasePath?: string;
}

const AUTO_CLOSE_MS = 5000;

export default function BadgeUnlockToast({
  badge,
  onClose,
  publicBasePath = "",
}: BadgeUnlockToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Piccolo ritardo per triggerare la transizione CSS
    const t1 = setTimeout(() => setVisible(true), 30);
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, AUTO_CLOSE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onClose]);

  function dismiss() {
    setVisible(false);
    setTimeout(onClose, 400);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(6px)" : "none",
        transition: "background-color 0.35s ease, backdrop-filter 0.35s ease",
      }}
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label={`Badge sbloccato: ${badge.title}`}
    >
      <div
        className="relative w-full max-w-xs overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{
          transform: visible ? "scale(1) translateY(0)" : "scale(0.82) translateY(24px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.38s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fascia colore SDG in cima */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: badge.accent }}
        />

        <div className="flex flex-col items-center px-6 pb-6 pt-5 text-center">
          {/* Stellette decorative */}
          <p className="mb-3 text-2xl select-none">🎉✨🏆</p>

          {/* Badge SVG */}
          <div
            className="mb-4 flex h-28 w-28 items-center justify-center rounded-2xl p-2"
            style={{ backgroundColor: `${badge.accent}18` }}
          >
            <img
              src={`${publicBasePath}${badge.assetSrc}`}
              alt={badge.title}
              width={96}
              height={96}
              className="h-24 w-24 drop-shadow-md"
            />
          </div>

          {/* Titoli */}
          <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: badge.accent }}>
            {badge.shortTitle}
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-900">Badge sbloccato!</h2>
          <p className="mt-0.5 text-sm font-bold text-slate-700">{badge.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{badge.description}</p>

          {/* Azioni */}
          <div className="mt-5 flex w-full flex-col gap-2">
            <Link
              href="/progressi"
              className="rounded-full py-2.5 text-sm font-black text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: badge.accent }}
              onClick={dismiss}
            >
              Vedi i tuoi badge →
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-full border border-slate-200 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Continua a studiare
            </button>
          </div>

          <p className="mt-3 text-[9px] text-slate-300">Tocca fuori per chiudere</p>
        </div>
      </div>
    </div>
  );
}
