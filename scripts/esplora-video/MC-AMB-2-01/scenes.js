// Strutture antisismiche — scene con render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.6);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.6);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<pattern id="hatchI" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="${C.ink}" stroke-width="4"/></pattern></defs>`;

// scossa: ampiezza che sale in 0,6 s da t0, frequenza f (Hz)
const ramp = (t, t0, d = 0.6) => eo((t - t0) / d);
const osc = (t, t0, A, f, ph = 0) => t < t0 ? 0 : A * ramp(t, t0) * Math.sin(2 * Math.PI * f * (t - t0) + ph);
function pill(x, y, s, ink, bg, a = 'start') {
  const w = tw(s, 'mono', 26) * 1.0 + 26 * 0.12 * s.length + 44, x0 = a === 'middle' ? x - w / 2 : x;
  return `<rect x="${x0}" y="${y - 34}" width="${w}" height="50" rx="25" fill="${bg}" stroke="${ink}" stroke-width="2"/>` + T(x0 + w / 2, y, s, { f: 'mono', size: 26, fill: ink, a: 'middle', ls: 3, w: 600 });
}
// sismogramma corallo nel suolo
function trace(t, t0, x0, x1, y, amp) {
  const p = clamp((t - t0) / 1.6); if (p <= 0) return '';
  let d = ''; const n = 220;
  for (let i = 0; i <= n * p; i++) {
    const x = x0 + (x1 - x0) * i / n, u = i / n, env = Math.min(1, u * 5) * (0.35 + 0.65 * Math.exp(-Math.pow((u - 0.45) / 0.22, 2)));
    d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + (y + amp * env * Math.sin(i * 1.7 + Math.sin(i * 0.31) * 2)).toFixed(1);
  }
  return `<path d="${d}" fill="none" stroke="${C.coral}" stroke-width="4" stroke-linejoin="round"/>`;
}

// 1 — gancio
scene('hook', { make: (W) => ({
  capAt: W('restare'),
  render(t) {
    const t0 = W('terremoto'), g = osc(t, t0, 26, 1.6), d = osc(t, t0 + 0.12, -22, 1.6);
    let s = E(t, -0.4, ground(700, g) + building(960, 700, { dx: g, drift: d }), { dy: 0 });
    s += trace(t, t0, 300, 1620, 790, 34);
    s += E(t, t0, tag(300, 860, 'SCOSSA SISMICA', { box: true }));
    s += E(t, W('come') - 0.1, T(1330, 330, '?', { f: 'pop', size: 220 }));
    return s + caption(t, W('restare'), 'Restare in piedi', '');
  } }) });

// 2 — il rischio in Italia (registro chiaro)
scene('rischio', { make: (W) => ({
  capAt: W('44'),
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, card(150, 190, 760, 660), { dy: 0 });
    s += E(t, W("l'italia") - 0.1, tag(210, 280, "L'ITALIA", { ink: C.ink }));
    s += E(t, W('rischio') - 0.1, T(210, 370, 'tra i Paesi a più alto', { f: 'serif', size: 52, it: true, fill: C.ink }) + T(210, 432, "rischio sismico d'Europa", { f: 'serif', size: 52, it: true, fill: C.ink }));
    s += E(t, W('circa') - 0.1, T(214, 540, 'circa', { f: 'serif', size: 64, it: true, fill: C.ink }));
    s += E(t, W('44') - 0.1, T(200, 700, '44%', { f: 'pop', size: 180, fill: C.coral }));
    s += E(t, W('territorio') - 0.1, tag(214, 768, 'DEL TERRITORIO IN', { ink: C.ink }) + tag(214, 810, 'ZONA SISMICA 1 O 2', { ink: C.ink }));
    // griglia 10x10: 44 celle piene (quota del territorio)
    const gx = 1080, gy = 210, c = 58;
    let g = '';
    for (let i = 0; i < 100; i++) {
      const r = Math.floor(i / 10), k = i % 10, on = i < 44;
      const st = W('44') - 0.2 + i * 0.012;
      g += `<rect x="${gx + k * c}" y="${gy + r * c}" width="${c - 8}" height="${c - 8}" rx="6" fill="${on && t > st ? C.ink : 'none'}" stroke="${C.ink}" stroke-width="3"/>`;
    }
    s += E(t, -0.2, g, { dy: 0 });
    s += E(t, W('44') + 0.4, tag(gx, gy + 10 * c + 42, '1 QUADRATO = 1% DEL TERRITORIO', { ink: C.ink, size: 24 }));
    return s + caption(t, W('44'), 'Circa il 44%', '', true);
  } }) });

