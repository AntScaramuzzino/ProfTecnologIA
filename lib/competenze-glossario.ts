/**
 * Glossario delle competenze professionali del futuro
 * Usato da CompetenzaTag per mostrare definizioni al click.
 * Fonte: elaborazione originale ProfTecnologIA, Maggio 2026.
 *
 * Dati in competenze-glossario.json — questo file è solo un wrapper tipizzato.
 */

import glossarioData from "./competenze-glossario.json";

export interface CompetenzaEntry {
  categoria: string;
  emoji: string;
  definizione: string;
  esempio: string;
  area_correlata?: string;
}

export const GLOSSARIO = glossarioData as Record<string, CompetenzaEntry>;

/** Cerca una competenza nel glossario (case-insensitive, ignora spazi extra) */
export function cercaCompetenza(chiave: string): CompetenzaEntry | null {
  const normalized = chiave.toLowerCase().trim();
  return GLOSSARIO[normalized] ?? null;
}

/** Tutte le categorie presenti nel glossario */
export const CATEGORIE = [...new Set(Object.values(GLOSSARIO).map((c) => c.categoria))].sort();
