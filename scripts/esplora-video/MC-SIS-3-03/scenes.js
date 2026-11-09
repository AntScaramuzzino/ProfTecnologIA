// Il metodo Lean Startup — MC-SIS-3-03. render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.35);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.6);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="#E3CDB4" stop-opacity="0.55"/><stop offset="1" stop-color="#E3CDB4" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const DIM2 = mix(C.bg, C.line, 0.2);
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); };

// ---- icone line-art ----
function bulb(cx, cy, st, sw = 5, k = 1) {
  const r = 62 * k;
  return `<path d="M${cx - 30 * k},${cy + 46 * k} C${cx - 34 * k},${cy + 20 * k} ${cx - r},${cy + 4 * k} ${cx - r},${cy - 30 * k} A${r},${r} 0 1 1 ${cx + r},${cy - 30 * k} C${cx + r},${cy + 4 * k} ${cx + 34 * k},${cy + 20 * k} ${cx + 30 * k},${cy + 46 * k} Z" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>` +
    `<path d="M${cx - 28 * k},${cy + 62 * k} H${cx + 28 * k} M${cx - 22 * k},${cy + 78 * k} H${cx + 22 * k}" stroke="${st}" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<path d="M${cx - 16 * k},${cy + 44 * k} L${cx - 16 * k},${cy - 10 * k} L${cx},${cy - 26 * k} L${cx + 16 * k},${cy - 10 * k} L${cx + 16 * k},${cy + 44 * k}" fill="none" stroke="${st}" stroke-width="${sw * 0.6}" stroke-linejoin="round"/>`;
}
function globe(cx, cy, r, st) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${st}" stroke-width="5"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.45}" ry="${r}" fill="none" stroke="${st}" stroke-width="3"/>` +
    `<path d="M${cx - r},${cy} H${cx + r} M${cx - r * 0.87},${cy - r * 0.5} H${cx + r * 0.87} M${cx - r * 0.87},${cy + r * 0.5} H${cx + r * 0.87}" stroke="${st}" stroke-width="3"/>`;
}
function browser(x, y, w, h, st, o = {}) {
  const sw = o.sw || 4, da = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${o.fill || 'none'}" stroke="${st}" stroke-width="${sw}"${da}/>` +
    `<line x1="${x}" y1="${y + 44}" x2="${x + w}" y2="${y + 44}" stroke="${st}" stroke-width="${sw * 0.7}"${da}/>` +
    [0, 1, 2].map(i => `<circle cx="${x + 26 + i * 24}" cy="${y + 22}" r="7" fill="none" stroke="${st}" stroke-width="2.5"/>`).join('');
}
function hammer(cx, cy, st, k = 1) {
  return `<g transform="translate(${cx},${cy}) rotate(-35) scale(${k})"><rect x="-8" y="-20" width="16" height="78" rx="4" fill="none" stroke="${st}" stroke-width="5"/>` +
    `<path d="M-40,-46 H34 L42,-36 V-22 H-40 Z" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round"/></g>`;
}
function bars(cx, cy, st, k = 1) {
  return `<g transform="translate(${cx},${cy}) scale(${k})"><path d="M-46,-50 V40 H50" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round"/>` +
    `<rect x="-30" y="0" width="18" height="40" fill="none" stroke="${st}" stroke-width="4"/><rect x="-4" y="-22" width="18" height="62" fill="none" stroke="${st}" stroke-width="4"/><rect x="22" y="-44" width="18" height="84" fill="none" stroke="${st}" stroke-width="4"/></g>`;
}
function cross(cx, cy, r, st, p, sw = 9) {
  const a = clamp(p * 2), b = clamp(p * 2 - 1);
  if (a <= 0) return '';
  let s = `<line x1="${cx - r}" y1="${cy - r}" x2="${cx - r + 2 * r * a}" y2="${cy - r + 2 * r * a}" stroke="${st}" stroke-width="${sw}" stroke-linecap="round"/>`;
  if (b > 0) s += `<line x1="${cx + r}" y1="${cy - r}" x2="${cx + r - 2 * r * b}" y2="${cy - r + 2 * r * b}" stroke="${st}" stroke-width="${sw}" stroke-linecap="round"/>`;
  return s;
}
function check(cx, cy, st, p, k = 1) {
  const a = clamp(p); if (a <= 0) return '';
  const L1 = Math.hypot(30, 32), L2 = Math.hypot(58, 68), d = a * (L1 + L2);
  let path = `M${cx - 40 * k},${cy}`;
  if (d <= L1) path += ` L${cx - 40 * k + 30 * k * d / L1},${cy + 32 * k * d / L1}`;
  else path += ` L${cx - 10 * k},${cy + 32 * k} L${cx - 10 * k + 58 * k * (d - L1) / L2},${cy + 32 * k - 68 * k * (d - L1) / L2}`;
  return `<path d="${path}" fill="none" stroke="${st}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// linea che si disegna (lunghezza nota)
function drawPath(d, len, p, st, sw = 5, extra = '') {
  if (p <= 0) return '';
  return `<path d="${d}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${len}" stroke-dashoffset="${(len * (1 - clamp(p))).toFixed(1)}"${extra}/>`;
}
function arrowHead(x, y, ang, c, h = 20) {
  return `<path d="M${x},${y} L${x - h * Math.cos(ang - 0.45)},${y - h * Math.sin(ang - 0.45)} L${x - h * Math.cos(ang + 0.45)},${y - h * Math.sin(ang + 0.45)} z" fill="${c}"/>`;
}
// fotografia line-art di una stanza (letto + finestra), dentro un riquadro
function photo(x, y, w, h, st, v = 0) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${st}" stroke-width="3.5"/>`;
  if (v === 0) s += `<rect x="${x + w * 0.58}" y="${y + h * 0.16}" width="${w * 0.26}" height="${h * 0.3}" fill="none" stroke="${st}" stroke-width="2.5"/><path d="M${x + w * 0.12},${y + h * 0.82} V${y + h * 0.58} H${x + w * 0.62} V${y + h * 0.82} M${x + w * 0.12},${y + h * 0.66} H${x + w * 0.62}" fill="none" stroke="${st}" stroke-width="3"/>`;
  if (v === 1) s += `<path d="M${x + w * 0.15},${y + h * 0.84} V${y + h * 0.56} H${x + w * 0.5} V${y + h * 0.84} M${x + w * 0.68},${y + h * 0.84} V${y + h * 0.2} M${x + w * 0.6},${y + h * 0.2} H${x + w * 0.76}" fill="none" stroke="${st}" stroke-width="3"/><circle cx="${x + w * 0.68}" cy="${y + h * 0.32}" r="${h * 0.1}" fill="none" stroke="${st}" stroke-width="2.5"/>`;
  if (v === 3) s += `<path d="M${x + w * 0.08},${y + h * 0.84} L${x + w * 0.38},${y + h * 0.42} L${x + w * 0.56},${y + h * 0.66} L${x + w * 0.7},${y + h * 0.5} L${x + w * 0.92},${y + h * 0.84}" fill="none" stroke="${st}" stroke-width="3" stroke-linejoin="round"/><circle cx="${x + w * 0.76}" cy="${y + h * 0.26}" r="${h * 0.1}" fill="none" stroke="${st}" stroke-width="2.5"/>`;
  if (v === 4) s += `<circle cx="${x + w * 0.5}" cy="${y + h * 0.38}" r="${h * 0.15}" fill="none" stroke="${st}" stroke-width="3"/><path d="M${x + w * 0.28},${y + h * 0.9} C${x + w * 0.28},${y + h * 0.62} ${x + w * 0.72},${y + h * 0.62} ${x + w * 0.72},${y + h * 0.9}" fill="none" stroke="${st}" stroke-width="3"/>`;
  if (v === 5) s += book(x + w / 2, y + h / 2 + 4, st, h / 140, 3);
  if (v === 2) s += `<path d="M${x + w * 0.1},${y + h * 0.8} H${x + w * 0.9} M${x + w * 0.25},${y + h * 0.8} V${y + h * 0.5} H${x + w * 0.75} V${y + h * 0.8} M${x + w * 0.25},${y + h * 0.5} L${x + w * 0.5},${y + h * 0.22} L${x + w * 0.75},${y + h * 0.5}" fill="none" stroke="${st}" stroke-width="3" stroke-linejoin="round"/>`;
  return s;
}

