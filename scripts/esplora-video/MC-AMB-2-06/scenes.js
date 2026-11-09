// I sensori urbani — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.minEnd != null) D = Math.max(D, def.minEnd);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.ivory}" stop-opacity="0.55"/><stop offset="1" stop-color="${C.ivory}" stop-opacity="0.04"/></linearGradient></defs>`;

const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.line, ls: 3, a: o.a || 'middle', w: 600 });
const DIM = mix(C.bg, C.line, 0.45);
function pillTag(x, y, s, ink, bg, o = {}) {
  const sz = o.size || 28, w = tw(s, 'mono', sz) + 44;
  const x0 = o.a === 'middle' ? x - w / 2 : x;
  return `<rect x="${x0}" y="${y - sz - 7}" width="${w}" height="${sz + 22}" rx="${(sz + 22) / 2}" fill="${bg}" stroke="${ink}" stroke-width="2"/>` + T(x0 + w / 2, y, s, { f: 'mono', size: sz, fill: ink, a: 'middle' });
}
// skyline a filo (sfondo)
function skyline(gy, op = 0.5, o = {}) {
  const B = o.B || [[120, 230], [260, 330], [420, 200], [540, 290], [700, 380], [880, 240], [1010, 310], [1180, 220], [1320, 350], [1480, 260], [1620, 300], [1760, 210]];
  let s = '';
  B.forEach(([x, h], i) => {
    const w = 120 + (i % 3) * 14;
    s += `<rect x="${x}" y="${gy - h}" width="${w}" height="${h}" fill="none" stroke="${C.line}" stroke-width="2" opacity="${op}"/>`;
    for (let r = gy - h + 30; r < gy - 40; r += 46) for (let c = x + 22; c < x + w - 30; c += 38)
      s += `<rect x="${c}" y="${r}" width="16" height="20" fill="none" stroke="${C.line}" stroke-width="1.5" opacity="${op * 0.6}"/>`;
  });
  return s;
}
// strada in sezione
function road(gy, o = {}) {
  let s = `<rect x="0" y="${gy}" width="1920" height="${o.depth || 90}" fill="${mix(C.bg, C.line, 0.07)}"/>`;
  s += `<line x1="0" y1="${gy}" x2="1920" y2="${gy}" stroke="${C.line}" stroke-width="4"/>`;
  s += `<line x1="0" y1="${gy + (o.depth || 90)}" x2="1920" y2="${gy + (o.depth || 90)}" stroke="${C.line}" stroke-width="2" opacity="0.6"/>`;
  for (let x = 30; x < 1920; x += 54) s += `<line x1="${x}" y1="${gy + (o.depth || 90) + 8}" x2="${x - 22}" y2="${gy + (o.depth || 90) + 32}" stroke="${C.line}" stroke-width="2" opacity="0.35"/>`;
  return s;
}
// veicoli a filo (vista laterale); x = centro, gy = suolo
function wheel(x, y, r) { return `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="${r * 0.35}" fill="none" stroke="${C.line}" stroke-width="3"/>`; }
function car(x, gy, o = {}) {
  const k = o.k || 1, ink = o.ink || C.line, bg = o.bg || C.bg, r = 34 * k;
  const p = (dx, dy) => `${x + dx * k},${gy + dy * k}`;
  let s = `<path d="M${p(-190, -34)} L${p(-190, -80)} Q${p(-185, -96)} ${p(-150, -100)} L${p(-95, -104)} L${p(-50, -150)} L${p(70, -150)} L${p(125, -104)} L${p(175, -96)} Q${p(192, -90)} ${p(192, -60)} L${p(192, -34)} Z" fill="${bg}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="M${p(-80, -106)} L${p(-44, -140)} L${p(6, -140)} L${p(6, -106)} Z M${p(18, -106)} L${p(18, -140)} L${p(64, -140)} L${p(104, -106)} Z" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  if (o.wheels !== false) s += [-115, 115].map(d => `<circle cx="${x + d * k}" cy="${gy - r}" r="${r}" fill="${bg}" stroke="${ink}" stroke-width="4"/><circle cx="${x + d * k}" cy="${gy - r}" r="${r * 0.35}" fill="none" stroke="${ink}" stroke-width="3"/>`).join('');
  return s;
}
function moto(x, gy, o = {}) {
  const k = o.k || 1, ink = o.ink || C.line, bg = o.bg || C.bg, r = 30 * k;
  const p = (dx, dy) => `${x + dx * k},${gy + dy * k}`;
  let s = [-80, 80].map(d => `<circle cx="${x + d * k}" cy="${gy - r}" r="${r}" fill="${bg}" stroke="${ink}" stroke-width="4"/>`).join('');
  s += `<path d="M${p(-80, -30)} L${p(-30, -70)} L${p(40, -70)} L${p(80, -30)} M${p(40, -70)} L${p(60, -110)} L${p(80, -112)} M${p(-50, -80)} L${p(20, -80)}" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  return s;
}
function truck(x, gy, o = {}) {
  const k = o.k || 1, ink = o.ink || C.line, bg = o.bg || C.bg, r = 34 * k;
  const p = (dx, dy) => `${x + dx * k},${gy + dy * k}`;
  let s = `<path d="M${p(-210, -34)} L${p(-210, -190)} L${p(70, -190)} L${p(70, -34)} Z" fill="${bg}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="M${p(82, -34)} L${p(82, -140)} L${p(160, -140)} L${p(205, -90)} L${p(205, -34)} Z" fill="${bg}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="M${p(100, -95)} L${p(100, -126)} L${p(152, -126)} L${p(180, -95)} Z" fill="none" stroke="${ink}" stroke-width="3"/>`;
  s += [-150, -60, 150].map(d => `<circle cx="${x + d * k}" cy="${gy - r}" r="${r}" fill="${bg}" stroke="${ink}" stroke-width="4"/>`).join('');
  return s;
}
// lampione: x = palo, gy = suolo, lv = intensità 0..1
function lamp(x, gy, lv, o = {}) {
  const top = gy - 420, hx = x + 70;
  let s = '';
  if (lv > 0) {
    const reach = gy, spread = 210;
    s += `<path d="M${hx - 40},${top + 26} L${hx + 40},${top + 26} L${hx + spread},${reach} L${hx - spread},${reach} Z" fill="url(#cone)" opacity="${lv.toFixed(3)}"/>`;
  }
  s += `<line x1="${x}" y1="${gy}" x2="${x}" y2="${top + 10}" stroke="${C.line}" stroke-width="6"/>`;
  s += `<path d="M${x},${top + 10} Q${x},${top - 14} ${x + 30},${top - 6} L${hx},${top}" fill="none" stroke="${C.line}" stroke-width="6"/>`;
  s += `<path d="M${hx - 46},${top + 26} L${hx - 30},${top - 4} L${hx + 30},${top - 4} L${hx + 46},${top + 26} Z" fill="${C.bg}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<rect x="${x - 24}" y="${top + 60}" width="48" height="34" rx="6" fill="${o.boxFill || C.bg}" stroke="${o.boxC || C.line}" stroke-width="3"/>`;
  return s;
}
function arcs(x, y, n, r0, gap, a0, a1, p, c, sw = 4) { // onde di segnale
  let s = '';
  for (let i = 0; i < n; i++) {
    const r = r0 + i * gap, q = clamp(p * n - i); if (q <= 0) continue;
    const x1 = x + r * Math.cos(a0), y1 = y + r * Math.sin(a0), x2 = x + r * Math.cos(a1), y2 = y + r * Math.sin(a1);
    s += `<path d="M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" opacity="${q.toFixed(3)}"/>`;
  }
  return s;
}
function pulse(x1, y1, x2, y2, p, c = C.line) { // impulso di dati lungo un segmento
  if (p <= 0 || p >= 1) return '';
  const x = lerp(x1, x2, p), y = lerp(y1, y2, p);
  return `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/>`;
}

