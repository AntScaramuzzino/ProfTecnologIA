// Trasporto pubblico: l'efficienza dimenticata — scene con render(t, D) puro.
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
const inkL = { ink: C.ink, bg: C.cream, fill: mix(C.cream, C.ink, 0.07) };
function cardScene(t, D, inner, rot = -0.6) {
  const k = 1 + 0.02 * t / D;
  return lightBg() + `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${E(t, -0.4, card(160, 150, 1600, 660, { rot }), { dy: 0 })}${inner}</g>`;
}

// 1 — aggancio: due fermate, due ritmi
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('da'),
  render(t) {
    const G = 720;
    let s = E(t, -0.4, `<line x1="140" y1="${G}" x2="1780" y2="${G}" stroke="${C.lineDim}" stroke-width="4"/>`, { dy: 0 });
    const tl = W('passa') - 0.2, tr = W('altre') - 0.2;
    s += E(t, tl, stop(520, G) + person(610, G, 1) + person(680, G, 1), { dy: 0 });
    s += E(t, tl + 0.15, clock(520, 250, 82, (t - tl) / 60));
    s += E(t, W("mezz'ora") - 0.05, lbl(520, 790, 'OGNI MEZZ\'ORA', { size: 28 }));
    s += E(t, W('ora') - 0.05, lbl(520, 836, 'O ANCHE OGNI ORA', { size: 28 }));
    s += E(t, tr, stop(1400, G) + person(1490, G, 1) + person(1560, G, 1) + person(1630, G, 1), { dy: 0 });
    s += E(t, tr + 0.15, clock(1400, 250, 82, (t - tr) / 3.5));
    s += E(t, W('pochi') - 0.05, lbl(1400, 790, 'OGNI POCHI MINUTI', { size: 28 }));
    return s + caption(t, W('da'), 'Da cosa dipende?', '');
  } }) });

// 2 — i mezzi del trasporto pubblico
scene('efficienza', { make: (W) => ({
  capAt: W('efficiente'),
  render(t) {
    const G = 620, k = 1.0;
    let s = E(t, W('bus') - 0.1, bus(290, G, k) + lbl(290, 700, 'BUS'));
    s += E(t, W('tram') - 0.1, tram(740, G, k) + lbl(740, 700, 'TRAM'));
    s += E(t, W('metropolitana') - 0.1, metro(1190, G, k) + lbl(1190, 700, 'METROPOLITANA'));
    s += E(t, W('treno') - 0.1, train(1640, G, k) + lbl(1640, 700, 'TRENO REGIONALE'));
    s += E(t, W('trasporto') - 0.05, T(960, 250, 'Trasporto pubblico', { f: 'pop', size: 76, a: 'middle' }));
    s += E(t, W('città') - 0.05, lbl(960, 800, 'PER SPOSTARE PERSONE IN CITTÀ E NEI DINTORNI', { size: 28 }));
    return s + caption(t, W('efficiente'), 'Il più efficiente', 'efficiente');
  } }) });

// 3 — massa critica (registro chiaro)
scene('massa', { make: (W) => ({
  capAt: W('serve'),
  render(t, D) {
    const gx = 1330, gy0 = 690, gy1 = 260, gw = 84, thr = 0.62;
    const f = t < W('utenti') - 0.6 ? 0.12 : lerp(0.12, thr, eio((t - W('utenti') + 0.6) / (W('critica') - W('utenti') + 0.6))) + (t > W('critica') ? (0.88 - thr) * eo((t - W('critica')) / 0.9) : 0);
    let g = E(t, -0.2, bus(700, 640, 1.4, inkL), { dy: 0 });
    // passeggeri ai finestrini, in proporzione al riempimento
    const x0 = 700 - 210 + 64 * 1.4, nP = Math.round(f * 8);
    for (let i = 0; i < nP; i++) { const w = Math.floor(i / 2), side = i % 2; g += `<circle cx="${x0 + w * 58 * 1.4 + 23 * 1.4 + (side ? 14 : -14)}" cy="${640 - 16 * 1.4 - 118 * 1.4 + 16 * 1.4 + 28}" r="11" fill="${C.ink}"/>`; }
    g += E(t, W('funzionare') - 0.05, T(700, 300, 'per funzionare bene…', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true }));
    // indicatore utenti
    let m = `<rect x="${gx - gw / 2}" y="${gy1}" width="${gw}" height="${gy0 - gy1}" rx="14" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>`;
    const fh = (gy0 - gy1 - 12) * f;
    m += `<rect x="${gx - gw / 2 + 6}" y="${gy0 - 6 - fh}" width="${gw - 12}" height="${fh}" rx="9" fill="${mix(C.cream, C.ink, 0.55)}"/>`;
    m += lbl(gx, gy0 + 50, 'UTENTI', { fill: C.ink, size: 28 });
    g += E(t, -0.2, m, { dy: 0 });
    const ty = gy0 - 6 - (gy0 - gy1 - 12) * thr;
    g += E(t, W('massa') - 0.1, `<line x1="${gx - gw / 2 - 26}" y1="${ty}" x2="${gx + gw / 2 + 26}" y2="${ty}" stroke="${C.coral}" stroke-width="6" stroke-linecap="round"/>` +
      T(gx + gw / 2 + 46, ty + 10, 'MASSA CRITICA', { f: 'mono', size: 30, fill: C.coral, ls: 3, w: 700 }), { dy: 0 });
    return cardScene(t, D, g) + caption(t, W('serve'), 'Serve una massa critica', '', true);
  } }) });

