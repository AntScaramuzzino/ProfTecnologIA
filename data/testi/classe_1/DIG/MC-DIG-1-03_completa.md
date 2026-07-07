# MC-DIG-1-03 — Come pensa una macchina: dai passi agli algoritmi
**Area:** Competenze Digitali · **Anno:** Classe I · **Livello DigComp:** Foundation (F)
**SDG:** 4 — Istruzione di qualità · 9 — Industria, innovazione e infrastrutture · **Fonte:** originale
**Struttura:** 4 pagine (MC standard) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il cameriere che non sbaglia mai"**
> 🎧 *Ascolta prima di leggere. Durata: 22 sec.*
> *(Script completo: MC-DIG-1-03_hook-script.md)*

**Domanda di avvio:**
Immagina un cameriere che lavora in un ristorante affollatissimo. Trenta tavoli, cento piatti, nessun foglio di appunti. Eppure non sbaglia mai un ordine, non dimentica nessuno, non si confonde. Come fa?

Segue un algoritmo. Una sequenza precisa di passi che esegue uguale ogni volta. E indovina? Il tuo cervello fa esattamente la stessa cosa ogni mattina quando ti alzi, prepari lo zaino o ti allacci le scarpe — solo che non lo chiami "algoritmo". Ancora.

---

## 📖 ESPLORA

### Che cos'è un algoritmo

Un **algoritmo** è una sequenza finita di istruzioni precise e non ambigue che, eseguite nell'ordine giusto, risolvono un problema o portano a un risultato.

Non è una parola complicata. È solo il modo formale di dire: "la ricetta per fare qualcosa".

La ricetta della pasta al pomodoro è un algoritmo. Il modo in cui il navigatore calcola il percorso più breve è un algoritmo. La procedura che il tuo telefono usa per riconoscere il tuo viso è un algoritmo. La sequenza di mosse che usi per aprire la porta quando arrivi a casa è un algoritmo.

La differenza tra una ricetta di cucina e un algoritmo formale è che l'algoritmo deve essere:

**Preciso** — ogni istruzione deve essere chiara e non ambigua. "Aggiusta di sale" non è una buona istruzione algoritmica. "Aggiungi 5 grammi di sale" lo è.

**Finito** — deve terminare. Un algoritmo che non finisce mai non è un algoritmo utile — è un problema.

**Eseguibile** — ogni passo deve essere realizzabile con le risorse disponibili.

**Deterministico** — con gli stessi dati di partenza, deve dare sempre lo stesso risultato (almeno per gli algoritmi classici).

---

### Le tre strutture fondamentali

Qualsiasi algoritmo, per quanto complesso, è costruito con soli tre tipi di struttura. Come la musica è fatta di note, ogni algoritmo è fatto di:

---

**1. La SEQUENZA**

Una serie di istruzioni eseguite in ordine, una dopo l'altra.

Esempio: la procedura per accendere il computer.
1. Premi il tasto di accensione.
2. Attendi che compaia la schermata di login.
3. Inserisci la password.
4. Premi Invio.

L'ordine conta. Se inserisci la password prima che compaia la schermata di login, l'istruzione non funziona. Gli algoritmi non perdonano l'ordine sbagliato.

---

**2. La CONDIZIONE (se/allora/altrimenti)**

Una struttura che esegue istruzioni diverse a seconda di una situazione.

Esempio: l'algoritmo del semaforo per il pedone.
- **SE** la luce è verde → **ALLORA** attraversa
- **ALTRIMENTI** (la luce è rossa) → aspetta

In linguaggio formale si scrive: `SE [condizione] ALLORA [azione A] ALTRIMENTI [azione B]`

La condizione è sempre una domanda con risposta sì/no. Gli algoritmi non gestiscono "forse" o "dipende" — devono sapere esattamente cosa fare in ogni situazione prevista.

---

**3. Il CICLO (ripeti)**

Una sequenza di istruzioni eseguita più volte, fino a quando una condizione si verifica.

Esempio: l'algoritmo per trovare un amico in una stanza buia.
1. Fai un passo avanti.
2. Allunga il braccio.
3. **SE** senti qualcuno → FERMATI.
4. **ALTRIMENTI** → torna al passo 1.

Oppure con contatore fisso: "Ripeti 10 volte: {allunga la mano, fai un passo}".

