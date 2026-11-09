// Prospettiva centrale e accidentale — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="1"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

// ---------- primitive geometriche ----------
const f1 = v => (+v).toFixed(1);
function ln(x1, y1, x2, y2, o = {}) {
  return `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${o.c || C.line}" stroke-width="${o.w || 3}" stroke-linecap="round"` +
    `${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.op != null ? ` opacity="${(+o.op).toFixed(3)}"` : ''}/>`;
}
// segmento tracciato progressivamente da (x1,y1) verso (x2,y2)
function seg(x1, y1, x2, y2, p, o = {}) {
  p = clamp(p); if (p <= 0) return '';
  return ln(x1, y1, x1 + (x2 - x1) * p, y1 + (y2 - y1) * p, o);
}
const prog = (t, t0, d = 0.7) => eio((t - t0) / d);
function poly(pts, o = {}) {
  return `<polygon points="${pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" fill="${o.fill || 'none'}" stroke="${o.c || C.line}" stroke-width="${o.w || 3}" stroke-linejoin="round"${o.op != null ? ` opacity="${(+o.op).toFixed(3)}"` : ''}/>`;
}
// intersezione di due rette (p1-p2) e (p3-p4)
function inter(p1, p2, p3, p4) {
  const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
  const a = p1[0] * p2[1] - p1[1] * p2[0], b = p3[0] * p4[1] - p3[1] * p4[0];
  return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
}
// punto sulla retta per A e PF alla coordinata x
const onX = (A, P, x) => [x, A[1] + (P[1] - A[1]) * (x - A[0]) / (P[0] - A[0])];
// etichetta mono con targhetta di fondo (le linee non la attraversano)
function tag(x, y, s, o = {}) {
  const size = o.size || 26, ls = o.ls ?? 3, w = tw(s, 'mono', size) + ls * s.length + 24, h = size + 20;
  const a = o.a || 'middle', x0 = a === 'middle' ? x - w / 2 : a === 'end' ? x - w : x;
  const ink = o.fill || C.line, bg = o.bg || C.bg;
  return `<rect x="${f1(x0)}" y="${f1(y - size - 4)}" width="${f1(w)}" height="${h}" rx="8" fill="${bg}"${o.box ? ` stroke="${ink}" stroke-width="2"` : ''}/>` +
    T(x0 + 12 + (w - 24) / 2, y + 4 - size * 0.12, s, { f: 'mono', size, fill: ink, a: 'middle', ls, w: 600 });
}
function grid(ink = C.line) { // carta da disegno, appena visibile
  let s = ''; const c = mix(C.bg, ink, 0.07);
  for (let x = 0; x <= 1920; x += 60) s += `<line x1="${x}" y1="0" x2="${x}" y2="1080" stroke="${c}" stroke-width="1"/>`;
  for (let y = 0; y <= 1080; y += 60) s += `<line x1="0" y1="${y}" x2="1920" y2="${y}" stroke="${c}" stroke-width="1"/>`;
  return s;
}
function pfDot(x, y, c = C.coral, r = 13) {
  return `<circle cx="${x}" cy="${y}" r="${r + 9}" fill="none" stroke="${c}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
}
function stepTag(t, t0, s) { // passo corrente, in alto al centro
  return E(t, t0, tag(960, 190, s, { size: 30, box: true, ls: 4 }), { dy: 10 });
}
function pushLight(g, t, D) { const k = 1 + 0.025 * t / D; return `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`; }

// ---------- 1 — binari (prospettiva vera: x = PX + f·X/Z, y = HY + f·(h−Y)/Z) ----------
const RW = { PX: 960, HY: 420, f: 700, h: 1.5 };
const prj = (X, Y, Z, P = RW) => [P.PX + P.f * X / Z, P.HY + P.f * (P.h - Y) / Z];
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('lontani'), last: W('punto'),
  render(t) {
    let s = '';
    s += E(t, -0.4, ln(0, RW.HY, 1920, RW.HY, { w: 2, c: C.lineDim }), { dy: 0 });
    // traversine: profondità 0,25 m, passo 0,65 m, larghe 2,6 m
    const pr = prog(t, 0, 2.0);
    for (let Z = 1.6; Z < 46; Z += 0.65) {
      const k = (Z - 1.6) / 44; if (k > pr) break;
      const a = prj(-1.3, 0, Z), b = prj(1.3, 0, Z), c = prj(1.3, 0, Z + 0.25), d = prj(-1.3, 0, Z + 0.25);
      s += poly([a, b, c, d], { fill: mix(C.bg, C.line, 0.08), w: 2, op: 1 - k * 0.5 });
    }
    // rotaie
    for (const X of [-0.78, -0.70, 0.70, 0.78]) {
      const A = prj(X, 0, 1.55), B = prj(X, 0, 46);
      s += seg(A[0], A[1], B[0], B[1], pr, { w: 4 });
    }
    // pali uguali (alti 4,5 m, ogni 4 m) — più lontani, più piccoli
    for (let i = 0; i < 9; i++) {
      const Z = 8 + i * 4, t0 = W('oggetti') + i * 0.12;
      const g = prj(3.2, 0, Z), tp = prj(3.2, 4.5, Z), arm = prj(2.5, 4.3, Z);
      s += E(t, t0, ln(g[0], g[1], tp[0], tp[1], { w: Math.max(2, 18 / Z * 4) }) + ln(arm[0], arm[1], tp[0] + (tp[0] - arm[0]) * 0.6, arm[1], { w: Math.max(2, 10 / Z * 4) }), { dy: 0, d: 0.4 });
    }
    // prolungamenti delle rotaie fino al punto
    const pc = prog(t, W('convergere') - 0.05, 0.9);
    for (const X of [-0.74, 0.74]) { const A = prj(X, 0, 46); s += seg(A[0], A[1], RW.PX, RW.HY, pc, { w: 3, dash: '4 10' }); }
    s += pop(t, W('punto'), RW.PX, RW.HY, pfDot(RW.PX, RW.HY));
    s += words(t, 0.15, 96, 250, 'Sembrano unirsi?', { f: 'pop', size: 88, fill: C.line });
    return s + caption(t, W('lontani'), 'Lontano, più piccolo', '');
  } }) });

// ---------- 2 — naturale ma non fedele alle misure ----------
const MP = { PX: 640, HY: 400, f: 420, h: 1.5 };
scene('misure', { make: (W) => ({
  capAt: W('naturale'), last: W('misure'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(200, 160, 1520, 680, { rot: -0.6 }), { dy: 0 });
    // scenetta in prospettiva: rotaie e due pali uguali
    let sk = ln(250, MP.HY, 760, MP.HY, { c: C.ink, w: 2, op: 0.5 });
    for (const X of [-0.75, 0.75]) { const A = prj(X, 0, 1.75, MP); sk += ln(A[0], A[1], MP.PX, MP.HY, { c: C.ink, w: 3 }); }
    for (let Z = 1.9; Z < 30; Z += 1.1) { const A = prj(-1.3, 0, Z, MP), B = prj(1.3, 0, Z, MP); sk += ln(A[0], A[1], B[0], B[1], { c: C.ink, w: 2, op: 0.6 }); }
    const poles = [5, 12].map(Z => ({ Z, g: prj(2.4, 0, Z, MP), tp: prj(2.4, 3, Z, MP) }));
    poles.forEach(p => { sk += ln(p.g[0], p.g[1], p.tp[0], p.tp[1], { c: C.ink, w: 26 / p.Z * 2 }); });
    g += E(t, -0.2, `<g>${sk}</g>`, { dy: 0 });
    // quote: stessa altezza reale, lunghezze disegnate diverse
    const q = (p, i) => { const x = p.g[0] + 34; return ln(x, p.g[1], x, p.tp[1], { c: C.ink, w: 3 }) + ln(x - 10, p.g[1], x + 10, p.g[1], { c: C.ink, w: 3 }) + ln(x - 10, p.tp[1], x + 10, p.tp[1], { c: C.ink, w: 3 }) +
      T(x + 18, (p.g[1] + p.tp[1]) / 2 + 12, 'h', { f: 'serif', it: true, size: 46, fill: C.ink }); };
    g += E(t, W('misure') - 0.05, q(poles[0]) + q(poles[1]), { dy: 0 });
    g += E(t, W('misure') + 0.15, T(1160, 730, 'stessa altezza reale,', { f: 'serif', it: true, size: 46, fill: C.ink }) + T(1160, 784, 'disegnata diversa', { f: 'serif', it: true, size: 46, fill: C.ink }));
    // due voci: naturale sì, misure no
    const ck = (x, y) => `<path d="M${x},${y} l18,20 l36,-44" fill="none" stroke="${C.ink}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
    const cx = (x, y) => `<path d="M${x},${y - 30} l44,44 M${x + 44},${y - 30} l-44,44" fill="none" stroke="${C.coral}" stroke-width="10" stroke-linecap="round"/>`;
    g += E(t, W('naturale') - 0.05, ck(1160, 400) + T(1250, 410, 'più naturale', { f: 'pop', size: 58, fill: C.ink }));
    g += E(t, W('fedele') - 0.05, cx(1166, 560) + T(1250, 570, 'misure reali', { f: 'pop', size: 58, fill: C.ink }));
    s += pushLight(g, t, D);
    return s + caption(t, W('naturale'), 'Naturale, non fedele', '', true);
  } }) });

