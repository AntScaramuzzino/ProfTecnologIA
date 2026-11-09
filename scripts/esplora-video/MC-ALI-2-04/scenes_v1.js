// La catena del freddo (MC-ALI-2-04) — render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const capAt = def.capAt ?? null, nWords = (o.capText || sc.didascalia).split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (capAt != null) D = Math.max(D, capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<pattern id="hatchC" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="${C.cream}"/><line x1="0" y1="0" x2="0" y2="12" stroke="${C.coral}" stroke-width="6"/></pattern>
<pattern id="hatchL" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="12" stroke="${C.line}" stroke-width="3" opacity="0.5"/></pattern></defs>`;

// ---------- mondo: la filiera dello yogurt in sezione, cinque tappe ----------
const GY = 640, fillD = mix(C.bg, C.line, 0.06), dim = mix(C.bg, C.line, 0.4);
const ST = [
  { x: 300, name: 'STABILIMENTO' }, { x: 900, name: 'CAMION FRIGORIFERO' }, { x: 1500, name: 'MAGAZZINO REFRIGERATO' },
  { x: 2100, name: 'BANCO FRIGO' }, { x: 2720, name: 'FRIGORIFERO DI CASA' }];
// punti di sosta del vasetto (mondo)
const JP = [[300, 566], [880, 606], [1500, 590], [2100, 556], [2750, 520]];
function jar(x, y, k = 1, fill = C.coral, stroke = C.bg) {
  // vasetto: corpo a tronco di cono + coperchio, base a (x, y)
  const w1 = 15 * k, w2 = 12 * k, h = 34 * k;
  return `<path d="M${x - w1},${y - h} L${x + w1},${y - h} L${x + w2},${y} L${x - w2},${y}z" fill="${fill}" stroke="${stroke}" stroke-width="${2.5 * Math.min(k, 2)}" stroke-linejoin="round"/>` +
    `<rect x="${x - w1 - 3 * k}" y="${y - h - 6 * k}" width="${2 * w1 + 6 * k}" height="${7 * k}" rx="${2 * k}" fill="${fill}" stroke="${stroke}" stroke-width="${2.5 * Math.min(k, 2)}"/>`;
}
const ln = (d, w = 3, c = C.line) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
function fan(x, y, r, t, spin) {
  let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.bg}" stroke="${C.line}" stroke-width="2.5"/>`;
  for (let i = 0; i < 3; i++) { const a = i * 2.094 + t * spin; s += `<line x1="${x}" y1="${y}" x2="${x + (r - 4) * Math.cos(a)}" y2="${y + (r - 4) * Math.sin(a)}" stroke="${C.line}" stroke-width="2.5" stroke-linecap="round"/>`; }
  return s;
}
function snow(x, y, r = 12) { let s = ''; for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; s += `<line x1="${x - r * Math.cos(a)}" y1="${y - r * Math.sin(a)}" x2="${x + r * Math.cos(a)}" y2="${y + r * Math.sin(a)}" stroke="${C.line}" stroke-width="2.5" stroke-linecap="round"/>`; } return s; }
function world(t, o = {}) {
  const spin = o.spin ?? 6; let s = '';
  s += `<rect x="-2000" y="${GY}" width="7000" height="600" fill="${fillD}"/>` + ln(`M-2000,${GY} L5000,${GY}`, 3);
  for (let i = 0; i < 70; i++) { const x = -400 + i * 60; s += `<line x1="${x}" y1="${GY + 40 + (i % 3) * 18}" x2="${x + 22}" y2="${GY + 40 + (i % 3) * 18}" stroke="${dim}" stroke-width="2" stroke-linecap="round"/>`; }
  // 1 stabilimento: tetto a shed, nastro con vasetti
  s += `<path d="M120,${GY} L120,420 L210,380 L210,420 L300,380 L300,420 L390,380 L390,420 L480,380 L480,${GY}z" fill="${C.bg}" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>`;
  s += ln('M160,570 L440,570', 4) + [190, 410].map(x => `<circle cx="${x}" cy="584" r="12" fill="${C.bg}" stroke="${C.line}" stroke-width="2.5"/>`).join('') + ln(`M200,584 L200,${GY} M400,584 L400,${GY}`, 3);
  [180, 230, 360, 410].forEach(x => s += jar(x, 566, 0.8, C.bg, C.line));
  s += `<rect x="150" y="440" width="70" height="60" fill="none" stroke="${C.line}" stroke-width="2"/>` + snow(185, 470);
  // 2 camion frigorifero (verso destra), gruppo frigo sul fronte del cassone
  s += `<rect x="700" y="470" width="330" height="150" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`;
  s += `<path d="M1040,620 L1040,520 L1100,520 L1130,565 L1130,620z" fill="${C.bg}" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>` + ln('M1060,530 L1095,530 L1115,560 L1060,560z', 2);
  s += `<rect x="1030" y="470" width="40" height="44" rx="4" fill="${C.bg}" stroke="${C.line}" stroke-width="2.5"/>` + fan(1050, 492, 14, t, o.truckOff ? 0 : spin);
  [770, 960, 1090].forEach(x => s += `<circle cx="${x}" cy="${GY - 18}" r="18" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><circle cx="${x}" cy="${GY - 18}" r="6" fill="${C.line}"/>`);
  s += snow(750, 500);
  // 3 magazzino refrigerato: scaffali con pallet
  s += `<rect x="1300" y="400" width="400" height="240" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + `<rect x="1560" y="370" width="90" height="30" rx="4" fill="${C.bg}" stroke="${C.line}" stroke-width="2.5"/>` + fan(1590, 385, 11, t, spin) + fan(1625, 385, 11, t, spin);
  [[1330, 1460], [1540, 1670]].forEach(([a, b]) => { s += ln(`M${a},440 L${a},${GY} M${b},440 L${b},${GY}`, 3); [520, 600].forEach(y => s += ln(`M${a},${y} L${b},${y}`, 3)); });
  [[1340, 470], [1400, 470], [1550, 470], [1610, 550], [1340, 550], [1550, 550]].forEach(([x, y]) => s += `<rect x="${x}" y="${y}" width="50" height="46" fill="none" stroke="${C.line}" stroke-width="2"/>`);
  s += snow(1330, 420, 10);
  // 4 banco frigo del supermercato: vetrina aperta con ripiani
  s += ln('M1900,380 L2300,380', 3) + ln('M1900,380 L1900,410 M2300,380 L2300,410', 3);
  s += `<path d="M1960,${GY} L1960,470 L2240,470 L2240,${GY}z" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + ln('M1975,500 L2225,500', 2);
  [556, 606].forEach(y => s += ln(`M1975,${y} L2225,${y}`, 3));
  [2000, 2040, 2160, 2200].forEach(x => s += jar(x, 556, 0.8, C.bg, C.line));
  [2000, 2050, 2100, 2150, 2200].forEach(x => s += jar(x, 606, 0.8, C.bg, C.line));
  s += snow(2225, 485, 9);
  // 5 casa con frigorifero
  s += `<path d="M2520,${GY} L2520,420 L2700,310 L2880,420 L2880,${GY}z" fill="${C.bg}" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>`;
  s += `<rect x="2700" y="450" width="110" height="190" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + ln('M2700,530 L2810,530', 2.5) + ln('M2795,470 L2795,510 M2795,550 L2795,590', 4);
  s += ln('M2700,${GY} L2700,640'.replace('${GY}', GY), 1) + `<rect x="2560" y="470" width="90" height="70" fill="none" stroke="${C.line}" stroke-width="2"/>` + ln('M2605,470 L2605,540 M2560,505 L2650,505', 2);
  return s;
}
// camera: mondo -> schermo
function camera(cx, cy, s) { return { cx, cy, s, X: x => (x - cx) * s + 960, Y: y => (y - cy) * s + 540 }; }
function inCam(K, inner) { return `<g transform="translate(960,540) scale(${K.s}) translate(${-K.cx},${-K.cy})">${inner}</g>`; }
const lw = (s, size = 24) => tw(s, 'mono', size) + s.length * 3;
function lab(x, y, s, o = {}) { // etichetta su fondo pieno (mai attraversata da linee)
  const size = o.size || 24, w = lw(s, size) + 28, ink = o.ink || C.line, bg = o.bg || C.bg;
  if (x - w / 2 < 20 || x + w / 2 > 1900) return '';
  return `<rect x="${x - w / 2}" y="${y - size - 6}" width="${w}" height="${size + 22}" rx="${(size + 22) / 2}" fill="${bg}" stroke="${o.stroke || 'none'}" stroke-width="2"/>` +
    T(x, y + 2, s, { f: 'mono', size, fill: o.fill || ink, a: 'middle', ls: 3, w: o.w || 500 });
}
function tag(x, y, s, o = {}) { // targhetta temperatura
  const w = tw(s, 'mono', 30) + 44, fill = o.fill || C.bg, ink = o.ink || C.line;
  return `<rect x="${x - w / 2}" y="${y - 40}" width="${w}" height="56" rx="10" fill="${fill}" stroke="${o.stroke || ink}" stroke-width="2.5"/>` + T(x, y - 1, s, { f: 'mono', size: 30, fill: ink, a: 'middle', w: 700 });
}
function along(pts, p) {
  p = clamp(p); const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  let d = p * tot;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const q = seg[i] ? d / seg[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; } d -= seg[i]; }
}
// tratti di viaggio del vasetto tra le tappe i e i+1 (passa sopra il terreno)
function legPath(i) {
  const [a, b] = [JP[i], JP[i + 1]];
  return [a, [a[0] + 60, a[1]], [a[0] + 60, GY - 50], [b[0] - 80, GY - 50], [b[0] - 80, b[1]], b];
}
function jarAt(t, legs) { // legs: [[i, t0, dur], ...] -> posizione corrente
  let pos = JP[legs[0][0]];
  legs.forEach(([i, t0, d]) => { if (t >= t0) pos = along(legPath(i), eio((t - t0) / d)); });
  return pos;
}
function stationLabels(K, t, which, t0s) {
  let s = '';
  which.forEach((i, k) => { s += E(t, t0s[k], lab(K.X(ST[i].x), K.Y(GY) + 70, ST[i].name), { dy: 0 }); });
  return s;
}
function tempTag(K, t, i, t0, txt = '4 °C') { return pop(t, t0, K.X(ST[i].x), K.Y(330) - 12, tag(K.X(ST[i].x), K.Y(330), txt)); }

// 1 — aggancio: il vasetto (registro chiaro)
scene('hook', { L: 0.5, make: (W) => ({ capAt: W('lungo'), render(t, D) {
  let s = lightBg(), g = ''; const k = 1 + 0.025 * t / D;
  g += E(t, -0.4, card(330, 140, 1260, 700, { rot: -1 }), { dy: 0 });
  g += E(t, -0.2, jar(640, 700, 9, C.coral, C.ink), { dy: 30 });
  g += E(t, 0.15, T(640, 790, 'YOGURT', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 6, w: 700 }));
  g += words(t, W('pensa'), 900, 330, 'Pensa a un vasetto', { f: 'serif', size: 72, fill: C.ink, it: true });
  g += words(t, W('vasetto') + 0.2, 900, 410, 'di yogurt.', { f: 'serif', size: 72, fill: C.ink, it: true });
  // il percorso tratteggiato verso il frigorifero
  const p = eo((t - W('arrivare')) / 1.6);
  if (p > 0) g += `<path d="M900,560 L${900 + 420 * p},560" stroke="${C.ink}" stroke-width="4" stroke-dasharray="14 12" stroke-linecap="round"/>`;
  g += E(t, W('frigorifero') - 0.1, `<rect x="1340" y="470" width="110" height="180" rx="10" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>` + ln('M1340,540 L1450,540', 3, C.ink) + ln('M1432,490 L1432,525 M1432,555 L1432,600', 5, C.ink) +
    T(1395, 700, 'FRIGO', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 4, w: 700 }));
  s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
  return s + caption(t, W('lungo'), 'Un lungo viaggio', '', true);
} }) });

// 2 — stabilimento e camion
scene('stabilimento', { make: (W) => ({ capAt: W('sempre'), render(t, D) {
  const K = camera(640, 470, 1.3 + 0.03 * t / D);
  let inner = world(t);
  const [x, y] = jarAt(t, [[0, W('poi'), 1.6]]);
  inner += jar(x, y, 1.15);
  let s = inCam(K, inner);
  s += stationLabels(K, t, [0, 1], [-0.3, W('camion') - 0.2]);
  s += tempTag(K, t, 0, W('quattro') - 0.1) + tempTag(K, t, 1, W('quattro', 1) - 0.1);
  return s + caption(t, W('sempre'), 'Sempre 4 °C', '');
} }) });

// 3 — magazzino e banco frigo (la camera segue il vasetto)
scene('magazzino', { make: (W) => ({ capAt: W('ancora'), render(t, D) {
  const cx = lerp(1250, 1800, eio((t - W('poi') + 0.6) / 1.6));
  const K = camera(cx, 470, 1.3);
  let inner = world(t);
  const [x, y] = jarAt(t, [[1, 0.1, 1.5], [2, W('poi') - 0.4, 1.7]]);
  inner += jar(x, y, 1.15);
  let s = inCam(K, inner);
  s += stationLabels(K, t, [1, 2, 3], [-0.5, -0.3, W('banco') - 0.3]);
  s += tempTag(K, t, 1, -0.5) + tempTag(K, t, 2, W('quattro') - 0.1) + tempTag(K, t, 3, W('quattro', 1) - 0.1);
  return s + caption(t, W('ancora'), 'Ancora 4 °C', '');
} }) });

// 4 — a casa
scene('casa', { make: (W) => ({ capAt: W('casa'), render(t, D) {
  const K = camera(2420, 470, 1.3 + 0.03 * t / D);
  let inner = world(t);
  const [x, y] = jarAt(t, [[3, W('compri'), 1.9]]);
  inner += jar(x, y, 1.15);
  let s = inCam(K, inner);
  s += stationLabels(K, t, [3, 4], [-0.3, W('frigorifero') - 0.3]);
  s += tempTag(K, t, 3, -0.3) + tempTag(K, t, 4, W('quattro') - 0.1);
  return s + caption(t, W('casa'), 'Fino a casa', '');
} }) });

// 5 — la rottura: il gruppo frigo del camion si ferma, la temperatura sale
scene('rottura', { make: (W) => ({ capAt: W('sopra'), render(t, D) {
  const K = camera(1180, 500, 1.35 + 0.02 * t / D);
  const off = t > W('qualsiasi');
  let inner = world(t, { truckOff: off }) + `<rect x="1250" y="300" width="700" height="${GY - 302}" fill="${C.bg}"/>` + jar(880, 606, 1.15, C.line, C.bg);
  if (off) inner += E(t, W('qualsiasi'), ln('M1036,476 L1064,508 M1064,476 L1036,508', 4), { dy: 0 });
  let s = inCam(K, inner);
  s += lab(K.X(900), K.Y(GY) + 70, 'CAMION FRIGORIFERO');
  // termometro schematico 0–12 °C, a destra
  const tx = 1520, top = 230, bot = 690, vy = v => bot - v / 12 * (bot - top);
  const v = lerp(4, 8.7, eio((t - W('temperatura')) / (W('gradi') - W('temperatura') + 0.3)));
  let th = `<rect x="${tx - 22}" y="${top - 20}" width="44" height="${bot - top + 40}" rx="22" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`;
  th += `<rect x="${tx - 21}" y="${vy(8)}" width="42" height="${vy(6) - vy(8)}" fill="url(#hatchL)"/>`;
  th += `<rect x="${tx - 9}" y="${vy(v)}" width="18" height="${bot - vy(v) + 30}" rx="9" fill="${C.coral}"/><circle cx="${tx}" cy="${bot + 48}" r="38" fill="${C.coral}" stroke="${C.line}" stroke-width="3"/>`;
  [[4, '4 °C'], [6, '6 °C'], [8, '8 °C']].forEach(([tv, l]) => th += `<line x1="${tx + 30}" y1="${vy(tv)}" x2="${tx + 50}" y2="${vy(tv)}" stroke="${C.line}" stroke-width="3"/>` + T(tx + 62, vy(tv) + 10, l, { f: 'mono', size: 28, fill: C.line, w: 700 }));
  s += E(t, -0.3, th, { dy: 0 });
  s += E(t, W('sei') - 0.1, lab(tx - 210, vy(7) + 12, 'SOGLIA 6–8 °C', { stroke: C.line }), { dy: 0 });
  // orologio: più di due ore
  const cx2 = 1180, cy2 = 250, hp = clamp((t - W('per')) / 1.2);
  let ck = `<circle cx="${cx2}" cy="${cy2}" r="62" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ck += `<line x1="${cx2 + 50 * Math.cos(a)}" y1="${cy2 + 50 * Math.sin(a)}" x2="${cx2 + 58 * Math.cos(a)}" y2="${cy2 + 58 * Math.sin(a)}" stroke="${C.line}" stroke-width="3"/>`; }
  const ah = -Math.PI / 2 + hp * Math.PI / 3 * 1.15, am = -Math.PI / 2 + hp * 2 * Math.PI * 2.3;
  ck += ln(`M${cx2},${cy2} L${cx2 + 30 * Math.cos(ah)},${cy2 + 30 * Math.sin(ah)}`, 6) + ln(`M${cx2},${cy2} L${cx2 + 46 * Math.cos(am)},${cy2 + 46 * Math.sin(am)}`, 4);
  s += E(t, W('per') - 0.3, ck + lab(cx2, cy2 + 110, 'PIÙ DI 2 ORE', { stroke: C.line }), { dy: 0 });
  return s + caption(t, W('sopra'), 'Sopra 6–8 °C', '');
} }) });

