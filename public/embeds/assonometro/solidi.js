/* Solidi dell'Assonometro — COPIA GENERATA, non modificare a mano.
   È la fabbrica dei solidi del proiettore ortogonale (public/embeds/proiettore/proiettore.js),
   copiata da scripts/assonometro/estrai-solidi.py. Stessi id e stesse chiavi delle misure.
   Assi dei solidi: X = larghezza (verso destra), Y = altezza (verso l'alto), Z = profondità (verso chi guarda). */
const V3 = (x, y, z) => ({ x, y, z });
const sub = (a, b) => V3(a.x - b.x, a.y - b.y, a.z - b.z);
const cross = (a, b) => V3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const norm = a => { const l = Math.hypot(a.x, a.y, a.z) || 1; return V3(a.x / l, a.y / l, a.z / l); };

/* ── fabbrica di solidi ── */
function prismaDaProfilo(profilo, prof) {
  // profilo: [[x,y]...] antiorario nel piano XY; estrusione lungo Z
  const n = profilo.length, h = prof / 2;
  const verts = [];
  profilo.forEach(([x, y]) => verts.push(V3(x, y,  h)));  // davanti (z+)
  profilo.forEach(([x, y]) => verts.push(V3(x, y, -h)));  // dietro
  const faces = [];
  faces.push({ idx: Array.from({ length: n }, (_, i) => i) });                     // davanti, antioraria vista da z+
  faces.push({ idx: Array.from({ length: n }, (_, i) => n + (n - 1 - i)) });       // dietro
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    faces.push({ idx: [i, n + i, n + j, j] });                                     // laterali
  }
  const edges = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    edges.push({ a: i, b: j, tipo: 'duro' });
    edges.push({ a: n + i, b: n + j, tipo: 'duro' });
    edges.push({ a: i, b: n + i, tipo: 'duro' });
  }
  return { verts, edges, faces };
}

function cilindroForato(rEst, rInt, alt, seg = 28) {
  const h = alt / 2, verts = [], edges = [], faces = [];
  const anello = (r, z) => {
    const base = verts.length;
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      verts.push(V3(Math.cos(a) * r, Math.sin(a) * r, z));
    }
    return base;
  };
  // asse del cilindro lungo Y (in piedi): costruiamo su XZ e poi scambiamo
  const eT = anello(rEst,  h), eB = anello(rEst, -h);
  const iT = anello(rInt,  h), iB = anello(rInt, -h);
  const giro = (b, i) => b + ((i % seg) + seg) % seg;

  for (let i = 0; i < seg; i++) {
    const j = i + 1;
    faces.push({ idx: [giro(eT,i), giro(eB,i), giro(eB,j), giro(eT,j)] });        // parete esterna (normale out)
    faces.push({ idx: [giro(iT,i), giro(iT,j), giro(iB,j), giro(iB,i)] });        // parete interna (normale verso l'asse)
    faces.push({ idx: [giro(eT,i), giro(eT,j), giro(iT,j), giro(iT,i)] });        // corona sopra (z+)
    faces.push({ idx: [giro(eB,i), giro(iB,i), giro(iB,j), giro(eB,j)] });        // corona sotto
    edges.push({ a: giro(eT,i), b: giro(eT,j), tipo: 'duro'    });                // orli
    edges.push({ a: giro(eB,i), b: giro(eB,j), tipo: 'duro'    });
    edges.push({ a: giro(iT,i), b: giro(iT,j), tipo: 'duro'    });
    edges.push({ a: giro(iB,i), b: giro(iB,j), tipo: 'duro'    });
    edges.push({ a: giro(eT,i), b: giro(eB,i), tipo: 'liscio'  });                // generatrici
    edges.push({ a: giro(iT,i), b: giro(iB,i), tipo: 'liscio'  });
  }
  // raddrizza: l'asse era Z → portalo su Y (scambia y↔z, poi inverti z per mantenere l'orientamento)
  const s = { verts: verts.map(v => V3(v.x, v.z, -v.y)), edges, faces };
  return s;
}

