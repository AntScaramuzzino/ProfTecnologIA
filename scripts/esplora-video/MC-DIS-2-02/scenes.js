// Assonometria cavaliera — MC-DIS-2-02 §"Assonometria cavaliera obliqua". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.3);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.hold != null) D = Math.max(D, def.hold + 1.55);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 50, fill: o.fill || C.line, a: o.a || 'start' });

// ---- geometria esatta ----
// Cavaliera: x orizzontale (0°), z verticale (90°), y obliquo a 45° verso l'alto-destra, fattore di riduzione 0,5 su y, 1 su x e z.
const RAD = Math.PI / 180, C45 = Math.cos(45 * RAD);
const cav = (o, k, x, y, z, f = 0.5) => [o[0] + k * (x + f * y * C45), o[1] - k * (z + f * y * C45)];
const pol = (c, r, a) => [c[0] + r * Math.cos(a * RAD), c[1] - r * Math.sin(a * RAD)];
const P = p => p[0].toFixed(1) + ',' + p[1].toFixed(1);
const seg = (p, q, st, sw = 4, o = '') => `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${st}" stroke-width="${sw}" stroke-linecap="round" ${o}/>`;
const lp = (p, q, f) => [lerp(p[0], q[0], f), lerp(p[1], q[1], f)];
function drawSeg(t, t0, d, p, q, st, sw = 4, o = '') { const f = eio((t - t0) / d); return f <= 0 ? '' : seg(p, lp(p, q, f), st, sw, o); }
const dot = (p, st, r = 9) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" fill="${st}"/>`;
const poly = (pts, st, sw = 4, o = '') => `<polyline points="${pts.map(P).join(' ')}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${o}/>`;
const arcPts = (c, r, a0, a1) => { const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 1.5)), p = []; for (let i = 0; i <= n; i++) p.push(pol(c, r, lerp(a0, a1, i / n))); return p; };
const DASH = 'stroke-dasharray="14 12"';
// vertici di un parallelepipedo X×Y×Z (mm reali) con origine O = spigolo anteriore in basso a sinistra
function boxV(o, k, X, Y, Z, f = 0.5) {
  return { A: cav(o, k, 0, 0, 0, f), B: cav(o, k, X, 0, 0, f), Cc: cav(o, k, X, 0, Z, f), D: cav(o, k, 0, 0, Z, f),
    A2: cav(o, k, 0, Y, 0, f), B2: cav(o, k, X, Y, 0, f), C2: cav(o, k, X, Y, Z, f), D2: cav(o, k, 0, Y, Z, f) };
}
const VIS = [['A', 'B'], ['B', 'Cc'], ['Cc', 'D'], ['D', 'A'], ['D', 'D2'], ['Cc', 'C2'], ['B', 'B2'], ['D2', 'C2'], ['C2', 'B2']];
const HID = [['A', 'A2'], ['A2', 'B2'], ['A2', 'D2']];
function boxLines(v, st, sw = 4, hid = true) {
  let s = VIS.map(([a, b]) => seg(v[a], v[b], st, sw)).join('');
  if (hid) s += HID.map(([a, b]) => seg(v[a], v[b], st, sw * 0.7, DASH)).join('');
  return s;
}
const face = (pts, fill) => `<polygon points="${pts.map(P).join(' ')}" fill="${fill}" stroke="none"/>`;
// quota: segmento p-q spostato lungo la normale n (versore) di off px, con trattini obliqui alle estremità
function quota(p, q, n, off, label, st, lo = {}) {
  const a = [p[0] + n[0] * off, p[1] + n[1] * off], b = [q[0] + n[0] * off, q[1] + n[1] * off];
  const e = (r) => seg([r[0] + n[0] * 10, r[1] + n[1] * 10], [r[0] + n[0] * (off + 14), r[1] + n[1] * (off + 14)], st, 2);
  const tk = (r) => seg([r[0] - 10, r[1] + 10], [r[0] + 10, r[1] - 10], st, 3);
  const m = lp(a, b, 0.5), lx = m[0] + n[0] * (lo.d ?? 40) + (lo.dx || 0), ly = m[1] + n[1] * (lo.d ?? 40) + (lo.dy ?? 10);
  return e(p) + e(q) + seg(a, b, st, 2.5) + tk(a) + tk(b) + T(lx, ly, label, { f: 'mono', size: lo.size || 30, fill: st, a: lo.a || 'middle', w: 700, ls: 2 });
}
const rightMark = (o, s, st) => poly([[o[0] + s, o[1]], [o[0] + s, o[1] - s], [o[0], o[1] - s]], st, 3);

