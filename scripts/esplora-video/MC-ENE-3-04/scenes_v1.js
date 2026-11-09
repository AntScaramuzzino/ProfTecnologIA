// Circuiti in serie e in parallelo — MC-ENE-3-04. render(t) puro.
// Convenzione: i trattini che scorrono sui fili indicano la CORRENTE nel verso convenzionale (dal + al −
// all'esterno della pila); la velocità dei trattini è proporzionale all'intensità di corrente.
// Nelle scene con la rete (luci di Natale, casa) la corrente è alternata: niente trattini, solo lampade accese/spente.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.4);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.6);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<radialGradient id="glowL"><stop offset="0" stop-color="${C.line}" stop-opacity="0.55"/><stop offset="1" stop-color="${C.line}" stop-opacity="0"/></radialGradient>
<radialGradient id="glowC"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.75"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const P = pts => 'M' + pts.map(p => p.join(',')).join(' L');
const sub = (a, b) => `${esc(a)}<tspan baseline-shift="sub" font-size="68%">${esc(b)}</tspan>`;
// testo con pedici: parti [testo, pedice] alternate
function TS(x, y, parts, o = {}) {
  const raw = parts.map(p => Array.isArray(p) ? sub(p[0], p[1]) : esc(p)).join('');
  return T(x, y, raw, { ...o, raw: true });
}

