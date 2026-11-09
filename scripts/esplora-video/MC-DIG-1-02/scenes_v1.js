// Come funziona un motore di ricerca — MC-DIG-1-02. render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.4);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const DIM = () => mix(C.bg, C.line, 0.10);

// ---- mondo: pagine web, barra di ricerca, crawler, archivio — line-art in sezione ----
function pageSVG(x, y, w, h, o = {}) {
  const st = o.st || C.line, fill = o.fill || DIM(), sw = o.sw || 3, bar = Math.max(16, h * 0.14);
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${fill}" stroke="${st}" stroke-width="${sw}"${o.dash ? ' stroke-dasharray="10 8"' : ''}/>`;
  s += `<line x1="${x}" y1="${y + bar}" x2="${x + w}" y2="${y + bar}" stroke="${st}" stroke-width="${sw * 0.7}"/>`;
  const r = Math.max(3, bar * 0.16);
  for (let i = 0; i < 3; i++) s += `<circle cx="${x + bar * 0.5 + i * r * 3}" cy="${y + bar / 2}" r="${r}" fill="none" stroke="${st}" stroke-width="${sw * 0.6}"/>`;
  const n = o.lines ?? Math.max(2, Math.floor((h - bar) / 22) - 1), lh = (h - bar - 16) / (n + 1);
  for (let i = 0; i < n; i++) {
    const lw = (i === 0 ? 0.55 : 0.82 - 0.18 * hsh(i + (o.seed || 0))) * (w - 2 * w * 0.12);
    s += `<line x1="${x + w * 0.12}" y1="${y + bar + 12 + (i + 1) * lh}" x2="${x + w * 0.12 + lw}" y2="${y + bar + 12 + (i + 1) * lh}" stroke="${st}" stroke-width="${i === 0 ? sw * 1.6 : sw * 0.8}" stroke-linecap="round" opacity="${i === 0 ? 1 : 0.7}"/>`;
  }
  return s;
}
function lens(cx, cy, r, st, sw = 5) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${st}" stroke-width="${sw}"/><line x1="${cx + r * 0.72}" y1="${cy + r * 0.72}" x2="${cx + r * 1.5}" y2="${cy + r * 1.5}" stroke="${st}" stroke-width="${sw * 1.4}" stroke-linecap="round"/>`;
}
function searchBar(t, t0, x, y, w, q, st, fill) {
  const n = Math.floor(clamp((t - t0) / 1.1) * q.length), txt = q.slice(0, n), cur = (t - t0) % 0.8 < 0.45 ? '|' : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="84" rx="42" fill="${fill}" stroke="${st}" stroke-width="4"/>` + lens(x + 52, y + 38, 16, st, 4) +
    T(x + 100, y + 56, txt + (t > t0 ? cur : ''), { f: 'popm', size: 36, fill: st });
}
function spider(cx, cy, r, t, col) {
  let s = '';
  for (let side of [-1, 1]) for (let i = 0; i < 4; i++) {
    const a0 = -0.9 + i * 0.6, wig = 0.18 * Math.sin(t * 14 + i * 1.7 + side), a = a0 + wig;
    const kx = cx + side * r * 1.5 * Math.cos(a), ky = cy + r * 1.5 * Math.sin(a) - r * 0.5;
    const fx = cx + side * r * 2.4 * Math.cos(a), fy = cy + r * 2.4 * Math.sin(a) + r * 0.6;
    s += `<polyline points="${cx},${cy} ${kx.toFixed(1)},${ky.toFixed(1)} ${fx.toFixed(1)},${fy.toFixed(1)}" fill="none" stroke="${col}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/><circle cx="${cx}" cy="${cy - r * 1.05}" r="${r * 0.55}" fill="${col}"/>`;
}
function dbSVG(x, y, w, h, st, fill) {
  const ry = w * 0.16; let s = `<path d="M${x},${y} V${y + h} A${w / 2},${ry} 0 0 0 ${x + w},${y + h} V${y}" fill="${fill}" stroke="${st}" stroke-width="4"/>`;
  for (let i = 1; i < 3; i++) s += `<path d="M${x},${y + h * i / 3} A${w / 2},${ry} 0 0 0 ${x + w},${y + h * i / 3}" fill="none" stroke="${st}" stroke-width="3" opacity="0.6"/>`;
  return s + `<ellipse cx="${x + w / 2}" cy="${y}" rx="${w / 2}" ry="${ry}" fill="${fill}" stroke="${st}" stroke-width="4"/>`;
}
const check = (cx, cy, r, st, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="3"/><polyline points="${cx - r * 0.45},${cy} ${cx - r * 0.1},${cy + r * 0.38} ${cx + r * 0.5},${cy - r * 0.35}" fill="none" stroke="${st}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (cx, cy, r, st, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="3"/><path d="M${cx - r * 0.38},${cy - r * 0.38} L${cx + r * 0.38},${cy + r * 0.38} M${cx + r * 0.38},${cy - r * 0.38} L${cx - r * 0.38},${cy + r * 0.38}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`;
const QUERY = 'storia di Napoleone';

// grafo del web per le scene del crawler
const GN = [[860, 270], [1140, 220], [1440, 260], [1720, 330], [900, 510], [1210, 480], [1530, 550], [840, 760], [1160, 740], [1460, 790], [1740, 700]];
const GE = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [4, 5], [5, 2], [5, 6], [3, 6], [4, 7], [7, 8], [5, 8], [8, 9], [6, 9], [9, 10], [6, 10]];
const GPATH = [0, 1, 5, 4, 7, 8, 9, 6, 3, 2, 5, 6, 10];
const PW = 150, PH = 110;
function crawlPos(tt, v) { // posizione del crawler lungo GPATH dopo tt secondi
  let d = Math.max(0, tt) * v, i = 0;
  while (i < GPATH.length - 1) {
    const a = GN[GPATH[i]], b = GN[GPATH[i + 1]], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d <= l) return { x: lerp(a[0], b[0], d / l), y: lerp(a[1], b[1], d / l), seg: i, p: d / l };
    d -= l; i++;
  }
  const e = GN[GPATH[GPATH.length - 1]]; return { x: e[0], y: e[1], seg: GPATH.length - 1, p: 1 };
}
function visitTimes(v) { // istante di arrivo su ciascun nodo
  const out = {}; let acc = 0; out[GPATH[0]] = 0;
  for (let i = 1; i < GPATH.length; i++) { const a = GN[GPATH[i - 1]], b = GN[GPATH[i]]; acc += Math.hypot(b[0] - a[0], b[1] - a[1]) / v; if (out[GPATH[i]] == null) out[GPATH[i]] = acc; }
  return out;
}
function webGraph(t, t0, o = {}) {
  let s = '';
  GE.forEach(([a, b], i) => {
    const A = GN[a], B = GN[b];
    s += E(t, t0 + i * 0.03, `<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${C.line}" stroke-width="3" stroke-dasharray="4 9" opacity="0.75"/>`, { dy: 0, blur: 4 });
  });
  GN.forEach(([x, y], i) => {
    const vis = o.visited && o.visited(i), st = o.state ? o.state(i) : null;
    let p = pageSVG(x - PW / 2, y - PH / 2, PW, PH, { lines: 3, seed: i, fill: vis ? mix(C.bg, C.line, 0.24) : C.bg, dash: st === 'no', sw: 3 });
    if (st === 'yes') p += check(x + PW / 2 - 4, y - PH / 2 + 4, 20, C.line, C.bg);
    if (st === 'no') p += cross(x + PW / 2 - 4, y - PH / 2 + 4, 20, C.line, C.bg);
    s += E(t, t0 + 0.1 + i * 0.05, p, { dy: 10 });
  });
  return s;
}

