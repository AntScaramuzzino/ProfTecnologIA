// La leva — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

const GY = 800; // linea del suolo
const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: 26, fill: o.fill || C.line, ls: 3, a: o.a || 'middle', w: 600 });
function ground(ink = C.line) {
  let s = `<line x1="80" y1="${GY}" x2="1840" y2="${GY}" stroke="${ink}" stroke-width="3"/>`;
  for (let x = 100; x < 1840; x += 48) s += `<line x1="${x}" y1="${GY + 4}" x2="${x - 18}" y2="${GY + 22}" stroke="${ink}" stroke-width="2" opacity="0.45"/>`;
  return s;
}
function tri(x, y, ink, fill) { // fulcro a cuneo: apice in (x,y), base sul suolo
  const hw = Math.max(62, (GY - y) * 0.42);
  return `<path d="M${x},${y} L${x - hw},${GY} L${x + hw},${GY} z" fill="${fill || C.bg}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
}
// Leva generica. fx,fy = fulcro (bordo inferiore della sbarra), ang in gradi (orario = estremo destro giù)
function lever(o) {
  const a = (o.ang || 0) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), th = 18;
  const P = (x, dy = 0) => [o.fx + (x - o.fx) * ca - dy * sa, o.fy + (x - o.fx) * sa + dy * ca];
  const ink = o.ink || C.line;
  let s = '';
  if (o.load) {
    const L = o.load, h = L.h || 110, w = L.w || 150;
    const pts = [[L.x - w / 2, -th], [L.x + w / 2, -th], [L.x + w / 2, -th - h], [L.x - w / 2, -th - h]].map(([x, dy]) => P(x, dy).join(',')).join(' ');
    s += `<polygon points="${pts}" fill="${L.fill || mix(o.bg || C.bg, ink, 0.12)}" stroke="${L.c || ink}" stroke-width="4" stroke-linejoin="round"/>`;
  }
  const b = [[o.x0, 0], [o.x1, 0], [o.x1, -th], [o.x0, -th]].map(([x, dy]) => P(x, dy).join(',')).join(' ');
  s += `<polygon points="${b}" fill="${o.bg || C.bg}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  return { svg: s, P };
}
// freccia di forza grossa
function force(x1, y1, x2, y2, c, sw = 7) {
  const an = Math.atan2(y2 - y1, x2 - x1), h = 26;
  return `<line x1="${x1}" y1="${y1}" x2="${x2 - Math.cos(an) * 14}" y2="${y2 - Math.sin(an) * 14}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<path d="M${x2},${y2} L${x2 - h * Math.cos(an - 0.42)},${y2 - h * Math.sin(an - 0.42)} L${x2 - h * Math.cos(an + 0.42)},${y2 - h * Math.sin(an + 0.42)} z" fill="${c}"/>`;
}
// quota (braccio) sotto la sbarra
function dim(xa, xb, y, s, c, light) {
  const ink = c;
  return `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke="${ink}" stroke-width="3"/>` +
    `<line x1="${xa}" y1="${y - 14}" x2="${xa}" y2="${y + 14}" stroke="${ink}" stroke-width="3"/><line x1="${xb}" y1="${y - 14}" x2="${xb}" y2="${y + 14}" stroke="${ink}" stroke-width="3"/>` +
    T((xa + xb) / 2, y + 44, s, { f: 'mono', size: 26, fill: ink, a: 'middle', ls: 2, w: 600 });
}
function pillTag(x, y, s, ink, bg) {
  const w = tw(s, 'mono', 28) + 44;
  return `<rect x="${x}" y="${y - 35}" width="${w}" height="50" rx="25" fill="${bg}" stroke="${ink}" stroke-width="2"/>` + T(x + w / 2, y, s, { f: 'mono', size: 28, fill: ink, a: 'middle' });
}
function seq(t, t0, s, ink = C.line) { // sequenza degli elementi da sinistra a destra
  return E(t, t0, T(960, 175, s, { f: 'mono', size: 30, fill: ink, a: 'middle', ls: 4, w: 700 }));
}

