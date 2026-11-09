// Dal modello 3D alla stampa 3D — MC-DIS-3-02 §"Dal modello 3D alla stampa 3D: il percorso del file". render(t) puro.
const SCENES = [];
const norm = s => s.toLowerCase().replace(/[^\p{L}\d']/gu, '');
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => norm(p[0]) === norm(w)); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.2);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.hold != null) D = Math.max(D, def.hold + 1.55);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const BIG = (x, y, s, o = {}) => T(x, y, s, { f: 'pop', size: o.size || 110, fill: o.fill || C.line, a: o.a || 'start' });
const R = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 0}" fill="${o.fill || 'none'}" stroke="${o.st || C.line}" stroke-width="${o.sw ?? 4}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
const Ln = (x1, y1, x2, y2, c, sw = 3, ex = '') => `<line x1="${x1.toFixed ? x1.toFixed(1) : x1}" y1="${y1.toFixed ? y1.toFixed(1) : y1}" x2="${x2.toFixed ? x2.toFixed(1) : x2}" y2="${y2.toFixed ? y2.toFixed(1) : y2}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" ${ex}/>`;
const DIM = mix(C.bg, C.line, 0.16), DIM2 = mix(C.bg, C.line, 0.5);

// ---- mondo: stampante 3D generica a filo ----
function printer(x, y, ink = C.line, o = {}) { // x,y = angolo in alto a sinistra; 480 x 540
  const nx = x + (o.nx ?? 240);
  let s = R(x, y, 480, 28, { rx: 6, st: ink, fill: C.bg }) + R(x + 20, y + 28, 24, 470, { st: ink, fill: C.bg }) + R(x + 436, y + 28, 24, 470, { st: ink, fill: C.bg });
  s += R(x, y + 498, 480, 42, { rx: 6, st: ink, fill: C.bg });
  s += R(x + 44, y + 150, 392, 16, { st: ink, fill: C.bg, sw: 3 }); // asse X
  s += R(nx - 44, y + 128, 88, 64, { rx: 8, st: ink, fill: C.bg }) + `<path d="M${nx - 18},${y + 192} L${nx + 18},${y + 192} L${nx},${y + 226} z" fill="${C.bg}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  s += R(x + 110, y + 430, 260, 18, { st: ink, fill: C.bg }) + R(x + 225, y + 448, 30, 50, { st: ink, fill: C.bg, sw: 3 });
  // bobina di filamento sul lato
  s += `<circle cx="${x + 240}" cy="${y - 62}" r="0" fill="none"/>`;
  return s;
}
function fileIcon(x, y, ink = C.line) { // 240 x 300
  let s = `<path d="M${x},${y} L${x + 180},${y} L${x + 240},${y + 60} L${x + 240},${y + 300} L${x},${y + 300} z" fill="${C.bg}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M${x + 180},${y} L${x + 180},${y + 60} L${x + 240},${y + 60}" fill="none" stroke="${ink}" stroke-width="3"/>`;
  // mesh a triangoli di un cilindro (wireframe)
  const cx = x + 120, top = y + 70, bot = y + 190, rx = 70, ry = 20;
  s += `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="none" stroke="${ink}" stroke-width="2.5"/><path d="M${cx - rx},${bot} A${rx},${ry} 0 0 0 ${cx + rx},${bot}" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
  for (let i = 0; i <= 6; i++) { const a = Math.PI - i * Math.PI / 6, px = cx + rx * Math.cos(a), py1 = top + ry * Math.sin(a), py2 = bot + ry * Math.sin(a);
    s += Ln(px, py1, px, py2, ink, 2); if (i < 6) { const a2 = Math.PI - (i + 1) * Math.PI / 6; s += Ln(px, py2, cx + rx * Math.cos(a2), top + ry * Math.sin(a2), ink, 1.5, 'opacity="0.7"'); } }
  s += T(x + 120, y + 272, 'STL', { f: 'pop', size: 62, fill: ink, a: 'middle' });
  return s;
}

