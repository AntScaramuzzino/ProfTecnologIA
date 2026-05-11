# MC-DIG-2-01 — Come si insegna a una macchina a fare qualcosa che non sa fare da sola?
**Area:** Competenze Digitali · **Anno:** 2ª · **Livello DigComp:** Intermediate (I)
**SDG:** 9 — Industria, innovazione e infrastrutture · **Fonte:** Hypertech 2020
**Struttura:** 4 pagine (MC avanzata) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il semaforo che è esploso"**
> *Ascolta prima di leggere. Durata: 2 min 25 sec.*
> *(Script completo: MC-DIG-2-01_hook-script.md)*

**Domanda di avvio:**
Il semaforo davanti alla tua scuola fa una cosa sola: rosso, verde, giallo, rosso, verde, giallo. Sembra il programma più semplice del mondo. Eppure nel 1926, a Londra, il primo semaforo automatico esplose perché chi lo aveva programmato non aveva previsto tutti i casi.

Scrivere istruzioni per una macchina sembra facile. Non lo è. Adesso impari come si fa davvero.

---

## 📖 ESPLORA

### Prima del codice: il pensiero computazionale

Prima di aprire Scratch, prima di muovere il primo blocco, c'è una competenza che viene prima: saper pensare come pensa una macchina. Questa competenza ha un nome: **pensiero computazionale**.

Il pensiero computazionale non è programmazione. È un modo di affrontare i problemi — qualsiasi problema, anche quelli che non hanno nulla a che fare con i computer. Si compone di quattro strategie.

**Decomposizione del problema (problem decomposition):** dividere un problema grande in problemi più piccoli, ciascuno risolvibile separatamente. "Costruire un quiz interattivo" è troppo grande per essere risolto in un colpo solo. Ma "mostrare la prima domanda", "controllare la risposta", "aggiornare il punteggio" sono problemi piccoli, ognuno risolvibile in pochi blocchi.

**Riconoscimento di schemi (pattern recognition):** cercare elementi che si ripetono o strutture simili in problemi diversi. Le domande di un quiz seguono tutte lo stesso schema: mostra il testo, aspetta la risposta, confronta con la risposta corretta, aggiorna il punteggio, vai alla domanda successiva. Se risolvi correttamente la prima domanda, sai già come risolvere tutte le altre — cambiano solo i dati, non la struttura.

**Astrazione:** identificare quali informazioni sono importanti e quali sono dettagli irrilevanti per il problema che devi risolvere. Per far funzionare il quiz, non ti interessa il colore dello sfondo nella prima fase. Ti interessa la logica di controllo della risposta. L'astrazione ti aiuta a non perderti nei dettagli prima di aver risolto la struttura fondamentale.

**Progettazione dell'algoritmo (algorithm design):** definire la sequenza esatta di passi per risolvere il problema. Un algoritmo è una serie di istruzioni precise, non ambigue, che conducono da un punto di partenza a un risultato definito. La parola "algoritmo" viene dal nome del matematico persiano Muhammad ibn Musa al-Khwarizmi, vissuto nel IX secolo — le sue opere sulla matematica, tradotte in latino nel Medioevo, introdussero in Europa sia il concetto di algoritmo sia il sistema di numerazione decimale che usi ancora oggi.

---

### Le tre strutture fondamentali

Qualsiasi programma — qualsiasi, dal sistema operativo del tuo computer a un videogioco a un sistema di raccomandazione di Netflix — è costruito combinando solo tre strutture fondamentali. Solo tre.

**Sequenza:** istruzioni eseguite una dopo l'altra, nell'ordine in cui sono scritte. Il semaforo che fa rosso, poi verde, poi giallo è una sequenza. Il problema del semaforo esploso era che la sequenza non prevedeva tutti i casi: mancava un controllo sulla condizione del meccanismo prima di aprire il gas.

**Selezione (if/else):** una biforcazione. Il programma controlla una condizione e sceglie quale ramo eseguire. Se la risposta è corretta → aggiungi un punto e vai alla prossima domanda. Se la risposta è sbagliata → mostra il feedback e riprova (o vai avanti, dipende dal gioco). La selezione è ciò che rende un programma "intelligente" rispetto a una semplice sequenza: può reagire a situazioni diverse in modo diverso.

