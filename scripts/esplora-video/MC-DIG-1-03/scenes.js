// Le tre strutture fondamentali — MC-DIG-1-03 §"Le tre strutture fondamentali". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.4);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.lastAt != null) D = Math.max(D, def.lastAt + 1.95);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });

// ---- mondo: diagrammi a filo (blocchi, rombi, frecce) ----
function blk(cx, cy, w, h, st, o = {}) {
  let s = `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${o.rx ?? 4}" fill="${o.fill || DIM()}" stroke="${st}" stroke-width="${o.sw || 4}"/>`;
  const ls = o.lab ? (Array.isArray(o.lab) ? o.lab : [o.lab]) : [];
  ls.forEach((l, i) => s += lbl(cx, cy + 10 + (i - (ls.length - 1) / 2) * 36, l, { fill: o.tf || st, size: o.size || 28 }));
  return s;
}
function dia(cx, cy, w, h, st, o = {}) {
  let s = `<path d="M${cx},${cy - h / 2} L${cx + w / 2},${cy} L${cx},${cy + h / 2} L${cx - w / 2},${cy} z" fill="${o.fill || DIM()}" stroke="${st}" stroke-width="${o.sw || 4}" stroke-linejoin="round"/>`;
  if (o.lab) s += lbl(cx, cy + 10, o.lab, { fill: o.tf || st, size: o.size || 28 });
  return s;
}
function poly(pts, st, sw = 4, head = true) {
  let s = `<polyline points="${pts.slice(0, -1).map(p => p.join(',')).join(' ')} ${pts[pts.length - 1].join(',')}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (head) { const a = pts[pts.length - 2], b = pts[pts.length - 1]; s += arrow(a[0], a[1], b[0], b[1], st, sw); }
  return s;
}
function along(pts, p) { // punto sul percorso, p in [0,1]
  const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  let d = clamp(p) * tot, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
  const q = seg[i] ? d / seg[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)];
}
const tok = (x, y, c = C.coral, r = 15) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
// tre icone delle strutture
function icoSeq(cx, cy, st, k = 1) {
  let s = ''; for (let i = 0; i < 3; i++) { s += blk(cx, cy + (i - 1) * 95 * k, 150 * k, 50 * k, st, { sw: 4 }); if (i < 2) s += arrow(cx, cy + (i - 1) * 95 * k + 25 * k, cx, cy + i * 95 * k - 25 * k, st, 3); }
  return s;
}
// selezione: rombo, due rami, due blocchi, i rami si ricongiungono e il flusso prosegue
function icoCond(cx, cy, st, k = 1) {
  const q = v => v * k;
  return arrow(cx, cy - q(160), cx, cy - q(132), st, 3) + dia(cx, cy - q(85), q(150), q(90), st) +
    poly([[cx - q(75), cy - q(85)], [cx - q(95), cy - q(85)], [cx - q(95), cy + q(2)]], st, 3) +
    poly([[cx + q(75), cy - q(85)], [cx + q(95), cy - q(85)], [cx + q(95), cy + q(2)]], st, 3) +
    blk(cx - q(95), cy + q(25), q(90), q(46), st) + blk(cx + q(95), cy + q(25), q(90), q(46), st) +
    poly([[cx - q(95), cy + q(48)], [cx - q(95), cy + q(80)], [cx + q(95), cy + q(80)], [cx + q(95), cy + q(48)]], st, 3, false) +
    arrow(cx, cy + q(80), cx, cy + q(135), st, 3);
}
// iterazione: blocco -> rombo; NO torna al blocco, SÌ esce
function icoLoop(cx, cy, st, k = 1) {
  const q = v => v * k;
  return arrow(cx, cy - q(140), cx, cy - q(97), st, 3) + blk(cx, cy - q(70), q(150), q(50), st) +
    arrow(cx, cy - q(45), cx, cy - q(7), st, 3) + dia(cx, cy + q(35), q(120), q(80), st) +
    poly([[cx - q(60), cy + q(35)], [cx - q(110), cy + q(35)], [cx - q(110), cy - q(70)], [cx - q(77), cy - q(70)]], st, 3) +
    arrow(cx, cy + q(75), cx, cy + q(135), st, 3);
}
// figura vista dall'alto (testa + spalle), rivolta verso l'alto; arm = lunghezza braccio teso
function person(x, y, st, arm = 0, fill = C.bg) {
  let s = '';
  if (arm > 0) s += `<line x1="${x + 34}" y1="${y}" x2="${x + 34}" y2="${y - arm}" stroke="${st}" stroke-width="10" stroke-linecap="round"/><circle cx="${x + 34}" cy="${y - arm}" r="9" fill="${st}"/>`;
  s += `<ellipse cx="${x}" cy="${y}" rx="52" ry="22" fill="${fill}" stroke="${st}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="22" fill="${fill}" stroke="${st}" stroke-width="4"/>`;
  return s;
}
// semaforo pedonale: lampada alta = omino fermo, bassa = omino che cammina; accesa = piena
function stand(cx, cy, c) { return `<circle cx="${cx}" cy="${cy - 34}" r="11" fill="${c}"/><path d="M${cx - 12},${cy - 18} h24 v34 h-6 v30 h-12 v-30 h-6 z" fill="${c}"/>`; }
function walk(cx, cy, c) { return `<circle cx="${cx + 4}" cy="${cy - 34}" r="11" fill="${c}"/><path d="M${cx - 6},${cy - 18} l18,0 l4,28 l14,34 l-12,4 l-14,-30 l-10,30 l-12,-4 l10,-34 l-12,10 l-8,-8 z" fill="${c}"/>`; }
function pedLight(cx, top, on, st) { // on: 'rossa' | 'verde' | null
  let s = `<rect x="${cx - 95}" y="${top}" width="190" height="390" rx="22" fill="${DIM()}" stroke="${st}" stroke-width="4"/><line x1="${cx}" y1="${top + 390}" x2="${cx}" y2="${top + 520}" stroke="${st}" stroke-width="6"/>`;
  const L1 = top + 105, L2 = top + 285;
  s += `<circle cx="${cx}" cy="${L1}" r="72" fill="${on === 'rossa' ? st : C.bg}" stroke="${st}" stroke-width="4"/>` + stand(cx, L1 + 8, on === 'rossa' ? C.bg : C.lineDim);
  s += `<circle cx="${cx}" cy="${L2}" r="72" fill="${on === 'verde' ? st : C.bg}" stroke="${st}" stroke-width="4"/>` + walk(cx, L2 + 8, on === 'verde' ? C.bg : C.lineDim);
  return s;
}
// lemniscata (infinito)
function lemPt(u, cx, cy, a) { const d = 1 + Math.sin(u) ** 2; return [cx + a * Math.cos(u) / d, cy + a * Math.sin(u) * Math.cos(u) / d]; }
function lem(cx, cy, a, st, sw) { let p = []; for (let i = 0; i <= 120; i++) p.push(lemPt(i / 120 * 2 * Math.PI, cx, cy, a).map(v => v.toFixed(1)).join(',')); return `<polyline points="${p.join(' ')}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`; }

