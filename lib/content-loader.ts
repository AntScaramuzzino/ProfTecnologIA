import fs from "fs";
import path from "path";

// Il sito usa la copia locale dei contenuti generata in data/.
// Tenere i path dentro la root Next evita tracing Turbopack fuori progetto.
const TESTI_ROOT = path.join(process.cwd(), "data", "testi");
const PROJECT_ROOT = TESTI_ROOT;
const PUBLIC_VISUAL_ROOT = path.join(process.cwd(), "public", "assets", "visual");
const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export interface MCTextContent {
  path: string;
  title: string;
  intro: string;
  sections: { title: string; body: string }[];
}

export interface VisualAsset {
  kind: "hero" | "diagram" | "generated" | "other";
  label: string;
  src: string;
}

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, (_, label: string) => label)
    .replace(/[#*_>`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isEditorialLine(line: string): boolean {
  if (/^\s*-{3,}\s*$/.test(line)) return true;
  const clean = stripMarkdown(line).replace(/\s+/g, " ").trim();
  if (!clean) return false;
  if (/^(area|anno|livello digcomp|sdg|fonte|struttura)\s*:/i.test(clean)) return true;
  // Righe di metadati in linea: **Area:** ... · **Anno:** ... · **Livello DigComp:** ...
  if (/\barea\s*:/i.test(clean) && /\banno\s*:/i.test(clean)) return true;
  if (/\bsdg\s*:/i.test(clean) && /\bfonte\s*:/i.test(clean)) return true;
  if (/\bfonte\s*:/i.test(clean) && /\bstruttura\s*:/i.test(clean)) return true;
  if (/versione contenuto completo per editing/i.test(clean)) return true;
  if (/^mc versione\s+\d/i.test(clean)) return true;
  if (/^qr code audio/i.test(clean)) return true;
  if (/^ascolta prima di leggere/i.test(clean)) return true;
  if (/^script completo\s*:/i.test(clean)) return true;
  // Riferimento al file hook-script con o senza parentesi: "(Script completo: MC-...)"
  if (/hook-script\.md/i.test(clean)) return true;
  if (/script completo/i.test(clean) && /\.md/i.test(clean)) return true;
  if (/^domanda di avvio\s*:?\s*$/i.test(clean)) return true;
  return false;
}

function cleanMarkdownForReading(value: string): string {
  return value
    .split("\n")
    .filter((line) => !isEditorialLine(line))
    .join("\n")
    // Preserva blocchi codice come @@CODE:
    .replace(/```(\w*)\n?([\s\S]*?)```/g, "\n@@CODE:$2\n")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // ── Rimozione citazioni bibliografiche inline ─────────────────────────
    // (Fonte: ...) → già presente
    .replace(/\s*\(Fonte:[^)]+\)/gi, "")
    // (Fonti convergenti: Atlas ISBN ...; SEI ISBN ...; Zanichelli ISBN ...)
    .replace(/\s*\*?\(Fonti?\s+convergenti\s*:[^)]+\)\*?/gi, "")
    // *(Fonti convergenti: ...)*  oppure  (Fonti convergenti: ...)*
    .replace(/\s*\*\(Fonti?\s*:[^)]+\)\*/gi, "")
    // Citazioni ISBN inline: (ISBN 9788826824376, p.166) o (Atlas ISBN ..., p.xxx)
    .replace(/\s*\*?\([^)]*ISBN\s+978\d{10}[^)]*\)\*?/gi, "")
    // Riferimenti pagina standalone: (p.xxx) o (p.xxx-xxx)
    .replace(/\s*\(p\.\s*\d+(?:-\d+)?\)/gi, "")
    // hook-script e Script completo
    .replace(/\s*\([^)]*hook-script[^)]*\)/gi, "")
    .replace(/\s*\([^)]*Script completo[^)]*\)/gi, "")
    // ── Pulizia struttura markdown ────────────────────────────────────────
    .replace(/^#{3,6}\s+(.+)$/gm, "\n@@SUBHEAD:$1\n")
    .replace(/^#{1,2}\s+/gm, "")
    // Trasforma i blockquote in @@CALLOUT: invece di rimuoverli
    .replace(/(^|\n)>\s?/g, "$1@@CALLOUT:")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/[ \t]+\n/g, "\n")
    // ── FIX TABELLE: evita doppi newline dentro le tabelle ────────────────
    // Se una riga | è seguita da \n\n e poi un'altra riga |, collassa a \n
    .replace(/(\|[^\n]+)\n{2,}(?=\s*\|)/gm, "$1\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function getMCTextContent(mcId: string): MCTextContent | null {
  const area = mcId.split("-")[1];
  const anno = mcId.split("-")[2];
  const fullPath = path.join(TESTI_ROOT, `classe_${anno}`, area, `${mcId}_completa.md`);

  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const title = raw.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? mcId;
  const parts = raw.split(/^##\s+/m);
  const intro = cleanMarkdownForReading(parts[0].replace(/^#.+$/m, ""));
  const sections = parts
    .slice(1)
    .map((part) => {
      const [heading = "", ...bodyParts] = part.split("\n");
      return {
        title: stripMarkdown(heading).replace(/^zona\s+\d+\s*[—-]\s*/i, ""),
        body: cleanMarkdownForReading(bodyParts.join("\n")),
      };
    })
    .filter((section) => section.title && section.body)
    .filter((section) => !/^(note di editing|metadati)$/i.test(section.title));

  return {
    path: path.relative(PROJECT_ROOT, fullPath),
    title,
    intro,
    sections,
  };
}

export function getVisualAssets(mcId: string): VisualAsset[] {
  const dir = path.join(PUBLIC_VISUAL_ROOT, mcId);
  if (!fs.existsSync(dir)) return [];

  const all = fs.readdirSync(dir).filter((name) => /\.(svg|png|jpe?g|webp)$/i.test(name));

  // Prefer WebP: se esiste .webp per una data base, salta il .png corrispondente
  const webpBases = new Set(
    all.filter((n) => /\.webp$/i.test(n)).map((n) => n.replace(/\.webp$/i, ""))
  );

  return all
    .filter((name) => {
      if (/\.png$/i.test(name) && webpBases.has(name.replace(/\.png$/i, ""))) return false;
      return true;
    })
    .sort((a, b) => assetRank(a) - assetRank(b) || a.localeCompare(b))
    .map((name) => ({
      kind: getAssetKind(name),
      label: getAssetLabel(name),
      src: `${PUBLIC_BASE_PATH}/assets/visual/${mcId}/${name}`,
    }));
}

export function getPrimaryVisual(mcId: string): VisualAsset | null {
  return getVisualAssets(mcId)[0] ?? null;
}

// ── SLIDE PRESENTAZIONE (deck NotebookLM convertito in immagini) ──────────────

const PUBLIC_DECK_ROOT = path.join(process.cwd(), "public", "assets", "presentazioni");

/**
 * Slide della presentazione della MC come immagini per il carosello.
 * Convenzione: public/assets/presentazioni/{mcId}/slide-NN.webp
 * (deck generato via NotebookLM dal prompt in 04_CONTENUTI/presentazioni/,
 * poi convertito in WebP.)
 */
export function getMCDeckSlides(mcId: string): VisualAsset[] {
  const dir = path.join(PUBLIC_DECK_ROOT, mcId);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => /^slide-\d+\.(webp|png|jpe?g)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name, i) => ({
      kind: "other" as const,
      label: `Slide ${i + 1}`,
      src: `${PUBLIC_BASE_PATH}/assets/presentazioni/${mcId}/${name}`,
    }));
}

const PUBLIC_AUDIO_ROOT = path.join(process.cwd(), "public", "assets", "audio");

export function getMCHookAudio(mcId: string): string | null {
  const file = path.join(PUBLIC_AUDIO_ROOT, `${mcId}_hook-audio.mp3`);
  if (!fs.existsSync(file)) return null;
  return `${PUBLIC_BASE_PATH}/assets/audio/${mcId}_hook-audio.mp3`;
}

// ── TRASCRIZIONI HOOK (CARBLE-CDD criterio L — accessibilità) ─────────────────

const TRANSCRIPTS_ROOT = path.join(process.cwd(), "data", "transcripts");

function _cleanScriptText(raw: string): string {
  // Estrai SOLO il contenuto tra ## SCRIPT e il successivo ## (METADATI, NOTE DI REGIA, ecc.)
  const scriptMatch = raw.match(/^##\s*SCRIPT\s*\n([\s\S]*?)(?=\n##\s|\s*$)/im);
  const text = scriptMatch ? scriptMatch[1] : raw;

  return text
    .replace(/```[\s\S]*?```/g, "")                            // rimuovi blocchi codice (```json...```)
    .replace(/^#.*$/gm, "")                                    // rimuovi titoli ##
    .replace(/^\*\*\[BLOCCO[^\]]*\]\*\*\s*$/gm, "")            // rimuovi header blocchi
    .replace(/^---+\s*$/gm, "")                                // rimuovi separatori ---
    .replace(/^\*\*\S[^*\n]+:\*\*[^\n]*$/gm, "")               // rimuovi righe metadati **Chiave:** valore
    .replace(/\[PAUSA\]/g, "")
    .replace(/\[ENFASI\]/g, "")
    .replace(/\*{1,2}([^*\n]+)\*{1,2}/g, "$1")                 // rimuovi bold/italic residui
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── QUIZ REALI (CARBLE-CDD criterio D — Disegno didattico) ───────────────────

export interface QuizOption {
  id: string;
  testo: string;
  corretto?: boolean;
  feedback?: string;
}

export interface QuizQuestion {
  livello: "F" | "I" | "A";
  domanda: string;
  opzioni: QuizOption[];
  spiegazione?: string;
}

const QUIZ_ROOT = path.join(process.cwd(), "data", "quiz");

export function getMCQuizData(mcId: string): QuizQuestion[] | null {
  const file = path.join(QUIZ_ROOT, `${mcId}_quiz.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return (data.domande ?? []) as QuizQuestion[];
  } catch {
    return null;
  }
}

// ── FLASHCARD ─────────────────────────────────────────────────────────────────

export interface FlashcardItem {
  front: string;
  back: string;
  tag?: string;
}

const MC_ROOT_FC = path.join(process.cwd(), "data", "mc");

export function getMCFlashcards(mcId: string): FlashcardItem[] {
  // 1. Prova a caricare flashcard JSON dedicate
  const fcFile = path.join(process.cwd(), "data", "flashcards", `${mcId}.json`);
  if (fs.existsSync(fcFile)) {
    try {
      return JSON.parse(fs.readFileSync(fcFile, "utf-8")) as FlashcardItem[];
    } catch { /* fallback */ }
  }

  // 2. Genera dalle domande del quiz (se disponibili)
  const quizFile = path.join(QUIZ_ROOT, `${mcId}_quiz.json`);
  if (fs.existsSync(quizFile)) {
    try {
      const quizData = JSON.parse(fs.readFileSync(quizFile, "utf-8"));
      const domande: QuizQuestion[] = quizData.domande ?? [];
      if (domande.length > 0) {
        return domande.slice(0, 12).map((d) => {
          const corretta = d.opzioni.find((o) => o.corretto);
          return {
            front: d.domanda,
            back: corretta ? `${corretta.testo}${d.spiegazione ? "\n\n" + d.spiegazione : ""}` : d.spiegazione ?? "",
            tag: d.livello === "F" ? "Base" : d.livello === "I" ? "Intermedio" : "Avanzato",
          };
        }).filter((f) => f.front && f.back);
      }
    } catch { /* fallback */ }
  }

  // 3. Genera dai tag della MC (fallback minimo)
  const parts = mcId.split("-");
  if (parts.length >= 3) {
    const mcFile = path.join(MC_ROOT_FC, `classe_${parts[2]}`, parts[1], `${mcId}.json`);
    if (fs.existsSync(mcFile)) {
      try {
        const mc = JSON.parse(fs.readFileSync(mcFile, "utf-8"));
        const tags: string[] = mc.tags ?? [];
        const descrizione: string = mc.descrizione ?? "";
        const compito: string = mc.compito_realta ?? "";

        const cards: FlashcardItem[] = [];

        // Card 1: titolo → descrizione
        if (mc.titolo && descrizione) {
          cards.push({
            front: `Cos'è: ${mc.titolo}?`,
            back: descrizione.split(".")[0] + ".",
            tag: mc.area,
          });
        }
        // Card 2: compito di realtà
        if (compito) {
          cards.push({
            front: "Compito di realtà: cosa devi saper fare?",
            back: compito.split(".")[0] + ".",
            tag: "AGISCI",
          });
        }
        // Card 3-N: tag come termini chiave
        const cleanTags = tags.filter((t) => !t.includes("-") && t.length > 3);
        cleanTags.slice(0, 8).forEach((tag) => {
          cards.push({ front: tag, back: `Concetto chiave dell'area ${mc.area}: ${mc.titolo}`, tag: mc.area });
        });

        return cards.filter((c) => c.front && c.back);
      } catch { /* fallback */ }
    }
  }
  return [];
}