function piramideQuadrata(lato = 2.5, alt = 2.5) {
  const l = lato / 2, h = alt / 2;
  // base visti dall'alto in senso orario => normale della base verso il basso
  const v = [
    V3(-l, -h, -l), V3(l, -h, -l), V3(l, -h, l), V3(-l, -h, l),   // base 0..3
    V3(0, h, 0),                                                   // apice 4
  ];
  const faces = [
    { idx: [0, 1, 2, 3] },          // base (normale -Y)
    { idx: [1, 0, 4] },             // laterali (normali uscenti)
    { idx: [2, 1, 4] },
    { idx: [3, 2, 4] },
    { idx: [0, 3, 4] },
  ];
  const edges = [
    [0,1],[1,2],[2,3],[3,0],
    [0,4],[1,4],[2,4],[3,4],
  ].map(([a, b]) => ({ a, b, tipo: 'duro' }));
  return { verts: v, edges, faces };
}

function prismaEsagonale(r = 1.4, alt = 2.3) {
  // esagono antiorario in XY, estrusione lungo Z, poi asse portato su Y
  const profilo = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;   // lato piatto verso il fronte
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  const s = prismaDaProfilo(profilo, alt);
  s.verts = s.verts.map(v => V3(v.x, v.z, -v.y));
  return s;
}

function compenetrazione() {
  // parallelepipedo basso attraversato da una piramide a base quadrata:
  // la classica tavola dei solidi incastrati in proiezione ortogonale
  const L = 3.0, H = 1.05, P = 1.7;                  // prisma
  const l = 0.85, hp = 2.75;                          // piramide (semilato, altezza)
  const y0 = -1.15;                                   // quota comune di appoggio
  const v = [
    // prisma 0..7
    V3(-L/2, y0,      P/2), V3( L/2, y0,      P/2),
    V3( L/2, y0 + H,  P/2), V3(-L/2, y0 + H,  P/2),
    V3(-L/2, y0,     -P/2), V3( L/2, y0,     -P/2),
    V3( L/2, y0 + H, -P/2), V3(-L/2, y0 + H, -P/2),
    // piramide 8..12 (base sullo stesso piano d'appoggio)
    V3(-l, y0, -l), V3(l, y0, -l), V3(l, y0, l), V3(-l, y0, l),
    V3(0, y0 + hp, 0),
  ];
  const faces = [
    { idx: [0, 1, 2, 3] },          // prisma: fronte (z+)
    { idx: [5, 4, 7, 6] },          // retro
    { idx: [4, 0, 3, 7] },          // fianco sx
    { idx: [1, 5, 6, 2] },          // fianco dx
    { idx: [4, 5, 1, 0] },          // fondo
    { idx: [3, 2, 6, 7] },          // sopra
    { idx: [8, 9, 10, 11] },        // piramide: base (normale -Y)
    { idx: [9, 8, 12] },            // laterali uscenti
    { idx: [10, 9, 12] },
    { idx: [11, 10, 12] },
    { idx: [8, 11, 12] },
  ];
  const edges = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
    [8,9],[9,10],[10,11],[11,8],
    [8,12],[9,12],[10,12],[11,12],
  ].map(([a, b]) => ({ a, b, tipo: 'duro' }));
  return { verts: v, edges, faces };
}

function parallelepipedoRett(L = 3.0, H = 2.0, P = 1.6) {
  // rettangolo LxH nel piano XY (antiorario), estrusione P lungo Z
  const l = L / 2, a = H / 2;
  return prismaDaProfilo([[-l, -a], [l, -a], [l, a], [-l, a]], P);
}

function cubo(lato = 2.2) {
  return parallelepipedoRett(lato, lato, lato);
}