// 1 — aggancio: tanta complessità, solo tre mattoni
scene('hook', { make: (W) => ({
  capAt: W('soli'),
  render(t) {
    let s = words(t, 0.1, 96, 400, 'Qualsiasi', { f: 'pop', size: 116 });
    s += words(t, W('algoritmo') - 0.1, 96, 530, 'algoritmo', { f: 'pop', size: 116 });
    s += E(t, W('complesso'), IT(100, 630, 'per quanto complesso…', { size: 54 }));
    // fondo: un groviglio di blocchi (diagramma complesso)
    const tc = W('complesso'), dimOut = t > W('tre') ? 1 - 0.75 * eo((t - W('tre')) / 0.5) : 1;
    let g = '';
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
      const i = r * 6 + c, x = 1000 + c * 135, y = 190 + r * 115, d = hsh(i) < 0.3;
      const el = d ? dia(x + 40, y + 25, 80, 56, C.lineDim, { sw: 2.5 }) : blk(x + 40, y + 25, 90, 46, C.lineDim, { sw: 2.5, rx: 8 });
      const ln = c < 5 ? `<line x1="${x + 86}" y1="${y + 25}" x2="${x + 129}" y2="${y + 25}" stroke="${C.lineDim}" stroke-width="2.5"/>` : '';
      const lv = r < 5 && hsh(i + 50) < 0.5 ? `<line x1="${x + 40}" y1="${y + 50}" x2="${x + 40}" y2="${y + 112}" stroke="${C.lineDim}" stroke-width="2.5"/>` : '';
      g += E(t, tc - 0.2 + hsh(i + 7) * 0.7, el + ln + lv, { dy: 8, d: 0.4 });
    }
    s += `<g opacity="${dimOut.toFixed(3)}">${g}</g>`;
    if (t > W('tre') - 0.1) s += `<rect x="960" y="150" width="900" height="720" fill="${C.bg}" opacity="${(0.5 * eo((t - W('tre') + 0.1) / 0.4)).toFixed(3)}"/>`;
    [[1130, icoSeq], [1420, icoCond], [1700, icoLoop]].forEach(([x, f], i) => s += pop(t, W('tre') + i * 0.18, x, 500, f(x, 490, C.line, 1)));
    return s + caption(t, W('soli'), 'Soli tre tipi', 'tre');
  } }) });

