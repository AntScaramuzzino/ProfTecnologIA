//@@pacchetti
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

//@@etichetta
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

//@@net
// rete di router per la scena 7
const RX = [500, 820, 1140, 1440], RY = [420, 600, 780];
const N = (c, r) => [RX[c], RY[r]];
const SRC = [262, 600], DST = [1620, 600];
//@@percorsi
// 7 — percorsi diversi, arrivo in disordine
scene('percorsi', { tail: 0.75, make: (W) => ({
  capAt: W('percorsi'),
  render(t) {
    let s = '';
    const P = [[410, 590, 'PAESE A'], [730, 1230, 'PAESE B'], [1350, 1530, 'PAESE C']];
    P.forEach(([a, b, l], i) => s += E(t, W('paesi') + i * 0.15, `<rect x="${a}" y="${310}" width="${b - a}" height="${520}" rx="26" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="3 11" stroke-linecap="round"/>` + lbl((a + b) / 2, 346, l, { size: 24 })));
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
    const TX = k => 1370 + k * 100, TY = 205, OFF = -50; // i pacchetti viaggiano sopra i collegamenti, fuori dai nodi
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

//@@perso
// 9 — pacchetto perso e ritrasmesso
scene('perso', { tail: 1.2, make: (W) => ({
  capAt: W('perde'),
  render(t) {
    const LY = 470, xa = 330, xb = 1590, TYy = 760, SX = k => 960 + (k - 2) * 160, TT = 1.4;
    let s = E(t, -0.4, laptop(220, 520, 0.85) + desktop(1700, 530, 0.85) + lbl(220, 590, 'MITTENTE', { size: 24 }) + lbl(1700, 590, 'DESTINATARIO', { size: 24 }) +
      `<line x1="${xa}" y1="${LY}" x2="${xb}" y2="${LY}" stroke="${C.lineDim}" stroke-width="4"/>`, { dy: 0 });
    s += E(t, -0.4, lbl(SX(0) - 110, TYy + 10, 'ARRIVATI', { size: 24, a: 'end' }), { dy: 0 });
    const filled = W('mittente') + 0.75 + 0.3, tl = W('perde');
    // posti del vassoio
    for (let k = 0; k < 5; k++) if (k !== 2 || t < filled) s += packet(SX(k), TYy, null, { w: 120, h: 88, empty: true, dash: '8 8', fill: 'none', stroke: C.lineDim, sw: 2.5 });
    // i 5 pacchetti partono insieme (sfalsati); il 3 cade per strada
    for (let n = 1; n <= 5; n++) {
      const ts = -0.3 + (n - 1) * 0.22;
      if (t < ts) continue;
      if (n === 3) {
        if (t >= tl + 1.6) continue;
        const x = lerp(xa, xb, clamp((Math.min(t, tl) - ts) / TT)), fall = clamp((t - tl) / 1.6);
        const op = fall < 0.6 ? 1 : 1 - (fall - 0.6) / 0.4;
        s += `<g opacity="${op.toFixed(3)}">${packet(x, LY + eio(fall) * 190, 3, { w: 90, h: 66, ns: 30, dash: fall > 0 ? '8 6' : null })}</g>`;
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

//@@udp
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