// 1 — aggancio: la ricerca e "tutto internet"
scene('hook', { tail: 1.0, make: (W) => ({
  capAt: W('non'),
  render(t) {
    let s = E(t, -0.4, searchBar(t, 0.15, 360, 150, 1200, QUERY, C.line, C.bg), { dy: 0 });
    const P = [[300, 420], [520, 520], [760, 430], [1000, 540], [1240, 440], [1480, 530], [1700, 420], [380, 680], [640, 740], [900, 690], [1160, 760], [1420, 690], [1660, 740]];
    P.forEach(([x, y], i) => { s += E(t, W('online') - 0.2 + i * 0.04, pageSVG(x - 85, y - 60, 170, 120, { lines: 3, seed: i, fill: C.bg }), { dy: 12 }); });
    if (t > W('tutto') - 0.1) {
      const lab = 'TUTTO INTERNET, IN TEMPO REALE', w = tw(lab, 'mono', 30) + 3 * lab.length + 60;
      s += E(t, W('tutto') - 0.1, `<rect x="${960 - w / 2}" y="${560}" width="${w}" height="64" rx="32" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + lbl(960, 603, lab, { size: 30 }), { dy: 0 });
      const p = eo((t - W('reale')) / 0.4);
      if (p > 0) s += `<line x1="${960 - w / 2 - 20}" y1="592" x2="${960 - w / 2 - 20 + (w + 40) * p}" y2="592" stroke="${C.coral}" stroke-width="8" stroke-linecap="round"/>`;
    }
    return s + caption(t, W('non'), 'Non in tempo reale', '');
  } }) });

// 2 — un indice costruito in anticipo; tre fasi (registro chiaro)
scene('indice', { tail: 1.3, make: (W) => ({
  capAt: W('anticipo'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(170, 150, 760, 680, { rot: -0.8 }), { dy: 0 });
    g += E(t, W('indice') - 0.1, lbl(240, 236, 'INDICE', { a: 'start', fill: C.ink, size: 30 }));
    for (let i = 0; i < 9; i++) {
      const y = 300 + i * 56, w1 = 120 + 140 * hsh(i + 3);
      g += E(t, W('elenco') + i * 0.06, `<line x1="240" y1="${y}" x2="${240 + w1}" y2="${y}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>` +
        `<line x1="${260 + w1}" y1="${y + 4}" x2="760" y2="${y + 4}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>` +
        `<rect x="780" y="${y - 14}" width="${50 + 40 * hsh(i + 9)}" height="22" rx="5" fill="none" stroke="${C.ink}" stroke-width="3"/>`, { dy: 8 });
    }
    g += words(t, W('elenco'), 1040, 330, 'un elenco enorme', { f: 'pop', size: 76, fill: C.ink });
    g += E(t, W('costruito'), IT(1044, 410, 'costruito in anticipo', { fill: C.ink, size: 56 }));
    const ph = ['CRAWLING', 'INDICIZZAZIONE', 'RANKING'];
    g += E(t, W('processo'), T(1040, 540, 'tre fasi', { f: 'pop', size: 56, fill: C.ink }));
    ph.forEach((p, i) => { g += E(t, W('processo') + 0.15 + i * 0.15, pillTag(1040, 640 + i * 76, `${i + 1}  ${p}`, C.ink, C.cream)); });
    s += `<g transform="translate(960,495) scale(${k}) translate(-960,-495)">${g}</g>`;
    return s + caption(t, W('anticipo'), 'Costruito in anticipo', 'anticipo', true);
  } }) });

