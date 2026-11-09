// Il modello RIASEC per l'orientamento vocazionale — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.35);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.minD) D = Math.max(D, def.minD);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const cam = (t, D, inner, cx = 960, cy = 480) => `<g transform="translate(${cx},${cy}) scale(${1 + 0.02 * t / D}) translate(${-cx},${-cy})">${inner}</g>`;

// ---- mondo: tavole tecniche a filo (line-art) per i sei interessi ----
const st = (ink, sw = 6, fill = 'none') => `fill="${fill}" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"`;
// ogni icona è disegnata in un riquadro ±200 centrato in 0,0; t = tempo per piccole animazioni
const ICON = {
  // R: ingranaggio che gira + chiave inglese
  r(t, ink, bg, sw) {
    const cx = -40, cy = -30, R = 118, r0 = 96, n = 10, a0 = t * 18 * Math.PI / 180; let d = '';
    for (let i = 0; i < n; i++) {
      const a = a0 + i * 2 * Math.PI / n, h = Math.PI / n * 0.45;
      const P = (rr, aa) => `${(cx + rr * Math.cos(aa)).toFixed(1)},${(cy + rr * Math.sin(aa)).toFixed(1)}`;
      d += (i ? 'L' : 'M') + P(r0, a - Math.PI / n + h * 0.3) + 'L' + P(R, a - h) + 'L' + P(R, a + h) + 'L' + P(r0, a + Math.PI / n - h * 0.3);
    }
    let s = `<path d="${d}z" ${st(ink, sw, bg)}/><circle cx="${cx}" cy="${cy}" r="38" ${st(ink, sw)}/><circle cx="${cx}" cy="${cy}" r="66" ${st(ink, sw * 0.5)} stroke-dasharray="6 9"/>`;
    // chiave inglese inclinata
    s += `<g transform="translate(95,95) rotate(-45)"><rect x="-22" y="-10" width="44" height="190" rx="20" ${st(ink, sw, bg)}/>` +
      `<path d="M-46,-40 A54,54 0 1 1 46,-40 L22,-62 L22,-100 L-22,-100 L-22,-62 Z" ${st(ink, sw, bg)}/><line x1="0" y1="120" x2="0" y2="160" ${st(ink, sw * 0.6)}/></g>`;
    return s;
  },
  // I: grafico + lente che scorre
  i(t, ink, bg, sw) {
    let s = `<polyline points="-170,-150 -170,140 170,140" ${st(ink, sw)}/>`;
    [[-130, 60], [-80, 10], [-30, 40], [20, -40], [70, -10], [120, -90]].forEach(([x, y]) => s += `<circle cx="${x}" cy="${y}" r="9" ${st(ink, sw * 0.6, ink)}/>`);
    s += `<line x1="-150" y1="80" x2="150" y2="-100" ${st(ink, sw * 0.5)} stroke-dasharray="8 10"/>`;
    const mx = -40 + 90 * Math.sin(t * 0.9), my = -10 + 30 * Math.sin(t * 0.6 + 1);
    s += `<circle cx="${mx}" cy="${my}" r="72" ${st(ink, sw, 'none')}/><circle cx="${mx}" cy="${my}" r="58" ${st(ink, sw * 0.4)} opacity="0.6"/>` +
      `<line x1="${mx + 52}" y1="${my + 52}" x2="${mx + 130}" y2="${my + 130}" ${st(ink, sw * 2.4)}/>`;
    return s;
  },
  // A: foglio con una pennellata che si disegna + pennello
  a(t, ink, bg, sw) {
    let s = `<rect x="-180" y="-150" width="330" height="270" rx="10" ${st(ink, sw, bg)}/><line x1="-120" y1="120" x2="-150" y2="190" ${st(ink, sw)}/><line x1="90" y1="120" x2="120" y2="190" ${st(ink, sw)}/>`;
    const p = ((t * 0.32) % 1.25), pts = [];
    for (let k = 0; k <= 40; k++) { const u = k / 40; if (u > p) break; pts.push([-140 + 250 * u, -10 + 55 * Math.sin(u * Math.PI * 2.2)]); }
    if (pts.length > 1) s += `<polyline points="${pts.map(q => q.map(v => v.toFixed(1)).join(',')).join(' ')}" ${st(ink, sw * 2.6)}/>`;
    const e = pts.length ? pts[pts.length - 1] : [-140, -10];
    s += `<g transform="translate(${e[0]},${e[1]}) rotate(-35)"><path d="M0,0 C-10,-18 -12,-34 -8,-48 L8,-48 C12,-34 10,-18 0,0 Z" ${st(ink, sw * 0.6, ink)}/>` +
      `<rect x="-11" y="-74" width="22" height="26" rx="3" ${st(ink, sw * 0.7, bg)}/><rect x="-7" y="-190" width="14" height="116" rx="7" ${st(ink, sw * 0.7, bg)}/></g>`;
    return s;
  },
  // S: due persone che si parlano
  s(t, ink, bg, sw) {
    const fig = (x) => `<circle cx="${x}" cy="10" r="42" ${st(ink, sw, bg)}/><path d="M${x - 80},160 C${x - 80},90 ${x - 46},64 ${x},64 C${x + 46},64 ${x + 80},90 ${x + 80},160" ${st(ink, sw, bg)}/>`;
    let s = fig(-95) + fig(95);
    const ph = (t * 0.7) % 2;
    const bub = (x, y, k, flip) => `<g transform="translate(${x},${y}) scale(${k})"><rect x="-62" y="-40" width="124" height="74" rx="22" ${st(ink, sw, bg)}/>` +
      `<path d="M${flip ? 18 : -18},34 L${flip ? 34 : -34},62 L${flip ? -4 : 4},34" ${st(ink, sw, bg)}/>` +
      [-26, 0, 26].map(dx => `<circle cx="${dx}" cy="-3" r="6" fill="${ink}"/>`).join('') + `</g>`;
    s += bub(-130, -110, ph < 1 ? 1 : 0.86, false) + bub(130, -150, ph >= 1 ? 1 : 0.86, true);
    return s;
  },
  // E: megafono con onde
  e(t, ink, bg, sw) {
    let s = `<path d="M-150,-40 L-60,-40 L80,-130 L80,110 L-60,20 L-150,20 Z" ${st(ink, sw, bg)}/><line x1="-60" y1="-40" x2="-60" y2="20" ${st(ink, sw * 0.6)}/>` +
      `<path d="M-110,20 L-90,110 L-55,110 L-68,20" ${st(ink, sw, bg)}/><rect x="-175" y="-52" width="30" height="84" rx="10" ${st(ink, sw, bg)}/>`;
    for (let k = 0; k < 3; k++) {
      const q = ((t * 0.8 - k * 0.33) % 1 + 1) % 1, r = 60 + k * 45;
      s += `<path d="M${110 + k * 10},${-10 - r * 0.9} A${r},${r} 0 0 1 ${110 + k * 10},${-10 + r * 0.9}" ${st(ink, sw)} opacity="${(0.35 + 0.65 * (1 - q)).toFixed(2)}"/>`;
    }
    return s;
  },
  // C: schedario in sezione con un cassetto che si apre
  c(t, ink, bg, sw) {
    let s = `<rect x="-130" y="-180" width="220" height="350" rx="10" ${st(ink, sw, bg)}/><line x1="-130" y1="170" x2="90" y2="170" ${st(ink, sw)}/>`;
    const op = 70 * eio((Math.sin(t * 0.9) + 1) / 2);
    [-170, -55, 60].forEach((y, k) => {
      const dx = k === 1 ? op : 0;
      if (k === 1) {
        s += `<rect x="${-120 + dx}" y="${y}" width="200" height="100" ${st(ink, sw, bg)}/>`;
        [0, 1, 2, 3].forEach(j => s += `<path d="M${-60 + dx + j * 34},${y} L${-60 + dx + j * 34},${y - 22} L${-38 + dx + j * 34},${y - 22}" ${st(ink, sw * 0.6)}/>`);
      } else s += `<rect x="-120" y="${y}" width="200" height="100" ${st(ink, sw, bg)}/>`;
      s += `<rect x="${-50 + dx}" y="${y + 40}" width="60" height="18" rx="6" ${st(ink, sw * 0.7)}/>`;
    });
    // lista con spunte
    [0, 1, 2].forEach(j => s += `<path d="M120,${-120 + j * 70} l14,14 l24,-28" ${st(ink, sw * 0.8)}/><line x1="170" y1="${-120 + j * 70}" x2="200" y2="${-120 + j * 70}" ${st(ink, sw * 0.8)}/>`);
    return s;
  },
};
const icon = (k, t, x, y, sc, ink, bg, sw = 6) => `<g transform="translate(${x},${y}) scale(${sc})">${ICON[k](t, ink, bg, sw)}</g>`;

