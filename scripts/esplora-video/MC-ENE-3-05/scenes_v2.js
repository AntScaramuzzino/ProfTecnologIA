// Il motore a scoppio a 4 tempi — MC-ENE-3-05. render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.3);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  if (def.last != null) D = Math.max(D, def.last + 1.6);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
const DIM2 = mix(C.bg, C.line, 0.2), GAS = mix(C.bg, C.line, 0.13), BURNT = mix(C.bg, C.line, 0.45);
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const P = pts => 'M' + pts.map(p => p.join(',')).join(' L');
function flowLine(pts, t, c, o = {}) {
  const sw = o.sw || 6, sp = o.sp || 220, da = o.da || '18 22';
  return `<path d="${P(pts)}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${da}" stroke-dashoffset="${(-t * sp).toFixed(1)}"${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
}
function head(x, y, a, c, h = 22) { // punta di freccia in (x,y) orientata con angolo a
  return `<path d="M${x},${y} L${x - h * Math.cos(a - 0.45)},${y - h * Math.sin(a - 0.45)} L${x - h * Math.cos(a + 0.45)},${y - h * Math.sin(a + 0.45)} z" fill="${c}"/>`;
}

// ================= MOTORE IN SEZIONE (coordinate locali) =================
// testata: sotto a HU; corsa 220, spazio morto 24,4 → rapporto di compressione 10:1 (fonte: ~1/10 del volume)
const HU = 262, SK = 220, CL = SK / 9, CTDC = HU + CL, PIN = 44, RR = 110, LR = 300, YC = CTDC + PIN + RR + LR, BORE = 130;
const deg = Math.PI / 180;
function pinY(th) { return YC - (RR * Math.cos(th * deg) + Math.sqrt(LR * LR - RR * RR * Math.sin(th * deg) ** 2)); }
function crownY(al) { return pinY(al % 360) - PIN; }
const CBDC = crownY(180);
function liftI(al) { al = ((al % 720) + 720) % 720; return al < 180 ? 34 * Math.sin(al * deg) : 0; }
function liftE(al) { al = ((al % 720) + 720) % 720; return al > 540 ? 34 * Math.sin((al - 540) * deg) : 0; }
function stroke(al) { al = ((al % 720) + 720) % 720; return Math.floor(al / 180); } // 0 asp, 1 comp, 2 scoppio, 3 scarico
const SNAME = ['ASPIRAZIONE', 'COMPRESSIONE', 'SCOPPIO', 'SCARICO'];
const PORT_I = 'M-212,168 L-118,168 Q-38,168 -33,262 L-103,262 Q-108,232 -150,232 L-212,232 Z';
const PORT_E = 'M212,168 L118,168 Q38,168 33,262 L103,262 Q108,232 150,232 L212,232 Z';
const PATH_I = [[-330, 200], [-150, 200], [-92, 214], [-70, 250], [-68, 300]];
const PATH_E = [[68, 300], [70, 250], [92, 214], [150, 200], [330, 200]];
let _cid = 0;
// o: al (angolo di ciclo 0–720), t, gas ('auto'|'none'), burn (fronte di fiamma 0–1 a PMS), flash (0–1), flowI/flowE (colori), simple, pipe (lunghezza tubi)
function engine(o) {
  const al = ((o.al % 720) + 720) % 720, th = al % 360, t = o.t || 0, cid = 'g' + (_cid++);
  const cr = crownY(al), pin = cr + PIN, cpx = RR * Math.sin(th * deg), cpy = YC - RR * Math.cos(th * deg);
  const pipe = o.pipe ?? 330, st = stroke(al);
  let s = '';
  // carter
  if (!o.simple) {
    const yw = YC - Math.sqrt(165 * 165 - 156 * 156);
    s += `<path d="M-156,640 L-156,${yw} A165,165 0 1 0 156,${yw} L156,640" fill="none" stroke="${C.line}" stroke-width="4" opacity="0.55"/>`;
  }
  // senso di rotazione (orario)
  if (o.rot !== false) {
    const R = o.simple ? 150 : 205, a0 = 105 * deg, a1 = 160 * deg;
    const p0 = [R * Math.sin(a0), YC - R * Math.cos(a0)], p1 = [R * Math.sin(a1), YC - R * Math.cos(a1)];
    s += `<path d="M${p0[0]},${p0[1]} A${R},${R} 0 0 1 ${p1[0]},${p1[1]}" fill="none" stroke="${C.line}" stroke-width="4"/>` + head(p1[0] + 2 * Math.cos(a1), p1[1] + 2 * Math.sin(a1), a1 + Math.PI / 2 - 0.12, C.line, 24);
  }
  // albero motore: contrappeso, manovella, perno
  const ang = Math.atan2(cpy - YC, cpx), cw = ang + Math.PI;
  const wx = Math.cos, wy = Math.sin;
  s += `<path d="M${70 * wx(cw - 1.2)},${YC + 70 * wy(cw - 1.2)} A70,70 0 0 1 ${70 * wx(cw + 1.2)},${YC + 70 * wy(cw + 1.2)} Z" fill="${DIM2}" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>`;
  s += `<line x1="0" y1="${YC}" x2="${cpx}" y2="${cpy}" stroke="${C.line}" stroke-width="46" stroke-linecap="round"/><line x1="0" y1="${YC}" x2="${cpx}" y2="${cpy}" stroke="${DIM2}" stroke-width="38" stroke-linecap="round"/>`;
  s += `<circle cx="0" cy="${YC}" r="16" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
  // biella
  s += `<line x1="0" y1="${pin}" x2="${cpx}" y2="${cpy}" stroke="${C.line}" stroke-width="30" stroke-linecap="round"/><line x1="0" y1="${pin}" x2="${cpx}" y2="${cpy}" stroke="${C.bg}" stroke-width="22" stroke-linecap="round"/>`;
  s += `<circle cx="${cpx}" cy="${cpy}" r="24" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/><circle cx="${cpx}" cy="${cpy}" r="9" fill="${C.line}"/>`;
  // cilindro (pareti)
  s += `<rect x="-158" y="${HU}" width="28" height="${640 - HU}" fill="${C.earth}" stroke="${C.line}" stroke-width="4"/><rect x="130" y="${HU}" width="28" height="${640 - HU}" fill="${C.earth}" stroke="${C.line}" stroke-width="4"/>`;
  // gas nella camera
  if (o.gas !== 'none') {
    s += `<clipPath id="${cid}"><rect x="-128" y="${HU}" width="256" height="${Math.max(0, cr - HU)}"/></clipPath><g clip-path="url(#${cid})">`;
    const burnt = st === 2 || st === 3 || (st === 1 && false);
    const preBurn = st === 1 || st === 0 || (o.burn != null && o.burn < 1 && th < 1);
    let fill = GAS, fop = 1;
    if (st === 2 || (o.burn != null && o.burn > 0)) fill = mix(C.bg, C.line, 0.13);
    s += `<rect x="-130" y="${HU}" width="260" height="${cr - HU + 2}" fill="${fill}"/>`;
    // particelle
    const N = 46, temp = st === 1 ? (al - 180) / 180 : st === 2 ? 1 - (al - 360) / 180 * 0.6 : st === 3 ? 0.35 : 0;
    for (let i = 0; i < N; i++) {
      const u = hsh(i + 1), v = hsh(i + 77) * 2 - 1;
      let y;
      if (st === 0) y = HU + u * (CBDC - HU);
      else if (st === 3) y = cr - u * (CBDC - HU);
      else y = HU + u * (cr - HU);
      const amp = 2 + temp * 5, wob = Math.sin(t * (7 + 5 * hsh(i + 9)) + i);
      const x = v * 116 + amp * wob, yy = y + amp * Math.cos(t * 9 + i * 1.7) * 0.6;
      if (yy < HU || yy > cr) continue;
      const hot = (st === 2) || (st === 1 && o.burn > 0);
      const col = st >= 2 || hot ? (st === 3 ? BURNT : C.line) : mix(C.bg, C.line, 0.7);
      s += `<circle cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" r="${st === 3 ? 5 : 4.5}" fill="${col}"/>`;
    }
    // fronte di fiamma (a PMS) o gas in combustione
    const fb = o.burn != null ? o.burn : (st === 2 ? 1 : 0);
    if (fb > 0) {
      const glow = st === 2 ? 0.5 * (1 - (al - 360) / 180 * 0.7) : 0.5;
      s += `<circle cx="0" cy="${HU}" r="${(fb * 320).toFixed(1)}" fill="${C.line}" opacity="${glow.toFixed(3)}"/>`;
      if (fb < 1) s += `<circle cx="0" cy="${HU}" r="${(fb * 320).toFixed(1)}" fill="none" stroke="${C.line}" stroke-width="4"/>`;
    }
    s += `</g>`;
  }
  // pistone
  s += `<rect x="-127" y="${cr}" width="254" height="96" fill="${DIM2}" stroke="${C.line}" stroke-width="4"/>`;
  s += `<line x1="-127" y1="${cr + 14}" x2="127" y2="${cr + 14}" stroke="${C.line}" stroke-width="2.5"/><line x1="-127" y1="${cr + 26}" x2="127" y2="${cr + 26}" stroke="${C.line}" stroke-width="2.5"/>`;
  s += `<line x1="0" y1="${pin}" x2="${cpx * 0.12}" y2="${pin + 52}" stroke="${C.line}" stroke-width="30" stroke-linecap="butt"/><line x1="0" y1="${pin}" x2="${cpx * 0.12}" y2="${pin + 52}" stroke="${C.bg}" stroke-width="22"/>`;
  s += `<circle cx="0" cy="${pin}" r="15" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
  // testata con condotti
  s += `<rect x="-212" y="150" width="424" height="${HU - 150}" fill="${C.earth}" stroke="${C.line}" stroke-width="4"/>`;
  s += `<path d="${PORT_I}" fill="${C.bg}" stroke="${C.line}" stroke-width="3.5" stroke-linejoin="round"/><path d="${PORT_E}" fill="${C.bg}" stroke="${C.line}" stroke-width="3.5" stroke-linejoin="round"/>`;
  s += `<rect x="-212" y="164" width="8" height="72" fill="${C.bg}"/><rect x="204" y="164" width="8" height="72" fill="${C.bg}"/>`;
  // collettori
  s += `<path d="M-${pipe},168 L-212,168 M-${pipe},232 L-212,232 M212,168 L${pipe},168 M212,232 L${pipe},232" stroke="${C.line}" stroke-width="3.5"/>`;
  // valvole (si aprono verso il basso, dentro la camera)
  const valve = (x, L) => `<rect x="${x - 6}" y="${118 + L}" width="12" height="${144 - 10}" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` +
    `<path d="M${x - 37},${HU + L} L${x + 37},${HU + L} L${x + 30},${HU - 10 + L} L${x + 8},${HU - 18 + L} L${x - 8},${HU - 18 + L} L${x - 30},${HU - 10 + L} Z" fill="${C.bg}" stroke="${C.line}" stroke-width="3.5" stroke-linejoin="round"/>`;
  s += valve(-68, liftI(al)) + valve(68, liftE(al));
  // candela
  s += `<rect x="-11" y="150" width="22" height="${HU - 150 - 4}" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/><path d="M-24,100 h48 v50 h-48 z" fill="${C.bg}" stroke="${C.line}" stroke-width="3.5"/><rect x="-8" y="86" width="16" height="16" fill="${C.line}"/>`;
  s += `<line x1="0" y1="${HU - 4}" x2="0" y2="${HU + 4}" stroke="${C.line}" stroke-width="4"/>`;
  if (o.flash > 0) {
    const f = o.flash; let r = '';
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + 0.3, r1 = 10, r2 = 10 + 34 * f; r += `M${r1 * Math.cos(a)},${HU + 8 + r1 * Math.sin(a)} L${r2 * Math.cos(a)},${HU + 8 + r2 * Math.sin(a)} `; }
    s += `<path d="${r}" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="${HU + 8}" r="${6 + 6 * f}" fill="${C.line}"/>`;
  }
  // flussi
  if (o.flowI && liftI(al) > 2) s += flowLine(PATH_I, t, o.flowI, { sw: o.simple ? 8 : 7, sp: 200 }) + head(-68, 316, Math.PI / 2, o.flowI, 26);
  if (o.flowE && liftE(al) > 2) s += flowLine(PATH_E, t, o.flowE, { sw: o.simple ? 8 : 7, sp: 200 }) + head(352, 200, 0, o.flowE, 26);
  return s;
}
// motore grande nelle scene dei tempi: centro x 700, scala 0,86
const EG = { x: 700, y: 48, s: 0.86 };
const G = (x, y, g = EG) => [g.x + x * g.s, g.y + y * g.s];
const place = (inner, g = EG) => `<g transform="translate(${g.x},${g.y}) scale(${g.s})">${inner}</g>`;
function callout(t, t0, lx, ly, px, py, s, a = 'start') { // etichetta con linea di richiamo
  const tx = a === 'start' ? lx : lx, w = tw(s, 'mono', 26) + 3 * s.length;
  const ex = a === 'start' ? lx - 14 : lx + 14;
  return E(t, t0, `<line x1="${ex}" y1="${ly - 9}" x2="${px}" y2="${py}" stroke="${C.line}" stroke-width="2.5"/><circle cx="${px}" cy="${py}" r="6" fill="${C.line}"/>` + lbl(tx, ly, s, { a }), { dy: 8 });
}
// pannello di destra delle scene dei tempi
function panel(t, n, tTitle, rows) {
  let s = '';
  for (let i = 0; i < 4; i++) {
    const x = 1180 + i * 60, act = i + 1 === n;
    s += `<rect x="${x}" y="226" width="46" height="46" rx="8" fill="${act ? C.line : 'none'}" stroke="${C.line}" stroke-width="2"/>` + T(x + 23, 258, String(i + 1), { f: 'mono', size: 24, w: 700, a: 'middle', fill: act ? C.ink : C.line });
  }
  s = E(t, -0.3, s + lbl(1430, 258, `TEMPO ${n} DI 4`, { a: 'start' }), { dy: 0 });
  const name = SNAME[n - 1], size = Math.min(84, 84 * 680 / tw(name, 'pop', 84));
  s += E(t, tTitle, T(1178, 380, name, { f: 'pop', size }), { dy: 18 });
  rows.forEach(([k, v, t0], i) => {
    const y = 480 + i * 118;
    s += E(t, t0, lbl(1180, y, k, { a: 'start' }) + T(1180, y + 56, v, { f: 'popm', size: 46 }), { dy: 12 });
  });
  return s;
}

// 1 — aggancio: la macchina a vapore, con la caldaia fuori dal cilindro
function steam(t) {
  let s = `<line x1="80" y1="790" x2="1840" y2="790" stroke="${C.line}" stroke-width="4"/>`;
  // camino
  s += `<path d="M210,330 L210,160 L262,160 L262,330" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
  // caldaia: tamburo orizzontale con acqua
  s += `<rect x="160" y="330" width="620" height="270" rx="135" fill="${C.earth}" stroke="${C.line}" stroke-width="5"/>`;
  s += `<path d="M185,470 L755,470" stroke="${C.line}" stroke-width="3" opacity="0.8"/>`;
  for (let i = 0; i < 3; i++) s += `<path d="M${260 + i * 150},${505 + (i % 2) * 30} q22,-9 44,0 t44,0" fill="none" stroke="${C.line}" stroke-width="2.5" opacity="0.6"/>`;
  for (let i = 0; i < 9; i++) { const x = 280 + i * 50, y = 450 - ((t * 60 + i * 37) % 90); s += `<circle cx="${x}" cy="${y}" r="${5 + (i % 3)}" fill="none" stroke="${C.line}" stroke-width="2.5" opacity="0.8"/>`; }
  // focolare
  s += `<rect x="230" y="600" width="480" height="190" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/>`;
  for (let i = 0; i < 6; i++) {
    const x = 270 + i * 72, h = 70 + 24 * Math.sin(t * 9 + i * 1.9);
    s += `<path d="M${x},770 Q${x - 26},${770 - h * 0.5} ${x + 6 * Math.sin(t * 7 + i)},${770 - h} Q${x + 26},${770 - h * 0.5} ${x + 22},770 Z" fill="none" stroke="${C.line}" stroke-width="3.5" stroke-linejoin="round"/>`;
  }
  // tubo del vapore → cilindro
  const pp = [[640, 345], [640, 262], [1040, 262], [1040, 405]];
  s += `<path d="${P(pp)}" fill="none" stroke="${C.line}" stroke-width="30" stroke-linejoin="round"/><path d="${P(pp)}" fill="none" stroke="${C.bg}" stroke-width="20" stroke-linejoin="round"/>`;
  s += flowLine(pp, t, C.line, { sw: 6, sp: 160, da: '12 18' });
  // cilindro orizzontale, pistone, asta, testa a croce, biella, volano (manovella sullo stesso asse)
  const ph = t * 2.4, rc = 80, cxw = 1600, cyw = 470, lr = 300, ya = 470;
  const crx = cxw + rc * Math.cos(ph), cry = cyw + rc * Math.sin(ph);
  const hx = crx - Math.sqrt(lr * lr - (cry - ya) ** 2), pistonX = hx - 285;
  s += `<rect x="900" y="405" width="280" height="130" fill="${C.earth}" stroke="${C.line}" stroke-width="5"/><rect x="920" y="425" width="240" height="90" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`;
  s += `<rect x="1028" y="398" width="24" height="30" fill="${C.bg}"/>`;
  s += `<rect x="${pistonX}" y="427" width="34" height="86" fill="${DIM2}" stroke="${C.line}" stroke-width="3"/>`;
  s += `<line x1="${pistonX + 34}" y1="${ya}" x2="${hx}" y2="${ya}" stroke="${C.line}" stroke-width="9"/>`;
  s += `<line x1="1200" y1="444" x2="1420" y2="444" stroke="${C.line}" stroke-width="3"/><line x1="1200" y1="496" x2="1420" y2="496" stroke="${C.line}" stroke-width="3"/>`;
  s += `<rect x="${hx - 22}" y="450" width="44" height="40" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`;
  s += `<line x1="${hx}" y1="${ya}" x2="${crx}" y2="${cry}" stroke="${C.line}" stroke-width="10" stroke-linecap="round"/>`;
  s += `<circle cx="${cxw}" cy="${cyw}" r="200" fill="none" stroke="${C.line}" stroke-width="12"/><circle cx="${cxw}" cy="${cyw}" r="186" fill="none" stroke="${C.line}" stroke-width="2"/>`;
  for (let k = 0; k < 6; k++) { const a = ph + k * Math.PI / 3 + 0.5; s += `<line x1="${cxw + 22 * Math.cos(a)}" y1="${cyw + 22 * Math.sin(a)}" x2="${cxw + 186 * Math.cos(a)}" y2="${cyw + 186 * Math.sin(a)}" stroke="${C.line}" stroke-width="5"/>`; }
  s += `<line x1="${cxw}" y1="${cyw}" x2="${crx}" y2="${cry}" stroke="${C.line}" stroke-width="16" stroke-linecap="round"/>`;
  s += `<circle cx="${cxw}" cy="${cyw}" r="22" fill="${C.bg}" stroke="${C.line}" stroke-width="4"/><circle cx="${crx}" cy="${cry}" r="12" fill="${C.line}"/>`;
  s += `<path d="M${cxw - 70},790 L${cxw},${cyw + 22} L${cxw + 70},790" fill="none" stroke="${C.line}" stroke-width="5"/>`;
  return s;
}
scene('hook', { make: (W) => ({
  capAt: W('per'), last: W('ingombrante'),
  render(t) {
    let s = E(t, -0.3, steam(t), { dy: 0, blur: 6 });
    s += E(t, W('vapore') - 0.1, lbl(1040, 580, 'CILINDRO'), { dy: 8 });
    s += E(t, W('caldaia') - 0.1, T(432, 298, 'CALDAIA ESTERNA', { f: 'mono', size: 28, w: 700, a: 'middle', ls: 3, fill: C.coral }), { dy: 8 });
    s += E(t, W('pesante') - 0.1, IT(900, 640, 'pesante', { size: 60 }), { dy: 12 });
    s += E(t, W('ingombrante') - 0.1, IT(900, 715, 'e ingombrante', { size: 60 }), { dy: 12 });
    return s + caption(t, W('per'), 'Qualcosa di più compatto', '');
  } }) });

