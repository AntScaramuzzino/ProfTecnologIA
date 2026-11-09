// Dal ferro all'acciaio — MC-MAT-1-05 §"Il ferro e le sue trasformazioni: ghisa, ferro e acciaio". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d'%]/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const PAT = mix(C.bg, C.line, 0.62), PATL = mix(C.cream, C.ink, 0.55);
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<pattern id="hatchD" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="22" stroke="${mix(C.bg, C.line, 0.30)}" stroke-width="3"/></pattern>
<pattern id="hatchL" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="22" stroke="${mix(C.cream, C.ink, 0.35)}" stroke-width="3"/></pattern>
<pattern id="pOre" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="3.6" fill="${PAT}"/><circle cx="17" cy="16" r="3.6" fill="${PAT}"/></pattern>
<pattern id="pCoke" width="34" height="30" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="7" fill="none" stroke="${PAT}" stroke-width="2.6"/><circle cx="26" cy="23" r="7" fill="none" stroke="${PAT}" stroke-width="2.6"/></pattern>
<pattern id="pLime" width="44" height="22" patternUnits="userSpaceOnUse"><path d="M0,0.5 H44 M0,11 H44 M11,0 V11 M33,11 V22" stroke="${PAT}" stroke-width="2.6" fill="none"/></pattern>
<clipPath id="shaft"><polygon points="-100,180 -220,520 -170,630 -170,800 170,800 170,630 220,520 100,180"/></clipPath></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 50, fill: o.fill || C.line, a: o.a || 'start' });
const lblI = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.ink, ls: 3, a: o.a || 'middle', w: 700 });
function tag(x, y, s, o = {}) {
  const size = o.size || 26, w = tw(s, 'mono', size) + 3 * s.length + 28, a = o.a || 'middle';
  const x0 = a === 'middle' ? x - w / 2 : a === 'end' ? x - w : x;
  return `<rect x="${x0}" y="${y - size - 8}" width="${w}" height="${size + 22}" rx="6" fill="${o.bg || C.bg}" stroke="${o.stroke || (o.bg ? 'none' : C.line)}" stroke-width="2"/>` +
    T(x0 + w / 2, y, s, { f: 'mono', size, fill: o.fill || C.line, a: 'middle', ls: 3, w: 700 });
}
const ln = (x1, y1, x2, y2, c, sw = 3) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`;

// ---- atomi di ferro (reticolo in sezione) ----
function lattice(cx, cy, nx, ny, sp, r, st, o = {}) {
  let g = '';
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x = cx + (i - (nx - 1) / 2) * sp, y = cy + (j - (ny - 1) / 2) * sp;
    g += `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.fill || 'none'}" stroke="${st}" stroke-width="3.5"/>` + T(x, y + 9, 'Fe', { f: 'mono', size: 26, fill: st, a: 'middle', w: 700 });
  }
  return g;
}
// ---- icone a filo ----
function fork(cx, cy, s, st) {
  return `<g transform="translate(${cx},${cy}) scale(${s})" fill="none" stroke="${st}" stroke-width="${5 / s}" stroke-linejoin="round" stroke-linecap="round">` +
    `<path d="M-6,140 C-10,60 -8,20 -14,-10 H14 C8,20 10,60 6,140 Z"/><path d="M-30,-130 V-40 C-30,-18 -16,-10 0,-10 C16,-10 30,-18 30,-40 V-130"/><path d="M-10,-130 V-40 M10,-130 V-40"/></g>`;
}
function ibeam(cx, cy, s, st) {
  return `<g transform="translate(${cx},${cy}) scale(${s})"><path d="M-80,-100 H80 V-74 H14 V74 H80 V100 H-80 V74 H-14 V-74 H-80 Z" fill="none" stroke="${st}" stroke-width="${5 / s}" stroke-linejoin="round"/></g>`;
}
function nail(cx, cy, s, st) {
  return `<g transform="translate(${cx},${cy}) scale(${s}) rotate(18)"><path d="M-40,-120 H40 V-104 H8 V100 L0,128 L-8,100 V-104 H-40 Z" fill="none" stroke="${st}" stroke-width="${5 / s}" stroke-linejoin="round"/></g>`;
}
function knife(cx, cy, s, st) {
  return `<g transform="translate(${cx},${cy}) scale(${s}) rotate(-30)" fill="none" stroke="${st}" stroke-width="${5 / s}" stroke-linejoin="round"><path d="M-20,-130 C10,-110 20,-40 20,10 H-20 Z"/><rect x="-22" y="10" width="44" height="110" rx="14"/><circle cx="0" cy="45" r="5" fill="${st}"/><circle cx="0" cy="85" r="5" fill="${st}"/></g>`;
}
function car(cx, cy, s, st) {
  return `<g transform="translate(${cx},${cy}) scale(${s})" fill="none" stroke="${st}" stroke-width="${5 / s}" stroke-linejoin="round"><path d="M-110,20 V-10 L-80,-20 L-50,-60 H40 L80,-20 L110,-12 V20 Z"/><path d="M-40,-50 L-62,-20 H-2 V-50 Z M12,-50 V-20 H62 L40,-50 Z"/><circle cx="-60" cy="22" r="20" fill="${C.cream}"/><circle cx="62" cy="22" r="20" fill="${C.cream}"/></g>`;
}
function warn(cx, cy, s, st, bg) {
  return `<g transform="translate(${cx},${cy}) scale(${s})"><path d="M0,-60 L64,52 H-64 Z" fill="${bg}" stroke="${st}" stroke-width="${6 / s}" stroke-linejoin="round"/><path d="M0,-22 V18" stroke="${st}" stroke-width="${9 / s}" stroke-linecap="round"/><circle cx="0" cy="36" r="${5.5 / s}" fill="${st}"/></g>`;
}
// ---- prova di flessione: barra su due appoggi, carico al centro ----
function bendTest(cx, cy, w, o) {
  const st = o.st, h = 36, x0 = cx - w / 2 - 50, x1 = cx + w / 2 + 50, a = cx - w / 2, b = cx + w / 2;
  let g = '';
  [a, b].forEach(x => g += `<path d="M${x},${cy + h / 2} L${x - 30},${cy + h / 2 + 52} H${x + 30} Z" fill="none" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`);
  g += ln(cx - w / 2 - 90, cy + h / 2 + 52, cx + w / 2 + 90, cy + h / 2 + 52, st, 4);
  const fill = o.fill || 'none';
  if (o.broken != null) {
    const ang = 9 * o.broken, y0 = cy - h / 2, y1 = cy + h / 2;
    const jag = side => { const s = side; return `L${cx - 3 * s},${y0} L${cx + 7 * s},${y0 + 9} L${cx - 5 * s},${y0 + 18} L${cx + 6 * s},${y0 + 27} L${cx - 2 * s},${y1}`; };
    const left = `M${x0},${y0} ${jag(1)} L${x0},${y1} Z`, right = `M${x1},${y0} ${jag(-1).replace(/L/g, ' L')} L${x1},${y1} Z`;
    const cr = o.crack || st;
    g += `<g transform="rotate(${ang} ${a} ${y1})"><path d="${left}" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/><path d="M${cx - 3},${y0} L${cx + 7},${y0 + 9} L${cx - 5},${y0 + 18} L${cx + 6},${y0 + 27} L${cx - 2},${y1}" fill="none" stroke="${cr}" stroke-width="${o.crack ? 7 : 4}" stroke-linejoin="round"/></g>`;
    g += `<g transform="rotate(${-ang} ${b} ${y1})"><path d="${right}" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/><path d="M${cx + 3},${y0} L${cx - 7},${y0 + 9} L${cx + 5},${y0 + 18} L${cx - 6},${y0 + 27} L${cx + 2},${y1}" fill="none" stroke="${cr}" stroke-width="${o.crack ? 7 : 4}" stroke-linejoin="round"/></g>`;
  } else {
    const s = o.sag || 0, y0 = cy - h / 2, y1 = cy + h / 2;
    g += `<path d="M${x0},${y0 + s * 0.15} Q${cx},${y0 + 2 * s} ${x1},${y0 + s * 0.15} L${x1},${y1 + s * 0.15} Q${cx},${y1 + 2 * s} ${x0},${y1 + s * 0.15} Z" fill="${o.barFill || fill}" stroke="${o.barSt || st}" stroke-width="${o.barSt ? 6 : 4}" stroke-linejoin="round"/>`;
  }
  const dy = o.broken != null ? 30 * o.broken : (o.sag || 0);
  if (o.load) g += arrow(cx, cy - 170 + dy, cx, cy - h / 2 - 8 + dy, st, 5);
  return g;
}

