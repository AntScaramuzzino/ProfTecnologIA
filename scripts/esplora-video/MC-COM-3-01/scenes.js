// TCP/IP: la lingua di Internet — scene con render(t, D) puro.
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

// piccola rete: nodi e collegamenti interni
function cluster(cx, cy, r, o = {}) {
  const ink = o.ink || C.line, pts = [[0, -0.55], [0.58, -0.1], [0.32, 0.55], [-0.38, 0.5], [-0.55, -0.15]].map(([a, b]) => [cx + a * r, cy + b * r]);
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.fillD}" stroke="${ink}" stroke-width="2.5" stroke-dasharray="4 10" stroke-linecap="round"/>`;
  [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2]].forEach(([a, b]) => s += `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="${ink}" stroke-width="2.5"/>`);
  pts.forEach(([x, y]) => s += `<circle cx="${x}" cy="${y}" r="13" fill="${C.bg}" stroke="${ink}" stroke-width="3"/>`);
  return { s, pts };
}

// 1 — aggancio: una rete di reti
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('rete', 1),
  render(t) {
    let s = words(t, 0.2, 960, 230, 'Come arriva un messaggio?', { f: 'pop', size: 84, a: 'middle' });
    s += E(t, -0.4, phone(210, 700, 1.2) + lbl(210, 770, 'QUI'), { dy: 0 });
    s += E(t, W('mondo') - 0.3, laptop(1700, 690, 1) + lbl(1700, 770, 'DALL\'ALTRA PARTE'), { dy: 0 });
    const CL = [[560, 560, 120], [870, 700, 110], [1120, 470, 115], [1400, 650, 110]];
    const cls = CL.map(([x, y, r]) => cluster(x, y, r));
    // arco "?" finché non compaiono le reti
    const q = clamp((W('internet') + 0.2 - t) / 0.4);
    if (t > W('mondo') && q > 0) s += `<g opacity="${(q * eo((t - W('mondo')) / 0.5)).toFixed(3)}"><path d="M280,560 Q960,280 1640,560" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="6 14" stroke-linecap="round"/>${T(960, 440, '?', { f: 'pop', size: 90, a: 'middle' })}</g>`;
    cls.forEach((c, i) => { s += pop(t, W('internet') + i * 0.22, CL[i][0], CL[i][1], c.s); });
    // collegamenti fra reti
    const links = [[[262, 640], cls[0].pts[4]], [cls[0].pts[1], cls[2].pts[4]], [cls[0].pts[2], cls[1].pts[3]], [cls[1].pts[1], cls[3].pts[3]], [cls[2].pts[1], cls[3].pts[0]], [cls[3].pts[1], [1610, 650]]];
    links.forEach(([a, b], i) => { s += drawLine(a[0], a[1], b[0], b[1], (t - W('rete', 1) + 0.3 - i * 0.12) / 0.4, C.line, 4); });
    s += E(t, W('rete', 1), lbl(960, 325, 'INTERNET', { size: 28 }), { dy: 0 });
    return s + caption(t, W('rete', 1), 'Rete di reti', 'reti');
  } }) });

// 2 — il protocollo, lingua comune
scene('protocollo', { make: (W) => ({
  capAt: W('lingua'),
  render(t) {
    const a = cluster(400, 520, 140), b = cluster(1520, 520, 140);
    let s = E(t, -0.4, a.s + b.s, { dy: 0 });
    s += E(t, W('reti') - 0.1, lbl(400, 720, 'RETE SCOLASTICA') + lbl(1520, 720, 'RETE OPERATORE'));
    s += drawLine(560, 520, 1360, 520, (t - W('comunicare')) / 0.6, C.line, 4);
    s += pop(t, W('protocollo') - 0.1, 960, 520, pillTag(960, 532, 'PROTOCOLLO', C.coral, C.bg, { a: 'middle', size: 34, stroke: C.coral, sw: 4, w: 700 }));
    s += E(t, W('tcpip') - 0.1, T(960, 320, 'TCP/IP', { f: 'pop', size: 120, a: 'middle' }));
    s += E(t, W('due'), pillTag(870, 720, 'IP', C.line, C.bg, { a: 'middle', size: 34 }));
    s += E(t, W('protocolli'), pillTag(1050, 720, 'TCP', C.line, C.bg, { a: 'middle', size: 34 }));
    s += E(t, W('insieme') - 0.1, T(960, 723, '+', { f: 'pop', size: 50, a: 'middle' }));
    return s + caption(t, W('lingua'), 'Una lingua comune', '');
  } }) });

