// Accumulo pompato: il gigante invisibile — MC-ENE-3-06. render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.4);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.6);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="#E3CDB4" stop-opacity="0.55"/><stop offset="1" stop-color="#E3CDB4" stop-opacity="0"/></radialGradient>
<pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="${C.coral}"/><line x1="0" y1="0" x2="0" y2="14" stroke="${C.cream}" stroke-width="4"/></pattern></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const WATER = mix(C.bg, C.line, 0.16), DIM2 = mix(C.bg, C.line, 0.2);
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const P = pts => 'M' + pts.map(p => p.join(',')).join(' L');
const rev = a => a.slice().reverse();

function flowLine(pts, t, c, o = {}) {
  const sw = o.sw || 6, sp = o.sp || 220, da = o.da || '18 22';
  return `<path d="${P(pts)}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${da}" stroke-dashoffset="${(-t * sp).toFixed(1)}"${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
}
function pipe(pts, w = 34, st = C.line, inner = C.bg) {
  return `<path d="${P(pts)}" fill="none" stroke="${st}" stroke-width="${w}" stroke-linejoin="round"/><path d="${P(pts)}" fill="none" stroke="${inner}" stroke-width="${w - 9}" stroke-linejoin="round"/>`;
}
function pylon(x, yb, yt, st) {
  const hw = 46;
  let s = `<path d="M${x - hw},${yb} L${x - 8},${yt} L${x + 8},${yt} L${x + hw},${yb}" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 1; i < 5; i++) { const y = yb - (yb - yt) * i / 5, w = hw - (hw - 8) * i / 5, y2 = yb - (yb - yt) * (i - 1) / 5, w2 = hw - (hw - 8) * (i - 1) / 5; s += `<path d="M${x - w2},${y2} L${x + w},${y} M${x + w2},${y2} L${x - w},${y}" stroke="${st}" stroke-width="2.5"/>`; }
  s += `<line x1="${x - 56}" y1="${yt + 30}" x2="${x + 56}" y2="${yt + 30}" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
  return s;
}
function iconWheel(cx, cy, ink, th, R = 44) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.bg}" stroke="${ink}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="9" fill="${ink}"/>`;
  for (let k = 0; k < 6; k++) { const a = th + k * Math.PI / 3; s += `<path d="M${(cx + 12 * Math.cos(a)).toFixed(1)},${(cy + 12 * Math.sin(a)).toFixed(1)} Q${(cx + R * 0.77 * Math.cos(a + 0.5)).toFixed(1)},${(cy + R * 0.77 * Math.sin(a + 0.5)).toFixed(1)} ${(cx + R * Math.cos(a + 0.2)).toFixed(1)},${(cy + R * Math.sin(a + 0.2)).toFixed(1)}" fill="none" stroke="${ink}" stroke-width="4"/>`; }
  return s;
}
function vArrow(x, y1, y2, c, sw = 5) {
  return `<line x1="${x}" y1="${y1 + 10}" x2="${x}" y2="${y2 - 10}" stroke="${c}" stroke-width="${sw}"/>` +
    `<path d="M${x},${y1} l-13,22 h26 z M${x},${y2} l-13,-22 h26 z" fill="${c}"/>`;
}
function waves(x1, x2, y, n = 2) {
  let s = '';
  for (let i = 0; i < n; i++) { const yy = y + 20 + i * 26, a = x1 + 40 + i * 30, b = x2 - 40 - i * 20; if (b - a < 60) break; s += `<path d="M${a},${yy} q20,-9 40,0 t40,0" fill="none" stroke="${C.line}" stroke-width="2.5" opacity="0.5"/>`; }
  return s;
}

