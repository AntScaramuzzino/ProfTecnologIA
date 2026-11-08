// «Come impara una macchina» — MC-INF-3-02 §2. Ogni scena: render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const capAt = def.capAt ?? null, nWords = sc.didascalia.split(' ').length;
  let D = L + sc.voce_dur + (o.tail ?? 0.6);
  if (capAt != null) D = Math.max(D, capAt + 1.0 + 0.3 * nWords + 0.2);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;

// ---- elementi ricorrenti del mondo "spazio dei dati" ----
// pseudo-casuale deterministico
function rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
// piano dei dati: assi + griglia tenue
function plane(x, y, w, h, o = {}) {
  const ink = o.ink || C.line; let s = '';
  for (let i = 1; i < 6; i++) s += `<line x1="${x + i * w / 6}" y1="${y}" x2="${x + i * w / 6}" y2="${y + h}" stroke="${ink}" stroke-width="1" opacity="0.12"/>`;
  for (let i = 1; i < 4; i++) s += `<line x1="${x}" y1="${y + i * h / 4}" x2="${x + w}" y2="${y + i * h / 4}" stroke="${ink}" stroke-width="1" opacity="0.12"/>`;
  s += `<path d="M${x},${y} L${x},${y + h} L${x + w},${y + h}" fill="none" stroke="${ink}" stroke-width="3"/>`;
  return s;
}
const dot = (x, y, r, ink, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill || ink}" stroke="${ink}" stroke-width="2.5"/>`;
// il modello: una scatola con tre manopole-parametro (niente volto, niente robot)
function modelBox(cx, cy, k, o = {}) {
  const ink = o.ink || C.line, w = 380 * k, h = 240 * k, x = cx - w / 2, y = cy - h / 2, ph = o.ph || [0.3, 0.7, 0.5];
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${18 * k}" fill="${o.fill || mix(C.bg, C.line, 0.08)}" stroke="${ink}" stroke-width="3"/>`;
  s += T(cx, y + 50 * k, 'MODELLO', { f: 'mono', size: 26 * k, fill: ink, a: 'middle', ls: 5, w: 700 });
  ph.forEach((p, i) => {
    const ly = y + (100 + i * 46) * k, lx = x + 50 * k, lw = w - 100 * k;
    s += `<line x1="${lx}" y1="${ly}" x2="${lx + lw}" y2="${ly}" stroke="${ink}" stroke-width="3" opacity="0.5" stroke-linecap="round"/>`;
    s += `<circle cx="${lx + lw * clamp(p)}" cy="${ly}" r="${12 * k}" fill="${o.knob || ink}"/>`;
  });
  if (o.label !== false) s += T(cx, y + h + 40 * k, 'PARAMETRI INTERNI', { f: 'mono', size: 24, fill: ink, a: 'middle', ls: 3, op: 0.85 });
  return s;
}
// busta stilizzata (email generica)
function envelope(x, y, w, ink, fill) {
  const h = w * 0.66;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill || 'none'}" stroke="${ink}" stroke-width="3"/>` +
    `<path d="M${x + 4},${y + 6} L${x + w / 2},${y + h * 0.55} L${x + w - 4},${y + 6}" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
}
function tag(x, y, s, ink, o = {}) {
  const w = tw(s, 'mono', o.size || 24) + 40 * 1 + (o.ls ? s.length * o.ls : 0);
  return `<rect x="${x}" y="${y}" width="${w}" height="${(o.size || 24) + 22}" rx="${((o.size || 24) + 22) / 2}" fill="${o.fill || 'none'}" stroke="${ink}" stroke-width="2.5"/>` +
    T(x + w / 2, y + (o.size || 24) * 1.15, s, { f: 'mono', size: o.size || 24, fill: o.tc || ink, a: 'middle', ls: o.ls });
}
const exLabel = (x, y, ink, a = 'end') => T(x, y, 'DATI DI ESEMPIO', { f: 'mono', size: 24, fill: ink || C.line, a, ls: 4, op: 0.85 });
function lightBg() { return `<rect width="1920" height="1080" fill="${C.ivory}"/><circle cx="1780" cy="1040" r="620" fill="url(#peach)"/>`; }
function push(t, D, cx, cy, g) { const k = 1 + 0.02 * t / D; return `<g transform="translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})">${g}</g>`; }

// dati di esempio per il piano: andamento crescente con rumore
const PX = 360, PY = 230, PW = 1080, PH = 560;
const PTS = Array.from({ length: 34 }, (_, i) => { const u = 0.04 + 0.7 * rnd(i + 1); return [u, clamp(0.12 + 0.78 * u + (rnd(i + 40) - 0.5) * 0.22, 0.05, 0.95)]; });
const toP = ([u, v]) => [PX + u * PW, PY + PH - v * PH];

