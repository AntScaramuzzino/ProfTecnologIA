// Il ciclo artificiale dell'acqua — v2 (correzioni del revisore). render(t, D) puro.
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
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

// ---- mondo: un territorio in sezione ----
const GY = 560;
const soil = mix(C.bg, C.line, 0.07), water = mix(C.bg, C.line, 0.22), dim = mix(C.bg, C.line, 0.4);
const sewer = mix(mix(C.line, C.bg, 0.45), C.coral, 0.3); // grigio-bruno, derivato dalla palette
const label = (x, y, s, a = 'middle') => T(x, y, s, { f: 'mono', size: 24, fill: C.line, ls: 3, a });
const lw = s => tw(s, 'mono', 24) + s.length * 3;
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
// acqua pulita: tubo a doppia linea con flusso
function pipe(pts, t, flow = 1) {
  const d = poly(pts);
  let s = `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${C.bg}" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (flow > 0) s += `<path d="${d}" fill="none" stroke="${dim}" stroke-width="4" stroke-dasharray="10 18" stroke-dashoffset="${(-t * 60).toFixed(1)}" opacity="${flow}"/>`;
  return s;
}
// acqua usata: tratto pieno grigio-bruno a tratteggio largo, visivamente diverso
function sewerPipe(pts, t, flow = 1) {
  const d = poly(pts);
  return `<path d="${d}" fill="none" stroke="${sewer}" stroke-width="16" stroke-linejoin="round" stroke-linecap="butt" stroke-dasharray="22 10" stroke-dashoffset="${(-t * 40 * flow).toFixed(1)}"/>`;
}
const P = {
  pozzo: [[170, 800], [170, 560]],
  pompaPot: [[210, 527], [380, 527]],
  potTorre: [[580, 560], [580, 630], [735, 630], [735, 345]],
  torreCase: [[805, 345], [805, 650], [1015, 650], [1015, 560]],
  fogna: [[1185, 560], [1185, 690], [1335, 690], [1335, 635]],
  scarico: [[1530, 600], [1745, 600], [1765, 618]],
  irriga: [[1610, 600], [1610, 548]],
};
const MARKS = [[170, 455, 'CAPTAZIONE'], [490, 395, 'POTABILIZZAZIONE'], [770, 225, 'DISTRIBUZIONE'], [1100, 352, 'USO'], [1260, 745, 'FOGNATURA E RACCOLTA'], [1500, 470, 'DEPURAZIONE E RESTITUZIONE']];
function world(t, o = {}) {
  const lit = o.lit || 0, V = o.view || { x0: 0, x1: 1920, y0: 0, y1: 1080 };
  const inV = (xa, xb, ya, yb) => xa >= V.x0 + 10 && xb <= V.x1 - 10 && ya >= V.y0 && yb <= V.y1;
  let s = '';
  // suolo con sponda del fiume
  s += `<path d="M0,${GY} L1700,${GY} L1790,640 L1920,640 L1920,1080 L0,1080z" fill="${soil}" stroke="${C.line}" stroke-width="3"/>`;
  s += `<rect x="0" y="770" width="1920" height="70" fill="${water}"/>`;
  for (let i = 0; i < 40; i++) s += `<circle cx="${30 + i * 48}" cy="${785 + (i % 3) * 20}" r="3" fill="${C.line}" opacity="0.5"/>`;
  s += label(o.faldaX ?? 640, 818, 'FALDA SOTTERRANEA', 'start');
  let wv = `M1745,612`; for (let x = 1745; x <= 1920; x += 15) wv += ` L${x},${612 + 4 * Math.sin(x / 25 + t * 2)}`;
  s += `<path d="${wv} L1920,640 L1790,640z" fill="${water}" stroke="${C.line}" stroke-width="2"/>`;
  if (inV(1840 - lw('FIUME') / 2, 1840 + lw('FIUME') / 2, 668, 690)) s += label(1840, 690, 'FIUME');
  // campo irrigato (sagoma) sulla superficie
  for (let i = 0; i < 6; i++) { const x = 1570 + i * 20; s += `<path d="M${x},${GY} L${x},${GY - 26} M${x},${GY - 14} l-8,-8 M${x},${GY - 18} l8,-8" stroke="${C.line}" stroke-width="2.5" fill="none"/>`; }
  if (inV(1625 - lw('CAMPI') / 2, 1625 + lw('CAMPI') / 2, 490, 512)) s += label(1625, 512, 'CAMPI');
  // tubi: acquedotto a sinistra, fognatura a destra, mai incrociati
  const fl = o.flow || {};
  s += pipe(P.pozzo, t, fl.a ?? 1) + pipe(P.pompaPot, t, fl.a ?? 1) + pipe(P.potTorre, t, fl.a ?? 1) + pipe(P.torreCase, t, fl.a ?? 1);
  s += sewerPipe(P.fogna, t, fl.f ?? 1);
  s += pipe(P.scarico, t, fl.s ?? 1) + pipe(P.irriga, t, fl.s ?? 1);
  // pompa del pozzo
  s += `<rect x="130" y="495" width="80" height="65" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><circle cx="170" cy="527" r="16" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  // potabilizzatore
  s += `<rect x="380" y="430" width="230" height="130" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`;
  [0, 1, 2].forEach(i => s += `<rect x="${398 + i * 70}" y="470" width="54" height="72" rx="4" fill="${water}" stroke="${C.line}" stroke-width="2"/>`);
  // torre dell'acqua
  s += `<path d="M722,350 L712,${GY} M818,350 L828,${GY} M716,455 L824,455" stroke="${C.line}" stroke-width="4" fill="none"/>`;
  s += `<rect x="700" y="255" width="140" height="95" rx="14" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><rect x="712" y="290" width="116" height="48" rx="6" fill="${water}"/>`;
  // palazzina: ingresso acqua a sinistra, scarico a destra
  s += `<rect x="990" y="380" width="220" height="180" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) s += `<rect x="${1008 + c * 50}" y="${396 + r * 52}" width="30" height="32" fill="none" stroke="${C.line}" stroke-width="2"/>`;
  // depuratore: due vasche in sezione
  [[1300, 110], [1430, 100]].forEach(([x, w]) => s += `<rect x="${x}" y="${GY}" width="${w}" height="75" fill="${water}" stroke="${C.line}" stroke-width="3"/>`);
  // marcatori di fase (nascosti se escono dall'inquadratura)
  MARKS.forEach(([x, y, n], i) => {
    if (i >= lit) return;
    const w = lw(n), x0 = x - w / 2 - 44;
    if (!inV(x0 - 10, x + w / 2 + 20, y - 34, y + 12)) return;
    const act = o.active === i + 1;
    const g = `<rect x="${x0 - 10}" y="${y - 34}" width="${w + 64}" height="46" rx="23" fill="${C.bg}"/>` +
      `<circle cx="${x0 + 14}" cy="${y - 11}" r="18" fill="${act ? C.ivory : C.bg}" stroke="${C.line}" stroke-width="2"/>` +
      T(x0 + 14, y - 2, String(i + 1), { f: 'mono', size: 24, fill: act ? C.bg : C.line, a: 'middle', w: 700 }) + label(x + 10, y, n);
    s += o.marksAt != null ? pop(t, o.marksAt + i * 0.22, x, y - 11, g) : g;
  });
  return s;
}
function cam(cx, cy, s, inner) { return `<g transform="translate(960,540) scale(${s}) translate(${-cx},${-cy})">${inner}</g>`; }
const viewOf = (cx, cy, s) => ({ x0: cx - 960 / s, x1: cx + 960 / s, y0: cy - 540 / s + 110 / s, y1: cy + 540 / s - 160 / s });
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
  for (let k = 0; k < 4; k++) { const ph = ((t - W('arriva') + k * 0.35) % 1.4) / 1.4; if (t > W('arriva') - k * 0.35 && ph >= 0) s += drop(870, 400 + ph * 520, 14, C.line); }
  s += E(t, 0.2, `<path d="M760,960 L980,960" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`, { dy: 0 });
  s += words(t, W('ma') - 0.1, 1380, 560, 'Da dove viene?', { f: 'pop', size: 104, a: 'middle', key: 'viene?' });
  return s;
} }) });

// 2 — acqua dolce (corallo: i 2,5 quadratini)
scene('dolce', { make: (W) => ({ capAt: W('cento') + 0.2, render(t, D) {
  let s = lightBg(), g = ''; const k = 1 + 0.02 * t / D;
  g += E(t, -0.4, card(200, 150, 1520, 680, { rot: -1 }), { dy: 0 });
  g += E(t, -0.3, T(280, 250, 'Tutta l’acqua della Terra = 100 quadratini', { f: 'serif', size: 56, fill: C.ink }));
  const on = eo((t - W('due')) / 0.4) > 0;
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 20), c = i % 20, x = 280 + c * 46, y = 300 + r * 46;
    let q = `<rect x="${x}" y="${y}" width="38" height="38" rx="5" fill="${on && i >= 98 ? C.coral : C.ivory}" stroke="${C.ink}" stroke-width="2"/>`;
    if (on && i === 97) q += `<rect x="${x + 19}" y="${y}" width="19" height="38" fill="${C.coral}"/><rect x="${x}" y="${y}" width="38" height="38" rx="5" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
    g += E(t, 0.05 + i * 0.006, q, { dy: 6, d: 0.3 });
  }
  g += E(t, W('due') + 0.1, T(1640, 470, '2,5%', { f: 'pop', size: 150, fill: C.ink, a: 'end' }));
  g += E(t, W('cinque') + 0.2, T(1640, 530, 'ACQUA DOLCE', { f: 'mono', size: 26, fill: C.ink, a: 'end', ls: 4 }));
  g += E(t, 0.8, T(280, 780, 'DATO: MC AMB-2-05', { f: 'mono', size: 24, fill: C.ink, ls: 3 }));
  s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
  return s + caption(t, W('cento') + 0.2, 'Poca acqua dolce', '', true);
} }) });

