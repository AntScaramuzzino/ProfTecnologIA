"use client";

/**
 * useProgress — student progress tracking hook
 *
 * Stores progress in localStorage (keyed by student ID or anonymous).
 * Shape per MC:
 *   { completedAt: ISO string, quizScore: number, quizTotal: number, level: "F"|"I"|"A" }
 *
 * In production this would sync to the backend/Notion Layer 2.
 */

import { useState, useEffect, useCallback } from "react";
import { useStudentSession } from "@/lib/useStudentSession";

export interface MCProgress {
  mcId: string;
  completedAt: string; // ISO 8601
  quizScore: number;
  quizTotal: number;
  level: "F" | "I" | "A";
  attempts: number;
}

/** Verifica di fine livello del laboratorio interattivo (miglior risultato per livello) */
export interface LabLevelResult {
  score: number;
  total: number;
  at: string; // ISO 8601
}

export interface LabProgress {
  mcId: string;
  levels: Partial<Record<"F" | "I" | "A", LabLevelResult>>;
}

/** Esplorazione immersiva: scene visitate dallo studente nella scheda OSSERVA della MC */
export interface EsplorazioneProgress {
  slug: string;
  mcId: string;
  /** Identificativi delle scene (nodi di dati.js) visitate, in ordine di prima visita */
  scene: string[];
  at: string; // ISO 8601
}

export interface ProgressStore {
  studentId: string;
  digcompLevel: "F" | "I" | "A"; // current overall level
  completedMCs: Record<string, MCProgress>;
  /** Risultati dei laboratori interattivi (assente nei dati salvati prima dei laboratori) */
  labs?: Record<string, LabProgress>;
  /** Scene visitate nelle esplorazioni immersive, per slug (assente nei dati salvati prima delle esplorazioni) */
  esplorazioni?: Record<string, EsplorazioneProgress>;
  lastActive: string;
}

const PASS = 0.7;
/** Tetto alle scene memorizzate per esplorazione (le esplorazioni ne hanno una dozzina) */
const MAX_SCENE = 60;

/** Livello del laboratorio superato: verifica di fine livello con almeno il 70% */
export function isLabLevelPassed(r?: LabLevelResult): boolean {
  return !!r && r.total > 0 && r.score / r.total >= PASS;
}

/** Laboratorio completato: superate le verifiche di tutti e tre i livelli */
export function isLabCompleted(store: ProgressStore, mcId: string): boolean {
  const lab = store.labs?.[mcId];
  return !!lab && (["F", "I", "A"] as const).every((l) => isLabLevelPassed(lab.levels[l]));
}

/** MC superata: quiz della MC con almeno il 70%, oppure laboratorio completato in tutti e tre i livelli */
export function isMcPassed(store: ProgressStore, mcId: string): boolean {
  const r = store.completedMCs[mcId];
  const quizOk = !!r && r.quizTotal > 0 && r.quizScore / r.quizTotal >= PASS;
  return quizOk || isLabCompleted(store, mcId);
}

const STORAGE_KEY = "tecnologia_app_progress";
const STORAGE_PREFIX = "tecnologia_app_progress:";

function getStorageKey(studentId: string): string {
  return `${STORAGE_PREFIX}${studentId}`;
}

function getDefaultStore(studentId?: string): ProgressStore {
  return {
    studentId: studentId ?? "anonimo",
    digcompLevel: "F",
    completedMCs: {},
    lastActive: new Date().toISOString(),
  };
}

function inferDigcompLevel(completed: Record<string, MCProgress>): "F" | "I" | "A" {
  const records = Object.values(completed);
  if (records.length === 0) return "F";
  const hasA = records.some((r) => r.level === "A" && r.quizScore / r.quizTotal >= 0.7);
  const hasI = records.some((r) => r.level === "I" && r.quizScore / r.quizTotal >= 0.7);
  if (hasA) return "A";
  if (hasI) return "I";
  return "F";
}

