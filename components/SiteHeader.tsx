"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useStudentSession } from "@/lib/useStudentSession";

const NAV_ANNO = [
  { href: "/anno/1", label: "Classe 1ª" },
  { href: "/anno/2", label: "Classe 2ª" },
  { href: "/anno/3", label: "Classe 3ª" },
];

const AREA_EMOJI: Record<string, string> = {
  MAT: "🪨", DIS: "📐", DIG: "💻", ALI: "🌾",
  AMB: "🏗️", ENE: "⚡", COM: "📡", SIS: "⚙️", INF: "🖥️",
};

// Tipo minimale dell'indice di ricerca (serializzato dal server in layout.tsx)
export interface MCIndexEntry {
  id: string;
  titolo: string;
  area: string;
  anno: number;
  tags: string[];
}

function scoreMatch(query: string, mc: MCIndexEntry): number {
  const q = query.toLowerCase();
  const title = mc.titolo.toLowerCase();
  const id = mc.id.toLowerCase();
  const tags = (mc.tags ?? []).join(" ").toLowerCase();
  if (title.startsWith(q) || id.startsWith(q)) return 3;
  if (title.includes(q) || id.includes(q)) return 2;
  if (tags.includes(q)) return 1;
  return 0;
}

// ── Command Palette ──────────────────────────────────────────────────────────

interface CommandPaletteProps {
  onClose: () => void;
  mcIndex: MCIndexEntry[];
}

function CommandPalette({ onClose, mcIndex }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  const results = query.trim().length < 1
    ? []
    : mcIndex
        .map((mc) => ({ mc, score: scoreMatch(query.trim(), mc) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || a.mc.anno - b.mc.anno)
        .slice(0, 8)
        .map(({ mc }) => mc);

  // Reset selection when results change
  useEffect(() => { setSelectedIdx(0); }, [query]);

  // Focus input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  const navigate = useCallback((mcId: string) => {
    router.push(`/mc/${mcId}`);
    onClose();
  }, [router, onClose]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { onClose(); return; }
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      navigate(results[selectedIdx].id);
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.children[selectedIdx] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ricerca micro-competenze"
        className="fixed left-1/2 top-[10vh] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
        onKeyDown={handleKeyDown}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca competenza, area, tag…"
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            aria-label="Query di ricerca"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={results.length ? `sr-${results[selectedIdx]?.id}` : undefined}
          />
          <kbd className="hidden rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 sm:inline">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul
            ref={listRef}
            id="search-results"
            role="listbox"
            aria-label="Risultati"
            className="max-h-72 overflow-y-auto py-1.5"
          >
            {results.map((mc, i) => (
              <li
                key={mc.id}
                id={`sr-${mc.id}`}
                role="option"
                aria-selected={i === selectedIdx}
              >
                <button
                  type="button"
                  onClick={() => navigate(mc.id)}
                  onMouseEnter={() => setSelectedIdx(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selectedIdx ? "bg-emerald-50" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="text-base" aria-hidden>{AREA_EMOJI[mc.area] ?? "📚"}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold ${i === selectedIdx ? "text-emerald-900" : "text-slate-800"}`}>
                      {mc.titolo}
                    </p>
                    <p className="text-xs text-slate-400">{mc.id} · Classe {mc.anno}ª</p>
                  </div>
                  <svg className={`h-3.5 w-3.5 shrink-0 ${i === selectedIdx ? "text-emerald-600" : "text-transparent"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : query.trim().length > 0 ? (
          <p className="px-4 py-6 text-center text-sm text-slate-400">
            Nessuna competenza trovata per «{query.trim()}»
          </p>
        ) : (
          <p className="px-4 py-4 text-center text-xs text-slate-400">
            Digita per cercare tra le 52 micro-competenze
          </p>
        )}

        {/* Footer hint */}
        <div className="border-t border-slate-100 px-4 py-2 flex items-center gap-3 text-[10px] text-slate-400">
          <span><kbd className="font-mono">↑↓</kbd> naviga</span>
          <span><kbd className="font-mono">↵</kbd> apri</span>
          <span><kbd className="font-mono">ESC</kbd> chiudi</span>
        </div>
      </div>
    </>
  );
}

// ── SiteHeader ───────────────────────────────────────────────────────────────

interface SiteHeaderProps {
  mcIndex?: MCIndexEntry[];
}

export default function SiteHeader({ mcIndex = [] }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { hydrated, studentName, hasStudentName } = useStudentSession();

  // ⌘K / Ctrl+K apre la palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
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
              href="/progressi"
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              📊 Progressi
            </Link>

            {hydrated && hasStudentName && (
              <Link
                href="/progressi"
                className="max-w-32 truncate rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-800 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title={`Sessione di ${studentName}`}
              >
                Ciao {studentName}
              </Link>
            )}

            {/* ── Search button (desktop) ── */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Cerca micro-competenza (⌘K)"
              className="ml-1.5 flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
              </svg>
              <span className="text-xs">Cerca</span>
              <kbd className="ml-0.5 rounded border border-slate-200 px-1 py-0.5 font-mono text-[10px] text-slate-400">⌘K</kbd>
            </button>

            <Link
              href="/#catalogo"
              className="ml-2 rounded-full bg-emerald-700 px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Catalogo
            </Link>
          </nav>

          {/* ── Mobile: search icon + hamburger ── */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Cerca"
              className="flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
              </svg>
            </button>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {menuOpen ? (
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
        </div>

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 sm:hidden"
          >
            <nav className="flex flex-col gap-0.5" aria-label="Navigazione mobile">
              {NAV_ANNO.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {label}
                </Link>
              ))}

              <div className="my-1 h-px bg-slate-100" role="separator" />

              <Link
                href="/glossario"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Glossario
              </Link>
              <Link
                href="/progressi"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                📊 Progressi{hydrated && hasStudentName ? ` · ${studentName}` : ""}
              </Link>
              <Link
                href="/architettura"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Architettura
              </Link>

              <Link
                href="/#catalogo"
                onClick={() => setMenuOpen(false)}
                className="mt-1 rounded-full bg-emerald-700 px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                Esplora il catalogo →
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* ── Command palette (portal-level, z-50) ── */}
      {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} mcIndex={mcIndex} />}
    </>
  );
}