// 3 — panoramica: sei fasi coi nomi del testo
scene('seifasi', { make: (W) => ({ capAt: W('artificiale'), render(t) {
  let s = world(t, { lit: 6, marksAt: W('artificiale') - 0.3, flow: { a: 0, f: 0, s: 0 } });
  const nat = `<path d="M1520,200 q30,-40 70,-20 q30,-35 70,0 q40,0 30,35 h-170 q-25,-5 0,-15z" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` +
    [0, 1, 2, 3].map(i => `<line x1="${1550 + i * 30}" y1="${245 + ((t * 80 + i * 20) % 40)}" x2="${1542 + i * 30}" y2="${265 + ((t * 80 + i * 20) % 40)}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`).join('') +
    label(1610, 150, 'CICLO NATURALE');
  s += E(t, W('naturale') - 0.2, nat);
  return s + caption(t, W('artificiale'), 'Un ciclo artificiale', 'artificiale');
} }) });

// 4 — captazione: pozzo → pompa → potabilizzatore; quota fuori scala
scene('captazione', { make: (W) => ({ capAt: W('preleva'), render(t, D) {
  const cx = 625, sc = 1.55 + 0.03 * t / D;
  let inner = world(t, { lit: 1, active: 1, faldaX: 280, view: viewOf(cx, 600, sc), flow: { a: 0, f: 0, s: 0 } });
  // interruzione di scala sul tubo del pozzo
  inner += `<rect x="140" y="672" width="60" height="22" fill="${soil}"/><path d="M142,684 l56,-16 M142,700 l56,-16" stroke="${C.line}" stroke-width="3"/>`;
  const p = eo((t - W('preleva')) / 2.6), [x, y] = along([[170, 790], [170, 527], [210, 527], [380, 527]], p);
  inner += drop(x, y, 13);
  inner += E(t, W('duecento') - 0.2, `<path d="M250,${GY + 6} L250,795" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 8"/><path d="M238,${GY + 6} h24 M238,795 h24" stroke="${C.line}" stroke-width="3"/>` +
    `<rect x="266" y="606" width="220" height="92" rx="10" fill="${C.bg}"/>` + T(280, 642, '200–300 m', { f: 'mono', size: 30, fill: C.line, w: 700 }) + T(280, 680, 'fuori scala', { f: 'mono', size: 24, fill: C.line }), { dy: 0 });
  let s = cam(cx, 600, sc, inner);
  s += pills(t, 96, 120, [['FIUMI', W('fiumi')], ['LAGHI', W('laghi')], ['SORGENTI', W('sorgenti')], ['FALDE', W('falde')]], false);
  return s + caption(t, W('preleva'), 'Prelevare l’acqua', '');
} }) });

