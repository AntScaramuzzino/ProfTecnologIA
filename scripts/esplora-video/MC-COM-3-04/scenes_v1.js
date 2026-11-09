// Il loop a feedback e il controllo PID (MC-COM-3-04) — scene con render(t, D) puro.
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

// assi di un grafico temperatura / tempo
function axes(x0, y0, x1, y1, ink, o = {}) {
  let s = `<line x1="${x0}" y1="${y1}" x2="${x0}" y2="${y0 - 10}" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>` + arrow(x0, y1, x1 + 30, y1, ink, 4, 18) + arrow(x0, y1, x0, y0 - 30, ink, 4, 18);
  s += T(x0 + 24, y0 - 6, o.yl || 'TEMPERATURA', { f: 'mono', size: o.ls || 24, fill: ink, ls: 2, w: 600 });
  s += T(x1 + 20, y1 + 50, o.xl || 'TEMPO', { f: 'mono', size: o.ls || 24, fill: ink, ls: 2, w: 600, a: 'end' });
  return s;
}
function target(x0, x1, y, ink, lab = 'TARGET', o = {}) {
  return `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${ink}" stroke-width="3" stroke-dasharray="14 10"/>` + T(x1 + (o.dx ?? 20), y + 9, lab, { f: 'mono', size: o.size || 24, fill: ink, ls: 2, w: 600, a: o.a || 'start' });
}
// campiona una funzione y(x) da xa a xb (parziale p)
function curve(f, xa, xb, p = 1, n = 120) { const pts = []; const xe = lerp(xa, xb, clamp(p)); for (let i = 0; i <= n; i++) { const x = lerp(xa, xe, i / n); pts.push([x, f(x)]); } return pts; }

// 1 — aggancio: dal termostato al robot
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('principio'),
  render(t) {
    let s = words(t, W('ogni') - 0.1, 960, 230, 'Ogni sistema automatico', { f: 'pop', size: 76, a: 'middle' });
    s += E(t, W('termostato') - 0.1, thermostat(520, 560, 1, { ang: -50 }) + lbl(520, 750, 'TERMOSTATO'));
    const sw = Math.sin(t * 1.3) * 6;
    s += E(t, W('robot') - 0.1, robotArm(1400, 700, 0.95, { a1: -75 + sw, a2: 55 - sw }) + lbl(1400, 790, 'ROBOT'));
    const p = (t - W('principio') + 0.2) / 0.6;
    s += drawLine(680, 560, 860, 560, p, C.line, 3, { dash: '6 12' }) + drawLine(1220, 560, 1060, 560, p, C.line, 3, { dash: '6 12' });
    s += pop(t, W('principio') - 0.1, 960, 560, loopIcon(960, 560, 70, C.line, 7));
    return s + caption(t, W('principio'), 'Un principio fondamentale', 'principio');
  } }) });

