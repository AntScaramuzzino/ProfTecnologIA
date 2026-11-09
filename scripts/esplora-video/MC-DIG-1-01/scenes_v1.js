// Dentro il computer — MC-DIG-1-01 §"I componenti di un computer". render(t) puro.
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
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });

// 1 — aggancio: il computer aperto, in sezione
function towerSVG(t, t0, st, x0 = 1000, y0 = 150) {
  let s = `<rect x="${x0}" y="${y0}" width="700" height="710" rx="22" fill="${C.bg}" stroke="${st}" stroke-width="5"/>`;
  s += `<rect x="${x0 + 60}" y="${y0 + 50}" width="500" height="440" rx="10" fill="${DIM()}" stroke="${st}" stroke-width="3"/>`; // scheda madre
  for (let i = 0; i < 4; i++) s += `<rect x="${x0 + 24}" y="${y0 + 70 + i * 52}" width="24" height="36" rx="4" fill="none" stroke="${st}" stroke-width="2.5"/>`; // porte posteriori
  s += `<line x1="${x0 + 20}" y1="${y0 + 560}" x2="${x0 + 680}" y2="${y0 + 560}" stroke="${st}" stroke-width="2" stroke-dasharray="4 10"/>`;
  const parts = [
    () => chipSVG(x0 + 250, y0 + 110, 130, 130, { st, n: 6, pl: 12 }) + fan(x0 + 315, y0 + 175, 52, t * 3, st), // CPU + dissipatore
    () => [0, 1].map(i => `<rect x="${x0 + 420 + i * 34}" y="${y0 + 90}" width="22" height="210" rx="4" fill="${DIM()}" stroke="${st}" stroke-width="3"/>`).join(''), // RAM
    () => `<rect x="${x0 + 90}" y="${y0 + 350}" width="440" height="70" rx="8" fill="${DIM()}" stroke="${st}" stroke-width="3"/>` + fan(x0 + 210, y0 + 385, 28, -t * 4, st) + fan(x0 + 400, y0 + 385, 28, -t * 4, st), // GPU
    () => `<rect x="${x0 + 110}" y="${y0 + 270}" width="110" height="34" rx="5" fill="${DIM()}" stroke="${st}" stroke-width="3"/>`, // SSD
    () => `<rect x="${x0 + 60}" y="${y0 + 590}" width="300" height="110" rx="8" fill="${DIM()}" stroke="${st}" stroke-width="3"/>` + fan(x0 + 290, y0 + 645, 40, t * 2, st), // alimentatore
  ];
  parts.forEach((p, i) => s += E(t, t0 + i * 0.2, p(), { dy: 14 }));
  return s;
}
scene('hook', { make: (W) => ({
  capAt: W('ognuna'),
  render(t) {
    let s = E(t, -0.4, towerSVG(t, W('tante') - 0.1, C.line).replace(/^/, ''), { dy: 0 });
    s += words(t, 0.1, 96, 380, 'Aprire', { f: 'pop', size: 120 });
    s += words(t, 0.4, 96, 510, 'un computer', { f: 'pop', size: 120 });
    s += E(t, W('cofano'), IT(100, 610, "come aprire il cofano di un'auto", { size: 50 }));
    return s + caption(t, W('ognuna'), 'Ognuna, una funzione', 'funzione');
  } }) });

