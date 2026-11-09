// Il ciclo economico — MC-SIS-3-01 §"Il ciclo economico: espansione, picco, recessione, ripresa". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.35);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.5);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 44, fill: o.fill || C.line, a: o.a || 'start' });
const lblI = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.ink, ls: 3, a: o.a || 'middle', w: 700 });
const DIMC = () => mix(C.bg, C.line, 0.30);

// ---- mondo: il grafico del ciclo (crescita del PIL nel tempo) sopra una città in sezione ----
const UA = 0.2, UB = 1.3;                                    // dominio del ciclo mostrato
const G = u => 0.3 - 0.8 * Math.cos(2 * Math.PI * u);         // andamento schematico (esempio)
const PH = [['ESPANSIONE', 0.2, 0.44], ['PICCO', 0.44, 0.56], ['RECESSIONE', 0.56, 1.0], ['RIPRESA', 1.0, 1.3]];
function CH(o = {}) {
  const b = { x0: 300, x1: 1640, y0: 190, y1: 540, ...o };
  b.X = u => b.x0 + (u - UA) / (UB - UA) * (b.x1 - b.x0);
  b.Y = g => b.y1 - (g + 0.6) / 1.8 * (b.y1 - b.y0);
  return b;
}
function cpath(b, a, z, n = 160) {
  let d = ''; const m = Math.max(1, Math.round(n * (z - a) / (UB - UA)));
  for (let i = 0; i <= m; i++) { const u = a + (z - a) * i / m; d += (i ? 'L' : 'M') + b.X(u).toFixed(1) + ',' + b.Y(G(u)).toFixed(1); }
  return d;
}
// assi, linea dello zero, bande delle fasi (solo la/e etichetta/e indicata/e)
function axes(b, st, showPh, light) {
  const z = b.Y(0);
  let s = `<path d="M${b.x0},${b.y0 - 20} V${b.y1 + 10} " fill="none" stroke="${st}" stroke-width="4"/><path d="M${b.x0},${b.y0 - 34} l-9,16 h18 z" fill="${st}"/>`;
  s += `<line x1="${b.x0}" y1="${z}" x2="${b.x1 + 20}" y2="${z}" stroke="${st}" stroke-width="3"/><path d="M${b.x1 + 36},${z} l-16,-9 v18 z" fill="${st}"/>`;
  s += T(b.x0 - 22, z + 10, '0', { f: 'mono', size: 30, fill: st, a: 'end', w: 700 });
  s += T(b.x0 + 22, b.y0 - 6, 'CRESCITA DEL PIL', { f: 'mono', size: 26, fill: st, ls: 3, w: 600 });
  s += T(b.x1 + 36, z + 44, 'TEMPO', { f: 'mono', size: 26, fill: st, ls: 3, w: 600, a: 'end' });
  s += T(b.x1 + 36, b.y0 - 6, 'ESEMPIO', { f: 'mono', size: 26, fill: st, ls: 3, w: 600, a: 'end' });
  // bande delle fasi sotto il grafico
  const by = b.y1 + 34;
  PH.forEach(([n, a, zz], i) => {
    if (i > 0) s += `<line x1="${b.X(a)}" y1="${by - 18}" x2="${b.X(a)}" y2="${by + 40}" stroke="${st}" stroke-width="3" opacity="0.5"/>`;
    if (showPh && showPh.includes(n)) s += T((b.X(a) + b.X(zz)) / 2, by + 30, n, { f: 'mono', size: 26, fill: st, a: 'middle', ls: 3, w: 700 });
  });
  s += `<line x1="${b.x0}" y1="${by - 18}" x2="${b.x1}" y2="${by - 18}" stroke="${st}" stroke-width="2" opacity="0.5"/>`;
  return s;
}
function city(y, st, op = 1) { // skyline in sezione, a filo
  let s = `<g opacity="${op}">`, x = 60;
  for (let i = 0; x < 1860; i++) {
    const w = 70 + Math.floor(hsh(i) * 90), h = 50 + Math.floor(hsh(i + 40) * 130);
    s += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${C.bg}" stroke="${st}" stroke-width="3"/>`;
    for (let r = 0; r < Math.floor(h / 34); r++) for (let c = 0; c < Math.floor(w / 30); c++)
      if (hsh(i * 31 + r * 7 + c) > 0.45) s += `<rect x="${x + 12 + c * 30}" y="${y - h + 14 + r * 34}" width="12" height="14" fill="${st}"/>`;
    x += w + 8;
  }
  return s + `<line x1="40" y1="${y}" x2="1880" y2="${y}" stroke="${st}" stroke-width="3"/></g>`;
}
// icone
function person(cx, cy, st, fill) {
  return `<circle cx="${cx}" cy="${cy - 34}" r="24" fill="${fill}" stroke="${st}" stroke-width="4"/><path d="M${cx - 46},${cy + 46} C${cx - 46},${cy} ${cx - 26},${cy - 4} ${cx},${cy - 4} C${cx + 26},${cy - 4} ${cx + 46},${cy} ${cx + 46},${cy + 46} Z" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
}
function factory(cx, cy, st, fill) {
  return `<path d="M${cx - 70},${cy + 46} V${cy - 6} L${cx - 34},${cy - 30} V${cy - 6} L${cx + 2},${cy - 30} V${cy - 6} L${cx + 38},${cy - 30} V${cy - 6} H${cx + 70} V${cy + 46} Z" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>` +
    `<rect x="${cx + 44}" y="${cy - 66}" width="18" height="60" fill="${fill}" stroke="${st}" stroke-width="4"/>` +
    [-48, -16, 16].map(d => `<rect x="${cx + d}" y="${cy + 10}" width="20" height="18" fill="${st}"/>`).join('');
}
function cart(cx, cy, st, fill) {
  return `<path d="M${cx - 76},${cy - 40} H${cx - 56} L${cx - 38},${cy + 18} H${cx + 50} L${cx + 66},${cy - 26} H${cx - 50}" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<circle cx="${cx - 26}" cy="${cy + 40}" r="10" fill="${fill}" stroke="${st}" stroke-width="4"/><circle cx="${cx + 38}" cy="${cy + 40}" r="10" fill="${fill}" stroke="${st}" stroke-width="4"/>`;
}
function bank(cx, cy, s, st, fill) {
  let g = `<path d="M${cx - 90 * s},${cy - 40 * s} L${cx},${cy - 92 * s} L${cx + 90 * s},${cy - 40 * s} Z" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
  for (let i = 0; i < 4; i++) g += `<rect x="${cx - 70 * s + i * 40 * s}" y="${cy - 30 * s}" width="${20 * s}" height="${80 * s}" fill="${fill}" stroke="${st}" stroke-width="4"/>`;
  return g + `<rect x="${cx - 100 * s}" y="${cy + 54 * s}" width="${200 * s}" height="${22 * s}" fill="${fill}" stroke="${st}" stroke-width="4"/>`;
}
function coin(cx, cy, r, st, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="none" stroke="${st}" stroke-width="2.5"/>` +
    T(cx, cy + r * 0.36, '€', { f: 'pop', size: r * 1.0, fill: st, a: 'middle' });
}
function tag(cx, cy, st, fill) {
  return `<path d="M${cx - 80},${cy - 44} H${cx + 50} L${cx + 92},${cy} L${cx + 50},${cy + 44} H${cx - 80} Z" fill="${fill}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/><circle cx="${cx + 52}" cy="${cy}" r="9" fill="none" stroke="${st}" stroke-width="4"/>` +
    T(cx - 18, cy + 18, '€', { f: 'pop', size: 54, fill: st, a: 'middle' });
}
function upDown(x, y, up, c, len = 70) { return up ? arrow(x, y + len / 2, x, y - len / 2, c, 7) : arrow(x, y - len / 2, x, y + len / 2, c, 7); }
// pannello indicatore: icona + freccia + etichetta
function indicator(t, t0, cx, cy, icon, label, up, ac) {
  return E(t, t0, icon(cx - 40, cy, C.line, C.bg) + upDown(cx + 80, cy, up, ac) + lbl(cx + 10, cy + 112, label, { size: 28 }), { dy: 16 });
}

