# MC-DIS-2-02 — Come si disegna un oggetto 3D su un foglio 2D in modo che sembri solido?
**Area:** Disegno Tecnico · **Anno:** 2ª · **Livello DigComp:** Intermediate (I)
**SDG:** 4 — Istruzione di qualità · **Fonte:** Paci 2014
**Struttura:** 4 pagine (MC avanzata) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il manuale che non parla"**
> *Ascolta prima di leggere. Durata: 48 sec.*
> *(Hook creato per questa MC — script disponibile in MC-DIS-2-02_hook-script.md)*

**Domanda di avvio:**
Prendi in mano il manuale di montaggio di qualsiasi mobile o giocattolo. Le figure che spiegano come assemblare i pezzi mostrano l'oggetto da un'angolazione strana — non proprio di fronte, non proprio di lato, ma un po' di tutti e due insieme. Si vede la profondità, si vede l'altezza, si vede la larghezza — tutto in un colpo solo.

Quella rappresentazione non è prospettiva — è assonometria. Ed è uno dei sistemi di rappresentazione più potenti che un tecnico conosce.

---

## 📖 ESPLORA

### Il problema delle proiezioni ortogonali

Nella MC-DIS-2-01 hai imparato le proiezioni ortogonali: un oggetto viene rappresentato in tre viste separate (frontale, laterale, pianta), ognuna delle quali mostra due dimensioni. Il sistema è preciso e misurabile, ed è quello che si usa per costruire oggetti.

Ma ha un limite che diventa evidente non appena provi a spiegare qualcosa a qualcuno che non ha studiato disegno tecnico: le proiezioni ortogonali non sono intuitive. Un non-tecnico che guarda tre rettangoli separati su un foglio fatica a ricostruire mentalmente la forma tridimensionale che rappresentano. Riesce a leggere le misure, ma non "vede" l'oggetto.

Pensa a un manuale di montaggio IKEA. Se mostrasse solo viste ortogonali, pochissime persone riuscirebbero a seguirle senza una guida. Invece IKEA usa disegni che mostrano l'oggetto in prospettiva tridimensionale — non spezzato in viste separate, ma intero, da un'angolazione che permette di vedere profondità, altezza e larghezza contemporaneamente.

L'assonometria è la risposta a questa esigenza: una rappresentazione tridimensionale su foglio bidimensionale che mantiene le misure misurabili, ma che dà immediatamente una percezione spaziale dell'oggetto.

---

### Cos'è l'assonometria — la logica di base

La parola "assonometria" viene dal greco: *axon* (asse) + *metron* (misura). Significa letteralmente "misurare sugli assi". La definizione racconta già la caratteristica fondamentale: in un disegno assonometrico, le misure si leggono direttamente sugli assi coordinati.

Il principio è questo: l'oggetto viene proiettato su un unico piano (il foglio) in modo che tre sue facce siano visibili contemporaneamente. Per farlo, gli assi cartesiani dell'oggetto (x, y, z) vengono "ruotati" e "inclinati" rispetto al piano del foglio secondo angoli precisi che dipendono dal tipo di assonometria.

Il risultato è una figura che sembra tridimensionale ma che in realtà è piatta — tutte le linee sono sul foglio, come in una proiezione ortogonale. La differenza è che queste linee sono disposte in modo da suggerire profondità.

Esistono diversi tipi di assonometria. In Italia nei disegni tecnici si usano principalmente due: l'**assonometria cavaliera obliqua** e l'**assonometria isometrica**.

---

### Assonometria cavaliera obliqua

L'assonometria cavaliera è il tipo più semplice da costruire a mano e il più usato nei manuali d'uso e nelle istruzioni di montaggio.

**Gli assi:**
- Asse x (larghezza): orizzontale, a 0° rispetto alla riga orizzontale del foglio.
- Asse z (altezza): verticale, a 90° rispetto alla riga orizzontale.
- Asse y (profondità): obliquo, a 45° rispetto alla riga orizzontale.

**Il fattore di riduzione:**
L'asse obliquo (y) subisce una riduzione. Le misure lungo l'asse y vengono moltiplicate per 0,5 — cioè vengono ridotte alla metà. Le misure lungo gli assi x e z vengono invece mantenute nella loro lunghezza reale (fattore di riduzione 1).