// 2 — l'anello: sistema → sensore → confronto → correzione
const BX = { sis: [560, 330], sen: [1360, 330], con: [1360, 690], cor: [560, 690] }, BW = 330, BH = 104;
function box(k, lab, ink, o = {}) {
  const [x, y] = BX[k];
  return `<rect x="${x - BW / 2}" y="${y - BH / 2}" width="${BW}" height="${BH}" rx="16" fill="${o.fill || C.fillD}" stroke="${ink}" stroke-width="${o.sw || 4}"/>` + T(x, y + 11, lab, { f: 'mono', size: 30, fill: ink, a: 'middle', ls: 3, w: 700 });
}
scene('loop', { make: (W) => ({
  capAt: W('confronta'), minD: W('desiderato') + 1.4,
  render(t) {
    const t0 = W('loop') - 0.1;
    let s = E(t, t0, box('sis', 'STANZA', C.line) + box('cor', 'CORREZIONE', C.line), { dy: 0 });
    s += E(t, t0 + 0.2, arrow(560 + BW / 2, 330, 1360 - BW / 2 - 6, 330, C.line, 4, 20) + arrow(1360 - BW / 2, 690, 560 + BW / 2 + 6, 690, C.line, 4, 20) + arrow(560, 690 - BH / 2, 560, 330 + BH / 2 + 6, C.line, 4, 20), { dy: 0 });
    s += E(t, W('feedback') - 0.1, T(900, 525, 'loop a feedback', { f: 'serif', size: 64, it: true, a: 'middle' }), { dy: 10 });
    s += E(t, W('misura') - 0.1, box('sen', 'SENSORE', C.line) + T(1360, 245, 'misura', { f: 'serif', size: 46, it: true, a: 'middle' }));
    s += E(t, W('attuale') - 0.15, arrow(1360, 330 + BH / 2, 1360, 690 - BH / 2 - 6, C.line, 4, 20) + T(1385, 520, 'STATO ATTUALE', { f: 'mono', size: 26, a: 'start', ls: 2, w: 600 }), { dy: 0 });
    s += E(t, W('confronta') - 0.1, box('con', 'CONFRONTO', C.coral, { sw: 5 }));
    s += E(t, W('desiderato') - 0.15, arrow(1840, 690, 1360 + BW / 2 + 6, 690, C.line, 4, 20) + T(1690, 790, 'STATO', { f: 'mono', size: 26, a: 'middle', ls: 2, w: 600 }) + T(1690, 826, 'DESIDERATO', { f: 'mono', size: 26, a: 'middle', ls: 2, w: 600 }), { dy: 0 });
    // segnale che percorre l'anello, dopo "continuamente"
    const tc = W('continuamente');
    if (t > tc) {
      const ring = [[560, 330], [1360, 330], [1360, 690], [560, 690], [560, 330]];
      const q = ((t - tc) / 3.2) % 1, [px, py] = along(ring, q);
      s += `<circle cx="${px}" cy="${py}" r="13" fill="${C.line}" opacity="${eo((t - tc) / 0.3).toFixed(3)}"/>`;
    }
    return s + caption(t, W('confronta'), 'Misura e confronta', '');
  } }) });

// 3 — l'errore (registro chiaro)
scene('errore', { make: (W) => ({
  capAt: W('corregge'), minD: 0,
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(240, 170, 1440, 640, { rot: -0.6 }), { dy: 0 });
    // termometro in sezione
    const tx = 500, top = 250, bot = 690;
    g += E(t, -0.3, `<rect x="${tx - 34}" y="${top}" width="68" height="${bot - top}" rx="34" fill="${C.ivory}" stroke="${C.ink}" stroke-width="4"/>` +
      `<circle cx="${tx}" cy="${bot + 10}" r="56" fill="${C.ink}"/><rect x="${tx - 14}" y="560" width="28" height="${bot - 560}" fill="${C.ink}"/>`, { dy: 0 });
    g += E(t, 0.0, `<line x1="${tx - 60}" y1="330" x2="${tx + 60}" y2="330" stroke="${C.ink}" stroke-width="4"/>` + T(tx - 80, 341, 'DESIDERATO', { f: 'mono', size: 26, fill: C.ink, a: 'end', ls: 2, w: 700 }) +
      `<line x1="${tx - 60}" y1="560" x2="${tx + 60}" y2="560" stroke="${C.ink}" stroke-width="4"/>` + T(tx - 80, 571, 'ATTUALE', { f: 'mono', size: 26, fill: C.ink, a: 'end', ls: 2, w: 700 }), { dy: 0 });
    g += E(t, W('differenza') - 0.1, `<path d="M${tx + 80},330 L${tx + 104},330 L${tx + 104},560 L${tx + 80},560" fill="none" stroke="${C.coral}" stroke-width="5"/>` + T(tx + 128, 456, 'ERRORE', { f: 'mono', size: 30, fill: C.coral, ls: 3, w: 700 }), { dy: 0 });
    g += E(t, W('l\'errore') - 0.1, T(1000, 380, 'errore =', { f: 'pop', size: 64, fill: C.ink }));
    g += E(t, W('l\'errore') + 0.2, T(1000, 470, 'desiderato − attuale', { f: 'pop', size: 56, fill: C.ink }));
    g += E(t, W('corregge') - 0.1, arrow(1000, 580, 1120, 580, C.ink, 5, 22) + T(1150, 596, 'il sistema corregge', { f: 'serif', size: 52, fill: C.ink, it: true }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('corregge'), 'Corregge l\'errore', '', true);
  } }) });