// 1 — non lineare: un ciclo con quattro fasi
scene('intro', { make: (W) => ({
  capAt: W('ciclo'), last: W('ciclo') + 1.2,
  render(t) {
    const b = CH({ y0: 200, y1: 600 }), st = C.line; let s = '';
    s += E(t, 0.05, city(860, DIMC(), 1), { dy: 10 });
    s += E(t, 0.15, axes(b, st, null), { dy: 0 });
    // la retta "lineare e continua" (tratteggiata) che non descrive la realtà
    const pl = clamp((t - W('lineare') + 0.1) / 0.7);
    if (pl > 0) {
      const xa = b.X(UA), ya = b.Y(-0.1), xb = lerp(xa, b.X(UB), pl), yb = lerp(ya, b.Y(1.0), pl);
      const fade = t > W('seguono') ? lerp(1, 0.35, clamp((t - W('seguono')) / 0.5)) : 1;
      s += `<line x1="${xa}" y1="${ya}" x2="${xb}" y2="${yb}" stroke="${st}" stroke-width="4" stroke-dasharray="14 12" opacity="${fade}"/>`;
      s += E(t, W('lineare'), lbl(b.X(1.12), b.Y(1.0) - 34, 'LINEARE?', { size: 26 }), { dy: 0 });
    }
    // il ciclo (corallo)
    const pc = clamp((t - W('ciclo') + 0.1) / 1.6);
    if (pc > 0) s += `<path d="${cpath(b, UA, UA + (UB - UA) * pc)}" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
    // quattro fasi
    PH.forEach(([n, a, z], i) => { s += E(t, W('ciclo') - 0.1 + 1.6 * (a - UA) / (UB - UA) + 0.15, T((b.X(a) + b.X(z)) / 2, b.y1 + 64, n, { f: 'mono', size: 26, fill: st, a: 'middle', ls: 3, w: 700 }), { dy: 10 }); });
    return s + caption(t, W('ciclo'), 'Un ciclo, quattro fasi', '');
  } }) });

// grafico con un tratto evidenziato in corallo che avanza
function phaseChart(t, b, a, z, t0, dur, ph, extra) {
  let s = axes(b, C.line, ph);
  s += `<path d="${cpath(b, UA, UB)}" fill="none" stroke="${DIMC()}" stroke-width="5" stroke-linecap="round"/>`;
  const p = clamp((t - t0) / dur);
  if (p > 0) {
    const u = a + (z - a) * eio(p);
    s += `<path d="${cpath(b, a, u)}" fill="none" stroke="${C.coral}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<circle cx="${b.X(u)}" cy="${b.Y(G(u))}" r="13" fill="${C.coral}"/>`;
  }
  return s + (extra || '');
}

// 2 — espansione
scene('espansione', { make: (W) => ({
  capAt: W('cresce'), last: W('aziende'),
  render(t) {
    const b = CH({ y0: 170, y1: 450 }); let s = '';
    s += phaseChart(t, b, 0.2, 0.44, W('espansione'), W('cresce') + 0.4 - W('espansione'), ['ESPANSIONE']);
    s += indicator(t, W('disoccupazione') - 0.05, 520, 680, person, 'DISOCCUPAZIONE', false, C.line);
    s += indicator(t, W('consumi') - 0.05, 960, 680, cart, 'CONSUMI', true, C.line);
    s += indicator(t, W('aziende') - 0.05, 1400, 680, factory, 'INVESTIMENTI', true, C.line);
    return s + caption(t, W('cresce'), "L'economia cresce", '');
  } }) });

// 3 — prestiti facili, la fase si autoalimenta (chiaro)
scene('prestiti', { make: (W) => ({
  capAt: W('si'), last: W('autoalimenta') - 0.05,
  render(t) {
    const ink = C.ink, f = C.ivory; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 680), { dy: 0 });
    s += E(t, W('banche') - 0.1, bank(470, 460, 1.25, ink, f) + lblI(470, 620, 'BANCHE'), { dy: 16 });
    s += E(t, W('prestiti') - 0.1, arrow(640, 440, 820, 440, ink, 5) + lblI(730, 400, 'PRESTITI', { size: 26 }) +
      coin(880, 420, 40, ink, f) + coin(930, 470, 40, ink, f) + IT(905, 620, 'facilmente', { size: 46, a: 'middle', fill: ink }), { dy: 16 });
    // anello che gira: la fase positiva si autoalimenta (unico elemento corallo)
    const cx = 1400, cy = 450, r = 150, p = clamp((t - W('fase') + 0.1) / 0.9);
    if (p > 0) {
      const rot = (t - W('fase')) * 40;
      let ring = '';
      for (let k = 0; k < 3; k++) {
        const a0 = k * 120 + 12, a1 = k * 120 + 12 + 96 * p;
        const P = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
        const [x0, y0] = P(a0), [x1, y1] = P(a1), ar = a1 * Math.PI / 180, tx = -Math.sin(ar), ty = Math.cos(ar), rx = Math.cos(ar), ry = Math.sin(ar);
        ring += `<path d="M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}" fill="none" stroke="${C.coral}" stroke-width="12" stroke-linecap="round"/>`;
        if (p > 0.9) ring += `<path d="M${x1 + tx * 30},${y1 + ty * 30} L${x1 + rx * 22},${y1 + ry * 22} L${x1 - rx * 22},${y1 - ry * 22} z" fill="${C.coral}"/>`;
      }
      s += `<g transform="rotate(${rot.toFixed(2)} ${cx} ${cy})" opacity="${clamp(p * 3)}">${ring}</g>`;
    }
    s += E(t, W('fase') - 0.05, lblI(cx, cy - 10, 'FASE', { size: 30 }) + lblI(cx, cy + 34, 'POSITIVA', { size: 30 }), { dy: 10 });
    s += E(t, W('autoalimenta') - 0.05, IT(cx, 690, 'si autoalimenta', { size: 52, a: 'middle', fill: ink }), { dy: 12 });
    return s + caption(t, W('si'), 'Si autoalimenta', '', true);
  } }) });

// 4 — picco
scene('picco', { make: (W) => ({
  capAt: W('crescita'), last: W('raggiunge'),
  render(t) {
    const b = CH({ y0: 230, y1: 600 }); let s = '';
    s += phaseChart(t, b, 0.38, 0.5, W('picco'), 1.0, ['PICCO']);
    const xp = b.X(0.5), yp = b.Y(G(0.5));
    s += E(t, W('raggiunge') - 0.05, `<line x1="${b.x0}" y1="${yp}" x2="${xp - 30}" y2="${yp}" stroke="${C.line}" stroke-width="3" stroke-dasharray="10 10"/>` +
      lbl(b.x0 + 40, yp - 22, 'MASSIMO', { a: 'start', size: 28 }), { dy: 0 });
    s += E(t, W('tasso') - 0.1, IT(xp + 70, yp + 24, 'il tasso di crescita', { size: 46 }) + IT(xp + 70, yp + 78, 'raggiunge il massimo', { size: 46 }), { dy: 12 });
    return s + caption(t, W('crescita'), 'Crescita al massimo', '');
  } }) });

// 5 — inflazione: la domanda supera l'offerta (chiaro)
scene('inflazione', { make: (W) => ({
  capAt: W('perché'), last: W('domanda'),
  render(t) {
    const ink = C.ink, f = C.ivory; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 680), { dy: 0 });
    s += E(t, -0.1, lblI(960, 222, "INFLAZIONE = AUMENTO DEI PREZZI", { size: 30 }), { dy: 0 });
    // cartellino del prezzo che sale
    const pu = eo((t - W('prezzi') + 0.1) / 0.8);
    s += E(t, W("l'aumento") - 0.1, tag(470, 520 - 70 * pu, ink, f), { dy: 16 });
    s += E(t, W('prezzi') - 0.05, arrow(620, 600, 620, 400, ink, 6) + lblI(470, 690, 'PREZZI'), { dy: 0 });
    s += E(t, W('accelerare') - 0.1, IT(470, 760, 'possono accelerare', { size: 42, a: 'middle', fill: ink }), { dy: 10 });
    // barre qualitative: domanda > offerta
    const base = 700, hD = 380 * eo((t - W('domanda') + 0.1) / 0.6), hO = 250 * eo((t - W('domanda') - 0.1) / 0.6);
    s += `<line x1="980" y1="${base}" x2="1640" y2="${base}" stroke="${ink}" stroke-width="4"/>`;
    if (hD > 0) s += `<rect x="1060" y="${base - hD}" width="190" height="${hD}" fill="${C.coral}" stroke="${ink}" stroke-width="4"/>`;
    if (hO > 0) s += `<rect x="1370" y="${base - hO}" width="190" height="${hO}" fill="${f}" stroke="${ink}" stroke-width="4"/>`;
    s += E(t, W('domanda') - 0.05, lblI(1155, base + 50, 'DOMANDA'), { dy: 0 });
    s += E(t, W('domanda') + 0.1, lblI(1465, base + 50, 'OFFERTA'), { dy: 0 });
    s += E(t, W('domanda') + 0.15, T(1310, base - 300, '>', { f: 'pop', size: 110, fill: ink, a: 'middle' }), { dy: 10 });
    return s + caption(t, W('perché'), 'Domanda supera offerta', '', true);
  } }) });

