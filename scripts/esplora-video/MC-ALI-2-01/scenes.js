// La rotazione delle colture — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.4);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

const ROW = [300, 520, 740, 960, 1180, 1400, 1620]; // fila di grano (scene 1-3)
const P3 = [460, 860, 1260];                       // tre piante (scene anno 1-4)
const nearest = (x, xs) => xs.reduce((a, b) => Math.abs(b - x) < Math.abs(a - x) ? b : a);
// particella che viene assorbita: va verso la base della pianta più vicina e sparisce
function absorbed(i, p, xs, c) {
  const [x, y] = NPOS[i]; if (p >= 1) return '';
  if (p <= 0) return nDot(x, y, c);
  const tx = nearest(x, xs), ty = GY + 40, q = eio(p);
  return nDot(lerp(x, tx, q), lerp(y, ty, q), c, { op: 1 - clamp((p - 0.6) / 0.4), r: 19 * (1 - 0.4 * q) });
}

// 0 — aggancio: dieci anni di grano
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('grano'),
  render(t) {
    let s = E(t, -0.4, soil(), { dy: 0 });
    ROW.forEach((x, i) => s += wheat(x, 0.85 * eo((t - 0.1 - i * 0.08) / 1.2)));
    const yr = Math.min(10, 1 + Math.floor(clamp((t - W('seminare')) / (W('dieci') - W('seminare'))) * 9.999));
    const ten = t >= W('dieci');
    s += E(t, W('seminare') - 0.2, T(960, 200, 'ANNO', { f: 'mono', size: 40, fill: C.line, a: 'end', ls: 6, w: 700 }) +
      T(990, 206, String(yr), { f: 'pop', size: 110, fill: ten ? C.coral : C.line }) + T(1150, 200, '/ 10', { f: 'mono', size: 40, fill: C.line, ls: 4 }));
    s += E(t, W('cosa') - 0.1, T(960, 320, 'Cosa succede?', { f: 'serif', size: 72, it: true, fill: C.line, a: 'middle' }));
    return s + caption(t, W('grano'), 'Grano per dieci anni', '');
  } }) });

// 1 — il grano consuma l'azoto
scene('azoto', { make: (W) => ({
  capAt: W('terreno'),
  render(t) {
    let s = soil();
    ROW.forEach(x => s += wheat(x, 0.85));
    const a = W('consuma'), b = W('povero') + 0.3, keep = [2, 9, 15, 18];
    NPOS.forEach((_, i) => {
      if (keep.includes(i)) { s += E(t, -0.4, nDot(...NPOS[i], C.coral), { dy: 0 }); return; }
      const k = (i * 7) % 16, st = a + (b - a - 0.9) * k / 15;
      s += E(t, -0.4, absorbed(i, (t - st) / 0.9, ROW, C.coral), { dy: 0 });
    });
    s += E(t, -0.2, legendN(C.line, C.coral), { dy: 0 });
    return s + caption(t, W('terreno'), 'Suolo povero di azoto', '');
  } }) });

