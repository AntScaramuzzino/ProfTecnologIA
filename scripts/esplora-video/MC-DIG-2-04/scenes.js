// La seconda serratura — MC-DIG-2-04 §"4. Autenticazione a due fattori (2FA)". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.5);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.6);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });

// ---- mondo: serrature, chiavi, telefoni, finestre del browser (line-art in sezione) ----
function keySVG(x, y, st, s = 1) { // anello a sinistra in (x,y), stelo verso destra
  const r = 44 * s;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${DIM()}" stroke="${st}" stroke-width="5"/><circle cx="${x}" cy="${y}" r="${r * 0.35}" fill="${C.bg}" stroke="${st}" stroke-width="4"/>` +
    `<path d="M${x + r},${y - 9 * s} H${x + 230 * s} V${y + 9 * s} H${x + r}" fill="${DIM()}" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M${x + 180 * s},${y + 9 * s} v${30 * s} h${18 * s} v${-14 * s} h${14 * s} v${22 * s} h${18 * s} v${-38 * s}" fill="none" stroke="${st}" stroke-width="5" stroke-linejoin="round"/>`;
}
function lockSVG(cx, cy, st, open = 0, s = 1) { // lucchetto: corpo + arco; open 0..1 alza l'arco
  const w = 120 * s, h = 100 * s, lift = open * 34 * s;
  return `<path d="M${cx - 34 * s},${cy - lift} V${cy - 40 * s - lift} a${34 * s},${34 * s} 0 0 1 ${68 * s},0 V${cy - (open > 0.5 ? 10 * s : 0) - lift}" fill="none" stroke="${st}" stroke-width="${9 * s}" stroke-linecap="round"/>` +
    `<rect x="${cx - w / 2}" y="${cy}" width="${w}" height="${h}" rx="${14 * s}" fill="${DIM()}" stroke="${st}" stroke-width="5"/>` +
    `<circle cx="${cx}" cy="${cy + 40 * s}" r="${11 * s}" fill="${st}"/><rect x="${cx - 5 * s}" y="${cy + 44 * s}" width="${10 * s}" height="${30 * s}" rx="3" fill="${st}"/>`;
}
function phoneSVG(x, y, w, h, st, inner = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="30" fill="${C.bg}" stroke="${st}" stroke-width="5"/>` +
    `<rect x="${x + 14}" y="${y + 44}" width="${w - 28}" height="${h - 88}" rx="10" fill="${DIM()}" stroke="${st}" stroke-width="2.5"/>` +
    `<line x1="${x + w / 2 - 26}" y1="${y + 24}" x2="${x + w / 2 + 26}" y2="${y + 24}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="${x + w / 2}" cy="${y + h - 22}" r="9" fill="none" stroke="${st}" stroke-width="3"/>` + inner;
}
function browserSVG(x, y, w, h, st, url, o = {}) {
  const bg = o.bg || C.bg, ink = o.ink || st;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${bg}" stroke="${st}" stroke-width="5"/>` +
    `<line x1="${x}" y1="${y + 74}" x2="${x + w}" y2="${y + 74}" stroke="${st}" stroke-width="3"/>`;
  if (!o.nodots) for (let i = 0; i < 3; i++) s += `<circle cx="${x + 34 + i * 30}" cy="${y + 37}" r="9" fill="none" stroke="${st}" stroke-width="3"/>`;
  const bx0 = o.nodots ? 20 : 140;
  s += `<rect x="${x + bx0}" y="${y + 16}" width="${w - bx0 - 30}" height="42" rx="21" fill="${o.bar || DIM()}" stroke="${st}" stroke-width="2.5"/>`;
  s += T(x + bx0 + 26, y + 46, url, { f: 'mono', size: 26, fill: ink, w: 500 });
  return s;
}
function boxes(x, y, code, n, st, o = {}) { // caselle del codice; code = stringa già digitata
  const bw = o.bw || 84, gap = o.gap || 16, bh = o.bh || 100; let s = '';
  for (let i = 0; i < 6; i++) {
    const bx = x + i * (bw + gap) + (i >= 3 ? (o.mid || 22) : 0);
    s += `<rect x="${bx}" y="${y}" width="${bw}" height="${bh}" rx="12" fill="${o.fill || DIM()}" stroke="${st}" stroke-width="3"/>`;
    if (i < code.length) s += T(bx + bw / 2, y + bh / 2 + (o.size || 52) * 0.36, code[i], { f: 'mono', size: o.size || 52, fill: o.ink || st, a: 'middle', w: 700 });
  }
  return s;
}
const boxesW = (o = {}) => 6 * (o.bw || 84) + 5 * (o.gap || 16) + (o.mid || 22);
function hookSVG(x, top, y, st) { // lenza da (x,top) all'amo con punta in alto a sinistra
  return `<line x1="${x}" y1="${top}" x2="${x}" y2="${y}" stroke="${st}" stroke-width="4"/>` +
    `<path d="M${x},${y} V${y + 50} a34,34 0 0 1 -68,0 v-18" fill="none" stroke="${st}" stroke-width="8" stroke-linecap="round"/>` +
    `<path d="M${x - 68},${y + 30} l-12,16 l20,-4 z" fill="${st}"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${st}" stroke-width="4"/>`;
}
function stepBadge(t, n, txt) {
  return E(t, -0.4, `<circle cx="330" cy="430" r="130" fill="none" stroke="${C.coral}" stroke-width="7"/>` + T(330, 490, String(n), { f: 'pop', size: 170, a: 'middle' }) +
    lbl(330, 620, 'PASSO ' + n) + IT(330, 690, txt, { a: 'middle', size: 46 }), { dy: 0 });
}
function doorSVG(st) { // porta in vista frontale con stipite in sezione
  let s = `<rect x="730" y="150" width="460" height="730" fill="none" stroke="${st}" stroke-width="4" stroke-dasharray="2 10"/>`;
  s += `<rect x="760" y="170" width="400" height="710" rx="6" fill="${mix(C.bg, C.line, 0.06)}" stroke="${st}" stroke-width="6"/>`;
  s += `<rect x="800" y="220" width="320" height="140" rx="6" fill="none" stroke="${st}" stroke-width="2.5" opacity="0.7"/><rect x="800" y="740" width="320" height="100" rx="6" fill="none" stroke="${st}" stroke-width="2.5" opacity="0.7"/>`;
  [240, 800].forEach(y => s += `<rect x="752" y="${y}" width="16" height="50" rx="4" fill="${st}"/>`);
  return s;
}
function readerSVG(cx, cy, st, ok) { // lettore di badge: telefono avvicinato
  let s = `<rect x="${cx - 60}" y="${cy - 70}" width="120" height="150" rx="14" fill="${DIM()}" stroke="${st}" stroke-width="5"/>`;
  for (let i = 1; i <= 3; i++) s += `<path d="M${cx - 16 * i},${cy - 10 - 6 * i} a${22 * i},${22 * i} 0 0 1 ${32 * i},0" fill="none" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<rect x="${cx - 34}" y="${cy + 30}" width="68" height="28" rx="6" fill="${ok ? st : 'none'}" stroke="${st}" stroke-width="3"/>`;
  return s;
}
function person(cx, cy, st) {
  return `<circle cx="${cx}" cy="${cy - 70}" r="46" fill="${DIM()}" stroke="${st}" stroke-width="5"/><path d="M${cx - 90},${cy + 90} a90,90 0 0 1 180,0 z" fill="${DIM()}" stroke="${st}" stroke-width="5"/>`;
}