// ---- mondo: montagna in sezione, bacino in quota, centrale in caverna, bacino a valle ----
// volumi coerenti (sezione 2D): 440 px x 60 px in alto  ≈  470 px x 56 px in basso
const UP_FULL = 300, UP_LOW = 360, LO_FULL = 725, LO_LOW = 781;
const PEN = [[590, 445], [660, 445], [985, 795]], TR = [[1105, 795], [1236, 795]];
const WP = [[1090, 742], [1090, 630], [1420, 560], [1766, 500]];
function land(t, o = {}) {
  const up = o.up ?? 330, lo = o.lo ?? 753;
  let s = `<path d="M0,240 L120,240 L140,300 L170,470 L600,470 L600,270 L650,270 L700,300 L900,520 L1150,690 L1210,700 L1240,840 L1660,840 L1700,700 L1920,700 L1920,1080 L0,1080 Z" fill="${C.earth}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>`;
  // condotta forzata nella montagna e canale di scarico
  s += pipe(PEN, 34) + pipe(TR, 34);
  // bacino in quota
  const xu = 140 + (up - 300) / 170 * 30;
  s += `<path d="M${xu.toFixed(1)},${up} L170,470 L600,470 L600,${up} Z" fill="${WATER}"/><line x1="${xu.toFixed(1)}" y1="${up}" x2="600" y2="${up}" stroke="${C.line}" stroke-width="3"/>` + waves(xu, 600, up);
  // bacino a valle
  const xl = 1210 + (lo - 700) / 140 * 30, xr = 1700 - (lo - 700) / 140 * 40;
  s += `<path d="M${xl.toFixed(1)},${lo} L1240,840 L1660,840 L${xr.toFixed(1)},${lo} Z" fill="${WATER}"/><line x1="${xl.toFixed(1)}" y1="${lo}" x2="${xr.toFixed(1)}" y2="${lo}" stroke="${C.line}" stroke-width="3"/>` + waves(xl, xr, lo, 1);
  // flussi d'acqua: pompa = dal basso verso l'alto; turbina = dall'alto verso il basso
  if (o.mode === 'pompa') s += flowLine(rev(TR), t, C.line, { sw: 7, sp: 200 }) + flowLine(rev(PEN), t, C.line, { sw: 7, sp: 200 });
  if (o.mode === 'turbina') s += flowLine(PEN, t, C.line, { sw: 7, sp: 200 }) + flowLine(TR, t, C.line, { sw: 7, sp: 200 });
  // centrale in caverna con la macchina reversibile
  s += `<rect x="985" y="742" width="120" height="104" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
  s += iconWheel(1045, 795, C.line, o.th || 0, 40);
  if (o.wire) {
    s += pylon(1820, 700, 470, C.line);
    s += `<path d="${P(WP)}" fill="none" stroke="${C.line}" stroke-width="3"/>`;
    // energia elettrica: dalla rete alla centrale (pompa) o dalla centrale alla rete (turbina)
    if (o.mode === 'pompa' && o.el) s += flowLine(rev(WP), t, C.line, { sw: 7, sp: 160, da: '10 30' });
    if (o.mode === 'turbina' && o.el) s += flowLine(WP, t, C.line, { sw: 7, sp: 160, da: '10 30' });
  }
  return s;
}
const basinLabels = (t, d = 0) => E(t, d + 0.1, lbl(385, 215, 'BACINO IN QUOTA'), { dy: 6 }) + E(t, d + 0.25, lbl(1455, 672, 'BACINO A VALLE'), { dy: 6 });
const machineLabel = (t, t0, s) => E(t, t0, lbl(1005, 420, s) + `<line x1="1005" y1="436" x2="1005" y2="736" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 8"/>`, { dy: 6 });

// ---- icone ----
function battery(cx, cy, st) {
  return `<rect x="${cx - 60}" y="${cy - 100}" width="120" height="200" rx="14" fill="none" stroke="${st}" stroke-width="5"/><rect x="${cx - 24}" y="${cy - 118}" width="48" height="18" rx="4" fill="${st}"/>` +
    `<line x1="${cx - 36}" y1="${cy + 40}" x2="${cx + 36}" y2="${cy + 40}" stroke="${st}" stroke-width="4"/><line x1="${cx - 36}" y1="${cy + 70}" x2="${cx + 36}" y2="${cy + 70}" stroke="${st}" stroke-width="4"/>` +
    `<path d="M${cx - 14},${cy - 60} h28 M${cx},${cy - 74} v28" stroke="${st}" stroke-width="4"/>`;
}
function tank(cx, cy, st) {
  return `<rect x="${cx - 64}" y="${cy - 90}" width="128" height="190" rx="60" fill="none" stroke="${st}" stroke-width="5"/><rect x="${cx - 14}" y="${cy - 116}" width="28" height="26" fill="none" stroke="${st}" stroke-width="4"/>` +
    T(cx - 4, cy + 22, 'H<tspan font-size="38" dy="12">2</tspan>', { f: 'pop', size: 64, a: 'middle', fill: st, raw: true });
}
function drop(cx, cy, fill) {
  return `<path d="M${cx},${cy - 110} C${cx + 30},${cy - 60} ${cx + 82},${cy - 6} ${cx + 82},${cy + 36} A82,82 0 0 1 ${cx - 82},${cy + 36} C${cx - 82},${cy - 6} ${cx - 30},${cy - 60} ${cx},${cy - 110} Z" fill="${fill}"/>` +
    `<path d="M${cx - 44},${cy + 30} A46,46 0 0 0 ${cx - 8},${cy + 76}" fill="none" stroke="${C.bg}" stroke-width="7" stroke-linecap="round"/>`;
}
function cross(cx, cy, r, st, p) {
  const a = clamp(p * 2), b = clamp(p * 2 - 1);
  if (a <= 0) return '';
  let s = `<line x1="${cx - r}" y1="${cy - r}" x2="${cx - r + 2 * r * a}" y2="${cy - r + 2 * r * a}" stroke="${st}" stroke-width="9" stroke-linecap="round"/>`;
  if (b > 0) s += `<line x1="${cx + r}" y1="${cy - r}" x2="${cx + r - 2 * r * b}" y2="${cy - r + 2 * r * b}" stroke="${st}" stroke-width="9" stroke-linecap="round"/>`;
  return s;
}
function check(cx, cy, st, p) {
  const a = clamp(p);
  const pts = [[cx - 40, cy], [cx - 10, cy + 32], [cx + 48, cy - 36]];
  const L1 = Math.hypot(30, 32), L2 = Math.hypot(58, 68), d = a * (L1 + L2);
  let path = `M${pts[0]}`;
  if (d <= L1) path += ` L${pts[0][0] + 30 * d / L1},${pts[0][1] + 32 * d / L1}`;
  else path += ` L${pts[1]} L${pts[1][0] + 58 * (d - L1) / L2},${pts[1][1] - 68 * (d - L1) / L2}`;
  return a > 0 ? `<path d="${path}" fill="none" stroke="${st}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>` : '';
}

// 1 — aggancio: né batterie, né idrogeno: acqua
scene('hook', { make: (W) => ({
  capAt: W("l'acqua"), last: W("l'acqua"),
  render(t) {
    let s = words(t, 0.1, 960, 270, 'Il sistema di accumulo più usato al mondo', { f: 'serif', it: true, size: 64, a: 'middle' });
    const y = 590;
    s += E(t, W('batterie') - 0.1, battery(560, y, C.line) + lbl(560, 760, 'BATTERIE'), { dy: 12 });
    s += cross(560, y, 110, C.line, (t - W('batterie') - 0.35) / 0.5);
    s += E(t, W('idrogeno') - 0.1, tank(960, y, C.line) + lbl(960, 760, 'IDROGENO'), { dy: 12 });
    s += cross(960, y, 110, C.line, (t - W('idrogeno') - 0.35) / 0.5);
    s += E(t, W('idrogeno') - 0.1, `<text x="956" y="${y + 26}" font-family="${F.pop}" font-weight="800" font-size="76" text-anchor="middle" fill="${C.line}" stroke="${C.bg}" stroke-width="14" paint-order="stroke" stroke-linejoin="round">H<tspan font-size="46" dy="14">2</tspan></text>`, { dy: 12 });
    s += pop(t, W('usa', 1) - 0.05, 1360, y, drop(1360, y, C.coral));
    s += E(t, W("l'acqua") - 0.1, lbl(1360, 760, 'ACQUA'), { dy: 8 });
    return s + caption(t, W("l'acqua"), "Usa l'acqua", '');
  } }) });

// 2 — il dato (registro chiaro)
scene('dato', { make: (W) => ({
  capAt: W('novanta'), last: W('accumulo'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 650), { dy: 0 });
    s += E(t, 0.05, T(960, 300, "L'accumulo pompato", { f: 'pop', size: 72, a: 'middle', fill: C.ink }), { dy: 10 });
    s += E(t, W('novanta') - 0.1, T(960, 500, '90%', { f: 'pop', size: 190, a: 'middle', fill: C.coralD }), { dy: 16 });
    s += E(t, W('capacità') - 0.1, lbl(960, 580, 'DELLA CAPACITÀ DI ACCUMULO INSTALLATA NEL MONDO', { fill: C.ink }), { dy: 6 });
    const bx = 360, bw = 1200, p = ss((t - W('tutta')) / 0.8);
    s += `<rect x="${bx}" y="630" width="${bw}" height="56" rx="10" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
    if (p > 0) s += `<rect x="${bx}" y="630" width="${(bw * 0.9 * p).toFixed(1)}" height="56" rx="10" fill="${C.ink}"/>`;
    s += E(t, W('tutta') + 0.6, lbl(bx + bw * 0.45, 740, 'ACCUMULO POMPATO 90%', { fill: C.ink }) + lbl(bx + bw * 0.95, 740, 'ALTRI', { fill: C.ink }), { dy: 6 });
    return s + caption(t, W('novanta'), "Il 90% dell'accumulo", '', true);
  } }) });

// 3 — due bacini a quote diverse
scene('bacini', { make: (W) => ({
  capAt: W('bacini'), last: W('quota'),
  render(t) {
    let s = E(t, -0.3, land(t, { up: 330, lo: 753 }), { dy: 0, blur: 6 });
    s += E(t, W('quote') - 0.1, `<line x1="604" y1="330" x2="1290" y2="330" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="10 10"/><line x1="1250" y1="753" x2="1300" y2="753" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="10 10"/>` +
      vArrow(1290, 330, 753, C.coral) + lbl(1316, 520, 'QUOTE DIVERSE', { a: 'start', fill: C.coral }), { dy: 0 });
    s += E(t, W('valle') - 0.1, lbl(1455, 672, 'BACINO A VALLE'), { dy: 6 });
    s += E(t, W('quota') - 0.1, lbl(385, 215, 'BACINO IN QUOTA'), { dy: 6 });
    s += E(t, 0.3, lbl(1005, 420, 'CENTRALE') + `<line x1="1005" y1="436" x2="1005" y2="736" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 8"/>`, { dy: 6 });
    return s + caption(t, W('bacini'), 'Due bacini', '');
  } }) });

