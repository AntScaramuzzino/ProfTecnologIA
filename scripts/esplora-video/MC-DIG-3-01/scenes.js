// Il robot che risponde — MC-DIG-3-01 §"Programmazione event-driven: il robot che risponde". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d]/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.5);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.6);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<pattern id="hatch" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="18" stroke="${C.lineDim}" stroke-width="4"/></pattern></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });

// ---- mondo: robottino a ruote visto dall'alto, line-art in sezione ----
// fronte verso +x locale; ang in gradi (positivo = orario sullo schermo)
function robot(cx, cy, ang, st, o = {}) {
  const sc = o.s || 1, cA = o.coralA ? C.coral : st, cB = o.coralBump ? C.coral : st;
  let g = '';
  // ruote
  for (const y of [-106, 80]) {
    g += `<rect x="-62" y="${y}" width="124" height="26" rx="8" fill="${o.bg || C.bg}" stroke="${st}" stroke-width="4"/>`;
    const ph = o.spin || 0;
    for (let k = 0; k < 6; k++) { const xx = -54 + ((k * 20 + ph) % 120 + 120) % 120; if (xx < 56) g += `<line x1="${xx}" y1="${y + 5}" x2="${xx}" y2="${y + 21}" stroke="${st}" stroke-width="3"/>`; }
  }
  // telaio
  g += `<rect x="-110" y="-80" width="220" height="160" rx="20" fill="${o.fill || DIM()}" stroke="${st}" stroke-width="5"/>`;
  // scheda con griglia di LED 5x5
  g += `<rect x="-52" y="-56" width="112" height="112" rx="10" fill="${o.bg || C.bg}" stroke="${st}" stroke-width="3"/>`;
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) g += `<circle cx="${-28 + i * 16}" cy="${-32 + j * 16}" r="3.5" fill="${st}"/>`;
  // pulsante A
  g += `<circle cx="-82" cy="0" r="17" fill="${o.bg || C.bg}" stroke="${cA}" stroke-width="${o.coralA ? 6 : 3}"/>` +
    `<g transform="rotate(${-ang} -82 0)">${T(-82, 9, 'A', { f: 'mono', size: 26, fill: cA, a: 'middle', w: 700 })}</g>`;
  // sensore a ultrasuoni (due capsule) sul frontale
  g += `<rect x="96" y="-52" width="24" height="104" rx="6" fill="${o.bg || C.bg}" stroke="${st}" stroke-width="3"/>` +
    `<circle cx="120" cy="-28" r="15" fill="${o.bg || C.bg}" stroke="${st}" stroke-width="4"/><circle cx="120" cy="28" r="15" fill="${o.bg || C.bg}" stroke="${st}" stroke-width="4"/>`;
  // paraurti con sensore di tocco
  if (o.bump !== false) g += `<path d="M146,-78 Q${170 - (o.press || 0) * 10},0 146,78" fill="none" stroke="${cB}" stroke-width="${o.coralBump ? 8 : 6}" stroke-linecap="round"/>` +
    `<line x1="110" y1="-62" x2="${148}" y2="-62" stroke="${st}" stroke-width="3"/><line x1="110" y1="62" x2="148" y2="62" stroke="${st}" stroke-width="3"/>`;
  return `<g transform="translate(${cx},${cy}) rotate(${ang}) scale(${sc})">${g}</g>`;
}
function waves(x, y, ang, t, len, st, n = 3) { // impulsi dal sensore verso la direzione ang
  let s = '';
  for (let k = 0; k < n; k++) {
    const p = ((t * 1.1 + k / n) % 1 + 1) % 1, r = 20 + p * len, a = 0.55;
    const x1 = x + r * Math.cos(ang - a), y1 = y + r * Math.sin(ang - a), x2 = x + r * Math.cos(ang + a), y2 = y + r * Math.sin(ang + a);
    s += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="${st}" stroke-width="4" stroke-linecap="round" opacity="${(1 - p).toFixed(2)}"/>`;
  }
  return s;
}
function floor() { // pavimento: griglia tenue
  let s = '';
  for (let x = 96; x <= 1824; x += 96) s += `<line x1="${x}" y1="150" x2="${x}" y2="860" stroke="${mix(C.bg, C.line, 0.07)}" stroke-width="2"/>`;
  for (let y = 192; y <= 860; y += 96) s += `<line x1="96" y1="${y}" x2="1824" y2="${y}" stroke="${mix(C.bg, C.line, 0.07)}" stroke-width="2"/>`;
  return s;
}
function steps(t, x, y, items, st, gap = 62) { // elenco di passi che compaiono alla parola
  let s = '';
  items.forEach(([t0, txt], i) => { s += E(t, t0, `<circle cx="${x + 14}" cy="${y + i * gap - 9}" r="7" fill="${st}"/>` + T(x + 40, y + i * gap, txt, { f: 'mono', size: 28, fill: st, ls: 2, w: 600 }), { dy: 10 }); });
  return s;
}
function clock(cx, cy, r, p, st) { // quadrante con settore che avanza (p 0..1)
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.bg}" stroke="${st}" stroke-width="5"/>`;
  if (p > 0) {
    const a = -Math.PI / 2 + Math.min(p, 0.9999) * 2 * Math.PI, x = cx + (r - 12) * Math.cos(a), y = cy + (r - 12) * Math.sin(a);
    s += `<path d="M${cx},${cy} L${cx},${cy - r + 12} A${r - 12},${r - 12} 0 ${p > 0.5 ? 1 : 0} 1 ${x.toFixed(1)},${y.toFixed(1)} z" fill="${DIM()}" stroke="${st}" stroke-width="3"/>`;
  }
  return s + `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r + 14}" stroke="${st}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="6" fill="${st}"/>`;
}
function bolt(cx, cy, s, fill, st) {
  return `<path transform="translate(${cx},${cy}) scale(${s})" d="M12,-60 L-30,8 L-2,8 L-14,60 L30,-12 L2,-12 z" fill="${fill}" stroke="${st}" stroke-width="${4 / s}" stroke-linejoin="round"/>`;
}

// 1 — programma sequenziale (scuro)
scene('seq', { make: (W) => ({
  capAt: W('una'), last: W('fisso'),
  render(t) {
    let s = '';
    s += E(t, W('programma') - 0.1, lbl(960, 200, 'PROGRAMMA SEQUENZIALE', { size: 30 }), { dy: 10 });
    const ys = [250, 380, 510, 640], tAct = [W('una'), W('dopo'), W("laltra"), W('ordine')];
    ys.forEach((y, i) => {
      const on = t >= tAct[i];
      s += E(t, W('istruzioni') - 0.1 + i * 0.12, `<rect x="760" y="${y}" width="400" height="100" rx="14" fill="${on ? mix(C.bg, C.line, 0.22) : C.bg}" stroke="${C.line}" stroke-width="4"/>` +
        T(960, y + 61, `ISTRUZIONE ${i + 1}`, { f: 'mono', size: 30, a: 'middle', ls: 2, w: 600 }), { dy: 14 });
    });
    // cursore di esecuzione (unico corallo)
    if (t >= tAct[0] - 0.05) {
      let k = 0; for (let i = 0; i < 4; i++) if (t >= tAct[i]) k = i;
      const prev = Math.max(0, k - 1), p = k === 0 ? 1 : eio((t - tAct[k]) / 0.3);
      const y = lerp(ys[prev], ys[k], p) + 50;
      s += E(t, tAct[0] - 0.05, `<path d="M690,${y - 26} L736,${y} L690,${y + 26} z" fill="${C.coral}"/>`, { dy: 0, d: 0.3 });
    }
    // freccia: ordine fisso
    const pa = eo((t - W('ordine')) / 0.5);
    if (pa > 0) s += `<g opacity="${pa}">${arrow(1250, 270, 1250, 270 + 450 * pa, C.line, 5)}</g>` + E(t, W('ordine'), lbl(1290, 520, 'ORDINE FISSO', { a: 'start' }), { dy: 0 });
    return s + caption(t, W('una'), "Una dopo l'altra", '');
  } }) });

// 2 — event-driven (chiaro): causa (evento) a sinistra subito, poi effetto
scene('evento', { make: (W) => ({
  capAt: W('quando'), last: W('evento'),
  render(t) {
    let s = lightBg(); const ink = C.ink;
    s += E(t, -0.3, pillTag(960, 200, 'EVENT-DRIVEN', ink, C.ivory, 'middle'), { dy: 0 });
    s += E(t, -0.2, card(170, 270, 620, 470), { dy: 0 });
    s += pop(t, 0.05, 300, 470, bolt(300, 470, 1.3, C.coral, ink));
    s += E(t, 0.2, T(480, 668, 'EVENTO', { f: 'pop', size: 64, fill: ink, a: 'middle' }), { dy: 12 });
    s += E(t, W('accade'), IT(400, 470, 'accade', { size: 56, fill: ink }) + IT(400, 534, 'qualcosa', { size: 56, fill: ink }), { dy: 12 });
    const pa = eo((t - W('istruzioni') + 0.1) / 0.45);
    if (pa > 0) s += arrow(830, 505, 830 + 250 * pa, 505, ink, 6);
    s += E(t, W('istruzioni'), card(1130, 270, 620, 470), { dy: 0 });
    s += E(t, W('istruzioni'), T(1440, 370, 'ISTRUZIONI', { f: 'pop', size: 56, fill: ink, a: 'middle' }), { dy: 12 });
    for (let i = 0; i < 3; i++) {
      const f = eo((t - W('eseguono') - i * 0.25) / 0.3);
      s += E(t, W('istruzioni') + 0.1 + i * 0.1, `<rect x="1230" y="${430 + i * 90}" width="420" height="60" rx="10" fill="${mix(C.cream, C.ink, 0.22 * f)}" stroke="${ink}" stroke-width="3"/>`, { dy: 10 });
    }
    s += E(t, W('eseguono'), IT(1440, 715, 'si eseguono', { size: 40, fill: ink, a: 'middle' }), { dy: 8 });
    return s + caption(t, W('quando'), 'Quando accade qualcosa', '', true);
  } }) });

// 3 — esempi di evento (scuro)
scene('esempi', { make: (W) => ({
  capAt: W('evento'), last: W('30gradi'),
  render(t) {
    let s = ''; const st = C.line;
    const tile = (cx, t0, inner) => E(t, t0, `<rect x="${cx - 230}" y="210" width="460" height="560" rx="22" fill="${C.bg}" stroke="${st}" stroke-width="4"/>` + inner, { dy: 18 });
    // 1: sensore di distanza
    s += tile(380, W('sensore') - 0.1,
      `<rect x="200" y="380" width="40" height="150" rx="8" fill="${DIM()}" stroke="${st}" stroke-width="4"/><circle cx="244" cy="420" r="22" fill="${C.bg}" stroke="${st}" stroke-width="4"/><circle cx="244" cy="490" r="22" fill="${C.bg}" stroke="${st}" stroke-width="4"/>` +
      waves(266, 455, 0, t, 190, st) +
      `<rect x="500" y="300" width="50" height="310" fill="url(#hatch)" stroke="${st}" stroke-width="4"/>`);
    s += E(t, W('15centimetri'), T(380, 700, '< 15 cm', { f: 'pop', size: 64, a: 'middle' }), { dy: 10 });
    // 2: pulsante A
    const pr = t > W('premuto') ? 1 - eo((t - W('premuto')) / 0.25) * 0.12 : 1;
    s += tile(960, W('pulsante') - 0.1,
      `<rect x="830" y="330" width="260" height="260" rx="22" fill="${DIM()}" stroke="${st}" stroke-width="4"/>` +
      `<circle cx="960" cy="460" r="${(80 * pr).toFixed(1)}" fill="${C.bg}" stroke="${st}" stroke-width="5"/>` + T(960, 486, 'A', { f: 'pop', size: 76, a: 'middle' }));
    s += E(t, W('premuto'), T(960, 700, 'premuto', { f: 'pop', size: 64, a: 'middle' }), { dy: 10 });
    // 3: termometro
    s += tile(1540, W('temperatura') - 0.1,
      `<rect x="1515" y="290" width="50" height="250" rx="25" fill="${C.bg}" stroke="${st}" stroke-width="5"/><circle cx="1540" cy="570" r="44" fill="${C.bg}" stroke="${st}" stroke-width="5"/>` +
      `<circle cx="1540" cy="570" r="28" fill="${st}"/><rect x="1531" y="420" width="18" height="140" fill="${st}"/>` +
      [330, 380, 430, 480].map(y => `<line x1="1575" y1="${y}" x2="1600" y2="${y}" stroke="${st}" stroke-width="4"/>`).join(''));
    s += E(t, W('30gradi'), T(1540, 700, '> 30 °C', { f: 'pop', size: 64, a: 'middle' }), { dy: 10 });
    return s + caption(t, W('evento'), 'Esempi di evento', 'evento');
  } }) });

// 4 — gestore di eventi (chiaro)
scene('gestore', { make: (W) => ({
  capAt: W('gestore'), last: W('programma') - 0.6,
  render(t) {
    let s = lightBg(); const ink = C.ink;
    s += E(t, -0.35, card(150, 170, 960, 640), { dy: 0 });
    // blocco "quando accade X": testata + bocca a C (testata corallo = unico corallo)
    const bx = 230, by = 240;
    s += E(t, W('blocco') - 0.15,
      `<path d="M${bx},${by + 110} V${by + 30} a30,30 0 0 1 30,-30 H${bx + 770} a20,20 0 0 1 20,20 V${by + 90} a20,20 0 0 1 -20,20 H${bx + 140} V${by + 340} H${bx + 790} V${by + 420} H${bx} z" fill="${C.ivory}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M${bx},${by + 110} V${by + 30} a30,30 0 0 1 30,-30 H${bx + 770} a20,20 0 0 1 20,20 V${by + 90} a20,20 0 0 1 -20,20 H${bx}" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linejoin="round"/>` +
      T(bx + 50, by + 74, 'QUANDO ACCADE', { f: 'mono', size: 36, fill: ink, ls: 2, w: 700 }), { dy: 14 });
    s += E(t, W('x'), `<rect x="${bx + 440}" y="${by + 24}" width="90" height="62" rx="31" fill="${C.cream}" stroke="${ink}" stroke-width="3"/>` + T(bx + 485, by + 72, 'X', { f: 'pop', size: 44, fill: ink, a: 'middle' }), { dy: 8 });
    for (let i = 0; i < 2; i++) {
      const f = eo((t - W('xsi') - 0.15 - i * 0.3) / 0.3);
      s += E(t, W('codice') + i * 0.12, `<rect x="${bx + 160}" y="${by + 140 + i * 95}" width="560" height="72" rx="10" fill="${mix(C.cream, C.ink, 0.22 * f)}" stroke="${ink}" stroke-width="3"/>` +
        T(bx + 190, by + 186 + i * 95, 'istruzione', { f: 'mono', size: 28, fill: ink, w: 500 }), { dy: 10 });
    }
    s += pop(t, W('xsi'), bx + 580, by + 55, bolt(bx + 600, by + 55, 0.55, C.ivory, ink));
    s += E(t, W('gestore'), pillTag(630, 760, 'GESTORE DI EVENTI', ink, C.ivory, 'middle'), { dy: 0 });
    // resto del programma che continua
    s += E(t, W('indipendentemente') - 0.1, card(1230, 270, 540, 420), { dy: 0 });
    const rot = (t * 120) % 360;
    s += E(t, W('indipendentemente') - 0.05, `<g transform="rotate(${rot.toFixed(1)} 1500 430)"><path d="M1500,350 A80,80 0 1 1 1420,430" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M1500,330 L1530,350 L1500,372 z" fill="${ink}"/></g>` +
      T(1500, 590, 'RESTO DEL', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 2, w: 600 }) + T(1500, 630, 'PROGRAMMA', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 2, w: 600 }), { dy: 10 });
    s += E(t, W('indipendentemente'), IT(1500, 770, 'indipendentemente', { size: 44, fill: ink, a: 'middle' }), { dy: 8 });
    return s + caption(t, W('gestore'), 'Il gestore di eventi', '', true);
  } }) });

