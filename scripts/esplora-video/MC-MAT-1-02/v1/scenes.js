// Le sette fasi del ciclo tecnologico — scene con render(t, D) puro.
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

const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.line, ls: o.ls ?? 3, a: o.a || 'middle', w: o.w || 600 });
const P = (d, c = C.line, sw = 3, f = 'none', extra = '') => `<path d="${d}" fill="${f}" stroke="${c}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"${extra}/>`;
function pl(pts, c = C.line, sw = 3, head = true) {
  let d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  let s = P(d, c, sw);
  if (head) { const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]]; const an = Math.atan2(b[1] - a[1], b[0] - a[0]), h = 18;
    s += `<path d="M${b[0]},${b[1]} L${b[0] - h * Math.cos(an - 0.45)},${b[1] - h * Math.sin(an - 0.45)} L${b[0] - h * Math.cos(an + 0.45)},${b[1] - h * Math.sin(an + 0.45)} z" fill="${c}"/>`; }
  return s;
}
function along(pts, p) {
  const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  let r = clamp(p) * tot; const out = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (r <= seg[i]) { const q = seg[i] ? r / seg[i] : 0; out.push([lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]); return out; }
    out.push(pts[i + 1]); r -= seg[i];
  }
  return out;
}

// ---- icone delle 7 fasi (line-art, centrate in x,y, scala k) ----
function ico(n, x, y, k = 1, c = C.line) {
  const g = inner => `<g transform="translate(${x},${y}) scale(${k})">${inner}</g>`;
  const sw = 3 / k > 5 ? 5 : 3;
  switch (n) {
    case 1: return g(P('M-22,24 L18,-16', c, 4) + P('M-6,-28 Q18,-30 30,-6', c, 4) + P('M6,-24 L26,-4', c, 3));            // piccone
    case 2: return g(P('M-20,26 L-14,-10 L14,-10 L20,26 Z', c, 3) + P('M-8,-10 L-8,-26 L8,-26 L8,-10', c, 3) + P('M0,18 Q-9,8 -2,0 Q0,8 6,4 Q8,12 0,18 Z', c, 2.5)); // altoforno
    case 3: return g(P('M-28,26 L-28,-4 L-14,-16 L-14,-4 L0,-16 L0,-4 L14,-16 L14,-4 L28,-4 L28,26 Z', c, 3) + P('M18,-4 L18,-26 L24,-26 L24,-4', c, 3)); // fabbrica
    case 4: return g(P('M-30,14 L-30,-14 L8,-14 L8,14 Z', c, 3) + P('M8,-6 L22,-6 L30,4 L30,14 L8,14', c, 3) + `<circle cx="-18" cy="18" r="6" fill="${C.bg}" stroke="${c}" stroke-width="3"/><circle cx="20" cy="18" r="6" fill="${C.bg}" stroke="${c}" stroke-width="3"/>`); // camion
    case 5: return g(P('M-24,-2 L0,-24 L24,-2', c, 3) + P('M-18,-6 L-18,24 L18,24 L18,-6', c, 3) + P('M-6,24 L-6,8 L6,8 L6,24', c, 3));  // casa
    case 6: return g(P('M-20,-12 L-16,26 L16,26 L20,-12', c, 3) + P('M-26,-14 L26,-14', c, 3) + P('M-8,-14 L-8,-22 L8,-22 L8,-14', c, 3) + P('M-6,-4 L-4,18 M6,-4 L4,18', c, 2.5)); // bidone
    case 7: return g(P('M-20,-6 A22,22 0 0 1 16,-14', c, 3.5) + P('M10,-24 L18,-13 L5,-9', c, 3.5) + P('M20,6 A22,22 0 0 1 -16,14', c, 3.5) + P('M-10,24 L-18,13 L-5,9', c, 3.5)); // frecce circolari
  }
  return '';
}
const FASI = ['ESTRAZIONE', 'LAVORAZIONE', 'PRODUZIONE', 'LOGISTICA', 'USO', 'FINE VITA', 'RECUPERO'];
// anello delle 7 fasi: archi 1→2 … 6→7 (aperto fra 7 e 1: il recupero rientra nella lavorazione)
function ring(t, o) {
  const cx = o.cx, cy = o.cy, r = o.r, nr = 54, t0 = o.t0, st = o.step ?? 0.12;
  const ang = k => -Math.PI / 2 + k * 2 * Math.PI / 7, pos = k => [cx + r * Math.cos(ang(k)), cy + r * Math.sin(ang(k))];
  let s = '';
  for (let k = 0; k < 6; k++) {
    const p = eo((t - t0 - k * st - 0.15) / 0.35); if (p <= 0) continue;
    const d = (nr + 12) / r, a0 = ang(k) + d, a1 = a0 + (ang(k + 1) - d - a0) * p;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    s += P(`M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`, C.line, 4);
    if (p > 0.3) { const dx = -Math.sin(a1), dy = Math.cos(a1), h = 18;
      s += `<path d="M${x1 + dx * 4},${y1 + dy * 4} L${x1 - dx * h + Math.cos(a1) * 10},${y1 - dy * h + Math.sin(a1) * 10} L${x1 - dx * h - Math.cos(a1) * 10},${y1 - dy * h - Math.sin(a1) * 10} z" fill="${C.line}"/>`; }
  }
  for (let k = 0; k < 7; k++) {
    const [x, y] = pos(k), hi = o.hi && o.hi.includes(k + 1);
    let n = `<circle cx="${x}" cy="${y}" r="${nr}" fill="${C.bg}" stroke="${C.line}" stroke-width="${hi ? 6 : 3}"/>` + ico(k + 1, x, y, 1.05);
    n += `<circle cx="${x + 40}" cy="${y - 40}" r="19" fill="${C.bg}" stroke="${C.line}" stroke-width="2.5"/>` + T(x + 40, y - 31, String(k + 1), { f: 'mono', size: 24, w: 700, a: 'middle' });
    if (o.labels) {
      const c = Math.cos(ang(k)), sn = Math.sin(ang(k));
      const a = c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle';
      const off = a === 'middle' ? nr + 26 : nr + 62;
      const lx = x + c * off, ly = y + sn * (nr + 26) + 9 + (a === 'middle' ? (sn < 0 ? -10 : 18) : 0);
      n += lbl(lx, ly, FASI[k], { size: 24, a, ls: 2 });
    }
    s += E(t, t0 + k * st, n, { d: 0.4, dy: 10 });
  }
  return s;
}