**Iterazione (ciclo, loop):** un blocco di istruzioni che si ripete. Può ripetersi un numero fisso di volte ("ripeti 10 volte"), oppure continuare finché una condizione è vera ("ripeti finché non hai risposto a tutte le domande"), oppure continuare all'infinito ("ripeti sempre" — come fa il ciclo principale di un videogioco). L'iterazione è ciò che permette al computer di fare cose ripetitive senza che tu debba riscrivere le stesse istruzioni mille volte.

> **Collegamento STEM — Matematica:**
> La selezione (if/else) è logica booleana: le condizioni sono espressioni che possono essere vere o false. "Risposta = 'acqua'" è vera se e solo se l'utente ha scritto esattamente "acqua". La congiunzione (AND), la disgiunzione (OR) e la negazione (NOT) sono le stesse operazioni della matematica booleana che studi in Informatica: "se la risposta è sbagliata E il numero di tentativi è maggiore di 3, mostra il suggerimento." Coding e matematica usano lo stesso linguaggio logico.

---

### Variabili e operatori

Una **variabile** è un contenitore con un nome che conserva un valore. Il valore può cambiare durante l'esecuzione del programma — da cui il nome "variabile".

Esempi nel quiz:
- `punteggio` — parte da 0, aumenta di 1 a ogni risposta corretta.
- `domanda_corrente` — tiene traccia di quale domanda siamo (1, 2, 3...).
- `risposta_utente` — contiene quello che l'utente ha digitato.

Le variabili sono fondamentali per la selezione: l'if controlla il valore di una variabile per decidere cosa fare. "Se `risposta_utente` = risposta_corretta → aggiungi 1 a `punteggio`."

Gli **operatori** eseguono calcoli o confronti sulle variabili:
- Operatori aritmetici: +, -, ×, ÷ (per calcolare punteggi, somme, medie).
- Operatori di confronto: = (uguale), > (maggiore), < (minore), ≥, ≤ (per confrontare la risposta con quella corretta, o il punteggio con un limite).
- Operatori logici: AND, OR, NOT (per condizioni composte).

---

### Scratch: l'ambiente di programmazione a blocchi

Scratch è stato sviluppato nel 2003 dal MIT Media Lab di Boston, con l'obiettivo di rendere la programmazione accessibile a bambini e ragazzi senza richiedere la conoscenza della sintassi testuale. Oggi è usato in oltre 150 paesi ed è la piattaforma di coding più diffusa nelle scuole del mondo.

In Scratch, il codice non si scrive — si assembla. I blocchi di codice sono pezzi colorati che si incastrano tra loro come un puzzle: la forma di ogni blocco indica dove può essere collegato.

**L'interfaccia di Scratch:**

**Stage (palcoscenico):** l'area a destra dove si vede l'esecuzione del programma. È lo spazio dove i personaggi si muovono, le immagini appaiono, i testi vengono visualizzati.

**Sprite:** i personaggi o gli oggetti che appaiono sullo stage. Ogni sprite ha il suo insieme di script (il suo codice), i suoi costumi (le sue forme grafiche) e i suoi suoni. Il gatto di Scratch è lo sprite predefinito, ma puoi creare, disegnare o importare qualsiasi sprite.

**Script:** il codice di uno sprite — una o più pile di blocchi che definiscono il comportamento di quello sprite.

**Costume:** le diverse forme grafiche di uno sprite. Cambiando costume, lo sprite sembra animarsi. Un personaggio che cammina è uno sprite che alterna tra due costumi con le gambe in posizioni diverse.

**La palette dei blocchi — categorie e colori:**