// ---------- 3 — assonometria vs prospettiva ----------
scene('confronto', { make: (W) => ({
  capAt: W('deformate'), last: W('deformate'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(160, 150, 1600, 700, { rot: 0.5 }), { dy: 0 });
    g += `<line x1="960" y1="200" x2="960" y2="800" stroke="${C.ink}" stroke-width="2" opacity="0.35"/>`;
    // sinistra: cubo in assonometria isometrica (spigoli tutti lunghi a = 190)
    const a = 160, ox = 560, oy = 680, ux = [a * Math.cos(Math.PI / 6), a * 0.5], uy = [-a * Math.cos(Math.PI / 6), a * 0.5];
    const P = (i, j, k) => [ox + i * ux[0] + j * uy[0], oy + i * ux[1] + j * uy[1] - k * a];
    // vertici visibili: guardiamo dall'alto, davanti = verso il basso
    const v000 = P(0, 0, 0), v100 = P(1, 0, 0), v010 = P(0, 1, 0), v001 = P(0, 0, 1), v101 = P(1, 0, 1), v011 = P(0, 1, 1), v111 = P(1, 1, 1);
    let cube = '';
    // il vertice frontale basso è (1,1,0): ricentriamo usando i vertici opposti
    const F = (i, j, k) => P(-i, -j, k); // davanti verso lo spettatore
    const q = [F(0, 0, 0), F(1, 0, 0), F(0, 1, 0), F(0, 0, 1), F(1, 0, 1), F(0, 1, 1), F(1, 1, 1)];
    cube += poly([F(0, 0, 1), F(1, 0, 1), F(1, 1, 1), F(0, 1, 1)], { c: C.ink, w: 4, fill: mix(C.cream, C.ink, 0.06) });
    cube += poly([F(0, 0, 0), F(1, 0, 0), F(1, 0, 1), F(0, 0, 1)], { c: C.ink, w: 4, fill: mix(C.cream, C.ink, 0.14) });
    cube += poly([F(0, 0, 0), F(0, 1, 0), F(0, 1, 1), F(0, 0, 1)], { c: C.ink, w: 4, fill: mix(C.cream, C.ink, 0.22) });
    const lab = (A, B, dx, dy) => T((A[0] + B[0]) / 2 + dx, (A[1] + B[1]) / 2 + dy, 'a', { f: 'serif', it: true, size: 44, fill: C.ink, a: 'middle' });
    g += E(t, W("nell'assonometria") - 0.05, cube, { dy: 0 });
    g += E(t, W('misure') - 0.05, lab(F(0, 0, 0), F(1, 0, 0), -26, 44) + lab(F(0, 0, 0), F(0, 1, 0), 26, 44) + lab(F(1, 0, 0), F(1, 0, 1), -30, 14), { dy: 0 });
    g += E(t, -0.2, T(560, 290, 'ASSONOMETRIA', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 4, w: 700 }));
    g += E(t, W('conservano') - 0.05, T(560, 735, 'misure conservate', { f: 'serif', it: true, size: 46, fill: C.ink, a: 'middle' }));
    g += E(t, W('riducono') - 0.05, T(560, 785, 'o ridotte con un fattore costante', { f: 'serif', it: true, size: 36, fill: C.ink, a: 'middle' }));
    // destra: prospettiva centrale dello stesso tipo di solido (faccia frontale vera, profondità verso PF)
    const PF = [1560, 380], fr = [[1160, 470], [1350, 470], [1350, 660], [1160, 660]], k = 0.62;
    const bk = fr.map(p => [PF[0] + (p[0] - PF[0]) * k, PF[1] + (p[1] - PF[1]) * k]);
    let pe = ln(1010, PF[1], 1710, PF[1], { c: C.ink, w: 2, op: 0.5 });
    const pp = prog(t, W('prospettiva') - 0.05, 0.8);
    fr.forEach(p => { pe += seg(p[0], p[1], PF[0], PF[1], pp, { c: C.ink, w: 2, dash: '3 9' }); });
    // facce visibili: superiore e destra
    pe += poly([fr[0], fr[1], bk[1], bk[0]], { c: C.ink, w: 4, fill: mix(C.cream, C.ink, 0.06) });
    pe += poly([fr[1], bk[1], bk[2], fr[2]], { c: C.ink, w: 4, fill: mix(C.cream, C.ink, 0.22) });
    pe += poly(fr, { c: C.ink, w: 4, fill: mix(C.cream, C.ink, 0.14) });
    g += E(t, W('prospettiva') - 0.05, pe, { dy: 0 });
    g += E(t, W('prospettiva') + 0.4, pop(t, W('prospettiva') + 0.4, PF[0], PF[1], pfDot(PF[0], PF[1], C.coral, 11)), { dy: 0, blur: 0 });
    { const bx = bk[1][0] + 28, by = (bk[1][1] + bk[2][1]) / 2 + 14;
      g += E(t, W('deformate') - 0.05, T(fr[0][0] - 30, (fr[0][1] + fr[3][1]) / 2 + 14, 'a', { f: 'serif', it: true, size: 44, fill: C.ink, a: 'middle' }) +
        `<rect x="${f1(bx - 18)}" y="${f1(by - 36)}" width="36" height="46" rx="6" fill="${C.cream}"/>` + T(bx, by, 'a', { f: 'serif', it: true, size: 44, fill: C.ink, a: 'middle' })); }
    g += E(t, W('prospettiva') - 0.05, T(1360, 290, 'PROSPETTIVA', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 4, w: 700 }));
    g += E(t, W('deformate') - 0.05, T(1360, 735, 'misure deformate', { f: 'serif', it: true, size: 46, fill: C.ink, a: 'middle' }));
    g += E(t, W('per') - 0.05, T(1360, 785, 'per simulare la percezione', { f: 'serif', it: true, size: 36, fill: C.ink, a: 'middle' }));
    s += pushLight(g, t, D);
    return s + caption(t, W('deformate'), 'Conservate o deformate', '', true);
  } }) });