// 3 — i crawler, i "ragni"
const V1 = 260;
scene('crawler', { make: (W) => ({
  capAt: W('crawler'),
  render(t) {
    let s = webGraph(t, -0.4);
    s += words(t, W('programmi'), 96, 300, 'programmi', { f: 'pop', size: 64 });
    s += words(t, W('automatici'), 96, 376, 'automatici', { f: 'pop', size: 64 });
    s += E(t, W('crawler'), T(96, 520, 'crawler', { f: 'pop', size: 104 }));
    s += E(t, W('ragni'), IT(100, 596, 'cioè «ragni»', { size: 54 }));
    if (t > W('crawler') - 0.1) {
      const q = crawlPos(t - W('girano'), V1);
      s += E(t, W('crawler') - 0.1, spider(q.x, q.y, 16, t, C.coral), { dy: 0, blur: 6 });
    }
    return s + caption(t, W('crawler'), 'Crawler: i ragni', '');
  } }) });

// 4 — seguono i link; non tutte le pagine finiscono nell'indice
const V2 = 520, NOIDX = [3, 8, 10];
scene('link', { make: (W) => {
  const t0 = 0.1, vt = visitTimes(V2);
  return {
    capAt: W('ma'),
    render(t) {
      const ti = W('ma');
      let s = webGraph(t, -0.6, {
        visited: i => t - t0 >= vt[i],
        state: i => t >= ti + 0.1 * i * 0.3 && t - t0 >= vt[i] ? (NOIDX.includes(i) ? 'no' : 'yes') : null,
      });
      // link già percorsi
      const q = crawlPos(t - t0, V2);
      for (let i = 0; i < Math.min(q.seg, GPATH.length - 1); i++) {
        const A = GN[GPATH[i]], B = GN[GPATH[i + 1]];
        s += `<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${C.line}" stroke-width="4"/>`;
      }
      s += spider(q.x, q.y, 16, t, C.coral);
      s += words(t, W('seguono'), 96, 300, 'segue i link', { f: 'pop', size: 64 });
      s += E(t, W('pagina'), IT(100, 376, 'da una pagina all’altra', { size: 48 }));
      s += E(t, W('lette'), check(124, 500, 24, C.line, C.bg) + lbl(168, 510, 'LETTA', { a: 'start', size: 28 }));
      s += E(t, ti, check(124, 580, 24, C.line, C.bg) + lbl(168, 590, 'NELL’INDICE', { a: 'start', size: 28 }));
      s += E(t, ti + 0.2, cross(124, 660, 24, C.line, C.bg) + lbl(168, 670, 'NON INDICIZZATA', { a: 'start', size: 28 }));
      return s + caption(t, W('ma'), 'Non tutte indicizzate', '');
    } };
} });