// ---- altoforno in sezione (coordinate locali, asse x = 0) ----
const INN = [[-100, 180], [-220, 520], [-170, 630], [-170, 800], [170, 800], [170, 630], [220, 520], [100, 180]];
const OUT = [[-134, 180], [-256, 520], [-204, 630], [-204, 834], [204, 834], [204, 630], [256, 520], [134, 180]];
const P = a => a.map(p => p.join(',')).join(' ');
function furnace(t, o = {}) {
  const st = C.line; let g = '';
  // refrattario (parete) tratteggiato
  g += `<path d="M${P(OUT).replace(/ /g, ' L')} Z M${P(INN).replace(/ /g, ' L')} Z" fill="url(#hatchD)" fill-rule="evenodd"/>`;
  g += `<polyline points="${P(OUT)}" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  g += `<polyline points="${P(INN)}" fill="none" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
  g += ln(-134, 180, -100, 180, st, 5) + ln(100, 180, 134, 180, st, 5);
  // tramoggia di carico
  g += `<path d="M-160,108 L-58,178 M160,108 L58,178" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
  // strati della carica che scendono lentamente
  if (o.layers !== false) {
    const off = ((o.flow || 0) * 16) % 132, ids = ['pOre', 'pCoke', 'pLime']; let b = '';
    for (let k = -4; k < 10; k++) {
      const y = 186 + k * 44 + off, ya = Math.max(186, y), yb = Math.min(590, y + 44);
      if (yb <= ya) continue;
      const id = ids[((k % 3) + 3) % 3];
      b += `<rect x="-230" y="${ya}" width="460" height="${yb - ya}" fill="url(#${id})"/>` + (y > 186 ? ln(-230, y, 230, y, PAT, 2) : '');
    }
    g += `<g clip-path="url(#shaft)" opacity="${o.layerOp ?? 1}">${b}</g>`;
  }
  // ugelli dell'aria
  [-1, 1].forEach(s => g += `<rect x="${s > 0 ? 204 : -290}" y="626" width="86" height="28" fill="${C.bg}" stroke="${st}" stroke-width="4"/>`);
  if (o.air) [-1, 1].forEach(s => g += `<g opacity="${o.air}">${arrow(s * 430, 640, s * 214, 640, st, 6)}</g>`);
  // gocce di ferro fuso
  if (o.drops != null && o.drops > 0) {
    for (let j = 0; j < 9; j++) {
      const ph = (hsh(j + 3) + o.drops * 0.75) % 1, x = (hsh(j + 40) * 2 - 1) * 130, y = 600 + ph * (o.slag ? 96 : 150);
      const op = clamp(o.drops * 2 - j * 0.12) * clamp((1 - ph) * 5);
      if (op > 0.02) g += `<path d="M${x.toFixed(1)},${(y - 18).toFixed(1)} C${x + 9},${y - 4} ${x + 9},${y + 8} ${x},${y + 8} C${x - 9},${y + 8} ${x - 9},${y - 4} ${x},${y - 18} Z" fill="${st}" opacity="${op.toFixed(3)}"/>`;
    }
  }
  // scoria e ferro fuso sul fondo
  const pool = o.pool || 0, ph = 56 * pool, top = 800 - ph;
  if (o.slag) {
    const sp = o.slag, sy = top - 40 * sp;
    let wv = `M-170,${sy}`; for (let x = -170; x <= 170; x += 17) wv += ` L${x},${(sy + Math.sin(x / 14 + t * 2) * 4).toFixed(1)}`;
    g += `<rect x="-168" y="${sy}" width="336" height="${top - sy}" fill="url(#hatchD)" opacity="${sp}"/><path d="${wv}" fill="none" stroke="${st}" stroke-width="4" opacity="${sp}"/>`;
  }
  if (pool > 0) g += `<rect x="-168" y="${top}" width="336" height="${ph - 2}" fill="${o.poolCol || C.coral}"/>` + ln(-170, top, 170, top, o.poolCol === 'none' ? st : (o.poolCol || C.coral), 4);
  return g;
}
const FT = (FX, s, y0) => `translate(${FX},${y0}) scale(${s})`;

// 1 — non è ferro puro: è una lega
scene('intro', { make: (W) => ({
  capAt: W('sempre'), last: W('lega'),
  render(t) {
    let s = '';
    s += words(t, W('ferro') - 0.15, 96, 290, 'Il ferro di ogni giorno', { f: 'pop', size: 84 });
    s += E(t, W('usiamo') - 0.1, fork(1150, 560, 1.15, C.line), { dy: 18 });
    s += E(t, W('ogni') - 0.1, ibeam(1450, 560, 1.15, C.line), { dy: 18 });
    s += E(t, W('giorno') - 0.1, nail(1720, 560, 1.15, C.line), { dy: 18 });
    s += E(t, W('puro') - 0.1, IT(100, 380, 'non è ferro puro', { size: 56 }));
    s += E(t, W('sempre') - 0.1, `<path d="M1020,730 v24 H1820 v-24" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linejoin="round"/>` + ln(1420, 754, 1420, 778, C.coral, 7), { dy: 8 });
    s += E(t, W('lega') - 0.1, tag(1420, 832, "LEGHE DEL FERRO", { size: 28 }), { dy: 8 });
    return s + caption(t, W('sempre'), 'Sempre una lega', '');
  } }) });

// 2 — ferro puro: serve a poco (registro chiaro)
scene('puro', { make: (W) => ({
  capAt: W('poco'), last: W('struttura'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += E(t, -0.3, lblI(240, 232, 'FERRO PURO', { a: 'start' }), { dy: 0 });
    s += E(t, W('ferro') - 0.2, lattice(520, 530, 4, 4, 96, 36, ink), { dy: 12 });
    const row = (y, tt, icon, l1, l2) => E(t, tt, icon + T(1150, l2 ? y - 6 : y + 16, l1, { f: 'pop', size: 50, fill: ink }) + (l2 ? T(1150, y + 52, l2, { f: 'pop', size: 50, fill: ink }) : ''), { dy: 14 });
    // morbido: barretta che cede sotto un pesetto
    s += row(330, W('morbido') - 0.1, `<path d="M930,330 Q1010,372 1090,330 v20 Q1010,392 930,350 Z" fill="none" stroke="${ink}" stroke-width="4"/><rect x="988" y="${300}" width="44" height="40" rx="4" fill="${C.ivory}" stroke="${ink}" stroke-width="4"/>`, 'Morbido');
    // arrugginisce: barra con macchie
    s += row(500, W('arrugginisce') - 0.1, `<rect x="930" y="470" width="160" height="44" rx="6" fill="none" stroke="${ink}" stroke-width="4"/>` +
      [[960, 485, 9], [1000, 500, 12], [1045, 482, 8], [1070, 503, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#hatchL)" stroke="${ink}" stroke-width="3"/>`).join(''), 'Arrugginisce in fretta');
    // non regge: trave con X
    s += row(690, W('regge') - 0.1, ibeam(1010, 690, 0.42, ink) + ln(950, 640, 1070, 740, ink, 7) + ln(1070, 640, 950, 740, ink, 7), 'Non regge quasi', 'nessuna struttura');
    return s + caption(t, W('poco'), 'Ferro puro: serve poco', 'poco', true);
  } }) });

