// Una foto fatta di numeri — MC-INF-1-01 §"Da bit a immagine: come funziona davvero una foto". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.8);
  if (def.capAt != null) D = Math.max(D, def.capAt + 0.11 * (nWords - 1) + 0.45 + 1.0 + 0.3 * nWords + 0.1);
  if (def.minD) D = Math.max(D, def.minD);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<clipPath id="scr"><rect x="1186" y="196" width="488" height="628" rx="18"/></clipPath></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const bin8 = n => n.toString(2).padStart(8, '0');

// ---- il mondo: un paesaggio (sole, montagne, lago) che diventa griglia di numeri ----
// luminosità 0..1 del paesaggio nel punto (u, v) ∈ [0,1]²
function lum(u, v) {
  const ridge = 0.50 + 0.10 * Math.sin(u * 7.0 + 0.6) + 0.06 * Math.sin(u * 15 + 2.0);
  const sd = Math.hypot(u - 0.70, (v - 0.26) * 1.25);
  if (v > 0.80) return 0.30 + 0.18 * (0.5 + 0.5 * Math.sin(v * 70)) * (1 - Math.abs(u - 0.7)); // lago con riflessi
  if (v > ridge) return 0.12 + 0.20 * (v - ridge) + 0.06 * Math.sin(u * 40) * (v - ridge > 0.05 ? 1 : 0);
  if (sd < 0.09) return 1;
  return 0.40 + 0.40 * (1 - v) + (sd < 0.16 ? 0.22 * (1 - (sd - 0.09) / 0.07) : 0);
}
const L01 = (u, v) => clamp(lum(u, v));
// paesaggio a filo (foto "vista" a occhio)
function landLine(x, y, w, h, st) {
  let ridge = '', lake = '';
  for (let i = 0; i <= 60; i++) { const u = i / 60; ridge += `${i ? 'L' : 'M'}${(x + u * w).toFixed(1)},${(y + h * (0.50 + 0.10 * Math.sin(u * 7.0 + 0.6) + 0.06 * Math.sin(u * 15 + 2.0))).toFixed(1)} `; }
  for (let k = 0; k < 4; k++) lake += `<line x1="${x + w * (0.45 + k * 0.03)}" y1="${y + h * (0.84 + k * 0.04)}" x2="${x + w * (0.95 - k * 0.03)}" y2="${y + h * (0.84 + k * 0.04)}" stroke="${st}" stroke-width="3" stroke-linecap="round"/>`;
  let rays = '';
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, cx = x + w * 0.70, cy = y + h * 0.26, r1 = w * 0.12, r2 = w * 0.16; rays += `<line x1="${cx + r1 * Math.cos(a)}" y1="${cy + r1 * Math.sin(a)}" x2="${cx + r2 * Math.cos(a)}" y2="${cy + r2 * Math.sin(a)}" stroke="${st}" stroke-width="3" stroke-linecap="round"/>`; }
  return `<path d="${ridge}" fill="none" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>` +
    `<line x1="${x}" y1="${y + h * 0.80}" x2="${x + w}" y2="${y + h * 0.80}" stroke="${st}" stroke-width="3"/>` + lake +
    `<circle cx="${x + w * 0.70}" cy="${y + h * 0.26}" r="${w * 0.09}" fill="none" stroke="${st}" stroke-width="4"/>` + rays;
}
// griglia di pixel a toni (base, ink): gap = spazio fra le celle
function pixGrid(x, y, cols, rows, cs, gap, base, ink, rev = 1) {
  let s = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if ((c + r * 0.6) / (cols + rows * 0.6) > rev) continue;
    const v = L01((c + 0.5) / cols, (r + 0.5) / rows);
    s += `<rect x="${(x + c * cs + gap / 2).toFixed(1)}" y="${(y + r * cs + gap / 2).toFixed(1)}" width="${(cs - gap).toFixed(1)}" height="${(cs - gap).toFixed(1)}" fill="${mix(base, ink, v)}"/>`;
  }
  return s;
}
function phone(x, y, w, h, st) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="56" fill="${C.bg}" stroke="${st}" stroke-width="5"/>` +
    `<rect x="${x + w / 2 - 50}" y="${y + 22}" width="100" height="14" rx="7" fill="none" stroke="${st}" stroke-width="3"/>`;
}
// cursore: traccia orizzontale 0..255
function slider(t, x, y, w, name, val, ink, o = {}) {
  const p = val / 255, tx = x + 90;
  let s = T(x, y + 18, name, { f: 'pop', size: 52, fill: ink });
  s += `<line x1="${tx}" y1="${y}" x2="${tx + w}" y2="${y}" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<line x1="${tx}" y1="${y - 14}" x2="${tx}" y2="${y + 14}" stroke="${ink}" stroke-width="3"/><line x1="${tx + w}" y1="${y - 14}" x2="${tx + w}" y2="${y + 14}" stroke="${ink}" stroke-width="3"/>`;
  s += T(tx, y + 52, '0', { f: 'mono', size: 26, fill: ink, a: 'middle', w: 600 }) + T(tx + w, y + 52, '255', { f: 'mono', size: 26, fill: ink, a: 'middle', w: 600 });
  s += `<circle cx="${(tx + w * p).toFixed(1)}" cy="${y}" r="20" fill="${o.bg || C.bg}" stroke="${ink}" stroke-width="5"/>`;
  s += T(tx + w + 70, y + 20, String(Math.round(val)), { f: 'pop', size: 58, fill: o.vfill || ink });
  return s;
}

// 1 — aggancio: la foto nel telefono si scompone in numeri
scene('hook', { make: (W) => ({
  capAt: W('sequenza'),
  render(t) {
    const px = 1160, py = 160, pw = 540, ph = 700, sx = 1186, sy = 196, sw = 488, sh = 628;
    let s = E(t, -0.4, phone(px, py, pw, ph, C.line), { dy: 0 });
    // metà sinistra della foto a filo; a destra si scompone in numeri (wipe da W('dentro'))
    const wp = clamp((t - W('dentro')) / 1.6), cut = sx + sw * (1 - wp);
    let pic = `<g clip-path="url(#scr)"><g><clipPath id="lft"><rect x="${sx}" y="${sy}" width="${cut - sx}" height="${sh}"/></clipPath></g><g clip-path="url(#lft)">${landLine(sx + 10, sy + 40, sw - 20, sh - 80, C.line)}</g></g>`;
    let nums = '';
    const cols = 2, rows = 13, cw = sw / cols, rh = (sh - 30) / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = sx + c * cw; if (x + cw * 0.5 < cut) continue;
      const v = L01((c + 0.5) / cols, (r + 0.5) / rows), tr = [255, 240, 225].map(m => Math.round(v * m)).join(' ');
      nums += T(x + cw / 2, sy + 30 + r * rh + rh * 0.7, tr, { f: 'mono', size: 28, fill: C.line, a: 'middle', w: 600 });
    }
    nums += E(t, W('dentro') + 0.4, lbl(px + pw / 2, 140, 'ESEMPIO'), { dy: 0 });
    if (wp > 0) pic += `<line x1="${cut}" y1="${sy}" x2="${cut}" y2="${sy + sh}" stroke="${C.line}" stroke-width="3" opacity="${wp < 1 ? 1 : 0}"/>`;
    s += E(t, -0.2, pic + nums, { dy: 0 });
    s += words(t, 0.15, 96, 400, 'Una foto', { f: 'pop', size: 140 });
    s += E(t, W('telefono'), IT(100, 490, 'sul tuo telefono', { size: 56 }));
    s += E(t, W('sembra'), IT(100, 600, "sembra un'immagine…", { size: 56 }));
    s += E(t, W('dentro'), lbl(100, 720, 'DENTRO: NUMERI', { a: 'start', size: 30 }));
    return s + caption(t, W('sequenza'), 'Una sequenza di numeri', 'numeri');
  } }) });

// 2 — 12 megapixel = 12 milioni di pixel
scene('megapixel', { make: (W) => ({
  capAt: W('puntini'),
  render(t) {
    const gx = 1000, gy = 190, cols = 40, rows = 30, cs = 20;
    const gap = 4 * eo((t - W('pixel')) / 0.8);
    let s = E(t, -0.4, `<rect x="${gx - 14}" y="${gy - 14}" width="${cols * cs + 28}" height="${rows * cs + 28}" rx="10" fill="none" stroke="${C.line}" stroke-width="3"/>` + pixGrid(gx, gy, cols, rows, cs, gap, C.bg, C.line), { dy: 0 });
    s += E(t, W('pixel'), lbl(gx + cols * cs / 2, gy + rows * cs + 70, 'GRIGLIA SEMPLIFICATA'), { dy: 8 });
    s += E(t, W('dodici'), T(96, 330, '12 megapixel', { f: 'pop', size: 104 }));
    s += E(t, W('contiene'), IT(100, 420, 'contiene', { size: 56 }));
    s += E(t, W('dodici', 1), T(96, 580, '12.000.000', { f: 'pop', size: 128, fill: C.coral }));
    s += E(t, W('pixel'), T(100, 670, 'pixel', { f: 'pop', size: 72 }));
    s += E(t, W('puntini'), IT(100, 760, '12 milioni di puntini', { size: 54 }));
    return s + caption(t, W('puntini'), '12 milioni di pixel', '');
  } }) });

// 3 — ogni pixel: un puntino, un colore (registro chiaro)
scene('pixel', { make: (W) => ({
  capAt: W('colore'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(180, 140, 1560, 700, { rot: -0.5 }), { dy: 0 });
    const gx = 270, gy = 220, cs = 94, cols = 6, rows = 6;
    let grid = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const v = L01((c + 0.5) / cols, (r + 0.5) / rows);
      grid += `<rect x="${gx + c * cs + 3}" y="${gy + r * cs + 3}" width="${cs - 6}" height="${cs - 6}" fill="${mix(C.cream, C.ink, 0.15 + 0.7 * v)}" stroke="${C.ink}" stroke-width="2"/>`;
    }
    g += E(t, -0.2, grid, { dy: 0 });
    const hc = 3, hr = 2, hx = gx + hc * cs, hy = gy + hr * cs;
    g += pop(t, W('singolo'), hx + cs / 2, hy + cs / 2, `<rect x="${hx - 4}" y="${hy - 4}" width="${cs + 8}" height="${cs + 8}" fill="none" stroke="${C.coral}" stroke-width="8"/>`);
    g += E(t, W('singolo') + 0.1, `<line x1="${hx + cs + 8}" y1="${hy + cs / 2}" x2="${940}" y2="${hy + cs / 2}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="3 9"/>` + lbl(960, hy + cs / 2 + 10, '1 PIXEL', { a: 'start', fill: C.ink, size: 30 }), { dy: 0 });
    g += E(t, W('pixel'), T(960, 320, 'pixel', { f: 'pop', size: 120, fill: C.ink }));
    g += E(t, W('puntino'), IT(964, 580, "un singolo puntino", { fill: C.ink, size: 54 }));
    g += E(t, W('puntino') + 0.15, IT(964, 645, "dell'immagine", { fill: C.ink, size: 54 }));
    g += E(t, W('colore'), T(960, 770, '1 pixel = 1 colore', { f: 'pop', size: 68, fill: C.ink }));
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('colore'), 'Un puntino, un colore', '', true);
  } }) });