// 4 — di notte: energia in eccesso (esempio)
function house(x, y, w, h, st, lit) {
  let s = `<path d="M${x},${y + h} V${y} L${x + w / 2},${y - w * 0.4} L${x + w},${y} V${y + h} Z" fill="${C.bg}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<rect x="${x + w / 2 - 16}" y="${y + 30}" width="32" height="36" fill="${lit ? st : 'none'}" stroke="${st}" stroke-width="3"/>`;
  return s;
}
scene('notte', { make: (W) => ({
  capAt: W('eccesso'), last: W('basso'),
  render(t) {
    let s = '';
    // cielo notturno a sinistra
    s += E(t, W('notte') - 0.15, `<path d="M420,250 A70,70 0 1 0 500,340 A56,56 0 1 1 420,250 Z" fill="${C.line}"/>` +
      [[200, 230], [300, 330], [640, 260], [700, 380], [250, 420]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${C.line}"/>`).join('') + lbl(450, 470, 'NOTTE'), { dy: 8 });
    s += E(t, 0.0, `<line x1="120" y1="800" x2="820" y2="800" stroke="${C.line}" stroke-width="4"/>` + house(160, 640, 150, 160, C.line, false) + house(360, 600, 170, 200, C.line, true) + house(580, 650, 140, 150, C.line, false), { dy: 0, blur: 6 });
    // barre: produzione e consumo (esempio, senza numeri)
    const base = 800, hp = 420, hc = 230, pg = ss((t - W('energia') + 0.1) / 0.6);
    s += `<line x1="1040" y1="${base}" x2="1720" y2="${base}" stroke="${C.line}" stroke-width="4"/>`;
    if (pg > 0) {
      s += `<rect x="1110" y="${base - hc * pg}" width="200" height="${hc * pg}" fill="${DIM2}" stroke="${C.line}" stroke-width="4"/>`;
      s += `<rect x="1450" y="${base - hc * pg}" width="200" height="${hc * pg}" fill="${DIM2}" stroke="${C.line}" stroke-width="4"/>`;
    }
    s += E(t, W('energia'), lbl(1210, 850, 'PRODUZIONE') + lbl(1550, 850, 'CONSUMO'), { dy: 6 });
    const pe = ss((t - W('eccesso') + 0.1) / 0.6);
    if (pe > 0) {
      s += `<line x1="1080" y1="${base - hc}" x2="1680" y2="${base - hc}" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="10 10"/>`;
      s += `<rect x="1110" y="${base - hc - (hp - hc) * pe}" width="200" height="${(hp - hc) * pe}" fill="${C.coral}" stroke="${C.line}" stroke-width="4"/>`;
    }
    s += E(t, W('eccesso') + 0.2, lbl(1210, base - hp - 30, 'IN ECCESSO'), { dy: 6 });
    s += E(t, W('basso') - 0.1, lbl(1550, base - hc - 30, 'CONSUMO BASSO'), { dy: 6 });
    s += E(t, 0.2, pillTag(1660, 230, 'ESEMPIO', C.line, C.bg, 'middle'), { dy: 0 });
    return s + caption(t, W('eccesso'), 'Energia in eccesso', '');
  } }) });

// 5 — pompaggio: l'acqua sale
scene('pompa', { make: (W) => ({
  capAt: W('spingere'), last: W('quota'),
  render(t, D) {
    const p0 = W('spingere') - 0.2, on = t > p0, p = ss((t - p0) / (D - p0 - 0.3));
    const el = t > W('elettriche') - 0.2;
    let s = land(t, { up: lerp(UP_LOW, UP_FULL, on ? p : 0), lo: lerp(LO_FULL, LO_LOW, on ? p : 0), mode: on ? 'pompa' : null, th: on ? -2.6 * (t - p0) : 0, wire: true, el });
    s += basinLabels(t);
    s += E(t, 0.3, lbl(1820, 445, 'RETE'), { dy: 6 });
    s += E(t, W('elettriche') - 0.1, lbl(1420, 505, 'ENERGIA DALLA RETE'), { dy: 6 });
    s += machineLabel(t, W('pompe') - 0.1, 'POMPE ELETTRICHE');
    // freccia corallo parallela alla condotta: l'acqua sale
    s += E(t, W('spingere'), arrow(936, 669, 736, 454, C.coral, 8), { dy: 0 });
    return s + caption(t, W('spingere'), "Acqua verso l'alto", '');
  } }) });

// 6 — m · g · h (registro chiaro)
scene('mgh', { make: (W) => ({
  capAt: W('energia'), last: W('altezza'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 650), { dy: 0 });
    // a sinistra: un volume d'acqua che sale di h
    const g = 740, rise = ss((t - 0.1) / 1.4), cy = lerp(680, 400, rise);
    s += `<line x1="270" y1="${g}" x2="640" y2="${g}" stroke="${C.ink}" stroke-width="4"/>`;
    s += `<rect x="380" y="${cy - 60}" width="120" height="120" rx="8" fill="${C.ivory}" stroke="${C.ink}" stroke-width="4"/>` + T(440, cy + 18, 'm', { f: 'serif', it: true, size: 64, a: 'middle', fill: C.ink });
    s += E(t, 0.1, arrow(300, 640, 300, 460, C.ink, 4), { dy: 0 });
    s += E(t, W('altezza') - 0.1, `<line x1="504" y1="${cy}" x2="590" y2="${cy}" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="8 8"/>` + vArrow(570, cy, g, C.ink, 4) + T(596, (cy + g) / 2 + 20, 'h', { f: 'serif', it: true, size: 60, fill: C.ink }), { dy: 0 });
    // a destra: la formula
    s += E(t, W('energia') - 0.1, lbl(1200, 280, 'ENERGIA POTENZIALE GRAVITAZIONALE', { fill: C.ink }), { dy: 6 });
    s += E(t, W('emme') - 0.1, T(1200, 500, 'm · g · h', { f: 'serif', it: true, size: 200, a: 'middle', fill: C.coralD }), { dy: 14 });
    const col = (x, w, a, b) => E(t, W(w) - 0.1, T(x, 640, a, { f: 'serif', it: true, size: 64, a: 'middle', fill: C.ink }) + lbl(x, 710, b, { fill: C.ink }), { dy: 8 });
    s += col(900, 'massa', 'm', 'MASSA') + col(1200, 'gravità', 'g', 'GRAVITÀ') + col(1500, 'altezza', 'h', 'ALTEZZA');
    return s + caption(t, W('energia'), 'Energia potenziale', '', true);
  } }) });

