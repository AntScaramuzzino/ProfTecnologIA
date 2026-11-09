// Metodo di Monge — MC-DIS-2-01 §"Il metodo europeo di Monge: le tre viste fondamentali". render(t) puro.
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
const RAD = Math.PI / 180;
const pts2 = P => P.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
const seg = (p, q, st, sw = 4, o = '') => `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${st}" stroke-width="${sw}" stroke-linecap="round" ${o}/>`;
const DASH = 'stroke-dasharray="14 10" stroke-linecap="butt"';

// ===== geometria 3D esatta =====
// Mondo: X verso destra, Y dal piano verticale verso l'osservatore, Z in alto.
// PV: y=0 · PO: z=0 · PL: x=XL (a destra: l'oggetto è visto da SINISTRA e proiettato sul piano alla sua destra — primo diedro).
// Oggetto: blocco a L, profilo frontale nel piano XZ, estruso in Y. Distacco 1 dai piani.
const PROF = [[0, 1], [4, 1], [4, 2.4], [1.6, 2.4], [1.6, 4], [0, 4]]; // (x,z), antiorario
const Y0 = 1.5, Y1 = 4.1, XL = 5, XA = -1.2, YB = 4.8, ZT = 5.2, YM = (Y0 + Y1) / 2;
const ZSTEP = 2.4, XSTEP = 1.6;
// facce dell'oggetto con normale uscente
const FACES = (() => {
  const F = [];
  F.push({ P: PROF.map(([x, z]) => [x, Y1, z]), n: [0, 1, 0] });
  F.push({ P: PROF.slice().reverse().map(([x, z]) => [x, Y0, z]), n: [0, -1, 0] });
  for (let i = 0; i < PROF.length; i++) {
    const a = PROF[i], b = PROF[(i + 1) % PROF.length], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz);
    F.push({ P: [[a[0], Y0, a[1]], [b[0], Y0, b[1]], [b[0], Y1, b[1]], [a[0], Y1, a[1]]], n: [dz / l, 0, -dx / l] });
  }
  return F;
})();
// camera ortografica: azimut th (gradi, osservatore verso sinistra-davanti), elevazione ph
function camera(th, ph, s, ox, oy) {
  const ct = Math.cos(th * RAD), st = Math.sin(th * RAD), cp = Math.cos(ph * RAD), sp = Math.sin(ph * RAD);
  const f = ([X, Y, Z]) => { const xp = X * ct + Y * st, yp = -X * st + Y * ct; return [ox + s * xp, oy - s * (Z * cp - yp * sp)]; };
  f.depth = ([X, Y, Z]) => (-X * st + Y * ct) * cp + Z * sp;
  f.dir = [-st * cp, ct * cp, sp];
  return f;
}
// adatta un insieme di punti a un riquadro [x0,y0,x1,y1]
function fit(th, ph, P, box) {
  const c = camera(th, ph, 1, 0, 0), Q = P.map(c);
  const minx = Math.min(...Q.map(q => q[0])), maxx = Math.max(...Q.map(q => q[0])), miny = Math.min(...Q.map(q => q[1])), maxy = Math.max(...Q.map(q => q[1]));
  const s = Math.min((box[2] - box[0]) / (maxx - minx), (box[3] - box[1]) / (maxy - miny));
  return { th, ph, s, ox: (box[0] + box[2]) / 2 - s * (minx + maxx) / 2, oy: (box[1] + box[3]) / 2 - s * (miny + maxy) / 2 };
}
const camOf = k => camera(k.th, k.ph, k.s, k.ox, k.oy);
const lerpK = (a, b, p) => ({ th: lerp(a.th, b.th, p), ph: lerp(a.ph, b.ph, p), s: lerp(a.s, b.s, p), ox: lerp(a.ox, b.ox, p), oy: lerp(a.oy, b.oy, p) });
// piani (prima del ribaltamento)
const PV = [[XA, 0, 0], [XL, 0, 0], [XL, 0, ZT], [XA, 0, ZT]];
const PO = [[XA, 0, 0], [XL, 0, 0], [XL, YB, 0], [XA, YB, 0]];
const PL = [[XL, 0, 0], [XL, YB, 0], [XL, YB, ZT], [XL, 0, ZT]];
// ribaltamento: PO ruota verso il basso attorno alla LT (y=0,z=0); PL ruota verso destra attorno a x=XL,y=0
const rPO = (p, a) => [p[0], p[1] * Math.cos(a * RAD), p[2] - p[1] * Math.sin(a * RAD)];
const rPL = (p, a) => [XL + p[1] * Math.sin(a * RAD), p[1] * Math.cos(a * RAD), p[2]];
// proiezioni (sui piani, coordinate 3D)
const VF = PROF.map(([x, z]) => [x, 0, z]); // prospetto su PV
const VP = { box: [[0, Y0, 0], [4, Y0, 0], [4, Y1, 0], [0, Y1, 0]], line: [[XSTEP, Y0, 0], [XSTEP, Y1, 0]] }; // pianta su PO (spigolo x=1,6 visibile dall'alto)
const VL = { box: [[XL, Y0, 1], [XL, Y1, 1], [XL, Y1, 4], [XL, Y0, 4]], hid: [[XL, Y0, ZSTEP], [XL, Y1, ZSTEP]] }; // fianco su PL (gradino nascosto: tratteggio)