I cicli sono potentissimi: permettono di fare la stessa cosa molte volte senza riscrivere le istruzioni ogni volta. Un ciclo che gira per sempre si chiama **loop infinito** — ed è di solito un errore.

---

### Il diagramma di flusso: dare forma visiva all'algoritmo

Un algoritmo scritto a parole può essere difficile da leggere. Per visualizzarlo si usa il **diagramma di flusso** — una rappresentazione grafica dove ogni tipo di istruzione ha una forma standard.

Le forme principali:

| Forma | Significato |
|-------|-------------|
| **Ovale** | Inizio o Fine |
| **Rettangolo** | Azione (es. "aggiungi 5 g di sale") |
| **Rombo** | Decisione — condizione sì/no |
| **Freccia** | Flusso — da dove a dove va l'algoritmo |

Le frecce uscenti dal rombo (condizione) sono sempre due: una per "Sì" e una per "No". Ogni diagramma di flusso ha un solo Inizio e un solo Fine (o a volte più uscite, ma sempre definite).

> **💡 Esempio:** disegna il diagramma di flusso di questa procedura: "Se piove, prendi l'ombrello. Poi esci di casa."
> - Ovale: INIZIO
> - Rombo: "Piove?" → Sì → Rettangolo: "Prendi l'ombrello" → Rettangolo: "Esci di casa" → Ovale: FINE
> - Rombo: "Piove?" → No → Rettangolo: "Esci di casa" → Ovale: FINE

---

### La decomposizione: affrontare un problema grande

I problemi complessi sono fatti di problemi più piccoli. La **decomposizione** è l'abilità di scomporli.

Esempio: "organizzare la festa di compleanno" è troppo vago per essere un algoritmo. Ma se lo decompon:
- Decidere data e luogo
- Fare la lista degli invitati
- Preparare gli inviti
- Decidere cosa mangiare
- Comprare quello che serve
- Allestire il locale
- Accogliere gli ospiti

Ogni sotto-problema è ora abbastanza piccolo da diventare un algoritmo.

I programmatori usano la decomposizione ogni giorno: nessun programma complesso viene scritto tutto insieme. Viene prima scomposto in funzioni, moduli, parti — ognuna risolvibile separatamente.

---

### Il debug: trovare e correggere gli errori

Un **bug** è un errore in un algoritmo che produce un risultato sbagliato o fa bloccare il programma. Il termine viene da un episodio reale del 1947: un vero insetto (bug in inglese = insetto) si era infilato in un computer e aveva causato un malfunzionamento. Da allora, "bug" indica qualsiasi errore software.

Il **debug** è il processo di trovare e correggere i bug.

Come si fa il debug? Sempre così:
1. Osserva il risultato sbagliato.
2. Risali all'istruzione che ha prodotto quell'errore.
3. Capisci perché è sbagliata.
4. Correggi.
5. Verifica che il problema sia risolto.

Il debug è uno dei processi più importanti del pensiero computazionale — e nella vita in generale. Identificare dove e perché qualcosa non funziona, e trovare la soluzione, è una competenza trasversale che va ben oltre il coding.

---

### Attività unplugged: gli algoritmi senza computer

Il pensiero computazionale non richiede un computer. Si può imparare — e spesso si impara meglio — lontano dagli schermi.

**Attività classiche unplugged:**

*Il robot umano* — un compagno esegue alla lettera le istruzioni che scrivi per andare dall'aula al bagno. Se scrivi "vai avanti" senza specificare quanti passi, il robot si muove all'infinito. Se dimentichi "gira a destra" prima di una porta, il robot va dritto nel muro. L'algoritmo funziona solo se è preciso.

*L'algoritmo della ricetta* — prendi una ricetta di cucina e riscrivila come algoritmo formale: identifica le sequenze, le condizioni ("SE il pane è dorato…"), i cicli ("mescola continuamente PER 5 minuti"). Poi falla eseguire a qualcuno che non conosce la ricetta, letteralmente.

*Il labirinto su carta* — disegna un labirinto e scrivi l'algoritmo (con istruzioni: su/giù/sinistra/destra + numero di passi) che porta dall'entrata all'uscita. Un compagno lo esegue su carta per verificarlo.

