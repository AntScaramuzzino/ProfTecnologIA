import fs from "fs";
import path from "path";
import sharp from "../../05_APP/tecnologia-sito-web/node_modules/sharp/lib/index.js";

const ROOT = process.cwd();
const MC_ROOT = path.join(ROOT, "05_APP/tecnologia-sito-web/data/mc");
const BOOK_VISUAL_ROOT = path.join(ROOT, "04_CONTENUTI/visual");
const WEB_VISUAL_ROOT = path.join(ROOT, "05_APP/tecnologia-sito-web/public/assets/visual");

const AREA = {
  MAT: { label: "MATERIALI", accent: "#00897B", icon: "materials" },
  DIS: { label: "DISEGNO", accent: "#E67E22", icon: "drawing" },
  DIG: { label: "DIGITALE", accent: "#00897B", icon: "digital" },
  ALI: { label: "ALIMENTAZIONE", accent: "#C44E3B", icon: "food" },
  AMB: { label: "AMBIENTE", accent: "#00897B", icon: "city" },
  ENE: { label: "ENERGIA", accent: "#E67E22", icon: "energy" },
  COM: { label: "COMUNICAZIONI", accent: "#C44E3B", icon: "network" },
  SIS: { label: "SISTEMI", accent: "#00897B", icon: "systems" },
  INF: { label: "INFORMATICA", accent: "#00897B", icon: "digital" },
};

const COLORS = {
  ink: "#151515",
  teal: "#00897B",
  orange: "#E67E22",
  red: "#C44E3B",
  paper: "#FFFFFF",
  softTeal: "#DFF4EF",
  softOrange: "#FBE9D8",
  softRed: "#F8DDD8",
};