// 1 — aggancio: non "nasce e muore", ma sette fasi
scene('hook', { L: 0.4, tail: 1.0, make: (W) => ({
  capAt: W('sette'),
  render(t) {
    let s = '';
    const out = 1 - eo((t - W('è', 1)) / 0.4);
    if (out > 0) {
      let g = E(t, W('nasce') - 0.1, `<circle cx="560" cy="520" r="16" fill="${C.line}"/>` + lbl(560, 590, 'NASCE'), { dy: 0 });
      const p = eo((t - W('e')) / 0.4);
      if (p > 0) g += pl([[590, 520], [590 + 700 * p, 520]], C.line, 4, p > 0.2);
      g += E(t, W('muore') - 0.05, `<circle cx="1360" cy="520" r="16" fill="none" stroke="${C.line}" stroke-width="4"/>` + lbl(1360, 590, 'MUORE'), { dy: 0 });
      g += E(t, W('semplice'), T(960, 400, '«nasce e muore»?', { f: 'serif', size: 76, it: true, a: 'middle' }));
      s += `<g opacity="${out.toFixed(3)}">${g}</g>`;
    }
    s += ring(t, { cx: 960, cy: 510, r: 290, t0: W('sette') - 0.25, labels: true });
    s += E(t, W('tecnologico') - 0.35, T(960, 500, 'CICLO', { f: 'pop', size: 54, a: 'middle' }) + T(960, 562, 'TECNOLOGICO', { f: 'pop', size: 54, a: 'middle' }));
    return s + caption(t, W('sette'), 'Sette fasi', 'Sette');
  } }) });

