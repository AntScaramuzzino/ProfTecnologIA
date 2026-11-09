// Due chiavi, un segreto — MC-INF-2-02 §"Due tipi di crittografia: simmetrica e asimmetrica". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.5);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="${C.lineDim}" stroke-width="3"/></pattern></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const lblI = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.ink, ls: 3, a: o.a || 'middle', w: 700 });

// ---- mondo: chiavi, lucchetti, buste, in sezione a filo chiaro ----
// kind 0 = impugnatura tonda (pubblica / generica), 1 = impugnatura quadrata (privata)
function key(cx, cy, s, st, fill, kind = 0, rot = 0, sw = 4) {
  const shaft = `<path d="M${cx - 26 * s},${cy - 7 * s} H${cx + 66 * s} V${cy + 7 * s} H${cx + 58 * s} V${cy + 24 * s} H${cx + 46 * s} V${cy + 7 * s} H${cx + 36 * s} V${cy + 18 * s} H${cx + 24 * s} V${cy + 7 * s} H${cx - 26 * s} Z" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  const bow = kind === 2 ? `<path d="M${cx - 26 * s},${cy} L${cx - 56 * s},${cy - 30 * s} L${cx - 86 * s},${cy} L${cx - 56 * s},${cy + 30 * s} Z" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/><circle cx="${cx - 56 * s}" cy="${cy}" r="${8 * s}" fill="none" stroke="${st}" stroke-width="${sw * 0.8}"/>` : kind ? `<rect x="${cx - 82 * s}" y="${cy - 27 * s}" width="${54 * s}" height="${54 * s}" rx="${9 * s}" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>` +
    `<rect x="${cx - 63 * s}" y="${cy - 8 * s}" width="${16 * s}" height="${16 * s}" rx="${3 * s}" fill="none" stroke="${st}" stroke-width="${sw * 0.8}"/>`
    : `<circle cx="${cx - 54 * s}" cy="${cy}" r="${28 * s}" fill="${fill}" stroke="${st}" stroke-width="${sw}"/><circle cx="${cx - 54 * s}" cy="${cy}" r="${9 * s}" fill="none" stroke="${st}" stroke-width="${sw * 0.8}"/>`;
  return `<g transform="rotate(${rot} ${cx} ${cy})">${shaft}${bow}</g>`;
}
function padlock(cx, cy, s, st, fill, open = 0, sw = 5) {
  const up = open * 34 * s;
  return `<path d="M${cx - 36 * s},${cy - 26 * s - up} V${cy - 62 * s - up} A${36 * s},${36 * s} 0 0 1 ${cx + 36 * s},${cy - 62 * s - up} V${cy - 26 * s - up * (open > 0 ? 1.9 : 1)}" fill="none" stroke="${st}" stroke-width="${sw * 2.2}" stroke-linecap="round"/>` +
    `<rect x="${cx - 62 * s}" y="${cy - 30 * s}" width="${124 * s}" height="${100 * s}" rx="${14 * s}" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>` +
    `<circle cx="${cx}" cy="${cy + 12 * s}" r="${11 * s}" fill="${st}"/><rect x="${cx - 4 * s}" y="${cy + 14 * s}" width="${8 * s}" height="${26 * s}" rx="${3 * s}" fill="${st}"/>`;
}
function envelope(cx, cy, w, st, fill, sw = 4) {
  const h = w * 0.64, x = cx - w / 2, y = cy - h / 2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.04}" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>` +
    `<path d="M${x + 4},${y + 6} L${cx},${y + h * 0.58} L${x + w - 4},${y + 6}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
}
function doc(cx, cy, w, h, st, fill, text, tf, sw = 4) {
  return `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>` +
    T(cx, cy + 16, text, { f: 'mono', size: 48, fill: tf || st, a: 'middle', w: 700, ls: 4 });
}
function person(cx, cy, s, st, fill, sw = 5) {
  return `<path d="M${cx - 66 * s},${cy + 64 * s} C${cx - 66 * s},${cy - 4 * s} ${cx + 66 * s},${cy - 4 * s} ${cx + 66 * s},${cy + 64 * s} Z" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>` +
    `<circle cx="${cx}" cy="${cy - 42 * s}" r="${34 * s}" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>`;
}
function xMark(cx, cy, r, c, sw = 9) { return `<path d="M${cx - r},${cy - r} L${cx + r},${cy + r} M${cx + r},${cy - r} L${cx - r},${cy + r}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`; }
function check(cx, cy, r, c, sw = 9) { return `<path d="M${cx - r},${cy} l${r * 0.7},${r * 0.7} l${r * 1.3},${-r * 1.4}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`; }
function browserWin(cx, cy, w, h, st, fill) {
  const x = cx - w / 2, y = cy - h / 2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${st}" stroke-width="4"/><line x1="${x}" y1="${y + 34}" x2="${x + w}" y2="${y + 34}" stroke="${st}" stroke-width="3"/>` +
    [0, 1, 2].map(i => `<circle cx="${x + 20 + i * 18}" cy="${y + 17}" r="5" fill="${st}"/>`).join('') + `<rect x="${x + 80}" y="${y + 9}" width="${w - 100}" height="16" rx="8" fill="none" stroke="${st}" stroke-width="2.5"/>`;
}
function sign(cx, cy, w, h, st, fill) {
  return `<line x1="${cx}" y1="${cy + h / 2}" x2="${cx}" y2="${cy + h / 2 + 50}" stroke="${st}" stroke-width="7" stroke-linecap="round"/>` +
    `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${st}" stroke-width="4"/>`;
}
const esempio = (x, y, ink, bg) => pillTag(x, y, 'ESEMPIO', ink, bg);

// 1 — due famiglie
scene('intro', { make: (W) => ({
  capAt: W('due'), last: W('asimmetrica') + 0.3,
  render(t) {
    let s = words(t, -0.2, 960, 250, 'La crittografia moderna', { f: 'pop', size: 84, a: 'middle' });
    s += E(t, W('simmetrica') - 0.1, padlock(560, 470, 1.3, C.line, DIM()) + key(560, 690, 1.15, C.line, DIM(), 2), { dy: 18 });
    s += E(t, W('simmetrica'), lbl(560, 830, 'SIMMETRICA', { size: 30 }), { dy: 10 });
    s += E(t, W('asimmetrica') - 0.15, padlock(1360, 470, 1.3, C.line, DIM()) + key(1230, 680, 1.0, C.line, DIM(), 0) + lbl(1230, 750, 'CHIUDE', { size: 24 }), { dy: 18 });
    s += E(t, W('asimmetrica') + 0.15, key(1500, 680, 1.0, C.ivory, C.coral, 1) + lbl(1500, 750, 'APRE', { size: 24 }), { dy: 18 });
    s += E(t, W('asimmetrica'), lbl(1360, 830, 'ASIMMETRICA', { size: 30 }), { dy: 10 });
    return s + caption(t, W('due'), 'Due grandi famiglie', '');
  } }) });

// 2 — simmetrica: la stessa chiave (chiaro)
scene('stessa', { make: (W) => ({
  capAt: W('stessa'), last: W('velocissima'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(120, 160, 1680, 660), { dy: 0 }) + E(t, -0.3, esempio(160, 222, ink, C.ivory), { dy: 0 });
    s += E(t, -0.3, doc(330, 480, 270, 170, ink, C.ivory, 'CIAO') + lblI(330, 615, 'MESSAGGIO'), { dy: 12 });
    s += E(t, W('stessa') - 0.1, key(660, 375, 1.2, ink, C.ivory, 2), { dy: 12 });
    s += E(t, W('stessa'), key(1260, 375, 1.2, ink, C.ivory, 2), { dy: 12 });
    s += E(t, W('chiave') - 0.05, `<path d="M660,330 V290 H1260 V330" fill="none" stroke="${C.coral}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>` + lblI(960, 270, 'STESSA CHIAVE'), { dy: 0 });
    s += E(t, W('cifrare') - 0.1, arrow(480, 480, 820, 480, ink, 5) + lblI(650, 530, 'CIFRA'), { dy: 0 });
    s += E(t, W('cifrare') + 0.15, doc(960, 480, 270, 170, ink, C.ivory, 'Q#9Z') + lblI(960, 615, 'TESTO CIFRATO'), { dy: 12 });
    s += E(t, W('decifrare') - 0.1, arrow(1100, 480, 1440, 480, ink, 5) + lblI(1270, 530, 'DECIFRA'), { dy: 0 });
    s += E(t, W('decifrare') + 0.15, doc(1590, 480, 270, 170, ink, C.ivory, 'CIAO') + lblI(1590, 615, 'MESSAGGIO'), { dy: 12 });
    s += E(t, W('velocissima') - 0.1, pillTag(960, 730, 'VANTAGGIO · VELOCISSIMA DA CALCOLARE', ink, C.ivory, 'middle'), { dy: 10 });
    return s + caption(t, W('stessa'), 'La stessa chiave', '', true);
  } }) });

