/*
 * Contenuti dell'esplorazione. Il motore (index.html) legge solo questo file.
 *
 * Ogni nodo è una scena:
 *   titolo, testo   → quello che compare nel pannello
 *   img, alt        → immagine della scena (16:9) e descrizione per chi non la vede
 *   fuoco: [x, y]   → punto tenuto al centro quando l'immagine viene ritagliata (schermi verticali)
 *   fasi: [..]      → di quale impianto parla la scena (indici di catena.fasi)
 *   punti: [..]     → punti cliccabili: { x, y, etichetta, vai: "id-del-nodo" }
 *   note:  [..]     → parti della scena senza una scena propria: { x, y, etichetta, testo }
 *                         toccando l'etichetta, il testo (una o due frasi) prende il posto di quello della scena
 * Le coordinate x, y sono percentuali dell'immagine, da sinistra e dall'alto.
 */
window.ESPLORAZIONE = {
  id: "casa-e-impianti",
  indirizzo: "https://book.proftecnologia.it/embeds/esplorazioni/casa-e-impianti/",   // indirizzo pubblico: serve al pulsante «Condividi» e al QR code
  lingua: "it",
  radice: "casa",
  catena: { etichetta: "Impianto", fasi: ["elettrico", "idrico", "gas", "termico"] },
  nodi: {
    casa: {
      titolo: "La casa e i suoi impianti",
      testo: "Una casa non è fatta solo di muri. Dentro le pareti e sotto i pavimenti corrono gli impianti: le reti che portano corrente, acqua, gas e calore in ogni stanza. Di solito non si vedono: qui la facciata è stata tolta per seguirli, dai contatori all'ingresso fino ai termosifoni.",
      img: "img/casa.webp",
      alt: "Casa a due piani senza la facciata: al piano terra, da sinistra, l'ingresso con un piccolo quadro grigio sul muro, la cucina con il piano cottura e un locale con la caldaia bianca; al primo piano il bagno con lavandino e doccia e una camera con il termosifone sotto la finestra; fuori, a sinistra, una nicchia nel muretto con i contatori.",
      fuoco: [50, 50],
      fasi: [0, 1, 2, 3],
      punti: [
        { x: 9, y: 66, etichetta: "Contatori", vai: "contatori" },
        { x: 33, y: 57, etichetta: "Quadro elettrico", vai: "quadro" },
        { x: 33, y: 33, etichetta: "Impianto idrico", vai: "bagno" },
        { x: 53, y: 60, etichetta: "Impianto del gas", vai: "cucina" },
        { x: 72, y: 58, etichetta: "Riscaldamento", vai: "riscaldamento" }
      ]
    },

    contatori: {
      titolo: "Contatori",
      testo: "Corrente, gas e acqua arrivano dalla strada, ognuno con la sua rete. Prima di entrare in casa passano da un contatore, che misura quanto ne usi: la corrente in kilowattora, il gas e l'acqua in metri cubi. Da quelle misure nascono le bollette. Vicino al contatore del gas c'è un rubinetto per chiuderlo in caso di emergenza.",
      img: "img/contatori.webp",
      alt: "Nicchia aperta in un muro di giardino con tre contatori: a sinistra quello elettrico, una scatola chiara con un piccolo schermo; al centro quello del gas, collegato a un tubo giallo con una leva; a destra quello dell'acqua, rotondo, su un tubo di metallo.",
      fuoco: [55, 45],
      fasi: [0, 1, 2],
      note: [
        { x: 37, y: 30, etichetta: "Contatore elettrico", testo: "Misura l'energia elettrica in kilowattora (kWh). I contatori di oggi sono elettronici e inviano la lettura al distributore da soli." },
        { x: 55, y: 52, etichetta: "Contatore del gas", verso: "giu", testo: "Misura in metri cubi il gas che entra in casa. Accanto ha il rubinetto generale, da chiudere in caso di emergenza o di una lunga assenza." },
        { x: 72, y: 44, etichetta: "Contatore dell'acqua", lato: "dx", testo: "Misura in metri cubi l'acqua che entra: un metro cubo sono 1.000 litri. Se gira con tutti i rubinetti chiusi, da qualche parte c'è una perdita." }
      ]
    },

    quadro: {
      titolo: "Quadro elettrico",
      testo: "Dal contatore la corrente arriva al quadro elettrico, vicino all'ingresso. Qui si divide in circuiti: uno per le luci, uno per le prese, altri per gli apparecchi più potenti. Ogni circuito ha il suo interruttore magnetotermico, che scatta se passa troppa corrente e i fili rischiano di surriscaldarsi.",
      img: "img/quadro.webp",
      alt: "Quadro elettrico aperto sulla parete di un ingresso: una fila di interruttori bianchi con le levette, collegati a fili colorati ordinati; sullo sfondo la porta di casa.",
      fuoco: [65, 50],
      fasi: [0],
      punti: [
        { x: 50, y: 50, etichetta: "Salvavita", vai: "salvavita", lato: "sx" }
      ],
      note: [
        { x: 74, y: 46, etichetta: "Interruttori magnetotermici", testo: "Ce n'è uno per ogni circuito. Scattano se passa troppa corrente, per un sovraccarico o un cortocircuito, e si riarmano alzando la levetta." },
        { x: 70, y: 70, etichetta: "Fili verso le stanze", verso: "giu", testo: "Da ogni interruttore parte un circuito. I fili corrono dentro tubi protettivi nascosti nei muri, fino alle prese e ai punti luce." }
      ]
    },

    salvavita: {
      titolo: "Salvavita",
      testo: "È l'interruttore differenziale, il dispositivo più importante della casa. Confronta la corrente che entra con quella che esce: se una parte prende una strada sbagliata, per esempio attraverso una persona, scatta e toglie tutto in una frazione di secondo. Il tasto di prova serve a controllare ogni tanto che funzioni.",
      img: "img/salvavita.webp",
      alt: "Primo piano di un interruttore bianco montato su una guida di metallo: in alto una levetta grigia alzata, più in basso un piccolo tasto rotondo.",
      fuoco: [50, 50],
      fasi: [0],
      note: [
        { x: 50, y: 30, etichetta: "Leva", testo: "In alto è acceso, in basso è scattato. Se scatta, prima di rialzarla bisogna capire perché: è un compito da adulti." },
        { x: 44, y: 60, etichetta: "Tasto di prova", testo: "È segnato con una T. Premendolo si simula una dispersione: se il salvavita funziona, scatta subito." }
      ]
    },

    bagno: {
      titolo: "Impianto idrico",
      testo: "Dopo il contatore, l'acqua dell'acquedotto sale nei tubi dentro le pareti fino ai rubinetti: un tubo per la fredda e uno per la calda, scaldata dalla caldaia o da uno scaldabagno. L'acqua usata scende negli scarichi, tubi più larghi e sempre in pendenza, e va alla fognatura.",
      img: "img/bagno.webp",
      alt: "Bagno con una parte della parete e del pavimento aperta: a sinistra il lavandino, a destra la doccia; dentro la parete un tubo rosso e uno blu arrivano ai rubinetti, sotto il pavimento corre un tubo grigio più largo.",
      fuoco: [45, 45],
      fasi: [1],
      punti: [
        { x: 20, y: 33, etichetta: "Sifone", vai: "sifone" }
      ],
      note: [
        { x: 40, y: 37, etichetta: "Acqua calda", testo: "Arriva dalla caldaia o dallo scaldabagno in un tubo separato, spesso isolato per non disperdere calore." },
        { x: 52, y: 42, etichetta: "Acqua fredda", verso: "giu", testo: "È l'acqua dell'acquedotto così com'è, appena passata dal contatore." },
        { x: 78, y: 77, etichetta: "Scarico", testo: "Un tubo più largo di quelli di arrivo, sempre in discesa: l'acqua usata se ne va per gravità, senza pompe." }
      ]
    },

    sifone: {
      titolo: "Sifone",
      testo: "Sotto ogni lavandino lo scarico fa una curva a U: è il sifone. Nella curva resta sempre un po' d'acqua, che fa da tappo e non lascia risalire in casa i cattivi odori della fogna. Se uno scarico non viene usato per molto tempo, quell'acqua evapora e l'odore passa.",
      img: "img/sifone.webp",
      alt: "Sotto un lavandino bianco: un tubo trasparente piegato a U con dell'acqua ferma nella curva, collegato a un tubo grigio che entra nel muro; ai lati due tubi flessibili con i rubinetti di arresto.",
      fuoco: [55, 60],
      fasi: [1],
      note: [
        { x: 50, y: 80, etichetta: "Acqua che fa da tappo", testo: "Riempie il fondo della curva e chiude il passaggio all'aria della fogna. Ogni volta che usi il lavandino si rinnova." },
        { x: 72, y: 57, etichetta: "Verso la fognatura", testo: "Dopo il sifone lo scarico entra nel muro e scende fino alla rete fognaria." },
        { x: 20, y: 53, etichetta: "Rubinetto di arresto", testo: "Chiude l'acqua a un solo apparecchio, senza toglierla a tutta la casa. È utile per una riparazione." }
      ]
    },

    cucina: {
      titolo: "Impianto del gas",
      testo: "Il gas arriva con tubi interrati, passa dal contatore e raggiunge i fornelli e la caldaia. Di suo non ha odore: quello che si sente è una sostanza aggiunta apposta per accorgersi delle perdite. Se senti odore di gas non accendere luci né apparecchi, apri le finestre, esci e avvisa un adulto.",
      img: "img/cucina.webp",
      alt: "Piano di una cucina con un piano cottura d'acciaio: un fornello acceso con la fiamma azzurra sotto una pentola; lo sportello sotto è aperto e mostra un tubo giallo con una leva e un tubo flessibile che sale al piano cottura.",
      fuoco: [45, 50],
      fasi: [2],
      punti: [
        { x: 38, y: 40, etichetta: "Fornello", vai: "fornello" }
      ],
      note: [
        { x: 47, y: 62, etichetta: "Tubo flessibile", testo: "Collega il piano cottura all'impianto fisso. Se è di gomma ha una data di scadenza stampata sopra e va sostituito in tempo." },
        { x: 42, y: 80, etichetta: "Rubinetto del gas", testo: "Chiude il gas all'apparecchio. La leva di traverso rispetto al tubo vuol dire chiuso, in linea con il tubo vuol dire aperto." }
      ]
    },

    fornello: {
      titolo: "Fornello",
      testo: "Nel bruciatore il gas si mescola con l'aria ed esce da tanti piccoli fori. Una fiamma azzurra e regolare dice che la combustione è buona. Accanto alla fiamma c'è la termocoppia, una sonda di sicurezza: se la fiamma si spegne, chiude il gas da sola.",
      img: "img/fornello.webp",
      alt: "Primo piano di un bruciatore acceso: una corona di fiammelle azzurre sotto una griglia nera; a destra, accanto alla fiamma, una piccola sonda di metallo e una candeletta bianca.",
      fuoco: [50, 50],
      fasi: [2],
      note: [
        { x: 40, y: 50, etichetta: "Fiamma azzurra", testo: "Azzurra vuol dire che il gas brucia bene, con tutta l'aria che serve. Una fiamma gialla, che annerisce le pentole, segnala un bruciatore da far controllare." },
        { x: 70, y: 62, etichetta: "Termocoppia", verso: "giu", testo: "Una piccola asta di metallo accanto alla fiamma. Finché è calda tiene aperto il gas; se si raffredda lo chiude." },
        { x: 78, y: 42, etichetta: "Accensione", testo: "Una candeletta che fa scoccare una scintilla elettrica vicino al bruciatore: così non servono fiammiferi." }
      ]
    },

    riscaldamento: {
      titolo: "Riscaldamento",
      testo: "Il riscaldamento è il consumo più grande di una casa. Di solito una caldaia scalda l'acqua, che gira nei tubi fino ai termosifoni e torna indietro raffreddata. Il termostato decide quando accenderla. Al posto della caldaia può lavorare una pompa di calore, che sta fuori casa.",
      img: "img/riscaldamento.webp",
      alt: "Locale di servizio: a sinistra una caldaia bianca appesa al muro con i tubi sotto, al centro un piccolo termostato rotondo, a destra un termosifone bianco sotto una finestra da cui si vede, in giardino, l'unità esterna di una pompa di calore.",
      fuoco: [50, 45],
      fasi: [3],
      punti: [
        { x: 46, y: 31, etichetta: "Termostato", vai: "termostato" },
        { x: 72, y: 72, etichetta: "Termosifone", vai: "termosifone" },
        { x: 78, y: 33, etichetta: "Pompa di calore", vai: "pompa" }
      ],
      note: [
        { x: 22, y: 25, etichetta: "Caldaia", testo: "Brucia gas per scaldare l'acqua dei termosifoni e quella dei rubinetti. Le caldaie a condensazione recuperano anche il calore dei fumi." }
      ]
    },

    termosifone: {
      titolo: "Termosifone",
      testo: "Nel termosifone scorre l'acqua calda che arriva dalla caldaia: il metallo si scalda e cede il calore all'aria della stanza. La valvola termostatica regola quanta acqua entra, così ogni stanza può avere la sua temperatura. Coprirlo con tende o mobili fa sprecare calore.",
      img: "img/termosifone.webp",
      alt: "Termosifone bianco sotto la finestra di una camera: in basso a sinistra una valvola con la manopola bianca, due tubi che entrano nel pavimento.",
      fuoco: [40, 50],
      fasi: [3],
      note: [
        { x: 23, y: 61, etichetta: "Valvola termostatica", testo: "Una manopola numerata che sente la temperatura della stanza. Raggiunta quella scelta, riduce l'acqua calda che entra." },
        { x: 45, y: 40, etichetta: "Acqua calda all'interno", testo: "Entra calda da un lato, cede calore al metallo ed esce più fredda dall'altro, per tornare alla caldaia." }
      ]
    },

    termostato: {
      titolo: "Termostato",
      testo: "Il termostato misura la temperatura della casa e la confronta con quella scelta: se fa più freddo accende il riscaldamento, quando ci si arriva lo spegne. Ogni grado in meno fa risparmiare circa il 5-7% di riscaldamento.",
      img: "img/termostato.webp",
      alt: "Termostato bianco e rotondo su una parete, con una ghiera da ruotare; sullo sfondo, sfocati, un divano e una finestra.",
      fuoco: [70, 50],
      fasi: [3],
      note: [
        { x: 84, y: 45, etichetta: "Ghiera per scegliere i gradi", lato: "sx", testo: "Ruotandola si imposta la temperatura desiderata. Di giorno, in casa, bastano 19-20 gradi." }
      ]
    },

    pompa: {
      titolo: "Pompa di calore",
      testo: "La pompa di calore non brucia niente: sposta il calore dall'aria di fuori all'acqua dell'impianto, come un frigorifero al contrario. Funziona a elettricità: con 1 kilowattora ne porta in casa circa 3 di calore. Il ventilatore fa passare l'aria esterna da cui prende il calore.",
      img: "img/pompa.webp",
      alt: "Unità esterna di una pompa di calore accanto al muro di una casa: una cassa chiara con una grande griglia rotonda e un ventilatore, su una base di cemento in giardino; due tubi isolati entrano nel muro.",
      fuoco: [60, 50],
      fasi: [3],
      note: [
        { x: 48, y: 40, etichetta: "Ventilatore", testo: "Aspira l'aria esterna e la fa passare su una serpentina, dove un fluido ne assorbe il calore anche quando fuori fa freddo." },
        { x: 88, y: 50, etichetta: "Tubi verso la casa", lato: "sx", testo: "Portano all'impianto di casa il calore raccolto fuori." }
      ]
    }
  }
};
