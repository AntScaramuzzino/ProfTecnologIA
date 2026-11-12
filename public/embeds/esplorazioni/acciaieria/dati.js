/*
 * Contenuti dell'esplorazione. Il motore (index.html) legge solo questo file.
 *
 * Ogni nodo è una scena:
 *   titolo, testo   → quello che compare nel pannello
 *   img, alt        → immagine della scena (16:9) e descrizione per chi non la vede
 *   fuoco: [x, y]   → punto tenuto al centro quando l'immagine viene ritagliata (schermi verticali)
 *   fasi: [..]      → a che punto della trasformazione del ferro si è (indici di catena.fasi)
 *   punti: [..]     → punti cliccabili: { x, y, etichetta, vai: "id-del-nodo" }
 *   note:  [..]     → parti della scena senza una scena propria: { x, y, etichetta, testo }
 *                         toccando l'etichetta, il testo (una o due frasi) prende il posto di quello della scena
 * Le coordinate x, y sono percentuali dell'immagine, da sinistra e dall'alto.
 */
window.ESPLORAZIONE = {
  id: "acciaieria",
  indirizzo: "https://book.proftecnologia.it/embeds/esplorazioni/acciaieria/",   // indirizzo pubblico: serve al pulsante «Condividi» e al QR code
  lingua: "it",
  radice: "stabilimento",
  catena: { etichetta: "Materia", fasi: ["minerale", "ghisa", "acciaio", "semilavorato", "laminato"] },
  nodi: {
    stabilimento: {
      titolo: "L'acciaieria",
      testo: "Questo è uno stabilimento siderurgico a ciclo integrato: qui il minerale di ferro diventa acciaio. Le navi portano minerale e carbone, che aspettano nel parco. L'altoforno li trasforma in ghisa, l'acciaieria trasforma la ghisa in acciaio, il laminatoio lo schiaccia in lamiere sottili. Tocca i punti e segui il ferro dalla roccia al rotolo di lamiera.",
      img: "img/stabilimento.webp",
      alt: "Veduta aerea di un grande stabilimento siderurgico all'alba: a sinistra lunghi cumuli di minerale rosso e di carbone nero, al centro l'altoforno con le sue torri accanto, a destra un lungo capannone; in basso a destra file di rotoli di lamiera; sullo sfondo il mare con una nave.",
      fuoco: [55, 45],
      fasi: [0, 1, 2, 3, 4],
      punti: [
        { x: 22, y: 40, etichetta: "Parco minerali", vai: "parco", lato: "sx" },
        { x: 54, y: 22, etichetta: "Altoforno", vai: "altoforno" },
        { x: 85, y: 45, etichetta: "Acciaieria", vai: "convertitore" },
        { x: 78, y: 78, etichetta: "Laminatoio e bobine", vai: "laminatoio" }
      ],
      note: [
        { x: 82, y: 17, etichetta: "Porto", testo: "Il minerale di ferro e il carbone arrivano via mare, spesso da altri continenti. Per questo molte acciaierie stanno sulla costa." }
      ]
    },
    parco: {
      titolo: "Il parco minerali",
      testo: "Prima di entrare nell'altoforno, le materie prime aspettano nel parco: lunghi cumuli di minerale di ferro, rossastro, e di carbone, nero. Grandi macchine con una ruota a tazze li ammucchiano e li riprendono, e i nastri trasportatori li portano agli impianti. Il carbone non si carica così com'è: prima viene cotto senz'aria e diventa coke, un materiale resistente e poroso fatto quasi solo di carbonio.",
      img: "img/parco.webp",
      alt: "Un lungo cumulo di minerale rossastro a sinistra e uno di carbone nero a destra; tra i due un nastro trasportatore; sopra il minerale una grande macchina con una ruota a tazze in punta a un lungo braccio; in fondo l'altoforno e le ciminiere.",
      fuoco: [45, 45],
      fasi: [0],
      punti: [
        { x: 52, y: 58, etichetta: "Il minerale", vai: "minerale" }
      ],
      note: [
        { x: 20, y: 40, etichetta: "Ruota a tazze", lato: "sx", testo: "Girando, le tazze scavano nel cumulo e versano il materiale sul nastro." },
        { x: 88, y: 62, etichetta: "Carbone", testo: "Diventerà coke. Nell'altoforno il coke fa due lavori: brucia e scalda, e strappa l'ossigeno al minerale." },
        { x: 72, y: 58, etichetta: "Nastro trasportatore", verso: "giu", testo: "Porta il materiale agli impianti senza camion: in un grande stabilimento i nastri sono lunghi chilometri." }
      ]
    },
    minerale: {
      titolo: "Il minerale di ferro",
      testo: "Il ferro, in natura, non si trova quasi mai puro: è legato all'ossigeno. Questa è ematite, un ossido di ferro. Quella pura contiene circa il 70% di ferro: il resto è ossigeno. Per avere il metallo bisogna togliere l'ossigeno al minerale, ed è il compito dell'altoforno. Il colore rosso della polvere è lo stesso della ruggine: anche la ruggine è ossido di ferro, con un po' d'acqua.",
      img: "img/minerale.webp",
      alt: "Macro di alcuni grossi pezzi di minerale di ferro su un fondo scuro: rocce pesanti, rosso-brune, con facce grigie dai riflessi metallici, e polvere rossa tutto intorno.",
      fuoco: [45, 50],
      fasi: [0],
      note: [
        { x: 36, y: 50, etichetta: "Ematite", testo: "Il minerale di ferro più usato. Si estrae in grandi miniere a cielo aperto, per esempio in Australia e in Brasile." },
        { x: 80, y: 22, etichetta: "Riflessi metallici", testo: "Alcune facce dell'ematite luccicano come metallo, ma sono ancora ossido: il ferro metallico non c'è." },
        { x: 62, y: 88, etichetta: "Polvere rossa", verso: "giu", testo: "L'ematite macinata è rossa: si usa da migliaia di anni come pigmento per dipingere." }
      ]
    },
    altoforno: {
      titolo: "L'altoforno",
      testo: "L'altoforno è una torre che lavora giorno e notte per anni senza spegnersi. Dall'alto il nastro scarica a strati minerale, coke e calcare; dal basso entra aria caldissima. Il coke brucia e produce un gas, il monossido di carbonio, che strappa l'ossigeno al minerale. Il ferro liberato fonde, cola in basso e si raccoglie sul fondo: è la ghisa, ferro con il 2-4,5% di carbonio.",
      img: "img/altoforno.webp",
      alt: "Un altoforno controluce all'alba: al centro la torre d'acciaio piena di tubi e passerelle, a sinistra un lungo nastro trasportatore inclinato che sale fino alla cima, a destra tre alte torri cilindriche affiancate; dalle torri esce vapore.",
      fuoco: [55, 45],
      fasi: [0, 1],
      punti: [
        { x: 47, y: 60, etichetta: "La colata di ghisa", vai: "ghisa" }
      ],
      note: [
        { x: 24, y: 46, etichetta: "Nastro di carica", lato: "sx", testo: "Porta in cima minerale, coke e calcare. Il calcare cattura le impurità della roccia e forma la scoria." },
        { x: 84, y: 45, etichetta: "Cowper", testo: "Torri piene di mattoni refrattari. Si scaldano bruciando il gas che esce dall'altoforno, poi cedono il calore all'aria soffiata dentro: più di mille gradi." },
        { x: 46, y: 12, etichetta: "Bocca di carica", testo: "Qui il materiale entra a strati. Scende lentamente e impiega diverse ore ad arrivare in fondo." }
      ]
    },
    ghisa: {
      titolo: "La ghisa",
      testo: "Più volte al giorno si apre un foro alla base dell'altoforno e la ghisa liquida esce, a circa 1.500 gradi, scorrendo in un canale di materiale refrattario. Sopra galleggia la scoria, più leggera, che viene deviata in un altro canale. La ghisa contiene troppo carbonio: è dura ma fragile, si spezza invece di piegarsi. Per diventare acciaio deve perdere gran parte del suo carbonio.",
      img: "img/ghisa.webp",
      alt: "Alla base di un altoforno, a sinistra, un getto di metallo liquido arancione esce da un foro e scorre in un lungo canale sul pavimento, che attraversa l'immagine fino in basso a destra; scintille nell'aria.",
      fuoco: [45, 50],
      fasi: [1],
      note: [
        { x: 16, y: 38, etichetta: "Foro di colata", lato: "sx", testo: "Si apre con una perforatrice e alla fine si richiude con un tappo di argilla refrattaria." },
        { x: 78, y: 72, etichetta: "Canale", verso: "giu", testo: "È rivestito di materiale refrattario, che sopporta il metallo liquido senza fondere." },
        { x: 72, y: 30, etichetta: "Altoforno", testo: "Alla sua base si raccoglie la ghisa liquida, con la scoria che le galleggia sopra." }
      ]
    },
    convertitore: {
      titolo: "Il convertitore",
      testo: "Nell'acciaieria la ghisa liquida viene versata nel convertitore, un grande recipiente d'acciaio rivestito di mattoni refrattari, insieme a rottame, circa un quarto del carico. Una lancia raffreddata ad acqua soffia ossigeno puro sul bagno: il carbonio in più brucia e se ne va come gas, e in una ventina di minuti la ghisa è diventata acciaio, con meno del 2% di carbonio, di solito molto meno. Poi il convertitore si inclina e versa l'acciaio nella siviera.",
      img: "img/convertitore.webp",
      alt: "Un grande recipiente d'acciaio, a destra, inclinato: dalla sua bocca un getto di acciaio liquido abbagliante cade in un enorme secchio d'acciaio in basso al centro, tra nuvole di scintille.",
      fuoco: [55, 50],
      fasi: [1, 2],
      punti: [
        { x: 56, y: 73, etichetta: "Siviera", vai: "colata" }
      ],
      note: [
        { x: 78, y: 38, etichetta: "Convertitore", testo: "Ruota su due perni: si inclina per ricevere rottame e ghisa, si raddrizza per il soffio di ossigeno, si inclina dall'altra parte per versare." },
        { x: 50, y: 58, etichetta: "Getto d’acciaio", lato: "sx", testo: "Intorno ai 1.600 gradi. Il bagliore è così forte che gli operatori lo guardano da lontano, dietro vetri protettivi." }
      ]
    },
    colata: {
      titolo: "La colata continua",
      testo: "La siviera versa l'acciaio in una vasca, la paniera, che lo distribuisce in uno stampo di rame raffreddato ad acqua, la lingottiera. A contatto con il rame si forma subito una crosta solida, mentre dentro l'acciaio è ancora liquido. Il nastro d'acciaio scende piegandosi lungo una curva di rulli, spruzzato d'acqua, finché diventa solido in tutto lo spessore. Alla fine viene tagliato a pezzi: le bramme.",
      img: "img/colata.webp",
      alt: "In alto a sinistra una siviera versa acciaio liquido in una vasca; da sotto la vasca esce un nastro d'acciaio incandescente che scende curvando e prosegue verso destra su una lunga fila di rulli; spruzzi d'acqua e vapore.",
      fuoco: [55, 50],
      fasi: [2, 3],
      punti: [
        { x: 88, y: 60, etichetta: "Il nastro tagliato: la bramma", vai: "bramma" }
      ],
      note: [
        { x: 36, y: 30, etichetta: "Paniera", testo: "Una vasca che fa da serbatoio: mentre si cambia la siviera vuota con una piena, la colata non si ferma." },
        { x: 52, y: 60, etichetta: "Spruzzi d’acqua", lato: "sx", testo: "Raffreddano il nastro dall'esterno verso l'interno, a poco a poco." }
      ]
    },
    bramma: {
      titolo: "La bramma",
      testo: "La bramma è un grande blocco piatto d'acciaio, spesso di solito 20-25 centimetri e largo fino a un paio di metri: può pesare 20-30 tonnellate. È un semilavorato, cioè un prodotto a metà strada: non serve così com'è, ma verrà scaldata di nuovo e laminata fino a diventare lamiera. Dentro, l'acciaio solido non è una massa uniforme: è fatto di grani.",
      img: "img/bramma.webp",
      alt: "Una grossa lastra d'acciaio incandescente, arancione, appoggiata su una fila di rulli; in primo piano la sua testata tagliata; a destra, sullo sfondo, cataste di lastre già fredde e grigie.",
      fuoco: [55, 50],
      fasi: [3],
      punti: [
        { x: 65, y: 58, etichetta: "Dentro l’acciaio", vai: "grani" }
      ],
      note: [
        { x: 80, y: 18, etichetta: "Bramme fredde", testo: "Raffreddandosi, l'acciaio perde il colore: sotto i 500 gradi circa non si vede più brillare." },
        { x: 88, y: 76, etichetta: "Rulli", verso: "giu", testo: "Spostano le bramme senza sollevarle: sopportano il peso e il calore." }
      ]
    },
    grani: {
      titolo: "I grani dell'acciaio",
      testo: "Ecco l'acciaio al microscopio, dopo averlo lucidato a specchio e attaccato con un acido. È fatto di tanti piccoli cristalli, i grani, larghi pochi centesimi di millimetro. I grani chiari sono ferrite, ferro quasi puro, morbido e duttile. Quelli scuri sono perlite: strati sottilissimi di ferrite alternati a un composto duro di ferro e carbonio, la cementite. Più carbonio c'è (fino a circa lo 0,8%), più perlite c'è, e l'acciaio diventa più duro ma meno capace di piegarsi.",
      img: "img/grani.webp",
      alt: "Immagine al microscopio in bianco e nero: un mosaico di grani chiari dai bordi sottili e scuri, con alcuni grani più scuri e striati sparsi qua e là.",
      fuoco: [50, 50],
      fasi: [3],
      punti: [
        { x: 52, y: 42, etichetta: "Gli atomi", vai: "atomi" }
      ],
      note: [
        { x: 30, y: 28, etichetta: "Ferrite", testo: "Ferro quasi puro: può sciogliere pochissimo carbonio." },
        { x: 77, y: 70, etichetta: "Perlite", verso: "giu", testo: "Il nome viene dal suo aspetto: ingrandita ancora di più, le lamelle luccicano come madreperla." },
        { x: 78, y: 50, etichetta: "Bordo di grano", testo: "Il confine tra due cristalli orientati in modo diverso." }
      ]
    },
    atomi: {
      titolo: "Gli atomi di ferro e di carbonio",
      testo: "È un'illustrazione: gli atomi sono troppo piccoli per una normale fotografia: si possono «vedere» solo con microscopi speciali, e questo è un modello. Dentro un grano gli atomi di ferro stanno in file ordinate, ripetute in tutte le direzioni: è un reticolo cristallino. Pochi atomi di carbonio, più piccoli, si infilano negli spazi tra gli atomi di ferro, spingendoli un po' di lato; quasi tutti gli altri si legano al ferro nella cementite della perlite. Il carbonio ostacola lo scorrere delle file di atomi le une sulle altre: per questo l'acciaio è più duro e resistente del ferro puro. Nel modello ce ne sono molti di più che nel vero acciaio, dove c'è circa un atomo di carbonio ogni cento di ferro.",
      img: "img/atomi.webp",
      alt: "Illustrazione su fondo nero: grandi sfere argentate unite da bacchette in un reticolo a forma di cubi, e tra loro molte sferette nere più piccole.",
      fuoco: [50, 45],
      fasi: [3],
      note: [
        { x: 52, y: 22, etichetta: "Atomo di ferro", testo: "Nel reticolo ogni atomo ha sempre gli stessi vicini, alla stessa distanza." },
        { x: 69, y: 44, etichetta: "Atomo di carbonio", testo: "Un po' troppo grande per lo spazio in cui si infila: deforma il reticolo, e così lo rende più duro." },
        { x: 77, y: 23, etichetta: "Reticolo", testo: "Le bacchette non esistono: indicano solo quali atomi sono vicini." }
      ]
    },
    laminatoio: {
      titolo: "Il laminatoio",
      testo: "La bramma viene riscaldata in un forno fino a circa 1.200 gradi, quando l'acciaio è arancione chiaro e si lascia deformare. Poi passa tra coppie di cilindri d'acciaio enormi, una gabbia dopo l'altra: a ogni passaggio diventa più sottile e più lunga, come una sfoglia sotto il mattarello. Da più di 20 centimetri si arriva a pochi millimetri di spessore, e il nastro può superare il chilometro di lunghezza.",
      img: "img/laminatoio.webp",
      alt: "In primo piano un nastro d'acciaio incandescente esce da due grossi cilindri d'acciaio lucidi, tra spruzzi d'acqua; dietro, una fila di altre gabbie di laminazione in cui il nastro continua, sempre più sottile, verso il fondo del capannone.",
      fuoco: [45, 45],
      fasi: [3, 4],
      punti: [
        { x: 86, y: 42, etichetta: "Le bobine", vai: "bobine" }
      ],
      note: [
        { x: 28, y: 28, etichetta: "Cilindri", testo: "Girano in senso opposto e trascinano il nastro mentre lo schiacciano." },
        { x: 48, y: 40, etichetta: "Gabbia", lato: "sx", testo: "La struttura d'acciaio che tiene i cilindri. Deve resistere a forze di migliaia di tonnellate." },
        { x: 68, y: 62, etichetta: "Getti d’acqua", verso: "giu", testo: "Tolgono la scaglia, lo strato di ossido che si forma sull'acciaio caldo, e raffreddano i cilindri." }
      ]
    },
    bobine: {
      titolo: "Le bobine",
      testo: "Alla fine del laminatoio il nastro sottile viene avvolto su sé stesso: diventa una bobina, un rotolo che può pesare più di 20 tonnellate. Da qui partirà verso altre fabbriche, dove sarà tagliato e piegato per fare scocche di automobili, elettrodomestici, tubi, serbatoi. Quando questi oggetti arriveranno a fine vita, il loro acciaio non andrà perso: tornerà come rottame.",
      img: "img/bobine.webp",
      alt: "Un capannone luminoso con lunghe file di grandi rotoli di lamiera d'acciaio, appoggiati su un fianco; il primo, in primo piano a sinistra, mostra il foro centrale; in alto un carroponte giallo con una pinza.",
      fuoco: [40, 50],
      fasi: [4],
      punti: [
        { x: 64, y: 54, etichetta: "A fine vita: il rottame", vai: "rottami" }
      ],
      note: [
        { x: 34, y: 59, etichetta: "Bobina", lato: "sx", testo: "Il foro al centro è il segno dell'aspo su cui il nastro è stato avvolto." },
        { x: 63, y: 22, etichetta: "Carroponte", testo: "Una gru che corre su rotaie lungo il soffitto: solleva le bobine con una pinza." }
      ]
    },
    rottami: {
      titolo: "Il rottame",
      testo: "Travi, lamiere, automobili, fili: l'acciaio usato si raccoglie e torna in acciaieria. Un grande elettromagnete lo solleva: quasi tutto l'acciaio è attratto dalla calamita, e così è facile separarlo da altri materiali. L'acciaio si può rifondere molte volte senza perdere le sue qualità, purché il rottame sia ben separato dagli altri metalli. Il rottame viene caricato in grandi ceste e portato al forno elettrico.",
      img: "img/rottami.webp",
      alt: "A sinistra una montagna di rottami d'acciaio: lamiere, travi, un'auto schiacciata, matasse di filo; al centro un grande elettromagnete rotondo appeso a una gru solleva un grappolo di rottami; in basso a destra una cesta d'acciaio a griglia; sullo sfondo lo stabilimento al tramonto.",
      fuoco: [55, 45],
      fasi: [2],
      punti: [
        { x: 72, y: 78, etichetta: "Cesta di carica", vai: "forno" }
      ],
      note: [
        { x: 66, y: 20, etichetta: "Elettromagnete", lato: "sx", testo: "Funziona solo finché passa la corrente: quando la si toglie, il rottame cade." },
        { x: 25, y: 32, etichetta: "Rottame", lato: "sx", testo: "Prima della fusione si separano i materiali che rovinerebbero l'acciaio, come il rame dei fili elettrici: una volta fuso con l'acciaio, non si riesce più a togliere." }
      ]
    },
    forno: {
      titolo: "Il forno elettrico ad arco",
      testo: "Il forno elettrico fonde il rottame con l'elettricità. Dalla volta scendono tre grossi elettrodi di grafite: la corrente salta tra gli elettrodi e il metallo formando archi elettrici, e il rottame fonde; alla fine il bagno d'acciaio arriva a 1.600-1.700 gradi. Partire dal rottame richiede molta meno energia che partire dal minerale, perché il ferro è già metallo. In Italia quasi 9 tonnellate di acciaio su 10 si producono così.",
      img: "img/forno.webp",
      alt: "Un forno rotondo e massiccio con una volta a cupola, da cui escono tre grossi cilindri scuri, gli elettrodi, tenuti da bracci d'acciaio; sopra, fasci di cavi; dal bordo della volta escono una luce arancione e scintille.",
      fuoco: [50, 45],
      fasi: [2],
      punti: [
        { x: 49, y: 44, etichetta: "Gli archi elettrici", vai: "arco" }
      ],
      note: [
        { x: 57, y: 30, etichetta: "Elettrodi", testo: "Cilindri di grafite, che conduce la corrente e sopporta temperature altissime. Si consumano e vanno allungati man mano." },
        { x: 82, y: 18, etichetta: "Cavi", testo: "Portano correnti di decine di migliaia di ampere: sono raffreddati ad acqua." },
        { x: 70, y: 60, etichetta: "Volta", testo: "Il coperchio del forno. Si solleva e ruota di lato per caricare il rottame dall'alto." }
      ]
    },
    arco: {
      titolo: "L'arco elettrico",
      testo: "Tra la punta di un elettrodo e il metallo c'è uno spazio: la corrente lo attraversa lo stesso, trasformando il gas in un gas incandescente che conduce. È l'arco elettrico, lo stesso fenomeno di un fulmine, ma continuo. Nell'arco la temperatura arriva a diverse migliaia di gradi: il rottame sotto gli elettrodi fonde e si forma un bagno di acciaio liquido.",
      img: "img/arco.webp",
      alt: "Vista dall'interno di un forno: dall'alto scendono tre elettrodi scuri; dalle loro punte partono lampi bianco-azzurri che toccano un bagno di metallo fuso arancione; scintille e fumo.",
      fuoco: [50, 50],
      fasi: [2],
      note: [
        { x: 48, y: 22, etichetta: "Elettrodo", testo: "La punta è incandescente: è qui che la grafite si consuma." },
        { x: 68, y: 45, etichetta: "Arco", testo: "Una luce così intensa che si guarda solo attraverso vetri scurissimi, come quelli dei saldatori." },
        { x: 80, y: 66, etichetta: "Bagno d’acciaio", verso: "giu", testo: "Quando tutto il rottame è fuso, l'acciaio viene ripulito dalle impurità e prende la stessa strada di quello del convertitore: siviera, colata, laminatoio." }
      ]
    }
  }
};