function prismaTriangolare(r = 1.7, alt = 2.4) {
  // triangolo equilatero antiorario in XY, poi asse portato su Y
  const profilo = [30, 150, 270].map(g => {
    const a = g * Math.PI / 180;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  const s = prismaDaProfilo(profilo, alt);
  s.verts = s.verts.map(v => V3(v.x, v.z, -v.y));
  return s;
}

function piramideRegolare(nLati, r, alt) {
  // base regolare su P.O. (y = -alt/2), apice sull'asse Y
  const h = alt / 2, verts = [], edges = [], faces = [];
  for (let i = 0; i < nLati; i++) {
    const a = (i / nLati) * Math.PI * 2 + Math.PI / 2;
    verts.push(V3(Math.cos(a) * r, -h, Math.sin(a) * r));
  }
  const apice = verts.length;
  verts.push(V3(0, h, 0));
  faces.push({ idx: Array.from({ length: nLati }, (_, i) => i) });   // base (normale -Y)
  for (let i = 0; i < nLati; i++) {
    const j = (i + 1) % nLati;
    faces.push({ idx: [j, i, apice] });                              // laterali uscenti
    edges.push({ a: i, b: j, tipo: 'duro' });
    edges.push({ a: i, b: apice, tipo: 'duro' });
  }
  return { verts, edges, faces };
}

function piramideTriangolare(r = 1.7, alt = 2.5) {
  return piramideRegolare(3, r, alt);
}

function cilindroPieno(r = 1.3, alt = 2.4, seg = 28) {
  // cerchio a 'seg' lati estruso, generatrici lisce, asse portato su Y
  const profilo = Array.from({ length: seg }, (_, i) => {
    const a = (i / seg) * Math.PI * 2;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  const s = prismaDaProfilo(profilo, alt);
  s.edges.forEach(e => {
    if ((e.a < seg) !== (e.b < seg)) e.tipo = 'liscio';              // generatrici
  });
  s.verts = s.verts.map(v => V3(v.x, v.z, -v.y));
  return s;
}

function cono(r = 1.5, alt = 2.6, seg = 28) {
  const h = alt / 2, verts = [], edges = [], faces = [];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    verts.push(V3(Math.cos(a) * r, -h, Math.sin(a) * r));
  }
  const apice = verts.length;
  verts.push(V3(0, h, 0));
  faces.push({ idx: Array.from({ length: seg }, (_, i) => i) });     // base (normale -Y)
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg;
    faces.push({ idx: [j, i, apice] });                              // falda laterale
    edges.push({ a: i, b: j, tipo: 'duro' });                        // bordo base
    edges.push({ a: i, b: apice, tipo: 'liscio' });                  // generatrici
  }
  return { verts, edges, faces };
}

function sfera(r = 1.5, mer = 20, par = 11) {
  const verts = [], edges = [], faces = [];
  const nord = 0, sud = 1;
  verts.push(V3(0, r, 0), V3(0, -r, 0));
  const anelli = [];
  for (let p = 1; p <= par; p++) {
    const phi = (p / (par + 1)) * Math.PI;             // 0=polo nord
    const y = Math.cos(phi) * r, rr = Math.sin(phi) * r;
    const base = verts.length; anelli.push(base);
    for (let m = 0; m < mer; m++) {
      const a = (m / mer) * Math.PI * 2;
      verts.push(V3(Math.cos(a) * rr, y, Math.sin(a) * rr));
    }
  }
  const idx = (p, m) => anelli[p] + ((m % mer) + mer) % mer;
  // calotte ai poli (winding uscente) + fasce quadrangolari
  for (let m = 0; m < mer; m++) {
    faces.push({ idx: [nord, idx(0, m + 1), idx(0, m)] });
    faces.push({ idx: [sud, idx(par - 1, m), idx(par - 1, m + 1)] });
    edges.push({ a: nord, b: idx(0, m), tipo: 'liscio' });
    edges.push({ a: sud, b: idx(par - 1, m), tipo: 'liscio' });
  }
  for (let p = 0; p < par - 1; p++) {
    for (let m = 0; m < mer; m++) {
      faces.push({ idx: [idx(p, m), idx(p, m + 1), idx(p + 1, m + 1), idx(p + 1, m)] });
      edges.push({ a: idx(p, m), b: idx(p + 1, m), tipo: 'liscio' });   // meridiani
    }
  }
  for (let p = 0; p < par; p++)
    for (let m = 0; m < mer; m++)
      edges.push({ a: idx(p, m), b: idx(p, m + 1), tipo: 'liscio' });   // paralleli
  return { verts, edges, faces };
}

function casetta() {
  // prisma con tetto a due falde
  const L = 2.6, P = 1.9, Hm = 1.2, Ht = 2.05;
  const v = [
    V3(-L/2, -Hm/2*1.4,  P/2), V3( L/2, -Hm/2*1.4,  P/2),
    V3( L/2,  Hm-Hm/2*1.4,  P/2), V3(-L/2,  Hm-Hm/2*1.4,  P/2),
    V3(-L/2, -Hm/2*1.4, -P/2), V3( L/2, -Hm/2*1.4, -P/2),
    V3( L/2,  Hm-Hm/2*1.4, -P/2), V3(-L/2,  Hm-Hm/2*1.4, -P/2),
    V3(0,  Ht-Hm/2*1.4,  P/2), V3(0,  Ht-Hm/2*1.4, -P/2),
  ];
  const faces = [
    { idx: [0, 1, 2, 8, 3] },        // fronte (z+)
    { idx: [5, 4, 7, 9, 6] },        // retro
    { idx: [0, 3, 7, 4] },           // fianco sinistro
    { idx: [1, 5, 6, 2] },           // fianco destro
    { idx: [0, 4, 5, 1] },           // fondo
    { idx: [3, 8, 9, 7] },           // falda sinistra
    { idx: [8, 2, 6, 9] },           // falda destra
  ];
  const edges = [
    [0,1],[1,2],[2,8],[8,3],[3,0],
    [4,5],[5,6],[6,9],[9,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],[8,9],
  ].map(([a, b]) => ({ a, b, tipo: 'duro' }));
  return { verts: v, edges, faces };
}

/* LIBRO · solidi sovrapposti: le parti restano separate (ognuna con le sue facce e i suoi spigoli) */
function unisciSolidi(...parti) {
  const verts = [], edges = [], faces = [];
  parti.forEach(p => {
    const o = verts.length;
    verts.push(...p.verts);
    p.edges.forEach(e => edges.push({ ...e, a: e.a + o, b: e.b + o }));
    p.faces.forEach(f => faces.push({ ...f, idx: f.idx.map(i => i + o) }));
  });
  return { verts, edges, faces };
}
const spostaSolido = (s, dx, dy, dz) => { s.verts = s.verts.map(v => V3(v.x + dx, v.y + dy, v.z + dz)); return s; };

/* LIBRO · taglio di un solido convesso con il piano n·p = d: resta la parte con n·p <= d.
   La faccia nuova (la sezione) ha f.sezione = true e si colora a parte. Il piano non deve passare per un vertice. */
function tagliaSolido(s, n, d) {
  const lato = s.verts.map(v => dot(n, v) - d);
  const dentro = i => lato[i] <= 0;
  const verts = s.verts.slice();
  const tagli = new Map();
  const punto = (a, b) => {
    const k = a < b ? a + '_' + b : b + '_' + a;
    if (!tagli.has(k)) {
      const t = lato[a] / (lato[a] - lato[b]), A = s.verts[a], B = s.verts[b];
      verts.push(V3(A.x + (B.x - A.x) * t, A.y + (B.y - A.y) * t, A.z + (B.z - A.z) * t));
      tagli.set(k, verts.length - 1);
    }
    return tagli.get(k);
  };
  const faces = [];
  s.faces.forEach(f => {
    const idx = [];
    f.idx.forEach((a, i) => {
      const b = f.idx[(i + 1) % f.idx.length];
      if (dentro(a)) idx.push(a);
      if (dentro(a) !== dentro(b)) idx.push(punto(a, b));
    });
    if (idx.length >= 3) faces.push({ idx });
  });
  const edges = [];
  s.edges.forEach(e => {
    const da = dentro(e.a), db = dentro(e.b);
    if (da && db) edges.push({ a: e.a, b: e.b, tipo: e.tipo });
    else if (da !== db) edges.push({ a: da ? e.a : e.b, b: punto(e.a, e.b), tipo: e.tipo });
  });
  // faccia di sezione: punti in ordine antiorario visti dalla parte tolta (normale = n)
  const sez = [...tagli.values()];
  if (sez.length >= 3) {
    const c = sez.reduce((m, i) => V3(m.x + verts[i].x / sez.length, m.y + verts[i].y / sez.length, m.z + verts[i].z / sez.length), V3(0, 0, 0));
    let u = cross(n, V3(0, 0, 1));
    if (Math.hypot(u.x, u.y, u.z) < 1e-6) u = cross(n, V3(1, 0, 0));
    u = norm(u);
    const w = cross(n, u);
    const ang = i => { const q = sub(verts[i], c); return Math.atan2(dot(q, w), dot(q, u)); };
    sez.sort((a, b) => ang(a) - ang(b));
    faces.push({ idx: sez, sezione: true });
    sez.forEach((a, i) => edges.push({ a, b: sez[(i + 1) % sez.length], tipo: 'duro' }));
  }
  // vertici rimasti, numerati da capo
  const usati = new Map();
  const nuovo = i => { if (!usati.has(i)) usati.set(i, usati.size); return usati.get(i); };
  faces.forEach(f => { f.idx = f.idx.map(nuovo); });
  edges.forEach(e => { e.a = nuovo(e.a); e.b = nuovo(e.b); });
  const vv = [];
  usati.forEach((j, i) => { vv[j] = verts[i]; });
  return { verts: vv, edges, faces };
}

/* piano perpendicolare al PV che passa per il punto dell'asse a quota q dalla base e sale verso destra di ang gradi */
const pianoDiTaglio = (alt, q, ang) => {
  const a = (ang || 0) * Math.PI / 180;
  const n = V3(-Math.sin(a), Math.cos(a), 0);
  return { n, d: Math.cos(a) * (q - alt / 2) };
};

function prismaEsagonaleVertici(r, alt) {
  // esagono con due vertici sull'asse x: di fronte si vedono due lati paralleli alla LT
  const profilo = Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return [Math.cos(a) * r, Math.sin(a) * r]; });
  const s = prismaDaProfilo(profilo, alt);
  s.verts = s.verts.map(v => V3(v.x, v.z, -v.y));
  return s;
}

