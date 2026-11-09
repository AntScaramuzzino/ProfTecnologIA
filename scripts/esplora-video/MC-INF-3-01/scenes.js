// Dalla grandezza al dato — MC-INF-3-01 §"Cos'è un sensore: dalla grandezza fisica al dato digitale". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.35);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 44, fill: o.fill || C.line, a: o.a || 'start' });
const lblI = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.ink, ls: 3, a: o.a || 'middle', w: 700 });

// ---- mondo: componenti elettronici e strumenti di misura, in sezione a filo ----
// curva da funzione f(u) (u in 0..1 -> 0..1), disegnata fino alla frazione p
function fpath(x0, x1, y0, y1, f, p = 1, n = 240) {
  let d = ''; const m = Math.max(1, Math.round(n * clamp(p)));
  for (let i = 0; i <= m; i++) { const u = i / n; d += (i ? 'L' : 'M') + (x0 + (x1 - x0) * u).toFixed(1) + ',' + (y1 - (y1 - y0) * f(u)).toFixed(1); }
  return d;
}
const SIG = u => 0.5 + 0.27 * Math.sin(2 * Math.PI * 1.15 * u + 0.4) + 0.13 * Math.sin(2 * Math.PI * 2.9 * u + 1.1);
function thermo(cx, top, h, st, fill, lev, sw = 4) { // termometro: tubo + bulbo, livello 0..1
  const r = h * 0.13, w = r * 0.9, by = top + h - r;
  const ly = lerp(by - r * 0.6, top + w * 0.6, clamp(lev));
  return `<rect x="${cx - w / 2}" y="${top}" width="${w}" height="${h - r * 1.6}" rx="${w / 2}" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>` +
    `<circle cx="${cx}" cy="${by}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>` +
    `<circle cx="${cx}" cy="${by}" r="${r * 0.62}" fill="${st}"/><rect x="${cx - w * 0.22}" y="${ly}" width="${w * 0.44}" height="${by - ly}" fill="${st}"/>` +
    [0, 1, 2, 3].map(i => `<line x1="${cx + w / 2}" y1="${top + h * 0.12 + i * h * 0.15}" x2="${cx + w / 2 + 12}" y2="${top + h * 0.12 + i * h * 0.15}" stroke="${st}" stroke-width="3"/>`).join('');
}
function sun(cx, cy, r, st, fill) { // fonte di calore: sole con raggi
  let g = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="5"/>`;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g += `<line x1="${cx + Math.cos(a) * r * 1.3}" y1="${cy + Math.sin(a) * r * 1.3}" x2="${cx + Math.cos(a) * r * 1.65}" y2="${cy + Math.sin(a) * r * 1.65}" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`; }
  return g;
}
function gauge(cx, cy, r, st, fill) {
  let g = `<path d="M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy} Z" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
  for (let i = 0; i <= 6; i++) { const a = Math.PI + i * Math.PI / 6; g += `<line x1="${cx + Math.cos(a) * r * 0.78}" y1="${cy + Math.sin(a) * r * 0.78}" x2="${cx + Math.cos(a) * r * 0.94}" y2="${cy + Math.sin(a) * r * 0.94}" stroke="${st}" stroke-width="3"/>`; }
  const a = Math.PI * 1.7; return g + `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * r * 0.7}" y2="${cy + Math.sin(a) * r * 0.7}" stroke="${st}" stroke-width="5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="8" fill="${st}"/>`;
}
function bulb(cx, cy, s, st, fill) {
  let g = `<path d="M${cx - 22 * s},${cy + 30 * s} C${cx - 22 * s},${cy + 8 * s} ${cx - 44 * s},${cy - 4 * s} ${cx - 44 * s},${cy - 30 * s} A${44 * s},${44 * s} 0 0 1 ${cx + 44 * s},${cy - 30 * s} C${cx + 44 * s},${cy - 4 * s} ${cx + 22 * s},${cy + 8 * s} ${cx + 22 * s},${cy + 30 * s} Z" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>` +
    `<rect x="${cx - 20 * s}" y="${cy + 34 * s}" width="${40 * s}" height="${20 * s}" rx="4" fill="${fill}" stroke="${st}" stroke-width="4"/>`;
  for (let i = 0; i < 5; i++) { const a = Math.PI * (1.1 + i * 0.2); g += `<line x1="${cx + Math.cos(a) * 58 * s}" y1="${cy - 30 * s + Math.sin(a) * 58 * s}" x2="${cx + Math.cos(a) * 74 * s}" y2="${cy - 30 * s + Math.sin(a) * 74 * s}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`; }
  return g;
}
function accel(cx, cy, st, fill) {
  return `<rect x="${cx - 30}" y="${cy - 34}" width="68" height="68" rx="8" fill="${fill}" stroke="${st}" stroke-width="4"/>` +
    [-20, 0, 20].map(d => `<line x1="${cx - 90}" y1="${cy + d}" x2="${cx - 46 + Math.abs(d) * 0.6}" y2="${cy + d}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`).join('') +
    arrow(cx + 44, cy, cx + 100, cy, st, 5);
}
function drop(cx, cy, s, st, fill) {
  return `<path d="M${cx},${cy - 56 * s} C${cx + 14 * s},${cy - 30 * s} ${cx + 40 * s},${cy - 4 * s} ${cx + 40 * s},${cy + 18 * s} A${40 * s},${40 * s} 0 0 1 ${cx - 40 * s},${cy + 18 * s} C${cx - 40 * s},${cy - 4 * s} ${cx - 14 * s},${cy - 30 * s} ${cx},${cy - 56 * s} Z" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
}
function heart(cx, cy, st, fill) {
  return `<path d="M${cx},${cy + 46} C${cx - 70},${cy} ${cx - 64},${cy - 50} ${cx - 30},${cy - 50} C${cx - 12},${cy - 50} ${cx},${cy - 38} ${cx},${cy - 26} C${cx},${cy - 38} ${cx + 12},${cy - 50} ${cx + 30},${cy - 50} C${cx + 64},${cy - 50} ${cx + 70},${cy} ${cx},${cy + 46} Z" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M${cx - 80},${cy - 4} h46 l10,-22 l14,46 l12,-36 l8,12 h70" fill="none" stroke="${st}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
}
function cloud(cx, cy, st, fill) {
  return `<path d="M${cx - 60},${cy + 26} A26,26 0 0 1 ${cx - 50},${cy - 22} A34,34 0 0 1 ${cx + 10},${cy - 34} A30,30 0 0 1 ${cx + 62},${cy - 6} A22,22 0 0 1 ${cx + 60},${cy + 26} Z" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>` +
    [[-30, 50], [0, 60], [30, 48], [-14, 72], [18, 76]].map(([x, y]) => `<circle cx="${cx + x}" cy="${cy + y}" r="5" fill="${st}"/>`).join('');
}
function bead(cx, cy, s, st, fill) { // termistore: perlina con due reofori
  return `<path d="M${cx - 18 * s},${cy + 30 * s} V${cy + 200 * s} M${cx + 18 * s},${cy + 30 * s} V${cy + 200 * s}" stroke="${st}" stroke-width="${6 * s}" stroke-linecap="round"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${56 * s}" ry="${50 * s}" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<path d="M${cx - 18 * s},${cy + 46 * s} V${cy - 10 * s} M${cx + 18 * s},${cy + 46 * s} V${cy - 10 * s}" stroke="${C.bg}" stroke-width="${4 * s}" stroke-dasharray="6 6" opacity="0.7"/>`;
}
function thSym(cx, cy, w, h, st, fill, vert) { // simbolo del termistore: resistore + tratto obliquo con piede
  const W2 = vert ? h : w, H2 = vert ? w : h;
  let g = `<rect x="${cx - W2 / 2}" y="${cy - H2 / 2}" width="${W2}" height="${H2}" fill="${fill}" stroke="${st}" stroke-width="4"/>`;
  const L = Math.max(W2, H2) * 0.62;
  g += `<path d="M${cx - L / 2 - 26},${cy + L / 2} h26 L${cx + L / 2},${cy - L / 2}" fill="none" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
  return g;
}
function plotAxes(x0, y0, x1, y1, st) {
  return `<path d="M${x0},${y0 - 10} V${y1} H${x1 + 10}" fill="none" stroke="${st}" stroke-width="4"/>` + `<path d="M${x0},${y0 - 22} l-9,16 h18 z M${x1 + 22},${y1} l-16,-9 v18 z" fill="${st}"/>`;
}
function knob(cx, cy, r, ang, st, fill) {
  let g = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="none" stroke="${st}" stroke-width="3"/>`;
  for (let i = 0; i <= 8; i++) { const a = Math.PI * (0.75 + i * 1.5 / 8); g += `<line x1="${cx + Math.cos(a) * (r + 10)}" y1="${cy + Math.sin(a) * (r + 10)}" x2="${cx + Math.cos(a) * (r + 22)}" y2="${cy + Math.sin(a) * (r + 22)}" stroke="${st}" stroke-width="3"/>`; }
  return g + `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(ang) * r * 0.62}" y2="${cy + Math.sin(ang) * r * 0.62}" stroke="${st}" stroke-width="7" stroke-linecap="round"/>`;
}
const DIMC = () => mix(C.bg, C.line, 0.28);