// 4 — RGB: tre componenti che si mescolano
scene('rgb', { make: (W) => ({
  capAt: W('rosso'),
  render(t) {
    const cs = [[620, 400, 'R', 'ROSSO', W('rosso'), 620, 190, 'middle'], [520, 570, 'G', 'VERDE', W('verde'), 330, 690, 'end'], [720, 570, 'B', 'BLU', W('blu'), 910, 690, 'start']];
    let s = '';
    cs.forEach(([x, y, l, name, t0, lx, ly, a]) => {
      const dx = (x - 620) * 0.55, dy = (y - 513) * 0.55;
      const i = 'RGB'.indexOf(l);
      s += E(t, 0.1 + i * 0.15, `<circle cx="${x}" cy="${y}" r="165" fill="none" stroke="${C.line}" stroke-width="5"/>` + T(x + dx, y + dy + 24, l, { f: 'pop', size: 70, a: 'middle' }), { dy: 0 });
      s += E(t, t0 - 0.05, lbl(lx, ly, name, { a, size: 30 }), { dy: 8 });
    });
    s += E(t, W('colori'), IT(1150, 270, 'I colori digitali', { size: 56 }));
    s += E(t, W('tre'), T(1150, 380, '3 componenti', { f: 'pop', size: 84 }));
    s += E(t, W('rgb'), T(1150, 600, 'RGB', { f: 'pop', size: 190, fill: C.coral }));
    s += E(t, W('rgb') + 0.2, IT(1154, 690, 'Red · Green · Blue', { size: 54 }));
    return s + caption(t, W('rosso'), 'Rosso, verde, blu', '');
  } }) });