function centraSolido(s) {
  let cx = 0, cy = 0, cz = 0;
  s.verts.forEach(v => { cx += v.x; cy += v.y; cz += v.z; });
  cx /= s.verts.length; cy /= s.verts.length; cz /= s.verts.length;
  s.verts = s.verts.map(v => V3(v.x - cx, v.y - cy, v.z - cz));
  return s;
}

const coloreGruppo = g => `hsl(${((g * 137.508) % 360).toFixed(0)}, 62%, 52%)`;

/* Triangolazione per ear clipping: valida anche per facce concave.
   Il ventaglio (idx[0], idx[i], idx[i+1]) e corretto solo per poligoni convessi:
   su una faccia concava genera triangoli che escono dalla sagoma. */
function triangolaFaccia(s, f) {
  const idx = f.idx, n = idx.length;
  const ventaglio = () => {
    const r = [];
    for (let i = 1; i < n - 1; i++) r.push([idx[0], idx[i], idx[i + 1]]);
    return r;
  };
  if (n < 3) return [];
  if (n === 3) return [[idx[0], idx[1], idx[2]]];
  const nn = f.n;
  const ax = Math.abs(nn.x) <= Math.abs(nn.y) && Math.abs(nn.x) <= Math.abs(nn.z) ? V3(1, 0, 0)
           : Math.abs(nn.y) <= Math.abs(nn.z) ? V3(0, 1, 0) : V3(0, 0, 1);
  const u = norm(cross(ax, nn));
  const w = cross(nn, u);            /* (u, w, nn) destrorsa: il poligono e antiorario */
  const P = idx.map(i => ({ x: dot(s.verts[i], u), y: dot(s.verts[i], w) }));
  let area2 = 0;
  for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n]; area2 += a.x * b.y - b.x * a.y; }
  if (area2 <= 0) return ventaglio();   /* orientamento inatteso: non peggioriamo nulla */
  const cr = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const dentro = (a, b, c, q) => cr(a, b, q) >= 0 && cr(b, c, q) >= 0 && cr(c, a, q) >= 0;
  const L = idx.map((_, i) => i);
  const out = [];
  let guardia = 0;
  while (L.length > 3 && guardia++ < 4 * n) {
    let tagliato = false;
    for (let k = 0; k < L.length; k++) {
      const i0 = L[(k - 1 + L.length) % L.length], i1 = L[k], i2 = L[(k + 1) % L.length];
      const A = P[i0], B = P[i1], C = P[i2];
      if (cr(A, B, C) <= 1e-12) continue;            /* vertice riflesso o degenere */
      let libero = true;
      for (const m of L) {
        if (m === i0 || m === i1 || m === i2) continue;
        if (dentro(A, B, C, P[m])) { libero = false; break; }
      }
      if (!libero) continue;
      out.push([idx[i0], idx[i1], idx[i2]]);        /* ordine originale: verso conservato */
      L.splice(k, 1); tagliato = true; break;
    }
    if (!tagliato) break;
  }
  if (L.length === 3) out.push([idx[L[0]], idx[L[1]], idx[L[2]]]);
  return out.length === n - 2 ? out : ventaglio();   /* poligono non semplice (es. corone) */
}

