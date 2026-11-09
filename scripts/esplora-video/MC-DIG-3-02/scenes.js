// IA generativa: come funziona un LLM — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.35);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.minD) D = Math.max(D, def.minD);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const cam = (t, D, inner, cx = 960, cy = 480) => `<g transform="translate(${cx},${cy}) scale(${1 + 0.02 * t / D}) translate(${-cx},${-cy})">${inner}</g>`;

// ---- mondo: token come tessere, il modello come blocco in sezione, le probabilità come barre ----
const TP = 22; // padding orizzontale della tessera
const tileW = (s, size = 48) => s === '?' ? size * 2.6 : tw(s, 'mono', size) + 2 * TP;
// tessera: x sinistra, y centro
function tile(x, y, s, o = {}) {
  const size = o.size || 48, w = o.w ?? tileW(s, size), h = size * 1.55, ink = o.ink || C.line;
  let r = `<rect x="${x}" y="${y - h / 2}" width="${w}" height="${h}" rx="10" fill="${o.fill || C.fillD}" stroke="${o.stroke || ink}" stroke-width="${o.sw || 3.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.bop != null ? ` stroke-opacity="${o.bop}"` : ''}/>`;
  if (s !== '?' || o.q) r += T(x + w / 2, y + size * 0.36, s, { f: 'mono', size, fill: o.tc || ink, a: 'middle', w: 500 });
  return r;
}
// fila di tessere a partire da x; restituisce posizioni
function row(x, y, arr, size = 48, gap = 14) {
  const out = []; let cx = x;
  arr.forEach(s => { const w = tileW(s, size); out.push({ s, x: cx, w, cx: cx + w / 2, y }); cx += w + gap; });
  return out;
}
// il modello: blocco in sezione con tre strati di nodi collegati
function modelBox(cx, cy, w, h, o = {}) {
  const ink = o.ink || C.line, dim = o.dim || C.lineDim;
  let s = `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="18" fill="${o.fill || C.fillD}" stroke="${ink}" stroke-width="4"/>`;
  const cols = [4, 5, 4], xs = cols.map((_, i) => cx - w * 0.3 + i * w * 0.3);
  const pts = cols.map((n, i) => Array.from({ length: n }, (_, j) => [xs[i], cy - h * 0.34 + (j + 0.5) * (h * 0.68 / n)]));
  const p = o.p ?? 1;
  for (let i = 0; i < 2; i++) pts[i].forEach(a => pts[i + 1].forEach(b => s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${dim}" stroke-width="2" opacity="${clamp(p * 2 - i * 0.5)}"/>`));
  pts.flat().forEach(([x, y]) => s += `<circle cx="${x}" cy="${y}" r="${Math.min(14, h * 0.05)}" fill="${o.bg || C.bg}" stroke="${ink}" stroke-width="3"/>`);
  return s;
}
// pagine di testo impilate
function pages(x, y, o = {}) {
  const ink = o.ink || C.line, fill = o.fill || C.fillD; let s = '';
  for (let k = 2; k >= 0; k--) {
    const xx = x - 80 + k * 18, yy = y - 110 - k * 18;
    s += `<rect x="${xx}" y="${yy}" width="160" height="210" rx="8" fill="${fill}" stroke="${ink}" stroke-width="3.5"/>`;
    if (k === 0) for (let j = 0; j < 6; j++) s += `<line x1="${xx + 22}" y1="${yy + 36 + j * 28}" x2="${xx + 138 - (j % 3) * 22}" y2="${yy + 36 + j * 28}" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return s;
}
// candidati di esempio per "Il cielo è …"
const CAND = [['azzurro', 1], ['sereno', 0.6], ['nuvoloso', 0.42], ['grigio', 0.24]];
const BX = 930, BY = 440, BS = 74, BL = 1180, BMAX = 520;
function bars(t, t0, o = {}) {
  const ink = o.ink || C.line, cand = o.cand || CAND; let s = '';
  cand.forEach(([w, v], i) => {
    const y = BY + i * BS, p = o.full ? 1 : eio((t - t0 - i * 0.12) / 0.7), op = o.op ?? 1;
    if (o.labels !== false) s += `<g opacity="${op}">` + E(t, (o.lt ?? -0.4) + i * 0.06, T(BX, y + 14, w, { f: 'mono', size: 40, fill: ink, w: 500 }), { dy: 0 }) + '</g>';
    if (p > 0) s += `<rect x="${BL}" y="${y - 20}" width="${BMAX * v * p * (o.k ?? 1)}" height="40" rx="6" fill="${ink}"/>`;
  });
  if (o.more) s += E(t, o.more, T(BX, BY + 4 * BS + 12, '… e tutti gli altri', { f: 'serif', size: 40, fill: ink, it: true }) + [0, 1, 2].map(j => `<rect x="${BL + j * 26}" y="${BY + 4 * BS - 4}" width="14" height="14" rx="3" fill="${ink}"/>`).join(''), { dy: 0 });
  return s;
}
const SHARP = [1, 0.28, 0.13, 0.05], FLAT = [0.8, 0.66, 0.56, 0.46];
const CAND2 = [['e', 1], ['.', 0.72], ['oggi', 0.5], ['come', 0.3]];
// cursore della temperature
function slider(x, y, len, v, o = {}) {
  const ink = o.ink || C.line;
  let s = `<line x1="${x}" y1="${y}" x2="${x + len}" y2="${y}" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>`;
  s += `<line x1="${x + len + 20}" y1="${y}" x2="${x + len * 1.28}" y2="${y}" stroke="${ink}" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 16"/>` + T(x + len * 1.28 + 30, y + 14, '…', { f: 'pop', size: 44, fill: ink });
  [0, 1].forEach(k => s += `<line x1="${x + k * len}" y1="${y + 26}" x2="${x + k * len}" y2="${y + 44}" stroke="${ink}" stroke-width="4"/>` + T(x + k * len, y + 88, String(k), { f: 'mono', size: 40, fill: ink, a: 'middle', w: 700 }));
  s += `<circle cx="${x + len * v}" cy="${y}" r="26" fill="${o.knob || C.coral}" stroke="${o.kstroke || o.knob || C.coral}" stroke-width="4"/>`;
  return s;
}
function curveArrow(pts, c, sw = 4, h = 20) {
  const [a, b, d, e] = pts; let s = `<path d="M${a[0]},${a[1]} C${b[0]},${b[1]} ${d[0]},${d[1]} ${e[0]},${e[1]}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`;
  const ang = Math.atan2(e[1] - d[1], e[0] - d[0]);
  s += `<path d="M${e[0] + Math.cos(ang) * 8},${e[1] + Math.sin(ang) * 8} L${e[0] + Math.cos(ang) * 8 - h * Math.cos(ang - 0.45)},${e[1] + Math.sin(ang) * 8 - h * Math.sin(ang - 0.45)} L${e[0] + Math.cos(ang) * 8 - h * Math.cos(ang + 0.45)},${e[1] + Math.sin(ang) * 8 - h * Math.sin(ang + 0.45)} z" fill="${c}"/>`;
  return s;
}

// 1 — aggancio: la risposta compare un pezzo alla volta
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('come'),
  render(t) {
    const x = 400, y = 150, w = 1120, h = 660;
    let s = E(t, -0.4, `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${C.fillD}" stroke="${C.line}" stroke-width="4"/>` +
      `<line x1="${x}" y1="${y + 70}" x2="${x + w}" y2="${y + 70}" stroke="${C.line}" stroke-width="3"/>` + lbl(x + 40, y + 46, 'CHATBOT', { a: 'start', size: 26 }), { dy: 0 });
    // domanda dell'utente
    s += E(t, W('domanda') - 0.15, `<rect x="${x + w - 520}" y="${y + 110}" width="470" height="110" rx="22" fill="${C.fillD2}" stroke="${C.line}" stroke-width="3"/>` +
      `<line x1="${x + w - 485}" y1="${y + 150}" x2="${x + w - 90}" y2="${y + 150}" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/>` +
      `<line x1="${x + w - 485}" y1="${y + 185}" x2="${x + w - 240}" y2="${y + 185}" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/>` +
      T(x + w - 470, y + 92, 'TU', { f: 'mono', size: 24, ls: 3, w: 600 }));
    // risposta: pezzi che compaiono uno alla volta
    const t0 = W('risposta'), ax = x + 50, ay = y + 290, ws = [120, 90, 160, 70, 130, 100, 150, 80, 110, 170, 90, 120, 140, 100, 80, 130, 110];
    const n = Math.min(ws.length, Math.floor(Math.max(0, t - t0) / 0.26) + (t >= t0 ? 1 : 0));
    let cx = ax, cy = ay; const lines = [];
    for (let i = 0; i < n; i++) {
      if (cx + ws[i] > x + w - 60) { cx = ax; cy += 78; }
      lines.push([cx, cy, ws[i]]); cx += ws[i] + 14;
    }
    if (t >= t0 - 0.2) s += E(t, t0 - 0.2, T(ax, ay - 34, 'RISPOSTA', { f: 'mono', size: 24, ls: 3, w: 600 }), { dy: 0 });
    lines.forEach(([bx, by, bw], i) => {
      const last = i === lines.length - 1 && n < ws.length;
      s += `<rect x="${bx}" y="${by}" width="${bw}" height="50" rx="9" fill="${last ? 'none' : C.fillD2}" stroke="${last ? C.coral : C.line}" stroke-width="${last ? 4 : 3}"/>`;
    });
    s += E(t, W('pezzo') - 0.1, lbl(x + w / 2, y + h + 50, 'UN PEZZO ALLA VOLTA', { size: 28 }));
    return s + caption(t, W('come'), 'Come viene costruita?', '');
  } }) });

