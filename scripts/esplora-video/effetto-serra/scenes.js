// Scene: ognuna ha render(t, D) puro. W(parola, n) = tempo locale della n-esima occorrenza nella voce.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const capAt = def.capAt != null ? def.capAt : null;
  const nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (capAt != null) D = Math.max(D, capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, capAt, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<radialGradient id="glow"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.55"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

const RAYX = [640, 820, 1000, 1180, 1360];
const sunP = [290, 270];
const MOLS = [['H2O', 560, 720, 'H₂O'], ['CO2', 830, 690, 'CO₂'], ['CH4', 1110, 700, 'CH₄'], ['O3', 1380, 725, 'O₃']];

// 1 — aggancio
scene('hook', { L: 0.6, make: (W) => ({
  capAt: null,
  render(t) {
    const fr = eio((t - W('ghiacciata')) / 0.9);
    let s = E(t, -0.4, earth({ ice: fr }), { dy: 0 }) + E(t, -0.2, sun(t), { dy: 0 });
    s += E(t, 0.3, thermo(1600, 250, 470, lerp(15, -18, fr), { label: 'TEMPERATURA MEDIA' }));
    s += words(t, W('allora') - 0.1, 760, 470, 'Amico o nemico?', { f: 'pop', size: 104, a: 'middle', key: 'nemico?', cw: 0.62 });
    return s;
  } }) });

// 2 — luce visibile
scene('luce', { make: (W) => ({
  capAt: W('visibile'),
  render(t) {
    let s = earth() + sun(t);
    RAYX.forEach((x, i) => {
      const t0 = W('luce') - 0.5 + i * 0.16, p = eo((t - t0) / 1.0), ty = surfY(x);
      s += wave(sunP[0] + 50, sunP[1] + 50, x, ty, p, { lam: 24, A: 7, ph: t * 14, c: C.line, from: 0 });
      if (p >= 1) s += `<circle cx="${x}" cy="${ty}" r="${6 + 3 * Math.sin(t * 6 + i)}" fill="${C.line}"/>`;
    });
    s += E(t, W('visibile') + 0.2, T(1060, 520, 'LUCE VISIBILE · ONDA CORTA', { f: 'mono', size: 26, fill: C.line, ls: 3 }));
    return s + caption(t, W('visibile'), 'Luce visibile, onda corta', 'onda corta');
  } }) });

// 3 — infrarosso
scene('calore', { make: (W) => ({
  capAt: W('radiazione'),
  render(t) {
    const warm = eio((t - W('scalda')) / 0.9);
    let s = earth({ warm }) + sun(t);
    RAYX.forEach((x, i) => { s += wave(sunP[0] + 50, sunP[1] + 50, x, surfY(x), 1, { lam: 24, A: 7, ph: t * 14, op: 0.35 }); });
    [720, 920, 1120, 1320].forEach((x, i) => {
      const t0 = W('verso') + i * 0.2, p = eo((t - t0) / 1.8), y0 = surfY(x) - 4;
      s += wave(x, y0, x + 60, -60, p, { lam: 80, A: 14, ph: t * 6, c: C.coral, sw: 4 });
    });
    s += E(t, W('infrarossa'), T(1440, 470, 'INFRAROSSO · ONDA LUNGA', { f: 'mono', size: 26, fill: C.coral, ls: 3 }));
    return s + caption(t, W('radiazione'), 'Infrarosso, onda lunga', 'onda lunga');
  } }) });

// 4 — i gas serra
scene('gas', { make: (W) => {
  const tw = [W('vapore'), W('anidride'), W('metano'), W('ozono')];
  return { capAt: W('anche'), render(t) {
    const down = eio((t - W('basso')) / 1.0);
    let s = earth({ warm: 1, dense: 0.6 }) + sun(t);
    // altre molecole senza etichetta
    [[420, 760, 'CO2'], [700, 790, 'H2O'], [980, 770, 'CO2'], [1250, 800, 'H2O'], [1500, 770, 'CO2']].forEach(([x, y, k], i) =>
      s += E(t, W('assorbono') - 0.6 + i * 0.1, molecule(k, x, y, { k: 0.6, stroke: C.lineDim }), { dy: 10 }));
    // parte del calore passa e sfugge nello spazio
    [700, 1250].forEach((x, i) => { const t0 = W('assorbono') + 0.1 + i * 0.15; if (t > t0) s += wave(x, surfY(x) - 4, x + 40, -60, eo((t - t0) / 1.8), { lam: 80, A: 12, ph: t * 6, c: C.coral, sw: 4 }); });
    MOLS.forEach(([k, x, y, lab], i) => {
      const abs = W('assorbono') + i * 0.12, hit = eo((t - abs - 0.7) / 0.3);
      const st = mix(C.line, C.coral, hit * (1 - eo((t - abs - 1.6) / 0.6)));
      // onda IR dalla superficie alla molecola
      if (t > abs) s += wave(x, surfY(x) - 4, x, y + 34, eo((t - abs) / 0.7), { lam: 80, A: 12, ph: t * 6, c: C.coral, sw: 4, op: 1 - 0.6 * hit });
      s += E(t, tw[i], molecule(k, x, y, { label: lab, stroke: st }));
      // riemissione in tutte le direzioni
      const re = eo((t - W('rimandano') - i * 0.08) / 0.5);
      if (re > 0) for (let j = 0; j < 6; j++) {
        const a = -Math.PI / 2 + j * Math.PI / 3, isDown = j === 3;
        let len = 90 * re; if (isDown) len = lerp(90 * re, surfY(x) - y - 70, down);
        const c = isDown ? mix(C.line, C.coral, down) : C.line;
        const xa = x + Math.cos(a) * 46, ya = y + Math.sin(a) * 46, xb = x + Math.cos(a) * (46 + len), yb = y + Math.sin(a) * (46 + len);
        s += wave(xa, ya, xb - Math.cos(a) * 10, yb - Math.sin(a) * 10, 1, { lam: 34, A: 6, ph: t * 8, c, sw: isDown ? 3 + down : 3, head: false });
        s += `<path d="M${xb},${yb} L${xb - 16 * Math.cos(a - 0.45)},${yb - 16 * Math.sin(a - 0.45)} L${xb - 16 * Math.cos(a + 0.45)},${yb - 16 * Math.sin(a + 0.45)} z" fill="${c}"/>`;
      }
    });
    s += thermo(1760, 250, 380, lerp(-18, 15, down), { label: '' });
    return s + caption(t, W('anche'), 'Anche verso il basso', 'basso');
  } };
} });

// 5 — effetto serra naturale
scene('temperatura', { make: (W) => ({
  capAt: W('quindici') + 0.2,
  render(t, D) {
    const k = 1 + 0.02 * t / D;
    let s = lightBg();
    let g = E(t, -0.4, T(960, 225, 'L’effetto serra <tspan font-style="italic">naturale</tspan>', { f: 'serif', size: 84, fill: C.ink, a: 'middle', raw: true }), { dy: 0 });
    g += E(t, -0.2, card(260, 300, 1400, 520), { dy: 0 });
    g += `<line x1="960" y1="350" x2="960" y2="770" stroke="${C.ink}" stroke-width="2" opacity="0.25"/>`;
    g += E(t, W('senza'), T(610, 400, 'SENZA GAS SERRA', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 4 }));
    g += E(t, W('meno'), T(610, 640, '−18 °C', { f: 'pop', size: 170, fill: C.ink, a: 'middle' }));
    g += E(t, W('meno') + 0.3, T(610, 730, 'senza effetto serra', { f: 'serif', size: 44, fill: C.ink, a: 'middle', it: true }));
    g += E(t, W('con'), T(1310, 400, 'CON GAS SERRA', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 4 }));
    g += E(t, W('più'), T(1310, 640, '+15 °C', { f: 'pop', size: 170, fill: C.coral, a: 'middle' }));
    g += E(t, W('quindici') + 0.2, T(1310, 730, 'con l’effetto serra naturale', { f: 'serif', size: 44, fill: C.ink, a: 'middle', it: true }));
    s += `<g transform="translate(960,560) scale(${k}) translate(-960,-560)">${g}</g>`;
    return s + caption(t, W('quindici') + 0.2, 'Serve alla vita', 'vita', true);
  } }) });