// 6 — i batteri si moltiplicano (schema)
scene('batteri', { L: 0.25, make: (W) => ({ capAt: W('batteri'), render(t, D) {
  let s = lightBg(), g = ''; const k = 1 + 0.02 * t / D;
  g += E(t, -0.4, card(220, 140, 1480, 740, { rot: 1 }), { dy: 0 });
  g += E(t, -0.3, jar(470, 640, 6, C.cream, C.ink) + T(470, 720, 'YOGURT', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 5, w: 700 }), { dy: 0 });
  // lente
  g += E(t, -0.1, ln('M560,450 L850,320', 3, C.ink) + ln('M560,560 L850,640', 3, C.ink) + `<circle cx="1110" cy="480" r="270" fill="${C.ivory}" stroke="${C.ink}" stroke-width="5"/>` + `<circle cx="510" cy="505" r="70" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="8 8"/>`, { dy: 0 });
  // divisioni: 1 → 2 → 4 → 8 → 16 → 32 (schema)
  const gen = clamp((t - W('moltiplicarsi') + 0.6) / 0.42, 0, 5), n = Math.pow(2, Math.floor(gen)), fr = gen - Math.floor(gen);
  const pos = i => { const a = i * 2.39996, r = 34 * Math.sqrt(i + 0.5); return [1110 + r * Math.cos(a), 480 + r * Math.sin(a)]; };
  for (let i = 0; i < n; i++) {
    let [x, y] = pos(i); const a = (i * 47) % 180;
    let rod = `<rect x="${x - 22}" y="${y - 9}" width="44" height="18" rx="9" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" transform="rotate(${a} ${x} ${y})"/>`;
    if (gen < 5 && fr > 0.5) { // sta per dividersi: la nuova cellula esce verso la propria posizione
      const [x2, y2] = pos(i + n), q = eo((fr - 0.5) / 0.5);
      rod += `<rect x="${lerp(x, x2, q) - 22}" y="${lerp(y, y2, q) - 9}" width="44" height="18" rx="9" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" transform="rotate(${(a + 90) % 180} ${lerp(x, x2, q)} ${lerp(y, y2, q)})"/>`;
    }
    g += rod;
  }
  g += E(t, 0.4, T(1110, 810, 'SCHEMA DI ESEMPIO · NON IN SCALA', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3, w: 700 }));
  s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
  return s + caption(t, W('batteri'), 'I batteri si moltiplicano', 'moltiplicano', true);
} }) });

