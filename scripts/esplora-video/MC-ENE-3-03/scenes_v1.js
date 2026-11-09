// L'energia idroelettrica: l'acqua che scende — MC-ENE-3-03. render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.4);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.6);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const WATER = mix(C.bg, C.line, 0.16), DIM2 = mix(C.bg, C.line, 0.2);
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const P = pts => 'M' + pts.map(p => p.join(',')).join(' L');

// ---- mondo: valle in sezione, a filo chiaro ----
// flusso: trattini che scorrono lungo il percorso, nel verso dei punti (dashoffset negativo = verso la fine)
function flowLine(pts, t, c, o = {}) {
  const sw = o.sw || 6, sp = o.sp || 220, da = o.da || '18 22';
  return `<path d="${P(pts)}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${da}" stroke-dashoffset="${(-t * sp).toFixed(1)}"${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
}
function pipe(pts, w = 34, st = C.line, inner = C.bg) {
  return `<path d="${P(pts)}" fill="none" stroke="${st}" stroke-width="${w}" stroke-linejoin="round"/><path d="${P(pts)}" fill="none" stroke="${inner}" stroke-width="${w - 9}" stroke-linejoin="round"/>`;
}
function pylon(x, yb, yt, st) {
  const hw = 46;
  let s = `<path d="M${x - hw},${yb} L${x - 8},${yt} L${x + 8},${yt} L${x + hw},${yb}" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 1; i < 5; i++) { const y = yb - (yb - yt) * i / 5, w = hw - (hw - 8) * i / 5, y2 = yb - (yb - yt) * (i - 1) / 5, w2 = hw - (hw - 8) * (i - 1) / 5; s += `<path d="M${x - w2},${y2} L${x + w},${y} M${x + w2},${y2} L${x - w},${y}" stroke="${st}" stroke-width="2.5"/>`; }
  s += `<line x1="${x - 56}" y1="${yt + 30}" x2="${x + 56}" y2="${yt + 30}" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
  return s;
}
function waves(x1, x2, y, st, n = 3) {
  let s = '';
  for (let i = 0; i < n; i++) { const yy = y + 22 + i * 30, a = x1 + 40 + i * 30, b = x2 - 40 - i * 20; if (b - a < 60) break; s += `<path d="M${a},${yy} q20,-9 40,0 t40,0" fill="none" stroke="${C.line}" stroke-width="2.5" opacity="0.55"/>`; }
  return s;
}
const PEN = [[598, 445], [735, 485], [1170, 775], [1236, 775]];
function valley(t, o = {}) {
  const dim = o.dim || 1;
  let s = `<path d="M0,220 L140,220 L170,300 L200,470 L598,470 L725,505 L1160,800 L1220,832 L1440,832 L1460,852 L1920,852 L1920,1080 L0,1080 Z" fill="${C.earth}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round" opacity="${dim}"/>`;
  s += `<path d="M168,300 L200,470 L598,470 L598,300 Z" fill="${WATER}"/><line x1="168" y1="300" x2="598" y2="300" stroke="${C.line}" stroke-width="3"/>` + waves(168, 598, 300, C.line);
  s += `<path d="M598,250 L640,250 L725,505 L598,470 Z" fill="${DIM2}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round" opacity="${dim}"/>`;
  s += `<g opacity="${dim}">` + pipe(PEN) + `</g>`;
  // centrale
  s += `<g opacity="${dim}"><rect x="1220" y="690" width="220" height="142" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/><path d="M1206,690 L1330,654 L1454,690" fill="none" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>` +
    `<circle cx="1290" cy="775" r="26" fill="none" stroke="${C.line}" stroke-width="4"/><rect x="1266" y="708" width="48" height="36" rx="4" fill="${DIM2}" stroke="${C.line}" stroke-width="3"/><line x1="1290" y1="744" x2="1290" y2="749" stroke="${C.line}" stroke-width="4"/></g>`;
  // canale di scarico verso il fiume
  s += `<path d="M1440,834 L1920,834 L1920,852 L1460,852 Z" fill="${WATER}"/>`;
  if (o.out) s += flowLine([[1450, 843], [1910, 843]], t, C.line, { sw: 4, sp: 120, da: '14 26', op: 0.8 });
  s += `<g opacity="${dim}">` + pylon(1700, 834, 560, C.line) + `</g>`;
  return s;
}
function wire(t, on, rev) {
  const pts = [[1440, 712], [1550, 640], [1644, 590]], pts2 = [[1756, 590], [1920, 575]];
  let s = `<path d="${P(pts)}" fill="none" stroke="${C.line}" stroke-width="3"/><path d="${P(pts2)}" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  if (on) s += flowLine(pts, t, C.line, { sw: 7, sp: 160, da: '10 30' }) + flowLine(pts2, t, C.line, { sw: 7, sp: 160, da: '10 30' });
  return s;
}
function vArrow(x, y1, y2, c, sw = 5) { // doppia freccia di quota
  return `<line x1="${x}" y1="${y1 + 10}" x2="${x}" y2="${y2 - 10}" stroke="${c}" stroke-width="${sw}"/>` +
    `<path d="M${x},${y1} l-13,22 h26 z M${x},${y2} l-13,-22 h26 z" fill="${c}"/>`;
}

