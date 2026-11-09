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
const _tc = {};
function tw(s, f, size, it) {
  const key = [s, f, size, it].join('|'); if (_tc[key] != null) return _tc[key];
  if (s === ' ') return (_tc[key] = tw('n n', f, size, it) - tw('nn', f, size, it));
  let m = document.getElementById('_meas');
  if (!m) { m = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); m.id = '_meas'; m.setAttribute('style', 'position:absolute;left:-9999px;top:0'); document.body.appendChild(m); }
  m.innerHTML = T(0, 50, s, { f, size, it }); const w = m.firstChild.getComputedTextLength();
  return (_tc[key] = w);
}
function words(t, t0, x, y, s, o = {}) {
  // un solo <text> con un <tspan> per parola: spaziatura gestita dal browser (niente sovrapposizioni)
  const ws = s.split(' '), key = (o.key || '').split(' ').map(k => k.replace(/[?,.]/g, ''));
  const f = F[o.f || 'popm'], size = o.size || 56, w8 = o.w || (o.f === 'pop' ? 800 : o.f === 'mono' ? 500 : 400);
  if (t < t0) return '';
  let inner = '', prev = 0;
  ws.forEach((w, i) => {
    const p = eo((t - t0 - i * 0.11) / 0.45), off = (1 - p) * 16, dy = off - prev; prev = off;
    const fill = key.includes(w.replace(/[?,.]/g, '')) ? C.coral : (o.fill || C.line);
    inner += (i ? ' ' : '') + `<tspan dy="${dy.toFixed(2)}" fill="${fill}" fill-opacity="${p.toFixed(3)}">${esc(w)}</tspan>`;
  });
  return `<text x="${x}" y="${y}" font-family="${f}" font-size="${size}" font-weight="${w8}" text-anchor="${o.a || 'start'}"${o.it ? ' font-style="italic"' : ''} xml:space="preserve">${inner}</text>`;
}

// barra capitoli (4 tessere) + titolo "N • TITOLO"
const CAPS = ['IL VIAGGIO A 4 °C', 'SE SI SPEZZA', 'COLD CHAIN', 'PRODOTTO SCARTATO'];
function chapterBar(t, cap, light) {
  const ink = light ? C.ink : C.line; let s = '';
  for (let i = 0; i < 4; i++) {
    const x = 1920 - 96 - (4 - i) * 58 + 10, y = 48, act = i + 1 === cap, past = i + 1 < cap;
    const fill = act ? C.coral : past ? mix(light ? C.ivory : C.bg, ink, 0.18) : 'none';
    s += `<rect x="${x}" y="${y}" width="46" height="46" rx="8" fill="${fill}" stroke="${act ? C.coral : ink}" stroke-width="2"/>`;
    s += T(x + 23, y + 32, act || past ? String(i + 1) : '?', { f: 'mono', size: 24, fill: act ? C.ivory : ink, a: 'middle', w: 700 });
  }
  if (cap > 0) {
    const txt = `${cap}  •  ${CAPS[cap - 1]}`, w = tw(txt, 'mono', 24) + txt.length * 3 + 52;
    s += E(t, -0.4, `<rect x="96" y="48" width="${w}" height="46" rx="23" fill="${C.coral}"/>` +
      T(122, 80, txt, { f: 'mono', size: 24, fill: C.ivory, ls: 3, w: 700 }), { dy: 0 });
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