// 1 — aggancio: il masso
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('sbarra'),
  render(t) {
    const lift = eio((t - W('leva') + 0.2) / 1.0) * 9;
    let s = ground();
    const fx = 760, fy = GY - 92;
    const lv = lever({ fx, fy, x0: 300, x1: 1500, ang: -2 + 0 * lift, load: null });
    // masso: sopra l'estremo sinistro della sbarra
    const ang = lerp(-6.5, -6.5 + 0, 0) ;
    const a = (lerp(9.5, 9.5 - lift * 1.6, 1)) ; // non usato
    const A = -9 + lift * 0 ; // inclinazione iniziale: masso a terra a sinistra
    const angNow = -7 + eio((t - W('leva') + 0.2) / 1.0) * 13;
    const L2 = lever({ fx, fy, x0: 330, x1: 1520, ang: angNow, load: { x: 430, w: 190, h: 150 } });
    s += E(t, -0.4, L2.svg.replace(/<polygon[^>]*\/>/, ''), { dy: 0 }); // sbarra
    // masso sempre visibile, segue la sbarra quando c'è
    const rock = (() => { const [cx, cy] = L2.P(430, -18 - 75); const r = 95;
      return `<path d="M${cx - r},${cy + 70} Q${cx - r - 10},${cy - 30} ${cx - 30},${cy - r + 10} Q${cx + 40},${cy - r - 10} ${cx + r - 5},${cy - 20} Q${cx + r + 10},${cy + 50} ${cx + 60},${cy + 75} z" fill="${mix(C.bg, C.line, 0.14)}" stroke="${C.line}" stroke-width="4"/>`; })();
    s += E(t, -0.4, rock, { dy: 0 });
    s += pop(t, W("d'appoggio"), fx, fy + 40, tri(fx, fy, C.coral));
    const pushX = L2.P(1460)[0], pushY = L2.P(1460, -18)[1];
    s += E(t, W('leva') - 0.3, force(pushX, pushY - 200, pushX, pushY - 6, C.line));
    s += words(t, 0.2, 960, 240, 'Troppo pesante?', { f: 'pop', size: 96, a: 'middle', fill: C.line });
    return s + caption(t, W('sbarra'), 'Una sbarra, un appoggio', 'appoggio');
  } }) });

// leva di primo genere standard (riusata)
function stdLever(t, o) {
  const fx = o.fx ?? 820, fy = GY - 270, lx = o.lx ?? 460, ex = o.ex ?? 1560, fr = o.fr ?? 160;
  const lv = lever({ fx, fy, x0: 360, x1: 1620, ang: o.ang || 0, load: { x: lx, w: 170, h: 120, c: o.loadC } });
  let s = lv.svg + tri(fx, fy, o.fulC || C.line);
  const [lX, lY] = lv.P(lx, 0);
  if (o.frOn !== false) s += force(lX, lY + 10, lX, lY + 10 + fr * (o.frP ?? 1), o.frC || C.line);
  const fm = fr * Math.abs(lx - fx) / Math.abs(ex - fx);
  const [eX, eY] = lv.P(ex, -18);
  if ((o.fmP ?? 1) > 0) s += force(eX, eY - 6 - fm, eX, eY - 6, o.fmC || C.line, 7);
  return { s, lv, fx, fy, lx, ex, fm, eX, eY, lX, lY };
}

// 2 — i tre elementi
scene('parti', { make: (W) => ({
  capAt: W('elementi'),
  render(t) {
    const g = stdLever(t, { fmC: C.coral });
    let s = ground();
    s += E(t, -0.4, g.lv.svg, { dy: 0 });
    s += pop(t, W('fulcro') - 0.1, g.fx, g.fy + 40, tri(g.fx, g.fy, C.line));
    s += E(t, W('fulcro'), lbl(g.fx, GY + 60, 'FULCRO'));
    s += E(t, W('motrice') - 0.2, force(g.eX, g.eY - 6 - g.fm, g.eX, g.eY - 6, C.coral) + lbl(g.eX - 40, g.eY - g.fm + 10, 'FORZA MOTRICE', { a: 'end', fill: C.coral }));
    s += E(t, W('resistente') - 0.2, force(g.lX, g.lY + 10, g.lX, g.lY + 170, C.line) + lbl(g.lX - 40, g.lY + 120, 'FORZA RESISTENTE', { a: 'end' }));
    s += E(t, W('carico'), lbl(g.lX, g.lY - 160, 'CARICO'));
    return s + caption(t, W('elementi'), 'Fulcro, motrice, resistente', 'motrice');
  } }) });