// 1 — aggancio: il file STL non basta
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('primo'), hold: W('slicer'),
  render(t) {
    let s = '';
    s += E(t, -0.3, fileIcon(170, 340) + lbl(290, 690, 'FILE DEL MODELLO'), { dy: 0 });
    s += E(t, W('primo') - 0.1, pillTag(290, 300, 'PASSO 1', C.line, C.bg, 'middle'));
    s += E(t, W('stampare') - 0.1, printer(1290, 290) + lbl(1530, 880 - 30, 'STAMPANTE 3D'));
    const a1 = eo((t - W('passa')) / 0.5);
    if (a1 > 0) s += arrow(440, 490, 440 + 220 * a1, 490, C.line, 5);
    s += E(t, W('passa'), R(700, 410, 380, 160, { rx: 22, st: C.line, sw: 3, dash: '10 12', fill: C.bg }), { dy: 0, d: 0.3 });
    s += E(t, W('slicer') - 0.05, R(700, 410, 380, 160, { rx: 22, st: C.coral, sw: 5, fill: C.bg }) +
      [0, 1, 2].map(i => Ln(740, 468 + i * 22, 790, 468 + i * 22, C.line, 4)).join('') +
      T(930, 512, 'SLICER', { f: 'mono', size: 44, fill: C.line, a: 'middle', w: 700, ls: 4 }), { dy: 10 });
    const a2 = eo((t - W('slicer') - 0.3) / 0.5);
    if (a2 > 0) s += arrow(1100, 490, 1100 + 170 * a2, 490, C.line, 5);
    s += E(t, W('slicer') + 0.5, lbl(1185, 462, 'G-CODE', { size: 24 }));
    s += E(t, W('passa') - 0.1, lbl(570, 462, 'STL', { size: 24 }));
    return s + caption(t, W('primo'), 'Solo il primo passo', '');
  } }) });

// ---- porta-matite in sezione verticale (scala 6 px/mm, misure del paragrafo precedente) ----
const PM = { cx: 700, base: 800, k: 6 };
function holderShape() { // porta-matite visto di fianco: tubo + base (schema)
  const k = PM.k, cx = PM.cx, b = PM.base, h = 85 * k, ro = 32 * k, rt = 30 * k, fb = 5 * k;
  return `M${cx - ro},${b} L${cx + ro},${b} L${cx + ro},${b - fb} L${cx + rt},${b - fb} L${cx + rt},${b - h} L${cx - rt},${b - h} L${cx - rt},${b - fb} L${cx - ro},${b - fb} z`;
}
// 2 — lo slicer affetta
scene('affetta', { make: (W) => ({
  capAt: W('centinaia'),
  render(t) {
    const top = PM.base - 85 * PM.k, sweep = eio((t - W('taglia')) / 2.3), ky = top - 8 + (PM.base - top + 8) * sweep;
    let s = `<clipPath id="pmclip"><path d="${holderShape()}"/></clipPath>`;
    s += E(t, -0.3, `<path d="${holderShape()}" fill="${DIM}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>` + lbl(PM.cx, top - 50, 'MODELLO SOLIDO'), { dy: 0 });
    let lines = '';
    for (let y = PM.base - 8; y > top; y -= 8) if (y > ky - 2 && sweep > 0) lines += Ln(PM.cx - 200, y, PM.cx + 200, y, C.line, 2);
    // gli strati compaiono dove la lama e' passata (dall'alto in basso)
    lines = '';
    for (let y = top + 8; y < PM.base; y += 8) if (y < ky) lines += Ln(PM.cx - 200, y, PM.cx + 200, y, C.bg, 2.5);
    s += `<g clip-path="url(#pmclip)">${lines}</g>`;
    if (t > W('taglia') - 0.2 && sweep < 1) s += Ln(PM.cx - 290, ky, PM.cx + 290, ky, C.coral, 5);
    s += E(t, W('affettatore') - 0.1, IT(1120, 330, 'slicer = affettatore', { size: 64 }));
    s += E(t, W('centinaia') - 0.1, `<path d="M${PM.cx + 230},${top} L${PM.cx + 250},${top} L${PM.cx + 250},${PM.base} L${PM.cx + 230},${PM.base}" fill="none" stroke="${C.line}" stroke-width="3"/>` +
      lbl(1120, 520, 'STRATI ORIZZONTALI', { a: 'start' }) + IT(1120, 590, 'centinaia o migliaia', { size: 52 }));
    s += E(t, W('strati') - 0.1, IT(1120, 650, 'strati sottili (layer)', { size: 52 }));
    s += E(t, W('centinaia'), lbl(1120, 780, 'SCHEMA, NON IN SCALA', { a: 'start', size: 24 }));
    return s + caption(t, W('centinaia'), 'Centinaia di strati sottili', '');
  } }) });