// 3 — spinta laterale, non verso il basso
scene('laterale', { make: (W) => ({
  capAt: W('sposta'),
  render(t) {
    const t0 = W('sposta'), g = osc(t, t0, 34, 1.4), d = osc(t, t0 + 0.12, -26, 1.4);
    let s = E(t, -0.4, ground(720, g) + building(960, 720, { dx: g, drift: d }), { dy: 0 });
    // freccia verso il basso, barrata
    const fade = 1 - clamp((t - t0) / 0.4);
    if (fade > 0) s += `<g opacity="${fade}">` + E(t, W('terremoto') - 0.1, arrow(1520, 230, 1520, 470, C.line, 8)) +
      E(t, W('non') - 0.05, `<line x1="1440" y1="300" x2="1600" y2="420" stroke="${C.line}" stroke-width="10" stroke-linecap="round"/>` + tag(1520, 520, 'NON VERSO IL BASSO', { a: 'middle' })) + '</g>';
    // doppia freccia orizzontale corallo
    s += E(t, t0 - 0.05, `<g transform="translate(${g.toFixed(1)},0)">${arrow(950, 800, 1240, 800, C.coral, 8)}${arrow(970, 800, 680, 800, C.coral, 8)}</g>`);
    s += E(t, t0 + 0.2, tag(1440, 470, 'DI LATO', { a: 'middle', size: 30 }) + tag(1440, 520, 'AVANTI E INDIETRO', { a: 'middle' }));
    return s + caption(t, t0, 'Spinta laterale, ripetuta', '');
  } }) });

// 4 — forze di taglio in un riquadro del telaio
scene('taglio', { make: (W) => ({
  capAt: W('taglio'),
  render(t) {
    const t0 = W('forze'), sh = 70 * ramp(t, t0, 0.9) + osc(t, t0 + 0.9, 10, 1.2);
    const x0 = 660, x1 = 1260, yb = 760, yt = 300;
    let s = E(t, -0.4, ground(yb, 0, { h: 140 }), { dy: 0 });
    const ix = (y, x) => x + sh * (yb - y) / (yb - yt), ya = yb - 40, yc = yt + 40;
    const panel = `<path d="M${x0},${yb} L${x1},${yb} L${x1 + sh},${yt} L${x0 + sh},${yt} z" fill="${mix(C.bg, C.line, 0.05)}"/>` +
      `<path d="M${ix(ya, x0 + 40)},${ya} L${ix(ya, x1 - 40)},${ya} L${ix(yc, x1 - 40)},${yc} L${ix(yc, x0 + 40)},${yc} z" fill="${mix(C.bg, C.line, 0.1)}" stroke="${C.coral}" stroke-width="6" stroke-linejoin="round"/>`;
    const frame = `<line x1="${x0}" y1="${yb}" x2="${x0 + sh}" y2="${yt}" stroke="${C.line}" stroke-width="16"/><line x1="${x1}" y1="${yb}" x2="${x1 + sh}" y2="${yt}" stroke="${C.line}" stroke-width="16"/>` +
      `<rect x="${x0 - 40 + sh}" y="${yt - 26}" width="${x1 - x0 + 80}" height="30" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>`;
    s += E(t, -0.3, panel + frame, { dy: 0 });
    // coppia di forze opposte: sopra verso destra, sotto verso sinistra
    s += E(t, t0, arrow(x0 - 60 + sh, yt - 70, x0 + 260 + sh, yt - 70, C.line, 8) + arrow(x1 + 60, yb + 60, x1 - 260, yb + 60, C.line, 8));
    s += E(t, W('taglio') - 0.1, tag(x1 + 120, 520, 'TAGLIO', { size: 40 }) + tag(x1 + 120, 566, 'UNA PARTE SCORRE', { size: 24 }) + tag(x1 + 120, 600, "RISPETTO ALL'ALTRA", { size: 24 }));
    s += E(t, W('assorbire') - 0.1, T(x0 + 300, 210, 'assorbire senza crollare', { f: 'serif', size: 56, it: true, a: 'middle' }));
    return s + caption(t, W('taglio'), 'Forze di taglio enormi', '');
  } }) });