// 3 — entrambi conoscono la chiave
scene('entrambi', { make: (W) => ({
  capAt: W('entrambi'), last: W('segreta'),
  render(t) {
    const st = C.line;
    let s = E(t, -0.3, person(400, 430, 1.25, st, DIM()) + lbl(400, 590, 'CHI MANDA'), { dy: 12 });
    s += E(t, W('riceve') - 0.15, person(1520, 430, 1.25, st, DIM()) + lbl(1520, 590, 'CHI RICEVE'), { dy: 12 });
    s += E(t, W('messaggio') - 0.1, `<line x1="560" y1="400" x2="1340" y2="400" stroke="${C.lineDim}" stroke-width="4" stroke-dasharray="4 14" stroke-linecap="round"/>` + envelope(960, 400, 170, st, C.bg), { dy: 0 });
    s += E(t, W('conoscere') - 0.1, key(420, 720, 1.25, st, DIM(), 2), { dy: 12 });
    s += E(t, W('entrambi') - 0.1, key(1540, 720, 1.25, st, DIM(), 2), { dy: 12 });
    s += E(t, W('entrambi') + 0.1, `<path d="M915,705 h90 M915,737 h90" stroke="${C.coral}" stroke-width="10" stroke-linecap="round"/>`, { dy: 0 });
    s += E(t, W('segreta') - 0.1, lbl(960, 810, 'CHIAVE SEGRETA'), { dy: 8 });
    return s + caption(t, W('entrambi'), 'Entrambi conoscono la chiave', '');
  } }) });