| Categoria | Colore | Funzione |
|-----------|--------|----------|
| Movimento | Blu | Spostare lo sprite nello stage |
| Aspetto | Viola | Cambiare costumi, dire testi, mostrare/nascondere |
| Suono | Rosa | Riprodurre suoni, musica |
| Controllo | Giallo | If/else, loop, attesa |
| Sensori | Azzurro chiaro | Rilevare input, rispondere alle domande |
| Operatori | Verde | Calcoli aritmetici, confronti, logica |
| Variabili | Arancione | Creare e modificare variabili e liste |
| Messaggi | Giallo scuro | Comunicazione tra sprite (broadcast) |
| Eventi | Giallo dorato | Avviare script in risposta a eventi (clic, tasto, messaggio) |

---

### Il sistema degli eventi e del broadcast

In Scratch, gli script non partono da soli: partono quando succede qualcosa — un **evento**. Gli eventi più comuni:

- "Quando si clicca la bandiera verde" — avvia il programma principale.
- "Quando si preme il tasto [X]" — reagisce a una pressione della tastiera.
- "Quando questo sprite viene cliccato" — reagisce a un clic del mouse sullo sprite.
- "Quando ricevo il messaggio [X]" — reagisce a un messaggio inviato da un altro sprite o dallo stage.

Il **broadcast** (trasmissione) permette a uno sprite di inviare un messaggio a tutti gli altri sprite. Questo serve per coordinare sprite diversi: quando una domanda viene risposta correttamente, lo sprite della domanda manda un broadcast "prossima_domanda", e lo sprite del punteggio risponde aggiornandosi.

Il broadcast è il meccanismo con cui Scratch implementa qualcosa che nei linguaggi avanzati si chiama "comunicazione tra processi": parti diverse del programma che si coordinano senza interferire direttamente.

---

### Le liste: gestire insiemi di dati

Una **lista** in Scratch è una variabile speciale che può contenere più valori invece di uno solo. È come un elenco numerato: il primo elemento è alla posizione 1, il secondo alla posizione 2, e così via.

Per il quiz, le liste sono utilissime: puoi mettere tutte le domande in una lista, tutte le risposte corrette in un'altra lista, e tutti i feedback in una terza lista. Poi usi la variabile `domanda_corrente` come indice per accedere all'elemento giusto di ogni lista.

Esempio:
- Lista `domande`: ["Quante vertebre ha la colonna umana?", "Qual è il macronutriente energetico principale?", ...]
- Lista `risposte_corrette`: ["33", "carboidrati", ...]
- Lista `feedback_sbagliato`: ["La colonna vertebrale ha 33 vertebre, divise in 7 cervicali, 12 toraciche...", ...]

La struttura che gestisce ogni domanda è sempre la stessa: mostra l'elemento numero `domanda_corrente` della lista `domande`, aspetta la risposta, confronta con l'elemento numero `domanda_corrente` della lista `risposte_corrette`, aggiorna il punteggio.

---

### Progetto guidato passo per passo: il quiz interattivo

Questo è il progetto che costruirai. Segui i passi nell'ordine — ogni passo si basa sul precedente.

**Cosa costruiamo:** un quiz con 5 domande sull'alimentazione (collegamento con le MC dell'area ALI), punteggio visualizzato in tempo reale, feedback per risposta sbagliata, schermata finale con il risultato.

**Passo 1 — Imposta la struttura:**
Crea le variabili necessarie: `punteggio` (inizialmente 0), `domanda_corrente` (inizialmente 1). Crea le liste: `domande`, `risposte_corrette`, `feedback`.

**Passo 2 — Riempi le liste:**
Aggiungi almeno 5 elementi a ogni lista. Le domande devono essere sull'alimentazione: es. "Quante calorie ha un grammo di proteine?", "Qual è il nome scientifico della vitamina C?", "Quanti litri di acqua dovrebbe bere un ragazzo di 13 anni al giorno?".

**Passo 3 — Lo script principale:**
Al clic sulla bandiera verde, inizializza `punteggio` a 0 e `domanda_corrente` a 1. Poi lancia un broadcast "mostra_domanda".