Questo significa che se un oggetto è profondo 60 mm, lungo l'asse obliquo si disegna come se fosse profondo solo 30 mm. La distorsione è voluta: se si mantenesse la profondità intera a 45°, l'oggetto sembrerebbe schiacciato e innaturale.

**Come si costruisce un parallelepipedo in assonometria cavaliera:**

1. Disegna il punto d'origine O (un angolo del parallelepipedo).
2. Dal punto O traccia i tre assi: x a 0° verso destra, z a 90° verso l'alto, y a 45° verso l'alto-destra.
3. Lungo l'asse x riporta la larghezza reale (es. 80 mm).
4. Lungo l'asse z riporta l'altezza reale (es. 50 mm).
5. Lungo l'asse y riporta la profondità ridotta alla metà (es. profondità reale 60 mm → 30 mm sul disegno).
6. Completa le tre facce visibili tracciando le linee parallele agli assi.
7. Aggiungi gli spigoli posteriori (quelli nascosti, se vuoi indicarli, con linee tratteggiate).

**Quando si usa:**
L'assonometria cavaliera è preferita quando si vuole disegnare rapidamente e a mano, o quando la faccia frontale dell'oggetto ha una forma complessa che deve essere mostrata senza distorsioni. La faccia frontale dell'oggetto (il piano xz) mantiene le proporzioni reali — solo la profondità viene ridotta e inclinata.

> **Box Storia — Albrecht Dürer e la prospettiva geometrica**
>
> Albrecht Dürer (1471–1528), pittore e incisore tedesco, è stato uno dei primi artisti a studiare sistematicamente la geometria della rappresentazione spaziale. Nel suo trattato *Underweysung der Messung* (1525) descriveva l'uso di dispositivi ottici per tracciare correttamente le proporzioni, ma il suo interesse non era solo artistico: voleva capire le regole matematiche che governano come l'occhio percepisce la profondità.
>
> Le assonometrie che Dürer usava nei suoi disegni preparatori per le incisioni erano precursori delle assonometrie tecniche moderne. La differenza tra un artista del Rinascimento e un progettista CAD di oggi è minore di quanto sembri: entrambi stanno risolvendo lo stesso problema, la rappresentazione della profondità su un piano, con strumenti diversi ma con la stessa logica geometrica di base.

---

### Assonometria isometrica

L'assonometria isometrica è più equilibrata della cavaliera: mostra le tre facce dell'oggetto con la stessa enfasi, senza che nessuna faccia sia "privilegiata".

**Gli assi:**
- I tre assi (x, y, z) sono ugualmente inclinati rispetto al piano del foglio.
- Sul foglio, i tre assi formano tra loro angoli di 120°.
- In pratica: due assi (x e y) vanno a 30° rispetto all'orizzontale (uno verso destra-alto, uno verso sinistra-alto), e il terzo asse (z) è verticale a 90°.

**Il fattore di riduzione:**
In assonometria isometrica rigorosa, tutte le misure lungo tutti e tre gli assi subirebbero una riduzione di circa 0,816. Nella pratica del disegno tecnico, si usa la cosiddetta "isometria semplificata": le misure vengono riportate in scala reale su tutti e tre gli assi (fattore di riduzione 1). Il disegno risultante è leggermente ingrandito rispetto all'isometria rigurosa, ma le proporzioni tra le tre dimensioni sono corrette — e il disegno è molto più semplice da costruire.

**Come si costruisce un parallelepipedo in assonometria isometrica:**

1. Disegna il punto d'origine O.
2. Dal punto O traccia i tre assi: z verticale a 90°, x a 30° verso destra, y a 30° verso sinistra.
3. Lungo l'asse x riporta la larghezza reale.
4. Lungo l'asse y riporta la profondità reale.
5. Lungo l'asse z riporta l'altezza reale.
6. Completa le tre facce visibili tracciando le linee parallele agli assi corrispondenti.

**Quando si usa:**
L'assonometria isometrica è preferita quando l'oggetto ha tre dimensioni simili (un cubo, per esempio, appare perfettamente simmetrico), quando si vuole una rappresentazione equilibrata che non enfatizza nessuna faccia in particolare, e quando si usa il software CAD (i programmi 3D generano automaticamente proiezioni isometriche).

---