// 5 — la pagina viene analizzata e aggiunta all'indice
scene('catalogo', { tail: 0.6, make: (W) => ({
  capAt: W('analizzata'),
  render(t) {
    const px = 230, py = 200, pw = 480, ph = 600;
    let s = E(t, -0.4, pageSVG(px, py, pw, ph, { lines: 12, seed: 4, fill: DIM(), sw: 4 }), { dy: 0 });
    s += E(t, W('visitata'), lbl(px, py - 30, 'PAGINA VISITATA', { a: 'start', size: 28 }));
    const ta = W('analizzata');
    if (t > ta) { const y = py + 90 + ((t - ta) * 380) % (ph - 110); s += `<line x1="${px - 24}" y1="${y}" x2="${px + pw + 24}" y2="${y}" stroke="${C.coral}" stroke-width="6" stroke-linecap="round"/>`; }
    s += E(t, ta, lbl(px + pw / 2, py + ph + 60, 'ANALIZZATA', { size: 30 }));
    const dx = 1360, dy = 320, dw = 380, dh = 400;
    s += E(t, -0.2, dbSVG(dx, dy, dw, dh, C.line, DIM()) + lbl(dx + dw / 2, dy + dh + 130, 'INDICE', { size: 34 }), { dy: 0 });
    s += E(t, W('aggiunta'), arrow(px + pw + 60, 500, dx - 40, 500, C.line, 4));
    const tags = ['fotosintesi', 'clorofilla', 'luce'];
    tags.forEach((g, i) => {
      const t0 = W('aggiunta') + 0.15 + i * 0.25, p = eio((t - t0) / 0.8); if (t < t0) return;
      const x0 = px + 70, y0 = py + 160 + i * 110, x1 = dx + 60, y1 = dy + 70 + i * 110;
      const x = lerp(x0, x1, p), y = lerp(y0, y1, p) - Math.sin(p * Math.PI) * 60;
      s += pillTag(x, y, g.toUpperCase(), C.line, C.bg);
    });
    s += E(t, W('aggiunta') + 0.6, pillTag(dx + dw / 2, dy - 110, 'ESEMPIO', C.line, C.bg, 'middle'));
    return s + caption(t, W('analizzata'), 'Analizzata e aggiunta', '');
  } }) });