> **🔢 Collegamento STEM — Matematica:**
> Quando fai la moltiplicazione in colonna, stai eseguendo un algoritmo: passi precisi, nell'ordine giusto, che portano sempre al risultato corretto. L'algoritmo di Euclide per trovare il massimo comune divisore di due numeri è stato scritto 2.300 anni fa — e oggi è ancora usato nei computer. Gli algoritmi esistono molto prima dei computer.

> **📝 Collegamento STEM — Italiano:**
> Un **testo regolativo** (le istruzioni del Lego, le regole di un gioco, il regolamento scolastico) è un algoritmo in linguaggio naturale. Ha una struttura, un ordine, e presuppone che chi esegue le istruzioni le segua alla lettera. La differenza tra una buona e una cattiva istruzione è la stessa tra un buon e un cattivo algoritmo: precisione, chiarezza, completezza.

> **🔬 Collegamento STEM — Scienze:**
> Il metodo scientifico è un algoritmo: osserva un fenomeno → formula un'ipotesi → progetta un esperimento → raccogli dati → analizza i risultati → SE i dati confermano l'ipotesi ALLORA accettala (provvisoriamente) → ALTRIMENTI formula una nuova ipotesi. La scienza funziona a cicli: ogni risultato apre nuove domande.

---

## 🔍 OSSERVA

### Caso studio: l'algoritmo del semaforo intelligente

Un semaforo normale funziona con un algoritmo fisso: verde per 60 secondi, giallo per 5, rosso per 60. Ripete il ciclo all'infinito, indipendentemente da quante macchine ci sono.

Un **semaforo intelligente** (come quelli installati nelle grandi città europee) usa un algoritmo adattivo. Sensori nel suolo misurano il flusso di veicoli. L'algoritmo decide in tempo reale:

```
MENTRE c'è coda > 10 auto sulla via principale:
    SE la strada trasversale è libera → mantieni il verde sulla via principale
    ALTRIMENTI → esegui il ciclo normale
```

Risultato: i semafori intelligenti riducono i tempi di attesa del 20-25% rispetto ai semafori fissi — con zero modifiche all'infrastruttura fisica, solo un cambio di algoritmo.

**La domanda da porsi:** quando guardi un sistema che funziona (un ascensore, un carrello del supermercato che suggerisce prodotti, la playlist di Spotify), c'è sempre un algoritmo dietro. Immaginarlo — capire quali input riceve, quali decisioni prende, quali output produce — è il primo passo per capire come funziona il mondo digitale.

> ⚠️ **Errore comune:**
> "Gli algoritmi sono neutri — non hanno opinioni." Non è completamente vero. Un algoritmo è scritto da persone che fanno scelte: cosa misurare, come pesare i criteri, quale risultato considerare "buono". Quelle scelte incorporano valori — e a volte pregiudizi. Imparare gli algoritmi vuol dire anche imparare a farsi queste domande.

---


### ⚖️ Chi lavora con questa competenza nel 2030?

**Algorithm Auditor**

Verifica equità, trasparenza e assenza di bias negli algoritmi usati da aziende e istituzioni, garantendo che le decisioni automatizzate rispettino i diritti delle persone.

Dove lavora: enti regolatori dell'AI (AI Office europeo), grandi aziende tech, studi legali specializzati in diritto digitale, ONG per i diritti digitali.

Competenze chiave che inizia a costruire da qui: pensiero computazionale · statistica · AI · diritto digitale · inclusione e accessibilità

*"Se non puoi spiegare perché l'algoritmo ha deciso così, non puoi difenderti dalla sua decisione sbagliata."*

---

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### ● BASE — Riconosco le tre strutture in un algoritmo esistente

**Obiettivo:** identificare sequenze, condizioni e cicli in un algoritmo già scritto.

**Materiali:** questa scheda, una matita colorata (rosso per le sequenze, blu per le condizioni, verde per i cicli).

**L'algoritmo da analizzare:**

```
INIZIO

1. Apri il frigorifero.
2. Prendi il latte.
3. SE il latte è finito ALLORA vai al negozio a comprarne uno ALTRIMENTI vai al passo 4.
4. Versa il latte nella tazza.
5. Ripeti: scalda il latte per 30 secondi nel microonde → controlla la temperatura
   FINO A QUANDO il latte è caldo.
6. Aggiungi i cereali.
7. Mangia.

FINE
```

