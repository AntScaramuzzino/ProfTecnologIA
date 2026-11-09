// Mangiare è chimica — il viaggio del cibo nell'apparato digerente. render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const capAt = def.capAt ?? null, nWords = (o.capText || sc.didascalia).split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (capAt != null) D = Math.max(D, capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

const fillD = mix(C.bg, C.line, 0.07), liq = mix(C.bg, C.line, 0.2), dim = mix(C.bg, C.line, 0.4);
const label = (x, y, s, a = 'middle', ink = C.line) => T(x, y, s, { f: 'mono', size: 24, fill: ink, ls: 3, a });
const lw = s => tw(s, 'mono', 24) + s.length * 3;
const serifI = (x, y, s, ink = C.ink, a = 'middle', size = 34) => T(x, y, s, { f: 'serif', size, fill: ink, a, it: true });
const poly = pts => 'M' + pts.map(p => p.join(',')).join(' L');
function along(pts, p) {
  p = clamp(p); const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  let d = p * tot;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const q = seg[i] ? d / seg[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; } d -= seg[i]; }
}
function push(t, D, cx, cy, inner, k0 = 1) { const k = k0 * (1 + 0.025 * t / D); return `<g transform="translate(${cx},${cy}) scale(${k.toFixed(5)}) translate(${-cx},${-cy})">${inner}</g>`; }
function pill(x, y, l, ink, bg, a = 'start') {
  const w = tw(l, 'mono', 24) + l.length * 3 + 40, x0 = a === 'middle' ? x - w / 2 : x;
  return `<rect x="${x0}" y="${y}" width="${w}" height="50" rx="25" fill="${bg}" stroke="${ink}" stroke-width="2"/>` + T(x0 + w / 2, y + 34, l, { f: 'mono', size: 24, fill: ink, a: 'middle', ls: 3 });
}
function pills(t, x, y, items, light) {
  let s = '', cx = x; const ink = light ? C.ink : C.line, bg = light ? C.cream : C.bg;
  items.forEach(([l, t0]) => { const w = tw(l, 'mono', 24) + l.length * 3 + 40; s += E(t, t0, pill(cx, y, l, ink, bg)); cx += w + 16; });
  return s;
}