// 3 — l'indirizzo IP
scene('indirizzo', { make: (W) => ({
  capAt: W('unico'),
  render(t) {
    const X = [520, 960, 1400], ad = ['198.51.100.10', '198.51.100.11', '198.51.100.12'];
    let s = E(t, -0.4, laptop(X[0], 370, 0.9) + phone(X[1], 385, 1.05) + desktop(X[2], 390, 0.9), { dy: 0 });
    ad.forEach((a, i) => s += E(t, W('indirizzo') + i * 0.18, pillTag(X[i], 482, a, C.line, C.bg, { a: 'middle', size: 30 })));
    s += E(t, W('indirizzo') + 0.5, lbl(960, 200, 'INDIRIZZI DI ESEMPIO', { size: 26 }));
    // scomposizione del primo indirizzo
    const parts = ['198', '51', '100', '10'], bx = [600, 840, 1080, 1320];
    parts.forEach((p, i) => s += E(t, W('quattro') + i * 0.12, `<rect x="${bx[i] - 95}" y="${640}" width="190" height="120" rx="14" fill="${C.fillD}" stroke="${C.line}" stroke-width="3.5"/>` + T(bx[i], 725, p, { f: 'pop', size: 66, a: 'middle' })));
    [720, 960, 1200].forEach((x, i) => s += E(t, W('punti') + i * 0.1, `<circle cx="${x}" cy="${740}" r="11" fill="${C.line}"/>`));
    s += E(t, W('0a255'), `<path d="M505,612 L505,596 L1415,596 L1415,612" fill="none" stroke="${C.coral}" stroke-width="4"/>` + lbl(960, 580, 'OGNI NUMERO: DA 0 A 255', { fill: C.coral, size: 28 }));
    return s + caption(t, W('unico'), 'Un indirizzo unico', '');
  } }) });

// 4 — IPv4 esauriti, arriva IPv6
scene('ipv4', { make: (W) => ({
  capAt: W('passa'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(200, 170, 1520, 620, { rot: -0.8 }), { dy: 0 });
    g += E(t, W('ipv4') - 0.1, T(560, 320, 'IPv4', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }));
    g += E(t, W('43'), T(560, 470, '≈ 4,3 miliardi', { f: 'pop', size: 76, fill: C.ink, a: 'middle' }));
    g += E(t, W('43') + 0.3, T(560, 530, 'di indirizzi', { f: 'popm', size: 40, fill: C.ink, a: 'middle' }));
    g += E(t, W('esauriti'), T(560, 650, 'esauriti nel 2011', { f: 'serif', size: 60, fill: C.ink, a: 'middle', it: true }));
    g += E(t, W('passa') - 0.1, arrow(890, 420, 1040, 420, C.ink, 6, 26), { dy: 0 });
    g += E(t, W('ipv6') - 0.1, T(1360, 320, 'IPv6', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }));
    g += E(t, W('128'), T(1360, 470, '128 bit', { f: 'pop', size: 76, fill: C.ink, a: 'middle' }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('passa'), 'Si passa a IPv6', 'IPv6', true);
  } }) });