// 2 — un LLM: rete neurale addestrata sul testo per predire il token successivo
scene('llm', { make: (W) => ({
  capAt: W('predire'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(160, 140, 1600, 660, { rot: -0.6 }), { dy: 0 });
    g += E(t, W('llm') - 0.1, T(960, 285, 'LLM', { f: 'pop', size: 120, fill: C.ink, a: 'middle' }));
    g += E(t, W('llm') + 0.2, T(960, 345, 'LARGE LANGUAGE MODEL', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5, w: 700 }));
    const yy = 570;
    g += E(t, W('rete') - 0.1, modelBox(1010, yy, 380, 230, { ink: C.ink, dim: mix(C.cream, C.ink, 0.35), fill: C.ivory, bg: C.cream }) + lbl(1010, yy + 160, 'RETE NEURALE', { fill: C.ink }));
    g += E(t, W('enormi') - 0.6, pages(400, yy + 10, { ink: C.ink, fill: C.ivory }) + lbl(420, yy + 160, 'ENORMI QUANTITÀ DI TESTO', { fill: C.ink, size: 24 }) + arrow(610, yy, 800, yy, C.ink, 5, 22) +
      lbl(705, yy - 30, 'ADDESTRAMENTO', { fill: C.ink, size: 24 }));
    g += E(t, W('predire') - 0.1, arrow(1220, yy, 1330, yy, C.ink, 5, 22) + tile(1350, yy, '?', { size: 56, ink: C.ink, fill: C.ivory, stroke: C.coral, sw: 5, dash: '14 9' }) +
      T(1350 + 73, yy + 22, '?', { f: 'pop', size: 64, fill: C.ink, a: 'middle' }) + lbl(1423, yy + 160, 'TOKEN SUCCESSIVO', { fill: C.ink }));
    s += cam(t, D, g);
    return s + caption(t, W('predire'), 'Predire il token successivo', '', true);
  } }) });

