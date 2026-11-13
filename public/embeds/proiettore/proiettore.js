/* ═══════════════════════════════════════════════════════════
   TECNORAMA — logica applicativa
   Moduli: cursore CAD · copertina · nastri · materiali ·
           proiettore ortogonale · sala energia · collaudo
═══════════════════════════════════════════════════════════ */
import * as THREE from 'three';

/* ── COPIA PER BOOK PROFTECNOLOGIA ─────────────────────────────────────────
   Uguale all'originale (proiettore-ortogonale.vercel.app) tranne i punti
   segnati «LIBRO»:
   1. apertura da indirizzo: solido, misure in cm, rotazione, opzioni di vista
   2. modalità esercizio: solido e misure bloccati, riquadro con la consegna
   3. inclinazione fino a 90° esatti (prima si fermava a 88,8°)
   4. «Azzera rotazione» torna alla posizione di partenza data dall'indirizzo
   5. le proiezioni sul triedro si aggiornano nello stesso fotogramma del solido
   6. sul triedro uno spigolo nascosto che coincide con uno in vista non lo copre più
   7. nomi dei piani sul triedro in chiaro (prima erano scuri su fondo scuro)
   8. sulle lastre i piani si chiamano PV, PL, PO, come sul triedro e nelle tavole (prima P.V., P.L., P.O.)
   Rigenerata da scripts/proiettore/aggiorna-proiettore.py: le modifiche vanno fatte lì, non in questo file.
   ─────────────────────────────────────────────────────────────────────── */

const riduciMoto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const svgNS = 'http://www.w3.org/2000/svg';

/* ── esecuzione a compartimenti stagni: un modulo che fallisce non spegne gli altri ── */
const modulo = fn => { try { fn(); } catch (e) { console.error('[TECNORAMA] modulo interrotto:', e); } };

/* ── creazione renderer WebGL con fallback grazioso (null se il contesto manca) ── */
const creaRenderer = canvas => {
  try {
    const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    return r;
  } catch (e) {
    console.warn('[TECNORAMA] WebGL non disponibile:', e.message);
    return null;
  }
};

/* ───────────────────────────── 1 · CURSORE CAD ── */
modulo(() => {
  const cur = $('#cadCursor'), xy = $('#cadXY');
  if (!cur || matchMedia('(pointer:coarse)').matches || riduciMoto) return;
  let acceso = false;
  addEventListener('pointermove', e => {
    if (!acceso) { cur.classList.add('is-on'); acceso = true; }
    cur.style.setProperty('--x', e.clientX + 'px');
    cur.style.setProperty('--y', e.clientY + 'px');
    xy.textContent = `X ${Math.round(e.clientX)} · Y ${Math.round(e.clientY)}`;
  }, { passive: true });
  addEventListener('pointerleave', () => { cur.classList.remove('is-on'); acceso = false; });
});

/* ───────────────────────────── 2 · COPERTINA ── */
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
  elle: conMisure('elle', m => { const s = prismaDaProfilo(stira(PROFILO_ELLE, m.larg / 3.0, m.alt / 3.0), m.prof); s.nome = 'Blocco a L'; return preparaSolido(s); }),
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
};