// 6 — parole chiave → pagine, come l'indice analitico di un libro (registro chiaro)
scene('voci', { tail: 0.6, make: (W) => ({
  capAt: W('chiave'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(150, 150, 1080, 700, { rot: 0.5 }), { dy: 0 });
    g += E(t, 0.0, pillTag(220, 240, 'ESEMPIO', C.ink, C.cream));
    g += E(t, W('parole'), lbl(230, 340, 'PAROLA CHIAVE', { a: 'start', fill: C.ink, size: 28 }));
    g += E(t, W('pagine'), lbl(760, 340, 'PAGINE', { a: 'start', fill: C.ink, size: 28 }));
    g += E(t, W('parole'), `<line x1="220" y1="370" x2="1160" y2="370" stroke="${C.ink}" stroke-width="3"/>`, { dy: 0 });
    const rows = [['fotosintesi', 'AD'], ['clorofilla', 'BD'], ['luce', 'ACF']];
    rows.forEach(([w, ps], i) => {
      const y = 470 + i * 120, t0 = W('associa') + i * 0.3;
      g += E(t, t0, T(230, y, w, { f: 'pop', size: 52, fill: C.ink }));
      g += E(t, W('pagine') + i * 0.3, arrow(620, y - 16, 720, y - 16, C.ink, 4));
      [...ps].forEach((l, j) => {
        g += E(t, W('compaiono') + i * 0.2 + j * 0.08, pageSVG(760 + j * 120, y - 62, 86, 92, { st: C.ink, fill: C.cream, lines: 0, sw: 3 }) +
          T(803 + j * 120, y + 12, l, { f: 'pop', size: 36, fill: C.ink, a: 'middle' }), { dy: 8 });
      });
    });
    // libro aperto
    const bx = 1320, by = 330;
    let b = `<path d="M${bx},${by} q120,-30 230,10 v380 q-110,-40 -230,-10 z" fill="${C.cream}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M${bx + 460},${by} q-120,-30 -230,10 v380 q110,-40 230,-10 z" fill="${C.cream}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
    for (let i = 0; i < 7; i++) {
      const y = by + 80 + i * 40;
      b += `<line x1="${bx + 260}" y1="${y}" x2="${bx + 330 + 30 * hsh(i)}" y2="${y}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><line x1="${bx + 400}" y1="${y}" x2="${bx + 430}" y2="${y}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
      b += `<line x1="${bx + 30}" y1="${y}" x2="${bx + 200 - 30 * hsh(i + 5)}" y2="${y + 4}" stroke="${C.ink}" stroke-width="3" opacity="0.5"/>`;
    }
    g += E(t, W('come') - 0.1, b + lbl(bx + 230, by - 60, 'INDICE ANALITICO', { fill: C.ink, size: 26 }), { dy: 14 });
    g += E(t, W('libro') - 0.1, IT(bx + 230, by + 470, 'alla fine di un libro', { fill: C.ink, a: 'middle', size: 44 }));
    s += `<g transform="translate(960,495) scale(${k}) translate(-960,-495)">${g}</g>`;
    return s + caption(t, W('chiave'), 'Parole chiave, pagine', 'chiave', true);
  } }) });

// 7 — centinaia di miliardi di pagine
scene('enorme', { make: (W) => ({
  capAt: W('numero'),
  render(t, D) {
    const z = lerp(1.6, 0.55, eio(t / D)); let g = '';
    for (let r = -9; r <= 9; r++) for (let c = -14; c <= 14; c++) {
      const x = 960 + c * 120 * z, y = 540 + r * 100 * z; if (x < -120 || x > 2040 || y < -100 || y > 1180) continue;
      g += pageSVG(x - 45 * z, y - 36 * z, 90 * z, 72 * z, { lines: 2, seed: r * 31 + c, fill: C.bg, sw: 2 });
    }
    let s = `<g opacity="0.45">${g}</g>`;
    s += E(t, W('centinaia') - 0.05, `<rect x="360" y="330" width="1200" height="300" rx="24" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`, { dy: 0 });
    s += words(t, W('centinaia'), 960, 480, 'centinaia di miliardi', { f: 'pop', size: 96, a: 'middle' });
    s += E(t, W('pagine') + 0.9, IT(960, 570, 'di pagine', { a: 'middle', size: 56 }));
    return s + caption(t, W('numero'), 'Il numero cambia', 'cambia');
  } }) });