// 3 — la regola: allontana la forza
scene('regola', { make: (W) => ({
  capAt: W('lontana'),
  render(t) {
    const p = eio((t - W('lontana')) / 1.6);
    const ex = lerp(1080, 1560, p);
    const g = stdLever(t, { ex });
    let s = ground() + g.s + lbl(g.eX + 30, g.eY - g.fm + 10, 'FORZA', { a: 'start' });
    s += E(t, W('lontana') - 0.2, dim(g.fx, ex, GY + 70, 'braccio della forza', C.coral));
    s += E(t, 0.1, dim(g.lx, g.fx, GY + 70, 'braccio del carico', C.line));
    s += E(t, W('meno'), T(1500, 260, 'freccia più corta = meno forza', { f: 'serif', size: 46, it: true, fill: C.line, a: 'end' }));
    return s + caption(t, W('lontana'), 'Lontano dal fulcro', 'Lontano');
  } }) });

// 4 — la formula
scene('formula', { make: (W) => ({
  capAt: W('meccanico') + 0.2,
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(260, 170, 1400, 640, { rot: -1 }), { dy: 0 });
    g += E(t, W('vantaggio'), T(400, 420, 'VM =', { f: 'pop', size: 120, fill: C.ink }));
    g += E(t, W('braccio'), T(1090, 370, 'braccio forza motrice', { f: 'popm', size: 56, fill: C.ink, a: 'middle' }));
    const ln = eo((t - W('diviso')) / 0.5);
    if (ln > 0) g += `<line x1="760" y1="400" x2="${760 + 660 * ln}" y2="400" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
    g += E(t, W('braccio', 1), T(1090, 480, 'braccio forza resistente', { f: 'popm', size: 56, fill: C.ink, a: 'middle' }));
    // mini leva a filo
    const mx = 860, my = 610;
    g += E(t, W('distanze') - 0.2, `<line x1="560" y1="${my}" x2="1460" y2="${my}" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M${mx},${my + 6} L${mx - 34},${my + 62} L${mx + 34},${my + 62} z" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>` +
      `<line x1="560" y1="${my + 92}" x2="${mx}" y2="${my + 92}" stroke="${C.ink}" stroke-width="3"/><line x1="${mx}" y1="${my + 92}" x2="1460" y2="${my + 92}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="2 0"/>` +
      `<line x1="560" y1="${my + 78}" x2="560" y2="${my + 106}" stroke="${C.ink}" stroke-width="3"/><line x1="${mx}" y1="${my + 78}" x2="${mx}" y2="${my + 106}" stroke="${C.ink}" stroke-width="3"/><line x1="1460" y1="${my + 78}" x2="1460" y2="${my + 106}" stroke="${C.ink}" stroke-width="3"/>` +
      T(710, my + 136, 'resistente', { f: 'mono', size: 30, fill: C.ink, a: 'middle' }) + T(1160, my + 136, 'motrice', { f: 'mono', size: 30, fill: C.ink, a: 'middle' }));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('meccanico') + 0.2, 'Vantaggio meccanico', 'meccanico', true);
  } }) });

// 5 — VM = 5: forza e spostamento
scene('cinque', { make: (W) => ({
  capAt: W('ma'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, u = 150, x0 = 640;
    let g = E(t, -0.4, card(200, 150, 1520, 680, { rot: 1 }), { dy: 0 });
    g += E(t, W('cinque'), T(1640, 300, 'VM = 5', { f: 'pop', size: 80, fill: C.ink, a: 'end' }));
    g += E(t, -0.2, T(270, 220, 'VM = braccio motrice / braccio resistente', { f: 'mono', size: 28, fill: C.ink }));
    g += E(t, W('forza') - 0.2, T(270, 290, 'FORZA', { f: 'mono', size: 30, fill: C.ink, ls: 4, w: 700 }));
    g += E(t, W('forza'), T(x0 - 30, 372, 'carico', { f: 'popm', size: 36, fill: C.ink, a: 'end' }) + `<rect x="${x0}" y="335" width="${5 * u * eo((t - W('forza')) / 0.8)}" height="50" rx="8" fill="${C.ink}"/>`);
    g += E(t, W('cinque', 1), T(x0 - 30, 452, 'tu', { f: 'popm', size: 36, fill: C.ink, a: 'end' }) + `<rect x="${x0}" y="415" width="${u * eo((t - W('cinque', 1)) / 0.6)}" height="50" rx="8" fill="${C.ink}" opacity="0.55"/>` +
      T(x0 + u + 24, 452, '5 volte più piccola', { f: 'serif', size: 40, it: true, fill: C.ink }));
    g += E(t, W('sposti') - 0.2, T(270, 560, 'SPOSTAMENTO', { f: 'mono', size: 30, fill: C.ink, ls: 4, w: 700 }));
    g += E(t, W('sposti'), T(x0 - 30, 642, 'carico', { f: 'popm', size: 36, fill: C.ink, a: 'end' }) + `<rect x="${x0}" y="605" width="${u * eo((t - W('sposti')) / 0.6)}" height="50" rx="8" fill="${C.ink}"/>`);
    g += E(t, W('distanza'), T(x0 - 30, 722, 'tu', { f: 'popm', size: 36, fill: C.ink, a: 'end' }) + `<rect x="${x0}" y="685" width="${5 * u * eo((t - W('distanza')) / 0.9)}" height="50" rx="8" fill="${C.ink}" opacity="0.55"/>`);
    g += E(t, W('distanza'), T(x0 + 5 * u, 790, '5 volte più grande', { f: 'serif', size: 40, it: true, fill: C.ink, a: 'end' }));
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('ma'), 'Distanza cinque volte maggiore', 'maggiore', true);
  } }) });