// 1 — aggancio: la password si può rubare
scene('hook', { make: (W) => ({
  capAt: W('rubata'), last: W('violato'),
  render(t) {
    let s = words(t, 0.05, 96, 330, 'Anche una', { f: 'pop', size: 96 });
    s += words(t, W('password') - 0.05, 96, 450, 'password forte', { f: 'pop', size: 96 });
    s += E(t, W('rubata'), IT(100, 545, 'può essere rubata', { size: 54 }));
    // chiave (password) presa all'amo del phishing
    const tc = W('phishing'), down = eo((t - tc + 0.1) / 0.6), up = eo((t - tc - 0.7) / 0.7);
    const ky = 640 - up * 90, hy = lerp(150, ky - 100, down) ;
    s += E(t, W('password') - 0.1, `<g>${keySVG(1020, ky, C.line)}</g>` + lbl(1135, ky + 100, 'PASSWORD'), { dy: 0 });
    if (down > 0) s += hookSVG(1020 + 34, 120, hy - (1 - down) * 0, C.coral) + E(t, tc, lbl(1080, 270, 'PHISHING', { a: 'start' }), { dy: 0 });
    // sito violato: server in sezione con crepa
    const sx = 1480, sy = 380;
    let srv = '';
    for (let i = 0; i < 3; i++) srv += `<rect x="${sx}" y="${sy + i * 100}" width="300" height="84" rx="10" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/><circle cx="${sx + 34}" cy="${sy + 42 + i * 100}" r="8" fill="${C.line}"/>` +
      [0, 1, 2, 3].map(j => `<line x1="${sx + 160 + j * 28}" y1="${sy + 24 + i * 100}" x2="${sx + 160 + j * 28}" y2="${sy + 60 + i * 100}" stroke="${C.line}" stroke-width="3"/>`).join('');
    s += E(t, W('sito') - 0.1, srv + lbl(sx + 150, sy - 30, 'SITO'), { dy: 14 });
    const cr = eo((t - W('violato') + 0.05) / 0.35);
    if (cr > 0) s += `<polyline points="${[[1600, 392], [1640, 450], [1610, 510], [1660, 570], [1630, 640]].map(([x, y]) => `${x},${lerp(392, y, cr)}`).join(' ')}" fill="none" stroke="${C.line}" stroke-width="7" stroke-linejoin="round"/>` +
      E(t, W('violato'), lbl(sx + 150, sy + 360, 'VIOLATO'), { dy: 0 });
    return s + caption(t, W('rubata'), 'Password rubata?', '');
  } }) });