function preparaSolido(s) {
  centraSolido(s);
  // normali (metodo di Newell) + triangolazione a ventaglio
  s.faces.forEach(f => {
    let nx = 0, ny = 0, nz = 0;
    for (let i = 0; i < f.idx.length; i++) {
      const a = s.verts[f.idx[i]], b = s.verts[f.idx[(i + 1) % f.idx.length]];
      nx += (a.y - b.y) * (a.z + b.z);
      ny += (a.z - b.z) * (a.x + b.x);
      nz += (a.x - b.x) * (a.y + b.y);
    }
    f.n = norm(V3(nx, ny, nz));
    f.tri = triangolaFaccia(s, f);
  });
  // adiacenze spigolo→facce
  const chiave = (a, b) => a < b ? `${a}_${b}` : `${b}_${a}`;
  const mappa = new Map();
  s.faces.forEach((f, fi) => {
    for (let i = 0; i < f.idx.length; i++) {
      const k = chiave(f.idx[i], f.idx[(i + 1) % f.idx.length]);
      if (!mappa.has(k)) mappa.set(k, []);
      mappa.get(k).push(fi);
    }
  });
  s.edges.forEach(e => { e.facce = mappa.get(chiave(e.a, e.b)) || []; });
  // gruppi di lisciatura: facce unite da spigoli lisci condividono la superficie
  const padre = s.faces.map((_, i) => i);
  const trova = i => padre[i] === i ? i : (padre[i] = trova(padre[i]));
  s.edges.forEach(e => {
    if (e.tipo !== 'liscio' || e.facce.length < 2) return;
    const a = trova(e.facce[0]), b = trova(e.facce[1]);
    if (a !== b) padre[a] = b;
  });
  const gid = new Map();
  s.faces.forEach((f, i) => {
    const r = trova(i);
    if (!gid.has(r)) gid.set(r, gid.size);
    f.gruppo = gid.get(r);
  });
  s.nGruppi = gid.size;
  // raggio massimo (per la scala comune delle viste)
  s.raggio = Math.max(...s.verts.map(v => Math.hypot(v.x, v.y, v.z)));
  return s;
}