// 6 — banche centrali alzano i tassi
scene('tassi', { make: (W) => ({
  capAt: W('tassi'), last: W('contenere'),
  render(t) {
    const st = C.line; let s = '';
    s += E(t, W('banche') - 0.1, bank(330, 470, 1.15, st, C.bg) + lbl(330, 640, 'BANCHE', { size: 28 }) + lbl(330, 680, 'CENTRALI', { size: 28 }), { dy: 16 });
    // indicatore dei tassi: quadrante con lancetta che sale
    const cx = 860, cy = 540, r = 210;
    s += E(t, W('tassi') - 0.1, (() => {
      let g = `<path d="M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy} Z" fill="${C.bg}" stroke="${st}" stroke-width="5"/>`;
      for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8; g += `<line x1="${cx + Math.cos(a) * r * 0.8}" y1="${cy + Math.sin(a) * r * 0.8}" x2="${cx + Math.cos(a) * r * 0.94}" y2="${cy + Math.sin(a) * r * 0.94}" stroke="${st}" stroke-width="4"/>`; }
      return g + T(cx, cy - 56, '%', { f: 'pop', size: 64, fill: st, a: 'middle' });
    })() + lbl(cx, cy + 60, 'TASSI DI INTERESSE', { size: 28 }), { dy: 16 });
    if (t > W('tassi') - 0.1) {
      const p = eio((t - W('alzano')) / 1.2), a = Math.PI * (1.2 + 0.55 * clamp(p));
      s += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * r * 0.72}" y2="${cy + Math.sin(a) * r * 0.72}" stroke="${st}" stroke-width="8" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="12" fill="${st}"/>`;
    }
    s += E(t, W('alzano') - 0.05, upDown(cx + r + 70, cy - 110, true, C.coral, 150), { dy: 0 });
    s += E(t, W('rallentare') - 0.1, T(1270, 410, 'per', { f: 'mono', size: 28, fill: st, ls: 3, w: 600 }) + IT(1270, 470, 'rallentare la crescita', { size: 50 }), { dy: 12 });
    s += E(t, W('contenere') - 0.1, T(1270, 570, 'e', { f: 'mono', size: 28, fill: st, ls: 3, w: 600 }) + IT(1270, 630, "contenere l'inflazione", { size: 50 }), { dy: 12 });
    return s + caption(t, W('tassi'), 'Tassi di interesse in salita', '');
  } }) });

