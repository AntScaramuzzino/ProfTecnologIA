// Il ciclo artificiale dell'acqua — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const capAt = def.capAt ?? null, nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (capAt != null) D = Math.max(D, capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

// ---- mondo: un territorio in sezione ----
const GY = 560;
const soil = mix(C.bg, C.line, 0.07), water = mix(C.bg, C.line, 0.22), dim = mix(C.bg, C.line, 0.4);
const label = (x, y, s, a = 'middle', op = 1) => T(x, y, s, { f: 'mono', size: 24, fill: C.line, ls: 3, a, op });
function drop(x, y, r = 16, fill = C.coral) {
  return `<path d="M${x},${y - 1.8 * r} C${x + 0.5 * r},${y - 1.1 * r} ${x + r},${y - 0.5 * r} ${x + r},${y + 0.1 * r} A${r},${r} 0 1 1 ${x - r},${y + 0.1 * r} C${x - r},${y - 0.5 * r} ${x - 0.5 * r},${y - 1.1 * r} ${x},${y - 1.8 * r}z" fill="${fill}"/>`;
}
function along(pts, p) {
  p = clamp(p); const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  let d = p * tot;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const q = seg[i] ? d / seg[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; } d -= seg[i]; }
}
const poly = pts => 'M' + pts.map(p => p.join(',')).join(' L');
// tubi: doppia linea con flusso tratteggiato che scorre
function pipe(pts, t, o = {}) {
  const d = poly(pts), w = o.w || 16, flow = o.flow ?? 1;
  let s = `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="${w + 6}" stroke-linejoin="round" stroke-linecap="round" opacity="${o.op ?? 1}"/>` +
    `<path d="${d}" fill="none" stroke="${o.inner || C.bg}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (flow > 0) s += `<path d="${d}" fill="none" stroke="${o.fc || dim}" stroke-width="4" stroke-dasharray="10 18" stroke-dashoffset="${(-t * 60).toFixed(1)}" opacity="${flow}"/>`;
  return s;
}
const P = {
  pozzo: [[170, 935], [170, 610], [480, 610], [480, 560]],
  potTorre: [[560, 560], [560, 640], [740, 640], [740, 345]],
  torreCase: [[805, 345], [805, 690], [1010, 690], [1010, 560]],
  torreCase2: [[1010, 690], [1160, 690], [1160, 560]],
  fogna: [[1090, 560], [1090, 770], [1450, 770], [1450, 620]],
  fogna2: [[1225, 560], [1225, 770]],
  scarico: [[1600, 600], [1730, 600], [1760, 630]],
};
function world(t, o = {}) {
  const lit = o.lit || 0; // numero di marcatori di fase visibili
  let s = '';
  // suolo, falda, fiume
  s += `<path d="M0,${GY} L1690,${GY} L1790,640 L1920,640 L1920,1080 L0,1080z" fill="${soil}" stroke="${C.line}" stroke-width="3"/>`;
  s += `<rect x="0" y="895" width="1920" height="90" fill="${water}" opacity="0.55"/>`;
  for (let i = 0; i < 40; i++) s += `<circle cx="${30 + i * 48}" cy="${915 + (i % 3) * 25}" r="3" fill="${C.line}" opacity="0.35"/>`;
  s += label(o.faldaX ?? 860, 960, 'FALDA SOTTERRANEA', 'start', 0.9);
  let wv = `M1740,612`; for (let x = 1740; x <= 1920; x += 15) wv += ` L${x},${612 + 4 * Math.sin(x / 25 + t * 2)}`;
  s += `<path d="${wv} L1920,640 L1790,640z" fill="${water}" stroke="${C.line}" stroke-width="2"/>`;
  s += label(1830, 690, 'FIUME', 'middle', 0.9);
  // tubi
  const fl = o.flow || {};
  s += pipe(P.pozzo, t, { flow: fl.a ?? 1 }) + pipe(P.potTorre, t, { flow: fl.a ?? 1 }) + pipe(P.torreCase, t, { flow: fl.a ?? 1 }) + pipe(P.torreCase2, t, { flow: fl.a ?? 1 });
  s += pipe(P.fogna, t, { flow: fl.f ?? 1, w: 18, fc: mix(C.bg, C.line, 0.3) }) + pipe(P.fogna2, t, { flow: fl.f ?? 1, w: 18, fc: mix(C.bg, C.line, 0.3) });
  s += pipe(P.scarico, t, { flow: fl.s ?? 1, w: 14 });
  // pozzo
  s += `<rect x="130" y="495" width="80" height="65" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><circle cx="170" cy="527" r="16" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  // potabilizzatore: edificio con tre vasche
  s += `<rect x="380" y="430" width="230" height="130" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`;
  [0, 1, 2].forEach(i => s += `<rect x="${398 + i * 70}" y="470" width="54" height="72" rx="4" fill="${water}" stroke="${C.line}" stroke-width="2"/>`);
  // torre dell'acqua
  s += `<path d="M735,345 L715,${GY} M805,345 L825,${GY} M722,450 L818,450" stroke="${C.line}" stroke-width="4" fill="none"/>`;
  s += `<rect x="700" y="255" width="140" height="95" rx="14" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><rect x="712" y="${290}" width="116" height="48" rx="6" fill="${water}"/>`;
  // case
  [[990, 440, 120, 120], [1140, 465, 100, 95]].forEach(([x, y, w, h]) => {
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><path d="M${x - 12},${y} L${x + w / 2},${y - 55} L${x + w + 12},${y}z" fill="${C.bg}" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>`;
    s += `<rect x="${x + 18}" y="${y + 22}" width="28" height="28" fill="none" stroke="${C.line}" stroke-width="2"/>`;
  });
  // depuratore: due vasche in sezione
  [[1390, 120], [1520, 110]].forEach(([x, w]) => {
    s += `<rect x="${x}" y="${GY}" width="${w}" height="75" fill="${water}" stroke="${C.line}" stroke-width="3"/>`;
  });
  s += `<path d="M1390,${GY - 30} L1390,${GY} M1630,${GY - 30} L1630,${GY}" stroke="${C.line}" stroke-width="3"/>`;
  // etichette delle fasi (in cielo, mai attraversate da linee)
  const marks = [[170, 455, 'CAPTAZIONE'], [495, 390, 'POTABILIZZ.'], [770, 225, 'DISTRIBUZIONE'], [1110, 355, 'USO'], [1265, 845, 'FOGNATURA'], [1510, 500, 'DEPURAZIONE']];
  marks.forEach(([x, y, n], i) => {
    if (i >= lit) return;
    const act = o.active === i + 1;
    const g = `<circle cx="${x - n.length * 8.5 - 26}" cy="${y - 8}" r="17" fill="${act ? C.ivory : C.bg}" stroke="${C.line}" stroke-width="2"/>` +
      T(x - n.length * 8.5 - 26, y, String(i + 1), { f: 'mono', size: 22, fill: act ? C.bg : C.line, a: 'middle', w: 700 }) + label(x + 10, y, n);
    s += o.marksAt ? pop(t, o.marksAt + i * 0.22, x, y - 8, g) : g;
  });
  return s;
}
function cam(cx, cy, s, inner) { return `<g transform="translate(960,540) scale(${s}) translate(${-cx},${-cy})">${inner}</g>`; }
function pills(t, x, y, items, light) {
  let s = '', cx = x; const ink = light ? C.ink : C.line, bg = light ? 'none' : C.bg;
  items.forEach(([l, t0]) => {
    const w = tw(l, 'mono', 24) + 40;
    s += E(t, t0, `<rect x="${cx}" y="${y}" width="${w}" height="50" rx="25" fill="${bg}" stroke="${ink}" stroke-width="2"/>` + T(cx + w / 2, y + 34, l, { f: 'mono', size: 24, fill: ink, a: 'middle' }));
    cx += w + 16;
  });
  return s;
}

// 1 — rubinetto
scene('hook', { L: 0.6, make: (W) => ({ capAt: null, render(t) {
  let s = '';
  const f = `<path d="M560,300 L860,300 Q900,300 900,340 L900,380 L840,380 L840,350 L560,350z" fill="${C.bg}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>` +
    `<rect x="470" y="270" width="90" height="110" rx="10" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>` +
    `<rect x="690" y="235" width="40" height="65" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/><rect x="640" y="220" width="140" height="22" rx="11" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
  s += E(t, -0.4, f, { dy: 0 });
  // gocce che cadono (periodiche, funzione pura di t)
  for (let k = 0; k < 4; k++) { const ph = ((t - W('arriva') + k * 0.35) % 1.4) / 1.4; if (t > W('arriva') - k * 0.35 && ph >= 0) s += drop(870, 400 + ph * 520, 14, C.line); }
  s += E(t, 0.2, `<path d="M760,960 L980,960" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`, { dy: 0 });
  s += words(t, W('ma') - 0.1, 1380, 520, 'Da dove viene?', { f: 'pop', size: 96, a: 'middle', key: 'viene?' });
  s += words(t, W('e', 1) - 0.1, 1380, 640, 'E dove va?', { f: 'pop', size: 96, a: 'middle', fill: C.line });
  return s;
} }) });

// 2 — acqua dolce: 100 quadratini, 2,5 in corallo
scene('dolce', { make: (W) => ({ capAt: W('cento') + 0.2, render(t, D) {
  let s = lightBg(), g = '';
  const k = 1 + 0.02 * t / D;
  g += E(t, -0.4, card(200, 150, 1520, 680, { rot: -1 }), { dy: 0 });
  g += E(t, -0.3, T(280, 250, 'Tutta l’acqua della Terra = 100 quadratini', { f: 'serif', size: 56, fill: C.ink }));
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 20), c = i % 20, x = 280 + c * 46, y = 300 + r * 46;
    const coral = i >= 97 && eo((t - W('due')) / 0.4) > 0;
    let fill = C.ivory;
    if (coral) fill = i === 97 ? `url(#half)` : C.coral;
    g += E(t, 0.05 + i * 0.006, `<rect x="${x}" y="${y}" width="38" height="38" rx="5" fill="${i === 97 && coral ? C.ivory : fill}" stroke="${C.ink}" stroke-width="2"/>` +
      (i === 97 && coral ? `<rect x="${x}" y="${y}" width="19" height="38" rx="5" fill="${C.coral}"/><rect x="${x}" y="${y}" width="38" height="38" rx="5" fill="none" stroke="${C.ink}" stroke-width="2"/>` : ''), { dy: 6, d: 0.3 });
  }
  g += E(t, W('due') + 0.1, T(1640, 470, '2,5%', { f: 'pop', size: 150, fill: C.ink, a: 'end' }));
  g += E(t, W('cinque') + 0.2, T(1640, 530, 'ACQUA DOLCE', { f: 'mono', size: 26, fill: C.ink, a: 'end', ls: 4 }));
  g += E(t, 0.8, T(280, 780, 'DATO: MC AMB-2-05', { f: 'mono', size: 24, fill: C.ink, ls: 3, op: 0.8 }));
  s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
  return s + caption(t, W('cento') + 0.2, 'Poca acqua dolce', 'dolce', true);
} }) });

