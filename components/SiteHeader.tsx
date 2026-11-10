"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  TIPI, EMOJI_TIPO, ETICHETTA_TIPO, preparaIndice, punteggio, estratto, tipoNelFiltro,
  type TipoRisultato, type VoceIndice, type VocePronta,
} from "@/lib/search";
import { useStudentSession } from "@/lib/useStudentSession";

const NAV_ANNO = [
  { href: "/anno/1", label: "Classe 1ª" },
  { href: "/anno/2", label: "Classe 2ª" },
  { href: "/anno/3", label: "Classe 3ª" },
];


// ── Command Palette: ricerca su lezioni, laboratori, escape room, esplorazioni, glossario e pagine ─────────────
// L'indice (/indice-ricerca.json) è generato al build e scaricato alla prima apertura.

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
let indiceCache: VocePronta[] | null = null;

const MAX_RISULTATI = 40;

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState<TipoRisultato | "tutto">("tutto");
  const [indice, setIndice] = useState<VocePronta[] | null>(indiceCache);
  const [errore, setErrore] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (indiceCache) return;
    let annullato = false;
    fetch(`${BASE_PATH}/indice-ricerca.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((voci: VoceIndice[]) => {
        indiceCache = preparaIndice(voci);
        if (!annullato) setIndice(indiceCache);
      })
      .catch(() => !annullato && setErrore(true));
    return () => { annullato = true; };
  }, []);

  const q = query.trim();
  const tutti = useMemo(() => {
    if (!indice || q.length < 2) return [];
    return indice
      .map((v) => ({ v, s: punteggio(v, q) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s);
  }, [indice, q]);

  const conteggi = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of TIPI) c[t.id] = t.id === "tutto" ? tutti.length : tutti.filter(({ v }) => tipoNelFiltro(v.tipo, t.id)).length;
    return c;
  }, [tutti]);

  const results = useMemo(
    () => tutti.filter(({ v }) => tipoNelFiltro(v.tipo, filtro)).slice(0, MAX_RISULTATI).map(({ v }) => v),
    [tutti, filtro],
  );

  useEffect(() => { setSelectedIdx(0); }, [q, filtro]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const apri = useCallback((v: VocePronta) => {
    onClose();
    // Embed statici e link con parametri (glossario ?q=) richiedono una navigazione piena
    if (v.statico || v.href.includes("?")) window.location.href = `${BASE_PATH}${v.href}`;
    else router.push(v.href);
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
      e.preventDefault();
      apri(results[selectedIdx]);
    }
  }

  useEffect(() => {
    const item = listRef.current?.children[selectedIdx] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cerca nel Book"
        className="fixed left-1/2 top-3 z-50 flex max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:top-[8vh] sm:max-h-[80vh]"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca lezioni, laboratori, esplorazioni, parole…"
            className="min-w-0 flex-1 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
            aria-label="Cerca nel Book"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={results.length ? `sr-${selectedIdx}` : undefined}
          />
          <button type="button" onClick={onClose} className="rounded border border-slate-200 px-1.5 py-0.5 font-mono text-[11px] text-slate-500 hover:bg-slate-50">
            <span className="hidden sm:inline">ESC</span>
            <span className="sm:hidden">Chiudi</span>
          </button>
        </div>

        {q.length >= 2 && tutti.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto border-b border-slate-100 px-3 py-2" role="tablist" aria-label="Filtra per tipo">
            {TIPI.filter((t) => t.id === "tutto" || conteggi[t.id] > 0).map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={filtro === t.id}
                onClick={() => { setFiltro(t.id); inputRef.current?.focus(); }}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  filtro === t.id ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t.emoji && <span aria-hidden>{t.emoji} </span>}{t.label} <span className="opacity-70">{conteggi[t.id]}</span>
              </button>
            ))}
          </div>
        )}

        {results.length > 0 ? (
          <ul ref={listRef} id="search-results" role="listbox" aria-label="Risultati" className="flex-1 overflow-y-auto py-1.5">
            {results.map((v, i) => {
              const brano = estratto(v, q);
              const attivo = i === selectedIdx;
              return (
                <li key={`${v.tipo}-${v.href}`} id={`sr-${i}`} role="option" aria-selected={attivo}>
                  <button
                    type="button"
                    onClick={() => apri(v)}
                    onMouseEnter={() => setSelectedIdx(i)}
                    className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors ${attivo ? "bg-emerald-50" : "hover:bg-slate-50"}`}
                  >
                    <span className="mt-0.5 text-base" aria-hidden>{EMOJI_TIPO[v.tipo]}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${attivo ? "text-emerald-900" : "text-slate-800"}`}>{v.titolo}</p>
                      <p className="truncate text-xs text-slate-500">
                        <span className="font-semibold text-slate-600">{ETICHETTA_TIPO[v.tipo]}</span> · {v.sotto}
                      </p>
                      {brano && <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{brano}</p>}
                    </div>
                    {v.statico && <span className="mt-0.5 text-xs text-slate-400" aria-label="apre l'esplorazione a schermo intero">↗</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-4 py-6 text-center text-sm text-slate-500">
            {errore
              ? "Non riesco a caricare l'indice di ricerca. Controlla la connessione e riprova."
              : !indice
                ? "Carico l'indice…"
                : q.length < 2
                  ? "Scrivi almeno due lettere: cerco tra lezioni, laboratori, escape room, esplorazioni immersive e glossario."
                  : `Nessun risultato per «${q}»`}
          </p>
        )}

        {tutti.length > MAX_RISULTATI && filtro === "tutto" && (
          <p className="border-t border-slate-100 px-4 py-1.5 text-center text-[11px] text-slate-500">
            Mostro i primi {MAX_RISULTATI} su {tutti.length}: usa i filtri o aggiungi una parola.
          </p>
        )}

        <div className="hidden items-center gap-3 border-t border-slate-100 px-4 py-2 text-[10px] text-slate-400 sm:flex">
          <span><kbd className="font-mono">↑↓</kbd> naviga</span>
          <span><kbd className="font-mono">↵</kbd> apri</span>
          <span><kbd className="font-mono">ESC</kbd> chiudi</span>
        </div>
      </div>
    </>
  );
}

// ── SiteHeader ───────────────────────────────────────────────────────────────

export default function SiteHeader() {
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
            aria-label="Book ProfTecnologIA — home"
            className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <span className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
              <span className="mr-1 rounded-md bg-emerald-700 px-1.5 py-0.5 text-xs font-black uppercase tracking-wider text-white sm:text-sm">Book</span>Prof<span className="text-emerald-700">TecnologIA</span>
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
              href="/laboratori"
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Laboratori
            </Link>

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
              aria-label="Cerca nel Book (⌘K)"
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
              aria-label="Cerca nel Book"
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
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-black text-emerald-800 hover:bg-emerald-50"
              >
                📘 Book ProfTecnologIA — Home
              </Link>
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
                href="/laboratori"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Laboratori
              </Link>
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
      {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
    </>
  );
}
