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

export interface ProgressStore {
  studentId: string;
  digcompLevel: "F" | "I" | "A"; // current overall level
  completedMCs: Record<string, MCProgress>;
  lastActive: string;
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
  const passedCount = Object.values(store.completedMCs).filter(
    (r) => r.quizTotal > 0 && r.quizScore / r.quizTotal >= 0.7
  ).length;

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
    markVisited,
    reset,
    isCompleted: (mcId: string) => !!store.completedMCs[mcId],
    isPassed: (mcId: string) => {
      const r = store.completedMCs[mcId];
      return r ? r.quizTotal > 0 && r.quizScore / r.quizTotal >= 0.7 : false;
    },
    getProgress: (mcId: string) => store.completedMCs[mcId] ?? null,
  };
}