// 3 — sei fasi: il territorio intero
scene('seifasi', { make: (W) => ({ capAt: W('artificiale'), render(t) {
  let s = world(t, { lit: 6, marksAt: W('artificiale') - 0.3, flow: { a: 0, f: 0, s: 0 } });
  // ciclo naturale, in alto a destra, tenue
  const nat = `<g transform="translate(0,70)"><path d="M1500,170 q30,-40 70,-20 q30,-35 70,0 q40,0 30,35 h-170 q-25,-5 0,-15z" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` +
    [0, 1, 2, 3].map(i => `<line x1="${1530 + i * 30}" y1="${215 + ((t * 80 + i * 20) % 40)}" x2="${1522 + i * 30}" y2="${235 + ((t * 80 + i * 20) % 40)}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`).join('') +
    label(1590, 120, 'CICLO NATURALE') + '</g>';
  s += E(t, W('naturale') - 0.2, nat);
  s += E(t, W('sei'), T(1880, 1010, '6 FASI', { f: 'pop', size: 64, fill: C.line, a: 'end' }), { dy: 0 });
  return s + caption(t, W('artificiale'), 'Un ciclo artificiale', 'artificiale');
} }) });

// 4 — captazione
scene('captazione', { make: (W) => ({ capAt: W('preleva'), render(t, D) {
  let inner = world(t, { lit: 1, active: 1, faldaX: 330, flow: { a: 0, f: 0, s: 0 } });
  const p = eo((t - W('preleva')) / 2.4), [x, y] = along([[170, 935], [170, 610], [400, 610]], p);
  inner += drop(x, y, 14);
  inner += E(t, W('duecento') - 0.2, `<path d="M240,${GY + 6} L240,930" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 8"/><path d="M228,${GY + 6} h24 M228,930 h24" stroke="${C.line}" stroke-width="3"/>` +
    `<rect x="258" y="${720}" width="190" height="56" rx="10" fill="${C.bg}"/>` + T(270, 758, '200–300 m', { f: 'mono', size: 30, fill: C.line, w: 700 }), { dy: 0 });
  let s = cam(640, 640, 1.55 + 0.04 * t / D, inner);
  s += pills(t, 96, 120, [['FIUMI', W('fiumi')], ['LAGHI', W('laghi')], ['SORGENTI', W('sorgenti')], ['FALDE', W('falde')]], false);
  return s + caption(t, W('preleva'), 'Prelevare l’acqua', 'Prelevare');
} }) });