// 2 — estrazione: miniera in sezione, roccia contro metallo
scene('estr', { tail: 0.7, make: (W) => ({
  capAt: W('tonnellate'),
  render(t) {
    let s = '';
    const gy = 330;
    // suolo in sezione (metà sinistra)
    let g = `<rect x="0" y="${gy}" width="820" height="560" fill="${C.earth}"/>` + P(`M0,${gy} L820,${gy}`, C.line, 3);
    for (let i = 0; i < 4; i++) g += P(`M0,${gy + 110 + i * 110} Q200,${gy + 90 + i * 110} 410,${gy + 115 + i * 110} T820,${gy + 105 + i * 110}`, C.lineDim, 2, 'none', ' stroke-dasharray="14 12"');
    // castelletto e pozzo
    g += P(`M250,${gy} L290,${gy - 170} L330,${gy} M270,${gy - 85} L310,${gy - 85}`, C.line, 3) + `<circle cx="290" cy="${gy - 170}" r="16" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`;
    g += P(`M275,${gy} L275,${gy + 400} M305,${gy} L305,${gy + 370} L640,${gy + 370} M275,${gy + 400} L640,${gy + 400}`, C.line, 3);
    g += lbl(470, gy + 450, 'MINIERA DI RAME', { size: 26 });
    s += E(t, -0.3, g, { dy: 0 });
    s += E(t, W("l'estrazione") - 0.1, lbl(640, gy - 40, 'ESTRAZIONE', { size: 30, a: 'middle' }));
    // carrello che risale
    const pc = clamp((t - W('miniera')) / 1.2);
    if (pc > 0) { const yy = gy + 385 - pc * 0, xx = 620 - pc * 300; s += P(`M${xx - 30},${yy - 18} L${xx + 30},${yy - 18} L${xx + 22},${yy + 4} L${xx - 22},${yy + 4} Z`, C.line, 3); }
    // divisorio
    s += `<line x1="900" y1="180" x2="900" y2="860" stroke="${C.lineDim}" stroke-width="2" stroke-dasharray="6 10"/>`;
    // mucchio di roccia
    const tr = W('tonnellate') - 0.15;
    let rk = '';
    const pts = [];
    for (let r = 0; r < 6; r++) for (let c = 0; c <= 5 - r; c++) pts.push([1060 + c * 64 + r * 32, 740 - r * 54]);
    pts.forEach(([x, y], i) => {
      const w = 30 + (i * 7) % 9, h = 22 + (i * 5) % 7;
      rk += E(t, tr + ((i * 11) % 21) * 0.03, P(`M${x - w},${y + 4} L${x - w + 8},${y - h} L${x + w - 10},${y - h - 4} L${x + w},${y + 6} Z`, C.line, 3, mix(C.bg, C.line, 0.08)), { d: 0.3, dy: 12, blur: 4 });
    });
    s += rk + E(t, tr + 0.4, lbl(1220, 830, 'CENTINAIA DI', { size: 26 }) + lbl(1220, 866, 'TONNELLATE DI ROCCIA', { size: 26 }));
    // freccia e lingotto
    s += E(t, W('ottenere'), pl([[1450, 600], [1560, 600]], C.line, 4), { dy: 0 });
    s += E(t, W('chili') - 0.2, P('M1600,640 L1620,590 L1730,590 L1750,640 Z', C.coral, 3, C.coral) + lbl(1675, 700, 'POCHI CHILI', { size: 26 }) + lbl(1675, 736, 'DI METALLO', { size: 26 }));
    return s + caption(t, W('tonnellate'), 'Tonnellate per pochi chili');
  } }) });

