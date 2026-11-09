// L'angolo del sole: estate contro inverno — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.35);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.holdFrom != null) D = Math.max(D, def.holdFrom + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.line, ls: 3, a: o.a || 'middle', w: 600 });
function pillTag(x, y, s, ink, bg, a = 'start') {
  const w = tw(s, 'mono', 28) + 44, x0 = a === 'middle' ? x - w / 2 : x;
  return `<rect x="${x0}" y="${y - 35}" width="${w}" height="50" rx="25" fill="${bg}" stroke="${ink}" stroke-width="2"/>` + T(x0 + w / 2, y, s, { f: 'mono', size: 28, fill: ink, a: 'middle' });
}
const rad = d => d * Math.PI / 180;
const fmt = v => String(v).replace('.', ',') + '°';

// ---------- il sole ----------
function sunIcon(x, y, r, ink, t = 0, fl) {
  let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="${fl || mix(C.bg, ink, 0.18)}" stroke="${ink}" stroke-width="4"/>`;
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2 + t * 0.2, r1 = r + 12, r2 = r + 26 + 3 * Math.sin(t * 2 + i);
    s += `<line x1="${x + r1 * Math.cos(a)}" y1="${y + r1 * Math.sin(a)}" x2="${x + r2 * Math.cos(a)}" y2="${y + r2 * Math.sin(a)}" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return s;
}