// ===== 1 — aggancio: sensori ovunque =====
scene('hook', { tail: 0.95, make: (W) => ({
  capAt: W('misurano'),
  render(t) {
    const gy = 760; let s = '';
    s += E(t, -0.4, skyline(gy, 0.35, { B: [[120, 230], [260, 330], [420, 200], [540, 290], [700, 330], [1320, 350], [1480, 260], [1620, 300], [1760, 210]] }), { dy: 0 });
    s += road(gy);
    s += lamp(350, gy, 0);
    // cassonetto con sensore sul coperchio
    s += `<path d="M900,${gy} L910,${gy - 170} L1010,${gy - 170} L1020,${gy} Z" fill="${C.bg}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/><rect x="896" y="${gy - 188}" width="128" height="18" rx="5" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`;
    // spira nella strada collegata a un armadietto a bordo strada
    s += `<rect x="1330" y="${gy + 18}" width="240" height="26" rx="8" fill="none" stroke="${C.line}" stroke-width="3"/><rect x="1345" y="${gy + 24}" width="210" height="14" rx="5" fill="none" stroke="${C.line}" stroke-width="2"/>`;
    s += `<path d="M1330,${gy + 31} L1250,${gy + 31} L1250,${gy}" fill="none" stroke="${C.line}" stroke-width="3"/><rect x="1215" y="${gy - 84}" width="70" height="84" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
    s += car(1660, gy, { k: 0.75 });
    // [sensore x, y, etichetta, punto d'arrivo sul box, posizione etichetta]
    const S = [[420, 420, 'ARIA · LUCE', [860, 308], [440, 500, 'start']], [960, gy - 210, 'RIFIUTI', [960, 308], [1000, gy - 200, 'start']], [1250, gy - 106, 'TRAFFICO', [1060, 308], [1300, gy - 30, 'start']]];
    S.forEach(([x, y, l, [ex, ey], [lx, ly]], i) => {
      const t0 = W('sensori') + i * 0.2;
      s += pop(t, t0, x, y, `<circle cx="${x}" cy="${y}" r="14" fill="${C.line}"/>`);
      s += arcs(x, y, 3, 28, 20, -2.4, -0.74, (t - t0) / 0.8, C.line, 3);
      s += E(t, W('misurano') + i * 0.15, pillTag(lx, ly, l, C.line, C.bg, { size: 24 }));
      if (t > W('mandano') + i * 0.25) {
        const L = Math.hypot(ex - x, ey - y), ux = (ex - x) / L, uy = (ey - y) / L, sx = x + ux * 84, sy = y + uy * 84;
        const p = ((t - W('mandano') - i * 0.25) % 1.2) / 1.2;
        s += `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${C.line}" stroke-width="2" stroke-dasharray="4 10" opacity="0.7"/>`;
        s += pulse(sx, sy, ex, ey, p);
      }
    });
    s += pop(t, W('sistema') - 0.15, 960, 240, `<rect x="760" y="190" width="400" height="104" rx="16" fill="${C.bg}" stroke="${C.coral}" stroke-width="5"/>` + T(960, 254, 'SISTEMA CENTRALE', { f: 'mono', size: 30, fill: C.coral, a: 'middle', ls: 3, w: 700 }));
    return s + caption(t, W('misurano'), 'Misurano e trasmettono', '');
  } }) });

