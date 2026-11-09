// La serie A — MC-DIS-1-02 §"I formati dei fogli: la famiglia ISO 216". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.3);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.hold != null) D = Math.max(D, def.hold + 1.55);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const f1 = v => v.toFixed(1);

// ---- formati ISO 216 serie A (mm, dalla tabella della fonte): [lato corto, lato lungo] ----
const FMT = { A0: [841, 1189], A1: [594, 841], A2: [420, 594], A3: [297, 420], A4: [210, 297], A5: [148, 210] };
const NAMES = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];

const rect = (x, y, w, h, st, sw = 4, fill = 'none', o = '') => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="miter" ${o}/>`;
const ln = (x1, y1, x2, y2, st, sw = 3, o = '') => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${st}" stroke-width="${sw}" ${o}/>`;
// punta di freccia di quota (triangolo pieno, stretto) in p, che punta nella direzione (ux,uy)
function head(px, py, ux, uy, c) {
  const l = 20, w = 6;
  return `<path d="M${f1(px)},${f1(py)} L${f1(px - ux * l - uy * w)},${f1(py - uy * l + ux * w)} L${f1(px - ux * l + uy * w)},${f1(py - uy * l - ux * w)} z" fill="${c}"/>`;
}
// quota orizzontale: oggetto fra x1 e x2 con bordo a yRef; linea di quota a y; testo sopra la linea (o sotto se below)
function dimH(x1, x2, yRef, y, s, c = C.line, o = {}) {
  const dir = Math.sign(y - yRef) || -1, size = o.size || 40;
  let g = ln(x1, yRef + dir * 10, x1, y + dir * 14, c, 2) + ln(x2, yRef + dir * 10, x2, y + dir * 14, c, 2);
  g += ln(x1 + 4, y, x2 - 4, y, c, 2.5) + head(x1, y, -1, 0, c) + head(x2, y, 1, 0, c);
  g += T((x1 + x2) / 2, o.below ? y + size + 6 : y - 14, s, { f: 'pop', size, fill: o.tf || c, a: 'middle' });
  return g;
}
// quota verticale: oggetto fra y1 e y2 con bordo a xRef; linea a x; testo ruotato a sinistra della linea
function dimV(y1, y2, xRef, x, s, c = C.line, o = {}) {
  const dir = Math.sign(x - xRef) || -1, size = o.size || 40;
  let g = ln(xRef + dir * 10, y1, x + dir * 14, y1, c, 2) + ln(xRef + dir * 10, y2, x + dir * 14, y2, c, 2);
  g += ln(x, y1 + 4, x, y2 - 4, c, 2.5) + head(x, y1, 0, -1, c) + head(x, y2, 0, 1, c);
  const tx = x - 14, ty = (y1 + y2) / 2;
  g += `<g transform="translate(${f1(tx)},${f1(ty)}) rotate(-90)">${T(0, 0, s, { f: 'pop', size, fill: o.tf || c, a: 'middle' })}</g>`;
  return g;
}
// pianta di esempio (stanze) dentro il riquadro x,y,w,h; sw scala con la dimensione
function plan(x, y, w, h, st, sw) {
  const X = u => x + u * w, Y = v => y + v * h;
  let g = rect(x, y, w, h, st, sw * 1.6);
  // parete verticale con varco porta
  g += ln(X(0.56), Y(0), X(0.56), Y(0.58), st, sw) + ln(X(0.56), Y(0.78), X(0.56), Y(1), st, sw);
  // parete orizzontale nella parte destra con varco
  g += ln(X(0.56), Y(0.46), X(0.74), Y(0.46), st, sw) + ln(X(0.88), Y(0.46), X(1), Y(0.46), st, sw);
  // archi delle porte (quarto di cerchio) e finestre
  const r1 = Y(0.78) - Y(0.58);
  g += `<path d="M${f1(X(0.56))},${f1(Y(0.58))} L${f1(X(0.56) + r1)},${f1(Y(0.58))} A${f1(r1)},${f1(r1)} 0 0 1 ${f1(X(0.56))},${f1(Y(0.78))}" fill="none" stroke="${st}" stroke-width="${f1(sw * 0.55)}"/>`;
  const r2 = X(0.88) - X(0.74);
  g += `<path d="M${f1(X(0.74))},${f1(Y(0.46))} L${f1(X(0.74))},${f1(Y(0.46) + r2)} A${f1(r2)},${f1(r2)} 0 0 0 ${f1(X(0.88))},${f1(Y(0.46))}" fill="none" stroke="${st}" stroke-width="${f1(sw * 0.55)}"/>`;
  g += ln(X(0.14), Y(0), X(0.40), Y(0), C.bg, sw * 0.9) + ln(X(0.14), Y(0) - sw * 0.4, X(0.40), Y(0) - sw * 0.4, st, sw * 0.45) + ln(X(0.14), Y(0) + sw * 0.4, X(0.40), Y(0) + sw * 0.4, st, sw * 0.45);
  return g;
}