// 2 — definizione (registro chiaro)
scene('def', { make: (W) => ({
  capAt: W('secondo'), last: W('verifica'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(260, 170, 1400, 640), { dy: 0 });
    s += E(t, W('due') - 0.1, T(380, 450, '2FA', { f: 'pop', size: 210, fill: C.ink }));
    s += E(t, W('autenticazione') - 0.1, IT(386, 540, 'Two-Factor Authentication', { size: 54, fill: C.ink }));
    s += E(t, W('fattori') - 0.1, T(388, 610, 'AUTENTICAZIONE A DUE FATTORI', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 }));
    // due livelli di verifica impilati
    const lx = 1060, lw = 480;
    s += E(t, W('aggiunge') - 0.1, `<rect x="${lx}" y="520" width="${lw}" height="120" rx="14" fill="${C.ivory}" stroke="${C.ink}" stroke-width="4"/>` +
      T(lx + 34, 593, '1 · PASSWORD', { f: 'mono', size: 30, fill: C.ink, ls: 3, w: 700 }));
    s += E(t, W('secondo') - 0.05, `<rect x="${lx}" y="360" width="${lw}" height="120" rx="14" fill="${C.coral}" stroke="${C.ink}" stroke-width="4"/>` +
      T(lx + 34, 433, '2 · VERIFICA', { f: 'mono', size: 30, fill: C.ivory, ls: 3, w: 700 }), { dy: 40 });
    return s + caption(t, W('secondo'), 'Un secondo livello', '', true);
  } }) });

