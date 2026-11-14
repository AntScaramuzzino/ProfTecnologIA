/*
 * Tavole dei motivi modulari — costruzioni 34–50 (MC-DIS-1-01).
 *
 * Stesso vocabolario delle costruzioni 9–33 (`creaTavola`, in tavole.js), più uno strato per i motivi:
 *   m.reticolo(…)  carta a quadretti o isometrica (sottile, azzurra, sempre visibile)
 *   m.area(…)      campitura colorata senza bordo, che compare in un passo (area «lista», vedi activity.js)
 *   m.lati(…)      tratti a righello per i lati di più poligoni, senza ripetere quelli in comune
 * Unità: 1 = 1 cm (nella greca 1 = 1 quadretto). Le y crescono verso l'alto.
 * Nomi: draw… tratto del motivo (nero), line… costruzione (blu sottile), arc… compasso (arancione),
 * col… campitura. Il numero di `k.passo` deve essere uguale al numero di voci in `steps`.
 * Come aggiungere una tavola: skill «tavole-geogebra».
 */
(() => {
  "use strict";

  const { creaTavola, finestre, polare, distanza, direzione, xy } = window.GGB_CREA;
  const TAVOLE = window.GGB_TAVOLE;

  const COLORI = {
    rosso: [215, 38, 61], blu: [27, 79, 156], giallo: [242, 183, 5], verde: [46, 147, 60],
    arancio: [244, 96, 54], viola: [123, 45, 139], nero: [24, 24, 27], crema: [250, 238, 205],
    azzurro: [96, 165, 250], oro: [201, 162, 39], porfido: [142, 27, 27], serpentino: [47, 93, 58], bianco: [255, 255, 255],
  };
  const GRIGLIA = { color: [147, 197, 253], thickness: 2, lineStyle: 0, layer: 0 };

  const ruota = (p, c, gradi) => {
    const a = (gradi * Math.PI) / 180, dx = p[0] - c[0], dy = p[1] - c[1];
    return [c[0] + dx * Math.cos(a) - dy * Math.sin(a), c[1] + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  const medio = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const chiave = (p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`;
  /** Punti lungo l'arco più corto di centro c da u a v (per le campiture curve). */
  function arcoPunti(c, u, v, n = 14) {
    const r = distanza(c, u);
    const a1 = direzione(c, u);
    let d = direzione(c, v) - a1;
    while (d > 180) d -= 360;
    while (d <= -180) d += 360;
    return Array.from({ length: n + 1 }, (_, i) => polare(c, r, a1 + (d * i) / n));
  }
  const cerchioPunti = (c, r, n = 48) => Array.from({ length: n }, (_, i) => polare(c, r, (360 * i) / n));

  function motivo(meta, costruisci) {
    return creaTavola(meta, (k, t) => {
      t.areas = [];
      t.styles = {};
      const stile = (nome, s) => { t.styles[nome] = { ...(t.styles[nome] || {}), ...s }; return nome; };
      let nArea = 0;
      const m = {
        stile,
        /** Carta a quadretti: segmenti sottili da (x0,y0) a (x1,y1) con passo p. Restituisce i nomi. */
        reticolo(x0, y0, x1, y1, p) {
          const nomi = [];
          for (let x = x0, i = 0; x <= x1 + 1e-9; x += p, i += 1) { const n = `lineGv${i}`; k.seg(n, [x, y0], [x, y1]); nomi.push(stile(n, GRIGLIA)); }
          for (let y = y0, i = 0; y <= y1 + 1e-9; y += p, i += 1) { const n = `lineGo${i}`; k.seg(n, [x0, y], [x1, y]); nomi.push(stile(n, GRIGLIA)); }
          return nomi;
        },
        /** Carta isometrica: rette a 90°, 30° e 150° distanti h, ritagliate nel rettangolo. */
        isometrica(x0, y0, x1, y1, h, origine = [0, 0]) {
          const nomi = [];
          [90, 30, 150].forEach((th, f) => {
            const d = [Math.cos((th * Math.PI) / 180), Math.sin((th * Math.PI) / 180)];
            const nrm = [-d[1], d[0]];
            const proiez = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map((p) => nrm[0] * (p[0] - origine[0]) + nrm[1] * (p[1] - origine[1]));
            const lo = Math.ceil(Math.min(...proiez) / h - 1e-9), hi = Math.floor(Math.max(...proiez) / h + 1e-9);
            for (let j = lo; j <= hi; j += 1) {
              const base = [origine[0] + nrm[0] * j * h, origine[1] + nrm[1] * j * h];
              let tmin = -1e9, tmax = 1e9;
              [[0, x0, x1], [1, y0, y1]].forEach(([ax, a, b]) => {
                if (Math.abs(d[ax]) < 1e-12) { if (base[ax] < a - 1e-9 || base[ax] > b + 1e-9) { tmin = 1; tmax = 0; } return; }
                const ta = (a - base[ax]) / d[ax], tb = (b - base[ax]) / d[ax];
                tmin = Math.max(tmin, Math.min(ta, tb)); tmax = Math.min(tmax, Math.max(ta, tb));
              });
              if (tmax - tmin < 0.05) continue;
              const n = `lineGi${f}x${nomi.length}`;
              k.seg(n, [base[0] + d[0] * tmin, base[1] + d[1] * tmin], [base[0] + d[0] * tmax, base[1] + d[1] * tmax]);
              nomi.push(stile(n, GRIGLIA));
            }
          });
          return nomi;
        },
        /** Campitura colorata (senza bordo) che compare nel passo `passo`, al momento `at` (0–1). */
        area(punti, colore, passo, at, riempimento = 0.85) {
          nArea += 1;
          const nome = `col${nArea}`;
          t.areas.push({ name: nome, points: [`{${punti.map(xy).join(",")}}`], step: passo, at, lista: true });
          stile(nome, { color: COLORI[colore] || colore, filling: riempimento, layer: 0 });
          return nome;
        },
        /** Lati di più poligoni a righello, senza ripetere quelli in comune né quelli in `escludi`. */
        lati(prefisso, poligoni, finestra, escludi = () => false) {
          const visti = new Set(), coppie = [];
          poligoni.forEach((pol) => pol.forEach((a, i) => {
            const b = pol[(i + 1) % pol.length];
            const ch = [chiave(a), chiave(b)].sort().join("|");
            if (visti.has(ch) || escludi(a, b)) return;
            visti.add(ch); coppie.push([a, b]);
          }));
          const fin = finestra ? finestre(coppie.length, finestra[0], finestra[1]) : coppie.map(() => undefined);
          return coppie.map(([a, b], i) => { const n = `${prefisso}${i + 1}`; k.traccia(n, a, b, fin[i]); return n; });
        },
        /** Porta in primo piano i tratti (le campiture stanno sotto). */
        primoPiano(...nomi) { nomi.flat().forEach((n) => stile(n, { layer: 2 })); },
      };
      costruisci(k, m, t);
    });
  }

  // ── 34 · Piastrelle a girandola ─────────────────────────────────────────────
  TAVOLE["piastrelle-girandola"] = motivo({
    title: "Piastrelle a girandola",
    eyebrow: "Costruzione 34 · Modulo ruotato",
    subtitle: "Un modulo disegnato sui quadretti, ripetuto in quattro piastrelle e ruotato ogni volta di un quarto di giro.",
    filename: "MC-DIS-1-01_piastrelle-girandola.ggb",
    coord: [-0.8, 8.8, -0.8, 8.8],
    proofTitle: "Quattro quarti di giro fanno un giro intero",
    proofCopy: "Ogni piastrella contiene lo stesso modulo, ruotato attorno al centro del quadrato grande: 0°, 90°, 180° e 270°. Dopo quattro quarti di giro il modulo torna com’era. Per questo il disegno finale non cambia se lo giri di 90° attorno al centro: ha una simmetria di rotazione, come una girandola.",
    equality: "4 × 90° = 360°",
    steps: [
      ["Prima di iniziare", "Osserva il foglio a quadretti", "Hai un foglio con quadretti da 1 cm. Disegnerai quattro piastrelle quadrate di 4 × 4 quadretti, che insieme formano un quadrato di 8 cm.", "Il modulo è il disegno di una piastrella: lo progetti una volta e poi lo ripeti."],
      ["Passo 1 · Le piastrelle", "Traccia le quattro piastrelle", "Ripassa un quadrato di 8 × 8 quadretti e dividilo in quattro con una riga verticale e una orizzontale a metà.", "Ogni piastrella ha il lato di 4 cm."],
      ["Passo 2 · Il modulo", "Disegna il modulo in basso a sinistra", "Lavora nella piastrella in basso a sinistra. Traccia un segmento obliquo dal punto che sta 3 quadretti a destra del suo angolo in basso a sinistra al punto che sta 3 quadretti sopra lo stesso angolo. Fai lo stesso nell’angolo in alto a destra della piastrella, ma con 2 quadretti. Infine ripassa il quadretto che ha un vertice nel centro della piastrella e sta in alto a destra rispetto al centro.", "Le diagonali tagliano i quadretti a metà, da un angolo all’angolo opposto."],
      ["Passo 3 · Primo quarto di giro", "Ruota il modulo nella piastrella accanto", "Nella piastrella in basso a destra ridisegna il modulo girato di un quarto di giro in senso antiorario: il lato che nel modulo stava in basso ora sta a destra.", "Il triangolo grande ora è nell’angolo in basso a destra."],
      ["Passo 4 · Completa il giro", "Ruota ancora due volte", "In alto a destra disegna il modulo girato di mezzo giro, in alto a sinistra girato di tre quarti di giro. I triangoli grandi stanno ora nei quattro angoli esterni.", "Gira il foglio di un quarto di giro alla volta: ogni piastrella deve sembrare uguale alla prima."],
      ["Passo 5 · Colora", "Colora rispettando il modulo", "Colora le stesse figure con lo stesso colore in tutte le piastrelle: triangoli grandi in rosso, triangoli piccoli in blu, quadratini in giallo.", "Al centro i quattro triangoli blu formano un quadrato messo di punta, con un quadratino giallo vicino a ogni lato."],
    ],
  }, (k, m) => {
    const griglia = m.reticolo(0, 0, 8, 8, 1);
    const modulo = [
      { pts: [[0, 0], [3, 0], [0, 3]], c: "rosso" },
      { pts: [[4, 4], [2, 4], [4, 2]], c: "blu" },
      { pts: [[2, 2], [3, 2], [3, 3], [2, 3]], c: "giallo" },
    ];
    const bordi = [];
    [[[0, 0], [8, 0]], [[8, 0], [8, 8]], [[8, 8], [0, 8]], [[0, 8], [0, 0]], [[4, 0], [4, 8]], [[0, 4], [8, 4]]].forEach(([a, b], i) => {
      k.traccia(`drawB${i + 1}`, a, b, finestre(6)[i]); bordi.push(`drawB${i + 1}`);
    });
    const sulBordo = (o) => (a, b) => {
      const loc = (p) => [p[0] - o[0], p[1] - o[1]];
      const A = loc(a), B = loc(b);
      return [0, 1].some((ax) => [0, 4].some((v) => Math.abs(A[ax] - v) < 1e-6 && Math.abs(B[ax] - v) < 1e-6));
    };
    const piastre = [0, 90, 180, 270].map((rot) => modulo.map((f) => ({ c: f.c, pts: f.pts.map((p) => ruota(p, [4, 4], rot)) })));
    const origini = [[0, 0], [4, 0], [4, 4], [0, 4]];
    const tr = piastre.map((pi, i) => m.lati(`drawP${i}x`, pi.map((f) => f.pts), i === 2 ? [0.12, 0.52] : i === 3 ? [0.54, 0.94] : undefined, sulBordo(origini[i])));
    piastre.forEach((pi) => pi.forEach((f) => m.area(f.pts, f.c, 5)));
    m.primoPiano(bordi, tr);
    k.passo(...griglia);
    k.passo(...bordi);
    k.passo(...tr[0]);
    k.passo(...tr[1]);
    k.passo(...tr[2], ...tr[3]);
    k.passo();
    k.risultato(...bordi);
  });

  // ── 35 · Meandro a spirale (greca) ──────────────────────────────────────────
  TAVOLE["meandro-spirale"] = motivo({
    title: "Meandro a spirale",
    eyebrow: "Costruzione 35 · Greca sui quadretti",
    subtitle: "Una linea che si avvolge a spirale, ripetuta a passo costante lungo una fascia: la greca.",
    filename: "MC-DIS-1-01_meandro-spirale.ggb",
    coord: [-0.8, 12.8, -2, 6],
    proofTitle: "La traslazione",
    proofCopy: "Il meandro è lo stesso disegno spostato sempre di 4 quadretti verso destra. Uno spostamento che non ruota e non ribalta la figura si chiama traslazione. Contare i quadretti garantisce che ogni ripetizione sia identica alla prima: se sbagli un tratto, l’errore si vede subito nel confronto.",
    equality: "passo = 4 quadretti",
    steps: [
      ["Prima di iniziare", "Osserva il foglio a quadretti", "Disegnerai una greca alta 6 quadretti, con tre spirali. Ogni spirale è larga 3 quadretti e si ripete ogni 4.", "Lavora a matita: alla fine ripasserai con tratto marcato."],
      ["Passo 1 · Cornice", "Traccia le due linee di cornice", "Traccia due linee orizzontali lunghe 12 quadretti, distanti tra loro 6 quadretti.", "La fascia tra le due linee conterrà la greca."],
      ["Passo 2 · Linea di base", "Traccia la linea di base", "Un quadretto sopra la cornice in basso traccia la linea di base, lunga anche lei 12 quadretti.", "Le spirali partono tutte da questa linea."],
      ["Passo 3 · La prima spirale", "Disegna la spirale contando i quadretti", "Parti dall’inizio della linea di base e muoviti così: su 4, destra 3, giù 3, sinistra 2, su 2, destra 1, giù 1.", "Ogni tratto della spirale resta a un quadretto di distanza dagli altri."],
      ["Passo 4 · Ripeti", "Ripeti la spirale due volte", "Spostati di 4 quadretti a destra e ridisegna la stessa spirale. Poi spostati ancora di 4 quadretti e disegnala la terza volta.", "Confronta le tre spirali: devono essere identiche."],
      ["Passo 5 · Colora", "Colora la fascia", "Colora di rosso la striscia tra la cornice in basso e la linea di base, e di giallo la fascia con le spirali.", "Ripassa la linea della greca con un pennarello scuro."],
    ],
  }, (k, m) => {
    const griglia = m.reticolo(0, -2, 12, 6, 1);
    k.traccia("drawC1", [0, -1], [12, -1], [0.12, 0.5]);
    k.traccia("drawC2", [0, 5], [12, 5], [0.55, 0.94]);
    k.traccia("drawBase", [0, 0], [12, 0]);
    const gancio = (x) => [[x, 0], [x, 4], [x + 3, 4], [x + 3, 1], [x + 1, 1], [x + 1, 3], [x + 2, 3], [x + 2, 2]];
    const tratti = (x, pref, finestra) => {
      const p = gancio(x), w = finestre(p.length - 1, finestra[0], finestra[1]), nomi = [];
      for (let i = 0; i < p.length - 1; i += 1) { k.traccia(`${pref}${i + 1}`, p[i], p[i + 1], w[i]); nomi.push(`${pref}${i + 1}`); }
      return nomi;
    };
    const s1 = tratti(0, "drawS1x", [0.12, 0.94]);
    const s2 = tratti(4, "drawS2x", [0.12, 0.52]);
    const s3 = tratti(8, "drawS3x", [0.54, 0.94]);
    m.area([[0, -1], [12, -1], [12, 0], [0, 0]], "rosso", 5, 0.3);
    m.area([[0, 0], [12, 0], [12, 5], [0, 5]], "giallo", 5, 0.5, 0.45);
    const tutti = ["drawC1", "drawC2", "drawBase", ...s1, ...s2, ...s3];
    m.primoPiano(tutti);
    k.passo(...griglia);
    k.passo("drawC1", "drawC2");
    k.passo("drawBase");
    k.passo(...s1);
    k.passo(...s2, ...s3);
    k.passo();
    k.risultato(...tutti);
  });

  // ── 36 · Diagonali e mediane del quadrato ───────────────────────────────────
  TAVOLE["quadrato-diagonali-mediane"] = motivo({
    title: "Diagonali e mediane del quadrato",
    eyebrow: "Costruzione 36 · Struttura portante",
    subtitle: "Mediane e diagonali dividono il quadrato in triangoli; ripetute nei quadrati più piccoli diventano la base di un motivo simmetrico.",
    filename: "MC-DIS-1-01_quadrato-diagonali-mediane.ggb",
    coord: [-1, 9, -1, 9],
    proofTitle: "Quattro assi di simmetria",
    proofCopy: "Le due mediane e le due diagonali sono gli assi di simmetria del quadrato: se pieghi il foglio lungo uno di essi, le due metà combaciano. Ripetendo la costruzione nei quattro quadrati più piccoli ottieni 32 triangoli. Se colori allo stesso modo i triangoli che si corrispondono rispetto agli assi, il motivo resta simmetrico come il quadrato.",
    equality: "8 triangoli × 4 quadrati = 32 triangoli",
    steps: [
      ["Prima di iniziare", "Osserva il quadrato", "Hai un quadrato ABCD con il lato di 8 cm. Le linee che tracci sono la sua struttura portante: diagonali e mediane.", "Mediana: unisce i punti medi di due lati opposti. Diagonale: unisce due vertici opposti."],
      ["Passo 1 · Mediane", "Trova i punti medi e traccia le mediane", "Segna con il righello il punto medio di ogni lato, a 4 cm dai vertici, e numera i punti girando attorno al quadrato: 1 su AB, 2 su BC, 3 su CD, 4 su DA. Unisci 1 con 3 e 2 con 4.", "Le mediane dividono il quadrato in quattro quadrati di 4 cm."],
      ["Passo 2 · Diagonali", "Traccia le diagonali", "Unisci A con C e B con D. Le diagonali passano anche loro per il centro del quadrato.", "Ora il quadrato è diviso in 8 triangoli uguali."],
      ["Passo 3 · Diagonali piccole", "Traccia le diagonali dei quadrati piccoli", "In ognuno dei quattro quadrati di 4 cm traccia la diagonale che manca, quella che non passa per il centro del quadrato grande.", "In ogni quadrato piccolo una delle due diagonali esiste già: è metà di una diagonale grande."],
      ["Passo 4 · Mediane piccole", "Traccia le mediane dei quadrati piccoli", "In ogni quadrato piccolo segna i punti medi dei lati, a 2 cm dai vertici, e traccia le sue due mediane.", "Ora hai 32 triangoli."],
      ["Passo 5 · Colora", "Colora in modo simmetrico", "Colora i triangoli in modo che, piegando il foglio lungo una mediana o una diagonale del quadrato grande, le due metà abbiano gli stessi colori.", "Controlla: ogni triangolo colorato ha il suo gemello a specchio dello stesso colore."],
    ],
  }, (k, m) => {
    const A = k.punto("A", [0, 0]), B = k.punto("B", [8, 0]), C = k.punto("C", [8, 8]), D = k.punto("D", [0, 8]);
    k.seg("segAB", A, B); k.seg("segBC", B, C); k.seg("segCD", C, D); k.seg("segDA", D, A);
    const P = [[4, 0], [8, 4], [4, 8], [0, 4]];
    P.forEach((p, i) => { k.punto(`N${i + 1}`, p, String(i + 1)); k.compare(`N${i + 1}`, 0.2 + i * 0.05); });
    k.traccia("lineM1", P[0], P[2], [0.4, 0.66]); k.traccia("lineM2", P[3], P[1], [0.68, 0.94]);
    k.traccia("lineD1", A, C, [0.12, 0.52]); k.traccia("lineD2", B, D, [0.54, 0.94]);
    const dp = [[[4, 0], [0, 4]], [[4, 0], [8, 4]], [[8, 4], [4, 8]], [[0, 4], [4, 8]]];
    const w4 = finestre(4);
    dp.forEach(([a, b], i) => k.traccia(`lineE${i + 1}`, a, b, w4[i]));
    const mp = [[[2, 0], [2, 8]], [[6, 0], [6, 8]], [[0, 2], [8, 2]], [[0, 6], [8, 6]]];
    mp.forEach(([a, b], i) => k.traccia(`lineF${i + 1}`, a, b, w4[i]));
    // 32 triangoli: per ogni quadrato piccolo, 8 triangoli (vertice, punto medio, centro)
    const tris = [];
    [[0, 0], [4, 0], [4, 4], [0, 4]].forEach(([x, y]) => {
      const c = [x + 2, y + 2], V = [[x, y], [x + 4, y], [x + 4, y + 4], [x, y + 4]];
      V.forEach((a, i) => { const b = V[(i + 1) % 4], mm = medio(a, b); tris.push([a, mm, c], [mm, b, c]); });
    });
    // colore per orbita (simmetria del quadrato): distanza dal centro del baricentro, ripiegata sulle diagonali
    const orbita = (t) => {
      const g = [(t[0][0] + t[1][0] + t[2][0]) / 3 - 4, (t[0][1] + t[1][1] + t[2][1]) / 3 - 4];
      let u = Math.abs(g[0]), v = Math.abs(g[1]); if (u < v) [u, v] = [v, u];
      return `${u.toFixed(2)}_${v.toFixed(2)}`;
    };
    const orbite = [...new Set(tris.map(orbita))].sort();
    const tavolozza = ["rosso", null, "blu", "giallo", null, "verde"];
    tris.forEach((tr) => { const c = tavolozza[orbite.indexOf(orbita(tr)) % tavolozza.length]; if (c) m.area(tr, c, 5); });
    m.primoPiano("segAB", "segBC", "segCD", "segDA", "lineM1", "lineM2", "lineD1", "lineD2", "lineE1", "lineE2", "lineE3", "lineE4", "lineF1", "lineF2", "lineF3", "lineF4");
    k.passo("A", "B", "C", "D", "segAB", "segBC", "segCD", "segDA");
    k.passo("N1", "N2", "N3", "N4", "lineM1", "lineM2");
    k.passo("lineD1", "lineD2");
    k.passo("lineE1", "lineE2", "lineE3", "lineE4");
    k.passo("lineF1", "lineF2", "lineF3", "lineF4");
    k.passo();
    k.risultato("segAB", "segBC", "segCD", "segDA");
  });

  // ── 37 · Mediane del triangolo equilatero ───────────────────────────────────
  TAVOLE["triangolo-mediane"] = motivo({
    title: "Mediane del triangolo equilatero",
    eyebrow: "Costruzione 37 · Struttura portante",
    subtitle: "Mediane e triangolo dei punti medi dividono il triangolo equilatero in dodici parti: un modulo da colorare a girandola.",
    filename: "MC-DIS-1-01_triangolo-mediane.ggb",
    coord: [-1, 9, -1.2, 7.9],
    proofTitle: "Il baricentro e il triangolo dei punti medi",
    proofCopy: "Le tre mediane si incontrano in un solo punto, il baricentro G. Il segmento che unisce i punti medi di due lati è parallelo al terzo lato e lungo la metà: per questo i punti medi formano un triangolo equilatero più piccolo, capovolto. Ogni mediana taglia a metà il lato di questo triangolo che attraversa. Colorando in modo diverso le due metà di ogni triangolo d’angolo ottieni una girandola: il disegno torna uguale dopo un terzo di giro.",
    equality: "3 × 120° = 360°",
    steps: [
      ["Prima di iniziare", "Osserva il segmento AB", "Hai il segmento AB, lungo 8 cm: è la base di un triangolo equilatero, cioè con tre lati uguali.", "Ti servono compasso e righello."],
      ["Passo 1 · Terzo vertice", "Costruisci il triangolo equilatero", "Apri il compasso quanto AB. Punta in A e traccia un arco sopra il segmento, poi punta in B e traccia un secondo arco: si incontrano in C. Unisci C con A e con B.", "AC e BC sono lunghi 8 cm come AB."],
      ["Passo 2 · Mediane", "Trova i punti medi e traccia le mediane", "Segna il punto medio di ogni lato, a 4 cm dai vertici: 1 su AB, 2 su BC, 3 su CA. Unisci ogni punto medio con il vertice opposto: A con 2, B con 3, C con 1.", "Mediana del triangolo: unisce un vertice con il punto medio del lato opposto. Le tre mediane si incontrano nel baricentro G."],
      ["Passo 3 · Punti medi", "Unisci i punti medi", "Unisci 1 con 2, 2 con 3 e 3 con 1: ottieni un triangolo equilatero capovolto, con il lato di 4 cm.", "Ora il triangolo è diviso in dodici parti."],
      ["Passo 4 · Colora", "Colora a girandola", "Nei tre triangoli d’angolo colora di rosso la metà a sinistra della mediana e di giallo la metà a destra, guardando dal vertice verso il centro (gira il foglio per avere ogni volta il vertice vicino a te). Nel triangolo centrale alterna blu e azzurro.", "Gira il foglio di un terzo di giro: il disegno resta uguale."],
    ],
  }, (k, m) => {
    const L = 8, h = (L * Math.sqrt(3)) / 2;
    const A = k.punto("A", [0, 0]), B = k.punto("B", [L, 0]);
    k.seg("segAB", A, B);
    const C = [L / 2, h];
    k.arco("arcA", A, L, 45, 30, [0.12, 0.4]);
    k.arco("arcB", B, L, 105, 30, [0.42, 0.7]);
    k.punto("C", C); k.compare("C", 0.7);
    k.traccia("segAC", A, C, [0.72, 0.83]); k.traccia("segBC", B, C, [0.84, 0.95]);
    const M1 = medio(A, B), M2 = medio(B, C), M3 = medio(C, A), G = [L / 2, h / 3];
    k.punto("N1", M1, "1"); k.punto("N2", M2, "2"); k.punto("N3", M3, "3");
    ["N1", "N2", "N3"].forEach((n, i) => k.compare(n, 0.15 + i * 0.05));
    const w3 = finestre(3, 0.3, 0.94);
    k.traccia("lineMa", A, M2, w3[0]); k.traccia("lineMb", B, M3, w3[1]); k.traccia("lineMc", C, M1, w3[2]);
    k.punto("G", G); k.compare("G", 0.95);
    const w3b = finestre(3);
    k.traccia("lineP1", M1, M2, w3b[0]); k.traccia("lineP2", M2, M3, w3b[1]); k.traccia("lineP3", M3, M1, w3b[2]);
    // triangoli d'angolo: vertice, punto medio, punto di mezzo del lato del triangolo centrale
    const angoli = [[A, M1, M3], [B, M2, M1], [C, M3, M2]];
    angoli.forEach(([V, Mdx, Msx]) => {
      const X = medio(Mdx, Msx);
      m.area([V, Mdx, X], "giallo", 4, 0.3);
      m.area([V, X, Msx], "rosso", 4, 0.3);
    });
    const centrali = [[M1, M2], [M2, M3], [M3, M1]];
    centrali.forEach(([a, b]) => {
      const X = medio(a, b);
      m.area([G, a, X], "blu", 4, 0.6);
      m.area([G, X, b], "azzurro", 4, 0.6);
    });
    m.primoPiano("segAB", "segAC", "segBC", "lineMa", "lineMb", "lineMc", "lineP1", "lineP2", "lineP3");
    k.passo("A", "B", "segAB");
    k.passo("arcA", "arcB", "C", "segAC", "segBC");
    k.passo("N1", "N2", "N3", "lineMa", "lineMb", "lineMc", "G");
    k.passo("lineP1", "lineP2", "lineP3");
    k.passo();
    k.risultato("segAB", "segAC", "segBC");
  });

  // ── 38 · Optical Art: scacchiera con cerchio a colori invertiti ────────────
  /** Ritaglia un poligono convesso con un rettangolo (Sutherland–Hodgman). */
  function ritaglia(poligono, x0, y0, x1, y1) {
    const lati = [[0, x0, 1], [0, x1, -1], [1, y0, 1], [1, y1, -1]];
    let out = poligono;
    lati.forEach(([ax, v, s]) => {
      const dentro = (p) => s * (p[ax] - v) >= -1e-9, inp = out; out = [];
      inp.forEach((p, i) => {
        const q = inp[(i + 1) % inp.length];
        if (dentro(p)) out.push(p);
        if (dentro(p) !== dentro(q)) { const t = (v - p[ax]) / (q[ax] - p[ax]); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
      });
    });
    return out;
  }
  TAVOLE["optical-scacchiera"] = motivo({
    title: "Optical Art: scacchiera con cerchio",
    eyebrow: "Costruzione 38 · Optical Art in bianco e nero",
    subtitle: "Una scacchiera e una circonferenza: dentro il cerchio il bianco e il nero si scambiano, e il cerchio sembra staccarsi dal foglio.",
    filename: "MC-DIS-1-01_optical-scacchiera.ggb",
    coord: [-0.8, 10.8, -0.8, 8.8],
    proofTitle: "Un contorno che non c’è",
    proofCopy: "La circonferenza alla fine non è ripassata, eppure il cerchio si vede benissimo: lungo il suo bordo ogni casella cambia colore, e l’occhio unisce tutti quei cambi in una linea. È il principio dell’Optical Art, nata negli anni Sessanta del Novecento: forme semplici, bianco e nero, e un’illusione ottica che fa sembrare il disegno in movimento o in rilievo.",
    equality: "dentro il cerchio: nero ↔ bianco",
    steps: [
      ["Prima di iniziare", "Osserva il rettangolo", "Hai un rettangolo di 10 × 8 cm. Diventerà una scacchiera con caselle da 1 cm.", "Ti servono righello, compasso e un pennarello nero."],
      ["Passo 1 · Struttura", "Traccia la maglia di 1 cm", "Segna un punto ogni centimetro sui quattro lati e unisci i punti opposti: 9 linee verticali e 7 orizzontali.", "È la struttura del disegno: tracciala leggera."],
      ["Passo 2 · Circonferenza", "Traccia la circonferenza", "Punta il compasso nell’incrocio al centro del rettangolo, il punto O, e traccia una circonferenza di raggio 3 cm.", "La circonferenza taglia molte caselle in due pezzi."],
      ["Passo 3 · Fuori dal cerchio", "Colora a scacchiera fuori dal cerchio", "Colora di nero una casella sì e una no, partendo dall’angolo in basso a sinistra. Quando una casella è tagliata dalla circonferenza, colora solo il pezzo che sta fuori.", "Due caselle con un lato in comune non hanno mai lo stesso colore."],
      ["Passo 4 · Dentro il cerchio", "Inverti i colori dentro il cerchio", "Dentro il cerchio fai il contrario: colora di nero le caselle (o i pezzi) che nella scacchiera sarebbero bianche e lascia bianche quelle che sarebbero nere.", "Lungo la circonferenza ogni pezzo nero ne tocca uno bianco."],
    ],
  }, (k, m) => {
    const W = 10, H = 8, O = [5, 4], r = 3;
    ["A", "B", "C", "D"].forEach((n, i) => k.punto(n, [[0, 0], [W, 0], [W, H], [0, H]][i]));
    k.seg("segAB", [0, 0], [W, 0]); k.seg("segBC", [W, 0], [W, H]); k.seg("segCD", [W, H], [0, H]); k.seg("segDA", [0, H], [0, 0]);
    const wv = finestre(9, 0.12, 0.55), wo = finestre(7, 0.57, 0.94), maglia = [];
    for (let i = 1; i < W; i += 1) { k.traccia(`lineV${i}`, [i, 0], [i, H], wv[i - 1]); maglia.push(`lineV${i}`); }
    for (let j = 1; j < H; j += 1) { k.traccia(`lineO${j}`, [0, j], [W, j], wo[j - 1]); maglia.push(`lineO${j}`); }
    k.punto("O", O); k.compare("O", 0.12);
    k.arco("arcCirc", O, r, 0, 360, [0.2, 0.94]);
    const disco = cerchioPunti(O, r, 96);
    // strato 0: scacchiera intera; strato 1: disco bianco; strato 2: pezzi invertiti dentro il cerchio
    for (let i = 0; i < W; i += 1) for (let j = 0; j < H; j += 1) {
      if ((i + j) % 2 === 0) m.area([[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], "nero", 3, 0.14 + 0.75 * (i + j) / (W + H - 2), 0.95);
      else { const pezzo = ritaglia(disco, i, j, i + 1, j + 1); if (pezzo.length >= 3) m.stile(m.area(pezzo, "nero", 4, 0.14 + 0.75 * (i + j) / (W + H - 2), 0.95), { layer: 2 }); }
    }
    m.stile(m.area(disco, "bianco", 3, 0.12, 1), { layer: 1 });
    m.primoPiano("segAB", "segBC", "segCD", "segDA", maglia, "arcCirc");
    ["segAB", "segBC", "segCD", "segDA", ...maglia, "arcCirc"].forEach((n) => m.stile(n, { layer: 3 }));
    k.passo("A", "B", "C", "D", "segAB", "segBC", "segCD", "segDA");
    k.passo(...maglia);
    k.passo("O", "arcCirc");
    k.passo();
    k.passo();
    k.risultato("segAB", "segBC", "segCD", "segDA");
  });

  // ── 39 · Optical Art a colori: cerchi e quadrati nella maglia ──────────────
  TAVOLE["optical-cerchi-maglia"] = motivo({
    title: "Optical Art a colori: cerchi e quadrati",
    eyebrow: "Costruzione 39 · Alla maniera di Vasarely",
    subtitle: "Una maglia di quadrati da 2 cm; al centro di ognuno un cerchio o un quadrato della stessa misura, con colori a contrasto.",
    filename: "MC-DIS-1-01_optical-cerchi-maglia.ggb",
    coord: [-0.8, 8.8, -0.8, 8.8],
    proofTitle: "Le diagonali trovano il centro",
    proofCopy: "Le diagonali di un quadrato si incontrano nel suo centro: è il punto dove puntare il compasso. Ogni cerchio ha il raggio di 0,8 cm; ogni quadrato interno ha i vertici sulle diagonali ed è largo 1,6 cm, quanto il cerchio. Figure uguali ripetute con ordine, colori accesi e contrastanti: così Victor Vasarely faceva «vibrare» i suoi quadri.",
    equality: "raggio = 0,8 cm · maglia = 2 cm",
    steps: [
      ["Prima di iniziare", "Osserva il quadrato", "Hai un quadrato con il lato di 8 cm. Lo dividerai in una maglia di 4 × 4 caselle da 2 cm. Sul foglio da disegno puoi farlo più grande: 20 cm di lato, 10 × 10 caselle.", "Maglia: rete di linee che divide il foglio in parti uguali."],
      ["Passo 1 · Maglia", "Traccia la maglia di 2 cm", "Segna sui lati i punti a 2, 4 e 6 cm e traccia le linee verticali e orizzontali.", "Ottieni 16 caselle uguali."],
      ["Passo 2 · Centri", "Traccia le diagonali delle caselle", "In ogni casella traccia le due diagonali con tratto leggero: si incontrano nel centro.", "Le diagonali servono solo a trovare i centri: alla fine le cancellerai."],
      ["Passo 3 · Cerchi", "Traccia i cerchi nelle caselle del bordo", "Apri il compasso a 0,8 cm. Punta nel centro di ognuna delle 12 caselle del bordo e traccia una circonferenza.", "Tra il cerchio e i lati della casella restano 2 mm."],
      ["Passo 4 · Quadrati", "Disegna i quadrati nelle caselle al centro", "Nelle 4 caselle centrali disegna un quadrato con i lati paralleli a quelli della casella, a 2 mm di distanza: è largo 1,6 cm, come il cerchio.", "I vertici del quadrato stanno sulle diagonali."],
      ["Passo 5 · Colora", "Colora a contrasto", "Colora le caselle a scacchiera in blu e viola. Colora le figure delle caselle blu in giallo e quelle delle caselle viola in arancione.", "Cancella le diagonali prima di colorare."],
    ],
  }, (k, m) => {
    const S = 8, c = 2, r = 0.8;
    ["A", "B", "C", "D"].forEach((n, i) => k.punto(n, [[0, 0], [S, 0], [S, S], [0, S]][i]));
    k.seg("segAB", [0, 0], [S, 0]); k.seg("segBC", [S, 0], [S, S]); k.seg("segCD", [S, S], [0, S]); k.seg("segDA", [0, S], [0, 0]);
    const w6 = finestre(6), maglia = [];
    [2, 4, 6].forEach((v, i) => {
      k.traccia(`lineV${i + 1}`, [v, 0], [v, S], w6[i]); k.traccia(`lineO${i + 1}`, [0, v], [S, v], w6[i + 3]);
      maglia.push(`lineV${i + 1}`, `lineO${i + 1}`);
    });
    const diag = [], cerchi = [], quadrati = [], wd = finestre(16), wc = finestre(12), wq = finestre(4);
    let n = 0, nc = 0, nq = 0;
    for (let j = 0; j < 4; j += 1) for (let i = 0; i < 4; i += 1) {
      n += 1;
      const x = i * c, y = j * c, centro = [x + 1, y + 1];
      k.seg(`lineX${n}a`, [x, y], [x + c, y + c]); k.seg(`lineX${n}b`, [x + c, y], [x, y + c]);
      k.compare(`lineX${n}a`, wd[n - 1][0]); k.compare(`lineX${n}b`, wd[n - 1][0]);
      k.tratteggia(`lineX${n}a`); k.tratteggia(`lineX${n}b`);
      diag.push(`lineX${n}a`, `lineX${n}b`);
      const scuro = (i + j) % 2 === 0, centrale = i >= 1 && i <= 2 && j >= 1 && j <= 2;
      m.area([[x, y], [x + c, y], [x + c, y + c], [x, y + c]], scuro ? "blu" : "viola", 5, 0.2);
      if (centrale) {
        const q = [[centro[0] - r, centro[1] - r], [centro[0] + r, centro[1] - r], [centro[0] + r, centro[1] + r], [centro[0] - r, centro[1] + r]];
        quadrati.push(...m.lati(`drawQ${nq + 1}x`, [q], wq[nq])); nq += 1;
        m.stile(m.area(q, scuro ? "giallo" : "arancio", 5, 0.6, 0.95), { layer: 1 });
      } else {
        k.arco(`arcK${nc + 1}`, centro, r, 0, 360, wc[nc]); cerchi.push(`arcK${nc + 1}`); nc += 1;
        m.stile(m.area(cerchioPunti(centro, r), scuro ? "giallo" : "arancio", 5, 0.6, 0.95), { layer: 1 });
      }
    }
    m.primoPiano("segAB", "segBC", "segCD", "segDA", maglia, cerchi, quadrati);
    k.passo("A", "B", "C", "D", "segAB", "segBC", "segCD", "segDA");
    k.passo(...maglia);
    k.passo(...diag);
    k.passo(...cerchi);
    k.passo(...quadrati);
    k.passo();
    k.risultato("segAB", "segBC", "segCD", "segDA", ...quadrati);
  });

  // ── 40 · Stella a 8 punte dalla circonferenza ──────────────────────────────
  TAVOLE["stella-otto-punte"] = motivo({
    title: "Stella a otto punte",
    eyebrow: "Costruzione 40 · Motivi arabi",
    subtitle: "Una circonferenza divisa ogni 45° e otto corde che saltano due punti: nasce la stella degli arabeschi.",
    filename: "MC-DIS-1-01_stella-otto-punte.ggb",
    coord: [-5.2, 5.2, -4.8, 4.8],
    proofTitle: "Corde tutte uguali, alla stessa distanza dal centro",
    proofCopy: "Gli otto punti dividono la circonferenza in archi uguali da 45°. Ogni corda unisce due punti separati da tre archi, cioè 135°: tutte le corde sono uguali e stanno alla stessa distanza dal centro. Per questo si tagliano formando una stella regolare con otto punte, e al centro resta un ottagono regolare. Molti arabeschi dell’arte islamica nascono così, dal cerchio.",
    equality: "360° : 8 = 45°",
    steps: [
      ["Prima di iniziare", "Osserva il segmento AB", "Hai un segmento AB di 8 cm con il punto medio O. Da qui nasce la circonferenza che contiene la stella.", "Ti servono compasso, goniometro e righello."],
      ["Passo 1 · Circonferenza", "Traccia l’asse e la circonferenza", "Con la squadra traccia la perpendicolare ad AB nel punto O: è l’asse del segmento. Poi apri il compasso da O ad A e traccia la circonferenza.", "La circonferenza passa per A e per B: il raggio è 4 cm."],
      ["Passo 2 · Otto punti", "Dividi la circonferenza ogni 45°", "Con il goniometro centrato in O traccia le due rette a 45° rispetto ad AB. Insieme ad AB e all’asse tagliano la circonferenza in 8 punti: numera i punti da 1 a 8 in senso antiorario. B è il punto 1, A è il punto 5.", "Tra due punti vicini c’è sempre un angolo di 45°."],
      ["Passo 3 · Stella", "Unisci i punti saltandone due", "Unisci ogni punto con quello tre posti più avanti: 1 con 4, 2 con 5, 3 con 6… fino a 8 con 3.", "Corda: segmento che unisce due punti della circonferenza. Le otto corde si incrociano formando la stella e, al centro, un ottagono."],
      ["Passo 4 · Colora", "Colora stella e ottagono", "Colora di blu le parti tra la stella e la circonferenza, di rosso la stella e di giallo l’ottagono al centro.", "Ripassa con tratto marcato il contorno della stella."],
    ],
  }, (k, m) => {
    const R = 4, O = [0, 0];
    k.punto("A", [-R, 0]); k.punto("B", [R, 0]); k.punto("O", O);
    k.seg("segAB", [-R, 0], [R, 0]);
    k.traccia("lineAsse", [0, -R - 0.6], [0, R + 0.6], [0.12, 0.4]);
    k.arco("arcCirc", O, R, 0, 360, [0.45, 0.94]);
    const P = Array.from({ length: 8 }, (_, i) => polare(O, R, 45 * i));
    k.traccia("lineR1", polare(O, R + 0.6, 45), polare(O, R + 0.6, 225), [0.12, 0.45]);
    k.traccia("lineR2", polare(O, R + 0.6, 135), polare(O, R + 0.6, 315), [0.47, 0.8]);
    const sett = k.settore("angS45", O, 1.3, 0, 45, "45°");
    // B è il punto 1 e A il punto 5: lì il numero non si scrive, per non sovrapporlo alla lettera
    const numerati = [];
    P.forEach((p, i) => { if (i % 4 === 0) return; k.punto(`N${i + 1}`, p, String(i + 1)); k.compare(`N${i + 1}`, 0.82 + i * 0.015); numerati.push(`N${i + 1}`); });
    const w8 = finestre(8), corde = [];
    P.forEach((p, i) => { k.traccia(`drawK${i + 1}`, p, P[(i + 3) % 8], w8[i]); corde.push(`drawK${i + 1}`); });
    const ri = (R * Math.cos((3 * Math.PI) / 8)) / Math.cos((2 * Math.PI) / 8);
    const stella = [];
    for (let i = 0; i < 8; i += 1) { stella.push(polare(O, R, 45 * i)); stella.push(polare(O, ri, 45 * i + 22.5)); }
    const ro = (R * Math.cos((3 * Math.PI) / 8)) / Math.cos(Math.PI / 8);
    m.area(cerchioPunti(O, R, 72), "blu", 4, 0.2, 0.6);
    m.area(stella, "rosso", 4, 0.45);
    m.area(Array.from({ length: 8 }, (_, i) => polare(O, ro, 45 * i)), "giallo", 4, 0.7, 0.95);
    m.primoPiano("segAB", "lineAsse", "arcCirc", corde, "lineR1", "lineR2");
    k.passo("A", "B", "O", "segAB");
    k.passo("lineAsse", "arcCirc");
    k.passo("lineR1", "lineR2", ...sett, ...numerati);
    k.passo(...corde);
    k.passo();
    k.risultato(...corde);
  });

  // ── 41 · Rosone a sei petali ────────────────────────────────────────────────
  TAVOLE["rosone-sei-petali"] = motivo({
    title: "Rosone a sei petali",
    eyebrow: "Costruzione 41 · Mandala e rosoni",
    subtitle: "Con una sola apertura del compasso: la circonferenza, sei punti e sei archi che disegnano un fiore.",
    filename: "MC-DIS-1-01_rosone-sei-petali.ggb",
    coord: [-4.2, 4.2, -3.8, 3.8],
    proofTitle: "Il raggio sta sei volte nella circonferenza",
    proofCopy: "Riportando il raggio sulla circonferenza si trovano sei punti esattamente: è la stessa costruzione dell’esagono inscritto. Ogni arco di petalo ha il centro in uno dei sei punti e lo stesso raggio, quindi passa per il centro O e per i due punti vicini. Gli archi con centro in due punti alterni, per esempio 1 e 3, si incontrano in O e nel punto in mezzo, il 2: lo spazio tra loro è un petalo.",
    equality: "6 petali × 60° = 360°",
    steps: [
      ["Prima di iniziare", "Osserva il punto O", "Hai il punto O, centro del rosone. Userai sempre la stessa apertura del compasso: 3 cm.", "Non cambiare mai l’apertura: è il segreto di questa costruzione."],
      ["Passo 1 · Circonferenza", "Traccia la circonferenza", "Apri il compasso a 3 cm, punta in O e traccia la circonferenza. Segna in alto il punto 1.", "Il punto 1 può stare ovunque sulla circonferenza."],
      ["Passo 2 · Sei punti", "Riporta il raggio sulla circonferenza", "Punta in 1 e traccia un archetto che taglia la circonferenza: è il punto 2. Punta in 2 e trova 3, e così via fino a 6, procedendo in senso orario.", "L’ultimo archetto, da 6, deve cadere esattamente su 1."],
      ["Passo 3 · Petali", "Traccia sei archi dentro la circonferenza", "Punta in 1 e traccia l’arco che va da 6 a 2 passando per O. Ripeti puntando negli altri cinque punti.", "Ogni arco passa per il centro O."],
      ["Passo 4 · Colora", "Colora i petali", "Colora i petali alternando rosso e blu. Colora di giallo lo spazio tra i petali.", "Tre petali rossi e tre blu, uno sì e uno no."],
    ],
  }, (k, m) => {
    const R = 3, O = [0, 0];
    k.punto("O", O);
    const P = Array.from({ length: 6 }, (_, i) => polare(O, R, 90 - 60 * i));
    k.arco("arcCirc", O, R, 90, 360, [0.12, 0.8]);
    k.punto("N1", P[0], "1"); k.compare("N1", 0.85);
    const w6 = finestre(5), punti = ["N1"], archetti = [];
    for (let i = 1; i < 6; i += 1) {
      k.archetto(`arcT${i}`, P[i - 1], P[i], 14, w6[i - 1]); archetti.push(`arcT${i}`);
      k.punto(`N${i + 1}`, P[i], String(i + 1)); k.compare(`N${i + 1}`, w6[i - 1][1]); punti.push(`N${i + 1}`);
    }
    const wp = finestre(6), petali = [];
    P.forEach((p, i) => {
      // arco antiorario dal punto che precede a quello che segue, passando per O
      k.arco(`arcP${i + 1}`, p, R, direzione(p, P[(i + 5) % 6]), 120, wp[i]);
      petali.push(`arcP${i + 1}`);
    });
    m.area(cerchioPunti(O, R, 72), "giallo", 4, 0.2, 0.55);
    P.forEach((p, i) => {
      const prec = P[(i + 5) % 6], succ = P[(i + 1) % 6];
      const forma = [...arcoPunti(succ, O, p), ...arcoPunti(prec, p, O).slice(1, -1)];
      m.area(forma, i % 2 ? "blu" : "rosso", 4, 0.5);
    });
    m.primoPiano("arcCirc", archetti, petali);
    k.passo("O");
    k.passo("arcCirc", "N1");
    k.passo(...archetti, ...punti.slice(1));
    k.passo(...petali);
    k.passo();
  });

  // ── 42 · Girandola di quadrati ──────────────────────────────────────────────
  TAVOLE["girandola-quadrati"] = motivo({
    title: "Girandola di quadrati",
    eyebrow: "Costruzione 42 · Girandole",
    subtitle: "Un quadrato dentro l’altro, ognuno un po’ ruotato: dai triangolini colorati nascono quattro bracci a spirale.",
    filename: "MC-DIS-1-01_girandola-quadrati.ggb",
    coord: [-1, 9, -1, 9],
    proofTitle: "Quattro triangoli uguali, un quadrato ruotato",
    proofCopy: "Su ogni lato misuri la stessa distanza, girando sempre nello stesso verso. I quattro triangolini che restano negli angoli sono uguali tra loro, quindi i nuovi lati sono uguali e formano un quadrato, un po’ più piccolo e ruotato. Ripetendo la costruzione la rotazione si accumula: i triangolini dello stesso colore si allineano lungo una spirale.",
    equality: "lato: 8 cm → circa 7,1 cm → circa 6,2 cm…",
    steps: [
      ["Prima di iniziare", "Osserva il quadrato", "Hai un quadrato ABCD con il lato di 8 cm. Dentro disegnerai otto quadrati, uno dentro l’altro.", "Gira sempre nello stesso verso: antiorario, da A verso B."],
      ["Passo 1 · Primo giro", "Segna 1 cm su ogni lato e unisci", "Su ogni lato segna un punto a 1 cm dal vertice di partenza: su AB a 1 cm da A, su BC a 1 cm da B, su CD a 1 cm da C, su DA a 1 cm da D. Unisci i quattro punti.", "Ottieni un quadrato ruotato, con il lato di circa 7,1 cm."],
      ["Passo 2 · Secondo giro", "Ripeti sul nuovo quadrato", "Sul nuovo quadrato misura ancora 1 cm da ogni vertice, nello stesso verso, e unisci i punti.", "Misura sempre 1 cm: il quadrato si rimpicciolisce e ruota sempre di più."],
      ["Passo 3 · Continua", "Altri sei quadrati", "Continua allo stesso modo finché hai disegnato otto quadrati dentro ABCD.", "Gli ultimi quadrati sono piccoli: usa una matita ben appuntita."],
      ["Passo 4 · Colora", "Colora i triangolini", "In ogni giro ci sono quattro triangolini. Colora di rosso quelli vicini ai vertici B e D, di blu quelli vicini ad A e C, e continua lungo la stessa spirale.", "Compaiono quattro bracci a spirale, come in una girandola."],
    ],
  }, (k, m) => {
    let Q = [[0, 0], [8, 0], [8, 8], [0, 8]];
    ["A", "B", "C", "D"].forEach((n, i) => k.punto(n, Q[i]));
    k.seg("segAB", Q[0], Q[1]); k.seg("segBC", Q[1], Q[2]); k.seg("segCD", Q[2], Q[3]); k.seg("segDA", Q[3], Q[0]);
    const giri = [];
    for (let g = 0; g < 8; g += 1) {
      const N = Q.map((v, i) => { const w = Q[(i + 1) % 4], d = distanza(v, w); return [v[0] + (w[0] - v[0]) / d, v[1] + (w[1] - v[1]) / d]; });
      for (let i = 0; i < 4; i += 1) m.area([N[i], Q[(i + 1) % 4], N[(i + 1) % 4]], i % 2 ? "blu" : "rosso", 4, 0.12 + 0.1 * g);
      giri.push(N); Q = N;
    }
    const nomi = giri.map((N, g) => {
      let fin;
      if (g === 0 || g === 1) fin = finestre(4);
      else { const tutte = finestre(24); fin = tutte.slice((g - 2) * 4, (g - 1) * 4); }
      return N.map((p, i) => { const n = `drawG${g + 1}x${i + 1}`; k.traccia(n, p, N[(i + 1) % 4], fin[i]); return n; });
    });
    m.primoPiano("segAB", "segBC", "segCD", "segDA", nomi);
    k.passo("A", "B", "C", "D", "segAB", "segBC", "segCD", "segDA");
    k.passo(...nomi[0]);
    k.passo(...nomi[1]);
    k.passo(...nomi.slice(2).flat());
    k.passo();
    k.risultato("segAB", "segBC", "segCD", "segDA", ...nomi.flat());
  });

  // ── 43 · Formella cosmatesca ────────────────────────────────────────────────
  TAVOLE["formella-cosmatesca"] = motivo({
    title: "Formella cosmatesca",
    eyebrow: "Costruzione 43 · Motivi cosmateschi",
    subtitle: "Punti medi uniti tra loro, più volte: triangoli sempre più piccoli attorno a un rombo e a una ruota centrale.",
    filename: "MC-DIS-1-01_formella-cosmatesca.ggb",
    coord: [-1, 9, -1, 9],
    proofTitle: "Unire i punti medi divide in quattro",
    proofCopy: "Se unisci i punti medi dei lati di un triangolo, lo dividi in quattro triangoli uguali, con la stessa forma di quello di partenza. Ripetendo l’operazione nei triangoli d’angolo, la figura si riempie di triangoli sempre più piccoli. I Cosmati, artigiani romani del marmo vissuti nel Medioevo, decoravano così i pavimenti delle chiese, con porfido rosso, serpentino verde e marmo bianco.",
    equality: "1 triangolo → 4 triangoli uguali",
    steps: [
      ["Prima di iniziare", "Osserva la formella", "Hai una formella quadrata con il lato di 8 cm. La decorerai con un rombo, triangoli sempre più piccoli e una ruota al centro.", "Formella: piastrella decorata, usata per i pavimenti."],
      ["Passo 1 · Rombo", "Unisci i punti medi dei lati", "Segna il punto medio di ogni lato, a 4 cm dai vertici: 1, 2, 3 e 4. Unisci 1 con 2, 2 con 3, 3 con 4 e 4 con 1.", "In realtà è un quadrato ruotato di 45°; negli angoli restano quattro triangoli."],
      ["Passo 2 · Triangoli d’angolo", "Dividi i triangoli d’angolo", "In ogni triangolo d’angolo trova i punti medi dei suoi tre lati e uniscili: il triangolo si divide in quattro.", "Il triangolino al centro è capovolto rispetto agli altri tre."],
      ["Passo 3 · Ancora più piccoli", "Ripeti nei triangolini", "Nei triangolini che toccano i vertici del triangolo d’angolo unisci di nuovo i punti medi. Lascia intero il triangolino capovolto.", "I lati più corti misurano 1 cm."],
      ["Passo 4 · Ruota", "Traccia la ruota al centro", "Trova il centro della formella unendo con tratto leggero 1 con 3 e 2 con 4. Punta lì e traccia due circonferenze: raggio 2 cm e raggio 1,3 cm.", "La ruota sta tutta dentro il rombo."],
      ["Passo 5 · Colora", "Colora come i marmi", "Colora di verde il rombo, di rosso il cerchio grande e d’oro quello piccolo. Nei triangoli d’angolo i triangolini capovolti restano bianchi, gli altri sono rossi.", "Alterna i colori di formelle vicine per un pavimento intero."],
    ],
  }, (k, m) => {
    const V = [[0, 0], [8, 0], [8, 8], [0, 8]], O = [4, 4];
    ["A", "B", "C", "D"].forEach((n, i) => k.punto(n, V[i]));
    k.seg("segAB", V[0], V[1]); k.seg("segBC", V[1], V[2]); k.seg("segCD", V[2], V[3]); k.seg("segDA", V[3], V[0]);
    const M = V.map((v, i) => medio(v, V[(i + 1) % 4]));
    M.forEach((p, i) => { k.punto(`N${i + 1}`, p, String(i + 1)); k.compare(`N${i + 1}`, 0.15 + 0.03 * i); });
    const w4 = finestre(4, 0.3, 0.94);
    const rombo = M.map((p, i) => { k.traccia(`drawR${i + 1}`, p, M[(i + 1) % 4], w4[i]); return `drawR${i + 1}`; });
    const angoli = V.map((v, i) => [v, M[i], M[(i + 3) % 4]]);
    const liv1 = [], liv2 = [];
    const w12 = finestre(12), w36 = finestre(36);
    let n1 = 0, n2 = 0;
    angoli.forEach(([a, b, c]) => {
      const ab = medio(a, b), bc = medio(b, c), ca = medio(c, a);
      [[ab, bc], [bc, ca], [ca, ab]].forEach(([p, q]) => { n1 += 1; k.traccia(`lineT${n1}`, p, q, w12[n1 - 1]); liv1.push(`lineT${n1}`); });
      m.area([ab, bc, ca], "bianco", 5, 0.5, 0.95);
      [[a, ab, ca], [ab, b, bc], [ca, bc, c]].forEach(([x, y, z]) => {
        const xy2 = medio(x, y), yz = medio(y, z), zx = medio(z, x);
        [[xy2, yz], [yz, zx], [zx, xy2]].forEach(([p, q]) => { n2 += 1; k.traccia(`lineU${n2}`, p, q, w36[n2 - 1]); liv2.push(`lineU${n2}`); });
        [[x, xy2, zx], [xy2, y, yz], [zx, yz, z]].forEach((tr) => m.area(tr, "porfido", 5, 0.3, 0.95));
        m.area([xy2, yz, zx], "bianco", 5, 0.5, 0.95);
      });
    });
    m.area(M, "serpentino", 5, 0.15, 0.9);
    k.arco("arcRota1", O, 2, 0, 360, [0.12, 0.52]); k.arco("arcRota2", O, 1.3, 0, 360, [0.54, 0.94]);
    m.area(cerchioPunti(O, 2), "porfido", 5, 0.7, 0.95);
    m.area(cerchioPunti(O, 1.3), "oro", 5, 0.8, 0.95);
    m.primoPiano("segAB", "segBC", "segCD", "segDA", rombo, liv1, liv2, "arcRota1", "arcRota2");
    k.passo("A", "B", "C", "D", "segAB", "segBC", "segCD", "segDA");
    k.passo("N1", "N2", "N3", "N4", ...rombo);
    k.passo(...liv1);
    k.passo(...liv2);
    k.passo("arcRota1", "arcRota2");
    k.passo();
    k.risultato("segAB", "segBC", "segCD", "segDA", ...rombo);
  });

  // ── 44 · Circonferenze traslate ─────────────────────────────────────────────
  TAVOLE["circonferenze-traslate"] = motivo({
    title: "Circonferenze traslate",
    eyebrow: "Costruzione 44 · Pattern di circonferenze",
    subtitle: "La stessa circonferenza ripetuta su ogni nodo di un reticolo: dagli incroci nascono fiori a quattro petali.",
    filename: "MC-DIS-1-01_circonferenze-traslate.ggb",
    coord: [-1.7, 7.7, -1.7, 5.7],
    proofTitle: "Il raggio è metà della diagonale",
    proofCopy: "Il raggio è la distanza tra un nodo e il centro di un quadretto vicino, cioè metà della diagonale del quadretto: circa 1,41 cm per quadretti da 2 cm. Così due circonferenze vicine si incontrano proprio nei centri dei quadretti. Attorno a ogni centro si toccano quattro «lenti»: è il fiore a quattro petali. Spostare la stessa figura a passo costante si chiama traslazione.",
    equality: "raggio = diagonale : 2 ≈ 1,41 cm",
    steps: [
      ["Prima di iniziare", "Osserva il reticolo", "Hai un reticolo a quadretti con il lato di 2 cm. I nodi, cioè gli incroci delle linee, saranno i centri delle circonferenze.", "Ogni circonferenza ha la stessa apertura del compasso."],
      ["Passo 1 · Apertura", "Prima fila di circonferenze", "Apri il compasso dal nodo in basso a sinistra fino al centro del quadretto vicino: circa 1,4 cm. Per trovare il centro del quadretto traccia leggere le sue due diagonali. Punta su ognuno dei quattro nodi della fila in basso e traccia le circonferenze.", "Due circonferenze vicine si incontrano nei centri dei quadretti."],
      ["Passo 2 · Le altre file", "Ripeti su tutti i nodi", "Con la stessa apertura punta sui nodi delle altre due file e traccia le circonferenze.", "Non cambiare l’apertura: se il compasso si chiude un po’, i fiori non si chiudono."],
      ["Passo 3 · Colora", "Colora le lenti", "Tra due circonferenze vicine c’è una lente, la parte in comune. Colora di rosso le lenti in piedi (verticali) e di blu quelle sdraiate (orizzontali).", "Attorno a ogni centro di quadretto compare un fiore a quattro petali."],
    ],
  }, (k, m) => {
    const s = 2, r = s / Math.SQRT2;
    const griglia = m.reticolo(0, 0, 6, 4, s);
    const nodi = [];
    for (let j = 0; j <= 2; j += 1) for (let i = 0; i <= 3; i += 1) nodi.push([i * s, j * s]);
    const w4 = finestre(4), w8 = finestre(8);
    const c1 = [], c2 = [];
    nodi.forEach((n, idx) => {
      const nome = `arcK${idx + 1}`;
      if (idx < 4) { k.arco(nome, n, r, 45, 360, w4[idx]); c1.push(nome); } else { k.arco(nome, n, r, 45, 360, w8[idx - 4]); c2.push(nome); }
    });
    const lente = (a, b, colore) => {
      const mm = medio(a, b), d = distanza(a, b), u = [(b[1] - a[1]) / d, -(b[0] - a[0]) / d], h = Math.sqrt(r * r - (d / 2) ** 2);
      const p = [mm[0] + u[0] * h, mm[1] + u[1] * h], q = [mm[0] - u[0] * h, mm[1] - u[1] * h];
      m.area([...arcoPunti(a, p, q), ...arcoPunti(b, q, p).slice(1, -1)], colore, 3, 0.4);
    };
    nodi.forEach(([x, y]) => {
      if (x + s <= 6) lente([x, y], [x + s, y], "rosso");
      if (y + s <= 4) lente([x, y], [x, y + s], "blu");
    });
    m.primoPiano(c1, c2);
    k.passo(...griglia);
    k.passo(...c1);
    k.passo(...c2);
    k.passo();
  });

  // ── 45 · Cubi in assonometria isometrica ───────────────────────────────────
  TAVOLE["cubi-isometrici"] = motivo({
    title: "Tassellatura di cubi",
    eyebrow: "Costruzione 45 · Tassellatura 3D",
    subtitle: "Esagoni sulla carta isometrica, ognuno diviso in tre rombi: con tre toni di colore compaiono dei cubi in rilievo.",
    filename: "MC-DIS-1-01_cubi-isometrici.ggb",
    coord: [-2.2, 9.2, -2.6, 8.6],
    proofTitle: "Tre rombi, tre facce",
    proofCopy: "Gli esagoni regolari ricoprono il piano senza lasciare vuoti e senza sovrapporsi: è una tassellatura. Tre segmenti dal centro dividono ogni esagono in tre rombi uguali. Colorati con un tono chiaro, uno medio e uno scuro, sempre nella stessa posizione, i rombi sembrano le tre facce visibili di un cubo illuminato dall’alto: l’occhio vede il rilievo anche se il disegno è piatto.",
    equality: "1 esagono = 3 rombi",
    steps: [
      ["Prima di iniziare", "Osserva la carta isometrica", "Hai un foglio con il reticolo isometrico: linee verticali e linee inclinate di 30° che formano triangoli uguali. Lo puoi tracciare con le squadre a 30° e 60°.", "Il lato degli esagoni è uguale al lato dei triangoli del reticolo: 2 cm."],
      ["Passo 1 · Primo esagono", "Ripassa un esagono", "Scegli un nodo, cioè un incrocio delle linee, come centro e ripassa i sei lati che lo circondano, seguendo le linee del reticolo.", "L’esagono ha due lati verticali e quattro inclinati."],
      ["Passo 2 · Tre rombi", "Dividi l’esagono in tre rombi", "Dal centro traccia tre segmenti: verso il vertice in basso, verso il vertice in alto a destra e verso quello in alto a sinistra. Formano una Y.", "Ottieni tre rombi uguali: uno in alto, uno a sinistra, uno a destra."],
      ["Passo 3 · Tassellatura", "Ripeti negli altri esagoni", "Disegna altri sette esagoni: ognuno ha un lato in comune con un esagono già disegnato. Dividi ognuno con la stessa Y.", "Gli esagoni combaciano senza vuoti."],
      ["Passo 4 · Colora", "Colora con tre toni", "Colora tutti i rombi in alto con il tono chiaro, quelli a sinistra con il tono medio e quelli a destra con il tono scuro.", "Compaiono i cubi, illuminati dall’alto."],
    ],
  }, (k, m) => {
    const a = 2, w = Math.sqrt(3) * a;
    const griglia = m.isometrica(-1.8, -2.2, 8.8, 8.2, (Math.sqrt(3) / 2) * a);
    const centri = [[0, 0], [w, 0], [2 * w, 0], [w / 2, 1.5 * a], [1.5 * w, 1.5 * a], [0, 3 * a], [w, 3 * a], [2 * w, 3 * a]];
    const v = (c, i) => polare(c, a, 90 - 60 * i); // 0 alto, 1 alto-destra, 2 basso-destra, 3 basso, 4 basso-sinistra, 5 alto-sinistra
    const esa = (c) => [0, 1, 2, 3, 4, 5].map((i) => v(c, i));
    const primo = m.lati("drawH1x", [esa(centri[0])], [0.12, 0.94]);
    const ypsilon = (c, pref, fin) => [3, 1, 5].map((i, j) => { const n = `${pref}${j + 1}`; k.traccia(n, c, v(c, i), fin ? fin[j] : undefined); return n; });
    const y1 = ypsilon(centri[0], "drawY1x", finestre(3));
    const altriLati = (() => {
      const visti = new Set();
      esa(centri[0]).forEach((p, i, arr) => visti.add([chiave(p), chiave(arr[(i + 1) % 6])].sort().join("|")));
      return m.lati("drawH2x", centri.slice(1).map(esa), [0.12, 0.6], (p, q) => visti.has([chiave(p), chiave(q)].sort().join("|")));
    })();
    const wy = finestre(centri.length - 1, 0.62, 0.94);
    const altreY = centri.slice(1).flatMap((c, i) => ypsilon(c, `drawY${i + 2}x`, [wy[i], wy[i], wy[i]]));
    centri.forEach((c) => {
      m.area([c, v(c, 5), v(c, 0), v(c, 1)], [252, 165, 165], 4, 0.25, 0.95);
      m.area([c, v(c, 3), v(c, 4), v(c, 5)], [215, 38, 61], 4, 0.5, 0.95);
      m.area([c, v(c, 1), v(c, 2), v(c, 3)], [127, 29, 29], 4, 0.75, 0.95);
    });
    m.primoPiano(primo, y1, altriLati, altreY);
    k.passo(...griglia);
    k.passo(...primo);
    k.passo(...y1);
    k.passo(...altriLati, ...altreY);
    k.passo();
    k.risultato(...primo, ...y1, ...altriLati, ...altreY);
  });

  // ── 46 · Tartan ─────────────────────────────────────────────────────────────
  const SETT = [[2, "verde"], [0.5, "rosso"], [1, "blu"], [1, "giallo"], [1, "blu"], [0.5, "rosso"], [2, "verde"]];
  TAVOLE["tartan"] = motivo({
    title: "Tartan",
    eyebrow: "Costruzione 46 · Fasce che si incrociano",
    subtitle: "La stessa sequenza di fasce in verticale e in orizzontale: dove si incrociano, i colori si mescolano come i fili di un tessuto scozzese.",
    filename: "MC-DIS-1-01_tartan.ggb",
    coord: [-0.8, 8.8, -0.8, 8.8],
    proofTitle: "Una sequenza, due direzioni",
    proofCopy: "Il tartan nasce dalla tessitura: i fili verticali (ordito) e quelli orizzontali (trama) seguono la stessa sequenza di colori. Per questo il disegno è simmetrico rispetto alla diagonale. Dove una fascia verticale incrocia una fascia orizzontale dello stesso colore il colore resta pieno; dove i colori sono diversi si mescolano e nasce un terzo colore.",
    equality: "2 + 0,5 + 1 + 1 + 1 + 0,5 + 2 = 8 cm",
    steps: [
      ["Prima di iniziare", "Osserva il quadrato", "Hai un quadrato con il lato di 8 cm. Lo dividerai in fasce: verde 2 cm, rosso 0,5, blu 1, giallo 1, blu 1, rosso 0,5, verde 2.", "La sequenza è simmetrica: si legge uguale da destra e da sinistra."],
      ["Passo 1 · Fasce verticali", "Segna le fasce in verticale", "Sul lato in basso e su quello in alto segna i punti a 2 – 2,5 – 3,5 – 4,5 – 5,5 – 6 cm dal vertice di sinistra e traccia le linee verticali.", "Usa il righello con i millimetri per le fasce da 0,5 cm."],
      ["Passo 2 · Fasce orizzontali", "Ripeti in orizzontale", "Segna le stesse misure sui lati di destra e di sinistra, partendo dal basso, e traccia le linee orizzontali.", "Ora hai una griglia di rettangoli di misure diverse."],
      ["Passo 3 · Colori verticali", "Colora le fasce verticali", "Colora ogni fascia verticale con il suo colore, con tratto leggero, dall’alto in basso.", "Premi poco la matita: dovrai ripassarci sopra."],
      ["Passo 4 · Colori orizzontali", "Colora sopra le fasce orizzontali", "Colora le fasce orizzontali, sempre con tratto leggero, passando anche sopra i colori verticali.", "Dove si incrociano due colori diversi nasce un colore nuovo."],
    ],
  }, (k, m) => {
    const S = 8;
    ["A", "B", "C", "D"].forEach((n, i) => k.punto(n, [[0, 0], [S, 0], [S, S], [0, S]][i]));
    k.seg("segAB", [0, 0], [S, 0]); k.seg("segBC", [S, 0], [S, S]); k.seg("segCD", [S, S], [0, S]); k.seg("segDA", [0, S], [0, 0]);
    const pos = [0]; SETT.forEach(([w]) => pos.push(pos[pos.length - 1] + w));
    const interni = pos.slice(1, -1), w6 = finestre(interni.length);
    const ver = interni.map((x, i) => { k.traccia(`lineV${i + 1}`, [x, 0], [x, S], w6[i]); return `lineV${i + 1}`; });
    const ori = interni.map((y, i) => { k.traccia(`lineO${i + 1}`, [0, y], [S, y], w6[i]); return `lineO${i + 1}`; });
    const wv = finestre(SETT.length);
    SETT.forEach(([, c], i) => m.area([[pos[i], 0], [pos[i + 1], 0], [pos[i + 1], S], [pos[i], S]], c, 3, wv[i][0], 0.5));
    SETT.forEach(([, c], i) => m.area([[0, pos[i]], [S, pos[i]], [S, pos[i + 1]], [0, pos[i + 1]]], c, 4, wv[i][0], 0.5));
    m.primoPiano("segAB", "segBC", "segCD", "segDA", ver, ori);
    k.passo("A", "B", "C", "D", "segAB", "segBC", "segCD", "segDA");
    k.passo(...ver);
    k.passo(...ori);
    k.passo();
    k.passo();
    k.risultato("segAB", "segBC", "segCD", "segDA");
  });

  // ── 47 · Fregio con rotazione di mezzo giro ────────────────────────────────
  TAVOLE["fregio-mezzo-giro"] = motivo({
    title: "Fregio con rotazione di mezzo giro",
    eyebrow: "Costruzione 47 · Fregi",
    subtitle: "Un motivo a forma di L, ripetuto lungo una fascia e girato di mezzo giro una volta sì e una no.",
    filename: "MC-DIS-1-01_fregio-mezzo-giro.ggb",
    coord: [-0.8, 12.8, -3.2, 3.2],
    proofTitle: "Mezzo giro attorno a un punto dell’asse",
    proofCopy: "Ogni motivo capovolto è il motivo precedente ruotato di 180° attorno a un punto dell’asse, a metà strada tra i due: per i primi due è il punto R. Una rotazione di mezzo giro porta l’alto in basso e la sinistra a destra, senza ribaltare la figura come farebbe uno specchio. I fregi possibili sono sette in tutto: questo è quello che ha solo spostamenti e rotazioni di mezzo giro.",
    equality: "rotazione di 180° attorno a R",
    steps: [
      ["Prima di iniziare", "Osserva la fascia", "Hai una fascia lunga 12 cm e alta 4 cm, con l’asse, cioè la linea di mezzo, tratteggiato. Il motivo è una L, disegnata sopra l’asse.", "Il fregio è una decorazione a fascia, come quelle sulle pareti dei templi."],
      ["Passo 1 · Riquadri", "Dividi la fascia in riquadri", "Segna un punto ogni 2 cm sulle linee in alto e in basso e traccia le linee verticali: hai 6 riquadri.", "Ogni riquadro conterrà un motivo."],
      ["Passo 2 · Il motivo", "Disegna la L nel primo riquadro", "Nel primo riquadro, sopra l’asse, disegna la L: la gamba verticale è alta 1,25 cm e larga 0,5 cm; il piede è lungo 1 cm e alto 0,5 cm, e punta verso destra. Tieniti a 0,5 cm dall’asse e dal bordo sinistro del riquadro.", "Aiutati con i quadretti da 0,5 cm."],
      ["Passo 3 · Mezzo giro", "Ruota la L nel secondo riquadro", "Ricalca la L su carta da lucido. Punta la matita nel punto R, dove l’asse incrocia la linea tra il primo e il secondo riquadro, e gira il lucido di mezzo giro: la L va sotto l’asse, nel secondo riquadro, capovolta. Ripassala sul foglio.", "Senza lucido: la L capovolta sta 0,5 cm sotto l’asse e a 0,5 cm dal bordo destro del secondo riquadro, con il piede verso sinistra."],
      ["Passo 4 · Ripeti", "Completa il fregio", "Negli altri riquadri alterna la L dritta e la L capovolta: dritta nel terzo e nel quinto, capovolta nel quarto e nel sesto.", "Gira il foglio di mezzo giro: ogni L dritta prende il posto di una L capovolta e il fregio sembra lo stesso."],
      ["Passo 5 · Colora", "Colora il fregio", "Colora di rosso le L sopra l’asse e di blu quelle sotto. Colora il fondo della fascia di giallo chiaro.", "I colori aiutano a vedere la rotazione."],
    ],
  }, (k, m) => {
    const u = 2, n = 6;
    k.seg("segAlto", [0, 2], [n * u, 2]); k.seg("segBasso", [0, -2], [n * u, -2]);
    k.seg("segSx", [0, -2], [0, 2]); k.seg("segDx", [n * u, -2], [n * u, 2]);
    k.seg("lineAsse", [0, 0], [n * u, 0]); k.tratteggia("lineAsse");
    const wn = finestre(n - 1), riquadri = [];
    for (let i = 1; i < n; i += 1) { k.traccia(`lineP${i}`, [i * u, 2], [i * u, -2], wn[i - 1]); riquadri.push(`lineP${i}`); }
    const L = [[0.5, 0.5], [1.5, 0.5], [1.5, 1], [1, 1], [1, 1.75], [0.5, 1.75]];
    const copia = (i) => {
      const base = L.map(([x, y]) => [i * u + x, y]);
      return i % 2 === 0 ? base : base.map((p) => ruota([p[0] - u, p[1]], [i * u, 0], 180));
    };
    const forme = Array.from({ length: n }, (_, i) => copia(i));
    const w4 = finestre(4);
    const tratti = forme.map((f, i) => m.lati(`drawL${i + 1}x`, [f], i < 2 ? [0.12, 0.94] : w4[i - 2]));
    k.punto("R", [u, 0]); k.compare("R", 0.12);
    m.area([[0, -2], [n * u, -2], [n * u, 2], [0, 2]], "crema", 5, 0.2, 0.9);
    forme.forEach((f, i) => m.stile(m.area(f, i % 2 ? "blu" : "rosso", 5, 0.5, 0.9), { layer: 1 }));
    m.primoPiano("segAlto", "segBasso", "segSx", "segDx", "lineAsse", riquadri, tratti);
    k.passo("segAlto", "segBasso", "segSx", "segDx", "lineAsse");
    k.passo(...riquadri);
    k.passo(...tratti[0]);
    k.passo("R", ...tratti[1]);
    k.passo(...tratti.slice(2).flat());
    k.passo();
    k.risultato(...tratti.flat());
  });

  // ── 48 · Stella a cinque punte dal pentagono ───────────────────────────────
  TAVOLE["stella-pentagono"] = motivo({
    title: "Poligono stellato dal pentagono",
    eyebrow: "Costruzione 48 · Poligoni stellati",
    subtitle: "Le diagonali del pentagono regolare disegnano una stella; al centro nasce un pentagono più piccolo, da cui ricominciare.",
    filename: "MC-DIS-1-01_stella-pentagono.ggb",
    coord: [-4.8, 4.8, -4.4, 4.6],
    proofTitle: "Il nucleo è un pentagono regolare",
    proofCopy: "Le cinque diagonali di un pentagono regolare sono tutte uguali e si tagliano a due a due. I cinque punti d’incontro sono alla stessa distanza dal centro e formano un nuovo pentagono regolare, capovolto: il nucleo della stella. Ripetendo le diagonali nel nucleo si ottiene una stella più piccola, e così via. Ogni punta della stella ha un angolo di 36°.",
    equality: "angolo della punta = 36°",
    steps: [
      ["Prima di iniziare", "Osserva il pentagono", "Hai una circonferenza di raggio 4 cm con il pentagono regolare inscritto ABCDE, costruito come nella costruzione 8.", "Il poligono stellato nasce dal poligono regolare con lo stesso numero di lati."],
      ["Passo 1 · Diagonali", "Traccia le cinque diagonali", "Unisci ogni vertice con i due vertici che non gli stanno accanto: A con C e D, B con D ed E, C con E. Sono cinque diagonali in tutto.", "Le diagonali formano una stella a cinque punte."],
      ["Passo 2 · Nucleo", "Riconosci il nucleo", "Al centro le diagonali si incrociano in cinque punti: 1, 2, 3, 4 e 5. Ripassa il pentagono che formano: è il nucleo della stella.", "Il nucleo è capovolto rispetto al pentagono ABCDE."],
      ["Passo 3 · Seconda stella", "Diagonali del nucleo", "Traccia le diagonali del nucleo, come al passo 1: dentro la prima stella ne compare una seconda, più piccola e capovolta.", "Potresti continuare ancora: la stella non finisce mai."],
      ["Passo 4 · Colora", "Colora le stelle", "Colora di rosso la stella grande, di giallo il nucleo e di blu la stella piccola.", "Ripassa con tratto marcato i contorni delle stelle."],
    ],
  }, (k, m) => {
    const O = [0, 0], R = 4;
    k.cerchio("circleO", O, R);
    const V = Array.from({ length: 5 }, (_, i) => polare(O, R, 90 + 72 * i));
    ["A", "B", "C", "D", "E"].forEach((n, i) => k.punto(n, V[i]));
    V.forEach((p, i) => k.seg(`segP${i + 1}`, p, V[(i + 1) % 5]));
    const w5 = finestre(5), diag = [];
    V.forEach((p, i) => { k.traccia(`drawD${i + 1}`, p, V[(i + 2) % 5], w5[i]); diag.push(`drawD${i + 1}`); });
    const ri = (R * Math.cos((2 * Math.PI) / 5)) / Math.cos(Math.PI / 5);
    const N = Array.from({ length: 5 }, (_, i) => polare(O, ri, 270 + 72 * i));
    N.forEach((p, i) => { k.punto(`N${i + 1}`, p, String(i + 1)); k.compare(`N${i + 1}`, 0.15 + 0.06 * i); });
    const w5b = finestre(5, 0.45, 0.94), nucleo = [];
    N.forEach((p, i) => { k.traccia(`drawN${i + 1}`, p, N[(i + 1) % 5], w5b[i]); nucleo.push(`drawN${i + 1}`); });
    const d2 = [];
    N.forEach((p, i) => { k.traccia(`drawE${i + 1}`, p, N[(i + 2) % 5], w5[i]); d2.push(`drawE${i + 1}`); });
    const stella = (raggio, interno, rot) => { const out = []; for (let i = 0; i < 5; i += 1) { out.push(polare(O, raggio, rot + 72 * i)); out.push(polare(O, interno, rot + 36 + 72 * i)); } return out; };
    m.area(stella(R, ri, 90), "rosso", 4, 0.2);
    m.area(N, "giallo", 4, 0.5);
    const ri2 = (ri * Math.cos((2 * Math.PI) / 5)) / Math.cos(Math.PI / 5);
    m.area(stella(ri, ri2, 270), "blu", 4, 0.8);
    m.primoPiano(diag, nucleo, d2);
    k.passo("circleO", "A", "B", "C", "D", "E", "segP1", "segP2", "segP3", "segP4", "segP5");
    k.passo(...diag);
    k.passo("N1", "N2", "N3", "N4", "N5", ...nucleo);
    k.passo(...d2);
    k.passo();
    k.risultato(...diag, ...d2);
  });

  // ── 49 · Triangolo di Sierpiński ────────────────────────────────────────────
  TAVOLE["triangolo-sierpinski"] = motivo({
    title: "Triangolo di Sierpiński",
    eyebrow: "Costruzione 49 · Frattali",
    subtitle: "Unisci i punti medi, togli il triangolo centrale e ripeti negli altri: un frattale fatto di triangoli sempre più piccoli.",
    filename: "MC-DIS-1-01_triangolo-sierpinski.ggb",
    coord: [-0.8, 8.8, -0.9, 7.6],
    proofTitle: "Ogni parte è simile al tutto",
    proofCopy: "Unire i punti medi di un triangolo equilatero lo divide in quattro triangoli equilateri uguali, con il lato dimezzato. Togliendo quello centrale e ripetendo la stessa operazione negli altri tre, ogni pezzo diventa una copia ridotta della figura intera: è la proprietà dei frattali. A ogni giro i triangoli pieni triplicano: 1, 3, 9, 27…",
    equality: "1 → 3 → 9 → 27 triangoli",
    steps: [
      ["Prima di iniziare", "Osserva il triangolo", "Hai un triangolo equilatero ABC con il lato di 8 cm. Il matematico polacco Wacław Sierpiński ne ha fatto un frattale.", "Frattale: figura che, ingrandita, mostra sempre la stessa forma."],
      ["Passo 1 · Punti medi", "Unisci i punti medi dei lati", "Segna i punti medi dei tre lati, a 4 cm dai vertici, e uniscili. Il triangolo centrale, capovolto, è quello da togliere.", "Ottieni quattro triangoli uguali con il lato di 4 cm."],
      ["Passo 2 · Secondo giro", "Ripeti nei tre triangoli d’angolo", "In ognuno dei tre triangoli d’angolo trova i punti medi dei lati (a 2 cm dai vertici) e uniscili.", "Il triangolo centrale grande non si tocca più: resta vuoto."],
      ["Passo 3 · Terzo giro", "Ripeti ancora", "Ripeti nei nove triangolini d’angolo: i punti medi sono a 1 cm dai vertici. Ora ogni lato di ABC è diviso in 8 parti uguali.", "Con un giro in più ogni lato sarebbe diviso in 16 parti."],
      ["Passo 4 · Colora", "Colora i triangoli pieni", "Colora i 27 triangolini con la punta in alto; lascia bianchi tutti i triangoli capovolti.", "I triangoli bianchi sono i «buchi» del frattale."],
    ],
  }, (k, m) => {
    const L = 8, h = (L * Math.sqrt(3)) / 2, A = [0, 0], B = [L, 0], C = [L / 2, h];
    k.punto("A", A); k.punto("B", B); k.punto("C", C);
    k.seg("segAB", A, B); k.seg("segBC", B, C); k.seg("segCA", C, A);
    const livelli = [[], [], []];
    const pieni = [];
    const scendi = (a, b, c, d) => {
      if (d === 3) { pieni.push([a, b, c]); return; }
      const ab = medio(a, b), bc = medio(b, c), ca = medio(c, a);
      livelli[d].push([ab, bc], [bc, ca], [ca, ab]);
      scendi(a, ab, ca, d + 1); scendi(ab, b, bc, d + 1); scendi(ca, bc, c, d + 1);
    };
    scendi(A, B, C, 0);
    const nomi = livelli.map((lv, d) => { const w = finestre(lv.length); return lv.map(([p, q], i) => { const n = `lineS${d + 1}x${i + 1}`; k.traccia(n, p, q, w[i]); return n; }); });
    const colori = ["rosso", "arancio", "giallo"];
    pieni.forEach((tr, i) => m.area(tr, colori[Math.floor(i / 9)], 4, 0.15 + 0.025 * i, 0.9));
    m.primoPiano("segAB", "segBC", "segCA", nomi);
    k.passo("A", "B", "C", "segAB", "segBC", "segCA");
    k.passo(...nomi[0]);
    k.passo(...nomi[1]);
    k.passo(...nomi[2]);
    k.passo();
    k.risultato("segAB", "segBC", "segCA");
  });

  // ── 50 · Inviluppo di rette: stella a quattro punte ───────────────────────
  TAVOLE["inviluppo-rette"] = motivo({
    title: "Curve fatte di rette",
    eyebrow: "Costruzione 50 · Inviluppi",
    subtitle: "Solo segmenti dritti, uniti con una regola semplice: insieme disegnano curve, e quattro curve fanno una stella.",
    filename: "MC-DIS-1-01_inviluppo-rette.ggb",
    coord: [-5, 5, -4.7, 4.7],
    proofTitle: "Una curva che tocca tutte le rette",
    proofCopy: "Ogni segmento unisce un punto di un braccio con un punto dell’altro, e la somma delle due distanze dal centro è sempre la stessa: 4,5 cm. Segmenti così si appoggiano tutti alla stessa curva, che li tocca uno per uno senza tagliarli: si chiama inviluppo, e qui è un arco di parabola. Più punti usi, più la curva sembra continua.",
    equality: "distanza in orizzontale + distanza in verticale = 4,5 cm",
    steps: [
      ["Prima di iniziare", "Osserva la croce", "Hai due segmenti perpendicolari lunghi 8 cm, che si incrociano a metà nel punto O: formano quattro bracci (semiassi) da 4 cm.", "Ti servono righello e matita appuntita: i segmenti sono tanti."],
      ["Passo 1 · Tacche", "Segna i punti ogni 0,5 cm", "Su ogni braccio segna un punto ogni 0,5 cm partendo da O: 8 punti per braccio. Numera i punti da 1 (il più vicino a O) a 8.", "Sui bracci orizzontali e su quelli verticali i numeri crescono allontanandosi da O."],
      ["Passo 2 · Primo quarto", "Unisci i punti con la regola del 9", "Nel quarto in alto a destra unisci il punto 1 orizzontale con l’8 verticale, il 2 con il 7, il 3 con il 6… fino all’8 con l’1. La somma dei due numeri è sempre 9.", "I segmenti si appoggiano a una curva che si piega verso O."],
      ["Passo 3 · Gli altri quarti", "Ripeti negli altri tre quarti", "Con la stessa regola unisci i punti negli altri tre quarti.", "Le quattro curve formano una stella a quattro punte."],
      ["Passo 4 · Colora", "Colora la stella", "Colora la stella che sta dentro le quattro curve, alternando due colori nei quarti.", "Il colore fa risaltare la curva, anche se hai tracciato solo segmenti dritti."],
    ],
  }, (k, m) => {
    const O = [0, 0], p = 0.5;
    k.punto("O", O);
    k.seg("segX", [-4, 0], [4, 0]); k.seg("segY", [0, -4], [0, 4]);
    const quarti = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
    const tacche = [];
    [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(([dx, dy], a) => {
      for (let i = 1; i <= 8; i += 1) {
        const n = `segT${a + 1}x${i}`, q = [dx * i * p, dy * i * p], o = [dy * 0.12, dx * 0.12];
        k.seg(n, [q[0] - o[0], q[1] - o[1]], [q[0] + o[0], q[1] + o[1]]); tacche.push(n);
      }
    });
    const w8 = finestre(8), w24 = finestre(24);
    const nomi = quarti.map(([sx, sy], qi) => Array.from({ length: 8 }, (_, j) => {
      const i = j + 1, n = `drawQ${qi + 1}x${i}`;
      k.traccia(n, [sx * i * p, 0], [0, sy * (9 - i) * p], qi === 0 ? w8[j] : w24[(qi - 1) * 8 + j]);
      return n;
    }));
    const Lc = 9 * p;
    quarti.forEach(([sx, sy], qi) => {
      const curva = [];
      for (let t = 0; t <= 1.0001; t += 1 / 24) curva.push([sx * Lc * t * t, sy * Lc * (1 - t) * (1 - t)]);
      m.area([[0, 0], ...curva.filter((c) => Math.abs(c[0]) <= 4.0001 && Math.abs(c[1]) <= 4.0001)], qi % 2 ? "blu" : "rosso", 4, 0.3 + 0.15 * qi);
    });
    m.primoPiano("segX", "segY", nomi);
    k.passo("O", "segX", "segY");
    k.passo(...tacche);
    k.passo(...nomi[0]);
    k.passo(...nomi.slice(1).flat());
    k.passo();
    k.risultato(...nomi.flat());
  });
})();