export function useProgress(studentIdOverride?: string) {
  const session = useStudentSession();
  const studentId = studentIdOverride ?? session.studentId;
  const [store, setStore] = useState<ProgressStore>(() => getDefaultStore(studentId));
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    if (!session.hydrated && !studentIdOverride) return;
    try {
      const storageKey = getStorageKey(studentId);
      let raw = localStorage.getItem(storageKey);
      const legacyRaw = localStorage.getItem(STORAGE_KEY);

      // Migrazione dolce: se lo studente inserisce il nome per la prima volta,
      // conserva i progressi già accumulati nella vecchia sessione anonima.
      if (!raw && legacyRaw) {
        raw = legacyRaw;
        if (studentId !== "anonimo") {
          localStorage.setItem(storageKey, legacyRaw);
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      if (raw) {
        const parsed: ProgressStore = JSON.parse(raw);
        setStore({ ...parsed, studentId });
      } else {
        setStore(getDefaultStore(studentId));
      }
    } catch {
      setStore(getDefaultStore(studentId));
    }
    setHydrated(true);
  }, [session.hydrated, studentId, studentIdOverride]);

  // Persist on every change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(getStorageKey(store.studentId), JSON.stringify(store));
    } catch {
      // quota exceeded or private mode
    }
  }, [store, hydrated]);

  /** Record a quiz result for a micro-competence */
  const recordQuizResult = useCallback(
    (mcId: string, score: number, total: number, level: "F" | "I" | "A") => {
      setStore((prev) => {
        const existing = prev.completedMCs[mcId];
        const updated: MCProgress = {
          mcId,
          completedAt: new Date().toISOString(),
          quizScore: score,
          quizTotal: total,
          level,
          attempts: (existing?.attempts ?? 0) + 1,
        };
        const completedMCs = { ...prev.completedMCs, [mcId]: updated };
        return {
          ...prev,
          completedMCs,
          digcompLevel: inferDigcompLevel(completedMCs),
          lastActive: new Date().toISOString(),
        };
      });
    },
    []
  );

  /** Record the end-of-level check of an interactive lab (keeps the best result per level) */
  const recordLabResult = useCallback(
    (mcId: string, level: "F" | "I" | "A", score: number, total: number) => {
      if (!(total > 0) || score < 0 || score > total) return;
      setStore((prev) => {
        const lab = prev.labs?.[mcId] ?? { mcId, levels: {} };
        const old = lab.levels[level];
        const better = !old || score / total >= old.score / old.total;
        const levels = better ? { ...lab.levels, [level]: { score, total, at: new Date().toISOString() } } : lab.levels;
        const completedMCs = prev.completedMCs[mcId]
          ? prev.completedMCs
          : {
              ...prev.completedMCs,
              [mcId]: { mcId, completedAt: new Date().toISOString(), quizScore: 0, quizTotal: 0, level, attempts: 0 },
            };
        return {
          ...prev,
          completedMCs,
          labs: { ...(prev.labs ?? {}), [mcId]: { mcId, levels } },
          lastActive: new Date().toISOString(),
        };
      });
    },
    []
  );

  /** Record a scene reached in an immersive exploration (each scene counts once; not a pass criterion) */
  const recordExplorationScene = useCallback(
    (mcId: string, slug: string, scena: string, level: "F" | "I" | "A") => {
      if (!mcId || !slug || !scena) return;
      setStore((prev) => {
        const old = prev.esplorazioni?.[slug];
        if (old && (old.scene.includes(scena) || old.scene.length >= MAX_SCENE)) return prev;
        const now = new Date().toISOString();
        const completedMCs = prev.completedMCs[mcId]
          ? prev.completedMCs
          : {
              ...prev.completedMCs,
              [mcId]: { mcId, completedAt: now, quizScore: 0, quizTotal: 0, level, attempts: 0 },
            };
        return {
          ...prev,
          completedMCs,
          esplorazioni: {
            ...(prev.esplorazioni ?? {}),
            [slug]: { slug, mcId, scene: [...(old?.scene ?? []), scena], at: now },
          },
          lastActive: now,
        };
      });
    },
    []
  );

  /** Mark an MC as visited (without quiz) */
  const markVisited = useCallback((mcId: string, level: "F" | "I" | "A") => {
    setStore((prev) => {
      if (prev.completedMCs[mcId]) return prev; // already tracked
      const completedMCs = {
        ...prev.completedMCs,
        [mcId]: {
          mcId,
          completedAt: new Date().toISOString(),
          quizScore: 0,
          quizTotal: 0,
          level,
          attempts: 0,
        },
      };
      return {
        ...prev,
        completedMCs,
        lastActive: new Date().toISOString(),
      };
    });
  }, []);

  /** Reset all progress */
  const reset = useCallback(() => {
    setStore(getDefaultStore(studentId));
  }, [studentId]);

  const completedCount = Object.keys(store.completedMCs).length;
  const passedCount = Object.keys(store.completedMCs).filter((id) => isMcPassed(store, id)).length;

  return {
    store,
    hydrated,
    studentName: session.studentName,
    hasStudentName: session.hasStudentName,
    setStudentName: session.setStudentName,
    clearStudentName: session.clearStudentName,
    completedCount,
    passedCount,
    recordQuizResult,
    recordLabResult,
    recordExplorationScene,
    markVisited,
    reset,
    isCompleted: (mcId: string) => !!store.completedMCs[mcId],
    isPassed: (mcId: string) => isMcPassed(store, mcId),
    getLabProgress: (mcId: string) => store.labs?.[mcId] ?? null,
    getProgress: (mcId: string) => store.completedMCs[mcId] ?? null,
  };
}