// 6 — CO2 in ppm
scene('ppm', { make: (W) => ({
  capAt: W('1750'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(200, 170, 1520, 640, { rot: -1 }), { dy: 0 });
    g += E(t, -0.3, T(270, 270, 'Anidride carbonica nell’atmosfera', { f: 'serif', size: 64, fill: C.ink }));
    g += E(t, -0.2, T(270, 322, 'PPM = PARTI PER MILIONE', { f: 'mono', size: 26, fill: C.ink, ls: 3 }));
    const sc = 1150 / 440, x0 = 450;
    const b1 = eo((t - W('da')) / 0.9), b2 = eo((t - W('a')) / 1.0);
    g += E(t, W('1750'), T(270, 455, '1750', { f: 'pop', size: 58, fill: C.ink }));
    g += `<rect x="${x0}" y="405" width="${280 * sc * b1}" height="64" rx="8" fill="${C.ink}"/>`;
    g += E(t, W('280'), T(x0 + 280 * sc + 24, 452, '280 ppm', { f: 'mono', size: 36, fill: C.ink, w: 700 }));
    g += E(t, W('a') - 0.3, T(270, 615, '2023', { f: 'pop', size: 58, fill: C.ink }));
    g += `<rect x="${x0}" y="565" width="${280 * sc * b2}" height="64" rx="8" fill="${C.ink}"/>`;
    const ext = eo((t - W('a') - 0.6) / 0.8);
    if (ext > 0) g += `<rect x="${x0 + 280 * sc - 8}" y="565" width="${140 * sc * ext + 8}" height="64" rx="8" fill="${C.coral}"/>`;
    g += E(t, W('420'), T(x0 + 420 * sc - 6, 680, 'oltre 420 ppm', { f: 'mono', size: 36, fill: C.ink, w: 700, a: 'end' }));
    g += E(t, W('cinquanta'), T(1640, 330, '+50%', { f: 'pop', size: 150, fill: C.coral, a: 'end' }));
    g += E(t, 0.6, T(270, 772, 'DATI: MC ENE-3-02, PARAGRAFO 6', { f: 'mono', size: 24, fill: C.ink, ls: 3, op: 0.8 }));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('1750'), 'Dal 1750 al 2023', '2023', true);
  } }) });

