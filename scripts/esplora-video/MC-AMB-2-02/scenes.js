// L'impianto di riscaldamento — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.35);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.hold != null) D = Math.max(D, def.hold + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="${C.lineDim}" stroke-width="3"/></pattern>
<pattern id="hatchC" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="16" stroke="${C.coral}" stroke-width="5"/></pattern></defs>`;

const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.line, ls: 3, a: o.a || 'middle', w: 600 });
function pillTag(x, y, s, ink, bg, a = 'start', size = 26) {
  const w = tw(s, 'mono', size) + 44 + s.length * 2, x0 = a === 'middle' ? x - w / 2 : a === 'end' ? x - w : x;
  return `<rect x="${x0}" y="${y - 34}" width="${w}" height="50" rx="25" fill="${bg}" stroke="${ink}" stroke-width="2"/>` + T(x0 + w / 2, y, s, { f: 'mono', size, fill: ink, a: 'middle', ls: 2, w: 600 });
}
const B = () => C.bg, LN = () => C.line;

// ---------- elementi dell'impianto ----------
// tubo in sezione: guaina chiara + anima scura + flusso tratteggiato che scorre nel verso del percorso
function pipe(d, t, o = {}) {
  const ink = o.ink || C.line, fc = o.flowC || ink, v = o.v ?? 90;
  let s = `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${o.w || 18}" stroke-linejoin="round" stroke-linecap="round"/>`;
  s += `<path d="${d}" fill="none" stroke="${C.bg}" stroke-width="${(o.w || 18) - 7}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const fl = o.flow ?? 1;
  if (fl > 0) s += `<path d="${d}" fill="none" stroke="${fc}" stroke-width="5" stroke-linecap="round" stroke-dasharray="12 22" stroke-dashoffset="${(-(o.tf ?? t) * v).toFixed(1)}" opacity="${fl.toFixed(3)}"/>`;
  return s;
}
function flame(cx, cy, k, t, c) {
  const f = 1 + 0.06 * Math.sin(t * 13) + 0.04 * Math.sin(t * 7.3);
  return `<g transform="translate(${cx},${cy}) scale(${(k * f).toFixed(3)},${(k / f).toFixed(3)})"><path d="M0,22 C-20,22 -24,4 -14,-8 C-10,-2 -6,0 -4,-4 C-6,-16 0,-26 6,-32 C6,-20 18,-12 18,4 C18,16 10,22 0,22 z" fill="none" stroke="${c}" stroke-width="${3 / k}" stroke-linejoin="round"/></g>`;
}
function boiler(x, y, t, o = {}) { // x,y = angolo in alto a sinistra; 240 x 260
  const ink = o.ink || C.line;
  let s = `<rect x="${x}" y="${y}" width="240" height="260" rx="16" fill="${mix(C.bg, ink, 0.06)}" stroke="${ink}" stroke-width="4"/>`;
  s += `<rect x="${x + 30}" y="${y + 26}" width="180" height="56" rx="8" fill="${C.bg}" stroke="${ink}" stroke-width="3"/>`;
  if (o.disp) s += T(x + 120, y + 64, o.disp, { f: 'mono', size: 28, fill: o.dispC || ink, a: 'middle', w: 700 });
  s += `<circle cx="${x + 120}" cy="${y + 172}" r="44" fill="${C.bg}" stroke="${ink}" stroke-width="3"/>`;
  if ((o.on ?? 1) > 0) s += `<g opacity="${(o.on ?? 1).toFixed(3)}">${flame(x + 120, y + 178, 1.25, t, ink)}</g>`;
  return s;
}
function pump(cx, cy, t, run = 1) {
  const a = t * 260 * run;
  let s = `<circle cx="${cx}" cy="${cy}" r="30" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
  s += `<g transform="rotate(${a.toFixed(1)} ${cx} ${cy})">` + [0, 1, 2].map(i => { const q = i * 2.094; return `<line x1="${cx}" y1="${cy}" x2="${cx + 20 * Math.cos(q)}" y2="${cy + 20 * Math.sin(q)}" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`; }).join('') + '</g>';
  return s;
}
function radiator(x, y, w, h, o = {}) {
  const ink = o.ink || C.line, n = o.n || 8, cw = w / n;
  let s = '';
  for (let i = 0; i < n; i++) s += `<rect x="${x + i * cw + 3}" y="${y}" width="${cw - 6}" height="${h}" rx="${(cw - 6) / 2.2}" fill="${o.fill || mix(C.bg, ink, 0.08)}" stroke="${ink}" stroke-width="${o.sw || 3.5}"/>`;
  s += `<line x1="${x}" y1="${y + 14}" x2="${x + w}" y2="${y + 14}" stroke="${ink}" stroke-width="${o.sw || 3.5}"/><line x1="${x}" y1="${y + h - 14}" x2="${x + w}" y2="${y + h - 14}" stroke="${ink}" stroke-width="${o.sw || 3.5}"/>`;
  return s;
}
// aria calda che sale da un radiatore: tre linee ondulate che salgono
function heatRise(x, y, w, t, op, c = C.line) {
  if (op <= 0) return '';
  let s = '';
  for (let i = 0; i < 3; i++) {
    const xx = x + w * (0.22 + i * 0.28), ph = (t * 1.6 + i * 0.37) % 1;
    s += `<g opacity="${(op * Math.sin(Math.PI * ph)).toFixed(3)}">` + wave(xx, y - 20 - ph * 40, xx, y - 120 - ph * 40, 1, { lam: 34, A: 6, ph: t * 6, c, sw: 3, head: false }) + '</g>';
  }
  return s;
}
function valve(cx, cy, o = {}) { // simbolo a farfalla + testa termostatica
  const ink = o.ink || C.line, cl = o.closed || 0;
  let s = `<path d="M${cx - 22},${cy - 18} L${cx + 22},${cy + 18} L${cx + 22},${cy - 18} L${cx - 22},${cy + 18} z" fill="${C.bg}" stroke="${ink}" stroke-width="4" stroke-linejoin="round" transform="rotate(90 ${cx} ${cy})"/>`;
  s += `<line x1="${cx}" y1="${cy}" x2="${cx + 44}" y2="${cy}" stroke="${ink}" stroke-width="4"/>`;
  s += `<g transform="rotate(${(cl * 90).toFixed(1)} ${cx + 66} ${cy})"><rect x="${cx + 44}" y="${cy - 22}" width="44" height="44" rx="10" fill="${mix(C.bg, ink, 0.12)}" stroke="${ink}" stroke-width="4"/><line x1="${cx + 66}" y1="${cy - 14}" x2="${cx + 66}" y2="${cy + 14}" stroke="${ink}" stroke-width="4" stroke-linecap="round"/></g>`;
  return s;
}
function thermostat(x, y, o = {}) { // centro
  const ink = o.ink || C.line;
  let s = `<rect x="${x - 34}" y="${y - 46}" width="68" height="92" rx="12" fill="${C.bg}" stroke="${ink}" stroke-width="${o.sw || 4}"/>`;
  s += `<circle cx="${x}" cy="${y + 10}" r="20" fill="none" stroke="${ink}" stroke-width="3"/><line x1="${x}" y1="${y + 10}" x2="${x + 10}" y2="${y - 2}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
  s += `<rect x="${x - 20}" y="${y - 36}" width="40" height="14" rx="4" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
  return s;
}
function sun(x, y, t) {
  let s = `<circle cx="${x}" cy="${y}" r="46" fill="${mix(C.bg, C.line, 0.12)}" stroke="${C.line}" stroke-width="3"/>`;
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2 + t * 0.15, r1 = 62, r2 = 80 + 4 * Math.sin(t * 2 + i);
    s += `<line x1="${x + r1 * Math.cos(a)}" y1="${y + r1 * Math.sin(a)}" x2="${x + r2 * Math.cos(a)}" y2="${y + r2 * Math.sin(a)}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
  }
  return s;
}

// ---------- la casa in sezione con l'impianto ----------
const G = { x0: 150, x1: 1770, ceil: 222, floor: 800, p1: 660, p2: 1200, sup: 292, ret: 752,
  r1: [770, 1010], r2: [1330, 1570], ry: 560, rh: 150, bx: 250, by: 360, pumpX: 570, thX: 1680, thY: 430 };
function house(o = {}) {
  const ink = C.line, wl = 26; let s = '';
  // solaio e pavimento (sezione tratteggiata)
  s += `<rect x="${G.x0 - wl}" y="${G.ceil - 30}" width="${G.x1 - G.x0 + 2 * wl}" height="30" fill="url(#hatch)" stroke="${ink}" stroke-width="3"/>`;
  s += `<rect x="${G.x0 - wl}" y="${G.floor}" width="${G.x1 - G.x0 + 2 * wl}" height="34" fill="url(#hatch)" stroke="${ink}" stroke-width="3"/>`;
  // muri esterni (con finestra a destra)
  s += `<rect x="${G.x0 - wl}" y="${G.ceil}" width="${wl}" height="${G.floor - G.ceil}" fill="url(#hatch)" stroke="${ink}" stroke-width="3"/>`;
  s += `<rect x="${G.x1}" y="${G.ceil}" width="${wl}" height="${380 - G.ceil}" fill="url(#hatch)" stroke="${ink}" stroke-width="3"/>`;
  s += `<rect x="${G.x1}" y="600" width="${wl}" height="${G.floor - 600}" fill="url(#hatch)" stroke="${ink}" stroke-width="3"/>`;
  s += `<line x1="${G.x1 + 8}" y1="380" x2="${G.x1 + 8}" y2="600" stroke="${ink}" stroke-width="2"/><line x1="${G.x1 + 18}" y1="380" x2="${G.x1 + 18}" y2="600" stroke="${ink}" stroke-width="2"/>`;
  // tramezzi
  [G.p1, G.p2].forEach(x => s += `<rect x="${x - 9}" y="${G.ceil}" width="18" height="${G.floor - G.ceil}" fill="${mix(C.bg, ink, 0.1)}" stroke="${ink}" stroke-width="2.5"/>`);
  return s;
}
const SUP_MAIN = () => `M${G.bx + 60},${G.by} V${G.sup} H${G.r1[0] + 10} V${G.ry}`;
const SUP_B1 = () => `M${G.r1[0] + 10},${G.sup} V${G.ry}`;
const SUP_B2 = () => `M${G.r1[0] + 10},${G.sup} H${G.r2[0] + 10} V${G.ry}`;
const SIG = () => [[G.thX, G.thY - 46], [G.thX, 150], [200, 150], [200, G.by + 90], [G.bx, G.by + 90]];
// frecce sul ritorno, verso la caldaia
function retArrows(c = C.line) { return [[1460, G.ret, -1, 0], [880, G.ret, -1, 0], [G.bx + 180, G.ret - 70, 0, -1]].map(([x, y, dx, dy]) => `<path d="M${x + dx * 16},${y + dy * 16} L${x - dx * 10 - dy * 14},${y - dy * 10 + dx * 14} L${x - dx * 10 + dy * 14},${y - dy * 10 - dx * 14} z" fill="${c}" stroke="${C.bg}" stroke-width="2"/>`).join(''); }
const RET_B2 = () => `M${G.r2[1] - 10},${G.ry + G.rh} V${G.ret} H${G.r1[1] - 10}`;
const RET_MAIN = () => `M${G.r1[1] - 10},${G.ry + G.rh} V${G.ret} H${G.bx + 180} V${G.by + 260}`;
// o: hotC (andata), retC (ritorno), on (fiamma), flow, flow2 (ramo stanza 2), heat1, heat2, thermoC, signal, valves, valve2C, valve2, disp
function plant(t, o = {}) {
  const hot = o.hotC || C.coral, ret = o.retC || C.line, fl = o.flow ?? 1, f2 = (o.flow2 ?? 1) * fl, tf = o.tf;
  // ramo 2: se la valvola chiude, l'acqua nel ramo si ferma (tratteggio congelato e attenuato)
  const tf2 = o.tf2 ?? tf, op2 = f2 < 1 ? 0.3 + 0.7 * f2 : fl;
  let s = house(o);
  s += pipe(SUP_B2(), t, { ink: hot, flow: op2, tf: tf2 });
  s += pipe(SUP_MAIN(), t, { ink: hot, flow: fl, tf });
  s += pipe(RET_B2(), t, { ink: ret, flow: op2, tf: tf2 });
  s += pipe(RET_MAIN(), t, { ink: ret, flow: fl, tf });
  if (o.retArrows) s += retArrows();
  s += boiler(G.bx, G.by, t, { on: o.on ?? 1, disp: o.disp, dispC: o.dispC });
  s += pump(G.pumpX, G.ret, t, fl);
  s += radiator(G.r1[0], G.ry, G.r1[1] - G.r1[0], G.rh, { ink: o.rad1C || C.line });
  s += radiator(G.r2[0], G.ry, G.r2[1] - G.r2[0], G.rh);
  s += heatRise(G.r1[0], G.ry, G.r1[1] - G.r1[0], t, o.heat1 ?? 0);
  s += heatRise(G.r2[0], G.ry, G.r2[1] - G.r2[0], t, o.heat2 ?? 0);
  if (o.valves) {
    s += valve(G.r1[0] + 10, G.ry - 50, {});
    s += valve(G.r2[0] + 10, G.ry - 50, { ink: o.valve2C || C.line, closed: o.valve2 || 0 });
  }
  if (o.thermo) {
    const sg = o.signal || 0;
    if (sg > 0) {
      const d = 'M' + SIG().map(p => p.join(',')).join(' L');
      s += `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="4 12" stroke-linecap="round" opacity="${sg}"/>`;
      // impulso di comando che corre verso la caldaia
      if (o.pulse != null && o.pulse > 0 && o.pulse < 1) {
        const pts = SIG();
        const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = segs.reduce((a, b) => a + b);
        let r = o.pulse * tot, k = 0; while (k < segs.length - 1 && r > segs[k]) { r -= segs[k]; k++; }
        const a = pts[k], b = pts[k + 1], q = r / segs[k];
        s += `<circle cx="${lerp(a[0], b[0], q)}" cy="${lerp(a[1], b[1], q)}" r="11" fill="${C.line}"/>`;
      }
    }
    s += thermostat(G.thX, G.thY, { ink: o.thermoC || C.line, sw: 5 });
  }
  return s;
}

// ======================= SCENE =======================

// 1 — aggancio: quota del riscaldamento sull'energia di una famiglia
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('sessanta'), hold: W('come'),
  render(t) {
    let s = '';
    s += E(t, 0.0, T(110, 250, 'il riscaldamento', { f: 'serif', size: 76, it: true }));
    s += E(t, W('sessanta') - 0.1, T(104, 470, '60–70%', { f: 'pop', size: 210 }));
    s += E(t, W('dell\'energia') - 0.1, T(112, 560, 'dell\'energia totale di una famiglia', { f: 'popm', size: 46 }));
    // barra dell'energia totale
    const x0 = 110, w = 1700, y = 640, h = 90;
    s += E(t, 0.2, `<rect x="${x0}" y="${y}" width="${w}" height="${h}" rx="14" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>` +
      T(x0 + w - 20, y + h + 48, 'ENERGIA TOTALE = 100%', { f: 'mono', size: 26, a: 'end', ls: 3, w: 600 }), { dy: 0 });
    const p1 = eo((t - W('sessanta')) / 0.9), p2 = eo((t - W('settanta')) / 0.6);
    if (p1 > 0) s += `<rect x="${x0 + 6}" y="${y + 6}" width="${(w * 0.6 - 6) * p1}" height="${h - 12}" rx="9" fill="${C.coral}"/>`;
    if (p2 > 0) s += `<rect x="${x0 + w * 0.6}" y="${y + 6}" width="${w * 0.1 * p2}" height="${h - 12}" fill="url(#hatchC)" stroke="${C.coral}" stroke-width="3"/>`;
    [0.6, 0.7].forEach((q, i) => { if ((i ? p2 : p1) > 0.9) s += E(t, i ? W('settanta') + 0.3 : W('sessanta') + 0.6, `<line x1="${x0 + w * q}" y1="${y - 14}" x2="${x0 + w * q}" y2="${y}" stroke="${C.line}" stroke-width="3"/>` + T(x0 + w * q, y - 24, (q * 100) + '%', { f: 'mono', size: 26, a: 'middle', w: 700 }), { dy: 0 }); });
    s += E(t, W('come') - 0.1, T(1810, 250, 'come funziona?', { f: 'serif', size: 76, it: true, a: 'end' }));
    return s + caption(t, W('sessanta'), '60–70% dell\'energia', '');
  } }) });

// 2 — la caldaia scalda, la pompa fa circolare
scene('circuito', { make: (W) => ({
  capAt: W('caldaia'), hold: W('radiatori'),
  render(t) {
    const tf = Math.max(0, t - W('pompa'));
    const fl = eo((t - W('pompa')) / 0.5), on = clamp((t - W('scalda')) / 0.3);
    let s = E(t, -0.4, house(), { dy: 0 });
    let p = pipe(SUP_MAIN(), t, { ink: C.coral, flow: fl, tf }) + pipe(SUP_B1(), t, { ink: C.coral, flow: fl, tf }) +
      pipe(RET_B2(), t, { flow: fl, tf }) + pipe(RET_MAIN(), t, { flow: fl, tf });
    s += E(t, -0.2, p, { dy: 0 });
    s += E(t, W('caldaia') - 0.15, boiler(G.bx, G.by, t, { on, disp: t > W('sessanta') - 0.1 ? '60–80 °C' : '' }));
    s += E(t, W('caldaia') - 0.1, lbl(G.bx + 150, G.by - 19, 'CALDAIA'));
    s += E(t, W('pompa') - 0.15, pump(G.pumpX, G.ret, tf, 1) + lbl(G.pumpX, G.ret - 52, 'POMPA'));
    s += E(t, -0.2, radiator(G.r1[0], G.ry, 240, G.rh) + radiator(G.r2[0], G.ry, 240, G.rh), { dy: 0 });
    s += heatRise(G.r1[0], G.ry, 240, t, clamp((t - W('radiatori') + 0.6) / 0.6)) + heatRise(G.r2[0], G.ry, 240, t, clamp((t - W('radiatori') + 0.6) / 0.6));
    s += E(t, W('radiatori') - 0.1, lbl(890, 878, 'RADIATORE') + lbl(1450, 878, 'RADIATORE'));
    s += E(t, W('tubi') - 0.1, lbl(980, G.sup - 26, 'ANDATA →') + lbl(1100, 790, '← RITORNO'));
    return s + caption(t, W('caldaia'), 'La caldaia scalda l\'acqua', '');
  } }) });

// 3 — il radiatore cede calore: irraggiamento e convezione (primo piano)
scene('radiatori', { make: (W) => ({
  capAt: W('irraggiamento'), hold: W('convezione'),
  render(t) {
    let s = '';
    // stanza: pavimento, parete, soffitto
    s += E(t, -0.4, `<rect x="140" y="200" width="30" height="620" fill="url(#hatch)" stroke="${C.line}" stroke-width="3"/>` +
      `<rect x="140" y="790" width="1660" height="34" fill="url(#hatch)" stroke="${C.line}" stroke-width="3"/>` +
      `<rect x="140" y="170" width="1660" height="30" fill="url(#hatch)" stroke="${C.line}" stroke-width="3"/>`, { dy: 0 });
    const rx = 260, ry = 470, rw = 380, rh = 270;
    s += E(t, -0.3, radiator(rx, ry, rw, rh, { n: 9, sw: 4.5 }) +
      pipe(`M${rx + 20},${ry} V${ry - 90} H170`, t, { flow: 1, ink: C.coral }) + pipe(`M${rx + rw - 20},${ry + rh} V${ry + rh + 30} H170`, t, { flow: 1 }), { dy: 0 });
    s += E(t, W('radiatori') - 0.1, lbl(rx + rw / 2, ry - 40, 'RADIATORE'));
    // irraggiamento: onde dritte verso la stanza
    const pr = (t - W('irraggiamento') + 0.15) / 0.9;
    if (pr > 0) for (let i = 0; i < 4; i++) {
      const yy = ry + 50 + i * 58, ph = t * 7 - i;
      s += wave(rx + rw + 30, yy, rx + rw + 360, yy - 40 + i * 26, clamp(pr - i * 0.08), { lam: 30, A: 8, ph, c: C.line, sw: 3.5 });
      if (pr - i * 0.08 > 1) s += arrow(rx + rw + 340, yy - 38 + i * 26 - 2, rx + rw + 380, yy - 42 + i * 26 + 4 * i / 3, C.line, 3.5);
    }
    s += E(t, W('irraggiamento') - 0.05, lbl(rx + rw + 190, ry - 20, 'IRRAGGIAMENTO'));
    // convezione: l'aria calda sale, scorre sotto il soffitto, si raffredda, scende e torna al radiatore
    const pc = eo((t - W('convezione') + 0.15) / 0.9);
    if (pc > 0) {
      const d = `M${rx + rw / 2},${ry - 70} C${rx + rw / 2},${260} ${rx + rw / 2 + 60},${250} ${rx + rw + 300},${250} L1560,250 C1700,250 1700,300 1700,420 L1700,640 C1700,740 1660,760 1560,760 L${rx + rw + 120},760 C${rx + rw + 40},760 ${rx + rw - 40},760 ${rx + rw / 2 + 120},${ry + rh + 10}`;
      s += `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="18 16" stroke-dashoffset="${(-t * 70).toFixed(1)}" stroke-linecap="round" opacity="${pc}"/>`;
      s += `<g opacity="${pc}">` + arrow(1300, 250, 1360, 250, C.line, 4) + arrow(1700, 520, 1700, 580, C.line, 4) + arrow(1240, 760, 1180, 760, C.line, 4) + arrow(rx + rw / 2, 330, rx + rw / 2, 300, C.line, 4) + '</g>';
      s += E(t, W('convezione') - 0.05, lbl(1240, 310, 'CONVEZIONE') + T(1240, 360, 'l\'aria calda sale', { f: 'serif', size: 42, it: true, a: 'middle' }));
    }
    s += E(t, W('calore') - 0.1, T(1090, 610, 'cede calore all\'aria', { f: 'serif', size: 54, it: true }));
    return s + caption(t, W('irraggiamento'), 'Irraggiamento e convezione', '');
  } }) });

// 4 — l'acqua raffreddata torna alla caldaia
scene('ritorno', { make: (W) => ({
  capAt: W('torna'), hold: W('riscaldata'),
  render(t) {
    let s = plant(t, { retArrows: true, heat1: 0.6, heat2: 0, on: 1, disp: t > W('riscaldata') - 0.1 ? 'RISCALDA' : '' });
    s += E(t, W('raffreddata') - 0.1, pillTag(1565, 470, 'ACQUA RAFFREDDATA', C.line, C.bg, 'middle'));
    s += E(t, W('torna') - 0.1, lbl(G.bx + 150, G.by - 19, 'CALDAIA'));
    return s + caption(t, W('torna'), 'Torna alla caldaia', '');
  } }) });

// 5 — il termostato misura e comanda
scene('termostato', { make: (W) => ({
  capAt: W('termostato'), hold: W('comanda'),
  render(t) {
    const sg = clamp((t - W('comanda') + 0.1) / 0.3), pl = (t - W('comanda')) / 1.0;
    let s = plant(t, { thermo: true, signal: sg, pulse: pl, heat1: 0.5, heat2: 0 });
    s += E(t, W('termostato') - 0.15, T(G.thX - 96, G.thY + 2, 'TERMOSTATO', { f: 'mono', size: 26, a: 'end', ls: 3, w: 600 }));
    // misura: piccole onde d'aria verso il termostato
    const pm = clamp((t - W('misura')) / 0.4);
    if (pm > 0) for (let i = 0; i < 3; i++) { const ph = (t * 0.9 + i / 3) % 1; s += `<circle cx="${G.thX}" cy="${G.thY}" r="${48 + ph * 32}" fill="none" stroke="${C.line}" stroke-width="2.5" opacity="${(pm * (1 - ph) * 0.8).toFixed(3)}"/>`; }
    s += E(t, W('misura') - 0.1, T(G.thX - 96, G.thY + 52, 'misura l\'aria', { f: 'serif', size: 40, it: true, a: 'end' }));
    s += E(t, W('comanda') - 0.1, pillTag(960, 124, 'COMANDA LA CALDAIA', C.line, C.bg, 'middle'));
    return s + caption(t, W('termostato'), 'Il termostato comanda', '');
  } }) });

// 6 — acceso / spento: la temperatura oscilla sotto il valore impostato
scene('onoff', { make: (W) => {
  const tOn = W('accende'), tOff = W('spegne'), tOn2 = tOff + 1.5;
  const S = 400, U = 120, x0 = 330, pxs = 165;
  const T0 = S - 0.55 * U;
  // temperatura (in y schermo) nel tempo — calcolata solo da tau
  // la caldaia si accende quando la curva incrocia il valore impostato scendendo, si spegne quando lo raggiunge risalendo
  const temp = tau => {
    if (tau < tOn) { const q = tau / tOn; return lerp(T0, S, q * q * 0.4 + q * 0.6); }
    if (tau < tOff) { const q = (tau - tOn) / (tOff - tOn); return S + 0.85 * U * Math.sin(Math.PI * q); }
    if (tau < tOn2) { const q = (tau - tOff) / (tOn2 - tOff); return S - 0.3 * U * Math.sin(Math.PI * q); }
    const q = clamp((tau - tOn2) / (tOff - tOn)); return S + 0.85 * U * Math.sin(Math.PI * q);
  };
  const state = tau => (tau >= tOn && tau < tOff) || tau >= tOn2;
  return {
    capAt: tOn, hold: tOff,
    render(t, D) {
      let s = '';
      const X = tau => x0 + tau * pxs, xr = x0 + 1300;
      s += E(t, -0.4, `<line x1="${x0}" y1="200" x2="${x0}" y2="640" stroke="${C.line}" stroke-width="3"/><line x1="${x0}" y1="640" x2="${xr}" y2="640" stroke="${C.line}" stroke-width="3"/>` +
        arrow(xr - 20, 640, xr + 10, 640, C.line, 3) + arrow(x0, 220, x0, 190, C.line, 3) +
        T(x0 + 20, 196, 'TEMPERATURA DELL\'ARIA', { f: 'mono', size: 28, ls: 3, w: 600 }) + T(xr + 10, 686, 'TEMPO', { f: 'mono', size: 28, ls: 3, w: 600, a: 'end' }), { dy: 0 });
      s += E(t, W('valore') - 0.1, `<line x1="${x0}" y1="${S}" x2="${xr}" y2="${S}" stroke="${C.line}" stroke-width="3" stroke-dasharray="14 10"/>` +
        T(x0 - 20, S - 8, 'VALORE', { f: 'mono', size: 28, a: 'end', ls: 2, w: 600 }) + T(x0 - 20, S + 26, 'IMPOSTATO', { f: 'mono', size: 28, a: 'end', ls: 2, w: 600 }));
      // curva (corallo)
      const tc = Math.min(t, (xr - x0) / pxs); let d = '';
      for (let k = 0; k <= 120; k++) { const tau = tc * k / 120; d += (k ? 'L' : 'M') + X(tau).toFixed(1) + ',' + temp(tau).toFixed(1); }
      if (tc > 0.02) s += `<path d="${d}" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${X(tc)}" cy="${temp(tc)}" r="11" fill="${C.coral}"/>`;
      // striscia della caldaia
      const sy = 730;
      s += E(t, 0.2, T(x0 - 20, sy + 44, 'CALDAIA', { f: 'mono', size: 28, a: 'end', ls: 2, w: 600 }) + `<rect x="${x0}" y="${sy}" width="${xr - x0}" height="64" rx="10" fill="none" stroke="${C.line}" stroke-width="3"/>`, { dy: 0 });
      [[tOn, tOff], [tOn2, 99]].forEach(([a, b]) => {
        if (tc <= a) return; const e = Math.min(tc, b);
        s += `<rect x="${X(a)}" y="${sy + 6}" width="${X(e) - X(a)}" height="52" rx="7" fill="${mix(C.bg, C.line, 0.75)}"/>`;
        if (X(e) - X(a) > 150) s += T((X(a) + X(e)) / 2, sy + 42, 'ACCESA', { f: 'mono', size: 28, fill: C.bg, a: 'middle', w: 700, ls: 2 });
      });
      if (tc > tOff + 0.9) s += T((X(tOff) + X(Math.min(tc, tOn2))) / 2, sy + 42, 'SPENTA', { f: 'mono', size: 28, a: 'middle', w: 700, ls: 2 });
      // caldaia a destra: fiamma accesa/spenta
      const on = state(t) ? 1 : 0;
      s += E(t, -0.3, `<g transform="translate(1700,330) scale(0.62) translate(-120,-130)">${boiler(0, 0, t, { on })}</g>` , { dy: 0 });
      s += E(t, -0.3, T(1700, 470, on ? 'ACCESA' : 'SPENTA', { f: 'pop', size: 40, a: 'middle' }), { dy: 0 });
      s += T(xr - 10, 610, 'SCHEMA', { f: 'mono', size: 28, a: 'end', ls: 3, w: 600 });
      return s + caption(t, tOn, 'Si accende, si spegne', '');
    } };
} });