// ---------- la volta del cielo in sezione (sud a sinistra) ----------
const DM = { cx: 1230, cy: 760, r: 440 };
const domePt = (a, r = DM.r) => [DM.cx - r * Math.cos(rad(a)), DM.cy - r * Math.sin(rad(a))];
function domeBase() {
  let s = `<path d="M${DM.cx - DM.r},${DM.cy} A${DM.r},${DM.r} 0 0 1 ${DM.cx + DM.r},${DM.cy}" fill="none" stroke="${C.lineDim}" stroke-width="2" stroke-dasharray="3 12"/>`;
  s += `<line x1="${DM.cx - DM.r - 120}" y1="${DM.cy}" x2="${DM.cx + DM.r + 120}" y2="${DM.cy}" stroke="${C.line}" stroke-width="3"/>`;
  for (let i = 0; i < 12; i++) { const x = DM.cx - DM.r - 90 + i * 90; s += `<line x1="${x}" y1="${DM.cy + 4}" x2="${x - 22}" y2="${DM.cy + 26}" stroke="${C.lineDim}" stroke-width="2"/>`; }
  // casetta-osservatore al centro
  const hx = DM.cx, hy = DM.cy;
  s += `<path d="M${hx - 46},${hy} L${hx - 46},${hy - 50} L${hx},${hy - 84} L${hx + 46},${hy - 50} L${hx + 46},${hy} z" fill="${C.bg}" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>`;
  s += lbl(DM.cx - DM.r - 40, DM.cy + 70, 'SUD') + lbl(DM.cx + DM.r + 40, DM.cy + 70, 'NORD');
  return s;
}
// raggio verso l'osservatore + arco dell'angolo
function domeAngle(a, o = {}) {
  const [sx, sy] = domePt(a, DM.r - 40), ink = o.ink || C.line, ra = o.ra || 170;
  let s = `<line x1="${sx}" y1="${sy}" x2="${DM.cx}" y2="${DM.cy - 2}" stroke="${ink}" stroke-width="3" stroke-dasharray="14 10"/>`;
  const [ex, ey] = domePt(a, ra);
  s += `<path d="M${DM.cx - ra},${DM.cy} A${ra},${ra} 0 0 1 ${ex},${ey}" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
  return s;
}
function ghostSun(a, label) {
  const [x, y] = domePt(a);
  const [lx, ly] = domePt(a, DM.r + 78);
  return `<circle cx="${x}" cy="${y}" r="22" fill="${C.bg}" stroke="${C.line}" stroke-width="3" stroke-dasharray="4 6"/>` +
    T(lx, ly + 9, label, { f: 'mono', size: 26, fill: C.line, a: 'middle', w: 600 });
}
// sole che si sposta da a0 ad a1 fra t0 e t1
function movingSun(t, a0, a1, t0, t1, ink) {
  const a = lerp(a0, a1, eio((t - t0) / (t1 - t0)));
  const [x, y] = domePt(a);
  return { a, s: sunIcon(x, y, 32, ink, t) };
}
// pannello di sinistra: data, evento, numero grande, nota
function leftPanel(t, W, o) {
  let s = '';
  s += E(t, o.tDate, lbl(110, 330, o.date, { a: 'start', size: 30 }));
  s += E(t, o.tEv, T(110, 390, o.ev, { f: 'popm', size: 40 }));
  s += E(t, o.tNum, T(104, 560, o.num, { f: 'pop', size: 170 }));
  if (o.note) s += E(t, o.tNote, T(112, 650, o.note, { f: 'serif', size: 64, it: true }));
  return s;
}

// ---------- la casa in sezione (sud a sinistra) ----------
// parete sud: faccia esterna x=760, spessore 30; finestra 570..810; solaio 480..510; suolo y=900; parete nord 1530..1560
const HS = { X: 760, WT: 570, WB: 810, CEIL: 510, SLAB: 480, G: 900, NX: 1530, RIDGE: [1160, 330] };
function roofPts(d) { return { ex: HS.X - d, ey: HS.SLAB }; }
function houseSegs(d) {
  const { ex, ey } = roofPts(d), [rx, ry] = HS.RIDGE, X = HS.X;
  return [
    [ex, HS.CEIL, X, HS.CEIL], [ex, ey, ex, HS.CEIL], [ex, ey, rx, ry],      // aggetto: sotto, fronte, falda
    [X, HS.CEIL, X, HS.WT], [X, HS.WB, X, HS.G],                             // parete sud esterna
    [X, HS.WT, X + 30, HS.WT], [X, HS.WB, X + 30, HS.WB],                   // architrave e davanzale
    [-500, HS.G, X, HS.G], [X + 30, HS.G, HS.NX, HS.G],                     // suolo esterno, pavimento
    [HS.NX, HS.CEIL, HS.NX, HS.G], [X + 30, HS.CEIL, HS.NX, HS.CEIL]];      // parete nord, soffitto
}
function cast(px, py, dx, dy, segs) {
  let best = 1e9, hit = null;
  for (const [ax, ay, bx, by] of segs) {
    const ex = bx - ax, ey = by - ay, den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) continue;
    const u = ((ax - px) * ey - (ay - py) * ex) / den, v = ((ax - px) * dy - (ay - py) * dx) / den;
    if (u > 1e-6 && v >= -1e-6 && v <= 1 + 1e-6 && u < best) { best = u; hit = [px + dx * u, py + dy * u]; }
  }
  return { u: best, hit };
}
// raggi paralleli all'angolo a; p = avanzamento 0..1 (testa del fascio)
function sunRays(a, d, p, o = {}) {
  const dx = Math.cos(rad(a)), dy = Math.sin(rad(a)), segs = houseSegs(d);
  const sun = o.sun, ink = o.ink || C.line; let s = '', lit = [];
  const ys = o.ys || Array.from({ length: 15 }, (_, i) => 330 + i * 50);
  ys.forEach((ty, i) => {
    const tx = HS.X;
    const back = (tx - sun[0]) * dx + (ty - sun[1]) * dy;
    const ox = tx - dx * back, oy = ty - dy * back;
    const { u, hit } = cast(ox, oy, dx, dy, segs); if (!hit) return;
    const len = Math.min(u, p * 1900);
    if (len <= 0) return;
    const x2 = ox + dx * len, y2 = oy + dy * len, done = len >= u - 0.5;
    s += `<line x1="${ox}" y1="${oy}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="${o.sw || 3}" stroke-linecap="round" opacity="0.9"/>`;
    if (done) s += `<circle cx="${hit[0]}" cy="${hit[1]}" r="6" fill="${ink}"/>`;
    else s += arrow(x2 - dx * 30, y2 - dy * 30, x2, y2, ink, 3);
    if (done && hit[0] > HS.X + 25 && Math.abs(hit[1] - HS.G) < 1) lit.push(hit[0]);
  });
  return { s, lit };
}
// zona del pavimento illuminata, calcolata con molti raggi fitti
function litFloor(a, d) {
  const dx = Math.cos(rad(a)), dy = Math.sin(rad(a)), segs = houseSegs(d); let xs = [];
  for (let ty = HS.CEIL; ty <= HS.WB; ty += 1) {
    const ox = HS.X - dx * 900, oy = ty - dy * 900, { hit } = cast(ox, oy, dx, dy, segs);
    if (hit && hit[0] > HS.X + 25 && Math.abs(hit[1] - HS.G) < 1) xs.push(hit[0]);
  }
  return xs.length ? [Math.min(...xs), Math.max(...xs)] : null;
}
function house(d, o = {}) {
  const ink = o.ink || C.line, fill = o.fill || mix(C.bg, ink, 0.12), bg = o.bg || C.bg, eave = o.eave || ink;
  const { ex, ey } = roofPts(d), [rx, ry] = HS.RIDGE, X = HS.X, nE = HS.NX + 30 + 90;
  const yAt = x => ey + (x - ex) * (ry - ey) / (rx - ex);
  let s = '';
  // tetto (sezione piena) con falda nord simmetrica
  s += `<path d="M${X},${HS.CEIL} L${X},${yAt(X)} L${rx},${ry} L${nE},${HS.SLAB} L${nE},${HS.CEIL} z" fill="${fill}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  // muri
  s += `<rect x="${X}" y="${HS.CEIL}" width="30" height="${HS.WT - HS.CEIL}" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
  s += `<rect x="${X}" y="${HS.WB}" width="30" height="${HS.G - HS.WB}" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
  s += `<rect x="${HS.NX}" y="${HS.CEIL}" width="30" height="${HS.G - HS.CEIL}" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
  // vetro
  s += `<line x1="${X + 11}" y1="${HS.WT}" x2="${X + 11}" y2="${HS.WB}" stroke="${ink}" stroke-width="3"/><line x1="${X + 19}" y1="${HS.WT}" x2="${X + 19}" y2="${HS.WB}" stroke="${ink}" stroke-width="3"/>`;
  // suolo
  s += `<line x1="${o.gx0 ?? 0}" y1="${HS.G}" x2="${o.gx1 ?? 1920}" y2="${HS.G}" stroke="${ink}" stroke-width="4"/>`;
  if (!o.noHatch) for (let i = 0; i < 18; i++) { const x = 60 + i * 110; s += `<line x1="${x}" y1="${HS.G + 6}" x2="${x - 24}" y2="${HS.G + 30}" stroke="${o.hatch || C.lineDim}" stroke-width="2"/>`; }
  // aggetto (sporgenza oltre la parete)
  s += `<path d="M${ex},${HS.CEIL} L${ex},${ey} L${X},${yAt(X)} L${X},${HS.CEIL} z" fill="${o.eaveFill || fill}" stroke="${eave}" stroke-width="${eave === ink ? 4 : 6}" stroke-linejoin="round"/>`;
  return s;
}
function angleAt(x, y, a, r, ink, label) { // angolo fra orizzontale verso sud e direzione del sole
  const ex = x - r * Math.cos(rad(a)), ey = y - r * Math.sin(rad(a));
  let s = `<line x1="${x}" y1="${y}" x2="${x - r - 40}" y2="${y}" stroke="${ink}" stroke-width="3" stroke-dasharray="8 8"/>`;
  s += `<path d="M${x - r},${y} A${r},${r} 0 0 1 ${ex},${ey}" fill="none" stroke="${ink}" stroke-width="4"/>`;
  if (label) { const lx = x - (r + 50) * Math.cos(rad(a / 2)), ly = y - (r + 50) * Math.sin(rad(a / 2)); s += T(lx, ly + 12, label, { f: 'pop', size: 40, fill: ink, a: 'middle' }); }
  return s;
}
const sunFor = (a, k = 640) => [HS.X - 40 - Math.cos(rad(a)) * k, 690 - Math.sin(rad(a)) * k];

