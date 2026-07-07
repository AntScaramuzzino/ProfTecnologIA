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

export interface HookAudio {
  titolo?: string;
  oggetto_reale?: string;
  domanda_avvio?: string;
  durata_min?: number;
  note_script?: string;
}

export interface ClilTermine {
  italiano: string;
  inglese: string;
  pronuncia_ipa?: string;
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
  hook_audio?: HookAudio;
  professione_futura?: {
    titolo?: string;
    orizzonte?: string;
    descrizione_breve?: string;
    competenze_chiave?: string[];
  };
  /** Vocabolario CLIL — termini tecnici chiave in italiano e inglese con pronuncia IPA */
  clil_termini?: ClilTermine[];
  /**
   * Immagine opzionale da Wikimedia Commons (CC BY / CC BY-SA / CC0 / Public Domain)
   * da mostrare nella tab ESPLORA prima dell'accordion di testo.
   * src: path relativo a /public/ — es. "/images/wiki/MC-MAT-1-02/fotosintesi.jpg"
   */
  immagine_esplora?: {
    src: string;
    alt: string;
    caption: string;      // es. "Autore: John Doe, via Wikimedia Commons"
    license: string;      // es. "CC BY-SA 4.0"
    wikimedia_url?: string;
  };
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

  // DIS e DIG vanno sempre in coda per ogni anno (dopo tutte le altre aree)
  function areaSortKey(area: string): number {
    if (area === "DIS") return 1;
    if (area === "DIG") return 2;
    return 0;
  }

  return mcs.sort((a, b) => {
    if (a.anno !== b.anno) return a.anno - b.anno;
    const ka = areaSortKey(a.area);
    const kb = areaSortKey(b.area);
    if (ka !== kb) return ka - kb;          // DIS e DIG in fondo
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
  { label: string; emoji: string; color: string; hex: string }
> = {
  MAT: { label: "Materiali e Rifiuti",       emoji: "🪨", color: "amber",  hex: "#B45309" },
  DIS: { label: "Disegno Tecnico",            emoji: "📐", color: "blue",   hex: "#1D4ED8" },
  DIG: { label: "Digitale / Coding / AI",    emoji: "💻", color: "purple", hex: "#7C3AED" },
  ALI: { label: "Alimentazione",             emoji: "🌾", color: "green",  hex: "#15803D" },
  AMB: { label: "Abitazione e Città",        emoji: "🏗️", color: "orange", hex: "#C2410C" },
  INF: { label: "Informatica",              emoji: "🔢", color: "indigo", hex: "#4338CA" },
  ENE: { label: "Energia e Macchine",        emoji: "⚡", color: "yellow", hex: "#B45309" },
  COM: { label: "Comunicazioni e Trasporti", emoji: "📡", color: "cyan",   hex: "#0E7490" },
  SIS: { label: "Sistemi ed Economia",       emoji: "⚙️", color: "gray",   hex: "#374151" },
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
