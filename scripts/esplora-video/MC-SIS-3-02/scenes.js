// Economia circolare: dalla culla alla culla — MC-SIS-3-02 (ESPLORA §4). render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.4);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="#E3CDB4" stop-opacity="0.55"/><stop offset="1" stop-color="#E3CDB4" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const DIMF = mix(C.bg, C.line, 0.14);
const sw = (c, w = 5) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const R = a => a * Math.PI / 180;
const pt = (cx, cy, r, a) => [cx + r * Math.cos(R(a)), cy + r * Math.sin(R(a))];

// arco (gradi, 0 = destra, senso orario) disegnato fino a p, con punta di freccia
function arcArrow(cx, cy, rx, ry, a0, a1, c, w, p = 1, head = true) {
  p = clamp(p); if (p <= 0) return '';
  const ae = a0 + (a1 - a0) * p, n = 48; let d = '';
  for (let i = 0; i <= n; i++) { const a = R(a0 + (ae - a0) * i / n); d += (i ? ' L' : 'M') + (cx + rx * Math.cos(a)).toFixed(1) + ',' + (cy + ry * Math.sin(a)).toFixed(1); }
  let s = `<path d="${d}" ${sw(c, w)}/>`;
  if (head) {
    const a = R(ae), dir = Math.sign(a1 - a0), tx = -rx * Math.sin(a) * dir, ty = ry * Math.cos(a) * dir, l = Math.hypot(tx, ty), ux = tx / l, uy = ty / l;
    const x = cx + rx * Math.cos(a) + ux * 6, y = cy + ry * Math.sin(a) + uy * 6, h = 14 + w * 1.6;
    s += `<path d="M${(x + ux * h * 0.4).toFixed(1)},${(y + uy * h * 0.4).toFixed(1)} L${(x - ux * h * 0.6 - uy * h * 0.55).toFixed(1)},${(y - uy * h * 0.6 + ux * h * 0.55).toFixed(1)} L${(x - ux * h * 0.6 + uy * h * 0.55).toFixed(1)},${(y - uy * h * 0.6 - ux * h * 0.55).toFixed(1)} Z" fill="${c}"/>`;
  }
  return s;
}
function cross(cx, cy, r, st, p, w = 9) {
  const a = clamp(p * 2), b = clamp(p * 2 - 1);
  if (a <= 0) return '';
  let s = `<line x1="${cx - r}" y1="${cy - r}" x2="${cx - r + 2 * r * a}" y2="${cy - r + 2 * r * a}" stroke="${st}" stroke-width="${w}" stroke-linecap="round"/>`;
  if (b > 0) s += `<line x1="${cx + r}" y1="${cy - r}" x2="${cx + r - 2 * r * b}" y2="${cy - r + 2 * r * b}" stroke="${st}" stroke-width="${w}" stroke-linecap="round"/>`;
  return s;
}
function edgeA(rx, ry, r) { for (let a = 0; a < 90; a += 0.25) { const x = rx * Math.cos(R(a)) - rx, y = ry * Math.sin(R(a)); if (Math.hypot(x, y) >= r) return a; } return 20; }
const node = (cx, cy, r, st, fill = C.bg) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="4"/>`;

// ---- icone a filo (centrate in cx,cy, ~120 px) ----
function icMine(cx, cy, c) { // minerale + piccone
  return `<path d="M${cx - 62},${cy + 50} L${cx - 40},${cy + 6} L${cx - 6},${cy - 4} L${cx + 22},${cy + 18} L${cx + 60},${cy + 22} L${cx + 66},${cy + 50} Z" ${sw(c, 4)}/>` +
    `<path d="M${cx - 30},${cy + 30} l10,-8 M${cx + 10},${cy + 36} l12,-6 M${cx + 34},${cy + 34} l8,6" ${sw(c, 3)}/>` +
    `<path d="M${cx - 10},${cy - 70} Q${cx + 30},${cy - 78} ${cx + 58},${cy - 50}" ${sw(c, 6)}/><line x1="${cx + 26}" y1="${cy - 70}" x2="${cx - 18}" y2="${cy - 14}" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
}
function icFactory(cx, cy, c, k = 1) {
  const x = cx - 64 * k, y = cy + 50 * k;
  return `<path d="M${x},${y} V${cy - 10 * k} L${x + 40 * k},${cy - 34 * k} V${cy - 10 * k} L${x + 80 * k},${cy - 34 * k} V${cy - 10 * k} L${x + 104 * k},${cy - 22 * k} V${cy - 66 * k} H${x + 124 * k} V${y} Z" ${sw(c, 4)}/>` +
    `<rect x="${x + 18 * k}" y="${cy + 10 * k}" width="${22 * k}" height="${20 * k}" ${sw(c, 3)}/><rect x="${x + 58 * k}" y="${cy + 10 * k}" width="${22 * k}" height="${20 * k}" ${sw(c, 3)}/>`;
}
function icTag(cx, cy, c) {
  return `<path d="M${cx - 60},${cy - 34} H${cx + 30} L${cx + 66},${cy} L${cx + 30},${cy + 34} H${cx - 60} Z" ${sw(c, 4)}/><circle cx="${cx + 28}" cy="${cy}" r="8" ${sw(c, 3)}/>` +
    `<path d="M${cx - 40},${cy - 10} h44 M${cx - 40},${cy + 12} h30" ${sw(c, 3)}/>`;
}
function icBag(cx, cy, c) {
  return `<path d="M${cx - 50},${cy - 26} H${cx + 50} L${cx + 58},${cy + 58} H${cx - 58} Z" ${sw(c, 4)}/><path d="M${cx - 22},${cy - 26} V${cy - 44} A22,22 0 0 1 ${cx + 22},${cy - 44} V${cy - 26}" ${sw(c, 4)}/>`;
}
function icBin(cx, cy, c, dash) {
  const d = dash ? ` stroke-dasharray="12 10"` : '';
  return `<path d="M${cx - 46},${cy - 36} L${cx - 38},${cy + 60} H${cx + 38} L${cx + 46},${cy - 36}" ${sw(c, 5)}${d}/><path d="M${cx - 60},${cy - 38} H${cx + 60} M${cx - 18},${cy - 38} V${cy - 52} H${cx + 18} V${cy - 38}" ${sw(c, 5)}${d}/>` +
    (dash ? '' : `<path d="M${cx - 16},${cy - 16} L${cx - 12},${cy + 42} M${cx + 16},${cy - 16} L${cx + 12},${cy + 42}" ${sw(c, 3)}/>`);
}
function icCradle(cx, cy, c) {
  return `<path d="M${cx - 56},${cy - 30} V${cy + 14} H${cx + 56} V${cy - 30}" ${sw(c, 4)}/><path d="M${cx - 56},${cy - 8} H${cx + 56}" ${sw(c, 3)}/>` +
    `<path d="M${cx - 66},${cy + 30} Q${cx},${cy + 56} ${cx + 66},${cy + 30}" ${sw(c, 4)}/><path d="M${cx - 40},${cy + 14} L${cx - 46},${cy + 38} M${cx + 40},${cy + 14} L${cx + 46},${cy + 38}" ${sw(c, 4)}/>`;
}
function icTomb(cx, cy, c) {
  return `<path d="M${cx - 38},${cy + 40} V${cy - 20} A38,38 0 0 1 ${cx + 38},${cy - 20} V${cy + 40}" ${sw(c, 4)}/><path d="M${cx - 60},${cy + 40} H${cx + 60}" ${sw(c, 4)}/><path d="M${cx},${cy - 36} V${cy + 8} M${cx - 16},${cy - 20} H${cx + 16}" ${sw(c, 3)}/>`;
}
function icBox(cx, cy, c, k = 1) {
  return `<path d="M${cx},${cy - 44 * k} L${cx + 50 * k},${cy - 20 * k} V${cy + 34 * k} L${cx},${cy + 58 * k} L${cx - 50 * k},${cy + 34 * k} V${cy - 20 * k} Z M${cx - 50 * k},${cy - 20 * k} L${cx},${cy + 4 * k} L${cx + 50 * k},${cy - 20 * k} M${cx},${cy + 4 * k} V${cy + 58 * k}" ${sw(c, 4)}/>`;
}
function icJar(cx, cy, c) {
  return `<path d="M${cx - 30},${cy - 40} H${cx + 30} V${cy - 26} Q${cx + 42},${cy - 18} ${cx + 42},${cy} V${cy + 40} Q${cx + 42},${cy + 50} ${cx + 32},${cy + 50} H${cx - 32} Q${cx - 42},${cy + 50} ${cx - 42},${cy + 40} V${cy} Q${cx - 42},${cy - 18} ${cx - 30},${cy - 26} Z" ${sw(c, 4)}/><path d="M${cx - 34},${cy - 52} H${cx + 34} V${cy - 40} H${cx - 34} Z" ${sw(c, 4)}/>`;
}
function icWrench(cx, cy, c) {
  return `<g transform="rotate(-45 ${cx} ${cy})"><path d="M${cx - 10},${cy - 26} V${cy + 52} A10,10 0 0 0 ${cx + 10},${cy + 52} V${cy - 26}" ${sw(c, 4)}/>` +
    `<path d="M${cx - 10},${cy - 26} Q${cx - 34},${cy - 34} ${cx - 30},${cy - 58} L${cx - 14},${cy - 44} L${cx + 14},${cy - 44} L${cx + 30},${cy - 58} Q${cx + 34},${cy - 34} ${cx + 10},${cy - 26}" ${sw(c, 4)}/></g>`;
}
function icRecycle(cx, cy, c, r = 40) { // tre frecce curve in cerchio
  let s = '';
  for (let k = 0; k < 3; k++) s += arcArrow(cx, cy, r, r, -80 + k * 120, -80 + k * 120 + 92, c, 5);
  return s;
}
function icFlame(cx, cy, c) {
  return `<path d="M${cx},${cy - 60} C${cx + 18},${cy - 30} ${cx + 46},${cy - 10} ${cx + 40},${cy + 22} A40,40 0 0 1 ${cx - 40},${cy + 22} C${cx - 44},${cy - 2} ${cx - 24},${cy - 14} ${cx - 18},${cy - 34} C${cx - 8},${cy - 20} ${cx - 4},${cy - 14} ${cx},${cy - 60} Z" ${sw(c, 4)}/>` +
    `<path d="M${cx},${cy + 2} C${cx + 14},${cy + 14} ${cx + 18},${cy + 28} ${cx + 12},${cy + 40} M${cx},${cy + 2} C${cx - 14},${cy + 14} ${cx - 18},${cy + 28} ${cx - 12},${cy + 40}" ${sw(c, 3)}/>`;
}
function icTruck(cx, cy, c) {
  return `<path d="M${cx - 80},${cy + 30} V${cy - 40} H${cx + 20} V${cy + 30} Z M${cx + 20},${cy - 14} H${cx + 56} L${cx + 80},${cy + 10} V${cy + 30} H${cx + 20}" ${sw(c, 4)}/>` +
    `<circle cx="${cx - 48}" cy="${cy + 38}" r="15" fill="${C.bg}" stroke="${c}" stroke-width="4"/><circle cx="${cx + 48}" cy="${cy + 38}" r="15" fill="${C.bg}" stroke="${c}" stroke-width="4"/>`;
}
function icLeaf(cx, cy, c) {
  return `<path d="M${cx - 40},${cy + 40} C${cx - 50},${cy - 20} ${cx - 10},${cy - 50} ${cx + 44},${cy - 48} C${cx + 46},${cy + 8} ${cx + 10},${cy + 46} ${cx - 40},${cy + 40} Z" ${sw(c, 4)}/><path d="M${cx - 40},${cy + 40} L${cx + 26},${cy - 26}" ${sw(c, 3)}/>`;
}
function icSprout(cx, cy, c) {
  return `<path d="M${cx - 60},${cy + 36} H${cx + 60}" ${sw(c, 4)}/><path d="M${cx - 44},${cy + 50} h16 M${cx - 4},${cy + 52} h12 M${cx + 28},${cy + 48} h14" ${sw(c, 3)}/>` +
    `<path d="M${cx},${cy + 36} V${cy - 14}" ${sw(c, 4)}/><path d="M${cx},${cy - 6} C${cx - 10},${cy - 40} ${cx - 40},${cy - 44} ${cx - 50},${cy - 34} C${cx - 40},${cy - 10} ${cx - 16},${cy - 4} ${cx},${cy - 6} Z M${cx},${cy - 14} C${cx + 8},${cy - 46} ${cx + 36},${cy - 54} ${cx + 50},${cy - 46} C${cx + 42},${cy - 20} ${cx + 18},${cy - 12} ${cx},${cy - 14} Z" ${sw(c, 4)}/>`;
}
function icIngot(cx, cy, c) {
  return `<path d="M${cx - 50},${cy + 24} L${cx - 34},${cy - 10} H${cx + 34} L${cx + 50},${cy + 24} Z M${cx - 34},${cy - 10} L${cx - 20},${cy - 34} H${cx + 20} L${cx + 34},${cy - 10}" ${sw(c, 4)}/>`;
}
function icBattery(cx, cy, c, k = 1, cells = false) {
  let s = `<rect x="${cx - 40 * k}" y="${cy - 64 * k}" width="${80 * k}" height="${128 * k}" rx="${10 * k}" ${sw(c, 4)}/><rect x="${cx - 16 * k}" y="${cy - 76 * k}" width="${32 * k}" height="${12 * k}" rx="3" fill="${c}"/>`;
  s += `<path d="M${cx - 12 * k},${cy - 30 * k} h${24 * k} M${cx},${cy - 42 * k} v${24 * k} M${cx - 12 * k},${cy + 34 * k} h${24 * k}" ${sw(c, 4)}/>`;
  return s;
}
function icPerson(cx, cy, c) {
  return `<circle cx="${cx}" cy="${cy - 46}" r="24" ${sw(c, 4)}/><path d="M${cx - 46},${cy + 56} V${cy + 24} A46,40 0 0 1 ${cx + 46},${cy + 24} V${cy + 56}" ${sw(c, 4)}/>`;
}

