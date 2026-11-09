// Kit condiviso — ogni funzione restituisce markup SVG, tutto calcolato da t.
const C = { bg: '#0C0A09', coral: '#D97757', line: '#F0E6D8', ivory: '#F6F2E9' };
function hex(c) { return [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); }
function mix(a, b, p) {
  const A = hex(a), B = hex(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * p).toString(16).padStart(2, '0')).join('');
}
C.ink = C.bg; C.cream = mix(C.ivory, '#FFFFFF', 0.55); C.muted = mix(C.ivory, C.bg, 0.55);
C.lineDim = mix(C.bg, C.line, 0.35); C.earth = mix(C.bg, C.line, 0.07);

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = x => 1 - Math.pow(1 - clamp(x), 3);
const eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a, b, p) => a + (b - a) * p;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// entrata firma: sfocato -> nitido + dissolvenza + salita
function E(t, t0, inner, o = {}) {
  const d = o.d ?? 0.55, dy = o.dy ?? 22, p = eo((t - t0) / d);
  if (p <= 0) return '';
  const b = (1 - p) * (o.blur ?? 11);
  const tr = `translate(${o.x || 0},${(o.y || 0) + (1 - p) * dy})`;
  return `<g transform="${tr}" opacity="${p.toFixed(3)}"${b > 0.05 ? ` style="filter:blur(${b.toFixed(2)}px)"` : ''}>${inner}</g>`;
}
// icona che si accende con overshoot
function pop(t, t0, cx, cy, inner, d = 0.45) {
  const x = clamp((t - t0) / d); if (x <= 0) return '';
  const s = x < 1 ? 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2) : 1;
  return `<g opacity="${clamp(x * 2).toFixed(3)}" transform="translate(${cx},${cy}) scale(${s.toFixed(4)}) translate(${-cx},${-cy})">${inner}</g>`;
}
const F = { pop: "Pop, sans-serif", popm: "PopM, sans-serif", serif: "ISerif, serif", mono: "Mono, monospace" };
function T(x, y, s, o = {}) {
  const f = F[o.f || 'popm'];
  return `<text x="${x}" y="${y}" font-family="${f}" font-size="${o.size || 32}" fill="${o.fill || C.line}"` +
    ` font-weight="${o.w || (o.f === 'pop' ? 800 : o.f === 'mono' ? 500 : 400)}" text-anchor="${o.a || 'start'}"` +
    `${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.it ? ' font-style="italic"' : ''}${o.op != null ? ` opacity="${o.op}"` : ''}>${o.raw ? s : esc(s)}</text>`;
}
// parole una alla volta (~110 ms), una parola chiave in corallo; larghezze misurate col font reale
const _ctx = document.createElement('canvas').getContext('2d');
const FW = { pop: 800, popm: 500, serif: 400, mono: 500 };
const FN = { pop: 'Pop', popm: 'PopM', serif: 'ISerif', mono: 'Mono' };
function tw(s, f, size, it) { _ctx.font = `${it ? 'italic ' : ''}${FW[f]} ${size}px ${FN[f]}`; return _ctx.measureText(s).width; }
function words(t, t0, x, y, s, o = {}) {
  const ws = s.split(' '), key = (o.key || '').split(' ').map(k => k.replace(/[?,.]/g, ''));
  const f = o.f || 'popm', size = o.size || 56, sp = tw(' ', f, size, o.it);
  const wd = ws.map(w => tw(w, f, size, o.it)), total = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  let cx = o.a === 'middle' ? x - total / 2 : x, out = '';
  ws.forEach((w, i) => {
    const fill = key.includes(w.replace(/[?,.]/g, '')) ? C.coral : (o.fill || C.line);
    out += E(t, t0 + i * 0.11, T(cx, y, w, { ...o, a: 'start', fill }), { d: 0.45, dy: 16 });
    cx += wd[i] + sp;
  });
  return out;
}

function arrow(x1, y1, x2, y2, c, sw = 4) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 16;
  return `<line x1="${x1}" y1="${y1}" x2="${x2 - Math.cos(a) * 6}" y2="${y2 - Math.sin(a) * 6}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<path d="M${x2},${y2} L${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)} L${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)} z" fill="${c}"/>`;
}


