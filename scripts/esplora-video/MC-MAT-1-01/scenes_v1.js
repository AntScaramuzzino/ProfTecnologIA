// Da dove vengono i materiali — MC-MAT-1-01 §"Da dove vengono i materiali? Le materie prime." render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.5);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.6);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const lblI = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.ink, ls: 3, a: o.a || 'middle', w: 700 });

// ---- mondo: oggetti e sottosuolo in sezione, a filo chiaro ----
function chair(cx, by, s, st, fill) {
  return `<path d="M${cx - 50 * s},${by - 200 * s} v${110 * s} M${cx - 50 * s},${by - 90 * s} h${100 * s}" fill="none" stroke="${st}" stroke-width="6" stroke-linecap="round"/>` +
    `<rect x="${cx - 62 * s}" y="${by - 104 * s}" width="${124 * s}" height="${20 * s}" rx="4" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<rect x="${cx - 60 * s}" y="${by - 206 * s}" width="${20 * s}" height="${90 * s}" rx="4" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<path d="M${cx - 52 * s},${by - 84 * s} V${by} M${cx + 52 * s},${by - 84 * s} V${by}" stroke="${st}" stroke-width="7" stroke-linecap="round"/>`;
}
function bottle(cx, by, s, st, fill) {
  const w = 44 * s, h = 190 * s;
  return `<path d="M${cx - w},${by} v${-h * 0.62} q0,${-h * 0.14} ${w * 0.55},${-h * 0.22} v${-h * 0.1} h${w * 0.9} v${h * 0.1} q${w * 0.55},${h * 0.08} ${w * 0.55},${h * 0.22} v${h * 0.62} z" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<rect x="${cx - w * 0.5}" y="${by - h - 16 * s}" width="${w}" height="${18 * s}" rx="3" fill="${fill}" stroke="${st}" stroke-width="4"/>` +
    `<line x1="${cx - w}" y1="${by - h * 0.42}" x2="${cx + w}" y2="${by - h * 0.42}" stroke="${st}" stroke-width="3"/><line x1="${cx - w}" y1="${by - h * 0.2}" x2="${cx + w}" y2="${by - h * 0.2}" stroke="${st}" stroke-width="3"/>`;
}
function can(cx, by, s, st, fill) {
  const w = 52 * s, h = 150 * s;
  return `<path d="M${cx - w},${by - 8 * s} v${-h + 16 * s} l${8 * s},${-10 * s} h${2 * w - 16 * s} l${8 * s},${10 * s} v${h - 16 * s} l${-8 * s},${8 * s} h${-2 * w + 16 * s} z" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<ellipse cx="${cx}" cy="${by - h - 2 * s}" rx="${w - 8 * s}" ry="${7 * s}" fill="none" stroke="${st}" stroke-width="3"/>` +
    `<line x1="${cx - w}" y1="${by - h * 0.7}" x2="${cx + w}" y2="${by - h * 0.7}" stroke="${st}" stroke-width="3"/><line x1="${cx - w}" y1="${by - h * 0.3}" x2="${cx + w}" y2="${by - h * 0.3}" stroke="${st}" stroke-width="3"/>`;
}
function rockPath(cx, cy, s, seed) {
  const n = 9; let d = '';
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2, r = s * (0.8 + 0.35 * hsh(seed + i));
    d += (i ? 'L' : 'M') + (cx + Math.cos(a) * r * 1.25).toFixed(1) + ',' + (cy + Math.sin(a) * r * 0.85).toFixed(1);
  }
  return d + 'z';
}
function rock(cx, cy, s, st, fill, seed = 1, sw = 5, dots = true) {
  let g = `<path d="${rockPath(cx, cy, s, seed)}" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  if (dots) for (let i = 0; i < 6; i++) g += `<circle cx="${(cx + (hsh(seed * 7 + i) - 0.5) * s * 1.4).toFixed(1)}" cy="${(cy + (hsh(seed * 11 + i) - 0.5) * s * 0.9).toFixed(1)}" r="${(s * 0.07).toFixed(1)}" fill="${st}"/>`;
  return g;
}
function drop(cx, cy, s, st, fill, sw = 5) {
  return `<path d="M${cx},${cy - 60 * s} C${cx + 14 * s},${cy - 30 * s} ${cx + 40 * s},${cy - 6 * s} ${cx + 40 * s},${cy + 18 * s} A${40 * s},${40 * s} 0 0 1 ${cx - 40 * s},${cy + 18 * s} C${cx - 40 * s},${cy - 6 * s} ${cx - 14 * s},${cy - 30 * s} ${cx},${cy - 60 * s} z" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
}
function tree(cx, gy, s, st, fill, roots = true) {
  let g = `<path d="M${cx - 9 * s},${gy} V${gy - 90 * s} M${cx + 9 * s},${gy} V${gy - 90 * s}" stroke="${st}" stroke-width="5"/>` +
    `<path d="M${cx},${gy - 250 * s} C${cx + 70 * s},${gy - 250 * s} ${cx + 90 * s},${gy - 170 * s} ${cx + 66 * s},${gy - 130 * s} C${cx + 60 * s},${gy - 90 * s} ${cx - 60 * s},${gy - 90 * s} ${cx - 66 * s},${gy - 130 * s} C${cx - 90 * s},${gy - 170 * s} ${cx - 70 * s},${gy - 250 * s} ${cx},${gy - 250 * s} z" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M${cx},${gy - 100 * s} V${gy - 190 * s} M${cx},${gy - 150 * s} l${26 * s},${-24 * s} M${cx},${gy - 128 * s} l${-24 * s},${-22 * s}" fill="none" stroke="${st}" stroke-width="3.5" stroke-linecap="round"/>`;
  if (roots) g += `<path d="M${cx},${gy} q${-10 * s},${40 * s} ${-60 * s},${60 * s} M${cx},${gy} q${12 * s},${44 * s} ${56 * s},${70 * s} M${cx},${gy} v${80 * s} M${cx - 30 * s},${gy + 40 * s} l${-30 * s},${5 * s}" fill="none" stroke="${st}" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>`;
  return g;
}
function logSection(cx, cy, r, st, fill, sw = 5) {
  let g = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>`;
  for (let k = 1; k <= 4; k++) g += `<circle cx="${cx + k * 1.5}" cy="${cy - k}" r="${r * (1 - k * 0.2)}" fill="none" stroke="${st}" stroke-width="2.5"/>`;
  return g + `<circle cx="${cx + 7}" cy="${cy - 5}" r="4" fill="${st}"/>`;
}
function derrick(cx, gy, s, st) {
  const h = 230 * s, b = 60 * s;
  let g = `<path d="M${cx - b},${gy} L${cx - 10 * s},${gy - h} h${20 * s} L${cx + b},${gy}" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 1; i < 5; i++) { const y = gy - h * i / 5, w = lerp(b, 10 * s, i / 5); const y2 = gy - h * (i - 1) / 5, w2 = lerp(b, 10 * s, (i - 1) / 5); g += `<path d="M${cx - w},${y} H${cx + w} M${cx - w2},${y2} L${cx + w},${y} M${cx + w2},${y2} L${cx - w},${y}" stroke="${st}" stroke-width="2.5"/>`; }
  return g + `<rect x="${cx - 16 * s}" y="${gy - h - 18 * s}" width="${32 * s}" height="${18 * s}" fill="${C.bg}" stroke="${st}" stroke-width="4"/>`;
}
function headframe(cx, gy, s, st) {
  const h = 200 * s;
  return `<path d="M${cx - 50 * s},${gy} L${cx - 14 * s},${gy - h} M${cx + 50 * s},${gy} L${cx + 14 * s},${gy - h} M${cx - 36 * s},${gy - h * 0.35} H${cx + 36 * s} M${cx - 24 * s},${gy - h * 0.7} H${cx + 24 * s} M${cx + 14 * s},${gy - h} L${cx + 110 * s},${gy}" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round"/>` +
    `<circle cx="${cx}" cy="${gy - h - 4 * s}" r="${26 * s}" fill="${C.bg}" stroke="${st}" stroke-width="5"/><circle cx="${cx}" cy="${gy - h - 4 * s}" r="${6 * s}" fill="${st}"/>`;
}
function sprout(cx, gy, s, st, fill) {
  return `<path d="M${cx},${gy} V${gy - 120 * s}" stroke="${st}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M${cx},${gy - 70 * s} C${cx - 20 * s},${gy - 110 * s} ${cx - 70 * s},${gy - 110 * s} ${cx - 80 * s},${gy - 90 * s} C${cx - 60 * s},${gy - 64 * s} ${cx - 20 * s},${gy - 60 * s} ${cx},${gy - 70 * s} z" fill="${fill}" stroke="${st}" stroke-width="4"/>` +
    `<path d="M${cx},${gy - 110 * s} C${cx + 20 * s},${gy - 150 * s} ${cx + 70 * s},${gy - 150 * s} ${cx + 80 * s},${gy - 130 * s} C${cx + 60 * s},${gy - 104 * s} ${cx + 20 * s},${gy - 100 * s} ${cx},${gy - 110 * s} z" fill="${fill}" stroke="${st}" stroke-width="4"/>` +
    `<path d="M${cx},${gy} q-14,30 -40,44 M${cx},${gy} q12,34 34,50 M${cx},${gy} v52" fill="none" stroke="${st}" stroke-width="3" stroke-linecap="round"/>`;
}
function pickaxe(cx, cy, s, st) {
  return `<path d="M${cx - 70 * s},${cy + 70 * s} L${cx + 30 * s},${cy - 30 * s}" stroke="${st}" stroke-width="${9 * s}" stroke-linecap="round"/>` +
    `<path d="M${cx - 30 * s},${cy - 70 * s} Q${cx + 40 * s},${cy - 70 * s} ${cx + 70 * s},${cy + 10 * s}" fill="none" stroke="${st}" stroke-width="${10 * s}" stroke-linecap="round"/>`;
}
function granules(cx, cy, s, st, fill) {
  return [[-26, 8], [0, -10], [26, 6], [-12, 26], [14, 28]].map(([x, y], i) => `<ellipse cx="${cx + x * s}" cy="${cy + y * s}" rx="${13 * s}" ry="${10 * s}" fill="${fill}" stroke="${st}" stroke-width="3.5"/>`).join('');
}
function mould(cx, cy, s, st, fill) { // stampo in sezione: due metà con la cavità di una bottiglia
  return `<rect x="${cx - 70 * s}" y="${cy - 70 * s}" width="${66 * s}" height="${140 * s}" rx="6" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<rect x="${cx + 4 * s}" y="${cy - 70 * s}" width="${66 * s}" height="${140 * s}" rx="6" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<path d="M${cx - 4 * s},${cy - 54 * s} h${-10 * s} v${20 * s} q${-22 * s},${8 * s} ${-22 * s},${30 * s} v${76 * s} h${36 * s} M${cx + 4 * s},${cy - 54 * s} h${10 * s} v${20 * s} q${22 * s},${8 * s} ${22 * s},${30 * s} v${76 * s} h${-36 * s}" fill="none" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
}
function bag(cx, cy, s, st, fill) {
  return `<path d="M${cx - 50 * s},${cy - 40 * s} h${100 * s} l${10 * s},${110 * s} h${-120 * s} z" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M${cx - 24 * s},${cy - 40 * s} v${-14 * s} a${24 * s},${24 * s} 0 0 1 ${48 * s},0 v${14 * s}" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
}
function globe(cx, cy, r, st, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.45}" ry="${r}" fill="none" stroke="${st}" stroke-width="3"/>` +
    `<path d="M${cx - r},${cy} H${cx + r} M${cx - r * 0.86},${cy - r * 0.5} H${cx + r * 0.86} M${cx - r * 0.86},${cy + r * 0.5} H${cx + r * 0.86}" stroke="${st}" stroke-width="3"/>`;
}
function priceTag(cx, cy, s, st, fill) {
  return `<path d="M${cx - 80 * s},${cy - 44 * s} h${120 * s} l${44 * s},${44 * s} l${-44 * s},${44 * s} h${-120 * s} z" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<circle cx="${cx + 38 * s}" cy="${cy}" r="${9 * s}" fill="none" stroke="${st}" stroke-width="4"/>` +
    `<path d="M${cx - 56 * s},${cy - 12 * s} h${60 * s} M${cx - 56 * s},${cy + 14 * s} h${40 * s}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`;
}
function bolt(cx, cy, s, fill) {
  return `<path d="M${cx + 10 * s},${cy - 50 * s} L${cx - 26 * s},${cy + 6 * s} h${24 * s} L${cx - 12 * s},${cy + 50 * s} L${cx + 26 * s},${cy - 8 * s} h${-24 * s} z" fill="${fill}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
}
// sottosuolo in sezione: strati ondulati
function strata(x, y, w, h, st, n = 4, seed = 0) {
  let g = `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${st}" stroke-width="5"/>`;
  for (let k = 1; k <= n; k++) {
    const yy = y + h * k / (n + 0.6); let d = `M${x},${yy}`;
    for (let i = 1; i <= 8; i++) d += ` Q${x + w * (i - 0.5) / 8},${yy + (hsh(seed + k * 9 + i) - 0.5) * 30} ${x + w * i / 8},${yy}`;
    g += `<path d="${d}" fill="none" stroke="${st}" stroke-width="2.5" opacity="0.55"/>`;
  }
  return g;
}
const dash = (x1, y1, x2, y2, st, sw = 4) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${st}" stroke-width="${sw}" stroke-dasharray="3 12" stroke-linecap="round"/>`;