// 4 — la chiave in viaggio
scene('tragitto', { make: (W) => ({
  capAt: W('tragitto'), last: W('intercetti') + 0.3,
  render(t) {
    const st = C.line;
    let s = E(t, -0.3, person(280, 400, 1.15, st, DIM()) + lbl(280, 550, 'CHI MANDA'), { dy: 0 });
    s += E(t, W('destinatario') - 0.15, person(1640, 400, 1.15, st, DIM()) + lbl(1640, 550, 'DESTINATARIO'), { dy: 12 });
    s += E(t, -0.2, `<line x1="420" y1="400" x2="1500" y2="400" stroke="${C.lineDim}" stroke-width="4" stroke-dasharray="4 14" stroke-linecap="round"/>`, { dy: 0, blur: 0 });
    const t0 = W('sapere'), t1 = W('tragitto') + 1.0, p = clamp((t - t0) / (t1 - t0)), kx = lerp(470, 1180, p);
    if (t > t0 - 0.2) s += E(t, t0 - 0.2, key(kx, 400, 1.25, st, C.bg, 2), { dy: 0, blur: 6 });
    s += E(t, W('qualcuno') - 0.1, person(960, 690, 1.05, st, DIM()) + lbl(960, 820, 'QUALCUNO?'), { dy: 14 });
    const ti = W('intercetti') - 0.05;
    if (t > ti) { const g = eo((t - ti) / 0.4); s += `<path d="M935,612 L${lerp(935, kx - 30, g)},${lerp(612, 440, g)} M985,612 L${lerp(985, kx + 30, g)},${lerp(612, 440, g)}" stroke="${C.coral}" stroke-width="5" stroke-dasharray="6 10" stroke-linecap="round"/>`; }
    return s + caption(t, W('tragitto'), 'Nel tragitto', '');
  } }) });

