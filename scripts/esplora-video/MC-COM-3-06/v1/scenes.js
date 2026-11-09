// Pubblicità programmatica: l'asta in 200 millisecondi — scene con render(t, D) puro.
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

// ---- mondo: il browser, l'ad server, gli inserzionisti (line-art in sezione) ----
// geometria dello slot pubblicitario dentro una finestra del browser
function slotOf(x, y, w, h) { return { x: x + w * 0.66, y: y + 92, w: w * 0.29, h: h * 0.56 }; }
// finestra del browser: barra in alto, barra di caricamento, colonna di contenuti, slot a destra
function browser(x, y, w, h, o = {}) {
  const ink = o.ink || C.line, fill = o.fill || C.fillD, sw = o.sw || 4;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="${ink}" stroke-width="${sw}"/>`;
  s += `<line x1="${x}" y1="${y + 56}" x2="${x + w}" y2="${y + 56}" stroke="${ink}" stroke-width="3"/>`;
  [0, 1, 2].forEach(i => s += `<circle cx="${x + 30 + i * 26}" cy="${y + 28}" r="8" fill="none" stroke="${ink}" stroke-width="2.5"/>`);
  s += `<rect x="${x + 120}" y="${y + 13}" width="${w - 150}" height="30" rx="15" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
  if (o.load != null) {
    const p = clamp(o.load);
    s += `<line x1="${x + 2}" y1="${y + 62}" x2="${x + 2 + (w - 4) * p}" y2="${y + 62}" stroke="${ink}" stroke-width="6"/>`;
  }
  // contenuti (si rivelano con o.lines 0..1)
  const lp = o.lines ?? 1, cx = x + 40, cw = w * 0.66 - 70;
  const rows = [];
  rows.push(`<rect x="${cx}" y="${y + 96}" width="${cw * 0.75}" height="${h * 0.07}" rx="6" fill="${ink}" opacity="0.85"/>`);
  rows.push(`<rect x="${cx}" y="${y + 96 + h * 0.12}" width="${cw}" height="${h * 0.26}" rx="8" fill="none" stroke="${ink}" stroke-width="3"/>` +
    `<path d="M${cx + 20},${y + 96 + h * 0.36} L${cx + cw * 0.3},${y + 96 + h * 0.19} L${cx + cw * 0.5},${y + 96 + h * 0.3} L${cx + cw * 0.65},${y + 96 + h * 0.23} L${cx + cw - 20},${y + 96 + h * 0.36}" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`);
  for (let j = 0; j < 4; j++) rows.push(`<line x1="${cx}" y1="${y + 96 + h * (0.45 + j * 0.075)}" x2="${cx + cw - (j === 3 ? cw * 0.35 : 0)}" y2="${y + 96 + h * (0.45 + j * 0.075)}" stroke="${ink}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`);
  rows.forEach((r, i) => { const q = clamp(lp * rows.length - i); if (q > 0) s += `<g opacity="${q.toFixed(3)}">${r}</g>`; });
  // slot
  const S = slotOf(x, y, w, h), st = o.slot || 'none';
  if (st !== 'none') {
    const sc = o.slotInk || ink;
    if (st === 'ad') s += adCard(S.x, S.y, S.w, S.h, { ink });
    else s += `<rect x="${S.x}" y="${S.y}" width="${S.w}" height="${S.h}" rx="10" fill="none" stroke="${sc}" stroke-width="${o.slotSw || 4}" stroke-dasharray="14 10"/>`;
    if (o.slotLabel) s += lbl(S.x + S.w / 2, S.y + S.h / 2 + 10, o.slotLabel, { size: o.slotSize || 24, fill: sc });
  }
  return s;
}
// annuncio generico (nessun marchio): forme semplici + scritta ANNUNCIO
function adCard(x, y, w, h, o = {}) {
  const ink = o.ink || C.line;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${o.fill || C.fillD2}" stroke="${ink}" stroke-width="4"/>`;
  const cx = x + w / 2, cy = y + h * (w >= 200 ? 0.4 : 0.5), r = Math.min(w, h) * 0.18;
  s += `<circle cx="${cx - r * 0.6}" cy="${cy}" r="${r}" fill="none" stroke="${ink}" stroke-width="4"/><path d="M${cx},${cy + r} L${cx + r * 1.4},${cy - r} L${cx + r * 2},${cy + r} z" fill="none" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  if (w >= 200) s += T(cx, y + h * 0.82, 'ANNUNCIO', { f: 'mono', size: Math.max(24, Math.round(w * 0.1)), fill: ink, a: 'middle', ls: 2, w: 700 });
  return s;
}
// ad server: armadio rack in sezione
function server(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, w = 150 * k, h = 230 * k;
  let s = `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="${10 * k}" fill="${o.fill || C.fillD}" stroke="${ink}" stroke-width="4"/>`;
  for (let i = 0; i < 4; i++) {
    const yy = y - h + 20 * k + i * 52 * k;
    s += `<rect x="${x - w / 2 + 16 * k}" y="${yy}" width="${w - 32 * k}" height="${38 * k}" rx="${5 * k}" fill="none" stroke="${ink}" stroke-width="3"/>`;
    s += `<circle cx="${x - w / 2 + 34 * k}" cy="${yy + 19 * k}" r="${5 * k}" fill="${ink}"/><line x1="${x - w / 2 + 54 * k}" y1="${yy + 19 * k}" x2="${x + w / 2 - 30 * k}" y2="${yy + 19 * k}" stroke="${ink}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`;
  }
  return s;
}
// inserzionista: piccolo terminale con la sua DSP
function bidder(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, w = 54 * k, h = 38 * k;
  return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${6 * k}" fill="${o.fill || C.fillD}" stroke="${ink}" stroke-width="${o.sw || 3}"/>` +
    `<line x1="${x - w / 2 + 10 * k}" y1="${y}" x2="${x + w / 2 - 10 * k}" y2="${y}" stroke="${ink}" stroke-width="${2.5}" opacity="0.7"/>` +
    `<line x1="${x}" y1="${y + h / 2}" x2="${x}" y2="${y + h / 2 + 8 * k}" stroke="${ink}" stroke-width="3"/><line x1="${x - 14 * k}" y1="${y + h / 2 + 8 * k}" x2="${x + 14 * k}" y2="${y + h / 2 + 8 * k}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
}
// scheda della richiesta (piccola)
function miniCard(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, w = 40 * k, h = 30 * k;
  let s = `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${4 * k}" fill="${o.fill || C.bg}" stroke="${ink}" stroke-width="2.5"/>`;
  for (let j = 0; j < 3; j++) s += `<line x1="${x - w / 2 + 7 * k}" y1="${y - h / 2 + 8 * k + j * 7 * k}" x2="${x + w / 2 - 7 * k - (j === 2 ? 10 * k : 0)}" y2="${y - h / 2 + 8 * k + j * 7 * k}" stroke="${ink}" stroke-width="2"/>`;
  return s;
}
const cam = (t, D, inner, cx = 960, cy = 480) => `<g transform="translate(${cx},${cy}) scale(${1 + 0.02 * t / D}) translate(${-cx},${-cy})">${inner}</g>`;