// ======================= SCENE =======================

// 1 — aggancio
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('estate'),
  holdFrom: W('roma'),
  render(t) {
    let s = E(t, -0.4, domeBase(), { dy: 0 });
    const a = 48 + 23.5 * Math.sin(t * 0.9 - 1.2);
    const [x, y] = domePt(a);
    s += E(t, 0.0, `<line x1="${x}" y1="${y}" x2="${DM.cx}" y2="${DM.cy - 2}" stroke="${C.line}" stroke-width="3" stroke-dasharray="14 10"/>` + sunIcon(x, y, 32, C.coral, t), { dy: 0 });
    s += words(t, 0.3, 110, 330, "L'angolo", { f: 'pop', size: 110 });
    s += words(t, 0.55, 110, 450, 'del sole', { f: 'pop', size: 110 });
    s += E(t, W('roma') - 0.1, pillTag(110, 580, 'ROMA · 42° NORD', C.line, C.bg));
    return s + caption(t, W('estate'), 'Estate contro inverno', '');
  } }) });

// 2 — estate 71,5°
scene('estate', { make: (W) => ({
  capAt: W('solstizio'),
  holdFrom: W('quasi'),
  render(t) {
    let s = E(t, -0.4, domeBase(), { dy: 0 });
    const m = movingSun(t, 0, 71.5, 0.3, W('settantuno'), C.coral);
    s += domeAngle(m.a) + m.s;
    s += leftPanel(t, W, { date: '21 GIUGNO', tDate: W('ventuno') - 0.1, ev: "solstizio d'estate", tEv: W('solstizio') - 0.1, num: '71,5°', tNum: W('settantuno') - 0.05, note: 'quasi verticale', tNote: W('quasi') - 0.1 });
    s += E(t, 0.1, lbl(110, 255, 'ALTEZZA A MEZZOGIORNO', { a: 'start', size: 26 }));
    return s + caption(t, W('solstizio'), 'Estate: 71,5°', '');
  } }) });