**Attività:**
- Sottolinea in **rosso** le istruzioni di sequenza pura (azioni in ordine).
- Sottolinea in **blu** la condizione (se/allora).
- Sottolinea in **verde** il ciclo (ripeti… fino a quando).

**Poi rispondi:**
1. Quante istruzioni di sequenza ci sono?
2. Quale condizione c'è? Cosa succede nei due casi (sì e no)?
3. Quando si ferma il ciclo? Cosa succede se il latte non raggiunge mai la temperatura giusta?

---

### ●● INTERMEDIO — Scrivo l'algoritmo di una procedura quotidiana

**Obiettivo:** tradurre una procedura reale in algoritmo formale con le tre strutture, e disegnarne il diagramma di flusso.

**Scegli una di queste procedure:**
- Uscire di casa la mattina per andare a scuola
- Fare una ricerca online su un argomento scolastico
- Mandare un messaggio a un amico su WhatsApp

**Passo 1 — Scrivi l'algoritmo in linguaggio naturale:**
Usa le parole chiave: *prima... poi... se... allora... altrimenti... ripeti... fino a quando...*
Deve avere almeno: 4 istruzioni di sequenza, 1 condizione, 1 ciclo.

**Passo 2 — Disegna il diagramma di flusso:**
Usa le forme standard: ovale (inizio/fine), rettangolo (azione), rombo (condizione), frecce.

**Passo 3 — Testalo:**
Fa' eseguire l'algoritmo a un compagno che non conosce la procedura. Il compagno esegue SOLO quello che c'è scritto — niente di più, niente di meno. Trovate insieme almeno un errore (bug) e correggete l'algoritmo.

**Domanda finale:** il compagno ha trovato un errore che non avevi visto? Com'era possibile che tu non lo avessi notato? (Suggerimento: chi scrive un algoritmo ha in testa la procedura completa — chi la esegue conosce solo le istruzioni scritte.)

---

### ●●● AVANZATO — Progetto: l'algoritmo del docente perfetto

**Scenario:** immagina di progettare un sistema automatico che decide come assegnare i compiti a casa in base ai risultati degli studenti. Non un sistema reale — una simulazione su carta.

**Il sistema riceve questi dati:**
- Punteggio dell'ultimo compito in classe (da 0 a 10)
- Tempo medio di studio dichiarato dallo studente (ore/settimana)
- Materia (Matematica, Italiano, Scienze, Tecnologia)

**Progetta l'algoritmo:**

1. **Definisci le regole:** quali criteri decide "quanti compiti assegnare"? Scrivi almeno 3 regole con struttura SE/ALLORA.
   Esempio: *SE punteggio < 5 E tempo_studio < 2 ore ALLORA assegna 3 esercizi*

2. **Gestisci i casi limite:** cosa succede se lo studente non dichiara il tempo di studio? Se il punteggio è esattamente 5?

3. **Disegna il diagramma di flusso completo.**

4. **Discussione critica:** questo sistema è giusto? Ci sono situazioni in cui potrebbe dare risultati sbagliati o ingiusti? Cosa manca come input che un professore umano considera invece?

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | ● Base — Sufficiente | ●● Intermedio — Buono | ●●● Avanzato — Ottimo |
|----------|---------------------|----------------------|----------------------|
| **1. Riconoscimento delle strutture** | Identifica correttamente almeno 2 delle 3 strutture (sequenza, condizione, ciclo) in un algoritmo dato | Identifica tutte e 3 le strutture, le denomina correttamente e sa spiegare cosa fa ciascuna in quel contesto | Identifica le strutture, le spiega con esempi propri e riconosce quando una struttura potrebbe essere sostituita da un'altra più efficiente |
| **2. Scrittura dell'algoritmo** | Scrive una sequenza di istruzioni comprensibile che porta al risultato, anche senza tutte le strutture formali | Scrive un algoritmo con sequenza, almeno una condizione e almeno un ciclo; le istruzioni sono precise e ordinate | L'algoritmo è completo, gestisce i casi limite (cosa succede se…), e contiene note di debug per possibili errori |
| **3. Diagramma di flusso** | Usa le forme standard correttamente per almeno la parte di sequenza | Usa tutte le forme standard (ovale, rettangolo, rombo, frecce); le frecce del rombo sono etichettate (Sì/No) | Il diagramma è leggibile, completo, e corrisponde esattamente all'algoritmo scritto; eventuali cicli sono rappresentati correttamente |
| **4. Debug e revisione** | Trova almeno un errore nell'algoritmo di un compagno (o nel proprio dopo test) | Trova e corregge l'errore con una spiegazione precisa della causa | Anticipa possibili errori prima del test, li documenta come casi limite, e propone come l'algoritmo potrebbe gestirli |

