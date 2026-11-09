// Le tre strutture fondamentali — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

// ---- mondo: diagrammi di flusso a filo, un "cursore di esecuzione" che li percorre ----
const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.line, ls: o.ls ?? 3, a: o.a || 'middle', w: 600 });
function box(x, y, w, h, label, o = {}) {
  const c = o.c || C.line;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${o.fill || C.bg}" stroke="${c}" stroke-width="${o.sw || 3}"/>` +
    (label ? lbl(x + w / 2, y + h / 2 + 9, label, { fill: o.tc || C.line, size: o.size || 26, ls: o.ls ?? 2 }) : '');
}
function dia(cx, cy, w, h, label, o = {}) {
  const c = o.c || C.line;
  return `<path d="M${cx},${cy - h / 2} L${cx + w / 2},${cy} L${cx},${cy + h / 2} L${cx - w / 2},${cy} z" fill="${o.fill || C.bg}" stroke="${c}" stroke-width="${o.sw || 3}" stroke-linejoin="round"/>` +
    (label ? lbl(cx, cy + 9, label, { fill: o.tc || C.line, size: o.size || 24, ls: 2 }) : '');
}
// polilinea con freccia sull'ultimo tratto
function pl(pts, c = C.line, sw = 3, head = true) {
  let d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join(' ');
  let s = `<path d="${d}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (head) { const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]]; const an = Math.atan2(b[1] - a[1], b[0] - a[0]), h = 16;
    s += `<path d="M${b[0]},${b[1]} L${b[0] - h * Math.cos(an - 0.45)},${b[1] - h * Math.sin(an - 0.45)} L${b[0] - h * Math.cos(an + 0.45)},${b[1] - h * Math.sin(an + 0.45)} z" fill="${c}"/>`; }
  return s;
}
// punto lungo una polilinea, p 0..1
function along(pts, p) {
  const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  let r = clamp(p) * tot;
  for (let i = 0; i < seg.length; i++) { if (r <= seg[i] || i === seg.length - 1) { const q = seg[i] ? r / seg[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; } r -= seg[i]; }
}
function dot(x, y, c = C.coral, r = 14) { return `<circle cx="${x}" cy="${y}" r="${r + 7}" fill="none" stroke="${c}" stroke-width="3" opacity="0.5"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`; }
// icone delle tre strutture (riusate)
function icon(kind, cx, cy, k = 1, ink = C.line, bg = C.bg) {
  const B = (x, y) => box(cx + x * k - 50 * k, cy + y * k - 22 * k, 100 * k, 44 * k, '', { c: ink, fill: bg, sw: 3 });
  let s = '';
  if (kind === 'seq') {
    s += B(0, -110) + B(0, 0) + B(0, 110);
    s += pl([[cx, cy - 88 * k], [cx, cy - 24 * k]], ink) + pl([[cx, cy + 22 * k], [cx, cy + 86 * k]], ink);
  }
  if (kind === 'sel') {
    s += pl([[cx - 60 * k, cy - 100 * k], [cx - 110 * k, cy - 100 * k], [cx - 110 * k, cy - 22 * k]], ink) + pl([[cx + 60 * k, cy - 100 * k], [cx + 110 * k, cy - 100 * k], [cx + 110 * k, cy - 22 * k]], ink);
    s += dia(cx, cy - 100 * k, 120 * k, 76 * k, '', { c: ink, fill: bg }) + B(-110, 0) + B(110, 0);
    s += pl([[cx - 110 * k, cy + 22 * k], [cx - 110 * k, cy + 90 * k], [cx, cy + 90 * k], [cx, cy + 130 * k]], ink, 3, true) + pl([[cx + 110 * k, cy + 22 * k], [cx + 110 * k, cy + 90 * k], [cx, cy + 90 * k]], ink, 3, false);
  }
  if (kind === 'loop') {
    s += dia(cx, cy - 80 * k, 120 * k, 76 * k, '', { c: ink, fill: bg }) + B(0, 40);
    s += pl([[cx, cy - 42 * k], [cx, cy + 18 * k]], ink);
    s += pl([[cx, cy + 62 * k], [cx, cy + 100 * k], [cx - 110 * k, cy + 100 * k], [cx - 110 * k, cy - 80 * k], [cx - 60 * k, cy - 80 * k]], ink);
    s += pl([[cx + 60 * k, cy - 80 * k], [cx + 130 * k, cy - 80 * k]], ink);
  }
  return s;
}
// condizionatore stilizzato (acceso = flussi d'aria)
function ac(x, y, on, ink) {
  let s = `<rect x="${x}" y="${y}" width="150" height="60" rx="10" fill="none" stroke="${ink}" stroke-width="3"/>` +
    `<line x1="${x + 16}" y1="${y + 44}" x2="${x + 134}" y2="${y + 44}" stroke="${ink}" stroke-width="3"/>`;
  if (on) for (let i = 0; i < 3; i++) { const xx = x + 35 + i * 40; s += `<path d="M${xx},${y + 66} q-10,14 0,28 q10,14 0,28" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`; }
  else s += T(x + 75, y + 100, 'spento', { f: 'mono', size: 24, fill: ink, a: 'middle' });
  return s;
}

// 1 — aggancio: tre sole strutture
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('tre'),
  render(t) {
    let s = words(t, 0.3, 960, 190, 'Qualsiasi algoritmo…', { f: 'pop', size: 84, a: 'middle' });
    // il "programma complesso": una fitta griglia di blocchi, che si dissolve sulle tre strutture
    const out = 1 - eo((t - W('tre') + 0.3) / 0.5);
    if (out > 0) {
      let g = '';
      for (let r = 0; r < 5; r++) for (let c = 0; c < 12; c++) {
        const i = r * 12 + c, t0 = W('programma') + ((i * 37) % 60) * 0.03;
        const x = 270 + c * 118, y = 300 + r * 92;
        const sh = (i * 13) % 3;
        const el = sh === 0 ? box(x - 40, y - 20, 80, 40, '', { c: C.lineDim }) : sh === 1 ? dia(x, y, 76, 46, '', { c: C.lineDim }) : `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${C.lineDim}" stroke-width="3"/>`;
        g += E(t, t0, el, { d: 0.3, dy: 8 });
        if (c < 11) g += E(t, t0 + 0.1, `<line x1="${x + 44}" y1="${y}" x2="${x + 74}" y2="${y}" stroke="${C.lineDim}" stroke-width="2"/>`, { d: 0.3, dy: 0 });
      }
      s += `<g opacity="${out.toFixed(3)}">${g}</g>`;
    }
    ['seq', 'sel', 'loop'].forEach((k, i) => {
      const x = 560 + i * 400;
      s += E(t, W('tre') + i * 0.18, icon(k, x, 520, 1.25) + lbl(x, 760, String(i + 1), { size: 34 }));
    });
    return s + caption(t, W('tre'), 'Tre sole strutture', 'Tre');
  } }) });