// 1 — aggancio: uno spazio pubblicitario vuoto
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('chi'),
  render(t) {
    const bx = 420, by = 170, bw = 1080, bh = 620;
    let s = E(t, -0.4, browser(bx, by, bw, bh, { load: eio((t + 0.4) / 2.4), lines: eo((t + 0.2) / 1.6) }), { dy: 0 });
    const S = slotOf(bx, by, bw, bh);
    s += E(t, W('spazio') - 0.05, `<rect x="${S.x}" y="${S.y}" width="${S.w}" height="${S.h}" rx="10" fill="none" stroke="${C.coral}" stroke-width="5" stroke-dasharray="14 10"/>`, { dy: 0 });
    s += E(t, W('pubblicitario') + 0.1, lbl(S.x + S.w / 2, by - 26, 'SPAZIO PUBBLICITARIO', { size: 24 }));
    s += E(t, W('annuncio') - 0.1, T(S.x + S.w / 2, S.y + S.h / 2 + 40, '?', { f: 'pop', size: 130, a: 'middle' }));
    return s + caption(t, W('chi'), "Chi decide l'annuncio?", '');
  } }) });

// 2 — la pubblicità programmatica
scene('programmatica', { make: (W) => ({
  capAt: W('automatizzato'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(200, 150, 1520, 660, { rot: -0.7 }), { dy: 0 });
    g += E(t, -0.3, T(960, 250, 'L\'ASTA IN 200 MILLISECONDI', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 4, w: 700 }));
    g += E(t, W('pubblicità') - 0.1, T(960, 395, 'Pubblicità', { f: 'pop', size: 104, fill: C.ink, a: 'middle' }));
    g += E(t, W('programmatica') - 0.1, T(960, 515, 'programmatica', { f: 'pop', size: 104, fill: C.ink, a: 'middle' }) +
      `<line x1="${960 - tw('programmatica', 'pop', 104) / 2}" y1="545" x2="${960 + tw('programmatica', 'pop', 104) / 2}" y2="545" stroke="${C.coral}" stroke-width="8" stroke-linecap="round"/>`);
    g += E(t, W('compra') - 0.1, T(760, 640, 'compra', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true }));
    g += E(t, W('vende') - 0.1, T(960, 640, '↔', { f: 'popm', size: 56, fill: C.ink, a: 'middle' }) + T(1160, 640, 'vende', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true }));
    g += E(t, W('stragrande') - 0.1, T(960, 735, 'la stragrande maggioranza della pubblicità digitale', { f: 'popm', size: 38, fill: C.ink, a: 'middle' }));
    s += cam(t, D, g);
    return s + caption(t, W('automatizzato'), 'Un sistema automatizzato', '', true);
  } }) });

