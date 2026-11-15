/*
 * Tavole di assonometria — MC-DIS-2-02 (cavaliera, isometrica) e MC-DIS-3-01 (monometrica).
 *
 * Ogni tavola è un foglio con i tre assi che partono da O, costruito con lo stesso vocabolario delle tavole di
 * MC-DIS-1-01 (`creaTavola`, in tavole.js). Qui sopra c'è uno strato in più, `creaAssonometria`, che conosce
 * le tre assonometrie del libro e porta sul foglio un punto dato con le sue tre misure.
 *
 * Unità: 1 = 1 cm. Origine O = punto da cui partono gli assi, sul vertice del solido più vicino a chi guarda.
 * Misure del solido, nell'ordine (x, y, z):
 *   x = larghezza, da sinistra verso destra      y = profondità, da davanti verso dietro      z = altezza
 * Sul foglio (angoli misurati dalla linea orizzontale, in senso antiorario; k = rapporto di riduzione):
 *   cavaliera     x a 0°,  k 1     y a 45°,  k 1/2     z a 90°, k 1     → si guarda di fronte, da destra e dall'alto
 *   isometrica    x a 30°, k 1     y a 150°, k 1       z a 90°, k 1     → si guarda di fronte, da sinistra e dall'alto
 *   monometrica   x a 30°, k 1     y a 120°, k 1       z a 90°, k 1     → come sopra, ma più dall'alto; x ⟂ y
 *   militare      x a 45°, k 1     y a 135°, k 1       z a 90°, k 1/2   → di spigolo e molto dall'alto; x ⟂ y
 * Sono le stesse regole del testo di MC-DIS-2-02 e dello strumento «Assonometro» (public/embeds/assonometro/).
 *
 * `a.p(x, y, z)` dà il punto sul foglio; tutti gli strumenti lavorano su punti del foglio.
 * Nomi (decidono lo stile, vedi STILI qui sotto):
 *   lineAs…  asse (sottile, grigio scuro)             lineCs…  linea di costruzione (sottile, grigia: la scatola)
 *   lineFg…  figura in costruzione (blu)              draw…    ripasso finale (nero; tratteggiato se nascosto)
 *   mis…     misura messa in evidenza (con scritta)   tac…     trattino di misura
 * I punti hanno l'iniziale maiuscola e non usano nomi tipo «A1». Nei nomi non devono comparire «tri», «hex»,
 * «poly», «square», «arc»: il motore (activity.js › styleObjects) li riconosce e cambia lo stile.
 * Ogni passo si chiude con `a.passo()`; il numero di `a.passo()` deve essere uguale al numero di voci in `steps`.
 * Come aggiungere una tavola: skill «tavole-geogebra» e «tavole-po-semplificate».
 */
