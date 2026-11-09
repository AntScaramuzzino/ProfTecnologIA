// La mobilità urbana — chi occupa lo spazio della città (MC-AMB-2-03). render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const norm = w => w.toLowerCase().replace(/[^\p{L}\d']/gu, '');
  const W = (w, n = 0) => { const m = sc.parole.filter(p => norm(p[0]) === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.35);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.hold) def.hold.forEach(h => { D = Math.max(D, h + 0.4 + 1.5); });
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<pattern id="hatchD" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="${C.line}" stroke-width="3"/></pattern>
<pattern id="hatchL" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="${C.ink}" stroke-width="3"/></pattern>
<pattern id="hatchC" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="${C.coral}" stroke-width="4"/></pattern></defs>`;

const SCALE = 70; // px per metro, unica per tutte le scene con aree
const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.line, ls: 3, a: o.a || 'middle', w: 600 });
const mod = (a, n) => ((a % n) + n) % n;
const DIM = () => mix(C.bg, C.line, 0.12);
// generatore pseudo-casuale deterministico
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// ---------- pittogrammi in pianta (vista dall'alto) ----------
function carTop(cx, cy, s, ink, fill, ang = 0) {
  const L = 4.3 * s, Wd = 1.8 * s, sw = Math.max(2.5, s * 0.05);
  let g = '';
  [[-1.35, -1], [1.35, -1], [-1.35, 1], [1.35, 1]].forEach(([a, b]) => g += `<rect x="${a * s - 0.35 * s}" y="${b * 0.93 * s - 0.12 * s}" width="${0.7 * s}" height="${0.24 * s}" rx="${0.08 * s}" fill="${ink}"/>`);
  g += `<rect x="${-L / 2}" y="${-Wd / 2}" width="${L}" height="${Wd}" rx="${0.42 * s}" fill="${fill}" stroke="${ink}" stroke-width="${sw}"/>`;
  g += `<path d="M${0.55 * s},${-0.72 * s} L${1.2 * s},${-0.62 * s} L${1.2 * s},${0.62 * s} L${0.55 * s},${0.72 * s} z" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  g += `<path d="M${-1.15 * s},${-0.7 * s} L${-1.6 * s},${-0.6 * s} L${-1.6 * s},${0.6 * s} L${-1.15 * s},${0.7 * s} z" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  return `<g transform="translate(${cx},${cy}) rotate(${ang})">${g}</g>`;
}
function busTop(cx, cy, len, wid, ink, fill, dir = 1) {
  let g = `<rect x="${-len / 2}" y="${-wid / 2}" width="${len}" height="${wid}" rx="${wid * 0.16}" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
  g += `<line x1="${len / 2 - wid * 0.32}" y1="${-wid / 2 + 6}" x2="${len / 2 - wid * 0.32}" y2="${wid / 2 - 6}" stroke="${ink}" stroke-width="4"/>`;
  for (let i = 0; i < 3; i++) g += `<rect x="${-len / 2 + len * (0.12 + i * 0.27)}" y="${-wid * 0.2}" width="${len * 0.14}" height="${wid * 0.4}" rx="4" fill="none" stroke="${ink}" stroke-width="3"/>`;
  return `<g transform="translate(${cx},${cy}) scale(${dir},1)">${g}</g>`;
}
function trainTop(cx, cy, len, wid, ink, fill) {
  const n = 3, gap = 14, cl = (len - gap * (n - 1)) / n; let g = '';
  for (let i = 0; i < n; i++) {
    const x = -len / 2 + i * (cl + gap);
    if (i) g += `<line x1="${x - gap}" y1="0" x2="${x}" y2="0" stroke="${ink}" stroke-width="5"/>`;
    const r = i === n - 1 ? wid * 0.45 : wid * 0.14;
    g += i === n - 1
      ? `<path d="M${x},${-wid / 2} L${x + cl - r},${-wid / 2} Q${x + cl},${-wid / 2} ${x + cl},0 Q${x + cl},${wid / 2} ${x + cl - r},${wid / 2} L${x},${wid / 2} z" fill="${fill}" stroke="${ink}" stroke-width="4"/>`
      : `<rect x="${x}" y="${-wid / 2}" width="${cl}" height="${wid}" rx="${r}" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
    g += `<line x1="${x + 12}" y1="0" x2="${x + cl - (i === n - 1 ? wid * 0.6 : 12)}" y2="0" stroke="${ink}" stroke-width="2.5" stroke-dasharray="10 8"/>`;
  }
  return `<g transform="translate(${cx},${cy})">${g}</g>`;
}
function bikeTop(cx, cy, s, ink, fill) {
  const sw = Math.max(2.5, s * 0.035); let g = '';
  [-0.55, 0.55].forEach(a => g += `<rect x="${a * s - 0.34 * s}" y="${-0.035 * s}" width="${0.68 * s}" height="${0.07 * s}" rx="${0.035 * s}" fill="${ink}"/>`);
  g += `<line x1="${-0.55 * s}" y1="0" x2="${0.48 * s}" y2="0" stroke="${ink}" stroke-width="${sw}"/>`;
  g += `<line x1="${0.42 * s}" y1="${-0.3 * s}" x2="${0.42 * s}" y2="${0.3 * s}" stroke="${ink}" stroke-width="${sw * 1.3}" stroke-linecap="round"/>`;
  g += `<path d="M${0.05 * s},${-0.2 * s} L${0.42 * s},${-0.27 * s} M${0.05 * s},${0.2 * s} L${0.42 * s},${0.27 * s}" stroke="${ink}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
  g += `<ellipse cx="${-0.08 * s}" cy="0" rx="${0.14 * s}" ry="${0.24 * s}" fill="${fill}" stroke="${ink}" stroke-width="${sw}"/>`;
  g += `<circle cx="${0.02 * s}" cy="0" r="${0.1 * s}" fill="${fill}" stroke="${ink}" stroke-width="${sw}"/>`;
  return `<g transform="translate(${cx},${cy})">${g}</g>`;
}
function pedTop(cx, cy, s, ink, fill) {
  const sw = Math.max(2.5, s * 0.03);
  return `<g transform="translate(${cx},${cy})"><ellipse cx="0" cy="0" rx="${0.12 * s}" ry="${0.24 * s}" fill="${fill}" stroke="${ink}" stroke-width="${sw}"/><circle cx="${0.03 * s}" cy="0" r="${0.1 * s}" fill="${fill}" stroke="${ink}" stroke-width="${sw}"/></g>`;
}
// quadrato d'area: lato = sqrt(m2) * scala; ancorato in basso a sinistra
function areaSq(x, base, m2, sc, o = {}) {
  const side = Math.sqrt(m2) * sc;
  return `<rect x="${x}" y="${base - side}" width="${side}" height="${side}" fill="${o.fill || 'none'}" stroke="${o.c || C.line}" stroke-width="${o.sw || 4}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
}
function refSq(x, base, sc, ink, light) { // riferimento 1 m²
  return areaSq(x, base, 1, sc, { c: ink, sw: 3, dash: '10 7' }) + T(x + sc / 2, base + 40, '1 m²', { f: 'mono', size: 26, fill: ink, a: 'middle', w: 600 });
}

// ---------- 0 — la strada in pianta ----------
function street(t, ink) {
  const dim = mix(C.bg, ink, 0.5); let s = '';
  // bordi: marciapiede alto 250-320, pista ciclabile 320-380, carreggiata 380-700, marciapiede basso 700-770
  [250, 770].forEach(y => s += `<line x1="0" y1="${y}" x2="1920" y2="${y}" stroke="${ink}" stroke-width="3"/>`);
  [320, 380, 700].forEach(y => s += `<line x1="0" y1="${y}" x2="1920" y2="${y}" stroke="${ink}" stroke-width="4"/>`);
  s += `<line x1="0" y1="540" x2="1920" y2="540" stroke="${dim}" stroke-width="4" stroke-dasharray="40 30"/>`;
  s += `<line x1="0" y1="350" x2="1920" y2="350" stroke="${dim}" stroke-width="2" stroke-dasharray="14 18"/>`;
  const sc = 60, fill = C.bg, span = 2700;
  const low = [['car', 0], ['bus', 760], ['car', 1500], ['car', 2050]], up = [['car', 300], ['car', 950], ['bus', 1700]];
  low.forEach(([k, x0]) => { const x = mod(x0 + 210 * t, span) - 400; s += k === 'car' ? carTop(x, 620, sc, ink, fill) : busTop(x, 620, 12 * sc * 0.9, 2.5 * sc, ink, fill); });
  up.forEach(([k, x0]) => { const x = 2320 - mod(x0 + 180 * t, span); s += k === 'car' ? carTop(x, 460, sc, ink, fill, 180) : busTop(x, 460, 12 * sc * 0.9, 2.5 * sc, ink, fill, -1); });
  [0, 640, 1300].forEach(x0 => s += bikeTop(mod(x0 + 120 * t, span) - 300, 350, sc * 1.0, ink, fill));
  [[100, 285, 1], [520, 285, -1], [900, 735, 1], [1350, 735, -1], [1700, 285, 1], [260, 735, -1]].forEach(([x0, y, d], i) => {
    const x = d > 0 ? mod(x0 + 40 * t, 2100) - 90 : 2010 - mod(2010 - x0 + 40 * t, 2100);
    s += `<g transform="translate(${x},${y}) rotate(${d > 0 ? 0 : 180})">${pedTop(0, 0, sc * 1.1, ink, fill)}</g>`;
  });
  return s;
}
scene('hook', { L: 0.35, make: (W) => ({
  capAt: W('ogni'),
  render(t) {
    let s = E(t, -0.3, street(t, C.line), { dy: 0 });
    s += words(t, W('come') - 0.1, 960, 190, 'Come ci si sposta in città?', { f: 'serif', size: 72, it: true, a: 'middle' });
    return s + caption(t, W('ogni'), 'Ogni mezzo occupa spazio', 'spazio');
  } }) });

// ---------- 1 — automobile: 23 m² ----------
scene('auto', { make: (W) => ({
  capAt: W('passeggero'), hold: [W('23')],
  render(t) {
    const SCL = SCALE, cx = 540, cy = 592, x0 = cx - 2.15 * SCL - 10, RH = 2.5 * SCL, RW = 23 / 2.5 * SCL;
    let s = '';
    s += E(t, -0.3, refSq(160, 760, SCL, C.line) + lbl(160, 840, 'AREE IN SCALA', { a: 'start', size: 24 }), { dy: 0 });
    // area per passeggero (23 m²): si allunga davanti all'auto, nel senso di marcia
    const p = eo((t - W('movimento')) / 0.9);
    if (p > 0) {
      const w = lerp(4.3 * SCL + 20, RW, p), h = lerp(1.8 * SCL + 20, RH, p);
      s += `<rect x="${x0}" y="${cy - h / 2}" width="${w}" height="${h}" fill="${mix(C.bg, C.coral, 0.12)}" stroke="${C.coral}" stroke-width="5" opacity="${clamp(p * 3)}"/>`;
    }
    if (t > W('movimento') - 0.3) for (let i = 0; i < 3; i++) { const ph = mod(t * 1.6 + i / 3, 1); s += `<line x1="${x0 - 20 - ph * 60}" y1="${cy - 30 + i * 30}" x2="${x0 - 60 - ph * 60}" y2="${cy - 30 + i * 30}" stroke="${C.line}" stroke-width="3" stroke-linecap="round" opacity="${(1 - ph).toFixed(2)}"/>`; }
    s += E(t, W('automobile') - 0.1, carTop(cx, cy, SCL, C.line, C.bg));
    s += E(t, W('movimento') - 0.05, arrow(x0 + RW - 150, cy, x0 + RW - 40, cy, C.line, 4) + lbl(x0 + RW - 95, cy + 40, 'MARCIA', { size: 24 }));
    s += E(t, W('12') - 0.05, lbl(cx, 452, '1,2 PERSONE A BORDO (MEDIA)'));
    s += E(t, W('passeggero') - 0.05, lbl(1100, 500, 'PER PASSEGGERO', { a: 'start' }));
    s += E(t, W('movimento') - 0.05, lbl(1100, 545, 'IN MOVIMENTO', { a: 'start' }));
    s += E(t, W('23') - 0.05, T(1094, 712, '23 m²', { f: 'pop', size: 170 }));
    return s + caption(t, W('passeggero'), 'Passeggero in movimento', '');
  } }) });

// ---------- 2 — autobus e metropolitana ----------
scene('busmetro', { make: (W) => ({
  capAt: W('autobus'), hold: [W('02')],
  render(t) {
    const I = C.ink, SCL = SCALE; let s = lightBg();
    // card autobus
    s += E(t, W('autobus') - 0.2, card(150, 180, 750, 660, { rot: -1 }) + busTop(525, 290, 520, 110, I, C.cream) + lbl(525, 390, 'SAGOMA NON IN SCALA', { fill: I, size: 24 }) + lbl(525, 450, 'AUTOBUS', { fill: I }));
    s += E(t, W('60') - 0.05, lbl(525, 494, '60 PASSEGGERI', { fill: I }));
    s += E(t, W('04') - 0.05, refSq(250, 720, SCL, I) + areaSq(360, 720, 0.4, SCL, { c: I, fill: mix(C.cream, I, 0.15) }) + T(450, 712, '0,4 m²', { f: 'pop', size: 96, fill: I }));
    s += E(t, W('04') - 0.05, lbl(220, 812, 'QUADRATI IN SCALA · A PASSEGGERO', { fill: I, a: 'start', size: 24 }));
    // card metropolitana
    s += E(t, W('metropolitana') - 0.2, card(1020, 180, 750, 660, { rot: 1 }) + trainTop(1395, 290, 580, 96, I, C.cream) + lbl(1395, 390, 'SAGOMA NON IN SCALA', { fill: I, size: 24 }) + lbl(1395, 450, 'METROPOLITANA', { fill: I }));
    s += E(t, W('02') - 0.05, refSq(1120, 720, SCL, I) + areaSq(1230, 720, 0.2, SCL, { c: I, fill: mix(C.cream, I, 0.15) }) + T(1310, 712, '0,2 m²', { f: 'pop', size: 96, fill: C.coral }));
    s += E(t, W('02') - 0.05, lbl(1090, 812, 'QUADRATI IN SCALA · A PASSEGGERO', { fill: I, a: 'start', size: 24 }));
    return s + caption(t, W('autobus'), 'Autobus e metropolitana', '', true);
  } }) });

// ---------- 3 — bicicletta e pedone ----------
scene('bicipiedi', { make: (W) => ({
  capAt: W('piedi'), hold: [W('05')],
  render(t) {
    const SCL = SCALE, base = 770; let s = '';
    s += E(t, -0.3, refSq(150, base, SCL, C.line) + lbl(150, 850, 'AREE IN SCALA', { a: 'start', size: 24 }), { dy: 0 });
    // bici: area da 3 a 4 m² (due quadrati annidati)
    s += E(t, W('bicicletta') - 0.1, bikeTop(450 + 70, base - 70, SCL, C.line, C.bg) + lbl(520, 590, 'BICICLETTA'));
    s += E(t, W('3') - 0.05, areaSq(450, base, 3, SCL, { dash: '12 8', sw: 3 }) + areaSq(450, base, 4, SCL));
    s += E(t, W('3') - 0.05, T(650, 750, '3–4 m²', { f: 'pop', size: 110 }));
    // pedone: 0,5 m²
    s += E(t, W('piedi') - 0.1, pedTop(1290 + 25, base - 25, SCL, C.line, C.bg) + lbl(1315, 680, 'A PIEDI'));
    s += E(t, W('05') - 0.05, areaSq(1290, base, 0.5, SCL) + T(1430, 750, '0,5 m²', { f: 'pop', size: 110, fill: C.coral }));
    return s + caption(t, W('piedi'), 'In bicicletta, a piedi', '');
  } }) });

// ---------- 4 — confronto in scala ----------
scene('confronto', { make: (W) => ({
  capAt: W('enormemente'), hold: [W('meno', 2)],
  render(t) {
    const I = C.ink, SCL = SCALE, base = 640; let s = lightBg();
    s += E(t, -0.3, card(110, 170, 1700, 680), { dy: 0 });
    const items = [['AUTO', '23', 300, 23, 1], ['BUS', '0,4', 700, 0.4], ['METRO', '0,2', 790, 0.2], ['BICI', '3–4', 870, 4, 0, 3], ['A PIEDI', '0,5', 1060, 0.5]];
    s += E(t, W('persone') - 0.4, refSq(190, base, SCL, I));
    items.forEach(([n, v, x, m2, coral, inner], i) => {
      const side = Math.sqrt(m2) * SCL;
      let g = areaSq(x, base, m2, SCL, { c: coral ? C.coral : I, sw: coral ? 6 : 4, fill: coral ? 'none' : mix(C.cream, I, 0.12) });
      if (inner) g += areaSq(x, base, inner, SCL, { c: I, sw: 3, dash: '10 7' });
      g += lbl(x + side / 2, base + 50, n, { fill: I, size: 24 }) + lbl(x + side / 2, base + 88, v, { fill: I, size: 24 });
      s += E(t, W('persone') - 0.3 + i * 0.14, g);
    });
    s += E(t, W('persone') + 0.5, lbl(190, 800, 'm² A PASSEGGERO · IN SCALA · VALORI INDICATIVI, DAL TESTO', { fill: I, a: 'start', size: 24 }));
    s += E(t, W('meno', 0) - 0.05, T(1180, 400, 'meno spazio', { f: 'pop', size: 52, fill: I }));
    s += E(t, W('meno', 1) - 0.05, T(1180, 490, 'meno energia', { f: 'pop', size: 52, fill: I }));
    s += E(t, W('meno', 2) - 0.05, T(1180, 580, 'meno inquinamento', { f: 'pop', size: 52, fill: I }));
    return s + caption(t, W('enormemente'), 'Enormemente meno spazio', '', true);
  } }) });

// ---------- 5 — portata: persone all'ora per metro di corsia ----------
scene('portata', { make: (W) => ({
  capAt: W('persone'), hold: [W('10000')],
  render(t) {
    let s = '';
    // corsia in pianta, larga 1 metro: persone che passano
    const y0 = 170, y1 = 270;
    s += E(t, -0.3, `<line x1="300" y1="${y0}" x2="1760" y2="${y0}" stroke="${C.line}" stroke-width="4"/><line x1="300" y1="${y1}" x2="1760" y2="${y1}" stroke="${C.line}" stroke-width="4"/>` +
      `<line x1="1030" y1="${y0}" x2="1030" y2="${y1}" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>` +
      arrow(250, y0 + 50, 250, y0 + 4, C.line, 3) + arrow(250, y0 + 50, 250, y1 - 4, C.line, 3) + T(210, y0 + 60, '1 m', { f: 'mono', size: 26, a: 'end', w: 600 }), { dy: 0 });
    if (t > -0.3) { const r = rng(7); for (let i = 0; i < 14; i++) { const ox = r() * 1460, oy = y0 + 22 + r() * 56, x = 300 + mod(ox + 160 * t, 1460); s += `<circle cx="${x}" cy="${oy}" r="9" fill="${C.line}" opacity="${clamp(Math.min(x - 300, 1760 - x) / 60)}"/>`; } }
    s += E(t, W('persone') - 0.05, lbl(160, 380, 'PERSONE OGNI ORA, PER METRO DI LARGHEZZA DELLA CORSIA', { a: 'start' }));
    // assi
    const X0 = 420, X1 = 1700, k = (X1 - X0) / 20000, ax = 760;
    s += E(t, W('auto') - 0.2, `<line x1="${X0}" y1="${ax}" x2="${X1}" y2="${ax}" stroke="${C.line}" stroke-width="3"/>` +
      [0, 5000, 10000, 15000, 20000].map(v => `<line x1="${X0 + v * k}" y1="${ax}" x2="${X0 + v * k}" y2="${ax + 14}" stroke="${C.line}" stroke-width="3"/>` + T(X0 + v * k, ax + 50, String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), { f: 'mono', size: 24, a: 'middle', w: 600 })).join('') +
      `<line x1="${X0}" y1="440" x2="${X0}" y2="${ax}" stroke="${C.line}" stroke-width="3"/>`, { dy: 0 });
    const bar = (y, lo, hi, t0, col, hatch) => {
      const p = eo((t - t0) / 0.9); if (p <= 0) return '';
      const a = lo * k * p, b = hi * k * p;
      return `<rect x="${X0}" y="${y}" width="${a}" height="56" fill="${col}"/>` + `<rect x="${X0 + a}" y="${y}" width="${b - a}" height="56" fill="url(#${hatch})" stroke="${col}" stroke-width="3"/>`;
    };
    s += E(t, W('auto') - 0.05, lbl(380, 520, 'AUTO', { a: 'end' }), { dy: 0 }) + bar(480, 600, 1200, W('auto'), C.line, 'hatchD');
    s += E(t, W('600') - 0.05, T(X0 + 1200 * k + 30, 527, 'da 600 a 1.200', { f: 'popm', size: 44 }));
    s += E(t, W('metro', 1) - 0.05, lbl(380, 660, 'METRO', { a: 'end' }), { dy: 0 }) + bar(620, 10000, 20000, W('metro', 1), C.coral, 'hatchC');
    s += E(t, W('10000') - 0.05, T(X0 + 10000 * k, 598, 'da 10.000 a 20.000', { f: 'popm', size: 44 }));
    return s + caption(t, W('persone'), 'Persone ogni ora', '');
  } }) });

// ---------- 6 — città dense ----------
scene('citta', { make: (W) => ({
  capAt: W('dense'), hold: [W('ciclabilità')],
  render(t) {
    const I = C.ink; let s = lightBg();
    [['Tokyo', 170, -2], ['Barcellona', 730, 1.5], ['Amsterdam', 1290, -1]].forEach(([n, x, r]) => {
      s += E(t, W(n.toLowerCase()) - 0.15, card(x, 200, 460, 250, { rot: r }) + `<g transform="rotate(${r} ${x + 230} 325)">` +
        T(x + 230, 335, n, { f: 'pop', size: 66, fill: I, a: 'middle' }) + lbl(x + 230, 395, 'CITTÀ DENSA', { fill: I, size: 24 }) + '</g>');
    });
    const pill = (x, w, icon, txt) => `<rect x="${x}" y="590" width="${w}" height="150" rx="75" fill="${C.cream}" stroke="${I}" stroke-width="3"/>` + icon + lbl(x + 280, 678, txt, { fill: I, a: 'start', size: 30 });
    s += E(t, W('trasporto') - 0.05, pill(170, 740, busTop(310, 665, 170, 46, I, C.cream), 'TRASPORTO PUBBLICO'));
    s += E(t, W('ciclabilità') - 0.05, pill(1010, 620, bikeTop(1150, 665, 105, I, C.cream), 'CICLABILITÀ'));
    return s + caption(t, W('dense'), 'Città dense', 'dense', true);
  } }) });

// ---------- 7 — sprawl: la città si espande ----------
const SP = { cx: 1110, cy: 520 };
const blob = (k, th) => k * (1 + 0.16 * Math.sin(3 * th + 1) + 0.09 * Math.sin(5 * th + 2.2));
function frontier(k) {
  let d = ''; for (let i = 0; i <= 120; i++) { const th = i / 120 * Math.PI * 2, r = blob(k, th); d += (i ? 'L' : 'M') + (SP.cx + 1.3 * r * Math.cos(th)).toFixed(1) + ',' + (SP.cy + 0.74 * r * Math.sin(th)).toFixed(1); }
  return d + 'z';
}
const SPRAWL_ITEMS = (() => {
  const r = rng(11), out = [];
  while (out.length < 46) {
    const th = r() * Math.PI * 2, f = 1.25 + r() * 0.85; // f = raggio relativo (1 = nucleo)
    const rr = blob(150 * f, th);
    const x = SP.cx + 1.3 * rr * Math.cos(th), y = SP.cy + 0.74 * rr * Math.sin(th);
    if (out.some(o => Math.hypot(o.x - x, o.y - y) < 46)) continue;
    const u = r(); out.push({ x, y, f, k: u < 0.6 ? 'casa' : u < 0.82 ? 'capannone' : 'parcheggio', a: Math.round(r() * 3) * 15 });
  }
  return out;
})();
function sprawlItem(o, ink) {
  if (o.k === 'casa') return `<rect x="${o.x - 9}" y="${o.y - 9}" width="18" height="18" fill="${C.bg}" stroke="${ink}" stroke-width="2.5"/>`;
  if (o.k === 'capannone') return `<g transform="rotate(${o.a} ${o.x} ${o.y})"><rect x="${o.x - 26}" y="${o.y - 13}" width="52" height="26" fill="${C.bg}" stroke="${ink}" stroke-width="2.5"/><line x1="${o.x - 26}" y1="${o.y}" x2="${o.x + 26}" y2="${o.y}" stroke="${ink}" stroke-width="2"/></g>`;
  let g = `<rect x="${o.x - 24}" y="${o.y - 14}" width="48" height="28" fill="none" stroke="${ink}" stroke-width="2"/>`;
  for (let i = 1; i < 4; i++) g += `<line x1="${o.x - 24 + i * 12}" y1="${o.y - 14}" x2="${o.x - 24 + i * 12}" y2="${o.y + 2}" stroke="${ink}" stroke-width="2"/>`;
  return g;
}
function core(ink) {
  let s = ''; const R = 150;
  for (let gx = -8; gx <= 8; gx++) for (let gy = -5; gy <= 5; gy++) {
    const x = SP.cx + gx * 32, y = SP.cy + gy * 26;
    if (((x - SP.cx) / (1.3 * R)) ** 2 + ((y - SP.cy) / (0.74 * R)) ** 2 > 0.82) continue;
    s += `<rect x="${x - 12}" y="${y - 9}" width="24" height="18" fill="${mix(C.bg, ink, 0.3)}" stroke="${ink}" stroke-width="2"/>`;
  }
  s += `<ellipse cx="${SP.cx}" cy="${SP.cy}" rx="${1.3 * R}" ry="${0.74 * R}" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="10 8"/>`;
  return s;
}
scene('sprawl', { make: (W) => ({
  capAt: W('sprawl'), hold: [W('bassa')],
  render(t) {
    let s = '';
    const p = eio((t - W('espande') + 0.1) / 2.0), k = lerp(150, 330, p);
    // strade radiali che seguono l'espansione
    for (let i = 0; i < 6; i++) {
      const th = i / 6 * Math.PI * 2 + 0.4, r0 = 150, r1 = lerp(150, blob(k, th) * 0.97, 1);
      if (r1 <= r0 + 2) continue;
      s += `<line x1="${SP.cx + 1.3 * r0 * Math.cos(th)}" y1="${SP.cy + 0.74 * r0 * Math.sin(th)}" x2="${SP.cx + 1.3 * r1 * Math.cos(th)}" y2="${SP.cy + 0.74 * r1 * Math.sin(th)}" stroke="${C.line}" stroke-width="5" opacity="0.6"/>`;
    }
    SPRAWL_ITEMS.forEach(o => { const q = clamp((k - 150 * o.f) / 30); if (q > 0) s += `<g opacity="${q.toFixed(3)}" transform="translate(${o.x},${o.y}) scale(${(0.6 + 0.4 * q).toFixed(3)}) translate(${-o.x},${-o.y})">${sprawlItem(o, C.line)}</g>`; });
    s += E(t, -0.3, core(C.line), { dy: 0 });
    s += E(t, W('modello') - 0.1, `<ellipse cx="150" cy="752" rx="36" ry="20" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="10 8"/>` + lbl(206, 762, 'CONFINI STORICI', { a: 'start', size: 24 }));
    if (t > W('espande') - 0.1) s += `<path d="${frontier(k)}" fill="none" stroke="${C.coral}" stroke-width="5" stroke-linejoin="round"/>`;
    // colonna testi
    s += E(t, W('sprawl') - 0.05, T(110, 330, 'sprawl', { f: 'pop', size: 120 }) + lbl(114, 390, 'URBANO', { a: 'start' }));
    s += E(t, W('espande') - 0.05, T(110, 480, 'si espande', { f: 'serif', size: 60, it: true }));
    s += E(t, W('senza') - 0.05, T(110, 545, 'senza controllo', { f: 'serif', size: 60, it: true }));
    s += E(t, W('bassa') - 0.05, lbl(114, 650, 'A BASSA DENSITÀ', { a: 'start' }));
    return s + caption(t, W('sprawl'), 'Sprawl urbano', '');
  } }) });

// ---------- 8 — funzioni separate, solo in auto ----------
const HUB = { x: 960, y: 560, rx: 150, ry: 80 };
const NODES = { V: [380, 360], C: [1540, 360], K: [380, 710], P: [1540, 710] };
function hubPt(n) { const [x, y] = NODES[n], a = Math.atan2(y - HUB.y, x - HUB.x); return [HUB.x + HUB.rx * Math.cos(a), HUB.y + HUB.ry * Math.sin(a)]; }
function nodeEdge(n) { const [x, y] = NODES[n]; return [x + (x < 960 ? 170 : -170), y + (y < 540 ? 30 : -20)]; }
function nodeDraw(n, ink) {
  const [x, y] = NODES[n], f = C.bg; let s = '';
  if (n === 'V') for (let i = 0; i < 6; i++) { const hx = x - 120 + (i % 3) * 100, hy = y - 50 + Math.floor(i / 3) * 80; s += `<rect x="${hx}" y="${hy}" width="44" height="44" fill="${f}" stroke="${ink}" stroke-width="3"/><path d="M${hx},${hy} L${hx + 44},${hy + 44} M${hx + 44},${hy} L${hx},${hy + 44}" stroke="${ink}" stroke-width="2"/>`; }
  if (n === 'C') { s += `<rect x="${x - 150}" y="${y - 70}" width="300" height="80" fill="${f}" stroke="${ink}" stroke-width="3"/>`; for (let i = 0; i < 9; i++) s += `<line x1="${x - 150 + 15 + i * 34}" y1="${y + 30}" x2="${x - 150 + 15 + i * 34}" y2="${y + 66}" stroke="${ink}" stroke-width="2.5"/>`; s += `<line x1="${x - 150}" y1="${y + 66}" x2="${x + 150}" y2="${y + 66}" stroke="${ink}" stroke-width="2.5"/>`; }
  if (n === 'K') for (let i = 0; i < 3; i++) { const yy = y - 70 + i * 50; s += `<rect x="${x - 140}" y="${yy}" width="280" height="38" fill="${f}" stroke="${ink}" stroke-width="3"/><line x1="${x - 140}" y1="${yy + 19}" x2="${x + 140}" y2="${yy + 19}" stroke="${ink}" stroke-width="2"/>`; }
  if (n === 'P') { s += `<rect x="${x - 150}" y="${y - 70}" width="300" height="120" fill="none" stroke="${ink}" stroke-width="3"/><line x1="${x - 150}" y1="${y - 10}" x2="${x + 150}" y2="${y - 10}" stroke="${ink}" stroke-width="2.5"/>`; for (let i = 1; i < 10; i++) s += `<line x1="${x - 150 + i * 30}" y1="${y - 70}" x2="${x - 150 + i * 30}" y2="${y - 34}" stroke="${ink}" stroke-width="2.5"/><line x1="${x - 150 + i * 30}" y1="${y + 14}" x2="${x - 150 + i * 30}" y2="${y + 50}" stroke="${ink}" stroke-width="2.5"/>`; }
  return s;
}
function road(a, b, ink) { return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${ink}" stroke-width="22" stroke-linecap="round"/><line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.bg}" stroke-width="15" stroke-linecap="round"/>`; }
// percorso dell'auto: casa -> anello -> centro commerciale -> anello -> lavoro
function ellArc(a0, a1, n = 24) { const pts = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([HUB.x + HUB.rx * Math.cos(a), HUB.y + HUB.ry * Math.sin(a)]); } return pts; }
const angOf = n => { const [x, y] = NODES[n]; return Math.atan2(y - HUB.y, x - HUB.x); };
const CAR_PATH = [nodeEdge('V'), ...ellArc(angOf('V'), angOf('C')), nodeEdge('C')];
function along(pts, d) {
  for (let i = 1; i < pts.length; i++) { const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (d <= L) { const u = d / L; return [lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u), Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]) * 180 / Math.PI]; } d -= L; }
  const n = pts.length; return [pts[n - 1][0], pts[n - 1][1], Math.atan2(pts[n - 1][1] - pts[n - 2][1], pts[n - 1][0] - pts[n - 2][0]) * 180 / Math.PI];
}
scene('espansione', { make: (W) => ({
  capAt: W('raggiungibile'),
  render(t) {
    const dimL = mix(C.bg, C.line, 0.55); let s = '';
    s += E(t, -0.3, `<ellipse cx="${HUB.x}" cy="${HUB.y}" rx="${HUB.rx}" ry="${HUB.ry}" fill="none" stroke="${dimL}" stroke-width="22"/><ellipse cx="${HUB.x}" cy="${HUB.y}" rx="${HUB.rx}" ry="${HUB.ry}" fill="none" stroke="${C.bg}" stroke-width="15"/>` +
      ['V', 'C', 'K', 'P'].map(n => road(nodeEdge(n), hubPt(n), dimL)).join(''), { dy: 0 });
    [['V', 'villette', 'VILLETTE', 470], ['C', 'centri', 'CENTRI COMMERCIALI', 470], ['K', 'capannoni', 'CAPANNONI', 830], ['P', 'parcheggi', 'PARCHEGGI', 830]].forEach(([n, w, l, ly]) => {
      s += E(t, W(w) - 0.1, nodeDraw(n, C.line) + lbl(NODES[n][0], ly, l));
    });
    s += words(t, W('ogni') - 0.05, 960, 215, 'ogni funzione è separata', { f: 'serif', size: 60, it: true, a: 'middle' });
    // l'auto (unico accento) percorre l'anello
    const t0 = W('raggiungibile') - 0.15;
    if (t > t0) {
      let tot = 0; for (let i = 1; i < CAR_PATH.length; i++) tot += Math.hypot(CAR_PATH[i][0] - CAR_PATH[i - 1][0], CAR_PATH[i][1] - CAR_PATH[i - 1][1]);
      const d = Math.min(tot, (t - t0) * 420), [x, y, a] = along(CAR_PATH, d);
      s += `<g opacity="${clamp((t - t0) / 0.3)}">${carTop(x, y, 13, C.coral, C.bg, a)}</g>`;
    }
    return s + caption(t, W('raggiungibile'), 'Raggiungibile solo in auto', '');
  } }) });