// ---- mondo: l'apparato digerente in sezione frontale (schema) ----
const ESO = [[960, 214], [962, 330], [990, 402]];
const STC = [[990, 402], [1060, 420], [1110, 470], [1090, 528], [1020, 556], [962, 553]]; // linea mediana dello stomaco
const DUO = [[962, 553], [905, 556], [858, 585], [845, 632], [872, 664], [930, 668], [968, 650]];
const SMALL = [[968, 650], [1050, 650], [1050, 740], [870, 740], [870, 780], [1050, 780], [1050, 820], [870, 820], [870, 860], [1050, 860], [1050, 900], [870, 900], [822, 915]];
const LARGE = [[822, 915], [800, 915], [800, 690], [1120, 690], [1120, 925], [1080, 958], [1010, 965], [990, 985], [990, 1030]];
const STOM = 'M985,395 C1040,352 1155,378 1160,460 C1165,545 1080,590 1000,578 L962,568 L962,538 C1002,534 1030,500 1012,446 Z';
const LIVER = 'M722,322 C810,275 1040,266 1142,320 C1152,345 1105,368 1040,388 C960,415 880,480 800,515 C745,535 712,460 722,322 Z';
const PANC = 'M880,612 C910,598 1000,600 1060,606 C1068,618 1000,630 905,632 C885,630 875,622 880,612 Z';
const FULL = [...ESO, ...STC.slice(1), ...DUO.slice(1), ...SMALL.slice(1, -1)];
function tube(pts, w, ink, inner) {
  const d = poly(pts);
  return `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${inner}" stroke-width="${w - 7}" stroke-linejoin="round" stroke-linecap="round"/>`;
}
const MARKS = [[1150, 150, 'BOCCA', [992, 170]], [1350, 470, 'STOMACO', [1165, 470]], [610, 630, 'DUODENO', [832, 630]], [1370, 660, 'INTESTINO TENUE', [1064, 649]], [590, 800, 'INTESTINO CRASSO', [778, 800]]];
function world(t, o = {}) {
  const ink = C.line, bg = C.bg; let s = '';
  // sagoma del busto
  s += `<path d="M930,206 L930,232 C860,236 760,250 720,290 L700,560 C700,700 720,900 760,1060 M990,206 L990,232 C1060,236 1160,250 1200,290 L1220,560 C1220,700 1200,900 1160,1060" fill="none" stroke="${dim}" stroke-width="3" stroke-dasharray="4 12"/>`;
  s += `<circle cx="960" cy="140" r="66" fill="${bg}" stroke="${ink}" stroke-width="3"/><path d="M940,172 Q960,182 980,172" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
  s += `<path d="${LIVER}" fill="${fillD}" stroke="${ink}" stroke-width="3"/><ellipse cx="892" cy="490" rx="16" ry="24" fill="${liq}" stroke="${ink}" stroke-width="3"/><line x1="894" y1="514" x2="898" y2="548" stroke="${ink}" stroke-width="3"/>`;
  s += tube(ESO, 26, ink, bg);
  s += `<path d="${STOM}" fill="${fillD}" stroke="${ink}" stroke-width="3"/>`;
  s += `<path d="${PANC}" fill="${fillD}" stroke="${ink}" stroke-width="3"/>`;
  s += tube(DUO, 26, ink, bg) + tube(SMALL, 26, ink, bg);
  s += tube(LARGE, 44, ink, bg);
  for (let y = 720; y < 900; y += 34) s += `<line x1="782" y1="${y}" x2="818" y2="${y}" stroke="${dim}" stroke-width="2"/><line x1="1102" y1="${y}" x2="1138" y2="${y}" stroke="${dim}" stroke-width="2"/>`;
  for (let x = 840; x < 1100; x += 34) s += `<line x1="${x}" y1="672" x2="${x}" y2="708" stroke="${dim}" stroke-width="2"/>`;
  s += tube([[968, 650], [1050, 650], [1050, 740]], 26, ink, bg); // l'inizio del tenue scavalca il colon trasverso, davanti
  if (o.bolus != null && o.bolus > 0 && o.bolus < 1) { const [x, y] = along(FULL, o.bolus); s += `<circle cx="${x}" cy="${y}" r="15" fill="${C.coral}"/>`; }
  if (o.labels) s += E(t, o.labels, label(600, 420, 'FEGATO') + `<line x1="1072" y1="612" x2="1192" y2="596" stroke="${ink}" stroke-width="2"/>` + label(1202, 604, 'PANCREAS', 'start'), { dy: 0 });
  MARKS.forEach(([x, y, n, [lx, ly]], i) => {
    if (i >= (o.lit || 0)) return;
    const w = lw(n), x0 = x - w / 2 - 44;
    const ex = x > 960 ? x0 - 10 : x0 + w + 74;
    const g = `<line x1="${lx}" y1="${ly}" x2="${ex}" y2="${y - 11}" stroke="${ink}" stroke-width="2"/>` +
      `<rect x="${x0 - 10}" y="${y - 34}" width="${w + 84}" height="46" rx="23" fill="${bg}" stroke="${ink}" stroke-width="2"/>` +
      `<circle cx="${x0 + 14}" cy="${y - 11}" r="17" fill="${bg}" stroke="${ink}" stroke-width="2"/>` +
      T(x0 + 14, y - 2, String(i + 1), { f: 'mono', size: 24, fill: ink, a: 'middle', w: 700 }) + label(x + 10, y, n);
    s += o.marksAt != null ? pop(t, o.marksAt[i], x, y - 11, g) : g;
  });
  return s;
}
// mappa in miniatura: dove siamo
function mapInset(stage, light) {
  const ink = light ? C.ink : C.line, dm = light ? mix(C.ivory, C.ink, 0.3) : mix(C.bg, C.line, 0.3);
  const segs = [ESO, STC, DUO, SMALL, LARGE];
  let s = `<circle cx="960" cy="140" r="60" fill="none" stroke="${stage === 1 ? ink : dm}" stroke-width="${stage === 1 ? 20 : 12}"/>`;
  s += `<path d="${STOM}" fill="none" stroke="${stage === 2 ? ink : dm}" stroke-width="${stage === 2 ? 20 : 12}"/>`;
  segs.forEach((p, i) => { if (i === 1) return; const on = (i === 0 && stage === 1) || i + 1 === stage; s += `<path d="${poly(p)}" fill="none" stroke="${on ? ink : dm}" stroke-width="${on ? (i === 4 ? 40 : 22) : (i === 4 ? 26 : 12)}" stroke-linejoin="round" stroke-linecap="round"/>`; });
  return `<g transform="translate(1712,690) scale(0.3) translate(-700,-70)">${s}</g>` + T(1790, 1050, 'SEI QUI', { f: 'mono', size: 24, fill: ink, a: 'middle', ls: 3 });
}

// ---- piccole molecole disegnate ----
function hexR(x, y, r, st, fill, sw = 3) { let d = ''; for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; d += (i ? 'L' : 'M') + (x + r * Math.cos(a)).toFixed(1) + ',' + (y + r * Math.sin(a)).toFixed(1); } return `<path d="${d}z" fill="${fill}" stroke="${st}" stroke-width="${sw}"/>`; }
function glyph(kind, x, y, k, st, fill) {
  if (kind === 0) return hexR(x, y, 16 * k, st, fill);
  if (kind === 1) return [-1, 0, 1].map(i => `<circle cx="${x + i * 22 * k}" cy="${y + (i % 2) * 8 * k}" r="${9 * k}" fill="${fill}" stroke="${st}" stroke-width="3"/>`).join('');
  return `<path d="M${x - 30 * k},${y} l${12 * k},${-10 * k} l${12 * k},${10 * k} l${12 * k},${-10 * k} l${12 * k},${10 * k} l${12 * k},${-10 * k}" fill="none" stroke="${st}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
}
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// 1 — gancio: il piatto e le sue molecole
scene('hook', { L: 0.5, tail: 1.55, make: (W) => ({ capAt: null, render(t, D) {
  let g = '';
  g += E(t, -0.4, `<ellipse cx="620" cy="720" rx="300" ry="96" fill="${fillD}" stroke="${C.line}" stroke-width="4"/><ellipse cx="620" cy="712" rx="210" ry="58" fill="none" stroke="${C.line}" stroke-width="3"/>` +
    `<path d="M970,620 L970,820 M950,620 L950,680 Q950,700 970,700 Q990,700 990,680 L990,620" fill="none" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`, { dy: 0 });
  const t0 = W('introduci') - 0.3;
  for (let i = 0; i < 46; i++) {
    const p = eo((t - t0 - i * 0.045) / 1.4); if (p <= 0) continue;
    const tx = 360 + rnd(i) * 520, ty = 180 + rnd(i + 50) * 420, x = lerp(620 + (rnd(i + 9) - 0.5) * 300, tx, p), y = lerp(700, ty, p) + 6 * Math.sin(t * 1.5 + i);
    g += `<g opacity="${p.toFixed(3)}">${glyph(i % 3, x, y, 0.8 + rnd(i + 3) * 0.4, C.line, C.bg)}</g>`;
  }
  g += E(t, W('centinaia'), label(620, 900, 'CENTINAIA DI MOLECOLE DIVERSE'), { dy: 0 });
  let s = push(t, D, 960, 540, g);
  s += words(t, W('che', 1) - 0.05, 1440, 560, 'Che fine fanno?', { f: 'pop', size: 100, a: 'middle', key: 'fanno?' });
  return s;
} }) });

