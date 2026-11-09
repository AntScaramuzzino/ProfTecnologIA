// La stampa 3D alimentare — scene con render(t, D) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.45);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient>
<clipPath id="lens"><circle cx="0" cy="0" r="150"/></clipPath></defs>`;

const lbl = (x, y, s, o = {}) => T(x, y, s, { f: 'mono', size: o.size || 26, fill: o.fill || C.line, ls: 3, a: o.a || 'middle', w: 600 });
function pillTag(x, y, s, ink, bg, a = 'start') {
  const w = tw(s, 'mono', 28) + 44, x0 = a === 'middle' ? x - w / 2 : x;
  return `<rect x="${x0}" y="${y - 35}" width="${w}" height="50" rx="25" fill="${bg}" stroke="${ink}" stroke-width="2"/>` + T(x0 + w / 2, y, s, { f: 'mono', size: 28, fill: ink, a: 'middle' });
}
const BEAD = mix(C.bg, C.line, 0.22);
const LH = 24; // spessore di uno strato

// ---------- la stampante in sezione ----------
// job: lista di strati, ogni strato = lista di segmenti [x0,x1]; percorso a serpentina.
function makeJob(layers, speed) {
  const steps = layers.map((segs, k) => {
    const rev = k % 2 === 1;
    const sg = rev ? segs.map(([a, b]) => [b, a]).reverse() : segs.map(s => s.slice());
    const len = Math.abs(sg[sg.length - 1][1] - sg[0][0]);
    return { sg, len, rev };
  });
  let acc = 0; steps.forEach(s => { s.t0 = acc; acc += s.len / speed; });
  return { steps, total: acc, layers };
}
// stato del lavoro al tempo tau (s dall'avvio): strati completi, strato corrente, posizione ugello
function jobState(job, tau) {
  const n = job.steps.length;
  if (tau <= 0) return { k: 0, x: job.steps[0].sg[0][0], partial: [], done: 0, active: false };
  if (tau >= job.total) { const l = job.steps[n - 1]; return { k: n - 1, x: l.sg[l.sg.length - 1][1], partial: null, done: n, active: false, finished: true }; }
  let k = 0; while (k < n - 1 && tau >= job.steps[k + 1].t0) k++;
  const st = job.steps[k];
  const p = clamp((tau - st.t0) / ((k + 1 < n ? job.steps[k + 1].t0 : job.total) - st.t0));
  const start = st.sg[0][0], dir = st.rev ? -1 : 1, x = start + dir * st.len * p;
  const partial = [];
  st.sg.forEach(([a, b]) => {
    if (dir > 0) { if (x > a) partial.push([a, Math.min(b, x)]); }
    else { if (x < a) partial.push([Math.max(b, x), a]); }
  });
  return { k, x, partial, done: k, active: true };
}
function bead(x0, x1, y, fill, stroke) {
  const a = Math.min(x0, x1), w = Math.max(LH - 2, Math.abs(x1 - x0));
  return `<rect x="${a}" y="${y - LH + 1}" width="${w}" height="${LH - 2}" rx="${(LH - 2) / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
}
// disegna il pezzo stampato (strati completi + corrente). o.curC = colore dello strato in corso
function printed(job, stt, bedY, o = {}) {
  const fill = o.fill || BEAD, st = o.stroke || C.line; let s = '';
  for (let k = 0; k < stt.done; k++) job.layers[k].forEach(([a, b]) => s += bead(a, b, bedY - k * LH, fill, st));
  if (stt.partial) {
    const cf = o.curC ? mix(C.bg, o.curC, 0.35) : fill, cs = o.curC || st;
    stt.partial.forEach(([a, b]) => s += bead(a, b, bedY - stt.k * LH, cf, cs));
  }
  return s;
}
// telaio + piatto + testa di stampa (siringa di materiale + ugello)
function printer(cx, bedY, o = {}) {
  const ink = o.ink || C.line, bg = o.bg || C.bg, hw = o.hw || 360, top = bedY - (o.h || 590);
  let s = '';
  // telaio
  s += `<rect x="${cx - hw - 40}" y="${bedY + 34}" width="${2 * hw + 80}" height="34" rx="8" fill="${bg}" stroke="${ink}" stroke-width="4"/>`;
  [cx - hw, cx + hw].forEach(x => s += `<rect x="${x - 14}" y="${top}" width="28" height="${bedY + 34 - top}" fill="${bg}" stroke="${ink}" stroke-width="4"/>`);
  s += `<rect x="${cx - hw - 14}" y="${top - 26}" width="${2 * hw + 28}" height="28" rx="6" fill="${bg}" stroke="${ink}" stroke-width="4"/>`;
  // piatto di stampa
  s += `<rect x="${cx - hw + 60}" y="${bedY}" width="${2 * hw - 120}" height="16" rx="5" fill="${mix(bg, ink, 0.12)}" stroke="${ink}" stroke-width="3"/>`;
  s += `<rect x="${cx - 40}" y="${bedY + 16}" width="80" height="18" fill="${bg}" stroke="${ink}" stroke-width="3"/>`;
  return s;
}
function head(nx, tipY, cx, o = {}) {
  const ink = o.ink || C.line, bg = o.bg || C.bg, hw = o.hw || 360, nc = o.nozC || ink, flow = o.flow || 0;
  const coneTop = tipY - 64, bodyTop = coneTop - 150, railY = coneTop - 75;
  let s = '';
  // guida orizzontale (sale con la testa)
  s += `<rect x="${cx - hw}" y="${railY - 9}" width="${2 * hw}" height="18" rx="4" fill="${bg}" stroke="${ink}" stroke-width="3"/>`;
  [cx - hw, cx + hw].forEach(x => s += `<rect x="${x - 24}" y="${railY - 20}" width="48" height="40" rx="6" fill="${bg}" stroke="${ink}" stroke-width="3"/>`);
  // carrello
  s += `<rect x="${nx - 70}" y="${railY - 30}" width="140" height="60" rx="8" fill="${bg}" stroke="${ink}" stroke-width="3"/>`;
  // siringa con il materiale alimentare
  s += `<rect x="${nx - 38}" y="${bodyTop}" width="76" height="150" rx="10" fill="${bg}" stroke="${ink}" stroke-width="4"/>`;
  s += `<rect x="${nx - 30}" y="${bodyTop + 52}" width="60" height="90" rx="6" fill="${mix(bg, o.matC || ink, 0.3)}"/>`;
  s += `<rect x="${nx - 32}" y="${bodyTop + 40}" width="64" height="12" rx="3" fill="${ink}"/><line x1="${nx}" y1="${bodyTop + 40}" x2="${nx}" y2="${bodyTop - 50}" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>`;
  s += `<rect x="${nx - 26}" y="${bodyTop - 62}" width="52" height="14" rx="4" fill="${bg}" stroke="${ink}" stroke-width="3"/>`;
  // ugello
  s += `<path d="M${nx - 30},${coneTop} L${nx + 30},${coneTop} L${nx + 7},${tipY - 4} L${nx - 7},${tipY - 4} z" fill="${nc === ink ? bg : mix(bg, nc, 0.3)}" stroke="${nc}" stroke-width="4" stroke-linejoin="round"/>`;
  if (flow > 0) s += `<rect x="${nx - 5}" y="${tipY - 6}" width="10" height="10" rx="4" fill="${o.flowC || ink}"/>`;
  return s;
}
// scena completa della stampante: job avviato a t0
function printScene(t, job, t0, cx, bedY, o = {}) {
  const stt = jobState(job, t - t0);
  let tipY = bedY - (stt.k + 1) * LH + 2;
  if (stt.finished) tipY -= 70 * eo((t - t0 - job.total) / 0.6);
  else if (!stt.active) tipY -= 70;
  let s = printer(cx, bedY, o) + printed(job, stt, bedY, o);
  s += head(stt.x, tipY, cx, { ...o, flow: stt.active ? 1 : 0, flowC: o.curC || C.line });
  return { s, stt };
}
// profili
function domeLayers(cx, n, R) {
  const out = [];
  for (let k = 0; k < n; k++) { const hw = R * Math.sqrt(1 - Math.pow((k + 0.5) / (n + 0.4), 2.4)); out.push([[cx - hw, cx + hw]]); }
  return out;
}
function latticeLayers(cx, n) { // reticolo geometrico: piramide traforata a mattoncini sfalsati
  const out = [];
  for (let k = 0; k < n; k++) {
    const hw = lerp(300, 70, k / (n - 1)), seg = 46, gap = 30, off = (k % 2) * (seg + gap) / 2;
    const segs = []; let x = cx - hw;
    const p = seg + gap; let s0 = cx - hw - ((cx - hw - (cx - 1000 + off)) % p + p) % p; // griglia allineata
    for (x = s0; x < cx + hw; x += p) { const a = Math.max(x, cx - hw), b = Math.min(x + seg, cx + hw); if (b - a > 14) segs.push([a, b]); }
    if (k % 3 === 2 || k === 0 || k === n - 1) out.push([[cx - hw, cx + hw]]); else out.push(segs);
  }
  return out;
}
// modello digitale: reticolo di una cupola che ruota
function wireDome(cx, by, R, H, ang, c, sw = 3) {
  let s = ''; const n = 6;
  for (let i = 0; i <= n; i++) { // anelli
    const h = i / n, r = R * Math.sqrt(Math.max(0, 1 - Math.pow(h, 2.4))), y = by - h * H;
    if (r > 2) s += `<ellipse cx="${cx}" cy="${y}" rx="${r}" ry="${r * 0.22}" fill="none" stroke="${c}" stroke-width="${sw}" opacity="${i === 0 ? 1 : 0.9}"/>`;
  }
  for (let j = 0; j < 6; j++) { // meridiani
    const a = ang + j * Math.PI / 6; let d = '';
    for (let i = 0; i <= 24; i++) {
      const h = i / 24, r = R * Math.sqrt(Math.max(0, 1 - Math.pow(h, 2.4)));
      d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ',' + (by - h * H + r * 0.22 * Math.sin(a)).toFixed(1);
    }
    s += `<path d="${d}" fill="none" stroke="${c}" stroke-width="${sw - 0.5}" opacity="0.85"/>`;
  }
  return s;
}
function monitor(x, y, w, h, inner, o = {}) {
  const ink = o.ink || C.line;
  return `<rect x="${x + w / 2 - 70}" y="${y + h}" width="140" height="${o.stand ?? 70}" fill="${C.bg}" stroke="${ink}" stroke-width="4"/>` +
    `<rect x="${x + w / 2 - 150}" y="${y + h + (o.stand ?? 70)}" width="300" height="20" rx="6" fill="${C.bg}" stroke="${ink}" stroke-width="4"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${C.bg}" stroke="${ink}" stroke-width="5"/>` +
    `<rect x="${x + 22}" y="${y + 22}" width="${w - 44}" height="${h - 44}" rx="8" fill="${mix(C.bg, C.line, 0.05)}" stroke="${ink}" stroke-width="2"/>` + inner;
}