// ===== terna di assi (scene 2-4) =====
const AO = [560, 740], AX = [1200, 740], AZ = [560, 220], AY = pol(AO, 440, 45);
function axesFig(t, hi = {}, t0 = -1) {
  const col = k => hi[k] ? C.coral : C.line, sw = k => hi[k] ? 6 : 4;
  let s = '';
  const yo = hi.yOp ?? 1;
  s += arrow(AO[0], AO[1], AX[0], AX[1], col('x'), sw('x')) + T(AX[0] + 24, AX[1] + 14, 'x', { f: 'pop', size: 56, fill: col('x') });
  s += arrow(AO[0], AO[1], AZ[0], AZ[1], col('z'), sw('z')) + T(AZ[0], AZ[1] - 26, 'z', { f: 'pop', size: 56, fill: col('z'), a: 'middle' });
  s += `<g opacity="${yo.toFixed(3)}">` + arrow(AO[0], AO[1], AY[0], AY[1], col('y'), sw('y')) + T(AY[0] + 22, AY[1] - 14, 'y', { f: 'pop', size: 56, fill: col('y') }) + '</g>';
  return s;
}
const oLab = (fill = C.line) => T(AO[0] - 30, AO[1] + 46, 'O', { f: 'pop', size: 48, fill, a: 'middle' });

// 1 — aggancio: un parallelepipedo in cavaliera si disegna spigolo dopo spigolo
scene('hook', { make: (W) => ({
  capAt: W('semplice'), hold: W('usata'),
  render(t) {
    const v = boxV([1130, 740], 6, 80, 60, 50);
    const order = [['A', 'B'], ['D', 'A'], ['Cc', 'D'], ['B', 'Cc'], ['D', 'D2'], ['Cc', 'C2'], ['B', 'B2'], ['D2', 'C2'], ['C2', 'B2']];
    let s = '';
    s += E(t, W('semplice'), face([v.D, v.Cc, v.C2, v.D2], mix(C.bg, C.line, 0.10)) + face([v.B, v.B2, v.C2, v.Cc], mix(C.bg, C.line, 0.18)), { dy: 0, blur: 4 });
    order.forEach(([a, b], i) => { s += drawSeg(t, 0.25 + i * 0.28, 0.35, v[a], v[b], C.line, 5); });
    s += E(t, 0.25 + 9 * 0.28, HID.map(([a, b]) => seg(v[a], v[b], C.line, 3, DASH)).join(''), { dy: 0, blur: 3 });
    s += words(t, W("l'assonometria"), 96, 360, 'Assonometria', { f: 'pop', size: 104 });
    s += words(t, W('cavaliera'), 96, 480, 'cavaliera', { f: 'pop', size: 104, key: 'cavaliera' });
    s += E(t, W('mano'), IT(100, 580, 'la più semplice a mano', { size: 54 }));
    s += E(t, W('usata'), IT(100, 650, 'molto usata nei manuali', { size: 54 }));
    return s + caption(t, W('semplice'), 'Semplice da costruire', '');
  } }) });

