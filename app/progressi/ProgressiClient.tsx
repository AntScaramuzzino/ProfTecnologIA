"use client";

import Link from "next/link";
import { useProgress, type MCProgress } from "@/lib/useProgress";

// ── Metadati area (statici — niente import da mc-loader che usa fs) ───────────

const AREA_EMOJI: Record<string, string> = {
  MAT: "🪨", DIS: "📐", DIG: "💻", ALI: "🌾",
  AMB: "🏗️", ENE: "⚡", COM: "📡", SIS: "⚙️", INF: "🖥️",
};
const AREA_LABEL: Record<string, string> = {
  MAT: "Materiali e Rifiuti", DIS: "Disegno Tecnico",  DIG: "Digitale / AI",
  ALI: "Alimentazione",       AMB: "Abitazione e Città", ENE: "Energia",
  COM: "Comunicazioni",       SIS: "Sistemi",            INF: "Informatica",
};
const AREA_HEX: Record<string, string> = {
  MAT: "#B45309", DIS: "#1D4ED8", DIG: "#7C3AED", ALI: "#15803D",
  AMB: "#C2410C", ENE: "#CA8A04", COM: "#0E7490", SIS: "#374151", INF: "#4338CA",
};

const DIGCOMP_LABEL: Record<string, string> = { F: "Foundation", I: "Intermediate", A: "Advanced" };
const DIGCOMP_COLOR: Record<string, string> = { F: "#1D4ED8", I: "#15803D", A: "#C2410C" };

// ── Tipi ─────────────────────────────────────────────────────────────────────

export interface MCIndexEntry {
  id:    string;
  titolo: string;
  area:  string;
  anno:  number;
  tags:  string[];
}

