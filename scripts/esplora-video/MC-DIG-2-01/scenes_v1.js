// Le tre strutture fondamentali — MC-DIG-2-01 §"Le tre strutture fondamentali". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.15);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const push = (g, t, D, cy = 495, k = 0.02) => `<g transform="translate(960,${cy}) scale(${1 + k * t / D}) translate(-960,${-cy})">${g}</g>`;

// 1 — aggancio: tre programmi molto diversi
function osIcon(cx, cy, st) {
  let s = `<rect x="${cx - 170}" y="${cy - 120}" width="340" height="220" rx="14" fill="${DIM()}" stroke="${st}" stroke-width="4"/>`;
  s += `<line x1="${cx}" y1="${cy + 100}" x2="${cx}" y2="${cy + 140}" stroke="${st}" stroke-width="4"/><line x1="${cx - 70}" y1="${cy + 142}" x2="${cx + 70}" y2="${cy + 142}" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
  s += `<rect x="${cx - 140}" y="${cy - 95}" width="170" height="110" rx="6" fill="${C.bg}" stroke="${st}" stroke-width="3"/><line x1="${cx - 140}" y1="${cy - 75}" x2="${cx + 30}" y2="${cy - 75}" stroke="${st}" stroke-width="3"/>`;
  s += `<rect x="${cx - 40}" y="${cy - 45}" width="180" height="115" rx="6" fill="${C.bg}" stroke="${st}" stroke-width="3"/><line x1="${cx - 40}" y1="${cy - 25}" x2="${cx + 140}" y2="${cy - 25}" stroke="${st}" stroke-width="3"/>`;
  return s + `<line x1="${cx - 160}" y1="${cy + 82}" x2="${cx + 160}" y2="${cy + 82}" stroke="${st}" stroke-width="2.5"/>`;
}
function padIcon(cx, cy, st) {
  let s = `<path d="M${cx - 150},${cy - 60} Q${cx - 190},${cy - 60} ${cx - 200},${cy} L${cx - 215},${cy + 90} Q${cx - 220},${cy + 140} ${cx - 175},${cy + 140} Q${cx - 140},${cy + 140} ${cx - 110},${cy + 80} L${cx + 110},${cy + 80} Q${cx + 140},${cy + 140} ${cx + 175},${cy + 140} Q${cx + 220},${cy + 140} ${cx + 215},${cy + 90} L${cx + 200},${cy} Q${cx + 190},${cy - 60} ${cx + 150},${cy - 60} z" fill="${DIM()}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="M${cx - 135},${cy - 2} h22 v-22 h22 v22 h22 v22 h-22 v22 h-22 v-22 h-22 z" fill="none" stroke="${st}" stroke-width="3" stroke-linejoin="round"/>`;
  [[105, -10], [135, 18], [75, 18], [105, 46]].forEach(([dx, dy]) => s += `<circle cx="${cx + dx}" cy="${cy + dy - 12}" r="13" fill="none" stroke="${st}" stroke-width="3"/>`);
  return s;
}
function recIcon(cx, cy, st) {
  let s = `<rect x="${cx - 115}" y="${cy - 150}" width="230" height="300" rx="26" fill="${DIM()}" stroke="${st}" stroke-width="4"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
    const x = cx - 90 + c * 92, y = cy - 120 + r * 82;
    s += `<rect x="${x}" y="${y}" width="80" height="62" rx="6" fill="${C.bg}" stroke="${st}" stroke-width="3"/><path d="M${x + 33},${y + 20} l18,11 l-18,11 z" fill="${st}"/>`;
  }
  return s;
}
scene('hook', { make: (W) => ({
  capAt: W('sembrano'),
  render(t) {
    const it = [[400, W('sistema'), osIcon, 'SISTEMA OPERATIVO'], [960, W('videogioco'), padIcon, 'VIDEOGIOCO'], [1520, W('raccomandazione') - 0.3, recIcon, 'RACCOMANDAZIONI']];
    let s = '';
    it.forEach(([x, t0, f, l]) => { s += E(t, t0 - 0.15, f(x, 450, C.line) + lbl(x, 700, l)); });
    s += E(t, W('sembrano'), IT(960, 790, 'programmi molto diversi tra loro…', { a: 'middle', size: 50 }));
    return s + caption(t, W('sembrano'), 'Programmi diversissimi?', 'diversissimi');
  } }) });

// 2 — solo tre strutture (registro chiaro)
function miniSeq(x, y, st) { return [0, 1, 2].map(i => `<rect x="${x}" y="${y + i * 30}" width="70" height="22" rx="4" fill="none" stroke="${st}" stroke-width="3"/>`).join(''); }
function miniSel(x, y, st) { return diamond(x + 35, y + 22, 26, 20, st, 'none', 3) + poly([[x + 9, y + 22], [x - 4, y + 22], [x - 4, y + 82]], st, 3) + poly([[x + 61, y + 22], [x + 74, y + 22], [x + 74, y + 82]], st, 3); }
function miniLoop(x, y, st) { return `<rect x="${x}" y="${y + 6}" width="70" height="66" rx="16" fill="none" stroke="${st}" stroke-width="3"/>` + `<path d="M${x + 70},${y + 30} l-9,-12 l18,0 z" fill="${st}"/>`; }
scene('tre', { make: (W) => ({
  capAt: W('solo'),
  render(t, D) {
    const I = C.ink;
    let g = E(t, -0.4, card(180, 150, 1560, 660, { rot: -0.5 }), { dy: 0 });
    g += E(t, W('qualsiasi'), T(270, 280, 'QUALSIASI PROGRAMMA =', { f: 'mono', size: 30, fill: I, ls: 4, w: 700 }));
    g += pop(t, W('tre'), 470, 560, T(470, 680, '3', { f: 'pop', size: 380, fill: I, a: 'middle' }));
    const rows = [['SEQUENZA', miniSeq], ['SELEZIONE', miniSel], ['ITERAZIONE', miniLoop]];
    rows.forEach(([l, f], i) => {
      const y = 400 + i * 135;
      g += E(t, W('strutture') + i * 0.25, f(820, y - 62, I) + T(960, y, l, { f: 'pop', size: 76, fill: I }), { dy: 16 });
    });
    g += E(t, W('fondamentali'), IT(270, 760, 'strutture fondamentali', { fill: I, size: 46 }));
    return lightBg() + push(g, t, D) + caption(t, W('solo'), 'Solo tre strutture', 'tre', true);
  } }) });

// 3 — sequenza: istruzioni una dopo l'altra
scene('seq', { make: (W) => ({
  capAt: W("l'altra") - 0.4,
  render(t) {
    let s = words(t, W('sequenza') - 0.15, 120, 360, 'Sequenza', { f: 'pop', size: 120 });
    s += E(t, W('istruzioni'), IT(124, 450, "istruzioni eseguite", { size: 54 }));
    s += E(t, W('una'), IT(124, 515, "una dopo l'altra", { size: 54 }));
    const bx = 1060, by = 210, bw = 520, step = 112;
    for (let i = 0; i < 4; i++) {
      s += E(t, -0.3 + i * 0.12, block(bx, by + i * step, bw, 'istruzione ' + (i + 1), { h: 92, size: 36 }) +
        T(bx - 40, by + i * step + 58, String(i + 1), { f: 'mono', size: 34, fill: C.line, a: 'end', w: 700 }), { dy: 10 });
    }
    // indicatore corallo: scende un blocco alla volta, dall'inizio di "eseguite"
    const t0 = W('eseguite'), k = clamp(Math.floor((t - t0) / 0.6), 0, 3), fr = clamp(((t - t0) - k * 0.6) / 0.18);
    if (t > t0 - 0.2) {
      const yy = by + 46 + (k - 1 + (k === 0 ? 1 : eo(fr))) * step;
      s += E(t, t0 - 0.2, `<path d="M${bx - 120},${yy - 22} l36,22 l-36,22 z" fill="${C.coral}"/>`, { dy: 0 });
    }
    s += E(t, W("nell'ordine"), arrow(bx + bw + 70, by + 10, bx + bw + 70, by + 3 * step + 80, C.line, 4) +
      T(bx + bw + 110, by + 2 * step - 26, 'ORDINE', { f: 'mono', size: 26, fill: C.line, ls: 3, w: 700 }) + T(bx + bw + 110, by + 2 * step + 10, 'SCRITTO', { f: 'mono', size: 26, fill: C.line, ls: 3, w: 700 }));
    return s + caption(t, W("l'altra") - 0.4, "Una dopo l'altra", '');
  } }) });

// 4 — il semaforo come sequenza
function lightHousing(x, y, st) {
  return `<rect x="${x - 110}" y="${y}" width="220" height="540" rx="40" fill="${DIM()}" stroke="${st}" stroke-width="5"/>` +
    `<line x1="${x}" y1="${y + 540}" x2="${x}" y2="${y + 640}" stroke="${st}" stroke-width="6"/>`;
}
scene('semaforo', { tail: 1.0, make: (W) => ({
  capAt: W('rosso') + 0.05,
  render(t) {
    const x = 470, y = 130, lamps = [['ROSSO', 220], ['GIALLO', 400], ['VERDE', 580]];
    const on = t >= W('giallo') ? 1 : t >= W('verde') ? 2 : t >= W('rosso') ? 0 : -1;
    let g = lightHousing(x, y, C.line);
    lamps.forEach(([l, ly], i) => {
      g += `<circle cx="${x}" cy="${y + ly - 50}" r="70" fill="${on === i ? C.line : C.bg}" stroke="${C.line}" stroke-width="4"/>`;
      g += T(x - 150, y + ly - 40, l, { f: 'mono', size: 28, fill: C.line, a: 'end', ls: 3, w: on === i ? 700 : 500 });
    });
    let s = E(t, -0.4, g, { dy: 0 });
    const bx = 1020, by = 250, step = 130, seq = ['accendi rosso', 'accendi verde', 'accendi giallo'], tw0 = [W('rosso'), W('verde'), W('giallo')];
    seq.forEach((l, i) => s += E(t, tw0[i] - 0.15, block(bx, by + i * step, 560, l, { h: 100, size: 40 }), { dy: 10 }));
    if (on >= 0) {
      const k = [0, 2, 1].indexOf(on) < 0 ? 0 : { 0: 0, 2: 1, 1: 2 }[on];
      s += `<path d="M${bx - 110},${by + 50 + k * step - 24} l40,24 l-40,24 z" fill="${C.coral}"/>`;
    }
    s += E(t, W('sequenza'), lbl(bx + 280, by + 3 * step + 60, '= UNA SEQUENZA', { size: 30 }));
    return s + caption(t, W('rosso') + 0.05, 'Rosso, verde, giallo', '');
  } }) });

// 5 — incrocio immaginario: due sequenze da coordinare (chiaro)
scene('incrocio', { tail: 0.85, make: (W) => ({
  capAt: W('coordinare'),
  render(t, D) {
    const I = C.ink, tp = W('coordinare');
    let g = E(t, -0.4, card(150, 140, 1620, 700, { rot: 0.4 }), { dy: 0 });
    g += E(t, 0.0, pillTag(220, 225, 'ESEMPIO IMMAGINARIO', I, C.cream));
    // fasi (unità 8): A verde 0-3, giallo 3-4, rosso 4-8 ; B rosso 0-4, verde 4-7, giallo 7-8
    const U = 112, x0 = 900, rows = [['SEMAFORO A', [['VERDE', 0, 3], ['GIALLO', 3, 4], ['ROSSO', 4, 8]], 440], ['SEMAFORO B', [['ROSSO', 0, 4], ['VERDE', 4, 7], ['GIALLO', 7, 8]], 600]];
    const ph = t > tp ? ((t - tp) * 1.6) % 8 : 0;
    const stA = ph < 3 ? 'V' : ph < 4 ? 'G' : 'R', stB = ph < 4 ? 'R' : ph < 7 ? 'V' : 'G';
    // mappa dall'alto
    const mx = 540, my = 520;
    let m = `<rect x="${mx - 300}" y="${my - 60}" width="600" height="120" fill="${mix(C.cream, I, 0.06)}" stroke="none"/><rect x="${mx - 60}" y="${my - 230}" width="120" height="460" fill="${mix(C.cream, I, 0.06)}" stroke="none"/>`;
    m += poly([[mx - 300, my - 60], [mx - 60, my - 60], [mx - 60, my - 230]], I, 3) + poly([[mx + 60, my - 230], [mx + 60, my - 60], [mx + 300, my - 60]], I, 3);
    m += poly([[mx - 300, my + 60], [mx - 60, my + 60], [mx - 60, my + 230]], I, 3) + poly([[mx + 60, my + 230], [mx + 60, my + 60], [mx + 300, my + 60]], I, 3);
    const aOn = t > tp && stA === 'V', bOn = t > tp && stB === 'V';
    m += arrow(mx - 280, my, mx + 280, my, I, aOn ? 7 : 3) + arrow(mx, my + 210, mx, my - 210, I, bOn ? 7 : 3);
    m += T(mx - 280, my - 80, 'A', { f: 'pop', size: 44, fill: I }) + T(mx + 24, my + 220, 'B', { f: 'pop', size: 44, fill: I });
    m += `<circle cx="${mx}" cy="${my}" r="34" fill="none" stroke="${C.coral}" stroke-width="6"/>`;
    g += E(t, W('incrocio') - 0.1, m, { dy: 0 });
    rows.forEach(([name, segs, y], r) => {
      let row = T(x0, y - 50, name, { f: 'mono', size: 26, fill: I, ls: 3, w: 700 });
      segs.forEach(([l, a, b]) => {
        const v = l === 'VERDE';
        row += `<rect x="${x0 + a * U}" y="${y - 20}" width="${(b - a) * U}" height="74" fill="${v ? I : C.cream}" stroke="${I}" stroke-width="3"/>`;
        row += T(x0 + (a + b) / 2 * U, y + 27, l, { f: 'mono', size: 26, fill: v ? C.cream : I, a: 'middle', ls: 2, w: 700 });
      });
      g += E(t, (r ? W('due') : W('sequenze')) - 0.1, row, { dy: 12 });
    });
    if (t > tp) { const px = x0 + ph * U; g += E(t, tp, [440, 600].map(y => `<path d="M${px - 13},${y - 44} h26 l-13,20 z" fill="${I}"/><path d="M${px - 13},${y + 78} h26 l-13,-20 z" fill="${I}"/>`).join(''), { dy: 0 }); }
    g += E(t, W('verde') - 0.1, T(x0 + 4 * U, 770, 'MAI VERDE INSIEME', { f: 'mono', size: 30, fill: I, a: 'middle', ls: 4, w: 700 }));
    return lightBg() + push(g, t, D) + caption(t, W('coordinare'), 'Sequenze da coordinare', '', true);
  } }) });

// 6 — selezione: una biforcazione
scene('sel', { make: (W) => ({
  capAt: W('biforcazione'),
  render(t) {
    let s = words(t, W('selezione') - 0.15, 110, 330, 'Selezione', { f: 'pop', size: 110 });
    s += E(t, W('selezione') + 0.3, pillTag(114, 425, 'IF / ELSE', C.line, C.bg));
    s += E(t, W('reagire'), IT(114, 540, 'reagire in modo diverso', { size: 50 }) + IT(114, 600, 'a situazioni diverse', { size: 50 }));
    const cx = 1200, cy = 400, hw = 210, hh = 110, lx = 870, rx = 1530, by = 600;
    let g = poly([[cx, 150], [cx, cy - hh]], C.line, 4) + diamond(cx, cy, hw, hh, C.line, DIM()) + T(cx, cy + 10, 'CONDIZIONE?', { f: 'mono', size: 28, fill: C.line, a: 'middle', ls: 2, w: 700 });
    s += E(t, -0.4, g, { dy: 0 });
    const br = E(t, W('biforcazione') - 0.2,
      poly([[cx - hw, cy], [lx, cy], [lx, by]], C.line, 4) + poly([[cx + hw, cy], [rx, cy], [rx, by]], C.line, 4) +
      lbl(lx + 20, cy - 24, 'VERO', { size: 28, a: 'start' }) + lbl(rx - 20, cy - 24, 'FALSO', { size: 28, a: 'end' }) +
      block(lx - 150, by, 300, 'ramo A', { h: 90, size: 36 }) + block(rx - 150, by, 300, 'ramo B', { h: 90, size: 36 }), { dy: 0 });
    s += br;
    // gettone: entra, si ferma alla condizione, poi sceglie un ramo; al "reagire" riparte e prende l'altro
    const pathA = [[cx, 150], [cx, cy], [lx, cy], [lx, by - 28]], pathB = [[cx, 150], [cx, cy], [rx, cy], [rx, by - 28]];
    const run = (side, t0, tc) => { // t0: partenza, tc: scelta; il gettone gira sul bordo del rombo, non sulla scritta
      if (t < t0) return null;
      if (t < tc) return along([[cx, 150], [cx, cy - hh]], eio((t - t0) / Math.max(0.3, tc - t0 - 0.2)));
      const bx = side < 0 ? lx : rx;
      return along([[cx, cy - hh], [cx + side * hw, cy], [bx, cy], [bx, by - 28]], eio((t - tc) / 1.0));
    };
    let p = null;
    if (t < W('reagire') - 0.3) p = run(-1, W('controlla'), W('sceglie'));
    else p = run(1, W('reagire') - 0.3, W('situazioni'));
    if (p) s += token(p[0], p[1]);
    return s + caption(t, W('biforcazione'), 'Una biforcazione', '');
  } }) });

// 7 — nel quiz: se ... altrimenti (chiaro)
scene('quiz', { tail: 0.65, make: (W) => ({
  capAt: W('corretta'),
  render(t, D) {
    const I = C.ink, x = 250, y = 190, w = 1000;
    let g = E(t, -0.4, card(160, 140, 1600, 710, { rot: -0.4 }), { dy: 0 });
    const head = T(x + 28, y + 51, 'se', { f: 'popm', size: 34, fill: I }) +
      `<rect x="${x + 90}" y="${y + 14}" width="440" height="62" rx="31" fill="${C.cream}" stroke="${I}" stroke-width="3"/>` +
      T(x + 310, y + 56, 'risposta = corretta', { f: 'popm', size: 32, fill: I, a: 'middle' }) + T(x + 560, y + 51, 'allora', { f: 'popm', size: 34, fill: I });
    const armA = 200, armB = 200;
    g += E(t, W('se') - 0.1, cblock(x, y, w, head, [{ h: armA, label: 'altrimenti', bar: 70 }, { h: armB }], { st: I, fill: mix(C.cream, I, 0.06), hh: 90, tc: I, size: 34 }), { dy: 10 });
    const ia = y + 90 + 18, ib = y + 90 + armA + 70 + 18;
    g += E(t, W('aggiungi') - 0.1, block(x + 34, ia, 640, 'aggiungi 1 al punteggio', { h: 76, st: I, fill: C.cream, tc: I, size: 32 }), { dy: 8 });
    g += E(t, W('vai') - 0.1, block(x + 34, ia + 88, 640, 'vai alla prossima domanda', { h: 76, st: I, fill: C.cream, tc: I, size: 32 }), { dy: 8 });
    g += E(t, W('mostra') - 0.1, block(x + 34, ib, 640, 'mostra il feedback', { h: 76, st: I, fill: C.cream, tc: I, size: 32 }), { dy: 8 });
    g += E(t, W('riprova') - 0.1, block(x + 34, ib + 88, 640, 'riprova', { h: 76, st: I, fill: C.cream, tc: I, size: 32 }), { dy: 8 });
    g += E(t, W('avanti') - 0.1, T(x + 420, ib + 88 + 50, 'o vai avanti', { f: 'serif', it: true, size: 42, fill: I }));
    // evidenziazione corallo del ramo attivo (un solo contorno)
    const hiA = t >= W('corretta') && t < W('altrimenti') - 0.1, hiB = t >= W('altrimenti') - 0.1;
    if (hiA || hiB) {
      const yy = hiA ? ia - 10 : ib - 10;
      g += `<rect x="${x + 20}" y="${yy}" width="680" height="190" rx="14" fill="none" stroke="${C.coral}" stroke-width="6"/>`;
    }
    // stato della risposta, a destra
    const sx = 1300;
    if (t >= W('corretta') - 0.1) {
      const ok = !hiB;
      g += E(t, ok ? W('corretta') - 0.1 : W('altrimenti') - 0.1,
        T(sx, 360, 'RISPOSTA', { f: 'mono', size: 28, fill: I, ls: 4, w: 700 }) + T(sx, 450, ok ? 'corretta' : 'sbagliata', { f: 'pop', size: 76, fill: I }) +
        (ok ? `<path d="M${sx + 10},${560} l40,40 l80,-90" fill="none" stroke="${I}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`
          : `<path d="M${sx + 20},${520} l80,80 M${sx + 100},${520} l-80,80" fill="none" stroke="${I}" stroke-width="10" stroke-linecap="round"/>`), { dy: 10 });
    }
    g += E(t, W('dipende'), IT(sx, 700, 'dipende dal gioco', { fill: I, size: 46 }));
    return lightBg() + push(g, t, D) + caption(t, W('corretta'), 'Se corretta… altrimenti', '', true);
  } }) });

