// «Come impara una macchina» — MC-INF-3-02 §2. Ogni scena: render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const capAt = def.capAt ?? null, nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.6);
  if (capAt != null) D = Math.max(D, capAt + 1.0 + 0.3 * nWords + 0.2);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

// ---- elementi ricorrenti del mondo "spazio dei dati" ----
// pseudo-casuale deterministico
function rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
// piano dei dati: assi + griglia tenue
function plane(x, y, w, h, o = {}) {
  const ink = o.ink || C.line; let s = '';
  for (let i = 1; i < 6; i++) s += `<line x1="${x + i * w / 6}" y1="${y}" x2="${x + i * w / 6}" y2="${y + h}" stroke="${ink}" stroke-width="1" opacity="0.12"/>`;
  for (let i = 1; i < 4; i++) s += `<line x1="${x}" y1="${y + i * h / 4}" x2="${x + w}" y2="${y + i * h / 4}" stroke="${ink}" stroke-width="1" opacity="0.12"/>`;
  s += `<path d="M${x},${y} L${x},${y + h} L${x + w},${y + h}" fill="none" stroke="${ink}" stroke-width="3"/>`;
  return s;
}
const dot = (x, y, r, ink, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill || ink}" stroke="${ink}" stroke-width="2.5"/>`;
// il modello: una scatola con tre manopole-parametro (niente volto, niente robot)
function modelBox(cx, cy, k, o = {}) {
  const ink = o.ink || C.line, w = 380 * k, h = 240 * k, x = cx - w / 2, y = cy - h / 2, ph = o.ph || [0.3, 0.7, 0.5];
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${18 * k}" fill="${o.fill || mix(C.bg, C.line, 0.08)}" stroke="${ink}" stroke-width="3"/>`;
  s += T(cx, y + 50 * k, 'MODELLO', { f: 'mono', size: 26 * k, fill: ink, a: 'middle', ls: 5, w: 700 });
  ph.forEach((p, i) => {
    const ly = y + (100 + i * 46) * k, lx = x + 50 * k, lw = w - 100 * k;
    s += `<line x1="${lx}" y1="${ly}" x2="${lx + lw}" y2="${ly}" stroke="${ink}" stroke-width="3" opacity="0.5" stroke-linecap="round"/>`;
    s += `<circle cx="${lx + lw * clamp(p)}" cy="${ly}" r="${12 * k}" fill="${o.knob || ink}"/>`;
  });
  if (o.label !== false) s += T(cx, y + h + 40 * k, 'PARAMETRI INTERNI', { f: 'mono', size: 24, fill: ink, a: 'middle', ls: 3, op: 0.85 });
  return s;
}
// busta stilizzata (email generica)
function envelope(x, y, w, ink, fill) {
  const h = w * 0.66;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill || 'none'}" stroke="${ink}" stroke-width="3"/>` +
    `<path d="M${x + 4},${y + 6} L${x + w / 2},${y + h * 0.55} L${x + w - 4},${y + 6}" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
}
function tag(x, y, s, ink, o = {}) {
  const w = tw(s, 'mono', o.size || 24) + 40 * 1 + (o.ls ? s.length * o.ls : 0);
  return `<rect x="${x}" y="${y}" width="${w}" height="${(o.size || 24) + 22}" rx="${((o.size || 24) + 22) / 2}" fill="${o.fill || 'none'}" stroke="${ink}" stroke-width="2.5"/>` +
    T(x + w / 2, y + (o.size || 24) * 1.15, s, { f: 'mono', size: o.size || 24, fill: o.tc || ink, a: 'middle', ls: o.ls });
}
const exLabel = (x, y, ink, a = 'end') => T(x, y, 'DATI DI ESEMPIO', { f: 'mono', size: 24, fill: ink || C.line, a, ls: 4, op: 0.85 });
function lightBg() { return `<rect width="1920" height="1080" fill="${C.ivory}"/><circle cx="1780" cy="1040" r="620" fill="url(#peach)"/>`; }
function push(t, D, cx, cy, g) { const k = 1 + 0.02 * t / D; return `<g transform="translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})">${g}</g>`; }

// dati di esempio per il piano: andamento crescente con rumore
const PX = 360, PY = 230, PW = 1080, PH = 560;
const PTS = Array.from({ length: 34 }, (_, i) => { const u = 0.04 + 0.7 * rnd(i + 1); return [u, clamp(0.12 + 0.78 * u + (rnd(i + 40) - 0.5) * 0.22, 0.05, 0.95)]; });
const toP = ([u, v]) => [PX + u * PW, PY + PH - v * PH];

// 1 — aggancio
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('eppure'),
  render(t) {
    let s = E(t, -0.4, modelBox(960, 560, 1.15, { ph: [0.3 + 0.05 * Math.sin(t * 2), 0.7, 0.5] }), { dy: 0 });
    s += words(t, W('non'), 960, 250, 'Non pensa. Non capisce.', { f: 'pop', size: 84, a: 'middle', fill: C.line });
    return s + caption(t, W('eppure'), 'Eppure impara', 'impara');
  } }) });

// 2 — schemi e previsioni
scene('schemi', { make: (W) => ({
  capAt: W('previsioni'),
  render(t) {
    let s = plane(PX, PY, PW, PH) + exLabel(PX + PW, PY - 24);
    PTS.forEach((p, i) => { const [x, y] = toP(p); s += pop(t, -0.3 + i * 0.045, x, y, dot(x, y, 9, C.line)); });
    // lo schema trovato: la retta che segue i punti
    const lp = eio((t - W('quantità')) / 1.1), x0 = PX, y0 = PY + PH - 0.12 * PH, x1 = PX + PW * 0.95, y1 = PY + PH - (0.12 + 0.78 * 0.95) * PH;
    if (lp > 0) s += `<line x1="${x0}" y1="${y0}" x2="${lerp(x0, x1, lp)}" y2="${lerp(y0, y1, lp)}" stroke="${C.line}" stroke-width="4" stroke-dasharray="14 10"/>`;
    s += E(t, W('quantità') + 0.9, T(PX + 40, PY + 50, 'lo schema trovato', { f: 'serif', size: 44, it: true, fill: C.line }));
    // dato nuovo -> previsione
    const nx = PX + PW * 0.88, ny = lerp(y0, y1, 0.88 / 0.95);
    s += pop(t, W('nuovi') - 0.2, nx, PY + PH, `<circle cx="${nx}" cy="${PY + PH}" r="14" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + T(nx, PY + PH + 56, 'dato nuovo', { f: 'mono', size: 24, fill: C.line, a: 'middle' }));
    const up = eio((t - W('nuovi') - 0.2) / 0.7);
    if (up > 0) s += `<line x1="${nx}" y1="${PY + PH - 14}" x2="${nx}" y2="${lerp(PY + PH - 14, ny + 18, up)}" stroke="${C.coral}" stroke-width="4"/>`;
    s += pop(t, W('nuovi') + 0.8, nx, ny, `<circle cx="${nx}" cy="${ny}" r="16" fill="${C.coral}"/>`);
    s += E(t, W('nuovi') + 1.0, T(nx + 32, ny + 9, 'previsione', { f: 'mono', size: 26, fill: C.line, w: 700 }));
    return s + caption(t, W('previsioni'), 'Schemi, poi previsioni', 'previsioni');
  } }) });