modulo(() => {
  const canvas = $('#solidoCanvas');
  if (!canvas) return;

  /* ── stato del proiettore ── */
  const stato = {
    solidoId: 'elle',
    solido: SOLIDI.elle(),
    yaw: 0.62, pitch: -0.42,      // rotazione a tavola girevole
    snap: false,
    ribaltato: true,    /* assonometria isometrica attiva per default */
    facce: false,
    misure: {},         /* misure correnti per id di solido */
    bloccoAng: null,
    zoom: 1,           /* ingrandimento della vista assonometrica */   /* angoli congelati quando le proiezioni sono sganciate */
  };

  /* ── LIBRO · apertura da indirizzo ───────────────────────────────────────
     ?solido=<id>                 apre su quel solido (id dei pulsanti: prismatri, piramide…)
     ?<misura>=<cm>               misure reali in centimetri, con le chiavi di MISURE (r, alt, lato, L, H, P…);
                                  vanno date tutte quelle del solido, altrimenti restano le misure standard
     ?alfa=<gradi>&beta=<gradi>   rotazione di partenza
     ?esercizio=1                 tavola guidata: solido e misure bloccati
     ?titolo=…&misure=…           testi del riquadro dell'esercizio
     ?aggancio=1 · ?facce=1 · ?iso=0   opzioni di vista
     ?embed=1 · ?lim=1            pagina incorporata e lavagna (index.html + styles.css) */
  const PAR = new URLSearchParams(location.search);
  const parNum = k => { const v = parseFloat((PAR.get(k) || '').replace(',', '.')); return Number.isFinite(v) ? v : null; };
  const GRADO = Math.PI / 180;
  const RAGGIO_SCENA = 2.2;            /* ingombro che la scena inquadra bene in tutte e due le viste 3D */
  const partenza = { yaw: 0, pitch: 0, data: false };
  const esercizio = { attivo: PAR.get('esercizio') === '1', solidoId: null, cm: null };
  if (SOLIDI[PAR.get('solido')]) stato.solidoId = PAR.get('solido');
  {
    const sch = MISURE[stato.solidoId] || {};
    const chiavi = Object.keys(sch);
    if (chiavi.length && chiavi.every(k => parNum(k) > 0)) {
      /* misure in cm → unità di scena: stesse proporzioni, ingombro costante */
      const cm = {};
      chiavi.forEach(k => { cm[k] = parNum(k); });
      const f = RAGGIO_SCENA / SOLIDI[stato.solidoId](cm).raggio;
      const interne = {};
      chiavi.forEach(k => { interne[k] = cm[k] * f; });
      stato.misure[stato.solidoId] = interne;
      esercizio.solidoId = stato.solidoId;
      esercizio.cm = cm;
    }
    stato.solido = SOLIDI[stato.solidoId](stato.misure[stato.solidoId]);
  }
  if (parNum('alfa') !== null || parNum('beta') !== null) {
    partenza.yaw = (parNum('alfa') || 0) * GRADO;
    partenza.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, (parNum('beta') || 0) * GRADO));
    partenza.data = true;
    stato.yaw = partenza.yaw; stato.pitch = partenza.pitch;
  }
  if (PAR.get('aggancio') === '1') stato.snap = true;
  if (PAR.get('facce') === '1') stato.facce = true;
  if (PAR.get('iso') === '0') stato.ribaltato = false;
  const cmTesto = v => (Math.round(v * 100) / 100).toString().replace('.', ',') + ' cm';

  /* ── scena Three.js ── */
  const renderer = creaRenderer(canvas);      // può essere null: le proiezioni SVG restano vive
  const ctx2d = renderer ? null : canvas.getContext('2d');
  const scena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
  camera.position.set(0, 0, 7.2);
  scena.add(new THREE.AmbientLight(0xffffff, 0.55));
  const l1 = new THREE.DirectionalLight(0xffffff, 1.5); l1.position.set(3, 5, 6);
  const l2 = new THREE.DirectionalLight(0x7fb6ff, 0.6); l2.position.set(-5, -2, -4);
  scena.add(l1, l2);
  const mondo = new THREE.Group();
  scena.add(mondo);

  let gruppo = null;
  const costruisciMesh = () => {
    if (!renderer) return;                          // niente scena WebGL: ci pensa rendi2D
    if (gruppo) { mondo.remove(gruppo); gruppo.traverse(o => { o.geometry?.dispose(); o.material?.dispose?.(); }); }
    const s = stato.solido;
    const pos = [], colori = [];
    s.faces.forEach(f => {
      const c = new THREE.Color(coloreGruppo(f.gruppo));
      f.tri.forEach(([a, b, c3]) => {
        [a, b, c3].forEach(i => {
          pos.push(s.verts[i].x, s.verts[i].y, s.verts[i].z);
          colori.push(c.r, c.g, c.b);
        });
      });
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colori, 3));
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: stato.facce ? 0xffffff : 0xFF4D00,
      vertexColors: stato.facce,
      roughness: 0.42, metalness: 0.12, flatShading: true,
    }));
    // spigoli “duri” disegnati come linee bianche
    const linPos = [];
    s.edges.filter(e => e.tipo === 'duro').forEach(e => {
      linPos.push(s.verts[e.a].x, s.verts[e.a].y, s.verts[e.a].z,
                  s.verts[e.b].x, s.verts[e.b].y, s.verts[e.b].z);
    });
    const linGeo = new THREE.BufferGeometry();
    linGeo.setAttribute('position', new THREE.Float32BufferAttribute(linPos, 3));
    const linee = new THREE.LineSegments(linGeo,
      new THREE.LineBasicMaterial({ color: 0xF5F7F2, transparent: true, opacity: 0.9 }));
    gruppo = new THREE.Group();
    gruppo.add(mesh, linee);
    mondo.add(gruppo);
  };
  costruisciMesh();

  let triedro = null, triedroProi = null, triedroD = 0;

  /* -- assonometria isometrica del triedro: P.V. a sx, P.L. a dx, P.O. in basso -- */
  const ISO_AX = Math.atan(1 / Math.SQRT2);   /* 35.26439 deg */
  const ISO_AY = Math.PI / 4;                 /* 45 deg */
  const ISO_HW = Math.SQRT2;                  /* semi-larghezza schermo / D */
  const ISO_HH = 4 / Math.sqrt(6);            /* semi-altezza schermo  / D */
  const applicaProiezione = iso => {
    if (!renderer) return;
    if (!iso || !triedroD) { camera.updateProjectionMatrix(); return; }
    const asp = camera.aspect || 1, m = 1.14 / (stato.zoom || 1);
    let hh = ISO_HH * triedroD * m, hw = ISO_HW * triedroD * m;
    if (hw / hh < asp) hw = hh * asp; else hh = hw / asp;
    camera.projectionMatrix.makeOrthographic(-hw, hw, hh, -hh, 0.1, 400);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  };
  const etichettaSprite = (riga1, riga2) => {
    const c = document.createElement("canvas"); c.width = 768; c.height = riga2 ? 224 : 128;
    const g = c.getContext("2d");
    g.fillStyle = "#F5F7F2"; g.textAlign = "center";   /* LIBRO · testo chiaro su scena scura */
    if (riga2) {
      g.font = "700 52px monospace"; g.fillText(riga1, 384, 100);
      g.font = "500 40px monospace"; g.fillStyle = "#C9CFDA"; g.fillText(riga2, 384, 172);
    } else {
      g.font = "700 52px monospace"; g.textBaseline = "middle"; g.fillText(riga1, 384, 64);
    }
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false }));
    const alt = riga2 ? 0.60 : 0.34;
    sp.scale.set(alt * c.width / c.height, alt, 1); return sp;
  };
  const distruggiTriedro = () => {
    if (!triedro) return;
    [triedro, triedroProi].forEach(gr => { if (!gr) return; mondo.remove(gr); gr.traverse(o => { o.geometry?.dispose(); o.material?.map?.dispose?.(); o.material?.dispose?.(); }); });
    triedro = triedroProi = null;
  };
  const costruisciTriedro = () => {
    if (!renderer) return;
    distruggiTriedro();
    const D = Math.max(2.1, stato.solido.raggio * 1.5); triedroD = D;
    triedro = new THREE.Group();
    const piano = () => new THREE.Mesh(new THREE.PlaneGeometry(2*D, 2*D), new THREE.MeshBasicMaterial({ color: 0xE8ECF3, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }));
    const bordo = m => { m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: 0x9AA3B2, transparent: true, opacity: 0.7 }))); return m; };
    const pv = bordo(piano()); pv.position.set(0, 0, -D);
    const po = bordo(piano()); po.rotation.x = -Math.PI/2; po.position.set(0, -D, 0);
    const pl = bordo(piano()); pl.rotation.y = -Math.PI/2; pl.position.set(D, 0, 0);
    const ltGeo = new THREE.BufferGeometry(); ltGeo.setAttribute("position", new THREE.Float32BufferAttribute([-D,-D,-D, D,-D,-D], 3));
    const lt = new THREE.LineSegments(ltGeo, new THREE.LineBasicMaterial({ color: 0xFF4D00 }));
    const ePV = etichettaSprite("PV · PIANO VERTICALE", "(Prospetto)"); ePV.position.set(-D*0.45, D*0.82, -D);
    const ePO = etichettaSprite("PO · PIANO ORIZZONTALE", "(Pianta)"); ePO.position.set(-D*0.45, -D, D*0.82);
    const ePL = etichettaSprite("PL · PIANO LATERALE", "(Vista laterale)"); ePL.position.set(D, D*0.82, D*0.45);
    const eLT = etichettaSprite("L.T."); eLT.position.set(-D*0.92, -D*0.86, -D);
    triedro.add(pv, po, pl, lt, ePV, ePO, ePL, eLT);
    triedroProi = new THREE.Group(); mondo.add(triedro, triedroProi);
  };
  const SU_PIANO = [
    (u, ww, D, o) => [u, -ww, -D + o],
    (u, ww, D, o) => [u, -D + o, ww],
    (u, ww, D, o) => [D - o, -ww, u],
  ];
  const aggiornaProiezioneTriedro = (iVista, tris, segV, segN) => {
    if (!triedroProi) return;
    triedroProi.children.filter(o => o.userData.vista === iVista).forEach(o => { triedroProi.remove(o); o.geometry?.dispose(); o.material?.dispose(); });
    const D = triedroD, su = SU_PIANO[iVista];
    const agg = o => { o.userData.vista = iVista; triedroProi.add(o); };
    if (tris.pos.length) {
      const pos = [];
      for (let i = 0; i < tris.pos.length; i += 2) pos.push(...su(tris.pos[i], tris.pos[i+1], D, 0.02));
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      if (stato.facce && tris.col.length) g.setAttribute("color", new THREE.Float32BufferAttribute(tris.col, 3));
      agg(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: stato.facce ? 0xffffff : 0xFF4D00, vertexColors: stato.facce, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false })));
    }
    const linee = (seg, mat, tratt) => {
      if (!seg.length) return;
      const pos = [];
      for (let i = 0; i < seg.length; i += 4) pos.push(...su(seg[i], seg[i+1], D, 0.045), ...su(seg[i+2], seg[i+3], D, 0.045));
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      const l = new THREE.LineSegments(g, mat); if (tratt) l.computeLineDistances(); agg(l);
    };
    /* LIBRO · prima i nascosti, poi quelli in vista: uno spigolo nascosto che coincide con uno in vista non lo tratteggia */
    linee(segN, new THREE.LineDashedMaterial({ color: 0x2F5FE0, dashSize: 0.09, gapSize: 0.07 }), true);
    linee(segV, new THREE.LineBasicMaterial({ color: 0x14151A }), false);
  };

  const ridimensiona = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (renderer) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      applicaProiezione(!!(stato.ribaltato && triedro));
    } else {
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
    }
  };
  ridimensiona();
  addEventListener('resize', () => { ridimensiona(); rendi(); });

  /* ── proiezioni: motore linee nascoste ──
     Vista = { dirOsservatore, mappa 3D→2D del foglio } (metodo europeo)   */
  const VISTE = [
    { svg: $('#svgPV'), v: V3(0, 0, 1),  m: p => [ p.x, -p.y] },  // prospetto
    { svg: $('#svgPO'), v: V3(0, 1, 0),  m: p => [ p.x,  p.z] },  // pianta (sotto il PV)
    { svg: $('#svgPL'), v: V3(-1, 0, 0), m: p => [ p.z, -p.y] },  // laterale sin. (a destra): il fronte del pezzo cade a destra
  ];

  const ruota = (p, cy, sy, cp, sp) => {
    // R = Rx(pitch) · Ry(yaw)
    const x1 = p.x * cy + p.z * sy;
    const z1 = -p.x * sy + p.z * cy;
    const y2 = p.y * cp - z1 * sp;
    const z2 = p.y * sp + z1 * cp;
    return V3(x1, y2, z2);
  };

  const CAMPIONI = 13, EPS = 1e-4;

  /* ---- pannello delle misure ---- */
  const misureCorrenti = id => {
    if (!stato.misure[id]) stato.misure[id] = misureStandard(id);
    return stato.misure[id];
  };
  const rigeneraSolido = () => {
    stato.solido = SOLIDI[stato.solidoId](misureCorrenti(stato.solidoId));
    if (stato.ribaltato) costruisciTriedro();
    $('#cartiglioSolido').textContent = stato.solido.nome;
    costruisciMesh();
    rendi();
  };
  const costruisciPannelloMisure = () => {
    const cont = $('#misureSolido');
    if (!cont) return;
    const sch = MISURE[stato.solidoId] || {};
    const chiavi = Object.keys(sch);
    if (!chiavi.length) {
      cont.innerHTML = "<p class=\"misure__vuoto\">Questo solido ha forma fissa: nessuna misura regolabile.</p>";
      return;
    }
    /* LIBRO · misure date dall'indirizzo: elenco in centimetri al posto dei cursori */
    if (esercizio.cm && esercizio.solidoId === stato.solidoId) {
      cont.innerHTML = chiavi.map(k =>
        "<p class=\"misura misura--fissa\"><span class=\"misura__et\">" + sch[k].et + "</span>" +
        "<output class=\"mono\">" + cmTesto(esercizio.cm[k]) + "</output></p>").join("") +
        "<button class=\"tasto tasto--mini\" id=\"tastoMisureLibere\">Cambia le misure</button>";
      $('#tastoMisureLibere').addEventListener('click', () => {
        esercizio.cm = null; esercizio.solidoId = null;
        delete stato.misure[stato.solidoId];
        costruisciPannelloMisure();
        rigeneraSolido();
      });
      return;
    }
    const m = misureCorrenti(stato.solidoId);
    let h = "";
    chiavi.forEach(k => {
      const d = sch[k];
      h += "<label class=\"misura\"><span class=\"misura__et\">" + d.et + "</span>" +
           "<input type=\"range\" data-m=\"" + k + "\" min=\"" + d.min + "\" max=\"" + d.max + "\" step=\"" + d.step + "\" value=\"" + m[k] + "\">" +
           "<output class=\"mono\" data-o=\"" + k + "\">" + m[k].toFixed(2) + "</output></label>";
    });
    cont.innerHTML = h + "<button class=\"tasto tasto--mini\" id=\"tastoAzzeraMisure\">Misure standard</button>";
    cont.querySelectorAll('input[data-m]').forEach(inp => {
      inp.addEventListener('input', () => {
        const k = inp.dataset.m;
        m[k] = parseFloat(inp.value);
        const o = cont.querySelector('output[data-o=' + JSON.stringify(k) + ']');
        if (o) o.textContent = m[k].toFixed(2);
        rigeneraSolido();
      });
    });
    $('#tastoAzzeraMisure').addEventListener('click', () => {
      delete stato.misure[stato.solidoId];
      costruisciPannelloMisure();
      rigeneraSolido();
    });
  };

  function proietta() {
    const s = stato.solido;
    const ang = stato.bloccoAng || stato;   /* sganciato: usa gli angoli congelati */
    const cy = Math.cos(ang.yaw),   sy = Math.sin(ang.yaw);
    const cp = Math.cos(ang.pitch), sp = Math.sin(ang.pitch);
    const W = s.verts.map(p => ruota(p, cy, sy, cp, sp));
    const scala = 88 / s.raggio;

    // normali ruotate per faccia
    const NR = s.faces.map(f => ruota(f.n, cy, sy, cp, sp));

    VISTE.forEach((vista, iVista) => {
      const v = vista.v;
      const fronte = NR.map(n => dot(n, v) > EPS);
      const raccogli = stato.ribaltato && triedroProi;
      const rTris = { pos: [], col: [] }, rSegV = [], rSegN = [];

      // triangoli potenzialmente occludenti (solo facce frontali)
      const tris = [];
      s.faces.forEach((f, fi) => {
        if (!fronte[fi]) return;
        f.tri.forEach(t => tris.push({ t, fi }));
      });
      if (raccogli) {
        tris.forEach(({ t, fi }) => {
          const c = stato.facce ? new THREE.Color(coloreGruppo(s.faces[fi].gruppo)) : null;
          t.forEach(vi => { const [u, ww] = vista.m(W[vi]); rTris.pos.push(u, ww); if (c) rTris.col.push(c.r, c.g, c.b); });
        });
      }

      const dietroTri = (P, esclusi) => {
        // P è occluso se un triangolo frontale lo copre in 2D e sta più vicino all'osservatore
        const [px, py] = vista.m(P);
        const dP = dot(P, v);
        for (const { t, fi } of tris) {
          if (esclusi.has(fi)) continue;
          const A = W[t[0]], B = W[t[1]], C = W[t[2]];
          const [ax, ay] = vista.m(A), [bx, by] = vista.m(B), [cx2, cy2] = vista.m(C);
          const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
          const d2 = (px - cx2) * (by - cy2) - (bx - cx2) * (py - cy2);
          const d3 = (px - ax) * (cy2 - ay) - (cx2 - ax) * (py - ay);
          const neg = (d1 < -EPS) || (d2 < -EPS) || (d3 < -EPS);
          const pos = (d1 >  EPS) || (d2 >  EPS) || (d3 >  EPS);
          if (neg && pos) continue;                       // fuori dal triangolo
          // profondità del triangolo nel punto (coordinate baricentriche)
          const den = (by - cy2) * (ax - cx2) + (cx2 - bx) * (ay - cy2);
          if (Math.abs(den) < 1e-9) continue;
          const w1 = ((by - cy2) * (px - cx2) + (cx2 - bx) * (py - cy2)) / den;
          const w2 = ((cy2 - ay) * (px - cx2) + (ax - cx2) * (py - cy2)) / den;
          const w3 = 1 - w1 - w2;
          const dT = w1 * dot(A, v) + w2 * dot(B, v) + w3 * dot(C, v);
          if (dT > dP + 1e-3) return true;
        }
        return false;
      };

      let campiture = '';
      if (stato.facce) {
        s.faces.map((f, fi) => ({ f, fi }))
          .filter(o => fronte[o.fi])
          .map(o => ({ f: o.f, d: o.f.idx.reduce((acc, i) => acc + dot(W[i], v), 0) / o.f.idx.length }))
          .sort((a, b) => a.d - b.d)
          .forEach(({ f }) => {
            const pts = f.idx.map(i => {
              const [x, y] = vista.m(W[i]);
              return `${(x * scala).toFixed(1)},${(y * scala).toFixed(1)}`;
            }).join(' ');
            campiture += `<polygon points="${pts}" fill="${coloreGruppo(f.gruppo)}" fill-opacity="0.55"/>`;
          });
      }

      let visibili = '', nascosti = '';
      s.edges.forEach(e => {
        const fA = e.facce[0], fB = e.facce[1];
        const frA = fA !== undefined && fronte[fA];
        const frB = fB !== undefined && fronte[fB];
        if (e.tipo === 'liscio' && frA === frB) return;   // generatrice non di contorno
        const tuttoDietro = !frA && !frB;
        const A = W[e.a], B = W[e.b];
        const esclusi = new Set(e.facce);
        const [x1, y1] = vista.m(A), [x2, y2] = vista.m(B);

        if (tuttoDietro) {
          nascosti += `M${(x1 * scala).toFixed(1)} ${(y1 * scala).toFixed(1)}L${(x2 * scala).toFixed(1)} ${(y2 * scala).toFixed(1)}`;
          if (raccogli) rSegN.push(x1, y1, x2, y2);
          return;
        }
        // campiona lo spigolo e spezzalo in tratti visibili/occlusi
        let statoPrec = null, inizio = 0;
        const chiudi = (fine, occluso) => {
          const X1 = x1 + (x2 - x1) * inizio, Y1 = y1 + (y2 - y1) * inizio;
          const X2 = x1 + (x2 - x1) * fine,   Y2 = y1 + (y2 - y1) * fine;
          const seg = `M${(X1 * scala).toFixed(1)} ${(Y1 * scala).toFixed(1)}L${(X2 * scala).toFixed(1)} ${(Y2 * scala).toFixed(1)}`;
          if (occluso) nascosti += seg; else visibili += seg;
          if (raccogli) (occluso ? rSegN : rSegV).push(X1, Y1, X2, Y2);
        };
        for (let i = 0; i <= CAMPIONI; i++) {
          const t = i / CAMPIONI;
          const P = V3(A.x + (B.x - A.x) * t, A.y + (B.y - A.y) * t, A.z + (B.z - A.z) * t);
          const occ = dietroTri(P, esclusi);
          if (statoPrec === null) { statoPrec = occ; inizio = 0; }
          else if (occ !== statoPrec) {
            const tm = t - 0.5 / CAMPIONI;
            chiudi(tm, statoPrec);
            inizio = tm; statoPrec = occ;
          }
        }
        chiudi(1, statoPrec);
      });

      vista.svg.innerHTML =
        `<line class="sp-asse" x1="-104" y1="0" x2="104" y2="0"/>` +
        `<line class="sp-asse" x1="0" y1="-104" x2="0" y2="104"/>` +
        campiture +
        (nascosti ? `<path class="sp-nascosto" d="${nascosti}"/>` : '') +
        (visibili ? `<path class="sp-visibile" d="${visibili}"/>` : '');
      if (raccogli) aggiornaProiezioneTriedro(iVista, rTris, rSegV, rSegN);
    });
  }

  /* ── resa 3D + lettura angoli ── */
  /* fallback wireframe su canvas 2D quando WebGL manca: il pezzo resta orientabile */
  const rendi2D = () => {
    if (!ctx2d) return;
    const s = stato.solido;
    const cy = Math.cos(stato.yaw),   sy = Math.sin(stato.yaw);
    const cp = Math.cos(stato.pitch), sp = Math.sin(stato.pitch);
    const W = s.verts.map(p => {
      const x1 = p.x * cy + p.z * sy;
      const z1 = -p.x * sy + p.z * cy;
      const y2 = p.y * cp - z1 * sp;
      const z2 = p.y * sp + z1 * cp;
      return { x: x1, y: y2, z: z2 };
    });
    const w = canvas.width, h = canvas.height;
    const k = Math.min(w, h) * 0.36 / s.raggio;
    ctx2d.clearRect(0, 0, w, h);
    if (stato.facce) {
      const NR = s.faces.map(f => {
        const x1 = f.n.x * cy + f.n.z * sy;
        const z1 = -f.n.x * sy + f.n.z * cy;
        return { y: f.n.y * cp - z1 * sp, z: f.n.y * sp + z1 * cp, x: x1 };
      });
      s.faces.map((f, fi) => ({ f, fi }))
        .filter(o => NR[o.fi].z > 1e-4)
        .map(o => ({ f: o.f, d: o.f.idx.reduce((a, i) => a + W[i].z, 0) / o.f.idx.length }))
        .sort((a, b) => a.d - b.d)
        .forEach(({ f }) => {
          ctx2d.fillStyle = coloreGruppo(f.gruppo);
          ctx2d.beginPath();
          f.idx.forEach((i, kk) => {
            const p = W[i];
            if (kk === 0) ctx2d.moveTo(w / 2 + p.x * k, h / 2 - p.y * k);
            else ctx2d.lineTo(w / 2 + p.x * k, h / 2 - p.y * k);
          });
          ctx2d.closePath(); ctx2d.fill();
        });
    }
    ctx2d.lineWidth = Math.max(1.5, w / 320);
    ctx2d.lineCap = 'round';
    ctx2d.strokeStyle = '#FF4D00';
    ctx2d.beginPath();
    s.edges.forEach(e => {
      if (e.tipo !== 'duro') return;
      const a = W[e.a], b = W[e.b];
      ctx2d.moveTo(w / 2 + a.x * k, h / 2 - a.y * k);
      ctx2d.lineTo(w / 2 + b.x * k, h / 2 - b.y * k);
    });
    ctx2d.stroke();
  };
  const gradi = r => ((r * 180 / Math.PI) % 360 + 360) % 360;
  const rendi = () => {
    if (gruppo) {
      gruppo.rotation.set(0, 0, 0);
      gruppo.rotateX(stato.pitch);
      gruppo.rotateY(stato.yaw);
    }
    mondo.rotation.set(0, 0, 0);
    const iso = !!(stato.ribaltato && triedro);
    if (iso) { mondo.rotateX(ISO_AX); mondo.rotateY(ISO_AY); }
    camera.position.z = iso ? triedroD * 9 : 7.2;
    applicaProiezione(iso);
    proietta();   /* LIBRO · prima le proiezioni, poi il disegno: così il triedro mostra subito quelle giuste */
    if (renderer) renderer.render(scena, camera);
    else rendi2D();
    $('#valAngoli').textContent =
      `α ${gradi(stato.yaw).toFixed(0)}° · β ${gradi(stato.pitch).toFixed(0)}°`;
  };

  /* ── interazioni ── */
  let trascino = null;
  /* zoom della vista assonometrica: rotella, doppio clic per azzerare, pizzico su touch */
  const zoomIso = f => {
    stato.zoom = Math.min(4, Math.max(0.5, stato.zoom * f));
    rendi();
  };
  canvas.addEventListener('wheel', e => {
    if (!(stato.ribaltato && triedro)) return;
    e.preventDefault();
    zoomIso(Math.exp(-e.deltaY * 0.0015));
  }, { passive: false });
  canvas.addEventListener('dblclick', () => { if (stato.ribaltato && triedro) { stato.zoom = 1; rendi(); } });
  let pizzico = 0;
  const distDita = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  canvas.addEventListener('touchstart', e => { if (e.touches.length === 2) pizzico = distDita(e.touches); }, { passive: true });
  canvas.addEventListener('touchmove', e => {
    if (e.touches.length !== 2 || !(stato.ribaltato && triedro)) return;
    e.preventDefault();
    const d = distDita(e.touches);
    if (pizzico > 0) zoomIso(d / pizzico);
    pizzico = d;
  }, { passive: false });
  canvas.addEventListener('pointerdown', e => {
    trascino = { x: e.clientX, y: e.clientY };
    canvas.setPointerCapture(e.pointerId);
    $('#hint3d').style.opacity = 0;
  });
  canvas.addEventListener('pointermove', e => {
    if (!trascino) return;
    stato.yaw   += (e.clientX - trascino.x) * 0.011;
    stato.pitch += (e.clientY - trascino.y) * 0.011;
    stato.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, stato.pitch));   /* LIBRO · 90° esatti */
    trascino = { x: e.clientX, y: e.clientY };
    requestAnimationFrame(rendi);
  });
  const agganciaSeServe = () => {
    if (!stato.snap) return;
    const passo = Math.PI / 12;                     // 15°
    stato.yaw = Math.round(stato.yaw / passo) * passo;
    stato.pitch = Math.round(stato.pitch / passo) * passo;
    stato.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, stato.pitch));   /* LIBRO · 90° esatti */
    rendi();
  };
  canvas.addEventListener('pointerup', e => {
    trascino = null;
    canvas.releasePointerCapture(e.pointerId);
    agganciaSeServe();
  });
  canvas.addEventListener('keydown', e => {
    const passo = stato.snap ? Math.PI / 12 : Math.PI / 36;
    const k = e.key;
    if (k === 'ArrowLeft')  stato.yaw -= passo;
    else if (k === 'ArrowRight') stato.yaw += passo;
    else if (k === 'ArrowUp')    stato.pitch -= passo;
    else if (k === 'ArrowDown')  stato.pitch += passo;
    else return;
    e.preventDefault();
    stato.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, stato.pitch));   /* LIBRO · 90° esatti */
    rendi();
  });

  $('#sceltaSolido').addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    $$('#sceltaSolido .chip').forEach(c => {
      c.classList.toggle('is-active', c === b);
      c.setAttribute('aria-pressed', c === b);
    });
    stato.solidoId = b.dataset.solido;
    stato.solido = SOLIDI[stato.solidoId](misureCorrenti(stato.solidoId));
    costruisciPannelloMisure();
    if (stato.ribaltato) costruisciTriedro();
    $('#cartiglioSolido').textContent = stato.solido.nome;
    costruisciMesh();
    rendi();
  });

  $('#tastoSnap').addEventListener('click', e => {
    stato.snap = !stato.snap;
    e.currentTarget.setAttribute('aria-pressed', stato.snap);
    agganciaSeServe();
  });
  $('#tastoRibalta').addEventListener('click', e => {
    stato.ribaltato = !stato.ribaltato;
    e.currentTarget.setAttribute('aria-pressed', stato.ribaltato);
    $('#scenaWrap').classList.toggle('is-ribaltata', stato.ribaltato);
    if (stato.ribaltato) costruisciTriedro(); else distruggiTriedro();
    requestAnimationFrame(() => { ridimensiona(); rendi(); });
  });
  $('#tastoFacce').addEventListener('click', e => {
    stato.facce = !stato.facce;
    e.currentTarget.setAttribute('aria-pressed', String(stato.facce));
    costruisciMesh();
    rendi();
  });
  $('#tastoVincolo').addEventListener('click', e => {
    const sganciato = !stato.bloccoAng;
    stato.bloccoAng = sganciato ? { yaw: stato.yaw, pitch: stato.pitch } : null;
    e.currentTarget.setAttribute('aria-pressed', String(sganciato));
    e.currentTarget.textContent = sganciato ? 'Riaggancia proiezioni' : 'Sgancia proiezioni';
    $('#scenaWrap').classList.toggle('is-sganciata', sganciato);
    rendi();
  });
  $('#tastoAzzeraRot').addEventListener('click', () => {
    stato.yaw = partenza.yaw; stato.pitch = partenza.pitch;   /* LIBRO · 0° e 0° se l'indirizzo non dice altro */
    rendi();
  });

  /* LIBRO · i comandi mostrano lo stato letto dall'indirizzo */
  $$('#sceltaSolido .chip').forEach(c => {
    const attivo = c.dataset.solido === stato.solidoId;
    c.classList.toggle('is-active', attivo);
    c.setAttribute('aria-pressed', attivo);
  });
  $('#cartiglioSolido').textContent = stato.solido.nome;
  $('#tastoSnap').setAttribute('aria-pressed', stato.snap);
  $('#tastoRibalta').setAttribute('aria-pressed', stato.ribaltato);
  $('#tastoFacce').setAttribute('aria-pressed', String(stato.facce));
  if (partenza.data) $('#tastoAzzeraRot').textContent = 'Posizione di partenza';
  {
    const box = $('#esercizioBox');
    if (box && esercizio.attivo) {
      const sch = MISURE[stato.solidoId] || {};
      $('#esercizioTitolo').textContent = PAR.get('titolo') || stato.solido.nome;
      $('#esercizioMisure').textContent = PAR.get('misure') ||
        (esercizio.cm ? Object.keys(sch).map(k => sch[k].et + ' ' + cmTesto(esercizio.cm[k])).join(' · ') : '');
      box.hidden = false;
    }
  }

  costruisciPannelloMisure();
  /* ISO-DEFAULT */
  if (stato.ribaltato) costruisciTriedro();
  // primo quadro (dopo il layout)
  requestAnimationFrame(() => { ridimensiona(); rendi(); });
});

/* ───────────────────────────── 6 · SALA ENERGIA ── */

/* espansione della vista 3D: il riquadro prende tutta la griglia, i prospetti si ritirano */
(() => {
  const b = document.getElementById("tastoEspandi");
  const sc = document.getElementById("scenaWrap");
  if (!b || !sc) return;
  b.addEventListener("click", () => {
    const on = sc.classList.toggle("is-espansa");
    b.setAttribute("aria-pressed", String(on));
    b.textContent = on ? "RIDUCI" : "ESPANDI";
    window.dispatchEvent(new Event("resize"));
    if (on) sc.scrollIntoView({ block: "start" });
  });
})();