// 7 — gli effetti
scene('effetti', { make: (W) => ({ capAt: W('rischio'), render(t, D) {
  let s = lightBg(), g = ''; const k = 1 + 0.02 * t / D;
  const items = [['STRUTTURA', 'si deteriora', W('struttura')], ['SAPORI', 'cambiano', W('sapori')], ['RISCHIO PER LA SALUTE', 'aumenta', W('rischio')]];
  items.forEach(([n, v, t0], i) => {
    const x = 200 + i * 520, y = 190;
    let c = card(x, y, 480, 560, { rot: [-1.2, 1, -0.8][i] });
    c += T(x + 40, y + 76, `${i + 1}`, { f: 'serif', size: 64, fill: C.ink, it: true });
    c += T(x + 240, y + 470, n, { f: 'mono', size: n.length > 12 ? 24 : 28, fill: C.ink, a: 'middle', ls: 3, w: 700 });
    let ic = '', bx = x + 240, by = y + 260;
    if (i === 0) { // superficie che si separa: grumi e liquido
      ic += `<rect x="${bx - 120}" y="${by - 90}" width="240" height="190" rx="14" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>`;
      const q = eo((t - t0) / 1.5);
      ic += ln(`M${bx - 120},${by - 30} ` + Array.from({ length: 13 }, (_, j) => `L${bx - 120 + j * 20},${by - 30 + (j % 2 ? 1 : -1) * 14 * q}`).join(' '), 3, C.ink);
      [[-70, 20], [10, 50], [60, 0], [-30, 70]].forEach(([dx, dy], j) => ic += `<circle cx="${bx + dx}" cy="${by + dy}" r="${4 + 9 * q}" fill="none" stroke="${C.ink}" stroke-width="3"/>`);
    }
    if (i === 1) { // cucchiaio + punto di domanda
      ic += `<ellipse cx="${bx - 40}" cy="${by - 40}" rx="44" ry="60" fill="${C.cream}" stroke="${C.ink}" stroke-width="4" transform="rotate(-30 ${bx - 40} ${by - 40})"/>` + ln(`M${bx - 5},${by + 10} L${bx + 70},${by + 120}`, 10, C.ink);
      ic += E(t, t0 + 0.3, T(bx + 80, by - 10, '?', { f: 'serif', size: 140, fill: C.ink, a: 'middle', it: true }));
    }
    if (i === 2) { // triangolo di pericolo (unico corallo)
      ic += pop(t, t0 + 0.1, bx, by, `<path d="M${bx},${by - 120} L${bx + 130},${by + 100} L${bx - 130},${by + 100}z" fill="${C.coral}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>` +
        `<rect x="${bx - 10}" y="${by - 50}" width="20" height="90" rx="8" fill="${C.ink}"/><circle cx="${bx}" cy="${by + 68}" r="12" fill="${C.ink}"/>`);
    }
    c += E(t, t0, ic + T(x + 240, y + 520, v, { f: 'serif', size: 40, fill: C.ink, a: 'middle', it: true }), { dy: 10 });
    g += E(t, 0.05 + i * 0.12, c);
  });
  s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
  return s + caption(t, W('rischio'), 'Più rischio', '', true);
} }) });