// 3 — passo 1: la pagina si carica, lo slot è vuoto
scene('slot', { make: (W) => ({
  capAt: W('slot'),
  render(t) {
    const bx = 300, by = 180, bw = 1080, bh = 600, t0 = W('pagina') - 0.1;
    let s = E(t, -0.4, lbl(bx, 150, 'IL TUO BROWSER', { a: 'start', size: 26 }), { dy: 0 });
    s += E(t, -0.4, browser(bx, by, bw, bh, { load: 0.04 + 0.5 * eio((t - t0) / 3.5), lines: eo((t - t0) / 2.4) }), { dy: 0 });
    const S = slotOf(bx, by, bw, bh);
    s += E(t, W('spazio') - 0.1, `<rect x="${S.x}" y="${S.y}" width="${S.w}" height="${S.h}" rx="10" fill="none" stroke="${C.coral}" stroke-width="5" stroke-dasharray="14 10"/>`, { dy: 0 });
    s += E(t, W('vuoto') - 0.05, lbl(S.x + S.w / 2, S.y + S.h / 2 + 10, 'VUOTO', { size: 30 }));
    // richiamo laterale "SLOT"
    s += E(t, W('slot') - 0.1, arrow(1640, S.y + S.h / 2, S.x + S.w + 20, S.y + S.h / 2, C.line, 4, 20) + T(1660, S.y + S.h / 2 + 20, 'SLOT', { f: 'pop', size: 60 }) +
      T(1660, S.y + S.h / 2 + 80, 'da riempire', { f: 'serif', size: 52, it: true }));
    return s + caption(t, W('slot'), 'Uno slot vuoto', '');
  } }) });