// 3 — lavorazione: altoforno in sezione
scene('lav', { tail: 0.9, make: (W) => ({
  capAt: W('diventa'),
  render(t) {
    let s = '';
    const cx = 900;
    // carica: righe alterne minerale / coke
    let g = P(`M${cx - 120},180 L${cx - 200},620 L${cx - 160},800 L${cx + 160},800 L${cx + 200},620 L${cx + 120},180 Z`, C.line, 4, mix(C.bg, C.line, 0.04));
    for (let r = 0; r < 7; r++) {
      const y = 220 + r * 58, half = 120 + (r / 7) * 70;
      for (let x = cx - half + 26; x < cx + half - 20; x += 40)
        g += r % 2 ? `<circle cx="${x}" cy="${y}" r="11" fill="none" stroke="${C.lineDim}" stroke-width="2.5"/>` : `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" fill="none" stroke="${C.lineDim}" stroke-width="2.5" transform="rotate(20 ${x} ${y})"/>`;
    }
    s += E(t, -0.3, g, { dy: 0 });
    s += E(t, W('lavorazione') - 0.1, lbl(cx, 140, 'ALTOFORNO', { size: 30 }));
    s += E(t, W('minerale') - 0.1, pl([[460, 250], [cx - 150, 250]], C.line, 3) + lbl(460, 215, 'MINERALE DI FERRO', { a: 'middle', size: 26 }) +
      pl([[460, 360], [cx - 170, 360]], C.line, 3) + lbl(460, 325, 'CARBONE COKE', { a: 'middle', size: 26 }));
    // zona calda + temperatura
    const th = W('millecinquecento') - 0.1;
    s += E(t, th, P(`M${cx - 150},700 Q${cx},650 ${cx + 150},700`, C.line, 3, 'none', ' stroke-dasharray="10 8"') +
      T(cx + 280, 690, '1500 °C', { f: 'pop', size: 96, a: 'start' }));
    // colata di ferro fuso (unico corallo)
    const pf = eo((t - W('diventa')) / 0.9);
    if (pf > 0) {
      s += P(`M${cx + 160},770 L${cx + 160 + 140 * clamp(pf * 2)},770`, C.coral, 14);
      if (pf > 0.5) { const q = (pf - 0.5) * 2; s += P(`M${cx + 300},770 L${cx + 300},${770 + 70 * q}`, C.coral, 12); }
      s += P(`M${cx + 240},840 L${cx + 252},900 L${cx + 348},900 L${cx + 360},840`, C.line, 4);
      if (pf > 0.8) s += `<rect x="${cx + 252}" y="${900 - 40 * (pf - 0.8) * 5}" width="96" height="${40 * (pf - 0.8) * 5}" fill="${C.coral}" opacity="0.9"/>`;
    }
    s += E(t, W('diventa') + 0.3, lbl(cx + 400, 870, 'FERRO FUSO', { a: 'start', size: 28 }));
    return `<g transform="translate(0,-50)">${s}</g>` + caption(t, W('diventa'), 'Diventa ferro fuso');
  } }) });

// 4 — energia: 14 kWh contro il 5%
scene('energia', { tail: 0.8, make: (W) => ({
  capAt: W('solo'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(300, 150, 1320, 660, { rot: -1 }), { dy: 0 });
    g += E(t, -0.1, T(390, 250, '1 KG DI ALLUMINIO', { f: 'mono', size: 34, fill: C.ink, ls: 4, w: 700 }));
    g += E(t, W('bauxite') - 0.1, T(390, 360, 'DALLA BAUXITE', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 600 }));
    const p1 = eo((t - W('richiede')) / 0.9);
    if (p1 > 0) g += `<rect x="390" y="385" width="${1000 * p1}" height="80" rx="8" fill="${mix(C.cream, C.ink, 0.12)}" stroke="${C.ink}" stroke-width="3"/>`;
    g += E(t, W('quattordici') - 0.1, T(1400, 445, '≈ 14 kWh', { f: 'pop', size: 56, fill: C.ink, a: 'end' }));
    g += E(t, W('rifonderlo') - 0.1, T(390, 590, 'RIFUSO (RICICLATO)', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 600 }));
    const p2 = eo((t - W('richiede', 1)) / 0.5);
    if (p2 > 0) g += `<rect x="390" y="615" width="${50 * p2}" height="80" rx="6" fill="${C.coral}" stroke="${C.ink}" stroke-width="3"/>`;
    g += E(t, W('cinque') - 0.1, T(480, 678, '5% dell’energia', { f: 'pop', size: 56, fill: C.ink }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('solo'), 'Solo il 5%', '', true);
  } }) });