// ---------- 9 — conseguenze ----------
function fieldIcon(cx, cy, ink, bg) {
  let s = `<rect x="${cx - 150}" y="${cy - 100}" width="300" height="200" fill="${bg}" stroke="${ink}" stroke-width="3"/>`;
  for (let i = 0; i < 9; i++) s += `<line x1="${cx - 150 + 18 + i * 33}" y1="${cy - 88}" x2="${cx - 150 + 18 + i * 33}" y2="${cy + 88}" stroke="${ink}" stroke-width="2.5" opacity="0.7"/>`;
  s += `<path d="M${cx + 10},${cy + 100} L${cx + 150},${cy + 100} L${cx + 150},${cy - 20} z" fill="url(#hatchL)" stroke="${ink}" stroke-width="3"/>`;
  s += `<rect x="${cx + 92}" y="${cy + 46}" width="40" height="40" fill="${bg}" stroke="${ink}" stroke-width="3"/>`;
  return s;
}
function busSide(cx, cy, ink, bg, col) {
  let s = `<rect x="${cx - 170}" y="${cy - 70}" width="340" height="130" rx="18" fill="${bg}" stroke="${col}" stroke-width="5"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${cx - 150 + i * 48}" y="${cy - 52}" width="38" height="46" rx="5" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
  [1, 4].forEach(i => s += `<circle cx="${cx - 131 + i * 48}" cy="${cy - 30}" r="9" fill="${ink}"/>`);
  s += `<rect x="${cx + 140}" y="${cy - 52}" width="22" height="80" rx="4" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
  [-105, 105].forEach(dx => s += `<circle cx="${cx + dx}" cy="${cy + 62}" r="22" fill="${bg}" stroke="${ink}" stroke-width="4"/>`);
  return s;
}
scene('conseguenze', { make: (W) => ({
  capAt: W('troppo'),
  render(t) {
    const I = C.ink; let s = lightBg();
    const cardAt = (x, r, inner, l1, l2) => card(x, 210, 480, 560, { rot: r }) + `<g transform="rotate(${r} ${x + 240} 490)">${inner}${lbl(x + 240, 640, l1, { fill: I, size: 26 })}${l2 ? lbl(x + 240, 684, l2, { fill: I, size: 26 }) : ''}</g>`;
    s += E(t, W('occupa') - 0.1, cardAt(140, -1.5, fieldIcon(380, 420, I, C.cream), 'SUOLO AGRICOLO', 'OCCUPATO'));
    s += E(t, W('crea') - 0.1, cardAt(720, 1, carTop(960, 420, 52, I, C.cream), 'DIPENDENZA', "DALL'AUTO"));
    s += E(t, W('rende') - 0.1, cardAt(1300, -1, busSide(1540, 420, I, C.cream, C.coral), 'TRASPORTO PUBBLICO', 'INSOSTENIBILE'));
    return s + caption(t, W('troppo'), 'Troppo poca densità', '', true);
  } }) });