### Confronto tra i due tipi: quando scegliere quale

| Caratteristica | Cavaliera obliqua | Isometrica |
|----------------|------------------|------------|
| Angolo assi obliqui | 45° | 30° |
| Fattore riduzione | 0,5 sull'asse y | 1 su tutti gli assi |
| Faccia frontale | Invariata (nessuna deformazione) | Leggermente deformata |
| Semplicità costruzione | Alta (triangolo 45°) | Media (richede goniometro o squadra 30/60°) |
| Impatto visivo | Più "inclinato" | Più equilibrato |
| Uso tipico | Manuali, disegni esplicativi rapidi | Cataloghi, rendering tecnici, CAD |

La **regola pratica**: se hai una faccia importante che deve apparire senza distorsioni (es. la faccia di un edificio con finestre e porte), usa la cavaliera e metti quella faccia sul piano frontale. Se vuoi mostrare un oggetto in modo equilibrato con tre facce simili, usa l'isometrica.

> **Caso studio — IKEA e l'assonometria cavaliera**
>
> Tutte le istruzioni di montaggio IKEA usano assonometria cavaliera, non prospettiva e non isometrica. Perché?
>
> La cavaliera ha un vantaggio pratico decisivo: la faccia frontale dell'oggetto — quella che lo studente del design IKEA decide di mettere davanti — non subisce nessuna deformazione. Se un pannello è rettangolare, nella vista cavaliera appare rettangolare. Se ha un foro tondo, appare tondo.
>
> Nella prospettiva, invece, le forme si deformano con la distanza. Nell'isometrica, i rettangoli diventano parallelogrammi. Per chi deve capire come incastrare due pezzi, vedere la forma reale della faccia è più importante che avere una "bella" tridimensionalità.
>
> IKEA ha scelto la cavaliera per una ragione funzionale, non estetica. È una scelta di comunicazione tecnica: privilegia la precisione sull'aspetto. E ha funzionato così bene che oggi è diventata uno standard de facto per i manuali di montaggio in tutto il mondo.

---

### Assonometria di figure composte: la strategia per box

Molti oggetti reali non sono parallelepipedi semplici: sono composizioni di solidi — un cubo con una piramide sopra, un cilindro con un disco sotto, un prisma con un foro passante.

La strategia per disegnare oggetti compositi in assonometria è sempre la stessa: **metodo del box**.

1. Immagina il volume totale dell'oggetto come un parallelepipedo che lo contiene tutto (il "box").
2. Disegna quel parallelepipedo in assonometria.
3. A partire dalla struttura del box, "scolpisci" le forme specifiche dell'oggetto: taglia gli angoli, aggiungi i volumi sporgenti, rimuovi i volumi mancanti.
4. Cancella le linee che non appartengono all'oggetto reale; tratteggia quelle che sono nascoste.

Esempio: un mattone con smussatura in alto.