// 2 — parassiti e resa che cala
scene('resa', { make: (W) => ({
  capAt: W('resa'),
  render(t) {
    const xs = [300, 520, 740, 960];
    let s = soil();
    xs.forEach(x => s += wheat(x, 0.85));
    // parassiti e funghi che si moltiplicano
    for (let i = 0; i < 14; i++) {
      const x = 220 + rnd(i + 200) * 900, y = GY + 60 + rnd(i + 300) * 180, at = W('parassiti') + i * 0.13;
      s += pop(t, at, x, y, i % 2 ? fungus(x, y, 1.1, C.line) : bug(x, y, 1, C.line), 0.35);
    }
    s += E(t, W('parassiti'), lbl(1120, SB - 26, 'PARASSITI E FUNGHI', { a: 'end', size: 24 }));
    // grafico della resa: barre che calano (andamento di esempio)
    const gx = 1200, gy = 260, gw = 560, gh = 220;
    let ch = `<rect x="${gx - 30}" y="${gy - 100}" width="${gw + 60}" height="${gh + 150}" rx="14" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` +
      T(gx, gy - 52, 'RESA DEL GRANO', { f: 'mono', size: 26, fill: C.line, w: 700, ls: 3 }) + T(gx + gw, gy - 52, 'ESEMPIO', { f: 'mono', size: 24, fill: C.line, a: 'end', ls: 2 }) +
      `<line x1="${gx}" y1="${gy + gh}" x2="${gx + gw}" y2="${gy + gh}" stroke="${C.line}" stroke-width="3"/>` + T(gx + gw, gy + gh + 36, 'ANNI →', { f: 'mono', size: 24, fill: C.line, a: 'end', ls: 2 });
    for (let k = 0; k < 10; k++) {
      const p = eo((t - W('resa') + 0.3 - k * 0.12) / 0.4), hh = gh * (0.95 - k * 0.065) * p, bw = gw / 10 - 14;
      if (p > 0) ch += `<rect x="${gx + 7 + k * gw / 10}" y="${gy + gh - hh}" width="${bw}" height="${hh}" rx="4" fill="${mix(C.bg, C.line, 0.35)}" stroke="${C.line}" stroke-width="2"/>`;
    }
    const ap = eo((t - W('cala')) / 0.8);
    if (ap > 0) ch += arrow(gx + 20, gy - 10, lerp(gx + 20, gx + gw - 20, ap), lerp(gy - 10, gy + gh * 0.45, ap), C.coral, 6);
    s += E(t, W('resa') - 0.4, ch);
    return s + caption(t, W('resa'), 'La resa cala', '');
  } }) });

// 3 — la soluzione: rotazione (card)
scene('rotazione', { make: (W) => ({
  capAt: W('ogni'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(250, 140, 1420, 690, { rot: -1 }), { dy: 0 });
    g += E(t, 0.2, T(960, 200, 'LA SOLUZIONE', { f: 'mono', size: 28, fill: C.ink, a: 'middle', w: 700, ls: 6 }));
    g += E(t, W('rotazione') - 0.1, T(960, 290, 'La rotazione delle colture', { f: 'pop', size: 84, fill: C.ink, a: 'middle' }) + T(960, 360, 'un’idea antica che funziona ancora', { f: 'serif', size: 48, it: true, fill: C.ink, a: 'middle' }));
    // lo stesso campo, quattro anni: la coltura cambia
    const names = ['cereale', 'leguminosa', 'radice o tubero', 'foglia o frutto'], x0 = 360, w = 250, gap = 80, y = 622;
    const t0 = W('ogni');
    names.forEach((nm, i) => {
      const x = x0 + i * (w + gap) + w / 2, at = t0 + i * 0.55;
      let c = `<line x1="${x - w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y}" stroke="${C.ink}" stroke-width="4"/>`;
      for (let j = 0; j < 5; j++) c += `<line x1="${x - w / 2 + 20 + j * 50}" y1="${y + 14}" x2="${x - w / 2 + 2 + j * 50}" y2="${y + 32}" stroke="${C.ink}" stroke-width="2" opacity="0.5"/>`;
      c += T(x, y + 132, `ANNO ${i + 1}`, { f: 'mono', size: 26, fill: C.ink, a: 'middle', w: 700, ls: 3 });
      c += T(x, y + 166, nm, { f: 'mono', size: 26, fill: C.ink, a: 'middle' });
      c += `<g transform="translate(${x},${y}) scale(0.45) translate(${-x},${-GY})">` +
        [wheat, bean, carrot, tomato][i](x, 1, C.ink).replace(/fill="#0c0a09"/gi, `fill="${C.cream}"`) + '</g>';
      g += E(t, at, c);
      if (i < 3) g += E(t, at + 0.3, arrow(x + w / 2 + 14, y - 60, x + w / 2 + gap - 14, y - 60, C.coral, 5));
    });
    g += E(t, W('campo') - 0.1, T(960, 470, 'stesso campo, pianta diversa ogni anno', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 2 }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('ogni'), 'Ogni anno, pianta diversa', '', true);
  } }) });

// scene "anno": base comune
function yearBase(t, active, stripAt) {
  return E(t, -0.4, soil(), { dy: 0 }) + yearStrip(t, stripAt, active, { cascade: active === 0 });
}

