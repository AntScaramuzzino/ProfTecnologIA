/* ═══════════════════════════════════════════════════════════
   ASSONOMETRO — Book ProfTecnologIA
   Un solido disegnato in assonometria cavaliera, isometrica o monometrica, in proiezione parallela esatta,
   con gli assi, le misure, la scatola e le tre viste (PV, PO, PL) da cui si prendono le misure.
   Gemello del proiettore ortogonale (../proiettore/): stessi solidi e stesse chiavi delle misure (solidi.js).

   Apertura da indirizzo:
     ?tipo=cavaliera|isometrica|monometrica
     ?solido=<id>                 uno dei solidi del proiettore (parallelepipedo, elle, prismatri, piramide…)
     ?<misura>=<cm>               misure in centimetri, con le chiavi del proiettore (L, H, P, lato, r, alt, larg, prof, sp…)
     ?alfa=<gradi>&beta=<gradi>   rotazione di partenza, come nel proiettore
     ?esercizio=1                 solido e misure bloccati; con ?titolo= e ?misure= compare il riquadro della consegna
     ?embed=1                     dentro una pagina del libro: senza testata      ?lim=1   a schermo intero per la LIM
═══════════════════════════════════════════════════════════ */
import { SOLIDI, MISURE, misureStandard } from './solidi.js';
import { TIPI, versore, vistaAssonometrica, VISTE_PO, posiziona, proietta, pianoDellaFaccia, verticiVeri } from './geometria.js';