// esagono RIASEC: R in alto a sinistra, poi in senso orario I, A, S, E, C
const KEYS = ['r', 'i', 'a', 's', 'e', 'c'];
const NAMES = ['REALISTICO', 'INVESTIGATIVO', 'ARTISTICO', 'SOCIALE', 'INTRAPRENDENTE', 'CONVENZIONALE'];
const ANG = [-120, -60, 0, 60, 120, 180];
const hv = (cx, cy, R, i) => [cx + R * Math.cos(ANG[i] * Math.PI / 180), cy + R * Math.sin(ANG[i] * Math.PI / 180)];
function hexPath(cx, cy, R) { return [0, 1, 2, 3, 4, 5, 0].map(i => hv(cx, cy, R, i)); }
// mini esagono (vertice attivo in corallo)
function miniHex(cx, cy, act, ink, bg) {
  let s = poly(hexPath(cx, cy, 92), ink, 3);
  for (let i = 0; i < 6; i++) {
    const [x, y] = hv(cx, cy, 92, i), on = i === act;
    s += `<circle cx="${x}" cy="${y}" r="26" fill="${on ? C.coral : bg}" stroke="${on ? C.coral : ink}" stroke-width="3"/>` +
      T(x, y + 9, LET[i], { f: 'mono', size: 26, fill: on ? C.bg : ink, a: 'middle', w: 700 });
  }
  return s;
}