// 5 — produzione: un'auto da più paesi
function carBody(c = C.line) { return P('M560,700 L560,610 L700,600 L800,500 L1120,500 L1230,600 L1360,620 L1380,700 Z', c, 4) + P('M820,515 L780,595 L1210,595 L1110,515 Z', c, 2.5); }
function wheels(c = C.line) { return [720, 1200].map(x => `<circle cx="${x}" cy="710" r="52" fill="${C.bg}" stroke="${c}" stroke-width="4"/><circle cx="${x}" cy="710" r="18" fill="none" stroke="${c}" stroke-width="3"/>`).join(''); }
function engine(x, y, c = C.line) { return `<rect x="${x - 70}" y="${y - 40}" width="140" height="80" rx="8" fill="${C.bg}" stroke="${c}" stroke-width="3"/>` + [0, 1, 2].map(i => `<rect x="${x - 52 + i * 38}" y="${y - 62}" width="28" height="22" fill="none" stroke="${c}" stroke-width="3"/>`).join(''); }
function seat(x, y, c = C.line) { return P(`M${x - 40},${y + 30} L${x + 40},${y + 30} L${x + 40},${y + 6} L${x - 22},${y + 6} L${x - 34},${y - 60} L${x - 52},${y - 56} L${x - 44},${y + 30}`, c, 3, C.bg); }
scene('prod', { tail: 0.6, make: (W) => ({
  capAt: W('è'),
  render(t) {
    let s = '';
    s += E(t, W('produzione') - 0.1, lbl(960, 200, 'PRODUZIONE · ASSEMBLAGGIO', { size: 30 }));
    s += E(t, 0, wheels(), { dy: 0 });
    const src = [['GERMANIA', 'MOTORE', 300, W('germania')], ['POLONIA', 'CARROZZERIA', 960, W('polonia')], ['ROMANIA', 'SEDILI', 1620, W('romania')]];
    src.forEach(([paese, pezzo, x, tw0]) => {
      s += E(t, tw0 - 0.2, `<rect x="${x - 170}" y="270" width="340" height="96" rx="14" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + lbl(x, 312, paese, { size: 28, w: 700 }) + lbl(x, 350, pezzo, { size: 24 }));
    });
    // i pezzi volano al loro posto
    const fly = (t0, x0, y0, x1, y1, f) => { const p = eio((t - t0) / 0.9); if (p <= 0) return ''; return `<g opacity="${clamp(p * 3)}">${f(lerp(x0, x1, p), lerp(y0, y1, p))}</g>` + (p < 1 ? P(`M${x0},${y0} L${lerp(x0, x1, p)},${lerp(y0, y1, p)}`, C.lineDim, 2, 'none', ' stroke-dasharray="6 8"') : ''); };
    s += fly(W('germania'), 300, 440, 1240, 620, (x, y) => engine(x, y));
    const pb = eio((t - W('polonia')) / 0.9);
    if (pb > 0) s += `<g opacity="${clamp(pb * 3)}" transform="translate(0,${(1 - pb) * -160})">${carBody()}</g>`;
    s += fly(W('romania'), 1620, 440, 920, 640, (x, y) => seat(x, y));
    // catena di fornitura: i tre fornitori legati all'auto (corallo)
    const pc = eo((t - W('catena') + 0.1) / 0.6);
    if (pc > 0) s += `<g opacity="${pc}">` + P('M300,366 L300,410 L1620,410 L1620,366 M960,366 L960,410', C.line, 3) + '</g>';
    return s + caption(t, W('è'), 'Catena di fornitura', 'fornitura');
  } }) });

// 6 — logistica: il viaggio di una felpa
scene('log', { tail: 1.1, make: (W) => ({
  capAt: W('quarantamila'),
  render(t) {
    let s = '';
    const pts = [[220, 330], [600, 330], [980, 330], [1360, 330], [1640, 330], [1760, 330], [1760, 640], [1260, 640], [880, 640]];
    const stops = ['TEXAS', 'INDIA', 'BANGLADESH', 'VIETNAM', 'CAMBOGIA', null, null, 'ROTTERDAM', 'TU'];
    const what = ['cotone', 'filato', 'tessuto', 'tinto', 'cucito', null, null, 'porto', ''];
    s += E(t, W('logistica') - 0.1, lbl(960, 190, 'LOGISTICA · TRASPORTO · MAGAZZINI', { size: 28 }));
    s += E(t, W('felpa') - 0.2, P('M150,560 L190,520 L230,540 L270,540 L310,520 L350,560 L325,585 L310,575 L310,680 L190,680 L190,575 L175,585 Z', C.line, 3) + lbl(250, 730, 'UNA FELPA', { size: 24 }));
    const t0 = W('felpa'), t1 = W('arrivare') + 0.2, p = clamp((t - t0) / (t1 - t0));
    if (p > 0) {
      const tr = along(pts, p);
      s += pl(tr, C.line, 4, false);
      const [hx, hy] = tr[tr.length - 1];
      s += `<circle cx="${hx}" cy="${hy}" r="16" fill="${C.coral}"/>`;
    }
    // tappe
    let segs = [0]; for (let i = 1; i < pts.length; i++) segs.push(segs[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const tot = segs[segs.length - 1];
    stops.forEach((st, i) => {
      if (!st) return;
      const ti = t0 + (segs[i] / tot) * (t1 - t0) - 0.1, [x, y] = pts[i], below = y > 500;
      s += E(t, ti, `<circle cx="${x}" cy="${y}" r="10" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + lbl(x, below ? y + 52 : y - 30, st, { size: 26, w: 700 }) +
        (what[i] ? T(x, below ? y + 92 : y + 52, what[i], { f: 'serif', size: 36, it: true, a: 'middle' }) : ''), { dy: 6, d: 0.35 });
    });
    s += E(t, t0 + (segs[5] / tot) * (t1 - t0) - 0.3, `<rect x="1700" y="440" width="120" height="90" fill="${C.bg}"/>` + P('M1712,490 L1808,490 L1796,520 L1724,520 Z', C.line, 3) + P('M1730,490 L1730,462 L1760,462 L1760,490 M1760,476 L1790,476 L1790,490', C.line, 3) + T(1688, 500, 'nave', { f: 'serif', size: 36, it: true, a: 'end' }), { dy: 0 });
    s += E(t, t0, lbl(1640, 860, 'SCHEMA, NON IN SCALA', { size: 24, a: 'end', ls: 2 }), { dy: 0 });
    return s + caption(t, W('quarantamila'), '40.000 km');
  } }) });