// ---------- 10 — consumo di suolo in Italia ----------
const FIELDS = (() => {
  const r = rng(5), nx = 5, ny = 4, X0 = 160, Y0 = 210, w = 760, h = 560, P = [];
  for (let j = 0; j <= ny; j++) { P.push([]); for (let i = 0; i <= nx; i++) { const ex = i === 0 || i === nx, ey = j === 0 || j === ny; P[j].push([X0 + i * w / nx + (ex ? 0 : (r() - 0.5) * 60), Y0 + j * h / ny + (ey ? 0 : (r() - 0.5) * 50)]); } }
  const out = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) out.push({ q: [P[j][i], P[j][i + 1], P[j + 1][i + 1], P[j + 1][i]], a: Math.round(r() * 3) * 45, ord: (nx - i) + (ny - j) * 0.9 + r() * 0.6 });
  return out;
})();
scene('suolo', { tail: 0.35, make: (W) => ({
  capAt: W('57'), hold: [W('suolo')],
  render(t) {
    let s = '';
    const pv = (t - W('consumano')) / 2.4; // avanzamento del cemento (schema)
    FIELDS.forEach((f, i) => {
      const d = 'M' + f.q.map(p => p.join(',')).join('L') + 'z';
      const cx = f.q.reduce((a, p) => a + p[0], 0) / 4, cy = f.q.reduce((a, p) => a + p[1], 0) / 4;
      const paved = pv * 4.5 > f.ord - 1.2 && f.ord < 4.6;
      let g = `<clipPath id="fc${i}"><path d="${d}"/></clipPath><g clip-path="url(#fc${i})">`;
      if (paved) g += `<path d="${d}" fill="url(#hatchD)" opacity="0.8"/>` + [0, 1].map(k => `<rect x="${cx - 40 + k * 46}" y="${cy - 26 + k * 18}" width="34" height="34" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`).join('');
      else for (let k = -10; k <= 10; k++) { const a = f.a * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), nx2 = -uy, ny2 = ux; g += `<line x1="${cx + nx2 * k * 20 - ux * 300}" y1="${cy + ny2 * k * 20 - uy * 300}" x2="${cx + nx2 * k * 20 + ux * 300}" y2="${cy + ny2 * k * 20 + uy * 300}" stroke="${C.line}" stroke-width="2" opacity="0.45"/>`; }
      g += `</g><path d="${d}" fill="none" stroke="${C.line}" stroke-width="3"/>`;
      s += E(t, -0.3 + i * 0.02, g, { dy: 0 });
    });
    s += E(t, -0.2, lbl(160, 830, 'SCHEMA, NON IN SCALA', { a: 'start', size: 24 }), { dy: 0 });
    s += E(t, W('italia') - 0.05, lbl(1010, 250, 'ITALIA', { a: 'start' }));
    s += E(t, W("l'ispra") - 0.05, lbl(1010, 295, 'FONTE: ISPRA', { a: 'start', size: 24 }));
    s += E(t, W('anno') - 0.05, T(1006, 410, 'ogni anno', { f: 'pop', size: 72 }));
    s += E(t, W('media') - 0.05, lbl(1010, 470, 'IN MEDIA', { a: 'start' }));
    s += E(t, W('57') - 0.05, T(1000, 660, '57 km²', { f: 'pop', size: 180, fill: C.coral }));
    s += E(t, W('suolo') - 0.05, lbl(1010, 745, 'DI SUOLO AGRICOLO', { a: 'start', size: 30 }));
    return s + caption(t, W('57'), '57 km² ogni anno', '');
  } }) });