// 2 — sequenza: una dopo l'altra
scene('seq', { make: (W) => ({
  capAt: W('una'),
  render(t) {
    let s = '';
    const n = 4, y0 = 200, h = 96, gap = 56, x = 760, w = 400;
    const t0 = W('eseguite'), t1 = W('scritte') + 0.2, step = (t1 - t0) / n;
    for (let i = 0; i < n; i++) {
      const y = y0 + i * (h + gap);
      const cur = t >= t0 + i * step && t < t0 + (i + 1) * step;
      const done = t >= t0 + (i + 1) * step;
      s += E(t, 0.05 + i * 0.12, box(x, y, w, h, 'ISTRUZIONE ' + (i + 1), { c: cur ? C.coral : C.line, sw: cur ? 5 : 3, fill: done ? mix(C.bg, C.line, 0.1) : C.bg, size: 30 }));
      if (done) s += E(t, t0 + (i + 1) * step, `<path d="M${x + w + 34},${y + h / 2} l14,14 l28,-30" fill="none" stroke="${C.line}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`, { d: 0.3, dy: 0 });
      if (i < n - 1) s += E(t, 0.1 + i * 0.12, pl([[960, y + h], [960, y + h + gap]]), { dy: 0 });
    }
    s += E(t, W("nell'ordine"), T(400, 430, 'nell’ordine', { f: 'serif', size: 52, it: true, a: 'middle' }) + T(400, 490, 'in cui sono scritte', { f: 'serif', size: 52, it: true, a: 'middle' }));
    return s + caption(t, W('una'), "Una dopo l'altra");
  } }) });

