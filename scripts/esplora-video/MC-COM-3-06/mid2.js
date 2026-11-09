// 3 — passo 1: la pagina si carica, lo slot è vuoto
scene('slot', { make: (W) => ({
  capAt: W('slot'),
  render(t) {
    const bx = 180, by = 180, bw = 1080, bh = 600, t0 = W('pagina') - 0.1;
    let s = E(t, -0.4, lbl(bx, 150, 'IL TUO BROWSER', { a: 'start', size: 26 }), { dy: 0 });
    s += E(t, -0.4, browser(bx, by, bw, bh, { load: 0.04 + 0.5 * eio((t - t0) / 3.5), lines: eo((t - t0) / 2.4) }), { dy: 0 });
    const S = slotOf(bx, by, bw, bh);
    s += E(t, W('spazio') - 0.1, `<rect x="${S.x}" y="${S.y}" width="${S.w}" height="${S.h}" rx="10" fill="none" stroke="${C.coral}" stroke-width="5" stroke-dasharray="14 10"/>`, { dy: 0 });
    s += E(t, W('vuoto') - 0.05, lbl(S.x + S.w / 2, S.y + S.h / 2 + 10, 'VUOTO', { size: 30 }));
    s += E(t, W('slot') - 0.1, arrow(1500, S.y + S.h / 2, S.x + S.w + 20, S.y + S.h / 2, C.line, 4, 20) + T(1520, S.y + S.h / 2 + 20, 'SLOT', { f: 'pop', size: 60 }) +
      T(1520, S.y + S.h / 2 + 80, 'da riempire', { f: 'serif', size: 52, it: true }));
    return s + caption(t, W('slot'), 'Uno slot vuoto', '');
  } }) });

// 4 — passo 2: la richiesta all'ad server (con l'ID pubblicitario)
scene('richiesta', { tail: 0.6, make: (W) => ({
  capAt: W('richiesta'),
  render(t) {
    const bx = 110, by = 300, bw = 440, bh = 300;
    let s = E(t, -0.4, browser(bx, by, bw, bh, { load: 0.55, slot: 'empty', slotSw: 3 }) + lbl(bx + bw / 2, by - 30, 'BROWSER', { size: 24 }), { dy: 0 });
    s += E(t, W('server') - 0.15, server(1660, 620, 1.05) + lbl(1660, 660, 'AD SERVER', { size: 24 }) + lbl(1660, 694, 'DEL SITO', { size: 24 }));
    const cx = 690, cy = 220, cw = 640, ch = 560;
    s += E(t, W('richiesta') - 0.1, `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="16" fill="${C.fillD}" stroke="${C.line}" stroke-width="4"/>` +
      T(cx + 34, cy + 56, 'RICHIESTA', { f: 'mono', size: 28, ls: 4, w: 700 }) + `<line x1="${cx}" y1="${cy + 80}" x2="${cx + cw}" y2="${cy + 80}" stroke="${C.line}" stroke-width="3"/>`);
    s += drawLine(bx + bw + 10, 450, cx - 14, 450, (t - W('invia')) / 0.4, C.line, 4);
    s += E(t, W('invia') + 0.3, arrow(cx - 60, 450, cx - 12, 450, C.line, 4, 18), { dy: 0 });
    s += drawLine(cx + cw + 14, 450, 1570, 450, (t - W('server')) / 0.4, C.line, 4);
    s += E(t, W('server') + 0.3, arrow(1520, 450, 1572, 450, C.line, 4, 18), { dy: 0 });
    const RY = i => cy + 145 + i * 70;
    const rows = [['SITO', W('sito', 1)], ['ORARIO', W('orario')], ['TIPO DI DISPOSITIVO', W('dispositivo')], ['INDIRIZZO IP', W('indirizzo')]];
    rows.forEach(([r, tt], i) => s += E(t, tt - 0.1, `<circle cx="${cx + 46}" cy="${RY(i) - 10}" r="7" fill="${C.line}"/>` + T(cx + 70, RY(i), r, { f: 'mono', size: 30, w: 600, ls: 2 })));
    s += E(t, W('deduce') - 0.1, T(cx + 70, RY(3) + 58, '→ la posizione', { f: 'serif', size: 46, it: true }));
    s += E(t, W('id') - 0.1, `<circle cx="${cx + 46}" cy="${RY(5) - 10}" r="7" fill="${C.coral}"/>` + T(cx + 70, RY(5), 'ID PUBBLICITARIO', { f: 'mono', size: 30, w: 700, ls: 2, fill: C.coral }));
    return s + caption(t, W('richiesta'), 'Parte la richiesta', '');
  } }) });

