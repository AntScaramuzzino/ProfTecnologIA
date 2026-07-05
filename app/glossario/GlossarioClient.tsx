"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GLOSSARIO, CATEGORIE, type CompetenzaEntry } from "@/lib/competenze-glossario";

// ── Mappa colori per categoria ───────────────────────────────────────────────
const COLORI_CATEGORIA: Record<string, string> = {
  "Sostenibilità":              "#10B981",
  "Sostenibilità aziendale":    "#059669",
  "Sostenibilità ambientale":   "#34D399",
  "Energia":                    "#F59E0B",
  "Energia solare":             "#FBBF24",
  "Energia eolica":             "#FCD34D",
  "Cybersecurity":              "#EF4444",
  "Privacy e diritto digitale": "#F87171",
  "Competenze digitali":        "#6366F1",
  "Progettazione":              "#3B82F6",
  "Progettazione e manifattura":"#2563EB",
  "Software di progettazione":  "#60A5FA",
  "Software BIM":               "#93C5FD",
  "Software":                   "#818CF8",
  "Architettura e costruzioni":  "#F97316",
  "Urbanistica":                "#EA580C",
  "Trasporti":                  "#0EA5E9",
  "Trasporti e supply chain":   "#38BDF8",
  "Logistica":                  "#7DD3FC",
  "Supply chain":               "#BAE6FD",
  "Industria alimentare":       "#84CC16",
  "Nutrizione":                 "#A3E635",
  "Qualità agroalimentare":     "#BEF264",
  "Comunicazione digitale":     "#8B5CF6",
  "Marketing digitale":         "#A78BFA",
  "Comunicazione":              "#C4B5FD",
  "Business":                   "#64748B",
  "Business e tecnologia":      "#475569",
  "Imprenditorialità":          "#F43F5E",
  "Gestione progetti":          "#FB7185",
  "Innovazione":                "#EC4899",
  "Scienza dei materiali":      "#78716C",
  "Chimica":                    "#A16207",
  "Chimica sostenibile":        "#CA8A04",
  "Chimica e energia":          "#D97706",
  "Informatica e IoT":          "#0891B2",
  "IoT":                        "#06B6D4",
  "Data science":               "#22D3EE",
  "Reti informatiche":          "#0E7490",
  "Reti e data science":        "#155E75",
  "Sistemi operativi":          "#4F46E5",
  "DevOps":                     "#7C3AED",
  "Fisica e ingegneria":        "#DC2626",
  "Ingegneria":                 "#B91C1C",
  "Metrologia e qualità":       "#9F1239",
  "Intelligence e giornalismo": "#374151",
  "Media forensics":            "#1F2937",
  "Giornalismo":                "#111827",
  "Accessibilità digitale":     "#7E22CE",
  "Design inclusivo":           "#9333EA",
  "Normativa":                  "#be123c",
  "Geopolitica":                "#1D4ED8",
  "Design":                     "#DB2777",
  "Capacità cognitive":         "#065F46",
  "Educazione":                 "#4D7C0F",
};

function coloreCategoria(cat: string): string {
  return COLORI_CATEGORIA[cat] ?? "#64748B";
}

