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

const NAME = 'esempio.it', IP = '142.250.184.46', FAKE = '203.0.113.66';
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
    let s = E(t, -0.4, desktop(1500, 470, 1.1) + lbl(1500, 535, 'COMPUTER'), { dy: 0 });
    s += E(t, W('indirizzo') - 0.1, lbl(1500, 615, 'INDIRIZZO IP · ESEMPIO'));
    s += E(t, W('numero') - 0.1, pillTag(1500, 700, IP, C.line, C.bg, { a: 'middle', size: 40, w: 600 }));
    // il browser: niente numero, un nome
    let addr = '';
    const tName = W('digiti', 1);
    if (t < tName) {
      addr = barText(BX + 172, BY + 60, IP, { fill: C.lineDim });
      const st = clamp((t - W('non') - 0.1) / 0.4);
      if (st > 0) addr += `<line x1="${BX + 162}" y1="${BY + 48}" x2="${BX + 162 + st * 300}" y2="${BY + 48}" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>`;
    } else {
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
    s += E(t, W('indirizzi'), pillTag(1500, y, IP, C.line, C.bg, { a: 'middle', size: 40, w: 600 }));
    s += E(t, W('computer') - 0.1, lbl(1500, y + 90, 'PER I COMPUTER'));
    s += E(t, W('nomi') + 0.4, T(1824, 200, 'VALORI DI ESEMPIO', { f: 'mono', size: 24, ls: 3, a: 'end', w: 600 }));
    return s + caption(t, W('nomi'), 'Dal nome al numero', '');
  } }) });

// 3 — un elenco telefonico distribuito
scene('elenco', { make: (W) => ({
  capAt: W('elenco'), minD: 5.0,
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(240, 150, 1440, 680, { rot: -0.6 }), { dy: 0 });
    g += E(t, -0.3, T(330, 240, 'ELENCO: NOME → INDIRIZZO IP', { f: 'mono', size: 30, fill: C.ink, ls: 3, w: 700 }) + T(1590, 240, 'VALORI DI ESEMPIO', { f: 'mono', size: 24, fill: C.ink, ls: 3, a: 'end', w: 600 }));
    const R = [['esempio.it', IP], ['esempio.com', '198.51.100.7'], ['esempio.org', '203.0.113.25']];
    const sp = eio((t - W('distribuito') + 0.05) / 0.8); // le righe si separano
    g += E(t, -0.2, T(360, 330, 'NOME', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 700 }) + T(800, 330, 'INDIRIZZO IP', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 700 }), { dy: 0 });
    R.forEach(([n, ip], i) => {
      const y = 360 + i * (100 + 40 * sp);
      g += E(t, W('elenco') - 0.2 + i * 0.12, `<rect x="330" y="${y}" width="880" height="${84}" rx="${10 * sp}" fill="${C.ivory}" stroke="${C.ink}" stroke-width="3"/>` +
        `<line x1="770" y1="${y}" x2="770" y2="${y + 84}" stroke="${C.ink}" stroke-width="3"/>` +
        T(360, y + 55, n, { f: 'mono', size: 36, fill: C.ink, w: 600 }) + T(800, y + 55, ip, { f: 'mono', size: 36, fill: C.ink, w: 600 }));
      if (sp > 0) g += `<g opacity="${sp.toFixed(3)}"><line x1="1214" y1="${y + 42}" x2="${1214 + 150 * sp}" y2="${y + 42}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="7 7"/>` +
        rack(1450, y + 42, 0.6, { ink: C.ink, fill: C.ivory }) + '</g>';
    });
    g += E(t, W('distribuito') + 0.5, T(1450, 330, 'SERVER DIVERSI', { f: 'mono', size: 26, fill: C.ink, ls: 3, a: 'middle', w: 700 }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W('elenco'), 'Un elenco distribuito', 'distribuito', true);
  } }) });