// ===== 2 — la spira induttiva =====
scene('spira', { make: (W) => ({
  capAt: W('altera'),
  render(t) {
    const gy = 600, cx = 900, cy = gy + 22; let s = '';
    s += `<rect x="0" y="${gy}" width="1920" height="100" fill="${mix(C.bg, C.line, 0.09)}"/><rect x="0" y="${gy + 100}" width="1920" height="140" fill="${mix(C.bg, C.line, 0.04)}"/>`;
    for (let x = 20; x < 1920; x += 50) s += `<line x1="${x}" y1="${gy + 112}" x2="${x - 26}" y2="${gy + 140}" stroke="${C.line}" stroke-width="2" opacity="0.25"/>`;
    s += `<line x1="0" y1="${gy}" x2="1920" y2="${gy}" stroke="${C.line}" stroke-width="4"/><line x1="0" y1="${gy + 100}" x2="1920" y2="${gy + 100}" stroke="${C.line}" stroke-width="2" opacity="0.6"/>`;
    s += E(t, -0.3, lbl(110, gy + 62, 'ASFALTO', { a: 'start', size: 24 }), { dy: 0 });
    const pc = eio((t - W('passa')) / (W('altera') - W('passa') + 0.1));
    const carX = lerp(-300, cx, pc), near = clamp(1 - Math.abs(carX - cx) / 420);
    // campo magnetico: anelli che passano dal centro della bobina, deformati dall'auto
    const fp = eo((t - W('spira')) / 0.8);
    if (fp > 0) [110, 190].forEach(a => [-1, 1].forEach(sd => {
      const rx = a * (1 + 0.22 * near), ry = a * 0.72 * (1 - 0.42 * near);
      s += `<ellipse cx="${cx + sd * rx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 9" opacity="${(0.8 * fp).toFixed(3)}"/>`;
    }));
    // etichetta campo con linea guida verso l'anello esterno sinistro
    s += E(t, W('campo') - 0.1, `<line x1="${cx - 470}" y1="${gy - 190}" x2="${cx - 270}" y2="${cy - 100}" stroke="${C.line}" stroke-width="2"/>` + lbl(cx - 480, gy - 200, 'CAMPO MAGNETICO', { a: 'end', size: 26 }));
    // bobina — UNICO elemento corallo
    s += pop(t, W('spira') - 0.1, cx, cy, [0, 1, 2].map(i => `<rect x="${cx - 150 + i * 14}" y="${gy + 12 + i * 4}" width="${300 - i * 28}" height="${22 - i * 8}" rx="6" fill="none" stroke="${C.coral}" stroke-width="4"/>`).join(''));
    s += E(t, W('spira'), `<line x1="${cx}" y1="${gy + 40}" x2="${cx}" y2="${gy + 166}" stroke="${C.line}" stroke-width="2"/>` +
      `<rect x="${cx - 160}" y="${gy + 166}" width="320" height="50" rx="25" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` + lbl(cx, gy + 200, 'SPIRA INDUTTIVA', { size: 26 }));
    // armadietto del sensore: presente da subito, con la spia
    const cab = 1640;
    s += E(t, -0.3, `<path d="M${cx + 150},${gy + 24} L${cx + 470},${gy + 24} L${cx + 470},${gy + 88} L${cab},${gy + 88} L${cab},${gy}" fill="none" stroke="${C.line}" stroke-width="3"/>` +
      `<rect x="${cab - 70}" y="${gy - 170}" width="140" height="170" rx="10" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>` + lbl(cab, gy - 200, 'SENSORE', { size: 24 }), { dy: 0 });
    const det = t > W('altera') - 0.05;
    s += `<circle cx="${cab}" cy="${gy - 110}" r="26" fill="${det ? C.line : C.bg}" stroke="${C.line}" stroke-width="4"/>`;
    s += E(t, W('altera') - 0.05, lbl(cab, gy - 40, 'VEICOLO', { size: 24 }), { d: 0.3 });
    s += car(carX, gy);
    s += E(t, W('bobina'), T(960, 240, 'una bobina di filo metallico', { f: 'serif', size: 64, it: true, fill: C.line, a: 'middle' }));
    return s + caption(t, W('altera'), 'Il campo cambia', '');
  } }) });

