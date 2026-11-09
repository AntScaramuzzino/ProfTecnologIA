// Grafici che ingannano — MC-DIG-3-03 §"Come i grafici possono ingannare". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.42);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.55);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });

// ---- mondo: grafici disegnati a filo, come su carta millimetrata in sezione ----
function axes(x0, y0, w, h, st, sw = 4) {
  return `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - h}" stroke="${st}" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" stroke="${st}" stroke-width="${sw}" stroke-linecap="round"/>`;
}
function grid(x0, y0, w, h, n, st) { let s = ''; for (let i = 1; i <= n; i++) { const y = y0 - h * i / n; s += `<line x1="${x0}" y1="${y}" x2="${x0 + w}" y2="${y}" stroke="${st}" stroke-width="1.5" stroke-dasharray="2 10"/>`; } return s; }
function tick(x0, y, s, st, size = 32) { return `<line x1="${x0 - 14}" y1="${y}" x2="${x0}" y2="${y}" stroke="${st}" stroke-width="4"/>` + T(x0 - 26, y + size * 0.35, s, { f: 'mono', size, fill: st, a: 'end', w: 600 }); }
// polilinea disegnata progressivamente (p = 0..1 lungo gli indici)
function poly(pts, p, st, sw = 6, dash = '') {
  if (p <= 0) return '';
  const n = pts.length - 1, f = p * n, k = Math.floor(f), r = f - k, q = pts.slice(0, k + 1);
  if (k < n) q.push([lerp(pts[k][0], pts[k + 1][0], r), lerp(pts[k][1], pts[k + 1][1], r)]);
  return `<polyline points="${q.map(a => a[0].toFixed(1) + ',' + a[1].toFixed(1)).join(' ')}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}
function lens(cx, cy, r, st, sw = 7) {
  const a = Math.PI / 4;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${st}" stroke-width="${sw}"/>` +
    `<line x1="${cx + r * Math.cos(a)}" y1="${cy + r * Math.sin(a)}" x2="${cx + (r + 70) * Math.cos(a)}" y2="${cy + (r + 70) * Math.sin(a)}" stroke="${st}" stroke-width="${sw * 2}" stroke-linecap="round"/>`;
}
function bar(x, yBase, yTop, w, st, fill) {
  const h = Math.max(0, yBase - yTop);
  return `<rect x="${x}" y="${yTop}" width="${w}" height="${h}" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    // tratteggio in sezione
    `<clipPath id="c${x}"><rect x="${x}" y="${yTop}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#c${x})" opacity="0.35">` +
    Array.from({ length: 30 }, (_, i) => `<line x1="${x - 600 + i * 40}" y1="${yBase}" x2="${x - 600 + i * 40 + 600}" y2="${yBase - 600}" stroke="${st}" stroke-width="2"/>`).join('') + '</g>';
}

// 1 — aggancio: leggere non basta
scene('hook', { make: (W) => ({
  capAt: W('basta'), last: W('involontariamente'),
  render(t) {
    let s = words(t, 0.05, 96, 330, 'Saper leggere', { f: 'pop', size: 96 });
    s += words(t, W('un') - 0.05, 96, 450, 'un grafico', { f: 'pop', size: 96 });
    s += E(t, W('basta') - 0.05, IT(100, 545, 'non basta', { size: 58 }));
    s += E(t, W('involontariamente') - 0.05, IT(100, 640, '…anche involontariamente', { size: 50 }));
    // grafico a barre generico (nessun numero)
    const x0 = 1080, y0 = 760;
    s += E(t, 0.2, axes(x0, y0, 640, 520, C.line) + grid(x0, y0, 640, 480, 4, C.lineDim), { dy: 0 });
    [300, 380, 250, 430].forEach((h, i) => {
      const g = eo((t - 0.5 - i * 0.15) / 0.6);
      if (g > 0) s += bar(x0 + 60 + i * 145, y0, y0 - h * g, 100, C.line, DIM());
    });
    // la lente arriva su "riconoscere"
    const lp = eio((t - W('riconoscere')) / 1.2);
    if (t > W('riconoscere') - 0.05) s += `<g opacity="${clamp((t - W('riconoscere') + 0.05) / 0.3)}">` + lens(lerp(1660, 1180, lp), lerp(300, 650, lp), 90, C.coral) + '</g>';
    return s + caption(t, W('basta'), 'Leggere non basta', '');
  } }) });

// 2–3 — l'asse troncato: stessi dati, due assi
const CX0 = 1060, CY0 = 790, CH = 520, B1 = 1160, B2 = 1440, BW_ = 190;
function truncChart(t, base, top, o = {}) {
  const yv = v => CY0 - (v - base) / (top - base) * CH;
  let s = axes(CX0, CY0, 680, CH + 40, C.line) + T(CX0, CY0 - CH - 70, 'PROFITTI · MILIONI', { f: 'mono', size: 26, fill: C.line, a: 'start', ls: 3, w: 600 });
  if (o.ex != null) s += E(t, o.ex, pillTag(CX0 + 400, CY0 - CH - 70, 'ESEMPIO', C.line, C.bg), { dy: 0 });
  const g1 = o.g1 ?? 1, g2 = o.g2 ?? 1;
  if (g1 > 0) s += bar(B1, CY0, CY0 - (CY0 - yv(955)) * g1, BW_, C.line, DIM());
  if (g2 > 0) s += bar(B2, CY0, CY0 - (CY0 - yv(970)) * g2, BW_, C.line, DIM());
  s += T(B1 + BW_ / 2, CY0 + 52, 'PRIMA', { f: 'mono', size: 28, a: 'middle', ls: 3, w: 600 }) + T(B2 + BW_ / 2, CY0 + 52, 'DOPO', { f: 'mono', size: 28, a: 'middle', ls: 3, w: 600 });
  if (o.v1) s += E(t, o.v1, T(B1 + BW_ / 2, yv(955) - 24, '955', { f: 'pop', size: 48, a: 'middle' }), { dy: 10 });
  if (o.v2) s += E(t, o.v2, T(B2 + BW_ / 2, yv(970) - 24, '970', { f: 'pop', size: 48, a: 'middle' }), { dy: 10 });
  return s;
}
scene('barre', { make: (W) => ({
  capAt: W('novecentocinquantacinque'), last: W('novecentosettanta'),
  render(t) {
    let s = words(t, W("l'asse") - 0.1, 96, 330, "L'asse", { f: 'pop', size: 96 });
    s += words(t, W('troncato') - 0.05, 96, 450, 'troncato', { f: 'pop', size: 96 });
    s += E(t, W("un'azienda") - 0.05, IT(100, 545, "i profitti di un'azienda", { size: 50 }));
    s += E(t, W("un'azienda") - 0.2, truncChart(t, 0, 1000, {
      g1: eo((t - W('novecentocinquantacinque') + 0.1) / 0.7), g2: eo((t - W('novecentosettanta') + 0.1) / 0.7),
      v1: W('novecentocinquantacinque') + 0.3, v2: W('novecentosettanta') + 0.3, ex: W('novecentocinquantacinque') - 0.1 }) +
      tick(CX0, CY0, '0', C.coral) + tick(CX0, CY0 - CH / 2, '500', C.line) + tick(CX0, CY0 - CH, '1.000', C.line), { dy: 0 });
    return s + caption(t, W('novecentocinquantacinque'), 'Da 955 a 970', '');
  } }) });

scene('tronca', { make: (W) => ({
  capAt: W('realtà'), last: W('più'),
  render(t) {
    const tb = W('novecentocinquanta'), p = eio((t - tb) / 1.3);
    const base = lerp(0, 950, p), top = lerp(1000, 975, p);
    let s = truncChart(t, base, top, { v1: -1, v2: -1, ex: -1 });
    // vecchie tacche che spariscono, nuova base 950 in corallo con segno di interruzione
    const old = 1 - clamp(p * 3);
    if (old > 0) s += `<g opacity="${old}">` + tick(CX0, CY0 - CH / 2, '500', C.line) + tick(CX0, CY0 - CH, '1.000', C.line) + tick(CX0, CY0, '0', C.line) + '</g>';
    const nw = clamp((p - 0.6) / 0.4);
    if (nw > 0) s += `<g opacity="${nw}">` + tick(CX0, CY0, '950', C.coral) + '</g>';
    s += E(t, W('quadruplicati') - 0.05, IT(100, 330, 'sembrano quadruplicati', { size: 58 }));
    // a sinistra: gli stessi dati con l'asse da zero
    const mx = 220, my = 810, mh = 200;
    s += E(t, W('realtà') - 0.1, T(100, 400, 'POCO PIÙ DI', { f: 'mono', size: 28, ls: 3, w: 700 }) + T(96, 500, '+1,5%', { f: 'pop', size: 110 }), { dy: 16 });
    s += E(t, W('realtà') + 0.1, axes(mx, my, 420, mh + 20, C.line, 3) + bar(mx + 70, my, my - mh * 0.955, 110, C.line, DIM()) + bar(mx + 240, my, my - mh * 0.97, 110, C.line, DIM()) +
      T(mx - 18, my + 10, '0', { f: 'mono', size: 30, a: 'end', w: 600 }) + T(96, 560, "STESSI DATI, ASSE DA ZERO", { f: 'mono', size: 26, ls: 3, w: 600 }), { dy: 0 });
    return s + caption(t, W('realtà'), "Poco più dell'1,5%", '');
  } }) });

// 4 — la regola pratica (registro chiaro)
scene('regola', { make: (W) => ({
  capAt: W('dove'), last: W('verticale'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(220, 160, 1480, 660), { dy: 0 });
    s += E(t, -0.2, pillTag(330, 300, 'REGOLA PRATICA', ink, C.ivory));
    s += words(t, W('guarda') - 0.05, 330, 450, 'Guarda sempre', { f: 'pop', size: 84, fill: ink });
    s += words(t, W('dove') - 0.05, 330, 560, 'dove inizia', { f: 'pop', size: 84, fill: ink });
    s += words(t, W("l'asse") - 0.05, 330, 670, "l'asse verticale", { f: 'pop', size: 84, fill: ink });
    const ax = 1280, ay = 700;
    s += E(t, -0.3, axes(ax, ay, 320, 440, ink) + [1, 2, 3].map(i => `<line x1="${ax - 14}" y1="${ay - i * 130}" x2="${ax}" y2="${ay - i * 130}" stroke="${ink}" stroke-width="4"/>`).join('') +
      T(ax, ay - 470, 'ASSE Y', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 3, w: 700 }), { dy: 0 });
    s += E(t, W('inizia') - 0.05, lens(ax, ay, 72, C.coral) + T(ax, ay + 14, '?', { f: 'pop', size: 56, fill: ink, a: 'middle' }), { dy: 0 });
    return s + caption(t, W('dove'), "Dove inizia l'asse?", '', true);
  } }) });

// 5 — scala logaritmica: ogni intervallo è un moltiplicatore
const LY = [780, 620, 460, 300];
scene('log', { make: (W) => ({
  capAt: W('moltiplicatore'), last: W('mille'),
  render(t) {
    let s = words(t, W('scala') - 0.05, 96, 330, 'Scala', { f: 'pop', size: 96 });
    s += words(t, W('logaritmica') - 0.05, 96, 450, 'logaritmica', { f: 'pop', size: 96, key: 'logaritmica' });
    s += E(t, W('dichiarata') - 0.05, IT(100, 545, 'non dichiarata', { size: 58 }));
    s += E(t, W('moltiplicatore') - 0.05, IT(100, 660, 'ogni intervallo è', { size: 50 }) + IT(100, 720, 'un moltiplicatore', { size: 50 }));
    const ax = 1300;
    s += E(t, W('qui') - 0.1, `<line x1="${ax}" y1="840" x2="${ax}" y2="240" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>`, { dy: 0 });
    ['uno', 'dieci', 'cento', 'mille'].forEach((w, i) => {
      s += E(t, W(w) - 0.05, tick(ax, LY[i], ['1', '10', '100', '1.000'][i], C.line, 44), { dy: 10 });
      if (i > 0) s += E(t, W(w) + 0.1, `<path d="M${ax + 30},${LY[i - 1] - 8} C${ax + 110},${LY[i - 1] - 40} ${ax + 110},${LY[i] + 40} ${ax + 30},${LY[i] + 8}" fill="none" stroke="${C.line}" stroke-width="4"/>` +
        `<path d="M${ax + 30},${LY[i] + 8} l20,-2 l-10,18 z" fill="${C.line}"/>` + T(ax + 120, (LY[i - 1] + LY[i]) / 2 + 13, '×10', { f: 'mono', size: 38, w: 700 }), { dy: 0 });
    });
    return s + caption(t, W('moltiplicatore'), 'Ogni intervallo moltiplica', '');
  } }) });

// 6 — utile per ordini di grandezza diversi (epidemia, fase esponenziale)
const GX0 = 860, GY0 = 780, GH = 480;
const EXP = Array.from({ length: 10 }, (_, i) => [GX0 + 60 + i * 92, GY0 - Math.log10(Math.pow(2, i)) / 3 * GH]);
scene('utile', { make: (W) => ({
  capAt: W('ordini'), last: W("un'epidemia"),
  render(t) {
    let s = words(t, W('ordini') - 0.05, 96, 330, 'Ordini di', { f: 'pop', size: 84 });
    s += words(t, W('grandezza') - 0.05, 96, 440, 'grandezza', { f: 'pop', size: 84 });
    s += words(t, W('diversi') - 0.05, 96, 550, 'diversi', { f: 'pop', size: 84 });
    s += E(t, -0.3, axes(GX0, GY0, 900, GH + 40, C.line) + ['1', '10', '100', '1.000'].map((v, i) => tick(GX0, GY0 - i * GH / 3, v, C.line, 36)).join('') +
      T(GX0 + 900, GY0 + 52, 'TEMPO →', { f: 'mono', size: 28, a: 'end', ls: 3, w: 600 }), { dy: 0 });
    const p = clamp((t - W('cambiano')) / 2.2);
    s += poly(EXP, p, C.coral, 7);
    EXP.forEach((q, i) => { if (p * 9 >= i - 0.01) s += `<circle cx="${q[0]}" cy="${q[1]}" r="9" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>`; });
    s += E(t, W("un'epidemia") - 0.05, IT(96, 680, "un'epidemia nella", { size: 50 }) + IT(96, 740, 'fase esponenziale', { size: 50 }));
    s += E(t, W('cambiano') - 0.05, pillTag(GX0 + 60, 250, 'ESEMPIO', C.line, C.bg) + T(GX0 + 260, 248, 'SCALA LOGARITMICA', { f: 'mono', size: 26, ls: 3, w: 600 }), { dy: 0 });
    return s + caption(t, W('ordini'), 'Ordini di grandezza diversi', '');
  } }) });

// 7 — se la scala non è dichiarata (registro chiaro): stessa crescita, due letture
scene('nascosta', { make: (W) => ({
  capAt: W('lineare'), last: W('molto'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 790, 670), { dy: 0 }) + E(t, -0.3, card(1010, 150, 790, 670), { dy: 0 });
    // sinistra: scala log senza etichette → retta
    const ax = 250, ay = 700, w = 600, h = 400;
    s += E(t, -0.2, T(535, 240, 'SCALA NON DICHIARATA', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 3, w: 700 }) + axes(ax, ay, w, h, ink) +
      [0, 1, 2, 3].map(i => T(ax - 22, ay - 20 - i * 133 + 12, '?', { f: 'mono', size: 34, fill: ink, a: 'end', w: 700 })).join(''), { dy: 0 });
    const ptsL = Array.from({ length: 10 }, (_, i) => [ax + 40 + i * 60, ay - 20 - i * Math.log10(2) * 133]);
    s += E(t, W('curva') - 0.1, pillTag(ax + 40, 330, 'ESEMPIO', ink, C.ivory), { dy: 0 });
    s += poly(ptsL, clamp((t - W('curva') + 0.1) / 1.2), ink, 7);
    s += E(t, W('lineare') - 0.05, IT(535, 780, 'sembra lineare', { a: 'middle', size: 54, fill: ink }));
    // destra: stessi valori, scala normale → esponenziale
    const bx = 1120;
    s += E(t, W('sta') - 0.1, T(1405, 240, 'GLI STESSI VALORI', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 3, w: 700 }) + axes(bx, ay, w, h, ink), { dy: 0 });
    const ptsR = Array.from({ length: 10 }, (_, i) => [bx + 40 + i * 60, ay - 20 - (Math.pow(2, i) - 1) / 511 * (h - 40)]);
    s += poly(ptsR, clamp((t - W('crescendo') + 0.1) / 1.4), C.coral, 8);
    s += E(t, W('esponenziale') - 0.05, IT(1405, 780, 'è esponenziale', { a: 'middle', size: 54, fill: ink }));
    s += E(t, W('molto') - 0.05, T(bx + 40, 330, 'PIÙ ALLARMANTE', { f: 'mono', size: 28, fill: ink, ls: 3, w: 700 }), { dy: 0 });
    s += E(t, W('sta'), pillTag(bx + 40, 400, 'ESEMPIO', ink, C.ivory), { dy: 0 });
    return s + caption(t, W('lineare'), 'Sembra lineare: è esponenziale', '', true);
  } }) });

// 8 — correlazione che sembra causalità
const KX0 = 1040, KY0 = 780;
const serA = Array.from({ length: 11 }, (_, i) => [KX0 + 40 + i * 66, KY0 - 60 - i * 34 - 18 * Math.sin(i * 1.3)]);
const serB = Array.from({ length: 11 }, (_, i) => [KX0 + 40 + i * 66, KY0 - 20 - i * 30 - 16 * Math.sin(i * 1.3 + 0.4)]);
scene('corr', { make: (W) => ({
  capAt: W('causano'), last: W('necessariamente'),
  render(t) {
    let s = words(t, 0.05, 100, 230, 'Il tranello più pericoloso', { f: 'serif', it: true, size: 54 });
    s += words(t, W('correlazione') - 0.05, 96, 340, 'Correlazione', { f: 'pop', size: 92 });
    s += E(t, W('sembra') - 0.05, IT(100, 430, 'che sembra causalità', { size: 58 }));
    s += E(t, 0.1, axes(KX0, KY0, 760, 520, C.line), { dy: 0 });
    const p = clamp((t - W('crescono') + 0.1) / 1.4);
    s += poly(serA, p, C.line, 7) + poly(serB, p, C.line, 6, '4 14');
    s += E(t, W('variabili') - 0.05, `<line x1="100" y1="530" x2="170" y2="530" stroke="${C.line}" stroke-width="7" stroke-linecap="round"/>` + lbl(196, 540, 'VARIABILE A', { a: 'start' }) +
      `<line x1="100" y1="600" x2="170" y2="600" stroke="${C.line}" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>` + lbl(196, 610, 'VARIABILE B', { a: 'start' }));
    s += E(t, W('crescono'), pillTag(KX0 + 40, 250, 'ESEMPIO', C.line, C.bg), { dy: 0 });
    // A causa B? — freccia con punto di domanda
    s += E(t, W('causano') - 0.05, T(100, 760, 'A', { f: 'pop', size: 96 }) + arrow(190, 728, 380, 728, C.coral, 8) + T(410, 760, 'B ?', { f: 'pop', size: 96 }), { dy: 0 });
    if (t > W('necessariamente')) { const k = eo((t - W('necessariamente')) / 0.4); s += `<line x1="250" y1="${700}" x2="${250 + 80 * k}" y2="${700 + 56 * k}" stroke="${C.line}" stroke-width="8" stroke-linecap="round"/>`; }
    return s + caption(t, W('causano'), 'Non si causano necessariamente', '');
  } }) });

// 9 — ragioni statistiche casuali: correlazione spuria
function die(cx, cy, r, st) {
  const p = [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]];
  return `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" rx="${r * 0.28}" fill="none" stroke="${st}" stroke-width="7"/>` +
    p.map(([a, b]) => `<circle cx="${cx + a * r * 0.5}" cy="${cy + b * r * 0.5}" r="${r * 0.12}" fill="${st}"/>`).join('');
}
const rA = Array.from({ length: 13 }, (_, i) => [1050 + i * 58, 780 - 40 - i * 14 - 70 * hsh(i + 3)]);
const rB = rA.map(([x, y], i) => [x, y - 20 + 26 * (hsh(i + 40) - 0.5)]);
scene('caso', { make: (W) => ({
  capAt: W('correlazione'), last: W('spuria'),
  render(t) {
    let s = words(t, W('correlazione') - 0.05, 96, 330, 'Correlazione', { f: 'pop', size: 92 });
    s += words(t, W('spuria') - 0.05, 96, 450, 'spuria', { f: 'pop', size: 92 });
    s += E(t, W('spuria') + 0.2, IT(100, 545, 'spurious correlation', { size: 58 }) + lbl(100, 600, 'IN INGLESE', { a: 'start' }));
    s += E(t, 0.05, `<line x1="100" y1="700" x2="170" y2="700" stroke="${C.line}" stroke-width="7" stroke-linecap="round"/>` + lbl(196, 710, 'VARIABILE A', { a: 'start' }) +
      `<line x1="100" y1="770" x2="170" y2="770" stroke="${C.line}" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>` + lbl(196, 780, 'VARIABILE B', { a: 'start' }));
    s += E(t, W('ragioni') - 0.05, IT(1590, 268, 'per ragioni statistiche casuali', { size: 44, a: 'end' }));
    s += E(t, -0.3, axes(1040, 780, 780, 380, C.line), { dy: 0 });
    const p = clamp((t - 0.1) / 2.2);
    s += poly(rA, p, C.line, 7) + poly(rB, p, C.line, 6, '4 14');
    s += E(t, 0.2, pillTag(1060, 340, 'ESEMPIO', C.line, C.bg), { dy: 0 });
    // il dado: il caso
    const r = eo((t - W('casuali') + 0.1) / 0.6);
    if (r > 0) s += `<g opacity="${r}" transform="rotate(${(1 - r) * -40} 1680 250)">` + die(1680, 250, 70, C.coral) + '</g>';
    return s + caption(t, W('correlazione'), 'Correlazione spuria', '');
  } }) });