// 7 — recessione
scene('recessione', { make: (W) => ({
  capAt: W('rallenta'), last: W('diventa'),
  render(t) {
    const b = CH({ y0: 230, y1: 600 }); let s = '';
    s += phaseChart(t, b, 0.56, 1.0, W('recessione'), W('diventa') + 0.3 - W('recessione'), ['RECESSIONE']);
    s += E(t, W('rallenta') - 0.05, lbl(b.X(0.64) + 26, b.Y(G(0.64)) - 10, 'RALLENTA', { a: 'start', size: 28 }), { dy: 0 });
    s += E(t, W('diventa') - 0.05, lbl(b.X(0.9) + 40, b.Y(G(0.9)) + 18, 'NEGATIVA', { a: 'start', size: 28 }) +
      lbl(b.X(0.9) + 40, b.Y(G(0.9)) + 56, '(SOTTO LO ZERO)', { a: 'start', size: 26 }), { dy: 0 });
    return s + caption(t, W('rallenta'), 'Crescita negativa', '');
  } }) });

// 8 — due trimestri consecutivi di PIL in calo (chiaro)
scene('trimestri', { make: (W) => ({
  capAt: W('due'), last: W('pil'),
  render(t) {
    const ink = C.ink, f = C.ivory; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 680), { dy: 0 });
    s += E(t, -0.2, lblI(260, 230, 'CRESCITA DEL PIL, TRIMESTRE PER TRIMESTRE', { a: 'start', size: 28 }), { dy: 0 });
    s += E(t, -0.2, pillTag(1600, 238, 'ESEMPIO', ink, f, 'middle'), { dy: 0 });
    const z = 480, vals = [0.55, 0.4, 0.18, -0.35, -0.5, 0.2], x0 = 330, gw = 210;
    s += E(t, W('definizione') - 0.1, `<line x1="270" y1="${z}" x2="1650" y2="${z}" stroke="${ink}" stroke-width="4"/>` + T(250, z + 10, '0', { f: 'mono', size: 30, fill: ink, a: 'end', w: 700 }), { dy: 0 });
    vals.forEach((v, i) => {
      const neg = v < 0, t0 = neg ? W(i === 3 ? 'trimestri' : 'consecutivi') - 0.05 : W('definizione') + i * 0.12;
      const p = eo((t - t0) / 0.5); if (p <= 0) return;
      const h = Math.abs(v) * 340 * p, x = x0 + i * gw;
      s += `<rect x="${x}" y="${neg ? z : z - h}" width="130" height="${h}" fill="${neg ? C.coral : f}" stroke="${ink}" stroke-width="4"/>`;
      s += T(x + 65, 790, 'T' + (i + 1), { f: 'mono', size: 30, fill: ink, a: 'middle', w: 700 });
    });
    // parentesi sopra i due trimestri negativi
    s += E(t, W('consecutivi') + 0.3, `<path d="M${x0 + 3 * gw},${z - 40} v-24 H${x0 + 4 * gw + 130} v24" fill="none" stroke="${ink}" stroke-width="4"/>` +
      lblI(x0 + 3 * gw + (gw + 130) / 2, z - 84, '2 TRIMESTRI CONSECUTIVI', { size: 26 }), { dy: 8 });
    s += E(t, W('pil') - 0.05, lblI(x0 + 3 * gw + (gw + 130) / 2, z + 230, 'PIL IN CALO', { size: 28 }), { dy: 8 });
    return s + caption(t, W('due'), 'Due trimestri consecutivi', '', true);
  } }) });