// 3 — la porta con due serrature: qualcosa che sai + qualcosa che hai
function doorScene(t, W, mode) {
  let s = E(t, -0.4, doorSVG(C.line), { dy: 0 });
  const lockOpen = mode === 'ladro' ? eo((t - W('password') - 0.2) / 0.5) : 0;
  s += E(t, -0.3, lockSVG(960, 400, C.line, lockOpen), { dy: 0 });
  s += E(t, -0.2, readerSVG(960, 630, mode === 'ladro' ? C.coral : C.line, false), { dy: 0 });
  return s;
}
scene('porta', { make: (W) => ({
  capAt: W('hai'), last: W('telefono'),
  render(t) {
    let s = doorScene(t, W, 'porta');
    // sinistra: chiave = qualcosa che sai
    s += E(t, W('chiave') - 0.1, keySVG(200, 470, C.line, 1.05) + `<line x1="460" y1="470" x2="880" y2="470" stroke="${C.line}" stroke-width="3" stroke-dasharray="3 10"/>`);
    s += E(t, W('qualcosa'), lbl(330, 330, 'QUALCOSA CHE SAI'));
    s += E(t, W('password'), IT(330, 600, 'la password', { a: 'middle', size: 54 }));
    // destra: telefono = qualcosa che hai
    s += E(t, W('badge') - 0.1, phoneSVG(1480, 470, 190, 330, C.line) + `<line x1="1470" y1="635" x2="1040" y2="635" stroke="${C.line}" stroke-width="3" stroke-dasharray="3 10"/>`);
    s += E(t, W('qualcosa', 1), lbl(1575, 420, 'QUALCOSA CHE HAI'));
    s += E(t, W('badge'), lbl(1325, 605, 'COME UN BADGE'), { dy: 0 });
    s += E(t, W('telefono'), IT(1575, 870, 'il tuo telefono', { a: 'middle', size: 54 }));
    return s + caption(t, W('hai'), 'Sai, e hai', '');
  } }) });

// 4 — chi conosce solo la password resta fuori
scene('ladro', { make: (W) => ({
  capAt: W('senza'), last: W('accedere'),
  render(t) {
    let s = doorScene(t, W, 'ladro');
    s += E(t, W('qualcuno') - 0.1, person(330, 470, C.line) + lbl(330, 640, 'QUALCUNO'));
    s += E(t, W('password') - 0.1, keySVG(540, 400, C.line, 0.8) + `<line x1="740" y1="400" x2="880" y2="400" stroke="${C.line}" stroke-width="3" stroke-dasharray="3 10"/>` + lbl(330, 700, 'CONOSCE LA PASSWORD'));
    s += E(t, W('password') + 0.4, lbl(1240, 430, 'APERTA', { a: 'start' }), { dy: 0 });
    s += E(t, W('non'), lbl(1240, 640, 'CHIUSA', { a: 'start' }), { dy: 0 });
    s += E(t, W('accedere'), pillTag(1500, 790, 'NESSUN ACCESSO', C.line, C.bg, 'middle'));
    return s + caption(t, W('senza'), 'Manca il secondo fattore', '');
  } }) });

// 5–7 — in pratica: tre passi
const BX = 600, BY = 200, BW = 800, BH = 600;
scene('passo1', { make: (W) => ({
  capAt: W('email'), last: W('password'),
  render(t) {
    let s = stepBadge(t, 1, 'come di solito');
    s += E(t, -0.3, browserSVG(BX, BY, BW, BH, C.line, 'servizio.esempio'), { dy: 0 });
    const em = 'nome@esempio.it', ne = Math.floor(clamp((t - W('email')) / 0.9) * em.length), np = Math.floor(clamp((t - W('password')) / 0.8) * 10);
    s += E(t, -0.2, T(BX + 90, BY + 160, 'EMAIL', { f: 'mono', size: 26, ls: 3, w: 700 }) + `<rect x="${BX + 90}" y="${BY + 180}" width="620" height="76" rx="12" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/>` +
      T(BX + 90, BY + 320, 'PASSWORD', { f: 'mono', size: 26, ls: 3, w: 700 }) + `<rect x="${BX + 90}" y="${BY + 340}" width="620" height="76" rx="12" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/>` +
      `<rect x="${BX + 270}" y="${BY + 468}" width="260" height="72" rx="36" fill="none" stroke="${C.line}" stroke-width="4"/>` + T(BX + 400, BY + 514, 'ACCEDI', { f: 'mono', size: 28, a: 'middle', ls: 3, w: 700 }), { dy: 0 });
    if (ne > 0) s += T(BX + 116, BY + 230, em.slice(0, ne), { f: 'mono', size: 32, w: 500 });
    for (let i = 0; i < np; i++) s += `<circle cx="${BX + 130 + i * 34}" cy="${BY + 378}" r="10" fill="${C.line}"/>`;
    return s + caption(t, W('email'), 'Email e password', '');
  } }) });