// 5 — ogni componente: un valore da 0 a 255 (registro chiaro)
const EX = [217, 119, 87]; // valori di esempio (= il corallo del libro)
scene('valore', { make: (W) => ({
  capAt: W('zero'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(180, 140, 1560, 700, { rot: 0.4 }), { dy: 0 });
    g += E(t, 0.05, pillTag(1500, 240, 'ESEMPIO', C.ink, C.cream, 'middle'));
    g += E(t, W('zero'), T(260, 290, 'da 0 a 255', { f: 'pop', size: 96, fill: C.coralD }));
    const p = eo((t - W('duecentocinquantacinque') - 0.3) / 1.3);
    ['R', 'G', 'B'].forEach((n, i) => {
      g += E(t, W('componente') + i * 0.15, slider(t, 270, 440 + i * 130, 1050, n, EX[i] * p, C.ink, { bg: C.cream }), { dy: 10 });
    });
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('zero'), 'Da 0 a 255', '', true);
  } }) });

// 6 — cambia un valore: il colore cambia
scene('cambia', { make: (W) => ({
  capAt: W('colore'),
  minD: 0,
  render(t) {
    const p = eio((t - W('solo')) / 1.4), R = Math.round(lerp(EX[0], 30, p)), cur = [R, EX[1], EX[2]];
    const col = '#' + cur.map(v => v.toString(16).padStart(2, '0')).join('');
    let s = E(t, -0.4, `<rect x="200" y="200" width="460" height="460" rx="20" fill="${col}" stroke="${C.line}" stroke-width="5"/>` + lbl(430, 730, 'ESEMPIO'), { dy: 0 });
    ['R', 'G', 'B'].forEach((n, i) => {
      s += E(t, -0.3 + i * 0.12, slider(t, 790, 300 + i * 160, 700, n, cur[i], C.line), { dy: 10 });
    });
    s = E(t, W('solo'), `<rect x="760" y="250" width="1010" height="120" rx="16" fill="${mix(C.bg, C.line, 0.12)}"/>` + lbl(790, 232, 'UNO SOLO', { a: 'start' }), { dy: 0 }) + s;
    return s + caption(t, W('colore'), 'Cambia un valore', '');
  } }) });

