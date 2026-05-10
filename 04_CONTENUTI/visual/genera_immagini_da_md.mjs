import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TESTI_DIR = path.join(ROOT, "08_TESTI");
const MATRICE_DIR = path.join(ROOT, "01_MATRICE_MC");
const OUT_DIR = path.join(ROOT, "04_CONTENUTI", "visual");

const areaMeta = {
  MAT: { name: "Materiali e rifiuti", color: "#6D4C41", bg: "#EFEBE9", accent: "#2f8f66", motif: "materiali" },
  DIS: { name: "Disegno tecnico", color: "#1A3A7A", bg: "#E8EFF9", accent: "#d59a21", motif: "disegno" },
  DIG: { name: "Digitale", color: "#006064", bg: "#E0F7FA", accent: "#2f82b7", motif: "digitale" },
  INF: { name: "Informatica", color: "#374151", bg: "#EEF2F7", accent: "#2f82b7", motif: "informatica" },
  ALI: { name: "Alimentazione", color: "#558B2F", bg: "#F1F8E9", accent: "#d59a21", motif: "alimentazione" },
  AMB: { name: "Abitare e territorio", color: "#BF360C", bg: "#FBE9E7", accent: "#2f8f66", motif: "ambiente" },
  ENE: { name: "Energia e macchine", color: "#E65100", bg: "#FFF3E0", accent: "#1d8a94", motif: "energia" },
  COM: { name: "Comunicazioni e trasporti", color: "#6A1B9A", bg: "#F3E5F5", accent: "#2f82b7", motif: "comunicazioni" },
  SIS: { name: "Sistemi, economia e lavoro", color: "#1B5E7A", bg: "#E1F0F8", accent: "#d9762d", motif: "sistemi" }
};

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full.includes(`${path.sep}Altri Testi${path.sep}`)) return [];
      return walk(full);
    }
    return entry.isFile() && entry.name.endsWith("_completa.md") ? [full] : [];
  });
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripMd(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, (m) => m.match(/\[([^\]]*)]/)?.[1] ?? "")
    .replace(/[#*_>`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapText(text, maxChars, maxLines) {
  const words = stripMd(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
    if (lines.length === maxLines) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (words.join(" ").length > lines.join(" ").length && lines.length) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:!?]?$/, "") + "...";
  }
  return lines;
}

function textBlock(text, x, y, opts = {}) {
  const {
    maxChars = 46,
    maxLines = 3,
    lineHeight = 25,
    cls = "body",
    anchor = "start"
  } = opts;
  return wrapText(text, maxChars, maxLines)
    .map((line, index) => `<text class="${cls}" x="${x}" y="${y + index * lineHeight}" text-anchor="${anchor}">${escapeXml(line)}</text>`)
    .join("\n");
}

function findJsonFor(id) {
  const area = id.split("-")[1];
  const year = id.split("-")[2];
  const direct = path.join(MATRICE_DIR, `classe_${year}`, area, `${id}.json`);
  if (fs.existsSync(direct)) return direct;
  return null;
}

