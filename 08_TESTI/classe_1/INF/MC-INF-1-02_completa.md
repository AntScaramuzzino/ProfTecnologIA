# MC-INF-1-02 — Come si insegna a una macchina a fare le cose?
**Area:** Informatica · **Anno:** 1ª · **Livello DigComp:** Foundation (F)
**SDG:** 4 — Istruzione di qualità · **Fonte:** Hypertech 2020 + originale
**Struttura:** 4 pagine (doppio spread espanso) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il panino impossibile"**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 25 sec.*
> *(Script completo: MC-INF-1-02_hook-script.md)*

**Domanda di avvio:**
Sai fare un panino. Tutti sanno fare un panino.
Adesso prova a spiegarlo a qualcuno che non ha mai visto il pane, non sa cos'è un coltello, e segue ogni tua parola alla lettera senza capire nulla di ovvio.
Quello è il tuo prossimo problema.

---

## 📖 ESPLORA

### Un computer fa esattamente quello che gli dici — anche se è assurdo.

Prendi un momento e pensa a qualcosa che sai fare bene: allacciarti le scarpe, aprire un'app, preparare uno zaino. Tu lo fai senza pensarci. Il tuo cervello ha automatizzato quei movimenti — ma se provi a descriverli in parole, una per una, senza dare niente per scontato, scopri quanto sono complessi.

Un computer non può automatizzare niente. Non capisce il contesto. Non interpreta. Non chiede. Esegue esattamente le istruzioni che riceve — nemmeno un passo di più, nemmeno un passo di meno. Questa proprietà si chiama **determinismo**: le stesse istruzioni, con gli stessi dati, producono sempre lo stesso risultato.

---

### Cos'è un algoritmo

Un **algoritmo** è una sequenza finita di istruzioni precise, prive di ambiguità, che porta sempre allo stesso risultato a partire dagli stessi dati.

La parola viene dal nome del matematico persiano **Al-Khwārizmī** (780–850 d.C.), che scrisse un trattato sul calcolo con numeri arabi. Quando i suoi testi furono tradotti in latino nel XII secolo, il suo nome fu latinizzato in *Algoritmi* — e da lì è nata la parola.

Un algoritmo non è un'invenzione dei computer: esiste nella matematica da millenni. La ricetta di un piatto è un algoritmo. Un foglio di istruzioni per montare un mobile è un algoritmo. Le indicazioni per arrivare a scuola sono un algoritmo. La differenza è che un essere umano può seguirli in modo flessibile — saltare un passo ovvio, adattarsi a una variazione. Un computer non può.

---

### Le tre strutture fondamentali

Qualsiasi algoritmo — anche il più complesso programma mai scritto — è composto da tre sole strutture di controllo. Solo tre.

**1. Sequenza**
Le istruzioni vengono eseguite una dopo l'altra, nell'ordine in cui sono scritte. Nessuna viene saltata, nessuna viene ripetuta.

Esempio: per sommare due numeri, prima leggi il primo numero, poi leggi il secondo, poi somma, poi mostra il risultato. In quell'ordine. Sempre.

**2. Selezione (o condizione)**
Il programma prende una decisione in base a una condizione. Se la condizione è vera, esegue un blocco di istruzioni. Se è falsa, ne esegue un altro (o non fa niente).

Struttura: `SE [condizione] ALLORA [azioni A] ALTRIMENTI [azioni B]`

Esempio: se la temperatura è sopra i 30°C, accendi il condizionatore. Altrimenti, lascialo spento.

La condizione deve essere sempre verificabile in modo oggettivo: vero o falso. "Se fa caldo" non funziona — "caldo" è ambiguo. "Se la temperatura supera 30°C" funziona — è una misura precisa.

**3. Iterazione (o ciclo)**
Un blocco di istruzioni viene ripetuto finché una condizione rimane vera (o per un numero fisso di volte).

Struttura: `RIPETI [azioni] FINCHÉ [condizione è vera]`

Esempio: finché ci sono messaggi non letti, leggi il prossimo messaggio e segnalo come letto.

> 💡 **Lo sapevi?** Qualsiasi programma informatico — da un semplice calcolatore a un motore di IA generativa — è costruito combinando queste tre strutture. Non ne esistono altre. Il matematico italiano Corrado Böhm e il suo collega Giuseppe Jacopini hanno dimostrato questo risultato nel 1966 (Teorema di Böhm-Jacopini). È uno dei risultati fondamentali dell'informatica teorica.

---

### Variabili: dove metti i dati mentre lavori