// ---- mondo: schemi elettrici a filo chiaro ----
function wirePath(pts, st = C.line, sw = 5) { return `<path d="${P(pts)}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`; }
// corrente: trattini che scorrono nel verso dei punti; sp proporzionale alla corrente
function flowLine(pts, t, c, o = {}) {
  const sw = o.sw || 8, sp = o.sp ?? 150, da = o.da || '16 26';
  return `<path d="${P(pts)}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${da}" stroke-dashoffset="${(-t * sp).toFixed(1)}"${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
}
// pila verticale: piastra lunga (+) sopra, corta (−) sotto; i fili si attaccano a y-14 e y+14
function battery(x, y, o = {}) {
  const ink = o.ink || C.line, bg = o.bg || C.bg;
  let s = `<rect x="${x - 60}" y="${y - 13}" width="120" height="26" fill="${bg}"/>`;
  s += `<line x1="${x - 48}" y1="${y - 14}" x2="${x + 48}" y2="${y - 14}" stroke="${ink}" stroke-width="5"/>`;
  s += `<line x1="${x - 24}" y1="${y + 14}" x2="${x + 24}" y2="${y + 14}" stroke="${ink}" stroke-width="12"/>`;
  s += T(x + 64, y - 4, '+', { f: 'pop', size: 40, fill: ink, a: 'start' }) + T(x + 64, y + 40, '−', { f: 'pop', size: 40, fill: ink, a: 'start' });
  if (o.label) s += lbl(x - 72, y + 10, o.label, { a: 'end', fill: ink, size: o.lsize || 28 });
  return s;
}
// sorgente alternata (rete): cerchio con ~
function acSource(x, y, ink = C.line) {
  return `<circle cx="${x}" cy="${y}" r="44" fill="${C.bg}" stroke="${ink}" stroke-width="5"/><path d="M${x - 24},${y} q12,-20 24,0 t24,0" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
}
// resistore (simbolo IEC: rettangolo)
function resistor(x, y, vert, o = {}) {
  const w = vert ? 46 : 132, h = vert ? 132 : 46;
  return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="4" fill="${o.bg || C.bg}" stroke="${o.ink || C.line}" stroke-width="5"/>`;
}
// lampadina: cerchio con X; acceso = alone; rotta = X spezzata
function lamp(x, y, on, o = {}) {
  const r = o.r || 36, ink = o.ink || C.line;
  let s = '';
  if (on > 0) {
    s += `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="url(#${o.coral ? 'glowC' : 'glowL'})" opacity="${on.toFixed(3)}"/>`;
    for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4 + Math.PI / 8, r1 = r + 12, r2 = r + 30;
      s += `<line x1="${(x + r1 * Math.cos(a)).toFixed(1)}" y1="${(y + r1 * Math.sin(a)).toFixed(1)}" x2="${(x + r2 * Math.cos(a)).toFixed(1)}" y2="${(y + r2 * Math.sin(a)).toFixed(1)}" stroke="${o.coral ? C.coral : ink}" stroke-width="4" stroke-linecap="round" opacity="${on.toFixed(3)}"/>`;
    }
  }
  const st = o.broken ? C.coral : ink, d = r * 0.7;
  s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.bg}" stroke="${st}" stroke-width="5"/>`;
  if (o.broken) {
    const g = 0.32; // X spezzata al centro
    s += `<path d="M${x - d},${y - d} L${x - d * g},${y - d * g} M${x + d * g},${y + d * g} L${x + d},${y + d} M${x + d},${y - d} L${x + d * g},${y - d * g} M${x - d * g},${y + d * g} L${x - d},${y + d}" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
  } else s += `<path d="M${x - d},${y - d} L${x + d},${y + d} M${x + d},${y - d} L${x - d},${y + d}" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
  return s;
}
// interruttore orizzontale (contatti a x±50) o verticale; p = apertura 0..1
function switchH(x, y, p, c = C.line) {
  const a = -p * 32 * Math.PI / 180, L = 100;
  return `<rect x="${x - 50}" y="${y - 10}" width="100" height="20" fill="${C.bg}"/>` +
    `<line x1="${x - 50}" y1="${y}" x2="${(x - 50 + L * Math.cos(a)).toFixed(1)}" y2="${(y + L * Math.sin(a)).toFixed(1)}" stroke="${c}" stroke-width="6" stroke-linecap="round"/>` +
    `<circle cx="${x - 50}" cy="${y}" r="9" fill="${C.bg}" stroke="${c}" stroke-width="5"/><circle cx="${x + 50}" cy="${y}" r="9" fill="${C.bg}" stroke="${c}" stroke-width="5"/>`;
}
function switchV(x, y, p, c = C.line) {
  const a = Math.PI / 2 - p * 32 * Math.PI / 180, L = 80;
  return `<rect x="${x - 10}" y="${y - 40}" width="20" height="80" fill="${C.bg}"/>` +
    `<line x1="${x}" y1="${y - 40}" x2="${(x + L * Math.cos(a)).toFixed(1)}" y2="${(y - 40 + L * Math.sin(a)).toFixed(1)}" stroke="${c}" stroke-width="6" stroke-linecap="round"/>` +
    `<circle cx="${x}" cy="${y - 40}" r="8" fill="${C.bg}" stroke="${c}" stroke-width="5"/><circle cx="${x}" cy="${y + 40}" r="8" fill="${C.bg}" stroke="${c}" stroke-width="5"/>`;
}
// amperometro (in serie sul filo)
function ammeter(x, y) {
  return `<circle cx="${x}" cy="${y}" r="30" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>` + T(x, y + 12, 'A', { f: 'pop', size: 34, fill: C.line, a: 'middle' });
}
// nota fissa sul verso convenzionale
function convNote(t, t0, x, y, lines = ['VERSO CONVENZIONALE', 'DELLA CORRENTE: DAL + AL −']) {
  return E(t, t0, arrow(x, y, x + 64, y, C.line, 4) + lines.map((l, i) => lbl(x + 84, y + 9 + i * 38, l, { a: 'start', size: 24 })).join(''), { dy: 6 });
}

// anello rettangolare: pila a sinistra (420, 520), fili a y 280 e 760, lato destro x 1500
const BX = 420, BY = 520, TOP = 280, BOT = 760, RX = 1500;
const LOOP = [[BX, BY - 14], [BX, TOP], [RX, TOP], [RX, BOT], [BX, BOT], [BX, BY + 14]];

// 1 — aggancio: un percorso chiuso
scene('hook', { make: (W) => ({
  capAt: W('chiuso') - 0.1, last: W('corrente'),
  render(t) {
    const on = t > W('scorre') - 0.15;
    let s = E(t, -0.3, wirePath(LOOP), { dy: 0, blur: 6 });
    if (t > W('percorso') - 0.1) s += flowLine(LOOP, t, C.line, { sp: on ? 150 : 0, op: eo((t - W('percorso') + 0.1) / 0.4) });
    s += E(t, -0.2, battery(BX, BY, { label: 'PILA' }), { dy: 0 });
    s += E(t, 0.1, lamp(RX, 520, on ? eo((t - W('scorre') + 0.15) / 0.3) : 0, { coral: true }) + lbl(RX + 60, 528, 'LAMPADINA', { a: 'start' }), { dy: 0 });
    s += E(t, W('percorso') - 0.1, IT(960, 500, 'percorso chiuso', { a: 'middle', size: 64 }), { dy: 10 });
    s += convNote(t, W('corrente') - 0.2, 700, 600);
    return s + caption(t, W('chiuso') - 0.1, 'Un percorso chiuso', '');
  } }) });

// 2 — circuito interrotto
scene('aperto', { make: (W) => ({
  capAt: W('corrente'), last: W('scorre'),
  render(t) {
    const tO = W('aperto') - 0.15, p = eio((t - tO) / 0.35), lit = 1 - clamp((t - tO - 0.25) / 0.2);
    let s = wirePath(LOOP);
    // la corrente si ferma quando il contatto si apre
    if (lit > 0) s += flowLine(LOOP, Math.min(t, tO + 0.25), C.line, { sp: 150, op: lit });
    s += battery(BX, BY, { label: 'PILA' });
    s += lamp(RX, 520, lit) + lbl(RX + 60, 528, 'LAMPADINA', { a: 'start' });
    s += switchH(960, TOP, p, C.coral);
    s += E(t, W('interruttore') - 0.1, lbl(960, 380, 'INTERRUTTORE APERTO'), { dy: 6 });
    // filo rotto: piccolo schema a parte, al centro
    s += E(t, W('filo') - 0.1, `<path d="M760,520 L930,520 L944,504 M976,536 L990,520 L1160,520" fill="none" stroke="${C.line}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` + lbl(960, 590, 'FILO ROTTO'), { dy: 6 });
    s += E(t, W('non') - 0.1, IT(960, 700, 'niente corrente', { a: 'middle', size: 56 }), { dy: 10 });
    return s + caption(t, W('corrente'), 'La corrente non scorre', '');
  } }) });

// 3 — serie: un unico percorso
const RS = [660, 960, 1260];
function seriesCircuit(t, o = {}) {
  let s = wirePath(LOOP);
  if (o.flow) s += flowLine(LOOP, t, o.flowC || C.line, { sp: o.sp ?? 120, op: o.fop });
  s += battery(BX, BY, { label: o.vlab || '' });
  RS.forEach((x, i) => {
    s += E(t, o.rt ? o.rt[i] : -1, resistor(x, TOP, false) + (o.names ? TS(x, TOP - 46, [['R', String(i + 1)]], { f: 'mono', size: 30, a: 'middle', w: 600 }) : ''), { dy: 0 });
  });
  return s;
}
scene('serie', { make: (W) => ({
  capAt: W('unico') - 0.1, last: W('percorso'),
  render(t) {
    // il percorso unico in corallo (unico elemento corallo), sotto i componenti
    let s = seriesCircuit(t, { names: true, rt: [W('componenti') - 0.1, W('dopo') - 0.1, W("l'altro") - 0.1], flow: t > W('lungo') - 0.1, flowC: C.coral, fop: eo((t - W('lungo') + 0.1) / 0.4) });
    s += E(t, W('uno') - 0.1, arrow(735, 380, 885, 380, C.line, 4) + arrow(1035, 380, 1185, 380, C.line, 4) + lbl(960, 440, "UNO DOPO L'ALTRO"), { dy: 6 });
    s += E(t, W('unico') - 0.1, IT(960, 600, 'un unico percorso', { a: 'middle', size: 60 }), { dy: 10 });
    s += convNote(t, W('lungo'), 700, 700);
    return s + caption(t, W('unico') - 0.1, 'Un unico percorso', '');
  } }) });

// 4 — serie: le resistenze si sommano (registro chiaro)
scene('serieR', { make: (W) => ({
  capAt: W('sommano') - 0.1, last: W('sessanta'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 650), { dy: 0 });
    s += E(t, -0.2, T(960, 250, 'TRE RESISTENZE IN SERIE', { f: 'mono', size: 30, fill: ink, a: 'middle', ls: 4, w: 700 }), { dy: 8 });
    s += E(t, -0.1, `<line x1="300" y1="430" x2="1620" y2="430" stroke="${ink}" stroke-width="5"/>` + [560, 960, 1360].map(x => resistor(x, 430, false, { bg: C.cream, ink })).join(''), { dy: 0 });
    ['dieci', 'venti', 'trenta'].forEach((w, i) => { s += E(t, W(w) - 0.1, T([560, 960, 1360][i], 370, ['10 Ω', '20 Ω', '30 Ω'][i], { f: 'pop', size: 52, fill: ink, a: 'middle' }), { dy: 10 }); });
    s += E(t, W('dodici') - 0.1, lbl(960, 520, 'ALIMENTATE CON 12 V', { fill: ink, size: 30 }), { dy: 6 });
    s += E(t, W('sommano') - 0.1, TS(1010, 680, [['R', 'eq'], ' = 10 + 20 + 30 ='], { f: 'pop', size: 66, fill: ink, a: 'end' }), { dy: 12 });
    s += E(t, W('sessanta') - 0.1, T(1040, 680, '60 Ω', { f: 'pop', size: 66, fill: C.coralD }), { dy: 12 });
    return s + caption(t, W('sommano') - 0.1, 'Le resistenze si sommano', '', true);
  } }) });