/* ---- misure regolabili per solido: et=etichetta, v=valore standard ---- */
const MISURE = {
  elle:            { larg:{et:'Larghezza',v:3.0,min:1.5,max:4.5,step:0.1}, alt:{et:'Altezza',v:3.0,min:1.5,max:4.5,step:0.1}, prof:{et:'Profondita',v:1.7,min:0.5,max:3.5,step:0.1} },
  scasso:          { larg:{et:'Larghezza',v:3.2,min:1.6,max:4.6,step:0.1}, alt:{et:'Altezza',v:1.9,min:1.0,max:3.2,step:0.1}, prof:{et:'Profondita',v:1.9,min:0.5,max:3.5,step:0.1} },
  cilindro:        { rEst:{et:'Raggio esterno',v:1.18,min:0.6,max:2.2,step:0.02}, rInt:{et:'Raggio foro',v:0.52,min:0.1,max:1.8,step:0.02}, alt:{et:'Altezza',v:2.3,min:0.6,max:4.0,step:0.1} },
  piramide:        { lato:{et:'Lato base',v:2.5,min:1.0,max:4.0,step:0.1}, alt:{et:'Altezza',v:2.5,min:0.8,max:4.5,step:0.1} },
  esagonale:       { r:{et:'Raggio base',v:1.4,min:0.6,max:2.4,step:0.05}, alt:{et:'Altezza',v:2.3,min:0.6,max:4.0,step:0.1} },
  prismatri:       { r:{et:'Raggio base',v:1.7,min:0.8,max:2.6,step:0.05}, alt:{et:'Altezza',v:2.4,min:0.6,max:4.0,step:0.1} },
  parallelepipedo: { L:{et:'Larghezza',v:3.0,min:1.0,max:4.5,step:0.1}, H:{et:'Altezza',v:2.0,min:0.8,max:4.0,step:0.1}, P:{et:'Profondita',v:1.6,min:0.5,max:3.5,step:0.1} },
  cubo:            { lato:{et:'Lato',v:2.2,min:1.0,max:4.0,step:0.1} },
  piramidetri:     { r:{et:'Raggio base',v:1.7,min:0.8,max:2.6,step:0.05}, alt:{et:'Altezza',v:2.5,min:0.8,max:4.5,step:0.1} },
  cilindropieno:   { r:{et:'Raggio',v:1.3,min:0.5,max:2.4,step:0.05}, alt:{et:'Altezza',v:2.4,min:0.6,max:4.0,step:0.1} },
  cono:            { r:{et:'Raggio base',v:1.5,min:0.6,max:2.6,step:0.05}, alt:{et:'Altezza',v:2.6,min:0.8,max:4.5,step:0.1} },
  sfera:           { r:{et:'Raggio',v:1.5,min:0.7,max:2.5,step:0.05} },
  casetta:         {},
  compenetrazione: {},
  /* LIBRO · solidi nuovi (vedi «solidi nuovi» più sotto) */
  cilsupar:        { L:{et:'Larghezza base',v:3.0,min:1.5,max:4.5,step:0.1}, H:{et:'Altezza base',v:1.1,min:0.4,max:2.5,step:0.1}, P:{et:'Profondita base',v:1.9,min:0.8,max:3.5,step:0.1}, r:{et:'Raggio cilindro',v:0.95,min:0.3,max:1.6,step:0.05}, alt:{et:'Altezza cilindro',v:1.9,min:0.5,max:3.5,step:0.1} },
  tetto:           { L:{et:'Larghezza',v:2.3,min:1.2,max:4.0,step:0.1}, H:{et:'Altezza base',v:1.5,min:0.6,max:3.0,step:0.1}, P:{et:'Profondita',v:3.0,min:1.0,max:4.0,step:0.1}, ht:{et:'Altezza tetto',v:1.1,min:0.4,max:2.5,step:0.1} },
  piramidesez:     { lato:{et:'Lato base',v:2.6,min:1.2,max:4.0,step:0.1}, alt:{et:'Altezza',v:3.4,min:1.5,max:4.5,step:0.1}, q:{et:'Quota del piano',v:1.7,min:0.3,max:3.2,step:0.05} },
  esagonalesez:    { r:{et:'Lato base',v:1.2,min:0.6,max:2.0,step:0.05}, alt:{et:'Altezza',v:3.2,min:1.5,max:4.5,step:0.1}, q:{et:'Quota del piano',v:1.6,min:0.5,max:3.0,step:0.05}, ang:{et:'Inclinazione (gradi)',v:30,min:5,max:50,step:5} },
  cilindrosez:     { r:{et:'Raggio',v:1.2,min:0.6,max:2.0,step:0.05}, alt:{et:'Altezza',v:3.2,min:1.5,max:4.5,step:0.1}, q:{et:'Quota del piano',v:1.6,min:0.5,max:3.0,step:0.05}, ang:{et:'Inclinazione (gradi)',v:30,min:5,max:50,step:5} },
};
const misureStandard = id => {
  const d = {}, sch = MISURE[id] || {};
  Object.keys(sch).forEach(k => { d[k] = sch[k].v; });
  return d;
};
const conMisure = (id, fn) => m => fn(Object.assign(misureStandard(id), m || {}));
const PROFILO_ELLE = [[0,0],[3,0],[3,1.15],[1.15,1.15],[1.15,3],[0,3]];
const PROFILO_SCASSO = [[0,0],[3.2,0],[3.2,1.9],[2.25,1.9],[2.25,1.0],[0.95,1.0],[0.95,1.9],[0,1.9]];
const stira = (p, kx, ky) => p.map(q => [q[0] * kx, q[1] * ky]);
const SOLIDI = {
  elle: conMisure('elle', m => {
    /* LIBRO · m.sp arriva solo dall'indirizzo (?sp=): spessore uguale per i due bracci */
    const sp = m.sp > 0 ? Math.min(m.sp, m.larg * 0.9, m.alt * 0.9) : 0;
    const profilo = sp ? [[0, 0], [m.larg, 0], [m.larg, sp], [sp, sp], [sp, m.alt], [0, m.alt]] : stira(PROFILO_ELLE, m.larg / 3.0, m.alt / 3.0);
    const s = prismaDaProfilo(profilo, m.prof); s.nome = 'Blocco a L'; return preparaSolido(s);
  }),
  scasso: conMisure('scasso', m => { const s = prismaDaProfilo(stira(PROFILO_SCASSO, m.larg / 3.2, m.alt / 1.9), m.prof); s.nome = 'Prisma con scasso'; return preparaSolido(s); }),
  cilindro: conMisure('cilindro', m => { const ri = Math.max(0.08, Math.min(m.rInt, m.rEst - 0.12)); const s = cilindroForato(m.rEst, ri, m.alt, 28); s.nome = 'Cilindro forato'; return preparaSolido(s); }),
  casetta: conMisure('casetta', () => { const s = casetta(); s.nome = 'Casetta'; return preparaSolido(s); }),
  piramide: conMisure('piramide', m => { const s = piramideQuadrata(m.lato, m.alt); s.nome = 'Piramide quadrata'; return preparaSolido(s); }),
  esagonale: conMisure('esagonale', m => { const s = prismaEsagonale(m.r, m.alt); s.nome = 'Prisma esagonale'; return preparaSolido(s); }),
  compenetrazione: conMisure('compenetrazione', () => { const s = compenetrazione(); s.nome = 'Compenetrazione'; return preparaSolido(s); }),
  prismatri: conMisure('prismatri', m => { const s = prismaTriangolare(m.r, m.alt); s.nome = 'Prisma triangolare'; return preparaSolido(s); }),
  parallelepipedo: conMisure('parallelepipedo', m => { const s = parallelepipedoRett(m.L, m.H, m.P); s.nome = 'Parallelepipedo'; return preparaSolido(s); }),
  cubo: conMisure('cubo', m => { const s = cubo(m.lato); s.nome = 'Cubo'; return preparaSolido(s); }),
  piramidetri: conMisure('piramidetri', m => { const s = piramideTriangolare(m.r, m.alt); s.nome = 'Piramide triangolare'; return preparaSolido(s); }),
  cilindropieno: conMisure('cilindropieno', m => { const s = cilindroPieno(m.r, m.alt, 28); s.nome = 'Cilindro'; return preparaSolido(s); }),
  cono: conMisure('cono', m => { const s = cono(m.r, m.alt, 28); s.nome = 'Cono'; return preparaSolido(s); }),
  sfera: conMisure('sfera', m => { const s = sfera(m.r, 20, 11); s.nome = 'Sfera'; return preparaSolido(s); }),
  /* LIBRO · solidi nuovi */
  cilsupar: conMisure('cilsupar', m => {
    const s = unisciSolidi(spostaSolido(parallelepipedoRett(m.L, m.H, m.P), 0, m.H / 2, 0), spostaSolido(cilindroPieno(m.r, m.alt, 28), 0, m.H + m.alt / 2, 0));
    s.nome = 'Cilindro su parallelepipedo'; return preparaSolido(s);
  }),
  tetto: conMisure('tetto', m => {
    const tetto = prismaDaProfilo([[-m.L / 2, m.H], [m.L / 2, m.H], [0, m.H + m.ht]], m.P);
    const s = unisciSolidi(spostaSolido(parallelepipedoRett(m.L, m.H, m.P), 0, m.H / 2, 0), tetto);
    s.nome = 'Prisma triangolare su parallelepipedo'; return preparaSolido(s);
  }),
  piramidesez: conMisure('piramidesez', m => {
    const p = pianoDiTaglio(m.alt, m.q, 0);
    const s = tagliaSolido(piramideQuadrata(m.lato, m.alt), p.n, p.d); s.nome = 'Piramide tagliata'; return preparaSolido(s);
  }),
  esagonalesez: conMisure('esagonalesez', m => {
    const p = pianoDiTaglio(m.alt, m.q, m.ang);
    const s = tagliaSolido(prismaEsagonaleVertici(m.r, m.alt), p.n, p.d); s.nome = 'Prisma esagonale tagliato'; return preparaSolido(s);
  }),
  cilindrosez: conMisure('cilindrosez', m => {
    const p = pianoDiTaglio(m.alt, m.q, m.ang);
    const s = tagliaSolido(cilindroPieno(m.r, m.alt, 48), p.n, p.d); s.nome = 'Cilindro tagliato'; return preparaSolido(s);
  }),
};

export { V3, sub, cross, dot, norm, SOLIDI, MISURE, misureStandard };
