/* Assonometro — geometria (nessun accesso alla pagina: si può provare anche fuori dal browser).

   Assi del libro, in centimetri, con l'origine O sul vertice della scatola davanti, a sinistra, in basso:
     x = larghezza, verso destra      y = profondità, verso dietro      z = altezza, verso l'alto
   Sono le regole del testo di MC-DIS-2-02 e delle tavole GeoGebra (costruzioni-base/tavole-ass.js).

   Un'assonometria è una proiezione parallela: ogni asse del solido diventa una direzione del foglio
   (un angolo dalla linea orizzontale) e ha un rapporto di riduzione. Da qui si ricava anche la direzione
   da cui si guarda, che serve a decidere quali spigoli sono in vista. */

const RAD = Math.PI / 180;

export const TIPI = {
  cavaliera: {
    nome: 'Cavaliera',
    x: { gradi: 0, k: 1, dove: 'orizzontale, verso destra', misura: 'vera' },
    y: { gradi: 45, k: 0.5, dove: 'a 45°, verso destra', misura: 'a metà' },
    z: { gradi: 90, k: 1, dove: 'verticale', misura: 'vera' },
    squadra: 'Squadra a 45°',
    guardi: 'di fronte, un po’ da destra e dall’alto',
    vera: 'Resta vera la faccia di fronte: è il prospetto.',
  },
  isometrica: {
    nome: 'Isometrica',
    x: { gradi: 30, k: 1, dove: 'a 30°, verso destra', misura: 'vera' },
    y: { gradi: 150, k: 1, dove: 'a 30°, verso sinistra', misura: 'vera' },
    z: { gradi: 90, k: 1, dove: 'verticale', misura: 'vera' },
    squadra: 'Squadra a 30° e 60°',
    guardi: 'di spigolo, tanto di fronte quanto da sinistra, e dall’alto',
    vera: 'Nessuna faccia resta vera: i rettangoli diventano parallelogrammi.',
  },
  monometrica: {
    nome: 'Monometrica',
    x: { gradi: 30, k: 1, dove: 'a 30°, verso destra', misura: 'vera' },
    y: { gradi: 120, k: 1, dove: 'a 60°, verso sinistra', misura: 'vera' },
    z: { gradi: 90, k: 1, dove: 'verticale', misura: 'vera' },
    squadra: 'Squadra a 30° e 60°',
    guardi: 'di fronte, da sinistra e molto dall’alto',
    vera: 'Resta vera la base: è la pianta, girata di 30°.',
  },
};

const V = (x, y, z) => ({ x, y, z });
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

/** Versore sul foglio di un asse (y del foglio verso l'alto). */
export const versore = (tipo, asse) => {
  const g = TIPI[tipo][asse].gradi * RAD;
  return [Math.cos(g), Math.sin(g)];
};

/**
 * Le quattro viste, ognuna con la direzione da cui si guarda (`v`, verso l'osservatore) e la mappa `m`
 * dal punto del solido al foglio. Qui il foglio ha la y verso il basso, come in SVG.
 */
export function vistaAssonometrica(tipo) {
  const T = TIPI[tipo];
  const ex = versore(tipo, 'x'), ey = versore(tipo, 'y'), ez = versore(tipo, 'z');
  const a = [ex[0] * T.x.k, ey[0] * T.y.k, ez[0] * T.z.k];     // riga delle ascisse
  const b = [ex[1] * T.x.k, ey[1] * T.y.k, ez[1] * T.z.k];     // riga delle ordinate
  // direzione che si proietta in un punto: prodotto vettoriale delle due righe, girata verso l'alto
  let d = V(a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]);
  if (d.z < 0) d = V(-d.x, -d.y, -d.z);
  const l = Math.hypot(d.x, d.y, d.z);
  return {
    v: V(d.x / l, d.y / l, d.z / l),
    m: p => [a[0] * p.x + a[1] * p.y + a[2] * p.z, -(b[0] * p.x + b[1] * p.y + b[2] * p.z)],
  };
}

/** Le tre viste delle proiezioni ortogonali, metodo europeo: il PL mostra il solido visto da sinistra. */
export const VISTE_PO = {
  PV: { v: V(0, -1, 0), m: p => [p.x, -p.z] },
  PO: { v: V(0, 0, 1), m: p => [p.x, -p.y] },       // il davanti del solido cade in basso, lontano dalla LT
  PL: { v: V(-1, 0, 0), m: p => [-p.y, -p.z] },     // il davanti del solido cade a destra
};