interface ProgressiClientProps {
  mcIndex: MCIndexEntry[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isPassed(r: MCProgress) {
  return r.quizTotal > 0 && r.quizScore / r.quizTotal >= 0.7;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short" }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function ScoreBadge({ r }: { r: MCProgress }) {
  if (r.quizTotal === 0) {
    return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">visitata</span>;
  }
  const pct = Math.round((r.quizScore / r.quizTotal) * 100);
  const passed = isPassed(r);
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
      passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
    }`}>
      {r.quizScore}/{r.quizTotal} · {pct}%{passed ? " ✓" : ""}
    </span>
  );
}

// ── Componente principale ────────────────────────────────────────────────────

export default function ProgressiClient({ mcIndex }: ProgressiClientProps) {
  const { store, hydrated, completedCount, passedCount, reset } = useProgress();

  // Indice rapido: id → MC
  const mcMap = new Map(mcIndex.map((m) => [m.id, m]));

  // Totali per area
  const areaTotals: Record<string, number> = {};
  for (const mc of mcIndex) {
    areaTotals[mc.area] = (areaTotals[mc.area] ?? 0) + 1;
  }

  // Progressi per area
  const areaVisited: Record<string, number> = {};
  const areaPassed: Record<string, number> = {};
  for (const [mcId, rec] of Object.entries(store.completedMCs)) {
    const mc = mcMap.get(mcId);
    if (!mc) continue;
    areaVisited[mc.area] = (areaVisited[mc.area] ?? 0) + 1;
    if (isPassed(rec)) areaPassed[mc.area] = (areaPassed[mc.area] ?? 0) + 1;
  }

  // Lista completate ordinata per data (più recente prima)
  const sortedRecords = Object.values(store.completedMCs).sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  );

  const total = mcIndex.length;
  const visitedPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const passedPct  = total > 0 ? Math.round((passedCount  / total) * 100) : 0;

  // Ordine aree nell'elenco (come nella sidebar)
  const areaOrder = ["MAT", "ALI", "AMB", "ENE", "COM", "SIS", "INF", "DIS", "DIG"];
  const areasPresent = areaOrder.filter((a) => areaTotals[a]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-slate-400">Caricamento progressi…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Il mio percorso
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Progressi
          </h1>
          {store.lastActive && (
            <p className="mt-1 text-xs text-slate-400">
              Ultima attività: {formatDate(store.lastActive)}
            </p>
          )}
        </div>

        {/* Livello DigComp */}
        <div
          className="shrink-0 rounded-xl border-2 px-4 py-3 text-center"
          style={{ borderColor: DIGCOMP_COLOR[store.digcompLevel] ?? "#94a3b8", color: DIGCOMP_COLOR[store.digcompLevel] ?? "#94a3b8" }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">DigComp</p>
          <p className="text-2xl font-black leading-none">{store.digcompLevel}</p>
          <p className="mt-0.5 text-[10px] font-bold">{DIGCOMP_LABEL[store.digcompLevel]}</p>
        </div>
      </div>

      {/* ── Contatori principali ─────────────────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          { value: completedCount, label: "Visitate",  sub: `su ${total}`,    color: "#1D4ED8" },
          { value: passedCount,    label: "Superate",  sub: "quiz ≥70%",       color: "#15803D" },
          { value: `${passedPct}%`,label: "Completamento", sub: "quiz passati", color: "#7C3AED" },
        ].map(({ value, label, sub, color }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
            <p className="text-2xl font-black sm:text-3xl" style={{ color }}>{value}</p>
            <p className="mt-0.5 text-xs font-bold text-slate-700">{label}</p>
            <p className="text-[10px] text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Barra progresso globale ──────────────────────────────────────────── */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Progresso totale</span>
          <span>{visitedPct}% visitate</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${visitedPct}%`, backgroundColor: "#1D4ED8" }}
          />
        </div>
        {passedCount > 0 && (
          <>
            <div className="mb-1 mt-3 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Quiz superati</span>
              <span>{passedPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${passedPct}%`, backgroundColor: "#15803D" }}
              />
            </div>
          </>
        )}
      </div>

      {/* ── Per area ────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">
          Per area
        </h2>
        <div className="space-y-2">
          {areasPresent.map((area) => {
            const total = areaTotals[area] ?? 0;
            const visited = areaVisited[area] ?? 0;
            const passed  = areaPassed[area] ?? 0;
            const hex = AREA_HEX[area] ?? "#94a3b8";
            const visitedPct = total > 0 ? Math.round((visited / total) * 100) : 0;

            return (
              <div key={area} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3">
                <span className="text-lg" aria-hidden>{AREA_EMOJI[area] ?? "📚"}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-xs font-bold text-slate-700">{AREA_LABEL[area] ?? area}</p>
                    <p className="ml-2 shrink-0 text-[10px] text-slate-400">
                      {visited}/{total}{passed > 0 ? ` · ${passed} ✓` : ""}
                    </p>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${visitedPct}%`, backgroundColor: hex }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Lista MC visitate ────────────────────────────────────────────────── */}
      {sortedRecords.length > 0 ? (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-500">
            Micro-competenze visitate
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {sortedRecords.map((rec, i) => {
              const mc = mcMap.get(rec.mcId);
              const hex = AREA_HEX[mc?.area ?? ""] ?? "#94a3b8";
              return (
                <div
                  key={rec.mcId}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i < sortedRecords.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  {/* Dot colore area */}
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: hex }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/mc/${rec.mcId}`}
                      className="block truncate text-sm font-semibold text-slate-800 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      {mc?.titolo ?? rec.mcId}
                    </Link>
                    <p className="text-[10px] text-slate-400">
                      {AREA_EMOJI[mc?.area ?? ""] ?? ""} {mc?.area} · Classe {mc?.anno}ª · {formatDate(rec.completedAt)}
                      {rec.attempts > 1 ? ` · ${rec.attempts} tentativi` : ""}
                    </p>
                  </div>
                  <ScoreBadge r={rec} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 px-5 py-10 text-center">
          <p className="text-2xl">📚</p>
          <p className="mt-2 text-sm font-bold text-slate-600">Nessuna MC visitata ancora</p>
          <p className="mt-1 text-xs text-slate-400">
            Apri una micro-competenza per iniziare a tracciare i tuoi progressi.
          </p>
          <Link
            href="/#catalogo"
            className="mt-4 inline-block rounded-full bg-emerald-700 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-800 transition-colors"
          >
            Esplora il catalogo →
          </Link>
        </div>
      )}

      {/* ── Reset ───────────────────────────────────────────────────────────── */}
      {completedCount > 0 && (
        <div className="border-t border-slate-200 pt-6 text-center">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Sei sicuro di voler azzerare tutti i progressi? Questa azione non può essere annullata.")) {
                reset();
              }
            }}
            className="text-xs font-bold text-slate-400 underline underline-offset-2 hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            Azzera progressi
          </button>
        </div>
      )}
    </div>
  );
}