// ===== 3 — cosa misura, e il limite =====
scene('limite', { make: (W) => ({
  capAt: W('ma'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(200, 150, 1520, 700, { rot: -0.6 }), { dy: 0 });
    g += E(t, -0.2, T(280, 240, 'LA SPIRA', { f: 'mono', size: 30, fill: C.ink, ls: 4, w: 700 }));
    const items = [['conta i veicoli', W('conta')], ['misura la velocità media', W('velocità')], ['costo basso', W('costa')]];
    items.forEach(([x, at], i) => {
      g += E(t, at - 0.1, `<path d="M290,${330 + i * 92} l14,16 l28,-34" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` + T(350, 346 + i * 92, x, { f: 'popm', size: 44, fill: C.ink }));
    });
    // auto, moto, camion: per la spira sono tutti "un veicolo"
    const gy = 760, at = W('distingue');
    g += E(t, at, car(420, gy, { k: 0.62, ink: C.ink, bg: C.cream }) + T(420, gy + 46, 'auto', { f: 'mono', size: 26, fill: C.ink, a: 'middle' }));
    g += E(t, at + 0.15, moto(730, gy, { k: 0.75, ink: C.ink, bg: C.cream }) + T(730, gy + 46, 'moto', { f: 'mono', size: 26, fill: C.ink, a: 'middle' }));
    g += E(t, at + 0.3, truck(1060, gy, { k: 0.6, ink: C.ink, bg: C.cream }) + T(1060, gy + 46, 'camion', { f: 'mono', size: 26, fill: C.ink, a: 'middle' }));
    g += `<line x1="260" y1="${gy}" x2="1250" y2="${gy}" stroke="${C.ink}" stroke-width="3" opacity="${clamp((t - at) / 0.4)}"/>`;
    g += pop(t, at + 0.4, 1460, 640, T(1460, 740, '?', { f: 'pop', size: 300, fill: C.coral, a: 'middle' }));
    g += E(t, at + 0.6, T(1460, 800, 'stesso segnale', { f: 'serif', size: 44, it: true, fill: C.ink, a: 'middle' }));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('ma'), 'Conta, ma non distingue', '', true);
  } }) });

// ===== 4 — telecamere con computer vision =====
scene('camera', { make: (W) => ({
  capAt: W('ma'),
  render(t) {
    const gy = 760; let s = road(gy);
    // palo con telecamera
    const px = 1560, cy = 300;
    s += `<line x1="${px}" y1="${gy}" x2="${px}" y2="${cy}" stroke="${C.line}" stroke-width="6"/><line x1="${px}" y1="${cy}" x2="${px - 80}" y2="${cy}" stroke="${C.line}" stroke-width="6"/>`;
    s += `<g transform="rotate(18 ${px - 120} ${cy + 20})"><rect x="${px - 200}" y="${cy - 10}" width="150" height="62" rx="10" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/><circle cx="${px - 200}" cy="${cy + 21}" r="18" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/></g>`;
    s += E(t, W('telecamere'), `<path d="M${px - 200},${cy + 70} L620,${gy} L1260,${gy} Z" fill="${C.line}" opacity="0.06"/><path d="M${px - 200},${cy + 70} L620,${gy} M${px - 200},${cy + 70} L1260,${gy}" stroke="${C.line}" stroke-width="2" stroke-dasharray="5 10" opacity="0.7"/>`, { dy: 0 });
    const cx = lerp(-260, 940, eio(t / 2.0));
    s += car(cx, gy);
    // riquadro di riconoscimento: UNICO elemento corallo
    const bp = eo((t - W('riconoscono')) / 0.5);
    if (bp > 0) { const w = 440 * (1.3 - 0.3 * bp), h = 190 * (1.3 - 0.3 * bp);
      s += `<rect x="${cx - w / 2}" y="${gy - 8 - h}" width="${w}" height="${h}" rx="6" fill="none" stroke="${C.coral}" stroke-width="5" opacity="${bp}"/>`; }
    const tags = [['TIPO: AUTO', W('tipo')], ['TARGA: ▮▮ ▮▮▮ ▮▮', W('targa')], ['VELOCITÀ', W('velocità')]];
    tags.forEach(([x, at], i) => { s += E(t, at - 0.1, pillTag(240, 230 + i * 78, x, C.line, C.bg)); });
    // calcolo e privacy
    s += E(t, W('potenza') - 0.1, `<rect x="${px + 40}" y="${cy + 120}" width="110" height="110" rx="10" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>` +
      [0, 1, 2, 3].map(i => `<line x1="${px + 60 + i * 23}" y1="${cy + 104}" x2="${px + 60 + i * 23}" y2="${cy + 120}" stroke="${C.line}" stroke-width="3"/><line x1="${px + 60 + i * 23}" y1="${cy + 230}" x2="${px + 60 + i * 23}" y2="${cy + 246}" stroke="${C.line}" stroke-width="3"/>`).join('') +
      lbl(px + 95, cy + 290, 'CALCOLO', { size: 24 }));
    { const hx = 1210, hy = gy;
      s += E(t, W('sollevano') - 0.1, `<circle cx="${hx}" cy="${hy - 158}" r="20" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>` +
        `<line x1="${hx}" y1="${hy - 136}" x2="${hx}" y2="${hy - 66}" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/>` +
        `<path d="M${hx - 16},${hy} L${hx},${hy - 66} L${hx + 16},${hy} M${hx - 24},${hy - 84} L${hx},${hy - 120} L${hx + 24},${hy - 84}" fill="none" stroke="${C.line}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`, { dy: 0 }); }
    return s + caption(t, W('ma'), 'Utili, ma la privacy?', '');
  } }) });