Un algoritmo spesso ha bisogno di ricordare informazioni mentre lavora. Per farlo usa le **variabili** — spazi di memoria con un nome, dove si possono salvare e modificare dati.

Immagina una variabile come una scatola con un'etichetta. L'etichetta è il nome della variabile. Dentro ci metti un valore — un numero, una parola, vero o falso. Puoi guardare cosa c'è dentro, puoi cambiare il contenuto, puoi usarlo nei calcoli.

Esempi di variabili:
- `temperatura` → valore attuale: 28
- `nome_utente` → valore attuale: "Giulia"
- `sessione_aperta` → valore attuale: vero

Le variabili cambiano mentre l'algoritmo gira. La stessa variabile `temperatura` può valere 28 al mattino e 35 nel pomeriggio.

---

### Bug e debug: quando l'algoritmo sbaglia

Un **bug** è un errore nell'algoritmo: un'istruzione sbagliata, una condizione formulata male, una sequenza nell'ordine sbagliato. Il nome viene dalla parola inglese per insetto. Si dice che la prima "bug" nella storia del software sia stato un vero insetto — una falena — trovata inceppata nel relè di un computer Harvard Mark II nel 1947. La programmratrice Grace Hopper la incollò nel registro di bordo: "primo caso reale di bug trovato".

Il **debug** è il processo di trovare e correggere gli errori. È una competenza fondamentale: tutti gli algoritmi, anche quelli scritti da esperti, contengono bug. La differenza tra un programmatore mediocre e uno bravo non è che il bravo non fa errori — è che il bravo trova e corregge gli errori sistematicamente.

Per fare debug su un algoritmo, la tecnica più efficace è la più semplice: **seguire l'algoritmo passo per passo**, con dati concreti, controllando a ogni passaggio se il risultato è quello atteso. Se ad un certo passo il risultato non è corretto, lì c'è il bug.

---

### Pseudocodice e diagrammi di flusso

Per scrivere algoritmi senza preoccuparsi del linguaggio di programmazione specifico si usano due strumenti:

**Pseudocodice**: testo scritto in linguaggio quasi-naturale con una struttura precisa. Non è un linguaggio che il computer capisce — serve a ragionare sull'algoritmo prima di scriverlo nel linguaggio definitivo.

**Diagramma di flusso**: rappresentazione grafica dell'algoritmo usando simboli standard. Un ovale per inizio/fine, un rettangolo per ogni azione, un rombo per ogni condizione, frecce che indicano il flusso.

Esempio di pseudocodice per trovare il massimo tra due numeri:
```
INIZIO
  Leggi numero A
  Leggi numero B
  SE A > B ALLORA
    Stampa "Il massimo è A"
  ALTRIMENTI
    SE B > A ALLORA
      Stampa "Il massimo è B"
    ALTRIMENTI
      Stampa "I numeri sono uguali"
  FINE SE
FINE
```

> Guarda il diagramma di flusso accanto: mostra lo stesso algoritmo in forma grafica. Il rombo rappresenta la condizione `A > B`. Le due frecce che escono dal rombo portano ai due rami: "sì" e "no".

---

> **🔢 Collegamento STEM — Matematica:**
> Gli algoritmi sono alla base della matematica operativa. Quando esegui una moltiplicazione in colonna stai seguendo un algoritmo: una sequenza precisa di passi che, qualunque siano i numeri, produce il risultato corretto. L'algoritmo di Euclide per trovare il Massimo Comun Divisore tra due numeri è stato scritto circa 300 a.C. e funziona ancora esattamente nello stesso modo nei computer moderni.

---

## 🔍 OSSERVA

### Caso studio: l'algoritmo di ricerca binaria

Immagina di dover trovare il numero 73 in una lista di 100 numeri ordinati dal più piccolo al più grande. Potresti partire dall'inizio e controllare uno per uno — nel peggiore dei casi devi fare 100 controlli. Oppure potresti usare la **ricerca binaria**, uno degli algoritmi più eleganti mai inventati.

**Come funziona:**
1. Guarda il numero nel mezzo della lista (posizione 50).
2. SE il numero cercato è più piccolo, scarta la metà destra e ripeti il passo 1 sulla metà sinistra.
   SE il numero cercato è più grande, scarta la metà sinistra e ripeti il passo 1 sulla metà destra.
   SE è uguale, trovato.
3. Ripeti finché trovi il numero o la lista è vuota.

Per trovare il 73 in una lista di 100 numeri:
- Primo confronto: guardi il 50. 73 > 50, scarta la metà sinistra.
- Secondo confronto: guardi il 75. 73 < 75, scarta la metà destra.
- Terzo confronto: guardi il 62. 73 > 62.
- Quarto confronto: guardi il 68. 73 > 68.
- Quinto confronto: guardi il 71. 73 > 71.
- Sesto confronto: guardi il 73. Trovato!