// 7 — due gradi in meno (registro chiaro)
scene('duegradi', { make: (W) => ({
  capAt: W('dodici'), hold: W('dodici'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(180, 150, 1560, 690, { rot: -1 }), { dy: 0 });
    g += E(t, 0.0, T(260, 250, 'ABBASSARE IL TERMOSTATO', { f: 'mono', size: 30, fill: C.ink, ls: 3, w: 700 }));
    // quadrante del termostato
    const cx = 560, cy = 520, R = 190, rot = lerp(0, -30, eio((t - W('venti')) / 0.7));
    g += E(t, 0.1, `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${R - 34}" fill="none" stroke="${C.ink}" stroke-width="2"/>` +
      `<g transform="rotate(${rot} ${cx} ${cy})">${Array.from({ length: 13 }, (_, i) => { const a = -Math.PI * 0.75 + i * Math.PI * 1.5 / 12; return `<line x1="${cx + Math.cos(a) * (R - 30)}" y1="${cy + Math.sin(a) * (R - 30)}" x2="${cx + Math.cos(a) * (R - 12)}" y2="${cy + Math.sin(a) * (R - 12)}" stroke="${C.ink}" stroke-width="3"/>`; }).join('')}</g>` +
      `<path d="M${cx},${cy - R - 4} l-14,-22 h28 z" fill="${C.ink}"/>`);
    const v = t < W('venti') ? 22 : 20;
    g += E(t, W('ventidue') - 0.1, T(cx, cy + 34, v + ' °C', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }), { dy: 0 });
    g += E(t, W('venti') + 0.2, T(cx, cy + R + 80, '22 °C → 20 °C', { f: 'popm', size: 44, fill: C.ink, a: 'middle' }));
    // effetto sulla bolletta
    g += E(t, W('bolletta') - 0.1, T(1040, 400, 'sulla bolletta', { f: 'serif', size: 64, it: true, fill: C.ink }));
    g += E(t, W('circa') - 0.1, T(1040, 500, 'circa', { f: 'serif', size: 64, it: true, fill: C.ink }));
    g += E(t, W('dodici') - 0.1, T(1030, 680, '−12%', { f: 'pop', size: 210, fill: C.coral }));
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('dodici'), 'Circa il 12% in meno', '', true);
  } }) });