// 2 — il percorso: cinque tappe
scene('percorso', { make: (W) => ({ capAt: W('chimica'), render(t, D) {
  const at = W("l'apparato") - 0.2;
  const marks = [0, 1, 2, 3, 4].map(i => at + 0.3 + i * 0.32);
  let g = world(t, { lit: 5, marksAt: marks, labels: at + 1.9 });
  let s = push(t, D, 960, 560, g);
  s += pills(t, 96, 120, [['SCOMPONE', W('scompone')], ['TRASFORMA', W('trasforma')], ['DISTRIBUISCE', W('distribuisce')]], false);
  return s + caption(t, W('chimica'), 'Chimica e biologia', 'Chimica');
} }) });

// 3 — bocca: denti (meccanica) + amilasi (chimica)
scene('bocca', { make: (W) => ({ capAt: W('amidi'), render(t, D) {
  let s = lightBg(), g = '';
  g += E(t, -0.4, card(160, 150, 1440, 690, { rot: -0.6 }), { dy: 0 });
  g += E(t, -0.3, T(230, 245, 'In bocca: meccanica e chimica', { f: 'serif', size: 58, fill: C.ink }), { dy: 0 });
  // pannello denti
  const c0 = W('denti'), c1 = W('saliva'), nC = 3, ph = clamp((t - c0) / (c1 - c0)) * nC;
  const close = t > c0 && t < c1 ? 0.5 - 0.5 * Math.cos(2 * Math.PI * ph) : 0;
  const chews = Math.min(nC, Math.floor(ph + 0.5)), n = [1, 2, 3, 4][chews];
  const topY = 330 + close * 52;
  let teeth = `<path d="M260,${topY - 60} L700,${topY - 60}" stroke="${C.ink}" stroke-width="4"/>`;
  for (let i = 0; i < 8; i++) teeth += `<path d="M${270 + i * 54},${topY - 60} L${270 + i * 54},${topY - 16} Q${297 + i * 54},${topY + 6} ${324 + i * 54},${topY - 16} L${324 + i * 54},${topY - 60}" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
  for (let i = 0; i < 8; i++) teeth += `<path d="M${270 + i * 54},${580} L${270 + i * 54},${536} Q${297 + i * 54},${514} ${324 + i * 54},${536} L${324 + i * 54},${580}" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
  teeth += `<path d="M260,580 L700,580" stroke="${C.ink}" stroke-width="4"/>`;
  // cibo: un pezzo che si divide in n×n briciole
  let food = ''; const sz = 120 / n;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const sp = n > 1 ? 14 : 0, x = 480 - 60 - sp * (n - 1) / 2 + c * (sz + sp), y = 440 - 60 + 10 - sp * (n - 1) / 2 + r * (sz + sp) * 0.55;
    food += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(sz - 3).toFixed(1)}" height="${(sz * 0.55 - 2).toFixed(1)}" rx="${(sz / 6).toFixed(1)}" fill="${mix(C.ivory, C.ink, 0.25)}" stroke="${C.ink}" stroke-width="2.5"/>`;
  }
  g += E(t, 0.1, food + teeth + T(480, 650, 'DENTI', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 4, w: 700 }), { dy: 10 });
  g += E(t, W('sminuzzano'), serifI(480, 720, 'sminuzzano il cibo'), {});
  // pannello saliva/amilasi: catena di amido che si spezza
  const a0 = W('amilasi'), a1 = W('trasformare') + 0.3, cuts = [1, 3, 4, 7];
  const ep = eo((t - a0) / (a1 - a0 + 0.6));
  let chain = '', off = 0; const pos = [];
  for (let i = 0; i < 8; i++) {
    const cut = cuts.indexOf(i) >= 0, cp = clamp((ep * 8.6 - i) / 0.8);
    if (cut) off += 26 * cp;
    pos.push([860 + i * 82 + off - 52, 450 + (cut ? 0 : 0)]);
  }
  for (let i = 0; i < 7; i++) {
    const broken = cuts.indexOf(i + 1) >= 0 && clamp((ep * 8.6 - (i + 1)) / 0.3) > 0.5;
    if (!broken) chain += `<line x1="${pos[i][0] + 34}" y1="${pos[i][1]}" x2="${pos[i + 1][0] - 34}" y2="${pos[i + 1][1]}" stroke="${C.ink}" stroke-width="4"/>`;
  }
  pos.forEach(([x, y]) => chain += hexR(x, y, 32, C.ink, C.cream));
  g += E(t, 0.2, chain + T(808, 365, 'AMIDO', { f: 'mono', size: 26, fill: C.ink, ls: 4, w: 700 }), { dy: 10 });
  if (t > a0 - 0.1) { const [ex] = [lerp(800, 1500, ep)]; g += E(t, a0 - 0.1, pill(ex, 510, 'AMILASI', C.ink, C.ivory, 'middle'), { dy: 0, d: 0.3 }); }
  g += E(t, W('saliva'), pill(1240, 320, 'SALIVA', C.ink, C.cream, 'middle'), { dy: 8 });
  g += E(t, W('trasformare') - 0.1, T(1150, 650, '→ zuccheri più semplici', { f: 'serif', size: 44, fill: C.ink, a: 'middle', it: true }));
  g += E(t, W('comincia'), T(1150, 720, 'la trasformazione comincia qui', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 2 }));
  s += push(t, D, 880, 490, g) + mapInset(1, true);
  return s + caption(t, W('amidi'), 'Amidi in zuccheri', 'zuccheri', true);
} }) });

