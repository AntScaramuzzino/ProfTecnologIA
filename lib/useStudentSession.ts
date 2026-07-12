"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STUDENT_NAME_KEY = "tecnologia_app_student_name";

function cleanName(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, 40);
}

export function getStudentStorageId(name: string | null | undefined): string {
  const cleaned = cleanName(name ?? "");
  if (!cleaned) return "anonimo";
  return cleaned
    .toLocaleLowerCase("it-IT")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "anonimo";
}

export function useStudentSession() {
  const [hydrated, setHydrated] = useState(false);
  const [studentName, setStudentNameState] = useState("");

  useEffect(() => {
    try {
      setStudentNameState(cleanName(localStorage.getItem(STUDENT_NAME_KEY) ?? ""));
    } catch {
      // localStorage non disponibile
    }
    setHydrated(true);
  }, []);

  const setStudentName = useCallback((value: string) => {
    const cleaned = cleanName(value);
    setStudentNameState(cleaned);
    try {
      if (cleaned) {
        localStorage.setItem(STUDENT_NAME_KEY, cleaned);
      } else {
        localStorage.removeItem(STUDENT_NAME_KEY);
      }
    } catch {
      // localStorage non disponibile
    }
  }, []);

  const clearStudentName = useCallback(() => setStudentName(""), [setStudentName]);

  return useMemo(() => ({
    hydrated,
    studentName,
    studentId: getStudentStorageId(studentName),
    hasStudentName: studentName.length > 0,
    setStudentName,
    clearStudentName,
  }), [hydrated, studentName, setStudentName, clearStudentName]);
}
