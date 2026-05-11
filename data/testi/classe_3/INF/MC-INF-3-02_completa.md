# MC-INF-3-02 — Come imparano le macchine? E cosa possono sbagliare?
**Area:** Informatica · **Anno:** 3ª · **Livello DigComp:** Advanced (A)
**SDG:** 10 — Ridurre le disuguaglianze · **Fonte:** originale
**Struttura:** 6 pagine (layout Advanced) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il milione di dollari che nessuno ha usato"**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 45 sec.*
> *(Script completo: MC-INF-3-02_hook-script.md)*

**Domanda di avvio:**
L'ultima cosa che Spotify o Netflix ti ha consigliato — era davvero per te?

Sembra di sì. Ma l'algoritmo non sa niente di te come persona. Sa tutto dei tuoi pattern statistici — e li confronta con quelli di milioni di utenti che si comportano come te. Tu sei un punto in uno spazio a mille dimensioni. Non sei una persona, per il modello. Sei un vettore.
Come funziona — e cosa può andare storto?

---

## 📖 ESPLORA

### Le macchine non pensano. Ottimizzano.

Il termine "intelligenza artificiale" crea aspettative sbagliate. Un modello di machine learning non pensa, non capisce, non ragiona. Esegue un'operazione matematica molto complessa: trovare pattern in enormi quantità di dati e usarli per fare previsioni su dati nuovi.

Questa distinzione non è filosofica — è tecnica, e ha conseguenze pratiche dirette su come ti fidi di questi strumenti, come li usi e come ne valuti i limiti.

---

### Come funziona il machine learning

Il machine learning tradizionale si divide in tre famiglie principali.

**Apprendimento supervisionato**

Il modello viene addestrato su un dataset di esempi *etichettati*: coppie (input, risposta corretta). Per ogni esempio, il modello fa una previsione, la confronta con la risposta corretta, misura l'errore e aggiusta i propri parametri interni per ridurlo. Questo processo si ripete milioni di volte.

Esempio: per addestrare un classificatore di email spam, gli mostri migliaia di email già etichettate come "spam" o "non spam". Il modello impara quali caratteristiche — certe parole, certe strutture, certi mittenti — sono associate allo spam. Poi applica quello che ha imparato alle email nuove.

L'apprendimento supervisionato funziona quando: hai molti dati etichettati di qualità, e il problema del futuro è simile ai problemi del passato.

**Apprendimento non supervisionato**

Il modello riceve dati senza etichette e cerca autonomamente strutture o raggruppamenti nascosti.

Esempio: Spotify ti raggruppa in cluster di utenti con gusti simili senza che nessuno abbia etichettato manualmente i generi musicali. Il modello trova da solo che "questi 2 milioni di utenti che ascoltano X tendono ad ascoltare anche Y" — e usa questo pattern per le raccomandazioni.

**Apprendimento per rinforzo**

Il modello impara interagendo con un ambiente: prova azioni, riceve ricompense o penalità, e aggiusta la strategia per massimizzare la ricompensa nel tempo. È il meccanismo con cui AlphaGo (DeepMind, 2016) ha battuto il campione mondiale di Go — giocando milioni di partite contro se stesso.

---

### Le reti neurali e il deep learning

I modelli più potenti oggi usano **reti neurali artificiali** — strutture matematiche ispirate (vagamente) alla struttura del cervello biologico.