// 5 — potabilizzazione: tre passaggi
scene('potabile', { make: (W) => ({ capAt: W('bevibile'), render(t, D) {
  let s = lightBg(), g = ''; const k = 1 + 0.02 * t / D;
  g += E(t, -0.3, T(240, 210, 'L’acqua grezza non è bevibile: tre passaggi', { f: 'serif', size: 60, fill: C.ink }));
  const steps = [['SEDIMENTARE', W('sedimentare')], ['FILTRARE', W('filtra')], ['DISINFETTARE', W('disinfetta')]];
  steps.forEach(([n, t0], i) => {
    const x = 220 + i * 510, y = 270;
    let c = card(x, y, 460, 500, { rot: [-1.5, 1, -1][i] });
    c += T(x + 40, y + 70, `${i + 1}`, { f: 'serif', size: 64, fill: C.coral, it: true }) + T(x + 95, y + 64, n, { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 });
    const bx = x + 80, by = y + 120;
    if (i === 0) {
      c += `<rect x="${bx}" y="${by}" width="300" height="240" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
      for (let j = 0; j < 14; j++) { const q = eo((t - t0 - j * 0.04) / 1.4); const px = bx + 25 + (j * 53) % 250, py = lerp(by + 30 + (j * 37) % 90, by + 222 - (j % 3) * 9, q); c += `<circle cx="${px}" cy="${py}" r="8" fill="${C.ink}"/>`; }
      c += T(x + 230, y + 430, 'i solidi pesanti vanno a fondo', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true });
    }
    if (i === 1) {
      const lay = [['sabbia', W('sabbia')], ['ghiaia', W('ghiaia')], ['carbone attivo', W('carbone')]];
      lay.forEach(([l, tl], j) => { c += E(t, tl, `<rect x="${bx}" y="${by + j * 80}" width="300" height="72" rx="6" fill="${[C.cream, C.ivory, mix(C.ivory, C.ink, 0.25)][j]}" stroke="${C.ink}" stroke-width="2"/>` + T(bx + 150, by + j * 80 + 46, l, { f: 'mono', size: 26, fill: C.ink, a: 'middle' }), { dy: 8 }); });
      c += T(x + 230, y + 430, 'strati che trattengono le impurità', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true });
    }
    if (i === 2) {
      c += `<rect x="${bx}" y="${by}" width="300" height="240" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
      c += T(bx + 150, by + 110, 'cloro', { f: 'pop', size: 64, fill: C.ink, a: 'middle' });
      c += T(bx + 150, by + 170, 'talvolta ozono o UV', { f: 'mono', size: 24, fill: C.ink, a: 'middle' });
      c += T(x + 230, y + 430, 'elimina i microbi', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true });
    }
    g += E(t, t0 - 0.4, c);
  });
  s += `<g transform="translate(960,520) scale(${k}) translate(-960,-520)">${g}</g>`;
  return s + caption(t, W('bevibile'), 'Renderla bevibile', 'bevibile', true);
} }) });