(() => {
  "use strict";

  const { creaTavola, finestre, xy } = window.GGB_CREA;
  const TAVOLE = window.GGB_TAVOLE;
  const RAD = Math.PI / 180;

  const INCHIOSTRO = [15, 23, 42];
  const BLU = [30, 64, 175];
  const ROSSO_NOMI = [239, 68, 68];
  const STILI = {
    asse: { color: [71, 85, 105], thickness: 3, lineStyle: 0 },
    costruzione: { color: [100, 116, 139], thickness: 2, lineStyle: 0 },
    riferimento: { color: [148, 163, 184], thickness: 2, lineStyle: 1 },
    figura: { color: BLU, thickness: 3, lineStyle: 0 },
    misura: { color: [194, 65, 12], thickness: 5, lineStyle: 0 },
    tacca: { color: [194, 65, 12], thickness: 5, lineStyle: 0 },
    ripasso: { color: [0, 0, 0], thickness: 6, lineStyle: 0 },
    nascosto: { color: [0, 0, 0], thickness: 4, lineStyle: 2 },
    servizio: { color: [194, 65, 12], pointSize: 4 },
    vista: { color: INCHIOSTRO, thickness: 3, lineStyle: 0 },
  };
  // L'ordine dei livelli è anche l'ordine di disegno: la figura sta sopra la costruzione, i nomi sopra tutto.
  const LIVELLI = { costruzione: 1, misure: 2, figura: 3, nomi: 4 };

  // Gli stessi colori dei piani nelle tavole di proiezioni ortogonali: la faccia che si vede nel PV è azzurra,
  // quella che si vede nel PO è gialla, quella di fianco è rosa.
  const PIANI = {
    PV: { colore: [147, 197, 253], testo: [29, 78, 216] },
    PL: { colore: [249, 168, 212], testo: [190, 24, 93] },
    PO: { colore: [253, 224, 71], testo: [146, 64, 14] },
  };

  const TIPI = {
    cavaliera: { x: { gradi: 0, k: 1 }, y: { gradi: 45, k: 0.5 } },
    isometrica: { x: { gradi: 30, k: 1 }, y: { gradi: 150, k: 1 } },
    monometrica: { x: { gradi: 30, k: 1 }, y: { gradi: 120, k: 1 } },
    militare: { x: { gradi: 45, k: 1 }, y: { gradi: 135, k: 1 }, z: { k: 0.5 } },
  };

  /**
   * Foglio di un'assonometria.
   * `tipo`: "cavaliera" | "isometrica" | "monometrica".
   * `limiti`: quanto si estende il foglio dall'origine, in cm → { sinistra, destra, alto, basso }.
   * `costruisci(a, k)`: a = strumenti del foglio (qui sotto), k = vocabolario di creaTavola.
   */
  function creaAssonometria(meta, tipo, limiti, costruisci) {
    const T = TIPI[tipo];
    const { sinistra, destra, alto, basso } = limiti;
    const versore = (asse) => (asse === "z" ? [0, 1] : [Math.cos(T[asse].gradi * RAD), Math.sin(T[asse].gradi * RAD)]);
    const ex = versore("x"), ey = versore("y");
    /** Punto del foglio che corrisponde al punto del solido con larghezza x, profondità y e altezza z (in cm). */
    const kz = T.z ? T.z.k : 1;
    const p = (x, y, z) => [x * T.x.k * ex[0] + y * T.y.k * ey[0], x * T.x.k * ex[1] + y * T.y.k * ey[1] + z * kz];

    return creaTavola({
      level: tipo === "monometrica" || tipo === "militare" ? "A" : "I",
      appletHeight: 660,
      fontSize: 20,
      coord: [-sinistra - 0.6, destra + 0.6, -basso - 0.6, alto + 0.6],
      ...meta,
    }, (k, t) => {
      t.areas = [];
      t.styles = {};
      const stile = (nome, s) => { t.styles[nome] = { ...(t.styles[nome] || {}), ...s }; return nome; };
      const O = [0, 0];

      // Ogni strumento registra qui i nomi che crea: `a.passo()` chiude il passo e li consegna al motore.
      let inCorso = [];
      let passi = 0;
      const registra = (...nomi) => { inCorso.push(...nomi); return nomi[0]; };

      const a = {
        O, p, tipo,
        /** Punto del foglio a `cm` da `da`, nella direzione di un asse ("x", "y", "z"): misura sul foglio, già ridotta. */
        lungo(asse, cm, da = O) { const v = versore(asse); return [da[0] + v[0] * cm, da[1] + v[1] * cm]; },
        /** Chiude il passo: tutti gli oggetti creati dall'ultimo `a.passo()` entrano in questo passo. */
        passo() { k.passo(...inCorso); inCorso = []; passi += 1; },
        /** Stile di un oggetto creato da uno strumento (per i ritocchi dentro una tavola). */
        stile(nome, s) { return stile(nome, s); },
        /** Il punto O, da cui partono gli assi. */
        origine(spostaNome = [-0.55, -0.7]) {
          k.punto("O", O);
          stile("O", { color: INCHIOSTRO, pointSize: 4, layer: LIVELLI.nomi, label: false });
          registra("O");
          a.scritta("NomeO", "O", [spostaNome[0], spostaNome[1]], INCHIOSTRO);
          stile("TestoNomeO", { layer: LIVELLI.nomi });
          return "O";
        },
        /** Linea orizzontale sottile per O: il riferimento da cui si misurano gli angoli degli assi. */
        orizzontale(da, fino, finestra) {
          k.traccia("lineOr", [da, 0], [fino, 0], finestra);
          stile("lineOr", { ...STILI.riferimento, layer: LIVELLI.costruzione });
          return registra("lineOr");
        },
        /** Asse x, y o z: parte da O, lungo `cm` sul foglio, con il nome vicino alla punta. */
        asse(asse, cm, finestra, spostaNome) {
          const nome = `lineAs${asse.toUpperCase()}`;
          const fine = a.lungo(asse, cm);
          k.traccia(nome, O, fine, finestra);
          stile(nome, { ...STILI.asse, layer: LIVELLI.costruzione });
          registra(nome);
          const d = spostaNome || [0.2, 0.15];
          a.scritta(`As${asse.toUpperCase()}`, asse, [fine[0] + d[0], fine[1] + d[1]], INCHIOSTRO, finestra ? finestra[1] : undefined);
          return nome;
        },
        /** Ampiezza di un angolo con il vertice in O, da `da` a `fino` gradi (antiorario), con la scritta (es. "30°"). */
        angolo(nome, da, fino, testo, quando, raggio = 2.4) {
          const creati = k.settore(`ang${nome}`, O, raggio, da, fino, testo);
          stile(creati[0], { filling: 0.14 });                    // leggero: alla fine sta sotto le facce colorate
          creati.forEach((n) => { if (quando !== undefined) k.compare(n, quando); registra(n); });
        },
        /** Simbolo dell'angolo retto con il vertice in O, tra due direzioni date in gradi (antiorario da `da` a `fino`). */
        angoloRetto(nome, da, fino, quando) {
          const r = 1;
          k.angolo(`rightAngle${nome}`, [r * Math.cos(da * RAD), r * Math.sin(da * RAD)], O, [r * Math.cos(fino * RAD), r * Math.sin(fino * RAD)]);
          if (quando !== undefined) k.compare(`rightAngle${nome}`, quando);
          return registra(`rightAngle${nome}`);
        },
        /** Scritta sul foglio: `q` è l'angolo in basso a sinistra del testo. */
        scritta(nome, testo, q, colore, quando) {
          t.commands.push(`Testo${nome}=Text("${testo}",${xy(q)})`);
          stile(`Testo${nome}`, { color: colore || INCHIOSTRO });
          if (quando !== undefined) k.compare(`Testo${nome}`, quando);
          return registra(`Testo${nome}`);
        },
        /** Linea di costruzione sottile (la scatola), tracciata da q verso r. */
        sottile(nome, q, r, finestra) {
          k.traccia(`lineCs${nome}`, q, r, finestra);
          stile(`lineCs${nome}`, { ...STILI.costruzione, layer: LIVELLI.costruzione });
          return registra(`lineCs${nome}`);
        },
        /** Linea della figura in costruzione (blu), tracciata da q verso r. */
        figura(nome, q, r, finestra) {
          k.traccia(`lineFg${nome}`, q, r, finestra);
          stile(`lineFg${nome}`, { ...STILI.figura, layer: LIVELLI.figura });
          return registra(`lineFg${nome}`);
        },
        /**
         * Misura messa in evidenza: tratto colorato da q a r e scritta (es. "6 cm") accanto al punto medio.
         * `lato`: dove va la scritta → "su" | "giu" | "dx" | "sx". `sposta` = [dx, dy] in cm: ritocco finale.
         * Con `soloScritta` il tratto non si disegna: serve sugli spigoli che alla fine saranno tratteggiati.
         */
        misura(nome, q, r, testo, quando, lato, sposta, soloScritta) {
          const m = [(q[0] + r[0]) / 2, (q[1] + r[1]) / 2];
          const largo = 0.36 * testo.length;                      // larghezza indicativa della scritta, in cm
          let dove = lato === "su" ? [m[0] - largo / 2, m[1] + 0.3]
            : lato === "giu" ? [m[0] - largo / 2, m[1] - 0.85]
            : lato === "sx" ? [m[0] - largo * 1.12 - 0.3, m[1] - 0.25]
            : [m[0] + 0.3, m[1] - 0.25];
          if (sposta) dove = [dove[0] + sposta[0], dove[1] + sposta[1]];
          if (!soloScritta) {
            k.seg(`mis${nome}`, q, r);
            stile(`mis${nome}`, { ...STILI.misura, layer: LIVELLI.misure });
            if (quando !== undefined) k.compare(`mis${nome}`, quando);
            registra(`mis${nome}`);
          }
          a.scritta(`Mis${nome}`, testo, dove, STILI.misura.color, quando);
          stile(`TestoMis${nome}`, { layer: LIVELLI.misure });
        },
        /** Punto con nome (es. "A"). Compare a `quando` (0–1). `spostaNome` = [dx, dy] in cm: il nome diventa una scritta messa lì. */
        punto(nome, q, etichetta, quando, spostaNome) {
          k.punto(nome, q, spostaNome ? undefined : etichetta);
          stile(nome, { layer: LIVELLI.nomi });
          if (quando !== undefined) k.compare(nome, quando);
          registra(nome);
          if (spostaNome) {
            stile(nome, { label: false });
            a.scritta(`Nome${nome}`, etichetta || nome, [q[0] + spostaNome[0], q[1] + spostaNome[1]], ROSSO_NOMI, quando);
            stile(`TestoNome${nome}`, { layer: LIVELLI.nomi });
          }
          return nome;
        },
        /** Punto senza nome (un segno fatto con la matita). Compare a `quando` (0–1). */
        segno(nome, q, quando) {
          k.punto(`Segno${nome}`, q);
          stile(`Segno${nome}`, { ...STILI.servizio, label: false, layer: LIVELLI.misure });
          if (quando !== undefined) k.compare(`Segno${nome}`, quando);
          return registra(`Segno${nome}`);
        },
        /** Ripasso finale di uno spigolo in vista. */
        ripassa(nome, q, r, finestra) {
          k.traccia(`draw${nome}`, q, r, finestra);
          k.risultato(`draw${nome}`);
          stile(`draw${nome}`, { ...STILI.ripasso, layer: LIVELLI.figura });
          return registra(`draw${nome}`);
        },
        /** Ripasso finale di uno spigolo nascosto (tratteggiato). */
        nascosto(nome, q, r, finestra) {
          k.traccia(`draw${nome}`, q, r, finestra);
          stile(`draw${nome}`, { ...STILI.nascosto, layer: LIVELLI.figura });
          return registra(`draw${nome}`);
        },
        /**
         * Faccia colorata, senza bordo: compare nel passo in corso, al momento `quando` (0–1).
         * `piano`: "PV" (azzurro, la faccia di fronte), "PO" (giallo, sopra), "PL" (rosa, di fianco).
         * Non entra nei passi: è un'area «lista» gestita dal motore (vedi activity.js).
         */
        faccia(nome, vertici, piano, quando = 0.9) {
          t.areas.push({ name: `area${nome}`, points: [`{${vertici.map(xy).join(",")}}`], step: passi, at: quando, lista: true });
          stile(`area${nome}`, { color: PIANI[piano].colore, filling: 0.45 });
        },
        /**
         * Le tre viste del solido, in piccolo (scala 1:3), con i colori dei piani: sono i dati da cui si parte.
         * `q` = angolo in basso a sinistra del riquadro. Il solido è una scatola larg × prof × alt; in più:
         *   profiloPV  poligono [x, z] al posto del rettangolo nel PV
         *   lineePO    tratti [[x, y], [x, y]] in più nel PO          lineePL  tratti [[y, z], [y, z]] in più nel PL
         *   (un terzo elemento `true` dopo i due punti = spigolo nascosto, tratteggiato)
         * Restano sempre sul foglio, dal primo passo.
         */
        treViste({ larg, prof, alt, profiloPV, lineePO = [], lineePL = [] }, q) {
          const s = 1 / 3, g = 0.45;
          const W = larg * s, D = prof * s, H = alt * s;
          const x0 = q[0] + 2 * g + W;                    // asse verticale del piccolo foglio
          const y0 = q[1] + 2 * g + D;                    // linea di terra del piccolo foglio
          const destraMini = x0 + 2 * g + D, altoMini = y0 + H + g + 0.55;
          const pv = (x, z) => [x0 - g - W + x * s, y0 + z * s];
          const po = (x, y) => [x0 - g - W + x * s, y0 - g - D + y * s];       // il davanti del solido sta lontano dalla LT
          const pl = (y, z) => [x0 + g + (prof - y) * s, y0 + z * s];          // metodo europeo: il davanti cade a destra
          const piano = (nome, v, sigla) => {
            t.areas.push({ name: nome, points: v.map(xy) });
            stile(nome, { color: PIANI[sigla].colore, filling: 0.3 });
          };
          piano("miniPV", [[q[0], y0], [x0, y0], [x0, altoMini], [q[0], altoMini]], "PV");
          piano("miniPL", [[x0, y0], [destraMini, y0], [destraMini, altoMini], [x0, altoMini]], "PL");
          piano("miniPO", [[q[0], q[1]], [x0, q[1]], [x0, y0], [q[0], y0]], "PO");
          let n = 0;
          const tratto = (da, fino, st = STILI.vista) => {
            const nome = `lineVs${"ABCDEFGHILMNOPQRSTUVZ"[Math.floor(n / 21)]}${"ABCDEFGHILMNOPQRSTUVZ"[n % 21]}`;
            n += 1;
            k.seg(nome, da, fino);
            stile(nome, st);
            registra(nome);
          };
          const chiuso = (v) => v.forEach((da, i) => tratto(da, v[(i + 1) % v.length]));
          tratto([q[0], y0], [destraMini, y0], { color: INCHIOSTRO, thickness: 2, lineStyle: 0 });
          tratto([x0, q[1]], [x0, altoMini], { color: INCHIOSTRO, thickness: 2, lineStyle: 0 });
          chiuso((profiloPV || [[0, 0], [larg, 0], [larg, alt], [0, alt]]).map(([x, z]) => pv(x, z)));
          chiuso([[0, 0], [larg, 0], [larg, prof], [0, prof]].map(([x, y]) => po(x, y)));
          chiuso([[0, 0], [prof, 0], [prof, alt], [0, alt]].map(([y, z]) => pl(y, z)));
          const inPiu = (st) => (nascosto) => (nascosto ? { ...st, thickness: 2, lineStyle: 2 } : st);
          lineePO.forEach(([da, fino, nascosto]) => tratto(po(da[0], da[1]), po(fino[0], fino[1]), inPiu(STILI.vista)(nascosto)));
          lineePL.forEach(([da, fino, nascosto]) => tratto(pl(da[0], da[1]), pl(fino[0], fino[1]), inPiu(STILI.vista)(nascosto)));
          a.scritta("MiniPV", "PV", [q[0] + 0.12, altoMini - 0.5], PIANI.PV.testo);
          a.scritta("MiniPL", "PL", [destraMini - 0.78, altoMini - 0.5], PIANI.PL.testo);
          a.scritta("MiniPO", "PO", [q[0] + 0.12, q[1] + 0.1], PIANI.PO.testo);
          a.scritta("MiniTitolo", "Le tre viste", [q[0], altoMini + 0.25], INCHIOSTRO);
          const riga = (i, testo) => a.scritta(`MiniRiga${"ABC"[i]}`, testo, [q[0], q[1] - 0.75 - i * 0.62], INCHIOSTRO);
          const cm = (v) => String(v).replace(".", ",");
          riga(0, `x · larghezza ${cm(larg)} cm`);
          riga(1, `y · profondità ${cm(prof)} cm`);
          riga(2, `z · altezza ${cm(alt)} cm`);
        },
      };

      costruisci(a, k, t);
    });
  }

  const INTRO = "L’assonometria è un disegno che mostra un solido tutto insieme, con tre facce in vista. Usa tre assi che partono dallo stesso punto O: l’asse x per la larghezza, l’asse y per la profondità, l’asse z per l’altezza.";
  const VISTE = "Di fianco al foglio trovi le tre viste del solido, in piccolo: le misure si prendono da lì.";
  const COLORI = "Alla fine le facce prendono i colori dei piani delle proiezioni ortogonali: azzurra la faccia di fronte, come il PV; gialla quella di sopra, come il PO; rosa quella di fianco, come il PL.";

  // ── Tavola 1 · Parallelepipedo in assonometria cavaliera ─────────────────────
  TAVOLE["ass-parallelepipedo-cavaliera"] = creaAssonometria({
    title: "Parallelepipedo in assonometria cavaliera",
    eyebrow: "Tavola 1 · La faccia di fronte resta vera",
    subtitle: "Parallelepipedo con la base di 6 × 4 cm, alto 8 cm: lo stesso della tavola 5 delle proiezioni ortogonali. L’asse y è inclinato di 45° e la profondità si disegna a metà.",
    filename: "MC-DIS-2-02_ass-parallelepipedo-cavaliera.ggb",
    proofTitle: "Una faccia vera e una misura dimezzata",
    proofCopy: "In assonometria cavaliera la faccia di fronte è parallela al foglio: per questo la disegni con le misure vere e con gli angoli retti, come nel prospetto. La profondità va all’indietro: sul foglio diventa una linea inclinata di 45°, lunga la metà. Se non la dimezzassi, il solido sembrerebbe più profondo di quanto è. Gli spigoli che nel solido sono paralleli restano paralleli nel disegno: vale per tutte le assonometrie.",
    equality: "x: 6 cm · y: 4 cm → 2 cm · z: 8 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `${INTRO} Il parallelepipedo ha la base di 6 cm per 4 cm ed è alto 8 cm: larghezza 6 cm, profondità 4 cm, altezza 8 cm. ${VISTE} Sul tuo foglio segna il punto O in basso a sinistra: ti servono almeno 9 cm a destra di O e 11 cm sopra.`, "Larghezza e altezza si leggono nel PV, la profondità nel PO."],
      ["Passo 1 · Gli assi", "Traccia i tre assi", "Da O traccia l’asse x: una linea orizzontale verso destra, lunga circa 8 cm. Poi l’asse z: una linea verticale verso l’alto, lunga circa 10 cm. Infine l’asse y: appoggia la squadra a 45° sull’asse x e traccia da O una linea inclinata verso destra e verso l’alto, lunga circa 4 cm. Scrivi x, y e z vicino alla punta di ogni asse.", "Controlla con la squadra l’angolo retto tra x e z. L’asse y lo divide a metà: 45° da una parte e 45° dall’altra."],
      ["Passo 2 · Di fronte", "Disegna la faccia di fronte", "Sull’asse x misura 6 cm da O e segna il punto A: è la larghezza. Sull’asse z misura 8 cm da O e segna il punto D: è l’altezza. Da A traccia una linea verticale, da D una linea orizzontale: si incontrano nel punto E. Il rettangolo OAED è la faccia di fronte.", "È uguale al prospetto: 6 cm per 8 cm, con quattro angoli retti."],
      ["Passo 3 · In profondità", "Riporta la profondità a metà", "La profondità è 4 cm, ma lungo l’asse y si disegna a metà: 2 cm. Sull’asse y misura 2 cm da O e segna il punto C. Poi da A, da E e da D traccia tre linee parallele all’asse y, lunghe 2 cm: trovi i punti B, F e G.", "Per tracciare le parallele fai scorrere la squadra a 45° lungo la riga, senza girarla."],
      ["Passo 4 · Dietro", "Chiudi la faccia di dietro", "Unisci C con B e G con F: sono due linee orizzontali. Unisci C con G e B con F: sono due linee verticali. Il rettangolo CBFG è la faccia di dietro.", "La faccia di dietro è uguale a quella di fronte: 6 cm per 8 cm. È solo spostata lungo l’asse y."],
      ["Passo 5 · Ripasso", "Ripassa gli spigoli", `Guardi il solido di fronte, un po’ da destra e dall’alto. Vedi tre facce: quella di fronte, quella di sopra e quella di destra. Ripassa con un tratto deciso i loro spigoli, cioè le linee dove si incontrano due facce. I tre spigoli che partono da C stanno dietro: disegnali tratteggiati, cioè a trattini. ${COLORI}`, "Conta gli spigoli: 9 in vista e 3 nascosti. In tutto 12."],
    ],
  }, "cavaliera", { sinistra: 2.4, destra: 15.2, alto: 11.2, basso: 1.4 }, (a) => {
    const larg = 6, prof = 4, alt = 8;
    const O = a.O, A = a.p(larg, 0, 0), B = a.p(larg, prof, 0), C = a.p(0, prof, 0);
    const D = a.p(0, 0, alt), E = a.p(larg, 0, alt), F = a.p(larg, prof, alt), G = a.p(0, prof, alt);

    a.treViste({ larg, prof, alt }, [10.4, 5.4]);
    a.origine();
    a.passo();

    // Passo 1 · assi
    a.asse("x", 8.4, [0.1, 0.36], [0.15, -0.2]);
    a.asse("z", 10.2, [0.36, 0.62], [-0.2, 0.2]);
    a.asse("y", 4.4, [0.66, 0.9]);
    a.angolo("XY", 0, 45, "45°", 0.92, 3.4);
    a.passo();

    // Passo 2 · faccia di fronte
    a.misura("Larg", O, A, "6 cm", 0.12, "giu");
    a.punto("A", A, "A", 0.14, [-0.1, -0.75]);
    a.misura("Alt", O, D, "8 cm", 0.32, "sx");
    a.punto("D", D, "D", 0.34, [-0.65, -0.1]);
    a.figura("AE", A, E, [0.46, 0.68]);
    a.figura("DE", D, E, [0.68, 0.9]);
    a.punto("E", E, "E", 0.92, [0.15, -0.75]);
    a.passo();

    // Passo 3 · profondità a metà
    a.misura("Prof", O, C, "2 cm", 0.12, "dx", [0, -0.35], true);
    a.punto("C", C, "C", 0.14, [-0.6, 0.1]);
    const w = finestre(3, 0.3, 0.9);
    a.figura("AB", A, B, w[0]);
    a.punto("B", B, "B", w[0][1], [0.25, -0.2]);
    a.figura("EF", E, F, w[1]);
    a.punto("F", F, "F", w[1][1], [0.25, -0.1]);
    a.figura("DG", D, G, w[2]);
    a.punto("G", G, "G", w[2][1], [-0.2, 0.25]);
    a.passo();

    // Passo 4 · faccia di dietro
    const q = finestre(4, 0.12, 0.92);
    a.figura("CB", C, B, q[0]);
    a.figura("GF", G, F, q[1]);
    a.figura("CG", C, G, q[2]);
    a.figura("BF", B, F, q[3]);
    a.passo();

    // Passo 5 · ripasso: 9 spigoli in vista, 3 nascosti
    const r = finestre(12, 0.06, 0.88);
    [["OA", O, A], ["AE", A, E], ["ED", E, D], ["DO", D, O],
      ["AB", A, B], ["BF", B, F], ["FE", F, E], ["FG", F, G], ["GD", G, D]]
      .forEach(([nome, da, fino], i) => a.ripassa(nome, da, fino, r[i]));
    [["OC", O, C], ["CB", C, B], ["CG", C, G]].forEach(([nome, da, fino], i) => a.nascosto(nome, da, fino, r[9 + i]));
    a.faccia("Fronte", [O, A, E, D], "PV");
    a.faccia("Sopra", [D, E, F, G], "PO");
    a.faccia("Fianco", [A, B, F, E], "PL");
    a.passo();
  });

  // ── Tavola 3 · Blocco a L in assonometria cavaliera: il metodo della scatola ──
  // In isometrica, con queste misure, più spigoli cadrebbero sulla stessa linea (8 − 2 = 6, 6 − 2 = 4 = profondità):
  // per questo il blocco della tavola 12 delle proiezioni ortogonali si disegna qui in cavaliera.
  TAVOLE["ass-blocco-a-l-cavaliera"] = creaAssonometria({
    title: "Blocco a L in assonometria cavaliera",
    eyebrow: "Tavola 3 · Il metodo della scatola",
    subtitle: "Blocco a L largo 8 cm, profondo 4 cm e alto 6 cm, con i bracci spessi 2 cm e il braccio alto a sinistra: lo stesso della tavola 12 delle proiezioni ortogonali. Prima disegni la scatola che lo contiene, poi dentro la scatola trovi il blocco.",
    filename: "MC-DIS-2-02_ass-blocco-a-l-cavaliera.ggb",
    proofTitle: "Ogni solido sta in una scatola",
    proofCopy: "Un solido composto è difficile da disegnare tutto in una volta. La scatola invece la sai già fare: è un parallelepipedo con le misure più grandi del solido, qui 8, 4 e 6 cm. Dentro la scatola ogni punto si trova misurando lungo gli assi o lungo linee parallele agli assi. In assonometria si misura solo così: in generale una linea che non è parallela a un asse non conserva la sua misura.",
    equality: "Scatola: 8 × 4 × 6 cm · y: 4 cm → 2 cm · bracci: 2 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Il blocco a L è il pezzo della tavola 12 delle proiezioni ortogonali: largo 8 cm, profondo 4 cm e alto 6 cm, con i due bracci spessi 2 cm e il braccio alto a sinistra. ${VISTE} Sul tuo foglio segna il punto O in basso a sinistra: ti servono almeno 11 cm a destra di O e 9 cm sopra.`, "La scatola è il parallelepipedo più piccolo che contiene tutto il blocco: qui misura 8 cm per 4 cm ed è alta 6 cm."],
      ["Passo 1 · Gli assi", "Traccia i tre assi", "Da O traccia l’asse x, orizzontale verso destra, lungo circa 10 cm, e l’asse z, verticale verso l’alto, lungo circa 8 cm. Poi appoggia la squadra a 45° sull’asse x e traccia l’asse y, corto, circa 2–3 cm: sale di 45° verso destra.", "Sono gli stessi assi della tavola 1, con altre lunghezze."],
      ["Passo 2 · La scatola", "Disegna la scatola di fronte", "Disegna la scatola con linee sottili. Sull’asse x misura 8 cm da O e segna il punto A. Sull’asse z misura 6 cm da O e segna il punto E. Da A traccia una linea verticale, da E una linea orizzontale: dove si incontrano, il rettangolo di fronte è chiuso.", "Linee sottili: alla fine una parte della scatola non farà parte del blocco."],
      ["Passo 3 · La scatola", "Porta la scatola in profondità", "La profondità è 4 cm: lungo l’asse y si disegna a metà, 2 cm. Dai quattro vertici del rettangolo traccia quattro linee parallele all’asse y, lunghe 2 cm. Unisci le loro punte con due linee orizzontali e due verticali: è il rettangolo di dietro. La scatola è completa.", "È il parallelepipedo della tavola 1, con altre misure."],
      ["Passo 4 · Il profilo", "Disegna la L sul rettangolo di fronte", "Lavora sul rettangolo di fronte. Sul lato destro parti da A, sali di 2 cm e segna il punto B. Sul lato in alto parti da E, misura 2 cm verso destra e segna il punto D. Da B traccia una linea orizzontale verso sinistra, da D una linea verticale verso il basso: si incontrano nel punto C. La linea chiusa O, A, B, C, D, E è il profilo a L.", "È uguale alla L del prospetto. Controlla: BC è lungo 6 cm, perché 8 − 2 = 6. CD è lungo 4 cm, perché 6 − 2 = 4."],
      ["Passo 5 · In profondità", "Porta il profilo all’indietro", "Da B, da C e da D traccia tre linee parallele all’asse y, lunghe 2 cm: trovi i punti F, G e H. F e H cadono su due spigoli della scatola. Unisci F e G con una linea orizzontale, poi G con H con una linea verticale.", "FG è lungo 6 cm come BC e GH è lungo 4 cm come CD: dietro il profilo è uguale."],
      ["Passo 6 · Ripasso", "Ripassa gli spigoli", `Ripassa con un tratto deciso gli spigoli in vista: il profilo a L di fronte, i due piani di sopra, la parete del gradino e la faccia di destra. I tre spigoli che partono dal vertice della scatola in basso, dietro, a sinistra sono nascosti: disegnali tratteggiati, cioè a trattini. Le linee della scatola che non fanno parte del blocco restano sottili. Non stupirti se lo spigolo CG sta sulla stessa linea dello spigolo nascosto che parte da O: uno è a trattini, l’altro pieno. ${COLORI}`, "Conta gli spigoli in vista: sono 15. Con i 3 nascosti fanno 18, tutti gli spigoli del blocco."],
    ],
  }, "cavaliera", { sinistra: 2.4, destra: 17.8, alto: 9.4, basso: 1.4 }, (a) => {
    const larg = 8, prof = 4, alt = 6, sp = 2;
    const O = a.O, A = a.p(larg, 0, 0), B = a.p(larg, 0, sp), C = a.p(sp, 0, sp), D = a.p(sp, 0, alt), E = a.p(0, 0, alt);
    const F = a.p(larg, prof, sp), G = a.p(sp, prof, sp), H = a.p(sp, prof, alt);
    // gli altri vertici della scatola: davanti in alto a destra, e i quattro di dietro
    const Tx = a.p(larg, 0, alt);
    const Sy = a.p(0, prof, 0), Sxy = a.p(larg, prof, 0), Tyz = a.p(0, prof, alt), Txyz = a.p(larg, prof, alt);

    a.treViste({
      larg, prof, alt,
      profiloPV: [[0, 0], [larg, 0], [larg, sp], [sp, sp], [sp, alt], [0, alt]],
      lineePO: [[[sp, 0], [sp, prof]]],
      lineePL: [[[0, sp], [prof, sp], true]],      // visto da sinistra il gradino sta dietro il braccio alto
    }, [11.7, 3.6]);
    a.origine();
    a.passo();

    // Passo 1 · assi
    a.asse("x", 10.6, [0.1, 0.36], [0.15, -0.2]);
    a.asse("z", 8.2, [0.36, 0.62], [-0.2, 0.2]);
    a.asse("y", 2.6, [0.66, 0.9], [-1.37, -0.62]);     // corto: prolungato passerebbe per C e per G; nome a metà asse
    a.angolo("XY", 0, 45, "45°", 0.92, 2.4);
    a.passo();

    // Passo 2 · rettangolo di fronte della scatola
    a.misura("Larg", O, A, "8 cm", 0.1, "giu");
    a.punto("A", A, "A", 0.12, [-0.1, -0.75]);
    a.misura("Alt", O, E, "6 cm", 0.3, "sx");
    a.punto("E", E, "E", 0.32, [-0.65, -0.1]);
    a.sottile("FronteA", A, Tx, [0.46, 0.68]);
    a.sottile("FronteB", E, Tx, [0.68, 0.92]);
    a.passo();

    // Passo 3 · la scatola in profondità
    const w = finestre(8, 0.1, 0.92);
    a.sottile("ProfO", O, Sy, w[0]);
    a.sottile("ProfA", A, Sxy, w[1]);
    a.sottile("ProfT", Tx, Txyz, w[2]);
    a.sottile("ProfE", E, Tyz, w[3]);
    a.sottile("DietroA", Sy, Sxy, w[4]);
    a.sottile("DietroB", Sxy, Txyz, w[5]);
    a.sottile("DietroC", Txyz, Tyz, w[6]);
    a.sottile("DietroD", Tyz, Sy, w[7]);
    a.misura("Prof", A, Sxy, "2 cm", 0.3, "dx", [0, -0.3], true);
    a.passo();

    // Passo 4 · profilo a L sul rettangolo di fronte
    a.misura("SpB", A, B, "2 cm", 0.1, "sx", [0, 0]);
    a.punto("B", B, "B", 0.12, [-0.5, 0.15]);
    a.misura("SpD", E, D, "2 cm", 0.3, "giu", [0.1, 0]);
    a.punto("D", D, "D", 0.32, [0.2, -0.75]);
    a.figura("BC", B, C, [0.46, 0.68]);
    a.figura("DC", D, C, [0.68, 0.9]);
    a.punto("C", C, "C", 0.92, [0.75, 0.1]);
    a.passo();

    // Passo 5 · il profilo in profondità
    const v = finestre(5, 0.1, 0.92);
    a.figura("BF", B, F, v[0]);
    a.punto("F", F, "F", v[0][1], [0.25, -0.1]);
    a.figura("CG", C, G, v[1]);
    a.punto("G", G, "G", v[1][1], [0.2, 0.2]);
    a.figura("DH", D, H, v[2]);
    a.punto("H", H, "H", v[2][1], [-0.1, 0.25]);
    a.figura("FG", F, G, v[3]);
    a.figura("GH", G, H, v[4]);
    a.passo();

    // Passo 6 · ripasso: 15 spigoli in vista, 3 nascosti
    const r = finestre(18, 0.04, 0.88);
    [["OA", O, A], ["AB", A, B], ["BC", B, C], ["CD", C, D], ["DE", D, E], ["EO", E, O],
      ["AS", A, Sxy], ["SF", Sxy, F], ["FB", F, B],
      ["FG", F, G], ["GC", G, C],
      ["GH", G, H], ["HD", H, D],
      ["HT", H, Tyz], ["TE", Tyz, E]]
      .forEach(([nome, da, fino], i) => a.ripassa(nome, da, fino, r[i]));
    [["NO", O, Sy], ["NS", Sy, Sxy], ["NT", Sy, Tyz]].forEach(([nome, da, fino], i) => a.nascosto(nome, da, fino, r[15 + i]));
    a.faccia("Fronte", [O, A, B, C, D, E], "PV");
    a.faccia("SopraBasso", [C, B, F, G], "PO");
    a.faccia("SopraAlto", [E, D, H, Tyz], "PO");
    a.faccia("Gradino", [C, G, H, D], "PL");
    a.faccia("FiancoDes", [A, Sxy, F, B], "PL");
    a.passo();
  });

  // ── Tavola 4 · Parallelepipedo in assonometria isometrica ────────────────────
  TAVOLE["ass-parallelepipedo-isometrica"] = creaAssonometria({
    title: "Parallelepipedo in assonometria isometrica",
    eyebrow: "Tavola 4 · Le misure lungo gli assi restano vere",
    subtitle: "Lo stesso parallelepipedo della tavola 1: base di 6 × 4 cm, altezza 8 cm. Gli assi x e y salgono di 30°, uno verso destra e uno verso sinistra. Nessuna misura lungo gli assi si riduce.",
    filename: "MC-DIS-2-02_ass-parallelepipedo-isometrica.ggb",
    proofTitle: "Nessuna misura ridotta, nessun angolo retto",
    proofCopy: "In assonometria isometrica i tre assi del solido sono inclinati allo stesso modo rispetto al foglio. Per questo le tre misure si accorciano allo stesso modo. Nel disegno a mano, per comodità, si riportano tutte per intero, 6, 4 e 8 cm: il solido viene solo un po’ più grande. In cambio nessuna faccia conserva gli angoli retti: i rettangoli diventano parallelogrammi, cioè figure con i lati opposti paralleli. Gli spigoli che nel solido sono paralleli restano paralleli nel disegno.",
    equality: "x: 6 cm · y: 4 cm · z: 8 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `${INTRO} Il parallelepipedo è quello della tavola 1: larghezza 6 cm, profondità 4 cm, altezza 8 cm. ${VISTE} Sul tuo foglio segna il punto O in basso, un po’ a sinistra del centro: ti servono almeno 5 cm a sinistra di O, 7 cm a destra e 14 cm sopra.`, "In isometrica lo spigolo verticale che parte da O è il più vicino a te: per questo O sta in basso, quasi al centro."],
      ["Passo 1 · Gli assi", "Traccia i tre assi", "Traccia una linea orizzontale sottile che passa per O: serve da riferimento. Da O traccia l’asse z, verticale, lungo 8 cm, quanto l’altezza. Poi appoggia la squadra a 30° e 60° sulla linea orizzontale, con l’angolo di 30° in O, e traccia l’asse x: sale di 30° verso destra. Gira la squadra e traccia l’asse y: sale di 30° verso sinistra.", "Controllo: segna un punto a 4 cm da O sull’asse x e uno a 4 cm da O sull’asse y. Devono stare tutti e due 2 cm sopra la linea orizzontale."],
      ["Passo 2 · Tre misure", "Riporta le tre misure sugli assi", "Sull’asse x misura 6 cm da O e segna il punto A. Sull’asse y misura 4 cm da O e segna il punto C. Sull’asse z misura 8 cm da O e segna il punto D. Qui tutte le misure sono vere: non si dimezza niente.", "Da O partono tre spigoli: OA è la larghezza, OC la profondità, OD l’altezza."],
      ["Passo 3 · La base", "Chiudi la base", "Da A traccia una linea parallela all’asse y, lunga 4 cm. Da C traccia una linea parallela all’asse x, lunga 6 cm. Le due linee si incontrano nel punto B. OABC è la base del solido.", "Per tracciare le parallele fai scorrere la squadra lungo la riga, senza girarla."],
      ["Passo 4 · Le altezze", "Alza gli spigoli verticali", "Da A, da B e da C traccia tre linee verticali lunghe 8 cm, come lo spigolo OD: trovi i punti E, F e G.", "Gli spigoli verticali del solido restano verticali nel disegno e hanno tutti la stessa lunghezza."],
      ["Passo 5 · Sopra", "Chiudi la faccia di sopra", "Unisci D con E e G con F: sono due linee parallele all’asse x. Unisci E con F e D con G: sono due linee parallele all’asse y.", "La faccia di sopra è uguale alla base, 8 cm più in alto."],
      ["Passo 6 · Ripasso", "Ripassa gli spigoli", `Guardi il solido di spigolo, tanto di fronte quanto da sinistra, e dall’alto. Vedi tre facce: OAED, che è quella di fronte; OCGD, che è quella di sinistra; DEFG, che è quella di sopra. Ripassa i loro spigoli con un tratto deciso. I tre spigoli che partono da B stanno dietro: disegnali tratteggiati, cioè a trattini. ${COLORI}`, "Come nella cavaliera: 9 spigoli in vista e 3 nascosti."],
    ],
  }, "isometrica", { sinistra: 5.6, destra: 13.4, alto: 14.2, basso: 1.2 }, (a) => {
    const larg = 6, prof = 4, alt = 8;
    const O = a.O, A = a.p(larg, 0, 0), B = a.p(larg, prof, 0), C = a.p(0, prof, 0);
    const D = a.p(0, 0, alt), E = a.p(larg, 0, alt), F = a.p(larg, prof, alt), G = a.p(0, prof, alt);

    a.treViste({ larg, prof, alt }, [8.6, 7.2]);
    a.origine();
    a.passo();

    // Passo 1 · assi
    a.orizzontale(-5.2, 7.2, [0.08, 0.26]);
    a.asse("z", 8, [0.26, 0.46], [-0.75, -0.6]);
    a.asse("x", 7.6, [0.48, 0.68]);
    a.angolo("X", 0, 30, "30°", 0.7, 2.2);
    a.asse("y", 5.4, [0.72, 0.92], [-0.45, 0.15]);
    a.angolo("Y", 150, 180, "30°", 0.94, 2.2);
    a.passo();

    // Passo 2 · le tre misure sugli assi
    a.misura("Larg", O, A, "6 cm", 0.12, "giu", [1.1, 0.15]);
    a.punto("A", A, "A", 0.14, [0.25, -0.5]);
    a.misura("Prof", O, C, "4 cm", 0.4, "giu", [-1.25, 0.2]);
    a.punto("C", C, "C", 0.42, [-0.6, -0.45]);
    a.misura("Alt", O, D, "8 cm", 0.68, "dx", [0, -1.35]);
    a.punto("D", D, "D", 0.7, [0.2, 0.2]);
    a.passo();

    // Passo 3 · base
    a.figura("AB", A, B, [0.12, 0.5]);
    a.figura("CB", C, B, [0.5, 0.9]);
    a.punto("B", B, "B", 0.92, [-0.17, -0.8]);
    a.passo();

    // Passo 4 · altezze
    const w = finestre(3, 0.12, 0.9);
    a.figura("AE", A, E, w[0]);
    a.punto("E", E, "E", w[0][1], [0.25, -0.1]);
    a.figura("BF", B, F, w[1]);
    a.punto("F", F, "F", w[1][1], [-0.15, 0.3]);
    a.figura("CG", C, G, w[2]);
    a.punto("G", G, "G", w[2][1], [-0.6, 0]);
    a.passo();

    // Passo 5 · faccia di sopra
    const q = finestre(4, 0.12, 0.92);
    a.figura("DE", D, E, q[0]);
    a.figura("GF", G, F, q[1]);
    a.figura("EF", E, F, q[2]);
    a.figura("DG", D, G, q[3]);
    a.passo();

    // Passo 6 · ripasso: 9 spigoli in vista, 3 nascosti
    const r = finestre(12, 0.06, 0.88);
    [["OA", O, A], ["AE", A, E], ["ED", E, D], ["DO", D, O],
      ["OC", O, C], ["CG", C, G], ["GD", G, D], ["EF", E, F], ["FG", F, G]]
      .forEach(([nome, da, fino], i) => a.ripassa(nome, da, fino, r[i]));
    [["AB", A, B], ["CB", C, B], ["BF", B, F]].forEach(([nome, da, fino], i) => a.nascosto(nome, da, fino, r[9 + i]));
    a.faccia("Fronte", [O, A, E, D], "PV");
    a.faccia("Sopra", [D, E, F, G], "PO");
    a.faccia("Fianco", [O, C, G, D], "PL");
    a.passo();
  });

  // ── Tavola 10 · Parallelepipedo in assonometria monometrica (MC-DIS-3-01) ─────
  TAVOLE["ass-parallelepipedo-monometrica"] = creaAssonometria({
    title: "Parallelepipedo in assonometria monometrica",
    eyebrow: "Tavola 10 · La base resta un rettangolo vero",
    subtitle: "Lo stesso parallelepipedo delle tavole 1 e 4: base di 6 × 4 cm, altezza 8 cm. L’asse x sale di 30° verso destra, l’asse y di 60° verso sinistra: tra i due c’è un angolo retto.",
    filename: "MC-DIS-3-01_ass-parallelepipedo-monometrica.ggb",
    appletHeight: 740,
    proofTitle: "La pianta non cambia",
    proofCopy: "In assonometria monometrica gli assi x e y formano un angolo retto, come nella realtà. Per questo la base si disegna con la sua vera forma: è il rettangolo del PO, soltanto girato di 30°. Anche le altezze si riportano per intero. È l’assonometria adatta quando conta di più ciò che si vede dall’alto: la pianta di una stanza, di un edificio, di un quartiere. In cambio il solido sembra visto molto dall’alto e più slanciato di quanto è.",
    equality: "x: 6 cm · y: 4 cm · z: 8 cm · tra x e y: 90°",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `${INTRO} Il parallelepipedo è quello delle tavole 1 e 4: larghezza 6 cm, profondità 4 cm, altezza 8 cm. ${VISTE} Sul tuo foglio segna il punto O in basso, un po’ a sinistra del centro: ti servono almeno 4 cm a sinistra di O, 7 cm a destra e 15 cm sopra.`, "Monometrica vuol dire «una sola misura»: sui tre assi si usa la stessa unità, senza riduzioni. Su questo è uguale all’isometrica: le due si distinguono per gli angoli degli assi, 30° e 60° invece di 30° e 30°."],
      ["Passo 1 · Gli assi", "Traccia i tre assi", "Traccia una linea orizzontale sottile che passa per O: serve da riferimento. Da O traccia l’asse z, verticale, lungo 8 cm, quanto l’altezza. Appoggia la squadra a 30° e 60° sulla linea orizzontale, con l’angolo di 30° in O, e traccia l’asse x: sale di 30° verso destra. Poi girala dall’altra parte, questa volta con l’angolo di 60° in O, e traccia l’asse y: sale di 60° verso sinistra.", "Controllo: tra l’asse x e l’asse y c’è un angolo retto, perché 180° − 30° − 60° = 90°. Verificalo con la squadra."],
      ["Passo 2 · La base", "Disegna la base in vera forma", "Sull’asse x misura 6 cm da O e segna il punto A. Sull’asse y misura 4 cm da O e segna il punto C. Da A traccia una linea parallela all’asse y, da C una linea parallela all’asse x: si incontrano nel punto B.", "OABC è un rettangolo vero di 6 cm per 4 cm, uguale a quello che disegni nel PO. Controlla i quattro angoli retti con la squadra."],
      ["Passo 3 · Le altezze", "Alza gli spigoli verticali", "Sull’asse z misura 8 cm da O e segna il punto D. Da A, da B e da C traccia tre linee verticali lunghe 8 cm: trovi i punti E, F e G.", "Le altezze sono vere: in monometrica nessuna misura si riduce."],
      ["Passo 4 · Sopra", "Chiudi la faccia di sopra", "Unisci D con E e G con F: sono due linee parallele all’asse x. Unisci E con F e D con G: sono due linee parallele all’asse y.", "DEFG è un altro rettangolo vero di 6 cm per 4 cm: è la base, 8 cm più in alto."],
      ["Passo 5 · Ripasso", "Ripassa gli spigoli", `Guardi il solido di fronte, da sinistra e molto dall’alto. Vedi tre facce: OAED, che è quella di fronte; OCGD, che è quella di sinistra; DEFG, che è quella di sopra. Ripassa i loro spigoli con un tratto deciso. I tre spigoli che partono da B stanno dietro: disegnali tratteggiati, cioè a trattini. ${COLORI}`, "Confronta con la tavola 4: lì la base era un parallelogramma, qui è un rettangolo vero."],
    ],
  }, "monometrica", { sinistra: 3.8, destra: 13.4, alto: 15.6, basso: 1.2 }, (a) => {
    const larg = 6, prof = 4, alt = 8;
    const O = a.O, A = a.p(larg, 0, 0), B = a.p(larg, prof, 0), C = a.p(0, prof, 0);
    const D = a.p(0, 0, alt), E = a.p(larg, 0, alt), F = a.p(larg, prof, alt), G = a.p(0, prof, alt);

    a.treViste({ larg, prof, alt }, [8.6, 8.2]);
    a.origine();
    a.passo();

    // Passo 1 · assi
    a.orizzontale(-3.4, 7.2, [0.08, 0.26]);
    a.asse("z", 8, [0.26, 0.46], [-0.75, -0.6]);
    a.asse("x", 7.6, [0.48, 0.66]);
    a.angolo("X", 0, 30, "30°", 0.68, 2.2);
    a.asse("y", 5.2, [0.7, 0.88], [-0.5, 0.1]);
    a.angolo("Y", 120, 180, "60°", 0.9, 1.7);
    a.angoloRetto("XY", 30, 120, 0.95);
    a.passo();

    // Passo 2 · base in vera forma
    a.misura("Larg", O, A, "6 cm", 0.1, "giu", [1.1, 0.15]);
    a.punto("A", A, "A", 0.12, [0.25, -0.5]);
    a.misura("Prof", O, C, "4 cm", 0.3, "sx", [-0.1, 0.1]);
    a.punto("C", C, "C", 0.32, [-0.65, -0.2]);
    a.figura("AB", A, B, [0.46, 0.68]);
    a.figura("CB", C, B, [0.68, 0.9]);
    a.punto("B", B, "B", 0.92, [0.2, 0.25]);
    a.passo();

    // Passo 3 · altezze
    a.misura("Alt", O, D, "8 cm", 0.1, "dx", [0, -1.35]);
    a.punto("D", D, "D", 0.12, [-0.6, 0.1]);
    const w = finestre(3, 0.26, 0.9);
    a.figura("AE", A, E, w[0]);
    a.punto("E", E, "E", w[0][1], [0.25, -0.1]);
    a.figura("BF", B, F, w[1]);
    a.punto("F", F, "F", w[1][1], [-0.15, 0.3]);
    a.figura("CG", C, G, w[2]);
    a.punto("G", G, "G", w[2][1], [-0.6, 0]);
    a.passo();

    // Passo 4 · faccia di sopra
    const q = finestre(4, 0.12, 0.92);
    a.figura("DE", D, E, q[0]);
    a.figura("GF", G, F, q[1]);
    a.figura("EF", E, F, q[2]);
    a.figura("DG", D, G, q[3]);
    a.passo();

    // Passo 5 · ripasso: 9 spigoli in vista, 3 nascosti
    const r = finestre(12, 0.06, 0.88);
    [["OA", O, A], ["AE", A, E], ["ED", E, D], ["DO", D, O],
      ["OC", O, C], ["CG", C, G], ["GD", G, D], ["EF", E, F], ["FG", F, G]]
      .forEach(([nome, da, fino], i) => a.ripassa(nome, da, fino, r[i]));
    [["AB", A, B], ["CB", C, B], ["BF", B, F]].forEach(([nome, da, fino], i) => a.nascosto(nome, da, fino, r[9 + i]));
    a.faccia("Fronte", [O, A, E, D], "PV");
    a.faccia("Sopra", [D, E, F, G], "PO");
    a.faccia("Fianco", [O, C, G, D], "PL");
    a.passo();
  });

  // ── Tavola 12 · Parallelepipedo in assonometria militare (MC-DIS-3-01) ───────
  TAVOLE["ass-parallelepipedo-militare"] = creaAssonometria({
    title: "Parallelepipedo in assonometria militare",
    eyebrow: "Tavola 12 · La pianta vera, l’altezza a metà",
    subtitle: "Lo stesso parallelepipedo delle tavole 1, 4 e 10: base di 6 × 4 cm, altezza 8 cm. Gli assi x e y salgono di 45°, uno verso destra e uno verso sinistra; l’altezza si disegna a metà.",
    filename: "MC-DIS-3-01_ass-parallelepipedo-militare.ggb",
    appletHeight: 700,
    proofTitle: "Come da un aereo",
    proofCopy: "In assonometria militare, come nella monometrica, gli assi x e y formano un angolo retto: la base si disegna con la sua vera forma, girata di 45°. Si chiama così perché si usava per progettare fortificazioni; i libri la chiamano anche «aerea». Se l’altezza restasse intera il solido sembrerebbe molto più alto di quanto è: per questo si dimezza. Con l’altezza intera è la monometrica a 45°.",
    equality: "x: 6 cm · y: 4 cm · z: 8 cm → 4 cm · tra x e y: 90°",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `${INTRO} Il parallelepipedo è quello delle tavole 1, 4 e 10: larghezza 6 cm, profondità 4 cm, altezza 8 cm. ${VISTE} Sul tuo foglio segna il punto O in basso, un po’ a sinistra del centro: ti servono almeno 4 cm a sinistra di O, 6 cm a destra e 12 cm sopra.`, "Ti basta la squadra a 45°: gli assi x e y sono inclinati di 45° tutti e due."],
      ["Passo 1 · Gli assi", "Traccia i tre assi", "Traccia una linea orizzontale sottile che passa per O: serve da riferimento. Da O traccia l’asse z, verticale, lungo 4 cm: è metà degli 8 cm dell’altezza, perché in militare l’altezza si dimezza. Appoggia la squadra a 45° sulla linea orizzontale, con l’angolo di 45° in O, e traccia l’asse x: sale di 45° verso destra. Poi girala dall’altra parte e traccia l’asse y: sale di 45° verso sinistra.", "Controllo: tra l’asse x e l’asse y c’è un angolo retto, perché 180° − 45° − 45° = 90°. Verificalo con la squadra."],
      ["Passo 2 · La base", "Disegna la base in vera forma", "Sull’asse x misura 6 cm da O e segna il punto A. Sull’asse y misura 4 cm da O e segna il punto C. Da A traccia una linea parallela all’asse y, da C una linea parallela all’asse x: si incontrano nel punto B.", "OABC è un rettangolo vero di 6 cm per 4 cm, uguale a quello del PO, girato di 45°."],
      ["Passo 3 · Le altezze", "Alza gli spigoli a metà", "L’altezza è 8 cm, ma in verticale si disegna a metà: 4 cm. Da A traccia una linea verticale lunga 4 cm: trovi il punto E. Fai lo stesso da B e da C: trovi i punti F e G. Il punto D è la punta dell’asse z, 4 cm sopra O.", "È l’unica misura ridotta: la base resta vera, l’altezza si dimezza."],
      ["Passo 4 · Sopra", "Chiudi la faccia di sopra", "Unisci D con E e G con F: sono due linee parallele all’asse x. Unisci E con F e D con G: sono due linee parallele all’asse y.", "DEFG è un altro rettangolo vero di 6 cm per 4 cm: è la base, 4 cm più in alto sul foglio."],
      ["Passo 5 · Ripasso", "Ripassa gli spigoli", `Guardi il solido di spigolo e molto dall’alto, come da un aereo. Vedi tre facce: OAED, che è quella di fronte; OCGD, che è quella di sinistra; DEFG, che è quella di sopra. Ripassa i loro spigoli con un tratto deciso. I tre spigoli che partono da B stanno dietro: disegnali tratteggiati, cioè a trattini. ${COLORI}`, "Confronta con la tavola 10: la base è un rettangolo vero in tutte e due, qui girato di 45° invece che di 30°."],
    ],
  }, "militare", { sinistra: 3.8, destra: 13.4, alto: 11.6, basso: 1.2 }, (a) => {
    const larg = 6, prof = 4, alt = 8;
    const O = a.O, A = a.p(larg, 0, 0), B = a.p(larg, prof, 0), C = a.p(0, prof, 0);
    const D = a.p(0, 0, alt), E = a.p(larg, 0, alt), F = a.p(larg, prof, alt), G = a.p(0, prof, alt);

    a.treViste({ larg, prof, alt }, [8.4, 4.4]);
    a.origine();
    a.passo();

    // Passo 1 · assi
    a.orizzontale(-3.6, 6.4, [0.08, 0.26]);
    a.asse("z", 4, [0.26, 0.46], [-0.75, -0.6]);
    a.asse("x", 7.4, [0.48, 0.66]);
    a.angolo("X", 0, 45, "45°", 0.68, 1.9);
    a.asse("y", 5.4, [0.7, 0.88], [-0.5, 0.1]);
    a.angolo("Y", 135, 180, "45°", 0.9, 1.9);
    a.angoloRetto("XY", 45, 135, 0.95);
    a.passo();

    // Passo 2 · base in vera forma
    a.misura("Larg", O, A, "6 cm", 0.1, "giu", [1.2, 0.2]);
    a.punto("A", A, "A", 0.12, [0.25, -0.5]);
    a.misura("Prof", O, C, "4 cm", 0.3, "sx", [-0.1, 0.1]);
    a.punto("C", C, "C", 0.32, [-0.65, -0.2]);
    a.figura("AB", A, B, [0.46, 0.68]);
    a.figura("CB", C, B, [0.68, 0.9]);
    a.punto("B", B, "B", 0.92, [-0.17, -0.8]);
    a.passo();

    // Passo 3 · altezze dimezzate
    const w = finestre(3, 0.12, 0.84);
    a.figura("AE", A, E, w[0]);
    a.misura("Alt", A, E, "8 cm → 4 cm", w[0][1], "dx");
    a.punto("E", E, "E", w[0][1], [0.25, 0.1]);
    a.figura("BF", B, F, w[1]);
    a.punto("F", F, "F", w[1][1], [-0.15, 0.3]);
    a.figura("CG", C, G, w[2]);
    a.punto("G", G, "G", w[2][1], [-0.6, 0]);
    a.punto("D", D, "D", 0.9, [0.2, 0.2]);
    a.passo();

    // Passo 4 · faccia di sopra
    const q = finestre(4, 0.12, 0.92);
    a.figura("DE", D, E, q[0]);
    a.figura("GF", G, F, q[1]);
    a.figura("EF", E, F, q[2]);
    a.figura("DG", D, G, q[3]);
    a.passo();

    // Passo 5 · ripasso: 9 spigoli in vista, 3 nascosti
    const r = finestre(12, 0.06, 0.88);
    [["OA", O, A], ["AE", A, E], ["ED", E, D], ["DO", D, O],
      ["OC", O, C], ["CG", C, G], ["GD", G, D], ["EF", E, F], ["FG", F, G]]
      .forEach(([nome, da, fino], i) => a.ripassa(nome, da, fino, r[i]));
    [["AB", A, B], ["CB", C, B], ["BF", B, F]].forEach(([nome, da, fino], i) => a.nascosto(nome, da, fino, r[9 + i]));
    a.faccia("Fronte", [O, A, E, D], "PV");
    a.faccia("Sopra", [D, E, F, G], "PO");
    a.faccia("Fianco", [O, C, G, D], "PL");
    a.passo();
  });

  // ── Tavola 13 · Il parallelepipedo isometrico con riga e squadra ─────────────
  // Come nei libri: la riga sta ferma in orizzontale, la squadra a 30° e 60° ci scorre sopra. Appoggiata da un verso
  // dà le linee parallele all'asse x, girata dà quelle parallele all'asse y, in piedi dà le verticali (squadre.js).
  TAVOLE["ass-parallelepipedo-isometrica-squadre"] = creaAssonometria({
    title: "Il parallelepipedo isometrico con riga e squadra",
    eyebrow: "Tavola 13 · Riga e squadra a 30° e 60°",
    subtitle: "Lo stesso parallelepipedo della tavola 4: base di 6 × 4 cm, altezza 8 cm. Questa volta ogni linea si traccia lungo il bordo della squadra a 30° e 60°, che scorre su una riga tenuta ferma in orizzontale.",
    filename: "MC-DIS-2-02_ass-parallelepipedo-isometrica-squadre.ggb",
    proofTitle: "Perché basta una squadra",
    proofCopy: "In isometrica ogni spigolo del solido va in una di tre direzioni: verticale, 30° verso destra, 30° verso sinistra. La squadra a 30° e 60° le dà tutte e tre. Appoggiata sulla riga con il cateto lungo, il suo lato più lungo sale di 30°: verso destra o verso sinistra, secondo come la giri. In piedi sulla riga, il cateto lungo è verticale. Se la fai scorrere lungo la riga senza girarla, il lato che usi resta parallelo a sé stesso: per questo tutte le linee tracciate in una posizione della squadra sono parallele.",
    equality: "Tre direzioni: verticale, 30° a destra, 30° a sinistra",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara gli strumenti", `${INTRO} Il parallelepipedo è quello della tavola 4: larghezza 6 cm, profondità 4 cm, altezza 8 cm. ${VISTE} Ti servono una riga lunga da tenere ferma, un righello per misurare, la squadra a 30° e 60° e una matita. Segna il punto O in basso, un po’ a sinistra del centro del foglio: ti servono almeno 5 cm a sinistra di O, 7 cm a destra e 14 cm sopra.`, "La riga la tieni ferma con una mano; con l’altra fai scorrere la squadra appoggiata alla riga."],
      ["Passo 1 · Riga", "La linea orizzontale", "Appoggia la riga in orizzontale, con il bordo che passa per O. Lungo il bordo traccia una linea sottile: è il riferimento da cui partono gli assi. Da qui in poi la riga resta ferma fino alla fine del passo 7.", "Tutte le linee del disegno si tracciano con la squadra appoggiata a questa riga."],
      ["Passo 2 · Squadra in piedi", "L’asse z", "Appoggia sulla riga la squadra a 30° e 60°, in piedi: il cateto lungo è verticale. Falla scorrere fino a O e, seguendo il cateto lungo, traccia l’asse z: almeno 8 cm.", "La squadra in piedi sulla riga dà sempre linee perpendicolari alla riga, cioè verticali."],
      ["Passo 3 · Squadra a 30°", "L’asse x", "Stendi la squadra sulla riga con il cateto lungo appoggiato e l’angolo di 30° a sinistra. Falla scorrere finché l’angolo di 30° tocca O. Lungo il lato più lungo, l’ipotenusa, traccia l’asse x: sale di 30° verso destra.", "Il cateto lungo è quello opposto all’angolo di 60°: appoggiato sulla riga, fa salire l’ipotenusa di 30°."],
      ["Passo 4 · Squadra girata", "L’asse y", "Gira la squadra: ora l’angolo di 30° sta a destra. Falla scorrere finché l’angolo di 30° tocca O e lungo l’ipotenusa traccia l’asse y: sale di 30° verso sinistra.", "Gli assi x e y hanno la stessa inclinazione, uno verso destra e uno verso sinistra."],
      ["Passo 5 · Misure", "Riporta le tre misure sugli assi", "Con il righello misura 6 cm da O sull’asse x e segna il punto A. Misura 4 cm sull’asse y e segna il punto C. Misura 8 cm sull’asse z e segna il punto D.", "In isometrica tutte le misure lungo gli assi sono vere: non si dimezza niente."],
      ["Passo 6 · La base", "Chiudi la base", "Con l’angolo di 30° a destra, fai scorrere la squadra sulla riga finché l’ipotenusa passa per A: traccia da A una linea verso sinistra, parallela all’asse y. Poi gira la squadra, con l’angolo di 30° a sinistra, e falla scorrere finché l’ipotenusa passa per C: traccia da C una linea verso destra, parallela all’asse x. Le due linee si incontrano nel punto B.", "Controlla con il righello: AB misura 4 cm e CB misura 6 cm."],
      ["Passo 7 · Squadra in piedi", "Alza gli spigoli verticali", "Rimetti la squadra in piedi sulla riga. Falla scorrere fino ad A e traccia una verticale lunga 8 cm: trovi il punto E. Fai lo stesso da B e da C: trovi i punti F e G.", "I tre spigoli verticali sono lunghi 8 cm, come OD."],
      ["Passo 8 · Riga più in alto", "Due spigoli della faccia di sopra", "Prima di spostare la riga, appoggia la squadra in piedi un po’ più a sinistra di O, traccia una verticale corta e segna su di essa 8 cm sopra la linea del passo 1. Poi sposta la riga in alto e appoggiala su D e su quel segno: la squadra appoggiata in basso non arriva fin lassù. Appoggia la squadra con l’angolo di 30° a sinistra e falla scorrere finché l’ipotenusa passa per D: unisci D con E. Falla scorrere verso sinistra finché l’ipotenusa passa per G: unisci G con F.", "DE e GF sono parallele all’asse x: la squadra non la giri, la fai solo scorrere."],
      ["Passo 9 · Squadra girata", "Chiudi la faccia di sopra", "Gira la squadra, con l’angolo di 30° a destra. Falla scorrere finché l’ipotenusa passa per D e unisci D con G. Poi falla scorrere verso destra finché l’ipotenusa passa per E e unisci E con F.", "DG ed EF sono parallele all’asse y."],
      ["Passo 10 · Ripasso", "Ripassa gli spigoli", `Togli la riga e la squadra. Ripassa con un tratto deciso gli spigoli delle tre facce in vista: OAED davanti, OCGD a sinistra, DEFG sopra. I tre spigoli che partono da B stanno dietro: disegnali tratteggiati, cioè a trattini. ${COLORI}`, "Come nella tavola 4: 9 spigoli in vista e 3 nascosti."],
    ],
  }, "isometrica", { sinistra: 5.6, destra: 13.4, alto: 14.2, basso: 2.2 }, (a, k, t) => {
    const S = window.GGB_SQUADRE(k, t);
    const larg = 6, prof = 4, alt = 8;
    const O = a.O, A = a.p(larg, 0, 0), B = a.p(larg, prof, 0), C = a.p(0, prof, 0);
    const D = a.p(0, 0, alt), E = a.p(larg, 0, alt), F = a.p(larg, prof, alt), G = a.p(0, prof, alt);
    const cot30 = Math.sqrt(3);
    /** Dove la linea a 30° (verso destra o verso sinistra) che passa per q incontra il bordo della riga, all'altezza y. */
    const piede = (q, y, versoDestra) => [q[0] + (versoDestra ? -1 : 1) * (q[1] - y) * cot30, y];

    a.treViste({ larg, prof, alt }, [8.6, 7.2]);
    a.origine();
    a.passo();

    // Passo 1 · riga e linea orizzontale
    S.strumento("R1", "riga", S.riga(-1.5), S.riga(0), [0.04, 0.35]);
    a.orizzontale(-5.2, 7.2, [0.42, 0.92]);
    a.passo();

    // Passo 2 · squadra in piedi: asse z
    S.strumento("R2", "riga", S.riga(0), null, [0.01, 0.02]);
    S.strumento("Q2", "3060", S.verticale([-3, 0]), S.verticale([0, 0]), [0.04, 0.32]);
    a.asse("z", 8, [0.38, 0.92], [-0.75, -0.6]);
    a.passo();

    // Passo 3 · squadra a 30°: asse x
    S.strumento("R3", "riga", S.riga(0), null, [0.01, 0.02]);
    S.strumento("Q3", "3060", S.trenta([-3, 0]), S.trenta([0, 0]), [0.04, 0.3]);
    a.asse("x", 7.6, [0.36, 0.8]);
    a.angolo("X", 0, 30, "30°", 0.84, 2.2);
    a.passo();

    // Passo 4 · squadra girata: asse y
    S.strumento("R4", "riga", S.riga(0), null, [0.01, 0.02]);
    S.strumento("Q4", "3060", S.trentaSinistra([3, 0]), S.trentaSinistra([0, 0]), [0.04, 0.3]);
    a.asse("y", 5.4, [0.36, 0.8], [-0.45, 0.15]);
    a.angolo("Y", 150, 180, "30°", 0.84, 2.2);
    a.passo();

    // Passo 5 · le tre misure (con il righello: niente squadre)
    a.misura("Larg", O, A, "6 cm", 0.12, "giu", [1.1, 0.15]);
    a.punto("A", A, "A", 0.14, [0.25, -0.5]);
    a.misura("Prof", O, C, "4 cm", 0.4, "giu", [-1.25, 0.2]);
    a.punto("C", C, "C", 0.42, [-0.6, -0.45]);
    a.misura("Alt", O, D, "8 cm", 0.68, "dx", [0, -1.35]);
    a.punto("D", D, "D", 0.7, [0.2, 0.2]);
    a.passo();

    // Passo 6 · base: AB (parallela a y) e CB (parallela a x)
    S.strumento("R6", "riga", S.riga(0), null, [0.01, 0.02]);
    const pA = piede(A, 0, false), pC = piede(C, 0, true);
    S.strumento("Q6a", "3060", S.trentaSinistra([pA[0] + 2.5, 0]), S.trentaSinistra(pA), [0.04, 0.22], { via: 0.5 });
    a.figura("AB", A, B, [0.25, 0.46]);
    S.strumento("Q6b", "3060", S.trenta([pC[0] - 2.5, 0]), S.trenta(pC), [0.52, 0.68]);
    a.figura("CB", C, B, [0.71, 0.9]);
    a.punto("B", B, "B", 0.92, [-0.17, -0.8]);
    a.passo();

    // Passo 7 · squadra in piedi: spigoli verticali da A, B, C
    S.strumento("R7", "riga", S.riga(0), null, [0.01, 0.02]);
    S.strumento("Q7a", "3060", S.verticale([A[0] + 2.5, 0]), S.verticale([A[0], 0]), [0.03, 0.14], { via: 0.36 });
    a.figura("AE", A, E, [0.15, 0.33]);
    a.punto("E", E, "E", 0.34, [0.25, -0.1]);
    S.strumento("Q7b", "3060", S.verticale([A[0], 0]), S.verticale([B[0], 0]), [0.36, 0.44], { via: 0.66 });
    a.figura("BF", B, F, [0.45, 0.63]);
    a.punto("F", F, "F", 0.64, [-0.15, 0.3]);
    S.strumento("Q7c", "3060", S.verticale([B[0], 0]), S.verticale([C[0], 0]), [0.66, 0.74]);
    a.figura("CG", C, G, [0.75, 0.93]);
    a.punto("G", G, "G", 0.94, [-0.6, 0]);
    a.passo();

    // Passo 8 · riga per D: DE e GF (parallele a x)
    const yR = D[1], daR = -15;                           // la riga arriva fino a x = 11: la squadra resta appoggiata
    S.strumento("R8", "riga", S.riga(0, daR), S.riga(yR, daR), [0.03, 0.24]);
    const pG = piede(G, yR, true);
    S.strumento("Q8a", "3060", S.trenta([D[0] - 2.5, yR]), S.trenta(D), [0.28, 0.4], { via: 0.62 });
    a.figura("DE", D, E, [0.42, 0.6]);
    S.strumento("Q8b", "3060", S.trenta(D), S.trenta(pG), [0.62, 0.72]);
    a.figura("GF", G, F, [0.74, 0.94]);
    a.passo();

    // Passo 9 · squadra girata: DG ed EF (parallele a y)
    S.strumento("R9", "riga", S.riga(yR, daR), null, [0.01, 0.02]);
    const pE = piede(E, yR, false);
    S.strumento("Q9a", "3060", S.trentaSinistra([D[0] + 2.5, yR]), S.trentaSinistra(D), [0.04, 0.18], { via: 0.42 });
    a.figura("DG", D, G, [0.2, 0.4]);
    S.strumento("Q9b", "3060", S.trentaSinistra(D), S.trentaSinistra(pE), [0.44, 0.58]);
    a.figura("EF", E, F, [0.62, 0.92]);
    a.passo();

    // Passo 10 · ripasso: 9 spigoli in vista, 3 nascosti
    const r = finestre(12, 0.06, 0.88);
    [["OA", O, A], ["AE", A, E], ["ED", E, D], ["DO", D, O],
      ["OC", O, C], ["CG", C, G], ["GD", G, D], ["EF", E, F], ["FG", F, G]]
      .forEach(([nome, da, fino], i) => a.ripassa(nome, da, fino, r[i]));
    [["AB", A, B], ["CB", C, B], ["BF", B, F]].forEach(([nome, da, fino], i) => a.nascosto(nome, da, fino, r[9 + i]));
    a.faccia("Fronte", [O, A, E, D], "PV");
    a.faccia("Sopra", [D, E, F, G], "PO");
    a.faccia("Fianco", [O, C, G, D], "PL");
    a.passo();
  });
})();