// 2 — origine O e tre assi
scene('assi', { make: (W) => ({
  capAt: W("d'origine"), hold: W('tre'),
  render(t) {
    let s = '';
    const t0 = W('tracciano'), f = eio((t - t0) / 0.8);
    if (f > 0) {
      const q = (P2) => lp(AO, P2, f);
      const ax = (P2, l, dx, dy, a) => { const e = q(P2); return arrow(AO[0], AO[1], e[0], e[1], C.line, 4) + (f > 0.95 ? T(P2[0] + dx, P2[1] + dy, l, { f: 'pop', size: 56, a }) : ''); };
      s += ax(AX, 'x', 24, 14, 'start') + ax(AZ, 'z', 0, -26, 'middle') + ax(AY, 'y', 22, -14, 'start');
    }
    s += E(t, W("d'origine"), dot(AO, C.coral, 13) + oLab(C.coral), { dy: 0 });
    s += E(t, W('punto'), lbl(AO[0] - 60, AO[1] + 110, 'PUNTO D\'ORIGINE', { a: 'start', size: 30, fill: C.line }));
    s += E(t, W('tre'), T(1330, 470, 'tre assi', { f: 'pop', size: 88 }));
    s += E(t, W('tre'), IT(1334, 545, 'x, y, z', { size: 56 }));
    return s + caption(t, W("d'origine"), 'Tre assi da O', '');
  } }) });

// 3 — x orizzontale, z verticale (90°)
scene('xz', { make: (W) => ({
  capAt: W('larghezza'), hold: W('novanta'),
  render(t) {
    const onZ = t >= W('zeta');
    let s = axesFig(t, { x: !onZ, z: onZ, yOp: 1 - 0.8 * eo((t - W('novanta') + 0.3) / 0.4) }) + dot(AO, C.line, 9) + oLab();
    s += E(t, W('novanta'), rightMark(AO, 40, C.line), { dy: 0, blur: 3 });
    s += E(t, W('ics'), lbl(1330, 330, 'ASSE X', { a: 'start', size: 30 }) + T(1330, 410, 'larghezza', { f: 'pop', size: 72 }));
    s += E(t, W('orizzontale'), IT(1334, 470, 'orizzontale', { size: 52 }));
    s += E(t, W('zeta'), lbl(1330, 590, 'ASSE Z', { a: 'start', size: 30 }) + T(1330, 670, 'altezza', { f: 'pop', size: 72 }));
    s += E(t, W('verticale'), IT(1334, 730, 'verticale, 90°', { size: 52 }));
    return s + caption(t, W('larghezza'), 'Larghezza e altezza', '');
  } }) });

// 4 — y obliquo a 45°
scene('y', { make: (W) => ({
  capAt: W('profondità'), hold: W('quarantacinque'),
  render(t) {
    let s = axesFig(t, { y: t >= W('ipsilon'), yOp: 0.2 + 0.8 * eo(t / 0.4) }) + dot(AO, C.line, 9) + oLab();
    const fa = eio((t - W('quarantacinque')) / 0.6);
    if (fa > 0) s += poly(arcPts(AO, 190, 0, 45 * fa), C.line, 3);
    s += E(t, W('quarantacinque') + 0.4, T(...pol(AO, 240, 22.5).map((v, i) => i ? v + 14 : v), '45°', { f: 'pop', size: 46, a: 'middle' }), { dy: 0 });
    s += E(t, W('ipsilon'), lbl(1330, 330, 'ASSE Y', { a: 'start', size: 30 }) + T(1330, 410, 'profondità', { f: 'pop', size: 72 }));
    s += E(t, W('obliquo'), IT(1334, 470, 'obliquo', { size: 52 }));
    s += E(t, W('quarantacinque'), T(1330, 600, '45°', { f: 'pop', size: 96 }));
    s += E(t, W("all'orizzontale"), IT(1334, 670, "rispetto all'orizzontale", { size: 48 }));
    return s + caption(t, W('profondità'), 'Profondità a 45°', '');
  } }) });

