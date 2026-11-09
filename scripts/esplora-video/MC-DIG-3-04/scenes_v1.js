// I quattro principi WCAG — MC-DIG-3-04 §"I quattro principi WCAG". render(t) puro.
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
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });

// ---- mondo: pagine web, periferiche e tecnologie assistive in line-art ----
function browserSVG(x, y, w, h, st, url, o = {}) {
  const bg = o.bg || C.bg, ink = o.ink || st;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${bg}" stroke="${st}" stroke-width="5"/>` +
    `<line x1="${x}" y1="${y + 74}" x2="${x + w}" y2="${y + 74}" stroke="${st}" stroke-width="3"/>`;
  for (let i = 0; i < 3; i++) s += `<circle cx="${x + 34 + i * 30}" cy="${y + 37}" r="9" fill="none" stroke="${st}" stroke-width="3"/>`;
  s += `<rect x="${x + 140}" y="${y + 16}" width="${w - 170}" height="42" rx="21" fill="${o.bar || DIM()}" stroke="${st}" stroke-width="2.5"/>`;
  if (url) s += T(x + 166, y + 46, url, { f: 'mono', size: 26, fill: ink, w: 500 });
  return s;
}
// distintivo del principio: lettera grande dentro un anello (l'anello è l'unico corallo della scena)
function badge(t, t0, cx, cy, letter, it, en, ink = C.line, ring = C.coral) {
  return E(t, t0, `<circle cx="${cx}" cy="${cy}" r="132" fill="none" stroke="${ring}" stroke-width="8"/>` + T(cx, cy + 62, letter, { f: 'pop', size: 180, a: 'middle', fill: ink }), { dy: 0 }) +
    E(t, t0 + 0.25, T(cx, cy + 238, it, { f: 'pop', size: 58, a: 'middle', fill: ink }), { dy: 14 }) +
    E(t, t0 + 0.45, IT(cx, cy + 298, en, { a: 'middle', size: 44, fill: ink }), { dy: 14 });
}
function speaker(cx, cy, st, waves, wc) { // altoparlante (voce sintetica) con onde
  let s = `<path d="M${cx - 50},${cy - 26} h28 l40,-36 v124 l-40,-36 h-28 z" fill="${DIM()}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 1; i <= 3; i++) if (waves >= i) s += `<path d="M${cx + 30 + i * 22},${cy - 22 - i * 14} a${30 + i * 18},${30 + i * 18} 0 0 1 0,${44 + i * 28}" fill="none" stroke="${wc || st}" stroke-width="6" stroke-linecap="round"/>`;
  return s;
}
function eyeIcon(cx, cy, st) {
  return `<path d="M${cx - 70},${cy} Q${cx},${cy - 62} ${cx + 70},${cy} Q${cx},${cy + 62} ${cx - 70},${cy} z" fill="${DIM()}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<circle cx="${cx}" cy="${cy}" r="24" fill="none" stroke="${st}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="9" fill="${st}"/>`;
}
function earIcon(cx, cy, st) {
  return `<path d="M${cx - 34},${cy - 10} a40,46 0 1 1 74,26 c-10,16 -24,20 -24,40 a20,20 0 0 1 -38,4" fill="none" stroke="${st}" stroke-width="6" stroke-linecap="round"/>` +
    `<path d="M${cx - 10},${cy - 6} a18,18 0 1 1 30,12" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
}
function brailleCell(x, y, bits, st, r = 8, g = 26) { // cella Braille 2x3
  let s = '';
  for (let i = 0; i < 6; i++) { const cx = x + (i < 3 ? 0 : g), cy = y + (i % 3) * g; s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${bits[i] === '1' ? st : 'none'}" stroke="${st}" stroke-width="3"/>`; }
  return s;
}
function mouseIcon(cx, cy, st) {
  return `<rect x="${cx - 48}" y="${cy - 74}" width="96" height="148" rx="48" fill="${DIM()}" stroke="${st}" stroke-width="5"/>` +
    `<line x1="${cx}" y1="${cy - 74}" x2="${cx}" y2="${cy - 18}" stroke="${st}" stroke-width="4"/><line x1="${cx - 48}" y1="${cy - 18}" x2="${cx + 48}" y2="${cy - 18}" stroke="${st}" stroke-width="4"/>` +
    `<rect x="${cx - 7}" y="${cy - 56}" width="14" height="26" rx="7" fill="${st}"/>`;
}
function kbdIcon(cx, cy, st) {
  let s = `<rect x="${cx - 110}" y="${cy - 50}" width="220" height="100" rx="12" fill="${DIM()}" stroke="${st}" stroke-width="5"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) if (!(r === 2 && c > 0 && c < 6)) s += `<rect x="${cx - 94 + c * 27}" y="${cy - 36 + r * 26}" width="20" height="18" rx="3" fill="none" stroke="${st}" stroke-width="2.5"/>`;
  s += `<rect x="${cx - 67}" y="${cy + 16}" width="128" height="18" rx="3" fill="none" stroke="${st}" stroke-width="2.5"/>`;
  return s;
}
function switchIcon(cx, cy, st) {
  return `<ellipse cx="${cx}" cy="${cy + 30}" rx="80" ry="26" fill="${DIM()}" stroke="${st}" stroke-width="5"/>` +
    `<path d="M${cx - 80},${cy + 30} v-26 a80,26 0 0 1 160,0 v26" fill="${DIM()}" stroke="${st}" stroke-width="5"/>` +
    `<ellipse cx="${cx}" cy="${cy + 4}" rx="58" ry="18" fill="none" stroke="${st}" stroke-width="4"/>`;
}
function micIcon(cx, cy, st) {
  return `<rect x="${cx - 26}" y="${cy - 76}" width="52" height="96" rx="26" fill="${DIM()}" stroke="${st}" stroke-width="5"/>` +
    `<path d="M${cx - 50},${cy - 6} a50,50 0 0 0 100,0" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round"/>` +
    `<line x1="${cx}" y1="${cy + 44}" x2="${cx}" y2="${cy + 70}" stroke="${st}" stroke-width="5"/><line x1="${cx - 30}" y1="${cy + 72}" x2="${cx + 30}" y2="${cy + 72}" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
}
function keyCap(x, y, w, label, st, pressed, ink) { // tasto visto in sezione: corpo + spessore
  const dy = pressed ? 8 : 0;
  return `<rect x="${x}" y="${y + 14}" width="${w}" height="84" rx="12" fill="${st}" opacity="0.35"/>` +
    `<rect x="${x}" y="${y + dy}" width="${w}" height="84" rx="12" fill="${pressed ? st : DIM()}" stroke="${st}" stroke-width="4"/>` +
    T(x + w / 2, y + dy + 53, label, { f: 'mono', size: 30, a: 'middle', w: 700, fill: pressed ? (ink || C.bg) : st });
}
function cursorSVG(x, y, st, fill) {
  return `<path d="M${x},${y} l0,64 l16,-15 l12,28 l13,-6 l-12,-27 l22,-2 z" fill="${fill || C.bg}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
}

// 1 — aggancio: le WCAG poggiano su quattro principi
scene('hook', { make: (W) => ({
  capAt: W('quattro'), last: W('quattro') + 0.4,
  render(t) {
    let s = E(t, W('w') - 0.1, T(110, 380, 'WCAG 2.1', { f: 'pop', size: 150 }));
    s += E(t, W('w') + 0.3, IT(116, 470, 'Web Content Accessibility Guidelines', { size: 50 }));
    s += E(t, W('w') + 0.5, lbl(118, 540, 'LINEE GUIDA DEL W3C', { a: 'start' }), { dy: 10 });
    // pagina web sorretta da quattro colonne
    const bx = 1080, bw = 700;
    s += E(t, W('organizzano') - 0.1, browserSVG(bx, 170, bw, 300, C.line, ''), { dy: 14 });
    const rq = eo((t - W('requisiti') + 0.1) / 0.6);
    for (let i = 0; i < 5; i++) {
      const p = clamp(rq * 5 - i); if (p <= 0) continue;
      const y = 285 + i * 34;
      s += `<g opacity="${p}"><rect x="${bx + 40}" y="${y - 12}" width="22" height="22" rx="4" fill="none" stroke="${C.line}" stroke-width="3"/><path d="M${bx + 45},${y} l6,6 l10,-12" fill="none" stroke="${C.line}" stroke-width="3"/>` +
        `<line x1="${bx + 82}" y1="${y}" x2="${bx + 82 + (380 + hsh(i) * 200) * p}" y2="${y}" stroke="${C.line}" stroke-width="4" stroke-linecap="round" opacity="0.8"/></g>`;
    }
    s += E(t, W('requisiti'), lbl(bx + bw / 2, 140, 'REQUISITI'), { dy: 0 });
    for (let i = 0; i < 4; i++) {
      const cx = bx + 90 + i * 173, p = eo((t - W('quattro') + 0.05 - i * 0.12) / 0.45);
      if (p <= 0) continue;
      const h = 300 * p;
      s += `<rect x="${cx - 40}" y="${478}" width="80" height="${h}" fill="${DIM()}" stroke="${C.line}" stroke-width="5"/>` +
        (p > 0.98 ? `<rect x="${cx - 58}" y="778" width="116" height="26" rx="4" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/>` : '');
    }
    return s + caption(t, W('quattro'), 'Quattro principi', 'Quattro');
  } }) });

// 2 — l'acronimo POUR (registro chiaro)
scene('pour', { tail: 0.6, make: (W) => ({
  capAt: W('acronimo'), last: W('erre'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 170, 1520, 640), { dy: 0 });
    s += E(t, W('iniziali') - 0.1, lbl(960, 250, 'LE INIZIALI DEI QUATTRO PRINCIPI', { fill: C.ink }), { dy: 0 });
    const L4 = [['P', 'pi', 'PERCEPIBILE', 'Perceivable'], ['O', 'o', 'OPERABILE', 'Operable'], ['U', 'u', 'COMPRENSIBILE', 'Understandable'], ['R', 'erre', 'ROBUSTO', 'Robust']];
    L4.forEach(([l, w, it, en], i) => {
      const cx = 390 + i * 380, t0 = W(w) - 0.08;
      s += pop(t, t0, cx, 480, T(cx, 540, l, { f: 'pop', size: 230, a: 'middle', fill: C.ink }));
      s += E(t, t0 + 0.15, lbl(cx, 640, it, { fill: C.ink }), { dy: 10 });
      s += E(t, t0 + 0.3, IT(cx, 712, en, { a: 'middle', size: 42, fill: C.ink }), { dy: 10 });
    });
    return s + caption(t, W('acronimo'), 'Un acronimo: POUR', 'POUR', true);
  } }) });