// 2 — combustione interna
scene('interna', { make: (W) => ({
  capAt: W('combustione', 1), last: W('dentro'),
  render(t) {
    const fl = 0.85 + 0.15 * Math.sin(t * 13);
    let s = E(t, -0.3, place(engine({ al: 362, t, burn: 1, gas: 'auto', rot: false })), { dy: 0, blur: 6 });
    s += E(t, W('milleottocentosettantasei') - 0.1, T(1180, 400, '1876', { f: 'pop', size: 150 }), { dy: 16 });
    s += E(t, W('quattro') - 0.1, lbl(1184, 470, 'MOTORE A 4 TEMPI', { a: 'start' }), { dy: 8 });
    s += E(t, W('combustione') - 0.1, T(1180, 560, 'combustione', { f: 'serif', it: true, size: 64 }) + T(1180, 625, 'interna', { f: 'serif', it: true, size: 64 }), { dy: 10 });
    // freccia corallo: dentro il cilindro
    const [ax, ay] = G(150, 274);
    s += E(t, W('dentro') - 0.15, arrow(1160, 740, ax + 40, ay + 6, C.coral, 7) + lbl(1180, 760, 'DENTRO IL CILINDRO', { a: 'start' }), { dy: 0 });
    return s + caption(t, W('combustione', 1), 'Combustione interna', '');
  } }) });