// 9 — effetti della recessione
scene('effetti', { make: (W) => ({
  capAt: W('sale'), last: W('consumi'),
  render(t) {
    let s = E(t, -0.2, city(860, DIMC(), 0.6), { dy: 0 });
    s += indicator(t, W('disoccupazione') - 0.05, 520, 450, person, 'DISOCCUPAZIONE', true, C.coral);
    s += indicator(t, W('aziende') - 0.05, 960, 450, factory, 'INVESTIMENTI', false, C.line);
    s += indicator(t, W('consumi') - 0.05, 1400, 450, cart, 'CONSUMI', false, C.line);
    s += E(t, W('sale') - 0.05, IT(560, 300, 'sale', { size: 48, a: 'middle' }), { dy: 10 });
    s += E(t, W('riducono') - 0.05, IT(1000, 300, 'si riducono', { size: 48, a: 'middle' }), { dy: 10 });
    s += E(t, W('consumi') - 0.05, IT(1440, 300, 'calano', { size: 48, a: 'middle' }), { dy: 10 });
    return s + caption(t, W('sale'), 'Disoccupazione su, consumi giù', '');
  } }) });

// 10 — ripresa
scene('ripresa', { make: (W) => ({
  capAt: W('ricomincia'), last: W('partendo'),
  render(t) {
    const b = CH({ y0: 230, y1: 600 }); let s = '';
    s += phaseChart(t, b, 1.0, 1.3, W('ricomincia') - 0.1, 1.6, ['RIPRESA']);
    const xb = b.X(1.0), yb = b.Y(G(1.0));
    s += E(t, W('partendo') - 0.05, lbl(xb - 30, yb + 54, 'DAL BASSO', { a: 'end', size: 28 }), { dy: 0 });
    s += E(t, W('ricomincia') - 0.05, IT(b.X(0.6), b.Y(-0.45) + 20, 'ricomincia a crescere', { size: 46, a: 'middle' }), { dy: 12 });
    return s + caption(t, W('ricomincia'), 'Si riparte dal basso', '');
  } }) });

