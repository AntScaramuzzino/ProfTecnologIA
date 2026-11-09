// Quattro funzioni, un sistema — MC-INF-2-01 §"Le funzioni principali del sistema operativo". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.5);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const lblI = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.ink, ls: 3, a: o.a || 'middle', w: 700 });

// ---- mondo: componenti del computer in sezione, a filo chiaro ----
function chip(cx, cy, sz, st, fill) {
  let g = `<rect x="${cx - sz / 2}" y="${cy - sz / 2}" width="${sz}" height="${sz}" rx="${sz * 0.07}" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<rect x="${cx - sz * 0.27}" y="${cy - sz * 0.27}" width="${sz * 0.54}" height="${sz * 0.54}" rx="6" fill="none" stroke="${st}" stroke-width="3"/>`;
  for (let i = 0; i < 5; i++) {
    const p = -sz / 2 + sz * (i + 0.5) / 5, l = sz * 0.15;
    g += `<path d="M${cx + p},${cy - sz / 2} v${-l} M${cx + p},${cy + sz / 2} v${l} M${cx - sz / 2},${cy + p} h${-l} M${cx + sz / 2},${cy + p} h${l}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return g;
}
function ramSmall(cx, cy, w, st, fill) { // banco di RAM piccolo (icona)
  const h = w * 0.36, x = cx - w / 2, y = cy - h / 2;
  let g = `<path d="M${x},${y} h${w} v${h} h${-w * 0.42} v${-h * 0.14} h${-w * 0.08} v${h * 0.14} h${-w * 0.5} z" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 0; i < 4; i++) g += `<rect x="${x + w * (0.07 + i * 0.23)}" y="${y + h * 0.2}" width="${w * 0.17}" height="${h * 0.42}" rx="3" fill="none" stroke="${st}" stroke-width="3"/>`;
  return g;
}
function folder(x, y, w, st, fill, sw = 4) {
  const h = w * 0.72;
  return `<path d="M${x},${y + h * 0.16} v${h * 0.84} h${w} v${-h * 0.74} h${-w * 0.52} l${-w * 0.1},${-h * 0.1} h${-w * 0.38} z" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>` +
    `<line x1="${x}" y1="${y + h * 0.3}" x2="${x + w}" y2="${y + h * 0.3}" stroke="${st}" stroke-width="${sw * 0.7}"/>`;
}
function fileIcon(x, y, w, st, fill, sw = 4) {
  const h = w * 1.3, f = w * 0.3;
  let g = `<path d="M${x},${y} h${w - f} l${f},${f} v${h - f} h${-w} z" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M${x + w - f},${y} v${f} h${f}" fill="none" stroke="${st}" stroke-width="${sw * 0.7}"/>`;
  for (let i = 0; i < 3; i++) g += `<line x1="${x + w * 0.18}" y1="${y + h * (0.45 + i * 0.16)}" x2="${x + w * (i === 2 ? 0.55 : 0.82)}" y2="${y + h * (0.45 + i * 0.16)}" stroke="${st}" stroke-width="${sw * 0.7}" stroke-linecap="round"/>`;
  return g;
}
function plug(cx, cy, s, st, fill) { // spina generica di periferica
  return `<rect x="${cx - 34 * s}" y="${cy - 30 * s}" width="${68 * s}" height="${60 * s}" rx="${10 * s}" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<path d="M${cx - 16 * s},${cy - 30 * s} v${-26 * s} M${cx + 16 * s},${cy - 30 * s} v${-26 * s} M${cx},${cy + 30 * s} v${36 * s}" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
}
function appWin(x, y, w, h, st, fill, sw = 4) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>` +
    `<line x1="${x}" y1="${y + 36}" x2="${x + w}" y2="${y + 36}" stroke="${st}" stroke-width="${sw * 0.75}"/>` +
    [0, 1, 2].map(i => `<circle cx="${x + 22 + i * 20}" cy="${y + 18}" r="5" fill="${st}"/>`).join('');
}
function printer(cx, cy, s, st, fill) {
  return `<rect x="${cx - 40 * s}" y="${cy - 52 * s}" width="${80 * s}" height="${34 * s}" fill="${fill}" stroke="${st}" stroke-width="4"/>` +
    `<rect x="${cx - 70 * s}" y="${cy - 20 * s}" width="${140 * s}" height="${62 * s}" rx="${10 * s}" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<rect x="${cx - 44 * s}" y="${cy + 20 * s}" width="${88 * s}" height="${44 * s}" fill="${fill}" stroke="${st}" stroke-width="4"/><circle cx="${cx + 48 * s}" cy="${cy}" r="${6 * s}" fill="${st}"/>`;
}
function keyboard(cx, cy, s, st, fill) {
  let g = `<rect x="${cx - 86 * s}" y="${cy - 34 * s}" width="${172 * s}" height="${68 * s}" rx="${10 * s}" fill="${fill}" stroke="${st}" stroke-width="5"/>`;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) g += `<rect x="${cx - 72 * s + c * 24 * s}" y="${cy - 22 * s + r * 20 * s}" width="${18 * s}" height="${14 * s}" rx="2" fill="none" stroke="${st}" stroke-width="2.5"/>`;
  return g + `<line x1="${cx - 44 * s}" y1="${cy + 22 * s}" x2="${cx + 44 * s}" y2="${cy + 22 * s}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`;
}
function mouse(cx, cy, s, st, fill) {
  return `<rect x="${cx - 34 * s}" y="${cy - 50 * s}" width="${68 * s}" height="${100 * s}" rx="${34 * s}" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<path d="M${cx - 34 * s},${cy - 8 * s} h${68 * s} M${cx},${cy - 50 * s} v${42 * s}" stroke="${st}" stroke-width="3.5"/>`;
}
function glyph(k, cx, cy, st) { // "linguaggi" diversi: forme astratte
  if (k === 0) return `<path d="M${cx - 30},${cy + 10} l15,-22 l15,22 l15,-22 l15,22" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (k === 1) return `<path d="M${cx - 30},${cy + 10} v-20 h15 v20 h15 v-20 h15 v20 h15" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (k === 2) return [0, 1, 2].map(i => `<rect x="${cx - 28 + i * 22}" y="${cy - 8}" width="12" height="${i === 1 ? 24 : 12}" fill="${st}"/>`).join('');
  return [0, 1, 2].map(i => `<circle cx="${cx - 22 + i * 22}" cy="${cy}" r="7" fill="${st}"/>`).join(''); // linguaggio standard
}
function pauseIcon(cx, cy, r, c) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/><rect x="${cx - r * 0.38}" y="${cy - r * 0.42}" width="${r * 0.24}" height="${r * 0.84}" fill="${C.bg}"/><rect x="${cx + r * 0.14}" y="${cy - r * 0.42}" width="${r * 0.24}" height="${r * 0.84}" fill="${C.bg}"/>`;
}
function note(cx, cy, s, st) {
  return `<ellipse cx="${cx - 10 * s}" cy="${cy + 16 * s}" rx="${11 * s}" ry="${8 * s}" fill="${st}"/><path d="M${cx},${cy + 16 * s} V${cy - 22 * s} l${18 * s},${8 * s}" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// 1 — quattro funzioni