// 2 — la CPU
scene('cpu', { make: (W) => ({
  capAt: W('cervello'),
  render(t) {
    const cx = 960, cy = 440, h = 260;
    let s = E(t, -0.4, chipSVG(cx - h / 2, cy - h / 2, h, h, { st: C.coral, pin: C.line, n: 10, pl: 20 }) + T(cx, cy + 26, 'CPU', { f: 'pop', size: 80, a: 'middle' }), { dy: 0 });
    s += E(t, W('cpu') + 0.1, IT(cx, cy + 230, 'Central Processing Unit', { a: 'middle', size: 50 }));
    const pulse = (x1, y1, x2, y2, t0) => { const p = ((t - t0) * 0.9) % 1; return t > t0 ? `<circle cx="${lerp(x1, x2, p)}" cy="${lerp(y1, y2, p)}" r="7" fill="${C.line}"/>` : ''; };
    const items = [['ESEGUE I CALCOLI', 400, cy, W('esegue'), cx - h / 2 - 22, cy], ['INTERPRETA LE ISTRUZIONI', 1510, cy, W('interpreta'), cx + h / 2 + 22, cy], ['COORDINA LE ALTRE PARTI', 960, 210, W('coordina'), cx, cy - h / 2 - 22]];
    items.forEach(([l, x, y, t0, ax, ay], i) => {
      const w = tw(l, 'mono', 26) + 3 * l.length + 40, ex = i === 0 ? x + w / 2 : i === 1 ? x - w / 2 : x, ey = i === 2 ? y + 14 : y - 10;
      s += E(t, t0 - 0.1, `<line x1="${ax}" y1="${ay}" x2="${ex}" y2="${ey}" stroke="${C.line}" stroke-width="3" stroke-dasharray="3 9"/>` + pillTag(x, y + 4, l, C.line, C.bg, 'middle'), { dy: 0 });
      if (t > t0 + 0.4) s += pulse(ax, ay, ex, ey, t0 + 0.4);
    });
    return s + caption(t, W('cervello'), 'Il cervello: la CPU', '');
  } }) });

// 3 — transistor: interruttori
function sw(x, y, len, on, st, w = 4) {
  const a = on ? 0 : -0.5;
  return `<circle cx="${x}" cy="${y}" r="${w + 3}" fill="${st}"/><circle cx="${x + len}" cy="${y}" r="${w + 3}" fill="none" stroke="${st}" stroke-width="${w * 0.7}"/>` +
    `<line x1="${x}" y1="${y}" x2="${x + len * Math.cos(a)}" y2="${y + len * Math.sin(a)}" stroke="${st}" stroke-width="${w}" stroke-linecap="round"/>`;
}
scene('transistor', { make: (W) => ({
  capAt: W('miliardi'),
  render(t) {
    const on = Math.floor(t * 1.4) % 2 === 0;
    let s = E(t, W('transistor') - 0.2, `<line x1="200" y1="660" x2="300" y2="660" stroke="${C.line}" stroke-width="5"/><line x1="660" y1="660" x2="760" y2="660" stroke="${C.line}" stroke-width="5"/>` + sw(300, 660, 360, on, C.coral, 10) +
      lbl(480, 760, on ? 'ACCESO' : 'SPENTO', { size: 30 }));
    s += E(t, W('transistor'), T(480, 330, 'transistor', { f: 'pop', size: 72, a: 'middle' }));
    s += E(t, W('interruttori'), IT(480, 400, '= interruttore microscopico', { a: 'middle', size: 44 }));
    // griglia: tantissimi interruttori
    const gx = 940, gy = 250, cw = 84, ch = 76;
    let g = `<rect x="${gx - 30}" y="${gy - 40}" width="${cw * 10 + 40}" height="${ch * 7 + 30}" rx="16" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/>`;
    for (let r = 0; r < 7; r++) for (let c = 0; c < 10; c++) {
      const i = r * 10 + c, st = Math.floor(t * (2 + hsh(i) * 3) + hsh(i + 99) * 2) % 2 === 0;
      g += sw(gx + c * cw, gy + r * ch, 44, st, C.line, 3);
    }
    s += E(t, W('miliardi') - 0.1, g, { dy: 0 });
    s += E(t, W('miliardi'), lbl(gx + 405, 180, 'MILIARDI DI TRANSISTOR'));
    s += E(t, W('spengono'), lbl(gx + 405, 820, 'MILIARDI DI VOLTE AL SECONDO'));
    return s + caption(t, W('miliardi'), 'Miliardi di interruttori', '');
  } }) });