// 5 — i dati diventano pacchetti
scene('pacchetti', { make: (W) => ({
  capAt: W('pacchetti'),
  render(t) {
    const n = 5, pw = 230, ph = 130, y = 470;
    const cut = eo((t - W('divisi')) / 0.5), sep = eio((t - W('pacchetti') + 0.1) / 0.8), gap = 50 * sep;
    const x0 = 960 - (n * pw + (n - 1) * gap) / 2;
    let s = E(t, -0.4, lbl(960 - (n * pw) / 2, 360, 'DATI', { a: 'start' }), { dy: 0 });
    let body = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + i * (pw + gap);
      const r = sep > 0.02 ? 10 : 0;
      body += `<rect x="${x}" y="${y - ph / 2}" width="${pw}" height="${ph}" rx="${r}" fill="${C.fillD2}" stroke="${sep > 0.02 ? C.line : 'none'}" stroke-width="3.5"/>`;
      for (let j = 0; j < 3; j++) body += `<line x1="${x + 22}" y1="${y - 22 + j * 26 + (sep * 18)}" x2="${x + pw - 22 - (j === 2 ? 50 : 0)}" y2="${y - 22 + j * 26 + sep * 18}" stroke="${C.line}" stroke-width="3" stroke-linecap="round" opacity="${(0.5 * (1 - sep * 0.6)).toFixed(2)}"/>`;
      if (sep > 0) body += `<g opacity="${sep.toFixed(3)}"><line x1="${x}" y1="${y - ph / 2 + 40}" x2="${x + pw}" y2="${y - ph / 2 + 40}" stroke="${C.line}" stroke-width="2.5"/>` + T(x + pw / 2, y - ph / 2 + 30, '#' + (i + 1), { f: 'mono', size: 26, a: 'middle', w: 700 }) + '</g>';
    }
    if (sep <= 0.02) body += `<rect x="${x0}" y="${y - ph / 2}" width="${n * pw}" height="${ph}" rx="10" fill="none" stroke="${C.line}" stroke-width="3.5"/>`;
    if (cut > 0 && sep < 1) for (let i = 1; i < n; i++) { const x = x0 + i * pw + (i - 0.5) * gap; body += `<line x1="${x}" y1="${y - ph / 2 - 26}" x2="${x}" y2="${lerp(y - ph / 2 - 26, y + ph / 2 + 26, cut)}" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8" opacity="${(1 - sep).toFixed(3)}"/>`; }
    s += E(t, -0.4, body, { dy: 0 });
    s += E(t, W('pacchetti') + 0.6, T(960 + (n * pw) / 2 + 4 * 50, 362, '5 PACCHETTI · ESEMPIO', { f: 'mono', size: 26, a: 'end', ls: 3, w: 600 }));
    const xa = x0, xb = x0 + pw;
    s += E(t, W('pochi') - 0.1, `<line x1="${xa}" y1="${y + 110}" x2="${xb}" y2="${y + 110}" stroke="${C.coral}" stroke-width="4"/><line x1="${xa}" y1="${y + 94}" x2="${xa}" y2="${y + 126}" stroke="${C.coral}" stroke-width="4"/><line x1="${xb}" y1="${y + 94}" x2="${xb}" y2="${y + 126}" stroke="${C.coral}" stroke-width="4"/>` +
      T(xa, y + 172, 'un pacchetto: da pochi byte', { f: 'mono', size: 30, fill: C.coral, w: 600 }));
    s += E(t, W('1500byte') - 0.05, T(xa, y + 216, 'fino a 1.500 byte', { f: 'mono', size: 30, fill: C.coral, w: 600 }));
    return s + caption(t, W('pacchetti'), 'Dati in pacchetti', '');
  } }) });