// 4 — anno 1: cereale
scene('anno1', { make: (W) => ({
  capAt: W('cereale'),
  render(t) {
    let s = yearBase(t, t >= W('primo') - 0.1 ? 0 : -1, W('quattro') - 0.3);
    P3.forEach((x, i) => s += wheat(x, eo((t - W('cereale') + 0.2 - i * 0.12) / 1.0), C.coral));
    const a = W('consuma') - 0.2, used = [1, 4, 6, 8, 11, 13, 16, 19];
    NPOS.forEach((_, i) => {
      const k = used.indexOf(i);
      s += k < 0 ? E(t, -0.4, nDot(...NPOS[i], C.line), { dy: 0 }) : E(t, -0.4, absorbed(i, (t - a - k * 0.12) / 0.9, P3, C.line), { dy: 0 });
    });
    s += E(t, -0.2, legendN(C.line), { dy: 0 });
    return s + caption(t, W('cereale'), 'Anno uno: cereale', '');
  } }) });

const LEFT1 = NPOS.map((_, i) => ![1, 4, 6, 8, 11, 13, 16, 19].includes(i));
// 5 — anno 2: leguminosa che fissa l'azoto dell'aria
scene('anno2', { make: (W) => ({
  capAt: W("dell'aria"),
  render(t) {
    let s = yearBase(t, 1, -1);
    P3.forEach((x, i) => s += bean(x, eo((t - W('leguminosa') + 0.3 - i * 0.12) / 1.0)));
    NPOS.forEach((p, i) => { if (LEFT1[i]) s += nDot(...p, C.line); });
    // azoto dell'aria: coppie N–N che entrano nei noduli; ne esce azoto utilizzabile che resta nel suolo
    const a = W('fissa') - 0.2;
    s += E(t, a - 0.2, lbl(1800, 280, "AZOTO DELL'ARIA", { a: 'end', fill: C.coral }));
    const refill = [1, 4, 6, 8, 11, 13, 16, 19];
    refill.forEach((i, k) => {
      const px = P3[k % 3], st = a + k * 0.32, p = (t - st) / 1.4;
      if (p <= 0) return;
      const nod = k % 2 ? [px + 55, GY + 160] : [px + 80, GY + 100];
      if (p < 0.65) {
        const q = eio(p / 0.65), enter = clamp((p - 0.5) / 0.15);
        s += nPair(lerp(px + 210, nod[0], q), lerp(330 + (k % 3) * 25, nod[1], q), C.coral, { ang: 30 + k * 25, op: 1 - enter, r: 17 * (1 - 0.5 * enter) });
      } else {
        const q = eio((p - 0.65) / 0.35);
        s += nDot(lerp(nod[0], NPOS[i][0], q), lerp(nod[1], NPOS[i][1], q), C.line, { op: clamp(q * 3) });
      }
    });
    // etichetta dei noduli: in alto a sinistra, collegata a un nodulo libero della prima pianta
    s += E(t, W('grazie') - 0.4, lbl(140, GY - 92, 'NODULI', { a: 'start', size: 24 }) + lbl(140, GY - 60, 'CON BATTERI', { a: 'start', size: 24 }) +
      `<line x1="250" y1="${GY - 46}" x2="${P3[0] - 76}" y2="${GY + 74}" stroke="${C.line}" stroke-width="2"/>`);
    s += E(t, -0.2, legendN(C.line), { dy: 0 });
    return s + caption(t, W("dell'aria"), "Azoto dall'aria", '');
  } }) });