// 1 — dalla grandezza al segnale
scene('intro', { make: (W) => ({
  capAt: W('converte'), last: W('converte') + 0.95,
  render(t) {
    const st = C.line; let s = '';
    // grandezza fisica: calore che sale
    s += E(t, 0.1, sun(310, 440, 60, st, C.bg) +
      [0, 1, 2].map(i => `<path d="M${410 + i * 34},${560} c-18,-30 18,-50 0,-80 c-18,-30 18,-50 0,-80" fill="none" stroke="${st}" stroke-width="4" stroke-linecap="round" opacity="0.85"/>`).join(''), { dy: 14 });
    s += E(t, W('grandezza') - 0.1, lbl(370, 700, 'TEMPERATURA') + IT(370, 752, 'grandezza fisica', { size: 38, a: 'middle' }), { dy: 0 });
    s += E(t, W('rileva') - 0.1, arrow(560, 450, 740, 450, st, 4), { dy: 0 });
    // sensore (corallo): perlina su basetta in sezione
    s += E(t, W('sensore') - 0.15, `<rect x="820" y="560" width="280" height="40" rx="6" fill="${mix(C.bg, C.line, 0.12)}" stroke="${st}" stroke-width="3"/>` + bead(960, 400, 1, C.coral, C.coral), { dy: 16 });
    s += E(t, W('sensore') + 0.1, lbl(960, 700, 'SENSORE'), { dy: 0 });
    s += E(t, W('converte') - 0.1, arrow(1170, 450, 1300, 450, st, 4), { dy: 0 });
    // segnale elettrico su uno schermo
    s += E(t, W('converte'), `<rect x="1330" y="320" width="400" height="260" rx="16" fill="${C.bg}" stroke="${st}" stroke-width="4"/>` +
      [1, 2, 3].map(i => `<line x1="${1330 + i * 100}" y1="326" x2="${1330 + i * 100}" y2="574" stroke="${DIMC()}" stroke-width="2"/>`).join(''), { dy: 0 });
    const p = clamp((t - W('converte') - 0.1) / 0.8);
    if (p > 0) s += `<path d="${fpath(1350, 1710, 350, 550, u => SIG(u + t * 0.05), p)}" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
    s += E(t, W('segnale') - 0.1, lbl(1530, 700, 'SEGNALE ELETTRICO'), { dy: 0 });
    return s + caption(t, W('converte'), 'Dalla grandezza al segnale', '');
  } }) });

// 2 — le grandezze fisiche (registro chiaro)
scene('grandezze', { make: (W) => ({
  capAt: W('temperatura'), last: W('qualità'),
  render(t) {
    const ink = C.ink, f = C.ivory; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 680), { dy: 0 });
    s += E(t, -0.3, lblI(960, 214, 'GRANDEZZE FISICHE', { size: 28 }), { dy: 0 });
    const it = [
      ['temperatura', 400, 340, 'TEMPERATURA', () => thermo(400, 250, 180, ink, f, 0.55)],
      ['pressione', 773, 340, 'PRESSIONE', () => gauge(773, 370, 80, ink, f)],
      ['luminosità', 1146, 340, 'LUMINOSITÀ', () => bulb(1146, 350, 1, ink, f)],
      ['accelerazione', 1520, 340, 'ACCELERAZIONE', () => accel(1505, 340, ink, f)],
      ['umidità', 587, 620, 'UMIDITÀ', () => drop(587, 620, 1, ink, f)],
      ['frequenza', 960, 620, 'FREQUENZA CARDIACA', () => heart(960, 615, ink, f)],
      ['qualità', 1333, 620, "QUALITÀ DELL'ARIA", () => cloud(1333, 590, ink, f)],
    ];
    it.forEach(([w, x, y, lab, ic]) => {
      const t0 = W(w) - 0.05;
      s += pop(t, t0, x, y, ic());
      s += E(t, t0 + 0.1, lblI(x, y < 500 ? 480 : 755, lab), { dy: 8 });
    });
    return s + caption(t, W('temperatura'), 'Temperatura, pressione, luminosità…', '', true);
  } }) });

// 3 — due fasi
scene('fasi', { make: (W) => ({
  capAt: W('due'), last: W('analogicodigitale'),
  render(t) {
    const st = C.line; let s = '';
    s += E(t, 0.1, sun(195, 440, 40, st, C.bg) + lbl(200, 620, 'TEMPERATURA') + IT(200, 666, 'grandezza fisica', { size: 34, a: 'middle' }), { dy: 12 });
    s += E(t, 0.3, arrow(270, 440, 360, 440, st, 4), { dy: 0 });
    const box = (x, n, a, b, t0) => E(t, t0, `<rect x="${x}" y="330" width="380" height="220" rx="18" fill="${C.bg}" stroke="${st}" stroke-width="4"/>` +
      `<circle cx="${x + 190}" cy="395" r="38" fill="none" stroke="${st}" stroke-width="4"/>` + T(x + 190, 410, n, { f: 'pop', size: 42, a: 'middle' }) +
      lbl(x + 190, 482, a, { size: 28 }) + (b ? lbl(x + 190, 520, b, { size: 26 }) : ''), { dy: 16 });
    s += box(380, '1', 'TRASDUZIONE', '', W('trasduzione') - 0.1);
    s += E(t, W('trasduzione') + 0.3, arrow(775, 440, 1025, 440, st, 4) + `<path d="${fpath(790, 1000, 340, 410, SIG)}" fill="none" stroke="${st}" stroke-width="4"/>` + lbl(900, 620, 'ANALOGICO'), { dy: 0 });
    s += box(1040, '2', 'CONVERSIONE', 'ANALOGICO-DIGITALE', W('conversione') - 0.1);
    let steps = 'M1545,410'; for (let i = 0; i < 7; i++) { const y = 410 - Math.round(SIG(i / 6) * 4) * 18; steps += ` V${y} h30`; }
    s += E(t, W('analogicodigitale'), arrow(1435, 440, 1525, 440, st, 4) + `<path d="${steps}" fill="none" stroke="${st}" stroke-width="4"/>` + lbl(1650, 620, 'DIGITALE'), { dy: 0 });
    return s + caption(t, W('due'), 'Due fasi', 'Due');
  } }) });

// 4 — il termistore
scene('termistore', { make: (W) => ({
  capAt: W('varia'), last: W('funzione'),
  render(t) {
    const st = C.line; let s = '';
    s += E(t, 0.15, bead(470, 360, 1.25, C.coral, C.coral), { dy: 16 });
    s += E(t, W('sensore') - 0.1, lbl(470, 720, 'SENSORE DI TEMPERATURA'), { dy: 0 });
    s += E(t, W('termistore') - 0.1, IT(470, 790, 'il termistore', { a: 'middle' }), { dy: 0 });
    // simbolo elettrico: resistenza variabile con la temperatura
    s += E(t, W('resistenza') - 0.15, `<line x1="1000" y1="400" x2="1120" y2="400" stroke="${st}" stroke-width="4"/><line x1="1400" y1="400" x2="1520" y2="400" stroke="${st}" stroke-width="4"/>` +
      thSym(1260, 400, 280, 90, st, C.bg) + IT(1440, 330, 't°', { size: 52 }) + lbl(1260, 530, 'RESISTENZA ELETTRICA'), { dy: 14 });
    s += E(t, W('resistenza') - 0.15, `<path d="M640,400 H900" stroke="${st}" stroke-width="3" stroke-dasharray="10 10"/>` + IT(770, 380, 'simbolo', { size: 38, a: 'middle' }), { dy: 0 });
    // in funzione della temperatura
    s += E(t, W('funzione') - 0.1, sun(1620, 700, 36, st, C.bg) + lbl(1620, 800, 'TEMPERATURA') +
      arrow(1590, 650, 1410, 452, st, 4), { dy: 10 });
    return s + caption(t, W('varia'), 'La resistenza varia', '');
  } }) });

// 5 — variazione di tensione (registro chiaro)
scene('tensione', { make: (W) => ({
  capAt: W('variazione', 1), last: W('tensione'),
  render(t) {
    const ink = C.ink, f = C.ivory; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 680), { dy: 0 });
    // circuito: pila, resistore R, termistore, voltmetro in parallelo al termistore
    s += E(t, -0.3, `<path d="M260,470 V280 H760 V430 M760,550 V700 H260 V510" fill="none" stroke="${ink}" stroke-width="4"/>` +
      `<line x1="226" y1="470" x2="294" y2="470" stroke="${ink}" stroke-width="5"/><line x1="244" y1="510" x2="276" y2="510" stroke="${ink}" stroke-width="9"/>` +
      `<rect x="450" y="260" width="120" height="40" fill="${f}" stroke="${ink}" stroke-width="4"/>` + T(510, 240, 'R', { f: 'pop', size: 34, fill: ink, a: 'middle' }) +
      thSym(760, 490, 120, 44, ink, f, true) + T(830, 440, 't°', { f: 'serif', it: true, size: 44, fill: ink }) +
      lblI(200, 420, 'PILA', { a: 'middle' }), { dy: 0 });
    s += E(t, W('caldo') - 0.1, [0, 1, 2].map(i => `<path d="M${640 + i * 30},560 c-14,-22 14,-38 0,-60 c-14,-22 14,-38 0,-60" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`).join('') +
      T(520, 640, 'più caldo', { f: 'serif', it: true, size: 40, fill: ink, a: 'middle' }), { dy: 10 });
    s += E(t, W('cambia') - 0.1, T(520, 770, 'la resistenza cambia', { f: 'serif', it: true, size: 40, fill: ink, a: 'middle' }), { dy: 10 });
    s += E(t, W('traduce') - 0.1, `<path d="M760,400 H900 V446 M900,534 V580 H760" fill="none" stroke="${ink}" stroke-width="4"/><circle cx="900" cy="490" r="44" fill="${f}" stroke="${ink}" stroke-width="4"/>` +
      T(900, 506, 'V', { f: 'pop', size: 42, fill: ink, a: 'middle' }), { dy: 10 });
    // grafico della tensione nel tempo
    s += E(t, W('traduce'), plotAxes(1060, 280, 1680, 700, ink) + lblI(1084, 270, 'TENSIONE', { a: 'start' }) + lblI(1680, 750, 'TEMPO', { a: 'end' }) +
      pillTag(1540, 300, 'ESEMPIO · NTC', ink, f, 'middle'), { dy: 0 });
    const p = clamp((t - W('traduce') - 0.2) / 2.2);
    if (p > 0) s += `<path d="${fpath(1070, 1660, 350, 680, u => 0.72 - 0.45 * eio(u * 1.3 - 0.15) + 0.05 * Math.sin(u * 9), p)}" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
    return s + caption(t, W('variazione', 1), 'Variazione di tensione', '', true);
  } }) });