// 5 — email intercettata: la sicurezza crolla
scene('crolla', { make: (W) => ({
  capAt: W('sicurezza'), last: W('crolla'),
  render(t) {
    const st = C.line, oc = clamp((t - W('crolla')) / 0.35);
    let s = E(t, -0.3, envelope(300, 360, 230, st, DIM()) + key(300, 375, 0.75, st, C.bg, 2) + lbl(300, 480, 'EMAIL'), { dy: 12 });
    s += E(t, W('email') - 0.1, arrow(440, 360, 1020, 360, C.lineDim, 4), { dy: 0, blur: 0 });
    s += E(t, W('email'), person(1130, 360, 1.05, st, DIM()) + lbl(1130, 500, 'DESTINATARIO'), { dy: 12 });
    s += E(t, -0.1, `<g opacity="${t > W('crolla') - 0.05 ? 0 : 1}">${padlock(1600, 640, 1.2, st, DIM(), 0)}</g>` + lbl(1600, 800, 'MESSAGGI CIFRATI'), { dy: 12 });
    const ic = W('intercettata');
    s += E(t, ic - 0.1, arrow(730, 370, 730, 560, st, 4) + person(730, 700, 0.95, st, DIM()), { dy: 0 });
    s += E(t, ic + 0.3, key(930, 690, 0.95, st, DIM(), 2) + lbl(930, 790, 'COPIA'), { dy: 10 });
    s += E(t, W('sicurezza') - 0.1, `<path d="M1030,690 C1200,700 1320,670 1500,660" fill="none" stroke="${st}" stroke-width="4" stroke-dasharray="6 10" stroke-linecap="round"/>`, { dy: 0, blur: 0 });
    if (t > W('crolla') - 0.05) s += E(t, W('crolla') - 0.05, padlock(1600, 640, 1.2, C.coral, C.bg, oc), { dy: 0, blur: 4, d: 0.3 });
    return s + caption(t, W('sicurezza'), 'La sicurezza crolla', '');
  } }) });

// 6 — problema della distribuzione delle chiavi (chiaro)
scene('distribuzione', { make: (W) => ({
  capAt: W('irrisolto'), last: W('millenni'),
  render(t) {
    const ink = C.ink;
    let s = lightBg() + E(t, -0.4, card(160, 170, 1600, 640), { dy: 0 });
    s += words(t, W('problema') - 0.15, 960, 330, 'Il problema della', { f: 'pop', size: 76, fill: ink, a: 'middle' });
    s += words(t, W('distribuzione') - 0.1, 960, 430, 'distribuzione delle chiavi', { f: 'pop', size: 76, fill: ink, a: 'middle' });
    s += E(t, W('rimasto') - 0.1, arrow(300, 600, 1420, 600, ink, 5) + [0, 1, 2, 3, 4, 5, 6].map(i => `<line x1="${330 + i * 160}" y1="584" x2="${330 + i * 160}" y2="616" stroke="${ink}" stroke-width="4"/>`).join(''), { dy: 0 });
    s += E(t, W('irrisolto') - 0.1, key(1560, 600, 1.1, ink, C.ivory, 2) + T(1560, 560, '?', { f: 'pop', size: 96, fill: C.coralD, a: 'middle' }), { dy: 12 });
    s += E(t, W('millenni') - 0.1, lblI(860, 680, 'PER MILLENNI'), { dy: 8 });
    return s + caption(t, W('irrisolto'), 'Irrisolto per millenni', '', true);
  } }) });