// 7 — un byte = 8 bit
scene('byte', { make: (W) => ({
  capAt: W('otto'),
  render(t) {
    const t1a = W('zero'), t1b = W('duecentocinquantacinque') + 0.9, t2a = W('scrivono'), t2b = W('diversi') + 0.5;
    let v = 0;
    if (t >= t1a) v = Math.round(255 * clamp((t - t1a) / (t1b - t1a)));
    if (t >= t2a) v = Math.round(255 * clamp((t - t2a) / (t2b - t2a)));
    const b = bin8(v), cw = 130, gp = 20, x0 = 960 - (8 * cw + 7 * gp) / 2, y0 = 340;
    let s = E(t, W('numero') - 0.1, lbl(960, 160, 'NUMERO') + T(960, 290, String(v), { f: 'pop', size: 120, a: 'middle' }), { dy: 0 });
    let cells = '';
    for (let i = 0; i < 8; i++) {
      const on = b[i] === '1', x = x0 + i * (cw + gp);
      cells += `<rect x="${x}" y="${y0}" width="${cw}" height="${cw}" rx="14" fill="${on ? C.line : C.bg}" stroke="${C.line}" stroke-width="4"/>` +
        T(x + cw / 2, y0 + cw / 2 + 26, b[i], { f: 'pop', size: 76, fill: on ? C.bg : C.line, a: 'middle' });
    }
    s += E(t, W('numero'), cells, { dy: 10 });
    const by = y0 + cw + 30;
    s += E(t, W('byte') - 0.05, `<path d="M${x0},${by} v22 H${x0 + 8 * cw + 7 * gp} v-22 M960,${by + 22} v22" fill="none" stroke="${C.coral}" stroke-width="5"/>` + T(960, by + 110, '1 byte', { f: 'pop', size: 76, a: 'middle', fill: C.coral }), { dy: 0 });
    s += E(t, W('otto'), IT(960, by + 180, '= 8 bit', { a: 'middle', size: 60 }));
    s += E(t, W('duecentocinquantasei'), lbl(960, by + 250, '256 VALORI DIVERSI · DA 0 A 255', { size: 30 }));
    return s + caption(t, W('otto'), '1 byte = 8 bit', '');
  } }) });

