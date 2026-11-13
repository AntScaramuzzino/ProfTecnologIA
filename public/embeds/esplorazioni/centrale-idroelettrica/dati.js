/*
 * Contenuti dell'esplorazione. Il motore (index.html) legge solo questo file.
 *
 * Ogni nodo è una scena:
 *   titolo, testo   → quello che compare nel pannello
 *   img, alt        → immagine della scena (16:9) e descrizione per chi non la vede
 *   fuoco: [x, y]   → punto tenuto al centro quando l'immagine viene ritagliata (schermi verticali)
 *   fasi: [..]      → quali forme di energia sono in gioco (indici di catena.fasi)
 *   punti: [..]     → punti cliccabili: { x, y, etichetta, vai: "id-del-nodo" }
 *   note:  [..]     → parti della scena senza una scena propria: { x, y, etichetta, testo }
 *                         toccando l'etichetta, il testo (una o due frasi) prende il posto di quello della scena
 * Le coordinate x e y sono percentuali dell'immagine (0–100) da sinistra e dall'alto.
 */
window.ESPLORAZIONE = {
  id: "centrale-idroelettrica",
  indirizzo: "https://book.proftecnologia.it/embeds/esplorazioni/centrale-idroelettrica/",   // indirizzo pubblico: serve al pulsante «Condividi» e al QR code
  lingua: "it",
  radice: "centrale",
  laboratorio: { mc: "MC-ENE-3-03", titolo: "Fotovoltaico per la scuola" },
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
        { x: 13, y: 46, etichetta: "Bacino", testo: "È il lago artificiale che si forma dietro la diga. Raccoglie l'acqua di piogge, nevi e torrenti e la tiene in quota: quando serve elettricità, la si lascia scendere." },
        { x: 38, y: 68, etichetta: "Coronamento", testo: "È il bordo superiore della diga. Di solito ci si può camminare o passare con un mezzo di servizio, per i controlli." }
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
        { x: 40, y: 23, etichetta: "Paratoia", testo: "Una grande porta d'acciaio che scorre in verticale. Alzata lascia passare l'acqua verso le condotte; abbassata la ferma, per esempio durante la manutenzione." },
        { x: 41, y: 58, etichetta: "Griglia", testo: "Sbarre d'acciaio ravvicinate davanti all'imbocco. L'acqua passa; tronchi e rami restano fuori e vengono tolti periodicamente." }
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
      lab: "potenza",
      titolo: "Condotte forzate",
      testo: "Sono grandi tubi d'acciaio che portano l'acqua dal bacino alle turbine. Scendendo lungo il pendio l'acqua perde quota e accumula pressione; quando esce dalla condotta, quella pressione diventa velocità. Così l'energia potenziale si trasforma in energia cinetica, cioè di movimento. Più grande è il dislivello, chiamato salto, più energia arriva alla turbina.",
      img: "img/condotte.webp",
      alt: "Tre grandi tubi d'acciaio scendono affiancati lungo un pendio roccioso, appoggiati su blocchi di calcestruzzo, verso l'edificio della centrale in fondo alla valle.",
      fuoco: [50, 55],
      fasi: [0, 1],
      note: [
        { x: 50, y: 30, etichetta: "Centrale", testo: "L'edificio in fondo alla discesa, dove arrivano le condotte. Dentro ci sono le turbine e gli alternatori." },
        { x: 57.5, y: 61, etichetta: "Blocco di ancoraggio", testo: "Un blocco massiccio di calcestruzzo che tiene ferma la condotta sul pendio. L'acqua in pressione spinge con forza, soprattutto dove il tubo cambia direzione." }
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
        { x: 15, y: 60.5, etichetta: "Ugello", verso: "giu", testo: "Il tratto finale della condotta, dove il tubo si restringe. Da qui l'acqua esce come un getto velocissimo, diretto contro la turbina." },
        { x: 42.5, y: 60, etichetta: "Albero", verso: "giu", testo: "Una grossa barra d'acciaio che ruota. Collega la turbina all'alternatore: gira l'una, gira anche l'altro." }
      ]
    },

    turbina: {
      titolo: "Turbina",
      testo: "La turbina è una ruota d'acciaio con pale sagomate. Il getto d'acqua colpisce le pale e fa ruotare l'albero: l'energia cinetica dell'acqua diventa energia meccanica. Questa è una turbina Pelton, adatta ai grandi salti di montagna; per salti medi si usa la Francis, per salti bassi con molta acqua la Kaplan.",
      img: "img/turbina.webp",
      alt: "Turbina Pelton con la cassa aperta: una ruota con una corona di pale d'acciaio lucido a forma di cucchiaio, e a sinistra l'ugello puntato verso le pale.",
      fuoco: [52, 50],
      fasi: [1, 2],
      punti: [
        { x: 41.5, y: 47, etichetta: "Getto e pale", vai: "getto", lato: "sx", verso: "giu" }
      ],
      note: [
        { x: 26, y: 43, etichetta: "Ugello", testo: "Restringe il passaggio dell'acqua e la trasforma in un getto. Al suo interno uno spillo regola quanta acqua esce, e quindi quanta potenza dà la turbina." },
        { x: 71, y: 66, etichetta: "Albero", verso: "giu", testo: "È l'asse su cui è montata la ruota. Porta il movimento della turbina fino all'alternatore." }
      ]
    },

    getto: {
      lab: "getto",
      titolo: "Getto e pale",
      testo: "Un ugello restringe il passaggio e trasforma l'acqua in un getto sottile e velocissimo. Ogni pala ha la forma di un doppio cucchiaio: divide il getto in due e lo rimanda quasi all'indietro, così l'acqua cede alla ruota gran parte della sua energia. Una turbina Pelton ben progettata ne sfrutta circa il 90%.",
      img: "img/getto.webp",
      alt: "Primo piano: un getto d'acqua esce da un ugello d'acciaio e colpisce le pale a doppio cucchiaio della ruota, dividendosi in due ventagli di spruzzi.",
      fuoco: [52, 45],
      fasi: [1, 2],
      punti: [
        { x: 73, y: 37, etichetta: "Una pala da vicino", lato: "sx", vai: "pala" }
      ],
      note: [
        { x: 12, y: 41, etichetta: "Ugello", testo: "Qui la pressione dell'acqua diventa velocità. Più alto è il salto, più veloce è il getto: negli impianti di alta montagna può superare i 100 metri al secondo." }
      ]
    },

    alternatore: {
      titolo: "Alternatore",
      testo: "L'alternatore trasforma il movimento in elettricità. Il rotore, una ruota di elettromagneti, gira dentro lo statore, un anello fisso di avvolgimenti di rame. Il campo magnetico in movimento fa nascere una corrente nei fili: è l'induzione elettromagnetica, scoperta da Michael Faraday nel 1831.",
      img: "img/alternatore.webp",
      alt: "Spaccato di un alternatore: al centro il rotore con bobine di rame attorno ai poli, montato sull'albero; tutt'intorno l'anello dello statore rivestito di avvolgimenti di rame.",
      fuoco: [52, 50],
      fasi: [2, 3],
      punti: [
        { x: 30, y: 22, etichetta: "Avvolgimenti dello statore", vai: "avvolgimento" }
      ],
      note: [
        { x: 52, y: 56, etichetta: "Rotore", verso: "giu", testo: "La parte che gira, trascinata dalla turbina. Porta gli elettromagneti che creano il campo magnetico." },
        { x: 56, y: 13, etichetta: "Albero", verso: "giu", testo: "Arriva dalla turbina e fa girare il rotore. È il collegamento tra la macchina che produce movimento e quella che produce elettricità." }
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
        { x: 25, y: 15, etichetta: "Conservatore dell'olio", verso: "giu", testo: "Un serbatoio posto sopra il trasformatore. L'olio che riempie la macchina si dilata quando si scalda: qui trova lo spazio per farlo." },
        { x: 54, y: 21, etichetta: "Isolatori passanti", testo: "Colonne di ceramica a dischi da cui i conduttori escono dal trasformatore. Tengono la corrente ad alta tensione lontana dal cassone di metallo." },
        { x: 62, y: 64, etichetta: "Radiatori", verso: "giu", testo: "Pannelli alettati sui fianchi. L'olio caldo vi scorre dentro e cede il calore all'aria: un trasformatore al lavoro si scalda." }
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
        { x: 36, y: 28, etichetta: "Isolatori", testo: "Catene di dischi di vetro o ceramica a cui sono appesi i cavi. Più alta è la tensione, più lunga deve essere la catena." },
        { x: 64, y: 40, etichetta: "Traliccio", testo: "Una torre d'acciaio fatta di aste incrociate: leggera, robusta e alta abbastanza da tenere i cavi lontani dal suolo e dagli alberi." }
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
        { x: 21, y: 45, etichetta: "Bocche di scarico", testo: "Le aperture da cui l'acqua esce dalla centrale dopo aver attraversato le turbine. Ha ceduto quasi tutta la sua energia e scorre lenta." },
        { x: 80, y: 44, etichetta: "Fiume", testo: "L'acqua torna nel suo corso naturale e prosegue verso valle, dove può servire ad altre centrali, ai campi o agli acquedotti." }
      ]
    },
    pala: {
      titolo: "Una pala da vicino",
      testo: "Ogni pala è un blocco d'acciaio inossidabile lucidato a specchio. Lo spigolo al centro taglia il getto in due; le due conche lo accompagnano in curva e lo rimandano indietro. L'acqua lascia la pala quasi ferma: la sua energia è passata alla ruota.",
      img: "img/pala.webp",
      alt: "Primo piano di una pala d'acciaio a doppio cucchiaio: il getto d'acqua colpisce lo spigolo centrale e si divide in due veli che girano dentro le due conche.",
      fuoco: [50, 50],
      fasi: [1, 2],
      punti: [
        { x: 73, y: 80, etichetta: "L'acciaio al microscopio", vai: "acciaio" }
      ],
      note: [
        { x: 50, y: 38, etichetta: "Spigolo centrale", testo: "È affilato come una lama, per tagliare il getto senza frenarlo. È anche il punto che si consuma di più: l'acqua porta con sé sabbia finissima." },
        { x: 27, y: 42, etichetta: "Conca", lato: "sx", testo: "La sua curva fa fare al getto quasi un'inversione a U. Più l'acqua viene deviata, più spinta cede alla pala." }
      ]
    },
    acciaio: {
      titolo: "L'acciaio al microscopio",
      testo: "Lucidato e ingrandito centinaia di volte, l'acciaio non è uniforme: è un mosaico di grani, piccoli cristalli incastrati l'uno nell'altro. In ogni grano gli atomi sono allineati in una direzione diversa. Dalla dimensione dei grani dipende quanto il metallo è duro e quanto resiste all'usura.",
      img: "img/acciaio.webp",
      alt: "Immagine al microscopio di una superficie d'acciaio: un mosaico di grani poligonali irregolari, grigi e azzurri, separati da sottili linee scure.",
      fuoco: [50, 50],
      fasi: [2],
      note: [
        { x: 52, y: 45, etichetta: "Grano", testo: "Un singolo cristallo di metallo. È grande pochi centesimi di millimetro: per vederlo serve il microscopio." },
        { x: 76, y: 22, etichetta: "Bordo di grano", testo: "La linea scura dove due cristalli si incontrano. Grani piccoli vogliono dire tanti bordi, e tanti bordi rendono il metallo più duro." }
      ]
    },
    avvolgimento: {
      titolo: "Gli avvolgimenti dello statore",
      testo: "Lo statore è un anello di lamierini d'acciaio con tante scanalature, le cave. In ogni cava è infilata una barra di rame avvolta nel nastro isolante. Quando i poli del rotore le passano davanti, nelle barre nasce la corrente.",
      img: "img/avvolgimento.webp",
      alt: "Interno di uno statore: a sinistra il pacco di lamierini d'acciaio con le cave; ne escono file di grosse barre di rame fasciate di nastro scuro, con le estremità di rame lucido.",
      fuoco: [55, 45],
      fasi: [3],
      punti: [
        { x: 71, y: 20, etichetta: "Dentro il rame", vai: "rame" }
      ],
      note: [
        { x: 12, y: 45, etichetta: "Lamierini d'acciaio", testo: "Fogli sottili impilati a migliaia e isolati l'uno dall'altro. Guidano il campo magnetico e, sottili come sono, si scaldano meno di un blocco pieno." },
        { x: 47, y: 41, etichetta: "Nastro isolante", testo: "Impedisce alla corrente di passare da una barra all'altra o al ferro dello statore. Deve reggere migliaia di volt." }
      ]
    },
    rame: {
      titolo: "Dentro il conduttore",
      testo: "Tagliato di netto, un conduttore mostra che cosa c'è sotto l'isolante: tanti fili di rame stretti l'uno contro l'altro. Il rame è uno dei migliori conduttori che esistano: la corrente lo attraversa incontrando pochissima resistenza. Per questo quasi tutti i cavi elettrici sono di rame o di alluminio.",
      img: "img/rame.webp",
      alt: "Sezione di un grosso conduttore elettrico: decine di fili di rame lucido stretti insieme dentro una guaina isolante nera.",
      fuoco: [50, 52],
      fasi: [3],
      punti: [
        { x: 52, y: 48, etichetta: "Dentro il metallo: gli elettroni", vai: "elettroni" }
      ],
      note: [
        { x: 26, y: 40, etichetta: "Isolante", lato: "sx", testo: "Uno strato che non lascia passare la corrente. Tiene l'elettricità dentro il rame e protegge chi tocca il cavo." },
        { x: 63, y: 72, etichetta: "Fili di rame", testo: "Tanti fili sottili al posto di uno solo grosso: così il conduttore si può piegare senza spezzarsi." }
      ]
    },
    elettroni: {
      titolo: "Gli elettroni nel rame",
      testo: "È un'illustrazione: a questa scala nessuna fotografia è possibile. Gli atomi di rame sono disposti in file ordinate e ognuno lascia libero un elettrone. Sono questi elettroni liberi, spinti tutti insieme, a formare la corrente elettrica. La corrente della centrale è alternata: in Europa gli elettroni vanno avanti e indietro 50 volte al secondo.",
      img: "img/elettroni.webp",
      alt: "Illustrazione dell'interno del rame: grandi sfere color rame in file ordinate, gli atomi, e tra loro tanti puntini azzurri luminosi, gli elettroni liberi.",
      fuoco: [50, 50],
      fasi: [3],
      note: [
        { x: 37, y: 22, etichetta: "Atomo di rame", testo: "Resta al suo posto nel reticolo: al massimo vibra, e vibra di più quando il metallo si scalda." },
        { x: 16, y: 34, etichetta: "Elettrone libero", testo: "Molto più piccolo dell'atomo e libero di spostarsi tra un atomo e l'altro. Nel disegno è ingrandito per poterlo vedere." }
      ]
    }
  }
};