// grafico condiviso: segnale analogico e livelli
const PX0 = 300, PX1 = 1640, PY0 = 260, PY1 = 760, NL = 8, NS = 24;
const py = v => PY1 - (PY1 - PY0) * v;
const qv = v => Math.round(clamp(v) * (NL - 1)) / (NL - 1);

// 6 — analogico -> digitale
scene('adc', { make: (W) => ({
  capAt: W('digitale'), last: W('finito'),
  render(t) {
    const st = C.line; let s = '';
    s += E(t, -0.2, plotAxes(PX0, PY0, PX1 + 20, PY1, st), { dy: 0 });
    const p = clamp((t - 0.2) / 1.4);
    s += `<path d="${fpath(PX0, PX1, PY0, PY1, SIG, p)}" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
    s += E(t, W('continuo') - 0.1, lbl(PX0, 200, 'ANALOGICO', { a: 'start' }) + IT(PX0 + 230, 202, '— continuo'), { dy: 0 });
    s += E(t, W('infiniti') - 0.1, IT(PX0 + 470, 202, 'infiniti valori'), { dy: 0 });
    // livelli finiti
    const lv = E(t, W('numero') - 0.2, Array.from({ length: NL }, (_, i) => `<line x1="${PX0}" y1="${py(i / (NL - 1))}" x2="${PX1 + 20}" y2="${py(i / (NL - 1))}" stroke="${DIMC()}" stroke-width="2" stroke-dasharray="6 8"/>` +
      T(PX0 - 30, py(i / (NL - 1)) + 9, String(i), { f: 'mono', size: 26, a: 'end', fill: st })).join(''), { dy: 0 });
    s = lv + s;
    const q = clamp((t - W('trasforma')) / 1.6);
    if (q > 0) {
      // campione al centro di ogni intervallo, arrotondato al livello più vicino
      const N2 = 32, m = Math.ceil(N2 * q); let d = '', dots = '';
      for (let i = 0; i < m; i++) { const u = (i + 0.5) / N2, x = PX0 + (PX1 - PX0) * i / N2, y = py(qv(SIG(u))); d += (i ? `V${y}` : `M${x},${y}`) + `H${PX0 + (PX1 - PX0) * (i + 1) / N2}`;
        dots += `<circle cx="${PX0 + (PX1 - PX0) * u}" cy="${py(SIG(u))}" r="6" fill="${st}"/>`; }
      s += `<path d="${d}" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linejoin="round"/>` + dots;
    }
    s += E(t, W('digitale') - 0.1, lbl(PX1 + 20, 200, 'DIGITALE', { a: 'end' }), { dy: 0 });
    s += E(t, W('finito') - 0.1, IT(PX1 - 170, 202, 'valori finiti —', { a: 'end' }), { dy: 0 });
    s += E(t, W('numero'), pillTag(PX1 - 60, 838, 'ESEMPIO', st, C.bg, 'middle'), { dy: 0 });
    return s + caption(t, W('digitale'), 'Da infiniti a finiti', '');
  } }) });

// 7 — campionamento
scene('campiona', { make: (W) => ({
  capAt: W('due'), last: W('quantizzazione'),
  render(t) {
    const st = C.line; let s = '';
    const A0 = 200, A1 = 860, B0 = 1060, B1 = 1720, Y0 = 330, Y1 = 700, yy = v => Y1 - (Y1 - Y0) * v;
    // pannello 1: campionamento = QUANDO si misura (aste nel tempo)
    s += plotAxes(A0, Y0, A1 + 10, Y1, st) + `<path d="${fpath(A0, A1, Y0, Y1, SIG)}" fill="none" stroke="${DIMC()}" stroke-width="4"/>`;
    const a = W('quanto') - 0.1, p = clamp((t - a) / (W('campionamento') + 0.3 - a)), cx = A0 + (A1 - A0) * eio(p), NSa = 16;
    if (t > a) {
      for (let i = 0; i <= NSa; i++) {
        const x = A0 + (A1 - A0) * i / NSa; if (x > cx + 0.5) break;
        const y = yy(SIG(i / NSa));
        s += `<line x1="${x}" y1="${Y1}" x2="${x}" y2="${y}" stroke="${st}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="8" fill="${st}"/>`;
      }
      s += `<line x1="${cx}" y1="${Y0 - 10}" x2="${cx}" y2="${Y1}" stroke="${C.coral}" stroke-width="5"/>`;
    }
    s += E(t, W('quanto') - 0.1, pillTag((A0 + A1) / 2, 254, '1 · CAMPIONAMENTO', st, C.bg, 'middle') + IT((A0 + A1) / 2, 790, 'quanto spesso si misura', { size: 40, a: 'middle' }), { dy: 10 });
    // pannello 2: quantizzazione = CON QUANTI LIVELLI (righe nei valori)
    s += plotAxes(B0, Y0, B1 + 10, Y1, st) + `<path d="${fpath(B0, B1, Y0, Y1, SIG)}" fill="none" stroke="${DIMC()}" stroke-width="4"/>`;
    s += E(t, W('quanti') - 0.15, Array.from({ length: NL }, (_, i) => `<line x1="${B0}" y1="${yy(i / (NL - 1))}" x2="${B1 + 10}" y2="${yy(i / (NL - 1))}" stroke="${st}" stroke-width="3" stroke-dasharray="10 10"/>`).join('') +
      pillTag((B0 + B1) / 2, 254, '2 · QUANTIZZAZIONE', st, C.bg, 'middle') + IT((B0 + B1) / 2, 790, 'con quanti livelli', { size: 40, a: 'middle' }), { dy: 10 });
    return s + caption(t, W('due'), 'Due parametri', '');
  } }) });