// 3 — tre famiglie
scene('famiglie', { tail: 0.9, make: (W) => ({
  capAt: W('tre'),
  render(t, D) {
    let g = E(t, -0.4, T(960, 220, 'Machine learning tradizionale', { f: 'serif', size: 80, fill: C.ink, a: 'middle' }), { dy: 0 });
    const cols = [['Supervisionato', 'esempi con la risposta'], ['Non supervisionato', 'dati senza etichette'], ['Per rinforzo', 'ricompense e penalità']];
    cols.forEach(([h, sub], i) => {
      const x = 240 + i * 500, t0 = W('tre') + i * 0.18;
      let c = card(x, 330, 440, 420) + T(x + 36, 400, String(i + 1), { f: 'serif', size: 64, it: true, fill: C.coral });
      c += T(x + 36, 470, h, { f: 'pop', size: 40, fill: C.ink }) + T(x + 36, 520, sub, { f: 'serif', size: 36, it: true, fill: C.ink });
      // icona
      if (i === 0) c += envelope(x + 36, 580, 110, C.ink) + tag(x + 170, 590, 'spam', C.ink);
      if (i === 1) [[0, 0], [30, 20], [10, 50], [150, 10], [180, 40], [160, 70], [300, 30], [320, 70]].forEach(([a, b]) => c += dot(x + 50 + a, 600 + b, 10, C.ink, C.cream));
      if (i === 2) c += tag(x + 36, 600, '+ ricompensa', C.ink) + tag(x + 36, 660, '− penalità', C.ink);
      g += E(t, t0, c);
    });
    return lightBg() + push(t, D, 960, 520, g) + caption(t, W('tre'), 'Tre famiglie', 'Tre', true);
  } }) });

