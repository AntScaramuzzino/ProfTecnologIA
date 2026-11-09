// La catena del freddo (MC-ALI-2-02 §5). render(t) puro: tutto calcolato da t.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const capAt = def.capAt ?? null, capText = o.capText || sc.didascalia, nWords = capText.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (capAt != null) D = Math.max(D, capAt + 1.0 + 0.3 * nWords + 0.1, capAt + (o.minCap || 0));
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, capAt, capText, capKey: sc.corallo, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

// ---------- mondo: la filiera in sezione, a filo chiaro ----------
const GY = 720, dim = mix(C.bg, C.line, 0.4), soil = mix(C.bg, C.line, 0.07);
const label = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: 24, fill: o.fill || C.line, ls: 3, a: o.a || 'middle', w: o.w });
const lw = s => tw(s, 'mono', 24) + s.length * 3;
const ST = [['PRODUZIONE', 230], ['TRASPORTO', 600], ['MAGAZZINO', 980], ['SUPERMERCATO', 1350], ['CASA', 1720]];
// posizioni del surgelato in ogni anello
const BOX = [[300, 655], [560, 640], [980, 590], [1350, 668], [1712, 668]];
function flake(x, y, r, c = C.line, sw = 3) {
  let s = '';
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI / 3, dx = Math.cos(a) * r, dy = Math.sin(a) * r;
    s += `<line x1="${x - dx}" y1="${y - dy}" x2="${x + dx}" y2="${y + dy}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`;
    [1, -1].forEach(k => { const bx = x + k * dx * 0.6, by = y + k * dy * 0.6, ux = k * dx / r, uy = k * dy / r, h = r * 0.32;
      [0.7, -0.7].forEach(q => { const ca = Math.cos(q), sa = Math.sin(q); s += `<line x1="${bx}" y1="${by}" x2="${bx + h * (ux * ca - uy * sa)}" y2="${by + h * (ux * sa + uy * ca)}" stroke="${c}" stroke-width="${sw - 1}" stroke-linecap="round"/>`; }); });
  }
  return s;
}
// il pacchetto surgelato
function pack(x, y, o = {}) {
  const w = o.w || 46, h = o.h || 32, f = o.fill || C.bg, c = o.c || C.line;
  return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="4" fill="${f}" stroke="${o.stroke || c}" stroke-width="3"/>` + flake(x, y, h * 0.3, o.fc || (f === C.bg ? c : C.bg), 2.5);
}
function stations(t, o = {}) {
  let s = '';
  const st = `stroke="${C.line}" stroke-width="3" fill="${C.bg}" stroke-linejoin="round"`;
  // 1 produzione: capannone a shed con nastro
  s += `<path d="M110,${GY} L110,500 L170,460 L170,500 L230,460 L230,500 L290,460 L290,500 L350,460 L350,${GY}z" ${st}/>`;
  s += `<line x1="140" y1="672" x2="330" y2="672" stroke="${C.line}" stroke-width="3"/>` + [160, 220, 280].map(x => `<circle cx="${x}" cy="684" r="10" fill="none" stroke="${C.line}" stroke-width="2.5"/>`).join('');
  s += `<rect x="135" y="560" width="70" height="60" rx="4" fill="none" stroke="${C.line}" stroke-width="2.5"/>` + flake(170, 590, 18, C.line, 2.5);
  // 2 camion frigorifero
  s += `<rect x="440" y="560" width="240" height="132" rx="6" ${st}/><rect x="650" y="574" width="22" height="40" rx="3" fill="none" stroke="${C.line}" stroke-width="2.5"/>`;
  s += `<path d="M690,692 L690,612 L742,612 L770,650 L770,692z" ${st}/><path d="M700,622 L738,622 L756,648 L700,648z" fill="none" stroke="${C.line}" stroke-width="2.5"/>`;
  s += flake(620, 626, 20, C.line, 2.5);
  [490, 640, 735].forEach(x => s += `<circle cx="${x}" cy="${GY - 6}" r="22" ${st}/><circle cx="${x}" cy="${GY - 6}" r="7" fill="${C.line}"/>`);
  // 3 magazzino con cella frigorifera e scaffali
  s += `<path d="M830,${GY} L830,480 L1130,480 L1130,${GY}z" ${st}/><line x1="815" y1="480" x2="1145" y2="480" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`;
  [540, 610, 680].forEach(y => s += `<line x1="880" y1="${y}" x2="1080" y2="${y}" stroke="${C.line}" stroke-width="3"/>`);
  s += `<line x1="880" y1="520" x2="880" y2="${GY}" stroke="${C.line}" stroke-width="3"/><line x1="1080" y1="520" x2="1080" y2="${GY}" stroke="${C.line}" stroke-width="3"/>`;
  [[910, 524], [1040, 524], [920, 664], [1030, 664]].forEach(([x, y]) => s += pack(x, y, { w: 40, h: 28 }));
  s += flake(1100, 510, 14, C.line, 2.5);
  // 4 supermercato: banco frigorifero a pozzetto sotto una pensilina
  s += `<path d="M1200,500 L1500,500 L1480,540 L1220,540z" ${st}/>` + [1260, 1320, 1380, 1440].map(x => `<line x1="${x}" y1="500" x2="${x - 4}" y2="540" stroke="${C.line}" stroke-width="2.5"/>`).join('');
  s += `<line x1="1215" y1="540" x2="1215" y2="${GY}" stroke="${C.line}" stroke-width="3"/><line x1="1485" y1="540" x2="1485" y2="${GY}" stroke="${C.line}" stroke-width="3"/>`;
  s += `<path d="M1235,${GY} L1235,640 L1465,640 L1465,${GY}z" ${st}/><path d="M1235,640 L1250,612 L1450,612 L1465,640" fill="none" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>`;
  [1280, 1420].forEach(x => s += pack(x, 668, { w: 40, h: 28 }));
  // 5 casa con congelatore
  s += `<path d="M1590,${GY} L1590,540 L1720,450 L1850,540 L1850,${GY}z" ${st}/>`;
  s += `<rect x="1660" y="560" width="110" height="160" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><line x1="1660" y1="620" x2="1770" y2="620" stroke="${C.line}" stroke-width="3"/>`;
  s += `<line x1="1756" y1="580" x2="1756" y2="606" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>` + flake(1690, 590, 12, C.line, 2.5);
  // suolo
  s += `<line x1="60" y1="${GY}" x2="1860" y2="${GY}" stroke="${C.line}" stroke-width="3"/>`;
  // etichette
  ST.forEach(([n, x], i) => {
    const act = o.active === i, w = lw(n) + 28;
    if (o.lit != null && i >= o.lit) return;
    s += `<rect x="${x - w / 2}" y="${752}" width="${w}" height="44" rx="22" fill="${act ? C.ivory : C.bg}" stroke="${C.line}" stroke-width="2"/>` +
      label(x, 783, n, { fill: act ? C.bg : C.line, w: act ? 700 : 500 });
  });
  return s;
}
// catena: maglie lungo la filiera; brk = 0..1 apertura della maglia tra camion e magazzino
const CH = { y: 842, x0: 230, x1: 1720, step: 62 };
function chain(t, p = 1, o = {}) {
  let s = ''; const n = Math.floor((CH.x1 - CH.x0) / CH.step), brk = o.brk || 0, bx = 790;
  for (let i = 0; i <= n; i++) {
    const x = CH.x0 + i * CH.step; if ((x - CH.x0) / (CH.x1 - CH.x0) > p + 0.001) break;
    let dx = 0, rot = 0, col = C.line;
    const near = Math.abs(x - bx) < CH.step * 0.6;
    if (brk > 0) { if (x < bx) dx = -26 * brk; else dx = 26 * brk; if (near) { col = o.bc || C.line; rot = (x < bx ? -1 : 1) * 22 * brk; } }
    const cx = x + dx, horiz = i % 2 === 0;
    const sh = horiz ? `<rect x="${cx - 40}" y="${CH.y - 18}" width="80" height="36" rx="18" fill="none" stroke="${col}" stroke-width="${near && brk > 0 ? 6 : 5}"/>`
      : `<rect x="${cx - 36}" y="${CH.y - 5}" width="72" height="10" rx="5" fill="${col}"/>`;
    s += rot ? `<g transform="rotate(${rot} ${cx} ${CH.y})">${sh}</g>` : sh;
  }
  return s;
}
// tracciato della temperatura del prodotto (in alto); su = più caldo
const TR = { x0: 160, x1: 1800, top: 190, bot: 380, th: 322, cold: 352 };
function track(t, o = {}) {
  let s = `<line x1="${TR.x0}" y1="${TR.top}" x2="${TR.x0}" y2="${TR.bot}" stroke="${C.line}" stroke-width="3"/>` +
    arrow(TR.x0, TR.top + 30, TR.x0, TR.top - 6, C.line, 3) +
    `<line x1="${TR.x0}" y1="${TR.bot}" x2="${TR.x1}" y2="${TR.bot}" stroke="${C.line}" stroke-width="3"/>` +
    T(TR.x0 + 22, TR.top + 6, 'PIÙ CALDO', { f: 'mono', size: 24, fill: C.line, ls: 3 }) +
    T(TR.x0 + 22, TR.bot + 40, 'TEMPERATURA DEL PRODOTTO', { f: 'mono', size: 24, fill: C.line, ls: 3 });
  s += `<line x1="${TR.x0}" y1="${TR.th}" x2="${TR.x1}" y2="${TR.th}" stroke="${C.line}" stroke-width="3" stroke-dasharray="14 10"/>`;
  s += `<rect x="${TR.x1 - 130}" y="${TR.th - 50}" width="130" height="40" fill="${C.bg}"/>` + T(TR.x1, TR.th - 18, '−18 °C', { f: 'mono', size: 30, fill: C.line, a: 'end', w: 700 });
  // traccia: dal produttore fino a xe
  const xs = BOX[0][0], xe = o.xe ?? xs;
  if (xe > xs) {
    let d = `M${xs},${TR.cold} L${Math.min(xe, o.bumpX ?? 1e9)},${TR.cold}`;
    if (o.bump > 0) { const bx = o.bumpX, q = o.bump; const yp = lerp(TR.cold, TR.top + 26, q); d += ` C${bx + 30},${TR.cold} ${bx + 20},${yp} ${bx + 60},${yp} L${bx + 60 + 110 * q},${yp}`; }
    s += `<path d="${d}" fill="none" stroke="${C.ivory}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return s;
}
function along(pts, p) {
  p = clamp(p); const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  let d = p * tot;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const q = seg[i] ? d / seg[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; } d -= seg[i]; }
}
// spostamento del pacchetto tra due anelli, con un piccolo arco
function hop(a, b, q) { q = eio(q); const [x1, y1] = BOX[a], [x2, y2] = BOX[b]; return [lerp(x1, x2, q), lerp(y1, y2, q) - Math.sin(q * Math.PI) * 90]; }