// 7 — uso: conta la durata
function jeans(x, y, c) { return P(`M${x - 40},${y - 70} L${x + 40},${y - 70} L${x + 46},${y + 70} L${x + 12},${y + 70} L${x},${y - 20} L${x - 12},${y + 70} L${x - 46},${y + 70} Z`, c, 3) + P(`M${x - 40},${y - 54} L${x + 40},${y - 54}`, c, 2.5); }
scene('uso', { tail: 1.4, make: (W) => ({
  capAt: W('conta'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(260, 140, 1400, 690, { rot: 1 }), { dy: 0 });
    g += E(t, -0.1, T(350, 230, 'USO · DURATA', { f: 'mono', size: 32, fill: C.ink, ls: 4, w: 700 }) + T(1560, 230, 'IMPATTO PER ANNO', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700, a: 'end' }));
    const row = (y, n, lab, tA, bh, coral) => {
      let r = jeans(410, y, C.ink) + T(500, y - 30, lab, { f: 'pop', size: 50, fill: C.ink });
      for (let i = 0; i < 10; i++) r += `<rect x="${500 + i * 62}" y="${y + 6}" width="52" height="30" rx="5" fill="${i < n ? mix(C.cream, C.ink, 0.15) : 'none'}" stroke="${C.ink}" stroke-width="2.5"${i < n ? '' : ' stroke-dasharray="6 6" opacity="0.35"'}/>`;
      r += T(500, y + 76, n === 10 ? '10 anni di uso' : '1 anno di uso', { f: 'mono', size: 24, fill: C.ink, ls: 2, w: 600 });
      return E(t, tA, r);
    };
    g += row(400, 10, 'Dura 10 anni', W('dieci') - 0.1);
    g += row(660, 1, 'Dura 1 anno', W('uno') - 0.1);
    // barre di impatto per anno (qualitative)
    const pa = eo((t - W('impatto')) / 0.6), pb = eo((t - W('anno', 1)) / 0.6);
    if (pa > 0) g += `<rect x="1360" y="${440 - 40 * pa}" width="110" height="${40 * pa}" fill="${C.coral}" stroke="${C.ink}" stroke-width="3"/>`;
    if (pb > 0) g += `<rect x="1360" y="${740 - 230 * pb}" width="110" height="${230 * pb}" fill="${mix(C.cream, C.ink, 0.15)}" stroke="${C.ink}" stroke-width="3"/>`;
    g += E(t, W('inferiore') - 0.1, T(1415, 340, 'molto', { f: 'serif', size: 40, it: true, fill: C.ink, a: 'middle' }) + T(1415, 380, 'inferiore', { f: 'serif', size: 40, it: true, fill: C.ink, a: 'middle' }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('conta'), 'Conta la durata', '', true);
  } }) });

