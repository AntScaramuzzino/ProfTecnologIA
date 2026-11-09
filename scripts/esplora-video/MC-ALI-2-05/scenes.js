// Over-packaging — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d'-]/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<clipPath id="netclip"><rect x="430" y="460" width="580" height="350" rx="60"/></clipPath>
<clipPath id="binband"><rect x="0" y="0" width="1920" height="1080"/></clipPath></defs>`;

const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.line, ls: 3, a: o.a || 'middle', w: 600 });
// tracciato che si disegna (p 0..1)
function draw(d, p, c, sw = 4, o = {}) {
  p = clamp(p); if (p <= 0) return '';
  const dash = p < 1 ? ` pathLength="1" stroke-dasharray="${p.toFixed(4)} 1"` : (o.dash ? ` stroke-dasharray="${o.dash}"` : '');
  return `<path d="${d}" fill="${o.fill || 'none'}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${dash}${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
}
const leader = (x1, y1, x2, y2, c = C.line) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2"/><circle cx="${x2}" cy="${y2}" r="5" fill="${c}"/>`;

// ---- fragola (line-art originale) ----
function strawberry(x, y, k = 1, ink = C.line) {
  const P = (a, b) => `${(x + a * k).toFixed(1)},${(y + b * k).toFixed(1)}`;
  let s = `<path d="M${P(0, 42)} C${P(-30, 20)} ${P(-44, -14)} ${P(-30, -28)} C${P(-16, -40)} ${P(16, -40)} ${P(30, -28)} C${P(44, -14)} ${P(30, 20)} ${P(0, 42)} z" fill="${mix(C.bg, ink, 0.1)}" stroke="${ink}" stroke-width="3"/>`;
  s += `<path d="M${P(-24, -30)} L${P(-12, -46)} L${P(-4, -34)} L${P(0, -50)} L${P(4, -34)} L${P(12, -46)} L${P(24, -30)}" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  [[-14, -12], [6, -16], [-4, 4], [16, 2], [-16, 14], [4, 22]].forEach(([a, b]) => s += `<line x1="${x + a * k}" y1="${y + b * k}" x2="${x + a * k}" y2="${y + (b + 5) * k}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`);
  return s;
}
const BERRIES = [[665, 618], [775, 618], [610, 685], [720, 692], [830, 685]];
const berries = (ink = C.line) => BERRIES.map(([x, y]) => strawberry(x, y, 1, ink)).join('');

// ---- i quattro strati intorno alle fragole ----
const LAYER = [
  { id: 'vaschetta', c: [720, 655], d: p => '', svg: (c, p) =>
      draw('M505,560 L538,560 L574,736 L866,736 L902,560 L935,560', p, c, 4) +
      draw('M520,560 L560,750 L880,750 L920,560', p, c, 4) },
  { id: 'carta', c: [720, 650], svg: (c, p) => {
      let d = 'M470,535'; for (let i = 1; i <= 10; i++) d += ` L${470 + i * 50},${i % 2 ? 508 : 538}`;
      d += ' L962,782 L478,782 z';
      return draw(d, p, c, 4) + (p >= 1 ? draw('M520,782 L560,760 M900,782 L860,760', 1, c, 2) : ''); } },
  { id: 'rete', c: [720, 635], svg: (c, p) => {
      let s = draw('M490,460 L950,460 Q1010,460 1010,520 L1010,750 Q1010,810 950,810 L490,810 Q430,810 430,750 L430,520 Q430,460 490,460 z', p, c, 4);
      if (p > 0.3) { let m = ''; for (let k = -400; k < 700; k += 46) m += `M${430 + k},460 L${430 + k + 350},810 M${1010 - k},460 L${1010 - k - 350},810 `;
        s += `<g clip-path="url(#netclip)" opacity="${(0.45 * clamp((p - 0.3) / 0.7)).toFixed(3)}"><path d="${m}" stroke="${c}" stroke-width="2" fill="none"/></g>`; }
      s += draw('M700,460 C690,430 750,430 740,460', p, c, 4);
      return s; } },
  { id: 'busta', c: [720, 600], svg: (c, p) =>
      draw('M380,400 L1060,400 L1030,850 L410,850 z', p, c, 4) +
      draw('M520,400 C520,285 660,285 660,400', p, c, 4) + draw('M780,400 C780,285 920,285 920,400', p, c, 4) +
      (p >= 1 ? `<line x1="430" y1="818" x2="1010" y2="818" stroke="${c}" stroke-width="2" stroke-dasharray="10 10"/>` : '') }
];
const RULER = ['Vaschetta di plastica rigida', 'Foglio di carta', 'Sacchetto di rete', 'Busta del supermercato'];
function rulerRow(t, t0, i) {
  const y = 390 + i * 96;
  return E(t, t0, `<rect x="1250" y="${y - 40}" width="54" height="54" rx="10" fill="none" stroke="${C.line}" stroke-width="3"/>` +
    T(1277, y - 2, String(i + 1), { f: 'mono', size: 30, fill: C.line, a: 'middle', w: 700 }) +
    T(1330, y - 2, RULER[i], { f: 'popm', size: 34, fill: C.line }));
}
const rulerHead = t => E(t, -0.4, lbl(1250, 300, 'STRATI INTORNO ALLE FRAGOLE', { a: 'start' }) + `<line x1="1250" y1="322" x2="1800" y2="322" stroke="${C.line}" stroke-width="2"/>`, { dy: 0 });

