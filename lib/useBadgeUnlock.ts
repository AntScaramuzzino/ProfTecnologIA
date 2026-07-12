"use client";

/**
 * useBadgeUnlock — rileva badge appena sbloccati confrontando
 * lo stato precedente con quello attuale del store.
 *
 * Viene chiamato da MCPageClient dopo ogni aggiornamento del quiz.
 * Non mostra toast per badge già sbloccati al primo hydrate.
 */

import { useRef, useEffect, useState } from "react";
import { SDG_BADGES, getBadgeState, hasSdg, type SDGBadgeDefinition, type SdgValue } from "@/lib/sdg-badges";
import type { ProgressStore } from "@/lib/useProgress";

export interface SdgEntry {
  id: string;
  sdg: SdgValue[];
}

function computeUnlockedIds(store: ProgressStore, sdgIndex: SdgEntry[]): Set<string> {
  const unlocked = new Set<string>();
  for (const badge of SDG_BADGES) {
    const linkedMCs = sdgIndex.filter((mc) => hasSdg(mc.sdg, badge.sdg));
    const passed = linkedMCs.filter((mc) => {
      const rec = store.completedMCs[mc.id];
      return rec ? rec.quizTotal > 0 && rec.quizScore / rec.quizTotal >= 0.7 : false;
    }).length;
    if (getBadgeState(passed, badge.requiredPassed) === "unlocked") {
      unlocked.add(badge.id);
    }
  }
  return unlocked;
}

export function useBadgeUnlock(
  store: ProgressStore,
  sdgIndex: SdgEntry[],
  hydrated: boolean,
) {
  const prevUnlockedRef = useRef<Set<string> | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<SDGBadgeDefinition | null>(null);

  useEffect(() => {
    if (!hydrated) return;

    const current = computeUnlockedIds(store, sdgIndex);

    if (prevUnlockedRef.current === null) {
      // Prima hydration: inizializza senza mostrare toast per badge già acquisiti
      prevUnlockedRef.current = current;
      return;
    }

    // Trova il primo badge appena sbloccato
    for (const badge of SDG_BADGES) {
      if (current.has(badge.id) && !prevUnlockedRef.current.has(badge.id)) {
        setNewlyUnlocked(badge);
        break; // mostra un toast alla volta
      }
    }

    prevUnlockedRef.current = current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.completedMCs, hydrated]);

  return {
    newlyUnlocked,
    clearUnlocked: () => setNewlyUnlocked(null),
  };
}