// 5 — potabilizzazione: le schede entrano subito, i contenuti sulle parole
scene('potabile', { make: (W) => ({ capAt: W('bevibile'), render(t, D) {
  let s = lightBg(), g = ''; const k = 1 + 0.02 * t / D;
  g += E(t, -0.4, T(240, 210, 'L’acqua grezza non è bevibile: tre passaggi', { f: 'serif', size: 60, fill: C.ink }), { dy: 0 });
  const steps = [['SEDIMENTARE', W('sedimentare')], ['FILTRARE', W('filtra')], ['DISINFETTARE', W('disinfetta')]];
  steps.forEach(([n, t0], i) => {
    const x = 220 + i * 510, y = 270, bx = x + 80, by = y + 120;
    let c = card(x, y, 460, 500, { rot: [-1.5, 1, -1][i] });
    c += T(x + 40, y + 70, `${i + 1}`, { f: 'serif', size: 64, fill: C.ink, it: true }) + T(x + 95, y + 64, n, { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 });
    let inner = '';
    if (i === 0) {
      inner += `<rect x="${bx}" y="${by}" width="300" height="240" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
      for (let j = 0; j < 14; j++) { const q = eo((t - t0 - j * 0.04) / 1.4); inner += `<circle cx="${bx + 25 + (j * 53) % 250}" cy="${lerp(by + 30 + (j * 37) % 90, by + 222 - (j % 3) * 9, q)}" r="8" fill="${C.ink}"/>`; }
      inner += E(t, t0, T(x + 230, y + 430, 'i solidi pesanti vanno a fondo', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true }));
    }
    if (i === 1) {
      inner += `<rect x="${bx}" y="${by}" width="300" height="236" rx="6" fill="none" stroke="${C.ink}" stroke-width="2" stroke-dasharray="6 6"/>`;
      [['sabbia', W('sabbia')], ['ghiaia', W('ghiaia')], ['carbone attivo', W('carbone')]].forEach(([l, tl], j) => {
        inner += E(t, tl, `<rect x="${bx}" y="${by + j * 80}" width="300" height="72" rx="6" fill="${[C.cream, C.ivory, mix(C.ivory, C.ink, 0.25)][j]}" stroke="${C.ink}" stroke-width="2"/>` + T(bx + 150, by + j * 80 + 46, l, { f: 'mono', size: 26, fill: C.ink, a: 'middle' }), { dy: 8 });
      });
      inner += E(t, t0, T(x + 230, y + 430, 'strati che trattengono le impurità', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true }));
    }
    if (i === 2) {
      inner += `<rect x="${bx}" y="${by}" width="300" height="240" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
      inner += E(t, t0, T(bx + 150, by + 110, 'cloro', { f: 'pop', size: 64, fill: C.ink, a: 'middle' }) + T(bx + 150, by + 170, 'talvolta ozono o UV', { f: 'mono', size: 24, fill: C.ink, a: 'middle' }) +
        T(x + 230, y + 430, 'elimina i microbi', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true }));
    }
    g += E(t, 0.1 + i * 0.15, c + inner);
  });
  s += `<g transform="translate(960,520) scale(${k}) translate(-960,-520)">${g}</g>`;
  return s + caption(t, W('bevibile'), 'Renderla bevibile', 'bevibile', true);
} }) });

