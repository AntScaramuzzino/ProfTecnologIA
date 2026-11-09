// Compressione: lossless e lossy — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.35);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.minD) D = Math.max(D, def.minD);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

const shade = v => mix(C.bg, C.line, clamp(v));
// griglia di pixel: M = righe di cifre 0..2 (o funzione (r,c)->0..1)
function pixGrid(x, y, cell, M, o = {}) {
  const rows = M.length, cols = M[0].length; let s = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const v = typeof M[r] === 'string' ? [0.09, 0.4, 1][+M[r][c]] : M[r][c];
    s += `<rect x="${x + c * cell}" y="${y + r * cell}" width="${cell}" height="${cell}" fill="${shade(v)}"/>`;
  }
  s += `<rect x="${x}" y="${y}" width="${cols * cell}" height="${rows * cell}" fill="none" stroke="${o.ink || C.line}" stroke-width="4"/>`;
  return s;
}
const HOUSE = ['00000000', '00022000', '00222200', '02222220', '00211200', '00211200', '11111111', '11111111'];

// 1 — aggancio: stessa informazione, meno bit
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('bit'),
  render(t) {
    const bits = '000000001111111100000000', cw = 52, x0 = 960 - 12 * cw;
    let s = E(t, -0.4, lbl(x0, 330, 'UN FILE · 24 BIT · ESEMPIO', { a: 'start' }), { dy: 0 });
    for (let i = 0; i < 24; i++) s += E(t, -0.4 + i * 0.03, `<rect x="${x0 + i * cw}" y="370" width="${cw}" height="76" fill="${C.fillD}" stroke="${C.line}" stroke-width="2.5"/>` + T(x0 + i * cw + cw / 2, 422, bits[i], { f: 'mono', size: 34, a: 'middle', w: 700 }), { dy: 8, d: 0.35 });
    s += E(t, W('stessa') - 0.1, lbl(960, 500, 'STESSA INFORMAZIONE', { size: 26 }));
    s += E(t, W('meno') - 0.1, arrow(960, 525, 960, 600, C.line, 4, 18) +
      `<rect x="${960 - 6 * cw}" y="615" width="${12 * cw}" height="76" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="10 9"/>` +
      T(960, 668, '?', { f: 'pop', size: 54, a: 'middle' }) + lbl(960, 735, 'MENO BIT', { size: 26 }), { dy: 10 });
    return s + caption(t, W('bit'), 'Meno bit', 'bit');
  } }) });

// 2 — lossless: si ricostruisce esattamente l'originale
scene('lossless', { tail: 0.4, make: (W) => ({
  capAt: W('perdita'),
  render(t) {
    const Y = 300, cell = 30;
    let s = E(t, -0.4, T(960, 200, 'LOSSLESS', { f: 'pop', size: 70, a: 'middle' }), { dy: 0 });
    s += E(t, -0.3, pixGrid(240, Y, cell, HOUSE) + lbl(360, Y + 300, 'ORIGINALE', { size: 26 }), { dy: 0 });
    // file compresso: blocco più piccolo, righe fitte
    let z = '';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) z += `<rect x="${900 + c * 24}" y="${Y + 60 + r * 24}" width="24" height="24" fill="${shade([0.09, 0.4, 1][(r * 3 + c * 2 + (r * c) % 3) % 3])}"/>`;
    z += `<rect x="900" y="${Y + 60}" width="120" height="120" fill="none" stroke="${C.line}" stroke-width="4"/>` + lbl(960, Y + 230, 'MENO BIT', { size: 24 });
    s += E(t, W('compresso') - 0.1, arrow(530, Y + 120, 850, Y + 120, C.line, 4, 18) + z + lbl(960, Y + 300, 'COMPRESSO', { size: 26 }));
    s += E(t, W('ricostruisce') - 0.1, arrow(1070, Y + 120, 1390, Y + 120, C.line, 4, 18) + pixGrid(1440, Y, cell, HOUSE) + lbl(1560, Y + 300, 'RICOSTRUITO', { size: 26 }));
    s += E(t, W('esattamente') - 0.05, `<path d="M360,${Y + 330} L360,${Y + 372} L1560,${Y + 372} L1560,${Y + 330}" fill="none" stroke="${C.coral}" stroke-width="4"/>` +
      T(960, Y + 425, 'IDENTICO ALL\'ORIGINALE', { f: 'mono', size: 32, fill: C.coral, a: 'middle', ls: 4, w: 700 }));
    return s + caption(t, W('perdita'), 'Senza perdita', '');
  } }) });