// 4 — passo 2: la richiesta all'ad server
scene('richiesta', { make: (W) => ({
  capAt: W('richiesta'),
  render(t) {
    const bx = 110, by = 300, bw = 440, bh = 300;
    let s = E(t, -0.4, browser(bx, by, bw, bh, { load: 0.55, slot: 'empty', slotSw: 3 }) + lbl(bx + bw / 2, by - 30, 'BROWSER', { size: 24 }), { dy: 0 });
    s += E(t, W('server') - 0.15, server(1660, 620, 1.05) + lbl(1660, 660, 'AD SERVER', { size: 24 }) + lbl(1660, 694, 'DEL SITO', { size: 24 }));
    // la scheda della richiesta
    const cx = 690, cy = 230, cw = 640, ch = 470;
    s += E(t, W('richiesta') - 0.1, `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="16" fill="${C.fillD}" stroke="${C.line}" stroke-width="4"/>` +
      T(cx + 34, cy + 56, 'RICHIESTA', { f: 'mono', size: 28, ls: 4, w: 700 }) + `<line x1="${cx}" y1="${cy + 80}" x2="${cx + cw}" y2="${cy + 80}" stroke="${C.line}" stroke-width="3"/>`);
    s += drawLine(bx + bw + 10, 450, cx - 14, 450, (t - W('invia')) / 0.4, C.line, 4);
    s += E(t, W('invia') + 0.3, arrow(cx - 60, 450, cx - 12, 450, C.line, 4, 18), { dy: 0 });
    s += drawLine(cx + cw + 14, 450, 1570, 450, (t - W('server')) / 0.4, C.line, 4);
    s += E(t, W('server') + 0.3, arrow(1520, 450, 1572, 450, C.line, 4, 18), { dy: 0 });
    const rows = [['SITO', W('sito', 1)], ['ORARIO', W("l'orario")], ['TIPO DI DISPOSITIVO', W('dispositivo')], ['INDIRIZZO IP', W("l'indirizzo")]];
    rows.forEach(([r, tt], i) => s += E(t, tt - 0.1, `<circle cx="${cx + 46}" cy="${cy + 140 + i * 76 - 10}" r="7" fill="${C.line}"/>` + T(cx + 70, cy + 140 + i * 76, r, { f: 'mono', size: 30, w: 600, ls: 2 })));
    s += E(t, W('deduce') - 0.1, T(cx + 70, cy + 140 + 3 * 76 + 70, '→ la posizione', { f: 'serif', size: 50, it: true, fill: C.coral }));
    return s + caption(t, W('richiesta'), 'Parte la richiesta', '');
  } }) });

// 5 — l'ID pubblicitario
scene('idpub', { make: (W) => ({
  capAt: W('id'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(160, 150, 1600, 660, { rot: 0.6 }), { dy: 0 });
    // cartellino dell'ID
    g += E(t, W('id') - 0.15, `<rect x="250" y="300" width="560" height="250" rx="18" fill="${C.ivory}" stroke="${C.coral}" stroke-width="6"/>` +
      T(530, 375, 'ID PUBBLICITARIO', { f: 'mono', size: 34, fill: C.ink, a: 'middle', ls: 3, w: 700 }) +
      T(530, 470, '7f3a-91c2-0b6e', { f: 'mono', size: 46, fill: C.ink, a: 'middle', w: 600 }) +
      T(530, 525, 'ESEMPIO', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3, w: 600 }));
    g += E(t, W('pseudonimo') - 0.1, T(530, 650, 'un codice pseudonimo', { f: 'serif', size: 60, fill: C.ink, a: 'middle', it: true }));
    // broker di dati -> profilo
    g += E(t, W('broker') - 0.1, arrow(840, 425, 1000, 425, C.ink, 5, 22) + `<rect x="1020" y="365" width="270" height="120" rx="14" fill="${C.ivory}" stroke="${C.ink}" stroke-width="4"/>` +
      T(1155, 418, 'BROKER', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 3, w: 700 }) + T(1155, 456, 'DI DATI', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 3, w: 700 }));
    // navigazione: pagine visitate che confluiscono
    [[1080, 230], [1160, 250], [1240, 230]].forEach(([x, y], i) => g += E(t, W('navigazione') - 0.1 + i * 0.1,
      `<rect x="${x - 34}" y="${y - 44}" width="68" height="60" rx="6" fill="${C.ivory}" stroke="${C.ink}" stroke-width="3"/><line x1="${x - 34}" y1="${y - 30}" x2="${x + 34}" y2="${y - 30}" stroke="${C.ink}" stroke-width="2.5"/>` +
      `<line x1="${x}" y1="${y + 18}" x2="${x + (1155 - x) * 0.6}" y2="${360}" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="5 6"/>`));
    g += E(t, W('navigazione') + 0.3, T(1310, 214, 'NAVIGAZIONE', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 600 }));
    g += E(t, W('profilo') - 0.1, arrow(1310, 425, 1420, 425, C.ink, 5, 22) +
      `<rect x="1440" y="300" width="230" height="290" rx="14" fill="${C.ivory}" stroke="${C.ink}" stroke-width="4"/><circle cx="1555" cy="365" r="34" fill="none" stroke="${C.ink}" stroke-width="4"/>` +
      [0, 1, 2, 3].map(j => `<line x1="1475" y1="${435 + j * 34}" x2="${1635 - (j % 2) * 50}" y2="${435 + j * 34}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`).join('') +
      T(1555, 640, 'PROFILO', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 3, w: 700 }));
    s += cam(t, D, g);
    return s + caption(t, W('id'), "L'ID pubblicitario", '', true);
  } }) });