// 5 — isolamento alla base: dove stanno gli isolatori
const ISO_X = [-220, -110, 0, 110, 220];
function isoStack(cx, yGround, o = {}) {
  // fondazione nel suolo, isolatori sopra, edificio sopra gli isolatori
  const fy = yGround, ih = 58, gd = o.gdx || 0, bd = o.bdx || 0;
  let s = `<rect x="${cx - 300 + gd}" y="${fy}" width="600" height="70" fill="${mix(C.bg, C.line, 0.12)}" stroke="${C.line}" stroke-width="4"/>`;
  ISO_X.forEach(dx => s += isolator(cx + dx + gd, fy, 70, ih, bd - gd, { nl: 4 }));
  return { s, top: fy - ih };
}
scene('isolatori', { make: (W) => ({
  capAt: W('isolatori'),
  render(t) {
    const cx = 960, yg = 720, st = isoStack(cx, yg);
    let s = E(t, -0.4, ground(yg - 70, 0, { h: 300, inner: '' }), { dy: 0 });
    // scavo: la fondazione sta sotto il piano di campagna
    s += E(t, -0.4, `<rect x="${cx - 330}" y="${yg - 72}" width="660" height="146" fill="${C.bg}"/>` + st.s + building(cx, st.top, { n: 3, w: 520, fh: 120 }), { dy: 0 });
    s += E(t, W("l'edificio") - 0.1, tag(1290, 420, 'EDIFICIO'));
    s += E(t, W('fondazioni') - 0.1, tag(1310, 790, 'FONDAZIONI', { box: true }));
    s += E(t, W('isolatori') - 0.1, `<line x1="1240" y1="680" x2="1300" y2="680" stroke="${C.line}" stroke-width="3"/>` + tag(1310, 690, 'ISOLATORI SISMICI', { box: true }));
    // lente corallo su un isolatore
    s += pop(t, W('isolatori') + 0.1, cx + 220, yg - 30, `<circle cx="${cx + 220}" cy="${yg - 30}" r="66" fill="none" stroke="${C.coral}" stroke-width="6"/>`);
    s += E(t, W('base') - 0.1, tag(560, 690, 'ALLA BASE', { a: 'end', box: true }) + `<line x1="580" y1="680" x2="640" y2="680" stroke="${C.line}" stroke-width="3"/>`);
    return s + caption(t, W('isolatori'), 'Isolatori sismici', '');
  } }) });

