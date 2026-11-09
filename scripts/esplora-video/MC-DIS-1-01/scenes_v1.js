// Righello e compasso — MC-DIS-1-01 §"Le costruzioni geometriche fondamentali". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.4);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.hold != null) D = Math.max(D, def.hold + 1.6);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });

// ---- geometria esatta (angoli in gradi, verso antiorario a schermo: y cresce verso il basso) ----
const RAD = Math.PI / 180;
const pol = (c, r, a) => [c[0] + r * Math.cos(a * RAD), c[1] - r * Math.sin(a * RAD)];
const ang = (c, p) => Math.atan2(-(p[1] - c[1]), p[0] - c[0]) / RAD;
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
// intersezioni di due circonferenze (c1,r1) (c2,r2)
function inter(c1, r1, c2, r2) {
  const d = dist(c1, c2), a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(r1 * r1 - a * a);
  const ux = (c2[0] - c1[0]) / d, uy = (c2[1] - c1[1]) / d, mx = c1[0] + a * ux, my = c1[1] + a * uy;
  return [[mx - h * uy, my + h * ux], [mx + h * uy, my - h * ux]];
}
function arcPts(c, r, a0, a1) { const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 1.5)); const p = []; for (let i = 0; i <= n; i++) p.push(pol(c, r, lerp(a0, a1, i / n))); return p; }
const poly = (pts, st, sw = 4, o = '') => `<polyline points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${o}/>`;
const seg = (p, q, st, sw = 4, o = '') => `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${st}" stroke-width="${sw}" stroke-linecap="round" ${o}/>`;
// arco che si disegna fra t0 e t0+d (da a0 verso a1)
function drawArc(t, t0, d, c, r, a0, a1, st, sw = 4) { const p = eio((t - t0) / d); if (p <= 0) return ''; return poly(arcPts(c, r, a0, lerp(a0, a1, p)), st, sw); }
const dot = (p, st, r = 9) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" fill="${st}"/>`;
// etichetta di punto: lettera + pedice opzionale
function ptLab(p, s, dx, dy, o = {}) {
  const x = p[0] + dx, y = p[1] + dy, size = o.size || 44, fill = o.fill || C.line;
  const sub = o.sub ? `<tspan font-size="${Math.round(size * 0.62)}" dy="${Math.round(size * 0.22)}">${o.sub}</tspan>` : '';
  return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="${F.serif}" font-style="italic" font-size="${size}" fill="${fill}" text-anchor="middle">${s}${sub}</text>`;
}
// compasso: punta in N, mina in P; cerniera sul lato sinistro del vettore N→P
function compass(N, P, st = C.line, op = 1) {
  if (op <= 0) return '';
  const d = Math.max(dist(N, P), 1), Lg = Math.max(d * 0.66, 170), h = Math.sqrt(Lg * Lg - d * d / 4);
  const ux = (P[0] - N[0]) / d, uy = (P[1] - N[1]) / d, nx = uy, ny = -ux;
  const H = [(N[0] + P[0]) / 2 + nx * h, (N[1] + P[1]) / 2 + ny * h];
  const Hk = [H[0] + nx * 46, H[1] + ny * 46];
  const ldir = (A) => { const l = dist(H, A); return [(A[0] - H[0]) / l, (A[1] - H[1]) / l]; };
  const [px, py] = ldir(P), pb = [P[0] - px * 34, P[1] - py * 34];
  const [qx, qy] = ldir(N), nb = [N[0] - qx * 22, N[1] - qy * 22];
  let s = seg(H, nb, st, 7) + seg(nb, N, st, 2.5);
  s += seg(H, pb, st, 7) + `<path d="M${(pb[0] - py * 7).toFixed(1)},${(pb[1] + px * 7).toFixed(1)} L${P[0].toFixed(1)},${P[1].toFixed(1)} L${(pb[0] + py * 7).toFixed(1)},${(pb[1] - px * 7).toFixed(1)} z" fill="${C.bg}" stroke="${st}" stroke-width="3" stroke-linejoin="round"/>`;
  s += seg(H, Hk, st, 9) + `<circle cx="${H[0].toFixed(1)}" cy="${H[1].toFixed(1)}" r="13" fill="${C.bg}" stroke="${st}" stroke-width="4"/>`;
  return `<g opacity="${op.toFixed(3)}">${s}</g>`;
}
// righello (senza numeri) lungo la direzione a, con il bordo sul segmento da p
function ruler(p, a, len, st, fill, side = 1) {
  const u = [Math.cos(a * RAD), -Math.sin(a * RAD)], n = [-u[1] * side, u[0] * side]; // n: lato del corpo
  const o = [p[0] - u[0] * 40, p[1] - u[1] * 40], w = 64;
  const q = [o, [o[0] + u[0] * len, o[1] + u[1] * len], [o[0] + u[0] * len + n[0] * w, o[1] + u[1] * len + n[1] * w], [o[0] + n[0] * w, o[1] + n[1] * w]];
  let s = `<polygon points="${q.map(x => x[0].toFixed(1) + ',' + x[1].toFixed(1)).join(' ')}" fill="${fill}" stroke="${st}" stroke-width="3" stroke-linejoin="round"/>`;
  for (let i = 1; i < len / 30; i++) { const b = [o[0] + u[0] * i * 30, o[1] + u[1] * i * 30], l = i % 5 === 0 ? 22 : 12; s += seg(b, [b[0] + n[0] * l, b[1] + n[1] * l], st, 2); }
  return s;
}
const passo = (t, t0, s, x = 1210, y = 250) => E(t, t0, pillTag(x, y, s, C.line, C.bg));

// ===== figura della bisettrice (scuro) =====
const BO = [600, 790], BA1 = 0, BA2 = 50, BR1 = 340, BR2 = 240;
const BPA = pol(BO, BR1, BA1), BPB = pol(BO, BR1, BA2);
const BPC = inter(BPA, BR2, BPB, BR2).sort((p, q) => dist(q, BO) - dist(p, BO))[0]; // quella lontana da O
const BLB = pol(BO, 392, 57);
const BAC = ang(BPA, BPC), BBC = ang(BPB, BPC), BBIS = ang(BO, BPC);
function angleFig(t, opts = {}) {
  let s = seg(BO, pol(BO, 820, BA1), C.line, 5) + seg(BO, pol(BO, 820, BA2), C.line, 5) + dot(BO, C.line, 8) + ptLab(BO, 'O', -36, 12);
  return s;
}

// 1 — aggancio: compasso che traccia una circonferenza
scene('hook', { make: (W) => ({
  capAt: W('soli'),
  render(t) {
    const c = [1330, 470], r = 230, t0 = W('compasso'), dd = 2.2;
    let s = '';
    s += E(t, -0.3, ruler([980, 820], 0, 720, C.line, mix(C.bg, C.line, 0.08), -1), { dy: 0 });
    const p = eio((t - t0) / dd), a = -90 + 360 * p;
    s += E(t, -0.3, dot(c, C.line, 7), { dy: 0 });
    if (p > 0) s += poly(arcPts(c, r, -90, a), C.coral, 5);
    s += E(t, -0.3, compass(c, pol(c, r, Math.max(a, -90))), { dy: 0 });
    s += words(t, W('figure'), 96, 400, 'Figure', { f: 'pop', size: 120 });
    s += words(t, W('precise'), 96, 530, 'precise', { f: 'pop', size: 120 });
    s += E(t, W('senza'), IT(100, 640, 'senza misurare gli angoli', { size: 54 }));
    return s + caption(t, W('soli'), 'Solo righello e compasso', '');
  } }) });

// 2 — Euclide (chiaro)
scene('euclide', { make: (W) => ({
  capAt: W('euclide'), hold: W('quarto'),
  render(t) {
    const I = C.ink;
    let s = lightBg();
    s += E(t, -0.4, card(240, 160, 1440, 660, { rot: -0.6 }), { dy: 0 });
    s += E(t, W('procedure') - 0.1, pillTag(330, 290, 'PROCEDURE PASSO-PASSO', I, C.cream));
    s += E(t, W('euclide'), T(330, 470, 'Euclide', { f: 'pop', size: 140, fill: I }));
    s += E(t, W('quarto'), T(336, 580, 'IV secolo a.C.', { f: 'pop', size: 76, fill: C.coral }));
    // passi numerati a destra
    for (let i = 0; i < 4; i++) {
      const y = 300 + i * 120, x = 1380;
      s += E(t, W('procedure') + i * 0.18, `<circle cx="${x}" cy="${y}" r="40" fill="${C.cream}" stroke="${I}" stroke-width="3"/>` + T(x, y + 13, String(i + 1), { f: 'mono', size: 36, fill: I, a: 'middle', w: 700 }) +
        (i < 3 ? `<line x1="${x}" y1="${y + 46}" x2="${x}" y2="${y + 74}" stroke="${I}" stroke-width="3"/>` : ''), { dy: 10 });
    }
    return s + caption(t, W('euclide'), 'Le procedure di Euclide', '', true);
  } }) });

// 3 — bisettrice: il problema
scene('bis0', { make: (W) => ({
  capAt: W('divide'), hold: W('metà'),
  render(t) {
    let s = E(t, -0.4, angleFig(t), { dy: 0 });
    s += words(t, W('bisettrice'), 1200, 330, 'Bisettrice', { f: 'pop', size: 96 });
    const p = eio((t - W('divide')) / 0.8);
    if (p > 0) s += seg(BO, pol(BO, 640 * p, BBIS), C.coral, 5, 'stroke-dasharray="18 14"');
    // archetti uguali
    s += E(t, W('metà'), poly(arcPts(BO, 150, BA1 + 2, BBIS - 2), C.line, 3) + poly(arcPts(BO, 150, BBIS + 2, BA2 - 2), C.line, 3) +
      seg(pol(BO, 138, BBIS / 2), pol(BO, 162, BBIS / 2), C.line, 3) + seg(pol(BO, 138, BBIS + (BA2 - BBIS) / 2), pol(BO, 162, BBIS + (BA2 - BBIS) / 2), C.line, 3), { dy: 0 });
    s += E(t, W('metà'), IT(1204, 410, 'due angoli uguali', { size: 52 }));
    return s + caption(t, W('divide'), "Divide l'angolo a metà", '');
  } }) });

// 4 — passo 1: arco da O
scene('bis1', { make: (W) => ({
  capAt: W('traccia'), hold: W('b'),
  render(t) {
    let s = angleFig(t);
    s += passo(t, -0.2, 'PASSO 1');
    s += E(t, W('vertice'), IT(1210, 340, 'punta in O,', { size: 52 }) + IT(1210, 404, 'apertura qualsiasi', { size: 52 }));
    const t0 = W('traccia'), dd = 1.3, a0 = -10, a1 = 58, p = eio((t - t0) / dd), a = lerp(a0, a1, clamp(p));
    if (p > 0) s += poly(arcPts(BO, BR1, a0, a), C.coral, 5);
    const op = t < W('compasso') ? 0 : t < t0 + dd + 0.3 ? eo((t - W('compasso')) / 0.3) : 1 - eo((t - t0 - dd - 0.3) / 0.4);
    s += compass(BO, pol(BO, BR1, p > 0 ? a : a0), C.line, op);
    if (a >= BA1) s += dot(BPA, C.line); if (a >= BA2) s += dot(BPB, C.line);
    s += E(t, W('a'), ptLab(BPA, 'A', 30, 52)); s += E(t, W('b'), ptLab(BLB, 'B', 0, 15));
    return s + caption(t, W('traccia'), 'Un arco da O', '');
  } }) });

// 5 — passi 2 e 3: due archi uguali da A e da B → C
scene('bis2', { make: (W) => ({
  capAt: W('stessa'), hold: W('c'),
  render(t) {
    let s = angleFig(t) + poly(arcPts(BO, BR1, -10, 58), C.line, 3) + dot(BPA, C.line) + dot(BPB, C.line) + ptLab(BPA, 'A', 30, 52) + ptLab(BLB, 'B', 0, 15);
    s += t < W('stessa') ? passo(t, -0.2, 'PASSO 2') : passo(t, W('stessa'), 'PASSO 3');
    // AB tratteggiato e metà
    const m = [(BPA[0] + BPB[0]) / 2, (BPA[1] + BPB[1]) / 2];
    s += E(t, W('metà'), seg(BPA, BPB, C.line, 2.5, 'stroke-dasharray="6 9"') + dot(m, C.line, 6), { dy: 0 });
    s += E(t, W('maggiore'), IT(1210, 340, 'apertura maggiore', { size: 52 }) + IT(1210, 404, 'di metà AB', { size: 52 }));
    const sw = 26, tA = W('traccia'), tB = W('altro'), dd = 0.9;
    s += drawArc(t, tA, dd, BPA, BR2, BAC - sw, BAC + sw, C.line, 4);
    s += drawArc(t, tB, dd, BPB, BR2, BBC + sw, BBC - sw, C.line, 4);
    // compasso: prima in A, poi in B
    if (t > W('punta') && t < tA + dd + 0.4) { const p = eio((t - tA) / dd); s += compass(BPA, pol(BPA, BR2, BAC - sw + 2 * sw * clamp(p)), C.line, eo((t - W('punta')) / 0.3)); }
    if (t > W('punta', 1) && t < tB + dd + 0.5) { const p = eio((t - tB) / dd); s += compass(BPB, pol(BPB, BR2, BBC + sw - 2 * sw * clamp(p)), C.line, t < tB + dd + 0.1 ? eo((t - W('punta', 1)) / 0.3) : 1 - eo((t - tB - dd - 0.1) / 0.4)); }
    s += E(t, W('incrociano'), dot(BPC, C.coral, 12), { dy: 0 });
    s += E(t, W('c'), ptLab(BPC, 'C', -24, -33, { fill: C.coral, size: 52 }));
    return s + caption(t, W('stessa'), 'Due archi: punto C', '');
  } }) });

// 6 — passo 4: unisci O e C
scene('bis3', { make: (W) => ({
  capAt: W('ecco'), hold: W('bisettrice'),
  render(t) {
    let s = angleFig(t) + poly(arcPts(BO, BR1, -10, 58), C.line, 3) + poly(arcPts(BPA, BR2, BAC - 26, BAC + 26), C.line, 3) + poly(arcPts(BPB, BR2, BBC + 26, BBC - 26), C.line, 3);
    s += dot(BPA, C.line) + dot(BPB, C.line) + ptLab(BPA, 'A', 30, 52) + ptLab(BLB, 'B', 0, 15) + ptLab(BPC, 'C', -24, -33, { size: 52 });
    s += passo(t, -0.2, 'PASSO 4');
    const rOp = t < W('righello') + 1.2 ? eo((t - W('unisci')) / 0.4) : 1 - eo((t - W('righello') - 1.2) / 0.4);
    if (rOp > 0) s += `<g opacity="${rOp.toFixed(3)}">${ruler(BO, BBIS, 740, C.line, mix(C.bg, C.line, 0.10), 1)}</g>`;
    const p = eio((t - W('c')) / 0.9);
    if (p > 0) s += seg(BO, pol(BO, 660 * p, BBIS), C.coral, 6);
    s += dot(BPC, C.line, 9) + dot(BO, C.line, 8);
    s += E(t, W('bisettrice'), lbl(1210, 336, 'BISETTRICE', { a: 'start', size: 32 }) + IT(1210, 404, 'angolo diviso a metà', { size: 52 }));
    return s + caption(t, W('ecco'), 'Ecco la bisettrice', '');
  } }) });

// 7 — perché funziona (chiaro): tre lati uguali
scene('bisw', { make: (W) => ({
  capAt: W('tre'), hold: W('angoli'),
  render(t) {
    const I = C.ink, O = [400, 720], R1 = 260, R2 = 185;
    const A = pol(O, R1, 0), B = pol(O, R1, 50), Cc = inter(A, R2, B, R2).sort((p, q) => dist(q, O) - dist(p, O))[0];
    const tick = (p, q, n) => { const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], l = dist(p, q), u = [(q[0] - p[0]) / l, (q[1] - p[1]) / l], nn = [-u[1], u[0]]; let r = ''; for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 9, c = [m[0] + u[0] * o, m[1] + u[1] * o]; r += seg([c[0] - nn[0] * 13, c[1] - nn[1] * 13], [c[0] + nn[0] * 13, c[1] + nn[1] * 13], I, 3); } return r; };
    let s = lightBg() + E(t, -0.4, card(200, 150, 1520, 680, { rot: -0.5 }), { dy: 0 });
    let f = seg(O, pol(O, 520, 0), I, 3) + seg(O, pol(O, 520, 50), I, 3);
    f += `<polygon points="${[O, A, Cc].map(p => p.join(',')).join(' ')}" fill="${mix(C.cream, I, 0.06)}" stroke="${I}" stroke-width="4" stroke-linejoin="round"/>`;
    f += `<polygon points="${[O, B, Cc].map(p => p.join(',')).join(' ')}" fill="${mix(C.cream, I, 0.12)}" stroke="${I}" stroke-width="4" stroke-linejoin="round"/>`;
    f += ptLab(O, 'O', -34, 14, { fill: I }) + ptLab(A, 'A', 22, 50, { fill: I }) + ptLab(B, 'B', -40, -6, { fill: I }) + ptLab(Cc, 'C', 22, -22, { fill: I });
    s += E(t, -0.3, f, { dy: 0 });
    s += E(t, W('tre'), tick(O, A, 1) + tick(O, B, 1), { dy: 0, blur: 4 });
    s += E(t, W('lati'), tick(A, Cc, 2) + tick(B, Cc, 2), { dy: 0, blur: 4 });
    s += E(t, W('uguali'), tick(O, Cc, 3), { dy: 0, blur: 4 });
    const x = 1000;
    s += E(t, W('funziona'), pillTag(x, 250, 'PERCHÉ FUNZIONA?', I, C.cream));
    s += E(t, W('tre'), T(x, 330, 'OA = OB', { f: 'pop', size: 64, fill: I }));
    s += E(t, W('lati'), T(x, 430, 'AC = BC', { f: 'pop', size: 64, fill: I }));
    s += E(t, W('uguali'), T(x, 530, 'OC in comune', { f: 'pop', size: 64, fill: I }));
    s += E(t, W('angoli'), `<line x1="${x}" y1="580" x2="${x + 620}" y2="580" stroke="${I}" stroke-width="3"/>` + T(x, 670, 'angoli in O uguali', { f: 'pop', size: 60, fill: C.coral }));
    s += E(t, W('angoli'), poly(arcPts(O, 90, 2, 23), I, 3) + poly(arcPts(O, 100, 27, 48), I, 3), { dy: 0 });
    return s + caption(t, W('tre'), 'Tre lati uguali', '', true);
  } }) });

// ===== esagono (scuro) =====
const HO = [700, 500], HR = 290, HA = [180, 120, 60, 0, -60, -120]; // vertici A1..A6 (in senso orario)
const HP = [pol(HO, HR, 180)];
for (let k = 1; k < 6; k++) { // ogni vertice nuovo = intersezione fra circonferenza e arco di raggio HR centrato nel precedente
  const c = inter(HO, HR, HP[k - 1], HR), want = pol(HO, HR, HA[k]);
  HP.push(c.sort((p, q) => dist(p, want) - dist(q, want))[0]);
}
// etichette dei vertici: fuori dalla circonferenza, ruotate di 30° rispetto al raggio dal lato opposto all'arco che passa per il vertice
const HLAB = HP.map((p, k) => {
  const ra = ang(HO, p); let a = ra;
  if (k > 0) { const q = HP[k - 1], tg = ang(q, p) + 90; const d = x => Math.abs(((x - tg) % 360 + 540) % 360 - 180); const e = x => Math.min(d(x), d(x + 180)); a = e(ra + 30) > e(ra - 30) ? ra + 30 : ra - 30; }
  const L = pol([0, 0], 62, a); return [L[0], L[1] + 14];
});
const hLab = (k, fill = C.line) => ptLab(HP[k], 'A', HLAB[k][0], HLAB[k][1], { sub: String(k + 1), fill });

// 8 — esagono: la circonferenza
scene('esa0', { make: (W) => ({
  capAt: W('inscritto'), hold: W('inscritto') + 1.6,
  render(t) {
    const t0 = W('inscritto'), dd = 1.6, p = eio((t - t0) / dd), a = 180 - 360 * p;
    let s = '';
    s += words(t, W("l'esagono"), 1180, 330, 'Esagono', { f: 'pop', size: 104 });
    s += words(t, W('regolare'), 1180, 440, 'regolare', { f: 'pop', size: 104 });
    s += E(t, -0.3, dot(HO, C.line, 8), { dy: 0 }) + E(t, W('inscritto'), ptLab(HO, 'O', 0, 50), { dy: 0 });
    if (p > 0) s += poly(arcPts(HO, HR, 180, a), C.coral, 5);
    const op = t < t0 + dd + 0.3 ? eo((t + 0.3) / 0.4) : 1 - eo((t - t0 - dd - 0.3) / 0.4);
    s += compass(HO, pol(HO, HR, a), C.line, op);
    return s + caption(t, W('inscritto'), 'Inscritto nella circonferenza', '');
  } }) });

// 9 — esagono: archi di raggio uguale al raggio
scene('esa1', { make: (W) => {
  const tA = W('traccia'), tS = W('successivo'), tE = W('sesto');
  const arcT = [tA, tS + 0.55, tS + 0.55 + (tE - tS - 0.55) / 3, tS + 0.55 + 2 * (tE - tS - 0.55) / 3, tE].map((x, i) => i === 0 ? x : x - 0.45);
  const dd = [1.0, 0.45, 0.45, 0.45, 0.45];
  return {
    capAt: W('stessa') + 0.1, hold: arcT[4] + dd[4] + 0.1,
    render(t) {
      let s = poly(arcPts(HO, HR, 0, 360), C.line, 4) + dot(HO, C.line, 8) + ptLab(HO, 'O', 0, 50);
      const rr = E(t, W('raggio'), seg(HO, HP[0], C.line, 3, 'stroke-dasharray="10 10"') + ptLab([(HO[0] + HP[0][0]) / 2, HO[1]], 'r', 0, -18), { dy: 0 });
      s += rr;
      // compasso: prima mostra l'apertura (O→A1), poi punta sul vertice corrente
      let k = -1; for (let i = 0; i < 5; i++) if (t >= arcT[i] - (i === 0 ? 0.8 : 0.2)) k = i;
      if (t > W('punta')) s += dot(HP[0], C.line) + E(t, W('punta'), hLab(0), { dy: 0, blur: 4 });
      for (let i = 0; i < 5; i++) {
        const c = HP[i], q = HP[i + 1], phi = ang(c, q), sw = 20, col = (i === k && t < arcT[i] + dd[i] + 0.25) ? C.coral : C.line;
        s += drawArc(t, arcT[i], dd[i], c, HR, phi + sw, phi - sw, col, 4);
        if (t >= arcT[i] + dd[i] * 0.55) s += dot(q, C.line) + E(t, arcT[i] + dd[i] * 0.55, hLab(i + 1), { dy: 0, blur: 4 });
      }
      if (t < W('punta')) { s += compass(HO, HP[0], C.line, eo((t - W('apertura')) / 0.3)); }
      else if (k >= 0 && t < arcT[4] + dd[4] + 0.4) {
        const c = HP[k], phi = ang(c, HP[k + 1]), p = eio((t - arcT[k]) / dd[k]);
        s += compass(c, pol(c, HR, phi + 20 - 40 * clamp(p)), C.line, t < arcT[4] + dd[4] ? 1 : 1 - eo((t - arcT[4] - dd[4]) / 0.4));
      } else if (t < arcT[0]) s += compass(HP[0], pol(HP[0], HR, ang(HP[0], HP[1]) + 20), C.line, 1);
      s += E(t, W('apertura'), lbl(1180, 330, 'APERTURA = RAGGIO', { a: 'start', size: 30 }));
      s += E(t, W('successivo'), IT(1180, 420, 'ogni arco trova', { size: 52 }) + IT(1180, 486, 'il vertice successivo', { size: 52 }));
      return s + caption(t, W('stessa') + 0.1, 'Apertura uguale al raggio', '');
    } };
} });

// 10 — unisci i sei punti
scene('esa2', { make: (W) => ({
  capAt: W("l'esagono"), hold: W("l'esagono"),
  render(t) {
    let s = poly(arcPts(HO, HR, 0, 360), C.line, 3) + dot(HO, C.line, 8) + ptLab(HO, 'O', 0, 50);
    for (let i = 0; i < 5; i++) { const phi = ang(HP[i], HP[i + 1]); s += poly(arcPts(HP[i], HR, phi + 20, phi - 20), mix(C.bg, C.line, 0.55), 3); }
    const t0 = W('unisci'), t1 = W('primo') + 0.2, p = clamp((t - t0) / (t1 - t0)) * 6;
    const pts = [HP[0]];
    for (let i = 0; i < 6; i++) { if (p <= i) break; const a = HP[i], b = HP[(i + 1) % 6], f = Math.min(1, p - i); pts.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f)]); }
    if (p >= 6) s += E(t, W('completato') - 0.2, `<polygon points="${HP.map(q => q.join(',')).join(' ')}" fill="${mix(C.bg, C.line, 0.10)}"/>`, { dy: 0, blur: 0 });
    if (pts.length > 1) s += poly(pts, C.coral, 6);
    HP.forEach((q, k) => s += dot(q, C.line) + hLab(k));
    s += E(t, W("l'esagono"), lbl(1180, 330, 'ESAGONO REGOLARE', { a: 'start', size: 30 }) + IT(1180, 420, 'sei lati uguali', { size: 52 }));
    return s + caption(t, W("l'esagono"), 'Esagono completato', '');
  } }) });

// 11 — perché funziona (chiaro): 6 triangoli equilateri, 60° × 6 = 360°
scene('esaw', { make: (W) => ({
  capAt: W('sei'), hold: W('trecentosessanta'),
  render(t) {
    const I = C.ink, O = [560, 490], R = 250, V = [0, 1, 2, 3, 4, 5].map(k => pol(O, R, 180 - 60 * k));
    let s = lightBg() + E(t, -0.4, card(200, 150, 1520, 680, { rot: -0.5 }), { dy: 0 });
    s += E(t, -0.3, `<polygon points="${V.map(q => q.join(',')).join(' ')}" fill="none" stroke="${I}" stroke-width="5" stroke-linejoin="round"/>` + dot(O, I, 7), { dy: 0 });
    V.forEach((q, k) => { s += E(t, W('sei') + k * 0.13, `<polygon points="${[O, q, V[(k + 1) % 6]].map(p => p.join(',')).join(' ')}" fill="${mix(C.cream, I, k % 2 ? 0.05 : 0.12)}" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>`, { dy: 0, blur: 4 }); });
    s += E(t, W('sessanta'), poly(arcPts(O, 62, 120, 180), I, 3) + T(O[0] - 62, O[1] - 80, '60°', { f: 'popm', size: 36, fill: I, a: 'middle' }), { dy: 0 });
    s += E(t, W('equilateri'), pillTag(1000, 300, 'TRIANGOLI EQUILATERI', I, C.cream));
    s += E(t, W('centro'), IT(1004, 400, 'con vertice al centro', { fill: I, size: 52 }));
    s += E(t, W('sessanta'), T(1000, 560, '60°', { f: 'pop', size: 100, fill: C.coral }));
    s += E(t, W('per'), T(1190, 560, '× 6', { f: 'pop', size: 100, fill: C.coral }));
    s += E(t, W('trecentosessanta'), T(1000, 690, '= 360°', { f: 'pop', size: 100, fill: C.coral }));
    return s + caption(t, W('sei'), 'Sei triangoli equilateri', '', true);
  } }) });

// 12 — dadi e bulloni: chiave da 6 direzioni
scene('dado', { make: (W) => {
  const c = [1150, 470], r = 120, a = r * Math.cos(30 * RAD);
  const steps = [W('sei'), W('direzioni'), W('diverse'), W('una'), W('ogni'), W('sessanta')];
  return {
    capAt: W('sei'), hold: W('sessanta'),
    render(t) {
      let s = '';
      // dado esagonale in vista frontale (vertici a 30°, 90°…: piatti verticali a x = ±a)
      const V = [0, 1, 2, 3, 4, 5].map(k => pol(c, r, 30 + 60 * k));
      s += E(t, -0.4, `<polygon points="${V.map(q => q.join(',')).join(' ')}" fill="${mix(C.bg, C.line, 0.08)}" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>` +
        `<circle cx="${c[0]}" cy="${c[1]}" r="${r * 0.72}" fill="none" stroke="${C.line}" stroke-width="2.5" opacity="0.7"/>` +
        `<circle cx="${c[0]}" cy="${c[1]}" r="${r * 0.48}" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>` +
        `<circle cx="${c[0]}" cy="${c[1]}" r="${r * 0.40}" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="5 7"/>`, { dy: 0 });
      // sei direzioni tratteggiate (asse della chiave perpendicolare a una coppia di piatti)
      for (let k = 0; k < 6; k++) s += E(t, W('direzioni') + k * 0.1, seg(pol(c, r + 30, 90 + 60 * k), pol(c, 350, 90 + 60 * k), C.line, 2.5, 'stroke-dasharray="8 12" opacity="0.75"'), { dy: 0, blur: 3 });
      // chiave: bocca a U che stringe due piatti opposti; ruota di 60° a ogni passo
      let rot = 0; steps.forEach((ts, i) => { if (i > 0) rot += 60 * eio((t - ts) / 0.35); });
      const head = `<path d="M${-a - 34},${-r * 0.62} L${-a - 34},${r + 64} L${a + 34},${r + 64} L${a + 34},${-r * 0.62} L${a},${-r * 0.62} L${a},${r + 12} L${-a},${r + 12} L${-a},${-r * 0.62} z" fill="${C.bg}" stroke="${C.coral}" stroke-width="5" stroke-linejoin="round"/>` +
        `<rect x="-26" y="${r + 64}" width="52" height="180" rx="22" fill="${C.bg}" stroke="${C.coral}" stroke-width="5"/>`;
      if (t > W('chiave') - 0.05) s += E(t, W('chiave'), `<g transform="translate(${c[0]},${c[1]}) rotate(${(-rot).toFixed(2)})">${head}</g>`, { dy: 0 });
      s += E(t, W('esagonale'), lbl(96, 360, 'TESTA ESAGONALE', { a: 'start', size: 30 }));
      s += E(t, W('direzioni'), lbl(96, 450, '6 DIREZIONI', { a: 'start', size: 30 }));
      s += E(t, W('sessanta'), lbl(96, 540, 'UNA OGNI 60°', { a: 'start', size: 30 }));
      return s + caption(t, W('sei'), 'Sei direzioni, ogni 60°', '');
    } };
} });

// 13 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Righello e compasso', { f: 'pop', size: 120, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('figure') - 0.1, 960, 560, "Figure precise, un passo dopo l'altro.", { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'precise' });
    s += E(t, W("l'altro") + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC DIS-1-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
