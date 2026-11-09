// Il DNS: il sistema dei nomi di internet — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.35);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.minD) D = Math.max(D, def.minD);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

const NAME = 'esempio.it', IP = '142.250.184.46', IPX = '192.0.2.10', FAKE = '203.0.113.66';
// testo nella barra degli indirizzi (x,y = inizio testo)
const barText = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 34, fill: o.fill || C.line, w: 600 });
// pillola che scorre fra due x a y fissa
function slide(t, t0, t1, xa, xb, y, s, o = {}) {
  if (t < t0) return '';
  const x = lerp(xa, xb, eio((t - t0) / (t1 - t0)));
  return pillTag(x, y, s, o.ink || C.line, C.bg, { a: 'middle', size: o.size || 34, stroke: o.ink || C.line, sw: o.sw || 3, w: 600 });
}

// 1 — aggancio: numero o nome?
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('chi'),
  render(t) {
    const BX = 170, BY = 300, BW = 900, BH = 460;
    let s = E(t, -0.4, rack(1500, 440, 0.85) + lbl(1500, 545, 'SERVER DEL SITO'), { dy: 0 });
    s += E(t, W('indirizzo') - 0.1, lbl(1500, 615, 'INDIRIZZO IP · ESEMPIO'));
    s += E(t, W('numero') - 0.1, pillTag(1500, 700, IP, C.line, C.bg, { a: 'middle', size: 40, w: 600 }));
    // il browser: niente numero, un nome
    let addr = '';
    const tName = W('digiti');
    if (t >= tName) {
      const n = Math.min(NAME.length, Math.floor((t - tName) / 0.06) + 1);
      addr = barText(BX + 172, BY + 60, NAME.slice(0, n));
      if (n < NAME.length || Math.floor(t * 2) % 2 === 0) addr += `<line x1="${BX + 176 + tw(NAME.slice(0, n), 'mono', 34)}" y1="${BY + 32}" x2="${BX + 176 + tw(NAME.slice(0, n), 'mono', 34)}" y2="${BY + 68}" stroke="${C.line}" stroke-width="3"/>`;
    }
    s += E(t, W('tu') - 0.1, browser(BX, BY, BW, BH, addr) + pageLines(BX + 60, BY + 150, BW - 120, C.lineDim, 0.8), { dy: 0 });
    s += E(t, tName + 0.3, lbl(BX + BW / 2, BY + BH + 50, 'UN NOME · ESEMPIO'));
    // chi traduce?
    if (t > W('chi') - 0.1) {
      const p = clamp((t - W('chi') + 0.1) / 0.5);
      s += `<g opacity="${p.toFixed(3)}"><path d="M${BX + BW + 20},${BY + 48} Q1280,${BY + 48} 1292,686" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="6 12" stroke-linecap="round"/></g>`;
      s += pop(t, W('chi'), 1200, 400, T(1200, 430, '?', { f: 'pop', size: 96, a: 'middle' }));
    }
    return s + caption(t, W('chi'), 'Chi traduce?', 'traduce');
  } }) });

// 2 — il DNS traduce i nomi in indirizzi
scene('dns', { make: (W) => ({
  capAt: W('nomi'),
  render(t) {
    let s = E(t, W('dns') - 0.1, T(960, 290, 'DNS', { f: 'pop', size: 130, a: 'middle' }));
    s += E(t, W('domain') - 0.1, T(960, 370, 'Domain Name System', { f: 'serif', size: 60, a: 'middle', it: true }));
    const y = 620;
    s += E(t, W('converte') - 0.1, `<rect x="760" y="${y - 95}" width="400" height="150" rx="20" fill="${C.fillD}" stroke="${C.coral}" stroke-width="5"/>` + rack(860, y - 20, 0.62) +
      T(1010, y - 2, 'DNS', { f: 'pop', size: 56, a: 'middle' }));
    s += E(t, W('nomi') - 0.1, pillTag(420, y, NAME, C.line, C.bg, { a: 'middle', size: 40, w: 600 }));
    s += E(t, W('nomi') + 0.2, arrow(580, y - 18, 748, y - 18, C.line, 5, 20), { dy: 0 });
    s += E(t, W('leggibili') - 0.1, lbl(420, y + 90, 'PER GLI UMANI'));
    s += E(t, W('indirizzi') - 0.1, arrow(1172, y - 18, 1300, y - 18, C.line, 5, 20), { dy: 0 });
    s += E(t, W('indirizzi'), pillTag(1500, y, IPX, C.line, C.bg, { a: 'middle', size: 40, w: 600 }));
    s += E(t, W('computer') - 0.1, lbl(1500, y + 90, 'PER I COMPUTER'));
    s += E(t, W('nomi') + 0.4, T(1824, 200, 'VALORI DI ESEMPIO', { f: 'mono', size: 24, ls: 3, a: 'end', w: 600 }));
    return s + caption(t, W('nomi'), 'Dal nome al numero', '');
  } }) });

