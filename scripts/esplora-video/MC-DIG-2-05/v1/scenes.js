// La ricompensa che aspetti — MC-DIG-2-05 §"Il sistema del reward: dopamina e notifiche". render(t) puro.
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

// ---- mondo: cervello in sezione, telefoni, assi del tempo (line-art a filo chiaro) ----
function brainSVG(cx, cy, s, st, fill) {
  const P = (d) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${(cx + x * s).toFixed(1)},${(cy + y * s).toFixed(1)}`);
  let g = `<path d="${P('M-250,40 C-290,-60 -220,-190 -90,-210 C0,-250 140,-230 210,-150 C280,-80 280,30 230,80 C200,120 140,130 100,120 C60,140 0,140 -40,120 C-110,150 -220,130 -250,40 Z')}" fill="${fill || DIM()}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  g += `<path d="${P('M110,118 C130,175 215,170 236,92')}" fill="none" stroke="${st}" stroke-width="4"/>`;
  g += `<path d="${P('M60,126 C72,170 70,210 62,262 M18,130 C30,170 30,210 24,262')}" fill="none" stroke="${st}" stroke-width="4"/>`;
  g += `<path d="${P('M-180,-60 C-140,-100 -90,-60 -50,-110 M-40,-170 C0,-120 40,-180 90,-135 M130,-170 C110,-110 170,-90 205,-45 M-200,40 C-130,10 -80,60 -20,20 M30,40 C80,5 130,55 195,15 M-100,-20 C-50,-45 0,10 60,-45 M140,140 C160,150 190,148 210,130')}" fill="none" stroke="${st}" stroke-width="3.5" stroke-linecap="round" opacity="0.85"/>`;
  return g;
}
function spark(cx, cy, r, c, ph = 0) { // impulso: nucleo + raggi
  let s = `<circle cx="${cx}" cy="${cy}" r="${r * 0.32}" fill="${c}"/>`;
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4, r1 = r * (0.5 + 0.08 * Math.sin(ph)), r2 = r * (0.95 + 0.1 * Math.sin(ph));
    s += `<line x1="${(cx + r1 * Math.cos(a)).toFixed(1)}" y1="${(cy + r1 * Math.sin(a)).toFixed(1)}" x2="${(cx + r2 * Math.cos(a)).toFixed(1)}" y2="${(cy + r2 * Math.sin(a)).toFixed(1)}" stroke="${c}" stroke-width="${r * 0.11}" stroke-linecap="round"/>`;
  }
  return s;
}
function phoneSVG(x, y, w, h, st, inner = '', bg) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="30" fill="${bg || C.bg}" stroke="${st}" stroke-width="5"/>` +
    `<rect x="${x + 14}" y="${y + 44}" width="${w - 28}" height="${h - 88}" rx="10" fill="${bg ? bg : DIM()}" stroke="${st}" stroke-width="2.5"/>` +
    `<line x1="${x + w / 2 - 26}" y1="${y + 24}" x2="${x + w / 2 + 26}" y2="${y + 24}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="${x + w / 2}" cy="${y + h - 22}" r="9" fill="none" stroke="${st}" stroke-width="3"/>` + inner;
}
function heart(cx, cy, s, st, fill = 'none', sw = 4) {
  const P = 'M0,-6 C0,-20 -24,-22 -24,-4 C-24,10 -8,18 0,28 C8,18 24,10 24,-4 C24,-22 0,-20 0,-6 Z'.replace(/(-?\d+),(-?\d+)/g, (_, a, b) => `${(cx + a * s).toFixed(1)},${(cy + b * s).toFixed(1)}`);
  return `<path d="${P}" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
}
function bell(cx, cy, s, st, fill = 'none') {
  const P = 'M-20,14 C-16,8 -16,0 -16,-6 C-16,-18 -8,-24 0,-24 C8,-24 16,-18 16,-6 C16,0 16,8 20,14 Z'.replace(/(-?\d+),(-?\d+)/g, (_, a, b) => `${(cx + a * s).toFixed(1)},${(cy + b * s).toFixed(1)}`);
  return `<path d="${P}" fill="${fill}" stroke="${st}" stroke-width="${4}" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy + 20 * s}" r="${5 * s}" fill="${st}"/>`;
}
function stepBadge(n, word, txt) {
  return `<circle cx="330" cy="430" r="130" fill="none" stroke="${C.coral}" stroke-width="7"/>` + T(330, 490, String(n), { f: 'pop', size: 170, a: 'middle' }) +
    lbl(330, 620, word) + IT(330, 690, txt, { a: 'middle', size: 48 });
}
function feed(x, y, w, h, off, st, id) { // contenuti che scorrono dentro lo schermo
  let s = `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/></clipPath><g clip-path="url(#${id})">`;
  const P = 190, o = off % P, k0 = Math.floor(off / P);
  for (let k = -1; k < Math.ceil(h / P) + 1; k++) {
    const yy = y + 16 + k * P - o, i = k0 + k;
    s += `<rect x="${x + 16}" y="${yy}" width="${w - 32}" height="${P - 22}" rx="10" fill="${C.bg}" stroke="${st}" stroke-width="2.5"/>`;
    s += `<rect x="${x + 30}" y="${yy + 14}" width="${w - 60}" height="${P - 92}" rx="6" fill="${DIM()}" stroke="${st}" stroke-width="2" opacity="0.8"/>`;
    s += `<line x1="${x + 30}" y1="${yy + P - 58}" x2="${x + 30 + (w - 60) * (0.5 + 0.4 * hsh(i))}" y2="${yy + P - 58}" stroke="${st}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>`;
    s += `<line x1="${x + 30}" y1="${yy + P - 40}" x2="${x + 30 + (w - 60) * (0.3 + 0.3 * hsh(i + 7))}" y2="${yy + P - 40}" stroke="${st}" stroke-width="5" stroke-linecap="round" opacity="0.5"/>`;
  }
  return s + '</g>';
}
function spinner(cx, cy, r, st, t) {
  const a = t * 5;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${st}" stroke-width="5" opacity="0.3"/>` +
    `<path d="M${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} A${r},${r} 0 0 1 ${(cx + r * Math.cos(a + 2)).toFixed(1)},${(cy + r * Math.sin(a + 2)).toFixed(1)}" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
}
// slot machine in sezione: rulli che girano (nessuna vincita mostrata)
const SYM = ['circle', 'tri', 'star', 'sq'];
function symbol(k, cx, cy, st) {
  if (k === 'circle') return `<circle cx="${cx}" cy="${cy}" r="24" fill="none" stroke="${st}" stroke-width="5"/>`;
  if (k === 'tri') return `<path d="M${cx},${cy - 26} L${cx + 26},${cy + 20} L${cx - 26},${cy + 20} z" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  if (k === 'sq') return `<rect x="${cx - 22}" y="${cy - 22}" width="44" height="44" rx="4" fill="none" stroke="${st}" stroke-width="5"/>`;
  let p = ''; for (let i = 0; i < 10; i++) { const r = i % 2 ? 11 : 27, a = -Math.PI / 2 + i * Math.PI / 5; p += `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `; }
  return `<path d="${p}z" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
}
function slotSVG(x, y, s, st, t, id, bg) { // x,y angolo in alto a sinistra; larghezza 420*s
  const R = (v) => (v * s).toFixed(1);
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  g += `<rect x="0" y="0" width="420" height="520" rx="26" fill="${bg}" stroke="${st}" stroke-width="${5 / s * s}"/>`;
  g += `<rect x="30" y="30" width="360" height="70" rx="12" fill="none" stroke="${st}" stroke-width="4"/>`;
  g += `<path d="M420,250 h40 v-130" fill="none" stroke="${st}" stroke-width="7" stroke-linecap="round"/><circle cx="460" cy="104" r="22" fill="${bg}" stroke="${st}" stroke-width="6"/>`;
  g += `<rect x="40" y="380" width="340" height="100" rx="10" fill="none" stroke="${st}" stroke-width="4"/><line x1="150" y1="430" x2="270" y2="430" stroke="${st}" stroke-width="6" stroke-linecap="round"/>`;
  g += `<clipPath id="${id}"><rect x="40" y="140" width="340" height="200" rx="8"/></clipPath>`;
  g += `<rect x="40" y="140" width="340" height="200" rx="8" fill="${bg}" stroke="${st}" stroke-width="5"/><g clip-path="url(#${id})">`;
  for (let r = 0; r < 3; r++) {
    const sp = 520 + r * 90, off = (t * sp + r * 37), P = 100, o = off % P, k0 = Math.floor(off / P);
    for (let k = -1; k < 3; k++) g += symbol(SYM[((k0 + k + r * 2) % 4 + 4) % 4], 97 + r * 113, 240 - (k * P - o) + 0, st);
  }
  g += `</g><line x1="153" y1="140" x2="153" y2="340" stroke="${st}" stroke-width="4"/><line x1="267" y1="140" x2="267" y2="340" stroke="${st}" stroke-width="4"/>`;
  return g + '</g>';
}

// 1 — il sistema di ricompensa
scene('hook', { make: (W) => ({
  capAt: W('sistema'), last: W('dopamina'),
  render(t) {
    let s = words(t, 0.05, 96, 330, 'Il cervello', { f: 'pop', size: 100 });
    s += E(t, W('umano') - 0.05, IT(100, 420, 'umano', { size: 60 }));
    s += E(t, -0.4, brainSVG(1270, 470, 1.25, C.line), { dy: 0 });
    s += E(t, W('neurotrasmettitore') - 0.05, lbl(100, 560, 'UN NEUROTRASMETTITORE', { a: 'start' }), { dy: 10 });
    const p = clamp((t - W('dopamina') + 0.05) / 0.35);
    if (p > 0) s += pop(t, W('dopamina') - 0.05, 1230, 420, spark(1230, 420, 70, C.coral, t * 4));
    s += E(t, W('dopamina') - 0.05, IT(100, 650, 'la dopamina', { size: 84 }));
    return s + caption(t, W('sistema'), 'Sistema di ricompensa', '');
  } }) });

// 2 — ricompensa -> dopamina -> piacere (registro chiaro)
function plateSVG(cx, cy, ink) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="92" ry="92" fill="${C.ivory}" stroke="${ink}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="58" fill="none" stroke="${ink}" stroke-width="3"/>` +
    `<path d="M${cx - 130},${cy - 70} v60 M${cx - 142},${cy - 70} v34 a12,12 0 0 0 24,0 v-34 M${cx - 130},${cy - 10} v84" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M${cx + 130},${cy + 74} V${cy - 70} c18,10 22,50 0,70" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function groupSVG(cx, cy, ink) {
  let s = '';
  [[-70, 20], [70, 20], [0, -10]].forEach(([dx, dy]) => s += `<circle cx="${cx + dx}" cy="${cy + dy - 50}" r="30" fill="${C.ivory}" stroke="${ink}" stroke-width="5"/><path d="M${cx + dx - 55},${cy + dy + 50} a55,55 0 0 1 110,0 z" fill="${C.ivory}" stroke="${ink}" stroke-width="5"/>`);
  s += `<path d="M${cx + 60},${cy - 150} h96 a14,14 0 0 1 14,14 v46 a14,14 0 0 1 -14,14 h-58 l-18,18 v-18 h-20 a14,14 0 0 1 -14,-14 v-46 a14,14 0 0 1 14,-14 z" fill="${C.ivory}" stroke="${ink}" stroke-width="4"/>` +
    `<path d="M${cx + 84},${cy - 117} l14,14 l30,-28" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  return s;
}
scene('ricompense', { make: (W) => ({
  capAt: W('ricompensa'), last: W('piacere'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(180, 150, 1560, 690), { dy: 0 });
    s += E(t, W('ricompensa') - 0.05, T(260, 270, 'UNA RICOMPENSA', { f: 'mono', size: 30, fill: ink, ls: 4, w: 700 }), { dy: 10 });
    s += E(t, W('cibo') - 0.1, plateSVG(470, 520, ink) + T(470, 700, 'CIBO', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 3, w: 700 }));
    s += E(t, W('approvazione') - 0.1, groupSVG(860, 540, ink) + T(860, 700, 'APPROVAZIONE', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 3, w: 700 }) + T(860, 740, 'SOCIALE', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 3, w: 700 }));
    s += E(t, W('rilasciata') - 0.05, T(260, 330, 'rilascio di dopamina', { f: 'serif', it: true, size: 52, fill: ink }), { dy: 10 });
    s += E(t, W('e') - 0.1, arrow(1080, 530, 1290, 530, ink, 5) + T(1185, 500, 'DOPAMINA', { f: 'mono', size: 26, fill: ink, a: 'middle', ls: 3, w: 700 }), { dy: 0 });
    s += E(t, W('piacere') - 0.05, `<rect x="1320" y="476" width="330" height="108" rx="54" fill="${C.coral}"/>` + T(1485, 547, 'PIACERE', { f: 'pop', size: 50, fill: C.ivory, a: 'middle' }), { dy: 20 });
    return s + caption(t, W('ricompensa'), 'Ricompensa e piacere', '', true);
  } }) });

