// Backup: la regola 3-2-1 — MC-DIG-2-03 §3. render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.4);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const DIM = () => mix(C.bg, C.line, 0.10);

// ---- mondo: dispositivi in sezione, a filo ----
function laptop(cx, by, w, st, o = {}) { // by = linea della base
  const h = w * 0.62, sw = o.sw || 4, fill = o.fill || DIM();
  let s = `<rect x="${cx - w / 2}" y="${by - h - 16}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>`;
  s += `<rect x="${cx - w / 2 + 18}" y="${by - h + 2}" width="${w - 36}" height="${h - 36}" rx="6" fill="none" stroke="${st}" stroke-width="${sw * 0.6}" opacity="0.7"/>`;
  s += `<path d="M${cx - w / 2 - 40},${by} L${cx - w / 2},${by - 16} H${cx + w / 2} L${cx + w / 2 + 40},${by} z" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  return s + (o.inner || '');
}
function doc(x, y, w, h, st, o = {}) {
  const f = 26, sw = o.sw || 4;
  let s = `<path d="M${x},${y} H${x + w - f} L${x + w},${y + f} V${y + h} H${x} z" fill="${o.fill || DIM()}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  s += `<path d="M${x + w - f},${y} V${y + f} H${x + w}" fill="none" stroke="${st}" stroke-width="${sw * 0.7}"/>`;
  const n = o.lines ?? 4; for (let i = 0; i < n; i++) s += `<line x1="${x + 18}" y1="${y + 44 + i * (h - 70) / Math.max(1, n - 1) * 0.8}" x2="${x + w - 18 - (i === n - 1 ? w * 0.3 : 0)}" y2="${y + 44 + i * (h - 70) / Math.max(1, n - 1) * 0.8}" stroke="${st}" stroke-width="3" opacity="0.6"/>`;
  return s;
}
function extDisk(x, y, w, h, st, o = {}) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${o.fill || DIM()}" stroke="${st}" stroke-width="${o.sw || 4}"/>`;
  s += `<circle cx="${x + w / 2}" cy="${y + h * 0.45}" r="${Math.min(w, h) * 0.28}" fill="none" stroke="${st}" stroke-width="3" opacity="0.7"/><circle cx="${x + w / 2}" cy="${y + h * 0.45}" r="6" fill="${st}"/>`;
  s += `<circle cx="${x + w - 22}" cy="${y + h - 22}" r="6" fill="${st}"/>`;
  return s;
}
function usb(x, y, w, h, st) {
  return `<rect x="${x}" y="${y}" width="${w * 0.72}" height="${h}" rx="10" fill="${DIM()}" stroke="${st}" stroke-width="4"/>` +
    `<rect x="${x + w * 0.72}" y="${y + h * 0.2}" width="${w * 0.28}" height="${h * 0.6}" rx="3" fill="none" stroke="${st}" stroke-width="4"/>` +
    `<rect x="${x + w * 0.8}" y="${y + h * 0.32}" width="${w * 0.07}" height="${h * 0.14}" fill="${st}"/><rect x="${x + w * 0.8}" y="${y + h * 0.54}" width="${w * 0.07}" height="${h * 0.14}" fill="${st}"/>`;
}
function cloud(cx, cy, k, st, o = {}) {
  const d = `M${cx - 150 * k},${cy + 60 * k} a${60 * k},${60 * k} 0 0 1 ${10 * k},${-118 * k} a${80 * k},${80 * k} 0 0 1 ${150 * k},${-40 * k} a${70 * k},${70 * k} 0 0 1 ${120 * k},${50 * k} a${55 * k},${55 * k} 0 0 1 ${20 * k},${108 * k} z`;
  return `<path d="${d}" fill="${o.fill || DIM()}" stroke="${st}" stroke-width="${o.sw || 4}" stroke-linejoin="round"/>`;
}
function house(x, y, w, h, st) {
  return `<path d="M${x},${y + h * 0.38} L${x + w / 2},${y} L${x + w},${y + h * 0.38}" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<rect x="${x + w * 0.08}" y="${y + h * 0.33}" width="${w * 0.84}" height="${h * 0.67}" fill="${DIM()}" stroke="${st}" stroke-width="5"/>`;
}
function flame(cx, by, k, c, t) {
  const f = 1 + 0.06 * Math.sin(t * 9) + 0.04 * Math.sin(t * 13.7);
  const d = `M${cx},${by} c${-60 * k},0 ${-80 * k},${-50 * k} ${-60 * k},${-100 * k} c${10 * k},${-30 * k} ${30 * k},${-40 * k} ${25 * k},${-80 * k} c${40 * k},${25 * k} ${55 * k},${60 * k} ${50 * k},${95 * k} c${10 * k},${-15 * k} ${15 * k},${-30 * k} ${15 * k},${-45 * k} c${30 * k},${35 * k} ${40 * k},${75 * k} ${30 * k},${100 * k} c${-8 * k},${20 * k} ${-30 * k},${30 * k} ${-60 * k},${30 * k} z`;
  return `<g transform="translate(${cx},${by}) scale(1,${f.toFixed(3)}) translate(${-cx},${-by})"><path d="${d}" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/></g>`;
}
function hdd(cx, cy, r, st, ang, o = {}) { // disco rigido in sezione: piatto + testina
  let s = `<rect x="${cx - r - 40}" y="${cy - r - 40}" width="${2 * r + 80}" height="${2 * r + 120}" rx="16" fill="${DIM()}" stroke="${st}" stroke-width="4"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${st}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="none" stroke="${st}" stroke-width="2" opacity="0.4"/><circle cx="${cx}" cy="${cy}" r="${r * 0.18}" fill="none" stroke="${st}" stroke-width="4"/>`;
  for (let i = 0; i < 3; i++) { const a = ang + i * 2.1; s += `<line x1="${cx + r * 0.25 * Math.cos(a)}" y1="${cy + r * 0.25 * Math.sin(a)}" x2="${cx + r * 0.9 * Math.cos(a)}" y2="${cy + r * 0.9 * Math.sin(a)}" stroke="${st}" stroke-width="2" opacity="0.35"/>`; }
  const px = cx + r + 10, py = cy + r + 40;
  s += `<circle cx="${px}" cy="${py}" r="14" fill="none" stroke="${st}" stroke-width="4"/><line x1="${px}" y1="${py}" x2="${cx + r * 0.35}" y2="${cy + r * 0.15}" stroke="${st}" stroke-width="7" stroke-linecap="round"/>`;
  return s;
}
function check(x, y, k, c, p = 1) { // spunta disegnata
  const L1 = 22 * k, L2 = 50 * k, tot = L1 + L2, d = tot * (1 - clamp(p));
  return `<path d="M${x - 22 * k},${y} l${16 * k},${16 * k} l${34 * k},${-36 * k}" fill="none" stroke="${c}" stroke-width="${6 * k}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${tot}" stroke-dashoffset="${d}"/>`;
}
function loopArrows(cx, cy, r, st, ang, sw = 6) { // due frecce circolari che girano
  let s = '';
  for (let i = 0; i < 2; i++) {
    const a0 = ang + i * Math.PI, a1 = a0 + Math.PI * 0.72;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    s += `<path d="M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linecap="round"/>`;
    const tx = -Math.sin(a1), ty = Math.cos(a1), h = 22; // tangente
    s += `<path d="M${x1 + tx * h},${y1 + ty * h} L${x1 + (Math.cos(a1)) * h * 0.8},${y1 + Math.sin(a1) * h * 0.8} L${x1 - Math.cos(a1) * h * 0.8},${y1 - Math.sin(a1) * h * 0.8} z" fill="${st}"/>`;
  }
  return s;
}
function moon(cx, cy, r, st) { return `<path d="M${cx + r * 0.3},${cy - r} a${r},${r} 0 1 0 ${r * 0.7},${r * 1.45} a${r * 0.8},${r * 0.8} 0 0 1 ${-r * 0.7},${-r * 1.45} z" fill="none" stroke="${st}" stroke-width="3.5" stroke-linejoin="round"/>`; }