// 5 — il programma del robot (chiaro): ciclo principale separato dai gestori di eventi
scene('programma', { make: (W) => ({
  capAt: W('ciclo'), last: W('velocità'),
  render(t) {
    let s = lightBg(); const ink = C.ink;
    s += E(t, -0.35, card(150, 160, 1620, 660), { dy: 0 });
    s += E(t, -0.2, robot(340, 330, 0, ink, { s: 0.62, fill: C.ivory, bg: C.cream }) + T(340, 470, 'ROBOT', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 3, w: 600 }), { dy: 10 });
    // ciclo principale (contorno corallo, unico corallo)
    s += E(t, W('programma') - 0.1, `<rect x="560" y="210" width="1130" height="240" rx="18" fill="${C.ivory}" stroke="${C.coral}" stroke-width="6"/>` +
      T(600, 272, 'CICLO PRINCIPALE', { f: 'mono', size: 30, fill: ink, ls: 2, w: 700 }), { dy: 12 });
    const cp = eo((t - W('ciclo')) / 0.4);
    if (cp > 0) s += `<g opacity="${cp}" transform="rotate(${((t - W('ciclo')) * 90 % 360).toFixed(1)} 1630 262)"><path d="M1630,232 A30,30 0 1 1 1600,262" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><path d="M1630,220 L1648,232 L1630,246 z" fill="${ink}"/></g>` +
      E(t, W('ciclo'), T(1570, 274, 'SI RIPETE SEMPRE', { f: 'mono', size: 28, fill: ink, a: 'end', ls: 2, w: 600 }), { dy: 0 });
    s += E(t, W('vai'), `<rect x="600" y="315" width="1050" height="96" rx="12" fill="${C.cream}" stroke="${ink}" stroke-width="3"/>` +
      T(640, 378, 'vai avanti', { f: 'pop', size: 44, fill: ink }), { dy: 10 });
    s += E(t, W('velocità'), T(1610, 378, 'velocità 50', { f: 'pop', size: 44, fill: ink, a: 'end' }), { dy: 10 });
    // gestori di eventi: separati, con fulmine
    s += E(t, W('robot') + 0.1, T(560, 520, 'GESTORI DI EVENTI', { f: 'mono', size: 28, fill: ink, ls: 3, w: 700 }) +
      `<line x1="930" y1="511" x2="1690" y2="511" stroke="${ink}" stroke-width="2" stroke-dasharray="6 10"/>`, { dy: 8 });
    [1, 2, 3].forEach((n, i) => {
      const x = 560 + i * 385;
      s += E(t, W('robot') + 0.2 + i * 0.12, `<rect x="${x}" y="550" width="360" height="220" rx="18" fill="${C.ivory}" stroke="${ink}" stroke-width="4"/>` +
        bolt(x + 44, 608, 0.45, C.cream, ink) + T(x + 80, 620, `EVENTO ${n}`, { f: 'mono', size: 30, fill: ink, ls: 2, w: 700 }) +
        `<rect x="${x + 30}" y="650" width="300" height="40" rx="8" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="10 8"/>` +
        `<rect x="${x + 30}" y="706" width="220" height="40" rx="8" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="10 8"/>`, { dy: 12 });
    });
    return s + caption(t, W('ciclo'), 'Il ciclo continuo', '', true);
  } }) });