// ── Componente Card singola competenza ────────────────────────────────────────
function CompetenzaCard({ nome, entry }: { nome: string; entry: CompetenzaEntry }) {
  const [aperto, setAperto] = useState(false);
  const colore = coloreCategoria(entry.categoria);

  return (
    <div
      className="group rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md"
      style={{ borderColor: `${colore}30` }}
    >
      {/* Header card */}
      <button
        type="button"
        onClick={() => setAperto((p) => !p)}
        className="flex w-full items-start gap-3 p-4 text-left"
        aria-expanded={aperto}
      >
        <span className="mt-0.5 text-2xl leading-none" aria-hidden="true">
          {entry.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white"
              style={{ backgroundColor: colore }}
            >
              {entry.categoria}
            </span>
            {entry.area_correlata && (
              <span className="font-mono text-[10px] text-slate-400">
                {entry.area_correlata}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm font-black capitalize text-slate-900">{nome}</p>
        </div>
        <svg
          className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform ${aperto ? "rotate-180" : ""}`}
          viewBox="0 0 16 16" fill="currentColor"
        >
          <path d="M8 10.5L2 4.5h12L8 10.5z" />
        </svg>
      </button>

      {/* Contenuto espanso */}
      {aperto && (
        <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: `${colore}20` }}>
          {/* Definizione */}
          <p className="text-sm leading-6 text-slate-700">{entry.definizione}</p>

          {/* Esempio */}
          {entry.esempio && (
            <div
              className="mt-3 rounded-xl border px-4 py-3"
              style={{ borderColor: `${colore}30`, backgroundColor: `${colore}08` }}
            >
              <p
                className="mb-1 text-[10px] font-black uppercase tracking-widest"
                style={{ color: colore }}
              >
                Esempio concreto
              </p>
              <p className="text-xs leading-5 text-slate-700">{entry.esempio}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Pagina principale ────────────────────────────────────────────────────────
export default function GlossarioClient() {
  const [query, setQuery] = useState("");
  const [catFiltro, setCatFiltro] = useState<string | null>(null);

  const voci = useMemo(() => {
    const q = query.toLowerCase().trim();
    return Object.entries(GLOSSARIO)
      .filter(([nome, entry]) => {
        const matchCat = !catFiltro || entry.categoria === catFiltro;
        const matchQ =
          !q ||
          nome.includes(q) ||
          entry.definizione.toLowerCase().includes(q) ||
          entry.categoria.toLowerCase().includes(q) ||
          entry.esempio?.toLowerCase().includes(q);
        return matchCat && matchQ;
      })
      .sort(([a], [b]) => a.localeCompare(b, "it"));
  }, [query, catFiltro]);

  // Categorie presenti dopo filtro testo
  const categorieFiltrate = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return CATEGORIE;
    const presenti = new Set(
      Object.entries(GLOSSARIO)
        .filter(([nome, entry]) =>
          nome.includes(q) ||
          entry.definizione.toLowerCase().includes(q) ||
          entry.categoria.toLowerCase().includes(q)
        )
        .map(([, e]) => e.categoria)
    );
    return CATEGORIE.filter((c) => presenti.has(c));
  }, [query]);

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">
      {/* ── Hero ── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-700">ProfTecnologIA</Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Glossario competenze</span>
          </nav>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Professioni del futuro
              </p>
              <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Glossario competenze
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                {Object.keys(GLOSSARIO).length} competenze delle professioni 2030 — con
                definizione e esempio concreto. Clicca su una voce per espanderla.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-center">
              <p className="text-4xl font-black text-slate-950">{Object.keys(GLOSSARIO).length}</p>
              <p className="text-xs text-slate-500">competenze</p>
              <p className="mt-1 text-2xl font-black text-emerald-600">{CATEGORIE.length}</p>
              <p className="text-xs text-slate-500">categorie</p>
            </div>
          </div>

          {/* Barra di ricerca */}
          <div className="mt-8 flex gap-3">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="search"
                placeholder="Cerca una competenza, una categoria o una parola chiave..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-500 hover:bg-slate-50"
              >
                Cancella
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* ── Filtri per categoria ── */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCatFiltro(null)}
            className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
              !catFiltro
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-600 hover:border-slate-500"
            }`}
          >
            Tutte ({Object.keys(GLOSSARIO).length})
          </button>
          {categorieFiltrate.map((cat) => {
            const colore = coloreCategoria(cat);
            const conta = Object.values(GLOSSARIO).filter((e) => e.categoria === cat).length;
            const attiva = catFiltro === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCatFiltro(attiva ? null : cat)}
                className="rounded-full border px-3 py-1 text-xs font-bold transition-all"
                style={{
                  borderColor: attiva ? colore : `${colore}50`,
                  backgroundColor: attiva ? colore : `${colore}10`,
                  color: attiva ? "white" : colore,
                }}
              >
                {cat} ({conta})
              </button>
            );
          })}
        </div>

        {/* ── Risultati ── */}
        {voci.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-4 text-lg font-bold text-slate-700">
              Nessuna competenza trovata per "{query}"
            </p>
            <button
              type="button"
              onClick={() => { setQuery(""); setCatFiltro(null); }}
              className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              Mostra tutte
            </button>
          </div>
        ) : (
          <>
            {(query || catFiltro) && (
              <p className="mb-4 text-sm text-slate-500">
                {voci.length} risultat{voci.length === 1 ? "o" : "i"}
                {catFiltro ? ` in "${catFiltro}"` : ""}
                {query ? ` per "${query}"` : ""}
              </p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {voci.map(([nome, entry]) => (
                <CompetenzaCard key={nome} nome={nome} entry={entry} />
              ))}
            </div>
          </>
        )}

        {/* ── Footer nav ── */}
        <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-slate-700">← Torna alla home</Link>
          <span>{Object.keys(GLOSSARIO).length} competenze · {CATEGORIE.length} categorie</span>
        </div>
      </div>
    </main>
  );
}