// 3 — soprattutto prima: in anticipazione
scene('anticipa', { make: (W) => ({
  capAt: W('anticipazione'), last: W('non'),
  render(t) {
    let s = '';
    const ay = 700, xa = 640, xb = 1300;
    s += E(t, -0.4, arrow(260, ay, 1660, ay, C.line, 5) + lbl(1660, ay + 60, 'TEMPO', { a: 'end' }), { dy: 0 });
    s += E(t, -0.2, `<circle cx="${xb}" cy="${ay}" r="12" fill="${C.line}"/>` + lbl(xb, ay + 60, 'RICOMPENSA') + IT(xb, ay + 114, 'quando la ricevi', { a: 'middle', size: 44 }), { dy: 0 });
    s += E(t, -0.2, `<line x1="${xa - 180}" y1="${ay}" x2="${xb - 20}" y2="${ay}" stroke="${C.line}" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/>` + lbl(xa, ay + 60, 'ATTESA') + IT(xa, ay + 114, 'prima', { a: 'middle', size: 44 }), { dy: 0 });
    s += E(t, -0.3, lbl(260, 230, 'DOPAMINA RILASCIATA', { a: 'start' }) + pillTag(1660, 230, 'SCHEMA', C.line, C.bg, 'end' === 'x' ? 'middle' : 'middle'), { dy: 0 });
    const ga = eo((t - W('anticipazione') + 0.05) / 0.7), gb = eo((t - W('non') + 0.05) / 0.5);
    if (ga > 0) s += `<rect x="${xa - 90}" y="${ay - 20 - 380 * ga}" width="180" height="${380 * ga}" rx="8" fill="${C.coral}"/>`;
    if (gb > 0) s += `<rect x="${xb - 90}" y="${ay - 20 - 110 * gb}" width="180" height="${110 * gb}" rx="8" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/>`;
    s += E(t, W('anticipazione'), IT(xa + 130, 360, 'soprattutto qui', { size: 50 }), { dy: 0 });
    return s + caption(t, W('anticipazione'), 'Prima, non dopo', '');
  } }) });

