"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_ANNO = [
  { href: "/anno/1", label: "Classe 1ª" },
  { href: "/anno/2", label: "Classe 2ª" },
  { href: "/anno/3", label: "Classe 3ª" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          <span className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
            Prof<span className="text-emerald-700">TecnologIA</span>
          </span>
          <span className="rounded-full border border-emerald-300 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
            v0.1
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          className="hidden items-center gap-0.5 sm:flex"
          aria-label="Navigazione principale"
        >
          {NAV_ANNO.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {label}
            </Link>
          ))}

          <span className="mx-1.5 h-4 w-px bg-slate-200" aria-hidden="true" />

          <Link
            href="/glossario"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Glossario
          </Link>
          <Link
            href="/architettura"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Architettura
          </Link>

          <Link
            href="/#catalogo"
            className="ml-2 rounded-full bg-emerald-700 px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Catalogo
          </Link>
        </nav>

        {/* ── Hamburger — mobile only ── */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:hidden"
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 sm:hidden"
        >
          <nav className="flex flex-col gap-0.5" aria-label="Navigazione mobile">
            {NAV_ANNO.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {label}
              </Link>
            ))}

            <div className="my-1 h-px bg-slate-100" role="separator" />

            <Link
              href="/glossario"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Glossario
            </Link>
            <Link
              href="/architettura"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Architettura
            </Link>

            <Link
              href="/#catalogo"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-emerald-700 px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Esplora il catalogo →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