// ---------- 4 — prospettiva centrale: un corridoio ----------
const CR = { PX: 960, HY: 470, f: 760, h: 1.6 };
scene('centrale', { make: (W) => ({
  capAt: W('unico'), last: W("d'orizzonte"),
  render(t) {
    let s = grid();
    const P = (X, Y, Z) => prj(X, Y, Z, CR), Zb = 9, xw = 1.6, H = 3.0;
    const draw = prog(t, -0.3, 1.2);
    // parete di fondo (parallela al quadro: resta rettangolo)
    const b = [P(-xw, H, Zb), P(xw, H, Zb), P(xw, 0, Zb), P(-xw, 0, Zb)];
    let c = poly(b, { w: 3, fill: mix(C.bg, C.line, 0.05) });
    // spigoli del corridoio: dal bordo dell'inquadratura alla parete di fondo
    for (const [X, Y] of [[-xw, H], [xw, H], [xw, 0], [-xw, 0]]) { const A = P(X, Y, 0.9), B = P(X, Y, Zb); c += seg(A[0], A[1], B[0], B[1], draw, { w: 4 }); }
    // pavimento: linee longitudinali e trasversali
    for (const X of [-0.8, 0, 0.8]) { const A = P(X, 0, 0.9), B = P(X, 0, Zb); c += seg(A[0], A[1], B[0], B[1], draw, { w: 2, c: C.lineDim }); }
    for (let Z = 1.5; Z < Zb; Z += 0.8) { const A = P(-xw, 0, Z), B = P(xw, 0, Z); c += ln(A[0], A[1], B[0], B[1], { w: 2, c: C.lineDim, op: clamp(draw * 3 - (Z - 1.5) / 4) }); }
    // porte sulle pareti
    const door = (X, Z0, Z1) => poly([P(X, 0, Z0), P(X, 2.2, Z0), P(X, 2.2, Z1), P(X, 0, Z1)], { w: 3, fill: mix(C.bg, C.line, 0.1) });
    c += E(t, 0.6, door(-xw, 2.6, 3.6) + door(xw, 4.6, 5.4) + door(-xw, 6.4, 7.0), { dy: 0 });
    // luci a soffitto
    for (const Z of [2.4, 4.2]) c += E(t, 0.8 + Z * 0.05, poly([P(-0.4, H, Z), P(0.4, H, Z), P(0.4, H, Z + 0.5), P(-0.4, H, Z + 0.5)], { w: 2, fill: mix(C.bg, C.line, 0.25) }), { dy: 0 });
    s += c;
    // prolungamenti delle rette parallele alla direzione di vista
    const pe = prog(t, W('convergono') - 0.05, 0.8);
    for (const [X, Y] of [[-xw, H], [xw, H], [xw, 0], [-xw, 0], [-0.8, 0], [0, 0], [0.8, 0]]) { const B = P(X, Y, Zb); s += seg(B[0], B[1], CR.PX, CR.HY, pe, { w: 2, dash: '4 9' }); }
    s += pop(t, W('punto'), CR.PX, CR.HY, pfDot(CR.PX, CR.HY, C.coral, 11));
    s += E(t, W('punto') + 0.1, tag(CR.PX, 300, 'PUNTO DI FUGA'));
    const ph = prog(t, W('linea') - 0.05, 0.7);
    s += seg(CR.PX, CR.HY, 1920, CR.HY, ph, { w: 2, dash: '14 8' }) + seg(CR.PX, CR.HY, 0, CR.HY, ph, { w: 2, dash: '14 8' });
    s += E(t, W("d'orizzonte"), tag(1880, CR.HY - 22, "LINEA D'ORIZZONTE", { a: 'end' }));
    return s + caption(t, W('unico'), 'Unico punto di fuga', '');
  } }) });