// 1 — aggancio: la centrale idroelettrica nella valle
scene('hook', { make: (W) => ({
  capAt: W('elettrica'), last: W('elettrica'),
  render(t) {
    let s = E(t, -0.3, valley(t, { out: t > W('trasforma') }), { dy: 0, blur: 6 });
    s += E(t, 0.1, lbl(385, 268, 'LAGO ARTIFICIALE'), { dy: 8 });
    s += E(t, 0.3, lbl(626, 226, 'DIGA'), { dy: 8 });
    s += E(t, W('centrale') - 0.1, lbl(1330, 636, 'CENTRALE'), { dy: 8 });
    if (t > W('trasforma')) s += flowLine(PEN, t, C.line, { sw: 7, sp: 200 });
    // quota: l'unico corallo
    s += E(t, W('quota') - 0.15, `<line x1="660" y1="300" x2="1170" y2="300" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="10 10"/>` + vArrow(1180, 300, 752, C.coral) + lbl(1206, 540, 'IN QUOTA', { a: 'start', fill: C.coral }), { dy: 0 });
    s += E(t, W('potenziale') - 0.1, lbl(385, 408, 'ENERGIA POTENZIALE'), { dy: 8 });
    s += wire(t, t > W('elettrica') - 0.1);
    s += E(t, W('elettrica') - 0.1, lbl(1700, 520, 'ENERGIA ELETTRICA'), { dy: 8 });
    return s + caption(t, W('elettrica'), "Dall'acqua all'elettricità", '');
  } }) });

// 2 — primo passo: le condotte forzate
scene('condotte', { make: (W) => ({
  capAt: W('condotte'), last: W('forzate') - 0.2,
  render(t) {
    let s = valley(t, { dim: 0.45 });
    s += pipe(PEN, 40);
    if (t > W('scende') - 0.1) s += flowLine(PEN, t, C.coral, { sw: 9, sp: 260, da: '22 18' });
    s += E(t, 0.15, lbl(626, 226, 'DIGA'), { dy: 8 });
    s += E(t, W('centrale') - 0.1, lbl(1330, 636, 'CENTRALE'), { dy: 8 });
    // etichetta lungo la condotta (sopra, parallela)
    const ang = Math.atan2(290, 435) * 180 / Math.PI;
    s += E(t, W('condotte') - 0.1, `<g transform="translate(930,560) rotate(${ang.toFixed(2)})">` + lbl(0, 0, 'CONDOTTA FORZATA') + `</g>`, { dy: 0 });
    // frecce verso il basso sotto la condotta
    s += E(t, W('scende'), `<g transform="translate(1010,720) rotate(${ang.toFixed(2)})">` + arrow(-90, 0, 90, 0, C.line, 4) + `</g>`, { dy: 0 });
    s += E(t, W('scende') + 0.2, IT(330, 640, "l'acqua scende", { size: 50 }), { dy: 10 });
    return s + caption(t, W('condotte'), 'Condotte forzate', '');
  } }) });

