"use client";

/**
 * Recommender — DigComp-based content recommender
 *
 * Given the student's current DigComp level and completed MCs,
 * suggests the next 3 MCs to tackle using these rules:
 *
 * 1. Prerequisites satisfied (all prerequisiti completed)
 * 2. Same DigComp level OR one level above (stretch goal)
 * 3. Not yet completed by the student
 * 4. Ordered by: same level first, then stretch, then earlier anno first
 */

import Link from "next/link";
import { getAllMCs, AREA_META, LEVEL_META } from "@/lib/mc-loader";
import type { MC } from "@/lib/mc-loader";
import { useProgress } from "@/lib/useProgress";

const LEVEL_ORDER: Record<string, number> = { F: 0, I: 1, A: 2, H: 3 };

function nextLevel(lv: string): string {
  const order = ["F", "I", "A", "H"];
  const idx = order.indexOf(lv);
  return idx < order.length - 1 ? order[idx + 1] : lv;
}

function getRecommendations(
  allMCs: MC[],
  completedIds: Set<string>,
  currentLevel: "F" | "I" | "A"
): MC[] {
  const eligible = allMCs.filter((mc) => {
    if (completedIds.has(mc.id)) return false;
    // All prerequisites must be completed
    if (mc.prerequisiti && mc.prerequisiti.length > 0) {
      if (!mc.prerequisiti.every((p) => completedIds.has(p))) return false;
    }
    // Level: same or one above
    const mcLv = mc.outputApp.livelloDigComp;
    const targetLevels = new Set([currentLevel, nextLevel(currentLevel)]);
    return targetLevels.has(mcLv);
  });

  // Sort: same level first, then lower anno first
  eligible.sort((a, b) => {
    const aLv = LEVEL_ORDER[a.outputApp.livelloDigComp] ?? 0;
    const bLv = LEVEL_ORDER[b.outputApp.livelloDigComp] ?? 0;
    const curLvOrd = LEVEL_ORDER[currentLevel] ?? 0;
    const aIsStretch = aLv > curLvOrd ? 1 : 0;
    const bIsStretch = bLv > curLvOrd ? 1 : 0;
    if (aIsStretch !== bIsStretch) return aIsStretch - bIsStretch;
    return a.anno - b.anno;
  });

  return eligible.slice(0, 3);
}

export default function Recommender() {
  const { store, hydrated, completedCount, passedCount } = useProgress();

  if (!hydrated) return null;

  const allMCs = getAllMCs();
  const completedIds = new Set(Object.keys(store.completedMCs));
  const recommendations = getRecommendations(allMCs, completedIds, store.digcompLevel);

  const totalMCs = allMCs.length;
  const pctDone = Math.round((completedCount / totalMCs) * 100);

  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 space-y-5">
      {/* Student status */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-indigo-500 uppercase tracking-wide font-semibold mb-0.5">
            Il tuo percorso
          </p>
          <p className="text-sm text-indigo-800">
            <span className="font-bold">{completedCount}</span> MC visitate ·{" "}
            <span className="font-bold">{passedCount}</span> superate
          </p>
        </div>
        <div className="text-right">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${LEVEL_META[store.digcompLevel]?.color ?? "bg-indigo-100 text-indigo-700"}`}
          >
            Livello {store.digcompLevel} — {LEVEL_META[store.digcompLevel]?.label}
          </span>
          <div className="mt-2 h-1.5 w-32 rounded-full bg-indigo-200 overflow-hidden ml-auto">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${pctDone}%` }}
            />
          </div>
          <p className="text-xs text-indigo-400 mt-0.5">{pctDone}% completato</p>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length === 0 ? (
        <div className="rounded-xl bg-white border border-indigo-100 p-4 text-center text-sm text-gray-500">
          {completedCount === totalMCs
            ? "🎉 Hai completato tutte le competenze disponibili!"
            : "Nessuna competenza disponibile al tuo livello. Completa i prerequisiti."}
        </div>
      ) : (
        <div>
          <p className="text-xs text-indigo-600 font-medium mb-3">
            Prossimi passi consigliati:
          </p>
          <div className="space-y-2">
            {recommendations.map((mc, idx) => {
              const lv = mc.outputApp.livelloDigComp as "F" | "I" | "A" | "H";
              const areaMeta = AREA_META[mc.area];
              const isStretch = lv !== store.digcompLevel;

              return (
                <Link
                  key={mc.id}
                  href={`/mc/${mc.id}`}
                  className="flex items-center gap-3 rounded-xl bg-white border border-indigo-100 px-4 py-3 hover:border-indigo-300 hover:shadow-sm transition-all group"
                >
                  <span className="text-xl shrink-0">{areaMeta?.emoji ?? "📚"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-gray-400">{mc.id}</span>
                      {isStretch && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 font-medium">
                          sfida
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-indigo-700 truncate">
                      {mc.titolo}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${LEVEL_META[lv]?.color ?? "bg-gray-100"}`}
                    >
                      {lv}
                    </span>
                    <span className="text-gray-300 group-hover:text-indigo-400 text-lg">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
