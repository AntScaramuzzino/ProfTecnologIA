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
  const a = Math.atan2(y2 - y1, x2 - x1), h = 14 + sw * 2;
  return `<line x1="${x1}" y1="${y1}" x2="${x2 - Math.cos(a) * 6}" y2="${y2 - Math.sin(a) * 6}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<path d="M${x2},${y2} L${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)} L${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)} z" fill="${c}"/>`;
}
// barra capitoli (5 tessere) + titolo "N • TITOLO"
const CAPS = ['RISCHIO', 'TAGLIO', 'ISOLAMENTO', 'CONTROVENTI', 'DISSIPATORI'];
function chapterBar(t, cap, light) {
  const ink = light ? C.ink : C.line; let s = '';
  for (let i = 0; i < CAPS.length; i++) {
    const x = 1920 - 96 - (CAPS.length - i) * 58 + 10, y = 48, act = i + 1 === cap, past = i + 1 < cap;
    const fill = act ? C.coral : past ? mix(light ? C.ivory : C.bg, ink, 0.18) : 'none';
    s += `<rect x="${x}" y="${y}" width="46" height="46" rx="8" fill="${fill}" stroke="${act ? C.coral : ink}" stroke-width="2" opacity="${act || past ? 1 : 0.55}"/>`;
    s += T(x + 23, y + 31, act || past ? String(i + 1) : '?', { f: 'mono', size: 24, fill: act ? C.ivory : ink, a: 'middle', w: 700, op: act || past ? 1 : 0.6 });
  }
  if (cap > 0) {
    const lab = CAPS[cap - 1];
    s += E(t, -0.4, `<rect x="96" y="48" width="${100 + lab.length * 21}" height="50" rx="23" fill="${C.coral}"/>` +
      T(122, 81, `${cap}  •  ${lab}`, { f: 'mono', size: 24, fill: C.ivory, ls: 3, w: 700 }), { dy: 0 });
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

// ---- mondo: l'edificio in sezione sul suolo ----
const FILL = () => mix(C.bg, C.line, 0.07);
// suolo in sezione: fascia con tratteggio che si muove con dx
function ground(y, dx, o = {}) {
  const ink = o.ink || C.line, bg = o.bg || C.bg, h = o.h || 200;
  let s = `<g transform="translate(${dx.toFixed(2)},0)"><rect x="-300" y="${y}" width="2520" height="${h}" fill="${mix(bg, ink, 0.06)}"/>`;
  s += `<line x1="-300" y1="${y}" x2="2220" y2="${y}" stroke="${ink}" stroke-width="4"/>`;
  for (let x = -280; x < 2220; x += 46) s += `<line x1="${x}" y1="${y + 18}" x2="${x - 30}" y2="${y + 48}" stroke="${ink}" stroke-width="2" opacity="0.4"/>`;
  return s + (o.inner || '') + '</g>';
}
// telaio di n piani: pilastri (3), solai, finestre. dx = spostamento della base, drift = spostamento in più in cima
function building(cx, baseY, o = {}) {
  const n = o.n || 4, w = o.w || 520, fh = o.fh || 110, dx = o.dx || 0, dr = o.drift || 0;
  const ink = o.ink || C.line, bg = o.bg || C.bg, fill = o.fill || mix(bg, ink, 0.07);
  const off = k => dx + dr * Math.pow(k / n, o.shape || 1), Y = k => baseY - k * fh;
  let s = '';
  for (let k = 0; k < n; k++) {
    const a = off(k), b = off(k + 1), y0 = Y(k), y1 = Y(k + 1);
    s += `<path d="M${cx - w / 2 + a},${y0} L${cx + w / 2 + a},${y0} L${cx + w / 2 + b},${y1} L${cx - w / 2 + b},${y1} z" fill="${fill}"/>`;
    [-w / 2, 0, w / 2].forEach(px => s += `<line x1="${cx + px + a}" y1="${y0}" x2="${cx + px + b}" y2="${y1}" stroke="${ink}" stroke-width="7"/>`);
    const m = (a + b) / 2;
    [-w / 4, w / 4].forEach(px => s += `<rect x="${cx + px + m - 46}" y="${y0 - fh + 34}" width="92" height="${fh - 62}" rx="4" fill="${bg}" stroke="${ink}" stroke-width="3"/>` +
      `<line x1="${cx + px + m}" y1="${y0 - fh + 34}" x2="${cx + px + m}" y2="${y0 - 28}" stroke="${ink}" stroke-width="2"/>`);
  }
  for (let k = 0; k <= n; k++) s += `<rect x="${cx - w / 2 - 22 + off(k)}" y="${Y(k) - 9}" width="${w + 44}" height="18" rx="3" fill="${bg}" stroke="${ink}" stroke-width="4"/>`;
  return s;
}
// isolatore: blocco a strati gomma/acciaio; sh = spostamento orizzontale della piastra superiore
function isolator(x, yb, w, h, sh, o = {}) {
  const ink = o.ink || C.line, bg = o.bg || C.bg, rub = o.rub || mix(bg, ink, 0.22), nl = o.nl || 5, pl = o.pl || Math.max(6, h * 0.14);
  const top = yb - h, X = y => x + sh * (yb - pl - y) / (h - 2 * pl);
  let s = `<rect x="${x - w / 2}" y="${yb - pl}" width="${w}" height="${pl}" fill="${bg}" stroke="${ink}" stroke-width="${o.sw || 3}"/>`;
  s += `<rect x="${x - w / 2 + sh}" y="${top}" width="${w}" height="${pl}" fill="${bg}" stroke="${ink}" stroke-width="${o.sw || 3}"/>`;
  const iw = w * 0.86, y0 = yb - pl, y1 = top + pl;
  s += `<path d="M${X(y0) - iw / 2},${y0} L${X(y0) + iw / 2},${y0} L${X(y1) + iw / 2},${y1} L${X(y1) - iw / 2},${y1} z" fill="${rub}" stroke="${o.outline || ink}" stroke-width="${o.osw || o.sw || 3}"/>`;
  for (let i = 1; i < nl; i++) { const y = y0 - (y0 - y1) * i / nl; s += `<line x1="${X(y) - iw / 2}" y1="${y}" x2="${X(y) + iw / 2}" y2="${y}" stroke="${ink}" stroke-width="${o.lw || 3}"/>`; }
  return s;
}
// leader: etichetta mono con trattino verso un punto
function tag(x, y, s, o = {}) {
  const ink = o.ink || C.line, size = o.size || 26;
  if (o.box) { const w = tw(s, 'mono', size) + s.length * 3 + 28, x0 = o.a === 'middle' ? x - w / 2 : o.a === 'end' ? x - w + 14 : x - 14;
    return `<rect x="${x0}" y="${y - size - 8}" width="${w}" height="${size + 24}" rx="6" fill="${o.bg || C.bg}"/>` + tag(x, y, s, { ...o, box: false }); }
  return T(x, y, s, { f: 'mono', size, fill: ink, ls: 3, a: o.a || 'start', w: 600 });
}