// 7 — più massa, più altezza: più energia (la barra segue m × h)
scene('altezza', { make: (W) => ({
  capAt: W('massa'), last: W('immagazzinata'),
  render(t) {
    const pm = ss((t - W('massa') + 0.1) / 0.7), ph = ss((t - W('altezza') + 0.1) / 0.8);
    const g = 800, wh = lerp(60, 160, pm), bot = lerp(600, 380, ph);
    const h = g - (bot - wh / 2), E0 = 80000, Ev = wh * h;
    let s = `<rect x="203" y="${g + 4}" width="974" height="34" fill="${WATER}"/><line x1="200" y1="${g}" x2="1180" y2="${g}" stroke="${C.line}" stroke-width="4"/>` + lbl(690, g + 76, 'BACINO A VALLE');
    // vasca in quota
    s += `<path d="M640,${bot - 190} V${bot} H1000 V${bot - 190}" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>`;
    s += `<rect x="643" y="${bot - wh}" width="354" height="${wh - 2}" fill="${WATER}"/><line x1="643" y1="${bot - wh}" x2="997" y2="${bot - wh}" stroke="${C.line}" stroke-width="3"/>`;
    s += T(820, bot - wh / 2 + 16, 'm', { f: 'serif', it: true, size: 54, a: 'middle' });
    s += `<line x1="560" y1="${bot - wh / 2}" x2="636" y2="${bot - wh / 2}" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 8"/>` + vArrow(560, bot - wh / 2, g, C.line, 4) + T(530, (bot - wh / 2 + g) / 2 + 18, 'h', { f: 'serif', it: true, size: 56, a: 'end' });
    s += E(t, W('massa') - 0.1, lbl(1040, bot - 210, "PIÙ MASSA D'ACQUA", { a: 'start' }), { dy: 6 });
    s += E(t, W('altezza') - 0.1, lbl(300, 300, 'PIÙ ALTEZZA', { a: 'start' }), { dy: 6 });
    // barra dell'energia (unico corallo): proporzionale a m × h
    const bh = 460 * Ev / E0;
    s += `<rect x="1460" y="${g - 460}" width="120" height="460" rx="10" fill="none" stroke="${C.line}" stroke-width="4"/><rect x="1466" y="${(g - bh + 6).toFixed(1)}" width="108" height="${(bh - 12).toFixed(1)}" rx="6" fill="${C.coral}"/>`;
    s += lbl(1520, g + 44, 'ENERGIA');
    s += E(t, W('energia') - 0.1, lbl(1520, g - 490, 'PIÙ ENERGIA'), { dy: 6 });
    return s + caption(t, W('massa'), 'Più massa, più altezza', '');
  } }) });