// 5 — serie: stessa corrente in ogni punto
scene('serieI', { make: (W) => ({
  capAt: W('punto') - 0.2, last: W('due'),
  render(t) {
    let s = seriesCircuit(t, { flow: true, sp: 120, vlab: '12 V' });
    ['10 Ω', '20 Ω', '30 Ω'].forEach((v, i) => { s += T(RS[i], TOP - 46, v, { f: 'mono', size: 30, a: 'middle', w: 600 }); });
    // tre amperometri sullo stesso percorso
    const AM = [[BX, 380, BX - 50, 390, 'end'], [RX, 520, RX + 50, 530, 'start'], [960, BOT, 960, BOT + 70, 'middle']];
    AM.forEach(([x, y, lx, ly, a], i) => {
      s += E(t, W('ogni') - 0.1 + i * 0.12, ammeter(x, y), { dy: 0 });
      s += E(t, W('zero') - 0.1 + i * 0.1, T(lx, ly, '0,2 A', { f: 'pop', size: 40, a }), { dy: 6 });
    });
    s += E(t, W('dodici') - 0.1, TS(960, 520, ['I = 12 V / 60 Ω'], { f: 'pop', size: 58, a: 'middle' }), { dy: 10 });
    s += E(t, W('zero') - 0.1, T(960, 620, '= 0,2 A', { f: 'pop', size: 76, a: 'middle', fill: C.coral }), { dy: 10 });
    return s + caption(t, W('punto') - 0.2, 'Stessa in ogni punto', '');
  } }) });