// 1 — aggancio
scene('hook', { L: 0.4, make: (W) => ({
  capAt: W('cosa'),
  render(t) {
    let s = E(t, -0.3, T(960, 520, 'Che lavoro farai?', { f: 'pop', size: 104, a: 'middle' }));
    const cx = 960, cy = 480;
    for (let i = 0; i < 6; i++) {
      const a = (-90 + i * 60) * Math.PI / 180, x = cx + 700 * Math.cos(a), y = cy + 290 * Math.sin(a);
      s += E(t, W('partire') - 0.1 + i * 0.12, `<circle cx="${x}" cy="${y}" r="92" fill="${C.fillD}" stroke="${C.lineDim}" stroke-width="2.5"/>` +
        icon(KEYS[(i + 0) % 6], t, x, y, 0.36, C.line, C.fillD, 3.5));
    }
    s += E(t, W('cosa') - 0.15, T(960, 640, 'che cosa ti interessa?', { f: 'serif', size: 72, a: 'middle', it: true }) +
      `<line x1="${960 - tw('che cosa ti interessa?', 'serif', 72, true) / 2}" y1="668" x2="${960 + tw('che cosa ti interessa?', 'serif', 72, true) / 2}" y2="668" stroke="${C.coral}" stroke-width="6" stroke-linecap="round"/>`);
    return s + caption(t, W('cosa'), 'Che cosa ti interessa?', '');
  } }) });

// 2 — il modello
scene('riasec', { make: (W) => ({
  capAt: W('riasec'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(200, 140, 1520, 690, { rot: -0.6 }), { dy: 0 });
    g += E(t, -0.3, T(960, 240, 'ORIENTAMENTO AL LAVORO', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 4, w: 700 }));
    const lw = 150, x0 = 960 - lw * 2.5;
    LET.forEach((l, i) => g += E(t, W('riasec') - 0.1 + i * 0.07, T(x0 + i * lw, 450, l, { f: 'pop', size: 190, fill: C.ink, a: 'middle' }), { dy: 30 }));
    g += E(t, W('riasec') + 0.4, `<line x1="${x0 - 60}" y1="492" x2="${x0 + 5 * lw + 60}" y2="492" stroke="${C.coral}" stroke-width="10" stroke-linecap="round"/>`, { dy: 0 });
    g += E(t, W('cinquanta') - 0.1, T(960, 600, 'sviluppato tra gli anni ’50 e ’70', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true }));
    g += E(t, W('sistemi') - 0.1, T(960, 720, 'uno dei sistemi di orientamento più usati al mondo', { f: 'popm', size: 40, fill: C.ink, a: 'middle' }));
    s += cam(t, D, g);
    return s + caption(t, W('riasec'), 'Il modello RIASEC', '', true);
  } }) });

