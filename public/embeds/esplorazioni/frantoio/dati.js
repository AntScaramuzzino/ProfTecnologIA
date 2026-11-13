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
  id: "frantoio",
  indirizzo: "https://book.proftecnologia.it/embeds/esplorazioni/frantoio/",   // indirizzo pubblico: serve al pulsante «Condividi» e al QR code
  lingua: "it",
  radice: "frantoio",
  catena: { etichetta: "Filiera", fasi: ["campo", "frantoio", "bottiglia", "tavola"] },
  nodi: {
    frantoio: {
      titolo: "Il frantoio",
      testo: "In autunno, nel frantoio, le olive diventano olio. Arrivano dai campi nelle cassette, vengono lavate, schiacciate fino a diventare una pasta, rimescolate a lungo e infine centrifugate: dalla macchina esce l'olio nuovo, verde e torbido. Comprare l'olio qui, da chi coltiva e frange le olive, è un esempio di filiera corta. Tocca i punti e segui il viaggio dall'albero alla bottiglia.",
      img: "img/frantoio.webp",
      alt: "L'interno di un frantoio moderno: a sinistra, vicino a una grande porta aperta, cassette piene di olive; al centro una linea di macchine d'acciaio inox, la lavatrice, il frangitore e una fila di vasche orizzontali; a destra una lunga centrifuga da cui esce un filo d'olio verde-oro.",
      fuoco: [50, 50],
      fasi: [0, 1],
      punti: [
        { x: 8, y: 53, etichetta: "Le olive", vai: "oliveto", lato: "sx" },
        { x: 27, y: 45, etichetta: "Lavaggio", vai: "lavaggio" },
        { x: 40, y: 42, etichetta: "Frangitura", vai: "frangitura" },
        { x: 57, y: 42, etichetta: "Gramolatura", vai: "gramolatura" },
        { x: 85, y: 45, etichetta: "Decanter", vai: "decanter" }
      ]
    },
    oliveto: {
      titolo: "L'oliveto",
      testo: "Tutto comincia nel campo. Nel Sud Italia le olive si raccolgono tra ottobre e dicembre, a volte fino a gennaio: sotto gli alberi si stendono le reti, e le olive si fanno cadere con pettini, bastoni o macchine che scuotono il tronco. Vanno portate al frantoio in fretta, entro un giorno o due: ammassate nelle cassette si scaldano, fermentano, e l'olio peggiora.",
      img: "img/oliveto.webp",
      alt: "Un oliveto del Sud Italia durante la raccolta: vecchi ulivi dalle foglie argentate, reti verdi stese a terra coperte di olive, a destra cassette piene, un rastrello appoggiato a un tronco, colline sullo sfondo.",
      fuoco: [50, 50],
      fasi: [0],
      punti: [
        { x: 60, y: 10, etichetta: "Un ramo di olive", vai: "oliva" }
      ],
      note: [
        { x: 62, y: 86, etichetta: "Reti", verso: "giu", testo: "Raccolgono le olive che cadono, così non si sporcano di terra e non si ammaccano." },
        { x: 82, y: 67, etichetta: "Cassette", testo: "Bucate ai lati, perché le olive respirino. Meglio basse: le olive schiacciate sotto il peso delle altre si rovinano." }
      ]
    },
    oliva: {
      titolo: "L'oliva",
      testo: "L'oliva è il frutto dell'ulivo. Cambia colore mentre matura: verde, poi violacea, infine nera. Dalle olive verdi si ottiene meno olio, ma più profumato e piccante; da quelle mature se ne ottiene di più, ma più dolce. In media, da 100 chili di olive escono tra i 10 e i 20 chili d'olio: dipende dalla varietà, dalla maturazione e dall'annata.",
      img: "img/oliva.webp",
      alt: "Primo piano di un ramo d'ulivo con un grappolo di olive verdi, viola e nere tra foglie strette e argentate, con gocce di rugiada.",
      fuoco: [50, 50],
      fasi: [0],
      punti: [
        { x: 56, y: 63, etichetta: "Dentro l'oliva", vai: "polpa" }
      ],
      note: [
        { x: 30, y: 35, etichetta: "Foglie", lato: "sx", testo: "Strette e coperte sotto da una peluria argentata, che fa perdere meno acqua: l'ulivo resiste bene alla siccità." }
      ]
    },
    polpa: {
      titolo: "Dentro l'oliva",
      testo: "Tagliata a metà, l'oliva mostra tre strati: la buccia sottile, la polpa carnosa e il nocciolo, duro come il legno, con dentro il seme. Quasi tutto l'olio sta nella polpa. Più della metà del peso dell'oliva, però, è acqua: per questo nel frantoio olio e acqua vanno separati.",
      img: "img/polpa.webp",
      alt: "Un'oliva matura tagliata a metà su un tagliere di legno: buccia viola scura, polpa giallo-verde lucida di goccioline d'olio, nocciolo marrone al centro; accanto un'oliva intera e un nocciolo pulito.",
      fuoco: [50, 50],
      fasi: [0],
      punti: [
        { x: 32, y: 62, etichetta: "La polpa al microscopio", vai: "cellule" }
      ],
      note: [
        { x: 24, y: 48, etichetta: "Buccia", lato: "sx", testo: "Protegge il frutto. Contiene i pigmenti che lo colorano mentre matura." },
        { x: 41, y: 47, etichetta: "Nocciolo", testo: "Nel frantoio viene frantumato insieme alla polpa; i suoi frammenti aiutano l'olio a uscire dalla pasta." },
        { x: 48, y: 62, etichetta: "Polpa", verso: "giu", testo: "Il tessuto che contiene l'olio. Al tatto è grassa." }
      ]
    },
    cellule: {
      titolo: "Le cellule della polpa",
      testo: "È un'illustrazione: a questa scala nessuna fotografia è possibile. Al microscopio la polpa dell'oliva è fatta di cellule, chiuse da pareti sottili. Dentro ogni cellula l'olio sta in goccioline. Per liberarlo bisogna rompere le pareti: lo fa il frangitore. Poi le goccioline uscite dalle cellule devono unirsi in gocce più grandi, che si possono separare: lo fa la gramolatura.",
      img: "img/cellule.webp",
      alt: "Illustrazione come al microscopio: cellule vegetali con pareti sottili, piene di goccioline dorate d'olio; alcune cellule rotte, da cui le goccioline escono e si uniscono in gocce più grandi.",
      fuoco: [50, 50],
      fasi: [0, 1],
      punti: [
        { x: 87, y: 60, etichetta: "Le molecole dell'olio", vai: "molecole" }
      ],
      note: [
        { x: 25, y: 30, etichetta: "Parete cellulare", lato: "sx", testo: "Il confine rigido di ogni cellula vegetale." },
        { x: 70, y: 50, etichetta: "Gocce che si uniscono", verso: "giu", testo: "Due goccioline d'olio che si toccano diventano una sola goccia, più grande." }
      ]
    },
    molecole: {
      titolo: "Le molecole dell'olio",
      testo: "È un'illustrazione: a questa scala nessuna fotografia è possibile. L'olio è fatto quasi tutto di trigliceridi: molecole a forma di pettine, con una piccola testa di glicerolo e tre lunghe code, gli acidi grassi. Nell'olio d'oliva il più abbondante è l'acido oleico, che prende il nome proprio dall'olio: ha una piega a metà della coda. Queste code non si mescolano con l'acqua: per questo l'olio si separa e, essendo più leggero, galleggia.",
      img: "img/molecole.webp",
      alt: "Illustrazione su fondo scuro: un modello a sfere e bastoncini di una molecola di grasso, con una corta testa a sinistra e tre lunghe catene a zig-zag di carbonio e idrogeno verso destra, una piegata a metà; alcuni atomi di ossigeno rossi vicino alla testa.",
      fuoco: [50, 50],
      fasi: [0, 1],
      note: [
        { x: 6, y: 42, etichetta: "Glicerolo", testo: "La testa della molecola, che tiene unite le tre code." },
        { x: 70, y: 80, etichetta: "Acido oleico", testo: "La coda con la piega. Nell'olio extravergine è più della metà degli acidi grassi." },
        { x: 71, y: 41, etichetta: "Atomi di carbonio", verso: "giu", testo: "La spina dorsale di ogni coda. Ognuno è legato agli atomi di idrogeno che lo circondano." }
      ]
    },
    lavaggio: {
      titolo: "Il lavaggio",
      testo: "Le cassette si svuotano in una tramoggia, un grande imbuto d'acciaio. Un aspiratore toglie le foglie e i rametti, poi le olive passano in una vasca d'acqua che le rigira e le ripulisce dalla terra; i sassi, più pesanti, vanno a fondo. Un nastro le porta, pulite, al frangitore.",
      img: "img/lavaggio.webp",
      alt: "In un frantoio le olive cadono da una tramoggia d'acciaio in una vasca d'acqua che ribolle; a sinistra il tubo dell'aspiratore con sotto un mucchio di foglie; a destra un nastro che porta su le olive pulite e bagnate.",
      fuoco: [50, 50],
      fasi: [1],
      note: [
        { x: 13, y: 55, etichetta: "Foglie", lato: "sx", testo: "Se finissero nella pasta darebbero all'olio un sapore amaro d'erba." },
        { x: 50, y: 50, etichetta: "Vasca di lavaggio", testo: "L'acqua viene filtrata e riusata, e cambiata quando è troppo sporca." },
        { x: 82, y: 30, etichetta: "Nastro", testo: "Porta le olive al frangitore senza schiacciarle." }
      ]
    },
    frangitura: {
      titolo: "La frangitura",
      testo: "Il frangitore rompe le olive intere, nocciolo compreso. In questo frantoio è un frangitore a martelli d'acciaio che girano velocissimi; nei frantoi tradizionali lo stesso lavoro lo fanno grandi ruote di pietra, le molazze, più lente. Dalla macchina esce una pasta densa e scura: le cellule della polpa sono rotte e l'olio comincia a uscire.",
      img: "img/frangitura.webp",
      alt: "Un frangitore d'acciaio inox al centro, un nastro che da sinistra lo carica di olive intere, e in basso a destra una pasta densa viola-bruna che esce.",
      fuoco: [50, 50],
      fasi: [1],
      punti: [
        { x: 73, y: 70, etichetta: "La pasta di olive", vai: "pasta" }
      ],
      note: [
        { x: 21, y: 29, etichetta: "Olive intere", lato: "sx", testo: "Entrano con il nocciolo: separarlo prima costerebbe troppo e non serve." }
      ]
    },
    pasta: {
      titolo: "La pasta di olive",
      testo: "La pasta di olive è un impasto di buccia, polpa, frammenti di nocciolo, acqua e olio. In superficie si vedono già le prime goccioline lucide. Da qui in poi conta la temperatura: per un olio di qualità la pasta non deve scaldarsi troppo, perché il calore fa uscire più olio ma ne rovina i profumi.",
      img: "img/pasta.webp",
      alt: "Primo piano di pasta di olive appena frantumata in una vaschetta d'acciaio: un impasto lucido viola-bruno con pezzetti di buccia, frammenti taglienti di nocciolo e goccioline d'olio dorate.",
      fuoco: [50, 50],
      fasi: [1],
      note: [
        { x: 88, y: 57, etichetta: "Frammenti di nocciolo", lato: "sx", testo: "Duri e taglienti: aprono piccoli canali nella pasta da cui l'olio scorre meglio." },
        { x: 78, y: 86, etichetta: "Gocce d'olio", testo: "Sono ancora troppo piccole e disperse per separarle." },
        { x: 72, y: 37, etichetta: "Buccia", testo: "Dà alla pasta il colore scuro." }
      ]
    },
    gramolatura: {
      titolo: "La gramolatura",
      testo: "La pasta passa nelle gramole, vasche d'acciaio in cui un albero con grandi pale la rimescola lentamente, di solito per una mezz'ora. Mescolando, le goccioline d'olio si incontrano e si uniscono in gocce più grandi, che si separeranno più facilmente. Se in tutta la lavorazione la pasta resta sotto i 27 gradi, sull'etichetta di un olio extravergine si può scrivere «estratto a freddo».",
      img: "img/gramolatura.webp",
      alt: "Una gramola vista dall'alto con il coperchio aperto: una vasca d'acciaio piena di pasta di olive rimescolata da un albero con grandi pale; gocce d'olio in superficie; un termometro sul fianco.",
      fuoco: [50, 50],
      fasi: [1],
      note: [
        { x: 48, y: 44, etichetta: "Pale", testo: "Girano piano: un movimento troppo forte mescolerebbe di nuovo olio e acqua." },
        { x: 72, y: 22, etichetta: "Coperchio", testo: "Si apre per controllare la pasta. Durante il lavoro resta chiuso: così la pasta prende meno aria." }
      ]
    },
    decanter: {
      titolo: "Il decanter",
      testo: "Il decanter è una centrifuga orizzontale: gira velocissimo, migliaia di giri al minuto. La forza centrifuga spinge verso l'esterno le parti più pesanti, la sansa solida, e lascia verso il centro le più leggere: l'olio esce da una parte, la sansa dall'altra. L'acqua della pasta si separa anche lei, da sola o mescolata alla sansa. L'olio appena uscito è torbido: contiene ancora un po' d'acqua e di minuscoli pezzetti di polpa.",
      img: "img/decanter.webp",
      alt: "Una centrifuga orizzontale d'acciaio in un frantoio: a sinistra un beccuccio da cui un filo d'olio verde-oro torbido cade in una vasca; a destra un nastro che porta via un residuo bruno e umido; sullo sfondo alti serbatoi d'acciaio.",
      fuoco: [50, 50],
      fasi: [1],
      punti: [
        { x: 88, y: 61, etichetta: "La sansa", vai: "sansa" },
        { x: 60, y: 10, etichetta: "Serbatoi", vai: "serbatoi" }
      ],
      note: [
        { x: 15, y: 44, etichetta: "Olio nuovo", lato: "sx", testo: "Verde e torbido, dal profumo d'erba tagliata. Spesso passa ancora in una piccola centrifuga verticale che toglie l'ultima acqua." }
      ]
    },
    sansa: {
      titolo: "La sansa",
      testo: "Quello che resta delle olive dopo l'estrazione si chiama sansa: bucce, polpa e frammenti di nocciolo, ancora con un po' d'olio e d'acqua. Non è un rifiuto da buttare. Negli stabilimenti detti sansifici se ne estrae l'olio di sansa; i frammenti di nocciolo, separati e asciugati, diventano un combustibile per stufe e caldaie; il resto si può trasformare in compost o in biogas.",
      img: "img/sansa.webp",
      alt: "Un grande mucchio di sansa bruna e umida nel cortile di un frantoio, con un nastro che ne scarica altra dall'alto; a destra un mucchio più piccolo di frammenti di nocciolo chiari e asciutti; sullo sfondo l'edificio del frantoio.",
      fuoco: [50, 50],
      fasi: [1],
      note: [
        { x: 30, y: 50, etichetta: "Sansa umida", testo: "Va portata via presto: lasciata ammucchiata fermenta e manda cattivo odore." },
        { x: 82, y: 58, etichetta: "Nocciolino", verso: "giu", testo: "I pezzetti di nocciolo bruciano bene: sono un combustibile rinnovabile, prodotto proprio dall'oliveto." }
      ]
    },
    serbatoi: {
      titolo: "I serbatoi",
      testo: "L'olio si conserva in serbatoi d'acciaio inox, al riparo dai suoi tre nemici: la luce, l'aria e il calore, che lo fanno irrancidire. Il fondo a cono raccoglie il deposito, la parte torbida che scende col tempo. L'olio si può filtrare subito, oppure lasciare che si schiarisca da solo, mentre il deposito scende sul fondo: quello non filtrato resta un po' velato.",
      img: "img/serbatoi.webp",
      alt: "Una fila di alti serbatoi cilindrici d'acciaio con il fondo a cono e i rubinetti; da un rubinetto aperto l'olio verde riempie un bicchiere; a destra, oltre una porta, una piccola macchina imbottigliatrice con bottiglie scure.",
      fuoco: [50, 50],
      fasi: [1, 2],
      punti: [
        { x: 80, y: 44, etichetta: "L'imbottigliamento", vai: "imbottigliamento" }
      ],
      note: [
        { x: 23, y: 53, etichetta: "Rubinetto", verso: "giu", testo: "Da qui si spilla l'olio per l'assaggio: chi lo produce lo controlla con naso e palato." },
        { x: 12, y: 30, etichetta: "Acciaio inox", lato: "sx", testo: "Non arrugginisce e non cede sapori all'olio. Si pulisce facilmente." }
      ]
    },
    imbottigliamento: {
      titolo: "L'imbottigliamento",
      testo: "Una macchina riempie le bottiglie una dopo l'altra, poi le chiude con il tappo. Il vetro è scuro perché protegge l'olio dalla luce. Sull'etichetta la legge chiede alcune informazioni: la categoria dell'olio, per esempio «olio extravergine di oliva», da dove vengono le olive, il lotto, entro quando è meglio consumarlo e come conservarlo.",
      img: "img/imbottigliamento.webp",
      alt: "Una piccola linea di imbottigliamento: bottiglie di vetro verde scuro su un nastro, sotto una riempitrice d'acciaio che versa olio dorato; a destra bottiglie finite con etichette color crema bianche e il tappo.",
      fuoco: [50, 50],
      fasi: [2],
      punti: [
        { x: 88, y: 63, etichetta: "La bottiglia in tavola", vai: "bottiglia" }
      ],
      note: [
        { x: 32, y: 22, etichetta: "Riempitrice", testo: "Mette in ogni bottiglia la stessa quantità d'olio, facendo entrare meno aria possibile." },
        { x: 11, y: 64, etichetta: "Vetro scuro", lato: "sx", testo: "Lascia passare poca luce: alla luce l'olio perde colore, profumo e qualità." }
      ]
    },
    bottiglia: {
      titolo: "In tavola",
      testo: "Eccolo, alla fine del filo: l'olio sulla tavola. Un olio extravergine è fatto solo con mezzi meccanici, senza trattamenti chimici, ha un'acidità non superiore allo 0,8%, una misura che si fa in laboratorio, e all'assaggio sa di frutto senza nessun difetto. Dura un anno e mezzo circa, se è tenuto al buio e al fresco: diversamente dal vino, invecchiando non migliora. Comprato al frantoio, tra chi l'ha prodotto e chi lo mangia non c'è nessun passaggio in mezzo.",
      img: "img/bottiglia.webp",
      alt: "Un tavolo di cucina rustico: una bottiglia di vetro verde scuro con un'etichetta bianca senza scritte, una ciotolina di olio verde-oro, fette di pane, qualche oliva e foglie d'ulivo; dalla finestra si vede un oliveto.",
      fuoco: [50, 50],
      fasi: [2, 3],
      note: [
        { x: 30, y: 43, etichetta: "Bottiglia", lato: "sx", testo: "Va richiusa bene dopo l'uso: l'aria, a contatto con l'olio, lo ossida." },
        { x: 49, y: 67, etichetta: "Olio nuovo", testo: "Appena franto è più piccante e amaro: sono le sostanze antiossidanti, che col tempo calano." },
        { x: 55, y: 20, etichetta: "Oliveto", testo: "Filiera corta: dal campo vicino al frantoio, e dal frantoio alla tavola." }
      ]
    }
  }
};
