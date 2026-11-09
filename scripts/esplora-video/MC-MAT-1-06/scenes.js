// Quando 1 + 1 = 3 — MC-MAT-1-06 §"I materiali compositi: quando 1 + 1 = 3". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d'%]/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.4);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<pattern id="hatchD" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="26" stroke="${mix(C.bg, C.line, 0.25)}" stroke-width="3"/></pattern>
<pattern id="hatchL" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="26" stroke="${mix(C.cream, C.ink, 0.45)}" stroke-width="3"/></pattern>
<pattern id="dotsD" width="34" height="30" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="3.2" fill="${mix(C.bg, C.line, 0.38)}"/><circle cx="25" cy="22" r="2.4" fill="${mix(C.bg, C.line, 0.30)}"/><circle cx="27" cy="6" r="1.6" fill="${mix(C.bg, C.line, 0.30)}"/></pattern>
<pattern id="dotsL" width="34" height="30" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="3.4" fill="${mix(C.cream, C.ink, 0.5)}"/><circle cx="25" cy="22" r="2.6" fill="${mix(C.cream, C.ink, 0.4)}"/></pattern>
<pattern id="groundD" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="26" stroke="${mix(C.bg, C.line, 0.18)}" stroke-width="3"/></pattern>
</defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
function tag(x, y, s, o = {}) {
  const size = o.size || 26, w = tw(s, 'mono', size) + 3 * s.length + 28, a = o.a || 'middle';
  const x0 = a === 'middle' ? x - w / 2 : a === 'end' ? x - w : x;
  return `<rect x="${x0}" y="${y - size - 8}" width="${w}" height="${size + 22}" rx="6" fill="${o.bg || C.bg}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="2"` : ''}/>` +
    T(x0 + w / 2, y, s, { f: 'mono', size, fill: o.fill || C.line, a: 'middle', ls: 3, w: 700 });
}
const ltag = (x, y, s, a = 'middle') => tag(x, y, s, { bg: C.cream, fill: C.ink, stroke: C.ink, a });

// ---- mondo: materiali in sezione ----
// paglia deterministica dentro un rettangolo
function straws(x, y, w, h, n, st, sw = 4, seed = 0) {
  let g = '';
  for (let i = 0; i < n; i++) {
    const cx = x + 40 + hsh(i + seed) * (w - 80), cy = y + 30 + hsh(i + seed + 40) * (h - 60);
    const len = 70 + hsh(i + seed + 80) * 80, a = (hsh(i + seed + 120) * 2 - 1) * 0.5;
    const dx = Math.cos(a) * len / 2, dy = Math.sin(a) * len / 2;
    g += `<line x1="${(cx - dx).toFixed(1)}" y1="${(cy - dy).toFixed(1)}" x2="${(cx + dx).toFixed(1)}" y2="${(cy + dy).toFixed(1)}" stroke="${st}" stroke-width="${sw}" stroke-linecap="round"/>`;
  }
  return g;
}
function brick(x, y, w, h, st, o = {}) {
  let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="url(#${o.light ? 'dotsL' : 'dotsD'})"/>`;
  if (o.straw) g += `<g clip-path="none">${straws(x, y, w, h, o.n || 16, o.strawSt || st, o.sw || 4, o.seed || 0)}</g>`;
  if (o.crack != null && o.crack > 0) {
    const pts = [[x + w * 0.45, y], [x + w * 0.52, y + h * 0.2], [x + w * 0.44, y + h * 0.42], [x + w * 0.55, y + h * 0.63], [x + w * 0.48, y + h * 0.82], [x + w * 0.53, y + h]];
    const k = o.crack * (pts.length - 1); let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const q = clamp(k - (i - 1)); if (q <= 0) break; d += ` L${lerp(pts[i - 1][0], pts[i][0], q).toFixed(1)},${lerp(pts[i - 1][1], pts[i][1], q).toFixed(1)}`; }
    g += `<path d="${d}" fill="none" stroke="${o.light ? C.cream : C.bg}" stroke-width="16" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  }
  g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" stroke="${o.edge || st}" stroke-width="${o.ew || 5}"/>`;
  return g;
}
// trave in sezione longitudinale (eventualmente inflessa di d px)
function beam(x0, y0, w, h, st, o = {}) {
  const d = o.d || 0, N = 40; let top = '', bot = '';
  for (let i = 0; i <= N; i++) {
    const u = i / N, x = x0 + u * w, dy = d * Math.sin(Math.PI * u);
    top += `${i ? 'L' : 'M'}${x.toFixed(1)},${(y0 + dy).toFixed(1)} `;
    bot = `L${x.toFixed(1)},${(y0 + h + dy).toFixed(1)} ` + bot;
  }
  const path = top + bot + 'Z';
  let g = `<path d="${path}" fill="url(#dotsD)"/>`;
  if (o.crack > 0) { const xc = x0 + w / 2, yb = y0 + h + d, c = o.crack;
    g += `<path d="M${xc - 12 * c},${yb + 2} L${xc + 2 * c},${yb - h * 0.75 * c} L${xc + 12 * c},${yb + 2} Z" fill="${C.bg}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`; }
  g += `<path d="${path}" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  return g;
}
const support = (x, y, st) => `<path d="M${x},${y} L${x - 34},${y + 60} L${x + 34},${y + 60} Z" fill="none" stroke="${st}" stroke-width="4" stroke-linejoin="round"/><line x1="${x - 50}" y1="${y + 64}" x2="${x + 50}" y2="${y + 64}" stroke="${st}" stroke-width="4"/>`;
// barra d'acciaio ad aderenza migliorata (nervature)
function rebar(x, y, len, col, h = 18) {
  let g = `<rect x="${x}" y="${y - h / 2}" width="${len}" height="${h}" rx="${h / 2}" fill="${col}"/>`;
  for (let k = x + 18; k < x + len - 12; k += 26) g += `<line x1="${k}" y1="${y - h / 2}" x2="${k + 9}" y2="${y + h / 2}" stroke="${C.bg}" stroke-width="3"/>`;
  return g;
}
const TAILX = 0.4;
const DIMF = mix(C.bg, C.line, 0.28);

// 1 — 1 + 1 = 3
scene('intro', { make: (W) => ({
  capAt: W('compositi'), last: W('tre'),
  render(t) {
    const y = 560, sz = 280; let s = '';
    const parts = [['1', 560, 'uno', 0], ['+', 760, 'più', 0], ['1', 960, 'uno', 1], ['=', 1160, 'fare', 0], ['3', 1360, 'tre', 0]];
    parts.forEach(([c, x, w, n]) => { s += E(t, W(w, n) - 0.05, T(x, y, c, { f: 'pop', size: sz, fill: c === '3' ? C.coral : C.line, a: 'middle' }), { dy: 30 }); });
    s += E(t, W('materiali') - 0.1, `<line x1="560" y1="660" x2="1360" y2="660" stroke="${C.line}" stroke-width="3"/>`, { dy: 0 });
    s += E(t, W('materiali'), IT(960, 740, 'materiali compositi', { a: 'middle', size: 64 }), { dy: 10 });
    return s + caption(t, W('compositi'), 'Materiali compositi', '');
  } }) });

// 2 — definizione (chiaro)
scene('definizione', { make: (W) => ({
  capAt: W('due'), last: W('solo'),
  render(t) {
    const ink = C.ink; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    const Y = 300, S = 260;
    const sq = (x, fill, edge, ew) => `<rect x="${x}" y="${Y}" width="${S}" height="${S}" rx="10" fill="${fill}"/><rect x="${x}" y="${Y}" width="${S}" height="${S}" rx="10" fill="none" stroke="${edge}" stroke-width="${ew}"/>`;
    s += E(t, W('due') - 0.1, sq(270, 'url(#hatchL)', ink, 4) + T(400, 640, 'MATERIALE A', { f: 'mono', size: 26, fill: ink, a: 'middle', w: 700, ls: 3 }));
    s += E(t, W('più') - 0.1, T(655, 470, '+', { f: 'pop', size: 110, fill: ink, a: 'middle' }));
    s += E(t, W('materiali') - 0.1, sq(780, 'url(#dotsL)', ink, 4) + T(910, 640, 'MATERIALE B', { f: 'mono', size: 26, fill: ink, a: 'middle', w: 700, ls: 3 }));
    s += E(t, W('avere') - 0.15, T(1165, 470, '=', { f: 'pop', size: 110, fill: ink, a: 'middle' }));
    s += E(t, W('avere'), `<rect x="1290" y="${Y}" width="${S}" height="${S}" rx="10" fill="url(#dotsL)"/>` +
      [0, 1, 2, 3].map(k => `<rect x="1312" y="${Y + 34 + k * 56}" width="${S - 44}" height="24" rx="4" fill="${C.cream}"/><rect x="1312" y="${Y + 34 + k * 56}" width="${S - 44}" height="24" rx="4" fill="url(#hatchL)" stroke="${ink}" stroke-width="3"/>`).join('') +
      `<rect x="1290" y="${Y}" width="${S}" height="${S}" rx="10" fill="none" stroke="${C.coral}" stroke-width="8"/>` +
      T(1420, 640, 'COMPOSITO', { f: 'mono', size: 26, fill: ink, a: 'middle', w: 700, ls: 3 }));
    s += words(t, W('proprietà') - 0.05, 960, 755, 'proprietà che nessuno dei componenti ha da solo', { f: 'serif', it: true, size: 54, fill: ink, a: 'middle' });
    return s + caption(t, W('due'), 'Due o più materiali', '', true);
  } }) });

// 3 — mattone di fango e paglia
scene('mattone', { make: (W) => ({
  capAt: W('cinquemila'), last: W('paglia'),
  render(t) {
    let s = E(t, 0.05, tag(960, 250, 'MESOPOTAMIA'), { dy: 8 });
    const pb = eo((t - 0.4) / 0.6);
    if (pb > 0) {
      s += `<g opacity="${pb.toFixed(3)}" style="${pb < 1 ? `filter:blur(${((1 - pb) * 10).toFixed(1)}px)` : ''}">` +
        `<rect x="560" y="340" width="800" height="380" rx="14" fill="url(#dotsD)"/>` +
        (t > W('paglia') - 0.1 ? `<g opacity="${eo((t - W('paglia') + 0.1) / 0.5).toFixed(3)}">${straws(560, 340, 800, 380, 22, C.line, 5, 3)}</g>` : '') +
        `<rect x="560" y="340" width="800" height="380" rx="14" fill="none" stroke="${C.line}" stroke-width="5"/></g>`;
    }
    s += E(t, W('fango') - 0.1, `<line x1="470" y1="530" x2="555" y2="530" stroke="${C.line}" stroke-width="3"/>` + tag(460, 541, 'FANGO', { a: 'end' }) + T(460 - 4, 600, 'MATRICE', { f: 'mono', size: 24, fill: C.line, a: 'end', w: 500, ls: 3 }), { dy: 8 });
    s += E(t, W('paglia') - 0.1, `<line x1="1365" y1="530" x2="1450" y2="530" stroke="${C.line}" stroke-width="3"/>` + tag(1460, 541, 'PAGLIA', { a: 'start' }) + T(1464, 600, 'RINFORZO', { f: 'mono', size: 24, fill: C.line, a: 'start', w: 500, ls: 3 }), { dy: 8 });
    s += E(t, 0.8, IT(960, 800, 'mattone in sezione', { a: 'middle', size: 44 }), { dy: 8 });
    return s + caption(t, W('cinquemila'), '5.000 anni fa', '5.000');
  } }) });

// 4 — da soli no, insieme sì
scene('insieme', { make: (W) => ({
  capAt: W('insieme'), last: W('solido'),
  render(t) {
    let s = '';
    const X = [400, 960, 1520], top = 420, w = 360, h = 230;
    // fango che si incrina
    s += E(t, W('fango') - 0.1, tag(X[0], 250, 'FANGO') + brick(X[0] - w / 2, top, w, h, C.line, { crack: eo((t - W('incrina') + 0.05) / 0.6) }));
    // paglia sotto carico: si piega
    if (t > W('paglia') - 0.1) {
      const bend = eo((t - W('carichi')) / 0.7) * 70; let g = tag(X[1], 250, 'PAGLIA');
      g += `<rect x="${X[1] - 150}" y="${top - 6 + bend * 0.5}" width="300" height="14" rx="4" fill="none" stroke="${C.line}" stroke-width="4"/>`;
      for (let i = 0; i < 7; i++) { const x = X[1] - 120 + i * 40, y1 = top + 10 + bend * 0.5, y2 = top + h;
        g += `<path d="M${x},${y1} Q${x + bend * 1.2},${(y1 + y2) / 2} ${x},${y2}" fill="none" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>`; }
      g += `<line x1="${X[1] - 180}" y1="${top + h + 4}" x2="${X[1] + 180}" y2="${top + h + 4}" stroke="${C.line}" stroke-width="4"/>`;
      s += E(t, W('paglia') - 0.1, g);
      s += E(t, W('carichi') - 0.15, arrow(X[1], top - 115, X[1], top - 20 + bend * 0.5, C.line, 6), { dy: -10 });
    }
    // fango + paglia: regge
    if (t > W('insieme') - 0.1) {
      s += E(t, W('insieme') - 0.1, tag(X[2], 250, 'FANGO + PAGLIA') + brick(X[2] - w / 2, top, w, h, C.line, { straw: true, n: 12, seed: 9, sw: 4, edge: C.coral, ew: 7 }));
      s += E(t, W('mattone') - 0.1, arrow(X[2], top - 115, X[2], top - 16, C.line, 6), { dy: -10 });
    }
    return s + caption(t, W('insieme'), 'Insieme, è solido', '');
  } }) });

// 5 — cemento armato: forte in compressione (chiaro)
scene('cemento', { make: (W) => ({
  capAt: W('compressione'), last: W('schiacci'),
  render(t) {
    const ink = C.ink; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += E(t, -0.1, T(250, 360, 'Cemento armato', { f: 'pop', size: 84, fill: ink }), { dy: 14 });
    s += E(t, W('più') - 0.1, IT(250, 450, 'il composito più usato', { size: 52, fill: ink }), { dy: 8 });
    s += E(t, W('costruzioni') - 0.1, IT(250, 515, 'nelle costruzioni', { size: 52, fill: ink }), { dy: 8 });
    s += E(t, W('cemento', 1) - 0.1, T(250, 640, 'CEMENTO = QUI CALCESTRUZZO', { f: 'mono', size: 26, fill: ink, w: 700, ls: 3 }) + T(250, 685, 'cemento + sabbia + ghiaia + acqua', { f: 'serif', it: true, size: 40, fill: ink }), { dy: 8 });
    // pilastro di cemento
    const cx = 1390, sq = eo((t - W('compressione')) / 0.6) * 10;
    s += E(t, W('cemento', 1) - 0.1, `<rect x="${cx - 110}" y="${330 + sq}" width="220" height="${400 - sq}" fill="url(#dotsL)"/><rect x="${cx - 110}" y="${330 + sq}" width="220" height="${400 - sq}" fill="none" stroke="${ink}" stroke-width="5"/>` +
      `<rect x="${cx - 220}" y="730" width="440" height="60" fill="url(#hatchL)"/><line x1="${cx - 220}" y1="730" x2="${cx + 220}" y2="730" stroke="${ink}" stroke-width="5"/>` +
      ltag(cx, 470, 'CEMENTO'));
    s += E(t, W('compressione') - 0.1, arrow(cx, 190, cx, 318 + sq, ink, 8) + `<line x1="${cx - 70}" y1="${322 + sq}" x2="${cx + 70}" y2="${322 + sq}" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>` +
      T(cx + 140, 280, 'SCHIACCIATO', { f: 'mono', size: 26, fill: ink, w: 700, ls: 3 }), { dy: -12 });
    return s + caption(t, W('compressione'), 'Forte in compressione', 'compressione', true);
  } }) });

// 6 — piegato si spezza; l'acciaio regge la trazione
scene('fragile', { make: (W) => ({
  capAt: W('trazione'), last: W('trazione'),
  render(t) {
    let s = `<line x1="960" y1="230" x2="960" y2="800" stroke="${DIMF}" stroke-width="3" stroke-dasharray="10 12"/>`;
    const bend = eo((t - W('pieghi') + 0.1) / 0.7), crack = eo((t - W('spezza')) / 0.5);
    s += E(t, -0.2, tag(520, 280, 'CEMENTO') + support(230, 590, C.line) + support(810, 590, C.line), { dy: 0 });
    s += E(t, -0.2, beam(180, 470, 680, 120, C.line, { d: bend * 26, crack }), { dy: 0 });
    s += E(t, W('tiri') - 0.15, arrow(520, 330, 520, 458 + bend * 26, C.line, 6), { dy: -10 });
    s += E(t, W('spezza'), T(520, 760, 'si spezza', { f: 'serif', it: true, size: 52, fill: C.line, a: 'middle' }), { dy: 8 });
    // acciaio in trazione
    if (t > W("l'acciaio") - 0.1) {
      const pull = eo((t - W('trazione') + 0.1) / 0.5);
      s += E(t, W("l'acciaio") - 0.1, tag(1400, 280, 'ACCIAIO') + rebar(1150, 520, 500, C.coral, 26), { dy: 10 });
      s += E(t, W('trazione') - 0.1, arrow(1140, 520, 1140 - 110 - 20 * pull, 520, C.line, 6) + arrow(1660, 520, 1660 + 110 + 20 * pull, 520, C.line, 6) +
        T(1400, 640, 'TRAZIONE', { f: 'mono', size: 30, fill: C.line, a: 'middle', w: 700, ls: 4 }), { dy: 0 });
      s += E(t, W('trazione'), T(1400, 760, 'regge', { f: 'serif', it: true, size: 52, fill: C.line, a: 'middle' }), { dy: 8 });
    }
    return s + caption(t, W('trazione'), 'Forte in trazione', '');
  } }) });

// trave armata comune alle scene 7–8
const BX = 260, BY = 440, BW = 1400, BH = 190;
function rcBeam(t, barP, o = {}) {
  let s = o.form ? `<path d="M${BX - 24},${BY - 30} V${BY + BH + 24} H${BX + BW + 24} V${BY - 30}" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="16 10"/>` : support(340, BY + BH, C.line) + support(1580, BY + BH, C.line);
  s += `<path d="M${BX},${BY} h${BW} v${BH} h${-BW} Z" fill="url(#dotsD)"/>`;
  if (barP > 0) s += `<g clip-path="none">${rebar(BX + 30, BY + BH - 36, (BW - 60) * barP, C.coral, 20)}</g>`;
  s += `<path d="M${BX},${BY} h${BW} v${BH} h${-BW} Z" fill="none" stroke="${C.line}" stroke-width="5"/>`;
  return s;
}
// 7 — barre d'acciaio dove si prevede la trazione
scene('barre', { make: (W) => ({
  capAt: W('trazione'), last: W('trazione'),
  render(t) {
    const barP = eio((t - W('barre') + 0.1) / Math.max(0.6, W('fresco') - W('barre') + 0.2));
    let s = E(t, -0.2, rcBeam(t, barP, { form: true }) + tag(960, 330, 'CASSERO', {}), { dy: 0 });
    s += E(t, W('cemento') - 0.1, tag(560, 520, 'CEMENTO FRESCO'), { dy: 8 });
    s += E(t, W('acciaio') - 0.1, `<line x1="1300" y1="${BY + BH - 26}" x2="1300" y2="712" stroke="${C.line}" stroke-width="3"/>` + tag(1300, 750, "BARRA D'ACCIAIO"), { dy: 8 });
    const zp = eo((t - W('trazione') + 0.1) / 0.5);
    if (zp > 0) s += `<g opacity="${zp.toFixed(3)}"><rect x="${BX + 12}" y="${BY + BH - 74}" width="${BW - 24}" height="64" rx="8" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="14 10"/>` +
      tag(620, 750, 'ZONA DI TRAZIONE') + `</g>`;
    return s + caption(t, W('trazione'), 'Barre: zona di trazione', '');
  } }) });

// 8 — ognuno regge la sua forza
scene('entrambe', { make: (W) => ({
  capAt: W('risultato'), last: W('forze'),
  render(t) {
    let s = rcBeam(t, 1) + E(t, -0.3, arrow(960, 250, 960, BY - 12, C.line, 7) + tag(960, 220, 'CARICO'), { dy: -10 });
    const yc = BY + 50, yt = BY + BH - 70;
    s += E(t, W('compressione') - 0.1, arrow(420, yc, 860, yc, C.line, 7) + arrow(1500, yc, 1060, yc, C.line, 7) + tag(200, 360, 'CEMENTO (MATRICE) · COMPRESSIONE', { a: 'start' }), { dy: 0 });
    s += E(t, W("l'acciaio") - 0.1, arrow(860, yt, 450, yt, C.line, 7) + arrow(1060, yt, 1470, yt, C.line, 7) + `<line x1="960" y1="${BY + BH - 28}" x2="960" y2="718" stroke="${C.line}" stroke-width="3"/>` + tag(960, 760, 'ACCIAIO (RINFORZO) · TRAZIONE'), { dy: 0 });
    return s + caption(t, W('risultato'), 'Regge entrambe le forze', '');
  } }) });

// 9 — fibra di carbonio: filamenti + resina (chiaro)
scene('carbonio', { make: (W) => ({
  capAt: W('filamenti'), last: W('resina'),
  render(t) {
    const ink = C.ink; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += E(t, -0.1, T(250, 290, 'Fibra di carbonio', { f: 'pop', size: 72, fill: ink }), { dy: 12 });
    const x0 = 560, y0 = 400, w = 860, h = 280, dx = 120, dy = -80;
    const rp = eo((t - W('resina') + 0.1) / 0.7);
    const front = `M${x0},${y0} h${w} v${h} h${-w} Z`, side = `M${x0 + w},${y0} l${dx},${dy} v${h} l${-dx},${-dy} Z`, topf = `M${x0},${y0} l${dx},${dy} h${w} l${-dx},${-dy} Z`;
    let b = '';
    if (rp > 0) b += `<g opacity="${(0.55 * rp).toFixed(3)}"><path d="${front}" fill="${C.coral}"/><path d="${side}" fill="${C.coral}"/><path d="${topf}" fill="${C.coral}"/></g>`;
    const fp = eio((t - W('filamenti') + 0.1) / 0.9);
    if (fp > 0) for (let i = 0; i < 6; i++) {
      const y = y0 + 40 + i * 40;
      b += `<line x1="${x0 + 14}" y1="${y}" x2="${x0 + 14 + (w - 28) * fp}" y2="${y}" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`;
      if (fp >= 1) for (let j = 0; j < 3; j++) b += `<circle cx="${x0 + w + 30 + j * 30}" cy="${y - 20 - j * 20}" r="6" fill="${ink}"/>`;
    }
    b += `<path d="${front}" fill="none" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/><path d="${side}" fill="none" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/><path d="${topf}" fill="none" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>`;
    s += E(t, W('composito') - 0.1, b, { dy: 0 });
    s += E(t, W('filamenti') - 0.1, `<line x1="700" y1="${y0 + 240}" x2="700" y2="730" stroke="${ink}" stroke-width="3"/><circle cx="700" cy="${y0 + 240}" r="7" fill="${ink}"/>` + ltag(560, 772, 'FILAMENTI · RINFORZO', 'start'), { dy: 8 });
    s += E(t, W('resina') - 0.1, `<line x1="1250" y1="${y0 + 260}" x2="1250" y2="730" stroke="${ink}" stroke-width="3"/><circle cx="1250" cy="${y0 + 260}" r="7" fill="${ink}"/>` + ltag(1420, 772, 'RESINA · MATRICE', 'end'), { dy: 8 });
    return s + caption(t, W('filamenti'), 'Filamenti più resina', '', true);
  } }) });

// 10 — sottile: confronto con un capello (sezione, in scala tra loro)
scene('capello', { make: (W) => ({
  capAt: W('micrometri'), last: W('capello'),
  render(t) {
    let s = E(t, -0.2, tag(960, 200, 'IN SEZIONE · STESSA SCALA'), { dy: 0 });
    const hx = 640, hy = 520, R = 280; // capello: 20 volte la fibra da 5 µm
    s += E(t, W('capello') - 0.15, `<circle cx="${hx}" cy="${hy}" r="${R}" fill="url(#groundD)" stroke="${C.line}" stroke-width="5"/><circle cx="${hx}" cy="${hy}" r="${R - 26}" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 10"/>` + tag(hx, hy + 12, 'CAPELLO'), { dy: 0 });
    s += E(t, W('cinque') - 0.1, `<circle cx="1260" cy="${hy}" r="14" fill="${C.line}"/>` + T(1260, hy + 90, '5 µm', { f: 'mono', size: 30, fill: C.line, a: 'middle', w: 700 }), { dy: 8 });
    s += E(t, W('dieci') - 0.1, `<circle cx="1480" cy="${hy}" r="28" fill="${C.line}"/>` + T(1480, hy + 90, '10 µm', { f: 'mono', size: 30, fill: C.line, a: 'middle', w: 700 }), { dy: 8 });
    s += E(t, W('cinque') - 0.1, T(1370, hy - 100, 'FIBRA', { f: 'mono', size: 30, fill: C.line, a: 'middle', w: 700, ls: 4 }), { dy: 8 });
    s += E(t, W('venti') - 0.1, IT(1370, 760, 'da 10 a 20 volte', { a: 'middle', size: 52 }) + IT(1370, 820, 'più sottile', { a: 'middle', size: 52 }), { dy: 8 });
    return s + caption(t, W('micrometri'), '5–10 micrometri', '5–10');
  } }) });