// 8 — fine vita: cinque strade
scene('fine', { tail: 0.6, make: (W) => ({
  capAt: W('sono'),
  render(t) {
    let s = '';
    const bx = 330, by = 470;
    s += E(t, -0.2, ico(6, bx, by, 3.2) + lbl(bx, by + 140, 'FINE VITA', { size: 30 }));
    const ways = [['DISCARICA', 'discarica'], ['INCENERIMENTO', 'incenerimento'], ['RICICLO', 'riciclo'], ['RIUSO', 'riuso'], ['COMPOSTAGGIO', 'compostaggio']];
    const best = t >= W('riuso', 1) - 0.1;
    ways.forEach(([L, w], i) => {
      const y = 200 + i * 135, hi = i === 3 && best;
      const p = eo((t - W(w) + 0.15) / 0.45); if (p <= 0) return;
      const x0 = bx + 110, x1 = x0 + (900 - x0) * p;
      s += P(`M${x0},${by} C${x0 + 200},${by} ${x0 + 180},${y} ${x1},${y}`, hi ? C.coral : C.line, hi ? 7 : 3, 'none', ` opacity="${hi || !best ? 1 : 0.55}"`);
      if (p > 0.6) s += E(t, W(w) + 0.1, `<circle cx="940" cy="${y}" r="34" fill="${C.bg}" stroke="${hi ? C.coral : C.line}" stroke-width="${hi ? 5 : 3}"/>` + lbl(1000, y + 10, hi ? 'RIUSO E RIPARAZIONE' : L, { a: 'start', size: 30, w: 700 }), { dy: 0, d: 0.3 });
    });
    return s + caption(t, W('sono'), 'La strada più efficiente');
  } }) });

