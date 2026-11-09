// 5 — l'aggetto (registro chiaro)
scene('aggetto', { make: (W) => ({
  capAt: W("l'aggetto"),
  holdFrom: W('sporge'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, I = C.ink;
    let g = E(t, -0.4, card(150, 150, 1620, 700, { rot: -0.6 }), { dy: 0 });
    g += E(t, 0.05, T(220, 240, "COS'È UN AGGETTO", { f: 'mono', size: 30, fill: I, ls: 3, w: 700 }));
    const hs = 0.7, tx = 430 - 650 * hs, ty = 340 - 330 * hs;
    const hd = house(110, { ink: I, fill: mix(C.cream, I, 0.12), eave: C.coral, eaveFill: mix(C.cream, C.coral, 0.25), noHatch: true, gx0: 420, gx1: 1700 });
    g += E(t, 0.15, `<g transform="translate(${tx},${ty}) scale(${hs})">${hd}</g>`, { dy: 10 });
    const P = (x, y) => [tx + x * hs, ty + y * hs];
    const [ax, ay] = P(670, 492);
    g += E(t, W('bordo') - 0.1, `<line x1="${ax}" y1="${ay - 6}" x2="${ax - 50}" y2="${ay - 64}" stroke="${I}" stroke-width="3"/>` + T(ax - 50, ay - 80, 'BORDO DEL TETTO', { f: 'mono', size: 26, fill: I, a: 'middle', w: 700, ls: 2 }));
    const [wx, wy] = P(760, 690);
    g += E(t, W('finestra') - 0.1, `<line x1="${wx - 8}" y1="${wy}" x2="${wx - 100}" y2="${wy}" stroke="${I}" stroke-width="3"/>` + T(wx - 112, wy + 9, 'FINESTRA', { f: 'mono', size: 26, fill: I, a: 'end', w: 700, ls: 2 }));
    g += E(t, W('sporge') - 0.1, T(860, 810, 'sporge sopra la finestra', { f: 'serif', size: 52, fill: I, it: true, a: 'middle' }));
    const bx = 1340, by = 280;
    g += E(t, W('balcone') - 0.15, `<rect x="${bx}" y="${by}" width="340" height="440" rx="12" fill="${C.cream}" stroke="${I}" stroke-width="3"/>` +
      `<rect x="${bx + 200}" y="${by + 30}" width="34" height="370" fill="${mix(C.cream, I, 0.12)}" stroke="${I}" stroke-width="3"/>` +
      `<rect x="${bx + 70}" y="${by + 150}" width="164" height="26" fill="${mix(C.cream, I, 0.12)}" stroke="${I}" stroke-width="3"/>` +
      `<path d="M${bx + 74},${by + 150} L${bx + 74},${by + 80} L${bx + 200},${by + 80}" fill="none" stroke="${I}" stroke-width="3"/>` +
      [0, 1, 2, 3].map(i => `<line x1="${bx + 96 + i * 28}" y1="${by + 80}" x2="${bx + 96 + i * 28}" y2="${by + 150}" stroke="${I}" stroke-width="2"/>`).join('') +
      `<rect x="${bx + 200}" y="${by + 220}" width="34" height="150" fill="${C.cream}" stroke="${I}" stroke-width="3"/><line x1="${bx + 217}" y1="${by + 220}" x2="${bx + 217}" y2="${by + 370}" stroke="${I}" stroke-width="3"/>` +
      T(bx + 170, by + 420, 'oppure un BALCONE', { f: 'mono', size: 26, fill: I, a: 'middle', w: 700, ls: 2 }));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W("l'aggetto"), "L'aggetto", '', true);
  } }) });