// 1 — aggancio: tre modi di perdere un computer
scene('hook', { make: (W) => ({
  capAt: W('non'),
  render(t) {
    let s = '';
    const items = [
      [380, 0.1, 'SI ROMPE', (cx, by) => laptop(cx, by, 300, C.line) + (t < W('rompersi') ? '' : `<polyline points="${cx - 60},${by - 200} ${cx - 10},${by - 150} ${cx - 40},${by - 120} ${cx + 30},${by - 70}" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>`)],
      [960, W('cadere') - 0.1, "CADE IN ACQUA", (cx, by) => laptop(cx, by - 20, 300, C.line) + [0, 1].map(j => `<path d="M${cx - 230},${by + 20 + j * 26 + 6 * Math.sin(t * 3 + j)} q40,-18 80,0 t80,0 t80,0 t80,0 t80,0 t80,0" fill="none" stroke="${C.line}" stroke-width="4" opacity="${0.9 - j * 0.35}"/>`).join('') +
        [0, 1, 2].map(j => { const yy = by - 330 + ((t * 120 + j * 60) % 150); return `<path d="M${cx + 120 + j * 40},${yy} q-14,22 0,30 q14,-8 0,-30 z" fill="none" stroke="${C.line}" stroke-width="3"/>`; }).join('')],
      [1540, W('rubato') - 0.1, 'VIENE RUBATO', (cx, by) => `<g stroke-dasharray="12 12">${laptop(cx, by, 300, C.line, { fill: 'none', sw: 3 })}</g>` + T(cx, by - 120, '?', { f: 'pop', size: 110, a: 'middle' })],
    ];
    items.forEach(([cx, t0, l, f], i) => {
      s += E(t, t0, f(cx, 640), { dy: 18 }) + E(t, i === 0 ? W('rompersi') - 0.1 : t0, lbl(cx, 740, l), { dy: 10 });
    });
    return s + caption(t, W('non'), 'Non se, ma quando', 'quando');
  } }) });