// ---------- 11 — chiusura ----------
scene('finale', { L: 0.35, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    const I = C.ink; let s = lightBg();
    s += E(t, -0.4, `<line x1="560" y1="200" x2="1360" y2="200" stroke="${I}" stroke-width="3"/><line x1="560" y1="320" x2="1360" y2="320" stroke="${I}" stroke-width="3"/><line x1="560" y1="260" x2="1360" y2="260" stroke="${I}" stroke-width="2" stroke-dasharray="26 20"/>` +
      busTop(800, 290, 300, 46, I, C.cream) + bikeTop(1080, 230, 70, I, C.cream) + pedTop(1250, 230, 80, I, C.cream), { dy: 0 });
    s += E(t, -0.3, T(960, 470, 'Chi occupa lo spazio', { f: 'pop', size: 104, fill: I, a: 'middle' }), { dy: 0 });
    s += words(t, W('le') - 0.05, 960, 580, 'le stesse persone, in molto meno spazio', { f: 'serif', size: 64, fill: I, a: 'middle', it: true, key: 'spazio' });
    s += E(t, W('persone') - 0.05, `<line x1="760" y1="650" x2="1160" y2="650" stroke="${I}" stroke-width="3"/>` + T(960, 710, 'PROFTECNOLOGIA · MC AMB-2-03', { f: 'mono', size: 28, fill: I, a: 'middle', ls: 5, w: 600 }));
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