// 3 — esempio: sommare due numeri
scene('somma', { make: (W) => ({
  capAt: W('in'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(330, 150, 1260, 690, { rot: -1 }), { dy: 0 });
    g += E(t, 0.1, T(420, 250, 'SOMMARE DUE NUMERI', { f: 'mono', size: 30, fill: C.ink, ls: 4, w: 700 }));
    const rows = [['leggi', 0, 'leggi il primo numero'], ['leggi', 1, 'leggi il secondo numero'], ['somma', 0, 'somma'], ['mostra', 0, 'mostra il risultato']];
    rows.forEach(([w, n, txt], i) => {
      const y = 360 + i * 115;
      g += E(t, W(w, n) - 0.05, `<circle cx="540" cy="${y - 18}" r="36" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>` + T(540, y - 6, String(i + 1), { f: 'pop', size: 38, fill: C.ink, a: 'middle' }) +
        T(610, y, txt, { f: 'popm', size: 52, fill: C.ink }));
    });
    const p = eo((t - W('in')) / 0.8);
    if (p > 0) g += pl([[440, 340], [440, 340 + 360 * p]], C.ink, 5, p > 0.15);
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('in'), "In quell'ordine. Sempre.", 'Sempre', true);
  } }) });

// 4 — selezione: vera o falsa
scene('sel', { make: (W) => ({
  capAt: W('vera'),
  render(t) {
    let s = '';
    const tv = W('vera'), tf = W('falsa');
    const actA = t >= tv && t < tf, actB = t >= tf;
    s += E(t, 0.05, pl([[960, 150], [960, 222]]) + dia(960, 320, 440, 196, 'CONDIZIONE?', { size: 28 }));
    const brA = [[740, 320], [560, 320], [560, 548]], brB = [[1180, 320], [1360, 320], [1360, 548]];
    s += E(t, tv - 0.15, pl(brA, actA ? C.coral : C.line, actA ? 5 : 3) + lbl(650, 296, 'VERA', { fill: actA ? C.coral : C.line }) +
      box(410, 550, 300, 100, 'BLOCCO A', { c: actA ? C.coral : C.line, sw: actA ? 5 : 3, size: 30 }));
    s += E(t, tf - 0.15, pl(brB, actB ? C.coral : C.line, actB ? 5 : 3) + lbl(1270, 296, 'FALSA', { fill: actB ? C.coral : C.line }) +
      box(1210, 550, 300, 100, 'BLOCCO B', { c: actB ? C.coral : C.line, sw: actB ? 5 : 3, size: 30 }));
    s += E(t, tv + 0.2, pl([[560, 650], [560, 770], [960, 770], [960, 840]]), { dy: 0 });
    s += E(t, tf + 0.2, pl([[1360, 650], [1360, 770], [960, 770]], C.line, 3, false), { dy: 0 });
    s += E(t, W('niente'), T(1540, 616, '(o niente)', { f: 'serif', size: 46, it: true }));
    return s + caption(t, W('vera'), 'Vera o falsa?');
  } }) });

// 5 — esempio: il condizionatore
scene('clima', { make: (W) => ({
  capAt: W('sopra'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(250, 170, 1420, 660, { rot: 1 }), { dy: 0 });
    g += E(t, 0.1, T(340, 270, 'ESEMPIO', { f: 'mono', size: 28, fill: C.ink, ls: 4, w: 700 }));
    const kw = (x, y, s2) => T(x, y, s2, { f: 'mono', size: 44, fill: C.ink, w: 700, ls: 2 });
    g += E(t, W('se') - 0.05, kw(340, 400, 'SE') + T(440, 400, 'la temperatura è sopra i', { f: 'popm', size: 48, fill: C.ink }));
    g += E(t, W('trenta') - 0.05, T(1040, 400, '30 °C', { f: 'pop', size: 56, fill: C.coralDk }));
    g += E(t, W('accendi') - 0.05, kw(400, 540, 'ALLORA') + T(600, 540, 'accendi il condizionatore', { f: 'popm', size: 48, fill: C.ink }) + ac(1340, 470, true, C.ink));
    g += E(t, W('altrimenti') - 0.05, kw(340, 700, 'ALTRIMENTI') + T(640, 700, 'lascialo spento', { f: 'popm', size: 48, fill: C.ink }) + ac(1340, 630, false, C.ink));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('sopra'), 'Sopra i 30 °C?', '', true);
  } }) });