// 3 — turbina e generatore in sezione (rotazioni coerenti: il lato davanti va verso destra)
function runnerSide(cx, cy, R, h, th, st) {
  let back = '', front = '';
  for (let k = 0; k < 6; k++) {
    const a = th + k * Math.PI / 3, x = cx + R * Math.sin(a), f = Math.cos(a) > 0;
    const l = `<path d="M${x.toFixed(1)},${cy - h / 2} q${(12 * Math.cos(a)).toFixed(1)},${h / 2} 0,${h}" fill="none" stroke="${st}" stroke-width="${f ? 6 : 3}" stroke-linecap="round" opacity="${f ? 1 : 0.45}"/>`;
    if (f) front += l; else back += l;
  }
  return back + front;
}
function stripes(x1, x2, y1, y2, th, n, st) {
  let s = ''; const w = x2 - x1, cx = (x1 + x2) / 2;
  for (let k = 0; k < n; k++) {
    const a = th + k * 2 * Math.PI / n; if (Math.cos(a) <= 0) continue;
    const x = cx + (w / 2 - 6) * Math.sin(a);
    s += `<line x1="${x.toFixed(1)}" y1="${y1}" x2="${x.toFixed(1)}" y2="${y2}" stroke="${st}" stroke-width="4" opacity="${(0.4 + 0.6 * Math.cos(a)).toFixed(2)}"/>`;
  }
  return s;
}
scene('turbina', { make: (W) => ({
  capAt: W('generatore'), last: W('elettrico'),
  render(t) {
    const g0 = W('girare'), om = 3.2;
    const th = t < g0 ? 0 : om * ((t - g0) - 0.4 * (1 - Math.exp(-(t - g0) / 0.4)));
    // ingresso acqua
    let s = pipe([[120, 690], [800, 690]], 70);
    s += E(t, -0.3, `<rect x="800" y="610" width="320" height="160" rx="30" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>`, { dy: 0 });
    s += pipe([[960, 770], [960, 832], [1760, 832]], 64);
    if (t > W('movimento') - 0.2) s += flowLine([[140, 690], [820, 690]], t, C.line, { sw: 7, sp: 240 }) + flowLine([[960, 790], [960, 832], [1740, 832]], t, C.line, { sw: 6, sp: 200, op: 0.8 });
    s += E(t, W('movimento') - 0.1, lbl(460, 630, 'ACQUA IN MOVIMENTO'), { dy: 8 });
    s += `<rect x="930" y="636" width="60" height="108" rx="10" fill="${DIM2}" stroke="${C.line}" stroke-width="4"/>` + runnerSide(960, 690, 130, 104, th, C.line);
    s += E(t, W('turbina') - 0.1, lbl(1150, 712, 'TURBINA', { a: 'start' }), { dy: 8 });
    // albero + generatore
    const ga = W('aziona') - 0.15;
    s += E(t, ga, `<rect x="946" y="390" width="28" height="222" fill="${DIM2}" stroke="${C.line}" stroke-width="4"/>` +
      `<rect x="790" y="190" width="340" height="200" rx="22" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>` +
      `<rect x="836" y="226" width="248" height="128" rx="10" fill="${DIM2}" stroke="${C.line}" stroke-width="3"/>` + stripes(836, 1084, 232, 348, th, 12, C.line), { dy: 0 });
    // freccia di rotazione (unico corallo): lato davanti verso destra
    s += E(t, W('aziona'), `<path d="M900,496 A60,18 0 0 0 1020,496" fill="none" stroke="${C.coral}" stroke-width="6" stroke-linecap="round"/><path d="M1034,488 l-24,-4 l8,20 z" fill="${C.coral}"/>`, { dy: 0 });
    s += E(t, W('generatore') - 0.1, lbl(1160, 410, 'GENERATORE', { a: 'start' }), { dy: 8 });
    const el = W('elettrico') - 0.1;
    s += E(t, el, `<path d="M1130,290 L1780,290" fill="none" stroke="${C.line}" stroke-width="3"/>` + flowLine([[1130, 290], [1780, 290]], t, C.line, { sw: 7, sp: 160, da: '10 30' }) + lbl(1455, 255, 'ENERGIA ELETTRICA'), { dy: 0 });
    return s + caption(t, W('generatore'), 'Turbina e generatore', '');
  } }) });