// 4 — GHz e core (registro chiaro)
scene('core', { make: (W) => ({
  capAt: W('quattro'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(180, 150, 1560, 690, { rot: -0.6 }), { dy: 0 });
    g += E(t, W('tre') - 0.2, pillTag(260, 250, 'ESEMPIO', C.ink, C.cream));
    g += E(t, W('tre'), T(260, 400, '3 GHz', { f: 'pop', size: 140, fill: C.ink }));
    g += E(t, W('miliardi'), IT(264, 470, 'circa 3 miliardi di cicli al secondo', { fill: C.ink, size: 44 }));
    g += E(t, W('quattro'), T(260, 650, '4 core', { f: 'pop', size: 100, fill: C.ink }));
    g += E(t, W('cervelli'), IT(264, 720, 'come 4 cervelli in parallelo', { fill: C.ink, size: 44 }));
    // chip a 4 core
    const x0 = 1010, y0 = 230, cw = 260, chh = 230;
    g += E(t, W('quattro') - 0.1, chipSVG(x0, y0, cw * 2 + 60, chh * 2 + 60, { st: C.ink, fill: C.cream, n: 12, pl: 18, inner: false }), { dy: 0 });
    const tasks = ['MUSICA', 'BROWSER', 'NOTIFICHE', 'AGGIORNAMENTI'];
    for (let i = 0; i < 4; i++) {
      const cx = x0 + 20 + (i % 2) * (cw + 20), cy = y0 + 20 + Math.floor(i / 2) * (chh + 20), t0 = W('core') + i * 0.15;
      let c = `<rect x="${cx}" y="${cy}" width="${cw}" height="${chh}" rx="10" fill="${mix(C.cream, C.ink, 0.07)}" stroke="${C.ink}" stroke-width="3"/>`;
      c += T(cx + 18, cy + 42, 'CORE ' + (i + 1), { f: 'mono', size: 24, fill: C.ink, w: 700, ls: 2 });
      for (let b = 0; b < 6; b++) { const hh = 20 + 60 * (0.5 + 0.5 * Math.sin(t * (3 + i) + b * 1.3 + i)); c += `<rect x="${cx + 26 + b * 36}" y="${cy + 160 - hh}" width="22" height="${hh}" rx="3" fill="${C.ink}" opacity="0.8"/>`; }
      if (t > W('cervelli') - 0.1) c += E(t, W('cervelli') + i * 0.12, T(cx + cw / 2, cy + 205, tasks[i], { f: 'mono', size: 24, fill: C.ink, a: 'middle', w: 600, ls: 1 }), { dy: 8 });
      g += E(t, t0, c, { dy: 10 });
    }
    s += `<g transform="translate(960,495) scale(${k}) translate(-960,-495)">${g}</g>`;
    return s + caption(t, W('quattro'), 'Quattro core in parallelo', 'core', true);
  } }) });

