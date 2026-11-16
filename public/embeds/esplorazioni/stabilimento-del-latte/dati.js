/*
 * Contenuti dell'esplorazione. Il motore (index.html) legge solo questo file.
 *
 * Ogni nodo è una scena:
 *   titolo, testo   → quello che compare nel pannello
 *   img, alt        → immagine della scena (16:9) e descrizione per chi non la vede
 *   fuoco: [x, y]   → punto tenuto al centro quando l'immagine viene ritagliata (schermi verticali)
 *   fasi: [..]      → a che punto della filiera si è (indici di catena.fasi)
 *   punti: [..]     → punti cliccabili: { x, y, etichetta, vai: "id-del-nodo" }
 *   note:  [..]     → parti della scena senza una scena propria: { x, y, etichetta, testo }
 *                         toccando l'etichetta, il testo (una o due frasi) prende il posto di quello della scena
 * Le coordinate x, y sono percentuali dell'immagine, da sinistra e dall'alto.
 */
window.ESPLORAZIONE = {
  id: "stabilimento-del-latte",
  indirizzo: "https://book.proftecnologia.it/embeds/esplorazioni/stabilimento-del-latte/",   // indirizzo pubblico: serve al pulsante «Condividi» e al QR code
  lingua: "it",
  radice: "stabilimento",
  laboratorio: { mc: "MC-ALI-2-02", titolo: "Laboratorio della conservazione" },
  catena: { etichetta: "Filiera", fasi: ["crudo", "trattato", "confezionato", "catena del freddo"] },
  nodi: {
    stabilimento: {
      titolo: "Lo stabilimento del latte",
      testo: "In uno stabilimento del latte, detto anche centrale del latte, il latte crudo che arriva dalle stalle, in poco tempo, diventa latte pronto da bere. Viene controllato, scaldato per eliminare i microbi pericolosi, reso omogeneo e chiuso nelle confezioni: scorre sempre dentro tubi e macchine d'acciaio, senza che nessuno lo tocchi. Poi parte, al freddo, verso i negozi. Tocca i punti e segui il viaggio dalla stalla al frigorifero di casa.",
      img: "img/stabilimento.webp",
      alt: "L'interno di uno stabilimento del latte visto da una passerella: a sinistra un'autocisterna oltre una grande porta, alti silos d'acciaio, al centro il pastorizzatore a piastre, poi l'omogeneizzatore e a destra una riempitrice con confezioni bianche e la porta di una cella frigorifera.",
      fuoco: [50, 48],
      fasi: [0, 1, 2],
      punti: [
        { x: 5, y: 40, etichetta: "Ricevimento", vai: "ricevimento", lato: "sx" },
        { x: 45, y: 50, etichetta: "Pastorizzatore", vai: "pastorizzatore" },
        { x: 67, y: 55, etichetta: "Omogeneizzatore", vai: "omogeneizzatore" },
        { x: 80, y: 46, etichetta: "Confezionamento", vai: "confezionamento" },
        { x: 94, y: 40, etichetta: "Cella frigorifera", vai: "cella", lato: "dx" }
      ],
      note: [
        { x: 30, y: 28, etichetta: "Silos", testo: "Grandi serbatoi d'acciaio isolati: tengono freddo il latte crudo finché non viene lavorato." }
      ]
    },
    ricevimento: {
      titolo: "Il ricevimento",
      testo: "Il latte arriva con le autocisterne, camion con una cisterna d'acciaio isolata che lo tiene al freddo. Prima di scaricarlo si preleva un campione: se il controllo trova residui di antibiotici, tutto il carico viene scartato. Se va bene, una pompa spinge il latte nei silos dello stabilimento, e un contatore misura quanto ne è arrivato.",
      img: "img/ricevimento.webp",
      alt: "Il retro di un'autocisterna d'acciaio lucido in una baia di scarico: un grosso tubo flessibile bianco va dalla valvola posteriore a una pompa sul pavimento; a destra, su un tavolino d'acciaio, una borsa frigo con piccoli flaconi di latte per i campioni.",
      fuoco: [55, 45],
      fasi: [0],
      punti: [
        { x: 37, y: 18, etichetta: "La stalla", vai: "stalla" },
        { x: 90, y: 48, etichetta: "Il laboratorio", vai: "laboratorio" }
      ],
      note: [
        { x: 39, y: 52, etichetta: "Tubo", verso: "giu", testo: "Di gomma adatta agli alimenti: dopo ogni scarico si lava e si disinfetta." }
      ]
    },
    stalla: {
      titolo: "La stalla",
      testo: "Tutto comincia nella stalla. Di solito le mucche si mungono due volte al giorno, con mungitrici che aspirano il latte con delicatezza. Il latte appena munto è a circa 37 gradi, quasi la temperatura del corpo della mucca: è perfetta anche per i batteri. Per questo finisce subito in un grande serbatoio refrigerato, che lo raffredda a pochi gradi sopra lo zero e lo tiene così finché non arriva l'autocisterna.",
      img: "img/stalla.webp",
      alt: "Una stalla moderna e pulita: a sinistra mucche bianche e nere che mangiano il fieno; a destra, oltre una porta aperta, la sala del latte con un grande serbatoio d'acciaio refrigerato e i gruppi di mungitura appesi alla parete.",
      fuoco: [60, 45],
      fasi: [0],
      note: [
        { x: 20, y: 50, etichetta: "Mucche frisone", lato: "sx", testo: "La razza bianca e nera più diffusa nelle stalle italiane. Una mucca può dare anche più di 30 litri di latte al giorno." },
        { x: 63, y: 38, etichetta: "Serbatoio refrigerato", testo: "Raffredda il latte e lo mescola piano, perché resti freddo tutto allo stesso modo." },
        { x: 87, y: 47, etichetta: "Gruppi di mungitura", testo: "Quattro tazze, una per capezzolo: aspirano il latte con un movimento ritmico che imita la poppata del vitello." }
      ]
    },
    laboratorio: {
      titolo: "Il laboratorio",
      testo: "Nel laboratorio dello stabilimento il latte viene analizzato. Si controlla quanto grasso e quante proteine contiene, se ci sono residui di antibiotici e quanti batteri ci sono. Per contare i batteri si mescola un po' di latte, diluito con acqua sterile, con del nutrimento in una piastra, che si tiene al caldo nell'incubatore per un paio di giorni: ogni batterio si moltiplica fino a formare una macchiolina visibile a occhio nudo, una colonia.",
      img: "img/laboratorio.webp",
      alt: "Un piccolo laboratorio di controllo: su un bancone bianco una rastrelliera di provette di latte, un incubatore da banco, un microscopio e due piastre con colonie di batteri color crema.",
      fuoco: [55, 50],
      fasi: [0],
      punti: [
        { x: 73, y: 42, etichetta: "I batteri del latte", vai: "batteri" }
      ],
      note: [
        { x: 57, y: 79, etichetta: "Colonie", verso: "giu", testo: "Ogni macchiolina è una colonia: milioni di batteri nati da uno solo." },
        { x: 50, y: 42, etichetta: "Incubatore", testo: "Tiene le piastre al caldo, intorno ai 30 gradi, perché i batteri crescano e si possano contare." }
      ]
    },
    batteri: {
      titolo: "I batteri del latte",
      testo: "È un'illustrazione, disegnata come si vedrebbe al microscopio. Ecco una goccia di latte crudo, ingrandita più di mille volte. Le palline bianche sono goccioline di grasso; tra loro ci sono i batteri, alcuni utili, come i batteri lattici, parenti di quelli dello yogurt, altri dannosi. Al caldo certi batteri si dividono in due ogni 20 minuti circa: in meno di sette ore, da uno solo, ne nascono più di un milione. Il freddo li rallenta; il calore giusto uccide quelli pericolosi.",
      img: "img/batteri.webp",
      alt: "Illustrazione come al microscopio: tante palline bianche di grasso di misure diverse in un liquido azzurrino, e tra loro piccoli batteri a bastoncino e a catenella, alcuni che si dividono in due.",
      fuoco: [50, 50],
      fasi: [0],
      note: [
        { x: 45, y: 49, etichetta: "Batterio che si divide", testo: "Si allunga e si divide in due cellule uguali: è così che i batteri si moltiplicano." },
        { x: 53, y: 34, etichetta: "Catenelle", testo: "Alcuni batteri, dopo essersi divisi, restano attaccati e formano catenelle. Lo fanno molti batteri lattici, quelli dello yogurt." },
        { x: 77, y: 22, etichetta: "Goccioline di grasso", verso: "giu", testo: "Sono molto più grandi dei batteri, e di tante misure diverse." }
      ]
    },
    pastorizzatore: {
      titolo: "Il pastorizzatore",
      testo: "Il pastorizzatore è il cuore dello stabilimento. Il latte scorre in canali sottili tra piastre d'acciaio e viene scaldato ad almeno 72 gradi; resta a quella temperatura per almeno 15 secondi, mentre attraversa un tubo detto tubo di sosta, e subito dopo viene raffreddato. Così muoiono i microbi pericolosi, ma il sapore del latte cambia pochissimo. È la pastorizzazione: prende il nome dallo scienziato francese Louis Pasteur.",
      img: "img/pastorizzatore.webp",
      alt: "Un pastorizzatore a piastre: un robusto telaio d'acciaio con lunghi tiranti stringe un pacco di piastre sottili e ondulate; tubi isolati in alto e in basso, un termometro a quadrante e, a destra, un tubo d'acciaio avvolto a spirale.",
      fuoco: [50, 45],
      fasi: [1],
      punti: [
        { x: 26, y: 45, etichetta: "Le piastre", vai: "piastre" }
      ],
      note: [
        { x: 87, y: 45, etichetta: "Tubo di sosta", testo: "È lungo quanto serve perché il latte, scorrendo, ci resti 15 secondi." },
        { x: 69, y: 8, etichetta: "Termometro", testo: "Se la temperatura scende sotto quella giusta, una valvola rimanda indietro il latte, che ripassa tra le piastre." }
      ]
    },
    piastre: {
      titolo: "Le piastre",
      testo: "Ecco il pacco di piastre da vicino. Ogni piastra è un foglio sottile d'acciaio inox, ondulato a spina di pesce, con una guarnizione di gomma tutta intorno. Strette l'una contro l'altra, le piastre formano tanti canali sottilissimi. In un canale scorre il latte, in quello accanto un liquido più caldo o più freddo: le piastre separano i due liquidi, ma lasciano passare il calore.",
      img: "img/piastre.webp",
      alt: "Uno scambiatore a piastre visto da vicino: in primo piano una piastra d'acciaio con un disegno a spina di pesce, una guarnizione nera lungo il bordo e quattro fori agli angoli; dietro, il pacco delle altre piastre stretto nel telaio; in basso, una cassetta di attrezzi.",
      fuoco: [50, 45],
      fasi: [1],
      punti: [
        { x: 72, y: 40, etichetta: "Lo scambio di calore", vai: "scambio" }
      ],
      note: [
        { x: 27, y: 42, etichetta: "Guarnizione", testo: "Chiude i canali, perché il latte e l'altro liquido non si mescolino mai." },
        { x: 49, y: 24, etichetta: "Fori", testo: "Dai quattro fori agli angoli entrano ed escono i due liquidi." }
      ]
    },
    scambio: {
      titolo: "Lo scambio di calore",
      testo: "È un'illustrazione: dentro il pastorizzatore chiuso nessuno può guardare. Il calore passa sempre dal corpo più caldo a quello più freddo. Tra le piastre, il latte e l'acqua calda scorrono in direzioni opposte: così il latte incontra acqua sempre più calda e si scalda per tutto il percorso. Nella prima parte del pastorizzatore, poi, il latte già pastorizzato e ancora caldo cede il suo calore al latte freddo che entra: così si recupera più del 90% del calore.",
      img: "img/scambio.webp",
      alt: "Illustrazione in sezione di alcune piastre ondulate affiancate: nei canali tra una piastra e l'altra si alternano acqua calda arancione e latte bianco, che scorrono in direzioni opposte; un bagliore mostra il calore che attraversa il metallo.",
      fuoco: [50, 50],
      fasi: [1],
      note: [
        { x: 37, y: 40, etichetta: "Acqua calda", testo: "Cede calore al latte attraverso la piastra, senza mai toccarlo." },
        { x: 46, y: 55, etichetta: "Latte", testo: "Scorre in un velo sottile: così si scalda tutto in pochi istanti." },
        { x: 54, y: 30, etichetta: "Piastra", verso: "giu", testo: "Sottile, perché il calore la attraversi in fretta. Le ondulazioni rimescolano il liquido mentre scorre." }
      ]
    },
    omogeneizzatore: {
      titolo: "L'omogeneizzatore",
      testo: "Il latte appena munto, lasciato fermo, fa la panna: le gocce di grasso, più leggere, salgono in superficie. Per evitarlo, l'omogeneizzatore spinge il latte con pistoni potentissimi attraverso una fessura strettissima, a una pressione decine di volte più alta di quella di una gomma della bicicletta. Le gocce di grasso si rompono in goccioline così piccole che restano sparse nel latte. Lavora sul latte già caldo: il latte esce dal pastorizzatore a metà percorso, passa qui e poi rientra.",
      img: "img/omogeneizzatore.webp",
      alt: "Un omogeneizzatore industriale: una grande macchina d'acciaio con tre teste di pistoni orizzontali sul davanti, un grosso motore dietro, due manometri rotondi in alto e tubi che entrano ed escono.",
      fuoco: [50, 50],
      fasi: [1],
      punti: [
        { x: 70, y: 52, etichetta: "Le gocce di grasso", vai: "globuli" }
      ],
      note: [
        { x: 46, y: 56, etichetta: "Pistoni", testo: "Spingono il latte a colpi rapidissimi, uno dopo l'altro, perché il flusso resti regolare." },
        { x: 46, y: 24, etichetta: "Manometri", testo: "Indicano la pressione: chi controlla la macchina la regola su questi quadranti." }
      ]
    },
    globuli: {
      titolo: "Le gocce di grasso",
      testo: "È un'illustrazione, disegnata come si vedrebbe al microscopio. A sinistra il latte com'è appena munto: le gocce di grasso hanno misure diverse, alcune larghe qualche millesimo di millimetro, e piano piano salgono a galla. A destra il latte omogeneizzato: le goccioline sono piccolissime, meno di un millesimo di millimetro, e restano sparse. Il latte è bianco proprio perché queste goccioline, e le proteine, deviano la luce in tutte le direzioni.",
      img: "img/globuli.webp",
      alt: "Illustrazione come al microscopio, divisa in due metà: a sinistra grandi gocce bianche di grasso, irregolari, che si raccolgono in alto; a destra tantissime goccioline minuscole, sparse in modo uniforme.",
      fuoco: [50, 50],
      fasi: [1],
      note: [
        { x: 25, y: 20, etichetta: "Panna che affiora", lato: "sx", testo: "Le gocce grandi salgono e si raggruppano: è lo strato di panna del latte non omogeneizzato." },
        { x: 75, y: 50, etichetta: "Goccioline omogeneizzate", testo: "Sono così piccole che salgono lentissime: in pratica restano ferme dove sono." }
      ]
    },
    confezionamento: {
      titolo: "Il confezionamento",
      testo: "La riempitrice lavora chiusa, in un ambiente pulitissimo: i microbi eliminati con il calore non devono tornare nel latte. Il cartone arriva piatto, già stampato; la macchina lo piega, lo riempie e lo sigilla. Su ogni confezione stampa anche il lotto e la data entro cui consumarlo.",
      img: "img/confezionamento.webp",
      alt: "Una riempitrice d'acciaio e vetro al centro; a destra, su un nastro, escono confezioni bianche senza scritte, raccolte in file; a sinistra una pila di cartoni piatti su un bancale.",
      fuoco: [55, 45],
      fasi: [2],
      punti: [
        { x: 86, y: 55, etichetta: "La confezione", vai: "confezione" }
      ],
      note: [
        { x: 12, y: 55, etichetta: "Cartoni piatti", lato: "sx", testo: "Arrivano già stampati e occupano poco spazio: la confezione prende forma solo nella macchina." },
        { x: 57, y: 52, etichetta: "Lotto", testo: "Un codice che dice quando e dove è stato confezionato il latte: se c'è un problema, si ritirano solo quelle confezioni." }
      ]
    },
    confezione: {
      titolo: "La confezione",
      testo: "Il cartone del latte non è solo cartone: è fatto di strati. Il cartone dà la forma e la robustezza, sottili pellicole di plastica lo rendono impermeabile. Nelle confezioni del latte a lunga conservazione c'è anche un foglio sottilissimo di alluminio, che blocca la luce e l'ossigeno. Per il riciclo, nella maggior parte dei comuni va con la carta; in alcune zone con plastica e metalli: controlla le regole del tuo comune.",
      img: "img/confezione.webp",
      alt: "Il bordo tagliato di un cartone per bevande, molto ingrandito: sopra la superficie bianca esterna, in mezzo uno spesso strato di cartone marrone, sotto un sottile strato lucido d'alluminio; sullo sfondo, sfocata, una confezione bianca.",
      fuoco: [50, 60],
      fasi: [2],
      note: [
        { x: 45, y: 62, etichetta: "Cartone", testo: "Circa tre quarti del peso della confezione. Viene da fibre di legno." },
        { x: 63, y: 69, etichetta: "Alluminio", lato: "dx", testo: "Spesso pochi millesimi di millimetro: molto più sottile di un capello." },
        { x: 40, y: 53, etichetta: "Plastica", testo: "Pellicole sottilissime di polietilene coprono il cartone fuori e dentro: lo rendono impermeabile e chiudono la confezione quando si salda." }
      ]
    },
    cella: {
      titolo: "La cella frigorifera",
      testo: "Appena confezionato, il latte fresco va nella cella frigorifera, una grande stanza isolata dove la temperatura resta tra 0 e 4 gradi. Da qui comincia la catena del freddo: dallo stabilimento al frigorifero di casa, il latte fresco non deve mai scaldarsi. Il latte a lunga conservazione, invece, è scaldato ad almeno 135 gradi per pochi secondi e chiuso in confezioni sterili, senza che entri nessun microbo: dura mesi fuori dal frigo, finché la confezione resta chiusa.",
      img: "img/cella.webp",
      alt: "L'interno di una grande cella frigorifera: bancali di confezioni bianche avvolte nella pellicola su scaffali di metallo, gruppi refrigeranti con ventilatori al soffitto, un termometro rotondo a parete, un velo di brina sui muri, una tenda a strisce di plastica alla porta.",
      fuoco: [50, 50],
      fasi: [2, 3],
      punti: [
        { x: 50, y: 58, etichetta: "Il camion frigorifero", vai: "camion" }
      ],
      note: [
        { x: 49, y: 10, etichetta: "Ventilatori", testo: "Soffiano aria fredda e la fanno girare tra i bancali, perché tutto si raffreddi allo stesso modo." },
        { x: 94, y: 32, etichetta: "Termometro", testo: "La temperatura viene registrata di continuo: se sale troppo, scatta un allarme." },
        { x: 45, y: 45, etichetta: "Tenda a strisce", verso: "giu", testo: "Si apre al passaggio dei carrelli e si richiude da sola: trattiene il freddo." }
      ]
    },
    camion: {
      titolo: "Il camion frigorifero",
      testo: "Il latte viaggia su camion frigoriferi: il cassone è isolato come un frigorifero, e un gruppo refrigerante lo tiene freddo per tutto il viaggio. Il carico si fa in fretta, con il camion accostato alla banchina, perché il freddo non scappi. Un registratore annota la temperatura: chi riceve il latte può controllare che la catena del freddo non si sia mai interrotta.",
      img: "img/camion.webp",
      alt: "Un camion frigorifero accostato a una banchina di carico all'alba, con le porte posteriori aperte: dentro, bancali di confezioni bianche; in alto, sul davanti del cassone, il gruppo refrigerante.",
      fuoco: [50, 45],
      fasi: [3],
      punti: [
        { x: 66, y: 50, etichetta: "Al supermercato", vai: "supermercato" }
      ],
      note: [
        { x: 24, y: 13, etichetta: "Gruppo refrigerante", testo: "Funziona come il frigorifero di casa: toglie calore dal cassone e lo butta fuori." },
        { x: 38, y: 35, etichetta: "Pareti isolate", testo: "Hanno dentro uno strato di schiuma isolante, che fa passare pochissimo calore." }
      ]
    },
    supermercato: {
      titolo: "Al supermercato",
      testo: "Al supermercato il latte fresco sta nel banco frigorifero. Spesso è un banco aperto: una lama d'aria fredda che scende dall'alto fa da porta invisibile. Di notte si abbassa una tenda, per non sprecare energia. Quando fai la spesa, prendi il latte e gli altri cibi freddi per ultimi, e mettili in una borsa termica se il viaggio fino a casa è lungo.",
      img: "img/supermercato.webp",
      alt: "Un banco frigorifero aperto in un supermercato: ripiani pieni di confezioni bianche di latte, bottiglie e vasetti di yogurt senza scritte, illuminati da strisce di luce; in alto una tenda arrotolata; sullo sfondo la corsia sfocata.",
      fuoco: [45, 50],
      fasi: [3],
      punti: [
        { x: 60, y: 72, etichetta: "Il frigorifero di casa", vai: "frigorifero" }
      ],
      note: [
        { x: 50, y: 11, etichetta: "Tenda notturna", testo: "Si abbassa quando il negozio è chiuso: il banco consuma meno energia." },
        { x: 9, y: 42, etichetta: "Termometro", testo: "Chi lavora nel negozio controlla che il banco resti alla temperatura giusta." }
      ]
    },
    frigorifero: {
      titolo: "Il frigorifero di casa",
      testo: "L'ultimo anello della catena del freddo è il frigorifero di casa, che dovrebbe stare intorno ai 4 gradi. Non è freddo dappertutto allo stesso modo: lo sportello è la parte più calda, perché si apre di continuo e prende l'aria della cucina. Il latte fresco sta meglio su un ripiano centrale. Una volta aperto va bevuto in pochi giorni, anche se la data di scadenza è più lontana: lo dice la confezione.",
      img: "img/frigorifero.webp",
      alt: "Un frigorifero di casa aperto: una confezione bianca di latte su un ripiano di vetro, bottiglie nello sportello, verdure nel cassetto in basso, un piccolo termometro rotondo su un ripiano; sul piano della cucina, davanti, un bicchiere di latte.",
      fuoco: [50, 45],
      fasi: [3],
      note: [
        { x: 70, y: 25, etichetta: "Sportello", testo: "La parte più calda del frigorifero: meglio per bibite e salse, non per il latte." },
        { x: 29, y: 42, etichetta: "Termometro", testo: "Un piccolo termometro dice se il frigorifero è davvero intorno ai 4 gradi." },
        { x: 64, y: 75, etichetta: "Bicchiere di latte", verso: "giu", testo: "Rimetti subito la confezione in frigo: fuori si scalda, e i batteri rimasti si moltiplicano più in fretta." }
      ]
    }
  }
};