// 6 — serie: la tensione si divide (registro chiaro)
scene('serieV', { make: (W) => ({
  capAt: W('divide') - 0.1, last: W('dodici'),
  render(t) {
    const ink = C.ink, x0 = 360, u = 100, y0 = 430, h = 130;
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 650), { dy: 0 });
    s += E(t, -0.2, T(960, 250, 'TENSIONE SU OGNI RESISTENZA', { f: 'mono', size: 30, fill: ink, a: 'middle', ls: 4, w: 700 }), { dy: 8 });
    s += E(t, W('divide') - 0.1, TS(960, 330, [['V', 'tot'], ' = ', ['V', '1'], ' + ', ['V', '2'], ' + ', ['V', '3']], { f: 'pop', size: 48, fill: ink, a: 'middle' }), { dy: 8 });
    s += `<rect x="${x0}" y="${y0}" width="${12 * u}" height="${h}" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="10 10" opacity="0.5"/>`;
    const seg = [[0, 2, 'due', '10 Ω'], [2, 4, 'quattro', '20 Ω'], [6, 6, 'sei', '30 Ω']], shade = [0.10, 0.18, 0.26];
    seg.forEach(([a, n, w, r], i) => {
      const tt = W(w) - 0.1, p = eo((t - tt) / 0.45); if (p <= 0) return;
      s += `<rect x="${x0 + a * u}" y="${y0}" width="${(n * u * p).toFixed(1)}" height="${h}" fill="${mix(C.cream, ink, shade[i])}" stroke="${ink}" stroke-width="4"/>`;
      s += E(t, tt + 0.1, T(x0 + (a + n / 2) * u, y0 + 84, `${n} V`, { f: 'pop', size: 52, fill: ink, a: 'middle' }), { dy: 8 });
      s += E(t, tt + 0.15, TS(x0 + (a + n / 2) * u, y0 + h + 52, [['R', String(i + 1)], ' · ' + r], { f: 'mono', size: 28, fill: ink, a: 'middle', w: 600 }), { dy: 6 });
    });
    s += E(t, W('dodici') - 0.15, `<path d="M${x0},${y0 + h + 100} v24 H${x0 + 12 * u} v-24" fill="none" stroke="${ink}" stroke-width="4"/>` + T(960, y0 + h + 180, 'in tutto: 12 V', { f: 'pop', size: 60, fill: C.coralD, a: 'middle' }), { dy: 10 });
    return s + caption(t, W('divide') - 0.1, 'La tensione si divide', '', true);
  } }) });