// 3 — G-code: il percorso della testina su uno strato
scene('gcode', { make: (W) => ({
  capAt: W('istruzioni'),
  render(t) {
    const cx = 620, cy = 500, ro = 30 * 6, ri = 27 * 6;
    let s = E(t, -0.3, `<circle cx="${cx}" cy="${cy}" r="${ro}" fill="none" stroke="${C.line}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${ri}" fill="none" stroke="${C.line}" stroke-width="3"/>` +
      lbl(cx, 260, 'UNO STRATO · VISTA DALL\'ALTO'), { dy: 0 });
    // percorso della testina: giro sulla parete (raggio medio)
    const rm = (ro + ri) / 2, p = clamp((t - W('movimento') + 0.2) / 2.6);
    if (p > 0) {
      const a1 = -Math.PI / 2 + p * 2 * Math.PI, n = Math.max(2, Math.ceil(p * 120)); let d = '';
      for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (a1 + Math.PI / 2) * i / n; d += (i ? 'L' : 'M') + (cx + rm * Math.cos(a)).toFixed(1) + ',' + (cy + rm * Math.sin(a)).toFixed(1); }
      s += `<path d="${d}" fill="none" stroke="${C.coral}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
      const hx = cx + rm * Math.cos(a1), hy = cy + rm * Math.sin(a1);
      s += `<circle cx="${hx}" cy="${hy}" r="26" fill="none" stroke="${C.line}" stroke-width="4"/>` + Ln(hx - 38, hy, hx + 38, hy, C.line, 3) + Ln(hx, hy - 38, hx, hy + 38, C.line, 3);
    }
    s += E(t, W('testina') - 0.1, lbl(cx, 760, 'PERCORSO DELLA TESTINA'));
    // listato di esempio
    const L0 = ['G1 X0 Y30', '…', 'G1 X21 Y21', '…', 'G1 X30 Y0', '…'];
    s += E(t, W('istruzioni') - 0.1, R(1040, 250, 600, 470, { rx: 18, st: C.line, sw: 3, fill: C.bg }) + lbl(1080, 310, 'ISTRUZIONI · ESEMPIO RIDOTTO', { a: 'start', size: 24 }), { dy: 0 });
    L0.forEach((l, i) => { s += E(t, W('istruzioni') + 0.15 + i * 0.22, T(1080, 385 + i * 56, l, { f: 'mono', size: 34, fill: C.line, w: 500 }), { dy: 8 }); });
    s += E(t, W('g-code') - 0.1, pillTag(1340, 800, 'FILE G-CODE', C.line, C.bg, 'middle'));
    return s + caption(t, W('istruzioni'), 'Istruzioni per la testina', '');
  } }) });

// ---- profilo a gradini: quarto di cupola stampato a strati di altezza h ----
function steps(x0, yb, Rr, h, ink, o = {}) { // x0 = asse, yb = base; profilo verso destra
  const n = Math.ceil(Rr / h - 1e-6); let d = `M${x0},${yb}`;
  for (let i = 0; i < n; i++) { const y0 = i * h, y1 = Math.min(Rr, (i + 1) * h), w = Math.sqrt(Math.max(0, Rr * Rr - y0 * y0));
    d += ` L${(x0 + w).toFixed(1)},${(yb - y0).toFixed(1)} L${(x0 + w).toFixed(1)},${(yb - y1).toFixed(1)}`; }
  d += ` L${x0},${yb - Rr} z`;
  let s = `<path d="${d}" fill="${o.fill || mix(C.cream, C.ink, 0.12)}" stroke="${ink}" stroke-width="${o.sw || 3}" stroke-linejoin="miter"/>`;
  for (let i = 1; i < n; i++) { const y = yb - i * h, w = Math.sqrt(Math.max(0, Rr * Rr - (i * h) ** 2)); s += Ln(x0, y, x0 + Math.sqrt(Math.max(0, Rr * Rr - ((i - 1) * h) ** 2)) * 0 + w, y, ink, 1.5, 'opacity="0.55"'); }
  return s;
}
function ideal(x0, yb, Rr, c, sw = 4) { return `<path d="M${x0 + Rr},${yb} A${Rr},${Rr} 0 0 0 ${x0},${yb - Rr}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-dasharray="12 10"/>`; }

// 4 — altezza del layer: 0,1 mm
scene('layer', { make: (W) => ({
  capAt: W('liscio'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(240, 160, 1440, 680, { rot: -0.6 }), { dy: 0 });
    g += E(t, -0.2, lbl(300, 230, 'ALTEZZA DEL LAYER = SPESSORE DI UNO STRATO', { a: 'start', fill: C.ink }));
    const x0 = 380, yb = 760, Rr = 440;
    g += E(t, 0.3, steps(x0, yb, Rr, 20, C.ink) + Ln(x0 - 40, yb, x0 + Rr + 60, yb, C.ink, 4));
    g += E(t, W('0,1 mm') + 0.3, ideal(x0, yb, Rr, C.coral) + lbl(760, 470, 'FORMA DEL MODELLO', { a: 'start', fill: C.ink, size: 24 }));
    g += E(t, W('strato') - 0.2, lbl(1100, 400, 'PROFILO INGRANDITO', { a: 'start', fill: C.ink, size: 24 }));
    g += E(t, W('0,1 mm'), BIG(1100, 520, '0,1 mm', { fill: C.ink, size: 120 }));
    g += E(t, W('liscio') - 0.1, IT(1100, 610, 'molto liscio', { fill: C.ink, size: 56 }));
    g += E(t, W('tempo') - 0.25, IT(1100, 690, 'ma molto più tempo', { fill: C.ink, size: 56 }));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('liscio'), 'Liscio, ma più tempo', '', true);
  } }) });

// 5 — 0,3 / 0,2: confronto
scene('layer2', { make: (W) => ({
  capAt: W('0,2 mm'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(160, 150, 1600, 700, { rot: 0.5 }), { dy: 0 });
    const u = 216 / 22; const P = [{ x: 260, h: u, l: '0,1 mm', it: 'liscio, lento', at: -0.3 }, { x: 800, h: 2 * u, l: '0,2 mm', it: 'buon compromesso', at: W('0,2 mm') - 0.1 }, { x: 1340, h: 3 * u, l: '0,3 mm', it: 'veloce, rigature', at: W('0,3 mm') - 0.1 }];
    const yb = 640, Rr = 216;
    P.forEach(p => {
      g += E(t, p.at, steps(p.x + 40, yb, Rr, p.h, C.ink) + Ln(p.x, yb, p.x + 330, yb, C.ink, 4) + ideal(p.x + 40, yb, Rr, C.ink, 3) +
        BIG(p.x + 40, yb + 90, p.l, { fill: C.ink, size: 64 }));
    });
    g += E(t, -0.2, IT(300, yb + 160, 'liscio, lento', { fill: C.ink, size: 44 }));
    g += E(t, W('rigature') - 0.2, IT(1380, yb + 160, 'veloce, rigature', { fill: C.ink, size: 44 }));
    g += E(t, W('compromesso') - 0.2, IT(840, yb + 160, 'il compromesso', { fill: C.ink, size: 44 }));
    g += E(t, W('funzionali') - 0.1, lbl(960, 230, 'PER OGGETTI FUNZIONALI', { fill: C.ink }));
    g += E(t, W('0,2 mm'), R(770, 300, 390, 600 - 20, { rx: 18, st: C.coral, sw: 6 }), { dy: 0 });
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('0,2 mm'), '0,2 mm: il compromesso', '', true);
  } }) });

// ---- sezione orizzontale di un pezzo con pareti e riempimento ----
function part(cx, cy, S, ink, inner) {
  const wall = 22, x = cx - S / 2, y = cy - S / 2;
  return `<clipPath id="in${cx}"><rect x="${x + wall}" y="${y + wall}" width="${S - 2 * wall}" height="${S - 2 * wall}"/></clipPath>` +
    `<rect x="${x}" y="${y}" width="${S}" height="${S}" rx="10" fill="${mix(C.bg, ink, 0.55)}" stroke="${ink}" stroke-width="4"/>` +
    `<rect x="${x + wall}" y="${y + wall}" width="${S - 2 * wall}" height="${S - 2 * wall}" fill="${C.bg}" stroke="${ink}" stroke-width="2"/>` +
    `<g clip-path="url(#in${cx})">${inner}</g>`;
}
// griglia con frazione di area f: 2w/s - (w/s)^2 = f
function grid(cx, cy, S, f, ink) { const w = 7, r = 1 - Math.sqrt(1 - f), sp = w / r; let s = '';
  for (let v = -S; v <= S; v += sp) { s += `<rect x="${(cx + v - w / 2).toFixed(1)}" y="${cy - S}" width="${w}" height="${2 * S}" fill="${mix(C.bg, ink, 0.55)}"/><rect x="${cx - S}" y="${(cy + v - w / 2).toFixed(1)}" width="${2 * S}" height="${w}" fill="${mix(C.bg, ink, 0.55)}"/>`; }
  return s; }
// nido d'ape: lato a, parete w -> frazione circa 2w/(sqrt3 a)
function hexes(cx, cy, S, f, ink) { const w = 6, a = 2 * w / (Math.sqrt(3) * f), dx = Math.sqrt(3) * a, dy = 1.5 * a; let d = '';
  for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) { const hx = cx + i * dx + (j % 2 ? dx / 2 : 0), hy = cy + j * dy;
    d += 'M' + [0, 1, 2, 3, 4, 5].map(q => { const an = Math.PI / 6 + q * Math.PI / 3; return (hx + a * Math.cos(an)).toFixed(1) + ',' + (hy + a * Math.sin(an)).toFixed(1); }).join('L') + 'z'; }
  return `<path d="${d}" fill="none" stroke="${mix(C.bg, ink, 0.55)}" stroke-width="${w}"/>`; }