// 1 — aggancio: un foglio da disegno e la norma
scene('hook', { make: (W) => ({
  capAt: W('fogli'), hold: W('216'),
  render(t) {
    const k = 2.15, w = 210 * k, h = 297 * k, x = 1240, y = 170;
    let s = E(t, W('fogli'), rect(x, y, w, h, C.line, 4, C.earth) + rect(x + 10 * k, y + 10 * k, w - 20 * k, h - 20 * k, C.line, 2) +
      rect(x + w - 10 * k - 70 * k, y + h - 10 * k - 22 * k, 70 * k, 22 * k, C.line, 2), { dy: 30 });
    s += E(t, W('disegno'), lbl(x + w / 2, y + h * 0.42, 'FOGLIO DA DISEGNO', { size: 26 }) + lbl(x + w / 2, y + h * 0.42 + 44, 'TECNICO', { size: 26 }));
    s += E(t, W('norma'), lbl(140, 360, 'LA NORMA', { a: 'start', size: 30 }));
    s += E(t, W('iso'), T(140, 520, 'ISO 216', { f: 'pop', size: 180, fill: C.coral }));
    return s + caption(t, W('fogli'), 'La norma ISO 216', '');
  } }) });

// 2 — la serie A: sei fogli in proporzione (chiaro)
scene('serie', { make: (W) => {
  const k = 0.46, gap = 52, base = 800;
  const widths = NAMES.map(n => FMT[n][0] * k), tot = widths.reduce((a, b) => a + b, 0) + gap * 5;
  const xs = []; let x = 960 - tot / 2; widths.forEach(w => { xs.push(x); x += w + gap; });
  return {
    capAt: W('serie'), hold: W('a5'),
    render(t) {
      let s = lightBg() + E(t, -0.4, card(150, 130, 1620, 760), { dy: 0 });
      s += E(t, -0.2, lbl(960, 200, 'SERIE A · DISEGNATI IN PROPORZIONE', { size: 26, fill: C.ink }), { dy: 0 });
      const t0 = W('principale'), t1 = W('a5');
      NAMES.forEach((n, i) => {
        const [a, b] = FMT[n], w = a * k, h = b * k, ti = lerp(t0, t1, i / 5);
        s += E(t, ti, rect(xs[i], base - h, w, h, C.ink, 3, C.ivory) + T(xs[i] + w / 2, base + 56, n, { f: 'pop', size: 44, fill: C.ink, a: 'middle' }));
      });
      return s + caption(t, W('serie'), 'La serie A', 'A', true);
    } };
} });

// 3 — l'A0 con le sue quote
const K0 = 0.6, A0W = 1189 * K0, A0H = 841 * K0, A0X = 960 - A0W / 2 + 40, A0Y = 270;
scene('a0', { make: (W) => ({
  capAt: W("l'a0"), hold: W('millimetri'),
  render(t) {
    let s = E(t, W('grande'), rect(A0X, A0Y, A0W, A0H, C.line, 4, C.earth), { dy: 0 });
    s += E(t, W("l'a0"), T(A0X + A0W / 2, A0Y + A0H / 2 + 50, 'A0', { f: 'pop', size: 150, fill: C.coral, a: 'middle' }));
    s += E(t, W('841'), dimV(A0Y, A0Y + A0H, A0X, A0X - 60, '841 mm'), { dy: 0, blur: 4 });
    s += E(t, W('1189'), dimH(A0X, A0X + A0W, A0Y, A0Y - 50, '1189 mm'), { dy: 0, blur: 4 });
    return s + caption(t, W("l'a0"), 'A0: 841 × 1189', '');
  } }) });