// 7 — vecchie luci di Natale in serie (rete: corrente alternata, niente trattini)
const LX = [600, 760, 920, 1080, 1240, 1400];
scene('natale1', { make: (W) => ({
  capAt: W('spegnevano') - 0.1, last: W('tutte'),
  render(t) {
    const tb = W('bruciava'), off = clamp((t - tb) / 0.12);
    let s = wirePath([[BX, BY - 44], [BX, TOP], [RX, TOP], [RX, BOT], [BX, BOT], [BX, BY + 44]]);
    s += acSource(BX, BY) + lbl(BX - 62, BY + 10, 'RETE', { a: 'end' });
    LX.forEach((x, i) => { s += lamp(x, TOP, 1 - off, { broken: i === 3 && t >= tb, r: 34 }); });
    s += E(t, 0.1, lbl(960, 160, 'LAMPADINE IN SERIE'), { dy: 6 });
    s += E(t, tb, lbl(1080, 390, 'BRUCIATA'), { dy: 6 });
    s += E(t, W('spegnevano') - 0.1, IT(960, 560, 'si spengono tutte', { a: 'middle', size: 64 }), { dy: 10 });
    s += E(t, W('spegnevano'), lbl(960, 630, 'IL PERCORSO È INTERROTTO'), { dy: 6 });
    return s + caption(t, W('spegnevano') - 0.1, 'Si spegnevano tutte', '');
  } }) });

// 8 — parallelo: rami separati, stessa tensione
// pila a sinistra; rami a x 900 e 1300; rotaie a y 280 (dal +) e 760 (verso il −)
const B1 = 900, B2 = 1300;
function parCircuit(t, o = {}) {
  const rt = o.rt || [-1, -1];
  let s = wirePath([[BX, BY - 14], [BX, TOP], [B1, TOP]]) + wirePath([[B1, BOT], [BX, BOT], [BX, BY + 14]]);
  s += E(t, rt[0], wirePath([[B1, TOP], [B1, BOT]]), { dy: 0, blur: 0 });
  s += E(t, rt[1], wirePath([[B1, TOP], [B2, TOP], [B2, BOT], [B1, BOT]]), { dy: 0, blur: 0 });
  if (o.flow) {
    const k = o.k ?? 300; // velocità per ampere
    s += flowLine([[BX, BY - 14], [BX, TOP], [B1, TOP]], t, C.line, { sp: 0.6 * k });
    s += flowLine([[B1, TOP], [B1, BOT]], t, C.line, { sp: 0.2 * k });
    s += flowLine([[B1, TOP], [B2, TOP], [B2, BOT], [B1, BOT]], t, C.line, { sp: 0.4 * k });
    s += flowLine([[B1, BOT], [BX, BOT], [BX, BY + 14]], t, C.line, { sp: 0.6 * k });
  }
  s += battery(BX, BY, { label: o.vlab || '' });
  s += E(t, rt[0], resistor(B1, 520, true), { dy: 0 }) + E(t, rt[1], resistor(B2, 520, true), { dy: 0 });
  s += `<circle cx="${B1}" cy="${TOP}" r="9" fill="${C.line}"/><circle cx="${B1}" cy="${BOT}" r="9" fill="${C.line}"/>`;
  return s;
}
scene('parallelo', { make: (W) => ({
  capAt: W('rami') - 0.1, last: W('stessa'),
  render(t) {
    let s = parCircuit(t, { rt: [W('rami') - 0.1, W('separati') - 0.1] });
    s += E(t, W('separati'), TS(B1 + 48, 534, [['R', '1']], { f: 'mono', size: 30, w: 600 }) + TS(B2 + 48, 534, [['R', '2']], { f: 'mono', size: 30, w: 600 }), { dy: 6 });
    s += E(t, W('rami') - 0.1, lbl(B1, 860 - 40, 'RAMO 1') + lbl(B2, 860 - 40, 'RAMO 2'), { dy: 6 });
    // i due terminali della sorgente: + in alto, − in basso
    s += E(t, W('terminali') - 0.1, lbl(BX + 30, TOP - 34, 'AL TERMINALE +', { a: 'start' }) + lbl(BX + 30, BOT + 56, 'AL TERMINALE −', { a: 'start' }), { dy: 6 });
    s += E(t, W('ogni') - 0.1, TS(BX - 72, BY + 10, [['V', 'tot']], { f: 'mono', size: 30, a: 'end', w: 600 }) + TS(B1 - 40, 534, [['V', '1']], { f: 'mono', size: 30, a: 'end', w: 600 }) + TS(B2 - 40, 534, [['V', '2']], { f: 'mono', size: 30, a: 'end', w: 600 }), { dy: 6 });
    s += E(t, W('stessa') - 0.1, TS(1420, 380, [['V', 'tot'], ' = ', ['V', '1'], ' = ', ['V', '2']], { f: 'pop', size: 50 }) + IT(1420, 450, 'stessa tensione', { size: 52 }), { dy: 10 });
    return s + caption(t, W('rami') - 0.1, 'Rami separati', 'separati');
  } }) });