scene('intro', { make: (W) => ({
  capAt: W('quattro'), last: W('periferiche'),
  render(t) {
    let s = E(t, -0.4, `<rect x="560" y="200" width="800" height="150" rx="22" fill="${C.bg}" stroke="${C.coral}" stroke-width="7"/>` +
      T(960, 296, 'Sistema operativo', { f: 'pop', size: 66, a: 'middle' }), { dy: 0 });
    const it = [['PROCESSI', 'processi', 390], ['MEMORIA', 'memoria', 770], ['FILE SYSTEM', 'file', 1150], ['PERIFERICHE', 'periferiche', 1530]];
    it.forEach(([lab, w, x], i) => {
      const t0 = W(w) - 0.1, y = 640, st = C.line;
      s += E(t, t0 - 0.1, `<path d="M${960 + (i - 1.5) * 120},350 C${960 + (i - 1.5) * 120},460 ${x},440 ${x},545" fill="none" stroke="${C.lineDim}" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round"/>`, { dy: 0, blur: 0 });
      let ic = '';
      if (i === 0) ic = chip(x, y, 120, st, DIM());
      if (i === 1) ic = ramSmall(x, y, 200, st, DIM());
      if (i === 2) ic = folder(x - 70, y - 50, 140, st, DIM(), 5);
      if (i === 3) ic = plug(x, y + 6, 1.15, st, DIM());
      s += pop(t, t0, x, y, ic) + E(t, t0 + 0.05, lbl(x, 790, lab), { dy: 10 });
    });
    return s + caption(t, W('quattro'), 'Quattro funzioni fondamentali', '');
  } }) });