// 8 — il ranking ordina i risultati
const RES = ['C', 'A', 'E', 'B', 'D'];
scene('ranking', { tail: 0.7, make: (W) => ({
  capAt: W('ordina'),
  render(t) {
    let s = E(t, -0.4, searchBar(t, -1.5, 180, 150, 1060, QUERY, C.line, C.bg), { dy: 0 });
    const to = W('ordina'), p = eio((t - to) / 0.9);
    const scat = [[260, 520, -6], [620, 330, 4], [520, 690, 7], [200, 330, -3], [760, 560, -5]];
    RES.forEach((l, rank) => {
      const idx = 'ABCDE'.indexOf(l), [sx, sy, sr] = scat[idx], fx = 260, fy = 290 + rank * 116;
      const x = lerp(sx, fx, p), y = lerp(sy, fy, p), r = lerp(sr, 0, p), w = 920, h = 96;
      const top = rank === 0 && p >= 1;
      let row = `<g transform="rotate(${r} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${C.bg}" stroke="${top ? C.coral : C.line}" stroke-width="${top ? 6 : 3}"/>` +
        `<line x1="${x + 30}" y1="${y + 36}" x2="${x + 360}" y2="${y + 36}" stroke="${C.line}" stroke-width="9" stroke-linecap="round"/>` +
        `<line x1="${x + 30}" y1="${y + 68}" x2="${x + 560}" y2="${y + 68}" stroke="${C.line}" stroke-width="3" opacity="0.7"/>` +
        lbl(x + w - 30, y + 60, 'PAGINA ' + l, { a: 'end', size: 28 }) + '</g>';
      s += E(t, 0.1 + idx * 0.08, row, { dy: 10 });
      if (p > 0.6) s += E(t, to + 0.6 + rank * 0.1, T(200, fy + 64, String(rank + 1), { f: 'pop', size: 48, a: 'middle' }), { dy: 6 });
    });
    // centinaia di fattori: quadranti che si regolano
    const tf = W('combinando');
    s += E(t, tf, lbl(1560, 250, 'CENTINAIA DI FATTORI', { size: 28 }));
    for (let r = 0; r < 8; r++) for (let c = 0; c < 7; c++) {
      const cx = 1380 + c * 60, cy = 320 + r * 62, i = r * 7 + c, a = Math.PI * (0.25 + 1.5 * (0.5 + 0.5 * Math.sin(t * (0.8 + hsh(i) * 1.5) + i)));
      s += E(t, tf + 0.1 + i * 0.008, `<circle cx="${cx}" cy="${cy}" r="20" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/><line x1="${cx}" y1="${cy}" x2="${(cx - 15 * Math.sin(a)).toFixed(1)}" y2="${(cy + 15 * Math.cos(a)).toFixed(1)}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`, { dy: 0, blur: 4 });
    }
    s += E(t, tf + 0.4, arrow(1340, 560, 1215, 560, C.line, 4));
    return s + caption(t, W('ordina'), 'Ordina i risultati', '');
  } }) });