// 7 — metano e coperta più spessa
scene('metano', { make: (W) => ({
  capAt: W('più', 1),
  render(t) {
    const tr = eio((t - W('trattenuto')) / 1.0);
    let s = earth({ warm: 1, dense: 0.6 + 0.4 * eo((t - W('gas')) / 1) }) + sun(t);
    MOLS.forEach(([k, x, y]) => s += molecule(k, x, y, { stroke: C.line }));
    // il metano aumenta di poco in numero assoluto: 3 molecole in più; la CO₂ resta più abbondante
    [[440, 780], [990, 790], [1530, 790]].forEach(([x, y], i) => s += E(t, W('metano') + i * 0.12, molecule('CH4', x, y, { k: 0.6, stroke: C.line }), { dy: 12 }));
    for (let i = 0; i < 8; i++) {
      const x = 420 + i * 150, y = atmY(x) + 60 + ((i * 53) % 70);
      s += E(t, W('gas') + i * 0.06, molecule('CO2', x, y, { k: 0.5, stroke: C.line }), { dy: 12 });
    }
    // più calore che torna giù
    [600, 860, 1120, 1380].forEach((x, i) => { if (tr > 0) s += arrow(x, atmY(x) + 40, x, lerp(atmY(x) + 40, surfY(x) - 14, tr), C.coral, 5); });
    s += E(t, W('centosessanta') - 0.1, `<rect x="700" y="150" width="520" height="150" rx="20" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` +
      T(760, 248, 'CH₄', { f: 'mono', size: 56, fill: C.line, w: 700 }) + T(1180, 258, '+160%', { f: 'pop', size: 92, fill: C.line, a: 'end' }));
    s += E(t, W('centosessanta') + 0.4, T(960, 345, 'AUMENTO DAL 1750 A OGGI', { f: 'mono', size: 24, fill: C.line, a: 'middle', ls: 4 }));
    s += thermo(1760, 250, 380, lerp(15, 16.2, tr), { ticks: [-18, 0, 15] });
    return s + caption(t, W('più', 1), 'Più calore trattenuto', 'trattenuto');
  } }) });