// 8 — frequenza di campionamento (registro chiaro)
scene('frequenza', { make: (W) => ({
  capAt: W('campiona'), last: W('misure'),
  render(t) {
    const ink = C.ink, f = C.ivory; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 680), { dy: 0 });
    const X0 = 260, X1 = 1660, Y0 = 240, Y1 = 500, G = u => 0.5 + 0.4 * Math.sin(2 * Math.PI * 3 * u);
    s += E(t, -0.3, `<path d="${fpath(X0, X1, Y0, Y1, G)}" fill="none" stroke="${mix(C.ink, C.ivory, 0.55)}" stroke-width="3"/>` +
      `<line x1="${X0}" y1="560" x2="${X1}" y2="560" stroke="${ink}" stroke-width="4"/><line x1="${X0}" y1="540" x2="${X0}" y2="580" stroke="${ink}" stroke-width="4"/><line x1="${X1}" y1="540" x2="${X1}" y2="580" stroke="${ink}" stroke-width="4"/>` +
      T(X1, 210, 'segnale di esempio', { f: 'serif', it: true, size: 36, fill: ink, a: 'end' }), { dy: 0 });
    s += E(t, W('secondo') - 0.1, lblI((X0 + X1) / 2, 625, '1 SECONDO', { size: 28 }), { dy: 0 });
    const a = W('quante'), b = W('100'), p = clamp((t - a) / (b - a)), n = Math.floor(100 * p + 1e-6);
    for (let i = 0; i < n; i++) {
      const x = X0 + (X1 - X0) * (i + 0.5) / 100, y = Y1 - (Y1 - Y0) * G((i + 0.5) / 100);
      s += `<line x1="${x}" y1="548" x2="${x}" y2="572" stroke="${ink}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="5" fill="${ink}"/>`;
    }
    if (t > a) s += T(940, 790, String(n), { f: 'pop', size: 120, fill: C.coralD, a: 'end' });
    s += E(t, W('misure') - 0.1, lblI(980, 735, 'MISURE', { a: 'start', size: 30 }) + lblI(980, 785, 'PER SECONDO', { a: 'start', size: 30 }), { dy: 8 });
    return s + caption(t, W('campiona'), '100 misure per secondo', '', true);
  } }) });