// 4 — la notifica non letta
scene('notifica', { make: (W) => ({
  capAt: W('prima'), last: W('prima'),
  render(t) {
    let s = '';
    const px = 240, py = 200, pw = 300, ph = 580;
    s += E(t, -0.4, phoneSVG(px, py, pw, ph, C.line), { dy: 0 });
    s += E(t, W('notifica') - 0.1, `<rect x="${px + 30}" y="${py + 90}" width="${pw - 60}" height="120" rx="14" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` +
      bell(px + 74, py + 146, 0.9, C.line) +
      `<line x1="${px + 112}" y1="${py + 132}" x2="${px + 240}" y2="${py + 132}" stroke="${C.line}" stroke-width="6" stroke-linecap="round" opacity="0.7"/><line x1="${px + 112}" y1="${py + 164}" x2="${px + 200}" y2="${py + 164}" stroke="${C.line}" stroke-width="6" stroke-linecap="round" opacity="0.5"/>`, { dy: 10 });
    s += pop(t, W('letta') - 0.05, px + pw - 30, py + 92, `<circle cx="${px + pw - 30}" cy="${py + 92}" r="26" fill="${C.coral}"/>` + T(px + pw - 30, py + 102, '1', { f: 'pop', size: 30, fill: C.ivory, a: 'middle' }));
    s += E(t, W('letta'), lbl(px + pw / 2, 850, 'NON LETTA'), { dy: 0 });
    // cervello che anticipa
    const bx = 1440, by = 440;
    s += E(t, W('cervello') - 0.1, brainSVG(bx, by, 0.8, C.line), { dy: 0 });
    s += E(t, W('anticipa'), lbl(bx, 210, 'ANTICIPA UNA RICOMPENSA'), { dy: 0 });
    const bub = (y, txt, tt) => E(t, tt, `<rect x="660" y="${y - 58}" width="440" height="92" rx="46" fill="${C.bg}" stroke="${C.line}" stroke-width="3" stroke-dasharray="10 9"/>` + IT(880, y + 4, txt, { a: 'middle', size: 50 }));
    s += bub(400, 'un like?', W('like') - 0.1) + bub(530, 'un messaggio?', W('messaggio') - 0.1);
    const sp = t - W('rilascia');
    if (sp > -0.1) s += pop(t, W('rilascia') - 0.05, bx - 30, by - 40, spark(bx - 30, by - 40, 52, C.line, t * 4)) + E(t, W('dopamina') - 0.1, lbl(bx, 720, 'DOPAMINA'), { dy: 0 });
    s += E(t, W('prima') - 0.05, pillTag(bx, 820, 'APP ANCORA CHIUSA', C.line, C.bg, 'middle'));
    return s + caption(t, W('prima'), 'Prima di aprire', '');
  } }) });

