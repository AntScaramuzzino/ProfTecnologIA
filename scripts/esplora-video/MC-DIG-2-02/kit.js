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
  const ws = s.split(' '), key = (o.key || '').split(' ').map(k => k.replace(/[?,.:]/g, ''));
  const f = o.f || 'popm', size = o.size || 56, sp = tw(' ', f, size, o.it);
  const wd = ws.map(w => tw(w, f, size, o.it)), total = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  let cx = o.a === 'middle' ? x - total / 2 : x, out = '';
  ws.forEach((w, i) => {
    const fill = key.includes(w.replace(/[?,.:]/g, '')) ? C.coral : (o.fill || C.line);
    out += E(t, t0 + i * 0.11, T(cx, y, w, { ...o, a: 'start', fill }), { d: 0.45, dy: 16 });
    cx += wd[i] + sp;
  });
  return out;
}

// ---- UI: tessere capitolo (5) + pillola ----
const CAPS = ['COOKIE', 'PROFILO', 'ANNUNCIO', 'ASTA'];
function chapterBar(t, cap, light) {
  const ink = light ? C.ink : C.line, n = CAPS.length; let s = '';
  for (let i = 0; i < n; i++) {
    const x = 1920 - 96 - (n - i) * 58 + 10, y = 48, act = i + 1 === cap, past = i + 1 < cap;
    const fill = act ? C.coral : past ? mix(light ? C.ivory : C.bg, ink, 0.18) : 'none';
    s += `<rect x="${x}" y="${y}" width="46" height="46" rx="8" fill="${fill}" stroke="${act ? C.coral : ink}" stroke-width="2" opacity="${act || past ? 1 : 0.6}"/>`;
    s += T(x + 23, y + 31, String(i + 1), { f: 'mono', size: 24, fill: act ? C.ivory : ink, a: 'middle', w: 700, op: act || past ? 1 : 0.6 });
  }
  if (cap > 0) {
    const lab = `${cap}  •  ${CAPS[cap - 1]}`, w = tw(lab, 'mono', 24) + 3 * lab.length + 52;
    s += `<rect x="96" y="48" width="${w}" height="50" rx="25" fill="${C.coral}"/>` + T(122, 81, lab, { f: 'mono', size: 24, fill: C.ivory, ls: 3, w: 700 });
  }
  return s;
}
// didascalia: parola chiave in corallo solo se key non vuota (cioè se il disegno non ha corallo)
function caption(t, t0, s, key, light) {
  if (t < t0 - 0.05) return '';
  let g = light ? '' : `<rect x="0" y="870" width="1920" height="210" fill="url(#capfade)" opacity="${eo((t - t0) / 0.4)}"/>`;
  return g + words(t, t0, 96, 1006, s, { f: 'pop', size: 58, key: key || '', fill: light ? C.ink : C.line });
}
function card(x, y, w, h, o = {}) {
  const r = o.rot || 0, cx = x + w / 2, cy = y + h / 2;
  return `<g transform="rotate(${r} ${cx} ${cy})"><rect x="${x + 12}" y="${y + 12}" width="${w}" height="${h}" rx="18" fill="${C.ink}"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/></g>`;
}
function lightBg() { return `<rect width="1920" height="1080" fill="${C.ivory}"/><circle cx="1780" cy="1040" r="620" fill="url(#peach)"/>`; }
function arrow(x1, y1, x2, y2, c, sw = 4) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 18;
  return `<line x1="${x1}" y1="${y1}" x2="${x2 - Math.cos(a) * 8}" y2="${y2 - Math.sin(a) * 8}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<path d="M${x2},${y2} L${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)} L${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)} z" fill="${c}"/>`;
}
const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.line, ls: 3, a: o.a || 'middle', w: 600 });
function pillTag(x, y, s, ink, bg, a = 'start') {
  const w = tw(s, 'mono', 26) + 3 * s.length + 40, x0 = a === 'middle' ? x - w / 2 : x;
  return `<rect x="${x0}" y="${y - 34}" width="${w}" height="48" rx="24" fill="${bg}" stroke="${ink}" stroke-width="2"/>` + T(x0 + w / 2, y, s, { f: 'mono', size: 26, fill: ink, a: 'middle', ls: 3, w: 600 });
}
const hsh = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---- mondo: finestre di browser e macchine della rete, in sezione a filo chiaro ----
const DIM = () => mix(C.bg, C.line, 0.10);
const NS = 'vector-effect="non-scaling-stroke"';
function shoe(x, y, sc, st, fill = 'none', sw = 4) { // scarpa generica (prodotto di esempio), riquadro 200x100
  return `<g transform="translate(${x},${y}) scale(${sc})"><path d="M6,86 L6,44 Q6,34 16,34 L58,34 Q70,34 80,46 L104,60 Q150,62 184,72 Q196,76 196,86 Z" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" ${NS}/>` +
    `<path d="M2,86 H200 V96 H2 Z" fill="${st}" ${NS}/>` +
    [[60, 44, 72, 38], [70, 52, 84, 45], [80, 58, 95, 52]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${st}" stroke-width="${sw * 0.7}" stroke-linecap="round" ${NS}/>`).join('') + '</g>';
}
// finestra di browser: dark = filo chiaro su fondo scuro; light = card crema con ombra piena
function win(x, y, w, h, o = {}) {
  const st = o.st || C.line, light = o.light; let s = '';
  if (light) s += `<rect x="${x + 12}" y="${y + 12}" width="${w}" height="${h}" rx="18" fill="${C.ink}"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${light ? C.cream : (o.fill || C.bg)}" stroke="${st}" stroke-width="${o.sw || 4}"/>`;
  const bh = o.bh || 60;
  s += `<line x1="${x}" y1="${y + bh}" x2="${x + w}" y2="${y + bh}" stroke="${st}" stroke-width="3"/>`;
  for (let i = 0; i < 3; i++) s += `<circle cx="${x + 30 + i * 26}" cy="${y + bh / 2}" r="8" fill="none" stroke="${st}" stroke-width="3"/>`;
  if (o.url != null) {
    s += `<rect x="${x + 120}" y="${y + 12}" width="${w - 150}" height="${bh - 24}" rx="${(bh - 24) / 2}" fill="none" stroke="${st}" stroke-width="2.5"/>`;
    if (o.url) s += T(x + 142, y + bh / 2 + 9, o.url, { f: 'mono', size: 24, fill: st, w: 500 });
  }
  return s;
}
function bars(x, y, w, n, st, gap = 34, th = 12) { // righe di testo stilizzate
  let s = '';
  for (let i = 0; i < n; i++) s += `<rect x="${x}" y="${y + i * gap}" width="${w * (i % 3 === 2 ? 0.62 : i % 3 === 1 ? 0.88 : 1)}" height="${th}" rx="${th / 2}" fill="${st}" opacity="0.55"/>`;
  return s;
}
function rack(x, y, w, st, t = 0, fill) { // server della rete pubblicitaria: 3 unità
  let s = '';
  for (let i = 0; i < 3; i++) {
    const yy = y + i * 92;
    s += `<rect x="${x}" y="${yy}" width="${w}" height="78" rx="10" fill="${fill || DIM()}" stroke="${st}" stroke-width="4"/>`;
    for (let k = 0; k < 4; k++) s += `<rect x="${x + 26 + k * 34}" y="${yy + 22}" width="20" height="34" rx="3" fill="none" stroke="${st}" stroke-width="2.5"/>`;
    for (let k = 0; k < 2; k++) { const on = Math.floor(t * 3 + i * 1.7 + k * 2.3) % 3 !== 0; s += `<circle cx="${x + w - 40 - k * 30}" cy="${yy + 39}" r="8" fill="${on ? st : 'none'}" stroke="${st}" stroke-width="2.5"/>`; }
  }
  return s;
}
function cookieFile(x, y, st, fill, o = {}) { // piccolo file di testo (120x150)
  const w = o.w || 120, h = o.h || 150, f = 34;
  let s = `<path d="M${x},${y} H${x + w - f} L${x + w},${y + f} V${y + h} H${x} Z" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M${x + w - f},${y} V${y + f} H${x + w}" fill="none" stroke="${st}" stroke-width="3" stroke-linejoin="round"/>`;
  for (let i = 0; i < 3; i++) s += `<rect x="${x + 18}" y="${y + 52 + i * 26}" width="${(w - 36) * (i === 2 ? 0.6 : 1)}" height="9" rx="4.5" fill="${o.ink || st}" opacity="0.8"/>`;
  return s;
}
function fingerprint(cx, cy, r, st) {
  let s = '';
  for (let i = 1; i <= 5; i++) { const rr = r * i / 5; s += `<path d="M${cx - rr},${cy + rr * 0.35} A${rr},${rr * 1.15} 0 1 1 ${cx + rr},${cy + rr * 0.35}" fill="none" stroke="${st}" stroke-width="3.5" stroke-linecap="round"/>`; }
  return s + `<line x1="${cx}" y1="${cy - r * 0.2}" x2="${cx}" y2="${cy + r * 0.5}" stroke="${st}" stroke-width="3.5" stroke-linecap="round"/>`;
}
function gavel(px, py, ang, st) { // martelletto d'asta: manico orizzontale, testa verticale a sinistra; ruota attorno all'impugnatura (px,py)
  const hx = px - 320;
  return `<g transform="rotate(${ang} ${px} ${py})"><rect x="${hx}" y="${py - 11}" width="330" height="22" rx="10" fill="${DIM()}" stroke="${st}" stroke-width="4"/>` +
    `<rect x="${hx - 48}" y="${py - 100}" width="96" height="200" rx="20" fill="${DIM()}" stroke="${st}" stroke-width="5"/>` +
    `<line x1="${hx - 48}" y1="${py - 62}" x2="${hx + 48}" y2="${py - 62}" stroke="${st}" stroke-width="3"/><line x1="${hx - 48}" y1="${py + 62}" x2="${hx + 48}" y2="${py + 62}" stroke="${st}" stroke-width="3"/></g>`;
}