// ---------- 5–7 — costruzione a un punto di fuga ----------
const K1 = { HY: 400, PF: [1240, 400], fr: [[560, 560], [880, 560], [880, 780], [560, 780]], k: 0.6 };
const back1 = k => K1.fr.map(p => [K1.PF[0] + (p[0] - K1.PF[0]) * k, K1.PF[1] + (p[1] - K1.PF[1]) * k]);
function horizon1(t, t0, o = {}) {
  const p = o.full ? 1 : prog(t, t0, 0.8);
  return seg(960, K1.HY, 1920, K1.HY, p, { w: 3 }) + seg(960, K1.HY, 0, K1.HY, p, { w: 3 }) +
    (o.noLabel ? '' : E(t, o.full ? -1 : t0 + 0.3, tag(96, K1.HY - 24, "LINEA D'ORIZZONTE", { a: 'start' }), { dy: 0 }));
}
scene('c12', { make: (W) => ({
  capAt: W('linea'), last: W('punto'),
  render(t) {
    let s = grid();
    s += stepTag(t, W('linea') - 0.05, t < W('sulla') - 0.05 ? "1 · LINEA D'ORIZZONTE" : '2 · PUNTO DI FUGA');
    s += horizon1(t, W('linea') - 0.05);
    const ex = 620, ey = K1.HY; // occhio dell'osservatore all'altezza della linea
    const eye = `<path d="M${ex - 62},${ey} Q${ex},${ey - 52} ${ex + 62},${ey} Q${ex},${ey + 52} ${ex - 62},${ey} z" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/><circle cx="${ex}" cy="${ey}" r="20" fill="${C.line}"/>`;
    s += E(t, W('occhi') - 0.05, eye + tag(ex, ey + 90, 'ALTEZZA DEGLI OCCHI'), { dy: 0 });
    s += pop(t, W('punto'), K1.PF[0], K1.PF[1], pfDot(K1.PF[0], K1.PF[1]));
    s += E(t, W('punto') + 0.1, tag(K1.PF[0], K1.PF[1] - 50, 'PF'));
    return s + caption(t, W('linea'), 'Orizzonte e punto', '');
  } }) });
