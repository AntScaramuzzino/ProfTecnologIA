/*
 * Contenuti dell'esplorazione. Il motore (index.html) legge solo questo file.
 *
 * Ogni nodo è una scena:
 *   titolo, testo   → quello che compare nel pannello
 *   img, alt        → immagine della scena (16:9) e descrizione per chi non la vede
 *   fuoco: [x, y]   → punto tenuto al centro quando l'immagine viene ritagliata (schermi verticali)
 *   fasi: [..]      → a che punto del percorso si trova la scena (indici di catena.fasi)
 *   punti: [..]     → punti cliccabili: { x, y, etichetta, vai: "id-del-nodo" }
 *   note:  [..]     → parti della scena senza una scena propria: { x, y, etichetta, testo }
 *                         toccando l'etichetta, il testo (una o due frasi) prende il posto di quello della scena
 * Le coordinate x, y sono percentuali dell'immagine, da sinistra e dall'alto.
 */
window.ESPLORAZIONE = {
  id: "impianto-di-selezione",
  indirizzo: "https://book.proftecnologia.it/embeds/esplorazioni/impianto-di-selezione/",   // indirizzo pubblico: serve al pulsante «Condividi» e al QR code
  lingua: "it",
  radice: "impianto",
  catena: { etichetta: "Percorso", fasi: ["raccolta", "selezione", "balle", "riciclo"] },
  nodi: {
    impianto: {
      titolo: "L'impianto di selezione dei rifiuti",
      testo: "Gli imballaggi di plastica e di metallo della raccolta differenziata arrivano qui, in un centro di selezione. Bottiglie, flaconi, vaschette e lattine sono ancora mescolati: per riciclarli bisogna prima dividerli per materiale. Lo fanno macchine messe in fila, ognuna con un trucco diverso. Alla fine ogni materiale esce pressato in balle.",
      img: "img/impianto.webp",
      alt: "Capannone di un impianto di selezione visto dall'alto: a sinistra un cumulo di sacchi gialli e bottiglie, poi un grande tamburo forato inclinato, nastri trasportatori con un magnete sospeso, una macchina con una fila di lampade e, a destra, una pressa verde con le balle accanto.",
      fuoco: [50, 42],
      fasi: [0, 1, 2, 3],
      punti: [
        { x: 9, y: 36, etichetta: "Area di scarico", vai: "scarico" },
        { x: 33, y: 27, etichetta: "Vaglio rotante", vai: "vaglio" },
        { x: 51, y: 36, etichetta: "Separazione dei metalli", vai: "metalli" },
        { x: 70, y: 42, etichetta: "Selezione ottica", vai: "ottica" },
        { x: 90, y: 30, etichetta: "Pressa", vai: "pressa" }
      ],
      note: [
        { x: 93, y: 58, etichetta: "Balle", lato: "sx", testo: "Blocchi pressati di un solo materiale, pronti a partire. Sono il prodotto finale dell'impianto." }
      ]
    },

    scarico: {
      titolo: "Area di scarico",
      testo: "I camion della raccolta differenziata scaricano qui il loro carico. È un cumulo di sacchi, bottiglie, flaconi e lattine: tutto mescolato, a volte con oggetti finiti nel bidone sbagliato. Una pala gommata lo spinge verso la tramoggia, l'imbuto da cui parte la linea di selezione.",
      img: "img/scarico.webp",
      alt: "Pavimento di un capannone con un grande cumulo di bottiglie, lattine e sacchi gialli davanti a un portone aperto; al centro una pala gommata gialla, a sinistra una tramoggia d'acciaio da cui sale un nastro trasportatore inclinato.",
      fuoco: [50, 42],
      fasi: [0],
      punti: [
        { x: 11, y: 30, etichetta: "Aprisacchi", vai: "aprisacchi" }
      ],
      note: [
        { x: 61, y: 27, etichetta: "Pala gommata", testo: "Un mezzo su ruote di gomma con una grande benna davanti. Sposta i cumuli e alimenta la linea." },
        { x: 40, y: 18, etichetta: "Nastro di carico", testo: "Il nastro trasportatore che porta i rifiuti dalla tramoggia alla prima macchina. Da qui in poi tutto viaggia su nastri." }
      ]
    },

    aprisacchi: {
      titolo: "Aprisacchi",
      testo: "Molti rifiuti arrivano chiusi nei sacchi. Questa macchina li apre: un tamburo con i denti gira piano, aggancia i sacchi e li strappa senza schiacciare quello che c'è dentro. Bottiglie e lattine cadono sul nastro e salgono verso il vaglio.",
      img: "img/aprisacchi.webp",
      alt: "Macchina d'acciaio con un tamburo dentato che strappa un sacco giallo; bottiglie e lattine cadono su un nastro trasportatore che sale verso destra.",
      fuoco: [45, 45],
      fasi: [0, 1],
      note: [
        { x: 45, y: 30, etichetta: "Tamburo con i denti", testo: "Un cilindro che gira lentamente. I denti agganciano la plastica dei sacchi e la lacerano." },
        { x: 33, y: 45, etichetta: "Sacco strappato", lato: "sx", testo: "Una volta aperto, il sacco è un imballaggio di plastica come gli altri e prosegue sulla linea." },
        { x: 85, y: 30, etichetta: "Verso il vaglio", testo: "Il nastro in salita porta i rifiuti, ormai sciolti, alla macchina successiva." }
      ]
    },

    vaglio: {
      titolo: "Vaglio rotante",
      testo: "Il vaglio è un grande tamburo pieno di fori, che gira lentamente. I pezzi più piccoli dei fori cadono sul nastro di sotto; quelli grandi, come bottiglie e flaconi, rotolano fino all'uscita. È un setaccio: divide i rifiuti per dimensione, non per materiale.",
      img: "img/vaglio.webp",
      alt: "Lungo tamburo d'acciaio inclinato e pieno di fori, con bottiglie che rotolano all'interno; dai fori cadono frammenti su un nastro sottostante, mentre bottiglie e flaconi escono dall'estremità destra.",
      fuoco: [55, 45],
      fasi: [1],
      note: [
        { x: 45, y: 22, etichetta: "Tamburo forato", testo: "Un cilindro inclinato con le pareti piene di fori tutti uguali. Girando rimescola i rifiuti, così ogni pezzo ha l'occasione di passare da un foro." },
        { x: 88, y: 45, etichetta: "Pezzi grandi", testo: "Bottiglie, flaconi e lattine non passano dai fori: percorrono tutto il tamburo ed escono in fondo." },
        { x: 66, y: 86, etichetta: "Pezzi piccoli", testo: "Tappi, frammenti e sporcizia cadono attraverso i fori e seguono un'altra strada." }
      ]
    },

    metalli: {
      titolo: "Separazione dei metalli",
      testo: "In mezzo alla plastica ci sono barattoli d'acciaio e lattine di alluminio. Sono due metalli diversi, e servono due macchine diverse per toglierli. La prima usa una calamita; la seconda fa saltare via l'alluminio, che le calamite non attirano.",
      img: "img/metalli.webp",
      alt: "Tratto di una linea di selezione: a sinistra un nastro carico di imballaggi passa sotto un magnete sospeso; a destra la fine di un secondo nastro con un rullo e due scivoli d'acciaio.",
      fuoco: [50, 40],
      fasi: [1],
      punti: [
        { x: 25, y: 22, etichetta: "Separatore magnetico", vai: "magnete" },
        { x: 81, y: 42, etichetta: "Correnti parassite", vai: "parassite" }
      ],
      note: [
        { x: 85, y: 66, etichetta: "Scivoli", testo: "Canali inclinati in cui cadono i metalli separati. Ognuno porta a un cassone diverso: uno per l'acciaio, uno per l'alluminio." }
      ]
    },

    magnete: {
      titolo: "Separatore magnetico",
      testo: "Sopra il nastro è sospesa una grossa calamita, avvolta da un nastro più piccolo che gira di traverso. Barattoli, scatolette e tappi d'acciaio vengono attirati verso l'alto, restano attaccati e sono trascinati di lato, fino a cadere nel loro cassone. La plastica e l'alluminio non sentono la calamita e proseguono.",
      img: "img/magnete.webp",
      alt: "Primo piano di un magnete sospeso sopra un nastro di rifiuti: barattoli d'acciaio e tappi restano attaccati al nastrino del magnete e vengono portati verso un cassone a destra, mentre le bottiglie di plastica restano sul nastro principale.",
      fuoco: [50, 40],
      fasi: [1],
      note: [
        { x: 45, y: 15, etichetta: "Calamita", verso: "giu", testo: "Un magnete potente. Attira il ferro e l'acciaio; non ha effetto su alluminio, plastica, vetro e carta." },
        { x: 62, y: 42, etichetta: "Barattoli d'acciaio", verso: "giu", testo: "Barattoli di pelati, scatolette e tappi a corona sono d'acciaio: per questo la calamita li solleva. L'acciaio si ricicla fondendolo di nuovo." },
        { x: 30, y: 52, etichetta: "Plastica", testo: "La plastica non è attirata dai magneti: resta sul nastro e continua verso le macchine successive." }
      ]
    },

    parassite: {
      titolo: "Separatore a correnti parassite",
      testo: "L'alluminio non è attirato dalle calamite, ma si può respingere. In fondo al nastro gira velocissimo un rullo di magneti: il campo magnetico che cambia fa nascere nelle lattine delle correnti elettriche, le correnti parassite, e queste le spingono via. Le lattine saltano oltre la lamiera; la plastica, che non conduce la corrente, cade dritta.",
      img: "img/parassite.webp",
      alt: "Fine di un nastro trasportatore, visto di lato: le lattine di alluminio schiacciate volano in arco oltre una lamiera divisoria e cadono nello scivolo lontano, mentre bottiglie e pellicole di plastica cadono dritte nel cassone vicino.",
      fuoco: [55, 40],
      fasi: [1],
      note: [
        { x: 72, y: 28, etichetta: "Lattine di alluminio", testo: "L'alluminio conduce bene la corrente: per questo il rullo di magneti lo respinge e le lattine volano più lontano di tutto il resto." },
        { x: 37, y: 30, etichetta: "Rullo di magneti", lato: "sx", testo: "Un cilindro coperto di magneti che ruota molto più veloce del nastro. Crea un campo magnetico che cambia di continuo." },
        { x: 44, y: 52, etichetta: "Plastica", lato: "sx", testo: "La plastica non conduce la corrente, quindi il rullo non le fa nulla: arrivata in fondo al nastro, cade semplicemente giù." }
      ]
    },

    ottica: {
      titolo: "Selezione ottica",
      testo: "Le plastiche non sono tutte uguali: una bottiglia d'acqua e un flacone di detersivo sono fatti di materiali diversi e vanno riciclati separati. Sotto le lampade, una telecamera a infrarossi guarda come ogni oggetto riflette la luce: ogni tipo di plastica la riflette a modo suo. Un computer decide in una frazione di secondo chi deve uscire dalla fila.",
      img: "img/ottica.webp",
      alt: "Macchina di selezione ottica: un nastro nero largo e veloce porta bottiglie e flaconi in un solo strato sotto una cappa con una fila di lampade e un sensore; in fondo, a destra, una barra di ugelli e due scivoli separati da una lamiera.",
      fuoco: [55, 40],
      fasi: [1],
      punti: [
        { x: 78, y: 42, etichetta: "Soffi d'aria", vai: "ugelli" },
        { x: 88, y: 24, etichetta: "Controllo a mano", vai: "cabina", lato: "sx" }
      ],
      note: [
        { x: 27, y: 17, etichetta: "Lampade", verso: "giu", testo: "Illuminano il nastro con una luce forte e uniforme, che contiene anche infrarossi. Senza questa luce la telecamera non potrebbe distinguere i materiali." },
        { x: 43, y: 18, etichetta: "Telecamera a infrarossi", verso: "giu", testo: "Un sensore che legge la luce infrarossa riflessa dagli oggetti, che i nostri occhi non vedono. Da quel riflesso riconosce il tipo di plastica." }
      ]
    },

    ugelli: {
      titolo: "Soffi d'aria",
      testo: "In fondo al nastro c'è una fila di ugelli. Quando passa l'oggetto riconosciuto, gli ugelli sotto di lui sparano un soffio d'aria compressa che lo fa saltare oltre la lamiera, nel suo scivolo. Gli altri cadono dritti. La plastica nera spesso sfugge: assorbe la luce infrarossa e la telecamera non la riconosce.",
      img: "img/ugelli.webp",
      alt: "Primo piano della fine del nastro: una fila di piccoli ugelli soffia aria e spinge in alto una bottiglia trasparente, mentre un flacone bianco e una vaschetta nera cadono davanti alla lamiera.",
      fuoco: [50, 45],
      fasi: [1],
      note: [
        { x: 53, y: 14, etichetta: "Bottiglia riconosciuta", verso: "giu", testo: "La telecamera l'ha riconosciuta pochi istanti prima. Il computer ha calcolato quando sarebbe arrivata sopra gli ugelli e l'ha fatta saltare." },
        { x: 30, y: 42, etichetta: "Ugelli", lato: "sx", verso: "giu", testo: "Piccole bocchette allineate su tutta la larghezza del nastro. Si aprono solo quelle sotto l'oggetto giusto, per pochi millesimi di secondo." },
        { x: 68, y: 62, etichetta: "Vaschetta nera", testo: "Il colorante nero assorbe la luce infrarossa: alla telecamera non torna nessun segnale e la vaschetta non viene riconosciuta." }
      ]
    },

    cabina: {
      titolo: "Controllo a mano",
      testo: "Le macchine sbagliano poco, ma sbagliano. In questa cabina il nastro scorre lento davanti agli addetti, che tolgono a mano quello che non deve esserci e lo lasciano cadere nei cassoni ai lati. Più il materiale è pulito, più vale per chi lo ricicla.",
      img: "img/cabina.webp",
      alt: "Cabina chiusa con grandi finestre, vuota: al centro un nastro lento carico di bottiglie, ai lati cassoni gialli, verdi, blu e rossi; sul bordo del nastro un paio di guanti da lavoro.",
      fuoco: [50, 50],
      fasi: [1],
      note: [
        { x: 50, y: 45, etichetta: "Nastro lento", testo: "Qui il nastro va piano apposta, per dare agli addetti il tempo di guardare e afferrare." },
        { x: 82, y: 42, etichetta: "Cassoni per gli scarti", testo: "Raccolgono quello che viene tolto a mano: oggetti finiti nel bidone sbagliato o materiali diversi da quello che deve passare." },
        { x: 71, y: 77, etichetta: "Guanti", testo: "Proteggono le mani da tagli e sporcizia. Chi lavora qui usa sempre guanti resistenti e altri dispositivi di protezione." }
      ]
    },

    pressa: {
      titolo: "Pressa",
      testo: "Ogni materiale selezionato finisce in una pressa. Un pistone spinto dall'olio in pressione schiaccia migliaia di bottiglie in un blocco compatto, la balla, che viene legata con fili d'acciaio. Così in un camion entra molto più materiale.",
      img: "img/pressa.webp",
      alt: "Grande pressa verde orizzontale: a sinistra la tramoggia piena di bottiglie trasparenti, a destra una balla compatta di bottiglie legata con fili d'acciaio che esce su una rulliera; sullo sfondo altre balle.",
      fuoco: [55, 45],
      fasi: [2],
      punti: [
        { x: 94, y: 25, etichetta: "Balle pronte", vai: "balle", lato: "sx" }
      ],
      note: [
        { x: 27, y: 12, etichetta: "Tramoggia", verso: "giu", testo: "L'imbuto da cui il materiale selezionato cade dentro la pressa." },
        { x: 37, y: 34, etichetta: "Pistone", verso: "giu", testo: "Una piastra d'acciaio spinta in avanti con una forza enorme. Schiaccia il materiale contro quello già pressato." },
        { x: 78, y: 55, etichetta: "Balla appena pressata", testo: "Esce dalla pressa già legata. Una balla di bottiglie può pesare alcuni quintali." }
      ]
    },

    balle: {
      titolo: "Balle pronte",
      testo: "Qui il lavoro dell'impianto è finito: ogni balla contiene un solo materiale. Le balle vengono vendute agli impianti di riciclo, dove la plastica è triturata in scaglie, lavata e fusa in granuli per nuovi oggetti, e i metalli tornano in fonderia. Quello che le macchine hanno scartato va invece al recupero di energia o in discarica.",
      img: "img/balle.webp",
      alt: "Piazzale con pile di balle: a sinistra balle di bottiglie trasparenti, al centro balle di flaconi colorati, a destra balle di lattine schiacciate; sullo sfondo un camion con il rimorchio aperto e un carrello elevatore.",
      fuoco: [45, 45],
      fasi: [2, 3],
      note: [
        { x: 12, y: 30, etichetta: "Bottiglie trasparenti", testo: "Sono di PET, la plastica delle bottiglie d'acqua e di bibite. Quello trasparente è il più richiesto, perché può tornare a essere una bottiglia." },
        { x: 41, y: 30, etichetta: "Flaconi colorati", testo: "I flaconi di detersivo e di shampoo sono in gran parte di polietilene ad alta densità (HDPE). Riciclato diventa nuovi flaconi, tubi e cassette." },
        { x: 61, y: 30, etichetta: "Lattine", testo: "Le lattine di alluminio pressate vanno in fonderia. Rifondere l'alluminio richiede molta meno energia che produrlo dal minerale." }
      ]
    }
  }
};