// ---- pillole dei tre livelli ----
function levels(t, t0, act, light, py = 190) {
  const L = ['1 · BIOLOGICO', '2 · TECNICO', '3 · MODELLO DI SERVIZIO'], xs = [500, 820, 1270]; let s = '';
  L.forEach((l, i) => {
    const ink = light ? C.ink : C.line, bg = light ? C.cream : C.bg;
    const on = i + 1 === act;
    s += E(t, t0 + i * 0.12, pillTag(xs[i], py, l, on ? (light ? C.cream : C.bg) : ink, on ? ink : bg, 'middle'), { dy: 8 });
  });
  return s;
}

// 1 — il modello lineare
const XS = [250, 605, 960, 1315, 1670];
scene('lineare', { make: (W) => ({
  capAt: W('culla'), last: W('tomba'),
  render(t) {
    let s = '';
    const y = 430, keys = ['estrai', 'produci', 'vendi', 'consuma', 'butta'], labs = ['ESTRAI', 'PRODUCI', 'VENDI', 'CONSUMA', 'BUTTA'];
    const ics = [icMine, icFactory, icTag, icBag, icBin];
    keys.forEach((k, i) => {
      const t0 = W(k) - 0.05, c = i === 4 ? C.coral : C.line;
      s += E(t, t0, ics[i](XS[i], y, c) + lbl(XS[i], y + 130, labs[i], { fill: C.line }), { dy: 14 });
      if (i > 0) s += E(t, t0 - 0.02, arrow(XS[i - 1] + 92, y, XS[i] - 92, y, C.line, 4), { dy: 0, blur: 0 });
    });
    s += E(t, W('lineare') - 0.05, IT(960, 250, 'il modello lineare', { a: 'middle', size: 64 }), { dy: 10 });
    // dalla culla alla tomba: una linea che non torna indietro
    const ly = 720, pc = ss((t - W('culla')) / 0.9);
    s += E(t, W('culla') - 0.05, icCradle(XS[0], ly, C.line) + lbl(XS[0], ly + 84, 'CULLA'), { dy: 10 });
    if (pc > 0) s += `<line x1="${XS[0] + 90}" y1="${ly}" x2="${(XS[0] + 90 + (XS[4] - XS[0] - 180) * pc).toFixed(1)}" y2="${ly}" stroke="${C.line}" stroke-width="3" stroke-dasharray="10 12"/>`;
    s += E(t, W('tomba') - 0.05, icTomb(XS[4], ly - 6, C.line) + lbl(XS[4], ly + 84, 'TOMBA'), { dy: 10 });
    s += E(t, W('culla') + 0.2, IT(960, ly - 42, 'cradle-to-grave', { a: 'middle', size: 44 }), { dy: 8 });
    return s + caption(t, W('culla'), 'Dalla culla alla tomba', '');
  } }) });