function book(cx, cy, st, k = 1, sw = 5) {
  const p = (x, y) => `${(cx + x * k).toFixed(1)},${(cy + y * k).toFixed(1)}`;
  return `<path d="M${p(0, -34)} C${p(-20, -46)} ${p(-50, -46)} ${p(-64, -38)} L${p(-64, 40)} C${p(-50, 32)} ${p(-20, 32)} ${p(0, 44)} C${p(20, 32)} ${p(50, 32)} ${p(64, 40)} L${p(64, -38)} C${p(50, -46)} ${p(20, -46)} ${p(0, -34)} Z M${p(0, -34)} L${p(0, 44)}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>` +
    `<path d="M${p(-50, -18)} L${p(-14, -14)} M${p(-50, 2)} L${p(-14, 6)} M${p(14, -14)} L${p(50, -18)} M${p(14, 6)} L${p(50, 2)}" stroke="${st}" stroke-width="${sw * 0.6}" stroke-linecap="round"/>`;
}
function student(cx, cy, st) {
  return `<circle cx="${cx}" cy="${cy - 70}" r="38" fill="none" stroke="${st}" stroke-width="5"/>` +
    `<path d="M${cx - 70},${cy + 60} C${cx - 70},${cy - 10} ${cx - 40},${cy - 22} ${cx},${cy - 22} C${cx + 40},${cy - 22} ${cx + 70},${cy - 10} ${cx + 70},${cy + 60}" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
}
// ---- 1 — aggancio: hai un'idea, funziona davvero? ----
scene('hook', { make: (W) => ({
  capAt: W('nel'), last: W('mondo'),
  render(t) {
    let s = words(t, 0.1, 960, 230, "Hai un'idea.", { f: 'serif', it: true, size: 76, a: 'middle' });
    s += E(t, W("un'idea") - 0.1, bulb(640, 520, C.line, 6, 1.5), { dy: 14 });
    s += E(t, W('funziona') - 0.1, T(860, 580, '?', { f: 'pop', size: 220, fill: C.coral, a: 'middle' }), { dy: 14 });
    const pa = ss((t - W('provi') + 0.1) / 0.6);
    if (pa > 0) s += `<line x1="960" y1="520" x2="${960 + 300 * pa}" y2="520" stroke="${C.line}" stroke-width="5" stroke-linecap="round" stroke-dasharray="14 12"/>` + (pa > 0.95 ? arrowHead(1270, 520, 0, C.line) : '');
    s += E(t, W('mondo') - 0.15, globe(1420, 520, 120, C.line) + lbl(1420, 720, 'MONDO REALE'), { dy: 12 });
    s += E(t, W('non') - 0.1, IT(960, 840, 'Non lo sai finché non la provi.', { a: 'middle', size: 50 }), { dy: 8 });
    return s + caption(t, W('nel'), 'Nel mondo reale', '');
  } }) });

// ---- 2 — il metodo (registro chiaro) ----
scene('lean', { make: (W) => ({
  capAt: W('minimo'), last: W('spreco'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 160, 1520, 660), { dy: 0 });
    s += E(t, W('metodo') - 0.1, lbl(960, 260, 'IL METODO', { fill: C.ink, size: 28 }), { dy: 6 });
    s += E(t, W('lìin') - 0.1, T(960, 380, 'Lean Startup', { f: 'pop', size: 110, a: 'middle', fill: C.ink }), { dy: 12 });
    s += E(t, W('lìin') + 0.5, IT(960, 450, 'lean = snello, senza sprechi', { a: 'middle', size: 48, fill: C.ink }), { dy: 8 });
    s += E(t, W('imprese') - 0.1, pillTag(700, 560, 'NUOVE IMPRESE', C.ink, C.cream, 'middle'), { dy: 8 });
    s += E(t, W('prodotti') - 0.1, pillTag(1220, 560, 'NUOVI PRODOTTI', C.ink, C.cream, 'middle'), { dy: 8 });
    s += E(t, W('minimo') - 0.1, T(960, 700, 'minimo spreco di risorse', { f: 'pop', size: 72, a: 'middle', fill: C.coralD }), { dy: 10 });
    return s + caption(t, W('minimo'), 'Minimo spreco di risorse', '', true);
  } }) });

// ---- 3 — prima il prodotto minimo ----
function bigApp(x, y, st, dash) {
  let s = browser(x, y, 620, 520, st, { dash, sw: 3.5 });
  const cells = [[30, 70, 270, 150], [320, 70, 270, 150], [30, 240, 170, 120], [220, 240, 170, 120], [410, 240, 180, 120], [30, 380, 360, 110], [410, 380, 180, 110]];
  cells.forEach(([a, b, w, h]) => { s += `<rect x="${x + a}" y="${y + b}" width="${w}" height="${h}" rx="8" fill="none" stroke="${st}" stroke-width="3" stroke-dasharray="${dash}"/>`; });
  return s;
}
scene('minimo', { make: (W) => ({
  capAt: W('costruisci'), last: W('rischiose'),
  render(t) {
    // DOPO (a destra): prodotto completo, entra con la prima parola
    let s = E(t, W('prima') - 0.05, bigApp(1120, 220, C.line, '12 10') + lbl(1430, 800, 'PRODOTTO COMPLETO'), { dy: 12 });
    s += E(t, W('completo') - 0.1, pillTag(1430, 190, 'DOPO', C.line, C.bg, 'middle'), { dy: 6 });
    // PRIMA (a sinistra): prodotto minimo, una pagina sola, corallo
    s += E(t, W('minimo') - 0.15, browser(270, 330, 300, 360, C.coral, { sw: 5 }) +
      `<rect x="300" y="400" width="240" height="110" rx="8" fill="none" stroke="${C.line}" stroke-width="3.5"/><path d="M300,550 H540 M300,590 H470 M300,630 H510" stroke="${C.line}" stroke-width="3.5" stroke-linecap="round"/>` +
      lbl(420, 750, 'PRODOTTO MINIMO'), { dy: 12 });
    s += E(t, W('costruisci') - 0.1, pillTag(420, 290, 'PRIMA', C.line, C.bg, 'middle'), { dy: 6 });
    // freccia del tempo: prima -> dopo
    const pa = ss((t - W('minimo') - 0.3) / 0.6);
    if (pa > 0) s += `<line x1="640" y1="510" x2="${640 + 400 * pa}" y2="510" stroke="${C.line}" stroke-width="5" stroke-linecap="round" stroke-dasharray="14 12"/>` + (pa > 0.95 ? arrowHead(1060, 510, 0, C.line) : '');
    s += E(t, W('testare') - 0.1, lbl(420, 810, 'TESTA LE IPOTESI') + lbl(420, 850, 'PIÙ RISCHIOSE'), { dy: 6 });
    return s + caption(t, W('costruisci'), 'Prima il prodotto minimo', '');
  } }) });

// ---- 4 — il ciclo: costruisci, misura, impara ----
const CY = { cx: 960, cy: 520, r: 250 };
const NODES = [
  { a: -90, ic: 'b', it: 'COSTRUISCI', en: 'BUILD', lx: 1070, ly: 196, an: 'start' },
  { a: 30, ic: 'm', it: 'MISURA', en: 'MEASURE', lx: 1310, ly: 680, an: 'start' },
  { a: 150, ic: 'l', it: 'IMPARA', en: 'LEARN', lx: 610, ly: 680, an: 'end' },
];
const nodeXY = n => [CY.cx + CY.r * Math.cos(n.a * Math.PI / 180), CY.cy + CY.r * Math.sin(n.a * Math.PI / 180)];
function nodeIcon(n, st) {
  const [x, y] = nodeXY(n);
  return `<circle cx="${x}" cy="${y}" r="82" fill="${C.bg}" stroke="${st}" stroke-width="5"/>` +
    (n.ic === 'b' ? hammer(x + 4, y + 8, st, 0.9) : n.ic === 'm' ? bars(x + 2, y + 4, st, 0.85) : book(x, y + 2, st, 0.8, 4.5));
}
function arcSeg(a0, a1, p, st) {
  // arco sul cerchio da a0 ad a1 (gradi, orario), escluse le zone dei nodi
  const g0 = a0 + 24, g1 = a1 - 24, g = g0 + (g1 - g0) * clamp(p);
  if (p <= 0) return '';
  const pt = a => [CY.cx + CY.r * Math.cos(a * Math.PI / 180), CY.cy + CY.r * Math.sin(a * Math.PI / 180)];
  const [x0, y0] = pt(g0), [x1, y1] = pt(g);
  let s = `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${CY.r},${CY.r} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
  if (p > 0.97) s += arrowHead(x1, y1, (g + 90) * Math.PI / 180, st, 24);
  return s;
}
function cycleDiagram(t, at, tok) {
  // at: istanti di comparsa dei 3 nodi; tok: t da cui parte il gettone corallo (o null)
  let s = '';
  NODES.forEach((n, i) => {
    s += E(t, at[i], nodeIcon(n, C.line) +
      T(n.lx, n.ly, n.it, { f: 'pop', size: 46, a: n.an, fill: C.line }) +
      T(n.lx, n.ly + 42, n.en, { f: 'mono', size: 28, a: n.an, fill: C.line, ls: 3, w: 600 }), { dy: 12 });
  });
  s += arcSeg(-90, 30, (t - at[1] + 0.3) / 0.5, C.line);
  s += arcSeg(30, 150, (t - at[2] + 0.3) / 0.4, C.line);
  s += arcSeg(150, 270, (t - at[2] + 0.3) / 0.4, C.line);
  if (tok != null && t > tok) {
    const a = (-90 + (t - tok) * 75) * Math.PI / 180;
    s += `<circle cx="${(CY.cx + CY.r * Math.cos(a)).toFixed(1)}" cy="${(CY.cy + CY.r * Math.sin(a)).toFixed(1)}" r="16" fill="${C.coral}" opacity="${clamp((t - tok) / 0.3)}"/>`;
  }
  return s;
}
scene('ciclo', { make: (W) => ({
  capAt: W('costruisci'), last: W('impara') + 0.2,
  render(t) {
    let s = E(t, 0.1, T(960, 535, 'tre fasi', { f: 'serif', it: true, size: 64, a: 'middle', fill: C.line }), { dy: 8 });
    s += cycleDiagram(t, [W('costruisci') - 0.1, W('misura') - 0.1, W('impara') - 0.1], W('impara') + 0.4);
    return s + caption(t, W('costruisci'), 'Costruisci, misura, impara', '');
  } }) });