**Passo 4 — Lo script della domanda:**
Quando riceve "mostra_domanda":
- Mostra la domanda numero `domanda_corrente`.
- Aspetta la risposta dell'utente.
- Se la risposta uguale l'elemento `domanda_corrente` della lista `risposte_corrette`: aggiungi 1 al punteggio.
- Se no: mostra il feedback dall'elemento `domanda_corrente` della lista `feedback`.
- Aggiungi 1 a `domanda_corrente`.
- Se `domanda_corrente` è minore o uguale a 5: manda broadcast "mostra_domanda" di nuovo.
- Se `domanda_corrente` è maggiore di 5: manda broadcast "fine_quiz".

**Passo 5 — La schermata finale:**
Crea uno sprite separato per la schermata finale. Quando riceve "fine_quiz": mostra il punteggio finale ("Hai ottenuto X punti su 5") e un messaggio diverso in base al punteggio (es. se ≥4: "Ottimo!", se ≥2: "Buono, puoi migliorare!", altrimenti: "Riprova — studia ancora l'alimentazione!").

**Passo 6 — Test e debug:**
Esegui il quiz rispondendo sia correttamente che sbagliando. Verifica che il punteggio si aggiorni correttamente, che i feedback appaiano solo per le risposte sbagliate, che la schermata finale mostri il punteggio giusto. Se qualcosa non funziona, questo è il debug — il processo di identificazione e correzione degli errori.

> **Collegamento INF — La differenza tra DIG e INF:**
> In questa MC stai imparando a usare Scratch per risolvere un problema. Questa è competenza digitale: scegliere e usare uno strumento per fare qualcosa. La competenza informatica — quella che studi in MC-INF-2-01 e MC-INF-2-02 — riguarda come funziona il software internamente: come il computer esegue le istruzioni, come gestisce la memoria, come comunica con i dispositivi di input e output. Usare bene un'app è DIG. Capire come l'app funziona dentro è INF. Le due competenze si integrano: chi le ha entrambe è molto più efficace di chi ne ha solo una.

---

### Debug: trovare e correggere gli errori

Il debug è la parte del coding che nessuno ti dice che occuperà la maggior parte del tuo tempo. Nei programmi professionali, si stima che circa il 50% del tempo di sviluppo venga speso nel trovare e correggere errori.

Esistono due tipi di errori:

**Errori di sintassi:** il codice non segue le regole del linguaggio — in Scratch, quasi impossibili perché i blocchi si incastrano solo se compatibili. Nei linguaggi testuali (Python, Java, C++) questi errori bloccano l'esecuzione e il compilatore li segnala con un messaggio di errore.

**Errori logici (bug):** il codice segue le regole sintattiche ma fa qualcosa di diverso da quello che vuoi. Il programma gira senza messaggi di errore, ma il risultato è sbagliato. Questi sono i più difficili da trovare. Esempio: il punteggio si aggiorna correttamente, ma la domanda successiva non appare mai. Il bug potrebbe essere in un blocco di confronto con l'indice sbagliato, o in una condizione if scritta al contrario.

**Strategia di debug:**

1. Riproduci l'errore in modo sistematico: esegui il programma nelle stesse condizioni e verifica che l'errore si riproduca sempre.

2. Isola il problema: quale parte del codice causa l'errore? Prova a eseguire solo un pezzo del codice.

3. Verifica i valori delle variabili: attiva la visualizzazione delle variabili sullo stage (in Scratch: clicca il quadratino accanto alla variabile nella lista). Guarda i valori durante l'esecuzione.

4. Leggi il codice ad alta voce, parola per parola, come se dovessi spiegarlo a qualcuno. Spesso l'errore emerge durante questa lettura.

5. Chiedi a un compagno di leggere il tuo codice: l'occhio fresco trova ciò che non hai visto.

> **Box storia — Grace Hopper e la nascita del bug:**
> Nel settembre 1947, l'ingegnera informatica Grace Hopper stava lavorando al computer Mark II all'Università di Harvard quando il sistema si bloccò senza motivo. La squadra investigò e trovò la causa: una falena era entrata nel relè 70 del computer e aveva causato un cortocircuito. Hopper incollò l'insetto sul registro di bordo e scrisse accanto: "First actual case of bug being found." — primo caso reale di insetto trovato. Da quel giorno, un errore in un programma si chiama bug. La falena originale è ancora conservata nel Museo Nazionale della Storia Americana a Washington, incollata sul registro di bordo originale.