// 9 — recupero: il materiale rientra nella lavorazione
scene('rec', { tail: 0.8, make: (W) => ({
  capAt: W('e'),
  render(t) {
    let s = ring(t, { cx: 960, cy: 510, r: 290, t0: -0.6, step: 0.04, labels: true, hi: t >= W('torna') ? [7, 2] : [7] });
    const ang = k => -Math.PI / 2 + k * 2 * Math.PI / 7, pos = k => [960 + 290 * Math.cos(ang(k)), 510 + 290 * Math.sin(ang(k))];
    const [ax, ay] = pos(6), [bx, by] = pos(1);
    const a = [ax + 50, ay + 20], b = [bx - 50, by + 20], c = [960, 560];
    const p = eo((t - W('torna')) / 1.0);
    if (p > 0) {
      const pts = []; for (let i = 0; i <= 40; i++) { const q = i / 40 * p; pts.push([(1 - q) ** 2 * a[0] + 2 * (1 - q) * q * c[0] + q * q * b[0], (1 - q) ** 2 * a[1] + 2 * (1 - q) * q * c[1] + q * q * b[1]]); }
      s += pl(pts, C.coral, 7, p > 0.15);
    }
    s += E(t, W('materia') - 0.1, lbl(960, 545, 'MATERIA PRIMA', { size: 26 }) + lbl(960, 583, 'SECONDARIA', { size: 26 }));
    return s + caption(t, W('e'), 'Il ciclo si chiude');
  } }) });

// 10 — lineare contro circolare
scene('circ', { tail: 1.0, make: (W) => ({
  capAt: W("l'economia"),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(160, 140, 1600, 700, { rot: -0.6 }), { dy: 0 });
    const chip = (x, y, txt, o = {}) => {
      const w = txt.length * 22 + 60;
      return `<rect x="${x}" y="${y - 38}" width="${w}" height="76" rx="38" fill="${C.cream}" stroke="${o.c || C.ink}" stroke-width="${o.sw || 3}"/>` + T(x + w / 2, y + 10, txt, { f: 'mono', size: 30, fill: o.tc || C.ink, a: 'middle', w: 700, ls: 1 }) + (o.x ? P(`M${x + 16},${y} L${x + w - 16},${y}`, C.ink, 4) : '');
    };
    const chain = (y, items, keys, n) => {
      let x = 250, out = '';
      items.forEach((it, i) => {
        const w = it[0].length * 22 + 60;
        out += E(t, W(keys[i], i < 3 ? n : 0) - 0.15, chip(x, y, it[0], it[1] || {}) + (i < items.length - 1 ? pl([[x + w + 8, y], [x + w + 46, y]], C.ink, 3) : ''), { d: 0.35 });
        x += w + 56;
      });
      return out;
    };
    g += E(t, W('non') - 0.1, T(250, 270, 'LINEARE', { f: 'mono', size: 30, fill: C.ink, ls: 4, w: 700 }));
    g += chain(350, [['ESTRAI'], ['PRODUCI'], ['USA'], ['BUTTA', { x: true }]], ['estrai', 'produci', 'usa', 'butta'], 0);
    g += E(t, W('ma') - 0.1, T(250, 560, 'CIRCOLARE', { f: 'mono', size: 30, fill: C.ink, ls: 4, w: 700 }));
    g += chain(640, [['ESTRAI'], ['PRODUCI'], ['USA'], ['RECUPERA', { c: C.coral, sw: 6, tc: C.coralDk }], ['RIPRODUCI']], ['estrai', 'produci', 'usa', 'recupera', 'riproduci'], 1);
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W("l'economia"), 'Economia circolare', '', true);
  } }) });

// 11 — chiusura
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Il ciclo tecnologico', { f: 'pop', size: 130, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('sette') - 0.1, 960, 550, 'Sette fasi, un solo ciclo.', { f: 'serif', size: 76, fill: C.ink, a: 'middle', it: true });
    s += E(t, W('tecnologico') + 0.2, `<line x1="760" y1="630" x2="1160" y2="630" stroke="${C.ink}" stroke-width="3"/>` + T(960, 690, 'PROFTECNOLOGIA · MC MAT-1-02', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5 }));
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