// 5 — fattore di riduzione (chiaro)
scene('riduz', { make: (W) => ({
  capAt: W('ridotte'), hold: W('uno'),
  render(t) {
    const I = C.ink;
    let s = lightBg() + E(t, -0.4, card(240, 160, 1440, 660, { rot: -0.5 }), { dy: 0 });
    s += E(t, -0.2, pillTag(330, 270, 'FATTORE DI RIDUZIONE', I, C.cream) + IT(860, 282, 'nella convenzione più usata a scuola', { fill: I, size: 40 }));
    s += E(t, W('obliquo'), T(330, 420, 'asse y', { f: 'pop', size: 76, fill: I }) + IT(334, 480, 'obliquo', { fill: I, size: 46 }));
    s += E(t, W('cinque'), T(880, 430, '× 0,5', { f: 'pop', size: 116, fill: C.coralT }));
    s += E(t, W('metà'), IT(886, 500, 'ridotte alla metà', { fill: I, size: 52 }));
    s += E(t, W('su'), `<line x1="330" y1="555" x2="1590" y2="555" stroke="${I}" stroke-width="3"/>`, { dy: 0 });
    s += E(t, W('ics'), T(330, 680, 'assi x e z', { f: 'pop', size: 76, fill: I }));
    s += E(t, W('reali'), IT(334, 740, 'misure reali', { fill: I, size: 46 }));
    s += E(t, W('uno'), T(880, 690, '× 1', { f: 'pop', size: 116, fill: I }));
    return s + caption(t, W('ridotte'), 'Ridotte alla metà', '', true);
  } }) });

// 6 — esempio: 60 mm reali → 30 mm disegnati sull'asse obliquo
scene('es', { make: (W) => {
  const O = [1010, 790], k = 8, full = pol(O, 60 * k, 45), half = pol(O, 30 * k, 45), n = [C45, C45], nn = [-C45, -C45];
  return {
    capAt: W('trenta'), hold: W('trenta'),
    render(t) {
      let s = E(t, -0.3, seg([O[0] - 60, O[1]], [O[0] + 560, O[1]], C.line, 3) + dot(O, C.line, 8), { dy: 0 });
      s += E(t, -0.2, seg(O, pol(O, 640, 45), C.line, 2.5, 'stroke-dasharray="6 10" opacity="0.8"') + T(...pol(O, 670, 45), 'y', { f: 'pop', size: 52 }), { dy: 0 });
      s += E(t, W('sessanta'), seg(O, full, C.line, 5, DASH) + seg([full[0] - 14, full[1] - 14], [full[0] + 14, full[1] + 14], C.line, 4) +
        T(full[0] - 50, full[1] - 30, '60 mm reali', { f: 'mono', size: 30, fill: C.line, a: 'end', w: 700, ls: 2 }), { dy: 0 });
      const f = eio((t - W('disegna')) / 0.7);
      if (f > 0) s += seg(O, lp(O, half, f), C.coral, 9);
      s += E(t, W('trenta'), seg([half[0] - 16, half[1] - 16], [half[0] + 16, half[1] + 16], C.coral, 5) +
        T(half[0] + 40, half[1] + 40, '30 mm', { f: 'mono', size: 34, fill: C.line, w: 700, ls: 2 }) + T(half[0] + 40, half[1] + 82, 'sul disegno', { f: 'mono', size: 28, fill: C.line, w: 600, ls: 2 }), { dy: 0 });
      s += E(t, -0.2, pillTag(96, 250, 'ESEMPIO', C.line, C.bg));
      s += E(t, W('oggetto'), lbl(96, 350, 'PROFONDITÀ', { a: 'start', size: 30 }));
      s += E(t, W('sessanta'), T(96, 450, '60 mm', { f: 'pop', size: 110 }));
      s += E(t, W('trenta'), T(96, 600, '→ 30 mm', { f: 'pop', size: 110 }));
      s += E(t, W('trenta') + 0.2, IT(100, 680, 'sul disegno', { size: 54 }));
      return s + caption(t, W('trenta'), 'Da 60 a 30 mm', '');
    } };
} });

// 7 — perché ridurre (chiaro): stesso oggetto con profondità intera e dimezzata
scene('perche', { make: (W) => {
  const k = 3.6, v1 = boxV([400, 720], k, 80, 60, 50, 1), v2 = boxV([1080, 720], k, 80, 60, 50, 0.5);
  return {
    capAt: W('distorsione'), hold: W('profondo'),
    render(t) {
      const I = C.ink;
      let s = lightBg() + E(t, -0.4, card(200, 150, 1520, 680, { rot: -0.5 }), { dy: 0 });
      s += E(t, W('intera'), boxLines(v1, I, 4), { dy: 0 });
      s += E(t, W('intera') + 0.2, T(560, 790, 'PROFONDITÀ INTERA', { f: 'mono', size: 28, fill: I, a: 'middle', w: 700, ls: 3 }));
      s += E(t, W('profondo'), IT(610, 330, 'troppo profondo e innaturale', { fill: I, size: 46, a: 'middle' }));
      s += E(t, W('voluta'), boxLines(v2, C.coralT, 6), { dy: 0 });
      s += E(t, W('voluta') + 0.2, T(1260, 790, 'RIDOTTA ALLA METÀ', { f: 'mono', size: 28, fill: I, a: 'middle', w: 700, ls: 3 }));
      return s + caption(t, W('distorsione'), 'Una distorsione voluta', '', true);
    } };
} });