// 1 — aggancio: il bidone dei rifiuti in sezione
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('volte'),
  render(t) {
    let s = '';
    const top = 380, bot = 812, band = 0.4 * (bot - top), mid = top + band;
    const xl = y => lerp(648, 692, (y - 330) / (bot - 330)), xr = y => lerp(1272, 1228, (y - 330) / (bot - 330));
    // contenuto: altri rifiuti (riempimento)
    const f1 = eio((t - 0.1) / 1.1), yA = lerp(bot, mid, f1);
    if (f1 > 0) {
      s += `<path d="M${xl(yA)},${yA} L${xr(yA)},${yA} L${xr(bot)},${bot} L${xl(bot)},${bot} z" fill="${mix(C.bg, C.line, 0.1)}"/>`;
      for (let y = bot - 30; y > yA + 10; y -= 44) s += `<line x1="${xl(y) + 30}" y1="${y}" x2="${xr(y) - 30}" y2="${y}" stroke="${C.lineDim}" stroke-width="2" stroke-dasharray="26 18"/>`;
    }
    // packaging: fascia del 40%
    const f2 = eio((t - W('40') + 0.1) / 0.9), yB = lerp(mid, top, f2);
    if (f2 > 0) {
      let h = ''; for (let k = -500; k < 700; k += 26) h += `M${640 + k},${mid} L${640 + k + 180},${yB} `;
      s += `<clipPath id="bandc"><path d="M${xl(yB)},${yB} L${xr(yB)},${yB} L${xr(mid)},${mid} L${xl(mid)},${mid} z"/></clipPath>`;
      s += `<path d="M${xl(yB)},${yB} L${xr(yB)},${yB} L${xr(mid)},${mid} L${xl(mid)},${mid} z" fill="${mix(C.bg, C.coral, 0.22)}" stroke="${C.coral}" stroke-width="4"/>`;
      s += `<g clip-path="url(#bandc)"><path d="${h}" stroke="${C.coral}" stroke-width="2.5" fill="none" opacity="0.7"/></g>`;
    }
    // bidone
    s += E(t, -0.4, `<path d="M648,330 L692,${bot + 8} L1228,${bot + 8} L1272,330" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>` +
      `<rect x="620" y="300" width="680" height="30" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/><rect x="900" y="276" width="120" height="24" rx="8" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`, { dy: 0 });
    s += E(t, -0.2, lbl(960, 220, 'RIFIUTI DOMESTICI · ITALIA'), { dy: 0 });
    s += E(t, 0.4, lbl(960, 864, 'SCHEMA, NON IN SCALA', { size: 24 }), { dy: 0 });
    s += E(t, 0.9, leader(1500, 700, 1235, 700) + lbl(1520, 708, 'ALTRI RIFIUTI', { a: 'start' }));
    s += E(t, W('40') + 0.3, leader(1500, 470, 1258, 470) + T(1520, 470, 'circa 40%', { f: 'pop', size: 72, fill: C.line }) + lbl(1522, 520, 'PACKAGING', { a: 'start' }));
    return s + caption(t, W('volte'), 'Più del necessario', '');
  } }) });