// 2 — come le note nella musica
scene('musica', { make: (W) => ({
  capAt: W('note'), lastAt: W('ciclo'),
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, card(140, 200, 700, 560, { rot: -1.2 }), { dy: 0 });
    s += E(t, -0.3, lbl(490, 290, 'MUSICA', { fill: C.ink, size: 30 }));
    let st = ''; for (let i = 0; i < 5; i++) st += `<line x1="200" y1="${400 + i * 30}" x2="780" y2="${400 + i * 30}" stroke="${C.ink}" stroke-width="3"/>`;
    s += E(t, -0.2, st, { dy: 0 });
    [[280, 490], [360, 460], [440, 475], [520, 430], [600, 445], [690, 415]].forEach(([x, y], i) => {
      s += E(t, W('note') + i * 0.09, `<ellipse cx="${x}" cy="${y}" rx="19" ry="14" transform="rotate(-20 ${x} ${y})" fill="${C.ink}"/><line x1="${x + 17}" y1="${y - 4}" x2="${x + 17}" y2="${y - 100}" stroke="${C.ink}" stroke-width="4"/>`, { dy: 10 });
    });
    s += E(t, W('note') + 0.4, lbl(490, 660, 'FATTA DI NOTE', { fill: C.ink, size: 28 }));
    s += E(t, W('ogni') - 0.1, T(960, 505, '=', { f: 'pop', size: 120, fill: C.coral, a: 'middle' }));
    s += E(t, W('ogni') - 0.2, card(1080, 200, 700, 560, { rot: 1.2 }), { dy: 0 });
    s += E(t, W('algoritmo'), lbl(1430, 290, 'ALGORITMO', { fill: C.ink, size: 30 }));
    const rows = [['SEQUENZA', W('sequenza'), icoSeq], ['CONDIZIONE', W('condizione'), icoCond], ['CICLO', W('ciclo'), icoLoop]];
    rows.forEach(([l, t0, f], i) => {
      const y = 400 + i * 120;
      s += E(t, t0, `<g transform="translate(1190 ${y}) scale(0.34) translate(-1190 ${-y})">${f(1190, y, C.ink, 1)}</g>` + T(1290, y + 14, l, { f: 'pop', size: 50, fill: C.ink }));
    });
    return s + caption(t, W('note'), 'Come le note', '', true);
  } }) });

// 3 — la sequenza: un passo dopo l'altro
scene('seq', { make: (W) => {
  const t0 = W('eseguite'), stp = 0.38;
  return {
    capAt: W('una', 1), lastAt: t0 + stp * 4,
    render(t) {
      let s = words(t, -0.2, 96, 420, 'La sequenza', { f: 'pop', size: 96 });
      s += E(t, W('serie'), IT(100, 520, 'una serie di istruzioni', { size: 52 }));
      s += E(t, W('eseguite'), IT(100, 590, 'eseguite in ordine', { size: 52 }));
      const cx = 1330, ys = [220, 380, 540, 700];
      ys.forEach((y, i) => {
        const lit = t > t0 + stp * (i + 0.6);
        s += E(t, W('istruzioni') - 0.2 + i * 0.12, blk(cx, y, 520, 100, C.line, { lab: 'ISTRUZIONE ' + (i + 1), fill: lit ? mix(C.bg, C.line, 0.22) : DIM(), size: 30 }), { dy: 12 });
        if (i < 3) s += E(t, W('istruzioni') + i * 0.12, arrow(cx, y + 50, cx, ys[i + 1] - 52, C.line, 4), { dy: 0 });
      });
      if (t > t0 - 0.2) {
        const p = clamp((t - t0) / (stp * 4 + 0.1)), y = lerp(150, 700, eio(p));
        s += E(t, t0 - 0.2, tok(cx - 300, y, C.coral, 18), { dy: 0, d: 0.3 });
      }
      return s + caption(t, W('una', 1), "Una dopo l'altra", '');
    } };
} });