// 8 — le valvole termostatiche
scene('valvole', { tail: 0.5, make: (W) => ({
  capAt: W('valvole'), hold: W('risparmio'),
  render(t) {
    const tc = W('già'), cl = eio((t - tc) / 0.8), f2 = 1 - cl;
    let p = plant(t, { valves: true, valve2: cl, flow2: f2, tf2: Math.min(t, tc + 0.4), heat1: 0.6, heat2: 0.6 * f2 });
    p += sun(1855, 330, t);
    // raggi del sole che entrano dalla finestra
    const ps = clamp((t - W('stanze') + 0.2) / 0.5);
    if (ps > 0) for (let i = 0; i < 3; i++) p += `<line x1="${1760}" y1="${420 + i * 60}" x2="${1640 - i * 40}" y2="${560 + i * 70}" stroke="${C.line}" stroke-width="3" stroke-dasharray="10 12" opacity="${ps}"/>`;
    let s = `<g transform="translate(960,834) scale(0.86) translate(-960,-834)">${p}</g>`;
    s += E(t, W('valvole') - 0.1, `<line x1="1290" y1="266" x2="1290" y2="528" stroke="${C.line}" stroke-width="3"/>` + pillTag(1290, 250, 'VALVOLA TERMOSTATICA', C.line, C.bg, 'middle'));
    s += E(t, W('calde') - 0.1, T(1450, 470, 'stanza già calda', { f: 'serif', size: 48, it: true, a: 'middle' }));
    s += E(t, W('risparmio') - 0.1, T(110, 210, 'RISPARMIO MEDIO', { f: 'mono', size: 30, ls: 4, w: 700 }));
    s += E(t, W('risparmio') - 0.1, T(560, 214, '10–20%', { f: 'pop', size: 84 }));
    return s + caption(t, W('valvole'), 'Valvole termostatiche', '');
  } }) });