// 8 — 3 byte per pixel (registro chiaro)
scene('tre', { make: (W) => ({
  capAt: W('tre'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(180, 140, 1560, 700, { rot: -0.4 }), { dy: 0 });
    g += E(t, 0.05, pillTag(1590, 240, 'ESEMPIO', C.ink, C.cream, 'middle'));
    const px = 260, py = 330, ps = 300;
    g += E(t, -0.2, `<rect x="${px}" y="${py}" width="${ps}" height="${ps}" fill="${C.coral}" stroke="${C.ink}" stroke-width="6"/>` + lbl(px + ps / 2, py + ps + 60, '1 PIXEL', { fill: C.ink, size: 30 }), { dy: 0 });
    g += E(t, W('tre'), T(700, 290, '3 byte', { f: 'pop', size: 96, fill: C.ink }));
    const names = ['R', 'G', 'B'], tw0 = [W('rosso'), W('verde'), W('blu')];
    names.forEach((n, i) => {
      const y = 410 + i * 125, b = bin8(EX[i]);
      let r = `<path d="M${px + ps},${py + ps / 2} C${640},${py + ps / 2} ${640},${y - 18} ${700},${y - 18}" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="3 9"/>`;
      r += T(720, y, n, { f: 'pop', size: 56, fill: C.ink });
      for (let j = 0; j < 8; j++) {
        const on = b[j] === '1', x = 800 + j * 66;
        r += `<rect x="${x}" y="${y - 50}" width="56" height="56" rx="8" fill="${on ? C.ink : C.cream}" stroke="${C.ink}" stroke-width="3"/>` + T(x + 28, y - 10, b[j], { f: 'mono', size: 30, fill: on ? C.cream : C.ink, a: 'middle', w: 700 });
      }
      r += T(1350, y, '= ' + EX[i], { f: 'pop', size: 56, fill: C.ink });
      g += E(t, tw0[i] - 0.05, r, { dy: 10 });
    });
    g += E(t, W('ventiquattro'), T(1060, 290, '= 24 bit', { f: 'pop', size: 96, fill: C.ink }) + pillTag(1590, 330, 'CALCOLO', C.ink, C.cream, 'middle'));
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('tre'), '3 byte per pixel', '', true);
  } }) });