// 3 — le parti
scene('parti', { make: (W) => ({
  capAt: W('in'), last: W('due'),
  render(t) {
    const al = 180 + 120 * ss((t - W('scorre') + 0.2) / 2.2);
    let s = E(t, -0.3, place(engine({ al, t, gas: 'none' })), { dy: 0, blur: 6 });
    const cr = crownY(al);
    let [px, py] = G(-127, cr + 50);
    s += callout(t, W('cilindro') - 0.1, 400, 560, ...G(-158, 600), 'CILINDRO', 'end');
    s += callout(t, W('pistone') - 0.1, 400, 430, px, py, 'PISTONE', 'end');
    const th = al % 360, cpx = RR * Math.sin(th * deg), cpy = YC - RR * Math.cos(th * deg);
    const [bx, by] = G(cpx * 0.8, (cr + PIN) * 0.2 + cpy * 0.8);
    s += callout(t, W('collegato') - 0.1, 1080, 640, bx, by, 'BIELLA');
    s += callout(t, W("all'albero") - 0.1, 400, 820, ...G(-14, YC + 12), 'ALBERO MOTORE', 'end');
    s += E(t, W('candela') - 0.1, lbl(700, 108, 'CANDELA'), { dy: 8 });
    s += callout(t, W('due') - 0.1, 420, 170, ...G(-68, 132), 'VALVOLA', 'end');
    s += callout(t, W('due') + 0.05, 980, 170, ...G(68, 132), 'VALVOLA');
    return s + caption(t, W('in'), 'Le parti del motore', 'parti');
  } }) });