// 5 — l'ID pubblicitario: un codice pseudonimo
scene('idpub', { tail: 0.8, make: (W) => ({
  capAt: W('pseudonimo'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(160, 150, 1600, 660, { rot: 0.6 }), { dy: 0 });
    // il dispositivo e il suo cartellino
    g += E(t, -0.4, phone(260, 520, 1.15, { ink: C.ink, fill: C.ivory }) + `<line x1="300" y1="425" x2="368" y2="425" stroke="${C.ink}" stroke-width="3" stroke-dasharray="5 6"/>` +
      T(260, 570, 'IL TUO', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3, w: 600 }) + T(260, 600, 'DISPOSITIVO', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3, w: 600 }), { dy: 0 });
    g += E(t, -0.3, `<rect x="370" y="300" width="480" height="250" rx="18" fill="${C.ivory}" stroke="${C.coral}" stroke-width="6"/>` +
      T(610, 375, 'ID PUBBLICITARIO', { f: 'mono', size: 34, fill: C.ink, a: 'middle', ls: 3, w: 700 }) +
      T(610, 470, '7f3a-91c2-0b6e', { f: 'mono', size: 46, fill: C.ink, a: 'middle', w: 600 }) +
      T(610, 525, 'ESEMPIO', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3, w: 600 }), { dy: 0 });
    g += E(t, W('pseudonimo') - 0.1, T(610, 655, 'un codice pseudonimo', { f: 'serif', size: 60, fill: C.ink, a: 'middle', it: true }));
    g += E(t, W('pseudonimo') + 0.4, T(610, 715, 'non il tuo nome: un codice del tuo dispositivo', { f: 'popm', size: 30, fill: C.ink, a: 'middle' }));
    g += E(t, W('broker') - 0.1, arrow(870, 425, 1000, 425, C.ink, 5, 22) + `<rect x="1020" y="365" width="270" height="120" rx="14" fill="${C.ivory}" stroke="${C.ink}" stroke-width="4"/>` +
      T(1155, 418, 'BROKER', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 3, w: 700 }) + T(1155, 456, 'DI DATI', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 3, w: 700 }));
    [[1080, 230], [1160, 250], [1240, 230]].forEach(([x, y], i) => g += E(t, W('navigazione') - 0.3 + i * 0.1,
      `<rect x="${x - 34}" y="${y - 44}" width="68" height="60" rx="6" fill="${C.ivory}" stroke="${C.ink}" stroke-width="3"/><line x1="${x - 34}" y1="${y - 30}" x2="${x + 34}" y2="${y - 30}" stroke="${C.ink}" stroke-width="2.5"/>` +
      `<line x1="${x}" y1="${y + 18}" x2="${x + (1155 - x) * 0.6}" y2="${360}" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="5 6"/>`));
    g += E(t, W('navigazione'), T(1310, 214, 'NAVIGAZIONE', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 600 }));
    g += E(t, W('collegare') - 0.1, arrow(1310, 425, 1420, 425, C.ink, 5, 22) +
      `<rect x="1440" y="300" width="230" height="290" rx="14" fill="${C.ivory}" stroke="${C.ink}" stroke-width="4"/><circle cx="1555" cy="365" r="34" fill="none" stroke="${C.ink}" stroke-width="4"/>` +
      [0, 1, 2, 3].map(j => `<line x1="1475" y1="${435 + j * 34}" x2="${1635 - (j % 2) * 50}" y2="${435 + j * 34}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`).join('') +
      T(1555, 640, 'PROFILO', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 3, w: 700 }));
    s += cam(t, D, g);
    return s + caption(t, W('pseudonimo'), 'Un codice pseudonimo', '', true);
  } }) });