// 4 — A0 diviso a metà: due A1
scene('meta1', { make: (W) => ({
  capAt: W('ottieni'), hold: W('millimetri'),
  render(t) {
    const cx = A0X + A0W / 2, pc = eio((t - W('metà')) / 0.5), sep = 26 * eio((t - W('ottieni')) / 0.5);
    let s = '';
    const half = (x0, dx) => rect(x0 + dx, A0Y, A0W / 2, A0H, C.line, 4, C.earth);
    if (sep <= 0) s += rect(A0X, A0Y, A0W, A0H, C.line, 4, C.earth) + T(A0X + 30, A0Y + 60, 'A0', { f: 'pop', size: 44 });
    else s += half(A0X, -sep) + half(cx, sep);
    // linea di taglio (corallo) che scende
    if (pc > 0 && sep < 20) s += ln(cx, A0Y - 30, cx, A0Y - 30 + (A0H + 60) * pc, C.coral, 5, 'stroke-dasharray="18 12"');
    s += E(t, W('a1'), T(A0X - sep + A0W / 4, A0Y + A0H / 2 + 40, 'A1', { f: 'pop', size: 110, a: 'middle' }) + T(cx + sep + A0W / 4, A0Y + A0H / 2 + 40, 'A1', { f: 'pop', size: 110, a: 'middle' }));
    s += E(t, W('594'), dimH(A0X - 26, A0X - 26 + A0W / 2, A0Y, A0Y - 50, '594 mm'), { dy: 0, blur: 4 });
    s += E(t, W('841'), dimV(A0Y, A0Y + A0H, A0X - 26, A0X - 86, '841 mm'), { dy: 0, blur: 4 });
    return s + caption(t, W('ottieni'), 'Due fogli A1', '');
  } }) });

// 5 — e così via: la spirale delle metà dentro l'A0
// suddivisione esatta: a ogni passo il pezzo rimasto si divide a metà sul lato lungo
const PIECES = (() => {
  let r = { x: A0X, y: A0Y, w: A0W, h: A0H }; const out = [];
  for (let i = 1; i <= 5; i++) {
    let a, b, cut;
    if (r.w >= r.h) { a = { x: r.x, y: r.y, w: r.w / 2, h: r.h }; b = { x: r.x + r.w / 2, y: r.y, w: r.w / 2, h: r.h }; cut = [r.x + r.w / 2, r.y, r.x + r.w / 2, r.y + r.h]; }
    else { a = { x: r.x, y: r.y, w: r.w, h: r.h / 2 }; b = { x: r.x, y: r.y + r.h / 2, w: r.w, h: r.h / 2 }; cut = [r.x, r.y + r.h / 2, r.x + r.w, r.y + r.h / 2]; }
    out.push({ name: NAMES[i], a, b, cut }); r = b;
  }
  return out;
})();
scene('meta2', { make: (W) => {
  const T5 = [null, W('a1'), W('a2'), W('a3'), W('a4'), W('a5')];
  T5[1] = -1; // il primo taglio (A0 → A1) è già fatto dalla scena precedente
  return {
    capAt: W('dividi'), hold: T5[5] + 0.3,
    render(t) {
      let s = rect(A0X, A0Y, A0W, A0H, C.line, 4, C.earth);
      PIECES.forEach((p, i) => {
        const tc = i === 0 ? -1 : (i === 1 ? W('metà') : T5[i + 1] - 0.35);
        const pc = eio((t - tc) / 0.35); if (pc <= 0) return;
        const [x1, y1, x2, y2] = p.cut;
        const cur = PIECES.filter((q, j) => (j === 0 ? -1 : (j === 1 ? W('metà') : T5[j + 1] - 0.35)) <= t).length - 1 === i;
        s += ln(x1, y1, lerp(x1, x2, pc), lerp(y1, y2, pc), cur && i > 0 ? C.coral : C.line, cur && i > 0 ? 5 : 4);
      });
      // etichette: il pezzo "a" di ogni passo resta; il pezzo "b" porta l'etichetta finché non viene diviso
      PIECES.forEach((p, i) => {
        const tl = i === 0 ? -1 : (i === 1 ? W('a2') : T5[i + 1]), sz = [96, 72, 52, 40, 32][i];
        const next = i < 4 ? (i + 1 === 1 ? W('metà') : T5[i + 2] - 0.35) : 1e9;
        const lab = (r, n) => T(r.x + r.w / 2, r.y + r.h / 2 + sz * 0.36, n, { f: 'pop', size: sz, a: 'middle' });
        if (t >= tl) {
          s += E(t, tl, lab(p.a, p.name), { dy: 8 });
          if (t < next || i === 4) s += E(t, tl, lab(p.b, p.name), { dy: 8 });
        }
      });
      return s + caption(t, W('dividi'), 'Metà del precedente', '');
    } };
} });