// 9 — risoluzione: 8 bit, 256 livelli
scene('risoluzione', { make: (W) => ({
  capAt: W('256'), last: W('livelli'),
  render(t) {
    const st = C.line; let s = '';
    const bits = '10010110';
    s += E(t, W('ogni') - 0.1, lbl(540, 300, 'OGNI MISURA'), { dy: 0 });
    for (let i = 0; i < 8; i++) {
      const x = 222 + i * 80;
      s += E(t, 0.1 + i * 0.05, `<rect x="${x}" y="340" width="68" height="84" rx="8" fill="${C.bg}" stroke="${st}" stroke-width="4"/>`, { dy: 10 });
      s += E(t, W('bit') - 0.1 + i * 0.06, T(x + 34, 397, bits[i], { f: 'mono', size: 40, a: 'middle', w: 700 }), { dy: 6 });
    }
    s += E(t, W('bit') + 0.5, pillTag(540, 486, 'ESEMPIO', st, C.bg, 'middle'), { dy: 0 });
    s += E(t, W('8') - 0.05, lbl(540, 560, '8 BIT', { size: 34 }), { dy: 8 });
    s += E(t, W('256') - 0.05, T(540, 720, '256', { f: 'pop', size: 140, a: 'middle' }), { dy: 14 });
    s += E(t, W('livelli') - 0.1, lbl(540, 790, 'LIVELLI', { size: 30 }), { dy: 0 });
    // scala dei 256 livelli
    const q = clamp((t - W('256') + 0.1) / 1.0), RY0 = 180, RY1 = 820, n = Math.floor(256 * eo(q));
    let r = '';
    for (let i = 0; i < n; i++) { const y = RY1 - (RY1 - RY0) * i / 255; r += `M1200,${y.toFixed(1)}h${i % 32 === 0 ? 300 : 240}`; }
    if (n) s += `<path d="${r}" stroke="${st}" stroke-width="1" opacity="0.8"/>`;
    s += E(t, 0.3, `<rect x="1188" y="${RY0 - 12}" width="324" height="${RY1 - RY0 + 24}" rx="8" fill="none" stroke="${st}" stroke-width="3"/>`, { dy: 0 });
    return s + caption(t, W('256'), '8 bit, 256 livelli', '256');
  } }) });