// 8 — combustione
scene('combustione', { tail: 0.9, make: (W) => ({
  capAt: W('carbonio'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(260, 200, 1400, 620), { dy: 0 });
    g += E(t, -0.3, T(330, 300, 'Che cosa succede quando bruciamo', { f: 'serif', size: 60, fill: C.ink }));
    ['CARBONE', 'PETROLIO', 'GAS NATURALE'].forEach((l, i) => {
      const w = l.length * 17 + 44, x = 330 + [0, 230, 470][i];
      g += E(t, W('combustibili') + i * 0.15, `<rect x="${x}" y="335" width="${w}" height="48" rx="24" fill="none" stroke="${C.ink}" stroke-width="2"/>` + T(x + w / 2, 367, l, { f: 'mono', size: 22, fill: C.ink, a: 'middle', ls: 2 }));
    });
    // atomi che si legano
    const mv = eio((t - W('bruciando')) / 1.4), join = eio((t - W('lega')) / 0.6);
    const cy = 540, cx = 960;
    const cX = lerp(560, cx, mv), oX1 = lerp(1260, cx - 120, mv), oX2 = lerp(1360, cx + 120, mv);
    const oY1 = lerp(cy, cy, mv);
    if (join > 0) g += `<line x1="${cx - 120}" y1="${cy}" x2="${cx + 120}" y2="${cy}" stroke="${C.ink}" stroke-width="${6 * join}"/>`;
    g += E(t, 0.2, atom(cX, cy, 58, C.ink, C.ink, 'C', C.ivory));
    g += E(t, 0.4, (join > 0 ? '' : `<line x1="${oX1}" y1="${cy}" x2="${oX2}" y2="${cy}" stroke="${C.ink}" stroke-width="5"/>`) + atom(oX1, oY1, 46, C.cream, C.ink, 'O', C.ink) + atom(oX2, cy, 46, C.cream, C.ink, 'O', C.ink));
    if (join > 0) g += `<circle cx="${cx}" cy="${cy}" r="${190 + 30 * join}" fill="url(#glow)" opacity="${join * (1 - 0.5 * eo((t - W('lega') - 0.8) / 1))}"/>`;
    g += E(t, W('lega') + 0.2, T(960, 690, 'C + O₂ → CO₂ + <tspan fill="' + C.coral + '">calore</tspan>', { f: 'pop', size: 64, fill: C.ink, a: 'middle', raw: true }));
    s += `<g transform="translate(960,510) scale(${k}) translate(-960,-510)">${g}</g>`;
    return s + caption(t, W('carbonio'), 'Il carbonio diventa CO₂', 'CO₂', true);
  } }) });