const $ = s => document.querySelector(s);
const PAR = new URLSearchParams(location.search);
const parNum = k => {
  const v = PAR.get(k);
  if (v === null || v.trim() === '') return null;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

const telefono = window.matchMedia('(max-width: 720px)');
const U = 10;                                       // unità del disegno per centimetro
const RADICE3 = Math.sqrt(3);
const COLORE = { x: '#C2410C', y: '#15803D', z: '#1D4ED8' };
const PIANI = { PV: '#93C5FD', PO: '#FDE047', PL: '#F9A8D4' };          // i piani nelle tre viste
const FACCE = { PV: '#BFDBFE', PO: '#FEF08A', PL: '#FBCFE8', altra: '#E2E8F0' };   // le facce del solido: stesse tinte, piene
const NOME_ASSE = { x: 'larghezza', y: 'profondità', z: 'altezza' };

/* Solidi che si scelgono dal menu, con misure «tonde» in centimetri. `k` è la chiave del proiettore.
   Dove il proiettore vuole il raggio della circonferenza circoscritta (triangoli) qui si chiede il lato. */
const lato3 = { daUI: v => v / RADICE3, aUI: r => r * RADICE3 };
const CATALOGO = [
  { id: 'parallelepipedo', nome: 'Parallelepipedo', misure: [
    { k: 'L', et: 'Larghezza', v: 6, min: 2, max: 10 }, { k: 'P', et: 'Profondità', v: 4, min: 1, max: 8 }, { k: 'H', et: 'Altezza', v: 8, min: 1, max: 10 }] },
  { id: 'cubo', nome: 'Cubo', misure: [{ k: 'lato', et: 'Lato', v: 5, min: 2, max: 8 }] },
  { id: 'elle', nome: 'Blocco a L', misure: [
    { k: 'larg', et: 'Larghezza', v: 8, min: 4, max: 10 }, { k: 'prof', et: 'Profondità', v: 4, min: 1, max: 8 },
    { k: 'alt', et: 'Altezza', v: 6, min: 4, max: 10 }, { k: 'sp', et: 'Spessore dei bracci', v: 2, min: 1, max: 3 }] },
  { id: 'scasso', nome: 'Prisma con scasso', misure: [
    { k: 'larg', et: 'Larghezza', v: 8, min: 4, max: 10 }, { k: 'prof', et: 'Profondità', v: 4, min: 1, max: 8 }, { k: 'alt', et: 'Altezza', v: 5, min: 2, max: 8 }] },
  { id: 'prismatri', nome: 'Prisma triangolare', alfa: 180, misure: [
    { k: 'r', et: 'Lato della base', v: 6, min: 3, max: 9, ...lato3 }, { k: 'alt', et: 'Altezza', v: 8, min: 1, max: 10 }] },
  { id: 'esagonale', nome: 'Prisma esagonale', alfa: 90, misure: [
    { k: 'r', et: 'Lato della base', v: 3, min: 1.5, max: 5 }, { k: 'alt', et: 'Altezza', v: 7, min: 1, max: 10 }] },
  { id: 'piramide', nome: 'Piramide quadrata', misure: [
    { k: 'lato', et: 'Lato della base', v: 6, min: 2, max: 9 }, { k: 'alt', et: 'Altezza', v: 8, min: 2, max: 10 }] },
  { id: 'piramidetri', nome: 'Piramide triangolare', alfa: 180, misure: [
    { k: 'r', et: 'Lato della base', v: 6, min: 3, max: 9, ...lato3 }, { k: 'alt', et: 'Altezza', v: 8, min: 2, max: 10 }] },
  { id: 'cilindropieno', nome: 'Cilindro', misure: [
    { k: 'r', et: 'Raggio', v: 3, min: 1, max: 4.5 }, { k: 'alt', et: 'Altezza', v: 7, min: 1, max: 10 }] },
  { id: 'cono', nome: 'Cono', misure: [
    { k: 'r', et: 'Raggio della base', v: 3, min: 1, max: 4.5 }, { k: 'alt', et: 'Altezza', v: 8, min: 2, max: 10 }] },
  { id: 'cilsupar', nome: 'Cilindro su parallelepipedo', misure: [
    { k: 'L', et: 'Larghezza della base', v: 7, min: 4, max: 10 }, { k: 'P', et: 'Profondità della base', v: 5, min: 3, max: 8 },
    { k: 'H', et: 'Altezza della base', v: 2, min: 1, max: 5 }, { k: 'r', et: 'Raggio del cilindro', v: 2, min: 1, max: 3 }, { k: 'alt', et: 'Altezza del cilindro', v: 5, min: 1, max: 8 }] },
  { id: 'tetto', nome: 'Casetta', misure: [
    { k: 'L', et: 'Larghezza', v: 5, min: 3, max: 9 }, { k: 'P', et: 'Profondità', v: 7, min: 2, max: 9 },
    { k: 'H', et: 'Altezza dei muri', v: 4, min: 1, max: 7 }, { k: 'ht', et: 'Altezza del tetto', v: 3, min: 1, max: 5 }] },
];
const voce = id => CATALOGO.find(c => c.id === id);

/* ── stato ── */
const stato = {
  tipo: TIPI[PAR.get('tipo')] ? PAR.get('tipo') : 'cavaliera',
  id: SOLIDI[PAR.get('solido')] ? PAR.get('solido') : 'parallelepipedo',
  cm: {},                                           // misure in cm, con le chiavi del proiettore
  alfa: 0, beta: 0,
  partenza: { alfa: 0, beta: 0 },
  mostra: { scatola: true, nascosti: true, facce: true, quote: true },
  punto: null,                                      // posizione nell'elenco dei vertici veri
};
const esercizio = PAR.get('esercizio') === '1';

/** Misure di partenza di un solido: quelle del menu (in cm), o quelle del proiettore ingrandite se il solido non è nel menu. */
const misureDiPartenza = id => {
  const c = voce(id), cm = {};
  if (c) c.misure.forEach(m => { cm[m.k] = m.daUI ? m.daUI(m.v) : m.v; });
  else Object.entries(misureStandard(id)).forEach(([k, v]) => { cm[k] = k === 'ang' ? v : v * 2.5; });
  return cm;
};
const impostaSolido = (id, daIndirizzo) => {
  stato.id = id;
  stato.cm = misureDiPartenza(id);
  const c = voce(id);
  stato.partenza = { alfa: c && c.alfa ? c.alfa : 0, beta: 0 };
  if (daIndirizzo) {
    [...Object.keys(MISURE[id] || {}), 'sp'].forEach(k => { const n = parNum(k); if (n !== null && n > 0) stato.cm[k] = n; });
    if (parNum('alfa') !== null) stato.partenza.alfa = parNum('alfa');
    if (parNum('beta') !== null) stato.partenza.beta = Math.max(-90, Math.min(90, parNum('beta')));
  }
  stato.alfa = stato.partenza.alfa; stato.beta = stato.partenza.beta;
  stato.punto = null;
};
impostaSolido(stato.id, true);

/* ── strumenti di disegno ── */
const n1 = v => (v * U).toFixed(1);
const cmTesto = v => `${(Math.round(v * 10) / 10).toString().replace('.', ',')} cm`;
const linea = (a, b, cls, extra = '') => `<line class="${cls}" x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}"${extra}/>`;
const tratti = l => l.map(([x1, y1, x2, y2]) => `M${n1(x1)} ${n1(y1)}L${n1(x2)} ${n1(y2)}`).join('');
const scritta = (p, testo, cls, extra = '') => `<text class="${cls}" x="${n1(p[0])}" y="${n1(p[1])}"${extra}>${testo}</text>`;
const somma = (a, b) => [a[0] + b[0], a[1] + b[1]];

/** viewBox che contiene il rettangolo dato (in cm) e ha il rapporto larghezza/altezza richiesto. */
const riquadro = (x0, y0, x1, y1, rapporto) => {
  let w = x1 - x0, h = y1 - y0;
  if (w / h < rapporto) { const nw = h * rapporto; x0 -= (nw - w) / 2; w = nw; }
  else { const nh = w / rapporto; y0 -= (nh - h) / 2; h = nh; }
  return { x0, y0, w, h, testo: `${n1(x0)} ${n1(y0)} ${n1(w)} ${n1(h)}` };
};

let scena = null;                                   // solido, posizione e vertici veri: si rifà a ogni cambio

function preparaScena() {
  const solido = SOLIDI[stato.id](stato.cm);
  const { P, N, scatola } = posiziona(solido, stato.alfa, stato.beta);
  const veri = verticiVeri(solido).sort((a, b) => (P[a].z - P[b].z) || (P[a].y - P[b].y) || (P[a].x - P[b].x));
  if (stato.punto !== null && stato.punto >= veri.length) stato.punto = null;
  scena = { solido, P, N, scatola, veri };
}

/* ── il foglio: il solido in assonometria ── */
function disegnaFoglio() {
  const T = TIPI[stato.tipo];
  const vista = vistaAssonometrica(stato.tipo);
  const { solido, P, N, scatola, veri } = scena;
  const m = vista.m;
  const dim = { x: scatola.L, y: scatola.P, z: scatola.H };
  const O = [0, 0];
  const lungo = (asse, cm) => { const v = versore(stato.tipo, asse); return [v[0] * cm, -v[1] * cm]; };   // cm già sul foglio
  const fineAsse = { x: lungo('x', dim.x * T.x.k + 1.5), y: lungo('y', dim.y * T.y.k + 1.5), z: lungo('z', dim.z * T.z.k + 1.5) };

  const angoli = [];
  [0, 1].forEach(i => [0, 1].forEach(j => [0, 1].forEach(k => angoli.push(m({ x: i * dim.x, y: j * dim.y, z: k * dim.z })))));
  const xs = [...angoli.map(p => p[0]), fineAsse.x[0], fineAsse.y[0], 0], ys = [...angoli.map(p => p[1]), fineAsse.z[1], fineAsse.y[1], fineAsse.x[1], 0];
  const postoMisura = stato.mostra.quote && vista.v.x > 0 ? 0.9 + (telefono.matches ? 0.5 : 0.3) * `${cmTesto(dim.y)} → ${cmTesto(dim.y * T.y.k)}`.length : 0;      // in cavaliera la misura della profondità sta a destra
  const vb = riquadro(Math.min(...xs) - 2.4, Math.min(...ys) - 1.0, Math.max(Math.max(...xs) + 1.8, m({ x: dim.x, y: dim.y, z: 0 })[0] + postoMisura), Math.max(...ys) + 1.5, 1.12);

  const r = proietta(solido, P, N, vista);
  let h = '';

  // carta a quadretti da 1 cm, agganciata a O
  h += `<defs><pattern id="quadretti" width="${U}" height="${U}" patternUnits="userSpaceOnUse"><path d="M${U} 0H0V${U}" class="quadretto"/></pattern>` +
       ['x', 'y', 'z'].map(a => `<marker id="punta-${a}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M0 1L9 5L0 9z" fill="${COLORE[a]}"/></marker>`).join('') + '</defs>';
  h += `<rect x="${n1(-80)}" y="${n1(-80)}" width="${n1(160)}" height="${n1(160)}" fill="url(#quadretti)"/>`;

  // linea orizzontale di riferimento e ampiezza degli angoli
  const orizzontale = T.x.gradi !== 0;
  if (orizzontale) h += linea([-80, 0], [80, 0], 'riferimento');
  const arco = (da, fino, testo) => {
    const raggio = 1.5, p = g => [raggio * Math.cos(g * Math.PI / 180), -raggio * Math.sin(g * Math.PI / 180)];
    const a = p(da), b = p(fino), mezzo = (da + fino) / 2, q = [2.15 * Math.cos(mezzo * Math.PI / 180), -2.15 * Math.sin(mezzo * Math.PI / 180) + 0.18];
    return `<path class="arco" d="M${n1(a[0])} ${n1(a[1])}A${n1(raggio)} ${n1(raggio)} 0 0 ${fino > da ? 0 : 1} ${n1(b[0])} ${n1(b[1])}"/>` + scritta(q, testo, 'gradi', ' text-anchor="middle"');
  };
  if (T.x.gradi !== 0) h += arco(0, T.x.gradi, `${T.x.gradi}°`);
  if (T.y.gradi < 90) h += arco(0, T.y.gradi, `${T.y.gradi}°`);
  else h += arco(180, T.y.gradi, `${180 - T.y.gradi}°`);

  // scatola: il parallelepipedo più piccolo che contiene il solido. Ogni spigolo si divide in parti in vista e
  // parti coperte dal solido: quelle coperte vanno sotto le facce, quelle in vista sopra (più avanti).
  const scatolaSopra = [];
  if (stato.mostra.scatola) {
    const c = (i, j, k) => ({ x: i * dim.x, y: j * dim.y, z: k * dim.z });
    const spigoli = [];
    [0, 1].forEach(j => [0, 1].forEach(k => spigoli.push([c(0, j, k), c(1, j, k)])));
    [0, 1].forEach(i => [0, 1].forEach(k => spigoli.push([c(i, 0, k), c(i, 1, k)])));
    [0, 1].forEach(i => [0, 1].forEach(j => spigoli.push([c(i, j, 0), c(i, j, 1)])));
    const sotto = [];
    spigoli.forEach(([a3, b3]) => { const p = r.spezza(a3, b3); sotto.push(...p.nascosti); scatolaSopra.push(...p.visibili); });
    if (sotto.length) h += `<path class="scatola" d="${tratti(sotto)}"/>`;
  }

  // facce in vista, dalla più lontana alla più vicina
  r.facce.forEach(f => {
    const piano = pianoDellaFaccia(f.n);
    const tinta = stato.mostra.facce ? FACCE[piano || 'altra'] : '#FDFDFB';
    h += `<polygon class="faccia" points="${f.punti.map(p => `${n1(p[0])},${n1(p[1])}`).join(' ')}" fill="${tinta}"/>`;
  });
  if (scatolaSopra.length) h += `<path class="scatola" d="${tratti(scatolaSopra)}"/>`;
  // assi: sopra le facce, come linee tracciate sul foglio
  ['x', 'y', 'z'].forEach(a => {
    h += linea(O, fineAsse[a], 'asse', ` stroke="${COLORE[a]}" marker-end="url(#punta-${a})"`);
    const v = lungo(a, 0.55);
    h += scritta(somma(fineAsse[a], [v[0] + (a === 'z' ? 0.35 : 0), v[1] + 0.15]), a, 'nome-asse', ` fill="${COLORE[a]}" text-anchor="middle"`);
  });

  // prima i nascosti, poi quelli in vista: uno spigolo nascosto che cade su uno in vista non lo tratteggia
  if (stato.mostra.nascosti && r.nascosti.length) h += `<path class="sp-nascosto" d="${tratti(r.nascosti)}"/>`;
  h += `<path class="sp-visibile" d="${tratti(r.visibili)}"/>`;

  // misure della scatola, sugli spigoli in vista che partono dal basso
  if (stato.mostra.quote) {
    const centro = m({ x: dim.x / 2, y: dim.y / 2, z: dim.z / 2 });
    const quota = (asse, a3, b3, t = 0.5) => {
      const a = m(a3), b = m(b3), mezzo = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      const d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]) || 1;
      let nrm = [-d[1] / l, d[0] / l];
      if ((mezzo[0] - centro[0]) * nrm[0] + (mezzo[1] - centro[1]) * nrm[1] < 0) nrm = [-nrm[0], -nrm[1]];
      const vera = dim[asse], sulFoglio = vera * T[asse].k;
      const testo = T[asse].k === 1 ? cmTesto(vera) : `${cmTesto(vera)} → ${cmTesto(sulFoglio)}`;
      const ancora = Math.abs(nrm[0]) < 0.35 ? 'middle' : nrm[0] > 0 ? 'start' : 'end';
      const q = [mezzo[0] + nrm[0] * 0.5, mezzo[1] + nrm[1] * 0.5 + (nrm[1] > 0.35 ? 0.42 : nrm[1] < -0.35 ? -0.05 : 0.17)];
      return scritta(q, testo, 'quota', ` fill="${COLORE[asse]}" text-anchor="${ancora}"`);
    };
    const xLato = vista.v.x > 0 ? dim.x : 0;          // il fianco in vista: destro in cavaliera, sinistro nelle altre
    h += quota('x', { x: 0, y: 0, z: 0 }, { x: dim.x, y: 0, z: 0 }, T.x.gradi !== 0 ? 0.74 : 0.5);
    h += quota('y', { x: xLato, y: 0, z: 0 }, { x: xLato, y: dim.y, z: 0 }, vista.v.x > 0 ? 1 : 0.74);
    const yAlto = vista.v.x > 0 ? 0 : dim.y;          // lo spigolo verticale in vista più a sinistra
    h += quota('z', { x: 0, y: yAlto, z: 0 }, { x: 0, y: yAlto, z: dim.z });
  }

  // origine
  h += `<circle class="origine" cx="0" cy="0" r="${n1(0.13)}"/>` + scritta([-0.5, 0.62], 'O', 'nome-o', ' text-anchor="middle"');

  // punto seguito: da O lungo x, poi parallelo a y, poi in verticale
  if (stato.punto !== null) {
    const p = P[veri[stato.punto]];
    const a = m({ x: p.x, y: 0, z: 0 }), b = m({ x: p.x, y: p.y, z: 0 }), c = m(p);
    const pezzo = (da, fino, asse) => (Math.hypot(fino[0] - da[0], fino[1] - da[1]) < 1e-6 ? '' : linea(da, fino, 'percorso', ` stroke="${COLORE[asse]}"`));
    h += pezzo(O, a, 'x') + pezzo(a, b, 'y') + pezzo(b, c, 'z');
    h += `<circle class="tappa" cx="${n1(a[0])}" cy="${n1(a[1])}" r="${n1(0.1)}"/><circle class="tappa" cx="${n1(b[0])}" cy="${n1(b[1])}" r="${n1(0.1)}"/>`;
  }
  // vertici che si possono toccare
  veri.forEach((vi, i) => {
    const q = m(P[vi]), scelto = stato.punto === i;
    h += `<circle class="vertice${scelto ? ' is-scelto' : ''}" data-v="${i}" cx="${n1(q[0])}" cy="${n1(q[1])}" r="${n1(scelto ? 0.2 : 0.16)}"><title>Vertice: x ${cmTesto(P[vi].x)}, y ${cmTesto(P[vi].y)}, z ${cmTesto(P[vi].z)}</title></circle>`;
    if (scelto) h += scritta([q[0] + 0.32, q[1] - 0.3], 'P', 'nome-punto');
    h += `<circle class="vertice__area" data-v="${i}" cx="${n1(q[0])}" cy="${n1(q[1])}" r="${n1(telefono.matches ? 0.7 : 0.45)}"/>`;
  });

  const svg = $('#svgFoglio');
  svg.setAttribute('viewBox', vb.testo);
  svg.innerHTML = h;
  $('#etFoglio').textContent = `FOGLIO · ASSONOMETRIA ${T.nome.toUpperCase()}`;
}