- Il box è un parallelepipedo 200×100×65 mm.
- La smussatura taglia l'angolo superiore frontale con un piano a 45°.
- Prima disegno il box completo in assonometria cavaliera.
- Poi traccio la linea di taglio sulla faccia frontale (partendo da un punto a 15 mm dall'angolo superiore su entrambi i lati).
- Cancello la parte del box che non esiste più (l'angolo tagliato).
- Il risultato è un parallelepipedo con un angolo smussato.

> **Collegamento STEM — Geometria euclidea:**
> Nell'assonometria cavaliera, le linee parallele nell'oggetto reale rimangono parallele nel disegno. Questo è diverso dalla prospettiva, dove le linee parallele convergono verso punti di fuga. L'assonometria conserva il parallelismo: è una proiezione parallela (o cilindrica), non una proiezione centrale (conica). Questa proprietà matematica è ciò che rende le misure leggibili: se una linea è parallela all'asse x, la sua lunghezza nel disegno corrisponde (o corrisponde scalata) alla lunghezza reale. Le misure in direzioni oblique rispetto agli assi non sono direttamente leggibili — e questa è la limitazione delle assonometrie rispetto alle proiezioni ortogonali.

---

### Le ellissi: come si disegnano i cerchi in assonometria

I cerchi sono un caso speciale. Un cerchio reale, proiettato in assonometria, diventa un'ellisse. La forma e le proporzioni dell'ellisse dipendono dal piano su cui si trova il cerchio e dal tipo di assonometria.

**Nell'assonometria cavaliera:**
- Un cerchio sul piano frontale (xz) rimane un cerchio.
- Un cerchio sul piano orizzontale (xy) o sul piano laterale (yz) diventa un'ellisse.

**Nell'assonometria isometrica:**
- Un cerchio su qualsiasi piano principale diventa un'ellisse con asse maggiore circa 1,22 volte il diametro reale e asse minore circa 0,71 volte il diametro reale.

Per disegnare queste ellissi a mano si usa la tecnica del **quadrato assonometrico**: si disegna prima il quadrato in assonometria (che diventa un rombo o un parallelogramma), poi si inscrive l'ellisse nel quadrato assonometrico usando punti di tangenza e il metodo dei quattro archi. È una tecnica con il compasso che richiede pratica.

---

## 🔍 OSSERVA

### Il caso: Tinkercad e il passaggio dal 2D al 3D

Tinkercad è un software di modellazione 3D gratuito e accessibile online, sviluppato da Autodesk, usato in migliaia di scuole nel mondo per iniziare alla progettazione CAD. Il suo punto di forza è che lavora esattamente con la logica del metodo del box: ogni oggetto si costruisce combinando forme solide elementari (cubi, cilindri, sfere, prismi), aggiungendone alcune e sottraendone altre.

Quando esporti un modello da Tinkercad, puoi ottenere automaticamente:
- La vista isometrica (che Tinkercad mostra di default come anteprima).
- Le proiezioni ortogonali (esportabili come file DXF per LibreCAD o simili).

Guardare la vista isometrica di Tinkercad e sapere disegnare a mano l'assonometria sono la stessa competenza, espressa con strumenti diversi. Chi sa costruire la forma in assonometria a mano capisce immediatamente cosa sta guardando nel software 3D — e viceversa.

---

> **Errore comune:**
> "Nell'assonometria isometrica, la misura verticale rimane quella reale ma quelle orizzontali si riducono." Sbagliato. Nell'isometrica semplificata (quella usata in pratica), le misure si riportano in scala reale su tutti e tre gli assi — verticale, destro e sinistro. Confondere l'isometrica rigorosa (con riduzione di 0,816) con l'isometrica semplificata (senza riduzione) è uno degli errori più comuni. In quasi tutti i manuali scolastici italiani si usa l'isometrica semplificata. Se il testo non lo specifica, usa quella.

---


### 🔧 Chi lavora con questa competenza nel 2030?

**Product Designer**

Analizza i bisogni degli utenti e della società per ideare prodotti che ancora non esistono o che risolvono problemi reali, usando design thinking e prototipazione rapida.

Dove lavora: studi di industrial design, aziende di arredo e oggettistica di consumo, startup di hardware, reparti prodotto di aziende consumer.

Competenze chiave che inizia a costruire da qui: design thinking · prototipazione rapida · ergonomia · user research · design industriale

*"Ogni oggetto che progettiamo entra nella vita di qualcuno. Questa responsabilità guida ogni mia scelta."*


**Green Product Designer**

Progetta oggetti belli, comodi e leggeri per il pianeta. Parte da schizzi assonometrici per esplorare le forme, poi valuta ogni scelta lungo l'intero ciclo di vita del prodotto: da dove viene il materiale, quanta energia serve per produrlo, cosa succederà quando l'oggetto non servirà più. Il disegno tridimensionale gli permette di mostrare ai clienti come sarà il prodotto prima ancora di costruirne il prototipo.

Dove lavora: studi di design sostenibile, aziende di arredamento e packaging, startup dell'economia circolare, reparti innovazione di aziende manifatturiere, centri di ricerca sui materiali.

Competenze chiave che inizia a costruire da qui: design sostenibile · LCA · materiali eco · ergonomia · innovazione di prodotto

*"Prima di scegliere un materiale mi chiedo sempre: che fine farà tra dieci anni?"*

---

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### BASE — Disegno un parallelepipedo in assonometria cavaliera

**Obiettivo:** costruire un parallelepipedo in assonometria cavaliera seguendo la procedura passo per passo.

**Materiali che ti servono:** foglio A4, matita, righello, squadra a 45° (o una squadra a 45/45/90°).

**Le dimensioni del tuo parallelepipedo:** larghezza 80 mm, altezza 50 mm, profondità 60 mm.

**Procedura:**

1. Traccia un punto O al centro-sinistra del foglio — sarà l'angolo anteriore inferiore sinistro del parallelepipedo.

2. Dal punto O traccia tre linee-guida sottili (le cancellerai alla fine):
   - Asse x: orizzontale verso destra.
   - Asse z: verticale verso l'alto.
   - Asse y: a 45° verso l'alto-destra (usa la squadra a 45°).

3. Sull'asse x riporta 80 mm verso destra: segna il punto A.

4. Sull'asse z riporta 50 mm verso l'alto: segna il punto B.

5. Sull'asse y riporta 30 mm (metà di 60 mm — ricorda: fattore di riduzione 0,5): segna il punto C.

6. Dai punti A, B, C traccia linee parallele agli altri due assi per trovare tutti i vertici del parallelepipedo.

7. Cancella le linee-guida degli assi. Tratteggia gli spigoli nascosti (quelli che non si vedono dalla direzione di osservazione che hai scelto).

**Domanda:** quanti spigoli in totale ha un parallelepipedo? Quanti sono visibili nel disegno che hai fatto? Quanti sono nascosti?

---

### INTERMEDIO — Assonometria cavaliera e isometrica dello stesso oggetto

**Obiettivo:** disegnare lo stesso oggetto nei due tipi di assonometria e confrontare i risultati.

**Materiali che ti servono:** foglio A3 (o due fogli A4 affiancati), matita, righello, squadra 30/60/90° e squadra 45°.

**L'oggetto:** un gradino — due parallelepipedi sovrapposti e sfalsati.
- Parte inferiore: 120×40×60 mm (larghezza×altezza×profondità).
- Parte superiore: 80×40×60 mm, appoggiata sul lato sinistro della parte inferiore.

**Disegna i due assonometrici affiancati sul foglio — uno cavaliere (sinistra) e uno isometrico (destra).**

Per la cavaliera: asse y a 45°, riduzione 0,5 sull'asse y.
Per l'isometrica: assi x e y a 30° rispettivamente, nessuna riduzione.

Usa il metodo del box:
1. Disegna il box totale che contiene entrambe le parti (120×80×60 mm).
2. "Scolpisci" il gradino rimuovendo il volume mancante in alto a destra.

**Dopo aver disegnato entrambi:**

Confronta i due disegni. Quale delle due rappresentazioni mostra meglio la forma del gradino? Quale ti sembra più "naturale"? La risposta dipende dal punto di vista — annota la tua osservazione in 2-3 righe.

---

### AVANZATO — Solido composto con cilindro in assonometria isometrica

**Scenario:** sei il designer tecnico di un'azienda che produce supporti per smartphone. Devi comunicare visivamente la forma del nuovo supporto al team di marketing (che non sa leggere proiezioni ortogonali) e al team di produzione (che ha bisogno di misure precise).

**Il solido:**
- Base: parallelepipedo 100×80×20 mm.
- Colonna centrale: cilindro ⌀40 mm, altezza 60 mm, centrato sulla base.
- Supporto superiore: parallelepipedo 90×30×10 mm, centrato sulla sommità del cilindro.

**Il tuo compito:**

1. Disegna il solido in assonometria isometrica usando il metodo del box. Per il cilindro usa il metodo del quadrato assonometrico per costruire le ellissi (superiore e inferiore) — o approssimale a mano libera con la forma corretta se non hai ancora la tecnica del compasso.

2. Quotatura assonometrica: aggiungi le quote principali (non è la quotatura UNI completa — è una quotatura semplificata per comunicare le dimensioni chiave nel contesto di un'assonometria). Le linee di quota nell'assonometria sono parallele agli assi assonometrici.

3. **Doppio output:** prepara anche una breve nota di due righe per ognuno dei due destinatari:
   - Per il marketing: cosa comunica questo disegno sulla forma del prodotto?
   - Per la produzione: quali informazioni mancano in questa rappresentazione che sarebbero necessarie per costruire l'oggetto? (Suggerimento: confronta con le proiezioni ortogonali.)

> **Per chi vuole andare oltre:** modella il solido in Tinkercad e confronta la vista isometrica automatica del software con il disegno manuale. Dove ci sono differenze? Perché?

---

## 🌍 AGISCI

---

### Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | Base — Sufficiente | Intermedio — Buono | Avanzato — Ottimo |
|----------|-------------------|-------------------|------------------|
| **1. Correttezza degli assi e degli angoli** | Gli assi principali sono riconoscibili (orizzontale, verticale, obliquo); gli angoli sono approssimativi | Gli angoli degli assi sono corretti (45° per la cavaliera, 30° per l'isometrica); le linee sono parallele agli assi | Gli assi sono precisi, tracciati con squadra; le linee sono esattamente parallele agli assi; il fattore di riduzione è applicato correttamente |
| **2. Proporzioni e misure** | Le proporzioni tra larghezza, altezza e profondità sono riconoscibili; il fattore di riduzione è applicato almeno parzialmente | Il fattore di riduzione è applicato correttamente sull'asse obliquo (cavaliera) o tutte le misure sono in scala (isometrica) | Le misure sono verificabili con il righello; le proporzioni corrispondono alle dimensioni reali dell'oggetto scelto |
| **3. Completezza del disegno** | Il parallelepipedo principale è disegnato; gli spigoli visibili sono presenti | Tutti gli spigoli visibili sono corretti; gli spigoli nascosti sono indicati con linee tratteggiate | Il disegno è completo con tutti gli elementi: visibili, nascosti, assi di simmetria dove necessario; il tipo di assonometria è indicato |
| **4. Leggibilità e presentazione** | Il disegno è comprensibile con qualche sforzo; il titolo è presente | Il disegno è leggibile e ordinato; il tipo di assonometria e l'oggetto sono chiaramente identificabili | Il disegno è pulito e professionale; include una breve legenda; eventuali quote o indicazioni di scala sono presenti e corrette |

---

### Lo scenario

Il tuo compagno di banco ha perso le istruzioni di montaggio di un oggetto e ti chiede aiuto. L'oggetto è ancora intatto — lo puoi misurare — ma non hai una stampante per rifarne il manuale. Devi disegnare a mano una vista assonometrica dell'oggetto che permetta al tuo compagno di capire come è fatto e come va assemblato.

In pratica: devi comunicare la forma tridimensionale di un oggetto reale usando l'assonometria.

---

### La consegna

**Scegli un oggetto semplice** di dimensioni non superiori a 15×15×15 cm. Buone scelte: una scatola di scarpe piccola, un astuccio, una matita (con sezione esagonale o cilindrica), un gomitolo di nastro adesivo, un dado di legno per giochi da tavolo.

Evita oggetti con superfici curve complesse — curva significa ellisse, che è tecnica avanzata.

**Produzione del disegno assonometrico:**

1. Misura le tre dimensioni principali dell'oggetto con righello o metro.

2. Scegli il tipo di assonometria:
   - Se l'oggetto ha una faccia importante (frontale), scegli la cavaliera.
   - Se l'oggetto è simile nelle tre dimensioni, scegli l'isometrica.

3. Disegna il parallelepipedo principale usando il metodo degli assi (tracci prima gli assi, poi riporti le misure).

4. Se l'oggetto ha dettagli (una scritta in rilievo, un bordo rientrante, un foro), provaci — ma non ti preoccupare se non viene perfetto: la competenza fondamentale è il parallelepipedo di base.

5. Aggiungi nell'angolo in basso a destra: tipo di assonometria usata, dimensioni reali dell'oggetto, data.

**Materiali che ti servono:** foglio A4, matita, righello, squadra appropriata (45° per cavaliera, 30/60° per isometrica), gomma.

---

### Badge SDG 4 — Istruzione di qualità

L'assonometria è il linguaggio con cui un progettista comunica la forma di un oggetto a persone con background diversi: i tecnici leggono le misure, i non-tecnici capiscono la forma. Questa capacità di comunicare con linguaggi diversi a pubblici diversi è una competenza trasversale che va ben oltre il disegno tecnico.

---

### Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona e chiedi all'AI Coach:
- *"Come traccio un asse a 45° senza la squadra?"*
- *"Perché la mia assonometria sembra piatta?"*
- *"Come disegno un cilindro in assonometria isometrica?"*

L'AI Coach risponde solo su questa MC. Verifica sempre le sue risposte con il righello e la squadra.

---

### Metacognizione — Rifletti sul tuo lavoro

**1. Sorpresa**
Scegliendo l'oggetto, hai trovato qualcosa di inaspettato nelle sue dimensioni — una faccia che pensavi fosse quadrata ed è invece rettangolare, una profondità diversa da quello che immaginavi? Come ha influenzato il tuo disegno?

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Difficoltà e soluzione**
Qual è stata la parte più difficile: tracciare gli assi correttamente, riportare le misure, o capire quali spigoli erano visibili e quali nascosti? Come hai superato quella difficoltà?

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa**
C'è stato un momento in cui il tuo disegno sembrava "storto" o le proporzioni sembravano sbagliate? Come hai capito dov'era il problema — era un asse con l'angolo sbagliato, una misura non ridotta, o qualcos'altro? Hai dovuto ricominciare da capo o hai corretto sul posto?

*Cosa ti ha fatto capire che avevi sbagliato? Come hai corretto?*

*Scrivi 2-3 righe:* ___________________________________________

---

**4. Connessione con la tua vita**
Guarda un manuale di istruzioni (di un elettrodomestico, di un gioco, di qualcosa che hai montato). Le figure usano assonometria cavaliera, isometrica, o prospettiva? Come lo hai riconosciuto? Funzionano bene — cioè ti aiutano a capire la forma dell'oggetto?

*Scrivi 2-3 righe:* ___________________________________________

---

### Collegamento con MC-DIS-3-01 — Progettazione avanzata

Nella terza media, nella MC-DIS-3-01, l'assonometria sarà il punto di partenza per la progettazione autonoma di oggetti. Passare dal disegnare oggetti esistenti al progettare oggetti nuovi richiede di usare l'assonometria come strumento di pensiero creativo, non solo di rappresentazione. Questo è il livello Advanced.

Conserva i disegni di questa MC come punto di riferimento: nella progettazione, la velocità di esecuzione dell'assonometria conta quanto la precisione. Più pratichi ora, più sarà veloce e naturale allora.

---

## APPENDICE — Tech in English

| Italiano | English | Come si legge |
|----------|---------|---------------|
| assonometria cavaliera | oblique axonometric / cabinet projection | /kæbɪnɪt prəˈdʒekʃən/ |
| assonometria isometrica | isometric projection | /ˌaɪsəˈmetrɪk prəˈdʒekʃən/ |
| fattore di riduzione | reduction factor / foreshortening | /ˈfɔːʃɔːtənɪŋ/ |
| spigolo nascosto | hidden edge | /ˈhɪdən edʒ/ |
| ellisse | ellipse | /ɪˈlɪps/ |

> *In English we say: "In cabinet projection, the depth axis is drawn at 45 degrees with a 0.5 reduction factor" — nell'assonometria cavaliera, l'asse di profondità è disegnato a 45° con un fattore di riduzione di 0,5.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- Zona 2: la tabella di confronto cavaliera/isometrica va come infografica comparativa con esempi grafici del cubo in entrambe le assonometrie.
- Il box storia su Dürer va come sidebar con un'incisione (dominio pubblico) di riferimento.
- Il caso studio IKEA va come box evidenziato.
- Zona 4 livello Intermedio: i due disegni affiancati richiedono spazio — va su pagina a parte.

**Per l'agente generatore asset:**
- Visual richiesto 1: confronto cavaliera/isometrica — stesso cubo 60×60×60 mm disegnato nei due sistemi, con assi annotati e misure. PNG 1200×600.
- Visual richiesto 2: schema della costruzione passo-passo del parallelepipedo in cavaliera (6 passi numerati). PNG.
- Visual richiesto 3: ellisse in assonometria isometrica con il metodo del quadrato assonometrico. PNG.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: Paci 2014 · Allineata IN 2025 (D.M. n. 221/2025)*
*Nota: il JSON MC-DIS-2-02 riporta "Quotatura e lettura di un disegno tecnico" — il contenuto di questa MC è assonometria su indicazione editoriale diretta. La quotatura è trattata come appendice in MC-DIS-2-01 e come MC autonoma da creare (MC-DIS-2-03).*
*Contenuto espanso su indicazione editoriale — tutte e 5 le zone libro-ready*