// 6 — l'A4 quotato (chiaro)
scene('a4', { make: (W) => {
  const k = 1.8, w = 210 * k, h = 297 * k, x = 600, y = 245;
  return {
    capAt: W("l'a4"), hold: W('standard'),
    render(t) {
      let s = lightBg() + E(t, -0.4, card(380, 130, 760, 750), { dy: 0 });
      s += E(t, -0.3, rect(x, y, w, h, C.ink, 4, C.ivory), { dy: 0 });
      s += E(t, W('210'), dimH(x, x + w, y, y - 46, '210 mm', C.ink), { dy: 0, blur: 4 });
      s += E(t, W('297'), dimV(y, y + h, x, x - 60, '297 mm', C.ink), { dy: 0, blur: 4 });
      s += E(t, -0.2, T(x + w / 2, y + h / 2 + 40, 'A4', { f: 'pop', size: 110, fill: C.ink, a: 'middle' }), { dy: 0 });
      s += E(t, W('formato'), lbl(1240, 420, 'IL FORMATO', { a: 'start', size: 30, fill: C.ink }));
      s += words(t, W('scolastico'), 1240, 520, 'scolastico', { f: 'serif', it: true, size: 92, fill: C.coralT });
      s += words(t, W('standard'), 1240, 610, 'standard', { f: 'serif', it: true, size: 92, fill: C.ink });
      return s + caption(t, W("l'a4"), 'A4: 210 × 297', '', true);
    } };
} });

// 7 — il rapporto √2 (chiaro)
scene('rapp', { make: (W) => ({
  capAt: W('sempre'), hold: W('quattrocentoquattordici'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(200, 140, 1520, 720), { dy: 0 });
    s += E(t, W('lato'), T(960, 340, 'lato lungo ÷ lato corto', { f: 'pop', size: 76, fill: C.ink, a: 'middle' }));
    const w1 = tw('= √2', 'pop', 120), w2 = tw('≈ 1,414', 'pop', 88), x0 = 960 - (w1 + 60 + w2) / 2;
    s += E(t, W('radice'), T(x0, 500, '=', { f: 'pop', size: 120, fill: C.ink }) + T(x0 + tw('= ', 'pop', 120), 500, '√2', { f: 'pop', size: 120, fill: C.coralT }));
    s += E(t, W('uno'), T(x0 + w1 + 60, 500, '≈ 1,414', { f: 'pop', size: 88, fill: C.ink }));
    const rows = [['A0', '1189 ÷ 841'], ['A3', '420 ÷ 297'], ['A4', '297 ÷ 210']];
    rows.forEach((r, i) => {
      const x = 330 + i * 460;
      s += E(t, W('ogni') + i * 0.18, `<rect x="${x}" y="610" width="400" height="150" rx="14" fill="${C.ivory}" stroke="${C.ink}" stroke-width="2.5"/>` +
        T(x + 28, 666, r[0], { f: 'mono', size: 30, fill: C.ink, w: 700 }) + T(x + 28, 728, r[1] + ' ≈ 1,414', { f: 'mono', size: 30, fill: C.ink, w: 500 }));
    });
    return s + caption(t, W('sempre'), 'Sempre radice di due', '', true);
  } }) });