/* ── le tre viste, disposte come sul foglio delle proiezioni ortogonali ── */
function disegnaViste() {
  const { solido, P, N, scatola, veri } = scena;
  const { L, P: Pr, H } = scatola;
  const g = 1;                                       // distanza delle viste dalla LT e dall'asse verticale, in cm
  const sx = -(g + L) - 1.9, dx = g + Pr + 1.9, su = -(H + 1.7), giu = g + Pr + 1.6;
  const vb = riquadro(sx, su, dx, giu, 1.12);
  const bordo = { sx: vb.x0, dx: vb.x0 + vb.w, su: vb.y0, giu: vb.y0 + vb.h };
  const sposta = { PV: [-(g + L), 0], PO: [-(g + L), g + Pr], PL: [g + Pr, 0] };
  let h = '';
  const piano = (x, y, w, alt, tinta) => `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(alt)}" fill="${tinta}" fill-opacity="0.32"/>`;
  h += piano(bordo.sx, bordo.su, -bordo.sx, -bordo.su, PIANI.PV) + piano(0, bordo.su, bordo.dx, -bordo.su, PIANI.PL) + piano(bordo.sx, 0, -bordo.sx, bordo.giu, PIANI.PO);
  h += linea([bordo.sx, 0], [bordo.dx, 0], 'lt') + linea([0, bordo.su], [0, bordo.giu], 'lt');
  h += scritta([bordo.sx + 0.3, -0.35], 'PV', 'nome-piano', ' fill="#1D4ED8"') +
       scritta([bordo.dx - 0.3, -0.35], 'PL', 'nome-piano', ' fill="#BE185D" text-anchor="end"') +
       scritta([bordo.sx + 0.3, bordo.giu - 0.35], 'PO', 'nome-piano', ' fill="#92400E"');

  Object.entries(VISTE_PO).forEach(([nome, vista]) => {
    const d = sposta[nome];
    const qui = { v: vista.v, m: p => somma(vista.m(p), d) };
    const r = proietta(solido, P, N, qui);
    if (r.nascosti.length) h += `<path class="sp-nascosto" d="${tratti(r.nascosti)}"/>`;
    h += `<path class="sp-visibile" d="${tratti(r.visibili)}"/>`;
  });

  // misure colorate: ogni misura compare in due viste
  const quota = (asse, a, b, dove) => {
    const mezzo = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const q = dove === 'su' ? [mezzo[0], mezzo[1] - 0.22] : dove === 'giu' ? [mezzo[0], mezzo[1] + 0.62] : dove === 'sx' ? [mezzo[0] - 0.22, mezzo[1] + 0.17] : [mezzo[0] + 0.22, mezzo[1] + 0.17];
    const ancora = dove === 'sx' ? 'end' : dove === 'dx' ? 'start' : 'middle';
    return linea(a, b, 'quota-linea', ` stroke="${COLORE[asse]}"`) + scritta(q, asse, 'quota', ` fill="${COLORE[asse]}" text-anchor="${ancora}"`);
  };
  const xa = -(g + L), xb = -g, ya = g, yb = g + Pr, d = 0.45;
  h += quota('x', [xa, -H - d], [xb, -H - d], 'su') + quota('z', [xa - d, 0], [xa - d, -H], 'sx');
  h += quota('x', [xa, yb + d], [xb, yb + d], 'giu') + quota('y', [xa - d, ya], [xa - d, yb], 'sx');
  h += quota('y', [g, -H - d], [g + Pr, -H - d], 'su') + quota('z', [g + Pr + d, 0], [g + Pr + d, -H], 'dx');

  // il punto O nelle tre viste
  const o = { PV: [xa, 0], PO: [xa, yb], PL: [g + Pr, 0] };
  h += Object.values(o).map(q => `<circle class="origine" cx="${n1(q[0])}" cy="${n1(q[1])}" r="${n1(0.12)}"/>`).join('');
  h += scritta([o.PV[0] - 0.2, o.PV[1] + 0.62], 'O', 'nome-o', ' text-anchor="end"') +
       scritta([o.PO[0] - 0.2, o.PO[1] + 0.62], 'O', 'nome-o', ' text-anchor="end"') +
       scritta([o.PL[0] + 0.2, o.PL[1] + 0.62], 'O', 'nome-o');

  // il punto seguito nelle tre viste: P′ nel PO, P″ nel PV, P‴ nel PL
  if (stato.punto !== null) {
    const p = P[veri[stato.punto]];
    const pv = somma(VISTE_PO.PV.m(p), sposta.PV), po = somma(VISTE_PO.PO.m(p), sposta.PO), pl = somma(VISTE_PO.PL.m(p), sposta.PL);
    h += linea(po, pv, 'richiamo') + linea(pv, pl, 'richiamo');
    [[pv, 'P″'], [po, 'P′'], [pl, 'P‴']].forEach(([q, nome]) => {
      h += `<circle class="vertice is-scelto" cx="${n1(q[0])}" cy="${n1(q[1])}" r="${n1(0.17)}"/>` + scritta([q[0] + 0.25, q[1] - 0.25], nome, 'nome-punto');
    });
  }

  const svg = $('#svgViste');
  svg.setAttribute('viewBox', vb.testo);
  svg.innerHTML = h;
}

