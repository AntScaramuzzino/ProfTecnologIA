/*
 * Contenuti dell'esplorazione. Il motore (index.html) legge solo questo file.
 *
 * Ogni nodo è una scena:
 *   titolo, testo   → quello che compare nel pannello
 *   img, alt        → immagine della scena (16:9) e descrizione per chi non la vede
 *   fuoco: [x, y]   → punto tenuto al centro quando l'immagine viene ritagliata (schermi verticali)
 *   fasi: [..]      → quali forme di energia sono in gioco (indici di catena.fasi)
 *   punti: [..]     → punti cliccabili: { x, y, etichetta, vai: "id-del-nodo" }
 *   note:  [..]     → etichette fisse, non cliccabili: { x, y, etichetta }
 * Le coordinate x e y sono percentuali dell'immagine (0–100) da sinistra e dall'alto.
 */
window.ESPLORAZIONE = {
  id: "centrale-idroelettrica",
  lingua: "it",
  radice: "centrale",
  catena: {
    etichetta: "Energia",
    fasi: ["potenziale", "cinetica", "meccanica", "elettrica"]
  },
  nodi: {
    centrale: {
      titolo: "La centrale idroelettrica",
      testo: "Una centrale idroelettrica trasforma l'energia dell'acqua in elettricità. L'acqua raccolta in alto dalla diga scende a valle dentro grandi tubi e fa girare le turbine, collegate ai generatori di corrente. È una fonte rinnovabile: l'acqua non si consuma, torna al fiume e il ciclo dell'acqua la riporta in quota.",
      img: "img/centrale.webp",
      alt: "Veduta dall'alto di una centrale idroelettrica alpina: lago e diga in alto a sinistra, condotte lungo il pendio, edificio della centrale e stazione elettrica a valle, accanto al fiume.",
      fuoco: [47, 50],
      fasi: [0, 1, 2, 3],
      punti: [
        { x: 22, y: 26, etichetta: "Diga e bacino", vai: "diga" },
        { x: 40, y: 49, etichetta: "Condotte forzate", vai: "condotte" },
        { x: 61, y: 67, etichetta: "Sala macchine", vai: "sala" },
        { x: 78, y: 56, etichetta: "Stazione elettrica", vai: "stazione", verso: "su" },
        { x: 69, y: 84, etichetta: "Canale di scarico", vai: "scarico", lato: "dx" }
      ]
    },

    diga: {
      titolo: "Diga e bacino",
      testo: "La diga sbarra la valle e trattiene l'acqua in un lago artificiale, il bacino. Più l'acqua si trova in alto rispetto alle turbine, più energia potenziale possiede. Il bacino è una riserva: l'energia resta lì, pronta, finché non serve produrre elettricità.",
      img: "img/diga.webp",
      alt: "Diga ad arco in calcestruzzo vista dal coronamento: a sinistra il lago con la torre di presa, a destra lo scarico che scende lungo la parete.",
      fuoco: [50, 45],
      fasi: [0],
      punti: [
        { x: 30.5, y: 30, etichetta: "Opera di presa", vai: "presa" },
        { x: 71, y: 52, etichetta: "Scarico di superficie", vai: "sfioratore" }
      ],
      note: [
        { x: 13, y: 46, etichetta: "Bacino" },
        { x: 38, y: 68, etichetta: "Coronamento" }
      ]
    },

    presa: {
      titolo: "Opera di presa",
      testo: "Da qui l'acqua lascia il bacino ed entra nelle condotte. Una griglia d'acciaio ferma tronchi, rami e detriti che danneggerebbero le turbine. Sopra, la paratoia è una grande porta mobile: alzandola o abbassandola si regola quanta acqua passa, oppure la si blocca del tutto.",
      img: "img/presa.webp",
      alt: "Imbocco in calcestruzzo sul lago: in basso una griglia di sbarre d'acciaio che trattiene tronchi e rami, sopra una paratoia metallica con il suo meccanismo di sollevamento.",
      fuoco: [40, 50],
      fasi: [0],
      note: [
        { x: 40, y: 23, etichetta: "Paratoia" },
        { x: 41, y: 58, etichetta: "Griglia" }
      ]
    },

    sfioratore: {
      titolo: "Scarico di superficie",
      testo: "Con piogge intense o quando si scioglie la neve, il lago può riempirsi troppo. Lo scarico di superficie lascia uscire l'acqua in eccesso in modo controllato, prima che superi il bordo della diga. È un dispositivo di sicurezza che protegge la diga e i paesi a valle.",
      img: "img/sfioratore.webp",
      alt: "Lago pieno fino all'orlo: l'acqua in eccesso supera la soglia della diga e scende lungo lo scivolo in una cascata bianca.",
      fuoco: [52, 55],
      fasi: [0]
    },

    condotte: {
      titolo: "Condotte forzate",
      testo: "Sono grandi tubi d'acciaio che portano l'acqua dal bacino alle turbine. Scendendo lungo il pendio l'acqua perde quota e accumula pressione; quando esce dalla condotta, quella pressione diventa velocità. Così l'energia potenziale si trasforma in energia cinetica, cioè di movimento. Più grande è il dislivello, chiamato salto, più energia arriva alla turbina.",
      img: "img/condotte.webp",
      alt: "Tre grandi tubi d'acciaio scendono affiancati lungo un pendio roccioso, appoggiati su blocchi di calcestruzzo, verso l'edificio della centrale in fondo alla valle.",
      fuoco: [50, 55],
      fasi: [0, 1],
      note: [
        { x: 50, y: 30, etichetta: "Centrale" },
        { x: 57.5, y: 61, etichetta: "Blocco di ancoraggio" }
      ]
    },

    sala: {
      titolo: "Sala macchine",
      testo: "Nell'edificio della centrale lavorano i gruppi turbina-alternatore. In ogni gruppo le due macchine sono montate sullo stesso albero: quando l'acqua fa girare la turbina, gira anche l'alternatore. Qui l'energia cambia forma due volte: da cinetica a meccanica, poi da meccanica a elettrica.",
      img: "img/sala.webp",
      alt: "Interno della sala macchine: in primo piano una turbina dalla cassa verde tondeggiante, in cui entra da sinistra l'ugello d'acciaio, collegata da un albero a un alternatore grigio-azzurro; altri gruppi uguali in fila sullo sfondo.",
      fuoco: [42, 58],
      fasi: [1, 2, 3],
      punti: [
        { x: 29, y: 56, etichetta: "Turbina", vai: "turbina" },
        { x: 58, y: 56, etichetta: "Alternatore", vai: "alternatore" }
      ],
      note: [
        { x: 15, y: 60.5, etichetta: "Ugello", verso: "giu" },
        { x: 42.5, y: 60, etichetta: "Albero", verso: "giu" }
      ]
    },

    turbina: {
      titolo: "Turbina",
      testo: "La turbina è una ruota d'acciaio con pale sagomate. L'acqua in pressione colpisce le pale e fa ruotare l'albero: l'energia cinetica dell'acqua diventa energia meccanica. Questa è una turbina Pelton, adatta ai grandi salti di montagna; per salti medi si usa la Francis, per salti bassi con molta acqua la Kaplan.",
      img: "img/turbina.webp",
      alt: "Turbina Pelton con la cassa aperta: una ruota con una corona di pale d'acciaio lucido a forma di cucchiaio, e a sinistra l'ugello puntato verso le pale.",
      fuoco: [52, 50],
      fasi: [1, 2],
      punti: [
        { x: 41.5, y: 47, etichetta: "Getto e pale", vai: "getto", lato: "sx", verso: "giu" }
      ],
      note: [
        { x: 26, y: 43, etichetta: "Ugello" },
        { x: 71, y: 66, etichetta: "Albero", verso: "giu" }
      ]
    },

    getto: {
      titolo: "Getto e pale",
      testo: "Un ugello restringe il passaggio e trasforma l'acqua in un getto sottile e velocissimo. Ogni pala ha la forma di un doppio cucchiaio: divide il getto in due e lo rimanda quasi all'indietro, così l'acqua cede alla ruota gran parte della sua energia. Una turbina Pelton ben progettata ne sfrutta circa il 90%.",
      img: "img/getto.webp",
      alt: "Primo piano: un getto d'acqua esce da un ugello d'acciaio e colpisce le pale a doppio cucchiaio della ruota, dividendosi in due ventagli di spruzzi.",
      fuoco: [52, 45],
      fasi: [1, 2],
      note: [
        { x: 12, y: 41, etichetta: "Ugello" },
        { x: 73, y: 37, etichetta: "Pala a doppio cucchiaio", lato: "sx" }
      ]
    },

    alternatore: {
      titolo: "Alternatore",
      testo: "L'alternatore trasforma il movimento in elettricità. Il rotore, una ruota di elettromagneti, gira dentro lo statore, un anello fisso di avvolgimenti di rame. Il campo magnetico in movimento fa nascere una corrente nei fili: è l'induzione elettromagnetica, scoperta da Michael Faraday nel 1831.",
      img: "img/alternatore.webp",
      alt: "Spaccato di un alternatore: al centro il rotore con bobine di rame attorno ai poli, montato sull'albero; tutt'intorno l'anello dello statore rivestito di avvolgimenti di rame.",
      fuoco: [52, 50],
      fasi: [2, 3],
      note: [
        { x: 30, y: 22, etichetta: "Statore" },
        { x: 52, y: 56, etichetta: "Rotore", verso: "giu" },
        { x: 56, y: 13, etichetta: "Albero", verso: "giu" }
      ]
    },

    stazione: {
      titolo: "Stazione elettrica",
      testo: "L'elettricità prodotta deve viaggiare anche per centinaia di chilometri. Prima di partire passa dai trasformatori, che ne alzano la tensione. A parità di potenza, con una tensione più alta nei cavi scorre meno corrente, e si disperde meno energia sotto forma di calore.",
      img: "img/stazione.webp",
      alt: "Stazione elettrica all'aperto accanto alla centrale: a sinistra due grandi trasformatori con alette di raffreddamento e isolatori, a destra un traliccio da cui partono le linee.",
      fuoco: [45, 50],
      fasi: [3],
      punti: [
        { x: 15, y: 60, etichetta: "Trasformatore", vai: "trasformatore" },
        { x: 81, y: 30, etichetta: "Linee ad alta tensione", vai: "linee" }
      ]
    },

    trasformatore: {
      titolo: "Trasformatore",
      testo: "Dentro il trasformatore ci sono due avvolgimenti di filo attorno a un nucleo di ferro. Se i due avvolgimenti hanno un numero diverso di spire, la tensione in uscita è diversa da quella in entrata. In centrale la tensione viene alzata fino a centinaia di migliaia di volt; vicino alle città altri trasformatori la riabbassano, fino ai 230 volt delle prese di casa.",
      img: "img/trasformatore.webp",
      alt: "Grande trasformatore grigio: sul fianco file di radiatori, in alto tre isolatori marroni a cui arrivano i cavi e un serbatoio cilindrico per l'olio.",
      fuoco: [50, 45],
      fasi: [3],
      note: [
        { x: 25, y: 15, etichetta: "Conservatore dell'olio", verso: "giu" },
        { x: 54, y: 21, etichetta: "Isolatori passanti" },
        { x: 62, y: 64, etichetta: "Radiatori", verso: "giu" }
      ]
    },

    linee: {
      titolo: "Linee ad alta tensione",
      testo: "I tralicci sostengono i cavi che portano l'energia dalla montagna ai centri abitati. I cavi sono appesi a catene di isolatori in vetro o ceramica, che impediscono alla corrente di scaricarsi sul metallo del traliccio. In Italia le linee aeree più potenti lavorano a 380.000 volt.",
      img: "img/linee.webp",
      alt: "Linea ad alta tensione sopra una valle boscosa: in primo piano le catene di isolatori di vetro appese al traliccio, in lontananza altri tralicci e un paese.",
      fuoco: [40, 45],
      fasi: [3],
      note: [
        { x: 36, y: 28, etichetta: "Isolatori" },
        { x: 64, y: 40, etichetta: "Traliccio" }
      ]
    },

    scarico: {
      titolo: "Canale di scarico",
      testo: "Dopo aver ceduto la sua energia alla turbina, l'acqua esce dalla centrale e torna al fiume. Non è stata consumata: prosegue il suo corso verso valle. Una diga però modifica il fiume: per questo la legge impone di lasciar scorrere sempre una quantità minima d'acqua, il deflusso ecologico, così pesci e piante possono vivere.",
      img: "img/scarico.webp",
      alt: "Acqua limpida esce da tre bocche ad arco alla base della centrale e si ricongiunge a un fiume di montagna dalle rive verdi.",
      fuoco: [38, 50],
      fasi: [],
      note: [
        { x: 21, y: 45, etichetta: "Bocche di scarico" },
        { x: 80, y: 44, etichetta: "Fiume" }
      ]
    }
  }
};