// 2 — definizione
scene('def', { make: (W) => ({
  capAt: W('imballaggio'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(200, 150, 1520, 690, { rot: -0.6 }), { dy: 0 });
    g += E(t, W('over-packaging') - 0.1, T(290, 300, 'over-packaging', { f: 'pop', size: 96, fill: C.ink }));
    g += words(t, W('imballaggio'), 296, 384, 'imballaggio eccessivo', { f: 'serif', size: 62, it: true, fill: C.ink });
    g += E(t, W('serve') - 0.1, T(296, 500, 'SERVE PER', { f: 'mono', size: 28, fill: C.ink, ls: 4, w: 700 }));
    ['proteggere', 'conservare', 'trasportare'].forEach((w, i) => {
      g += E(t, W(w) - 0.1, `<circle cx="312" cy="${566 + i * 74}" r="10" fill="${C.ink}"/>` + T(344, 582 + i * 74, w, { f: 'popm', size: 46, fill: C.ink }));
    });
    // a destra: il prodotto, ciò che serve, l'imballaggio sproporzionato
    const cx = 1440, cy = 560;
    g += E(t, 0.2, `<rect x="${cx - 60}" y="${cy - 60}" width="120" height="120" rx="10" fill="${mix(C.cream, C.ink, 0.12)}" stroke="${C.ink}" stroke-width="4"/>` +
      T(cx, cy + 136, 'PRODOTTO', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 3, w: 600 }));
    g += E(t, W('serve') - 0.1, T(cx, cy - 106, 'SERVE', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 3, w: 700 }) + `<rect x="${cx - 92}" y="${cy - 92}" width="184" height="184" rx="14" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="12 10"/>`);
    const gp = eio((t - W('sproporzionato')) / 1.0);
    if (gp > 0) {
      const h = lerp(92, 235, gp), w = lerp(92, 215, gp);
      g += `<rect x="${cx - w}" y="${cy - h - 20 * gp}" width="${2 * w}" height="${2 * h + 40 * gp}" rx="18" fill="none" stroke="${C.coral}" stroke-width="6"/>`;
      g += E(t, W('sproporzionato') + 0.6, T(cx - w + 26, cy - h - 20 * gp + 46, 'IN PIÙ', { f: 'mono', size: 26, fill: C.ink, ls: 3, w: 700 }));
    }
    s += `<g transform="translate(960,495) scale(${k}) translate(-960,-495)">${g}</g>`;
    return s + caption(t, W('imballaggio'), 'Imballaggio eccessivo', '', true);
  } }) });

// 3 — strati 1 e 2
scene('strati1', { make: (W) => ({
  capAt: W('vaschetta'),
  render(t) {
    const a1 = W('vaschetta') - 0.2, a2 = W('foglio') - 0.1;
    let s = E(t, -0.4, berries(), { dy: 0 });
    s += E(t, 0.3, leader(330, 650, 585, 688) + lbl(320, 658, 'FRAGOLE', { a: 'end' }), { dy: 0 });
    const c1 = t >= a2 ? C.line : C.coral;
    s += LAYER[0].svg(c1, (t - a1) / 0.9);
    s += LAYER[1].svg(C.coral, (t - a2) / 1.0);
    s += rulerHead(t) + rulerRow(t, a1, 0) + rulerRow(t, a2, 1);
    return s + caption(t, W('vaschetta'), 'Vaschetta, poi carta', '');
  } }) });

// 4 — strati 3 e 4
scene('strati2', { make: (W) => ({
  capAt: W('quattro'),
  render(t) {
    const a3 = W('sacchetto') - 0.2, a4 = W('busta') - 0.2, aq = W('quattro');
    let s = berries();
    const col = i => (i === 2 && t < a4) || (i === 3 && t < aq) ? C.coral : C.line;
    s += LAYER[0].svg(C.line, 1) + LAYER[1].svg(C.line, 1);
    s += LAYER[2].svg(col(2), (t - a3) / 1.0);
    s += LAYER[3].svg(col(3), (t - a4) / 1.1);
    s += rulerHead(t) + rulerRow(t, -0.4, 0) + rulerRow(t, -0.4, 1) + rulerRow(t, a3, 2) + rulerRow(t, a4, 3);
    s += E(t, aq - 0.1, T(1250, 790, '= 4 strati', { f: 'pop', size: 76, fill: C.coral }));
    return s + caption(t, aq, 'Quattro strati', '');
  } }) });