// ---------- microrganismi (bastoncelli a filo) ----------
function bug(x, y, a, o = {}) {
  const w = o.w || 64, h = 26, c = o.c || C.ink, el = o.el || 0, ww = w * (1 + 0.7 * el);
  const body = (dx, ww2) => `<rect x="${dx - ww2 / 2}" y="${-h / 2}" width="${ww2}" height="${h}" rx="${h / 2}" fill="${o.fill || 'none'}" stroke="${c}" stroke-width="3"${o.dash ? ' stroke-dasharray="7 7"' : ''}/>`;
  let s = '';
  if (o.split > 0) { const sp = o.split * w * 0.55; s += body(-sp, w) + body(sp, w); }
  else s += body(0, ww) + (el > 0.5 ? `<line x1="0" y1="${-h / 2 + 3}" x2="0" y2="${h / 2 - 3}" stroke="${c}" stroke-width="3" opacity="${((el - 0.5) * 2).toFixed(2)}"/>` : '');
  if (!o.dash && o.tail !== false) s += `<path d="M${-ww / 2},0 q-14,-10 -26,0 t-24,0" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`;
  return `<g transform="translate(${x},${y}) rotate(${a})">${s}</g>`;
}
// colonia: 2 → 4 → 8, divisione per generazioni (disegno di esempio)
const GEN = (() => {
  const g0 = [[-150, -40, 20], [140, 50, -25]], all = [g0];
  for (let k = 0; k < 2; k++) {
    const prev = all[all.length - 1], nx = [];
    prev.forEach(([x, y, a], i) => { const r = 160 / (k + 1.3), ang = (a + 90 + i * 47 + k * 31) * Math.PI / 180; nx.push([x - Math.cos(ang) * r * 0.5, y - Math.sin(ang) * r * 0.5, a + 30], [x + Math.cos(ang) * r * 0.5, y + Math.sin(ang) * r * 0.5, a - 25]); });
    all.push(nx);
  }
  return all;
})();
function colony(cx, cy, t, o = {}) {
  // o.g: generazione continua 0..2 ; o.dorm: 0..1 quanto sono "addormentati"
  const g = clamp(o.g || 0, 0, 2), k = Math.min(1, Math.floor(g)), q = g - Math.floor(g);
  const gi = Math.floor(g) >= 2 ? 2 : Math.floor(g); let s = '';
  const wig = o.wig ?? 1;
  if (gi === 2) GEN[2].forEach(([x, y, a], i) => s += bug(cx + x, cy + y + wig * 3 * Math.sin(t * 3 + i), a, { c: o.c, fill: o.fill, dash: o.dorm > 0.5 }));
  else GEN[gi].forEach(([x, y, a], i) => {
    const ch = GEN[gi + 1].slice(i * 2, i * 2 + 2);
    if (q < 0.55) s += bug(cx + x, cy + y + wig * 3 * Math.sin(t * 3 + i), a, { c: o.c, fill: o.fill, el: q / 0.55, dash: o.dorm > 0.5 });
    else { const p = eo((q - 0.55) / 0.45); ch.forEach(([x2, y2, a2]) => s += bug(cx + lerp(x, x2, p), cy + lerp(y, y2, p), lerp(a, a2, p), { c: o.c, fill: o.fill })); }
  });
  return s;
}
function lens(cx, cy, r, inner, ink) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.cream}" stroke="${ink}" stroke-width="4"/><clipPath id="lc"><circle cx="${cx}" cy="${cy}" r="${r - 4}"/></clipPath><g clip-path="url(#lc)">${inner}</g>`;
}