// 8 — iterazione: un blocco che si ripete
scene('iter', { make: (W) => ({
  capAt: W('blocco'),
  render(t) {
    let s = words(t, W("l'iterazione") - 0.15, 110, 330, 'Iterazione', { f: 'pop', size: 110 });
    s += E(t, W('ciclo'), IT(114, 420, 'o ciclo (loop)', { size: 54 }));
    const x = 1000, y = 200, w = 560;
    s += E(t, -0.4, cblock(x, y, w, 'ripeti', [{ h: 230 }], { hh: 90, size: 38 }) +
      block(x + 34, y + 90 + 16, 440, 'istruzione 1', { h: 86, size: 34 }) + block(x + 34, y + 90 + 120, 440, 'istruzione 2', { h: 86, size: 34 }), { dy: 0 });
    // percorso del gettone: giù lungo il braccio del ciclo, poi torna in cima (tratteggio)
    const LP = [[x + 18, y + 20], [x + 18, y + 400], [x + w + 70, y + 400], [x + w + 70, y - 40], [x + 18, y - 40], [x + 18, y + 20]];
    s += E(t, W('ripete') - 0.6, poly([[x + 18, y + 364], [x + 18, y + 400], [x + w + 70, y + 400], [x + w + 70, y - 40], [x + 60, y - 40]], C.line, 4, { dash: '4 12' }) +
      arrow(x + 70, y - 40, x + 22, y - 40, C.line, 4) + lbl(x + w + 100, y + 190, 'DI NUOVO', { a: 'start', size: 26 }), { dy: 0 });
    const t0 = W('blocco') - 0.2;
    if (t > t0) { const p = along(LP, ((t - t0) % 2.2) / 2.2); s += token(p[0], p[1]); }
    return s + caption(t, W('blocco'), 'Istruzioni che si ripetono', '');
  } }) });