// 3 — lega: altri elementi in proporzioni controllate
scene('lega', { make: (W) => ({
  capAt: W('ghisa'), last: W('acciaio'),
  render(t) {
    let s = E(t, -0.4, lattice(640, 520, 5, 4, 120, 40, C.line), { dy: 0 });
    // altri atomi inseriti tra quelli del ferro
    const spots = [[0, 0], [2, 1], [3, 0], [1, 2], [3, 2], [0, 1]];
    spots.forEach(([i, j], k) => {
      const x = 640 + (i - 2) * 120 + 60, y = 520 + (j - 1.5) * 120 + 60;
      s += pop(t, W('mescoliamo') + k * 0.12, x, y, `<circle cx="${x}" cy="${y}" r="16" fill="${C.line}"/>`);
    });
    s += E(t, W('altri') - 0.1, ln(1000, 620, 1110, 620, C.line, 3) + tag(1120, 632, 'ALTRI ELEMENTI', { a: 'start' }), { dy: 8 });
    s += E(t, W('proporzioni') - 0.1, IT(1120, 730, 'in proporzioni controllate', { size: 52 }), { dy: 8 });
    s += E(t, W('leghe') - 0.1, IT(1120, 260, 'le due leghe principali', { size: 52 }) + `<path d="M1150,300 h-30 v230 h30" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linejoin="round"/>`, { dy: 8 });
    s += E(t, W('ghisa') - 0.1, T(1180, 390, 'Ghisa', { f: 'pop', size: 72 }), { dy: 10 });
    s += E(t, W('acciaio') - 0.1, T(1180, 500, 'Acciaio', { f: 'pop', size: 72 }), { dy: 10 });
    return s + caption(t, W('ghisa'), 'Ghisa e acciaio', '');
  } }) });