// 6 — distribuzione
scene('distribuzione', { make: (W) => ({ capAt: W('gravità'), render(t, D) {
  const cx = 820, sc = 1.2 + 0.03 * t / D;
  let inner = world(t, { lit: 3, active: 3, view: viewOf(cx, 470, sc), flow: { a: 1, f: 0, s: 0 } });
  inner += E(t, W('pompe'), `<circle cx="660" cy="630" r="26" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><path d="M648,618 L676,630 L648,642z" fill="${C.line}"/>` + label(660, 590, 'POMPA'), { dy: 0 });
  inner += E(t, W('gravità') - 0.2, arrow(915, 330, 915, 530, C.line, 4) + label(915, 312, 'GRAVITÀ'), { dy: 0 });
  const p1 = eo((t - W('pompe')) / 1.8), p2 = eo((t - W('spingono')) / 1.6);
  const [x, y] = p2 > 0 ? along(P.torreCase, p2) : along([...P.potTorre.slice(0, 3), [735, 330]], p1);
  if (t > W('pompe') - 0.1) inner += drop(x, y, 14);
  return cam(cx, 470, sc, inner) + caption(t, W('gravità'), 'La gravità spinge', '');
} }) });

// 7 — uso: palazzina con rubinetto subito in scena
scene('uso', { capText: 'Ogni giorno, a testa', make: (W) => ({ capAt: W('duecentoventi'), render(t, D) {
  let s = lightBg(), g = ''; const k = 1 + 0.02 * t / D;
  g += E(t, -0.4, card(200, 150, 1520, 660, { rot: 1 }), { dy: 0 });
  // disegno: palazzina, rubinetto, gocce
  let d = `<rect x="280" y="260" width="280" height="460" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) d += `<rect x="${305 + c * 85}" y="${285 + r * 82}" width="55" height="52" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
  d += `<path d="M560,520 L640,520 Q660,520 660,540 L660,560 L640,560 L640,545 L560,545z" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
  for (let j = 0; j < 3; j++) { const ph = ((t + j * 0.4) % 1.2) / 1.2; d += drop(650, 590 + ph * 120, 10, C.ink); }
  g += E(t, -0.3, d, { dy: 0 });
  g += pills(t, 760, 230, [['bere', W('bere')], ['cucinare', W('cucinare')], ['lavarsi', W('lavarsi')], ['WC', W('wc')]], true);
  g += E(t, W('duecentoventi') - 0.1, T(1180, 500, '≈ 220 litri', { f: 'pop', size: 140, fill: C.ink, a: 'middle' }));
  g += E(t, W('persona'), T(1180, 580, 'a persona, ogni giorno', { f: 'serif', size: 54, fill: C.ink, a: 'middle', it: true }));
  g += E(t, W('italia'), T(1180, 660, 'CONSUMO MEDIO IN ITALIA', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3 }) + T(1180, 700, 'DATO: MC AMB-2-05', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3 }));
  s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
  return s + caption(t, W('duecentoventi'), 'Ogni giorno, a testa', 'giorno,', true);
} }) });

// 8 — fognatura e raccolta
scene('fognatura', { make: (W) => ({ capAt: W('separata'), render(t, D) {
  const cx = 1386, sc = 1.8 + 0.02 * t / D;
  const fl = eo((t - W('scorre')) / 1.0);
  let inner = world(t, { lit: 5, active: 5, faldaX: 1480, view: viewOf(cx, 615, sc), flow: { a: 1, f: fl, s: 0 } });
  inner += E(t, W("dall'acquedotto") - 0.1, label(880, 712, 'ACQUEDOTTO', 'start'), { dy: 0 });
  const p = eo((t - W('usata')) / 3.0), [x, y] = along(P.fogna, p);
  if (t > W('usata') - 0.1) inner += drop(x, y, 13);
  return cam(cx, 615, sc, inner) + caption(t, W('separata'), 'Una rete separata', '');
} }) });

// 9 — depurazione: schede subito, contenuti sulle parole
scene('depurazione', { make: (W) => ({ capAt: W('batteri'), render(t, D) {
  let s = lightBg(), g = ''; const k = 1 + 0.02 * t / D;
  g += E(t, -0.4, T(240, 210, 'Nel depuratore', { f: 'serif', size: 60, fill: C.ink }), { dy: 0 });
  [['GRIGLIE', W('griglie')], ['VASCHE', W('vasche')], ['BATTERI', W('batteri')]].forEach(([n, t0], i) => {
    const x = 220 + i * 510, y = 270, bx = x + 80, by = y + 120;
    let c = card(x, y, 460, 470, { rot: [1, -1, 1.5][i] });
    c += T(x + 40, y + 70, `${i + 1}`, { f: 'serif', size: 64, fill: C.ink, it: true }) + T(x + 95, y + 64, n, { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 });
    let inner = '';
    if (i === 0) { let bars = ''; for (let j = 0; j < 7; j++) bars += `<line x1="${bx + 20 + j * 42}" y1="${by}" x2="${bx + 20 + j * 42}" y2="${by + 220}" stroke="${C.ink}" stroke-width="6"/>`; inner += E(t, t0 - 0.2, bars + T(x + 230, y + 410, 'fermano gli oggetti grossi', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true })); }
    if (i === 1) { inner += `<rect x="${bx}" y="${by}" width="300" height="220" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`; for (let j = 0; j < 12; j++) { const q = eo((t - t0 - j * 0.04) / 1.3); inner += `<circle cx="${bx + 25 + (j * 61) % 250}" cy="${lerp(by + 30 + (j * 29) % 80, by + 204 - (j % 2) * 9, q)}" r="8" fill="${C.ink}"/>`; } inner += E(t, t0, T(x + 230, y + 410, 'i solidi si depositano', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true })); }
    if (i === 2) {
      inner += `<rect x="${bx}" y="${by}" width="300" height="220" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
      const eat = eo((t - W('mangiano')) / 1.4);
      for (let j = 0; j < 16; j++) { if (j / 16 < eat) continue; inner += `<circle cx="${bx + 30 + (j * 47) % 240}" cy="${by + 30 + (j * 53) % 160}" r="5" fill="${C.ink}" opacity="0.6"/>`; }
      inner += E(t, t0, [[bx + 80, by + 80], [bx + 200, by + 140], [bx + 140, by + 60]].map(([cx, cy], j) => `<ellipse cx="${cx + 10 * Math.sin(t * 2 + j)}" cy="${cy}" rx="26" ry="14" fill="none" stroke="${C.ink}" stroke-width="3"/>`).join('') +
        T(x + 230, y + 410, 'mangiano la sostanza organica', { f: 'serif', size: 32, fill: C.ink, a: 'middle', it: true }));
    }
    g += E(t, 0.1 + i * 0.15, c + inner);
  });
  s += `<g transform="translate(960,510) scale(${k}) translate(-960,-510)">${g}</g>`;
  return s + caption(t, W('batteri'), 'Lavorano i batteri', 'batteri', true);
} }) });