function extractHeadings(md) {
  return [...md.matchAll(/^#{2,3}\s+(.+)$/gm)]
    .map((m) => stripMd(m[1]))
    .filter((heading) => heading && !/^metadati$/i.test(heading))
    .map((heading) => heading.replace(/^zona\s+\d+\s*[—-]\s*/i, ""))
    .filter((heading) => !/^(hook|script|metadati)$/i.test(heading))
    .slice(0, 5);
}

function parseMd(file) {
  const md = fs.readFileSync(file, "utf8");
  const id = path.basename(file).match(/(MC-[A-Z]+-\d-\d{2})/)?.[1];
  if (!id) return null;
  const jsonPath = findJsonFor(id);
  const data = jsonPath ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : {};
  const title = data.titolo || stripMd(md.match(/^#\s+(.+)$/m)?.[1] ?? id);
  const area = data.area || id.split("-")[1];
  const year = data.anno || Number(id.split("-")[2]);
  const meta = areaMeta[area] || areaMeta.INF;
  const headings = extractHeadings(md);
  const description = data.descrizione || stripMd(md).slice(0, 420);
  const task = data.compito_realta || headings.join("; ");
  const visual = data.outputApp?.visual || "Visual di sintesi della micro-competenza";
  const level = data.outputApp?.livelloDigComp || data.frameworks?.DC?.livello || "";
  const sdg = Array.isArray(data.sdg) ? data.sdg.join(", ") : (data.sdg_principale || "");
  const tags = Array.isArray(data.tags) ? data.tags.slice(0, 6) : [];
  return { id, area, year, meta, title, description, task, visual, level, sdg, tags, headings, source: path.relative(ROOT, file) };
}

function iconMotif(kind, color, accent) {
  if (kind === "disegno") {
    return `
      <path d="M610 430 L790 250 L930 390 L750 570 Z" fill="#ffffff" stroke="${color}" stroke-width="10"/>
      <path d="M690 350 L830 490" stroke="${accent}" stroke-width="9"/>
      <circle cx="750" cy="410" r="82" fill="none" stroke="${color}" stroke-width="8"/>
      <path d="M650 635 H970 M650 680 H905" stroke="#6b7f8f" stroke-width="8" stroke-linecap="round"/>`;
  }
  if (kind === "digitale" || kind === "informatica") {
    return `
      <rect x="610" y="270" width="400" height="270" rx="28" fill="#ffffff" stroke="${color}" stroke-width="10"/>
      <rect x="650" y="318" width="320" height="150" rx="10" fill="${color}" opacity="0.15"/>
      <path d="M690 375 L740 420 L690 465 M810 465 L870 375" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M720 610 H900 M780 540 V610" stroke="${color}" stroke-width="12" stroke-linecap="round"/>
      <circle cx="1000" cy="285" r="44" fill="${accent}" opacity="0.9"/>`;
  }
  if (kind === "energia") {
    return `
      <path d="M800 240 L650 520 H790 L720 720 L980 420 H825 Z" fill="${accent}" stroke="${color}" stroke-width="10" stroke-linejoin="round"/>
      <circle cx="815" cy="480" r="190" fill="none" stroke="#ffffff" stroke-width="16" opacity="0.85"/>
      <path d="M575 695 C720 790 900 790 1045 695" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"/>`;
  }
  if (kind === "alimentazione") {
    return `
      <circle cx="800" cy="455" r="180" fill="#ffffff" stroke="${color}" stroke-width="10"/>
      <path d="M705 430 C735 330 865 330 895 430 C920 520 850 605 800 645 C750 605 680 520 705 430 Z" fill="${accent}" opacity="0.88"/>
      <path d="M800 300 C840 250 900 250 940 305 C885 330 835 330 800 300 Z" fill="${color}" opacity="0.8"/>
      <path d="M590 690 H1010" stroke="${color}" stroke-width="9" stroke-linecap="round"/>`;
  }
  if (kind === "ambiente") {
    return `
      <path d="M590 650 H1020 V420 L805 260 L590 420 Z" fill="#ffffff" stroke="${color}" stroke-width="10" stroke-linejoin="round"/>
      <rect x="690" y="510" width="88" height="140" fill="${accent}" opacity="0.82"/>
      <rect x="840" y="492" width="88" height="158" fill="${color}" opacity="0.72"/>
      <path d="M585 420 H1030" stroke="${accent}" stroke-width="10"/>
      <circle cx="1030" cy="300" r="58" fill="${accent}" opacity="0.24"/>`;
  }
  if (kind === "comunicazioni") {
    return `
      <circle cx="800" cy="520" r="70" fill="#ffffff" stroke="${color}" stroke-width="10"/>
      <path d="M800 450 V265" stroke="${color}" stroke-width="10" stroke-linecap="round"/>
      <path d="M720 345 C760 305 840 305 880 345 M650 280 C730 200 870 200 950 280 M590 215 C710 95 890 95 1010 215" fill="none" stroke="${accent}" stroke-width="10" stroke-linecap="round"/>
      <path d="M800 590 L660 720 M800 590 L940 720" stroke="${color}" stroke-width="10" stroke-linecap="round"/>`;
  }
  if (kind === "sistemi") {
    return `
      <circle cx="800" cy="470" r="150" fill="#ffffff" stroke="${color}" stroke-width="10"/>
      <circle cx="800" cy="470" r="64" fill="${accent}" opacity="0.9"/>
      <path d="M800 245 V315 M800 625 V695 M575 470 H645 M955 470 H1025 M642 312 L692 362 M908 578 L958 628 M958 312 L908 362 M692 578 L642 628" stroke="${color}" stroke-width="12" stroke-linecap="round"/>
      <path d="M610 760 H990" stroke="#6b7f8f" stroke-width="8" stroke-linecap="round"/>`;
  }
  if (kind === "materiali") {
    return `
      <rect x="625" y="300" width="150" height="150" rx="24" fill="#ffffff" stroke="${color}" stroke-width="10"/>
      <circle cx="895" cy="375" r="76" fill="#ffffff" stroke="${accent}" stroke-width="10"/>
      <path d="M690 600 L800 455 L920 600 Z" fill="#ffffff" stroke="${color}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M610 695 H990" stroke="#6b7f8f" stroke-width="8" stroke-linecap="round"/>
      <circle cx="680" cy="375" r="26" fill="${accent}" opacity="0.86"/>
      <circle cx="895" cy="375" r="26" fill="${color}" opacity="0.74"/>
      <circle cx="800" cy="560" r="26" fill="${accent}" opacity="0.62"/>`;
  }
  return `
    <rect x="620" y="300" width="360" height="300" rx="28" fill="#ffffff" stroke="${color}" stroke-width="10"/>
    <circle cx="800" cy="450" r="98" fill="${accent}" opacity="0.85"/>
    <path d="M640 650 H960" stroke="${color}" stroke-width="10" stroke-linecap="round"/>`;
}

function callout(number, x, y, w, h, color, title, body) {
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${w}" height="${h}" rx="14" fill="#ffffff" stroke="${color}" stroke-width="3" filter="url(#soft)"/>
      <circle cx="34" cy="34" r="22" fill="${color}"/>
      <text class="num" text-anchor="middle" x="34" y="42">${number}</text>
      <text class="callTitle" x="68" y="39">${escapeXml(title)}</text>
      ${textBlock(body, 24, 78, { maxChars: Math.floor(w / 9), maxLines: 3, lineHeight: 25, cls: "body" })}
    </g>`;
}

function svgFor(item) {
  const { id, area, year, meta, title, description, task, visual, level, sdg, tags, headings, source } = item;
  const guide = headings.length ? headings.join(" · ") : tags.join(" · ");
  const color = meta.color;
  const bg = meta.bg;
  const accent = meta.accent;
  const chips = [area, `Classe ${year}`, level ? `DigComp ${level}` : "", sdg ? `SDG ${sdg}` : ""].filter(Boolean);
  const tagLine = tags.length ? tags.join(" · ") : meta.name;
  const titleLines = wrapText(title, 48, 2);
  const titleSize = titleLines.length > 1 ? 32 : (title.length > 58 ? 36 : title.length > 48 ? 39 : 43);
  const titleLineHeight = titleSize + 11;
  const subtitleY = titleLines.length > 1 ? 82 + titleLineHeight * titleLines.length + 20 : 122;
  const chipsY = titleLines.length > 1 ? subtitleY + 34 : 155;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(id)} - ${escapeXml(title)}</title>
  <desc id="desc">Immagine didattica generata dal Markdown della micro-competenza ${escapeXml(id)}.</desc>
  <defs>
    <filter id="soft" x="-12%" y="-12%" width="124%" height="124%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#123047" flood-opacity="0.12"/>
    </filter>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
      <path d="M1,1 L11,6 L1,11 Z" fill="#123047"/>
    </marker>
    <style>
      .subtitle { font: 400 22px Arial, sans-serif; fill: #4a6274; }
      .chip { font: 800 15px Arial, sans-serif; fill: #ffffff; }
      .section { font: 800 24px Arial, sans-serif; fill: #102f43; }
      .callTitle { font: 800 21px Arial, sans-serif; fill: #102f43; }
      .body { font: 400 18px Arial, sans-serif; fill: #34495e; }
      .small { font: 400 14px Arial, sans-serif; fill: #536b7d; }
      .num { font: 800 22px Arial, sans-serif; fill: #ffffff; }
      .line { fill: none; stroke: #123047; stroke-width: 3.5; stroke-linecap: round; marker-end: url(#arrow); opacity: 0.8; }
    </style>
  </defs>
  <rect width="1600" height="1000" fill="#f7fbfc"/>
  <circle cx="145" cy="160" r="118" fill="${bg}"/>
  <circle cx="1450" cy="145" r="94" fill="${bg}" opacity="0.75"/>
  <circle cx="1395" cy="870" r="150" fill="${accent}" opacity="0.13"/>

  ${titleLines.map((line, index) => `<text x="70" y="${82 + index * titleLineHeight}" style="font: 800 ${titleSize}px Arial, sans-serif; fill: #102f43;">${escapeXml(line)}</text>`).join("\n")}
  <text class="subtitle" x="72" y="${subtitleY}">${escapeXml(id)} · ${escapeXml(meta.name)} · immagine generata da Markdown</text>

  <g transform="translate(70 ${chipsY})">
    ${chips.map((chip, i) => `<rect x="${i * 145}" y="0" width="132" height="34" rx="17" fill="${i === 0 ? color : "#102f43"}"/><text class="chip" text-anchor="middle" x="${i * 145 + 66}" y="23">${escapeXml(chip)}</text>`).join("\n")}
  </g>

  <g filter="url(#soft)">
    <rect x="500" y="205" width="600" height="560" rx="30" fill="${bg}" stroke="#ffffff" stroke-width="8"/>
    ${iconMotif(meta.motif, color, accent)}
    <rect x="560" y="720" width="480" height="48" rx="24" fill="${color}" opacity="0.95"/>
    <text class="chip" text-anchor="middle" x="800" y="751">${escapeXml(tagLine.slice(0, 72))}</text>
  </g>

  ${callout(1, 70, 245, 382, 165, color, "Concetto chiave", description)}
  <path class="line" d="M452 320 C520 330 555 375 625 420"/>

  ${callout(2, 70, 455, 382, 170, accent, "Visual da creare", visual)}
  <path class="line" d="M452 540 C520 540 575 535 645 520"/>

  ${callout(3, 70, 672, 382, 180, "#d9762d", "Compito di realta", task)}
  <path class="line" d="M452 750 C540 712 600 665 690 618"/>

  ${callout(4, 1148, 245, 382, 170, "#2f82b7", "Punti guida", guide || "oggetto, processo, impatto")}
  <path class="line" d="M1148 330 C1070 350 1040 382 982 430"/>

  ${callout(5, 1148, 455, 382, 170, "#2f8f66", "Aggancio reale", task)}
  <path class="line" d="M1148 540 C1080 540 1030 535 955 520"/>

  <g transform="translate(1148 690)">
    <rect width="382" height="122" rx="14" fill="#102f43" filter="url(#soft)"/>
    <text class="chip" x="24" y="36">Uso nella doppia pagina</text>
    <text class="chip" x="24" y="68">ESPLORA: concetto + visual</text>
    <text class="chip" x="24" y="96">SPERIMENTA/5: laboratorio e compito</text>
  </g>

  <g transform="translate(70 900)">
    <rect width="1460" height="54" rx="10" fill="#ffffff" stroke="#d5e4ec" stroke-width="2"/>
    <text class="small" x="22" y="34">Fonte testo: ${escapeXml(source)} · Asset SVG editabile · Prima passata visuale generata da Markdown e scheda MC.</text>
  </g>
</svg>
`;
}

const items = walk(TESTI_DIR).map(parseMd).filter(Boolean);
const manifest = [];
for (const item of items) {
  const dir = path.join(OUT_DIR, item.id);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${item.id}_immagine_da_md.svg`;
  const out = path.join(dir, filename);
  fs.writeFileSync(out, svgFor(item), "utf8");
  manifest.push({ id: item.id, title: item.title, source: item.source, image: path.relative(ROOT, out) });
}

const manifestMd = `# Immagini generate dai Markdown

Data generazione: ${new Date().toISOString().slice(0, 10)}

Questa è una prima passata completa in SVG editabile: una tavola visuale per ogni file \`*_completa.md\` in \`08_TESTI/\`.
Le immagini sono pensate come base controllabile per il libro: callout, testi e struttura restano modificabili; per gli asset finali più ricchi si può sostituire il soggetto centrale con una generazione raster.

| MC | Titolo | Sorgente Markdown | Immagine |
|---|---|---|---|
${manifest.map((row) => `| ${row.id} | ${row.title.replaceAll("|", "\\|")} | \`${row.source}\` | \`${row.image}\` |`).join("\n")}
`;

fs.writeFileSync(path.join(OUT_DIR, "IMMAGINI_GENERATE_DA_MD.md"), manifestMd, "utf8");
console.log(`Generate ${manifest.length} immagini SVG.`);