// 4 — esempio: accendere il computer
scene('accendi', { make: (W) => ({
  capAt: W('computer'), lastAt: W('invio'),
  render(t) {
    let s = lightBg();
    // monitor a filo scuro
    const mx = 120, my = 210, on = t > W('tasto'), login = t > W('login') - 0.1, pw = t > W('password'), inv = t > W('invio');
    let m = `<rect x="${mx}" y="${my}" width="540" height="350" rx="18" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>` +
      `<rect x="${mx + 26}" y="${my + 26}" width="488" height="270" rx="8" fill="${on ? C.ivory : C.ink}" stroke="${C.ink}" stroke-width="3"/>` +
      `<path d="M${mx + 230},${my + 350} h80 l20,70 h-120 z" fill="${C.cream}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/><rect x="${mx + 160}" y="${my + 420}" width="220" height="20" rx="6" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>` +
      `<circle cx="${mx + 500}" cy="${my + 323}" r="11" fill="${on ? C.ink : 'none'}" stroke="${C.ink}" stroke-width="3"/>`;
    if (login) m += E(t, W('login') - 0.1, `<circle cx="${mx + 270}" cy="${my + 110}" r="34" fill="none" stroke="${C.ink}" stroke-width="4"/><rect x="${mx + 150}" y="${my + 170}" width="240" height="54" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>` + lbl(mx + 270, my + 270, 'LOGIN', { fill: C.ink, size: 24 }), { dy: 8 });
    if (pw) for (let i = 0; i < 6; i++) m += E(t, W('password') + i * 0.06, `<circle cx="${mx + 190 + i * 32}" cy="${my + 197}" r="8" fill="${C.ink}"/>`, { dy: 0, d: 0.2 });
    // tasto Invio
    const kd = inv ? 6 * clamp(1 - Math.abs(t - W('invio') - 0.15) / 0.15) : 0;
    m += E(t, W('premi', 1) - 0.1, `<rect x="${mx + 160}" y="${my + 520 + 8}" width="220" height="80" rx="12" fill="${C.ink}"/><rect x="${mx + 160}" y="${my + 520 + kd}" width="220" height="80" rx="12" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>` + lbl(mx + 270, my + 570 + kd, 'INVIO', { fill: C.ink, size: 28 }), { dy: 10 });
    s += E(t, -0.4, m, { dy: 0 });
    s += E(t, -0.3, card(800, 170, 1000, 660, { rot: 0.6 }), { dy: 0 });
    s += E(t, -0.2, lbl(850, 245, 'ACCENDERE IL COMPUTER', { fill: C.ink, a: 'start', size: 28 }));
    const steps = [['Premi il tasto di accensione', W('premi')], ['Attendi la schermata di login', W('attendi')], ['Inserisci la password', W('inserisci')], ['Premi Invio', W('premi', 1)]];
    let cur = -1; steps.forEach(([, t0], i) => { if (t > t0) cur = i; });
    steps.forEach(([l, t0], i) => {
      const y = 350 + i * 128, act = i === cur;
      s += E(t, t0, `<circle cx="${890}" cy="${y - 14}" r="34" fill="${act ? C.coral : C.cream}" stroke="${act ? C.coral : C.ink}" stroke-width="3"/>` +
        T(890, y - 2, String(i + 1), { f: 'mono', size: 32, w: 700, a: 'middle', fill: act ? C.ivory : C.ink }) + T(950, y, l, { f: 'popm', size: 44, fill: C.ink }));
    });
    return s + caption(t, W('computer'), 'Accendere il computer', '', true);
  } }) });