// 9 — quanta CO2
scene('chili', { tail: 1.0, make: (W) => ({
  capAt: W('benzina'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, u = 190;
    let g = '';
    g += E(t, -0.4, card(160, 140, 1600, 340, { rot: -1 }), { dy: 0 });
    g += E(t, W('chilo') - 0.3, T(230, 250, '1 kg di carbone', { f: 'serif', size: 56, fill: C.ink }));
    g += E(t, W('chilo'), `<rect x="230" y="300" width="${u}" height="70" rx="8" fill="${C.ink}"/>` + T(230 + u / 2, 348, '1 kg', { f: 'mono', size: 28, fill: C.ivory, a: 'middle', w: 700 }));
    g += E(t, W('libera'), arrow(470, 335, 600, 335, C.ink, 5));
    const b1 = eo((t - W('tre')) / 1.1);
    g += `<rect x="640" y="300" width="${3.67 * u * b1}" height="70" rx="8" fill="${C.coral}"/>`;
    g += E(t, W('sessantasette'), T(640, 250, '≈ 3,67 kg di CO₂', { f: 'pop', size: 56, fill: C.ink }));
    g += E(t, W('litro') - 0.5, card(160, 530, 1600, 300, { rot: 1 }), { dy: 0 });
    g += E(t, W('litro') - 0.2, T(230, 620, '1 litro di benzina', { f: 'serif', size: 56, fill: C.ink }));
    g += E(t, W('litro'), `<rect x="230" y="670" width="${u}" height="70" rx="35" fill="none" stroke="${C.ink}" stroke-width="3"/>` + T(230 + u / 2, 718, '1 litro', { f: 'mono', size: 28, fill: C.ink, a: 'middle', w: 700 }));
    g += E(t, W('benzina'), arrow(470, 705, 600, 705, C.ink, 5));
    const b2 = eo((t - W('due')) / 1.0);
    g += `<rect x="640" y="670" width="${2.3 * u * b2}" height="70" rx="8" fill="${C.coral}"/>`;
    g += E(t, W('virgola', 1), T(640, 620, '≈ 2,3 kg di CO₂', { f: 'pop', size: 56, fill: C.ink }));
    g += E(t, W('anidride') + 0.3, T(1700, 412, 'pesa di più perché l’ossigeno', { f: 'serif', size: 36, fill: C.ink, a: 'end', it: true }) +
      T(1700, 452, 'dell’aria si aggiunge al carbonio', { f: 'serif', size: 36, fill: C.ink, a: 'end', it: true }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('benzina'), 'Invisibile, ma pesa', 'pesa', true);
  } }) });

// 10 — ghiaccio e oceano
scene('ghiaccio', { make: (W) => ({
  capAt: W("l'oceano"),
  render(t) {
    const melt = eio((t - W('scioglie')) / 1.3), sea = 720;
    let s = sun(t);
    // oceano in sezione
    let d = `M0,${sea}`; for (let x = 0; x <= 1920; x += 20) d += ` L${x},${sea + 6 * Math.sin(x / 60 + t * 2)}`; d += ` L1920,1080 L0,1080 z`;
    s += `<path d="${d}" fill="${mix(C.bg, C.line, 0.06)}" stroke="${C.line}" stroke-width="3"/>`;
    s += T(1740, sea + 64, 'OCEANO', { f: 'mono', size: 24, fill: C.line, ls: 4, a: 'middle', op: 0.8 });
    // banchisa che si ritira
    const iw = lerp(900, 180, melt);
    s += `<path d="M120,${sea - 26} L${120 + iw},${sea - 26} L${120 + iw - 20},${sea + 30} L140,${sea + 30} z" fill="${C.ivory}" stroke="${C.line}" stroke-width="3"/>`;
    s += E(t, -0.2, T(170, sea - 50, 'GHIACCIO ARTICO', { f: 'mono', size: 24, fill: C.line, ls: 4 }), { dy: 0 });
    // raggio sul ghiaccio: riflesso
    const r1 = eo((t + 0.3) / 1.0), back = eo((t - 0.8) / 1.0) * (1 - melt);
    s += wave(370, 340, 560, sea - 26, r1, { lam: 24, A: 7, ph: t * 14, op: 1 - melt * 0.8 });
    if (back > 0) s += wave(560, sea - 26, 900, 200, back, { lam: 24, A: 7, ph: t * 14 });
    s += E(t, 1.0, T(910, 250, 'riflessa', { f: 'serif', size: 40, it: true, fill: C.line }), { dy: 0 }).replace(/opacity="([\d.]+)"/, (m, o) => `opacity="${(o * (1 - melt)).toFixed(3)}"`);
    // raggio sull'oceano: assorbito
    const r2 = eo((t - W("l'oceano") + 0.4) / 1.0), ab = eo((t - W("l'oceano") - 0.6) / 0.8);
    s += wave(390, 320, 1250, sea, r2, { lam: 24, A: 7, ph: t * 14 });
    if (ab > 0) s += `<ellipse cx="1250" cy="${sea + 70}" rx="${220 * ab}" ry="${90 * ab}" fill="url(#glow)"/>` + E(t, W("l'oceano") + 0.6, T(1250, sea + 170, 'assorbita → calore', { f: 'serif', size: 44, it: true, fill: C.line, a: 'middle' }), { dy: 0 });
    s += loopRing(t, W('più', 1) - 0.1, 1480, 330, 120, ['più caldo', 'meno ghiaccio']);
    return s + chapterBar(t, 6, false) + caption(t, W("l'oceano"), 'Bianco riflette, scuro assorbe', 'assorbe');
  } }) });

// 11 — permafrost
scene('permafrost', { make: (W) => ({
  capAt: W('altro'),
  render(t) {
    const thaw = eio((t - W('permafrost')) / 0.9), gy = 700;
    let s = sun(t);
    s += `<rect x="0" y="${gy}" width="1920" height="${1080 - gy}" fill="${mix(C.bg, C.line, 0.07)}"/><line x1="0" y1="${gy}" x2="1920" y2="${gy}" stroke="${C.line}" stroke-width="3"/>`;
    for (let r = 0; r < 4; r++) for (let i = 0; i < 16; i++) {
      const x = 60 + i * 120 + (r % 2) * 60, y = gy + 60 + r * 70;
      s += `<path d="M${x - 14},${y} L${x + 14},${y} M${x - 7},${y - 12} L${x + 7},${y + 12} M${x - 7},${y + 12} L${x + 7},${y - 12}" stroke="${C.ivory}" stroke-width="2.5" opacity="${(0.7 * (1 - thaw)).toFixed(3)}"/>`;
    }
    s += E(t, -0.2, T(96, gy - 24, 'PERMAFROST · SUOLO GHIACCIATO', { f: 'mono', size: 24, fill: C.line, ls: 4 }), { dy: 0 });
    // bolle di metano che salgono
    for (let i = 0; i < 9; i++) {
      const t0 = W('scongela') + i * 0.16, p = clamp((t - t0) / 3.2);
      if (p <= 0) continue;
      const x = 520 + ((i * 4) % 9) * 95 + 20 * Math.sin(t * 2 + i), y = lerp(gy + 120, 200 + (i % 3) * 40, eo(p));
      s += E(t, t0, molecule('CH4', x, y, { k: 0.6, stroke: C.line }), { dy: 0 });
    }
    s += E(t, W('metano'), T(1000, 160, 'CH₄', { f: 'mono', size: 44, fill: C.line, w: 700 }));
    s += loopRing(t, W('altro') - 0.1, 1560, 400, 170, ['più caldo', 'disgelo', 'più metano'], { c: C.coral });
    return s + chapterBar(t, 6, false) + caption(t, W('altro'), 'Il ciclo si rinforza', 'rinforza');
  } }) });

// 12 — Parigi e chiusura
scene('finale', { tail: 2.2, make: (W) => ({
  capAt: null,
  render(t, D) {
    const endAt = W('capire') - 0.1;
    let s = lightBg();
    if (t < endAt) {
      const k = 1 + 0.02 * t / D;
      let g = E(t, -0.4, card(360, 200, 1200, 600, { rot: -1.5 }), { dy: 0 });
      g += E(t, -0.2, T(960, 320, 'ACCORDO DI PARIGI · 2015', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5 }));
      g += E(t, W('entro') - 0.1, T(960, 560, '+1,5 °C', { f: 'pop', size: 220, fill: C.coral, a: 'middle' }));
      g += E(t, W('entro') + 0.2, T(960, 660, 'di riscaldamento al massimo', { f: 'serif', size: 46, fill: C.ink, a: 'middle', it: true }) +
        T(960, 715, 'rispetto all’epoca preindustriale', { f: 'serif', size: 46, fill: C.ink, a: 'middle', it: true }));
      s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
      return s + chapterBar(t, 6, true);
    }
    const u = t - endAt;
    s += E(u, 0, T(960, 470, 'Effetto serra', { f: 'pop', size: 150, fill: C.ink, a: 'middle' }));
    s += words(u, 0.4, 960, 580, 'capire il meccanismo è il primo passo', { f: 'serif', size: 58, fill: C.ink, a: 'middle', it: true, key: 'meccanismo', cw: 0.42 });
    s += E(u, 1.3, `<line x1="760" y1="660" x2="1160" y2="660" stroke="${C.coral}" stroke-width="4"/>` + T(960, 720, 'PROFTECNOLOGIA · MC ENE-3-02', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 5 }));
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
  // spinta lenta di camera sulle scene scure
  if (!S.light) inner = `<g transform="translate(960,540) scale(${1 + 0.025 * t / S.D}) translate(-960,-540)">${inner}</g>`;
  body += inner;
  if (!['ghiaccio', 'permafrost', 'finale'].includes(S.id) && S.cap !== undefined) body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