// 2 — il processo: programma in esecuzione
scene('processo', { make: (W) => ({
  capAt: W('esecuzione'), last: W('chiudi') + 0.3,
  render(t) {
    let s = words(t, 0.0, 96, 270, 'Un processo', { f: 'pop', size: 96 });
    s += E(t, W('programma') - 0.1, IT(100, 350, 'è un programma in esecuzione', { size: 54 }));
    const closed = t > W('chiudi') - 0.05;
    s += E(t, -0.3, appWin(220, 470, 340, 250, C.line, DIM()) + lbl(390, 790, closed ? 'APP CHIUSA' : "UN'APP"), { dy: 0 });
    if (!closed && t > W('apri') - 0.1) s += E(t, W('apri') - 0.1, `<path d="M${270},${560} h240 M${270},${610} h180 M${270},${660} h210" stroke="${C.line}" stroke-width="8" stroke-linecap="round" opacity="0.8"/>`, { dy: 0 });
    if (closed) s += `<path d="M330,560 l120,110 M450,560 l-120,110" stroke="${C.line}" stroke-width="9" stroke-linecap="round"/>`;
    // pannello processi attivi
    s += E(t, -0.2, `<rect x="900" y="200" width="860" height="620" rx="18" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>` + lbl(940, 262, 'PROCESSI ATTIVI', { a: 'start' }) +
      `<line x1="900" y1="290" x2="1760" y2="290" stroke="${C.line}" stroke-width="3"/>`, { dy: 0 });
    const row = (y, txt, st, fill, sw) => `<rect x="940" y="${y}" width="780" height="100" rx="12" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>` + T(980, y + 62, txt, { f: 'mono', size: 28, fill: C.line, ls: 2, w: 700 });
    s += E(t, -0.2, row(320, 'PROCESSO 1', C.line, DIM(), 3) + row(440, 'PROCESSO 2', C.line, DIM(), 3), { dy: 0 });
    const tc = W('crea') - 0.1, tk = W('chiudi') + 0.25;
    if (t < tk) s += E(t, tc, row(560, 'PROCESSO 3', C.coral, C.bg, 6) + lbl(1700, 622, 'CREATO', { a: 'end' }), { dy: 16 });
    else {
      const p = eo((t - tk) / 0.5);
      s += `<g opacity="${(1 - 0.55 * p).toFixed(3)}">${row(560, 'PROCESSO 3', C.line, C.bg, 3)}</g>` +
        `<line x1="970" y1="610" x2="${970 + 260 * p}" y2="610" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/>` + E(t, tk, lbl(1700, 622, 'TERMINATO', { a: 'end' }), { dy: 0 });
    }
    s += E(t, tc, arrow(590, 600, 900, 610, C.line, 5), { dy: 0 });
    return s + caption(t, W('esecuzione'), 'Programma in esecuzione', '');
  } }) });

// 3 — un processo alla volta, brevi frazioni di tempo (registro chiaro)
scene('tempo', { make: (W) => ({
  capAt: W('brevi'), last: W('millisecondi'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += E(t, -0.3, chip(410, 430, 190, ink, C.ivory) + lblI(410, 640, 'UN NUCLEO (CORE)'), { dy: 0 });
    s += E(t, W('solo') - 0.1, T(410, 712, 'un processo alla volta', { f: 'serif', it: true, size: 46, fill: ink, a: 'middle' }), { dy: 10 });
    const x0 = 800, x1 = 1680, rows = ['A', 'B', 'C'], ry = [360, 470, 580], sw = 58;
    s += E(t, -0.2, lblI(x0, 250, 'PROCESSI', { a: 'start' }) + pillTag(1580, 800, 'SCHEMA', ink, C.ivory, 'middle') +
      rows.map((r, i) => T(x0 - 40, ry[i] + 14, r, { f: 'pop', size: 40, fill: ink, a: 'middle' }) + `<line x1="${x0}" y1="${ry[i] + 30}" x2="${x1}" y2="${ry[i] + 30}" stroke="${ink}" stroke-width="2" opacity="0.35"/>`).join('') +
      arrow(x0, 680, x1, 680, ink, 4) + lblI(x1, 730, 'TEMPO', { a: 'end' }), { dy: 0 });
    // fette di tempo: A, B, C, A, B, C... una sola attiva alla volta
    const t0 = W('ricevono'), dt = 0.36, n = Math.floor((x1 - x0) / (sw + 2));
    for (let k = 0; k < n; k++) {
      const ts = t0 + k * dt; if (t < ts) break;
      const r = k % 3, x = x0 + k * (sw + 2), act = t < ts + dt;
      const grow = eo((t - ts) / 0.12);
      s += `<rect x="${x}" y="${ry[r] - 30}" width="${(sw * grow).toFixed(1)}" height="60" rx="6" fill="${act ? C.coral : mix(C.ivory, ink, 0.25)}" stroke="${ink}" stroke-width="2.5"/>`;
    }
    // graffa su una fetta: ogni pochi millisecondi
    const kb = 3, xb = x0 + kb * (sw + 2);
    s += E(t, W('millisecondi') - 0.1, `<path d="M${xb},${ry[0] - 38} v-12 h${sw} v12" fill="none" stroke="${ink}" stroke-width="4"/>` +
      T(xb + sw + 20, ry[0] - 42, 'pochi millisecondi', { f: 'serif', it: true, size: 44, fill: ink }), { dy: 0 });
    return s + caption(t, W('brevi'), 'Brevi frazioni di tempo', '', true);
  } }) });

