// La discarica: un parcheggio lungo — MC-MAT-1-04 §"La discarica: non è la fine, è un parcheggio lungo". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d'%]/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.5);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
// geometria della fossa (sezione)
const GY = 330, PIT = [[440, GY], [1480, GY], [1320, 640], [600, 640]];
const pitPts = PIT.map(p => p.join(',')).join(' ');
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<pattern id="hatchD" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="26" stroke="${mix(C.bg, C.line, 0.22)}" stroke-width="3"/></pattern>
<pattern id="hatchL" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="26" stroke="${mix(C.cream, C.ink, 0.28)}" stroke-width="3"/></pattern>
<clipPath id="pitclip"><polygon points="452,336 1468,336 1312,632 608,632"/></clipPath><clipPath id="moundclip"><path d="M440,330 C640,222 1280,222 1480,330 Z"/></clipPath></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const lblI = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.ink, ls: 3, a: o.a || 'middle', w: 700 });
// etichetta con fondo pieno (non attraversata da tratteggi)
function tag(x, y, s, o = {}) {
  const size = o.size || 26, w = tw(s, 'mono', size) + 3 * s.length + 28, a = o.a || 'middle';
  const x0 = a === 'middle' ? x - w / 2 : a === 'end' ? x - w : x;
  return `<rect x="${x0}" y="${y - size - 8}" width="${w}" height="${size + 22}" rx="6" fill="${o.bg || C.bg}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="2"` : ''}/>` +
    T(x0 + w / 2, y, s, { f: 'mono', size, fill: o.fill || C.line, a: 'middle', ls: 3, w: 700 });
}
const sub = (base, s, size, fill, f = 'pop') => `<tspan>${base}</tspan><tspan font-size="${Math.round(size * 0.6)}" dy="${Math.round(size * 0.18)}">${s}</tspan>`;

// ---- rifiuti in sezione (deterministici) ----
const ITEMS = [];
for (let i = 0; i < 70; i++) {
  const y = 360 + (i % 10) * 28 + hsh(i) * 18, half = lerp(520, 360, (y - GY) / 310);
  const x = 960 + (hsh(i + 50) * 2 - 1) * (half - 60);
  const k = Math.floor(hsh(i + 100) * 5); // 0 sacchetto, 1 scatola, 2 lattina, 3 organico, 4 bottiglietta
  ITEMS.push({ x, y, k, r: 18 + hsh(i + 7) * 14, rot: (hsh(i + 9) * 2 - 1) * 40 });
}
const MITEMS = [];
for (let i = 0; i < 22; i++) MITEMS.push({ x: 560 + hsh(i + 500) * 800, y: 250 + hsh(i + 600) * 80, k: Math.floor(hsh(i + 700) * 5), r: 18 + hsh(i + 800) * 12, rot: (hsh(i + 900) * 2 - 1) * 40 });
function item(it, st, sw = 3) {
  const { x, y, k, r, rot } = it; let g = '';
  if (k === 0) g = `<path d="M${-r},${r * .5} C${-r * 1.1},${-r * .6} ${-r * .3},${-r} 0,${-r * .7} C${r * .4},${-r} ${r * 1.1},${-r * .5} ${r},${r * .5} Z" fill="none" stroke="${st}" stroke-width="${sw}"/>`;
  if (k === 1) g = `<rect x="${-r}" y="${-r * .6}" width="${r * 2}" height="${r * 1.2}" fill="none" stroke="${st}" stroke-width="${sw}"/><line x1="${-r}" y1="${-r * .1}" x2="${r}" y2="${-r * .1}" stroke="${st}" stroke-width="${sw * .7}"/>`;
  if (k === 2) g = `<rect x="${-r * .5}" y="${-r * .8}" width="${r}" height="${r * 1.6}" rx="${r * .2}" fill="none" stroke="${st}" stroke-width="${sw}"/>`;
  if (k === 3) { const q = r * 1.1; g = `<path d="M${-q * .55},${-q * .7} C${-q * .1},${-q * .5} ${q * .1},${-q * .5} ${q * .55},${-q * .7} C${q * .15},${-q * .25} ${q * .15},${q * .25} ${q * .55},${q * .7} C${q * .1},${q * .5} ${-q * .1},${q * .5} ${-q * .55},${q * .7} C${-q * .15},${q * .25} ${-q * .15},${-q * .25} ${-q * .55},${-q * .7} Z" fill="none" stroke="${st}" stroke-width="${sw * 1.3}" stroke-linejoin="round"/><path d="M0,${-q * .6} v${-q * .45}" stroke="${st}" stroke-width="${sw * 1.2}" stroke-linecap="round"/><path d="M0,${-q * .95} q${q * .45},${-q * .35} ${q * .7},${-q * .05} q${-q * .35},${q * .3} ${-q * .7},${q * .05} z" fill="${st}"/>`; }
  if (k === 4) g = `<path d="M${-r},${-r * .3} h${r * 1.4} l${r * .3},${r * .15} h${r * .3} v${r * .3} h${-r * .3} l${-r * .3},${r * .15} h${-r * 1.4} z" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)})">${g}</g>`;
}
function waste(st, o = {}) {
  let g = '';
  ITEMS.forEach((it, i) => {
    if (o.skip && o.skip(it, i)) return;
    const op = o.op ? o.op(it, i) : 1; if (op <= 0.01) return;
    g += `<g opacity="${op.toFixed(3)}">${item(it, it.k === 3 && o.org ? o.org : st)}</g>`;
  });
  return `<g clip-path="url(#pitclip)">${g}</g>`;
}
// terreno in sezione: superficie, tratteggio del suolo intorno alla fossa
function ground(light, o = {}) {
  const ink = light ? C.ink : C.line, x0 = o.x0 ?? 120, x1 = o.x1 ?? 1800, y1 = o.y1 ?? 700;
  return `<path d="M${x0},${GY} H440 L600,640 H1320 L1480,${GY} H${x1} V${y1} H${x0} Z" fill="url(#${light ? 'hatchL' : 'hatchD'})"/>` +
    `<path d="M${x0},${GY} H440 M1480,${GY} H${x1}" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
}
const pitEdge = (st, sw = 4) => `<polyline points="440,${GY} 600,640 1320,640 1480,${GY}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
function falda(y, st, t) {
  let g = `<rect x="140" y="${y - 12}" width="1640" height="58" fill="${C.bg}"/>`;
  for (let r = 0; r < 2; r++) {
    let d = `M140,${y + r * 34}`;
    for (let x = 140; x <= 1780; x += 20) d += ` L${x},${(y + r * 34 + Math.sin(x / 60 + t * 1.6 + r) * 6).toFixed(1)}`;
    g += `<path d="${d}" fill="none" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return g;
}
function bottleBig(cx, cy, s, st, fill, sw = 6) {
  return `<g transform="translate(${cx},${cy}) rotate(-8) scale(${s})"><path d="M-150,-48 h210 c22,0 34,22 48,26 h28 v44 h-28 c-14,4 -26,26 -48,26 h-210 c-16,0 -26,-12 -26,-26 v-44 c0,-14 10,-26 26,-26 z" fill="${fill}" stroke="${st}" stroke-width="${sw / s}" stroke-linejoin="round"/>` +
    `<rect x="136" y="-30" width="30" height="60" rx="6" fill="${fill}" stroke="${st}" stroke-width="${sw / s}"/>` +
    `<path d="M-110,-48 v96 M-60,-48 v96" stroke="${st}" stroke-width="${3 / s}" opacity="0.7"/></g>`;
}
function capBand(light) {
  const ink = light ? C.ink : C.line;
  const grass = [0, 1, 2, 3, 4, 5, 6].map(i => { const x = 600 + i * 120, y = 212 + Math.pow((x - 960) / 560, 2) * 110; return `<path d="M${x - 14},${y} l6,-22 M${x},${y} v-26 M${x + 14},${y} l-6,-22" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`; }).join('');
  return `<path d="M420,${GY} C630,170 1290,170 1500,${GY} L1480,${GY} C1280,222 640,222 440,${GY} Z" fill="${light ? 'url(#hatchL)' : C.bg}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>` + (light ? '' : `<path d="M420,${GY} C630,170 1290,170 1500,${GY} L1480,${GY} C1280,222 640,222 440,${GY} Z" fill="url(#hatchD)"/>`) + grass;
}
function bolt(cx, cy, s, fill) { return `<path d="M${cx + 8 * s},${cy - 46 * s} L${cx - 22 * s},${cy + 6 * s} H${cx} L${cx - 8 * s},${cy + 46 * s} L${cx + 24 * s},${cy - 8 * s} H${cx + 2 * s} Z" fill="${fill}" stroke-linejoin="round"/>`; }
// bolle di biogas che salgono dagli scarti organici
function bubbles(t, t0, st, o = {}) {
  if (t < t0) return '';
  let g = ''; const orgs = ITEMS.filter(it => it.k === 3).slice(0, o.n || 12);
  orgs.forEach((it, i) => {
    for (let j = 0; j < 2; j++) {
      const ph = (hsh(i * 3 + j) + (t - t0) * 0.32) % 1, top = o.top ?? 150;
      const y = it.y - ph * (it.y - top), x = it.x + Math.sin(ph * 9 + i) * 10;
      const op = clamp((t - t0 - j * 0.6) * 2) * (y < GY ? clamp((y - top) / 120) : 1);
      if (op > 0.02) g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(7 + 3 * j)}" fill="none" stroke="${st}" stroke-width="3.5" opacity="${op.toFixed(3)}"/>`;
    }
  });
  return g;
}

// 1 — non scompare: un parcheggio lungo
scene('intro', { make: (W) => ({
  capAt: W('parcheggio'), last: W('lungo'),
  render(t) {
    let s = '';
    s += E(t, -0.4, `<g transform="translate(820,250) scale(0.55)">${ground(false, { x0: 300, x1: 1620, y1: 690 })}${pitEdge(C.line, 6)}</g>`, { dy: 0 });
    s += E(t, W('discarica') - 0.1, `<g transform="translate(820,250) scale(0.55)">${waste(C.line)}</g>`, { dy: 0 });
    s += E(t, W('discarica') - 0.05, tag(1350, 400, 'DISCARICA'), { dy: 10 });
    s += words(t, W('non') - 0.1, 96, 270, 'Non scompare', { f: 'pop', size: 84 });
    s += E(t, W('resta') - 0.1, IT(100, 350, 'resta lì, in deposito', { size: 52 }));
    // cartello da parcheggio
    s += pop(t, W('parcheggio') - 0.1, 270, 600, `<rect x="160" y="490" width="220" height="220" rx="28" fill="${C.bg}" stroke="${C.coral}" stroke-width="8"/>` + T(270, 660, 'P', { f: 'pop', size: 150, a: 'middle' }) + `<line x1="270" y1="710" x2="270" y2="790" stroke="${C.line}" stroke-width="8"/>`);
    s += E(t, W('lungo') - 0.1, T(420, 640, 'lungo', { f: 'serif', it: true, size: 72 }), { dy: 10 });
    return s + caption(t, W('parcheggio'), 'Un parcheggio lungo', '');
  } }) });

// 2 — gerarchia: ultima istanza (registro chiaro)
scene('gerarchia', { make: (W) => ({
  capAt: W('ultima'), last: W('fare'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += E(t, -0.3, lblI(260, 230, 'GERARCHIA DEI RIFIUTI', { a: 'start' }), { dy: 0 });
    const R = ['RIFIUTA', 'RIDUCI', 'RIUSA', 'RICICLA', 'RECUPERA'], cx = 820, y0 = 270, h = 74, gap = 12;
    R.forEach((r, i) => {
      const w = 760 - i * 90, y = y0 + i * (h + gap);
      s += E(t, W('gerarchia') - 0.2 + i * 0.12, `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}" rx="10" fill="${C.ivory}" stroke="${ink}" stroke-width="3.5"/>` + lblI(cx, y + 47, r, { size: 30 }), { dy: 10 });
    });
    const yD = y0 + 5 * (h + gap) + 14, wD = 300;
    s += E(t, W('ultima') - 0.1, `<rect x="${cx - wD / 2}" y="${yD}" width="${wD}" height="${h}" rx="10" fill="${C.cream}" stroke="${C.coral}" stroke-width="7"/>` + lblI(cx, yD + 47, 'DISCARICA', { size: 30, fill: C.coralD }), { dy: 10 });
    // asse migliore -> peggiore
    s += E(t, W('gerarchia'), arrow(190, 290, 190, 760, ink, 4) + lblI(210, 300, 'MIGLIORE', { a: 'start', size: 24 }) + lblI(210, 760, 'PEGGIORE', { a: 'start', size: 24 }), { dy: 0 });
    s += E(t, W('ultima') - 0.05, T(1290, 360, 'ultima istanza', { f: 'serif', it: true, size: 64, fill: ink }), { dy: 10 });
    s += E(t, W('meno') - 0.1, pillTag(1290, 470, 'LA MENO PREFERIBILE', ink, C.ivory), { dy: 10 });
    s += E(t, W('usata') - 0.1, T(1290, 600, 'quando non c’è', { f: 'serif', it: true, size: 50, fill: ink }) + T(1290, 660, 'altro da fare', { f: 'serif', it: true, size: 50, fill: ink }), { dy: 10 });
    return s + caption(t, W('ultima'), 'Ultima istanza', '', true);
  } }) });

// 3 — il telo sul fondo e sui lati
scene('telo', { make: (W) => ({
  capAt: W('telo'), last: W('lati') + 0.6,
  render(t) {
    let s = E(t, -0.4, ground(false) + pitEdge(C.line, 4), { dy: 0 });
    s += E(t, -0.2, tag(150, 270, 'DISCARICA MODERNA', { a: 'start' }), { dy: 0 });
    // telo: prima il fondo, poi i lati
    const pf = eo((t - W('fondo') + 0.15) / 0.6), pl = eo((t - W('lati') + 0.1) / 0.7);
    const LN = 8, off = 10;
    if (pf > 0) s += `<line x1="${960 - 360 * pf}" y1="${640 - off}" x2="${960 + 360 * pf}" y2="${640 - off}" stroke="${C.coral}" stroke-width="${LN}" stroke-linecap="round"/>`;
    if (pl > 0) {
      const ax = 600 + 10, bx = 1320 - 10, yb = 640 - off;
      s += `<line x1="${ax}" y1="${yb}" x2="${lerp(ax, 450, pl)}" y2="${lerp(yb, GY, pl)}" stroke="${C.coral}" stroke-width="${LN}" stroke-linecap="round"/>` +
        `<line x1="${bx}" y1="${yb}" x2="${lerp(bx, 1470, pl)}" y2="${lerp(yb, GY, pl)}" stroke="${C.coral}" stroke-width="${LN}" stroke-linecap="round"/>`;
    }
    s += E(t, W('telo') - 0.1, tag(960, 520, 'TELO DI PLASTICA (HDPE)'), { dy: 10 });
    s += E(t, W('fondo') - 0.05, tag(960, 600, 'FONDO'), { dy: 6 });
    s += E(t, W('lati') - 0.05, `<line x1="352" y1="490" x2="500" y2="490" stroke="${C.line}" stroke-width="3"/><line x1="1420" y1="490" x2="1568" y2="490" stroke="${C.line}" stroke-width="3"/>` + tag(300, 500, 'LATO') + tag(1620, 500, 'LATO'), { dy: 6 });
    s += E(t, W('impermeabilizzazione') - 0.1, IT(960, 250, 'impermeabilizzazione', { a: 'middle', size: 58 }), { dy: 10 });
    return s + caption(t, W('telo'), 'Un telo impermeabile', '');
  } }) });

// 4 — il percolato non deve infiltrarsi
scene('percolato', { make: (W) => ({
  capAt: W('percolato'), last: W('falde'),
  render(t) {
    let s = E(t, -0.4, ground(false, { y1: 850 }) + pitEdge(C.line, 4) + `<polyline points="450,${GY} 610,630 1310,630 1470,${GY}" fill="none" stroke="${C.line}" stroke-width="8" stroke-linejoin="round"/>` + waste(mix(C.bg, C.line, 0.6)), { dy: 0 });
    // gocce che scendono fra i rifiuti
    const t0 = W('liquidi') - 0.1;
    if (t > t0) for (let i = 0; i < 9; i++) {
      const ph = (hsh(i + 300) + (t - t0) * 0.35) % 1, x = 700 + i * 65, y = 380 + ph * 220;
      s += `<path d="M${x},${y - 12} q8,12 0,18 q-8,-6 0,-18 z" fill="${C.line}" opacity="${(clamp((t - t0) * 2) * (1 - ph * 0.4)).toFixed(3)}"/>`;
    }
    // il percolato si raccoglie sul telo
    const pp = eo((t - W('percolato') + 0.1) / 1.2), lvl = 26 * pp;
    if (pp > 0) s += `<polygon points="612,${630} 1308,630 ${1308 + lvl * 0.5},${630 - lvl} ${612 - lvl * 0.5},${630 - lvl}" fill="${C.coral}"/>`;
    s += E(t, W('liquidi') - 0.1, tag(150, 270, 'LIQUIDI TOSSICI', { a: 'start' }), { dy: 0 });
    s += E(t, W('percolato') - 0.05, tag(960, 700, 'PERCOLATO'), { dy: 8 });
    s += E(t, W('suolo') - 0.1, tag(1640, 640, 'SUOLO'), { dy: 6 });
    s += E(t, W('falde') - 0.1, falda(760, C.line, t) + tag(1640, 850, 'FALDA'), { dy: 0 });
    s += E(t, -0.2, tag(1420, 500, 'TELO', { a: 'start' }), { dy: 0 });
    s += E(t, W('infiltrino') - 0.1, `<rect x="1150" y="470" width="40" height="150" fill="${C.bg}"/>` + arrow(1170, 480, 1170, 612, C.line, 6) + `<line x1="1140" y1="620" x2="1200" y2="620" stroke="${C.line}" stroke-width="8" stroke-linecap="round"/>` +
      `<line x1="1170" y1="650" x2="1170" y2="738" stroke="${C.line}" stroke-width="5" stroke-dasharray="12 10"/>` + `<rect x="1144" y="672" width="52" height="52" fill="${C.bg}"/><path d="M1150,678 l40,40 M1190,678 l-40,40" stroke="${C.line}" stroke-width="7" stroke-linecap="round"/>`, { dy: 0 });
    return s + caption(t, W('percolato'), 'Il percolato', '');
  } }) });

// 5 — biogas, per anni
scene('biogas', { make: (W) => ({
  capAt: W('biogas'), last: W('anni'),
  render(t) {
    const orgOn = t > W('organica') - 0.1;
    let s = E(t, -0.4, ground(false) + pitEdge(C.line, 4) + `<polyline points="450,${GY} 610,630 1310,630 1470,${GY}" fill="none" stroke="${C.line}" stroke-width="8" stroke-linejoin="round"/>`, { dy: 0 });
    s += E(t, -0.3, waste(mix(C.bg, C.line, 0.45), { org: orgOn ? C.line : mix(C.bg, C.line, 0.45) }), { dy: 0 });
    s += E(t, W('organica') - 0.1, (()=>{ const o = ITEMS.filter(it => it.k === 3)[0]; return `<line x1="${o.x}" y1="${o.y - 34}" x2="330" y2="262" stroke="${C.line}" stroke-width="3"/>`; })() + tag(150, 270, 'SCARTI ORGANICI', { a: 'start' }), { dy: 0 });
    s += bubbles(t, W('produce'), C.line, { top: 140 });
    s += E(t, W('biogas') - 0.1, T(1824, 210, 'biogas', { f: 'serif', it: true, size: 76, a: 'end' }), { dy: 10 });
    s += E(t, W('metano') - 0.15, tag(1824, 290, 'PRINCIPALMENTE METANO', { a: 'end' }), { dy: 8 });
    s += E(t, W('anni') - 0.1, pillTag(1700, 400, 'PER ANNI', C.line, C.bg, 'middle'), { dy: 8 });
    return s + caption(t, W('biogas'), 'Biogas per anni', 'Biogas');
  } }) });

// 6 — 80 volte più potente della CO2 nel breve termine (registro chiaro)
scene('potente', { make: (W) => ({
  capAt: W('80') + 0.3, last: W('termine'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += E(t, W('climaalterante') - 0.1, lblI(260, 250, 'EFFETTO CLIMA-ALTERANTE', { a: 'start' }), { dy: 0 });
    const X = 520, U = 14; // 1 unità = 14 px: 80 unità = 1120 px
    s += E(t, W('metano') - 0.1, T(480, 400, 'METANO', { f: 'mono', size: 30, fill: ink, a: 'end', w: 700, ls: 3 }), { dy: 6 });
    const pm = eo((t - W('80') + 0.05) / 1.1);
    s += `<line x1="${X}" y1="320" x2="${X}" y2="640" stroke="${ink}" stroke-width="4"/>`;
    if (pm > 0) s += `<rect x="${X}" y="350" width="${(80 * U * pm).toFixed(1)}" height="80" fill="${C.coral}" stroke="${ink}" stroke-width="3"/>`;
    s += E(t, W('80'), T(X + 80 * U - 20, 320, '80 volte', { f: 'pop', size: 64, fill: ink, a: 'end' }), { dy: 10 });
    s += E(t, W('ci') - 0.1, `<text x="480" y="570" font-family="${F.mono}" font-size="30" font-weight="700" fill="${ink}" text-anchor="end" letter-spacing="3">CO<tspan font-size="20" dy="6">2</tspan></text>`, { dy: 6 });
    const pc = eo((t - W('ci') + 0.05) / 0.4);
    if (pc > 0) s += `<rect x="${X}" y="520" width="${(U * pc).toFixed(1)}" height="80" fill="${mix(C.ivory, ink, 0.35)}" stroke="${ink}" stroke-width="3"/>`;
    s += E(t, W('ci') + 0.1, T(X + 40, 575, '1 volta', { f: 'serif', it: true, size: 46, fill: ink }), { dy: 6 });
    s += E(t, W('breve') - 0.1, pillTag(1000, 760, 'NEL BREVE TERMINE', ink, C.ivory, 'start') + pillTag(260, 760, 'A PARITÀ DI QUANTITÀ', ink, C.ivory, 'start'), { dy: 8 });
    return s + caption(t, W('80') + 0.3, '80 volte più potente', '', true);
  } }) });

// 7 — recuperarlo o no
scene('recupero', { make: (W) => ({
  capAt: W('recuperano'), last: W('fanno'),
  render(t) {
    let s = '';
    const mini = (tx, inner) => `<g transform="translate(${tx},300) scale(0.42)">${inner}</g>`;
    const base0 = ground(false, { x0: 200, x1: 1720, y1: 690 }) + pitEdge(C.line, 8) + waste(mix(C.bg, C.line, 0.55));
    const base = base0 + `<polyline points="452,${GY} 612,628 1308,628 1468,${GY}" fill="none" stroke="${C.line}" stroke-width="14" stroke-linejoin="round"/>`;
    // sinistra: impianto con recupero
    s += E(t, -0.3, mini(60, base), { dy: 0 });
    s += E(t, W('impianti') - 0.1, `<path d="M463,540 V290 H600" fill="none" stroke="${C.line}" stroke-width="8" stroke-linejoin="round"/>` +
      `<rect x="600" y="230" width="190" height="120" rx="12" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>` + lbl(695, 300, 'IMPIANTO', { size: 24 }), { dy: 0 });
    // gas nel tubo
    if (t > W('recuperano')) for (let i = 0; i < 4; i++) {
      const ph = ((t - W('recuperano')) * 0.6 + i / 4) % 1, L1 = 250, L2 = 137, d = ph * (L1 + L2);
      const x = d < L1 ? 463 : 463 + (d - L1), y = d < L1 ? 540 - d : 290;
      s += `<circle cx="${x}" cy="${y}" r="7" fill="${C.line}"/>`;
    }
    s += pop(t, W('energia') - 0.1, 870, 290, bolt(870, 290, 1.3, C.coral));
    s += E(t, W('energia') - 0.05, tag(870, 400, 'ENERGIA'), { dy: 6 });
    s += E(t, W('impianti') - 0.1, tag(470, 670, 'CON RECUPERO'), { dy: 6 });
    // destra: discarica vecchia, gas che sfugge in aria
    s += E(t, W('molte') - 0.15, mini(1000, base0), { dy: 0 });
    s += E(t, W('vecchie') - 0.1, tag(1410, 670, 'DISCARICA VECCHIA'), { dy: 6 });
    const tg = W('non') - 0.1;
    if (t > tg) for (let i = 0; i < 6; i++) {
      const ph = ((t - tg) * 0.45 + hsh(i + 40)) % 1, x = 1290 + i * 48 + Math.sin(ph * 8 + i) * 10, y = 430 - ph * 260;
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="none" stroke="${C.line}" stroke-width="3.5" opacity="${(clamp((t - tg) * 2) * (1 - ph)).toFixed(3)}"/>`;
    }
    s += E(t, W('non') - 0.05, IT(1410, 200, 'nessun recupero', { a: 'middle', size: 50 }), { dy: 8 });
    return s + (t < W('molte') - 0.05 ? caption(t, W('recuperano'), 'Biogas in energia', '') : caption(t, W('molte') - 0.05, 'Le vecchie no', ''));
  } }) });

// 8 — il cappellotto non la rende inerte (registro chiaro)
scene('cappellotto', { make: (W) => ({
  capAt: W('degradazione'), last: W('decenni'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    const g = `<g transform="translate(150,130) scale(0.84)">`;
    // la discarica chiusa: rifiuti fino a un cumulo
    s += E(t, -0.3, g + ground(true, { x0: 180, x1: 1740, y1: 700 }) + pitEdge(ink, 5) + waste(mix(C.cream, C.ink, 0.5)) + `<g clip-path="url(#moundclip)">${MITEMS.map(it => item(it, mix(C.cream, C.ink, 0.5))).join('')}</g>` + '</g>', { dy: 0 });
    // lo strato di terra scende e copre
    const pc = eo((t - W('strato') + 0.1) / 0.9), dy = (1 - pc) * -120;
    if (pc > 0) s += `<g opacity="${pc.toFixed(3)}">${g}<g transform="translate(0,${dy.toFixed(1)})">${capBand(true)}</g></g></g>`;
    s += E(t, W('chiusura') - 0.1, lblI(240, 240, 'DISCARICA CHIUSA', { a: 'start' }), { dy: 0 });
    s += E(t, W('cappellotto') - 0.1, T(1360, 250, 'cappellotto', { f: 'serif', it: true, size: 60, fill: C.coralD }), { dy: 10 });
    s += E(t, W('terra') - 0.1, lblI(1360, 300, 'STRATO DI TERRA', { a: 'start' }), { dy: 6 });
    // sotto, la degradazione continua
    const tb = W('degradazione') - 0.1;
    if (t > tb) {
      let b = '';
      ITEMS.filter(it => it.k === 3).slice(0, 10).forEach((it, i) => {
        const ph = (hsh(i + 70) + (t - tb) * 0.4) % 1, y = it.y - ph * 40;
        b += `<circle cx="${it.x}" cy="${y.toFixed(1)}" r="6" fill="none" stroke="${ink}" stroke-width="3.5" opacity="${(clamp((t - tb) * 2) * (1 - ph)).toFixed(3)}"/>`;
      });
      s += `${g}${b}</g>`;
    }
    s += E(t, W('inerte') - 0.1, pillTag(1360, 740, 'NON INERTE', ink, C.ivory, 'start'), { dy: 8 });
    s += E(t, W('decenni') - 0.1, T(1360, 680, 'per decenni', { f: 'serif', it: true, size: 54, fill: ink }), { dy: 8 });
    return s + caption(t, W('degradazione'), 'Continua per decenni', '', true);
  } }) });

// 9 — la plastica, invariata per secoli
scene('plastica', { make: (W) => ({
  capAt: W('invariati'), last: W('secoli'),
  render(t) {
    const g0 = '<g transform="translate(96,170) scale(0.9)">', dim = mix(C.bg, C.line, 0.45);
    // il tempo passa: gli scarti organici si consumano, la bottiglia resta
    const tt = W('rimangono') - 0.2, fade = clamp((t - tt) / 2.2), op = it => it.k === 3 ? 1 - fade : 1;
    let w = ground(false) + pitEdge(C.line, 4) + `<polyline points="452,${GY} 612,628 1308,628 1468,${GY}" fill="none" stroke="${C.line}" stroke-width="8" stroke-linejoin="round"/>` +
      waste(dim, { skip: it => Math.abs(it.x - 960) < 200 && Math.abs(it.y - 470) < 80, op }) +
      `<g clip-path="url(#moundclip)">${MITEMS.map(it => `<g opacity="${op(it).toFixed(3)}">${item(it, dim)}</g>`).join('')}</g>` + capBand(false);
    let s = E(t, -0.4, g0 + w + '</g>', { dy: 0 });
    s += E(t, -0.2, g0 + bottleBig(960, 470, 1, C.coral, C.bg, 7) + '</g>', { dy: 0 });
    s += E(t, W('plastici') - 0.1, `<line x1="1112" y1="590" x2="1440" y2="590" stroke="${C.line}" stroke-width="3"/>` + tag(1440, 600, 'MATERIALE PLASTICO', { a: 'start' }), { dy: 0 });
    // linea del tempo (non in scala: i decenni stanno vicino a oggi)
    const X0 = 300, X1 = 1620, Y = 170, XD = X0 + 0.18 * (X1 - X0);
    s += E(t, W('rimangono') - 0.3, arrow(X0, Y, X1, Y, C.line, 4) + `<line x1="${XD}" y1="${Y - 12}" x2="${XD}" y2="${Y + 12}" stroke="${C.line}" stroke-width="4"/>` +
      lbl(X0, Y - 30, 'OGGI', { a: 'start' }) + lbl(XD, Y - 30, 'DECENNI') + lbl(X1, Y - 30, 'SECOLI', { a: 'end' }), { dy: 0 });
    const pm = eio((t - W('rimangono') + 0.1) / Math.max(0.5, W('secoli') - W('rimangono') + 0.2));
    if (t > W('rimangono') - 0.3) s += `<circle cx="${lerp(X0, X1 - 30, pm).toFixed(1)}" cy="${Y}" r="14" fill="${C.line}"/>`;
    s += E(t, W('invariati') - 0.1, IT(960, 262, 'praticamente invariati', { a: 'middle', size: 56 }), { dy: 8 });
    return s + caption(t, W('invariati'), 'Invariati per secoli', '');
  } }) });

// 10 — Italia: dal 67% al 20% circa (registro chiaro)
function bars(t, light, o) {
  const ink = light ? C.ink : C.line, base = 720, k = 5.5; // 1% = 5,5 px
  let s = E(t, o.t0 ?? -0.3, `<line x1="300" y1="${base}" x2="1500" y2="${base}" stroke="${ink}" stroke-width="4"/>` +
    lblI(300, 230, 'RIFIUTI URBANI IN DISCARICA', { a: 'start', fill: ink }), { dy: 0 });
  o.bars.forEach(b => {
    const p = b.t == null ? 1 : eo((t - b.t) / 0.8); if (p <= 0) return;
    const h = b.v * k * p, x = b.x - 110;
    s += b.dash ? `<rect x="${x}" y="${base - h}" width="220" height="${h}" fill="none" stroke="${C.coral}" stroke-width="6" stroke-dasharray="16 10"/>`
      : `<rect x="${x}" y="${base - h}" width="220" height="${h}" fill="${b.fill}" stroke="${ink}" stroke-width="3"/>`;
    s += `<g opacity="${clamp(p * 2).toFixed(3)}">` + T(b.x, base - h - 24, b.lab, { f: 'pop', size: 64, fill: b.lc || ink, a: 'middle' }) +
      T(b.x, base + 50, b.year, { f: 'mono', size: 30, fill: ink, a: 'middle', w: 700, ls: 3 }) + (b.sub ? T(b.x, base + 96, b.sub, { f: 'serif', it: true, size: 40, fill: ink, a: 'middle' }) : '') + '</g>';
  });
  return s;
}
scene('italia', { make: (W) => ({
  capAt: W('67%'), last: W('circa'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += bars(t, true, { bars: [
      { x: 560, v: 67, t: W('67%') - 0.1, fill: mix(C.ivory, ink, 0.3), lab: '67%', year: '2000' },
      { x: 960, v: 20, t: W('20%') - 0.1, fill: C.coral, lab: '20%', lc: C.coralD, year: 'OGGI', sub: 'circa' }] });
    s += E(t, W('sceso') - 0.1, T(1240, 360, 'il ricorso', { f: 'serif', it: true, size: 56, fill: ink }) + T(1240, 420, 'è sceso', { f: 'serif', it: true, size: 56, fill: ink }), { dy: 8 });
    s += E(t, -0.2, pillTag(1500, 230, 'ITALIA', ink, C.ivory, 'middle'), { dy: 0 });
    return s + caption(t, W('67%'), 'Dal 67% al 20%', '', true);
  } }) });

// 11 — obiettivo europeo: 10% entro il 2035
scene('obiettivo', { make: (W) => ({
  capAt: W('10%'), last: W('2035'),
  render(t) {
    let s = bars(t, false, { t0: -0.4, bars: [
      { x: 560, v: 67, fill: mix(C.bg, C.line, 0.3), lab: '67%', year: '2000' },
      { x: 960, v: 20, fill: mix(C.bg, C.line, 0.3), lab: '20%', year: 'OGGI', sub: 'circa' },
      { x: 1360, v: 10, t: W('10%') - 0.1, dash: true, lab: '10%', year: '2035', sub: 'obiettivo' }] });
    s += E(t, W("l'obiettivo") - 0.1, tag(1360, 490, 'OBIETTIVO EUROPEO'), { dy: 8 });
    return s + caption(t, W('10%'), '10% entro il 2035', '');
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Un parcheggio lungo', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('discarica') - 0.2, 960, 545, 'La discarica non è la fine:', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true });
    s += words(t, W('è', 1) - 0.1, 960, 630, 'è un deposito.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'deposito', keyFill: C.coralD });
    s += E(t, W('deposito') + 0.4, `<line x1="760" y1="700" x2="1160" y2="700" stroke="${C.ink}" stroke-width="3"/>` + T(960, 760, 'PROFTECNOLOGIA · MC MAT-1-04', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