// 5 — «voglio guardare» (registro chiaro)
scene('voglio', { make: (W) => ({
  capAt: W('sfruttano'), last: W('sfruttano') + 0.34,
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(240, 140, 1440, 700), { dy: 0 });
    s += words(t, W('voglio') - 0.1, 960, 360, '«voglio guardare»', { f: 'serif', it: true, size: 140, fill: ink, a: 'middle' });
    s += E(t, W('è') - 0.05, T(960, 480, 'è dopamina', { f: 'pop', size: 72, fill: ink, a: 'middle' }), { dy: 14 });
    s += E(t, W('sfruttano') - 0.05, `<line x1="420" y1="560" x2="1500" y2="560" stroke="${ink}" stroke-width="3"/>` + T(960, 625, 'LE APP LO SFRUTTANO', { f: 'mono', size: 30, fill: ink, a: 'middle', ls: 4, w: 700 }), { dy: 0 });
    const tiles = [['1', 'NOTIFICHE'], ['2', 'SCROLL INFINITO'], ['3', 'LIKE']];
    tiles.forEach(([n, l], i) => {
      const x = 400 + i * 390;
      s += E(t, W('sfruttano') + 0.1 + i * 0.12, `<rect x="${x}" y="680" width="350" height="90" rx="14" fill="${C.ivory}" stroke="${ink}" stroke-width="4"/>` +
        T(x + 44, 740, n, { f: 'pop', size: 44, fill: ink, a: 'middle' }) + T(x + 82, 737, l, { f: 'mono', size: 26, fill: ink, ls: 2, w: 700 }), { dy: 14 });
    });
    const p = eo((t - W('dopamina') + 0.05) / 0.4);
    const ux = 960 - tw('è dopamina', 'pop', 72) / 2 + tw('è ', 'pop', 72);
    if (p > 0) s += `<rect x="${ux}" y="502" width="${tw('dopamina', 'pop', 72) * p}" height="10" rx="5" fill="${C.coral}"/>`;
    return s + caption(t, W('sfruttano'), 'Le app sfruttano', '', true);
  } }) });