// 1 — da dove vengono i materiali?
scene('intro', { make: (W) => ({
  capAt: W("qualcos'altro"), last: W("qualcos'altro") + 0.3,
  render(t) {
    let s = words(t, -0.1, 960, 240, 'Da dove vengono', { f: 'pop', size: 92, a: 'middle' });
    s += words(t, W('materiali') - 0.15, 960, 350, 'i materiali?', { f: 'pop', size: 92, a: 'middle', key: 'materiali?' });
    const ob = [[560, (x) => chair(x, 640, 1, C.line, DIM())], [960, (x) => bottle(x, 640, 1, C.line, DIM())], [1360, (x) => can(x, 640, 1.05, C.line, DIM())]];
    ob.forEach(([x, f], i) => { const t0 = W('oggetto') - 0.15 + i * 0.12; s += pop(t, t0, x, 560, f(x)); });
    s += E(t, W('oggetto'), `<line x1="380" y1="644" x2="1540" y2="644" stroke="${C.line}" stroke-width="3"/>`, { dy: 0 });
    // prima era qualcos'altro: ciò da cui viene (in sezione sotto il piano)
    const tq = W("qualcos'altro") - 0.15;
    const src = [[560, (x) => tree(x, 830, 0.42, C.line, DIM(), false)], [960, (x) => drop(x, 790, 0.85, C.line, DIM())], [1360, (x) => rock(x, 790, 46, C.line, DIM(), 3)]];
    src.forEach(([x, f], i) => {
      s += E(t, tq + i * 0.1, dash(x, 664, x, 712, C.line) + f(x), { dy: -16 });
    });
    return s + caption(t, W("qualcos'altro") - 0.1, "Prima, qualcos'altro", '');
  } }) });