// ======================= SCENE =======================
const HOOKJOB = makeJob(domeLayers(1250, 10, 230), 800);

// 1 — aggancio
scene('hook', { L: 0.5, make: (W) => ({
  capAt: W('stampa'),
  render(t) {
    let s = E(t, -0.4, printScene(t, HOOKJOB, 0.4, 1250, 760, { curC: C.coral }).s, { dy: 0 });
    s += words(t, 0.25, 130, 420, 'Stampare', { f: 'pop', size: 116 });
    s += words(t, 0.5, 130, 545, 'il cibo?', { f: 'pop', size: 116 });
    s += E(t, W('esiste'), T(134, 640, 'esiste davvero', { f: 'serif', size: 60, it: true }));
    return s + caption(t, W('stampa'), 'Stampa 3D alimentare', '');
  } }) });

// 2 — il modello digitale
scene('modello', { make: (W) => ({
  capAt: W('modello'),
  render(t) {
    let s = '';
    const inner = E(t, W('modello') - 0.3, wireDome(960, 600, 230, 260, t * 0.7, C.coral, 3.5), { dy: 0 });
    s += E(t, -0.4, monitor(560, 200, 800, 520, inner), { dy: 0 });
    s += E(t, W('modello'), lbl(960, 290, 'MODELLO DIGITALE'));
    s += E(t, W('forma'), T(1400, 470, 'la forma che si', { f: 'serif', size: 54, it: true }) + T(1400, 535, 'vuole ottenere', { f: 'serif', size: 54, it: true }));
    return s + caption(t, W('modello'), 'Un modello digitale', '');
  } }) });