// 4–7 — i quattro tempi
scene('aspira', { make: (W) => ({
  capAt: W('primo'), last: W('miscela'),
  render(t) {
    const al = 180 * ss((t - W('scende') + 0.15) / (W('benzina') + 0.5 - W('scende')));
    let s = place(engine({ al, t, flowI: C.coral }));
    s += E(t, 0, lbl(230, G(0, 140)[1], 'ARIA + BENZINA', { a: 'start' }), { dy: 6 });
    s += panel(t, 1, W('aspirazione') - 0.1, [['PISTONE', 'scende ↓', W('scende') - 0.1], ['VALVOLA DI ASPIRAZIONE', 'aperta', W('apre') - 0.1], ['ENTRA LA MISCELA', 'aria + benzina', W('miscela') - 0.1]]);
    return s + caption(t, W('primo'), 'Primo tempo: aspirazione', '');
  } }) });
scene('comprime', { make: (W) => ({
  capAt: W('secondo'), last: W('aumentano'),
  render(t) {
    const al = 180 + 180 * ss((t - W('sale') + 0.1) / (W('decimo') - W('sale') + 0.1));
    let s = place(engine({ al, t }));
    // volumi: iniziale (a sinistra, filo) e ~1/10 (a destra, corallo)
    const tB = W('decimo') - 0.1;
    const [lx, y0] = G(-196, HU), y1 = G(0, CBDC)[1], y2 = G(0, CTDC)[1], rx = G(196, 0)[0];
    s += E(t, tB, `<line x1="${G(-128, CBDC)[0]}" y1="${y1}" x2="${lx}" y2="${y1}" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>` +
      `<path d="M${lx + 14},${y0} H${lx} V${y1} H${lx + 14}" fill="none" stroke="${C.line}" stroke-width="4"/>` + lbl(lx - 18, (y0 + y1) / 2 - 2, 'VOLUME', { a: 'end' }) + lbl(lx - 18, (y0 + y1) / 2 + 32, 'INIZIALE', { a: 'end' }), { dy: 0 });
    s += E(t, tB + 0.25, `<path d="M${rx - 14},${y0} H${rx} V${y2} H${rx - 14}" fill="none" stroke="${C.coral}" stroke-width="6"/>` + T(rx + 18, y2 + 14, '≈ 1/10', { f: 'pop', size: 44, fill: C.coral }), { dy: 0 });
    s += panel(t, 2, W('compressione') - 0.1, [['VALVOLE', 'chiuse', W('valvole') - 0.1], ['PISTONE', 'sale ↑', W('sale') - 0.1], ['TEMPERATURA E PRESSIONE', 'aumentano ↑', W('aumentano') - 0.1]]);
    return s + caption(t, W('secondo'), 'Secondo tempo: compressione', '');
  } }) });