// 4 — multitasking e priorità
scene('multi', { make: (W) => ({
  capAt: W('multitasking'), last: W('meno'),
  render(t) {
    let s = E(t, -0.3, lbl(500, 240, 'MULTITASKING'), { dy: 0 });
    [[170, 300], [330, 400], [490, 500]].forEach(([x, y], i) => {
      s += E(t, -0.3 + i * 0.1, appWin(x, y, 340, 220, C.line, C.bg), { dy: 0 });
      const p = ((t * 0.55 + i * 0.37) % 1);
      s += E(t, -0.3 + i * 0.1, `<rect x="${x + 30}" y="${y + 120}" width="280" height="26" rx="13" fill="none" stroke="${C.line}" stroke-width="3"/><rect x="${x + 30}" y="${y + 120}" width="${(280 * p).toFixed(1)}" height="26" rx="13" fill="${C.line}"/>`, { dy: 0 });
    });
    s += E(t, W('simultaneo') - 0.1, IT(500, 800, 'sembra simultaneo', { a: 'middle', size: 52 }));
    // priorità
    s += E(t, W('priorità') - 0.15, lbl(1010, 250, 'PRIORITÀ', { a: 'start' }) +
      `<rect x="1000" y="290" width="780" height="130" rx="14" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/>` +
      T(1040, 345, 'PROCESSO DI SISTEMA', { f: 'mono', size: 28, ls: 2, w: 700 }) + T(1040, 392, 'critico', { f: 'serif', it: true, size: 40 }) +
      arrow(1700, 395, 1700, 315, C.line, 6) + lbl(1640, 372, 'PIÙ', { a: 'end' }), { dy: 12 });
    s += E(t, W('background') - 0.15, `<rect x="1000" y="460" width="780" height="130" rx="14" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>` +
      T(1040, 515, "UN'APP", { f: 'mono', size: 28, ls: 2, w: 700 }) + T(1040, 562, 'in background', { f: 'serif', it: true, size: 40 }), { dy: 12 });
    // tempo di CPU: la barra dell'app in background si accorcia
    const sh = eo((t - W('meno') + 0.05) / 0.6), bw = lerp(300, 110, sh);
    s += E(t, W('background') - 0.15, lbl(1440, 498, 'TEMPO CPU', { a: 'start', size: 24 }) + `<rect x="1440" y="520" width="300" height="34" rx="8" fill="none" stroke="${C.line}" stroke-width="3"/>` +
      `<rect x="1440" y="520" width="${bw.toFixed(1)}" height="34" rx="8" fill="${sh > 0 ? C.coral : C.line}"/>`, { dy: 0 });
    s += E(t, W('meno') - 0.05, lbl(1740, 620, 'MENO TEMPO', { a: 'end' }), { dy: 0 });
    s += E(t, W('cpu') - 0.1, pillTag(1390, 730, 'CPU SOTTO PRESSIONE', C.line, C.bg, 'middle'));
    return s + caption(t, W('multitasking'), 'Multitasking e priorità', '');
  } }) });

