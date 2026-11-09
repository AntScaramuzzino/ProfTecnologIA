// Kit — ogni funzione restituisce markup SVG, tutto calcolato da t (nessuno stato).
const C = { bg: '#0C0A09', coral: '#D97757', line: '#F0E6D8', ivory: '#F6F2E9' };
function hex(c) { return [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); }
function mix(a, b, p) {
  const A = hex(a), B = hex(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * p).toString(16).padStart(2, '0')).join('');
}
C.ink = C.bg; C.cream = mix(C.ivory, '#FFFFFF', 0.55);
C.lineDim = mix(C.bg, C.line, 0.38); C.fillD = mix(C.bg, C.line, 0.09); C.fillD2 = mix(C.bg, C.line, 0.16);

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
const _ctx = document.createElement('canvas').getContext('2d');
const FW = { pop: 800, popm: 500, serif: 400, mono: 500 };
const FN = { pop: 'Pop', popm: 'PopM', serif: 'ISerif', mono: 'Mono' };
function tw(s, f, size, it) { _ctx.font = `${it ? 'italic ' : ''}${FW[f]} ${size}px ${FN[f]}`; return _ctx.measureText(s).width; }
function words(t, t0, x, y, s, o = {}) {
  const ws = s.split(' '), key = (o.key || '').split(' ').filter(Boolean).map(k => k.replace(/[?,.]/g, ''));
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
function arrow(x1, y1, x2, y2, c, sw = 4, h = 18) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return `<line x1="${x1}" y1="${y1}" x2="${x2 - Math.cos(a) * 8}" y2="${y2 - Math.sin(a) * 8}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<path d="M${x2},${y2} L${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)} L${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)} z" fill="${c}"/>`;
}