// 5 — l'ordine conta
scene('ordine', { make: (W) => {
  const ts = W('prima'), tx = W('non');
  return {
    capAt: W('conta'), lastAt: Math.max(tx, ts + 1.0),
    render(t) {
      const xs = [270, 727, 1184, 1641], y = 470;
      const labs = [['PREMI', 'IL TASTO'], ['ATTENDI', 'SCHERMATA LOGIN'], ['INSERISCI', 'PASSWORD'], ['PREMI', 'INVIO']];
      const p = clamp((t - ts) / 1.0), a = eio(p / 0.3), b = eio((p - 0.3) / 0.4), c = eio((p - 0.7) / 0.3), h = 150 * (a - c);
      const pos = [xs[0], lerp(xs[1], xs[2], b), lerp(xs[2], xs[1], b), xs[3]], lift = [0, h, -h * 0.9, 0];
      let s = '';
      xs.forEach((x, i) => s += E(t, -0.3 + i * 0.08, lbl(x, 250, 'PASSO ' + (i + 1), { size: 28 }), { dy: 8 }));
      for (let i = 0; i < 3; i++) s += E(t, -0.2, arrow(xs[i] + 190, y, xs[i + 1] - 192, y, C.line, 4), { dy: 0 });
      labs.forEach((l, i) => s += E(t, -0.3 + i * 0.08, blk(pos[i], y + lift[i], 380, 130, C.line, { lab: l, size: 28 }), { dy: 12 }));
      if (t > tx) {
        const cx = xs[1], q = eo((t - tx) / 0.35);
        const xy = 625, r = 34;
        s += `<g opacity="${q.toFixed(3)}"><line x1="${cx - r}" y1="${xy - r}" x2="${cx + r}" y2="${xy + r}" stroke="${C.coral}" stroke-width="14" stroke-linecap="round"/><line x1="${cx + r}" y1="${xy - r}" x2="${cx - r}" y2="${xy + r}" stroke="${C.coral}" stroke-width="14" stroke-linecap="round"/></g>`;
        s += E(t, tx + 0.1, pillTag(cx, 735, 'NON FUNZIONA', C.line, C.bg, 'middle'));
      }
      if (t > ts - 0.1) s += E(t, ts - 0.1, IT(1184, 735, 'password prima del login', { a: 'middle', size: 46 }));
      return s + caption(t, W('conta'), "L'ordine conta", '');
    } };
} });

// 6 — la condizione: istruzioni diverse
scene('cond', { make: (W) => ({
  capAt: W('seconda'), lastAt: W('diverse') + 0.35,
  render(t) {
    const cx = 960, cy = 340;
    let s = E(t, -0.4, arrow(cx, 140, cx, cy - 128, C.line, 4), { dy: 0 });
    s += E(t, -0.3, dia(cx, cy, 420, 250, C.coral, { lab: 'CONDIZIONE?', tf: C.line, size: 30 }), { dy: 0 });
    s += E(t, W('condizione'), IT(cx - 250, cy - 90, 'condizione', { size: 56, a: 'end' }));
    const B = [[470, 'A', 'SÌ'], [1450, 'B', 'NO']];
    B.forEach(([bx, k, yn], i) => {
      const sx = i ? cx + 210 : cx - 210;
      s += E(t, W('istruzioni') - 0.1 + i * 0.15, poly([[sx, cy], [bx, cy], [bx, 528]], C.line, 4) + lbl(i ? 1330 : 590, cy - 22, yn, { size: 30 }), { dy: 0 });
      s += E(t, W('diverse') - 0.1 + i * 0.15, blk(bx, 590, 400, 120, C.line, { lab: 'ISTRUZIONI ' + k, size: 30 }), { dy: 12 });
    });
    s += E(t, W('diverse') + 0.35, poly([[470, 650], [470, 720], [1450, 720], [1450, 650]], C.line, 4, false) + arrow(cx, 720, cx, 800, C.line, 4), { dy: 0 });
    return s + caption(t, W('seconda'), 'A seconda della situazione', '');
  } }) });