// 4 — il controllo PID
scene('pid', { make: (W) => ({
  capAt: W('pid'), minD: W('derivativo') + 1.45,
  render(t) {
    let s = E(t, W('usato') - 0.1, T(960, 250, 'il metodo più usato', { f: 'serif', size: 60, it: true, a: 'middle' }));
    const X = [560, 960, 1360], N = ['Proporzionale', 'Integrale', 'Derivativo'], L = ['P', 'I', 'D'];
    s += E(t, W('pid') - 0.1, X.map((x, i) => T(x, 560, L[i], { f: 'pop', size: 220, a: 'middle' })).join(''));
    N.forEach((n, i) => s += E(t, W(n.toLowerCase()) - 0.1, T(X[i], 660, n.toUpperCase(), { f: 'mono', size: 32, a: 'middle', ls: 3, w: 700 })));
    return s + caption(t, W('pid'), 'Il controllo PID', 'PID');
  } }) });

// 5 — P: correzione proporzionale all'errore
scene('prop', { make: (W) => ({
  capAt: W('proporzionale', 1), minD: W('correzione', 2) + 1.85,
  render(t) {
    const tb = W('cinque') - 0.25;
    let s = OUT(t, tb, E(t, -0.4, T(960, 520, 'P', { f: 'pop', size: 260, a: 'middle' }), { dy: 0 }) +
      E(t, W('proporzionale') - 0.1, T(960, 620, 'PROPORZIONALE', { f: 'mono', size: 34, a: 'middle', ls: 4, w: 700 })) +
      E(t, W('correzione') - 0.1, T(960, 720, 'correzione proporzionale all\'errore attuale', { f: 'serif', size: 52, it: true, a: 'middle' })));
    if (t < tb) return s + caption(t, W('proporzionale', 1), 'Correzione proporzionale', '');
    const X0 = 560, PX = 130; // 1 °C = 130 px
    const row = (y, val, lab, tE, tC, coral, big) => {
      let r = E(t, tE - 0.1, T(200, y - 62, lab, { f: 'mono', size: 28, ls: 3, w: 700 }));
      const pe = eio((t - tE) / 0.6), pc = eio((t - tC) / 0.7);
      r += E(t, tE - 0.1, T(X0 - 30, y + 10, 'ERRORE', { f: 'mono', size: 26, a: 'end', ls: 2, w: 600 }) + T(X0 - 30, y + 90, 'CORREZIONE', { f: 'mono', size: 26, a: 'end', ls: 2, w: 600 }), { dy: 0 });
      if (pe > 0) r += `<rect x="${X0}" y="${y - 18}" width="${Math.max(2, val * PX * pe)}" height="36" rx="6" fill="none" stroke="${C.line}" stroke-width="4"/>`;
      if (pc > 0) r += `<rect x="${X0}" y="${y + 62}" width="${Math.max(2, val * PX * pc)}" height="36" rx="6" fill="${coral ? C.coral : C.line}"/>`;
      r += E(t, tC + 0.3, T(X0 + val * PX + 40, y + 94, big, { f: 'serif', size: 52, it: true }));
      return r;
    };
    s += row(380, 5, '5 °C SOTTO IL TARGET', W('cinque'), W('correzione', 1), true, 'grande');
    s += row(700, 0.5, '0,5 °C SOTTO IL TARGET', W('zero'), W('correzione', 2), false, 'piccola');
    return s + caption(t, W('proporzionale', 1), 'Correzione proporzionale', '');
  } }) });

// grafico comune (I e D): area x 260..1450 / 1660, y 260..780
const GX0 = 260, GY0 = 280, GY1 = 780, TG = 400;