// 2 — rischi: disco rotto, file cancellato, settimane perse
scene('rischi', { make: (W) => ({
  capAt: W('così'),
  render(t) {
    let s = '';
    const broke = t > W('rompono');
    s += E(t, -0.3, hdd(400, 400, 150, C.line, broke ? 0.3 : t * 6), { dy: 0 });
    if (broke) s += E(t, W('rompono'), `<polyline points="330,260 390,350 350,400 430,470 400,560" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`, { dy: 0, d: 0.3 });
    s += E(t, W('dischi') - 0.1, lbl(400, 740, 'DISCO RIGIDO'));
    // file -> cestino
    const tc = W('cancellati'), p = eio((t - tc) / 0.9);
    if (t > W('file') - 0.15) {
      const fx = lerp(860, 900, p), fy = lerp(300, 470, p), sc = lerp(1, 0.55, p);
      s += E(t, W('file') - 0.15, `<g opacity="${(1 - 0.85 * clamp((t - tc - 0.7) / 0.3)).toFixed(2)}" transform="translate(${fx},${fy}) scale(${sc}) translate(-60,-80)">${doc(0, 0, 120, 160, C.line)}</g>`, { dy: 0 });
      s += E(t, W('file') - 0.15, `<path d="M880,520 h120 l-12,170 h-96 z" fill="${DIM()}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/><line x1="860" y1="520" x2="1020" y2="520" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/><rect x="920" y="500" width="40" height="20" rx="4" fill="none" stroke="${C.line}" stroke-width="4"/>` +
        [910, 940, 970].map(x => `<line x1="${x}" y1="550" x2="${x}" y2="660" stroke="${C.line}" stroke-width="3" opacity="0.6"/>`).join('') + lbl(940, 740, 'CANCELLATO PER ERRORE'), { dy: 10 });
    }
    // settimane di lavoro: compaiono piene, poi svaniscono
    const tg = W('così') - 0.1, tf = W('perdono');
    if (t > tg) {
      let g = '';
      for (let w = 0; w < 3; w++) for (let d = 0; d < 7; d++) {
        const x = 1330 + d * 56, y = 290 + w * 110, fade = clamp((t - tf - (w * 7 + d) * 0.015) / 0.25);
        g += `<rect x="${x}" y="${y}" width="44" height="80" rx="6" fill="${C.line}" fill-opacity="${(0.55 * (1 - fade)).toFixed(2)}" stroke="${C.line}" stroke-width="3" ${fade > 0 ? 'stroke-dasharray="6 6"' : ''} opacity="${(1 - 0.8 * fade).toFixed(2)}"/>`;
      }
      s += E(t, tg, g + lbl(1500, 740, 'SETTIMANE DI LAVORO'), { dy: 10 });
    }
    return s + caption(t, W('così'), 'Settimane di lavoro perse', '');
  } }) });