// gruppo della casa in sezione, rimpicciolito per far stare il sole estivo
const HG = inner => `<g transform="translate(960,900) scale(0.82) translate(-960,-900)">${inner}</g>`;
const tagBox = (x, y, s, size = 30) => { const w = tw(s, 'mono', size) + 36; return `<rect x="${x - w / 2}" y="${y - size - 6}" width="${w}" height="${size + 24}" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` + T(x, y, s, { f: 'mono', size, fill: C.line, a: 'middle', w: 600 }); };
function angleBox(x, y, a, r, label) {
  const ex = x - r * Math.cos(rad(a)), ey = y - r * Math.sin(rad(a));
  let s = `<line x1="${x}" y1="${y}" x2="${x - r - 40}" y2="${y}" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>`;
  s += `<path d="M${x - r},${y} A${r},${r} 0 0 1 ${ex},${ey}" fill="none" stroke="${C.line}" stroke-width="4"/>`;
  const w = tw(label, 'pop', 44) + 30, lx = x - r - 40 - w, ly = y - 40;
  s += `<rect x="${lx}" y="${ly - 40}" width="${w}" height="64" rx="10" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` + T(lx + w / 2, ly + 8, label, { f: 'pop', size: 44, a: 'middle' });
  return s;
}
function compass(t) {
  return E(t, 0.1, arrow(300, 180, 140, 180, C.line, 3) + lbl(320, 190, 'SUD', { a: 'start', size: 28 }) + arrow(1620, 180, 1780, 180, C.line, 3) + lbl(1600, 190, 'NORD', { a: 'end', size: 28 }));
}
const DD = 110; // profondità dell'aggetto nel disegno
// 6 — estate: l'aggetto blocca il sole
scene('blocca', { make: (W) => ({
  capAt: W('blocca') - 0.4,
  holdFrom: W('luce'),
  render(t) {
    const a = 71.5, sun = sunFor(a);
    let h = house(DD, { eave: C.coral, eaveFill: mix(C.bg, C.coral, 0.2) }) + sunIcon(sun[0], sun[1], 40, C.line, t);
    h += sunRays(a, DD, eo((t - 0.6) / 2.2) * 0.9 + clamp((t - 2.8) / 1.5) * 0.1, { sun }).s;
    const sh = HS.CEIL + DD * Math.tan(rad(a));
    if (t > W("l'aggetto") - 0.1) h += E(t, W("l'aggetto") - 0.1, `<line x1="${HS.X - DD}" y1="${HS.CEIL}" x2="${HS.X}" y2="${sh}" stroke="${C.line}" stroke-width="3" stroke-dasharray="6 8"/>`, { dy: 0 });
    let s = E(t, -0.4, HG(h), { dy: 0 });
    s += E(t, W('alto') - 0.1, HG(angleBox(HS.X - DD, HS.CEIL, a, 80, '71,5°')));
    s += E(t, W("l'aggetto") - 0.1, lbl(1040, 690, 'FINESTRA IN OMBRA', { a: 'start', size: 28 }));
    s += E(t, W('luce') - 0.1, T(1240, 780, 'la luce non entra', { f: 'serif', size: 60, it: true, a: 'middle' }));
    s += E(t, 0.1, lbl(1780, 270, 'ESTATE', { a: 'end', size: 32 })) + compass(t);
    return s + caption(t, W('blocca') - 0.4, 'Estate: sole bloccato', '');
  } }) });

// 7 — inverno: la luce entra in profondità
scene('entra', { make: (W) => ({
  capAt: W('luce'),
  holdFrom: W('profondità'),
  render(t) {
    const a = 24.5, sun = sunFor(a, 700);
    let h = house(DD) + sunIcon(sun[0], sun[1], 40, C.line, t);
    h += sunRays(a, DD, eo((t - 0.5) / 3.6), { sun, ys: Array.from({ length: 16 }, (_, i) => 330 + i * 40) }).s;
    const lf = litFloor(a, DD);
    const p = eo((t - W('profondità') + 0.3) / 0.8);
    if (p > 0) h += `<rect x="${lf[0]}" y="${HS.G - 16}" width="${(lf[1] - lf[0]) * p}" height="16" fill="${C.coral}"/>`;
    let s = E(t, -0.4, HG(h), { dy: 0 });
    s += E(t, W('basso') - 0.1, HG(angleBox(HS.X - DD, HS.CEIL, a, 110, '24,5°')));
    const cx = 960 + ((lf[0] + lf[1]) / 2 - 960) * 0.82;
    s += E(t, W('profondità') - 0.1, tagBox(cx, 800, 'LUCE IN PROFONDITÀ'));
    s += E(t, 0.1, lbl(1780, 270, 'INVERNO', { a: 'end', size: 32 })) + compass(t);
    return s + caption(t, W('luce'), 'Inverno: luce dentro', '');
  } }) });