// 2 — funziona solo se... (nessuna delle due)
function heap(cx, cy, c) {
  let s = `<line x1="${cx - 200}" y1="${cy + 60}" x2="${cx + 200}" y2="${cy + 60}" stroke="${c}" stroke-width="4"/>`;
  s += `<path d="M${cx - 170},${cy + 60} L${cx - 110},${cy - 10} L${cx - 60},${cy - 50} L${cx - 10},${cy - 80} L${cx + 50},${cy - 40} L${cx + 110},${cy - 10} L${cx + 170},${cy + 60}" ${sw(c, 4)}/>`;
  [[-90, 20], [-30, -20], [30, 10], [90, 30], [-20, 34], [50, -40 + 40]].forEach(([dx, dy]) => s += `<path d="M${cx + dx - 16},${cy + dy + 10} l10,-18 h14 l8,14 l-10,12 Z" ${sw(c, 3)}/>`);
  return s;
}
function landfill(cx, cy, c) {
  let s = `<path d="M${cx - 220},${cy - 20} H${cx - 150} L${cx - 110},${cy + 60} H${cx + 110} L${cx + 150},${cy - 20} H${cx + 220}" ${sw(c, 4)}/>`;
  s += `<path d="M${cx - 140},${cy - 2} L${cx - 108},${cy + 58} H${cx + 108} L${cx + 140},${cy - 2} Z" fill="${DIMF}"/>`;
  [[-80, 30], [-20, 20], [40, 34], [90, 14], [0, -6], [-60, 2]].forEach(([dx, dy]) => s += `<rect x="${cx + dx - 14}" y="${cy + dy - 10}" width="28" height="20" rx="3" transform="rotate(${dx % 30} ${cx + dx} ${cy + dy})" ${sw(c, 3)}/>`);
  return s;
}
scene('limite', { make: (W) => ({
  capAt: W('ma'), last: W('sono', 1),
  render(t) {
    let s = '';
    s += E(t, W('risorse') - 0.05, heap(560, 470, C.line) + lbl(560, 610, 'RISORSE NATURALI'), { dy: 12 });
    s += E(t, W('abbondanti') - 0.05, IT(560, 300, 'abbondanti?', { a: 'middle', size: 60 }), { dy: 8 });
    s += E(t, W('spazio') - 0.05, landfill(1360, 470, C.line) + lbl(1360, 610, 'SPAZIO PER I RIFIUTI'), { dy: 12 });
    s += E(t, W('illimitato') - 0.05, IT(1360, 300, 'illimitato?', { a: 'middle', size: 60 }), { dy: 8 });
    s += cross(785, 280, 30, C.line, (t - W('ma')) / 0.35, 8);
    s += cross(1565, 280, 30, C.line, (t - W('ma') - 0.15) / 0.35, 8);
    return s + caption(t, W('ma'), 'Non lo sono', 'Non', false, true);
  } }) });