// ================= SCENE =================

// 1 — il viaggio: dal produttore al freezer di casa
scene('hook', { L: 0.6, make: (W) => ({ capAt: W('mezzo'), render(t) {
  let s = '';
  const fac = `<g transform="translate(250,560) scale(0.85) translate(-230,-600)"><path d="M110,${GY} L110,500 L170,460 L170,500 L230,460 L230,500 L290,460 L290,500 L350,460 L350,${GY}z" fill="${C.bg}" stroke="${C.line}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<rect x="135" y="560" width="70" height="60" rx="4" fill="none" stroke="${C.line}" stroke-width="3"/>${flake(170, 590, 18, C.line, 2.5)}</g>`;
  const hou = `<g transform="translate(1670,560) scale(0.85) translate(-1720,-600)"><path d="M1590,${GY} L1590,540 L1720,450 L1850,540 L1850,${GY}z" fill="${C.bg}" stroke="${C.line}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<rect x="1660" y="560" width="110" height="160" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><line x1="1660" y1="620" x2="1770" y2="620" stroke="${C.line}" stroke-width="3"/>${flake(1690, 590, 12, C.line, 2.5)}</g>`;
  s += E(t, W('produttore') - 0.3, fac + label(250, 740, 'PRODUTTORE'));
  s += E(t, W('casa') - 0.3, hou + label(1670, 740, 'CASA TUA'));
  // il pacchetto, grande, al centro
  s += E(t, -0.4, `<g transform="translate(960,370)"><rect x="-190" y="-120" width="380" height="240" rx="16" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>` +
    `<line x1="-190" y1="70" x2="190" y2="70" stroke="${C.line}" stroke-width="3"/>${flake(0, -15, 62, C.line, 5)}</g>` + T(960, 560, 'SURGELATO', { f: 'mono', size: 28, fill: C.line, a: 'middle', ls: 6, w: 700 }), { dy: 0 });
  // percorso tratteggiato che si disegna
  const p = eo((t - W('arriva') + 0.2) / 1.8);
  if (p > 0) {
    const x1 = 370, x2 = 1550, xe = lerp(x1, x2, p);
    s += `<path d="M${x1},640 L${xe},640" stroke="${C.line}" stroke-width="4" stroke-dasharray="4 16" stroke-linecap="round"/>`;
    if (p < 1) s += `<circle cx="${xe}" cy="640" r="9" fill="${C.line}"/>`; else s += arrow(x2 - 20, 640, x2 + 10, 640, C.line, 4);
  }
  return s;
} }) });