// 3 — sei tipi di interessi
scene('sei', { tail: 0.6, make: (W) => ({
  capAt: W('sei'),
  render(t) {
    const cx = 960, cy = 470, R = 250;
    const pts = hexPath(cx, cy, R), dp = eio((t + 0.2) / 1.1);
    let s = '';
    if (dp > 0) { const n = dp * 6, k = Math.floor(n), part = pts.slice(0, k + 1); if (k < 6) part.push([lerp(pts[k][0], pts[k + 1][0], n - k), lerp(pts[k][1], pts[k + 1][1], n - k)]); s += poly(part, C.coral, 5); }
    s += E(t, -0.2, `<circle cx="${cx}" cy="${cy}" r="6" fill="${C.line}"/>`, { dy: 0 });
    for (let i = 0; i < 6; i++) {
      const [x, y] = hv(cx, cy, R, i);
      s += pop(t, W('sei') - 0.05 + i * 0.1, x, y, `<circle cx="${x}" cy="${y}" r="56" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>` + T(x, y + 21, LET[i], { f: 'pop', size: 60, a: 'middle' }));
      const a = ANG[i] * Math.PI / 180;
      let lx, ly, an;
      if (i === 2) { lx = x + 84; ly = y + 10; an = 'start'; } else if (i === 5) { lx = x - 84; ly = y + 10; an = 'end'; }
      else { lx = x; ly = y + (Math.sin(a) < 0 ? -82 : 104); an = 'middle'; }
      s += E(t, W('interessi') - 0.1 + i * 0.1, lbl(lx, ly, NAMES[i], { size: 28, a: an }));
    }
    return s + caption(t, W('sei'), 'Sei tipi di interessi', '');
  } }) });