// 6 — primo genere
scene('primo', { make: (W) => ({
  capAt: W('fulcro'),
  render(t) {
    const g = stdLever(t, { fulC: C.coral, ang: 3 * Math.sin(t * 1.2) - 2 });
    let s = ground() + g.s;
    s += E(t, W('fulcro'), lbl(g.fx, GY + 60, 'FULCRO', { fill: C.coral }));
    s += E(t, 0.2, lbl(g.lX, g.lY - 160, 'CARICO') + lbl(g.eX - 40, g.eY - g.fm + 10, 'FORZA', { a: 'end' }));
    ['altalena', 'forbici', 'piede di porco'].forEach((p, i) => {
      const at = [W("l'altalena"), W('forbici'), W('piede')][i];
      s += E(t, at, pillTag(700 + [0, 250, 470][i], 270, p, C.line, C.bg));
    });
    s += seq(t, W('fulcro'), 'CARICO – FULCRO – FORZA');
    return s + caption(t, W('fulcro'), 'Fulcro in mezzo', 'Fulcro');
  } }) });

// 7 — bilancia a bracci uguali
scene('bilancia', { make: (W) => ({
  capAt: W('vantaggio'),
  render(t) {
    const fx = 960, fy = GY - 300;
    let s = ground();
    s += `<line x1="${fx}" y1="${fy + 20}" x2="${fx}" y2="${GY}" stroke="${C.line}" stroke-width="6"/><path d="M${fx - 120},${GY} L${fx + 120},${GY} L${fx + 80},${GY - 30} L${fx - 80},${GY - 30} z" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
    const ang = 0;
    const lv = lever({ fx, fy, x0: 560, x1: 1360, ang });
    s += lv.svg + `<path d="M${fx},${fy + 6} L${fx - 30},${fy + 50} L${fx + 30},${fy + 50} z" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
    [600, 1320].forEach(x => {
      const [px, py] = lv.P(x, 0);
      s += `<line x1="${px}" y1="${py}" x2="${px - 60}" y2="${py + 120}" stroke="${C.line}" stroke-width="2"/><line x1="${px}" y1="${py}" x2="${px + 60}" y2="${py + 120}" stroke="${C.line}" stroke-width="2"/>` +
        `<path d="M${px - 90},${py + 120} Q${px},${py + 170} ${px + 90},${py + 120} z" fill="${mix(C.bg, C.line, 0.12)}" stroke="${C.line}" stroke-width="3"/>` +
        `<rect x="${px - 34}" y="${py + 62}" width="68" height="58" rx="6" fill="${mix(C.bg, C.line, 0.2)}" stroke="${C.line}" stroke-width="3"/>`;
    });
    s += E(t, W('centro'), dim(600, fx, fy - 110, '', C.coral) + dim(fx, 1320, fy - 110, '', C.coral));
    s += E(t, W('uno') - 0.1, T(960, 335, 'VM = 1', { f: 'pop', size: 100, fill: C.line, a: 'middle' }));
    s += seq(t, 0.2, 'CARICO – FULCRO – CARICO');
    return s + caption(t, W('vantaggio'), 'Bracci uguali', 'uguali');
  } }) });