const K_OBL = fit(34, 24, [...PV, ...PO, ...PL], [700, 150, 1800, 850]);
const K_FLAT = fit(0, 0, [[XA, 0, ZT], [XL + YB, 0, ZT], [XA, 0, -YB], [XL + YB, 0, -YB]], [640, 140, 1680, 850]);

// disegno dell'oggetto con facce opache ordinate in profondità (back-face culling)
function drawObj(c, o = {}) {
  const st = o.st || C.line, fill = o.fill || mix(C.bg, C.line, 0.1), sw = o.sw || 4, fo = o.fo ?? 1;
  const vis = FACES.filter(f => f.n[0] * c.dir[0] + f.n[1] * c.dir[1] + f.n[2] * c.dir[2] > 1e-6)
    .map(f => ({ f, d: f.P.reduce((a, p) => a + c.depth(p), 0) / f.P.length })).sort((a, b) => a.d - b.d);
  return vis.map(({ f }) => `<polygon points="${pts2(f.P.map(c))}" fill="${fill}" fill-opacity="${fo}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`).join('');
}
const planeG = (c, P, op = 1, st = C.lineDim) => `<polygon points="${pts2(P.map(c))}" fill="${C.line}" fill-opacity="${(0.07 * op).toFixed(3)}" stroke="${st}" stroke-width="2.5" stroke-opacity="${op.toFixed(3)}" stroke-linejoin="round"/>`;
const poly3 = (c, P, st, sw, closed = true, extra = '') => `<${closed ? 'polygon' : 'polyline'} points="${pts2(P.map(c))}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>`;
const lab3 = (c, p, s, o = {}) => { const q = c(p); return lbl(q[0] + (o.dx || 0), q[1] + (o.dy || 0), s, { size: o.size || 30, fill: o.fill || C.line, a: o.a || 'middle' }); };
// viste sui piani (con ribaltamento a) e colori
function viewF(c, st, sw = 4) { return poly3(c, VF, st, sw); }
function viewP(c, a, st, sw = 4) { const m = p => rPO(p, a); return poly3(c, VP.box.map(m), st, sw) + seg(c(m(VP.line[0])), c(m(VP.line[1])), st, sw * 0.8); }
function viewL(c, a, st, sw = 4) { const m = p => rPL(p, a); return poly3(c, VL.box.map(m), st, sw) + seg(c(m(VL.hid[0])), c(m(VL.hid[1])), st, sw * 0.7, DASH); }
// raggi di proiezione (tratteggiati, sotto l'oggetto)
const rayAt = (c, p, q, op = 1) => seg(c(p), c(q), C.line, 2, `stroke-dasharray="6 9" opacity="${(0.8 * op).toFixed(3)}"`);
const RAYS_V = PROF.map(([x, z]) => [[x, Y1, z], [x, 0, z]]);
const RAYS_P = [[0, Y0, 4], [0, Y1, 4], [XSTEP, Y1, 4], [4, Y1, ZSTEP], [4, Y0, ZSTEP]].map(p => [p, [p[0], p[1], 0]]);
const RAYS_L = [[4, Y0, 1], [4, Y1, 1], [XSTEP, Y0, 4], [XSTEP, Y1, 4], [4, Y0, ZSTEP]].map(p => [p, [XL, p[1], p[2]]]);
// pannello di testo a sinistra (scene scure del triedro)
function panel(t, tk, t1, t2, t3) {
  let s = '';
  if (tk[0] != null) s += E(t, tk[0], lbl(96, 360, t1, { a: 'start', size: 30 }));
  if (tk[1] != null) s += E(t, tk[1], T(96, 470, t2, { f: 'pop', size: 84 }));
  if (tk[2] != null) s += E(t, tk[2], IT(100, 550, t3, { size: 50 }));
  return s;
}
// la scena "triedro": piani che entrano uno alla volta
function triedroBase(t, c, o = {}) {
  const tp = o.tp || [-1, -1, -1], op = o.op ?? 1;
  let s = '';
  s += E(t, tp[0], planeG(c, PV, op), { dy: 0, blur: 4 });
  s += E(t, tp[1], planeG(c, PO, op), { dy: 0, blur: 4 });
  s += E(t, tp[2], planeG(c, PL, op), { dy: 0, blur: 4 });
  if (o.labels !== false) {
    s += E(t, tp[0], lab3(c, [XA + 0.55, 0, ZT - 0.5], 'PV'), { dy: 0 });
    s += E(t, tp[1], lab3(c, [XA + 0.6, YB - 0.45, 0], 'PO', { dy: 10 }), { dy: 0 });
    s += E(t, tp[2], lab3(c, [XL, 0.55, ZT - 0.5], 'PL'), { dy: 0 });
  }
  return s;
}