// 6 — infill 100%
scene('infill', { make: (W) => ({
  capAt: W('100%'),
  render(t) {
    const cx = 640, cy = 480, S = 440;
    const fp = eio((t - W('riempita') + 0.1) / 0.8) * 0 + (t > W('100%') - 0.1 ? 1 : 0);
    let s = E(t, -0.3, part(cx, cy, S, C.line, fp > 0 ? `<rect x="${cx - S}" y="${cy - S}" width="${2 * S}" height="${2 * S}" fill="${mix(C.bg, C.line, 0.55)}" opacity="${eo((t - W('100%') + 0.1) / 0.4)}"/>` : '') +
      lbl(cx, cy - S / 2 - 30, 'SEZIONE DI UN PEZZO'), { dy: 0 });
    s += E(t, W('volume') - 0.1, lbl(cx, cy + S / 2 + 50, 'PARETI + VOLUME INTERNO'));
    s += E(t, W('percentuale') - 0.1, lbl(1060, 300, 'INFILL = % DI VOLUME INTERNO RIEMPITA', { a: 'start', size: 24 }));
    s += E(t, W('100%') - 0.05, BIG(1060, 470, '100%', { fill: C.coral, size: 150 }));
    s += E(t, W('solido') - 0.1, IT(1065, 560, 'solido', { size: 56 }));
    s += E(t, W('pesante') - 0.1, IT(1065, 630, 'pesante', { size: 56 }));
    s += E(t, W('materiale') - 0.15, IT(1065, 700, 'molto materiale', { size: 56 }));
    return s + caption(t, W('100%'), '100%: solido, pesante', '');
  } }) });