// ---- il circolo vizioso: 4 nodi ----
const VN = [
  [960, 205, false, ['MENO PASSEGGERI']],
  [1490, 490, false, ['MENO RISORSE']],
  [960, 765, false, ['CORSE MENO FREQUENTI', 'E MENO PUNTUALI']],
  [430, 490, true, ['PIÙ AUTO PRIVATE']],
].map(([x, y, up, l]) => ({ x, y, ...node(x, y, up, l) }));
const VA = (() => {
  const [a, b, c, d] = VN;
  return [
    [[a.x + a.w / 2 + 10, a.y], [b.x, a.y], [b.x, b.y - b.h / 2 - 12]],
    [[b.x, b.y + b.h / 2 + 10], [b.x, c.y], [c.x + c.w / 2 + 12, c.y]],
    [[c.x - c.w / 2 - 10, c.y], [d.x, c.y], [d.x, d.y + d.h / 2 + 12]],
    [[d.x, d.y - d.h / 2 - 10], [d.x, a.y], [a.x - a.w / 2 - 12, a.y]],
  ];
})();
function loopPt(arcs, u) { u = ((u % 1) + 1) % 1; const n = arcs.length, i = Math.floor(u * n); return qpt(...arcs[i], u * n - i); }

scene('vizioso1', { make: (W) => ({
  capAt: W('paradosso'),
  render(t) {
    let s = E(t, W('lasciano') - 0.1, VN[0].s);
    s += E(t, W('pubblico') - 0.2, bus(810, 540, 0.6), { dy: 0 });
    s += E(t, W("l'auto") - 0.1, car(1120, 540, 0.75), { dy: 0 });
    s += E(t, W("l'auto") + 0.1, arrow(925, 470, 1020, 470, C.line, 4, 18), { dy: 0 });
    // una persona passa dal bus all'auto
    const q = eio((t - W("l'auto") - 0.2) / 1.2);
    if (t > W('lasciano')) s += E(t, W('lasciano'), person(lerp(810, 1120, q), 430 - Math.sin(q * Math.PI) * 30, 0.8), { dy: 0 });
    s += curveArrow(...VA[0], (t - W('meno')) / 0.6, C.line);
    s += E(t, W('risorse') - 0.1, VN[1].s);
    return s + caption(t, W('paradosso'), 'Il paradosso', '');
  } }) });

scene('vizioso2', { make: (W) => ({
  capAt: W('un'),
  minD: W('vizioso') + 1.8,
  render(t) {
    let s = E(t, -0.4, VN[0].s + VN[1].s + curveArrow(...VA[0], 1, C.line), { dy: 0 });
    s += curveArrow(...VA[1], (t - W('così')) / 0.6, C.line);
    s += E(t, W('meno') - 0.1, VN[2].s);
    s += curveArrow(...VA[2], (t - W('altre')) / 0.6, C.line);
    s += E(t, W("l'auto") - 0.2, VN[3].s);
    s += curveArrow(...VA[3], (t - W('circolo')) / 0.5, C.line);
    const t0 = W('circolo') + 0.5;
    if (t > t0) { const [x, y] = loopPt(VA, (t - t0) / 5); s += `<circle cx="${x}" cy="${y}" r="15" fill="${C.line}"/>`; }
    s += E(t, W('vizioso') - 0.1, T(960, 480, 'circolo', { f: 'serif', size: 86, fill: C.coral, a: 'middle', it: true }) + T(960, 560, 'vizioso', { f: 'serif', size: 86, fill: C.coral, a: 'middle', it: true }));
    return s + caption(t, W('un'), 'Un circolo vizioso', '');
  } }) });