// layout comune browser ↔ server DNS
const LX = 300, SX = 1600, YQ = 470, YR = 640;
function scenaBase(t, o = {}) {
  let s = E(t, -0.4, laptop(LX, 600, 1.25) + lbl(LX, 420, 'BROWSER') + rack(SX, 560, 1.05) + lbl(SX, 420, 'SERVER DNS'), { dy: 0 });
  s += E(t, -0.4, `<line x1="470" y1="${YQ}" x2="1500" y2="${YQ}" stroke="${C.lineDim}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>` +
    `<line x1="470" y1="${YR}" x2="1500" y2="${YR}" stroke="${C.lineDim}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>`, { dy: 0 });
  return s;
}
// 4 — domanda e risposta
scene('richiesta', { tail: 0.7, make: (W) => ({
  capAt: W('risponde'),
  render(t) {
    let s = scenaBase(t);
    s += E(t, W('richiede') - 0.1, T(960, YQ - 60, 'domanda', { f: 'serif', size: 48, a: 'middle', it: true }));
    s += slide(t, W('interroga'), W('dns') + 0.4, 640, 1320, YQ + 12, NAME + ' ?');
    s += E(t, W('risponde') - 0.1, T(960, YR + 110, 'risposta', { f: 'serif', size: 48, a: 'middle', it: true }));
    s += slide(t, W('risponde'), W('corrispondente') + 0.3, 1320, 660, YR + 12, IP, { ink: C.coral, sw: 4 });
    return s + caption(t, W('risponde'), 'Domanda e risposta', '');
  } }) });

// albero gerarchico
const RT = [1060, 290], TL3 = [[620, 540], [1060, 540], [1500, 540]], AU = [[620, 780], [1060, 780], [1500, 780]];
const TLDN = ['.it', '.com', '.org'], AUN = ['esempio.it', 'esempio.com', 'esempio.org'];
function node(x, y, o = {}) { return rack(x, y, 0.62, { n: 2, ...o }); }
function levels(t, t0, names) {
  let s = '';
  [RT[1], TL3[0][1], AU[0][1]].forEach((y, i) => {
    s += E(t, t0 + i * 0.15, `<line x1="96" y1="${y + 62}" x2="1824" y2="${y + 62}" stroke="${C.lineDim}" stroke-width="2" stroke-dasharray="3 12" stroke-linecap="round"/>` + T(96, y + 10, String(i + 1), { f: 'pop', size: 56, fill: C.line }), { dy: 0 });
    if (names[i]) s += E(t, names[i][1], T(150, y + 6, names[i][0], { f: 'mono', size: 26, ls: 3, w: 700, fill: names[i][2] || C.line }));
  });
  return s;
}
const lineTo = (a, b, p) => drawLine(a[0], a[1] + 50, b[0], b[1] - 50, p, C.line, 3.5);

// 5 — gerarchia: in cima i root server
scene('root', { tail: 0.6, make: (W) => ({
  capAt: W('cima'),
  render(t) {
    let s = levels(t, W('gerarchico') - 0.2, [['ROOT', W('root') - 0.1]]);
    // sagoma dell'albero (ancora senza nomi), poi i livelli
    const gh = clamp(1 - (t - W('root') + 0.1) / 0.3);
    if (gh > 0) s += E(t, -0.4, `<g opacity="${(0.9 * gh).toFixed(3)}">` + [RT, ...TL3, ...AU].map(p => node(p[0], p[1], { ink: C.lineDim, dash: '6 8', fill: 'none' })).join('') +
      TL3.map((p, i) => lineTo(RT, p, 1).replace(C.line, C.lineDim) + lineTo(p, AU[i], 1).replace(C.line, C.lineDim)).join('') + '</g>', { dy: 0 });
    s += E(t, W('gerarchico') - 0.1, T(1824, 200, 'UN SISTEMA A LIVELLI', { f: 'mono', size: 26, ls: 3, a: 'end', w: 600 }));
    s += pop(t, W('root') - 0.1, RT[0], RT[1], node(RT[0], RT[1]));
    s += E(t, W('13') - 0.1, T(1160, 330, '13', { f: 'pop', size: 120, fill: C.coral }));
    s += E(t, W('tutto') - 0.1, T(1330, 300, 'in tutto il mondo', { f: 'serif', size: 50, it: true }));
    s += E(t, W('gestiti') - 0.1, T(1160, 410, 'gestiti da varie organizzazioni', { f: 'serif', size: 44, it: true }));
    return s + caption(t, W('cima'), 'In cima, i root', '');
  } }) });