---

### Caso studio: l'algoritmo di raccomandazione di YouTube, spiegato con la logica dei blocchi

YouTube mostra a ogni utente una lista di video consigliati. Come decide quali mostrare? L'algoritmo vero è complesso e non pubblico, ma la sua logica di base si può spiegare con le strutture che hai imparato.

**Dati di input (le variabili):**
- Cronologia dei video guardati dall'utente.
- Tempo di visione per ogni video (ha guardato tutto? Ha saltato?).
- Interazioni: like, dislike, commenti, condivisioni.
- Dati di tutti gli altri utenti con comportamenti simili (questo è il machine learning — MC-DIG-3-02).

**L'algoritmo semplificato (pseudocodice Scratch):**
```
per ogni video guardato da questo utente:
    trova altri utenti che hanno guardato lo stesso video
    guarda quali altri video hanno guardato quelli
    aggiungi quei video a una lista "candidati"

per ogni video nella lista candidati:
    calcola un punteggio di rilevanza
        basato su: quanto tempo l'utente di solito guarda video simili
                   quante interazioni ha ricevuto il video in totale
                   quanto è recente

ordina la lista candidati per punteggio decrescente
mostra i primi N video della lista ordinata
```

**Le strutture che riconosci:**
- `per ogni video` — è un ciclo (iterazione) su una lista.
- `se il video è già stato guardato → salta` — è una selezione.
- `calcola un punteggio` — è un'operazione su variabili.
- `ordina la lista` — è un algoritmo di ordinamento (più complesso, ma costruito con cicli e selezioni).

**Il punto critico:** chi decide cosa finisce nella lista dei "candidati" e come si calcola il "punteggio di rilevanza" sono decisioni progettuali fatte da ingegneri di YouTube. Queste decisioni determinano cosa ti viene mostrato, cosa non ti viene mostrato, e indirettamente cosa impari e cosa pensi. Un algoritmo di raccomandazione non è neutrale: riflette le scelte di chi lo ha costruito.

---

## 🔍 OSSERVA

### Il caso: il quiz adattivo in Scratch

Un quiz "normale" mostra le stesse domande a tutti nello stesso ordine. Un quiz "adattivo" cambia le domande in base alle risposte dell'utente: se risponde bene alle domande facili, passa a quelle difficili; se sbaglia le domande difficili, torna a quelle di rinforzo.

Questo è esattamente il tipo di quiz che le piattaforme educative professionali (Duolingo, Khan Academy) usano per personalizzare l'apprendimento. Il principio algoritmico è quello che hai già visto: selezione basata sul valore di variabili, liste di domande organizzate per livello, broadcast tra script diversi.

La versione avanzata della tua attività (Livello Avanzato in 🔬 SPERIMENTA) ti chiede di costruire esattamente questo.

---