// 3 — Percepibile: tutti i sensi disponibili
scene('perc', { make: (W) => ({
  capAt: W('sensi'), last: W('sensi') + 0.3,
  render(t) {
    let s = badge(t, W('pi') - 0.1, 380, 400, 'P', 'Percepibile', 'Perceivable');
    s += E(t, W('contenuto') - 0.1, browserSVG(880, 180, 560, 360, C.line, '') +
      `<rect x="920" y="290" width="200" height="140" rx="8" fill="none" stroke="${C.line}" stroke-width="3"/><path d="M930,420 l60,-70 l40,40 l30,-30 l50,60" fill="none" stroke="${C.line}" stroke-width="3"/>` +
      [0, 1, 2, 3].map(i => `<line x1="1150" y1="${304 + i * 34}" x2="${1150 + 220 - i * 30}" y2="${304 + i * 34}" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`).join('') +
      lbl(1160, 500, 'CONTENUTO'), { dy: 14 });
    const SN = [[1000, 720, 'VISTA', eyeIcon], [1250, 720, 'UDITO', earIcon], [1500, 720, 'TATTO', (x, y, st) => brailleCell(x - 13, y - 26, '101101', st, 10, 28)]];
    SN.forEach(([x, y, n, f], i) => {
      const t0 = W('sensi') - 0.15 + i * 0.22;
      s += E(t, t0, `<line x1="${x}" y1="${y - 80}" x2="${1160 + (x - 1250) * 0.4}" y2="${560}" stroke="${C.line}" stroke-width="3" stroke-dasharray="3 10"/>` + f(x, y, C.line) + lbl(x, y + 110, n), { dy: 12 });
    });
    return s + caption(t, W('sensi'), 'Tutti i sensi', '');
  } }) });

