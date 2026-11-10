/*
 * Contenuti dell'esplorazione. Il motore (index.html) legge solo questo file.
 *
 * Ogni nodo è una scena:
 *   titolo, testo   → quello che compare nel blocco di testo
 *   img, alt        → immagine della scena (16:9) e descrizione per chi non la vede
 *   fuoco: [x, y]   → punto tenuto al centro quando l'immagine viene ritagliata (schermi verticali)
 *   fasi: [..]      → quali tappe del percorso sono in gioco (indici di catena.fasi)
 *   punti: [..]     → punti cliccabili: { x, y, etichetta, vai: "id-del-nodo" }
 *   note:  [..]     → etichette fisse, non cliccabili: { x, y, etichetta }
 * Le coordinate x e y sono percentuali dell'immagine (0–100) da sinistra e dall'alto.
 * Riferimento nel libro: MC-AMB-2-05, «Il ciclo artificiale dell'acqua».
 */
window.ESPLORAZIONE = {
  id: "acquedotto-e-depuratore",
  lingua: "it",
  radice: "territorio",
  catena: {
    etichetta: "Tappa",
    fasi: ["captazione", "potabilizzazione", "distribuzione", "uso", "fognatura", "depurazione"]
  },
  nodi: {
    territorio: {
      titolo: "Dalla sorgente al depuratore",
      testo: "L'acqua che esce dal rubinetto ha fatto un lungo viaggio, e dopo l'uso ne fa un altro. È il ciclo artificiale dell'acqua, costruito accanto a quello naturale. Ha sei tappe: captazione, potabilizzazione, distribuzione, uso, fognatura, depurazione. Alla fine l'acqua torna al fiume, ripulita.",
      img: "img/territorio.webp",
      alt: "Veduta dall'alto di una valle: un lago con una torre di presa, un impianto con lunghe vasche, un serbatoio bianco su una collina, un paese dai tetti rossi e, vicino al fiume, un depuratore con vasche rotonde.",
      fuoco: [45, 45],
      fasi: [0, 1, 2, 3, 4, 5],
      punti: [
        { x: 11.5, y: 30, etichetta: "Captazione", vai: "captazione" },
        { x: 27, y: 45, etichetta: "Potabilizzazione", vai: "potabilizzatore" },
        { x: 49.5, y: 25, etichetta: "Distribuzione", vai: "serbatoio" },
        { x: 77, y: 32, etichetta: "Uso in città", vai: "citta" },
        { x: 72, y: 66, etichetta: "Depurazione", vai: "depuratore" }
      ],
      note: [
        { x: 91, y: 79, etichetta: "Fiume" }
      ]
    },

    captazione: {
      titolo: "Captazione",
      testo: "È il punto in cui l'acqua viene presa dalla natura: da un lago, da un fiume, da una sorgente o da sottoterra. Le acque di superficie sono facili da raggiungere ma più sporche; quelle sotterranee sono più pulite, ma servono pozzi profondi per portarle su. Da qui un grande tubo porta l'acqua grezza al potabilizzatore.",
      img: "img/captazione.webp",
      alt: "Riva di un lago di montagna: una torre di presa in calcestruzzo nell'acqua, collegata da una passerella a un piccolo edificio di pompaggio, da cui parte un grosso tubo verso valle.",
      fuoco: [40, 45],
      fasi: [0],
      note: [
        { x: 14, y: 43, etichetta: "Torre di presa" },
        { x: 57, y: 35, etichetta: "Stazione di pompaggio" },
        { x: 80, y: 47, etichetta: "Condotta", verso: "giu" }
      ]
    },

    potabilizzatore: {
      titolo: "Potabilizzazione",
      testo: "L'acqua grezza non si può bere. In questo impianto prima riposa in grandi vasche, dove i solidi più pesanti si depositano sul fondo: è la sedimentazione. Poi viene filtrata e infine disinfettata. Solo dopo questi passaggi è potabile.",
      img: "img/potabilizzatore.webp",
      alt: "Impianto di potabilizzazione: in primo piano lunghe vasche rettangolari piene d'acqua con un ponte metallico, dietro un edificio con grandi vetrate e a destra un serbatoio rotondo coperto d'erba.",
      fuoco: [50, 40],
      fasi: [1],
      punti: [
        { x: 26, y: 33, etichetta: "Disinfezione", vai: "disinfezione" },
        { x: 52, y: 31, etichetta: "Filtrazione", vai: "filtri" }
      ],
      note: [
        { x: 17, y: 46, etichetta: "Vasca di sedimentazione" },
        { x: 31, y: 57, etichetta: "Ponte raschiatore", verso: "giu" },
        { x: 80, y: 37, etichetta: "Serbatoio dell'acqua potabile" }
      ]
    },

    filtri: {
      titolo: "Filtrazione",
      testo: "L'acqua scende lentamente attraverso strati di sabbia e ghiaia, che trattengono le particelle rimaste dopo la sedimentazione. Spesso c'è anche uno strato di carbone attivo, che cattura odori e sostanze sciolte. Quando il filtro si intasa, si lava facendo passare acqua pulita dal basso verso l'alto.",
      img: "img/filtri.webp",
      alt: "Sala dei filtri: una fila di vasche rettangolari piene d'acqua limpida, sul cui fondo si vede il letto di sabbia; lungo la parete grossi tubi blu con valvole.",
      fuoco: [60, 50],
      fasi: [1],
      note: [
        { x: 70, y: 62, etichetta: "Letto di sabbia" },
        { x: 84, y: 27, etichetta: "Tubi e valvole" }
      ]
    },

    disinfezione: {
      titolo: "Disinfezione",
      testo: "L'ultimo passaggio elimina i microbi. Il metodo più usato è aggiungere una quantità minuscola di cloro, che continua a proteggere l'acqua anche lungo i tubi. Alcuni impianti usano la luce ultravioletta, come qui: danneggia il DNA dei microbi, che non riescono più a riprodursi, e non lascia residui.",
      img: "img/disinfezione.webp",
      alt: "Un grosso cilindro d'acciaio con un oblò di vetro, dietro cui si vedono lampade accese di luce blu-viola immerse nell'acqua; ai lati tubi blu con valvole.",
      fuoco: [50, 45],
      fasi: [1],
      note: [
        { x: 11, y: 27, etichetta: "Valvola" },
        { x: 50, y: 46, etichetta: "Lampade a raggi ultravioletti", verso: "giu" }
      ]
    },

    serbatoio: {
      titolo: "Distribuzione",
      testo: "L'acquedotto porta l'acqua potabile nelle case con una rete di tubi sotto pressione. Il serbatoio sopraelevato serve a questo: l'acqua viene pompata in cima e poi scende per gravità. Più il serbatoio è alto, più l'acqua spinge: ogni 10 metri di altezza danno circa 1 bar di pressione.",
      img: "img/serbatoio.webp",
      alt: "Un alto serbatoio bianco a forma di torre su una collina erbosa, con una casetta per le pompe alla base; sotto, nella valle, un paese dai tetti rossi.",
      fuoco: [35, 45],
      fasi: [2],
      punti: [
        { x: 76, y: 68, etichetta: "Tubi e perdite", vai: "tubi" }
      ],
      note: [
        { x: 20, y: 13, etichetta: "Serbatoio" },
        { x: 29, y: 63, etichetta: "Stazione di pompaggio" }
      ]
    },

    tubi: {
      titolo: "Tubi e perdite",
      testo: "Sotto le strade corrono chilometri di tubi. Quando sono vecchi o si rompono, l'acqua esce nel terreno prima di arrivare ai rubinetti: sono le perdite di rete, uno dei problemi più gravi della rete idrica italiana. È acqua già captata, pulita e pompata, quindi si sprecano anche energia e denaro.",
      img: "img/tubi.webp",
      alt: "Scavo in una strada: un vecchio tubo di ghisa arrugginito con una crepa da cui schizza l'acqua; accanto allo scavo un tubo nuovo di plastica blu e la benna di un escavatore.",
      fuoco: [55, 50],
      fasi: [2],
      note: [
        { x: 45, y: 38, etichetta: "Tubo vecchio" },
        { x: 51, y: 62, etichetta: "Perdita" },
        { x: 85, y: 27, etichetta: "Tubo nuovo" }
      ]
    },

    citta: {
      titolo: "Uso in città",
      testo: "In casa l'acqua serve per bere, cucinare, lavarsi, lavare piatti e vestiti, scaricare il WC. Ogni edificio ha un contatore che misura quanta ne entra. Dopo l'uso l'acqua non sparisce: scende negli scarichi e comincia la seconda parte del viaggio.",
      img: "img/citta.webp",
      alt: "Via acciottolata di un paese: in primo piano a sinistra una fontanella di pietra da cui scorre l'acqua, a destra un tombino di ghisa nella strada; sullo sfondo case con balconi.",
      fuoco: [60, 55],
      fasi: [3],
      punti: [
        { x: 82, y: 84, etichetta: "Fognatura", vai: "fognatura" }
      ],
      note: [
        { x: 22.5, y: 29, etichetta: "Fontanella" }
      ]
    },

    fognatura: {
      titolo: "Fognatura",
      testo: "L'acqua usata, detta reflua, scorre in una rete di tubi separata da quella dell'acquedotto. Di solito scende da sola, per pendenza, fino al depuratore. Nelle città moderne la pioggia ha una rete tutta sua, così i temporali non sovraccaricano il depuratore.",
      img: "img/fognatura.webp",
      alt: "Galleria sotterranea di mattoni con la volta ad arco: al centro scorre un canale d'acqua grigia, ai lati due banchine; in alto a destra entra la luce da un tombino aperto con una scala.",
      fuoco: [50, 50],
      fasi: [4],
      note: [
        { x: 79, y: 9, etichetta: "Tombino" },
        { x: 15, y: 58, etichetta: "Tubo in arrivo" }
      ]
    },

    depuratore: {
      titolo: "Depurazione",
      testo: "Qui l'acqua sporca viene ripulita prima di tornare all'ambiente. Il lavoro si fa in tre stadi: prima si tolgono gli oggetti e la sabbia, poi i batteri consumano lo sporco sciolto, infine negli impianti migliori l'acqua viene disinfettata. Solo allora può essere restituita a un fiume o al mare.",
      img: "img/depuratore.webp",
      alt: "Depuratore visto dall'alto, lungo un fiume: a sinistra l'edificio d'ingresso, al centro due vasche rettangolari di acqua marrone che ribolle, a destra tre vasche rotonde di acqua limpida e un canale che scarica nel fiume.",
      fuoco: [50, 40],
      fasi: [5],
      punti: [
        { x: 11, y: 33, etichetta: "Grigliatura", vai: "grigliatura" },
        { x: 36, y: 30, etichetta: "Vasca di ossidazione", vai: "ossidazione" },
        { x: 65, y: 45, etichetta: "Sedimentazione finale", vai: "sedimentatore" }
      ],
      note: [
        { x: 91.5, y: 62, etichetta: "Ritorno al fiume" }
      ]
    },

    grigliatura: {
      titolo: "Grigliatura",
      testo: "È il primo passaggio, tutto meccanico. Griglie sempre più fitte fermano stracci, plastica e altri oggetti finiti negli scarichi. Subito dopo l'acqua rallenta: sabbia e ghiaia vanno a fondo, oli e grassi salgono a galla e vengono tolti.",
      img: "img/grigliatura.webp",
      alt: "Una griglia d'acciaio inclinata esce da un canale di acqua grigia e solleva stracci e bottiglie di plastica, che finiscono in un cassone metallico a destra.",
      fuoco: [55, 45],
      fasi: [5],
      note: [
        { x: 50, y: 30, etichetta: "Griglia" },
        { x: 86, y: 47, etichetta: "Cassone dei rifiuti" }
      ]
    },

    ossidazione: {
      titolo: "Vasca di ossidazione",
      testo: "È il cuore biologico del depuratore. Dal fondo della vasca si soffia aria in continuazione, perché qui lavorano batteri che hanno bisogno di ossigeno. Sono loro a «mangiare» la sostanza organica sciolta nell'acqua.",
      img: "img/ossidazione.webp",
      alt: "Lunga vasca di calcestruzzo piena d'acqua marrone che ribolle di bollicine; lungo il bordo sinistro un grosso tubo dell'aria con diramazioni che scendono nella vasca.",
      fuoco: [50, 50],
      fasi: [5],
      note: [
        { x: 13, y: 21, etichetta: "Tubo dell'aria" },
        { x: 62, y: 52, etichetta: "Bolle d'aria" }
      ]
    },

    sedimentatore: {
      titolo: "Sedimentazione finale",
      testo: "In questa vasca rotonda l'acqua resta quasi ferma. I batteri e i residui scendono sul fondo e formano un fango, che un ponte girevole raccoglie lentamente. L'acqua pulita esce dal bordo, in alto. Il fango va trattato a parte: gestirlo è una delle parti più difficili del lavoro.",
      img: "img/sedimentatore.webp",
      alt: "Grande vasca rotonda di acqua calma e limpida, attraversata da un ponte metallico che parte dal centro; tutt'intorno l'acqua trabocca da un bordo dentato in un canale esterno.",
      fuoco: [55, 50],
      fasi: [5],
      note: [
        { x: 72, y: 33, etichetta: "Ponte girevole" },
        { x: 76, y: 69, etichetta: "Uscita dell'acqua pulita" }
      ]
    }
  }
};