// 5 — RAM: la scrivania
function deskSVG(t, t0, x, y, w, h, gone = 0) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/>`;
  for (let i = 1; i < 4; i++) s += `<line x1="${x + 30}" y1="${y + i * h / 4}" x2="${x + w - 30}" y2="${y + i * h / 4 + 6}" stroke="${C.line}" stroke-width="2" opacity="0.25"/>`;
  const items = [
    `<g transform="rotate(-8 ${x + 170} ${y + 150})"><rect x="${x + 80}" y="${y + 70}" width="190" height="150" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><line x1="${x + 175}" y1="${y + 70}" x2="${x + 175}" y2="${y + 220}" stroke="${C.line}" stroke-width="3"/>` +
      [0, 1, 2].map(j => `<line x1="${x + 95}" y1="${y + 110 + j * 30}" x2="${x + 160}" y2="${y + 110 + j * 30}" stroke="${C.line}" stroke-width="2"/><line x1="${x + 190}" y1="${y + 110 + j * 30}" x2="${x + 255}" y2="${y + 110 + j * 30}" stroke="${C.line}" stroke-width="2"/>`).join('') + '</g>',
    `<g transform="rotate(6 ${x + 420} ${y + 160})"><rect x="${x + 340}" y="${y + 60}" width="160" height="210" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + [0, 1, 2, 3, 4, 5].map(j => `<circle cx="${x + 340}" cy="${y + 85 + j * 32}" r="7" fill="none" stroke="${C.line}" stroke-width="2.5"/>`).join('') + '</g>',
    `<g transform="rotate(-4 ${x + 640} ${y + 150})"><rect x="${x + 570}" y="${y + 70}" width="150" height="190" rx="4" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><rect x="${x + 555}" y="${y + 55}" width="150" height="190" rx="4" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + [0, 1, 2, 3].map(j => `<line x1="${x + 575}" y1="${y + 95 + j * 30}" x2="${x + 680}" y2="${y + 95 + j * 30}" stroke="${C.line}" stroke-width="2"/>`).join('') + '</g>',
    `<g transform="rotate(10 ${x + w - 130} ${y + 160})"><rect x="${x + w - 200}" y="${y + 70}" width="130" height="180" rx="10" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><rect x="${x + w - 185}" y="${y + 85}" width="100" height="36" rx="4" fill="none" stroke="${C.line}" stroke-width="2"/>` +
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(j => `<rect x="${x + w - 185 + (j % 3) * 35}" y="${y + 135 + Math.floor(j / 3) * 36}" width="26" height="26" rx="3" fill="none" stroke="${C.line}" stroke-width="2"/>`).join('') + '</g>',
  ];
  items.forEach((it, i) => {
    if (gone > 0) { const p = eo((gone - i * 0.12) / 0.5); if (p >= 1) return; s += `<g opacity="${(1 - p).toFixed(3)}" style="filter:blur(${(p * 10).toFixed(2)}px)">${it}</g>`; }
    else s += E(t, t0 + i * 0.18, it, { dy: 14 });
  });
  return s;
}
scene('ram', { make: (W) => ({
  capAt: W('scrivania'),
  render(t) {
    let s = E(t, -0.4, ramSVG(560, 150, 800, 120), { dy: 0 });
    s += E(t, W('memoria') - 0.1, lbl(960, 335, 'RAM = MEMORIA DI LAVORO'));
    s += E(t, W('scrivania') - 0.2, deskSVG(t, W('scrivania'), 440, 400, 960, 400), { dy: 0 });
    s += E(t, W('processore') - 0.1, chipSVG(1560, 530, 150, 150, { st: C.line, n: 6, pl: 14 }) + T(1635, 616, 'CPU', { f: 'pop', size: 40, a: 'middle' }) +
      arrow(1530, 580, 1420, 580, C.line) + arrow(1420, 630, 1530, 630, C.line));
    s += E(t, W('adesso') - 0.1, IT(1635, 760, 'dati in uso adesso', { a: 'middle', size: 40 }));
    return s + caption(t, W('scrivania'), 'Una scrivania di lavoro', 'scrivania');
  } }) });

// 6 — volatile
scene('volatile', { make: (W) => ({
  capAt: W('manca'),
  render(t) {
    const off = t > W('manca') + 0.15;
    let s = E(t, -0.4, ramSVG(440, 150, 640, 110), { dy: 0 });
    s += E(t, W('volatile'), T(1130, 240, 'volatile', { f: 'pop', size: 84 }));
    // interruttore di corrente (corallo)
    const px = 170, py = 470;
    let p = `<rect x="${px}" y="${py}" width="130" height="220" rx="18" fill="${C.bg}" stroke="${C.coral}" stroke-width="5"/>` +
      `<rect x="${px + 25}" y="${off ? py + 115 : py + 25}" width="80" height="80" rx="12" fill="${C.coral}"/>`;
    s += E(t, -0.3, p + lbl(px + 65, py - 26, 'CORRENTE') + lbl(px + 65, py + 270, off ? 'OFF' : 'ON', { size: 30 }), { dy: 0 });
    s += E(t, -0.4, deskSVG(t, -1, 440, 400, 960, 400, off ? (t - W('manca') - 0.15) : 0), { dy: 0 });
    s += E(t, W('cancella'), lbl(920, 620, 'RAM VUOTA', { size: 32 }));
    // il file va scritto su un'altra memoria
    const fx = 1560, fy = 330;
    s += E(t, W('file') - 0.1, `<path d="M${fx},${fy} h80 l30,30 v110 h-110 z" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + [0, 1, 2].map(j => `<line x1="${fx + 18}" y1="${fy + 50 + j * 24}" x2="${fx + 92}" y2="${fy + 50 + j * 24}" stroke="${C.line}" stroke-width="2"/>`).join('') + lbl(fx + 55, fy - 22, 'FILE'));
    s += E(t, W('scritti') - 0.1, arrow(fx + 55, fy + 160, fx + 55, fy + 270, C.line));
    s += E(t, W("un'altra") - 0.1, `<rect x="${fx - 50}" y="${fy + 290}" width="210" height="110" rx="12" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/>` + [0, 1, 2].map(j => `<rect x="${fx - 30 + j * 62}" y="${fy + 315}" width="48" height="60" rx="4" fill="none" stroke="${C.line}" stroke-width="2.5"/>`).join('') +
      lbl(fx + 55, fy + 450, 'ALTRA MEMORIA'));
    return s + caption(t, W('manca'), 'Senza corrente, si cancella', '');
  } }) });