// 6 — cosa porta un pacchetto
scene('etichetta', { make: (W) => ({
  capAt: W('indirizzi'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(160, 170, 1600, 640, { rot: 0.6 }), { dy: 0 });
    g += E(t, -0.2, T(250, 260, 'UN PACCHETTO', { f: 'mono', size: 30, fill: C.ink, ls: 4, w: 700 }) + T(1670, 260, 'VALORI DI ESEMPIO', { f: 'mono', size: 26, fill: C.ink, ls: 3, a: 'end', w: 600 }));
    const y0 = 400, h = 230, F = [[250, 330, 'MITTENTE', '198.51.100.10', 'mittente'], [580, 350, 'DESTINATARIO', '203.0.113.5', 'destinatario'], [930, 250, 'N° D\'ORDINE', '3', 'tcp'], [1180, 490, 'DATI', null, 'dati']];
    g += E(t, -0.3, `<rect x="250" y="${y0}" width="1420" height="${h}" rx="16" fill="${C.ivory}" stroke="${C.ink}" stroke-width="4"/>`, { dy: 0 });
    // chi aggiunge cosa: IP sopra gli indirizzi, TCP sopra il numero d'ordine
    const brk = (xa, xb, lab) => `<path d="M${xa + 10},${y0 - 22} L${xa + 10},${y0 - 38} L${xb - 10},${y0 - 38} L${xb - 10},${y0 - 22}" fill="none" stroke="${C.ink}" stroke-width="3"/>` + T((xa + xb) / 2, y0 - 54, lab, { f: 'pop', size: 40, fill: C.ink, a: 'middle' });
    g += E(t, W('ip') - 0.1, brk(250, 930, 'IP'));
    g += E(t, W('tcp') - 0.1, brk(930, 1180, 'TCP'));
    F.forEach(([x, w, lab, val, key], i) => {
      let f = '';
      if (i > 0) f += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + h}" stroke="${C.ink}" stroke-width="3"/>`;
      f += T(x + w / 2, y0 + 62, lab, { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 2, w: 700 });
      if (val) f += T(x + w / 2, y0 + 160, val, { f: key === 'tcp' ? 'pop' : 'mono', size: key === 'tcp' ? 84 : 34, fill: C.ink, a: 'middle', w: key === 'tcp' ? 800 : 600 });
      else for (let j = 0; j < 3; j++) f += `<line x1="${x + 40}" y1="${y0 + 120 + j * 32}" x2="${x + w - 40 - (j === 2 ? 120 : 0)}" y2="${y0 + 120 + j * 32}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
      if (key === 'tcp') f += `<rect x="${x + 8}" y="${y0 + 8}" width="${w - 16}" height="${h - 16}" rx="10" fill="none" stroke="${C.coral}" stroke-width="7"/>`;
      g += E(t, W(key) - 0.1, f);
    });
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('indirizzi'), 'Indirizzi, dati, numero', '', true);
  } }) });

// rete di router per la scena 7
const RX = [500, 820, 1140, 1440], RY = [420, 600, 780];
const N = (c, r) => [RX[c], RY[r]];
const SRC = [262, 600], DST = [1620, 600];
function routerNet(ink = C.line) {
  let s = '';
  const seen = new Set();
  for (let c = 0; c < 4; c++) for (let r = 0; r < 3; r++) {
    if (c < 3) for (let dr = -1; dr <= 1; dr++) { const r2 = r + dr; if (r2 < 0 || r2 > 2) continue; const [a, b] = N(c, r), [x, y] = N(c + 1, r2); s += `<line x1="${a}" y1="${b}" x2="${x}" y2="${y}" stroke="${C.lineDim}" stroke-width="3"/>`; }
    if (r < 2) { const [a, b] = N(c, r), [x, y] = N(c, r + 1); s += `<line x1="${a}" y1="${b}" x2="${x}" y2="${y}" stroke="${C.lineDim}" stroke-width="3"/>`; }
  }
  for (let r = 0; r < 3; r++) { s += `<line x1="${SRC[0]}" y1="${SRC[1]}" x2="${RX[0]}" y2="${RY[r]}" stroke="${C.lineDim}" stroke-width="3"/><line x1="${RX[3]}" y1="${RY[r]}" x2="${DST[0]}" y2="${DST[1]}" stroke="${C.lineDim}" stroke-width="3"/>`; }
  for (let c = 0; c < 4; c++) for (let r = 0; r < 3; r++) s += router(RX[c], RY[r], { ink });
  return s;
}
// 7 — percorsi diversi, arrivo in disordine
scene('percorsi', { tail: 0.75, make: (W) => ({
  capAt: W('percorsi'),
  render(t) {
    let s = '';
    const P = [[410, 590, 'PAESE A'], [730, 1230, 'PAESE B'], [1350, 1530, 'PAESE C']];
    P.forEach(([a, b, l], i) => s += E(t, W('paesi') + i * 0.15, `<rect x="${a}" y="${310}" width="${b - a}" height="${520}" rx="26" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="3 11" stroke-linecap="round"/>` + lbl((a + b) / 2, 866, l, { size: 24 })));
    s += E(t, -0.4, routerNet() + laptop(160, 640, 0.75) + desktop(1720, 650, 0.75) + lbl(160, 712, 'MITTENTE', { size: 24 }) + lbl(1720, 712, 'DESTINATARIO', { size: 24 }), { dy: 0 });
    const paths = {
      1: [SRC, N(0, 0), N(1, 0), N(2, 0), N(3, 0), DST],
      2: [SRC, N(0, 1), N(1, 1), N(2, 1), N(3, 1), DST],
      3: [SRC, N(0, 2), N(1, 2), N(2, 1), N(3, 2), DST],
      4: [SRC, N(0, 0), N(1, 1), N(2, 0), N(3, 0), DST],
      5: [SRC, N(0, 2), N(1, 1), N(2, 2), N(3, 1), DST] };
    const dur = { 1: 1.9, 2: 1.2, 3: 2.9, 4: 1.9, 5: 1.7 }, t0 = W('possono'), GAP = 0.45;
    const arr = [1, 2, 3, 4, 5].map(i => [i, t0 + (i - 1) * GAP + dur[i]]).sort((a, b) => a[1] - b[1]);
    const slot = {}; arr.forEach(([i], k) => slot[i] = k);
    const TX = k => 1370 + k * 100, TY = 205, OFF = -62; // i pacchetti viaggiano sopra i collegamenti, fuori dai nodi
    s += E(t, t0, T(1310, TY + 10, 'ORDINE DI ARRIVO', { f: 'mono', size: 24, a: 'end', ls: 3, w: 600 }) + [0, 1, 2, 3, 4].map(k => `<rect x="${TX(k) - 42}" y="${TY - 32}" width="84" height="64" rx="10" fill="none" stroke="${C.lineDim}" stroke-width="2" stroke-dasharray="4 6"/>`).join(''));
    for (let i = 1; i <= 5; i++) {
      const ts = t0 + (i - 1) * GAP, te = ts + dur[i];
      if (t < ts) continue;
      let x, y;
      if (t < te) { [x, y] = along(paths[i], (t - ts) / dur[i]); y += OFF; }
      else { const q = eio((t - te) / 0.4); x = lerp(DST[0], TX(slot[i]), q); y = lerp(DST[1] + OFF, TY, q); }
      s += packet(x, y, i, { w: 76, h: 56, ns: 26 });
    }
    s += E(t, W('disordine'), T(1570, 300, 'in disordine', { f: 'serif', size: 54, a: 'middle', it: true }));
    return s + caption(t, W('percorsi'), 'Percorsi diversi', 'diversi');
  } }) });

// 8 — TCP rimette in ordine
scene('ricompone', { tail: 0.8, make: (W) => ({
  capAt: W("nell'ordine"),
  render(t) {
    const arrived = [2, 1, 4, 5, 3], X = k => 960 + (k - 2) * 200, y = 500;
    let s = E(t, W('tcp') - 0.1, pillTag(960, 300, 'TCP', C.line, C.bg, { a: 'middle', size: 40, w: 700 }));
    s += E(t, -0.4, lbl(960, 380, 'ARRIVATI', { size: 26 }), { dy: 0 });
    const p = eio((t - W('ricompone')) / 1.2);
    arrived.forEach((n, k) => {
      const k2 = n - 1, moving = k !== k2;
      const x = lerp(X(k), X(k2), p), yy = y - (moving ? Math.sin(Math.PI * p) * (60 + 30 * Math.abs(k - k2)) * (k < k2 ? 1 : -1) : 0);
      s += E(t, -0.4, packet(x, yy, n, { w: 150, h: 112, ns: 46 }), { dy: 0 });
    });
    s += E(t, W('corretto'), `<path d="M${X(0) - 90},${y + 80} L${X(0) - 90},${y + 96} L${X(4) + 90},${y + 96} L${X(4) + 90},${y + 80}" fill="none" stroke="${C.line}" stroke-width="3"/>` + lbl(960, y + 140, 'MESSAGGIO RICOMPOSTO', { size: 26 }));
    s += E(t, W('numero') - 0.1, arrow(X(0) - 200, y - 150, X(0) - 40, y + 10, C.coral, 5, 22) + T(X(0) - 210, y - 166, 'N° D\'ORDINE', { f: 'mono', size: 30, fill: C.coral, a: 'middle', ls: 3, w: 700 }));
    return s + caption(t, W("nell'ordine"), 'Di nuovo in ordine', '');
  } }) });

// 9 — pacchetto perso e ritrasmesso
scene('perso', { tail: 1.2, make: (W) => ({
  capAt: W('perde'),
  render(t) {
    const LY = 470, xa = 330, xb = 1590, TYy = 760, SX = k => 960 + (k - 2) * 160, TT = 1.8;
    let s = E(t, -0.4, laptop(220, 520, 0.85) + desktop(1700, 530, 0.85) + lbl(220, 590, 'MITTENTE', { size: 24 }) + lbl(1700, 590, 'DESTINATARIO', { size: 24 }) +
      `<line x1="${xa}" y1="${LY}" x2="${xb}" y2="${LY}" stroke="${C.lineDim}" stroke-width="4"/>`, { dy: 0 });
    s += E(t, -0.4, lbl(SX(0) - 110, TYy + 10, 'ARRIVATI', { size: 24, a: 'end' }), { dy: 0 });
    const filled = W('mittente') + 0.75 + 0.3, tl = W('perde');
    // posti del vassoio
    for (let k = 0; k < 5; k++) if (k !== 2 || t < filled) s += packet(SX(k), TYy, null, { w: 120, h: 88, empty: true, dash: '8 8', fill: 'none', stroke: C.lineDim, sw: 2.5 });
    // i 5 pacchetti partono insieme (sfalsati); il 3 cade per strada
    for (let n = 1; n <= 5; n++) {
      const ts = -0.3 + (n - 1) * 0.35;
      if (t < ts) continue;
      if (n === 3) {
        if (t >= tl + 1.6) continue;
        const x = lerp(xa, xb, clamp((Math.min(t, tl) - ts) / TT)), fall = clamp((t - tl) / 1.6);
        const op = fall < 0.6 ? 1 : 1 - (fall - 0.6) / 0.4;
        s += `<g opacity="${op.toFixed(3)}">${packet(x, LY + eo(fall) * 130, 3, { w: 90, h: 66, ns: 30, dash: fall > 0 ? '8 6' : null })}</g>`;
        continue;
      }
      const q = (t - ts) / TT, d = eio((t - ts - TT) / 0.35);
      const x = d > 0 ? lerp(xb, SX(n - 1), d) : lerp(xa, xb, q), y = d > 0 ? lerp(LY, TYy, d) : LY;
      const w = d > 0 ? lerp(90, 120, d) : 90, h = d > 0 ? lerp(66, 88, d) : 66;
      s += packet(x, y, n, { w, h, ns: Math.round(h * 0.41) });
    }
    if (t < filled) s += E(t, W('accorge') - 0.1, T(SX(2), TYy + 20, '?', { f: 'pop', size: 60, a: 'middle' }) + lbl(SX(2), TYy - 70, 'MI MANCA IL 3', { size: 26 }));
    const rq = eio((t - W('ritrasmetterlo') + 0.2) / 1.0);
    if (rq > 0) { const x = lerp(1500, 600, rq); s += E(t, W('ritrasmetterlo') - 0.2, pillTag(x, LY - 70, 'RITRASMETTI IL 3', C.coral, C.bg, { a: 'middle', size: 30, stroke: C.coral, sw: 3.5, w: 700 }), { dy: 0 }); }
    const t1 = W('mittente');
    if (t > t1) {
      const q = eio((t - t1) / 0.75), d = eio((t - t1 - 0.75) / 0.3);
      const x = d > 0 ? lerp(xb, SX(2), d) : lerp(xa, xb, q), y = d > 0 ? lerp(LY, TYy, d) : LY;
      const w = d > 0 ? lerp(90, 120, d) : 90, h = d > 0 ? lerp(66, 88, d) : 66;
      s += packet(x, y, 3, { w, h, ns: Math.round(h * 0.41) });
    }
    return s + caption(t, W('perde'), 'Perso? Si rimanda', '');
  } }) });

// 10 — un'email da 2 MB
scene('email', { make: (W) => ({
  capAt: W('millisecondi'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(200, 180, 1520, 620, { rot: 0.7 }), { dy: 0 });
    const ex = 450, ey = 430;
    g += E(t, -0.3, `<rect x="${ex - 130}" y="${ey - 85}" width="260" height="170" rx="14" fill="${C.ivory}" stroke="${C.ink}" stroke-width="5"/><path d="M${ex - 130},${ey - 85} L${ex},${ey + 15} L${ex + 130},${ey - 85}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`, { dy: 0 });
    g += E(t, W('2'), T(ex, ey + 200, '2 MB', { f: 'pop', size: 84, fill: C.ink, a: 'middle' }));
    g += E(t, W('diventa') - 0.1, arrow(640, 430, 790, 430, C.ink, 6, 26), { dy: 0 });
    // griglia schematica di pacchetti
    const cols = 12, rows = 5;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c, op = c >= cols - 2 ? (c === cols - 1 ? 0.3 : 0.6) : 1;
      g += E(t, W('diventa') + i * 0.012, `<rect x="${850 + c * 62}" y="${300 + r * 50}" width="48" height="36" rx="5" fill="${C.ivory}" stroke="${C.ink}" stroke-width="3" opacity="${op}"/>`, { dy: 6, d: 0.3 });
    }
    g += E(t, W('diventa') + 0.8, T(1620, 470, '…', { f: 'pop', size: 60, fill: C.ink }));
    g += E(t, W('1400') - 0.05, T(1210, 660, '≈ 1.400 pacchetti', { f: 'pop', size: 76, fill: C.ink, a: 'middle' }));
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('millisecondi'), 'In millisecondi', 'millisecondi', true);
  } }) });