/**
 * Porta un solido del proiettore (X destra, Y alto, Z verso chi guarda) negli assi del libro, dopo la
 * rotazione di partenza: alfa attorno alla verticale, beta di inclinazione (in gradi, come nel proiettore).
 * Dà { P: vertici, N: normali delle facce, scatola: { L, P, H } } con il solido appoggiato in O.
 */
export function posiziona(solido, alfa = 0, beta = 0) {
  const cy = Math.cos(alfa * RAD), sy = Math.sin(alfa * RAD);
  const cp = Math.cos(beta * RAD), sp = Math.sin(beta * RAD);
  const ruota = p => {                                         // R = Rx(beta) · Ry(alfa), come nel proiettore
    const x1 = p.x * cy + p.z * sy;
    const z1 = -p.x * sy + p.z * cy;
    return V(x1, p.y * cp - z1 * sp, p.y * sp + z1 * cp);
  };
  const W = solido.verts.map(ruota);
  const min = k => Math.min(...W.map(p => p[k])), max = k => Math.max(...W.map(p => p[k]));
  const x0 = min('x'), y0 = min('y'), z1 = max('z');
  const pulito = n => (Math.abs(n) < 1e-9 ? 0 : n);
  const P = W.map(p => V(pulito(p.x - x0), pulito(z1 - p.z), pulito(p.y - y0)));
  const N = solido.faces.map(f => { const n = ruota(f.n); return V(n.x, -n.z, n.y); });
  return { P, N, scatola: { L: max('x') - x0, P: z1 - min('z'), H: max('y') - y0 } };
}

const EPS = 1e-4;

/**
 * Spigoli in vista e nascosti di un solido in una vista (stesso metodo del proiettore ortogonale):
 * uno spigolo è nascosto dove una faccia rivolta verso chi guarda lo copre e gli sta davanti.
 * Dà { visibili, nascosti } come elenchi di tratti [x1, y1, x2, y2] sul foglio e { facce } in vista,
 * dalla più lontana alla più vicina.
 */