// 10 — l'IA che scambia una correlazione per causa (registro chiaro)
scene('notte', { make: (W) => ({
  capAt: W('causa'), last: W('comune'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(110, 140, 1050, 690), { dy: 0 });
    const x0 = 220, y0 = 700, w = 860, h = 400, xn = x0 + w * 0.62;
    // banda notte: diventa corallo su "notte"
    const nb = eo((t - W('comune') + 0.1) / 0.4);
    s += E(t, -0.2, `<rect x="${xn}" y="${y0 - h}" width="${x0 + w - xn}" height="${h}" fill="${mix(C.cream, C.ink, 0.08)}"/>` + T((xn + x0 + w) / 2, y0 + 52, 'NOTTE', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 3, w: 700 }) +
      T(x0 + 160, y0 + 52, 'GIORNO', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 3, w: 700 }), { dy: 0 });
    if (nb > 0) s += `<rect x="${xn}" y="${y0 - h}" width="${x0 + w - xn}" height="${h}" fill="none" stroke="${C.coral}" stroke-width="7" opacity="${nb}"/>`;
    s += E(t, -0.2, axes(x0, y0, w, h + 20, ink), { dy: 0 });
    const N = 20, luce = [], temp = [];
    for (let i = 0; i <= N; i++) { const x = x0 + 20 + i * (w - 40) / N, u = i / N; luce.push([x, y0 - 40 - 300 / (1 + Math.exp((u - 0.55) * 18))]); temp.push([x, y0 - 150 - 140 / (1 + Math.exp((u - 0.6) * 9))]); }
    s += poly(luce, clamp((t - W('luce') + 0.1) / 1.2), ink, 7) + poly(temp, clamp((t - W('temperatura') + 0.1) / 1.2), ink, 6, '4 14');
    s += E(t, W('temperatura') - 0.1, `<line x1="250" y1="200" x2="310" y2="200" stroke="${ink}" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>` + T(330, 210, 'TEMPERATURA IN CASA', { f: 'mono', size: 26, fill: ink, ls: 2, w: 700 }), { dy: 0 });
    s += E(t, W('luce') - 0.1, `<line x1="250" y1="250" x2="310" y2="250" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>` + T(330, 260, 'LUCE ESTERNA', { f: 'mono', size: 26, fill: ink, ls: 2, w: 700 }), { dy: 0 });
    s += E(t, W('temperatura'), pillTag(1050, 210, 'ESEMPIO', ink, C.ivory, 'middle'), { dy: 0 });
    // destra: la deduzione sbagliata dell'IA
    s += E(t, -0.1, card(1250, 140, 560, 690), { dy: 0 });
    s += E(t, 0.0, `<rect x="1460" y="190" width="140" height="140" rx="16" fill="${C.ivory}" stroke="${ink}" stroke-width="5"/>` +
      [0, 1, 2].map(i => `<line x1="${1490 + i * 40}" y1="176" x2="${1490 + i * 40}" y2="190" stroke="${ink}" stroke-width="5"/><line x1="${1490 + i * 40}" y1="330" x2="${1490 + i * 40}" y2="344" stroke="${ink}" stroke-width="5"/>`).join('') +
      T(1530, 278, 'IA', { f: 'pop', size: 60, fill: ink, a: 'middle' }), { dy: 0 });
    // finestra con tenda che si abbassa
    const tw0 = W('oscurare'), dp = eo((t - tw0 + 0.05) / 0.8);
    if (t > tw0 - 0.2) {
      s += E(t, tw0 - 0.2, `<rect x="1330" y="420" width="200" height="220" fill="${C.ivory}" stroke="${ink}" stroke-width="5"/><line x1="1430" y1="420" x2="1430" y2="640" stroke="${ink}" stroke-width="3"/><line x1="1330" y1="530" x2="1530" y2="530" stroke="${ink}" stroke-width="3"/>` +
        `<rect x="1330" y="420" width="200" height="${220 * dp}" fill="${mix(C.cream, C.ink, 0.55)}" stroke="${ink}" stroke-width="5"/>` + T(1430, 720, 'OSCURARE', { f: 'mono', size: 26, fill: ink, a: 'middle', ls: 2, w: 700 }), { dy: 0 });
    }
    if (t < W('ma') - 0.05) s += E(t, W('raffredda') - 0.1, arrow(1550, 530, 1660, 530, ink, 6), { dy: 0 });
    s += E(t, W('raffredda') - 0.1, `<rect x="1680" y="420" width="40" height="180" rx="20" fill="${C.ivory}" stroke="${ink}" stroke-width="5"/><circle cx="1700" cy="625" r="34" fill="${C.ivory}" stroke="${ink}" stroke-width="5"/><rect x="1692" y="540" width="16" height="80" fill="${ink}"/>` +
      T(1700, 720, 'RAFFREDDA?', { f: 'mono', size: 26, fill: ink, a: 'middle', ls: 2, w: 700 }), { dy: 0 });
    s += E(t, W('ma') - 0.05, `<circle cx="1600" cy="530" r="44" fill="${C.cream}" stroke="${ink}" stroke-width="8"/><line x1="1569" y1="499" x2="1631" y2="561" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>`, { dy: 0 });
    s += E(t, W('comune') - 0.05, T((xn + x0 + w) / 2, y0 - h + 50, 'CAUSA COMUNE', { f: 'mono', size: 26, fill: ink, a: 'middle', ls: 2, w: 700 }), { dy: 0 });
    return s + caption(t, W('causa'), 'Causa comune: la notte', '', true);
  } }) });

// 11 — cartello finale
scene('finale', { L: 0.5, tail: 3.35, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 360, 'Grafici che ingannano', { f: 'pop', size: 116, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('guarda') - 0.1, 960, 490, "Guarda sempre dove inizia l'asse.", { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true });
    s += words(t, W('correlazione') - 0.1, 960, 580, 'Correlazione non è causalità.', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: 'causalità', keyFill: '#A84A2C' });
    s += E(t, W('causalità') + 0.3, `<line x1="760" y1="660" x2="1160" y2="660" stroke="${C.ink}" stroke-width="3"/>` + T(960, 720, 'PROFTECNOLOGIA · MC DIG-3-03', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