// 9 — tre modi di ripetere (chiaro)
scene('modi', { make: (W) => ({
  capAt: W('sempre') - 0.1,
  render(t, D) {
    const I = C.ink, cols = [[190, W('numero') - 0.1, ['ripeti 10 volte'], 'NUMERO FISSO'], [740, W('finché') - 0.1, ['ripeti finché non hai', 'risposto a tutte', 'le domande'], 'CONDIZIONE'], [1290, W('sempre') - 0.15, ['ripeti sempre'], 'PER SEMPRE']];
    let g = E(t, -0.4, card(140, 150, 1640, 680, { rot: 0.4 }), { dy: 0 });
    cols.forEach(([x, t0, head, l], i) => {
      const hh = 36 * head.length + 54;
      const htxt = head.map((h, j) => T(x + 28, 190 + 62 + j * 36 + (head.length === 1 ? 4 : 0), h, { f: 'popm', size: head.length > 1 ? 28 : 34, fill: I })).join('');
      let c = T(x + 220, 220, l, { f: 'mono', size: 26, fill: I, a: 'middle', ls: 3, w: 700 });
      c += cblock(x, 260 - 20, 440, htxt.replace(/y="(\d+(\.\d+)?)"/g, (m, v) => `y="${+v + 20}"`), [{ h: 130 }], { st: I, fill: mix(C.cream, I, 0.06), hh, tc: I, ft: i === 2 ? 30 : 44 });
      c += block(x + 34, 240 + hh + 22, 340, 'istruzioni', { h: 80, st: I, fill: C.cream, tc: I, size: 32 });
      g += E(t, t0, c, { dy: 14 });
    });
    g += E(t, W('dieci'), IT(410, 670, 'per esempio 10', { fill: I, size: 42, a: 'middle' }));
    g += E(t, W('domande') - 0.2, IT(960, 670, 'tutte le domande del quiz', { fill: I, size: 42, a: 'middle' }));
    g += E(t, W('principale'), IT(1510, 670, 'il ciclo principale', { fill: I, size: 42, a: 'middle' }) + IT(1510, 720, 'di un videogioco', { fill: I, size: 42, a: 'middle' }));
    return lightBg() + push(g, t, D) + caption(t, W('sempre') - 0.1, 'Fisso, finché, per sempre', 'sempre', true);
  } }) });