// 5 — la RAM condivisa (registro chiaro)
scene('ram', { make: (W) => ({
  capAt: W('condivisa'), last: W('termina'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += E(t, -0.3, T(240, 290, 'RAM', { f: 'pop', size: 72, fill: ink }), { dy: 10 });
    s += E(t, W('condivisa') - 0.1, T(420, 290, 'condivisa tra i processi', { f: 'serif', it: true, size: 54, fill: ink }), { dy: 10 });
    s += E(t, -0.2, pillTag(1580, 270, 'SCHEMA', ink, C.ivory, 'middle'), { dy: 0 });
    // banco di RAM in sezione: 16 celle
    const X = 240, Y = 440, Wd = 1440, H = 190, n = 16, cw = (Wd - 40) / n;
    s += E(t, -0.3, `<path d="M${X},${Y} h${Wd} v${H} h${-Wd * 0.42} v-22 h-40 v22 h${-(Wd * 0.58 - 40)} z" fill="${C.ivory}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>` +
      Array.from({ length: 36 }, (_, i) => `<line x1="${X + 30 + i * 39.2}" y1="${Y + H - 4}" x2="${X + 30 + i * 39.2}" y2="${Y + H + 22}" stroke="${ink}" stroke-width="6" opacity="${(i === 21 || i === 22) ? 0 : 1}"/>`).join(''), { dy: 0 });
    const tA = W('assegna') - 0.05, tL = W('termina') - 0.05;
    const owner = i => (i < 4 ? 'A' : i < 9 ? 'B' : (i < 13 && t > tA) ? 'C' : '');
    for (let i = 0; i < n; i++) {
      const x = X + 20 + i * cw, o = owner(i);
      let fill = C.cream, op = 1;
      if (o === 'A') { const f = eo((t - tL) / 0.5); fill = mix(mix(C.ivory, ink, 0.2), C.cream, f); }
      if (o === 'B') fill = mix(C.ivory, ink, 0.2);
      if (o === 'C') fill = mix(C.ivory, ink, 0.2 * eo((t - tA) / 0.4));
      s += `<rect x="${x + 4}" y="${Y + 22}" width="${cw - 8}" height="${H - 64}" rx="6" fill="${fill}" stroke="${ink}" stroke-width="2.5"/>`;
      const showL = o === 'B' || (o === 'A' && t < tL) || o === 'C';
      if (showL) s += T(x + cw / 2, Y + 108, o, { f: 'pop', size: 36, fill: ink, a: 'middle', op: o === 'C' ? eo((t - tA) / 0.4).toFixed(2) : (o === 'A' ? 1 : 1) });
    }
    // etichette sopra i gruppi
    const gx = (a, b) => X + 20 + (a + b) / 2 * cw;
    s += E(t, -0.2, lblI(gx(0, 4), Y - 30, t < tL ? 'PROCESSO A' : 'LIBERATA') + lblI(gx(4, 9), Y - 30, 'PROCESSO B'), { dy: 0 });
    s += E(t, W('assegna') - 0.05, `<rect x="${X + 20 + 9 * cw - 2}" y="${Y + 14}" width="${4 * cw + 4}" height="${H - 48}" rx="10" fill="none" stroke="${C.coral}" stroke-width="6"/>` + lblI(gx(9, 13), Y - 30, 'ASSEGNATA', { fill: C.coralD }), { dy: 0 });
    s += E(t, -0.2, lblI(gx(13, 16), Y - 30, 'LIBERA'), { dy: 0 });
    s += E(t, tL, T(gx(0, 4), Y + H + 90, 'il processo A termina', { f: 'serif', it: true, size: 44, fill: ink, a: 'start' === 'x' ? 'start' : 'middle' }), { dy: 10 });
    return s + caption(t, W('condivisa'), 'La RAM è condivisa', '', true);
  } }) });