// 8 — scarica: l'acqua scende, le pompe diventano turbine
scene('scarica', { make: (W) => ({
  capAt: W('turbine'), last: W('elettricità'),
  render(t, D) {
    const p0 = W('scorre') - 0.2, on = t > p0, p = ss((t - p0) / (D - p0 - 0.3));
    let s = land(t, { up: lerp(UP_FULL, UP_LOW, on ? p : 0), lo: lerp(LO_LOW, LO_FULL, on ? p : 0), mode: on ? 'turbina' : null, th: on ? 2.6 * (t - p0) : 0, wire: true, el: t > W('elettricità') - 0.2 });
    s += basinLabels(t);
    s += E(t, 0.3, lbl(1820, 445, 'RETE'), { dy: 6 });
    if (t < W('elettricità') - 0.1) s += E(t, W('serve') - 0.1, lbl(1420, 505, 'SERVE ENERGIA'), { dy: 6 });
    s += E(t, W('scorre'), arrow(736, 454, 936, 669, C.coral, 8), { dy: 0 });
    s += E(t, W('pompe') - 0.1, `<line x1="1005" y1="436" x2="1005" y2="736" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 8"/>`, { dy: 6 });
    s += E(t, W('pompe') - 0.1, lbl(1005, 420, 'POMPE'), { dy: 6, x: t > W('turbine') - 0.1 ? -90 * ss((t - W('turbine') + 0.1) / 0.3) : 0 });
    s += E(t, W('turbine') - 0.1, lbl(980, 420, '→ TURBINE', { a: 'start' }), { dy: 6 });
    s += E(t, W('elettricità') - 0.1, lbl(1420, 505, 'ELETTRICITÀ ALLA RETE'), { dy: 6 });
    return s + caption(t, W('turbine'), 'Pompe come turbine', '');
  } }) });