// 7 — infill 20%: griglia e nido d'ape
scene('infill2', { make: (W) => ({
  capAt: W('leggero'), hold: W('nido'),
  render(t) {
    const S = 380, y = 470;
    let s = E(t, -0.3, part(470, y, S, C.line, grid(470, y, S, 0.2, C.line)), { dy: 0 });
    s += E(t, W('griglia') - 0.1, lbl(470, y + S / 2 + 50, 'GRIGLIA'));
    s += E(t, W('griglia') + 0.3, part(1010, y, S, C.line, hexes(1010, y, S, 0.2, C.line)) + lbl(1010, y + S / 2 + 50, "NIDO D'APE"));
    s += E(t, -0.1, BIG(1290, 380, '20%', { fill: C.coral, size: 130 }));
    s += E(t, -0.1, lbl(1295, 430, 'INFILL', { a: 'start', size: 26 }));
    s += E(t, W('leggero') - 0.15, IT(1295, 510, 'molto più leggero', { size: 50 }));
    s += E(t, W('resistenza') - 0.2, IT(1295, 580, 'buona resistenza', { size: 50 }));
    return s + caption(t, W('leggero'), '20%: molto più leggero', '');
  } }) });

// 8 — porta-matite: 15-20%
function pencilCup(cx, yb, ink) {
  const w = 300, h = 400, ry = 34; let s = '';
  s += `<path d="M${cx - 160},${yb} L${cx - 160},${yb + 26} A160,36 0 0 0 ${cx + 160},${yb + 26} L${cx + 160},${yb} A160,36 0 0 0 ${cx - 160},${yb} z" fill="${C.cream}" stroke="${ink}" stroke-width="4"/>`;
  // matite: visibili solo sopra la bocca del bicchiere
  s += `<clipPath id="pcclip"><rect x="${cx - w / 2 + 12}" y="0" width="${w - 24}" height="${yb - h + 10}"/></clipPath><g clip-path="url(#pcclip)">`;
  [[-80, -560, -8], [10, -600, 3], [90, -540, 10]].forEach(([dx, top, rot]) => {
    s += `<g transform="rotate(${rot} ${cx + dx} ${yb - 100})"><rect x="${cx + dx - 18}" y="${yb + top + 40}" width="36" height="${-top}" fill="${C.cream}" stroke="${ink}" stroke-width="3"/>` +
      `<path d="M${cx + dx - 18},${yb + top + 40} L${cx + dx},${yb + top} L${cx + dx + 18},${yb + top + 40} z" fill="${C.cream}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/></g>`; });
  s += '</g>';
  s += `<path d="M${cx - w / 2},${yb - h} L${cx - w / 2},${yb} A${w / 2},${ry} 0 0 0 ${cx + w / 2},${yb} L${cx + w / 2},${yb - h}" fill="${C.cream}" stroke="${ink}" stroke-width="4"/>`;
  s += `<ellipse cx="${cx}" cy="${yb - h}" rx="${w / 2}" ry="${ry}" fill="none" stroke="${ink}" stroke-width="4"/>`;
  for (let i = 1; i < 9; i++) s += `<path d="M${cx - w / 2},${yb - h + i * 44} A${w / 2},${ry} 0 0 0 ${cx + w / 2},${yb - h + i * 44}" fill="none" stroke="${ink}" stroke-width="1.5" opacity="0.4"/>`;
  return s;
}
scene('matite', { make: (W) => ({
  capAt: W('basta') - 0.4,
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(300, 150, 1320, 700, { rot: -0.8 }), { dy: 0 });
    g += E(t, -0.2, pencilCup(640, 770, C.ink));
    g += E(t, W('carichi') - 0.2, IT(920, 380, 'senza carichi pesanti', { fill: C.ink, size: 56 }));
    g += E(t, W('basta') - 0.1, lbl(925, 480, 'BASTA UN INFILL DEL', { a: 'start', fill: C.ink }));
    g += E(t, W('15-20%') - 0.05, BIG(920, 620, '15-20%', { fill: C.coralT, size: 140 }));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('basta') - 0.4, 'Porta-matite: 15-20%', '', true);
  } }) });