scene('scoppio', { make: (W) => ({
  capAt: W('terzo'), last: W('basso'),
  render(t) {
    const t0 = W('esplode') + 0.25, al = 360 + 180 * ss((t - t0) / (W('basso') + 0.6 - t0));
    const fs = W('scintilla') - 0.05, flash = t > fs && t < fs + 0.9 ? (Math.sin((t - fs) * 40) * 0.5 + 0.5) * (1 - (t - fs) / 0.9) + 0.2 : 0;
    const burn = t < W('esplode') - 0.05 ? 0 : clamp((t - W('esplode') + 0.05) / 0.3);
    let s = place(engine({ al: burn > 0 ? Math.max(al, 360) : 359.9, t, burn, flash }));
    if (t > W('spingono') - 0.1) {
      const cr = crownY(al), [x0, ya] = G(0, cr + 8), yb = G(0, cr + 90)[1];
      s += E(t, W('spingono') - 0.1, `<line x1="${x0}" y1="${ya}" x2="${x0}" y2="${yb - 14}" stroke="${C.coral}" stroke-width="14"/>` + head(x0, yb + 6, Math.PI / 2, C.coral, 34), { dy: 0, blur: 0 });
    }
    s += panel(t, 3, W('scoppio') - 0.1, [['CANDELA', 'scintilla', W('scintilla') - 0.1], ['MISCELA', 'esplode', W('esplode') - 0.1], ['I GAS SPINGONO', 'il pistone in basso ↓', W('basso') - 0.1]]);
    return s + caption(t, W('terzo'), 'Terzo tempo: scoppio', '');
  } }) });