// 3 — il testo scomposto in token
const SENT = [['Un', 1], ['pallone', 1], ['strat', 1], ['osf', 0], ['erico', 0], ['sale', 1]];
scene('token', { tail: 0.6, make: (W) => ({
  capAt: W('scomposto'),
  render(t) {
    const size = 60, sp = tw(' ', 'mono', size), p = eio((t - W('scomposto')) / 0.9), y = 470;
    const pad = 22 * p, gap = lerp(0, 16, p);
    const wsz = SENT.map(([w]) => tw(w, 'mono', size) + 2 * pad);
    const spaces = SENT.map(([, nw], i) => i === 0 ? 0 : (nw ? lerp(sp, gap, p) : gap));
    const total = wsz.reduce((a, b) => a + b, 0) + spaces.reduce((a, b) => a + b, 0);
    let x = 960 - total / 2; const pos = [];
    SENT.forEach(([w], i) => { x += spaces[i]; pos.push([x, wsz[i]]); x += wsz[i]; });
    let g = '';
    SENT.forEach(([w], i) => {
      const [xx, ww] = pos[i];
      if (p > 0) g += `<rect x="${xx}" y="${y - 46}" width="${ww}" height="92" rx="10" fill="${C.fillD}" stroke="${C.line}" stroke-width="3.5" opacity="${p}"/>`;
      g += T(xx + ww / 2, y + 21, w, { f: 'mono', size, a: 'middle', w: 500 });
    });
    let s = E(t, -0.4, lbl(960, 300, p < 0.5 ? 'TESTO' : 'TOKEN · SUDDIVISIONE DI ESEMPIO', { size: 28 }) + g, { dy: 0 });
    s += E(t, W('parola') - 0.1, T(960, 210, 'non parola per parola…', { f: 'serif', size: 60, a: 'middle', it: true }));
    // parentesi corallo sotto "divent" + "a": pezzi più piccoli di una parola
    const ua = W('unità') - 0.1;
    if (t > ua) {
      const x1 = pos[2][0], x2 = pos[4][0] + pos[4][1], q = eo((t - ua) / 0.5);
      s += `<path d="M${x1},${y + 70} L${x1},${y + 92} L${lerp(x1, x2, q)},${y + 92}${q >= 1 ? ` L${x2},${y + 70}` : ''}" fill="none" stroke="${C.coral}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += E(t, W('piccole') - 0.1, T((x1 + x2) / 2, y + 160, 'più piccoli di una parola', { f: 'serif', size: 54, a: 'middle', it: true }));
    }
    return s + caption(t, W('scomposto'), 'Scomposto in token', '');
  } }) });

// 4 — Tecnologia / Biotecnologia
scene('bio', { tail: 0.6, make: (W) => ({
  capAt: W('bio'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(160, 150, 1600, 640, { rot: 0.5 }), { dy: 0 });
    g += E(t, -0.3, lbl(960, 232, 'ESEMPIO', { fill: C.ink, size: 28 }), { dy: 0 });
    const size = 52, y1 = 390, y2 = 610, tx = 860, ti = { size, ink: C.ink, fill: C.ivory };
    g += E(t, -0.2, T(240, y1 + 20, 'Tecnologia', { f: 'pop', size: 64, fill: C.ink }));
    g += E(t, W('solo') - 0.15, arrow(700, y1, 820, y1, C.ink, 5, 22) + tile(tx, y1, 'Tecnologia', ti));
    g += E(t, W('token') - 0.1, T(1470, y1 + 18, '1 token', { f: 'pop', size: 54, fill: C.ink }) + T(1470, y1 + 76, 'potrebbe', { f: 'serif', size: 44, fill: C.ink, it: true }));
    g += E(t, W('biotecnologia') - 0.1, T(240, y2 + 20, 'Biotecnologia', { f: 'pop', size: 64, fill: C.ink }));
    const wb = tileW('Bio', size), sep = 24 * eio((t - W('bio') + 0.1) / 0.5);
    g += E(t, W('due') - 0.15, arrow(760, y2, 840, y2, C.ink, 5, 22) + tile(tx, y2, 'Bio', ti) + tile(tx + wb + sep, y2, 'tecnologia', ti));
    if (t > W('bio') - 0.1) g += `<line x1="${tx + wb + sep / 2}" y1="${y2 - 64}" x2="${tx + wb + sep / 2}" y2="${y2 + 64}" stroke="${C.coral}" stroke-width="5" stroke-dasharray="10 8" opacity="${eo((t - W('bio') + 0.1) / 0.4)}"/>`;
    g += E(t, W('due') - 0.1, T(1470, y2 + 18, '2 token', { f: 'pop', size: 54, fill: C.ink }) + T(1470, y2 + 76, 'potrebbe', { f: 'serif', size: 44, fill: C.ink, it: true }));
    s += cam(t, D, g);
    return s + caption(t, W('bio'), 'Bio + tecnologia', '', true);
  } }) });

// mondo comune delle scene 5–6: prompt, modello, barre
let _PR = null; const PRr = () => _PR || (_PR = row(140, 280, ['Il', 'cielo', 'è', '?']));
const MX = 470, MY = 570;
function stage(t, o) {
  let s = '';
  s += E(t, o.tp, lbl(140, 205, 'PROMPT', { a: 'start' }), { dy: 0 });
  PRr().slice(0, 3).forEach((r, i) => s += E(t, o.tp + i * 0.08, tile(r.x, r.y, r.s, { fill: C.line, tc: C.bg })));
  s += E(t, o.tm, arrow(MX, 340, MX, 418, C.line, 4, 18) + modelBox(MX, MY, 520, 270) + lbl(MX, MY + 180, 'MODELLO'), { dy: 0 });
  s += E(t, o.tb, arrow(740, MY, 890, MY - 20, C.line, 4, 18) + lbl(BX, 368, 'ALCUNI CANDIDATI · VALORI DI ESEMPIO', { a: 'start', size: 24 }), { dy: 0 });
  return s;
}
// 5 — calcola la probabilità di ogni token possibile
scene('prob', { tail: 0.5, make: (W) => ({
  capAt: W('probabilità'),
  render(t) {
    let s = stage(t, { tp: -0.4, tm: W('modello') - 0.15, tb: W('possibile') - 0.1 });
    const q = PRr()[3];
    s += E(t, W('prompt') + 0.3, tile(q.x, q.y, '?', { stroke: C.coral, sw: 5, dash: '14 9' }) + T(q.cx, q.y + 22, '?', { f: 'pop', size: 60, a: 'middle' }), { dy: 0 });
    s += bars(t, W('probabilità') - 0.1, { lt: W('possibile'), more: W('ogni') });
    s += E(t, W('probabilità') + 0.2, T(MX, MY + 238, 'probabilità apprese nell\'addestramento', { f: 'serif', size: 40, a: 'middle', it: true }));
    return s + caption(t, W('probabilità'), 'Calcola la probabilità', '');
  } }) });

// 6 — sceglie, aggiunge, ripete
scene('sceglie', { tail: 1.0, make: (W) => ({
  capAt: W('sceglie'),
  render(t) {
    let s = stage(t, { tp: -1, tm: -1, tb: -1 });
    const q = PRr()[3], ts = W('sceglie') - 0.1, ta = W('aggiunge') - 0.2, wA = tileW('azzurro'), tr = W('ripete') - 0.15;
    const out = 1 - eio((t - tr) / 0.35);
    if (out > 0) s += bars(t, 0, { full: true, lt: -1, k: out, op: out });
    else s += bars(t, tr + 0.35, { cand: CAND2, lt: tr + 0.3 });
    s += E(t, tr + 0.5, lbl(BX, BY + 4 * BS + 6, 'RICALCOLATE SUL TESTO NUOVO', { a: 'start', size: 24 }), { dy: 0 });
    s += E(t, ta + 0.6, lbl(q.x, 205, 'GENERATO', { a: 'start' }), { dy: 0 });
    // slot vuoto finché il token non arriva
    if (t < ta + 0.6) s += tile(q.x, q.y, '?', { dash: '14 9' }) + T(q.cx, q.y + 22, '?', { f: 'pop', size: 60, a: 'middle' });
    // tessera scelta (corallo): nasce sulla barra più alta, vola nel testo
    if (t > ts) {
      const m = eio((t - ta) / 0.6), x = lerp(BX - TP, q.x, m), y = lerp(BY, q.y, m);
      s += E(t, ts, tile(x, y, 'azzurro', { stroke: C.coral, sw: 5, tc: C.line, fill: C.bg }), { dy: 0 });
    }
    // ripete: nuovo slot e freccia che torna al modello
    const nx = q.x + wA + 14;
    s += E(t, tr, tile(nx, q.y, '?', { dash: '14 9' }) + T(nx + 62, q.y + 22, '?', { f: 'pop', size: 60, a: 'middle' }), { dy: 0 });
    s += E(t, tr + 0.2, curveArrow([[nx + 20, q.y + 60], [nx + 20, 400], [740, 330], [MX + 150, 418]], C.line, 4, 20) + lbl(nx + 170, 300, '… E RIPETE', { a: 'start', size: 26 }), { dy: 0 });
    return s + caption(t, W('sceglie'), 'Sceglie, aggiunge, ripete', '');
  } }) });

// 7 — un token alla volta, ognuno condizionato dai precedenti
const VT = ['Il', 'cielo', 'è', 'azzurro', 'e', 'senza', 'nuvole', '.'];
scene('volta', { tail: 0.6, make: (W) => ({
  capAt: W('token'),
  render(t) {
    const size = 56, gap = 18, ws = VT.map(s => tileW(s, size)), tot = ws.reduce((a, b) => a + b, 0) + gap * (VT.length - 1);
    let x = 960 - tot / 2; const P = ws.map(w => { const o = [x, w]; x += w + gap; return o; });
    const y = 560, t0 = W('nasce') - 0.1, step = 0.62;
    const app = VT.map((_, i) => i < 4 ? -1 : t0 + (i - 4) * step);
    const nVis = app.filter(a => t >= a).length, last = nVis - 1;
    let s = E(t, -0.4, lbl((P[0][0] + P[2][0] + P[2][1]) / 2, 668, 'PROMPT', { size: 26 }) + lbl((P[3][0] + P[7][0] + P[7][1]) / 2, 668, 'GENERATI · ESEMPIO', { size: 26 }), { dy: 0 });
    // archi dal nuovo token verso tutti i precedenti
    for (let j = 4; j < nVis; j++) {
      const fade = j === last ? 1 : clamp(1 - (t - app[j + 1]) / 0.3);
      if (fade <= 0) continue;
      const q = eo((t - app[j]) / 0.45);
      for (let i = 0; i < j; i++) {
        const xa = P[i][0] + P[i][1] / 2, xb = P[j][0] + P[j][1] / 2, hh = 40 + (xb - xa) * 0.28;
        const mx = lerp(xa, xb, 0.5);
        s += `<path d="M${xb},${y - 50} Q${mx},${y - 50 - hh * 2} ${lerp(xb, xa, q)},${y - 50 - (q < 1 ? hh * 1.0 * Math.sin(Math.PI * q) : 0)}" fill="none" stroke="${C.lineDim}" stroke-width="3" opacity="${fade}"/>`;
      }
    }
    VT.forEach((w, i) => {
      if (t < app[i]) return;
      const nw = i === last && i >= 4;
      const pr = i < 3;
      s += E(t, app[i], tile(P[i][0], y, w, { size, stroke: nw ? C.coral : C.line, sw: nw ? 5 : 3.5, fill: pr ? C.line : C.fillD, tc: pr ? C.bg : C.line }), { dy: 14, d: 0.35 });
    });
    s += E(t, W('condizionato') - 0.1, T(960, 770, 'ognuno condizionato da tutti i precedenti', { f: 'serif', size: 56, a: 'middle', it: true }));
    return s + caption(t, W('token'), 'Un token alla volta', '');
  } }) });

// 8 — temperature vicina a zero
scene('bassa', { tail: 0.7, make: (W) => ({
  capAt: W('vicina'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(160, 150, 1600, 640, { rot: -0.5 }), { dy: 0 });
    const sx = 280, sy = 400, sl = 480;
    g += E(t, W('temperature') - 0.15, T(sx, 280, 'TEMPERATURE', { f: 'mono', size: 40, fill: C.ink, ls: 5, w: 700 }));
    const v = lerp(0.5, 0, eio((t - W('zero') + 0.2) / 0.6));
    g += E(t, W('temperature') - 0.1, slider(sx, sy, sl, v, { ink: C.ink }), { dy: 0 });
    g += E(t, W('casuale') - 0.1, T(sx, 600, 'regola quanto è casuale', { f: 'serif', size: 50, fill: C.ink, it: true }) + T(sx, 660, 'la scelta', { f: 'serif', size: 50, fill: C.ink, it: true }));
    // barre (stessi candidati) a destra
    const bx0 = 980, bl0 = 1210, by0 = 300;
    g += E(t, -0.2, lbl(bx0, 236, 'PROBABILITÀ · ESEMPIO', { a: 'start', fill: C.ink, size: 24 }), { dy: 0 });
    const ps = eio((t - W('zero') + 0.2) / 0.7);
    CAND.forEach(([w, val], i) => g += E(t, -0.2 + i * 0.06, T(bx0, by0 + i * 76 + 14, w, { f: 'mono', size: 38, fill: C.ink, w: 500 }) + `<rect x="${bl0}" y="${by0 + i * 76 - 18}" width="${440 * lerp(val, SHARP[i], ps)}" height="36" rx="6" fill="${C.ink}"/>`, { dy: 0 }));
    g += E(t, W('zero') + 0.5, T(bx0, 600, 'più appuntita', { f: 'serif', size: 40, fill: C.ink, it: true }), { dy: 0 });
    g += E(t, W('quasi') - 0.1, curveArrow([[bl0 + 520, 640], [bl0 + 560, 520], [bl0 + 560, 360], [bl0 + 460, by0]], C.ink, 5, 22));
    g += E(t, W('quasi') - 0.05, T(bx0, 664, 'quasi sempre il più probabile', { f: 'serif', size: 46, fill: C.ink, it: true }));
    g += E(t, W('prevedibili') - 0.15, T(bx0, 728, '→ RISPOSTE PREVEDIBILI', { f: 'mono', size: 30, fill: C.ink, ls: 3, w: 700 }));
    s += cam(t, D, g);
    return s + caption(t, W('vicina'), 'Temperature vicina a zero', '', true);
  } }) });

// 9 — temperature vicina a uno
scene('alta', { tail: 0.7, make: (W) => ({
  capAt: W('risposte'),
  render(t) {
    const sx = 200, sy = 330, sl = 480;
    let s = E(t, -0.4, T(sx, 220, 'TEMPERATURE', { f: 'mono', size: 40, ls: 5, w: 700 }), { dy: 0 });
    const v = lerp(0, 1, eio((t - W('uno') + 0.2) / 0.6));
    s += E(t, -0.4, slider(sx, sy, sl, v), { dy: 0 });
    const bx0 = 1010, bl0 = 1240, by0 = 300;
    s += E(t, -0.3, lbl(bx0, 236, 'PROBABILITÀ · ESEMPIO', { a: 'start', size: 24 }), { dy: 0 });
    const pf = eio((t - W('uno') + 0.2) / 0.7), VAL = i => lerp(SHARP[i], FLAT[i], pf);
    CAND.forEach(([w, val], i) => s += E(t, -0.3 + i * 0.06, T(bx0, by0 + i * 90 + 14, w, { f: 'mono', size: 40, w: 500 }) + `<rect x="${bl0}" y="${by0 + i * 90 - 19}" width="${440 * VAL(i)}" height="38" rx="6" fill="${C.line}"/>`, { dy: 0 }));
    s += E(t, W('uno') + 0.6, T(bx0, by0 + 4 * 90 + 10, 'più piatta, stesso ordine', { f: 'serif', size: 40, it: true }), { dy: 0 });
    // scelte sparse: più casualità
    const ox = 820, oy = 470;
    s += E(t, W('casualità') - 0.2, `<circle cx="${ox}" cy="${oy}" r="12" fill="${C.line}"/>`, { dy: 0 });
    CAND.forEach((_, i) => { const q = (t - W('casualità') + 0.1 - i * 0.12) / 0.4; if (q > 0) s += drawLine(ox, oy, bx0 - 24, by0 + i * 90, q, C.line, 1.5 + 6 * VAL(i), { dash: '10 9' }); });
    s += E(t, W('casualità'), T(sx, 520, 'più casualità', { f: 'serif', size: 60, it: true }));
    s += E(t, W('creative') - 0.1, T(sx, 640, '+ CREATIVE', { f: 'mono', size: 34, ls: 4, w: 700 }));
    s += E(t, W('accurate') - 0.15, T(sx, 710, '− ACCURATE', { f: 'mono', size: 34, ls: 4, w: 700 }));
    return s + caption(t, W('risposte'), 'Più creative, meno accurate', '');
  } }) });

// 10 — il modello non capisce: correlazioni, nessun modello del mondo
const NET = [['Roma', 330, 380], ['Italia', 640, 330], ['capitale', 380, 560], ['città', 700, 520], ['storia', 520, 700]];
const LINKS = [[0, 1, 8], [0, 2, 6], [0, 3, 4], [1, 2, 4], [1, 3, 3], [2, 4, 3], [0, 4, 3], [3, 4, 2]];
scene('capisce', { tail: 1.25, make: (W) => ({
  capAt: W('correlazioni'),
  render(t) {
    let s = E(t, W('capisce') - 0.1, T(960, 190, 'il modello non capisce', { f: 'serif', size: 64, a: 'middle', it: true }));
    s += E(t, -0.4, `<rect x="180" y="250" width="740" height="560" rx="20" fill="${C.fillD}" stroke="${C.line}" stroke-width="4"/>` + lbl(550, 850, 'CORRELAZIONI STATISTICHE · ESEMPIO', { size: 24 }), { dy: 0 });
    const tc = W('correlazioni') - 0.2;
    LINKS.forEach(([a, b, wgt], i) => {
      const q = (t - tc - i * 0.07) / 0.5; if (q <= 0) return;
      const A = NET[a], B = NET[b];
      s += drawLine(A[1], A[2], B[1], B[2], q, C.lineDim, wgt);
    });
    NET.forEach(([w, x, y], i) => { const tw0 = tileW(w, 40); s += E(t, -0.3 + i * 0.06, tile(x - tw0 / 2, y, w, { size: 40, fill: C.bg }), { dy: 0 }); });
    // il mondo: un globo che il modello non ha
    const gx = 1420, gy = 520, R = 190, tg = W('interno') - 0.2;
    let globe = `<g fill="none" stroke="${C.coral}" stroke-dasharray="12 12"><circle cx="${gx}" cy="${gy}" r="${R}" stroke-width="5"/>`;
    [-0.5, 0, 0.5].forEach(k => globe += `<ellipse cx="${gx}" cy="${gy}" rx="${R * Math.abs(Math.cos(k * 1.4)) * 0.9 + 1}" ry="${R}" stroke-width="3"/>`);
    [-0.5, 0, 0.5].forEach(k => { const yy = gy + k * R * 1.2, hw = Math.sqrt(R * R - (k * R * 1.2) ** 2); globe += `<line x1="${gx - hw}" y1="${yy}" x2="${gx + hw}" y2="${yy}" stroke-width="3"/>`; });
    globe += '</g>';
    s += E(t, tg, globe);
    s += E(t, W('mondo') - 0.1, lbl(gx, gy + R + 60, 'NESSUN MODELLO INTERNO', { size: 26 }) + lbl(gx, gy + R + 96, 'DEL MONDO', { size: 26 }));
    return s + caption(t, W('correlazioni'), 'Correlazioni statistiche', '');
  } }) });

// 11 — Roma e Italia: compaiono insieme; per questo può inventare
scene('roma', { tail: 0.6, make: (W) => ({
  capAt: W('fatti'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(160, 150, 1600, 640, { rot: 0.5 }), { dy: 0 });
    g += `<line x1="960" y1="200" x2="960" y2="560" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="8 10" opacity="${eo((t + 0.3) / 0.5)}"/>`;
    g += E(t, W('sai') - 0.15, lbl(560, 250, 'TU', { fill: C.ink, size: 30 }));
    g += E(t, W('roma') - 0.15, T(560, 400, 'Roma è in Italia', { f: 'pop', size: 66, fill: C.ink, a: 'middle' }));
    g += E(t, W('sai') - 0.05, T(560, 480, 'lo sai: è un fatto', { f: 'serif', size: 46, fill: C.ink, a: 'middle', it: true }));
    g += E(t, W('sa', 1) - 0.15, lbl(1360, 250, 'IL MODELLO', { fill: C.ink, size: 30 }));
    const wr = tileW('Roma', 50), wi = tileW('Italia', 50), ti = { size: 50, ink: C.ink, fill: C.ivory };
    g += E(t, W('roma', 1) - 0.1, tile(1120, 380, 'Roma', ti));
    g += E(t, W('italia', 1) - 0.1, tile(1600 - wi, 380, 'Italia', ti));
    const tc = W('compaiono') - 0.15;
    for (let k = 0; k < 5; k++) { const q = (t - tc - k * 0.08) / 0.4; if (q > 0) g += drawLine(1120 + wr + 6, 352 + k * 14, 1600 - wi - 6, 352 + k * 14, q, C.ink, 3); }
    g += E(t, W('spesso') - 0.1, T(1360, 480, 'compaiono spesso insieme', { f: 'serif', size: 46, fill: C.ink, a: 'middle', it: true }) + lbl(1360, 530, 'NEI TESTI', { fill: C.ink, size: 26 }));
    const ti0 = W('inventare') - 0.1;
    g += E(t, W('per') - 0.1, T(960, 680, '→ può inventare fatti che suonano credibili', { f: 'serif', size: 58, fill: C.ink, a: 'middle', it: true }));
    const uw = tw('fatti che suonano credibili', 'serif', 58, true), ux1 = 960 + tw('→ può inventare fatti che suonano credibili', 'serif', 58, true) / 2 - uw;
    if (t > ti0) g += drawLine(ux1, 706, ux1 + uw, 706, eo((t - W('fatti')) / 0.6), C.coral, 7);
    s += cam(t, D, g);
    return s + caption(t, W('fatti'), 'Fatti che suonano credibili', '', true);
  } }) });

// 12 — chiusura
scene('finale', { L: 0.5, tail: 3.4, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 440, 'Come funziona un LLM', { f: 'pop', size: 112, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('non') - 0.1, 960, 570, 'non capisce: predice il token successivo', { f: 'serif', size: 72, fill: C.ink, a: 'middle', it: true, key: 'successivo', keyFill: C.coralDk });
    s += E(t, W('predice'), `<line x1="760" y1="650" x2="1160" y2="650" stroke="${C.ink}" stroke-width="3"/>` + T(960, 710, 'PROFTECNOLOGIA · MC DIG-3-02', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