// 1 — aggancio: blocco a L che ruota piano
scene('hook', { make: (W) => ({
  capAt: W('metodo'),
  render(t) {
    const th = 22 + 8 * t, ph = 24;
    const k = fit(th, ph, FACES.flatMap(f => f.P), [1080, 220, 1720, 780]);
    let s = E(t, -0.3, drawObj(camOf(k), { sw: 5 }), { dy: 0 });
    s += words(t, W('proiezione'), 96, 400, 'Proiezione', { f: 'pop', size: 104 });
    s += words(t, W('ortogonale'), 96, 520, 'ortogonale', { f: 'pop', size: 104 });
    s += E(t, W('europa'), IT(100, 630, 'la più usata in Europa e in Italia', { size: 54 }));
    return s + caption(t, W('metodo'), 'Il metodo di Monge', 'Monge');
  } }) });

// 2 — Gaspard Monge, 1795 (chiaro)
scene('monge', { make: (W) => ({
  capAt: W('1795'), hold: W('europeo'),
  render(t) {
    const I = C.ink;
    let s = lightBg();
    s += E(t, -0.4, card(200, 150, 1520, 680, { rot: -0.5 }), { dy: 0 });
    s += E(t, 0.35, pillTag(300, 290, 'MATEMATICO FRANCESE', I, C.cream));
    s += E(t, W('gaspard'), T(300, 430, 'Gaspard Monge', { f: 'pop', size: 104, fill: I }));
    s += E(t, W('sistematizzò'), IT(306, 520, 'sistematizzò il metodo nel', { fill: I, size: 54 }));
    s += E(t, W('1795'), T(300, 680, '1795', { f: 'pop', size: 130, fill: C.coralT }));
    s += E(t, W('anche') - 0.1, lbl(960, 590, 'DETTO ANCHE', { a: 'start', size: 28, fill: I }));
    s += E(t, W('primo'), T(960, 665, 'primo diedro', { f: 'pop', size: 56, fill: I }));
    s += E(t, W('europeo'), T(960, 740, 'metodo europeo', { f: 'pop', size: 56, fill: I }));
    s += E(t, W('anche'), `<line x1="910" y1="560" x2="910" y2="760" stroke="${I}" stroke-width="3"/>`, { dy: 0 });
    return s + caption(t, W('1795'), 'Gaspard Monge, 1795', '', true);
  } }) });