// ===== costruzione del parallelepipedo 80 × 60 × 50 mm (esempio) =====
const KO = [430, 760], KK = 6.5, KV = boxV(KO, KK, 80, 60, 50);
const KAX = () => seg(KO, [KO[0] + 760, KO[1]], C.lineDim, 2.5, 'stroke-dasharray="6 10"') + seg(KO, [KO[0], KO[1] - 520], C.lineDim, 2.5, 'stroke-dasharray="6 10"') + seg(KO, pol(KO, 330, 45), C.lineDim, 2.5, 'stroke-dasharray="6 10"');
const Q80 = () => quota(KV.A, KV.B, [0, 1], 56, '80 mm', C.line, { d: 50 });
const Q50 = () => quota(KV.A, KV.D, [-1, 0], 56, '50 mm', C.line, { d: 30, a: 'end', dy: 10 });
const Q30 = () => T(590, 384, '30 mm', { f: 'mono', size: 30, fill: C.line, w: 700, ls: 2 });
const esempio = (t) => E(t, -0.2, pillTag(1250, 250, 'ESEMPIO', C.line, C.bg));

scene('c1', { make: (W) => ({
  capAt: W('larghezza'), hold: W('cinquanta'),
  render(t) {
    let s = E(t, -0.3, KAX() + dot(KO, C.line, 8) + T(KO[0] - 26, KO[1] + 44, 'O', { f: 'pop', size: 44, a: 'middle' }), { dy: 0 });
    s += esempio(t);
    const tx = W('ics'), tz = W('zeta');
    s += drawSeg(t, tx, 0.7, KV.A, KV.B, t < tz ? C.coral : C.line, t < tz ? 7 : 5);
    s += drawSeg(t, tz, 0.7, KV.A, KV.D, t >= tz ? C.coral : C.line, 7);
    s += E(t, W('ottanta'), Q80(), { dy: 0 });
    s += E(t, W('cinquanta'), Q50(), { dy: 0 });
    s += E(t, W('parallelepipedo'), lbl(1250, 330, 'PARALLELEPIPEDO', { a: 'start', size: 30 }));
    s += E(t, W('ottanta'), T(1250, 450, 'x: 80 mm', { f: 'pop', size: 68 }) + IT(1254, 510, 'larghezza reale', { size: 46 }));
    s += E(t, W('cinquanta'), T(1250, 630, 'z: 50 mm', { f: 'pop', size: 68 }) + IT(1254, 690, 'altezza reale', { size: 46 }));
    return s + caption(t, W('larghezza'), 'Larghezza e altezza reali', '');
  } }) });

scene('c2', { make: (W) => ({
  capAt: W('profondità'), hold: W('trenta'),
  render(t) {
    let s = KAX() + dot(KO, C.line, 8) + T(KO[0] - 26, KO[1] + 44, 'O', { f: 'pop', size: 44, a: 'middle' }) + seg(KV.A, KV.B, C.line, 5) + seg(KV.A, KV.D, C.line, 5) + Q80() + Q50();
    s += esempio(t);
    s += drawSeg(t, W('profondità'), 0.7, KV.D, KV.D2, C.coral, 7);
    s += E(t, W('trenta'), dot(KV.D2, C.line, 8) + Q30(), { dy: 0 });
    s += T(1250, 330, 'PARALLELEPIPEDO', { f: 'mono', size: 30, fill: C.line, ls: 3, w: 600 });
    s += T(1250, 450, 'x: 80 mm', { f: 'pop', size: 68 }) + T(1250, 560, 'z: 50 mm', { f: 'pop', size: 68 });
    s += E(t, W('sessanta'), IT(1254, 650, 'profondità: 60 mm reali', { size: 46 }));
    s += E(t, W('trenta'), T(1250, 750, 'y: 30 mm', { f: 'pop', size: 68 }));
    return s + caption(t, W('profondità'), "Profondità sull'asse y", '');
  } }) });