// 3 — economia circolare: dalla culla alla culla
scene('circolare', { make: (W) => ({
  capAt: W('culla'), last: W('culla', 1),
  render(t) {
    let s = '';
    const cx = 960, cy = 480, r = 250;
    // la linea retta del modello lineare svanisce
    const fade = 1 - ss((t - W('circolare')) / 0.6);
    if (fade > 0) s += `<g opacity="${(fade * 0.9).toFixed(3)}">${arrow(300, cy, 1560, cy, C.line, 4)}${icBin(1660, cy, C.line)}${lbl(930, cy - 40, 'MODELLO LINEARE')}</g>`;
    // il cerchio corallo si chiude
    const p = ss((t - W('circolare')) / 1.6);
    s += arcArrow(cx, cy, r, r, -82, 254, C.coral, 9, p);
    s += E(t, W('alternativo') - 0.05, IT(cx, cy + 10, 'cradle-to-cradle', { a: 'middle', size: 58 }), { dy: 8 });
    s += E(t, W('alternativo') + 0.1, lbl(cx, cy + 66, 'MODELLO ALTERNATIVO'), { dy: 6 });
    s += E(t, W('culla') - 0.05, `<circle cx="${cx}" cy="${cy - r}" r="74" fill="${C.bg}"/>` + icCradle(cx, cy - r - 4, C.line) + lbl(cx + 110, cy - r - 30, 'CULLA', { a: 'start' }), { dy: 8 });
    s += E(t, W('culla', 1) - 0.05, lbl(cx + 110, cy - r + 10, '→ DI NUOVO CULLA', { a: 'start' }), { dy: 6 });
    return s + caption(t, W('culla'), 'Dalla culla alla culla', '');
  } }) });