function codePanel(t, t0, code, st) {
  const bw = 84, x0 = BX + (BW - boxesW()) / 2;
  return E(t, t0, T(BX + BW / 2, BY + 170, 'Codice di verifica', { f: 'popm', size: 44, a: 'middle', w: 500 }) + boxes(x0, BY + 270, code, 6, st), { dy: 0 });
}
function phoneCode(t, t0, code, x = 1500, y = 260, head = 'CODICE') {
  const w = 230, h = 460;
  let s = phoneSVG(x, y, w, h, C.line);
  s += E(t, t0, `<rect x="${x + 30}" y="${y + 120}" width="${w - 60}" height="150" rx="16" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` +
    T(x + w / 2, y + 170, head, { f: 'mono', size: 24, a: 'middle', ls: 3, w: 700 }) + T(x + w / 2, y + 236, code, { f: 'mono', size: 38, a: 'middle', w: 700 }), { dy: 10 });
  return s;
}
function twoPhones(t, tSms, tApp) { // due vie distinte: SMS (nuvoletta) e app di autenticazione (schermata con timer)
  let s = '';
  s += E(t, tSms, phoneSVG(1390, 300, 170, 360, C.line) +
    `<path d="M1418,400 h114 a12,12 0 0 1 12,12 v70 a12,12 0 0 1 -12,12 h-80 l-22,20 v-20 h-12 a12,12 0 0 1 -12,-12 v-70 a12,12 0 0 1 12,-12 z" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` +
    T(1476, 458, '482 913', { f: 'mono', size: 28, a: 'middle', w: 700 }) + lbl(1475, 270, 'VIA SMS'), { dy: 10 });
  s += E(t, tApp, phoneSVG(1610, 300, 170, 360, C.line) +
    `<rect x="1632" y="370" width="126" height="44" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + T(1695, 401, 'APP', { f: 'mono', size: 24, a: 'middle', ls: 3, w: 700 }) +
    T(1695, 470, '715 064', { f: 'mono', size: 28, a: 'middle', w: 700 }) +
    `<circle cx="1695" cy="540" r="28" fill="none" stroke="${C.line}" stroke-width="5" opacity="0.4"/><path d="M1695,512 A28,28 0 1 1 1667,540" fill="none" stroke="${C.line}" stroke-width="5"/>` +
    lbl(1695, 270, "O DA UN'APP"), { dy: 10 });
  return s;
}
scene('passo2', { make: (W) => ({
  capAt: W('sei'), last: W("un'app"),
  render(t) {
    let s = stepBadge(t, 2, 'la seconda verifica');
    s += E(t, -0.3, browserSVG(BX, BY, BW - 60, BH, C.line, 'servizio.esempio'), { dy: 0 });
    s += E(t, W('chiede') - 0.1, T(BX + (BW - 60) / 2, BY + 170, 'Codice di verifica', { f: 'popm', size: 44, a: 'middle', w: 500 }), { dy: 10 });
    const bo = { bw: 80, gap: 14, mid: 20 }, x0 = BX + (BW - 60 - boxesW(bo)) / 2;
    s += E(t, W('codice') - 0.1, boxes(x0, BY + 290, '', 6, C.line, bo), { dy: 10 });
    s += E(t, W('sei'), `<path d="M${x0},${BY + 262} v-14 H${x0 + boxesW(bo)} v14" fill="none" stroke="${C.line}" stroke-width="3"/>` + lbl(BX + (BW - 60) / 2, BY + 236, '6 CIFRE'), { dy: 0 });
    s += twoPhones(t, W('viasms') - 0.1, W('o') - 0.05);
    s += E(t, W('viasms') + 0.2, pillTag(1585, 740, 'ESEMPI', C.line, C.bg, 'middle'));
    return s + caption(t, W('sei'), 'Codice a 6 cifre', '');
  } }) });

scene('passo3', { make: (W) => ({
  capAt: W('codice'), last: W('accedi'),
  render(t) {
    let s = stepBadge(t, 3, 'il codice, e dentro');
    s += E(t, -0.3, browserSVG(BX, BY, BW - 60, BH, C.line, 'servizio.esempio'), { dy: 0 });
    const ok = t > W('accedi') - 0.05;
    const bo = { bw: 80, gap: 14, mid: 20 }, x0 = BX + (BW - 60 - boxesW(bo)) / 2;
    const n = Math.floor(clamp((t - W('inserisci')) / 1.2) * 6), code = '482913'.slice(0, n);
    s += E(t, -0.3, T(BX + (BW - 60) / 2, BY + 170, 'Codice di verifica', { f: 'popm', size: 44, a: 'middle', w: 500 }) + boxes(x0, BY + 290, code, 6, C.line, bo), { dy: 0 });
    const p = eo((t - W('accedi') + 0.05) / 0.4);
    if (p > 0) s += `<g opacity="${p}"><rect x="${BX + 230}" y="${BY + 450}" width="280" height="80" rx="40" fill="${C.line}"/>` +
      `<path d="M${BX + 266},${BY + 490} l18,18 l32,-34" fill="none" stroke="${C.bg}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
      T(BX + 400, BY + 502, 'ACCESSO', { f: 'mono', size: 28, a: 'middle', fill: C.bg, ls: 3, w: 700 }) + '</g>';
    s += twoPhones(t, -1, -1) + pillTag(1585, 740, 'ESEMPI', C.line, C.bg, 'middle');
    return s + caption(t, W('codice'), 'Codice, poi accesso', '');
  } }) });