6 confronti invece di 100. In una lista di 1.000 numeri servirebbero al massimo 10 confronti. In una lista di 1.000.000, al massimo 20.

Ogni volta che raddoppia il numero di elementi, serve solo un confronto in più. Questa proprietà si chiama crescita **logaritmica** e rende la ricerca binaria enormemente più efficiente della ricerca sequenziale.

Questo algoritmo è usato continuamente: quando cerchi un contatto nell'app del telefono, quando il computer trova un file, quando un database recupera un record. Non lo vedi — ma gira miliardi di volte al giorno.

---

> ⚠️ **Errore comune:** "gli algoritmi sono roba da programmatori, non mi riguardano." Falso. Ogni volta che segui delle istruzioni in un ordine preciso stai eseguendo un algoritmo. Il punto è imparare a *progettarli* — cioè a costruire sequenze di passi che portano sempre al risultato voluto, senza ambiguità, senza eccezioni non gestite.

---

### 👨‍💻 Chi lavora con questa competenza nel 2030?

**Data scientist e analista di dati**

I dati bruti non parlano da soli. Il data scientist scrive algoritmi per pulire i dati (rimuovere valori sbagliati o mancanti), trasformarli (convertire unità, normalizzare scale), analizzarli (calcolare statistiche, trovare pattern) e visualizzarli (creare grafici comprensibili). Ogni passo è un algoritmo: una sequenza di operazioni precise che trasformano dati grezzi in informazione utile.

Dove lavora: aziende di ogni settore, istituti di ricerca, enti pubblici, startup, redazioni giornalistiche (data journalism).

Competenze chiave che inizi a costruire qui: pensiero algoritmico · sequenza logica · gestione di condizioni e cicli · approccio sistematico al problema.

*"Prima di scrivere una riga di codice, devi avere in testa l'algoritmo completo. Il codice è solo la traduzione."*


**Software Engineer**

Costruisce il software che usiamo ogni giorno: app, siti, sistemi di pagamento, videogiochi. Il suo lavoro comincia molto prima del codice — prende un problema reale, lo scompone in sottoproblemi e progetta l'algoritmo che lo risolve, passo dopo passo, senza ambiguità. Solo allora lo traduce in un linguaggio di programmazione, lo testa e dà la caccia agli errori finché ogni istruzione fa esattamente ciò che deve.

Dove lavora: software house, aziende bancarie e assicurative, startup tecnologiche, grandi aziende di e-commerce, società di consulenza informatica.

Competenze chiave che inizi a costruire qui: algoritmi e strutture dati · debugging sistematico · analisi della complessità · linguaggi di programmazione

*"Il computer esegue alla lettera anche i miei errori. Per questo scrivo istruzioni che non lasciano dubbi."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**

---

### ● BASE — Scrivo le istruzioni per una macchina

**Obiettivo:** scrivere un algoritmo in pseudocodice per un'azione quotidiana semplice.

**Scegli una di queste azioni:**
a) Aprire lo zaino, prendere il quaderno di matematica e metterlo sul banco.
b) Trovare il numero di telefono di un amico nella rubrica e chiamarlo.
c) Accendere il computer, aprire il browser, cercare una parola.

**Come procedere:**
1. Scrivi ogni passo su una riga separata.
2. Sii il più preciso possibile: non scrivere "prendi il quaderno", scrivi "apri la cerniera dello zaino, cerca il quaderno di matematica tra i libri, estrailo, chiudi la cerniera, metti il quaderno sul banco".
3. Prova a contare quanti passi hai scritto.
4. Scambia il tuo algoritmo con quello di un compagno. Seguite alla lettera le istruzioni dell'altro. Trovate qualcosa di ambiguo o mancante?

**Domanda finale:** qual è il passo che avevi dato per scontato e che invece dovevi specificare?

---

### ●● INTERMEDIO — Progetto un algoritmo con selezione e ciclo

**Obiettivo:** scrivere un algoritmo completo in pseudocodice usando tutte e tre le strutture di controllo.

**Il problema:** scrivi un algoritmo che, dato un elenco di numeri, trovi e stampi solo quelli divisibili per 3.

**Struttura suggerita:**
```
INIZIO
  Leggi la lista di numeri
  RIPETI per ogni numero nella lista:
    SE il numero è divisibile per 3 ALLORA
      Stampa il numero
    FINE SE
  FINE RIPETI
FINE
```