// 3 — la regola (chiaro)
scene('regola', { tail: 1.95, make: (W) => ({
  capAt: W('standard'),
  render(t) {
    let s = lightBg();
    s += E(t, -0.3, card(360, 150, 1200, 640), { dy: 0 });
    s += E(t, W('regola') - 0.1, lbl(960, 250, 'LA REGOLA', { fill: C.ink }));
    const dg = [['3', 'COPIE', 620, W('tre')], ['2', 'SUPPORTI', 960, W('due')], ['1', 'FUORI SEDE', 1300, W('uno', 1)]];
    dg.forEach(([n, l, x, t0], i) => {
      s += pop(t, t0 - 0.05, x, 470, T(x, 540, n, { f: 'pop', size: 260, fill: C.ink, a: 'middle' }));
      s += E(t, t0 + 0.05, lbl(x, 660, l, { fill: C.ink, size: 30 }));
      if (i < 2) s += E(t, dg[i + 1][3] - 0.1, `<circle cx="${(x + dg[i + 1][2]) / 2}" cy="450" r="9" fill="${C.ink}"/>`);
    });
    if (t < W('regola') - 0.1) s += E(t, 0.1, IT(960, 480, 'per non perdere nulla di importante', { fill: C.ink, a: 'middle', size: 60 }), { dy: 12 });
    return s + caption(t, W('standard'), 'Lo standard professionale', 'professionale', true);
  } }) });

// 4 — tre copie
scene('tre', { tail: 0.95, make: (W) => ({
  capAt: W('copie'),
  render(t) {
    let s = '';
    s += E(t, -0.3, T(330, 560, '3', { f: 'pop', size: 340, a: 'middle' }) + lbl(330, 660, 'COPIE', { size: 30 }), { dy: 0 });
    const d = [[720, 'ORIGINALE', W("l'originale") - 0.1, C.coral], [1080, 'BACKUP 1', W('due') - 0.1, C.line], [1440, 'BACKUP 2', W('due') + 0.05, C.line]];
    d.forEach(([x, l, t0, c]) => s += E(t, t0, doc(x - 110, 280, 220, 300, c, { sw: 5 }) + lbl(x, 660, l), { dy: 18 }));
    if (t > W('due')) s += E(t, W('due'), arrow(850, 470, 950, 470, C.line) + `<path d="M720,262 C760,170 1360,170 1424,252" fill="none" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>` + arrow(1410, 236, 1432, 262, C.line), { dy: 0 });
    return s + caption(t, W('copie'), 'Tre copie del file', '');
  } }) });