// 9 — il conto: 12.000.000 × 3 = 36.000.000 byte (registro chiaro)
scene('totale', { make: (W) => ({
  capAt: W('trentasei'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(260, 140, 1400, 700, { rot: 0.4 }), { dy: 0 });
    g += E(t, W('dodici'), T(1360, 320, '12.000.000 pixel', { f: 'pop', size: 92, fill: C.ink, a: 'end' }));
    g += E(t, W('tre'), T(1360, 450, '× 3 byte', { f: 'pop', size: 92, fill: C.ink, a: 'end' }));
    const lp = eo((t - W('trentasei') + 0.15) / 0.4);
    if (lp > 0) g += `<line x1="${1360 - 980 * lp}" y1="500" x2="1360" y2="500" stroke="${C.ink}" stroke-width="5"/>`;
    g += E(t, W('trentasei'), T(1360, 640, '36.000.000 byte', { f: 'pop', size: 104, fill: C.coralD, a: 'end' }));
    g += E(t, W('sola'), IT(1356, 730, 'per una sola foto', { fill: C.ink, size: 56, a: 'end' }));
    g += E(t, W('sola') + 0.3, lbl(1360, 800, 'DATI GREZZI, SENZA COMPRESSIONE', { a: 'end', fill: C.ink }));
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('trentasei'), '36 milioni di byte', '', true);
  } }) });

// 10 — tutto in binario: ogni pixel = 3 byte = 24 bit, riga per riga
scene('binario', { make: (W) => ({
  capAt: W('solo'),
  render(t) {
    const gx = 1010, gy = 200, rows = 11, rh = 42, dw = 26, bg = 22;
    let g = `<rect x="${gx - 24}" y="${gy - 24}" width="${24 * dw + 2 * bg + 48}" height="${rows * rh + 40}" rx="10" fill="none" stroke="${C.line}" stroke-width="3"/>`;
    g += lbl(gx - 24, gy - 46, 'ESEMPIO', { a: 'start' });
    for (let r = 0; r < rows; r++) {
      if (t < -0.2 + r * 0.06) continue;
      const v = L01(((r * 7) % 13 + 0.5) / 13, (r + 0.5) / rows), trip = r === 0 ? EX : [255, 240, 225].map(m => Math.round(v * m));
      trip.forEach((n, j) => {
        const b = bin8(n);
        for (let k = 0; k < 8; k++) g += T(gx + j * (8 * dw + bg) + k * dw + dw / 2, gy + r * rh + rh * 0.72, b[k], { f: 'mono', size: 30, fill: C.line, a: 'middle', w: b[k] === '1' ? 800 : 500 });
      });
    }
    // la prima riga = 1 pixel: tre byte, 24 bit
    const by = gy + rh + 4, x1 = gx, x2 = gx + 24 * dw + 2 * bg;
    let s = g;
    s += E(t, W('otto'), `<path d="M${x1},${gy - 2} h${x2 - x1}" stroke="${C.line}" stroke-width="0"/>` +
      `<rect x="${x1 - 10}" y="${gy - 4}" width="${x2 - x1 + 20}" height="${rh + 4}" rx="8" fill="none" stroke="${C.line}" stroke-width="4"/>` +
      [0, 1, 2].map(j => lbl(gx + j * (8 * dw + bg) + 4 * dw, gy + rows * rh + 50, ['R', 'G', 'B'][j])).join('') +
      lbl((x1 + x2) / 2, gy + rows * rh + 98, '1 RIGA = 1 PIXEL = 3 BYTE = 24 BIT'), { dy: 0 });
    s += E(t, W('trentasei'), T(96, 320, '36.000.000', { f: 'pop', size: 124 }));
    s += E(t, W('numeri'), T(100, 410, 'numeri', { f: 'pop', size: 66 }));
    s += E(t, W('zero'), IT(400, 410, 'da 0 a 255', { size: 60 }));
    s += E(t, W('otto'), IT(100, 510, '× 8 bit ciascuno', { size: 56 }));
    s += E(t, W('duecentottantotto'), T(96, 650, '288.000.000 bit', { f: 'pop', size: 84, fill: C.coral }));
    s += E(t, W('duecentottantotto') + 0.2, pillTag(96, 740, 'CALCOLO', C.line, C.bg));
    return s + caption(t, W('solo'), 'Solo 0 e 1', '');
  } }) });

// 11 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Una foto fatta di numeri', { f: 'pop', size: 110, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('ogni') - 0.1, 960, 560, 'Ogni foto è una sequenza di numeri.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'numeri', keyFill: C.coralD });
    s += E(t, W('numeri') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC INF-1-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