// 3 — ridondanze sostituite con rappresentazioni più corte
scene('ridondanze', { tail: 1.1, make: (W) => ({
  capAt: W('sostituisce'),
  render(t) {
    const row = 'BBBBBBBBBWWW', cw = 104, x0 = 960 - 6 * cw, y = 330;
    let s = E(t, -0.4, lbl(x0, y - 40, 'UNA RIGA DI PIXEL · ESEMPIO', { a: 'start' }) + lbl(x0 + 12 * cw, y - 40, 'B = BLU · W = BIANCO', { a: 'end' }), { dy: 0 });
    for (let i = 0; i < 12; i++) s += E(t, -0.4 + i * 0.03, `<rect x="${x0 + i * cw}" y="${y}" width="${cw}" height="100" fill="${row[i] === 'B' ? C.fillD2 : C.line}" stroke="${C.line}" stroke-width="2.5"/>` + T(x0 + i * cw + cw / 2, y + 66, row[i], { f: 'mono', size: 44, a: 'middle', w: 700, fill: row[i] === 'B' ? C.line : C.ink }), { dy: 8, d: 0.35 });
    s += E(t, W('sequenze') - 0.1, `<path d="M${x0 + 8},${y + 118} L${x0 + 8},${y + 136} L${x0 + 9 * cw - 8},${y + 136} L${x0 + 9 * cw - 8},${y + 118}" fill="none" stroke="${C.line}" stroke-width="3"/>` + lbl(x0 + 4.5 * cw, y + 182, 'SI RIPETE 9 VOLTE', { size: 26 }) +
      `<path d="M${x0 + 9 * cw + 8},${y + 118} L${x0 + 9 * cw + 8},${y + 136} L${x0 + 12 * cw - 8},${y + 136} L${x0 + 12 * cw - 8},${y + 118}" fill="none" stroke="${C.line}" stroke-width="3"/>` + lbl(x0 + 10.5 * cw, y + 182, '3 VOLTE', { size: 26 }));
    const yb = 640, bw = 210;
    s += E(t, W('sostituisce') - 0.1, arrow(960, y + 205, 960, yb - 20, C.line, 4, 18) +
      `<rect x="${960 - bw - 26}" y="${yb - 16}" width="${2 * bw + 52}" height="132" rx="12" fill="none" stroke="${C.coral}" stroke-width="5"/>` +
      `<rect x="${960 - bw - 10}" y="${yb}" width="${bw}" height="100" fill="${C.fillD2}" stroke="${C.line}" stroke-width="3"/>` + T(960 - bw / 2 - 10, yb + 66, '9×B', { f: 'mono', size: 48, a: 'middle', w: 700 }) +
      `<rect x="${960 + 10}" y="${yb}" width="${bw}" height="100" fill="${C.line}" stroke="${C.line}" stroke-width="3"/>` + T(960 + bw / 2 + 10, yb + 66, '3×W', { f: 'mono', size: 48, a: 'middle', w: 700, fill: C.ink }));
    s += E(t, W('corte') - 0.1, T(960 + bw + 60, yb + 64, 'più corta', { f: 'serif', size: 56, it: true }));
    return s + caption(t, W('sostituisce'), 'Ridondanze sostituite', '');
  } }) });