// 6 — dentro l'isolatore (registro chiaro)
scene('strati', { make: (W) => ({
  capAt: W('gomma'),
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, card(330, 170, 1260, 660), { dy: 0 });
    const t0 = W('deformano'), sh = osc(t, t0, 80, 0.7);
    const big = isolator(840, 720, 560, 440, sh, { ink: C.ink, bg: C.cream, rub: mix(C.cream, C.ink, 0.16), nl: 6, pl: 52, sw: 5, lw: 7 });
    s += E(t, -0.3, big, { dy: 0 });
    const ex = y => 840 + 0.43 * 560 + sh * (668 - y) / 336 - 34;
    s += E(t, W('gomma') - 0.1, `<line x1="${ex(528)}" y1="528" x2="1210" y2="528" stroke="${C.ink}" stroke-width="3"/><circle cx="${ex(528)}" cy="528" r="7" fill="${C.ink}"/>` + tag(1225, 538, 'GOMMA', { ink: C.ink }));
    s += E(t, W('acciaio') - 0.1, `<line x1="${ex(444)}" y1="444" x2="1210" y2="410" stroke="${C.ink}" stroke-width="3"/><circle cx="${ex(444)}" cy="444" r="7" fill="${C.ink}"/>` + tag(1225, 420, 'LAMINA DI ACCIAIO', { ink: C.ink }));
    s += E(t, W('strati') - 0.1, tag(1225, 640, 'A STRATI', { ink: C.ink }));
    s += E(t, t0 - 0.05, `<g transform="translate(${sh},0)">${arrow(760, 200, 640, 200, C.coral, 8)}${arrow(920, 200, 1040, 200, C.coral, 8)}</g>` + tag(960, 800, 'SI DEFORMA IN ORIZZONTALE', { ink: C.ink, a: 'middle', size: 24 }));
    return s + caption(t, W('gomma'), 'Gomma e acciaio', '', true);
  } }) });

// 7 — il suolo si muove molto, l'edificio poco
scene('confronto', { tail: 1.0, make: (W) => ({
  capAt: W('2'),
  render(t) {
    const t0 = W('suolo') - 0.1, f = 0.55, ph = 2 * Math.PI * f;
    const A = 120, a = 12; // rapporto 10 : 1 come nella fonte (25 cm / 2,5 cm)
    const g = osc(t, t0, A, f), b = osc(t, t0, a, f, -0.6);
    const cx = 960, yg = 680, st = isoStack(cx, yg, { gdx: g, bdx: b });
    // suolo, fossato (giunto) e fondazione traslano insieme; l'edificio sopra gli isolatori resta quasi fermo
    const moat = `<rect x="${cx - 420}" y="${yg - 72}" width="840" height="146" fill="${C.bg}"/>` +
      `<path d="M${cx - 420},${yg - 70} L${cx - 420},${yg + 74} L${cx + 420},${yg + 74} L${cx + 420},${yg - 70}" fill="none" stroke="${C.line}" stroke-width="6"/>` +
      tag(cx - 440, yg - 92, 'GIUNTO', { a: 'end', size: 24 }) + `<line x1="${cx - 470}" y1="${yg - 84}" x2="${cx - 380}" y2="${yg - 40}" stroke="${C.line}" stroke-width="3"/>`;
    let s = E(t, -0.4, ground(yg - 70, g, { h: 300, stones: true, inner: moat }), { dy: 0 });
    s += E(t, -0.4, st.s + building(cx, st.top, { n: 3, w: 520, fh: 110, dx: b }), { dy: 0 });
    s += E(t, W('isolatori') - 0.1, T(1300, 400, 'gli isolatori assorbono', { f: 'serif', size: 46, it: true }) + T(1300, 452, 'lo spostamento', { f: 'serif', size: 46, it: true }));
    // escursione del suolo
    const gy = 835;
    s += E(t, W('20') - 0.1, `<line x1="${cx - A}" y1="${gy}" x2="${cx + A}" y2="${gy}" stroke="${C.line}" stroke-width="4"/><line x1="${cx - A}" y1="${gy - 16}" x2="${cx - A}" y2="${gy + 16}" stroke="${C.line}" stroke-width="4"/><line x1="${cx + A}" y1="${gy - 16}" x2="${cx + A}" y2="${gy + 16}" stroke="${C.line}" stroke-width="4"/>` +
      `<circle cx="${cx + g}" cy="${gy}" r="10" fill="${C.line}"/>` + tag(cx + A + 40, gy + 10, 'SUOLO 20–30 cm', { size: 30, box: true }));
    // escursione dell'edificio
    const by = 230;
    s += E(t, W('2') - 0.1, `<line x1="${cx - a}" y1="${by}" x2="${cx + a}" y2="${by}" stroke="${C.coral}" stroke-width="4"/><line x1="${cx - a}" y1="${by - 16}" x2="${cx - a}" y2="${by + 16}" stroke="${C.coral}" stroke-width="4"/><line x1="${cx + a}" y1="${by - 16}" x2="${cx + a}" y2="${by + 16}" stroke="${C.coral}" stroke-width="4"/>` +
      T(cx + 40, by + 12, 'EDIFICIO 2–3 cm', { f: 'mono', size: 30, fill: C.coral, ls: 3, w: 600 }));
    s += E(t, -0.2, tag(96, 180, 'SPOSTAMENTI NON IN SCALA', { size: 24 }));
    return s + caption(t, W('2'), 'Edificio: soli 2–3 cm', '');
  } }) });