// 2 — estratto o coltivato (registro chiaro)
scene('origine', { make: (W) => ({
  capAt: W('estratto'), last: W('risorse'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += E(t, W('posto') - 0.15, IT(260, 262, 'un posto preciso nel mondo', { size: 56, fill: ink }), { dy: 10 });
    const gy = 560;
    // estratto: sottosuolo con vena e piccone
    s += E(t, W('estratto') - 0.15, strata(260, gy, 560, 190, ink, 3, 2) + rock(640, gy + 100, 42, ink, C.ivory, 5, 4) +
      pickaxe(470, gy - 90, 0.9, ink) + lblI(540, gy + 245, 'ESTRATTO'), { dy: 12 });
    // coltivato: terreno e germoglio
    s += E(t, W('coltivato') - 0.15, strata(1100, gy, 560, 190, ink, 3, 7) + sprout(1380, gy, 1.2, ink, C.ivory) + lblI(1380, gy + 245, 'COLTIVATO'), { dy: 12 });
    s += E(t, W('estratto'), T(960, gy - 70, 'o', { f: 'serif', it: true, size: 64, fill: ink, a: 'middle' }), { dy: 0 });
    // energia e risorse
    s += E(t, W('consuma') - 0.15, `<rect x="1190" y="186" width="500" height="126" rx="16" fill="${C.ivory}" stroke="${ink}" stroke-width="3"/>` +
      bolt(1250, 249, 0.8, C.coral) + lblI(1310, 238, 'CONSUMA', { a: 'start' }) , { dy: 10 });
    s += E(t, W('energia') - 0.1, lblI(1310, 284, 'ENERGIA', { a: 'start' }), { dy: 6 });
    s += E(t, W('risorse') - 0.1, lblI(1458, 284, 'E RISORSE', { a: 'start' }), { dy: 6 });
    return s + caption(t, W('estratto'), 'Estratto o coltivato', '', true);
  } }) });