// 5 — due supporti
scene('due', { tail: 0.7, make: (W) => ({
  capAt: W('supporti'),
  render(t) {
    let s = '';
    s += E(t, -0.3, T(300, 560, '2', { f: 'pop', size: 340, a: 'middle' }) + lbl(300, 660, 'SUPPORTI', { size: 30 }), { dy: 0 });
    s += E(t, W('esempio') - 0.1, pillTag(1640, 200, 'ESEMPIO', C.line, C.bg, 'middle'), { dy: 0 });
    // portatile in sezione con disco interno
    const ti = W('interno') - 0.1;
    // il disco interno sta nello chassis (base), disegnata in trasparenza sotto la tastiera
    s += E(t, W('disco') - 0.3, laptop(860, 560, 440, C.line) + `<rect x="620" y="560" width="480" height="90" rx="10" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/>`, { dy: 0 });
    if (t > ti) s += E(t, ti, `<rect x="760" y="572" width="200" height="66" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 6"/>` + extDisk(790, 580, 140, 50, C.line, { sw: 3 }) + lbl(860, 720, 'DISCO INTERNO'), { dy: 10 });
    const te = W('disco', 1) - 0.1;
    if (t > te) {
      const cp = eo((t - te) / 0.6);
      s += `<path d="M1100,610 C1200,610 1220,520 ${lerp(1100, 1330, cp)},520" fill="none" stroke="${C.line}" stroke-width="4"/>`;
      s += E(t, te, extDisk(1330, 380, 240, 220, C.coral, { sw: 5 }) + lbl(1450, 720, 'DISCO ESTERNO'), { dy: 18 });
    }
    return s + caption(t, W('supporti'), 'Due supporti diversi', '');
  } }) });

// 6 — una copia fuori sede
scene('uno', { tail: 0.6, make: (W) => ({
  capAt: W('copia'),
  render(t) {
    let s = '';
    s += E(t, -0.3, T(240, 560, '1', { f: 'pop', size: 340, a: 'middle' }) + lbl(240, 660, 'FUORI SEDE', { size: 30 }), { dy: 0 });
    // casa con computer e disco dentro
    s += E(t, -0.2, house(470, 300, 460, 400, C.line) + laptop(640, 650, 180, C.line, { sw: 3 }) + extDisk(780, 560, 90, 90, C.line, { sw: 3 }) + lbl(700, 760, 'CASA'), { dy: 0 });
    // distanza
    if (t > W('sede') - 0.1) s += E(t, W('sede') - 0.1, `<line x1="980" y1="520" x2="1270" y2="520" stroke="${C.line}" stroke-width="3" stroke-dasharray="4 12"/>` + lbl(1125, 500, 'LONTANO'), { dy: 0 });
    // cloud con la copia
    if (t > W('cloud') - 0.15) s += E(t, W('cloud') - 0.15, cloud(1520, 470, 1.25, C.line) + doc(1480, 380, 90, 120, C.line, { sw: 3, lines: 3 }) + lbl(1520, 640, 'CLOUD'), { dy: 18 });
    // incendio
    if (t > W('brucia') - 0.1) s += E(t, W('brucia') - 0.1, flame(700, 470, 1.35, C.coral, t), { dy: 10 });
    if (t > W('non') - 0.1) s += E(t, W('non') - 0.1, check(1700, 300, 1.2, C.line, (t - W('non')) / 0.4) + lbl(1520, 760, 'NON PERDI TUTTO'), { dy: 0 });
    return s + caption(t, W('copia'), 'Una copia fuori sede', '');
  } }) });

// 7 — la versione per te (chiaro)
scene('studente', { tail: 1.5, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.2, T(96, 230, 'Per te, in pratica', { f: 'pop', size: 72, fill: C.ink }), { dy: 0 });
    const cards = [
      [W('computer') - 0.2, '1 · COMPUTER', '', 'copia principale', (cx) => laptop(cx, 560, 240, C.ink, { fill: C.cream })],
      [W('chiavetta') - 0.2, '2 · CHIAVETTA USB', 'O DISCO ESTERNO', 'copia locale', (cx) => usb(cx - 150, 450, 150, 60, C.ink) + extDisk(cx + 30, 400, 120, 160, C.ink, { fill: C.cream })],
      [W('una', 1) - 0.2, '3 · CLOUD', '', 'copia remota', (cx) => cloud(cx, 470, 1.0, C.coral, { fill: C.cream, sw: 5 })],
    ];
    cards.forEach(([t0, l1, l2, it, f], i) => {
      const x = 130 + i * 570, cx = x + 250;
      s += E(t, t0, card(x, 300, 500, 560, { rot: [-1.2, 0.8, -0.6][i] }) + f(cx) + lbl(cx, 660, l1, { fill: C.ink }) + (l2 ? lbl(cx, 700, l2, { fill: C.ink }) : '') + IT(cx, 790, it, { fill: C.ink, a: 'middle', size: 54 }), { dy: 24 });
    });
    return s;
  } }) });