export function getMCHookTranscript(mcId: string): string | null {
  const file = path.join(TRANSCRIPTS_ROOT, `${mcId}_hook-script.md`);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, "utf-8");
    const cleaned = _cleanScriptText(raw);
    return cleaned.length > 50 ? cleaned : null;
  } catch {
    return null;
  }
}

// ── VIDEO PLAYLIST ──────────────────────────────────────────────────────────

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
}

const VIDEOS_ROOT = path.join(process.cwd(), "data", "videos");

export function getVideoPlaylist(mcId: string): VideoItem[] {
  const file = path.join(VIDEOS_ROOT, `${mcId}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return (data.videos ?? []).slice(0, 10) as VideoItem[];
  } catch {
    return [];
  }
}

// ── MICROLEARNING INTERACTIVES ──────────────────────────────────────────────

export interface MicrolearningChecklist {
  titolo: string;
  istruzione?: string;
  voci: string[];
}

export interface MicrolearningProcessStep {
  numero: number;
  titolo: string;
  attore: string;
  domanda?: string;
  impatto?: string;
}

export interface MicrolearningProcess {
  titolo: string;
  steps: MicrolearningProcessStep[];
}

export interface MicrolearningInteractives {
  mc_id: string;
  generated_by: string;
  score: number;
  decisione: string;
  checklist?: MicrolearningChecklist;
  process?: MicrolearningProcess;
}

const MICROLEARNING_ROOT = path.join(process.cwd(), "data", "microlearning");

export function getMCMicrolearningInteractives(mcId: string): MicrolearningInteractives | null {
  const file = path.join(MICROLEARNING_ROOT, `${mcId}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8")) as MicrolearningInteractives;
    // Solo APPROVATO entra nel sito
    if (data.decisione !== "APPROVATO") return null;
    return data;
  } catch {
    return null;
  }
}