// 6 — primo: le notifiche
scene('notifiche', { make: (W) => ({
  capAt: W('strategici'), last: W('non'),
  render(t) {
    let s = E(t, -0.4, stepBadge(1, 'PRIMO', 'le notifiche'), { dy: 0 });
    const px = 1000, py = 220, pw = 280, ph = 520, cx = px + pw / 2;
    s += E(t, -0.3, phoneSVG(px, py, pw, ph, C.line) + bell(cx, py + 250, 2.2, C.line), { dy: 0 });
    // vibrazione: archi che pulsano ai lati
    const v = (Math.sin(t * 18) > 0.2) && t > 0.2 && t < W('strategici') + 2;
    if (v) for (let i = 1; i <= 2; i++) s += `<path d="M${px - 20 * i - 10},${py + 200} q-16,60 0,120 M${px + pw + 20 * i + 10},${py + 200} q16,60 0,120" fill="none" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>`;
    s += E(t, W('strategici') - 0.1, pillTag(1400, 380, 'MOMENTI STRATEGICI', C.line, C.bg));
    s += E(t, W('non') - 0.05, pillTag(1400, 480, 'NON CASUALI', C.line, C.bg));
    return s + caption(t, W('strategici'), 'Momenti strategici', '');
  } }) });

// 7 — quando è più probabile che tu risponda
scene('orari', { make: (W) => ({
  capAt: W('risponda'), last: W('concentrano') + 0.6,
  render(t) {
    let s = '';
    const x0 = 260, x1 = 1660, ay = 560;
    s += E(t, -0.4, `<line x1="${x0}" y1="${ay}" x2="${x1}" y2="${ay}" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>` +
      [x0, 920, 1160, 1420, x1].map(x => `<line x1="${x}" y1="${ay - 14}" x2="${x}" y2="${ay + 14}" stroke="${C.line}" stroke-width="4"/>`).join('') +
      lbl(590, ay + 210, 'MATTINA') + lbl(1040, ay + 210, 'POMERIGGIO') + lbl(1540, ay + 210, 'SERA') +
      lbl(x0, 300, 'UNA GIORNATA', { a: 'start' }) + pillTag(x1, 300, 'ESEMPIO', C.line, C.bg, 'middle'), { dy: 0 });
    s += E(t, -0.3, `<rect x="${x0 + 30}" y="${ay - 110}" width="580" height="90" rx="12" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/>` + lbl(x0 + 320, ay - 54, 'SCUOLA'), { dy: 0 });
    // zone
    const zA = E(t, W('subito') - 0.1, `<rect x="925" y="${ay - 130}" width="230" height="290" rx="14" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="12 10"/>` + lbl(1040, ay - 160, 'DOPO LA SCUOLA'), { dy: 0 });
    const zB = E(t, W('sera') - 0.1, `<rect x="1425" y="${ay - 130}" width="230" height="290" rx="14" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="12 10"/>` + lbl(1540, ay - 160, 'SERA A LETTO'), { dy: 0 });
    s += zA + zB;
    // notifiche: sparse -> concentrate
    const m = eio((t - W('concentrano') + 0.05) / 0.65);
    for (let i = 0; i < 12; i++) {
      const xs = 300 + i * 118, j = i % 6, xt = (i < 6 ? 955 : 1455) + (j % 3) * 85, yt = ay + 50 + Math.floor(j / 3) * 62;
      const x = lerp(xs, xt, m), y = lerp(ay + 70, yt, m);
      s += E(t, -0.3 + i * 0.03, bell(x, y, 0.85, C.line, DIM()), { dy: 0 });
    }
    return s + caption(t, W('risponda'), 'Quando rispondi di più', 'rispondi');
  } }) });