// 7 — 1976: due chiavi diverse, collegate
scene('idea', { make: (W) => ({
  capAt: W('due', 1), last: W('matematicamente'),
  render(t) {
    const st = C.line;
    let s = E(t, W('millenovecentosettantasei') - 0.1, T(960, 330, '1976', { f: 'pop', size: 150, a: 'middle' }), { dy: 20 });
    s += E(t, W('crittografi') - 0.15, person(560, 300, 0.85, st, DIM()), { dy: 14 });
    s += E(t, W('crittografi') - 0.05, person(1360, 300, 0.85, st, DIM()), { dy: 14 });
    s += E(t, W('crittografi'), lbl(960, 190, 'DUE CRITTOGRAFI'), { dy: 8 });
    s += E(t, W('rivoluzionaria') - 0.1, IT(960, 430, "un'idea rivoluzionaria", { size: 60, a: 'middle' }));
    s += E(t, W('due', 1) - 0.1, key(640, 610, 1.6, st, DIM(), 0), { dy: 14 });
    s += E(t, W('diverse') - 0.15, key(1300, 610, 1.6, C.ivory, C.coral, 1), { dy: 14 });
    s += E(t, W('collegate') - 0.1, `<line x1="770" y1="610" x2="1150" y2="610" stroke="${st}" stroke-width="5" stroke-dasharray="6 12" stroke-linecap="round"/>`, { dy: 0, blur: 0 });
    s += E(t, W('matematicamente') - 0.1, IT(960, 740, 'collegate matematicamente', { size: 48, a: 'middle' }), { dy: 10 });
    return s + caption(t, W('due', 1), 'Due chiavi diverse', '');
  } }) });

// 8 — pubblica e privata (chiaro)
scene('coppia', { make: (W) => ({
  capAt: W('pubblica'), last: W('proprietario'),
  render(t) {
    const ink = C.ink;
    let s = lightBg();
    s += E(t, -0.4, card(170, 180, 740, 600) + key(540, 300, 1.35, ink, C.ivory, 0) + lblI(540, 430, 'CHIAVE PUBBLICA', { size: 32 }), { dy: 0 });
    s += E(t, W('chiunque') - 0.1, [0, 1, 2, 3, 4].map(i => person(340 + i * 100, 580, 0.55, ink, C.ivory, 4)).join(''), { dy: 12 });
    s += E(t, W('conoscere') - 0.1, IT(540, 720, 'chiunque può conoscerla', { size: 44, a: 'middle', fill: ink }), { dy: 8 });
    s += E(t, W('privata') - 0.35, card(1010, 180, 740, 600) + key(1380, 300, 1.35, ink, C.coral, 1) + lblI(1380, 430, 'CHIAVE PRIVATA', { size: 32 }), { dy: 0 });
    s += E(t, W('proprietario') - 0.1, person(1380, 580, 0.55, ink, C.ivory, 4), { dy: 12 });
    s += E(t, W('proprietario') + 0.1, IT(1380, 720, 'solo il proprietario', { size: 44, a: 'middle', fill: ink }), { dy: 8 });
    return s + caption(t, W('pubblica'), 'Pubblica e privata', '', true);
  } }) });