// 6 — RAM piena: lo swap
scene('swap', { make: (W) => ({
  capAt: W('parte'), last: W('rallenta'),
  render(t) {
    let s = '';
    const X = 300, Y = 230, Wd = 1320, n = 16, cw = Wd / n;
    s += E(t, -0.4, lbl(X, Y - 26, 'RAM', { a: 'start' }), { dy: 0 });
    for (let i = 0; i < n; i++) s += E(t, -0.4 + i * 0.012, `<rect x="${X + i * cw + 4}" y="${Y}" width="${cw - 8}" height="110" rx="6" fill="${mix(C.bg, C.line, 0.3)}" stroke="${C.line}" stroke-width="3"/>`, { dy: 0 });
    s += E(t, W('piena') - 0.1, lbl(X + Wd, Y - 26, 'PIENA', { a: 'end' }), { dy: 0 });
    // storage in sezione
    const SY = 560;
    s += E(t, W('storage') - 0.45, `<rect x="${X}" y="${SY}" width="${Wd}" height="200" rx="16" fill="${DIM()}" stroke="${C.line}" stroke-width="5"/>` +
      [0, 1, 2].map(i => `<rect x="${X + 40 + i * 190}" y="${SY + 50}" width="150" height="100" rx="8" fill="none" stroke="${C.line}" stroke-width="3"/>`).join('') +
      lbl(X, SY + 250, 'STORAGE (SSD O HDD)', { a: 'start' }), { dy: 0 });
    s += E(t, W('aggiuntiva') - 0.15, `<rect x="${X + 820}" y="${SY + 30}" width="460" height="140" rx="12" fill="${C.bg}" stroke="${C.coral}" stroke-width="6" stroke-dasharray="16 10"/>` +
      lbl(X + 1050, SY + 92, 'MEMORIA', { size: 26 }) + lbl(X + 1050, SY + 130, 'AGGIUNTIVA', { size: 26 }), { dy: 0 });
    s += E(t, W('swap') - 0.1, T(X + 1050, SY + 250, 'swap', { f: 'serif', it: true, size: 54, a: 'middle' }), { dy: 0 });
    // scambi lenti tra RAM e swap
    const ax = X + 1050;
    s += E(t, W('aggiuntiva'), arrow(ax - 40, Y + 130, ax - 40, SY - 14, C.line, 5) + arrow(ax + 40, SY - 14, ax + 40, Y + 130, C.line, 5), { dy: 0 });
    const tl = W('lento') - 0.1;
    if (t > tl) { const p = ((t - tl) * 0.22) % 1; s += `<circle cx="${ax - 40}" cy="${(Y + 140 + (SY - 160 - Y) * p).toFixed(1)}" r="11" fill="${C.line}"/>`; }
    s += E(t, tl, lbl(ax - 80, 470, 'MOLTO PIÙ LENTO', { a: 'end' }), { dy: 0 });
    return s + caption(t, W('parte'), 'Lo swap è lento', '');
  } }) });

// 7 — file system: struttura ad albero
scene('albero', { make: (W) => ({
  capAt: W('albero'), last: W('file', 2),
  render(t) {
    let s = '';
    const st = C.line, fw = 110, node = (x, y) => folder(x - fw / 2, y - 40, fw, st, DIM(), 4);
    const edge = (x1, y1, x2, y2, t0) => E(t, t0, `<path d="M${x1},${y1} V${(y1 + y2) / 2} H${x2} V${y2}" fill="none" stroke="${st}" stroke-width="4"/>`, { dy: 0, blur: 0 });
    s += pop(t, -0.2, 960, 200, node(960, 200));
    const L1 = [560, 960, 1360], t1 = W('cartelle') - 0.1, t2 = W('altre') - 0.1, t3 = W('file', 2) - 0.1;
    L1.forEach((x, i) => { s += edge(960, 245, x, 390, t1 + i * 0.08) + pop(t, t1 + i * 0.08 + 0.1, x, 430, node(x, 430)); });
    const L2 = [[960, 830], [960, 1090], [560, 560]];
    L2.forEach(([p, x], i) => { s += edge(p, 475, x, 620, t2 + i * 0.08) + pop(t, t2 + i * 0.08 + 0.1, x, 660, node(x, 660)); });
    const L3 = [[1090, 1010], [1090, 1170], [1360, 1360]];
    L3.forEach(([p, x], i) => {
      const py = p === 1360 ? 475 : 705;
      s += edge(p, py, x, 750, t3 + i * 0.08) + pop(t, t3 + i * 0.08 + 0.1, x, 790, fileIcon(x - 32, 750, 64, st, DIM(), 4));
    });
    s += E(t, W('cartelle') - 0.1, folder(150, 640, 70, st, DIM(), 3) + lbl(240, 680, 'CARTELLA', { a: 'start' }), { dy: 0 });
    s += E(t, t3, fileIcon(165, 730, 44, st, DIM(), 3) + lbl(240, 776, 'FILE', { a: 'start' }), { dy: 0 });
    return s + caption(t, W('albero'), 'Struttura ad albero', 'albero');
  } }) });