// 3 — raggi paralleli e perpendicolari al piano (schema di lato)
scene('raggi', { make: (W) => {
  const u = 110, ox = 760, oz = 860; // profilo L in pixel
  const P = ([x, z]) => [ox + x * u, oz - z * u];
  const plX = 1560, rz = [1, 1.5, 2, 2.4, 3, 3.5, 4];
  return {
    capAt: W('parallele'), hold: W('distanza'),
    render(t) {
      let s = '';
      // piano visto di taglio
      s += E(t, -0.3, seg([plX, 160], [plX, 820], C.line, 6) + lbl(plX, 140 - 6, 'PIANO', { size: 28 }), { dy: 0 });
      // raggi paralleli che arrivano da sinistra
      rz.forEach((z, i) => {
        const y = oz - z * u, p = eio((t - W('linee') - i * 0.08) / 0.9);
        if (p > 0) s += arrow(-40, y, lerp(-40, plX - 4, p), y, C.line, 2.5);
      });
      // oggetto sopra i raggi
      s += E(t, -0.3, `<polygon points="${pts2(PROF.map(P))}" fill="${mix(C.bg, C.line, 0.1)}" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>`, { dy: 0 });
      // immagine sul piano
      s += E(t, W('piano'), seg([plX, oz - u], [plX, oz - 4 * u], C.coral, 12), { dy: 0, blur: 4 });
      // angolo retto
      const y = oz - 4 * u;
      s += E(t, W('perpendicolari'), `<polyline points="${plX - 44},${y} ${plX - 44},${y - 44} ${plX},${y - 44}" fill="none" stroke="${C.line}" stroke-width="3"/>` + lbl(plX - 80, y - 66, '90°', { size: 30 }), { dy: 0 });
      s += E(t, W('parallele'), lbl(96, 200, 'RAGGI PARALLELI', { a: 'start', size: 30 }));
      s += E(t, W('distanza'), T(96, 330, '∞', { f: 'pop', size: 120 }) + lbl(260, 318, 'DISTANZA INFINITA', { size: 26, a: 'start' }));
      return s + caption(t, W('parallele'), 'Parallele e perpendicolari', '');
    } };
} });

// 4 — il triedro: tre piani perpendicolari
scene('triedro', { make: (W) => ({
  capAt: W('tre'), hold: W('triedro'),
  render(t) {
    const c = camOf(K_OBL);
    const tp = [W('tre'), W('tre') + 0.35, W('tre') + 0.7];
    let s = triedroBase(t, c, { tp });
    s += E(t, -0.3, drawObj(c), { dy: 0 });
    s += panel(t, [W('tre'), W('triedro'), W('perpendicolari')], 'TRE PIANI', 'Triedro', 'perpendicolari tra loro');
    return s + caption(t, W('tre'), 'Tre piani: il triedro', 'triedro');
  } }) });

// 5–7 — le tre proiezioni
function projScene(id, which) {
  scene(id, { make: (W) => {
    const tk = W('proietta'), tv = W(which === 'F' ? 'prospetto' : which === 'P' ? 'pianta' : 'fianco');
    const txt = { F: ['PIANO VERTICALE · PV', 'Prospetto', 'vista frontale', 'frontale'], P: ['PIANO ORIZZONTALE · PO', 'Pianta', "vista dall'alto", "dall'alto"], L: ['PIANO LATERALE · PL', 'Fianco', 'visto da sinistra', 'sinistra'] }[which];
    return {
      capAt: W('piano'), hold: tv,
      render(t) {
        const c = camOf(K_OBL), done = { F: [], P: ['F'], L: ['F', 'P'] }[which];
        let s = triedroBase(t, c);
        const dim = mix(C.bg, C.line, 0.55);
        if (done.includes('F')) s += viewF(c, dim, 3);
        if (done.includes('P')) s += viewP(c, 0, dim, 3);
        const R = which === 'F' ? RAYS_V : which === 'P' ? RAYS_P : RAYS_L;
        R.forEach(([p, q], i) => { const pp = eio((t - tk - i * 0.07) / 0.6); if (pp > 0) s += rayAt(c, p, [lerp(p[0], q[0], pp), lerp(p[1], q[1], pp), lerp(p[2], q[2], pp)]); });
        const v = which === 'F' ? viewF(c, C.coral, 6) : which === 'P' ? viewP(c, 0, C.coral, 6) : viewL(c, 0, C.coral, 6);
        s += E(t, tv, v, { dy: 0, blur: 6 });
        s += which === 'F' ? drawObj(c, { fo: lerp(1, 0.25, eio((t - tv + 0.2) / 0.5)) }) : drawObj(c);
        if (which === 'L') s += E(t, W('visto'), arrow(c([-2.6, YM, 2.5])[0] - 60, c([-2.6, YM, 2.5])[1], c([-0.3, YM, 2.5])[0], c([-0.3, YM, 2.5])[1], C.line, 4), { dy: 0 });
        s += panel(t, [W('piano'), tv, which === 'L' ? W('visto') : null], txt[0], txt[1], txt[2]);
        return s + caption(t, W('piano'), SC.find(x => x.id === id).didascalia, '');
      } };
  } });
}
projScene('pv', 'F'); projScene('po', 'P'); projScene('pl', 'L');