// 8 — automatico
scene('automatico', { tail: 0.1, make: (W) => ({
  capAt: W('automatico'),
  render(t) {
    let s = '';
    // sinistra: backup automatico, frecce che girano da sole
    s += E(t, -0.2, loopArrows(480, 420, 150, C.coral, t * 1.6, 8) + extDisk(420, 370, 120, 100, C.line, { sw: 3 }) + lbl(480, 680, 'AUTOMATICO'), { dy: 0 });
    // destra: a mano, ogni sera
    const t0 = W('ricordartelo') - 0.2;
    if (t > t0) {
      let g = lbl(1360, 250, 'A MANO, OGNI SERA');
      for (let i = 0; i < 6; i++) {
        const x = 1060 + i * 120, y = 300;
        g += `<rect x="${x}" y="${y}" width="96" height="230" rx="12" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/>` + moon(x + 48, y + 60, 26, C.line);
        const tk = t0 + 0.4 + i * 0.22;
        if (i < 5) { if (t > tk) g += check(x + 50, y + 160, 0.9, C.line, (t - tk) / 0.25); }
        else if (t > W('prima') - 0.1) g += E(t, W('prima') - 0.1, T(x + 48, y + 185, '?', { f: 'pop', size: 80, a: 'middle' }), { dy: 0 });
      }
      s += E(t, t0, g + (t > W('prima') - 0.1 ? E(t, W('prima') - 0.1, lbl(1360, 600, 'PRIMA O POI TE NE DIMENTICHI')) : ''), { dy: 12 });
    }
    return s + caption(t, W('automatico'), 'Automatico, o niente', '');
  } }) });