// 6 — Rhizobium (card)
scene('rhizobium', { make: (W) => ({
  capAt: W('fertilizzante'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, ink = C.ink;
    let g = E(t, -0.4, card(200, 150, 1520, 680, { rot: 1 }), { dy: 0 });
    g += E(t, -0.2, T(280, 250, 'DENTRO UN NODULO DELLA RADICE', { f: 'mono', size: 28, fill: ink, w: 700, ls: 4 }));
    const y = 470;
    // 1. azoto dell'aria
    let a1 = '';
    [[-40, -45, 20], [30, 15, -35], [-30, 75, 60]].forEach(([dx, dy, an]) => a1 += nPair(440 + dx, y + dy - 15, ink, { fill: C.cream, ang: an, r: 20 }));
    a1 += T(440, y + 150, "azoto dell'aria", { f: 'mono', size: 26, fill: ink, a: 'middle' });
    g += E(t, W('batteri') - 0.2, a1);
    g += E(t, W('genere'), arrow(560, y, 700, y, ink, 5));
    // 2. nodulo con batteri
    let nd = `<circle cx="860" cy="${y}" r="125" fill="${mix(C.cream, ink, 0.06)}" stroke="${ink}" stroke-width="4"/>`;
    for (let i = 0; i < 9; i++) {
      const bx = 860 + Math.cos(i * 2.4) * (30 + (i % 3) * 28), by = y + Math.sin(i * 2.4) * (30 + (i % 3) * 26), r = i * 40 + Math.sin(t * 2 + i) * 12;
      nd += `<rect x="${bx - 20}" y="${by - 8}" width="40" height="16" rx="8" transform="rotate(${r} ${bx} ${by})" fill="${C.cream}" stroke="${ink}" stroke-width="3"/>`;
    }
    nd += T(860, y + 175, 'batteri', { f: 'mono', size: 26, fill: ink, a: 'middle' }) + T(860, y + 215, 'Rhizobium', { f: 'serif', size: 44, it: true, fill: ink, a: 'middle' });
    g += E(t, W('genere') - 0.1, nd);
    g += E(t, W('trasformano'), arrow(1010, y, 1150, y, ink, 5));
    // 3. azoto utilizzabile -> pianta
    let a3 = nDot(1250, y - 20, ink, { fill: mix(C.cream, ink, 0.18) }) + nDot(1300, y + 30, ink, { fill: mix(C.cream, ink, 0.18) });
    a3 += T(1275, y + 150, 'forma utilizzabile', { f: 'mono', size: 26, fill: ink, a: 'middle' });
    g += E(t, W('forma') - 0.1, a3);
    g += E(t, W('piante'), arrow(1370, y, 1480, y, ink, 5) + `<g transform="translate(1560,${y + 10}) scale(0.5) translate(-1560,${-GY})">${bean(1560, 1, ink, { nodFill: C.cream }).replace(/fill="#0c0a09"/gi, `fill="${C.cream}"`)}</g>` +
      T(1560, y + 150, 'pianta', { f: 'mono', size: 26, fill: ink, a: 'middle' }));
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('fertilizzante'), 'Fertilizzante naturale, gratuito', 'gratuito', true);
  } }) });

// 7 — anno 3: radici e tuberi strutturano il suolo
scene('anno3', { make: (W) => ({
  capAt: W('struttura'),
  render(t) {
    let s = yearBase(t, 2, -1);
    NPOS.forEach(p => s += nDot(...p, C.line));
    const g0 = W('radice') - 0.2;
    s += carrot(P3[0], eo((t - g0) / 1.1)) + potato(P3[1], eo((t - W('tubero') + 0.2) / 1.1)) + carrot(P3[2], eo((t - g0 - 0.3) / 1.1));
    // canali e pori che si aprono in profondità
    const sp = eo((t - W('struttura')) / 1.2);
    if (sp > 0) for (let i = 0; i < 9; i++) {
      const x = 360 + i * 130 + rnd(i + 80) * 40, y0 = GY + 120 + rnd(i + 90) * 40, L = (90 + rnd(i) * 60) * sp;
      s += `<path d="M${x},${y0} q${12 - rnd(i + 5) * 24},${L * 0.5} ${4 - rnd(i + 6) * 8},${L}" ${ST(C.line, 2.5)} opacity="0.85"/>`;
    }
    const ap = eo((t - W('profondità') + 0.3) / 0.8);
    if (ap > 0) s += arrow(1700, GY + 20, 1700, GY + 20 + 190 * ap, C.coral, 7) + E(t, W('profondità') - 0.2, lbl(1666, GY + 110, 'IN', { a: 'end', fill: C.coral }) + lbl(1666, GY + 146, 'PROFONDITÀ', { a: 'end', fill: C.coral }));
    s += E(t, -0.2, legendN(C.line), { dy: 0 });
    return s + caption(t, W('struttura'), 'Suolo strutturato in profondità', '');
  } }) });