// griglia di inserzionisti per la scena 6
const BG = []; for (let r = 0; r < 6; r++) for (let c = 0; c < 9; c++) BG.push([980 + c * 98 + (r % 2) * 40, 230 + r * 98]);
// 6 — passo 3: l'asta in tempo reale (schema semplificato)
scene('asta', { make: (W) => ({
  capAt: W('reale'),
  render(t) {
    const hx = 420, hy = 520, R = 210;
    let s = E(t, -0.4, server(hx, hy + 90, 0.8) + lbl(hx, hy + 135, 'AD SERVER /', { size: 24 }) + lbl(hx, hy + 169, 'AD EXCHANGE', { size: 24 }), { dy: 0 });
    s += E(t, W('lancia') - 0.1, `<circle cx="${hx}" cy="${hy + 5}" r="${R}" fill="none" stroke="${C.coral}" stroke-width="5"/>`, { dy: 0 });
    s += E(t, W("un'asta") - 0.05, T(hx, hy - 285, 'ASTA', { f: 'pop', size: 76, a: 'middle' }));
    s += E(t, W('reale') - 0.1, T(hx, hy - 232, 'IN TEMPO REALE', { f: 'mono', size: 28, a: 'middle', ls: 4, w: 700 }));
    BG.forEach(([x, y], i) => s += pop(t, W('centinaia') + (i % 9) * 0.04 + Math.floor(i / 9) * 0.05, x, y, bidder(x, y, 0.95)));
    s += E(t, W('inserzionisti') + 0.1, lbl(1390, 850, 'CENTINAIA DI INSERZIONISTI · SCHEMA SEMPLIFICATO', { size: 24 }));
    const t0 = W('ricevono');
    BG.forEach(([x, y], i) => {
      const q = (t - t0 - (i % 9) * 0.03) / 0.7; if (q <= 0) return;
      const p = eio(q), mx = lerp(hx + R, x - 40, p), my = lerp(hy, y - 30, p);
      if (q < 1) s += `<line x1="${hx + R}" y1="${hy}" x2="${mx}" y2="${my}" stroke="${C.lineDim}" stroke-width="1.5"/>`;
      s += miniCard(mx, my, 0.75);
    });
    s += E(t, W('frazione') - 0.1, T(hx, 815, 'in una frazione di secondo', { f: 'serif', size: 50, a: 'middle', it: true }));
    return s + caption(t, W('reale'), 'Asta in tempo reale', '');
  } }) });

// offerte di esempio (lunghezze relative, nessuna cifra); due DSP condivise fra più inserzionisti
const OFF = [0.55, 0.82, 0.38, 0.96, 0.66], ROWY = i => 300 + i * 112, IX = 700, BX = 760, BL = 540;
const DSPS = [[520, 470, [0, 1, 2]], [520, 760, [3, 4]]];
function dspPict(x, y) { return server(x, y, 0.45) + lbl(x, y + 34, 'DSP', { size: 26 }); }
function bidRows(t, tOff, o = {}) {
  let s = '';
  DSPS.forEach(([x, y, rows]) => { s += dspPict(x, y); rows.forEach(i => s += `<line x1="${x + 36}" y1="${y - 52}" x2="${IX - 36}" y2="${ROWY(i)}" stroke="${C.lineDim}" stroke-width="2.5"/>`); });
  OFF.forEach((v, i) => {
    const y = ROWY(i), win = o.win != null && i === 3, dim = o.win != null && !win ? clamp((t - o.win) / 0.4) : 0;
    s += bidder(IX, y, 1.3);
    const p = eio((t - tOff - i * 0.12) / 0.9), len = BL * v * p;
    if (p > 0) {
      const on = win && t >= o.win;
      s += `<rect x="${BX}" y="${y - 22}" width="${len}" height="44" rx="8" fill="${on ? C.coral : C.fillD2}" stroke="${on ? C.coral : C.line}" stroke-width="3" opacity="${(1 - 0.55 * dim).toFixed(3)}"/>`;
    }
  });
  return s;
}
// 7 — la DSP decide quanto offrire
scene('dsp', { make: (W) => ({
  capAt: W('quanto'),
  render(t) {
    let s = E(t, -0.4, `<rect x="96" y="250" width="300" height="400" rx="14" fill="${C.fillD}" stroke="${C.line}" stroke-width="4"/>` + T(246, 300, 'SCHEDA', { f: 'mono', size: 28, a: 'middle', ls: 4, w: 700 }) +
      `<line x1="96" y1="322" x2="396" y2="322" stroke="${C.line}" stroke-width="3"/>` +
      T(122, 385, 'chi sei', { f: 'popm', size: 32 }) + T(122, 425, '(probabilmente)', { f: 'serif', size: 34, it: true }) +
      T(122, 500, 'cosa guardi', { f: 'popm', size: 32 }) + T(122, 575, 'interessi', { f: 'popm', size: 32 }), { dy: 0 });
    s += E(t, -0.4, bidRows(t, 99), { dy: 0 });
    DSPS.forEach(([x, y]) => s += E(t, W('dsp') - 0.3, `<line x1="400" y1="450" x2="${x - 40}" y2="${y - 52}" stroke="${C.line}" stroke-width="2.5"/>`, { dy: 0 }));
    s += E(t, W('dsp') - 0.1, lbl(470, 205, 'OGNI INSERZIONISTA USA UNA DSP', { size: 24, a: 'start' }));
    s += bidRows(t, W('decide')).replace(/^[\s\S]*?(?=<rect x="760")/, '');
    s += E(t, W('offrire'), lbl(BX + BL, 850, 'OFFERTE · ESEMPIO', { size: 24, a: 'end' }));
    s += E(t, W('momento') - 0.1, T(1440, 410, 'per quello slot,', { f: 'serif', size: 48, it: true }) + T(1440, 470, 'in quel momento', { f: 'serif', size: 48, it: true }));
    return s + caption(t, W('quanto'), 'Quanto offrire?', '');
  } }) });