// 6 — distribuzione
scene('distribuzione', { make: (W) => ({ capAt: W('gravità'), render(t, D) {
  let inner = world(t, { lit: 3, active: 3, flow: { a: 1, f: 0, s: 0 } });
  // pompa alla base della torre
  inner += E(t, W('pompe'), `<circle cx="680" cy="640" r="26" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><path d="M668,628 L696,640 L668,652z" fill="${C.line}"/>` + label(680, 600, 'POMPA'), { dy: 0 });
  // freccia gravità dalla torre verso le case
  inner += E(t, W('gravità') - 0.2, arrow(850, 300, 850, 520, C.line, 4) + label(870, 420, 'GRAVITÀ', 'start'), { dy: 0 });
  const p1 = eo((t - W('pompe')) / 1.8), p2 = eo((t - W('spingono')) / 1.6);
  const [x, y] = p2 > 0 ? along(P.torreCase, p2) : along([...P.potTorre.slice(0, 3), [740, 330]], p1);
  if (t > W('pompe') - 0.1) inner += drop(x, y, 14);
  const s = cam(820, 470, 1.2 + 0.03 * t / D, inner);
  return s + caption(t, W('gravità'), 'La gravità spinge', 'gravità');
} }) });

// 7 — uso
scene('uso', { make: (W) => ({ capAt: W('giorno') - 0.2, render(t, D) {
  let s = lightBg(), g = ''; const k = 1 + 0.02 * t / D;
  g += E(t, -0.4, card(260, 170, 1400, 600, { rot: 1 }), { dy: 0 });
  g += pills(t, 330, 230, [['bere', W('bere')], ['cucinare', W('cucinare')], ['lavarsi', W('lavarsi')], ['WC', W('wc')]], true);
  g += E(t, W('duecentoventi') - 0.1, T(960, 540, '≈ 220 litri', { f: 'pop', size: 170, fill: C.ink, a: 'middle' }));
  g += E(t, W('persona'), T(960, 620, 'a persona, ogni giorno', { f: 'serif', size: 56, fill: C.ink, a: 'middle', it: true }));
  g += E(t, W('italia'), T(960, 700, 'CONSUMO MEDIO IN ITALIA · DATO: MC AMB-2-05', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3 }));
  s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
  return s + caption(t, W('giorno') - 0.2, 'Ogni giorno, a testa', 'giorno,', true);
} }) });