// 3 — strato per strato
const STRJOB = makeJob(domeLayers(1220, 11, 250), 1150);
scene('strati', { make: (W) => ({
  capAt: W('strato'),
  render(t) {
    const t0 = W('deposita');
    const P = printScene(t, STRJOB, t0, 1220, 760, { curC: C.coral });
    let s = E(t, -0.4, P.s, { dy: 0 });
    // piccolo monitor col modello
    s += E(t, -0.4, monitor(110, 300, 380, 260, wireDome(300, 500, 110, 125, t * 0.7, C.line, 2.5), { stand: 40 }) + lbl(300, 680, 'MODELLO'), { dy: 0 });
    s += E(t, W('seguendo') - 0.2, `<path d="M520,430 L760,430" stroke="${C.line}" stroke-width="4" stroke-dasharray="4 14" stroke-linecap="round"/>` + arrow(740, 430, 790, 430, C.line, 4));
    // indicatore degli strati a destra del pezzo
    const nDone = P.stt.finished ? STRJOB.layers.length : P.stt.k + (P.stt.active ? 1 : 0);
    if (nDone > 0) {
      const yb = 760, yt = 760 - nDone * LH;
      s += `<line x1="1620" y1="${yb}" x2="1620" y2="${yt}" stroke="${C.line}" stroke-width="3"/><line x1="1604" y1="${yb}" x2="1636" y2="${yb}" stroke="${C.line}" stroke-width="3"/><line x1="1604" y1="${yt}" x2="1636" y2="${yt}" stroke="${C.line}" stroke-width="3"/>`;
      s += lbl(1650, yt + 8, 'STRATI', { a: 'start' });
    }
    s += E(t, W('principio') - 0.1, pillTag(110, 230, 'come la stampa 3D tradizionale', C.line, C.bg));
    return s + caption(t, W('strato'), 'Strato per strato', '');
  } }) });