// griglia di inserzionisti per la scena 6
const BG = []; for (let r = 0; r < 6; r++) for (let c = 0; c < 9; c++) BG.push([980 + c * 98 + (r % 2) * 40, 230 + r * 98]);
// 6 — passo 3: l'asta in tempo reale
scene('asta', { make: (W) => ({
  capAt: W('reale'),
  render(t) {
    const hx = 420, hy = 520;
    let s = E(t, -0.4, server(hx, hy + 120, 1.0) + lbl(hx, hy + 165, 'AD SERVER', { size: 24 }), { dy: 0 });
    // l'asta: anello attorno al server
    s += E(t, W('lancia') - 0.1, `<circle cx="${hx}" cy="${hy + 5}" r="190" fill="none" stroke="${C.coral}" stroke-width="5"/>` , { dy: 0 });
    s += E(t, W("un'asta") - 0.05, T(hx, hy - 265, 'ASTA', { f: 'pop', size: 76, a: 'middle' }));
    s += E(t, W('reale') - 0.1, T(hx, hy - 212, 'IN TEMPO REALE', { f: 'mono', size: 28, a: 'middle', ls: 4, w: 700 }));
    // tanti inserzionisti
    BG.forEach(([x, y], i) => s += pop(t, W('centinaia') + (i % 9) * 0.04 + Math.floor(i / 9) * 0.05, x, y, bidder(x, y, 0.95)));
    s += E(t, W('inserzionisti') + 0.1, lbl(1390, 850, 'CENTINAIA DI INSERZIONISTI · SCHEMA', { size: 24 }));
    // la scheda parte verso tutti
    const t0 = W('ricevono');
    BG.forEach(([x, y], i) => {
      const q = (t - t0 - (i % 9) * 0.03) / 0.7; if (q <= 0) return;
      const p = eio(q), mx = lerp(hx + 190, x - 40, p), my = lerp(hy, y - 30, p);
      if (q < 1) s += `<line x1="${hx + 190}" y1="${hy}" x2="${mx}" y2="${my}" stroke="${C.lineDim}" stroke-width="1.5"/>`;
      s += miniCard(mx, my, 0.75);
    });
    s += E(t, W('frazione') - 0.1, T(hx, 810, 'in una frazione di secondo', { f: 'serif', size: 50, a: 'middle', it: true }));
    return s + caption(t, W('reale'), 'Asta in tempo reale', '');
  } }) });