/* ── testi: regole del tipo, punto seguito ── */
function scriviRegole() {
  const T = TIPI[stato.tipo];
  $('#regoleRighe').innerHTML = ['x', 'y', 'z'].map(a =>
    `<tr><th scope="row"><span class="asse-nome" style="color:${COLORE[a]}">${a}</span> ${NOME_ASSE[a]}</th><td>${T[a].dove}</td><td>${T[a].misura}</td></tr>`).join('');
  $('#regoleNota').innerHTML = `<b>${T.squadra}.</b> Guardi il solido ${T.guardi}. ${T.vera}`;
  document.querySelectorAll('#sceltaTipo .chip').forEach(b => {
    const attivo = b.dataset.tipo === stato.tipo;
    b.classList.toggle('is-active', attivo);
    b.setAttribute('aria-pressed', String(attivo));
  });
}

function scriviPunto() {
  const { P, veri } = scena;
  const T = TIPI[stato.tipo];
  const testo = $('#puntoTesto');
  $('#puntoVia').disabled = stato.punto === null;
  $('#puntoPrima').disabled = $('#puntoDopo').disabled = veri.length === 0;
  if (veri.length === 0) { testo.textContent = 'Questo solido non ha vertici: per disegnarlo si parte dalla scatola.'; return; }
  if (stato.punto === null) { testo.textContent = 'Tocca un vertice del solido, oppure usa le frecce.'; return; }
  const p = P[veri[stato.punto]];
  const passo = (a, v) => {
    const sulFoglio = v * T[a].k;
    const quanto = T[a].k === 1 || v === 0 ? cmTesto(v) : `${cmTesto(v)}, che sul foglio diventano ${cmTesto(sulFoglio)}`;
    return `<li><span class="asse-nome" style="color:${COLORE[a]}">${a}</span> ${NOME_ASSE[a]}: ${quanto}</li>`;
  };
  testo.innerHTML = `Il punto P si trova partendo da O, una misura alla volta:<ol class="punto__passi">${passo('x', p.x)}${passo('y', p.y)}${passo('z', p.z)}</ol>` +
    'Lungo x, poi in parallelo all’asse y, poi in verticale. Nelle tre viste è P′ nel PO, P″ nel PV e P‴ nel PL.';
}

