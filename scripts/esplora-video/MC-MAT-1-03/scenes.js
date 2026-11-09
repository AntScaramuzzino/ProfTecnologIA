// Tre domande per ogni materiale — MC-MAT-1-03 §"Come si valuta la sostenibilità di un materiale innovativo?". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d'-]/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.5);
  if (def.capAt != null) D = Math.max(D, def.capAt + 0.11 * (nWords - 1) + 0.45 + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<pattern id="hatchD" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="18" stroke="${C.lineDim}" stroke-width="3"/></pattern>
<pattern id="hatchL" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="18" stroke="${mix(C.cream, C.ink, 0.35)}" stroke-width="3"/></pattern></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const lblI = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.ink, ls: 3, a: o.a || 'middle', w: 700 });

// ---- mondo: oggetti e materiali in sezione, a filo chiaro ----
function cup(cx, cy, s, st, fill, hatch) { // bicchiere in sezione: parete spessa tratteggiata
  const tw_ = 64 * s, bw = 46 * s, h = 84 * s, k = 9 * s;
  const outer = `M${cx - tw_},${cy - h} L${cx - bw},${cy + h} L${cx + bw},${cy + h} L${cx + tw_},${cy - h}`;
  return `<path d="${outer} L${cx + tw_ - k},${cy - h} L${cx + bw - k * 0.9},${cy + h - k} L${cx - bw + k * 0.9},${cy + h - k} L${cx - tw_ + k},${cy - h} Z" fill="${hatch ? `url(#${hatch})` : fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M${cx - tw_ + k},${cy - h} L${cx - bw + k * 0.9},${cy + h - k} L${cx + bw - k * 0.9},${cy + h - k} L${cx + tw_ - k},${cy - h}" fill="${fill}" stroke="${st}" stroke-width="3" stroke-linejoin="round"/>` +
    `<rect x="${cx - tw_ - 6 * s}" y="${cy - h - 10 * s}" width="${2 * tw_ + 12 * s}" height="${12 * s}" rx="${5 * s}" fill="${fill}" stroke="${st}" stroke-width="4"/>`;
}
function bottle(cx, cy, s, st, fill) {
  const w = 44 * s, h = 110 * s;
  return `<path d="M${cx - 12 * s},${cy - h} v${-22 * s} h${24 * s} v${22 * s} C${cx + 14 * s},${cy - h + 30 * s} ${cx + w},${cy - h + 34 * s} ${cx + w},${cy - h + 70 * s} V${cy + h} H${cx - w} V${cy - h + 70 * s} C${cx - w},${cy - h + 34 * s} ${cx - 14 * s},${cy - h + 30 * s} ${cx - 12 * s},${cy - h} Z" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<rect x="${cx - 16 * s}" y="${cy - h - 36 * s}" width="${32 * s}" height="${16 * s}" rx="3" fill="${fill}" stroke="${st}" stroke-width="4"/>` +
    `<line x1="${cx - w}" y1="${cy - 10 * s}" x2="${cx + w}" y2="${cy - 10 * s}" stroke="${st}" stroke-width="3"/><line x1="${cx - w}" y1="${cy + 40 * s}" x2="${cx + w}" y2="${cy + 40 * s}" stroke="${st}" stroke-width="3"/>`;
}
function corn(x, g, h, st, fill) { // pianta di mais: fusto, foglie, pannocchia
  let s = `<line x1="${x}" y1="${g}" x2="${x}" y2="${g - h}" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
  [0.25, 0.45, 0.65, 0.82].forEach((f, i) => {
    const y = g - h * f, d = i % 2 ? 1 : -1;
    s += `<path d="M${x},${y} C${x + d * 40},${y - 40} ${x + d * 70},${y - 20} ${x + d * 92},${y + 18}" fill="none" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`;
  });
  s += `<ellipse cx="${x + 16}" cy="${g - h * 0.55}" rx="13" ry="34" transform="rotate(14 ${x + 16} ${g - h * 0.55})" fill="${fill}" stroke="${st}" stroke-width="4"/>`;
  s += `<path d="M${x},${g - h} l-14,-22 M${x},${g - h} l0,-28 M${x},${g - h} l14,-22" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`;
  return s;
}
function stump(x, g, st, fill) { // ceppo tagliato con radici in sezione
  return `<path d="M${x - 30},${g + 4} C${x - 50},${g + 30} ${x - 70},${g + 40} ${x - 90},${g + 46} M${x + 30},${g + 4} C${x + 52},${g + 26} ${x + 72},${g + 34} ${x + 92},${g + 40} M${x},${g + 4} C${x - 4},${g + 30} ${x + 6},${g + 44} ${x},${g + 58}" fill="none" stroke="${st}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M${x - 34},${g} V${g - 66} H${x + 34} V${g} Z" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<ellipse cx="${x}" cy="${g - 66}" rx="34" ry="11" fill="${fill}" stroke="${st}" stroke-width="5"/><ellipse cx="${x}" cy="${g - 66}" rx="18" ry="5" fill="none" stroke="${st}" stroke-width="3"/>`;
}
function hexSheet(cx, cy, a, cols, rows, st, sw = 3, p = 1) { // reticolo esagonale (grafene), p = quota disegnata
  let s = ''; const w = Math.sqrt(3) * a; let n = 0; const N = cols * rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (n++ >= N * p) continue;
    const x = cx + (c - (cols - 1) / 2) * w + (r % 2 ? w / 2 : 0) - w / 4, y = cy + (r - (rows - 1) / 2) * a * 1.5;
    const pts = [0, 1, 2, 3, 4, 5].map(k => { const an = Math.PI / 180 * (60 * k - 90); return [x + a * Math.cos(an), y + a * Math.sin(an)]; });
    s += `<path d="M${pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' L')} Z" fill="none" stroke="${st}" stroke-width="${sw}"/>`;
    s += pts.map(q => `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${sw + 2}" fill="${st}"/>`).join('');
  }
  return s;
}
function factory(x, g, s, st, fill) { // capannone con tetto a shed e camino
  const w = 300 * s, h = 150 * s;
  let p = `<rect x="${x + w * 0.72}" y="${g - h - 120 * s}" width="${34 * s}" height="${120 * s}" fill="${fill}" stroke="${st}" stroke-width="5"/>`;
  p += `<path d="M${x},${g} V${g - h} l${w / 3},${-50 * s} v${50 * s} l${w / 3},${-50 * s} v${50 * s} l${w / 3},${-50 * s} V${g} Z" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 0; i < 3; i++) p += `<rect x="${x + w * (0.1 + i * 0.3)}" y="${g - h * 0.62}" width="${w * 0.16}" height="${h * 0.3}" rx="4" fill="none" stroke="${st}" stroke-width="3"/>`;
  return p;
}
function binI(cx, g, s, st, fill) { // bidone della raccolta
  return `<path d="M${cx - 50 * s},${g - 130 * s} L${cx - 40 * s},${g} H${cx + 40 * s} L${cx + 50 * s},${g - 130 * s} Z" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<rect x="${cx - 60 * s}" y="${g - 150 * s}" width="${120 * s}" height="20" rx="6" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<path d="M${cx - 18 * s},${g - 100 * s} v${70 * s} M${cx + 18 * s},${g - 100 * s} v${70 * s}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`;
}
function leafI(cx, cy, s, st, fill) {
  return `<path d="M${cx - 40 * s},${cy + 40 * s} C${cx - 40 * s},${cy - 30 * s} ${cx},${cy - 44 * s} ${cx + 44 * s},${cy - 44 * s} C${cx + 44 * s},${cy + 10 * s} ${cx + 20 * s},${cy + 40 * s} ${cx - 40 * s},${cy + 40 * s} Z" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M${cx - 40 * s},${cy + 40 * s} L${cx + 22 * s},${cy - 22 * s}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`;
}
function flask(cx, cy, s, st, fill) {
  return `<path d="M${cx - 18 * s},${cy - 90 * s} V${cy - 30 * s} L${cx - 70 * s},${cy + 70 * s} Q${cx - 76 * s},${cy + 86 * s} ${cx - 58 * s},${cy + 86 * s} H${cx + 58 * s} Q${cx + 76 * s},${cy + 86 * s} ${cx + 70 * s},${cy + 70 * s} L${cx + 18 * s},${cy - 30 * s} V${cy - 90 * s}" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<line x1="${cx - 28 * s}" y1="${cy - 90 * s}" x2="${cx + 28 * s}" y2="${cy - 90 * s}" stroke="${st}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M${cx - 48 * s},${cy + 30 * s} H${cx + 48 * s}" stroke="${st}" stroke-width="3"/>`;
}
function thermo(cx, cy, s, st, fill, lev) {
  const h = 150 * s;
  return `<rect x="${cx - 16 * s}" y="${cy - h}" width="${32 * s}" height="${h}" rx="${16 * s}" fill="${fill}" stroke="${st}" stroke-width="5"/>` +
    `<circle cx="${cx}" cy="${cy + 14 * s}" r="${30 * s}" fill="${st}"/>` +
    `<rect x="${cx - 6 * s}" y="${cy - h * lev}" width="${12 * s}" height="${h * lev}" fill="${st}"/>` +
    [0.3, 0.5, 0.7, 0.9].map(f => `<line x1="${cx + 22 * s}" y1="${cy - h * f}" x2="${cx + 36 * s}" y2="${cy - h * f}" stroke="${st}" stroke-width="3"/>`).join('');
}
function coat(cx, cy, s, st, fill, lining) { // cappotto: sagoma con fodera in sezione
  const p = `M${cx - 60 * s},${cy - 150 * s} L${cx - 130 * s},${cy - 120 * s} L${cx - 170 * s},${cy + 60 * s} L${cx - 130 * s},${cy + 70 * s} L${cx - 108 * s},${cy - 30 * s} L${cx - 108 * s},${cy + 170 * s} H${cx + 108 * s} L${cx + 108 * s},${cy - 30 * s} L${cx + 130 * s},${cy + 70 * s} L${cx + 170 * s},${cy + 60 * s} L${cx + 130 * s},${cy - 120 * s} L${cx + 60 * s},${cy - 150 * s} L${cx},${cy - 60 * s} Z`;
  let g = `<path d="${p}" fill="${fill}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  if (lining) g += `<path d="M${cx - 92 * s},${cy - 20 * s} V${cy + 154 * s} H${cx - 14 * s} V${cy - 46 * s} Z" fill="url(#${lining})" stroke="${st}" stroke-width="3"/>`;
  g += `<path d="M${cx},${cy - 60 * s} V${cy + 170 * s}" stroke="${st}" stroke-width="4"/>` +
    [0, 1, 2].map(i => `<circle cx="${cx + 22 * s}" cy="${cy + (i * 60) * s}" r="${7 * s}" fill="${st}"/>`).join('') +
    `<path d="M${cx - 60 * s},${cy - 150 * s} L${cx - 40 * s},${cy - 90 * s} L${cx},${cy - 60 * s} L${cx + 40 * s},${cy - 90 * s} L${cx + 60 * s},${cy - 150 * s}" fill="none" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
  return g;
}
const tag = (x, y, s, st, fill) => { const w = tw(s, 'mono', 26) + 3 * s.length + 34; return `<rect x="${x}" y="${y - 32}" width="${w}" height="46" rx="8" fill="${fill}" stroke="${st}" stroke-width="3"/><circle cx="${x + 14}" cy="${y - 9}" r="5" fill="none" stroke="${st}" stroke-width="3"/>` + T(x + 24 + (w - 24) / 2, y, s, { f: 'mono', size: 26, fill: st, a: 'middle', ls: 3, w: 700 }); };
const cross = (cx, cy, r, st, sw = 7) => `<path d="M${cx - r},${cy - r} L${cx + r},${cy + r} M${cx + r},${cy - r} L${cx - r},${cy + r}" stroke="${st}" stroke-width="${sw}" stroke-linecap="round"/>`;
const qmark = (cx, cy, sz, fill) => T(cx, cy, '?', { f: 'pop', size: sz, fill, a: 'middle' });
function ground(x1, x2, g, st) {
  return `<rect x="${x1}" y="${g}" width="${x2 - x1}" height="70" fill="url(#hatchD)"/><line x1="${x1}" y1="${g}" x2="${x2}" y2="${g}" stroke="${st}" stroke-width="5"/>`;
}

