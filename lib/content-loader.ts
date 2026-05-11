import fs from "fs";
import path from "path";

// Legge testi da data/testi/ (repo standalone) o da ../../08_TESTI (workspace locale)
const TESTI_ROOT = fs.existsSync(path.join(process.cwd(), "data/testi"))
  ? path.join(process.cwd(), "data/testi")
  : path.join(path.resolve(process.cwd(), "../.."), "08_TESTI");
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
    .replace(/```[\s\S]*?```/g, "")
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
    .replace(/^\s*>\s?/gm, "")
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

  return fs
    .readdirSync(dir)
    .filter((name) => /\.(svg|png|jpe?g|webp)$/i.test(name))
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

const PUBLIC_AUDIO_ROOT = path.join(process.cwd(), "public", "assets", "audio");

export function getMCHookAudio(mcId: string): string | null {
  const file = path.join(PUBLIC_AUDIO_ROOT, `${mcId}_hook-audio.mp3`);
  if (!fs.existsSync(file)) return null;
  return `${PUBLIC_BASE_PATH}/assets/audio/${mcId}_hook-audio.mp3`;
}

// ── TRASCRIZIONI HOOK (CARBLE-CDD criterio L — accessibilità) ─────────────────

const TRANSCRIPTS_ROOT = path.join(process.cwd(), "data", "transcripts");

function _cleanScriptText(raw: string): string {
  return raw
    .replace(/^#.*$/gm, "")                          // rimuovi titoli
    .replace(/^\*\*\[BLOCCO[^\]]*\]\*\*\s*$/gm, "")  // rimuovi header blocchi
    .replace(/^---+\s*$/gm, "")                       // rimuovi separatori
    .replace(/^\*\*[A-Z][^:*]+:\*\*\s*$/gm, "")       // rimuovi label metadati
    .replace(/\[PAUSA\]/g, "")
    .replace(/\[ENFASI\]/g, "")
    .replace(/\*{1,2}([^*\n]+)\*{1,2}/g, "$1")        // rimuovi bold/italic
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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

function assetRank(name: string): number {
  // Rank 0 — infografiche (migliore per card hero e dettaglio)
  if (name.includes("infografica") || name.includes("img2-infografica")) return 0;
  // Rank 1 — immagini fotorealistiche AI e illustrazioni (hero visivo)
  if (name.includes("ai-fotorealistica") || name.includes("img1-soggetto")
      || name.includes("illustrazione") || name.includes("soggetto_")) return 1;
  // Rank 2 — contesto documentaristico
  if (name.includes("ai-contesto") || name.includes("img3-contesto")) return 2;
  // Rank 3 — immagini da testo e diagrammi
  if (name.includes("immagine_da_md") || name.includes("ciclo") || name.includes("diagram")) return 3;
  // Rank 4 — ritratti professione e altro
  return 4;
}

function getAssetKind(name: string): VisualAsset["kind"] {
  if (name.includes("infografica") || name.includes("img2-infografica")) return "generated";
  if (name.includes("ai-fotorealistica") || name.includes("img1-soggetto")
      || name.includes("illustrazione") || name.includes("soggetto")) return "hero";
  if (name.includes("ai-contesto") || name.includes("img3-contesto")) return "generated";
  if (name.includes("ciclo") || name.includes("diagram")) return "diagram";
  return "other";
}

function getAssetLabel(name: string): string {
  if (name.includes("infografica") || name.includes("img2-infografica")) return "Infografica";
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
