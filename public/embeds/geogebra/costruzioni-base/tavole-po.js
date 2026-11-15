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
 *   lineAx…  asse di simmetria (tratto-punto)           arcC… / arcA…  circonferenza e archetto di compasso
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
    asse: { color: [71, 85, 105], thickness: 3, lineStyle: 4 },       // tratto-punto
    traccia: { color: [190, 18, 60], thickness: 5, lineStyle: 4 },     // traccia di un piano di taglio (tratto-punto marcato)
    tratteggio: { color: [30, 64, 175], thickness: 2, lineStyle: 0 },  // righe a 45° di una sezione
  };
  // ── Due modalità: «a colori» (semplificata) e «foglio tecnico» (avanzata, ?modo=tecnico) ──
  // Stessa costruzione e stessi testi; cambiano il foglio (squadratura, carta quadrettata da 1 cm, cartiglio,
  // niente piani colorati) e i tratti (nero e grigio, spessori da disegno tecnico).
  const PARAMETRI = new URLSearchParams(window.location.search);
  const TECNICO = PARAMETRI.get("modo") === "tecnico";
  const NERO = [17, 24, 39];
  const MATITA = [71, 85, 105];
  if (TECNICO) {
    Object.assign(STILI, {
      proiezione: { color: MATITA, thickness: 1, lineStyle: 0 },
      figura: { color: NERO, thickness: 3, lineStyle: 0 },
      misura: { color: MATITA, thickness: 2, lineStyle: 0 },
      tacca: { color: MATITA, thickness: 2, lineStyle: 0 },
      servizio: { color: NERO, pointSize: 3 },
      asse: { color: NERO, thickness: 2, lineStyle: 4 },
      compasso: { color: MATITA, thickness: 2, lineStyle: 0 },
      traccia: { color: NERO, thickness: 4, lineStyle: 4 },
      tratteggio: { color: NERO, thickness: 1, lineStyle: 0 },
    });
  }
  const ROSSO_NOMI = TECNICO ? NERO : [239, 68, 68];
  const TRACCIA_COLORE = TECNICO ? NERO : [190, 18, 60];

  // Livelli di GeoGebra: servono agli interruttori in fondo al file (ogni livello si accende e si spegne da solo).
  // L'ordine è anche l'ordine di disegno: la figura sta sopra le linee di proiezione, i nomi sopra tutto.
  const LIVELLI = { proiezioni: 1, misure: 2, figura: 3, nomi: 4 };

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
    // Nome del PV in basso (vicino alla LT) quando in alto c'è un altro disegno, come la vera forma delle sezioni.
    const yNomePV = limiti.nomePV === "basso" ? 0.3 : alto - 0.8;
    return creaTavola({
      level: TECNICO ? "A" : "I",
      appletHeight: TECNICO ? 700 : 660,
      fontSize: TECNICO ? 18 : 20,
      coord: [-sinistra - 1.1, destra + 0.6, -basso - (TECNICO ? 2.3 : 0.6), alto + 0.6],
      ...meta,
      ...(TECNICO ? { filename: meta.filename.replace(/\.ggb$/, "_foglio-tecnico.ggb") } : {}),
    }, (k, t) => {
      t.areas = [];
      t.styles = {};
      const stile = (nome, s) => { t.styles[nome] = { ...(t.styles[nome] || {}), ...s }; return nome; };
      const O = [0, 0];
      // Nomi con gli apici (A′, A″, A‴): scritti in LaTeX, altrimenti a grandezza normale ″ e ‴ non si distinguono.
      const inLatex = (nome) => nome.replace(/‴/g, "'''").replace(/″/g, "''").replace(/′/g, "'").replace(/≡/g, " \\equiv ");
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
        /** Foglio vuoto, tutto insieme: piani colorati, LT, asse verticale, nomi dei piani, punto O. */
        base() {
          f.piani();
          f.lineaDiTerra();
          f.asseVerticale();
          f.nomiPiani();
          f.nomeLT();
          f.origine();
        },
        /** I tre piani colorati. Con `daPasso` compaiono solo da quel passo in poi (tavola 1); altrimenti ci sono sempre. */
        piani(daPasso) {
          if (TECNICO) return;                                   // sul foglio tecnico i piani non si colorano
          const area = (nome, vertici, piano) => {
            t.areas.push({ name: nome, points: vertici.map(xy), ...(daPasso === undefined ? {} : { step: daPasso }) });
            stile(nome, { color: PIANI[piano].colore, filling: 0.3 });   // non entra nei passi: lo gestisce il motore
          };
          area("quadPV", [[-sinistra, 0], [0, 0], [0, alto], [-sinistra, alto]], "PV");
          area("quadPL", [[0, 0], [destra, 0], [destra, alto], [0, alto]], "PL");
          area("quadPO", [[-sinistra, -basso], [0, -basso], [0, 0], [-sinistra, 0]], "PO");
        },
        /** Linea di terra: statica, oppure tracciata nella `finestra` del passo. */
        lineaDiTerra(finestra) {
          if (finestra) k.traccia("lineLT", [-sinistra, 0], [destra, 0], finestra);
          else k.seg("lineLT", [-sinistra, 0], [destra, 0]);
          stile("lineLT", { color: INCHIOSTRO, thickness: 6, lineStyle: 0 });
          return registra("lineLT");
        },
        /** Asse verticale: statico, oppure tracciato dall'alto verso il basso nella `finestra` del passo. */
        asseVerticale(finestra) {
          if (finestra) k.traccia("lineAsse", [0, alto], [0, -basso], finestra);
          else k.seg("lineAsse", [0, -basso], [0, alto]);
          stile("lineAsse", { color: INCHIOSTRO, thickness: 5, lineStyle: 0 });
          return registra("lineAsse");
        },
        nomiPiani(quando) {
          if (TECNICO) {
            f.scritta("PV", "PV · piano verticale", [-sinistra + 0.3, yNomePV], MATITA, quando);
            f.scritta("PL", "PL · piano laterale", [0.3, alto - 0.8], MATITA, quando);
            f.scritta("PO", "PO · piano orizzontale", [-sinistra + 0.3, -basso + 0.3], MATITA, quando);
            return;
          }
          f.scritta("PV", "PV", [-sinistra + 0.3, yNomePV], PIANI.PV.testo, quando);
          f.scritta("PL", "PL", [destra - 1.1, alto - 0.8], PIANI.PL.testo, quando);
          f.scritta("PO", "PO", [-sinistra + 0.3, -basso + 0.3], PIANI.PO.testo, quando);
        },
        nomeLT(quando) { f.scritta("LT", "LT", [-sinistra - 0.95, -0.2], INCHIOSTRO, quando); },
        origine(quando) {
          k.punto("O", O);
          stile("O", { color: INCHIOSTRO, pointSize: 3 });
          if (quando !== undefined) k.compare("O", quando);
          return registra("O");
        },
        /** Bordo del foglio, sottile: serve solo dove il foglio parte bianco (tavola 1). */
        bordo() {
          const v = [[-sinistra, -basso], [destra, -basso], [destra, alto], [-sinistra, alto]];
          v.forEach((p, i) => {
            k.seg(`lineBordo${"ABCD"[i]}`, p, v[(i + 1) % 4]);
            stile(`lineBordo${"ABCD"[i]}`, { color: [148, 163, 184], thickness: 2, lineStyle: 0 });
            registra(`lineBordo${"ABCD"[i]}`);
          });
        },
        /** Asse di simmetria: linea sottile a tratto-punto, tracciata da a verso b. */
        asse(nome, a, b, finestra) {
          k.traccia(`lineAx${nome}`, a, b, finestra);
          stile(`lineAx${nome}`, STILI.asse);
          return registra(`lineAx${nome}`);
        },
        /** Circonferenza tracciata con il compasso: un giro intero, partendo dal punto più a destra. */
        cerchio(nome, centro, raggio, finestra) {
          k.arco(`arcC${nome}`, centro, raggio, 0, 360, finestra);
          if (TECNICO) stile(`arcC${nome}`, STILI.compasso);
          return registra(`arcC${nome}`);
        },
        /** Archetto di compasso con centro in `centro` che passa per `per`. */
        archetto(nome, centro, per, mezza, finestra) {
          k.archetto(`arcA${nome}`, centro, per, mezza, finestra);
          if (TECNICO) stile(`arcA${nome}`, STILI.compasso);
          return registra(`arcA${nome}`);
        },
        /** Ripasso finale di una circonferenza. Compare a `quando` (0–1). */
        ripassaCerchio(nome, centro, raggio, quando) {
          k.cerchio(`draw${nome}`, centro, raggio);
          k.risultato(`draw${nome}`);
          stile(`draw${nome}`, { ...STILI.ripasso, layer: LIVELLI.figura });
          if (quando !== undefined) k.compare(`draw${nome}`, quando);
          return registra(`draw${nome}`);
        },
        /** Scritta sul foglio: `p` è l'angolo in basso a sinistra del testo. */
        scritta(nome, testo, p, colore, quando) {
          t.commands.push(haApici(testo)
            ? `Testo${nome}=Text("${inLatex(testo)}",${xy(p)},true,true)`
            : `Testo${nome}=Text("${testo}",${xy(p)})`);
          // sul foglio tecnico le scritte sono tutte a matita: nere quelle del cartiglio e dei nomi, grigie le altre
          stile(`Testo${nome}`, { color: TECNICO ? (colore === NERO || !colore ? NERO : MATITA) : (colore || INCHIOSTRO) });
          if (colore && colore[0] === 30 && colore[1] === 64 && colore[2] === 175) stile(`Testo${nome}`, { layer: LIVELLI.misure });   // misure dei lati
          if (quando !== undefined) k.compare(`Testo${nome}`, quando);
          return registra(`Testo${nome}`);
        },
        /** Linea di proiezione (sottile), tracciata da a verso b. */
        proietta(nome, a, b, finestra) {
          k.traccia(`linePr${nome}`, a, b, finestra);
          stile(`linePr${nome}`, { ...STILI.proiezione, layer: LIVELLI.proiezioni });
          return registra(`linePr${nome}`);
        },
        /** Linea della figura in costruzione (blu), tracciata da a verso b. */
        figura(nome, a, b, finestra) {
          k.traccia(`lineFg${nome}`, a, b, finestra);
          stile(`lineFg${nome}`, { ...STILI.figura, layer: LIVELLI.figura });
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
            : dove === "sx" ? [m[0] - largo * 1.12 - 0.25, m[1] - 0.25]      // un po' più in là: sul telefono i caratteri sono più larghi rispetto al foglio
            : [m[0] + 0.25, m[1] - 0.25];
          if (sposta) p = [p[0] + sposta[0], p[1] + sposta[1]];
          k.seg(`mis${nome}`, a, b);
          stile(`mis${nome}`, { ...STILI.misura, layer: LIVELLI.misure });
          if (quando !== undefined) k.compare(`mis${nome}`, quando);
          registra(`mis${nome}`);
          f.scritta(`Mis${nome}`, testo, p, STILI.misura.color, quando);
          stile(`TestoMis${nome}`, { layer: LIVELLI.misure });
        },
        /** Trattino di misura attraverso una linea: `verticale` se la linea misurata è orizzontale. */
        tacca(nome, p, verticale, quando) {
          const d = 0.22;
          k.seg(`tac${nome}`, verticale ? [p[0], p[1] - d] : [p[0] - d, p[1]], verticale ? [p[0], p[1] + d] : [p[0] + d, p[1]]);
          stile(`tac${nome}`, { ...STILI.tacca, layer: LIVELLI.misure });
          if (quando !== undefined) k.compare(`tac${nome}`, quando);
          return registra(`tac${nome}`);
        },
        /** Arco di riporto: centro O, dal punto (0, −raggio) sull'asse al punto (raggio, 0) sulla LT. */
        riporto(nome, raggio, finestra) {
          k.arco(`arcR${nome}`, O, raggio, 270, 90, finestra);
          stile(`arcR${nome}`, { layer: LIVELLI.proiezioni });
          if (TECNICO) stile(`arcR${nome}`, STILI.compasso);
          return registra(`arcR${nome}`);
        },
        /**
         * Punto con nome (es. "A′"). Compare a `quando` (0–1).
         * `spostaNome` = [dx, dy] in cm: mette il nome in quel punto invece che in alto a destra
         * (serve quando lì passa una linea e il nome non si leggerebbe). Lo spostamento indica l'angolo
         * in basso a sinistra della scritta; per un nome con gli apici, scritto in LaTeX, l'angolo in alto a sinistra.
         */
        punto(nome, p, etichetta, quando, spostaNome) {
          const conApici = Boolean(etichetta) && haApici(etichetta);
          const dove = spostaNome || (conApici ? [0.2, 0.85] : null);   // i nomi con gli apici sono sempre scritte: stesso carattere ovunque
          k.punto(nome, p, dove ? undefined : etichetta);
          if (quando !== undefined) k.compare(nome, quando);
          registra(nome);
          if (TECNICO) stile(nome, { color: NERO, pointSize: 3 });
          if (dove) {
            stile(nome, { label: false });
            f.scritta(`Nome${nome}`, etichetta || nome, [p[0] + dove[0], p[1] + dove[1]], ROSSO_NOMI, quando);
            stile(`TestoNome${nome}`, { layer: LIVELLI.nomi });
          }
          return nome;
        },
        /** Punto di servizio numerato (1, 2, 3…): nome N1, N2… */
        numero(n, p, quando) {
          k.punto(`N${n}`, p, String(n));
          stile(`N${n}`, { ...STILI.servizio, layer: LIVELLI.proiezioni });
          if (quando !== undefined) k.compare(`N${n}`, quando);
          return registra(`N${n}`);
        },
        /** Punto senza nome (un centro, un segno fatto con la matita). Compare a `quando` (0–1). */
        segno(nome, p, quando) {
          k.punto(`Segno${nome}`, p);
          stile(`Segno${nome}`, { ...STILI.servizio, label: false });
          if (quando !== undefined) k.compare(`Segno${nome}`, quando);
          return registra(`Segno${nome}`);
        },
        /** Stile di un oggetto creato da uno strumento (per i ritocchi dentro una tavola). */
        stile(nome, s) { return stile(nome, s); },
        /** Traccia di un piano di taglio: tratto-punto marcato, da a verso b. */
        traccia(nome, a, b, finestra) {
          k.traccia(`lineTc${nome}`, a, b, finestra);
          stile(`lineTc${nome}`, { ...STILI.traccia, layer: LIVELLI.figura });
          return registra(`lineTc${nome}`);
        },
        /** Tratteggio di una sezione: righe sottili a 45°, ogni `passo` cm, dentro il poligono convesso `vertici`. */
        tratteggio(nome, vertici, quando, passo = 0.45) {
          const valori = vertici.map((p) => p[1] - p[0]);                 // le righe sono y − x = c
          const cMin = Math.min(...valori), cMax = Math.max(...valori);
          let i = 0;
          for (let c = cMin + passo / 2; c < cMax; c += passo) {
            const punti = [];
            vertici.forEach((a, j) => {
              const b = vertici[(j + 1) % vertici.length];
              const da = a[1] - a[0] - c, db = b[1] - b[0] - c;
              if ((da <= 0 && db > 0) || (da > 0 && db <= 0)) {
                const s = da / (da - db);
                punti.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s]);
              }
            });
            if (punti.length < 2) continue;
            punti.sort((p, q) => p[0] - q[0]);
            const n = `lineTr${nome}x${++i}`;
            k.seg(n, punti[0], punti[punti.length - 1]);
            stile(n, { ...STILI.tratteggio, layer: LIVELLI.figura });
            if (quando !== undefined) k.compare(n, quando);
            registra(n);
          }
        },
        /** Curva x(t), y(t) scritta come comando GeoGebra: con `ripasso` è un tratto finale, altrimenti un tratto della figura. */
        curva(nome, fx, fy, t0, t1, quando, ripasso) {
          const n = ripasso ? `draw${nome}` : `lineFg${nome}`;
          t.commands.push(`${n}=Curve(${fx},${fy},t,${t0},${t1})`);
          stile(n, { ...(ripasso ? STILI.ripasso : STILI.figura), layer: LIVELLI.figura });
          if (ripasso) k.risultato(n);
          if (quando !== undefined) k.compare(n, quando);
          return registra(n);
        },
        /** Ripasso finale di uno spigolo in vista. */
        ripassa(nome, a, b, finestra) {
          k.traccia(`draw${nome}`, a, b, finestra);
          k.risultato(`draw${nome}`);
          stile(`draw${nome}`, { ...STILI.ripasso, layer: LIVELLI.figura });
          return registra(`draw${nome}`);
        },
        /** Ripasso finale di uno spigolo nascosto (tratteggiato). */
        nascosto(nome, a, b, finestra) {
          k.traccia(`draw${nome}`, a, b, finestra);
          stile(`draw${nome}`, { ...STILI.nascosto, layer: LIVELLI.figura });
          return registra(`draw${nome}`);
        },
      };

      // Foglio tecnico: carta quadrettata da 1 cm, squadratura e cartiglio. Entrano nel primo passo e restano sempre.
      if (TECNICO) {
        const riga = (nome, a, b, s) => { k.seg(nome, a, b); stile(nome, s); registra(nome); };
        const fine = { color: [219, 228, 238], thickness: 1, lineStyle: 0 };
        const marcata = { color: [176, 190, 208], thickness: 1, lineStyle: 0 };
        for (let x = -Math.floor(sinistra); x <= Math.floor(destra); x += 1) {
          if (x !== 0) riga(`lineGv${x < 0 ? "m" : "p"}${Math.abs(x)}`, [x, -basso], [x, alto], x % 5 === 0 ? marcata : fine);
        }
        for (let y = -Math.floor(basso); y <= Math.floor(alto); y += 1) {
          if (y !== 0) riga(`lineGo${y < 0 ? "m" : "p"}${Math.abs(y)}`, [-sinistra, y], [destra, y], y % 5 === 0 ? marcata : fine);
        }
        const telaio = { color: NERO, thickness: 5, lineStyle: 0 };
        const giu = -basso - 1.7;
        const v = [[-sinistra, giu], [destra, giu], [destra, alto], [-sinistra, alto]];
        v.forEach((p, i) => riga(`lineSq${"ABCD"[i]}`, p, v[(i + 1) % 4], telaio));
        riga("lineSqCartiglio", [-sinistra, -basso], [destra, -basso], { color: NERO, thickness: 3, lineStyle: 0 });
        const largo = sinistra + destra;
        const x1 = -sinistra + largo * 0.45, x2 = -sinistra + largo * 0.71;
        riga("lineSqUno", [x1, giu], [x1, -basso], { color: NERO, thickness: 2, lineStyle: 0 });
        riga("lineSqDue", [x2, giu], [x2, -basso], { color: NERO, thickness: 2, lineStyle: 0 });
        const numero = (meta.eyebrow.match(/Tavola \d+/) || ["Tavola"])[0];
        f.scritta("CartA", "ProfTecnologIA · MC-DIS-2-01", [-sinistra + 0.3, -basso - 0.75], NERO);
        f.scritta("CartB", "Proiezioni ortogonali", [-sinistra + 0.3, -basso - 1.45], MATITA);
        f.scritta("CartC", numero, [x1 + 0.3, -basso - 0.75], NERO);
        f.scritta("CartD", "Scala 1:1 · cm", [x1 + 0.3, -basso - 1.45], MATITA);
        f.scritta("CartE", "Alunno ............", [x2 + 0.3, -basso - 0.75], MATITA);
        f.scritta("CartF", "Classe ..... Data .....", [x2 + 0.3, -basso - 1.45], MATITA);
      }

      costruisci(f, k, t);

      // Foglio tecnico: anche i segni di compasso creati direttamente con `k` (tavola 6) diventano a matita.
      if (TECNICO) {
        t.commands.forEach((c) => {
          const nome = c.split("=")[0];
          if (/^arc/.test(nome) && !t.styles[nome]) stile(nome, STILI.compasso);
        });
      }
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
      ["Passo 1 · Sul PO", "Disegna il lato BC", "Nel PO traccia una linea sottile parallela alla LT, 7 cm più in basso. Su questa linea segna C, a 3 cm dall’asse verticale, e B, 6 cm più a sinistra di C. Il segmento BC è il primo lato della base.", "La base tocca il PO: i suoi vertici coincidono con le loro proiezioni. Per questo li chiami A, B e C, senza apice."],
      ["Passo 2 · Compasso", "Completa il triangolo", "Apri il compasso quanto BC, 6 cm. Punta in B e traccia un archetto sopra il lato. Fai lo stesso da C. I due archetti si incrociano in A. Unisci A con B e con C.", "È la costruzione del triangolo equilatero che hai imparato in prima."],
      ["Passo 3 · Verso il PV", "Sali dai tre vertici", "Da B, da A e da C traccia tre linee verticali sottili che salgono oltre la LT. Sono le linee di proiezione: portano le larghezze dal PO al piano verticale (PV).", "Traccia sottili le linee di proiezione: alla fine ripasserai solo i tratti che fanno parte della figura."],
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
      ["Passo 1 · Sul PO", "Disegna la base", "Traccia una linea sottile parallela alla LT, 2 cm più in basso: 2 cm è la distanza dal PV. Su questa linea segna due punti, a 3 cm e a 9 cm dall’asse verticale: 3 cm è la distanza dal PL. Il tratto tra i due punti è il lato in alto del quadrato. Completa il quadrato partendo dal punto di sinistra: 6 cm in giù, 6 cm verso destra, 6 cm in su.", "Nel PO misuri la distanza dal PV dalla LT verso il basso."],
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

  /** Frase del passo 0: quanto foglio serve attorno a O. */
  const prepara = (sx, dx, su, giu) => `Sul tuo foglio traccia la linea di terra (LT) e l’asse verticale: si incrociano nel punto O. Ti servono almeno ${sx} cm a sinistra di O, ${dx} cm a destra, ${su} cm sopra e ${giu} cm sotto.`;
  const QUARTO = "nel riquadro in basso a destra, fino alla LT";
  const BLU = [30, 64, 175];

  // ── Tavola 1 · Il foglio e i tre piani ──────────────────────────────────────
  {
    const L = { sinistra: 10, destra: 8, alto: 7.2, basso: 6.6 };
    TAVOLE["po-foglio"] = creaFoglio({
      title: "Il foglio e i tre piani",
      eyebrow: "Tavola 1 · Dove si disegna ogni vista",
      subtitle: "Prepara il foglio delle proiezioni ortogonali: linea di terra, asse verticale, i tre piani e il riquadro del compasso.",
      filename: "MC-DIS-2-01_po-foglio.ggb",
      proofTitle: "Tre pareti aperte sul foglio",
      proofCopy: "Immagina l’angolo di una stanza. Il pavimento è il piano orizzontale (PO), la parete di fronte è il piano verticale (PV), la parete di fianco, alla tua destra, è il piano laterale (PL). Per disegnarli su un foglio solo, il pavimento si abbassa attorno alla linea di terra e la parete di fianco si apre come una porta attorno all’asse verticale. Per questo la distanza dal PV compare due volte: sotto la LT nel PO e a destra dell’asse verticale nel PL. L’arco di compasso tiene uguali le due misure.",
      equality: "PV: di fronte · PO: dall’alto · PL: di fianco",
      steps: [
        ["Prima di iniziare", "Che cosa ti serve", "Prendi un foglio da disegno, la matita, il righello, due squadre e il compasso. Tieni il foglio in orizzontale. Su questo foglio disegnerai lo stesso oggetto tre volte: visto di fronte, visto dall’alto e visto di fianco.", "I tre disegni insieme si chiamano proiezioni ortogonali."],
        ["Passo 1 · Linea di terra", "Traccia la LT", "Con il righello traccia una linea orizzontale da un bordo all’altro, circa a metà del foglio. È la linea di terra: scrivi LT all’estremo sinistro.", "Sopra la linea di terra disegnerai le viste di fronte e di fianco; sotto, la vista dall’alto."],
        ["Passo 2 · Asse verticale", "Segna O e traccia l’asse", "Segna sulla LT il punto O, un po’ a destra del centro del foglio. Appoggia una squadra sulla LT e traccia per O una linea verticale, da un bordo all’altro: è l’asse verticale.", "Controlla con la squadra: LT e asse verticale formano quattro angoli retti."],
        ["Passo 3 · I tre piani", "Scrivi i nomi dei piani", "Ora il foglio ha quattro riquadri. In alto a sinistra scrivi PV: è il piano verticale, dove disegni l’oggetto visto di fronte. In basso a sinistra scrivi PO: è il piano orizzontale, per la vista dall’alto. In alto a destra scrivi PL: è il piano laterale, per la vista di fianco. Di fianco vuol dire: guardando l’oggetto da sinistra.", "Nelle tavole del libro il PV è azzurro, il PO giallo e il PL rosa. Sul tuo foglio puoi colorarli leggeri con le matite."],
        ["Passo 4 · Le misure", "Dove si misura ogni distanza", "In questo passo non disegni niente: guarda i tratti arancioni. L’altezza è la distanza dal PO: si misura dalla LT verso l’alto, nel PV e nel PL. La distanza dal PV si misura in due posti: nel PO dalla LT verso il basso, nel PL dall’asse verticale verso destra. La distanza dal PL si misura dall’asse verticale verso sinistra, nel PV e nel PO.", "La distanza dal PV compare due volte: è quella che porterai da una parte all’altra con il compasso."],
        ["Passo 5 · Il quarto riquadro", "A che cosa serve il compasso", `Il riquadro in basso a destra resta bianco: serve al compasso. Prova: segna il punto 1 sull’asse verticale, 4 cm sotto O. Punta il compasso in O, aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}. Trovi il punto 2: è a 4 cm da O, ma a destra.`, "Questo quarto di giro si chiama arco di riporto. Lo traccerai in tutte le tavole: porta nel PL le distanze dal PV che hai segnato nel PO."],
      ],
    }, L, (f) => {
      // Passo 0 · foglio bianco
      f.bordo();
      f.passo();

      // Passo 1 · linea di terra
      f.lineaDiTerra([0.12, 0.85]);
      f.scritta("LT", "LT", [-L.sinistra + 0.3, 0.25], INCHIOSTRO, 0.88);   // dentro il bordo del foglio
      f.passo();

      // Passo 2 · O e asse verticale
      f.origine(0.15);
      f.asseVerticale([0.3, 0.94]);
      f.passo();

      // Passo 3 · i tre piani (i colori si accendono da questo passo)
      f.piani(3);
      f.nomiPiani(0.15);
      f.scritta("VistaPV", "vista di fronte", [-L.sinistra + 0.3, L.alto - 1.7], PIANI.PV.testo, 0.4);
      f.scritta("VistaPO", "vista dall’alto", [-L.sinistra + 0.3, -L.basso + 1.15], PIANI.PO.testo, 0.6);
      f.scritta("VistaPL", "vista di fianco", [L.destra - 5.3, L.alto - 1.7], PIANI.PL.testo, 0.8);
      f.passo();

      // Passo 4 · dove si misura ogni distanza
      // Scritte lunghe: stanno a destra del loro tratto, o cominciano lontano dall'asse verticale, così non
      // escono dal riquadro nemmeno sul telefono, dove i caratteri sono più grandi rispetto al foglio.
      f.misura("AltPV", [-3.4, 0], [-3.4, 3.2], "altezza", 0.1, "dx");
      f.misura("AltPL", [4.8, 0], [4.8, 3.2], "altezza", 0.22, "dx");
      f.misura("ProfPO", [-7, 0], [-7, -3.2], "distanza dal PV", 0.36, "dx");
      f.misura("ProfPL", [0, 4.4], [3.2, 4.4], "distanza dal PV", 0.5, "su", [1.6, 0]);     // lunga quanto quella nel PO: è la stessa misura
      f.misura("LargPV", [0, 3.5], [-4.4, 3.5], "distanza dal PL", 0.66, "su", [-0.3, 0]);   // più in basso di quella nel PL: non devono sembrare una linea sola
      f.misura("LargPO", [0, -5], [-4.4, -5], "distanza dal PL", 0.8, "giu", [-0.3, 0]);
      f.passo();

      // Passo 5 · l'arco di riporto
      f.misura("ArcoGiu", f.O, [0, -4], "4 cm", 0.12, "dx");
      f.numero(1, [0, -4], 0.12);
      f.riporto("Prova", 4, [0.3, 0.8]);
      f.numero(2, [4, 0], 0.82);
      f.misura("ArcoDes", f.O, [4, 0], "4 cm", 0.88, "giu");
      f.passo();
    });
  }

  // ── Tavola 3 · Triangolo equilatero parallelo al PO ─────────────────────────
  TAVOLE["po-triangolo-parallelo-po"] = creaFoglio({
    title: "Triangolo equilatero parallelo al PO",
    eyebrow: "Tavola 3 · Una figura piana vista di taglio",
    subtitle: "Triangolo equilatero ABC di lato 7 cm, parallelo al PO, 3 cm più in alto. Il lato AB è parallelo alla LT, a 7,5 cm dal PV; B dista 2 cm dal PL; C è rivolto verso la LT.",
    filename: "MC-DIS-2-01_po-triangolo-parallelo-po.ggb",
    proofTitle: "Intera da una parte, di taglio dalle altre due",
    proofCopy: "Una figura piana parallela a un piano si vede su quel piano con la sua vera forma e le sue vere misure. Sugli altri due piani si vede di taglio e diventa un segmento. Nel PV il segmento è lungo quanto il lato AB, 7 cm. Nel PL è lungo quanto l’altezza del triangolo, circa 6,1 cm, e i punti A e B cadono uno sull’altro.",
    equality: "PO: triangolo di lato 7 cm · PV: 7 cm · PL: circa 6,1 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Il triangolo equilatero ABC ha il lato di 7 cm. È parallelo al piano orizzontale (PO), 3 cm più in alto. Il lato AB è parallelo alla linea di terra e dista 7,5 cm dal piano verticale (PV); B dista 2 cm dal piano laterale (PL); C è il vertice più vicino al PV. ${prepara(11, 9, 5, 9)}`, "Una figura piana non ha spessore: pensala come un cartoncino sottilissimo."],
      ["Passo 1 · Sul PO", "Disegna il lato A′B′", "Nel PO traccia una linea sottile parallela alla LT, 7,5 cm più in basso. Su questa linea segna B′, 2 cm a sinistra dell’asse verticale, e A′, 7 cm più a sinistra di B′.", "Il triangolo è parallelo al PO: dall’alto si vede con la sua vera forma, per questo parti da qui. A′ si legge «A primo»: è la proiezione di A sul PO."],
      ["Passo 2 · Compasso", "Completa il triangolo", "Apri il compasso quanto il lato, 7 cm. Punta in A′ e traccia un archetto sopra il lato. Fai lo stesso da B′. I due archetti si incrociano in C′. Unisci C′ con A′ e con B′.", "Controlla con il righello: anche A′C′ e B′C′ sono lunghi 7 cm, e C′ sta a circa 1,4 cm dalla LT."],
      ["Passo 3 · Verso il PV", "Sali dai tre vertici", "Da A′, da C′ e da B′ traccia tre linee verticali sottili che salgono fino a circa 4 cm sopra la LT.", "Sono le linee di proiezione: portano le larghezze dal PO al PV."],
      ["Passo 4 · Sul PV", "Trova A″, C″ e B″", "Il triangolo sta tutto a 3 cm di altezza. Nel PV traccia una linea orizzontale 3 cm sopra la LT: incontra le tre verticali in A″, C″ e B″. Di fronte il triangolo si vede di taglio: è il segmento A″B″, con C″ in mezzo.", "Visto di taglio, un cartoncino diventa una linea. A″ si legge «A secondo»."],
      ["Passo 5 · Verso il PL", "Porta altezza e profondità verso il PL", "Nel PV prolunga verso destra la linea a 3 cm di altezza, fino a circa 9 cm oltre l’asse verticale. Nel PO traccia due linee orizzontali fino all’asse verticale: una parte da C′ e trova il punto 1, l’altra continua il lato A′B′ e trova il punto 2.", "Le profondità sono le distanze dal PV. Qui sono due: quella di C e quella del lato AB."],
      ["Passo 6 · Compasso", "Porta le profondità sulla LT", `Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 3. Poi aprilo fino al punto 2 e traccia un altro quarto di giro: trovi il punto 4.`, "Controlla con il righello: il punto 3 sta a circa 1,4 cm da O, il punto 4 a 7,5 cm."],
      ["Passo 7 · Sul PL", "Trova C‴, A‴ e B‴", "Dai punti 3 e 4 sali in verticale fino alla linea che hai tracciato a 3 cm di altezza. Sulla verticale che parte dal punto 3 trovi C‴. Sulla verticale che parte dal punto 4 cadono insieme A‴ e B‴: visto di fianco, cioè da sinistra, B sta esattamente dietro ad A. Si scrive A‴ ≡ B‴ e si legge «A terzo coincide con B terzo».", "Anche di fianco il triangolo si vede di taglio."],
      ["Passo 8 · Ripasso", "Ripassa le tre proiezioni", "Ripassa con un tratto deciso il triangolo nel PO e i due segmenti: A″B″ nel PV e C‴A‴ nel PL. Controlla di aver scritto il nome di ogni punto.", "I due segmenti non sono lunghi uguali: 7 cm nel PV, circa 6,1 cm nel PL."],
    ],
  }, { sinistra: 12.6, destra: 9.4, alto: 5, basso: 9.6 }, (f) => {
    const lato = 7, quota = 3, profAB = 7.5, dallAsse = 2;
    const hTri = (lato * Math.sqrt(3)) / 2;                    // altezza del triangolo ≈ 6,062
    const Bp = [-dallAsse, -profAB], Ap = [-dallAsse - lato, -profAB], Cp = [-dallAsse - lato / 2, -profAB + hTri];
    const profC = profAB - hTri;                               // distanza di C dal PV ≈ 1,438
    const su = quota + 0.9;

    f.base();
    f.passo();

    // Passo 1 · lato A′B′
    f.misura("SottoLT", [Ap[0] - 0.9, 0], [Ap[0] - 0.9, -profAB], "7,5 cm", 0.12, "sx");
    f.misura("DallAsse", [Bp[0], -profAB - 0.9], [0, -profAB - 0.9], "2 cm", 0.3, "giu");
    f.punto("Bpo", Bp, "B′", 0.4, [-0.85, -0.15]);
    f.figura("AB", Bp, Ap, [0.45, 0.9]);
    f.scritta("LatoAB", "7 cm", [Cp[0] - 0.7, -profAB + 0.25], BLU, 0.9);
    f.punto("Apo", Ap, "A′", 0.92, [0.1, -0.15]);
    f.passo();

    // Passo 2 · triangolo equilatero
    f.archetto("A", Ap, Cp, 13, [0.12, 0.38]);
    f.archetto("B", Bp, Cp, 13, [0.38, 0.62]);
    f.punto("Cpo", Cp, "C′", 0.64, [0.15, 1.15]);
    f.figura("CA", Cp, Ap, [0.66, 0.8]);
    f.figura("CB", Cp, Bp, [0.8, 0.94]);
    f.passo();

    // Passo 3 · linee di proiezione verso il PV
    const [w1, w2, w3] = finestre(3);
    f.proietta("A", Ap, [Ap[0], su], w1);
    f.proietta("C", Cp, [Cp[0], su], w2);
    f.proietta("B", Bp, [Bp[0], su], w3);
    f.passo();

    // Passo 4 · proiezioni sul PV
    f.misura("Quota", [Ap[0] - 0.9, 0], [Ap[0] - 0.9, quota], "3 cm", 0.12, "sx");
    f.figura("PV", [Ap[0], quota], [Bp[0], quota], [0.3, 0.7]);
    f.punto("Apv", [Ap[0], quota], "A″", 0.75);
    f.punto("Cpv", [Cp[0], quota], "C″", 0.82);
    f.punto("Bpv", [Bp[0], quota], "B″", 0.9);
    f.passo();

    // Passo 5 · verso il PL
    f.proietta("Quota", [Bp[0], quota], [profAB + 1.3, quota], [0.12, 0.45]);
    f.proietta("ProfC", Cp, [0, Cp[1]], [0.45, 0.68]);
    f.numero(1, [0, Cp[1]], 0.7);
    f.proietta("ProfAB", Bp, [0, Bp[1]], [0.7, 0.92]);
    f.numero(2, [0, Bp[1]], 0.94);
    f.passo();

    // Passo 6 · archi di riporto
    f.riporto("Uno", profC, [0.12, 0.42]);
    f.numero(3, [profC, 0], 0.44);
    f.riporto("Due", profAB, [0.48, 0.92]);
    f.numero(4, [profAB, 0], 0.94);
    f.passo();

    // Passo 7 · proiezioni sul PL
    f.proietta("Tre", [profC, 0], [profC, quota], [0.12, 0.4]);
    f.punto("Cpl", [profC, quota], "C‴", 0.42);
    f.proietta("Quattro", [profAB, 0], [profAB, quota], [0.45, 0.8]);
    f.punto("ABpl", [profAB, quota], "A‴≡B‴", 0.82, [-2.7, 1.05]);
    f.passo();

    // Passo 8 · ripasso
    const r = finestre(5, 0.08, 0.93);
    f.ripassa("POa", Ap, Bp, r[0]);
    f.ripassa("POb", Bp, Cp, r[1]);
    f.ripassa("POc", Cp, Ap, r[2]);
    f.ripassa("PV", [Ap[0], quota], [Bp[0], quota], r[3]);
    f.ripassa("PL", [profC, quota], [profAB, quota], r[4]);
    f.passo();
  });

  // ── Tavola 4 · Esagono parallelo al PV ───────────────────────────────────────
  TAVOLE["po-esagono-parallelo-pv"] = creaFoglio({
    title: "Esagono parallelo al PV",
    eyebrow: "Tavola 4 · Si parte dal piano verticale",
    subtitle: "Esagono regolare ABCDEF di lato 3,5 cm, parallelo al PV, a 4 cm di distanza. Il centro sta 5 cm sopra il PO e a 6 cm dal PL; A e D sono alla stessa altezza del centro.",
    filename: "MC-DIS-2-01_po-esagono-parallelo-pv.ggb",
    proofTitle: "Due vertici, una sola proiezione",
    proofCopy: "L’esagono è parallelo al PV: lì si vede intero, con i lati di 3,5 cm. Dall’alto e di fianco si vede di taglio e diventa un segmento. Nel PO il segmento è lungo quanto la distanza tra A e D, 7 cm. Nel PL è lungo quanto la distanza tra il lato in alto e il lato in basso, circa 6,1 cm. Due vertici che stanno uno sopra l’altro hanno la stessa proiezione sul PO. Due vertici che stanno uno dietro l’altro, per chi guarda di fianco, hanno la stessa proiezione sul PL. Per questo sei vertici diventano quattro punti nel PO e tre nel PL.",
    equality: "PV: esagono di lato 3,5 cm · PO: 7 cm · PL: circa 6,1 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `L’esagono regolare ABCDEF ha il lato di 3,5 cm. È parallelo al piano verticale (PV) e ne dista 4 cm. Il suo centro sta 5 cm sopra il piano orizzontale (PO) e a 6 cm dal piano laterale (PL). I vertici A e D sono alla stessa altezza del centro. ${prepara(11, 7, 10, 6)}`, "Questa volta la figura si vede intera di fronte: parti dal PV."],
      ["Passo 1 · Sul PV", "Disegna la circonferenza", "Nel PV segna il centro dell’esagono: 6 cm a sinistra dell’asse verticale e 5 cm sopra la LT. Traccia per il centro una linea orizzontale sottile. Punta il compasso nel centro, aprilo di 3,5 cm e traccia una circonferenza: taglia la linea orizzontale in A″, a sinistra, e in D″, a destra.", "A″ si legge «A secondo»: è la proiezione di A sul PV."],
      ["Passo 2 · Compasso", "Trova gli altri quattro vertici", "Senza cambiare apertura, punta in A″ e taglia la circonferenza sopra e sotto: trovi B″ in alto e F″ in basso. Punta in D″ e fai lo stesso: trovi C″ in alto ed E″ in basso. Unisci i sei punti in ordine: A″, B″, C″, D″, E″, F″ e di nuovo A″.", "Nell’esagono regolare il lato è lungo quanto il raggio: è la costruzione che hai imparato in prima."],
      ["Passo 3 · Verso il PO", "Scendi dai vertici", "Dai vertici traccia le linee verticali sottili che scendono fino a circa 4,5 cm sotto la LT. Sono quattro, non sei: B″ e F″ stanno sulla stessa verticale, e così C″ ed E″.", "Sono le linee di proiezione: portano le larghezze dal PV al PO."],
      ["Passo 4 · Sul PO", "Trova le proiezioni sul PO", "L’esagono dista 4 cm dal PV. Nel PO traccia una linea orizzontale 4 cm sotto la LT: incontra le quattro verticali. Dall’alto l’esagono si vede di taglio, come un cartoncino guardato dal bordo: è il segmento A′D′. Sulla seconda verticale cadono insieme B′ e F′, sulla terza C′ ed E′.", "Quando due proiezioni cadono nello stesso punto si scrive B′ ≡ F′ e si legge «B primo coincide con F primo»."],
      ["Passo 5 · Verso il PL", "Porta altezze e profondità verso il PL", "Nel PV traccia tre linee orizzontali verso destra, fino a circa 5 cm oltre l’asse verticale. La prima continua il lato B″C″. La seconda continua la linea che passa per A″ e D″. La terza continua il lato F″E″. Nel PO prolunga la linea a 4 cm fino all’asse verticale: trovi il punto 1.", "Tre altezze diverse e una sola profondità, cioè una sola distanza dal PV: 4 cm."],
      ["Passo 6 · Compasso", "Porta la profondità sulla LT", `Punta il compasso in O, aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 2.`, "Da O a 1 e da O a 2 la distanza è la stessa: 4 cm."],
      ["Passo 7 · Sul PL", "Trova le proiezioni sul PL", "Dal punto 2 sali in verticale: incontri le tre linee orizzontali. Di fianco l’esagono è un segmento verticale. In basso cadono insieme F‴ ed E‴, a metà A‴ e D‴, in alto B‴ e C‴. F‴ si legge «F terzo».", "Il segmento è lungo quanto la distanza tra il lato in alto e il lato in basso dell’esagono: circa 6,1 cm."],
      ["Passo 8 · Ripasso", "Ripassa le tre proiezioni", "Ripassa con un tratto deciso l’esagono nel PV, il segmento A′D′ nel PO e il segmento verticale nel PL. Controlla i nomi dei punti: dove due proiezioni coincidono c’è il segno ≡.", "Sei vertici: sei punti nel PV, quattro nel PO, tre nel PL."],
    ],
  }, { sinistra: 12.4, destra: 7.4, alto: 10.4, basso: 6.2 }, (f) => {
    const lato = 3.5, dPV = 4, cx = -6, cy = 5;
    const h = (lato * Math.sqrt(3)) / 2;                       // metà distanza tra i due lati orizzontali ≈ 3,031
    const K = [cx, cy];
    const A = [cx - lato, cy], D = [cx + lato, cy];
    const B = [cx - lato / 2, cy + h], C = [cx + lato / 2, cy + h];
    const E = [cx + lato / 2, cy - h], F = [cx - lato / 2, cy - h];
    const vertici = [A, B, C, D, E, F];

    f.base();
    f.passo();

    // Passo 1 · centro, linea orizzontale, circonferenza
    f.misura("CentroX", [cx, 0], f.O, "6 cm", 0.1, "giu", [1.6, 0]);
    f.tacca("CentroX", [cx, 0], true, 0.1);
    f.misura("CentroY", [cx, 0], K, "5 cm", 0.22, "dx", [0, -1.85]);   // in basso: lontana dal lato F″E″, che è lungo 3,5 cm
    f.segno("K", K, 0.32);
    f.proietta("Diam", [cx - lato - 0.6, cy], [cx + lato + 0.6, cy], [0.36, 0.54]);
    f.cerchio("Esa", K, lato, [0.56, 0.9]);
    f.punto("Apv", A, "A″", 0.93, [-1.05, 0.95]);
    f.punto("Dpv", D, "D″", 0.93);
    f.passo();

    // Passo 2 · gli altri quattro vertici e i lati
    f.archetto("AB", A, B, 10, [0.1, 0.22]);
    f.punto("Bpv", B, "B″", 0.23, [-0.95, 0.95]);
    f.archetto("AF", A, F, 10, [0.22, 0.34]);
    f.punto("Fpv", F, "F″", 0.35, [-1.0, -0.15]);
    f.archetto("DC", D, C, 10, [0.34, 0.46]);
    f.punto("Cpv", C, "C″", 0.47);
    f.archetto("DE", D, E, 10, [0.46, 0.58]);
    f.punto("Epv", E, "E″", 0.59, [0.2, -0.15]);
    const lati = finestre(6, 0.62, 0.94);
    vertici.forEach((p, i) => f.figura(`Lato${"ABCDEF"[i]}`, p, vertici[(i + 1) % 6], lati[i]));
    f.passo();

    // Passo 3 · quattro linee di proiezione verso il PO
    const v = finestre(4);
    const giu = -dPV - 0.35;
    f.proietta("A", A, [A[0], giu], v[0]);
    f.proietta("BF", B, [B[0], giu], v[1]);
    f.proietta("CE", C, [C[0], giu], v[2]);
    f.proietta("D", D, [D[0], giu], v[3]);
    f.passo();

    // Passo 4 · proiezioni sul PO
    f.misura("DalPV", [A[0] - 0.9, 0], [A[0] - 0.9, -dPV], "4 cm", 0.12, "sx");
    f.figura("PO", [A[0], -dPV], [D[0], -dPV], [0.3, 0.7]);
    f.punto("Apo", [A[0], -dPV], "A′", 0.74, [-0.35, -0.55]);
    f.punto("BFpo", [B[0], -dPV], "B′≡F′", 0.8, [-1.0, -0.55]);
    f.punto("CEpo", [C[0], -dPV], "C′≡E′", 0.86, [-1.0, -0.55]);
    f.punto("Dpo", [D[0], -dPV], "D′", 0.92, [-0.3, -0.55]);
    f.passo();

    // Passo 5 · verso il PL
    const oltre = dPV + 1.2;
    f.proietta("AltSu", C, [oltre, C[1]], [0.12, 0.32]);
    f.proietta("AltMezzo", [D[0] + 0.6, cy], [oltre, cy], [0.32, 0.52]);
    f.proietta("AltGiu", E, [oltre, E[1]], [0.52, 0.72]);
    f.proietta("Prof", [D[0], -dPV], [0, -dPV], [0.72, 0.92]);
    f.numero(1, [0, -dPV], 0.94);
    f.passo();

    // Passo 6 · arco di riporto
    f.riporto("Uno", dPV);
    f.numero(2, [dPV, 0], 0.97);
    f.passo();

    // Passo 7 · proiezioni sul PL
    f.proietta("Due", [dPV, 0], [dPV, C[1] + 0.5], [0.12, 0.6]);
    f.punto("FEpl", [dPV, E[1]], "F‴≡E‴", 0.3, [0.25, 0.95]);
    f.punto("ADpl", [dPV, cy], "A‴≡D‴", 0.45, [0.25, 0.95]);
    f.punto("BCpl", [dPV, C[1]], "B‴≡C‴", 0.62, [0.25, 0.95]);
    f.passo();

    // Passo 8 · ripasso
    const r = finestre(8, 0.06, 0.93);
    vertici.forEach((p, i) => f.ripassa(`PV${"abcdef"[i]}`, p, vertici[(i + 1) % 6], r[i]));
    f.ripassa("PO", [A[0], -dPV], [D[0], -dPV], r[6]);
    f.ripassa("PL", [dPV, E[1]], [dPV, C[1]], r[7]);
    f.passo();
  });

  // ── Tavola 5 · Parallelepipedo appoggiato sul PO ─────────────────────────────
  TAVOLE["po-parallelepipedo"] = creaFoglio({
    title: "Parallelepipedo appoggiato sul PO",
    eyebrow: "Tavola 5 · Il primo solido",
    subtitle: "Parallelepipedo con la base di 6 × 4 cm, alto 8 cm, appoggiato sul PO. I lati di 6 cm sono paralleli alla LT. Dista 2 cm dal PV e 3 cm dal PL.",
    filename: "MC-DIS-2-01_po-parallelepipedo.ggb",
    proofTitle: "Tre misure, tre rettangoli",
    proofCopy: "Il parallelepipedo ha tre misure: larghezza 6 cm, profondità 4 cm, altezza 8 cm. Ogni vista ne mostra due e nasconde la terza. Il PO mostra larghezza e profondità, il PV larghezza e altezza, il PL profondità e altezza. Per questo le viste sono allineate: la larghezza passa dal PO al PV lungo le verticali, l’altezza passa dal PV al PL lungo le orizzontali, la profondità passa dal PO al PL con gli archi.",
    equality: "PO: 6 × 4 cm · PV: 6 × 8 cm · PL: 4 × 8 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Il parallelepipedo è una scatola con sei facce rettangolari. La base misura 6 cm per 4 cm, l’altezza è 8 cm. È appoggiato sul piano orizzontale (PO), con i lati di 6 cm paralleli alla linea di terra. Dista 2 cm dal piano verticale (PV) e 3 cm dal piano laterale (PL). ${prepara(11, 8, 9, 7)}`, "Regola pratica: comincia dalla vista che mostra la base intera. Qui è il PO."],
      ["Passo 1 · Sul PO", "Disegna la base", "Nel PO traccia una linea sottile parallela alla LT, 2 cm più in basso: 2 cm è la distanza dal PV. Su questa linea segna due punti a sinistra dell’asse verticale. Il primo sta a 3 cm: è la distanza dal PL. Il secondo sta a 9 cm, perché 3 + 6 = 9. Il tratto tra i due punti è il lato in alto del rettangolo. Completa il rettangolo partendo dal punto di sinistra: 4 cm in giù, 6 cm verso destra, 4 cm in su.", "Dall’alto vedi la faccia di sopra, che è uguale alla base."],
      ["Passo 2 · Verso il PV", "Sali dai due lati", "Dal lato sinistro e dal lato destro del rettangolo traccia due linee verticali sottili che salgono fino a circa 9 cm sopra la LT.", "Sono le linee di proiezione: portano la larghezza, 6 cm, dal PO al PV."],
      ["Passo 3 · Sul PV", "Disegna il prospetto", "Il prospetto è la vista di fronte. Il parallelepipedo è appoggiato sul PO: nel PV la sua base sta sulla LT. Sulla verticale di sinistra misura 8 cm dalla LT, poi traccia una linea orizzontale fino alla verticale di destra. Con la LT ottieni un rettangolo largo 6 cm e alto 8 cm.", "Di fronte vedi la faccia davanti: larghezza per altezza."],
      ["Passo 4 · Verso il PL", "Porta l’altezza e le distanze dal PV verso il PL", "Nel PV prolunga verso destra la linea a 8 cm di altezza, fino a circa 7 cm oltre l’asse verticale. Nel PO traccia due linee orizzontali fino all’asse verticale: una continua il lato in alto del rettangolo e trova il punto 1, l’altra continua il lato in basso e trova il punto 2.", "Le distanze dal PV sono due: 2 cm per la faccia dietro, 6 cm per la faccia davanti. La differenza, 4 cm, è la profondità del parallelepipedo."],
      ["Passo 5 · Compasso", "Porta le distanze dal PV sulla LT", `Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 3. Poi aprilo fino al punto 2 e traccia un altro quarto di giro: trovi il punto 4.`, "Controlla con il righello: il punto 3 sta a 2 cm da O, il punto 4 a 6 cm."],
      ["Passo 6 · Sul PL", "Disegna il fianco", "Dai punti 3 e 4 sali in verticale fino alla linea a 8 cm di altezza. Con la LT ottieni un rettangolo largo 4 cm e alto 8 cm: è il parallelepipedo visto di fianco.", "Di fianco vedi la faccia laterale: profondità per altezza."],
      ["Passo 7 · Ripasso", "Ripassa gli spigoli", "Ripassa con un tratto deciso i tre rettangoli. I loro lati sono gli spigoli del parallelepipedo: le linee dove si incontrano due facce. Gli spigoli nascosti si disegnano tratteggiati, cioè a trattini. Qui non ce ne sono: ogni spigolo nascosto cade esattamente su uno spigolo in vista.", "Ogni misura compare in due viste: la larghezza nel PO e nel PV, l’altezza nel PV e nel PL, la profondità nel PO e nel PL."],
    ],
  }, { sinistra: 11.8, destra: 7.8, alto: 9.4, basso: 7.8 }, (f) => {
    const larg = 6, prof = 4, alt = 8, dPV = 2, dPL = 3;
    const xD = -dPL, xS = -dPL - larg;                         // lato destro e lato sinistro
    const yA = -dPV, yB = -dPV - prof;                         // lato in alto e lato in basso (nel PO)
    const p1 = dPV, p2 = dPV + prof;                           // le due profondità
    const su = alt + 0.9;

    f.base();
    f.passo();

    // Passo 1 · base sul PO
    f.misura("DalPV", [xS - 0.9, 0], [xS - 0.9, yA], "2 cm", 0.12, "sx");
    f.misura("DalPL", [xD, yB - 0.7], [0, yB - 0.7], "3 cm", 0.25, "giu");
    const q = finestre(4, 0.36, 0.9);
    f.figura("RAlto", [xD, yA], [xS, yA], q[0]);
    f.figura("RSin", [xS, yA], [xS, yB], q[1]);
    f.figura("RBasso", [xS, yB], [xD, yB], q[2]);
    f.figura("RDes", [xD, yB], [xD, yA], q[3]);
    f.scritta("LatoLungo", "6 cm", [xS + larg / 2 - 0.7, yB + 0.25], BLU, 0.92);
    f.scritta("LatoCorto", "4 cm", [xS + 0.25, yA - prof / 2 - 0.25], BLU, 0.92);
    f.passo();

    // Passo 2 · linee di proiezione verso il PV
    f.proietta("Sin", [xS, yA], [xS, su], [0.12, 0.52]);
    f.proietta("Des", [xD, yA], [xD, su], [0.52, 0.94]);
    f.passo();

    // Passo 3 · prospetto
    f.misura("Alt", [xS, 0], [xS, alt], "8 cm", 0.12, "sx");
    f.figura("Sopra", [xS, alt], [xD, alt], [0.4, 0.94]);
    f.passo();

    // Passo 4 · verso il PL
    f.proietta("Alt", [xD, alt], [p2 + 1.2, alt], [0.12, 0.45]);
    f.proietta("ProfUno", [xD, yA], [0, yA], [0.45, 0.68]);
    f.numero(1, [0, yA], 0.7);
    f.proietta("ProfDue", [xD, yB], [0, yB], [0.7, 0.92]);
    f.numero(2, [0, yB], 0.94);
    f.passo();

    // Passo 5 · archi di riporto
    f.riporto("Uno", p1, [0.12, 0.42]);
    f.numero(3, [p1, 0], 0.44);
    f.riporto("Due", p2, [0.48, 0.92]);
    f.numero(4, [p2, 0], 0.94);
    f.passo();

    // Passo 6 · fianco
    f.proietta("Tre", [p1, 0], [p1, alt], [0.12, 0.5]);
    f.proietta("Quattro", [p2, 0], [p2, alt], [0.5, 0.92]);
    f.passo();

    // Passo 7 · ripasso (PO, poi PV, poi PL)
    const r = finestre(12, 0.06, 0.93);
    const rett = (sigla, x1, x2, y1, y2, da) => {
      f.ripassa(`${sigla}a`, [x1, y1], [x2, y1], r[da]);
      f.ripassa(`${sigla}b`, [x2, y1], [x2, y2], r[da + 1]);
      f.ripassa(`${sigla}c`, [x2, y2], [x1, y2], r[da + 2]);
      f.ripassa(`${sigla}d`, [x1, y2], [x1, y1], r[da + 3]);
    };
    rett("PO", xS, xD, yA, yB, 0);
    rett("PV", xS, xD, 0, alt, 4);
    rett("PL", p1, p2, 0, alt, 8);
    f.passo();
  });

  // ── Tavola 7 · Prisma esagonale con la base parallela al PO ─────────────────
  TAVOLE["po-prisma-esagonale"] = creaFoglio({
    title: "Prisma esagonale con la base parallela al PO",
    eyebrow: "Tavola 7 · Un solido sollevato da terra",
    subtitle: "Prisma esagonale regolare: lato di base 3,5 cm, altezza 7,5 cm. La base è parallela al PO, 1,5 cm più in alto, con due lati paralleli alla LT. Il centro della base dista 5 cm dal PV e 6 cm dal PL.",
    filename: "MC-DIS-2-01_po-prisma-esagonale.ggb",
    proofTitle: "Quante facce vedi da ogni parte",
    proofCopy: "Dall’alto il prisma è un esagono: la base e la faccia di sopra cadono una sull’altra. Di fronte e di fianco è un rettangolo alto 7,5 cm, che non tocca la LT perché il prisma è sollevato di 1,5 cm. Nel PV il rettangolo è largo 7 cm, la distanza tra i vertici A e D, e mostra tre facce. Nel PL è largo circa 6,1 cm, la distanza tra i due lati paralleli alla LT, e mostra due facce.",
    equality: "PO: esagono di lato 3,5 cm · PV: 7 × 7,5 cm · PL: circa 6,1 × 7,5 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Il prisma ha per base un esagono regolare di lato 3,5 cm ed è alto 7,5 cm. La base è parallela al piano orizzontale (PO) ma non lo tocca: sta 1,5 cm più in alto. Due lati della base sono paralleli alla linea di terra. Il centro della base dista 5 cm dal piano verticale (PV) e 6 cm dal piano laterale (PL). ${prepara(11, 9, 10, 9)}`, "Il prisma è sollevato: tra la sua base e il PO c’è 1,5 cm di vuoto."],
      ["Passo 1 · Sul PO", "Disegna la circonferenza", "Nel PO segna il centro della base: 6 cm a sinistra dell’asse verticale e 5 cm sotto la LT. Traccia per il centro una linea orizzontale sottile. Punta il compasso nel centro, aprilo di 3,5 cm e traccia una circonferenza: taglia la linea orizzontale in A′, a sinistra, e in D′, a destra.", "Dall’alto la base si vede intera: per questo parti dal PO. A′ si legge «A primo»."],
      ["Passo 2 · Compasso", "Completa l’esagono", "Senza cambiare apertura, punta in A′ e taglia la circonferenza sopra e sotto. Fai lo stesso da D′. Con A′ e D′ hai sei punti: uniscili in ordine. L’esagono ha due lati paralleli alla LT, uno in alto e uno in basso.", "Nell’esagono regolare il lato è lungo quanto il raggio: è la costruzione che hai imparato in prima."],
      ["Passo 3 · Verso il PV", "Sali dai vertici", "Dai vertici dell’esagono traccia le linee verticali sottili che salgono fino a circa 10 cm sopra la LT. Sono quattro, non sei: i vertici del lato in alto stanno sulle stesse verticali dei vertici del lato in basso.", "Sono le linee di proiezione: portano le larghezze dal PO al PV."],
      ["Passo 4 · Sul PV", "Disegna il prospetto", "Il prospetto è la vista di fronte. La base sta 1,5 cm sopra la LT: traccia una linea orizzontale a 1,5 cm, tra le due verticali esterne. La faccia di sopra sta 7,5 cm più in alto, cioè a 9 cm dalla LT: traccia una seconda linea orizzontale. Hai un rettangolo largo 7 cm e alto 7,5 cm. Le due verticali interne sono spigoli del prisma.", "Di fronte vedi tre facce: una al centro, larga 3,5 cm, e due ai lati, che sembrano larghe solo 1,75 cm perché sono girate."],
      ["Passo 5 · Verso il PL", "Porta altezze e profondità verso il PL", "Nel PV prolunga verso destra le due linee orizzontali, fino a circa 9 cm oltre l’asse verticale. Nel PO traccia tre linee orizzontali fino all’asse verticale: una continua il lato in alto dell’esagono, una continua la linea che passa per A′ e D′, una continua il lato in basso. Trovi i punti 1, 2 e 3.", "Tre profondità, cioè tre distanze dal PV: circa 2 cm, 5 cm e circa 8 cm."],
      ["Passo 6 · Compasso", "Porta le profondità sulla LT", `Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 4. Ripeti dal punto 2 e dal punto 3: trovi i punti 5 e 6.`, "Controlla con il righello: i punti 4, 5 e 6 stanno a circa 2 cm, a 5 cm e a circa 8 cm da O."],
      ["Passo 7 · Sul PL", "Disegna il fianco", "Dai punti 4, 5 e 6 sali in verticale fino alla linea a 9 cm di altezza. Tra la linea a 1,5 cm e quella a 9 cm ottieni un rettangolo largo circa 6,1 cm. La verticale che parte dal punto 5 lo divide in due: è lo spigolo che passa per A.", "Di fianco vedi due facce uguali."],
      ["Passo 8 · Ripasso", "Ripassa gli spigoli", "Ripassa con un tratto deciso l’esagono nel PO, il rettangolo con i due spigoli interni nel PV e il rettangolo con lo spigolo di mezzo nel PL. Qui non c’è niente da tratteggiare: gli spigoli nascosti cadono su quelli in vista.", "Controlla: nel PV e nel PL il prisma non tocca la LT."],
    ],
  }, { sinistra: 13.4, destra: 9.8, alto: 10.4, basso: 10.2 }, (f) => {
    const lato = 3.5, alt = 7.5, quota = 1.5, cx = -6, cy = -5;
    const h = (lato * Math.sqrt(3)) / 2;                       // ≈ 3,031
    const K = [cx, cy];
    const A = [cx - lato, cy], D = [cx + lato, cy];
    const B = [cx - lato / 2, cy + h], C = [cx + lato / 2, cy + h];     // lato in alto, verso la LT
    const E = [cx + lato / 2, cy - h], F = [cx - lato / 2, cy - h];     // lato in basso
    const vertici = [A, B, C, D, E, F];
    const p1 = -(cy + h), p2 = -cy, p3 = -(cy - h);            // profondità ≈ 1,969 · 5 · ≈ 8,031
    const yS = quota + alt;                                    // altezza della faccia di sopra: 9
    const su = yS + 0.7;

    f.base();
    f.passo();

    // Passo 1 · centro, linea orizzontale, circonferenza
    f.misura("CentroX", [cx, 0], f.O, "6 cm", 0.1, "su", [1.6, 0]);
    f.tacca("CentroX", [cx, 0], true, 0.1);
    f.misura("CentroY", [cx, 0], K, "5 cm", 0.22, "dx", [0, 1.65]);
    f.segno("K", K, 0.32);
    f.proietta("Diam", [cx - lato - 0.6, cy], [cx + lato + 0.6, cy], [0.36, 0.54]);
    f.cerchio("Base", K, lato, [0.56, 0.9]);
    f.punto("Apo", A, "A′", 0.93, [-1.05, 0.95]);
    f.punto("Dpo", D, "D′", 0.93);
    f.passo();

    // Passo 2 · esagono
    f.archetto("AB", A, B, 10, [0.1, 0.22]);
    f.archetto("AF", A, F, 10, [0.22, 0.34]);
    f.archetto("DC", D, C, 10, [0.34, 0.46]);
    f.archetto("DE", D, E, 10, [0.46, 0.58]);
    const lati = finestre(6, 0.62, 0.94);
    vertici.forEach((p, i) => f.figura(`Lato${"ABCDEF"[i]}`, p, vertici[(i + 1) % 6], lati[i]));
    f.passo();

    // Passo 3 · quattro linee di proiezione verso il PV
    const v = finestre(4);
    f.proietta("A", A, [A[0], su], v[0]);
    f.proietta("BF", F, [F[0], su], v[1]);
    f.proietta("CE", E, [E[0], su], v[2]);
    f.proietta("D", D, [D[0], su], v[3]);
    f.passo();

    // Passo 4 · prospetto
    f.misura("Quota", [A[0] - 0.9, 0], [A[0] - 0.9, quota], "1,5 cm", 0.1, "sx");
    f.figura("BasePV", [A[0], quota], [D[0], quota], [0.2, 0.42]);
    f.misura("Alt", [A[0], quota], [A[0], yS], "7,5 cm", 0.46, "sx");
    f.figura("SopraPV", [A[0], yS], [D[0], yS], [0.6, 0.94]);
    f.passo();

    // Passo 5 · verso il PL
    f.proietta("AltBase", [D[0], quota], [p3 + 0.9, quota], [0.12, 0.26]);
    f.proietta("AltSopra", [D[0], yS], [p3 + 0.9, yS], [0.26, 0.42]);
    f.proietta("ProfUno", C, [0, C[1]], [0.42, 0.56]);
    f.numero(1, [0, C[1]], 0.57);
    f.proietta("ProfDue", [D[0] + 0.6, cy], [0, cy], [0.6, 0.72]);
    f.numero(2, [0, cy], 0.73);
    f.proietta("ProfTre", E, [0, E[1]], [0.76, 0.9]);
    f.numero(3, [0, E[1]], 0.92);
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
    f.proietta("Quattro", [p1, 0], [p1, yS], [0.12, 0.38]);
    f.proietta("Cinque", [p2, 0], [p2, yS], [0.38, 0.64]);
    f.proietta("Sei", [p3, 0], [p3, yS], [0.64, 0.9]);
    f.passo();

    // Passo 8 · ripasso (PO, poi PV, poi PL)
    const r = finestre(17, 0.05, 0.94);
    vertici.forEach((p, i) => f.ripassa(`PO${"abcdef"[i]}`, p, vertici[(i + 1) % 6], r[i]));
    f.ripassa("PVa", [A[0], quota], [D[0], quota], r[6]);
    f.ripassa("PVb", [D[0], quota], [D[0], yS], r[7]);
    f.ripassa("PVc", [D[0], yS], [A[0], yS], r[8]);
    f.ripassa("PVd", [A[0], yS], [A[0], quota], r[9]);
    f.ripassa("PVe", [B[0], quota], [B[0], yS], r[10]);
    f.ripassa("PVf", [C[0], quota], [C[0], yS], r[11]);
    f.ripassa("PLa", [p1, quota], [p3, quota], r[12]);
    f.ripassa("PLb", [p3, quota], [p3, yS], r[13]);
    f.ripassa("PLc", [p3, yS], [p1, yS], r[14]);
    f.ripassa("PLd", [p1, yS], [p1, quota], r[15]);
    f.ripassa("PLe", [p2, quota], [p2, yS], r[16]);
    f.passo();
  });

  // ── Tavola 9 · Cilindro con la base sul PO ──────────────────────────────────
  TAVOLE["po-cilindro"] = creaFoglio({
    title: "Cilindro con la base sul PO",
    eyebrow: "Tavola 9 · Un solido rotondo",
    subtitle: "Cilindro appoggiato sul PO: raggio di base 3 cm, altezza 7 cm. Il centro della base dista 5 cm dal PV e 6 cm dal PL.",
    filename: "MC-DIS-2-01_po-cilindro.ggb",
    proofTitle: "Rotondo da sopra, rettangolo di fronte e di fianco",
    proofCopy: "Dall’alto il cilindro è un cerchio: la base e la faccia di sopra cadono una sull’altra. Di fronte e di fianco è un rettangolo largo quanto il diametro, 6 cm, e alto 7 cm. Se giri intorno al cilindro lo vedi sempre uguale: per questo il PV e il PL mostrano la stessa figura. L’asse a tratto-punto segna la linea attorno a cui il solido è simmetrico: insieme al cerchio del PO dice a chi legge che l’oggetto è rotondo.",
    equality: "PO: cerchio di raggio 3 cm · PV e PL: 6 × 7 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Il cilindro ha la base rotonda, di raggio 3 cm, ed è alto 7 cm. È appoggiato sul piano orizzontale (PO). Il centro della base dista 5 cm dal piano verticale (PV) e 6 cm dal piano laterale (PL). ${prepara(11, 9, 8, 9)}`, "Il cilindro non ha spigoli sui fianchi: di fronte e di fianco disegni il suo contorno."],
      ["Passo 1 · Sul PO", "Disegna gli assi e la base", "Nel PO segna il centro della base: 6 cm a sinistra dell’asse verticale e 5 cm sotto la LT. Traccia per il centro due linee sottili a tratto-punto, una orizzontale e una verticale: sono gli assi della circonferenza. Punta il compasso nel centro, aprilo di 3 cm e traccia la circonferenza.", "La linea tratto-punto alterna un tratto lungo e un punto. Gli assi sporgono dalla circonferenza di circa mezzo centimetro per parte."],
      ["Passo 2 · Verso il PV", "Sali dalla circonferenza", "Traccia due linee verticali sottili che salgono fino a circa 8 cm sopra la LT: partono dai due punti in cui la circonferenza incontra il suo asse orizzontale, a sinistra e a destra. Prolunga verso l’alto, sempre a tratto-punto, anche l’asse della circonferenza che sale verso la LT: diventerà l’asse del cilindro.", "Sono linee di proiezione. Le due esterne segnano la larghezza del cilindro: il diametro, 6 cm."],
      ["Passo 3 · Sul PV", "Disegna il prospetto", "Il prospetto è la vista di fronte. Il cilindro è appoggiato sul PO: nel PV la sua base sta sulla LT. Sulla verticale di sinistra misura 7 cm dalla LT, poi traccia una linea orizzontale fino alla verticale di destra. Con la LT ottieni un rettangolo largo 6 cm e alto 7 cm.", "Di fronte il cilindro è un rettangolo: la superficie curva non ha spigoli da disegnare."],
      ["Passo 4 · Verso il PL", "Porta altezza e profondità verso il PL", "Nel PV prolunga verso destra la linea a 7 cm di altezza, fino a circa 9 cm oltre l’asse verticale. Nel PO traccia tre linee orizzontali fino all’asse verticale: una dal punto più alto della circonferenza, una dal punto più basso e, in mezzo, il prolungamento a tratto-punto dell’asse orizzontale. Dall’alto in basso trovi i punti 1, 2 e 3.", "Tre profondità, cioè tre distanze dal PV: 2 cm, 5 cm e 8 cm."],
      ["Passo 5 · Compasso", "Porta le profondità sulla LT", `Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 4. Ripeti dal punto 2 e dal punto 3: trovi i punti 5 e 6.`, "Controlla con il righello: i punti 4, 5 e 6 stanno a 2 cm, a 5 cm e a 8 cm da O."],
      ["Passo 6 · Sul PL", "Disegna il fianco", "Dai punti 4 e 6 sali in verticale fino alla linea a 7 cm di altezza. Con la LT ottieni un rettangolo largo 6 cm e alto 7 cm. Dal punto 5 sali con la linea tratto-punto fino a poco sopra il rettangolo: è l’asse del cilindro.", "Di fianco il cilindro è uguale a come lo vedi di fronte."],
      ["Passo 7 · Ripasso", "Ripassa il contorno", "Ripassa con un tratto deciso la circonferenza nel PO e i due rettangoli nel PV e nel PL. Gli assi restano sottili, a tratto-punto: non si ripassano.", "Tre tipi di linea: tratto deciso per il contorno, tratto sottile per le linee di proiezione, tratto-punto per gli assi."],
    ],
  }, { sinistra: 11.8, destra: 9.6, alto: 8.6, basso: 9.8 }, (f) => {
    const raggio = 3, alt = 7, cx = -6, cy = -5;
    const K = [cx, cy];
    const xS = cx - raggio, xD = cx + raggio;
    const p1 = -cy - raggio, p2 = -cy, p3 = -cy + raggio;      // profondità 2 · 5 · 8
    const su = alt + 0.8;

    f.base();
    f.passo();

    // Passo 1 · assi e circonferenza di base
    f.misura("CentroX", [cx, 0], f.O, "6 cm", 0.1, "giu", [1.6, 0]);
    f.tacca("CentroX", [cx, 0], true, 0.1);
    f.misura("CentroY", [xS - 0.9, 0], [xS - 0.9, cy], "5 cm", 0.2, "sx");
    f.segno("K", K, 0.3);
    f.asse("OrizPO", [xS - 0.6, cy], [xD + 0.6, cy], [0.32, 0.46]);
    f.asse("VertPO", [cx, cy + raggio + 0.6], [cx, cy - raggio - 0.6], [0.46, 0.6]);
    f.cerchio("Base", K, raggio, [0.62, 0.94]);
    f.passo();

    // Passo 2 · verso il PV
    f.proietta("Sin", [xS, cy], [xS, su], [0.12, 0.42]);
    f.proietta("Des", [xD, cy], [xD, su], [0.42, 0.72]);
    f.asse("VertPV", [cx, cy + raggio + 0.6], [cx, su], [0.72, 0.94]);
    f.passo();

    // Passo 3 · prospetto
    f.misura("Alt", [xS, 0], [xS, alt], "7 cm", 0.12, "sx");
    f.figura("Sopra", [xS, alt], [xD, alt], [0.4, 0.94]);
    f.passo();

    // Passo 4 · verso il PL
    f.proietta("Alt", [xD, alt], [p3 + 0.9, alt], [0.12, 0.36]);
    f.proietta("ProfUno", [cx, cy + raggio], [0, cy + raggio], [0.36, 0.52]);
    f.numero(1, [0, cy + raggio], 0.53);
    f.asse("OrizPOdue", [xD + 0.6, cy], [0, cy], [0.56, 0.7]);
    f.numero(2, [0, cy], 0.71);
    f.proietta("ProfTre", [cx, cy - raggio], [0, cy - raggio], [0.74, 0.9]);
    f.numero(3, [0, cy - raggio], 0.92);
    f.passo();

    // Passo 5 · archi di riporto
    f.riporto("Uno", p1, [0.12, 0.34]);
    f.numero(4, [p1, 0], 0.35);
    f.riporto("Due", p2, [0.38, 0.62]);
    f.numero(5, [p2, 0], 0.63);
    f.riporto("Tre", p3, [0.66, 0.93]);
    f.numero(6, [p3, 0], 0.94);
    f.passo();

    // Passo 6 · fianco
    f.proietta("Quattro", [p1, 0], [p1, alt], [0.12, 0.4]);
    f.proietta("Sei", [p3, 0], [p3, alt], [0.4, 0.68]);
    f.asse("VertPL", [p2, 0], [p2, su], [0.68, 0.94]);
    f.passo();

    // Passo 7 · ripasso
    f.ripassaCerchio("PO", K, raggio, 0.1);
    const r = finestre(8, 0.16, 0.93);
    f.ripassa("PVa", [xS, 0], [xD, 0], r[0]);
    f.ripassa("PVb", [xD, 0], [xD, alt], r[1]);
    f.ripassa("PVc", [xD, alt], [xS, alt], r[2]);
    f.ripassa("PVd", [xS, alt], [xS, 0], r[3]);
    f.ripassa("PLa", [p1, 0], [p3, 0], r[4]);
    f.ripassa("PLb", [p3, 0], [p3, alt], r[5]);
    f.ripassa("PLc", [p3, alt], [p1, alt], r[6]);
    f.ripassa("PLd", [p1, alt], [p1, 0], r[7]);
    f.passo();
  });

  // ── Tavola 10 · Cono con la base sul PO ─────────────────────────────────────
  TAVOLE["po-cono"] = creaFoglio({
    title: "Cono con la base sul PO",
    eyebrow: "Tavola 10 · Un cerchio e due triangoli",
    subtitle: "Cono appoggiato sul PO: raggio di base 3,5 cm, altezza 8 cm, con il vertice sopra il centro della base. Il centro dista 5 cm dal PV e 6 cm dal PL.",
    filename: "MC-DIS-2-01_po-cono.ggb",
    proofTitle: "Il vertice cade sul centro",
    proofCopy: "Dall’alto il cono è un cerchio, e il vertice cade proprio sul centro: V′ è il centro della circonferenza. Di fronte e di fianco il cono è un triangolo con la base lunga quanto il diametro, 7 cm, e alto 8 cm. Come per il cilindro, se giri intorno al cono lo vedi sempre uguale: per questo il PV e il PL mostrano lo stesso triangolo.",
    equality: "PO: cerchio di raggio 3,5 cm · PV e PL: triangolo con base 7 cm e altezza 8 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Il cono ha la base rotonda, di raggio 3,5 cm, ed è alto 8 cm. Il vertice sta sopra il centro della base. Il cono è appoggiato sul piano orizzontale (PO); il centro della base dista 5 cm dal piano verticale (PV) e 6 cm dal piano laterale (PL). ${prepara(11, 10, 10, 10)}`, "Il vertice è la punta del cono."],
      ["Passo 1 · Sul PO", "Disegna gli assi e la base", "Nel PO segna il centro della base: 6 cm a sinistra dell’asse verticale e 5 cm sotto la LT. Traccia per il centro due linee sottili a tratto-punto (un tratto lungo, un punto, un tratto lungo), una orizzontale e una verticale: sono gli assi della circonferenza. Punta il compasso nel centro, aprilo di 3,5 cm e traccia la circonferenza. Il centro è anche V′, la proiezione del vertice sul PO.", "Dall’alto la punta del cono si vede proprio al centro della base. V′ si legge «V primo»."],
      ["Passo 2 · Verso il PV", "Sali dalla circonferenza", "Traccia due linee verticali sottili che salgono fino a poco oltre la LT: partono dai due punti in cui la circonferenza incontra il suo asse orizzontale, a sinistra e a destra. Prolunga verso l’alto, sempre a tratto-punto, anche l’asse della circonferenza che sale verso la LT, fino a circa 9 cm sopra la LT.", "Sulla linea tratto-punto che hai appena prolungato troverai il vertice: è l’asse del cono."],
      ["Passo 3 · Sul PV", "Disegna il prospetto", "Il prospetto è la vista di fronte. Il cono è appoggiato sul PO: nel PV la base sta sulla LT, tra le due verticali esterne. Sulla linea tratto-punto che sale dal centro misura 8 cm dalla LT: lì c’è V″. Unisci V″ con i due estremi della base.", "Di fronte il cono è un triangolo: la base rotonda si vede di taglio, cioè dal bordo, e diventa un segmento."],
      ["Passo 4 · Verso il PL", "Porta altezza e profondità verso il PL", "Da V″ traccia una linea orizzontale verso destra, fino a circa 6 cm oltre l’asse verticale. Nel PO traccia tre linee orizzontali fino all’asse verticale: una dal punto più alto della circonferenza, una dal punto più basso e, in mezzo, il prolungamento a tratto-punto dell’asse orizzontale. Dall’alto in basso trovi i punti 1, 2 e 3.", "Tre profondità, cioè tre distanze dal PV: 1,5 cm, 5 cm e 8,5 cm."],
      ["Passo 5 · Compasso", "Porta le profondità sulla LT", `Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 4. Ripeti dal punto 2 e dal punto 3: trovi i punti 5 e 6.`, "Controlla con il righello: i punti 4, 5 e 6 stanno a 1,5 cm, a 5 cm e a 8,5 cm da O."],
      ["Passo 6 · Sul PL", "Disegna il fianco", "La base del cono è il tratto di LT tra i punti 4 e 6. Dal punto 5 sali con la linea tratto-punto: è l’asse del cono, e incontra la linea di V″ nel punto V‴. Unisci V‴ con i punti 4 e 6. V‴ si legge «V terzo».", "Di fianco il cono è lo stesso triangolo che vedi di fronte."],
      ["Passo 7 · Ripasso", "Ripassa il contorno", "Ripassa con un tratto deciso la circonferenza nel PO e i due triangoli nel PV e nel PL. Gli assi restano sottili, a tratto-punto.", "Controlla: V′ e V″ sono sulla stessa verticale, V″ e V‴ alla stessa altezza."],
    ],
  }, { sinistra: 12.4, destra: 10, alto: 9.6, basso: 10.2 }, (f) => {
    const raggio = 3.5, alt = 8, cx = -6, cy = -5;
    const K = [cx, cy];
    const xS = cx - raggio, xD = cx + raggio;
    const p1 = -cy - raggio, p2 = -cy, p3 = -cy + raggio;      // profondità 1,5 · 5 · 8,5
    const su = alt + 0.8;

    f.base();
    f.passo();

    // Passo 1 · assi, circonferenza di base e V′
    f.misura("CentroX", [cx, 0], f.O, "6 cm", 0.1, "giu", [1.6, 0]);
    f.tacca("CentroX", [cx, 0], true, 0.1);
    f.misura("CentroY", [xS - 0.9, 0], [xS - 0.9, cy], "5 cm", 0.2, "sx");
    f.asse("OrizPO", [xS - 0.6, cy], [xD + 0.6, cy], [0.3, 0.44]);
    f.asse("VertPO", [cx, cy + raggio + 0.6], [cx, cy - raggio - 0.6], [0.44, 0.58]);
    f.cerchio("Base", K, raggio, [0.6, 0.9]);
    f.punto("Vpo", K, "V′", 0.92, [0.25, -0.2]);
    f.passo();

    // Passo 2 · verso il PV
    f.proietta("Sin", [xS, cy], [xS, 1.2], [0.12, 0.42]);
    f.proietta("Des", [xD, cy], [xD, 1.2], [0.42, 0.72]);
    f.asse("VertPV", [cx, cy + raggio + 0.6], [cx, su], [0.72, 0.94]);
    f.passo();

    // Passo 3 · prospetto
    f.misura("Alt", [xS - 1.4, 0], [xS - 1.4, alt], "8 cm", 0.12, "dx");   // a sinistra del triangolo: sull’asse sembrerebbe uno spigolo
    f.punto("Vpv", [cx, alt], "V″", 0.3);
    f.figura("BasePV", [xS, 0], [xD, 0], [0.34, 0.5]);
    f.figura("GenSinPV", [cx, alt], [xS, 0], [0.52, 0.72]);
    f.figura("GenDesPV", [cx, alt], [xD, 0], [0.72, 0.94]);
    f.passo();

    // Passo 4 · verso il PL
    f.proietta("AltV", [cx, alt], [p2 + 1.0, alt], [0.12, 0.36]);
    f.proietta("ProfUno", [cx, cy + raggio], [0, cy + raggio], [0.36, 0.52]);
    f.numero(1, [0, cy + raggio], 0.53);
    f.asse("OrizPOdue", [xD + 0.6, cy], [0, cy], [0.56, 0.7]);
    f.numero(2, [0, cy], 0.71);
    f.proietta("ProfTre", [cx, cy - raggio], [0, cy - raggio], [0.74, 0.9]);
    f.numero(3, [0, cy - raggio], 0.92);
    f.passo();

    // Passo 5 · archi di riporto
    f.riporto("Uno", p1, [0.12, 0.34]);
    f.numero(4, [p1, 0], 0.35);
    f.riporto("Due", p2, [0.38, 0.62]);
    f.numero(5, [p2, 0], 0.63);
    f.riporto("Tre", p3, [0.66, 0.93]);
    f.numero(6, [p3, 0], 0.94);
    f.passo();

    // Passo 6 · fianco
    f.figura("BasePL", [p1, 0], [p3, 0], [0.12, 0.26]);
    f.asse("VertPL", [p2, 0], [p2, su], [0.28, 0.48]);
    f.punto("Vpl", [p2, alt], "V‴", 0.5);
    f.figura("GenSinPL", [p2, alt], [p1, 0], [0.54, 0.74]);
    f.figura("GenDesPL", [p2, alt], [p3, 0], [0.74, 0.94]);
    f.passo();

    // Passo 7 · ripasso
    f.ripassaCerchio("PO", K, raggio, 0.1);
    const r = finestre(6, 0.16, 0.93);
    f.ripassa("PVa", [xS, 0], [xD, 0], r[0]);
    f.ripassa("PVb", [xD, 0], [cx, alt], r[1]);
    f.ripassa("PVc", [cx, alt], [xS, 0], r[2]);
    f.ripassa("PLa", [p1, 0], [p3, 0], r[3]);
    f.ripassa("PLb", [p3, 0], [p2, alt], r[4]);
    f.ripassa("PLc", [p2, alt], [p1, 0], r[5]);
    f.passo();
  });

  // ── Tavola 11 · Prisma triangolare con la base parallela al PV ──────────────
  TAVOLE["po-prisma-base-pv"] = creaFoglio({
    title: "Prisma triangolare con la base parallela al PV",
    eyebrow: "Tavola 11 · Lo stesso prisma, coricato",
    subtitle: "Prisma triangolare coricato: basi a triangolo equilatero di lato 6 cm, parallele al PV; lunghezza 8 cm. È appoggiato sul PO con una faccia, comincia a 1 cm dal PV e dista 3 cm dal PL.",
    filename: "MC-DIS-2-01_po-prisma-base-pv.ggb",
    proofTitle: "Cambia la posizione, cambia la vista da cui partire",
    proofCopy: "Quando il prisma è coricato, le basi a triangolo sono parallele al PV: è lì che si vedono intere, ed è da lì che si parte. Dall’alto vedi un rettangolo largo 6 cm e lungo 8 cm, con lo spigolo più alto nel mezzo. Di fianco vedi un rettangolo lungo 8 cm e alto quanto il triangolo, circa 5,2 cm. È lo stesso prisma della tavola 6: ha cambiato posizione, e con la posizione sono cambiate le viste.",
    equality: "PV: triangolo di lato 6 cm · PO: 6 × 8 cm · PL: 8 × circa 5,2 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Il prisma è coricato: le sue due basi, triangoli equilateri di lato 6 cm, sono parallele al piano verticale (PV). Il prisma è lungo 8 cm ed è appoggiato con una faccia sul piano orizzontale (PO). La base più vicina al PV dista 1 cm, l’altra 9 cm. Il prisma dista 3 cm dal piano laterale (PL). ${prepara(10, 11, 7, 10)}`, "Questa volta la base si vede intera di fronte: parti dal PV."],
      ["Passo 1 · Sul PV", "Disegna il lato sulla LT", "Il prisma è appoggiato sul PO: nel PV un lato del triangolo sta sulla LT. Segna sulla LT il punto C″, 3 cm a sinistra di O, e il punto B″, 6 cm più a sinistra di C″.", "B″ si legge «B secondo»: è la proiezione di B sul PV."],
      ["Passo 2 · Compasso", "Completa il triangolo", "Apri il compasso di 6 cm. Punta in B″ e traccia un archetto sopra la LT. Fai lo stesso da C″. I due archetti si incrociano in A″. Unisci A″ con B″ e con C″.", "È la costruzione del triangolo equilatero che hai imparato in prima."],
      ["Passo 3 · Verso il PO", "Scendi dai tre vertici", "Da B″, da A″ e da C″ traccia tre linee verticali sottili che scendono fino a circa 10 cm sotto la LT.", "Sono le linee di proiezione: portano le larghezze dal PV al PO."],
      ["Passo 4 · Sul PO", "Disegna la pianta", "La pianta è la vista dall’alto. Il prisma comincia a 1 cm dal PV ed è lungo 8 cm: finisce a 9 cm. Nel PO traccia due linee orizzontali tra le verticali esterne, a 1 cm e a 9 cm sotto la LT. Hai un rettangolo largo 6 cm e lungo 8 cm. La verticale di mezzo è lo spigolo più alto del prisma, quello che passa per A.", "Dall’alto vedi le due facce inclinate, divise dallo spigolo più alto."],
      ["Passo 5 · Verso il PL", "Porta altezza e profondità verso il PL", "Da A″ traccia una linea orizzontale verso destra, fino a circa 10 cm oltre l’asse verticale. Nel PO prolunga fino all’asse verticale i due lati orizzontali del rettangolo: trovi il punto 1 sul lato in alto e il punto 2 sul lato in basso.", "Le profondità sono le distanze dal PV: qui 1 cm e 9 cm."],
      ["Passo 6 · Compasso", "Porta le profondità sulla LT", `Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 3. Poi aprilo fino al punto 2 e traccia un altro quarto di giro: trovi il punto 4.`, "Controlla con il righello: il punto 3 sta a 1 cm da O, il punto 4 a 9 cm."],
      ["Passo 7 · Sul PL", "Disegna il fianco", "Dai punti 3 e 4 sali in verticale fino alla linea di A″. Con la LT ottieni un rettangolo lungo 8 cm e alto circa 5,2 cm: è il prisma visto di fianco.", "La faccia inclinata è larga 6 cm, ma di fianco ne vedi solo l’altezza: circa 5,2 cm."],
      ["Passo 8 · Ripasso", "Ripassa gli spigoli", "Ripassa con un tratto deciso il triangolo nel PV, il rettangolo con lo spigolo di mezzo nel PO e il rettangolo nel PL. Lo spigolo di mezzo nel PO è in vista: tratto continuo.", "Qui non c’è niente da tratteggiare: gli spigoli nascosti cadono su quelli in vista. Nella tavola 6 lo spigolo di mezzo era nascosto; qui sta in cima, e dall’alto si vede."],
    ],
  }, { sinistra: 12, destra: 10.6, alto: 6.8, basso: 10.4 }, (f) => {
    const lato = 6, lung = 8, dPV = 1, dPL = 3;
    const hTri = (lato * Math.sqrt(3)) / 2;                    // ≈ 5,196
    const Cv = [-dPL, 0], Bv = [-dPL - lato, 0], Av = [-dPL - lato / 2, hTri];
    const yA = -dPV, yB = -dPV - lung;                         // lati del rettangolo nel PO: −1 e −9
    const p1 = dPV, p2 = dPV + lung;                           // profondità 1 e 9
    const giu = yB - 0.8;

    f.base();
    f.passo();

    // Passo 1 · lato B″C″ sulla LT
    f.misura("DallAsse", Cv, f.O, "3 cm", 0.12, "giu");
    f.punto("Cpv", Cv, "C″", 0.3, [0.15, 0.85]);   // sopra la LT: è una proiezione sul PV
    f.figura("BC", Cv, Bv, [0.4, 0.86]);
    f.scritta("LatoBC", "6 cm", [Av[0] - 2.2, 0.25], BLU, 0.86);
    f.punto("Bpv", Bv, "B″", 0.9, [-1.05, 0.85]);
    f.passo();

    // Passo 2 · triangolo equilatero
    f.archetto("B", Bv, Av, 13, [0.12, 0.38]);
    f.archetto("C", Cv, Av, 13, [0.38, 0.62]);
    f.punto("Apv", Av, "A″", 0.64, [-0.35, 1.25]);
    f.figura("AB", Av, Bv, [0.66, 0.8]);
    f.figura("AC", Av, Cv, [0.8, 0.94]);
    f.passo();

    // Passo 3 · linee di proiezione verso il PO
    const [w1, w2, w3] = finestre(3);
    f.proietta("B", Bv, [Bv[0], giu], w1);
    f.proietta("A", Av, [Av[0], giu], w2);
    f.proietta("C", Cv, [Cv[0], giu], w3);
    f.passo();

    // Passo 4 · pianta
    f.misura("Inizio", [Bv[0] - 0.9, 0], [Bv[0] - 0.9, yA], "1 cm", 0.1, "sx");
    f.figura("POalto", [Bv[0], yA], [Cv[0], yA], [0.2, 0.42]);
    f.misura("Lung", [Bv[0], yA], [Bv[0], yB], "8 cm", 0.46, "sx");
    f.figura("PObasso", [Bv[0], yB], [Cv[0], yB], [0.6, 0.94]);
    f.passo();

    // Passo 5 · verso il PL
    f.proietta("AltA", Av, [p2 + 1.0, hTri], [0.12, 0.45]);
    f.proietta("ProfUno", [Cv[0], yA], [0, yA], [0.45, 0.68]);
    f.numero(1, [0, yA], 0.7);
    f.proietta("ProfDue", [Cv[0], yB], [0, yB], [0.7, 0.92]);
    f.numero(2, [0, yB], 0.94);
    f.passo();

    // Passo 6 · archi di riporto
    f.riporto("Uno", p1, [0.12, 0.3]);
    f.numero(3, [p1, 0], 0.32);
    f.riporto("Due", p2, [0.38, 0.92]);
    f.numero(4, [p2, 0], 0.94);
    f.passo();

    // Passo 7 · fianco
    f.proietta("Tre", [p1, 0], [p1, hTri], [0.12, 0.5]);
    f.proietta("Quattro", [p2, 0], [p2, hTri], [0.5, 0.92]);
    f.passo();

    // Passo 8 · ripasso (PV, poi PO, poi PL)
    const r = finestre(12, 0.06, 0.93);
    f.ripassa("PVa", Bv, Cv, r[0]);
    f.ripassa("PVb", Cv, Av, r[1]);
    f.ripassa("PVc", Av, Bv, r[2]);
    f.ripassa("POa", [Bv[0], yA], [Cv[0], yA], r[3]);
    f.ripassa("POb", [Cv[0], yA], [Cv[0], yB], r[4]);
    f.ripassa("POc", [Cv[0], yB], [Bv[0], yB], r[5]);
    f.ripassa("POd", [Bv[0], yB], [Bv[0], yA], r[6]);
    f.ripassa("POe", [Av[0], yA], [Av[0], yB], r[7]);
    f.ripassa("PLa", [p1, 0], [p2, 0], r[8]);
    f.ripassa("PLb", [p2, 0], [p2, hTri], r[9]);
    f.ripassa("PLc", [p2, hTri], [p1, hTri], r[10]);
    f.ripassa("PLd", [p1, hTri], [p1, 0], r[11]);
    f.passo();
  });

  // ── Tavola 12 · Blocco a L ───────────────────────────────────────────────────
  TAVOLE["po-blocco-a-l"] = creaFoglio({
    title: "Blocco a L",
    eyebrow: "Tavola 12 · Che cosa si vede e che cosa no",
    subtitle: "Blocco a forma di L appoggiato sul PO: largo 8 cm, alto 6 cm, profondo 4 cm, con i due bracci spessi 2 cm. Il braccio alto è a sinistra. Dista 1 cm dal PV e 2 cm dal PL.",
    filename: "MC-DIS-2-01_po-blocco-a-l.ggb",
    proofTitle: "Una vista sola non basta",
    proofCopy: "Ogni vista dice una cosa diversa del blocco. Di fronte vedi la sua forma, la L. Dall’alto vedi due facce a due altezze diverse, separate da uno spigolo in vista. Di fianco, da sinistra, hai davanti il braccio alto, che copre tutto il resto: la faccia sopra il braccio basso c’è, ma è nascosta: la linea che la rappresenta va tratteggiata. Chi legge un disegno tecnico capisce il pezzo solo mettendo insieme più viste: una sola non basta.",
    equality: "PV: L di 8 × 6 cm · PO: 8 × 4 cm · PL: 4 × 6 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Il blocco ha la forma di una L. È largo 8 cm, alto 6 cm e profondo 4 cm; i suoi due bracci sono spessi 2 cm. È appoggiato sul piano orizzontale (PO), con il braccio alto a sinistra. Dista 1 cm dal piano verticale (PV) e 2 cm dal piano laterale (PL). ${prepara(11, 7, 7, 6)}`, "Regola pratica: comincia dalla vista che mostra la forma del pezzo. Qui è il PV."],
      ["Passo 1 · Sul PV", "Disegna la L", "Il blocco è appoggiato sul PO: nel PV la sua base sta sulla LT. Parti dal punto della LT che sta 2 cm a sinistra di O. Disegna il contorno un tratto alla volta: 8 cm verso sinistra lungo la LT, 6 cm in su, 2 cm verso destra, 4 cm in giù, 6 cm verso destra, 2 cm in giù. Sei tornato al punto di partenza.", "Di fronte vedi la L intera: è la faccia davanti del blocco."],
      ["Passo 2 · Verso il PO", "Scendi dai lati verticali", "Traccia tre linee verticali sottili che scendono fino a circa 6 cm sotto la LT: una continua il lato sinistro della L, una continua il lato destro del braccio alto, una continua il lato destro del braccio basso.", "Sono le linee di proiezione: tre verticali a 10 cm, a 8 cm e a 2 cm dall’asse verticale."],
      ["Passo 3 · Sul PO", "Disegna la pianta", "La pianta è la vista dall’alto. Il blocco dista 1 cm dal PV ed è profondo 4 cm: nel PO traccia due linee orizzontali tra le verticali esterne, a 1 cm e a 5 cm sotto la LT. Hai un rettangolo largo 8 cm e profondo 4 cm. La verticale interna lo divide in due: a sinistra la faccia in cima al braccio alto, a destra la faccia sopra il braccio basso.", "Le due facce sono a due altezze diverse, 6 cm e 2 cm: dall’alto le separa uno spigolo in vista."],
      ["Passo 4 · Verso il PL", "Porta le altezze e le distanze dal PV verso il PL", "Nel PV traccia due linee orizzontali verso destra, fino a circa 6 cm oltre l’asse verticale. La prima parte dalla cima del braccio alto, a 6 cm di altezza. La seconda parte dalla faccia sopra il braccio basso, a 2 cm di altezza. Nel PO prolunga fino all’asse verticale i due lati orizzontali del rettangolo: trovi il punto 1 sul lato in alto e il punto 2 sul lato in basso.", "Due altezze: 2 cm e 6 cm. Due distanze dal PV: 1 cm per la faccia dietro, 5 cm per la faccia davanti. La differenza, 4 cm, è la profondità del blocco."],
      ["Passo 5 · Compasso", "Porta le distanze dal PV sulla LT", `Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 3. Poi aprilo fino al punto 2 e traccia un altro quarto di giro: trovi il punto 4.`, "Controlla con il righello: il punto 3 sta a 1 cm da O, il punto 4 a 5 cm."],
      ["Passo 6 · Sul PL", "Disegna il fianco", "Dai punti 3 e 4 sali in verticale fino alla linea a 6 cm di altezza. Con la LT ottieni un rettangolo largo 4 cm e alto 6 cm. Dentro il rettangolo passa la linea a 2 cm di altezza: è la faccia sopra il braccio basso, vista di taglio, cioè dal bordo.", "Chi guarda da sinistra ha davanti il braccio alto, che copre tutto il resto."],
      ["Passo 7 · Ripasso", "Ripassa gli spigoli", "Ripassa con un tratto deciso la L nel PV e il rettangolo con lo spigolo interno nel PO. Nel PL ripassa il rettangolo; la linea a 2 cm di altezza sta dietro il braccio alto: disegnala tratteggiata, cioè a trattini.", "Per decidere se uno spigolo è nascosto chiediti: da dove guardo? Che cosa ho davanti?"],
    ],
  }, { sinistra: 13.2, destra: 7.2, alto: 7.4, basso: 6.8 }, (f) => {
    const larg = 8, alt = 6, prof = 4, sp = 2, dPV = 1, dPL = 2;
    const xD = -dPL, xS = -dPL - larg, xI = xS + sp;           // lato destro, lato sinistro, lato interno del braccio alto
    const yA = -dPV, yB = -dPV - prof;                         // lati del rettangolo nel PO
    const p1 = dPV, p2 = dPV + prof;                           // profondità 2 e 6
    const contorno = [[xD, 0], [xS, 0], [xS, alt], [xI, alt], [xI, sp], [xD, sp]];   // la L, dal punto di partenza
    const giu = yB - 0.8;

    f.base();
    f.passo();

    // Passo 1 · la L nel PV
    f.misura("DallAsse", [xD, 0], f.O, "2 cm", 0.08, "giu");
    const c = finestre(6, 0.14, 0.86);
    contorno.forEach((p, i) => f.figura(`L${"abcdef"[i]}`, p, contorno[(i + 1) % 6], c[i]));
    f.scritta("Largo", "8 cm", [(xS + xD) / 2 - 0.7, 0.25], BLU, 0.9);
    f.scritta("Alto", "6 cm", [xS - 1.7, alt / 2 - 0.25], BLU, 0.9);
    f.scritta("SpSu", "2 cm", [xS + 0.3, alt + 0.25], BLU, 0.9);
    f.scritta("SpDes", "2 cm", [xD - 1.6, sp / 2 - 0.3], BLU, 0.9);   // dentro il braccio basso
    f.passo();

    // Passo 2 · tre linee di proiezione verso il PO
    const [w1, w2, w3] = finestre(3);
    f.proietta("Sin", [xS, 0], [xS, giu], w1);
    f.proietta("Int", [xI, sp], [xI, giu], w2);
    f.proietta("Des", [xD, 0], [xD, giu], w3);
    f.passo();

    // Passo 3 · pianta
    f.misura("DalPV", [xS - 0.9, 0], [xS - 0.9, yA], "1 cm", 0.1, "sx");
    f.figura("POalto", [xS, yA], [xD, yA], [0.2, 0.42]);
    f.misura("Prof", [xS, yA], [xS, yB], "4 cm", 0.46, "sx");
    f.figura("PObasso", [xS, yB], [xD, yB], [0.6, 0.94]);
    f.passo();

    // Passo 4 · verso il PL
    f.proietta("AltSu", [xI, alt], [p2 + 1.0, alt], [0.12, 0.32]);
    f.proietta("AltGiu", [xD, sp], [p2 + 1.0, sp], [0.32, 0.5]);
    f.proietta("ProfUno", [xD, yA], [0, yA], [0.5, 0.68]);
    f.numero(1, [0, yA], 0.7);
    f.proietta("ProfDue", [xD, yB], [0, yB], [0.72, 0.9]);
    f.numero(2, [0, yB], 0.92);
    f.passo();

    // Passo 5 · archi di riporto
    f.riporto("Uno", p1, [0.12, 0.42]);
    f.numero(3, [p1, 0], 0.44);
    f.riporto("Due", p2, [0.48, 0.92]);
    f.numero(4, [p2, 0], 0.94);
    f.passo();

    // Passo 6 · fianco
    f.proietta("Tre", [p1, 0], [p1, alt], [0.12, 0.5]);
    f.proietta("Quattro", [p2, 0], [p2, alt], [0.5, 0.92]);
    f.passo();

    // Passo 7 · ripasso (PV, poi PO, poi PL)
    const r = finestre(16, 0.05, 0.94);
    contorno.forEach((p, i) => f.ripassa(`PV${"abcdef"[i]}`, p, contorno[(i + 1) % 6], r[i]));
    f.ripassa("POa", [xS, yA], [xD, yA], r[6]);
    f.ripassa("POb", [xD, yA], [xD, yB], r[7]);
    f.ripassa("POc", [xD, yB], [xS, yB], r[8]);
    f.ripassa("POd", [xS, yB], [xS, yA], r[9]);
    f.ripassa("POe", [xI, yA], [xI, yB], r[10]);
    f.ripassa("PLa", [p1, 0], [p2, 0], r[11]);
    f.ripassa("PLb", [p2, 0], [p2, alt], r[12]);
    f.ripassa("PLc", [p2, alt], [p1, alt], r[13]);
    f.ripassa("PLd", [p1, alt], [p1, 0], r[14]);
    f.nascosto("PLn", [p1, sp], [p2, sp], r[15]);
    f.passo();
  });

  // ════════════════════ Tavole 13–17: solidi sovrapposti e sezioni ════════════════════
  const SQUADRA = "Appoggia la squadra da 30° e 60° sul righello tenuto lungo la LT";
  const N_SEZ = [-Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)];   // perpendicolare a una traccia inclinata di 30°, verso l'alto a sinistra
  const T_SEZ = [Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)];    // direzione della traccia
  const piu = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
  const ellisseVertici = (fx, fy, n = 48) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return [fx(t), fy(t)]; });
  const fmt = (v) => Number(v.toFixed(4));

  // ── Tavola 13 · Cilindro su un parallelepipedo ──────────────────────────────
  TAVOLE["po-cilindro-su-parallelepipedo"] = creaFoglio({
    title: "Cilindro su un parallelepipedo",
    eyebrow: "Tavola 13 · Due solidi, uno sopra l’altro",
    subtitle: "Parallelepipedo largo 8 cm, profondo 5 cm, alto 3 cm, appoggiato sul PO a 2 cm dal PV e a 2 cm dal PL. Sopra, al centro, un cilindro di raggio 2,5 cm alto 5 cm.",
    filename: "MC-DIS-2-01_po-cilindro-su-parallelepipedo.ggb",
    proofTitle: "Due solidi, le stesse regole",
    proofCopy: "Due solidi sovrapposti si proiettano come due solidi separati: stessi piani, stesse linee di proiezione, uno alla volta. Il secondo comincia dove finisce il primo: nel PV e nel PL il cilindro parte a 3 cm dalla LT, sulla faccia di sopra del parallelepipedo. La linea dove i due solidi si toccano si disegna, perché sono due pezzi distinti. Qui il diametro del cilindro, 5 cm, è uguale alla profondità del parallelepipedo: per questo nel PL i lati del cilindro continuano quelli del parallelepipedo.",
    equality: "PO: rettangolo 8 × 5 cm e cerchio di raggio 2,5 cm · PV: 8 × 3 cm e, sopra, 5 × 5 cm · PL: 5 × 8 cm con una linea a 3 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Qui i solidi sono due. Sotto c’è un parallelepipedo largo 8 cm, profondo 5 cm e alto 3 cm, appoggiato sul piano orizzontale (PO), a 2 cm dal piano verticale (PV) e a 2 cm dal piano laterale (PL). Sopra, al centro della sua faccia di sopra, c’è un cilindro di raggio 2,5 cm alto 5 cm. ${prepara(11, 9, 10, 8)}`, "Disegni un solido alla volta, sugli stessi piani: prima il parallelepipedo, poi il cilindro."],
      ["Passo 1 · Sul PO", "Disegna la base del parallelepipedo", "Nel PO traccia una linea sottile parallela alla LT, 2 cm più in basso. Su questa linea segna due punti a sinistra dell’asse verticale: uno a 2 cm, uno a 10 cm (2 + 8 = 10). Completa il rettangolo: dai due punti scendi di 5 cm e unisci i due punti che trovi.", "Dall’alto il parallelepipedo è un rettangolo largo 8 cm e profondo 5 cm."],
      ["Passo 2 · Sul PO", "Aggiungi il cilindro", "Il centro del cilindro è il centro del rettangolo: 6 cm a sinistra dell’asse verticale e 4,5 cm sotto la LT. Traccia per il centro i due assi, sottili a tratto-punto. Punta il compasso nel centro, aprilo di 2,5 cm e traccia la circonferenza.", "Controlla: la circonferenza tocca i due lati lunghi del rettangolo, perché il diametro, 5 cm, è uguale alla profondità."],
      ["Passo 3 · Verso il PV", "Sali con le linee di proiezione", "Dai due lati corti del rettangolo sali con due linee sottili fino a circa 4 cm sopra la LT. Dai due punti in cui la circonferenza incontra il suo asse orizzontale sali con altre due linee, fino a circa 9 cm sopra la LT.", "Le linee esterne servono al parallelepipedo, quelle interne al cilindro: tra queste ci sono 5 cm, il diametro."],
      ["Passo 4 · Sul PV", "Disegna il parallelepipedo di fronte", "Il parallelepipedo è appoggiato sul PO: nel PV la sua base sta sulla LT. Misura 3 cm dalla LT sulle due linee esterne e uniscile: hai un rettangolo largo 8 cm e alto 3 cm.", "È la vista di fronte del primo solido."],
      ["Passo 5 · Sul PV", "Disegna il cilindro di fronte", "Il cilindro comincia sulla faccia di sopra del parallelepipedo, a 3 cm dalla LT, ed è alto 5 cm: finisce a 8 cm dalla LT. Traccia la linea a 8 cm tra le due linee interne. Nel mezzo traccia l’asse del cilindro, a tratto-punto, che sporge di poco sopra e sotto.", "Di fronte il cilindro è un rettangolo largo 5 cm e alto 5 cm, appoggiato sul primo."],
      ["Passo 6 · Verso il PL", "Porta le altezze e le distanze dal PV verso il PL", "Nel PV prolunga verso destra la linea a 3 cm e la linea a 8 cm, fino a circa 8 cm oltre l’asse verticale. Nel PO traccia tre linee orizzontali fino all’asse verticale: il lato in alto del rettangolo, il prolungamento a tratto-punto dell’asse orizzontale del cerchio, il lato in basso. Trovi i punti 1, 2 e 3.", "Il cerchio tocca i lati del rettangolo: le sue distanze dal PV, 2 cm e 7 cm, sono le stesse del parallelepipedo."],
      ["Passo 7 · Compasso", "Porta le distanze dal PV sulla LT", `Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 4. Ripeti dal punto 2 e dal punto 3: trovi i punti 5 e 6.`, "Controlla con il righello: i punti 4, 5 e 6 stanno a 2 cm, a 4,5 cm e a 7 cm da O."],
      ["Passo 8 · Sul PL", "Disegna i due solidi di fianco", "Dai punti 4 e 6 sali in verticale fino alla linea a 8 cm. Ottieni un rettangolo largo 5 cm e alto 8 cm. La linea a 3 cm lo divide: sotto c’è il parallelepipedo, sopra il cilindro. Dal punto 5 traccia l’asse del cilindro, a tratto-punto.", "Di fianco i lati del cilindro continuano quelli del parallelepipedo: il diametro è uguale alla profondità."],
      ["Passo 9 · Ripasso", "Ripassa gli spigoli e i contorni", "Ripassa con un tratto deciso il rettangolo e la circonferenza nel PO, i due rettangoli nel PV, il rettangolo e la linea a 3 cm nel PL. Gli assi restano sottili, a tratto-punto.", "Controlla nel PV: il cilindro rientra di 1,5 cm per parte rispetto al parallelepipedo."],
    ],
  }, { sinistra: 11.8, destra: 8.8, alto: 9.6, basso: 8.2 }, (f) => {
    const larg = 8, prof = 5, hB = 3, r = 2.5, hC = 5, dPV = 2, dPL = 2;
    const xS = -dPL - larg, xD = -dPL, yA = -dPV, yB = -dPV - prof;
    const cx = (xS + xD) / 2, cy = (yA + yB) / 2, cS = cx - r, cD = cx + r, top = hB + hC;
    const p1 = dPV, p2 = -cy, p3 = dPV + prof;

    f.base();
    f.passo();

    // Passo 1 · rettangolo nel PO
    f.misura("DalPV", [xS - 0.9, 0], [xS - 0.9, yA], "2 cm", 0.08, "sx");
    f.proietta("Linea", [0, yA], [xS - 0.5, yA], [0.12, 0.3]);
    f.misura("DalPL", [xD, yA - 0.6], [0, yA - 0.6], "2 cm", 0.32, "giu", [0, 0.1]);
    const v = [[xD, yA], [xS, yA], [xS, yB], [xD, yB]];
    const w = finestre(4, 0.42, 0.9);
    v.forEach((p, i) => f.figura(`PO${"abcd"[i]}`, p, v[(i + 1) % 4], w[i]));
    f.scritta("Largo", "8 cm", [xD - 1.6, yB - 0.8], BLU, 0.9);   // a destra: a sinistra, sul foglio tecnico, c’è il nome del piano
    f.scritta("Prof", "5 cm", [xS - 1.6, cy - 0.25], BLU, 0.9);
    f.passo();

    // Passo 2 · cilindro nel PO
    f.asse("OrizPO", [cS - 0.6, cy], [cD + 0.6, cy], [0.1, 0.3]);
    f.asse("VertPO", [cx, yA + 0.6], [cx, yB - 0.6], [0.3, 0.5]);
    f.cerchio("Cil", [cx, cy], r, [0.55, 0.92]);
    f.passo();

    // Passo 3 · verso il PV
    const [a1, a2, a3, a4] = finestre(4);
    f.proietta("BS", [xS, yA], [xS, hB + 0.8], a1);
    f.proietta("BD", [xD, yA], [xD, hB + 0.8], a2);
    f.proietta("CS", [cS, cy], [cS, top + 0.9], a3);
    f.proietta("CD", [cD, cy], [cD, top + 0.9], a4);
    f.passo();

    // Passo 4 · parallelepipedo nel PV
    f.misura("AltB", [xS - 0.9, 0], [xS - 0.9, hB], "3 cm", 0.1, "sx");
    f.figura("PVbase", [xS, hB], [xD, hB], [0.4, 0.92]);
    f.passo();

    // Passo 5 · cilindro nel PV
    f.misura("AltC", [cD + 0.9, hB], [cD + 0.9, top], "5 cm", 0.1, "dx");
    f.figura("PVcil", [cS, top], [cD, top], [0.35, 0.65]);
    f.asse("PV", [cx, hB - 0.6], [cx, top + 0.6], [0.7, 0.94]);
    f.passo();

    // Passo 6 · verso il PL
    f.proietta("AltB", [xD, hB], [p3 + 1, hB], [0.1, 0.3]);
    f.proietta("AltC", [cD, top], [p3 + 1, top], [0.3, 0.5]);
    f.proietta("Prof1", [xD, yA], [0, yA], [0.5, 0.62]);
    f.numero(1, [0, yA], 0.63);
    f.asse("OrizPO2", [cD + 0.6, cy], [0, cy], [0.66, 0.76]);
    f.numero(2, [0, cy], 0.77);
    f.proietta("Prof3", [xD, yB], [0, yB], [0.8, 0.9]);
    f.numero(3, [0, yB], 0.92);
    f.passo();

    // Passo 7 · archi di riporto
    f.riporto("Uno", p1, [0.1, 0.32]);
    f.numero(4, [p1, 0], 0.33);
    f.riporto("Due", p2, [0.38, 0.62]);
    f.numero(5, [p2, 0], 0.63);
    f.riporto("Tre", p3, [0.66, 0.92]);
    f.numero(6, [p3, 0], 0.93);
    f.passo();

    // Passo 8 · PL
    f.proietta("Quattro", [p1, 0], [p1, top], [0.1, 0.4]);
    f.proietta("Sei", [p3, 0], [p3, top], [0.4, 0.7]);
    f.asse("PL", [p2, hB - 0.6], [p2, top + 0.6], [0.72, 0.94]);
    f.passo();

    // Passo 9 · ripasso
    const r9 = finestre(13, 0.05, 0.94);
    v.forEach((p, i) => f.ripassa(`PO${"abcd"[i]}`, p, v[(i + 1) % 4], r9[i]));
    f.ripassaCerchio("POcil", [cx, cy], r, 0.34);
    f.ripassa("PVa", [xS, 0], [xD, 0], r9[4]);
    f.ripassa("PVb", [xD, 0], [xD, hB], r9[5]);
    f.ripassa("PVc", [xD, hB], [xS, hB], r9[5]);
    f.ripassa("PVd", [xS, hB], [xS, 0], r9[6]);
    f.ripassa("PVe", [cS, hB], [cS, top], r9[7]);
    f.ripassa("PVf", [cS, top], [cD, top], r9[7]);
    f.ripassa("PVg", [cD, top], [cD, hB], r9[8]);
    f.ripassa("PLa", [p1, 0], [p3, 0], r9[9]);
    f.ripassa("PLb", [p3, 0], [p3, top], r9[10]);
    f.ripassa("PLc", [p3, top], [p1, top], r9[11]);
    f.ripassa("PLd", [p1, top], [p1, 0], r9[11]);
    f.ripassa("PLe", [p1, hB], [p3, hB], r9[12]);
    f.passo();
  });

  // ── Tavola 14 · Prisma triangolare su un parallelepipedo ────────────────────
  TAVOLE["po-prisma-su-parallelepipedo"] = creaFoglio({
    title: "Prisma triangolare su un parallelepipedo",
    eyebrow: "Tavola 14 · Una casetta fatta di due prismi",
    subtitle: "Parallelepipedo largo 6 cm, profondo 8 cm, alto 4 cm, appoggiato sul PO a 1 cm dal PV e a 2 cm dal PL. Sopra, un prisma triangolare lungo 8 cm: il triangolo ha la base di 6 cm e l’altezza di 3 cm ed è parallelo al PV.",
    filename: "MC-DIS-2-01_po-prisma-su-parallelepipedo.ggb",
    proofTitle: "Parti dalla vista che mostra la forma",
    proofCopy: "La forma della casetta si vede di fronte: un rettangolo con sopra un triangolo. Per questo si parte dal PV, come nella tavola 11. Dall’alto vedi le due falde del tetto, divise dal colmo; di fianco vedi una falda sola, sopra il fianco del parallelepipedo. La falda di fianco sembra alta 3 cm, ma è inclinata: dalla gronda al colmo misura circa 4,2 cm.",
    equality: "PV: 6 × 4 cm con sopra un triangolo alto 3 cm · PO: 6 × 8 cm con il colmo · PL: 8 × 7 cm con una linea a 4 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Due prismi, uno sopra l’altro. Sotto c’è un parallelepipedo largo 6 cm, profondo 8 cm e alto 4 cm, appoggiato sul piano orizzontale (PO), a 1 cm dal piano verticale (PV) e a 2 cm dal piano laterale (PL). Sopra c’è un prisma triangolare lungo 8 cm, come un tetto: il suo triangolo, parallelo al PV, ha la base di 6 cm e l’altezza di 3 cm. ${prepara(10, 10, 8, 10)}`, "La forma della casetta si vede di fronte: parti dal PV."],
      ["Passo 1 · Sul PV", "Disegna il parallelepipedo di fronte", "Il parallelepipedo è appoggiato sul PO: nel PV la sua base sta sulla LT. Parti dal punto della LT che sta 2 cm a sinistra di O. Disegna un rettangolo largo 6 cm verso sinistra e alto 4 cm.", "È la faccia davanti del primo solido."],
      ["Passo 2 · Sul PV", "Aggiungi il triangolo del tetto", "Segna il punto di mezzo del lato di sopra, a 3 cm dai due estremi. Da lì sali di 3 cm: è il colmo del tetto. Uniscilo con i due estremi del lato di sopra.", "Il triangolo è parallelo al PV: di fronte si vede con la sua forma vera."],
      ["Passo 3 · Verso il PO", "Scendi con le linee di proiezione", "Dai due lati verticali del rettangolo e dal colmo scendi con tre linee sottili fino a circa 10 cm sotto la LT.", "La linea di mezzo porterà nel PO il colmo del tetto."],
      ["Passo 4 · Sul PO", "Disegna la pianta", "La casetta comincia a 1 cm dal PV ed è profonda 8 cm: nel PO traccia due linee orizzontali tra le verticali esterne, a 1 cm e a 9 cm sotto la LT. Hai un rettangolo largo 6 cm e profondo 8 cm. La verticale di mezzo è il colmo: dall’alto si vede.", "Dall’alto vedi le due falde del tetto, cioè le sue due facce inclinate, divise dal colmo, lo spigolo più alto. Non vedi il parallelepipedo: il tetto lo copre tutto."],
      ["Passo 5 · Verso il PL", "Porta le altezze e le distanze dal PV verso il PL", "Nel PV traccia verso destra due linee orizzontali, fino a circa 10 cm oltre l’asse verticale: una a 4 cm, dal lato di sopra del rettangolo, e una a 7 cm, dal colmo. Nel PO prolunga fino all’asse verticale i due lati orizzontali del rettangolo: trovi il punto 1 sul lato in alto e il punto 2 sul lato in basso.", "Due altezze, 4 cm e 7 cm, e due distanze dal PV, 1 cm e 9 cm."],
      ["Passo 6 · Compasso", "Porta le distanze dal PV sulla LT", `Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 3. Poi aprilo fino al punto 2: trovi il punto 4.`, "Controlla con il righello: il punto 3 sta a 1 cm da O, il punto 4 a 9 cm."],
      ["Passo 7 · Sul PL", "Disegna la casetta di fianco", "Dai punti 3 e 4 sali in verticale fino alla linea a 7 cm. Ottieni un rettangolo largo 8 cm e alto 7 cm. La linea a 4 cm lo divide: sotto c’è il fianco del parallelepipedo, sopra una falda del tetto.", "Controlla: la falda va dalla linea a 4 cm alla linea a 7 cm. Nel PV è il lato obliquo del triangolo."],
      ["Passo 8 · Ripasso", "Ripassa gli spigoli", "Ripassa con un tratto deciso il rettangolo e il triangolo nel PV, il rettangolo con il colmo nel PO, il rettangolo e la linea a 4 cm nel PL.", "Nel PV la linea a 4 cm separa i due solidi: si ripassa anche lì."],
    ],
  }, { sinistra: 11.2, destra: 10.6, alto: 8, basso: 10.4 }, (f) => {
    const larg = 6, prof = 8, hB = 4, ht = 3, dPV = 1, dPL = 2;
    const xS = -dPL - larg, xD = -dPL, xm = (xS + xD) / 2, top = hB + ht;
    const yA = -dPV, yB = -dPV - prof, p1 = dPV, p2 = dPV + prof, giu = yB - 0.8;

    f.base();
    f.passo();

    // Passo 1 · rettangolo nel PV
    f.misura("DallAsse", [xD, 0], f.O, "2 cm", 0.08, "giu");
    const c = [[xD, 0], [xS, 0], [xS, hB], [xD, hB]];
    const w = finestre(4, 0.16, 0.86);
    c.forEach((p, i) => f.figura(`PV${"abcd"[i]}`, p, c[(i + 1) % 4], w[i]));
    f.scritta("Largo", "6 cm", [xm - 0.7, 0.25], BLU, 0.9);
    f.scritta("Alto", "4 cm", [xS - 1.7, hB / 2 - 0.25], BLU, 0.9);
    f.passo();

    // Passo 2 · triangolo
    f.segno("Mezzo", [xm, hB], 0.15);
    f.misura("AltT", [xm, hB], [xm, top], "3 cm", 0.3, "dx");
    f.figura("TettoS", [xS, hB], [xm, top], [0.5, 0.72]);
    f.figura("TettoD", [xm, top], [xD, hB], [0.72, 0.94]);
    f.passo();

    // Passo 3 · verso il PO
    const [g1, g2, g3] = finestre(3);
    f.proietta("S", [xS, 0], [xS, giu], g1);
    f.proietta("M", [xm, top], [xm, giu], g2);
    f.proietta("D", [xD, 0], [xD, giu], g3);
    f.passo();

    // Passo 4 · pianta
    f.misura("Inizio", [xS - 0.9, 0], [xS - 0.9, yA], "1 cm", 0.1, "sx");
    f.figura("POalto", [xS, yA], [xD, yA], [0.2, 0.42]);
    f.misura("Prof", [xS, yA], [xS, yB], "8 cm", 0.46, "sx");
    f.figura("PObasso", [xS, yB], [xD, yB], [0.6, 0.8]);
    f.figura("Colmo", [xm, yA], [xm, yB], [0.8, 0.95]);
    f.passo();

    // Passo 5 · verso il PL
    f.proietta("AltB", [xD, hB], [p2 + 1, hB], [0.1, 0.32]);
    f.proietta("AltT", [xm, top], [p2 + 1, top], [0.32, 0.55]);
    f.proietta("Prof1", [xD, yA], [0, yA], [0.55, 0.72]);
    f.numero(1, [0, yA], 0.73);
    f.proietta("Prof2", [xD, yB], [0, yB], [0.75, 0.92]);
    f.numero(2, [0, yB], 0.93);
    f.passo();

    // Passo 6 · archi di riporto
    f.riporto("Uno", p1, [0.1, 0.3]);
    f.numero(3, [p1, 0], 0.32);
    f.riporto("Due", p2, [0.38, 0.92]);
    f.numero(4, [p2, 0], 0.94);
    f.passo();

    // Passo 7 · fianco
    f.proietta("Tre", [p1, 0], [p1, top], [0.12, 0.5]);
    f.proietta("Quattro", [p2, 0], [p2, top], [0.5, 0.92]);
    f.passo();

    // Passo 8 · ripasso
    const r = finestre(15, 0.05, 0.94);
    c.forEach((p, i) => f.ripassa(`PV${"abcd"[i]}`, p, c[(i + 1) % 4], r[i]));
    f.ripassa("PVe", [xS, hB], [xm, top], r[4]);
    f.ripassa("PVf", [xm, top], [xD, hB], r[5]);
    const o = [[xS, yA], [xD, yA], [xD, yB], [xS, yB]];
    o.forEach((p, i) => f.ripassa(`PO${"abcd"[i]}`, p, o[(i + 1) % 4], r[6 + i]));
    f.ripassa("POe", [xm, yA], [xm, yB], r[10]);
    f.ripassa("PLa", [p1, 0], [p2, 0], r[11]);
    f.ripassa("PLb", [p2, 0], [p2, top], r[12]);
    f.ripassa("PLc", [p2, top], [p1, top], r[13]);
    f.ripassa("PLd", [p1, top], [p1, 0], r[13]);
    f.ripassa("PLe", [p1, hB], [p2, hB], r[14]);
    f.passo();
  });

  // ── Tavola 15 · Piramide tagliata da un piano parallelo al PO ───────────────
  TAVOLE["po-piramide-tagliata"] = creaFoglio({
    title: "Piramide tagliata da un piano parallelo al PO",
    eyebrow: "Tavola 15 · La prima sezione",
    subtitle: "Piramide a base quadrata: lato 6 cm, altezza 8 cm, appoggiata sul PO con i lati della base paralleli alla LT, a 2 cm dal PV e a 2 cm dal PL. Un piano parallelo al PO la taglia a 4 cm di altezza.",
    filename: "MC-DIS-2-01_po-piramide-tagliata.ggb",
    proofTitle: "Ogni punto della sezione sta su uno spigolo",
    proofCopy: "La sezione è la figura che il piano disegna dove taglia il solido. Ogni suo vertice sta su uno spigolo della piramide e, insieme, sul piano: per trovarlo basta incrociare la traccia del piano con gli spigoli nel PV, e poi portarlo sugli altri piani con le linee di proiezione. Il piano è parallelo al PO: per questo nel PO la sezione si vede con la sua forma vera. A metà altezza ogni lato è la metà di quello di base: un quadrato di lato 3 cm.",
    equality: "Sezione: quadrato di lato 3 cm, vero nel PO · PV e PL: trapezio con le basi di 6 cm e 3 cm, alto 4 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara il foglio", `La piramide ha la base quadrata di lato 6 cm ed è alta 8 cm. È appoggiata sul piano orizzontale (PO), con i lati della base paralleli alla linea di terra, a 2 cm dal piano verticale (PV) e a 2 cm dal piano laterale (PL). Un piano parallelo al PO la taglia a 4 cm di altezza. ${prepara(10, 9, 9, 9)}`, "La figura che il piano lascia sul solido si chiama sezione. Prima disegni la piramide intera, poi la tagli."],
      ["Passo 1 · Sul PO", "Disegna la base e il vertice", "Nel PO traccia una linea sottile parallela alla LT, 2 cm più in basso. Su questa linea segna due punti a sinistra dell’asse verticale, a 2 cm e a 8 cm. Completa il quadrato di lato 6 cm verso il basso. Traccia le due diagonali: si incrociano in V′, la proiezione del vertice.", "Le diagonali sono gli spigoli laterali visti dall’alto: vanno dai vertici della base fino a V′."],
      ["Passo 2 · Sul PV", "Disegna la piramide di fronte", "Dai due lati verticali del quadrato sali con due linee sottili fino a poco sopra la LT. Da V′ sali con una linea fino a circa 9 cm sopra la LT. La base sta sulla LT, tra le due linee esterne. Sulla linea di mezzo misura 8 cm dalla LT: è V″. Unisci V″ con i due estremi della base.", "Di fronte la piramide è un triangolo con la base di 6 cm e l’altezza di 8 cm."],
      ["Passo 3 · Verso il PL", "Porta le altezze e le distanze dal PV verso il PL", "Da V″ traccia una linea orizzontale verso destra, fino a circa 9 cm oltre l’asse verticale. Nel PO traccia tre linee orizzontali fino all’asse verticale: il lato in alto del quadrato, la linea che passa per V′, il lato in basso. Dall’alto in basso trovi i punti 1, 2 e 3.", "Le distanze dal PV sono 2 cm, 5 cm e 8 cm."],
      ["Passo 4 · Compasso", "Porta le distanze dal PV sulla LT", `Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 4. Ripeti dal punto 2 e dal punto 3: trovi i punti 5 e 6.`, "Controlla con il righello: i punti 4, 5 e 6 stanno a 2 cm, a 5 cm e a 8 cm da O."],
      ["Passo 5 · Sul PL", "Disegna la piramide di fianco", "La base sta sulla LT, tra i punti 4 e 6. Dal punto 5 sali in verticale fino alla linea di V″: è V‴, che si legge «V terzo». Unisci V‴ con i punti 4 e 6.", "Di fianco la piramide è lo stesso triangolo che vedi di fronte."],
      ["Passo 6 · Il piano", "Traccia il piano di taglio", "Il piano è parallelo al PO, a 4 cm di altezza. Di fronte e di fianco lo vedi di taglio, cioè dal bordo: è una linea. Traccia una linea orizzontale a 4 cm dalla LT, che attraversa il triangolo nel PV e quello nel PL. Si chiama traccia del piano.", "La traccia si disegna con un tratto diverso dagli altri, a tratto-punto più marcato."],
      ["Passo 7 · Sezione nel PV e nel PL", "Trova dove il piano taglia gli spigoli", "Nel PV la traccia incontra i due lati del triangolo nei punti 7 e 8. Nel PL li incontra nei punti 9 e 10. Il tratto tra 7 e 8, e quello tra 9 e 10, sono la sezione vista di taglio.", "Ogni punto della sezione sta su uno spigolo della piramide e sulla traccia del piano."],
      ["Passo 8 · Sezione nel PO", "Porta la sezione nel PO", "Dai punti 7 e 8 scendi in verticale fino al PO. Ogni linea incontra le due diagonali del quadrato: trovi quattro punti. Uniscili: è un quadrato di lato 3 cm, la sezione. Riempila di righe sottili a 45°, a circa mezzo centimetro una dall’altra, misurato lungo il lato: si chiama tratteggio. Non confonderlo con la linea a trattini degli spigoli nascosti.", "Il piano è parallelo al PO: la sezione nel PO si vede con la sua forma vera. A metà altezza il lato è metà di quello di base."],
      ["Passo 9 · Ripasso", "Ripassa il tronco di piramide", "La parte sopra il piano si toglie: quello che resta si chiama tronco di piramide. Ripassa con un tratto deciso i due trapezi nel PV e nel PL. Nel PO ripassa il quadrato grande, il quadrato della sezione e i quattro tratti di diagonale che li uniscono.", "Le linee della punta tolta restano sottili: servono solo a costruire."],
    ],
  }, { sinistra: 10.8, destra: 10.6, alto: 9.4, basso: 9.2 }, (f) => {
    const lato = 6, alt = 8, q = 4, dPV = 2, dPL = 2;
    const xS = -dPL - lato, xD = -dPL, cx = (xS + xD) / 2, yA = -dPV, yB = -dPV - lato, cy = (yA + yB) / 2;
    const p1 = dPV, p2 = -cy, p3 = dPV + lato, s = lato / 2 * (1 - q / alt);   // metà lato della sezione: 1,5
    const su = alt + 0.8;
    const quad = [[xS, yA], [xD, yA], [xD, yB], [xS, yB]];
    const sez = [[cx - s, cy + s], [cx + s, cy + s], [cx + s, cy - s], [cx - s, cy - s]];

    f.base();
    f.passo();

    // Passo 1 · base e diagonali
    f.misura("DalPV", [xS - 0.9, 0], [xS - 0.9, yA], "2 cm", 0.06, "sx");
    f.proietta("Linea", [0, yA], [xS - 0.5, yA], [0.08, 0.2]);
    const w = finestre(4, 0.22, 0.66);
    quad.forEach((p, i) => f.figura(`PO${"abcd"[i]}`, p, quad[(i + 1) % 4], w[i]));
    f.scritta("Lato", "6 cm", [xD - 1.6, yB - 0.8], BLU, 0.66);
    f.figura("Diag1", quad[0], quad[2], [0.68, 0.8]);
    f.figura("Diag2", quad[1], quad[3], [0.8, 0.92]);
    f.punto("Vpo", [cx, cy], "V′", 0.93, [0.35, 0.15]);
    f.passo();

    // Passo 2 · triangolo nel PV
    const [a1, a2, a3] = finestre(3, 0.05, 0.45);
    f.proietta("S", [xS, yA], [xS, 0.8], a1);
    f.proietta("M", [cx, cy], [cx, su], a2);
    f.proietta("D", [xD, yA], [xD, 0.8], a3);
    f.misura("Alt", [xS - 0.9, 0], [xS - 0.9, alt], "8 cm", 0.5, "sx", [0, 1.3]);   // più in alto: a metà c’è la traccia del piano
    f.punto("Vpv", [cx, alt], "V″", 0.6, [0.3, 0.7]);
    f.figura("PVsin", [xS, 0], [cx, alt], [0.62, 0.78]);
    f.figura("PVdes", [cx, alt], [xD, 0], [0.78, 0.94]);
    f.passo();

    // Passo 3 · verso il PL
    f.proietta("AltV", [cx, alt], [p3 + 1, alt], [0.1, 0.34]);
    f.proietta("Prof1", [xD, yA], [0, yA], [0.36, 0.52]);
    f.numero(1, [0, yA], 0.53);
    f.proietta("Prof2", [cx, cy], [0, cy], [0.56, 0.72]);
    f.numero(2, [0, cy], 0.73);
    f.proietta("Prof3", [xD, yB], [0, yB], [0.76, 0.9]);
    f.numero(3, [0, yB], 0.92);
    f.passo();

    // Passo 4 · archi di riporto
    f.riporto("Uno", p1, [0.1, 0.32]);
    f.numero(4, [p1, 0], 0.33);
    f.riporto("Due", p2, [0.38, 0.62]);
    f.numero(5, [p2, 0], 0.63);
    f.riporto("Tre", p3, [0.66, 0.92]);
    f.numero(6, [p3, 0], 0.93);
    f.passo();

    // Passo 5 · triangolo nel PL
    f.proietta("Cinque", [p2, 0], [p2, alt], [0.1, 0.4]);
    f.punto("Vpl", [p2, alt], "V‴", 0.42, [0.3, 0.7]);
    f.figura("PLsin", [p1, 0], [p2, alt], [0.5, 0.72]);
    f.figura("PLdes", [p2, alt], [p3, 0], [0.72, 0.94]);
    f.passo();

    // Passo 6 · traccia del piano
    f.misura("Quota", [xD + 0.9, 0], [xD + 0.9, q], "4 cm", 0.1, "dx", [-0.1, 0]);
    f.traccia("Piano", [xS - 1, q], [p3 + 1, q], [0.25, 0.85]);
    f.scritta("Piano", "traccia del piano", [p3 - 1.0, q - 0.8], TRACCIA_COLORE, 0.88);
    f.passo();

    // Passo 7 · punti della sezione nel PV e nel PL
    f.numero(7, [cx - s, q], 0.15);
    f.numero(8, [cx + s, q], 0.3);
    f.figura("SezPV", [cx - s, q], [cx + s, q], [0.32, 0.5]);
    f.numero(9, [p2 - s, q], 0.6);
    f.numero(10, [p2 + s, q], 0.72);
    f.figura("SezPL", [p2 - s, q], [p2 + s, q], [0.74, 0.92]);
    f.passo();

    // Passo 8 · sezione nel PO
    f.proietta("Sette", [cx - s, q], [cx - s, cy - s], [0.06, 0.26]);
    f.proietta("Otto", [cx + s, q], [cx + s, cy - s], [0.26, 0.46]);
    const w8 = finestre(4, 0.5, 0.78);
    sez.forEach((p, i) => f.figura(`Sez${"abcd"[i]}`, p, sez[(i + 1) % 4], w8[i]));
    f.tratteggio("SezPO", sez, 0.86);
    f.passo();

    // Passo 9 · ripasso del tronco
    const r = finestre(16, 0.05, 0.94);
    f.ripassa("PVa", [xS, 0], [xD, 0], r[0]);
    f.ripassa("PVb", [xD, 0], [cx + s, q], r[1]);
    f.ripassa("PVc", [cx + s, q], [cx - s, q], r[2]);
    f.ripassa("PVd", [cx - s, q], [xS, 0], r[3]);
    quad.forEach((p, i) => f.ripassa(`POq${"abcd"[i]}`, p, quad[(i + 1) % 4], r[4 + i]));
    sez.forEach((p, i) => f.ripassa(`POs${"abcd"[i]}`, p, sez[(i + 1) % 4], r[8]));
    quad.forEach((p, i) => f.ripassa(`POd${"abcd"[i]}`, p, sez[i], r[9 + (i > 1 ? 1 : 0)]));
    f.ripassa("PLa", [p1, 0], [p3, 0], r[11]);
    f.ripassa("PLb", [p3, 0], [p2 + s, q], r[12]);
    f.ripassa("PLc", [p2 + s, q], [p2 - s, q], r[13]);
    f.ripassa("PLd", [p2 - s, q], [p1, 0], r[14]);
    f.passo();
  });

  // ── Tavola 16 · Prisma esagonale tagliato da un piano inclinato ─────────────
  {
    const lato = 3, alt = 8, q = 4, cx = -6, cy = -5;
    const h = (lato * Math.sqrt(3)) / 2;                                // 2,598
    const tg = Math.tan(Math.PI / 6);
    const quota = (x) => q + (x - cx) * tg;                            // altezza della traccia sopra x
    const P = {                                                         // vertici della base nel PO
      A: [cx - lato, cy], B: [cx - lato / 2, cy + h], C: [cx + lato / 2, cy + h],
      D: [cx + lato, cy], E: [cx + lato / 2, cy - h], F: [cx - lato / 2, cy - h],
    };
    const nomi = ["A", "B", "C", "D", "E", "F"];
    const pv = (n) => [P[n][0], quota(P[n][0])];                        // punto della sezione nel PV
    const pl = (n) => [-P[n][1], quota(P[n][0])];                       // punto della sezione nel PL
    const dist = 8;                                                     // asse della vera forma: 8 cm dalla traccia
    const vf = (n) => piu(pv(n), N_SEZ, dist + (-P[n][1] - (-cy)));      // vera forma: più lontano chi è più lontano dal PV

    TAVOLE["po-prisma-esagonale-tagliato"] = creaFoglio({
      title: "Prisma esagonale tagliato da un piano inclinato",
      eyebrow: "Tavola 16 · La sezione e la sua forma vera",
      subtitle: "Prisma esagonale regolare: lato 3 cm, altezza 8 cm, appoggiato sul PO con due lati paralleli alla LT; il centro della base dista 5 cm dal PV e 6 cm dal PL. Un piano perpendicolare al PV, inclinato di 30° sul PO, lo taglia passando per il punto dell’asse a 4 cm di altezza.",
      filename: "MC-DIS-2-01_po-prisma-esagonale-tagliato.ggb",
      proofTitle: "Perché serve la vera forma",
      proofCopy: "Il piano è inclinato: nel PO e nel PL la sezione si vede deformata, più corta in una direzione di com’è davvero. Per vederla vera si ribalta il piano, cioè si immagina di girarlo attorno alla traccia finché è parallelo al foglio. Lungo la traccia le misure restano quelle del PV; di traverso si riportano le distanze prese nel PO. Viene un esagono allungato: largo quanto l’esagono di base, circa 5,2 cm, e lungo circa 6,9 cm invece di 6.",
      equality: "PV: la sezione è un tratto lungo circa 6,9 cm · PO: esagono di lato 3 cm, tratteggiato · vera forma: esagono allungato, circa 6,9 × 5,2 cm",
      steps: [
        ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Il prisma ha per base un esagono regolare di lato 3 cm ed è alto 8 cm. È appoggiato sul piano orizzontale (PO), con due lati della base paralleli alla linea di terra; il centro della base dista 5 cm dal piano verticale (PV) e 6 cm dal piano laterale (PL). Un piano lo taglia: è perpendicolare al PV, inclinato di 30° sul PO, e passa per il punto dell’asse a 4 cm di altezza. ${prepara(15, 9, 15, 9)}`, "Serve più spazio del solito sopra la LT: lì disegnerai la forma vera della sezione."],
        ["Passo 1 · Sul PO", "Disegna l’esagono", "Nel PO segna il centro: 6 cm a sinistra dell’asse verticale e 5 cm sotto la LT. Traccia per il centro una linea orizzontale sottile. Con il compasso aperto di 3 cm traccia la circonferenza: taglia la linea in A′ e D′. Senza cambiare apertura, punta in A′ e in D′ e taglia la circonferenza sopra e sotto: trovi B′, C′, E′ e F′. Unisci i sei punti.", "B′ e C′ sono i più vicini al PV, E′ e F′ i più lontani."],
        ["Passo 2 · Sul PV", "Disegna il prisma intero", "Dai vertici dell’esagono sali in verticale fino a circa 9 cm sopra la LT. Le linee sono quattro, perché B′ e F′, e così C′ ed E′, stanno sulla stessa verticale. Traccia la linea a 8 cm tra le due linee esterne: hai il prisma intero, largo 6 cm e alto 8 cm. Nel mezzo traccia l’asse del prisma, a tratto-punto.", "Prima disegni il prisma intero, sottile: dopo lo tagli."],
        ["Passo 3 · Il piano", "Traccia il piano e trova la sezione nel PV", `Sull’asse segna il punto a 4 cm dalla LT. ${SQUADRA} e traccia per quel punto una linea inclinata di 30°, che sale verso destra: è la traccia del piano. Incontra le quattro linee verticali in A″, B″ ≡ F″, C″ ≡ E″ e D″.`, "Il piano è perpendicolare al PV: di fronte lo vedi di taglio, come una linea. La sezione nel PV è il tratto tra A″ e D″."],
        ["Passo 4 · Verso il PL", "Porta le altezze e le distanze dal PV verso il PL", "Da A″, B″, C″ e D″ traccia quattro linee orizzontali verso destra, fino a circa 9 cm oltre l’asse verticale. Nel PO traccia tre linee orizzontali fino all’asse verticale: dal lato B′C′, dalla linea A′D′, dal lato F′E′. Dall’alto in basso trovi i punti 1, 2 e 3.", "Le distanze dal PV sono circa 2,4 cm, 5 cm e 7,6 cm."],
        ["Passo 5 · Compasso", "Porta le distanze dal PV sulla LT", `Punta il compasso in O. Aprilo fino al punto 1 e traccia un quarto di giro ${QUARTO}: trovi il punto 4. Ripeti dal punto 2 e dal punto 3: trovi i punti 5 e 6.`, "Controlla con il righello: i punti 4, 5 e 6 stanno a circa 2,4 cm, a 5 cm e a circa 7,6 cm da O."],
        ["Passo 6 · Sul PL", "Trova la sezione nel PL", "Dai punti 4, 5 e 6 sali in verticale. Dove queste linee incontrano le orizzontali trovi i sei punti della sezione: B‴ e C‴ sulla verticale del punto 4, A‴ e D‴ su quella del punto 5, F‴ ed E‴ su quella del punto 6. Uniscili in ordine: A‴, B‴, C‴, D‴, E‴, F‴.", "Ogni punto ha l’altezza del PV e la distanza dal PV del PO: per questo serve incrociare due linee."],
        ["Passo 7 · Vera forma", "Disegna la sezione con la sua forma vera", "Immagina di girare il piano attorno alla traccia, come una porta sui cardini, finché è parallelo al foglio: si dice ribaltare. I punti ribaltati si scrivono tra parentesi: (A) si legge «A ribaltato». Appoggia la squadra da 30° e 60° sul righello tenuto lungo la LT, con il lato che forma 60° con la LT rivolto verso sinistra: è perpendicolare alla traccia. Traccia così da A″, B″, C″ e D″ quattro perpendicolari. Su quelle di A″ e D″ misura 8 cm dalla traccia (una distanza scelta per non sovrapporre i disegni) e unisci i due punti: è l’asse della vera forma, a tratto-punto, e su di esso stanno (A) e (D). Con il compasso prendi nel PO la distanza di B′ dalla linea A′D′, circa 2,6 cm, e riportala sulle perpendicolari di B″ e di C″: dalla parte della traccia trovi (B) e (C), che nel PO sono vicini alla LT; dalla parte opposta (F) ed (E). Unisci i sei punti e tratteggia l’esagono.", "Controlla: (B)(C) è lungo circa 3,5 cm, più di B′C′, che è 3 cm, perché nel PV il lato è inclinato."],
        ["Passo 8 · Ripasso", "Ripassa il prisma tagliato", "La parte sopra il piano si toglie. Ripassa nel PV il contorno del pezzo che resta e i due spigoli interni. Nel PO ripassa l’esagono e tratteggialo: dall’alto vedi tutta la sezione. Nel PL ripassa il contorno, le linee della sezione e tratteggiala; lo spigolo di D, sopra A‴, sta dietro la sezione: disegnalo a trattini. Ripassa la vera forma.", "Il tratteggio a 45° dice a chi legge che lì il solido è stato tagliato."],
      ],
    }, { sinistra: 14.4, destra: 9.4, alto: 15.2, basso: 8.8, nomePV: "basso" }, (f) => {
      const su = alt + 0.8;
      const xs = [P.A[0], P.B[0], P.C[0], P.D[0]];
      const esa = nomi.map((n) => P[n]);

      f.base();
      f.passo();

      // Passo 1 · esagono
      f.misura("CentroX", [cx, 0], f.O, "6 cm", 0.06, "giu", [1.6, 0]);
      f.misura("CentroY", [cx - lato - 0.9, 0], [cx - lato - 0.9, cy], "5 cm", 0.12, "sx");
      f.segno("K", [cx, cy], 0.2);
      f.proietta("Diam", [cx - lato - 0.5, cy], [cx + lato + 0.5, cy], [0.2, 0.32]);
      f.cerchio("Base", [cx, cy], lato, [0.34, 0.56]);
      f.archetto("AB", P.A, P.B, 10, [0.58, 0.64]);
      f.archetto("AF", P.A, P.F, 10, [0.64, 0.7]);
      f.archetto("DC", P.D, P.C, 10, [0.7, 0.76]);
      f.archetto("DE", P.D, P.E, 10, [0.76, 0.82]);
      const l1 = finestre(6, 0.83, 0.95);
      esa.forEach((p, i) => f.figura(`Esa${nomi[i]}`, p, esa[(i + 1) % 6], l1[i]));
      const sposta = { A: [-1.05, 0.85], B: [-0.9, 1.05], C: [0.15, 1.05], D: [0.2, 0.85], E: [0.15, -0.25], F: [-0.9, -0.25] };
      nomi.forEach((n) => f.punto(`Po${n}`, P[n], `${n}′`, 0.95, sposta[n]));
      f.passo();

      // Passo 2 · prisma intero nel PV
      const v = finestre(4, 0.05, 0.5);
      xs.forEach((x, i) => f.proietta(`V${i}`, [x, i === 0 || i === 3 ? cy : cy + h], [x, su], v[i]));
      f.misura("Alt", [P.D[0] + 1.6, 0], [P.D[0] + 1.6, alt], "8 cm", 0.55, "dx", [0, 1.4]);
      f.figura("Sopra", [P.A[0], alt], [P.D[0], alt], [0.6, 0.8]);
      f.asse("PV", [cx, -0.6], [cx, alt + 0.6], [0.8, 0.95]);
      f.passo();

      // Passo 3 · traccia del piano e sezione nel PV
      f.misura("Quota", [cx - 0.5, 0], [cx - 0.5, q], "4 cm", 0.08, "sx");
      f.segno("Q", [cx, q], 0.2);
      f.traccia("Piano", [P.A[0] - 0.9, quota(P.A[0] - 0.9)], [P.D[0] + 0.9, quota(P.D[0] + 0.9)], [0.25, 0.6]);
      f.scritta("Ang", "30°", [P.D[0] + 0.7, quota(P.D[0] + 0.9) + 0.3], TRACCIA_COLORE, 0.6);
      f.punto("SvA", pv("A"), "A″", 0.66, [-1.1, 0.75]);
      f.punto("SvB", pv("B"), "B″≡F″", 0.74, [-3.0, 1.3]);
      f.punto("SvC", pv("C"), "C″≡E″", 0.82, [-3.0, 1.3]);
      f.punto("SvD", pv("D"), "D″", 0.9, [0.25, -0.2]);
      f.passo();

      // Passo 4 · verso il PL
      const o4 = finestre(4, 0.05, 0.45);
      ["A", "B", "C", "D"].forEach((n, i) => f.proietta(`H${n}`, pv(n), [8.6, pv(n)[1]], o4[i]));
      f.proietta("Prof1", P.C, [0, P.C[1]], [0.5, 0.62]);
      f.numero(1, [0, P.C[1]], 0.63);
      f.proietta("Prof2", P.D, [0, cy], [0.66, 0.76]);
      f.numero(2, [0, cy], 0.77);
      f.proietta("Prof3", P.E, [0, P.E[1]], [0.8, 0.9]);
      f.numero(3, [0, P.E[1]], 0.92);
      f.passo();

      // Passo 5 · archi di riporto
      const d1 = -P.C[1], d2 = -cy, d3 = -P.E[1];
      f.riporto("Uno", d1, [0.1, 0.32]);
      f.numero(4, [d1, 0], 0.33);
      f.riporto("Due", d2, [0.38, 0.62]);
      f.numero(5, [d2, 0], 0.63);
      f.riporto("Tre", d3, [0.66, 0.92]);
      f.numero(6, [d3, 0], 0.93);
      f.passo();

      // Passo 6 · sezione nel PL
      f.proietta("Quattro", [d1, 0], [d1, quota(P.C[0]) + 0.6], [0.05, 0.22]);
      f.proietta("Cinque", [d2, 0], [d2, quota(P.D[0]) + 0.6], [0.22, 0.39]);
      f.proietta("Sei", [d3, 0], [d3, quota(P.E[0]) + 0.6], [0.39, 0.56]);
      const nomePL = { A: [0.15, -0.3], B: [-1.05, 0.2], C: [-1.05, 0.85], D: [0.2, 0.95], E: [0.2, 0.85], F: [0.2, 0.2] };
      nomi.forEach((n) => f.punto(`Pl${n}`, pl(n), `${n}‴`, 0.6, nomePL[n]));
      const l6 = finestre(6, 0.64, 0.95);
      nomi.forEach((n, i) => f.figura(`SezPL${n}`, pl(n), pl(nomi[(i + 1) % 6]), l6[i]));
      f.passo();

      // Passo 7 · vera forma
      const p7 = finestre(4, 0.04, 0.3);
      ["A", "B", "C", "D"].forEach((n, i) => f.proietta(`Perp${n}`, pv(n), piu(pv(n), N_SEZ, n === "A" || n === "D" ? 9 : 11.6), p7[i]));   // 0,5 cm oltre il punto più lontano
      f.asse("VF", piu(vf("A"), T_SEZ, -0.9), piu(vf("D"), T_SEZ, 0.9), [0.32, 0.46]);
      const nomeVF = { A: [-1.25, 0.2], B: [-0.95, -0.75], C: [0.25, -0.6], D: [0.3, 0.3], E: [0.3, 0.3], F: [-1.3, 0.85] };
      nomi.forEach((n, i) => f.punto(`Vf${n}`, vf(n), `(${n})`, 0.5 + i * 0.03, nomeVF[n]));
      const l7 = finestre(6, 0.68, 0.86);
      nomi.forEach((n, i) => f.figura(`VF${n}`, vf(n), vf(nomi[(i + 1) % 6]), l7[i]));
      f.tratteggio("VF", nomi.map(vf), 0.9);
      f.passo();

      // Passo 8 · ripasso del pezzo che resta
      const r = finestre(22, 0.04, 0.95);
      let i = 0;
      f.ripassa("PVa", [P.A[0], 0], [P.D[0], 0], r[i++]);
      f.ripassa("PVb", [P.D[0], 0], pv("D"), r[i++]);
      f.ripassa("PVc", pv("D"), pv("A"), r[i++]);
      f.ripassa("PVd", pv("A"), [P.A[0], 0], r[i++]);
      f.ripassa("PVe", [P.B[0], 0], pv("B"), r[i++]);
      f.ripassa("PVf", [P.C[0], 0], pv("C"), r[i++]);
      esa.forEach((p, j) => f.ripassa(`PO${nomi[j]}`, p, esa[(j + 1) % 6], r[i]));
      i++;
      f.tratteggio("PO", esa, 0.36);
      f.ripassa("PLa", [d1, 0], [d3, 0], r[i++]);
      f.ripassa("PLb", [d3, 0], pl("E"), r[i++]);
      f.ripassa("PLc", pl("E"), pl("D"), r[i++]);
      f.ripassa("PLd", pl("D"), pl("C"), r[i++]);
      f.ripassa("PLe", pl("C"), [d1, 0], r[i++]);
      f.ripassa("PLf", pl("A"), pl("B"), r[i++]);
      f.ripassa("PLg", pl("A"), pl("F"), r[i++]);
      f.ripassa("PLh", [d2, 0], pl("A"), r[i++]);
      f.nascosto("PLn", pl("A"), pl("D"), r[i++]);
      f.tratteggio("PL", nomi.map(pl), 0.66);
      nomi.forEach((n, j) => f.ripassa(`VF${n}`, vf(n), vf(nomi[(j + 1) % 6]), r[i]));
      f.passo();
    });
  }

  // ── Tavola 17 · Cilindro tagliato da un piano inclinato ─────────────────────
  {
    const raggio = 3, alt = 8, q = 4, cx = -6, cy = -5;
    const tg = Math.tan(Math.PI / 6), co = Math.cos(Math.PI / 6);
    const quota = (x) => q + (x - cx) * tg;
    const ang = (k) => ((k - 1) * Math.PI) / 6;                                          // punto k: (k−1)·30° dal punto più a destra
    const po = (k) => [cx + raggio * Math.cos(ang(k)), cy + raggio * Math.sin(ang(k))];
    const pv = (k) => [po(k)[0], quota(po(k)[0])];
    const pl = (k) => [-po(k)[1], quota(po(k)[0])];
    const dist = 8.5;
    const vf = (k) => piu(pv(k), N_SEZ, dist + (-po(k)[1] - (-cy)));
    const K = Array.from({ length: 12 }, (_, i) => i + 1);
    const colonne = [1, 2, 3, 4, 5, 6, 7];                                                // punti con x diversa: gli altri cadono sopra
    const profondita = [4, 3, 2, 1, 12, 11, 10];                                          // punti con distanza dal PV diversa, dalla più piccola
    // curve esatte (per il ripasso)
    const cPL = [-cy, q];
    const ellPL = [(t) => cPL[0] - raggio * Math.sin(t), (t) => cPL[1] + raggio * tg * Math.cos(t)];
    const cVF = piu([cx, q], N_SEZ, dist);
    const ellVF = [
      (t) => cVF[0] + (raggio / co) * Math.cos(t) * T_SEZ[0] - raggio * Math.sin(t) * N_SEZ[0],
      (t) => cVF[1] + (raggio / co) * Math.cos(t) * T_SEZ[1] - raggio * Math.sin(t) * N_SEZ[1],
    ];
    const testoCurva = (c) => [
      `${fmt(c[0])}${c[2] >= 0 ? "+" : ""}${fmt(c[2])}*cos(t)${c[3] >= 0 ? "+" : ""}${fmt(c[3])}*sin(t)`,
      `${fmt(c[1])}${c[4] >= 0 ? "+" : ""}${fmt(c[4])}*cos(t)${c[5] >= 0 ? "+" : ""}${fmt(c[5])}*sin(t)`,
    ];
    // coefficienti: x = x0 + a·cos t + b·sin t ; y = y0 + c·cos t + d·sin t
    const curvaPL = testoCurva([cPL[0], cPL[1], 0, -raggio, raggio * tg, 0]);
    const curvaVF = testoCurva([cVF[0], cVF[1], (raggio / co) * T_SEZ[0], -raggio * N_SEZ[0], (raggio / co) * T_SEZ[1], -raggio * N_SEZ[1]]);

    TAVOLE["po-cilindro-tagliato"] = creaFoglio({
      title: "Cilindro tagliato da un piano inclinato",
      eyebrow: "Tavola 17 · Una sezione curva",
      subtitle: "Cilindro di raggio 3 cm, alto 8 cm, appoggiato sul PO; il centro della base dista 5 cm dal PV e 6 cm dal PL. Un piano perpendicolare al PV, inclinato di 30° sul PO, lo taglia passando per il punto dell’asse a 4 cm di altezza.",
      filename: "MC-DIS-2-01_po-cilindro-tagliato.ggb",
      proofTitle: "Una curva si costruisce per punti",
      proofCopy: "Il cilindro non ha spigoli: per trovare la sezione si scelgono dodici linee sulla sua superficie, le generatrici, e si cerca dove il piano le taglia. Ogni punto si porta sugli altri piani come un vertice qualunque; poi si uniscono i punti con una linea curva. La sezione di un cilindro tagliato di sbieco è un’ellisse: nel PL è larga 6 cm e alta circa 3,5 cm; nella vera forma è larga 6 cm e lunga circa 6,9 cm.",
      equality: "PO: cerchio di raggio 3 cm, tratteggiato · PL: ellisse di 6 × 3,5 cm circa · vera forma: ellisse di 6,9 × 6 cm circa",
      steps: [
        ["Prima di iniziare", "Leggi i dati e prepara il foglio", `Il cilindro ha il raggio di 3 cm ed è alto 8 cm. È appoggiato sul piano orizzontale (PO); il centro della base dista 5 cm dal piano verticale (PV) e 6 cm dal piano laterale (PL). Un piano lo taglia: è perpendicolare al PV, inclinato di 30° sul PO, e passa per il punto dell’asse a 4 cm di altezza. ${prepara(15, 10, 15, 9)}`, "È lo stesso taglio della tavola 16, su un solido rotondo."],
        ["Passo 1 · Sul PO", "Disegna il cerchio e i dodici punti", "Nel PO segna il centro: 6 cm a sinistra dell’asse verticale e 5 cm sotto la LT. Traccia i due assi a tratto-punto e la circonferenza di raggio 3 cm. Con la stessa apertura punta il compasso nei quattro punti dove gli assi incontrano la circonferenza: ogni volta segni due punti. Con i quattro degli assi hai 12 punti a distanza uguale. Numerali da 1 a 12, partendo da quello più a destra e girando verso la LT.", "Le linee del cilindro che passano per questi punti si chiamano generatrici: sono come gli spigoli di un prisma."],
        ["Passo 2 · Sul PV", "Disegna il cilindro intero e le generatrici", "Dai dodici punti sali in verticale fino a circa 9 cm sopra la LT. Le linee sono sette, perché i punti stanno a coppie uno dietro l’altro: 2 con 12, 3 con 11, 4 con 10, 5 con 9, 6 con 8. Traccia la linea a 8 cm tra le due linee esterne e l’asse del cilindro, a tratto-punto.", "Prima disegni il cilindro intero, sottile: dopo lo tagli."],
        ["Passo 3 · Il piano", "Traccia il piano e trova i punti nel PV", `Sull’asse segna il punto a 4 cm dalla LT. ${SQUADRA} e traccia per quel punto la linea inclinata di 30° che sale verso destra: è la traccia del piano. Segna i sette punti dove incontra le generatrici.`, "Ogni punto della traccia vale per due generatrici, tranne il primo e l’ultimo: 1″ a destra, in alto, e 7″ a sinistra, in basso."],
        ["Passo 4 · Verso il PL", "Porta le altezze e le distanze dal PV verso il PL", "Dai sette punti della traccia disegna sette linee orizzontali verso destra, fino a circa 9 cm oltre l’asse verticale. Nel PO, dai dodici punti, traccia le linee orizzontali fino all’asse verticale. Sono sette, perché anche qui i punti vanno a coppie: 1 con 7, 2 con 6, 3 con 5, 8 con 12, 9 con 11. Solo 4 e 10 sono da soli.", "Le distanze dal PV vanno da 2 cm (punto 4) a 8 cm (punto 10)."],
        ["Passo 5 · Compasso", "Porta le distanze dal PV sulla LT", `Punta il compasso in O e porta sulla LT, una alla volta, le sette distanze dal PV: sette quarti di giro ${QUARTO}.`, "Controlla con il righello: il primo arco arriva a 2 cm da O, quello di mezzo a 5 cm, l’ultimo a 8 cm."],
        ["Passo 6 · Sul PL", "Trova la sezione nel PL", "Dai sette punti sulla LT sali in verticale. Poi segui una generatrice alla volta. Per la 2: l’orizzontale è quella che parte dal punto della traccia sulla linea della 2 (a 5,5 cm); la verticale è quella che sale dal punto della LT dove arriva l’arco della linea della 2 (a 3,5 cm da O). Dove si incrociano c’è il punto della sezione. Fai lo stesso per le altre: le coppie del PV (2 e 12, 3 e 11, …) hanno la stessa orizzontale, quelle del PO (2 e 6, 3 e 5, …) la stessa verticale. Unisci i dodici punti con una linea curva, a mano libera o con il curvilineo (il righello per le curve).", "Viene un’ellisse, cioè un cerchio schiacciato: larga 6 cm, come il cilindro, e alta circa 3,5 cm."],
        ["Passo 7 · Vera forma", "Disegna la sezione con la sua forma vera", "Come nella tavola 16, con la squadra da 30° e 60° (lato che forma 60° con la LT rivolto verso sinistra) traccia dai sette punti della traccia sette perpendicolari. Su quelle di 1″ e di 7″ misura 8,5 cm dalla traccia e unisci i due punti: è l’asse della vera forma, e su di esso stanno (1) e (7). Con il compasso prendi nel PO la distanza di ogni punto dall’asse orizzontale del cerchio: 1,5 cm per 2, 6, 8 e 12; 2,6 cm per 3, 5, 9 e 11; 3 cm per 4 e 10. Riportala sulla perpendicolare che parte dal punto della traccia sulla sua linea (2 e 12 hanno la stessa perpendicolare, come 3 e 11, 4 e 10, 5 e 9, 6 e 8): dalla parte della traccia i punti vicini al PV (2, 3, 4, 5, 6), dalla parte opposta quelli lontani (8, 9, 10, 11, 12). Unisci i dodici punti con una linea curva e tratteggia.", "Viene un’ellisse più lunga di quella del PL: circa 6,9 cm lungo la traccia e 6 cm di traverso."],
        ["Passo 8 · Ripasso", "Ripassa il cilindro tagliato", "La parte sopra il piano si toglie. Nel PV ripassa il contorno del pezzo che resta. Nel PO ripassa il cerchio e tratteggialo: dall’alto vedi tutta la sezione. Nel PL ripassa i due lati, la base e l’ellisse, tratteggia l’ellisse e traccia l’asse del cilindro, a tratto-punto. Ripassa la vera forma. Gli assi restano sottili, a tratto-punto.", "Nel PL i lati del cilindro arrivano a 4 cm: lì le generatrici 4 e 10 incontrano il piano."],
      ],
    }, { sinistra: 15, destra: 9.8, alto: 15.2, basso: 8.9, nomePV: "basso" }, (f) => {
      const su = alt + 0.8;

      f.base();
      f.passo();

      // Passo 1 · cerchio e dodici punti
      f.misura("CentroX", [cx, 0], f.O, "6 cm", 0.05, "giu", [1.6, 0]);
      f.misura("CentroY", [cx - raggio - 0.9, 0], [cx - raggio - 0.9, cy], "5 cm", 0.1, "sx");
      f.asse("OrizPO", [cx - raggio - 0.6, cy], [cx + raggio + 0.6, cy], [0.16, 0.26]);
      f.asse("VertPO", [cx, cy + raggio + 0.6], [cx, cy - raggio - 0.6], [0.26, 0.36]);
      f.cerchio("Base", [cx, cy], raggio, [0.38, 0.56]);
      const ar = finestre(8, 0.58, 0.88);
      [[1, 3], [1, 11], [4, 2], [4, 6], [7, 5], [7, 9], [10, 8], [10, 12]].forEach(([c, p], i) => f.archetto(`G${c}x${p}`, po(c), po(p), 9, ar[i]));
      K.forEach((k) => {
        const p = po(k), fuori = 0.55;
        f.numero(k, p, 0.9);
        f.stile(`N${k}`, { label: false });
        f.scritta(`Num${k}`, String(k), [p[0] + fuori * Math.cos(ang(k)) - 0.2, p[1] + fuori * Math.sin(ang(k)) - 0.25], STILI.servizio.color, 0.9);
        f.stile(`TestoNum${k}`, { layer: LIVELLI.nomi });
      });
      f.passo();

      // Passo 2 · cilindro intero nel PV
      const v = finestre(7, 0.04, 0.6);
      colonne.forEach((k, i) => f.proietta(`G${k}`, po(k), [po(k)[0], su], v[i]));
      f.misura("Alt", [cx + raggio + 1.6, 0], [cx + raggio + 1.6, alt], "8 cm", 0.62, "dx", [0, 1.4]);
      f.figura("Sopra", [cx - raggio, alt], [cx + raggio, alt], [0.66, 0.82]);
      f.asse("PV", [cx, -0.6], [cx, alt + 0.6], [0.82, 0.95]);
      f.passo();

      // Passo 3 · traccia e sette punti
      f.misura("Quota", [cx - 0.5, 0], [cx - 0.5, q], "4 cm", 0.08, "sx");
      f.segno("Q", [cx, q], 0.2);
      f.traccia("Piano", [cx - raggio - 0.9, quota(cx - raggio - 0.9)], [cx + raggio + 0.9, quota(cx + raggio + 0.9)], [0.25, 0.6]);
      f.scritta("Ang", "30°", [cx + raggio + 0.7, quota(cx + raggio + 0.9) + 0.3], TRACCIA_COLORE, 0.6);
      colonne.forEach((k, i) => f.segno(`Tv${k}`, pv(k), 0.64 + i * 0.04));
      f.punto("T1", pv(1), "1″", 0.66, [0.25, -0.2]);
      f.punto("T7", pv(7), "7″", 0.9, [-1.05, 0.25]);
      f.passo();

      // Passo 4 · verso il PL
      const o4 = finestre(7, 0.04, 0.5);
      colonne.forEach((k, i) => f.proietta(`H${k}`, pv(k), [8.9, pv(k)[1]], o4[i]));
      const o5 = finestre(7, 0.54, 0.94);
      profondita.forEach((k, i) => f.proietta(`P${k}`, po(k), [0, po(k)[1]], o5[i]));
      f.passo();

      // Passo 5 · sette archi di riporto
      const a5 = finestre(7, 0.05, 0.94);
      profondita.forEach((k, i) => {
        f.riporto(`R${k}`, -po(k)[1], a5[i]);
        f.segno(`L${k}`, [-po(k)[1], 0], a5[i][1]);
      });
      f.passo();

      // Passo 6 · ellisse nel PL
      const v6 = finestre(7, 0.04, 0.4);
      profondita.forEach((k, i) => {
        const pari = K.filter((j) => Math.abs(po(j)[1] - po(k)[1]) < 1e-6);
        const tetto = Math.max(...pari.map((j) => pl(j)[1]));
        f.proietta(`U${k}`, [-po(k)[1], 0], [-po(k)[1], tetto + 0.5], v6[i]);
      });
      K.forEach((k, i) => f.segno(`Sl${k}`, pl(k), 0.44 + i * 0.02));
      f.curva("EllPL", curvaPL[0], curvaPL[1], 0, fmt(2 * Math.PI), 0.8);
      f.passo();

      // Passo 7 · vera forma
      const p7 = finestre(7, 0.04, 0.34);
      const lunghe = { 1: 9, 2: 10.5, 3: 11.6, 4: 12, 5: 11.6, 6: 10.5, 7: 9 };   // 0,5 cm oltre il punto più lontano
      colonne.forEach((k, i) => f.proietta(`Perp${k}`, pv(k), piu(pv(k), N_SEZ, lunghe[k]), p7[i]));
      f.asse("VF", piu(vf(7), T_SEZ, -0.9), piu(vf(1), T_SEZ, 0.9), [0.36, 0.46]);
      K.forEach((k, i) => f.segno(`Vf${k}`, vf(k), 0.48 + i * 0.015));
      f.punto("VfUno", vf(1), "(1)", 0.5, [0.3, 0.3]);
      f.punto("VfQuattro", vf(4), "(4)", 0.55, [0.25, -0.55]);
      f.punto("VfSette", vf(7), "(7)", 0.6, [-1.35, -0.55]);
      f.punto("VfDieci", vf(10), "(10)", 0.65, [-0.5, 0.75]);
      f.curva("EllVF", curvaVF[0], curvaVF[1], 0, fmt(2 * Math.PI), 0.82);
      f.tratteggio("VF", ellisseVertici(ellVF[0], ellVF[1]), 0.9);
      f.passo();

      // Passo 8 · ripasso
      const r = finestre(8, 0.04, 0.95);
      f.ripassa("PVa", [cx - raggio, 0], [cx + raggio, 0], r[0]);
      f.ripassa("PVb", [cx + raggio, 0], pv(1), r[1]);
      f.ripassa("PVc", pv(1), pv(7), r[2]);
      f.ripassa("PVd", pv(7), [cx - raggio, 0], r[3]);
      f.ripassaCerchio("PO", [cx, cy], raggio, r[4][0]);
      f.tratteggio("PO", ellisseVertici((t) => cx + raggio * Math.cos(t), (t) => cy + raggio * Math.sin(t)), r[4][1]);
      f.ripassa("PLa", [-po(4)[1], 0], [-po(10)[1], 0], r[5]);
      f.ripassa("PLb", [-po(4)[1], 0], pl(4), r[5]);
      f.ripassa("PLc", [-po(10)[1], 0], pl(10), r[5]);
      f.curva("PL", curvaPL[0], curvaPL[1], 0, fmt(2 * Math.PI), r[6][0], true);
      f.tratteggio("PL", ellisseVertici(ellPL[0], ellPL[1]), r[6][1]);
      f.asse("PL", [-cy, -0.6], [-cy, q + raggio * tg + 0.6], r[6]);
      f.curva("VF", curvaVF[0], curvaVF[1], 0, fmt(2 * Math.PI), r[7][0], true);
      f.passo();
    });
  }

  // ── Tavola 18 · Il cubo con riga e squadre ──────────────────────────────────
  // Come nei libri: la riga sta ferma, la squadra ci scorre sopra. Al posto del compasso, la squadra a 45°
  // porta le distanze dal PV dal PO al PL (squadre.js). Passi brevi: al massimo due o tre gesti per passo.
  TAVOLE["po-cubo-squadre"] = creaFoglio({
    title: "Il cubo con riga e squadre",
    eyebrow: "Tavola 18 · Riga, squadra a 30° e 60°, squadra a 45°",
    subtitle: "Cubo con lo spigolo di 5 cm, appoggiato sul PO, a 2 cm dal PV e a 2 cm dal PL. Ogni linea si traccia lungo il bordo della riga o di una squadra; le distanze passano dal PO al PL con la squadra a 45°, senza compasso.",
    filename: "MC-DIS-2-01_po-cubo-squadre.ggb",
    proofTitle: "Perché la linea a 45° sostituisce il compasso",
    proofCopy: "La linea a 45° che parte da O divide a metà l’angolo retto del riquadro in basso a destra: ogni suo punto sta alla stessa distanza dalla LT e dall’asse verticale. Se arrivi su quella linea con una linea orizzontale che sta 2 cm sotto la LT, ti trovi 2 cm a destra dell’asse verticale. Così la distanza dal PV passa dal PO al PL senza cambiare: è lo stesso lavoro dell’arco di compasso, fatto con una squadra.",
    equality: "PO, PV e PL: tre quadrati di 5 × 5 cm",
    steps: [
      ["Prima di iniziare", "Leggi i dati e prepara gli strumenti", `${prepara(9, 9, 7, 10)} Il cubo ha lo spigolo di 5 cm. È appoggiato sul PO, con due facce parallele al PV: dista 2 cm dal PV e 2 cm dal PL. Ti servono una riga con le tacche dei centimetri, la squadra a 30° e 60° e la squadra a 45°.`, "La riga sta ferma e la tieni con una mano; con l’altra fai scorrere la squadra appoggiata alla riga. Ogni volta che sposti la riga, tienila parallela alla LT: appoggiala su una linea già tracciata o su due segni alla stessa distanza dalla LT."],
      ["Passo 1 · Riga", "Il lato in basso del quadrato", "Nel PO fai due segni 7 cm sotto la LT, uno a sinistra e uno a destra, e appoggia la riga su quei due segni. Lungo il bordo traccia il lato in basso del quadrato: dal punto a 7 cm al punto a 2 cm a sinistra dell’asse verticale.", "7 cm = 2 cm di distanza dal PV + 5 cm di spigolo."],
      ["Passo 2 · Squadra", "I due lati verticali", "Appoggia sulla riga la squadra a 30° e 60°, in piedi: il cateto lungo è verticale. Falla scorrere fino all’estremo sinistro del lato e traccia un lato verticale lungo 5 cm. Poi falla scorrere fino all’estremo destro e traccia l’altro.", "La squadra in piedi sulla riga dà sempre linee perpendicolari alla riga."],
      ["Passo 3 · Riga", "Chiudi il quadrato", "Sposta la riga in alto finché il bordo tocca le estremità in alto dei due lati verticali, 2 cm sotto la LT, e lungo il bordo traccia il quarto lato. Il quadrato è la vista dall’alto del cubo.", "Controlla con la squadra i quattro angoli retti."],
      ["Passo 4 · Verso il PV", "Prolunga i lati verso l’alto", "Rimetti la riga 7 cm sotto la LT. Fai scorrere la squadra fino al lato sinistro del quadrato e prolungalo verso l’alto, oltre la LT, con una linea sottile. Fai lo stesso con il lato destro.", "Le linee sottili sono linee di proiezione: portano la larghezza del cubo, 5 cm, dal PO al PV."],
      ["Passo 5 · Sul PV", "Chiudi il prospetto", "Su tutte e due le verticali misura 5 cm dalla LT e fai un segno. Appoggia la riga sui due segni e lungo il bordo traccia il lato in alto del prospetto.", "Il prospetto è un quadrato di 5 cm appoggiato sulla LT."],
      ["Passo 6 · Squadra a 45°", "La linea a 45° da O", "Sposta la riga in basso, circa 9,5 cm sotto la LT, più in basso del quadrato. Appoggiaci la squadra a 45° e falla scorrere finché l’ipotenusa, il suo lato più lungo, passa per O. Lungo l’ipotenusa traccia una linea sottile da O verso il basso a destra, nel riquadro in basso a destra.", "Questa linea prende il posto degli archi di compasso."],
      ["Passo 7 · Riga", "Porta le distanze sulla linea a 45°", "Con la riga traccia due linee orizzontali sottili: una prolunga il lato in alto del quadrato del PO, l’altra il lato in basso. Falle arrivare fino alla linea a 45°: trovi i punti 1 e 2.", "Controlla con la riga: il punto 1 sta 2 cm a destra dell’asse verticale, il punto 2 a 7 cm."],
      ["Passo 8 · Verso il PL", "Sali dai punti 1 e 2", "Appoggia la riga 8 cm sotto la LT, più in basso del punto 2. Fai scorrere la squadra in piedi fino al punto 1 e traccia una verticale sottile che sale oltre la LT. Poi fino al punto 2 e traccia l’altra.", "Le due verticali portano nel PL le distanze dal PV: 2 cm e 7 cm."],
      ["Passo 9 · Sul PL", "Chiudi il fianco", "Sposta la riga all’altezza del lato in alto del prospetto, 5 cm sopra la LT, e prolunga quel lato verso destra, oltre la seconda verticale. Il lato in basso del fianco è sulla LT.", "Il fianco è un quadrato di 5 cm, tra 2 e 7 cm dall’asse verticale."],
      ["Passo 10 · Ripasso", "Ripassa gli spigoli", "Ripassa con un tratto deciso i tre quadrati: sono gli spigoli del cubo visti dall’alto, di fronte e di fianco. Qui non servono linee tratteggiate: ogni spigolo nascosto cade esattamente sotto uno spigolo in vista.", "Il cubo ha tutte le misure uguali: per questo le tre viste sono tre quadrati uguali."],
    ],
  }, { sinistra: 9.6, destra: 9.4, alto: 7.4, basso: 10.2 }, (f, k, t) => {
    const S = window.GGB_SQUADRE(k, t);
    const lato = 5, dPV = 2, dPL = 2;
    const xS = -dPL - lato, xD = -dPL;                        // -7 e -2
    const yA = -dPV, yB = -dPV - lato;                        // -2 e -7
    const p1 = dPV, p2 = dPV + lato;                          // 2 e 7
    const su = lato + 0.9;
    const yR45 = -9.5, yRPL = -8;

    f.base();
    f.passo();

    // Passo 1 · riga e lato in basso
    S.strumento("R1", "riga", S.riga(yB - 1.5), S.riga(yB), [0.04, 0.35]);
    f.figura("RBasso", [xS, yB], [xD, yB], [0.4, 0.92]);
    f.passo();

    // Passo 2 · squadra in piedi: i due lati verticali
    S.strumento("R2", "riga", S.riga(yB), null, [0.01, 0.02]);
    S.strumento("Q2a", "3060", S.verticale([xS - 3, yB]), S.verticale([xS, yB]), [0.03, 0.22], { via: 0.5 });
    f.figura("RSin", [xS, yB], [xS, yA], [0.24, 0.48]);
    S.strumento("Q2b", "3060", S.verticale([xS, yB]), S.verticale([xD, yB]), [0.5, 0.7]);
    f.figura("RDes", [xD, yB], [xD, yA], [0.72, 0.95]);
    f.passo();

    // Passo 3 · riga in alto: quarto lato
    S.strumento("R3", "riga", S.riga(yB), S.riga(yA), [0.03, 0.4]);
    f.figura("RAlto", [xS, yA], [xD, yA], [0.45, 0.94]);
    f.passo();

    // Passo 4 · verso il PV
    S.strumento("R4", "riga", S.riga(yA), S.riga(yB), [0.02, 0.18]);
    S.strumento("Q4a", "3060", S.verticale([xS - 3, yB]), S.verticale([xS, yB]), [0.2, 0.34], { via: 0.6 });
    f.proietta("Sin", [xS, yA], [xS, su], [0.36, 0.58]);
    S.strumento("Q4b", "3060", S.verticale([xS, yB]), S.verticale([xD, yB]), [0.6, 0.74]);
    f.proietta("Des", [xD, yA], [xD, su], [0.76, 0.96]);
    f.passo();

    // Passo 5 · prospetto
    f.misura("Alt", [xS, 0], [xS, lato], "5 cm", 0.1, "sx");
    S.strumento("R5", "riga", S.riga(yB), S.riga(lato), [0.2, 0.5]);
    f.figura("Sopra", [xS, lato], [xD, lato], [0.55, 0.95]);
    f.passo();

    // Passo 6 · squadra a 45°: linea da O
    S.strumento("R6", "riga", S.riga(lato), S.riga(yR45), [0.02, 0.24]);
    S.strumento("Q6", "45", { o: [-4, yR45], ang: 0 }, { o: [-(11 + yR45), yR45], ang: 0 }, [0.26, 0.48]);
    f.proietta("Q45", [0, 0], [-yR45 - 1, yR45 + 1], [0.52, 0.95]);
    f.passo();

    // Passo 7 · orizzontali fino alla linea a 45°
    S.strumento("R7a", "riga", S.riga(yR45), S.riga(yA), [0.02, 0.18], { via: 0.5 });
    f.proietta("Uno", [xD, yA], [p1, yA], [0.2, 0.44]);
    f.numero(1, [p1, yA], 0.46);
    S.strumento("R7b", "riga", S.riga(yA), S.riga(yB), [0.5, 0.64]);
    f.proietta("Due", [xD, yB], [p2, yB], [0.66, 0.9]);
    f.numero(2, [p2, yB], 0.92);
    f.passo();

    // Passo 8 · verticali verso il PL
    S.strumento("R8", "riga", S.riga(yB), S.riga(yRPL), [0.02, 0.12]);
    S.strumento("Q8a", "3060", S.verticale([p1 - 3, yRPL]), S.verticale([p1, yRPL]), [0.14, 0.3], { via: 0.56 });
    f.proietta("SuUno", [p1, yA], [p1, su], [0.32, 0.54]);
    S.strumento("Q8b", "3060", S.verticale([p1, yRPL]), S.verticale([p2, yRPL]), [0.56, 0.7]);
    f.proietta("SuDue", [p2, yB], [p2, su], [0.72, 0.96]);
    f.passo();

    // Passo 9 · fianco
    S.strumento("R9", "riga", S.riga(yRPL), S.riga(lato), [0.03, 0.4]);
    f.proietta("AltPL", [xD, lato], [p2 + 1.2, lato], [0.45, 0.95]);
    f.passo();

    // Passo 10 · ripasso
    const r = finestre(12, 0.06, 0.93);
    const quadrato = (sigla, x1, x2, y1, y2, da) => {
      f.ripassa(`${sigla}a`, [x1, y1], [x2, y1], r[da]);
      f.ripassa(`${sigla}b`, [x2, y1], [x2, y2], r[da + 1]);
      f.ripassa(`${sigla}c`, [x2, y2], [x1, y2], r[da + 2]);
      f.ripassa(`${sigla}d`, [x1, y2], [x1, y1], r[da + 3]);
    };
    quadrato("PO", xS, xD, yA, yB, 0);
    quadrato("PV", xS, xD, 0, lato, 4);
    quadrato("PL", p1, p2, 0, lato, 8);
    f.passo();
  });

  // ── Pulsante «Foglio tecnico» / «Foglio a colori»: ricarica la stessa tavola nell'altra modalità ──
  if ((PARAMETRI.get("activity") || "").startsWith("po-")) {
    if (TECNICO) document.documentElement.classList.add("foglio-tecnico");
    const pulsante = (classe) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = classe;
      b.textContent = TECNICO ? "Foglio a colori" : "Foglio tecnico";
      b.title = TECNICO ? "Torna alla tavola con i piani colorati" : "Apri la stessa tavola come foglio da disegno tecnico";
      b.addEventListener("click", () => {
        const q = new URLSearchParams(window.location.search);
        if (TECNICO) q.delete("modo"); else q.set("modo", "tecnico");
        window.location.search = q.toString();
      });
      return b;
    };
    // Interruttori: nascondono linee di proiezione (con archi di riporto e punti numerati), misure, nomi dei punti.
    const nomeApplet = `baseConstruction_${PARAMETRI.get("activity").replace(/[^a-z0-9]/gi, "_")}`;
    const VOCI = [["proiezioni", "Linee di proiezione"], ["misure", "Misure"], ["nomi", "Nomi dei punti"]];
    const caselle = [];
    // Il motore riaccende gli oggetti a ogni passo: per questo l'interruttore non spegne una volta sola, ma si mette
    // in mezzo a setVisible. `voluto` ricorda che cosa il motore vuole mostrare, `spenti` che cosa ha spento l'alunno.
    const stili = (TAVOLE[PARAMETRI.get("activity")] || {}).styles || {};
    const spenti = {};
    const voluto = {};
    let originale = null;
    const aggancia = () => {
      const applet = window[nomeApplet];
      if (!applet || typeof applet.setVisible !== "function") return false;
      if (!originale) {
        originale = applet.setVisible.bind(applet);
        applet.setVisible = (nome, visibile) => {
          voluto[nome] = visibile;
          originale(nome, visibile && !spenti[(stili[nome] || {}).layer]);
        };
      }
      return true;
    };
    const attesa = window.setInterval(() => { if (aggancia()) window.clearInterval(attesa); }, 150);
    const aggiorna = (livello) => {
      if (!aggancia()) return;
      const applet = window[nomeApplet];
      Object.keys(stili).forEach((nome) => {
        if (stili[nome].layer !== livello || !applet.exists(nome)) return;
        if (voluto[nome] === undefined) voluto[nome] = applet.getVisible(nome);
        originale(nome, voluto[nome] && !spenti[livello]);
      });
    };
    const interruttori = () => {
      const gruppo = document.createElement("div");
      gruppo.setAttribute("role", "group");
      gruppo.setAttribute("aria-label", "Che cosa mostrare sul foglio");
      gruppo.style.cssText = "display:inline-flex;flex-wrap:wrap;gap:6px 14px;align-items:center;margin:0 10px;font:600 0.85rem/1.2 inherit;color:#334155";
      VOCI.forEach(([chiave, etichetta]) => {
        const l = document.createElement("label");
        l.style.cssText = "display:inline-flex;gap:6px;align-items:center;cursor:pointer;min-height:32px";
        const c = document.createElement("input");
        c.type = "checkbox"; c.checked = true; c.dataset.chiave = chiave;
        c.style.cssText = "width:18px;height:18px";
        c.addEventListener("change", () => {
          caselle.forEach((altra) => { if (altra.dataset.chiave === chiave) altra.checked = c.checked; });
          spenti[LIVELLI[chiave]] = !c.checked;
          aggiorna(LIVELLI[chiave]);
        });
        caselle.push(c);
        l.append(c, etichetta);
        gruppo.append(l);
      });
      return gruppo;
    };
    const ricomincia = document.getElementById("reset-button");
    if (ricomincia) {
      ricomincia.parentNode.style.flexWrap = "wrap";          // sul telefono interruttori e pulsanti vanno a capo
      const gruppo = interruttori();
      gruppo.style.flex = "1 1 100%";
      ricomincia.parentNode.insertBefore(gruppo, ricomincia);
    }
    if (ricomincia) ricomincia.parentNode.insertBefore(pulsante("button button--ghost"), ricomincia);
    const livello = document.querySelector(".level-badge");
    if (livello) {
      const b = pulsante("button button--ghost");
      b.style.cssText = "margin-left:10px;padding:6px 12px;white-space:nowrap;align-self:center;height:auto;min-height:36px";
      livello.insertAdjacentElement("afterend", b);
      b.insertAdjacentElement("afterend", interruttori());
    }
  }
})();