> **Errore comune:**
> "Se il programma gira senza errori significa che funziona correttamente." Sbagliato. Un programma può girare perfettamente senza messaggi di errore e fare qualcosa di completamente sbagliato. La differenza tra un programma che "gira" e un programma che "funziona correttamente" è la differenza tra assenza di errori di sintassi e assenza di errori logici. Testa sempre il tuo programma con casi diversi: il caso normale, il caso limite (es. punteggio 0 o punteggio massimo), e i casi "sbagliati" (es. cosa succede se l'utente non scrive nulla e preme invio).

---

### Chi lavora con questa competenza nel 2030?

**Sviluppatore educativo (EdTech developer)**

Lo sviluppatore educativo crea applicazioni per l'apprendimento: quiz adattativi, simulazioni, ambienti di pratica. Combina la conoscenza della pedagogia (come si impara) con quella della programmazione (come si costruisce uno strumento digitale).

Il pensiero computazionale — decomposizione, pattern, astrazione, algoritmo — è la competenza fondamentale. Non importa quale linguaggio di programmazione viene usato: Python, JavaScript, Swift. Le strutture sono sempre le stesse tre: sequenza, selezione, iterazione.

Dove lavora: startup EdTech, piattaforme educative globali (Duolingo, Coursera), team digitali di grandi editori scolastici, divisioni formazione di aziende.

Competenze che inizia a costruire da qui: pensiero computazionale · strutture di controllo · variabili e liste · debug sistematico · progettazione dell'esperienza utente

*"Ogni volta che scrivo una nuova funzione, prima disegno su carta l'algoritmo. Il codice viene dopo. Sempre."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in 🌍 AGISCI.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### BASE — Scratch: sequenza e selezione semplice

**Obiettivo:** costruire un mini-quiz con 2 domande usando sequenza e selezione (if/else), con risposta tramite il blocco "Chiedi e aspetta".

**Partenza:** apri Scratch su scratch.mit.edu (o l'app desktop) e crea un nuovo progetto.

**Cosa costruire:**

Uno sprite (il gatto di default va bene) che:
1. All'avvio dice: "Benvenuto al quiz! Rispondo alle domande."
2. Chiede la prima domanda: "Qual è il macronutriente che fornisce più energia per grammo?"
3. Se la risposta è "grassi" o "lipidi": dice "Esatto! I grassi forniscono 9 kcal per grammo."
4. Se la risposta è sbagliata: dice "Non esatto — la risposta è 'grassi'. I grassi forniscono 9 kcal/g, il doppio di proteine e carboidrati."
5. Chiede la seconda domanda: "Quanti litri di acqua dovrebbe bere al giorno un ragazzo di 13 anni?"
6. Stessa struttura if/else con "2" come risposta accettata.

**Blocchi che userai:** "Quando si clicca bandiera verde", "Dire [...] per [...] secondi", "Chiedi [...] e aspetta", "Se <> allora... altrimenti...", "Risposta" (sensore che contiene la risposta dell'utente).

> **Suggerimento:** il blocco "Risposta" si trova nella categoria Sensori (azzurro chiaro). Ogni volta che usi "Chiedi e aspetta", il valore che l'utente ha digitato viene salvato automaticamente in "Risposta".

---

### INTERMEDIO — Quiz completo con punteggio e liste

**Obiettivo:** costruire il quiz completo descritto nel Passo Guidato della Zona 2 — 5 domande, punteggio, feedback, schermata finale.

**Segui i 6 passi guidati della 📖 ESPLORA**, adattando le domande al tema che preferisci (alimentazione, materiali, città, un argomento di storia o scienze).

**Requisiti minimi:**
- Almeno 5 domande in una lista.
- Variabile `punteggio` visualizzata sullo stage durante il quiz.
- Feedback diverso per risposta corretta e sbagliata.
- Schermata finale con il punteggio e un messaggio in base al risultato (almeno 3 messaggi diversi).
- Almeno un broadcast tra sprite diversi.

**Dopo il test:**
- Esegui il quiz e fai almeno 2 test completi (una volta rispondendo tutto corretto, una volta sbagliando almeno 3 risposte).
- Descrivi in 3-4 righe: hai trovato bug? Come li hai risolti?

---

### AVANZATO — Quiz adattivo con livelli di difficoltà

**Scenario:** la tua scuola vuole usare il tuo quiz per permettere agli studenti di fare pratica prima di un'interrogazione. Ma studenti diversi hanno livelli diversi. Devi creare un quiz che si adatta al livello dimostrato dall'utente durante il quiz stesso.

**La logica adattiva:**

- Le prime 3 domande sono a difficoltà media.
- Se l'utente risponde correttamente a 2 delle prime 3 domande, le ultime 2 domande sono avanzate.
- Se l'utente risponde correttamente a 0 o 1 delle prime 3 domande, le ultime 2 domande sono di rinforzo (più facili, con un suggerimento incluso).

**Per costruire questo:**
1. Crea tre liste separate: `domande_medie`, `domande_avanzate`, `domande_base`.
2. Crea una variabile `risposte_corrette_blocco1` che conta le risposte corrette nelle prime 3 domande.
3. Dopo la terza domanda, usa una selezione per decidere quale lista usare per le ultime 2 domande.

**Requisiti del livello avanzato:**
- La logica adattiva funziona correttamente in entrambi i casi (alto punteggio e basso punteggio nel primo blocco).
- Il punteggio finale tiene conto della difficoltà: una risposta corretta avanzata vale 2 punti, una base vale 1 punto.
- Schermata finale con punteggio pesato e indicazione del livello raggiunto.

> **Sfida bonus:** aggiungi un timer per ogni domanda. Se l'utente non risponde entro 30 secondi, la domanda si conta come sbagliata e si passa alla successiva. (Suggerimento: usa il blocco "attendi" e una variabile `tempo_rimasto`.)

---

## 🌍 AGISCI

---

### Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | Base — Sufficiente | Intermedio — Buono | Avanzato — Ottimo |
|----------|-------------------|-------------------|------------------|
| **1. Strutture di controllo** | Il programma usa almeno una sequenza e una selezione (if/else) funzionanti | Il programma usa sequenza, selezione e almeno un ciclo; tutte le strutture funzionano correttamente | Il programma usa tutte e tre le strutture in modo integrato; la logica è corretta anche per i casi limite (risposta vuota, punteggio 0, punteggio massimo) |
| **2. Variabili e liste** | Il punteggio viene aggiornato correttamente tramite una variabile | Le variabili principali sono usate correttamente; una lista gestisce almeno le domande | Le variabili sono nominate in modo leggibile e usate correttamente; le liste gestiscono domande, risposte e feedback; l'indice è gestito senza errori |
| **3. Funzionalità e completezza** | Il quiz funziona per almeno 2 domande con punteggio e feedback | Il quiz funziona per tutte le domande richieste, con punteggio, feedback corretto per risposta sbagliata, e schermata finale | Il quiz è completo, funziona correttamente in tutti i test effettuati, ha una schermata finale con messaggio differenziato in base al punteggio |
| **4. Debug e documentazione** | Il programma gira senza bloccarsi; lo studente descrive almeno un problema incontrato | Lo studente descrive i bug trovati e come li ha risolti; il codice è organizzato in modo leggibile | Il codice è commentato (con blocchi "Nota" in Scratch); lo studente documenta sistematicamente i test effettuati e i bug risolti; la logica è comprensibile leggendo il codice |

---

### Lo scenario

Il professore di Scienze ti ha chiesto di costruire uno strumento per aiutare la classe a ripassare i concetti di alimentazione prima dell'interrogazione della prossima settimana. Vuole qualcosa che non mostri solo le domande, ma che aiuti chi sbaglia a capire perché la risposta era sbagliata.

Il tuo compito è creare un quiz interattivo in Scratch che sia davvero utile per chi lo usa — non solo funzionante, ma ben progettato per l'apprendimento.

---

### La consegna

**Crea un quiz interattivo in Scratch** su un argomento che stai studiando (alimentazione, abitazione, materiali, storia o scienze — scegli tu).

**Requisiti funzionali:**
- Almeno 5 domande.
- Punteggio visualizzato in tempo reale.
- Feedback per ogni risposta sbagliata che spieghi *perché* quella risposta è sbagliata (non basta "sbagliato!" — spiega il concetto).
- Schermata finale con punteggio totale e almeno 2 messaggi diversi in base al risultato.

**Consegna:** condividi il link al progetto Scratch (usa "Condividi" nella piattaforma) con il tuo insegnante, oppure esporta il file .sb3 e consegnalo.

**Documentazione (1 foglio scritto a mano o digitale):**
- Decomposizione del problema: come hai diviso il problema in sottoproblemi?
- Strutture usate: quali strutture hai usato (sequenza, selezione, iterazione) e dove?
- Bug trovati e come li hai risolti (almeno 1).

---

### Badge SDG 9 — Industria, innovazione e infrastrutture

Il pensiero computazionale è la competenza trasversale dell'innovazione tecnologica del XXI secolo. Non serve diventare programmatori professionisti: serve saper decomponere problemi complessi, riconoscere schemi, progettare soluzioni sistematiche. Queste sono le competenze che alimentano l'innovazione — qualsiasi settore, qualsiasi mestiere.

---

### Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona e chiedi all'AI Coach:
- *"Come faccio a far passare il quiz alla domanda successiva automaticamente?"*
- *"Il mio punteggio non si aggiorna — cosa può essere sbagliato?"*
- *"Come si usa una lista in Scratch per gestire le domande?"*

L'AI Coach risponde solo su questa MC. Se ti suggerisce un approccio diverso dal tuo, valuta entrambi — spesso ci sono più modi corretti per risolvere lo stesso problema.

---

### Metacognizione — Rifletti sul tuo lavoro

**1. Sorpresa**
C'è stata una funzionalità che pensavi fosse semplice da programmare e invece si è rivelata più complessa? O al contrario, qualcosa che ti sembrava difficile e si è rivelato più semplice del previsto? Descrivi.

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Difficoltà e soluzione**
Qual è stato il bug più difficile da trovare? Quanto tempo hai impiegato? Come lo hai isolato e risolto? (Se non hai trovato bug, descrivi il momento in cui il programma non faceva quello che volevi e come hai capito perché.)

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa**
Scrivi il bug più significativo che hai incontrato: cosa faceva il programma di sbagliato, dove era l'errore nel codice, e come lo hai corretto. Cosa hai imparato da quell'errore che potresti usare nel prossimo progetto?

*Cosa ti ha fatto capire che avevi sbagliato? Come hai corretto?*

*Scrivi 2-3 righe:* ___________________________________________

---

**4. Connessione con la tua vita**
Pensa a un'app o un servizio digitale che usi ogni giorno. Ora che conosci le strutture del coding, prova a descrivere come potrebbe funzionare internamente: c'è una sequenza? Ci sono selezioni (if/else)? Ci sono cicli? Dove?

*Scrivi 2-3 righe:* ___________________________________________

---

### Collegamento con MC-DIG-2-02 — Dati e privacy

Il quiz che hai costruito raccoglie un tipo di dato: la risposta dell'utente. Nella prossima MC imparerai cosa significa "dato personale", come viene usato dalle piattaforme digitali, e quali diritti hai come utente. Una delle domande centrali di quella MC sarà: il tuo quiz in Scratch raccoglie dati personali? Cosa fa con quelli? Chi può vederli?

---

## APPENDICE — Tech in English

| Italiano | English | Come si legge |
|----------|---------|---------------|
| pensiero computazionale | computational thinking | /ˌkɒmpjuˈteɪʃənl ˈθɪŋkɪŋ/ |
| ciclo / iterazione | loop / iteration | /luːp/ / /ˌɪtəˈreɪʃən/ |
| selezione (if/else) | conditional statement | /kənˈdɪʃənəl ˈsteɪtmənt/ |
| variabile | variable | /ˈveəriəbl/ |
| errore nel codice | bug | /bʌɡ/ |
| correggere un errore | to debug | /tuː diːˈbʌɡ/ |

> *In English we say: "A loop repeats a block of code until a condition is met" — un ciclo ripete un blocco di codice finché una condizione è verificata.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- 📖 ESPLORA: la tabella delle categorie di Scratch va come infografica colorata con i colori reali delle categorie.
- Il caso studio YouTube va come box con sfondo scuro.
- Il diagramma del progetto guidato (6 passi) va come flowchart verticale nella colonna destra.
- Il box storia su Grace Hopper va come sidebar con foto (dominio pubblico — disponibile dalla US Navy).

**Per l'agente generatore asset:**
- Visual richiesto 1: mappa mentale di Scratch — categorie, colori, principali blocchi per categoria. PNG 1200×900.
- Visual richiesto 2: flowchart del quiz adattivo (logica del livello Avanzato). PNG.
- Visual richiesto 3: le 3 strutture fondamentali (sequenza, selezione, iterazione) come schema visivo con esempio in pseudo-Scratch. PNG.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: Hypertech 2020 · Allineata IN 2025 (D.M. n. 221/2025)*
*Contenuto espanso su indicazione editoriale — tutte e 5 le zone libro-ready*