// 8 — fognatura
scene('fognatura', { make: (W) => ({ capAt: W('separata'), render(t, D) {
  const fl = eo((t - W('scorre')) / 1.0);
  let inner = world(t, { lit: 5, active: 5, flow: { a: 1, f: fl, s: 0 } });
  inner += E(t, W("dall'acquedotto") - 0.1, label(930, 738, 'ACQUEDOTTO', 'middle'), { dy: 0 });
  const p = eo((t - W('usata')) / 3.2), [x, y] = along(P.fogna, p);
  if (t > W('usata') - 0.1) inner += drop(x, y, 14);
  const s = cam(1150, 640, 1.25 + 0.03 * t / D, inner);
  return s + caption(t, W('separata'), 'Una rete separata', 'separata');
} }) });

// 9 — depurazione
scene('depurazione', { make: (W) => ({ capAt: W('batteri'), render(t, D) {
  let s = lightBg(), g = ''; const k = 1 + 0.02 * t / D;
  g += E(t, -0.3, T(240, 210, 'Nel depuratore', { f: 'serif', size: 60, fill: C.ink }));
  const items = [['GRIGLIE', W('griglie')], ['VASCHE', W('vasche')], ['BATTERI', W('batteri')]];
  items.forEach(([n, t0], i) => {
    const x = 220 + i * 510, y = 270; let c = card(x, y, 460, 470, { rot: [1, -1, 1.5][i] });
    c += T(x + 40, y + 70, `${i + 1}`, { f: 'serif', size: 64, fill: C.coral, it: true }) + T(x + 95, y + 64, n, { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 });
    const bx = x + 80, by = y + 120;
    if (i === 0) { for (let j = 0; j < 7; j++) c += `<line x1="${bx + 20 + j * 42}" y1="${by}" x2="${bx + 20 + j * 42}" y2="${by + 220}" stroke="${C.ink}" stroke-width="6"/>`; c += T(x + 230, y + 410, 'fermano gli oggetti grossi', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true }); }
    if (i === 1) { c += `<rect x="${bx}" y="${by}" width="300" height="220" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`; for (let j = 0; j < 12; j++) { const q = eo((t - t0 - j * 0.04) / 1.3); c += `<circle cx="${bx + 25 + (j * 61) % 250}" cy="${lerp(by + 30 + (j * 29) % 80, by + 204 - (j % 2) * 9, q)}" r="8" fill="${C.ink}"/>`; } c += T(x + 230, y + 410, 'i solidi si depositano', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true }); }
    if (i === 2) {
      c += `<rect x="${bx}" y="${by}" width="300" height="220" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
      const eat = eo((t - W('mangiano')) / 1.4);
      for (let j = 0; j < 16; j++) { if (j / 16 < eat) continue; c += `<circle cx="${bx + 30 + (j * 47) % 240}" cy="${by + 30 + (j * 53) % 160}" r="5" fill="${C.ink}" opacity="0.6"/>`; }
      [[bx + 80, by + 80], [bx + 200, by + 140], [bx + 140, by + 60]].forEach(([cx, cy], j) => c += `<ellipse cx="${cx + 10 * Math.sin(t * 2 + j)}" cy="${cy}" rx="26" ry="14" fill="none" stroke="${C.ink}" stroke-width="3"/>`);
      c += T(x + 230, y + 410, 'mangiano la sostanza organica', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true });
    }
    g += E(t, t0 - 0.3, c);
  });
  s += `<g transform="translate(960,510) scale(${k}) translate(-960,-510)">${g}</g>`;
  return s + caption(t, W('batteri'), 'Lavorano i batteri', 'batteri', true);
} }) });

// 10 — restituzione
scene('restituzione', { make: (W) => ({ capAt: W('torna'), render(t, D) {
  let inner = world(t, { lit: 6, active: 6, flow: { a: 1, f: 1, s: 1 } });
  // campi irrigati sopra il suolo a destra del depuratore
  inner += E(t, W('irriga') - 0.1, [0, 1, 2, 3].map(i => `<path d="M${1650 + i * 22},${GY - 4} l40,-40" stroke="${C.line}" stroke-width="3"/>`).join('') + label(1700, 470, 'CAMPI'), { dy: 0 });
  const p = eo((t - W('torna') + 0.3) / 1.4), [x, y] = along(P.scarico, p);
  inner += drop(x, y, 14);
  const s = cam(1270, 560, 1.5 + 0.03 * t / D, inner);
  return s + pills(t, 96, 120, [['FIUME', W('fiume')], ['MARE', W('mare')], ['CAMPI', W('campi')]], false) + caption(t, W('torna'), 'Torna all’ambiente', 'ambiente');
} }) });

// 11 — finale
scene('finale', { tail: 3.0, make: (W) => ({ capAt: null, render(t) {
  let s = lightBg();
  s += E(t, -0.4, T(960, 360, 'Il ciclo artificiale', { f: 'pop', size: 120, fill: C.ink, a: 'middle' }), { dy: 0 });
  s += E(t, -0.3, T(960, 480, 'dell’acqua', { f: 'pop', size: 120, fill: C.ink, a: 'middle' }), { dy: 0 });
  const names = ['captazione', 'potabilizzazione', 'distribuzione', 'uso', 'fognatura', 'depurazione'];
  let x = 960 - (names.reduce((a, n) => a + tw(n, 'mono', 24) + 56, 0) - 16) / 2;
  names.forEach((n, i) => { const w = tw(n, 'mono', 24) + 40; s += E(t, 0.1 + i * 0.12, `<rect x="${x}" y="560" width="${w}" height="50" rx="25" fill="none" stroke="${C.ink}" stroke-width="2"/>` + T(x + w / 2, 594, n, { f: 'mono', size: 24, fill: C.ink, a: 'middle' })); x += w + 16; });
  s += words(t, W('ogni'), 960, 700, 'ogni goccia del rubinetto fa questo viaggio', { f: 'serif', size: 52, fill: C.ink, a: 'middle', it: true, key: 'viaggio' });
  s += E(t, W('viaggio') + 0.4, `<line x1="760" y1="770" x2="1160" y2="770" stroke="${C.coral}" stroke-width="4"/>` + T(960, 830, 'PROFTECNOLOGIA · MC AMB-2-05', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 5 }));
  return s;
} }) });

let acc = 0; const TL = SCENES.map(s => { const o = { id: s.id, start: acc, D: s.D, L: s.L, voce: s.sc.voce_dur }; acc += s.D; return o; });
window.TIMELINE = { total: acc, scenes: TL };
window.render = function (T0) {
  let i = TL.findIndex(x => T0 < x.start + x.D); if (i < 0) i = TL.length - 1;
  const S = SCENES[i], t = T0 - TL[i].start;
  let body = S.light ? '' : `<rect width="1920" height="1080" fill="${C.bg}"/>`;
  body += S.render(t, S.D);
  if (S.id !== 'finale' && S.id !== 'hook') body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