// 8 — dentro: un leggero dondolamento
scene('dondolio', { make: (W) => ({
  capAt: W('leggero'),
  render(t) {
    const rx = 420, ry = 220, rw = 1080, rh = 560;
    let s = E(t, -0.4, `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${mix(C.bg, C.line, 0.05)}" stroke="${C.line}" stroke-width="6"/>` +
      `<rect x="${rx + 700}" y="${ry + 120}" width="230" height="200" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/><line x1="${rx + 815}" y1="${ry + 120}" x2="${rx + 815}" y2="${ry + 320}" stroke="${C.line}" stroke-width="3"/>` +
      // tavolo e sedia con una persona seduta
      `<line x1="${rx + 260}" y1="${ry + 420}" x2="${rx + 560}" y2="${ry + 420}" stroke="${C.line}" stroke-width="8"/><line x1="${rx + 290}" y1="${ry + 420}" x2="${rx + 290}" y2="${ry + rh}" stroke="${C.line}" stroke-width="6"/><line x1="${rx + 530}" y1="${ry + 420}" x2="${rx + 530}" y2="${ry + rh}" stroke="${C.line}" stroke-width="6"/>` +
      `<circle cx="${rx + 160}" cy="${ry + 300}" r="34" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/><path d="M${rx + 160},${ry + 336} L${rx + 160},${ry + 450} L${rx + 250},${ry + 450} L${rx + 250},${ry + rh}" fill="none" stroke="${C.line}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><line x1="${rx + 160}" y1="${ry + 380}" x2="${rx + 270}" y2="${ry + 410}" stroke="${C.line}" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M${rx + 90},${ry + 460} L${rx + 90},${ry + rh} M${rx + 90},${ry + 460} L${rx + 190},${ry + 460}" fill="none" stroke="${C.line}" stroke-width="6"/>`, { dy: 0 });
    // lampada sospesa che oscilla piano (corallo)
    const ang = osc(t, W('dondolamento') - 0.3, 4, 0.45), px = rx + 410, py = ry;
    s += `<g transform="rotate(${ang.toFixed(2)} ${px} ${py})"><line x1="${px}" y1="${py}" x2="${px}" y2="${py + 150}" stroke="${C.coral}" stroke-width="4"/><path d="M${px - 60},${py + 210} L${px - 26},${py + 150} L${px + 26},${py + 150} L${px + 60},${py + 210} z" fill="${C.bg}" stroke="${C.coral}" stroke-width="5"/></g>`;
    s += E(t, W('leggero') - 0.1, pill(rx + rw + 40, 360, 'LEGGERO', C.line, C.bg) + tag(rx + rw + 40, 420, 'DONDOLAMENTO'));
    s += E(t, W('non') - 0.1, T(rx + rw + 40, 530, 'non', { f: 'serif', size: 50, it: true }));
    s += E(t, W('scuotimento') - 0.1, tag(rx + rw + 40, 590, 'SCUOTIMENTO') + tag(rx + rw + 40, 630, 'VIOLENTO'));
    return s + caption(t, W('leggero'), 'Leggero dondolamento', '');
  } }) });