scene('c3', { make: (W) => ({
  capAt: W('linee'), hold: W('tratteggiano'),
  render(t) {
    const v = KV, tc = W('completa'), tp = W('parallele'), tn = W('nascosti');
    let s = KAX() + dot(KO, C.line, 8) + seg(v.A, v.B, C.line, 5) + seg(v.A, v.D, C.line, 5) + Q80() + Q50();
    s += E(t, W('facce'), face([v.A, v.B, v.Cc, v.D], mix(C.bg, C.line, 0.06)) + face([v.D, v.Cc, v.C2, v.D2], mix(C.bg, C.line, 0.12)) + face([v.B, v.B2, v.C2, v.Cc], mix(C.bg, C.line, 0.20)), { dy: 0, blur: 4 });
    s += seg(v.D, v.D2, C.line, 5) + Q30();
    s += drawSeg(t, tc, 0.5, v.B, v.Cc, C.line, 5) + drawSeg(t, tc + 0.3, 0.5, v.D, v.Cc, C.line, 5);
    s += drawSeg(t, tp, 0.5, v.Cc, v.C2, C.line, 5) + drawSeg(t, tp, 0.5, v.B, v.B2, C.line, 5);
    s += drawSeg(t, W('assi'), 0.5, v.D2, v.C2, C.line, 5) + drawSeg(t, W('assi'), 0.5, v.B2, v.C2, C.line, 5);
    s += drawSeg(t, tn, 0.5, v.A, v.A2, C.line, 3, DASH) + drawSeg(t, tn, 0.5, v.A2, v.B2, C.line, 3, DASH) + drawSeg(t, tn, 0.5, v.D2, v.A2, C.line, 3, DASH);
    s += esempio(t);
    s += E(t, W('facce'), IT(1254, 380, 'tre facce visibili', { size: 50 }));
    s += E(t, W('parallele'), T(1250, 480, 'parallele', { f: 'pop', size: 68 }) + T(1250, 560, 'agli assi', { f: 'pop', size: 68 }));
    s += E(t, tn, seg([1254, 660], [1374, 660], C.line, 4, DASH) + IT(1400, 676, 'spigoli nascosti', { size: 46 }));
    return s + caption(t, W('linee'), 'Parallele agli assi', '');
  } }) });

// 11 — la faccia frontale resta vera (chiaro)
scene('front', { make: (W) => {
  const k = 6, v = boxV([400, 720], k, 80, 60, 50);
  return {
    capAt: W('proporzioni'), hold: W('inclinata'),
    render(t) {
      const I = C.ink;
      let s = lightBg() + E(t, -0.4, card(200, 150, 1520, 680, { rot: -0.5 }), { dy: 0 });
      s += E(t, -0.3, boxLines(v, I, 4), { dy: 0 });
      s += E(t, W('faccia'), face([v.A, v.B, v.Cc, v.D], C.coral) .replace('stroke="none"', 'stroke="none" opacity="0.45"') + boxLines(v, I, 4, false), { dy: 0, blur: 4 });
      const rm = (p, sx, sy) => poly([[p[0] + 30 * sx, p[1]], [p[0] + 30 * sx, p[1] + 30 * sy], [p[0], p[1] + 30 * sy]], I, 3);
      s += E(t, W('proporzioni'), rm(v.A, 1, -1) + rm(v.B, -1, -1) + rm(v.Cc, -1, 1) + rm(v.D, 1, 1), { dy: 0, blur: 3 });
      s += E(t, W('frontale'), pillTag(1120, 290, 'PIANO XZ', I, C.cream));
      s += E(t, W('proporzioni'), T(1120, 420, 'proporzioni', { f: 'pop', size: 72, fill: I }) + T(1120, 500, 'reali', { f: 'pop', size: 72, fill: I }));
      s += E(t, W('profondità'), IT(1124, 610, 'solo la profondità', { fill: I, size: 48 }));
      s += E(t, W('ridotta'), IT(1124, 670, 'è ridotta e inclinata', { fill: I, size: 48 }));
      return s + caption(t, W('proporzioni'), 'Faccia frontale: proporzioni reali', '', true);
    } };
} });