// 12 — il riciclo (chiaro)
function flame(cx, cy, s, st, ph) {
  const f = 1 + 0.06 * Math.sin(ph * 9);
  return `<g transform="translate(${cx},${cy}) scale(${s},${s * f})"><path d="M0,-70 C30,-36 44,-12 36,14 C30,36 12,44 0,44 C-12,44 -30,36 -36,14 C-44,-12 -20,-30 -8,-50 C-6,-30 6,-24 0,-70 Z" fill="none" stroke="${st}" stroke-width="${5 / s}" stroke-linejoin="round"/>` +
    `<path d="M0,-6 C12,8 14,22 6,32 C2,36 -2,36 -6,32 C-14,22 -10,10 0,-6 Z" fill="none" stroke="${st}" stroke-width="${4 / s}"/></g>`;
}
scene('riciclo', { make: (W) => ({
  capAt: W('problema'), last: W('metallo') + 2.0,
  render(t) {
    const ink = C.ink; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 700), { dy: 0 });
    s += `<line x1="960" y1="200" x2="960" y2="800" stroke="${mix(C.cream, ink, 0.3)}" stroke-width="3" stroke-dasharray="10 12"/>`;
    // composito: la resina indurita non si scioglie
    s += E(t, W('resina') - 0.1, T(550, 250, 'COMPOSITO', { f: 'mono', size: 30, fill: ink, a: 'middle', w: 700, ls: 4 }), { dy: 8 });
    let blk = `<rect x="370" y="360" width="360" height="200" rx="8" fill="url(#hatchL)"/>`;
    for (let i = 0; i < 6; i++) blk += `<line x1="380" y1="${385 + i * 30}" x2="720" y2="${385 + i * 30}" stroke="${ink}" stroke-width="4"/>`;
    blk += `<rect x="370" y="360" width="360" height="200" rx="8" fill="none" stroke="${ink}" stroke-width="5"/>`;
    s += E(t, W('resina') - 0.1, blk + IT(550, 318, 'resina indurita', { a: 'middle', size: 44, fill: ink }), { dy: 8 });
    s += E(t, W('sciogliere') - 0.1, flame(550, 670, 0.9, ink, t), { dy: 6 });
    const xp = eo((t - W('nuovo') + 0.05) / 0.4);
    if (xp > 0) s += `<g opacity="${xp.toFixed(3)}"><line x1="400" y1="350" x2="${lerp(400, 700, xp)}" y2="${lerp(350, 580, xp)}" stroke="${C.coral}" stroke-width="12" stroke-linecap="round"/><line x1="700" y1="350" x2="${lerp(700, 400, xp)}" y2="${lerp(350, 580, xp)}" stroke="${C.coral}" stroke-width="12" stroke-linecap="round"/></g>`;
    s += E(t, W('composito') - 0.1, T(550, 790, 'non si rifonde', { f: 'serif', it: true, size: 50, fill: ink, a: 'middle' }), { dy: 8 });
    // metallo: si rifonde
    if (t > W('come') - 0.1) {
      const m1 = eio((t - W('metallo')) / 0.8), m2 = eio((t - W('metallo') - 1.0) / 0.8), m = m1 * (1 - m2);
      const hh = lerp(lerp(150, 46, m1), 110, m2), ww = lerp(lerp(300, 440, m1), 360, m2), y = 560 - hh;
      s += E(t, W('come') - 0.1, T(1370, 260, 'METALLO', { f: 'mono', size: 30, fill: ink, a: 'middle', w: 700, ls: 4 }) +
        `<path d="M${1370 - ww / 2},560 L${1370 - ww / 2 + 30 * (1 - m)},${y} L${1370 + ww / 2 - 30 * (1 - m)},${y} L${1370 + ww / 2},560 Z" fill="url(#dotsL)" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>` +
        `<line x1="1110" y1="564" x2="1630" y2="564" stroke="${ink}" stroke-width="4"/>` + flame(1370, 670, 0.9, ink, t + 1), { dy: 8 });
      s += E(t, W('metallo') + 0.1, T(1370, 790, 'si fonde', { f: 'serif', it: true, size: 50, fill: ink, a: 'end' }), { dy: 8 });
      s += E(t, W('metallo') + 1.0, T(1380, 790, ' e si riforma', { f: 'serif', it: true, size: 50, fill: ink, a: 'start' }), { dy: 8 });
      const ca = eo((t - W('metallo') - 0.2) / 1.4);
      if (ca > 0) { const R0 = 70, cx = 1660, cy = 400, a1 = -Math.PI / 2, a2 = a1 + ca * 1.75 * Math.PI, px = cx + R0 * Math.cos(a2), py = cy + R0 * Math.sin(a2);
        s += `<path d="M${cx},${cy - R0} A${R0},${R0} 0 ${ca * 1.75 > 1 ? 1 : 0} 1 ${px.toFixed(1)},${py.toFixed(1)}" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
        if (ca > 0.95) { const tx = -Math.sin(a2), ty = Math.cos(a2); s += `<path d="M${(px + tx * 18).toFixed(1)},${(py + ty * 18).toFixed(1)} L${(px - ty * 12).toFixed(1)},${(py + tx * 12).toFixed(1)} L${(px + ty * 12).toFixed(1)},${(py - tx * 12).toFixed(1)} Z" fill="${ink}"/>`; } }
    }
    return s + caption(t, W('problema'), 'Il problema: il riciclo', '', true);
  } }) });

// 13 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 400, 'Quando 1 + 1 = 3', { f: 'pop', size: 104, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('due') - 0.1, 960, 530, 'Due materiali insieme:', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'insieme', keyFill: C.coralD });
    s += words(t, W('proprietà') - 0.1, 960, 615, 'proprietà che nessuno dei due ha da solo.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true });
    s += E(t, W('solo') + 0.3, `<line x1="760" y1="690" x2="1160" y2="690" stroke="${C.ink}" stroke-width="3"/>` + T(960, 750, 'PROFTECNOLOGIA · MC MAT-1-06', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