Una rete neurale è organizzata in **strati** (layers):
- Uno strato di input che riceve i dati (es. i pixel di un'immagine).
- Uno o più strati nascosti che trasformano progressivamente i dati.
- Uno strato di output che produce la previsione finale.

Ogni connessione tra neuroni ha un **peso** — un numero che determina quanto quell'input conta. Durante l'addestramento, i pesi vengono aggiustati automaticamente attraverso un algoritmo chiamato **backpropagation** (retropropagazione dell'errore).

Il **deep learning** usa reti con molti strati nascosti. Una rete per il riconoscimento facciale potrebbe avere decine di strati: i primi rilevano bordi e contrasti, quelli centrali riconoscono forme geometriche, quelli finali identificano caratteristiche specifiche come occhi, nasi, proporzioni.

GPT-4 (alla base di ChatGPT) ha circa 1,8 trilioni di parametri — cioè 1,8 trilioni di pesi che vengono aggiustati durante l'addestramento. È stato addestrato su miliardi di pagine di testo.

---

### Allucinazioni, bias e limiti

I modelli di machine learning hanno limiti strutturali che è fondamentale conoscere.

**Allucinazioni**

I modelli linguistici come ChatGPT non "sanno" le cose nel senso in cui le sa una persona. Generano testo *statisticamente plausibile* basandosi sui pattern del testo di addestramento. Possono produrre informazioni false dette con tono di assoluta sicurezza — inventare citazioni, date, nomi di persone, sentenze giudiziarie. Questo si chiama "allucinazione".

Non è un bug: è una caratteristica strutturale di come funzionano questi modelli. La soluzione non è smettere di usarli — è verificare sempre le informazioni importanti con fonti primarie.

**Bias**

Un modello impara i pattern del dataset di addestramento — inclusi i pregiudizi umani presenti in quei dati.

Esempio documentato: nel 2015, il sistema di riconoscimento delle immagini di Google Photos etichettava erroneamente persone nere come "gorilla". La causa: il dataset di addestramento era sbilanciato — conteneva molte più immagini di persone bianche che nere. Il modello aveva imparato a "vedere" le persone bianche meglio.

Esempio documentato: nel 2018, Amazon ha dismesso un sistema di screening automatico dei curriculum perché penalizzava sistematicamente le donne. La causa: era stato addestrato sui curriculum degli ultimi 10 anni di assunzioni — in un settore storicamente dominato da uomini.

I bias del dataset diventano bias del modello. Il modello non li "capisce" — li riproduce e li amplifica.

**Overfitting**

Un modello che si adatta troppo ai dati di addestramento impara a memoria i singoli esempi invece di generalizzare i pattern. Funziona perfettamente sui dati di addestramento, malissimo su dati nuovi. È come uno studente che memorizza le domande dell'esame invece di capire la materia.

**Distributional shift**

Il mondo cambia. Un modello addestrato su dati del 2020 applicato a dati del 2025 potrebbe dare previsioni sempre più degradate — perché i pattern sono cambiati. Questo è il motivo per cui Netflix non ha mai implementato l'algoritmo vincitore del Netflix Prize: il contesto d'uso era cambiato mentre il modello veniva sviluppato.

---

### Il pipeline del machine learning

Addestrare un modello è un processo iterativo in molti passi.

1. **Raccolta dei dati:** trovare o creare il dataset di addestramento.
2. **Pulizia e preprocessing:** rimuovere errori, gestire valori mancanti, normalizzare le scale.
3. **Feature engineering:** scegliere o costruire le caratteristiche rilevanti degli esempi.
4. **Scelta del modello:** quale architettura usare? (Regressione lineare, albero decisionale, rete neurale?)
5. **Addestramento:** far girare l'algoritmo sul dataset di addestramento.
6. **Validazione:** testare su un dataset separato (mai visto durante l'addestramento) per misurare le prestazioni reali.
7. **Tuning:** aggiustare gli iperparametri per migliorare le prestazioni.
8. **Deployment:** mettere il modello in produzione.
9. **Monitoraggio:** verificare nel tempo che le prestazioni non degradino.

La fase più sottovalutata è il monitoraggio: un modello in produzione deve essere monitorato continuamente — il mondo cambia, i dati cambiano, il modello deve essere aggiornato.

---

> **🤖 Box IA e Dati (T8 — obbligatorio):**
> I modelli di IA generativa come ChatGPT, Claude o Gemini sono strumenti potenti ma con limiti strutturali precisi. Non verificano le loro affermazioni — generano testo plausibile. Possono sbagliare con assoluta sicurezza. Possono riprodurre bias del dataset di addestramento. Il loro "sapere" è congelato alla data di addestramento. Usarli bene significa usarli come strumenti di assistenza — non come fonti di verità — e verificare sempre le informazioni critiche con fonti primarie. Questo vale anche per questa MC: se usi l'AI Coach, verifica le risposte.

---

> **🔢 Collegamento STEM — Matematica e Scienze:**
> Il machine learning è matematica applicata: algebra lineare (i pesi di una rete neurale sono matrici), calcolo differenziale (la backpropagation usa le derivate per trovare i minimi della funzione di errore), statistica (bias-variance tradeoff, distribuzione dei dati, metriche di valutazione). Il metodo sperimentale della scienza si applica direttamente: l'ipotesi è il modello, l'esperimento è l'addestramento, la verifica è il test sul dataset di validazione.

---

## 🔍 OSSERVA

### Caso studio: come Spotify decide cosa ti piace

Spotify usa un sistema di raccomandazione basato su tre fonti di segnale combinate:

**1. Collaborative filtering**
"Utenti che ascoltano le stesse canzoni che hai ascoltato tu tendono ad ascoltare anche queste." È il meccanismo base. Funziona bene per artisti già popolari, male per artisti nuovi con pochi ascoltatori.

**2. Content-based filtering**
Analisi del segnale audio delle canzoni: BPM, tonalità, timbro, energia. Le canzoni con caratteristiche simili a quelle che hai ascoltato vengono raccomandate. Funziona per scoprire artisti sconosciuti, ma ignora il contesto (puoi volere canzoni calme la sera e veloci in palestra).

**3. Natural Language Processing sui testi delle canzoni e dei blog musicali**
Il modello analizza come le persone *parlano* delle canzoni. Se una rivista descrive due artisti con le stesse parole, il modello li considera simili.

**I limiti documentati:**
- La "bolla": più ascolti un genere, più il sistema te ne raccomanda — riducendo progressivamente l'esposizione ad altro.
- L'effetto "popolarità": i brani già molto ascoltati vengono raccomandati a tutti, il che aumenta ulteriormente la loro popolarità — a discapito degli artisti meno noti.
- La "Wrapped" non ti descrive: descrive il tuo cluster statistico. Il 12% degli utenti con i tuoi pattern di ascolto ha ascoltato quella canzone — tu sei il 12%, non il singolo.

---

### 👨‍💻 Chi lavora con questa competenza nel 2030?

**Machine Learning Engineer**
Scrive, addestra, ottimizza e mette in produzione modelli di machine learning. Lavora tra data science (capire i dati e il problema) e software engineering (costruire sistemi scalabili e affidabili).

**AI Ethics e Responsible AI Specialist**
Valuta i bias e i rischi dei sistemi di IA, progetta processi di audit e trasparenza, consulta le aziende su come implementare l'IA in modo equo e conforme alle normative (AI Act europeo, 2024).

*"Il modello più pericoloso non è quello che sbaglia — è quello di cui nessuno verifica le risposte."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica in 🌍 AGISCI.**

---

### ● INTERMEDIO — Addestro e testo un classificatore semplice

**Obiettivo:** vivere il processo di addestramento e valutazione di un modello.

**Il problema:** costruisci un classificatore manuale per decidere se una frase è "positiva" o "negativa" usando un approccio bayesiano naive.

**Dataset di addestramento (10 esempi):**

| Frase | Etichetta |
|-------|-----------|
| "Questo film è bellissimo" | Positivo |
| "Ottimo servizio, tornerò" | Positivo |
| "Prodotto fantastico, lo raccomando" | Positivo |
| "Esperienza meravigliosa" | Positivo |
| "Molto soddisfatto dell'acquisto" | Positivo |
| "Pessimo, non funziona niente" | Negativo |
| "Terribile esperienza, mai più" | Negativo |
| "Prodotto difettoso, deluso" | Negativo |
| "Servizio orribile, ore di attesa" | Negativo |
| "Completamente inutile, rimandato" | Negativo |

**Come procedere:**

1. Conta le occorrenze di ogni parola nelle frasi positive e nelle frasi negative.

2. Per ogni parola, calcola la *probabilità condizionale*: P(parola | Positivo) = numero di volte che la parola appare nelle frasi positive / numero totale di parole nelle frasi positive.

3. Classifica queste frasi di test usando la regola: se la somma delle probabilità condizionali delle parole è più alta per "Positivo", classifica come positivo; altrimenti come negativo.
   - "Servizio bellissimo, molto soddisfatto"
   - "Prodotto pessimo, esperienza terribile"
   - "Ottimo ma difettoso in alcuni punti"

4. Hai classificato correttamente tutte e 3? Se hai sbagliato, spiega perché questo semplice modello non riesce a gestire la terza frase.

---

### ●● AVANZATO — Analizzo il bias in un dataset reale

**Obiettivo:** identificare e misurare bias in dati reali, e valutare le conseguenze.

Il tuo docente ti fornisce (o puoi scaricare dal QR code) un dataset anonimizzato di 200 record relativi a candidature a un'università fittizia, con questi campi: genere, voto di diploma, provenienza geografica (nord/sud/estero), reddito familiare stimato, ammesso (sì/no).

**Compiti:**

1. Calcola il tasso di ammissione complessivo.

2. Calcola il tasso di ammissione separatamente per: genere, provenienza geografica, fascia di reddito.

3. Un tasso di ammissione diverso tra gruppi diversi indica necessariamente un bias discriminatorio? Oppure può avere altre spiegazioni? Discuti.

4. Se addestraste un modello di machine learning su questo dataset per automatizzare le ammissioni, quali bias riprodurrebbe? Quali danni concreti potrebbero causare?

5. Come modificheresti il processo di raccolta dei dati o di addestramento del modello per ridurre il bias? Elenca almeno 3 interventi concreti.

6. Scrivi una posizione (10-12 righe): è giusto usare algoritmi di machine learning per decisioni ad alto impatto sulla vita delle persone (ammissioni universitarie, prestiti bancari, libertà condizionale)? In quali condizioni sì, in quali no?

---

### ●●● ECCELLENTE — Progetto un sistema di IA responsabile

**Scenario:** una catena di supermercati vuole usare un algoritmo di machine learning per ottimizzare il personale di cassa — prevedere i picchi di afflusso ora per ora e decidere quanti cassieri attivare. Il sistema aggiornato ogni settimana con i dati dell'ultima settimana.

**Il tuo compito:**

1. **Descrivi il dataset di addestramento:** quali dati servono? Dove si raccolgono? Quali potrebbero mancare o essere sbagliati?

2. **Identifica i bias potenziali:** il sistema potrebbe essere meno accurato in certi giorni, certi orari, certi eventi? Quali conseguenze per i lavoratori?

3. **Metriche di valutazione:** definisci almeno 3 metriche per valutare se il modello funziona bene. (Non solo l'accuratezza media — considera anche i casi peggiori.)

4. **Piano di monitoraggio:** come verifichi nel tempo che il modello funzioni ancora? Ogni quanto lo riaddestrerai? Chi può richiedere una revisione?

5. **Diritti dei lavoratori:** i dipendenti devono essere informati che le loro ore lavorative sono gestite da un algoritmo? Il sistema AI Act europeo dice di sì per i sistemi ad "alto rischio". Come implementeresti questa trasparenza?

6. **Caso limite:** il sistema prevede un picco enorme il 24 dicembre alle 17 — ma quella sera c'è uno sciopero proclamato 3 giorni prima. Il modello non può saperlo. Cosa succede? Chi è responsabile della decisione finale?

---

## 🌍 AGISCI

### 📋 Rubrica di valutazione

| Criterio | ●● Intermedio | ●●● Avanzato | ●●●● Eccellente |
|----------|--------------|--------------|-----------------|
| **1. Comprensione tecnica del ML** | Distingue apprendimento supervisionato, non supervisionato e per rinforzo. Spiega cos'è il bias-variance tradeoff. | Spiega il processo di addestramento, validazione e monitoraggio. Identifica overfitting e distributional shift. | Analizza il pipeline completo di un sistema ML reale, inclusi preprocessing, feature engineering e deployment. |
| **2. Limiti e errori** | Conosce il concetto di allucinazione e bias nei modelli. Cita almeno un esempio reale. | Analizza cause e conseguenze del bias in un dataset specifico. Distingue errori tecnici da errori etici. | Progetta interventi concreti per ridurre bias e allucinazioni. Valuta le responsabilità legali e etiche. |
| **3. Pensiero critico sull'IA** | Sa che l'IA non è neutrale e può riprodurre pregiudizi. | Valuta se un sistema di IA specifico è adeguato per un uso specifico, argomentando con dati. | Applica i principi del AI Act europeo, della trasparenza algoritmica e dei diritti degli utenti a un caso reale. |
| **4. Comunicazione** | Spiega come funziona un algoritmo di raccomandazione a qualcuno senza conoscenze tecniche. | Scrive una posizione argomentata sull'uso dell'IA nelle decisioni ad alto impatto. | Produce documentazione tecnica e comunicazione pubblica entrambe adeguate ai rispettivi pubblici. |

---

### Lo scenario

Il tuo comune sta valutando di usare un algoritmo di machine learning per identificare le famiglie più a rischio di morosità nelle bollette e contattarle in anticipo con supporto sociale. Un'intenzione nobile — ma il sistema usa dati storici che riflettono disuguaglianze esistenti.

---

### La consegna

1. Scrivi un'analisi (15-20 righe) dei rischi di questo sistema: quali bias potrebbe riprodurre? Chi potrebbe essere penalizzato ingiustamente?

2. Proponi 5 requisiti tecnici e etici che il sistema dovrebbe rispettare per essere usato responsabilmente.

3. Prepara una presentazione per il consiglio comunale (3 slide) che spiega in modo accessibile come funziona il sistema, i benefici e i rischi, e le garanzie che avete inserito.

4. C'è qualcuno che non dovrebbe essere identificato da questo sistema anche se tecnicamente "a rischio"? (Es.: famiglie che non vogliono essere contattate, minori, ecc.) Come gestiresti le eccezioni?

---

### 🎯 Badge SDG 10

Il machine learning può ridurre le disuguaglianze — o amplificarle. Dipende da come viene costruito, su quali dati viene addestrato e chi controlla le sue decisioni. Capire come funziona è il prerequisito per partecipare al dibattito su come vogliamo che queste tecnologie siano regolamentate.

---

### 🤖 AI Coach

**[QR CODE]**

- *"Qual è la differenza tra machine learning e deep learning?"*
- *"Cosa significa 'addestramento' di un modello?"*
- *"Cos'è il bias di conferma nei dati di addestramento?"*

> **Nota:** le risposte dell'AI Coach su questa MC sono particolarmente a rischio di allucinazione su dati tecnici specifici (date, nomi di modelli, statistiche). Verifica sempre con fonti secondarie.

---

### 🪞 Metacognizione

1. Prima di questa MC, come descriveresti la tua idea di "intelligenza artificiale"? Come è cambiata adesso?

2. Hai usato un sistema di raccomandazione oggi (YouTube, Spotify, TikTok, Netflix)? Adesso che sai come funziona, lo usi diversamente?

3. C'è un'area della tua vita in cui saresti a disagio con decisioni prese da un algoritmo? (Voto scolastico? Assunzione? Pena in un processo penale?) Perché?

4. Il Netflix Prize ha pagato un milione di dollari per un algoritmo mai implementato. Cosa dice questo sull'incertezza dello sviluppo tecnologico? Ti ha sorpreso?

5. Se potessi addestrare un modello di machine learning su qualcosa di utile per la tua scuola, cosa sceglieresti? Che dati ti servirebbero? Quali rischi dovesti gestire?

---

## APPENDICE — Glossario tecnico essenziale

| Termine | Definizione |
|---------|------------|
| **Dataset** | Raccolta strutturata di dati usata per addestrare o testare un modello |
| **Feature** | Caratteristica misurabile di un esempio (es. temperatura, colore, parola) |
| **Modello** | La struttura matematica che fa previsioni dopo l'addestramento |
| **Addestramento** | Processo in cui il modello aggiusta i propri parametri sugli esempi etichettati |
| **Validazione** | Test del modello su dati mai visti durante l'addestramento |
| **Overfitting** | Il modello "memorizza" i dati di addestramento invece di generalizzare |
| **Bias** | Errore sistematico nelle previsioni del modello, spesso dovuto ai dati |
| **Allucinazione** | Produzione di informazioni false con tono di certezza da parte di un LLM |
| **Parametri** | I pesi della rete neurale aggiustati durante l'addestramento |
| **Inferenza** | Il processo di usare il modello addestrato su dati nuovi per fare previsioni |
| **LLM** | Large Language Model — modello linguistico di grandi dimensioni (es. GPT, Claude) |
| **Backpropagation** | Algoritmo per aggiustare i pesi di una rete neurale durante l'addestramento |

---

*MC versione 1.0 — Maggio 2026 · Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025)*