// 3 — un elenco telefonico distribuito
scene('elenco', { make: (W) => ({
  capAt: W('elenco'), minD: 4.8,
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(240, 150, 1440, 680, { rot: -0.6 }), { dy: 0 });
    g += E(t, -0.3, T(330, 240, 'ELENCO: NOME → INDIRIZZO IP', { f: 'mono', size: 30, fill: C.ink, ls: 3, w: 700 }) + T(1590, 240, 'VALORI DI ESEMPIO', { f: 'mono', size: 24, fill: C.ink, ls: 3, a: 'end', w: 600 }));
    const R = [['esempio.it', IPX], ['esempio.com', '198.51.100.7'], ['esempio.org', '203.0.113.25']];
    const sp = eio((t - W('distribuito') + 0.05) / 0.8);
    g += E(t, -0.2, T(360, 330, 'NOME', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 700 }) + T(800, 330, 'INDIRIZZO IP', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 700 }), { dy: 0 });
    R.forEach(([n, ip], i) => {
      const y = 360 + i * (100 + 40 * sp);
      g += E(t, W('elenco') - 0.2 + i * 0.12, `<rect x="330" y="${y}" width="880" height="${84}" rx="${10 * sp}" fill="${C.ivory}" stroke="${C.ink}" stroke-width="3"/>` +
        `<line x1="770" y1="${y}" x2="770" y2="${y + 84}" stroke="${C.ink}" stroke-width="3"/>` +
        T(360, y + 55, n, { f: 'mono', size: 36, fill: C.ink, w: 600 }) + T(800, y + 55, ip, { f: 'mono', size: 36, fill: C.ink, w: 600 }));
      if (sp > 0) g += `<g opacity="${sp.toFixed(3)}"><line x1="1214" y1="${y + 42}" x2="${1214 + 150 * sp}" y2="${y + 42}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="7 7"/>` +
        rack(1450, y + 42, 0.6, { ink: C.ink, fill: C.ivory }) + '</g>';
    });
    g += E(t, W('distribuito') + 0.5, T(1610, 330, 'OGNI DOMINIO HA IL SUO SERVER', { f: 'mono', size: 26, fill: C.ink, ls: 3, a: 'end', w: 700 }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('elenco'), 'Un elenco distribuito', 'distribuito', true);
  } }) });

// layout comune browser ↔ resolver (con cache)
const LX = 300, SX = 1500, YQ = 450, YR = 580;
function resolverBase(t, o = {}) {
  let s = E(t, -0.4, laptop(LX, 560, 1.25) + lbl(LX, 380, 'BROWSER') + rack(SX, 470, 0.9) + lbl(SX, 330, 'RESOLVER DNS'), { dy: 0 });
  s += E(t, -0.4, `<line x1="470" y1="${YQ}" x2="1410" y2="${YQ}" stroke="${C.lineDim}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>` +
    `<line x1="470" y1="${YR}" x2="1410" y2="${YR}" stroke="${C.lineDim}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>`, { dy: 0 });
  return s;
}
// riquadro cache sotto il resolver
function cacheBox(head, ipText, o = {}) {
  const x = 1270, y = 640, w = 460, h = 140;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${C.fillD}" stroke="${o.stroke || C.line}" stroke-width="${o.sw || 3}"/>` +
    T(x + 24, y + 42, head, { f: 'mono', size: 24, ls: 3, w: 700 }) + `<line x1="${x}" y1="${y + 60}" x2="${x + w}" y2="${y + 60}" stroke="${C.line}" stroke-width="2.5"/>`;
  if (ipText) s += T(x + 24, y + 108, NAME + ' → ', { f: 'mono', size: 28, w: 600 }) + T(x + 24 + tw(NAME + ' → ', 'mono', 28), y + 108, ipText, { f: 'mono', size: 28, w: 600 });
  return s;
}
// 4 — il resolver e la cache
scene('richiesta', { tail: 0.6, make: (W) => ({
  capAt: W('cache'),
  render(t) {
    let s = resolverBase(t);
    s += E(t, W('provider') - 0.1, lbl(SX, 370, 'DEL PROVIDER', { size: 24 }));
    s += E(t, W('chiede') + 0.4, T(1824, 200, 'VALORI DI ESEMPIO', { f: 'mono', size: 24, ls: 3, a: 'end', w: 600 }));
    s += slide(t, W('chiede'), W('dns') + 0.3, 640, 1230, YQ + 12, NAME + ' ?', { size: 30 });
    s += E(t, W('cache') - 0.3, cacheBox('CACHE', t > W('nella') ? IPX : null, { stroke: C.coral, sw: 5 }));
    s += slide(t, W('cache') - 0.1, W('cache') + 0.5, 1250, 640, YR + 12, IPX, { size: 30 });
    return s + caption(t, W('cache'), 'Prima, la cache', '');
  } }) });