// 6 — evento 1: ostacolo a meno di 15 cm (scuro)
scene('ev1', { make: (W) => ({
  capAt: W('evento'), last: W('riprende') - 0.1,
  render(t) {
    let s = floor(); const st = C.line;
    const tStop = W('15centimetri'), tRot = W('ruota'), tGo = W('riprende');
    const wallX = 1560, stopX = wallX - 150 - 110;
    let x = t < tStop ? lerp(640, stopX, eio(clamp(t / tStop))) : stopX, y = 560, ang = 0;
    ang = 90 * eio((t - tRot) / 0.8);
    if (t > tGo) y = 560 + 170 * eo((t - tGo) / 1.4);
    const moving = t < tStop || t > tGo;
    // ostacolo
    s += `<rect x="${wallX}" y="400" width="70" height="440" fill="url(#hatch)" stroke="${st}" stroke-width="5"/>` + lbl(wallX, 330, 'OSTACOLO', { a: 'start' });
    // onde ultrasoni (finché il frontale guarda l'ostacolo)
    if (t >= W('sensore') && t < tRot) s += waves(x + 136, y, 0, t, wallX - x - 160, st);
    s += robot(x, y, ang, st, { spin: moving ? t * 120 : 0 });
    // distanza < 15 cm: staffa (unico corallo)
    const b = eo((t - tStop) / 0.35);
    if (b > 0 && t < tRot + 0.2) s += `<g opacity="${b * (1 - clamp((t - tRot) / 0.2))}"><path d="M${stopX + 150},440 v-30 H${wallX} v30" fill="none" stroke="${C.coral}" stroke-width="6"/>` +
      T(wallX - 20, 380, '< 15 cm', { f: 'pop', size: 52, a: 'end' }) + '</g>';
    // rotazione: arco 90°
    const r = eo((t - tRot) / 0.5);
    if (r > 0) { const R = 200, a0 = 8 * Math.PI / 180, a1 = 78 * Math.PI / 180, px = stopX, py = 560;
      const rf = r * (1 - clamp((t - tGo) / 0.3));
      if (rf > 0) s += `<g opacity="${rf.toFixed(3)}"><path d="M${(px + R * Math.cos(a0)).toFixed(1)},${(py + R * Math.sin(a0)).toFixed(1)} A${R},${R} 0 0 1 ${(px + R * Math.cos(a1)).toFixed(1)},${(py + R * Math.sin(a1)).toFixed(1)}" fill="none" stroke="${st}" stroke-width="4" stroke-dasharray="12 10"/>` +
        arrow(px + R * Math.cos(a1 - 0.15), py + R * Math.sin(a1 - 0.15), px + R * Math.cos(a1 + 0.12), py + R * Math.sin(a1 + 0.12), st, 4) +
        T(px + 165, py + 175, '90°', { f: 'pop', size: 52 }) + '</g>'; }
    // passi
    s += steps(t, 120, 250, [[W('ferma'), 'FERMATI'], [W('ruota'), 'RUOTA A DESTRA 90°'], [W('riprende'), 'RIPRENDI']], st);
    return s + caption(t, W('evento'), 'Evento 1', '');
  } }) });