// 9 — si decifra solo con la privata
scene('solo', { make: (W) => ({
  capAt: W('solo'), last: W('stessa') + 0.4,
  render(t) {
    const st = C.line;
    let s = E(t, -0.3, esempio(96, 190, st, C.bg), { dy: 0 });
    s += E(t, -0.3, doc(220, 560, 220, 140, st, DIM(), 'CIAO') + lbl(220, 670, 'MESSAGGIO'), { dy: 12 });
    // l'unica chiave pubblica: quella del destinatario
    s += E(t, W('cifrato') - 0.15, key(510, 330, 1.1, st, DIM(), 0) + lbl(490, 222, 'CHIAVE PUBBLICA', { size: 24 }) + lbl(490, 256, 'DEL DESTINATARIO', { size: 24 }) +
      `<line x1="510" y1="370" x2="510" y2="530" stroke="${st}" stroke-width="3" stroke-dasharray="5 9"/>`, { dy: 12 });
    s += E(t, W('cifrato') - 0.05, arrow(340, 560, 660, 560, st, 4) + lbl(500, 610, 'CIFRA'), { dy: 0 });
    s += E(t, W('pubblica') - 0.05, doc(780, 560, 220, 140, st, DIM(), 'Q#9Z') + lbl(780, 670, 'CIFRATO'), { dy: 12 });
    // ramo basso: chiave privata del destinatario
    s += E(t, W('privata') - 0.15, arrow(900, 600, 1010, 700, st, 4) + key(1150, 720, 1.1, C.ivory, C.coral, 1) + lbl(1140, 810, 'CHIAVE PRIVATA', { size: 24 }) + lbl(1140, 844, 'DEL DESTINATARIO', { size: 24 }), { dy: 12 });
    s += E(t, W('corrispondente') - 0.1, arrow(1260, 720, 1340, 720, st, 4) + doc(1460, 720, 210, 130, st, DIM(), 'CIAO') + lbl(1460, 820, 'DECIFRATO', { size: 24 }), { dy: 12 });
    s += E(t, W('corrispondente') + 0.15, person(1740, 710, 0.75, st, DIM()) + lbl(1740, 800, 'DESTINATARIO', { size: 24 }), { dy: 12 });
    // ramo alto: la STESSA chiave pubblica non decifra
    s += E(t, W('non') - 0.1, arrow(900, 520, 1060, 370, st, 4) + `<path d="M620,330 H1080" stroke="${st}" stroke-width="3" stroke-dasharray="5 9"/><circle cx="1090" cy="340" r="9" fill="${st}"/>`, { dy: 0, blur: 0 });
    s += E(t, W('stessa') - 0.1, arrow(1110, 345, 1290, 345, st, 4) + doc(1420, 345, 210, 130, st, DIM(), 'Q#9Z') +
      `<line x1="1325" y1="400" x2="1515" y2="290" stroke="${st}" stroke-width="6" stroke-linecap="round"/>` + lbl(1420, 450, 'ILLEGGIBILE', { size: 24 }), { dy: 8 });
    return s + caption(t, W('solo'), 'Solo la privata decifra', '');
  } }) });

// 10 — la cassetta delle lettere
scene('cassetta', { make: (W) => ({
  capAt: W('chiunque'), last: W('proprietario') + 1.5 + 0.9,
  render(t) {
    const st = C.line, X0 = 800, X1 = 1120, Y0 = 240, Y1 = 780;
    const tk = W('proprietario') - 0.1, tin = tk + 1.4, top = tin + 0.5;
    const op = eio((t - top) / 0.6);
    let s = '';
    let box = `<rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="16" fill="url(#hatch)" stroke="${st}" stroke-width="5"/>` +
      `<rect x="${X0 + 22}" y="${Y0 + 22}" width="${X1 - X0 - 44}" height="${Y1 - Y0 - 44}" rx="8" fill="${C.bg}" stroke="${st}" stroke-width="3"/>`;
    box += `<rect x="880" y="314" width="160" height="20" rx="6" fill="${C.bg}" stroke="${st}" stroke-width="4"/>`;
    if (op > 0) box += [0, 1, 2].map(i => envelope(930 + (i - 1) * 14, 690 - i * 32, 140, st, DIM(), 3)).join('');
    const sx = 1 - 0.85 * op;
    box += `<g transform="translate(840,0) scale(${sx.toFixed(3)},1) translate(-840,0)"><rect x="840" y="420" width="200" height="320" rx="8" fill="${DIM()}" stroke="${st}" stroke-width="4"/></g>`;
    // serratura sul telaio (resta ferma quando lo sportello si apre)
    box += `<rect x="1054" y="540" width="42" height="70" rx="6" fill="${C.bg}" stroke="${st}" stroke-width="4"/><circle cx="1075" cy="568" r="8" fill="${st}"/><rect x="1072" y="570" width="6" height="18" rx="2" fill="${st}"/>`;
    s += E(t, -0.4, box, { dy: 0 });
    [['chiunque', 640], ['infilare', 960], ['messaggio', 1280]].forEach(([w, x0], i) => {
      const t0 = W(w) - 0.15, p = eio((t - t0) / 0.8);
      if (p <= 0) return;
      const x = lerp(x0, 960, p), y = lerp(140, 380, p), rot = lerp((i - 1) * 25, 90, p);
      s += `<clipPath id="cl${i}"><rect x="0" y="0" width="1920" height="324"/></clipPath><g clip-path="url(#cl${i})" opacity="${clamp(p * 3)}"><g transform="rotate(${rot} ${x} ${y})">${envelope(x, y, 120, st, C.bg, 3)}</g></g>`;
    });
    s += E(t, W('fessura') - 0.1, `<line x1="760" y1="324" x2="870" y2="324" stroke="${st}" stroke-width="3"/>` + lbl(740, 334, 'FESSURA', { a: 'end' }) + IT(740, 390, 'chiave pubblica: cifrare', { size: 40, a: 'end' }), { dy: 8 });
    // chiave del proprietario: compare, resta ferma, entra e rimane inserita
    const pk = eio((t - tin) / 0.45), kx = lerp(1420, 1075 + 66 * 1.1, pk);
    if (t > tk) s += E(t, tk, key(kx, 575, 1.1, C.ivory, C.coral, 1, 180), { dy: 0 });
    s += E(t, W('proprietario') - 0.1, `<line x1="1180" y1="470" x2="1090" y2="536" stroke="${st}" stroke-width="3"/>` + lbl(1190, 470, 'SERRATURA', { a: 'start' }) + IT(1190, 420, 'chiave privata: decifrare', { size: 40 }), { dy: 8 });
    return s + caption(t, W('chiunque'), 'Chiunque può infilare', '');
  } }) });