// 4 — riusati, riparati o riciclati: tre ritorni alternativi, il prodotto resta in ciclo
function spoke(x1, y1, x2, y2, r1, r2, c, p) { // andata e ritorno paralleli fra due nodi
  const a = Math.atan2(y2 - y1, x2 - x1), ux = Math.cos(a), uy = Math.sin(a), nx = -uy * 14, ny = ux * 14;
  const ax = x1 + ux * (r1 + 10), ay = y1 + uy * (r1 + 10), bx = x2 - ux * (r2 + 10), by = y2 - uy * (r2 + 10);
  let o = '';
  if (p > 0) o += arrow(ax + nx, ay + ny, lerp(ax, bx, clamp(p * 2)) + nx, lerp(ay, by, clamp(p * 2)) + ny, c, 4);
  if (p > 0.5) o += arrow(bx - nx, by - ny, lerp(bx, ax, clamp(p * 2 - 1)) - nx, lerp(by, ay, clamp(p * 2 - 1)) - ny, c, 4);
  return o;
}
scene('ciclo', { make: (W) => ({
  capAt: W('ciclo'), last: W('lungo'),
  render(t) {
    let s = '';
    const cx = 960, cy = 480;
    const ring = t > W('restando') - 0.05 ? C.coral : C.line;
    s += E(t, -0.3, `<circle cx="${cx}" cy="${cy}" r="84" fill="${C.bg}" stroke="${ring}" stroke-width="${ring === C.coral ? 7 : 4}"/>` + icBox(cx, cy - 6, C.line) + lbl(cx - 104, cy + 10, 'PRODOTTO', { a: 'end' }), { dy: 8 });
    const N = [[600, 330, icJar, 'RIUSO', 'riusati', [600, 450, 'middle']], [1320, 330, icWrench, 'RIPARAZIONE', 'riparati', [1320, 450, 'middle']],
      [960, 790, icRecycle, 'RICICLO', 'riciclati', [1060, 800, 'start']]];
    N.forEach(([x, y, ic, l, w, [lx, ly, la]]) => {
      s += E(t, W(w) - 0.05, node(x, y, 70, C.line) + ic(x, y, C.line) + lbl(lx, ly, l, { a: la }), { dy: 10 });
      s += spoke(cx, cy, x, y, 84, 70, C.line, (t - W(w) + 0.05) / 0.7);
    });
    s += E(t, W('progettati') - 0.05, lbl(1380, 720, 'TRE RITORNI', { a: 'start' }) + lbl(1380, 760, 'ALTERNATIVI', { a: 'start' }), { dy: 6 });
    s += E(t, W('lungo') - 0.05, lbl(540, 720, 'IL PIÙ A LUNGO', { a: 'end' }) + lbl(540, 760, 'POSSIBILE', { a: 'end' }), { dy: 6 });
    return s + caption(t, W('ciclo'), 'Restare in ciclo', '');
  } }) });