// 8 — secondo: lo scroll infinito
scene('scroll', { make: (W) => ({
  capAt: W('fine'), last: W('caricare'),
  render(t) {
    let s = E(t, -0.4, stepBadge(2, 'SECONDO', 'lo scroll infinito'), { dy: 0 });
    const px = 960, py = 170, pw = 340, ph = 660;
    s += E(t, -0.3, phoneSVG(px, py, pw, ph, C.line) + feed(px + 14, py + 44, pw - 28, ph - 88, (t + 1) * 120, C.line, 'scr1'), { dy: 0 });
    s += E(t, -0.3, `<rect x="${px + 14}" y="${py + ph - 120}" width="${pw - 28}" height="76" fill="${C.bg}" stroke="${C.line}" stroke-width="2.5"/>` + spinner(px + pw / 2, py + ph - 82, 22, C.line, t), { dy: 0 });
    s += E(t, W('fine') - 0.1, `<rect x="1420" y="260" width="380" height="120" rx="16" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="12 10"/>` +
      T(1610, 334, 'HAI VISTO TUTTO', { f: 'mono', size: 28, a: 'middle', ls: 2, w: 700 }) +
      lbl(1610, 450, 'NON ARRIVA MAI'), { dy: 0 });
    s += E(t, W('caricare') - 0.1, arrow(1430, 680, px + pw + 24, py + ph - 82, C.line, 5) + lbl(1610, 640, 'CONTENUTI NUOVI') + lbl(1610, 690, 'IN CARICAMENTO'), { dy: 0 });
    return s + caption(t, W('fine'), 'Mai una fine', '');
  } }) });