// ---- pezzo a "T" rovesciata di lato: colonna + braccio a sbalzo ----
const OV = { bed: 790, x0: 520, x1: 660, arm: 1180, ay: 440, at: 70, lh: 14 };
function bed(ink = C.line) { return R(300, OV.bed, 1100, 26, { rx: 4, st: ink, fill: C.bg }) + lbl(850, OV.bed + 70, 'PIANO DI STAMPA'); }
function column(ink, upto) { // colonna stampata fino a quota upto (y)
  let s = `<rect x="${OV.x0}" y="${upto}" width="${OV.x1 - OV.x0}" height="${OV.bed - upto}" fill="${DIM}" stroke="${ink}" stroke-width="4"/>`;
  for (let y = OV.bed - OV.lh; y > upto; y -= OV.lh) s += Ln(OV.x0, y, OV.x1, y, ink, 1.5, 'opacity="0.5"');
  return s;
}
function nozzle(x, y, ink = C.line) { return R(x - 40, y - 120, 80, 70, { rx: 8, st: ink, fill: C.bg }) + `<path d="M${x - 16},${y - 50} L${x + 16},${y - 50} L${x},${y} z" fill="${C.bg}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`; }
// 9 — overhang
scene('overhang', { make: (W) => ({
  capAt: W('overhang'),
  render(t) {
    let s = E(t, -0.3, bed() + column(C.line, OV.ay + OV.at) + R(OV.x0, OV.ay, OV.arm - OV.x0, OV.at, { st: C.line, sw: 3, dash: '12 10' }) +
      lbl(OV.x0 + 70, OV.ay - 30, 'DA STAMPARE'), { dy: 0 });
    // zona vuota sotto il braccio
    s += E(t, W('niente') - 0.1, `<rect x="${OV.x1 + 6}" y="${OV.ay + OV.at + 6}" width="${OV.arm - OV.x1 - 12}" height="${OV.bed - OV.ay - OV.at - 12}" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="4 10" opacity="0.8"/>` +
      IT(820, 660, 'niente sotto', { size: 52, a: 'middle' }));
    s += E(t, W('overhang') - 0.1, arrow(1300, 390, OV.arm - 30, OV.ay + OV.at - 6, C.line, 4) + lbl(1300, 360, 'OVERHANG', { size: 30 }));
    // la testina prova a depositare in aria: il filo cade
    const nx = 1000, ny = OV.ay + OV.at - 4, dr = eo((t - W('filamento')) / 1.0);
    s += E(t, W('filamento') - 0.4, nozzle(nx, ny));
    if (dr > 0) s += `<path d="M${nx},${ny} C${nx + 8},${ny + 80 * dr} ${nx - 30},${ny + 150 * dr} ${nx - 10},${ny + 230 * dr}" fill="none" stroke="${C.coral}" stroke-width="8" stroke-linecap="round"/>`;
    s += E(t, W('aria') - 0.1, IT(1110, 600, 'in aria: no', { size: 52 }));
    return s + caption(t, W('overhang'), 'Niente sotto: overhang', '');
  } }) });