// 9 — efficienza del ciclo (registro chiaro)
scene('resa', { make: (W) => ({
  capAt: W('settanta'), last: W('ottantacinque'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 650), { dy: 0 });
    s += E(t, 0.05, lbl(960, 260, 'EFFICIENZA DEL CICLO', { fill: C.ink }), { dy: 6 });
    s += E(t, W('settanta') - 0.1, T(960, 410, '70–85%', { f: 'pop', size: 150, a: 'middle', fill: C.ink }), { dy: 14 });
    const bx = 360, bw = 1200, u = bw / 100;
    const p1 = ss((t - W('cento', 1) + 0.1) / 0.6);
    s += E(t, W('cento', 1) - 0.1, lbl(bx, 490, 'USATI PER POMPARE: 100 kWh', { a: 'start', fill: C.ink }), { dy: 6 });
    if (p1 > 0) s += `<rect x="${bx}" y="510" width="${(bw * p1).toFixed(1)}" height="56" rx="8" fill="${C.ink}"/>`;
    const p2 = ss((t - W('recuperano') + 0.1) / 0.6), p3 = ss((t - W('ottantacinque') + 0.1) / 0.5);
    s += E(t, W('recuperano') - 0.1, lbl(bx, 640, 'RECUPERATI: DA 70 A 85 kWh', { a: 'start', fill: C.ink }), { dy: 6 });
    if (p2 > 0) {
      s += `<rect x="${bx}" y="660" width="${(70 * u * p2).toFixed(1)}" height="56" rx="8" fill="${C.ink}"/>`;
      if (p3 > 0) s += `<rect x="${bx + 70 * u}" y="660" width="${(15 * u * p3).toFixed(1)}" height="56" fill="url(#hatch)" stroke="${C.ink}" stroke-width="3"/>`;
      s += `<rect x="${bx}" y="660" width="${bw}" height="56" rx="8" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
    }
    s += E(t, W('settanta', 1) - 0.1, T(bx + 70 * u, 770, '70', { f: 'mono', size: 30, a: 'middle', fill: C.ink, w: 700 }), { dy: 6 });
    s += E(t, W('ottantacinque') - 0.1, T(bx + 85 * u, 770, '85', { f: 'mono', size: 30, a: 'middle', fill: C.ink, w: 700 }), { dy: 6 });
    return s + caption(t, W('settanta'), 'Efficienza 70–85%', '', true);
  } }) });

// 10 — nel mondo e in Italia (registro chiaro)
function alps(x, y, ink) {
  return `<path d="M${x},${y} L${x + 90},${y - 120} L${x + 140},${y - 70} L${x + 230},${y - 210} L${x + 300},${y - 110} L${x + 360},${y - 160} L${x + 470},${y}" fill="none" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M${x + 200},${y - 164} L${x + 230},${y - 210} L${x + 262},${y - 164} L${x + 246},${y - 172} L${x + 230},${y - 158} L${x + 214},${y - 172} Z" fill="${ink}"/>` +
    `<line x1="${x - 20}" y1="${y}" x2="${x + 490}" y2="${y}" stroke="${ink}" stroke-width="4"/>`;
}
scene('mondo', { make: (W) => ({
  capAt: W('centosettanta'), last: W('alpi'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 650), { dy: 0 });
    s += E(t, W('capacità') - 0.1, lbl(620, 290, 'CAPACITÀ INSTALLATA', { fill: C.ink }) + lbl(620, 330, 'NEL MONDO', { fill: C.ink }), { dy: 6 });
    s += E(t, W('supera') - 0.1, IT(620, 430, 'oltre', { a: 'middle', size: 60, fill: C.ink }), { dy: 8 });
    s += E(t, W('centosettanta') - 0.1, T(620, 590, '170 GW', { f: 'pop', size: 150, a: 'middle', fill: C.coralD }), { dy: 14 });
    s += E(t, W('gigawatt') - 0.1, lbl(620, 680, 'GW = GIGAWATT, UNA POTENZA', { fill: C.ink }), { dy: 6 });
    s += `<line x1="1080" y1="240" x2="1080" y2="750" stroke="${C.ink}" stroke-width="2" opacity="${clamp((t - W('italia') + 0.3) / 0.3)}"/>`;
    s += E(t, W('italia') - 0.1, lbl(1390, 290, 'ITALIA', { fill: C.ink }), { dy: 6 });
    s += E(t, W('impianti') - 0.1, IT(1390, 400, 'diversi impianti', { a: 'middle', size: 54, fill: C.ink }), { dy: 8 });
    s += E(t, W('alpi') - 0.1, alps(1160, 690, C.ink) + lbl(1390, 740, 'ALPI', { fill: C.ink }), { dy: 10 });
    return s + caption(t, W('centosettanta'), 'Oltre 170 GW', '', true);
  } }) });

// 11 — il limite: due bacini a quote diverse, abbastanza vicini
scene('limite', { make: (W) => ({
  capAt: W('non'), last: W('vicini'),
  render(t) {
    let s = '';
    // sinistra: due bacini alla stessa quota (pianura)
    s += E(t, W('serve') - 0.9, `<path d="M140,700 L240,700 L260,760 L420,760 L440,700 L560,700 L580,760 L740,760 L760,700 L860,700" fill="none" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M252,724 L268,760 L412,760 L428,724 Z M572,724 L588,760 L732,760 L748,724 Z" fill="${WATER}"/>` +
      `<line x1="200" y1="724" x2="800" y2="724" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="10 10"/>` + lbl(500, 820, 'STESSA QUOTA'), { dy: 10 });
    s += cross(500, 520, 70, C.line, (t - W('quote') - 0.1) / 0.5);
    // destra: due bacini a quote diverse e vicini
    s += E(t, W('quote') - 0.1, `<path d="M1040,420 L1100,420 L1120,470 L1300,470 L1320,420 L1360,420 L1560,700 L1580,760 L1760,760 L1780,700 L1860,700" fill="none" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M1108,440 L1124,470 L1296,470 L1312,440 Z M1572,724 L1588,760 L1772,760 L1788,724 Z" fill="${WATER}"/>` +
      `<line x1="1316" y1="440" x2="1500" y2="440" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="10 10"/>` +
      vArrow(1490, 440, 724, C.coral) + lbl(1300, 600, 'QUOTE DIVERSE', { a: 'end', fill: C.coral }), { dy: 10 });
    s += E(t, W('vicini') - 0.1, `<path d="M1210,350 H1680" fill="none" stroke="${C.line}" stroke-width="3"/><path d="M1210,330 V430 M1680,330 V712" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>` + lbl(1445, 310, 'ABBASTANZA VICINI'), { dy: 6 });
    s += check(1445, 830, C.line, (t - W('vicini') - 0.2) / 0.5);
    return s + caption(t, W('non'), 'Non ovunque', '');
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Il gigante invisibile', { f: 'pop', size: 120, a: 'middle', fill: C.ink }), { dy: 0 });
    s += words(t, W("l'acqua") - 0.1, 960, 550, "L'acqua che accumula energia.", { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: '' });
    s += E(t, W('energia'), `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC ENE-3-06', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