// 7 — evento 2: tocco (scuro). La palla toccata rotola via durante l'attesa, poi il robot riparte davvero.
scene('ev2', { make: (W) => {
  const tP = W('premuto'), tWait = W('aspetta'), tGo = tWait + 2.0;
  return {
    capAt: W('evento'), last: tGo + 0.4,
    render(t) {
      let s = floor(); const st = C.line;
      let x = t < tP ? lerp(980, 1140, eio(clamp(t / tP))) : 1140; const y = 600;
      if (t > tGo) x = 1140 + 200 * eo((t - tGo) / 1.6);
      const touching = t >= tP && t < tWait + 0.15;
      const press = touching ? eo((t - tP) / 0.2) : 0;
      // palla: ferma, poi rotola via verso destra durante l'attesa
      const roll = eio((t - tWait) / 1.6), bx = 1362 + 400 * roll, rot = roll * 400;
      s += `<g transform="translate(${bx.toFixed(1)},${y}) rotate(${rot.toFixed(1)})"><circle r="60" fill="${DIM()}" stroke="${st}" stroke-width="5"/>` +
        `<path d="M-60,0 A60,60 0 0 0 60,0" fill="none" stroke="${st}" stroke-width="3"/><line x1="0" y1="-60" x2="0" y2="60" stroke="${st}" stroke-width="3"/></g>`;
      if (roll > 0.05 && roll < 0.98) s += `<g opacity="${(1 - roll).toFixed(2)}">${[0, 1, 2].map(k => `<line x1="${bx - 90 - k * 26}" y1="${y - 30 + k * 30}" x2="${bx - 70 - k * 26}" y2="${y - 30 + k * 30}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
      s += robot(x, y, 0, st, { coralBump: true, press, spin: t < tP || t > tGo ? t * 120 : 0 });
      s += E(t, W('tocco'), lbl(1250, 800, 'SENSORE DI TOCCO'), { dy: 0 });
      if (t > W('avviso') && t < tGo) for (let k = 0; k < 3; k++) {
        const p = ((t - W('avviso')) * 1.4 + k / 3) % 1;
        s += `<path d="M${x - 40 - 50 * p},${y - 140 - 40 * p} Q${x},${y - 190 - 70 * p} ${x + 40 + 50 * p},${y - 140 - 40 * p}" fill="none" stroke="${st}" stroke-width="4" stroke-linecap="round" opacity="${(1 - p).toFixed(2)}"/>`;
      }
      s += E(t, tWait, clock(1650, 300, 90, clamp((t - tWait) / 2.0), st) + T(1650, 450, '2 s', { f: 'pop', size: 56, a: 'middle' }), { dy: 10 });
      s += steps(t, 120, 250, [[W('ferma'), 'FERMATI'], [W('avviso'), 'AVVISO SONORO'], [tWait, 'ASPETTA 2 S'], [tGo, 'RIPRENDI']], st);
      return s + caption(t, W('evento'), 'Evento 2', '');
    } };
} });