// 9 — la pompa di calore sposta il calore da fuori a dentro
scene('pdc', { make: (W) => ({
  capAt: W('sposta'), hold: W('frigorifero') + 0.1,
  render(t) {
    let s = '';
    const wx = 900;
    // parete esterna in sezione
    s += E(t, -0.4, `<rect x="${wx - 30}" y="250" width="60" height="560" fill="url(#hatch)" stroke="${C.line}" stroke-width="3"/>` +
      `<line x1="110" y1="810" x2="1810" y2="810" stroke="${C.line}" stroke-width="4"/>` +
      lbl(470, 300, 'ESTERNO') + lbl(1360, 300, 'INTERNO'), { dy: 0 });
    // unità esterna con ventola
    const ux = 500, uy = 520;
    let u = `<rect x="${ux - 170}" y="${uy - 130}" width="340" height="270" rx="16" fill="${mix(C.bg, C.line, 0.06)}" stroke="${C.line}" stroke-width="4"/>`;
    u += `<circle cx="${ux - 30}" cy="${uy + 5}" r="92" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`;
    { const fx = ux - 30, fy = uy + 5, blade = `M${fx},${fy - 16} C${fx + 34},${fy - 30} ${fx + 30},${fy - 74} ${fx},${fy - 80} C${fx - 22},${fy - 64} ${fx - 16},${fy - 32} ${fx},${fy - 16} z`;
      u += `<g transform="rotate(${((t * 300) % 360).toFixed(1)} ${fx} ${fy})">` + [0, 120, 240].map(a => `<path d="${blade}" transform="rotate(${a} ${fx} ${fy})" fill="${mix(C.bg, C.line, 0.1)}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>`).join('') + `<circle cx="${fx}" cy="${fy}" r="16" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/></g>`; }
    u += `<rect x="${ux + 90}" y="${uy - 80}" width="54" height="170" rx="6" fill="none" stroke="${C.line}" stroke-width="2.5"/>`;
    // unità interna a parete
    const ix = 1360, iy = 390;
    u += `<rect x="${ix - 220}" y="${iy - 60}" width="440" height="120" rx="22" fill="${mix(C.bg, C.line, 0.06)}" stroke="${C.line}" stroke-width="4"/><line x1="${ix - 180}" y1="${iy + 32}" x2="${ix + 180}" y2="${iy + 32}" stroke="${C.line}" stroke-width="3"/>`;
    // tubi di collegamento attraverso la parete
    u += `<path d="M${ux + 170},${uy - 60} H${wx + 60} V${iy} H${ix - 220}" fill="none" stroke="${C.line}" stroke-width="5"/><path d="M${ux + 170},${uy - 30} H${wx + 90} V${iy + 26} H${ix - 220}" fill="none" stroke="${C.line}" stroke-width="5"/>`;
    s += E(t, -0.3, u, { dy: 0 });
    // energia elettrica: cavo + fulmine
    s += E(t, W('elettrica') - 0.2, `<path d="M${ux},${uy + 140} V700 H250" fill="none" stroke="${C.line}" stroke-width="4"/>` +
      `<path d="M226,640 L200,700 L226,700 L208,756 L262,684 L234,684 L254,640 z" fill="${C.line}"/>` + T(290, 760, 'ENERGIA ELETTRICA', { f: 'mono', size: 26, ls: 3, w: 600 }));
    // fiamma barrata: non brucia nulla
    s += E(t, W('brucia') - 0.1, `<g transform="translate(1660,640)">${flame(0, 0, 2.6, 0, C.line)}<circle cx="0" cy="-12" r="78" fill="none" stroke="${C.line}" stroke-width="5"/><line x1="-55" y1="-67" x2="55" y2="43" stroke="${C.line}" stroke-width="6"/></g>` + lbl(1660, 770, 'NON BRUCIA'));
    // flusso di calore (corallo): dall'aria esterna, dentro l'unità, nei tubi, fuori nella stanza
    const pf = clamp((t - W('sposta')) / 1.6);
    if (pf > 0) {
      const d = `M150,470 C230,470 260,520 ${ux - 140},520 M${ux + 170},${uy - 45} H${wx + 75} V${iy + 13} H${ix - 230} M${ix},${iy + 70} C${ix},${iy + 160} ${ix - 30},${iy + 220} ${ix - 40},${iy + 300}`;
      s += `<path d="${d}" fill="none" stroke="${C.coral}" stroke-width="8" stroke-linecap="round" stroke-dasharray="20 18" stroke-dashoffset="${(-t * 90).toFixed(1)}" opacity="${eo(pf * 2)}"/>`;
      s += `<g opacity="${eo(pf * 2)}">` + arrow(ix - 36, iy + 270, ix - 41, iy + 320, C.coral, 8) + arrow(250, 488, 300, 510, C.coral, 8) + '</g>';
      s += E(t, W('sposta') + 0.2, lbl(1360, iy + 400, 'CALORE →  DENTRO'));
    }
    // come un frigorifero al contrario
    s += E(t, W('frigorifero') - 0.15, pillTag(110, 215, 'FRIGORIFERO: DENTRO → FUORI', C.line, C.bg));
    s += E(t, W('frigorifero') + 0.1, pillTag(1000, 215, 'POMPA DI CALORE: FUORI → DENTRO', C.line, C.bg));
    return s + caption(t, W('sposta'), 'Sposta il calore', '');
  } }) });