// 7 — esempio: il semaforo del pedone
scene('semaforo', { make: (W) => {
  const tv = W('verde'), tr = W('rossa');
  return {
    capAt: W('allora'), lastAt: W('aspetta') + 0.3,
    render(t) {
      const state = t > tr ? 'rossa' : t > tv ? 'verde' : null;
      let s = E(t, -0.4, pedLight(330, 180, state, C.line), { dy: 0 });
      if (state) s += pillTag(330, 800, state === 'verde' ? 'LUCE VERDE' : 'LUCE ROSSA', C.line, C.bg, 'middle');
      const dx = 1000, dy = 330;
      s += E(t, -0.3, arrow(620, dy, dx - 182, dy, C.line, 4) + dia(dx, dy, 360, 210, C.line, { lab: 'VERDE?', size: 32 }), { dy: 0 });
      const yesA = state === 'verde', noA = state === 'rossa';
      // SÌ -> attraversa (destra); NO -> aspetta (sotto)
      s += E(t, W('allora') - 0.1, poly([[dx + 180, dy], [1440, dy]], yesA ? C.coral : C.line, yesA ? 7 : 4) + lbl(1290, dy - 26, 'SÌ', { size: 30 }), { dy: 0 });
      s += E(t, W('attraversa') - 0.1, blk(1620, dy, 340, 120, C.line, { lab: 'ATTRAVERSA', size: 30, fill: yesA ? mix(C.bg, C.line, 0.25) : DIM() }), { dy: 10 });
      s += E(t, W('altrimenti') - 0.1, poly([[dx, dy + 105], [dx, 590]], noA ? C.coral : C.line, noA ? 7 : 4) + lbl(dx + 50, 500, 'NO', { size: 30, a: 'start' }), { dy: 0 });
      s += E(t, W('aspetta') - 0.1, blk(dx, 655, 340, 120, C.line, { lab: 'ASPETTA', size: 30, fill: noA ? mix(C.bg, C.line, 0.25) : DIM() }), { dy: 10 });
      s += E(t, W('aspetta') + 0.3, poly([[830, 655], [700, 655], [700, 346]], C.line, 3), { dy: 0 });
      return s + caption(t, W('allora'), 'Se, allora, altrimenti', '');
    } };
} });

// 8 — la condizione è una domanda sì/no
scene('formula', { make: (W) => ({
  capAt: W('risposta'), lastAt: W('sapere'),
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, card(220, 150, 1480, 690, { rot: -0.5 }), { dy: 0 });
    s += E(t, -0.2, T(960, 245, 'La condizione', { f: 'pop', size: 64, fill: C.ink, a: 'middle' }));
    const cx = 960, cy = 390;
    s += E(t, W('domanda') - 0.1, dia(cx, cy, 400, 200, C.coral, { lab: 'CONDIZIONE?', tf: C.ink, size: 30, fill: C.cream, sw: 5 }), { dy: 10 });
    s += E(t, W('sì') - 0.1, poly([[cx - 200, cy], [620, cy], [620, 528]], C.ink, 4) + pillTag(660, cy - 16, 'SÌ', C.ink, C.cream, 'middle') + blk(620, 580, 320, 100, C.ink, { lab: 'AZIONE A', size: 30, fill: C.cream }));
    s += E(t, W('no') - 0.05, poly([[cx + 200, cy], [1300, cy], [1300, 528]], C.ink, 4) + pillTag(1260, cy - 16, 'NO', C.ink, C.cream, 'middle') + blk(1300, 580, 320, 100, C.ink, { lab: 'AZIONE B', size: 30, fill: C.cream }));
    s += E(t, W('sapere') - 0.1, T(960, 745, 'SE [condizione] ALLORA [azione A] ALTRIMENTI [azione B]', { f: 'mono', size: 30, fill: C.ink, a: 'middle', w: 600 }));
    return s + caption(t, W('risposta'), 'Risposta sì o no', '', true);
  } }) });