// 10 — senza riscrivere mille volte
scene('mille', { tail: 0.95, make: (W) => ({
  capAt: W('riscrivere'),
  render(t) {
    let s = E(t, -0.3, lbl(480, 190, 'SENZA CICLO', { size: 28 }) + lbl(1380, 190, 'CON CICLO', { size: 28 }), { dy: 0 });
    for (let i = 0; i < 6; i++) {
      const op = 1;
      s += E(t, -0.2 + i * 0.12, `<g opacity="${op.toFixed(2)}">${block(260, 240 + i * 92, 440, 'istruzione', { h: 74, size: 32 })}</g>`, { dy: 8 });
    }
    s += E(t, W('mille') - 0.1, T(740, 690, '× 1000 volte', { f: 'pop', size: 56, fill: C.line }));
    s += E(t, 0.1, `<line x1="960" y1="230" x2="960" y2="790" stroke="${C.line}" stroke-width="2" stroke-dasharray="4 12"/>`, { dy: 0 });
    const x = 1110, y = 330;
    s += E(t, W('senza') - 0.2, cblock(x, y, 560, 'ripeti 1000 volte', [{ h: 120 }], { hh: 90, size: 36, outline: C.coral }) +
      block(x + 34, y + 90 + 18, 400, 'istruzione', { h: 80, size: 32 }), { dy: 12 });
    s += E(t, W('riscrivere') + 0.2, IT(1390, 700, 'scritta una volta sola', { a: 'middle', size: 46 }));
    return s + caption(t, W('riscrivere'), 'Senza riscrivere mille volte', '');
  } }) });