// 6 — il circolo virtuoso: 3 nodi
const UN = [[960, 215, ['INVESTIMENTI']], [1400, 690, ['UTENTI']], [520, 690, ['ENTRATE']]].map(([x, y, l]) => ({ x, y, ...node(x, y, true, ['PIÙ ' + l[0]]) }));
const UA = (() => {
  const [a, b, c] = UN;
  return [
    [[a.x + a.w / 2 + 10, a.y], [b.x, a.y], [b.x, b.y - b.h / 2 - 12]],
    [[b.x - b.w / 2 - 10, b.y], [960, b.y + 60], [c.x + c.w / 2 + 12, c.y]],
    [[c.x, c.y - c.h / 2 - 10], [c.x, a.y], [a.x - a.w / 2 - 12, a.y]],
  ];
})();
scene('virtuoso', { make: (W) => ({
  capAt: W('contrario'),
  render(t) {
    let s = E(t, W('investire') - 0.1, UN[0].s);
    s += curveArrow(...UA[0], (t - W('aumenta')) / 0.6, C.line);
    s += E(t, W("l'uso") - 0.1, UN[1].s);
    s += curveArrow(...UA[1], (t - W('portano')) / 0.6, C.line);
    s += E(t, W('entrate') - 0.1, UN[2].s);
    s += curveArrow(...UA[2], (t - W('permettono')) / 0.6, C.line);
    const t0 = W('permettono') + 0.6;
    if (t > t0) { const [x, y] = loopPt(UA, (t - t0) / 4); s += `<circle cx="${x}" cy="${y}" r="16" fill="${C.coral}"/>`; }
    s += E(t, W('investire'), T(960, 500, 'investire nel', { f: 'serif', size: 52, a: 'middle', it: true }) + T(960, 560, 'trasporto pubblico', { f: 'serif', size: 52, a: 'middle', it: true }));
    return s + caption(t, W('contrario'), 'Il circolo virtuoso', '');
  } }) });

// 7 — Italia, Mezzogiorno (registro chiaro)
scene('italia', { make: (W) => ({
  capAt: W('trenta'),
  render(t, D) {
    let g = E(t, W('italia') - 0.1, T(250, 250, 'ITALIA · TRASPORTO PUBBLICO LOCALE', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 }));
    g += E(t, W('pochi') - 0.1, T(250, 335, 'pochi investimenti, da tempo', { f: 'serif', size: 60, fill: C.ink, it: true }));
    g += E(t, W('mezzogiorno') - 0.1, T(250, 455, 'MOLTE CITTÀ DEL MEZZOGIORNO', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 }));
    g += E(t, W('frequenze') - 0.1, T(250, 515, 'frequenze dei bus', { f: 'popm', size: 40, fill: C.ink }));
    g += E(t, W('trenta') - 0.1, T(250, 650, '30–60 min', { f: 'pop', size: 128, fill: C.ink }));
    // percorso poco diretto
    const A = [1130, 660], B = [1620, 300];
    const route = [A, [1130, 520], [1300, 520], [1300, 640], [1460, 640], [1460, 440], [1340, 440], [1340, 300], B];
    g += E(t, W('mezzogiorno'), `<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="4 12" stroke-linecap="round"/>` +
      `<circle cx="${A[0]}" cy="${A[1]}" r="16" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/><circle cx="${B[0]}" cy="${B[1]}" r="16" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>` +
      T(A[0] - 30, A[1] + 56, 'A', { f: 'mono', size: 30, fill: C.ink, w: 700 }) + T(B[0] + 30, B[1] + 10, 'B', { f: 'mono', size: 30, fill: C.ink, w: 700 }), { dy: 0 });
    const p = (t - W('percorsi') + 0.1) / 0.9;
    if (p > 0) {
      let L = 0, seg = []; for (let i = 1; i < route.length; i++) { const l = Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1]); seg.push(l); L += l; }
      const pts = [route[0]]; let d = clamp(p) * L;
      for (let i = 1; i < route.length && d > 0; i++) { const q = Math.min(1, d / seg[i - 1]); pts.push([lerp(route[i - 1][0], route[i][0], q), lerp(route[i - 1][1], route[i][1], q)]); d -= seg[i - 1]; }
      g += poly(pts, C.coral, 7);
      g += E(t, W('poco') - 0.1, T(1380, 750, 'percorsi poco diretti', { f: 'serif', size: 50, fill: C.ink, it: true, a: 'middle' }));
    }
    return cardScene(t, D, g) + caption(t, W('trenta'), 'Bus ogni 30–60 minuti', '', true);
  } }) });