// icone per gli esempi
function pngIcon(x, y, ink) {
  return `<rect x="${x - 110}" y="${y - 80}" width="220" height="160" rx="10" fill="${C.ivory}" stroke="${ink}" stroke-width="4"/>` +
    `<rect x="${x - 110}" y="${y - 80}" width="220" height="34" rx="10" fill="${mix(C.ivory, ink, 0.18)}" stroke="${ink}" stroke-width="4"/>` +
    `<circle cx="${x - 40}" cy="${y + 18}" r="30" fill="${ink}"/><rect x="${x + 10}" y="${y - 10}" width="70" height="60" fill="${mix(C.ivory, ink, 0.35)}" stroke="${ink}" stroke-width="3"/>`;
}
function waveIcon(x, y, ink) {
  let d = '';
  for (let i = 0; i <= 60; i++) { const xx = x - 120 + i * 4, a = Math.sin(i * 0.55) * (40 + 30 * Math.sin(i * 0.13)); d += (i ? 'L' : 'M') + xx + ',' + (y + a).toFixed(1); }
  return `<line x1="${x - 130}" y1="${y}" x2="${x + 130}" y2="${y}" stroke="${ink}" stroke-width="2" opacity="0.5"/><path d="${d}" fill="none" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
}
function zipIcon(x, y, ink) {
  let s = `<path d="M${x - 110},${y - 70} L${x - 30},${y - 70} L${x - 10},${y - 50} L${x + 110},${y - 50} L${x + 110},${y + 80} L${x - 110},${y + 80} z" fill="${C.ivory}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  for (let j = 0; j < 6; j++) s += `<rect x="${x - (j % 2 ? 2 : 14)}" y="${y - 44 + j * 18}" width="16" height="10" fill="${ink}"/>`;
  return s;
}
// 4 — esempi lossless
scene('esempi', { tail: 0.35, make: (W) => ({
  capAt: W('esempi'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, ink = C.ink;
    let g = E(t, -0.4, card(160, 160, 1600, 650, { rot: -0.6 }), { dy: 0 });
    g += E(t, -0.2, T(250, 250, 'LOSSLESS · ESEMPI', { f: 'mono', size: 30, fill: ink, ls: 4, w: 700 }));
    const X = [480, 960, 1440];
    g += E(t, W('png') - 0.1, pngIcon(X[0], 420, ink) + T(X[0], 600, 'PNG', { f: 'pop', size: 72, fill: ink, a: 'middle' }));
    g += E(t, W('loghi') - 0.05, T(X[0], 670, 'loghi, screenshot', { f: 'popm', size: 36, fill: ink, a: 'middle' }));
    g += E(t, W('flac') - 0.1, waveIcon(X[1], 420, ink) + T(X[1], 600, 'FLAC', { f: 'pop', size: 72, fill: ink, a: 'middle' }) + T(X[1], 670, 'audio', { f: 'popm', size: 36, fill: ink, a: 'middle' }));
    g += E(t, W('grandi') - 0.05, T(X[1], 735, 'file grandi circa la metà', { f: 'popm', size: 36, fill: C.coral, a: 'middle', w: 500 }));
    g += E(t, W('zip') - 0.1, zipIcon(X[2], 420, ink) + T(X[2], 600, 'ZIP', { f: 'pop', size: 72, fill: ink, a: 'middle' }) + T(X[2], 670, 'qualsiasi file', { f: 'popm', size: 36, fill: ink, a: 'middle' }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('esempi'), 'Esempi', '', true);
  } }) });

// immagine con dettaglio fine (originale) e senza (compressa) — 10×10
const IMG = (r, c, fine) => clamp(0.18 + 0.5 * Math.exp(-((r - 3.5) ** 2 + (c - 6) ** 2) / 14) + 0.25 * (r / 9) + (fine ? 0.11 * (((r * 7 + c * 3) % 5) / 4 - 0.5) : 0));
const IMG_O = [...Array(10)].map((_, r) => [...Array(10)].map((_, c) => IMG(r, c, true)));
const IMG_C = [...Array(10)].map((_, r) => [...Array(10)].map((_, c) => 0.75 * IMG(r, c, true) + 0.25 * IMG(r, c, false)));
function eye(x, y, ink) {
  return `<path d="M${x - 60},${y} Q${x},${y - 46} ${x + 60},${y} Q${x},${y + 46} ${x - 60},${y} z" fill="none" stroke="${ink}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${ink}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="5" fill="${ink}"/>`;
}
function ear(x, y, ink) {
  return `<path d="M${x - 24},${y + 40} Q${x - 40},${y - 10} ${x - 26},${y - 36} Q${x},${y - 66} ${x + 30},${y - 40} Q${x + 48},${y - 10} ${x + 20},${y + 16} Q${x + 4},${y + 30} ${x + 4},${y + 50} Q${x - 4},${y + 66} ${x - 24},${y + 40}" fill="none" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M${x - 8},${y - 6} Q${x},${y - 30} ${x + 18},${y - 18}" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>`;
}
// 5 — lossy: si scarta il meno percepibile
scene('lossy', { tail: 0.35, make: (W) => ({
  capAt: W('perdita'),
  render(t) {
    const Y = 300, cell = 30;
    let s = E(t, -0.4, T(960, 200, 'LOSSY', { f: 'pop', size: 70, a: 'middle' }), { dy: 0 });
    s += E(t, -0.3, pixGrid(260, Y, cell, IMG_O) + lbl(410, Y + 345, 'ORIGINALE', { size: 26 }), { dy: 0 });
    s += E(t, W('occhio') - 0.1, eye(870, 300, C.line));
    s += E(t, W('orecchio') - 0.1, ear(1050, 300, C.line));
    s += E(t, W('orecchio') + 0.2, lbl(960, 400, 'PERCEPISCONO MENO →', { size: 24 }) + lbl(960, 434, 'SI SCARTA', { size: 24 }));
    // dettagli scartati: piccoli frammenti che cadono nel cestino, poi il cestino esce
    const t0 = W('orecchio') + 0.3, bo = 1 - clamp((t - W('moderata')) / 0.4);
    if (t > t0 && bo > 0) {
      let b = E(t, t0, `<path d="M890,500 L1030,500 L1015,590 L905,590 z" fill="${C.fillD}" stroke="${C.line}" stroke-width="3.5" stroke-linejoin="round"/>` + lbl(960, 630, 'SCARTATO', { size: 24 }));
      for (let i = 0; i < 8; i++) {
        const q = eio((t - t0 - i * 0.18) / 1.0); if (q <= 0) continue;
        const sx = 540 - (i % 4) * 40, sy = Y + 40 + Math.floor(i / 4) * 140 + (i % 3) * 30, ex = 920 + (i % 4) * 26, ey = 545 + (i % 2) * 20;
        const x = lerp(sx, ex, q), yy = lerp(sy, ey, q) - Math.sin(Math.PI * q) * 90;
        b += `<rect x="${x - 9}" y="${yy - 9}" width="18" height="18" fill="${C.line}" opacity="${(0.4 + 0.6 * (1 - q)).toFixed(2)}"/>`;
      }
      s += `<g opacity="${bo.toFixed(3)}">${b}</g>`;
    }
    s += E(t, W('orecchio') + 0.9, pixGrid(1360, Y, cell, IMG_C) + lbl(1510, Y + 345, 'COMPRESSO', { size: 26 }));
    s += E(t, W('differenza') - 0.1, T(960, 560, '≈', { f: 'pop', size: 120, a: 'middle', fill: C.coral }));
    s += E(t, W('difficile') - 0.1, T(960, 660, 'differenza difficile', { f: 'serif', size: 48, a: 'middle', it: true }) + T(960, 716, 'da percepire', { f: 'serif', size: 48, a: 'middle', it: true }));
    return s + caption(t, W('perdita'), 'Con perdita', '');
  } }) });

// montagna: poligono e copertura per i blocchi JPEG
const MNT = [[0, 380], [170, 110], [300, 250], [420, 140], [600, 380]];
function inPoly(px, py, P) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) c = !c; } return c; }
const BLK = 40, BLOCKS = [];
for (let r = 0; r < 10; r++) for (let c = 0; c < 15; c++) { let n = 0; for (let a = 0; a < 6; a++) for (let b = 0; b < 6; b++) if (inPoly(c * BLK + (a + 0.5) * BLK / 6, r * BLK + (b + 0.5) * BLK / 6, [...MNT, [600, 400], [0, 400]])) n++; BLOCKS.push([r, c, n / 36]); }
const SUN = [500, 80, 40];
function photo(x, y, blocky) {
  const pts = MNT.map(([a, b]) => (x + a) + ',' + (y + b)).join(' ');
  let s = `<rect x="${x}" y="${y}" width="600" height="400" fill="${C.fillD}"/>`;
  s += `<polygon points="${pts} ${x + 600},${y + 400} ${x},${y + 400}" fill="${C.fillD2}"/>`;
  if (blocky) {
    // blocchi con leggeri salti di tono lungo tutti i bordi netti (montagna e sole); la forma resta riconoscibile
    BLOCKS.forEach(([r, c, f]) => {
      const d = Math.hypot(c * BLK + BLK / 2 - SUN[0], r * BLK + BLK / 2 - SUN[1]);
      const edge = (f > 0 && f < 1) || Math.abs(d - SUN[2]) < BLK * 0.75;
      if (!edge) return;
      const op = 0.05 + 0.1 * (((r * 5 + c * 3) % 4) / 3);
      s += `<rect x="${x + c * BLK}" y="${y + r * BLK}" width="${BLK}" height="${BLK}" fill="${C.line}" opacity="${op.toFixed(3)}" stroke="${C.lineDim}" stroke-width="1.5"/>`;
    });
    // aloni (ringing) paralleli ai bordi
    s += `<polyline points="${pts}" fill="none" stroke="${C.line}" stroke-width="18" stroke-linejoin="round" opacity="0.12"/>`;
    s += `<polyline points="${MNT.map(([a, b]) => (x + a) + ',' + (y + b - 11)).join(' ')}" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="5 6" opacity="0.5"/>`;
    s += `<circle cx="${x + SUN[0]}" cy="${y + SUN[1]}" r="${SUN[2] + 11}" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="5 6" opacity="0.5"/>`;
    s += `<circle cx="${x + SUN[0]}" cy="${y + SUN[1]}" r="${SUN[2]}" fill="none" stroke="${C.line}" stroke-width="18" opacity="0.12"/>`;
  }
  s += `<polyline points="${pts}" fill="none" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<circle cx="${x + SUN[0]}" cy="${y + SUN[1]}" r="${SUN[2]}" fill="none" stroke="${C.line}" stroke-width="4"/>`;
  return s + `<rect x="${x}" y="${y}" width="600" height="400" fill="none" stroke="${C.line}" stroke-width="4"/>`;
}
// 6 — JPEG: qualità e artefatti
scene('jpeg', { tail: 0.35, make: (W) => ({
  capAt: W('artefatti'),
  render(t) {
    const XA = 250, XB = 1070, Y = 270;
    let s = E(t, -0.4, T(960, 170, 'JPEG', { f: 'pop', size: 64, a: 'middle' }) + lbl(960, 225, 'ESEMPIO', { size: 24 }), { dy: 0 });
    if (t < W('da', 1)) s += E(t, -0.3, `<rect x="${XB}" y="${Y}" width="600" height="400" fill="none" stroke="${C.lineDim}" stroke-width="3" stroke-dasharray="10 10"/>`, { dy: 0 });
    s += E(t, -0.3, photo(XA, Y, false), { dy: 0 });
    s += E(t, W('80a90') - 0.15, "" + lbl(XA + 300, Y + 460, 'QUALITÀ 80–90 / 100', { size: 28 }));
    s += E(t, W('impercettibile') - 0.1, T(XA + 300, Y + 530, 'quasi impercettibile', { f: 'serif', size: 52, it: true, a: 'middle' }));
    s += E(t, W('da', 1) - 0.1, photo(XB, Y, true) + lbl(XB + 300, Y + 460, 'QUALITÀ 30–40 / 100', { size: 28 }));
    s += E(t, W('blocchi') - 0.1, T(XB + 300, Y + 530, 'blocchi quadrati', { f: 'serif', size: 52, it: true, a: 'middle' }));
    s += E(t, W('blocchi') - 0.1, `<circle cx="${XB + 170}" cy="${Y + 110}" r="78" fill="none" stroke="${C.coral}" stroke-width="5"/>`, { dy: 0 });
    s += E(t, W('soprattutto') - 0.1, lbl(XB + 170, Y - 14, 'BORDO NITIDO', { size: 24 }), { dy: 0 });
    return s + caption(t, W('artefatti'), 'Artefatti a blocchi', '');
  } }) });