// 3 — equinozi 48°
scene('equinozio', { make: (W) => ({
  capAt: W('equinozi'),
  holdFrom: W('quarantotto'),
  render(t) {
    let s = E(t, -0.4, domeBase() + ghostSun(71.5, '71,5°'), { dy: 0 });
    const m = movingSun(t, 71.5, 48, 0.4, W('quarantotto'), C.coral);
    s += domeAngle(m.a) + m.s;
    s += leftPanel(t, W, { date: '21 MARZO · 21 SETTEMBRE', tDate: W('ventuno') - 0.1, ev: 'equinozi', tEv: W('equinozi') - 0.1, num: '48°', tNum: W('quarantotto') - 0.05 });
    s += E(t, 0.1, lbl(110, 255, 'ALTEZZA A MEZZOGIORNO', { a: 'start', size: 26 }));
    return s + caption(t, W('equinozi'), 'Equinozi: 48°', '');
  } }) });

// 4 — inverno 24,5°
scene('inverno', { make: (W) => ({
  capAt: W('solstizio'),
  holdFrom: W('molto'),
  render(t) {
    let s = E(t, -0.4, domeBase() + ghostSun(71.5, '71,5°') + ghostSun(48, '48°'), { dy: 0 });
    const m = movingSun(t, 48, 24.5, 0.4, W('ventiquattro'), C.coral);
    s += domeAngle(m.a) + m.s;
    s += leftPanel(t, W, { date: '21 DICEMBRE', tDate: W('ventuno') - 0.1, ev: "solstizio d'inverno", tEv: W('solstizio') - 0.1, num: '24,5°', tNum: W('ventiquattro') - 0.05, note: 'molto basso', tNote: W('molto') - 0.1 });
    s += E(t, 0.1, lbl(110, 255, 'ALTEZZA A MEZZOGIORNO', { a: 'start', size: 26 }));
    return s + caption(t, W('solstizio'), 'Inverno: 24,5°', '');
  } }) });