// 8 — Nord Europa (registro chiaro)
function ticket(x, y, ink, bgc) {
  return `<path d="M${x},${y} L${x + 520},${y} L${x + 520},${y + 50} A22,22 0 0 0 ${x + 520},${y + 94} L${x + 520},${y + 144} L${x},${y + 144} L${x},${y + 94} A22,22 0 0 0 ${x},${y + 50} z" fill="${bgc}" stroke="${ink}" stroke-width="4"/>` +
    `<line x1="${x + 420}" y1="${y + 14}" x2="${x + 420}" y2="${y + 130}" stroke="${ink}" stroke-width="3" stroke-dasharray="6 8"/>`;
}
scene('nord', { make: (W) => ({
  capAt: W('cinque'),
  minD: W("l'ottanta") + 1.7,
  render(t, D) {
    let g = E(t, W('vienna') - 0.1, T(250, 250, 'VIENNA', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 }));
    g += E(t, W('amsterdam') - 0.1, T(250 + tw('VIENNA', 'mono', 28) + 18 + 30, 250, '· AMSTERDAM', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 }));
    g += E(t, W('zurigo') - 0.1, T(250 + tw('VIENNA · AMSTERDAM', 'mono', 28) + 54 + 30, 250, '· ZURIGO', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 }));
    g += E(t, W('frequenze') - 0.1, T(250, 335, 'frequenze', { f: 'popm', size: 40, fill: C.ink }));
    g += E(t, W('cinque') - 0.1, T(250, 480, '5–10 min', { f: 'pop', size: 128, fill: C.ink }));
    g += E(t, W('tutta') - 0.1, T(250, 570, 'su tutta la rete', { f: 'serif', size: 60, fill: C.ink, it: true }));
    // tariffa integrata
    const ink = C.ink, bgc = C.cream;
    g += E(t, W('tariffe') - 0.1, ticket(1130, 230, ink, bgc) + bus(1220, 340, 0.4, inkL) + tram(1365, 340, 0.36, inkL) +
      T(1130, 430, 'TARIFFE INTEGRATE', { f: 'mono', size: 28, fill: ink, ls: 3, w: 700 }) + T(1130, 470, 'PER TUTTI I MEZZI', { f: 'mono', size: 28, fill: ink, ls: 3, w: 700 }));
    // puntualità
    const bx = 1130, by = 590, bw = 500, p = eo((t - W('oltre')) / 0.8);
    g += E(t, W('puntualità') - 0.1, T(bx, by - 26, 'PUNTUALITÀ', { f: 'mono', size: 28, fill: ink, ls: 3, w: 700 }) +
      `<rect x="${bx}" y="${by}" width="${bw}" height="56" rx="12" fill="${bgc}" stroke="${ink}" stroke-width="4"/>` +
      T(bx, by + 100, '0%', { f: 'mono', size: 26, fill: ink, w: 600 }) + T(bx + bw, by + 100, '100%', { f: 'mono', size: 26, fill: ink, w: 600, a: 'end' }));
    if (p > 0) g += `<rect x="${bx + 7}" y="${by + 7}" width="${(bw - 14) * 0.8 * p}" height="42" rx="7" fill="${C.coral}"/>`;
    g += E(t, W("l'ottanta") - 0.1, T(bx + bw, by - 22, 'oltre 80%', { f: 'pop', size: 40, fill: ink, a: 'end' }));
    return cardScene(t, D, g, 0.6) + caption(t, W('cinque'), 'Ogni 5–10 minuti', '', true);
  } }) });