// 8 — secondo genere: la carriola
scene('secondo', { make: (W) => ({
  capAt: W('carico'),
  render(t) {
    const R = 80, wx = 420, wy = GY - R;
    const up = eio((t - W('carriola')) / 1.2);
    const ang = -lerp(0, 9, up);
    // sbarra (stanghe) imperniata sull'asse della ruota
    const lv = lever({ fx: wx, fy: wy + 9, x0: wx - 20, x1: 1560, ang, load: { x: 860, w: 360, h: 150, c: C.coral, fill: mix(C.bg, C.coral, 0.18) } });
    let s = ground() + lv.svg;
    s += `<circle cx="${wx}" cy="${wy}" r="${R}" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/><circle cx="${wx}" cy="${wy}" r="12" fill="${C.line}"/>`;
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + up * 0.4; s += `<line x1="${wx}" y1="${wy}" x2="${wx + Math.cos(a) * (R - 6)}" y2="${wy + Math.sin(a) * (R - 6)}" stroke="${C.line}" stroke-width="2"/>`; }
    const [hx, hy] = lv.P(1500, 0), fr = 110, fm = fr * (860 - wx) / (1500 - wx);
    const [lX, lY] = lv.P(860, 0);
    s += E(t, W('carico') - 0.2, lbl(lX, lY - 190, 'CARICO', { fill: C.coral }));
    s += E(t, W('carriola') + 1.0, force(lX, lY + 10, lX, lY + 10 + fr, C.line));
    s += E(t, 0.3, force(hx, hy + 6 + fm, hx, hy + 6, C.line, 7) + lbl(hx + 40, hy + fm + 10, 'FORZA', { a: 'start' }));
    s += E(t, W('ruota') - 0.2, lbl(wx, GY + 60, 'RUOTA = FULCRO'));
    s += E(t, W('vantaggio'), T(1480, 330, 'VM > 1', { f: 'pop', size: 110, fill: C.line, a: 'end' }));
    s += seq(t, W('carico'), 'FULCRO – CARICO – FORZA');
    return s + caption(t, W('carico'), 'Carico in mezzo', 'Carico');
  } }) });

// 9 — terzo genere: il braccio
scene('terzo', { make: (W) => ({
  capAt: W('forza'),
  render(t) {
    const ex = 520, ey = 640, bx = 680, hx = 1420; // gomito, attacco bicipite, mano
    const ang = -3 * eio((t - W('tira')) / 0.8);
    const lv = lever({ fx: ex, fy: ey + 9, x0: ex - 10, x1: hx + 40, ang });
    let s = '';
    // braccio superiore (omero) e spalla
    s += `<line x1="${ex}" y1="${ey}" x2="${ex - 120}" y2="${ey - 380}" stroke="${C.line}" stroke-width="18" stroke-linecap="round" opacity="0.35"/>`;
    s += lv.svg + `<circle cx="${ex}" cy="${ey}" r="34" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/><circle cx="${ex}" cy="${ey}" r="8" fill="${C.line}"/>`;
    const [px, py] = lv.P(hx, -18);
    s += `<circle cx="${px}" cy="${py - 56}" r="56" fill="${mix(C.bg, C.line, 0.15)}" stroke="${C.line}" stroke-width="4"/>`;
    const fr = 70, fm = fr * (hx - ex) / (bx - ex);
    const [bX, bY] = lv.P(bx, -18), [lX, lY] = lv.P(hx, 0);
    s += E(t, W('forza') - 0.2, force(bX, bY, bX, bY - fm, C.coral) + lbl(bX + 40, bY - fm / 2, 'BICIPITE', { a: 'start', fill: C.coral }));
    s += E(t, 0.3, force(lX, lY + 10, lX, lY + 10 + fr, C.line) + lbl(lX, lY + fr + 70, 'PESO IN MANO'));
    s += E(t, -0.4, lbl(ex - 50, ey + 90, 'GOMITO = FULCRO', { a: 'start' }), { dy: 0 });
    // schizzo delle pinzette: perno a sinistra, dito al centro, oggetto in punta
    if (t > W('pinzette') - 0.3 && t < W('braccio') + 0.4) {
      const qx = 1180, qy = 330;
      s += E(t, W('pinzette') - 0.3, `<rect x="${qx - 30}" y="${qy - 110}" width="640" height="230" rx="18" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` +
        `<circle cx="${qx + 30}" cy="${qy}" r="12" fill="${C.line}"/>` +
        `<line x1="${qx + 30}" y1="${qy}" x2="${qx + 470}" y2="${qy - 26}" stroke="${C.line}" stroke-width="7" stroke-linecap="round"/>` +
        `<line x1="${qx + 30}" y1="${qy}" x2="${qx + 470}" y2="${qy + 26}" stroke="${C.line}" stroke-width="7" stroke-linecap="round"/>` +
        `<circle cx="${qx + 500}" cy="${qy}" r="16" fill="${mix(C.bg, C.line, 0.3)}" stroke="${C.line}" stroke-width="3"/>` +
        force(qx + 250, qy - 90, qx + 250, qy - 20, C.line, 5) + force(qx + 250, qy + 90, qx + 250, qy + 20, C.line, 5) +
        T(qx + 30, qy + 100, 'perno', { f: 'mono', size: 26, fill: C.line, a: 'middle' }) + T(qx + 330, qy - 60, 'dita', { f: 'mono', size: 26, fill: C.line }) +
        T(qx + 500, qy + 70, 'oggetto', { f: 'mono', size: 26, fill: C.line, a: 'middle' }), { dy: 0 });
    }
    s += E(t, W('braccio') + 0.4, pillTag(1500, 260, 'braccio umano', C.line, C.bg));
    s += seq(t, W('forza'), 'FULCRO – FORZA – CARICO');
    return s + caption(t, W('forza'), 'Forza in mezzo', 'Forza');
  } }) });