// 8 — app di autenticazione: il codice cambia (registro chiaro)
scene('totp', { make: (W) => ({
  capAt: W('trenta'), last: W('trenta'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(560, 150, 800, 700), { dy: 0 });
    const cx = 960, cy = 470, r = 200, tc = W('cambia'), P = 2.6;
    const k = t < tc ? 0 : Math.floor((t - tc) / P) + 1, ph = t < tc ? 0 : ((t - tc) % P) / P;
    const codes = ['715 064', '238 597', '960 431', '154 802'];
    s += E(t, -0.3, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${mix(C.ivory, C.ink, 0.25)}" stroke-width="14"/>`, { dy: 0 });
    // arco che si consuma (tempo accelerato)
    const a = 2 * Math.PI * (1 - ph), large = a > Math.PI ? 1 : 0, ex = cx + r * Math.sin(a), ey = cy - r * Math.cos(a);
    if (t > -0.3) s += a > 6.27 ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.coral}" stroke-width="14"/>` :
      `<path d="M${cx},${cy - r} A${r},${r} 0 ${large} 1 ${ex.toFixed(1)},${ey.toFixed(1)}" fill="none" stroke="${C.coral}" stroke-width="14" stroke-linecap="round"/>`;
    const fresh = t < tc ? 1 : eo(((t - tc) % P) / 0.3);
    s += `<g opacity="${(t < 0 ? eo((t + 0.4) / 0.4) : fresh).toFixed(3)}">` + T(cx, cy + 22, codes[k % 4], { f: 'mono', size: 76, fill: C.ink, a: 'middle', w: 700 }) + '</g>';
    s += E(t, -0.4, T(cx, 232, 'APP DI AUTENTICAZIONE', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3, w: 700 }), { dy: 0 });
    s += E(t, 0, pillTag(cx, cy + 110, 'ESEMPIO', C.ink, C.ivory, 'middle'), { dy: 0 });
    s += E(t, W('trenta'), T(cx, 760, 'ogni 30 secondi', { f: 'serif', it: true, size: 54, fill: C.ink, a: 'middle' }));
    s += E(t, tc, T(cx, 812, 'TEMPO ACCELERATO NELL’ANIMAZIONE', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 2, w: 600 }), { dy: 0 });
    return s + caption(t, W('trenta'), 'Ogni 30 secondi', '', true);
  } }) });