scene('scarico', { make: (W) => ({
  capAt: W('quarto'), last: W('verso'),
  render(t) {
    const t0 = W('apre') - 0.15, al = 540 + 180 * ss((t - t0) / (W('scappamento') + 0.5 - t0));
    let s = place(engine({ al, t, flowE: C.coral }));
    s += E(t, W('verso') - 0.1, lbl(G(330, 0)[0], G(0, 140)[1], 'SCAPPAMENTO', { a: 'end' }), { dy: 6 });
    s += panel(t, 4, W('scarico') - 0.1, [['VALVOLA DI SCARICO', 'aperta', W('apre') - 0.1], ['PISTONE', 'sale ↑', W('salendo') - 0.1], ['GAS COMBUSTI', 'escono', W('espelle') - 0.1]]);
    return s + caption(t, W('quarto'), 'Quarto tempo: scarico', '');
  } }) });

// 8 — un solo tempo attivo (registro chiaro)
scene('attivo', { make: (W) => ({
  capAt: W('solo'), last: W('non'),
  render(t) {
    let s = lightBg();
    const names = ['ASPIRAZIONE', 'COMPRESSIONE', 'SCOPPIO', 'SCARICO'];
    for (let i = 0; i < 4; i++) {
      const x = 150 + i * 430, y = 260, act = i === 2;
      let g = card(x, y, 380, 400);
      if (act && t > W('scoppio') - 0.1) g += pop(t, W('scoppio') - 0.1, x + 190, y + 200, `<rect x="${x}" y="${y}" width="380" height="400" rx="18" fill="${C.coral}" stroke="${C.ink}" stroke-width="3"/>`);
      g += T(x + 36, y + 110, String(i + 1), { f: 'pop', size: 96, fill: C.ink }) + lbl(x + 36, y + 170, names[i], { a: 'start', fill: C.ink });
      s += E(t, -0.3 + i * 0.12, g, { dy: 0 });
      if (i < 3) s += E(t, i * 0.12, arrow(x + 392, y + 200, x + 420, y + 200, C.ink, 4), { dy: 0 });
      if (act) s += E(t, W('lavoro') - 0.1, T(x + 36, y + 300, 'lavoro', { f: 'pop', size: 54, fill: C.ink }) + T(x + 36, y + 360, 'utile', { f: 'pop', size: 54, fill: C.ink }), { dy: 10 });
      else {
        s += E(t, W('necessari') - 0.1 + i * 0.08, IT(x + 36, y + 300, 'necessario', { size: 50, fill: C.ink }), { dy: 10 });
        s += E(t, W('non') - 0.1 + i * 0.08, IT(x + 36, y + 352, 'senza lavoro utile', { size: 40, fill: C.ink }), { dy: 8 });
      }
    }
    return s + caption(t, W('solo'), 'Un solo tempo attivo', '', true);
  } }) });

