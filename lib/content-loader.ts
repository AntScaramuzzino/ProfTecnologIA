import crypto from "crypto";
import fs from "fs";
import path from "path";
import { isHookFuoriTema, isVisualFuoriTema } from "@/lib/asset-fuori-tema";

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
  /** Prompt usato per generare l'immagine con IA (mostrato come didascalia) */
  prompt?: string;
  /** Didascalia per immagini non generate con IA (es. schemi didattici) */
  didascalia?: string;
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

// Impronte dei file visuali di tutte le MC (MD5), calcolate una volta per build:
// servono a nascondere le foto segnaposto riusate identiche in più MC o in più posti della stessa MC.
let visualHashIndex: Map<string, string[]> | null = null;
function getVisualHashIndex(): Map<string, string[]> {
  if (visualHashIndex) return visualHashIndex;
  visualHashIndex = new Map();
  if (!fs.existsSync(PUBLIC_VISUAL_ROOT)) return visualHashIndex;
  for (const mc of fs.readdirSync(PUBLIC_VISUAL_ROOT)) {
    const dir = path.join(PUBLIC_VISUAL_ROOT, mc);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const name of fs.readdirSync(dir).filter((n) => /\.(png|jpe?g|webp)$/i.test(n))) {
      const h = crypto.createHash("md5").update(fs.readFileSync(path.join(dir, name))).digest("hex");
      visualHashIndex.set(h, [...(visualHashIndex.get(h) ?? []), `${mc}/${name}`]);
    }
  }
  return visualHashIndex;
}
function fileHash(file: string): string {
  return crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");
}

/** Immagini della professione: si vedono solo nella scheda PROFESSIONI (ProfessioneCard), non qui. */
export function isProfessioneAsset(name: string): boolean {
  return /img4-professione/i.test(name);
}

export function getVisualAssets(mcId: string): VisualAsset[] {
  const dir = path.join(PUBLIC_VISUAL_ROOT, mcId);
  if (!fs.existsSync(dir)) return [];

  const all = fs
    .readdirSync(dir)
    .filter((name) => /\.(svg|png|jpe?g|webp)$/i.test(name))
    // copie con lo spazio nel nome (es. "img4-professione 2.webp") e immagini della professione
    .filter((name) => !/\s/.test(name) && !isProfessioneAsset(name))
    // immagini con contenuto rimasto sul vecchio tema della MC (lib/asset-fuori-tema.ts)
    .filter((name) => !isVisualFuoriTema(mcId, name));

  // Un solo formato per immagine: WebP, poi PNG/JPG, poi SVG
  const pref = (n: string) => (/\.webp$/i.test(n) ? 0 : /\.(png|jpe?g)$/i.test(n) ? 1 : 2);
  const byBase = new Map<string, string>();
  for (const name of all) {
    const b = name.replace(/\.(svg|png|jpe?g|webp)$/i, "");
    const cur = byBase.get(b);
    if (!cur || pref(name) < pref(cur)) byBase.set(b, name);
  }

  const sorted = [...byBase.values()].sort((a, b) => assetRank(a) - assetRank(b) || a.localeCompare(b));

  // Foto identiche: la copertina (prima in ordine) resta; le altre copie si nascondono se il file
  // è identico a un altro della stessa MC o a quello di un'altra MC (segnaposto riusati).
  const index = getVisualHashIndex();
  const seen = new Set<string>();
  const unique = sorted.filter((name, i) => {
    if (/\.svg$/i.test(name)) return true;
    const h = fileHash(path.join(dir, name));
    if (seen.has(h)) return false;
    seen.add(h);
    if (i === 0) return true;
    const owners = new Set((index.get(h) ?? []).map((x) => x.split("/")[0]));
    return owners.size <= 1;
  });

  return unique.map((name) => ({
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

// ── IMMAGINI PER PARAGRAFO DI ESPLORA (Canva AI, stile presentazioni) ─────────

const PUBLIC_ESPLORA_ROOT = path.join(process.cwd(), "public", "assets", "esplora");

export interface EsploraImage {
  /** Titolo del paragrafo ### a cui l'immagine appartiene */
  paragrafo: string;
  src: string;
  alt: string;
  /** Prompt usato per generare l'immagine (Canva AI) */
  prompt?: string;
  /** "ia" = generata con Canva AI; "schema" = schema didattico disegnato */
  fonte?: "ia" | "schema";
  /** Didascalia per gli schemi didattici */
  didascalia?: string;
  /** Video animato facoltativo per il paragrafo (MP4 + poster + sottotitoli WebVTT) */
  video?: EsploraVideo;
}

export interface EsploraVideo {
  /** ID del video su YouTube (canale ProfTecnologIA): se presente, si incorpora da YouTube */
  youtube?: string;
  src?: string;
  poster?: string;
  sottotitoli?: string;
  titolo: string;
  durata?: string;
  nota?: string;
}

/**
 * Immagini illustrative per i paragrafi della sezione ESPLORA.
 * Convenzione: public/assets/esplora/{mcId}/manifest.json
 *   { immagini: [{ paragrafo, file, alt }] }
 */
export function getMCEsploraImages(mcId: string): EsploraImage[] {
  const file = path.join(PUBLIC_ESPLORA_ROOT, mcId, "manifest.json");
  if (!fs.existsSync(file)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8")) as {
      immagini?: {
        paragrafo: string; file: string; alt: string; prompt?: string; fonte?: "ia" | "schema"; didascalia?: string;
        video?: { file?: string; youtube?: string; poster?: string; sottotitoli?: string; titolo: string; durata?: string; nota?: string };
      }[];
    };
    return (data.immagini ?? [])
      .filter((img) => fs.existsSync(path.join(PUBLIC_ESPLORA_ROOT, mcId, img.file)))
      .map((img) => ({
        paragrafo: img.paragrafo,
        alt: img.alt,
        prompt: img.prompt,
        fonte: img.fonte ?? "ia",
        didascalia: img.didascalia,
        src: `${PUBLIC_BASE_PATH}/assets/esplora/${mcId}/${img.file}`,
        video:
          img.video && (img.video.youtube || (img.video.file && fs.existsSync(path.join(PUBLIC_ESPLORA_ROOT, mcId, img.video.file))))
            ? {
                youtube: img.video.youtube,
                src: img.video.file && !img.video.youtube ? `${PUBLIC_BASE_PATH}/assets/esplora/${mcId}/${img.video.file}` : undefined,
                poster: img.video.poster ? `${PUBLIC_BASE_PATH}/assets/esplora/${mcId}/${img.video.poster}` : undefined,
                sottotitoli: img.video.sottotitoli ? `${PUBLIC_BASE_PATH}/assets/esplora/${mcId}/${img.video.sottotitoli}` : undefined,
                titolo: img.video.titolo,
                durata: img.video.durata,
                nota: img.video.nota,
              }
            : undefined,
      }));
  } catch {
    return [];
  }
}

const PUBLIC_AUDIO_ROOT = path.join(process.cwd(), "public", "assets", "audio");

export function getMCHookAudio(mcId: string): string | null {
  if (isHookFuoriTema(mcId)) return null; // script sul vecchio tema (lib/asset-fuori-tema.ts)
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
  if (isHookFuoriTema(mcId)) return null; // script sul vecchio tema (lib/asset-fuori-tema.ts)
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