// 5 — togli gli strati che non servono: la vaschetta resta
const PILE = [[1560, 780, 0.30], [1700, 792, 0.24], [1640, 706, 0.26]]; // busta, rete, carta
scene('togli', { make: (W) => ({
  capAt: W('quelli'),
  render(t) {
    let s = berries() + LAYER[0].svg(C.line, 1);
    [3, 2, 1].forEach((li, k) => {
      const t0 = W('togli') + 0.2 + k * 0.5, p = eio((t - t0) / 0.75), [cx, cy] = LAYER[li].c, [px, py, sc] = PILE[k];
      const x = lerp(cx, px, p), y = lerp(cy, py, p) - Math.sin(Math.PI * p) * 120, z = lerp(1, sc, p), r = lerp(0, [-8, 10, -12][k], p);
      s += `<g transform="translate(${x},${y}) rotate(${r}) scale(${z}) translate(${-cx},${-cy})">${LAYER[li].svg(C.line, 1)}</g>`;
    });
    s += E(t, W('vaschetta') - 0.1, leader(720, 498, 720, 556) + lbl(720, 480, 'SERVE: PROTEGGE'));
    s += E(t, W('mucchio') - 0.1, lbl(1630, 600, 'RIFIUTI', { fill: C.coral, size: 30 }));
    s += E(t, -0.4, `<line x1="1380" y1="880" x2="1860" y2="880" stroke="${C.lineDim}" stroke-width="2"/>`, { dy: 0 });
    return s + caption(t, W('quelli'), 'Quelli che non servono', '');
  } }) });

// 6 — cucchiai
scene('cucchiai', { make: (W) => ({
  capAt: W('singola'),
  render(t) {
    let s = '';
    const as = W('cucchiai') - 0.2, ap = W('confezione') - 0.1, ac = W('cellophane') - 0.1, ab = W('scatola') - 0.2;
    s += E(t, -0.4, lbl(300, 250, 'CUCCHIAI DI PLASTICA', { a: 'start' }), { dy: 0 });
    for (let i = 0; i < 4; i++) {
      const cx = 440 + i * 225;
      s += E(t, Math.min(as, 0) + i * 0.08 - 0.3, `<ellipse cx="${cx}" cy="${510}" rx="32" ry="46" fill="${mix(C.bg, C.line, 0.1)}" stroke="${C.line}" stroke-width="4"/>` +
        `<line x1="${cx}" y1="560" x2="${cx}" y2="730" stroke="${C.line}" stroke-width="12" stroke-linecap="round"/>`, { dy: 0 });
      s += E(t, ap + i * 0.08, `<rect x="${cx - 78}" y="440" width="156" height="320" rx="16" fill="none" stroke="${C.line}" stroke-width="5"/>`);
      s += E(t, ac + i * 0.08, `<rect x="${cx - 94}" y="424" width="188" height="352" rx="24" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="4 9"/>` +
        `<path d="M${cx - 20},424 L${cx},404 L${cx + 20},424 M${cx - 20},776 L${cx},796 L${cx + 20},776" fill="none" stroke="${C.line}" stroke-width="3"/>`);
    }
    // scatola di cartone in sezione (onda del cartone ondulato tra le due pareti)
    const pb = (t - ab) / 1.0;
    let wv = 'M296,824'; for (let x = 296; x <= 1288; x += 16) wv += ` L${x},${x % 32 ? 820 : 830}`;
    s += draw('M300,380 L300,840 L1290,840 L1290,380', pb, C.line, 4) + draw('M318,380 L318,822 L1272,822 L1272,380', pb, C.line, 3);
    s += draw('M300,380 L230,310 M1290,380 L1360,310', pb, C.line, 4);
    if (pb >= 1) s += `<path d="${wv}" fill="none" stroke="${C.line}" stroke-width="2" opacity="0.7"/>`;
    s += E(t, ap + 0.2, leader(1420, 470, 1213, 470) + lbl(1440, 478, 'CONFEZIONE SINGOLA', { a: 'start' }));
    s += E(t, ac + 0.2, leader(1420, 600, 1229, 600) + lbl(1440, 608, 'CELLOPHANE', { a: 'start' }));
    s += E(t, ab + 0.4, leader(1420, 760, 1290, 760) + lbl(1440, 768, 'SCATOLA DI CARTONE', { a: 'start' }));
    return s + caption(t, W('singola'), 'Confezione singola', 'singola');
  } }) });