// 11 — politiche pubbliche (chiaro)
scene('politiche', { make: (W) => ({
  capAt: W('politiche'), last: W('accelerano') + 0.1,
  render(t) {
    const ink = C.ink, f = C.ivory; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 680), { dy: 0 });
    s += E(t, -0.1, lblI(960, 222, 'POLITICHE PUBBLICHE', { size: 30 }), { dy: 0 });
    s += E(t, W('spesa') - 0.05, bank(400, 450, 0.95, ink, f) + coin(510, 520, 34, ink, f) + lblI(420, 640, 'SPESA STATALE'), { dy: 16 });
    s += E(t, W('taglio') - 0.05, T(840, 510, '%', { f: 'pop', size: 150, fill: ink, a: 'middle' }) + upDown(950, 460, false, ink, 120) + lblI(870, 640, 'TAGLIO DEI TASSI'), { dy: 16 });
    s += E(t, W('accelerano') - 0.15, arrow(1100, 470, 1220, 470, ink, 5), { dy: 0 });
    // piccolo grafico: la ripresa (corallo)
    const p = clamp((t - W('accelerano') + 0.05) / 0.9);
    s += E(t, W('accelerano') - 0.1, `<path d="M1270,320 V600 H1640" fill="none" stroke="${ink}" stroke-width="4"/>`, { dy: 0 });
    if (p > 0) s += `<path d="${fpath(1290, 1620, 360, 580, u => 0.5 - 0.5 * Math.cos(Math.PI * u) * 1, eo(p))}" fill="none" stroke="${C.coral}" stroke-width="9" stroke-linecap="round"/>`;
    s += E(t, W('accelerano') + 0.1, lblI(1455, 660, 'ACCELERANO', { size: 28 }) + lblI(1455, 700, 'LA RIPRESA', { size: 28 }), { dy: 8 });
    return s + caption(t, W('politiche'), 'Politiche pubbliche', '', true);
  } }) });

