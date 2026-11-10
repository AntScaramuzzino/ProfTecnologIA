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
 * Le coordinate x, y sono percentuali dell'immagine, da sinistra e dall'alto.
 */
window.ESPLORAZIONE = {
  id: "centrale-termoelettrica",
  lingua: "it",
  radice: "centrale",
  catena: { etichetta: "Energia", fasi: ["chimica", "termica", "meccanica", "elettrica"] },
  nodi: {
    centrale: {
      titolo: "La centrale termoelettrica",
      testo: "Una centrale termoelettrica brucia un combustibile per produrre elettricità. Questa usa gas naturale, che arriva da un gasdotto, ed è a ciclo combinato: sfrutta il calore due volte, prima con una turbina a gas e poi con una turbina a vapore. In Italia il gas è il combustibile fossile più usato per produrre elettricità.",
      img: "img/centrale.webp",
      alt: "Veduta aerea di una centrale a gas in pianura, accanto a un fiume: a sinistra un edificio basso con le prese d'aria, al centro una struttura alta con il camino, poi un capannone più grande; in basso a destra una fila di torri di raffreddamento con ventilatori e vapore bianco, in alto a destra una stazione elettrica con un traliccio; in basso a sinistra tubi gialli.",
      fuoco: [50, 45],
      fasi: [0, 1, 2, 3],
      punti: [
        { x: 20, y: 50, etichetta: "Turbina a gas", vai: "turbinagas" },
        { x: 41, y: 38, etichetta: "Caldaia a recupero", vai: "caldaia" },
        { x: 64, y: 40, etichetta: "Turbina a vapore", vai: "vapore" },
        { x: 77, y: 62, etichetta: "Torri di raffreddamento", vai: "raffreddamento", verso: "giu" },
        { x: 80, y: 27, etichetta: "Stazione elettrica", vai: "stazione" }
      ],
      note: [
        { x: 43, y: 10, etichetta: "Camino", verso: "giu" },
        { x: 13, y: 79, etichetta: "Arrivo del gas" }
      ]
    },

    turbinagas: {
      titolo: "Turbina a gas",
      testo: "Funziona come il motore di un aereo, ma resta ferma al suo posto. Il compressore aspira l'aria e la schiaccia; nella camera di combustione l'aria compressa brucia insieme al gas; i gas caldissimi che ne escono spingono le pale della turbina e fanno girare l'albero. Lo stesso albero muove il compressore e un alternatore.",
      img: "img/turbinagas.webp",
      alt: "Grande turbina a gas aperta in un capannone: su un unico albero orizzontale si vedono, da sinistra, le molte file di pale del compressore, l'anello delle camere di combustione e le pale più grandi della turbina.",
      fuoco: [52, 45],
      fasi: [0, 1, 2],
      punti: [
        { x: 58, y: 42, etichetta: "Camera di combustione", vai: "combustione" }
      ],
      note: [
        { x: 27, y: 40, etichetta: "Compressore" },
        { x: 80, y: 36, etichetta: "Pale della turbina" }
      ]
    },

    combustione: {
      titolo: "Camera di combustione",
      testo: "Qui l'energia chimica del gas diventa calore. I bruciatori spruzzano il gas nell'aria compressa e la fiamma supera i 1.000 gradi. I gas caldi si espandono e corrono verso le pale della turbina. Bruciando, il gas si trasforma soprattutto in anidride carbonica e vapore acqueo.",
      img: "img/combustione.webp",
      alt: "Spaccato di una camera di combustione: a sinistra tre bruciatori da cui escono fiamme azzurre, al centro una grande fiamma arancione dentro un cilindro di metallo forato, a destra le pale della turbina investite dai gas incandescenti.",
      fuoco: [50, 45],
      fasi: [0, 1],
      note: [
        { x: 17, y: 30, etichetta: "Bruciatori" },
        { x: 45, y: 42, etichetta: "Fiamma" },
        { x: 88, y: 40, etichetta: "Pale della turbina", lato: "sx" }
      ]
    },

    caldaia: {
      titolo: "Caldaia a recupero",
      testo: "Usciti dalla turbina, i gas sono ancora a centinaia di gradi: buttarli via sarebbe uno spreco. Passano allora in questa caldaia, dove scaldano fasci di tubi pieni d'acqua finché l'acqua diventa vapore ad alta pressione. È il «recupero»: lo stesso calore lavora una seconda volta.",
      img: "img/caldaia.webp",
      alt: "Caldaia a recupero vista da terra: un'alta struttura d'acciaio con tubi isolati, scale e passerelle e due serbatoi cilindrici in cima; da sinistra entra un largo condotto che viene dall'edificio della turbina, a destra sale un camino sottile.",
      fuoco: [55, 45],
      fasi: [1],
      punti: [
        { x: 87, y: 22, etichetta: "Camino", vai: "camino", lato: "sx" }
      ],
      note: [
        { x: 25, y: 42, etichetta: "Arrivo dei gas caldi" },
        { x: 60, y: 12, etichetta: "Serbatoi del vapore", verso: "giu" },
        { x: 64, y: 55, etichetta: "Tubi del vapore" }
      ]
    },

    camino: {
      titolo: "Camino",
      testo: "Dopo aver ceduto il calore, i fumi escono dal camino. Il gas naturale è il combustibile fossile più pulito: non lascia ceneri e produce pochissime polveri, per questo il fumo quasi non si vede. Ma nei fumi c'è anidride carbonica, che è invisibile e riscalda il clima. Gli strumenti in cima controllano di continuo che cosa esce.",
      img: "img/camino.webp",
      alt: "Cima di un camino d'acciaio sottile contro il cielo del mattino: dall'apertura esce un filo di fumo appena visibile; attorno, una piccola piattaforma con strumenti e una scala lungo il fianco.",
      fuoco: [55, 35],
      fasi: [1],
      note: [
        { x: 56, y: 7, etichetta: "Fumi", verso: "giu" },
        { x: 61, y: 24, etichetta: "Strumenti di misura" }
      ]
    },

    vapore: {
      titolo: "Turbina a vapore",
      testo: "Il vapore prodotto dalla caldaia arriva dai grandi tubi in alto e attraversa la turbina, spingendo file di pale sempre più grandi. La turbina gira e trascina l'alternatore collegato al suo albero. È la seconda macchina della centrale che produce movimento: per questo si parla di ciclo combinato.",
      img: "img/vapore.webp",
      alt: "Sala macchine: su un piano rialzato una lunga turbina a vapore dal guscio grigio, con grandi tubi che arrivano dall'alto a sinistra, collegata a destra a un alternatore cilindrico; sotto il piano, il grande cassone d'acciaio del condensatore con i tubi dell'acqua.",
      fuoco: [50, 45],
      fasi: [1, 2],
      punti: [
        { x: 76, y: 34, etichetta: "Alternatore", vai: "alternatore" },
        { x: 75, y: 72, etichetta: "Condensatore", vai: "condensatore" }
      ],
      note: [
        { x: 19, y: 14, etichetta: "Arrivo del vapore", verso: "giu" },
        { x: 38, y: 30, etichetta: "Turbina" }
      ]
    },

    alternatore: {
      titolo: "Alternatore",
      testo: "L'alternatore trasforma il movimento in elettricità. Il rotore, un cilindro che funziona da elettromagnete, gira dentro lo statore, un anello fisso di avvolgimenti di rame. Il campo magnetico in movimento fa nascere una corrente nei fili: è l'induzione elettromagnetica. Il principio è lo stesso dell'alternatore di una centrale idroelettrica; cambia la forma, perché qui il rotore gira molto più veloce.",
      img: "img/alternatore.webp",
      alt: "Spaccato di un grande alternatore orizzontale: al centro il rotore, un lungo cilindro liscio d'acciaio sull'albero; attorno, lo statore rivestito di spessi avvolgimenti di rame.",
      fuoco: [52, 45],
      fasi: [2, 3],
      note: [
        { x: 55, y: 20, etichetta: "Statore" },
        { x: 58, y: 45, etichetta: "Rotore" },
        { x: 12, y: 42, etichetta: "Albero" }
      ]
    },

    condensatore: {
      titolo: "Condensatore",
      testo: "Uscito dalla turbina, il vapore ha finito il suo lavoro. Qui incontra migliaia di tubi freddi, dentro cui scorre l'acqua di raffreddamento: si raffredda e torna acqua liquida, che viene pompata di nuovo nella caldaia. L'acqua della caldaia gira sempre in tondo; il calore tolto al vapore, invece, è energia che la centrale non riesce a usare.",
      img: "img/condensatore.webp",
      alt: "Spaccato di un condensatore: un cassone d'acciaio pieno di file di tubi orizzontali; il vapore bianco entra dall'alto, si condensa in gocce che cadono in una vasca d'acqua sul fondo; a sinistra i grossi tubi blu dell'acqua di raffreddamento.",
      fuoco: [52, 45],
      fasi: [1],
      note: [
        { x: 57, y: 12, etichetta: "Vapore in arrivo", verso: "giu" },
        { x: 55, y: 38, etichetta: "Tubi freddi" },
        { x: 72, y: 74, etichetta: "Acqua condensata" }
      ]
    },

    raffreddamento: {
      titolo: "Torri di raffreddamento",
      testo: "L'acqua che ha raffreddato il condensatore è diventata tiepida e va raffreddata a sua volta. Nelle torri cade a pioggia mentre i ventilatori aspirano l'aria: una parte evapora e porta via il calore. Le nuvole bianche che escono non sono fumo: sono vapore acqueo. Più o meno metà dell'energia del gas diventa elettricità; il resto se ne va come calore, da qui e dal camino.",
      img: "img/raffreddamento.webp",
      alt: "Fila di torri di raffreddamento basse e rettangolari: dai grandi ventilatori in cima escono nuvole bianche di vapore, dai fianchi aperti si vede l'acqua che cade a pioggia in una vasca; in primo piano a sinistra grossi tubi blu.",
      fuoco: [50, 40],
      fasi: [1],
      note: [
        { x: 50, y: 12, etichetta: "Vapore acqueo", verso: "giu" },
        { x: 30, y: 45, etichetta: "Acqua che cade" },
        { x: 70, y: 78, etichetta: "Vasca di raccolta" }
      ]
    },

    stazione: {
      titolo: "Stazione elettrica",
      testo: "L'elettricità prodotta dagli alternatori deve viaggiare anche per centinaia di chilometri. Prima di partire passa dai trasformatori, che ne alzano la tensione. A parità di potenza, con una tensione più alta nei cavi scorre meno corrente, e si disperde meno energia sotto forma di calore.",
      img: "img/stazione.webp",
      alt: "Stazione elettrica all'aperto: a sinistra un grande trasformatore grigio con radiatori e alti isolatori, al centro strutture d'acciaio con sbarre e interruttori, a destra un traliccio da cui partono le linee; sullo sfondo la centrale con il suo camino.",
      fuoco: [45, 50],
      fasi: [3],
      punti: [
        { x: 16, y: 52, etichetta: "Trasformatore", vai: "trasformatore" },
        { x: 84, y: 30, etichetta: "Linee ad alta tensione", vai: "linee", lato: "sx" }
      ],
      note: [
        { x: 52, y: 58, etichetta: "Interruttori" }
      ]
    },

    trasformatore: {
      titolo: "Trasformatore",
      testo: "Dentro il trasformatore ci sono due avvolgimenti di filo attorno a un nucleo di ferro. Se i due avvolgimenti hanno un numero diverso di spire, la tensione in uscita è diversa da quella in entrata. In centrale la tensione viene alzata fino a centinaia di migliaia di volt. È la stessa macchina che c'è in una centrale idroelettrica: da qui in poi l'elettricità è uguale, qualunque sia la fonte.",
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
      testo: "I tralicci sostengono i cavi che portano l'energia dalla centrale ai centri abitati. I cavi sono appesi a catene di isolatori in vetro o ceramica, che impediscono alla corrente di scaricarsi sul metallo del traliccio. In Italia le linee aeree più potenti lavorano a 380.000 volt. Vicino alle città altri trasformatori riabbassano la tensione, fino ai 230 volt delle prese di casa.",
      img: "img/linee.webp",
      alt: "Linea ad alta tensione sopra una pianura coltivata: in primo piano a sinistra la cima di un traliccio con le catene di isolatori di vetro, in lontananza altri tralicci in fila verso una città; all'orizzonte la centrale.",
      fuoco: [40, 45],
      fasi: [3],
      note: [
        { x: 35, y: 36, etichetta: "Isolatori" },
        { x: 56, y: 42, etichetta: "Traliccio" },
        { x: 88, y: 52, etichetta: "Verso la città", lato: "sx" }
      ]
    }
  }
};