// 9 — costi e benefici (registro chiaro)
scene('costi', { tail: 0.8, make: (W) => ({
  capAt: W('danni'),
  render(t) {
    let s = lightBg();
    const panel = (x, title, sub) => card(x, 190, 700, 640) + tag(x + 50, 260, title, { ink: C.ink }) + tag(x + 50, 300, sub, { ink: C.ink, size: 24 });
    const base = 740, H = 300;
    const bar = (x, hFull, label, o = {}) => `<rect x="${x}" y="${base - hFull}" width="150" height="${hFull}" fill="${o.fill || 'none'}" stroke="${C.ink}" stroke-width="4"/>` + tag(x + 75, base + 44, label, { ink: C.ink, a: 'middle', size: 24 });
    // costo: senza isolamento 100, con isolamento +5–10%
    s += E(t, W('costo') - 0.2, panel(190, 'COSTO DI', 'COSTRUZIONE') + bar(260, H, 'SENZA', { fill: mix(C.cream, C.ink, 0.15) }) +
      bar(500, H, 'CON ISOLATORI', { fill: mix(C.cream, C.ink, 0.15) }));
    s += E(t, W('5') - 0.1, `<rect x="500" y="${base - H * 1.05}" width="150" height="${H * 0.05}" fill="${C.ink}"/><rect x="500" y="${base - H * 1.10}" width="150" height="${H * 0.05}" fill="url(#hatchI)" stroke="${C.ink}" stroke-width="3"/>` + T(575, base - H * 1.10 - 24, '+5–10%', { f: 'pop', size: 54, fill: C.ink, a: 'middle' }));
    // danni: possono ridursi del 70–80%
    s += E(t, W('danni') - 0.2, panel(1030, 'DANNI DA', 'TERREMOTO') + bar(1100, H, 'SENZA', { fill: mix(C.cream, C.ink, 0.15) }) +
      `<rect x="1340" y="${base - H}" width="150" height="${H}" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="10 10"/>` + tag(1415, base + 44, 'CON ISOLATORI', { ink: C.ink, a: 'middle', size: 24 }));
    s += E(t, W('70') - 0.1, `<rect x="1340" y="${base - H * 0.20}" width="150" height="${H * 0.20}" fill="${mix(C.cream, C.ink, 0.15)}" stroke="${C.ink}" stroke-width="4"/><rect x="1340" y="${base - H * 0.30}" width="150" height="${H * 0.10}" fill="url(#hatchI)" stroke="${C.ink}" stroke-width="4"/>` +
      T(1415, base - H - 30, '−70–80%', { f: 'pop', size: 54, fill: C.coral, a: 'middle' }) + T(1580, 500, 'possono', { f: 'serif', size: 44, it: true, fill: C.ink, a: 'middle' }) + T(1580, 550, 'ridursi', { f: 'serif', size: 44, it: true, fill: C.ink, a: 'middle' }));
    return s + caption(t, W('danni'), 'Può ridurre i danni', '', true);
  } }) });