// 6 — I: errori accumulati nel tempo
scene('integ', { make: (W) => ({
  capAt: W('accumulati'),
  render(t) {
    const GX1 = 1640, xs = 900;
    const fP = x => 760 - 290 * (1 - Math.exp(-(x - GX0) / 150)); // si assesta a 470: sotto il target
    const yS = fP(xs), fI = x => TG + (yS - TG) * Math.exp(-(x - xs) / 110);
    let s = E(t, -0.4, axes(GX0, GY0, GX1, GY1, C.line) + target(GX0, GX1, TG, C.line), { dy: 0 });
    s += E(t, -0.2, T(GX1 + 20, GY0 - 6, 'ESEMPIO', { f: 'mono', size: 24, a: 'end', ls: 3, w: 600 }), { dy: 0 });
    const tC = W('compensa'), pP = (t + 0.2) / 2.2;
    s += `<path d="${pathOf(curve(fP, GX0, xs, pP))}" fill="none" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/>`;
    // area dell'errore accumulato (corallo) fino al punto attuale
    const pa = eio((t - W('accumulati') + 0.1) / 1.2);
    if (pa > 0) { const c = curve(fP, GX0, xs, pa, 80); s += `<path d="${pathOf(c)} L${c[c.length - 1][0]},${TG} L${GX0},${TG} z" fill="${C.coral}" fill-opacity="0.35" stroke="none"/><path d="${pathOf(c)}" fill="none" stroke="${C.coral}" stroke-width="0"/>`; }
    s += E(t, W('accumulati') + 0.3, T(580, 370, 'errori accumulati', { f: 'serif', size: 48, it: true, a: 'middle' }));
    // deriva costante: senza I resterebbe sotto il target
    const tD = W('deriva') - 0.1, dp = (t - tD) / 0.8;
    if (dp > 0) s += `<path d="${pathOf(curve(fP, xs, 1490, dp))}" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="12 10" opacity="0.8"/>`;
    s += E(t, tD + 0.3, `<path d="M1500,${TG + 6} L1520,${TG + 6} L1520,${fP(1500) - 6} L1500,${fP(1500) - 6}" fill="none" stroke="${C.line}" stroke-width="3"/>` + T(1540, 448, 'SOLO P', { f: 'mono', size: 24, ls: 2, w: 700 }) + T(1540, 490, 'resta sotto', { f: 'serif', size: 36, it: true }), { dy: 0 });
    // con I: risale fino al target
    const pI = (t - tC) / 1.6;
    if (pI > 0) s += `<path d="${pathOf(curve(fI, xs, 1440, pI))}" fill="none" stroke="${C.line}" stroke-width="7" stroke-linecap="round"/>`;
    s += E(t, tC + 0.9, T(1180, 360, 'CON I', { f: 'mono', size: 28, ls: 3, w: 700, a: 'middle' }));
    return s + caption(t, W('accumulati'), 'Errori accumulati', '');
  } }) });

// 7 — D: anticipa
scene('deriv', { make: (W) => ({
  capAt: W('anticipa'),
  render(t) {
    const GX1 = 1400, y0 = 760, a = 6, U = 1140;
    const f = x => { const u = (x - GX0) / U; return TG + (y0 - TG) * (1 + a * u) * Math.exp(-a * u); };
    const xm = GX0 + 0.33 * U, ym = f(xm), sl = (f(xm + 1) - f(xm - 1)) / 2;
    let s = E(t, -0.4, axes(GX0, GY0, GX1, GY1, C.line) + target(GX0, GX1, TG, C.line), { dy: 0 });
    s += E(t, -0.2, T(GX1 + 20, GY0 - 6, 'ESEMPIO', { f: 'mono', size: 24, a: 'end', ls: 3, w: 600 }), { dy: 0 });
    s += `<path d="${pathOf(curve(f, GX0, xm, (t + 0.2) / 1.4))}" fill="none" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/>`;
    if (t > 1.2) s += `<circle cx="${xm}" cy="${ym}" r="12" fill="${C.line}" opacity="${eo((t - 1.2) / 0.3)}"/>`;
    // tendenza futura: prolungamento tratteggiato che supererebbe il target
    const ta = W('anticipa') - 0.1, x2 = xm + 500, pa = (t - ta) / 0.8;
    s += drawLine(xm, ym, x2, ym + sl * 500, pa, C.line, 4, { dash: '12 12' });
    s += E(t, ta + 0.7, T(x2 + 16, ym + sl * 500 + 10, 'TENDENZA', { f: 'mono', size: 24, ls: 2, w: 700 }), { dy: 0 });
    // sale rapidamente: freccia tangente
    const ts = W('sale') - 0.1;
    s += E(t, ts, arrow(xm - 100, ym - sl * 100, xm + 120, ym + sl * 120, C.coral, 7, 28) + T(xm + 40, ym + 90, 'SALE RAPIDAMENTE', { f: 'mono', size: 26, fill: C.coral, ls: 2, w: 700 }), { dy: 0 });
    // correzione ridotta (barra verticale a destra)
    const tr = W('riduce') - 0.1, bx = 1680, bb = 760, hq = 330 - 230 * eio((t - tr - 0.3) / 1.2);
    s += E(t, tr, `<rect x="${bx - 50}" y="${bb - hq}" width="100" height="${hq}" rx="8" fill="${C.line}"/>` + `<line x1="${bx - 80}" y1="${bb}" x2="${bx + 80}" y2="${bb}" stroke="${C.line}" stroke-width="4"/>` + T(bx, bb + 46, 'CORREZIONE', { f: 'mono', size: 26, a: 'middle', ls: 2, w: 700 }), { dy: 0 });
    s += E(t, tr + 0.6, T(bx, bb - 130, 'ridotta', { f: 'serif', size: 48, it: true, a: 'middle' }));
    // prima di arrivarci: la curva piega dolcemente sul target
    const tp = W('prima') - 0.1, pp = (t - tp) / 1.0;
    if (pp > 0) s += `<path d="${pathOf(curve(f, xm, GX1, pp))}" fill="none" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/>`;
    return s + caption(t, W('anticipa'), 'Anticipa il comportamento', '');
  } }) });

