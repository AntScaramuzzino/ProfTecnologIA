/*
 * Contenuti dell'esplorazione. Il motore (index.html) legge solo questo file.
 *
 * Ogni nodo è una scena:
 *   titolo, testo   → quello che compare nel pannello
 *   img, alt        → immagine della scena (16:9) e descrizione per chi non la vede
 *   fuoco: [x, y]   → punto tenuto al centro quando l'immagine viene ritagliata (schermi verticali)
 *   fasi: [..]      → a che punto del percorso dei dati si è (indici di catena.fasi)
 *   punti: [..]     → punti cliccabili: { x, y, etichetta, vai: "id-del-nodo" }
 *   note:  [..]     → parti della scena senza una scena propria: { x, y, etichetta, testo }
 *                         toccando l'etichetta, il testo (una o due frasi) prende il posto di quello della scena
 * Le coordinate x, y sono percentuali dell'immagine, da sinistra e dall'alto.
 */
window.ESPLORAZIONE = {
  id: "dove-vive-internet",
  indirizzo: "https://book.proftecnologia.it/embeds/esplorazioni/dove-vive-internet/",   // indirizzo pubblico: serve al pulsante «Condividi» e al QR code
  lingua: "it",
  radice: "costa",
  catena: { etichetta: "Percorso", fasi: ["dispositivo", "rete locale", "dorsale", "data center"] },
  nodi: {
    costa: {
      titolo: "Dove vive Internet",
      testo: "Internet non è una nuvola: è fatta di cavi, edifici e antenne, in luoghi precisi. Su questa costa arriva un cavo sottomarino, che entra in una stazione di approdo. Poco più in là c'è un data center, il capannone dove stanno i computer che conservano i dati. Sulla collina, un'antenna collega i telefoni alla rete.",
      img: "img/costa.webp",
      alt: "Veduta aerea di una costa rocciosa all'alba: a sinistra una spiaggia dove un cavo nero esce dal mare ed entra in un piccolo edificio di cemento; a destra un grande capannone senza finestre con impianti sul tetto; in alto a destra un traliccio con antenne; in lontananza un paese.",
      fuoco: [50, 45],
      fasi: [0, 1, 2, 3],
      punti: [
        { x: 17, y: 69, etichetta: "Cavo sottomarino", vai: "cavo" },
        { x: 33, y: 36, etichetta: "Stazione di approdo", vai: "approdo", lato: "sx" },
        { x: 74, y: 33, etichetta: "Data center", vai: "datacenter" },
        { x: 89, y: 15, etichetta: "Antenna", vai: "antenna", lato: "sx" }
      ],
      note: [
        { x: 42, y: 18, etichetta: "Il paese", testo: "Case, scuole e negozi sono collegati alla rete da cavi interrati, sempre più spesso in fibra ottica. È la rete locale, l'ultimo tratto del percorso." }
      ]
    },
    cavo: {
      titolo: "Il cavo sottomarino",
      testo: "Quasi tutto il traffico tra i continenti passa dentro cavi come questo, posati sul fondo del mare. In mare aperto un cavo è spesso più o meno come un tubo da giardino; vicino alla costa è più grosso, perché ha un'armatura in più contro ancore e reti da pesca. Lungo il percorso, a intervalli regolari, ci sono i ripetitori.",
      img: "img/cavo.webp",
      alt: "Sott'acqua: un cavo nero appoggiato sul fondale sabbioso si allontana verso il blu; a metà distanza, sul cavo, un cilindro metallico; qualche pesce, raggi di sole dall'alto.",
      fuoco: [50, 50],
      fasi: [2],
      punti: [
        { x: 47, y: 62, etichetta: "Dentro il cavo", vai: "sezione", lato: "sx" },
        { x: 65, y: 48, etichetta: "Ripetitore", vai: "ripetitore" }
      ],
      note: [
        { x: 80, y: 80, etichetta: "Fondale", testo: "Vicino a riva il cavo viene spesso interrato sotto la sabbia. In mare aperto è semplicemente appoggiato sul fondo, anche a migliaia di metri di profondità." }
      ]
    },
    sezione: {
      titolo: "Dentro il cavo",
      testo: "Quasi tutto il cavo è protezione. Al centro, dentro un tubicino, corrono poche fibre ottiche: sono loro a portare i dati. Intorno ci sono fili d'acciaio che resistono alla trazione, un tubo di rame che porta la corrente ai ripetitori e una guaina di plastica che tiene fuori l'acqua.",
      img: "img/sezione.webp",
      alt: "L'estremità di un cavo sottomarino spellata a gradini: la guaina nera, una corona di fili d'acciaio, un tubo di rame, un tubicino d'acciaio e, al centro, poche fibre sottilissime.",
      fuoco: [55, 48],
      fasi: [2],
      punti: [
        { x: 88, y: 51, etichetta: "Fibre ottiche", vai: "fibra", lato: "sx" }
      ],
      note: [
        { x: 20, y: 40, etichetta: "Guaina", testo: "Polietilene, una plastica che non lascia passare l'acqua e isola la parte elettrica del cavo." },
        { x: 46, y: 29, etichetta: "Fili d'acciaio", testo: "Danno al cavo la resistenza che serve per essere posato da una nave e recuperato dal fondo senza strapparsi." },
        { x: 62, y: 34, etichetta: "Tubo di rame", testo: "Porta l'elettricità dalla costa ai ripetitori, che lavorano in mezzo all'oceano senza altra fonte di energia." }
      ]
    },
    fibra: {
      titolo: "Le fibre ottiche",
      testo: "Una fibra ottica è un filo di vetro purissimo, sottile come un capello. Non porta corrente: porta luce. Un laser a un'estremità si accende e si spegne miliardi di volte al secondo, e ogni lampo è un pezzetto di informazione. In un cavo sottomarino ci sono poche fibre, ma ognuna trasporta una quantità enorme di dati.",
      img: "img/fibra.webp",
      alt: "Macro di un fascio di fibre ottiche che esce da un cavo a sinistra e si apre a ventaglio verso destra: fili di vetro trasparenti con le punte accese di luce bianco-azzurra, su fondo nero.",
      fuoco: [55, 48],
      fasi: [2],
      punti: [
        { x: 75, y: 38, etichetta: "La luce dentro la fibra", vai: "luce", lato: "sx" }
      ],
      note: [
        { x: 40, y: 47, etichetta: "Fibra", verso: "giu", testo: "Vetro, non metallo: per questo non è disturbata dai campi elettrici e può portare il segnale molto lontano." },
        { x: 10, y: 40, etichetta: "Rivestimento", testo: "Tiene insieme le fibre e le protegge: il vetro così sottile si spezza se viene piegato troppo." }
      ]
    },
    luce: {
      titolo: "La luce dentro la fibra",
      testo: "È un'illustrazione: a questa scala nessuna fotografia è possibile. La fibra ha due strati di vetro: il nucleo al centro e il mantello intorno. La luce che viaggia nel nucleo, quando arriva al confine con il mantello, non esce: rimbalza indietro, come su uno specchio. È la riflessione totale. Così gli impulsi seguono la fibra anche nelle curve, a circa 200.000 chilometri al secondo.",
      img: "img/luce.webp",
      alt: "Illustrazione: un tratto di fibra ottica trasparente in sezione; lungo il nucleo, impulsi di luce avanzano da sinistra a destra con un percorso a zigzag che rimbalza sul confine con il mantello.",
      fuoco: [50, 48],
      fasi: [2],
      note: [
        { x: 17, y: 50, etichetta: "Impulso di luce", verso: "giu", testo: "Un lampo brevissimo. Acceso o spento: è così che la luce porta gli 1 e gli 0 dei dati." },
        { x: 34, y: 38, etichetta: "Riflessione", testo: "Qui la luce tocca il confine tra i due vetri e torna verso il centro, senza perdere quasi nulla." },
        { x: 62, y: 27, etichetta: "Mantello", testo: "Un vetro leggermente diverso da quello del nucleo. È questa differenza a tenere la luce prigioniera." }
      ]
    },
    ripetitore: {
      titolo: "Il ripetitore",
      testo: "Anche nel vetro più puro, dopo decine di chilometri la luce si indebolisce. Per questo lungo il cavo, ogni 50-100 chilometri circa, c'è un ripetitore: un cilindro a tenuta stagna che amplifica gli impulsi di luce e li rimanda avanti. Qui ne vedi uno sul ponte della nave posacavi, prima di scendere in mare.",
      img: "img/ripetitore.webp",
      alt: "Sul ponte di una nave: un lungo cilindro metallico a forma di siluro appoggiato su rulli, con il cavo nero che entra dalle due estremità; a sinistra bobine di cavo, sullo sfondo il mare.",
      fuoco: [50, 50],
      fasi: [2],
      note: [
        { x: 55, y: 52, etichetta: "Involucro", verso: "giu", testo: "Deve resistere per decenni alla pressione del fondo dell'oceano, senza manutenzione: laggiù nessuno può andare a ripararlo." },
        { x: 89, y: 49, etichetta: "Cavo", testo: "Entra ed esce dal ripetitore. Porta sia la luce da amplificare sia la corrente che fa funzionare l'amplificatore." },
        { x: 12, y: 27, etichetta: "Bobine di cavo", testo: "La nave trasporta migliaia di chilometri di cavo e lo cala in mare lentamente, lungo una rotta studiata in anticipo." }
      ]
    },
    approdo: {
      titolo: "La stazione di approdo",
      testo: "Qui il cavo esce dal mare e si collega alla rete di terra. Gli apparecchi negli armadi ricevono la luce delle fibre sottomarine e la rimandano nelle fibre che corrono sotto strade e ferrovie, verso le città e i data center. Da qui parte anche la corrente che alimenta i ripetitori in fondo al mare.",
      img: "img/approdo.webp",
      alt: "Una sala tecnica: a sinistra un grosso cavo nero entra dalla parete in un telaio metallico; in alto fasci di cavetti gialli; a destra una fila di armadi con apparecchiature e spie verdi.",
      fuoco: [50, 48],
      fasi: [2],
      note: [
        { x: 11, y: 52, etichetta: "Cavo dal mare", testo: "L'ultimo tratto del cavo sottomarino. Dalla spiaggia arriva fin qui interrato." },
        { x: 36, y: 17, etichetta: "Fibre verso terra", testo: "I cavetti gialli sono fibre ottiche: portano il segnale dal cavo agli apparecchi, e da lì alla rete nazionale." },
        { x: 80, y: 55, etichetta: "Apparecchi di trasmissione", testo: "Contengono i laser che accendono la luce nelle fibre e i ricevitori che la leggono all'arrivo." }
      ]
    },
    datacenter: {
      titolo: "Il data center",
      testo: "Un file salvato «nel cloud» sta in un posto come questo: un capannone pieno di computer accesi giorno e notte. Da fuori si vede soprattutto ciò che serve a tenerli in vita: gli impianti di raffreddamento sul tetto, i generatori di riserva lungo il muro, la sottostazione che porta l'elettricità.",
      img: "img/datacenter.webp",
      alt: "Un grande capannone grigio senza finestre visto dall'alto: sul tetto file di impianti con ventole; lungo il lato sinistro una fila di generatori in container; in primo piano a destra una sottostazione elettrica; tutto intorno una recinzione.",
      fuoco: [50, 45],
      fasi: [3],
      punti: [
        { x: 62, y: 46, etichetta: "Sala server", vai: "sala" },
        { x: 50, y: 26, etichetta: "Raffreddamento", vai: "raffreddamento" },
        { x: 19, y: 45, etichetta: "Energia di riserva", vai: "energia", lato: "sx" }
      ],
      note: [
        { x: 80, y: 65, etichetta: "Sottostazione elettrica", testo: "Un data center consuma quanto una piccola città. Per questo ha un collegamento tutto suo alla rete ad alta tensione." }
      ]
    },
    sala: {
      titolo: "La sala server",
      testo: "Dentro, corridoi di armadi tutti uguali: i rack. Ogni rack contiene decine di computer, i server. Non hanno schermo né tastiera: ricevono richieste dalla rete e rispondono. Quando apri un sito o guardi un video, da qualche parte un server come questi ti sta mandando i dati.",
      img: "img/sala.webp",
      alt: "Un corridoio tra due file di armadi neri con sportelli forati e spie blu e verdi; pavimento bianco a piastrelle forate; in alto canaline con cavi gialli.",
      fuoco: [50, 50],
      fasi: [3],
      punti: [
        { x: 86, y: 46, etichetta: "Un rack", vai: "rack", lato: "sx" }
      ],
      note: [
        { x: 63, y: 13, etichetta: "Canaline dei cavi", verso: "giu", testo: "Portano le fibre ottiche e i cavi di rete da un rack all'altro e verso l'esterno." },
        { x: 66, y: 82, etichetta: "Pavimento forato", testo: "Dai fori sale l'aria fredda, che i server aspirano dal davanti e restituiscono calda sul retro." }
      ]
    },
    rack: {
      titolo: "Un rack",
      testo: "Il rack è uno scaffale di misura standard: ogni server è una scatola piatta, larga uguale alle altre, che si infila come un cassetto. In alto, uno switch collega tutti i server tra loro e al resto della rete. Se un server si guasta, lo si sfila e lo si sostituisce senza spegnere gli altri.",
      img: "img/rack.webp",
      alt: "Un armadio aperto visto di fronte: una dozzina di server piatti impilati, con spie verdi; in alto un apparecchio di rete con tanti cavi blu e gialli; a destra una fila di prese elettriche.",
      fuoco: [50, 50],
      fasi: [3],
      punti: [
        { x: 45, y: 45, etichetta: "Dentro un server", vai: "server", lato: "sx" }
      ],
      note: [
        { x: 52, y: 8, etichetta: "Switch di rete", verso: "giu", testo: "Smista i dati: riceve ogni pacchetto e lo manda al server giusto, o verso l'uscita." },
        { x: 73, y: 58, etichetta: "Alimentazione", testo: "Ogni server è collegato a due linee elettriche diverse: se una cade, resta l'altra." }
      ]
    },
    server: {
      titolo: "Dentro un server",
      testo: "Aperto, un server somiglia al computer di casa, ma è costruito per non fermarsi mai. Ha due processori sotto grandi dissipatori di metallo, molte schede di memoria, una fila di dischi e ventole che spingono l'aria da un lato all'altro.",
      img: "img/server.webp",
      alt: "Un server senza coperchio visto dall'alto: al centro due processori sotto dissipatori alettati, ai lati file di schede di memoria, a destra una fila di ventole, a sinistra i dischi, in alto a sinistra l'alimentatore.",
      fuoco: [50, 48],
      fasi: [3],
      punti: [
        { x: 55, y: 28, etichetta: "Processore", vai: "chip" }
      ],
      note: [
        { x: 82, y: 45, etichetta: "Ventole", testo: "Tirano l'aria fredda attraverso il server. Senza di loro i processori si surriscalderebbero in pochi secondi." },
        { x: 15, y: 47, etichetta: "Dischi", testo: "Qui stanno i dati salvati: foto, video, pagine. Ogni dato è copiato su più dischi, spesso in data center diversi." },
        { x: 42, y: 60, etichetta: "Memoria", verso: "giu", testo: "La memoria di lavoro: veloce, ma si svuota quando il server si spegne." }
      ]
    },
    chip: {
      titolo: "Il processore",
      testo: "Tolto il coperchio di metallo, ecco il cuore del server: una piastrina di silicio grande come un francobollo. Sulla sua superficie sono incisi miliardi di transistor, interruttori microscopici che si aprono e si chiudono miliardi di volte al secondo. Ogni calcolo, ogni pagina che ricevi, passa da qui. Tutta l'elettricità che il chip consuma diventa calore.",
      img: "img/chip.webp",
      alt: "Macro di un processore senza coperchio: al centro una piastrina di silicio quadrata con riflessi iridescenti, su una base verde con file di contatti dorati; a destra, sfocato, il coperchio di metallo.",
      fuoco: [45, 48],
      fasi: [3],
      note: [
        { x: 42, y: 42, etichetta: "Silicio", testo: "I riflessi colorati vengono dai circuiti: sono così fitti e piccoli che scompongono la luce, come la superficie di un CD." },
        { x: 19, y: 48, etichetta: "Contatti", lato: "sx", testo: "Centinaia di piccoli punti dorati collegano il chip alla scheda: da lì entrano corrente e dati." },
        { x: 86, y: 22, etichetta: "Coperchio", lato: "sx", testo: "Protegge il silicio e porta il calore verso il dissipatore." }
      ]
    },
    raffreddamento: {
      titolo: "Il raffreddamento",
      testo: "Tutta l'elettricità che i server consumano diventa calore, e va portata via: sopra una certa temperatura i computer si guastano. Sul tetto, grandi macchine frigorifere raffreddano l'acqua o l'aria che circola nelle sale. È per questo che molti data center vengono costruiti in luoghi freddi.",
      img: "img/raffreddamento.webp",
      alt: "Il tetto di un data center: due file di grandi macchine frigorifere con ventole circolari in cima, grossi tubi isolati che le collegano e, in mezzo, una passerella.",
      fuoco: [50, 48],
      fasi: [3],
      note: [
        { x: 17, y: 37, etichetta: "Ventole", testo: "Disperdono nell'aria esterna il calore tolto alle sale server." },
        { x: 64, y: 74, etichetta: "Tubi", testo: "Portano l'acqua fredda verso le sale e riportano su quella che si è scaldata." },
        { x: 88, y: 58, etichetta: "Gruppo frigorifero", lato: "sx", testo: "Funziona come un grande frigorifero: toglie calore da una parte e lo cede dall'altra. Consuma molta elettricità." }
      ]
    },
    energia: {
      titolo: "L'energia di riserva",
      testo: "Un data center non può spegnersi, nemmeno per un secondo. Se la corrente della rete manca, le batterie prendono subito il suo posto e tengono accesi i server per i pochi minuti che servono ad avviare i generatori diesel. Con il serbatoio pieno, i generatori possono andare avanti per giorni.",
      img: "img/energia.webp",
      alt: "Un locale tecnico: a sinistra una lunga fila di armadi grigi di batterie; a destra un grande generatore diesel verde con il radiatore e il tubo di scarico che sale al soffitto.",
      fuoco: [50, 48],
      fasi: [3],
      note: [
        { x: 20, y: 45, etichetta: "Batterie", testo: "Intervengono all'istante, senza che i server se ne accorgano. Insieme formano un gruppo di continuità." },
        { x: 71, y: 57, etichetta: "Generatore diesel", verso: "giu", testo: "Un grande motore a gasolio collegato a un alternatore. Parte da solo quando manca la corrente." },
        { x: 71, y: 17, etichetta: "Scarico", testo: "Porta all'esterno i gas del motore." }
      ]
    },
    antenna: {
      titolo: "L'antenna",
      testo: "Il telefono non è collegato a Internet da un filo: parla via radio con l'antenna più vicina, la stazione radio base. Da lì in poi il segnale viaggia quasi sempre in un cavo di fibra ottica, fino ai nodi della rete. Ogni antenna copre una zona, la cella: per questo si dice «cellulare».",
      img: "img/antenna.webp",
      alt: "Su una collina, un traliccio d'acciaio con gruppi di antenne rettangolari in cima e una parabola più in basso; alla base un armadio grigio; nella valle, a destra, un paese.",
      fuoco: [45, 45],
      fasi: [0, 1],
      note: [
        { x: 39, y: 15, etichetta: "Antenne a pannello", testo: "Trasmettono e ricevono le onde radio dei telefoni. Ognuna è rivolta verso una direzione diversa." },
        { x: 43, y: 36, etichetta: "Parabola", testo: "Un ponte radio: collega questa antenna a un'altra in linea d'aria, dove non arriva la fibra." },
        { x: 83, y: 68, etichetta: "Il paese", testo: "I telefoni nelle case e per strada si collegano a questa antenna, o a un'altra se è più vicina." }
      ]
    }
  }
};