// 7 — storage
function driveSVG(x, y, w, h, st) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${DIM()}" stroke="${st}" stroke-width="5"/>`;
  for (let i = 0; i < 3; i++) s += `<rect x="${x + 40 + i * (w - 80) / 3}" y="${y + 50}" width="${(w - 80) / 3 - 24}" height="${h - 150}" rx="6" fill="none" stroke="${st}" stroke-width="3"/>`;
  for (let i = 0; i < 14; i++) s += `<line x1="${x + 40 + i * (w - 80) / 14}" y1="${y + h - 30}" x2="${x + 40 + i * (w - 80) / 14}" y2="${y + h - 60}" stroke="${st}" stroke-width="3"/>`;
  return s;
}
scene('storage', { make: (W) => ({
  capAt: W('permanente'),
  render(t) {
    const x = 700, y = 300, w = 520, h = 380;
    let s = E(t, -0.4, driveSVG(x, y, w, h, C.line) + T(x + w / 2, y - 40, 'STORAGE', { f: 'pop', size: 64, a: 'middle' }), { dy: 0 });
    const it = [['DOCUMENTI', 340, 400, W('documenti'), x - 10, 420], ['FOTO', 340, 600, W('foto'), x - 10, 580], ['APP', 1580, 400, W('app'), x + w + 10, 420], ['SISTEMA OPERATIVO', 1580, 600, W('sistema'), x + w + 10, 580]];
    it.forEach(([l, px, py, t0, ax, ay]) => {
      const pw = tw(l, 'mono', 26) + 3 * l.length + 40, ex = px < 960 ? px + pw / 2 + 10 : px - pw / 2 - 10;
      s += E(t, t0 - 0.1, pillTag(px, py + 10, l, C.line, C.bg, 'middle') + arrow(ex, py, ax, ay, C.line), { dy: 0 });
    });
    // livello di riempimento
    const n = it.filter(v => t > v[3]).length;
    for (let i = 0; i < n; i++) s += `<rect x="${x + 50}" y="${y + h - 100 - (i + 1) * 46}" width="${w - 100}" height="34" rx="6" fill="${mix(C.bg, C.line, 0.35)}" stroke="${C.line}" stroke-width="2"/>`;
    s += E(t, W('restano'), IT(960, 790, 'i dati restano salvati', { a: 'middle', size: 48 }));
    return s + caption(t, W('permanente'), 'Memoria permanente', 'permanente');
  } }) });