// 5 — l'aggetto (registro chiaro)
scene('aggetto', { make: (W) => ({
  capAt: W("l'aggetto"),
  holdFrom: W('sporge'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, I = C.ink;
    let g = E(t, -0.4, card(150, 150, 1620, 700, { rot: -0.6 }), { dy: 0 });
    g += E(t, 0.05, T(220, 240, "COS'È UN AGGETTO", { f: 'mono', size: 30, fill: I, ls: 3, w: 700 }));
    const hs = 0.7, tx = 430 - 650 * hs, ty = 340 - 330 * hs;
    const hd = house(110, { ink: I, fill: mix(C.cream, I, 0.12), eave: C.coral, eaveFill: mix(C.cream, C.coral, 0.25), noHatch: true, gx0: 420, gx1: 1700 });
    g += E(t, 0.15, `<g transform="translate(${tx},${ty}) scale(${hs})">${hd}</g>`, { dy: 10 });
    const P = (x, y) => [tx + x * hs, ty + y * hs];
    const [ax, ay] = P(670, 492);
    g += E(t, W('bordo') - 0.1, `<line x1="${ax}" y1="${ay - 6}" x2="${ax - 50}" y2="${ay - 64}" stroke="${I}" stroke-width="3"/>` + T(ax - 50, ay - 80, 'BORDO DEL TETTO', { f: 'mono', size: 26, fill: I, a: 'middle', w: 700, ls: 2 }));
    const [wx, wy] = P(760, 690);
    g += E(t, W('finestra') - 0.1, `<line x1="${wx - 8}" y1="${wy}" x2="${wx - 100}" y2="${wy}" stroke="${I}" stroke-width="3"/>` + T(wx - 112, wy + 9, 'FINESTRA', { f: 'mono', size: 26, fill: I, a: 'end', w: 700, ls: 2 }));
    g += E(t, W('sporge') - 0.1, T(860, 810, 'sporge sopra la finestra', { f: 'serif', size: 52, fill: I, it: true, a: 'middle' }));
    const bx = 1340, by = 280;
    g += E(t, W('balcone') - 0.15, `<rect x="${bx}" y="${by}" width="340" height="440" rx="12" fill="${C.cream}" stroke="${I}" stroke-width="3"/>` +
      `<rect x="${bx + 200}" y="${by + 30}" width="34" height="370" fill="${mix(C.cream, I, 0.12)}" stroke="${I}" stroke-width="3"/>` +
      `<rect x="${bx + 70}" y="${by + 150}" width="164" height="26" fill="${mix(C.cream, I, 0.12)}" stroke="${I}" stroke-width="3"/>` +
      `<path d="M${bx + 74},${by + 150} L${bx + 74},${by + 80} L${bx + 200},${by + 80}" fill="none" stroke="${I}" stroke-width="3"/>` +
      [0, 1, 2, 3].map(i => `<line x1="${bx + 96 + i * 28}" y1="${by + 80}" x2="${bx + 96 + i * 28}" y2="${by + 150}" stroke="${I}" stroke-width="2"/>`).join('') +
      `<rect x="${bx + 200}" y="${by + 220}" width="34" height="150" fill="${C.cream}" stroke="${I}" stroke-width="3"/><line x1="${bx + 217}" y1="${by + 220}" x2="${bx + 217}" y2="${by + 370}" stroke="${I}" stroke-width="3"/>` +
      T(bx + 170, by + 485, 'oppure un BALCONE', { f: 'mono', size: 26, fill: I, a: 'middle', w: 700, ls: 2 }));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W("l'aggetto"), "L'aggetto", '', true);
  } }) });