// 2 — la regola: −18 °C o meno, dall'inizio alla fine (corallo: −18 °C)
scene('regola', { minCap: 2.5, make: (W) => ({ capAt: W("dall'inizio"), render(t) {
  let s = lightBg();
  s += E(t, -0.4, card(260, 150, 1400, 640, { rot: -1 }), { dy: 0 });
  s += E(t, -0.3, T(340, 250, 'Per tutto il viaggio il prodotto deve restare a', { f: 'serif', size: 56, fill: C.ink }));
  s += E(t, W('meno') - 0.1, T(960, 470, '−18 °C', { f: 'pop', size: 220, fill: C.coral, a: 'middle' }));
  s += E(t, W('o') - 0.05, T(960, 560, 'o più freddo', { f: 'serif', size: 72, fill: C.ink, a: 'middle', it: true }));
  const p = eo((t - W("dall'inizio") + 0.1) / 0.9);
  if (p > 0) {
    const x1 = 440, x2 = 1480;
    s += E(t, W("dall'inizio") - 0.1, `<rect x="${x1 - 120}" y="626" width="240" height="50" rx="25" fill="none" stroke="${C.ink}" stroke-width="2.5"/>` + T(x1, 660, 'PRODUZIONE', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 2 }), { dy: 0 });
    s += `<line x1="${x1 + 130}" y1="651" x2="${lerp(x1 + 130, x2 - 160, p)}" y2="651" stroke="${C.ink}" stroke-width="4"/>`;
    if (p >= 1) s += arrow(x2 - 190, 651, x2 - 156, 651, C.ink, 4);
    s += E(t, W('fine') - 0.1, `<rect x="${x2 - 150}" y="626" width="300" height="50" rx="25" fill="none" stroke="${C.ink}" stroke-width="2.5"/>` + T(x2, 660, 'FREEZER DI CASA', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 2 }), { dy: 0 });
  }
  return s;
} }) });