// 8 — HDD e SSD (registro chiaro)
scene('hddssd', { make: (W) => ({
  capAt: W("l'ssd"),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, I = C.ink;
    let g = E(t, -0.4, card(160, 140, 1600, 710, { rot: 0.5 }), { dy: 0 });
    // HDD in sezione: piatto che gira + testina
    const pcx = 500, pcy = 360, pr = 150, rot = t * 5;
    let hdd = `<rect x="300" y="190" width="460" height="340" rx="16" fill="${C.cream}" stroke="${I}" stroke-width="4"/>` + `<circle cx="${pcx}" cy="${pcy}" r="${pr}" fill="${mix(C.cream, I, 0.06)}" stroke="${I}" stroke-width="4"/>`;
    for (let i = 0; i < 6; i++) { const a = rot + i * Math.PI / 3; hdd += `<line x1="${pcx + 40 * Math.cos(a)}" y1="${pcy + 40 * Math.sin(a)}" x2="${pcx + 130 * Math.cos(a)}" y2="${pcy + 130 * Math.sin(a)}" stroke="${I}" stroke-width="2" opacity="0.35"/>`; }
    hdd += `<circle cx="${pcx}" cy="${pcy}" r="22" fill="${C.cream}" stroke="${I}" stroke-width="4"/>`;
    const ax = 705, ay = 480, hx = pcx + 70, hy = pcy - 60;
    hdd += `<line x1="${ax}" y1="${ay}" x2="${hx}" y2="${hy}" stroke="${I}" stroke-width="12" stroke-linecap="round"/><circle cx="${ax}" cy="${ay}" r="22" fill="${C.cream}" stroke="${I}" stroke-width="4"/><rect x="${hx - 12}" y="${hy - 12}" width="24" height="24" rx="4" fill="${I}"/>`;
    g += E(t, W("l'hdd") - 0.1, hdd + T(300, 600, 'HDD', { f: 'pop', size: 60, fill: I }));
    g += E(t, W('piatto'), IT(475, 600, 'piatto magnetico', { fill: I, size: 40 }));
    g += E(t, W('testina'), `<line x1="${hx + 14}" y1="${hy - 14}" x2="785" y2="262" stroke="${I}" stroke-width="2"/>` + IT(795, 272, 'testina', { fill: I, size: 40 }));
    // SSD: chip, niente parti meccaniche
    let ssd = `<rect x="1050" y="250" width="560" height="200" rx="12" fill="${C.cream}" stroke="${I}" stroke-width="4"/>`;
    for (let i = 0; i < 4; i++) ssd += `<rect x="${1080 + i * 120}" y="285" width="96" height="130" rx="6" fill="${mix(C.cream, I, 0.08)}" stroke="${I}" stroke-width="3"/>`;
    for (let i = 0; i < 6; i++) ssd += `<rect x="1610" y="${280 + i * 25}" width="16" height="14" fill="${I}"/>`;
    g += E(t, W("l'ssd") - 0.1, ssd + T(1050, 600, 'SSD', { f: 'pop', size: 60, fill: I }));
    g += E(t, W('meccaniche') - 0.1, IT(1205, 600, 'nessuna parte meccanica', { fill: I, size: 40 }));
    // lettura: da 5 a 10 volte
    const bx = 420, u = 60;
    g += E(t, W('legge') - 0.1, T(240, 690, 'LETTURA', { f: 'mono', size: 26, fill: I, ls: 3, w: 700 }) +
      T(bx - 20, 745, 'HDD', { f: 'mono', size: 26, fill: I, a: 'end', w: 600 }) + `<rect x="${bx}" y="718" width="${u}" height="34" rx="6" fill="${I}"/>` +
      T(bx - 20, 805, 'SSD', { f: 'mono', size: 26, fill: I, a: 'end', w: 600 }));
    const pb = eo((t - W('cinque')) / 0.9);
    if (pb > 0) g += `<rect x="${bx}" y="778" width="${5 * u * pb}" height="34" rx="6" fill="${C.coral}"/><rect x="${bx}" y="778" width="${10 * u * pb}" height="34" rx="6" fill="none" stroke="${C.coral}" stroke-width="4" stroke-dasharray="10 8"/>`;
    g += E(t, W('dieci'), T(bx + 10 * u + 40, 812, 'da 5 a 10 volte più veloce', { f: 'popm', size: 40, fill: I }));
    s += `<g transform="translate(960,495) scale(${k}) translate(-960,-495)">${g}</g>`;
    return s + caption(t, W("l'ssd"), 'SSD: niente parti meccaniche', '', true);
  } }) });