// gamepad generico
function pad(x, y, ink) {
  return `<path d="M${x - 80},${y - 40} L${x + 80},${y - 40} Q${x + 120},${y - 40} ${x + 128},${y + 10} L${x + 136},${y + 40} Q${x + 140},${y + 70} ${x + 108},${y + 64} L${x + 60},${y + 30} L${x - 60},${y + 30} L${x - 108},${y + 64} Q${x - 140},${y + 70} ${x - 136},${y + 40} L${x - 128},${y + 10} Q${x - 120},${y - 40} ${x - 80},${y - 40} z" fill="${C.fillD}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M${x - 78},${y - 10} h28 M${x - 64},${y - 24} v28" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><circle cx="${x + 62}" cy="${y - 16}" r="8" fill="none" stroke="${ink}" stroke-width="3"/><circle cx="${x + 82}" cy="${y + 2}" r="8" fill="none" stroke="${ink}" stroke-width="3"/>`;
}
// 11 — TCP contro UDP: stessa velocità; TCP aspetta la conferma, UDP no
function ack(x, y, ink) {
  return `<circle cx="${x}" cy="${y}" r="17" fill="${C.bg}" stroke="${ink}" stroke-width="3"/><path d="M${x - 8},${y} L${x - 2},${y + 7} L${x + 9},${y - 7}" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
scene('udp', { make: (W) => ({
  capAt: W('affidabile'),
  minD: W('non') + 1.75,
  render(t) {
    const xa = 360, xb = 1460, TT = 1.5, x1 = xa + 60, x2 = xb - 60;
    const lane = (y, name, t0) => E(t, t0, T(96, y + 22, name, { f: 'pop', size: 64 }) +
      `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke="${C.lineDim}" stroke-width="4"/>` + router(xa - 40, y + 4) + router(xb + 50, y + 4), { dy: 0 });
    const Y1 = 330, Y2 = 620;
    let s = lane(Y1, 'TCP', -0.4);
    // TCP: invia, aspetta la conferma di ritorno, poi invia il successivo
    for (let i = 0; i < 6; i++) {
      const ts = -0.2 + i * 2 * TT, q = (t - ts) / TT;
      if (q > 0 && q < 1) s += packet(lerp(x1, x2, q), Y1, i + 1, { w: 74, h: 54, ns: 24 });
      const qa = (t - ts - TT) / TT;
      if (qa > 0 && qa < 1) s += ack(lerp(x2, x1, qa), Y1 + 42, C.line);
    }
    s += E(t, 0.2, T(xb, Y1 - 50, '✓ = CONFERMA', { f: 'mono', size: 24, a: 'end', ls: 2, w: 600 }));
    s += E(t, W('affidabile'), T(xa + 20, Y1 - 50, 'affidabile, ma con un po\' di ritardo', { f: 'serif', size: 50, it: true }));
    s += lane(Y2, 'UDP', W('udp') - 0.1);
    // UDP: stessa velocità, pacchetti uno dopo l'altro senza aspettare; uno si perde su "non garantisce"
    const u0 = W('udp'), GAPU = 0.42, tl = W('non');
    let lost = -1, best = 9;
    for (let i = 0; i < 30; i++) { const q = (tl - u0 - i * GAPU) / TT; if (q > 0.45 && q < 0.85 && Math.abs(q - 0.6) < best) { best = Math.abs(q - 0.6); lost = i; } }
    for (let i = 0; i < 30; i++) {
      const ts = u0 + i * GAPU, q = (t - ts) / TT; if (q <= 0) continue;
      if (i === lost && t >= tl) {
        const xl = lerp(x1, x2, (tl - ts) / TT), fall = clamp((t - tl) / 1.6);
        const op = fall < 0.6 ? 1 : 1 - (fall - 0.6) / 0.4;
        if (fall < 1) s += `<g opacity="${op.toFixed(3)}">${packet(xl, Y2 + eio(fall) * 130, null, { w: 74, h: 54, dash: '6 5' })}</g>`;
        if (q < 1) s += packet(lerp(x1, x2, q), Y2, null, { w: 74, h: 54, empty: true, dash: '6 6', fill: 'none' });
        s += E(t, tl + 0.2, T(xl, Y2 + 200, 'perso: nessuno lo rimanda', { f: 'serif', size: 46, it: true, a: 'middle' }));
        continue;
      }
      if (q >= 1) continue;
      s += packet(lerp(x1, x2, q), Y2, null, { w: 74, h: 54 });
    }
    s += E(t, W('gaming') - 0.1, pad(1720, 475, C.line) + lbl(1720, 405, 'GAMING', { size: 24 }));
    s += E(t, W('veloce') - 0.1, T(xa + 20, Y2 - 50, 'più veloce,', { f: 'serif', size: 50, it: true }));
    s += E(t, W('garantisce') - 0.1, T(xa + 20 + tw('più veloce, ', 'serif', 50, true), Y2 - 50, 'ma la consegna non è garantita', { f: 'serif', size: 50, it: true }));
    return s + caption(t, W('affidabile'), 'Affidabile o veloce?', 'veloce');
  } }) });

// 12 — chiusura
scene('finale', { L: 0.5, tail: 3.4, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 450, 'TCP/IP', { f: 'pop', size: 180, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('la') - 0.1, 960, 580, 'la lingua comune di Internet', { f: 'serif', size: 72, fill: C.ink, a: 'middle', it: true, key: 'lingua' });
    s += E(t, W('internet') + 0.4, `<line x1="760" y1="660" x2="1160" y2="660" stroke="${C.ink}" stroke-width="3"/>` + T(960, 720, 'PROFTECNOLOGIA · MC COM-3-01', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