// 8 — anno 4: foglia o frutto sfrutta la fertilità
scene('anno4', { make: (W) => ({
  capAt: W('sfrutta'),
  render(t) {
    let s = yearBase(t, 3, -1);
    s += tomato(P3[0], eo((t - W('frutto') + 0.2) / 1.1)) + cabbage(P3[1], eo((t - W('foglia') + 0.1) / 1.1)) + tomato(P3[2], eo((t - W('frutto') - 0.1) / 1.1));
    const on = t >= W('fertilità') - 0.1, c = on ? C.coral : C.line;
    NPOS.forEach((p, i) => s += on ? pop(t, W('fertilità') - 0.1 + (i % 7) * 0.06, p[0], p[1], nDot(...p, C.coral), 0.4) || nDot(...p, C.line) : nDot(...p, C.line));
    s += E(t, -0.2, legendN(C.line, c), { dy: 0 });
    return s + caption(t, W('sfrutta'), 'Fertilità ricostituita', '');
  } }) });

// 9 — vantaggi: vista dall'alto, quattro campi che ruotano
scene('vantaggi', { make: (W) => ({
  capAt: W('rinnova'),
  render(t) {
    // quattro tappe fisse in senso orario; un solo campo (la tessera chiara) avanza di tappa in tappa
    const names = ['CEREALE', 'LEGUMINOSA', 'RADICE/TUBERO', 'FOGLIA/FRUTTO'];
    const pos = [[520, 190], [920, 190], [920, 510], [520, 510]], pw = 380, ph = 300; // TL, TR, BR, BL = orario
    const steps = [W('rinnova') - 0.2, W('riducono') - 0.2, W('equilibrati') - 0.2];
    let f = 0; steps.forEach(st => f += eio((t - st) / 0.6));
    const i0 = Math.min(3, Math.floor(f)), fr = f - i0, A = pos[i0], B = pos[Math.min(3, i0 + 1)];
    const mx = lerp(A[0], B[0], fr), my = lerp(A[1], B[1], fr);
    let s = '';
    // tappe (contorno tratteggiato)
    pos.forEach(([x, y], i) => s += E(t, -0.4 + i * 0.08, `<rect x="${x + 10}" y="${y + 10}" width="${pw - 20}" height="${ph - 20}" rx="10" fill="none" stroke="${C.lineDim}" stroke-width="3" stroke-dasharray="8 10"/>`, { dy: 0 }));
    // il campo che avanza
    let m = `<rect x="${mx + 10}" y="${my + 10}" width="${pw - 20}" height="${ph - 20}" rx="10" fill="${C.earth}" stroke="${C.ivory}" stroke-width="7"/>`;
    for (let j = 0; j < 5; j++) m += `<line x1="${mx + 40}" y1="${my + 60 + j * 44}" x2="${mx + pw - 40}" y2="${my + 60 + j * 44}" stroke="${C.lineDim}" stroke-width="3" stroke-dasharray="10 14"/>`;
    m += T(mx + pw / 2, my + ph - 34, 'IL CAMPO', { f: 'mono', size: 24, fill: C.ivory, w: 700, ls: 3, a: 'middle' });
    const bp = 1 - eo((t - W('riducono') + 0.1) / 0.6);
    if (bp > 0) m += `<g opacity="${bp.toFixed(3)}">` + bug(mx + pw - 90, my + 60, 1, C.line) + bug(mx + 90, my + 60, 1, C.line) + '</g>';
    s += E(t, -0.2, m, { dy: 0 });
    // etichette delle tappe (sopra il campo)
    pos.forEach(([x, y], i) => s += E(t, -0.3 + i * 0.08, `<rect x="${x + pw / 2 - 150}" y="${y + ph / 2 - 40}" width="300" height="84" rx="20" fill="${C.bg}" stroke="${C.line}" stroke-width="2.5"/>` +
      T(x + pw / 2, y + ph / 2 - 6, `ANNO ${i + 1}`, { f: 'mono', size: 24, fill: C.line, a: 'middle', w: 700, ls: 3 }) + T(x + pw / 2, y + ph / 2 + 28, names[i], { f: 'mono', size: 24, fill: C.line, a: 'middle' }), { dy: 0 }));
    // anello di rotazione al centro (verso orario)
    const cx = 910, cy = 500, r = 70, rot = f * 90;
    s += `<g transform="rotate(${rot} ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.bg}" stroke="${C.coral}" stroke-width="7" stroke-dasharray="150 70"/>` +
      [0, 1, 2].map(k => { const a = -Math.PI / 2 + k * 2.09 + 0.5; const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); return `<path d="M${x + Math.cos(a) * 16},${y + Math.sin(a) * 16} L${x - Math.cos(a) * 16},${y - Math.sin(a) * 16} L${x - Math.sin(a) * 22},${y + Math.cos(a) * 22} z" fill="${C.coral}"/>`; }).join('') + '</g>';
    // conseguenze
    s += E(t, W('rinnova') - 0.1, pillTag(1360, 330, 'il suolo si rinnova', C.line, C.bg));
    s += E(t, W('riducono') - 0.1, pillTag(1360, 470, 'meno parassiti', C.line, C.bg));
    s += E(t, W('equilibrati') - 0.1, pillTag(1360, 610, 'nutrienti equilibrati', C.line, C.bg));
    return s + caption(t, W('rinnova'), 'Il suolo si rinnova', '');
  } }) });