// 7 — biscotti
scene('biscotti', { tail: 0.8, make: (W) => ({
  capAt: W('avvolti'),
  render(t) {
    let s = '';
    const aw = W('avvolti') - 0.1, an = W('sei') - 0.1, ao = W('confezione') - 0.2;
    for (let i = 0; i < 6; i++) {
      const cx = 365 + i * 172, cy = 600;
      let b = `<circle cx="${cx}" cy="${cy}" r="58" fill="${mix(C.bg, C.line, 0.1)}" stroke="${C.line}" stroke-width="4"/>`;
      [[-20, -18], [18, -14], [-8, 16], [22, 20], [0, -2]].forEach(([a, c]) => b += `<circle cx="${cx + a}" cy="${cy + c}" r="5" fill="${C.line}"/>`);
      s += E(t, -0.4 + i * 0.06, b, { dy: 0 });
      s += E(t, an + i * 0.1, T(cx, 846, String(i + 1), { f: 'mono', size: 30, fill: C.line, a: 'middle', w: 700 }));
      let wp = `M${cx - 72},520 L${cx + 72},520`;
      for (let y = 520; y < 680; y += 20) wp += ` L${cx + 84},${y + 10} L${cx + 72},${y + 20}`;
      wp += ` L${cx - 72},680`;
      for (let y = 680; y > 520; y -= 20) wp += ` L${cx - 84},${y - 10} L${cx - 72},${y - 20}`;
      s += E(t, aw + i * 0.09, `<path d="${wp} z" fill="none" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>`);
    }
    // confezione esterna di plastica con saldature dentellate
    const po = (t - ao) / 1.0;
    let L = 'M250,440'; for (let y = 440; y < 760; y += 20) L += ` L270,${y + 10} L250,${y + 20}`;
    let R = 'M1330,440'; for (let y = 440; y < 760; y += 20) R += ` L1310,${y + 10} L1330,${y + 20}`;
    s += draw('M250,440 L1330,440 M250,760 L1330,760', po, C.line, 4) + draw(L, po, C.line, 3) + draw(R, po, C.line, 3);
    s += draw('M282,440 L282,760 M1298,440 L1298,760', po, C.line, 2, { op: 0.6 });
    s += E(t, ao + 0.3, lbl(790, 400, 'CONFEZIONE DI PLASTICA'));
    s += E(t, aw + 0.6, leader(1400, 600, 1309, 600) + lbl(1420, 590, 'INCARTO', { a: 'start' }) + lbl(1420, 628, 'SINGOLO', { a: 'start' }));
    return s + caption(t, W('avvolti'), 'Avvolti uno per uno', 'Avvolti');
  } }) });