// 8 — stesse proporzioni: i formati con un angolo comune stanno su una sola diagonale
scene('diag', { make: (W) => {
  const k = 0.6, ox = 260, oy = 830;
  return {
    capAt: W('stesse'), hold: W('intero'),
    render(t) {
      let s = '';
      NAMES.forEach((n, i) => {
        const [a, b] = FMT[n], w = b * k, h = a * k;
        s += E(t, (i === 0 ? -0.3 : W('ogni') + (i - 1) * 0.16), rect(ox, oy - h, w, h, C.line, 3, i === 0 ? C.earth : 'none') +
          T(ox + 14, oy - h + 34, n, { f: 'mono', size: 26, w: 700 }), { dy: 0, blur: 5 });
      });
      const p = eio((t - W('stesse')) / 0.8), ex = ox + 1189 * k, ey = oy - 841 * k;
      if (p > 0) s += ln(ox, oy, lerp(ox, ex, p), lerp(oy, ey, p), C.coral, 5);
      s += E(t, W('proporzioni'), lbl(1080, 430, 'GLI ANGOLI OPPOSTI', { a: 'start', size: 28 }) + lbl(1080, 476, 'SU UNA SOLA DIAGONALE', { a: 'start', size: 28 }));
      s += E(t, W('foglio'), IT(1080, 600, 'stessa forma,', { size: 64 }) + IT(1080, 670, 'misure diverse', { size: 64 }));
      return s + caption(t, W('stesse'), 'Stesse proporzioni', '');
    } };
} });

// 9 — A3 in scala 1:50 ridotto al 70,7% diventa un A4
const R = Math.SQRT1_2; // 0,7071
scene('riduci', { make: (W) => {
  const k = 1.6, w = 420 * k, h = 297 * k, x = 150, y = 300, tx = 1180, ty = y + (h - h * R) / 2;
  const sheet = (st, sw) => rect(0, 0, w, h, st, sw, C.earth) + plan(w * 0.1, h * 0.12, w * 0.8, h * 0.76, st, 5);
  return {
    capAt: W('a3'), hold: W('a4') + 0.1,
    render(t) {
      let s = E(t, W('disegno'), `<g transform="translate(${x},${y})">${sheet(C.line, 4)}</g>`, { dy: 20 });
      s += E(t, W('a3'), lbl(x, y - 30, 'A3', { a: 'start', size: 30 }));
      s += E(t, W('scala'), lbl(x + 80, y - 30, '· SCALA 1:50', { a: 'start', size: 30 }));
      s += E(t, W('disegno'), pillTag(x, y + h + 70, 'ESEMPIO', C.line, C.bg));
      const p = eio((t - W('riduci')) / 1.1);
      if (p > 0) {
        const sc = lerp(1, R, p), X = lerp(x, tx, p), Y = lerp(y, ty, p);
        s += `<g transform="translate(${f1(X)},${f1(Y)}) scale(${sc.toFixed(5)})" opacity="${clamp(p * 3).toFixed(3)}">${sheet(C.line, 4 / sc)}</g>`;
      }
      s += E(t, W('settanta'), arrow(880, 240, 1160, 240, C.line, 4) + T(1020, 206, '70,7%', { f: 'pop', size: 52, fill: C.coral, a: 'middle' }));
      s += E(t, W('a4'), lbl(tx, ty - 30, 'A4', { a: 'start', size: 30 }));
      return s + caption(t, W('a3'), 'Da A3 ad A4', '');
    } };
} });