// 8 — senza D / con D (registro chiaro)
scene('inerzia', { make: (W) => ({
  capAt: W('superare'), minD: W('superare') + 3.7,
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(180, 170, 1560, 640, { rot: 0.5 }), { dy: 0 });
    const panel = (x0, lab, f, t0, coral) => {
      const x1 = x0 + 560, gy0 = 300, gy1 = 680, tg = 420;
      let r = axes(x0, gy0, x1, gy1, C.ink, { ls: 24 }) + target(x0, x1, tg, C.ink, 'TARGET', { size: 24, dx: 14 });
      r += T(x0 + 280, 260, lab, { f: 'pop', size: 48, fill: C.ink, a: 'middle' });
      r += `<path d="${pathOf(curve(x => f(x - x0, tg, gy1), x0, x1 - 20, (t - t0) / 1.6))}" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
      return r;
    };
    const fs = (x, tg, yb) => { const u = x / 540; return tg + (yb - 20 - tg) * Math.exp(-4 * u) * Math.cos(9 * u) ; };
    const fd = (x, tg, yb) => { const u = x / 540; return tg + (yb - 20 - tg) * (1 + 7 * u) * Math.exp(-7 * u); };
    g += E(t, -0.3, panel(300, 'senza D', fs, 0.0), { dy: 0 });
    g += E(t, W('evita') - 0.1, panel(1060, 'con D', fd, W('evita')), { dy: 0 });
    // superamento evidenziato (corallo) nel pannello senza D
    let um = 0, ymin = 1e9; for (let i = 0; i < 300; i++) { const u = i / 299 * 0.5, y = fs(u * 540, 420, 680); if (y < ymin) { ymin = y; um = u; } }
    const xp = 300 + um * 540;
    g += E(t, W('superare') - 0.1, `<ellipse cx="${xp}" cy="${(ymin + 420) / 2}" rx="70" ry="${(420 - ymin) / 2 + 26}" fill="none" stroke="${C.coral}" stroke-width="5"/>` + T(xp + 86, ymin + 20, 'SUPERA', { f: 'mono', size: 28, fill: C.coral, a: 'start', ls: 3, w: 700 }), { dy: 0 });
    g += E(t, W('inerzia') - 0.1, T(960, 262, 'ESEMPIO', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3, w: 600 }), { dy: 0 });
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('superare'), 'Evita di superare', '', true);
  } }) });

// 9 — termostato e cruise control
scene('casa', { make: (W) => ({
  capAt: W('cruise'), minD: W('pieno') + 1.4,
  render(t) {
    let s = E(t, W('termostato') - 0.1, thermostat(540, 500, 1.05, { ang: -40 }) + lbl(540, 700, 'TERMOSTATO DI CASA'));
    s += E(t, W('semplificata') - 0.1, T(540, 790, 'versione semplificata', { f: 'serif', size: 54, it: true, a: 'middle' }));
    s += E(t, W('cruise') - 0.1, car(1380, 560, 1.15) + `<line x1="1060" y1="610" x2="1700" y2="610" stroke="${C.line}" stroke-width="3"/>` + lbl(1380, 700, 'CRUISE CONTROL'));
    s += pop(t, W('pieno') - 0.15, 1380, 780, pillTag(1380, 798, 'PID PIENO', C.coral, C.bg, { a: 'middle', size: 34, stroke: C.coral, sw: 4, w: 700 }));
    return s + caption(t, W('cruise'), 'Semplificato o pieno', '');
  } }) });

// 10 — bracci robotici: meno di un millisecondo
scene('robot', { make: (W) => ({
  capAt: W('inferiore'),
  render(t) {
    const sw = Math.sin(t * 1.6) * 8;
    let s = E(t, -0.4, robotArm(620, 760, 1.15, { a1: -72 + sw, a2: 60 - sw * 1.4 }) + lbl(620, 860, 'BRACCIO ROBOTICO'), { dy: 0 });
    s += E(t, W('ritardo') - 0.1, T(1360, 400, 'RITARDO DI RISPOSTA', { f: 'mono', size: 30, a: 'middle', ls: 3, w: 700 }));
    s += E(t, W('millisecondo') - 0.2, T(1360, 600, '< 1 ms', { f: 'pop', size: 170, fill: C.coral, a: 'middle' }));
    s += E(t, W('millisecondo') - 0.1, T(1360, 690, 'meno di un millesimo di secondo', { f: 'serif', size: 46, it: true, a: 'middle' }));
    return s + caption(t, W('inferiore'), 'Sotto il millisecondo', '');
  } }) });

// 11 — drone: sei PID simultanei
scene('drone', { make: (W) => ({
  capAt: W('sei'), minD: 0.35 + 4.77 + 1.8,
  render(t) {
    const cx = 1180, cy = 560, bob = Math.sin(t * 2) * 6;
    let s = E(t, -0.4, `<g transform="translate(0,${bob.toFixed(2)})">${drone(cx, cy, 1.05)}</g>`, { dy: 0 });
    s += E(t, -0.2, lbl(cx, 800, 'DRONE'), { dy: 0 });
    s += E(t, W('sei') - 0.1, T(140, 400, '6 PID', { f: 'pop', size: 150, fill: C.coral }));
    s += E(t, W('simultanei') - 0.1, T(146, 470, 'simultanei', { f: 'serif', size: 54, it: true }));
    // assi: X, Y (prospettiva), Z
    const AX = [[[cx - 360, cy + 20], [cx + 380, cy + 20], 'X'], [[cx - 190, cy + 170], [cx + 200, cy - 150], 'Y'], [[cx, cy + 220], [cx, cy - 290], 'Z']];
    const tr = W('rotazione') - 0.15, tt = W('traslazione') - 0.15;
    AX.forEach(([a, b, n], i) => {
      // rotazione: piccola freccia circolare attorno all'estremo dell'asse
      const ex = lerp(a[0], b[0], 0.86), ey = lerp(a[1], b[1], 0.86);
      s += pop(t, tr + i * 0.15, ex, ey, loopIcon(ex, ey, 34, C.line, 4));
      // traslazione: l'asse stesso, freccia doppia
      s += E(t, tt + i * 0.15, `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.line}" stroke-width="3" stroke-dasharray="10 8"/>` + arrow(lerp(a[0], b[0], 0.5), lerp(a[1], b[1], 0.5), b[0], b[1], C.line, 4, 20) + arrow(lerp(a[0], b[0], 0.5), lerp(a[1], b[1], 0.5), a[0], a[1], C.line, 4, 20), { dy: 0 });
      s += E(t, tt + i * 0.15, T(b[0] + (n === 'Z' ? 30 : 24), b[1] + (n === 'Z' ? 10 : 0), n, { f: 'mono', size: 30, w: 700 }), { dy: 0 });
    });
    s += E(t, tr, T(146, 590, '3 ASSI DI ROTAZIONE', { f: 'mono', size: 28, ls: 2, w: 700 }));
    s += E(t, tt, T(146, 650, '3 DI TRASLAZIONE', { f: 'mono', size: 28, ls: 2, w: 700 }));
    return s + caption(t, W('sei'), 'Sei PID simultanei', '');
  } }) });

// 12 — chiusura
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 440, 'Il loop a feedback', { f: 'pop', size: 140, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('misurare') - 0.1, 960, 570, 'misurare, confrontare, correggere', { f: 'serif', size: 76, fill: C.ink, a: 'middle', it: true, key: 'correggere' });
    s += E(t, W('automatico') + 0.4, `<line x1="760" y1="650" x2="1160" y2="650" stroke="${C.ink}" stroke-width="3"/>` + T(960, 712, 'PROFTECNOLOGIA · MC COM-3-04', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