// 6 — la condizione deve essere oggettiva
scene('cond', { tail: 0.5, make: (W) => ({
  capAt: W('misura'),
  render(t) {
    let s = '';
    s += E(t, 0.05, lbl(960, 190, 'LA CONDIZIONE', { size: 30, ls: 5 }));
    s += words(t, W('verificabile') - 0.1, 960, 270, 'verificabile in modo oggettivo', { f: 'serif', size: 62, it: true, a: 'middle' });
    // a sinistra: "se fa caldo"
    const lx = 520;
    s += E(t, W('se') - 0.05, `<rect x="${lx - 270}" y="380" width="540" height="130" rx="20" fill="${C.bg}" stroke="${C.line}" stroke-width="3" stroke-dasharray="10 10"/>` +
      T(lx, 466, '«se fa caldo»', { f: 'serif', size: 64, it: true, a: 'middle' }));
    s += E(t, W('ambiguo') - 0.1, T(lx, 640, '?', { f: 'pop', size: 140, a: 'middle', fill: C.line }) + lbl(lx, 720, 'AMBIGUO', { size: 30 }));
    // a destra: "se supera 30 °C" + termometro a filo
    const rx = 1250;
    s += E(t, W('se', 1) - 0.05, `<rect x="${rx - 300}" y="380" width="600" height="130" rx="20" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` +
      T(rx, 466, '«se supera 30 °C»', { f: 'serif', size: 64, it: true, a: 'middle' }));
    const tx = 1660, top = 380, bot = 700, vy = v => bot - (v / 40) * (bot - top - 20);
    s += E(t, W('se', 1), `<rect x="${tx - 18}" y="${top}" width="36" height="${bot - top + 10}" rx="18" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` +
      `<circle cx="${tx}" cy="${bot + 34}" r="34" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` +
      [0, 10, 20, 40].map(v => `<line x1="${tx + 24}" y1="${vy(v)}" x2="${tx + 40}" y2="${vy(v)}" stroke="${C.line}" stroke-width="2"/>`).join(''));
    s += E(t, W('trenta'), `<line x1="${tx - 40}" y1="${vy(30)}" x2="${tx + 50}" y2="${vy(30)}" stroke="${C.coral}" stroke-width="6" stroke-linecap="round"/>` +
      T(tx + 64, vy(30) + 10, '30 °C', { f: 'mono', size: 30, fill: C.coral, w: 700 }), { dy: 0 });
    s += E(t, W('misura') - 0.1, lbl(rx, 640, 'VERO', { size: 34 }) + T(rx, 690, 'oppure', { f: 'serif', size: 40, it: true, a: 'middle' }) + lbl(rx, 740, 'FALSO', { size: 34 }));
    return s + caption(t, W('misura'), 'Una misura precisa');
  } }) });