// 8 — tappi e frutta tagliata
scene('altri', { tail: 0.65, make: (W) => ({
  capAt: W('frutta'),
  render(t) {
    let s = '';
    const at = W('tappi') - 0.2, aa = W('avvolti') - 0.1, af = W('frutta') - 0.2, ap = W('vaschette') - 0.2;
    s += E(t, -0.4, `<line x1="960" y1="230" x2="960" y2="830" stroke="${C.lineDim}" stroke-width="2" stroke-dasharray="6 12"/>`, { dy: 0 });
    // bottiglia d'acqua
    const bx = 520;
    s += E(t, Math.min(at, 0), `<path d="M${bx - 32},372 L${bx - 32},410 C${bx - 32},450 ${bx - 92},470 ${bx - 92},520 L${bx - 92},800 Q${bx - 92},820 ${bx - 72},820 L${bx + 72},820 Q${bx + 92},820 ${bx + 92},800 L${bx + 92},520 C${bx + 92},470 ${bx + 32},450 ${bx + 32},410 L${bx + 32},372" fill="none" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>` +
      `<line x1="${bx - 92}" y1="600" x2="${bx + 92}" y2="600" stroke="${C.lineDim}" stroke-width="2"/>` +
      `<rect x="${bx - 40}" y="326" width="80" height="46" rx="6" fill="${mix(C.bg, C.line, 0.15)}" stroke="${C.line}" stroke-width="4"/>`, { dy: 0 });
    s += E(t, aa, `<rect x="${bx - 58}" y="306" width="116" height="84" rx="16" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="4 9"/>` +
      `<path d="M${bx - 58},330 L${bx - 80},318 L${bx - 80},346 z M${bx + 58},330 L${bx + 80},318 L${bx + 80},346 z" fill="none" stroke="${C.line}" stroke-width="3"/>`);
    s += E(t, at + 0.1, lbl(bx, 270, 'TAPPO'));
    s += E(t, aa + 0.2, leader(bx + 200, 348, bx + 84, 340) + lbl(bx + 214, 356, 'AVVOLTO', { a: 'start' }));
    // vaschetta di frutta tagliata
    const tx = 1360;
    s += E(t, -0.4, `<path d="M${tx - 250},600 L${tx - 215},770 L${tx + 215},770 L${tx + 250},600" fill="none" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>` + lbl(tx, 830, 'VASCHETTA'), { dy: 0 });
    s += E(t, af, ''+
      [[-150, 712], [-60, 724], [40, 712], [140, 722], [-110, 650], [0, 660], [100, 652]].map(([a, b], i) => i % 2 ?
        `<path d="M${tx + a - 38},${b + 26} A38,38 0 0 1 ${tx + a + 38},${b + 26} z" fill="${mix(C.bg, C.line, 0.1)}" stroke="${C.line}" stroke-width="3"/>` :
        `<rect x="${tx + a - 30}" y="${b - 14}" width="56" height="48" rx="6" fill="${mix(C.bg, C.line, 0.1)}" stroke="${C.line}" stroke-width="3" transform="rotate(${(i * 7) % 15 - 7} ${tx + a} ${b})"/>`).join(''));
    s += E(t, af + 0.3, lbl(tx, 430, 'FRUTTA SBUCCIATA'));
    s += E(t, af + 0.5, lbl(tx, 472, 'E TAGLIATA'));
    s += draw(`M${tx - 262},596 Q${tx},610 ${tx + 262},596`, (t - ap) / 0.7, C.coral, 6);
    s += E(t, ap + 0.4, leader(tx - 150, 562, tx - 150, 600) + lbl(tx - 150, 548, 'PELLICOLA'));
    return s + (t < W('frutta') - 0.05 ? caption(t, W('tappi'), 'Tappi avvolti', '') : caption(t, W('frutta'), 'Frutta in vaschette', ''));
  } }) });