// 8 — evento 3: pulsante A, esplorazione (scuro)
scene('ev3', { make: (W) => {
  const tA = W('a'), tR = W('ruota');
  return {
    capAt: W('evento'), last: W('caso'),
    render(t) {
      let s = floor(); const st = C.line;
      const rx = 760, ry = 520, ang = 120 * eio((t - tR) / 0.9);
      s += robot(rx, ry, ang, st, { spin: t > tR ? t * 120 : 0 });
      // ingrandimento del pulsante A (unico corallo), pressione sulla parola "A"
      const fade = 1 - clamp((t - tR) / 0.4);
      if (fade > 0) {
        const pr = t > tA ? 1 - 0.14 * Math.sin(Math.PI * clamp((t - tA) / 0.35)) : 1;
        s += E(t, W('pulsante') - 0.05, `<g opacity="${fade.toFixed(2)}"><circle cx="${rx - 82}" cy="${ry}" r="30" fill="none" stroke="${st}" stroke-width="3"/>` +
          `<line x1="${rx - 112}" y1="${ry}" x2="440" y2="${ry}" stroke="${st}" stroke-width="3" stroke-dasharray="10 8"/>` +
          `<circle cx="330" cy="${ry}" r="110" fill="${C.bg}" stroke="${st}" stroke-width="4"/>` +
          `<circle cx="330" cy="${ry}" r="${(62 * pr).toFixed(1)}" fill="${DIM()}" stroke="${C.coral}" stroke-width="8"/>` +
          T(330, ry + 22, 'A', { f: 'pop', size: 64, a: 'middle' }) + lbl(330, ry + 170, 'PULSANTE A') + '</g>', { dy: 10 });
      }
      s += E(t, W('esplorazione') - 0.05, lbl(rx, 270, 'MODALITÀ ESPLORAZIONE'), { dy: 0 });
      const sx = 1180, ex = 1740, sy = 620;
      s += E(t, W('esplorazione'), `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${sy}" stroke="${st}" stroke-width="4"/>` +
        [0, 3, 6, 9].map((v, i) => { const xx = sx + 40 + i * 160, a = [-20, 110, 30, 200][i] * Math.PI / 180;
          return `<line x1="${xx}" y1="${sy - 14}" x2="${xx}" y2="${sy + 14}" stroke="${st}" stroke-width="4"/>` + T(xx, sy + 60, `${v} s`, { f: 'mono', size: 28, a: 'middle', w: 600 }) +
            arrow(xx, sy - 90, xx + 46 * Math.cos(a), sy - 90 + 46 * Math.sin(a), st, 5) + `<circle cx="${xx}" cy="${sy - 90}" r="8" fill="${st}"/>`; }).join('') +
        pillTag((sx + ex) / 2, sy + 150, 'ESEMPIO', st, C.bg, 'middle'), { dy: 12 });
      s += E(t, W('caso'), IT((sx + ex) / 2, 420, 'a caso, ogni 3 secondi', { size: 46, a: 'middle' }), { dy: 8 });
      return s + caption(t, W('evento'), 'Evento 3', '');
    } };
} });