// 1 — innovativo non vuol dire sostenibile (scuro)
scene('intro', { make: (W) => ({
  capAt: W('non'), last: W('automaticamente'),
  render(t) {
    const st = C.line; let s = '';
    // campione di materiale innovativo in sezione
    s += E(t, W('innovativo') - 0.05, `<path d="M420,380 L620,320 L780,380 L580,440 Z" fill="${C.bg}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M420,380 V560 L580,620 V440 Z" fill="url(#hatchD)" stroke="${st}" stroke-width="5" stroke-linejoin="round"/><path d="M580,440 V620 L780,560 V380 Z" fill="${C.bg}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
      lbl(600, 700, 'MATERIALE') + lbl(600, 740, 'INNOVATIVO'), { dy: 18 });
    // bicchiere con etichetta "bio"
    s += E(t, W('l\'etichetta') - 0.05, cup(1180, 480, 1.4, st, C.bg, 'hatchD') + `<path d="M1268,370 C1300,380 1316,400 1320,430" fill="none" stroke="${st}" stroke-width="3"/>` + lbl(1180, 720, 'BICCHIERE'), { dy: 18 });
    s += E(t, W('bio') - 0.05, tag(1300, 470, 'BIO', st, C.bg), { dy: 10 });
    // punto interrogativo: unico elemento corallo
    s += pop(t, W('automaticamente'), 1560, 520, qmark(1560, 600, 260, C.coral) + lbl(1560, 720, 'SOSTENIBILE?'));
    return s + caption(t, W('non'), 'Non automaticamente sostenibile', '');
  } }) });

// 2 — ciclo di vita e tre domande (chiaro)
scene('ciclo', { make: (W) => ({
  capAt: W('tre'), last: W('vecchio'),
  render(t) {
    const ink = C.ink; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += E(t, W('valutarlo'), T(960, 250, 'IL CICLO DI VITA', { f: 'mono', size: 30, fill: ink, a: 'middle', ls: 6, w: 700 }), { dy: 0 });
    const xs = [380, 760, 1160, 1540], names = ['MATERIA PRIMA', 'PRODUZIONE', 'USO', 'FINE VITA'];
    const icons = [leafI(380, 500, 1.1, ink, C.ivory), factory(670, 560, 0.6, ink, C.ivory), cup(1160, 500, 0.75, ink, C.ivory, 'hatchL'), binI(1540, 565, 0.85, ink, C.ivory)];
    xs.forEach((x, i) => {
      const t0 = W('valutarlo') + 0.15 + i * 0.4;
      s += E(t, t0, `<circle cx="${x}" cy="500" r="120" fill="${C.cream}" stroke="${ink}" stroke-width="4"/>` + icons[i] + lblI(x, 680, names[i]), { dy: 14 });
      if (i < 3) s += E(t, t0 + 0.1, arrow(x + 130, 500, xs[i + 1] - 130, 500, ink, 4), { dy: 0 });
    });
    // tre domande: sopra materia prima, produzione, fine vita
    [[380, 0], [760, 1], [1540, 2]].forEach(([x, i]) => {
      s += pop(t, W('domande') + i * 0.2, x, 350, `<circle cx="${x + 92}" cy="380" r="36" fill="${ink}"/>` + T(x + 92, 394, '?', { f: 'pop', size: 42, fill: C.ivory, a: 'middle' }));
    });
    s += E(t, W('vecchio') - 0.05, IT(960, 790, 'per qualsiasi materiale, vecchio o nuovo', { fill: ink, a: 'middle', size: 50 }), { dy: 10 });
    return s + caption(t, W('tre'), 'Tre domande', 'Tre', true).replace(/fill="#D97757"/g, `fill="${C.coralD}"`);
  } }) });

// 3 — da dove viene la materia prima (scuro)
scene('mais', { make: (W) => ({
  capAt: W('non'), last: W('convenzionale'),
  render(t) {
    const st = C.line; let s = '';
    s += E(t, W('prima'), lbl(96, 150 + 0, 'DOMANDA 1', { a: 'start' }), { dy: 0 });
    s += words(t, W('da'), 96, 220, 'Da dove viene la materia prima?', { f: 'serif', it: true, size: 64 });
    const G = 720;
    s += E(t, W('mais') - 0.3, ground(120, 1180, G, st), { dy: 0 });
    [220, 350, 480, 610].forEach((x, i) => { s += E(t, W('mais') + i * 0.1, corn(x, G, 230, st, C.bg), { dy: 14 }); });
    s += E(t, W('mais'), lbl(415, 830, 'MAIS'), { dy: 0 });
    // pesticidi: barra irroratrice e gocce che cadono (moto puro in t)
    s += E(t, W('pesticidi') - 0.05, `<line x1="160" y1="400" x2="680" y2="400" stroke="${st}" stroke-width="5"/>` + [220, 350, 480, 610].map(x => `<path d="M${x - 10},400 v14 h20 v-14" fill="none" stroke="${st}" stroke-width="4"/>`).join('') + lbl(420, 370, 'PESTICIDI'), { dy: 0 });
    if (t > W('pesticidi')) {
      for (let k = 0; k < 16; k++) {
        const x0 = [220, 350, 480, 610][k % 4] + (hsh(k) - 0.5) * 50, ph = ((t - W('pesticidi')) * 0.9 + hsh(k + 9)) % 1, y = 425 + ph * 120;
        s += `<circle cx="${x0.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${st}" opacity="${(1 - ph).toFixed(2)}"/>`;
      }
    }
    // terra deforestata: ceppi
    [860, 1000, 1140].forEach((x, i) => { s += E(t, W('deforestata') + i * 0.1, stump(x, G, st, C.bg), { dy: 12 }); });
    s += E(t, W('deforestata'), lbl(1000, 830, 'TERRA DEFORESTATA'), { dy: 0 });
    // confronto
    s += E(t, W('origine') - 0.05, `<line x1="1240" y1="300" x2="1240" y2="800" stroke="${C.lineDim}" stroke-width="3"/>` + cup(1420, 560, 1.05, st, C.bg, 'hatchD') + lbl(1420, 720, 'ORIGINE') + lbl(1420, 760, 'VEGETALE'), { dy: 14 });
    s += E(t, W('plastica') - 0.05, bottle(1720, 560, 1.0, st, C.bg) + lbl(1720, 720, 'PLASTICA') + lbl(1720, 760, 'CONVENZIONALE'), { dy: 14 });
    s += pop(t, W('necessariamente'), 1570, 560, qmark(1570, 600, 130, C.coral) + IT(1570, 400, 'meglio?', { a: 'middle', size: 48 }));
    return s + caption(t, W('non'), 'Non necessariamente meglio', '');
  } }) });

// 4 — materiale da rifiuto (chiaro)
scene('scarto', { make: (W) => ({
  capAt: W('non'), last: W('problema'),
  render(t) {
    const ink = C.ink; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    // cumulo di rifiuti in sezione: torsolo, guscio d'uovo rotto, buccia a spirale, lattina schiacciata
    let pile = `<path d="M250,600 C300,500 540,500 590,600 Z" fill="url(#hatchL)" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M300,520 c-14,-30 -10,-60 10,-70 c-10,15 -8,40 6,50 c14,-10 16,-35 6,-50 c20,10 24,40 10,70 z" fill="${C.ivory}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/><path d="M316,450 l4,-22" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M370,520 a46,40 0 0 0 92,0 l-12,-14 l-10,12 l-12,-16 l-12,14 l-12,-14 l-12,16 l-10,-12 z" fill="${C.ivory}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M490,470 c40,-20 80,0 60,30 c-20,30 -70,10 -50,-12 c16,-14 40,-2 30,12" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M410,470 l-20,-40 l30,-14 l8,12 l10,-6 l14,30 z" fill="${C.ivory}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
    s += E(t, W('rifiuto') - 0.05, pile + lblI(420, 660, 'RIFIUTO'), { dy: 14 });
    s += E(t, W('materiale') - 0.05, `<path d="M1260,420 L1460,360 L1620,420 L1420,480 Z" fill="${C.cream}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M1260,420 V560 L1420,620 V480 Z" fill="url(#hatchL)" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/><path d="M1420,480 V620 L1620,560 V420 Z" fill="${C.cream}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>` + lblI(1440, 700, 'MATERIALE'), { dy: 14 });
    s += E(t, W('rifiuto') + 0.3, arrow(620, 490, 1220, 490, C.coral, 8), { dy: 0 });
    // il problema di prima: niente coltivazione da cui partire
    s += E(t, W('problema') - 0.05, `<g opacity="0.85">${corn(820, 760, 150, ink, C.cream)}${stump(1000, 760, ink, C.cream)}</g>` + cross(910, 680, 110, ink, 7), { dy: 0 });
    return s + caption(t, W('non'), 'Non ha questo problema', '', true);
  } }) });

// 5 — come viene prodotto: grafene (scuro)
scene('grafene', { make: (W) => ({
  capAt: W('molta'), last: W('energia'),
  render(t) {
    const st = C.line; let s = '';
    s += E(t, W('seconda'), lbl(96, 150, 'DOMANDA 2', { a: 'start' }), { dy: 0 });
    s += words(t, W('come'), 96, 220, 'Come viene prodotto?', { f: 'serif', it: true, size: 64 });
    const p = clamp((t - W('grafene') + 0.05) / 0.9);
    if (p > 0) s += `<g opacity="${clamp(p * 3).toFixed(2)}">${hexSheet(520, 540, 44, 6, 5, st, 3, eo(p))}</g>`;
    s += E(t, W('grafene'), lbl(520, 800, 'GRAFENE'), { dy: 0 });
    s += E(t, W('straordinarie') - 0.05, IT(520, 340, 'proprietà straordinarie', { a: 'middle', size: 46 }), { dy: 10 });
    s += E(t, W('larga') - 0.05, factory(1040, 760, 1.25, st, C.bg) + lbl(1230, 830, 'SU LARGA SCALA'), { dy: 14 });
    // energia: misuratore che si riempie (unico corallo)
    const e = eio((t - W('richiede')) / 1.4);
    s += E(t, W('richiede') - 0.1, `<rect x="1580" y="330" width="90" height="430" rx="16" fill="${C.bg}" stroke="${st}" stroke-width="5"/>` + lbl(1625, 830, 'ENERGIA'), { dy: 0 });
    if (e > 0) s += `<rect x="1594" y="${(746 - 402 * e * 0.9).toFixed(1)}" width="62" height="${(402 * e * 0.9).toFixed(1)}" rx="8" fill="${C.coral}"/>`;
    return s + caption(t, W('molta'), 'Molta energia', '');
  } }) });

// 6 — micelio: temperatura ambiente (chiaro)
scene('micelio', { make: (W) => ({
  capAt: W('differenza'), last: W('aggressiva'),
  render(t) {
    const ink = C.ink; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    // stampo in sezione con scarti legati da filamenti che crescono
    s += E(t, W('micelio') - 0.3, `<path d="M240,330 V700 H860 V330" fill="none" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/><rect x="226" y="700" width="648" height="22" fill="url(#hatchL)" stroke="${ink}" stroke-width="3"/>`, { dy: 0 });
    const pts = [];
    for (let k = 0; k < 14; k++) {
      const x = 300 + (k % 5) * 125 + (hsh(k) - 0.5) * 50, y = 420 + Math.floor(k / 5) * 100 + (hsh(k + 5) - 0.5) * 30; pts.push([x, y]);
      s += E(t, W('materiali') - 0.1 + k * 0.03, `<rect x="${(x - 30).toFixed(1)}" y="${(y - 14).toFixed(1)}" width="60" height="28" rx="6" transform="rotate(${(hsh(k + 2) * 60 - 30).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${C.ivory}" stroke="${ink}" stroke-width="4"/>`, { dy: 8 });
    }
    const g = clamp((t - W('micelio')) / 3.2);
    if (g > 0) {
      let f = '';
      for (let k = 0; k < 22; k++) {
        const a = pts[k % 14], b = pts[k < 14 ? (k % 5 === 4 ? k + 5 : k + 1) % 14 : (k - 14 + 5) % 14], mx = (a[0] + b[0]) / 2 + (hsh(k + 30) - 0.5) * 80, my = (a[1] + b[1]) / 2 + (hsh(k + 40) - 0.5) * 80;
        f += `<path d="M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${(1 - clamp(g * 1.6 - hsh(k) * 0.6)).toFixed(3)}" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
      }
      s += f;
    }
    s += E(t, W('micelio'), lblI(550, 300, 'MICELIO + SCARTI'), { dy: 0 });
    // temperatura ambiente
    s += E(t, W('temperatura') - 0.05, thermo(1080, 560, 1.2, ink, C.ivory, 0.45) + lblI(1100, 700, 'TEMPERATURA') + lblI(1100, 740, 'AMBIENTE'), { dy: 14 });
    // senza chimica aggressiva
    s += E(t, W('senza') - 0.05, flask(1500, 520, 1.1, ink, C.ivory) + cross(1500, 520, 100, ink, 7) + lblI(1500, 700, 'CHIMICA') + lblI(1500, 740, 'AGGRESSIVA'), { dy: 14 });
    s += E(t, W('la'), lblI(1290, 240, 'NELLA PRODUZIONE') + T(1290, 290, 'il grafene richiede molta energia', { f: 'serif', it: true, size: 40, fill: ink, a: 'middle' }), { dy: 8 });
    const cap = caption(t, W('differenza'), 'Differenza di impatto enorme', 'enorme', true).replace(/fill="#D97757"/g, `fill="${C.coralD}"`);
    return s + cap;
  } }) });

// 7 — fine vita (scuro)
scene('finevita', { make: (W) => ({
  capAt: W('non'), last: W('convenzionale'),
  render(t) {
    const st = C.line; let s = '';
    s += E(t, W('terza'), lbl(96, 150, 'DOMANDA 3', { a: 'start' }), { dy: 0 });
    s += words(t, W('cosa'), 96, 220, 'Cosa succede a fine vita?', { f: 'serif', it: true, size: 64 });
    s += E(t, W('bioplastica') - 0.05, cup(330, 560, 1.1, st, C.bg, 'hatchD') + lbl(330, 720, 'BIOPLASTICA') + lbl(330, 760, 'COMPOSTABILE'), { dy: 14 });
    // ramo alto: raccolta dedicata -> compostaggio (manca)
    const miss = t > W('manca') + 0.1;
    const up = `<path d="M440,500 C560,420 640,380 760,380" fill="none" stroke="${st}" stroke-width="4" ${miss ? 'stroke-dasharray="14 12" opacity="0.6"' : ''}/>` +
      `<path d="M960,380 H1240" fill="none" stroke="${st}" stroke-width="4" ${miss ? 'stroke-dasharray="14 12" opacity="0.6"' : ''}/>`;
    s += E(t, W('raccolta') - 0.05, up + `<g opacity="${miss ? 0.6 : 1}">${binI(860, 450, 0.8, st, C.bg)}${factory(1250, 450, 0.75, st, C.bg)}${leafI(1362, 395, 0.45, st, C.bg)}</g>` +
      lbl(860, 300, 'RACCOLTA DEDICATA') + lbl(1365, 500, 'COMPOSTAGGIO'), { dy: 10 });
    s += E(t, W('manca'), cross(860, 380, 70, st, 8) + lbl(860, 510, 'MANCA'), { dy: 0 });
    // ramo basso: nella pratica reale (unico corallo)
    const pr = eio((t - W('pratica')) / 1.0);
    if (pr > 0) {
      s += `<path d="M440,620 C620,700 760,700 1060,700" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${(1 - pr).toFixed(3)}" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linecap="round"/>`;
      if (pr >= 1) s += arrow(1040, 700, 1110, 700, C.coral, 7);
    }
    s += E(t, W('pratica') - 0.05, lbl(760, 770, 'NELLA PRATICA REALE'), { dy: 0 });
    s += E(t, W('pratica'), binI(1280, 780, 0.9, st, C.bg), { dy: 12 });
    s += E(t, W('migliore') - 0.05, IT(1290, 840, 'non meglio della plastica convenzionale', { a: 'middle', size: 40 }), { dy: 8 });
    s += E(t, W('pratica'), lbl(1280, 610, 'INDIFFERENZIATO'), { dy: 0 });
    return s + caption(t, W('non'), 'Non è migliore', '');
  } }) });

// 8 — nel sistema in cui verrà usato (chiaro)
scene('sistema', { make: (W) => ({
  capAt: W('non'), last: W('laboratorio') + 0.5,
  render(t) {
    const ink = C.ink; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    // sistema d'uso: casa, bidoni, camion, impianto
    let sys = `<line x1="900" y1="660" x2="1700" y2="660" stroke="${ink}" stroke-width="5"/>` +
      `<path d="M940,660 V520 L1010,460 L1080,520 V660" fill="${C.cream}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/><rect x="990" y="590" width="40" height="70" fill="none" stroke="${ink}" stroke-width="4"/>` +
      binI(1150, 660, 0.55, ink, C.cream) + binI(1220, 660, 0.55, ink, C.cream) +
      `<rect x="1290" y="560" width="150" height="80" rx="8" fill="${C.cream}" stroke="${ink}" stroke-width="5"/><path d="M1440,590 h50 l30,30 v20 h-80 z" fill="${C.cream}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/><circle cx="1330" cy="650" r="16" fill="${C.cream}" stroke="${ink}" stroke-width="5"/><circle cx="1480" cy="650" r="16" fill="${C.cream}" stroke="${ink}" stroke-width="5"/>` +
      factory(1550, 660, 0.45, ink, C.cream);
    s += E(t, W('sistema') - 0.05, `<rect x="880" y="300" width="840" height="470" rx="16" fill="none" stroke="${C.coral}" stroke-width="6"/>` + sys + lblI(1300, 360, 'SISTEMA IN CUI VERRÀ USATO'), { dy: 14 });
    // laboratorio, condizioni ideali, barrato
    s += E(t, W('valutato') - 0.05, `<rect x="230" y="300" width="560" height="470" rx="16" fill="none" stroke="${ink}" stroke-width="4" stroke-dasharray="14 10"/>` + flask(510, 520, 1.15, ink, C.cream) + lblI(510, 360, 'LABORATORIO') + IT(510, 730, 'condizioni ideali', { fill: ink, a: 'middle', size: 44 }), { dy: 14 });
    s += E(t, W('condizioni'), `<line x1="250" y1="750" x2="770" y2="320" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>`, { dy: 0 });
    return s + caption(t, W('non'), 'Non in laboratorio', '', true);
  } }) });

// 9 — quanto dura, si può riparare (scuro)
scene('durata', { make: (W) => ({
  capAt: W('impatto'), last: W('bio') + 0.6,
  render(t) {
    const st = C.line; let s = '';
    s += E(t, W('l\'uso') - 0.1, lbl(96, 150, 'DURANTE L\'USO', { a: 'start' }), { dy: 0 });
    s += words(t, W('quanto'), 96, 220, 'Quanto dura?', { f: 'serif', it: true, size: 64 });
    s += words(t, W('si'), 500, 220, 'Si può riparare?', { f: 'serif', it: true, size: 64 });
    // cappotto con aerogel, toppa cucita
    s += E(t, W('aerogel') - 0.05, coat(560, 470, 1.0, st, C.bg, 'hatchD') + lbl(560, 690, 'CAPPOTTO CON AEROGEL'), { dy: 14 });
    s += E(t, W('riparabile') - 0.05, `<rect x="600" y="520" width="70" height="56" rx="6" fill="${C.bg}" stroke="${st}" stroke-width="4" stroke-dasharray="8 7"/>`, { dy: 0 });
    s += E(t, W('riparabile'), `<line x1="680" y1="548" x2="800" y2="548" stroke="${st}" stroke-width="3"/>` + lbl(812, 557, 'TOPPA', { a: 'start' }), { dy: 0 });
    // durata: barra lunga (unico corallo) contro barra breve
    const pl = eio((t - W('durevole')) / 1.2);
    if (pl > 0) s += `<rect x="300" y="752" width="${(560 * pl).toFixed(1)}" height="22" rx="11" fill="${C.coral}"/>`;
    s += E(t, W('durevole'), lbl(580, 820, 'DUREVOLE') + lbl(1080, 772, 'DURATA'), { dy: 0 });
    s += E(t, W('bio') - 0.05, coat(1360, 470, 1.0, st, C.bg) + tag(1420, 440, 'BIO', st, C.bg) + lbl(1360, 690, 'MATERIALE BIO'), { dy: 14 });
    const pb = eio((t - W('bio')) / 0.5);
    if (pb > 0) s += `<rect x="1300" y="752" width="${(120 * pb).toFixed(1)}" height="22" rx="11" fill="${st}"/>`;
    s += E(t, W('bio'), lbl(1360, 820, 'UNA STAGIONE'), { dy: 0 });
    s += E(t, W('bio'), lbl(1760, 762, 'SCHEMA', { a: 'end' }), { dy: 0 });
    return s + caption(t, W('impatto'), 'Impatto molto inferiore', '');
  } }) });

// 10 — cartello finale (chiaro)
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 400, 'Tre domande per ogni materiale', { f: 'pop', size: 92, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('per') - 0.1, 960, 520, 'Da dove viene? Come si produce?', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true });
    s += words(t, W('materiale') - 0.1, 960, 600, 'Cosa succede a fine vita?', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: 'fine vita', keyFill: C.coralD });
    s += E(t, W('nuovo'), `<line x1="760" y1="680" x2="1160" y2="680" stroke="${C.ink}" stroke-width="3"/>` + T(960, 740, 'PROFTECNOLOGIA · MC MAT-1-03', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