// 5 — l'obiettivo (registro chiaro)
scene('obiettivo', { make: (W) => ({
  capAt: W('produrli'), last: W('produrli'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 650), { dy: 0 });
    s += E(t, 0.05, lbl(960, 270, "L'OBIETTIVO", { fill: C.ink }), { dy: 6 });
    s += words(t, W('eliminare') - 0.05, 960, 390, 'Eliminare i rifiuti come concetto', { f: 'pop', size: 70, fill: C.ink, a: 'middle' });
    s += E(t, W('gestirli') - 0.15, T(960, 540, 'non gestirli', { f: 'serif', it: true, size: 76, a: 'middle', fill: C.ink }), { dy: 10 });
    const ps = ss((t - W('ma')) / 0.4), w = tw('non gestirli', 'serif', 76, true);
    if (ps > 0) s += `<line x1="${960 - w / 2 - 10}" y1="516" x2="${(960 - w / 2 - 10 + (w + 20) * ps).toFixed(1)}" y2="516" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
    s += E(t, W('ma') - 0.05, T(960, 700, 'ma non produrli', { f: 'pop', size: 96, a: 'middle', fill: C.coralD }), { dy: 12 });
    return s + caption(t, W('produrli'), 'Non produrli', '', true);
  } }) });

// 6 — le 4R in ordine di priorità (registro chiaro)
scene('4r', { make: (W) => ({
  capAt: W('erre'), last: W('recuperare'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 650), { dy: 0 });
    s += E(t, 0.0, lbl(300, 262, 'LE 4R · IN ORDINE DI PRIORITÀ', { a: 'start', fill: C.ink }), { dy: 6 });
    const R4 = [['ridurre', 'RIDURRE', 1000], ['riusare', 'RIUSARE', 820], ['riciclare', 'RICICLARE', 640], ['recuperare', 'RECUPERARE', 460]];
    R4.forEach(([w, l, wd], i) => {
      const y = 300 + i * 116;
      const on = t > W(w) - 0.05;
      s += E(t, 0.1 + i * 0.1, `<rect x="300" y="${y}" width="${wd}" height="88" rx="12" fill="${on && i === 0 ? C.coral : C.cream}" stroke="${C.ink}" stroke-width="3"/>` +
        T(330, y + 58, `${i + 1}ª`, { f: 'mono', size: 30, fill: C.ink, w: 700 }), { dy: 8 });
      s += E(t, W(w) - 0.05, T(400, y + 62, l, { f: 'pop', size: 46, fill: C.ink }), { dy: 10 });
    });
    s += E(t, W('ridurre') + 0.1, lbl(1330, 356, 'PIÙ IMPORTANTE', { a: 'start', fill: C.ink }), { dy: 6 });
    s += E(t, W('recuperare') + 0.1, lbl(790, 704, 'MENO EFFICIENTE', { a: 'start', fill: C.ink }), { dy: 6 });
    return s + caption(t, W('erre'), 'Le 4R', '', true);
  } }) });

// 7 — ridurre viene prima
scene('ridurre', { make: (W) => ({
  capAt: W('prima'), last: W('gestito') + 0.1,
  render(t) {
    let s = E(t, 0.0, pillTag(960, 230, '1ª · RIDURRE', C.line, C.bg, 'middle'), { dy: 8 });
    // un rifiuto che non esiste: il cestino è solo un contorno tratteggiato (unico corallo)
    s += E(t, W('rifiuto') - 0.05, icBin(620, 500, C.coral, true), { dy: 10 });
    s += E(t, W('esiste') - 0.05, lbl(620, 640, 'UN RIFIUTO') + lbl(620, 680, 'CHE NON ESISTE'), { dy: 6 });
    s += E(t, W('rifiuto') + 0.4, arrow(780, 500, 1140, 500, C.line, 4), { dy: 0 });
    s += E(t, W('non', 1) - 0.05, icTruck(1320, 490, C.line) + lbl(1320, 640, 'NON VA') + lbl(1320, 680, 'GESTITO'), { dy: 10 });
    s += cross(1320, 500, 100, C.line, (t - W('deve')) / 0.45, 8);
    return s + caption(t, W('prima'), 'Prima: ridurre', '');
  } }) });

// 8 — recuperare: meglio della discarica, peggio delle altre tre
scene('recuperare', { make: (W) => ({
  capAt: W('ultima'), last: W('tre'),
  render(t) {
    let s = '';
    const rows = ['RIDURRE', 'RIUSARE', 'RICICLARE', 'RECUPERARE'], x0 = 300, wd = 560;
    rows.forEach((l, i) => {
      const y = 220 + i * 100, hi = i === 3 && t > W('recuperare') - 0.05;
      s += E(t, -0.3 + i * 0.08, `<rect x="${x0}" y="${y}" width="${wd}" height="72" rx="10" fill="${C.bg}" stroke="${hi ? C.coral : C.line}" stroke-width="${hi ? 6 : 3}"/>` +
        T(x0 + 26, y + 48, `${i + 1}ª`, { f: 'mono', size: 28, w: 700 }) + T(x0 + 96, y + 50, l, { f: 'pop', size: 38 }), { dy: 8 });
    });
    // spiegazione accanto a "recuperare"
    s += E(t, W('energia') - 0.05, icFlame(1000, 548, C.line) + lbl(1070, 540, 'RECUPERO ENERGETICO', { a: 'start' }) + lbl(1070, 580, 'DAI RIFIUTI NON RICICLABILI', { a: 'start' }), { dy: 8 });
    // discarica sotto
    s += E(t, W('discarica') - 0.05, `<line x1="${x0}" y1="642" x2="${x0 + wd}" y2="642" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 10"/>` +
      `<rect x="${x0}" y="672" width="${wd}" height="72" rx="10" fill="${C.bg}" stroke="${C.line}" stroke-width="3" stroke-dasharray="12 10"/>` + T(x0 + 96, 722, 'DISCARICA', { f: 'pop', size: 38 }), { dy: 8 });
    s += E(t, W('meglio') - 0.05, arrow(910, 700, 910, 556, C.line, 4) + lbl(950, 690, 'MEGLIO DELLA DISCARICA', { a: 'start' }), { dy: 0 });
    // le altre tre: meglio di recuperare
    s += E(t, W('peggio') - 0.05, `<path d="M890,222 h20 v270 h-20" ${sw(C.line, 4)}/>` + lbl(950, 366, 'LE ALTRE TRE:', { a: 'start' }) + lbl(950, 406, 'MEGLIO DI RECUPERARE', { a: 'start' }), { dy: 6 });
    return s + caption(t, W('ultima'), 'Ultima delle 4R', '');
  } }) });