// offerte di esempio (lunghezze relative, nessuna cifra)
const OFF = [0.55, 0.82, 0.38, 0.96, 0.66], ROWY = i => 300 + i * 112;
function bidRows(t, tOff, o = {}) {
  let s = '';
  OFF.forEach((v, i) => {
    const y = ROWY(i), win = o.win != null && i === 3, dim = o.win != null && !win ? clamp((t - o.win) / 0.4) : 0;
    let r = bidder(560, y, 1.3) + T(500, y + 12, 'DSP', { f: 'mono', size: 26, a: 'end', w: 700, ls: 2 });
    const p = eio((t - tOff - i * 0.12) / 0.9), len = 640 * v * p;
    if (p > 0) {
      const col = win && t >= o.win ? C.coral : C.line;
      r += `<rect x="640" y="${y - 22}" width="${len}" height="44" rx="8" fill="${win && t >= o.win ? C.coral : C.fillD2}" stroke="${col}" stroke-width="3"/>`;
    }
    s += `<g opacity="${(1 - 0.55 * dim).toFixed(3)}">${r}</g>`;
  });
  return s;
}
// 7 — la DSP decide quanto offrire
scene('dsp', { make: (W) => ({
  capAt: W('quanto'),
  render(t) {
    let s = '';
    // la scheda della richiesta, a sinistra
    s += E(t, -0.4, `<rect x="96" y="250" width="300" height="400" rx="14" fill="${C.fillD}" stroke="${C.line}" stroke-width="4"/>` + T(246, 300, 'SCHEDA', { f: 'mono', size: 28, a: 'middle', ls: 4, w: 700 }) +
      `<line x1="96" y1="322" x2="396" y2="322" stroke="${C.line}" stroke-width="3"/>` +
      T(122, 385, 'chi sei', { f: 'popm', size: 32 }) + T(122, 425, '(probabilmente)', { f: 'serif', size: 34, it: true }) +
      T(122, 500, 'cosa guardi', { f: 'popm', size: 32 }) + T(122, 575, 'interessi', { f: 'popm', size: 32 }), { dy: 0 });
    OFF.forEach((v, i) => s += E(t, -0.3 + i * 0.08, `<line x1="400" y1="450" x2="520" y2="${ROWY(i)}" stroke="${C.lineDim}" stroke-width="2"/>`, { dy: 0 }));
    s += E(t, W('dsp') - 0.1, lbl(640, 215, 'OGNI INSERZIONISTA HA LA SUA DSP', { size: 24, a: 'start' }));
    s += bidRows(t, W('decide'));
    s += E(t, W('offrire'), lbl(1280, 830, 'OFFERTE · ESEMPIO', { size: 24, a: 'end' }));
    s += E(t, W('momento') - 0.1, T(1440, 410, 'per quello slot,', { f: 'serif', size: 48, it: true }) + T(1440, 470, 'in quel momento', { f: 'serif', size: 48, it: true }));
    return s + caption(t, W('quanto'), 'Quanto offrire?', '');
  } }) });

// 8 — passo 4: vince l'offerta più alta, l'annuncio riempie lo slot
scene('vince', { tail: 0.6, make: (W) => ({
  capAt: W('vince'),
  render(t) {
    const tw0 = W('alta') - 0.05;
    let s = E(t, -0.4, bidRows(t, -5, { win: tw0 }), { dy: 0 });
    s += E(t, -0.4, lbl(640, 215, 'OFFERTE · ESEMPIO', { size: 24, a: 'start' }), { dy: 0 });
    s += E(t, W('vince') - 0.05, T(640 + 640 * OFF[3] - 24, ROWY(3) + 15, 'VINCE', { f: 'pop', size: 40, fill: C.bg, a: 'end' }));
    // browser a destra
    const bx = 1450, by = 330, bw = 400, bh = 290, S = slotOf(bx, by, bw, bh);
    s += E(t, -0.4, lbl(bx + bw / 2, by - 30, 'BROWSER', { size: 24 }), { dy: 0 });
    const filled = W('appare');
    s += E(t, -0.4, browser(bx, by, bw, bh, { load: 0.7, slot: t >= filled ? 'none' : 'empty', slotSw: 3 }), { dy: 0 });
    // l'annuncio parte dalla barra vincente e vola nello slot
    const t1 = W("l'annuncio"), q = eio((t - t1) / (filled - t1));
    if (t >= t1 - 0.2) {
      const x0 = 640 + 640 * OFF[3] - 60, y0 = ROWY(3) - 110, k = lerp(1.0, 1, q);
      const x = lerp(x0, S.x, q), y = lerp(y0, S.y, q), w = lerp(150, S.w, q), h = lerp(110, S.h, q);
      s += E(t, t1 - 0.2, adCard(x, y, w * k, h * k), { dy: 0, d: 0.3 });
    }
    return s + caption(t, W('vince'), 'Vince la più alta', '');
  } }) });