// catena (maglie) in coordinate schermo tra xa e xb
function chain(xa, xb, y, p, o = {}) {
  let s = ''; const step = 44, n = Math.floor((xb - xa) / step), col = o.c || C.coral;
  for (let i = 0; i < n; i++) {
    if (i / n > p) break;
    const x = xa + i * step + step / 2;
    if (o.gaps && o.gaps.some(([a, b]) => x > a && x < b)) continue;
    s += i % 2 ? `<rect x="${x - 30}" y="${y - 5}" width="60" height="10" rx="5" fill="${col}"/>` : `<rect x="${x - 30}" y="${y - 17}" width="60" height="34" rx="17" fill="none" stroke="${col}" stroke-width="7"/>`;
  }
  return s;
}

// 8 — il nome: catena del freddo
scene('nome', { make: (W) => ({ capAt: W('catena'), render(t, D) {
  const K = camera(1510, 520, 0.6 + 0.012 * t / D);
  let s = inCam(K, world(t));
  ST.forEach((st, i) => s += E(t, -0.3 + i * 0.08, tag(K.X(st.x), K.Y(330) - 30, '4 °C'), { dy: 0 }));
  const yC = K.Y(GY) + 60, xa = K.X(120), xb = K.X(2880);
  s += chain(xa, xb, yC, eio((t - W('dal')) / (W('consumatore') - W('dal') + 0.6)));
  s += E(t, W('produttore') - 0.1, lab(K.X(300), yC + 70, 'PRODUTTORE'), { dy: 0 });
  s += E(t, W('consumatore') - 0.1, lab(K.X(2720), yC + 70, 'CONSUMATORE'), { dy: 0 });
  s += E(t, W('controllata') - 0.3, lab(960, yC + 70, 'TEMPERATURA CONTROLLATA'), { dy: 0 });
  // titolo in alto
  s += E(t, W('cold'), T(960, 220, 'cold chain', { f: 'serif', size: 64, fill: C.line, a: 'middle', it: true }));
  return s + caption(t, W('catena'), 'Catena del freddo', '');
} }) });

