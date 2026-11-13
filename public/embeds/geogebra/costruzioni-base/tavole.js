/*
 * Tavole di costruzione geometrica — serie 9–20 (MC-DIS-1-01).
 *
 * Ogni tavola è descritta con il piccolo vocabolario di `creaTavola` (punto, seg,
 * traccia, arco, archetto, angolo…): le coordinate sono calcolate qui, non scritte a mano.
 * Il motore in activity.js legge window.GGB_TAVOLE e le aggiunge alle tavole 3–8.
 *
 * Regole dei nomi (decidono colore e spessore in activity.js › styleObjects):
 *   arc… / circle…  → segno di compasso (arancione)
 *   line… / ray… / diam… → linea di costruzione sottile
 *   seg…            → segmento dato o misura
 *   draw…           → tratto finale a righello (nero, spesso)
 * Attenzione: in GeoGebra un nome con iniziale minuscola e coordinate è un vettore, non un punto.
 * Per questo i punti hanno sempre l’iniziale maiuscola (anche quelli di servizio: HC…, HS…, HE…, HQ…).
 * Come aggiungere una tavola: skill «tavole-geogebra».
 */
(() => {
  "use strict";

  const RAD = Math.PI / 180;
  const num = (v) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(4);
  const xy = (p) => `(${num(p[0])},${num(p[1])})`;
  const polare = (c, r, gradi) => [c[0] + r * Math.cos(gradi * RAD), c[1] + r * Math.sin(gradi * RAD)];
  const distanza = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  const direzione = (da, a) => Math.atan2(a[1] - da[1], a[0] - da[0]) / RAD;
  const oltre = (a, b, extra) => {
    const d = distanza(a, b);
    return [b[0] + ((b[0] - a[0]) / d) * extra, b[1] + ((b[1] - a[1]) / d) * extra];
  };

  function creaTavola(meta, costruisci) {
    const t = {
      commands: [], helpers: [], groups: [], labels: [], result: [],
      anim: {}, appearAt: {}, captions: {}, lineLabels: {}, angles: [], texts: [], dashed: [],
      ...meta,
    };

    const k = {
      /** Punto fisso. `etichetta` sostituisce il nome (es. "1" per N1). */
      punto(nome, p, etichetta) {
        t.commands.push(`${nome}=${xy(p)}`);
        t.labels.push(nome);
        if (etichetta) t.captions[nome] = etichetta;
        return p;
      },
      /** Segmento statico (compare tutto insieme). */
      seg(nome, a, b, etichetta) {
        t.commands.push(`${nome}=Segment(${xy(a)},${xy(b)})`);
        if (etichetta) t.lineLabels[nome] = etichetta;
      },
      /** Segmento tracciato progressivamente da a verso b, nella finestra [da, a] del passo. */
      traccia(nome, a, b, finestra, etichetta) {
        const param = `t${nome}`;
        t.commands.push(
          `${param}=0`,
          `HQ${nome}=(${num(a[0])}+${param}*(${num(b[0] - a[0])}),${num(a[1])}+${param}*(${num(b[1] - a[1])}))`,
          `${nome}=Segment(${xy(a)},HQ${nome})`,
        );
        t.helpers.push(param, `HQ${nome}`);
        t.anim[nome] = { param, from: finestra ? finestra[0] : 0.12, to: finestra ? finestra[1] : 1 };
        if (etichetta) t.lineLabels[nome] = etichetta;
      },
      /** Arco di compasso tracciato in senso antiorario: centro, raggio, angolo iniziale, ampiezza (gradi). */
      arco(nome, centro, raggio, inizio, ampiezza, finestra) {
        const param = `t${nome}`;
        t.commands.push(
          `HC${nome}=${xy(centro)}`,
          `HS${nome}=${xy(polare(centro, raggio, inizio))}`,
          `${param}=0`,
          `HE${nome}=Rotate(HS${nome},${num(Math.min(ampiezza, 359.9))}°*${param},HC${nome})`,
          `${nome}=CircularArc(HC${nome},HS${nome},HE${nome})`,
        );
        t.helpers.push(`HC${nome}`, `HS${nome}`, param, `HE${nome}`);
        t.anim[nome] = { param, from: finestra ? finestra[0] : 0.12, to: finestra ? finestra[1] : 1 };
      },
      /** Archetto di compasso centrato in `centro` che passa per `per`, ampio ±mezza gradi. */
      archetto(nome, centro, per, mezza, finestra) {
        const m = mezza || 14;
        k.arco(nome, centro, distanza(centro, per), direzione(centro, per) - m, 2 * m, finestra);
      },
      /** Arco statico (per ripassare il risultato): da `inizio` a `fine` gradi, antiorario. */
      arcoFisso(nome, centro, raggio, inizio, fine) {
        t.commands.push(`${nome}=CircularArc(${xy(centro)},${xy(polare(centro, raggio, inizio))},${xy(polare(centro, raggio, fine))})`);
      },
      /** Circonferenza data (statica). */
      cerchio(nome, centro, raggio) {
        t.commands.push(`${nome}=Circle(${xy(centro)},${num(raggio)})`);
      },
      /** Angolo a–vertice–b in senso antiorario, con ampiezza mostrata. */
      angolo(nome, a, vertice, b) {
        t.commands.push(`${nome}=Angle(${xy(a)},${xy(vertice)},${xy(b)})`);
        t.angles.push(nome);
      },
      /** Settore colorato con l’ampiezza scritta dentro (es. "30°"): vertice, raggio, da/a in gradi. */
      settore(nome, vertice, raggio, da, a, testo) {
        const dove = polare(vertice, raggio * 0.66, (da + a) / 2);
        t.commands.push(
          `${nome}=CircularSector(${xy(vertice)},${xy(polare(vertice, raggio, da))},${xy(polare(vertice, raggio, a))})`,
          `T${nome}=Text("${testo}",${xy([dove[0] - 0.24, dove[1] - 0.13])})`,
        );
        t.angles.push(nome);
        t.texts.push(`T${nome}`);
        return [nome, `T${nome}`];
      },
      /** Momento del passo (0–1) in cui un oggetto compare. */
      compare(nome, quando) { t.appearAt[nome] = quando; },
      tratteggia(nome) { t.dashed.push(nome); },
      passo(...nomi) { t.groups.push(nomi); },
      risultato(...nomi) { t.result.push(...nomi); },
    };

    costruisci(k, t);
    return t;
  }

  /** Divide il passo in n finestre consecutive tra `da` e `a`. */
  const finestre = (n, da = 0.12, a = 0.94) =>
    Array.from({ length: n }, (_, i) => [da + ((a - da) * i) / n, da + ((a - da) * (i + 1)) / n]);

  const TAVOLE = {};

  // ── 9 · Asse di un segmento ────────────────────────────────────────────────
  TAVOLE["asse-segmento"] = creaTavola({
    title: "Asse di un segmento",
    eyebrow: "Costruzione 9 · Punto medio e angolo retto",
    subtitle: "Due archi con la stessa apertura trovano il punto medio di AB e la retta perpendicolare che ci passa.",
    filename: "MC-DIS-1-01_asse-segmento.ggb",
    coord: [-5, 5, -3.9, 3.9],
    proofTitle: "Due punti equidistanti da A e da B",
    proofCopy: "Il punto 1 dista da A quanto da B, perché i due archi hanno la stessa apertura. Lo stesso vale per il punto 2. Tutti i punti equidistanti da A e da B stanno sull’asse del segmento: la retta che passa per 1 e 2 è quindi perpendicolare ad AB e lo taglia nel punto medio.",
    equality: "AM = MB · asse ⟂ AB",
    steps: [
      ["Prima di iniziare", "Osserva il segmento AB", "Hai un segmento AB. Vuoi trovare il suo punto medio e la retta che lo taglia a metà formando angoli retti: si chiama asse del segmento.", "Non serve misurare: basta il compasso."],
      ["Passo 1 · Arco da A", "Punta in A e traccia un arco", "Apri il compasso più della metà di AB. Punta in A e traccia un arco ampio, che passi sopra e sotto il segmento.", "Se l’apertura è troppo piccola, i due archi non si incontreranno."],
      ["Passo 2 · Arco da B", "Ripeti da B con la stessa apertura", "Senza toccare l’apertura, punta in B e traccia un secondo arco. I due archi si incontrano in due punti: 1 e 2.", "1 e 2 sono alla stessa distanza da A e da B."],
      ["Passo 3 · Righello", "Unisci 1 e 2", "Traccia la retta che passa per 1 e 2. Incontra AB nel punto medio M e forma quattro angoli retti.", "Controlla con il righello: AM e MB devono essere uguali."],
    ],
  }, (k) => {
    const A = k.punto("A", [-3, 0]);
    const B = k.punto("B", [3, 0]);
    const r = 4.2;
    const h = Math.sqrt(r * r - 9);
    k.seg("segAB", A, B);
    k.arco("arcA", A, r, -58, 116);
    k.arco("arcB", B, r, 122, 116);
    const N1 = k.punto("N1", [0, h], "1");
    const N2 = k.punto("N2", [0, -h], "2");
    k.traccia("drawAsse", [0, h + 0.75], [0, -h - 0.75]);
    const M = k.punto("M", [0, 0]);
    k.angolo("rightAngle", B, M, N1);
    k.compare("N1", 0.25); k.compare("N2", 0.9);
    k.compare("M", 0.6); k.compare("rightAngle", 0.95);
    k.passo("A", "B", "segAB");
    k.passo("arcA");
    k.passo("arcB", "N1", "N2");
    k.passo("drawAsse", "M", "rightAngle");
    k.risultato("drawAsse");
    void N2;
  });

  // ── 10 · Perpendicolare in un estremo ──────────────────────────────────────
  TAVOLE["perpendicolare-estremo"] = creaTavola({
    title: "Perpendicolare in un estremo del segmento",
    eyebrow: "Costruzione 10 · Una sola apertura",
    subtitle: "Con una sola apertura del compasso costruisci un angolo retto nell’estremo A, senza prolungare il segmento.",
    filename: "MC-DIS-1-01_perpendicolare-estremo.ggb",
    coord: [-4.6, 4.6, -3, 3.3],
    proofTitle: "60° più 30° fa 90°",
    proofCopy: "I triangoli A-1-2 e A-2-3 hanno tutti i lati uguali all’apertura del compasso: sono equilateri. La direzione A2 forma quindi 60° con il segmento, e la direzione A3 ne forma 120°. Il punto 4 è equidistante da 2 e da 3, e lo è anche A: perciò la retta A4 divide a metà l’angolo di 60° compreso tra A2 e A3. In totale: 60° + 30° = 90°.",
    equality: "60° + 30° = 90°",
    steps: [
      ["Prima di iniziare", "Osserva il segmento AB", "Vuoi tracciare la perpendicolare ad AB proprio nell’estremo A, senza prolungare il segmento oltre A.", "Succede spesso quando A è vicino al bordo del foglio."],
      ["Passo 1 · Arco da A", "Trova il punto 1", "Punta il compasso in A con un’apertura a piacere e traccia un arco ampio. L’arco incontra il segmento nel punto 1.", "Da qui in poi l’apertura non cambia più."],
      ["Passo 2 · Arco da 1", "Trova il punto 2", "Punta in 1 e, con la stessa apertura, taglia l’arco nel punto 2.", "A, 1 e 2 formano un triangolo equilatero: l’angolo in A è di 60°."],
      ["Passo 3 · Arco da 2", "Trova il punto 3", "Punta in 2 e taglia ancora l’arco: trovi il punto 3.", "Altri 60°: sei arrivato a 120° dal segmento."],
      ["Passo 4 · Due archetti", "Trova il punto 4", "Punta in 2 e poi in 3, sempre con la stessa apertura, e traccia due archetti che si incrociano sopra l’arco, nel punto 4.", "Il punto 4 è alla stessa distanza da 2 e da 3."],
      ["Passo 5 · Righello", "Unisci A con 4", "Traccia la retta che passa per A e per 4: è la perpendicolare ad AB nell’estremo A.", "Controlla con la squadra: l’angolo in A deve essere di 90°."],
    ],
  }, (k) => {
    const A = k.punto("A", [-2.6, -2.2]);
    const B = k.punto("B", [3.6, -2.2]);
    const r = 2.3;
    k.seg("segAB", A, B);
    k.arco("arcA", A, r, -8, 148);
    const N1 = k.punto("N1", polare(A, r, 0), "1");
    const N2 = k.punto("N2", polare(A, r, 60), "2");
    const N3 = k.punto("N3", polare(A, r, 120), "3");
    const N4 = k.punto("N4", [A[0], A[1] + r * Math.sqrt(3)], "4");
    k.archetto("arcN1", N1, N2);
    k.archetto("arcN2", N2, N3);
    k.archetto("arcK2", N2, N4, 14, [0.12, 0.5]);
    k.archetto("arcK3", N3, N4, 14, [0.52, 0.9]);
    k.traccia("drawPerp", A, [A[0], A[1] + 5.1]);
    k.angolo("rightAngle", B, A, N4);
    k.compare("N1", 0.25); k.compare("N2", 0.6); k.compare("N3", 0.6); k.compare("N4", 0.85);
    k.compare("rightAngle", 0.95);
    k.passo("A", "B", "segAB");
    k.passo("arcA", "N1");
    k.passo("arcN1", "N2");
    k.passo("arcN2", "N3");
    k.passo("arcK2", "arcK3", "N4");
    k.passo("drawPerp", "rightAngle");
    k.risultato("drawPerp");
  });

  // ── 11 · Parallela per un punto ────────────────────────────────────────────
  TAVOLE["parallela-per-punto"] = creaTavola({
    title: "Parallela a una retta per un punto",
    eyebrow: "Costruzione 11 · Il parallelogramma nascosto",
    subtitle: "Due aperture del compasso bastano per ricopiare la direzione della retta r nel punto P.",
    filename: "MC-DIS-1-01_parallela-per-punto.ggb",
    coord: [-4.7, 5.7, -2.8, 3.3],
    proofTitle: "Hai costruito un parallelogramma",
    proofCopy: "Guarda il quadrilatero con vertici 2, 1, 3 e P. I lati 2–1 e P–3 sono uguali: sono entrambi lunghi quanto la prima apertura del compasso. Anche i lati 2–P e 1–3 sono uguali: è la seconda apertura. Un quadrilatero con i lati opposti uguali è un parallelogramma, e i suoi lati opposti sono paralleli: la retta che passa per P e 3 è parallela a r.",
    equality: "2–1 = P–3 · 2–P = 1–3",
    steps: [
      ["Prima di iniziare", "Osserva la retta r e il punto P", "Il punto P è fuori dalla retta r. Vuoi tracciare la retta che passa per P e non incontra mai r: la parallela.", "Due rette parallele restano sempre alla stessa distanza."],
      ["Passo 1 · Arco da P", "Trova il punto 1", "Punta il compasso in P con un’apertura abbastanza grande da raggiungere la retta. Traccia un arco ampio: incontra r nel punto 1.", "Fai l’arco lungo: ti servirà ancora nel passo 3."],
      ["Passo 2 · Arco da 1", "Trova il punto 2", "Con la stessa apertura punta in 1 e traccia un arco che taglia la retta r nel punto 2, dalla parte di P.", "Osserva: questo arco passa anche per P."],
      ["Passo 3 · Distanza 2–P", "Trova il punto 3", "Apri il compasso quanto la distanza tra 2 e P. Punta in 1 e taglia il primo arco dalla stessa parte di P rispetto alla retta r, lontano dal punto 2: trovi il punto 3.", "Stai ricopiando la distanza 2–P da un’altra parte."],
      ["Passo 4 · Righello", "Unisci P con 3", "Traccia la retta che passa per P e per 3: è la parallela a r.", "Verifica: misura la distanza tra le due rette in due punti diversi."],
    ],
  }, (k) => {
    const yr = -1.5;
    const P = k.punto("P", [-1, 1.6]);
    const r = 3.6;
    const N1 = [P[0] + Math.sqrt(r * r - (P[1] - yr) ** 2), yr];
    const N2 = [N1[0] - r, yr];
    const N3 = [P[0] + r, P[1]];
    k.seg("lineR", [-4.9, yr], [5.9, yr], "r");
    k.arco("arcP", P, r, -74, 90);
    k.punto("N1", N1, "1");
    k.arco("arcN1", N1, r, 106, 86);
    k.punto("N2", N2, "2");
    k.seg("segN2P", N2, P);
    k.tratteggia("segN2P");
    k.archetto("arcM", N1, N3, 14, [0.35, 0.9]);
    k.punto("N3", N3, "3");
    k.traccia("drawPar", [-4.7, P[1]], [5.7, P[1]]);
    k.compare("N1", 0.3); k.compare("N2", 0.9); k.compare("N3", 0.72);
    k.passo("lineR", "P");
    k.passo("arcP", "N1");
    k.passo("arcN1", "N2");
    k.passo("segN2P", "arcM", "N3");
    k.passo("drawPar");
    k.risultato("drawPar");
  });

  // ── 12 · Angolo retto in tre parti ─────────────────────────────────────────
  TAVOLE["angolo-retto-tre-parti"] = creaTavola({
    title: "Angolo retto diviso in tre parti uguali",
    eyebrow: "Costruzione 12 · Tre angoli da 30°",
    subtitle: "Una sola apertura del compasso, riportata due volte, divide l’angolo retto in tre angoli uguali.",
    filename: "MC-DIS-1-01_angolo-retto-tre-parti.ggb",
    coord: [-3.8, 4.6, -3.1, 4.7],
    proofTitle: "Da 90° togli 60°",
    proofCopy: "Il triangolo O-1-3 ha i tre lati uguali all’apertura del compasso: è equilatero, quindi l’angolo tra r e la semiretta O3 è di 60°. Fino a s ne restano 90° − 60° = 30°. Allo stesso modo l’angolo tra s e la semiretta O4 è di 60°, e fino a r ne restano 30°. In mezzo rimane 90° − 30° − 30° = 30°.",
    equality: "30° + 30° + 30° = 90°",
    steps: [
      ["Prima di iniziare", "Osserva l’angolo retto", "Le semirette r e s partono da O e formano un angolo di 90°. Vuoi dividerlo in tre angoli uguali, da 30° ciascuno.", "Con riga e compasso la divisione in tre riesce solo per alcuni angoli speciali, come quello retto."],
      ["Passo 1 · Arco da O", "Segna 1 e 2", "Punta in O con un’apertura a piacere e traccia un arco che incontra la semiretta r nel punto 1 e la semiretta s nel punto 2.", "Tieni ferma questa apertura fino alla fine."],
      ["Passo 2 · Arco da 1", "Trova il punto 3", "Punta in 1 e, con la stessa apertura, taglia l’arco nel punto 3.", "Il triangolo O-1-3 è equilatero: l’angolo in O vale 60°."],
      ["Passo 3 · Arco da 2", "Trova il punto 4", "Punta in 2 e, sempre con la stessa apertura, taglia l’arco nel punto 4.", "Anche il triangolo O-2-4 è equilatero."],
      ["Passo 4 · Righello", "Traccia le due semirette", "Unisci O con 3 e O con 4, prolungando oltre l’arco. L’angolo retto è diviso in tre angoli di 30°.", "Controlla con il goniometro: 30°, 30°, 30°."],
    ],
  }, (k) => {
    const O = k.punto("O", [-2.8, -2.3]);
    const r = 4.6;
    k.seg("rayR", O, polare(O, 6.9, 0), "r");
    k.seg("rayS", O, polare(O, 6.6, 90), "s");
    k.arco("arcO", O, r, -6, 102);
    const N1 = k.punto("N1", polare(O, r, 0), "1");
    const N2 = k.punto("N2", polare(O, r, 90), "2");
    const N3 = k.punto("N3", polare(O, r, 60), "3");
    const N4 = k.punto("N4", polare(O, r, 30), "4");
    k.archetto("arcN1", N1, N3);
    k.archetto("arcN2", N2, N4);
    k.traccia("drawA", O, polare(O, 6.5, 60), [0.12, 0.5]);
    k.traccia("drawB", O, polare(O, 6.5, 30), [0.5, 0.88]);
    const settori = [
      ...k.settore("ang1", O, 1.9, 0, 30, "30°"),
      ...k.settore("ang2", O, 1.9, 30, 60, "30°"),
      ...k.settore("ang3", O, 1.9, 60, 90, "30°"),
    ];
    k.compare("N1", 0.2); k.compare("N2", 0.95); k.compare("N3", 0.6); k.compare("N4", 0.6);
    settori.forEach((nome) => k.compare(nome, 0.94));
    k.passo("O", "rayR", "rayS");
    k.passo("arcO", "N1", "N2");
    k.passo("arcN1", "N3");
    k.passo("arcN2", "N4");
    k.passo("drawA", "drawB", ...settori);
    k.risultato("drawA", "drawB");
  });

  // ── 13 · Triangolo equilatero inscritto ────────────────────────────────────
  TAVOLE["triangolo-inscritto"] = creaTavola({
    title: "Triangolo equilatero inscritto in una circonferenza",
    eyebrow: "Costruzione 13 · Circonferenza divisa in tre parti",
    subtitle: "Un diametro e un solo arco, aperto quanto il raggio, dividono la circonferenza in tre parti uguali.",
    filename: "MC-DIS-1-01_triangolo-inscritto.ggb",
    coord: [-4.6, 4.6, -3.9, 3.9],
    proofTitle: "Tre archi da 120°",
    proofCopy: "Il triangolo O-1-B ha tutti i lati uguali al raggio: è equilatero, quindi l’angolo in O è di 60°. Lo stesso vale per O-1-C. Tra B e C ci sono 60° + 60° = 120°. Tra A e B ne restano 180° − 60° = 120°, e così tra A e C. Tre archi uguali danno tre lati uguali.",
    equality: "AB = BC = CA",
    steps: [
      ["Prima di iniziare", "Osserva la circonferenza", "Hai una circonferenza con centro O. Vuoi disegnarci dentro un triangolo equilatero con i tre vertici sulla circonferenza.", "«Inscritto» significa proprio questo: tutti i vertici toccano la circonferenza."],
      ["Passo 1 · Diametro", "Traccia il diametro verticale", "Traccia il diametro verticale. In alto incontra la circonferenza nel vertice A, in basso nel punto 1.", "Un diametro passa sempre per il centro O."],
      ["Passo 2 · Arco da 1", "Trova B e C", "Apri il compasso quanto il raggio. Punta in 1 e traccia un arco che taglia la circonferenza in due punti: B e C.", "L’arco passa per il centro O: è il segno che l’apertura è giusta."],
      ["Passo 3 · Righello", "Unisci A, B e C", "Unisci i tre punti. Il triangolo equilatero inscritto è completo.", "Misura i tre lati: devono essere uguali."],
    ],
  }, (k) => {
    const O = k.punto("O", [0, 0]);
    const R = 3.1;
    const A = k.punto("A", polare(O, R, 90));
    const N1 = k.punto("N1", polare(O, R, 270), "1");
    const B = k.punto("B", polare(O, R, 210));
    const C = k.punto("C", polare(O, R, 330));
    k.cerchio("circleO", O, R);
    k.traccia("diamV", polare(O, R + 0.45, 90), polare(O, R + 0.45, 270));
    k.arco("arcN1", N1, R, 18, 144);
    const w = finestre(3);
    k.traccia("drawAB", A, B, w[0]);
    k.traccia("drawBC", B, C, w[1]);
    k.traccia("drawCA", C, A, w[2]);
    k.compare("A", 0.2); k.compare("N1", 0.95); k.compare("C", 0.25); k.compare("B", 0.93);
    k.passo("O", "circleO");
    k.passo("diamV", "A", "N1");
    k.passo("arcN1", "B", "C");
    k.passo("drawAB", "drawBC", "drawCA");
    k.risultato("drawAB", "drawBC", "drawCA");
  });

  // ── 14 · Quadrato inscritto ────────────────────────────────────────────────
  TAVOLE["quadrato-inscritto"] = creaTavola({
    title: "Quadrato inscritto in una circonferenza",
    eyebrow: "Costruzione 14 · Circonferenza divisa in quattro parti",
    subtitle: "Due diametri perpendicolari dividono la circonferenza in quattro parti uguali: i loro estremi sono i vertici del quadrato.",
    filename: "MC-DIS-1-01_quadrato-inscritto.ggb",
    coord: [-5.6, 5.6, -4.9, 4.9],
    proofTitle: "Due diametri perpendicolari",
    proofCopy: "I due diametri dividono l’angolo giro in quattro angoli di 90°. I quattro archi AB, BC, CD e DA sono quindi uguali, e ad archi uguali corrispondono lati uguali. Le diagonali AC e BD sono due diametri: sono uguali, perpendicolari e si tagliano a metà, proprio come le diagonali di un quadrato.",
    equality: "AB = BC = CD = DA",
    steps: [
      ["Prima di iniziare", "Osserva la circonferenza", "Hai una circonferenza con centro O. Vuoi disegnarci dentro un quadrato con i quattro vertici sulla circonferenza.", "Ti servono due diametri perpendicolari tra loro."],
      ["Passo 1 · Diametro", "Traccia il diametro orizzontale", "Traccia il diametro orizzontale: incontra la circonferenza nei punti A e C.", "A e C sono due vertici opposti del quadrato."],
      ["Passo 2 · Archetti da A", "Punta in A", "Apri il compasso ben più del raggio, quasi quanto il diametro. Punta in A e traccia due archetti, uno sopra e uno sotto la circonferenza.", "Con un’apertura più piccola del raggio gli archetti non si incontrerebbero."],
      ["Passo 3 · Archetti da C", "Ripeti da C", "Con la stessa apertura punta in C e incrocia i due archetti. Trovi i punti 1 e 2.", "È la costruzione dell’asse del segmento AC (Costruzione 9)."],
      ["Passo 4 · Secondo diametro", "Unisci 1 e 2", "Traccia la retta che passa per 1 e 2. Passa per O e taglia la circonferenza in B e in D.", "I due diametri sono perpendicolari."],
      ["Passo 5 · Righello", "Unisci A, B, C e D", "Unisci i quattro punti in ordine. Il quadrato inscritto è completo.", "Controlla: quattro lati uguali e quattro angoli retti."],
    ],
  }, (k) => {
    const O = k.punto("O", [0, 0]);
    const R = 3;
    const r = 5.2;
    const h = Math.sqrt(r * r - R * R);
    const A = k.punto("A", [-R, 0]);
    const B = k.punto("B", [0, R]);
    const C = k.punto("C", [R, 0]);
    const D = k.punto("D", [0, -R]);
    const N1 = k.punto("N1", [0, h], "1");
    const N2 = k.punto("N2", [0, -h], "2");
    k.cerchio("circleO", O, R);
    k.traccia("diamH", [-R - 0.5, 0], [R + 0.5, 0]);
    k.archetto("arcA1", A, N1, 11, [0.12, 0.5]);
    k.archetto("arcA2", A, N2, 11, [0.55, 0.95]);
    k.archetto("arcC1", C, N1, 11, [0.12, 0.5]);
    k.archetto("arcC2", C, N2, 11, [0.55, 0.95]);
    k.traccia("diamV", [0, h + 0.3], [0, -h - 0.3]);
    const w = finestre(4);
    k.traccia("drawAB", A, B, w[0]);
    k.traccia("drawBC", B, C, w[1]);
    k.traccia("drawCD", C, D, w[2]);
    k.traccia("drawDA", D, A, w[3]);
    k.compare("A", 0.2); k.compare("C", 0.95); k.compare("N1", 0.4); k.compare("N2", 0.85);
    k.compare("B", 0.3); k.compare("D", 0.85);
    k.passo("O", "circleO");
    k.passo("diamH", "A", "C");
    k.passo("arcA1", "arcA2");
    k.passo("arcC1", "arcC2", "N1", "N2");
    k.passo("diamV", "B", "D");
    k.passo("drawAB", "drawBC", "drawCD", "drawDA");
    k.risultato("drawAB", "drawBC", "drawCD", "drawDA");
  });

  // ── 15 · Ottagono inscritto ────────────────────────────────────────────────
  TAVOLE["ottagono-inscritto"] = creaTavola({
    title: "Ottagono regolare inscritto in una circonferenza",
    eyebrow: "Costruzione 15 · Raddoppio dei lati",
    subtitle: "Parti dal quadrato inscritto e dividi a metà ogni arco: i lati passano da quattro a otto.",
    filename: "MC-DIS-1-01_ottagono-inscritto.ggb",
    coord: [-4.8, 4.8, -4, 4],
    proofTitle: "Ogni angolo di 90° diviso a metà",
    proofCopy: "Il punto 1 è equidistante da A e da C, e lo è anche il centro O. La retta che passa per 1 e per O è quindi la bisettrice dell’angolo AOC: divide a metà l’angolo di 90° e l’arco AC. Lo stesso vale per la retta che passa per 2 e per O. Gli otto archi sono tutti di 45°, e ad archi uguali corrispondono lati uguali.",
    equality: "8 archi da 45° = 360°",
    steps: [
      ["Prima di iniziare", "Parti dal quadrato inscritto", "Hai una circonferenza con il quadrato inscritto della Costruzione 14: qui i suoi vertici si chiamano A, C, E e G. Vuoi raddoppiare i lati e ottenere un ottagono regolare.", "I quattro vertici del quadrato sono già quattro vertici dell’ottagono."],
      ["Passo 1 · Archetti da A e da C", "Trova il punto 1", "Punta in A e poi in C con la stessa apertura, più grande della metà del lato AC, e incrocia due archetti fuori dalla circonferenza: trovi il punto 1.", "Il punto 1 è alla stessa distanza da A e da C."],
      ["Passo 2 · Archetti da C e da E", "Trova il punto 2", "Con la stessa apertura punta in C e poi in E: trovi il punto 2.", "Bastano due punti: al resto pensa il centro O."],
      ["Passo 3 · Retta per 1 e O", "Trova B e F", "Traccia la retta che passa per 1 e per O e prolungala fino all’altra parte della circonferenza. Taglia la circonferenza in B e in F.", "B sta a metà dell’arco AC, F a metà dell’arco opposto."],
      ["Passo 4 · Retta per 2 e O", "Trova D e H", "Traccia la retta che passa per 2 e per O. Taglia la circonferenza in D e in H.", "Ora sulla circonferenza ci sono otto punti."],
      ["Passo 5 · Righello", "Unisci gli otto punti", "Unisci in ordine A, B, C, D, E, F, G e H. L’ottagono regolare è completo.", "Con lo stesso metodo dall’esagono ottieni il dodecagono."],
    ],
  }, (k) => {
    const O = k.punto("O", [0, 0]);
    const R = 3;
    const r = 3.3;
    const nomi = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const V = nomi.map((nome, i) => k.punto(nome, polare(O, R, 45 * i)));
    const lato = distanza(V[0], V[2]);
    const d = lato / 2 + Math.sqrt(r * r - (lato / 2) ** 2);
    const N1 = k.punto("N1", polare(O, d, 45), "1");
    const N2 = k.punto("N2", polare(O, d, 135), "2");
    k.cerchio("circleO", O, R);
    [0, 2, 4, 6].forEach((i, n) => k.seg(`segQ${n + 1}`, V[i], V[(i + 2) % 8]));
    k.archetto("arcA1", V[0], N1, 12, [0.12, 0.5]);
    k.archetto("arcC1", V[2], N1, 12, [0.55, 0.95]);
    k.archetto("arcC2", V[2], N2, 12, [0.12, 0.5]);
    k.archetto("arcE2", V[4], N2, 12, [0.55, 0.95]);
    k.traccia("lineK1", N1, polare(O, R + 0.6, 225));
    k.traccia("lineK2", N2, polare(O, R + 0.6, 315));
    const w = finestre(8);
    const lati = V.map((p, i) => {
      const nome = `draw${nomi[i]}${nomi[(i + 1) % 8]}`;
      k.traccia(nome, p, V[(i + 1) % 8], w[i]);
      return nome;
    });
    k.compare("N1", 0.85); k.compare("N2", 0.85);
    k.compare("B", 0.4); k.compare("F", 0.9); k.compare("D", 0.4); k.compare("H", 0.9);
    k.passo("O", "circleO", "A", "C", "E", "G", "segQ1", "segQ2", "segQ3", "segQ4");
    k.passo("arcA1", "arcC1", "N1");
    k.passo("arcC2", "arcE2", "N2");
    k.passo("lineK1", "B", "F");
    k.passo("lineK2", "D", "H");
    k.passo(...lati);
    k.risultato(...lati);
  });

  // ── 16 · Ettagono inscritto ────────────────────────────────────────────────
  TAVOLE["ettagono-inscritto"] = creaTavola({
    title: "Ettagono inscritto in una circonferenza",
    eyebrow: "Costruzione 16 · Circonferenza divisa in sette parti",
    subtitle: "Un arco aperto quanto il raggio ti regala la misura del lato: poi la riporti lungo la circonferenza.",
    filename: "MC-DIS-1-01_ettagono-inscritto.ggb",
    coord: [-4.8, 4.8, -4, 4],
    proofTitle: "Una costruzione approssimata, ma molto precisa",
    proofCopy: "Il lato esatto dell’ettagono regolare è lungo circa 0,868 volte il raggio. La distanza A4 è la metà del lato del triangolo equilatero inscritto e vale circa 0,866 volte il raggio. La differenza è di circa due millesimi del raggio: con la matita non si vede. Per questo l’ultimo lato chiude con uno scarto piccolissimo.",
    equality: "A4 ≈ lato dell’ettagono",
    steps: [
      ["Prima di iniziare", "Osserva la circonferenza", "Hai una circonferenza con centro O. Vuoi disegnarci dentro un ettagono, il poligono con sette lati.", "Con riga e compasso l’ettagono regolare esatto non si può costruire: questa è un’ottima approssimazione."],
      ["Passo 1 · Diametro", "Traccia il diametro orizzontale", "Traccia il diametro orizzontale: incontra la circonferenza nei punti 1 e 2.", "Il punto 1 sarà il prossimo centro del compasso."],
      ["Passo 2 · Arco da 1", "Trova A e 3", "Apri il compasso quanto il raggio. Punta in 1 e traccia un arco che taglia la circonferenza in A e in 3.", "L’arco passa per il centro O."],
      ["Passo 3 · Misura del lato", "Unisci A con 3", "Traccia il segmento da A a 3: incontra il diametro nel punto 4. La distanza da A a 4 è il lato dell’ettagono.", "A4 è la metà del segmento A3."],
      ["Passo 4 · Apertura A4", "Trova B e G", "Apri il compasso quanto A4. Punta in A e taglia la circonferenza da una parte e dall’altra: trovi B e G.", "Da qui in poi non cambiare più apertura."],
      ["Passo 5 · Riporta il lato", "Trova C, D, F ed E", "Punta in B e trova C, poi in C e trova D. Dall’altra parte: punta in G e trova F, poi in F e trova E.", "Lavora sui due lati a partire da A: così il piccolo errore non si accumula tutto da una parte."],
      ["Passo 6 · Righello", "Unisci i sette punti", "Unisci in ordine A, B, C, D, E, F e G. L’ettagono è completo.", "Su una circonferenza di raggio 4 cm l’ultimo lato, DE, viene circa mezzo millimetro più lungo degli altri: è normale."],
    ],
  }, (k) => {
    const O = k.punto("O", [0, 0]);
    const R = 3;
    const N1 = k.punto("N1", [-R, 0], "1");
    k.punto("N2", [R, 0], "2");
    const A = k.punto("A", polare(O, R, 120));
    const N3 = k.punto("N3", polare(O, R, 240), "3");
    const N4 = k.punto("N4", [-R / 2, 0], "4");
    const lato = distanza(A, N4);
    const passo = (2 * Math.asin(lato / (2 * R))) / RAD;
    const B = k.punto("B", polare(O, R, 120 - passo));
    const C = k.punto("C", polare(O, R, 120 - 2 * passo));
    const D = k.punto("D", polare(O, R, 120 - 3 * passo));
    const G = k.punto("G", polare(O, R, 120 + passo));
    const F = k.punto("F", polare(O, R, 120 + 2 * passo));
    const E = k.punto("E", polare(O, R, 120 + 3 * passo));
    k.cerchio("circleO", O, R);
    k.traccia("diamH", [-R - 0.5, 0], [R + 0.5, 0]);
    k.arco("arcN1", N1, R, -76, 152);
    k.traccia("lineK", oltre(N3, A, 0.4), oltre(A, N3, 0.4), [0.12, 0.7]);
    k.seg("segLato", A, N4);
    k.archetto("arcAB", A, B, 11, [0.12, 0.5]);
    k.archetto("arcAG", A, G, 11, [0.55, 0.95]);
    const wa = finestre(4);
    k.archetto("arcBC", B, C, 11, wa[0]);
    k.archetto("arcCD", C, D, 11, wa[1]);
    k.archetto("arcGF", G, F, 11, wa[2]);
    k.archetto("arcFE", F, E, 11, wa[3]);
    const giro = [["A", A], ["B", B], ["C", C], ["D", D], ["E", E], ["F", F], ["G", G]];
    const w = finestre(7);
    const lati = giro.map(([nome, p], i) => {
      const [nome2, q] = giro[(i + 1) % 7];
      const n = `draw${nome}${nome2}`;
      k.traccia(n, p, q, w[i]);
      return n;
    });
    k.compare("N1", 0.2); k.compare("N2", 0.95); k.compare("N3", 0.25); k.compare("A", 0.92);
    k.compare("N4", 0.72); k.compare("segLato", 0.85);
    k.compare("B", 0.45); k.compare("G", 0.9);
    k.compare("C", wa[0][1]); k.compare("D", wa[1][1]); k.compare("F", wa[2][1]); k.compare("E", wa[3][1]);
    k.passo("O", "circleO");
    k.passo("diamH", "N1", "N2");
    k.passo("arcN1", "A", "N3");
    k.passo("lineK", "N4", "segLato");
    k.passo("arcAB", "arcAG", "B", "G");
    k.passo("arcBC", "arcCD", "arcGF", "arcFE", "C", "D", "F", "E");
    k.passo(...lati);
    k.risultato(...lati);
  });

  // ── 17 · Triangolo dati i tre lati ─────────────────────────────────────────
  TAVOLE["triangolo-tre-lati"] = creaTavola({
    title: "Triangolo scaleno dati i tre lati",
    eyebrow: "Costruzione 17 · Tre misure, un solo triangolo",
    subtitle: "Tracci un lato con il righello e trovi il terzo vertice incrociando due archetti con le altre due misure.",
    filename: "MC-DIS-1-01_triangolo-tre-lati.ggb",
    coord: [-6.4, 6.4, -3.2, 6.1],
    proofTitle: "Quando la costruzione riesce",
    proofCopy: "Il punto C è l’unico punto sopra la base che dista 6 cm da A e 7 cm da B. I due archetti si incontrano solo se ogni lato è più corto della somma degli altri due. Con 8, 3 e 4 cm, per esempio, il triangolo non si chiude: 3 + 4 fa 7, meno di 8.",
    equality: "AB = 8 cm · AC = 6 cm · BC = 7 cm",
    steps: [
      ["Prima di iniziare", "Osserva i tre lati", "Conosci le misure dei tre lati: 8 cm, 6 cm e 7 cm. Vuoi costruire il triangolo che li ha tutti e tre.", "Sono tre misure diverse: il triangolo sarà scaleno."],
      ["Passo 1 · Base", "Traccia la base AB", "Con il righello traccia il segmento AB lungo 8 cm: è il primo lato.", "Lascia spazio sopra: il triangolo crescerà verso l’alto."],
      ["Passo 2 · Arco da A", "Apri il compasso a 6 cm", "Prendi sul righello l’apertura di 6 cm. Punta in A e traccia un archetto sopra la base.", "Tutti i punti dell’archetto distano 6 cm da A."],
      ["Passo 3 · Arco da B", "Apri il compasso a 7 cm", "Ora prendi l’apertura di 7 cm. Punta in B e traccia un archetto che incrocia il primo: il punto d’incontro è C.", "C dista 6 cm da A e 7 cm da B."],
      ["Passo 4 · Righello", "Unisci C con A e con B", "Traccia i lati AC e BC. Il triangolo scaleno è completo.", "Misura i tre lati per controllare."],
    ],
  }, (k) => {
    const A = k.punto("A", [-4, -2.4]);
    const B = k.punto("B", [4, -2.4]);
    const cx = (36 - 49 + 64) / 16;
    const C = k.punto("C", [A[0] + cx, A[1] + Math.sqrt(36 - cx * cx)]);
    k.seg("segDatA", [-6.6, 5.6], [1.4, 5.6], "8 cm");
    k.seg("segDatB", [-6.6, 4.95], [-0.6, 4.95], "6 cm");
    k.seg("segDatC", [-6.6, 4.3], [0.4, 4.3], "7 cm");
    k.traccia("drawAB", A, B);
    k.archetto("arcA", A, C, 13);
    k.archetto("arcB", B, C, 13);
    k.traccia("drawAC", A, C, [0.12, 0.5]);
    k.traccia("drawBC", B, C, [0.52, 0.9]);
    k.compare("A", 0.12); k.compare("B", 0.95); k.compare("C", 0.6);
    k.passo("segDatA", "segDatB", "segDatC");
    k.passo("drawAB", "A", "B");
    k.passo("arcA");
    k.passo("arcB", "C");
    k.passo("drawAC", "drawBC");
    k.risultato("drawAB", "drawAC", "drawBC");
  });

  // ── 18 · Triangolo rettangolo (cateto e ipotenusa) ─────────────────────────
  TAVOLE["triangolo-rettangolo"] = creaTavola({
    title: "Triangolo rettangolo dati un cateto e l’ipotenusa",
    eyebrow: "Costruzione 18 · Perpendicolare e un arco",
    subtitle: "Alzi la perpendicolare in un estremo del cateto e la tagli con un arco che ha l’apertura uguale all’ipotenusa.",
    filename: "MC-DIS-1-01_triangolo-rettangolo.ggb",
    coord: [-4.6, 7.2, -3.3, 5],
    proofTitle: "Il teorema di Pitagora conferma",
    proofCopy: "L’angolo in A è retto perché AC sta sulla perpendicolare. L’ipotenusa misura 7,5 cm perché C è sull’arco con centro B. Per il teorema di Pitagora (lo studierai in seconda: la somma dei quadrati dei cateti è uguale al quadrato dell’ipotenusa) il secondo cateto vale 4,5 cm: infatti 6² + 4,5² = 36 + 20,25 = 56,25, che è proprio 7,5².",
    equality: "6² + 4,5² = 7,5²",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Conosci un cateto, lungo 6 cm, e l’ipotenusa, lunga 7,5 cm. Vuoi costruire il triangolo rettangolo.", "I cateti sono i due lati che formano l’angolo retto; l’ipotenusa è il lato più lungo, di fronte all’angolo retto."],
      ["Passo 1 · Cateto", "Traccia il cateto AB", "Con il righello traccia il segmento AB lungo 6 cm.", "L’angolo retto sarà in A."],
      ["Passo 2 · Perpendicolare", "Alza la perpendicolare in A", "Costruisci la perpendicolare ad AB nell’estremo A, come nella Costruzione 10: un arco da A, quattro archetti con la stessa apertura e la semiretta che sale da A.", "Del secondo cateto non conosci ancora la lunghezza: per ora è una semiretta."],
      ["Passo 3 · Arco da B", "Apri il compasso a 7,5 cm", "Prendi sul righello l’apertura di 7,5 cm. Punta in B e traccia un archetto che taglia la perpendicolare: il punto d’incontro è C.", "C dista da B quanto l’ipotenusa."],
      ["Passo 4 · Righello", "Unisci C con B", "Ripassa il cateto AC e traccia l’ipotenusa BC. Il triangolo rettangolo è completo.", "Misura AC: deve venire 4,5 cm."],
    ],
  }, (k) => {
    const A = k.punto("A", [-3, -2.4]);
    const B = k.punto("B", [3, -2.4]);
    const C = k.punto("C", [-3, -2.4 + 4.5]);
    const r = 1.7;
    const N1 = polare(A, r, 0);
    const N2 = polare(A, r, 60);
    const N3 = polare(A, r, 120);
    const N4 = [A[0], A[1] + r * Math.sqrt(3)];
    k.seg("segDatA", [0, 4.5], [6, 4.5], "cateto 6 cm");
    k.seg("segDatB", [-0.7, 3.9], [6.8, 3.9], "ipotenusa 7,5 cm");
    k.traccia("drawAB", A, B);
    k.arco("arcA", A, r, -8, 148, [0.05, 0.3]);
    k.archetto("arcN1", N1, N2, 14, [0.3, 0.42]);
    k.archetto("arcN2", N2, N3, 14, [0.42, 0.54]);
    k.archetto("arcK2", N2, N4, 14, [0.54, 0.66]);
    k.archetto("arcK3", N3, N4, 14, [0.66, 0.78]);
    k.traccia("linePerp", A, [A[0], A[1] + 6.2], [0.8, 1]);
    k.archetto("arcB", B, C, 9);
    k.traccia("drawAC", A, C, [0.12, 0.45]);
    k.traccia("drawBC", C, B, [0.5, 0.9]);
    k.angolo("rightAngle", B, A, C);
    k.compare("A", 0.12); k.compare("B", 0.95); k.compare("C", 0.6); k.compare("rightAngle", 0.94);
    k.passo("segDatA", "segDatB");
    k.passo("drawAB", "A", "B");
    k.passo("arcA", "arcN1", "arcN2", "arcK2", "arcK3", "linePerp");
    k.passo("arcB", "C");
    k.passo("drawAC", "drawBC", "rightAngle");
    k.risultato("drawAB", "drawAC", "drawBC");
  });

  // ── 19 · Ovale dato l'asse maggiore ────────────────────────────────────────
  TAVOLE["ovale-asse-maggiore"] = creaTavola({
    title: "Ovale dato l’asse maggiore",
    eyebrow: "Costruzione 19 · Quattro archi raccordati",
    subtitle: "Due circonferenze uguali e due archi più grandi si uniscono senza spigoli in una curva chiusa.",
    filename: "MC-DIS-1-01_ovale-asse-maggiore.ggb",
    coord: [-5.6, 5.6, -4.1, 4.1],
    proofTitle: "Perché la curva non fa spigoli",
    proofCopy: "Nel punto 5 si incontrano un arco con centro 1 e un arco con centro 3. I punti 3, 1 e 5 sono allineati: quando i due centri e il punto di contatto stanno sulla stessa retta, i due archi hanno lì la stessa direzione e si raccordano senza spigolo. Lo stesso accade nei punti 6, 7 e 8.",
    equality: "4 archi · 4 punti di raccordo",
    steps: [
      ["Prima di iniziare", "Osserva l’asse maggiore", "Il segmento AB è l’asse maggiore, cioè la lunghezza dell’ovale. Vuoi costruire una curva chiusa fatta di quattro archi di circonferenza.", "L’ovale non è un’ellisse: è fatto solo di archi di compasso."],
      ["Passo 1 · Tre parti uguali", "Dividi AB in tre parti", "Dividi il segmento AB in tre parti uguali con il metodo delle parallele (Costruzione 3). Trovi i punti 1 e 2.", "I tre tratti A–1, 1–2 e 2–B sono lunghi uguali."],
      ["Passo 2 · Due circonferenze", "Punta in 1 e poi in 2", "Apri il compasso quanto la distanza tra 1 e 2. Traccia una circonferenza con centro 1 e una con centro 2: si incontrano nei punti 3 e 4.", "La prima passa per A, la seconda per B."],
      ["Passo 3 · Rette da 3 e da 4", "Trova 5, 6, 7 e 8", "Dal punto 3 traccia due rette che passano per i centri 1 e 2 e prolungale fino alle circonferenze: trovi 5 e 6. Fai lo stesso dal punto 4: trovi 7 e 8.", "In questi quattro punti gli archi si raccorderanno."],
      ["Passo 4 · Archi grandi", "Punta in 3 e poi in 4", "Apri il compasso da 3 fino a 5. Punta in 3 e traccia l’arco da 5 a 6. Con la stessa apertura punta in 4 e traccia l’arco da 7 a 8.", "Questa apertura è il doppio della precedente."],
      ["Passo 5 · Ripassa", "Ripassa il contorno", "Ripassa i due archi grandi e i due archi piccoli che li uniscono, passando per A e per B. L’ovale è completo.", "Lascia sottili le linee di costruzione: raccontano come hai lavorato."],
    ],
  }, (k) => {
    const A = k.punto("A", [-4.5, 0]);
    const B = k.punto("B", [4.5, 0]);
    const r = 3;
    const N1 = k.punto("N1", [-1.5, 0], "1");
    const N2 = k.punto("N2", [1.5, 0], "2");
    const h = r * Math.sqrt(3) / 2;
    const N3 = k.punto("N3", [0, h], "3");
    const N4 = k.punto("N4", [0, -h], "4");
    const N5 = k.punto("N5", polare(N1, r, 240), "5");
    const N6 = k.punto("N6", polare(N2, r, 300), "6");
    const N7 = k.punto("N7", polare(N1, r, 120), "7");
    const N8 = k.punto("N8", polare(N2, r, 60), "8");
    k.seg("segAB", A, B);
    k.arco("circleK1", N1, r, 0, 360, [0.12, 0.5]);
    k.arco("circleK2", N2, r, 180, 360, [0.5, 0.88]);
    const w = finestre(4);
    k.traccia("lineK1", N3, oltre(N3, N5, 0.5), w[0]);
    k.traccia("lineK2", N3, oltre(N3, N6, 0.5), w[1]);
    k.traccia("lineK3", N4, oltre(N4, N7, 0.5), w[2]);
    k.traccia("lineK4", N4, oltre(N4, N8, 0.5), w[3]);
    k.arco("arcBig1", N3, 2 * r, 240, 60, [0.12, 0.5]);
    k.arco("arcBig2", N4, 2 * r, 60, 60, [0.52, 0.9]);
    k.arcoFisso("ovale1", N1, r, 120, 240);
    k.arcoFisso("ovale2", N3, 2 * r, 240, 300);
    k.arcoFisso("ovale3", N2, r, 300, 420);
    k.arcoFisso("ovale4", N4, 2 * r, 60, 120);
    k.compare("N3", 0.9); k.compare("N4", 0.9);
    k.compare("N5", w[0][1]); k.compare("N6", w[1][1]); k.compare("N7", w[2][1]); k.compare("N8", w[3][1]);
    k.compare("ovale1", 0.2); k.compare("ovale2", 0.4); k.compare("ovale3", 0.6); k.compare("ovale4", 0.8);
    k.passo("A", "B", "segAB");
    k.passo("N1", "N2");
    k.passo("circleK1", "circleK2", "N3", "N4");
    k.passo("lineK1", "lineK2", "lineK3", "lineK4", "N5", "N6", "N7", "N8");
    k.passo("arcBig1", "arcBig2");
    k.passo("ovale1", "ovale2", "ovale3", "ovale4");
    k.risultato("ovale1", "ovale2", "ovale3", "ovale4");
  });

  // ── 20 · Spirale a due centri ──────────────────────────────────────────────
  TAVOLE["spirale-due-centri"] = creaTavola({
    title: "Spirale a due centri",
    eyebrow: "Costruzione 20 · Semicirconferenze che crescono",
    subtitle: "Alterni due centri sulla stessa retta: a ogni mezzo giro il raggio cresce e la curva si allarga.",
    filename: "MC-DIS-1-01_spirale-due-centri.ggb",
    coord: [-5.4, 4.8, -3.9, 4.6],
    proofTitle: "Perché la curva è continua",
    proofCopy: "Ogni semicirconferenza finisce sulla retta r, proprio dove comincia la successiva. I due centri e il punto di contatto stanno sulla stessa retta, quindi la curva prosegue senza spigoli. A ogni mezzo giro il raggio aumenta di una lunghezza AB: dopo un giro completo la spirale si è allargata di 2 × AB, cioè di un passo.",
    equality: "passo = 2 × AB",
    steps: [
      ["Prima di iniziare", "Osserva la retta r", "Sulla retta r ci sono due punti, A e B: saranno i due centri della spirale. Il passo, cioè la distanza tra un giro e il successivo, è il doppio di AB.", "Per un passo di 1,6 cm segna A e B a 0,8 cm di distanza."],
      ["Passo 1 · Centro A", "Prima semicirconferenza", "Punta in A, apri fino a B e traccia mezza circonferenza sopra la retta. Arrivi nel punto 1.", "Ogni tratto è una semicirconferenza: parte dalla retta e torna sulla retta."],
      ["Passo 2 · Centro B", "Seconda semicirconferenza", "Punta in B, apri fino a 1 e traccia mezza circonferenza sotto la retta. Arrivi nel punto 2.", "Il raggio è raddoppiato."],
      ["Passo 3 · Centro A", "Terza semicirconferenza", "Torna in A, apri fino a 2 e traccia mezza circonferenza sopra la retta. Arrivi nel punto 3.", "Ogni volta il raggio cresce di una lunghezza AB."],
      ["Passo 4 · Continua", "Alterna i due centri", "Continua così: centro B fino al punto 4, poi centro A fino al punto 5. Puoi proseguire finché c’è spazio sul foglio.", "Sopra la retta il centro è sempre A, sotto è sempre B."],
    ],
  }, (k) => {
    const u = 0.8;
    const A = k.punto("A", [-u / 2, 0]);
    const B = k.punto("B", [u / 2, 0]);
    k.seg("lineR", [-5.6, 0], [5, 0], "r");
    const fine = [];
    for (let i = 1; i <= 5; i += 1) {
      const centro = i % 2 === 1 ? A : B;
      const inizio = i % 2 === 1 ? 0 : 180;
      const finestra = i === 4 ? [0.12, 0.5] : i === 5 ? [0.52, 0.94] : undefined;
      k.arco(`arcS${i}`, centro, u * i, inizio, 180, finestra);
      k.arcoFisso(`spira${i}`, centro, u * i, inizio, inizio + 180);
      k.punto(`N${i}`, polare(centro, u * i, inizio + 180), String(i));
      k.compare(`N${i}`, finestra ? finestra[1] : 0.97);
      k.compare(`spira${i}`, 0.97);
      fine.push(`spira${i}`);
    }
    k.passo("lineR", "A", "B");
    k.passo("arcS1", "N1");
    k.passo("arcS2", "N2");
    k.passo("arcS3", "N3");
    k.passo("arcS4", "arcS5", "N4", "N5", ...fine);
    k.risultato(...fine);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Serie 21–33
  // ══════════════════════════════════════════════════════════════════════════

  // ── 21 · Esagono dato il lato ──────────────────────────────────────────────
  TAVOLE["esagono-dato-lato"] = creaTavola({
    title: "Esagono regolare dato il lato",
    eyebrow: "Costruzione 21 · Il lato è uguale al raggio",
    subtitle: "Due archi trovano il centro; la circonferenza con lo stesso raggio porta tutti i vertici.",
    filename: "MC-DIS-1-01_esagono-dato-lato.ggb",
    coord: [-5.6, 5.6, -3.6, 4.6],
    proofTitle: "Nell’esagono il lato è uguale al raggio",
    proofCopy: "Il punto 1 dista da A e da B quanto è lungo AB: il triangolo A-B-1 è equilatero. Nell’esagono regolare il centro forma con ogni lato un triangolo equilatero, quindi 1 è proprio il centro e la circonferenza di raggio AB passa per tutti i vertici. Ogni archetto riporta la stessa misura: sei lati uguali.",
    equality: "AB = BC = CD = DE = EF = FA",
    steps: [
      ["Prima di iniziare", "Osserva il lato AB", "Hai il lato AB dell’esagono. Vuoi costruire l’esagono regolare che ha proprio quel lato.", "Questa volta non parti dalla circonferenza: la devi trovare."],
      ["Passo 1 · Archi da A e da B", "Trova il punto 1", "Apri il compasso quanto AB. Punta in A e poi in B e traccia due archi sopra il segmento: si incontrano nel punto 1.", "Non cambiare più apertura fino alla fine."],
      ["Passo 2 · Circonferenza", "Punta in 1", "Con la stessa apertura punta in 1 e traccia la circonferenza: passa per A e per B.", "Il punto 1 è il centro dell’esagono."],
      ["Passo 3 · Vertici C e F", "Riporta il lato dai due estremi", "Punta in B e taglia la circonferenza nel punto C. Punta in A e taglia la circonferenza nel punto F.", "C sta dalla parte di B, F dalla parte di A."],
      ["Passo 4 · Vertici D ed E", "Riporta ancora il lato", "Punta in C e trova D. Punta in F e trova E.", "D ed E sono i due vertici più in alto."],
      ["Passo 5 · Righello", "Unisci i sei vertici", "Unisci in ordine A, B, C, D, E e F. L’esagono regolare è completo.", "Controlla: il lato DE deve essere lungo quanto AB."],
    ],
  }, (k) => {
    const s = 3;
    const A = k.punto("A", [-s / 2, -2.6]);
    const B = k.punto("B", [s / 2, -2.6]);
    const O = k.punto("N1", [0, -2.6 + (s * Math.sqrt(3)) / 2], "1");
    const C = k.punto("C", polare(O, s, 0));
    const D = k.punto("D", polare(O, s, 60));
    const E = k.punto("E", polare(O, s, 120));
    const F = k.punto("F", polare(O, s, 180));
    k.seg("segAB", A, B);
    k.archetto("arcA1", A, O, 16, [0.12, 0.5]);
    k.archetto("arcB1", B, O, 16, [0.52, 0.9]);
    k.arco("circleK", O, s, 240, 360);
    k.archetto("arcBC", B, C, 12, [0.12, 0.5]);
    k.archetto("arcAF", A, F, 12, [0.52, 0.9]);
    k.archetto("arcCD", C, D, 12, [0.12, 0.5]);
    k.archetto("arcFE", F, E, 12, [0.52, 0.9]);
    const giro = [["A", A], ["B", B], ["C", C], ["D", D], ["E", E], ["F", F]];
    const w = finestre(6);
    const lati = giro.map(([n, p], i) => { const [n2, q] = giro[(i + 1) % 6]; k.traccia(`draw${n}${n2}`, p, q, w[i]); return `draw${n}${n2}`; });
    k.compare("N1", 0.85); k.compare("C", 0.4); k.compare("F", 0.8); k.compare("D", 0.4); k.compare("E", 0.8);
    k.passo("A", "B", "segAB");
    k.passo("arcA1", "arcB1", "N1");
    k.passo("circleK");
    k.passo("arcBC", "arcAF", "C", "F");
    k.passo("arcCD", "arcFE", "D", "E");
    k.passo(...lati);
    k.risultato(...lati);
  });

  // ── 22 · Pentagono dato il lato ────────────────────────────────────────────
  TAVOLE["pentagono-dato-lato"] = creaTavola({
    title: "Pentagono regolare dato il lato",
    eyebrow: "Costruzione 22 · La diagonale dal lato",
    subtitle: "Dal lato ricavi la diagonale del pentagono: con queste due misure trovi tutti i vertici.",
    filename: "MC-DIS-1-01_pentagono-dato-lato.ggb",
    coord: [-4.8, 5.6, -3.3, 4.2],
    proofTitle: "La diagonale e il numero aureo",
    proofCopy: "Nel pentagono regolare la diagonale è lunga circa 1,618 volte il lato: è il numero aureo. La costruzione con i punti O, 1 e 2 produce proprio questa lunghezza: A2 è la diagonale. I vertici C e D distano da A quanto una diagonale; C dista da B quanto un lato, e D sta sull’asse. Il vertice E dista un lato sia da A sia da D.",
    equality: "A2 = diagonale ≈ 1,618 × AB",
    steps: [
      ["Prima di iniziare", "Osserva il lato AB", "Hai il lato AB, tracciato su una retta r. Vuoi costruire il pentagono regolare che ha proprio quel lato.", "Ti serviranno due misure: il lato e la diagonale."],
      ["Passo 1 · Asse di AB", "Trova il punto medio O", "Costruisci l’asse del segmento AB (Costruzione 9): trovi il punto medio O e la retta verticale su cui starà il vertice più alto.", "L’asse di AB è anche l’asse di simmetria del pentagono."],
      ["Passo 2 · Perpendicolare in B", "Alza la perpendicolare in B", "Costruisci la perpendicolare ad AB nell’estremo B (Costruzione 10).", "Su questa retta riporterai la lunghezza del lato."],
      ["Passo 3 · Arco da B", "Trova il punto 1", "Punta in B con apertura BA e traccia un arco ampio: incontra la perpendicolare nel punto 1. Prolunga l’arco oltre il punto 1, dalla parte opposta ad A.", "L’arco lungo ti servirà ancora per trovare C."],
      ["Passo 4 · Arco da O", "Trova il punto 2", "Punta in O con apertura O1 e traccia un arco fino alla retta r, oltre B: trovi il punto 2.", "La distanza da A a 2 è la diagonale del pentagono."],
      ["Passo 5 · Apertura A2", "Trova C e D", "Punta in A con apertura A2 e traccia un arco: incontra l’arco del passo 3 nel vertice C e l’asse nel vertice D.", "D è il vertice più alto."],
      ["Passo 6 · Archetti da A e da D", "Trova E", "Apri il compasso quanto AB. Punta in A e poi in D: i due archetti si incrociano nel vertice E, dalla parte opposta a C.", "E è il simmetrico di C rispetto all’asse."],
      ["Passo 7 · Righello", "Unisci i cinque vertici", "Unisci in ordine A, B, C, D ed E. Il pentagono regolare è completo.", "Misura i cinque lati: devono essere uguali."],
    ],
  }, (k) => {
    const s = 3.4;
    const y0 = -2.5;
    const A = k.punto("A", [-s / 2, y0]);
    const B = k.punto("B", [s / 2, y0]);
    const O = k.punto("O", [0, y0]);
    const N1 = k.punto("N1", [s / 2, y0 + s], "1");
    const rO = distanza(O, N1);
    const N2 = k.punto("N2", [rO, y0], "2");
    const diag = distanza(A, N2);
    const D = k.punto("D", [0, y0 + Math.sqrt(diag * diag - (s / 2) ** 2)]);
    const C = k.punto("C", polare(B, s, 72));
    const E = k.punto("E", polare(A, s, 108));
    k.seg("lineR", [-4.9, y0], [5.8, y0], "r");
    k.seg("segAB", A, B);
    k.traccia("lineAsse", [0, y0 - 0.6], [0, D[1] + 0.7]);
    k.traccia("linePerpB", B, [B[0], y0 + s + 1.1]);
    k.arco("arcB", B, s, 52, 50);
    k.arco("arcO", O, rO, -6, direzione(O, N1) + 12);
    k.arco("arcA", A, diag, -4, 84);
    k.archetto("arcAE", A, E, 13, [0.12, 0.5]);
    k.archetto("arcDE", D, E, 13, [0.52, 0.9]);
    const giro = [["A", A], ["B", B], ["C", C], ["D", D], ["E", E]];
    const w = finestre(5);
    const lati = giro.map(([n, p], i) => { const [n2, q] = giro[(i + 1) % 5]; k.traccia(`draw${n}${n2}`, p, q, w[i]); return `draw${n}${n2}`; });
    k.compare("O", 0.5); k.compare("N1", 0.75); k.compare("N2", 0.2); k.compare("C", 0.55); k.compare("D", 0.92); k.compare("E", 0.85);
    k.passo("A", "B", "segAB", "lineR");
    k.passo("lineAsse", "O");
    k.passo("linePerpB");
    k.passo("arcB", "N1");
    k.passo("arcO", "N2");
    k.passo("arcA", "C", "D");
    k.passo("arcAE", "arcDE", "E");
    k.passo(...lati);
    k.risultato(...lati);
  });

  // ── 23 · Ottagono dato il lato ─────────────────────────────────────────────
  TAVOLE["ottagono-dato-lato"] = creaTavola({
    title: "Ottagono regolare dato il lato",
    eyebrow: "Costruzione 23 · Il centro sull’asse",
    subtitle: "Due archi sull’asse del lato trovano il centro della circonferenza; poi riporti il lato lungo la circonferenza fino a trovare tutti i vertici.",
    filename: "MC-DIS-1-01_ottagono-dato-lato.ggb",
    coord: [-5.6, 5.6, -3.7, 3.7],
    proofTitle: "Un angolo di 45° al centro",
    proofCopy: "Il triangolo A-1-2 è la metà di un quadrato, quindi nel triangolo A-2-O l’angolo in 2 è di 135°. Questo triangolo è isoscele, perché 2A e 2O sono la stessa apertura: gli altri due angoli valgono 22,5° ciascuno. L’angolo in O tra l’asse e OA è di 22,5°; dall’altra parte c’è lo stesso angolo verso B. In tutto AOB misura 45°, un ottavo di giro: AB è il lato dell’ottagono.",
    equality: "360° : 8 = 45°",
    steps: [
      ["Prima di iniziare", "Osserva il lato AB", "Hai il lato AB dell’ottagono. Vuoi costruire l’ottagono regolare che ha proprio quel lato.", "Devi trovare il centro della circonferenza che passa per tutti i vertici."],
      ["Passo 1 · Asse di AB", "Trova il punto 1", "Costruisci l’asse del segmento AB (Costruzione 9). Chiama 1 il punto medio di AB.", "Il centro dell’ottagono sta su questa retta."],
      ["Passo 2 · Semicirconferenza da 1", "Trova il punto 2", "Punta in 1 con apertura 1A e traccia una semicirconferenza sopra AB: incontra l’asse nel punto 2.", "La distanza da 1 a 2 è metà del lato."],
      ["Passo 3 · Arco da 2", "Trova il centro O", "Punta in 2 con apertura 2A e traccia un arco verso l’alto: incontra l’asse nel punto O.", "O è il centro dell’ottagono."],
      ["Passo 4 · Circonferenza", "Punta in O", "Punta in O con apertura OA e traccia la circonferenza: passa per A e per B.", "Tutti i vertici staranno su questa circonferenza."],
      ["Passo 5 · Riporta il lato", "Trova gli altri sei vertici", "Apri il compasso quanto AB. Partendo da B trova C, poi D e poi E. Partendo da A trova H, poi G e poi F.", "Lavora dai due lati: l’ultimo tratto, EF, deve venire lungo quanto gli altri."],
      ["Passo 6 · Righello", "Unisci gli otto vertici", "Unisci in ordine A, B, C, D, E, F, G e H. L’ottagono regolare è completo.", "Controlla che i lati opposti siano paralleli."],
    ],
  }, (k) => {
    const s = 2.4;
    const y0 = -2.9;
    const A = k.punto("A", [-s / 2, y0]);
    const B = k.punto("B", [s / 2, y0]);
    const N1 = k.punto("N1", [0, y0], "1");
    const N2 = k.punto("N2", [0, y0 + s / 2], "2");
    const O = k.punto("O", [0, y0 + s / 2 + distanza(N2, A)]);
    const R = distanza(O, A);
    const a0 = direzione(O, A);
    const nomi = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const V = nomi.map((n, i) => (i < 2 ? (i === 0 ? A : B) : k.punto(n, polare(O, R, a0 + 45 * i))));
    k.seg("segAB", A, B);
    k.traccia("lineAsse", [0, y0 - 0.5], [0, O[1] + R + 0.3]);
    k.arco("arcN1", N1, s / 2, 0, 180);
    k.archetto("arcN2", N2, O, 24);
    k.arco("circleO", O, R, a0, 360);
    const wa = finestre(6);
    k.archetto("arcBC", B, V[2], 10, wa[0]); k.archetto("arcCD", V[2], V[3], 10, wa[1]); k.archetto("arcDE", V[3], V[4], 10, wa[2]);
    k.archetto("arcAH", A, V[7], 10, wa[3]); k.archetto("arcHG", V[7], V[6], 10, wa[4]); k.archetto("arcGF", V[6], V[5], 10, wa[5]);
    const w = finestre(8);
    const lati = V.map((p, i) => { const n = `draw${nomi[i]}${nomi[(i + 1) % 8]}`; k.traccia(n, p, V[(i + 1) % 8], w[i]); return n; });
    k.compare("N1", 0.5); k.compare("N2", 0.55); k.compare("O", 0.6);
    k.compare("C", wa[0][1]); k.compare("D", wa[1][1]); k.compare("E", wa[2][1]); k.compare("H", wa[3][1]); k.compare("G", wa[4][1]); k.compare("F", wa[5][1]);
    k.passo("A", "B", "segAB");
    k.passo("lineAsse", "N1");
    k.passo("arcN1", "N2");
    k.passo("arcN2", "O");
    k.passo("circleO");
    k.passo("arcBC", "arcCD", "arcDE", "arcAH", "arcHG", "arcGF", "C", "D", "E", "F", "G", "H");
    k.passo(...lati);
    k.risultato(...lati);
  });

  // ── 24 · Decagono inscritto ────────────────────────────────────────────────
  TAVOLE["decagono-inscritto"] = creaTavola({
    title: "Decagono regolare inscritto in una circonferenza",
    eyebrow: "Costruzione 24 · Raddoppio dei lati del pentagono",
    subtitle: "Da ogni vertice del pentagono una retta passa per il centro e trova un nuovo vertice dalla parte opposta.",
    filename: "MC-DIS-1-01_decagono-inscritto.ggb",
    coord: [-4.8, 4.8, -3.8, 3.8],
    proofTitle: "Ogni arco di 72° diviso a metà",
    proofCopy: "Il pentagono regolare è simmetrico rispetto alla retta che unisce un vertice al centro. Quella retta arriva quindi esattamente a metà dell’arco opposto. Ogni arco di 72° viene diviso in due archi di 36°: sulla circonferenza ci sono dieci archi uguali, e ad archi uguali corrispondono lati uguali.",
    equality: "10 archi da 36° = 360°",
    steps: [
      ["Prima di iniziare", "Parti dal pentagono inscritto", "Hai una circonferenza con il pentagono regolare inscritto ABCDE (Costruzione 8). Vuoi raddoppiare i lati e ottenere un decagono.", "Il pentagono ha un numero dispari di lati: di fronte a ogni vertice c’è un lato, non un altro vertice."],
      ["Passo 1 · Retta da A", "Trova il punto 1", "Traccia la retta che parte da A, passa per il centro O e arriva dall’altra parte della circonferenza: trovi il punto 1.", "Il punto 1 sta a metà dell’arco CD."],
      ["Passo 2 · Le altre rette", "Trova 2, 3, 4 e 5", "Fai lo stesso da B, da C, da D e da E: trovi i punti 2, 3, 4 e 5.", "Ogni retta è un diametro."],
      ["Passo 3 · Righello", "Unisci i dieci punti", "Unisci i dieci punti uno dopo l’altro, girando lungo la circonferenza. Il decagono regolare è completo.", "Vertici del pentagono e punti nuovi si alternano."],
    ],
  }, (k) => {
    const O = k.punto("O", [0, 0]);
    const R = 3.2;
    const nomi = ["A", "B", "C", "D", "E"];
    const V = nomi.map((n, i) => k.punto(n, polare(O, R, 90 + 72 * i)));
    const W = nomi.map((n, i) => k.punto(`N${i + 1}`, polare(O, R, 270 + 72 * i), String(i + 1)));
    k.cerchio("circleO", O, R);
    const pent = V.map((p, i) => { k.seg(`segP${i + 1}`, p, V[(i + 1) % 5]); return `segP${i + 1}`; });
    k.traccia("lineK1", V[0], oltre(V[0], W[0], 0.35));
    const wl = finestre(4);
    [1, 2, 3, 4].forEach((i) => k.traccia(`lineK${i + 1}`, V[i], oltre(V[i], W[i], 0.35), wl[i - 1]));
    const giro = [];
    for (let i = 0; i < 5; i += 1) { giro.push(V[i]); giro.push(W[(i + 3) % 5]); }
    const w = finestre(10);
    const lati = giro.map((p, i) => { k.traccia(`drawL${i}`, p, giro[(i + 1) % 10], w[i]); return `drawL${i}`; });
    k.compare("N1", 0.9);
    [2, 3, 4, 5].forEach((n, i) => k.compare(`N${n}`, wl[i][1]));
    k.passo("O", "circleO", ...nomi, ...pent);
    k.passo("lineK1", "N1");
    k.passo("lineK2", "lineK3", "lineK4", "lineK5", "N2", "N3", "N4", "N5");
    k.passo(...lati);
    k.risultato(...lati);
  });

  // ── 25 · Metodo generale di divisione ──────────────────────────────────────
  TAVOLE["metodo-generale"] = creaTavola({
    title: "Metodo generale di divisione della circonferenza",
    eyebrow: "Costruzione 25 · Un metodo per qualsiasi poligono",
    subtitle: "Dividi il diametro in tante parti quanti sono i lati: due punti esterni fanno il resto. Qui i lati sono 7.",
    filename: "MC-DIS-1-01_metodo-generale.ggb",
    coord: [-5.6, 5.6, -3.5, 3.5],
    proofTitle: "Un metodo pratico, non esatto",
    proofCopy: "Questo metodo è una regola pratica. Per il triangolo, il quadrato e l’esagono dà il risultato esatto; per gli altri poligoni lascia un piccolo errore. Nell’ettagono i lati vengono giusti entro l’1 per cento circa, tranne quello in basso, DE, che viene circa il 2 per cento più lungo: su un lato di 3 cm è poco più di mezzo millimetro. Il vantaggio è che la procedura resta la stessa per qualsiasi numero di lati.",
    equality: "7 parti sul diametro → 7 lati",
    steps: [
      ["Prima di iniziare", "Osserva la circonferenza", "Hai una circonferenza con centro O. Vuoi dividerla in 7 parti uguali con un metodo che vale per qualsiasi numero di lati.", "Con 9 parti otterresti un ennagono, con 11 un endecagono."],
      ["Passo 1 · Diametro verticale", "Segna A e S", "Traccia il diametro verticale: in alto incontra la circonferenza nel punto A, in basso nel punto S.", "A sarà il primo vertice del poligono."],
      ["Passo 2 · Sette parti", "Dividi il diametro AS", "Dividi il diametro AS in 7 parti uguali con il metodo delle parallele (Costruzione 3). Numera i punti da 1 a 6 partendo da A.", "Tante parti quanti sono i lati del poligono."],
      ["Passo 3 · Punti T e U", "Prolunga il diametro orizzontale", "Traccia il diametro orizzontale e prolungalo da tutte e due le parti. Punta in S con apertura SA e traccia un arco: incontra i prolungamenti in T e in U.", "L’arco passa per A."],
      ["Passo 4 · Rette per il punto 2", "Trova B e G", "Da T traccia la retta che passa per il punto 2 e prolungala fino alla parte opposta della circonferenza: trovi B. Fai lo stesso da U: trovi G.", "Si usano solo i punti pari: 2, 4 e 6."],
      ["Passo 5 · Rette per 4 e per 6", "Trova C, F, D ed E", "Ripeti con il punto 4: da T trovi C, da U trovi F. Poi con il punto 6: da T trovi D, da U trovi E.", "Prolunga sempre fino alla parte più lontana della circonferenza."],
      ["Passo 6 · Righello", "Unisci i sette vertici", "Unisci in ordine A, B, C, D, E, F e G. L’ettagono è completo.", "Per un altro numero di lati cambia il numero di parti del passo 2; poi usi sempre i punti pari."],
    ],
  }, (k) => {
    const O = k.punto("O", [0, 0]);
    const R = 2.7;
    const n = 7;
    const A = k.punto("A", [0, R]);
    const S = k.punto("S", [0, -R]);
    const T = k.punto("T", [-R * Math.sqrt(3), 0]);
    const U = k.punto("U", [R * Math.sqrt(3), 0]);
    const P = [];
    for (let i = 1; i < n; i += 1) P[i] = k.punto(`N${i}`, [0, R - (2 * R * i) / n], String(i));
    const lontano = (da, per) => {
      const d = distanza(da, per); const u = [(per[0] - da[0]) / d, (per[1] - da[1]) / d];
      const b = da[0] * u[0] + da[1] * u[1]; const c = da[0] ** 2 + da[1] ** 2 - R * R;
      const s = -b + Math.sqrt(b * b - c);
      return [da[0] + s * u[0], da[1] + s * u[1]];
    };
    const B = k.punto("B", lontano(T, P[2])); const G = k.punto("G", lontano(U, P[2]));
    const C = k.punto("C", lontano(T, P[4])); const F = k.punto("F", lontano(U, P[4]));
    const D = k.punto("D", lontano(T, P[6])); const E = k.punto("E", lontano(U, P[6]));
    k.cerchio("circleO", O, R);
    k.traccia("diamV", [0, R + 0.4], [0, -R - 0.4]);
    k.traccia("diamH", [-5.4, 0], [5.4, 0], [0.12, 0.45]);
    k.arco("arcS", S, 2 * R, 24, 132, [0.45, 0.95]);
    k.traccia("lineTB", T, oltre(T, B, 0.35), [0.12, 0.5]); k.traccia("lineUG", U, oltre(U, G, 0.35), [0.52, 0.9]);
    const wl = finestre(4);
    k.traccia("lineTC", T, oltre(T, C, 0.35), wl[0]); k.traccia("lineUF", U, oltre(U, F, 0.35), wl[1]);
    k.traccia("lineTD", T, oltre(T, D, 0.35), wl[2]); k.traccia("lineUE", U, oltre(U, E, 0.35), wl[3]);
    const giro = [["A", A], ["B", B], ["C", C], ["D", D], ["E", E], ["F", F], ["G", G]];
    const w = finestre(7);
    const lati = giro.map(([nome, p], i) => { const [n2, q] = giro[(i + 1) % 7]; k.traccia(`draw${nome}${n2}`, p, q, w[i]); return `draw${nome}${n2}`; });
    k.compare("A", 0.2); k.compare("S", 0.95); k.compare("U", 0.55); k.compare("T", 0.93);
    k.compare("B", 0.5); k.compare("G", 0.9); k.compare("C", wl[0][1]); k.compare("F", wl[1][1]); k.compare("D", wl[2][1]); k.compare("E", wl[3][1]);
    k.passo("O", "circleO");
    k.passo("diamV", "A", "S");
    k.passo("N1", "N2", "N3", "N4", "N5", "N6");
    k.passo("diamH", "arcS", "T", "U");
    k.passo("lineTB", "lineUG", "B", "G");
    k.passo("lineTC", "lineUF", "lineTD", "lineUE", "C", "F", "D", "E");
    k.passo(...lati);
    k.risultato(...lati);
  });

  // ── 26 · Triangolo isoscele (base e lato) ──────────────────────────────────
  TAVOLE["isoscele-base-lato"] = creaTavola({
    title: "Triangolo isoscele dati la base e il lato",
    eyebrow: "Costruzione 26 · Due archetti uguali",
    subtitle: "Tracci la base e incroci due archetti con la stessa apertura, lunga quanto il lato.",
    filename: "MC-DIS-1-01_isoscele-base-lato.ggb",
    coord: [-10, 4.7, -3.8, 4.5],
    proofTitle: "Il vertice sta sull’asse della base",
    proofCopy: "Il punto C dista 7 cm da A e 7 cm da B: i due lati AC e BC sono uguali, quindi il triangolo è isoscele. Un punto alla stessa distanza da A e da B sta sull’asse del segmento AB: per questo C si trova esattamente sopra il punto medio della base.",
    equality: "AC = BC = 7 cm · AB = 6 cm",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Conosci la base, lunga 6 cm, e i due lati uguali, lunghi 7 cm ciascuno. Vuoi costruire il triangolo isoscele.", "Isoscele significa: due lati uguali."],
      ["Passo 1 · Base", "Traccia la base AB", "Con il righello traccia il segmento AB lungo 6 cm.", "Lascia spazio sopra: il triangolo è alto più di 6 cm."],
      ["Passo 2 · Arco da A", "Apri il compasso a 7 cm", "Prendi sul righello l’apertura di 7 cm. Punta in A e traccia un archetto sopra la base.", "Tieni ferma l’apertura per il passo successivo."],
      ["Passo 3 · Arco da B", "Ripeti da B", "Con la stessa apertura punta in B e traccia un archetto che incrocia il primo: il punto d’incontro è C.", "C dista 7 cm sia da A sia da B."],
      ["Passo 4 · Righello", "Unisci C con A e con B", "Traccia i lati AC e BC. Il triangolo isoscele è completo.", "Misura gli angoli alla base: devono essere uguali."],
    ],
  }, (k) => {
    const A = k.punto("A", [-3, -3.1]);
    const B = k.punto("B", [3, -3.1]);
    const C = k.punto("C", [0, -3.1 + Math.sqrt(49 - 9)]);
    k.seg("segDatA", [-9.6, 2.1], [-3.6, 2.1], "base 6 cm");
    k.seg("segDatB", [-9.6, 1.4], [-2.6, 1.4], "lato 7 cm");
    k.traccia("drawAB", A, B);
    k.archetto("arcA", A, C, 12);
    k.archetto("arcB", B, C, 12);
    k.traccia("drawAC", A, C, [0.12, 0.5]);
    k.traccia("drawBC", B, C, [0.52, 0.9]);
    k.compare("A", 0.12); k.compare("B", 0.95); k.compare("C", 0.6);
    k.passo("segDatA", "segDatB");
    k.passo("drawAB", "A", "B");
    k.passo("arcA");
    k.passo("arcB", "C");
    k.passo("drawAC", "drawBC");
    k.risultato("drawAB", "drawAC", "drawBC");
  });

  // ── 27 · Triangolo isoscele (altezza e lati) ───────────────────────────────
  TAVOLE["isoscele-altezza-lati"] = creaTavola({
    title: "Triangolo isoscele dati l’altezza e i lati",
    eyebrow: "Costruzione 27 · Prima l’altezza, poi la base",
    subtitle: "Alzi l’altezza su una retta, poi un solo arco dal vertice trova i due estremi della base.",
    filename: "MC-DIS-1-01_isoscele-altezza-lati.ggb",
    coord: [-8, 5, -3.4, 3.9],
    proofTitle: "L’altezza divide la base a metà",
    proofCopy: "Il punto A sta sulla perpendicolare a r nel punto H, quindi AH è l’altezza del triangolo. B e C distano entrambi 5 cm da A: i due lati sono uguali. I triangoli AHB e AHC sono rettangoli e hanno due lati uguali, quindi anche HB e HC sono uguali: H è il punto medio della base, che qui misura 6 cm.",
    equality: "AH = 4 cm · AB = AC = 5 cm",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Conosci l’altezza, lunga 4 cm, e i due lati uguali, lunghi 5 cm ciascuno. La base non la conosci: la troverai alla fine. Sulla retta r è segnato il punto H.", "L’altezza è il segmento che scende dal vertice e incontra la base ad angolo retto."],
      ["Passo 1 · Perpendicolare in H", "Alza la perpendicolare", "Costruisci la perpendicolare alla retta r nel punto H (Costruzione 1): un arco da H, due archetti che si incrociano e la retta verticale.", "Su questa retta starà l’altezza."],
      ["Passo 2 · Altezza", "Segna il vertice A", "Apri il compasso a 4 cm. Punta in H e taglia la perpendicolare: trovi il vertice A.", "HA è lungo quanto l’altezza."],
      ["Passo 3 · Arco da A", "Apri il compasso a 5 cm", "Prendi l’apertura di 5 cm. Punta in A e traccia un arco che taglia la retta r in due punti: B e C.", "B e C sono alla stessa distanza da H."],
      ["Passo 4 · Righello", "Unisci A con B e con C", "Traccia i lati AB e AC e ripassa la base BC. Il triangolo isoscele è completo.", "Misura la base: deve venire 6 cm."],
    ],
  }, (k) => {
    const y0 = -2.5;
    const H = k.punto("H", [0, y0]);
    const A = k.punto("A", [0, y0 + 4]);
    const B = k.punto("B", [-3, y0]);
    const C = k.punto("C", [3, y0]);
    const K1 = [-1.5, y0]; const K2 = [1.5, y0];
    const X = [0, y0 + Math.sqrt(2.4 * 2.4 - 1.5 * 1.5)];
    k.seg("lineR", [-8.2, y0], [5.2, y0], "r");
    k.seg("segDatA", [-7.6, 3.2], [-3.6, 3.2], "altezza 4 cm");
    k.seg("segDatB", [-7.6, 2.5], [-2.6, 2.5], "lato 5 cm");
    k.arco("arcH", H, 1.5, 0, 180, [0.05, 0.35]);
    k.archetto("arcK1", K1, X, 14, [0.35, 0.5]);
    k.archetto("arcK2", K2, X, 14, [0.5, 0.65]);
    k.traccia("linePerp", [0, y0], [0, y0 + 5.6], [0.7, 1]);
    k.archetto("arcHA", H, A, 9);
    k.arco("arcA", A, 5, direzione(A, B) - 8, direzione(A, C) - direzione(A, B) + 16);
    k.traccia("drawAB", A, B, [0.12, 0.4]);
    k.traccia("drawBC", B, C, [0.4, 0.68]);
    k.traccia("drawCA", C, A, [0.68, 0.94]);
    k.compare("A", 0.6); k.compare("B", 0.25); k.compare("C", 0.92);
    k.passo("lineR", "H", "segDatA", "segDatB");
    k.passo("arcH", "arcK1", "arcK2", "linePerp");
    k.passo("arcHA", "A");
    k.passo("arcA", "B", "C");
    k.passo("drawAB", "drawBC", "drawCA");
    k.risultato("drawAB", "drawBC", "drawCA");
  });

  // ── 28 · Triangolo rettangolo dati i cateti ────────────────────────────────
  TAVOLE["rettangolo-due-cateti"] = creaTavola({
    title: "Triangolo rettangolo dati i due cateti",
    eyebrow: "Costruzione 28 · Perpendicolare e misura",
    subtitle: "Tracci un cateto, alzi la perpendicolare in un estremo e ci riporti la misura dell’altro cateto.",
    filename: "MC-DIS-1-01_rettangolo-due-cateti.ggb",
    coord: [-4.6, 7.2, -3.3, 5],
    proofTitle: "I due cateti formano l’angolo retto",
    proofCopy: "Il cateto AC sta sulla perpendicolare ad AB, quindi l’angolo in A è retto. Le due misure date sono proprio i due lati che formano quell’angolo. Il terzo lato, l’ipotenusa BC, viene da solo: qui misura circa 7,2 cm.",
    equality: "AB = 6 cm · AC = 4 cm · angolo in A = 90°",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Conosci i due cateti: uno lungo 6 cm, l’altro lungo 4 cm. Vuoi costruire il triangolo rettangolo.", "I cateti sono i due lati che formano l’angolo retto."],
      ["Passo 1 · Primo cateto", "Traccia il cateto AB", "Con il righello traccia il segmento AB lungo 6 cm.", "L’angolo retto sarà in A."],
      ["Passo 2 · Perpendicolare", "Alza la perpendicolare in A", "Costruisci la perpendicolare ad AB nell’estremo A, come nella Costruzione 10: un arco da A, quattro archetti con la stessa apertura e la semiretta che sale da A.", "Il secondo cateto starà su questa semiretta."],
      ["Passo 3 · Secondo cateto", "Apri il compasso a 4 cm", "Prendi sul righello l’apertura di 4 cm. Punta in A e taglia la perpendicolare: trovi il vertice C.", "AC è lungo quanto il secondo cateto."],
      ["Passo 4 · Righello", "Unisci C con B", "Ripassa il cateto AC e traccia l’ipotenusa BC. Il triangolo rettangolo è completo.", "Misura l’ipotenusa: deve venire circa 7,2 cm."],
    ],
  }, (k) => {
    const A = k.punto("A", [-3, -2.4]);
    const B = k.punto("B", [3, -2.4]);
    const C = k.punto("C", [-3, -2.4 + 4]);
    const r = 1.7;
    const N1 = polare(A, r, 0); const N2 = polare(A, r, 60); const N3 = polare(A, r, 120);
    const N4 = [A[0], A[1] + r * Math.sqrt(3)];
    k.seg("segDatA", [0, 4.5], [6, 4.5], "cateto 6 cm");
    k.seg("segDatB", [0, 3.9], [4, 3.9], "cateto 4 cm");
    k.traccia("drawAB", A, B);
    k.arco("arcA", A, r, -8, 148, [0.05, 0.3]);
    k.archetto("arcN1", N1, N2, 14, [0.3, 0.42]);
    k.archetto("arcN2", N2, N3, 14, [0.42, 0.54]);
    k.archetto("arcK2", N2, N4, 14, [0.54, 0.66]);
    k.archetto("arcK3", N3, N4, 14, [0.66, 0.78]);
    k.traccia("linePerp", A, [A[0], A[1] + 6.2], [0.8, 1]);
    k.archetto("arcAC", A, C, 10);
    k.traccia("drawAC", A, C, [0.12, 0.45]);
    k.traccia("drawBC", C, B, [0.5, 0.9]);
    k.angolo("rightAngle", B, A, C);
    k.compare("A", 0.12); k.compare("B", 0.95); k.compare("C", 0.6); k.compare("rightAngle", 0.94);
    k.passo("segDatA", "segDatB");
    k.passo("drawAB", "A", "B");
    k.passo("arcA", "arcN1", "arcN2", "arcK2", "arcK3", "linePerp");
    k.passo("arcAC", "C");
    k.passo("drawAC", "drawBC", "rightAngle");
    k.risultato("drawAB", "drawAC", "drawBC");
  });

  // ── 29 · Triangolo rettangolo (ipotenusa e cateto) ─────────────────────────
  TAVOLE["rettangolo-semicirconferenza"] = creaTavola({
    title: "Triangolo rettangolo nella semicirconferenza",
    eyebrow: "Costruzione 29 · Dati l’ipotenusa e un cateto",
    subtitle: "L’ipotenusa diventa il diametro di una semicirconferenza: se unisci un punto della curva con i due estremi del diametro, ottieni un angolo retto.",
    filename: "MC-DIS-1-01_rettangolo-semicirconferenza.ggb",
    coord: [-8.2, 4.8, -4.3, 4.3],
    proofTitle: "Tre raggi uguali fanno un angolo retto",
    proofCopy: "Unisci O con C: OA, OB e OC sono tre raggi, quindi i triangoli AOC e BOC sono isosceli e hanno gli angoli alla base uguali. L’angolo in C è la somma di un angolo uguale a quello in A e di uno uguale a quello in B. Poiché i tre angoli del triangolo ABC fanno 180°, l’angolo in C è la metà: 90°. Vale per qualsiasi punto C della semicirconferenza.",
    equality: "angolo in C = 90° · BC = 6 cm",
    steps: [
      ["Prima di iniziare", "Osserva i dati", "Conosci l’ipotenusa, lunga 7,5 cm, e un cateto, lungo 4,5 cm. Vuoi costruire il triangolo rettangolo partendo dall’ipotenusa.", "Questa volta l’angolo retto non si costruisce: nasce da solo."],
      ["Passo 1 · Ipotenusa", "Traccia l’ipotenusa AB", "Con il righello traccia il segmento AB lungo 7,5 cm.", "L’angolo retto sarà nel terzo vertice, C."],
      ["Passo 2 · Punto medio", "Trova il punto O", "Costruisci l’asse di AB (Costruzione 9): due archi da A e da B con la stessa apertura e la retta per i punti d’incontro. Trovi il punto medio O.", "O sarà il centro della semicirconferenza."],
      ["Passo 3 · Semicirconferenza", "Punta in O", "Punta in O con apertura OA e traccia la semicirconferenza sopra AB.", "AB è il diametro."],
      ["Passo 4 · Cateto", "Apri il compasso a 4,5 cm", "Prendi sul righello l’apertura di 4,5 cm. Punta in A e taglia la semicirconferenza: trovi il vertice C.", "AC è lungo quanto il cateto dato."],
      ["Passo 5 · Righello", "Unisci C con A e con B", "Traccia i lati AC e BC. Il triangolo rettangolo è completo.", "Controlla con la squadra l’angolo in C e misura BC: deve venire 6 cm."],
    ],
  }, (k) => {
    const y0 = -1.8;
    const A = k.punto("A", [-3.75, y0]);
    const B = k.punto("B", [3.75, y0]);
    const O = k.punto("O", [0, y0]);
    const C = k.punto("C", [A[0] + 4.5 * 0.6, y0 + 4.5 * 0.8]);
    const r = 4;
    const h = Math.sqrt(r * r - 3.75 * 3.75);
    k.seg("segDatA", [-7.9, 3.7], [-0.4, 3.7], "ipotenusa 7,5 cm");
    k.seg("segDatB", [-7.9, 3.05], [-3.4, 3.05], "cateto 4,5 cm");
    k.traccia("drawAB", A, B);
    k.archetto("arcA1", A, [0, y0 + h], 9, [0.08, 0.26]); k.archetto("arcA2", A, [0, y0 - h], 9, [0.26, 0.44]);
    k.archetto("arcB1", B, [0, y0 + h], 9, [0.44, 0.6]); k.archetto("arcB2", B, [0, y0 - h], 9, [0.6, 0.76]);
    k.traccia("lineAsse", [0, y0 + h + 0.3], [0, y0 - h - 0.3], [0.78, 1]);
    k.arco("arcO", O, 3.75, 0, 180);
    k.archetto("arcAC", A, C, 10);
    k.traccia("drawAC", A, C, [0.12, 0.5]);
    k.traccia("drawBC", C, B, [0.52, 0.9]);
    k.angolo("rightAngle", A, C, B);
    k.compare("A", 0.12); k.compare("B", 0.95); k.compare("O", 0.92); k.compare("C", 0.6); k.compare("rightAngle", 0.94);
    k.passo("segDatA", "segDatB");
    k.passo("drawAB", "A", "B");
    k.passo("arcA1", "arcA2", "arcB1", "arcB2", "lineAsse", "O");
    k.passo("arcO");
    k.passo("arcAC", "C");
    k.passo("drawAC", "drawBC", "rightAngle");
    k.risultato("drawAB", "drawAC", "drawBC");
  });

  // ── 30 · Ovale inscritto nel rombo ─────────────────────────────────────────
  TAVOLE["ovale-nel-rombo"] = creaTavola({
    title: "Ovale inscritto nel rombo",
    eyebrow: "Costruzione 30 · Il rombo di due triangoli equilateri",
    subtitle: "Un rombo fatto di due triangoli equilateri guida quattro archi che toccano i lati nei loro punti medi.",
    filename: "MC-DIS-1-01_ovale-nel-rombo.ggb",
    coord: [-5.2, 5.2, -3.1, 3.1],
    proofTitle: "Gli archi toccano il rombo e si raccordano",
    proofCopy: "Il triangolo A-B-C è equilatero: il segmento che unisce A con il punto medio di BC è perpendicolare a BC. L’arco con centro A tocca quindi il lato senza attraversarlo. Lo stesso vale per gli altri archi. Nei punti medi si incontrano un arco grande e uno piccolo: i loro centri sono allineati con il punto di contatto, perciò la curva prosegue senza spigoli.",
    equality: "4 archi · 4 punti medi",
    steps: [
      ["Prima di iniziare", "Osserva il segmento AB", "Il segmento AB è lungo quanto il lato del rombo. Vuoi costruire il rombo e poi l’ovale che lo tocca dall’interno.", "Questo ovale serve per disegnare i cerchi nell’assonometria isometrica."],
      ["Passo 1 · Archi da A e da B", "Trova C e D", "Apri il compasso quanto AB. Punta in A e poi in B: i due archi si incontrano da una parte nel punto C e dall’altra nel punto D.", "A-B-C e A-B-D sono due triangoli equilateri."],
      ["Passo 2 · Rombo", "Unisci e segna i punti medi", "Unisci A e B con C e con D: ottieni il rombo. Con il righello segna il punto medio di ogni lato: E su AC, F su CB, G su BD, H su DA.", "Tutti e quattro i lati sono lunghi quanto AB."],
      ["Passo 3 · Quattro segmenti", "Trova 1 e 2", "Unisci A con i punti medi dei due lati opposti, F e G. Unisci B con gli altri due, E e H. AF e BE si incontrano nel punto 1, dalla parte di C; AG e BH nel punto 2, dalla parte di D.", "1 e 2 stanno sulla diagonale lunga del rombo."],
      ["Passo 4 · Archi grandi", "Punta in A e poi in B", "Punta in A con apertura AF e traccia l’arco da F a G. Con la stessa apertura punta in B e traccia l’arco da H a E.", "Ogni arco tocca due lati del rombo."],
      ["Passo 5 · Archi piccoli", "Punta in 1 e poi in 2", "Punta in 1 con apertura 1E e traccia l’arco da E a F. Con la stessa apertura punta in 2 e traccia l’arco da G a H. L’ovale è completo.", "Ripassa il contorno: non ci sono spigoli."],
    ],
  }, (k) => {
    const s = 4.8;
    const A = k.punto("A", [0, s / 2]);
    const B = k.punto("B", [0, -s / 2]);
    const hx = (s * Math.sqrt(3)) / 2;
    const C = k.punto("C", [-hx, 0]);
    const D = k.punto("D", [hx, 0]);
    const medio = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const E = k.punto("E", medio(A, C));
    const F = k.punto("F", medio(B, C));
    const G = k.punto("G", medio(B, D));
    const H = k.punto("H", medio(A, D));
    const x1 = hx / 3;
    const N1 = k.punto("N1", [-x1, 0], "1");
    const N2 = k.punto("N2", [x1, 0], "2");
    const Rg = distanza(A, F);
    const Rp = distanza(N1, E);
    k.seg("segAB", A, B);
    k.archetto("arcAC", A, C, 12, [0.12, 0.32]); k.archetto("arcBC", B, C, 12, [0.32, 0.52]);
    k.archetto("arcAD", A, D, 12, [0.52, 0.72]); k.archetto("arcBD", B, D, 12, [0.72, 0.92]);
    const wr = finestre(4, 0.12, 0.7);
    k.traccia("lineQ1", A, C, wr[0]); k.traccia("lineQ2", C, B, wr[1]); k.traccia("lineQ3", B, D, wr[2]); k.traccia("lineQ4", D, A, wr[3]);
    const wl = finestre(4);
    k.traccia("lineK1", A, F, wl[0]); k.traccia("lineK2", A, G, wl[1]); k.traccia("lineK3", B, E, wl[2]); k.traccia("lineK4", B, H, wl[3]);
    k.arco("arcBig1", A, Rg, 240, 60, [0.12, 0.5]);
    k.arco("arcBig2", B, Rg, 60, 60, [0.52, 0.9]);
    k.arco("arcSm1", N1, Rp, 120, 120, [0.12, 0.5]);
    k.arco("arcSm2", N2, Rp, 300, 120, [0.52, 0.9]);
    k.arcoFisso("ovale1", A, Rg, 240, 300); k.arcoFisso("ovale2", N2, Rp, 300, 420);
    k.arcoFisso("ovale3", B, Rg, 60, 120); k.arcoFisso("ovale4", N1, Rp, 120, 240);
    k.compare("C", 0.5); k.compare("D", 0.9);
    ["E", "F", "G", "H"].forEach((n) => k.compare(n, 0.8));
    k.compare("N1", 0.75); k.compare("N2", 0.92);
    ["ovale1", "ovale2", "ovale3", "ovale4"].forEach((n) => k.compare(n, 0.95));
    k.passo("A", "B", "segAB");
    k.passo("arcAC", "arcBC", "arcAD", "arcBD", "C", "D");
    k.passo("lineQ1", "lineQ2", "lineQ3", "lineQ4", "E", "F", "G", "H");
    k.passo("lineK1", "lineK2", "lineK3", "lineK4", "N1", "N2");
    k.passo("arcBig1", "arcBig2");
    k.passo("arcSm1", "arcSm2", "ovale1", "ovale2", "ovale3", "ovale4");
    k.risultato("ovale1", "ovale2", "ovale3", "ovale4");
  });

  // ── 31 · Ovale dato l'asse minore ──────────────────────────────────────────
  TAVOLE["ovale-asse-minore"] = creaTavola({
    title: "Ovale dato l’asse minore",
    eyebrow: "Costruzione 31 · Quattro centri su due assi",
    subtitle: "Parti dalla larghezza dell’ovale: una circonferenza trova i due centri mancanti, quattro archi chiudono la curva.",
    filename: "MC-DIS-1-01_ovale-asse-minore.ggb",
    coord: [-5.6, 5.6, -3.6, 3.6],
    proofTitle: "Centri allineati, curva senza spigoli",
    proofCopy: "Il punto C sta sulla retta che passa per A e per 1. In C si incontrano l’arco con centro A e l’arco con centro 1: i due centri e il punto di contatto sono allineati, quindi i due archi hanno lì la stessa direzione e si raccordano senza spigolo. Lo stesso accade in D, in E e in F.",
    equality: "4 archi · 4 punti di raccordo",
    steps: [
      ["Prima di iniziare", "Osserva l’asse minore", "Il segmento AB è l’asse minore, cioè la larghezza massima dell’ovale: la più corta delle sue due misure. Vuoi costruire l’ovale.", "L’asse maggiore verrà da solo: è perpendicolare ad AB."],
      ["Passo 1 · Asse di AB", "Trova il punto O", "Costruisci l’asse del segmento AB (Costruzione 9): trovi il punto medio O e la retta perpendicolare.", "O è il centro dell’ovale."],
      ["Passo 2 · Circonferenza", "Trova 1 e 2", "Punta in O con apertura OA e traccia la circonferenza: incontra la perpendicolare nei punti 1 e 2.", "A, B, 1 e 2 saranno i quattro centri degli archi."],
      ["Passo 3 · Quattro semirette", "Traccia le guide", "Da A traccia due semirette che passano per 1 e per 2, e prolungale oltre la circonferenza. Fai lo stesso da B.", "Su queste semirette cadranno i punti di raccordo."],
      ["Passo 4 · Archi grandi", "Punta in A e poi in B", "Punta in A con apertura AB e traccia l’arco tra le due semirette: va da C a D e passa per B. Con la stessa apertura punta in B: l’arco va da E a F e passa per A.", "C ed E stanno dalla parte del punto 1; D e F dalla parte del punto 2."],
      ["Passo 5 · Archi piccoli", "Punta in 1 e poi in 2", "Punta in 1 con apertura 1C e traccia l’arco da C a E. Con la stessa apertura punta in 2 e traccia l’arco da D a F. L’ovale è completo.", "Ripassa il contorno: quattro archi, nessuno spigolo."],
    ],
  }, (k) => {
    const r = 2.3;
    const A = k.punto("A", [0, r]);
    const B = k.punto("B", [0, -r]);
    const O = k.punto("O", [0, 0]);
    const N1 = k.punto("N1", [-r, 0], "1");
    const N2 = k.punto("N2", [r, 0], "2");
    const C = k.punto("C", polare(A, 2 * r, 225));
    const D = k.punto("D", polare(A, 2 * r, 315));
    const E = k.punto("E", polare(B, 2 * r, 135));
    const F = k.punto("F", polare(B, 2 * r, 45));
    const rp = distanza(N1, C);
    k.seg("segAB", A, B);
    k.traccia("lineAsse", [-5.2, 0], [5.2, 0]);
    k.arco("circleO", O, r, 90, 360);
    const wl = finestre(4);
    k.traccia("lineK1", A, oltre(A, C, 0.5), wl[0]); k.traccia("lineK2", A, oltre(A, D, 0.5), wl[1]);
    k.traccia("lineK3", B, oltre(B, E, 0.5), wl[2]); k.traccia("lineK4", B, oltre(B, F, 0.5), wl[3]);
    k.arco("arcBig1", A, 2 * r, 225, 90, [0.12, 0.5]);
    k.arco("arcBig2", B, 2 * r, 45, 90, [0.52, 0.9]);
    k.arco("arcSm1", N1, rp, 135, 90, [0.12, 0.5]);
    k.arco("arcSm2", N2, rp, 315, 90, [0.52, 0.9]);
    k.arcoFisso("ovale1", A, 2 * r, 225, 315); k.arcoFisso("ovale2", N2, rp, 315, 405);
    k.arcoFisso("ovale3", B, 2 * r, 45, 135); k.arcoFisso("ovale4", N1, rp, 135, 225);
    k.compare("O", 0.5); k.compare("N1", 0.35); k.compare("N2", 0.8);
    k.compare("C", 0.2); k.compare("D", 0.5); k.compare("F", 0.6); k.compare("E", 0.9);
    ["ovale1", "ovale2", "ovale3", "ovale4"].forEach((n) => k.compare(n, 0.95));
    k.passo("A", "B", "segAB");
    k.passo("lineAsse", "O");
    k.passo("circleO", "N1", "N2");
    k.passo("lineK1", "lineK2", "lineK3", "lineK4");
    k.passo("arcBig1", "arcBig2", "C", "D", "E", "F");
    k.passo("arcSm1", "arcSm2", "ovale1", "ovale2", "ovale3", "ovale4");
    k.risultato("ovale1", "ovale2", "ovale3", "ovale4");
  });

  // ── 32 · Ovolo ─────────────────────────────────────────────────────────────
  TAVOLE["ovolo-asse-minore"] = creaTavola({
    title: "Ovolo dato l’asse minore",
    eyebrow: "Costruzione 32 · La forma dell’uovo",
    subtitle: "Mezza circonferenza da una parte, tre archi raccordati dall’altra: nasce il profilo di un uovo.",
    filename: "MC-DIS-1-01_ovolo-asse-minore.ggb",
    coord: [-6.2, 6.2, -3, 4.3],
    proofTitle: "Un solo asse di simmetria",
    proofCopy: "L’ovolo è fatto di quattro archi: la semicirconferenza con centro O, due archi grandi con centro A e con centro B, e un arco piccolo con centro 1. In ogni punto di raccordo i due centri e il punto di contatto sono allineati: per esempio A, 1 e C stanno sulla stessa semiretta. Per questo la curva non fa spigoli. A differenza dell’ovale, l’ovolo ha un solo asse di simmetria.",
    equality: "1 semicirconferenza + 3 archi",
    steps: [
      ["Prima di iniziare", "Osserva l’asse minore", "Il segmento AB è l’asse minore, cioè la larghezza massima dell’ovolo. Vuoi costruire una curva a forma di uovo.", "Da una parte sarà rotonda, dall’altra più appuntita."],
      ["Passo 1 · Asse di AB", "Trova il punto O", "Costruisci l’asse del segmento AB (Costruzione 9): trovi il punto medio O e la retta perpendicolare.", "È l’asse di simmetria dell’ovolo."],
      ["Passo 2 · Circonferenza", "Trova 1 e 2", "Punta in O con apertura OA e traccia la circonferenza: incontra la perpendicolare nel punto 1, in alto, e nel punto 2, in basso.", "La metà inferiore di questa circonferenza farà parte dell’ovolo."],
      ["Passo 3 · Due semirette", "Traccia le guide", "Da A traccia la semiretta che passa per 1 e prolungala. Da B traccia un’altra semiretta che passa per 1.", "Le due semirette si incrociano nel punto 1."],
      ["Passo 4 · Archi grandi", "Punta in A e poi in B", "Punta in A con apertura AB e traccia l’arco che parte da B e arriva alla semiretta: trovi C. Con la stessa apertura punta in B e traccia l’arco che parte da A: trovi D.", "C è sulla semiretta che parte da A, D su quella che parte da B."],
      ["Passo 5 · Punta dell’uovo", "Punta in 1", "Punta in 1 con apertura 1C e traccia l’arco da C a D. Poi ripassa la semicirconferenza inferiore, da A a B passando per 2. L’ovolo è completo.", "Ripassa il contorno partendo dalla punta."],
    ],
  }, (k) => {
    const r = 2.2;
    const A = k.punto("A", [-r, 0]);
    const B = k.punto("B", [r, 0]);
    const O = k.punto("O", [0, 0]);
    const N1 = k.punto("N1", [0, r], "1");
    const N2 = k.punto("N2", [0, -r], "2");
    const C = k.punto("C", polare(A, 2 * r, 45));
    const D = k.punto("D", polare(B, 2 * r, 135));
    const rp = distanza(N1, C);
    k.seg("segAB", A, B);
    k.traccia("lineAsse", [0, -r - 0.5], [0, r + rp + 0.5]);
    k.arco("circleO", O, r, 0, 360);
    k.traccia("lineK1", A, oltre(A, C, 0.6), [0.12, 0.5]);
    k.traccia("lineK2", B, oltre(B, D, 0.6), [0.52, 0.9]);
    k.arco("arcBig1", A, 2 * r, 0, 45, [0.12, 0.5]);
    k.arco("arcBig2", B, 2 * r, 135, 45, [0.52, 0.9]);
    k.arco("arcSm", N1, rp, 45, 90, [0.12, 0.6]);
    k.arcoFisso("ovolo1", O, r, 180, 360); k.arcoFisso("ovolo2", A, 2 * r, 0, 45);
    k.arcoFisso("ovolo3", N1, rp, 45, 135); k.arcoFisso("ovolo4", B, 2 * r, 135, 180);
    k.compare("O", 0.5); k.compare("N1", 0.35); k.compare("N2", 0.8); k.compare("C", 0.5); k.compare("D", 0.55);
    ["ovolo1", "ovolo2", "ovolo3", "ovolo4"].forEach((n) => k.compare(n, 0.8));
    k.passo("A", "B", "segAB");
    k.passo("lineAsse", "O");
    k.passo("circleO", "N1", "N2");
    k.passo("lineK1", "lineK2");
    k.passo("arcBig1", "arcBig2", "C", "D");
    k.passo("arcSm", "ovolo1", "ovolo2", "ovolo3", "ovolo4");
    k.risultato("ovolo1", "ovolo2", "ovolo3", "ovolo4");
  });

  // ── 33 · Spirale a quattro centri ──────────────────────────────────────────
  TAVOLE["spirale-quattro-centri"] = creaTavola({
    title: "Spirale a quattro centri",
    eyebrow: "Costruzione 33 · Quarti di circonferenza",
    subtitle: "I vertici di un piccolo quadrato fanno da centri, uno dopo l’altro: a ogni quarto di giro il raggio cresce di un lato.",
    filename: "MC-DIS-1-01_spirale-quattro-centri.ggb",
    coord: [-5, 6.6, -4, 5.7],
    proofTitle: "Ogni giro si allarga di quattro lati",
    proofCopy: "Ogni arco è un quarto di circonferenza: parte dal prolungamento di un lato del quadrato e finisce sul prolungamento del lato successivo. Lì cambia il centro, ma il vecchio centro, il nuovo centro e il punto di contatto sono allineati: la curva non fa spigoli. A ogni cambio di centro il raggio aumenta di un lato del quadrato; dopo quattro archi, cioè un giro completo, la spirale si è allargata di quattro lati: è il passo.",
    equality: "passo = 4 × lato del quadrato",
    steps: [
      ["Prima di iniziare", "Osserva il quadrato", "Hai un piccolo quadrato ABCD: i suoi vertici saranno i quattro centri della spirale. Il passo, cioè la distanza tra un giro e il successivo, è quattro volte il lato.", "Per un passo di 2 cm disegna un quadrato di lato 0,5 cm."],
      ["Passo 1 · Prolungamenti", "Prolunga i quattro lati", "Prolunga ogni lato del quadrato da una sola parte, girando sempre nello stesso verso: il lato BA oltre A, il lato CB oltre B, il lato DC oltre C, il lato AD oltre D.", "Su queste semirette finiranno gli archi."],
      ["Passo 2 · Centro A", "Primo arco", "Punta in A, apri fino a D e traccia un quarto di circonferenza fino al prolungamento del lato BA: arrivi nel punto 1.", "Il raggio è lungo un lato."],
      ["Passo 3 · Centro B", "Secondo arco", "Punta in B, apri fino a 1 e traccia un quarto di circonferenza fino al prolungamento del lato CB: arrivi nel punto 2.", "Il raggio è lungo due lati."],
      ["Passo 4 · Centro C", "Terzo arco", "Punta in C, apri fino a 2 e traccia un quarto di circonferenza fino al prolungamento del lato DC: arrivi nel punto 3.", "Il raggio è lungo tre lati."],
      ["Passo 5 · Centro D", "Quarto arco", "Punta in D, apri fino a 3 e traccia un quarto di circonferenza fino al prolungamento del lato AD: arrivi nel punto 4. Hai chiuso il primo giro.", "Il raggio è lungo quattro lati."],
      ["Passo 6 · Continua", "Ricomincia da A", "Continua nello stesso ordine: centro A fino a 5, centro B fino a 6, centro C fino a 7, centro D fino a 8.", "I centri si ripetono sempre nello stesso ordine: A, B, C, D."],
    ],
  }, (k) => {
    const u = 0.55;
    const Q = { A: [0, 0], B: [u, 0], C: [u, u], D: [0, u] };
    Object.entries(Q).forEach(([n, p]) => k.punto(n, p));
    const ordine = ["A", "B", "C", "D"];
    ordine.forEach((n, i) => k.seg(`segQ${i + 1}`, Q[n], Q[ordine[(i + 1) % 4]]));
    k.seg("rayA", Q.A, [-4.4, 0]); k.seg("rayB", Q.B, [u, -3.7]); k.seg("rayC", Q.C, [6.2, u]); k.seg("rayD", Q.D, [0, 5.2]);
    const fine = [];
    const wf = finestre(4);
    for (let i = 1; i <= 8; i += 1) {
      const centro = Q[ordine[(i - 1) % 4]];
      const inizio = 90 * i;
      const finestra = i > 4 ? wf[i - 5] : undefined;
      k.arco(`arcS${i}`, centro, u * i, inizio, 90, finestra);
      k.arcoFisso(`spira${i}`, centro, u * i, inizio, inizio + 90);
      k.punto(`N${i}`, polare(centro, u * i, inizio + 90), String(i));
      k.compare(`N${i}`, finestra ? finestra[1] : 0.97);
      k.compare(`spira${i}`, 0.97);
      fine.push(`spira${i}`);
    }
    k.passo("A", "B", "C", "D", "segQ1", "segQ2", "segQ3", "segQ4");
    k.passo("rayA", "rayB", "rayC", "rayD");
    k.passo("arcS1", "N1");
    k.passo("arcS2", "N2");
    k.passo("arcS3", "N3");
    k.passo("arcS4", "N4");
    k.passo("arcS5", "arcS6", "arcS7", "arcS8", "N5", "N6", "N7", "N8", ...fine);
    k.risultato(...fine);
  });

  window.GGB_TAVOLE = TAVOLE;
  // Vocabolario condiviso con le altre serie di tavole (tavole-po.js: proiezioni ortogonali, MC-DIS-2-01).
  window.GGB_CREA = { creaTavola, finestre, polare, distanza, direzione, oltre, xy, num };
})();