// 7 — MP3: frequenze meno udibili eliminate
const SPEC = [...Array(24)].map((_, i) => 70 + 230 * Math.exp(-((i - 9) ** 2) / 40) + 40 * Math.sin(i * 1.7) ** 2);
SPEC[14] = 360; SPEC[15] = 90;
scene('mp3', { tail: 0.35, make: (W) => ({
  capAt: W('elimina'),
  render(t) {
    const x0 = 330, bw = 46, gap = 9, base = 720;
    let s = E(t, -0.4, T(960, 200, 'MP3', { f: 'pop', size: 64, a: 'middle' }) + lbl(1650, 200, 'ESEMPIO', { size: 24, a: 'end' }) +
      `<line x1="${x0 - 20}" y1="${base}" x2="${x0 + 24 * (bw + gap) + 10}" y2="${base}" stroke="${C.line}" stroke-width="3"/>` +
      lbl(x0, base + 50, 'BASSE', { size: 24, a: 'start' }) + lbl(x0 + 24 * (bw + gap) - gap, base + 50, 'ALTE', { size: 24, a: 'end' }) + lbl(960, base + 50, 'FREQUENZE →', { size: 24 }), { dy: 0 });
    const gone = i => (i >= 21 && t > W('alte') - 0.1) || (i === 15 && t > W('mascherati') - 0.1);
    for (let i = 0; i < 24; i++) {
      const h = SPEC[i], x = x0 + i * (bw + gap);
      const gt = i >= 21 ? W('alte') - 0.1 : W('mascherati') - 0.1, q = gone(i) ? eo((t - gt) / 0.5) : 0;
      const bar = q < 1 ? `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" fill="${C.fillD2}" stroke="${C.line}" stroke-width="3" opacity="${(1 - q).toFixed(3)}"/>` : '';
      const ghost = q > 0 ? `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" fill="none" stroke="${C.lineDim}" stroke-width="2.5" stroke-dasharray="7 7" opacity="${q.toFixed(3)}"/>` : '';
      s += E(t, -0.3 + i * 0.03, bar + ghost, { dy: 10, d: 0.35 });
    }
    const xH = x0 + 21 * (bw + gap), xL = x0;
    s += E(t, W('alte') - 0.05, lbl(xH + (3 * (bw + gap) - gap) / 2, base - Math.max(SPEC[21], SPEC[22], SPEC[23]) - 30, 'MOLTO ALTE', { size: 24 }));
    const xm = x0 + 15 * (bw + gap) + bw / 2, xf = x0 + 14 * (bw + gap) + bw / 2;
    s += E(t, W('mascherati') - 0.05, arrow(xm + 120, 470, xm + 10, base - 110, C.coral, 4, 18) + T(xm + 30, 450, 'MASCHERATO', { f: 'mono', size: 28, fill: C.coral, ls: 3, w: 700 }));
    s += E(t, W('mascherati') + 0.1, T(xf, base - SPEC[14] - 24, 'PIÙ FORTE', { f: 'mono', size: 24, a: 'middle', ls: 3, w: 600 }));
    return s + caption(t, W('elimina'), 'Frequenze eliminate', '');
  } }) });