// 4 — stomaco: acido cloridrico (pH 1–2) e pepsina sulle proteine
scene('stomaco', { tail: 0.8, make: (W) => ({ capAt: W('attaccano'), render(t, D) {
  let g = '';
  // contorno: esofago aperto in alto, piloro e moncone di duodeno a sinistra
  const OUT = 'M380,232 C520,150 820,200 830,420 C840,640 640,780 450,760 C360,750 300,720 250,700 L215,700';
  const INN = 'M215,650 L250,650 C330,640 400,560 390,450 C385,360 330,300 330,232';
  const FILLP = 'M380,232 C520,150 820,200 830,420 C840,640 640,780 450,760 C360,750 300,720 250,700 L215,700 L215,650 L250,650 C330,640 400,560 390,450 C385,360 330,300 330,232 Z';
  let st = `<path d="${FILLP}" fill="${C.bg}"/>`;
  st += `<path d="${OUT}" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/><path d="${INN}" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>`;
  st += `<path d="M330,232 L330,175 M380,232 L380,175" stroke="${C.line}" stroke-width="5"/>`; // esofago, si ferma sul contorno
  st += `<path d="M215,650 L170,650 Q130,650 130,700 L130,800 M215,700 L190,700 Q180,700 180,720 L180,800" fill="none" stroke="${C.line}" stroke-width="5"/>`; // moncone di duodeno
  st += `<rect x="236" y="650" width="16" height="16" fill="${C.line}"/><rect x="236" y="684" width="16" height="16" fill="${C.line}"/>`; // sfintere del piloro
  g += E(t, -0.4, st, { dy: 0 });
  g += E(t, 0.3, label(305, 200, 'ESOFAGO', 'end') + `<line x1="240" y1="642" x2="240" y2="600" stroke="${C.line}" stroke-width="2"/>` + label(240, 590, 'PILORO') + label(155, 840, 'DUODENO'), { dy: 0 });
  // liquido acido (ritagliato dentro il contorno)
  const lv = 470 + 4 * Math.sin(t * 2);
  g += E(t, W("l'acido") - 0.2, `<clipPath id="stc"><path d="${FILLP}"/></clipPath><g clip-path="url(#stc)"><rect x="200" y="${lv}" width="700" height="400" fill="${liq}"/>` +
    [0, 1, 2, 3, 4, 5].map(i => { const y = 740 - ((t * 40 + i * 50) % 200); return `<circle cx="${430 + i * 65}" cy="${y}" r="7" fill="none" stroke="${C.line}" stroke-width="2"/>`; }).join('') + `</g>`, { dy: 0 });
  g += `<rect x="236" y="650" width="16" height="16" fill="${C.line}"/><rect x="236" y="684" width="16" height="16" fill="${C.line}"/>`;
  g += E(t, W("l'acido"), pill(560, 830, 'ACIDO CLORIDRICO', C.line, C.bg, 'middle'), { dy: 10 });
  // proteina: catena di perle che si spezza in frammenti, tutta dentro lo stomaco
  const s0 = W('attaccano'), sp = eo((t - s0) / 1.4), groups = [[0, 1, 2], [3, 4], [5, 6, 7, 8], [9, 10, 11]];
  const bead = [];
  for (let i = 0; i < 12; i++) { const gi = groups.findIndex(gr => gr.includes(i)); bead.push([445 + i * 26 + (gi - 1.5) * 24 * sp, 570 + 14 * Math.sin(i * 1.1) + (gi % 2 ? 26 : -18) * sp, gi]); }
  let pr = '';
  for (let i = 0; i < 11; i++) if (bead[i][2] === bead[i + 1][2] || sp < 0.05) pr += `<line x1="${bead[i][0]}" y1="${bead[i][1]}" x2="${bead[i + 1][0]}" y2="${bead[i + 1][1]}" stroke="${C.line}" stroke-width="4"/>`;
  bead.forEach(([x, y]) => pr += `<circle cx="${x}" cy="${y}" r="13" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`);
  g += E(t, 0.15, pr + label(615, 505, 'PROTEINA'), { dy: 0 });
  g += E(t, W('pepsina'), pill(600, 330, 'PEPSINA', C.line, C.bg, 'middle'), { dy: 10 });
  g += E(t, W('spezzandole') - 0.2, serifI(545, 685, 'spezzata in frammenti', C.line, 'middle', 32));
  // scala del pH: il tratto 1–2 è l'unico elemento corallo
  const X = v => 1000 + v * 50, py = 520;
  let ph = `<rect x="${X(0)}" y="${py}" width="${X(14) - X(0)}" height="40" rx="8" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  for (let v = 0; v <= 14; v++) ph += `<line x1="${X(v)}" y1="${py + 40}" x2="${X(v)}" y2="${py + (v % 7 ? 52 : 62)}" stroke="${C.line}" stroke-width="2"/>`;
  [0, 7, 14].forEach(v => ph += T(X(v), py + 100, String(v), { f: 'mono', size: 28, fill: C.line, a: 'middle' }));
  ph += T(X(14), py - 24, 'SCALA DEL pH', { f: 'mono', size: 24, fill: C.line, ls: 3, a: 'end' });
  g += E(t, W('pi') - 0.6, ph, { dy: 0 });
  const hp = eo((t - W('uno')) / 0.6);
  if (hp > 0) g += `<rect x="${X(1)}" y="${py + 3}" width="${(X(2) - X(1)) * hp}" height="34" rx="4" fill="${C.coral}"/>` + `<path d="M${X(1.5)},${py - 6} L${X(1.5)},${py - 70}" stroke="${C.line}" stroke-width="2" opacity="${hp}"/>`;
  g += E(t, W('uno'), T(X(1.5) + 20, 400, 'pH 1–2', { f: 'pop', size: 84, fill: C.line }));
  return push(t, D, 960, 500, g) + caption(t, W('attaccano'), 'Proteine spezzate', '') + mapInset(2, false);
} }) });

// 5 — duodeno: bile → microgoccioline; il pancreas versa i succhi che completano la digestione
scene('duodeno', { tail: 1.45, make: (W) => ({ capAt: W('microgoccioline'), render(t, D) {
  let s = lightBg(), g = '';
  const shade = mix(C.ivory, C.ink, 0.25);
  g += E(t, -0.4, card(160, 150, 1440, 690, { rot: 0.6 }), { dy: 0 });
  g += E(t, -0.3, T(230, 245, 'Nel duodeno', { f: 'serif', size: 58, fill: C.ink }), { dy: 0 });
  // fegato con cistifellea e bile
  const lv = `<g transform="translate(205,300) scale(0.6) translate(-720,-268)"><path d="${LIVER}" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/><ellipse cx="892" cy="490" rx="16" ry="24" fill="${shade}" stroke="${C.ink}" stroke-width="5"/></g>`;
  g += E(t, 0.1, lv + T(330, 470, 'FEGATO', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3 }), { dy: 8 });
  g += E(t, W('bile'), pill(330, 500, 'BILE', C.ink, C.cream, 'middle') + arrow(400, 525, 548, 525, C.ink, 4), { dy: 6 });
  // tratto di duodeno (pareti) con la goccia di grasso dentro
  g += E(t, 0.0, `<path d="M560,345 L910,345 M560,655 L910,655" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` + T(735, 330, 'DUODENO', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3 }), { dy: 0 });
  const e0 = W('emulsiona'), ep = eo((t - e0) / 1.6), cx = 735, cy = 500;
  let fat = '';
  if (ep < 0.15) fat += `<circle cx="${cx}" cy="${cy}" r="${110 * (1 - ep)}" fill="${shade}" stroke="${C.ink}" stroke-width="3"/>`;
  else for (let i = 0; i < 34; i++) {
    const a = rnd(i) * Math.PI * 2, rr = 30 + rnd(i + 7) * 110;
    fat += `<circle cx="${cx + Math.cos(a) * rr * ep * 1.2}" cy="${cy + Math.sin(a) * rr * ep}" r="${11 + rnd(i + 2) * 5}" fill="${shade}" stroke="${C.ink}" stroke-width="2.5"/>`;
  }
  g += E(t, 0.2, fat, { dy: 0 });
  g += E(t, 0.3, T(cx, 700, 'GRASSI', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 4, w: 700 }), { dy: 0 });
  g += E(t, W('microgoccioline') - 0.1, serifI(cx, 745, 'in microgoccioline'));
  // pancreas → succhi pancreatici
  const bx = 1040, by = 420;
  g += E(t, 0.2, `<g transform="translate(${1080 - 875},${300 - 598})"><path d="${PANC}" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/></g>` + T(1290, 330, 'PANCREAS', { f: 'mono', size: 24, fill: C.ink, ls: 3 }), { dy: 6 });
  g += E(t, W('succhi') - 0.1, arrow(1170, 342, 1170, by - 6, C.ink, 4), { dy: 0 });
  g += E(t, W('succhi'), `<rect x="${bx}" y="${by}" width="470" height="320" rx="14" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>` +
    T(bx + 235, by + 52, 'SUCCHI PANCREATICI', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 3, w: 700 }) + T(bx + 235, by + 95, 'completano la digestione di', { f: 'serif', size: 34, fill: C.ink, a: 'middle', it: true }));
  ['carboidrati', 'proteine', 'grassi'].forEach((n, i) => {
    const y = by + 160 + i * 62;
    g += E(t, W('completano') + i * 0.15, `<rect x="${bx + 60}" y="${y - 34}" width="44" height="44" rx="8" fill="${C.ivory}" stroke="${C.ink}" stroke-width="3"/>` +
      `<path d="M${bx + 70},${y - 12} l10,12 l18,-24" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` + T(bx + 130, y, n, { f: 'popm', size: 38, fill: C.ink }), { dy: 8 });
  });
  s += push(t, D, 880, 490, g) + mapInset(3, true);
  return s + caption(t, W('microgoccioline'), 'Grassi in microgoccioline', 'microgoccioline', true);
} }) });
// 6 — intestino tenue: assorbimento attraverso la parete, verso il sangue
scene('tenue', { tail: 0.6, make: (W) => ({ capAt: W('passano'), render(t, D) {
  let g = '';
  const VX = i => 470 + i * 124, top = 470, base = 640, vy = 760;
  let wall = `<rect x="360" y="${base}" width="1300" height="70" fill="${fillD}"/><line x1="360" y1="${base + 70}" x2="1660" y2="${base + 70}" stroke="${C.line}" stroke-width="3"/>`;
  let vill = `M360,${base}`;
  for (let i = 0; i < 10; i++) { const x = VX(i); vill += ` L${x - 34},${base} L${x - 34},${top + 40} Q${x - 34},${top} ${x},${top} Q${x + 34},${top} ${x + 34},${top + 40} L${x + 34},${base}`; }
  vill += ` L1660,${base}`;
  wall += `<path d="${vill}" fill="${fillD}" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>`;
  for (let i = 0; i < 10; i++) wall += `<line x1="${VX(i)}" y1="${top + 30}" x2="${VX(i)}" y2="${vy - 32}" stroke="${dim}" stroke-width="3" stroke-dasharray="6 8"/>`;
  // vaso sanguigno
  wall += `<rect x="360" y="${vy - 32}" width="1300" height="64" rx="32" fill="${liq}" stroke="${C.line}" stroke-width="3"/>`;
  wall += `<line x1="380" y1="${vy}" x2="1640" y2="${vy}" stroke="${C.line}" stroke-width="3" stroke-dasharray="14 22" stroke-dashoffset="${(-t * 70).toFixed(1)}" opacity="${eo((t - W('passano')) / 0.4) * 0.8}"/>`;
  g += E(t, -0.4, wall, { dy: 0 });
  g += E(t, -0.2, label(120, 560, 'PARETE', 'start') + label(120, 596, 'INTESTINALE', 'start') + label(120, vy + 9, 'SANGUE', 'start'), { dy: 0 });
  // molecole: le piccole attraversano, le grandi restano
  const a0 = W('assorbite');
  for (let i = 0; i < 10; i++) {
    const x0 = 420 + rnd(i) * 1180, y0 = 230 + rnd(i + 20) * 160, vi = Math.min(9, Math.max(0, Math.round((x0 - 470) / 124))), xv = VX(vi);
    const p = clamp((t - a0 - i * 0.12) / 3.2);
    const path = [[x0, y0], [xv, top + 24], [xv, vy], [Math.min(1620, xv + 260 + i * 25), vy]];
    let [x, y] = p > 0 ? along(path, eio(p)) : [x0 + 8 * Math.sin(t * 1.3 + i), y0];
    if (x > 1650) continue;
    const corallo = i === 3;
    g += E(t, 0.1 + i * 0.04, `<circle cx="${x}" cy="${y}" r="11" fill="${corallo ? C.coral : C.bg}" stroke="${corallo ? C.coral : C.line}" stroke-width="3"/>`, { dy: 0 });
  }
  for (let i = 0; i < 3; i++) {
    const x0 = 560 + i * 380 + 20 * Math.sin(t * 0.8 + i), y0 = 290 + i % 2 * 70;
    let d = `M${x0},${y0}`; for (let k = 1; k <= 8; k++) d += ` L${x0 + k * 24},${y0 + (k % 2 ? -14 : 14)}`;
    g += E(t, 0.2, `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`, { dy: 0 });
  }
  g += E(t, W('piccole'), label(420, 200, 'MOLECOLE PIÙ PICCOLE', 'start'), { dy: 0 });
  return push(t, D, 960, 500, g) + caption(t, W('passano'), 'Passano nel sangue', '') + mapInset(4, false);
} }) });

// 7 — intestino crasso: fibre + batteri del microbioma → acidi grassi a catena corta
scene('crasso', { tail: 0.8, make: (W) => ({ capAt: W('fermentano'), render(t, D) {
  let s = lightBg(), g = '';
  g += E(t, -0.4, card(160, 150, 1440, 690, { rot: -0.5 }), { dy: 0 });
  g += E(t, -0.3, T(230, 245, 'Nell’intestino crasso', { f: 'serif', size: 58, fill: C.ink }), { dy: 0 });
  const f0 = W('fermentano'), fp = clamp((t - f0) / 4.5);
  // fibre: si accorciano mentre vengono fermentate
  for (let i = 0; i < 4; i++) {
    const n = Math.max(3, Math.round(16 * (1 - 0.6 * fp))), x0 = 260, y0 = 360 + i * 80;
    let d = `M${x0},${y0}`; for (let k = 1; k <= n; k++) d += ` L${x0 + k * 26},${y0 + (k % 2 ? -12 : 12)}`;
    g += E(t, 0.15 + i * 0.08, `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`, { dy: 6 });
  }
  g += E(t, W('fibre'), T(260, 690, 'FIBRE', { f: 'mono', size: 26, fill: C.ink, ls: 4, w: 700 }) + serifI(260, 735, 'non si digeriscono', C.ink, 'start'), { dy: 6 });
  // batteri (schema): capsule che si muovono tra le fibre
  for (let i = 0; i < 12; i++) {
    const x = 330 + rnd(i) * 380 + 14 * Math.sin(t * 1.6 + i), y = 330 + rnd(i + 30) * 320 + 10 * Math.cos(t * 1.3 + i), a = rnd(i + 5) * 180;
    g += E(t, f0 - 0.2 + i * 0.05, `<rect x="${x - 24}" y="${y - 11}" width="48" height="22" rx="11" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" transform="rotate(${a.toFixed(0)} ${x} ${y})"/>`, { dy: 0, d: 0.35 });
  }
  g += E(t, W('batteri'), pill(1170, 300, 'MILIARDI DI BATTERI', C.ink, C.cream, 'middle') + T(1170, 395, 'microbioma', { f: 'serif', size: 44, fill: C.ink, a: 'middle', it: true }), { dy: 8 });
  // prodotti: acidi grassi a catena corta
  const p0 = W('producendo');
  for (let i = 0; i < 8; i++) {
    const q = eo((t - p0 - i * 0.12) / 0.9); if (q <= 0) continue;
    const x = lerp(720, 920 + (i % 4) * 130, q), y = lerp(500, 470 + Math.floor(i / 4) * 80, q);
    g += `<path d="M${x},${y} l18,-14 l18,14 l18,-14" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="${q}"/>`;
  }
  g += E(t, W('acidi'), T(1170, 640, 'ACIDI GRASSI', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 4, w: 700 }) + T(1170, 680, 'A CATENA CORTA', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 4, w: 700 }), { dy: 6 });
  g += E(t, W('utili') - 0.3, serifI(1170, 740, 'utili al colon'));
  s += push(t, D, 880, 490, g) + mapInset(5, true);
  return s + caption(t, W('fermentano'), 'Fibre fermentate', 'fermentate', true);
} }) });