// 9 — ciclo biologico
scene('bio', { make: (W) => ({
  capAt: W('biologico'), last: W('compostaggio') + 0.4,
  render(t) {
    let s = levels(t, -0.2, t > W('ciclo') - 0.05 ? 1 : 0, false);
    const cx = 960, cy = 590, rx = 360, ry = 180, a = W('ciclo') - 0.05;
    s += E(t, a, IT(cx, cy + 14, 'ciclo biologico', { a: 'middle', size: 56 }), { dy: 8 });
    // materiali organici
    s += E(t, W('cibo') - 0.05, node(cx - rx, cy, 86, C.line) + icLeaf(cx - rx, cy, C.line), { dy: 10 });
    s += E(t, W('cibo') - 0.05, lbl(cx - rx - 110, cy - 34, 'CIBO', { a: 'end' }), { dy: 6 });
    s += E(t, W('fibre') - 0.05, lbl(cx - rx - 110, cy + 8, 'FIBRE NATURALI', { a: 'end' }), { dy: 6 });
    s += E(t, W('legno') - 0.05, lbl(cx - rx - 110, cy + 50, 'LEGNO', { a: 'end' }), { dy: 6 });
    // ritorno all'ecosistema (arco corallo)
    const ea = edgeA(rx, ry, 98);
    s += arcArrow(cx, cy, rx, ry, 180 + ea, 360 - ea, C.coral, 7, ss((t - W('tornano')) / 0.9));
    s += E(t, W("all'ecosistema") - 0.05, node(cx + rx, cy, 86, C.line) + icSprout(cx + rx, cy + 4, C.line) + lbl(cx + rx + 110, cy + 10, 'ECOSISTEMA', { a: 'start' }), { dy: 10 });
    s += E(t, W('compostaggio') - 0.05, lbl(cx, cy - ry - 26, 'COMPOSTAGGIO'), { dy: 6 });
    s += E(t, W("all'ecosistema") + 0.3, arcArrow(cx, cy, rx, ry, ea, 180 - ea, C.line, 4), { dy: 0 });
    return s + caption(t, W('biologico'), 'Ciclo biologico', '');
  } }) });