// 9 — i guasti: la catena si spezza, il prodotto va scartato
scene('guasti', { make: (W) => ({ capAt: W('scartato'), render(t, D) {
  let s = '';
  const k = 1 + 0.02 * t / D;
  const P = [['GUASTO AL FRIGO', 'DEL CAMION', W('guasto')], ['STOP CORRENTE', 'IN MAGAZZINO', W("un'interruzione")], ['CELLA FRIGO', 'DIFETTOSA', W('cella')]];
  let g = '';
  const now = P.reduce((a, p, i) => t >= p[2] - 0.1 ? i : a, -1), fin = t >= W('scartato') - 0.1;
  // catena intera in alto che si spezza nei tre punti
  const gaps = P.map((p, i) => t >= p[2] - 0.1 ? [330 + i * 560 - 36, 330 + i * 560 + 36] : null).filter(Boolean);
  g += E(t, -0.4, chain(100, 1820, 190, 1, { c: C.line, gaps }), { dy: 0 });
  P.forEach(([a, b, t0], i) => {
    const x = 330 + i * 560, y = 300, act = i === now && !fin;
    let ic = '';
    if (i === 0) { ic += `<rect x="${x - 150}" y="${y + 60}" width="200" height="110" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><path d="M${x + 60},${y + 170} L${x + 60},${y + 95} L${x + 110},${y + 95} L${x + 135},${y + 130} L${x + 135},${y + 170}z" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + fan(x + 30, y + 75, 16, 0, 0) + [x - 110, x + 10, x + 105].map(cx => `<circle cx="${cx}" cy="${y + 180}" r="16" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`).join(''); }
    if (i === 1) { ic += `<rect x="${x - 140}" y="${y + 50}" width="280" height="140" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + ln(`M${x - 40},${y + 120} l-30,0 M${x - 70},${y + 105} l-25,0 l0,30 l25,0z`, 3) + ln(`M${x + 70},${y + 120} l30,0 M${x + 40},${y + 105} l-25,0 l0,30 l25,0 M${x + 15},${y + 112} l-14,0 M${x + 15},${y + 128} l-14,0`, 3); }
    if (i === 2) { ic += `<rect x="${x - 70}" y="${y + 30}" width="140" height="170" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + ln(`M${x - 70},${y + 90} L${x + 70},${y + 90}`, 2.5) + `<path d="M${x + 70},${y + 92} L${x + 120},${y + 112} L${x + 120},${y + 222} L${x + 70},${y + 200}" fill="none" stroke="${C.line}" stroke-width="3"/>`; }
    // segno di guasto: corallo solo per l'ultimo comparso
    const mk = `<circle cx="${x + 120}" cy="${y + 20}" r="34" fill="${act ? C.coral : C.bg}" stroke="${act ? C.coral : C.line}" stroke-width="3"/>` + ln(`M${x + 106},${y + 6} L${x + 134},${y + 34} M${x + 134},${y + 6} L${x + 106},${y + 34}`, 5, act ? C.bg : C.line);
    g += E(t, t0 - 0.15, ic + pop(t, t0, x + 120, y + 20, mk) + lab(x, y + 270, a) + lab(x, y + 320, b));
  });
  s += `<g transform="translate(960,540) scale(${k}) translate(-960,-420)">${g}</g>`;
  return s + caption(t, W('scartato'), 'Prodotto scartato', 'scartato');
} }) });

// 10 — il dato: 10–15% dei prodotti freschi
scene('dato', { make: (W) => ({ capAt: W('sprechi'), render(t, D) {
  let s = lightBg(), g = ''; const k = 1 + 0.02 * t / D;
  g += E(t, -0.4, card(180, 130, 1560, 720, { rot: -0.8 }), { dy: 0 });
  g += pills(t, 260, 180, [['COSTI ENORMI', W('costi')], ['SPRECHI EVITABILI', W('sprechi')]]);
  g += E(t, W('italia') - 0.2, T(260, 320, 'Prodotti freschi in Italia, ogni anno = 100 quadratini', { f: 'serif', size: 46, fill: C.ink }));
  const on1 = t >= W('dieci') - 0.05, on2 = t >= W('quindici') - 0.05;
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 20), c = i % 20, x = 260 + c * 40, y = 370 + r * 40;
    const f = on1 && i < 10 ? C.coral : on2 && i < 15 ? 'url(#hatchC)' : C.ivory;
    g += E(t, W('italia') + i * 0.006, `<rect x="${x}" y="${y}" width="34" height="34" rx="4" fill="${f}" stroke="${C.ink}" stroke-width="2"/>`, { dy: 6, d: 0.3 });
  }
  g += E(t, W('dieci') - 0.1, T(1660, 500, '10–15%', { f: 'pop', size: 130, fill: C.ink, a: 'end' }));
  g += E(t, W('perdita') , T(1660, 560, 'PERSI PER PROBLEMI', { f: 'mono', size: 26, fill: C.ink, a: 'end', ls: 3, w: 700 }) + T(1660, 600, 'NELLA CATENA DEL FREDDO', { f: 'mono', size: 26, fill: C.ink, a: 'end', ls: 3, w: 700 }));
  g += E(t, W('stima'), T(260, 640, 'STIMA · 10 PIENI + 5 TRATTEGGIATI = DA 10 A 15 SU 100', { f: 'mono', size: 24, fill: C.ink, ls: 2, w: 700 }));
  s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
  return s + caption(t, W('sprechi'), 'Sprechi evitabili', '', true);
} }) });
function pills(t, x, y, items) {
  let s = '', cx = x;
  items.forEach(([l, t0]) => { const w = tw(l, 'mono', 24) + l.length * 2 + 44; s += E(t, t0, `<rect x="${cx}" y="${y}" width="${w}" height="52" rx="26" fill="none" stroke="${C.ink}" stroke-width="2.5"/>` + T(cx + w / 2, y + 35, l, { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 2, w: 700 })); cx += w + 18; });
  return s;
}

// 11 — cartello finale
scene('finale', { tail: 3.2, make: (W) => ({ capAt: null, render(t) {
  let s = lightBg();
  s += E(t, -0.4, T(960, 330, 'La catena del freddo', { f: 'pop', size: 116, fill: C.ink, a: 'middle' }), { dy: 0 });
  const names = ['stabilimento', 'camion', 'magazzino', 'banco frigo', 'frigo di casa'];
  let x = 960 - (names.reduce((a, n) => a + tw(n, 'mono', 24) + 60, 0) - 16) / 2;
  names.forEach((n, i) => { const w = tw(n, 'mono', 24) + 44; s += E(t, 0.1 + i * 0.12, `<rect x="${x}" y="${420}" width="${w}" height="52" rx="26" fill="none" stroke="${C.ink}" stroke-width="2"/>` + T(x + w / 2, 455, n, { f: 'mono', size: 24, fill: C.ink, a: 'middle' })); x += w + 16; });
  s += E(t, 0.8, T(960, 540, 'sempre a 4 °C', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 4, w: 700 }));
  s += words(t, W('dal'), 960, 660, 'dal produttore fino a te', { f: 'serif', size: 60, fill: C.ink, a: 'middle', it: true, key: 'te' });
  s += E(t, W('tappa') + 0.3, `<line x1="760" y1="740" x2="1160" y2="740" stroke="${C.ink}" stroke-width="3"/>` + T(960, 800, 'PROFTECNOLOGIA · MC ALI-2-04', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 5 }));
  return s;
} }) });

let acc = 0; const TL = SCENES.map(s => { const o = { id: s.id, start: acc, D: s.D, L: s.L, voce: s.sc.voce_dur }; acc += s.D; return o; });
window.TIMELINE = { total: acc, scenes: TL };
window.render = function (T0) {
  let i = TL.findIndex(x => T0 < x.start + x.D); if (i < 0) i = TL.length - 1;
  const S = SCENES[i], t = T0 - TL[i].start;
  let body = S.light ? '' : `<rect width="1920" height="1080" fill="${C.bg}"/>`;
  body += S.render(t, S.D);
  if (S.cap > 0) body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
