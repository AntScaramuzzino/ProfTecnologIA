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
    s += E(t, W('indirizzi'), pillTag(1500, y, IPX, C.line, C.bg, { a: 'middle', size: 40, w: 600 }));
    s += E(t, W('computer') - 0.1, lbl(1500, y + 90, 'PER I COMPUTER'));
    s += E(t, W('nomi') + 0.4, T(1824, 200, 'VALORI DI ESEMPIO', { f: 'mono', size: 24, ls: 3, a: 'end', w: 600 }));
    return s + caption(t, W('nomi'), 'Dal nome al numero', '');
  } }) });