// 10 — supporti temporanei: colonna e supporti crescono insieme dal piano, poi si stampa il braccio sopra
scene('supporti', { make: (W) => ({
  capAt: W('temporanei'), hold: W('overhang'),
  render(t) {
    const t0 = W('genera') - 0.1, g = clamp((t - t0) / 1.3), ga = clamp((t - t0 - 1.3) / 0.7), rem = eio((t - W('stampa') - 0.3) / 0.8);
    const ab = OV.ay + OV.at, yTop = OV.bed - (OV.bed - ab) * g, yArm = ab - OV.at * ga;
    let s = E(t, -0.3, bed(), { dy: 0 });
    // colonna: stampata strato per strato fino a yTop (poi fino a yArm quando sale il braccio)
    s += column(C.line, g < 1 ? Math.min(OV.bed, yTop) : yArm);
    // braccio: tratteggiato finche' non e' stampato; poi strati sopra i supporti
    s += R(OV.x0, OV.ay, OV.arm - OV.x0, OV.at, { st: C.line, sw: 3, dash: '12 10' });
    if (ga > 0) { s += `<rect x="${OV.x0}" y="${yArm}" width="${OV.arm - OV.x0}" height="${ab - yArm}" fill="${DIM}" stroke="${C.line}" stroke-width="4"/>`;
      for (let y = ab - OV.lh; y > yArm; y -= OV.lh) s += Ln(OV.x0, y, OV.arm, y, C.line, 1.5, 'opacity="0.5"'); }
    // supporti: colonnine sottili fino al bordo del braccio, alla stessa quota della colonna
    if (g > 0 && rem < 1) {
      let sp = ''; const xs = []; for (let x = OV.x1 + 30; x <= OV.arm - 8; x += 31) xs.push(x);
      xs.forEach(x => sp += Ln(x, yTop, x, OV.bed - 4, C.line, 3));
      for (let i = 0; i + 1 < xs.length; i += 2) sp += Ln(xs[i], OV.bed - 6, xs[i + 1], Math.max(yTop, ab + 4), C.line, 1.5, 'opacity="0.6"');
      s += `<g opacity="${(1 - rem).toFixed(3)}" transform="translate(${(rem * 120).toFixed(1)},0)">${sp}</g>`;
      s += `<g opacity="${(1 - rem).toFixed(3)}">${E(t, W('supporti') + 0.2, lbl(1240, 640, 'SUPPORTI', { a: 'start', size: 30 }) + arrow(1230, 630, OV.arm - 20, 630, C.line, 4))}</g>`;
    }
    s += E(t, W('stampa') + 0.4, IT(1240, 730, 'tolti dopo la stampa', { size: 48 }));
    s += E(t, W('progettista') - 0.1, IT(960, 250, 'un buon progetto riduce gli overhang', { size: 56, a: 'middle' }));
    return s + caption(t, W('temporanei'), 'Supporti temporanei', 'temporanei');
  } }) });

