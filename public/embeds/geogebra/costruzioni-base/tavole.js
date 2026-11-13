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

  window.GGB_TAVOLE = TAVOLE;
})();