// ---- UI ----
const CAPS = ['MONOCOLTURA', 'ROTAZIONE', 'CEREALE', 'LEGUMINOSA', 'RADICE', 'FOGLIA E FRUTTO', 'VANTAGGI'];
function chapterBar(t, cap, light) {
  const ink = light ? C.ink : C.line, n = CAPS.length; let s = '';
  for (let i = 0; i < n; i++) {
    const x = 1920 - 96 - (n - i) * 58 + 10, y = 48, act = i + 1 === cap, past = i + 1 < cap;
    const fill = act ? C.coral : past ? mix(light ? C.ivory : C.bg, ink, 0.18) : 'none';
    s += `<rect x="${x}" y="${y}" width="46" height="46" rx="8" fill="${fill}" stroke="${act ? C.coral : ink}" stroke-width="2" opacity="${act || past ? 1 : 0.55}"/>`;
    s += T(x + 23, y + 31, act || past ? String(i + 1) : '?', { f: 'mono', size: 24, fill: act ? C.ivory : ink, a: 'middle', w: 700, op: act || past ? 1 : 0.6 });
  }
  if (cap > 0) {
    const lab = `${cap}  •  ${CAPS[cap - 1]}`, w = tw(lab, 'mono', 24) + 3 * lab.length + 52;
    s += E(t, -0.4, `<rect x="96" y="48" width="${w}" height="50" rx="23" fill="${C.coral}"/>` +
      T(122, 81, lab, { f: 'mono', size: 24, fill: C.ivory, ls: 3, w: 700 }), { dy: 0 });
  }
  return s;
}
function caption(t, t0, s, key, light) {
  if (t < t0 - 0.05) return '';
  let g = light ? '' : `<rect x="0" y="880" width="1920" height="200" fill="url(#capfade)" opacity="${eo((t - t0) / 0.4)}"/>`;
  return g + words(t, t0, 96, 1006, s, { f: 'pop', size: 58, key, fill: light ? C.ink : C.line });
}
function card(x, y, w, h, o = {}) {
  const r = o.rot || 0, cx = x + w / 2, cy = y + h / 2;
  return `<g transform="rotate(${r} ${cx} ${cy})"><rect x="${x + 12}" y="${y + 12}" width="${w}" height="${h}" rx="18" fill="${C.ink}"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/></g>`;
}
function lightBg() {
  return `<rect width="1920" height="1080" fill="${C.ivory}"/><circle cx="1780" cy="1040" r="620" fill="url(#peach)"/>`;
}
const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.line, ls: 3, a: o.a || 'middle', w: 600 });
function pillTag(x, y, s, ink, bg, o = {}) {
  const w = tw(s, 'mono', 28) + 44, x0 = o.a === 'middle' ? x - w / 2 : o.a === 'end' ? x - w : x;
  return `<rect x="${x0}" y="${y - 35}" width="${w}" height="50" rx="25" fill="${bg}" stroke="${ink}" stroke-width="2"/>` + T(x0 + w / 2, y, s, { f: 'mono', size: 28, fill: ink, a: 'middle' });
}