// 4 — la catena delle trasformazioni (registro chiaro)
function iconLake(cx, cy, ink) { return `<path d="M${cx - 70},${cy - 20} h140 l-14,50 h-112 z" fill="none" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/><path d="M${cx - 66},${cy - 6} h132" stroke="${ink}" stroke-width="3"/>` + `<line x1="${cx + 92}" y1="${cy - 46}" x2="${cx + 92}" y2="${cy + 30}" stroke="${ink}" stroke-width="3"/><path d="M${cx + 92},${cy - 54} l-9,14 h18 z" fill="${ink}"/>`; }
function iconFlow(cx, cy, ink) { let s = ''; for (let i = 0; i < 3; i++) s += `<path d="M${cx - 70},${cy - 24 + i * 24} q18,-12 36,0 t36,0 t36,0" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`; return s + `<path d="M${cx + 84},${cy} l-18,-12 v24 z" fill="${ink}"/>`; }
function iconWheel(cx, cy, ink, th) { let s = `<circle cx="${cx}" cy="${cy}" r="44" fill="none" stroke="${ink}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="9" fill="${ink}"/>`; for (let k = 0; k < 6; k++) { const a = th + k * Math.PI / 3; s += `<path d="M${cx + 12 * Math.cos(a)},${cy + 12 * Math.sin(a)} Q${cx + 34 * Math.cos(a + 0.5)},${cy + 34 * Math.sin(a + 0.5)} ${cx + 44 * Math.cos(a + 0.2)},${cy + 44 * Math.sin(a + 0.2)}" fill="none" stroke="${ink}" stroke-width="4"/>`; } return s; }
function iconBolt(cx, cy, fill) { return `<path d="M${cx + 10},${cy - 52} L${cx - 30},${cy + 6} H${cx - 2} L${cx - 12},${cy + 52} L${cx + 30},${cy - 8} H${cx + 2} Z" fill="${fill}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`; }
// 5 — turbina Pelton: getto tangente in alto, la ruota gira in senso orario (in alto va verso destra)
function bucket(cx, cy, r, a, st) {
  // cucchiaio doppio: la concavità guarda indietro rispetto al moto (verso il getto)
  return `<g transform="translate(${cx},${cy}) rotate(${(a * 180 / Math.PI).toFixed(2)}) translate(0,${-r})">` +
    `<path d="M-14,-26 Q30,-26 30,0 Q30,26 -14,26" fill="${DIM2}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/><path d="M-8,0 L24,0" stroke="${st}" stroke-width="3"/></g>`;
}
scene('pelton', { make: (W) => ({
  capAt: W('pelton'), last: W('cucchiai'),
  render(t) {
    const cx = 1260, cy = 520, r = 210, g0 = W('getti') - 0.2;
    const th = t < g0 ? 0 : 2.0 * ((t - g0) - 0.5 * (1 - Math.exp(-(t - g0) / 0.5)));
    let s = E(t, 0.1, lbl(120, 470, 'DISLIVELLO MOLTO ALTO', { a: 'start' }), { dy: 0 }) ;
    s = E(t, W('alti') - 0.1, lbl(120, 470, 'DISLIVELLO MOLTO ALTO', { a: 'start' }), { dy: 8 });
    s += E(t, W('duecento') - 0.1, T(116, 600, 'oltre 200 m', { f: 'pop', size: 104 }), { dy: 12 });
    s += E(t, W('ridotte') - 0.1, lbl(120, 690, 'PORTATA RIDOTTA', { a: 'start' }), { dy: 8 });
    // ruota (da subito, ferma), poi gira
    let wh = `<circle cx="${cx}" cy="${cy}" r="${r - 24}" fill="none" stroke="${C.line}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="46" fill="${DIM2}" stroke="${C.line}" stroke-width="5"/>`;
    for (let k = 0; k < 6; k++) { const a = th + k * Math.PI / 3; wh += `<line x1="${cx + 46 * Math.cos(a)}" y1="${cy + 46 * Math.sin(a)}" x2="${cx + (r - 24) * Math.cos(a)}" y2="${cy + (r - 24) * Math.sin(a)}" stroke="${C.line}" stroke-width="4"/>`; }
    for (let k = 0; k < 18; k++) wh += bucket(cx, cy, r, th + k * 2 * Math.PI / 18, C.line);
    s += E(t, 0.0, wh, { dy: 0, blur: 6 });
    // condotta e ugello
    const jy = cy - r + 4;
    s += E(t, 0.2, pipe([[700, jy], [900, jy]], 56) + `<path d="M900,${jy - 28} L990,${jy - 10} L990,${jy + 10} L900,${jy + 28} Z" fill="${DIM2}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>`, { dy: 0 });
    s += E(t, W('pelton') - 0.1, T(cx + r + 50, cy + 10, 'PELTON', { f: 'mono', size: 30, w: 700, ls: 4 }), { dy: 0 });
    if (t > g0) {
      // getto (unico corallo) dall'ugello verso destra, tangente alla ruota in alto
      s += `<line x1="992" y1="${jy}" x2="${lerp(992, cx - 34, eo((t - g0) / 0.25))}" y2="${jy}" stroke="${C.coral}" stroke-width="12" stroke-linecap="round"/>`;
      s += `<line x1="996" y1="${jy}" x2="${cx - 40}" y2="${jy}" stroke="${C.bg}" stroke-width="3" stroke-dasharray="6 30" stroke-dashoffset="${(-t * 420).toFixed(0)}" opacity="0.7"/>`;
      // gocce che ricadono dopo i cucchiai
      for (let i = 0; i < 7; i++) { const u = ((t - g0) * 0.9 + i / 7) % 1, x = cx - 8 + 70 * hsh(i) - 10, y = jy + 50 + u * 260; if (t - g0 < u / 0.9) continue; s += `<circle cx="${x}" cy="${y}" r="5" fill="${C.line}" opacity="${(0.8 * (1 - u)).toFixed(2)}"/>`; }
    }
    s += E(t, W('getti') - 0.1, lbl(800, jy - 60, 'GETTO AD ALTA VELOCITÀ'), { dy: 8 });
    s += E(t, W('cucchiai') - 0.1, lbl(cx, cy + r + 80, 'CUCCHIAI A DOPPIA CURVA'), { dy: 8 });
    return s + caption(t, W('pelton'), 'Turbina Pelton', '');
  } }) });