// 4 — i materiali (registro chiaro)
scene('materiali', { make: (W) => ({
  capAt: W('materiali'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(180, 150, 1560, 680, { rot: -1 }), { dy: 0 });
    g += E(t, 0.1, T(250, 250, 'AL POSTO DEI SOLITI MATERIALI: CIBO', { f: 'mono', size: 30, fill: C.ink, ls: 3, w: 700 }));
    const items = [['cioccolato', 'fuso', 'cioccolato'], ['pasta di', 'cereali', 'pasta'], ['purea di', 'verdure', 'purea'], ['impasto', 'di carne', 'impasto'], ['gel', 'proteici', 'gel']];
    items.forEach(([a, b, w], i) => {
      const x = 330 + i * 315, y0 = 330, isC = i === 0, ink = isC ? C.coral : C.ink;
      const fill = mix(C.cream, isC ? C.coral : C.ink, [0.45, 0.22, 0.32, 0.38, 0.12][i]);
      const lv = eo((t - W(w)) / 0.7);
      let c = `<rect x="${x - 60}" y="${y0}" width="120" height="260" rx="16" fill="${C.cream}" stroke="${ink}" stroke-width="4"/>`;
      c += `<rect x="${x - 50}" y="${y0 + 250 - 200 * lv}" width="100" height="${200 * lv}" rx="10" fill="${fill}"/>`;
      c += `<path d="M${x - 34},${y0 + 260} L${x + 34},${y0 + 260} L${x + 8},${y0 + 320} L${x - 8},${y0 + 320} z" fill="${C.cream}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
      c += `<rect x="${x - 70}" y="${y0 - 18}" width="140" height="18" rx="5" fill="${C.cream}" stroke="${ink}" stroke-width="3"/>`;
      g += E(t, 0.2 + i * 0.1, c);
      g += E(t, W(w) - 0.15, T(x, y0 + 390, a, { f: 'popm', size: 36, fill: C.ink, a: 'middle' }) + T(x, y0 + 436, b, { f: 'popm', size: 36, fill: C.ink, a: 'middle' }));
    });
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('materiali'), 'Materiali alimentari', '', true);
  } }) });

// 5 — disfagia
function tray(x, y, ink) {
  return `<rect x="${x - 260}" y="${y}" width="520" height="40" rx="12" fill="${C.bg}" stroke="${ink}" stroke-width="4"/>` +
    `<path d="M${x - 200},${y} Q${x - 200},${y - 230} ${x},${y - 236} Q${x + 200},${y - 230} ${x + 200},${y} z" fill="${mix(C.bg, ink, 0.08)}" stroke="${ink}" stroke-width="4"/>` +
    `<circle cx="${x}" cy="${y - 252}" r="18" fill="${C.bg}" stroke="${ink}" stroke-width="4"/>`;
}
scene('disfagia', { make: (W) => ({
  capAt: W('difficoltà'),
  render(t) {
    const L = C.line, B = C.bg;
    // tavolino servitore con il pasto
    let s = E(t, -0.2, `<rect x="600" y="500" width="300" height="16" rx="5" fill="${B}" stroke="${L}" stroke-width="4"/><rect x="872" y="516" width="16" height="204" fill="${B}" stroke="${L}" stroke-width="3"/><rect x="810" y="718" width="140" height="14" rx="5" fill="${B}" stroke="${L}" stroke-width="3"/>` +
      `<g transform="translate(750,500) scale(0.5) translate(-500,-640)">${tray(500, 640, L)}</g>`, { dy: 0 });
    // letto d'ospedale (segno neutro)
    s += E(t, W('ospedali') - 0.2, `<rect x="160" y="430" width="34" height="290" rx="8" fill="${B}" stroke="${L}" stroke-width="4"/>` +
      `<rect x="194" y="560" width="430" height="44" rx="10" fill="${mix(B, L, 0.1)}" stroke="${L}" stroke-width="4"/>` +
      `<ellipse cx="262" cy="542" rx="56" ry="20" fill="${B}" stroke="${L}" stroke-width="3"/>` +
      `<line x1="160" y1="630" x2="640" y2="630" stroke="${L}" stroke-width="5"/><rect x="620" y="520" width="24" height="200" rx="6" fill="${B}" stroke="${L}" stroke-width="4"/>` +
      `<line x1="200" y1="630" x2="200" y2="716" stroke="${L}" stroke-width="4"/><line x1="600" y1="630" x2="600" y2="716" stroke="${L}" stroke-width="4"/>` +
      `<circle cx="200" cy="732" r="15" fill="${B}" stroke="${L}" stroke-width="4"/><circle cx="600" cy="732" r="15" fill="${B}" stroke="${L}" stroke-width="4"/>` +
      lbl(420, 800, 'OSPEDALE'));
    s += E(t, W('disfagia') - 0.1, T(1000, 420, 'disfagia', { f: 'pop', size: 130 }));
    s += E(t, W('cioè'), T(1006, 520, '=', { f: 'pop', size: 70 }) + T(1070, 520, 'difficoltà a', { f: 'serif', size: 70, it: true }));
    s += E(t, W('deglutire'), T(1070, 600, 'deglutire', { f: 'serif', size: 70, it: true, fill: C.coral }));
    return s + caption(t, W('difficoltà'), 'Difficoltà a deglutire', '');
  } }) });

// 6 — aspetto normale, consistenza morbida
function spaghetti(cx, cy, ink) {
  let s = `<ellipse cx="${cx}" cy="${cy + 60}" rx="250" ry="58" fill="${C.bg}" stroke="${ink}" stroke-width="4"/><ellipse cx="${cx}" cy="${cy + 56}" rx="175" ry="36" fill="none" stroke="${ink}" stroke-width="2" opacity="0.6"/>`;
  const r = 170, H = 120;
  s += `<path d="M${cx - r},${cy + 56} Q${cx - r},${cy + 56 - H * 1.3} ${cx},${cy + 56 - H * 1.25} Q${cx + r},${cy + 56 - H * 1.3} ${cx + r},${cy + 56} z" fill="${mix(C.bg, ink, 0.08)}" stroke="none"/>`;
  for (let i = 0; i < 9; i++) { // fili ondulati sul cumulo
    const f = 0.25 + i * 0.09; let d = '';
    for (let k = 0; k <= 40; k++) {
      const u = -1 + 2 * k / 40, x = cx + u * r * (1.02 - f * 0.55), base = cy + 56 - H * f * 1.15 * Math.sqrt(Math.max(0, 1 - u * u * 0.9));
      d += (k ? 'L' : 'M') + x.toFixed(1) + ',' + (base + 7 * Math.sin(u * 9 + i * 1.7)).toFixed(1);
    }
    s += `<path d="${d}" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
  }
  s += `<path d="M${cx - 70},${cy - 70} Q${cx - 40},${cy - 112} ${cx + 10},${cy - 100} Q${cx + 70},${cy - 104} ${cx + 72},${cy - 72} Q${cx},${cy - 50} ${cx - 70},${cy - 70} z" fill="${mix(C.bg, ink, 0.35)}" stroke="${ink}" stroke-width="3"/>`;
  return s;
}
function cake(x, y, ink, bg, plateC) { // fetta di torta di profilo: pan di spagna, farcitura, glassa, decorazioni
  const sp = mix(bg, ink, 0.1), fa = mix(bg, ink, 0.38), x0 = x - 200, x1 = x + 200;
  const wav = (ya, yb) => { let d = `M${x0},${ya}`; for (let k = 0; k <= 20; k++) d += ` L${x0 + k * 20},${ya + 4 * Math.sin(k * 1.3)}`; d += ` L${x1},${yb}`; for (let k = 20; k >= 0; k--) d += ` L${x0 + k * 20},${yb + 4 * Math.sin(k * 1.3 + 1)}`; return d + 'z'; };
  let s = `<ellipse cx="${x}" cy="${y + 18}" rx="250" ry="34" fill="${bg}" stroke="${plateC || ink}" stroke-width="${plateC ? 5 : 4}"/>`;
  s += `<rect x="${x0}" y="${y - 176}" width="400" height="176" rx="6" fill="${sp}" stroke="${ink}" stroke-width="4"/>`;
  s += `<path d="${wav(y - 68, y - 50)}" fill="${fa}" stroke="${ink}" stroke-width="2.5"/>`;
  s += `<path d="${wav(y - 132, y - 114)}" fill="${fa}" stroke="${ink}" stroke-width="2.5"/>`;
  s += `<path d="M${x0 - 4},${y - 174} Q${x0 - 4},${y - 200} ${x0 + 20},${y - 200} L${x1 - 20},${y - 200} Q${x1 + 4},${y - 200} ${x1 + 4},${y - 174} z" fill="${bg}" stroke="${ink}" stroke-width="4"/>`;
  [-130, -40, 50, 140].forEach((dx, k) => { if (k === 2) return; s += `<path d="M${x + dx - 26},${y - 200} Q${x + dx},${y - 250} ${x + dx + 26},${y - 200} z" fill="${bg}" stroke="${ink}" stroke-width="3"/>`; });
  s += `<circle cx="${x + 50}" cy="${y - 222}" r="22" fill="${fa}" stroke="${ink}" stroke-width="3"/><path d="M${x + 50},${y - 244} q8,-18 22,-22" fill="none" stroke="${ink}" stroke-width="3"/>`;
  for (let k = 0; k < 9; k++) [y - 25, y - 92, y - 152].forEach((yy, r) => s += `<circle cx="${x0 + 30 + k * 43 + r * 10}" cy="${yy}" r="3" fill="${ink}" opacity="0.5"/>`);
  return s;
}
scene('piatto', { make: (W) => ({
  capAt: W('aspetto'),
  render(t) {
    let s = '';
    s += E(t, W('pasti') - 0.2, spaghetti(520, 560, C.line) + lbl(520, 720, 'SPAGHETTI AL RAGÙ') + lbl(520, 766, '· STAMPATO IN 3D ·', { size: 24 }));
    s += E(t, W('torta') - 0.2, cake(1340, 640, C.line, C.bg) + lbl(1340, 720, 'FETTA DI TORTA') + lbl(1340, 766, '· STAMPATO IN 3D ·', { size: 24 }));
    // lente sulla fetta: interno morbido e omogeneo
    const lp = eo((t - W('consistenza') + 0.1) / 0.5);
    if (lp > 0) {
      const lx = 1440, ly = 330, R = 150 * lp;
      let dots = ''; for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) { const x = -160 + i * 40 + (j % 2) * 20, y = -160 + j * 40; dots += `<circle cx="${x}" cy="${y}" r="5" fill="${C.line}" opacity="0.55"/>`; }
      s += `<line x1="${1330}" y1="${540}" x2="${lx - 90}" y2="${ly + 110}" stroke="${C.coral}" stroke-width="3" opacity="${lp}"/>`;
      s += `<g transform="translate(${lx},${ly}) scale(${lp})"><circle r="150" fill="${mix(C.bg, C.line, 0.12)}"/><g clip-path="url(#lens)">${dots}</g><circle r="150" fill="none" stroke="${C.coral}" stroke-width="5"/></g>`;
      s += E(t, W('morbida') - 0.1, T(lx - 180, ly - 40, 'morbida', { f: 'serif', size: 56, it: true, a: 'end' }) + T(lx - 180, ly + 25, 'e omogenea', { f: 'serif', size: 56, it: true, a: 'end' }));
    }
    s += E(t, W('normale') - 0.1, T(140, 250, 'ASPETTO NORMALE', { f: 'mono', size: 30, ls: 4, w: 700 }));
    return s + caption(t, W('aspetto'), 'Aspetto normale, consistenza morbida', '');
  } }) });

// 7 — cibo vero (registro chiaro)
scene('vero', { make: (W) => ({
  capAt: W('vero'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(200, 140, 1520, 700, { rot: 1 }), { dy: 0 });
    g += E(t, 0.0, T(960, 240, 'MENO RISCHIO DI SOFFOCAMENTO', { f: 'mono', size: 32, fill: C.ink, a: 'middle', ls: 4, w: 700 }));
    // destra: piatto stampato 3D
    const px = 1260, py = 560;
    g += E(t, 0.15, cake(px, py + 50, C.ink, C.cream, C.coral) +
      T(px, py + 170, 'stampato in 3D', { f: 'popm', size: 38, fill: C.ink, a: 'middle' }));
    ['vero', 'nutriente', 'invitante'].forEach((w, i) => g += E(t, W(w) - 0.1, T([1010, 1240, 1490][i], 320, w, { f: 'serif', size: 52, it: true, fill: C.ink, a: 'middle' })));
    // sinistra: il solito omogeneizzato
    const bx = 560, by = 600;
    g += E(t, W('omogeneizzato') - 0.2, `<path d="M${bx - 190},${by - 80} C${bx - 190},${by + 90} ${bx + 190},${by + 90} ${bx + 190},${by - 80} z" fill="${C.cream}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>` +
      `<ellipse cx="${bx}" cy="${by - 80}" rx="190" ry="30" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>` +
      `<ellipse cx="${bx}" cy="${by - 70}" rx="160" ry="20" fill="${mix(C.cream, C.ink, 0.22)}" stroke="${C.ink}" stroke-width="2"/>` +
      `<rect x="${bx - 70}" y="${by + 44}" width="140" height="16" rx="6" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>` +
      T(bx, by + 130, 'non il solito omogeneizzato', { f: 'popm', size: 38, fill: C.ink, a: 'middle' }));
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('vero'), 'Cibo vero e invitante', '', true);
  } }) });

// 8 — alta gastronomia: forme geometriche
function trussLayers(cx, n) { // traliccio aperto a iperboloide: aste elicoidali incrociate
  const out = [];
  for (let k = 0; k < n; k++) {
    const hw = 250 - 95 * Math.sin(Math.PI * k / (n - 1));
    if (k === 0 || k === n - 1) { out.push([[cx - hw, cx + hw]]); continue; }
    let xs = [];
    for (let j = 0; j < 8; j++) [1, -1].forEach(sg => { const th = j * Math.PI / 4 + sg * k * 0.27; xs.push(cx + hw * Math.sin(th)); });
    xs.sort((a, b) => a - b); const segs = [];
    xs.forEach(x => { const a = x - 11, b = x + 11; if (segs.length && a <= segs[segs.length - 1][1] + 4) segs[segs.length - 1][1] = Math.max(b, segs[segs.length - 1][1]); else segs.push([a, b]); });
    out.push(segs);
  }
  return out;
}
const LATJOB = makeJob(trussLayers(1180, 12), 1300);
scene('chef', { make: (W) => ({
  capAt: W('forme'),
  render(t) {
    const P = printScene(t, LATJOB, 0.3, 1180, 760, { fill: mix(C.bg, C.coral, 0.28), stroke: C.coral });
    let s = E(t, -0.4, P.s, { dy: 0 });
    s += E(t, W('ristoranti') - 0.1, pillTag(110, 300, 'ristoranti stellati', C.line, C.bg));
    s += E(t, W('geometriche') - 0.1, T(114, 440, 'forme', { f: 'pop', size: 84 }) + T(114, 530, 'geometriche', { f: 'pop', size: 84 }));
    s += E(t, W('impossibili') - 0.1, T(116, 620, 'impossibili a mano', { f: 'serif', size: 56, it: true }));
    return s + caption(t, W('forme'), 'Forme impossibili a mano', '');
  } }) });

// 9 — in futuro (registro chiaro)
scene('futuro', { make: (W) => ({
  capAt: W('profilo'),
  render(t, D) {
    let s = lightBg(); const k = 1 + 0.02 * t / D;
    let g = E(t, -0.4, card(160, 150, 1600, 680, { rot: -1 }), { dy: 0 });
    g += E(t, 0.0, pillTag(240, 260, 'IN FUTURO · IPOTESI', C.ink, C.cream));
    // profilo nutrizionale (scheda)
    const ax = 260, ay = 360;
    g += E(t, W('profilo') - 0.2, `<rect x="${ax}" y="${ay}" width="360" height="300" rx="16" fill="${C.cream}" stroke="${C.coral}" stroke-width="5"/>` +
      `<circle cx="${ax + 70}" cy="${ay + 70}" r="34" fill="none" stroke="${C.ink}" stroke-width="4"/>` +
      [0, 1, 2, 3].map(i => `<rect x="${ax + 40}" y="${ay + 140 + i * 34}" width="${[230, 150, 260, 190][i] * eo((t - W('nutrizionale') - i * 0.12) / 0.5)}" height="16" rx="8" fill="${C.ink}" opacity="0.7"/>`).join('') +
      T(ax + 180, ay + 360, 'profilo nutrizionale', { f: 'popm', size: 36, fill: C.ink, a: 'middle' }) +
      T(ax + 340, ay + 80, 'esempio', { f: 'mono', size: 24, fill: C.ink, a: 'end', ls: 2 }));
    g += E(t, W('ricevere') - 0.2, arrow(660, 510, 780, 510, C.ink, 5));
    // stampante di casa
    g += E(t, 0.3, `<rect x="820" y="360" width="300" height="300" rx="20" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/>` +
      `<rect x="860" y="400" width="220" height="40" rx="8" fill="none" stroke="${C.ink}" stroke-width="3"/>` +
      `<path d="M950,440 L990,440 L978,500 L962,500 z" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>` +
      `<rect x="870" y="600" width="200" height="16" rx="5" fill="${C.ink}"/>` +
      T(970, 720, 'stampante di casa', { f: 'popm', size: 36, fill: C.ink, a: 'middle' }));
    g += E(t, W('preparare') - 0.2, arrow(1160, 510, 1280, 510, C.ink, 5));
    g += E(t, W('pasti') - 0.2, `<ellipse cx="1480" cy="560" rx="170" ry="40" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>` +
      `<path d="M1390,550 Q1480,420 1570,550 z" fill="${mix(C.cream, C.ink, 0.15)}" stroke="${C.ink}" stroke-width="4"/>` +
      T(1480, 690, 'nutrienti esatti', { f: 'popm', size: 36, fill: C.ink, a: 'middle' }));
    s += `<g transform="translate(960,490) scale(${k}) translate(-960,-490)">${g}</g>`;
    return s + caption(t, W('profilo'), 'Il tuo profilo nutrizionale', '', true);
  } }) });

// 10 — oggi: funziona ma...
scene('oggi', { make: (W) => ({
  capAt: W('costa'),
  render(t) {
    let s = '';
    if (t < W('costa') - 0.2) {
      const dj = makeJob(domeLayers(960, 9, 220), 1e6), st = jobState(dj, 1e9);
      s += E(t, -0.4, `<g transform="translate(960,800) scale(0.7) translate(-960,-800)">${printer(960, 760) + printed(dj, st, 760) + head(960 - 220, 760 - 9 * LH - 120, 960)}</g>`, { dy: 0 });
      s += E(t, W('funziona') - 0.1, `<circle cx="1460" cy="520" r="74" fill="${C.bg}" stroke="${C.line}" stroke-width="6"/><path d="M1422,522 L1450,552 L1502,494" fill="none" stroke="${C.line}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`);
    }
    s += E(t, W('funziona') - 0.1, pillTag(110, 230, 'FUNZIONA', C.line, C.bg));
    s += E(t, W('case') - 0.1, pillTag(380, 230, 'NELLE CASE: NON DIFFUSA', C.line, C.bg));
    const panel = (x, title, inner) => `<rect x="${x}" y="320" width="500" height="430" rx="20" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` + lbl(x + 250, 390, title) + inner;
    // costo: cartellino del prezzo
    s += E(t, W('costa') - 0.2, panel(150, 'COSTO', `<path d="M300,470 L520,470 L590,560 L520,650 L300,650 z" fill="${mix(C.bg, C.line, 0.1)}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/><circle cx="530" cy="560" r="14" fill="none" stroke="${C.line}" stroke-width="4"/>` + T(410, 582, 'ALTO', { f: 'pop', size: 60, a: 'middle' })));
    // velocità: indicatore con lancetta bassa (accento)
    const gx = 960, gy = 640, R = 150;
    const needle = Math.PI * (1 - 0.18 * eo((t - W('lenta')) / 0.8)) - 0.03 * Math.sin(t * 3);
    s += E(t, W('lenta') - 0.2, panel(710, 'VELOCITÀ', `<path d="M${gx - R},${gy} A${R},${R} 0 0 1 ${gx + R},${gy}" fill="none" stroke="${C.line}" stroke-width="6"/>` +
      [0, 1, 2, 3, 4].map(i => { const a = Math.PI * (1 - i / 4); return `<line x1="${gx + Math.cos(a) * (R - 22)}" y1="${gy - Math.sin(a) * (R - 22)}" x2="${gx + Math.cos(a) * R}" y2="${gy - Math.sin(a) * R}" stroke="${C.line}" stroke-width="4"/>`; }).join('') +
      `<line x1="${gx}" y1="${gy}" x2="${gx + Math.cos(needle) * (R - 30)}" y2="${gy - Math.sin(needle) * (R - 30)}" stroke="${C.coral}" stroke-width="8" stroke-linecap="round"/><circle cx="${gx}" cy="${gy}" r="14" fill="${C.coral}"/>` +
      T(gx, gy + 70, 'LENTA', { f: 'pop', size: 50, a: 'middle' })));
    // materie prime: poche
    s += E(t, W('materie') - 0.2, panel(1270, 'MATERIE PRIME', [0, 1].map(i => `<rect x="${1400 + i * 120}" y="470" width="80" height="170" rx="12" fill="${mix(C.bg, C.line, 0.18)}" stroke="${C.line}" stroke-width="4"/>`).join('') +
      T(1520, 710, 'LIMITATE', { f: 'pop', size: 50, a: 'middle' })));
    return s + caption(t, W('costa'), 'Costosa, lenta, materie limitate', '');
  } }) });

// 11 — tecnologia di nicchia
scene('nicchia', { make: (W) => ({
  capAt: W('tecnologia'),
  render(t) {
    let s = '';
    // parete con una nicchia ad arco; dentro, una piccola stampante
    const nx = 560, ny = 740;
    s += E(t, -0.4, `<rect x="200" y="230" width="720" height="560" fill="${mix(C.bg, C.line, 0.06)}" stroke="${C.line}" stroke-width="4"/>` +
      Array.from({ length: 9 }, (_, i) => `<line x1="200" y1="${290 + i * 60}" x2="920" y2="${290 + i * 60}" stroke="${C.line}" stroke-width="2" opacity="0.35"/>`).join('') +
      `<path d="M${nx - 150},${ny} L${nx - 150},${ny - 240} A150,150 0 0 1 ${nx + 150},${ny - 240} L${nx + 150},${ny} z" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`, { dy: 0 });
    s += E(t, W('nicchia') - 0.3, `<g transform="translate(${nx},${ny - 20}) scale(0.3) translate(${-1200},${-760})">${printer(1200, 760, { ink: C.coral, h: 560 })}${head(1200, 700, 1200, { ink: C.coral })}</g>`);
    s += E(t, W('nicchia') - 0.1, lbl(nx, 840, 'DI NICCHIA', { fill: C.line }));
    s += E(t, W('rivoluzione') - 0.1, T(1060, 470, 'rivoluzione', { f: 'pop', size: 84 }) + T(1060, 560, 'di massa', { f: 'pop', size: 84 }));
    s += E(t, W('ora') - 0.1, T(1064, 360, 'per ora, non una', { f: 'serif', size: 54, it: true }));
    return s + caption(t, W('tecnologia'), 'Tecnologia di nicchia', '');
  } }) });

// 12 — chiusura
scene('finale', { L: 0.5, tail: 3.8, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    // piccolo pezzo stampato a strati
    let st = ''; for (let k = 0; k < 6; k++) { const hw = 120 * Math.sqrt(1 - Math.pow((k + 0.5) / 6.4, 2.4)); st += E(t, -0.4 + k * 0.08, `<rect x="${960 - hw}" y="${270 - k * 22}" width="${2 * hw}" height="20" rx="10" fill="${mix(C.cream, C.ink, 0.15)}" stroke="${C.ink}" stroke-width="3"/>`, { dy: 8 }); }
    s += st + `<rect x="800" y="292" width="320" height="12" rx="4" fill="${C.ink}"/>`;
    s += E(t, -0.4, T(960, 450, 'La stampa 3D alimentare', { f: 'pop', size: 104, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('strato') - 0.1, 960, 570, 'strato dopo strato, il cibo prende forma', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: 'forma' });
    s += E(t, W('forma') + 0.3, `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC ALI-2-06', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5 }));
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