function board1(t, o = {}) { // orizzonte + PF già presenti
  return horizon1(t, 0, { full: true }) + pfDot(K1.PF[0], K1.PF[1]) + tag(K1.PF[0], K1.PF[1] - 50, 'PF');
}
scene('c34', { make: (W) => ({
  capAt: W('rettangolo'), last: W('linee'),
  render(t) {
    let s = grid() + board1(t);
    const step = t < W('dai') - 0.05 ? '3 · FACCIA FRONTALE' : '4 · LINEE DI FUGA';
    s += stepTag(t, W('disegna'), step);
    const fr = K1.fr, pr = prog(t, W('rettangolo') - 0.05, 0.9);
    for (let i = 0; i < 4; i++) { const A = fr[i], B = fr[(i + 1) % 4]; s += seg(A[0], A[1], B[0], B[1], clamp(pr * 4 - i), { w: 5 }); }
    s += E(t, W('proporzioni') - 0.05, tag(720, 850, 'PROPORZIONI REALI'), { dy: 0 });
    fr.forEach((p, i) => { s += seg(p[0], p[1], K1.PF[0], K1.PF[1], prog(t, W('angoli') - 0.05 + i * 0.25, 0.7), { w: 2 }); });
    fr.forEach((p, i) => { s += pop(t, W('quattro') - 0.05 + i * 0.1, p[0], p[1], `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${C.line}"/>`); });
    return s + caption(t, W('rettangolo'), 'Rettangolo e linee', '');
  } }) });