// ---- 5 — l'MVP (registro chiaro) ----
function sketchPage(x, y, t, t0, ink) {
  // pagina abbozzata: linee un po' storte, non perfetta
  let s = `<path d="M${x},${y + 6} L${x + 420},${y} L${x + 424},${y + 470} L${x + 4},${y + 476} Z" fill="${C.cream}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="M${x + 30},${y + 50} L${x + 300},${y + 46}" stroke="${ink}" stroke-width="10" stroke-linecap="round"/>`;
  s += `<path d="M${x + 30},${y + 100} L${x + 392},${y + 96} L${x + 394},${y + 250} L${x + 32},${y + 254} Z" fill="none" stroke="${ink}" stroke-width="3.5"/>`;
  s += `<path d="M${x + 32},${y + 102} L${x + 392},${y + 248} M${x + 392},${y + 98} L${x + 34},${y + 252}" stroke="${ink}" stroke-width="2" opacity="0.6"/>`;
  [300, 340, 380].forEach((yy, i) => { s += `<path d="M${x + 30},${y + yy} L${x + 390 - i * 60},${y + yy - 3}" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`; });
  s += `<path d="M${x + 30},${y + 420} L${x + 170},${y + 418} L${x + 172},${y + 452} L${x + 32},${y + 454} Z" fill="none" stroke="${ink}" stroke-width="3.5"/>`;
  return s;
}
scene('mvp', { make: (W) => ({
  capAt: W('versione'), last: W('chiave'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(160, 150, 1600, 690), { dy: 0 });
    s += E(t, W("l'emmevuppì") - 0.1, T(250, 360, 'MVP', { f: 'pop', size: 170, fill: C.coralD }), { dy: 14 });
    s += E(t, W("l'emmevuppì") + 0.3, lbl(254, 424, 'MINIMUM VIABLE PRODUCT', { a: 'start', fill: C.ink, size: 28 }), { dy: 6 });
    s += E(t, W('versione') - 0.1, IT(254, 520, 'la versione più semplice', { size: 58, fill: C.ink }) + IT(254, 584, 'possibile del prodotto', { size: 58, fill: C.ink }), { dy: 8 });
    s += E(t, W('perfetto') - 0.15, T(254, 690, 'perfetto', { f: 'popm', size: 48, fill: C.ink }) + T(254, 690, 'NON DEVE ESSERE', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 600 }).replace('y="690"', 'y="640"'), { dy: 6 });
    const ps = ss((t - W('perfetto') - 0.3) / 0.4);
    if (ps > 0) s += `<line x1="250" y1="674" x2="${250 + 200 * ps}" y2="674" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
    s += E(t, W('testare') - 0.1, T(254, 770, 'TESTA LE IPOTESI CHIAVE', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 }), { dy: 6 });
    s += E(t, W('versione') - 0.1, sketchPage(1180, 260, t, 0, C.ink), { dy: 12 });
    s += check(1580, 780, C.ink, (t - W('chiave') + 0.1) / 0.5, 0.8);
    return s + caption(t, W('versione'), 'La versione più semplice', '', true);
  } }) });

// ---- 6 — l'esempio: una sola pagina web ----
const GH = [['PAGAMENTI', 'pagamenti'], ['MAPPE', 'mappe'], ['RECENSIONI', 'recensioni']];
function ghostIcon(i, x, y, st) {
  if (i === 0) return `<rect x="${x - 56}" y="${y - 36}" width="112" height="72" rx="10" fill="none" stroke="${st}" stroke-width="4" stroke-dasharray="10 8"/><line x1="${x - 56}" y1="${y - 12}" x2="${x + 56}" y2="${y - 12}" stroke="${st}" stroke-width="4" stroke-dasharray="10 8"/>`;
  if (i === 1) return `<path d="M${x - 60},${y - 30} L${x - 20},${y - 42} L${x + 20},${y - 30} L${x + 60},${y - 42} V${y + 34} L${x + 20},${y + 46} L${x - 20},${y + 34} L${x - 60},${y + 46} Z M${x - 20},${y - 42} V${y + 34} M${x + 20},${y - 30} V${y + 46}" fill="none" stroke="${st}" stroke-width="4" stroke-dasharray="10 8" stroke-linejoin="round"/>`;
  let s = '';
  for (let k = 0; k < 3; k++) { const cx = x - 44 + k * 44; s += `<path d="M${cx},${y - 22} L${cx + 7},${y - 7} L${cx + 23},${y - 6} L${cx + 11},${y + 5} L${cx + 15},${y + 21} L${cx},${y + 12} L${cx - 15},${y + 21} L${cx - 11},${y + 5} L${cx - 23},${y - 6} L${cx - 7},${y - 7} Z" fill="none" stroke="${st}" stroke-width="3.5" stroke-dasharray="8 6" stroke-linejoin="round"/>`; }
  return s;
}
scene('esempio', { make: (W) => ({
  capAt: W('semplice'), last: W('davvero'),
  render(t) {
    let s = E(t, 0.05, IT(140, 172, 'Esempio inventato', { size: 56 }), { dy: 8 });
    s += E(t, 0.15, pillTag(1690, 214, 'ESEMPIO', C.line, C.bg, 'middle'), { dy: 6 });
    const tP = W('pagina') - 0.15;
    if (t < tP) {  // pittogramma: ripetizioni fra studenti
      s += E(t, W('ripetizioni') - 0.15, student(760, 470, C.line) + student(1160, 470, C.line) +
        `<path d="M600,560 H1320" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>` + book(960, 500, C.line, 0.9, 4.5) +
        lbl(960, 680, 'RIPETIZIONI FRA STUDENTI'), { dy: 12 });
    } else {
      s += E(t, tP, browser(140, 240, 760, 560, C.line, { sw: 5 }) + lbl(520, 222, 'UNA PAGINA WEB'), { dy: 12 });
      [3, 4, 5].forEach((v, i) => { s += E(t, W('foto') - 0.15 + i * 0.15, photo(172 + i * 240, 310, 216, 150, C.line, v), { dy: 10 }); });
      s += E(t, W('foto') + 0.2, lbl(520, 508, 'QUALCHE FOTO'), { dy: 6 });
      s += E(t, W('modulo') - 0.15,
        `<rect x="172" y="556" width="440" height="50" rx="8" fill="none" stroke="${C.line}" stroke-width="3.5"/><rect x="172" y="622" width="440" height="50" rx="8" fill="none" stroke="${C.line}" stroke-width="3.5"/>` +
        `<rect x="172" y="694" width="180" height="56" rx="28" fill="${C.line}"/><path d="M246,708 L292,722 L246,736 Z" fill="${C.bg}"/>` +
        lbl(756, 640, 'MODULO', {}) + lbl(756, 680, 'DI CONTATTO', {}), { dy: 10 });
    }
    // funzioni assenti
    s += E(t, W('senza') - 0.15, lbl(1010, 268, 'SENZA:', { a: 'start' }), { dy: 6 });
    GH.forEach(([lab, w], i) => {
      const x = 1110 + i * 280, y = 360, t0 = W(w) - 0.15;
      s += E(t, t0, ghostIcon(i, x, y, C.line) + lbl(x, y + 96, lab), { dy: 8 });
      s += cross(x, y, 56, C.line, (t - t0 - 0.25) / 0.45, 8);
    });
    // l'ipotesi che la pagina deve testare (unico elemento corallo)
    s += E(t, W('ipotesi') - 0.15, `<rect x="1000" y="540" width="790" height="250" rx="18" fill="none" stroke="${C.coral}" stroke-width="5"/>` +
      lbl(1395, 610, 'IPOTESI DA TESTARE'), { dy: 10 });
    s += E(t, W('qualcuno') - 0.1, IT(1395, 712, 'Qualcuno pagherà davvero?', { size: 62, a: 'middle' }), { dy: 8 });
    return s + caption(t, W('semplice'), 'Una semplice pagina web', '');
  } }) });

// ---- 8 — misura (dashboard, dati di esempio) ----
function panel(x, y, w, h, q1, q2, kind, t, t0) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" stroke="${C.line}" stroke-width="4"/>`;
  s += T(x + w / 2, y + 62, q1, { f: 'popm', size: 34, a: 'middle', fill: C.line }) + T(x + w / 2, y + 106, q2, { f: 'popm', size: 34, a: 'middle', fill: C.line });
  const p = ss((t - t0 - 0.3) / 0.9), bx = x + 50, by = y + h - 50, bw = w - 100, bh = h - 220;
  s += `<path d="M${bx},${by - bh} V${by} H${bx + bw}" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  if (kind === 'line') {
    const pts = [0.15, 0.3, 0.28, 0.5, 0.62, 0.78].map((v, i) => [bx + 20 + i * (bw - 40) / 5, by - v * bh]);
    const n = Math.max(1, Math.ceil(p * (pts.length - 1)));
    if (p > 0) s += `<path d="M${pts.slice(0, n + 1).map(q => q.join(',')).join(' L')}" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
  } else if (kind === 'bars') {
    [0.8, 0.45].forEach((v, i) => { const hh = v * bh * p; s += `<rect x="${bx + 50 + i * 150}" y="${by - hh}" width="90" height="${hh}" fill="${C.line}"/>`; });
    if (p > 0.6) s += lbl(bx + 95, by + 36, '1° USO', { size: 28 }) + lbl(bx + 245, by + 36, 'RITORNO', { size: 28 });
  } else {
    const cx = x + w / 2, cy = by - 10, r = bh * 0.85;
    s += `<path d="M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}" fill="none" stroke="${C.line}" stroke-width="5"/>`;
    const a = Math.PI * (1 - 0.62 * p);
    s += `<line x1="${cx}" y1="${cy}" x2="${(cx + r * 0.85 * Math.cos(a)).toFixed(1)}" y2="${(cy - r * 0.85 * Math.sin(a)).toFixed(1)}" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="10" fill="${C.line}"/>`;
  }
  return s;
}
scene('misura', { make: (W) => ({
  capAt: W('misuri'), last: W('pagare'),
  render(t) {
    let s = E(t, 0.05, bars(250, 210, C.line, 0.7) + T(330, 230, 'Misura', { f: 'pop', size: 64, fill: C.line }), { dy: 8 });
    s += E(t, 0.3, pillTag(1690, 214, 'ESEMPIO', C.line, C.bg, 'middle'), { dy: 6 });
    const P3 = [['quante persone', 'lo usano?', 'line', 'quante'], ['tornano dopo', 'il primo uso?', 'bars', 'tornano'], ['quanto sono', 'disposte a pagare?', 'gauge', 'quanto']];
    P3.forEach(([a, b, k, w], i) => { const t0 = W(w) - 0.15; s += E(t, t0, panel(170 + i * 540, 300, 500, 500, a, b, k, t, t0), { dy: 12 }); });
    return s + caption(t, W('misuri'), 'Misura cosa succede', 'Misura');
  } }) });

// ---- 9 — metriche collegate alle ipotesi (registro chiaro) ----
scene('metriche', { make: (W) => ({
  capAt: W('collegate'), last: W('testando'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 150, 1520, 680), { dy: 0 });
    s += E(t, W('ipotesi') - 0.1, lbl(520, 250, 'IPOTESI', { fill: C.ink }), { dy: 6 });
    s += E(t, W('metriche') - 0.1, lbl(1400, 250, 'METRICA', { fill: C.ink }), { dy: 6 });
    s += E(t, 0.1, pillTag(960, 790, 'ESEMPIO', C.ink, C.cream, 'middle'), { dy: 6 });
    const R = [['La gente lo userà', 'quante persone lo usano'], ['Le persone torneranno', 'chi torna dopo il primo uso'], ['Qualcuno pagherà', 'quanto sono disposte a pagare']];
    R.forEach(([h, m], i) => {
      const y = 340 + i * 140;
      s += E(t, W('ipotesi') - 0.1 + i * 0.12, `<rect x="290" y="${y - 50}" width="460" height="84" rx="14" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>` + IT(520, y + 8, h, { a: 'middle', size: 44, fill: C.ink }), { dy: 8 });
      s += E(t, W('metriche') - 0.1 + i * 0.12, `<rect x="1110" y="${y - 50}" width="580" height="84" rx="14" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>` + T(1400, y + 4, m, { f: 'popm', size: 32, a: 'middle', fill: C.ink }), { dy: 8 });
      const p = ss((t - W('collegate') - i * 0.15) / 0.45);
      if (p > 0) s += `<line x1="1104" y1="${y - 8}" x2="${1104 - 346 * p}" y2="${y - 8}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` + (p > 0.95 ? arrowHead(756, y - 8, Math.PI, C.ink) : '');
    });
    return s + caption(t, W('collegate'), 'Metriche legate alle ipotesi', '', true);
  } }) });