// 8 — linee di terra
const LT3 = [[[XA, 0, 0], [XL, 0, 0]], [[XL, 0, 0], [XL, 0, ZT]], [[XL, 0, 0], [XL, YB, 0]]];
scene('lt', { make: (W) => ({
  capAt: W('linee'), hold: W('restano'),
  render(t) {
    const c = camOf(K_OBL), dim = mix(C.bg, C.line, 0.55);
    let s = triedroBase(t, c) + viewF(c, dim, 3) + viewP(c, 0, dim, 3) + viewL(c, 0, dim, 3);
    LT3.forEach(([p, q], i) => { const pp = eio((t - W('intersecano') - i * 0.25) / 0.7); if (pp > 0) s += seg(c(p), c([lerp(p[0], q[0], pp), lerp(p[1], q[1], pp), lerp(p[2], q[2], pp)]), C.coral, 7); });
    s += drawObj(c);
    s += panel(t, [W('intersecano'), W('linee'), W('restano')], 'INTERSEZIONI', 'LT', 'restano sul foglio');
    return s + caption(t, W('linee'), 'Le linee di terra', '');
  } }) });

// 9 — la scatola si apre: ribaltamento esatto dei piani e camera che diventa frontale
scene('apri', { make: (W) => {
  const ta = W('apri'), DA = 2.6;
  const BOX = [[XA, 0, 0], [XL, 0, 0], [XL, YB, 0], [XA, YB, 0], [XA, 0, ZT], [XL, 0, ZT], [XL, YB, ZT], [XA, YB, ZT]];
  const BE = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  return {
    capAt: W('apri'), hold: ta + DA,
    render(t) {
      const p = eio((t - ta) / DA), a = 90 * eio((t - ta - 0.2) / (DA - 0.4));
      const c = camOf(lerpK(K_OBL, K_FLAT, p));
      const fade = 1 - clamp((t - ta) / 0.6);
      let s = '';
      s += planeG(c, PV) + planeG(c, PO.map(q => rPO(q, a))) + planeG(c, PL.map(q => rPL(q, a)));
      // linee di terra sul foglio (dopo l'apertura la LT tra PO e PL si sdoppia)
      s += seg(c([XA, 0, 0]), c([XL, 0, 0]), C.line, 3) + seg(c([XL, 0, 0]), c([XL, 0, ZT]), C.line, 3);
      s += seg(c(rPO([XL, 0, 0], a)), c(rPO([XL, YB, 0], a)), C.line, 3) + seg(c(rPL([XL, 0, 0], a)), c(rPL([XL, YB, 0], a)), C.line, 3);
      s += viewF(c, C.line, 4) + viewP(c, a, C.line, 4) + viewL(c, a, C.line, 4);
      if (fade > 0) s += `<g opacity="${fade.toFixed(3)}">${drawObj(c)}</g>`;
      // scatola trasparente: sei pareti
      const bo = clamp((t - W('scatola') + 0.1) / 0.5) * fade;
      if (bo > 0) {
        s += `<g opacity="${bo.toFixed(3)}">` + BE.map(([i, j]) => seg(c(BOX[i]), c(BOX[j]), C.line, 2.5, 'stroke-dasharray="10 10"')).join('');
        if (t > W('pareti') - 0.05) {
          const k = Math.min(5, Math.floor((t - W('pareti')) / 0.16)), FC = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]];
          for (let i = 0; i <= k; i++) s += `<polygon points="${pts2(FC[i].map(j => c(BOX[j])))}" fill="${C.line}" fill-opacity="0.05"/>`;
        }
        // le altre tre viste (pareti opposte), in grigio: da destra, da dietro, dal basso
        const go = clamp((t - W('sei', 1)) / 0.4);
        if (go > 0) {
          const gc = mix(C.bg, C.line, 0.5);
          s += `<g opacity="${go.toFixed(3)}">` +
            poly3(c, [[XA, Y0, 1], [XA, Y1, 1], [XA, Y1, 4], [XA, Y0, 4]], gc, 3) + seg(c([XA, Y0, ZSTEP]), c([XA, Y1, ZSTEP]), gc, 2.5) +
            poly3(c, PROF.map(([x, z]) => [x, YB, z]), gc, 3) +
            poly3(c, [[0, Y0, ZT], [4, Y0, ZT], [4, Y1, ZT], [0, Y1, ZT]], gc, 3) + seg(c([XSTEP, Y0, ZT]), c([XSTEP, Y1, ZT]), gc, 2.5, DASH) + '</g>';
        }
        s += '</g>';
      }
      s += E(t, W('sei'), lbl(96, 360, '6 PARETI', { a: 'start', size: 30 }) + lbl(96, 420, '6 VISTE POSSIBILI', { a: 'start', size: 30 }), { dy: 0 });
      const lo = clamp((t - ta - DA) / 0.4);
      if (lo > 0) s += `<g opacity="${lo.toFixed(3)}">` + lab3(c, [XL + 0.35, 0, 0.32], 'LT', { size: 28, a: 'start' }) + '</g>';
      return s + caption(t, W('apri'), 'Apri la scatola', 'scatola');
    } };
} });