const STOP = new Set([
  "classe", "foundation", "intermediate", "advanced", "digitale", "tecnologia",
  "tecnologie", "base", "sistema", "sistemi", "progetto", "progettazione",
  "uso", "dati", "dato", "online", "digitale", "digitali",
]);

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full));
    else if (/^MC-.*\.json$/.test(entry.name)) out.push(full);
  }
  return out.sort();
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function simplify(value, maxWords = 3) {
  return String(value || "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[·_/|]+/g, " ")
    .replace(/\b(MC|DIG|MAT|DIS|ALI|AMB|ENE|COM|SIS|INF)\b/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxWords)
    .join(" ");
}

function titleCase(value) {
  return simplify(value, 10).toUpperCase();
}

function conceptsFor(mc) {
  const raw = [];
  const tags = Array.isArray(mc.tags) ? mc.tags : [];
  for (const tag of tags) {
    const clean = simplify(tag, 3).toLowerCase();
    if (!clean || STOP.has(clean) || clean.startsWith("classe")) continue;
    raw.push(clean);
  }

  const output = mc.outputApp || {};
  for (const value of [output.visual, output.microlearning, output.quiz]) {
    if (!value) continue;
    const pieces = String(value)
      .split(/[.,:;()]+/)
      .map((x) => simplify(x, 3).toLowerCase())
      .filter((x) => x && x.length > 4 && !STOP.has(x));
    raw.push(...pieces.slice(0, 2));
  }

  if (mc.professione_futura?.titolo) raw.push(`professione ${simplify(mc.professione_futura.titolo, 2)}`.toLowerCase());
  if (Array.isArray(mc.professioni_future) && mc.professioni_future[0]?.titolo) {
    raw.push(`futuro ${simplify(mc.professioni_future[0].titolo, 2)}`.toLowerCase());
  }

  const dedup = [];
  for (const item of raw) {
    const clean = item
      .replace(/\s+/g, " ")
      .replace(/^[0-9]+[fiha]?\s*/i, "")
      .trim();
    if (!clean || clean.length < 3) continue;
    if (!dedup.some((x) => x === clean || x.includes(clean) || clean.includes(x))) dedup.push(clean);
  }

  const fallback = [
    simplify(mc.titolo, 3).toLowerCase(),
    "concetti chiave",
    "esempi reali",
    "azioni corrette",
    "scelte responsabili",
    "ripasso veloce",
  ];
  return [...dedup, ...fallback].slice(0, 6).map((x) => x.toUpperCase());
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length <= maxChars) line = (line + " " + word).trim();
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function textBlock(x, y, text, {
  size = 30,
  color = COLORS.ink,
  width = 18,
  anchor = "middle",
  weight = 800,
  lineHeight = Math.round(size * 1.18),
  rotate = 0,
} = {}) {
  const lines = wrapText(text, width);
  const offset = -((lines.length - 1) * lineHeight) / 2;
  return `<g transform="rotate(${rotate} ${x} ${y})">${lines.map((line, i) => (
    `<text x="${x}" y="${y + offset + i * lineHeight}" text-anchor="${anchor}" dominant-baseline="middle" font-family="'Comic Sans MS','Marker Felt','Chalkboard SE',Arial,sans-serif" font-size="${size}" font-weight="${weight}" letter-spacing="1.2" fill="${color}">${escapeXml(line)}</text>`
  )).join("")}</g>`;
}

function roughLine(x1, y1, x2, y2, color = COLORS.ink, w = 4) {
  const dx = (x2 - x1) * 0.18;
  const dy = (y2 - y1) * 0.18;
  return `<path d="M${x1} ${y1} C${x1 + dx} ${y1 + dy - 18} ${x2 - dx} ${y2 - dy + 18} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" marker-end="url(#arrow)"/>`;
}

function icon(type, x, y, color) {
  const ink = COLORS.ink;
  const c = color;
  const common = `stroke="${ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  if (type === "digital") {
    return `<rect x="${x - 45}" y="${y - 32}" width="90" height="58" rx="8" fill="${COLORS.softTeal}" ${common}/><path d="M${x - 28} ${y + 45} H${x + 28}" ${common}/><path d="M${x} ${y + 26} V${y + 45}" ${common}/><circle cx="${x - 18}" cy="${y - 4}" r="5" fill="${c}"/><circle cx="${x + 3}" cy="${y - 4}" r="5" fill="${c}"/><circle cx="${x + 24}" cy="${y - 4}" r="5" fill="${c}"/>`;
  }
  if (type === "drawing") {
    return `<path d="M${x - 50} ${y + 38} L${x + 40} ${y - 42}" ${common}/><path d="M${x + 42} ${y - 44} L${x + 58} ${y - 28} L${x + 30} ${y - 16} Z" fill="${COLORS.softOrange}" ${common}/><path d="M${x - 48} ${y + 38} L${x - 62} ${y + 52}" ${common}/><circle cx="${x - 8}" cy="${y - 2}" r="32" fill="none" stroke="${c}" stroke-width="5"/>`;
  }
  if (type === "materials") {
    return `<rect x="${x - 58}" y="${y - 34}" width="42" height="62" rx="4" fill="${COLORS.softOrange}" ${common}/><circle cx="${x + 6}" cy="${y - 4}" r="34" fill="${COLORS.softTeal}" ${common}/><path d="M${x + 38} ${y + 32} L${x + 62} ${y + 52}" ${common}/><path d="M${x - 48} ${y - 16} H${x - 25} M${x - 48} ${y} H${x - 24}" stroke="${c}" stroke-width="4"/>`;
  }
  if (type === "food") {
    return `<path d="M${x - 46} ${y + 26} C${x - 68} ${y - 18} ${x - 15} ${y - 62} ${x + 10} ${y - 22} C${x + 42} ${y - 58} ${x + 72} ${y - 4} ${x + 34} ${y + 28} C${x + 12} ${y + 48} ${x - 22} ${y + 48} ${x - 46} ${y + 26}Z" fill="${COLORS.softRed}" ${common}/><path d="M${x + 3} ${y - 46} C${x + 12} ${y - 70} ${x + 38} ${y - 66} ${x + 48} ${y - 52}" ${common}/>`;
  }
  if (type === "city") {
    return `<rect x="${x - 62}" y="${y - 42}" width="34" height="84" fill="${COLORS.softTeal}" ${common}/><rect x="${x - 14}" y="${y - 68}" width="34" height="110" fill="${COLORS.softOrange}" ${common}/><rect x="${x + 34}" y="${y - 24}" width="34" height="66" fill="${COLORS.softRed}" ${common}/><path d="M${x - 68} ${y + 44} H${x + 76}" ${common}/>`;
  }
  if (type === "energy") {
    return `<path d="M${x + 4} ${y - 70} L${x - 42} ${y + 6} H${x - 5} L${x - 22} ${y + 70} L${x + 48} ${y - 18} H${x + 7} Z" fill="${COLORS.softOrange}" ${common}/><circle cx="${x}" cy="${y}" r="58" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="12 10"/>`;
  }
  if (type === "network") {
    return `<circle cx="${x - 44}" cy="${y + 24}" r="20" fill="${COLORS.softTeal}" ${common}/><circle cx="${x + 44}" cy="${y + 24}" r="20" fill="${COLORS.softOrange}" ${common}/><circle cx="${x}" cy="${y - 46}" r="20" fill="${COLORS.softRed}" ${common}/><path d="M${x - 28} ${y + 10} L${x - 8} ${y - 30} M${x + 28} ${y + 10} L${x + 8} ${y - 30} M${x - 22} ${y + 24} H${x + 22}" ${common}/>`;
  }
  return `<circle cx="${x}" cy="${y}" r="44" fill="${COLORS.softTeal}" ${common}/><path d="M${x - 22} ${y} H${x + 22} M${x} ${y - 22} V${y + 22}" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`;
}

function miniDoodle(kind, x, y, color) {
  const common = `stroke="${COLORS.ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"`;
  const fill = color === COLORS.teal ? COLORS.softTeal : color === COLORS.orange ? COLORS.softOrange : COLORS.softRed;
  if (kind % 5 === 0) return `<path d="M${x - 45} ${y + 25} L${x - 12} ${y - 35} L${x + 15} ${y + 5} L${x + 48} ${y - 42}" fill="none" ${common}/><circle cx="${x - 45}" cy="${y + 25}" r="7" fill="${fill}" ${common}/><circle cx="${x - 12}" cy="${y - 35}" r="7" fill="${fill}" ${common}/><circle cx="${x + 15}" cy="${y + 5}" r="7" fill="${fill}" ${common}/><circle cx="${x + 48}" cy="${y - 42}" r="7" fill="${fill}" ${common}/>`;
  if (kind % 5 === 1) return `<rect x="${x - 48}" y="${y - 32}" width="96" height="64" rx="10" fill="${fill}" ${common}/><path d="M${x - 26} ${y - 6} H${x + 26} M${x - 26} ${y + 13} H${x + 12}" ${common}/>`;
  if (kind % 5 === 2) return `<circle cx="${x}" cy="${y}" r="46" fill="none" stroke="${color}" stroke-width="7"/><path d="M${x} ${y - 46} A46 46 0 0 1 ${x + 44} ${y + 12}" fill="none" ${common}/><path d="M${x} ${y} L${x + 22} ${y - 27}" ${common}/>`;
  if (kind % 5 === 3) return `<path d="M${x - 48} ${y + 34} C${x - 18} ${y - 45} ${x + 18} ${y - 45} ${x + 48} ${y + 34}" fill="${fill}" ${common}/><path d="M${x - 22} ${y + 34} V${y - 18} M${x + 22} ${y + 34} V${y - 18}" ${common}/>`;
  return `<path d="M${x - 42} ${y - 28} H${x + 42} V${y + 28} H${x - 42} Z" fill="${fill}" ${common}/><path d="M${x - 26} ${y - 6} L${x - 5} ${y + 14} L${x + 28} ${y - 18}" ${common}/>`;
}

function sketchnoteSvg(mc) {
  const area = AREA[mc.area] || AREA.DIG;
  const title = titleCase(mc.titolo_libro || mc.titolo || mc.id);
  const concepts = conceptsFor(mc);
  const positions = [
    [310, 210, -2],
    [610, 135, 1],
    [990, 135, -1],
    [1290, 225, 2],
    [1190, 695, -1],
    [410, 695, 1],
  ];
  const doodlePositions = [
    [165, 350],
    [455, 305],
    [1145, 305],
    [1435, 365],
    [1390, 600],
    [210, 600],
  ];
  const fills = [COLORS.softTeal, COLORS.softOrange, COLORS.softRed, COLORS.softTeal, COLORS.softOrange, COLORS.softRed];
  const accents = [COLORS.teal, COLORS.orange, COLORS.red, COLORS.teal, COLORS.orange, COLORS.red];

  const boxW = 510;
  const boxH = 150;
  const cx = 800;
  const cy = 450;
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img">`);
  parts.push(`<rect width="1600" height="900" fill="${COLORS.paper}"/>`);
  parts.push(`<defs><marker id="arrow" markerWidth="14" markerHeight="14" refX="11" refY="7" orient="auto"><path d="M2,2 L12,7 L2,12" fill="${COLORS.ink}"/></marker><filter id="paperShadow"><feDropShadow dx="5" dy="7" stdDeviation="0.6" flood-color="${COLORS.ink}" flood-opacity="0.18"/></filter></defs>`);
  parts.push(`<path d="M34 42 C260 24 502 35 738 28 C1050 21 1298 35 1566 25" fill="none" stroke="${COLORS.ink}" stroke-width="3" stroke-linecap="round" opacity="0.12"/>`);
  parts.push(textBlock(76, 74, mc.id, { size: 28, anchor: "start", width: 20 }));
  parts.push(textBlock(1524, 74, area.label, { size: 26, anchor: "end", width: 24, color: area.accent }));

  for (const [x, y] of positions) {
    parts.push(roughLine(cx, cy, x, y, COLORS.ink, 3));
  }

  parts.push(`<g filter="url(#paperShadow)">`);
  parts.push(`<path d="M${cx - boxW / 2} ${cy - boxH / 2} L${cx + boxW / 2} ${cy - boxH / 2 + 7} L${cx + boxW / 2 - 8} ${cy + boxH / 2} L${cx - boxW / 2 + 6} ${cy + boxH / 2 - 6} Z" fill="#fff" stroke="${COLORS.ink}" stroke-width="6" stroke-linejoin="round"/>`);
  parts.push(`<path d="M${cx + boxW / 2} ${cy - boxH / 2 + 7} L${cx + boxW / 2 + 34} ${cy - boxH / 2 + 34} L${cx + boxW / 2 + 24} ${cy + boxH / 2 + 26} L${cx + boxW / 2 - 8} ${cy + boxH / 2} Z" fill="${COLORS.softOrange}" stroke="${COLORS.ink}" stroke-width="5" stroke-linejoin="round"/>`);
  parts.push(`<path d="M${cx - boxW / 2 + 6} ${cy + boxH / 2 - 6} L${cx - boxW / 2 + 38} ${cy + boxH / 2 + 26} L${cx + boxW / 2 + 24} ${cy + boxH / 2 + 26} L${cx + boxW / 2 - 8} ${cy + boxH / 2} Z" fill="${COLORS.softTeal}" stroke="${COLORS.ink}" stroke-width="5" stroke-linejoin="round"/>`);
  parts.push(textBlock(cx, cy - 8, title, { size: title.length > 34 ? 32 : 38, width: 23, lineHeight: title.length > 34 ? 38 : 44 }));
  parts.push(`</g>`);

  parts.push(icon(area.icon, cx, cy + 192, area.accent));
  parts.push(textBlock(cx, cy + 295, "RIPASSA IN 60 SECONDI", { size: 24, color: COLORS.red, width: 26 }));

  concepts.forEach((concept, i) => {
    const [x, y, rot] = positions[i];
    const w = i === 1 || i === 2 ? 345 : 370;
    const h = 118;
    parts.push(`<g transform="rotate(${rot} ${x} ${y})">`);
    parts.push(`<path d="M${x - w / 2} ${y - h / 2 + 6} C${x - w / 2 + 45} ${y - h / 2 - 12} ${x + w / 2 - 45} ${y - h / 2 - 8} ${x + w / 2} ${y - h / 2 + 4} L${x + w / 2 - 8} ${y + h / 2 - 4} C${x + 88} ${y + h / 2 + 14} ${x - 96} ${y + h / 2 + 12} ${x - w / 2 + 8} ${y + h / 2 - 2} Z" fill="${fills[i]}" stroke="${COLORS.ink}" stroke-width="5" stroke-linejoin="round"/>`);
    parts.push(textBlock(x, y, concept, { size: concept.length > 18 ? 23 : 27, width: 13, rotate: rot, lineHeight: 29 }));
    parts.push(`</g>`);
    parts.push(miniDoodle(i, doodlePositions[i][0], doodlePositions[i][1], accents[i]));
  });

  parts.push(`<path d="M80 820 C260 840 382 805 530 830 C710 858 858 818 1020 838 C1196 860 1342 816 1518 838" fill="none" stroke="${COLORS.ink}" stroke-width="4" stroke-linecap="round" opacity="0.35"/>`);
  parts.push(`<path d="M92 846 C318 874 596 846 804 864 C1044 886 1280 846 1510 866" fill="none" stroke="${COLORS.orange}" stroke-width="5" stroke-linecap="round" opacity="0.55"/>`);
  parts.push(`</svg>`);
  return parts.join("\n");
}