// 9 — alcuni fattori principali (registro chiaro)
function icoLinks(x, y, ink) { let s = pageSVG(x + 40, y + 30, 70, 84, { st: ink, fill: C.cream, lines: 2, sw: 3 }); [[-10, 0], [-10, 110], [150, 40]].forEach(([ax, ay]) => s += arrow(x + ax + (ax < 0 ? 0 : 0), y + ay, x + (ax < 0 ? 36 : 116), y + 72, ink, 3)); return s; }
function icoTarget(x, y, ink) { return [42, 28, 12].map(r => `<circle cx="${x + 70}" cy="${y + 70}" r="${r}" fill="none" stroke="${ink}" stroke-width="4"/>`).join('') + `<circle cx="${x + 70}" cy="${y + 70}" r="4" fill="${ink}"/>`; }
function icoCal(x, y, ink) { let s = `<rect x="${x + 22}" y="${y + 26}" width="96" height="90" rx="10" fill="${C.cream}" stroke="${ink}" stroke-width="4"/><line x1="${x + 22}" y1="${y + 50}" x2="${x + 118}" y2="${y + 50}" stroke="${ink}" stroke-width="4"/>`; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) s += `<rect x="${x + 34 + c * 21}" y="${y + 60 + r * 17}" width="12" height="10" rx="2" fill="${ink}" opacity="${r === 2 && c === 3 ? 1 : 0.35}"/>`; return s + [44, 96].map(cx => `<line x1="${x + cx}" y1="${y + 16}" x2="${x + cx}" y2="${y + 34}" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`).join(''); }
function icoCursor(x, y, ink) { return `<path d="M${x + 50},${y + 24} l0,78 l18,-18 l14,30 l14,-7 l-14,-29 l26,0 z" fill="${C.cream}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>` + [[-30, -8], [-36, 14], [-14, -30]].map(([dx, dy]) => `<line x1="${x + 50 + dx * 0.4}" y1="${y + 24 + dy * 0.4}" x2="${x + 50 + dx}" y2="${y + 24 + dy}" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`).join(''); }
scene('fattori', { tail: 1.3, make: (W) => ({
  capAt: W('principali'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, ink = C.ink;
    let g = E(t, -0.4, card(130, 140, 1660, 730, { rot: -0.4 }), { dy: 0 });
    const tiles = [
      ['AUTOREVOLEZZA', ['siti autorevoli che', 'rimandano alla pagina'], icoLinks, W('quanti')],
      ['PERTINENZA', ['risponde davvero', 'alla domanda?'], icoTarget, W('risponde')],
      ['FRESCHEZZA', ['è aggiornata', 'di recente?'], icoCal, W('aggiornata')],
      ['COMPORTAMENTO DEGLI UTENTI', ['quante persone', 'ci cliccano'], icoCursor, W('persone')],
    ];
    tiles.forEach(([ti, ln, ico, t0], i) => {
      const x = 180 + (i % 2) * 800, y = 190 + Math.floor(i / 2) * 330;
      let c = `<rect x="${x}" y="${y}" width="760" height="300" rx="16" fill="${mix(C.cream, C.ink, 0.05)}" stroke="${ink}" stroke-width="3"/>` + ico(x + 30, y + 70, ink) +
        T(x + 210, y + 92, ti, { f: 'mono', size: 28, fill: ink, w: 700, ls: 2 }) +
        IT(x + 210, y + 170, ln[0], { fill: ink, size: 46 }) + IT(x + 210, y + 226, ln[1], { fill: ink, size: 46 });
      g += E(t, t0 - 0.1, c, { dy: 14 });
    });
    s += `<g transform="translate(960,505) scale(${k}) translate(-960,-505)">${g}</g>`;
    return s + caption(t, W('principali'), 'Tra i principali', 'principali', true);
  } }) });