// 10 — restituzione: al fiume e, con una diramazione, ai campi
scene('restituzione', { make: (W) => ({ capAt: W('torna'), render(t, D) {
  const sc = 1.8, cx = 1386;
  let inner = world(t, { lit: 6, active: 6, faldaX: 1480, view: viewOf(cx, 615, sc), flow: { a: 1, f: 1, s: 1 } });
  const p = eo((t - W('torna') + 0.3) / 1.4), [x, y] = along(P.scarico, p);
  inner += drop(x, y, 13);
  const q = eo((t - W('irriga')) / 0.9);
  if (q > 0) { const [x2, y2] = along([[1530, 600], [1610, 600], [1610, 540]], q); inner += drop(x2, y2, 11); }
  return cam(cx, 615, sc, inner) + caption(t, W('torna'), 'Torna all’ambiente', '');
} }) });

// 11 — finale coi nomi delle fasi del testo
scene('finale', { tail: 3.0, make: (W) => ({ capAt: null, render(t) {
  let s = lightBg();
  s += E(t, -0.4, T(960, 300, 'Il ciclo artificiale', { f: 'pop', size: 110, fill: C.ink, a: 'middle' }), { dy: 0 });
  s += E(t, -0.3, T(960, 410, 'dell’acqua', { f: 'pop', size: 110, fill: C.ink, a: 'middle' }), { dy: 0 });
  const rows = [['captazione', 'potabilizzazione', 'distribuzione'], ['uso', 'fognatura e raccolta', 'depurazione e restituzione']];
  rows.forEach((names, r) => {
    let x = 960 - (names.reduce((a, n) => a + tw(n, 'mono', 24) + 56, 0) - 16) / 2;
    names.forEach((n, i) => { const w = tw(n, 'mono', 24) + 40; s += E(t, 0.1 + (r * 3 + i) * 0.12, `<rect x="${x}" y="${470 + r * 66}" width="${w}" height="50" rx="25" fill="none" stroke="${C.ink}" stroke-width="2"/>` + T(x + w / 2, 504 + r * 66, n, { f: 'mono', size: 24, fill: C.ink, a: 'middle' })); x += w + 16; });
  });
  s += words(t, W('ogni'), 960, 690, 'ogni goccia del rubinetto fa questo viaggio', { f: 'serif', size: 52, fill: C.ink, a: 'middle', it: true, key: 'viaggio' });
  s += E(t, W('viaggio') + 0.4, `<line x1="760" y1="760" x2="1160" y2="760" stroke="${C.ink}" stroke-width="3"/>` + T(960, 820, 'PROFTECNOLOGIA · MC AMB-2-05', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 5 }));
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