// 9 — GPU
scene('gpu', { make: (W) => ({
  capAt: W('insieme'),
  render(t) {
    let card_ = `<rect x="140" y="340" width="620" height="220" rx="14" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/>` + fan(320, 450, 78, t * 4, C.line) + fan(580, 450, 78, t * 4, C.line);
    for (let i = 0; i < 18; i++) card_ += `<rect x="${220 + i * 26}" y="560" width="16" height="22" fill="none" stroke="${C.line}" stroke-width="2"/>`;
    let s = E(t, -0.4, card_ + T(140, 300, 'GPU', { f: 'pop', size: 72 }) + lbl(310, 290, 'SCHEDA GRAFICA', { a: 'start' }), { dy: 0 });
    s += E(t, W('immagini') - 0.1, arrow(780, 450, 880, 450, C.line, 5));
    // schermo a pixel
    const sx = 900, sy = 190, cols = 24, rows = 14, cs = 36;
    let scr = `<rect x="${sx - 20}" y="${sy - 20}" width="${cols * cs + 40}" height="${rows * cs + 40}" rx="14" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>` +
      `<line x1="${sx + cols * cs / 2}" y1="${sy + rows * cs + 20}" x2="${sx + cols * cs / 2}" y2="${sy + rows * cs + 70}" stroke="${C.line}" stroke-width="6"/><line x1="${sx + cols * cs / 2 - 120}" y1="${sy + rows * cs + 72}" x2="${sx + cols * cs / 2 + 120}" y2="${sy + rows * cs + 72}" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/>`;
    const on = t > W('insieme'), step = Math.floor((t - W('insieme')) * 4);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const v = on ? 0.12 + 0.55 * (0.5 + 0.5 * Math.sin(c * 0.45 + r * 0.3 + step * 0.9)) * (0.7 + 0.3 * hsh(r * 31 + c)) : 0.04;
      scr += `<rect x="${sx + c * cs + 2}" y="${sy + r * cs + 2}" width="${cs - 4}" height="${cs - 4}" rx="3" fill="${mix(C.bg, C.line, v)}"/>`;
    }
    s += E(t, -0.3, scr, { dy: 0 });
    s += E(t, W('milioni') - 0.1, IT(140, 690, 'milioni di calcoli semplici', { size: 48 }));
    s += E(t, W('insieme') - 0.05, lbl(140, 760, 'TUTTI INSIEME', { a: 'start', size: 30 }));
    s += E(t, W('pixel') - 0.1, lbl(sx + cols * cs / 2, 160, 'OGNI QUADRATINO = 1 PIXEL'));
    return s + caption(t, W('insieme'), 'Milioni di calcoli insieme', 'insieme');
  } }) });

// 10 — i numeri dei pixel (registro chiaro)
scene('pixel', { make: (W) => ({
  capAt: W('centoventi'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, I = C.ink;
    let g = E(t, -0.4, card(240, 150, 1440, 690, { rot: -0.6 }), { dy: 0 });
    g += E(t, W('full') - 0.1, pillTag(330, 260, 'SCHERMO FULL HD', I, C.cream));
    g += E(t, W('due'), T(330, 390, 'oltre 2 milioni di pixel', { f: 'pop', size: 76, fill: I }));
    g += E(t, W('sessanta') - 0.1, T(330, 500, '× 60 fotogrammi al secondo', { f: 'popm', size: 52, fill: I }));
    const ln = eo((t - W('ricalcola')) / 0.5); if (ln > 0) g += `<line x1="330" y1="545" x2="${330 + 1240 * ln}" y2="545" stroke="${I}" stroke-width="4"/>`;
    g += E(t, W('centoventi'), T(330, 670, '120 milioni di pixel', { f: 'pop', size: 96, fill: C.coral }));
    g += E(t, W('ogni'), IT(334, 750, 'ogni secondo', { fill: I, size: 52 }));
    // fotogrammi impilati
    if (t > W('fotogrammi') - 0.1) for (let i = 0; i < 3; i++) g += E(t, W('fotogrammi') + i * 0.15, `<rect x="${1320 + i * 34}" y="${230 + i * 30}" width="220" height="140" rx="8" fill="${C.cream}" stroke="${I}" stroke-width="3"/>`, { dy: 10 });
    s += `<g transform="translate(960,495) scale(${k}) translate(-960,-495)">${g}</g>`;
    return s + caption(t, W('centoventi'), '120 milioni al secondo', '', true);
  } }) });