// 4 — esempi etichettati
scene('etichette', { make: (W) => ({
  capAt: W('input'),
  render(t) {
    let s = T(420, 260, 'INPUT', { f: 'mono', size: 26, fill: C.line, ls: 5, a: 'middle', w: 700 }) + T(1240, 260, 'RISPOSTA CORRETTA', { f: 'mono', size: 26, fill: C.line, ls: 5, a: 'middle', w: 700 });
    s = E(t, -0.3, s, { dy: 0 }) + E(t, 0, exLabel(1824, 1060 - 140), { dy: 0 });
    const rows = [['spam', 'Hai vinto un premio!!!'], ['non spam', 'Verifica di giovedì'], ['spam', 'Clicca qui subito']];
    rows.forEach(([lab, subj], i) => {
      const y = 320 + i * 160;
      s += E(t, W('esempi') + i * 0.15, envelope(260, y, 120, C.line) + T(410, y + 56, subj, { f: 'serif', size: 40, it: true, fill: C.line }));
      s += E(t, W('etichettati') + i * 0.15, arrow(900, y + 40, 1040, y + 40, C.line, 4));
      s += pop(t, W('risposta') - 0.2 + i * 0.15, 1150, y + 40, tag(1080, y + 17, lab, C.line, { size: 28 }));
    });
    return s + caption(t, W('input'), 'Input più risposta corretta', 'corretta');
  } }) });