// 10 — COP (registro chiaro)
function kwhBlock(x, y, ink) {
  return `<rect x="${x - 70}" y="${y - 70}" width="140" height="140" rx="14" fill="${mix(C.cream, ink, 0.12)}" stroke="${ink}" stroke-width="4"/>` + T(x, y + 14, '1 kWh', { f: 'pop', size: 38, fill: ink, a: 'middle' });
}
scene('cop', { make: (W) => ({
  capAt: W('cop'), hold: W('calore'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(160, 150, 1600, 690, { rot: 1 }), { dy: 0 });
    g += E(t, 0.0, T(240, 250, 'POMPA DI CALORE', { f: 'mono', size: 30, fill: C.ink, ls: 3, w: 700 }));
    // macchina: box COP
    const mx = 900, my = 520;
    g += E(t, W('cop') - 0.15, `<rect x="${mx - 150}" y="${my - 120}" width="300" height="240" rx="22" fill="${C.cream}" stroke="${C.coral}" stroke-width="6"/>` +
      T(mx, my - 10, 'COP', { f: 'mono', size: 44, fill: C.ink, a: 'middle', w: 700, ls: 4 }) + T(mx, my + 80, '3', { f: 'pop', size: 110, fill: C.ink, a: 'middle' }));
    // ingresso: 1 kWh di elettricità
    g += E(t, W('kilowattora') - 0.15, kwhBlock(400, my - 120, C.ink) + T(400, my - 10, 'di elettricità', { f: 'popm', size: 36, fill: C.ink, a: 'middle' }));
    g += E(t, W('elettricità') - 0.1, arrow(490, my - 120, 735, my - 40, C.ink, 6));
    // il resto del calore viene preso dall'aria esterna: 1 + 2 = 3
    g += E(t, W('produce') - 0.15, `<rect x="${310}" y="${my + 70}" width="180" height="120" rx="14" fill="${mix(C.cream, C.ink, 0.06)}" stroke="${C.ink}" stroke-width="4" stroke-dasharray="10 8"/>` + T(400, my + 145, '+2 kWh', { f: 'pop', size: 40, fill: C.ink, a: 'middle' }) +
      T(400, my + 240, 'dall\'aria esterna', { f: 'popm', size: 36, fill: C.ink, a: 'middle' }) + arrow(500, my + 130, 735, my + 50, C.ink, 6));
    // uscita: 3 kWh di calore
    const p3 = W('tre', 1) - 0.15;
    g += E(t, p3, arrow(1070, my, 1200, my, C.ink, 6));
    [0, 1, 2].forEach(i => g += E(t, p3 + i * 0.12, kwhBlock(1300 + i * 160, my, C.ink)));
    g += E(t, W('calore') - 0.1, T(1460, my + 130, '1 + 2 = 3 kWh di calore', { f: 'popm', size: 38, fill: C.ink, a: 'middle' }));
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('cop'), 'Un COP di 3', '', true);
  } }) });