---

### Lo scenario

La tua classe organizza una "Caccia al Tesoro" nel cortile della scuola. La maestra vuole che ogni gruppo riceva le stesse istruzioni identiche — non una mappa, ma un algoritmo: una sequenza di passi precisi che porta al tesoro. Chi sbaglia si perde; chi segue l'algoritmo correttamente trova il tesoro.

Il problema: le istruzioni vanno scritte in modo così preciso che chiunque, anche qualcuno che non conosce il cortile, possa seguirle. E devono prevedere situazioni impreviste: "SE la porta è chiusa, vai all'alternativa B".

---

### La consegna

**Passo 1 — Sopralluogo:**
Disegna una piantina schematica del percorso che vuoi proporre: dal punto di partenza (aula, ingresso, ecc.) fino al punto del tesoro. Segnala gli ostacoli possibili (porte che possono essere chiuse, altre classi, viali).

**Passo 2 — Scrivi l'algoritmo:**
Usa questo formato:

```
INIZIO
1. [azione]
2. SE [condizione] ALLORA [azione A] ALTRIMENTI [azione B]
3. RIPETI [azione] PER [N] volte / FINO A QUANDO [condizione]
...
FINE
```

L'algoritmo deve avere: almeno 6 istruzioni, almeno 1 condizione, almeno 1 ciclo.

**Passo 3 — Disegna il diagramma di flusso** corrispondente all'algoritmo.

**Passo 4 — Test:**
Scambiate gli algoritmi con un altro gruppo. Ogni gruppo esegue l'algoritmo del gruppo vicino — letteralmente. Torna in aula e reporta: avete trovato il tesoro? Se no, qual era il bug?

**Passo 5 — Debug:**
Correggi l'algoritmo sulla base del feedback ricevuto. Documenta quali bug hai trovato e come li hai risolti.

**Materiali che ti servono:**
- Carta A4, righello, matita
- I colori per il diagramma di flusso (o stampa il template dal QR code)

---

### 🎯 Badge SDG 4 e SDG 9

**SDG 4 — Istruzione di qualità:** saper costruire e leggere algoritmi è una competenza fondamentale del XXI secolo. Non serve per diventare programmatori — serve per capire come funzionano i sistemi che governano la vita quotidiana: dai motori di ricerca ai sistemi di raccomandazione, dai semafori intelligenti ai protocolli medici.

**SDG 9 — Industria, innovazione e infrastrutture:** gli algoritmi sono la base di tutta l'innovazione digitale. Ogni app, ogni sistema di navigazione, ogni strumento di automazione industriale è costruito su algoritmi. Capire come funzionano è il primo passo per progettarli — e per valutarne criticamente le scelte.

---

### 🤖 Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona e chiedi all'AI Coach tutto quello che non ti è chiaro su questa MC:
- *"Qual è la differenza tra un ciclo WHILE e un ciclo FOR?"*
- *"Come disegno un ciclo nel diagramma di flusso?"*
- *"Cos'è la ricorsione?"*

Nota: l'AI Coach è lui stesso un algoritmo — risponde seguendo una sequenza di passi. Pensa: quali passi sta eseguendo mentre risponde alla tua domanda?

---

### 🪞 Metacognizione — Rifletti sul tuo lavoro

---

**1. Sorpresa**
C'è stata una procedura quotidiana che pensavi di conoscere bene e che, quando hai provato a scriverla come algoritmo, si è rivelata più complicata del previsto?

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Il debug come scoperta**
Quando il tuo compagno ha eseguito il tuo algoritmo e ha trovato un bug — come ti sei sentito? Frustrazione? Curiosità? Il bug ti ha aiutato a capire qualcosa che non avevi visto?

*Scrivi 2-3 righe:* ___________________________________________

---