async function renderOne(file) {
  const mc = JSON.parse(fs.readFileSync(file, "utf8"));
  const svg = sketchnoteSvg(mc);
  const manifest = {
    mc_id: mc.id,
    generated_at: new Date().toISOString(),
    type: "ripassa-sketchnote",
    aspect_ratio: "16:9",
    style: "hand-drawn sketchnote, graphic recording, black fineliner, teal orange muted red markers",
    concepts: conceptsFor(mc),
  };

  for (const root of [BOOK_VISUAL_ROOT, WEB_VISUAL_ROOT]) {
    const dir = path.join(root, mc.id);
    fs.mkdirSync(dir, { recursive: true });
    const base = path.join(dir, `${mc.id}_ripassa-sketchnote`);
    fs.writeFileSync(`${base}.svg`, svg, "utf8");
    fs.writeFileSync(`${base}_manifest.json`, JSON.stringify(manifest, null, 2), "utf8");
    await sharp(Buffer.from(svg), { density: 144 }).resize(1600, 900).png().toFile(`${base}.png`);
    await sharp(Buffer.from(svg), { density: 144 }).resize(1600, 900).webp({ quality: 86 }).toFile(`${base}.webp`);
  }
  return mc.id;
}

const files = listFiles(MC_ROOT);
let count = 0;
for (const file of files) {
  const id = await renderOne(file);
  count += 1;
  console.log(`${count}/${files.length} ${id}`);
}
console.log(`Generated ${count} ripassa sketchnotes`);
