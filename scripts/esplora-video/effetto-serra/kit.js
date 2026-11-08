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
const F = { pop: "Pop, sans-serif", popm: "PopM, sans-serif", serif: "Serif, serif", mono: "Mono, monospace" };
function T(x, y, s, o = {}) {
  const f = F[o.f || 'popm'];
  return `<text x="${x}" y="${y}" font-family="${f}" font-size="${o.size || 32}" fill="${o.fill || C.line}"` +
    ` font-weight="${o.w || (o.f === 'pop' ? 800 : o.f === 'mono' ? 500 : 400)}" text-anchor="${o.a || 'start'}"` +
    `${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.it ? ' font-style="italic"' : ''}${o.op != null ? ` opacity="${o.op}"` : ''}>${o.raw ? s : esc(s)}</text>`;
}
// parole una alla volta (~110 ms), una parola chiave in corallo; larghezze misurate col font reale
const _ctx = document.createElement('canvas').getContext('2d');
const FW = { pop: 800, popm: 500, serif: 400, mono: 500 };
const FN = { pop: 'Pop', popm: 'PopM', serif: 'Serif', mono: 'Mono' };
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

// ---- mondo: la Terra in sezione ----
const EC = { cx: 960, cy: 2700, r: 1800, ra: 2080 };
const surfY = x => EC.cy - Math.sqrt(EC.r * EC.r - (x - EC.cx) ** 2);
const atmY = x => EC.cy - Math.sqrt(EC.ra * EC.ra - (x - EC.cx) ** 2);
function earth(o = {}) {
  const warm = o.warm || 0, ice = o.ice || 0;
  let s = `<circle cx="${EC.cx}" cy="${EC.cy}" r="${EC.ra}" fill="${mix(C.bg, C.line, 0.025 + (o.dense || 0) * 0.03)}" stroke="${C.lineDim}" stroke-width="2" stroke-dasharray="3 12"/>`;
  s += `<circle cx="${EC.cx}" cy="${EC.cy}" r="${EC.r}" fill="${C.earth}" stroke="${C.line}" stroke-width="${3 + warm * 2}"/>`;
  if (ice > 0) s += `<circle cx="${EC.cx}" cy="${EC.cy}" r="${EC.r - 7}" fill="none" stroke="${C.ivory}" stroke-width="14" opacity="${(ice * 0.8).toFixed(3)}"/>`;
  // segni del suolo
  for (let i = 0; i < 14; i++) { const x = 160 + i * 125, y = surfY(x) + 46 + (i % 3) * 22; s += `<line x1="${x}" y1="${y}" x2="${x + 34}" y2="${y}" stroke="${C.lineDim}" stroke-width="2" stroke-linecap="round"/>`; }
  if (o.labels !== false) {
    s += T(150, atmY(150) + 46, 'ATMOSFERA', { f: 'mono', size: 24, fill: C.line, ls: 4, op: 0.8 });
    s += T(960, surfY(960) + 64, 'SUPERFICIE', { f: 'mono', size: 24, fill: C.line, ls: 4, op: 0.8, a: 'middle' });
  }
  return s;
}
function sun(t, x = 290, y = 270) {
  let s = `<circle cx="${x}" cy="${y}" r="62" fill="${mix(C.bg, C.line, 0.12)}" stroke="${C.line}" stroke-width="3"/>`;
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2 + t * 0.15, r1 = 82, r2 = 104 + 5 * Math.sin(t * 2 + i);
    s += `<line x1="${x + r1 * Math.cos(a)}" y1="${y + r1 * Math.sin(a)}" x2="${x + r2 * Math.cos(a)}" y2="${y + r2 * Math.sin(a)}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
  }
  return s;
}
// onda lungo un segmento: lambda corta = luce visibile, lunga = infrarosso. p = avanzamento della testa (0..1)
function wave(x1, y1, x2, y2, p, o = {}) {
  p = clamp(p); if (p <= 0) return '';
  const lam = o.lam || 26, A = o.A || 7, ph = o.ph || 0, from = clamp(o.from || 0);
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy, ny = ux;
  const n = Math.max(2, Math.ceil(L * (p - from) / 6)); let d = '';
  for (let i = 0; i <= n; i++) {
    const s = L * (from + (p - from) * i / n), w = A * Math.sin((s / lam) * 2 * Math.PI - ph);
    d += (i ? 'L' : 'M') + (x1 + ux * s + nx * w).toFixed(1) + ',' + (y1 + uy * s + ny * w).toFixed(1);
  }
  let out = `<path d="${d}" fill="none" stroke="${o.c || C.line}" stroke-width="${o.sw || 3}" stroke-linecap="round" stroke-linejoin="round" opacity="${o.op ?? 1}"/>`;
  if (o.head !== false && p < 1) { const hx = x1 + ux * L * p, hy = y1 + uy * L * p; out += `<circle cx="${hx}" cy="${hy}" r="${(o.sw || 3) + 3}" fill="${o.c || C.line}"/>`; }
  return out;
}
function arrow(x1, y1, x2, y2, c, sw = 4) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 16;
  return `<line x1="${x1}" y1="${y1}" x2="${x2 - Math.cos(a) * 6}" y2="${y2 - Math.sin(a) * 6}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<path d="M${x2},${y2} L${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)} L${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)} z" fill="${c}"/>`;
}
// molecole originali: cerchi a filo
function atom(x, y, r, fill, stroke, label, lc) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + (label ? T(x, y + r * 0.36, label, { f: 'popm', size: r, fill: lc || stroke, a: 'middle', w: 500 }) : '');
}
function molecule(kind, x, y, o = {}) {
  const st = o.stroke || C.line, f = o.fill || mix(C.bg, C.line, 0.1), k = o.k || 1;
  const big = 20 * k, sm = 13 * k; let s = '';
  const bond = (ax, ay, bx, by) => `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${st}" stroke-width="3"/>`;
  if (kind === 'CO2') { s += bond(x - 40 * k, y, x + 40 * k, y) + atom(x - 40 * k, y, sm + 3 * k, f, st) + atom(x + 40 * k, y, sm + 3 * k, f, st) + atom(x, y, big, f, st); }
  if (kind === 'H2O') { s += bond(x, y, x - 30 * k, y + 26 * k) + bond(x, y, x + 30 * k, y + 26 * k) + atom(x - 30 * k, y + 26 * k, sm - 2 * k, f, st) + atom(x + 30 * k, y + 26 * k, sm - 2 * k, f, st) + atom(x, y, big - 2 * k, f, st); }
  if (kind === 'CH4') { [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => s += bond(x, y, x + a * 30 * k, y + b * 26 * k) + atom(x + a * 30 * k, y + b * 26 * k, sm - 3 * k, f, st)); s += atom(x, y, big - 2 * k, f, st); }
  if (kind === 'O3') { s += bond(x - 34 * k, y + 18 * k, x, y) + bond(x, y, x + 34 * k, y + 18 * k) + [[-34, 18], [0, 0], [34, 18]].map(([a, b]) => atom(x + a * k, y + b * k, sm + 2 * k, f, st)).join(''); }
  if (o.label) s += T(x + 62 * k, y + 8, o.label, { f: 'mono', size: 22, fill: o.lc || C.line, ls: 2 });
  return s;
}
// termometro: valore in °C mappato su -25..+30
function thermo(x, y, h, v, o = {}) {
  const ink = o.ink || C.line, lo = -25, hi = 30, tube = 34, top = y, bot = y + h;
  const vy = v2 => bot - (v2 - lo) / (hi - lo) * h;
  let s = `<rect x="${x - tube / 2}" y="${top}" width="${tube}" height="${h + 20}" rx="${tube / 2}" fill="${o.bgFill || C.bg}" stroke="${ink}" stroke-width="3"/>`;
  s += `<rect x="${x - 8}" y="${vy(v)}" width="16" height="${bot - vy(v) + 24}" rx="8" fill="${C.coral}"/>`;
  s += `<circle cx="${x}" cy="${bot + 44}" r="34" fill="${C.coral}" stroke="${ink}" stroke-width="3"/>`;
  (o.ticks || [-18, 0, 15]).forEach(tv => {
    s += `<line x1="${x + 24}" y1="${vy(tv)}" x2="${x + 40}" y2="${vy(tv)}" stroke="${ink}" stroke-width="2"/>` +
      T(x + 50, vy(tv) + 9, (tv > 0 ? '+' : tv < 0 ? '−' : '') + Math.abs(tv) + ' °C', { f: 'mono', size: 26, fill: ink });
  });
  if (o.label) s += T(x, bot + 120, o.label, { f: 'mono', size: 22, fill: ink, a: 'middle', ls: 2 });
  return s;
}
// barra capitoli (6 tessere) + titolo "N • TITOLO"
const CAPS = ['LUCE', 'CALORE', 'GAS', 'PIÙ GAS', 'COMBUSTIONE', 'RETROAZIONI'];
function chapterBar(t, cap, light) {
  const ink = light ? C.ink : C.line; let s = '';
  for (let i = 0; i < 6; i++) {
    const x = 1920 - 96 - (6 - i) * 58 + 10, y = 48, act = i + 1 === cap, past = i + 1 < cap;
    const fill = act ? C.coral : past ? mix(light ? C.ivory : C.bg, ink, 0.18) : 'none';
    s += `<rect x="${x}" y="${y}" width="46" height="46" rx="8" fill="${fill}" stroke="${act ? C.coral : ink}" stroke-width="2" opacity="${act || past ? 1 : 0.55}"/>`;
    s += T(x + 23, y + 31, act || past ? String(i + 1) : '?', { f: 'mono', size: 22, fill: act ? C.ivory : ink, a: 'middle', w: 700, op: act || past ? 1 : 0.6 });
  }
  if (cap > 0) {
    const lab = CAPS[cap - 1];
    s += E(t, -0.4, `<rect x="96" y="48" width="${86 + lab.length * 19}" height="46" rx="23" fill="${C.coral}"/>` +
      T(122, 80, `${cap}  •  ${lab}`, { f: 'mono', size: 22, fill: C.ivory, ls: 3, w: 700 }), { dy: 0 });
  }
  return s;
}
// didascalia overlay: a sinistra, bold, su sfumatura scura (registro scuro) o inchiostro (registro chiaro)
function caption(t, t0, s, key, light) {
  if (t < t0 - 0.05) return '';
  let g = light ? '' : `<rect x="0" y="880" width="1920" height="200" fill="url(#capfade)" opacity="${eo((t - t0) / 0.4)}"/>`;
  return g + words(t, t0, 96, 1006, s, { f: 'pop', size: 58, key, fill: light ? C.ink : C.line, cw: 0.62 });
}
// card crema con ombra piena sfalsata
function card(x, y, w, h, o = {}) {
  const r = o.rot || 0, cx = x + w / 2, cy = y + h / 2;
  return `<g transform="rotate(${r} ${cx} ${cy})"><rect x="${x + 12}" y="${y + 12}" width="${w}" height="${h}" rx="18" fill="${C.ink}"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/></g>`;
}
function lightBg() {
  return `<rect width="1920" height="1080" fill="${C.ivory}"/><circle cx="1780" cy="1040" r="620" fill="url(#peach)"/>`;
}
function loopRing(t, t0, cx, cy, r, labels, o = {}) {
  const n = labels.length, col = o.c || C.line; let s = '';
  const ang = i => -Math.PI / 2 + i * 2 * Math.PI / n, gap = i => (labels[i % n].length * 15 + 34) / 2 / r + 0.12;
  for (let i = 0; i < n; i++) {
    const p = eo((t - t0 - i * 0.35) / 0.6); if (p <= 0) continue;
    const a0 = ang(i) + gap(i), aEnd = ang(i + 1) - gap(i + 1), a1 = a0 + (aEnd - a0) * p;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    s += `<path d="M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`;
    const dx = -Math.sin(a1), dy = Math.cos(a1), h = 20;
    if (p > 0.1) s += `<path d="M${x1 + dx * 12},${y1 + dy * 12} L${x1 - dx * h + Math.cos(a1) * 11},${y1 - dy * h + Math.sin(a1) * 11} L${x1 - dx * h - Math.cos(a1) * 11},${y1 - dy * h - Math.sin(a1) * 11} z" fill="${col}"/>`;
  }
  labels.forEach((l, i) => {
    const a = ang(i), lx = cx + r * Math.cos(a), ly = cy + r * Math.sin(a), w = l.length * 15 + 34;
    s += E(t, t0 + i * 0.35 - 0.2, `<rect x="${lx - w / 2}" y="${ly - 22}" width="${w}" height="44" rx="22" fill="${C.bg}" stroke="${C.line}" stroke-width="2"/>` +
      T(lx, ly + 8, l, { f: 'mono', size: 24, fill: C.line, a: 'middle' }), { dy: 0 });
  });
  return s;
}