/* ── comandi ── */
function costruisciMenu() {
  const menu = $('#sceltaSolido');
  const voci = CATALOGO.map(c => [c.id, c.nome]);
  if (!voce(stato.id)) voci.push([stato.id, SOLIDI[stato.id]().nome]);
  menu.innerHTML = voci.map(([id, nome]) => `<option value="${id}"${id === stato.id ? ' selected' : ''}>${nome}</option>`).join('');
}

function costruisciMisure() {
  const cont = $('#misureSolido');
  const c = voce(stato.id);
  if (!c) { cont.innerHTML = '<p class="misure__vuoto">Questo solido si apre con le misure date dall’indirizzo.</p>'; return; }
  cont.innerHTML = c.misure.map(m => {
    const v = m.aUI ? m.aUI(stato.cm[m.k]) : stato.cm[m.k];
    const valore = Math.round(v * 2) / 2;
    return `<label class="misura"><span class="misura__et">${m.et}</span>` +
      `<input type="range" data-m="${m.k}" min="${m.min}" max="${m.max}" step="0.5" value="${valore}">` +
      `<output class="mono" data-o="${m.k}">${cmTesto(valore)}</output></label>`;
  }).join('');
  cont.querySelectorAll('input[data-m]').forEach(inp => {
    inp.addEventListener('input', () => {
      const m = c.misure.find(x => x.k === inp.dataset.m), v = parseFloat(inp.value);
      stato.cm[m.k] = m.daUI ? m.daUI(v) : v;
      cont.querySelector(`output[data-o="${m.k}"]`).textContent = cmTesto(v);
      stato.punto = null;
      aggiorna();
    });
  });
}