// gruppo della casa in sezione, rimpicciolito per far stare il sole estivo
const HG = inner => `<g transform="translate(960,900) scale(0.82) translate(-960,-900)">${inner}</g>`;
const tagBox = (x, y, s, size = 30) => { const w = tw(s, 'mono', size) + 36; return `<rect x="${x - w / 2}" y="${y - size - 6}" width="${w}" height="${size + 24}" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` + T(x, y, s, { f: 'mono', size, fill: C.line, a: 'middle', w: 600 }); };
function angleBox(x, y, a, r, label) {
  const ex = x - r * Math.cos(rad(a)), ey = y - r * Math.sin(rad(a));
  let s = `<line x1="${x}" y1="${y}" x2="${x - r - 40}" y2="${y}" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>`;
  s += `<path d="M${x - r},${y} A${r},${r} 0 0 1 ${ex},${ey}" fill="none" stroke="${C.line}" stroke-width="4"/>`;
  const w = tw(label, 'pop', 44) + 30, lx = x - r - 40 - w, ly = y - 40;
  s += `<rect x="${lx}" y="${ly - 40}" width="${w}" height="64" rx="10" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` + T(lx + w / 2, ly + 8, label, { f: 'pop', size: 44, a: 'middle' });
  return s;
}
function compass(t) {
  return E(t, 0.1, arrow(300, 180, 140, 180, C.line, 3) + lbl(320, 190, 'SUD', { a: 'start', size: 28 }) + arrow(1620, 180, 1780, 180, C.line, 3) + lbl(1600, 190, 'NORD', { a: 'end', size: 28 }));
}
const DD = 110; // profondità dell'aggetto nel disegno
// 6 — estate: l'aggetto blocca il sole
scene('blocca', { make: (W) => ({
  capAt: W('blocca') - 0.4,
  holdFrom: W('luce'),
  render(t) {
    const a = 71.5, sun = sunFor(a);
    let h = house(DD, { eave: C.coral, eaveFill: mix(C.bg, C.coral, 0.2) }) + sunIcon(sun[0], sun[1], 40, C.line, t);
    h += sunRays(a, DD, eo((t - 0.6) / 2.2) * 0.9 + clamp((t - 2.8) / 1.5) * 0.1, { sun }).s;
    const sh = HS.CEIL + DD * Math.tan(rad(a));
    if (t > W("l'aggetto") - 0.1) h += E(t, W("l'aggetto") - 0.1, `<line x1="${HS.X - DD}" y1="${HS.CEIL}" x2="${HS.X}" y2="${sh}" stroke="${C.line}" stroke-width="3" stroke-dasharray="6 8"/>`, { dy: 0 });
    let s = E(t, -0.4, HG(h), { dy: 0 });
    s += E(t, W('alto') - 0.1, HG(angleBox(HS.X - DD, HS.CEIL, a, 80, '71,5°')));
    s += E(t, W("l'aggetto") - 0.1, lbl(1040, 690, 'FINESTRA IN OMBRA', { a: 'start', size: 28 }));
    s += E(t, W('luce') - 0.1, T(1160, 780, 'la luce non entra', { f: 'serif', size: 60, it: true, a: 'middle' }));
    s += E(t, 0.1, lbl(1780, 270, 'ESTATE', { a: 'end', size: 32 })) + compass(t);
    return s + caption(t, W('blocca') - 0.4, 'Estate: sole bloccato', '');
  } }) });

// 7 — inverno: la luce entra in profondità
scene('entra', { make: (W) => ({
  capAt: W('luce'),
  holdFrom: W('profondità'),
  render(t) {
    const a = 24.5, sun = sunFor(a, 700);
    let h = house(DD) + sunIcon(sun[0], sun[1], 40, C.line, t);
    h += sunRays(a, DD, eo((t - 0.5) / 3.6), { sun, ys: Array.from({ length: 16 }, (_, i) => 330 + i * 40) }).s;
    const lf = litFloor(a, DD);
    const p = eo((t - W('profondità') + 0.3) / 0.8);
    if (p > 0) h += `<rect x="${lf[0]}" y="${HS.G - 16}" width="${(lf[1] - lf[0]) * p}" height="16" fill="${C.coral}"/>`;
    let s = E(t, -0.4, HG(h), { dy: 0 });
    s += E(t, W('basso') - 0.1, HG(angleBox(HS.X - DD, HS.CEIL, a, 110, '24,5°')));
    const cx = 960 + ((lf[0] + lf[1]) / 2 - 960) * 0.82;
    s += E(t, W('profondità') - 0.1, tagBox(cx, 800, 'LUCE IN PROFONDITÀ'));
    s += E(t, 0.1, lbl(1780, 270, 'INVERNO', { a: 'end', size: 32 })) + compass(t);
    return s + caption(t, W('luce'), 'Inverno: luce dentro', '');
  } }) });