// 6 — turbina Kaplan: flusso dall'alto verso il basso attraverso l'elica, pale regolabili
function kaplanBlades(cx, cy, R, th, beta, st) {
  let back = '', front = '';
  for (let k = 0; k < 5; k++) {
    const a = th + k * 2 * Math.PI / 5, sn = Math.sin(a), cs = Math.cos(a), f = cs > 0;
    const xh = cx + 34 * sn, xt = cx + R * sn, hh = (10 + 70 * Math.sin(beta) * Math.abs(cs));
    const sk = 40 * Math.sin(beta) * cs * 0.5;
    const pth = `<path d="M${xh.toFixed(1)},${(cy - hh / 2 - sk).toFixed(1)} L${xt.toFixed(1)},${(cy - hh / 2 + sk).toFixed(1)} L${xt.toFixed(1)},${(cy + hh / 2 + sk).toFixed(1)} L${xh.toFixed(1)},${(cy + hh / 2 - sk).toFixed(1)} Z" fill="${f ? DIM2 : 'none'}" stroke="${st}" stroke-width="${f ? 4 : 2.5}" stroke-linejoin="round" opacity="${f ? 1 : 0.45}"/>`;
    if (f) front += pth; else back += pth;
  }
  return back + `<rect x="${cx - 36}" y="${cy - 44}" width="72" height="88" rx="30" fill="${DIM2}" stroke="${st}" stroke-width="4"/>` + front;
}
scene('kaplan', { make: (W) => ({
  capAt: W('kaplan'), last: W('regolabili'),
  render(t) {
    const cx = 1100, cy = 600, g0 = W('portate') - 0.2;
    const th = 1.8 * t;
    const rg = W('regolabili') - 0.1, beta = (28 + 18 * Math.sin(Math.PI * clamp((t - rg) / 1.4)) * (t > rg ? 1 : 0)) * Math.PI / 180;
    let s = E(t, W('bassi') - 0.1, lbl(120, 470, 'DISLIVELLO BASSO', { a: 'start' }), { dy: 8 });
    s += E(t, W('trenta') - 0.1, T(116, 600, 'sotto 30 m', { f: 'pop', size: 104 }), { dy: 12 });
    s += E(t, W('elevate') - 0.1, lbl(120, 690, 'PORTATA ELEVATA', { a: 'start' }), { dy: 8 });
    // condotto verticale in sezione, con molta acqua che scende
    s += E(t, 0, `<path d="M900,240 V840 M1300,240 V840" stroke="${C.line}" stroke-width="6"/><rect x="903" y="240" width="394" height="600" fill="${WATER}"/>`, { dy: 0, blur: 6 });
    if (t > g0) for (let i = 0; i < 6; i++) s += flowLine([[940 + i * 64, 250], [940 + i * 64, 830]], t + i * 0.13, C.line, { sw: 5, sp: 200, da: '20 26', op: 0.7 });
    s += E(t, 0.05, `<rect x="1084" y="250" width="32" height="306" fill="${DIM2}" stroke="${C.line}" stroke-width="4"/>` + kaplanBlades(cx, cy, 186, th, beta, C.line), { dy: 0, blur: 6 });
    s += E(t, 0.3, lbl(1100, 214, 'ACQUA DAL FIUME'), { dy: 6 });
    s += E(t, W('kaplan') - 0.1, T(1350, 470, 'KAPLAN', { f: 'mono', size: 30, w: 700, ls: 4 }), { dy: 0 });
    // inserto: profilo della pala che cambia inclinazione (unico corallo l'arco)
    const ix = 1620, iy = 640, bdeg = beta * 180 / Math.PI;
    s += E(t, W('pale') - 0.1, `<circle cx="${ix}" cy="${iy}" r="120" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 10"/>` +
      `<g transform="translate(${ix},${iy}) rotate(${(-bdeg).toFixed(2)})"><path d="M-90,0 Q-70,-22 0,-20 Q60,-16 90,0 Q60,8 0,10 Q-70,12 -90,0 Z" fill="${DIM2}" stroke="${C.line}" stroke-width="4"/></g>` +
      `<circle cx="${ix}" cy="${iy}" r="7" fill="${C.line}"/>` +
      `<path d="M${ix + 104},${iy - 40} A110,110 0 0 1 ${ix + 104},${iy + 40}" fill="none" stroke="${C.coral}" stroke-width="6"/><path d="M${ix + 104},${iy - 52} l-10,18 l18,2 z M${ix + 104},${iy + 52} l-10,-18 l18,-2 z" fill="${C.coral}"/>` +
      lbl(ix, iy + 170, 'PALE REGOLABILI'), { dy: 8 });
    return s + caption(t, W('kaplan'), 'Turbina Kaplan', '');
  } }) });

