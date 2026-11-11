/*
 * Contenuti dell'esplorazione. Il motore (index.html) legge solo questo file.
 *
 * Ogni nodo è una scena:
 *   titolo, testo   → quello che compare nel pannello
 *   img, alt        → immagine della scena (16:9) e descrizione per chi non la vede
 *   fuoco: [x, y]   → punto tenuto al centro quando l'immagine viene ritagliata (schermi verticali)
 *   fasi: [..]      → a che punto del percorso della forza si è (indici di catena.fasi)
 *   punti: [..]     → punti cliccabili: { x, y, etichetta, vai: "id-del-nodo" }
 *   note:  [..]     → parti della scena senza una scena propria: { x, y, etichetta, testo }
 *                         toccando l'etichetta, il testo (una o due frasi) prende il posto di quello della scena
 * Le coordinate x, y sono percentuali dell'immagine, da sinistra e dall'alto.
 */
window.ESPLORAZIONE = {
  id: "bicicletta",
  indirizzo: "https://book.proftecnologia.it/embeds/esplorazioni/bicicletta/",   // indirizzo pubblico: serve al pulsante «Condividi» e al QR code
  lingua: "it",
  radice: "bici",
  catena: { etichetta: "Forza", fasi: ["spinta", "leva", "catena", "ruota"] },
  nodi: {
    bici: {
      titolo: "La bicicletta",
      testo: "La bicicletta è una macchina composta: tante macchine semplici che lavorano insieme. Il pedale spinge una leva, la catena porta il movimento alla ruota posteriore, i freni sono altre leve, le viti tengono tutto fermo. Entra nei punti per vedere come ogni parte moltiplica o trasmette la tua forza.",
      img: "img/bici.webp",
      alt: "Una bicicletta da città verde vista di lato, appoggiata al cavalletto in un cortile: ruota posteriore a sinistra con i pignoni e il cambio, pedali e corona al centro in basso, manubrio con la leva del freno in alto a destra, sella in alto a sinistra.",
      fuoco: [48, 50],
      fasi: [0, 1, 2, 3],
      punti: [
        { x: 45, y: 68, etichetta: "Pedali e pedivella", vai: "pedivella" },
        { x: 20, y: 64, etichetta: "Trasmissione", vai: "trasmissione", lato: "sx" },
        { x: 67, y: 12, etichetta: "Freno", vai: "freno" },
        { x: 74, y: 61, etichetta: "Ruota", vai: "ruota" },
        { x: 33, y: 16, etichetta: "Sella e viti", vai: "morsetto", lato: "sx" }
      ],
      note: [
        { x: 52, y: 38, etichetta: "Telaio", testo: "Lo scheletro della bicicletta. I suoi tubi formano triangoli: il triangolo è l'unica figura che non può cambiare forma senza che un lato si allunghi o si accorci." }
      ]
    },
    pedivella: {
      titolo: "Pedali e pedivella",
      testo: "La pedivella è una leva che gira: il piede spinge sul pedale, lontano dal centro, e la forza arriva alla corona, più vicina al centro. È una ruota con l'asse: più lunga è la pedivella, meno forza serve per far girare la corona. In cambio, il piede deve fare un giro più largo.",
      img: "img/pedivella.webp",
      alt: "Primo piano di lato: la corona dentata con la catena a sinistra, al centro la pedivella di alluminio che punta verso destra, con il pedale alla sua estremità.",
      fuoco: [50, 48],
      fasi: [0, 1],
      punti: [
        { x: 35, y: 46, etichetta: "Movimento centrale", vai: "movimento", lato: "sx" }
      ],
      note: [
        { x: 87, y: 52, etichetta: "Pedale", verso: "giu", testo: "Il punto in cui applichi la forza. Sta all'estremità della pedivella, il più lontano possibile dal centro di rotazione." },
        { x: 30, y: 22, etichetta: "Corona", testo: "La ruota dentata che trascina la catena. Gira insieme alla pedivella, attorno allo stesso asse." },
        { x: 60, y: 47, etichetta: "Pedivella", verso: "giu", testo: "Il braccio della leva. Sulle bici da adulto è lungo circa 17 centimetri." }
      ]
    },
    movimento: {
      titolo: "Il movimento centrale",
      testo: "Dentro il telaio, un asse d'acciaio collega le due pedivelle. Non striscia contro il telaio: gira appoggiato su due cuscinetti a sfere, uno per lato. Senza cuscinetti l'attrito si mangerebbe una parte della tua spinta e consumerebbe il metallo.",
      img: "img/movimento.webp",
      alt: "Spaccato del movimento centrale su un banco da officina: dentro la scatola del telaio, tagliata, si vede l'asse d'acciaio orizzontale con una corona di sfere a ogni estremità; a destra è attaccata una pedivella.",
      fuoco: [48, 48],
      fasi: [1],
      punti: [
        { x: 65, y: 43, etichetta: "Cuscinetto a sfere", vai: "sfere" }
      ],
      note: [
        { x: 45, y: 47, etichetta: "Asse", verso: "giu", testo: "Collega la pedivella destra a quella sinistra, così le due gambe spingono sulla stessa corona." },
        { x: 45, y: 22, etichetta: "Scatola del movimento", testo: "Il tubo corto e robusto in cui convergono i tubi del telaio. Regge tutta la spinta della pedalata." }
      ]
    },
    sfere: {
      titolo: "Le sfere del cuscinetto",
      testo: "Un cuscinetto a sfere sostituisce lo strisciamento con il rotolamento. Tra l'anello interno, che gira con l'asse, e quello esterno, fermo nel telaio, rotolano sfere d'acciaio durissimo. Far rotolare costa molta meno fatica che far strisciare: è l'attrito volvente. Il grasso evita che il metallo strisci sul metallo, riduce l'usura e tiene lontane acqua e polvere.",
      img: "img/sfere.webp",
      alt: "Macro di un cuscinetto aperto: sfere d'acciaio lucide, tenute da una gabbia di ottone, tra l'anello interno e l'anello esterno; un velo di grasso sulle sfere.",
      fuoco: [50, 50],
      fasi: [1],
      note: [
        { x: 36, y: 25, etichetta: "Sfera", testo: "Acciaio temprato, lucidato a specchio. Tocca gli anelli in un punto piccolissimo, dove la pressione è enorme: per questo deve essere durissima." },
        { x: 72, y: 49, etichetta: "Gabbia", testo: "Tiene le sfere alla stessa distanza l'una dall'altra, così non si toccano tra loro." },
        { x: 45, y: 54, etichetta: "Anello interno", verso: "giu", testo: "Gira insieme all'asse. La sua pista è scavata su misura per le sfere." }
      ]
    },
    trasmissione: {
      titolo: "La trasmissione",
      testo: "La catena porta il movimento dalla corona, davanti, ai pignoni della ruota posteriore. Se la corona ha più denti del pignone, a ogni giro di pedale la ruota fa più di un giro: vai veloce ma spingi di più. Con un pignone grande succede il contrario: è la marcia da salita. Il cambio sposta la catena da un pignone all'altro.",
      img: "img/trasmissione.webp",
      alt: "Primo piano della ruota posteriore: il pacco di pignoni di grandezze diverse, la catena che arriva da destra e, sotto i pignoni, il cambio con le sue due rotelline dentate.",
      fuoco: [45, 45],
      fasi: [2],
      punti: [
        { x: 72, y: 15, etichetta: "Catena", vai: "catena" },
        { x: 42, y: 46, etichetta: "Cambio", vai: "cambio" }
      ],
      note: [
        { x: 27, y: 22, etichetta: "Pignoni", lato: "sx", testo: "Ruote dentate di grandezze diverse, fissate alla ruota posteriore. Ogni pignone è una marcia." }
      ]
    },
    catena: {
      titolo: "La catena",
      testo: "La catena è fatta di maglie articolate, strette e larghe, che si alternano. I rulli si infilano tra un dente e l'altro della corona: così la catena non può slittare, e quasi tutta la forza arriva alla ruota. Una catena pulita e ben tenuta può trasmettere oltre il 95% dell'energia: è una delle trasmissioni più efficienti che esistano.",
      img: "img/catena.webp",
      alt: "Macro di una catena di bicicletta appoggiata sui denti di una corona: piastrine, perni e rulli d'acciaio leggermente oliati.",
      fuoco: [50, 45],
      fasi: [2],
      punti: [
        { x: 55, y: 46, etichetta: "Una maglia smontata", vai: "maglia" }
      ],
      note: [
        { x: 62, y: 70, etichetta: "Dente della corona", testo: "Entra nello spazio tra due rulli e trascina la catena. La sua forma accompagna il rullo dentro e fuori senza urti." },
        { x: 39, y: 32, etichetta: "Perno", lato: "sx", testo: "Tiene unite le piastrine e fa da cerniera: è qui che la maglia si piega." }
      ]
    },
    maglia: {
      titolo: "Una maglia smontata",
      testo: "La catena alterna maglie interne, strette, e maglie esterne, larghe. Una coppia è fatta di pochi pezzi d'acciaio: due piastrine esterne, due interne, due rulli e due perni. I perni tengono insieme le piastrine e fanno da cerniera; i rulli girano liberi e rotolano sui denti invece di strisciare. In una catena ci sono più di cento maglie, cioè più di cinquanta coppie come questa.",
      img: "img/maglia.webp",
      alt: "I pezzi di una maglia di catena allineati su un banco scuro: piastrine esterne ai lati, piastrine interne, due rulli e due perni al centro; dietro, sfocata, una catena montata.",
      fuoco: [50, 50],
      fasi: [2],
      note: [
        { x: 10, y: 56, etichetta: "Piastrina esterna", testo: "Chiude la maglia ai due lati. Lavora in trazione: deve reggere tutta la forza della pedalata senza allungarsi." },
        { x: 45, y: 57, etichetta: "Rullo", testo: "Un cilindretto cavo che gira attorno al perno. Rotolando sui denti riduce attrito e usura." },
        { x: 58, y: 55, etichetta: "Perno", testo: "Un piccolo cilindro pieno, ribattuto alle estremità perché non si sfili." }
      ]
    },
    cambio: {
      titolo: "Il cambio",
      testo: "Il cambio posteriore non aggiunge forza: sposta la catena. Tirando o rilasciando un cavo, il suo corpo si muove di lato e guida la catena su un pignone più grande o più piccolo. Le due rotelline tengono la catena tesa qualunque marcia tu scelga.",
      img: "img/cambio.webp",
      alt: "Primo piano del cambio posteriore: il corpo articolato al centro, il cavo che arriva da destra in alto, la gabbia con una rotellina dentata in basso e i pignoni in alto a sinistra.",
      fuoco: [50, 45],
      fasi: [2],
      note: [
        { x: 76, y: 17, etichetta: "Cavo", testo: "Arriva dal comando sul manubrio. Tirandolo, il cambio si sposta verso i pignoni più grandi." },
        { x: 46, y: 58, etichetta: "Gabbia con le rotelline", testo: "Guida la catena e, grazie a una molla, recupera la parte che avanza quando passi a un pignone piccolo." },
        { x: 22, y: 16, etichetta: "Pignoni", testo: "Più il pignone è grande, più la pedalata è leggera e meno strada fai a ogni giro di pedale." }
      ]
    },
    freno: {
      titolo: "La leva del freno",
      testo: "Il freno comincia qui, con una leva. Le dita tirano l'estremità lunga; vicino al fulcro, il braccio corto tira il cavo con una forza alcune volte maggiore. È il vantaggio meccanico: spostamento lungo e forza piccola da una parte, spostamento corto e forza grande dall'altra.",
      img: "img/freno.webp",
      alt: "L'estremità destra di un manubrio: la manopola di gomma, la leva del freno con il suo perno e, a sinistra, il cavo che esce dalla leva dentro la guaina.",
      fuoco: [50, 50],
      fasi: [0, 1],
      punti: [
        { x: 11, y: 55, etichetta: "Il freno sulla ruota", vai: "pinza" }
      ],
      note: [
        { x: 44, y: 55, etichetta: "Fulcro", testo: "Il perno attorno a cui la leva ruota. Più il cavo è attaccato vicino al fulcro, più la forza delle dita viene moltiplicata." },
        { x: 68, y: 64, etichetta: "Leva", verso: "giu", testo: "Fulcro a un'estremità, dita all'altra, cavo tra i due, vicino al fulcro: è una leva di secondo genere, sempre vantaggiosa." }
      ]
    },
    pinza: {
      titolo: "Il freno sul cerchio",
      testo: "Il cavo tira insieme i due bracci del freno, che sono altre due leve. I bracci stringono i pattini di gomma contro il cerchio della ruota. A fermarti è l'attrito tra gomma e metallo, che trasforma il movimento in calore.",
      img: "img/pinza.webp",
      alt: "La ruota anteriore vista di fronte: due bracci del freno ai lati della forcella, uniti in alto dal cavo, con un pattino di gomma per lato appoggiato al cerchio di alluminio.",
      fuoco: [50, 48],
      fasi: [1, 3],
      punti: [
        { x: 61, y: 55, etichetta: "Pattino", vai: "pattino" }
      ],
      note: [
        { x: 36, y: 10, etichetta: "Cavo", testo: "Porta alla ruota la forza della leva sul manubrio, anche a un metro di distanza." },
        { x: 72, y: 38, etichetta: "Braccio", testo: "Ruota attorno a un perno fissato alla forcella. Quando il cavo tira la sua estremità alta, il pattino si sposta verso il cerchio." }
      ]
    },
    pattino: {
      titolo: "Il pattino",
      testo: "Il pattino è un blocchetto di gomma dura. Premuto contro il cerchio che gira, lo frena per attrito radente: più forte premi, più grande è l'attrito. A ogni frenata la gomma si consuma un poco: la polvere scura è gomma, insieme a un po' di alluminio del cerchio. Le scanalature mostrano quando il pattino è da cambiare: se non si vedono più, è consumato.",
      img: "img/pattino.webp",
      alt: "Macro: a sinistra un pattino di gomma nera con tre scanalature, premuto contro la superficie lucida e rigata di un cerchio di alluminio; sul metallo, granelli di polvere di gomma.",
      fuoco: [50, 48],
      fasi: [3],
      punti: [
        { x: 52, y: 45, etichetta: "Dove gomma e metallo si toccano", vai: "attrito" }
      ],
      note: [
        { x: 27, y: 30, etichetta: "Gomma", testo: "Abbastanza morbida da aderire al metallo, abbastanza dura da non consumarsi subito." },
        { x: 73, y: 62, etichetta: "Cerchio", testo: "La superficie di alluminio su cui il pattino lavora. Bagnata frena molto meno: sotto la pioggia serve più spazio per fermarsi." }
      ]
    },
    attrito: {
      titolo: "L'attrito al microscopio",
      testo: "È un'illustrazione: queste asperità si vedono solo al microscopio, e nessuno può fotografarle mentre gomma e metallo strisciano l'una sull'altro. Nessuna superficie è davvero liscia: ingrandite, anche le più lucide sono fatte di cime e valli. Le due superfici si toccano solo sulle cime, e la gomma si deforma attorno a quelle del metallo. Per farle scorrere bisogna staccare questi punti di contatto e deformare la gomma di continuo: l'energia spesa diventa calore.",
      img: "img/attrito.webp",
      alt: "Illustrazione in sezione: in alto la gomma scura, in basso il metallo chiaro, entrambi con un profilo di cime e valli; dove si toccano, un bagliore arancione.",
      fuoco: [50, 48],
      fasi: [3],
      note: [
        { x: 30, y: 25, etichetta: "Gomma", testo: "Più morbida del metallo: si adatta alle sue asperità e per questo fa molta presa." },
        { x: 75, y: 80, etichetta: "Metallo", testo: "Visto così, il cerchio lucido è una catena di montagne microscopiche." },
        { x: 44, y: 46, etichetta: "Punto di contatto", verso: "giu", testo: "Qui l'energia del movimento si trasforma in calore. Dopo una lunga discesa in frenata il cerchio è caldo al tatto." }
      ]
    },
    ruota: {
      titolo: "La ruota",
      testo: "La ruota fa due lavori. Rotolando sul terreno, costa molta meno fatica che strisciare. E quella posteriore è una ruota con l'asse usata al contrario: la catena tira il pignone, piccolo, e il bordo della ruota, grande, percorre molta più strada. I raggi sono sottili fili d'acciaio sempre in tensione: tirano il cerchio verso il mozzo da ogni lato. Un raggio lavora sempre tirando, mai spingendo.",
      img: "img/ruota.webp",
      alt: "Il centro di una ruota anteriore: il mozzo con le sue due flange, i raggi d'acciaio incrociati che vanno verso il cerchio, i due foderi blu della forcella e il dado dell'asse.",
      fuoco: [50, 48],
      fasi: [3],
      punti: [
        { x: 45, y: 45, etichetta: "Mozzo", vai: "mozzo", lato: "sx" }
      ],
      note: [
        { x: 22, y: 46, etichetta: "Raggi", testo: "Ognuno è teso come una corda di chitarra, ma molto di più. Sono incrociati perché, nella ruota posteriore, devono anche trasmettere al cerchio la spinta della pedalata." },
        { x: 65, y: 18, etichetta: "Forcella", testo: "Tiene l'asse della ruota anteriore e la collega al manubrio." },
        { x: 87, y: 58, etichetta: "Cerchio", lato: "sx", testo: "L'anello di alluminio che regge il copertone. I raggi lo tirano verso il centro da tutte le direzioni." }
      ]
    },
    mozzo: {
      titolo: "Il mozzo",
      testo: "Il mozzo è il centro della ruota. L'asse resta fermo, stretto nella forcella; il corpo del mozzo gli gira attorno su due cuscinetti a sfere. È lo stesso principio del movimento centrale: far rotolare al posto di far strisciare.",
      img: "img/mozzo.webp",
      alt: "Spaccato di un mozzo su un banco di legno: il corpo di alluminio tagliato per il lungo mostra l'asse d'acciaio al centro, una corona di sfere a ogni estremità e le due flange forate.",
      fuoco: [50, 48],
      fasi: [3],
      note: [
        { x: 50, y: 47, etichetta: "Asse", verso: "giu", testo: "Non gira: è bloccato alla forcella dai dadi. Gira tutto il resto." },
        { x: 29, y: 46, etichetta: "Sfere", lato: "sx", testo: "Rotolano tra l'asse e il corpo del mozzo. Grazie a loro la ruota gira a lungo con una sola spinta." },
        { x: 77, y: 24, etichetta: "Flangia", testo: "Il disco forato in cui si agganciano le teste dei raggi." }
      ]
    },
    morsetto: {
      titolo: "Sella e viti",
      testo: "Sotto la sella lavora un'altra macchina semplice: la vite. Girandola con poca forza sulla chiave, il morsetto afferra la sella con una forza enorme. Viti come questa tengono insieme quasi tutta la bicicletta, e si possono allentare per regolarla.",
      img: "img/morsetto.webp",
      alt: "Sotto una sella: i due binari d'acciaio stretti dal morsetto in cima al reggisella, con una vite a brugola; più in basso il collarino dove il reggisella entra nel telaio verde.",
      fuoco: [50, 45],
      fasi: [1],
      punti: [
        { x: 48, y: 18, etichetta: "Una vite da vicino", vai: "vite" }
      ],
      note: [
        { x: 51, y: 46, etichetta: "Reggisella", testo: "Il tubo che porta la sella. Scorre dentro il telaio per regolare l'altezza, poi viene bloccato." },
        { x: 27, y: 13, etichetta: "Binari della sella", lato: "sx", testo: "Due tondini d'acciaio sotto la sella. Il morsetto li stringe: allentandolo, la sella si sposta avanti o indietro." }
      ]
    },
    vite: {
      titolo: "Il filetto della vite",
      testo: "Una vite è un piano inclinato avvolto a elica, come una scala a chiocciola, attorno a un cilindro. A ogni giro avanza di poco: fai tanta strada con la chiave per ottenere un piccolo spostamento, e in cambio la vite stringe con una forza molto più grande di quella della tua mano. L'attrito tra i filetti le impedisce di svitarsi da sola.",
      img: "img/vite.webp",
      alt: "Una vite a testa cilindrica con incavo esagonale avvitata a metà in un blocco di alluminio tagliato: si vedono i filetti della vite incastrati in quelli del foro.",
      fuoco: [50, 48],
      fasi: [1],
      note: [
        { x: 17, y: 42, etichetta: "Testa", testo: "Ha un incavo esagonale in cui entra la chiave a brugola. Più lunga è la chiave, meno forza serve." },
        { x: 48, y: 40, etichetta: "Filetto", testo: "L'elica in rilievo. La distanza tra una cresta e l'altra si chiama passo: è di quanto la vite avanza a ogni giro." },
        { x: 62, y: 62, etichetta: "Madrevite", verso: "giu", testo: "Il filetto scavato dentro il foro, con la stessa elica della vite. Le creste dell'una entrano nei solchi dell'altra, e i fianchi dei filetti si appoggiano l'uno sull'altro." }
      ]
    }
  }
};