// 9 — passo 5: tra 100 e 200 millisecondi
scene('tempo', { make: (W) => ({
  capAt: W('millisecondi'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(160, 150, 1600, 660, { rot: -0.5 }), { dy: 0 });
    g += E(t, 0.05, T(960, 250, 'RICHIESTA  →  ASTA  →  OFFERTA  →  ANNUNCIO', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 3, w: 700 }));
    g += E(t, W('100') - 0.1, T(960, 375, '100–200 ms', { f: 'pop', size: 120, fill: C.ink, a: 'middle' }));
    g += E(t, W('millisecondi') - 0.1, T(960, 435, 'MILLISECONDI', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 6, w: 700 }));
    // due binari: l'asta (breve) e il caricamento della pagina (aperto, senza scala)
    const x0 = 330, y1 = 545, y2 = 655;
    g += E(t, W('100'), T(x0 - 20, y1 + 12, 'ASTA', { f: 'mono', size: 28, fill: C.ink, a: 'end', ls: 3, w: 700 }) +
      `<rect x="${x0}" y="${y1 - 26}" width="200" height="52" rx="10" fill="${C.coral}" stroke="${C.ink}" stroke-width="3"/>`);
    const lp = eio((t - W('molto') + 0.1) / 2.2);
    g += E(t, W('molto') - 0.1, T(x0 - 20, y2 + 12, 'PAGINA', { f: 'mono', size: 28, fill: C.ink, a: 'end', ls: 3, w: 700 }) +
      `<rect x="${x0}" y="${y2 - 26}" width="${1040 * lp}" height="52" rx="10" fill="none" stroke="${C.ink}" stroke-width="3"/>` +
      `<line x1="${x0 + 1040 * lp + 16}" y1="${y2}" x2="${x0 + 1040 * lp + 120}" y2="${y2}" stroke="${C.ink}" stroke-width="4" stroke-dasharray="6 10" stroke-linecap="round"/>`, { dy: 0 });
    g += E(t, W('caricarsi') - 0.1, T(x0 + 1150, y2 + 90, 'sta ancora caricando…', { f: 'serif', size: 48, fill: C.ink, a: 'end', it: true }));
    g += E(t, W('molto') + 0.6, T(x0, 770, 'SCHEMA, NON IN SCALA', { f: 'mono', size: 24, fill: C.ink, ls: 3, w: 600 }));
    s += cam(t, D, g);
    return s + caption(t, W('millisecondi'), '100–200 millisecondi', '', true);
  } }) });