// 3 — catena del freddo: la filiera completa e la catena sotto (corallo: "freddo" nella didascalia)
scene('nome', { make: (W) => ({ capAt: W('catena') - 0.1, render(t) {
  let s = E(t, -0.4, stations(t), { dy: 0 });
  s += chain(t, eo((t - W('catena') + 0.3) / 1.0));
  s += E(t, W('continuità') - 0.2, track(t, { xe: 1712 }), { dy: 0 });
  return s;
} }) });

// 4 — il viaggio lungo gli anelli (corallo: il pacchetto)
scene('viaggio', { tail: 1.4, make: (W) => ({ capAt: W('sistema') - 0.2, render(t) {
  const legs = [W('trasporto') - 0.3, W('celle') - 0.2, W('banchi') - 0.2, W('fino') - 0.6];
  let pos = BOX[0], act = 0;
  legs.forEach((t0, i) => { const q = clamp((t - t0) / 0.9); if (q > 0) { pos = hop(i, i + 1, q); act = q > 0.5 ? i + 1 : i; } });
  let s = stations(t, { active: act }) + chain(t, 1) + track(t, { xe: pos[0] });
  s += pack(pos[0], pos[1], { fill: C.coral, stroke: C.line, fc: C.bg });
  return s;
} }) });

// 5 — la catena si interrompe (corallo: la maglia aperta)
scene('interrotta', { tail: 1.9, make: (W) => ({ capAt: W('anche'), render(t) {
  const br = eo((t - W('interrompersi')) / 0.6), bump = eo((t - W('poche') + 0.3) / 1.2);
  let s = stations(t, { active: -1 }) + chain(t, 1, { brk: br, bc: C.coral }) + track(t, { xe: 790, bumpX: 740, bump });
  // il pacchetto resta fermo fuori, tra camion e magazzino
  const [x, y] = along([BOX[1], [790, 610], [790, GY - 17]], eo((t - W('interrompersi') + 0.2) / 0.8));
  s += pack(x, y);
  s += E(t, W('poche') + 0.4, T(940, TR.top + 40, 'si scongela', { f: 'serif', size: 48, fill: C.line, it: true }) +
    `<rect x="${1160}" y="${TR.top + 6}" width="${lw('ESEMPIO') + 24}" height="40" rx="6" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` + T(1172, TR.top + 35, 'ESEMPIO', { f: 'mono', size: 24, fill: C.line, ls: 3 }), { dy: 0 });
  return s;
} }) });