function aggiorna() {
  preparaScena();
  disegnaFoglio();
  disegnaViste();
  scriviRegole();
  scriviPunto();
}

$('#sceltaTipo').addEventListener('click', e => {
  const b = e.target.closest('[data-tipo]');
  if (!b) return;
  stato.tipo = b.dataset.tipo;
  aggiorna();
});
$('#sceltaSolido').addEventListener('change', e => {
  impostaSolido(e.target.value, false);
  costruisciMisure();
  aggiorna();
});
$('#tastoGira').addEventListener('click', () => { stato.alfa = (stato.alfa + 90) % 360; stato.punto = null; aggiorna(); });
$('#tastoPartenza').addEventListener('click', () => { stato.alfa = stato.partenza.alfa; stato.beta = stato.partenza.beta; stato.punto = null; aggiorna(); });
$('#interruttori').addEventListener('change', e => {
  const k = e.target.dataset.mostra;
  if (!k) return;
  stato.mostra[k] = e.target.checked;
  disegnaFoglio();
});
$('#svgFoglio').addEventListener('click', e => {
  const v = e.target.closest('[data-v]');
  if (!v) return;
  const i = Number(v.dataset.v);
  stato.punto = stato.punto === i ? null : i;
  aggiorna();
});
const scorri = passo => {
  const n = scena.veri.length;
  if (!n) return;
  stato.punto = stato.punto === null ? (passo > 0 ? 0 : n - 1) : (stato.punto + passo + n) % n;
  aggiorna();
};
$('#puntoPrima').addEventListener('click', () => scorri(-1));
$('#puntoDopo').addEventListener('click', () => scorri(1));
$('#puntoVia').addEventListener('click', () => { stato.punto = null; aggiorna(); });

/* ── modalità esercizio: solido e misure bloccati, riquadro con la consegna ── */
if (esercizio) {
  $('#gruppoSolido').hidden = true;
  const titolo = PAR.get('titolo'), misure = PAR.get('misure');
  if (titolo || misure) {
    $('#esercizioBox').hidden = false;
    $('#esercizioTitolo').textContent = titolo || SOLIDI[stato.id]().nome;
    $('#esercizioMisure').textContent = misure || '';
  }
} else {
  costruisciMenu();
  costruisciMisure();
}

/* ── telefono: «Segui un punto» subito sotto il disegno, le regole chiuse (si aprono con un tocco) ── */
let regoleChiuse = false;
const sistemaTelefono = () => {
  const box = $('#puntoBox');
  if (telefono.matches) {
    $('.pannello--foglio').append(box);
    if (!regoleChiuse) { $('#regole').open = false; regoleChiuse = true; }
  } else {
    $('.pannello--viste').append(box);
  }
  if (scena) disegnaFoglio();
};
sistemaTelefono();
telefono.addEventListener('change', sistemaTelefono);

aggiorna();
