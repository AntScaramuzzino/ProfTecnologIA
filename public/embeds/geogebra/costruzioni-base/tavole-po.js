/*
 * Tavole di proiezioni ortogonali (P.O.) — MC-DIS-2-01.
 *
 * Ogni tavola è un foglio a quattro riquadri (PV in alto a sinistra, PL in alto a destra, PO in basso
 * a sinistra, il quarto per gli archi di riporto) costruito con lo stesso vocabolario delle tavole di
 * MC-DIS-1-01 (`creaTavola`, in tavole.js). Qui sopra c'è uno strato in più, `creaFoglio`, che conosce
 * il foglio delle P.O.: piani colorati, linea di terra, linee di proiezione, archi di riporto, ripasso.
 *
 * Unità: 1 = 1 cm. Origine O = incrocio tra linea di terra (LT) e asse verticale.
 *   PO  x ≤ 0, y ≤ 0   →  x = −(distanza dal PL),  y = −(distanza dal PV)
 *   PV  x ≤ 0, y ≥ 0   →  x = −(distanza dal PL),  y = +(distanza dal PO)
 *   PL  x ≥ 0, y ≥ 0   →  x = +(distanza dal PV),  y = +(distanza dal PO)
 *
 * Nomi (decidono lo stile, vedi STILI qui sotto):
 *   linePr…  linea di proiezione (sottile, grigia)      lineFg…  figura in costruzione (blu)
 *   arcR…    arco di riporto (compasso, arancione)      draw…    ripasso finale (nero; tratteggiato se nascosto)
 *   mis…     misura messa in evidenza (con scritta)     tac…     trattino di misura
 * I punti hanno l'iniziale maiuscola e non usano nomi tipo «A1» (in GeoGebra è una cella del foglio di calcolo).
 * Ogni passo si chiude con `f.passo()`: gli strumenti del foglio ricordano da soli che cosa hanno creato.
 * Il numero di `f.passo()` deve essere uguale al numero di voci in `steps`.
 * Come aggiungere una tavola: skill «tavole-geogebra».
 */