export function proietta(solido, P, N, vista) {
  const { v, m } = vista;
  const Q = P.map(m);
  const prof = P.map(p => dot(p, v));
  const fronte = N.map(n => dot(n, v) > EPS);
  const tris = [];
  solido.faces.forEach((f, fi) => { if (fronte[fi]) f.tri.forEach(t => tris.push({ t, fi })); });

  const coperto = (p, esclusi) => {
    const [px, py] = m(p);
    const dP = dot(p, v);
    for (const { t, fi } of tris) {
      if (esclusi.has(fi)) continue;
      const [ax, ay] = Q[t[0]], [bx, by] = Q[t[1]], [cx, cy] = Q[t[2]];
      const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
      const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
      const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
      if (((d1 < -EPS) || (d2 < -EPS) || (d3 < -EPS)) && ((d1 > EPS) || (d2 > EPS) || (d3 > EPS))) continue;
      const den = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
      if (Math.abs(den) < 1e-9) continue;
      const w1 = ((by - cy) * (px - cx) + (cx - bx) * (py - cy)) / den;
      const w2 = ((cy - ay) * (px - cx) + (ax - cx) * (py - cy)) / den;
      const dT = w1 * prof[t[0]] + w2 * prof[t[1]] + (1 - w1 - w2) * prof[t[2]];
      if (dT > dP + 1e-3) return true;
    }
    return false;
  };

  /** Tratto qualsiasi (da A a B, nello spazio) diviso nelle parti in vista e in quelle coperte dal solido. */
  const spezza = (A, B) => {
    const [x1, y1] = m(A), [x2, y2] = m(B);
    const lungo = t => V(A.x + (B.x - A.x) * t, A.y + (B.y - A.y) * t, A.z + (B.z - A.z) * t);
    const stato = t => coperto(lungo(t), new Set());
    const parti = { visibili: [], nascosti: [] };
    const tratto = (da, fino, nascosto) => {
      if (fino - da < 1e-6) return;
      parti[nascosto ? 'nascosti' : 'visibili'].push([x1 + (x2 - x1) * da, y1 + (y2 - y1) * da, x1 + (x2 - x1) * fino, y1 + (y2 - y1) * fino]);
    };
    const N = 24;
    let inizio = 0, tPrec = 0.5 / N, sPrec = stato(tPrec);
    for (let i = 1; i < N; i++) {
      const t = (i + 0.5) / N, s = stato(t);
      if (s !== sPrec) {
        let lo = tPrec, hi = t;
        for (let j = 0; j < 20; j++) { const mid = (lo + hi) / 2; if (stato(mid) === sPrec) lo = mid; else hi = mid; }
        tratto(inizio, (lo + hi) / 2, sPrec);
        inizio = (lo + hi) / 2; sPrec = s;
      }
      tPrec = t;
    }
    tratto(inizio, 1, sPrec);
    return parti;
  };

  const visibili = [], nascosti = [];
  const CAMPIONI = 16;
  solido.edges.forEach(e => {
    const fA = e.facce[0], fB = e.facce[1];
    const frA = fA !== undefined && fronte[fA], frB = fB !== undefined && fronte[fB];
    if (e.tipo === 'liscio' && frA === frB) return;            // generatrice che non sta sul contorno
    const A = P[e.a], B = P[e.b];
    const [x1, y1] = Q[e.a], [x2, y2] = Q[e.b];
    if (Math.hypot(x2 - x1, y2 - y1) < 1e-6) return;           // spigolo visto di punta
    if (!frA && !frB) { nascosti.push([x1, y1, x2, y2]); return; }
    const esclusi = new Set(e.facce);
    const lungo = t => V(A.x + (B.x - A.x) * t, A.y + (B.y - A.y) * t, A.z + (B.z - A.z) * t);
    const stato = t => coperto(lungo(t), esclusi);
    const tratto = (da, fino, nascosto) => {
      if (fino - da < 1e-6) return;
      (nascosto ? nascosti : visibili).push([x1 + (x2 - x1) * da, y1 + (y2 - y1) * da, x1 + (x2 - x1) * fino, y1 + (y2 - y1) * fino]);
    };
    // campioni al centro di ogni tratto; dove lo stato cambia si cerca il punto esatto per bisezione
    let inizio = 0, tPrec = 0.5 / CAMPIONI, sPrec = stato(tPrec);
    for (let i = 1; i < CAMPIONI; i++) {
      const t = (i + 0.5) / CAMPIONI, s = stato(t);
      if (s !== sPrec) {
        let lo = tPrec, hi = t;
        for (let j = 0; j < 20; j++) { const mid = (lo + hi) / 2; if (stato(mid) === sPrec) lo = mid; else hi = mid; }
        const cambio = (lo + hi) / 2;
        tratto(inizio, cambio, sPrec);
        inizio = cambio; sPrec = s;
      }
      tPrec = t;
    }
    tratto(inizio, 1, sPrec);
  });

  const facce = solido.faces
    .map((f, fi) => ({ fi, n: N[fi], punti: f.idx.map(i => Q[i]), d: f.idx.reduce((s, i) => s + prof[i], 0) / f.idx.length }))
    .filter(o => fronte[o.fi])
    .sort((p, q) => p.d - q.d);
  return { visibili, nascosti, facce, spezza };
}

/** Piano delle proiezioni a cui una faccia è parallela: 'PV' (di fronte o dietro), 'PO' (sopra o sotto), 'PL' (di fianco); altrimenti null. */
export function pianoDellaFaccia(n) {
  if (Math.abs(n.y) > 0.999) return 'PV';
  if (Math.abs(n.z) > 0.999) return 'PO';
  if (Math.abs(n.x) > 0.999) return 'PL';
  return null;
}

/** Vertici «veri» di un solido: quelli dove si incontrano almeno tre spigoli vivi, più la punta di un cono. */
export function verticiVeri(solido) {
  const duri = solido.verts.map(() => 0), tutti = solido.verts.map(() => 0);
  solido.edges.forEach(e => {
    tutti[e.a] += 1; tutti[e.b] += 1;
    if (e.tipo === 'duro') { duri[e.a] += 1; duri[e.b] += 1; }
  });
  return solido.verts.map((_, i) => i).filter(i => duri[i] >= 3 || (duri[i] === 0 && tutti[i] >= 6));
}