// 10 — il foglio: tre viste allineate (chiaro)
scene('foglio', { make: (W) => {
  const k = fit(0, 0, [[XA, 0, ZT], [XL + YB, 0, ZT], [XA, 0, -YB], [XL + YB, 0, -YB]], [300, 230, 940, 790]), c = camOf(k);
  return {
    capAt: W('tre'), hold: W('stessa'),
    render(t) {
      const I = C.ink;
      let s = lightBg() + E(t, -0.4, card(200, 150, 1520, 700, { rot: -0.4 }), { dy: 0 });
      const tF = W('prospetto'), tP = W('pianta'), tL = W('fianco');
      const col = (t0, t1) => (t >= t0 && (t1 == null || t < t1)) ? C.coralT : I;
      // LT
      s += seg(c([XA, 0, 0]), c([XL + YB, 0, 0]), I, 2.5) + seg(c([XL, 0, -YB]), c([XL, 0, ZT]), I, 2.5);
      s += lbl(c([XL + YB, 0, 0])[0] - 8, c([XL + YB, 0, 0])[1] - 14, 'LT', { size: 26, fill: I, a: 'end' });
      // allineamenti
      const g = 'stroke-dasharray="4 9" opacity="0.75"';
      s += E(t, W('allineata'), [0, XSTEP, 4].map(x => seg(c([x, 0, 1]), c([x, 0, -Y0]), I, 2, g)).join(''), { dy: 0, blur: 3 });
      // retta a 45° nel quadrante libero: trasferisce la profondità dalla pianta al fianco
      s += E(t, W('destra'), seg(c([XL, 0, 0]), c([XL + YB, 0, -YB]), I, 2) + lbl(c([XL + 2.75, 0, -2.6])[0], c([XL + 2.75, 0, -2.6])[1], '45°', { size: 24, fill: I, a: 'start' }) +
        [Y0, Y1].map(y => seg(c([4, 0, -y]), c([XL + y, 0, -y]), I, 2, g) + seg(c([XL + y, 0, -y]), c([XL + y, 0, 1]), I, 2, g)).join(''), { dy: 0, blur: 3 });
      s += E(t, W('stessa'), [1, ZSTEP, 4].map(z => seg(c([4, 0, z]), c([XL + Y0, 0, z]), I, 2, g)).join(''), { dy: 0, blur: 3 });
      const flat = camOf(k);
      s += E(t, -0.3, viewF(flat, col(tF, tP), 5), { dy: 0 });
      s += E(t, -0.3, viewP(flat, 90, col(tP, tL), 5), { dy: 0 });
      s += E(t, -0.3, viewL(flat, 90, col(tL, null), 5), { dy: 0 });
      // etichette viste
      s += lbl(c([2, 0, 4])[0], c([2, 0, 4])[1] - 22, 'PROSPETTO', { size: 26, fill: I });
      s += lbl(c([XL + 2.3, 0, 4])[0], c([XL + 2.3, 0, 4])[1] - 22, 'FIANCO', { size: 26, fill: I });
      s += lbl(c([2, 0, -Y1])[0], c([2, 0, -Y1])[1] + 44, 'PIANTA', { size: 26, fill: I });
      // testo a destra
      const x = 1080;
      s += E(t, W('tre'), pillTag(x, 280, '3 VISTE FONDAMENTALI', I, C.cream));
      s += E(t, tF, T(x, 400, 'Prospetto', { f: 'pop', size: 56, fill: I }) + IT(x + 330, 400, 'in alto a sinistra', { fill: I, size: 42 }));
      s += E(t, tP, T(x, 520, 'Pianta', { f: 'pop', size: 56, fill: I }) + IT(x + 330, 520, 'sotto', { fill: I, size: 42 }));
      s += E(t, tL, T(x, 640, 'Fianco', { f: 'pop', size: 56, fill: I }) + IT(x + 330, 640, 'a destra', { fill: I, size: 42 }));
      return s + caption(t, W('tre'), 'Tre viste allineate', '', true);
    } };
} });