// 6 — si risvegliano e si moltiplicano (registro chiaro, lente)
scene('risveglio', { tail: 1.7, make: (W) => ({ capAt: W('iniziano'), render(t, D) {
  let s = lightBg();
  s += E(t, -0.4, card(250, 150, 1420, 680, { rot: 1 }), { dy: 0 });
  const awake = eo((t - W('risvegliano')) / 0.5), g = clamp((t - W('moltiplicarsi') + 0.3) / 0.75, 0, 2);
  let inner = colony(780, 490, t, { g, dorm: 1 - awake, c: C.ink, wig: awake });
  s += E(t, -0.3, lens(780, 490, 270, inner, C.ink), { dy: 0 });
  s += E(t, -0.2, `<line x1="971" y1="681" x2="1070" y2="780" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/>`, { dy: 0 });
  s += E(t, W('microrganismi') - 0.1, T(1130, 330, 'MICRORGANISMI', { f: 'mono', size: 30, fill: C.ink, ls: 4, w: 700 }));
  s += E(t, W('risvegliano') - 0.1, T(1130, 420, 'si risvegliano', { f: 'serif', size: 60, fill: C.ink, it: true }));
  s += E(t, W('moltiplicarsi') - 0.1, T(1130, 510, 'e si moltiplicano', { f: 'serif', size: 60, fill: C.ink, it: true }));
  s += E(t, 0.3, T(1130, 760, 'DISEGNO DI ESEMPIO', { f: 'mono', size: 24, fill: C.ink, ls: 3 }));
  return s;
} }) });

// 7 — ricongelati: congelati ma vivi
scene('vivi', { make: (W) => ({ capAt: W('congelati'), render(t) {
  let s = lightBg();
  s += E(t, -0.4, card(250, 150, 1420, 680, { rot: -1 }), { dy: 0 });
  const ice = eo((t - W('ricongelato')) / 0.6), thaw = eo((t - W('scongelazione')) / 0.8);
  const cx = 720, cy = 480;
  let cube = `<rect x="${cx - 300}" y="${cy - 260}" width="600" height="520" rx="40" fill="${mix(C.cream, '#FFFFFF', 0.5)}" stroke="${C.ink}" stroke-width="4"${thaw > 0.5 ? ' stroke-dasharray="18 12"' : ''}/>`;
  s += E(t, -0.2, `<rect x="${cx - 300}" y="${cy - 260}" width="600" height="520" rx="40" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="6 10"/>`, { dy: 0 });
  if (ice > 0) s += `<g opacity="${ice.toFixed(3)}">${cube}</g>`;
  s += colony(cx, cy, t, { g: 2, c: C.ink, wig: thaw });
  if (ice > 0) s += `<g opacity="${(ice * (1 - thaw)).toFixed(3)}">${flake(cx + 230, cy - 190, 34, C.ink, 4)}${flake(cx - 220, cy + 200, 26, C.ink, 3.5)}</g>`;
  s += E(t, W('ricongelato') - 0.1, T(1070, 330, 'RICONGELATO', { f: 'mono', size: 30, fill: C.ink, ls: 4, w: 700 }));
  s += E(t, W('congelati') - 0.1, T(1070, 420, 'congelati,', { f: 'serif', size: 64, fill: C.ink, it: true }));
  s += E(t, W('vivi') - 0.1, T(1070, 500, 'ma vivi', { f: 'serif', size: 64, fill: C.ink, it: true }));
  s += E(t, W('pronti') - 0.1, T(1070, 600, 'pronti a ripartire alla', { f: 'popm', size: 34, fill: C.ink }) + T(1070, 646, 'scongelazione successiva', { f: 'popm', size: 34, fill: C.ink }));
  return s;
} }) });