// 9 — il ciclo: ripeti fino a quando
scene('ciclo', { make: (W) => {
  const t0 = W('esegue'), lap = 1.1, tv = W('verifica');
  const laps = Math.max(2, Math.ceil((tv - t0 - 0.9) / lap));
  const entry = [[200, 470], [520, 470], [880, 470], [1100, 470], [1250, 470]];
  const loop = [[1250, 470], [1250, 230], [700, 230], [700, 405], [700, 470], [880, 470], [1100, 470], [1250, 470]];
  const exit = [[1250, 470], [1430, 470], [1670, 470]];
  const tEx = t0 + 0.9 + laps * lap;
  return {
    capAt: W('più'), lastAt: tEx,
    render(t) {
      let s = E(t, -0.4, arrow(200, 470, 508, 470, C.line, 4) + blk(700, 470, 360, 130, C.line, { lab: 'ISTRUZIONI', size: 30 }) + arrow(880, 470, 1078, 470, C.line, 4), { dy: 0 });
      s += E(t, -0.25, dia(1250, 470, 340, 210, C.line, { lab: 'CONDIZIONE?', size: 28 }), { dy: 0 });
      s += E(t, W('ciclo') - 0.1, poly([[1250, 365], [1250, 230], [700, 230], [700, 402]], C.line, 4) + lbl(1290, 320, 'NO', { size: 30, a: 'start' }), { dy: 0 });
      const ex = t > tv ? C.line : mix(C.bg, C.line, 0.55);
      s += E(t, -0.25, poly([[1420, 470], [1700, 470]], ex, 4) + lbl(1520, 440, 'SÌ', { size: 30, fill: ex }) + lbl(1730, 480, 'ESCI', { size: 30, a: 'start', fill: ex }), { dy: 0 });
      // gettone di esecuzione
      if (t > t0) {
        let p;
        if (t < t0 + 0.9) p = along(entry, (t - t0) / 0.9);
        else if (t < tEx) p = along(loop, ((t - t0 - 0.9) % lap) / lap);
        else p = along(exit, (t - tEx) / 0.5);
        s += tok(p[0], p[1], C.coral, 18);
      }
      return s + caption(t, W('più'), 'Più volte', '');
    } };
} });

// 10 — esempio: l'amico nella stanza buia
scene('buio', { make: (W) => {
  const sy = 740, stepL = 150, armL = 110, fy = 300;
  // iterazione 1 agganciata alla voce, poi iterazione 2 rapida (ESEMPIO)
  const t2 = W('ripeti') + 0.05;
  const it = [
    { step: W('passo'), arm: W('allunga'), check: W('senti'), no: W('no'), back: W('torna') },
    { step: t2, arm: t2 + 0.5, check: W('sì'), no: null, back: null },
  ];
  const tStop = W('sì');
  return {
    capAt: W('torna'), lastAt: W('fermati'),
    render(t) {
      // stato della figura
      let y = sy, arm = 0, row = -1;
      it.forEach((k, i) => {
        if (t > k.step) { y = sy - stepL * (i + eo((t - k.step) / 0.4)); row = 0; }
        if (t > k.arm) { arm = armL * eo((t - k.arm) / 0.3); row = 1; }
        if (t > k.check) row = 2;
        if (k.no && t > k.no) row = 3;
        if (k.back && t > k.back) arm = armL * (1 - eo((t - k.back) / 0.3));
      });
      const found = t > tStop;
      if (found) row = 2;
      let s = E(t, -0.4, `<rect x="120" y="170" width="720" height="680" rx="20" fill="${mix(C.bg, C.line, 0.04)}" stroke="${C.line}" stroke-width="4"/>` + lbl(150, 220, 'STANZA BUIA', { a: 'start', size: 26 }) + pillTag(720, 222, 'ESEMPIO', C.line, C.bg, 'middle'), { dy: 0 });
      s += E(t, W('amico') - 0.1, person(514, fy, C.line, 0, DIM()) + lbl(420, fy + 10, 'AMICO', { size: 26, a: 'end' }), { dy: 0 });
      s += E(t, W('trovare') - 0.2, person(480, y, C.line, arm), { dy: 0 });
      if (found) s += E(t, tStop, `<circle cx="514" cy="${fy}" r="80" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="10 10"/>`, { dy: 0 });
      // istruzioni a destra
      const rows = [['Fai un passo avanti', W('fai')], ['Allunga il braccio', W('allunga')], ['Se senti qualcuno: fermati', W('senti')], ['Altrimenti: torna al passo 1', W('senti') + 0.15]];
      rows.forEach(([l, t0], i) => {
        const yy = 300 + i * 125;
        s += E(t, t0 - 0.1, T(990, yy + 14, String(i + 1), { f: 'mono', size: 34, w: 700, a: 'middle' }) + T(1040, yy + 14, l, { f: 'popm', size: 40 }));
      });
      if (row >= 0) { const yy = 300 + row * 125; s += `<rect x="950" y="${yy - 40}" width="${row === 3 ? 760 : row === 2 ? 700 : 520}" height="76" rx="14" fill="none" stroke="${C.coral}" stroke-width="5"/>`; }
      s += E(t, W('torna') - 0.1, poly([[1730, 675], [1790, 675], [1790, 300], [1730, 300]], C.line, 4), { dy: 0 });
      return s + caption(t, W('torna'), 'Torna al passo uno', '');
    } };
} });

