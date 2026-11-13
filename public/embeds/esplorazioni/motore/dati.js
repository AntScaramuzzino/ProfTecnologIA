/*
 * Contenuti dell'esplorazione. Il motore (index.html) legge solo questo file.
 *
 * Ogni nodo è una scena:
 *   titolo, testo   → quello che compare nel pannello
 *   img, alt        → immagine della scena (16:9) e descrizione per chi non la vede
 *   fuoco: [x, y]   → punto tenuto al centro quando l'immagine viene ritagliata (schermi verticali)
 *   fasi: [..]      → in quale forma è l'energia (indici di catena.fasi)
 *   punti: [..]     → punti cliccabili: { x, y, etichetta, vai: "id-del-nodo" }
 *   note:  [..]     → parti della scena senza una scena propria: { x, y, etichetta, testo }
 *                         toccando l'etichetta, il testo (una o due frasi) prende il posto di quello della scena
 * Le coordinate x, y sono percentuali dell'immagine, da sinistra e dall'alto.
 */
window.ESPLORAZIONE = {
  id: "motore",
  indirizzo: "https://book.proftecnologia.it/embeds/esplorazioni/motore/",   // indirizzo pubblico: serve al pulsante «Condividi» e al QR code
  lingua: "it",
  radice: "vano",
  laboratorio: { mc: "MC-ENE-3-05", titolo: "Dove va l'energia" },
  catena: { etichetta: "Energia", fasi: ["chimica", "termica", "meccanica"] },
  nodi: {
    vano: {
      titolo: "Il motore a quattro tempi",
      testo: "Sotto il cofano di questa automobile c'è un motore a scoppio a quattro tempi. Dentro i suoi cilindri la benzina brucia: l'energia chimica del carburante diventa calore, e il calore diventa movimento. Solo una parte, però: meno di un terzo arriva alle ruote, spesso un quarto o anche meno; il resto se ne va come calore dal radiatore e dal tubo di scarico. Tocca i punti e segui l'energia dal serbatoio alle ruote.",
      img: "img/vano.webp",
      alt: "Il vano motore di una piccola automobile, con il cofano aperto, visto dall'alto: al centro il motore, a sinistra la batteria, in basso il radiatore dietro la griglia, a destra la scatola del filtro dell'aria.",
      fuoco: [50, 50],
      fasi: [0, 1, 2],
      punti: [
        { x: 47, y: 35, etichetta: "Il motore", vai: "blocco" },
        { x: 50, y: 80, etichetta: "Radiatore", vai: "radiatore" },
        { x: 36, y: 58, etichetta: "Scarico", vai: "scarico", lato: "sx" }
      ],
      note: [
        { x: 19, y: 47, etichetta: "Batteria", lato: "sx", testo: "Una batteria a 12 volt: fa girare il motorino d'avviamento e alimenta la candela finché il motore non parte. Poi la ricarica l'alternatore, mosso dal motore stesso." },
        { x: 77, y: 52, etichetta: "Filtro dell'aria", testo: "Il motore respira: per bruciare un litro di benzina servono migliaia di litri d'aria, e il filtro la ripulisce dalla polvere." }
      ]
    },
    blocco: {
      lab: "cilindrata",
      titolo: "Il blocco motore",
      testo: "Ecco il motore tolto dall'auto, senza la parte superiore. Il blocco è un pezzo unico di metallo fuso, ghisa o lega di alluminio, in cui sono scavati quattro cilindri in fila. In ogni cilindro scorre un pistone, che sale e scende decine di volte al secondo. Sopra il blocco si avvita la testata, che chiude i cilindri e porta valvole e candele; sotto gira l'albero motore.",
      img: "img/blocco.webp",
      alt: "Un motore a quattro cilindri su un cavalletto da officina, senza testata: in alto quattro fori rotondi in fila, con la cima di un pistone in ciascuno; a destra la testata appoggiata sul banco; a sinistra il volano.",
      fuoco: [50, 50],
      fasi: [1, 2],
      punti: [
        { x: 32, y: 26, etichetta: "Pistone e biella", vai: "pistone" },
        { x: 77, y: 47, etichetta: "Testata", vai: "testata" },
        { x: 12, y: 40, etichetta: "Albero motore", vai: "albero", lato: "sx" }
      ],
      note: [
        { x: 33, y: 68, etichetta: "Coppa dell'olio", verso: "giu", testo: "Contiene l'olio che una pompa manda in tutto il motore: fa scivolare i pezzi senza consumarli e porta via una parte del calore." }
      ]
    },
    pistone: {
      lab: "quattrotempi",
      titolo: "Il pistone e la biella",
      testo: "Il pistone è un cilindro di lega di alluminio, leggero, che chiude il cilindro dal basso come lo stantuffo di una siringa. Nel tempo dello scoppio i gas che bruciano lo spingono giù con forza: è l'unico dei quattro tempi che produce movimento. La biella collega il pistone all'albero motore: insieme, trasformano il suo andare su e giù in un movimento che gira.",
      img: "img/pistone.webp",
      alt: "Un pistone di alluminio unito alla sua biella d'acciaio, in piedi su un banco da officina: tre anelli sottili attorno alla testa del pistone, un perno che lo attraversa, in basso l'occhio aperto della biella con il suo cappello accanto.",
      fuoco: [50, 45],
      fasi: [1, 2],
      note: [
        { x: 39, y: 13, etichetta: "Fasce elastiche", testo: "Tre anelli di metallo, ghisa o acciaio, nelle scanalature del pistone. I due più in alto tengono la pressione dentro il cilindro, l'ultimo raschia l'olio dalle pareti." },
        { x: 40, y: 24, etichetta: "Spinotto", testo: "Il perno che unisce il pistone alla biella e la lascia oscillare." },
        { x: 63, y: 80, etichetta: "Testa di biella", verso: "giu", testo: "Si chiude con un cappello avvitato attorno a un gomito dell'albero motore, su un cuscinetto lubrificato dall'olio." }
      ]
    },
    albero: {
      titolo: "L'albero motore",
      testo: "L'albero motore, o albero a gomiti, è un pezzo d'acciaio forgiato a gomiti, con quattro manovelle, una per cilindro. Ogni biella spinge la sua manovella come la gamba spinge il pedale della bicicletta, e l'albero gira. I cilindri non scoppiano tutti insieme ma a turno, così l'albero riceve una spinta ogni mezzo giro e gira in modo regolare. Dall'albero, attraverso il cambio, il movimento arriva alle ruote.",
      img: "img/albero.webp",
      alt: "Un albero a gomiti d'acciaio lucido disteso su un banco: quattro manovelle sfalsate con pesanti contrappesi, a sinistra un disco con una corona dentata, a destra un piccolo ingranaggio.",
      fuoco: [50, 50],
      fasi: [2],
      note: [
        { x: 42, y: 54, etichetta: "Manovella", testo: "Il gomito dell'albero: la biella lo spinge da un lato e lo fa girare." },
        { x: 56, y: 56, etichetta: "Contrappeso", verso: "giu", testo: "Bilancia il peso di manovella e biella, perché l'albero giri senza scuotere tutto il motore." },
        { x: 16, y: 50, etichetta: "Volano", lato: "sx", testo: "Un disco pesante: una volta in movimento tende a continuare a girare e rende più regolari le spinte dei pistoni." }
      ]
    },
    testata: {
      titolo: "La testata",
      testo: "La testata chiude dall'alto i quattro cilindri. Per ogni cilindro ha le valvole, porte che si aprono e si chiudono al momento giusto, e una candela. Le valvole sono comandate dagli alberi a camme, che girano grazie a una cinghia (in altri motori una catena) collegata all'albero motore: fanno un giro ogni due giri dell'albero motore, perché ogni valvola si apre una volta ogni quattro tempi.",
      img: "img/testata.webp",
      alt: "Una testata di alluminio vista dall'alto: due alberi a camme paralleli con camme a forma di uovo, sotto di loro file di molle, sul lato vicino quattro fori per le candele, uno con una candela infilata a metà, a destra una puleggia dentata con la cinghia.",
      fuoco: [50, 50],
      fasi: [1, 2],
      punti: [
        { x: 45, y: 31, etichetta: "Valvole e camme", vai: "valvole" },
        { x: 31, y: 52, etichetta: "Candela", vai: "candela", lato: "sx" }
      ],
      note: [
        { x: 89, y: 50, etichetta: "Cinghia di distribuzione", testo: "Collega l'albero motore agli alberi a camme: se si rompe, pistoni e valvole possono urtarsi." }
      ]
    },
    valvole: {
      titolo: "Le valvole e le camme",
      testo: "Ogni valvola è un fungo d'acciaio: il gambo scorre in un foro della testata, la testa chiude il passaggio verso il cilindro. Una molla la tiene chiusa. Quando la camma, girando, preme sul gambo con la sua punta, la valvola si apre; quando la punta è passata, la molla la richiude. La valvola di aspirazione fa entrare aria e benzina, quella di scarico fa uscire i gas bruciati.",
      img: "img/valvole.webp",
      alt: "Due valvole d'acciaio su un banco, gambi lunghi e teste rotonde, una più grande dell'altra; accanto una molla e un albero a camme.",
      fuoco: [50, 50],
      fasi: [2],
      note: [
        { x: 15, y: 46, etichetta: "Valvola di aspirazione", testo: "Ha la testa più grande: deve far entrare in fretta la miscela di aria e benzina." },
        { x: 50, y: 64, etichetta: "Valvola di scarico", testo: "È la più calda delle due: lambita dai gas appena bruciati, può superare i 700 gradi." },
        { x: 33, y: 18, etichetta: "Albero a camme", testo: "Le sporgenze lungo l'albero sono le camme: la loro forma decide quando la valvola si apre, di quanto e per quanto tempo." }
      ]
    },
    candela: {
      titolo: "La candela",
      testo: "La candela accende la miscela di aria e benzina alla fine della compressione, un attimo prima che il pistone arrivi in cima. È avvitata nella testata, con la punta dentro il cilindro. Un componente dell'auto, la bobina, trasforma i 12 volt della batteria in decine di migliaia di volt, e li manda alla candela nell'istante giusto, migliaia di volte al minuto.",
      img: "img/candela.webp",
      alt: "Una candela d'accensione nuova distesa su un banco scuro: isolante di ceramica bianca in alto, corpo esagonale d'acciaio al centro, filettatura in basso a destra con il piccolo elettrodo piegato in punta.",
      fuoco: [50, 50],
      fasi: [0, 1],
      punti: [
        { x: 77, y: 71, etichetta: "Gli elettrodi", vai: "elettrodi" }
      ],
      note: [
        { x: 32, y: 22, etichetta: "Isolante di ceramica", lato: "sx", testo: "La ceramica non lascia passare la corrente: così la scarica non scappa verso il corpo della candela." },
        { x: 62, y: 62, etichetta: "Filettatura", testo: "Serve ad avvitare la candela nella testata, chiudendo bene il cilindro." }
      ]
    },
    elettrodi: {
      titolo: "Gli elettrodi",
      testo: "In punta alla candela ci sono due elettrodi di metallo, separati da uno spazio di circa un millimetro. Quando arriva l'alta tensione, la corrente salta attraverso il gas da un elettrodo all'altro: è la scintilla. In quel punto la miscela si accende, e la fiamma si allarga in tutto il cilindro in pochi millesimi di secondo, a temperature di oltre 2.000 gradi.",
      img: "img/elettrodi.webp",
      alt: "Primo piano della punta di una candela: l'elettrodo centrale che esce dalla ceramica bianca, l'elettrodo piegato sopra, e tra i due una scintilla azzurra.",
      fuoco: [50, 50],
      fasi: [0, 1],
      punti: [
        { x: 42, y: 29, etichetta: "Dentro la scintilla", vai: "scintilla" }
      ],
      note: [
        { x: 43, y: 47, etichetta: "Elettrodo centrale", lato: "sx", testo: "Riceve l'alta tensione. Spesso ha la punta di metalli preziosi, come platino o iridio, che si consumano poco." },
        { x: 25, y: 20, etichetta: "Elettrodo di massa", testo: "È collegato al corpo della candela, quindi al motore: la scintilla chiude il circuito." }
      ]
    },
    scintilla: {
      titolo: "Dentro la scintilla",
      testo: "È un'illustrazione: a questa scala nessuna fotografia è possibile. Un gas, come la miscela di aria e benzina, normalmente non conduce la corrente. Ma con decine di migliaia di volt tra gli elettrodi, gli elettroni vengono strappati via dalle sue molecole e corrono da un elettrodo all'altro: il gas diventa un plasma, un canale caldissimo che conduce e brilla. Il calore del plasma basta ad accendere la miscela di aria e benzina tutt'intorno.",
      img: "img/scintilla.webp",
      alt: "Illustrazione dello spazio tra due elettrodi: un canale di luce violetta brillante, molecole d'aria rappresentate da sfere, alcune spezzate, e tanti puntini luminosi, gli elettroni, che corrono da un elettrodo all'altro.",
      fuoco: [50, 50],
      fasi: [0, 1],
      note: [
        { x: 50, y: 48, etichetta: "Plasma", testo: "Il quarto stato della materia: un gas in cui gli elettroni si sono staccati dagli atomi. Anche i fulmini sono plasma." },
        { x: 23, y: 42, etichetta: "Elettroni", lato: "sx", testo: "Particelle piccolissime con carica negativa: il loro movimento è la corrente elettrica." }
      ]
    },
    carburante: {
      titolo: "Il carburante",
      testo: "Il motore riceve la sua energia dalla benzina, un liquido ricavato dal petrolio. In un litro di benzina c'è un'energia chimica di circa 9 chilowattora: più o meno quella che consuma un frigorifero di casa in due-tre settimane. Il serbatoio di un'utilitaria ne contiene una quarantina di litri e si riempie in un paio di minuti: è il grande vantaggio dei motori a combustibile.",
      img: "img/carburante.webp",
      alt: "Il bocchettone del carburante di un'automobile argentata, aperto, con la pistola della pompa infilata dentro e il tubo che curva verso sinistra; il distributore sfocato sullo sfondo.",
      fuoco: [50, 50],
      fasi: [0],
      punti: [
        { x: 76, y: 42, etichetta: "Le molecole della benzina", vai: "molecole" }
      ],
      note: [
        { x: 46, y: 29, etichetta: "Pistola erogatrice", lato: "sx", testo: "Si ferma da sola quando il serbatoio è pieno: un piccolo tubo sente il carburante che risale e chiude il flusso." }
      ]
    },
    molecole: {
      titolo: "Le molecole della benzina",
      testo: "È un'illustrazione: a questa scala nessuna fotografia è possibile. La benzina non è una sola sostanza: è una miscela di idrocarburi, molecole fatte solo di atomi di carbonio e di idrogeno, con catene di circa 4-12 atomi di carbonio. Nel cilindro, quando la miscela brucia, i loro atomi si staccano e si legano all'ossigeno dell'aria: il carbonio diventa anidride carbonica, l'idrogeno diventa acqua. I nuovi legami con l'ossigeno sono più forti di quelli di prima, e la differenza si libera: l'energia chimica diventa calore.",
      img: "img/molecole.webp",
      alt: "Illustrazione su fondo scuro: modelli a sfere e bastoncini di molecole di idrocarburi, catene a zig-zag di atomi neri di carbonio circondati da piccoli atomi bianchi di idrogeno; da destra si avvicinano alcune molecole di ossigeno, rosse.",
      fuoco: [50, 50],
      fasi: [0, 1],
      note: [
        { x: 50, y: 42, etichetta: "Idrocarburo", testo: "Una catena di atomi di carbonio, con gli atomi di idrogeno attaccati tutt'intorno. Il petrolio ne contiene di moltissimi tipi." },
        { x: 77, y: 43, etichetta: "Ossigeno", testo: "Arriva dall'aria aspirata nel cilindro. Senza ossigeno la benzina non brucia." },
        { x: 17, y: 26, etichetta: "Carbonio", testo: "Bruciando diventa anidride carbonica: circa 2,3 chili per ogni litro di benzina, che finiscono nell'aria." }
      ]
    },
    radiatore: {
      titolo: "Il radiatore",
      testo: "Più o meno un terzo dell'energia della benzina diventa calore che scalda il motore. Per non surriscaldarsi, il motore è attraversato da un liquido, acqua con un antigelo, che una pompa fa circolare. Il liquido caldo arriva al radiatore, scorre in tubicini sottili tra lamelle d'alluminio e cede il calore all'aria che le attraversa. Poi torna al motore, più fresco.",
      img: "img/radiatore.webp",
      alt: "Il radiatore di un'auto visto dall'interno del vano motore: un pannello rettangolare d'alluminio con una fitta griglia di lamelle, dietro una grande ventola nera, in alto a sinistra un tubo di gomma, a destra una vaschetta di plastica con liquido rosa.",
      fuoco: [50, 50],
      fasi: [1],
      note: [
        { x: 20, y: 48, etichetta: "Lamelle", testo: "Sottilissime e vicine: offrono all'aria una superficie grande per portare via il calore." },
        { x: 88, y: 42, etichetta: "Vaschetta del liquido", testo: "Il liquido si dilata quando si scalda: la vaschetta raccoglie quello in più." },
        { x: 14, y: 17, etichetta: "Manicotto", lato: "sx", testo: "Il tubo di gomma che porta il liquido caldo dal motore al radiatore." }
      ]
    },
    scarico: {
      titolo: "Lo scarico",
      testo: "I gas bruciati escono dai cilindri a centinaia di gradi e percorrono il tubo di scarico, sotto l'auto. Portano via con sé un'altra grossa parte dell'energia della benzina, sotto forma di calore. Lungo il tubo incontrano il catalizzatore, che rende meno nocivi alcuni gas, e il silenziatore, che smorza il rumore degli scoppi. Da sotto si vede anche il serbatoio, da cui una pompa manda la benzina al motore.",
      img: "img/scarico.webp",
      alt: "Il fondo di un'auto sollevata su un ponte, visto da sotto: il tubo di scarico corre dal motore, a sinistra, fino al retro, a destra; al centro un cilindro di metallo più grosso, il catalizzatore; verso il retro una grande scatola ovale, il silenziatore; accanto, una scatola scura, il serbatoio.",
      fuoco: [50, 50],
      fasi: [1],
      punti: [
        { x: 46, y: 26, etichetta: "Catalizzatore", vai: "catalizzatore" },
        { x: 73, y: 42, etichetta: "Serbatoio della benzina", vai: "carburante" }
      ],
      note: [
        { x: 78, y: 25, etichetta: "Silenziatore", testo: "Dentro ha camere e pareti forate che spezzano le onde di pressione degli scoppi." },
        { x: 90, y: 27, etichetta: "Terminale", verso: "giu", testo: "L'uscita dei gas. In inverno spesso gocciola: è l'acqua che si forma bruciando l'idrogeno della benzina." }
      ]
    },
    catalizzatore: {
      titolo: "Il catalizzatore",
      testo: "Aperto, il catalizzatore mostra dentro il suo guscio d'acciaio un blocco di ceramica attraversato per il lungo da migliaia di canali sottili. Mentre i gas li percorrono, tre sostanze nocive si trasformano: il monossido di carbonio diventa anidride carbonica, i resti di benzina incombusta diventano anidride carbonica e acqua, gli ossidi di azoto tornano azoto. L'anidride carbonica, però, resta. In Europa è obbligatorio sulle auto a benzina nuove dal 1993.",
      img: "img/catalizzatore.webp",
      alt: "Un catalizzatore su un banco da officina, con una finestra tagliata nel guscio d'acciaio: dentro si vede il blocco di ceramica con una fitta griglia di canali; dietro, un altro guscio vuoto.",
      fuoco: [50, 50],
      fasi: [1],
      punti: [
        { x: 52, y: 52, etichetta: "Il nido d’ape", vai: "nido" }
      ],
      note: [
        { x: 9, y: 50, etichetta: "Ingresso dei gas", lato: "sx", testo: "Da qui entrano i gas caldi. Il catalizzatore funziona bene solo sopra i 250-300 gradi: per questo nei primi minuti di guida inquina di più." }
      ]
    },
    nido: {
      titolo: "Il nido d'ape",
      testo: "Visti di fronte, i canali del catalizzatore formano un nido d'ape fittissimo, con pareti più sottili di un'unghia. Sulle pareti c'è uno strato con pochi grammi di metalli preziosi: platino, palladio e rodio. Non si consumano: fanno da catalizzatori, cioè rendono molto più veloci le reazioni che ripuliscono i gas. Tante pareti sottili offrono ai gas una superficie enorme in poco spazio.",
      img: "img/nido.webp",
      alt: "Primo piano frontale della ceramica a nido d'ape di un catalizzatore: una griglia fittissima di canali a sei lati con pareti sottili, in parte anneriti dalla fuliggine, dentro un anello di metallo.",
      fuoco: [50, 50],
      fasi: [1],
      note: [
        { x: 45, y: 40, etichetta: "Canali", testo: "Sono da qualche decina a più di cento per ogni centimetro quadrato." },
        { x: 70, y: 70, etichetta: "Metalli preziosi", verso: "giu", testo: "Sono così preziosi che i catalizzatori delle auto rottamate vengono raccolti per recuperarli." }
      ]
    }
  }
};