function assetRank(name: string): number {
  // Rank 0 — fotorealistica AI (hero principale della MC)
  if (name.includes("ai-fotorealistica") || name.includes("img1-soggetto")
      || name.includes("illustrazione") || name.includes("soggetto_")) return 0;
  // Rank 1 — contesto documentaristico
  if (name.includes("ai-contesto") || name.includes("img3-contesto")) return 1;
  // Rank 2 — immagini da testo e diagrammi
  if (name.includes("immagine_da_md") || name.includes("ciclo") || name.includes("diagram")) return 2;
  // Rank 3 — infografiche (mostrate in galleria, non come hero)
  if (name.includes("infografica") || name.includes("img2-infografica")) return 3;
  if (name.includes("ripassa-sketchnote")) return 3;
  // Rank 4 — compito di realtà (destinato alla tab AGISCI)
  if (name.includes("compito_realta")) return 4;
  // Rank 5 — ritratti professione, mindmap e altro
  return 5;
}

function getAssetKind(name: string): VisualAsset["kind"] {
  if (name.includes("compito_realta")) return "generated";
  if (name.includes("infografica") || name.includes("img2-infografica")) return "generated";
  if (name.includes("ripassa-sketchnote")) return "diagram";
  if (name.includes("ai-fotorealistica") || name.includes("img1-soggetto")
      || name.includes("illustrazione") || name.includes("soggetto")) return "hero";
  if (name.includes("ai-contesto") || name.includes("img3-contesto")) return "generated";
  if (name.includes("ciclo") || name.includes("diagram")) return "diagram";
  return "other";
}

function getAssetLabel(name: string): string {
  if (name.includes("compito_realta")) return "Compito di Realtà";
  if (name.includes("infografica") || name.includes("img2-infografica")) return "Infografica";
  if (name.includes("ripassa-sketchnote")) return "Ripassa";
  if (name.includes("ai-fotorealistica")) return "Illustrazione AI";
  if (name.includes("img1-soggetto")) return "Soggetto";
  if (name.includes("ai-contesto") || name.includes("img3-contesto")) return "Contesto reale";
  if (name.includes("img4-professione")) return "Professione del futuro";
  if (name.includes("illustrazione")) return "Illustrazione";
  if (name.includes("immagine_da_md")) return "Tavola da testo";
  if (name.includes("ciclo")) return "Diagramma";
  if (name.includes("soggetto")) return "Soggetto centrale";
  return "Visual";
}