// 8 — la giusta profondità
scene('profondita', { make: (W) => ({
  capAt: W('giusta'),
  holdFrom: W('latitudine'),
  render(t) {
    const a = 71.5, sun = sunFor(a);
    const d = lerp(25, DD, eio((t - W('giusta')) / 1.6));
    let h = house(d, { eave: C.coral, eaveFill: mix(C.bg, C.coral, 0.2) }) + sunIcon(sun[0], sun[1], 40, C.line, t) + sunRays(a, d, 1, { sun }).s;
    let s = E(t, -0.4, HG(h), { dy: 0 });
    const qy = HS.SLAB - 80;
    s += E(t, W('profondità') - 0.2, HG(`<line x1="${HS.X - d}" y1="${qy}" x2="${HS.X}" y2="${qy}" stroke="${C.line}" stroke-width="4"/><line x1="${HS.X - d}" y1="${qy - 14}" x2="${HS.X - d}" y2="${qy + 14}" stroke="${C.line}" stroke-width="4"/><line x1="${HS.X}" y1="${qy - 14}" x2="${HS.X}" y2="${qy + 14}" stroke="${C.line}" stroke-width="4"/>` +
      tagBox(HS.X - d / 2, qy - 46, 'PROFONDITÀ')));
    const fx = HS.X + 80;
    s += E(t, W("dall'altezza") - 0.1, HG(`<line x1="${fx}" y1="${HS.WT}" x2="${fx}" y2="${HS.WB}" stroke="${C.line}" stroke-width="4"/><line x1="${fx - 14}" y1="${HS.WT}" x2="${fx + 14}" y2="${HS.WT}" stroke="${C.line}" stroke-width="4"/><line x1="${fx - 14}" y1="${HS.WB}" x2="${fx + 14}" y2="${HS.WB}" stroke="${C.line}" stroke-width="4"/>` +
      lbl(fx + 34, (HS.WT + HS.WB) / 2 - 8, 'ALTEZZA', { a: 'start', size: 32 }) + lbl(fx + 34, (HS.WT + HS.WB) / 2 + 34, 'FINESTRA', { a: 'start', size: 32 })));
    s += E(t, W('latitudine') - 0.1, pillTag(1330, 690, 'LATITUDINE', C.line, C.bg));
    s += E(t, 0.1, pillTag(1560, 360, 'ESEMPIO', C.line, C.bg)) + E(t, 0.1, lbl(1780, 270, 'ESTATE', { a: 'end', size: 32 })) + compass(t);
    return s + caption(t, W('giusta'), 'La giusta profondità', '');
  } }) });

// 9 — la formula (registro chiaro)
scene('formula', { make: (W) => ({
  capAt: W('formula'),
  holdFrom: W("d'inverno"),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, I = C.ink;
    let g = E(t, -0.4, card(150, 150, 1620, 680, { rot: 0.5 }), { dy: 0 });
    g += E(t, 0.05, T(230, 250, 'ALTEZZA DEL SOLE A MEZZOGIORNO', { f: 'mono', size: 30, fill: I, ls: 3, w: 700 }));
    const y = 420, fs = 66, parts = [['altezza =', 'formula', I], ['90°', 'novanta', I], ['− latitudine', 'meno', I], ['+', 'più', I], ['declinazione', 'più', C.coral]];
    let x = 230;
    parts.forEach(([txt, w, col]) => { g += E(t, W(w) - 0.1, T(x, y, txt, { f: 'pop', size: fs, fill: col })); x += tw(txt, 'pop', fs) + 30; });
    g += E(t, W('vale') - 0.1, `<line x1="230" y1="490" x2="1690" y2="490" stroke="${I}" stroke-width="2"/>` + T(230, 570, 'declinazione', { f: 'serif', size: 60, fill: I, it: true }));
    const row = (x, tt, v, lab) => E(t, tt, `<rect x="${x}" y="610" width="520" height="150" rx="16" fill="${C.cream}" stroke="${I}" stroke-width="3"/>` +
      T(x + 36, 668, lab, { f: 'mono', size: 28, fill: I, w: 700, ls: 3 }) + T(x + 36, 738, v, { f: 'pop', size: 64, fill: I }));
    g += row(560, W('più', 1) - 0.1, '+23,5°', 'ESTATE');
    g += row(1140, W('meno', 1) - 0.1, '−23,5°', 'INVERNO');
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('formula'), 'La formula', '', true);
  } }) });


