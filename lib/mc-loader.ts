/**
 * MC Loader — carica le micro-competenze dai file JSON locali
 * o dalla API (Layer 2 Notion in produzione).
 */

import fs from "fs";
import path from "path";

export interface Framework {
  ref: string;
  traguardo?: string;
  livello?: "F" | "I" | "A" | "H";
  nota?: string;
}

export interface OutputApp {
  quiz: string;
  microlearning: string;
  visual: string;
  livelloDigComp: "F" | "I" | "A" | "H";
}

export interface NoteDid {
  base: string;
  avanzato: string;
}

export interface MC {
  id: string;
  area: string;
  anno: 1 | 2 | 3;
  titolo: string;
  descrizione: string;
  fonte: string;
  frameworks: {
    IN?: Framework;
    DC?: Framework;
    EC?: Framework;
    LC?: Framework;
    EV?: Framework;
  };
  outputApp: OutputApp;
  prerequisiti: string[] | null;
  tags: string[];
  compito_realta: string;
  sdg?: number[];
  note_didattiche: NoteDid;
}

// Legge prima da data/mc/ (repo standalone), poi da ../../01_MATRICE_MC (workspace locale)
const MC_ROOT = fs.existsSync(path.resolve(process.cwd(), "data/mc"))
  ? path.resolve(process.cwd(), "data/mc")
  : path.resolve(process.cwd(), "../../01_MATRICE_MC");

function loadMCsFromDisk(): MC[] {
  const mcs: MC[] = [];

  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (
        entry.isFile() &&
        entry.name.startsWith("MC-") &&
        entry.name.endsWith(".json")
      ) {
        try {
          const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
          mcs.push(data as MC);
        } catch (e) {
          console.error(`Error loading ${fullPath}:`, e);
        }
      }
    }
  }

  if (fs.existsSync(MC_ROOT)) {
    walkDir(MC_ROOT);
  }

  return mcs.sort((a, b) => {
    if (a.anno !== b.anno) return a.anno - b.anno;
    if (a.area !== b.area) return a.area.localeCompare(b.area);
    return a.id.localeCompare(b.id);
  });
}

// Cache in memory durante il build/dev
let _cache: MC[] | null = null;

export function getAllMCs(): MC[] {
  if (!_cache) {
    _cache = loadMCsFromDisk();
  }
  return _cache;
}

export function getMCById(id: string): MC | undefined {
  return getAllMCs().find((mc) => mc.id === id);
}

export function getMCsByArea(area: string): MC[] {
  return getAllMCs().filter((mc) => mc.area === area);
}

export function getMCsByAnno(anno: 1 | 2 | 3): MC[] {
  return getAllMCs().filter((mc) => mc.anno === anno);
}

export function getPrerequisiteChain(mcId: string): MC[] {
  const all = getAllMCs();
  const mc = all.find((m) => m.id === mcId);
  if (!mc || !mc.prerequisiti) return [];

  const chain: MC[] = [];
  for (const prereqId of mc.prerequisiti) {
    const prereq = all.find((m) => m.id === prereqId);
    if (prereq) {
      // Ricorsivo per la catena completa
      chain.push(...getPrerequisiteChain(prereqId), prereq);
    }
  }
  return chain;
}

export const AREA_META: Record<
  string,
  { label: string; emoji: string; color: string }
> = {
  MAT: { label: "Materiali e Rifiuti", emoji: "🪨", color: "amber" },
  DIS: { label: "Disegno Tecnico", emoji: "📐", color: "blue" },
  DIG: { label: "Digitale / Coding / AI", emoji: "💻", color: "purple" },
  ALI: { label: "Alimentazione", emoji: "🌾", color: "green" },
  AMB: { label: "Abitazione e Città", emoji: "🏗️", color: "orange" },
  INF: { label: "Informatica", emoji: "🔢", color: "indigo" },
  ENE: { label: "Energia e Macchine", emoji: "⚡", color: "yellow" },
  COM: { label: "Comunicazioni e Trasporti", emoji: "📡", color: "cyan" },
  SIS: { label: "Sistemi ed Economia", emoji: "⚙️", color: "gray" },
};

export const LEVEL_META: Record<
  string,
  { label: string; color: string; description: string }
> = {
  F: {
    label: "Foundation",
    color: "blue",
    description: "Orientamento e riconoscimento",
  },
  I: {
    label: "Intermediate",
    color: "green",
    description: "Applicazione autonoma",
  },
  A: {
    label: "Advanced",
    color: "orange",
    description: "Progettazione critica",
  },
  H: {
    label: "Highly Specialised",
    color: "red",
    description: "Creazione innovativa",
  },
};