// 11 — scheda madre
scene('madre', { make: (W) => ({
  capAt: W('nervoso'),
  render(t) {
    const bx = 330, by = 160, bw = 1260, bh = 650;
    let s = '';
    s += E(t, W('scheda') - 0.15, `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="22" fill="${mix(C.bg, C.line, 0.05)}" stroke="${C.coral}" stroke-width="6"/>` +
      [[bx + 30, by + 30], [bx + bw - 30, by + 30], [bx + 30, by + bh - 30], [bx + bw - 30, by + bh - 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="none" stroke="${C.line}" stroke-width="3"/>`).join(''), { dy: 0 });
    // piste (tracce) dal centro CPU agli altri componenti
    const tr = [[[1044, 310], [1220, 310]], [[960, 416], [960, 560], [840, 600]], [[1044, 370], [1120, 370], [1120, 500], [1290, 600]], [[876, 330], [430, 330]]];
    const drawP = eo((t - W('sistema')) / 0.8);
    if (drawP > 0) tr.forEach(pts => { s += `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${C.line}" stroke-width="4" stroke-linejoin="round" opacity="${(0.25 + 0.5 * drawP).toFixed(2)}"/>`; });
    // componenti
    const comp = [
      [-0.3, chipSVG(890, 260, 140, 140, { st: C.line, n: 6, pl: 12 }) + T(960, 342, 'CPU', { f: 'pop', size: 40, a: 'middle' })],
      [-0.15, [0, 1].map(i => `<rect x="${1220 + i * 46}" y="${210}" width="28" height="300" rx="5" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/>`).join('') + lbl(1257, 545, 'RAM')],
      [0.0, `<rect x="${500}" y="${600}" width="560" height="44" rx="6" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/>` + lbl(780, 700, 'GPU')],
      [0.15, `<rect x="${1240}" y="${600}" width="200" height="44" rx="6" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/>` + lbl(1340, 700, 'STORAGE')],
      [0.3, [0, 1, 2, 3].map(i => `<rect x="${360}" y="${250 + i * 60}" width="70" height="40" rx="5" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/>`).join('') + lbl(470, 520, 'PORTE', { a: 'start' })],
    ];
    comp.forEach(([d, c]) => s += E(t, d, c, { dy: 10 }));
    // impulsi: dati e corrente che viaggiano
    if (t > W('trasporta')) tr.forEach((pts, j) => {
      const segs = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
      for (let q = 0; q < 2; q++) {
        let d = (((t - W('trasporta')) * 260 + q * tot / 2 + j * 70) % tot), i = 0; while (d > segs[i]) { d -= segs[i]; i++; }
        const p = d / segs[i], x = lerp(pts[i][0], pts[i + 1][0], p), y = lerp(pts[i][1], pts[i + 1][1], p);
        s += `<circle cx="${x}" cy="${y}" r="9" fill="${C.line}"/>`;
      }
    });
    s += E(t, W('dati') - 0.1, lbl(1500, 775, 'DATI E CORRENTE', { a: 'end' }));
    return s + caption(t, W('nervoso'), 'Il sistema nervoso', '');
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Dentro il computer', { f: 'pop', size: 130, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('tante') - 0.1, 960, 560, 'Tante parti: ognuna con il suo compito.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'compito' });
    s += E(t, W('compito') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC DIG-1-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