scene('c56', { make: (W) => ({
  capAt: W('chiudi'), last: W('eccesso'),
  render(t) {
    let s = grid() + board1(t);
    const step = t < W('ed') - 0.05 ? '5 · PROFONDITÀ' : '6 · ELIMINA L\'ECCESSO';
    s += stepTag(t, -0.4, step);
    const fr = K1.fr, PF = K1.PF;
    // profondità scelta: il fattore scorre e si ferma
    const k = lerp(0.82, K1.k, eio((t - W('profondità')) / 0.9)), bk = back1(k);
    const clean = prog(t, W('elimina') - 0.05, 0.8);
    // linee di fuga: tratto oltre il retro sparisce con la pulizia
    fr.forEach((p, i) => {
      const hidden = i === 3; // spigolo inferiore sinistro: nascosto
      s += ln(bk[i][0], bk[i][1], PF[0], PF[1], { w: 2, op: 1 - clean });
      s += ln(p[0], p[1], bk[i][0], bk[i][1], { w: hidden ? 2 : 4, dash: hidden ? '8 8' : null, op: hidden ? 1 - clean : 1 });
    });
    // rettangolo posteriore, parallelo al primo
    const pc = prog(t, W('chiudi') - 0.05, 0.8);
    if (t > W('profondità') - 0.05) bk.forEach(p => { s += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="8" fill="${C.line}"/>`; });
    const edges = [[0, 1, true], [1, 2, true], [2, 3, false], [3, 0, false]];
    edges.forEach(([i, j, vis], n) => { s += seg(bk[i][0], bk[i][1], bk[j][0], bk[j][1], clamp(pc * 4 - n), { w: vis ? 4 : 2, dash: vis ? null : '8 8', op: vis ? 1 : 1 - clean }); });
    // facce visibili riempite a pulizia fatta
    if (clean > 0) {
      s += poly([fr[0], fr[1], bk[1], bk[0]], { w: 0.01, fill: mix(C.bg, C.line, 0.10), op: clean });
      s += poly([fr[1], bk[1], bk[2], fr[2]], { w: 0.01, fill: mix(C.bg, C.line, 0.20), op: clean });
      s += poly(fr, { w: 0.01, fill: mix(C.bg, C.line, 0.15), op: clean });
      s += poly([fr[0], fr[1], bk[1], bk[0]], { w: 5 }) + poly([fr[1], bk[1], bk[2], fr[2]], { w: 5 });
    }
    s += poly(fr, { w: 5 });
    s += E(t, W('primo') - 0.1, tag(bk[0][0] - 20, bk[0][1] - 26, 'PARALLELO', { a: 'end' }), { dy: 0 });
    return s + caption(t, W('chiudi'), 'Chiudi ed elimina', '');
  } }) });

// ---------- 8 — prospettiva accidentale ----------
function box2(o) { // scatola vista di spigolo: spigolo frontale x0, da yt a yb; spigoli laterali xl, xr
  const P1 = o.P1, P2 = o.P2, FT = [o.x0, o.yt], FB = [o.x0, o.yb];
  const RT = onX(FT, P1, o.xr), RB = onX(FB, P1, o.xr), LT = onX(FT, P2, o.xl), LB = onX(FB, P2, o.xl);
  const BT = inter(RT, P2, LT, P1), BB = inter(RB, P2, LB, P1);
  return { FT, FB, RT, RB, LT, LB, BT, BB };
}
const A8 = { HY: 380, P1: [1760, 380], P2: [160, 380] };
scene('accid', { make: (W) => ({
  capAt: W('due'), last: W('verticali', 1),
  render(t) {
    let s = grid();
    const b = box2({ P1: A8.P1, P2: A8.P2, x0: 900, yt: 520, yb: 760, xr: 1220, xl: 600 });
    s += ln(0, A8.HY, 1920, A8.HY, { w: 2, c: C.lineDim });
    const fill = mix(C.bg, C.line, 0.1);
    let bx = poly([b.FT, b.RT, b.BT, b.LT], { w: 4, fill: mix(C.bg, C.line, 0.06) }) + poly([b.FT, b.RT, b.RB, b.FB], { w: 4, fill: mix(C.bg, C.line, 0.18) }) + poly([b.FT, b.LT, b.LB, b.FB], { w: 4, fill });
    s += E(t, -0.3, bx, { dy: 0 });
    // verso destra → PF1, verso sinistra → PF2
    const pr = prog(t, W('destra') - 0.1, 0.8), pl = prog(t, W('sinistra') - 0.1, 0.8);
    for (const A of [b.RT, b.RB, b.BT]) s += seg(A[0], A[1], A8.P1[0], A8.P1[1], pr, { w: 2, dash: '4 9' });
    for (const A of [b.LT, b.LB, b.BT]) s += seg(A[0], A[1], A8.P2[0], A8.P2[1], pl, { w: 2, dash: '4 9' });
    const dot = (P) => `<circle cx="${P[0]}" cy="${P[1]}" r="14" fill="${C.line}"/><circle cx="${P[0]}" cy="${P[1]}" r="23" fill="none" stroke="${C.line}" stroke-width="3"/>`;
    s += pop(t, W('destra'), A8.P1[0], A8.P1[1], dot(A8.P1) + tag(A8.P1[0], A8.P1[1] - 48, 'PF1'));
    s += pop(t, W('sinistra'), A8.P2[0], A8.P2[1], dot(A8.P2) + tag(A8.P2[0], A8.P2[1] - 48, 'PF2'));
    // le verticali restano verticali: righello a piombo accanto agli spigoli
    const pv = prog(t, W('verticali') - 0.05, 0.6);
    for (const [A, B] of [[b.LT, b.LB], [b.FT, b.FB], [b.RT, b.RB]]) s += seg(A[0], A[1] - 40, B[0], B[1] + 40, pv, { w: 2, dash: '2 8' });
    s += E(t, W('verticali') + 0.1, tag(1560, 700, 'LE VERTICALI RESTANO VERTICALI'), { dy: 0 });
    return s + caption(t, W('due'), 'Due punti di fuga', 'Due');
  } }) });

// ---------- 9–10 — costruzione a due punti di fuga ----------
const K2 = { HY: 380, P1: [1720, 380], P2: [200, 380], x0: 920, yt: 540, yb: 780, xr: 1200, xl: 650 };
const B2 = box2(K2);
function board2(t, t0) {
  const p = t0 == null ? 1 : prog(t, t0, 0.8);
  return seg(960, K2.HY, 1920, K2.HY, p, { w: 3 }) + seg(960, K2.HY, 0, K2.HY, p, { w: 3 });
}
const pfs2 = () => [[K2.P1, 'PF1'], [K2.P2, 'PF2']].map(([P, l]) => `<circle cx="${P[0]}" cy="${P[1]}" r="13" fill="${C.line}"/><circle cx="${P[0]}" cy="${P[1]}" r="22" fill="none" stroke="${C.line}" stroke-width="3"/>` + tag(P[0], P[1] - 48, l)).join('');
scene('a13', { make: (W) => ({
  capAt: W('spigolo'), last: W('misura'),
  render(t) {
    let s = grid();
    s += stepTag(t, -0.2, t < W('spigolo') - 0.05 ? '1–2 · ORIZZONTE E PF1, PF2' : '3 · SPIGOLO FRONTALE');
    s += board2(t, -0.2);
    s += pop(t, W('punti'), K2.P1[0], K2.P1[1], pfs2());
    const pv = prog(t, W('spigolo') - 0.05, 0.7);
    s += seg(K2.x0, K2.yb, K2.x0, K2.yt, pv, { w: 8, c: C.coral });
    s += E(t, W('misura') - 0.05, tag(K2.x0 + 40, (K2.yt + K2.yb) / 2 + 10, 'MISURA REALE', { a: 'start' }), { dy: 0 });
    return s + caption(t, W('spigolo'), 'Lo spigolo frontale', '');
  } }) });
scene('a46', { make: (W) => ({
  capAt: W('profondità'), last: W('facce') + 1.0,
  render(t) {
    let s = grid() + board2(t) + pfs2();
    const b = B2;
    const st = t < W('segna') - 0.05 ? '4 · LINEE VERSO PF1 E PF2' : t < W('chiudi') - 0.05 ? '5 · PROFONDITÀ E SPIGOLI' : '6 · CHIUDI LE FACCE';
    s += stepTag(t, -0.4, st);
    // 4: linee dagli estremi verso i due punti
    const l4 = [[b.FT, K2.P1], [b.FB, K2.P1], [b.FT, K2.P2], [b.FB, K2.P2]];
    l4.forEach(([A, P], i) => { s += seg(A[0], A[1], P[0], P[1], prog(t, W('linee') - 0.05 + i * 0.2, 0.7), { w: 2 }); });
    // 5: profondità e spigoli verticali laterali
    const p5 = prog(t, W('alza') - 0.05, 0.6);
    s += pop(t, W('profondità'), b.RT[0], b.RB[1], `<circle cx="${f1(b.RB[0])}" cy="${f1(b.RB[1])}" r="9" fill="${C.line}"/><circle cx="${f1(b.LB[0])}" cy="${f1(b.LB[1])}" r="9" fill="${C.line}"/>`);
    s += seg(b.RB[0], b.RB[1], b.RT[0], b.RT[1], p5, { w: 5 }) + seg(b.LB[0], b.LB[1], b.LT[0], b.LT[1], p5, { w: 5 });
    // 6: chiusura — faccia superiore visibile, inferiore nascosta (tratteggio)
    const p6 = prog(t, W('chiudi') - 0.05, 0.8);
    s += seg(b.RT[0], b.RT[1], b.BT[0], b.BT[1], p6, { w: 4 }) + seg(b.LT[0], b.LT[1], b.BT[0], b.BT[1], p6, { w: 4 });
    // rette di chiusura: vertice destro → PF2, vertice sinistro → PF1 (si incontrano nel vertice posteriore)
    s += seg(b.RT[0], b.RT[1], K2.P2[0], K2.P2[1], prog(t, W('chiudi') - 0.05, 0.8), { w: 2, dash: '4 9' }) + seg(b.LT[0], b.LT[1], K2.P1[0], K2.P1[1], prog(t, W('chiudi') - 0.05, 0.8), { w: 2, dash: '4 9' });
    if (p6 > 0) {
      s += poly([b.FT, b.RT, b.BT, b.LT], { w: 0.01, fill: mix(C.bg, C.line, 0.10), op: p6 }) + poly([b.FT, b.RT, b.RB, b.FB], { w: 0.01, fill: mix(C.bg, C.line, 0.2), op: p6 }) + poly([b.FT, b.LT, b.LB, b.FB], { w: 0.01, fill: mix(C.bg, C.line, 0.14), op: p6 });
    }
    s += seg(b.RB[0], b.RB[1], b.BB[0], b.BB[1], p6, { w: 3, dash: '8 8' }) + seg(b.LB[0], b.LB[1], b.BB[0], b.BB[1], p6, { w: 3, dash: '8 8' });
    // facce laterali: lati superiori e inferiori sulle linee di fuga
    const p4b = prog(t, W('alza') - 0.05, 0.6);
    s += seg(b.FT[0], b.FT[1], b.RT[0], b.RT[1], p4b, { w: 5 }) + seg(b.FB[0], b.FB[1], b.RB[0], b.RB[1], p4b, { w: 5 }) + seg(b.FT[0], b.FT[1], b.LT[0], b.LT[1], p4b, { w: 5 }) + seg(b.FB[0], b.FB[1], b.LB[0], b.LB[1], p4b, { w: 5 });
    s += seg(b.RT[0], b.RT[1], b.BT[0], b.BT[1], p6, { w: 4 }) + seg(b.LT[0], b.LT[1], b.BT[0], b.BT[1], p6, { w: 4 }) + seg(b.RB[0], b.RB[1], b.RT[0], b.RT[1], p5, { w: 5 }) + seg(b.LB[0], b.LB[1], b.LT[0], b.LT[1], p5, { w: 5 });
    s += ln(K2.x0, K2.yb, K2.x0, K2.yt, { w: 8, c: C.coral });
    return s + caption(t, W('profondità'), 'Profondità, spigoli, facce', '');
  } }) });

// ---------- 11 — chiusura ----------
scene('finale', { L: 0.5, tail: 3.0, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'La prospettiva', { f: 'pop', size: 150, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('uno') - 0.05, 960, 545, 'uno o due punti di fuga:', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true });
    s += words(t, W('così') - 0.05, 960, 625, 'gli oggetti come li vede l\'occhio', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: "l'occhio", keyFill: C.coralD });
    s += E(t, W("l'occhio") + 0.3, `<line x1="760" y1="700" x2="1160" y2="700" stroke="${C.ink}" stroke-width="3"/>` + T(960, 760, 'PROFTECNOLOGIA · MC DIS-3-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5 }));
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
  if (!S.light && !['c12', 'c34', 'c56', 'a13', 'a46'].includes(S.id)) inner = `<g transform="translate(960,540) scale(${1 + 0.025 * t / S.D}) translate(-960,-540)">${inner}</g>`;
  body += inner;
  if (S.id !== 'finale') body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
