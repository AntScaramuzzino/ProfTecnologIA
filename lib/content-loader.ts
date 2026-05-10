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
    .replace(/\s*\(Fonte:[^)]+\)/gi, "")
    .replace(/^#{3,6}\s+(.+)$/gm, "\n@@SUBHEAD:$1\n")
    .replace(/^#{1,2}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/[ \t]+\n/g, "\n")
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

function assetRank(name: string): number {
  if (name.includes("infografica")) return 0;
  if (name.includes("illustrazione")) return 1;
  if (name.includes("immagine_da_md")) return 2;
  if (name.includes("ciclo") || name.includes("diagram")) return 3;
  return 4;
}

function getAssetKind(name: string): VisualAsset["kind"] {
  if (name.includes("illustrazione") || name.includes("soggetto")) return "hero";
  if (name.includes("infografica") || name.includes("immagine_da_md")) return "generated";
  if (name.includes("ciclo") || name.includes("diagram")) return "diagram";
  return "other";
}

function getAssetLabel(name: string): string {
  if (name.includes("infografica")) return "Infografica";
  if (name.includes("illustrazione")) return "Illustrazione";
  if (name.includes("immagine_da_md")) return "Tavola da testo";
  if (name.includes("ciclo")) return "Diagramma";
  if (name.includes("soggetto")) return "Soggetto centrale";
  return "Visual";
}