// ===== 5 — qualità dell'aria =====
scene('aria', { tail: 0.75, make: (W) => ({
  capAt: W('misurano'),
  render(t) {
    const gy = 820; let s = `<line x1="80" y1="${gy}" x2="1840" y2="${gy}" stroke="${C.line}" stroke-width="3"/>`;
    // particelle che passano davanti al sensore
    for (let i = 0; i < 26; i++) {
      const y = 250 + ((i * 97) % 470), sp = 40 + (i * 13) % 50, x = ((i * 211 + t * sp) % 780) + 60, r = 3 + (i % 4) * 2;
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.line}" stroke-width="2" opacity="0.4"/>`;
    }
    // palo con centralina — UNICO elemento corallo
    s += `<line x1="520" y1="${gy}" x2="520" y2="230" stroke="${C.line}" stroke-width="6"/>`;
    s += pop(t, W('sensori'), 520, 470, `<rect x="440" y="400" width="160" height="150" rx="14" fill="${C.bg}" stroke="${C.coral}" stroke-width="5"/>` +
      [0, 1, 2, 3].map(i => `<line x1="470" y1="${430 + i * 26}" x2="570" y2="${430 + i * 26}" stroke="${C.coral}" stroke-width="3"/>`).join(''));
    s += E(t, W('sensori') + 0.2, `<line x1="600" y1="530" x2="624" y2="620" stroke="${C.line}" stroke-width="2"/>` + pillTag(560, 660, 'CENTRALINA', C.line, C.bg, { size: 24 }));
    const rows = [['PM2.5 · PM10', 'particolato', W('particolato')], ['NO₂', 'biossido di azoto', W('biossido')], ['O₃', 'ozono', W("l'ozono")], ['CO', 'monossido di carbonio', W('monossido')]];
    rows.forEach(([f, n, at], i) => {
      const y = 300 + i * 120;
      s += E(t, at - 0.1, `<rect x="900" y="${y - 70}" width="880" height="96" rx="16" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` +
        T(940, y, f, { f: 'pop', size: 50, fill: C.line }) + T(1740, y - 4, n, { f: 'serif', size: 48, it: true, fill: C.line, a: 'end' }));
    });
    return s + caption(t, W('misurano'), "Cosa c'è nell'aria", '');
  } }) });

// ===== 6 — oltre la soglia =====
scene('soglia', { make: (W) => ({
  capAt: W('oltre'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(180, 150, 1560, 700, { rot: 0.5 }), { dy: 0 });
    // grafico d'esempio
    const x0 = 260, x1 = 900, yb = 720, yt = 260, th = 430;
    g += `<line x1="${x0}" y1="${yt}" x2="${x0}" y2="${yb}" stroke="${C.ink}" stroke-width="3"/><line x1="${x0}" y1="${yb}" x2="${x1}" y2="${yb}" stroke="${C.ink}" stroke-width="3"/>`;
    g += T(x0, yt - 26, 'LIVELLO', { f: 'mono', size: 24, fill: C.ink, ls: 3, w: 600 }) + T(x1, yb + 44, 'TEMPO', { f: 'mono', size: 24, fill: C.ink, ls: 3, w: 600, a: 'end' });
    g += T(x1, yt - 26, 'ESEMPIO', { f: 'mono', size: 24, fill: C.ink, ls: 3, w: 600, a: 'end' });
    const pts = [[0, 640], [0.12, 620], [0.25, 600], [0.38, 560], [0.5, 520], [0.62, 470], [0.74, 420], [0.86, 380], [1, 350]];
    const cp = clamp((t - 0.1) / 1.2);
    let d = '';
    for (let i = 0; i <= 60; i++) { const u = i / 60 * cp; let j = 0; while (j < pts.length - 2 && pts[j + 1][0] < u) j++;
      const a = pts[j], b = pts[j + 1], y = lerp(a[1], b[1], (u - a[0]) / (b[0] - a[0])); d += (i ? 'L' : 'M') + (x0 + 20 + u * (x1 - x0 - 40)).toFixed(1) + ',' + y.toFixed(1); }
    if (cp > 0) g += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
    // soglia UE — UNICO elemento corallo
    const sp = eo((t - W('soglie') + 0.1) / 0.5);
    if (sp > 0) g += `<line x1="${x0}" y1="${th}" x2="${x0 + (x1 - x0) * sp}" y2="${th}" stroke="${C.coral}" stroke-width="5" stroke-dasharray="14 10"/>`;
    g += E(t, W('europee'), T(x0 + 20, th - 20, 'SOGLIA UE', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 700 }));
    // azioni possibili
    g += E(t, W('sistema'), T(1010, 280, 'IL SISTEMA PUÒ', { f: 'mono', size: 28, fill: C.ink, ls: 4, w: 700 }));
    const A = [['rallentare il traffico', W('rallentare'), 'sem'], ['avvisare i vulnerabili', W('avvisare'), 'bell'], ["bloccare l'accesso|alle zone a basse emissioni", W('bloccare'), 'stop']];
    A.forEach(([x, at, ic], i) => {
      const y = 380 + i * 135, ix = 1050;
      let icon = '';
      if (ic === 'sem') icon = `<rect x="${ix - 22}" y="${y - 52}" width="44" height="104" rx="10" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>` + [-30, 0, 30].map(d => `<circle cx="${ix}" cy="${y + d}" r="10" fill="${d === -30 ? C.ink : 'none'}" stroke="${C.ink}" stroke-width="3"/>`).join('');
      if (ic === 'bell') icon = `<path d="M${ix - 30},${y + 22} Q${ix - 26},${y - 40} ${ix},${y - 42} Q${ix + 26},${y - 40} ${ix + 30},${y + 22} Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/><circle cx="${ix}" cy="${y + 32}" r="8" fill="${C.ink}"/>`;
      if (ic === 'stop') icon = `<circle cx="${ix}" cy="${y}" r="42" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/><line x1="${ix - 24}" y1="${y}" x2="${ix + 24}" y2="${y}" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>`;
      const ln = x.split('|'); g += E(t, at - 0.1, icon + ln.map((l, j) => T(1120, y + 16 - (ln.length - 1) * 22 + j * 50, l, { f: 'popm', size: ln.length > 1 ? 38 : 42, fill: C.ink })).join(''));
    });
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('oltre'), 'Oltre la soglia', '', true);
  } }) });