// 9 — un solo cilindro: forza solo nel terzo tempo
const fpulse = al => { al = ((al % 720) + 720) % 720; if (al < 360 || al >= 540) return 0; const b = (al - 360) / 180; return b < 0.08 ? b / 0.08 : Math.exp(-(b - 0.08) * 3.2); };
scene('irregolare', { make: (W) => ({
  capAt: W('con'), last: W('terzo'),
  render(t, D) {
    const g = { x: 470, y: 120, s: 0.62 }, al = (t + 0.9) * 200;
    const flash = (al % 720) > 352 && (al % 720) < 372 ? 1 : 0;
    let s = E(t, -0.3, place(engine({ al, t, flash }), g), { dy: 0, blur: 6 });
    // grafico: forza prodotta nel tempo (schema)
    const x0 = 900, x1 = 1800, yb = 640, H = 300, span = 720 * 2.5, a0 = 180;
    let ax = `<line x1="${x0}" y1="${yb}" x2="${x1}" y2="${yb}" stroke="${C.line}" stroke-width="3"/>` + head(x1 + 12, yb, 0, C.line, 20) + `<line x1="${x0}" y1="${yb}" x2="${x0}" y2="${yb - H - 30}" stroke="${C.line}" stroke-width="3"/>` + head(x0, yb - H - 42, -Math.PI / 2, C.line, 20);
    ax += lbl(x0 + 20, yb - H - 30, 'FORZA PRODOTTA', { a: 'start' }) + lbl(x1, yb + 90, 'TEMPO →', { a: 'end' });
    for (let k = 0; k < 10; k++) { const xs = x0 + (k * 180) / span * (x1 - x0); ax += `<line x1="${xs}" y1="${yb - 8}" x2="${xs}" y2="${yb + 8}" stroke="${C.line}" stroke-width="2"/>` + lbl(xs + 45, yb + 40, String((k + Math.floor(a0 / 180)) % 4 + 1)); }
    s += E(t, W('irregolare') - 0.3, ax + pillTag(x1 - 190, 236, 'SCHEMA', C.line, C.bg), { dy: 0 });
    if (t > W('irregolare') - 0.3) {
      const now = Math.min(al, a0 + span); let pts = [];
      for (let a = a0; a <= now; a += 4) pts.push([x0 + (a - a0) / span * (x1 - x0), yb - fpulse(a) * H]);
      if (pts.length > 1) s += `<path d="${P(pts.map(p => [p[0].toFixed(1), p[1].toFixed(1)]))}" fill="none" stroke="${C.coral}" stroke-width="6" stroke-linejoin="round"/>`;
    }
    return s + caption(t, W('con'), 'Un cilindro: irregolare', '');
  } }) });