// 3 — si chiamano materie prime
scene('nome', { make: (W) => ({
  capAt: W('punti'), last: W('prime') + 0.2,
  render(t) {
    let s = '';
    const ic = [[420, (x) => logSection(x, 440, 70, C.line, DIM())], [780, (x) => rock(x, 440, 66, C.line, DIM(), 3)], [1140, (x) => rock(x, 440, 60, C.line, DIM(), 8)], [1500, (x) => drop(x, 450, 1.2, C.line, DIM())]];
    ic.forEach(([x, f], i) => { s += pop(t, -0.25 + i * 0.12, x, 440, f(x)); });
    s += E(t, -0.1, lbl(420, 570, 'LEGNO') + lbl(780, 570, 'FERRO') + lbl(1140, 570, 'BAUXITE') + lbl(1500, 570, 'PETROLIO'), { dy: 0 });
    s += E(t, W('materie') - 0.15, T(960, 760, 'materie prime', { f: 'pop', size: 150, fill: C.coral, a: 'middle' }), { dy: 26 });
    return s + caption(t, W('punti') - 0.05, 'I punti di partenza', '');
  } }) });

// 4 — il legno: boschi e foreste
scene('legno', { make: (W) => ({
  capAt: W('boschi'), last: W('foreste'),
  render(t) {
    let s = '';
    const gy = 640;
    s += E(t, -0.3, `<line x1="140" y1="${gy}" x2="1780" y2="${gy}" stroke="${C.line}" stroke-width="5"/>` + T(160, 250, 'Il legno', { f: 'pop', size: 84 }), { dy: 0 });
    // bosco
    [[300, 1.0], [450, 0.8], [590, 1.1]].forEach(([x, k], i) => { s += pop(t, W('boschi') - 0.15 + i * 0.08, x, gy - 100, tree(x, gy, k, C.line, DIM())); });
    s += E(t, W('boschi') - 0.05, lbl(450, gy + 160, 'BOSCHI'), { dy: 0 });
    // foresta: più fitta
    [[880, 0.9], [990, 1.15], [1100, 0.85], [1210, 1.05], [1320, 0.95]].forEach(([x, k], i) => { s += pop(t, W('foreste') - 0.15 + i * 0.06, x, gy - 100, tree(x, gy, k, C.line, DIM())); });
    s += E(t, W('foreste') - 0.05, lbl(1100, gy + 160, 'FORESTE'), { dy: 0 });
    // sezione di un tronco
    s += E(t, -0.2, logSection(1620, 470, 110, C.coral, C.bg, 6) + lbl(1620, 640 + 160, 'SEZIONE DEL TRONCO', { size: 24 }), { dy: 0 });
    return s + caption(t, W('boschi'), 'Dai boschi e foreste', '');
  } }) });