// 6 — i server TLD
scene('tld', { tail: 0.7, make: (W) => ({
  capAt: W('primo'),
  render(t) {
    let s = levels(t, -1, [['ROOT', -1], ['TLD', W('tld') - 0.1], ['', 0]]);
    s += E(t, -0.4, node(RT[0], RT[1]), { dy: 0 });
    s += E(t, W('primo') - 0.1, T(150, TL3[0][1] + 50, 'PRIMO LIVELLO', { f: 'mono', size: 26, ls: 3, w: 700, fill: C.coral }));
    TL3.forEach((p, i) => {
      s += lineTo(RT, p, (t - W('tld') - i * 0.12) / 0.4);
      s += pop(t, W('tld') + 0.2 + i * 0.12, p[0], p[1], node(p[0], p[1]));
    });
    const tk = [W('it'), W('com'), W('org')];
    TL3.forEach((p, i) => s += E(t, tk[i] - 0.1, T(p[0] + 70, p[1] + 18, TLDN[i], { f: 'pop', size: 52 })));
    return s + caption(t, W('primo'), 'Primo livello', '');
  } }) });

// 7 — i server autoritativi
scene('autoritativi', { tail: 0.9, make: (W) => ({
  capAt: W('possiede'),
  render(t) {
    let s = levels(t, -1, [['ROOT', -1], ['TLD', -1], ['AUTORITATIVI', W('autoritativi') - 0.1]]);
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

// 8 — DNS spoofing: la risposta sostituita
scene('spoofing', { tail: 1.7, make: (W) => ({
  capAt: W('sostituita'),
  render(t) {
    let s = scenaBase(t);
    s += E(t, W('attacchi') - 0.1, warn(760, 200, 34, C.line) + T(820, 218, 'ATTACCHI AL DNS', { f: 'mono', size: 30, ls: 3, w: 700 }));
    s += E(t, W('spoofing') - 0.1, T(960, 330, 'DNS spoofing', { f: 'serif', size: 66, a: 'middle', it: true }));
    // la domanda è già arrivata al server
    s += E(t, -0.4, pillTag(1320, YQ + 12, NAME + ' ?', C.line, C.bg, { a: 'middle', size: 34, w: 600 }), { dy: 0 });
    // risposta legittima: parte, viene scartata a metà strada
    const t0 = W('risposta'), tx = W('sostituita'), XM = 1000;
    if (t >= t0) {
      const x = lerp(1320, XM, eio((Math.min(t, tx) - t0) / (tx - t0))), q = clamp((t - tx) / 0.8);
      if (q < 1) s += `<g opacity="${(1 - q).toFixed(3)}">${pillTag(x, YR + 12 - 60 * eo(q), IP, C.line, C.bg, { a: 'middle', size: 34, w: 600 })}</g>`;
    }
    s += E(t, t0 - 0.1, T(1320, YR + 100, 'legittima', { f: 'serif', size: 44, a: 'middle', it: true }));
    // indirizzo falso: entra dal basso e prosegue verso il browser
    if (t >= tx) {
      const up = eio((t - tx) / 0.5), go = eio((t - tx - 0.5) / (W('falso') - tx + 0.1));
      const x = lerp(XM, 660, go), y = lerp(YR + 200, YR + 12, up);
      s += `<g opacity="${clamp(up * 2).toFixed(3)}">${pillTag(x, y, FAKE, C.coral, C.bg, { a: 'middle', size: 34, stroke: C.coral, sw: 4, w: 700 })}</g>`;
    }
    s += E(t, W('falso') - 0.1, lbl(660, YR + 100, 'INDIRIZZO FALSO · ESEMPIO', { size: 24 }));
    return s + caption(t, W('sostituita'), 'Una risposta falsa', '');
  } }) });

// 9 — finisci su un sito fraudolento, senza errori
scene('frode', { tail: 0.8, make: (W) => ({
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
    if (p > 0) s += `<g>${arrow(1010, 520, lerp(1010, 1470, p), lerp(520, 680, p), C.line, 5, 22)}</g>`;
    return s + caption(t, W('nessun'), 'Nessun errore visibile', '');
  } }) });

// 10 — la difesa: DNSSEC
scene('dnssec', { tail: 0.7, make: (W) => ({
  capAt: W("l'autenticità"),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(220, 160, 1480, 660, { rot: 0.6 }), { dy: 0 });
    g += E(t, W('dnssec') - 0.1, T(960, 290, 'DNSSEC', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }));
    // la risposta DNS
    g += E(t, -0.3, `<rect x="330" y="370" width="600" height="300" rx="16" fill="${C.ivory}" stroke="${C.ink}" stroke-width="4"/>` +
      T(370, 430, 'RISPOSTA DNS', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 }) + `<line x1="330" y1="460" x2="930" y2="460" stroke="${C.ink}" stroke-width="3"/>` +
      T(370, 530, NAME, { f: 'mono', size: 36, fill: C.ink, w: 600 }) + T(370, 600, '→ ' + IP, { f: 'mono', size: 36, fill: C.ink, w: 600 }), { dy: 0 });
    // sigillo: firma digitale
    g += pop(t, W('firma') - 0.05, 900, 660, `<circle cx="900" cy="660" r="78" fill="${C.cream}" stroke="${C.coral}" stroke-width="7"/><circle cx="900" cy="660" r="62" fill="none" stroke="${C.coral}" stroke-width="3" stroke-dasharray="5 7"/>` +
      T(900, 650, 'FIRMA', { f: 'mono', size: 26, fill: C.ink, a: 'middle', w: 700 }) + T(900, 684, 'DIGITALE', { f: 'mono', size: 24, fill: C.ink, a: 'middle', w: 700 }));
    g += E(t, W('verifica') - 0.1, arrow(1030, 520, 1200, 520, C.ink, 6, 26), { dy: 0 });
    g += pop(t, W('verifica') + 0.2, 1400, 500, `<circle cx="1400" cy="500" r="80" fill="none" stroke="${C.ink}" stroke-width="6"/>` + check(1400, 500, 80, C.ink, 9));
    g += E(t, W("l'autenticità") - 0.1, T(1400, 650, 'risposta autentica', { f: 'serif', size: 56, fill: C.ink, a: 'middle', it: true }));
    s += `<g transform="translate(960,480) scale(${k}) translate(-960,-480)">${g}</g>`;
    return s + caption(t, W("l'autenticità"), 'Risposte verificate', '', true);
  } }) });

// 11 — chiusura
scene('finale', { L: 0.5, tail: 3.4, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 440, 'Il DNS', { f: 'pop', size: 170, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('dal') - 0.1, 960, 570, "dal nome che scrivi all'indirizzo che usano i computer", { f: 'serif', size: 62, fill: C.ink, a: 'middle', it: true, key: 'nome' });
    s += E(t, W('computer') + 0.4, `<line x1="760" y1="650" x2="1160" y2="650" stroke="${C.ink}" stroke-width="3"/>` + T(960, 710, 'PROFTECNOLOGIA · MC COM-3-05', { f: 'mono', size: 30, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