**Il tuo compito:**
1. Completa l'algoritmo aggiungendo: come capisce se un numero è divisibile per 3? (Suggerimento: usa l'operazione "resto della divisione" — in matematica si chiama modulo, simbolo %). Se `numero % 3 = 0`, il numero è divisibile per 3.

2. Traccia manualmente l'algoritmo con questa lista: [9, 14, 3, 21, 7, 12, 5]. Quali numeri vengono stampati?

3. Modifica l'algoritmo per trovare i numeri divisibili per 3 **e** maggiori di 10. Come cambia la condizione?

4. Disegna il diagramma di flusso dell'algoritmo originale usando i simboli standard (ovale = inizio/fine, rettangolo = azione, rombo = condizione).

---

### ●●● AVANZATO — Analizzo l'efficienza di un algoritmo

**Scenario:** hai una lista di 10.000 nomi ordinati alfabeticamente. Devi trovare il nome "Zucchero". Confronta tre approcci diversi.

**Approccio A — Ricerca sequenziale:**
Parti dall'inizio e vai avanti uno per uno finché trovi "Zucchero" o arrivi alla fine.

**Approccio B — Ricerca binaria:**
Usa l'algoritmo descritto in Zona 3.

**Approccio C — Ricerca con indice:**
La lista è divisa in 26 sezioni, una per ogni lettera. Vai direttamente alla sezione "Z" e cerca lì.

**Il tuo compito:**

1. Per ogni approccio, calcola (o stima) il numero massimo di confronti per trovare "Zucchero" in una lista di 10.000 nomi.

2. Scrivi il pseudocodice per l'Approccio A (ricerca sequenziale). Identifica le tre strutture: dove c'è la sequenza? Dove c'è la selezione? Dove c'è il ciclo?

3. Per la ricerca binaria, calcola quanti confronti servono per 10.000 nomi. Usa la formula: numero massimo di confronti = log₂(N), dove N è il numero di elementi. Calcola log₂(10.000). (Suggerimento: quante volte puoi dividere 10.000 per 2 prima di arrivare a 1?)

4. L'Approccio C è più veloce della ricerca binaria per "Zucchero"? Dipende da quanti nomi ci sono nella sezione "Z". Come potresti migliorare ulteriormente l'Approccio C?

5. Scrivi una riflessione di 8-10 righe: in quali situazioni reali l'efficienza dell'algoritmo conta davvero? Fai un esempio concreto dove un algoritmo lento sarebbe un problema serio.

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione

| Criterio | ● Base | ●● Intermedio | ●●● Avanzato |
|----------|--------|---------------|--------------|
| **1. Precisione delle istruzioni** | Scrive almeno 5 passi per un'azione semplice, con alcune ambiguità residue. | Scrive un algoritmo completo con tutti i passi necessari, senza ambiguità evidenti. | Scrive un algoritmo privo di ambiguità che un robot potrebbe seguire alla lettera senza errori. |
| **2. Strutture di controllo** | Riconosce la differenza tra sequenza e ciclo. Sa che esistono le condizioni. | Usa correttamente sequenza, selezione e iterazione in un algoritmo semplice. | Usa le tre strutture in combinazione, identifica quale struttura è più efficiente per il problema dato. |
| **3. Debug** | Trova almeno un errore nell'algoritmo di un compagno quando lo esegue passo per passo. | Trova e corregge gli errori in modo sistematico, spiegando la causa di ogni bug. | Anticipa i possibili errori prima di testarli, scrive casi di test specifici per coprire le situazioni limite. |
| **4. Efficienza** | Sa che algoritmi diversi possono risolvere lo stesso problema. | Confronta due algoritmi e dice quale è più veloce su un esempio concreto. | Calcola il numero di passi di un algoritmo in funzione della dimensione del problema e usa questo per giustificare la scelta. |

---

### Lo scenario

La tua scuola organizza un torneo di scacchi. Ci sono 64 studenti iscritti. I nomi sono in ordine casuale su un foglio. Prima di iniziare, devono essere messi in ordine alfabetico per formare le coppie del primo turno.

Sei tu a organizzare il procedimento.

---

### La consegna

**Passo 1 — L'algoritmo naive**
Scrivi un algoritmo in pseudocodice per ordinare la lista in ordine alfabetico. Puoi usare l'approccio più semplice che ti viene in mente (es.: trova il nome che viene prima alfabeticamente, mettilo al primo posto, ripeti con i restanti).

**Passo 2 — Conta i passi**
Con il tuo algoritmo, quanti confronti devi fare nel caso peggiore per ordinare una lista di 64 nomi? Prova a calcolare (o stimare) il numero.