// 8 — radice, percorso, metadati (registro chiaro)
scene('percorso', { make: (W) => ({
  capAt: W('percorso'), last: W('permessi'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    const seg = ['/', 'documenti', 'scuola', 'relazione.txt'], xs = [330, 730, 1130, 1530], y = 300;
    s += E(t, -0.2, pillTag(1580, 220, 'ESEMPIO', ink, C.ivory, 'middle'), { dy: 0 });
    seg.forEach((g, i) => {
      const t0 = i === 0 ? -0.3 : W('percorso') + (i - 1) * 0.18;
      const ic = i < 3 ? folder(xs[i] - 50, y - 36, 100, ink, C.ivory, 4) : fileIcon(xs[i] - 30, y - 40, 60, ink, C.ivory, 4);
      s += pop(t, t0, xs[i], y, ic) + E(t, t0, T(xs[i], y + 100, g, { f: 'mono', size: 28, fill: ink, a: 'middle', w: 700 }), { dy: 8 });
      if (i > 0) s += E(t, t0 - 0.05, arrow(xs[i - 1] + 64, y, xs[i] - 66, y, ink, 4), { dy: 0, blur: 0 });
    });
    s += E(t, W('radice') - 0.1, lblI(330, y + 150, 'RADICE'), { dy: 0 });
    s += E(t, W('indica') - 0.1, lblI(240, 535, 'PERCORSO', { a: 'start' }) + T(240, 600, '/documenti/scuola/relazione.txt', { f: 'mono', size: 48, fill: C.coralD, w: 700 }), { dy: 10 });
    s += E(t, W('metadati') - 0.1, `<line x1="240" y1="650" x2="1680" y2="650" stroke="${ink}" stroke-width="3"/>` + lblI(240, 730, 'METADATI', { a: 'start' }), { dy: 0 });
    let px = 480; [['NOME', 'nome'], ['DIMENSIONE', 'dimensione'], ['DATE', 'date'], ['PERMESSI', 'permessi']].forEach(([l, w]) => {
      const x = px; px += tw(l, 'mono', 26) + 3 * l.length + 40 + 36;
      s += E(t, W(w) - 0.1, pillTag(x, 739, l, ink, C.ivory, 'start'), { dy: 10 });
    });
    return s + caption(t, W('percorso'), 'Percorso e metadati', '', true);
  } }) });

// 9 — driver: i traduttori
scene('driver', { make: (W) => ({
  capAt: W('driver'), last: W('applicazioni'),
  render(t) {
    let s = '';
    const st = C.line, rows = [270, 470, 670];
    const dev = [(y) => printer(300, y + 4, 0.95, st, DIM()), (y) => keyboard(300, y, 0.95, st, DIM()), (y) => mouse(300, y, 0.85, st, DIM())];
    s += E(t, -0.3, lbl(300, 190, 'PERIFERICHE'), { dy: 0 });
    rows.forEach((y, i) => {
      s += E(t, -0.3 + i * 0.1, dev[i](y), { dy: 0 });
      s += E(t, W('linguaggio') - 0.15 + i * 0.12, `<rect x="440" y="${y - 40}" width="140" height="80" rx="40" fill="${C.bg}" stroke="${st}" stroke-width="3"/>` + glyph(i, 510, y, st), { dy: 0 });
      s += E(t, W('driver') - 0.1 + i * 0.1, arrow(640, y, 690, y, st, 4) + arrow(630, y, 590, y, st, 4) + `<rect x="700" y="${y - 50}" width="270" height="100" rx="14" fill="${DIM()}" stroke="${st}" stroke-width="4"/>` +
        T(835, y + 10, 'DRIVER', { f: 'mono', size: 30, a: 'middle', ls: 4, w: 700 }), { dy: 0 });
      s += E(t, W('traducono') - 0.1 + i * 0.1, arrow(1030, y, 1080, y, st, 4) + arrow(1020, y, 980, y, st, 4) + `<rect x="1090" y="${y - 40}" width="140" height="80" rx="40" fill="${C.bg}" stroke="${st}" stroke-width="3"/>` + glyph(3, 1160, y, st) +
        `<path d="M1240,${y} C1290,${y} 1290,470 1330,470" fill="none" stroke="${st}" stroke-width="4"/>` + (i === 1 ? arrow(1300, 470, 1350, 470, st, 4) : ''), { dy: 0 });
    });
    s += E(t, W('linguaggio') - 0.1, lbl(510, 770, 'LINGUAGGIO'), { dy: 0 });
    s += E(t, W('traducono'), lbl(1160, 190, 'STANDARD'), { dy: 0 });
    s += E(t, W('applicazioni') - 0.15, appWin(1360, 330, 400, 280, st, C.bg) + T(1560, 470, 'APP', { f: 'pop', size: 56, a: 'middle' }) + lbl(1560, 680, 'APPLICAZIONI'), { dy: 12 });
    return s + caption(t, W('driver'), 'I driver traducono', 'driver');
  } }) });