// 10 — quattro cilindri, cicli sfasati (ordine di accensione 1-3-4-2)
const OFF = [0, -540, -180, -360];
scene('cilindri', { make: (W) => ({
  capAt: W('cicli') - 0.1, last: W('aspirazione'),
  render(t) {
    const tm = W('mentre') - 0.3, al = 360 + (t - tm) * 180 / 6.2;
    const X = [450, 790, 1130, 1470];
    let s = E(t, -0.3, `<line x1="270" y1="${135 + YC * 0.5}" x2="1650" y2="${135 + YC * 0.5}" stroke="${C.line}" stroke-width="10"/><line x1="270" y1="${135 + YC * 0.5}" x2="1650" y2="${135 + YC * 0.5}" stroke="${C.bg}" stroke-width="4"/>`, { dy: 0 });
    for (let k = 0; k < 4; k++) {
      const a = al + OFF[k], g = { x: X[k], y: 135, s: 0.5 };
      s += E(t, -0.3 + k * 0.1, place(engine({ al: a, t, simple: true, rot: false, pipe: 250, flash: ((a % 720) + 720) % 720 > 355 && ((a % 720) + 720) % 720 < 372 ? 1 : 0 }), g), { dy: 0, blur: 6 });
      s += E(t, -0.1 + k * 0.1, lbl(X[k], 680, `CILINDRO ${k + 1}`), { dy: 6 });
    }
    s += E(t, W('quattro') - 0.1, lbl(960, 160, 'MOTORE A 4 CILINDRI', { a: 'middle' }), { dy: 6 });
    const cue = [W('scoppio') - 0.1, W('aspirazione'), W('compressione') - 0.1, W('aspirazione') - 0.1];
    for (let k = 0; k < 4; k++) {
      const st = stroke(al + OFF[k]);
      s += E(t, cue[k], T(X[k], 745, SNAME[st].toLowerCase(), { f: 'pop', size: 40, a: 'middle', fill: st === 2 ? C.coral : C.line }), { dy: 8 });
    }
    return s + caption(t, W('cicli') - 0.1, 'Cicli sfasati', '');
  } }) });

// 11 — moto più uniforme (registro chiaro): schema delle spinte
scene('uniforme', { make: (W) => ({
  capAt: W('abbastanza'), last: W('uniforme'),
  render(t) {
    let s = lightBg() + E(t, -0.4, card(160, 150, 1600, 640), { dy: 0 });
    const x0 = 560, x1 = 1660, span = 1440, rows = [[440, '1 CILINDRO', a => fpulse(a), C.ink], [700, '4 CILINDRI', a => Math.max(...OFF.map(o => fpulse(a + o))), C.coral]];
    const rv = clamp((t - W('risultato') + 0.2) / 1.6);
    s += E(t, -0.2, pillTag(1500, 236, 'SCHEMA', C.ink, C.cream), { dy: 0 });
    rows.forEach(([yb, name, f, col], i) => {
      s += E(t, -0.1 + i * 0.15, lbl(220, yb - 40, name, { a: 'start', fill: C.ink }) + `<line x1="${x0}" y1="${yb}" x2="${x1}" y2="${yb}" stroke="${C.ink}" stroke-width="3"/>`, { dy: 8 });
      let pts = [];
      for (let a = 0; a <= span * rv; a += 3) pts.push([x0 + a / span * (x1 - x0), yb - f(a + 360) * 160]);
      if (pts.length > 1) s += `<path d="${P(pts.map(p => [p[0].toFixed(1), p[1].toFixed(1)]))}" fill="none" stroke="${col}" stroke-width="${i ? 7 : 5}" stroke-linejoin="round"/>`;
    });
    s += E(t, 0.2, lbl(x1, 760, 'TEMPO →', { a: 'end', fill: C.ink }), { dy: 6 });
    return s + caption(t, W('abbastanza'), 'Abbastanza uniforme', '', true);
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.05, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Quattro tempi', { f: 'pop', size: 120, a: 'middle', fill: C.ink }), { dy: 0 });
    s += words(t, W('e') - 0.1, 960, 550, 'e il ciclo ricomincia.', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: '' });
    s += E(t, -0.2, lbl(960, 260, 'ASPIRAZIONE · COMPRESSIONE · SCOPPIO · SCARICO', { fill: C.ink }), { dy: 6 });
    s += E(t, W('ricomincia'), `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC ENE-3-05', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
    return s;
  } }) });

// ---- timeline ----
let acc = 0; const TL = SCENES.map(s => { const o = { id: s.id, start: acc, D: s.D, L: s.L, voce: s.sc.voce_dur }; acc += s.D; return o; });
window.TIMELINE = { total: acc, scenes: TL };
window.render = function (T0) {
  _cid = 0;
  let i = TL.findIndex(x => T0 < x.start + x.D); if (i < 0) i = TL.length - 1;
  const S = SCENES[i], t = T0 - TL[i].start;
  let body = S.light ? '' : `<rect width="1920" height="1080" fill="${C.bg}"/>`;
  let inner = S.render(t, S.D);
  if (!S.light) inner = `<g transform="translate(960,540) scale(${1 + 0.025 * t / S.D}) translate(-960,-540)">${inner}</g>`;
  body += inner;
  if (S.id !== 'finale') body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
