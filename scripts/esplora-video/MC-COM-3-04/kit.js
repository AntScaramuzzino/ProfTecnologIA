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

// ---- mondo: sistemi automatici in sezione (line-art) ----
// termostato a muro: piastra quadrata + ghiera graduata + indice
function thermostat(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, r = 92 * k; let s = `<rect x="${x - 130 * k}" y="${y - 130 * k}" width="${260 * k}" height="${260 * k}" rx="${30 * k}" fill="${o.fill || C.fillD}" stroke="${ink}" stroke-width="4"/>`;
  s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.bg || C.bg}" stroke="${ink}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="${r * 0.62}" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
  for (let i = 0; i <= 10; i++) { const a = (-225 + i * 27) * Math.PI / 180; s += `<line x1="${x + Math.cos(a) * r * 0.74}" y1="${y + Math.sin(a) * r * 0.74}" x2="${x + Math.cos(a) * r * 0.88}" y2="${y + Math.sin(a) * r * 0.88}" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>`; }
  const pa = (o.ang ?? -60) * Math.PI / 180; s += `<line x1="${x}" y1="${y}" x2="${x + Math.cos(pa) * r * 0.5}" y2="${y + Math.sin(pa) * r * 0.5}" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="${8 * k}" fill="${ink}"/>`;
  return s;
}
// braccio robotico: base, due segmenti, polso e pinza; angoli in gradi
function robotArm(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, f = o.fill || C.fillD, a1 = (o.a1 ?? -70) * Math.PI / 180, a2 = (o.a2 ?? 50) * Math.PI / 180;
  const L1 = 230 * k, L2 = 190 * k, jx = x + Math.cos(a1) * L1, jy = y - 60 * k + Math.sin(a1) * L1, ex = jx + Math.cos(a1 + a2) * L2, ey = jy + Math.sin(a1 + a2) * L2;
  let s = `<path d="M${x - 100 * k},${y + 30 * k} L${x + 100 * k},${y + 30 * k} L${x + 70 * k},${y - 30 * k} L${x - 70 * k},${y - 30 * k} z" fill="${f}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<rect x="${x - 40 * k}" y="${y - 75 * k}" width="${80 * k}" height="${48 * k}" rx="8" fill="${f}" stroke="${ink}" stroke-width="4"/>`;
  const seg = (x1, y1, x2, y2, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="${w + 8}" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${f === 'none' ? C.bg : C.bg}" stroke-width="${w}" stroke-linecap="round"/>`;
  s += seg(x, y - 60 * k, jx, jy, 44 * k) + seg(jx, jy, ex, ey, 34 * k);
  [[x, y - 60 * k, 30], [jx, jy, 26], [ex, ey, 20]].forEach(([cx, cy, r]) => s += `<circle cx="${cx}" cy="${cy}" r="${r * k}" fill="${C.bg}" stroke="${ink}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${6 * k}" fill="${ink}"/>`);
  const ga = a1 + a2, gx = ex + Math.cos(ga) * 36 * k, gy = ey + Math.sin(ga) * 36 * k, nx = -Math.sin(ga), ny = Math.cos(ga);
  s += `<line x1="${ex + Math.cos(ga) * 20 * k}" y1="${ey + Math.sin(ga) * 20 * k}" x2="${gx}" y2="${gy}" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>`;
  [-1, 1].forEach(sg => s += `<path d="M${gx + nx * 22 * k * sg},${gy + ny * 22 * k * sg} L${gx + nx * 22 * k * sg + Math.cos(ga) * 34 * k},${gy + ny * 22 * k * sg + Math.sin(ga) * 34 * k}" stroke="${ink}" stroke-width="6" stroke-linecap="round" fill="none"/>`);
  s += `<line x1="${gx - nx * 22 * k}" y1="${gy - ny * 22 * k}" x2="${gx + nx * 22 * k}" y2="${gy + ny * 22 * k}" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>`;
  return s;
}
// automobile di profilo
function car(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, f = o.fill || C.fillD;
  const P = [[-230, 0], [-230, -55], [-200, -70], [-110, -78], [-55, -130], [80, -130], [140, -80], [215, -65], [235, -40], [235, 0]].map(([a, b]) => [x + a * k, y + b * k]);
  let s = `<path d="M${P.map(p => p.join(',')).join(' L')} z" fill="${f}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="M${x - 95 * k},${y - 82 * k} L${x - 48 * k},${y - 120 * k} L${x + 5 * k},${y - 120 * k} L${x + 5 * k},${y - 82 * k} z M${x + 20 * k},${y - 82 * k} L${x + 20 * k},${y - 120 * k} L${x + 72 * k},${y - 120 * k} L${x + 115 * k},${y - 82 * k} z" fill="${C.bg}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  [-140, 140].forEach(d => s += `<circle cx="${x + d * k}" cy="${y}" r="${42 * k}" fill="${C.bg}" stroke="${ink}" stroke-width="4"/><circle cx="${x + d * k}" cy="${y}" r="${14 * k}" fill="none" stroke="${ink}" stroke-width="3"/>`);
  return s;
}
// drone (vista in prospettiva): corpo, 4 bracci, 4 eliche
function drone(x, y, k = 1, o = {}) {
  const ink = o.ink || C.line, f = o.fill || C.fillD; let s = '';
  const R = [[-170, -50], [170, -50], [-210, 40], [210, 40]].map(([a, b]) => [x + a * k, y + b * k]);
  R.forEach(([rx, ry]) => s += `<line x1="${x}" y1="${y}" x2="${rx}" y2="${ry}" stroke="${ink}" stroke-width="${10 * k}" stroke-linecap="round"/><line x1="${rx}" y1="${ry}" x2="${rx}" y2="${ry - 26 * k}" stroke="${ink}" stroke-width="5"/>`);
  s += `<ellipse cx="${x}" cy="${y}" rx="${80 * k}" ry="${34 * k}" fill="${f}" stroke="${ink}" stroke-width="4"/><ellipse cx="${x}" cy="${y - 8 * k}" rx="${40 * k}" ry="${14 * k}" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
  R.forEach(([rx, ry]) => s += `<ellipse cx="${rx}" cy="${ry - 28 * k}" rx="${78 * k}" ry="${15 * k}" fill="${C.bg}" fill-opacity="0.6" stroke="${ink}" stroke-width="3"/>`);
  return s;
}
// freccia circolare (simbolo di anello)
function loopIcon(x, y, r, ink, sw = 4) {
  const a0 = -60 * Math.PI / 180, a1 = 250 * Math.PI / 180, p = (a) => [x + Math.cos(a) * r, y + Math.sin(a) * r];
  const [sx, sy] = p(a0), [ex, ey] = p(a1), ta = a1 + Math.PI / 2, h = r * 0.42;
  return `<path d="M${sx},${sy} A${r},${r} 0 1 1 ${ex},${ey}" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<path d="M${ex + Math.cos(ta) * h * 0.6},${ey + Math.sin(ta) * h * 0.6} L${ex + Math.cos(ta - 2.4) * h},${ey + Math.sin(ta - 2.4) * h} L${ex + Math.cos(ta + 2.4) * h},${ey + Math.sin(ta + 2.4) * h} z" fill="${ink}"/>`;
}
// uscita rapida (per sostituire un elemento dentro la stessa scena)
function OUT(t, t1, inner, d = 0.3) { const q = clamp((t - t1) / d); if (q >= 1) return ''; return q > 0 ? `<g opacity="${(1 - q).toFixed(3)}">${inner}</g>` : inner; }
function pathOf(pts) { return 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L'); }
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
const CAPS = ['FEEDBACK', 'PID', 'PROPORZIONALE', 'INTEGRALE', 'DERIVATIVO', 'DOVE SI USA'];
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