// 9 — strumenti integrati (chiaro)
scene('strumenti', { make: (W) => ({
  capAt: W('venti'),
  render(t) {
    let s = lightBg();
    // finestra di impostazioni del sistema operativo
    const on = t > W('integrati');
    s += E(t, -0.2, card(150, 190, 760, 560) + `<line x1="150" y1="270" x2="910" y2="270" stroke="${C.ink}" stroke-width="3"/>` +
      lbl(200, 360, 'BACKUP INTEGRATO', { a: 'start', fill: C.ink }) + IT(200, 440, 'nel sistema operativo', { fill: C.ink, size: 46 }), { dy: 0 });
    const tp = eio((t - W('integrati')) / 0.35);
    s += E(t, -0.1, `<rect x="200" y="520" width="140" height="70" rx="35" fill="${on ? C.ink : 'none'}" stroke="${C.ink}" stroke-width="4"/><circle cx="${lerp(235, 305, tp)}" cy="555" r="25" fill="${on ? C.cream : C.ink}"/>` + T(370, 568, on ? 'ATTIVO' : 'SPENTO', { f: 'mono', size: 30, fill: C.ink, w: 700, ls: 3 }), { dy: 0 });
    // orologio: venti minuti
    const tm = W('venti') - 0.1;
    if (t > tm) {
      const cx = 1250, cy = 440, r = 150, a = -Math.PI / 2, a1 = a + 2 * Math.PI * 20 / 60 * eo((t - tm) / 0.8);
      const arc = `<path d="M${cx},${cy} L${cx + r * Math.cos(a)},${cy + r * Math.sin(a)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} z" fill="${C.coral}" opacity="0.85"/>`;
      let ticks = ''; for (let i = 0; i < 12; i++) { const b = i * Math.PI / 6; ticks += `<line x1="${cx + (r - 18) * Math.cos(b)}" y1="${cy + (r - 18) * Math.sin(b)}" x2="${cx + r * Math.cos(b)}" y2="${cy + r * Math.sin(b)}" stroke="${C.ink}" stroke-width="4"/>`; }
      s += E(t, tm, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/>` + arc + ticks + `<circle cx="${cx}" cy="${cy}" r="8" fill="${C.ink}"/>` + lbl(cx, 680, '20 MINUTI', { fill: C.ink, size: 30 }) + IT(cx, 740, 'la prima volta', { fill: C.ink, a: 'middle', size: 44 }), { dy: 16 });
    }
    const tq = W('poi') - 0.1;
    if (t > tq) s += E(t, tq, loopArrows(1640, 440, 90, C.ink, t * 1.6, 7) + lbl(1640, 680, 'POI DA SOLI', { fill: C.ink, size: 30 }), { dy: 16 });
    return s + caption(t, W('venti'), 'Venti minuti, una volta', '', true);
  } }) });

// 10 — quanto spesso: backup giornaliero (esempio)
scene('frequenza', { tail: 0.7, make: (W) => ({
  capAt: W('perdi'),
  render(t) {
    let s = '';
    s += E(t, -0.2, IT(96, 250, 'Quanto spesso?', { size: 76 }), { dy: 0 });
    const t1 = W('dipende') - 0.1, x0 = 200, dw = 230, y = 420;
    if (t > t1) {
      let g = '';
      for (let d = 0; d < 6; d++) g += `<rect x="${x0 + d * dw}" y="${y}" width="${dw - 20}" height="120" rx="10" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/>` + lbl(x0 + d * dw + (dw - 20) / 2, y + 72, `GIORNO ${d + 1}`, { size: 26 });
      s += E(t, t1, g + pillTag(1640, 350, 'ESEMPIO', C.line, C.bg, 'middle'), { dy: 12 });
    }
    // backup a fine giornata
    const t2 = W('giornaliero') - 0.1;
    if (t > t2) {
      let g = '';
      for (let d = 0; d < 4; d++) { const x = x0 + d * dw + dw - 10, tk = t2 + d * 0.15; if (t > tk) g += E(t, tk, `<line x1="${x}" y1="${y - 30}" x2="${x}" y2="${y + 150}" stroke="${C.line}" stroke-width="4"/>` + extDisk(x - 26, y + 160, 52, 44, C.line, { sw: 3 }), { dy: 8 }); }
      s += g + E(t, t2, lbl(x0 + 2 * dw, y + 270, 'BACKUP OGNI GIORNO, AUTOMATICO', { size: 28 }), { dy: 0 });
    }
    // guasto a metà del giorno 5 e lavoro perso
    const t3 = W('perdi') - 0.1;
    if (t > t3) {
      const xb = x0 + 4 * dw - 10, xg = x0 + 4 * dw + dw * 0.55;
      s += E(t, t3, `<polyline points="${xg - 10},${y - 60} ${xg + 18},${y - 20} ${xg - 8},${y - 10} ${xg + 14},${y + 30}" fill="none" stroke="${C.line}" stroke-width="6" stroke-linejoin="round"/>` + lbl(xg, y - 80, 'GUASTO'), { dy: 0 });
      const tb = W('massimo') - 0.1, p = eo((t - tb) / 0.5);
      if (t > tb) s += `<rect x="${xb}" y="${y}" width="${(xg - xb) * p}" height="120" fill="${C.line}" opacity="0.14"/>` + `<path d="M${xb},${y + 215} v20 H${lerp(xb, xg, p)} v-20" fill="none" stroke="${C.coral}" stroke-width="6" stroke-linejoin="round"/>` +
        E(t, tb + 0.2, lbl(xb + (xg - xb) / 2 + 160, y + 300, 'PERDI AL MASSIMO 1 GIORNO', { size: 28 }), { dy: 0 });
    }
    return s + caption(t, W('perdi'), 'Al massimo un giorno', '');
  } }) });

// 11 — cloud in tempo reale (chiaro): copia in più, che replica anche le cancellazioni
scene('realtime', { tail: 0.4, make: (W) => ({
  capAt: W('copia'),
  render(t) {
    let s = lightBg();
    const td = W('cancellazioni') - 0.1, del = clamp((t - td) / 0.4), arrive = td + 1.0, gone = clamp((t - arrive) / 0.4);
    // file sul computer: dopo la cancellazione diventa un contorno tratteggiato
    const docL = doc(260, 260, 300, 400, C.ink, { fill: C.cream, sw: 5, lines: 6 });
    s += E(t, -0.2, `<g opacity="${(1 - 0.75 * del).toFixed(2)}">${docL}</g>` + lbl(410, 730, 'IL TUO FILE', { fill: C.ink }), { dy: 0 });
    if (t > td) s += `<g opacity="${del.toFixed(2)}"><line x1="300" y1="300" x2="520" y2="620" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/><line x1="520" y1="300" x2="300" y2="620" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/></g>`;
    const tc = W('cloud') - 0.15;
    if (t > tc) {
      const copy = `<g opacity="${(1 - 0.8 * gone).toFixed(2)}">${doc(1420, 400, 80, 104, C.ink, { fill: C.cream, sw: 3, lines: 3 })}</g>` +
        (t > arrive ? `<g opacity="${gone.toFixed(2)}"><line x1="1415" y1="395" x2="1505" y2="510" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><line x1="1505" y1="395" x2="1415" y2="510" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/></g>` : '');
      s += E(t, tc, cloud(1460, 470, 1.3, C.coral, { fill: C.cream, sw: 6 }) + copy + lbl(1460, 640, 'CLOUD', { fill: C.ink }) + lbl(1460, 690, 'IN TEMPO REALE', { fill: C.ink }), { dy: 16 });
    }
    const tm = W('modifica') - 0.1;
    if (t > tm && t < td) {
      const k = (t - tm) * 1.4;
      s += `<rect x="${300 + (k * 60) % 200}" y="440" width="5" height="40" fill="${C.ink}" opacity="${Math.sin(t * 8) > 0 ? 1 : 0.2}"/>`;
      for (let q = 0; q < 3; q++) {
        const ph = k - q * 0.6; if (ph < 0) continue; const p = ph % 1.8 / 1.8;
        const x = lerp(600, 1300, eio(p)), yy = 460 - Math.sin(p * Math.PI) * 70;
        s += `<rect x="${x - 18}" y="${yy - 22}" width="36" height="44" rx="4" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" opacity="${(1 - clamp((p - 0.85) / 0.15)).toFixed(2)}"/>`;
      }
    }
    if (t > td && t < arrive + 0.2) { // la cancellazione viaggia anch'essa verso il cloud
      const p = clamp((t - td) / 1.0), x = lerp(600, 1300, eio(p)), yy = 460 - Math.sin(p * Math.PI) * 70;
      s += `<g opacity="${(1 - clamp((p - 0.85) / 0.15)).toFixed(2)}"><rect x="${x - 22}" y="${yy - 26}" width="44" height="52" rx="4" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="6 5"/>` +
        `<line x1="${x - 12}" y1="${yy - 12}" x2="${x + 12}" y2="${yy + 12}" stroke="${C.ink}" stroke-width="4"/><line x1="${x + 12}" y1="${yy - 12}" x2="${x - 12}" y2="${yy + 12}" stroke="${C.ink}" stroke-width="4"/></g>`;
    }
    if (t > tm) s += E(t, tm, lbl(950, 300, 'OGNI MODIFICA', { fill: C.ink }), { dy: 0 });
    const ts_ = W('entro') - 0.1;
    if (t > ts_) s += E(t, ts_, lbl(950, 600, 'ENTRO POCHI SECONDI', { fill: C.ink }), { dy: 0 });
    if (t > td) s += E(t, td, lbl(950, 660, 'ANCHE LE CANCELLAZIONI', { fill: C.ink }), { dy: 0 });
    const tn = W('non') - 0.1;
    if (t > tn) s += E(t, tn, pillTag(960, 820, 'NON SOSTITUISCE IL BACKUP', C.ink, C.cream, 'middle'), { dy: 10 });
    return s + caption(t, W('copia'), 'Una copia in più', '', true);
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'La regola 3-2-1', { f: 'pop', size: 130, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('tre') - 0.1, 960, 560, 'Tre copie, due supporti, una fuori sede.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'sede' });
    s += E(t, W('sede') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC DIG-2-03', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