// 10 — una periferica nuova (registro chiaro)
scene('nuova', { make: (W) => ({
  capAt: W('driver'), last: W('installa'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    // portatile in sezione con porta laterale
    s += E(t, -0.3, `<rect x="300" y="250" width="440" height="290" rx="14" fill="${C.ivory}" stroke="${ink}" stroke-width="5"/><rect x="326" y="276" width="388" height="238" rx="6" fill="${C.cream}" stroke="${ink}" stroke-width="3"/>` +
      `<path d="M250,560 h540 l30,46 h-600 z" fill="${C.ivory}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/><rect x="772" y="568" width="22" height="16" fill="${ink}"/>`, { dy: 0 });
    // la spina entra nella porta
    const p = eio((t - 0.1) / 0.9), px = lerp(960, 794, p);
    s += `<rect x="${px}" y="562" width="46" height="28" rx="3" fill="${C.ivory}" stroke="${ink}" stroke-width="4"/><rect x="${px + 44}" y="546" width="150" height="60" rx="14" fill="${C.ivory}" stroke="${ink}" stroke-width="5"/>` +
      `<circle cx="${px + 166}" cy="576" r="8" fill="none" stroke="${ink}" stroke-width="3"/>`;
    s += E(t, 0.1, lblI(520, 690, 'COMPUTER') + lblI(905, 670, 'PERIFERICA') + lblI(905, 708, 'NUOVA') + T(905, 760, 'una chiavetta', { f: 'serif', it: true, size: 38, fill: ink, a: 'middle' }), { dy: 0 });
    // tre passi
    const step = (y, n, a, b, t0) => E(t, t0, `<circle cx="1170" cy="${y}" r="34" fill="${C.ivory}" stroke="${ink}" stroke-width="4"/>` + T(1170, y + 13, n, { f: 'pop', size: 36, fill: ink, a: 'middle' }) +
      T(1230, y + 10, a, { f: 'mono', size: 28, fill: ink, ls: 2, w: 700 }) + (b ? T(1110, y + 44, b, { f: 'serif', it: true, size: 38, fill: ink }) : ''), { dy: 10 });
    s += step(320, '1', 'CERCA IL DRIVER GIUSTO', '', W('cerca') - 0.1);
    s += step(470, '2', 'O TE LO CHIEDE', '', W('chiede') - 0.15);
    s += E(t, W('chiede') - 0.1, `<rect x="1230" y="514" width="380" height="76" rx="10" fill="${C.ivory}" stroke="${ink}" stroke-width="3"/>` + T(1250, 562, 'serve un driver?', { f: 'serif', it: true, size: 36, fill: ink }), { dy: 0 });
    s += step(690, '3', 'LO INSTALLA', '', W('installa') - 0.1);
    s += pop(t, W('installa') + 0.1, 1520, 690, `<circle cx="1520" cy="690" r="34" fill="${C.coral}"/><path d="M1503,690 l12,12 l22,-24" fill="none" stroke="${C.ivory}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`);
    return s + caption(t, W('driver'), 'Il driver giusto', '', true);
  } }) });

// 11 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Quattro funzioni, un sistema', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('chiede') - 0.3, 960, 545, 'Ogni app chiede risorse:', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true });
    s += words(t, W('è') - 0.1, 960, 630, 'il sistema operativo decide quando.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'decide', keyFill: C.coralD });
    s += E(t, W('è') + 0.4, `<line x1="760" y1="700" x2="1160" y2="700" stroke="${C.ink}" stroke-width="3"/>` + T(960, 760, 'PROFTECNOLOGIA · MC INF-2-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
  inner = `<g transform="translate(960,540) scale(${1 + 0.025 * t / S.D}) translate(-960,-540)">${inner}</g>`;
  body += inner;
  if (S.id !== 'finale') body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