// 4 — testo alternativo e sottotitoli
scene('alt', { make: (W) => ({
  capAt: W('alternativo'), last: W('sottotitoli') - 0.1,
  render(t) {
    let s = E(t, -0.4, browserSVG(110, 160, 900, 620, C.line, 'sentieri.esempio'), { dy: 0 });
    // immagine: montagna con sentiero
    s += E(t, W("un'immagine") - 0.1, `<rect x="160" y="270" width="800" height="300" rx="10" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/>` +
      `<path d="M180,550 L400,330 L520,450 L620,360 L940,550" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M300,550 C380,500 430,470 470,420 S540,380 600,372" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="4 12"/>` +
      `<circle cx="820" cy="330" r="34" fill="none" stroke="${C.line}" stroke-width="4"/>`, { dy: 10 });
    s += E(t, W('testo') - 0.1, T(160, 650, '<img alt="Sentiero verso la cima">', { f: 'mono', size: 30, w: 600 }) + lbl(160, 712, 'TESTO ALTERNATIVO', { a: 'start' }), { dy: 10 });
    s += E(t, W('testo') - 0.1, pillTag(780, 712, 'ESEMPIO', C.line, C.bg), { dy: 0 });
    // lo screen reader legge ad alta voce
    const wv = clamp((t - W('legge')) / 0.25) * 3;
    s += E(t, W('screen') - 0.1, speaker(1210, 300, C.line, Math.floor(wv), C.coral) + lbl(1210, 440, 'SCREEN READER'), { dy: 10 });
    s += E(t, W('alta') - 0.1, IT(1350, 290, '«Sentiero', { size: 50 }) + IT(1350, 350, 'verso la cima»', { size: 50 }), { dy: 10 });
    // video con sottotitoli
    s += E(t, W('video') - 0.1, `<rect x="1110" y="520" width="680" height="300" rx="14" fill="${DIM()}" stroke="${C.line}" stroke-width="5"/>` +
      `<path d="M1420,580 l60,36 l-60,36 z" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>` + lbl(1450, 500, 'VIDEO CON AUDIO'), { dy: 10 });
    s += E(t, W('sottotitoli') - 0.1, `<rect x="1190" y="710" width="520" height="70" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + lbl(1450, 755, 'SOTTOTITOLI'), { dy: 8 });
    return s + caption(t, W('alternativo'), 'Testo alternativo', '');
  } }) });

// 5 — contrasto (registro chiaro)
scene('contrasto', { tail: 0.6, make: (W) => ({
  capAt: W('45a1'), last: W('normale'),
  render(t) {
    let s = lightBg();
    s += E(t, W('45a1') - 0.08, T(960, 290, '4,5 : 1', { f: 'pop', size: 170, a: 'middle', fill: C.coral }), { dy: 20 });
    s += E(t, W('normale') - 0.1, lbl(960, 350, 'MINIMO PER IL TESTO NORMALE', { fill: C.ink }), { dy: 8 });
    const lowInk = '#CDC5BA';
    s += E(t, W('testo') - 0.15, card(220, 420, 660, 330) + T(550, 600, 'Testo da leggere', { f: 'pop', size: 62, a: 'middle', fill: lowInk }), { dy: 16 });
    s += E(t, W('contrasto') - 0.1, card(1040, 420, 660, 330) + T(1370, 600, 'Testo da leggere', { f: 'pop', size: 62, a: 'middle', fill: C.ink }), { dy: 16 });
    s += E(t, W('sufficiente') - 0.1, lbl(550, 700, 'CONTRASTO BASSO', { fill: C.ink }) + lbl(1370, 700, 'CONTRASTO ALTO', { fill: C.ink }), { dy: 8 });
    s += E(t, W('sfondo') - 0.1, pillTag(960, 830, 'ESEMPIO', C.ink, C.ivory, 'middle'), { dy: 0 });
    return s + caption(t, W('45a1'), 'Almeno 4,5 a 1', '', true);
  } }) });

// 6 — Operabile: qualsiasi periferica di input
scene('oper', { make: (W) => ({
  capAt: W('qualsiasi'), last: W('input'),
  render(t) {
    let s = badge(t, W('o') - 0.1, 380, 400, 'O', 'Operabile', 'Operable');
    // interfaccia al centro
    const ix = 1040, iy = 330, iw = 500, ih = 250;
    s += E(t, W("l'interfaccia") - 0.1, browserSVG(ix, iy, iw, ih, C.line, '') +
      `<rect x="${ix + 150}" y="${iy + 115}" width="220" height="80" rx="14" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/>` + T(ix + 260, iy + 166, 'INVIA', { f: 'mono', size: 30, a: 'middle', w: 700 }), { dy: 14 });
    const cx = ix + iw / 2, cy = iy + ih / 2;
    const DV = [[850, 210, 'MOUSE', mouseIcon], [1700, 210, 'TASTIERA', kbdIcon], [850, 720, 'SWITCH', switchIcon], [1700, 720, 'VOCE', micIcon]];
    DV.forEach(([x, y, n, f], i) => {
      const t0 = W('periferica') - 0.2 + i * 0.2;
      const ex = x < cx ? ix : ix + iw, ey = y < cy ? iy + 40 : iy + ih - 20;
      s += E(t, t0, `<line x1="${x + (x < cx ? 120 : -130)}" y1="${y}" x2="${ex}" y2="${ey}" stroke="${C.line}" stroke-width="3" stroke-dasharray="3 10"/>` +
        f(x, y, C.line) + lbl(x, y + (y < cy ? 130 : 140), n), { dy: 12 });
    });
    return s + caption(t, W('qualsiasi'), 'Qualsiasi periferica', '');
  } }) });

// 7 — la tastiera: il test minimo
scene('tastiera', { tail: 0.6, make: (W) => ({
  capAt: W('anche'), last: W('frecce') - 0.5,
  render(t) {
    let s = E(t, -0.4, browserSVG(200, 150, 1520, 420, C.line, 'scuola.esempio'), { dy: 0 });
    const EL = [[260, 'Home', 200], [500, 'Orari', 200], [740, 'Cerca…', 460], [1240, 'INVIA', 240]];
    EL.forEach(([x, n, w], i) => {
      const btn = i === 3, pressed = btn && t > W('invio') && t < W('invio') + 0.35;
      s += E(t, -0.3 + i * 0.06, `<rect x="${x}" y="320" width="${w}" height="96" rx="12" fill="${pressed ? C.line : DIM()}" stroke="${C.line}" stroke-width="${btn ? 4 : 3}"/>` +
        T(x + (i === 2 ? 26 : w / 2), 380, n, { f: i === 2 ? 'popm' : 'mono', size: 32, a: i === 2 ? 'start' : 'middle', w: i === 2 ? 500 : 700, fill: pressed ? C.bg : C.line }), { dy: 0 });
    });
    // anello di focus: si sposta a ogni Tab
    const tb = W('tab'), hops = [tb, tb + 0.18, tb + 0.36, tb + 0.54];
    let k = -1; hops.forEach((h, i) => { if (t >= h) k = i; });
    if (k >= 0) { const [x, , w] = EL[k]; s += `<rect x="${x - 12}" y="308" width="${w + 24}" height="120" rx="18" fill="none" stroke="${C.coral}" stroke-width="7"/>`; }
    s += E(t, tb - 0.1, lbl(960, 500, 'IL FOCUS SI SPOSTA CON TAB'), { dy: 0 });
    // mouse e tasti
    s += E(t, W('mouse') - 0.1, mouseIcon(1660, 740, C.line) + lbl(1660, 860, 'MOUSE'), { dy: 12 });
    const KS = [['TAB', 180, 'tab'], ['INVIO', 210, 'invio'], ['SPAZIO', 360, 'spazio'], ['←', 84, 'frecce'], ['↑', 84, 'frecce'], ['↓', 84, 'frecce'], ['→', 84, 'frecce']];
    let x = 200;
    KS.forEach(([n, w, wd], i) => {
      const tw0 = W(wd), pr = (wd === 'tab' ? hops.some(h => t > h && t < h + 0.12) : (t > tw0 + (i - 3 > 0 ? (i - 3) * 0.1 : 0) && t < tw0 + 0.25 + (i - 3 > 0 ? (i - 3) * 0.1 : 0)));
      s += E(t, W('tastiera') - 0.1 + i * 0.05, keyCap(x, 660, w, n, C.line, pr), { dy: 10 });
      x += w + (i === 2 ? 50 : 22);
    });
    return s + caption(t, W('anche'), 'Anche da tastiera', '');
  } }) });

// 8 — Comprensibile: linguaggio (registro chiaro)
scene('compr', { tail: 0.6, make: (W) => ({
  capAt: W('gergo'), last: W('disturbi') - 0.1,
  render(t) {
    let s = lightBg() + E(t, -0.4, card(120, 140, 1680, 700), { dy: 0 });
    s += badge(t, W('u') - 0.1, 420, 360, 'U', 'Comprensibile', 'Understandable', C.ink);
    const jx = 780;
    s += E(t, W('gergo') - 0.15, `<rect x="${jx}" y="210" width="940" height="290" rx="14" fill="${C.ivory}" stroke="${C.ink}" stroke-width="3"/>` +
      ['«Procedere all’autenticazione mediante', 'l’inserimento delle credenziali', 'preventivamente registrate nel sistema»'].map((l, i) => IT(jx + 40, 290 + i * 66, l, { size: 46, fill: C.ink })).join(''), { dy: 14 });
    s += E(t, W('gergo') - 0.1, pillTag(jx + 940, 560, 'ESEMPIO', C.ink, C.ivory, 'middle'), { dy: 0 });
    // annotazioni
    s += E(t, W('gergo'), lbl(jx, 580, '↑ GERGO NON SPIEGATO', { fill: C.ink, a: 'start' }), { dy: 8 });
    s += E(t, W('frasi') - 0.05, lbl(jx, 640, '↑ FRASE TROPPO LUNGA', { fill: C.ink, a: 'start' }), { dy: 8 });
    s += E(t, W('difficoltà') - 0.1, `<line x1="${jx}" y1="690" x2="${jx + 940}" y2="690" stroke="${C.ink}" stroke-width="2"/>` + lbl(jx, 750, 'IN DIFFICOLTÀ: CHI HA DISLESSIA', { fill: C.ink, a: 'start' }), { dy: 8 });
    s += E(t, W('disturbi') - 0.1, lbl(jx, 800, 'O DISTURBI COGNITIVI', { fill: C.ink, a: 'start' }), { dy: 8 });
    return s + caption(t, W('gergo'), 'Linguaggio chiaro', '', true);
  } }) });

// 9 — Comprensibile: interfaccia prevedibile
function formPanel(x, y, st, label) {
  return browserSVG(x, y, 680, 400, st, '') +
    `<rect x="${x + 50}" y="${y + 120}" width="580" height="60" rx="8" fill="none" stroke="${st}" stroke-width="3"/>` +
    `<rect x="${x + 50}" y="${y + 200}" width="580" height="60" rx="8" fill="none" stroke="${st}" stroke-width="3"/>` + lbl(x + 340, y - 30, label);
}
scene('preved', { tail: 0.6, make: (W) => ({
  capAt: W('prevedibile'), last: W('disorientarsi') - 0.15,
  render(t) {
    let s = '';
    // a sinistra: click → succede ciò che mi aspetto
    const lx = 180, ly = 260, ck = W('prevedibile') + 0.35;
    s += E(t, -0.4, formPanel(lx, ly, C.line, 'PREVEDIBILE'), { dy: 0 });
    const lOk = t > ck;
    s += `<rect x="${lx + 440}" y="${ly + 290}" width="190" height="70" rx="12" fill="${lOk ? C.line : DIM()}" stroke="${C.line}" stroke-width="4"/>` +
      T(lx + 535, ly + 336, 'INVIA', { f: 'mono', size: 30, a: 'middle', w: 700, fill: lOk ? C.bg : C.line });
    const cmv = eo((t - W('prevedibile') + 0.3) / 0.55);
    s += cursorSVG(lerp(lx + 300, lx + 590, cmv), lerp(ly + 380, ly + 335, cmv), C.line);
    s += E(t, ck + 0.05, `<path d="M${lx + 60},${ly + 324} l14,14 l26,-30" fill="none" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>` + T(lx + 116, ly + 336, 'Messaggio inviato', { f: 'popm', size: 30 }), { dy: 6 });
    s += E(t, ck + 0.1, IT(lx + 340, ly + 480, 'succede ciò che mi aspetto', { a: 'middle', size: 44 }), { dy: 8 });
    // a destra: click → la pagina cambia in modo inaspettato
    const rx = 1060, ry = 260, ck2 = W('click');
    const sh = eo((t - ck2) / 0.5);
    s += E(t, W('se') - 0.1, browserSVG(rx, ry, 680, 400, C.line, '') + lbl(rx + 340, ry - 30, 'INASPETTATO'), { dy: 10 });
    if (t >= W('se') - 0.1) {
      const BL = [[50, 120, 580, 60, 0], [50, 200, 580, 60, 0], [440, 290, 190, 70, 0]];
      const TO = [[300, 100, 330, 120, -9], [40, 250, 240, 90, 12], [90, 120, 160, 70, -16]];
      BL.forEach(([x, y, w, h], i) => {
        const [x2, y2, w2, h2, r2] = TO[i];
        const X = rx + lerp(x, x2, sh), Y = ry + lerp(y, y2, sh), Wd = lerp(w, w2, sh), Hd = lerp(h, h2, sh);
        s += E(t, W('se') - 0.1, `<rect x="${X}" y="${Y}" width="${Wd}" height="${Hd}" rx="8" fill="${i === 2 ? DIM() : 'none'}" stroke="${C.line}" stroke-width="${i === 2 ? 4 : 3}" transform="rotate(${r2 * sh} ${X + Wd / 2} ${Y + Hd / 2})"/>`, { dy: 0 });
      });
      const cm2 = eo((t - ck2 + 0.55) / 0.5);
      s += E(t, W('se'), cursorSVG(lerp(rx + 300, rx + 540, cm2), lerp(ry + 380, ry + 320, cm2), C.line), { dy: 0 });
    }
    s += E(t, W('disorientarsi') - 0.15, T(rx + 560, ry + 330, '?', { f: 'pop', size: 150, a: 'middle', fill: C.coral }), { dy: 16 });
    s += E(t, W('cognitivi') - 0.1, IT(rx + 340, ry + 480, 'ci si può disorientare', { a: 'middle', size: 44 }), { dy: 8 });
    return s + caption(t, W('prevedibile'), 'Niente sorprese', '');
  } }) });

// 10 — Robusto: funziona con le tecnologie assistive
scene('robusto', { make: (W) => ({
  capAt: W('assistive'), last: W('display') - 0.1,
  render(t) {
    let s = badge(t, W('erre') - 0.1, 380, 400, 'R', 'Robusto', 'Robust');
    // contenuto (pagina) al centro
    const px = 860, py = 250;
    s += E(t, W('contenuto') - 0.1, `<path d="M${px},${py} h260 l60,60 v330 h-320 z" fill="${DIM()}" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>` +
      ['<h1>', '<p>', '<p>', '<button>'].map((g, i) => T(px + 34, py + 110 + i * 70, g, { f: 'mono', size: 30, w: 600 })).join('') + lbl(px + 160, py - 30, 'CONTENUTO'), { dy: 12 });
    s += E(t, W('assistive') - 0.1, lbl(1560, 200, 'TECNOLOGIE ASSISTIVE'), { dy: 0 });
    // screen reader
    s += E(t, W('screen') - 0.1, arrow(px + 340, 400, 1340, 360, C.line) + speaker(1460, 360, C.line, 3) + lbl(1560, 480, 'SCREEN READER'), { dy: 10 });
    // display Braille
    let br = `<rect x="1360" y="620" width="420" height="110" rx="16" fill="${DIM()}" stroke="${C.line}" stroke-width="5"/>`;
    ['100000', '110000', '100100', '100110', '100010', '110100'].forEach((b, i) => br += brailleCell(1400 + i * 62, 648, b, C.line, 7, 24));
    s += E(t, W('display') - 0.1, arrow(px + 340, 560, 1340, 670, C.line) + br + lbl(1570, 790, 'DISPLAY BRAILLE'), { dy: 10 });
    return s + caption(t, W('assistive'), 'Tecnologie assistive', '');
  } }) });

// 11 — HTML semantico (registro chiaro)
function fakeBtn(cx, cy) {
  return `<rect x="${cx - 130}" y="${cy - 46}" width="260" height="92" rx="46" fill="${C.ink}"/>` + T(cx, cy + 14, 'Invia', { f: 'pop', size: 40, a: 'middle', fill: C.ivory });
}
scene('html', { tail: 0.7, make: (W) => ({
  capAt: W('struttura'), last: W('non', 1) - 0.1,
  render(t) {
    let s = lightBg();
    s += E(t, 0.25, T(960, 225, 'HTML semantico', { f: 'pop', size: 84, a: 'middle', fill: C.ink }), { dy: 14 });
    // due bottoni con lo stesso aspetto
    s += E(t, W('bottone') - 0.1, card(1020, 300, 680, 480) + fakeBtn(1360, 420), { dy: 14 });
    s += E(t, W('button') - 0.1, T(1360, 560, '<button>Invia</button>', { f: 'mono', size: 34, a: 'middle', w: 700, fill: C.ink }), { dy: 8 });
    s += E(t, W('div') - 0.15, card(220, 300, 680, 480) + fakeBtn(560, 420), { dy: 14 });
    s += E(t, W('div') - 0.05, T(560, 560, '<div>Invia</div>', { f: 'mono', size: 34, a: 'middle', w: 700, fill: C.ink }), { dy: 8 });
    s += E(t, W('div') + 0.1, lbl(960, 860, 'STESSO ASPETTO, CODICE DIVERSO', { fill: C.ink }), { dy: 0 });
    // lo screen reader legge la struttura
    s += E(t, W('struttura') - 0.1, `<line x1="1080" y1="630" x2="1640" y2="630" stroke="${C.ink}" stroke-width="2"/>` +
      `<circle cx="1140" cy="700" r="34" fill="${C.coral}"/><path d="M1124,700 l11,11 l22,-24" fill="none" stroke="${C.ivory}" stroke-width="6" stroke-linecap="round"/>` +
      lbl(1200, 710, 'È UN BOTTONE', { fill: C.ink, a: 'start' }), { dy: 8 });
    s += E(t, W('non', 1) - 0.1, `<line x1="280" y1="630" x2="840" y2="630" stroke="${C.ink}" stroke-width="2"/>` +
      `<circle cx="340" cy="700" r="34" fill="none" stroke="${C.ink}" stroke-width="4"/><path d="M326,686 l28,28 M354,686 l-28,28" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` +
      lbl(400, 710, 'SOLO ASPETTO', { fill: C.ink, a: 'start' }), { dy: 8 });
    return s + caption(t, W('struttura'), 'Struttura, non aspetto', '', true);
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.05, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 400, 'I quattro principi', { f: 'pop', size: 120, a: 'middle', fill: C.ink }), { dy: 0 });
    s += words(t, W('percepibile') - 0.1, 960, 540, 'Percepibile, operabile, comprensibile, robusto.', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: '' });
    // le iniziali POUR: una alla volta, in sincrono con la voce
    ['percepibile', 'operabile', 'comprensibile', 'robusto'].forEach((w, i) => {
      s += E(t, W(w) - 0.05, T(810 + i * 100, 660, 'POUR'[i], { f: 'pop', size: 72, a: 'middle', fill: i === 3 ? C.ink : C.ink }), { dy: 12 });
    });
    s += E(t, W('robusto') + 0.4, `<line x1="760" y1="720" x2="1160" y2="720" stroke="${C.ink}" stroke-width="3"/>` + T(960, 780, 'PROFTECNOLOGIA · MC DIG-3-04', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