// 12 — quando si usa: faccia frontale complessa (esempio: pannello ad arco con foro passante)
scene('quando', { make: (W) => {
  const k = 6, O = [600, 830], Wd = 80 * k, Hr = 30 * k, R = 40 * k, d = [10 * k * C45, -10 * k * C45]; // spessore reale 20 mm → 10 mm sul disegno
  const c = [O[0] + Wd / 2, O[1] - Hr], rh = 15 * k;
  const outline = (dx, dy) => `M${O[0] + dx},${O[1] + dy} L${O[0] + Wd + dx},${O[1] + dy} L${O[0] + Wd + dx},${O[1] - Hr + dy} A${R},${R} 0 0 0 ${O[0] + dx},${O[1] - Hr + dy} Z`;
  const hole = (dx, dy) => `M${c[0] + rh + dx},${c[1] + dy} A${rh},${rh} 0 1 0 ${c[0] - rh + dx},${c[1] + dy} A${rh},${rh} 0 1 0 ${c[0] + rh + dx},${c[1] + dy} Z`;
  const BR = [O[0] + Wd, O[1]], TG = pol(c, R, 135); // punti di contorno apparente nella direzione di fuga
  const defs = `<mask id="mF"><rect x="0" y="0" width="1920" height="1080" fill="#fff"/><path d="${outline(0, 0)}" fill="#000"/></mask><clipPath id="cH"><circle cx="${c[0]}" cy="${c[1]}" r="${rh}"/></clipPath>`;
  return {
    capAt: W('preferisce'), hold: W('complessa'),
    render(t) {
      let s = `<defs>${defs}</defs>`;
      let g = `<path d="${outline(d[0], d[1])}" fill="none" stroke="${C.line}" stroke-width="4" stroke-linejoin="round" mask="url(#mF)"/>`;
      g += seg(BR, [BR[0] + d[0], BR[1] + d[1]], C.line, 4) + seg(TG, [TG[0] + d[0], TG[1] + d[1]], C.line, 4);
      g += `<path d="${outline(0, 0)} ${hole(0, 0)}" fill="${mix(C.bg, C.line, 0.10)}" fill-rule="evenodd" stroke="none"/>`;
      g += `<circle cx="${c[0] + d[0]}" cy="${c[1] + d[1]}" r="${rh}" fill="none" stroke="${C.line}" stroke-width="3" clip-path="url(#cH)"/>`;
      s += E(t, -0.3, g, { dy: 0 });
      const front = `<path d="${outline(0, 0)} ${hole(0, 0)}" fill="none" stroke="${t >= W('frontale') ? C.coral : C.line}" stroke-width="${t >= W('frontale') ? 6 : 4}" stroke-linejoin="round"/>`;
      s += E(t, -0.3, front, { dy: 0 });
      s += E(t, -0.2, pillTag(96, 250, 'ESEMPIO', C.line, C.bg));
      s += E(t, W('cavaliera'), lbl(1250, 330, 'SI PREFERISCE', { a: 'start', size: 30 }));
      s += E(t, W('rapidamente'), T(1250, 440, 'a mano,', { f: 'pop', size: 68 }) + IT(1254, 500, 'rapidamente', { size: 50 }));
      s += E(t, W('frontale'), T(1250, 630, 'faccia frontale', { f: 'pop', size: 68 }));
      s += E(t, W('complessa'), IT(1254, 690, 'dalla forma complessa', { size: 50 }));
      return s + caption(t, W('preferisce'), 'Quando si preferisce', '');
    } };
} });

// 13 — cartello finale
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Assonometria cavaliera', { f: 'pop', size: 116, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('faccia') - 0.1, 960, 560, 'Faccia frontale reale, profondità a metà.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'metà', keyFill: C.coralT });
    s += E(t, W('metà') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC DIS-2-02', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