// 7 — iterazione: il ciclo
scene('ciclo', { make: (W) => ({
  capAt: W('finché'),
  render(t) {
    let s = '';
    const cx = 900, dy = 330;
    s += E(t, 0.05, pl([[cx, 150], [cx, 222]]) + dia(cx, dy, 440, 196, 'CONDIZIONE?', { size: 28 }));
    s += E(t, 0.2, pl([[cx, dy + 98], [cx, 560]]) + lbl(cx + 24, 500, 'VERA', { a: 'start' }) + box(cx - 230, 562, 460, 110, 'BLOCCO DI ISTRUZIONI', { size: 28 }));
    const loop = [[cx, 672], [cx, 760], [cx - 420, 760], [cx - 420, dy], [cx - 222, dy]];
    s += E(t, W('ripetuto') - 0.2, pl(loop), { dy: 0 });
    s += E(t, 0.35, pl([[cx + 220, dy], [cx + 470, dy]]) + lbl(cx + 345, dy - 24, 'FALSA') + lbl(cx + 490, dy + 9, 'ESCI', { a: 'start' }));
    // cursore che gira nel ciclo
    if (t > W('ripetuto')) {
      const path = [[cx, dy + 98], [cx, 562], [cx, 672], ...loop.slice(1), [cx - 222, dy], [cx, dy + 98]];
      const ph = ((t - W('ripetuto')) / 2.2) % 1;
      const [x, y] = along([[cx, dy + 98], [cx, 672], [cx, 760], [cx - 420, 760], [cx - 420, dy], [cx - 222, dy]], ph);
      s += dot(x, y);
    }
    s += E(t, W('numero'), T(1340, 640, 'oppure', { f: 'serif', size: 44, it: true, a: 'middle' }) + T(1340, 700, 'per un numero', { f: 'serif', size: 52, it: true, a: 'middle' }) + T(1340, 760, 'fisso di volte', { f: 'serif', size: 52, it: true, a: 'middle' }));
    return s + caption(t, W('finché'), 'Finché rimane vera');
  } }) });