// 4 — l'altoforno: alto fino a 60 m
scene('altoforno', { make: (W) => ({
  capAt: W('alto'), last: W('metri'),
  render(t) {
    const FX = 1180, sc = 0.9, Y0 = 70;
    let s = E(t, W("nell'altoforno") - 0.25, `<g transform="${FT(FX, sc, Y0)}">${furnace(t, { flow: t, pool: 1, poolCol: 'url(#hatchD)' })}</g>`, { dy: 0 });
    s += words(t, W("nell'altoforno") - 0.1, 96, 300, 'Altoforno', { f: 'pop', size: 96 });
    s += E(t, W('impianto') - 0.1, IT(100, 385, 'un impianto industriale', { size: 56 }));
    const top = Y0 + 108 * sc, bot = Y0 + 834 * sc, X = FX - 380, p = eo((t - W('alto') + 0.1) / 0.7);
    if (p > 0) {
      const yb = lerp(top, bot, p);
      s += ln(X - 30, top, X + 30, top, C.coral, 5) + ln(X, top, X, yb, C.coral, 6) + (p > 0.98 ? ln(X - 30, bot, X + 30, bot, C.coral, 5) : '');
      s += ln(X + 30, top, FX - 150, top, C.lineDim, 2) + ln(X + 30, bot, FX - 190, bot, C.lineDim, 2);
    }
    s += E(t, W('60') - 0.1, tag(X, (top + bot) / 2 + 14, 'FINO A 60 M', { size: 30 }), { dy: 8 });
    return s + caption(t, W('alto'), 'Alto fino a 60 m', '');
  } }) });

