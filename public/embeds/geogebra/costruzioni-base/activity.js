/* global GGBApplet */

(() => {
  "use strict";

  const ACTIVITIES = {
    "divisione-segmento": {
      title: "Divisione di un segmento in 5 parti uguali",
      eyebrow: "Costruzione 3 · Metodo delle parallele",
      subtitle: "Usa Talete: punti equidistanti su una semiretta e rette parallele dividono AB in parti uguali.",
      filename: "MC-DIS-1-01_divisione-segmento.ggb",
      coord: [-5.6, 5.3, -2.4, 4.4],
      proofTitle: "Il teorema di Talete fa il lavoro difficile",
      proofCopy: "I cinque tratti sulla semiretta sono uguali. Le parallele al segmento guida 5B trasferiscono quella uguaglianza sul segmento AB: per Talete, anche AB viene diviso in cinque parti uguali.",
      equality: "AD₁ = D₁D₂ = D₂D₃ = D₃D₄ = D₄B",
      steps: [
        ["Prima di iniziare", "Osserva il segmento AB", "Hai un segmento AB. Vuoi dividerlo in 5 parti uguali anche se la misura non viene comoda con il righello.", "Parti da A e B: il risultato finale comparirà proprio su AB."],
        ["Passo 1 · Semiretta", "Traccia una semiretta da A", "Da A disegna una semiretta obliqua, non parallela al segmento AB. È la linea su cui riporterai distanze uguali.", "Un angolo acuto rende la costruzione più leggibile."],
        ["Passo 2 · Distanze uguali", "Segna 5 punti equidistanti", "Con la stessa apertura del compasso, marca cinque punti sulla semiretta: 1, 2, 3, 4, 5.", "La distanza tra due punti consecutivi deve restare sempre la stessa."],
        ["Passo 3 · Segmento guida", "Unisci il punto 5 con B", "Collega il quinto punto al punto B. Questo segmento diventa la guida per tutte le parallele.", "È il lato del piccolo fascio di parallele che userai nel passo successivo."],
        ["Passo 4 · Parallele", "Traccia le parallele da 1, 2, 3 e 4", "Per ogni punto segnato sulla semiretta, traccia una retta parallela al segmento 5B. Ogni parallela incontra AB.", "Usa le squadre in coppia: una guida, l’altra scorre mantenendo la direzione."],
        ["Passo 5 · Parti uguali", "Leggi le divisioni su AB", "I punti di intersezione dividono AB in cinque parti uguali. Non hai fatto conti: hai trasferito una proporzione.", "Controlla i cinque tratti su AB: devono avere la stessa lunghezza."]
      ],
      commands: [
        "A=(-4.4,-1.25)", "B=(4.4,-1.25)", "R=(-3.35,0.1)", "S1=(-3.35,0.1)", "S2=(-2.3,1.45)", "S3=(-1.25,2.8)", "S4=(-0.2,4.15)", "S5=(0.85,5.5)",
        "lineAB=Line(A,B)", "segAB=Segment(A,B)", "rayAR=Ray(A,R)", "mark1=Segment(A,S1)", "mark2=Segment(S1,S2)", "mark3=Segment(S2,S3)", "mark4=Segment(S3,S4)", "mark5=Segment(S4,S5)",
        "guideLine=Line(S5,B)", "guideSegment=Segment(S5,B)",
        "par1=Line(S1,guideLine)", "par2=Line(S2,guideLine)", "par3=Line(S3,guideLine)", "par4=Line(S4,guideLine)",
        "D1=Intersect(par1,lineAB)", "D2=Intersect(par2,lineAB)", "D3=Intersect(par3,lineAB)", "D4=Intersect(par4,lineAB)",
        "part1=Segment(A,D1)", "part2=Segment(D1,D2)", "part3=Segment(D2,D3)", "part4=Segment(D3,D4)", "part5=Segment(D4,B)"
      ],
      groups: [
        ["A", "B", "lineAB", "segAB"],
        ["R", "rayAR"],
        ["S1", "S2", "S3", "S4", "S5", "mark1", "mark2", "mark3", "mark4", "mark5"],
        ["guideLine", "guideSegment"],
        ["par1", "par2", "par3", "par4", "D1", "D2", "D3", "D4"],
        ["part1", "part2", "part3", "part4", "part5"]
      ],
      labels: ["A", "B", "S1", "S2", "S3", "S4", "S5", "D1", "D2", "D3", "D4"],
      result: ["part1", "part2", "part3", "part4", "part5"]
    },

    "perpendicolare-punto-esterno": {
      title: "Perpendicolare da un punto esterno a una retta",
      eyebrow: "Costruzione 4 · Distanza minima",
      subtitle: "Trova il piede della perpendicolare da P alla retta r usando due coppie di punti equidistanti.",
      filename: "MC-DIS-1-01_perpendicolare-punto-esterno.ggb",
      coord: [-5.8, 5.8, -4.2, 4.3],
      proofTitle: "P e Q stanno sull’asse del segmento AB",
      proofCopy: "P è alla stessa distanza da A e B perché l’arco con centro P passa per entrambi. Anche Q è alla stessa distanza da A e B. La retta che passa per due punti equidistanti da A e B è l’asse di AB, quindi è perpendicolare ad AB e alla retta r.",
      equality: "PA = PB e QA = QB ⇒ PQ ⟂ r",
      steps: [
        ["Prima di iniziare", "Osserva P fuori dalla retta", "Il punto P non sta sulla retta r. Vuoi tracciare la perpendicolare a r che passa proprio per P.", "La perpendicolare rappresenta la distanza minima tra P e la retta."],
        ["Passo 1 · Arco da P", "Interseca la retta in A e B", "Punta il compasso in P e aprilo abbastanza da tagliare la retta r in due punti distinti: A e B.", "A e B sono simmetrici rispetto alla futura perpendicolare."],
        ["Passo 2 · Arco da A", "Traccia un arco sotto la retta", "Punta il compasso in A. Con apertura maggiore di metà AB, traccia un arco dalla parte opposta rispetto a P.", "Il punto Q nascerà sotto la retta."],
        ["Passo 3 · Arco da B", "Ripeti da B con la stessa apertura", "Senza cambiare apertura, punta in B e traccia il secondo arco. I due archi si incontrano in Q.", "La stessa apertura garantisce QA = QB."],
        ["Passo 4 · Retta PQ", "Unisci P e Q", "Traccia la retta che passa per P e Q. Incontra r nel piede H della perpendicolare.", "H è il punto di r più vicino a P."]
      ],
      commands: [
        "P=(0,3)", "A=(-2.25,-1)", "B=(2.25,-1)", "Q=(0,-3.65)", "r=Line(A,B)", "segAB=Segment(A,B)",
        "tCircleP=0", "circlePEnd=Rotate(A,58.7155°*tCircleP,P)", "circleP=CircularArc(P,A,circlePEnd)",
        "tArcA=0", "arcAStart=Rotate(Q,-34°,A)", "arcAEnd=Rotate(arcAStart,68°*tArcA,A)", "arcA=CircularArc(A,arcAStart,arcAEnd)",
        "tArcB=0", "arcBStart=Rotate(Q,-34°,B)", "arcBEnd=Rotate(arcBStart,68°*tArcB,B)", "arcB=CircularArc(B,arcBStart,arcBEnd)",
        "linePQ=Line(P,Q)", "segmentPQ=Segment(P,Q)", "H=Intersect(linePQ,r)", "rightAngle=Angle(B,H,P)"
      ],
      helpers: ["tCircleP", "circlePEnd", "tArcA", "arcAStart", "arcAEnd", "tArcB", "arcBStart", "arcBEnd"],
      traceParams: { circleP: "tCircleP", arcA: "tArcA", arcB: "tArcB" },
      groups: [
        ["P", "r"],
        ["A", "B", "segAB", "circleP"],
        ["arcA"],
        ["arcB", "Q"],
        ["linePQ", "segmentPQ", "H", "rightAngle"]
      ],
      labels: ["P", "A", "B", "Q", "H"],
      result: ["linePQ", "segmentPQ", "H", "rightAngle"]
    },

    "triangolo-equilatero": {
      title: "Triangolo equilatero dato il lato",
      eyebrow: "Costruzione 5 · Tre lati uguali",
      subtitle: "Usa il compasso aperto quanto AB: il punto C nasce dall’intersezione di due archi uguali.",
      filename: "MC-DIS-1-01_triangolo-equilatero.ggb",
      coord: [-5.2, 5.2, -2.6, 5],
      proofTitle: "Tre raggi uguali formano tre lati uguali",
      proofCopy: "L’arco con centro A ha raggio AB, quindi AC = AB. L’arco con centro B ha lo stesso raggio, quindi BC = AB. I tre lati sono uguali: ABC è un triangolo equilatero.",
      equality: "AB = AC = BC",
      steps: [
        ["Prima di iniziare", "Osserva il lato AB", "Hai già il lato AB del triangolo. Devi trovare il terzo vertice C.", "Lascia spazio sopra AB: il triangolo crescerà verso l’alto."],
        ["Passo 1 · Apertura AB", "Apri il compasso quanto AB", "Prendi con il compasso la distanza tra A e B. Non cambiare più apertura.", "Questa apertura diventa il lato del triangolo."],
        ["Passo 2 · Arco da A", "Traccia il primo arco", "Punta in A e traccia un arco sopra il segmento AB.", "Ogni punto dell’arco è distante AB da A."],
        ["Passo 3 · Arco da B", "Traccia il secondo arco", "Punta in B, stessa apertura, e traccia un arco che incontri il precedente. L’intersezione è C.", "C è alla stessa distanza da A e da B."],
        ["Passo 4 · Unisci i lati", "Disegna prima AC, poi BC", "Unisci A con C, poi B con C. Il triangolo equilatero si completa un lato alla volta.", "Misura i tre lati: devono coincidere."]
      ],
      commands: [
        "A=(-3.2,-1.5)", "B=(3.2,-1.5)", "C=(0,4.0426)", "segAB=Segment(A,B)",
        "arcAStart=Rotate(C,-36°,A)", "arcAEnd=Rotate(C,36°,A)", "arcA=CircularArc(A,arcAStart,arcAEnd)",
        "arcBStart=Rotate(C,-36°,B)", "arcBEnd=Rotate(C,36°,B)", "arcB=CircularArc(B,arcBStart,arcBEnd)",
        "tSideAC=0", "SideACEnd=(x(A)+tSideAC*(x(C)-x(A)),y(A)+tSideAC*(y(C)-y(A)))", "drawAC=Segment(A,SideACEnd)",
        "tSideBC=0", "SideBCEnd=(x(B)+tSideBC*(x(C)-x(B)),y(B)+tSideBC*(y(C)-y(B)))", "drawBC=Segment(B,SideBCEnd)",
        "segAC=Segment(A,C)", "segBC=Segment(B,C)", "triABC=Polygon(A,B,C)"
      ],
      helpers: ["arcAStart", "arcAEnd", "arcBStart", "arcBEnd", "tSideAC", "SideACEnd", "tSideBC", "SideBCEnd"],
      groups: [
        ["A", "B", "segAB"],
        ["segAB"],
        ["arcA"],
        ["arcB", "C"],
        ["drawAC", "drawBC", "segAC", "segBC", "triABC"]
      ],
      labels: ["A", "B", "C"],
      result: ["segAB", "segAC", "segBC", "triABC"],
      sideDrawSequence: {
        stage: 4,
        finalAt: 0.96,
        segments: [
          { name: "drawAC", param: "tSideAC", from: 0.14, to: 0.48 },
          { name: "drawBC", param: "tSideBC", from: 0.58, to: 0.9 }
        ],
        final: ["segAC", "segBC", "triABC"]
      }
    },

    "esagono-inscritto": {
      title: "Esagono regolare inscritto in una circonferenza",
      eyebrow: "Costruzione 6 · Raggio riportato sei volte",
      subtitle: "Il raggio della circonferenza diventa il lato dell’esagono: sei passi da 60° chiudono il giro.",
      filename: "MC-DIS-1-01_esagono-inscritto.ggb",
      coord: [-4.8, 4.8, -3.8, 4.2],
      proofTitle: "Sei triangoli equilateri riempiono il cerchio",
      proofCopy: "Ogni lato dell’esagono è uguale al raggio. Collegando i vertici al centro ottieni sei triangoli equilateri: ciascuno occupa 60°, e 6 × 60° = 360°.",
      equality: "A₁A₂ = A₂A₃ = … = A₆A₁ = r",
      steps: [
        ["Prima di iniziare", "Osserva la circonferenza", "Hai una circonferenza con centro O. Vuoi inserire sei vertici tutti sulla circonferenza.", "Il compasso resta aperto quanto il raggio."],
        ["Passo 1 · Primo vertice", "Scegli A₁ sulla circonferenza", "Prendi un punto qualunque sulla circonferenza: sarà il primo vertice dell’esagono.", "Da A₁ inizierai a riportare il raggio."],
        ["Passo 2 · Secondo vertice", "Riporta il raggio da A₁", "Punta il compasso in A₁ e traccia un arco con apertura uguale al raggio. Ottieni A₂.", "Il lato A₁A₂ è lungo quanto il raggio."],
        ["Passo 3 · Ripeti", "Continua con la stessa apertura", "Da A₂ ottieni A₃, poi A₄, A₅ e A₆. Non cambiare mai apertura.", "La regolarità nasce dal ripetere sempre la stessa distanza."],
        ["Passo 4 · Unisci i vertici", "Disegna il perimetro", "Unisci A₁-A₂-A₃-A₄-A₅-A₆-A₁. L’esagono regolare è completato.", "È la geometria nascosta nella testa di molti bulloni."]
      ],
      commands: [
        "O=(0,0)", "A1=(2.6,0)", "A2=(1.3,2.2517)", "A3=(-1.3,2.2517)", "A4=(-2.6,0)", "A5=(-1.3,-2.2517)", "A6=(1.3,-2.2517)",
        "circleO=Circle(O,A1)", "radiusOA1=Segment(O,A1)",
        "c1Start=Rotate(A2,-24°,A1)", "c1End=Rotate(A2,24°,A1)", "c1=CircularArc(A1,c1Start,c1End)",
        "c2Start=Rotate(A3,-24°,A2)", "c2End=Rotate(A3,24°,A2)", "c2=CircularArc(A2,c2Start,c2End)",
        "c3Start=Rotate(A4,-24°,A3)", "c3End=Rotate(A4,24°,A3)", "c3=CircularArc(A3,c3Start,c3End)",
        "c4Start=Rotate(A5,-24°,A4)", "c4End=Rotate(A5,24°,A4)", "c4=CircularArc(A4,c4Start,c4End)",
        "c5Start=Rotate(A6,-24°,A5)", "c5End=Rotate(A6,24°,A5)", "c5=CircularArc(A5,c5Start,c5End)",
        "hex=Polygon(A1,A2,A3,A4,A5,A6)", "s12=Segment(A1,A2)", "s23=Segment(A2,A3)", "s34=Segment(A3,A4)", "s45=Segment(A4,A5)", "s56=Segment(A5,A6)", "s61=Segment(A6,A1)"
      ],
      helpers: ["c1Start", "c1End", "c2Start", "c2End", "c3Start", "c3End", "c4Start", "c4End", "c5Start", "c5End"],
      groups: [
        ["O", "circleO", "radiusOA1"],
        ["A1"],
        ["c1", "A2", "s12"],
        ["c2", "c3", "c4", "c5", "A3", "A4", "A5", "A6", "s23", "s34", "s45", "s56"],
        ["hex", "s61"]
      ],
      labels: ["O", "A1", "A2", "A3", "A4", "A5", "A6"],
      result: ["hex", "s12", "s23", "s34", "s45", "s56", "s61"]
    },

    "quadrato-dato-lato": {
      title: "Quadrato dato il lato",
      eyebrow: "Costruzione 7 · Perpendicolari e lati uguali",
      subtitle: "Costruisci due perpendicolari ad AB e riporta la stessa lunghezza per ottenere C e D.",
      filename: "MC-DIS-1-01_quadrato-dato-lato.ggb",
      coord: [-5.4, 5.4, -3, 4.8],
      proofTitle: "Quattro lati uguali e quattro angoli retti",
      proofCopy: "AD e BC sono perpendicolari ad AB, quindi gli angoli alla base sono retti. Riportando AB sulle due perpendicolari ottieni AD = BC = AB. Il segmento DC chiude la figura: ABCD è un quadrato.",
      equality: "AB = BC = CD = DA e angoli retti",
      steps: [
        ["Prima di iniziare", "Osserva il lato AB", "AB è il lato di partenza del quadrato. Il resto della figura deve crescere sopra il segmento.", "Il quadrato richiede lati uguali e angoli retti."],
        ["Passo 1 · Perpendicolare in A", "Traccia la perpendicolare ad AB in A", "Usa la squadra o la costruzione della perpendicolare per ottenere una direzione a 90° in A.", "Qui nascerà il lato AD."],
        ["Passo 2 · Arco da A", "Riporta la misura AB", "Punta il compasso in A, aprilo quanto AB e traccia un arco sulla perpendicolare.", "L’arco serve a trovare un punto distante da A quanto B."],
        ["Passo 3 · Punto D", "Segna D sulla perpendicolare", "Il punto in cui l’arco incontra la perpendicolare si chiama D. Ora AD = AB.", "Hai costruito il primo lato verticale del quadrato."],
        ["Passo 4 · Perpendicolare in B", "Traccia la seconda perpendicolare", "Da B traccia una retta perpendicolare ad AB, parallela alla perpendicolare passante per A.", "Qui nascerà il lato BC."],
        ["Passo 5 · Arco da B", "Riporta la stessa misura", "Senza cambiare apertura, punta il compasso in B e traccia un arco sulla seconda perpendicolare.", "La stessa apertura garantisce BC = AB."],
        ["Passo 6 · Punto C", "Segna C sulla perpendicolare", "Il punto in cui l’arco incontra la perpendicolare si chiama C. Ora BC = AB.", "I punti C e D stanno alla stessa altezza."],
        ["Passo 7 · Chiudi il quadrato", "Unisci D con C", "Disegna il lato DC. Il quadrato ABCD è completato: quattro lati uguali e quattro angoli retti.", "Il risultato finale viene ripassato in nero."]
      ],
      commands: [
        "A=(-2.7,-1.8)", "B=(2.1,-1.8)", "D=(-2.7,3)", "C=(2.1,3)", "segAB=Segment(A,B)", "perpA=Line(A,D)",
        "tCircleA=0", "circleAEnd=Rotate(B,90°*tCircleA,A)", "circleA=CircularArc(A,B,circleAEnd)", "segAD=Segment(A,D)",
        "perpB=Line(B,C)", "tCircleB=0", "circleBEnd=Rotate(A,-90°*tCircleB,B)", "circleB=CircularArc(B,A,circleBEnd)",
        "segBC=Segment(B,C)", "tSideDC=0", "SideDCEnd=(x(D)+tSideDC*(x(C)-x(D)),y(D)+tSideDC*(y(C)-y(D)))", "drawDC=Segment(D,SideDCEnd)",
        "segDC=Segment(D,C)", "squareABCD=Polygon(A,B,C,D)", "diagAC=Segment(A,C)", "diagBD=Segment(B,D)"
      ],
      helpers: ["tCircleA", "circleAEnd", "tCircleB", "circleBEnd", "tSideDC", "SideDCEnd"],
      traceParams: { circleA: "tCircleA", circleB: "tCircleB" },
      groups: [
        ["A", "B", "segAB"],
        ["perpA"],
        ["circleA"],
        ["D", "segAD"],
        ["perpB"],
        ["circleB"],
        ["C", "segBC"],
        ["drawDC", "segDC", "squareABCD", "diagAC", "diagBD"]
      ],
      labels: ["A", "B", "C", "D"],
      result: ["segAB", "segAD", "segBC", "segDC", "squareABCD"],
      sideDrawSequence: {
        stage: 7,
        finalAt: 0.96,
        segments: [
          { name: "drawDC", param: "tSideDC", from: 0.14, to: 0.9 }
        ],
        final: ["segDC", "squareABCD"]
      }
    },

    "pentagono-inscritto": {
      title: "Pentagono regolare inscritto in una circonferenza",
      eyebrow: "Costruzione 8 · Sezione aurea",
      subtitle: "Trova la lunghezza del lato con il punto medio del raggio e riportala sulla circonferenza.",
      filename: "MC-DIS-1-01_pentagono-inscritto.ggb",
      coord: [-4.7, 4.9, -3.7, 4.7],
      proofTitle: "La lunghezza TN è il lato del pentagono",
      proofCopy: "Il punto M è il punto medio del raggio OB. L’arco con centro M e raggio MT individua sul diametro il punto N. La distanza TN corrisponde al lato del pentagono regolare inscritto nella circonferenza.",
      equality: "TN = lato del pentagono regolare",
      steps: [
        ["Prima di iniziare", "Osserva la circonferenza", "Hai una circonferenza con centro O. Vuoi costruire cinque vertici equidistanti sulla circonferenza.", "Questa costruzione usa una misura speciale legata alla sezione aurea."],
        ["Passo 1 · Diametri e punto M", "Traccia i diametri e trova M", "Disegna il diametro orizzontale AB e quello verticale. M è il punto medio del raggio OB.", "M divide OB in due parti uguali."],
        ["Passo 2 · Arco da M", "Apri il compasso fino a T", "Punta in M, apri fino al punto superiore T e traccia un arco verso il diametro.", "L’arco intercetta il diametro in N."],
        ["Passo 3 · Lato TN", "Leggi la lunghezza del lato", "Il segmento TN è la misura da riportare sulla circonferenza per costruire il pentagono.", "Questa è la parte più delicata della costruzione."],
        ["Passo 4 · Riporta il lato", "Marca i cinque vertici", "Riporta la lunghezza TN intorno alla circonferenza fino a ottenere i cinque vertici.", "Ogni lato del pentagono avrà la stessa lunghezza."],
        ["Passo 5 · Unisci i vertici", "Disegna il pentagono", "Unisci i cinque vertici con il righello. Il pentagono regolare è completato.", "Controlla: tutti i vertici stanno sulla circonferenza."]
      ],
      commands: [
        "O=(0,0)", "A=(-2.8,0)", "B=(2.8,0)", "T=(0,2.8)", "M=(1.4,0)", "N=(-1.7305,0)", "P2=(-2.6629,0.8652)", "P3=(-1.6458,-2.2652)", "P4=(1.6458,-2.2652)", "P5=(2.6629,0.8652)",
        "circleO=Circle(O,B)", "diamAB=Segment(A,B)", "diamVT=Segment((0,-2.8),T)", "segOM=Segment(O,M)",
        "circleMStart=Rotate(N,-38°,M)", "circleMEnd=Rotate(N,38°,M)", "circleM=CircularArc(M,circleMStart,circleMEnd)",
        "segTN=Segment(T,N)", "polyPent=Polygon(T,P2,P3,P4,P5)", "side1=Segment(T,P2)", "side2=Segment(P2,P3)", "side3=Segment(P3,P4)", "side4=Segment(P4,P5)", "side5=Segment(P5,T)"
      ],
      helpers: ["circleMStart", "circleMEnd"],
      groups: [
        ["O", "circleO", "A", "B", "T"],
        ["diamAB", "diamVT", "M", "segOM"],
        ["circleM", "N"],
        ["segTN"],
        ["P2", "P3", "P4", "P5", "side1", "side2", "side3", "side4", "side5"],
        ["polyPent"]
      ],
      labels: ["O", "A", "B", "T", "M", "N", "P2", "P3", "P4", "P5"],
      result: ["polyPent", "side1", "side2", "side3", "side4", "side5"]
    }
  };

  let api = null;
  let currentStep = 0;
  let currentProgress = 1;
  let isPlaying = false;
  let animationToken = 0;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const activityKey = new URLSearchParams(window.location.search).get("activity") || "divisione-segmento";
  const activity = ACTIVITIES[activityKey] || ACTIVITIES["divisione-segmento"];
  const APPLET_ASPECT_RATIO = 850 / 520;

  const elements = {
    title: document.getElementById("activity-title"),
    eyebrow: document.getElementById("activity-eyebrow"),
    subtitle: document.getElementById("activity-subtitle"),
    loading: document.getElementById("loading-state"),
    stepNav: document.getElementById("step-nav"),
    stepKicker: document.getElementById("step-kicker"),
    stepTitle: document.getElementById("step-title"),
    stepDescription: document.getElementById("step-description"),
    stepEquality: document.getElementById("step-equality"),
    stepTip: document.getElementById("step-tip"),
    first: document.getElementById("first-button"),
    previous: document.getElementById("previous-button"),
    next: document.getElementById("next-button"),
    last: document.getElementById("last-button"),
    play: document.getElementById("play-button"),
    playIcon: document.querySelector(".play-icon"),
    playLabel: document.querySelector(".play-label"),
    stepCounter: document.getElementById("step-counter"),
    speed: document.getElementById("animation-speed"),
    protocolToggle: document.getElementById("protocol-toggle-button"),
    protocolSteps: document.getElementById("protocol-steps"),
    proofPanel: document.getElementById("proof-panel"),
    proofTitle: document.getElementById("proof-title"),
    proofCopy: document.getElementById("proof-copy"),
    reset: document.getElementById("reset-button"),
    download: document.getElementById("download-button"),
  };

  function allObjects() {
    return Array.from(new Set([...(activity.helpers || []), ...activity.groups.flat()]));
  }

  function exists(name) {
    return api && api.exists(name);
  }

  function setVisible(names, visible) {
    names.forEach((name) => {
      if (exists(name)) api.setVisible(name, visible);
    });
  }

  function buildNav() {
    elements.stepNav.innerHTML = "";
    elements.protocolSteps.innerHTML = "";
    activity.steps.forEach((step, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.step = String(index);
      button.disabled = true;
      button.innerHTML = `<span>${index}</span>${step[0].replace(/^Prima di iniziare$/, "Situazione")}`;
      button.addEventListener("click", () => goToStep(index, true));
      elements.stepNav.appendChild(button);

      const item = document.createElement("li");
      item.textContent = `${index + 1}. ${step[0]}`;
      elements.protocolSteps.appendChild(item);
    });
  }

  function styleObjects() {
    api.setAxesVisible(false, false);
    api.setGridVisible(false);
    setEqualScaleCoordSystem(activity.coord);
    api.setErrorDialogsActive(false);

    allObjects().forEach((name) => {
      if (!exists(name)) return;
      api.setFixed(name, true, false);
      if (/^line|^perp|^par|guideLine|ray|diam/.test(name)) {
        api.setLineThickness(name, 3);
        api.setColor(name, 14, 116, 144);
      }
      if (isCompassObject(name)) {
        api.setLineStyle(name, 0);
        api.setLineThickness(name, 5);
        api.setColor(name, 217, 119, 6);
      }
      if (/seg|side|part|s\d|mark|rad|diag/.test(name)) {
        api.setLineThickness(name, 4);
        api.setColor(name, 30, 64, 175);
      }
      if (/^draw/.test(name)) {
        api.setLineThickness(name, 6);
        api.setColor(name, 0, 0, 0);
      }
      if (/poly|tri|hex|square/.test(name)) {
        api.setColor(name, 96, 165, 250);
        api.setFilling(name, 0.18);
      }
      if (/rightAngle/.test(name)) {
        api.setColor(name, 22, 163, 74);
      }
    });

    activity.result.forEach((name) => {
      if (exists(name)) {
        api.setColor(name, 0, 0, 0);
        api.setLineStyle(name, 0);
        api.setLineThickness(name, 6);
        if (/poly|tri|hex|square/.test(name)) api.setFilling(name, 0.05);
      }
    });

    activity.labels.forEach((name) => {
      if (!exists(name)) return;
      api.setLabelVisible(name, true);
      api.setLabelStyle(name, 3);
      api.setPointSize(name, 5);
      api.setColor(name, 239, 68, 68);
    });
  }

  function setEqualScaleCoordSystem(bounds) {
    const [xMin, xMax, yMin, yMax] = bounds;
    const xCenter = (xMin + xMax) / 2;
    const yCenter = (yMin + yMax) / 2;
    let xRange = xMax - xMin;
    let yRange = yMax - yMin;
    const currentRatio = xRange / yRange;

    if (currentRatio < APPLET_ASPECT_RATIO) {
      xRange = yRange * APPLET_ASPECT_RATIO;
    } else {
      yRange = xRange / APPLET_ASPECT_RATIO;
    }

    api.setCoordSystem(
      xCenter - xRange / 2,
      xCenter + xRange / 2,
      yCenter - yRange / 2,
      yCenter + yRange / 2
    );
  }

  function buildConstruction(ggbApi) {
    api = ggbApi;
    api.setPerspective("G");
    activity.commands.forEach((command) => api.evalCommand(command));

    const missing = allObjects().filter((name) => !exists(name));
    if (missing.length > 0) {
      showError(`Non riesco a creare alcuni oggetti GeoGebra: ${missing.join(", ")}.`);
      return;
    }

    styleObjects();
    setVisible(allObjects(), false);
    elements.loading.hidden = true;
    setControlsEnabled(true);
    applyStage(0, 1);
  }

  function setControlsEnabled(enabled) {
    Array.from(elements.stepNav.querySelectorAll("button")).forEach((button) => { button.disabled = !enabled; });
    elements.play.disabled = !enabled;
    elements.reset.disabled = !enabled;
    elements.download.disabled = !enabled;
    elements.protocolToggle.disabled = !enabled;
    elements.first.disabled = !enabled || currentStep === 0;
    elements.previous.disabled = !enabled || currentStep === 0;
    elements.next.disabled = !enabled || currentStep === activity.steps.length - 1;
    elements.last.disabled = !enabled || currentStep === activity.steps.length - 1;
  }

  function applyStage(stage, progress) {
    if (!api) return;
    currentStep = stage;
    currentProgress = progress;
    api.setRepaintingActive(false);
    setVisible(allObjects(), false);
    activity.groups.forEach((group, index) => {
      const visible = index < stage || (index === stage && progress >= 0.12);
      setVisible(group, visible);
    });
    applyCompassTraceEffect(stage, progress);
    applyStepBuildSequence(stage, progress);
    applySideDrawSequence(stage, progress);
    const resultRevealAt = activity.sideDrawSequence && stage === activity.sideDrawSequence.stage
      ? activity.sideDrawSequence.finalAt
      : 0.95;
    if (stage === activity.steps.length - 1 && progress >= resultRevealAt) setVisible(activity.result, true);
    api.setRepaintingActive(true);
    api.refreshViews();
    updateInterface();
  }

  function applyStepBuildSequence(stage, progress) {
    const sequence = activity.stepBuildSequence;
    if (!sequence || stage !== sequence.stage) return;

    sequence.items.forEach(({ name, at }) => {
      if (exists(name)) api.setVisible(name, progress >= at);
    });
  }

  function applySideDrawSequence(stage, progress) {
    const sequence = activity.sideDrawSequence;
    if (!sequence || stage !== sequence.stage) return;

    sequence.segments.forEach(({ name, param, from, to }) => {
      const span = Math.max(0.001, to - from);
      const value = Math.max(0, Math.min(1, (progress - from) / span));
      if (exists(param)) api.setValue(param, value);
      if (exists(name)) api.setVisible(name, value > 0 && progress < sequence.finalAt);
    });

    (sequence.final || []).forEach((name) => {
      if (exists(name)) api.setVisible(name, progress >= sequence.finalAt);
    });
  }

  function applyCompassTraceEffect(stage, progress) {
    activity.groups.forEach((group, index) => {
      group.forEach((name) => {
        if (!isCompassObject(name) || !exists(name)) return;

        if (index < stage) {
          setTraceParam(name, 1);
          api.setVisible(name, true);
          api.setLineThickness(name, 5);
          return;
        }

        if (index === stage) {
          const traceProgress = Math.max(0, Math.min(1, (progress - 0.12) / 0.88));
          setTraceParam(name, traceProgress);
          api.setVisible(name, traceProgress > 0);
          api.setLineThickness(name, Math.max(2, Math.round(2 + traceProgress * 3)));
        } else {
          setTraceParam(name, 0);
        }
      });
    });
  }

  function setTraceParam(name, value) {
    const param = activity.traceParams && activity.traceParams[name];
    if (param && exists(param)) api.setValue(param, value);
  }

  function isCompassObject(name) {
    return /^(circle|arc|c[1-5])/.test(name);
  }

  function updateInterface() {
    const step = activity.steps[currentStep];
    elements.stepKicker.textContent = step[0];
    elements.stepTitle.textContent = step[1];
    elements.stepDescription.textContent = step[2];
    elements.stepTip.innerHTML = `<span aria-hidden="true">🎯</span>${step[3]}`;
    elements.stepEquality.textContent = currentStep === activity.steps.length - 1 ? activity.equality : "";
    elements.stepEquality.hidden = currentStep !== activity.steps.length - 1;
    elements.stepCounter.textContent = `${currentStep + 1} / ${activity.steps.length}`;

    Array.from(elements.stepNav.querySelectorAll("button")).forEach((button, index) => {
      const isActive = index === currentStep;
      button.classList.toggle("is-active", isActive);
      button.classList.toggle("is-complete", index < currentStep);
      if (isActive) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });

    Array.from(elements.protocolSteps.children).forEach((item, index) => {
      item.classList.toggle("is-active", index === currentStep);
      item.classList.toggle("is-complete", index < currentStep);
    });

    elements.first.disabled = !api || isPlaying || currentStep === 0;
    elements.previous.disabled = !api || isPlaying || currentStep === 0;
    elements.next.disabled = !api || isPlaying || currentStep === activity.steps.length - 1;
    elements.last.disabled = !api || isPlaying || currentStep === activity.steps.length - 1;
    elements.playIcon.textContent = isPlaying ? "■" : "▶";
    elements.playLabel.textContent = isPlaying ? "Stop" : "Avvia";
    elements.proofPanel.hidden = !(currentStep === activity.steps.length - 1 && currentProgress >= 0.95);
  }

  function getAnimationDuration() {
    const seconds = Number(elements.speed.value);
    const safeSeconds = Number.isFinite(seconds) ? Math.min(4, Math.max(0.5, seconds)) : 1.5;
    return safeSeconds * 1000;
  }

  function animateStep(step, token) {
    if (reduceMotion) {
      applyStage(step, 1);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const startedAt = performance.now();
      const duration = getAnimationDuration();

      function frame(now) {
        if (token !== animationToken) {
          resolve();
          return;
        }
        const linear = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - linear, 3);
        applyStage(step, eased);
        if (linear < 1) requestAnimationFrame(frame);
        else resolve();
      }

      requestAnimationFrame(frame);
    });
  }

  function delay(ms, token) {
    return new Promise((resolve) => window.setTimeout(() => resolve(token === animationToken), ms));
  }

  function goToStep(step, animate) {
    if (!api || isPlaying || step < 0 || step >= activity.steps.length) return;
    const token = ++animationToken;
    if (animate) animateStep(step, token);
    else applyStage(step, 1);
  }

  async function playAll() {
    if (!api) return;
    if (isPlaying) {
      animationToken += 1;
      isPlaying = false;
      updateInterface();
      return;
    }

    isPlaying = true;
    const token = ++animationToken;
    applyStage(0, 1);
    await delay(reduceMotion ? 60 : 280, token);
    for (let step = 1; step < activity.steps.length; step += 1) {
      if (token !== animationToken) break;
      await animateStep(step, token);
      if (token !== animationToken) break;
      await delay(reduceMotion ? 80 : 360, token);
    }

    if (token === animationToken) {
      isPlaying = false;
      updateInterface();
    }
  }

  function toggleProtocolList() {
    const willOpen = elements.protocolSteps.hidden;
    elements.protocolSteps.hidden = !willOpen;
    elements.protocolToggle.setAttribute("aria-expanded", String(willOpen));
  }

  function downloadGgb() {
    if (!api) return;
    api.getBase64((base64) => {
      const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/vnd.geogebra.file" });
      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement("a"), { href: url, download: activity.filename });
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }

  function showError(message) {
    elements.loading.classList.add("is-error");
    elements.loading.textContent = message;
    setControlsEnabled(false);
  }

  function attachEvents() {
    elements.first.addEventListener("click", () => goToStep(0, false));
    elements.previous.addEventListener("click", () => goToStep(currentStep - 1, false));
    elements.next.addEventListener("click", () => goToStep(currentStep + 1, true));
    elements.last.addEventListener("click", () => goToStep(activity.steps.length - 1, true));
    elements.play.addEventListener("click", playAll);
    elements.protocolToggle.addEventListener("click", toggleProtocolList);
    elements.reset.addEventListener("click", () => goToStep(0, false));
    elements.download.addEventListener("click", downloadGgb);
  }

  function init() {
    document.title = `${activity.title} — GeoGebra`;
    elements.title.textContent = activity.title;
    elements.eyebrow.textContent = activity.eyebrow;
    elements.subtitle.textContent = activity.subtitle;
    elements.proofTitle.textContent = activity.proofTitle;
    elements.proofCopy.textContent = activity.proofCopy;
    buildNav();
    attachEvents();
    updateInterface();

    if (typeof GGBApplet === "undefined") {
      showError("GeoGebra non è disponibile. Controlla la connessione a Internet oppure consenti il caricamento da geogebra.org.");
      return;
    }

    const applet = new GGBApplet({
      id: `baseConstruction_${activityKey.replace(/[^a-z0-9]/gi, "_")}`,
      appName: "geometry",
      width: 850,
      height: 520,
      appletOnLoad: buildConstruction,
      showToolBar: false,
      showMenuBar: false,
      showAlgebraInput: false,
      showAnimationButton: true,
      showZoomButtons: true,
      showFullscreenButton: true,
      enableRightClick: false,
      enableLabelDrags: false,
      enableShiftDragZoom: true,
      enableUndoRedo: false,
      enableFileFeatures: false,
      errorDialogsActive: false,
      language: "it",
      perspective: "G",
      preventFocus: true,
      scaleContainerClass: "ggb-frame",
      autoHeight: true,
      allowUpscale: false,
      borderColor: "#dbe3ec",
      borderRadius: 14,
    }, true);

    applet.inject("ggb-element");
  }

  window.addEventListener("DOMContentLoaded", init);
})();
