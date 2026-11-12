/*
 * Contenuti dell'esplorazione. Il motore (index.html) legge solo questo file.
 *
 * Ogni nodo è una scena:
 *   titolo, testo   → quello che compare nel pannello
 *   img, alt        → immagine della scena (16:9) e descrizione per chi non la vede
 *   fuoco: [x, y]   → punto tenuto al centro quando l'immagine viene ritagliata (schermi verticali)
 *   fasi: [..]      → dove si trova il carico nel suo percorso verso il terreno (indici di catena.fasi)
 *   punti: [..]     → punti cliccabili: { x, y, etichetta, vai: "id-del-nodo" }
 *   note:  [..]     → parti della scena senza una scena propria: { x, y, etichetta, testo }
 *                         toccando l'etichetta, il testo (una o due frasi) prende il posto di quello della scena
 * Le coordinate x, y sono percentuali dell'immagine, da sinistra e dall'alto.
 */
window.ESPLORAZIONE = {
  id: "scheletro-edificio",
  indirizzo: "https://book.proftecnologia.it/embeds/esplorazioni/scheletro-edificio/",   // indirizzo pubblico: serve al pulsante «Condividi» e al QR code
  lingua: "it",
  radice: "cantiere",
  catena: { etichetta: "Carico", fasi: ["solaio", "trave", "pilastro", "fondazione", "terreno"] },
  nodi: {
    cantiere: {
      titolo: "Lo scheletro dell'edificio",
      testo: "Questo edificio in costruzione mostra il suo scheletro: un telaio di pilastri e travi in cemento armato. Il peso di ogni piano scende lungo lo scheletro fino alle fondazioni, e da lì al terreno. I muri di mattoni arrivano dopo: chiudono i vuoti, ma il peso lo porta il telaio. Tocca i punti e segui il carico dall'alto verso il basso.",
      img: "img/cantiere.webp",
      alt: "Un edificio di tre piani in costruzione, senza muri: pilastri e solai di calcestruzzo grigio, con le scale interne. A sinistra, al piano terra, un muro di mattoni rossi a metà. A destra una gru a torre gialla. In basso a destra, nello scavo accanto all'edificio, il reticolo di fondazioni di un nuovo corpo di fabbrica, da cui spuntano barre d'acciaio.",
      fuoco: [45, 45],
      fasi: [0, 1, 2, 3, 4],
      punti: [
        { x: 43, y: 42, etichetta: "Pilastro", vai: "pilastro" },
        { x: 25, y: 32, etichetta: "Solaio", vai: "solaio", lato: "sx" },
        { x: 82, y: 80, etichetta: "Fondazioni", vai: "fondazioni" },
        { x: 24, y: 56, etichetta: "Muro di mattoni", vai: "tamponamento", lato: "sx" }
      ],
      note: [
        { x: 60, y: 52, etichetta: "Trave", testo: "L'elemento orizzontale che collega due pilastri. Raccoglie il peso del solaio e lo porta ai pilastri." },
        { x: 87, y: 22, etichetta: "Gru a torre", testo: "Solleva barre d'acciaio, casseforme e secchioni di calcestruzzo fino ai piani alti." }
      ]
    },
    pilastro: {
      titolo: "Il pilastro",
      testo: "Il pilastro è l'elemento verticale del telaio. Lavora soprattutto in compressione: è schiacciato tra il peso che ha sopra e la fondazione che ha sotto. Nasce come una gabbia di barre d'acciaio; poi viene chiuso in una cassaforma e riempito di calcestruzzo. Il calcestruzzo regge bene lo schiacciamento, l'acciaio regge bene la trazione: insieme formano il cemento armato.",
      img: "img/pilastro.webp",
      alt: "Sotto un solaio sorretto da puntelli metallici: a sinistra un pilastro di calcestruzzo finito, al centro-destra una gabbia di barre d'acciaio ancora da gettare, a destra pannelli di cassaforma appoggiati a un cavalletto giallo.",
      fuoco: [50, 50],
      fasi: [2],
      punti: [
        { x: 68, y: 50, etichetta: "Armatura", vai: "armatura" },
        { x: 86, y: 60, etichetta: "Casseforme", vai: "casseforme" }
      ],
      note: [
        { x: 22, y: 40, etichetta: "Pilastro finito", lato: "sx", testo: "Il calcestruzzo è indurito e la cassaforma è stata tolta. Dentro, invisibile, c'è una gabbia uguale a quella accanto." },
        { x: 48, y: 36, etichetta: "Puntelli", testo: "Tubi d'acciaio regolabili che reggono il solaio appena gettato, finché il calcestruzzo non è abbastanza resistente da reggersi da solo." }
      ]
    },
    armatura: {
      titolo: "La gabbia d'armatura",
      testo: "Dentro ogni pilastro c'è una gabbia d'acciaio. Le barre verticali, i ferri longitudinali, corrono per tutta l'altezza. Le staffe sono anelli d'acciaio che le abbracciano a intervalli regolari: tengono le barre al loro posto e impediscono che, schiacciate, si pieghino verso l'esterno. Reggono anche le spinte di lato, il taglio, e stringono il calcestruzzo come una fascia, rendendolo più resistente. Nelle zone sismiche le staffe si fanno più fitte, soprattutto vicino ai nodi, dove pilastri e travi si incontrano.",
      img: "img/armatura.webp",
      alt: "Primo piano di una gabbia d'armatura: barre d'acciaio verticali con la superficie a rilievi, abbracciate da staffe orizzontali legate con filo di ferro; sullo sfondo, sfocati, un edificio in costruzione, una gru e altre gabbie.",
      fuoco: [40, 50],
      fasi: [2],
      punti: [
        { x: 33, y: 55, etichetta: "Barra d’acciaio", vai: "barra" }
      ],
      note: [
        { x: 50, y: 31, etichetta: "Staffa", verso: "giu", testo: "Un anello d'acciaio piegato attorno alle barre verticali. Lavora quando il pilastro è schiacciato o scosso di lato." },
        { x: 29, y: 24, etichetta: "Legatura", testo: "Filo di ferro attorcigliato. Tiene ferma la gabbia mentre si getta il calcestruzzo; poi non ha più un compito." }
      ]
    },
    barra: {
      titolo: "La barra d'acciaio",
      testo: "La barra non è liscia: ha piccoli rilievi obliqui, le nervature. Il calcestruzzo indurito si incastra tra i rilievi e la barra fa molta fatica a scivolare: è l'aderenza. Così i due materiali lavorano come uno solo, e quando l'elemento viene tirato o piegato l'acciaio regge la trazione che il calcestruzzo da solo non sopporterebbe. Funziona anche perché acciaio e calcestruzzo si dilatano quasi allo stesso modo con il caldo e con il freddo.",
      img: "img/barra.webp",
      alt: "Macro di una barra d'acciaio scura, con nervature in rilievo e qualche macchia di ruggine, che esce in diagonale da un blocco di calcestruzzo rotto; nel calcestruzzo si vedono sassolini e piccoli fori.",
      fuoco: [55, 50],
      fasi: [2],
      note: [
        { x: 42, y: 50, etichetta: "Nervature", verso: "giu", testo: "I rilievi che fanno presa nel calcestruzzo. Senza di loro la barra si sfilerebbe come un chiodo liscio." },
        { x: 86, y: 38, etichetta: "Calcestruzzo", testo: "Oltre a fare presa sulla barra, la protegge: dentro il calcestruzzo l'ambiente è basico e protegge l'acciaio dalla ruggine. Con gli anni però l'aria lo rende meno basico, partendo dalla superficie: per questo le barre devono stare ad alcuni centimetri dalla superficie." }
      ]
    },
    casseforme: {
      titolo: "Le casseforme",
      testo: "Il calcestruzzo fresco è un impasto che si può versare: prende la forma di qualunque stampo. La cassaforma è quello stampo, di legno o di metallo, montata attorno alla gabbia d'armatura e stretta da morsetti perché la spinta dell'impasto non la apra. Il calcestruzzo fa presa in poche ore e poi continua a indurire per settimane. Quando è abbastanza resistente, la cassaforma si toglie e si usa di nuovo.",
      img: "img/casseforme.webp",
      alt: "Due pilastri su un solaio: a sinistra una cassaforma di legno chiusa da tre ordini di morsetti metallici, con le barre d'acciaio che spuntano in cima; a destra un pilastro di calcestruzzo grigio già liberato dalla cassaforma, con le barre che sporgono dall'alto.",
      fuoco: [50, 50],
      fasi: [2],
      note: [
        { x: 30, y: 38, etichetta: "Cassaforma", testo: "Tavole di legno unite a formare una scatola senza fondo. Le sue misure interne sono esattamente quelle del pilastro." },
        { x: 22, y: 26, etichetta: "Morsetto", lato: "sx", testo: "Stringe le tavole. Il calcestruzzo fresco è pesante e spinge sulle pareti come un liquido." },
        { x: 68, y: 50, etichetta: "Pilastro scasserato", testo: "Il calcestruzzo, liberato dalla cassaforma (si dice disarmo), ha preso la forma esatta della cassaforma. Le barre in cima, i ferri di ripresa, lo collegheranno al tratto del piano di sopra." }
      ]
    },
    solaio: {
      titolo: "Il solaio",
      testo: "Il solaio è il pavimento di un piano e il soffitto di quello sotto. Questo è un solaio in laterocemento, molto diffuso in Italia: travetti di cemento armato affiancati da blocchi di laterizio forati, le pignatte, che riempiono gli spazi e alleggeriscono il solaio. Sopra si stende una rete d'acciaio e si getta il calcestruzzo, che unisce tutto in una lastra sola. Il solaio porta il suo carico alle travi, le travi ai pilastri.",
      img: "img/solaio.webp",
      alt: "Un solaio prima del getto, visto dall'alto: file di blocchi di laterizio rossi separate da travetti grigi, coperte da una rete di barre sottili; tubi corrugati arancioni e blu; a destra la gabbia d'armatura della trave dentro una cassaforma di legno.",
      fuoco: [50, 45],
      fasi: [0, 1],
      punti: [
        { x: 48, y: 34, etichetta: "Il getto", vai: "getto" }
      ],
      note: [
        { x: 30, y: 50, etichetta: "Travetto", testo: "Una piccola trave di cemento armato, spesso fatta in fabbrica. I travetti corrono paralleli da una trave all'altra." },
        { x: 70, y: 22, etichetta: "Pignatte", testo: "Blocchi di laterizio forati. Non reggono quasi nulla: riempiono il solaio pesando poco e fanno da stampo al calcestruzzo gettato sopra." },
        { x: 85, y: 55, etichetta: "Trave", lato: "sx", testo: "Qui il getto riempirà la gabbia d'armatura. La trave lavora a flessione: in mezzo, tra due pilastri, la parte bassa è tirata, e lì servono le barre più robuste. Vicino ai pilastri succede il contrario: è tirata la parte alta, e servono barre anche lì." }
      ]
    },
    getto: {
      titolo: "Il getto",
      testo: "Il calcestruzzo arriva in cantiere nell'autobetoniera, che lo tiene in movimento, e una pompa lo spinge in un tubo fino al solaio. Va steso in fretta, prima che cominci a fare presa. Poi si vibra: un vibratore immerso nell'impasto fa uscire le bolle d'aria e lo fa scorrere attorno a tutte le barre, perché un calcestruzzo pieno di vuoti è più debole. Nei giorni seguenti va tenuto umido: il cemento indurisce reagendo con l'acqua, non asciugandosi.",
      img: "img/getto.webp",
      alt: "Il calcestruzzo grigio esce dal tubo della pompa, a sinistra, e si allarga sul solaio coprendo laterizi e barre; a destra la testa cilindrica del vibratore appoggiata sulla rete, con il suo tubo flessibile.",
      fuoco: [40, 55],
      fasi: [0],
      punti: [
        { x: 45, y: 68, etichetta: "Dentro il calcestruzzo", vai: "sezione" }
      ],
      note: [
        { x: 22, y: 20, etichetta: "Tubo della pompa", lato: "sx", testo: "Il braccio della pompa porta il calcestruzzo anche a decine di metri di altezza." },
        { x: 72, y: 57, etichetta: "Vibratore", testo: "Vibra migliaia di volte al minuto: l'impasto diventa più fluido e l'aria intrappolata sale in superficie." }
      ]
    },
    sezione: {
      titolo: "Dentro il calcestruzzo",
      testo: "Questo cilindro è stato estratto da un getto indurito con una carotatrice e poi tagliato per il lungo. Il calcestruzzo è una roccia artificiale: ghiaia e sabbia, gli aggregati, tenute insieme da una pasta di cemento e acqua. Gli aggregati occupano gran parte del volume, da circa tre quinti a tre quarti. Il cemento è la colla, e la colla è la parte che costa di più, in denaro e in energia.",
      img: "img/sezione.webp",
      alt: "Un cilindro di calcestruzzo appoggiato su un piano grigio, tagliato per il lungo: nella faccia piatta si vedono ciottoli grandi di vari colori, sabbia e una pasta grigia che li unisce.",
      fuoco: [50, 48],
      fasi: [0],
      punti: [
        { x: 52, y: 58, etichetta: "La pasta di cemento", vai: "cristalli" }
      ],
      note: [
        { x: 68, y: 44, etichetta: "Ghiaia", testo: "Sassi tondeggianti o frantumati. Reggono la compressione e riempiono il volume senza consumare cemento." },
        { x: 88, y: 61, etichetta: "Sabbia", verso: "giu", testo: "Granelli più fini che riempiono gli spazi tra un sasso e l'altro." }
      ]
    },
    cristalli: {
      titolo: "La colla del calcestruzzo",
      testo: "È un'illustrazione: a questo ingrandimento la pasta di cemento si vede solo con il microscopio elettronico, che dà immagini in bianco e nero come questa. Il cemento, mescolato con l'acqua, non si asciuga: reagisce con l'acqua. È l'idratazione. Crescono cristalli e un gel finissimo che si intrecciano e incollano tra loro sabbia e ghiaia. La reazione è rapida nelle prime ore e continua, sempre più lenta, per mesi e anni; per convenzione la resistenza del calcestruzzo si misura dopo 28 giorni.",
      img: "img/cristalli.webp",
      alt: "Illustrazione in stile microscopio elettronico, in bianco e nero: grandi lamine piatte esagonali impilate a sinistra e al centro, fasci di aghi sottili tra le lamine, a destra un intreccio fitto di fibre sottilissime.",
      fuoco: [50, 45],
      fasi: [0],
      note: [
        { x: 56, y: 22, etichetta: "Lamine", testo: "Cristalli di idrossido di calcio (portlandite). Contribuiscono a rendere la pasta fortemente basica, e questo protegge le barre d'acciaio dalla ruggine." },
        { x: 36, y: 33, etichetta: "Aghi", lato: "sx", testo: "Cristalli di ettringite, che si formano nelle prime ore dell'idratazione." },
        { x: 85, y: 45, etichetta: "Gel", testo: "Silicati di calcio idrati: la vera colla del calcestruzzo, quella che gli dà la resistenza." }
      ]
    },
    fondazioni: {
      titolo: "Le fondazioni",
      testo: "Tutto il peso dell'edificio arriva qui. Questa fondazione è un reticolo di travi rovesce: travi di cemento armato gettate sul fondo dello scavo, che seguono la griglia dei pilastri e distribuiscono il carico su una superficie più grande. Dagli incroci spuntano le barre da cui partiranno i pilastri. Se il terreno è molto resistente bastano blocchi sotto ogni pilastro, i plinti, collegati tra loro da travi; se è debole serve una platea continua, oppure dei pali che scendono in profondità.",
      img: "img/fondazioni.webp",
      alt: "Uno scavo largo visto dall'alto: sul fondo un reticolo di travi di calcestruzzo grigio, con gruppi di barre d'acciaio che spuntano dagli incroci; attorno le pareti di terra dello scavo, in parte rivestite di calcestruzzo spruzzato e coperte da teli sul bordo; lungo le travi esterne, casseforme di legno puntellate; in fondo un escavatore.",
      fuoco: [55, 50],
      fasi: [3],
      punti: [
        { x: 22, y: 22, etichetta: "Il terreno", vai: "terreno", lato: "sx" }
      ],
      note: [
        { x: 57, y: 55, etichetta: "Trave rovescia", testo: "Una trave di fondazione. Si chiama rovescia perché è come una trave normale capovolta: il terreno la spinge da sotto lungo tutta la lunghezza, come un carico sparso, e i pilastri la trattengono in pochi punti. Tra un pilastro e l'altro tende a incurvarsi verso l'alto." },
        { x: 67, y: 50, etichetta: "Ferri di ripresa", testo: "Le barre lasciate sporgere dalla fondazione. Verranno legate alla gabbia del pilastro, così fondazione e pilastro diventano un pezzo solo." }
      ]
    },
    terreno: {
      titolo: "Il terreno",
      testo: "Sotto le fondazioni il terreno non è tutto uguale: strati di argilla, sabbia e ghiaia, fino alla roccia. Ogni strato regge un carico diverso e si schiaccia in modo diverso. Per questo, prima di progettare un edificio, geologi e ingegneri geotecnici fanno sondaggi e prove per sapere che cosa c'è sotto. Quando gli strati in alto sono deboli, i pali portano il carico in profondità, fino a uno strato resistente.",
      img: "img/terreno.webp",
      alt: "Spaccato del terreno sotto una casa: in alto il prato con le radici, poi uno strato di argilla bruna, uno di sabbia gialla, uno di ciottoli e in fondo la roccia grigia; tre pali di calcestruzzo scendono dalla fondazione della casa fino alla roccia.",
      fuoco: [55, 50],
      fasi: [3, 4],
      punti: [
        { x: 50, y: 44, etichetta: "Pali", vai: "pali" },
        { x: 84, y: 56, etichetta: "I granelli", vai: "granuli" }
      ],
      note: [
        { x: 88, y: 24, etichetta: "Terreno vegetale", testo: "Lo strato con le radici e gli organismi viventi. È soffice e si schiaccia: le fondazioni si appoggiano sotto." },
        { x: 86, y: 40, etichetta: "Argilla", testo: "Alcune argille con l'acqua si gonfiano e seccandosi si ritirano. E sotto il peso di un edificio l'argilla si schiaccia lentamente, anche per anni." },
        { x: 85, y: 88, etichetta: "Roccia", testo: "Lo strato più resistente: sotto il peso di un edificio quasi non si schiaccia." }
      ]
    },
    pali: {
      titolo: "I pali di fondazione",
      testo: "Uno dei modi per fare un palo trivellato: una trivella a elica scava nel terreno un foro profondo, che può arrivare a decine di metri; dentro si cala una gabbia d'armatura e si getta il calcestruzzo. Il palo regge in due modi: con la punta, appoggiata su uno strato resistente, e con l'attrito del terreno lungo i fianchi. In cima, le barre sporgenti lo collegano alla fondazione.",
      img: "img/pali.webp",
      alt: "Un cantiere di pali: a sinistra una grande macchina cingolata con la trivella a elica infilata nel terreno; al centro tubi d'acciaio e una gabbia d'armatura cilindrica; a destra le teste di quattro pali già gettati, da cui spuntano barre d'acciaio.",
      fuoco: [45, 50],
      fasi: [3, 4],
      note: [
        { x: 32, y: 40, etichetta: "Trivella", testo: "Una vite gigante: girando scava e porta in superficie la terra del foro." },
        { x: 60, y: 44, etichetta: "Gabbia", testo: "L'armatura del palo, calata nel foro, di solito prima del getto." },
        { x: 85, y: 76, etichetta: "Testa del palo", verso: "giu", testo: "Le barre che sporgono verranno annegate nella trave o nel plinto costruiti sopra." }
      ]
    },
    granuli: {
      titolo: "I granelli del terreno",
      testo: "È un'illustrazione: le due metà non sono alla stessa scala, perché le particelle di argilla sono da centinaia a migliaia di volte più piccole dei granelli di sabbia. Sabbia e argilla si comportano in modo diverso sotto un peso. I granelli di sabbia sono grossi e tra loro restano spazi: l'acqua scorre via in fretta, e il terreno si assesta quasi subito. L'argilla è fatta di lamelle microscopiche impilate, con veli d'acqua tra l'una e l'altra: sotto il peso di un edificio l'acqua viene spremuta fuori molto lentamente, e il terreno si abbassa per anni.",
      img: "img/granuli.webp",
      alt: "Illustrazione divisa in due: a sinistra grandi granelli di quarzo trasparenti, tondeggianti o spigolosi, con spazi chiari tra loro; a destra una massa fitta di lamelle brune sottilissime, impilate e lucide d'acqua.",
      fuoco: [50, 50],
      fasi: [4],
      note: [
        { x: 43, y: 38, etichetta: "Granello di sabbia", testo: "Spesso quarzo, un minerale molto duro. Non si schiaccia: sotto un peso i granelli si avvicinano un po' e poi si fermano." },
        { x: 29, y: 28, etichetta: "Spazi tra i granelli", lato: "sx", testo: "Qui passano l'aria e l'acqua. Un terreno sabbioso fa scorrere via la pioggia in fretta." },
        { x: 78, y: 45, etichetta: "Argilla", testo: "Lamelle sottilissime. Trattengono l'acqua e scivolano l'una sull'altra: per questo l'argilla bagnata è plastica e si può modellare." }
      ]
    },
    tamponamento: {
      titolo: "Il tamponamento",
      testo: "I muri di mattoni arrivano dopo lo scheletro: riempiono i vuoti tra pilastri e travi, e per questo si chiamano tamponamenti. Chiudono l'edificio e lo isolano dal freddo e dai rumori, ma il peso dei piani lo porta il telaio. Per questo, in un edificio a telaio, le pareti interne, i tramezzi, di solito si possono spostare senza toccare lo scheletro, ma solo dopo il controllo di un tecnico.",
      img: "img/tamponamento.webp",
      alt: "Tra due pilastri di calcestruzzo, sotto una trave, un muro di mattoni rossi costruito fino a poco più di metà altezza; ai lati si vedono i fori dei mattoni. In primo piano un bancale di mattoni forati, un secchio di malta con la cazzuola e una livella.",
      fuoco: [55, 50],
      fasi: [1, 2],
      punti: [
        { x: 76, y: 50, etichetta: "Un mattone forato", vai: "mattone" }
      ],
      note: [
        { x: 88, y: 30, etichetta: "Pilastro", lato: "sx", testo: "Regge il peso. Il muro gli si appoggia accanto, ma non lo sostituisce." },
        { x: 50, y: 14, etichetta: "Trave", testo: "Il muro arriverà fin qui sotto. Tra muro e trave è meglio lasciare un piccolo giunto riempito di materiale morbido: la trave, caricata, si abbassa un poco e potrebbe schiacciare il muro." },
        { x: 45, y: 46, etichetta: "Malta", testo: "Sabbia, cemento o calce e acqua. Lega i mattoni tra loro e riempie le fughe." }
      ]
    },
    mattone: {
      titolo: "Il mattone forato",
      testo: "Il mattone è argilla impastata con acqua, modellata e cotta in forno tra 900 e 1000 °C circa: la cottura la trasforma in un materiale duro, che l'acqua non scioglie più. I fori lo rendono più leggero e intrappolano aria, che rallenta il passaggio del calore: d'inverno tiene il caldo dentro, d'estate fuori. Le righe sulle facce aiutano la malta ad aggrapparsi.",
      img: "img/mattone.webp",
      alt: "Un mattone forato rosso in piedi su un pavimento di calcestruzzo: la faccia rivolta verso chi guarda ha diciotto fori rettangolari in sei file; i fianchi sono rigati. Dietro, sfocati, altri mattoni.",
      fuoco: [40, 50],
      fasi: [1],
      note: [
        { x: 35, y: 24, etichetta: "Fori", testo: "Rendono il mattone più leggero e intrappolano aria, che isola." },
        { x: 37, y: 50, etichetta: "Setto", testo: "La parete sottile tra un foro e l'altro. Tutta la resistenza del mattone sta nei setti." },
        { x: 24, y: 45, etichetta: "Rigature", lato: "sx", testo: "Solchi sui fianchi: la malta ci entra e fa presa." }
      ]
    }
  }
};