// 5 — la carica dall'alto, l'aria dal basso
const FX2 = 820, SC2 = 0.9, Y2 = 70, G = (x, y) => [FX2 + x * SC2, Y2 + y * SC2];
scene('carica', { make: (W) => ({
  capAt: W('caricano'), last: W('compressa'),
  render(t) {
    let s = '';
    const [hx, hy] = G(165, 104);
    s += `<g transform="${FT(FX2, SC2, Y2)}">${furnace(t, { flow: t, air: clamp((t - W('soffia') + 0.1) / 0.4) })}</g>`;
    // nastro inclinato verso la bocca
    s += ln(hx + 10, hy + 6, 1560, 800, C.line, 5) + ln(hx + 24, hy + 30, 1560, 830, C.line, 5);
    const p = eo((t - W("dall'alto") + 0.1) / 0.6);
    if (p > 0) { const ax = lerp(1480, hx + 70, p), ay = lerp(740, hy + 52, p); s += `<g opacity="${clamp(p * 2)}">${arrow(1500, 760 - 40, ax, ay - 34, C.coral, 8)}</g>`; }
    const sw = (x, y, id) => `<rect x="${x}" y="${y - 36}" width="64" height="48" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><rect x="${x}" y="${y - 36}" width="64" height="48" fill="url(#${id})"/>`;
    s += E(t, W('minerale') - 0.1, sw(1380, 300, 'pOre') + T(1466, 300, 'MINERALE DI FERRO', { f: 'mono', size: 28, w: 700, ls: 2 }), { dy: 8 });
    s += E(t, W('coke') - 0.1, sw(1380, 390, 'pCoke') + T(1466, 390, 'COKE', { f: 'mono', size: 28, w: 700, ls: 2 }), { dy: 8 });
    s += E(t, W('calcare') - 0.1, sw(1380, 480, 'pLime') + T(1466, 480, 'CALCARE', { f: 'mono', size: 28, w: 700, ls: 2 }), { dy: 8 });
    const [ax, ay] = G(-330, 640);
    s += E(t, W('soffia') - 0.1, tag(ax - 40, ay + 86, 'ARIA COMPRESSA'), { dy: 8 });
    s += E(t, W('basso') - 0.1, T(96, 300, 'Dal basso', { f: 'pop', size: 64 }), { dy: 10 });
    s += E(t, W("dall'alto") - 0.1, T(96, 210, 'Dall’alto', { f: 'pop', size: 64 }), { dy: 10 });
    return s + caption(t, W('caricano'), 'Carica dall’alto', '');
  } }) });