// 8 — video: solo le differenze fra frame
function frameScene(x, y, w, h, ballX, o = {}) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.empty ? 'none' : C.fillD}" stroke="${C.line}" stroke-width="3.5"${o.empty ? ' stroke-dasharray="8 8"' : ''}/>`;
  if (o.bgOp > 0) s += `<g opacity="${o.bgOp.toFixed(3)}"><line x1="${x}" y1="${y + h * 0.78}" x2="${x + w}" y2="${y + h * 0.78}" stroke="${C.line}" stroke-width="3"/>` +
    `<path d="M${x + w * 0.62},${y + h * 0.78} L${x + w * 0.62},${y + h * 0.48} L${x + w * 0.74},${y + h * 0.34} L${x + w * 0.86},${y + h * 0.48} L${x + w * 0.86},${y + h * 0.78}" fill="none" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>` +
    `<circle cx="${x + w * 0.2}" cy="${y + h * 0.42}" r="${h * 0.14}" fill="none" stroke="${C.line}" stroke-width="3"/><line x1="${x + w * 0.2}" y1="${y + h * 0.56}" x2="${x + w * 0.2}" y2="${y + h * 0.78}" stroke="${C.line}" stroke-width="3"/></g>`;
  s += `<circle cx="${x + ballX * w}" cy="${y + h * 0.68}" r="${h * 0.09}" fill="${C.line}"/>`;
  return s;
}
scene('video', { tail: 0.6, make: (W) => ({
  capAt: W('differenze'),
  render(t) {
    const fw = 340, fh = 220, gap = 40, x0 = 960 - (4 * fw + 3 * gap) / 2, y = 360, BX = [0.36, 0.44, 0.52, 0.6];
    const strip = eo((t - W('memorizzano') + 0.1) / 0.7);
    let s = '';
    for (let i = 0; i < 4; i++) {
      const x = x0 + i * (fw + gap);
      s += E(t, -0.4 + i * 0.12, frameScene(x, y, fw, fh, BX[i], { bgOp: i === 0 ? 1 : 1 - strip, empty: i > 0 && strip > 0.5 }) + lbl(x + fw / 2, y - 24, 'FRAME ' + (i + 1), { size: 24 }), { dy: 0 });
      if (i > 0) {
        const px = x + BX[i - 1] * fw - fh * 0.13, pw = (BX[i] - BX[i - 1]) * fw + fh * 0.26, py = y + fh * 0.68 - fh * 0.13, ph = fh * 0.26;
        s += E(t, W('piccole') - 0.1, `<rect x="${px - 6}" y="${py - 6}" width="${pw + 12}" height="${ph + 12}" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="6 6"/>`, { dy: 0 });
      }
    }
    if (t < W('memorizzano') - 0.1) s += E(t, W('piccole') + 0.3, lbl(960, y + fh + 60, 'CAMBIA SOLO UNA PICCOLA AREA', { size: 26 }), { dy: 0 });
    s += E(t, W('memorizzano') + 0.2, lbl(x0 + fw / 2, y + fh + 60, 'COMPLETO', { size: 26 }) + lbl(x0 + 2 * (fw + gap) + fw / 2, y + fh + 60, 'SOLO LE DIFFERENZE', { size: 26 }) +
      `<path d="M${x0 + fw + gap},${y + fh + 22} L${x0 + fw + gap},${y + fh + 28} L${x0 + 4 * fw + 3 * gap},${y + fh + 28} L${x0 + 4 * fw + 3 * gap},${y + fh + 22}" fill="none" stroke="${C.line}" stroke-width="3"/>`, { dy: 0 });
    s += E(t, W('invece') - 0.1, T(960, 220, 'invece di ogni frame completo…', { f: 'serif', size: 56, it: true, a: 'middle' }));
    return s + caption(t, W('differenze'), 'Solo differenze', 'differenze');
  } }) });

