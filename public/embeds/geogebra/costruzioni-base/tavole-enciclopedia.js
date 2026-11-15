/*
 * Tavole dell'enciclopedia delle costruzioni — costruzioni 71+ (MC-DIS-1-01).
 *
 * Costruzioni raccolte dai manuali di disegno: angoli, quadrilateri, poligoni, sezione aurea,
 * ovali e spirali, coniche per punti, archi, raccordi e tangenze, stelle, trasformazioni.
 * Stesso vocabolario delle costruzioni 9–70 (`creaTavola`, in tavole.js).
 * Il numero di `k.passo` deve essere uguale al numero di voci in `steps`.
 * Come aggiungere una tavola: skill «tavole-geogebra».
 */
(() => {
  "use strict";

  const { creaTavola, finestre, polare, distanza, direzione, oltre, xy, num } = window.GGB_CREA;
  const TAVOLE = window.GGB_TAVOLE;
  const RAD = Math.PI / 180;

  const medio = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const sposta = (p, gradi, d) => polare(p, d, gradi);
  const modulo360 = (g) => ((g % 360) + 360) % 360;
  const ruota = (p, c, gradi) => polare(c, distanza(c, p), direzione(c, p) + gradi);

  function puntoMuto(t, nome, p) {
    t.commands.push(`${nome}=${xy(p)}`, `ShowLabel(${nome},false)`, `SetPointSize(${nome},4)`, `SetColor(${nome},"Red")`);
    return p;
  }
  /** Come k.arco, ma tracciato in senso orario a partire da `inizio` (gradi). */
  function arcoOrario(k, nome, centro, raggio, inizio, ampiezza, finestra) {
    const t = k.t; const param = `t${nome}`;
    t.commands.push(
      `HC${nome}=${xy(centro)}`,
      `HS${nome}=${xy(polare(centro, raggio, inizio))}`,
      `${param}=0`,
      `HE${nome}=Rotate(HS${nome},-${num(Math.min(ampiezza, 359.9))}°*${param},HC${nome})`,
      `${nome}=CircularArc(HC${nome},HE${nome},HS${nome})`,
    );
    t.helpers.push(`HC${nome}`, `HS${nome}`, param, `HE${nome}`);
    t.anim[nome] = { param, from: finestra ? finestra[0] : 0.12, to: finestra ? finestra[1] : 1 };
  }
  function comando(t, nome, espressione, spessore) {
    t.commands.push(`${nome}=${espressione}`, `ShowLabel(${nome},false)`, `SetLineThickness(${nome},${spessore || 6})`);
  }
  /** Quattro archetti dell'asse di PQ (Costruzione 9): restituisce incroci, punto medio e nomi. */
  function asse(k, pref, P, Q, rho, da, a) {
    const M = medio(P, Q);
    const h = distanza(P, Q) / 2;
    const d = Math.sqrt(rho * rho - h * h);
    const n = direzione(P, Q) + 90;
    const X1 = sposta(M, n, d);
    const X2 = sposta(M, n, -d);
    const w = finestre(4, da === undefined ? 0.1 : da, a === undefined ? 0.7 : a);
    const nomi = [`arc${pref}1`, `arc${pref}2`, `arc${pref}3`, `arc${pref}4`];
    k.archetto(nomi[0], P, X1, 9, w[0]); k.archetto(nomi[1], Q, X1, 9, w[1]);
    k.archetto(nomi[2], P, X2, 9, w[2]); k.archetto(nomi[3], Q, X2, 9, w[3]);
    return { M, X1, X2, nomi };
  }
  /** Perpendicolare a una retta orizzontale nel punto H (Costruzione 1), compressa in un passo. */
  function perpendicolareIn(k, pref, H, r, alta, da, a) {
    const K1 = [H[0] - r, H[1]]; const K2 = [H[0] + r, H[1]];
    const rr = r * 1.7;
    const X = [H[0], H[1] + Math.sqrt(rr * rr - r * r)];
    const w = finestre(4, da === undefined ? 0.05 : da, a === undefined ? 1 : a);
    const nomi = [`arc${pref}0`, `arc${pref}1`, `arc${pref}2`, `line${pref}`];
    k.arco(nomi[0], H, r, 0, 180, w[0]);
    k.archetto(nomi[1], K1, X, 11, w[1]);
    k.archetto(nomi[2], K2, X, 11, w[2]);
    k.traccia(nomi[3], H, [H[0], H[1] + alta], w[3]);
    return nomi;
  }
  function angoloRetto(k, nome, P, V, Q) {
    const croce = (P[0] - V[0]) * (Q[1] - V[1]) - (P[1] - V[1]) * (Q[0] - V[0]);
    if (croce > 0) k.angolo(nome, P, V, Q); else k.angolo(nome, Q, V, P);
  }
  /** Traccia in sequenza i lati di una poligonale chiusa; restituisce i nomi. */
  function chiudi(k, pref, punti, da, a) {
    const w = finestre(punti.length, da, a);
    return punti.map((p, i) => { const n = `draw${pref}${i}`; k.traccia(n, p, punti[(i + 1) % punti.length], w[i]); return n; });
  }

  let numero = 71;
  /** Registra una tavola: aggiunge numero progressivo all'eyebrow e il nome del file .ggb. */
  function tavola(slug, meta, costruisci) {
    const n = numero; numero += 1;
    TAVOLE[slug] = creaTavola({ ...meta, eyebrow: `Costruzione ${n} · ${meta.tema}`, filename: `MC-DIS-1-01_${slug}.ggb` }, (k, t) => { k.t = t; costruisci(k, t); });
  }

  // ══ Angoli ════════════════════════════════════════════════════════════════

  tavola("angolo-piatto-tre-parti", {
    title: "Angolo piatto diviso in tre parti uguali",
    tema: "Tre angoli da 60°",
    subtitle: "Una semicirconferenza e la stessa apertura riportata dai due estremi dividono l’angolo piatto in tre angoli di 60°.",
    coord: [-5.8, 5.8, -2.9, 3.9],
    proofTitle: "Due triangoli equilateri",
    proofCopy: "I triangoli O-A-C e O-B-D hanno i tre lati uguali all’apertura del compasso: sono equilateri, quindi gli angoli AOC e BOD misurano 60°. L’angolo piatto è di 180°: tra le due semirette restano 180° − 60° − 60° = 60°.",
    equality: "60° + 60° + 60° = 180°",
    steps: [
      ["Prima di iniziare", "Osserva l’angolo piatto", "Sulla retta r è segnato il punto O: le due semirette opposte formano un angolo piatto, di 180°. Vuoi dividerlo in tre angoli uguali.", "Un angolo piatto è un angolo «disteso»: i suoi lati sono uno il prolungamento dell’altro."],
      ["Passo 1 · Semicirconferenza", "Segna A e B", "Punta in O con un’apertura a piacere e traccia una semicirconferenza sopra la retta: la incontra in A, a destra, e in B, a sinistra.", "Tieni ferma questa apertura."],
      ["Passo 2 · Arco da A", "Trova C", "Con la stessa apertura punta in A e taglia la semicirconferenza nel punto C.", "Il triangolo O-A-C è equilatero."],
      ["Passo 3 · Arco da B", "Trova D", "Sempre con la stessa apertura punta in B e taglia la semicirconferenza nel punto D.", "Anche O-B-D è equilatero."],
      ["Passo 4 · Righello", "Traccia le due semirette", "Unisci O con C e O con D, prolungando oltre la semicirconferenza. L’angolo piatto è diviso in tre angoli di 60°.", "Controlla con il goniometro: 60°, 60°, 60°."],
    ],
  }, (k) => {
    const O = k.punto("O", [0, -2]);
    const r = 3.4;
    const A = k.punto("A", polare(O, r, 0)); const B = k.punto("B", polare(O, r, 180));
    const C = k.punto("C", polare(O, r, 60)); const D = k.punto("D", polare(O, r, 120));
    k.seg("lineR", [-5.8, O[1]], [5.8, O[1]], "r");
    k.arco("arcO", O, r, 0, 180);
    k.archetto("arcA", A, C, 14); k.archetto("arcB", B, D, 14);
    k.traccia("drawC", O, polare(O, 5.4, 60), [0.12, 0.5]); k.traccia("drawD", O, polare(O, 5.4, 120), [0.5, 0.88]);
    const s = [...k.settore("angA", O, 1.5, 0, 60, "60°"), ...k.settore("angB", O, 1.5, 60, 120, "60°"), ...k.settore("angC", O, 1.5, 120, 180, "60°")];
    k.compare("A", 0.15); k.compare("B", 0.95); k.compare("C", 0.6); k.compare("D", 0.6); s.forEach((n) => k.compare(n, 0.94));
    k.passo("lineR", "O");
    k.passo("arcO", "A", "B");
    k.passo("arcA", "C");
    k.passo("arcB", "D");
    k.passo("drawC", "drawD", ...s);
    k.risultato("drawC", "drawD");
  });

  tavola("angolo-120", {
    title: "Angolo di 120° con il compasso",
    tema: "Due volte 60°",
    subtitle: "Riportando due volte la stessa apertura su un arco ottieni due angoli di 60° affiancati.",
    coord: [-5.4, 5.6, -2.9, 3.7],
    proofTitle: "Due triangoli equilateri affiancati",
    proofCopy: "I triangoli O-A-B e O-B-C hanno tutti i lati uguali all’apertura del compasso: sono equilateri. L’angolo AOB misura 60° e l’angolo BOC altri 60°: insieme fanno 120°. È l’angolo interno dell’esagono regolare.",
    equality: "60° + 60° = 120°",
    steps: [
      ["Prima di iniziare", "Osserva la semiretta", "Hai una semiretta che parte dal punto O. Vuoi costruire un angolo di 120° senza goniometro.", "120° è un angolo ottuso: più aperto dell’angolo retto."],
      ["Passo 1 · Arco da O", "Segna A", "Punta in O con un’apertura a piacere e traccia un arco ampio, più di un terzo di giro: incontra la semiretta nel punto A.", "Tieni ferma l’apertura."],
      ["Passo 2 · Arco da A", "Trova B", "Con la stessa apertura punta in A e taglia l’arco nel punto B.", "Sei a 60° dalla semiretta."],
      ["Passo 3 · Arco da B", "Trova C", "Punta in B e taglia ancora l’arco, più avanti: trovi il punto C.", "Sei a 120° dalla semiretta."],
      ["Passo 4 · Righello", "Unisci O con C", "Traccia la semiretta che parte da O e passa per C: forma con la prima un angolo di 120°.", "Controlla con il goniometro."],
    ],
  }, (k) => {
    const O = k.punto("O", [0.6, -2.2]);
    const r = 3.1;
    const A = k.punto("A", polare(O, r, 0)); const B = k.punto("B", polare(O, r, 60)); const C = k.punto("C", polare(O, r, 120));
    k.seg("rayR", O, polare(O, 4.8, 0));
    k.arco("arcO", O, r, -7, 142);
    k.archetto("arcA", A, B, 13); k.archetto("arcB", B, C, 13);
    k.traccia("drawC", O, polare(O, 5.4, 120));
    const s = k.settore("ang120", O, 1.3, 0, 120, "120°");
    k.compare("A", 0.18); k.compare("B", 0.6); k.compare("C", 0.6); s.forEach((n) => k.compare(n, 0.94));
    k.passo("O", "rayR");
    k.passo("arcO", "A");
    k.passo("arcA", "B");
    k.passo("arcB", "C");
    k.passo("drawC", ...s);
    k.risultato("drawC");
  });

  tavola("angolo-135", {
    title: "Angolo di 135° con il compasso",
    tema: "Un angolo retto più mezzo",
    subtitle: "Costruisci la perpendicolare e poi dividi a metà l’angolo retto che sta dall’altra parte.",
    coord: [-5.6, 5.2, -3.1, 3.6],
    proofTitle: "90° più 45°",
    proofCopy: "La perpendicolare forma con la semiretta di destra un angolo di 90°. La semiretta OC è la bisettrice dell’angolo retto di sinistra e lo divide in due angoli di 45°. Partendo dalla semiretta di destra: 90° + 45° = 135°.",
    equality: "90° + 45° = 135°",
    steps: [
      ["Prima di iniziare", "Osserva la retta r", "Sulla retta r è segnato il punto O. Vuoi costruire un angolo di 135° con il vertice in O, misurato a partire dalla semiretta di destra.", "135° è l’angolo interno dell’ottagono regolare."],
      ["Passo 1 · Perpendicolare in O", "Costruisci l’angolo retto", "Costruisci la perpendicolare a r nel punto O (Costruzione 1): una semicirconferenza con centro O, due archetti che si incrociano e la retta verticale.", "La semicirconferenza ti servirà ancora."],
      ["Passo 2 · Punti A e B", "Leggi i punti sulla semicirconferenza", "La semicirconferenza incontra la retta r nel punto A, a sinistra di O, e la perpendicolare nel punto B.", "OA e OB sono lunghi uguali."],
      ["Passo 3 · Archetti da A e da B", "Trova C", "Con un’apertura uguale a OA punta in A e poi in B: i due archetti si incrociano nel punto C, fuori dalla semicirconferenza.", "C è alla stessa distanza da A e da B."],
      ["Passo 4 · Righello", "Unisci O con C", "Traccia la semiretta che parte da O e passa per C: con la semiretta di destra forma un angolo di 135°.", "Controlla con il goniometro."],
    ],
  }, (k) => {
    const O = k.punto("O", [0.8, -2.3]);
    const r = 2.6;
    const A = k.punto("A", polare(O, r, 180)); const B = k.punto("B", polare(O, r, 90));
    const C = k.punto("C", [O[0] - r, O[1] + r]);
    k.seg("lineR", [-5.6, O[1]], [5.2, O[1]], "r");
    const perp = perpendicolareIn(k, "P", O, r, 5.4);
    k.archetto("arcAC", A, C, 14, [0.12, 0.5]); k.archetto("arcBC", B, C, 14, [0.52, 0.9]);
    k.traccia("drawC", O, polare(O, 5.4, 135));
    const s = k.settore("ang135", O, 1.3, 0, 135, "135°");
    k.compare("C", 0.85); s.forEach((n) => k.compare(n, 0.94));
    k.passo("lineR", "O");
    k.passo(...perp);
    k.passo("A", "B");
    k.passo("arcAC", "arcBC", "C");
    k.passo("drawC", ...s);
    k.risultato("drawC");
  });

  tavola("angoli-75-15", {
    title: "Angoli di 75° e di 15° con il compasso",
    tema: "A metà tra 60° e 90°",
    subtitle: "Sullo stesso arco costruisci 60° e 90°: la bisettrice dell’angolo che li separa cade a 75°.",
    coord: [-4.8, 5.4, -2.9, 4.6],
    proofTitle: "60° più la metà di 30°",
    proofCopy: "La semiretta OB è a 60° dalla semiretta di partenza e la perpendicolare OD è a 90°: tra le due ci sono 30°. Il punto F è alla stessa distanza da B e da D, quindi OF divide quei 30° a metà: 60° + 15° = 75°. L’angolo tra OF e la perpendicolare misura 15°.",
    equality: "60° + 15° = 75°",
    steps: [
      ["Prima di iniziare", "Osserva la semiretta", "Hai una semiretta che parte dal punto O. Vuoi costruire un angolo di 75° e, insieme, uno di 15°.", "75° e 15° sommati danno 90°."],
      ["Passo 1 · Arco da O", "Segna A", "Punta in O con un’apertura a piacere e traccia un arco ampio: incontra la semiretta nel punto A.", "Tieni ferma l’apertura fino al passo 3."],
      ["Passo 2 · Due archetti", "Trova B e C", "Con la stessa apertura punta in A e taglia l’arco in B. Poi punta in B e taglia l’arco in C.", "B è a 60° dalla semiretta, C a 120°."],
      ["Passo 3 · Perpendicolare", "Trova E e D", "Sempre con la stessa apertura punta in B e poi in C: i due archetti si incrociano nel punto E. Unisci O con E: è la perpendicolare, e taglia l’arco nel punto D.", "D è a 90° dalla semiretta di partenza."],
      ["Passo 4 · Archetti da B e da D", "Trova F", "Con un’apertura un po’ più piccola punta in B e poi in D: i due archetti si incrociano nel punto F, oltre l’arco.", "F è alla stessa distanza da B e da D."],
      ["Passo 5 · Righello", "Unisci O con F", "Traccia la semiretta che parte da O e passa per F: forma 75° con la semiretta di partenza e 15° con la perpendicolare.", "Controlla con il goniometro."],
    ],
  }, (k) => {
    const O = k.punto("O", [-1.4, -2.2]);
    const r = 3.2;
    const A = k.punto("A", polare(O, r, 0)); const B = k.punto("B", polare(O, r, 60)); const C = k.punto("C", polare(O, r, 120));
    const D = k.punto("D", polare(O, r, 90));
    const E = k.punto("E", polare(O, r * Math.sqrt(3), 90));
    const rf = 0.62 * r;
    const F = k.punto("F", polare(O, r * Math.cos(15 * RAD) + Math.sqrt(rf * rf - (r * Math.sin(15 * RAD)) ** 2), 75));
    k.seg("rayR", O, polare(O, 6.6, 0));
    k.arco("arcO", O, r, -7, 140);
    k.archetto("arcA", A, B, 12, [0.12, 0.5]); k.archetto("arcB", B, C, 12, [0.52, 0.9]);
    k.archetto("arcBE", B, E, 9, [0.1, 0.35]); k.archetto("arcCE", C, E, 9, [0.35, 0.6]);
    k.traccia("linePerp", O, polare(O, r * Math.sqrt(3) + 0.5, 90), [0.62, 0.95]);
    k.archetto("arcBF", B, F, 16, [0.12, 0.5]); k.archetto("arcDF", D, F, 16, [0.52, 0.9]);
    k.traccia("drawF", O, polare(O, 6.3, 75));
    const s = [...k.settore("ang75", O, 1.4, 0, 75, "75°"), ...k.settore("ang15", O, 2.5, 75, 90, "15°")];
    k.compare("A", 0.18); k.compare("B", 0.4); k.compare("C", 0.85); k.compare("E", 0.6); k.compare("D", 0.95); k.compare("F", 0.85);
    s.forEach((n) => k.compare(n, 0.94));
    k.passo("O", "rayR");
    k.passo("arcO", "A");
    k.passo("arcA", "arcB", "B", "C");
    k.passo("arcBE", "arcCE", "linePerp", "E", "D");
    k.passo("arcBF", "arcDF", "F");
    k.passo("drawF", ...s);
    k.risultato("drawF");
  });

  tavola("angolo-giro-otto-parti", {
    title: "Angolo giro diviso in otto parti uguali",
    tema: "Otto angoli da 45°",
    subtitle: "Due rette perpendicolari e le loro bisettrici dividono il giro completo in otto angoli uguali.",
    coord: [-5, 5, -4, 4],
    proofTitle: "La metà della metà",
    proofCopy: "Le due rette perpendicolari dividono l’angolo giro, di 360°, in quattro angoli retti. Ogni bisettrice passa per due punti equidistanti dai lati dell’angolo e lo divide a metà: 90° : 2 = 45°. In tutto gli angoli sono otto, e 8 × 45° = 360°.",
    equality: "8 × 45° = 360°",
    steps: [
      ["Prima di iniziare", "Osserva la retta e il punto O", "Sulla retta r è segnato il punto O. Attorno a O c’è un giro completo, di 360°: vuoi dividerlo in otto angoli uguali.", "È la divisione della rosa dei venti."],
      ["Passo 1 · Circonferenza", "Segna A e B", "Punta in O e traccia una circonferenza: incontra la retta r nei punti A e B.", "A e B sono alla stessa distanza da O."],
      ["Passo 2 · Perpendicolare", "Trova C e D", "Costruisci l’asse del segmento AB (Costruzione 9): archetti da A e da B, sopra e sotto. La retta passa per O e taglia la circonferenza in C e in D.", "Ora hai quattro angoli retti."],
      ["Passo 3 · Archetti", "Trova i punti 1 e 2", "Con un’apertura a piacere, uguale per tutti gli archetti, punta in B e poi in C: i due archetti si incrociano nel punto 1. Poi punta in A e in C: trovi il punto 2.", "L’apertura deve essere più grande della metà della distanza tra B e C."],
      ["Passo 4 · Bisettrici", "Unisci 1 e 2 con O", "Traccia la retta che passa per 1 e per O e quella che passa per 2 e per O, prolungandole dall’altra parte.", "Ogni retta divide a metà due angoli retti opposti."],
      ["Passo 5 · Otto angoli", "Conta gli angoli", "Attorno a O ci sono otto angoli, tutti di 45°.", "Controlla con il goniometro due angoli a scelta."],
    ],
  }, (k) => {
    const O = k.punto("O", [0, 0]);
    const R = 2.6;
    const A = k.punto("A", [-R, 0]); const B = k.punto("B", [R, 0]); const C = k.punto("C", [0, R]); k.punto("D", [0, -R]);
    const ra = 2.5;
    const d = (R * Math.SQRT2) / 2 + Math.sqrt(ra * ra - (R * R) / 2);
    const N1 = k.punto("N1", polare(O, d, 45), "1"); const N2 = k.punto("N2", polare(O, d, 135), "2");
    k.seg("lineR", [-5, 0], [5, 0], "r");
    k.arco("circleO", O, R, 0, 360);
    const a = asse(k, "P", A, B, 3.6, 0.08, 0.68);
    k.traccia("linePerp", [0, 3.9], [0, -3.9], [0.7, 1]);
    k.archetto("arcB1", B, N1, 11, [0.1, 0.3]); k.archetto("arcC1", C, N1, 11, [0.3, 0.5]);
    k.archetto("arcA2", A, N2, 11, [0.5, 0.7]); k.archetto("arcC2", C, N2, 11, [0.7, 0.9]);
    k.traccia("drawB1", sposta(N1, 45, 0.4), polare(O, 4.2, 225), [0.12, 0.5]);
    k.traccia("drawB2", sposta(N2, 135, 0.4), polare(O, 4.2, 315), [0.52, 0.9]);
    const sett = [];
    for (let i = 0; i < 8; i += 1) sett.push(...k.settore(`angS${i}`, O, 1.5, 45 * i, 45 * (i + 1), "45°"));
    k.compare("A", 0.6); k.compare("B", 0.15); k.compare("C", 0.85); k.compare("D", 0.95); k.compare("N1", 0.5); k.compare("N2", 0.9);
    k.passo("lineR", "O");
    k.passo("circleO", "A", "B");
    k.passo(...a.nomi, "linePerp", "C", "D");
    k.passo("arcB1", "arcC1", "arcA2", "arcC2", "N1", "N2");
    k.passo("drawB1", "drawB2");
    k.passo(...sett);
    k.risultato("drawB1", "drawB2");
  });

  // ══ Quadrilateri e triangoli ══════════════════════════════════════════════

  tavola("quadrato-data-diagonale", {
    title: "Quadrato data la diagonale",
    tema: "Due diagonali uguali e perpendicolari",
    subtitle: "L’asse della diagonale e una circonferenza trovano gli altri due vertici.",
    coord: [-5.4, 5.4, -4.2, 4.2],
    proofTitle: "Le diagonali del quadrato",
    proofCopy: "Nel quadrato le diagonali sono uguali, perpendicolari e si tagliano a metà. L’asse di AC è perpendicolare ad AC e passa per il suo punto medio O; la circonferenza di centro O porta B e D alla stessa distanza da O di A e di C. Le due diagonali AC e BD hanno quindi tutte le proprietà richieste: ABCD è un quadrato.",
    equality: "AC = BD · AC ⟂ BD",
    steps: [
      ["Prima di iniziare", "Osserva la diagonale AC", "Conosci la diagonale AC del quadrato, ma non il lato. Vuoi costruire il quadrato.", "La diagonale unisce due vertici opposti."],
      ["Passo 1 · Asse di AC", "Trova il centro O", "Costruisci l’asse del segmento AC (Costruzione 9): archetti da A e da C, sopra e sotto, e la retta per i due incroci. Trovi il punto medio O.", "O è il centro del quadrato."],
      ["Passo 2 · Circonferenza", "Trova B e D", "Punta in O, apri fino ad A e traccia la circonferenza: incontra l’asse nei punti B e D.", "OB e OD sono lunghi quanto OA."],
      ["Passo 3 · Righello", "Unisci i quattro vertici", "Unisci in ordine A, B, C e D. Il quadrato è completo.", "Controlla con la squadra un angolo: deve essere retto."],
    ],
  }, (k) => {
    const A = k.punto("A", [-2.8, 0]); const C = k.punto("C", [2.8, 0]); const O = k.punto("O", [0, 0]);
    const B = k.punto("B", [0, 2.8]); const D = k.punto("D", [0, -2.8]);
    k.seg("segAC", A, C);
    const a = asse(k, "P", A, C, 3.5, 0.08, 0.68);
    k.traccia("lineAsse", [0, 3.3], [0, -3.3], [0.7, 0.96]);
    k.arco("circleO", O, 2.8, 180, 360);
    const lati = chiudi(k, "L", [A, B, C, D]);
    k.compare("O", 0.97); k.compare("B", 0.75); k.compare("D", 0.25);
    k.passo("A", "C", "segAC");
    k.passo(...a.nomi, "lineAsse", "O");
    k.passo("circleO", "B", "D");
    k.passo(...lati);
    k.risultato(...lati);
  });

  tavola("rettangolo-dati-lati", {
    title: "Rettangolo dati i due lati",
    tema: "Due perpendicolari e due misure",
    subtitle: "Tracci la base, alzi le perpendicolari ai due estremi e riporti su entrambe la misura dell’altezza.",
    coord: [-5.4, 5.6, -3.3, 4.8],
    proofTitle: "Quattro angoli retti",
    proofCopy: "AD e BC sono perpendicolari alla base, quindi gli angoli in A e in B sono retti. AD e BC sono lunghi uguali, perché hai usato la stessa apertura: il lato DC è parallelo ad AB e lungo quanto AB. Anche gli angoli in D e in C sono retti: ABCD è un rettangolo.",
    equality: "AB = DC = 7 cm · AD = BC = 4 cm",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Conosci i due lati del rettangolo: la base, lunga 7 cm, e l’altezza, lunga 4 cm. Vuoi costruire il rettangolo.", "I lati opposti di un rettangolo sono uguali."],
      ["Passo 1 · Base", "Traccia la base AB", "Con il righello traccia il segmento AB lungo 7 cm.", "Lascia spazio sopra."],
      ["Passo 2 · Perpendicolari", "Alza le perpendicolari in A e in B", "Costruisci la perpendicolare ad AB nell’estremo A e poi nell’estremo B (Costruzione 10, oppure con le squadre).", "Le due perpendicolari sono parallele tra loro."],
      ["Passo 3 · Altezza", "Trova D e C", "Apri il compasso a 4 cm. Punta in A e taglia la prima perpendicolare: trovi D. Punta in B e taglia la seconda: trovi C.", "Usa la stessa apertura per tutti e due i punti."],
      ["Passo 4 · Righello", "Chiudi il rettangolo", "Ripassa i lati AD e BC e unisci D con C. Il rettangolo è completo.", "Misura le due diagonali: devono essere uguali."],
    ],
  }, (k) => {
    const A = k.punto("A", [-3.5, -2.4]); const B = k.punto("B", [3.5, -2.4]);
    const D = k.punto("D", [-3.5, 1.6]); const C = k.punto("C", [3.5, 1.6]);
    k.seg("segDatA", [-5, 4.2], [2, 4.2], "base 7 cm"); k.seg("segDatB", [-5, 3.5], [-1, 3.5], "altezza 4 cm");
    k.traccia("drawAB", A, B);
    k.traccia("linePerpA", A, [A[0], A[1] + 5.2], [0.12, 0.5]); k.traccia("linePerpB", B, [B[0], B[1] + 5.2], [0.52, 0.9]);
    k.archetto("arcAD", A, D, 10, [0.12, 0.5]); k.archetto("arcBC", B, C, 10, [0.52, 0.9]);
    const w = finestre(3);
    k.traccia("drawAD", A, D, w[0]); k.traccia("drawBC", B, C, w[1]); k.traccia("drawDC", D, C, w[2]);
    k.compare("A", 0.12); k.compare("B", 0.95); k.compare("D", 0.4); k.compare("C", 0.85);
    k.passo("segDatA", "segDatB");
    k.passo("drawAB", "A", "B");
    k.passo("linePerpA", "linePerpB");
    k.passo("arcAD", "arcBC", "D", "C");
    k.passo("drawAD", "drawBC", "drawDC");
    k.risultato("drawAB", "drawAD", "drawBC", "drawDC");
  });

  tavola("rombo-date-diagonali", {
    title: "Rombo date le due diagonali",
    tema: "Diagonali perpendicolari",
    subtitle: "Tracci una diagonale, costruisci il suo asse e riporti su di esso metà dell’altra diagonale.",
    coord: [-5.6, 5.6, -3.4, 4.6],
    proofTitle: "Quattro triangoli rettangoli uguali",
    proofCopy: "Le due diagonali sono perpendicolari e si tagliano a metà nel punto O. Dividono il rombo in quattro triangoli rettangoli con gli stessi cateti, 4 cm e 2,5 cm: i quattro triangoli sono uguali, quindi lo sono anche le loro ipotenuse, che sono i lati del rombo.",
    equality: "AB = BC = CD = DA",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Conosci le due diagonali del rombo: la maggiore, lunga 8 cm, e la minore, lunga 5 cm. Vuoi costruire il rombo.", "Nel rombo le diagonali sono perpendicolari e si tagliano a metà."],
      ["Passo 1 · Diagonale maggiore", "Traccia AC", "Con il righello traccia il segmento AC lungo 8 cm.", "È la diagonale più lunga."],
      ["Passo 2 · Asse di AC", "Trova il centro O", "Costruisci l’asse del segmento AC (Costruzione 9): trovi il punto medio O e la retta perpendicolare.", "Sull’asse starà la diagonale minore."],
      ["Passo 3 · Metà diagonale minore", "Trova B e D", "Apri il compasso a 2,5 cm, cioè metà della diagonale minore. Punta in O e taglia l’asse sopra e sotto: trovi B e D.", "BD è lungo 5 cm."],
      ["Passo 4 · Righello", "Unisci i quattro vertici", "Unisci in ordine A, B, C e D. Il rombo è completo.", "Misura i quattro lati: devono essere uguali, circa 4,7 cm."],
    ],
  }, (k) => {
    const A = k.punto("A", [-4, 0]); const C = k.punto("C", [4, 0]); const O = k.punto("O", [0, 0]);
    const B = k.punto("B", [0, 2.5]); const D = k.punto("D", [0, -2.5]);
    k.seg("segDatA", [-5.3, 4.3], [-1.3, 4.3], "diagonale 8 cm"); k.seg("segDatB", [-5.3, 3.7], [-2.8, 3.7], "diagonale 5 cm");
    k.traccia("lineAC", A, C);
    const a = asse(k, "P", A, C, 4.6, 0.08, 0.68);
    k.traccia("lineAsse", [0, 2.9], [0, -2.9], [0.7, 0.96]);
    k.archetto("arcOB", O, B, 16, [0.12, 0.5]); k.archetto("arcOD", O, D, 16, [0.52, 0.9]);
    const lati = chiudi(k, "L", [A, B, C, D]);
    k.compare("A", 0.12); k.compare("C", 0.95); k.compare("O", 0.97); k.compare("B", 0.4); k.compare("D", 0.85);
    k.passo("segDatA", "segDatB");
    k.passo("lineAC", "A", "C");
    k.passo(...a.nomi, "lineAsse", "O");
    k.passo("arcOB", "arcOD", "B", "D");
    k.passo(...lati);
    k.risultato(...lati);
  });

  tavola("rombo-lato-diagonale", {
    title: "Rombo dati il lato e una diagonale",
    tema: "Quattro archetti uguali",
    subtitle: "Tracci la diagonale e incroci, sopra e sotto, due archetti con apertura uguale al lato.",
    coord: [-5.6, 5.6, -3.6, 4.6],
    proofTitle: "Quattro lati con la stessa apertura",
    proofCopy: "I punti B e D distano da A e da C quanto l’apertura del compasso, cioè 4,5 cm. I quattro lati AB, BC, CD e DA sono quindi uguali: il quadrilatero è un rombo. La diagonale AC lo divide in due triangoli isosceli uguali.",
    equality: "AB = BC = CD = DA = 4,5 cm",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Conosci il lato del rombo, lungo 4,5 cm, e una diagonale, lunga 7 cm. Vuoi costruire il rombo.", "La diagonale deve essere più corta del doppio del lato, altrimenti gli archetti non si incontrano."],
      ["Passo 1 · Diagonale", "Traccia AC", "Con il righello traccia il segmento AC lungo 7 cm.", "A e C sono due vertici opposti."],
      ["Passo 2 · Archetti da A", "Apri il compasso a 4,5 cm", "Prendi l’apertura di 4,5 cm. Punta in A e traccia un archetto sopra e uno sotto il segmento.", "Tieni ferma l’apertura."],
      ["Passo 3 · Archetti da C", "Trova B e D", "Con la stessa apertura punta in C e incrocia i due archetti: trovi B sopra e D sotto.", "B e D distano 4,5 cm sia da A sia da C."],
      ["Passo 4 · Righello", "Unisci i quattro vertici", "Unisci in ordine A, B, C e D. Il rombo è completo.", "Traccia la diagonale BD: è perpendicolare ad AC."],
    ],
  }, (k) => {
    const A = k.punto("A", [-3.5, 0.1]); const C = k.punto("C", [3.5, 0.1]);
    const h = Math.sqrt(4.5 * 4.5 - 3.5 * 3.5);
    const B = k.punto("B", [0, 0.1 + h]); const D = k.punto("D", [0, 0.1 - h]);
    k.seg("segDatA", [-5.3, 4.3], [-3.05, 4.3], "lato 4,5 cm"); k.seg("segDatB", [-5.3, 3.7], [-1.8, 3.7], "diagonale 7 cm");
    k.traccia("lineAC", A, C);
    k.archetto("arcAB", A, B, 11, [0.12, 0.5]); k.archetto("arcAD", A, D, 11, [0.52, 0.9]);
    k.archetto("arcCB", C, B, 11, [0.12, 0.5]); k.archetto("arcCD", C, D, 11, [0.52, 0.9]);
    const lati = chiudi(k, "L", [A, B, C, D]);
    k.compare("A", 0.12); k.compare("C", 0.95); k.compare("B", 0.4); k.compare("D", 0.85);
    k.passo("segDatA", "segDatB");
    k.passo("lineAC", "A", "C");
    k.passo("arcAB", "arcAD");
    k.passo("arcCB", "arcCD", "B", "D");
    k.passo(...lati);
    k.risultato(...lati);
  });

  tavola("parallelogramma-lati-diagonale", {
    title: "Parallelogramma dati i lati e una diagonale",
    tema: "Due triangoli uguali",
    subtitle: "La diagonale divide il parallelogramma in due triangoli: costruisci il primo con tre lati noti, poi il secondo.",
    coord: [-5.6, 6.4, -3.2, 4.8],
    proofTitle: "Lati opposti uguali",
    proofCopy: "Il punto D dista 4 cm da A e 5 cm da B: il triangolo ABD ha i tre lati richiesti. Il punto C dista 6 cm da D e 4 cm da B: i lati opposti del quadrilatero sono uguali a due a due, AB = DC e AD = BC. Un quadrilatero non intrecciato con i lati opposti uguali è un parallelogramma.",
    equality: "AB = DC = 6 cm · AD = BC = 4 cm",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Conosci i due lati del parallelogramma, 6 cm e 4 cm, e la diagonale BD, lunga 5 cm. Vuoi costruire il parallelogramma.", "Con i soli lati il parallelogramma può «schiacciarsi»: la diagonale lo blocca."],
      ["Passo 1 · Primo lato", "Traccia AB", "Con il righello traccia il segmento AB lungo 6 cm.", "È la base."],
      ["Passo 2 · Vertice D", "Incrocia due archetti", "Apri il compasso a 4 cm, punta in A e traccia un archetto sopra la base. Apri a 5 cm, punta in B e incrocia il primo archetto: trovi D.", "ABD è un triangolo dati i tre lati (Costruzione 17)."],
      ["Passo 3 · Vertice C", "Incrocia altri due archetti", "Apri il compasso a 6 cm, punta in D e traccia un archetto a destra. Apri a 4 cm, punta in B e incrocia l’archetto sopra la base: trovi C.", "C sta dalla parte opposta di A rispetto alla diagonale BD."],
      ["Passo 4 · Righello", "Unisci i quattro vertici", "Unisci in ordine A, B, C e D. Il parallelogramma è completo.", "Controlla con le squadre: AB è parallelo a DC, AD è parallelo a BC."],
    ],
  }, (k) => {
    const A = k.punto("A", [-3.9, -2.3]); const B = k.punto("B", [2.1, -2.3]);
    const dx = (16 - 25 + 36) / 12;
    const D = k.punto("D", [A[0] + dx, A[1] + Math.sqrt(16 - dx * dx)]);
    const C = k.punto("C", [D[0] + 6, D[1]]);
    k.seg("segDatA", [-5.2, 4.4], [0.8, 4.4], "lato 6 cm"); k.seg("segDatB", [-5.2, 3.8], [-1.2, 3.8], "lato 4 cm"); k.seg("segDatC", [-5.2, 3.2], [-0.2, 3.2], "diagonale 5 cm");
    k.traccia("drawAB", A, B);
    k.archetto("arcAD", A, D, 12, [0.12, 0.5]); k.archetto("arcBD", B, D, 12, [0.52, 0.9]);
    k.archetto("arcDC", D, C, 9, [0.12, 0.5]); k.archetto("arcBC", B, C, 12, [0.52, 0.9]);
    const w = finestre(4);
    k.traccia("drawBC", B, C, w[0]); k.traccia("drawCD", C, D, w[1]); k.traccia("drawDA", D, A, w[2]); k.traccia("lineBD", B, D, w[3]);
    k.tratteggia("lineBD");
    k.compare("A", 0.12); k.compare("B", 0.95); k.compare("D", 0.85); k.compare("C", 0.85);
    k.passo("segDatA", "segDatB", "segDatC");
    k.passo("drawAB", "A", "B");
    k.passo("arcAD", "arcBD", "D");
    k.passo("arcDC", "arcBC", "C");
    k.passo("drawBC", "drawCD", "drawDA", "lineBD");
    k.risultato("drawAB", "drawBC", "drawCD", "drawDA");
  });

  tavola("trapezio-isoscele", {
    title: "Trapezio isoscele date le basi e l’altezza",
    tema: "Simmetrico rispetto all’asse",
    subtitle: "L’asse della base maggiore fa da guida: su di esso riporti l’altezza, poi metà della base minore da una parte e dall’altra.",
    coord: [-5.6, 5.6, -3.3, 4.9],
    proofTitle: "L’asse di simmetria",
    proofCopy: "La base minore DC è perpendicolare all’asse, quindi è parallela alla base maggiore AB. I punti D e C sono alla stessa distanza dall’asse, come A e B: la figura è simmetrica rispetto all’asse, e i due lati obliqui AD e BC sono uguali. Un trapezio con i lati obliqui uguali è isoscele.",
    equality: "AB ∥ DC · AD = BC",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Conosci la base maggiore, lunga 8 cm, la base minore, lunga 4 cm, e l’altezza, lunga 3,5 cm. Vuoi costruire il trapezio isoscele.", "Isoscele significa che i due lati obliqui sono uguali."],
      ["Passo 1 · Base maggiore", "Traccia AB", "Con il righello traccia il segmento AB lungo 8 cm.", "Lascia spazio sopra."],
      ["Passo 2 · Asse di AB", "Trova M", "Costruisci l’asse del segmento AB (Costruzione 9): trovi il punto medio M e la retta perpendicolare.", "È l’asse di simmetria del trapezio."],
      ["Passo 3 · Altezza", "Trova N", "Apri il compasso a 3,5 cm. Punta in M e taglia l’asse sopra la base: trovi N. Per N traccia la perpendicolare all’asse, con le squadre.", "Questa retta è parallela ad AB."],
      ["Passo 4 · Base minore", "Trova D e C", "Apri il compasso a 2 cm, cioè metà della base minore. Punta in N e taglia la parallela da una parte e dall’altra: trovi D e C.", "DC è lungo 4 cm."],
      ["Passo 5 · Righello", "Unisci i quattro vertici", "Unisci A con D e B con C e ripassa le due basi. Il trapezio isoscele è completo.", "Misura i due lati obliqui: devono essere uguali."],
    ],
  }, (k) => {
    const y0 = -2.4;
    const A = k.punto("A", [-4, y0]); const B = k.punto("B", [4, y0]); const M = k.punto("M", [0, y0]);
    const N = k.punto("N", [0, y0 + 3.5]); const D = k.punto("D", [-2, y0 + 3.5]); const C = k.punto("C", [2, y0 + 3.5]);
    k.seg("segDatA", [-5.4, 4.5], [2.6, 4.5], "base maggiore 8 cm"); k.seg("segDatB", [-5.4, 3.9], [-1.4, 3.9], "base minore 4 cm"); k.seg("segDatC", [-5.4, 3.3], [-1.9, 3.3], "altezza 3,5 cm");
    k.traccia("drawAB", A, B);
    const a = asse(k, "P", A, B, 4.6, 0.08, 0.68);
    k.traccia("lineAsse", [0, y0 + 4.6], [0, y0 - 0.7], [0.7, 0.96]);
    k.archetto("arcMN", M, N, 12, [0.12, 0.5]);
    k.traccia("linePar", [-3.6, N[1]], [3.6, N[1]], [0.55, 0.95]);
    k.archetto("arcND", N, D, 16, [0.12, 0.5]); k.archetto("arcNC", N, C, 16, [0.52, 0.9]);
    const w = finestre(3);
    k.traccia("drawAD", A, D, w[0]); k.traccia("drawDC", D, C, w[1]); k.traccia("drawCB", C, B, w[2]);
    k.compare("A", 0.12); k.compare("B", 0.95); k.compare("M", 0.97); k.compare("N", 0.5); k.compare("D", 0.4); k.compare("C", 0.85);
    k.passo("segDatA", "segDatB", "segDatC");
    k.passo("drawAB", "A", "B");
    k.passo(...a.nomi, "lineAsse", "M");
    k.passo("arcMN", "linePar", "N");
    k.passo("arcND", "arcNC", "D", "C");
    k.passo("drawAD", "drawDC", "drawCB");
    k.risultato("drawAB", "drawAD", "drawDC", "drawCB");
  });

  tavola("equilatero-data-altezza", {
    title: "Triangolo equilatero data l’altezza",
    tema: "Due angoli di 30° dal vertice",
    subtitle: "Alzi l’altezza su una retta e, dal vertice, costruisci 30° da una parte e 30° dall’altra.",
    coord: [-6.6, 5.4, -3.4, 3.9],
    proofTitle: "30° + 30° = 60°",
    proofCopy: "Dal vertice C partono due lati che formano 30° ciascuno con l’altezza: l’angolo in C misura 60°. L’altezza è perpendicolare alla base, quindi nei triangoli rettangoli CHA e CHB l’angolo in A e quello in B valgono 90° − 30° = 60°. Un triangolo con tre angoli di 60° è equilatero.",
    equality: "tre angoli di 60°",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Conosci l’altezza del triangolo equilatero, lunga 5 cm, ma non il lato. Sulla retta r è segnato il punto H, dove cadrà l’altezza.", "In un triangolo equilatero l’altezza divide a metà l’angolo al vertice."],
      ["Passo 1 · Perpendicolare in H", "Alza la perpendicolare", "Costruisci la perpendicolare alla retta r nel punto H (Costruzione 1).", "Su questa retta starà l’altezza."],
      ["Passo 2 · Altezza", "Segna il vertice C", "Apri il compasso a 5 cm. Punta in H e taglia la perpendicolare: trovi il vertice C.", "HC è lungo quanto l’altezza."],
      ["Passo 3 · Arco da C", "Trova P, 1 e 2", "Punta in C con un’apertura a piacere e traccia un arco ampio verso il basso: incontra l’altezza nel punto P. Con la stessa apertura punta in P e taglia l’arco da una parte e dall’altra: trovi i punti 1 e 2.", "Le direzioni C1 e C2 formano 60° con l’altezza."],
      ["Passo 4 · Due bisettrici", "Trova 3 e 4", "Con la stessa apertura punta in P e poi in 1: i due archetti si incrociano nel punto 3. Poi punta in P e in 2: trovi il punto 4.", "Stai dividendo a metà i due angoli di 60°."],
      ["Passo 5 · Righello", "Traccia i lati", "Traccia la retta che passa per C e per 3 fino alla retta r: trovi A. Traccia la retta che passa per C e per 4: trovi B. Ripassa la base AB.", "Misura i tre lati: devono essere uguali, circa 5,8 cm."],
    ],
  }, (k) => {
    const y0 = -2.6;
    const H = k.punto("H", [0.4, y0]); const C = k.punto("C", [0.4, y0 + 5]);
    const r = 2.4;
    const P = k.punto("P", [C[0], C[1] - r]);
    const N1 = k.punto("N1", polare(C, r, 210), "1"); const N2 = k.punto("N2", polare(C, r, 330), "2");
    const N3 = k.punto("N3", polare(C, r * Math.sqrt(3), 240), "3"); const N4 = k.punto("N4", polare(C, r * Math.sqrt(3), 300), "4");
    const lato = 10 / Math.sqrt(3);
    const A = k.punto("A", [H[0] - lato / 2, y0]); const B = k.punto("B", [H[0] + lato / 2, y0]);
    k.seg("lineR", [-6.4, y0], [5.2, y0], "r");
    k.seg("segDatA", [-6.2, 3.3], [-1.2, 3.3], "altezza 5 cm");
    const perp = perpendicolareIn(k, "P", H, 1.3, 5.9);
    k.archetto("arcHC", H, C, 8);
    k.arco("arcC", C, r, 200, 140, [0.1, 0.5]);
    k.archetto("arcP1", P, N1, 9, [0.5, 0.7]); k.archetto("arcP2", P, N2, 9, [0.7, 0.9]);
    k.archetto("arcP3", P, N3, 9, [0.1, 0.3]); k.archetto("arcU3", N1, N3, 9, [0.3, 0.5]);
    k.archetto("arcP4", P, N4, 9, [0.5, 0.7]); k.archetto("arcU4", N2, N4, 9, [0.7, 0.9]);
    k.traccia("drawCA", C, A, [0.12, 0.4]); k.traccia("drawCB", C, B, [0.4, 0.68]); k.traccia("drawAB", A, B, [0.68, 0.94]);
    k.compare("C", 0.6); k.compare("P", 0.3); k.compare("N1", 0.7); k.compare("N2", 0.9); k.compare("N3", 0.5); k.compare("N4", 0.9);
    k.compare("A", 0.4); k.compare("B", 0.68);
    k.passo("lineR", "H", "segDatA");
    k.passo(...perp);
    k.passo("arcHC", "C");
    k.passo("arcC", "arcP1", "arcP2", "P", "N1", "N2");
    k.passo("arcP3", "arcU3", "arcP4", "arcU4", "N3", "N4");
    k.passo("drawCA", "drawCB", "drawAB", "A", "B");
    k.risultato("drawCA", "drawCB", "drawAB");
  });

  // ══ Poligoni ══════════════════════════════════════════════════════════════

  tavola("poligono-dato-lato-generale", {
    title: "Poligono regolare dato il lato: metodo generale",
    tema: "Una scala di centri sull’asse",
    subtitle: "Sull’asse del lato trovi i centri del quadrato e dell’esagono; da lì una scala a passo costante dà i centri degli altri poligoni. Qui i lati sono 7.",
    coord: [-6.3, 6.3, -3.5, 4.3],
    proofTitle: "Un metodo pratico, con un errore che cresce",
    proofCopy: "I punti 4 e 6 sono esatti: sono i centri del quadrato e dell’esagono che hanno AB come lato. Gli altri centri si ottengono a passo costante, e questa è un’approssimazione. Per il pentagono e per l’ettagono l’errore è piccolo: nell’ettagono i due lati in alto vengono circa il 3 per cento più lunghi degli altri, poco più di 1 mm su un lato di 4 cm. Dall’ottagono in su l’errore diventa troppo grande: meglio usare le costruzioni specifiche.",
    equality: "centro 5 a metà tra 4 e 6 · centro 7 un passo oltre 6",
    steps: [
      ["Prima di iniziare", "Osserva il lato AB", "Hai il lato AB e vuoi costruire un poligono regolare che abbia quel lato: qui un ettagono, con sette lati.", "Lo stesso metodo vale per il pentagono, cambiando centro."],
      ["Passo 1 · Asse di AB", "Trova M", "Costruisci l’asse del segmento AB (Costruzione 9): trovi il punto medio M e la retta perpendicolare.", "Tutti i centri staranno su questa retta."],
      ["Passo 2 · Centri 4 e 6", "Due archi", "Punta in M con apertura MA e taglia l’asse: trovi il punto 4. Punta in A con apertura AB e taglia l’asse: trovi il punto 6.", "4 è il centro del quadrato di lato AB, 6 quello dell’esagono."],
      ["Passo 3 · Centro 5", "Dividi a metà", "Trova il punto medio del segmento che va da 4 a 6: è il punto 5.", "5 è il centro (approssimato) del pentagono."],
      ["Passo 4 · Centro 7", "Riporta il passo", "Apri il compasso quanto la distanza tra 5 e 6. Punta in 6 e taglia l’asse più in alto: trovi il punto 7.", "Continuando troveresti 8, 9, 10: ma l’errore cresce."],
      ["Passo 5 · Circonferenza", "Punta in 7", "Punta in 7, apri fino ad A e traccia la circonferenza: passa anche per B.", "È la circonferenza su cui stanno i vertici dell’ettagono."],
      ["Passo 6 · Riporta il lato", "Trova gli altri vertici", "Apri il compasso quanto AB. Partendo da B trova C e poi D. Partendo da A trova G e poi F. Il settimo vertice, E, è il punto più alto: dove la circonferenza incontra l’asse.", "Se riporti ancora il lato da D e da F, i due archetti cadono vicino a E ma non coincidono: è l’errore del metodo."],
      ["Passo 7 · Righello", "Unisci i sette vertici", "Unisci in ordine A, B, C, D, E, F e G. L’ettagono è completo.", "I lati DE ed EF vengono un po’ più lunghi degli altri."],
    ],
  }, (k) => {
    const s = 2.9; const y0 = -3.1;
    const A = k.punto("A", [-s / 2, y0]); const B = k.punto("B", [s / 2, y0]); const M = k.punto("M", [0, y0]);
    const h4 = s / 2; const h6 = (s * Math.sqrt(3)) / 2; const passo = (h6 - h4) / 2;
    const N4 = k.punto("N4", [0, y0 + h4], "4"); const N6 = k.punto("N6", [0, y0 + h6], "6");
    const N5 = k.punto("N5", [0, y0 + h4 + passo], "5"); const N7 = k.punto("N7", [0, y0 + h6 + passo], "7");
    const R = distanza(N7, A);
    const ang = (2 * Math.asin(s / (2 * R))) / RAD;
    const gB = direzione(N7, B); const gA = direzione(N7, A);
    const C = k.punto("C", polare(N7, R, gB + ang)); const D = k.punto("D", polare(N7, R, gB + 2 * ang));
    const G = k.punto("G", polare(N7, R, gA - ang)); const F = k.punto("F", polare(N7, R, gA - 2 * ang));
    const E = k.punto("E", [0, N7[1] + R]);
    k.seg("segAB", A, B);
    const a = asse(k, "P", A, B, 2.3, 0.08, 0.68);
    k.traccia("lineAsse", [0, y0 - 0.5], [0, E[1] + 0.3], [0.7, 0.96]);
    k.archetto("arcM4", M, N4, 16, [0.12, 0.5]); k.archetto("arcA6", A, N6, 12, [0.52, 0.9]);
    k.archetto("arcK5", N4, N5, 20); k.archetto("arcK7", N6, N7, 20);
    k.arco("circleO", N7, R, gA, 360);
    const w = finestre(4);
    k.archetto("arcBC", B, C, 10, w[0]); k.archetto("arcCD", C, D, 10, w[1]); k.archetto("arcAG", A, G, 10, w[2]); k.archetto("arcGF", G, F, 10, w[3]);
    const lati = chiudi(k, "L", [A, B, C, D, E, F, G]);
    k.compare("M", 0.97); k.compare("N4", 0.4); k.compare("N6", 0.85); k.compare("N5", 0.6); k.compare("N7", 0.6);
    k.compare("C", w[0][1]); k.compare("D", w[1][1]); k.compare("G", w[2][1]); k.compare("F", w[3][1]); k.compare("E", 0.96);
    k.passo("A", "B", "segAB");
    k.passo(...a.nomi, "lineAsse", "M");
    k.passo("arcM4", "arcA6", "N4", "N6");
    k.passo("arcK5", "N5");
    k.passo("arcK7", "N7");
    k.passo("circleO");
    k.passo("arcBC", "arcCD", "arcAG", "arcGF", "C", "D", "G", "F", "E");
    k.passo(...lati);
    k.risultato(...lati);
  });

  tavola("decagono-dato-lato", {
    title: "Decagono regolare dato il lato",
    tema: "Il raggio dal numero aureo",
    subtitle: "Nel decagono regolare il raggio è circa 1,618 volte il lato: lo costruisci con una perpendicolare e un arco.",
    coord: [-6.4, 7.4, -3.8, 5.6],
    proofTitle: "Lato e raggio in rapporto aureo",
    proofCopy: "Nel decagono regolare il raggio della circonferenza circoscritta è circa 1,618 volte il lato: è il numero aureo. La costruzione con i punti M, 1 e 2 è la stessa della diagonale del pentagono (Costruzione 22): A2 è lunga 1,618 volte AB. Il punto O dista A2 sia da A sia da B: è il centro, e il lato riportato dieci volte chiude esattamente il giro.",
    equality: "raggio ≈ 1,618 × lato",
    steps: [
      ["Prima di iniziare", "Osserva il lato AB", "Hai il lato AB, tracciato su una retta r. Vuoi costruire il decagono regolare, con dieci lati, che ha proprio quel lato.", "Devi trovare il raggio della circonferenza che passa per tutti i vertici."],
      ["Passo 1 · Punto medio", "Trova M", "Costruisci l’asse del segmento AB (Costruzione 9): trovi il punto medio M.", "Il centro del decagono starà sull’asse."],
      ["Passo 2 · Perpendicolare in B", "Trova il punto 1", "Alza la perpendicolare ad AB nell’estremo B (Costruzione 10). Punta in B con apertura BA e taglia la perpendicolare: trovi il punto 1.", "B1 è lungo quanto il lato."],
      ["Passo 3 · Arco da M", "Trova il punto 2", "Punta in M con apertura M1 e traccia un arco fino alla retta r, oltre B: trovi il punto 2.", "La distanza da A a 2 è il raggio del decagono."],
      ["Passo 4 · Centro", "Trova O", "Apri il compasso quanto A2. Punta in A e poi in B: i due archetti si incrociano sull’asse nel punto O.", "O è il centro del decagono."],
      ["Passo 5 · Circonferenza", "Punta in O", "Con la stessa apertura punta in O e traccia la circonferenza: passa per A e per B.", "Tutti i vertici staranno su questa circonferenza."],
      ["Passo 6 · Riporta il lato", "Trova gli altri otto vertici", "Apri il compasso quanto AB e riporta il lato lungo la circonferenza: quattro volte partendo da B e quattro volte partendo da A.", "Gli ultimi due vertici, in alto, devono distare tra loro quanto AB."],
      ["Passo 7 · Righello", "Unisci i dieci vertici", "Unisci i dieci punti uno dopo l’altro, girando lungo la circonferenza. Il decagono è completo.", "Controlla l’ultimo lato, quello in alto."],
    ],
  }, (k) => {
    const s = 2.2; const y0 = -3.2;
    const A = k.punto("A", [-s / 2, y0]); const B = k.punto("B", [s / 2, y0]); const M = k.punto("M", [0, y0]);
    const N1 = k.punto("N1", [s / 2, y0 + s], "1");
    const rM = distanza(M, N1);
    const N2 = k.punto("N2", [rM, y0], "2");
    const R = distanza(A, N2);
    const O = k.punto("O", [0, y0 + Math.sqrt(R * R - (s * s) / 4)]);
    const V = []; const g0 = direzione(O, A);
    for (let i = 0; i < 10; i += 1) V.push(polare(O, R, g0 + 36 * i));
    k.seg("lineR", [-6.2, y0], [7.2, y0], "r");
    k.seg("segAB", A, B);
    const a = asse(k, "P", A, B, 1.9, 0.08, 0.68);
    k.traccia("lineAsse", [0, y0 - 0.5], [0, O[1] + R + 0.3], [0.7, 0.96]);
    k.traccia("linePerpB", B, [B[0], y0 + s + 0.9], [0.12, 0.5]);
    k.archetto("arcB1", B, N1, 14, [0.52, 0.9]);
    k.arco("arcM2", M, rM, -5, direzione(M, N1) + 12);
    k.archetto("arcAO", A, O, 7, [0.12, 0.5]); k.archetto("arcBO", B, O, 7, [0.52, 0.9]);
    k.arco("circleO", O, R, g0, 360);
    const ordine = [2, 3, 4, 5, 9, 8, 7, 6];
    const w = finestre(8);
    const archetti = ordine.map((i, n) => {
      const da = i <= 5 ? V[i - 1] : V[(i + 1) % 10];
      const nome = `arcV${i}`;
      k.archetto(nome, da, V[i], 9, w[n]);
      puntoMuto(k.t, `Vp${i}`, V[i]); k.compare(`Vp${i}`, w[n][1]);
      return nome;
    });
    const lati = chiudi(k, "L", V);
    k.compare("M", 0.97); k.compare("N1", 0.85); k.compare("N2", 0.2); k.compare("O", 0.85);
    k.passo("A", "B", "segAB", "lineR");
    k.passo(...a.nomi, "lineAsse", "M");
    k.passo("linePerpB", "arcB1", "N1");
    k.passo("arcM2", "N2");
    k.passo("arcAO", "arcBO", "O");
    k.passo("circleO");
    k.passo(...archetti, ...ordine.map((i) => `Vp${i}`));
    k.passo(...lati);
    k.risultato(...lati);
  });

  /** Divisione della circonferenza in n parti con il metodo generale (Costruzione 25). */
  function divisioneGenerale(slug, n, nomePoligono, testi) {
    tavola(slug, {
      title: `${nomePoligono} inscritto in una circonferenza`,
      tema: `Circonferenza divisa in ${n} parti`,
      subtitle: `Il metodo generale di divisione (Costruzione 25) applicato a ${n} parti: il diametro si divide in ${n} e si usano i punti pari.`,
      coord: [-5.8, 5.8, -3.6, 3.6],
      proofTitle: "Un’approssimazione, da usare sapendolo",
      proofCopy: testi.perche,
      equality: `${n} parti sul diametro → ${n} lati`,
      steps: [
        ["Prima di iniziare", "Osserva la circonferenza", `Hai una circonferenza con centro O. Vuoi dividerla in ${n} parti uguali e disegnare ${testi.articolo}, il poligono con ${n} lati.`, `Con riga e compasso ${testi.articolo} regolare esatto non si può costruire: questo metodo dà una buona approssimazione.`],
        ["Passo 1 · Diametro verticale", "Segna A e S", "Traccia il diametro verticale: in alto incontra la circonferenza nel punto A, in basso nel punto S.", "A sarà il primo vertice."],
        [`Passo 2 · ${n} parti`, "Dividi il diametro AS", `Dividi il diametro AS in ${n} parti uguali con il metodo delle parallele (Costruzione 3). Numera i punti partendo da A.`, "Tante parti quanti sono i lati."],
        ["Passo 3 · Punti T e U", "Prolunga il diametro orizzontale", "Traccia il diametro orizzontale e prolungalo da tutte e due le parti. Punta in S con apertura SA e traccia un arco: incontra i prolungamenti in T, a sinistra, e in U, a destra.", "L’arco passa per A."],
        ["Passo 4 · Rette da T", "Trova i vertici di destra", `Da T traccia le rette che passano per i punti pari (${testi.pari}) e prolungale fino alla parte opposta della circonferenza: ogni retta trova un vertice.`, "Si usano solo i punti pari."],
        ["Passo 5 · Rette da U", "Trova i vertici di sinistra", "Fai lo stesso da U, con gli stessi punti pari: trovi i vertici dell’altra metà.", "I vertici sono simmetrici rispetto al diametro verticale."],
        ["Passo 6 · Righello", `Unisci ${testi.gli} ${n} vertici`, `Parti da A e unisci i vertici uno dopo l’altro, girando lungo la circonferenza. ${testi.fine}`, testi.consiglio],
      ],
    }, (k) => {
      const O = k.punto("O", [0, 0]);
      const R = 2.8;
      const A = k.punto("A", [0, R]); const S = k.punto("S", [0, -R]);
      const T = k.punto("T", [-R * Math.sqrt(3), 0]); const U = k.punto("U", [R * Math.sqrt(3), 0]);
      const lontano = (da, per) => {
        const d = distanza(da, per); const u = [(per[0] - da[0]) / d, (per[1] - da[1]) / d];
        const b = da[0] * u[0] + da[1] * u[1]; const c = da[0] ** 2 + da[1] ** 2 - R * R;
        const q = -b + Math.sqrt(b * b - c);
        return [da[0] + q * u[0], da[1] + q * u[1]];
      };
      const div = [];
      for (let i = 1; i < n; i += 1) {
        const p = [0, R - (2 * R * i) / n];
        if (i % 2 === 0) k.punto(`N${i}`, p, String(i)); else puntoMuto(k.t, `N${i}`, p);
        div.push(`N${i}`);
      }
      const pari = []; for (let i = 2; i < n; i += 2) pari.push([0, R - (2 * R * i) / n]);
      const destra = pari.map((p) => lontano(T, p)); const sinistra = pari.map((p) => lontano(U, p));
      k.cerchio("circleO", O, R);
      k.traccia("diamV", [0, R + 0.4], [0, -R - 0.4]);
      k.traccia("diamH", [-5.6, 0], [5.6, 0], [0.12, 0.45]);
      k.arco("arcS", S, 2 * R, 24, 132, [0.45, 0.95]);
      const w = finestre(pari.length);
      const rT = []; const rU = []; const pD = []; const pS = [];
      destra.forEach((p, i) => { k.traccia(`lineT${i}`, T, oltre(T, p, 0.3), w[i]); puntoMuto(k.t, `Vd${i}`, p); k.compare(`Vd${i}`, w[i][1]); rT.push(`lineT${i}`); pD.push(`Vd${i}`); });
      sinistra.forEach((p, i) => { k.traccia(`lineU${i}`, U, oltre(U, p, 0.3), w[i]); puntoMuto(k.t, `Vq${i}`, p); k.compare(`Vq${i}`, w[i][1]); rU.push(`lineU${i}`); pS.push(`Vq${i}`); });
      const giro = [A, ...destra, ...sinistra.slice().reverse()];
      const lati = chiudi(k, "L", giro);
      k.compare("A", 0.2); k.compare("S", 0.95); k.compare("U", 0.55); k.compare("T", 0.93);
      k.passo("O", "circleO");
      k.passo("diamV", "A", "S");
      k.passo(...div);
      k.passo("diamH", "arcS", "T", "U");
      k.passo(...rT, ...pD);
      k.passo(...rU, ...pS);
      k.passo(...lati);
      k.risultato(...lati);
    });
  }

  divisioneGenerale("ennagono-inscritto", 9, "Ennagono", {
    articolo: "un ennagono", gli: "i", pari: "2, 4, 6 e 8",
    perche: "Il metodo generale è esatto solo per il triangolo, il quadrato e l’esagono. Nell’ennagono i lati vengono giusti entro l’1,5 per cento circa, tranne quello in basso, che viene circa il 3 per cento più lungo: su un lato di 3 cm è quasi un millimetro. Per un disegno a matita è una precisione accettabile.",
    fine: "L’ennagono è completo.", consiglio: "Il lato in basso viene un po’ più lungo degli altri: è normale.",
  });
  divisioneGenerale("endecagono-inscritto", 11, "Endecagono", {
    articolo: "un endecagono", gli: "gli", pari: "2, 4, 6, 8 e 10",
    perche: "Il metodo generale è esatto solo per il triangolo, il quadrato e l’esagono. Nell’endecagono i lati vengono giusti entro l’1,5 per cento circa, tranne quello in basso, che viene quasi il 4 per cento più lungo: su un lato di 3 cm è circa un millimetro. Più lati ha il poligono, più l’errore si concentra sull’ultimo lato.",
    fine: "L’endecagono è completo.", consiglio: "Il lato in basso viene un po’ più lungo degli altri: è normale.",
  });

  // ══ Sezione aurea ═════════════════════════════════════════════════════════

  tavola("sezione-aurea", {
    title: "Sezione aurea di un segmento",
    tema: "La proporzione «divina»",
    subtitle: "Dividi un segmento in due parti in modo che la più lunga stia all’intero come la più corta sta alla più lunga.",
    coord: [-5.6, 5.6, -3.7, 3.2],
    proofTitle: "Il rapporto 0,618",
    proofCopy: "Il triangolo ABC è rettangolo, con il cateto BC lungo la metà di AB. Per il teorema di Pitagora l’ipotenusa AC è circa 1,118 volte AB. Togliendo CD, che è metà di AB, resta AD = 0,618 volte AB: è la parte aurea. Il punto E divide AB in modo che AB : AE = AE : EB, e questo rapporto vale circa 1,618.",
    equality: "AB : AE = AE : EB ≈ 1,618",
    steps: [
      ["Prima di iniziare", "Osserva il segmento AB", "Hai un segmento AB. Vuoi trovare il punto E che lo divide secondo la sezione aurea: una proporzione studiata fin dall’antichità e amata da molti artisti.", "La parte più lunga sarà circa il 62 per cento del segmento."],
      ["Passo 1 · Punto medio", "Trova M", "Costruisci l’asse del segmento AB (Costruzione 9): trovi il punto medio M.", "Ti serve la metà di AB."],
      ["Passo 2 · Perpendicolare in B", "Trova C", "Alza la perpendicolare ad AB nell’estremo B (Costruzione 10). Punta in B con apertura BM e taglia la perpendicolare: trovi C.", "BC è lungo la metà di AB."],
      ["Passo 3 · Ipotenusa", "Unisci A con C", "Con il righello traccia il segmento AC.", "ABC è un triangolo rettangolo."],
      ["Passo 4 · Arco da C", "Trova D", "Punta in C con apertura CB e taglia il segmento AC: trovi D.", "Hai tolto da AC la metà di AB."],
      ["Passo 5 · Arco da A", "Trova E", "Punta in A con apertura AD e taglia il segmento AB: trovi E. AE è la parte aurea di AB.", "Misura: AE deve essere circa 0,62 volte AB."],
    ],
  }, (k) => {
    const y0 = -0.6; const L = 6.4;
    const A = k.punto("A", [-3.2, y0]); const B = k.punto("B", [3.2, y0]); const M = k.punto("M", [0, y0]);
    const C = k.punto("C", [3.2, y0 + L / 2]);
    const gCA = direzione(C, A);
    const D = k.punto("D", polare(C, L / 2, gCA));
    const E = k.punto("E", [A[0] + distanza(A, D), y0]);
    k.seg("segAB", A, B);
    const a = asse(k, "P", A, B, 4.31, 0.08, 0.68);
    k.traccia("lineAsse", [0, a.X1[1] + 0.3], [0, a.X2[1] - 0.3], [0.7, 0.96]);
    k.traccia("linePerpB", B, [3.2, y0 + 3.6], [0.12, 0.5]);
    k.arco("arcBC", B, L / 2, 82, 104, [0.52, 0.9]);
    k.traccia("lineAC", A, C);
    k.arco("arcCD", C, L / 2, gCA - 14, 28);
    k.arco("arcAE", A, distanza(A, D), -8, direzione(A, D) + 16);
    k.traccia("drawAE", A, E, [0.6, 0.95]);
    k.compare("M", 0.97); k.compare("C", 0.6); k.compare("D", 0.6); k.compare("E", 0.3);
    k.passo("A", "B", "segAB");
    k.passo(...a.nomi, "lineAsse", "M");
    k.passo("linePerpB", "arcBC", "C");
    k.passo("lineAC");
    k.passo("arcCD", "D");
    k.passo("arcAE", "drawAE", "E");
    k.risultato("drawAE");
  });

  tavola("rettangolo-aureo", {
    title: "Rettangolo aureo",
    tema: "Dal quadrato al rettangolo più famoso",
    subtitle: "Parti da un quadrato: un arco dal punto medio della base lo allunga fino alla proporzione aurea.",
    coord: [-5.7, 5.7, -3.5, 3.5],
    proofTitle: "Base e altezza in rapporto 1,618",
    proofCopy: "Il segmento MC è l’ipotenusa di un triangolo rettangolo con i cateti lunghi metà lato e un lato: è circa 1,118 volte il lato. La base AE è la somma di AM, metà lato, e di ME, uguale a MC: in tutto circa 1,618 volte il lato. È il rapporto aureo. Molti lo hanno cercato nella facciata del Partenone, ma gli studiosi non sono d’accordo. Alcuni formati di uso comune, come le carte di credito, gli si avvicinano soltanto.",
    equality: "AE : AD ≈ 1,618",
    steps: [
      ["Prima di iniziare", "Parti dal quadrato", "Hai un quadrato ABCD (Costruzione 7). Vuoi allungarlo fino a ottenere un rettangolo aureo.", "L’altezza del rettangolo sarà il lato del quadrato."],
      ["Passo 1 · Punto medio", "Trova M", "Costruisci l’asse del lato AB (Costruzione 9): trovi il punto medio M.", "M divide la base del quadrato a metà."],
      ["Passo 2 · Arco da M", "Trova E", "Prolunga il lato AB oltre B. Punta in M, apri fino al vertice C e traccia un arco fino al prolungamento: trovi E.", "ME è lungo quanto MC."],
      ["Passo 3 · Perpendicolare in E", "Trova F", "Alza la perpendicolare ad AE nel punto E e prolunga il lato DC del quadrato: le due rette si incontrano in F.", "EF è lungo quanto il lato del quadrato."],
      ["Passo 4 · Righello", "Ripassa il rettangolo", "Ripassa il contorno A, E, F, D. Il rettangolo aureo è completo.", "Misura base e altezza e dividi: deve venire circa 1,62."],
    ],
  }, (k) => {
    const q = 4; const x0 = -4.4; const y0 = -1.6;
    const A = k.punto("A", [x0, y0]); const B = k.punto("B", [x0 + q, y0]); const C = k.punto("C", [x0 + q, y0 + q]); const D = k.punto("D", [x0, y0 + q]);
    const M = k.punto("M", [x0 + q / 2, y0]);
    const rM = distanza(M, C);
    const E = k.punto("E", [M[0] + rM, y0]); const F = k.punto("F", [M[0] + rM, y0 + q]);
    ["segQ1", "segQ2", "segQ3", "segQ4"].forEach((n, i) => k.seg(n, [A, B, C, D][i], [A, B, C, D][(i + 1) % 4]));
    const a = asse(k, "P", A, B, 2.5, 0.08, 0.68);
    k.traccia("lineAsse", [M[0], a.X1[1] + 0.3], [M[0], a.X2[1] - 0.3], [0.7, 0.96]);
    k.traccia("lineProl", B, [E[0] + 0.8, y0], [0.12, 0.4]);
    k.arco("arcMC", M, rM, -6, direzione(M, C) + 14, [0.42, 0.95]);
    k.traccia("linePerpE", E, [E[0], y0 + q + 0.7], [0.12, 0.5]);
    k.traccia("lineDC", C, [E[0] + 0.7, y0 + q], [0.52, 0.9]);
    const lati = chiudi(k, "L", [A, E, F, D]);
    k.compare("M", 0.97); k.compare("E", 0.5); k.compare("F", 0.92);
    k.passo("A", "B", "C", "D", "segQ1", "segQ2", "segQ3", "segQ4");
    k.passo(...a.nomi, "lineAsse", "M");
    k.passo("lineProl", "arcMC", "E");
    k.passo("linePerpE", "lineDC", "F");
    k.passo(...lati);
    k.risultato(...lati);
  });

  tavola("spirale-aurea", {
    title: "Spirale aurea",
    tema: "Quadrati sempre più piccoli",
    subtitle: "Dentro il rettangolo aureo ritagli un quadrato dopo l’altro: un quarto di circonferenza in ognuno disegna la spirale.",
    coord: [-5.6, 5.6, -3.5, 3.5],
    proofTitle: "Un rettangolo che contiene se stesso",
    proofCopy: "Se da un rettangolo aureo togli un quadrato, il rettangolo che resta è ancora aureo, più piccolo e ruotato di un quarto di giro. Puoi ripetere l’operazione quante volte vuoi. Ogni arco è un quarto di circonferenza con il raggio uguale al lato del suo quadrato e si attacca al successivo senza spigoli. È la curva che ricorda la conchiglia del nautilo, anche se la conchiglia vera si allarga più lentamente.",
    equality: "ogni quadrato è 0,618 volte il precedente",
    steps: [
      ["Prima di iniziare", "Parti dal rettangolo aureo", "Hai un rettangolo aureo (Costruzione 88). Vuoi disegnarci dentro una spirale fatta di quarti di circonferenza.", "Il lato corto del rettangolo è il lato del primo quadrato."],
      ["Passo 1 · Primo quadrato", "Ritaglia un quadrato a sinistra", "Apri il compasso quanto il lato corto del rettangolo e riportalo sui due lati lunghi partendo da sinistra. Unisci i due punti: a sinistra c’è un quadrato, a destra resta un rettangolo più piccolo.", "Anche il rettangolo che resta è aureo."],
      ["Passo 2 · Altri quadrati", "Continua a ritagliare", "Nel rettangolo che resta ritaglia un quadrato in alto. In quello che resta ancora, uno a destra; poi uno in basso; poi di nuovo a sinistra, girando sempre nello stesso verso.", "Ogni quadrato ha il lato uguale al lato corto del rettangolo in cui lo ritagli."],
      ["Passo 3 · Primo arco", "Un quarto di circonferenza", "Nel primo quadrato punta il compasso nel vertice in basso a destra, apri quanto il lato e traccia un quarto di circonferenza dal vertice in basso a sinistra al vertice in alto a destra.", "L’arco unisce due vertici opposti del quadrato."],
      ["Passo 4 · Altri archi", "Continua la curva", "In ogni quadrato successivo traccia un quarto di circonferenza con il raggio uguale al lato, partendo dal punto in cui è arrivato l’arco precedente.", "Il centro è sempre il vertice del quadrato rivolto verso l’interno della spirale."],
    ],
  }, (k) => {
    const phi = (1 + Math.sqrt(5)) / 2;
    const H = 5.6; const W = H * phi;
    let x = -W / 2; let y = -H / 2; let w = W; let h = H;
    k.seg("segR1", [x, y], [x + w, y]); k.seg("segR2", [x + w, y], [x + w, y + h]); k.seg("segR3", [x + w, y + h], [x, y + h]); k.seg("segR4", [x, y + h], [x, y]);
    const tagli = []; const archi = []; const fine = [];
    const wq = finestre(5); const wa = finestre(5);
    for (let i = 0; i < 6; i += 1) {
      const lato = Math.min(w, h);
      let centro; let inizio; let a; let b;
      const verso = i % 4;
      if (verso === 0) { centro = [x + lato, y]; inizio = 90; a = [x + lato, y]; b = [x + lato, y + h]; x += lato; w -= lato; }
      else if (verso === 1) { centro = [x, y + h - lato]; inizio = 0; a = [x, y + h - lato]; b = [x + w, y + h - lato]; h -= lato; }
      else if (verso === 2) { centro = [x + w - lato, y + h]; inizio = 270; a = [x + w - lato, y]; b = [x + w - lato, y + h]; w -= lato; }
      else { centro = [x + w, y + lato]; inizio = 180; a = [x, y + lato]; b = [x + w, y + lato]; y += lato; h -= lato; }
      const nt = `lineQ${i}`; const na = `arcG${i}`; const nf = `spira${i}`;
      k.traccia(nt, a, b, i === 0 ? undefined : wq[i - 1]);
      arcoOrario(k, na, centro, lato, inizio + 90, 90, i === 0 ? undefined : wa[i - 1]);
      k.arcoFisso(nf, centro, lato, inizio, inizio + 90);
      k.compare(nf, 0.97);
      tagli.push(nt); archi.push(na); fine.push(nf);
    }
    k.passo("segR1", "segR2", "segR3", "segR4");
    k.passo(tagli[0]);
    k.passo(...tagli.slice(1));
    k.passo(archi[0]);
    k.passo(...archi.slice(1), ...fine);
    k.risultato(...fine);
  });


  // ══ Ovali, spirali, coniche ═══════════════════════════════════════════════

  /** Divide AB in quattro parti con tre assi: restituisce M, i due punti a un quarto e i nomi degli archetti. */
  function quarti(k, pref, A, B, soloPrimo) {
    const M = medio(A, B); const L = distanza(A, B);
    const w = finestre(soloPrimo ? 2 : 3, 0.08, 0.95);
    const a0 = asse(k, `${pref}M`, A, B, L * 0.56, w[0][0], w[0][1]);
    const a1 = asse(k, `${pref}Q`, A, M, L * 0.3, w[1][0], w[1][1]);
    const nomi = [...a0.nomi, ...a1.nomi];
    if (!soloPrimo) nomi.push(...asse(k, `${pref}D`, M, B, L * 0.3, w[2][0], w[2][1]).nomi);
    return { M, Q1: medio(A, M), Q2: medio(M, B), nomi };
  }

  tavola("ovale-dati-assi", {
    title: "Ovale dati i due assi",
    tema: "Lunghezza e larghezza decise da te",
    subtitle: "Conosci l’asse maggiore e l’asse minore: una costruzione sul segmento che li unisce trova i quattro centri.",
    coord: [-6.6, 6.6, -4, 4],
    proofTitle: "Quattro archi raccordati",
    proofCopy: "Il punto 1 sta sull’asse del segmento AF: dista da A quanto da F. La costruzione fa in modo che il raggio grande, da 2 a C, sia uguale alla distanza tra 2 e 1 più il raggio piccolo, da 1 ad A. Per questo l’arco piccolo e l’arco grande si incontrano sulla retta che passa per i due centri, e lì si raccordano senza spigolo. Lo stesso accade negli altri tre punti di raccordo.",
    equality: "4 centri · 4 punti di raccordo",
    steps: [
      ["Prima di iniziare", "Osserva i due assi", "Hai i due assi dell’ovale, perpendicolari tra loro nel punto medio O: l’asse maggiore AB e l’asse minore CD.", "Con questa costruzione decidi tu sia la lunghezza sia la larghezza dell’ovale."],
      ["Passo 1 · Arco da O", "Trova E", "Prolunga l’asse minore oltre C. Punta in O, apri fino ad A e traccia un arco fino al prolungamento: trovi E.", "CE è la differenza tra metà asse maggiore e metà asse minore."],
      ["Passo 2 · Segmento AC", "Trova F", "Unisci A con C. Punta in C, apri fino a E e traccia un arco che taglia il segmento AC: trovi F.", "CF è lungo quanto CE."],
      ["Passo 3 · Asse di AF", "Trova i centri 1 e 2", "Costruisci l’asse del segmento AF (Costruzione 9) e prolungalo: incontra l’asse maggiore nel punto 1 e la retta dell’asse minore nel punto 2.", "1 e 2 sono i primi due centri."],
      ["Passo 4 · Simmetrici", "Trova i centri 3 e 4", "Punta in O, apri fino a 1 e riporta la distanza dall’altra parte: trovi 3. Punta in O, apri fino a 2 e riporta la distanza dall’altra parte: trovi 4.", "I quattro centri sono simmetrici rispetto a O."],
      ["Passo 5 · Rette dei centri", "Unisci i centri", "Traccia le rette che partono da 2 e passano per 1 e per 3, e quelle che partono da 4 e passano per 1 e per 3. Prolungale oltre 1 e 3.", "Su queste rette cadranno i punti di raccordo."],
      ["Passo 6 · Quattro archi", "Traccia l’ovale", "Punta in 1 e apri fino ad A: traccia l’arco tra le due rette. Ripeti da 3. Poi punta in 2 e apri fino a C: traccia l’arco tra le due rette. Ripeti da 4.", "Gli archi si attaccano senza spigoli."],
    ],
  }, (k) => {
    const a = 3.8; const b = 2.4;
    const O = k.punto("O", [0, 0]);
    const A = k.punto("A", [-a, 0]); k.punto("B", [a, 0]); const C = k.punto("C", [0, b]); k.punto("D", [0, -b]);
    k.punto("E", [0, a]);
    const g = direzione(A, C);
    const F = k.punto("F", polare(C, a - b, g + 180));
    const x1 = -a + distanza(A, F) / 2 / Math.cos(g * RAD);
    const y2 = x1 / Math.tan(g * RAD);
    const N1 = k.punto("N1", [x1, 0], "1"); const N2 = k.punto("N2", [0, y2], "2");
    const N3 = k.punto("N3", [-x1, 0], "3"); const N4 = k.punto("N4", [0, -y2], "4");
    const r1 = x1 + a; const R2 = b - y2;
    const th = direzione(N2, N1);
    k.seg("segAB", [-a, 0], [a, 0]); k.seg("segCD", [0, b], [0, -b]);
    k.traccia("lineProl", C, [0, a + 0.2], [0.12, 0.4]);
    k.arco("arcOE", O, a, 84, 100, [0.42, 0.95]);
    k.traccia("lineAC", A, C, [0.12, 0.45]);
    k.arco("arcCF", C, a - b, 84, g + 104, [0.47, 0.95]);
    const as = asse(k, "F", A, F, 2.1, 0.08, 0.6);
    k.traccia("lineAsseF", sposta(as.X1, th, 0.3), sposta(N2, th + 180, 0.3), [0.62, 0.96]);
    k.archetto("arcO3", O, N3, 16, [0.12, 0.5]); k.archetto("arcO4", O, N4, 12, [0.52, 0.9]);
    const w = finestre(3, 0.32, 0.94);
    k.traccia("lineC23", N2, sposta(N3, 180 - th, r1 + 0.5), w[0]);
    k.traccia("lineC41", N4, sposta(N1, -th, r1 + 0.5), w[1]);
    k.traccia("lineC43", N4, sposta(N3, th - 180, r1 + 0.5), w[2]);
    k.traccia("lineC21", N1, sposta(N1, th, r1 + 0.5), [0.12, 0.3]);
    const wa = finestre(4);
    k.arco("arcG1", N1, r1, th, 360 - 2 * th, wa[0]);
    k.arco("arcG3", N3, r1, th - 180, 360 - 2 * th, wa[1]);
    k.arco("arcG2", N2, R2, 180 - th, 2 * th - 180, wa[2]);
    k.arco("arcG4", N4, R2, 360 - th, 2 * th - 180, wa[3]);
    k.arcoFisso("ovale1", N1, r1, th, 360 - th); k.arcoFisso("ovale3", N3, r1, th - 180, 180 - th);
    k.arcoFisso("ovale2", N2, R2, 180 - th, th); k.arcoFisso("ovale4", N4, R2, 360 - th, 180 + th);
    const fine = ["ovale1", "ovale2", "ovale3", "ovale4"]; fine.forEach((n) => k.compare(n, 0.97));
    k.compare("E", 0.95); k.compare("F", 0.95); k.compare("N1", 0.9); k.compare("N2", 0.96); k.compare("N3", 0.5); k.compare("N4", 0.9);
    k.passo("O", "A", "B", "C", "D", "segAB", "segCD");
    k.passo("lineProl", "arcOE", "E");
    k.passo("lineAC", "arcCF", "F");
    k.passo(...as.nomi, "lineAsseF", "N1", "N2");
    k.passo("arcO3", "arcO4", "N3", "N4");
    k.passo("lineC21", "lineC23", "lineC41", "lineC43");
    k.passo("arcG1", "arcG3", "arcG2", "arcG4", ...fine);
    k.risultato(...fine);
  });

  /** Spirale policentrica sui vertici di un poligono regolare di n lati. */
  function spiralePoligono(slug, n, archi, lato, testi) {
    tavola(slug, {
      title: testi.titolo,
      tema: testi.tema,
      subtitle: testi.sottotitolo,
      coord: [-6.2, 6.2, -3.9, 3.9],
      proofTitle: "Il raggio cresce di un lato alla volta",
      proofCopy: testi.perche,
      equality: testi.formula,
      steps: [
        ["Prima di iniziare", `Osserva ${testi.ilPoligono}`, `Hai un piccolo ${testi.poligono}: i suoi vertici saranno i ${n} centri della spirale. Il passo, cioè la distanza tra un giro e il successivo, è ${testi.volte} volte il lato.`, testi.consiglio],
        ["Passo 1 · Prolunga i lati", "Traccia le semirette", `Prolunga ogni lato ${testi.delPoligono} oltre un vertice, girando sempre nello stesso verso: ottieni ${n} semirette.`, "Ogni arco comincerà su una semiretta e finirà sulla successiva."],
        ["Passo 2 · Primo arco", "Punta in A", `Punta in A, apri quanto il lato e traccia un arco che parte dal vertice ${testi.ultimo} e arriva sulla semiretta che parte da A.`, "Il raggio è lungo un lato."],
        ["Passo 3 · Secondo arco", "Punta in B", "Punta in B, apri fino al punto in cui è arrivato il primo arco e traccia il secondo arco, fino alla semiretta successiva.", "Il raggio ora è lungo due lati."],
        ["Passo 4 · Continua", "Cambia centro a ogni arco", "Continua così: punta nel vertice successivo, apri fino al punto d’arrivo dell’arco precedente e traccia fino alla semiretta successiva.", "A ogni cambio di centro il raggio aumenta di un lato."],
      ],
    }, (k) => {
      const Rc = lato / (2 * Math.sin(Math.PI / n));
      let V = []; for (let i = 0; i < n; i += 1) V.push(polare([0, 0], Rc, 90 + (360 / n) * i));
      const dati = (centri) => { const out = []; for (let i = 0; i < archi; i += 1) { const c = centri[i % n]; const prima = centri[(i - 1 + n * archi) % n]; out.push({ c, r: (i + 1) * lato, inizio: direzione(c, prima) }); } return out; };
      let xs = []; let ys = [];
      dati(V).forEach((d) => { for (let q = 0; q <= 12; q += 1) { const p = polare(d.c, d.r, d.inizio + (360 / n) * (q / 12)); xs.push(p[0]); ys.push(p[1]); } });
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2; const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
      V = V.map((p) => [p[0] - cx, p[1] - cy]);
      const lettere = "ABCDEF";
      V.forEach((p, i) => k.punto(lettere[i], p));
      const lati = V.map((p, i) => { k.seg(`segP${lettere[i]}`, p, V[(i + 1) % n]); return `segP${lettere[i]}`; });
      const D = dati(V);
      const wr = finestre(n);
      const raggi = V.map((p, i) => {
        let massimo = 0; D.forEach((d, j) => { if (j % n === i) massimo = d.r; });
        const nome = `ray${lettere[i]}`;
        k.traccia(nome, p, polare(p, massimo + 0.35, direzione(V[(i + 1) % n], p)), wr[i]);
        return nome;
      });
      const wa = finestre(archi - 2);
      const nomi = []; const fine = [];
      D.forEach((d, i) => {
        k.arco(`arcG${i}`, d.c, d.r, d.inizio, 360 / n, i < 2 ? undefined : wa[i - 2]);
        k.arcoFisso(`spira${i}`, d.c, d.r, d.inizio, d.inizio + 360 / n);
        k.compare(`spira${i}`, 0.97);
        nomi.push(`arcG${i}`); fine.push(`spira${i}`);
      });
      k.passo(...lettere.slice(0, n).split(""), ...lati);
      k.passo(...raggi);
      k.passo(nomi[0]);
      k.passo(nomi[1]);
      k.passo(...nomi.slice(2), ...fine);
      k.risultato(...fine);
    });
  }

  spiralePoligono("spirale-tre-centri", 3, 6, 0.5, {
    titolo: "Spirale a tre centri", tema: "Un triangolo equilatero al centro",
    sottotitolo: "I vertici di un piccolo triangolo equilatero fanno da centri a turno: ogni arco è un terzo di giro.",
    poligono: "triangolo equilatero ABC", ilPoligono: "il triangolo", delPoligono: "del triangolo", ultimo: "C", volte: "tre",
    consiglio: "Per un passo di 1,5 cm disegna un triangolo di lato 0,5 cm.",
    perche: "Ogni arco è un terzo di circonferenza: parte dal prolungamento di un lato e finisce sul prolungamento del lato successivo. Lì cambia il centro, ma il vecchio centro, il nuovo centro e il punto di contatto sono allineati: la curva non fa spigoli. Dopo tre archi, cioè un giro completo, il raggio è aumentato di tre lati: è il passo.",
    formula: "passo = 3 × lato",
  });
  spiralePoligono("spirale-sei-centri", 6, 9, 0.36, {
    titolo: "Spirale a sei centri", tema: "Un esagono regolare al centro",
    sottotitolo: "Con sei centri gli archi sono più corti e la spirale diventa più morbida e regolare.",
    poligono: "esagono regolare ABCDEF", ilPoligono: "l’esagono", delPoligono: "dell’esagono", ultimo: "F", volte: "sei",
    consiglio: "Più centri usi, più la curva assomiglia a una spirale «vera».",
    perche: "Ogni arco è un sesto di circonferenza: parte dal prolungamento di un lato e finisce sul prolungamento del lato successivo. Lì cambia il centro, ma il vecchio centro, il nuovo centro e il punto di contatto sono allineati: la curva non fa spigoli. Dopo sei archi, cioè un giro completo, il raggio è aumentato di sei lati: è il passo.",
    formula: "passo = 6 × lato",
  });

  tavola("ellisse-fuochi", {
    title: "Ellisse per punti con i fuochi",
    tema: "La somma delle distanze non cambia",
    subtitle: "Trovi i due fuochi e poi, con due aperture di compasso che insieme fanno sempre l’asse maggiore, segni i punti della curva.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Somma costante",
    proofCopy: "Ogni punto che trovi dista da un fuoco quanto il segmento A1 e dall’altro quanto il segmento B1. Insieme i due segmenti formano l’asse maggiore AB. Per ogni punto della curva, quindi, la somma delle distanze dai due fuochi è sempre uguale ad AB: è proprio la definizione di ellisse. È anche il principio del «metodo del giardiniere», con due picchetti e una corda.",
    equality: "distanza da F₁ + distanza da F₂ = AB",
    steps: [
      ["Prima di iniziare", "Osserva i due assi", "Hai i due assi dell’ellisse, perpendicolari tra loro nel punto medio O: l’asse maggiore AB e l’asse minore CD.", "A, B, C e D sono già quattro punti dell’ellisse."],
      ["Passo 1 · Fuochi", "Trova F₁ e F₂", "Apri il compasso quanto OA, metà dell’asse maggiore. Punta in C e taglia l’asse maggiore in due punti: sono i fuochi F₁ e F₂.", "I fuochi sono simmetrici rispetto a O."],
      ["Passo 2 · Punti sull’asse", "Segna 1, 2 e 3", "Tra F₁ e O segna tre punti a piacere: 1, 2 e 3.", "Più punti segni, più precisa sarà la curva."],
      ["Passo 3 · Punto 1", "Trova quattro punti dell’ellisse", "Apri quanto A1, punta in F₁ e traccia un archetto sopra e uno sotto. Apri quanto B1, punta in F₂ e incrocia gli archetti: trovi due punti. Poi scambia i fuochi: apertura A1 da F₂ e apertura B1 da F₁. Trovi altri due punti.", "Ogni punto dell’asse ti dà quattro punti dell’ellisse."],
      ["Passo 4 · Punti 2 e 3", "Ripeti", "Ripeti con il punto 2 (aperture A2 e B2) e con il punto 3 (aperture A3 e B3).", "In tutto hai dodici punti, più A, B, C e D."],
      ["Passo 5 · Curva", "Unisci i punti", "Unisci tutti i punti a mano libera o con il curvilineo, con una linea continua e senza spigoli.", "Ruota il foglio mentre disegni: la mano lavora meglio."],
    ],
  }, (k, t) => {
    const a = 4.2; const b = 2.6; const c = Math.sqrt(a * a - b * b);
    k.punto("O", [0, 0]); k.punto("A", [-a, 0]); k.punto("B", [a, 0]); const C = k.punto("C", [0, b]); k.punto("D", [0, -b]);
    const F1 = k.punto("F1", [-c, 0], "F₁"); const F2 = k.punto("F2", [c, 0], "F₂");
    k.seg("segAB", [-a, 0], [a, 0]); k.seg("segCD", [0, b], [0, -b]);
    k.arco("arcCF", C, a, 205, 130);
    const frazioni = [0.8, 0.5, 0.16];
    const gruppi = [];
    frazioni.forEach((f, i) => {
      const xn = -c * f;
      k.punto(`N${i + 1}`, [xn, 0], String(i + 1));
      const ra = xn + a;
      const X = (a * xn) / c; const Y = Math.sqrt(ra * ra - (X + c) ** 2);
      const quattro = [[X, Y, F1, F2], [X, -Y, F1, F2], [-X, Y, F2, F1], [-X, -Y, F2, F1]];
      const w = finestre(8);
      const nomi = [];
      quattro.forEach((q, j) => {
        const P = [q[0], q[1]];
        k.archetto(`arcE${i}a${j}`, q[2], P, ra < 1.2 ? 22 : 12, w[j < 2 ? j : j + 2]);
        k.archetto(`arcE${i}b${j}`, q[3], P, 7, w[j < 2 ? j + 2 : j + 4]);
        puntoMuto(t, `E${i}p${j}`, P); k.compare(`E${i}p${j}`, j < 2 ? w[3][1] : w[7][1]);
        nomi.push(`arcE${i}a${j}`, `arcE${i}b${j}`, `E${i}p${j}`);
      });
      gruppi.push(nomi);
    });
    comando(t, "ellisse", `Ellipse((${num(-c)},0),(${num(c)},0),${num(a)})`);
    k.compare("F1", 0.5); k.compare("F2", 0.9);
    k.passo("O", "A", "B", "C", "D", "segAB", "segCD");
    k.passo("arcCF", "F1", "F2");
    k.passo("N1", "N2", "N3");
    k.passo(...gruppi[0]);
    k.passo(...gruppi[1], ...gruppi[2]);
    k.passo("ellisse");
    k.risultato("ellisse");
  });

  tavola("iperbole-fuochi", {
    title: "Iperbole per punti con i fuochi",
    tema: "La differenza delle distanze non cambia",
    subtitle: "Due fuochi e due vertici: con due aperture di compasso che differiscono sempre della stessa lunghezza segni i punti dei due rami.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Differenza costante",
    proofCopy: "Ogni punto che trovi dista da un fuoco quanto il segmento A1 e dall’altro quanto il segmento B1. La differenza tra i due segmenti è sempre AB, la distanza tra i vertici. Per ogni punto della curva, quindi, la differenza delle distanze dai due fuochi è costante: è la definizione di iperbole. La curva ha due rami separati, che si allargano senza mai chiudersi.",
    equality: "differenza delle distanze dai due fuochi = AB",
    steps: [
      ["Prima di iniziare", "Osserva la retta", "Su una retta sono segnati due punti fissi, i fuochi F₁ e F₂. Tra loro ci sono i vertici A e B, i due punti in cui la curva attraversa la retta: sono simmetrici rispetto al punto medio O.", "A e B sono già due punti dell’iperbole."],
      ["Passo 1 · Punti sull’asse", "Segna 1, 2 e 3", "Sulla retta, oltre F₂, segna tre punti a piacere: 1, 2 e 3.", "Più punti segni, più precisa sarà la curva."],
      ["Passo 2 · Punto 1, ramo destro", "Trova due punti", "Apri quanto A1, punta in F₁ e traccia un archetto sopra e uno sotto la retta, dalla parte di F₂. Apri quanto B1, punta in F₂ e incrocia gli archetti: trovi due punti.", "L’apertura più grande parte dal fuoco più lontano."],
      ["Passo 3 · Punto 1, ramo sinistro", "Scambia i fuochi", "Ora usa l’apertura A1 da F₂ e l’apertura B1 da F₁: trovi altri due punti, dall’altra parte.", "I due rami sono simmetrici."],
      ["Passo 4 · Punti 2 e 3", "Ripeti", "Ripeti con il punto 2 (aperture A2 e B2) e con il punto 3 (aperture A3 e B3).", "Ogni punto dell’asse ti dà quattro punti dell’iperbole."],
      ["Passo 5 · Curva", "Unisci i punti", "Unisci i punti di destra, passando per B, con una linea continua. Fai lo stesso a sinistra, passando per A.", "I due rami non si toccano mai."],
    ],
  }, (k, t) => {
    const a = 1.3; const c = 2.2;
    k.punto("O", [0, 0]); k.punto("A", [-a, 0]); k.punto("B", [a, 0]);
    const F1 = k.punto("F1", [-c, 0], "F₁"); const F2 = k.punto("F2", [c, 0], "F₂");
    k.seg("lineX", [-5.9, 0], [5.9, 0]);
    const gruppi = [];
    [2.8, 3.5, 4.2].forEach((xn, i) => {
      k.punto(`N${i + 1}`, [xn, 0], String(i + 1));
      const rb = xn - a;
      const X = (a * xn) / c; const Y = Math.sqrt(rb * rb - (X - c) ** 2);
      const quattro = [[X, Y, F1, F2], [X, -Y, F1, F2], [-X, Y, F2, F1], [-X, -Y, F2, F1]];
      const w = finestre(4);
      const destra = []; const sinistra = [];
      quattro.forEach((q, j) => {
        const P = [q[0], q[1]]; const lista = j < 2 ? destra : sinistra; const jj = j % 2;
        k.archetto(`arcI${i}a${j}`, q[2], P, 6, w[jj]);
        k.archetto(`arcI${i}b${j}`, q[3], P, 12, w[jj + 2]);
        puntoMuto(t, `I${i}p${j}`, P); k.compare(`I${i}p${j}`, w[3][1]);
        lista.push(`arcI${i}a${j}`, `arcI${i}b${j}`, `I${i}p${j}`);
      });
      gruppi.push([destra, sinistra]);
    });
    comando(t, "iperbole", `Hyperbola((${num(-c)},0),(${num(c)},0),${num(a)})`);
    k.passo("O", "A", "B", "F1", "F2", "lineX");
    k.passo("N1", "N2", "N3");
    k.passo(...gruppi[0][0]);
    k.passo(...gruppi[0][1]);
    k.passo(...gruppi[1][0], ...gruppi[1][1], ...gruppi[2][0], ...gruppi[2][1]);
    k.passo("iperbole");
    k.risultato("iperbole");
  });

  // ══ Archi ═════════════════════════════════════════════════════════════════

  tavola("arco-ribassato", {
    title: "Arco ribassato a un centro",
    tema: "Un solo arco, con il centro sotto l’imposta",
    subtitle: "Conosci la luce e la freccia: l’arco è un pezzo di circonferenza che passa per tre punti.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Una circonferenza per tre punti",
    proofCopy: "Il centro O sta sull’asse di AB, quindi dista ugualmente da A e da B. Sta anche sull’asse di AC, quindi dista ugualmente da A e da C. O è alla stessa distanza da A, da B e da C: la circonferenza con centro O passa per tutti e tre (Costruzione 55). Negli estremi A e B l’arco forma uno spigolo con i piedritti, cioè i sostegni verticali. Si chiama anche arco scemo, cioè «diminuito», perché è meno di una semicirconferenza.",
    equality: "OA = OB = OC",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Il segmento AB è la luce dell’arco, cioè la larghezza dell’apertura, lunga 6,4 cm. La freccia, cioè l’altezza dell’arco, deve essere di 1,6 cm: meno della metà della luce.", "Un arco così basso si chiama ribassato."],
      ["Passo 1 · Asse di AB", "Trova M", "Costruisci l’asse della luce AB (Costruzione 9): trovi il punto medio M e la retta perpendicolare.", "Il centro dell’arco starà su questa retta."],
      ["Passo 2 · Freccia", "Segna C", "Apri il compasso a 1,6 cm. Punta in M e taglia l’asse sopra la luce: trovi C, il punto più alto dell’arco.", "MC è la freccia."],
      ["Passo 3 · Asse di AC", "Trova il centro O", "Unisci A con C e costruisci l’asse del segmento AC. Prolungalo fino a incontrare l’asse di AB, sotto la luce: trovi O.", "O è il centro dell’arco."],
      ["Passo 4 · Arco", "Punta in O", "Punta in O, apri fino ad A e traccia l’arco fino a B: passa per C.", "Controlla: l’arco deve toccare esattamente A, C e B."],
    ],
  }, (k) => {
    const y0 = 0.3; const L = 6.4; const f = 1.6;
    const A = k.punto("A", [-L / 2, y0]); const B = k.punto("B", [L / 2, y0]); const M = k.punto("M", [0, y0]);
    const C = k.punto("C", [0, y0 + f]);
    const R = ((L * L) / 4 + f * f) / (2 * f);
    const O = k.punto("O", [0, y0 + f - R]);
    k.seg("lineBase", [-5.6, y0], [5.6, y0]); k.seg("segAB", A, B);
    k.seg("segDatA", [-5.6, 3.3], [-4, 3.3], "freccia 1,6 cm");
    const a = asse(k, "P", A, B, 4.2, 0.08, 0.68);
    k.traccia("lineAsse", [0, y0 + 3.2], [0, y0 - 3.3], [0.7, 0.96]);
    k.archetto("arcMC", M, C, 20);
    k.traccia("lineAC", A, C, [0.1, 0.3]);
    const a2 = asse(k, "Q", A, C, 2.3, 0.3, 0.7);
    const gq = direzione(a2.X1, a2.X2);
    k.traccia("lineAsseQ", sposta(a2.X1, gq + 180, 0.3), sposta(O, gq, 0.4), [0.72, 0.96]);
    const gA = direzione(O, A); const gB = direzione(O, B);
    arcoOrario(k, "arcG", O, R, gA, gA - gB);
    k.arcoFisso("profilo", O, R, gB, gA);
    k.compare("M", 0.97); k.compare("C", 0.8); k.compare("O", 0.96); k.compare("profilo", 0.97);
    k.passo("A", "B", "segAB", "lineBase", "segDatA");
    k.passo(...a.nomi, "lineAsse", "M");
    k.passo("arcMC", "C");
    k.passo("lineAC", ...a2.nomi, "lineAsseQ", "O");
    k.passo("arcG", "profilo");
    k.risultato("profilo");
  });

  tavola("arco-rampante", {
    title: "Arco rampante",
    tema: "Due imposte a quote diverse",
    subtitle: "Quando i due appoggi non sono alla stessa altezza, due quarti di circonferenza con raggi diversi salgono dall’uno all’altro.",
    coord: [-6, 6, -4.3, 3.1],
    proofTitle: "Somma e differenza dei raggi",
    proofCopy: "Il raggio grande è la metà di AG, cioè la metà della somma tra distanza orizzontale e dislivello. Il raggio piccolo è quello che manca per arrivare alla verticale di B. I due centri O₁ e O₂ sono sulla stessa retta verticale e il punto T sta sopra entrambi: lì i due archi hanno la stessa tangente orizzontale e si raccordano senza spigolo. In A e in B l’arco parte in verticale, in continuità con i pilastri.",
    equality: "r₁ + r₂ = AE · r₁ − r₂ = EB",
    steps: [
      ["Prima di iniziare", "Osserva le due imposte", "L’arco deve partire dal punto A, in basso a sinistra, e arrivare al punto B, più in alto a destra. È l’arco che sostiene le scale e le rampe.", "Si chiama anche arco zoppo."],
      ["Passo 1 · Squadra", "Trova E", "Traccia la retta orizzontale che passa per A e la retta verticale che passa per B: si incontrano in E.", "AE è la distanza orizzontale, EB il dislivello."],
      ["Passo 2 · Riporta il dislivello", "Trova G", "Punta in E, apri fino a B e taglia la retta orizzontale oltre E: trovi G.", "EG è lungo quanto il dislivello."],
      ["Passo 3 · Asse di AG", "Trova il centro O₁", "Costruisci l’asse del segmento AG (Costruzione 9): incontra AG nel punto medio O₁. Tieni la retta perpendicolare.", "O₁ è il centro dell’arco più grande."],
      ["Passo 4 · Orizzontale per B", "Trova il centro O₂", "Traccia la retta orizzontale che passa per B: incontra la perpendicolare nel punto O₂.", "O₂ è il centro dell’arco più piccolo."],
      ["Passo 5 · Due archi", "Traccia l’arco rampante", "Punta in O₁, apri fino ad A e traccia un quarto di circonferenza fino alla perpendicolare: arrivi in T. Punta in O₂, apri fino a T e traccia un quarto di circonferenza fino a B.", "In T i due archi si attaccano senza spigolo."],
    ],
  }, (k) => {
    const Dd = 6; const h = 2; const yA = -1.6;
    const A = k.punto("A", [-3.4, yA]); const E = k.punto("E", [-3.4 + Dd, yA]); const B = k.punto("B", [-3.4 + Dd, yA + h]);
    const G = k.punto("G", [E[0] + h, yA]);
    const r1 = (Dd + h) / 2; const r2 = (Dd - h) / 2;
    const O1 = k.punto("O1", [A[0] + r1, yA], "O₁"); const O2 = k.punto("O2", [A[0] + r1, yA + h], "O₂");
    const T = k.punto("T", [O1[0], yA + r1]);
    k.seg("segPilA", [A[0], yA], [A[0], yA - 2.4]); k.seg("segPilB", [B[0], B[1]], [B[0], yA - 2.4]);
    k.traccia("lineOr", A, [G[0] + 0.6, yA], [0.12, 0.5]);
    k.traccia("lineVer", B, [E[0], yA - 0.5], [0.52, 0.9]);
    k.arco("arcEG", E, h, -6, 102);
    const a = asse(k, "P", A, G, 4.7, 0.08, 0.68);
    k.traccia("lineAsse", [O1[0], T[1] + 0.5], [O1[0], a.X2[1] - 0.25], [0.7, 0.96]);
    k.traccia("lineOrB", B, [O2[0] - 0.7, B[1]]);
    arcoOrario(k, "arcG1", O1, r1, 180, 90, [0.12, 0.52]);
    arcoOrario(k, "arcG2", O2, r2, 90, 90, [0.54, 0.94]);
    k.arcoFisso("profilo1", O1, r1, 90, 180); k.arcoFisso("profilo2", O2, r2, 0, 90);
    k.compare("E", 0.9); k.compare("G", 0.9); k.compare("O1", 0.97); k.compare("O2", 0.9); k.compare("T", 0.5);
    k.compare("profilo1", 0.96); k.compare("profilo2", 0.97);
    k.passo("A", "B", "segPilA", "segPilB");
    k.passo("lineOr", "lineVer", "E");
    k.passo("arcEG", "G");
    k.passo(...a.nomi, "lineAsse", "O1");
    k.passo("lineOrB", "O2");
    k.passo("arcG1", "arcG2", "T", "profilo1", "profilo2");
    k.risultato("profilo1", "profilo2");
  });

  tavola("arco-ferro-di-cavallo", {
    title: "Arco a ferro di cavallo",
    tema: "Più di mezza circonferenza",
    subtitle: "Il centro sta sopra la linea d’imposta, cioè la linea da cui parte l’arco: l’arco si allarga oltre la luce e poi rientra, come un ferro di cavallo.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Un centro rialzato",
    proofCopy: "Nell’arco a tutto sesto il centro è il punto medio della luce. Qui il centro O è più in alto, sull’asse della luce: dista ugualmente da A e da B, ma l’arco che li unisce passando da sopra è più lungo di una semicirconferenza. Nel punto più largo l’arco supera la luce: è la forma tipica dell’architettura araba e moresca. In questa tavola il centro è rialzato di un quarto della luce, ma la misura può cambiare.",
    equality: "OA = OB · O sopra l’imposta",
    steps: [
      ["Prima di iniziare", "Osserva la luce AB", "Il segmento AB è la luce dell’arco, cioè la larghezza dell’apertura. Vuoi costruire un arco a ferro di cavallo, che si chiama anche arco oltrepassato o moresco.", "Lo trovi, per esempio, nella moschea di Cordova."],
      ["Passo 1 · Asse di AB", "Trova M", "Costruisci l’asse della luce AB (Costruzione 9): trovi il punto medio M e la retta perpendicolare.", "Il centro starà su questa retta, sopra M."],
      ["Passo 2 · Un quarto della luce", "Trova N", "Trova il punto medio del segmento MB: è il punto N. La distanza MN è un quarto della luce.", "Costruisci l’asse di MB con due coppie di archetti."],
      ["Passo 3 · Centro", "Trova O", "Punta in M, apri fino a N e taglia l’asse sopra la luce: trovi il centro O.", "Più alzi il centro, più l’arco si «chiude»."],
      ["Passo 4 · Arco", "Punta in O", "Punta in O, apri fino ad A e traccia l’arco che passa sopra e arriva in B.", "È più di mezza circonferenza."],
    ],
  }, (k) => {
    const y0 = -1.6; const L = 4.8;
    const A = k.punto("A", [-L / 2, y0]); const B = k.punto("B", [L / 2, y0]); const M = k.punto("M", [0, y0]);
    const N = k.punto("N", [L / 4, y0]); const O = k.punto("O", [0, y0 + L / 4]);
    const R = distanza(O, A);
    k.seg("lineBase", [-5.6, y0], [5.6, y0]); k.seg("segAB", A, B);
    const a = asse(k, "P", A, B, 2.8, 0.08, 0.68);
    k.traccia("lineAsse", [0, y0 + L / 4 + R + 0.4], [0, y0 - 1.75], [0.7, 0.96]);
    const a2 = asse(k, "Q", M, B, 1.5, 0.1, 0.9);
    k.arco("arcMO", M, L / 4, -6, 102);
    const gB = direzione(O, B); const gA = direzione(O, A);
    arcoOrario(k, "arcG", O, R, gA, modulo360(gA - gB));
    k.arcoFisso("profilo", O, R, gB, gA);
    k.compare("M", 0.97); k.compare("N", 0.92); k.compare("O", 0.9); k.compare("profilo", 0.97);
    k.passo("A", "B", "segAB", "lineBase");
    k.passo(...a.nomi, "lineAsse", "M");
    k.passo(...a2.nomi, "N");
    k.passo("arcMO", "O");
    k.passo("arcG", "profilo");
    k.risultato("profilo");
  });

  tavola("arco-tudor", {
    title: "Arco Tudor a quattro centri",
    tema: "L’arco dell’Inghilterra dei Tudor",
    subtitle: "Due archi piccoli ai lati e due archi grandi che si incontrano in una punta bassa.",
    coord: [-6, 6, -3.6, 3.8],
    proofTitle: "Quattro archi e una punta",
    proofCopy: "Il punto di raccordo P sta sulla retta che passa per i centri 4 e 1: lì l’arco piccolo, con centro 1, e l’arco grande, con centro 4, hanno la stessa direzione e si attaccano senza spigolo. Lo stesso accade a destra. I due archi grandi hanno lo stesso raggio e centri simmetrici: si incontrano sull’asse della luce, nel punto C, formando una punta poco pronunciata. Questa è una delle costruzioni possibili: gli archi Tudor veri sono spesso più schiacciati.",
    equality: "4 centri · 2 raccordi · 1 punta",
    steps: [
      ["Prima di iniziare", "Osserva la luce AB", "Il segmento AB è la luce dell’arco, cioè la larghezza dell’apertura. Vuoi costruire un arco Tudor: largo, basso e con una punta appena accennata.", "È tipico dell’architettura inglese tra Quattrocento e Cinquecento."],
      ["Passo 1 · Quattro parti", "Trova 1, M e 2", "Dividi la luce in quattro parti uguali: costruisci l’asse di AB e trovi M; poi l’asse di AM e l’asse di MB e trovi i punti 1 e 2.", "1 e 2 sono i centri dei due archi piccoli."],
      ["Passo 2 · Quadrato", "Trova 3 e 4", "Sotto il segmento che va da 1 a 2 costruisci un quadrato (Costruzione 7): i due vertici in basso sono il punto 3, sotto 1, e il punto 4, sotto 2.", "3 e 4 sono i centri dei due archi grandi."],
      ["Passo 3 · Rette dei centri", "Unisci in diagonale", "Traccia la retta che parte da 4 e passa per 1 e quella che parte da 3 e passa per 2. Prolungale verso l’alto.", "Su queste rette cadranno i punti di raccordo."],
      ["Passo 4 · Archi piccoli", "Punta in 1 e in 2", "Punta in 1, apri fino ad A e traccia l’arco fino alla retta: arrivi in P. Punta in 2, apri fino a B e traccia l’arco fino all’altra retta: arrivi in Q.", "I due archi hanno lo stesso raggio: un quarto della luce."],
      ["Passo 5 · Archi grandi", "Punta in 4 e in 3", "Punta in 4, apri fino a P e traccia l’arco verso l’alto. Punta in 3, apri fino a Q e traccia l’altro arco: si incontrano in C, sull’asse.", "C è la punta dell’arco, la chiave."],
    ],
  }, (k) => {
    const y0 = 0.4; const L = 6; const r = L / 4;
    const A = k.punto("A", [-L / 2, y0]); const B = k.punto("B", [L / 2, y0]);
    const q = quarti(k, "Z", A, B);
    k.punto("M", q.M);
    const N1 = k.punto("N1", q.Q1, "1"); const N2 = k.punto("N2", q.Q2, "2");
    const N3 = k.punto("N3", [N1[0], y0 - 2 * r], "3"); const N4 = k.punto("N4", [N2[0], y0 - 2 * r], "4");
    const P = k.punto("P", polare(N1, r, 135)); const Q = k.punto("Q", polare(N2, r, 45));
    const Rg = distanza(N4, P);
    const C = k.punto("C", [0, N4[1] + Math.sqrt(Rg * Rg - r * r)]);
    const gC = direzione(N4, C);
    k.seg("lineBase", [-5.6, y0], [5.6, y0]); k.seg("segAB", A, B);
    k.traccia("lineQa", N1, N3, [0.1, 0.3]); k.traccia("lineQb", N2, N4, [0.3, 0.5]);
    k.archetto("arcQ3", N1, N3, 12, [0.5, 0.65]); k.archetto("arcQ4", N2, N4, 12, [0.65, 0.8]);
    k.traccia("lineQc", N3, N4, [0.8, 0.96]);
    k.traccia("lineC41", N4, polare(N1, r + 0.6, 135), [0.12, 0.5]); k.traccia("lineC32", N3, polare(N2, r + 0.6, 45), [0.52, 0.9]);
    arcoOrario(k, "arcG1", N1, r, 180, 45, [0.12, 0.5]); k.arco("arcG2", N2, r, 0, 45, [0.52, 0.9]);
    arcoOrario(k, "arcG4", N4, Rg, 135, 135 - gC + 5, [0.12, 0.5]); k.arco("arcG3", N3, Rg, 45, 135 - gC + 5, [0.52, 0.9]);
    k.arcoFisso("profilo1", N1, r, 135, 180); k.arcoFisso("profilo2", N2, r, 0, 45);
    k.arcoFisso("profilo4", N4, Rg, gC, 135); k.arcoFisso("profilo3", N3, Rg, 45, 180 - gC);
    const fine = ["profilo1", "profilo2", "profilo3", "profilo4"]; fine.forEach((n) => k.compare(n, 0.97));
    k.compare("M", 0.4); k.compare("N1", 0.7); k.compare("N2", 0.95); k.compare("N3", 0.65); k.compare("N4", 0.8);
    k.compare("P", 0.5); k.compare("Q", 0.9); k.compare("C", 0.9);
    k.passo("A", "B", "segAB", "lineBase");
    k.passo(...q.nomi, "M", "N1", "N2");
    k.passo("lineQa", "lineQb", "arcQ3", "arcQ4", "lineQc", "N3", "N4");
    k.passo("lineC41", "lineC32");
    k.passo("arcG1", "arcG2", "P", "Q");
    k.passo("arcG4", "arcG3", "C", ...fine);
    k.risultato(...fine);
  });

  tavola("arco-inflesso", {
    title: "Arco inflesso",
    tema: "Una curva che cambia verso",
    subtitle: "Ogni metà dell’arco è fatta di due archi: quello in basso curva verso l’esterno, quello in alto verso l’interno, fino alla punta.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Dove la curva cambia verso",
    proofCopy: "Il punto P sta sulla retta che unisce i centri 1 e 3: lì l’arco basso e l’arco alto hanno la stessa tangente, ma curvano da parti opposte. Un punto così si chiama punto di flesso. Il centro 3 dista da 1 quanto la somma dei due raggi: per questo le due circonferenze si toccano in un solo punto. Questa è una delle costruzioni possibili: cambiando i centri l’arco diventa più alto o più schiacciato. Per la sua forma si chiama anche arco a carena.",
    equality: "distanza tra 1 e 3 = raggio piccolo + raggio grande",
    steps: [
      ["Prima di iniziare", "Osserva la luce AB", "Il segmento AB è la luce dell’arco, cioè la larghezza dell’apertura. Vuoi costruire un arco inflesso, con il profilo a forma di fiamma: è tipico dell’architettura veneziana e orientale.", "Inflesso vuol dire «piegato in due versi»."],
      ["Passo 1 · Quattro parti", "Trova 1, M e 2", "Dividi la luce in quattro parti uguali: costruisci l’asse di AB e trovi M; poi l’asse di AM e l’asse di MB e trovi i punti 1 e 2.", "1 e 2 sono i centri dei due archi bassi."],
      ["Passo 2 · Perpendicolari", "Alza due perpendicolari", "Alza la perpendicolare alla luce nell’estremo A e nell’estremo B (Costruzione 10, oppure con le squadre).", "Su queste rette cadranno i centri degli archi alti."],
      ["Passo 3 · Centri alti", "Trova 3 e 4", "Punta in 1, apri fino a B e taglia la perpendicolare alzata da A: trovi 3. Punta in 2, apri fino ad A e taglia la perpendicolare alzata da B: trovi 4.", "L’apertura è tre quarti della luce."],
      ["Passo 4 · Rette dei centri", "Unisci 1 con 3 e 2 con 4", "Con il righello unisci 1 con 3 e 2 con 4.", "Su queste rette cadranno i punti di flesso."],
      ["Passo 5 · Archi bassi", "Punta in 1 e in 2", "Punta in 1, apri fino ad A e traccia l’arco fino alla retta: arrivi in P. Punta in 2, apri fino a B e traccia l’arco fino all’altra retta: arrivi in Q.", "Questi archi curvano verso l’esterno."],
      ["Passo 6 · Archi alti", "Punta in 3 e in 4", "Punta in 3, apri fino a P e traccia l’arco verso l’interno. Punta in 4, apri fino a Q e traccia l’altro arco: si incontrano in C, sull’asse.", "C è la punta dell’arco."],
    ],
  }, (k) => {
    const y0 = -1.9; const L = 6; const r = L / 4; const h = L / Math.SQRT2;
    const A = k.punto("A", [-L / 2, y0]); const B = k.punto("B", [L / 2, y0]);
    const q = quarti(k, "Z", A, B);
    k.punto("M", q.M);
    const N1 = k.punto("N1", q.Q1, "1"); const N2 = k.punto("N2", q.Q2, "2");
    const N3 = k.punto("N3", [-L / 2, y0 + h], "3"); const N4 = k.punto("N4", [L / 2, y0 + h], "4");
    const g13 = direzione(N1, N3);
    const P = k.punto("P", polare(N1, r, g13)); const Q = k.punto("Q", polare(N2, r, 180 - g13));
    const C = k.punto("C", [0, y0 + h]);
    k.seg("lineBase", [-5.6, y0], [5.6, y0]); k.seg("segAB", A, B);
    k.traccia("linePerpA", A, [A[0], y0 + h + 0.7], [0.12, 0.5]); k.traccia("linePerpB", B, [B[0], y0 + h + 0.7], [0.52, 0.9]);
    k.archetto("arcK3", N1, N3, 7, [0.12, 0.5]); k.archetto("arcK4", N2, N4, 7, [0.52, 0.9]);
    k.traccia("lineC13", N1, N3, [0.12, 0.5]); k.traccia("lineC24", N2, N4, [0.52, 0.9]);
    arcoOrario(k, "arcG1", N1, r, 180, 180 - g13, [0.12, 0.5]); k.arco("arcG2", N2, r, 0, 180 - g13, [0.52, 0.9]);
    k.arco("arcG3", N3, L / 2, g13 - 180, 180 - g13, [0.12, 0.5]); arcoOrario(k, "arcG4", N4, L / 2, 360 - g13, 180 - g13, [0.52, 0.9]);
    k.arcoFisso("profilo1", N1, r, g13, 180); k.arcoFisso("profilo2", N2, r, 0, 180 - g13);
    k.arcoFisso("profilo3", N3, L / 2, g13 - 180, 0); k.arcoFisso("profilo4", N4, L / 2, 180, 360 - g13);
    const fine = ["profilo1", "profilo2", "profilo3", "profilo4"]; fine.forEach((n) => k.compare(n, 0.97));
    k.compare("M", 0.4); k.compare("N1", 0.7); k.compare("N2", 0.95); k.compare("N3", 0.5); k.compare("N4", 0.9);
    k.compare("P", 0.5); k.compare("Q", 0.9); k.compare("C", 0.9);
    k.passo("A", "B", "segAB", "lineBase");
    k.passo(...q.nomi, "M", "N1", "N2");
    k.passo("linePerpA", "linePerpB");
    k.passo("arcK3", "arcK4", "N3", "N4");
    k.passo("lineC13", "lineC24");
    k.passo("arcG1", "arcG2", "P", "Q");
    k.passo("arcG3", "arcG4", "C", ...fine);
    k.risultato(...fine);
  });

  /** Arco acuto con i due centri sulla linea d'imposta, a distanza `d` dal punto medio. */
  function arcoAcuto(slug, meta, dentro) {
    tavola(slug, meta, (k) => {
      const L = dentro ? 5.6 : 4.2; const y0 = dentro ? -1.9 : -2.6;
      const A = k.punto("A", [-L / 2, y0]); const B = k.punto("B", [L / 2, y0]);
      const q = quarti(k, "Z", A, B, !dentro);
      k.punto("M", q.M);
      const R = dentro ? (3 * L) / 4 : (5 * L) / 4;
      const c1 = dentro ? q.Q1 : [-L / 2 - L / 4, y0]; const c2 = dentro ? q.Q2 : [L / 2 + L / 4, y0];
      const N1 = k.punto("N1", c1, "1"); const N2 = k.punto("N2", c2, "2");
      const C = k.punto("C", [0, y0 + Math.sqrt(R * R - c2[0] * c2[0])]);
      const g = direzione(N2, C);
      k.seg("lineBase", [-5.6, y0], [5.6, y0]); k.seg("segAB", A, B);
      arcoOrario(k, "arcG2", N2, R, 180, 188 - g); k.arco("arcG1", N1, R, 0, 188 - g);
      k.arcoFisso("profilo1", N2, R, g, 180); k.arcoFisso("profilo2", N1, R, 0, 180 - g);
      k.compare("M", 0.4); k.compare("C", 0.6); k.compare("profilo1", 0.3); k.compare("profilo2", 0.6);
      k.passo("A", "B", "segAB", "lineBase");
      if (dentro) {
        k.compare("N1", 0.7); k.compare("N2", 0.95);
        k.passo(...q.nomi, "M", "N1", "N2");
      } else {
        k.punto("N", q.Q1); k.compare("N", 0.7);
        k.archetto("arcK1", A, N1, 20, [0.12, 0.5]); k.archetto("arcK2", B, N2, 20, [0.52, 0.9]);
        k.compare("N1", 0.5); k.compare("N2", 0.9);
        k.passo(...q.nomi, "M", "N");
        k.passo("arcK1", "arcK2", "N1", "N2");
      }
      k.passo("arcG2");
      k.passo("arcG1", "C");
      k.passo("profilo1", "profilo2");
      k.risultato("profilo1", "profilo2");
    });
  }

  arcoAcuto("arco-acuto-ribassato", {
    title: "Arco a sesto acuto ribassato",
    tema: "Centri dentro la luce",
    subtitle: "Se avvicini i due centri, l’arco acuto diventa più basso e la punta meno aguzza.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Centri interni, arco più basso",
    proofCopy: "Nell’arco a sesto acuto (Costruzione 66) i centri sono gli estremi della luce e il raggio è uguale alla luce. Qui i centri sono i punti 1 e 2, dentro la luce, e il raggio è tre quarti della luce. I due archi si incontrano sull’asse nel punto C: la freccia è circa 0,71 volte la luce, invece di 0,87. In A e in B l’arco parte in verticale, perché i centri stanno sulla linea d’imposta.",
    equality: "raggio = 3/4 della luce",
    steps: [
      ["Prima di iniziare", "Osserva la luce AB", "Il segmento AB è la luce dell’arco, cioè la larghezza dell’apertura. Vuoi un arco acuto, ma più basso di quello delle cattedrali gotiche.", "Più i centri sono vicini tra loro, più l’arco si abbassa."],
      ["Passo 1 · Quattro parti", "Trova 1, M e 2", "Dividi la luce in quattro parti uguali: costruisci l’asse di AB e trovi M; poi l’asse di AM e l’asse di MB e trovi i punti 1 e 2.", "1 e 2 sono i centri dei due archi."],
      ["Passo 2 · Arco da 2", "Punta in 2", "Punta in 2, apri fino ad A e traccia un arco sopra la luce, verso destra.", "Il centro è 2, ma l’arco parte da A: dalla parte opposta."],
      ["Passo 3 · Arco da 1", "Punta in 1", "Con la stessa apertura punta in 1 e traccia un arco che parte da B: incontra il primo nel punto C.", "C è la punta dell’arco."],
      ["Passo 4 · Ripassa", "Ripassa l’arco", "Ripassa i due archi solo fino a C: da A a C e da B a C.", "Confronta la freccia con quella dell’arco a sesto acuto."],
    ],
  }, true);

  arcoAcuto("arco-lanceolato", {
    title: "Arco lanceolato",
    tema: "Centri fuori dalla luce",
    subtitle: "Se allontani i due centri oltre gli estremi, l’arco acuto diventa alto e slanciato come la punta di una lancia.",
    coord: [-6.4, 6.4, -4, 3.9],
    proofTitle: "Centri esterni, arco più alto",
    proofCopy: "Nell’arco a sesto acuto (Costruzione 66) i centri sono gli estremi della luce. Qui i centri 1 e 2 sono fuori dalla luce, a un quarto della luce da A e da B, e il raggio è cinque quarti della luce. I due archi si incontrano sull’asse nel punto C. In questa costruzione la freccia è lunga esattamente quanto la luce: lo puoi verificare con il teorema di Pitagora.",
    equality: "raggio = 5/4 della luce · freccia = luce",
    steps: [
      ["Prima di iniziare", "Osserva la luce AB", "Il segmento AB è la luce dell’arco, cioè la larghezza dell’apertura, tracciato sulla linea d’imposta. Vuoi un arco acuto alto e stretto: si chiama lanceolato, o a sesto acuto rialzato.", "Lo trovi nelle finestre delle chiese gotiche."],
      ["Passo 1 · Un quarto della luce", "Trova M e N", "Costruisci l’asse di AB e trovi M. Poi costruisci l’asse di AM e trovi N: la distanza AN è un quarto della luce.", "Ti serve questa misura per i centri."],
      ["Passo 2 · Centri", "Trova 1 e 2", "Punta in A, apri fino a N e taglia la linea d’imposta fuori dalla luce: trovi 1. Con la stessa apertura punta in B e trovi 2, dall’altra parte.", "I centri sono fuori dalla luce."],
      ["Passo 3 · Arco da 2", "Punta in 2", "Punta in 2, apri fino ad A e traccia un arco sopra la luce.", "L’apertura è grande: cinque quarti della luce."],
      ["Passo 4 · Arco da 1", "Punta in 1", "Con la stessa apertura punta in 1 e traccia un arco che parte da B: incontra il primo nel punto C.", "C è la punta dell’arco."],
      ["Passo 5 · Ripassa", "Ripassa l’arco", "Ripassa i due archi solo fino a C: da A a C e da B a C.", "Misura la freccia: è lunga quanto la luce."],
    ],
  }, false);

  // ══ Raccordi e tangenze ═══════════════════════════════════════════════════

  tavola("raccordo-rette-parallele", {
    title: "Raccordo tra due rette parallele",
    tema: "Una semicirconferenza",
    subtitle: "Due rette parallele che finiscono alla stessa altezza si uniscono con mezza circonferenza.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Il raggio è perpendicolare alla retta",
    proofCopy: "Il segmento AB è perpendicolare alle due rette e O è il suo punto medio. Il raggio OA è perpendicolare alla retta r nel punto A: quindi la semicirconferenza è tangente a r in A, cioè la tocca senza attraversarla. Lo stesso vale in B per la retta s. Per questo il passaggio dalla retta alla curva avviene senza spigoli.",
    equality: "OA = OB = metà della distanza tra le rette",
    steps: [
      ["Prima di iniziare", "Osserva le due rette", "Hai due rette parallele, r e s. Vuoi unirle con una curva senza spigoli, come nel bordo di un tavolo o nell’asola di una cintura.", "Raccordare significa unire due linee senza fare angoli."],
      ["Passo 1 · Perpendicolare", "Trova A e B", "Scegli il punto A sulla retta r, dove deve cominciare la curva. Da A traccia la perpendicolare alle due rette, con le squadre: incontra s nel punto B.", "A e B sono i punti di raccordo."],
      ["Passo 2 · Asse di AB", "Trova il centro O", "Costruisci l’asse del segmento AB (Costruzione 9): trovi il punto medio O.", "O è alla stessa distanza dalle due rette."],
      ["Passo 3 · Semicirconferenza", "Punta in O", "Punta in O, apri fino ad A e traccia la semicirconferenza fino a B.", "La curva tocca le due rette senza attraversarle."],
      ["Passo 4 · Ripassa", "Ripassa il contorno", "Ripassa la retta r fino ad A, la semicirconferenza e la retta s a partire da B.", "Passa il dito sul disegno: non devi sentire spigoli."],
    ],
  }, (k) => {
    const x0 = 0.6; const d = 2;
    const A = k.punto("A", [x0, d]); const B = k.punto("B", [x0, -d]); const O = k.punto("O", [x0, 0]);
    k.seg("lineR", [-5.6, d], [5.2, d], "r"); k.seg("lineT", [-5.6, -d], [5.2, -d], "s");
    k.traccia("linePerp", [x0, d + 0.6], [x0, -d - 0.6]);
    const a = asse(k, "P", A, B, 2.7, 0.08, 0.68);
    k.traccia("lineAsse", [a.X2[0] - 0.3, 0], [a.X1[0] + 0.3, 0], [0.7, 0.96]);
    arcoOrario(k, "arcG", O, d, 90, 180);
    k.arcoFisso("profilo", O, d, -90, 90);
    k.traccia("drawR", [-5.6, d], A, [0.1, 0.4]); k.traccia("drawT", B, [-5.6, -d], [0.6, 0.95]);
    k.compare("A", 0.2); k.compare("B", 0.95); k.compare("O", 0.97); k.compare("profilo", 0.5);
    k.passo("lineR", "lineT");
    k.passo("linePerp", "A", "B");
    k.passo(...a.nomi, "lineAsse", "O");
    k.passo("arcG");
    k.passo("drawR", "profilo", "drawT");
    k.risultato("drawR", "profilo", "drawT");
  });

  tavola("raccordo-a-s", {
    title: "Raccordo a S tra due rette parallele",
    tema: "Due archi che cambiano verso",
    subtitle: "Quando i due punti da unire sono sfalsati, servono due archi uguali che curvano da parti opposte: la linea a S, o gola.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Tre punti allineati",
    proofCopy: "Il centro O₁ sta sulla perpendicolare a r nel punto A: l’arco è tangente a r in A. O₁ sta anche sull’asse di AM: dista da A quanto da M, quindi l’arco arriva in M. Lo stesso vale per O₂ con B e M. La figura è simmetrica rispetto a M: i due centri e M stanno sulla stessa retta, e in M i due archi hanno la stessa tangente. Lì la curva cambia verso senza fare spigoli.",
    equality: "O₁A = O₁M = O₂M = O₂B",
    steps: [
      ["Prima di iniziare", "Osserva le due rette", "Hai due rette parallele, r e s. La curva deve partire dal punto A, sulla retta r, e arrivare al punto B, sulla retta s, più a destra.", "È il profilo di molte cornici e modanature."],
      ["Passo 1 · Segmento AB", "Trova M", "Unisci A con B e costruisci l’asse del segmento AB (Costruzione 9): trovi il punto medio M.", "In M la curva cambierà verso."],
      ["Passo 2 · Perpendicolari", "Scendi da A, sali da B", "Traccia la perpendicolare a r nel punto A, verso il basso, e la perpendicolare a s nel punto B, verso l’alto.", "Su queste rette cadranno i due centri."],
      ["Passo 3 · Asse di AM", "Trova il centro O₁", "Costruisci l’asse del segmento AM: incontra la perpendicolare che scende da A nel punto O₁.", "O₁ dista da A quanto da M."],
      ["Passo 4 · Asse di MB", "Trova il centro O₂", "Costruisci l’asse del segmento MB: incontra la perpendicolare che sale da B nel punto O₂.", "O₂ dista da B quanto da M."],
      ["Passo 5 · Due archi", "Traccia la linea a S", "Punta in O₁, apri fino ad A e traccia l’arco fino a M. Punta in O₂, apri fino a M e traccia l’arco fino a B.", "I due archi hanno lo stesso raggio."],
    ],
  }, (k) => {
    const A = k.punto("A", [-2, 1.7]); const B = k.punto("B", [2, -1.7]); const M = k.punto("M", [0, 0]);
    const yo = (A[1] * A[1] - A[0] * A[0]) / (2 * A[1]);
    const O1 = k.punto("O1", [A[0], yo], "O₁"); const O2 = k.punto("O2", [B[0], -yo], "O₂");
    const R = A[1] - yo;
    k.seg("lineR", [-5.6, A[1]], [5.6, A[1]], "r"); k.seg("lineT", [-5.6, B[1]], [5.6, B[1]], "s");
    k.traccia("lineAB", A, B, [0.08, 0.3]);
    const a0 = asse(k, "P", A, B, 3.1, 0.3, 0.95);
    k.traccia("linePerpA", A, [A[0], yo - 0.9], [0.12, 0.5]); k.traccia("linePerpB", B, [B[0], -yo + 0.9], [0.52, 0.9]);
    const a1 = asse(k, "Q", A, M, 1.7, 0.08, 0.6);
    const lontano1 = distanza(a1.X1, O1) > distanza(a1.X2, O1) ? a1.X1 : a1.X2;
    k.traccia("lineAsseQ", sposta(lontano1, direzione(O1, lontano1), 0.3), sposta(O1, direzione(lontano1, O1), 0.4), [0.62, 0.96]);
    const a2 = asse(k, "U", M, B, 1.7, 0.08, 0.6);
    const lontano2 = distanza(a2.X1, O2) > distanza(a2.X2, O2) ? a2.X1 : a2.X2;
    k.traccia("lineAsseU", sposta(lontano2, direzione(O2, lontano2), 0.3), sposta(O2, direzione(lontano2, O2), 0.4), [0.62, 0.96]);
    const gM = direzione(O1, M);
    arcoOrario(k, "arcG1", O1, R, 90, 90 - gM, [0.12, 0.5]); k.arco("arcG2", O2, R, 180 + gM, 90 - gM, [0.52, 0.9]);
    k.arcoFisso("profilo1", O1, R, gM, 90); k.arcoFisso("profilo2", O2, R, 180 + gM, 270);
    k.compare("M", 0.95); k.compare("O1", 0.96); k.compare("O2", 0.96); k.compare("profilo1", 0.96); k.compare("profilo2", 0.97);
    k.passo("lineR", "lineT", "A", "B");
    k.passo("lineAB", ...a0.nomi, "M");
    k.passo("linePerpA", "linePerpB");
    k.passo(...a1.nomi, "lineAsseQ", "O1");
    k.passo(...a2.nomi, "lineAsseU", "O2");
    k.passo("arcG1", "arcG2", "profilo1", "profilo2");
    k.risultato("profilo1", "profilo2");
  });

  tavola("tre-circonferenze-tangenti", {
    title: "Tre circonferenze tangenti tra loro",
    tema: "Un triangolo fatto di raggi",
    subtitle: "Conosci i tre raggi: i centri sono i vertici di un triangolo che ha per lati le somme dei raggi, a due a due.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "La distanza tra i centri è la somma dei raggi",
    proofCopy: "Due circonferenze sono tangenti esternamente, cioè si toccano in un solo punto restando una fuori dall’altra, quando la distanza tra i centri è uguale alla somma dei raggi. Il triangolo dei centri ha i lati lunghi 2 + 1,5, 2 + 1 e 1,5 + 1 centimetri: ogni coppia di circonferenze si tocca in un punto, che sta sul lato del triangolo che unisce i due centri.",
    equality: "O₁O₂ = 3,5 cm · O₁O₃ = 3 cm · O₂O₃ = 2,5 cm",
    steps: [
      ["Prima di iniziare", "Osserva i tre raggi", "Devi disegnare tre circonferenze che si toccano a due a due. I raggi sono 2 cm, 1,5 cm e 1 cm.", "È lo schema di tre tubi accostati o di tre monete che si toccano."],
      ["Passo 1 · Primo lato", "Traccia O₁O₂", "Somma i primi due raggi: 2 + 1,5 = 3,5 cm. Con il righello traccia il segmento O₁O₂ lungo 3,5 cm.", "O₁ e O₂ sono i primi due centri."],
      ["Passo 2 · Terzo centro", "Trova O₃", "Apri il compasso a 3 cm (2 + 1), punta in O₁ e traccia un archetto. Apri a 2,5 cm (1,5 + 1), punta in O₂ e incrocia l’archetto: trovi O₃.", "È la costruzione del triangolo dati i tre lati (Costruzione 17)."],
      ["Passo 3 · Triangolo dei centri", "Unisci i tre centri", "Con il righello unisci O₃ con O₁ e con O₂.", "Sui lati del triangolo cadranno i punti di contatto."],
      ["Passo 4 · Tre circonferenze", "Punta nei tre centri", "Punta in O₁ e traccia la circonferenza di raggio 2 cm. Punta in O₂ e traccia quella di raggio 1,5 cm. Punta in O₃ e traccia quella di raggio 1 cm.", "Le circonferenze si toccano senza sovrapporsi."],
    ],
  }, (k, t) => {
    const r1 = 2; const r2 = 1.5; const r3 = 1;
    const O1 = k.punto("O1", [-1.5, -1.2], "O₁"); const O2 = k.punto("O2", [O1[0] + r1 + r2, O1[1]], "O₂");
    const d13 = r1 + r3; const d23 = r2 + r3; const d12 = r1 + r2;
    const x3 = (d13 * d13 - d23 * d23 + d12 * d12) / (2 * d12);
    const O3 = k.punto("O3", [O1[0] + x3, O1[1] + Math.sqrt(d13 * d13 - x3 * x3)], "O₃");
    k.seg("segDatA", [-5.7, 3.3], [-3.7, 3.3], "2 cm"); k.seg("segDatB", [-5.7, 2.7], [-4.2, 2.7], "1,5 cm"); k.seg("segDatC", [-5.7, 2.1], [-4.7, 2.1], "1 cm");
    k.traccia("lineC12", O1, O2);
    k.archetto("arcK13", O1, O3, 12, [0.12, 0.5]); k.archetto("arcK23", O2, O3, 14, [0.52, 0.9]);
    k.traccia("lineC13", O1, O3, [0.12, 0.5]); k.traccia("lineC23", O2, O3, [0.52, 0.9]);
    const w = finestre(3);
    k.arco("circleA", O1, r1, 0, 360, w[0]); k.arco("circleB", O2, r2, 180, 360, w[1]); k.arco("circleC", O3, r3, 270, 360, w[2]);
    k.cerchio("drawCa", O1, r1); k.cerchio("drawCb", O2, r2); k.cerchio("drawCc", O3, r3);
    ["drawCa", "drawCb", "drawCc"].forEach((n) => k.compare(n, 0.97));
    puntoMuto(t, "Ta", polare(O1, r1, 0)); puntoMuto(t, "Tb", polare(O1, r1, direzione(O1, O3))); puntoMuto(t, "Tc", polare(O2, r2, direzione(O2, O3)));
    ["Ta", "Tb", "Tc"].forEach((n) => k.compare(n, 0.97));
    k.compare("O3", 0.9);
    k.passo("segDatA", "segDatB", "segDatC");
    k.passo("lineC12", "O1", "O2");
    k.passo("arcK13", "arcK23", "O3");
    k.passo("lineC13", "lineC23");
    k.passo("circleA", "circleB", "circleC", "drawCa", "drawCb", "drawCc", "Ta", "Tb", "Tc");
    k.risultato("drawCa", "drawCb", "drawCc");
  });

  tavola("raccordo-due-circonferenze", {
    title: "Raccordo tra due circonferenze",
    tema: "Un arco che le tocca tutte e due",
    subtitle: "Conosci il raggio del raccordo: il suo centro dista da ogni circonferenza quanto quel raggio.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Somme di raggi",
    proofCopy: "Il centro O dista da O₁ quanto il primo raggio più il raggio del raccordo: la circonferenza di raccordo tocca la prima in un solo punto, T₁, che sta sulla retta dei due centri. Lo stesso vale per la seconda, nel punto T₂. In T₁ e in T₂ l’arco e le circonferenze hanno la stessa tangente: il contorno passa dall’una all’altra senza spigoli.",
    equality: "OO₁ = 1,6 + 2,2 cm · OO₂ = 1,1 + 2,2 cm",
    steps: [
      ["Prima di iniziare", "Osserva le due circonferenze", "Hai due circonferenze: la prima ha centro O₁ e raggio 1,6 cm, la seconda centro O₂ e raggio 1,1 cm. Vuoi unirle con un arco di raggio 2,2 cm, senza spigoli.", "È il profilo di una chiave inglese o di una biella."],
      ["Passo 1 · Arco da O₁", "Somma i raggi", "Somma il primo raggio e il raggio del raccordo: 1,6 + 2,2 = 3,8 cm. Apri il compasso a 3,8 cm, punta in O₁ e traccia un arco sopra le circonferenze.", "Tutti i punti dell’arco distano 2,2 cm dalla prima circonferenza."],
      ["Passo 2 · Arco da O₂", "Trova il centro O", "Somma il secondo raggio e il raggio del raccordo: 1,1 + 2,2 = 3,3 cm. Apri il compasso a 3,3 cm, punta in O₂ e incrocia il primo arco: trovi O.", "O è il centro del raccordo."],
      ["Passo 3 · Punti di raccordo", "Trova T₁ e T₂", "Unisci O con O₁: il segmento taglia la prima circonferenza nel punto T₁. Unisci O con O₂: trovi T₂ sulla seconda.", "Il raccordo deve cominciare e finire esattamente qui."],
      ["Passo 4 · Raccordo", "Punta in O", "Apri il compasso a 2,2 cm, punta in O e traccia l’arco da T₁ a T₂.", "Ripassa il contorno: circonferenza, raccordo, circonferenza."],
    ],
  }, (k) => {
    const r1 = 1.6; const r2 = 1.1; const R = 2.2; const y0 = -1.6;
    const O1 = k.punto("O1", [-2.6, y0], "O₁"); const O2 = k.punto("O2", [2.2, y0], "O₂");
    const d = distanza(O1, O2); const d1 = r1 + R; const d2 = r2 + R;
    const x = (d1 * d1 - d2 * d2 + d * d) / (2 * d);
    const O = k.punto("O", [O1[0] + x, y0 + Math.sqrt(d1 * d1 - x * x)]);
    const g1 = direzione(O, O1); const g2 = direzione(O, O2);
    const T1 = k.punto("T1", polare(O, R, g1), "T₁"); const T2 = k.punto("T2", polare(O, R, g2), "T₂");
    k.cerchio("circleA", O1, r1); k.cerchio("circleB", O2, r2);
    k.seg("segDatA", [-5.7, 3.3], [-3.5, 3.3], "raccordo 2,2 cm");
    k.archetto("arcK1", O1, O, 14); k.archetto("arcK2", O2, O, 16);
    k.traccia("lineC1", O, O1, [0.12, 0.5]); k.traccia("lineC2", O, O2, [0.52, 0.9]);
    k.arco("arcG", O, R, g1, modulo360(g2 - g1));
    k.arcoFisso("profilo", O, R, g1, g2);
    k.arcoFisso("profiloA", O1, r1, direzione(O1, O), direzione(O1, O) + 359.5); k.arcoFisso("profiloB", O2, r2, direzione(O2, O), direzione(O2, O) + 359.5);
    ["profilo", "profiloA", "profiloB"].forEach((n) => k.compare(n, 0.97));
    k.compare("O", 0.9); k.compare("T1", 0.5); k.compare("T2", 0.9);
    k.passo("circleA", "circleB", "O1", "O2", "segDatA");
    k.passo("arcK1");
    k.passo("arcK2", "O");
    k.passo("lineC1", "lineC2", "T1", "T2");
    k.passo("arcG", "profilo", "profiloA", "profiloB");
    k.risultato("profilo", "profiloA", "profiloB");
  });

  tavola("tangenti-comuni-interne", {
    title: "Tangenti comuni interne a due circonferenze",
    tema: "Due rette che si incrociano in mezzo",
    subtitle: "Le tangenti interne passano tra le due circonferenze: sono le due parti incrociate di una cinghia.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Un angolo retto nella semicirconferenza",
    proofCopy: "Il punto P sta sulla circonferenza che ha per diametro O₁O₂: l’angolo in P del triangolo O₁PO₂ è retto (Costruzione 29). La retta O₂P è quindi tangente alla circonferenza di centro O₁ e raggio uguale alla somma dei due raggi. Spostandola in parallelo di una lunghezza uguale al secondo raggio ottieni la retta T₁T₂: è perpendicolare al raggio O₁T₁ e al raggio O₂T₂, quindi è tangente a tutte e due le circonferenze.",
    equality: "T₁T₂ ⟂ O₁T₁ · T₁T₂ ⟂ O₂T₂",
    steps: [
      ["Prima di iniziare", "Osserva le due circonferenze", "Hai due circonferenze separate, con centri O₁ e O₂. Vuoi tracciare le due rette tangenti che passano in mezzo, incrociandosi.", "Le tangenti esterne sono nella Costruzione 59."],
      ["Passo 1 · Punto medio", "Trova M", "Unisci O₁ con O₂ e costruisci l’asse del segmento (Costruzione 9): trovi il punto medio M.", "M è il centro della prossima circonferenza."],
      ["Passo 2 · Circonferenza da M", "Punta in M", "Punta in M, apri fino a O₁ e traccia la circonferenza: passa anche per O₂.", "Il suo diametro è O₁O₂."],
      ["Passo 3 · Somma dei raggi", "Trova P e Q", "Apri il compasso quanto la somma dei due raggi. Punta in O₁ e taglia la circonferenza appena tracciata in due punti: P sopra e Q sotto.", "Per sommare i raggi riportali uno dopo l’altro su una retta."],
      ["Passo 4 · Raggi da O₁", "Trova T₁ e T₃", "Unisci O₁ con P: il segmento taglia la prima circonferenza nel punto T₁. Unisci O₁ con Q: trovi T₃.", "T₁ e T₃ sono i punti di tangenza sulla prima circonferenza."],
      ["Passo 5 · Raggi da O₂", "Trova T₂ e T₄", "Da O₂ traccia il raggio parallelo a O₁P ma rivolto dalla parte opposta: trovi T₂. Fai lo stesso con O₁Q: trovi T₄.", "Usa le due squadre per le parallele."],
      ["Passo 6 · Tangenti", "Unisci i punti", "Traccia la retta che passa per T₁ e T₂ e quella che passa per T₃ e T₄.", "Le due tangenti si incrociano sul segmento che unisce i centri."],
    ],
  }, (k) => {
    const r1 = 1.5; const r2 = 1; const O1 = k.punto("O1", [-2.6, 0], "O₁"); const O2 = k.punto("O2", [2.6, 0], "O₂");
    const M = k.punto("M", [0, 0]);
    const al = Math.acos((r1 + r2) / distanza(O1, O2)) / RAD;
    const P = k.punto("P", polare(O1, r1 + r2, al)); const Q = k.punto("Q", polare(O1, r1 + r2, -al));
    const T1 = k.punto("T1", polare(O1, r1, al), "T₁"); const T3 = k.punto("T3", polare(O1, r1, -al), "T₃");
    const T2 = k.punto("T2", polare(O2, r2, al + 180), "T₂"); const T4 = k.punto("T4", polare(O2, r2, 180 - al), "T₄");
    k.cerchio("circleA", O1, r1); k.cerchio("circleB", O2, r2);
    k.traccia("lineC12", O1, O2, [0.06, 0.25]);
    const a = asse(k, "P", O1, O2, 3.2, 0.27, 0.95);
    k.arco("circleM", M, 2.6, 180, 360);
    k.archetto("arcKP", O1, P, 13, [0.12, 0.5]); k.archetto("arcKQ", O1, Q, 13, [0.52, 0.9]);
    k.traccia("lineP", O1, P, [0.12, 0.5]); k.traccia("lineQ", O1, Q, [0.52, 0.9]);
    k.traccia("lineP2", O2, T2, [0.12, 0.5]); k.traccia("lineQ2", O2, T4, [0.52, 0.9]);
    k.traccia("drawT12", oltre(T2, T1, 1.6), oltre(T1, T2, 1.6), [0.12, 0.5]); k.traccia("drawT34", oltre(T4, T3, 1.6), oltre(T3, T4, 1.6), [0.52, 0.9]);
    k.compare("M", 0.96); k.compare("P", 0.5); k.compare("Q", 0.9); k.compare("T1", 0.5); k.compare("T3", 0.9); k.compare("T2", 0.5); k.compare("T4", 0.9);
    k.passo("circleA", "circleB", "O1", "O2");
    k.passo("lineC12", ...a.nomi, "M");
    k.passo("circleM");
    k.passo("arcKP", "arcKQ", "P", "Q");
    k.passo("lineP", "lineQ", "T1", "T3");
    k.passo("lineP2", "lineQ2", "T2", "T4");
    k.passo("drawT12", "drawT34");
    k.risultato("drawT12", "drawT34");
  });

  // ══ Stelle ════════════════════════════════════════════════════════════════

  tavola("stella-quattro-punte", {
    title: "Stella a quattro punte",
    tema: "La rosa dei venti",
    subtitle: "Due diametri perpendicolari danno le punte; le bisettrici e una circonferenza più piccola danno le rientranze.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Otto vertici alternati",
    proofCopy: "Le quattro punte stanno sulla circonferenza grande, a 90° una dall’altra. Le quattro rientranze stanno sulla circonferenza piccola, sulle bisettrici: esattamente a metà tra due punte. Tutti i lati della stella uniscono un punto della circonferenza grande con uno della piccola, separati da 45°: per questo sono tutti uguali. Se cambi il raggio della circonferenza piccola, la stella diventa più sottile o più tozza.",
    equality: "4 punte · 4 rientranze · 8 lati uguali",
    steps: [
      ["Prima di iniziare", "Osserva la circonferenza", "Hai una circonferenza con centro O e il suo diametro orizzontale AB. Vuoi disegnare una stella a quattro punte, come quella della rosa dei venti.", "Le punte indicheranno nord, est, sud e ovest."],
      ["Passo 1 · Diametro verticale", "Trova C e D", "Costruisci l’asse del diametro AB (Costruzione 9): è il diametro verticale, che taglia la circonferenza in C e in D.", "A, B, C e D sono le quattro punte."],
      ["Passo 2 · Bisettrici", "Dividi a metà gli angoli retti", "Costruisci le bisettrici dei quattro angoli retti: due rette che passano per O, inclinate di 45°.", "Bastano due coppie di archetti: ogni retta divide a metà due angoli opposti."],
      ["Passo 3 · Circonferenza piccola", "Trova 1, 2, 3 e 4", "Punta in O con un’apertura più piccola, a piacere: qui circa un terzo del raggio. Traccia la circonferenza: taglia le bisettrici nei punti 1, 2, 3 e 4.", "Sono le rientranze della stella."],
      ["Passo 4 · Righello", "Unisci a zig-zag", "Unisci B con 1, 1 con C, C con 2 e continua così, alternando una punta e una rientranza, fino a tornare in B.", "Colora metà di ogni punta per ottenere l’effetto in rilievo."],
    ],
  }, (k) => {
    const O = k.punto("O", [0, 0]); const R = 3.2; const r = 1.1;
    const A = k.punto("A", [-R, 0]); const B = k.punto("B", [R, 0]); const C = k.punto("C", [0, R]); const D = k.punto("D", [0, -R]);
    const N = [45, 135, 225, 315].map((g, i) => k.punto(`N${i + 1}`, polare(O, r, g), String(i + 1)));
    k.cerchio("circleO", O, R); k.seg("diamAB", A, B);
    const a = asse(k, "P", A, B, 4.2, 0.08, 0.68);
    k.traccia("diamCD", [0, R + 0.3], [0, -R - 0.3], [0.7, 0.96]);
    const ra = 3; const dd = (R * Math.SQRT2) / 2 + Math.sqrt(ra * ra - (R * R) / 2);
    const X1 = polare(O, dd, 45); const X2 = polare(O, dd, 135);
    k.archetto("arcB1", B, X1, 8, [0.1, 0.25]); k.archetto("arcC1", C, X1, 8, [0.25, 0.4]);
    k.archetto("arcA2", A, X2, 8, [0.4, 0.55]); k.archetto("arcC2", C, X2, 8, [0.55, 0.7]);
    k.traccia("lineB1", sposta(X1, 45, 0.2), polare(O, R + 0.2, 225), [0.7, 0.83]); k.traccia("lineB2", sposta(X2, 135, 0.2), polare(O, R + 0.2, 315), [0.83, 0.96]);
    k.arco("circleP", O, r, 0, 360);
    const giro = [B, N[0], C, N[1], A, N[2], D, N[3]];
    const lati = chiudi(k, "L", giro);
    k.compare("C", 0.9); k.compare("D", 0.96); N.forEach((_, i) => k.compare(`N${i + 1}`, 0.3 + 0.2 * i));
    k.passo("O", "A", "B", "circleO", "diamAB");
    k.passo(...a.nomi, "diamCD", "C", "D");
    k.passo("arcB1", "arcC1", "arcA2", "arcC2", "lineB1", "lineB2");
    k.passo("circleP", "N1", "N2", "N3", "N4");
    k.passo(...lati);
    k.risultato(...lati);
  });

  tavola("stella-sette-punte", {
    title: "Stella a sette punte",
    tema: "Dall’ettagono alla stella",
    subtitle: "Dividi la circonferenza in sette parti e unisci i punti saltandone due ogni volta.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Una linea sola che si chiude",
    proofCopy: "Sette è un numero primo: partendo da un vertice e saltandone sempre due, tocchi tutti e sette i vertici prima di tornare al punto di partenza. La stella si disegna quindi con un’unica linea spezzata, senza staccare la matita. La divisione in sette parti è approssimata (Costruzione 16): l’errore è di circa due millesimi del lato, invisibile a matita.",
    equality: "7 vertici · passo di 3 vertici · una linea sola",
    steps: [
      ["Prima di iniziare", "Osserva la circonferenza", "Hai una circonferenza con centro O e il punto 1 in alto. Vuoi disegnare una stella a sette punte.", "Sette parti uguali non si ottengono in modo esatto con riga e compasso: si usa un’ottima approssimazione."],
      ["Passo 1 · Lato dell’ettagono", "Trova il lato", "Traccia il diametro verticale: in basso trovi S. Punta in S, apri fino a O e traccia un arco che taglia la circonferenza in P e in Q. Unisci P con Q: la corda incontra il diametro in M. Il segmento PM è il lato dell’ettagono (Costruzione 16).", "PM è metà della corda PQ."],
      ["Passo 2 · Sette vertici", "Riporta il lato", "Apri il compasso quanto PM. Partendo da 1 riporta il lato sulla circonferenza, tre volte da una parte e tre dall’altra: in tutto hai sette punti. Numerali girando in senso orario.", "Tra gli ultimi due punti deve restare una distanza quasi uguale alle altre."],
      ["Passo 3 · Righello", "Salta due vertici", "Parti da 1 e unisci con 4, saltando 2 e 3. Poi da 4 a 7, da 7 a 3, da 3 a 6, da 6 a 2, da 2 a 5 e da 5 di nuovo a 1.", "Conta sempre tre passi in avanti."],
      ["Passo 4 · Un’altra stella", "Prova a saltarne uno", "Se invece salti un solo vertice (da 1 a 3, da 3 a 5, e così via) ottieni una stella più «gonfia», con le punte meno aguzze.", "Con sette punti puoi disegnare due stelle diverse."],
    ],
  }, (k) => {
    const O = k.punto("O", [0, -0.1]); const R = 3.2;
    const S = k.punto("S", [O[0], O[1] - R]);
    const P = k.punto("P", polare(O, R, 210)); const Q = k.punto("Q", polare(O, R, 330)); const M = k.punto("M", [O[0], O[1] - R / 2]);
    const V = []; for (let i = 0; i < 7; i += 1) V.push(k.punto(`N${i + 1}`, polare(O, R, 90 - (360 / 7) * i), String(i + 1)));
    k.cerchio("circleO", O, R);
    k.traccia("diamV", [O[0], O[1] + R + 0.3], [O[0], O[1] - R - 0.3], [0.08, 0.3]);
    k.arco("arcS", S, R, 24, 132, [0.3, 0.6]);
    k.traccia("linePQ", P, Q, [0.62, 0.8]);
    k.traccia("segPM", P, M, [0.8, 0.96]);
    const ordine = [1, 2, 3, 6, 5, 4]; const w = finestre(6);
    const archetti = ordine.map((i, n) => { const da = i <= 3 ? V[i - 1] : V[(i + 1) % 7]; k.archetto(`arcV${i}`, da, V[i], 9, w[n]); k.compare(`N${i + 1}`, w[n][1]); return `arcV${i}`; });
    const stella = [0, 3, 6, 2, 5, 1, 4].map((i) => V[i]);
    const lati = chiudi(k, "L", stella);
    const stella2 = [0, 2, 4, 6, 1, 3, 5].map((i) => V[i]);
    const lati2 = stella2.map((p, i) => { const n = `lineZ${i}`; k.traccia(n, p, stella2[(i + 1) % 7], finestre(7)[i]); return n; });
    lati2.forEach((n) => k.tratteggia(n));
    k.compare("S", 0.3); k.compare("P", 0.6); k.compare("Q", 0.6); k.compare("M", 0.8);
    k.passo("O", "circleO", "N1");
    k.passo("diamV", "arcS", "linePQ", "segPM", "S", "P", "Q", "M");
    k.passo(...archetti, "N2", "N3", "N4", "N5", "N6", "N7");
    k.passo(...lati);
    k.passo(...lati2);
    k.risultato(...lati);
  });

  // ══ Trasformazioni ════════════════════════════════════════════════════════

  /** Disegna il triangolo di partenza (blu) e dichiara i vertici immagine con l'apice. */
  function triangoloDato(k, T) {
    ["A", "B", "C"].forEach((n, i) => k.punto(n, T[i]));
    return [0, 1, 2].map((i) => { const n = `segF${i}`; k.seg(n, T[i], T[(i + 1) % 3]); return n; });
  }
  function immagini(k, Ti) {
    ["Ap", "Bp", "Cp"].forEach((n, i) => k.punto(n, Ti[i], `${"ABC"[i]}′`));
    return ["Ap", "Bp", "Cp"];
  }

  tavola("simmetria-assiale", {
    title: "Simmetria assiale di una figura",
    tema: "Come in uno specchio",
    subtitle: "Ogni punto ha il suo simmetrico dall’altra parte dell’asse, sulla perpendicolare e alla stessa distanza.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Stessa distanza, parte opposta",
    proofCopy: "Ogni vertice e il suo simmetrico stanno sulla stessa perpendicolare all’asse e alla stessa distanza da esso: l’asse r è l’asse del segmento che li unisce. Se pieghi il foglio lungo r, le due figure si sovrappongono esattamente. I lati e gli angoli restano uguali, ma il verso si inverte: come la mano destra e la sinistra.",
    equality: "A e A′ alla stessa distanza da r · AA′ ⟂ r",
    steps: [
      ["Prima di iniziare", "Osserva la figura e l’asse", "Hai un triangolo ABC e una retta r, l’asse di simmetria. Vuoi disegnare il triangolo simmetrico, come se r fosse uno specchio.", "Basta trovare il simmetrico di ogni vertice."],
      ["Passo 1 · Perpendicolari", "Da ogni vertice all’asse", "Da A, da B e da C traccia le perpendicolari all’asse r (Costruzione 4, oppure con le squadre) e prolungale dall’altra parte.", "Le tre rette sono parallele tra loro."],
      ["Passo 2 · Vertice A", "Riporta la distanza", "Punta il compasso nel punto in cui la perpendicolare da A incontra l’asse. Apri fino ad A e riporta la distanza dall’altra parte: trovi A′.", "A′ si legge «A primo»."],
      ["Passo 3 · Vertici B e C", "Ripeti", "Fai lo stesso per B e per C: trovi B′ e C′.", "Ogni volta punta sull’asse, nel piede della perpendicolare."],
      ["Passo 4 · Righello", "Unisci i simmetrici", "Unisci A′, B′ e C′: è il triangolo simmetrico.", "Piega il foglio lungo r e guarda controluce: i due triangoli coincidono."],
    ],
  }, (k, t) => {
    const xr = 0.2; const T = [[-4.4, -1.7], [-1.4, -2.5], [-2.4, 2.2]];
    const Ti = T.map((p) => [2 * xr - p[0], p[1]]);
    const dato = triangoloDato(k, T); immagini(k, Ti);
    k.seg("lineR", [xr, -3.6], [xr, 3.6], "r");
    const w = finestre(3);
    const perp = T.map((p, i) => { const n = `lineP${i}`; k.traccia(n, p, [Ti[i][0] + 0.5, p[1]], w[i]); puntoMuto(t, `H${i}`, [xr, p[1]]); k.compare(`H${i}`, w[i][1]); return n; });
    k.archetto("arcKa", [xr, T[0][1]], Ti[0], 12);
    k.archetto("arcKb", [xr, T[1][1]], Ti[1], 22, [0.12, 0.5]); k.archetto("arcKc", [xr, T[2][1]], Ti[2], 16, [0.52, 0.9]);
    const lati = chiudi(k, "L", Ti);
    k.compare("Ap", 0.9); k.compare("Bp", 0.5); k.compare("Cp", 0.9);
    k.passo("A", "B", "C", ...dato, "lineR");
    k.passo(...perp, "H0", "H1", "H2");
    k.passo("arcKa", "Ap");
    k.passo("arcKb", "arcKc", "Bp", "Cp");
    k.passo(...lati);
    k.risultato(...lati);
  });

  tavola("simmetria-centrale", {
    title: "Simmetria centrale di una figura",
    tema: "Mezzo giro attorno a un punto",
    subtitle: "Ogni punto ha il suo simmetrico dall’altra parte del centro, sulla stessa retta e alla stessa distanza.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Il centro è il punto medio",
    proofCopy: "Ogni vertice, il centro O e il vertice simmetrico sono allineati, e O è il punto medio del segmento che li unisce. La figura simmetrica è uguale a quella di partenza, ma ruotata di mezzo giro: 180° attorno a O. I lati corrispondenti sono paralleli e il verso della figura non cambia.",
    equality: "OA = OA′ · A, O, A′ allineati",
    steps: [
      ["Prima di iniziare", "Osserva la figura e il centro", "Hai un triangolo ABC e un punto O, il centro di simmetria. Vuoi disegnare il triangolo simmetrico rispetto a O.", "Basta trovare il simmetrico di ogni vertice."],
      ["Passo 1 · Rette per O", "Da ogni vertice al centro", "Traccia le rette che partono da A, da B e da C, passano per O e proseguono dall’altra parte.", "Le tre rette si incrociano tutte in O."],
      ["Passo 2 · Vertice A", "Riporta la distanza", "Punta in O, apri fino ad A e riporta la distanza dall’altra parte, sulla stessa retta: trovi A′.", "O è il punto medio tra A e A′."],
      ["Passo 3 · Vertici B e C", "Ripeti", "Fai lo stesso per B e per C: trovi B′ e C′.", "Punta sempre in O."],
      ["Passo 4 · Righello", "Unisci i simmetrici", "Unisci A′, B′ e C′: è il triangolo simmetrico.", "Ruota il foglio di mezzo giro: il triangolo nuovo prende il posto del vecchio."],
    ],
  }, (k) => {
    const O = k.punto("O", [0.3, 0]); const T = [[-4.2, -0.8], [-1.6, -2.5], [-2.2, 2.1]];
    const Ti = T.map((p) => [2 * O[0] - p[0], 2 * O[1] - p[1]]);
    const dato = triangoloDato(k, T); immagini(k, Ti);
    const w = finestre(3);
    const rette = T.map((p, i) => { const n = `lineP${i}`; k.traccia(n, p, oltre(p, Ti[i], 0.5), w[i]); return n; });
    k.archetto("arcKa", O, Ti[0], 10);
    k.archetto("arcKb", O, Ti[1], 12, [0.12, 0.5]); k.archetto("arcKc", O, Ti[2], 12, [0.52, 0.9]);
    const lati = chiudi(k, "L", Ti);
    k.compare("Ap", 0.9); k.compare("Bp", 0.5); k.compare("Cp", 0.9);
    k.passo("A", "B", "C", ...dato, "O");
    k.passo(...rette);
    k.passo("arcKa", "Ap");
    k.passo("arcKb", "arcKc", "Bp", "Cp");
    k.passo(...lati);
    k.risultato(...lati);
  });

  tavola("traslazione", {
    title: "Traslazione di una figura",
    tema: "Spostare senza ruotare",
    subtitle: "Tutti i punti si spostano nella stessa direzione e della stessa lunghezza: quella del vettore.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Tre spostamenti uguali",
    proofCopy: "I segmenti AA′, BB′ e CC′ sono paralleli al vettore v e lunghi quanto v: tutti i punti della figura fanno lo stesso identico spostamento. Per questo la figura non cambia forma, non cambia misure e non ruota: ogni lato del nuovo triangolo è parallelo al lato corrispondente di quello di partenza.",
    equality: "AA′ = BB′ = CC′ = v",
    steps: [
      ["Prima di iniziare", "Osserva la figura e il vettore", "Hai un triangolo ABC e un segmento orientato v, da P a Q: si chiama vettore, e indica di quanto e verso dove spostare la figura.", "Il vettore ha una direzione, un verso e una lunghezza."],
      ["Passo 1 · Parallele", "Da ogni vertice", "Da A, da B e da C traccia le parallele al vettore v (Costruzione 11, oppure con le squadre), nel verso che va da P a Q.", "Le tre rette sono parallele tra loro."],
      ["Passo 2 · Vertice A", "Riporta la lunghezza", "Apri il compasso quanto il vettore, da P a Q. Punta in A e taglia la parallela: trovi A′.", "Tieni ferma l’apertura."],
      ["Passo 3 · Vertici B e C", "Ripeti", "Con la stessa apertura punta in B e poi in C: trovi B′ e C′.", "Lo spostamento è lo stesso per tutti i punti."],
      ["Passo 4 · Righello", "Unisci i punti", "Unisci A′, B′ e C′: è il triangolo traslato.", "Controlla con le squadre: i lati corrispondenti sono paralleli."],
    ],
  }, (k) => {
    const v = [4.9, 0.9]; const T = [[-4.8, -2.3], [-2.2, -2.7], [-3.4, 0.6]];
    const Ti = T.map((p) => [p[0] + v[0], p[1] + v[1]]);
    const dato = triangoloDato(k, T); immagini(k, Ti);
    const P = k.punto("P", [-4.6, 2.3]); const Q = k.punto("Q", [P[0] + v[0], P[1] + v[1]]);
    k.seg("segV", P, Q, "v");
    const gv = direzione(P, Q);
    k.seg("segVa", Q, polare(Q, 0.35, gv + 155)); k.seg("segVb", Q, polare(Q, 0.35, gv - 155));
    const w = finestre(3);
    const rette = T.map((p, i) => { const n = `lineP${i}`; k.traccia(n, p, oltre(p, Ti[i], 0.6), w[i]); return n; });
    k.archetto("arcKa", T[0], Ti[0], 10);
    k.archetto("arcKb", T[1], Ti[1], 10, [0.12, 0.5]); k.archetto("arcKc", T[2], Ti[2], 10, [0.52, 0.9]);
    const lati = chiudi(k, "L", Ti);
    k.compare("Ap", 0.9); k.compare("Bp", 0.5); k.compare("Cp", 0.9);
    k.passo("A", "B", "C", ...dato, "P", "Q", "segV", "segVa", "segVb");
    k.passo(...rette);
    k.passo("arcKa", "Ap");
    k.passo("arcKb", "arcKc", "Bp", "Cp");
    k.passo(...lati);
    k.risultato(...lati);
  });

  tavola("rotazione-60", {
    title: "Rotazione di una figura di 60°",
    tema: "Girare attorno a un centro",
    subtitle: "Ogni punto percorre un arco di circonferenza con centro O: tutti gli archi hanno la stessa ampiezza.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Tre triangoli equilateri",
    proofCopy: "Il punto A′ dista da O quanto A, perché sta sull’arco con centro O. Dista da A ancora la stessa lunghezza, perché hai usato la stessa apertura. Il triangolo O-A-A′ ha tre lati uguali: è equilatero, quindi l’angolo in O misura 60°. Lo stesso vale per B e per C: tutti i vertici ruotano dello stesso angolo e la figura non cambia forma né misure.",
    equality: "OA = OA′ = AA′ → angolo di 60°",
    steps: [
      ["Prima di iniziare", "Osserva la figura e il centro", "Hai un triangolo ABC e un punto O, il centro di rotazione. Vuoi ruotare il triangolo di 60° in senso antiorario, cioè contrario alle lancette dell’orologio.", "Per altri angoli costruisci prima l’angolo (Costruzioni 51, 52 e 53)."],
      ["Passo 1 · Archi da O", "Un arco per ogni vertice", "Punta in O e apri fino ad A: traccia un arco in senso antiorario. Fai lo stesso aprendo fino a B e poi fino a C.", "Ogni vertice si muove sul suo arco."],
      ["Passo 2 · Vertice A", "Trova A′", "Apri il compasso quanto OA. Punta in A e taglia l’arco che passa per A: trovi A′.", "Il triangolo O-A-A′ è equilatero."],
      ["Passo 3 · Vertici B e C", "Ripeti", "Apri quanto OB, punta in B e taglia il suo arco: trovi B′. Apri quanto OC, punta in C e taglia il suo arco: trovi C′.", "Ogni vertice usa la sua apertura."],
      ["Passo 4 · Righello", "Unisci i punti", "Unisci A′, B′ e C′: è il triangolo ruotato di 60°.", "Controlla con il goniometro l’angolo tra OA e OA′."],
    ],
  }, (k) => {
    const O = k.punto("O", [-1.2, -3]); const T = [[1.6, -2.4], [4.2, -2], [3, 0.3]];
    const Ti = T.map((p) => ruota(p, O, 60));
    const dato = triangoloDato(k, T); immagini(k, Ti);
    const w = finestre(3);
    const archi = T.map((p, i) => { const n = `arcR${i}`; k.arco(n, O, distanza(O, p), direzione(O, p) - 4, 70, w[i]); return n; });
    const raggi = T.map((p, i) => { const n = `lineO${i}`; k.seg(n, O, p); k.tratteggia(n); return n; });
    k.archetto("arcKa", T[0], Ti[0], 12);
    k.archetto("arcKb", T[1], Ti[1], 8, [0.12, 0.5]); k.archetto("arcKc", T[2], Ti[2], 8, [0.52, 0.9]);
    const lati = chiudi(k, "L", Ti);
    k.traccia("lineOAp", O, Ti[0], [0.5, 0.9]); k.tratteggia("lineOAp");
    k.compare("Ap", 0.9); k.compare("Bp", 0.5); k.compare("Cp", 0.9);
    k.passo("A", "B", "C", ...dato, "O");
    k.passo(...archi, ...raggi);
    k.passo("arcKa", "lineOAp", "Ap");
    k.passo("arcKb", "arcKc", "Bp", "Cp");
    k.passo(...lati);
    k.risultato(...lati);
  });

  tavola("ingrandimento-doppio", {
    title: "Ingrandimento di una figura in scala 2 : 1",
    tema: "Stessa forma, misure doppie",
    subtitle: "Da un punto O partono le semirette che passano per i vertici: su ognuna raddoppi la distanza da O.",
    coord: [-6, 6, -3.7, 3.7],
    proofTitle: "Lati paralleli e doppi",
    proofCopy: "Ogni vertice del nuovo triangolo sta sulla stessa semiretta del vertice di partenza, a distanza doppia da O. Per questo ogni lato del triangolo grande è parallelo al lato corrispondente del piccolo ed è lungo il doppio, mentre gli angoli restano uguali. Le due figure hanno la stessa forma ma grandezza diversa: si dicono simili. Questa trasformazione si chiama omotetia.",
    equality: "OA′ = 2 × OA · A′B′ = 2 × AB",
    steps: [
      ["Prima di iniziare", "Osserva la figura e il punto O", "Hai un triangolo ABC e un punto O, fuori dal triangolo. Vuoi disegnare un triangolo con la stessa forma ma con i lati lunghi il doppio.", "È un ingrandimento in scala 2 : 1."],
      ["Passo 1 · Semirette da O", "Passa per i vertici", "Traccia le semirette che partono da O e passano per A, per B e per C. Prolungale bene oltre i vertici.", "O si chiama centro dell’ingrandimento."],
      ["Passo 2 · Vertice A", "Raddoppia la distanza", "Apri il compasso quanto OA. Punta in A e taglia la semiretta oltre A: trovi A′.", "OA′ è il doppio di OA."],
      ["Passo 3 · Vertici B e C", "Ripeti", "Apri quanto OB, punta in B e trovi B′. Apri quanto OC, punta in C e trovi C′.", "Ogni vertice usa la sua apertura."],
      ["Passo 4 · Righello", "Unisci i punti", "Unisci A′, B′ e C′: è il triangolo ingrandito.", "Misura AB e A′B′: il secondo è il doppio del primo."],
    ],
  }, (k) => {
    const O = k.punto("O", [-5.2, -2.8]); const T = [[-3.1, -2.2], [-1.3, -2.6], [-2.4, -0.4]];
    const Ti = T.map((p) => [2 * p[0] - O[0], 2 * p[1] - O[1]]);
    const dato = triangoloDato(k, T); immagini(k, Ti);
    const w = finestre(3);
    const rette = T.map((p, i) => { const n = `ray${i}`; k.traccia(n, O, oltre(O, Ti[i], 0.7), w[i]); return n; });
    k.archetto("arcKa", T[0], Ti[0], 12);
    k.archetto("arcKb", T[1], Ti[1], 10, [0.12, 0.5]); k.archetto("arcKc", T[2], Ti[2], 10, [0.52, 0.9]);
    const lati = chiudi(k, "L", Ti);
    k.compare("Ap", 0.9); k.compare("Bp", 0.5); k.compare("Cp", 0.9);
    k.passo("A", "B", "C", ...dato, "O");
    k.passo(...rette);
    k.passo("arcKa", "Ap");
    k.passo("arcKb", "arcKc", "Bp", "Cp");
    k.passo(...lati);
    k.risultato(...lati);
  });

  // ══ Il foglio ═════════════════════════════════════════════════════════════

  tavola("squadratura-foglio", {
    title: "Squadratura del foglio",
    tema: "La cornice di ogni tavola",
    subtitle: "Le diagonali trovano il centro del foglio; un arco di compasso segna sui quattro bracci i vertici della cornice.",
    coord: [-6.2, 6.2, -3.8, 3.8],
    proofTitle: "Quattro punti alla stessa distanza dal centro",
    proofCopy: "I quattro punti stanno sulle diagonali, tutti alla stessa distanza da O: sono i vertici di un rettangolo che ha le stesse diagonali del foglio. Per questo la cornice è sempre un rettangolo preciso, anche se il foglio non è tagliato in modo perfetto; se il foglio è regolare, i suoi lati sono paralleli ai bordi. I margini non sono identici: quelli sui lati corti vengono quasi una volta e mezza più larghi di quelli sui lati lunghi.",
    equality: "O1 = O2 = O3 = O4",
    steps: [
      ["Prima di iniziare", "Osserva il foglio", "Hai un foglio da disegno. Prima di ogni tavola si traccia la squadratura: una cornice con i lati paralleli ai bordi, che delimita lo spazio del disegno.", "Lavora con tratto leggero: le linee di costruzione si cancellano."],
      ["Passo 1 · Diagonali", "Trova il centro O", "Con il righello traccia le due diagonali del foglio, da un angolo a quello opposto: si incrociano nel centro O.", "Non serve tracciarle intere: basta la parte centrale e quella verso gli angoli."],
      ["Passo 2 · Compasso", "Segna quattro punti", "Punta in O con un’apertura un po’ più corta di mezza diagonale. Traccia quattro archetti che tagliano le diagonali vicino agli angoli: trovi i punti 1, 2, 3 e 4.", "Più l’apertura è grande, più i margini sono stretti."],
      ["Passo 3 · Righello", "Unisci i quattro punti", "Unisci 1 con 2, 2 con 3, 3 con 4 e 4 con 1: è la squadratura.", "Controlla con la squadra: i quattro angoli devono essere retti."],
    ],
  }, (k) => {
    const W = 5; const H = 3.5; const O = k.punto("O", [0, 0]);
    const F = [[-W, -H], [W, -H], [W, H], [-W, H]];
    F.forEach((p, i) => k.seg(`segBordo${"abcd"[i]}`, p, F[(i + 1) % 4]));
    const r = 5.35; const g = direzione(O, F[2]);
    const P = [g, 180 - g, 180 + g, 360 - g].map((a, i) => k.punto(`N${i + 1}`, polare(O, r, a), String(i + 1)));
    k.traccia("lineD1", F[0], F[2], [0.12, 0.5]); k.traccia("lineD2", F[1], F[3], [0.52, 0.9]);
    const w = finestre(4);
    const archetti = P.map((p, i) => { k.archetto(`arcK${i}`, O, p, 7, w[i]); k.compare(`N${i + 1}`, w[i][1]); return `arcK${i}`; });
    const lati = chiudi(k, "L", P);
    k.compare("O", 0.9);
    k.passo("segBordoa", "segBordob", "segBordoc", "segBordod");
    k.passo("lineD1", "lineD2", "O");
    k.passo(...archetti, "N1", "N2", "N3", "N4");
    k.passo(...lati);
    k.risultato(...lati);
  });

  window.GGB_ENCICLOPEDIA = { tavola, asse, perpendicolareIn, angoloRetto, chiudi, puntoMuto, comando, medio, sposta, modulo360, ruota, RAD };
})();