// ===== 7 — illuminazione smart =====
scene('luce', { make: (W) => ({
  capAt: W('se', 1),
  render(t) {
    const gy = 760; let s = '';
    s += `<path d="M1790,180 a60,60 0 1,0 60,90 a46,46 0 1,1 -60,-90 z" fill="none" stroke="${C.line}" stroke-width="4"/>`;
    s += E(t, -0.3, T(1800, 330, 'NOTTE', { f: 'mono', size: 26, fill: C.line, ls: 4, w: 600, a: 'middle' }), { dy: 0 });
    s += road(gy);
    const LX = [260, 700, 1140, 1580];
    const dimP = eio((t - W('dimezzano')) / 0.7);
    // pedone (UNICO corallo) entra su "rilevano"
    const wp = clamp((t - W('rilevano') + 0.3) / 2.4), px = lerp(560, 800, eo(wp)), on = t > W('rilevano') - 0.3;
    LX.forEach(x => {
      const hx = x + 70, dist = on ? Math.abs(px - hx) : 9999, wake = clamp(1 - (dist - 110) / 80);
      const lv = 1 - 0.5 * dimP + 0.5 * dimP * wake;
      s += lamp(x, gy, lv);
      const pct = dimP < 0.5 ? null : (wake > 0.5 ? '100%' : '50%');
      if (pct) s += T(hx, gy - 460, pct, { f: 'mono', size: 30, fill: C.line, a: 'middle', w: 700 });
    });
    s += E(t, W('dimezzano') - 0.1, T(960, 210, 'nessuno passa: metà luce', { f: 'serif', size: 60, it: true, fill: C.line, a: 'middle' }));
    if (on) {
      const step = Math.sin(t * 9) * 14;
      s += `<g opacity="${clamp((t - W('rilevano') + 0.3) / 0.3)}"><circle cx="${px}" cy="${gy - 170}" r="22" fill="${C.bg}" stroke="${C.coral}" stroke-width="5"/>` +
        `<line x1="${px}" y1="${gy - 146}" x2="${px}" y2="${gy - 70}" stroke="${C.coral}" stroke-width="7" stroke-linecap="round"/>` +
        `<path d="M${px - step},${gy} L${px},${gy - 70} L${px + step},${gy}" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
        `<path d="M${px - 26 + step * 0.6},${gy - 90} L${px},${gy - 130} L${px + 26 - step * 0.6},${gy - 90}" fill="none" stroke="${C.coral}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    }
    return s + caption(t, W('se', 1), 'Luce quando serve', '');
  } }) });

// ===== 8 — il risparmio =====
scene('risparmio', { make: (W) => ({
  capAt: W('risparmio'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(260, 150, 1400, 700, { rot: -0.8 }), { dy: 0 });
    g += E(t, W('trenta') - 0.1, T(960, 440, '30–50%', { f: 'pop', size: 210, fill: C.coral, a: 'middle' }));
    g += E(t, W('cento'), T(960, 515, 'rispetto alla luce non controllata', { f: 'serif', size: 46, it: true, fill: C.ink, a: 'middle' }));
    g += E(t, W('roma') - 0.1, `<line x1="400" y1="580" x2="1520" y2="580" stroke="${C.ink}" stroke-width="3"/>` + T(400, 650, 'ROMA', { f: 'mono', size: 30, fill: C.ink, ls: 4, w: 700 }));
    g += E(t, W('trecentomila') - 0.1, T(400, 720, '≈ 300.000 punti luce', { f: 'popm', size: 50, fill: C.ink }));
    g += E(t, W('milioni') - 0.1, T(400, 800, 'milioni di euro l’anno (stima)', { f: 'popm', size: 50, fill: C.ink }));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('risparmio'), 'Risparmio medio', '', true);
  } }) });