// 6 — fino a 1.500 °C: ferro fuso sul fondo, scoria sopra
scene('cola', { make: (W) => ({
  capAt: W('1500gradi'), last: W('scoria'),
  render(t) {
    const pool = eo((t - W('raccoglie') + 0.1) / 1.0), slag = eo((t - W('scoria') + 0.1) / 0.6);
    let s = `<g transform="${FT(FX2, SC2, Y2)}">${furnace(t, { flow: t, air: 1, drops: t > W('fuso') - 0.1 ? t - W('fuso') + 0.1 : 0, pool, slag: slag > 0 ? slag : 0 })}</g>`;
    const [bx, by] = G(190, 470);
    s += E(t, W('1500gradi') - 0.1, ln(bx, by, 1300, 420, C.line, 3) + tag(1310, 432, 'FINO A 1.500 °C', { a: 'start', size: 30 }), { dy: 8 });
    const [px, py] = G(150, 775);
    s += E(t, W('raccoglie') - 0.1, ln(px, py, 1300, py, C.line, 3) + tag(1310, py + 12, 'FERRO FUSO', { a: 'start' }), { dy: 8 });
    const [qx, qy] = G(-150, 735);
    s += E(t, W('scoria') - 0.1, ln(qx, qy, 400, qy, C.line, 3) + tag(390, qy + 12, 'SCORIA', { a: 'end' }), { dy: 8 });
    s += E(t, W('fuso') - 0.1, IT(100, 300, 'il ferro fuso', { size: 56 }) + IT(100, 370, 'scivola in basso', { size: 56 }), { dy: 8 });
    return s + caption(t, W('1500gradi'), 'Fino a 1.500 °C', '');
  } }) });

// scala del carbonio (0 → 5 %), condivisa da ghisa e acciaio
const SX0 = 820, SK = 168, sx = v => SX0 + v * SK;
function cAxis(ink, y) {
  let g = ln(SX0, y, SX0 + 5 * SK + 30, y, ink, 4) + `<path d="M${SX0 + 5 * SK + 44},${y} l-18,-10 v20 z" fill="${ink}"/>`;
  for (let v = 0; v <= 5; v++) g += ln(sx(v), y - 10, sx(v), y + 10, ink, 3);
  return g + T(SX0, y + 46, '0', { f: 'mono', size: 26, fill: ink, a: 'middle', w: 700 });
}
function ingot(cx, cy, ink) {
  return `<path d="M${cx - 170},${cy + 60} L${cx - 130},${cy - 30} H${cx + 150} L${cx + 190},${cy + 60} Z" fill="url(#hatchL)" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M${cx - 130},${cy - 30} L${cx - 100},${cy - 70} H${cx + 180} L${cx + 150},${cy - 30} M${cx + 180},${cy - 70} L${cx + 220},${cy + 20} L${cx + 190},${cy + 60}" fill="none" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>`;
}

// 7 — la ghisa: carbonio tra 2 e 4,5 % (registro chiaro)
scene('ghisa', { make: (W) => ({
  capAt: W('2'), last: W('45%'),
  render(t) {
    const ink = C.ink, Y = 640;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += E(t, W('ghisa') - 0.15, ingot(440, 520, ink) + tag(440, 680, 'GHISA', { bg: C.ivory, fill: ink, stroke: ink }), { dy: 12 });
    s += E(t, W('ferro') - 0.1, IT(SX0, 300, 'ferro + carbonio', { size: 58, fill: ink }), { dy: 8 });
    s += E(t, W('percentuale') - 0.1, cAxis(ink, Y) + lblI(SX0, 400, 'PERCENTUALE DI CARBONIO', { a: 'start' }), { dy: 0 });
    const p = eo((t - W('2')) / Math.max(0.5, W('45%') - W('2') + 0.2));
    if (t > W('2') - 0.1) {
      const xe = lerp(sx(2), sx(4.5), p);
      s += `<rect x="${sx(2)}" y="${Y - 70}" width="${Math.max(6, xe - sx(2))}" height="56" fill="${C.coral}" stroke="${ink}" stroke-width="3"/>`;
    }
    s += E(t, W('2') - 0.1, ln(sx(2), Y - 80, sx(2), Y + 10, ink, 3) + T(sx(2), Y - 100, '2%', { f: 'pop', size: 60, fill: ink, a: 'middle' }), { dy: 8 });
    s += E(t, W('45%') - 0.1, ln(sx(4.5), Y - 80, sx(4.5), Y + 10, ink, 3) + T(sx(4.5), Y - 100, '4,5%', { f: 'pop', size: 60, fill: ink, a: 'middle' }), { dy: 8 });
    return s + caption(t, W('2'), 'Carbonio: 2–4,5%', '', true);
  } }) });