// 8 — la giusta profondità
scene('profondita', { make: (W) => ({
  capAt: W('giusta'),
  holdFrom: W('latitudine'),
  render(t) {
    const a = 71.5, sun = sunFor(a);
    const d = lerp(25, DD, eio((t - W('giusta')) / 1.6));
    let h = house(d, { eave: C.coral, eaveFill: mix(C.bg, C.coral, 0.2) }) + sunIcon(sun[0], sun[1], 40, C.line, t) + sunRays(a, d, 1, { sun }).s;
    let s = E(t, -0.4, HG(h), { dy: 0 });
    const qy = HS.SLAB - 80;
    s += E(t, W('profondità') - 0.2, HG(`<line x1="${HS.X - d}" y1="${qy}" x2="${HS.X}" y2="${qy}" stroke="${C.line}" stroke-width="4"/><line x1="${HS.X - d}" y1="${qy - 14}" x2="${HS.X - d}" y2="${qy + 14}" stroke="${C.line}" stroke-width="4"/><line x1="${HS.X}" y1="${qy - 14}" x2="${HS.X}" y2="${qy + 14}" stroke="${C.line}" stroke-width="4"/>` +
      lbl(HS.X + 24, qy + 10, 'PROFONDITÀ', { a: 'start', size: 32 })));
    const fx = HS.X + 80;
    s += E(t, W("dall'altezza") - 0.1, HG(`<line x1="${fx}" y1="${HS.WT}" x2="${fx}" y2="${HS.WB}" stroke="${C.line}" stroke-width="4"/><line x1="${fx - 14}" y1="${HS.WT}" x2="${fx + 14}" y2="${HS.WT}" stroke="${C.line}" stroke-width="4"/><line x1="${fx - 14}" y1="${HS.WB}" x2="${fx + 14}" y2="${HS.WB}" stroke="${C.line}" stroke-width="4"/>` +
      lbl(fx + 34, (HS.WT + HS.WB) / 2 - 8, 'ALTEZZA', { a: 'start', size: 32 }) + lbl(fx + 34, (HS.WT + HS.WB) / 2 + 34, 'FINESTRA', { a: 'start', size: 32 })));
    s += E(t, W('latitudine') - 0.1, pillTag(1330, 690, 'LATITUDINE', C.line, C.bg));
    s += E(t, 0.1, pillTag(1500, 290, 'ESEMPIO', C.line, C.bg)) + E(t, 0.1, lbl(1780, 270, 'ESTATE', { a: 'end', size: 32 })) + compass(t);
    return s + caption(t, W('giusta'), 'La giusta profondità', '');
  } }) });

// 9 — la formula (registro chiaro)
scene('formula', { make: (W) => ({
  capAt: W('formula'),
  holdFrom: W("d'inverno"),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, I = C.ink;
    let g = E(t, -0.4, card(150, 150, 1620, 680, { rot: 0.5 }), { dy: 0 });
    g += E(t, 0.05, T(230, 250, 'ALTEZZA DEL SOLE A MEZZOGIORNO', { f: 'mono', size: 30, fill: I, ls: 3, w: 700 }));
    const y = 420, fs = 66, parts = [['altezza =', 'formula', I], ['90°', 'novanta', I], ['− latitudine', 'meno', I], ['+', 'più', I], ['declinazione', 'più', C.coral]];
    let x = 230;
    parts.forEach(([txt, w, col]) => { g += E(t, W(w) - 0.1, T(x, y, txt, { f: 'pop', size: fs, fill: col })); x += tw(txt, 'pop', fs) + 30; });
    g += E(t, W('vale') - 0.1, `<line x1="230" y1="490" x2="1690" y2="490" stroke="${I}" stroke-width="2"/>` + T(230, 570, 'declinazione', { f: 'serif', size: 60, fill: I, it: true }));
    const row = (x, tt, v, lab) => E(t, tt, `<rect x="${x}" y="610" width="520" height="150" rx="16" fill="${C.cream}" stroke="${I}" stroke-width="3"/>` +
      T(x + 36, 668, lab, { f: 'mono', size: 28, fill: I, w: 700, ls: 3 }) + T(x + 36, 738, v, { f: 'pop', size: 64, fill: I }));
    g += row(560, W('più', 1) - 0.1, '+23,5°', 'ESTATE');
    g += row(1140, W('meno', 1) - 0.1, '−23,5°', 'INVERNO');
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('formula'), 'La formula', '', true);
  } }) });