// 7 — dispacciabile: la paratoia regola il flusso
function gateOpen(t, W) {
  const a = W('aprendo') - 0.1, c = W('chiudendo') - 0.1;
  return 0.35 + 0.65 * ss((t - a) / 0.7) - 0.8 * ss((t - c) / 0.7);
}
scene('paratoie', { make: (W) => ({
  capAt: W('dispacciabile'), last: W('chiudendo') + 0.7,
  render(t) {
    const g = gateOpen(t, W);
    let ang = 0; for (let x = 0; x < t; x += 0.02) ang += 0.02 * 5 * gateOpen(x, W);
    let s = `<path d="M0,300 L100,300 L120,840 L700,840 L700,300" fill="none" stroke="${C.line}" stroke-width="0"/>`;
    s += E(t, -0.3, `<path d="M120,330 L700,330 L700,840 L140,840 Z" fill="${WATER}"/><line x1="120" y1="330" x2="700" y2="330" stroke="${C.line}" stroke-width="3"/>` + waves(120, 700, 330, C.line) +
      `<path d="M700,270 L790,270 L790,620 L1640,620 M790,760 L790,840 L700,840 M790,760 L1640,760" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M700,270 L790,270 L790,620 L700,620 Z M700,760 L790,760 L790,860 L700,860 Z" fill="${DIM2}" stroke="${C.line}" stroke-width="4"/>` + lbl(745, 236, 'DIGA'), { dy: 0, blur: 6 });
    // acqua nella condotta: altezza della lama = apertura
    const h = 136 * g, y0 = 760 - h;
    s += `<rect x="790" y="${y0.toFixed(1)}" width="850" height="${h.toFixed(1)}" fill="${WATER}"/>`;
    const nl = Math.max(1, Math.round(4 * g));
    for (let i = 0; i < nl; i++) { const y = 760 - h * (i + 0.5) / nl; s += flowLine([[680, y], [1630, y]], t + i * 0.2, C.line, { sw: 5, sp: 240, da: '22 24', op: 0.75 }); }
    // paratoia (unico corallo): sale quando si apre
    const gy = 760 - 136 * g;
    s += `<rect x="666" y="${(gy - 300).toFixed(1)}" width="24" height="300" fill="${C.coral}" stroke="${C.bg}" stroke-width="2"/>`;
    s += E(t, 0.1, lbl(480, 240, 'PARATOIA') + `<path d="M560,252 L672,300" stroke="${C.line}" stroke-width="3"/>`, { dy: 6 });
    // turbina a valle che gira più o meno veloce
    s += E(t, 0.0, `<circle cx="1730" cy="690" r="86" fill="none" stroke="${C.line}" stroke-width="5"/>` + iconWheel(1730, 690, C.line, ang), { dy: 0 });
    s += E(t, 0.2, lbl(1730, 830, 'TURBINA'), { dy: 6 });
    // misura della produzione
    s += E(t, 0.2, `<rect x="1180" y="280" width="420" height="44" rx="8" fill="none" stroke="${C.line}" stroke-width="3"/><rect x="1186" y="286" width="${(408 * g).toFixed(1)}" height="32" rx="5" fill="${C.line}"/>` + lbl(1390, 250, 'PRODUZIONE'), { dy: 0 });
    s += E(t, W('regola') - 0.1, IT(1390, 420, 'si regola a piacimento', { a: 'middle', size: 50 }), { dy: 10 });
    const st = t < W('aprendo') - 0.1 ? '' : t < W('chiudendo') - 0.1 ? 'APERTA' : 'CHIUSA';
    if (st) s += lbl(1210, 560, 'PARATOIA ' + st, { a: 'middle' });
    return s + caption(t, W('dispacciabile'), 'Dispacciabile', '');
  } }) });