// pacchetto: blocco con intestazione e numero d'ordine
function packet(x, y, n, o = {}) {
  const ink = o.ink || C.line, w = o.w || 112, h = o.h || 80, fill = o.fill || C.fillD2;
  let s = `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${o.stroke || ink}" stroke-width="${o.sw || 3.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
  if (!o.empty) {
    s += `<line x1="${x - w / 2}" y1="${y - h / 2 + h * 0.3}" x2="${x + w / 2}" y2="${y - h / 2 + h * 0.3}" stroke="${o.stroke || ink}" stroke-width="2.5"/>`;
    if (n != null) s += T(x, y + h * 0.33, String(n), { f: 'mono', size: o.ns || Math.round(h * 0.44), fill: o.nc || ink, a: 'middle', w: 700 });
  }
  return s;
}
// punto lungo una polilinea (p 0..1 sulla lunghezza)
function along(pts, p) {
  p = clamp(p); let L = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
  let d = p * L;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const q = seg[i] ? clamp(d / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; } d -= seg[i]; }
  return pts[pts.length - 1];
}
function poly(pts, ink, sw = 3, o = {}) {
  return `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
}
// linea che si disegna (p 0..1)
function drawLine(x1, y1, x2, y2, p, ink, sw = 3, o = {}) {
  p = clamp(p); if (p <= 0) return '';
  return `<line x1="${x1}" y1="${y1}" x2="${lerp(x1, x2, p)}" y2="${lerp(y1, y2, p)}" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
}
const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.line, ls: 3, a: o.a || 'middle', w: 600 });
function pillTag(x, y, s, ink, bg, o = {}) {
  const size = o.size || 28, w = tw(s, 'mono', size) + 44, xx = o.a === 'middle' ? x - w / 2 : x;
  return `<rect x="${xx}" y="${y - size - 7}" width="${w}" height="${size + 22}" rx="${(size + 22) / 2}" fill="${bg}" stroke="${o.stroke || ink}" stroke-width="${o.sw || 2.5}"/>` + T(xx + w / 2, y, s, { f: 'mono', size, fill: ink, a: 'middle', w: o.w || 500 });
}

// barra capitoli (6 tessere) + pillola "N • TITOLO"
const CAPS = ['EFFICIENZA', 'MASSA CRITICA', 'CIRCOLO VIZIOSO', 'CIRCOLO VIRTUOSO', 'CONFRONTO', 'INVESTIMENTI'];
function chapterBar(t, cap, light) {
  const ink = light ? C.ink : C.line; let s = '';
  for (let i = 0; i < 6; i++) {
    const x = 1920 - 96 - (6 - i) * 58 + 10, y = 48, act = i + 1 === cap, past = i + 1 < cap;
    const fill = act ? C.coral : past ? mix(light ? C.ivory : C.bg, ink, 0.18) : 'none';
    s += `<rect x="${x}" y="${y}" width="46" height="46" rx="8" fill="${fill}" stroke="${act ? C.coral : ink}" stroke-width="2"/>`;
    s += T(x + 23, y + 31, act || past ? String(i + 1) : '?', { f: 'mono', size: 24, fill: act ? C.ivory : ink, a: 'middle', w: 700 });
  }
  if (cap > 0) {
    const lab = `${cap}  •  ${CAPS[cap - 1]}`, w = tw(lab, 'mono', 24) + 3 * lab.length + 52;
    s += E(t, -0.4, `<rect x="96" y="48" width="${w}" height="50" rx="25" fill="${C.coral}"/>` +
      T(122, 81, lab, { f: 'mono', size: 24, fill: C.ivory, ls: 3, w: 700 }), { dy: 0 });
  }
  return s;
}
// didascalia: in basso a sinistra, Poppins 800
function caption(t, t0, s, key, light) {
  if (t < t0 - 0.05) return '';
  let g = light ? '' : `<rect x="0" y="860" width="1920" height="220" fill="url(#capfade)" opacity="${eo((t - t0) / 0.4)}"/>`;
  return g + words(t, t0, 96, 1010, s, { f: 'pop', size: 58, key, fill: light ? C.ink : C.line });
}
function card(x, y, w, h, o = {}) {
  const r = o.rot || 0, cx = x + w / 2, cy = y + h / 2;
  return `<g transform="rotate(${r} ${cx} ${cy})"><rect x="${x + 14}" y="${y + 14}" width="${w}" height="${h}" rx="18" fill="${C.ink}"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/></g>`;
}
function lightBg() {
  return `<rect width="1920" height="1080" fill="${C.ivory}"/><circle cx="1780" cy="1040" r="620" fill="url(#peach)"/>`;
}

// ---- mondo: mezzi di trasporto in line-art (vista laterale), y = piano di rotolamento ----
function wheel(x, y, r, ink, bg) {
  return `<circle cx="${x}" cy="${y - r}" r="${r}" fill="${bg}" stroke="${ink}" stroke-width="4"/><circle cx="${x}" cy="${y - r}" r="${r * 0.38}" fill="none" stroke="${ink}" stroke-width="3"/>`;
}
function winRow(x0, y0, n, w, h, gap, ink) {
  let s = ''; for (let i = 0; i < n; i++) s += `<rect x="${x0 + i * (w + gap)}" y="${y0}" width="${w}" height="${h}" rx="6" fill="none" stroke="${ink}" stroke-width="3"/>`;
  return s;
}
function bus(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, bg = o.bg || C.bg, fill = o.fill || C.fillD, w = 300 * k, h = 118 * k, x0 = x - w / 2, y0 = y - 16 * k - h;
  let s = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${18 * k}" fill="${fill}" stroke="${ink}" stroke-width="4"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
  if (!o.empty) {
    s += winRow(x0 + 64 * k, y0 + 16 * k, 4, 46 * k, 40 * k, 12 * k, ink);
    s += `<rect x="${x0 + 14 * k}" y="${y0 + 16 * k}" width="${36 * k}" height="${h - 30 * k}" rx="5" fill="none" stroke="${ink}" stroke-width="3"/>`;
    s += `<rect x="${x0 + w - 16 * k}" y="${y0 + 16 * k}" width="${16 * k}" height="${40 * k}" rx="4" fill="none" stroke="${ink}" stroke-width="3"/>`;
  }
  s += wheel(x0 + 70 * k, y, 22 * k, ink, bg) + wheel(x0 + w - 70 * k, y, 22 * k, ink, bg);
  return s;
}
function tram(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, bg = o.bg || C.bg, fill = o.fill || C.fillD, w = 340 * k, h = 110 * k, x0 = x - w / 2, y0 = y - 18 * k - h;
  let s = `<line x1="${x0 - 30 * k}" y1="${y0 - 52 * k}" x2="${x0 + w + 30 * k}" y2="${y0 - 52 * k}" stroke="${ink}" stroke-width="2.5"/>`;
  s += `<path d="M${x - 30 * k},${y0} L${x},${y0 - 52 * k} L${x + 30 * k},${y0} M${x - 18 * k},${y0 - 52 * k} L${x + 18 * k},${y0 - 52 * k}" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  s += `<path d="M${x0 + 24 * k},${y0} L${x0 + w - 24 * k},${y0} Q${x0 + w},${y0} ${x0 + w},${y0 + 30 * k} L${x0 + w},${y0 + h} L${x0},${y0 + h} L${x0},${y0 + 30 * k} Q${x0},${y0} ${x0 + 24 * k},${y0} z" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
  s += winRow(x0 + 22 * k, y0 + 20 * k, 6, 38 * k, 44 * k, 12 * k, ink);
  s += `<line x1="${x0 - 20 * k}" y1="${y}" x2="${x0 + w + 20 * k}" y2="${y}" stroke="${ink}" stroke-width="4"/>`;
  [0.12, 0.26, 0.74, 0.88].forEach(f => s += wheel(x0 + w * f, y, 13 * k, ink, bg));
  return s;
}
function metro(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, bg = o.bg || C.bg, fill = o.fill || C.fillD, w = 330 * k, h = 112 * k, x0 = x - w / 2, y0 = y - 16 * k - h;
  // galleria in sezione
  let s = `<path d="M${x0 - 40 * k},${y + 8 * k} L${x0 - 40 * k},${y0 - 10 * k} Q${x0 - 40 * k},${y0 - 56 * k} ${x0 + 10 * k},${y0 - 56 * k} L${x0 + w - 10 * k},${y0 - 56 * k} Q${x0 + w + 40 * k},${y0 - 56 * k} ${x0 + w + 40 * k},${y0 - 10 * k} L${x0 + w + 40 * k},${y + 8 * k}" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="10 8"/>`;
  s += `<path d="M${x0},${y0 + 14 * k} Q${x0},${y0} ${x0 + 14 * k},${y0} L${x0 + w - 40 * k},${y0} Q${x0 + w},${y0} ${x0 + w},${y0 + 50 * k} L${x0 + w},${y0 + h} L${x0},${y0 + h} z" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
  s += winRow(x0 + 20 * k, y0 + 22 * k, 5, 40 * k, 40 * k, 14 * k, ink);
  s += `<line x1="${x0 - 40 * k}" y1="${y}" x2="${x0 + w + 40 * k}" y2="${y}" stroke="${ink}" stroke-width="4"/>`;
  [0.12, 0.28, 0.72, 0.88].forEach(f => s += wheel(x0 + w * f, y, 13 * k, ink, bg));
  return s;
}
function train(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, bg = o.bg || C.bg, fill = o.fill || C.fillD, w = 350 * k, h = 120 * k, x0 = x - w / 2, y0 = y - 18 * k - h;
  let s = `<path d="M${x - 70 * k},${y0} L${x - 40 * k},${y0 - 40 * k} L${x - 10 * k},${y0} M${x - 58 * k},${y0 - 40 * k} L${x - 22 * k},${y0 - 40 * k}" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  s += `<path d="M${x0},${y0 + 10 * k} Q${x0},${y0} ${x0 + 10 * k},${y0} L${x0 + w - 70 * k},${y0} L${x0 + w},${y0 + 60 * k} L${x0 + w},${y0 + h} L${x0},${y0 + h} z" fill="${fill}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="M${x0 + w - 62 * k},${y0 + 14 * k} L${x0 + w - 20 * k},${y0 + 52 * k} L${x0 + w - 62 * k},${y0 + 52 * k} z" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  s += winRow(x0 + 20 * k, y0 + 22 * k, 5, 40 * k, 38 * k, 12 * k, ink);
  s += `<line x1="${x0 - 20 * k}" y1="${y}" x2="${x0 + w + 20 * k}" y2="${y}" stroke="${ink}" stroke-width="4"/>`;
  [0.1, 0.24, 0.76, 0.9].forEach(f => s += wheel(x0 + w * f, y, 14 * k, ink, bg));
  return s;
}
function car(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, bg = o.bg || C.bg, fill = o.fill || C.fillD, w = 200 * k;
  const x0 = x - w / 2;
  let s = `<path d="M${x0},${y - 16 * k} L${x0},${y - 52 * k} Q${x0},${y - 62 * k} ${x0 + 12 * k},${y - 64 * k} L${x0 + 46 * k},${y - 68 * k} L${x0 + 74 * k},${y - 100 * k} L${x0 + 140 * k},${y - 100 * k} L${x0 + 172 * k},${y - 68 * k} L${x0 + w - 8 * k},${y - 60 * k} Q${x0 + w},${y - 58 * k} ${x0 + w},${y - 48 * k} L${x0 + w},${y - 16 * k} z" fill="${fill}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="M${x0 + 58 * k},${y - 68 * k} L${x0 + 80 * k},${y - 90 * k} L${x0 + 104 * k},${y - 90 * k} L${x0 + 104 * k},${y - 68 * k} z M${x0 + 116 * k},${y - 68 * k} L${x0 + 116 * k},${y - 90 * k} L${x0 + 136 * k},${y - 90 * k} L${x0 + 158 * k},${y - 68 * k} z" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  s += wheel(x0 + 46 * k, y, 20 * k, ink, bg) + wheel(x0 + w - 46 * k, y, 20 * k, ink, bg);
  return s;
}
function person(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line;
  return `<circle cx="${x}" cy="${y - 74 * k}" r="${12 * k}" fill="none" stroke="${ink}" stroke-width="3.5"/>` +
    `<path d="M${x},${y - 60 * k} L${x},${y - 26 * k} M${x - 18 * k},${y - 48 * k} L${x},${y - 56 * k} L${x + 18 * k},${y - 48 * k} M${x - 14 * k},${y} L${x},${y - 26 * k} L${x + 14 * k},${y}" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// fermata: palo con cartello
function stop(x, y, o = {}) {
  const ink = o.ink || C.line;
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 230}" stroke="${ink}" stroke-width="5"/>` +
    `<rect x="${x - 44}" y="${y - 300}" width="88" height="70" rx="12" fill="${o.fill || C.fillD}" stroke="${ink}" stroke-width="4"/>` +
    T(x, y - 252, 'BUS', { f: 'mono', size: 28, fill: ink, a: 'middle', w: 700 });
}
// orologio: lancetta dei minuti a angolo a (giri)
function clock(x, y, r, turns, o = {}) {
  const ink = o.ink || C.line; let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.fill || C.fillD}" stroke="${ink}" stroke-width="4"/>`;
  for (let i = 0; i < 12; i++) { const a = i / 12 * 2 * Math.PI, r1 = r * (i % 3 ? 0.84 : 0.76); s += `<line x1="${x + Math.sin(a) * r1}" y1="${y - Math.cos(a) * r1}" x2="${x + Math.sin(a) * r * 0.92}" y2="${y - Math.cos(a) * r * 0.92}" stroke="${ink}" stroke-width="${i % 3 ? 2.5 : 4}"/>`; }
  const a = turns * 2 * Math.PI;
  s += `<line x1="${x}" y1="${y}" x2="${x + Math.sin(a) * r * 0.7}" y2="${y - Math.cos(a) * r * 0.7}" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="6" fill="${ink}"/>`;
  return s;
}
// freccina su/giù disegnata (niente glifi)
function updown(x, y, up, ink, sz = 22) {
  const d = up ? -1 : 1;
  return `<line x1="${x}" y1="${y - d * sz}" x2="${x}" y2="${y + d * sz * 0.6}" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M${x - sz * 0.6},${y + d * sz * 0.2} L${x},${y + d * sz} L${x + sz * 0.6},${y + d * sz * 0.2}" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// nodo del circolo: riquadro con freccia e testo (1 o 2 righe)
function node(x, y, up, lines, o = {}) {
  const ink = o.ink || C.line, size = o.size || 38;
  const tws = lines.map(l => tw(l, 'pop', size)), w = Math.max(...tws) + 130, h = lines.length * (size + 12) + 40;
  let s = `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="18" fill="${o.fill || C.bg}" stroke="${ink}" stroke-width="4"/>`;
  s += updown(x - w / 2 + 48, y, up, ink);
  lines.forEach((l, i) => s += T(x - w / 2 + 92, y - (lines.length - 1) * (size + 12) / 2 + size * 0.36 + i * (size + 12), l, { f: 'pop', size, fill: ink }));
  return { s, w, h };
}
// arco curvo con punta (quadratica), disegnato fino a p
function curveArrow(a, c, b, p, ink, sw = 5) {
  p = clamp(p); if (p <= 0) return '';
  const N = 40, pts = [];
  for (let i = 0; i <= N * p; i++) { const u = i / N; pts.push([(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]]); }
  if (pts.length < 2) return '';
  let s = poly(pts, ink, sw);
  if (p >= 0.999) { const [x2, y2] = pts[pts.length - 1], [x1, y1] = pts[pts.length - 3]; const an = Math.atan2(y2 - y1, x2 - x1), h = 22;
    s += `<path d="M${x2 + 4 * Math.cos(an)},${y2 + 4 * Math.sin(an)} L${x2 - h * Math.cos(an - 0.45)},${y2 - h * Math.sin(an - 0.45)} L${x2 - h * Math.cos(an + 0.45)},${y2 - h * Math.sin(an + 0.45)} z" fill="${ink}"/>`; }
  return s;
}
function qpt(a, c, b, u) { return [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]]; }