// 12 — il ciclo si ripete
scene('ripete', { make: (W) => ({
  capAt: W('con'), last: W('intensità'),
  render(t) {
    const st = C.line; let s = E(t, -0.2, city(860, DIMC(), 0.6), { dy: 0 });
    // ciclo ripetuto con durate e ampiezze diverse (schematico)
    const segs = [[0, 360, 110], [360, 820, 170], [820, 1080, 80], [1080, 1640, 140]]; // [x0,x1,ampiezza]
    const yc = 420, X0 = 160;
    const f = x => { for (const [a, b, A] of segs) if (x <= b) return yc + A * Math.cos(2 * Math.PI * (x - a) / (b - a)); return yc; };
    const p = clamp((t - W('ciclo') + 0.1) / 1.6);
    s += E(t, -0.1, `<line x1="${X0 - 20}" y1="${yc}" x2="${X0 + 1680}" y2="${yc}" stroke="${DIMC()}" stroke-width="3"/>` + lbl(X0 + 1660, 200, 'SCHEMATICO', { a: 'end' }), { dy: 0 });
    if (p > 0) { let d = ''; const n = Math.round(400 * p); for (let i = 0; i <= n; i++) { const x = 1640 * i / 400; d += (i ? 'L' : 'M') + (X0 + x).toFixed(1) + ',' + f(x).toFixed(1); } s += `<path d="${d}" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`; }
    // durata: parentesi orizzontale sul secondo ciclo; intensità: parentesi verticale
    s += E(t, W('durata') - 0.05, `<path d="M${X0 + 360},${680} v18 H${X0 + 820} v-18" fill="none" stroke="${st}" stroke-width="4"/>` + lbl(X0 + 590, 750, 'DURATA', { size: 28 }), { dy: 8 });
    s += E(t, W('intensità') - 0.05, `<path d="M${X0 + 1080 - 40},${yc - 140} h-18 V${yc + 140} h18" fill="none" stroke="${st}" stroke-width="4"/>` + lbl(X0 + 1080 - 74, yc + 10, 'INTENSITÀ', { a: 'end', size: 28 }), { dy: 8 });
    return s + caption(t, W('con'), 'Durata e intensità diverse', '');
  } }) });

// 13 — la Grande Recessione (chiaro)
scene('storia', { make: (W) => ({
  capAt: W('1929'), last: W('1929'),
  render(t) {
    const ink = C.ink, f = C.ivory; let s = lightBg() + E(t, -0.4, card(140, 150, 1640, 680), { dy: 0 });
    const X = y => 300 + (y - 1925) / (2025 - 1925) * 1320, yl = 560;
    s += E(t, -0.2, `<line x1="260" y1="${yl}" x2="1660" y2="${yl}" stroke="${ink}" stroke-width="4"/><path d="M1680,${yl} l-18,-10 v20 z" fill="${ink}"/>` +
      [1950, 1975, 2000].map(y => `<line x1="${X(y)}" y1="${yl - 10}" x2="${X(y)}" y2="${yl + 10}" stroke="${ink}" stroke-width="3"/>` + T(X(y), yl + 50, String(y), { f: 'mono', size: 26, fill: ink, a: 'middle', w: 600 })).join(''), { dy: 0 });
    s += E(t, W('grande') - 0.1, `<rect x="${X(2008)}" y="${yl - 18}" width="${X(2009.9) - X(2008)}" height="36" rx="6" fill="${C.coral}" stroke="${ink}" stroke-width="3"/>` +
      `<line x1="${X(2009)}" y1="${yl - 30}" x2="${X(2009)}" y2="${yl - 150}" stroke="${ink}" stroke-width="3"/>` +
      lblI(X(2009), yl - 220, 'GRANDE', { size: 28 }) + lblI(X(2009), yl - 180, 'RECESSIONE', { size: 28 }), { dy: 12 });
    s += E(t, W('20082009') - 0.05, T(X(2009), yl + 60, '2008-2009', { f: 'mono', size: 30, fill: ink, a: 'middle', w: 700 }), { dy: 8 });
    s += E(t, W('1929') - 0.1, `<circle cx="${X(1929)}" cy="${yl}" r="14" fill="${f}" stroke="${ink}" stroke-width="4"/>` + T(X(1929), yl + 60, '1929', { f: 'mono', size: 30, fill: ink, a: 'middle', w: 700 }), { dy: 8 });
    s += E(t, W('uno') - 0.1, IT(X(1929) - 20, 330, 'uno dei cicli negativi', { size: 50, fill: ink }) + IT(X(1929) - 20, 392, 'più severi dal 1929', { size: 50, fill: ink }), { dy: 12 });
    return s + caption(t, W('1929'), 'Dal 1929', '', true);
  } }) });