// 9 — parallelo: la corrente si divide
scene('paraI', { make: (W) => ({
  capAt: W('divide') - 0.1, last: W('quattro'),
  render(t) {
    const on = t > W('corrente') - 0.2;
    let s = parCircuit(t, { flow: on, vlab: '12 V' });
    s += E(t, W('sessanta') - 0.1, T(B1 + 44, 534, '60 Ω', { f: 'mono', size: 30, w: 600 }), { dy: 6 });
    s += E(t, W('trenta') - 0.1, T(B2 + 44, 534, '30 Ω', { f: 'mono', size: 30, w: 600 }), { dy: 6 });
    s += E(t, W('due') - 0.1, T(B1 - 30, 680, '0,2 A', { f: 'pop', size: 44, a: 'end' }), { dy: 8 });
    s += E(t, W('quattro') - 0.1, T(B2 - 30, 680, '0,4 A', { f: 'pop', size: 44, a: 'end' }), { dy: 8 });
    s += E(t, W('divide') - 0.1, IT(1400, 380, 'la corrente', { size: 52 }) + IT(1400, 440, 'si divide', { size: 52 }), { dy: 10 });
    s += convNote(t, W('corrente'), 1370, 590, ['VERSO CONVENZIONALE', 'DELLA CORRENTE:', 'DAL + AL −']);
    s += E(t, W('corrente'), lbl(1454, 740, 'TRATTINI PIÙ VELOCI', { a: 'start', size: 24 }) + lbl(1454, 778, '= PIÙ CORRENTE', { a: 'start', size: 24 }), { dy: 6 });
    return s + caption(t, W('divide') - 0.1, 'La corrente si divide', 'divide');
  } }) });

// 10 — parallelo: resistenza equivalente e corrente totale (registro chiaro)
scene('paraR', { make: (W) => ({
  capAt: W('equivalente') - 0.1, last: W('sei'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 650), { dy: 0 });
    s += E(t, -0.2, T(960, 250, '60 Ω E 30 Ω IN PARALLELO, A 12 V', { f: 'mono', size: 30, fill: ink, a: 'middle', ls: 4, w: 700 }), { dy: 8 });
    s += E(t, W('resistenza') - 0.1, TS(960, 400, [['R', 'eq'], ' = (60 × 30) / (60 + 30) = 20 Ω'], { f: 'pop', size: 62, fill: ink, a: 'middle' }), { dy: 12 });
    s += E(t, W('corrente') - 0.1, TS(1000, 560, [['I', 'tot'], ' = 12 / 20 ='], { f: 'pop', size: 62, fill: ink, a: 'end' }), { dy: 12 });
    s += E(t, W('zero') - 0.1, T(1030, 560, '0,6 A', { f: 'pop', size: 62, fill: C.coralD }), { dy: 12 });
    s += E(t, W('sei') + 0.1, lbl(960, 680, 'VERIFICA: 0,2 A + 0,4 A = 0,6 A', { fill: ink, size: 30 }), { dy: 6 });
    return s + caption(t, W('equivalente') - 0.1, 'Resistenza equivalente', '', true);
  } }) });