// 10 — meno chimica (card)
scene('sostenibile', { make: (W) => ({
  capAt: W('principio'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, ink = C.ink;
    let g = E(t, -0.4, card(300, 160, 1320, 660, { rot: -1 }), { dy: 0 });
    g += E(t, -0.2, T(380, 260, 'CON LA ROTAZIONE', { f: 'mono', size: 28, fill: ink, w: 700, ls: 4 }));
    const row = (y, label, icon, at) => E(t, at, icon + T(620, y + 18, label, { f: 'pop', size: 64, fill: ink }) +
      `<g transform="translate(0,${8 * Math.sin(clamp((t - at) / 0.6) * Math.PI)})">${`<line x1="1390" y1="${y - 46}" x2="1390" y2="${y + 10}" stroke="${ink}" stroke-width="9" stroke-linecap="round"/><path d="M1364,${y + 4} L1416,${y + 4} L1390,${y + 42} z" fill="${ink}"/>`}</g>` + T(1440, y + 18, 'meno', { f: 'serif', size: 60, it: true, fill: ink }));
    const sack = `<path d="M440,300 q-30,10 -36,80 q0,50 80,50 q80,0 80,-50 q-6,-70 -36,-80 z" fill="${C.cream}" stroke="${ink}" stroke-width="4"/><path d="M450,300 l-6,-20 h80 l-6,20" fill="${C.cream}" stroke="${ink}" stroke-width="4"/>`;
    const spray = `<rect x="430" y="490" width="70" height="120" rx="12" fill="${C.cream}" stroke="${ink}" stroke-width="4"/><path d="M445,490 v-26 h40 v26 M485,470 h30" fill="none" stroke="${ink}" stroke-width="4"/><circle cx="530" cy="462" r="4" fill="${ink}"/><circle cx="546" cy="474" r="4" fill="${ink}"/><circle cx="546" cy="452" r="4" fill="${ink}"/>`;
    g += row(375, 'concimi chimici', sack, W('concimi') - 0.1);
    g += row(560, 'pesticidi', spray, W('pesticidi') - 0.1);
    g += E(t, W('principio') - 0.1, `<line x1="380" y1="660" x2="1540" y2="660" stroke="${ink}" stroke-width="3"/>` +
      T(960, 740, "un principio dell'agricoltura sostenibile", { f: 'serif', size: 60, it: true, fill: ink, a: 'middle' }));
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('principio'), 'Agricoltura sostenibile', 'sostenibile', true);
  } }) });

// 11 — chiusura
scene('finale', { L: 0.5, tail: 3.3, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 400, 'La rotazione', { f: 'pop', size: 140, fill: C.ink, a: 'middle' }) + T(960, 540, 'delle colture', { f: 'pop', size: 140, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('cambia') - 0.1, 960, 650, 'cambia la pianta, e il suolo si rinnova', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: 'rinnova' });
    s += E(t, W('rinnova') + 0.3, `<line x1="760" y1="720" x2="1160" y2="720" stroke="${C.ink}" stroke-width="3"/>` + T(960, 780, 'PROFTECNOLOGIA · MC ALI-2-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5 }));
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