// 4–9 — i sei tipi (stessa impaginazione, registro alterno)
const TYPES = {
  r: { cap: 'attività', name: 'Realistico', eng: 'REALISTIC', line: ['attività pratiche e concrete', 'pratiche'], pills: [['OGGETTI', 'oggetti'], ['MACCHINE', 'macchine'], ['STRUMENTI', 'strumenti']], jobs: [['meccanico', 'meccanico'], ['tecnico elettronico', 'tecnico']] },
  i: { cap: 'analizzare', name: 'Investigativo', eng: 'INVESTIGATIVE', pills: [['ANALIZZARE', 'analizzare'], ['RICERCARE', 'ricercare'], ['RISOLVERE PROBLEMI', 'risolvere']], jobs: [['scienziato', 'scienziato'], ['analista di dati', "l'analista"]] },
  a: { cap: 'creatività', name: 'Artistico', eng: 'ARTISTIC', pills: [['CREATIVITÀ', 'creatività'], ['ESPRESSIONE', 'espressione'], ['ORIGINALITÀ', 'originalità']], line: ['in ambienti non strutturati', 'ambienti'], jobs: [['designer', 'designer'], ['musicista', 'musicista']] },
  s: { cap: 'lavorare', name: 'Sociale', eng: 'SOCIAL', line: ['lavorare con le persone', 'lavorare'], pills: [['INSEGNARE', 'insegnare'], ['AIUTARE', 'aiutare'], ['CURARE', 'curare']], jobs: [['insegnante', "l'insegnante"], ['psicologo', 'psicologo']] },
  e: { cap: 'guidare', name: 'Intraprendente', eng: 'ENTERPRISING', pills: [['GUIDARE', 'guidare'], ['PERSUADERE', 'persuadere'], ['ORGANIZZARE', 'organizzare'], ['VENDERE', 'vendere']], jobs: [['manager', 'manager'], ['imprenditore', "l'imprenditore"]] },
  c: { cap: 'procedure', name: 'Convenzionale', eng: 'CONVENTIONAL', pills: [['AMBIENTI STRUTTURATI', 'ambienti'], ['PROCEDURE CHIARE', 'procedure'], ['PRECISIONE', 'precisione']], jobs: [['contabile', 'contabile'], ['archivista', "l'archivista"]] },
};
KEYS.forEach((k, idx) => {
  const d = TYPES[k];
  scene(k, { tail: 0.9, make: (W) => ({
    capAt: W(d.cap),
    render(t, D) {
      const capAt = W(d.cap);
      const light = SC.find(x => x.id === k).registro === 'chiaro';
      const ink = light ? C.ink : C.line, bg = light ? C.cream : C.bg, dim = light ? mix(C.cream, C.ink, 0.35) : C.lineDim;
      let g = '';
      if (light) g += E(t, -0.4, card(110, 120, 1700, 745, { rot: idx % 4 === 1 ? 0.5 : -0.5 }), { dy: 0 });
      // tavola a sinistra
      g += E(t, -0.4, `<circle cx="500" cy="485" r="270" fill="none" stroke="${dim}" stroke-width="2.5" stroke-dasharray="4 12"/>` +
        icon(k, t, 500, 485, 1, ink, light ? C.cream : C.fillD, 6), { dy: 0 });
      g += E(t, -0.3, lbl(500, light ? 800 : 820, 'TAVOLA ' + LET[idx], { size: 24, fill: ink }), { dy: 0 });
      // colonna destra
      const X = 960;
      g += E(t, -0.3, T(X, 335, LET[idx], { f: 'pop', size: 190, fill: ink }));
      g += E(t, W(d.name.toLowerCase()) - 0.05, T(X, 450, d.name, { f: 'pop', size: 84, fill: ink }));
      g += E(t, W(d.name.toLowerCase()) + 0.3, lbl(X, 500, 'IN INGLESE: ' + d.eng, { size: 26, a: 'start', fill: ink }));
      let y = 590;
      const lineFirst = d.line && k !== 'a';
      const drawLineTxt = (yy) => E(t, W(d.line[1]) - 0.15, T(X, yy, d.line[0], { f: 'serif', size: 56, fill: ink, it: true }));
      if (lineFirst) { g += drawLineTxt(y); y += 80; }
      let px = X, row = 0;
      d.pills.forEach(([p, w]) => {
        const pw = tw(p, 'mono', 28) + 44;
        if (px + pw > 1800) { px = X; row++; }
        g += E(t, W(w) - 0.1, pillTag(px, y + row * 72, p, ink, light ? C.ivory : C.fillD, { size: 28, w: 600 }));
        px += pw + 18;
      });
      y += row * 72 + (d.line && !lineFirst ? 80 : 0);
      if (d.line && !lineFirst) g += drawLineTxt(y);
      const yj = Math.max(y + 95, 735);
      g += E(t, W('come') - 0.1, lbl(X, yj, 'PROFESSIONI AFFINI', { size: 24, a: 'start', fill: ink }));
      let jx = X;
      d.jobs.forEach(([j, w], n) => {
        const txt = (n ? '· ' : '') + j;
        g += E(t, W(w) - 0.1, T(jx, yj + 62, txt, { f: 'serif', size: 54, fill: ink, it: true }));
        jx += tw(txt, 'serif', 54, true) + 22;
      });
      // mini esagono: dove siamo
      g += E(t, -0.4, miniHex(1680, 258, idx, ink, light ? C.cream : C.bg), { dy: 0 });
      const s = (light ? lightBg() + cam(t, D, g) : g);
      return s + caption(t, capAt, SC.find(x => x.id === k).didascalia, '', light);
    } }) });
});