**3. Algoritmi intorno a te**
Dopo questa MC, guardi le cose intorno a te in modo diverso? C'è qualcosa che usi ogni giorno — un'app, una macchina, una procedura — di cui ora immagini l'algoritmo sottostante?

*Scrivi 2-3 righe:* ___________________________________________

---

**4. Connessione con la matematica**
Hai riconosciuto la struttura degli algoritmi in qualche procedura matematica che già conosci (es. divisione in colonna, calcolo dell'area, soluzione di un'equazione)? Descrivila.

*Scrivi 2-3 righe:* ___________________________________________

---

### 🔗 Collegamento con MC-DIG-1-01, MC-DIG-1-02 e MC-DIG-2-01

**MC-DIG-1-01 — Orientarsi nell'ambiente digitale:** hai imparato cos'è un computer e come funziona a livello hardware. Adesso sai che il software che fa girare quell'hardware è fatto di algoritmi.

**MC-DIG-1-02 — Ricerca e valutazione delle fonti online:** un motore di ricerca è un algoritmo. Adesso che conosci le strutture base, puoi immaginare come Google decide quale risultato mostrarti prima.

**MC-DIG-2-01 — Coding con Scratch (2ª media):** il passo successivo. Scratch ti permetterà di tradurre questi algoritmi scritti su carta in programmi che il computer esegue davvero. Le strutture che hai imparato qui — sequenza, condizione, ciclo — sono esattamente i blocchi di Scratch.

---

## APPENDICE — Tech in English

**Termini tecnici di questa MC in inglese**

| Italiano | English | Come si legge |
|----------|---------|---------------|
| algoritmo | algorithm | /ˈælɡərɪðəm/ |
| diagramma di flusso | flowchart | /ˈfləʊtʃɑːt/ |
| sequenza | sequence | /ˈsiːkwəns/ |
| condizione | condition / if-then | /kənˈdɪʃən/ |
| ciclo | loop | /luːp/ |
| errore | bug | /bʌɡ/ |
| correzione errori | debugging | /diːˈbʌɡɪŋ/ |
| scomposizione | decomposition | /ˌdiːkɒmpəˈzɪʃən/ |
| attività senza computer | unplugged activity | /ʌnˈplʌɡd ækˈtɪvɪti/ |

> *In English we say: "Every program is built from three basic structures: sequences, conditions, and loops." — Ogni programma è costruito con tre strutture di base: sequenze, condizioni e cicli.*
>
> *"Before coding, always design your algorithm on paper." — Prima di programmare, progetta sempre l'algoritmo su carta.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- Zona 2: le tre strutture (sequenza, condizione, ciclo) vanno ciascuna in un box visivo distinto con colore diverso. Sequenza → blu, Condizione → arancione, Ciclo → verde.
- Le righe di codice/pseudocodice vanno in font monospaced (Courier o simile) con sfondo grigio chiaro.
- Il diagramma di flusso generico (ovale/rettangolo/rombo) va come infografica nella sidebar.
- La tabella forme del diagramma di flusso va su sfondo bianco con bordo netto.
- I box STEM (Matematica, Italiano, Scienze) vanno come sidebar con icona emoji.
- La rubrica di valutazione in Zona 5 va su pagina separata (fotocopiabile).

**Per l'agente generatore asset:**
- Visual richiesto 1: infografica "Le 3 strutture degli algoritmi" — tre colonne (Sequenza / Condizione / Ciclo), con icona, pseudocodice esempio, e diagramma di flusso parziale per ciascuna. Formato PNG 1200×600.
- Visual richiesto 2: "Dalla ricetta all'algoritmo" — affiancamento tra una ricetta di cucina e la stessa procedura in formato algoritmo formale, con frecce che collegano gli elementi corrispondenti. PNG 1200×700.
- Visual richiesto 3: diagramma di flusso template vuoto (ovale/rettangolo/rombo con etichette) per uso in classe. PNG 800×1000, formato A4 verticale.
- Hook audio: script disponibile nel JSON, campo hook_audio.script.

---

*MC versione 1.0 — Luglio 2026*
*Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025) + DigComp 3.0 + EntreComp*
*Prerequisiti: MC-DIG-1-01 | Propedeutica a: MC-DIG-2-01 (Scratch) → MC-DIG-3-01 (Python/robotica)*
*Contenuto espanso — tutte e 5 le zone libro-ready*