// icone delle fonti (line-art)
function srcIcon(k, x, y, ink) {
  const st = `fill="none" stroke="${ink}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;
  switch (k) {
    case 'web': return `<rect x="${x - 40}" y="${y - 30}" width="80" height="60" rx="6" ${st}/><line x1="${x - 40}" y1="${y - 16}" x2="${x + 40}" y2="${y - 16}" ${st}/>`;
    case 'app': return `<rect x="${x - 24}" y="${y - 40}" width="48" height="80" rx="9" ${st}/>` + [[-9, -18], [9, -18], [-9, 0], [9, 0]].map(([a, b]) => `<rect x="${x + a - 6}" y="${y + b - 6}" width="12" height="12" rx="2" ${st}/>`).join('');
    case 'fedelta': return `<rect x="${x - 44}" y="${y - 28}" width="88" height="56" rx="8" ${st}/><circle cx="${x - 18}" cy="${y}" r="10" ${st}/><line x1="${x + 4}" y1="${y - 6}" x2="${x + 30}" y2="${y - 6}" ${st}/><line x1="${x + 4}" y1="${y + 8}" x2="${x + 22}" y2="${y + 8}" ${st}/>`;
    case 'carta': return `<rect x="${x - 44}" y="${y - 28}" width="88" height="56" rx="8" ${st}/><line x1="${x - 44}" y1="${y - 12}" x2="${x + 44}" y2="${y - 12}" stroke="${ink}" stroke-width="8"/><line x1="${x - 30}" y1="${y + 12}" x2="${x}" y2="${y + 12}" ${st}/>`;
    case 'like': return `<path d="M${x},${y + 26} C${x - 50},${y - 6} ${x - 30},${y - 44} ${x},${y - 18} C${x + 30},${y - 44} ${x + 50},${y - 6} ${x},${y + 26} z" ${st}/>`;
    case 'geo': return `<path d="M${x},${y + 38} C${x - 10},${y + 16} ${x - 30},${y} ${x - 30},${y - 14} A30,30 0 1 1 ${x + 30},${y - 14} C${x + 30},${y} ${x + 10},${y + 16} ${x},${y + 38} z" ${st}/><circle cx="${x}" cy="${y - 14}" r="10" ${st}/>`;
  }
}
// 10 — i data broker
scene('broker', { tail: 0.6, make: (W) => ({
  capAt: W('broker'),
  render(t) {
    const SRC = [[130, 'web', 'NAVIGAZIONE'], [150, 'app', 'APP'], [170, 'fedelta', 'CARTE FEDELTÀ'], [190, 'carta', 'ACQUISTI'], [210, 'like', 'LIKE'], [230, 'geo', 'POSIZIONE']].map(([a, k, l]) => [k, l, 1010 + 620 * Math.cos(a * Math.PI / 180), 470 - 380 * Math.sin(a * Math.PI / 180)]);
    const bx = 1010, by = 450;
    let s = '';
    s += E(t, W('profilo') - 0.15, T(1080, 140, 'Chi conosce il tuo profilo?', { f: 'serif', size: 56, a: 'middle', it: true }));
    s += E(t, W('data') - 0.15, `<rect x="${bx - 130}" y="${by - 90}" width="260" height="180" rx="16" fill="${C.fillD}" stroke="${C.line}" stroke-width="4"/>` +
      T(bx, by - 8, 'DATA', { f: 'pop', size: 52, a: 'middle' }) + T(bx, by + 50, 'BROKER', { f: 'pop', size: 52, a: 'middle' }));
    SRC.forEach(([k, l, x, y], i) => s += E(t, W('comprano') - 0.2 + i * 0.1, srcIcon(k, x, y - 20, C.line) + lbl(x, y + 52, l, { size: 24 })));
    s += E(t, W('comprano') + 0.5, lbl(110, 850, 'ALCUNE DELLE FONTI', { size: 24, a: 'start' }));
    // flussi verso il broker
    SRC.forEach(([k, l, x, y], i) => {
      const q = (t - W('comprano') - 0.3 - i * 0.08) / 0.6; if (q <= 0) return;
      const ang = Math.atan2(by - (y - 20), bx - 135 - x), sx = x + 62 * Math.cos(ang), sy = y - 20 + 50 * Math.sin(ang), ex = bx - 135, ey = by + (y - 450) * 0.25;
      s += drawLine(sx, sy, ex, ey, q, C.lineDim, 2.5);
      const m = ((t - W('comprano')) * 0.6 + i * 0.17) % 1;
      if (q > 1) s += `<circle cx="${lerp(sx, ex, m)}" cy="${lerp(sy, ey, m)}" r="7" fill="${C.line}"/>`;
    });
    // profilo aggregato
    const px = 1310, py = 270, pa = W('aggregano') - 0.1;
    s += E(t, pa, arrow(bx + 135, by, px - 14, by, C.line, 4, 18), { dy: 0 });
    let prof = `<rect x="${px}" y="${py}" width="300" height="380" rx="16" fill="${C.fillD}" stroke="${C.coral}" stroke-width="5"/><circle cx="${px + 150}" cy="${py + 72}" r="40" fill="none" stroke="${C.line}" stroke-width="4"/>`;
    for (let j = 0; j < 8; j++) { const q = clamp((t - pa - j * 0.09) / 0.3); if (q > 0) prof += `<line x1="${px + 36}" y1="${py + 150 + j * 27}" x2="${px + 36 + (228 - (j % 3) * 50) * q}" y2="${py + 150 + j * 27}" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>`; }
    s += E(t, pa, prof + lbl(px + 150, py + 420, 'IL TUO PROFILO', { size: 24 }), { dy: 0 });
    s += E(t, W('rivendono') - 0.1, arrow(px + 310, by, 1790, by, C.line, 4, 18) + bidder(1830, by - 6, 0.9) + bidder(1830, by + 70, 0.9) + bidder(1830, by - 82, 0.9) + lbl(1880, by - 150, 'INSERZIONISTI', { size: 24, a: 'end' }));
    return s + caption(t, W('broker'), 'I data broker', '');
  } }) });

// 11 — chiusura
scene('finale', { L: 0.5, tail: 3.4, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 440, 'Pubblicità programmatica', { f: 'pop', size: 116, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W("un'asta") - 0.1, 960, 570, "un'asta in una frazione di secondo", { f: 'serif', size: 76, fill: C.ink, a: 'middle', it: true, key: 'frazione' });
    s += E(t, W('secondo') + 0.4, `<line x1="760" y1="650" x2="1160" y2="650" stroke="${C.ink}" stroke-width="3"/>` + T(960, 710, 'PROFTECNOLOGIA · MC COM-3-06', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