// 11 — il confronto dei costi (esempio del testo)
scene('costi', { make: (W) => ({
  capAt: W('pompa'), hold: W('cento'),
  render(t) {
    let s = '';
    s += E(t, -0.3, T(110, 210, 'ESEMPIO · 1.000 kWh DI CALORE', { f: 'mono', size: 30, ls: 4, w: 700 }) +
      T(110, 262, 'elettricità 0,30 €/kWh · gas 0,12 €/kWh', { f: 'mono', size: 28, ls: 1, w: 600 }), { dy: 0 });
    const rows = [['Stufa elettrica', 'COP 1', 300, 'trecento'], ['Caldaia a gas', 'rendimento 95%', 126, 'centoventisei'], ['Pompa di calore', 'COP 3', 100, 'cento']];
    const bx = 620, kx = 3.4;
    rows.forEach(([n, sub, v, w], i) => {
      const y = 360 + i * 165, t0 = W(w) - 0.35, coral = i === 2;
      s += E(t, i === 0 ? W('stufa') - 0.15 : i === 1 ? W('caldaia') - 0.15 : W('pompa') - 0.15, T(110, y + 40, n, { f: 'pop', size: 50 }) + T(112, y + 88, sub, { f: 'mono', size: 28, ls: 2, w: 600 }));
      const p = eo((t - t0) / 0.7);
      if (p > 0) {
        s += `<rect x="${bx}" y="${y}" width="${v * kx * p}" height="90" rx="12" fill="${coral ? C.coral : mix(C.bg, C.line, 0.18)}" stroke="${coral ? C.coral : C.line}" stroke-width="3"/>`;
        s += E(t, t0 + 0.35, T(bx + v * kx + 30, y + 64, v + ' €', { f: 'pop', size: 58 }));
      }
    });
    return s + caption(t, W('pompa'), 'Pompa di calore: 100 €', '');
  } }) });

// 12 — chiusura
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, `<g transform="translate(960,250) scale(0.62) translate(-180,-90)">${radiator(0, 0, 360, 180, { ink: C.ink, fill: C.cream, n: 8 })}</g>`, { dy: 8 });
    s += E(t, -0.4, T(960, 450, 'L\'impianto di riscaldamento', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('capire', 1) - 0.1, 960, 570, 'per capire dove vanno i soldi della bolletta', { f: 'serif', size: 62, fill: C.ink, a: 'middle', it: true, key: 'bolletta' });
    s += E(t, W('bolletta') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC AMB-2-02', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5 }));
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