// ===== 9 — il cassonetto con sensore a ultrasuoni =====
scene('rifiuti', { tail: 0.6, make: (W) => ({
  capAt: W('misura'),
  render(t) {
    const gy = 800; let s = `<line x1="80" y1="${gy}" x2="1840" y2="${gy}" stroke="${C.line}" stroke-width="3"/>`;
    const bx0 = 420, bx1 = 900, top = 330, lid = top - 26, lev = 560;
    // cassonetto in sezione
    s += `<path d="M${bx0},${top} L${bx0 + 20},${gy} L${bx1 - 20},${gy} L${bx1},${top}" fill="${mix(C.bg, C.line, 0.04)}" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>`;
    s += `<rect x="${bx0 - 14}" y="${lid}" width="${bx1 - bx0 + 28}" height="26" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
    // rifiuti (sacchi)
    [[500, 700, 70], [620, 720, 64], [760, 700, 74], [560, 620, 60], [700, 630, 66], [830, 640, 50]].forEach(([x, y, r]) => {
      s += `<path d="M${x - r},${y + r * 0.8} Q${x - r * 1.1},${y - r * 0.4} ${x - r * 0.2},${y - r * 0.9} L${x},${y - r * 1.15} L${x + r * 0.2},${y - r * 0.9} Q${x + r * 1.1},${y - r * 0.4} ${x + r},${y + r * 0.8} Z" fill="${mix(C.bg, C.line, 0.1)}" stroke="${C.line}" stroke-width="3"/>`;
    });
    // sensore sotto il coperchio — UNICO corallo
    const sx = 660;
    s += pop(t, W('sensore') - 0.1, sx, top + 20, `<rect x="${sx - 50}" y="${top}" width="100" height="40" rx="8" fill="${C.bg}" stroke="${C.coral}" stroke-width="5"/>`);
    s += E(t, W('sensore'), lbl(bx1 + 60, top + 30, 'SENSORE A ULTRASUONI', { a: 'start', size: 26 }) + `<line x1="${sx + 60}" y1="${top + 20}" x2="${bx1 + 40}" y2="${top + 20}" stroke="${C.line}" stroke-width="2"/>`);
    // onde: scendono, rimbalzano sui rifiuti
    if (t > W('ultrasuoni')) {
      for (let i = 0; i < 4; i++) {
        const ph = ((t - W('ultrasuoni')) * 0.9 + i / 4) % 1, down = ph < 0.5, q = down ? ph * 2 : (1 - ph) * 2;
        const y = top + 50 + q * (lev - top - 70), w = 40 + q * 90;
        s += `<path d="M${sx - w},${y - 10} Q${sx},${y + (down ? 18 : -18)} ${sx + w},${y - 10}" fill="none" stroke="${C.line}" stroke-width="3" opacity="${(0.9 - 0.4 * q).toFixed(2)}"/>`;
      }
    }
    // livello di riempimento
    s += E(t, W('livello') - 0.1, `<line x1="${bx0 + 10}" y1="${lev}" x2="${bx1 - 10}" y2="${lev}" stroke="${C.line}" stroke-width="3" stroke-dasharray="10 8"/>` + lbl(bx1 + 60, lev + 8, 'LIVELLO', { a: 'start', size: 26 }));
    // trasmissione alla centrale
    s += E(t, W('trasmette') - 0.1, `<line x1="${bx1 + 10}" y1="${lid}" x2="${bx1 + 10}" y2="${lid - 70}" stroke="${C.line}" stroke-width="4"/>` +
      arcs(bx1 + 10, lid - 70, 3, 24, 22, -1.2, 0.2, clamp((t - W('trasmette')) / 0.8), C.line, 3) +
      `<rect x="1380" y="460" width="380" height="200" rx="16" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>` + lbl(1570, 545, 'CENTRALE', { size: 28 }) + lbl(1570, 600, 'TEMPO REALE', { size: 24 }));
    if (t > W('trasmette')) { const ax = bx1 + 90, ay = lid - 80, p = ((t - W('trasmette')) % 1.3) / 1.3, q1 = 0.7;
      s += `<path d="M${ax},${ay} L1570,${ay} L1570,460" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="4 10" opacity="0.7"/>`;
      s += p < q1 ? pulse(ax, ay, 1570, ay, p / q1) : pulse(1570, ay, 1570, 460, (p - q1) / (1 - q1)); }
    return s + caption(t, W('misura'), 'Quanto è pieno?', '');
  } }) });

// ===== 10 — la mappa di priorità =====
scene('percorso', { make: (W) => ({
  capAt: W('mappa'),
  render(t) {
    let s = '';
    const gx = [260, 460, 660, 860, 1060], gyy = [250, 430, 610, 790];
    s += E(t, -0.4, gx.map(x => `<line x1="${x}" y1="210" x2="${x}" y2="830" stroke="${C.line}" stroke-width="12" opacity="0.13"/>`).join('') +
      gyy.map(y => `<line x1="220" y1="${y}" x2="1100" y2="${y}" stroke="${C.line}" stroke-width="12" opacity="0.13"/>`).join(''), { dy: 0 });
    s += E(t, -0.3, T(220, 190, 'ESEMPIO', { f: 'mono', size: 24, fill: C.line, ls: 3, w: 600 }), { dy: 0 });
    const dep = [260, 790];
    // percorso fisso (tutti i cassonetti): 3480 px — giro di priorità (solo i pieni): 2680 px, circa −23%
    const fixed = [dep, [260, 250], [1060, 250], [1060, 430], [460, 430], [460, 610], [860, 610], [860, 790], dep];
    const prio = [dep, [260, 250], [1060, 250], [1060, 790], dep];
    // cassonetti: pieni sul giro di priorità, vuoti solo sul percorso fisso
    const B = [[260, 430, 1], [660, 250, 1], [1060, 370, 1], [660, 790, 1], [460, 430, 0], [760, 430, 0], [960, 430, 0], [460, 610, 0], [660, 610, 0], [860, 700, 0]];
    const fillP = t > W('priorità') - 0.1;
    const path = (P, p) => { let len = 0; const seg = []; for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(l); len += l; }
      let rem = len * clamp(p), d = `M${P[0][0]},${P[0][1]}`, end = P[0];
      for (let i = 1; i < P.length && rem > 0; i++) { const q = Math.min(1, rem / seg[i - 1]); end = [lerp(P[i - 1][0], P[i][0], q), lerp(P[i - 1][1], P[i][1], q)]; d += `L${end[0]},${end[1]}`; rem -= seg[i - 1]; }
      return { d, end }; };
    const fp = clamp((t - W('percorso') + 0.1) / 1.4);
    if (fp > 0) s += `<path d="${path(fixed, fp).d}" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="10 12" stroke-linejoin="round" transform="translate(-16,-16)"/>`;
    // giro di priorità — corallo
    const pp = clamp((t - W('priorità')) / 2.2);
    let truck = '';
    if (pp > 0) { const r = path(prio, pp); s += `<path d="${r.d}" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" transform="translate(16,16)"/>`;
      if (pp < 1) truck = `<circle cx="${r.end[0] + 16}" cy="${r.end[1] + 16}" r="14" fill="${C.line}"/>`; }
    B.forEach(([x, y, f]) => { s += `<rect x="${x - 20}" y="${y - 20}" width="40" height="40" rx="6" fill="${f && fillP ? C.line : C.bg}" stroke="${C.line}" stroke-width="3"/>`; });
    s += `<rect x="${dep[0] - 34}" y="${dep[1] - 34}" width="68" height="68" rx="10" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>` + lbl(dep[0], dep[1] + 84, 'DEPOSITO', { size: 24 });
    s += truck;
    // legenda a destra
    const lx = 1220;
    s += E(t, W('priorità'), `<line x1="${lx}" y1="300" x2="${lx + 70}" y2="300" stroke="${C.coral}" stroke-width="7" stroke-linecap="round"/>` + T(lx + 96, 310, 'mappa di priorità', { f: 'popm', size: 36, fill: C.line }));
    s += E(t, W('ogni') - 0.1, T(lx + 96, 360, 'aggiornata ogni ora', { f: 'serif', size: 40, it: true, fill: C.line }));
    s += E(t, W('percorso') - 0.1, `<line x1="${lx}" y1="450" x2="${lx + 70}" y2="450" stroke="${C.line}" stroke-width="4" stroke-dasharray="10 12"/>` + T(lx + 96, 460, 'percorso fisso', { f: 'popm', size: 36, fill: C.line }));
    s += E(t, W('priorità') + 0.3, `<rect x="${lx + 10}" y="530" width="40" height="40" rx="6" fill="${C.line}" stroke="${C.line}" stroke-width="3"/>` + T(lx + 96, 562, 'cassonetto pieno', { f: 'popm', size: 32, fill: C.line }));
    s += E(t, W('alcune') - 0.1, T(lx, 690, 'da −20% a −30%', { f: 'pop', size: 76, fill: C.line }) + T(lx, 750, 'di percorso, in alcune città', { f: 'serif', size: 40, it: true, fill: C.line }));
    return s + caption(t, W('mappa'), 'Mappa di priorità', '');
  } }) });

// ===== 11 — chiusura =====
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 430, 'I sensori urbani', { f: 'pop', size: 150, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('misurano') - 0.1, 960, 560, 'misurano la città', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true });
    s += words(t, W('per') - 0.1, 960, 645, 'per gestirla con i dati', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'dati' });
    s += E(t, W('dati') + 0.3, `<line x1="760" y1="715" x2="1160" y2="715" stroke="${C.ink}" stroke-width="3"/>` + T(960, 775, 'PROFTECNOLOGIA · MC AMB-2-06', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5 }));
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