// 10 — ciclo tecnico + cobalto della batteria
scene('tecnico', { make: (W) => ({
  capAt: W('tecnico'), last: W('batteria', 1),
  render(t) {
    let s = levels(t, -1, 2, false);
    const cx = 560, cy = 590, rx = 250, ry = 150;
    s += E(t, 0.0, IT(cx, cy + 14, 'ciclo tecnico', { a: 'middle', size: 50 }), { dy: 8 });
    s += E(t, W('metalli') - 0.05, node(cx - rx, cy, 76, C.line) + icIngot(cx - rx, cy + 4, C.line), { dy: 10 });
    s += E(t, W('metalli') - 0.05, lbl(cx - rx - 96, cy - 34, 'METALLI', { a: 'end' }), { dy: 6 });
    s += E(t, W('plastica') - 0.05, lbl(cx - rx - 96, cy + 8, 'PLASTICA', { a: 'end' }), { dy: 6 });
    s += E(t, W('vetro') - 0.05, lbl(cx - rx - 96, cy + 50, 'VETRO', { a: 'end' }), { dy: 6 });
    const ea = edgeA(rx, ry, 88);
    s += E(t, W('tornano') - 0.05, arcArrow(cx, cy, rx, ry, 180 + ea, 360 - ea, C.line, 4), { dy: 0 });
    s += E(t, W('produzione') - 0.05, node(cx + rx, cy, 76, C.line) + icFactory(cx + rx + 4, cy + 2, C.line, 0.85) + lbl(cx + rx + 100, cy + 10, 'PRODUZIONE', { a: 'start' }), { dy: 10 });
    s += E(t, W('produzione') + 0.3, arcArrow(cx, cy, rx, ry, ea, 180 - ea, C.line, 4), { dy: 0 });
    s += E(t, W('produzione') + 0.3, lbl(96, cy + 130, 'PLASTICA:', { a: 'start' }) + lbl(96, cy + 170, 'POCHI CICLI', { a: 'start' }), { dy: 6 });
    // esempio: il cobalto torna in una nuova batteria
    s += E(t, W('cobalto') - 0.05, `<rect x="1400" y="510" width="140" height="140" rx="14" fill="${C.coral}"/>` + T(1470, 604, 'Co', { f: 'pop', size: 70, a: 'middle', fill: C.ink }) +
      lbl(1470, 700, 'COBALTO') + lbl(1470, 740, 'RECUPERATO'), { dy: 10 });
    s += E(t, W('batteria') - 0.05, icBattery(1230, 580, C.line) + lbl(1230, 700, 'BATTERIA DI') + lbl(1230, 740, 'SMARTPHONE') + arrow(1290, 580, 1384, 580, C.line, 4), { dy: 10 });
    s += E(t, W('nuova') - 0.05, arrow(1556, 580, 1650, 580, C.line, 4) + icBattery(1720, 580, C.line) + lbl(1720, 700, 'NUOVA') + lbl(1720, 740, 'BATTERIA'), { dy: 10 });
    return s + caption(t, W('tecnico'), 'Ciclo tecnico', '');
  } }) });

// 11 — modello di servizio (registro chiaro)
scene('servizio', { make: (W) => ({
  capAt: W("l'uso"), last: W('ricicla'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 650), { dy: 0 });
    s += levels(t, -1, 3, true, 262);
    s += words(t, W('vende') - 0.1, 960, 370, "Si vende l'uso, non il prodotto", { f: 'pop', size: 62, fill: C.ink, a: 'middle', key: "l'uso", keyFill: C.coralD });
    const ax = 470, bx = 1450, y = 560;
    s += E(t, W('modello') - 0.05, icFactory(ax, y, C.ink) + lbl(ax, y + 120, 'AZIENDA', { fill: C.ink }), { dy: 10 });
    s += E(t, W('servizio') - 0.05, icPerson(bx, y, C.ink) + lbl(bx, y + 120, 'CLIENTE', { fill: C.ink }), { dy: 10 });
    // andata: il prodotto va in uso; ritorno a fine vita
    s += E(t, W("l'uso"), arrow(580, 470, 1340, 470, C.ink, 4) + lbl(960, 450, 'USO', { fill: C.ink }), { dy: 0 });
    const pGo = ss((t - W("l'uso")) / 1.0), pBack = ss((t - W('fine')) / 1.1);
    s += E(t, W('fine') - 0.05, arrow(1340, 650, 580, 650, C.ink, 4) + lbl(960, 740, 'A FINE VITA', { fill: C.ink }), { dy: 0 });
    if (t > W("l'uso")) {
      const bxp = pBack > 0 ? lerp(1240, 680, pBack) : lerp(680, 1240, pGo), byp = pBack > 0 ? 650 : 470;
      const g = t > W("l'azienda") - 0.05;
      s += `<g>${`<rect x="${bxp - 46}" y="${byp - 40}" width="92" height="80" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>` + `<path d="M${bxp - 46},${byp - 14} H${bxp + 46} M${bxp},${byp - 40} V${byp - 14}" ${sw(C.ink, 3)}/>`}</g>`;
      if (g && pBack <= 0) s += E(t, W('proprietaria') - 0.05, lbl(bxp, 560, 'PROPRIETÀ', { fill: C.ink }) + lbl(bxp, 596, "DELL'AZIENDA", { fill: C.ink }), { dy: 6 });
    }
    s += E(t, W('recupera') - 0.05, icRecycle(ax - 150, 740, C.ink, 30) + lbl(ax - 104, 750, 'RECUPERO E RICICLO', { fill: C.ink, a: 'start' }), { dy: 6 });
    return s + caption(t, W("l'uso"), "Vendere l'uso", '', true);
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.5, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Dalla culla alla culla', { f: 'pop', size: 116, a: 'middle', fill: C.ink }), { dy: 0 });
    s += words(t, W("l'economia") - 0.1, 960, 550, "L'economia circolare.", { f: 'serif', size: 68, fill: C.ink, a: 'middle', it: true, key: '' });
    s += E(t, W('circolare'), `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC SIS-3-02', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