// 8 — dura ma fragile: regge il peso, poi si spezza di colpo
scene('fragile', { make: (W) => ({
  capAt: W('fragile'), last: W('segnali'),
  render(t) {
    let s = '';
    // compressione: colonna di ghisa che regge il peso
    s += E(t, -0.4, `<rect x="330" y="420" width="160" height="300" fill="url(#hatchD)" stroke="${C.line}" stroke-width="5"/>` + ln(240, 722, 580, 722, C.line, 5) + T(410, 380, 'GHISA', { f: 'mono', size: 28, w: 700, ls: 3, a: 'middle' }), { dy: 0 });
    s += E(t, W('peso') - 0.15, [350, 410, 470].map(x => arrow(x, 250, x, 340, C.line, 5)).join('') + tag(410, 790, 'REGGE IL PESO'), { dy: 10 });
    s += E(t, W('dura') - 0.1, T(96, 230, 'Dura', { f: 'pop', size: 72 }), { dy: 10 });
    // flessione: si spezza senza piegarsi
    const br = t > W('spezza') - 0.05 ? eo((t - W('spezza') + 0.05) / 0.18) : null;
    s += E(t, W('fragile') - 0.2, bendTest(1270, 540, 640, { st: C.line, fill: 'url(#hatchD)', load: true, broken: br, crack: br != null ? C.coral : null }), { dy: 0 });
    s += E(t, W('fragile') - 0.1, T(1270, 250, 'Fragile', { f: 'pop', size: 72, a: 'middle' }), { dy: 10 });
    s += E(t, W('deforma') - 0.1, tag(1270, 720, 'NON SI DEFORMA'), { dy: 8 });
    s += E(t, W('spezza') - 0.05, tag(1270, 800, 'SI SPEZZA DI COLPO'), { dy: 8 });
    return s + caption(t, W('fragile'), 'Dura ma fragile', '');
  } }) });

// 9 — acciaio: meno carbonio, tra 0,02 e 2 % (registro chiaro)
scene('acciaio', { make: (W) => ({
  capAt: W('riduciamo'), last: W("l'acciaio"),
  render(t) {
    const ink = C.ink, Y = 760, yG = 400, yA = 580;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += E(t, -0.3, lblI(240, 232, 'PERCENTUALE DI CARBONIO', { a: 'start' }) + cAxis(ink, Y) +
      `<rect x="${sx(2)}" y="${yG - 28}" width="${sx(4.5) - sx(2)}" height="56" fill="url(#hatchL)" stroke="${ink}" stroke-width="3"/>` +
      T(sx(2), yG - 50, '2%', { f: 'pop', size: 48, fill: ink, a: 'middle' }) + T(sx(4.5), yG - 50, '4,5%', { f: 'pop', size: 48, fill: ink, a: 'middle' }) +
      T(760, yG + 14, 'GHISA', { f: 'mono', size: 30, fill: ink, a: 'end', w: 700, ls: 3 }) +
      `<line x1="${sx(2)}" y1="${yG + 28}" x2="${sx(2)}" y2="${Y}" stroke="${ink}" stroke-width="2" stroke-dasharray="8 8"/>` +
      `<line x1="${sx(4.5)}" y1="${yG + 28}" x2="${sx(4.5)}" y2="${Y}" stroke="${ink}" stroke-width="2" stroke-dasharray="8 8"/>`, { dy: 0 });
    s += E(t, W('riduciamo') - 0.1, arrow(sx(3.7), yG + 90, sx(2.6), yG + 90, ink, 5) + lblI(sx(3.9), yG + 99, 'MENO CARBONIO', { a: 'start' }), { dy: 0 });
    const p = eo((t - W('002')) / Math.max(0.5, W('2%') - W('002') + 0.3));
    if (t > W('002') - 0.1) {
      const xe = lerp(sx(0.02), sx(2), p);
      s += `<rect x="${sx(0.02)}" y="${yA - 28}" width="${Math.max(6, xe - sx(0.02))}" height="56" fill="${C.coral}" stroke="${ink}" stroke-width="3"/>`;
    }
    s += E(t, W('002') - 0.1, T(sx(0.02), yA + 90, '0,02%', { f: 'pop', size: 48, fill: ink, a: 'middle' }), { dy: 8 });
    s += E(t, W('2%') - 0.1, T(sx(2), yA + 90, '2%', { f: 'pop', size: 48, fill: ink, a: 'middle' }), { dy: 8 });
    s += E(t, W("l'acciaio") - 0.1, T(760, yA + 14, 'ACCIAIO', { f: 'mono', size: 30, fill: ink, a: 'end', w: 700, ls: 3 }), { dy: 8 });
    return s + caption(t, W('riduciamo'), 'Meno carbonio: acciaio', '', true);
  } }) });