// 8 — bilanciare la rete (registro chiaro): una bilancia fra produzione e consumo
scene('bilancio', { make: (W) => ({
  capAt: W('bilancia'), last: W('bilancia'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 650), { dy: 0 });
    const st = (w, n = 0) => ss((t - W(w, n) + 0.1) / 0.5);
    const Rc = 2 + st('più') - st('troppa'), Lp = 2 + st('aumenta') - st('riduce');
    const ang = 6 * (Rc - Lp), a = ang * Math.PI / 180, fx = 960, fy = 470, hl = 430;
    s += lbl(530, 260, 'PRODUZIONE', { fill: C.ink }) + lbl(1390, 260, 'CONSUMO', { fill: C.ink });
    // fulcro e asta
    s += `<path d="M${fx},${fy} L${fx - 60},${fy + 250} L${fx + 60},${fy + 250} Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<g transform="rotate(${ang.toFixed(2)} ${fx} ${fy})"><rect x="${fx - hl - 10}" y="${fy - 9}" width="${2 * hl + 20}" height="18" rx="9" fill="${C.ink}"/>` +
      `<line x1="${fx}" y1="${fy}" x2="${fx}" y2="${fy - 110}" stroke="${C.coral}" stroke-width="8" stroke-linecap="round"/></g>`;
    s += `<line x1="${fx}" y1="${fy - 130}" x2="${fx}" y2="${fy - 150}" stroke="${C.ink}" stroke-width="3"/>`;
    s += `<circle cx="${fx}" cy="${fy}" r="12" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>`;
    const pan = (side, n, kind) => {
      const ex = fx + side * hl * Math.cos(a), ey = fy + side * hl * Math.sin(a), py = ey + 150;
      let p = `<line x1="${ex - 70}" y1="${py}" x2="${ex}" y2="${ey}" stroke="${C.ink}" stroke-width="3"/><line x1="${ex + 70}" y1="${py}" x2="${ex}" y2="${ey}" stroke="${C.ink}" stroke-width="3"/>` +
        `<path d="M${ex - 110},${py} h220 l-20,22 h-180 z" fill="${C.cream}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
      for (let i = 0; i < 3; i++) {
        const op = clamp(n - i); if (op <= 0) continue;
        const bx = ex - 90 + i * 64, by = py - 56;
        p += `<g opacity="${op.toFixed(2)}"><rect x="${bx}" y="${by}" width="54" height="54" rx="8" fill="${C.ivory}" stroke="${C.ink}" stroke-width="3"/>` +
          (kind === 'w' ? `<path d="M${bx + 27},${by + 10} q16,20 0,34 q-16,-14 0,-34 z" fill="none" stroke="${C.ink}" stroke-width="3"/>` :
            `<path d="M${bx + 31},${by + 8} L${bx + 17},${by + 30} h12 l-4,16 l16,-24 h-12 z" fill="${C.ink}"/>`) + `</g>`;
      }
      return p;
    };
    s += pan(-1, Lp, 'w') + pan(1, Rc, 'e');
    const fl = t < W('aumenta') - 0.1 ? '' : t < W('riduce') - 0.1 ? 'PIÙ FLUSSO' : 'MENO FLUSSO';
    if (fl) s += lbl(530, 330, fl, { fill: C.coralD });
    const cs = t < W('più') - 0.1 ? '' : t < W('troppa') - 0.1 ? 'SERVE PIÙ ENERGIA' : "CE N'È TROPPA";
    if (cs) s += lbl(1390, 330, cs, { fill: C.ink });
    s += E(t, W('bilancia') - 0.1, lbl(960, 780, 'RETE IN EQUILIBRIO', { fill: C.ink }), { dy: 6 });
    return s + caption(t, W('bilancia'), 'Bilanciare la rete', '', true);
  } }) });

// 9-10 — pompaggio: due bacini, una centrale reversibile, la rete
const CON = [[612, 438], [930, 700], [1030, 760], [1236, 792]];
function twoBasins(t, up, lo, mode, o) {
  // up, lo: quota del pelo libero (y) nei due bacini
  let s = `<path d="M0,240 L120,240 L150,300 L170,450 L612,450 L640,438 L930,700 L1030,760 L1180,760 L1200,812 L1630,812 L1680,560 L1920,560 L1920,1080 L0,1080 Z" fill="${C.earth}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="M${150 + (up - 300) / 150 * 20},${up} L170,450 L612,450 L612,${up} Z" fill="${WATER}"/><line x1="${150 + (up - 300) / 150 * 20}" y1="${up}" x2="612" y2="${up}" stroke="${C.line}" stroke-width="3"/>`;
  s += `<path d="M${1180 + (lo - 760) / 52 * 20},${lo} L1200,812 L1630,812 L${1630 + (lo - 812) / -252 * 50},${lo} Z" fill="${WATER}"/><line x1="${1180 + (lo - 760) / 52 * 20}" y1="${lo}" x2="${1630 + (lo - 812) / -252 * 50}" y2="${lo}" stroke="${C.line}" stroke-width="3"/>`;
  s += pipe(CON, 34);
  // centrale
  s += `<rect x="880" y="610" width="190" height="130" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/><path d="M866,610 L975,576 L1084,610" fill="none" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>`;
  s += iconWheel(975, 676, C.line, o.th) + `<circle cx="975" cy="676" r="44" fill="none" stroke="${C.line}" stroke-width="4"/>`;
  s += pylon(1760, 560, 330, C.line);
  const wp = [[1070, 640], [1400, 470], [1704, 360]];
  s += `<path d="${P(wp)}" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  // energia elettrica: dalla rete alla centrale (pompa) o dalla centrale alla rete (turbina)
  s += flowLine(mode === 'pompa' ? wp.slice().reverse() : wp, t, C.line, { sw: 7, sp: 160, da: '10 30' });
  s += flowLine(mode === 'pompa' ? CON.slice().reverse() : CON, t, C.line, { sw: 7, sp: 200 });
  return s;
}
function basinLabels(t) {
  return E(t, 0.1, lbl(390, 236, 'BACINO SUPERIORE'), { dy: 6 }) + E(t, 0.25, lbl(1410, 880 - 186, 'BACINO INFERIORE'), { dy: 6 }) + E(t, 0.4, lbl(1760, 290, 'RETE'), { dy: 6 });
}
scene('pompa', { make: (W) => ({
  capAt: W('superiore') - 0.4, last: W('pompare'),
  render(t, D) {
    const p0 = W('pompare') - 0.3, p = ss((t - p0) / (D - p0 - 0.3));
    const on = t > W('eccesso') - 0.2;
    let s = twoBasins(on ? t : 0, lerp(372, 318, on ? p : 0), lerp(722, 776, on ? p : 0), 'pompa', { th: on ? -2.4 * t : 0 });
    s += basinLabels(t);
    s += E(t, W('eccesso') - 0.1, lbl(1300, 360, 'ELETTRICITÀ IN ECCESSO'), { dy: 6 });
    s += E(t, W('pompare') - 0.1, lbl(975, 545, 'POMPA'), { dy: 6 });
    // freccia corallo: l'acqua sale
    s += E(t, W('pompare') - 0.1, arrow(840, 560, 640, 395, C.coral, 8), { dy: 0 });
    s += E(t, W('pompaggio') - 0.1, IT(150, 640, 'si pompa', { size: 50 }) + IT(150, 700, "l'acqua in alto", { size: 50 }), { dy: 10 });
    return s + caption(t, W('superiore') - 0.4, "Acqua verso l'alto", '');
  } }) });
scene('rilascio', { make: (W) => ({
  capAt: W('batteria'), last: W('batteria'),
  render(t, D) {
    const p0 = W('rilascia') - 0.3, p = ss((t - p0) / (W('batteria') - p0));
    const on = t > p0;
    let s = twoBasins(on ? t : 0, lerp(318, 372, on ? p : 0), lerp(776, 722, on ? p : 0), 'turbina', { th: on ? 2.4 * t : 0 });
    s += basinLabels(t);
    s += E(t, W('scarseggia') - 0.1, lbl(1300, 360, 'ELETTRICITÀ SCARSA'), { dy: 6 });
    s += E(t, W('genera') - 0.1, lbl(975, 545, 'TURBINA'), { dy: 6 });
    s += E(t, W('rilascia') - 0.1, arrow(640, 395, 840, 560, C.coral, 8), { dy: 0 });
    s += E(t, W('batteria') - 0.15, IT(150, 640, 'una batteria', { size: 50 }) + IT(150, 700, "fatta d'acqua", { size: 50 }), { dy: 10 });
    return s + caption(t, W('batteria'), "Una batteria d'acqua", '');
  } }) });

// 11 — il dato (registro chiaro)
scene('dato', { make: (W) => ({
  capAt: W('capacità'), last: W('settemila'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 180, 1520, 640), { dy: 0 });
    s += E(t, W('accumulo') - 0.1, T(960, 300, "L'ACCUMULO PIÙ DIFFUSO AL MONDO", { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 4, w: 700 }), { dy: 8 });
    s += E(t, W('italia') - 0.1, lbl(960, 380, 'CAPACITÀ DI POMPAGGIO IN ITALIA', { fill: C.ink }), { dy: 8 });
    s += E(t, W('circa') - 0.1, IT(960, 480, 'circa', { a: 'middle', size: 64, fill: C.ink }), { dy: 8 });
    s += E(t, W('settemila') - 0.1, T(960, 660, '7.700 MW', { f: 'pop', size: 190, a: 'middle', fill: C.coralD }), { dy: 16 });
    s += E(t, W('megawatt') - 0.1, lbl(960, 740, 'MW = MEGAWATT', { fill: C.ink }), { dy: 6 });
    return s + caption(t, W('capacità'), 'Capacità installata', '', true);
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, "L'acqua che scende", { f: 'pop', size: 120, a: 'middle', fill: C.ink }), { dy: 0 });
    s += words(t, W('energia') - 0.1, 960, 550, 'Energia rinnovabile che si può regolare.', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: '' });
    s += E(t, W('rinnovabile'), `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC ENE-3-03', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