// ---- 10 — impara: scala, pivot o stop ----
scene('impara', { make: (W) => ({
  capAt: W('pìvot'), last: W('stop'),
  render(t) {
    const cx = 470, cy = 500;
    let s = E(t, 0.05, book(236, 228, C.line, 0.75, 4.5) + T(300, 250, 'Impara', { f: 'pop', size: 64, fill: C.line }), { dy: 8 });
    s += E(t, W("l'ipotesi") - 0.15, `<path d="M${cx},${cy - 110} L${cx + 140},${cy} L${cx},${cy + 110} L${cx - 140},${cy} Z" fill="${C.bg}" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>` + T(cx, cy + 12, "L'IPOTESI", { f: 'mono', size: 30, a: 'middle', fill: C.line, ls: 3, w: 700 }), { dy: 10 });
    // ramo giusta -> scala
    const p1 = ss((t - W('giusta') + 0.05) / 0.5);
    s += drawPath(`M${cx + 140},${cy} C${cx + 300},${cy} ${cx + 320},300 ${cx + 520},300 L1060,300`, 640, p1, C.line, 5);
    s += E(t, W('giusta') - 0.1, lbl(cx + 300, 360 - 120, 'GIUSTA', { a: 'start' }), { dy: 6 });
    s += E(t, W('scala') - 0.15, T(1100, 318, 'SCALA', { f: 'pop', size: 58, fill: C.line }) + IT(1100, 370, 'investi di più', { size: 44 }) +
      `<path d="M1440,330 L1500,270 L1540,290 L1610,210" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>` + arrowHead(1622, 196, -0.85, C.line), { dy: 8 });
    // ramo sbagliata -> pivot / stop
    const p2 = ss((t - W('sbagliata') + 0.05) / 0.5);
    s += drawPath(`M${cx},${cy + 110} C${cx},${cy + 200} ${cx + 120},640 ${cx + 300},640`, 360, p2, C.line, 5);
    s += E(t, W('sbagliata') - 0.1, lbl(cx + 30, 690 + 20, 'SBAGLIATA', { a: 'start' }), { dy: 6 });
    const p3 = ss((t - W('pìvot') + 0.05) / 0.5);
    s += drawPath(`M${cx + 300},640 C${cx + 420},640 ${cx + 440},520 ${cx + 600},520 L1060,520`, 340, p3, C.coral, 6);
    s += E(t, W('pìvot') - 0.15, T(1100, 538, 'PIVOT', { f: 'pop', size: 58, fill: C.coral }) + IT(1100, 590, 'cambia direzione', { size: 44 }), { dy: 8 });
    // il ciclo ricomincia: dal pivot di nuovo a Costruisci
    const pr = ss((t - W('cambia') + 0.05) / 0.5);
    if (pr > 0) s += `<line x1="1420" y1="524" x2="${1420 + 140 * pr}" y2="524" stroke="${C.line}" stroke-width="3.5" stroke-linecap="round"/>` + (pr > 0.95 ? arrowHead(1580, 524, 0, C.line, 18) : '');
    s += E(t, W('cambia') + 0.3, `<circle cx="1680" cy="520" r="62" fill="none" stroke="${C.line}" stroke-width="4"/>` + hammer(1683, 527, C.line, 0.68) +
      lbl(1680, 626, 'DI NUOVO:') + lbl(1680, 662, 'COSTRUISCI'), { dy: 8 });
    const p4 = ss((t - W('oppure') + 0.05) / 0.5);
    s += drawPath(`M${cx + 300},640 C${cx + 420},640 ${cx + 440},760 ${cx + 600},760 L1060,760`, 340, p4, C.line, 5);
    s += E(t, W('stop') - 0.15, T(1100, 778, 'STOP', { f: 'pop', size: 58, fill: C.line }) + IT(1100, 830, 'abbandona', { size: 44 }) +
      `<rect x="1330" y="732" width="180" height="40" rx="6" fill="none" stroke="${C.line}" stroke-width="5"/><path d="M1350,732 L1380,772 M1400,732 L1430,772 M1450,732 L1480,772" stroke="${C.line}" stroke-width="4"/><path d="M1360,772 V820 M1480,772 V820" stroke="${C.line}" stroke-width="5"/>`, { dy: 8 });
    return s + caption(t, W('pìvot'), 'Scala, pivot o stop', '');
  } }) });