// 10 — meno forza, più velocità
scene('velocita', { make: (W) => ({
  capAt: W('ma'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(220, 170, 1480, 640, { rot: -1 }), { dy: 0 });
    g += E(t, W('minore') - 0.2, T(300, 300, 'VM < 1', { f: 'pop', size: 96, fill: C.ink }));
    const ex = 420, ey = 640, bx = 560, hx = 1300;
    const sw = eio((t - W('movimento')) / 1.3), a = -24 * sw * Math.PI / 180;
    const Pp = x => [ex + (x - ex) * Math.cos(a), ey + (x - ex) * Math.sin(a)];
    // archi percorsi
    const arc = (r, c, w) => { const x1 = ex + r, y1 = ey, x2 = ex + r * Math.cos(a), y2 = ey + r * Math.sin(a);
      return sw > 0.01 ? `<path d="M${x1},${y1} A${r},${r} 0 0 0 ${x2},${y2}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="2 12"/>` : ''; };
    g += `<line x1="${ex}" y1="${ey}" x2="${ex + (hx - ex)}" y2="${ey}" stroke="${C.ink}" stroke-width="3" opacity="0.25"/>`;
    g += arc(bx - ex, C.ink, 6) + arc(hx - ex, C.coral, 6);
    const [b1, b2] = Pp(bx), [h1, h2] = Pp(hx);
    g += `<line x1="${ex}" y1="${ey}" x2="${h1}" y2="${h2}" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/>`;
    g += `<circle cx="${ex}" cy="${ey}" r="26" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/><circle cx="${b1}" cy="${b2}" r="14" fill="${C.ink}"/><circle cx="${h1}" cy="${h2}" r="34" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/>`;
    g += E(t, W('muscolo') - 0.1, T(ex + 150, ey + 90, 'muscolo: poco', { f: 'serif', size: 42, it: true, fill: C.ink, a: 'middle' }));
    g += E(t, W('sposta') - 0.1, T(h1 + 40, h2 - 50, 'mano: molto', { f: 'serif', size: 42, it: true, fill: C.coral }));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('ma'), 'Perdi forza, guadagni velocità', 'velocità', true);
  } }) });

// 11 — chiusura
scene('finale', { L: 0.5, tail: 2.8, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 430, 'La leva', { f: 'pop', size: 170, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('fulcro') - 0.1, 960, 560, 'fulcro, forza e carico', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true });
    s += words(t, W('dove') - 0.1, 960, 640, 'dove li metti decide tutto', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: 'decide' });
    s += E(t, W('tutto') + 0.3, `<line x1="760" y1="710" x2="1160" y2="710" stroke="${C.ink}" stroke-width="3"/>` + T(960, 770, 'PROFTECNOLOGIA · MC ENE-3-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5 }));
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