// 10 — non sa se è vera o falsa
scene('verita', { make: (W) => ({
  capAt: W('non', 1),
  render(t) {
    const px = 300, py = 300, pw = 420, ph = 480;
    let s = E(t, -0.4, pageSVG(px, py, pw, ph, { lines: 9, seed: 7, fill: DIM(), sw: 4 }) + T(px + 30, py - 30, '1', { f: 'pop', size: 56 }) + lbl(px + 80, py - 40, 'PRIMO RISULTATO', { a: 'start', size: 26 }), { dy: 0 });
    // link in ingresso e clic
    const src = [[110, 330], [110, 560], [110, 800], [520, 900], [860, 860]];
    src.forEach(([x, y], i) => {
      const t0 = W('link') - 0.1 + i * 0.08, tx = x < 200 ? px - 6 : x - 0 > 700 ? px + pw - 30 : px + 200, ty = x < 200 ? y * 0.5 + 270 : py + ph + 6;
      s += E(t, t0, pageSVG(x - 50, y - 36, 100, 72, { lines: 2, seed: i + 20, fill: C.bg, sw: 2 }) + arrow(x + (x < 200 ? 54 : 0), y - (x < 200 ? 0 : 42), tx, ty, C.line, 3), { dy: 0 });
    });
    if (t > W('popolarità') - 0.1) for (let i = 0; i < 4; i++) {
      const x = px + 80 + i * 90, y = py + 200 + 60 * hsh(i), pp = ((t - W('popolarità') - i * 0.15) % 1.0 + 1) % 1.0;
      s += E(t, W('popolarità') + i * 0.12, `<circle cx="${x}" cy="${y}" r="${10 + 30 * pp}" fill="none" stroke="${C.line}" stroke-width="3" opacity="${(1 - pp).toFixed(2)}"/>` + icoCursor(x - 50, y - 24, C.line).replace(new RegExp(C.cream, 'g'), C.bg), { dy: 0 });
    }
    s += words(t, W('vera'), 900, 300, 'Vera o falsa', { f: 'pop', size: 84 });
    s += E(t, W('falsa') + 0.1, T(900 + tw('Vera o falsa', 'pop', 84) + 14, 300, '?', { f: 'pop', size: 84, fill: C.coral }));
    s += E(t, W('falsa') + 0.1, IT(904, 372, 'Il motore di ricerca non lo sa.', { size: 50 }));
    const rows = [['LINK RICEVUTI', W('link'), true], ['POPOLARITÀ', W('popolarità'), true], ['VERIDICITÀ', W('veridicità'), false]];
    rows.forEach(([l, t0, ok], i) => {
      const y = 520 + i * 100;
      s += E(t, t0 - 0.1, (ok ? check(930, y - 10, 28, C.line, C.bg) : cross(930, y - 10, 28, C.line, C.bg)) + lbl(985, y, l, { a: 'start', size: 34 }) +
        (ok ? lbl(1640, y, 'VALUTATA', { a: 'end', size: 28 }) : lbl(1640, y, 'NON VALUTATA', { a: 'end', size: 28 })), { dy: 8 });
    });
    return s + caption(t, W('non', 1), 'Non la veridicità', '');
  } }) });

// 11 — popolare, ma può contenere informazioni sbagliate (registro chiaro)
scene('valuta', { tail: 1.0, make: (W) => ({
  capAt: W('può'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D, ink = C.ink;
    let g = E(t, -0.4, card(200, 150, 1520, 700, { rot: 0.4 }), { dy: 0 });
    const px = 300, py = 230, pw = 600, ph = 540;
    g += E(t, -0.2, pageSVG(px, py, pw, ph, { st: ink, fill: C.cream, lines: 0, sw: 4 }), { dy: 0 });
    const ly = [340, 400, 460, 520, 580, 640, 700];
    ly.forEach((y, i) => g += E(t, -0.1 + i * 0.04, `<line x1="${px + 50}" y1="${y}" x2="${px + 50 + (i === 0 ? 300 : 380 + 100 * hsh(i))}" y2="${y}" stroke="${ink}" stroke-width="${i === 0 ? 12 : 5}" stroke-linecap="round" opacity="${i === 0 ? 1 : 0.75}"/>`, { dy: 0 }));
    const ts = W('sbagliate') - 0.15;
    if (t > ts) {
      const p = eo((t - ts) / 0.5), y = 532; let d = `M${px + 50},${y}`;
      for (let x = 0; x <= 420 * p; x += 12) d += ` L${px + 50 + x},${y + (x / 12 % 2 ? 9 : -3)}`;
      g += `<path d="${d}" fill="none" stroke="${C.coral}" stroke-width="5" stroke-linejoin="round"/>`;
    }
    g += E(t, W('linkata') - 0.1, icoLinks(1000, 260, ink) + lbl(1170, 340, 'MOLTO LINKATA', { a: 'start', fill: ink, size: 30 }));
    g += E(t, W('popolare') - 0.1, icoCursor(1000, 420, ink) + lbl(1170, 500, 'POPOLARE', { a: 'start', fill: ink, size: 30 }));
    s += `<g transform="translate(960,500) scale(${k}) translate(-960,-500)">${g}</g>`;
    return s + caption(t, W('può'), 'Può contenere informazioni sbagliate', '', true);
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Il motore di ricerca', { f: 'pop', size: 120, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('non') - 0.1, 960, 560, 'Non basta cercare: bisogna anche valutare.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'valutare' });
    s += E(t, W('valutare') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC DIG-1-02', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