// 8 — l'avviso sulla confezione (corallo: il riquadro dell'avviso)
scene('avviso', { make: (W) => ({ capAt: W('non'), render(t) {
  let s = '';
  const g = `<g transform="translate(960,430)"><rect x="-430" y="-280" width="860" height="560" rx="24" fill="${C.bg}" stroke="${C.line}" stroke-width="5"/>` +
    `${flake(-280, -140, 70, C.line, 5)}<line x1="-430" y1="10" x2="430" y2="10" stroke="${C.line}" stroke-width="3"/>` +
    `<text x="-150" y="-150" font-family="Mono" font-size="34" fill="${C.line}" letter-spacing="6" font-weight="700">SURGELATO</text>` +
    `<text x="-150" y="-100" font-family="Mono" font-size="26" fill="${C.line}" letter-spacing="4">CONSERVARE A −18 °C</text></g>`;
  s += E(t, -0.4, g, { dy: 0 });
  const p = eo((t - W("l'avviso") + 0.1) / 0.5);
  if (p > 0) s += `<rect x="${590}" y="${470}" width="${740 * p}" height="200" rx="14" fill="none" stroke="${C.coral}" stroke-width="6"/>`;
  s += words(t, W('non'), 960, 556, 'NON RICONGELARE', { f: 'mono', size: 52, a: 'middle', w: 700, ls: 4 });
  s += words(t, W('dopo'), 960, 622, 'dopo lo scongelamento', { f: 'mono', size: 34, a: 'middle', ls: 2 });
  s += E(t, W('non', 1) - 0.1, T(960, 790, 'non perché diventi subito pericoloso,', { f: 'serif', size: 44, fill: C.line, a: 'middle', it: true }));
  s += E(t, W('ma') - 0.1, T(960, 848, 'ma perché uno scongelamento sbagliato può favorire i microrganismi', { f: 'serif', size: 44, fill: C.line, a: 'middle', it: true }));
  return s;
} }) });