// 10 — controventi: diagonali in acciaio
scene('controventi', { tail: 0.9, make: (W) => ({
  capAt: W('diagonali'),
  render(t) {
    const x0 = 700, x1 = 1220, yb = 760, yt = 330, tf = W('forze');
    const dr = 30 * ramp(t, tf, 0.8) + osc(t, tf + 0.8, 9, 0.6);
    let s = E(t, -0.4, ground(yb, 0, { h: 140 }), { dy: 0 });
    let fr = `<path d="M${x0},${yb} L${x1},${yb} L${x1 + dr},${yt} L${x0 + dr},${yt} z" fill="${mix(C.bg, C.line, 0.06)}"/>` +
      `<line x1="${x0}" y1="${yb}" x2="${x0 + dr}" y2="${yt}" stroke="${C.line}" stroke-width="16"/><line x1="${x1}" y1="${yb}" x2="${x1 + dr}" y2="${yt}" stroke="${C.line}" stroke-width="16"/>` +
      `<rect x="${x0 - 30 + dr}" y="${yt - 22}" width="${x1 - x0 + 60}" height="28" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>`;
    s += E(t, -0.4, fr, { dy: 0 });
    // diagonali
    s += E(t, W('controventi') - 0.1, `<line x1="${x0 + 10}" y1="${yb - 10}" x2="${x1 + dr - 10}" y2="${yt + 14}" stroke="${C.line}" stroke-width="9" stroke-dasharray="${t > W('trazione') ? 'none' : '0'}"/>` +
      `<line x1="${x0 + dr + 10}" y1="${yt + 14}" x2="${x1 - 10}" y2="${yb - 10}" stroke="${C.line}" stroke-width="9"/>`);
    s += E(t, W('diagonali') - 0.1, tag(960, 250, 'DIAGONALI IN ACCIAIO', { a: 'middle' }));
    // forza laterale (corallo) in cima
    s += E(t, tf - 0.1, arrow(x0 - 330 + dr, yt - 8, x0 - 50 + dr, yt - 8, C.coral, 10) + tag(x0 - 330, yt - 50, 'FORZA LATERALE'));
    // etichette lungo le diagonali + frecce: ←→ trazione (si allunga), →← compressione (si accorcia)
    const along = (ax, ay, bx, by, sp, lab, side, out, t1) => {
      const Ln = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / Ln, uy = (by - ay) / Ln, ang = Math.atan2(uy, ux) * 180 / Math.PI;
      const px = ax + ux * Ln * sp, py = ay + uy * Ln * sp, nx = uy * side, ny = -ux * side;
      const lx = px + nx * 26, ly = py + ny * 26, qx = px - nx * 30, qy = py - ny * 30;
      let r = `<g transform="translate(${lx.toFixed(1)},${ly.toFixed(1)}) rotate(${ang.toFixed(2)})">` + T(0, side > 0 ? 0 : 20, lab, { f: 'mono', size: 26, fill: C.line, a: 'middle', ls: 3, w: 600 }) + '</g>';
      const A1 = out ? [qx - ux * 8, qy - uy * 8, qx - ux * 58, qy - uy * 58] : [qx - ux * 62, qy - uy * 62, qx - ux * 12, qy - uy * 12];
      const A2 = out ? [qx + ux * 8, qy + uy * 8, qx + ux * 58, qy + uy * 58] : [qx + ux * 62, qy + uy * 62, qx + ux * 12, qy + uy * 12];
      return E(t, t1, r + arrow(...A1, C.line, 5) + arrow(...A2, C.line, 5));
    };
    s += along(x0 + 10, yb - 10, x1 + dr - 10, yt + 14, 0.68, 'TRAZIONE', 1, true, W('trazione') - 0.1);
    s += along(x0 + dr + 10, yt + 14, x1 - 10, yb - 10, 0.68, 'COMPRESSIONE', -1, false, W('compressione') - 0.1);
    return s + caption(t, W('diagonali'), 'Diagonali in acciaio', '');
  } }) });