// 5 — il ciclo di addestramento
scene('ciclo', { tail: 0.8, make: (W) => {
  const nodes = [['previsione', W('previsione')], ['confronto', W('confronta')], ['errore', W('misura')], ['aggiusta i parametri', W('aggiusta')]];
  return { capAt: W('misura'), render(t) {
    const cx = 960, cy = 540, r = 300;
    const adj = eio((t - W('aggiusta')) / 1.0);
    let s = modelBox(cx, cy, 0.85, { ph: [lerp(0.3, 0.55, adj), lerp(0.7, 0.45, adj), lerp(0.5, 0.62, adj)], label: false });
    nodes.forEach(([l, t0], i) => {
      const a = -Math.PI / 2 + i * Math.PI / 2, lx = cx + r * 1.55 * Math.cos(a), ly = cy + r * Math.sin(a);
      // arco dal nodo i al successivo
      const p = eo((t - t0 - 0.3) / 0.7);
      if (p > 0) {
        const a0 = a + 0.42, a1 = a0 + (Math.PI / 2 - 0.84) * p;
        const P = aa => [cx + r * 1.55 * Math.cos(aa), cy + r * Math.sin(aa)];
        let d = ''; for (let k = 0; k <= 24; k++) { const [x, y] = P(lerp(a0, a1, k / 24)); d += (k ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
        s += `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`;
        const [ex, ey] = P(a1), [px, py] = P(a1 - 0.03), an = Math.atan2(ey - py, ex - px);
        s += `<path d="M${ex + 10 * Math.cos(an)},${ey + 10 * Math.sin(an)} L${ex - 14 * Math.cos(an - 0.5)},${ey - 14 * Math.sin(an - 0.5)} L${ex - 14 * Math.cos(an + 0.5)},${ey - 14 * Math.sin(an + 0.5)} z" fill="${C.line}"/>`;
      }
      const w = tw(l, 'mono', 28) + 48, isErr = l === 'errore';
      s += pop(t, t0 - 0.15, lx, ly, `<rect x="${lx - w / 2}" y="${ly - 28}" width="${w}" height="56" rx="28" fill="${C.bg}" stroke="${C.line}" stroke-width="2.5"/>` + T(lx, ly + 10, l, { f: 'mono', size: 28, fill: C.line, a: 'middle', w: isErr ? 700 : 500 }));
    });
    return s + caption(t, W('misura'), "Misura l'errore", 'errore');
  } };
} });

// 6 — milioni di ripetizioni: l'errore cala
scene('milioni', { tail: 1.0, make: (W) => ({
  capAt: W('milioni'),
  render(t, D) {
    const x = 380, y = 260, w = 1160, h = 470;
    let g = E(t, -0.4, card(260, 170, 1400, 680, { rot: -1 }), { dy: 0 });
    g += plane(x, y, w, h, { ink: C.ink });
    g += T(x, y - 22, 'ERRORE', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 700 });
    g += T(x + w, y + h + 50, 'RIPETIZIONI DEL CICLO →', { f: 'mono', size: 26, fill: C.ink, a: 'end', ls: 3, w: 700 });
    g += T(x + 24, y + h + 50, 'andamento di esempio', { f: 'serif', size: 34, it: true, fill: C.ink });
    const p = eio((t - 0.1) / Math.max(0.5, W("l'errore") + 0.4));
    let d = ''; const n = Math.max(2, Math.round(80 * p));
    for (let i = 0; i <= n; i++) { const u = i / 80, v = 0.08 + 0.84 * Math.exp(-u * 4.2) + 0.025 * Math.sin(u * 60) * Math.exp(-u * 2); d += (i ? 'L' : 'M') + (x + u * w).toFixed(1) + ',' + (y + h - v * h).toFixed(1); }
    g += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
    return lightBg() + push(t, D, 960, 500, g) + caption(t, W('milioni'), 'Milioni di volte', 'Milioni', true);
  } }) });

// 7 — filtro antispam
scene('spam', { tail: 0.9, make: (W) => ({
  capAt: W('applica'),
  render(t) {
    let s = '';
    s += E(t, -0.4, modelBox(960, 470, 0.9, { ph: [0.55, 0.45, 0.62] }), { dy: 0 });
    const feats = [['parole', W('parole')], ['strutture', W('strutture')], ['mittenti', W('mittenti')]];
    s += E(t, -0.2, T(330, 250, 'CHE COSA IMPARA', { f: 'mono', size: 26, fill: C.line, ls: 4, a: 'middle', w: 700 }), { dy: 0 });
    feats.forEach(([f, t0], i) => s += E(t, t0 - 0.1, tag(230, 300 + i * 90, f, C.line, { size: 28 }) + arrow(430, 323 + i * 90, 700, 400 + i * 40, C.line, 3)));
    // email nuova in ingresso -> previsione
    const inn = eo((t - W('applica') + 0.3) / 0.8);
    if (inn > 0) s += `<g opacity="${inn}">${envelope(lerp(1700, 1500, inn), 760, 150, C.line)}</g>` + E(t, W('applica'), T(1575, 900, 'email nuova', { f: 'mono', size: 26, fill: C.line, a: 'middle' }), { dy: 0 });
    s += E(t, W('email'), arrow(1480, 820, 1200, 640, C.line, 4), { dy: 0 });
    s += pop(t, W('nuove') + 0.25, 1500, 320, tag(1370, 290, 'previsione: spam', C.line, { size: 30, fill: C.bg }));
    s += E(t, W('nuove') + 0.1, arrow(1180, 400, 1360, 330, C.line, 4), { dy: 0 });
    return s + caption(t, W('applica'), 'Applicato alle email nuove', 'nuove');
  } }) });

// 8 — quando funziona
scene('quando', { make: (W) => ({
  capAt: W('futuro'),
  render(t, D) {
    let g = E(t, -0.4, card(300, 190, 1320, 560, { rot: 1 }), { dy: 0 });
    g += E(t, -0.3, T(380, 300, 'Funziona quando…', { f: 'serif', size: 76, fill: C.ink }));
    const rows = [['hai molti dati etichettati di qualità', W('molti')], ['il problema del futuro è simile', W('futuro')]];
    rows.forEach(([r, t0], i) => {
      const y = 420 + i * 150;
      g += E(t, t0 - 0.1, `<circle cx="420" cy="${y}" r="34" fill="none" stroke="${C.ink}" stroke-width="4"/><path d="M402,${y} L416,${y + 15} L440,${y - 14}" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
        T(490, y + 16, r, { f: 'popm', size: 44, fill: C.ink }) + (i === 1 ? T(490, y + 72, 'ai problemi del passato', { f: 'popm', size: 44, fill: C.ink }) : ''));
    });
    return lightBg() + push(t, D, 960, 470, g) + caption(t, W('futuro'), 'Futuro simile al passato', 'passato', true);
  } }) });

// 9 — gruppi nascosti
const CL = [[620, 500], [1060, 360], [1300, 700]];
const GP = Array.from({ length: 36 }, (_, i) => { const c = CL[i % 3], a = rnd(i + 7) * Math.PI * 2, r = 25 + 95 * rnd(i + 70); return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a) * 0.8, i % 3]; });
scene('gruppi', { tail: 0.7, make: (W) => ({
  capAt: W('gruppi'),
  render(t) {
    let s = plane(360, 220, 1200, 640) + exLabel(1560, 196);
    // punti tutti uguali: nessuna etichetta
    const sp = eio((t - W('cerca')) / 1.2);
    GP.forEach(([x, y, c], i) => {
      const sx = lerp(x, 960 + (rnd(i + 200) - 0.5) * 1000, 0) , sy = y;
      const mx = lerp(400 + rnd(i + 300) * 1120, sx, sp), my = lerp(250 + rnd(i + 400) * 580, sy, sp);
      s += pop(t, -0.3 + i * 0.03, mx, my, dot(mx, my, 10, C.line, C.bg));
    });
    s += E(t, W('etichette') - 0.1, T(400, 280, 'nessuna etichetta', { f: 'serif', size: 44, it: true, fill: C.line }));
    CL.forEach(([x, y], i) => s += E(t, W('gruppi') + i * 0.2, `<ellipse cx="${x}" cy="${y}" rx="150" ry="125" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="12 10"/>` +
      T(x, y - 140, 'gruppo ' + 'ABC'[i], { f: 'mono', size: 26, fill: C.line, a: 'middle', w: 700 }), { dy: 0 }));
    s += E(t, W('utenti') - 0.1, T(1560, 900, 'es.: utenti con gusti musicali simili', { f: 'mono', size: 26, fill: C.line, a: 'end' }), { dy: 0 });
    return s + caption(t, W('gruppi'), 'Gruppi nascosti', 'nascosti');
  } }) });

// 10 — per rinforzo
scene('rinforzo', { tail: 0.9, make: (W) => ({
  capAt: W('ricompense'),
  render(t) {
    const gx = 560, gy = 230, cs = 130, cols = 6, rows = 4;
    let s = '';
    for (let r = 0; r <= rows; r++) s += `<line x1="${gx}" y1="${gy + r * cs}" x2="${gx + cols * cs}" y2="${gy + r * cs}" stroke="${C.line}" stroke-width="2" opacity="0.4"/>`;
    for (let c = 0; c <= cols; c++) s += `<line x1="${gx + c * cs}" y1="${gy}" x2="${gx + c * cs}" y2="${gy + rows * cs}" stroke="${C.line}" stroke-width="2" opacity="0.4"/>`;
    s = E(t, -0.4, s, { dy: 0 });
    const cell = (c, r) => [gx + c * cs + cs / 2, gy + r * cs + cs / 2];
    // muro e traguardo
    s += E(t, -0.2, `<rect x="${gx + 2 * cs + 8}" y="${gy + 8}" width="${cs - 16}" height="${2 * cs - 16}" rx="10" fill="${mix(C.bg, C.line, 0.25)}"/>` + T(...cell(2, 0.5).map((v, i) => i ? v + 10 : v), 'muro', { f: 'mono', size: 24, fill: C.line, a: 'middle' }) +
      `<rect x="${gx + 5 * cs + 10}" y="${gy + 10}" width="${cs - 20}" height="${cs - 20}" rx="10" fill="none" stroke="${C.line}" stroke-width="3"/>` + T(...cell(5, 0).map((v, i) => i ? v + 9 : v), 'meta', { f: 'mono', size: 24, fill: C.line, a: 'middle' }), { dy: 0 });
    // tentativo 1: urta il muro -> penalità
    const a1 = eio((t - W('prova')) / 0.6), bump = eio((t - W('prova') - 0.6) / 0.4);
    const p0 = cell(1, 1), pw = cell(1.6, 1);
    let ax = lerp(p0[0], pw[0], a1 - bump), ay = p0[1];
    // tentativo 2: giro in basso -> ricompensa; poi strategia
    const path = [[1, 1], [1, 2], [2, 2], [3, 2], [3, 1], [4, 1], [5, 1], [5, 0]].map(([c, r]) => cell(c, r));
    const g2 = clamp((t - W('ricompense')) / 1.6);
    if (g2 > 0) { const f = g2 * (path.length - 1), k = Math.min(path.length - 2, Math.floor(f)), u = f - k; ax = lerp(path[k][0], path[k + 1][0], eio(u)); ay = lerp(path[k][1], path[k + 1][1], eio(u)); }
    s += pop(t, W('penalità') - 0.1, gx - 150, gy + 1.5 * cs, tag(gx - 250, gy + 1.5 * cs - 23, '− penalità', C.line, { fill: C.bg }));
    s += pop(t, W('ricompense') + 1.6, cell(5, 0)[0], gy - 30, tag(cell(5, 0)[0] - 120, gy - 64, '+ ricompensa', C.line, { fill: C.bg }));
    // strategia aggiustata: il percorso evidenziato
    const st = eio((t - W('aggiusta')) / 0.9);
    if (st > 0) { let d = ''; path.forEach(([x, y], i) => d += (i ? 'L' : 'M') + x + ',' + y); s += `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2000" stroke-dashoffset="${2000 * (1 - st)}"/>`; }
    s += E(t, W('aggiusta') + 0.4, T(gx, gy + rows * cs + 60, 'la strategia che porta più ricompense', { f: 'serif', size: 40, it: true, fill: C.line }));
    s += pop(t, -0.2, ax, ay, `<circle cx="${ax}" cy="${ay}" r="26" fill="${C.line}"/>`);
    return s + caption(t, W('ricompense'), 'Ricompense e penalità', 'Ricompense');
  } }) });

// 11 — Go, 2016
const STONES = Array.from({ length: 30 }, (_, i) => [Math.floor(rnd(i + 900) * 9), Math.floor(rnd(i + 950) * 9), i % 2]);
scene('go', { make: (W) => ({
  capAt: W('giocando'),
  render(t, D) {
    let g = E(t, -0.4, card(180, 170, 700, 700, { rot: -1.5 }), { dy: 0 });
    const bx = 260, by = 250, st = 67;
    let b = '';
    for (let i = 0; i < 9; i++) b += `<line x1="${bx}" y1="${by + i * st}" x2="${bx + 8 * st}" y2="${by + i * st}" stroke="${C.ink}" stroke-width="2"/><line x1="${bx + i * st}" y1="${by}" x2="${bx + i * st}" y2="${by + 8 * st}" stroke="${C.ink}" stroke-width="2"/>`;
    g += E(t, -0.3, b, { dy: 0 });
    const seen = new Set();
    STONES.forEach(([c, r, w], i) => { const key = c + ',' + r; if (seen.has(key)) return; seen.add(key); const x = bx + c * st, y = by + r * st; g += pop(t, 0.1 + i * 0.12, x, y, `<circle cx="${x}" cy="${y}" r="27" fill="${w ? C.cream : C.ink}" stroke="${C.ink}" stroke-width="2.5"/>`, 0.3); });
    g += E(t, W('2016'), T(1000, 400, '2016', { f: 'pop', size: 180, fill: C.ink }));
    g += E(t, W('battuto'), T(1005, 490, 'battuto il campione', { f: 'serif', size: 56, it: true, fill: C.ink }) + T(1005, 550, 'mondiale di Go', { f: 'serif', size: 56, it: true, fill: C.ink }));
    g += E(t, W('milioni'), T(1005, 660, 'milioni di partite', { f: 'pop', size: 56, fill: C.ink }) + T(1005, 715, 'contro sé stesso', { f: 'popm', size: 44, fill: C.ink }));
    return lightBg() + push(t, D, 960, 520, g) + caption(t, W('giocando'), 'Milioni di partite', 'partite', true);
  } }) });

// 12 — chiusura
scene('finale', { tail: 2.4, make: (W) => ({
  capAt: null,
  render(t, D) {
    const endAt = W('saperlo') - 0.1;
    let s = lightBg();
    if (t < endAt) {
      let g = E(t, -0.4, card(360, 260, 1200, 480, { rot: 1 }), { dy: 0 });
      g += E(t, W('tre') - 0.2, T(960, 400, 'IN TUTTI E TRE I CASI', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5 }));
      g += E(t, W('trova'), T(960, 530, 'trova schemi', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }));
      g += E(t, W('ottimizza'), T(960, 650, 'e ottimizza', { f: 'pop', size: 96, fill: C.coral, a: 'middle' }));
      return s + push(t, D, 960, 500, g) + chapterBar(t, 3, true);
    }
    const u = t - endAt;
    s += E(u, 0, T(960, 450, 'Come impara', { f: 'pop', size: 130, fill: C.ink, a: 'middle' }) + T(960, 590, 'una macchina', { f: 'pop', size: 130, fill: C.ink, a: 'middle' }));
    s += words(u, 0.5, 960, 690, 'non pensa: trova schemi e ottimizza', { f: 'serif', size: 56, fill: C.ink, a: 'middle', it: true, key: 'ottimizza' });
    s += E(u, 1.3, `<line x1="760" y1="750" x2="1160" y2="750" stroke="${C.coral}" stroke-width="4"/>` + T(960, 810, 'PROFTECNOLOGIA · MC INF-3-02', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 5 }));
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