// 8 — quanto dura: 4–8 ore
scene('tempo', { tail: 1.0, capText: 'Dal boccone alle cellule', make: (W) => ({ capAt: W('cellule'), render(t, D) {
  const bp = (t - W('primo')) / (W('cellule') - W('primo') + 0.4);
  let g = world(t, { lit: 0, bolus: bp >= 1 ? 0.999 : bp });
  let s = push(t, D, 960, 560, g);
  s += E(t, W('quattro') - 0.1, T(1560, 520, '4–8 ore', { f: 'pop', size: 140, fill: C.line, a: 'middle' }));
  s += E(t, W('primo'), serifI(1560, 610, 'dal primo boccone', C.line, 'middle', 40));
  s += E(t, W('cellule') - 0.2, serifI(1560, 660, 'ai nutrienti nelle cellule', C.line, 'middle', 40));
  return s + caption(t, W('cellule'), 'Dal boccone alle cellule', '');
} }) });

// 9 — due grandi categorie di nutrienti
scene('nutrienti', { make: (W) => ({ capAt: W('categorie'), render(t, D) {
  let s = lightBg(), g = '';
  const bolt = (x, y) => `<path d="M${x + 14},${y - 40} L${x - 12},${y + 4} L${x + 4},${y + 4} L${x - 8},${y + 40} L${x + 22},${y - 8} L${x + 6},${y - 8} L${x + 20},${y - 40} z" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
  const bricks = (x, y) => [[-34, 6], [6, 6], [-14, -22]].map(([a, b]) => `<rect x="${x + a}" y="${y + b}" width="38" height="24" rx="3" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`).join('');
  const gear = (x, y) => { let d = ''; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + t * 0.6; d += `<rect x="${x - 6}" y="${y - 38}" width="12" height="16" fill="${C.ink}" transform="rotate(${(a * 180 / Math.PI).toFixed(1)} ${x} ${y})"/>`; } return d + `<circle cx="${x}" cy="${y}" r="26" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="9" fill="none" stroke="${C.ink}" stroke-width="3"/>`; };
  [[200, 'MACRONUTRIENTI', W('macronutrienti')], [1000, 'MICRONUTRIENTI', W('micronutrienti')]].forEach(([x, n, t0], i) => {
    g += E(t, -0.3 + i * 0.15, card(x, 220, 720, 520, { rot: i ? 0.8 : -0.8 }) + T(x + 360, 310, n, { f: 'mono', size: 34, fill: C.ink, a: 'middle', ls: 5, w: 700 }), { dy: 0 });
    g += E(t, t0 - 0.2, `<line x1="${x + 60}" y1="345" x2="${x + 660}" y2="345" stroke="${C.ink}" stroke-width="3"/>`, { dy: 0 });
  });
  g += E(t, 0.2, bolt(300, 445), { dy: 0 }) + E(t, W('danno') - 0.1, T(370, 460, 'energia', { f: 'popm', size: 44, fill: C.ink }), { dy: 8 });
  g += E(t, 0.3, bricks(300, 590), { dy: 0 }) + E(t, W('mattoni') - 0.1, T(370, 610, 'mattoni per i tessuti', { f: 'popm', size: 44, fill: C.ink }), { dy: 8 });
  g += E(t, W('non') - 0.1, bolt(1100, 445) + `<path d="M1066,405 L1134,485 M1134,405 L1066,485" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>` + T(1170, 460, 'niente energia', { f: 'popm', size: 44, fill: C.ink }), { dy: 8 });
  g += E(t, 0.5, gear(1100, 600), { dy: 0 }) + E(t, W('regolano') - 0.1, T(1170, 590, 'regolano migliaia', { f: 'popm', size: 44, fill: C.ink }) + T(1170, 645, 'di reazioni', { f: 'popm', size: 44, fill: C.ink }), { dy: 8 });
  s += push(t, D, 960, 480, g);
  return s + caption(t, W('categorie'), 'Due grandi categorie', 'categorie', true);
} }) });

// 10 — cartello finale
scene('finale', { tail: 3.1, make: (W) => ({ capAt: null, render(t) {
  let s = lightBg();
  s += E(t, -0.4, T(960, 290, 'Mangiare è chimica', { f: 'pop', size: 110, fill: C.ink, a: 'middle' }), { dy: 0 });
  s += E(t, W('biologia') - 0.1, T(960, 400, 'e biologia', { f: 'pop', size: 110, fill: C.ink, a: 'middle' }), { dy: 0 });
  const names = ['bocca', 'stomaco', 'duodeno', 'intestino tenue', 'intestino crasso'];
  let x = 960 - (names.reduce((a, n) => a + tw(n, 'mono', 24) + n.length * 3 + 56, 0) - 16) / 2;
  names.forEach((n, i) => { const w = tw(n, 'mono', 24) + n.length * 3 + 40; s += E(t, 0.1 + i * 0.12, pill(x, 465, n, C.ink, 'none')); x += w + 16; });
  s += words(t, W('e', 1), 960, 640, 'e funziona in modo diverso a seconda di quello che mangi', { f: 'serif', size: 50, fill: C.ink, a: 'middle', it: true, key: 'mangi' });
  s += E(t, W('mangi') + 0.4, `<line x1="760" y1="720" x2="1160" y2="720" stroke="${C.ink}" stroke-width="3"/>` + T(960, 780, 'PROFTECNOLOGIA · MC ALI-2-03', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 5 }));
  return s;
} }) });

let acc = 0; const TL = SCENES.map(s => { const o = { id: s.id, start: acc, D: s.D, L: s.L, voce: s.sc.voce_dur }; acc += s.D; return o; });
window.TIMELINE = { total: acc, scenes: TL };
window.render = function (T0) {
  let i = TL.findIndex(x => T0 < x.start + x.D); if (i < 0) i = TL.length - 1;
  const S = SCENES[i], t = T0 - TL[i].start;
  let body = S.light ? '' : `<rect width="1920" height="1080" fill="${C.bg}"/>`;
  body += S.render(t, S.D);
  if (S.id !== 'finale' && S.id !== 'hook') body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