// 11 — linee continue e tratteggiate
scene('linee', { make: (W) => {
  const kO = fit(34, 24, FACES.flatMap(f => f.P), [500, 300, 920, 760]), cO = camOf(kO);
  const u = 125, bx = 1180, bz = 830; // fianco ingrandito: y orizzontale (davanti a destra), z in alto
  const Pf = (y, z) => [bx + (y - Y0) * u, bz - (z - 1) * u];
  return {
    capAt: W('continua'), hold: W('tratteggiata'),
    render(t) {
      let s = '';
      s += E(t, -0.3, drawObj(cO), { dy: 0 });
      const a0 = cO([-3.4, YM, 2.6]), a1 = cO([-0.25, YM, 2.6]);
      s += E(t, -0.3, arrow(a0[0], a0[1], a1[0], a1[1], C.line, 4) + lbl(a0[0], a0[1] + 46, 'DA SINISTRA', { size: 26, a: 'start' }), { dy: 0 });
      s += E(t, -0.3, lbl(Pf(YM, 4)[0], Pf(0, 4)[1] - 30, 'FIANCO', { size: 28 }), { dy: 0 });
      s += E(t, W('visibili'), `<polygon points="${pts2([Pf(Y0, 1), Pf(Y1, 1), Pf(Y1, 4), Pf(Y0, 4)])}" fill="none" stroke="${C.line}" stroke-width="6" stroke-linejoin="round"/>`, { dy: 0, blur: 5 });
      s += E(t, W('nascosti'), seg(Pf(Y0, ZSTEP), Pf(Y1, ZSTEP), C.coral, 6, 'stroke-dasharray="24 14" stroke-linecap="butt"'), { dy: 0, blur: 5 });
      const lx = Pf(Y1, 1)[0] + 50;
      s += E(t, W('continua'), seg([lx, Pf(0, 3.3)[1]], [lx + 70, Pf(0, 3.3)[1]], C.line, 5) + lbl(lx + 100, Pf(0, 3.3)[1] + 10, 'VISIBILE', { size: 28, a: 'start' }));
      s += E(t, W('tratteggiata'), seg([lx, Pf(0, ZSTEP)[1]], [lx + 70, Pf(0, ZSTEP)[1]], C.line, 5, 'stroke-dasharray="14 9" stroke-linecap="butt"') + lbl(lx + 100, Pf(0, ZSTEP)[1] + 10, 'NASCOSTA', { size: 28, a: 'start' }));
      return s + caption(t, W('continua'), 'Continua o tratteggiata', '');
    } };
} });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.1, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 410, 'Metodo di Monge', { f: 'pop', size: 120, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('tre') - 0.1, 960, 540, 'Tre viste, senza deformazioni prospettiche.', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true });
    s += words(t, W('spigoli'), 960, 625, 'Gli spigoli paralleli ai piani si misurano direttamente sul foglio.', { f: 'serif', size: 44, fill: C.ink, a: 'middle', it: true, key: 'paralleli', keyFill: C.coralT });
    s += E(t, W('foglio'), `<line x1="760" y1="700" x2="1160" y2="700" stroke="${C.ink}" stroke-width="3"/>` + T(960, 760, 'PROFTECNOLOGIA · MC DIS-2-01', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
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