// 8 — passo 4: vince l'offerta più alta, l'annuncio riempie lo slot
scene('vince', { tail: 0.6, make: (W) => ({
  capAt: W('vince'),
  render(t) {
    const tw0 = W('alta') - 0.05, bend = BX + BL * OFF[3];
    let s = bidRows(t, -5, { win: tw0 });
    s += E(t, -0.4, lbl(BX, 215, 'OFFERTE · ESEMPIO', { size: 24, a: 'start' }), { dy: 0 });
    s += E(t, W('vince') - 0.05, T(bend - 24, ROWY(3) + 15, 'VINCE', { f: 'pop', size: 40, fill: C.bg, a: 'end' }), { dy: 0 });
    const bx = 1480, by = 330, bw = 380, bh = 290, S = slotOf(bx, by, bw, bh);
    s += E(t, -0.4, lbl(bx + bw / 2, by - 30, 'BROWSER', { size: 24 }), { dy: 0 });
    const t1 = W("l'annuncio"), filled = W('appare');
    s += browser(bx, by, bw, bh, { load: 0.7, slot: t >= filled ? 'none' : 'empty', slotSw: 3 });
    if (t >= t1) {
      const q = eio((t - t1) / (filled - t1)), x0 = bend + 20, y0 = ROWY(3) - 55;
      s += E(t, t1, adCard(lerp(x0, S.x, q), lerp(y0, S.y, q), lerp(150, S.w, q), lerp(110, S.h, q)), { dy: 0, d: 0.25 });
    }
    return s + caption(t, W('vince'), 'Vince la più alta', '');
  } }) });

// 9 — passo 5: tutto il processo in 100–200 millisecondi
scene('tempo', { make: (W) => ({
  capAt: W('millisecondi'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(160, 150, 1600, 660, { rot: -0.5 }), { dy: 0 });
    g += E(t, -0.2, T(960, 250, 'RICHIESTA  →  ASTA  →  OFFERTA  →  ANNUNCIO', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 3, w: 700 }));
    g += E(t, W('100') - 0.1, T(960, 385, '100–200 ms', { f: 'pop', size: 120, fill: C.ink, a: 'middle' }));
    const x0 = 330, y1 = 500, y2 = 650;
    // binario 1: tutto il processo (si riempie su "tutto questo")
    const fp = eio((t - W('tutto') + 0.1) / 1.0);
    g += E(t, W('tutto') - 0.1, T(x0, y1 - 40, 'TUTTO IL PROCESSO', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 700 }) +
      `<rect x="${x0}" y="${y1 - 22}" width="220" height="48" rx="10" fill="none" stroke="${C.ink}" stroke-width="3"/>` +
      (fp > 0 ? `<rect x="${x0}" y="${y1 - 22}" width="${220 * fp}" height="48" rx="10" fill="${C.coral}"/>` : ''), { dy: 0 });
    const lp = eio((t - W('molto') + 0.1) / 2.2);
    g += E(t, W('molto') - 0.1, T(x0, y2 - 40, 'CARICAMENTO DELLA PAGINA', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 700 }) +
      `<rect x="${x0}" y="${y2 - 22}" width="${1040 * lp}" height="48" rx="10" fill="none" stroke="${C.ink}" stroke-width="3"/>` +
      `<line x1="${x0 + 1040 * lp + 16}" y1="${y2 + 2}" x2="${x0 + 1040 * lp + 120}" y2="${y2 + 2}" stroke="${C.ink}" stroke-width="4" stroke-dasharray="6 10" stroke-linecap="round"/>`, { dy: 0 });
    g += E(t, W('caricarsi') - 0.1, T(x0 + 1150, y2 + 85, 'sta ancora caricando…', { f: 'serif', size: 48, fill: C.ink, a: 'end', it: true }));
    g += E(t, W('molto') + 0.6, T(x0, 770, 'SCHEMA, NON IN SCALA', { f: 'mono', size: 24, fill: C.ink, ls: 3, w: 600 }));
    s += cam(t, D, g);
    return s + caption(t, W('millisecondi'), '100–200 millisecondi', '', true);
  } }) });