// 11 — luci moderne in parallelo (rete: corrente alternata)
scene('natale2', { make: (W) => ({
  capAt: W('solo') - 0.1, last: W('spegne'),
  render(t) {
    const tb = W('rompe');
    let s = wirePath([[BX, BY - 44], [BX, TOP], [LX[5], TOP]]) + wirePath([[BX, BY + 44], [BX, BOT], [LX[5], BOT]]);
    LX.forEach(x => { s += wirePath([[x, TOP], [x, BOT]]) + `<circle cx="${x}" cy="${TOP}" r="8" fill="${C.line}"/><circle cx="${x}" cy="${BOT}" r="8" fill="${C.line}"/>`; });
    s += acSource(BX, BY) + lbl(BX - 62, BY + 10, 'RETE', { a: 'end' });
    LX.forEach((x, i) => { const br = i === 3 && t >= tb; s += lamp(x, 520, br ? 0 : 1, { broken: br, r: 34 }); });
    s += E(t, 0.1, lbl(960, 200, 'LAMPADINE IN PARALLELO'), { dy: 6 });
    s += E(t, tb, lbl(LX[3], 630, 'ROTTA'), { dy: 6 });
    s += E(t, W('solo') - 0.1, IT(1510, 470, 'le altre', { size: 54 }) + IT(1510, 530, 'restano accese', { size: 54 }), { dy: 10 });
    return s + caption(t, W('solo') - 0.1, 'Solo quella si spegne', '');
  } }) });

// 12 — l'impianto di casa: due rami, ognuno col suo interruttore
scene('casa', { make: (W) => ({
  capAt: W('corridoio') - 0.1, last: W('acceso'),
  render(t) {
    const tS = W('spegni') - 0.1, p = eio((t - tS) / 0.35), lit = 1 - clamp((t - tS - 0.25) / 0.15);
    const HL = 420, HR = 1600, CEIL = 300, FL = 840, MID = 1010, R1 = 760, R2 = 1350, RT = 350, RB = 790;
    // casa in sezione
    let s = `<path d="M${HL - 40},${CEIL} L${(HL + HR) / 2},150 L${HR + 40},${CEIL}" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>`;
    s += `<rect x="${HL}" y="${CEIL}" width="${HR - HL}" height="${FL - CEIL}" fill="${C.earth}" stroke="${C.line}" stroke-width="5"/>`;
    s += `<line x1="${MID}" y1="${CEIL}" x2="${MID}" y2="${FL}" stroke="${mix(C.bg, C.line, 0.45)}" stroke-width="10"/>`;
    // impianto: due conduttori dalla rete, un ramo per stanza
    s += wirePath([[240, RT], [R2, RT]], C.line, 4) + wirePath([[240, RB], [R2, RB]], C.line, 4);
    s += acSource(240, (RT + RB) / 2) + `<line x1="240" y1="${RT}" x2="240" y2="${(RT + RB) / 2 - 44}" stroke="${C.line}" stroke-width="4"/><line x1="240" y1="${RB}" x2="240" y2="${(RT + RB) / 2 + 44}" stroke="${C.line}" stroke-width="4"/>`;
    s += lbl(240, (RT + RB) / 2 + 92, 'RETE');
    [R1, R2].forEach(x => { s += wirePath([[x, RT], [x, RB]], C.line, 4) + `<circle cx="${x}" cy="${RT}" r="8" fill="${C.line}"/><circle cx="${x}" cy="${RB}" r="8" fill="${C.line}"/>`; });
    s += switchV(R1, 450, p, C.coral) + switchV(R2, 450, 0, C.line);
    s += lamp(R1, 640, lit, { r: 34 }) + lamp(R2, 640, 1, { r: 34 });
    s += lbl((HL + MID) / 2 - 80, 420, 'CAMERA') + lbl((MID + HR) / 2 - 90, 420, 'CORRIDOIO');
    s += E(t, W('spegni'), lbl(R1 - 70, 650, 'SPENTA', { a: 'end' }), { dy: 6 });
    s += E(t, W('resta') - 0.1, lbl(R2 + 70, 650, 'ACCESA', { a: 'start' }), { dy: 6 });
    s += E(t, W('parallelo') - 0.1, IT(110, 200, 'due rami separati', { size: 48 }), { dy: 8 });
    return s + caption(t, W('corridoio') - 0.1, 'Il corridoio resta acceso', '');
  } }) });

// 13 — cartello finale
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Serie o parallelo', { f: 'pop', size: 120, a: 'middle', fill: C.ink }), { dy: 0 });
    s += words(t, W('un') - 0.1, 960, 550, 'Un percorso, o tanti rami.', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: '' });
    s += E(t, W('o', 1), `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC ENE-3-04', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