// 10 — 12 e 16 bit (registro chiaro)
scene('livelli', { make: (W) => ({
  capAt: W('16'), last: W('65536'),
  render(t) {
    const ink = C.ink; let s = lightBg();
    const col = (x, b, n, tb, tn, key) => E(t, tb, card(x, 230, 460, 440) + lblI(x + 230, 310, b + ' BIT', { size: 34 }), { dy: 16 }) +
      E(t, tn, T(x + 230, 500, n, { f: 'pop', size: 104, fill: key ? C.coralD : ink, a: 'middle' }) + lblI(x + 230, 580, 'LIVELLI'), { dy: 12 });
    s += col(170, '8', '256', -0.3, -0.2, false);
    s += col(730, '12', '4096', W('12') - 0.1, W('4096') - 0.05, false);
    s += col(1290, '16', '65536', W('16') - 0.1, W('65536') - 0.05, true);
    s += E(t, W('65536') + 0.6, T(960, 790, 'ogni bit in più raddoppia i livelli', { f: 'serif', it: true, size: 54, fill: ink, a: 'middle' }), { dy: 10 });
    return s + caption(t, W('16'), '12 e 16 bit', '', true);
  } }) });

// 11 — la scelta dei parametri
scene('scelta', { make: (W) => ({
  capAt: W('qualità'), last: W('quantità') + 1.0,
  render(t) {
    const st = C.line; let s = '';
    const k = eio((t - W('qualità')) / (W('quantità') + 1.0 - W('qualità'))), a1 = Math.PI * (0.8 + 1.4 * k), a2 = a1;
    s += E(t, 0.1, knob(400, 330, 90, a1, st, C.bg) + lbl(560, 340, 'FREQUENZA', { a: 'start' }) + E(t, W('qualità'), IT(560, 400, 'più alta', { size: 36 }), { dy: 0 }), { dy: 12 });
    s += E(t, 0.3, knob(400, 640, 90, a2, st, C.bg) + lbl(560, 650, 'RISOLUZIONE', { a: 'start' }) + E(t, W('qualità'), IT(560, 710, 'più bit', { size: 36 }), { dy: 0 }), { dy: 12 });
    s += E(t, W('determina') - 0.1, `<path d="M890,300 h30 V670 h-30" fill="none" stroke="${st}" stroke-width="4"/>` + arrow(930, 485, 1080, 485, st, 5) + IT(1005, 455, 'determina', { size: 38, a: 'middle' }), { dy: 0 });
    // qualità del dato: segnale ricostruito fedele
        // più frequenza e più bit: dato più fedele (gradini più fitti) ma anche più dati (pila più alta)
    const ns = Math.round(4 + 20 * k), nl = Math.round(3 + 9 * k); let d = '';
    for (let i = 0; i < ns; i++) { const u = (i + 0.5) / ns, y = 390 - 130 * Math.round(SIG(u) * (nl - 1)) / (nl - 1); d += (i ? `V${y}` : `M1150,${y}`) + `H${1150 + 210 * (i + 1) / ns}`; }
    s += E(t, W('qualità') - 0.1, `<rect x="1130" y="240" width="250" height="170" rx="14" fill="${C.bg}" stroke="${st}" stroke-width="4"/><path d="${fpath(1150, 1360, 260, 390, SIG)}" fill="none" stroke="${DIMC()}" stroke-width="3"/><path d="${d}" fill="none" stroke="${st}" stroke-width="4"/>` +
      lbl(1420, 316, 'QUALITÀ', { a: 'start' }) + lbl(1420, 356, 'DEL DATO', { a: 'start' }), { dy: 12 });
    // quantità di dati: pila di blocchi
    s += E(t, W('quantità') - 0.1, Array.from({ length: 1 + Math.round(4 * k) }, (_, i) => i).map(i => `<rect x="${1160 + (i % 2) * 14}" y="${690 - i * 44}" width="190" height="38" rx="6" fill="${C.bg}" stroke="${st}" stroke-width="4"/>`).join('') +
      lbl(1420, 660, 'QUANTITÀ', { a: 'start' }) + lbl(1420, 700, 'DI DATI', { a: 'start' }), { dy: 12 });
    return s + caption(t, W('qualità'), 'Qualità e quantità', 'quantità');
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Dalla grandezza al dato', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('così') - 0.1, 960, 545, 'Una grandezza fisica', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true });
    s += words(t, W('diventa') - 0.1, 960, 630, 'diventa un dato digitale.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'digitale', keyFill: C.coralD });
    s += E(t, W('digitale') + 0.2, `<line x1="760" y1="700" x2="1160" y2="700" stroke="${C.ink}" stroke-width="3"/>` + T(960, 760, 'PROFTECNOLOGIA · MC-INF-3-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
  const tz = S.id === 'finale' ? Math.min(t, S.L + S.sc.voce_dur) : t;
  inner = `<g transform="translate(960,540) scale(${1 + 0.025 * tz / S.D}) translate(-960,-540)">${inner}</g>`;
  body += inner;
  if (S.id !== 'finale') body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