// 10 — il codice: una tripletta
scene('codice', { tail: 1.1, make: (W) => ({
  capAt: W('tripletta'),
  render(t) {
    const cx = 520, cy = 470, R = 230;
    let s = E(t, -0.4, poly(hexPath(cx, cy, R), C.line, 3), { dy: 0 });
    const order = [1, 3, 2], tw0 = [W('investigativo'), W('sociale'), W('artistico')];
    for (let i = 0; i < 6; i++) {
      const [x, y] = hv(cx, cy, R, i), k = order.indexOf(i), on = k >= 0 && t >= tw0[k] - 0.1;
      s += E(t, -0.4, `<circle cx="${x}" cy="${y}" r="50" fill="${on ? C.fillD2 : C.bg}" stroke="${C.line}" stroke-width="${on ? 8 : 3}"/>` + T(x, y + 19, LET[i], { f: 'pop', size: 54, a: 'middle' }), { dy: 0 });
    }
    // percorso della tripletta (unico elemento corallo)
    const P = order.map(i => hv(cx, cy, R, i));
    let path = [];
    if (t >= tw0[0] - 0.1) {
      path = [P[0]];
      for (let k = 1; k < 3; k++) { const q = eio((t - tw0[k] + 0.1) / 0.45); if (q > 0) path.push([lerp(P[k - 1][0], P[k][0], q), lerp(P[k - 1][1], P[k][1], q)]); if (q < 1) break; }
    }
    if (path.length > 1) s += poly(path, C.coral, 8);
    s += E(t, W('combinazione') - 0.1, T(1360, 230, 'una combinazione di tipi', { f: 'serif', size: 60, a: 'middle', it: true }));
    s += E(t, W('codice') - 0.1, lbl(1360, 340, 'CODICE A TRE LETTERE · ESEMPIO', { size: 26 }));
    const TX = [1100, 1360, 1620], names = ['INVESTIGATIVO', 'SOCIALE', 'ARTISTICO'], lets = ['I', 'S', 'A'];
    TX.forEach((x, k) => {
      s += E(t, W('tripletta') - 0.1 + k * 0.1, `<rect x="${x - 80}" y="390" width="160" height="170" rx="18" fill="none" stroke="${C.lineDim}" stroke-width="3" stroke-dasharray="10 10"/>`, { dy: 0 });
      s += pop(t, tw0[k] - 0.1, x, 475, `<rect x="${x - 80}" y="390" width="160" height="170" rx="18" fill="${C.fillD2}" stroke="${C.line}" stroke-width="4"/>` + T(x, 512, lets[k], { f: 'pop', size: 110, a: 'middle' }));
      s += E(t, tw0[k], lbl(x, 615, names[k], { size: 26 }));
    });
    return s + caption(t, W('tripletta'), 'Una tripletta', '');
  } }) });

// 11 — lo strumento orienta, non decide
scene('strumento', { tail: 1.0, make: (W) => ({
  capAt: W('aiuta'),
  render(t, D) {
    let s = lightBg();
    let g = E(t, -0.4, card(110, 140, 1700, 690, { rot: 0.5 }), { dy: 0 });
    g += E(t, W('non') - 0.1, T(190, 300, 'NON DECIDE', { f: 'mono', size: 32, fill: C.ink, ls: 4, w: 700 }));
    g += E(t, W('tua') - 0.1, T(190, 430, 'la tua', { f: 'pop', size: 76, fill: C.ink }));
    g += E(t, W('professione') - 0.1, T(190, 530, 'professione', { f: 'pop', size: 76, fill: C.ink }));
    const sp = eio((t - W('professione') - 0.5) / 0.4);
    if (sp > 0) g += `<line x1="180" y1="505" x2="${180 + (tw('professione', 'pop', 76) + 20) * sp}" y2="505" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>`;
    g += E(t, W('aiuta') - 0.15, `<rect x="900" y="210" width="840" height="540" rx="18" fill="${C.ivory}" stroke="${C.coral}" stroke-width="6"/>` +
      T(950, 295, 'TI AIUTA A CAPIRE', { f: 'mono', size: 32, fill: C.ink, ls: 4, w: 700 }), { dy: 0 });
    g += E(t, W('ambienti') - 0.15, `<circle cx="965" cy="395" r="9" fill="${C.ink}"/>` + T(995, 410, 'in quali ambienti ti senti', { f: 'serif', size: 56, fill: C.ink, it: true }) +
      T(995, 478, 'più a tuo agio', { f: 'serif', size: 56, fill: C.ink, it: true }));
    g += E(t, W('attività') - 0.15, `<circle cx="965" cy="590" r="9" fill="${C.ink}"/>` + T(995, 605, 'quali attività ti motivano', { f: 'serif', size: 56, fill: C.ink, it: true }));
    s += cam(t, D, g);
    return s + caption(t, W('aiuta'), 'Ti aiuta a capire', '', true);
  } }) });

// 12 — chiusura
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, miniHex(960, 250, -1, C.ink, C.ivory), { dy: 0 });
    s += E(t, -0.3, T(960, 520, 'Il modello RIASEC', { f: 'pop', size: 116, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('sei') - 0.1, 960, 630, 'sei tipi di interessi per orientarti', { f: 'serif', size: 76, fill: C.ink, a: 'middle', it: true, key: 'interessi', keyFill: C.coralD });
    s += E(t, W('sei'), `<line x1="760" y1="700" x2="1160" y2="700" stroke="${C.ink}" stroke-width="3"/>` + T(960, 760, 'PROFTECNOLOGIA · MC SIS-3-04', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