// 10 — Milano: 47 gradi di differenza
scene('milano', { make: (W) => ({
  capAt: W('quarantasette'),
  holdFrom: W('quarantasette'),
  render(t) {
    let s = E(t, -0.4, domeBase(), { dy: 0 });
    const aS = 68.5, aW = 21.5;
    const sunAt = a => { const [x, y] = domePt(a); return sunIcon(x, y, 30, C.line, t); };
    s += E(t, W('sessantotto') - 0.1, domeAngle(aS, { ra: 300 }) + sunAt(aS), { dy: 0 });
    s += E(t, W('ventuno') - 0.1, domeAngle(aW, { ra: 300 }) + sunAt(aW), { dy: 0 });
    // arco della differenza (accento)
    const p = eo((t - W('quarantasette') + 0.1) / 0.9);
    if (p > 0) {
      const r = 200, a1 = lerp(aW, aS, p), [x0, y0] = domePt(aW, r), [x1, y1] = domePt(a1, r);
      s += `<path d="M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}" fill="none" stroke="${C.coral}" stroke-width="9" stroke-linecap="round"/>`;
    }
    s += E(t, W('quarantasette'), (() => { const [lx, ly] = domePt(45, 250); return T(lx, ly + 16, '47°', { f: 'pop', size: 44, a: 'middle' }); })());
    s += E(t, W('milano') - 0.1, pillTag(110, 270, 'MILANO · 45° NORD', C.line, C.bg));
    const row = (y, tt, a, b) => E(t, tt, lbl(110, y, a, { a: 'start', size: 28 }) + T(420, y + 6, b, { f: 'pop', size: 64 }));
    s += row(420, W('sessantotto') - 0.1, 'ESTATE', '68,5°');
    s += row(530, W('ventuno') - 0.1, 'INVERNO', '21,5°');
    s += row(640, W('quarantasette') - 0.1, 'DIFFERENZA', '47°');
    return s + caption(t, W('quarantasette'), '47° di differenza', '');
  } }) });

// 11 — conta il principio
scene('principio', { make: (W) => ({
  capAt: W('geometria'),
  holdFrom: W('prevedibile'),
  render(t) {
    let s = E(t, -0.4, domeBase() + ghostSun(71.5, '21 GIU') + ghostSun(48, '21 MAR · 21 SET') + ghostSun(24.5, '21 DIC'), { dy: 0 });
    // il sole ripete ogni anno lo stesso percorso a mezzogiorno
    const seq = [71.5, 48, 24.5, 48, 71.5], ph = Math.max(0, t - 0.4) / 1.1, i = Math.floor(ph) % 4, f = eio((ph % 1) * 1.6);
    const a = lerp(seq[i], seq[i + 1], f), [x, y] = domePt(a);
    s += E(t, -0.2, sunIcon(x, y, 32, C.coral, t), { dy: 0 });
    s += words(t, W('impararla') - 0.1, 110, 360, 'non serve impararla a memoria', { f: 'serif', size: 56, it: true });
    s += words(t, W('conta') - 0.1, 110, 480, 'conta il principio', { f: 'pop', size: 76 });
    s += E(t, W('prevedibile') - 0.1, pillTag(110, 600, 'OGNI ANNO, LO STESSO CICLO', C.line, C.bg));
    return s + caption(t, W('geometria'), 'Geometria prevedibile', '');
  } }) });

// 12 — chiusura
scene('finale', { L: 0.5, tail: 3.4, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg(); const I = C.ink;
    // piccola casa con aggetto e due raggi: estate fermato, inverno che entra
    const hs = 0.36, tx = 960 - 1100 * hs, ty = 330 - 900 * hs;
    let hd = house(DD, { ink: I, fill: mix(C.ivory, I, 0.12), noHatch: true, gx0: 300, gx1: 1800 });
    const sS = sunFor(71.5, 420), sW = sunFor(24.5, 560);
    hd += sunRays(71.5, DD, 1, { sun: sS, ink: I, sw: 7, ys: [380, 470, 560] }).s + sunRays(24.5, DD, 1, { sun: sW, ink: I, sw: 7, ys: [610, 680, 750] }).s;
    hd += sunIcon(sS[0], sS[1], 40, I, 0, C.cream) + sunIcon(sW[0], sW[1], 40, I, 0, C.cream);
    s += E(t, -0.4, `<g transform="translate(${tx},${ty}) scale(${hs})">${hd}</g>`, { dy: 0 });
    s += E(t, -0.4, T(960, 450, "L'angolo del sole", { f: 'pop', size: 104, fill: I, a: 'middle' }), { dy: 0 });
    s += words(t, W('strumento') - 0.1, 960, 570, 'uno strumento di controllo climatico passivo', { f: 'serif', size: 64, fill: I, a: 'middle', it: true, key: 'passivo' });
    s += E(t, W('passivo') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${I}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC AMB-2-04', { f: 'mono', size: 28, fill: I, a: 'middle', ls: 5 }));
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