// 9 — stessa ora, quante corse
scene('ora', { make: (W) => ({
  capAt: W('secondo'),
  render(t) {
    let s = E(t, W("un'ora") - 0.1, lbl(960, 190, 'IN UN\'ORA, ALLA STESSA FERMATA', { size: 30 }));
    const rows = [[400, 'OGNI 30–60 MIN', '1–2 bus', '60 ÷ 30–60 = 1–2', C.line, W('uno'), W('due'), 1, 1],
                  [680, 'OGNI 5–10 MIN', '6–12 bus', '60 ÷ 10–5 = 6–12', C.coral, W('sei'), W('dodici'), 6, 6]];
    rows.forEach(([y, a, b, c, col, t1, t2, n1, n2], r) => {
      s += E(t, r ? W('primo') + 0.6 : W('fermata'), lbl(96, y - 80, a, { a: 'start', size: 28 }) + `<line x1="470" y1="${y}" x2="1830" y2="${y}" stroke="${C.lineDim}" stroke-width="4"/>`, { dy: 0 });
      s += E(t, t1 - 0.1, T(96, y + 2, b, { f: 'pop', size: 64, fill: col }) + T(96, y + 52, c, { f: 'mono', size: 24, w: 600 }));
      for (let i = 0; i < n1 + n2; i++) s += E(t, (i < n1 ? t1 : t2) - 0.05 + (i % n1) * 0.07, bus(530 + i * 112, y, 0.34, i < n1 ? {} : { dash: '8 7', empty: true }), { dy: 0, blur: 6 });
    });
    s += E(t, W('dodici') + 0.3, bus(560, 830, 0.3, { dash: '8 7', empty: true }) + T(640, 822, '= CORSE IN PIÙ CON LA FREQUENZA MASSIMA', { f: 'mono', size: 26, w: 600, ls: 2 }));
    return s + caption(t, W('secondo'), 'Stessa ora, più corse', '');
  } }) });

// 10 — investimento e pianificazione
function coins(x, y, ink) { let s = ''; for (let i = 0; i < 4; i++) s += `<ellipse cx="${x}" cy="${y - i * 22}" rx="58" ry="18" fill="${C.bg}" stroke="${ink}" stroke-width="4"/><path d="M${x - 58},${y - i * 22} L${x - 58},${y - i * 22 + 10} A58,18 0 0 0 ${x + 58},${y - i * 22 + 10} L${x + 58},${y - i * 22}" fill="none" stroke="${ink}" stroke-width="4"/>`; return s; }
function plan(x, y, ink) {
  let s = `<rect x="${x - 80}" y="${y - 70}" width="160" height="120" rx="8" fill="${C.fillD}" stroke="${ink}" stroke-width="4"/>`;
  for (let i = 1; i < 4; i++) s += `<line x1="${x - 80 + i * 40}" y1="${y - 70}" x2="${x - 80 + i * 40}" y2="${y + 50}" stroke="${ink}" stroke-width="1.5" opacity="0.6"/>`;
  for (let i = 1; i < 3; i++) s += `<line x1="${x - 80}" y1="${y - 70 + i * 40}" x2="${x + 80}" y2="${y - 70 + i * 40}" stroke="${ink}" stroke-width="1.5" opacity="0.6"/>`;
  s += poly([[x - 60, y + 30], [x - 20, y - 10], [x + 20, y - 10], [x + 60, y - 50]], ink, 5);
  [[x - 60, y + 30], [x - 20, y - 10], [x + 20, y - 10], [x + 60, y - 50]].forEach(([a, b]) => s += `<circle cx="${a}" cy="${b}" r="9" fill="${C.bg}" stroke="${ink}" stroke-width="4"/>`);
  return s;
}
scene('chiave', { make: (W) => ({
  capAt: W('investimento'),
  minD: W('pianificazione') + 1.7,
  render(t) {
    let s = E(t, W('differenza') - 0.1, lbl(960, 220, 'LA DIFFERENZA', { size: 30 }));
    s += E(t, W('non') - 0.1, T(960, 330, 'non è culturale', { f: 'serif', size: 84, a: 'middle', it: true }));
    const box = (x, y, lab, icon) => `<rect x="${x - 270}" y="${y - 150}" width="540" height="300" rx="20" fill="${C.fillD}" stroke="${C.line}" stroke-width="4"/>` + icon + T(x, y + 110, lab, { f: 'pop', size: 44, a: 'middle' });
    s += E(t, W('investimento') - 0.1, box(640, 600, 'investimento', coins(640, 590, C.line)));
    s += E(t, W('pianificazione') - 0.1, box(1280, 600, 'pianificazione', plan(1280, 570, C.line)));
    return s + caption(t, W('investimento'), 'Investimento e pianificazione', '');
  } }) });

// 11 — chiusura
scene('finale', { L: 0.5, tail: 3.4, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 450, 'Trasporto pubblico', { f: 'pop', size: 140, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W("l'efficienza") - 0.1, 960, 580, "l'efficienza dimenticata", { f: 'serif', size: 76, fill: C.ink, a: 'middle', it: true, key: 'dimenticata' });
    s += E(t, W('dimenticata') + 0.5, `<line x1="760" y1="660" x2="1160" y2="660" stroke="${C.ink}" stroke-width="3"/>` + T(960, 720, 'PROFTECNOLOGIA · MC COM-3-03', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