// 10 — acciaio dolce: si deforma prima di rompersi
scene('duttile', { make: (W) => ({
  capAt: W('segnale'), last: W('prezioso'),
  render(t) {
    const sag = 70 * eio((t - W('si') + 0.1) / Math.max(0.6, W('visibile') - W('si') + 0.5));
    let s = E(t, -0.4, bendTest(520, 520, 460, { st: C.lineDim, fill: 'url(#hatchD)', load: true, broken: 1 }) + T(520, 260, 'GHISA', { f: 'mono', size: 30, w: 700, ls: 3, a: 'middle' }), { dy: 0 });
    s += E(t, -0.3, bendTest(1330, 520, 560, { st: C.line, barSt: C.coral, barFill: C.bg, load: true, sag }) + T(1330, 260, 'ACCIAIO DOLCE', { f: 'mono', size: 30, w: 700, ls: 3, a: 'middle' }), { dy: 0 });
    s += E(t, W('deforma') - 0.1, tag(1330, 720, 'SI DEFORMA'), { dy: 8 });
    s += E(t, W('rompersi') - 0.1, T(1330, 340, 'prima di rompersi', { f: 'serif', it: true, size: 52, a: 'middle' }), { dy: 8 });
    s += pop(t, W('segnale') - 0.1, 1330, 810, warn(1330, 810, 0.75, C.line, C.bg));
    return s + caption(t, W('segnale'), 'Un segnale d’allarme', '');
  } }) });

// 11 — una famiglia di acciai (registro chiaro)
scene('famiglia', { make: (W) => ({
  capAt: W('famiglia'), last: W('posate'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.3, lblI(160, 222, 'ACCIAIO: UNA FAMIGLIA', { a: 'start' }), { dy: 0 });
    const col = (x, tt, icon, title, subs) => {
      let g = E(t, tt, card(x, 260, 500, 540) + icon + T(x + 250, 650, title, { f: 'pop', size: 50, fill: ink, a: 'middle' }), { dy: 14 });
      subs.forEach(([txt, t2], i) => g += E(t, t2, T(x + 250, 715 + i * 0, txt, { f: 'serif', it: true, size: 46, fill: ink, a: 'middle' }), { dy: 8 }));
      return g;
    };
    s += col(170, W('dolce') - 0.1, ibeam(330, 440, 0.62, ink) + car(510, 470, 0.9, ink), 'Dolce', [['edifici, automobili', W('edifici') - 0.1]]);
    s += col(710, W('alto') - 0.1, knife(960, 440, 0.95, ink), 'Alto carbonio', [['lame', W('lame') - 0.1]]);
    s += col(1250, W('inossidabile') - 0.1, fork(1500, 440, 0.9, ink), 'Inossidabile', [['con cromo · posate', W('cromo') - 0.1]]);
    return s + caption(t, W('famiglia'), 'Una famiglia di acciai', 'famiglia', true);
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 400, 'Dal ferro all’acciaio', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('sembra') - 0.2, 960, 525, 'Una piccola variazione di carbonio', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'carbonio', keyFill: C.coralD });
    s += words(t, W('cambia') - 0.1, 960, 610, 'cambia le proprietà del materiale.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true });
    s += E(t, W('materiale') + 0.4, `<line x1="760" y1="690" x2="1160" y2="690" stroke="${C.ink}" stroke-width="3"/>` + T(960, 750, 'PROFTECNOLOGIA · MC MAT-1-05', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