// 9 — i problemi
function icon(kind, x, y, c) {
  const st = `fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  if (kind === 'materiali') return `<circle cx="${x - 26}" cy="${y - 14}" r="24" ${st}/><circle cx="${x - 26}" cy="${y - 14}" r="7" ${st}/><path d="M${x - 2},${y - 14} L${x + 40},${y - 14} L${x + 40},${y + 36} L${x - 26},${y + 36} L${x - 26},${y + 10}" ${st}/>`;
  if (kind === 'costi') return [0, 1, 2].map(i => `<ellipse cx="${x}" cy="${y + 26 - i * 18}" rx="40" ry="12" ${st}/>`).join('') + `<path d="M${x - 40},${y + 26} L${x - 40},${y + 40} M${x + 40},${y + 26} L${x + 40},${y + 40}" ${st}/><ellipse cx="${x}" cy="${y + 40}" rx="40" ry="12" ${st}/>`;
  if (kind === 'inganna') return `<rect x="${x - 44}" y="${y - 40}" width="88" height="80" rx="6" ${st}/><rect x="${x - 12}" y="${y + 18}" width="24" height="18" rx="3" fill="${c}"/>`;
  return `<path d="M${x - 34},${y - 26} L${x - 26},${y + 42} L${x + 26},${y + 42} L${x + 34},${y - 26} z M${x - 44},${y - 26} L${x + 44},${y - 26} M${x - 14},${y - 26} L${x - 14},${y - 38} L${x + 14},${y - 38} L${x + 14},${y - 26}" ${st}/>` +
    `<path d="M${x - 10},${y - 10} L${x - 8},${y + 30} M${x + 10},${y - 10} L${x + 8},${y + 30}" ${st}/>`;
}
scene('problemi', { make: (W) => ({
  capAt: W('rifiuti'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(200, 150, 1520, 690, { rot: 0.5 }), { dy: 0 });
    g += E(t, W('risultato') - 0.2, T(290, 262, 'Il risultato?', { f: 'pop', size: 66, fill: C.ink }));
    const tiles = [['materiali', 'Spreca', 'materiali', 'spreca'], ['costi', 'Aumenta', 'i costi', 'aumenta'], ['inganna', 'Inganna', 'sulla quantità reale', 'inganna'], ['rifiuti', 'Genera', 'rifiuti evitabili', 'genera']];
    tiles.forEach(([ic, a, b, w], i) => {
      const x = 290 + (i % 2) * 690, y = 310 + Math.floor(i / 2) * 250, c = i === 3 ? C.coral : C.ink;
      g += E(t, W(w) - 0.15, `<rect x="${x}" y="${y}" width="650" height="210" rx="16" fill="${C.cream}" stroke="${c}" stroke-width="${i === 3 ? 6 : 3}"/>` +
        icon(ic, x + 100, y + 104, c) + T(x + 190, y + 96, a, { f: 'pop', size: 48, fill: C.ink }) + T(x + 192, y + 154, b, { f: 'serif', size: 44, it: true, fill: C.ink }));
    });
    s += `<g transform="translate(960,495) scale(${k}) translate(-960,-495)">${g}</g>`;
    return s + caption(t, W('rifiuti'), 'Rifiuti evitabili', '', true);
  } }) });

// 10 — la norma europea
scene('norma', { make: (W) => ({
  capAt: W('meno'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(240, 160, 1440, 680, { rot: -0.5 }), { dy: 0 });
    g += E(t, W('dal') - 0.1, T(330, 370, 'Dal 2025', { f: 'pop', size: 120, fill: C.ink }));
    g += E(t, W('vigore') - 0.1, `<rect x="336" y="206" width="190" height="46" rx="23" fill="none" stroke="${C.ink}" stroke-width="3"/>` + T(431, 238, 'IN VIGORE', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 2, w: 700 }));
    g += E(t, W('regolamento') - 0.1, T(336, 440, 'REGOLAMENTO UE SUGLI IMBALLAGGI (PPWR)', { f: 'mono', size: 30, fill: C.ink, ls: 2, w: 700 }));
    g += E(t, W('obblighi') - 0.1, T(1000, 300, 'obblighi negli anni successivi', { f: 'serif', size: 46, it: true, fill: C.ink }));
    // scalinata: obblighi che crescono a gradini
    const ps = (t - W('scattano')) / 1.2;
    let d = 'M1100,410'; for (let i = 0; i < 5; i++) d += ` L${1100 + (i + 1) * 100},${410 - i * 22} L${1100 + (i + 1) * 100},${410 - (i + 1) * 22}`;
    g += draw(d, ps, C.ink, 4);
    g += E(t, W('meno') - 0.15, arrow(380, 520, 380, 600, C.ink, 6) + T(450, 584, 'meno imballaggio superfluo', { f: 'popm', size: 52, fill: C.ink }));
    g += E(t, W('più') - 0.15, arrow(380, 760, 380, 680, C.coral, 6) + T(450, 744, 'più materiale riciclato', { f: 'popm', size: 52, fill: C.ink }));
    s += `<g transform="translate(960,495) scale(${k}) translate(-960,-495)">${g}</g>`;
    return s + caption(t, W('meno'), 'Meno superfluo, più riciclato', '', true);
  } }) });

// 11 — chiusura
scene('finale', { L: 0.5, tail: 3.05, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Over-packaging', { f: 'pop', size: 150, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('più') - 0.1, 960, 550, 'più strati, non più cibo.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true });
    s += words(t, W('solo') - 0.1, 960, 632, 'Solo più rifiuti.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'rifiuti' });
    s += E(t, W('rifiuti') + 0.4, `<line x1="760" y1="704" x2="1160" y2="704" stroke="${C.ink}" stroke-width="3"/>` + T(960, 764, 'PROFTECNOLOGIA · MC ALI-2-05', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5 }));
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