// albero gerarchico
const RT = [1060, 290], TL3 = [[620, 540], [1060, 540], [1500, 540]], AU = [[620, 780], [1060, 780], [1500, 780]];
const TLDN = ['.it', '.com', '.org'], AUN = ['esempio.it', 'esempio.com', 'esempio.org'];
function node(x, y, o = {}) { return rack(x, y, 0.62, { n: 2, ...o }); }
function levels(t, names) {
  let s = '';
  [RT[1], TL3[0][1], AU[0][1]].forEach((y, i) => {
    if (!names[i]) return;
    s += E(t, names[i][1], `<line x1="96" y1="${y + 62}" x2="1824" y2="${y + 62}" stroke="${C.lineDim}" stroke-width="2" stroke-dasharray="3 12" stroke-linecap="round"/>` +
      T(96, y + 10, names[i][0], { f: 'mono', size: 26, ls: 3, w: 700, fill: names[i][2] || C.line }), { dy: 0 });
  });
  return s;
}
const lineTo = (a, b, p, ink = C.line) => drawLine(a[0], a[1] + 50, b[0], b[1] - 50, p, ink, 3.5);
function ghostTree() {
  return [RT, ...TL3, ...AU].map(p => node(p[0], p[1], { ink: C.lineDim, dash: '6 8', fill: 'none' })).join('') +
    TL3.map((p, i) => lineTo(RT, p, 1, C.lineDim) + lineTo(p, AU[i], 1, C.lineDim)).join('');
}

// 5 — gerarchia: in cima i root server (13 sistemi, lettere A–M)
scene('root', { tail: 0.6, make: (W) => ({
  capAt: W('cima'),
  render(t) {
    let s = '';
    const gh = clamp(1 - (t - W('root') + 0.1) / 0.3);
    if (gh > 0) s += E(t, -0.4, `<g opacity="${(0.9 * gh).toFixed(3)}">${ghostTree()}</g>`, { dy: 0 });
    s += E(t, W('gerarchia') - 0.1, T(1824, 200, 'UNA GERARCHIA', { f: 'mono', size: 26, ls: 3, a: 'end', w: 600 }));
    s += levels(t, [['ROOT', W('root') - 0.1]]);
    s += pop(t, W('root') - 0.1, RT[0], RT[1], node(RT[0], RT[1]));
    'ABCDEFGHIJKLM'.split('').forEach((c, i) => {
      const r = i < 7 ? 0 : 1, x = 1160 + (i - r * 7) * 54, y = 236 + r * 56;
      s += E(t, W('13') - 0.15 + i * 0.03, `<rect x="${x}" y="${y}" width="44" height="44" rx="7" fill="${C.fillD}" stroke="${C.line}" stroke-width="2.5"/>` + T(x + 22, y + 31, c, { f: 'mono', size: 24, a: 'middle', w: 700 }), { dy: 8, d: 0.35 });
    });
    s += E(t, W('13') - 0.1, T(1560, 330, '13', { f: 'pop', size: 120, fill: C.coral }));
    s += E(t, W('sistemi'), T(1160, 425, 'sistemi, gestiti da varie organizzazioni', { f: 'serif', size: 40, it: true }));
    s += E(t, W('gestiti') + 0.3, T(1160, 472, 'OGNUNO CON MOLTE COPIE NEL MONDO', { f: 'mono', size: 24, ls: 2, w: 600 }));
    return s + caption(t, W('cima'), 'In cima, i root', '');
  } }) });