// 9 — fermarsi vs continuare (registro chiaro)
scene('decisione', { make: (W) => ({
  capAt: W('minor'), last: W('resistenza'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(180, 150, 1560, 690), { dy: 0 });
    const fx = 520, fy = 470;
    // terreno: gradino in salita (fermarsi) e discesa (continuare)
    s += E(t, -0.3, `<line x1="260" y1="${fy}" x2="${fx}" y2="${fy}" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>`, { dy: 0 });
    s += E(t, W('fermarsi') - 0.05, `<path d="M${fx},${fy} H900 V330 H1180" fill="none" stroke="${ink}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="M890,330 V470" stroke="${ink}" stroke-width="2" stroke-dasharray="4 8"/>` + T(1040, 300, 'FERMARSI', { f: 'mono', size: 30, fill: ink, a: 'middle', ls: 4, w: 700 }), { dy: 0 });
    s += E(t, W('decisione') - 0.1, arrow(820, 440, 820, 350, ink, 5) + T(935, 405, 'una decisione attiva', { f: 'serif', it: true, size: 46, fill: ink }), { dy: 0 });
    const sx2 = 1580, sy2 = 760;
    s += E(t, W('continuare') - 0.15, `<path d="M${fx},${fy} C760,${fy} 900,560 1100,640 S1450,${sy2} ${sx2},${sy2}" fill="none" stroke="${C.coral}" stroke-width="9" stroke-linecap="round"/>` +
      T(1320, 610, 'CONTINUARE', { f: 'mono', size: 30, fill: ink, a: 'middle', ls: 4, w: 700 }), { dy: 0 });
    s += E(t, W('minor') - 0.05, T(1320, 560, 'minor resistenza', { f: 'serif', it: true, size: 50, fill: ink, a: 'middle' }), { dy: 0 });
    // pallina: ferma al bivio, poi rotola in discesa
    const r = eio((t - W('continuare')) / 1.6);
    const bez = (u) => { // percorso a tratti: C da (fx,fy) a (1100,640), poi S fino a (sx2,sy2)
      const B = (p0, p1, p2, p3, v) => [0, 1].map(k => Math.pow(1 - v, 3) * p0[k] + 3 * Math.pow(1 - v, 2) * v * p1[k] + 3 * (1 - v) * v * v * p2[k] + v * v * v * p3[k]);
      return u < 0.5 ? B([fx, fy], [760, fy], [900, 560], [1100, 640], u * 2) : B([1100, 640], [1300, 720], [1450, sy2], [sx2, sy2], u * 2 - 1);
    };
    const [bx, by] = bez(r);
    s += E(t, -0.3, `<circle cx="${bx.toFixed(1)}" cy="${(by - 34).toFixed(1)}" r="30" fill="${C.ivory}" stroke="${ink}" stroke-width="5"/>`, { dy: 0 });
    return s + caption(t, W('minor'), 'Minor resistenza', '', true);
  } }) });

// 10 — terzo: i like, a distanza di ore
scene('like', { make: (W) => ({
  capAt: W('distanza'), last: W('irregolare') - 0.4,
  render(t) {
    let s = E(t, -0.4, stepBadge(3, 'TERZO', 'i like e le reazioni'), { dy: 0 });
    const x0 = 760, x1 = 1760, ay = 640;
    s += E(t, W('arrivano') - 0.2, arrow(x0, ay, x1, ay, C.line, 5) + lbl(x1, ay + 70, 'ORE DOPO IL POST', { a: 'end' }) +
      `<rect x="${x0 - 10}" y="${ay - 64}" width="96" height="64" rx="10" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/>` + lbl(x0 + 38, ay - 22, 'POST') +
      pillTag(x0, 300, 'ESEMPIO', C.line, C.bg), { dy: 0 });
    const L = [[900, 0.0], [1010, 0.35], [1050, 0.55], [1290, 0.95], [1560, 1.35], [1610, 1.5], [1720, 1.85]];
    const t0 = W('distanza') - 0.4;
    L.forEach(([x, d], i) => { s += pop(t, t0 + d, x, ay - 60 - (i % 2) * 70, heart(x, ay - 60 - (i % 2) * 70, 1.25, C.line, DIM())); });
    return s + caption(t, W('distanza'), 'A distanza di ore', '');
  } }) });