(() => {
  "use strict";

  const { creaTavola, finestre, xy } = window.GGB_CREA;
  const TAVOLE = window.GGB_TAVOLE;

  const INCHIOSTRO = [15, 23, 42];
  const STILI = {
    proiezione: { color: [100, 116, 139], thickness: 2, lineStyle: 0 },
    figura: { color: [30, 64, 175], thickness: 4, lineStyle: 0 },
    misura: { color: [194, 65, 12], thickness: 5, lineStyle: 0 },
    tacca: { color: [194, 65, 12], thickness: 5, lineStyle: 0 },
    ripasso: { color: [0, 0, 0], thickness: 6, lineStyle: 0 },
    nascosto: { color: [0, 0, 0], thickness: 4, lineStyle: 2 },
    servizio: { color: [194, 65, 12], pointSize: 4 },
  };
  const PIANI = {
    PV: { colore: [147, 197, 253], testo: [29, 78, 216] },
    PL: { colore: [249, 168, 212], testo: [190, 24, 93] },
    PO: { colore: [253, 224, 71], testo: [146, 64, 14] },
  };

  /**
   * Foglio delle proiezioni ortogonali.
   * `limiti`: quanto si estende il foglio dall'origine, in cm → { sinistra, destra, alto, basso }.
   * `costruisci(f, k)`: f = strumenti del foglio (qui sotto), k = vocabolario di creaTavola.
   */
  function creaFoglio(meta, limiti, costruisci) {
    const { sinistra, destra, alto, basso } = limiti;
    return creaTavola({
      level: "I",
      appletHeight: 660,
      fontSize: 20,
      coord: [-sinistra - 1.1, destra + 0.6, -basso - 0.6, alto + 0.6],
      ...meta,
    }, (k, t) => {
      t.areas = [];
      t.styles = {};
      const stile = (nome, s) => { t.styles[nome] = { ...(t.styles[nome] || {}), ...s }; return nome; };
      const O = [0, 0];
      // Nomi con gli apici (A′, A″, A‴): scritti in LaTeX, altrimenti a grandezza normale ″ e ‴ non si distinguono.
      const inLatex = (nome) => nome.replace(/‴/g, "'''").replace(/″/g, "''").replace(/′/g, "'");
      const haApici = (nome) => /[′″‴]/.test(nome);

      // Ogni strumento registra qui i nomi che crea: `f.passo()` chiude il passo e li consegna al motore.
      let inCorso = [];
      const registra = (...nomi) => { inCorso.push(...nomi); return nomi[0]; };

      const f = {
        O,
        /** Chiude il passo: tutti gli oggetti creati dall'ultimo `f.passo()` entrano in questo passo. */
        passo() { k.passo(...inCorso); inCorso = []; },
        /** Aggiunge al passo in corso oggetti creati direttamente con `k` (es. k.archetto). */
        aggiungi(...nomi) { registra(...nomi); },
        /** Foglio vuoto: piani colorati, LT, asse verticale, nomi dei piani, punto O. */
        base() {
          const area = (nome, vertici, piano) => {
            t.areas.push({ name: nome, points: vertici.map(xy) });
            stile(nome, { color: PIANI[piano].colore, filling: 0.3 });   // sempre visibile: non entra nei passi
          };
          area("quadPV", [[-sinistra, 0], [0, 0], [0, alto], [-sinistra, alto]], "PV");
          area("quadPL", [[0, 0], [destra, 0], [destra, alto], [0, alto]], "PL");
          area("quadPO", [[-sinistra, -basso], [0, -basso], [0, 0], [-sinistra, 0]], "PO");
          k.seg("lineLT", [-sinistra, 0], [destra, 0]);
          k.seg("lineAsse", [0, -basso], [0, alto]);
          stile("lineLT", { color: INCHIOSTRO, thickness: 6 });
          stile("lineAsse", { color: INCHIOSTRO, thickness: 5 });
          registra("lineLT", "lineAsse");
          f.scritta("PV", "PV", [-sinistra + 0.3, alto - 0.8], PIANI.PV.testo);
          f.scritta("PL", "PL", [destra - 1.1, alto - 0.8], PIANI.PL.testo);
          f.scritta("PO", "PO", [-sinistra + 0.3, -basso + 0.3], PIANI.PO.testo);
          f.scritta("LT", "LT", [-sinistra - 0.95, -0.2], INCHIOSTRO);
          k.punto("O", O);
          stile("O", { color: INCHIOSTRO, pointSize: 3 });
          registra("O");
        },
        /** Scritta sul foglio: `p` è l'angolo in basso a sinistra del testo. */
        scritta(nome, testo, p, colore, quando) {
          t.commands.push(haApici(testo)
            ? `Testo${nome}=Text("${inLatex(testo)}",${xy(p)},true,true)`
            : `Testo${nome}=Text("${testo}",${xy(p)})`);
          stile(`Testo${nome}`, { color: colore || INCHIOSTRO });
          if (quando !== undefined) k.compare(`Testo${nome}`, quando);
          return registra(`Testo${nome}`);
        },
        /** Linea di proiezione (sottile), tracciata da a verso b. */
        proietta(nome, a, b, finestra) {
          k.traccia(`linePr${nome}`, a, b, finestra);
          stile(`linePr${nome}`, STILI.proiezione);
          return registra(`linePr${nome}`);
        },
        /** Linea della figura in costruzione (blu), tracciata da a verso b. */
        figura(nome, a, b, finestra) {
          k.traccia(`lineFg${nome}`, a, b, finestra);
          stile(`lineFg${nome}`, STILI.figura);
          return registra(`lineFg${nome}`);
        },
        /**
         * Misura messa in evidenza: tratto colorato da a a b e scritta (es. "7 cm") accanto al punto medio.
         * `lato`: dove va la scritta → "su" | "giu" (tratti orizzontali), "dx" | "sx" (tratti verticali).
         * `sposta` = [dx, dy] in cm: ritocco finale, quando al punto medio la scritta toccherebbe una linea.
         */
        misura(nome, a, b, testo, quando, lato, sposta) {
          const orizzontale = Math.abs(a[1] - b[1]) < 1e-9;
          const dove = lato || (orizzontale ? "su" : "dx");
          const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          const largo = 0.36 * testo.length;                      // larghezza indicativa della scritta, in cm
          let p = dove === "su" ? [m[0] - largo / 2, m[1] + 0.25]
            : dove === "giu" ? [m[0] - largo / 2, m[1] - 0.8]
            : dove === "sx" ? [m[0] - largo - 0.25, m[1] - 0.25]
            : [m[0] + 0.25, m[1] - 0.25];
          if (sposta) p = [p[0] + sposta[0], p[1] + sposta[1]];
          k.seg(`mis${nome}`, a, b);
          stile(`mis${nome}`, STILI.misura);
          if (quando !== undefined) k.compare(`mis${nome}`, quando);
          registra(`mis${nome}`);
          f.scritta(`Mis${nome}`, testo, p, STILI.misura.color, quando);
        },
        /** Trattino di misura attraverso una linea: `verticale` se la linea misurata è orizzontale. */
        tacca(nome, p, verticale, quando) {
          const d = 0.22;
          k.seg(`tac${nome}`, verticale ? [p[0], p[1] - d] : [p[0] - d, p[1]], verticale ? [p[0], p[1] + d] : [p[0] + d, p[1]]);
          stile(`tac${nome}`, STILI.tacca);
          if (quando !== undefined) k.compare(`tac${nome}`, quando);
          return registra(`tac${nome}`);
        },
        /** Arco di riporto: centro O, dal punto (0, −raggio) sull'asse al punto (raggio, 0) sulla LT. */
        riporto(nome, raggio, finestra) {
          k.arco(`arcR${nome}`, O, raggio, 270, 90, finestra);
          return registra(`arcR${nome}`);
        },
        /**
         * Punto con nome (es. "A′"). Compare a `quando` (0–1).
         * `spostaNome` = [dx, dy] in cm: mette il nome in quel punto invece che in alto a destra
         * (serve quando lì passa una linea e il nome non si leggerebbe). Lo spostamento indica l'angolo
         * in basso a sinistra della scritta; per un nome con gli apici, scritto in LaTeX, l'angolo in alto a sinistra.
         */
        punto(nome, p, etichetta, quando, spostaNome) {
          k.punto(nome, p, etichetta && haApici(etichetta) ? `$${inLatex(etichetta)}$` : etichetta);
          if (quando !== undefined) k.compare(nome, quando);
          registra(nome);
          if (spostaNome) {
            stile(nome, { label: false });
            f.scritta(`Nome${nome}`, etichetta || nome, [p[0] + spostaNome[0], p[1] + spostaNome[1]], [239, 68, 68], quando);
          }
          return nome;
        },
        /** Punto di servizio numerato (1, 2, 3…): nome N1, N2… */
        numero(n, p, quando) {
          k.punto(`N${n}`, p, String(n));
          stile(`N${n}`, STILI.servizio);
          if (quando !== undefined) k.compare(`N${n}`, quando);
          return registra(`N${n}`);
        },
        /** Ripasso finale di uno spigolo in vista. */
        ripassa(nome, a, b, finestra) {
          k.traccia(`draw${nome}`, a, b, finestra);
          k.risultato(`draw${nome}`);
          stile(`draw${nome}`, STILI.ripasso);
          return registra(`draw${nome}`);
        },
        /** Ripasso finale di uno spigolo nascosto (tratteggiato). */
        nascosto(nome, a, b, finestra) {
          k.traccia(`draw${nome}`, a, b, finestra);
          stile(`draw${nome}`, STILI.nascosto);
          return registra(`draw${nome}`);
        },
      };

      costruisci(f, k);
    });
  }

  const INTRO_FOGLIO = "La linea orizzontale è la linea di terra (LT). Con l’asse verticale divide il foglio in quattro riquadri: in alto a sinistra il piano verticale (PV), in basso a sinistra il piano orizzontale (PO), in alto a destra il piano laterale (PL). Il punto dove le due linee si incrociano si chiama O.";

  // ── Tavola P.O. 2 · Punto ────────────────────────────────────────────────────
  TAVOLE["po-punto"] = creaFoglio({
    title: "Proiezioni ortogonali di un punto",
    eyebrow: "Tavola 2 · Un punto, tre proiezioni",
    subtitle: "Il punto A sta a 3 cm dal PO, a 5 cm dal PV e a 7 cm dal PL. Trova le sue tre proiezioni: A′, A″ e A‴.",
    filename: "MC-DIS-2-01_po-punto.ggb",
    proofTitle: "Ogni vista conserva due distanze su tre",
    proofCopy: "Il PO guarda dall’alto: non vede l’altezza del punto, ma conserva la distanza dal PV e quella dal PL. Il PV guarda di fronte: conserva l’altezza e la distanza dal PL. Il PL guarda di fianco: conserva l’altezza e la distanza dal PV. Sul foglio la distanza dal PV sta sotto la LT: l’arco di compasso la porta a destra dell’asse verticale senza cambiarla.",
    equality: "Distanze dall’asse e dalla LT · A′: 7 e 5 cm · A″: 7 e 3 cm · A‴: 5 e 3 cm",
    steps: [
      ["Prima di iniziare", "Prepara il foglio", `${INTRO_FOGLIO} Sul tuo foglio traccia la LT e l’asse verticale con le squadre: lascia almeno 8 cm a sinistra di O, 7 cm a destra, 5 cm sopra e 6 cm sotto. Il punto A sta a 3 cm dal PO, a 5 cm dal PV e a 7 cm dal PL.`, "Il riquadro in basso a destra resta libero: serve al compasso."],
      ["Passo 1 · Sul PO", "Trova A′", "Sulla LT misura 7 cm a sinistra di O e fai un trattino: è la distanza dal PL. Sull’asse verticale misura 5 cm sotto O e segna il punto 1: è la distanza dal PV. Dal trattino scendi in verticale, dal punto 1 vai a sinistra in orizzontale. Dove le due linee si incontrano c’è A′.", "A′ è il punto A visto dall’alto: qui l’altezza non si vede. A′ si legge «A primo», A″ «A secondo», A‴ «A terzo»."],
      ["Passo 2 · Sul PV", "Sali fino ad A″", "Prolunga verso l’alto, oltre la LT, la linea verticale che passa per A′. Su questa linea misura 3 cm sopra la LT: è la distanza dal PO, cioè l’altezza del punto. Hai trovato A″.", "A′ e A″ stanno sulla stessa verticale. Se non è così, ricontrolla."],
      ["Passo 3 · Compasso", "Porta la distanza dal PV sulla LT", "Punta il compasso in O e aprilo fino al punto 1. Traccia un quarto di giro nel riquadro in basso a destra, fino alla LT: trovi il punto 2.", "Da O a 1 e da O a 2 la distanza è la stessa, 5 cm: l’arco sposta la misura senza cambiarla."],
      ["Passo 4 · Sul PL", "Trova A‴", "Dal punto 2 sali in verticale. Da A″ vai a destra in orizzontale, oltre l’asse verticale. Dove le due linee si incontrano c’è A‴.", "A″ e A‴ stanno alla stessa altezza."],
      ["Passo 5 · Controllo", "Misura e ripassa", "Controlla con il righello: A‴ deve stare a 5 cm dall’asse verticale e a 3 cm dalla LT. Poi ripassa i tre punti e controlla di aver scritto accanto a ognuno il suo nome: A′, A″ e A‴.", "Le linee sottili restano sul foglio: mostrano come hai trovato i punti."],
    ],
  }, { sinistra: 9.4, destra: 7.6, alto: 5.4, basso: 6.8 }, (f, k) => {
    const dPO = 3, dPV = 5, dPL = 7;
    const Apo = [-dPL, -dPV], Apv = [-dPL, dPO], Apl = [dPV, dPO];

    f.base();
    f.passo();

    // Passo 1 · A′ sul PO
    f.misura("PL", f.O, [-dPL, 0], "7 cm", 0.12);
    f.tacca("PL", [-dPL, 0], true, 0.12);
    f.misura("PV", f.O, [0, -dPV], "5 cm", 0.3);
    f.numero(1, [0, -dPV], 0.3);
    f.proietta("Giu", [-dPL, 0], Apo, [0.42, 0.66]);
    f.proietta("Sin", [0, -dPV], Apo, [0.66, 0.9]);
    f.punto("Apo", Apo, "A′", 0.92);
    f.passo();

    // Passo 2 · A″ sul PV
    f.proietta("Su", [-dPL, 0], [-dPL, dPO + 1.3], [0.12, 0.6]);
    f.misura("PO", [-dPL, 0], Apv, "3 cm", 0.62);
    f.punto("Apv", Apv, "A″", 0.85);
    f.passo();

    // Passo 3 · riporto della distanza dal PV
    f.riporto("A", dPV);
    f.numero(2, [dPV, 0], 0.97);
    f.passo();

    // Passo 4 · A‴ sul PL
    f.proietta("SuPL", [dPV, 0], [dPV, dPO + 1.3], [0.12, 0.5]);
    f.proietta("Des", Apv, [dPV + 1.3, dPO], [0.5, 0.88]);
    f.punto("Apl", Apl, "A‴", 0.9);
    f.passo();

    // Passo 5 · controllo delle misure sul PL
    f.misura("CtrlPV", [0, dPO], Apl, "5 cm", 0.2);
    f.misura("CtrlPO", [dPV, 0], Apl, "3 cm", 0.55);
    f.passo();
  });

  // ── Tavola P.O. 6 · Prisma triangolare con la base sul PO ────────────────────
  TAVOLE["po-prisma-triangolare"] = creaFoglio({
    title: "Prisma triangolare con la base sul PO",
    eyebrow: "Tavola 6 · Il primo spigolo nascosto",
    subtitle: "Prisma con la base a triangolo equilatero di lato 6 cm, alto 8 cm, appoggiato sul PO. Il lato BC della base è parallelo alla LT, 7 cm più in basso; il vertice A è rivolto verso la LT.",
    filename: "MC-DIS-2-01_po-prisma-triangolare.ggb",
    proofTitle: "La base si vede intera da un solo punto di vista",
    proofCopy: "Il prisma è appoggiato sul PO: solo dall’alto la base si vede con la sua vera forma, un triangolo. Di fronte e di fianco il prisma diventa un rettangolo alto 8 cm. Nel PV è largo quanto il lato BC, 6 cm. Nel PL è largo quanto l’altezza del triangolo, circa 5,2 cm. Lo spigolo che parte da A sta dietro la faccia che guardi di fronte: per questo nel PV è tratteggiato.",
    equality: "PV: 6 × 8 cm · PL: circa 5,2 × 8 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", "Il prisma ha per base un triangolo equilatero di lato 6 cm ed è alto 8 cm. È appoggiato sul piano orizzontale (PO). Il lato BC della base è parallelo alla linea di terra (LT), 7 cm più in basso; il terzo vertice, A, è rivolto verso la LT. Sul tuo foglio traccia la LT e l’asse verticale: ti servono almeno 10 cm a sinistra di O, 9 cm a destra, 9 cm sopra e 8 cm sotto.", "Regola pratica: comincia dalla vista che mostra la base intera. Qui è il PO."],
      ["Passo 1 · Sul PO", "Disegna il lato BC", "Nel PO traccia una linea leggera parallela alla LT, 7 cm più in basso. Su questa linea segna C, a 3 cm dall’asse verticale, e B, 6 cm più a sinistra di C. Il segmento BC è il primo lato della base.", "La base tocca il PO: i suoi vertici coincidono con le loro proiezioni. Per questo li chiami A, B e C, senza apice."],
      ["Passo 2 · Compasso", "Completa il triangolo", "Apri il compasso quanto BC, 6 cm. Punta in B e traccia un archetto sopra il lato. Fai lo stesso da C. I due archetti si incrociano in A. Unisci A con B e con C.", "È la costruzione del triangolo equilatero che hai imparato in prima."],
      ["Passo 3 · Verso il PV", "Sali dai tre vertici", "Da B, da A e da C traccia tre linee verticali sottili che salgono oltre la LT. Sono le linee di proiezione: portano le larghezze dal PO al piano verticale (PV).", "Traccia leggere le linee di proiezione: alla fine ripasserai solo i tratti che fanno parte della figura."],
      ["Passo 4 · Sul PV", "Disegna il prospetto", "Il prospetto è la vista di fronte. Il prisma è appoggiato sul PO: nel PV la sua base sta sulla LT. Sulla verticale di B misura 8 cm dalla LT, poi traccia una linea orizzontale fino alla verticale di C. Con la LT ottieni un rettangolo largo 6 cm e alto 8 cm. La verticale di mezzo è lo spigolo che parte da A.", "La faccia di sopra è tutta alla stessa altezza: 8 cm."],
      ["Passo 5 · Verso il PL", "Porta altezze e profondità verso il PL", "Nel PV prolunga verso destra la linea a 8 cm di altezza, fino a circa 8 cm oltre l’asse verticale: entri nel piano laterale (PL). Nel PO traccia due linee orizzontali fino all’asse verticale: una parte da A e trova il punto 1, l’altra continua il lato BC e trova il punto 2.", "Le altezze passano dal PV al PL in orizzontale. Per le profondità, cioè le distanze dal PV, serve il compasso."],
      ["Passo 6 · Compasso", "Porta le profondità sulla LT", "Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro nel riquadro in basso a destra, fino alla LT: trovi il punto 3. Poi aprilo fino al punto 2 e traccia un altro quarto di giro: trovi il punto 4.", "I due archi hanno lo stesso centro, O."],
      ["Passo 7 · Sul PL", "Disegna il fianco", "Dai punti 3 e 4 sali in verticale fino alla linea a 8 cm di altezza. Con la LT ottieni un rettangolo: è il prisma visto di fianco.", "Il rettangolo è largo quanto l’altezza del triangolo di base: circa 5,2 cm."],
      ["Passo 8 · Ripasso", "Ripassa gli spigoli", "Ripassa con un tratto deciso il triangolo nel PO e i due rettangoli nel PV e nel PL. Nel PV lo spigolo che parte da A sta dietro la faccia che guardi: disegnalo tratteggiato.", "Tratto continuo per gli spigoli che vedi, tratteggio per quelli nascosti."],
    ],
  }, { sinistra: 11.8, destra: 8.8, alto: 9.4, basso: 9.1 }, (f, k) => {
    const lato = 6, altezza = 8, sottoLT = 7, dallAsse = 3;
    const hTri = (lato * Math.sqrt(3)) / 2;          // altezza del triangolo di base ≈ 5,196
    const B = [-dallAsse - lato, -sottoLT];
    const C = [-dallAsse, -sottoLT];
    const A = [-dallAsse - lato / 2, -sottoLT + hTri];
    const profA = sottoLT - hTri;                    // distanza di A dal PV ≈ 1,804
    const su = altezza + 0.9;

    f.base();
    f.passo();

    // Passo 1 · lato BC
    f.misura("SottoLT", [B[0] - 0.9, 0], [B[0] - 0.9, -sottoLT], "7 cm", 0.12, "sx");
    f.misura("DallAsse", [C[0], -sottoLT - 0.7], [0, -sottoLT - 0.7], "3 cm", 0.3, "giu");
    f.punto("C", C, "C", 0.4);
    f.figura("BC", C, B, [0.45, 0.9]);
    f.scritta("LatoBC", "6 cm", [A[0] - 0.7, -sottoLT + 0.25], [30, 64, 175], 0.9);
    f.punto("B", B, "B", 0.92, [-0.55, -0.75]);      // in basso a sinistra: in alto a destra passa il lato AB
    f.passo();

    // Passo 2 · triangolo equilatero
    k.archetto("arcB", B, A, 13, [0.12, 0.38]);
    k.archetto("arcC", C, A, 13, [0.38, 0.62]);
    f.aggiungi("arcB", "arcC");
    f.punto("A", A, "A", 0.64);
    f.figura("AB", A, B, [0.66, 0.8]);
    f.figura("AC", A, C, [0.8, 0.94]);
    f.passo();

    // Passo 3 · linee di proiezione verso il PV
    const [w1, w2, w3] = finestre(3);
    f.proietta("B", B, [B[0], su], w1);
    f.proietta("A", A, [A[0], su], w2);
    f.proietta("C", C, [C[0], su], w3);
    f.passo();

    // Passo 4 · prospetto
    f.misura("Alt", [B[0], 0], [B[0], altezza], "8 cm", 0.12, "sx");
    f.figura("Sopra", [B[0], altezza], [C[0], altezza], [0.4, 0.94]);
    f.passo();

    // Passo 5 · verso il PL
    f.proietta("Alt", [C[0], altezza], [sottoLT + 1.2, altezza], [0.12, 0.45]);
    f.proietta("ProfA", A, [0, A[1]], [0.45, 0.68]);
    f.numero(1, [0, A[1]], 0.7);
    f.proietta("ProfBC", C, [0, C[1]], [0.7, 0.92]);
    f.numero(2, [0, C[1]], 0.94);
    f.passo();

    // Passo 6 · archi di riporto
    f.riporto("Uno", profA, [0.12, 0.42]);
    f.numero(3, [profA, 0], 0.44);
    f.riporto("Due", sottoLT, [0.48, 0.92]);
    f.numero(4, [sottoLT, 0], 0.94);
    f.passo();

    // Passo 7 · fianco
    f.proietta("Tre", [profA, 0], [profA, altezza], [0.12, 0.5]);
    f.proietta("Quattro", [sottoLT, 0], [sottoLT, altezza], [0.5, 0.92]);
    f.passo();

    // Passo 8 · ripasso (PO, poi PV, poi PL)
    const r = finestre(12, 0.06, 0.93);
    f.ripassa("POa", B, C, r[0]);
    f.ripassa("POb", C, A, r[1]);
    f.ripassa("POc", A, B, r[2]);
    f.ripassa("PVa", [B[0], 0], [C[0], 0], r[3]);
    f.ripassa("PVb", [C[0], 0], [C[0], altezza], r[4]);
    f.ripassa("PVc", [C[0], altezza], [B[0], altezza], r[5]);
    f.ripassa("PVd", [B[0], altezza], [B[0], 0], r[6]);
    f.nascosto("PVn", [A[0], 0], [A[0], altezza], r[7]);
    f.ripassa("PLa", [profA, 0], [sottoLT, 0], r[8]);
    f.ripassa("PLb", [sottoLT, 0], [sottoLT, altezza], r[9]);
    f.ripassa("PLc", [sottoLT, altezza], [profA, altezza], r[10]);
    f.ripassa("PLd", [profA, altezza], [profA, 0], r[11]);
    f.passo();
  });

  // ── Tavola P.O. 8 · Piramide quadrata con la base parallela al PO ────────────
  TAVOLE["po-piramide-quadrata"] = creaFoglio({
    title: "Piramide quadrata con la base parallela al PO",
    eyebrow: "Tavola 8 · Un solido staccato dai piani",
    subtitle: "Piramide a base quadrata di lato 6 cm, alta 7 cm, con il vertice sopra il centro della base. La base è parallela al PO, 2 cm più in alto, con due lati paralleli alla LT. La piramide dista 2 cm dal PV e 3 cm dal PL.",
    filename: "MC-DIS-2-01_po-piramide-quadrata.ggb",
    proofTitle: "Tre viste, tre figure diverse dello stesso solido",
    proofCopy: "Dall’alto vedi la base intera: un quadrato. I quattro spigoli che salgono al vertice cadono sulle sue diagonali. Di fronte e di fianco la base si vede di taglio, come un segmento, e la piramide diventa un triangolo con la base di 6 cm e l’altezza di 7 cm. Il vertice sta sopra il centro della base: per questo V′ cade dove si incrociano le diagonali, e V″ e V‴ stanno sulla verticale di mezzo.",
    equality: "PO: quadrato di lato 6 cm · PV e PL: triangolo con base 6 cm e altezza 7 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", "La piramide ha la base quadrata di lato 6 cm ed è alta 7 cm; il vertice sta sopra il centro della base. La base è parallela al piano orizzontale (PO) ma non lo tocca: sta 2 cm più in alto, con due lati paralleli alla linea di terra (LT). La piramide dista 2 cm dal piano verticale (PV) e 3 cm dal piano laterale (PL). Sul tuo foglio traccia la LT e l’asse verticale: ti servono almeno 10 cm a sinistra di O, 9 cm a destra, 10 cm sopra e 9 cm sotto.", "«Parallela al PO» vuol dire orizzontale, come il piano di un tavolo. Parti dal PO: lì la base si vede intera."],
      ["Passo 1 · Sul PO", "Disegna la base", "Traccia una linea leggera parallela alla LT, 2 cm più in basso: 2 cm è la distanza dal PV. Su questa linea segna due punti, a 3 cm e a 9 cm dall’asse verticale: 3 cm è la distanza dal PL. Il tratto tra i due punti è il lato in alto del quadrato. Completa il quadrato partendo dal punto di sinistra: 6 cm in giù, 6 cm verso destra, 6 cm in su.", "Nel PO misuri la distanza dal PV dalla LT verso il basso."],
      ["Passo 2 · Diagonali", "Trova V′", "Traccia le due diagonali del quadrato. Si incrociano nel centro: lì cade V′, la proiezione del vertice della piramide. Visti dall’alto, i quattro spigoli che salgono al vertice cadono sulle diagonali: ogni mezza diagonale è uno spigolo.", "Il vertice sta proprio sopra il centro della base."],
      ["Passo 3 · Verso il PV", "Sali dal quadrato e da V′", "Traccia tre linee verticali sottili che salgono oltre la LT: una dal lato sinistro del quadrato, una da V′, una dal lato destro.", "Sono le linee di proiezione: portano le larghezze dal PO al PV."],
      ["Passo 4 · Sul PV", "Disegna il prospetto", "Il prospetto è la vista di fronte. La base sta 2 cm sopra la LT: disegnala come un segmento orizzontale tra le due verticali esterne. Sulla verticale di V′ misura 7 cm a partire dalla base, cioè 9 cm dalla LT: lì c’è V″. Unisci V″ con i due estremi della base.", "Di fronte la base quadrata si vede di taglio: diventa un segmento."],
      ["Passo 5 · Verso il PL", "Porta altezze e profondità verso il PL", "Nel PV traccia due linee orizzontali verso destra, fino a circa 9 cm oltre l’asse verticale: una continua la base, l’altra parte da V″. Nel PO traccia tre linee orizzontali fino all’asse verticale: dal lato in alto del quadrato, da V′ e dal lato in basso. Trovi i punti 1, 2 e 3.", "Tre linee, tre profondità, cioè tre distanze dal PV: 2 cm, 5 cm e 8 cm."],
      ["Passo 6 · Compasso", "Porta le profondità sulla LT", "Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro nel riquadro in basso a destra, fino alla LT: trovi il punto 4. Ripeti dal punto 2 e dal punto 3: trovi i punti 5 e 6.", "Tre archi, un solo centro: O."],
      ["Passo 7 · Sul PL", "Disegna il fianco", "Dai punti 4, 5 e 6 sali in verticale. La base è il tratto della linea a 2 cm di altezza compreso tra le verticali di 4 e di 6. La verticale di 5 incontra la linea di V″ nel punto V‴. Unisci V‴ con i due estremi della base.", "Anche di fianco la piramide è un triangolo, uguale a quello del PV."],
      ["Passo 8 · Ripasso", "Ripassa gli spigoli", "Ripassa il quadrato con le diagonali nel PO e i due triangoli nel PV e nel PL. Qui non c’è niente da tratteggiare: gli spigoli che stanno dietro cadono esattamente su quelli davanti. La linea arancione nel PV è solo la misura dell’altezza: non si ripassa.", "Controlla: V′ e V″ sono sulla stessa verticale, V″ e V‴ alla stessa altezza."],
    ],
  }, { sinistra: 11.8, destra: 9.4, alto: 10.4, basso: 10.1 }, (f, k) => {
    const lato = 6, altezza = 7, dPO = 2, dPV = 2, dPL = 3;
    const xD = -dPL, xS = -dPL - lato, xV = -dPL - lato / 2;      // lato destro, lato sinistro, centro
    const yA = -dPV, yB = -dPV - lato, yV = -dPV - lato / 2;      // lato alto, lato basso, centro (nel PO)
    const hV = dPO + altezza;                                     // altezza del vertice dalla LT
    const p1 = dPV, p2 = dPV + lato / 2, p3 = dPV + lato;         // le tre profondità
    const su = hV + 0.8;

    f.base();
    f.passo();

    // Passo 1 · base quadrata sul PO
    f.misura("DalPV", [xS - 0.9, 0], [xS - 0.9, yA], "2 cm", 0.12, "sx");
    f.misura("DalPL", [xD, yB - 0.7], [0, yB - 0.7], "3 cm", 0.25, "giu");
    const q = finestre(4, 0.36, 0.9);
    f.figura("QAlto", [xD, yA], [xS, yA], q[0]);
    f.figura("QSin", [xS, yA], [xS, yB], q[1]);
    f.figura("QBasso", [xS, yB], [xD, yB], q[2]);
    f.figura("QDes", [xD, yB], [xD, yA], q[3]);
    f.scritta("LatoQ", "6 cm", [xV - 0.7, yB - 0.8], [30, 64, 175], 0.92);
    f.passo();

    // Passo 2 · diagonali e V′
    f.figura("DiagUno", [xS, yA], [xD, yB], [0.12, 0.5]);
    f.figura("DiagDue", [xD, yA], [xS, yB], [0.5, 0.88]);
    f.punto("Vpo", [xV, yV], "V′", 0.9, [-1.75, 0.4]);      // a sinistra: sopra e a destra passano diagonali e linee di proiezione
    f.passo();

    // Passo 3 · linee di proiezione verso il PV
    const [w1, w2, w3] = finestre(3);
    f.proietta("Sin", [xS, yA], [xS, su], w1);
    f.proietta("V", [xV, yV], [xV, su], w2);
    f.proietta("Des", [xD, yA], [xD, su], w3);
    f.passo();

    // Passo 4 · prospetto
    f.misura("BasePO", [xS - 0.9, 0], [xS - 0.9, dPO], "2 cm", 0.12, "sx");
    f.figura("BasePV", [xS, dPO], [xD, dPO], [0.2, 0.42]);
    f.misura("AltV", [xV, dPO], [xV, hV], "7 cm", 0.46, "dx", [0, -1.7]);   // più in basso: a metà altezza toccherebbe lo spigolo
    f.punto("Vpv", [xV, hV], "V″", 0.6);
    f.figura("SpigSinPV", [xV, hV], [xS, dPO], [0.62, 0.78]);
    f.figura("SpigDesPV", [xV, hV], [xD, dPO], [0.78, 0.94]);
    f.passo();

    // Passo 5 · verso il PL
    f.proietta("AltBase", [xD, dPO], [p3 + 0.8, dPO], [0.12, 0.3]);
    f.proietta("AltV", [xV, hV], [p3 + 0.8, hV], [0.3, 0.5]);
    f.proietta("ProfUno", [xD, yA], [0, yA], [0.5, 0.62]);
    f.numero(1, [0, yA], 0.63);
    f.proietta("ProfDue", [xV, yV], [0, yV], [0.64, 0.78]);
    f.numero(2, [0, yV], 0.79);
    f.proietta("ProfTre", [xD, yB], [0, yB], [0.8, 0.92]);
    f.numero(3, [0, yB], 0.93);
    f.passo();

    // Passo 6 · archi di riporto
    f.riporto("Uno", p1, [0.12, 0.34]);
    f.numero(4, [p1, 0], 0.35);
    f.riporto("Due", p2, [0.38, 0.62]);
    f.numero(5, [p2, 0], 0.63);
    f.riporto("Tre", p3, [0.66, 0.93]);
    f.numero(6, [p3, 0], 0.94);
    f.passo();

    // Passo 7 · fianco
    f.proietta("Quattro", [p1, 0], [p1, dPO + 0.8], [0.12, 0.26]);
    f.proietta("Cinque", [p2, 0], [p2, su], [0.26, 0.48]);
    f.proietta("Sei", [p3, 0], [p3, dPO + 0.8], [0.48, 0.6]);
    f.figura("BasePL", [p1, dPO], [p3, dPO], [0.6, 0.7]);
    f.punto("Vpl", [p2, hV], "V‴", 0.7);
    f.figura("SpigSinPL", [p2, hV], [p1, dPO], [0.72, 0.83]);
    f.figura("SpigDesPL", [p2, hV], [p3, dPO], [0.83, 0.94]);
    f.passo();

    // Passo 8 · ripasso (PO, poi PV, poi PL)
    const r = finestre(12, 0.06, 0.93);
    f.ripassa("POa", [xS, yA], [xD, yA], r[0]);
    f.ripassa("POb", [xD, yA], [xD, yB], r[1]);
    f.ripassa("POc", [xD, yB], [xS, yB], r[2]);
    f.ripassa("POd", [xS, yB], [xS, yA], r[3]);
    f.ripassa("POe", [xS, yA], [xD, yB], r[4]);
    f.ripassa("POf", [xD, yA], [xS, yB], r[5]);
    f.ripassa("PVa", [xS, dPO], [xD, dPO], r[6]);
    f.ripassa("PVb", [xD, dPO], [xV, hV], r[7]);
    f.ripassa("PVc", [xV, hV], [xS, dPO], r[8]);
    f.ripassa("PLa", [p1, dPO], [p3, dPO], r[9]);
    f.ripassa("PLb", [p3, dPO], [p2, hV], r[10]);
    f.ripassa("PLc", [p2, hV], [p1, dPO], r[11]);
    f.passo();
  });
})();