// 6 — i server dei domini di primo livello
scene('tld', { tail: 1.7, make: (W) => ({
  capAt: W('domini'),
  render(t) {
    let s = levels(t, [['ROOT', -1], ['PRIMO LIVELLO', W('primo') - 0.1, C.coral]]);
    s += E(t, -0.4, node(RT[0], RT[1]), { dy: 0 });
    TL3.forEach((p, i) => {
      s += lineTo(RT, p, (t - W('server') - i * 0.12) / 0.4);
      s += pop(t, W('server') + 0.2 + i * 0.12, p[0], p[1], node(p[0], p[1]));
    });
    const tk = [W('it'), W('com'), W('org')];
    TL3.forEach((p, i) => s += E(t, tk[i] - 0.1, T(p[0] + 70, p[1] + 18, TLDN[i], { f: 'pop', size: 52 })));
    return s + caption(t, W('domini'), 'Domini di primo livello', '');
  } }) });

// 7 — i server autoritativi
scene('autoritativi', { tail: 0.7, make: (W) => ({
  capAt: W('possiede'),
  render(t) {
    let s = levels(t, [['ROOT', -1], ['PRIMO LIVELLO', -1], ['AUTORITATIVI', W('autoritativi') - 0.1]]);
    s += E(t, -0.4, node(RT[0], RT[1]) + TL3.map((p, i) => lineTo(RT, p, 1) + node(p[0], p[1]) + T(p[0] + 70, p[1] + 18, TLDN[i], { f: 'pop', size: 52 })).join(''), { dy: 0 });
    AU.forEach((p, i) => {
      s += lineTo(TL3[i], p, (t - W('autoritativi') - i * 0.12) / 0.4);
      s += pop(t, W('autoritativi') + 0.2 + i * 0.12, p[0], p[1], node(p[0], p[1], i === 0 ? { stroke: C.coral, sw: 5 } : {}));
      s += E(t, W('autoritativi') + 0.5 + i * 0.12, T(p[0] + 70, p[1] + 12, AUN[i], { f: 'mono', size: 30, w: 600 }));
    });
    s += E(t, W('autoritativi') + 0.8, T(1824, 200, 'NOMI DI ESEMPIO', { f: 'mono', size: 24, ls: 3, a: 'end', w: 600 }));
    s += E(t, W('possiede') - 0.1, person(500, 790, C.line));
    return s + caption(t, W('possiede'), 'Chi possiede il dominio', '');
  } }) });