// 9 — il vantaggio (chiaro): ogni gestore risponde appena accade il suo evento; il ciclo intanto è in pausa
scene('vantaggio', { make: (W) => {
  const t0 = W('rispondere'), t1 = W('laltro') + 0.1;
  return {
    capAt: W('vantaggio'), last: t1,
    render(t) {
      let s = lightBg(); const ink = C.ink;
      s += E(t, -0.35, card(150, 170, 1620, 650), { dy: 0 });
      const lanes = ['CICLO PRINCIPALE', 'EVENTO 1', 'EVENTO 2', 'EVENTO 3'], X0 = 620, X1 = 1690;
      const ev = [[0.12, 0.34], [0.45, 0.62], [0.75, 0.92]];
      const run = [[0, 0.12], [0.34, 0.45], [0.62, 0.75], [0.92, 1]];
      const ph = eio((t - t0) / (t1 - t0)), hx = lerp(X0, X1, ph);
      const fillBar = (a, b, y, solid) => {
        const xa = lerp(X0, X1, a), xb = lerp(X0, X1, b), fx = clamp((hx - xa) / (xb - xa));
        return `<rect x="${xa}" y="${y - 30}" width="${xb - xa}" height="60" rx="12" fill="${C.ivory}" stroke="${ink}" stroke-width="3"${solid ? '' : ' stroke-dasharray="10 8"'}/>` +
          (solid && fx > 0 ? `<rect x="${xa}" y="${y - 30}" width="${((xb - xa) * fx).toFixed(1)}" height="60" rx="12" fill="${mix(C.cream, C.ink, 0.35)}"/>` : '');
      };
      lanes.forEach((ln, i) => {
        const y = 270 + i * 120;
        s += E(t, -0.2 + i * 0.1, T(200, y + 10, ln, { f: 'mono', size: 28, fill: ink, ls: 2, w: 700 }) +
          `<line x1="${X0}" y1="${y}" x2="${X1}" y2="${y}" stroke="${ink}" stroke-width="2" stroke-dasharray="6 10"/>`, { dy: 8 });
      });
      s += E(t, W('eventi') - 0.1, run.map(([a, b]) => fillBar(a, b, 270, true)).join('') + ev.map(([a, b]) => fillBar(a, b, 270, false)).join(''), { dy: 8 });
      ev.forEach(([a, b], i) => { s += E(t, W('eventi') + i * 0.12, fillBar(a, b, 390 + i * 120, true), { dy: 8 }); });
      if (t > t0) s += `<line x1="${hx.toFixed(1)}" y1="215" x2="${hx.toFixed(1)}" y2="650" stroke="${ink}" stroke-width="4"/><circle cx="${hx.toFixed(1)}" cy="215" r="9" fill="${ink}"/>`;
      s += E(t, W('eventi'), `<rect x="200" y="718" width="90" height="44" rx="10" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="10 8"/>` +
        T(310, 750, 'CICLO IN PAUSA', { f: 'mono', size: 28, fill: ink, ls: 2, w: 600 }) + pillTag(1560, 752, 'ESEMPIO', ink, C.ivory, 'middle'), { dy: 6 });
      return s + caption(t, W('vantaggio'), 'Il vantaggio', 'vantaggio', true);
    } };
} });