// 8 — esempio: i messaggi non letti
scene('msg', { tail: 1.2, make: (W) => ({
  capAt: W('messaggi'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(250, 140, 1420, 720, { rot: -1 }), { dy: 0 });
    g += E(t, 0.1, T(1590, 220, 'ESEMPIO', { f: 'mono', size: 28, fill: C.ink, ls: 4, w: 700, a: 'end' }));
    g += E(t, W('finché') - 0.05, T(330, 230, 'FINCHÉ', { f: 'mono', size: 40, fill: C.ink, w: 700, ls: 2 }) + T(520, 230, 'ci sono messaggi non letti', { f: 'popm', size: 44, fill: C.ink }));
    g += E(t, W('leggi') - 0.05, T(400, 310, 'leggi il prossimo e segnalo come letto', { f: 'popm', size: 44, fill: C.ink }));
    const t0 = W('leggi') + 0.1, st = 0.35;
    for (let i = 0; i < 4; i++) {
      const y = 380 + i * 110, read = t >= t0 + (i + 1) * st, cur = t >= t0 + i * st && !read;
      let r = `<rect x="400" y="${y}" width="1000" height="88" rx="14" fill="${C.cream}" stroke="${cur ? C.coral : C.ink}" stroke-width="${cur ? 6 : 3}"/>`;
      r += `<rect x="440" y="${y + 22}" width="64" height="44" rx="4" fill="none" stroke="${C.ink}" stroke-width="3"/><path d="M440,${y + 24} L472,${y + 48} L504,${y + 24}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
      r += `<rect x="540" y="${y + 26}" width="${360 - i * 40}" height="14" rx="7" fill="${C.ink}" opacity="${read ? 0.35 : 0.8}"/><rect x="540" y="${y + 52}" width="${520 - i * 30}" height="12" rx="6" fill="${C.ink}" opacity="0.3"/>`;
      r += read ? T(1330, y + 56, 'letto', { f: 'mono', size: 26, fill: C.ink, a: 'middle' }) : `<circle cx="1330" cy="${y + 44}" r="14" fill="${C.ink}"/>`;
      g += E(t, W('messaggi') - 0.1 + i * 0.08, r, { dy: 10 });
    }
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('messaggi'), 'Messaggi non letti', '', true);
  } }) });

// 9 — tutto si costruisce combinando le tre strutture
scene('combina', { make: (W) => ({
  capAt: W('combinando'),
  render(t) {
    let s = '';
    const y = 520;
    s += E(t, W('calcolatore') - 0.1, `<rect x="160" y="180" width="460" height="64" rx="32" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` + T(390, 222, 'semplice calcolatore', { f: 'mono', size: 28, a: 'middle' }));
    s += E(t, W('generativa') - 0.1, `<rect x="1080" y="180" width="680" height="64" rx="32" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` + T(1420, 222, 'intelligenza artificiale generativa', { f: 'mono', size: 28, a: 'middle' }));
    // diagramma composto, costruito da sinistra a destra
    let a = box(140, y - 40, 180, 80, '') + pl([[320, y], [400, y]]);
    let b = dia(500, y, 200, 130, '') + pl([[500, y - 65], [500, y - 120], [640, y - 120]]) + pl([[500, y + 65], [500, y + 120], [640, y + 120]]) +
      box(640, y - 155, 180, 70, '') + box(640, y + 85, 180, 70, '') + pl([[820, y - 120], [900, y - 120], [900, y + 120], [820, y + 120]], C.line, 3, false) + pl([[900, y], [945, y], [945, y - 120], [1130, y - 120], [1130, y - 67]]);
    let c = dia(1130, y, 200, 130, '') + pl([[1130, y + 65], [1130, y + 120]]) + box(1040, y + 122, 180, 70, '') +
      pl([[1040, y + 157], [985, y + 157], [985, y], [1028, y]]) + pl([[1230, y], [1440, y]]);
    let d = box(1440, y - 40, 180, 80, '') + pl([[1620, y], [1700, y]]);
    s += E(t, 0.05, a + d, { dy: 0 });
    s += E(t, 0.3, b, { dy: 0 });
    s += E(t, 0.55, c, { dy: 0 });
    // etichette dei gruppi
    const tag = (x1, x2, yy, txt) => `<line x1="${x1}" y1="${yy}" x2="${x2}" y2="${yy}" stroke="${C.line}" stroke-width="3"/><line x1="${x1}" y1="${yy - 12}" x2="${x1}" y2="${yy}" stroke="${C.line}" stroke-width="3"/><line x1="${x2}" y1="${yy - 12}" x2="${x2}" y2="${yy}" stroke="${C.line}" stroke-width="3"/>` + lbl((x1 + x2) / 2, yy + 44, txt);
    const tc = W('combinando');
    s += E(t, tc - 0.1, tag(140, 320, 740, 'SEQUENZA'));
    s += E(t, tc + 0.15, tag(400, 925, 740, 'SELEZIONE'));
    s += E(t, tc + 0.4, tag(965, 1260, 740, 'ITERAZIONE'));
    return s + caption(t, W('combinando'), 'Combinando tre strutture', 'tre');
  } }) });

// 10 — il teorema
scene('teorema', { make: (W) => ({
  capAt: W('teorema'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(360, 150, 1200, 680, { rot: 1 }), { dy: 0 });
    g += E(t, W('dimostrato') - 0.05, T(960, 280, 'DIMOSTRATO NEL', { f: 'mono', size: 32, fill: C.ink, a: 'middle', ls: 5, w: 700 }));
    g += E(t, W('1966') - 0.05, T(960, 470, '1966', { f: 'pop', size: 200, fill: C.coralDk, a: 'middle' }));
    g += E(t, W('corrado') - 0.05, T(960, 580, 'Corrado Böhm', { f: 'popm', size: 52, fill: C.ink, a: 'middle' }));
    g += E(t, W('giuseppe') - 0.05, T(960, 650, 'Giuseppe Jacopini', { f: 'popm', size: 52, fill: C.ink, a: 'middle' }));
    ['seq', 'sel', 'loop'].forEach((kk, i) => g += E(t, W('teorema') + i * 0.12, `<g transform="translate(${[560, 960, 1360][i]},740) scale(0.42) translate(${-[560, 960, 1360][i]},-740)">${icon(kk, [560, 960, 1360][i], 740, 1, C.ink, C.cream)}</g>`));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('teorema'), 'Teorema di Böhm-Jacopini', '', true);
  } }) });

// 11 — chiusura
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Le tre strutture', { f: 'pop', size: 150, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('sequenza') - 0.1, 960, 550, 'sequenza, selezione, iterazione', { f: 'serif', size: 70, fill: C.ink, a: 'middle', it: true, key: 'iterazione' });
    s += E(t, W('strutture') + 0.2, `<line x1="760" y1="630" x2="1160" y2="630" stroke="${C.ink}" stroke-width="3"/>` + T(960, 690, 'PROFTECNOLOGIA · MC INF-1-02', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5 }));
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