// 8 — il percorso passo per passo
const PB = [200, 640], PR = [600, 560], PS = [[1300, 260], [1300, 500], [1300, 740]];
function along2(t, t0, t1, a, b, txt, o = {}) {
  if (t < t0 || (o.until != null && t > o.until)) return '';
  const [x, y] = along([a, b], eio((t - t0) / (t1 - t0)));
  const ink = o.ink || C.line;
  return pillTag(x, y + 10, txt, ink, C.bg, { a: 'middle', size: 26, stroke: ink, sw: o.sw || 3, w: 600 });
}
scene('percorso', { tail: 1.5, make: (W) => ({
  capAt: W('rimanda'),
  render(t) {
    const RA = [PR[0] + 90, PR[1] - 20];
    let s = E(t, -0.4, laptop(PB[0], PB[1], 0.9) + lbl(PB[0], PB[1] + 60, 'BROWSER', { size: 24 }) + rack(PR[0], PR[1], 0.8) + lbl(PR[0], PR[1] - 100, 'RESOLVER', { size: 26 }) +
      lbl(PR[0], PR[1] + 110, 'CACHE: NON C\'È', { size: 24 }) +
      PS.map(p => `<line x1="${RA[0]}" y1="${RA[1]}" x2="${p[0] - 70}" y2="${p[1]}" stroke="${C.lineDim}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>`).join('') +
      `<line x1="${PB[0] + 90}" y1="${PB[1] - 40}" x2="${PR[0] - 70}" y2="${PB[1] - 40}" stroke="${C.lineDim}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>` +
      `<line x1="1300" y1="310" x2="1300" y2="450" stroke="${C.lineDim}" stroke-width="3"/><line x1="1300" y1="550" x2="1300" y2="690" stroke="${C.lineDim}" stroke-width="3"/>` +
      PS.map(p => node(p[0], p[1])).join('') +
      T(1380, 272, 'ROOT', { f: 'mono', size: 28, ls: 3, w: 700 }) + T(1380, 518, '.it', { f: 'pop', size: 52 }) + T(1380, 752, NAME, { f: 'mono', size: 30, w: 600 }), { dy: 0 });
    s += E(t, -0.2, T(1824, 200, 'VALORI DI ESEMPIO', { f: 'mono', size: 24, ls: 3, a: 'end', w: 600 }));
    const QS = [PR[0] + 210, PR[1] - 30], RE = [PR[0] + 230, PR[1] + 40];
    const Q = (i, a, b) => along2(t, a, b, QS, [PS[i][0] - 230, PS[i][1]], NAME + ' ?', { until: b + 0.35 });
    const R = (i, a, b, txt, o = {}) => along2(t, a, b, [PS[i][0] - 230, PS[i][1] + 46], RE, txt, { until: b + 0.35, ...o });
    s += Q(0, W('chiede'), W('root') + 0.35);
    s += R(0, W('rimanda'), W('it') - 0.05, 'vai a .it');
    s += Q(1, W('it', 1) - 0.2, W('rimanda', 1) - 0.05);
    s += R(1, W('rimanda', 1), W('esempio') + 0.25, 'vai a ' + NAME);
    s += Q(2, W('esempio') + 0.3, W('che', 1) + 0.25);
    // note persistenti accanto ai server
    s += E(t, W('rimanda'), T(1380, 312, 'rimanda a .it', { f: 'serif', size: 38, it: true }));
    s += E(t, W('rimanda', 1), T(1380, 562, 'rimanda a ' + NAME, { f: 'serif', size: 38, it: true }));
    s += E(t, W('conosce'), T(1380, 796, "conosce l'indirizzo", { f: 'serif', size: 38, it: true }));
    // risposta: dall'autoritativo al resolver, poi al browser
    const tA = W('conosce'), tB = W("l'indirizzo") + 0.6, tC = W('torna') - 0.1, tD = W('browser') + 0.4;
    if (t >= tA && t < tC) s += along2(t, tA, tB, [PS[2][0] - 230, PS[2][1] + 46], RE, IPX, { ink: C.coral, sw: 4 });
    if (t >= tC) { const [x, y] = along([[PR[0] - 40, PB[1] - 50], [PB[0] + 30, PB[1] - 120]], eio((t - tC) / (tD - tC))); s += pillTag(x, y, IPX, C.coral, C.bg, { a: 'middle', size: 26, stroke: C.coral, sw: 4, w: 600 }); }
    return s + caption(t, W('rimanda'), 'Passo per passo', '');
  } }) });

// 9 — DNS spoofing: la cache del resolver avvelenata
scene('spoofing', { tail: 1.7, make: (W) => ({
  capAt: W('sostituita'),
  render(t) {
    let s = resolverBase(t);
    s += E(t, W('attacco') - 0.1, warn(700, 216, 34, C.line) + T(760, 240, 'DNS spoofing', { f: 'serif', size: 66, it: true }));
    s += E(t, -0.4, pillTag(1230, YQ + 12, NAME + ' ?', C.line, C.bg, { a: 'middle', size: 30, w: 600 }), { dy: 0 });
    const tS = W('sostituita'), tIn = tS + 0.7, tOut = W('falso') + 0.1, tEnd = tOut + 0.9;
    const poisoned = t >= tIn;
    s += E(t, -0.4, cacheBox(poisoned ? 'CACHE AVVELENATA' : 'CACHE', poisoned ? FAKE : IPX), { dy: 0 });
    // la voce legittima viene barrata e sparisce con il suo valore
    if (!poisoned) s += E(t, W('legittima') - 0.1, T(1730, 830, 'legittima', { f: 'serif', size: 40, it: true, a: 'end' }));
    // attaccante e indirizzo falso che entra nella cache
    s += E(t, W('attacco'), person(900, 800, C.line) + lbl(900, 868, 'ATTACCANTE', { size: 24 }));
    if (t >= tS && t < tIn) { const [x, y] = along([[960, 760], [1240, 748]], eio((t - tS) / 0.7)); s += pillTag(x, y, FAKE, C.coral, C.bg, { a: 'middle', size: 28, stroke: C.coral, sw: 4, w: 700 }); }
    if (t >= tOut) s += slide(t, tOut, tEnd, 1250, 640, YR + 12, FAKE, { ink: C.coral, sw: 4, size: 30 });
    s += E(t, tOut, lbl(640, YR + 90, 'INDIRIZZO FALSO · ESEMPIO', { size: 24 }));
    return s + caption(t, W('sostituita'), 'Una risposta falsa', '');
  } }) });