// ---- mondo: il campo in sezione ----
const GY = 560, SB = 860, SX0 = 100, SX1 = 1820; // linea del suolo, fondo della sezione
// pseudo-casuale deterministico
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function soil(o = {}) {
  const ink = C.line;
  let s = `<rect x="${SX0}" y="${GY}" width="${SX1 - SX0}" height="${SB - GY}" fill="${C.earth}"/>`;
  s += `<line x1="${SX0}" y1="${GY}" x2="${SX1}" y2="${GY}" stroke="${ink}" stroke-width="4"/>`;
  s += `<line x1="${SX0}" y1="${SB}" x2="${SX1}" y2="${SB}" stroke="${C.lineDim}" stroke-width="2" stroke-dasharray="4 12"/>`;
  s += `<line x1="${SX0}" y1="${GY}" x2="${SX0}" y2="${SB}" stroke="${C.lineDim}" stroke-width="2" stroke-dasharray="4 12"/><line x1="${SX1}" y1="${GY}" x2="${SX1}" y2="${SB}" stroke="${C.lineDim}" stroke-width="2" stroke-dasharray="4 12"/>`;
  // granuli e sassolini
  for (let i = 0; i < 70; i++) {
    const x = SX0 + 20 + rnd(i) * (SX1 - SX0 - 40), y = GY + 22 + rnd(i + 99) * (SB - GY - 40), r = 3 + rnd(i + 7) * 5;
    s += i % 5 ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 0.5).toFixed(1)}" fill="${C.lineDim}"/>` :
      `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(r * 1.8).toFixed(1)}" ry="${r.toFixed(1)}" fill="none" stroke="${C.lineDim}" stroke-width="2"/>`;
  }
  if (o.label !== false) s += lbl(SX0 + 24, GY + 48, 'SUOLO', { a: 'start', size: 24 });
  return s;
}
const ST = (c, w = 4) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
// frumento: g = crescita 0..1
function wheat(x, g, c = C.line, o = {}) {
  g = clamp(g); if (g <= 0) return '';
  const h = 250 * g, top = GY - h; let s = '';
  // radici fascicolate
  for (let i = 0; i < 6; i++) { const a = -0.9 + i * 0.36, L = 110 * g; s += `<path d="M${x},${GY} q${Math.sin(a) * L * 0.4},${L * 0.5} ${Math.sin(a) * L * 0.7},${L}" ${ST(o.root || c, 2.5)}/>`; }
  s += `<path d="M${x},${GY} L${x + 6},${top}" ${ST(c, 4)}/>`;
  s += `<path d="M${x + 2},${GY - h * 0.35} q-50,-20 -70,-70" ${ST(c, 3)}/><path d="M${x + 4},${GY - h * 0.55} q50,-20 66,-74" ${ST(c, 3)}/>`;
  // spiga
  if (g > 0.5) for (let k = 0; k < 6; k++) {
    const yy = top + 6 + k * 13 * g; s += `<ellipse cx="${x - 2}" cy="${yy}" rx="7" ry="11" transform="rotate(-25 ${x - 2} ${yy})" fill="${C.bg}" stroke="${c}" stroke-width="3"/><ellipse cx="${x + 14}" cy="${yy}" rx="7" ry="11" transform="rotate(25 ${x + 14} ${yy})" fill="${C.bg}" stroke="${c}" stroke-width="3"/>`;
  }
  return s;
}
// leguminosa con noduli sulle radici
function bean(x, g, c = C.line, o = {}) {
  g = clamp(g); if (g <= 0) return '';
  const h = 220 * g; let s = '';
  s += `<path d="M${x},${GY} L${x},${GY + 170 * g}" ${ST(c, 3)}/>`;
  const lat = [[-1, 50, 70], [1, 70, 80], [-1, 105, 60], [1, 130, 55]];
  lat.forEach(([d, y0, L], i) => {
    const yy = GY + y0 * g, ex = x + d * L * g, ey = yy + 30 * g;
    s += `<path d="M${x},${yy} q${d * L * 0.5 * g},0 ${d * L * g},${30 * g}" ${ST(c, 2.5)}/>`;
    if (g > 0.4) [0.5, 1].forEach(f => { const nx = x + d * L * g * f, ny = yy + (f === 1 ? 30 * g : 7 * g); s += `<circle cx="${nx}" cy="${ny}" r="9" fill="${o.nodFill || mix(C.bg, c, 0.35)}" stroke="${c}" stroke-width="2.5"/>`; });
  });
  s += `<path d="M${x},${GY} C${x - 14},${GY - h * 0.4} ${x + 14},${GY - h * 0.7} ${x},${GY - h}" ${ST(c, 4)}/>`;
  const leaf3 = (lx, ly, k) => [-40, 0, 40].map(a => `<ellipse cx="${lx}" cy="${ly - 26 * k}" rx="${13 * k}" ry="${26 * k}" transform="rotate(${a} ${lx} ${ly})" fill="${C.bg}" stroke="${c}" stroke-width="3"/>`).join('');
  if (g > 0.3) s += leaf3(x - 4, GY - h * 0.5, g) + leaf3(x + 2, GY - h, g * 0.9);
  if (g > 0.7) s += `<path d="M${x + 6},${GY - h * 0.7} q34,10 44,58 q-6,6 -14,0 q-6,-34 -30,-50 z" fill="${C.bg}" stroke="${c}" stroke-width="3"/>`;
  return s;
}
// carota: radice a fittone
function carrot(x, g, c = C.line) {
  g = clamp(g); if (g <= 0) return ''; let s = '';
  const L = 230 * g, w = 30 * g;
  s += `<path d="M${x - w},${GY + 4} Q${x - w * 0.8},${GY + L * 0.5} ${x},${GY + L} Q${x + w * 0.8},${GY + L * 0.5} ${x + w},${GY + 4} z" fill="${mix(C.bg, c, 0.12)}" stroke="${c}" stroke-width="3"/>`;
  for (let k = 1; k < 5; k++) { const yy = GY + L * k / 5, hw = w * (1 - k / 5) * 0.8; s += `<line x1="${x - hw}" y1="${yy}" x2="${x - hw + 14 * g}" y2="${yy + 4}" stroke="${c}" stroke-width="2"/>`; }
  for (let i = 0; i < 5; i++) { const a = -0.7 + i * 0.35, H = 170 * g; s += `<path d="M${x},${GY} q${Math.sin(a) * H * 0.2},${-H * 0.5} ${Math.sin(a) * H * 0.55},${-H * Math.cos(a)}" ${ST(c, 3)}/>`; }
  return s;
}
function potato(x, g, c = C.line) {
  g = clamp(g); if (g <= 0) return ''; let s = '';
  s += `<path d="M${x},${GY} L${x},${GY - 150 * g}" ${ST(c, 4)}/>`;
  [[-1, 0.4], [1, 0.62], [-1, 0.85], [1, 1]].forEach(([d, f]) => { const yy = GY - 150 * g * f; s += `<ellipse cx="${x + d * 30 * g}" cy="${yy}" rx="${28 * g}" ry="${15 * g}" transform="rotate(${d * -25} ${x + d * 30 * g} ${yy})" fill="${C.bg}" stroke="${c}" stroke-width="3"/>`; });
  [[-90, 120], [80, 170], [-20, 230]].forEach(([dx, dy], i) => {
    const tx = x + dx * g, ty = GY + dy * g;
    s += `<path d="M${x},${GY + 10} Q${x + dx * 0.3 * g},${GY + dy * 0.6 * g} ${tx},${ty}" ${ST(c, 2.5)}/>`;
    if (g > 0.4) s += `<ellipse cx="${tx}" cy="${ty}" rx="${44 * g}" ry="${30 * g}" fill="${mix(C.bg, c, 0.12)}" stroke="${c}" stroke-width="3"/>`;
  });
  return s;
}
function tomato(x, g, c = C.line, o = {}) {
  g = clamp(g); if (g <= 0) return ''; let s = '';
  const h = 260 * g;
  for (let i = 0; i < 5; i++) { const a = -0.8 + i * 0.4, L = 120 * g; s += `<path d="M${x},${GY} q${Math.sin(a) * L * 0.3},${L * 0.6} ${Math.sin(a) * L * 0.8},${L}" ${ST(c, 2.5)}/>`; }
  s += `<path d="M${x},${GY} C${x + 10},${GY - h * 0.4} ${x - 10},${GY - h * 0.7} ${x},${GY - h}" ${ST(c, 4)}/>`;
  [[-1, 0.3], [1, 0.5], [-1, 0.72], [1, 0.9]].forEach(([d, f]) => { const yy = GY - h * f; s += `<path d="M${x},${yy} q${d * 40 * g},-6 ${d * 70 * g},-34 q${-d * 10 * g},${24 * g} ${-d * 70 * g},${34 * g}" fill="${C.bg}" stroke="${c}" stroke-width="3"/>`; });
  if (g > 0.6) [[-1, 0.45], [1, 0.62], [1, 0.36]].forEach(([d, f]) => { const yy = GY - h * f; s += `<line x1="${x}" y1="${yy}" x2="${x + d * 32}" y2="${yy + 18}" stroke="${c}" stroke-width="2.5"/><circle cx="${x + d * 32}" cy="${yy + 38}" r="20" fill="${o.fruit || mix(C.bg, c, 0.15)}" stroke="${c}" stroke-width="3"/>`; });
  return s;
}
function cabbage(x, g, c = C.line) {
  g = clamp(g); if (g <= 0) return ''; let s = '';
  for (let i = 0; i < 5; i++) { const a = -0.8 + i * 0.4, L = 90 * g; s += `<path d="M${x},${GY} q${Math.sin(a) * L * 0.3},${L * 0.6} ${Math.sin(a) * L * 0.8},${L}" ${ST(c, 2.5)}/>`; }
  const R = 70 * g, cy = GY - R + 6;
  s += `<path d="M${x - R * 1.6},${GY - 4} Q${x - R * 1.3},${cy - R * 0.4} ${x - R * 0.3},${cy}" ${ST(c, 3)}/><path d="M${x + R * 1.6},${GY - 4} Q${x + R * 1.3},${cy - R * 0.4} ${x + R * 0.3},${cy}" ${ST(c, 3)}/>`;
  s += `<circle cx="${x}" cy="${cy}" r="${R}" fill="${C.bg}" stroke="${c}" stroke-width="3"/>`;
  s += `<path d="M${x - R * 0.7},${cy - R * 0.1} Q${x},${cy - R * 0.9} ${x + R * 0.7},${cy - R * 0.1}" ${ST(c, 2.5)}/><path d="M${x - R * 0.5},${cy + R * 0.35} Q${x},${cy - R * 0.3} ${x + R * 0.5},${cy + R * 0.35}" ${ST(c, 2.5)}/>`;
  return s;
}
// particella di azoto
function nDot(x, y, c, o = {}) {
  const r = o.r || 19, op = o.op ?? 1;
  return `<g opacity="${op.toFixed(3)}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${o.fill || C.bg}" stroke="${c}" stroke-width="3"/>` +
    T(x, y + 8.5, 'N', { f: 'mono', size: 24, fill: c, a: 'middle', w: 700 }) + '</g>';
}
// posizioni fisse delle particelle nel suolo (evitano i bordi e la zona etichetta)
const NPOS = Array.from({ length: 20 }, (_, i) => [300 + ((i * 7) % 20) * 60 + rnd(i + 3) * 30, GY + 70 + ((i * 3) % 5) * 46 + rnd(i + 50) * 20]);
function legendN(c, dot, top) {
  const x = 1500, y = SB - 58; // posizione unica, lontana dai bordi tratteggiati
  return nDot(x, y, dot || c, { r: 17 }) + lbl(x + 30, y + 8, 'AZOTO · ESEMPIO', { a: 'start', size: 24, fill: c });
}
// parassita (insetto) e fungo
function bug(x, y, k, c) {
  return `<g transform="translate(${x},${y}) scale(${k})"><ellipse cx="0" cy="0" rx="16" ry="11" fill="${C.bg}" stroke="${c}" stroke-width="3"/><circle cx="19" cy="0" r="6" fill="${c}"/>` +
    [-8, 0, 8].map(d => `<line x1="${d}" y1="-9" x2="${d - 4}" y2="-19" stroke="${c}" stroke-width="2.5"/><line x1="${d}" y1="9" x2="${d - 4}" y2="19" stroke="${c}" stroke-width="2.5"/>`).join('') + '</g>';
}
function fungus(x, y, k, c) {
  return `<g transform="translate(${x},${y}) scale(${k})" ${ST(c, 2.5)}><path d="M0,0 q20,-8 34,-26 M0,0 q-22,-4 -36,-20 M0,0 q4,22 -6,38 M0,0 q24,10 40,6 M17,-13 q10,4 16,0 M-18,-10 q-4,-12 -14,-14"/><circle cx="0" cy="0" r="4" fill="${c}"/></g>`;
}
// striscia dei 4 anni
const YEARS = [['ANNO 1', 'CEREALE'], ['ANNO 2', 'LEGUMINOSA'], ['ANNO 3', 'RADICE/TUBERO'], ['ANNO 4', 'FOGLIA/FRUTTO']];
function yearStrip(t, t0, active, o = {}) {
  let s = ''; const w = 330, gap = 34, x0 = 960 - (4 * w + 3 * gap) / 2, y = 150;
  YEARS.forEach(([a, b], i) => {
    const x = x0 + i * (w + gap), act = i === active, past = i < active;
    const fill = act ? C.ivory : past ? mix(C.bg, C.line, 0.14) : C.bg, ink = act ? C.ink : C.line;
    let g = `<rect x="${x}" y="${y}" width="${w}" height="92" rx="14" fill="${fill}" stroke="${C.line}" stroke-width="2.5"/>` +
      T(x + w / 2, y + 38, a, { f: 'mono', size: 26, fill: ink, a: 'middle', w: 700, ls: 3 }) + T(x + w / 2, y + 74, b, { f: 'mono', size: 24, fill: ink, a: 'middle', ls: 1 });
    if (i < 3) g += arrow(x + w + 4, y + 46, x + w + gap - 4, y + 46, C.line, 3);
    s += E(t, t0 + (o.cascade ? i * 0.12 : 0), g, { dy: o.cascade ? 16 : 0 });
  });
  return s;
}

// azoto dell'aria: coppia N–N (molecola), distinta dalla particella singola nel suolo
function nPair(x, y, c, o = {}) {
  const r = o.r || 17, a = (o.ang || 0) * Math.PI / 180, dx = Math.cos(a) * r * 1.15, dy = Math.sin(a) * r * 1.15, op = o.op ?? 1, f = o.fill || C.bg;
  const one = (cx, cy) => `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="${f}" stroke="${c}" stroke-width="3"/>` + T(cx, cy + 8, 'N', { f: 'mono', size: 24, fill: c, a: 'middle', w: 700 });
  return `<g opacity="${op.toFixed(3)}">${one(x - dx, y - dy)}${one(x + dx, y + dy)}</g>`;
}