// 11 — pubblicala ovunque (chiaro)
scene('ovunque', { make: (W) => ({
  capAt: W('ovunque'), last: W('conosce'),
  render(t) {
    const ink = C.ink;
    let s = lightBg();
    s += E(t, -0.3, key(960, 250, 1.4, ink, C.ivory, 0) + lblI(960, 370, 'CHIAVE PUBBLICA', { size: 30 }), { dy: 12 });
    s += E(t, W('risolto') - 0.1, `<g transform="rotate(-8 330 260)"><rect x="170" y="210" width="320" height="96" rx="12" fill="none" stroke="${C.coral}" stroke-width="6"/>` +
      T(330, 272, 'RISOLTO', { f: 'mono', size: 40, fill: C.coralD, a: 'middle', w: 700, ls: 6 }) + '</g>', { dy: 0 });
    const items = [['SITO WEB', 480], ['EMAIL', 960], ['CARTELLO', 1440]];
    items.forEach(([l, x], i) => {
      const t0 = W('ovunque') - 0.4 + i * 0.22;
      let ic = '';
      if (i === 0) ic = browserWin(x, 580, 230, 150, ink, C.ivory) + key(x, 600, 0.6, ink, C.ivory, 0, 0, 3);
      if (i === 1) ic = envelope(x, 575, 220, ink, C.ivory) + key(x, 600, 0.6, ink, C.ivory, 0, 0, 3);
      if (i === 2) ic = sign(x, 560, 230, 130, ink, C.ivory) + key(x, 560, 0.6, ink, C.ivory, 0, 0, 3);
      s += E(t, t0, card(x - 190, 460, 380, 300) + ic + lblI(x, 725, l), { dy: 16 });
    });
    s += E(t, W('importa') - 0.1, IT(960, 850, 'Non importa chi la conosce.', { size: 50, a: 'middle', fill: ink }), { dy: 8 });
    return s + caption(t, W('ovunque'), 'Pubblicala ovunque', '', true);
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Due chiavi, un segreto', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('solo') - 0.2, 960, 545, 'Solo chi ha la tua chiave privata', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'privata', keyFill: C.coralD });
    s += words(t, W('può') - 0.1, 960, 630, 'può leggere i messaggi.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true });
    s += E(t, W('messaggi') + 0.3, `<line x1="760" y1="700" x2="1160" y2="700" stroke="${C.ink}" stroke-width="3"/>` + T(960, 760, 'PROFTECNOLOGIA · MC INF-2-02', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