// 9 — dimensioni: 5.000 foto
scene('dimensioni', { tail: 0.35, make: (W) => ({
  capAt: W('dimensioni'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, ink = C.ink, X0 = 470, PX = 7.6;
    let g = E(t, -0.4, card(160, 160, 1600, 650, { rot: 0.6 }), { dy: 0 });
    g += E(t, -0.2, T(960, 270, 'Perché non sempre lossless?', { f: 'pop', size: 56, fill: ink, a: 'middle' }));
    g += E(t, W('dimensioni') + 0.1, `<rect x="${X0}" y="420" width="${150 * PX}" height="70" fill="none" stroke="${mix(C.ivory, ink, 0.35)}" stroke-width="2" stroke-dasharray="4 8"/><rect x="${X0}" y="590" width="${150 * PX}" height="70" fill="none" stroke="${mix(C.ivory, ink, 0.35)}" stroke-width="2" stroke-dasharray="4 8"/>` +
      T(250, 470, 'JPEG', { f: 'pop', size: 48, fill: ink }) + T(250, 640, 'RAW', { f: 'pop', size: 48, fill: ink }));
    g += E(t, W('dimensioni') - 0.1, T(250, 360, '5.000 FOTO', { f: 'mono', size: 30, fill: ink, ls: 4, w: 700 }));
    const pJ = eo((t - W('jpeg')) / 0.6), pR = eo((t - W('raw')) / 0.7), pR2 = eo((t - W('75a150') - 0.5) / 0.6);
    if (pJ > 0) g += `<rect x="${X0}" y="420" width="${15 * PX * pJ}" height="70" fill="${mix(C.ivory, ink, 0.3)}" stroke="${ink}" stroke-width="3.5"/>`;
    g += E(t, W('15') - 0.05, T(X0 + 15 * PX + 30, 474, '≈ 15 GB', { f: 'pop', size: 48, fill: ink }));
    g += E(t, W('grezzi') - 0.1, T(250, 700, 'DATI GREZZI', { f: 'mono', size: 24, fill: ink, ls: 2, w: 700 }) + T(250, 732, 'DELLA FOTOCAMERA', { f: 'mono', size: 24, fill: ink, ls: 2, w: 700 }));
    if (pR > 0) g += `<rect x="${X0}" y="590" width="${75 * PX * pR}" height="70" fill="${mix(C.ivory, ink, 0.3)}" stroke="${ink}" stroke-width="3.5"/>`;
    if (pR2 > 0) g += `<rect x="${X0 + 75 * PX}" y="590" width="${75 * PX * pR2}" height="70" fill="none" stroke="${ink}" stroke-width="3.5" stroke-dasharray="12 9"/>`;
    g += E(t, W('75a150') - 0.05, `<path d="M${X0 + 75 * PX},700 L${X0 + 75 * PX},716 L${X0 + 150 * PX},716 L${X0 + 150 * PX},700" fill="none" stroke="${C.coral}" stroke-width="4"/>` + T(X0 + 112.5 * PX, 768, '75–150 GB', { f: 'pop', size: 48, fill: C.coral, a: 'middle' }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('dimensioni'), 'Questione di dimensioni', '', true);
  } }) });

function globe(x, y, ink) {
  return `<circle cx="${x}" cy="${y}" r="70" fill="${C.fillD}" stroke="${ink}" stroke-width="4"/><ellipse cx="${x}" cy="${y}" rx="30" ry="70" fill="none" stroke="${ink}" stroke-width="3"/>` +
    `<line x1="${x - 70}" y1="${y}" x2="${x + 70}" y2="${y}" stroke="${ink}" stroke-width="3"/><path d="M${x - 60},${y - 35} Q${x},${y - 22} ${x + 60},${y - 35} M${x - 60},${y + 35} Q${x},${y + 22} ${x + 60},${y + 35}" fill="none" stroke="${ink}" stroke-width="3"/>`;
}
function archive(x, y, ink) {
  return `<rect x="${x - 90}" y="${y - 70}" width="180" height="40" rx="6" fill="${C.fillD}" stroke="${ink}" stroke-width="4"/><rect x="${x - 78}" y="${y - 30}" width="156" height="100" fill="${C.fillD}" stroke="${ink}" stroke-width="4"/>` +
    `<rect x="${x - 30}" y="${y - 10}" width="60" height="18" rx="6" fill="none" stroke="${ink}" stroke-width="3"/>`;
}
// 10 — il giusto compromesso
scene('compromesso', { tail: 0.8, make: (W) => ({
  capAt: W('compromesso'),
  render(t) {
    const XL = 560, XR = 1360;
    let s = E(t, -0.4, globe(XL, 340, C.line) + lbl(XL, 470, 'PUBBLICARE ONLINE', { size: 26 }), { dy: 0 });
    s += E(t, W('lossy') - 0.1, arrow(XL, 500, XL, 570, C.line, 4, 18) + pillTag(XL, 640, 'LOSSY MODERATA', C.line, C.bg, { a: 'middle', size: 34, w: 700 }));
    s += E(t, W("l'archivio") - 0.1, archive(XR, 340, C.line) + lbl(XR, 470, 'ARCHIVIO PROFESSIONALE', { size: 26 }));
    s += E(t, W('fotoritocco') - 0.1, lbl(XR, 506, 'O FOTORITOCCO', { size: 26 }));
    s += E(t, W('lossless') - 0.1, arrow(XR, 530, XR, 570, C.line, 4, 18) + pillTag(XR, 640, 'LOSSLESS', C.line, C.bg, { a: 'middle', size: 34, w: 700 }));
    s += E(t, W('lossy') + 0.3, `<line x1="960" y1="290" x2="960" y2="700" stroke="${C.lineDim}" stroke-width="2.5" stroke-dasharray="4 10" stroke-linecap="round"/>`, { dy: 0 });
    return s + caption(t, W('compromesso'), 'Il giusto compromesso', 'compromesso');
  } }) });

// 11 — chiusura
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 440, 'Compressione', { f: 'pop', size: 150, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('lossless') - 0.1, 960, 570, "lossless o lossy: dipende dall'uso", { f: 'serif', size: 72, fill: C.ink, a: 'middle', it: true, key: "dall'uso" });
    s += E(t, W("dall'uso") + 0.4, `<line x1="760" y1="650" x2="1160" y2="650" stroke="${C.ink}" stroke-width="3"/>` + T(960, 710, 'PROFTECNOLOGIA · MC COM-3-02', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
    return s;
  } }) });

// ---- timeline ----
let acc = 0; const TL = SCENES.map(s => { const o = { id: s.id, start: acc, D: s.D, L: s.L, voce: s.sc.voce_dur }; acc += s.D; return o; });
window.TIMELINE = { total: acc, scenes: TL };
window.render = function (T0) {
  let i = TL.findIndex(x => T0 < x.start + x.D); if (i < 0) i = TL.length - 1;
  const S = SCENES[i], t = T0 - TL[i].start;
  let body = S.light ? '' : `<rect width="1920" height="1080" fill="${C.bg}"/>`;
  let inner = S.render(t, S.D);
  if (!S.light) inner = `<g transform="translate(960,540) scale(${1 + 0.025 * t / S.D}) translate(-960,-540)">${inner}</g>`;
  body += inner;
  if (S.id !== 'finale') body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