// 10 — il rischio: priorità (scuro)
scene('rischio', { make: (W) => ({
  capAt: W('rischio'), last: W('quale'),
  render(t) {
    let s = ''; const st = C.line;
    const ev = (x, t0, a, b) => E(t, t0, `<rect x="${x}" y="230" width="460" height="170" rx="20" fill="${C.bg}" stroke="${st}" stroke-width="4"/>` +
      bolt(x + 70, 315, 0.75, DIM(), st) + T(x + 130, 300, a, { f: 'mono', size: 30, ls: 2, w: 700 }) + T(x + 130, 360, b, { f: 'pop', size: 40 }), { dy: 14 });
    s += ev(170, W('rischio'), 'EVENTO 1', '< 15 cm');
    s += ev(1290, W('rischio') + 0.15, 'EVENTO 2', 'tocco');
    s += E(t, W('stesso'), clock(960, 315, 70, 0, st) + lbl(960, 450, 'STESSO MOMENTO'), { dy: 10 });
    const pa = eo((t - W('sistema')) / 0.5);
    if (pa > 0) s += `<g opacity="${pa}">${arrow(400, 410, 400 + (740 - 400) * pa, 410 + (590 - 410) * pa, st, 5)}${arrow(1520, 410, 1520 + (1180 - 1520) * pa, 410 + (590 - 410) * pa, st, 5)}</g>`;
    s += E(t, W('priorità'), `<rect x="720" y="600" width="480" height="130" rx="20" fill="${C.bg}" stroke="${C.coral}" stroke-width="6"/>` + T(960, 688, 'PRIORITÀ?', { f: 'pop', size: 60, a: 'middle' }), { dy: 12 });
    s += E(t, W('quale'), IT(960, 820, 'Quale risposta prevale?', { size: 52, a: 'middle' }), { dy: 8 });
    return s + caption(t, W('rischio'), 'Il rischio', '');
  } }) });

// 11 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Il robot che risponde', { f: 'pop', size: 120, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('le') - 0.1, 960, 560, 'Le istruzioni si eseguono quando accade qualcosa.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'qualcosa', keyFill: C.coralDk });
    s += E(t, W('qualcosa') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC DIG-3-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