// 11 — loop infinito
scene('infinito', { make: (W) => {
  const tm = W('ma');
  return {
    capAt: W('loop'), lastAt: W('errore'),
    render(t) {
      let s = lightBg();
      if (t < tm) {
        s += E(t, -0.4, card(160, 180, 720, 640, { rot: -1 }), { dy: 0 });
        for (let i = 0; i < 6; i++) s += E(t, -0.3 + i * 0.07, lbl(480, 290 + i * 86, 'ISTRUZIONI', { fill: C.ink, size: 30 }), { dy: 8 });
        if (t > W('senza')) s += E(t, W('senza'), `<path d="M730,262 h30 v486 h-30 M760,505 h26" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>` + lbl(500, 790, 'RISCRITTE OGNI VOLTA', { fill: C.ink, size: 26 }), { dy: 0 });
        s += E(t, W('ripetono') - 0.1, card(1040, 180, 720, 640, { rot: 1 }), { dy: 0 });
        const cy = 520, bx = 1255, dx = 1540;
        s += E(t, W('ripetono'), arrow(1070, cy, 1143, cy, C.ink, 4) + blk(bx, cy, 220, 96, C.ink, { lab: 'ISTRUZIONI', size: 26, fill: C.cream }) + arrow(1365, cy, 1408, cy, C.ink, 4) +
          dia(dx, cy, 260, 150, C.ink, { lab: 'CONDIZIONE?', size: 24, fill: C.cream }) +
          poly([[dx, cy - 75], [dx, 380], [bx, 380], [bx, cy - 50]], C.ink, 4) + lbl(dx + 20, 425, 'NO', { fill: C.ink, size: 26, a: 'start' }) +
          poly([[dx + 130, cy], [1735, cy]], C.ink, 4) + lbl(1700, cy + 46, 'SÌ', { fill: C.ink, size: 26 }), { dy: 10 });
        s += E(t, W('molte'), lbl(1410, 720, 'SCRITTE UNA VOLTA', { fill: C.ink, size: 26 }));
        const tq = W('ripetono') + 0.3, lp = 1.0, nl = 3;
        if (t > tq) {
          const ent = [[1070, cy], [bx, cy], [dx, cy]], lpP = [[dx, cy], [dx, 380], [bx, 380], [bx, cy], [dx, cy]], exP = [[dx, cy], [1735, cy]];
          const u = t - tq, p = u < 0.5 ? along(ent, u / 0.5) : u < 0.5 + nl * lp ? along(lpP, ((u - 0.5) % lp) / lp) : along(exP, (u - 0.5 - nl * lp) / 0.4);
          s += tok(p[0], p[1], C.ink, 13);
        }
      } else {
        const tt = t - tm;
        s += E(tt, -0.4, card(360, 170, 1200, 660), { dy: 0 });
        s += E(t, W('ciclo') - 0.1, lem(960, 470, 380, C.coral, 10), { dy: 0 });
        if (t > W('gira')) { const p = lemPt((t - W('gira')) * 3.2, 960, 470, 380); s += tok(p[0], p[1], C.ink, 18); }
        s += E(t, W('sempre') - 0.1, lbl(960, 290, 'GIRA PER SEMPRE', { fill: C.ink, size: 30 }));
        s += E(t, W('errore') - 0.1, pillTag(960, 720, 'DI SOLITO: UN ERRORE', C.ink, C.cream, 'middle'));
      }
      return s + caption(t, W('loop'), 'Loop infinito', '', true);
    } };
} });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 400, 'Tre strutture', { f: 'pop', size: 130, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('sequenza') - 0.1, 960, 540, 'Sequenza, condizione e ciclo.', { f: 'serif', size: 72, fill: C.ink, a: 'middle', it: true, key: 'ciclo' });
    s += E(t, W('ciclo') + 0.3, `<line x1="760" y1="630" x2="1160" y2="630" stroke="${C.ink}" stroke-width="3"/>` + T(960, 690, 'PROFTECNOLOGIA · MC DIG-1-03', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