// 11 — intervallo variabile: come una slot machine (registro chiaro)
scene('slot', { make: (W) => ({
  capAt: W('slot'), last: W('quindi'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(180, 150, 1560, 690), { dy: 0 });
    s += E(t, -0.3, T(260, 280, 'Ricompensa a', { f: 'pop', size: 60, fill: ink }) + T(260, 356, 'intervallo variabile', { f: 'pop', size: 60, fill: ink }), { dy: 12 });
    const u = eo((t - W('intervallo') + 0.05) / 0.5);
    if (u > 0) s += `<rect x="260" y="378" width="${(tw('intervallo variabile', 'pop', 60)) * u}" height="10" rx="5" fill="${C.coral}"/>`;
    s += E(t, W('slot') - 0.15, slotSVG(1180, 220, 1.0, ink, t - W('slot'), 'reel1', C.ivory) + T(1390, 800, 'SLOT MACHINE', { f: 'mono', size: 26, fill: ink, a: 'middle', ls: 3, w: 700 }), { dy: 14 });
    s += E(t, W('quando') - 0.1, T(260, 520, 'Quando arriverà la vincita?', { f: 'serif', it: true, size: 54, fill: ink }));
    s += E(t, W('sai') - 0.1, T(260, 590, 'NON LO SAI', { f: 'mono', size: 30, fill: ink, ls: 4, w: 700 }), { dy: 0 });
    s += E(t, W('quindi') - 0.1, T(260, 690, 'quindi continui a giocare', { f: 'serif', it: true, size: 54, fill: ink }));
    return s + caption(t, W('slot'), 'Come una slot machine', '', true);
  } }) });

// 12 — con i like: continui a controllare
scene('controlla', { make: (W) => ({
  capAt: W('continui'), last: W('controllare'),
  render(t) {
    let s = '';
    s += E(t, -0.4, slotSVG(240, 300, 0.62, C.line, t + 3, 'reel2', C.bg) + lbl(370, 690, 'SLOT MACHINE'), { dy: 0 });
    s += E(t, -0.3, pillTag(800, 470, 'STESSO PRINCIPIO', C.line, C.bg, 'middle'), { dy: 0 });
    const px = 1080, py = 190, pw = 300, ph = 600;
    s += E(t, -0.3, phoneSVG(px, py, pw, ph, C.line), { dy: 0 });
    s += E(t, -0.3, lbl(px + pw / 2, 850, 'I LIKE'), { dy: 0 });
    // il prossimo like: non sai quando
    s += E(t, W('prossimo') - 0.1, `<g>${heart(px + pw / 2, py + 270, 2.6, C.coral, 'none', 6)}</g>` + T(px + pw / 2, py + 300, '?', { f: 'pop', size: 80, a: 'middle' }) + IT(px + pw / 2, py + 470, 'il prossimo?', { a: 'middle', size: 46 }), { dy: 10 });
    // controlli ripetuti: il dito che riapre lo schermo, freccia che gira
    const tc = W('controllare') - 0.2;
    if (t > tc) {
      const a = (t - tc) * 4;
      const cx = 1620, cy = 470, r = 80;
      s += E(t, tc, `<path d="M${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} A${r},${r} 0 1 1 ${(cx + r * Math.cos(a - 1.2)).toFixed(1)},${(cy + r * Math.sin(a - 1.2)).toFixed(1)}" fill="none" stroke="${C.line}" stroke-width="7" stroke-linecap="round"/>` +
        `<circle cx="${(cx + r * Math.cos(a - 1.2)).toFixed(1)}" cy="${(cy + r * Math.sin(a - 1.2)).toFixed(1)}" r="12" fill="${C.line}"/>` + lbl(cx, cy + 150, 'CONTROLLI') + lbl(cx, cy + 195, 'DI NUOVO'), { dy: 0 });
    }
    return s + caption(t, W('continui'), 'Continui a controllare', '');
  } }) });

// 13 — cartello finale
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'La ricompensa che aspetti', { f: 'pop', size: 100, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('dopamina') - 0.25, 960, 560, "La dopamina arriva soprattutto nell'attesa.", { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: "nell'attesa" });
    s += E(t, W('dopamina') + 0.2, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC DIG-2-05', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