// 10 — la nuova scala (chiaro)
scene('scala', { make: (W) => ({
  capAt: W('circa'), hold: W('settecentosette'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(260, 150, 1400, 700), { dy: 0 });
    s += E(t, -0.2, lbl(960, 240, 'LA NUOVA SCALA', { size: 28, fill: C.ink }), { dy: 0 });
    const wa = tw('1:50', 'pop', 130), wb = tw('≈ 1:70,7', 'pop', 130), xa = 960 - (wa + 200 + wb) / 2;
    s += E(t, W('nuova'), T(xa, 450, '1:50', { f: 'pop', size: 130, fill: C.ink }));
    s += E(t, W('nuova'), arrow(xa + wa + 40, 405, xa + wa + 160, 405, C.ink, 6));
    s += E(t, W('uno'), T(xa + wa + 200, 450, '≈ 1:70,7', { f: 'pop', size: 130, fill: C.coralT }));
    s += E(t, W('cinquanta'), T(960, 680, '50 ÷ 0,707 ≈ 70,7', { f: 'mono', size: 64, fill: C.ink, a: 'middle', w: 600 }));
    return s + caption(t, W('circa'), 'Circa 1:70,7', '', true);
  } }) });

// 11 — si dimezza l'area, non le lunghezze
scene('area', { make: (W) => {
  const k = 1.4, w = 420 * k, h = 297 * k, x = 150, y = 300;
  return {
    capAt: W('dimezza'), hold: W('lunghezze'),
    render(t) {
      let s = '';
      s += E(t, -0.4, rect(x, y, w, h, C.line, 4, C.earth) + lbl(x, y - 30, 'A3', { a: 'start', size: 30 }), { dy: 0 });
      const p = eio((t - W('dimezza')) / 0.45);
      if (p > 0) s += ln(x + w / 2, y, x + w / 2, y + h * p, C.line, 3, 'stroke-dasharray="14 10"');
      s += E(t, W("l'area"), rect(x, y, w / 2, h, 'none', 0, C.coral, 'fill-opacity="0.45"') +
        T(x + w / 4, y + h / 2 + 22, 'A4', { f: 'pop', size: 64, a: 'middle' }) + T(x + w * 3 / 4, y + h / 2 + 22, 'A4', { f: 'pop', size: 64, a: 'middle' }), { dy: 0, blur: 5 });
      const bx = 1000;
      s += E(t, W('non'), lbl(bx, 330, 'LATO LUNGO A3', { a: 'start', size: 26 }) + dimH(bx, bx + 420 * k, 380, 400, '420 mm', C.line, { below: true }));
      s += E(t, W('lunghezze'), lbl(bx, 560, 'LATO LUNGO A4', { a: 'start', size: 26 }) + dimH(bx, bx + 297 * k, 610, 630, '297 mm', C.line, { below: true }) +
        T(bx + 297 * k + 40, 645, '= 70,7%', { f: 'pop', size: 48 }));
      return s + caption(t, W('dimezza'), 'Metà area', '');
    } };
} });

// 12 — da 1:50 a 1:100: lunghezze al 50%
scene('cento', { make: (W) => {
  const w = 600, h = w * 297 / 420, x = 150, y = 290, x2 = 1100, w2 = w / 2, h2 = h / 2, y2 = y + h - h2;
  return {
    capAt: W('ridurre'), hold: W('cento', 1),
    render(t) {
      let s = E(t, W('cinquanta'), plan(x, y, w, h, C.line, 5) + lbl(x, y - 40, 'SCALA 1:50', { a: 'start', size: 30 }) +
        dimH(x, x + w, y + h, y + h + 50, '100%', C.line, { below: true }), { dy: 20 });
      s += E(t, W('cento'), plan(x2, y2, w2, h2, C.line, 5) + lbl(x2, y2 - 40, 'SCALA 1:100', { a: 'start', size: 30 }), { dy: 20 });
      s += E(t, W('cinquanta', 1), dimH(x2, x2 + w2, y2 + h2, y2 + h2 + 50, '50%', C.coral, { below: true }), { dy: 0, blur: 4 });
      s += E(t, W('cinquanta'), pillTag(1500, 290, 'ESEMPIO', C.line, C.bg), { dy: 0 });
      return s + caption(t, W('ridurre'), 'Lunghezze al 50%', '');
    } };
} });

// 13 — cartello finale
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'La serie A', { f: 'pop', size: 130, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('ogni') - 0.1, 960, 560, 'Ogni formato è metà del precedente.', { f: 'serif', size: 66, fill: C.ink, a: 'middle', it: true, key: 'metà', keyFill: C.coralT });
    s += E(t, W('proporzioni') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC DIS-1-02', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