// 11 — sintesi: le tre strutture combinate
scene('sintesi', { tail: 0.5, make: (W) => ({
  capAt: W('combinandole'),
  render(t) {
    let s = '';
    // sequenza
    const sx = 170, sy = 300;
    s += E(t, -0.15, lbl(sx + 170, 220, 'SEQUENZA', { size: 28 }) + [0, 1, 2].map(i => block(sx, sy + i * 92, 340, 'istruzione', { h: 74, size: 30 })).join(''), { dy: 10 });
    // selezione
    const dx = 870, dy = 430;
    s += E(t, W('selezione') - 0.1, lbl(dx, 220, 'SELEZIONE', { size: 28 }) + diamond(dx, dy, 150, 90, C.line, DIM()) + T(dx, dy + 10, 'SE…?', { f: 'mono', size: 28, fill: C.line, a: 'middle', w: 700 }) +
      poly([[dx + 150, dy], [1260, dy]], C.line, 4) + poly([[dx, dy + 90], [dx, 640], [1260, 640]], C.line, 4) +
      lbl(dx + 205, dy - 18, 'VERO', { size: 24 }) + lbl(dx + 70, dy + 140, 'FALSO', { size: 24, a: 'start' }), { dy: 10 });
    // iterazione
    const lx = 1260, ly = 330;
    s += E(t, W('iterazione') - 0.1, lbl(lx + 230, 220, 'ITERAZIONE', { size: 28 }) + cblock(lx, ly, 470, 'ripeti', [{ h: 200 }], { hh: 80, size: 34 }) +
      block(lx + 34, ly + 80 + 16, 380, 'istruzione', { h: 74, size: 30 }) + block(lx + 34, ly + 80 + 102, 380, 'istruzione', { h: 74, size: 30 }), { dy: 10 });
    // collegamenti
    s += E(t, W('combinandole') - 0.2, arrow(sx + 360, sy + 130, dx - 165, dy, C.line, 4), { dy: 0 });
    const t0 = W('combinandole');
    if (t > t0) {
      const P = [[sx - 30, sy + 10], [sx - 30, sy + 230], [sx + 360, sy + 130], [dx, dy], [1240, dy], [1240, 640], [1260, 640]];
      const tot = 2.4, q = (t - t0) / tot;
      let p;
      if (q < 1) p = along(P.slice(0, 5), eio(q));
      else { const r = ((t - t0 - tot) % 1.4) / 1.4; p = along([[lx + 18, ly + 100], [lx + 18, ly + 300], [lx + 500, ly + 300], [lx + 500, ly + 40], [lx + 18, ly + 40], [lx + 18, ly + 100]], r); }
      s += token(p[0], p[1]);
    }
    s += E(t, W('qualsiasi'), IT(960, 800, '= qualsiasi programma', { a: 'middle', size: 52 }));
    return s + caption(t, W('combinandole'), 'Tre strutture combinate', '');
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Le tre strutture', { f: 'pop', size: 130, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('solo') - 0.1, 960, 560, 'Solo tre strutture, per qualsiasi programma.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'qualsiasi' });
    s += E(t, W('programma') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC DIG-2-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