// ---- materiale ----
function spool(cx, cy, ink) {
  let s = `<circle cx="${cx}" cy="${cy}" r="170" fill="${C.cream}" stroke="${ink}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="130" fill="${mix(C.cream, C.ink, 0.1)}" stroke="${ink}" stroke-width="3"/>`;
  for (let r = 70; r < 130; r += 10) s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ink}" stroke-width="1.5" opacity="0.45"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="56" fill="${C.cream}" stroke="${ink}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="16" fill="${ink}"/>`;
  s += `<path d="M${cx + 120},${cy + 40} C${cx + 220},${cy + 80} ${cx + 210},${cy + 200} ${cx + 280},${cy + 230}" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
  return s;
}
const row = (x, y, txt, o = {}) => `<circle cx="${x}" cy="${y - 14}" r="9" fill="${o.c || C.ink}"/>` + T(x + 30, y, txt, { f: o.f || 'popm', size: o.size || 52, fill: o.c || C.ink, w: o.f === 'pop' ? 800 : 500 });
// 11 — PLA
scene('pla', { make: (W) => ({
  capAt: W('190'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(220, 150, 1480, 700, { rot: -0.6 }), { dy: 0 });
    g += E(t, -0.2, spool(520, 470, C.ink) + lbl(520, 740, 'BOBINA DI FILAMENTO', { fill: C.ink, size: 24 }));
    g += E(t, W('pla') - 0.1, BIG(900, 330, 'PLA', { fill: C.ink, size: 120 }) + IT(1160, 325, 'acido polilattico', { fill: C.ink, size: 48 }));
    g += E(t, W('economico') - 0.1, row(910, 440, 'economico'));
    g += E(t, W('190') - 0.1, lbl(940, 510, 'SI STAMPA TRA', { a: 'start', fill: C.ink }));
    g += E(t, W('190'), BIG(940, 610, '190', { fill: C.coralT, size: 96 }));
    g += E(t, W('220 °C') - 0.1, BIG(940 + tw('190 ', 'pop', 96), 610, '– 220 °C', { fill: C.coralT, size: 96 }));
    g += E(t, W('riscaldato') - 0.3, row(910, 720, 'piano riscaldato: non serve'));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('190'), 'PLA: 190-220 °C', '', true);
  } }) });

// 12 — PLA: pro e limiti
scene('pla2', { make: (W) => ({
  capAt: W('deforma'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(220, 150, 1480, 700, { rot: 0.6 }), { dy: 0 });
    g += E(t, W('biodegradabile') - 0.1, row(300, 270, 'biodegradabile') + IT(330, 335, 'in condizioni di compostaggio industriale', { fill: C.ink, size: 44 }));
    // barretta che si piega sopra i 60 gradi
    const bend = eio((t - W('deforma')) / 1.0);
    g += E(t, W('sopra') - 0.1, lbl(300, 440, 'SOPRA I', { a: 'start', fill: C.ink }) + BIG(300, 545, '60 °C', { fill: C.coralT, size: 100 }));
    if (t > W('sopra') - 0.1) {
      const x0 = 720, y0 = 500, Lb = 420, sag = 90 * bend;
      g += E(t, W('sopra') - 0.1, `<path d="M${x0},${y0} Q${x0 + Lb * 0.6},${y0} ${x0 + Lb},${y0 + sag}" fill="none" stroke="${C.ink}" stroke-width="26" stroke-linecap="round"/>` +
        `<path d="M${x0},${y0} Q${x0 + Lb * 0.6},${y0} ${x0 + Lb},${y0 + sag}" fill="none" stroke="${C.cream}" stroke-width="18" stroke-linecap="round"/>` +
        R(x0 - 70, y0 - 50, 70, 100, { st: C.ink, fill: mix(C.cream, C.ink, 0.15), sw: 3 }), { dy: 0 });
      g += E(t, W('deforma') - 0.1, IT(1180, 560, 'si deforma', { fill: C.ink, size: 52 }));
    }
    g += E(t, W('facile') - 0.15, row(300, 720, 'più facile da gestire') + IT(330, 785, 'di altri filamenti', { fill: C.ink, size: 44 }));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('deforma'), '60 °C: si deforma', '', true);
  } }) });

// 13 — cartello finale
scene('finale', { L: 0.5, tail: 3.5, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Dal file alla stampa', { f: 'pop', size: 124, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += E(t, -0.2, T(960, 650, 'STL → SLICER → G-CODE → STAMPANTE', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 4, w: 600 }), { dy: 0 });
    s += words(t, W('strati') - 0.1, 960, 560, 'Strati, riempimento, supporti e materiale.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: '', keyFill: C.coralT });
    s += E(t, W('materiale') - 0.2, `<line x1="760" y1="730" x2="1160" y2="730" stroke="${C.ink}" stroke-width="3"/>` + T(960, 790, 'PROFTECNOLOGIA · MC DIS-3-02', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