// 14 — la pandemia del 2020
scene('pandemia', { make: (W) => ({
  capAt: W('rapidissima'), last: W('altrettanto'),
  render(t) {
    const st = C.line; let s = '';
    const b = { x0: 300, x1: 1640, y0: 220, y1: 640 }, yz = 330;
    s += E(t, -0.2, `<path d="M${b.x0},${b.y0 - 20} V${b.y1}" stroke="${st}" stroke-width="4"/><line x1="${b.x0}" y1="${yz}" x2="${b.x1 + 20}" y2="${yz}" stroke="${st}" stroke-width="3"/>` +
      T(b.x0 - 22, yz + 10, '0', { f: 'mono', size: 30, fill: st, a: 'end', w: 700 }) + T(b.x0 + 22, b.y0 - 6, 'CRESCITA DEL PIL', { f: 'mono', size: 26, fill: st, ls: 3, w: 600 }) +
      T(b.x1 + 20, b.y0 - 6, 'SCHEMATICO', { f: 'mono', size: 26, fill: st, ls: 3, w: 600, a: 'end' }), { dy: 0 });
    s += E(t, W('2020') - 0.05, T(960, 720, '2020', { f: 'pop', size: 72, fill: st, a: 'middle' }), { dy: 12 });
    // V: discesa rapidissima, risalita altrettanto rapida
    const xa = 560, xm = 960, xc = 1360, yl = 600;
    const p1 = clamp((t - W('recessione') + 0.05) / 0.5), p2 = clamp((t - W('ripresa') + 0.05) / 0.5);
    let d = `M${b.x0 + 20},${yz - 60} L${xa},${yz - 60}`;
    if (p1 > 0) d += ` L${lerp(xa, xm, p1)},${lerp(yz - 60, yl, p1)}`;
    if (p2 > 0) d += ` L${lerp(xm, xc, p2)},${lerp(yl, yz - 60, p2)}`;
    if (p1 > 0) s += `<path d="${d}" fill="none" stroke="${C.coral}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += E(t, W('globale') - 0.05, lbl(xa - 30, 470, 'RECESSIONE', { a: 'end', size: 28 }) + lbl(xa - 30, 510, 'RAPIDISSIMA', { a: 'end', size: 28 }), { dy: 0 });
    s += E(t, W('altrettanto') - 0.05, lbl(xc + 30, 470, 'RIPRESA', { a: 'start', size: 28 }) + lbl(xc + 30, 510, 'ALTRETTANTO RAPIDA', { a: 'start', size: 28 }), { dy: 0 });
    return s + caption(t, W('rapidissima'), 'Rapida recessione, rapida ripresa', '');
  } }) });

// 15 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    // piccola onda del ciclo (unico corallo)
    let d = ''; for (let i = 0; i <= 120; i++) { const u = i / 120; d += (i ? 'L' : 'M') + (760 + 400 * u).toFixed(1) + ',' + (300 - 40 * Math.sin(2 * Math.PI * u * 1.5)).toFixed(1); }
    s += E(t, -0.4, `<path d="${d}" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linecap="round"/>`, { dy: 0 });
    s += E(t, -0.4, T(960, 460, 'Il ciclo economico', { f: 'pop', size: 96, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('espansione') - 0.1, 960, 580, 'Espansione, picco, recessione, ripresa.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true });
    s += E(t, W('economico') + 0.2, `<line x1="760" y1="660" x2="1160" y2="660" stroke="${C.ink}" stroke-width="3"/>` + T(960, 720, 'PROFTECNOLOGIA · MC-SIS-3-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
  const tz = S.id === 'finale' ? Math.min(t, S.L + S.sc.voce_dur) : t;
  inner = `<g transform="translate(960,540) scale(${1 + 0.025 * tz / S.D}) translate(-960,-540)">${inner}</g>`;
  body += inner;
  if (S.id !== 'finale') body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