// 11 — dissipatori: energia in calore
scene('dissipatori', { tail: 1.4, make: (W) => ({
  capAt: W('calore'),
  render(t) {
    const x0 = 560, x1 = 1080, yb = 760, yt = 330, t0 = W('assorbono');
    const dr = t < t0 ? 0 : 42 * (0.55 + 0.45 * Math.exp(-(t - t0) * 0.3)) * Math.sin(2 * Math.PI * 0.7 * (t - t0)) * ramp(t, t0, 0.3);
    let s = E(t, -0.4, ground(yb, 0, { h: 140 }), { dy: 0 });
    s += E(t, -0.4, `<line x1="${x0}" y1="${yb}" x2="${x0 + dr}" y2="${yt}" stroke="${C.line}" stroke-width="16"/><line x1="${x1}" y1="${yb}" x2="${x1 + dr}" y2="${yt}" stroke="${C.line}" stroke-width="16"/>` +
      `<rect x="${x0 - 30 + dr}" y="${yt - 22}" width="${x1 - x0 + 60}" height="28" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>`, { dy: 0 });
    // diagonale con dissipatore: cilindro fisso al nodo in basso, stelo al nodo in alto
    const ax = x0 + 12, ay = yb - 12, bx = x1 + dr - 12, by = yt + 14;
    const L = Math.hypot(bx - ax, by - ay), ang = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
    const L0 = Math.hypot(x1 - 24 - x0, yt + 26 - yb);
    const cyl0 = 150, cylL = 260, rodIn = cylL - 60 + (L - L0);
    const g = `<g transform="translate(${ax},${ay}) rotate(${ang.toFixed(3)})">` +
      `<line x1="0" y1="0" x2="${cyl0}" y2="0" stroke="${C.line}" stroke-width="9"/>` +
      `<rect x="${cyl0}" y="-34" width="${cylL}" height="68" rx="10" fill="${mix(C.bg, C.line, 0.1)}"/>` +
      `<line x1="${cyl0 + rodIn - 40}" y1="0" x2="${L}" y2="0" stroke="${C.line}" stroke-width="8"/>` +
      `<rect x="${cyl0 + rodIn - 50}" y="-26" width="16" height="52" fill="${C.line}"/>` +
      `<rect x="${cyl0}" y="-34" width="${cylL}" height="68" rx="10" fill="none" stroke="${C.coral}" stroke-width="6"/></g>`;
    s += E(t, W('dissipatori') - 0.2, g);
    s += E(t, W('dissipatori'), tag(1220, 360, 'DISSIPATORE'));
    s += E(t, W("l'energia") - 0.1, tag(1220, 420, 'ENERGIA DEL SISMA'));
    // calore: righe ondulate che salgono dal cilindro
    const hc = ramp(t, W('calore') - 0.1, 0.4);
    if (hc > 0) {
      const mx = ax + Math.cos(ang * Math.PI / 180) * (cyl0 + cylL / 2), my = ay + Math.sin(ang * Math.PI / 180) * (cyl0 + cylL / 2);
      let h = '';
      [-50, 0, 50].forEach((ox, i) => { let d = ''; for (let k = 0; k <= 20; k++) { const y = my - 95 - k * 5, x = mx + ox + 10 * Math.sin(k * 0.6 - t * 6 + i); d += (k ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); } h += `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>`; });
      s += `<g opacity="${hc}">${h}</g>`;
      s += E(t, W('calore') - 0.1, arrow(1236, 445, 1236, 500, C.line, 5) + tag(1220, 545, 'CALORE'));
    }
    s += E(t, W('viscosi') - 0.1, tag(1220, 625, 'TIPO VISCOSO'));
    s += E(t, W('ammortizzatori') - 0.2, T(1220, 682, "come un ammortizzatore", { f: 'serif', size: 46, it: true }) + T(1220, 732, "d'auto", { f: 'serif', size: 46, it: true }));
    return s + caption(t, W('calore'), 'Energia in calore', '');
  } }) });

// 12 — chiusura
scene('finale', { L: 0.5, tail: 3.6, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    // piccolo edificio su isolatori, a filo scuro
    let ic = building(960, 300, { n: 2, w: 200, fh: 70, ink: C.ink, bg: C.ivory, fill: mix(C.ivory, C.ink, 0.06) });
    [-70, 0, 70].forEach(dx => ic += isolator(960 + dx, 336, 44, 30, 0, { ink: C.ink, bg: C.ivory, rub: mix(C.ivory, C.ink, 0.2), nl: 2, pl: 7, sw: 3 }));
    ic += `<rect x="830" y="336" width="260" height="16" fill="${C.ink}"/>`;
    s += E(t, -0.4, `<g transform="translate(0,-40)">${ic}</g>`, { dy: 0 });
    s += E(t, -0.4, T(960, 470, 'Strutture antisismiche', { f: 'pop', size: 100, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('progettate') - 0.1, 960, 575, 'progettate per assorbire le forze del sisma senza crollare', { f: 'serif', size: 58, fill: C.ink, a: 'middle', it: true, key: 'crollare' });
    s += E(t, W('crollare') + 0.3, `<line x1="760" y1="645" x2="1160" y2="645" stroke="${C.ink}" stroke-width="3"/>` + T(960, 705, 'PROFTECNOLOGIA · MC AMB-2-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5 }));
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