// 9 — secondo congelamento: non li elimina, la qualità può peggiorare
scene('secondo', { make: (W) => ({ capAt: W('elimina'), render(t) {
  let s = lightBg();
  s += E(t, -0.4, T(240, 210, 'Un secondo congelamento…', { f: 'serif', size: 64, fill: C.ink }), { dy: 0 });
  // scheda 1: microrganismi prima e dopo, stessi
  let c1 = card(220, 270, 840, 500, { rot: -1 }) + T(270, 340, 'MICRORGANISMI', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 });
  const inner1 = (x, lab) => `<rect x="${x}" y="380" width="300" height="240" rx="18" fill="none" stroke="${C.ink}" stroke-width="3"/>` +
    `<g transform="translate(${x + 150},500) scale(0.42)">${colony(0, 0, 0, { g: 2, c: C.ink, wig: 0 })}</g>` + T(x + 150, 660, lab, { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 2 });
  c1 += inner1(270, 'PRIMA') + inner1(700, 'DOPO');
  c1 += arrow(590, 500, 680, 500, C.ink, 4) + flake(635, 455, 18, C.ink, 3);
  s += E(t, -0.1, c1);
  s += E(t, W('elimina') - 0.1, T(640, 735, 'non vengono eliminati', { f: 'serif', size: 44, fill: C.ink, a: 'middle', it: true }));
  // scheda 2: qualità
  let c2 = card(1120, 270, 580, 500, { rot: 1.5 }) + T(1170, 340, 'QUALITÀ', { f: 'mono', size: 28, fill: C.ink, ls: 3, w: 700 });
  c2 += `<line x1="1410" y1="400" x2="1410" y2="610" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/><path d="M1360,580 L1410,650 L1460,580" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
  c2 += T(1410, 735, 'può peggiorare', { f: 'serif', size: 44, fill: C.ink, a: 'middle', it: true });
  s += E(t, W('peggiorare') - 0.3, c2);
  return s;
} }) });

// 10 — i segnali di una catena interrotta
scene('segnali', { make: (W) => ({ capAt: W('interrotta'), render(t) {
  let s = lightBg();
  s += E(t, -0.4, T(240, 200, 'Come riconosci una catena interrotta?', { f: 'serif', size: 60, fill: C.ink }), { dy: 0 });
  const items = [['BRINA IN ECCESSO', 'grandi cristalli di ghiaccio', W('brina')], ['PRODOTTO AMMASSATO', 'scongelato e ricongelato', W('prodotto')], ['CONFEZIONE GONFIA', 'gas dei microrganismi', W('confezione')]];
  items.forEach(([n, note, t0], i) => {
    const x = 200 + i * 520, y = 250, bx = x + 240, by = y + 250;
    let c = card(x, y, 480, 520, { rot: [-1.5, 1, -1][i] }) + T(x + 36, y + 70, `${i + 1}`, { f: 'serif', size: 64, fill: C.ink, it: true });
    let inner = T(x + 84, y + 64, n, { f: 'mono', size: 26, fill: C.ink, ls: 2, w: 700 });
    if (i === 0) {
      inner += `<rect x="${bx - 130}" y="${by - 90}" width="260" height="180" rx="12" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`;
      [[-70, -40, 34], [40, -50, 28], [80, 40, 38], [-60, 50, 30], [0, 5, 24]].forEach(([dx, dy, r], k) => inner += pop(t, t0 + 0.2 + k * 0.12, bx + dx, by + dy, flake(bx + dx, by + dy, r, C.ink, 4)));
    }
    if (i === 1) {
      inner += `<path d="M${bx - 120},${by - 100} L${bx + 120},${by - 100} L${bx + 130},${by + 100} L${bx - 130},${by + 100}z" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
      const m = eo((t - t0 - 0.4) / 1.2);
      [[-80, -40], [-20, -55], [50, -35], [-60, 30], [10, 20], [75, 40], [-10, 70]].forEach(([dx, dy], k) => inner += `<circle cx="${bx + dx * (1 - 0.55 * m)}" cy="${by + dy * (1 - 0.55 * m) + 10 * m}" r="26" fill="${C.ivory}" stroke="${C.ink}" stroke-width="3"/>`);
    }
    if (i === 2) {
      const sw = eo((t - t0 - 0.3) / 1.6), hh = lerp(22, 90, sw), b = 46 * sw;
      inner += `<path d="M${bx - 120},${by - hh} Q${bx},${by - hh - b * 2} ${bx + 120},${by - hh} Q${bx + 120 + b},${by} ${bx + 120},${by + hh} Q${bx},${by + hh + b * 2} ${bx - 120},${by + hh} Q${bx - 120 - b},${by} ${bx - 120},${by - hh}z" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
      [[-60, -0.5, 12], [20, -0.6, 9], [70, 0.3, 14], [-25, 0.5, 10], [10, 0.05, 8]].forEach(([dx, fy, r], k) => { const q = clamp((sw - k * 0.12) / 0.4); if (q > 0) inner += `<circle cx="${bx + dx}" cy="${by + fy * (hh + b) * 0.8 - 6 * Math.sin(t * 2 + k)}" r="${(r * q).toFixed(1)}" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`; });
    }
    inner += T(x + 240, y + 460, note, { f: 'serif', size: 36, fill: C.ink, a: 'middle', it: true });
    s += E(t, 0.1 + i * 0.15, c) + E(t, t0 - 0.1, inner);
  });
  return s;
} }) });

// 11 — cartello finale
scene('finale', { tail: 3.2, make: (W) => ({ capAt: null, render(t) {
  let s = lightBg();
  s += E(t, -0.4, T(960, 330, 'La catena del freddo', { f: 'pop', size: 116, fill: C.ink, a: 'middle' }), { dy: 0 });
  s += words(t, W('meno'), 960, 470, '−18 °C, senza interruzioni,', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: 'interruzioni,' });
  s += words(t, W('dalla'), 960, 560, 'dalla produzione al tuo freezer', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true });
  s += E(t, W('freezer') + 0.4, `<line x1="760" y1="660" x2="1160" y2="660" stroke="${C.ink}" stroke-width="3"/>` + T(960, 720, 'PROFTECNOLOGIA · MC ALI-2-02', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5 }));
  return s;
} }) });

// ---- timeline ----
let acc = 0; const TL = SCENES.map(s => { const o = { id: s.id, start: acc, D: s.D, L: s.L, voce: s.sc.voce_dur }; acc += s.D; return o; });
window.TIMELINE = { total: acc, scenes: TL };
window.render = function (T0) {
  let i = TL.findIndex(x => T0 < x.start + x.D); if (i < 0) i = TL.length - 1;
  const S = SCENES[i], t = T0 - TL[i].start;
  let body = `<rect width="1920" height="1080" fill="${S.light ? C.ivory : C.bg}"/>`;
  const k = 1 + 0.025 * t / S.D;
  body += `<g transform="translate(960,540) scale(${k.toFixed(5)}) translate(-960,-540)">${S.render(t, S.D)}</g>`;
  if (S.capAt != null) body += caption(t, S.capAt, S.capText, S.capKey, S.light);
  if (S.id !== 'finale' && S.id !== 'hook') body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