// 9 — attenzione: il sito di phishing può intercettare il codice
scene('phishing', { make: (W) => ({
  capAt: W('controlla'), last: W('controlla'),
  render(t) {
    const ti = W('intercettare'), p = clamp((t - ti) / 0.6);
    let s = phoneCode(t, -1, '715 064', 76, 280, 'APP') + pillTag(191, 800, 'ESEMPIO', C.line, C.bg, 'middle');
    s += E(t, W('sito') - 0.1, browserSVG(620, 300, 640, 480, C.line, 'accedi-qui.esempio') + lbl(940, 270, 'SITO DI PHISHING'), { dy: 0 });
    // amo appeso nella pagina
    s += E(t, W('phishing'), hookSVG(1180, 374, 470, C.coral), { dy: 0 });
    const bo = { bw: 56, gap: 10, mid: 14, bh: 72, size: 36 }, x0 = 650;
    const n = Math.floor(clamp((t - ti - 0.5) / 0.6) * 6);
    s += E(t, W('sito'), boxes(x0, 600, '715064'.slice(0, n), 6, C.line, bo), { dy: 0 });
    // l'utente digita il codice nel sito falso
    if (t > ti - 0.1) s += E(t, ti - 0.1, arrowL(326, 510, 600, 510, C.line) + lbl(463, 470, 'LO INSERISCI TU'), { dy: 0 });
    if (p > 0 && p < 1) s += `<rect x="${lerp(400, 540, eio(p)) - 60}" y="530" width="120" height="50" rx="10" fill="${C.line}"/>` + T(lerp(400, 540, eio(p)), 564, '715 064', { f: 'mono', size: 24, fill: C.bg, a: 'middle', w: 700 });
    // il truffatore lo usa subito sul servizio vero
    s += E(t, W('usarlo') - 0.1, arrowL(1280, 540, 1375, 540, C.line) + browserSVG(1395, 400, 430, 300, C.line, 'servizio.esempio', { nodots: true }) + lbl(1610, 760, 'IL TRUFFATORE') + lbl(1610, 800, 'LO USA SUBITO'), { dy: 0 });
    const ok = eo((t - W('subito')) / 0.4);
    if (ok > 0) s += `<g opacity="${ok}"><rect x="${1470}" y="${545}" width="280" height="76" rx="38" fill="${C.line}"/>` +
      `<path d="M1504,583 l16,16 l30,-32" fill="none" stroke="${C.bg}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
      T(1640, 594, 'ACCESSO', { f: 'mono', size: 26, a: 'middle', fill: C.bg, ls: 3, w: 700 }) + '</g>';
    // controlla l'indirizzo: confronto sotto la finestra, testo sempre leggibile
    s += E(t, W('controlla'), `<circle cx="660" cy="838" r="22" fill="none" stroke="${C.line}" stroke-width="5"/><line x1="676" y1="854" x2="696" y2="874" stroke="${C.line}" stroke-width="8" stroke-linecap="round"/>` +
      T(720, 852, 'accedi-qui.esempio  \u2260  servizio.esempio', { f: 'mono', size: 30, w: 500 }), { dy: 0 });
    return s + caption(t, W('controlla'), 'Controlla il sito', '');
  } }) });
function arrowL(x1, y1, x2, y2, c) { return arrow(x1, y1, x2, y2, c, 5); }

// 10 — quale metodo (registro chiaro)
scene('metodi', { make: (W) => ({
  capAt: W('generalmente'), last: W('casi'),
  render(t) {
    let s = lightBg();
    const ink = C.ink;
    s += E(t, -0.4, card(180, 170, 720, 640), { dy: 0 });
    s += E(t, -0.25, T(260, 300, 'App di', { f: 'pop', size: 64, fill: ink }) + T(260, 380, 'autenticazione', { f: 'pop', size: 64, fill: ink }), { dy: 12 });
    s += E(t, -0.1, `<rect x="270" y="440" width="140" height="240" rx="22" fill="${C.ivory}" stroke="${ink}" stroke-width="4"/>` + T(340, 572, '••• •••', { f: 'mono', size: 26, fill: ink, a: 'middle', w: 700 }) +
      IT(450, 540, 'codici generati', { size: 44, fill: ink }) + IT(450, 594, 'sul dispositivo', { size: 44, fill: ink }), { dy: 12 });
    s += E(t, W('generalmente') - 0.05, `<rect x="270" y="712" width="560" height="62" rx="31" fill="${C.coral}"/>` + T(550, 754, 'GENERALMENTE PREFERIBILI', { f: 'mono', size: 26, fill: C.ivory, a: 'middle', ls: 2, w: 700 }));
    s += E(t, W('sms') - 0.15, card(1020, 170, 720, 640), { dy: 0 });
    s += E(t, W('sms') - 0.05, T(1100, 340, 'SMS', { f: 'pop', size: 96, fill: ink }) +
      `<path d="M1110,440 h300 a20,20 0 0 1 20,20 v110 a20,20 0 0 1 -20,20 h-230 l-40,36 v-36 h-30 a20,20 0 0 1 -20,-20 v-110 a20,20 0 0 1 20,-20 z" fill="${C.ivory}" stroke="${ink}" stroke-width="4" transform="translate(-10,0)"/>` +
      T(1250, 532, '••• •••', { f: 'mono', size: 26, fill: ink, a: 'middle', w: 700 }));
    s += E(t, W('casi') - 0.1, pillTag(1100, 726, 'IN ALCUNI CASI', ink, C.ivory) + IT(1470, 540, 'possono essere', { size: 44, fill: ink }) + IT(1470, 594, 'intercettati', { size: 44, fill: ink }));
    return s + caption(t, W('generalmente'), 'App, meglio degli SMS', '', true);
  } }) });

// 11 — codici di backup
scene('backup', { make: (W) => ({
  capAt: W('backup'), last: W('casa') + 0.5,
  render(t) {
    let s = '';
    const lost = eo((t - W('perdi')) / 0.4);
    s += E(t, -0.4, phoneSVG(250, 330, 220, 420, C.line), { dy: 0 });
    if (lost > 0) s += `<g opacity="${lost}"><line x1="220" y1="400" x2="500" y2="680" stroke="${C.line}" stroke-width="10" stroke-linecap="round"/><line x1="500" y1="400" x2="220" y2="680" stroke="${C.line}" stroke-width="10" stroke-linecap="round"/></g>` +
      E(t, W('perdi'), lbl(360, 810, 'TELEFONO PERSO'), { dy: 0 });
    // foglio stampato dei codici
    const px = 960, py = 340, pw = 380, ph = 440;
    s += E(t, W('codici') - 0.1, `<path d="M${px},${py} h${pw - 50} l50,50 v${ph - 50} h${-pw} z" fill="${DIM()}" stroke="${C.coral}" stroke-width="5" stroke-linejoin="round"/>` +
      T(px + 34, py + 66, 'CODICI DI BACKUP', { f: 'mono', size: 24, ls: 2, w: 700 }) +
      ['4821 7730', '1596 0284', '7302 6618', '0947 3352', '5260 8841'].map((c, i) => T(px + 60, py + 140 + i * 62, `${i + 1}.  ${c}`, { f: 'mono', size: 34, w: 500 })).join(''), { dy: 16 });
    s += E(t, W('codici') - 0.1, pillTag(px + pw / 2, py + ph + 70, 'ESEMPIO', C.line, C.bg, 'middle'), { dy: 0 });
    const m = eo((t - W('monouso')) / 0.4);
    if (m > 0) s += `<line x1="${px + 50}" y1="${py + 128}" x2="${px + 50 + 290 * m}" y2="${py + 128}" stroke="${C.line}" stroke-width="5"/>` +
      E(t, W('monouso'), lbl(px + pw + 80, py + 140, 'MONOUSO', { a: 'start' }) + IT(px + pw + 80, py + 196, 'una volta sola', { size: 42 }), { dy: 0 });
    // stampato e conservato a casa
    s += E(t, W('stampali') - 0.05, lbl(px + pw + 80, py + 330, 'STAMPATI', { a: 'start' }), { dy: 0 });
    const hp = eo((t - W('stampali') + 0.05) / 0.6);
    if (hp > 0) s += `<polyline points="920,850 920,300 1150,170 1380,300 1380,850" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round" stroke-dasharray="1800" stroke-dashoffset="${(1800 * (1 - hp)).toFixed(0)}"/>` +
      E(t, W('stampali') + 0.3, lbl(1150, 260, 'A CASA'), { dy: 0 });
    return s + caption(t, W('backup'), 'I codici di backup', '');
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'La seconda serratura', { f: 'pop', size: 120, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('qualcosa') - 0.1, 960, 560, 'Qualcosa che sai, più qualcosa che hai.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'hai' });
    s += E(t, W('hai') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC DIG-2-04', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