// ---- 11 — il pivot: un aggiornamento della mappa (registro chiaro) ----
scene('pivot', { make: (W) => ({
  capAt: W('aggiornamento'), last: W('mappa'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(160, 150, 1600, 690), { dy: 0 });
    s += E(t, W('pìvot') - 0.1, T(250, 300, 'Pivot', { f: 'pop', size: 110, fill: C.ink }), { dy: 12 });
    s += E(t, W('cambiamento') - 0.1, IT(254, 380, 'un cambiamento strategico', { size: 50, fill: C.ink }), { dy: 8 });
    s += E(t, W('basato') - 0.1, T(254, 450, 'BASATO SUI DATI', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 }), { dy: 6 });
    s += E(t, W('fallimento') - 0.15, T(254, 580, 'NON UN', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 600 }) + T(254, 640, 'fallimento', { f: 'popm', size: 50, fill: C.ink }), { dy: 6 });
    const pf = ss((t - W('fallimento') - 0.3) / 0.4);
    if (pf > 0) s += `<line x1="250" y1="622" x2="${250 + 250 * pf}" y2="622" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
    s += E(t, W('aggiornamento') - 0.15, T(254, 730, 'MA UN AGGIORNAMENTO', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 600 }) + T(254, 790, 'della mappa', { f: 'popm', size: 50, fill: C.ink }), { dy: 6 });
    // mappa a destra
    const mx = 900, my = 230;
    s += E(t, 0.05, `<path d="M${mx},${my + 30} L${mx + 260},${my} L${mx + 520},${my + 30} L${mx + 780},${my} V${my + 560} L${mx + 520},${my + 590} L${mx + 260},${my + 560} L${mx},${my + 590} Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M${mx + 260},${my} V${my + 560} M${mx + 520},${my + 30} V${my + 590}" stroke="${C.ink}" stroke-width="2" opacity="0.5"/>` +
      `<circle cx="${mx + 110}" cy="${my + 470}" r="16" fill="${C.ink}"/>` + T(mx + 110, my + 530, 'PARTENZA', { f: 'mono', size: 26, fill: C.ink, ls: 2, w: 600, a: 'middle' }), { dy: 0 });
    // vecchia rotta tratteggiata verso una X
    s += `<circle cx="1171" cy="591" r="9" fill="${C.ink}" opacity="${clamp((t - W('aggiornamento')) / 0.3)}"/>`;
    s += E(t, W('pìvot'), `<path d="M${mx + 110},${my + 470} C${mx + 250},${my + 380} ${mx + 380},${my + 300} ${mx + 470},${my + 140}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-dasharray="12 10"/>`, { dy: 0 });
    s += cross(mx + 480, my + 120, 26, C.ink, (t - W('dati') + 0.1) / 0.4, 7);
    // nuova rotta (corallo, unica)
    const pn = ss((t - W('aggiornamento') + 0.05) / 0.8);
    s += drawPath(`M1171,591 C1260,600 1420,620 1556,526`, 440, pn, C.coral, 7);
    s += E(t, W('aggiornamento') + 0.6, `<path d="M${mx + 660},${my + 296} V${my + 210} L${mx + 720},${my + 232} L${mx + 660},${my + 254}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>` + T(mx + 660, my + 158, 'NUOVA', { f: 'mono', size: 26, fill: C.ink, ls: 2, w: 600, a: 'middle' }) + T(mx + 660, my + 192, 'DIREZIONE', { f: 'mono', size: 26, fill: C.ink, ls: 2, w: 600, a: 'middle' }), { dy: 6 });
    return s + caption(t, W('aggiornamento'), 'Un aggiornamento della mappa', '', true);
  } }) });

// ---- 12 — cartello finale ----
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Costruisci, misura, impara', { f: 'pop', size: 100, a: 'middle', fill: C.ink }), { dy: 0 });
    s += words(t, W('il') - 0.1, 960, 550, 'Il metodo Lean Startup.', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: '' });
    s += E(t, W('stàrtap'), `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC SIS-3-03', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