// 10 — finisci su un sito fraudolento, senza errori
scene('frode', { tail: 0.6, make: (W) => ({
  capAt: W('nessun'),
  render(t) {
    const BX = 140, BY = 220, BW = 860, BH = 520;
    let s = E(t, -0.4, browser(BX, BY, BW, BH, barText(BX + 172, BY + 60, NAME)), { dy: 0 });
    s += E(t, W('browser') - 0.1, pageLines(BX + 60, BY + 160, BW - 120, C.line), { dy: 8 });
    s += E(t, -0.4, rack(1560, 330, 0.8, { dash: '8 8', ink: C.lineDim }) + lbl(1560, 470, 'SITO VERO', { size: 26 }) +
      `<line x1="1010" y1="420" x2="1480" y2="340" stroke="${C.lineDim}" stroke-width="3" stroke-dasharray="6 12" stroke-linecap="round"/>`, { dy: 0 });
    s += E(t, W('reindirizzato') - 0.1, rack(1560, 690, 0.8, { stroke: C.coral, sw: 5 }), { dy: 0 });
    s += E(t, W('fraudolento') - 0.1, lbl(1560, 830, 'SITO FRAUDOLENTO', { size: 26 }));
    const p = clamp((t - W('reindirizzato')) / 0.6);
    if (p > 0) s += arrow(1010, 520, lerp(1010, 1470, p), lerp(520, 680, p), C.line, 5, 22);
    return s + caption(t, W('nessun'), 'Nessun errore visibile', '');
  } }) });

// 11 — la difesa: DNSSEC
scene('dnssec', { tail: 0.6, make: (W) => ({
  capAt: W("l'autenticità"),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(220, 160, 1480, 660, { rot: 0.6 }), { dy: 0 });
    g += E(t, -0.3, T(1640, 230, 'VALORI DI ESEMPIO', { f: 'mono', size: 24, fill: C.ink, ls: 3, a: 'end', w: 600 }));
    g += E(t, W('dnssec') - 0.1, T(960, 300, 'DNSSEC', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }));
    g += E(t, -0.3, `<rect x="330" y="370" width="600" height="300" rx="16" fill="${C.ivory}" stroke="${C.ink}" stroke-width="4"/>` +
      T(370, 430, 'RISPOSTA DNS', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 }) + `<line x1="330" y1="460" x2="930" y2="460" stroke="${C.ink}" stroke-width="3"/>` +
      T(370, 530, NAME, { f: 'mono', size: 36, fill: C.ink, w: 600 }) + T(370, 600, '→ ' + IPX, { f: 'mono', size: 36, fill: C.ink, w: 600 }), { dy: 0 });
    // sigillo della firma digitale, tutto dentro la risposta
    g += pop(t, W('firma') - 0.05, 815, 565, `<circle cx="815" cy="565" r="82" fill="${C.cream}" stroke="${C.coral}" stroke-width="7"/>` +
      T(815, 556, 'FIRMA', { f: 'mono', size: 26, fill: C.ink, a: 'middle', w: 700 }) + T(815, 592, 'DIGITALE', { f: 'mono', size: 24, fill: C.ink, a: 'middle', w: 700 }));
    g += E(t, W('verifica') - 0.1, arrow(990, 500, 1170, 500, C.ink, 6, 26), { dy: 0 });
    g += pop(t, W('verifica') + 0.2, 1400, 470, `<circle cx="1400" cy="470" r="76" fill="none" stroke="${C.ink}" stroke-width="6"/>` + check(1400, 470, 76, C.ink, 9));
    g += E(t, W('verifica') + 0.3, T(1400, 600, 'IL RESOLVER', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3, w: 700 }) + T(1400, 636, 'CONTROLLA LA FIRMA', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3, w: 700 }));
    g += E(t, W("l'autenticità") - 0.1, T(1400, 720, 'risposta autentica', { f: 'serif', size: 52, fill: C.ink, a: 'middle', it: true }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W("l'autenticità"), 'Risposte verificate', '', true);
  } }) });

// 12 — chiusura
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 450, 'Il DNS', { f: 'pop', size: 180, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('dal') - 0.1, 960, 580, 'dal nome al numero', { f: 'serif', size: 76, fill: C.ink, a: 'middle', it: true, key: 'nome' });
    s += E(t, W('numero') + 0.4, `<line x1="760" y1="660" x2="1160" y2="660" stroke="${C.ink}" stroke-width="3"/>` + T(960, 720, 'PROFTECNOLOGIA · MC COM-3-05', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