// 5 — il ferro: minerale e miniere
scene('ferro', { make: (W) => ({
  capAt: W('minerale'), last: W('miniere'),
  render(t) {
    let s = '';
    const gy = 330, X = 140, Wd = 1640;
    s += E(t, -0.3, T(1780, 250, 'Il ferro', { f: 'pop', size: 84, a: 'end' }), { dy: 0 });
    s += E(t, -0.3, strata(X, gy, Wd, 520, C.line, 5, 4), { dy: 0 });
    // vena di roccia ricca di ossido di ferro
    const vx = 1180, vy = 640, vt = W('rocce') - 0.15, vm = W('minerale') - 0.1;
    const vein = (st, sw) => `<path d="M${vx - 260},${vy - 40} C${vx - 140},${vy - 110} ${vx + 80},${vy - 90} ${vx + 300},${vy - 60} C${vx + 330},${vy + 10} ${vx + 120},${vy + 70} ${vx - 60},${vy + 60} C${vx - 200},${vy + 50} ${vx - 300},${vy + 20} ${vx - 260},${vy - 40} z" fill="${C.bg}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    s += E(t, vt, vein(t > vm ? C.coral : C.line, t > vm ? 7 : 5) +
      [...Array(14)].map((_, i) => rock(vx - 200 + (i % 7) * 75 + (i > 6 ? 30 : 0), vy - 30 + (i > 6 ? 55 : 0), 18, C.line, 'none', 20 + i, 3, false)).join(''), { dy: 0 });
    s += E(t, W('ossido') - 0.1, lbl(vx + 20, vy + 140, 'ROCCIA RICCA DI OSSIDO DI FERRO', { size: 24 }), { dy: 0 });
    s += E(t, vm, T(vx + 20, vy - 130, 'minerale', { f: 'serif', it: true, size: 60, a: 'middle' }), { dy: 10 });
    // miniera: castelletto, pozzo e galleria fino alla vena
    const mx = 420, tm = W('zone') - 0.2;
    s += E(t, tm, headframe(mx, gy, 0.9, C.line) +
      `<path d="M${mx - 30},${gy} V${vy + 30} H${vx - 300} M${mx + 30},${gy} V${vy - 30} H${vx - 290}" fill="none" stroke="${C.line}" stroke-width="5"/>`, { dy: 0 });
    s += E(t, W('miniere') - 0.1, lbl(mx + 60, vy + 100, 'MINIERA', { a: 'start' }), { dy: 0 });
    s += E(t, -0.2, lbl(X + Wd, gy + 50, 'SOTTOSUOLO IN SEZIONE', { a: 'end', size: 24 }), { dy: 0 });
    return s + caption(t, W('minerale'), 'Minerale e miniere', '');
  } }) });

// 6 — alluminio dalla bauxite (registro chiaro)
scene('alluminio', { make: (W) => ({
  capAt: W('bauxite'), last: W('giamaica'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    // lamiera / lattina di alluminio a destra della freccia
    s += pop(t, -0.15, 820, 450, can(820, 560, 1.3, ink, C.ivory)) + E(t, -0.05, lblI(820, 640, 'ALLUMINIO'), { dy: 0 });
    s += E(t, W('bauxite') - 0.15, rock(370, 470, 100, ink, C.coral, 6, 5) + lblI(370, 640, 'BAUXITE'), { dy: 14 });
    s += E(t, W('bauxite') + 0.15, arrow(520, 470, 690, 470, ink, 6), { dy: 0, blur: 0 });
    s += E(t, W('minerale') - 0.1, T(370, 700, 'un minerale', { f: 'serif', it: true, size: 48, fill: ink, a: 'middle' }), { dy: 8 });
    // dove è diffusa
    s += E(t, W('diffuso') - 0.1, `<line x1="1080" y1="230" x2="1080" y2="770" stroke="${ink}" stroke-width="3"/>` + lblI(1150, 300, 'DIFFUSA IN', { a: 'start' }), { dy: 0 });
    [['AFRICA OCCIDENTALE', 'africa', 400], ['AUSTRALIA', 'australia', 500], ['GIAMAICA', 'giamaica', 600]].forEach(([l, w, y]) => {
      s += E(t, W(w) - 0.1, pillTag(1150, y, l, ink, C.ivory, 'start'), { dy: 10 });
    });
    return s + caption(t, W('bauxite'), 'Alluminio dalla bauxite', '', true);
  } }) });

// 7 — il petrolio e le plastiche
scene('petrolio', { make: (W) => ({
  capAt: W('quasi'), last: W('nord'),
  render(t) {
    let s = '';
    const X = 140, Wd = 980, gy = 380;
    // in alto a destra: petrolio -> plastiche
    s += E(t, -0.3, drop(1260, 270, 0.9, C.line, DIM()) + lbl(1260, 360, 'PETROLIO'), { dy: 0 });
    s += E(t, W('ricavano') - 0.1, arrow(1340, 260, 1470, 260, C.line, 5), { dy: 0, blur: 0 });
    s += E(t, W('plastiche') - 0.15, bottle(1560, 320, 0.62, C.line, DIM()) + granules(1680, 290, 1.1, C.line, DIM()) + lbl(1620, 360, 'PLASTICHE'), { dy: 10 });
    s += E(t, W('quasi') - 0.1, T(1450, 430, 'quasi tutte', { f: 'serif', it: true, size: 52, a: 'middle' }), { dy: 8 });
    // giacimento sotterraneo in sezione
    const tg = W('giacimenti') - 0.2;
    s += E(t, -0.3, strata(X, gy, Wd, 470, C.line, 5, 11) + derrick(470, gy, 0.8, C.line), { dy: 0 });
    s += E(t, -0.3, `<line x1="470" y1="${gy}" x2="470" y2="660" stroke="${C.line}" stroke-width="6"/>`, { dy: 0 });
    const trap = `<path d="M260,720 C380,560 760,560 900,720 Z" fill="${C.bg}" stroke="${C.coral}" stroke-width="7" stroke-linejoin="round"/>`;
    const fillOil = [...Array(16)].map((_, i) => `<circle cx="${330 + (i % 8) * 70}" cy="${i < 8 ? 680 : 650}" r="7" fill="${C.line}" opacity="${i >= 8 && (i % 8 === 0 || i % 8 === 7) ? 0 : 1}"/>`).join('');
    s += E(t, tg, trap + fillOil, { dy: 0 });
    s += E(t, tg + 0.1, `<line x1="470" y1="${gy}" x2="470" y2="660" stroke="${C.line}" stroke-width="6"/>` + lbl(580, 790, 'GIACIMENTO SOTTERRANEO', { size: 24 }), { dy: 0 });
    // regioni
    s += E(t, W('medio') - 0.15, `<line x1="1200" y1="490" x2="1780" y2="490" stroke="${C.line}" stroke-width="3"/>` + lbl(1210, 545, 'GIACIMENTI IN', { a: 'start', size: 24 }), { dy: 0 });
    [['MEDIO ORIENTE', 'medio', 620], ['RUSSIA', 'russia', 700], ['AMERICA DEL NORD', 'america', 780]].forEach(([l, w, y]) => {
      s += E(t, W(w) - 0.1, pillTag(1210, y, l, C.line, C.bg, 'start'), { dy: 10 });
    });
    return s + caption(t, W('quasi'), 'Quasi tutte le plastiche', '');
  } }) });

// 8–9 — il viaggio di un oggetto di plastica (percorso probabile)
const ST = [[260, 'ARABIA SAUDITA', 'ESTRAZIONE'], [740, 'GERMANIA', 'GRANULI'], [1220, 'POLONIA O CINA', 'STAMPAGGIO'], [1660, 'ITALIA', 'ACQUISTO']];
const RY = 560;
function stationIcon(i, x, st) {
  if (i === 0) return derrick(x, RY - 60, 0.6, st);
  if (i === 1) return granules(x, RY - 120, 1.5, st, DIM());
  if (i === 2) return mould(x, RY - 140, 0.75, st, DIM());
  return bag(x, RY - 130, 0.95, st, DIM());
}
function route(t, shown, done, pos, form) {
  // shown[i]: istante di comparsa stazione i; done: x fino a cui il tratto è percorso
  let s = dash(ST[0][0], RY, ST[3][0], RY, C.lineDim, 4);
  if (done > ST[0][0]) s += `<line x1="${ST[0][0]}" y1="${RY}" x2="${done}" y2="${RY}" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/>`;
  ST.forEach(([x, a, b], i) => {
    if (shown[i] == null) return;
    s += E(t, shown[i], stationIcon(i, x, C.line) + `<circle cx="${x}" cy="${RY}" r="16" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>` +
      T(x, RY + 90, a, { f: 'pop', size: 38, a: 'middle' }) + lbl(x, RY + 136, b, { size: 24 }), { dy: 12 });
  });
  if (pos != null) {
    const ic = form === 0 ? drop(pos, RY + 4, 0.38, C.ivory, C.coral, 0) : form === 1 ? granules(pos, RY - 6, 0.55, C.coral, C.ivory) : bottle(pos, RY + 26, 0.28, C.coral, C.ivory);
    s += `<circle cx="${pos}" cy="${RY}" r="34" fill="${C.coral}"/>` + (form === 0 ? `<path d="M${pos},${RY - 20} C${pos + 5},${RY - 10} ${pos + 15},${RY - 2} ${pos + 15},${RY + 7} A15,15 0 0 1 ${pos - 15},${RY + 7} C${pos - 15},${RY - 2} ${pos - 5},${RY - 10} ${pos},${RY - 20} z" fill="${C.ivory}"/>` : ic);
  }
  return s;
}
scene('viaggio', { make: (W) => ({
  capAt: W('petrolio'), last: W('germania'),
  render(t) {
    const tI = W('italia') - 0.15, tA = W('arabia') - 0.15, tG = W('granuli') - 0.15, mv = W('trasformato') - 0.1;
    let s = E(t, W('probabilmente') - 0.1, pillTag(140, 230, 'PERCORSO PROBABILE', C.line, C.bg), { dy: 0 });
    s += E(t, -0.3, T(1780, 230, 'un oggetto di plastica', { f: 'serif', it: true, size: 50, a: 'end' }), { dy: 0 });
    const p = eio((t - mv) / 1.1), x = t < tA ? null : lerp(ST[0][0], ST[1][0], p);
    const form = t < mv + 0.55 ? 0 : 1;
    s += route(t, [tA, t > tG ? tG : null, null, tI], x ?? 0, x, form);
    return s + caption(t, W('petrolio'), 'Petrolio, poi granuli', '');
  } }) });
scene('stampa', { make: (W) => ({
  capAt: W('stampato'), last: W('qui'),
  render(t) {
    const tP = W('polonia') - 0.15, mv1 = W('stabilimento') - 0.1, mv2 = W('spedito') - 0.1;
    let s = pillTag(140, 230, 'PERCORSO PROBABILE', C.line, C.bg) + T(1780, 230, 'un oggetto di plastica', { f: 'serif', it: true, size: 50, a: 'end' });
    const p1 = eio((t - mv1) / 1.2), p2 = eio((t - mv2) / 1.0);
    const x = t < mv2 ? lerp(ST[1][0], ST[2][0], p1) : lerp(ST[2][0], ST[3][0], p2);
    const form = (t < mv1 + 0.9) ? 1 : 2;
    s += route(t, [-9, -9, tP, -9], x, x, form);
    s += E(t, W('qui') - 0.1, lbl(ST[3][0], RY + 182, 'QUI', { size: 26 }), { dy: 0 });
    return s + caption(t, W('stampato'), 'Stampato, poi spedito', '');
  } }) });

// 10 — migliaia di chilometri (registro chiaro)
scene('km', { make: (W) => ({
  capAt: W('migliaia'), last: W('chilometri'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    // percorso tortuoso con le 4 tappe, tracciato progressivamente
    const P = [[300, 640], [620, 380], [980, 600], [1300, 340], [1620, 560]];
    const d = `M${P[0][0]},${P[0][1]} C450,380 520,360 ${P[1][0]},${P[1][1]} S880,620 ${P[2][0]},${P[2][1]} S1220,330 ${P[3][0]},${P[3][1]} S1540,600 ${P[4][0]},${P[4][1]}`;
    const len = 1900, p = eio((t + 0.2) / (W('percorso') + 0.4));
    s += `<path d="${d}" fill="none" stroke="${ink}" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round" opacity="0.5"/>`;
    s += `<path d="${d}" fill="none" stroke="${C.coral}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${(len * (1 - p)).toFixed(1)}"/>`;
    [P[0], P[1], P[2], P[4]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="14" fill="${C.ivory}" stroke="${ink}" stroke-width="5"/>`; });
    s += E(t, 0, lblI(300, 700, 'MATERIA PRIMA') + lblI(1620, 620, 'DA TE'), { dy: 0 });
    s += words(t, W('migliaia') - 0.1, 960, 790, 'migliaia di chilometri', { f: 'pop', size: 76, fill: ink, a: 'middle' });
    return s + caption(t, W('percorso'), 'Migliaia di chilometri', '', true);
  } }) });

// 11 — il primo passo: quanto è costato al pianeta
scene('costo', { make: (W) => ({
  capAt: W('primo'), last: W('pagassi'),
  render(t) {
    let s = E(t, -0.3, T(960, 250, 'Da dove viene la materia prima?', { f: 'serif', it: true, size: 64, a: 'middle' }), { dy: 0 });
    s += E(t, W('primo') - 0.1, lbl(960, 310, 'IL PRIMO PASSO'), { dy: 0 });
    const y = 620, x0 = 300, x1 = 1600;
    s += E(t, W('capire') - 0.2, rock(x0, y, 48, C.line, DIM(), 3) + lbl(x0, y + 110, 'MATERIA PRIMA', { size: 24 }) +
      dash(x0 + 80, y, x1 - 140, y, C.line) + [700, 1000, 1300].map(x => `<circle cx="${x}" cy="${y}" r="12" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`).join(''), { dy: 0 });
    s += E(t, W('pianeta') - 0.15, `<path d="M${x0},${y - 60} v-24 H1360 v24" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linejoin="round"/>` +
      globe(830, y - 150, 40, C.line, DIM()) + lbl(830, y - 215, 'COSTO PER IL PIANETA'), { dy: 10 });
    s += E(t, W('pagassi') - 0.15, priceTag(x1, y, 0.9, C.line, DIM()) + lbl(x1, y + 110, 'PREZZO', { size: 24 }), { dy: 10 });
    s += E(t, W('anche') - 0.1, T(830, y + 200, 'prima ancora di pagarlo', { f: 'serif', it: true, size: 46, a: 'middle' }), { dy: 8 });
    return s + caption(t, W('primo'), 'Il primo passo', '');
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Le materie prime', { f: 'pop', size: 104, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('ogni') - 0.3, 960, 545, 'Ogni materiale ha una storia:', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true });
    s += words(t, W('comincia') - 0.1, 960, 630, 'comincia da una materia prima.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'materia prima', keyFill: C.coralD });
    s += E(t, W('comincia') + 0.6, `<line x1="760" y1="700" x2="1160" y2="700" stroke="${C.ink}" stroke-width="3"/>` + T(960, 760, 'PROFTECNOLOGIA · MC MAT-1-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
  inner = `<g transform="translate(960,540) scale(${1 + 0.025 * t / S.D}) translate(-960,-540)">${inner}</g>`;
  body += inner;
  if (S.id !== 'finale') body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