**Passo 3 — Migliora**
Cerca online "algoritmo di ordinamento a bolle" (bubble sort). Confronta il tuo algoritmo con questo. Hanno lo stesso numero di passi nel caso peggiore? Uno dei due è più comprensibile?

**Passo 4 — Riflessione**
Ci sono algoritmi di ordinamento molto più efficienti (quicksort, mergesort). Se invece di 64 studenti ce ne fossero 64.000, la scelta dell'algoritmo farebbe differenza nel tempo di calcolo? Motiva la risposta.

---

### Materiali che ti servono

- Carta e penna per il pseudocodice e i calcoli
- Una lista di 10 nomi (inventati) su cui testare il tuo algoritmo manualmente
- Questa scheda (scaricabile con il QR code → o fotocopiabile)

---

### 🎯 Badge SDG 4

Capire il pensiero algoritmico non è solo informatica: è una competenza trasversale per affrontare problemi complessi in modo sistematico. Ogni volta che scomponi un problema in passi, definisci le condizioni, e prevedi i casi possibili, stai usando pensiero algoritmico — in matematica, in scienze, in qualsiasi disciplina.

---

### 🤖 Dubbi? Chiedi all'AI Coach

**[QR CODE AI COACH]**

- *"Cos'è la differenza tra un ciclo WHILE e un ciclo FOR?"*
- *"Come si rappresenta una condizione nel diagramma di flusso?"*
- *"Cosa significa che un algoritmo ha complessità O(log n)?"*

---

### 🪞 Metacognizione

**1.** Qual è la differenza tra come tu segui le istruzioni e come le segue un computer? Scrivi 2-3 righe.

**2.** Hai trovato un passo "ovvio" che dovevi rendere esplicito? Quale? Perché lo davi per scontato?

**3.** Se dovessi spiegare cos'è un algoritmo a qualcuno che non ha mai usato un computer, cosa diresti in tre frasi?

**4.** Il bug più comune nell'algoritmo del panino è dimenticare di "aprire il pacchetto del burro prima di spalmare". Hai trovato un bug simile nel tuo algoritmo — un'azione che presupponeva uno stato che non era garantito?

---

### 🔗 Collegamento con le MC INF successive

Hai imparato cos'è un algoritmo e come si scrive. La prossima domanda è: chi esegue gli algoritmi? In MC-INF-2-01 scoprirai cos'è il sistema operativo — il programma che gestisce tutti gli algoritmi in esecuzione contemporaneamente sul tuo computer.

---

## APPENDICE — Tech in English

| Italiano | English | Come si legge |
|----------|---------|---------------|
| algoritmo | algorithm | /ˈælɡərɪðəm/ |
| variabile | variable | /ˈveəriəbl/ |
| condizione | condition | /kənˈdɪʃən/ |
| ciclo / iterazione | loop / iteration | /luːp/ |
| selezione | selection / if-then-else | /sɪˈlɛkʃən/ |
| sequenza | sequence | /ˈsiːkwəns/ |
| errore / bug | bug | /bʌɡ/ |
| ricerca binaria | binary search | /ˈbaɪnəri sɜːtʃ/ |
| diagramma di flusso | flowchart | /ˈfləʊtʃɑːt/ |

> *"An algorithm is a finite sequence of well-defined instructions to solve a problem" — un algoritmo è una sequenza finita di istruzioni ben definite per risolvere un problema.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- In Zona 2: la tabella delle tre strutture (sequenza/selezione/iterazione) va come infografica visuale a tre colonne con colore area.
- In Zona 3: il diagramma della ricerca binaria con i valori esempio va come illustrazione a tutta larghezza.
- Il box Böhm-Jacopini va come sidebar (non nel testo principale).
- La tabella della rubrica in Zona 5 può richiedere una pagina separata.

**Per l'agente generatore asset:**
- Visual 1: infografica "Le 3 strutture di controllo" — tre colonne affiancate: Sequenza (blocchi in fila), Selezione (rombo con due rami), Iterazione (ciclo con freccia che torna). Formato PNG 1200×500.
- Visual 2: diagramma di flusso "ricerca binaria su lista di 7 elementi" — con i valori numerici dell'esempio. Formato PNG 800×900.
- Visual 3: illustrazione timeline "Dal papiro di Al-Khwārizmī all'IA moderna" — 830 d.C. → 1966 (Böhm-Jacopini) → 1947 (primo bug) → 2026. Formato PNG 1200×300.
- Hook audio: già disponibile in MC-INF-1-02_hook-script.md.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: Hypertech 2020 · originale · Allineata IN 2025 (D.M. n. 221/2025)*
