# MC-DIG-3-02 — L'IA non pensa. Calcola. Capire, usare e valutare l'intelligenza artificiale
**Area:** Digitale/Coding · **Anno:** 3ª · **Livello DigComp:** Advanced (A)
**SDG:** 9 — Innovazione · 10 — Ridurre le disuguaglianze · 16 — Giustizia · **Fonte:** originale
**Struttura:** 4 pagine (MC Advanced) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "L'IA non pensa. Calcola."**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 40 sec.*
> *(Script completo: MC-DIG-3-02_hook-script.md)*

**Domanda di avvio:**
ChatGPT può scrivere poesie, tradurre lingue, spiegare la fisica quantistica.
Sembra che pensi. Sembra che capisca.
Non capisce niente.

I sistemi di riconoscimento facciale addestrati su dati prevalentemente occidentali hanno tassi di errore fino a 35 volte superiori per le donne con pelle scura rispetto agli uomini bianchi. Lo ha misurato Joy Buolamwini del MIT nel 2018.

Sapere la differenza tra "sembra intelligente" e "è addestrato su certi dati" è probabilmente la competenza più importante che puoi sviluppare sulla tecnologia del presente e del futuro.

---

## 📖 ESPLORA

### Storia dell'intelligenza artificiale: un percorso non lineare

L'intelligenza artificiale non è nata con ChatGPT. Ha una storia lunga settant'anni, con momenti di grande ottimismo e periodi di profonda delusione chiamati "inverni dell'IA".

**1950 — Il test di Turing:** Alan Turing, il matematico britannico che aveva craccato il codice Enigma nazista durante la Seconda Guerra Mondiale, pubblica l'articolo "Computing Machinery and Intelligence." Propone un esperimento mentale: se un essere umano, conversando per iscritto con un'altra entità, non riesce a capire se sta parlando con un uomo o una macchina, la macchina può essere considerata "intelligente." Questo esperimento si chiama **Test di Turing**. Nota: Turing non stava dicendo che una macchina che supera il test è davvero intelligente — stava definendo un criterio operativo per una domanda filosoficamente insolubile.

**1956 — Nascita dell'IA come disciplina:** alla conferenza di Dartmouth, John McCarthy conia il termine "artificial intelligence." I ricercatori presenti sono ottimisti: "entro 20 anni avremo macchine che fanno qualsiasi lavoro un essere umano può fare." Non andò così.

**1969-1974 — Primo inverno dell'IA:** i finanziamenti governativi si prosciugano quando diventa chiaro che le promesse degli anni '50 erano irrealistiche. I problemi di traslazione automatica, ragionamento generale, comprensione del linguaggio si rivelano molto più complessi del previsto.

**1980-1987 — I sistemi esperti:** una nuova ondata di ottimismo. I "sistemi esperti" — programmi con migliaia di regole if-then scritte da esperti umani — sembrano funzionare per compiti specifici (diagnosi medica, configurazione di computer). Vengono investiti miliardi. Poi il crollo: i sistemi esperti non si generalizzano, sono difficilissimi da mantenere aggiornati, e non imparano nulla.

**1987-1993 — Secondo inverno dell'IA:** i finanziamenti crollano di nuovo. "IA" diventa una parola quasi impronunciabile nel mondo accademico e industriale.

**1997 — Deep Blue batte Kasparov:** la ricerca continua, più discreta. IBM costruisce Deep Blue. Kasparov perde. Il mondo si risveglia.

**2012 — La rivoluzione del deep learning:** al contest ImageNet di classificazione di immagini, il modello AlexNet di Geoffrey Hinton (Università di Toronto) ottiene un tasso di errore del 15,3% — quasi la metà dell'errore del secondo classificato (26,2%). AlexNet usa una **rete neurale profonda** addestrata su GPU. Da quel momento, il deep learning diventa lo standard per quasi tutti i problemi di IA.

**2022 — ChatGPT e la democratizzazione dell'IA generativa:** OpenAI rilascia ChatGPT, basato sul modello GPT-3.5. In cinque giorni raggiunge 1 milione di utenti (a confronto: Instagram aveva impiegato 75 giorni, Netflix 41 mesi). L'IA generativa — sistemi che producono testo, immagini, audio, video — diventa accessibile a chiunque abbia un browser.

La lezione della storia: l'IA è una disciplina con cicli di ottimismo esagerato e delusione. Ogni nuova tecnologia viene sopravvalutata nel breve periodo e spesso sottovalutata nel lungo. Per valutare correttamente dove siamo oggi, bisogna capire cosa l'IA sa fare davvero — e cosa non sa fare.

---

### Machine learning: come le macchine "imparano"

Il **machine learning** (apprendimento automatico) è il campo dell'IA che si occupa di sistemi che migliorano le proprie prestazioni sulla base dei dati, senza essere esplicitamente programmati per ogni caso specifico. Esistono tre famiglie principali.

**Apprendimento supervisionato:** il sistema riceve esempi etichettati — coppie (input, output corretto) — e impara a riprodurre l'associazione su nuovi input mai visti. Esempio: un classificatore di email spam viene addestrato su 100.000 email etichettate come "spam" o "non spam." Dopo l'addestramento, data una nuova email, il sistema predice se è spam o no. Le applicazioni sono ovunque: riconoscimento di immagini, traduzione automatica, diagnosi medica da immagini radiologiche, valutazione del credito bancario.

**Apprendimento non supervisionato:** il sistema riceve input senza etichette e deve trovare strutture, pattern o raggruppamenti autonomamente. Esempio: un algoritmo di clustering applicato ai dati di acquisto di un e-commerce raggruppa i clienti in "tipi" (acquirenti di elettronica, lettori di libri, appassionati di sport) senza che nessuno abbia definito queste categorie in anticipo. Applicazioni: segmentazione di clienti, riduzione della dimensionalità dei dati, rilevamento di anomalie.

**Apprendimento per rinforzo:** il sistema impara attraverso interazione con un ambiente, ricevendo ricompense (reward) per azioni corrette e penalità per azioni errate. Non c'è un dataset di esempi: c'è un agente che esplora, sbaglia, impara. È il meccanismo usato per addestrare AlphaGo (giochi da tavolo), per sistemi di controllo robotico, e per l'addestramento RLHF (Reinforcement Learning from Human Feedback) usato da ChatGPT per allineare le risposte alle preferenze umane.

---

### Reti neurali artificiali: anatomia di un cervello artificiale

Le **reti neurali artificiali** sono strutture matematiche ispirate (vagamente) all'organizzazione del cervello biologico. La parola "ispirate" è importante: sono analogie funzionali, non repliche fedeli.

**Il neurone artificiale:** l'unità base è un nodo che riceve più valori numerici in ingresso, li somma con pesi diversi, applica una funzione di attivazione al risultato, e produce un valore in uscita. I pesi determinano quanto ogni ingresso influenza l'uscita. Durante l'addestramento, i pesi vengono modificati per ridurre l'errore tra output del modello e output desiderato.

**Gli strati:** i neuroni sono organizzati in strati. Lo **strato di input** riceve i dati grezzi (i pixel di un'immagine, le parole di un testo). Gli **strati nascosti** (hidden layers) trasformano la rappresentazione dei dati in modo progressivamente più astratto — i primi strati rilevano bordi e colori, i successivi forme, i più profondi oggetti complessi. Lo **strato di output** produce la classificazione o la predizione finale.

**Il training (addestramento):** il processo di addestramento consiste nel far passare migliaia o miliardi di esempi attraverso la rete, calcolare quanto l'output differisce dall'output desiderato (funzione di perdita, loss), e usare un algoritmo chiamato **backpropagation** per modificare i pesi in direzione che riduce l'errore. Questo processo si ripete molte volte (epoche) finché l'errore non converge su un valore accettabile.

Un modello come GPT-4 ha circa 1 trilione di parametri (pesi). L'addestramento ha richiesto migliaia di GPU per mesi. Il risultato è una funzione matematica enormemente complessa che associa sequenze di testo in ingresso a continuazioni statisticamente probabili.

---

### IA generativa: come funziona un LLM

Un **LLM (Large Language Model)** come GPT-4, Llama, Gemini, o Claude è una rete neurale addestrata su enormi quantità di testo per predire il token successivo in una sequenza.

**Cosa è un token:** il testo non viene elaborato parola per parola. Viene scomposto in "token" — unità sub-lessicali. "Tecnologia" potrebbe essere un singolo token. "Biotecnologia" potrebbe essere due token ("Bio" + "tecnologia"). Un token corrisponde approssimativamente a 3/4 di parola in italiano.

**Come genera testo:** dato un testo di input (il "prompt"), il modello calcola per ogni possibile token successivo la probabilità che compaia in quella posizione, basandosi su tutto quello che ha visto durante l'addestramento. Seleziona un token con alta probabilità, lo aggiunge al testo, e ripete il processo. La risposta viene generata un token alla volta, ognuno condizionato da tutti i token precedenti.

**Il parametro "temperature":** controlla quanto è "casuale" la selezione del token. Temperature bassa (vicina a 0): il modello sceglie quasi sempre il token con probabilità più alta — risposte più prevedibili e conservative. Temperature alta (vicina a 1): il modello introduce più casualità — risposte più creative ma meno accurate.

**Perché il modello non "capisce":** il modello impara correlazioni statistiche tra token nel corpus di addestramento. Non ha un modello interno del mondo. Non sa che Roma è in Italia nel senso in cui lo sai tu — sa che "Roma" e "Italia" co-occorrono frequentemente in certi contesti nel testo su cui è stato addestrato. Per questo può produrre testo plausibile su qualsiasi argomento, anche inventando fatti che suonano credibili.

---

### Allucinazioni: quando l'IA inventa con sicurezza

Le **allucinazioni** sono risposte prodotte da un LLM che contengono informazioni false, presentate con lo stesso tono sicuro delle informazioni vere. Il termine è tecnico: non è una metafora emotiva.

Perché succede: il modello non ha accesso a una fonte verificata di "fatti veri." Ha una distribuzione statistica su sequenze di token. Se per un certo contesto la sequenza statisticamente più probabile è una frase falsa (perché nel corpus di addestramento quella frase o varianti simili erano frequenti, indipendentemente dalla loro verità), il modello la produce.

Esempi reali di allucinazioni documentate:
- LLM che citano articoli scientifici con titoli, autori e riviste plausibili, ma non esistenti.
- LLM che descrivono eventi storici con date errate in modo così fluente da sembrare autoritative.
- LLM che producono codice con funzioni inesistenti con nomi plausibili.

La chiave è questa: il modello non sa di stare sbagliando. Non ha un sistema di verifica interno che distingue il vero dal falso. Produce testo plausibile — e plausibile non significa corretto.

**Come si verifica:** ogni affermazione fattuale prodotta da un LLM su cui si intende fare affidamento va verificata su fonti indipendenti. Questo non significa che i LLM siano inutili — significa che vanno usati come strumenti che accelerano il processo di ricerca, non come fonti autorevoli.

---

### Bias algoritmici: quando i dati riflettono le disuguaglianze

Un sistema di machine learning impara dai dati. Se i dati riflettono bias e disuguaglianze del mondo reale, il sistema li apprende e li amplifica.

**Il caso Gender Shades (2018):** Joy Buolamwini, ricercatrice del MIT Media Lab, e Timnit Gebru (allora a Microsoft) pubblicano uno studio sistematico sulle prestazioni dei sistemi commerciali di classificazione del genere da immagine facciale (Microsoft, IBM, Megvii/Face++). Risultati: il tasso di errore per uomini dalla pelle chiara era inferiore all'1%. Per donne dalla pelle scura era fino al 34,7%. Il motivo: i dataset di addestramento erano prevalentemente composti da volti maschili e di pelle chiara. Il sistema aveva imparato dai dati disponibili — e i dati erano sbilanciati.

**Il caso COMPAS (2016):** il sistema COMPAS (Correctional Offender Management Profiling for Alternative Sanctions) veniva usato in alcuni tribunali americani per predire la probabilità di recidiva di un imputato — e influenzare le decisioni su libertà vigilata e condanne. ProPublica analizzò 7.000 casi e trovò che il sistema classificava erroneamente i cittadini neri come "ad alto rischio di recidiva" quasi il doppio delle volte rispetto ai cittadini bianchi. La risposta di Northpointe (azienda che produceva COMPAS) fu che il sistema era "calibrato" — cioè le sue percentuali erano statisticamente accurate per gruppi di persone. Il problema è che le sue previsioni impattavano individui, non medie statistiche.

**Come si generano i bias:**
1. *Bias nei dati di addestramento:* se il dataset di training è sbilanciato o riflette discriminazioni storiche, il modello le impara.
2. *Bias nella definizione del problema:* cosa stai cercando di predire, e come hai definito il "successo"? Se addestri un sistema di selezione CV su dati storici di un'azienda che aveva pochi dipendenti donne, il sistema imparerà a preferire i candidati che assomigliano ai dipendenti storici — uomini.
3. *Bias nel feedback loop:* i sistemi di raccomandazione mostrano agli utenti più di quello che già conoscono. Se mostro notizie su criminalità a un utente che ha mostrato interesse per quell'argomento, rinforzo quella preferenza — e potenzialmente amplifico una visione distorta del mondo.

---

### IA e lavoro: cosa cambia, cosa rimane

L'impatto dell'IA sul lavoro è reale ma complesso — e le previsioni semplici ("l'IA eliminerà il 50% dei lavori entro 2030") sono quasi sempre troppo semplicistiche.

**Professioni a rischio di automazione parziale:** compiti ripetitivi, ad alta struttura, con input standardizzati. Traduzione di testi standard, elaborazione di dati tabulari, generazione di codice boilerplate, classificazione di documenti, trascrizione audio. In questi casi, l'IA non elimina la professione ma cambia radicalmente il tempo che il professionista dedica a queste attività.

**Professioni trasformate:** medici, avvocati, giornalisti, designer, insegnanti. L'IA accelera le parti di raccolta informazioni e generazione di bozze, ma le decisioni critiche — che richiedono giudizio, responsabilità, contestualizzazione, empatia — rimangono umane. Un radiologo che usa IA per pre-classificare le immagini può analizzare il triplo dei casi al giorno: la sua professione non è eliminata, è trasformata.

**Professioni al sicuro o in crescita:** professioni che richiedono contatto fisico (artigiani, idraulici, elettricisti), cura di persone (insegnanti, medici, infermieri), creazione di senso e narrazione (scrittori, artisti, cineasti che usano la propria voce), gestione di sistemi IA (ingegneri, data scientist, ethicist).

**La nuova competenza trasversale:** saper lavorare con sistemi IA — formulare prompt efficaci, valutare criticamente gli output, identificare allucinazioni e bias, integrare i risultati nel proprio lavoro — diventa una competenza fondamentale in quasi tutte le professioni. Non sostituisce la competenza disciplinare: la amplifica e la trasforma.

---

### L'AI Act europeo: la prima grande regolamentazione dell'IA nel mondo

Nell'agosto 2024 è entrato in vigore l'**AI Act** (Regolamento UE 2024/1689), la prima legge al mondo che regola sistematicamente i sistemi di intelligenza artificiale.

Il principio fondamentale è la **classificazione per rischio**:

**Rischio inaccettabile (vietati):** sistemi di manipolazione subliminale, classificazione di persone basata su caratteristiche protette (razza, religione, orientamento sessuale) per determinare l'accesso a servizi, sistemi di social scoring (come in Cina), riconoscimento delle emozioni nei luoghi di lavoro e nelle scuole (con poche eccezioni), identificazione biometrica in tempo reale in spazi pubblici (con eccezioni per sicurezza nazionale).

**Rischio alto (obblighi stringenti):** sistemi usati in infrastrutture critiche, istruzione, occupazione, servizi essenziali, giustizia penale. Devono essere soggetti a valutazioni di conformità, supervisione umana, trasparenza, accuratezza e robustezza.

**Rischio limitato (obblighi di trasparenza):** chatbot, deepfake, sistemi che interagiscono con persone. Devono indicare chiaramente all'utente che sta interagendo con un sistema IA, non con un essere umano.

**Rischio minimo:** la maggior parte dei sistemi IA (filtri antispam, videogiochi, ecc.) — nessun obbligo specifico.

L'AI Act è rilevante per te perché: (1) ogni sistema IA che usi potrebbe essere classificato in questa gerarchia, e avere diritti come utente su quei sistemi; (2) le professioni del futuro in cui potresti lavorare includeranno ruoli che gestiscono la compliance dell'AI Act; (3) comprendere la regolamentazione è parte della cittadinanza digitale nel XXI secolo.

---

> **📦 Box T8 — IA critica: mai descrivere l'IA senza menzionare errori, limiti, verifica, controllo umano**
>
> Ogni volta che in questo libro si parla di un sistema di intelligenza artificiale, si applicano queste quattro regole obbligatorie:
>
> **Errori:** ogni sistema IA sbaglia. Il tasso di errore varia (dal 99,9% di accuratezza di un classificatore di immagini mediche al 30% di errore di un sistema di riconoscimento facciale su certi gruppi demografici), ma il tasso di errore zero non esiste. Prima di usare o fidarsi di un sistema IA, chiedi: qual è il suo tasso di errore? Su quali tipi di input sbaglia di più?
>
> **Limiti:** ogni sistema IA ha un dominio di competenza. Un LLM addestrato su testo non sa "vedere" — sa descrivere immagini solo perché durante l'addestramento ha visto abbondanti descrizioni di immagini. Un sistema di diagnosi dermatologica addestrato su pazienti europei ha prestazioni inferiori su pazienti africani o asiatici. I limiti non sono difetti da nascondere — sono caratteristiche da comunicare.
>
> **Verifica:** ogni output di un sistema IA su cui si intende fare affidamento va verificato su fonti indipendenti. Questo vale per i fatti prodotti da un LLM, per le diagnosi mediche assistite dall'IA, per i punteggi di credito calcolati algoritmicamente. "Il sistema ha detto X" non è sufficiente. "Il sistema ha detto X, ho verificato su Y, e confermato perché Z" è un ragionamento corretto.
>
> **Controllo umano:** per qualsiasi decisione che ha impatto significativo sulla vita di persone reali (assunzione, credito, diagnosi, condanna penale, accesso a servizi), la decisione finale deve rimanere in mano a un essere umano con la possibilità concreta di valutare il caso individuale e ignorare la raccomandazione del sistema se necessario. L'AI Act lo richiede esplicitamente per i sistemi ad alto rischio.

> **🔢 Collegamento STEM — Matematica e Statistica:**
> Il machine learning è matematica applicata. La regressione lineare, la classificazione bayesiana, la discesa del gradiente, le matrici di confusione — sono tutti strumenti statistici e di algebra lineare. Quando il sistema COMPAS sbagliava la previsione di recidiva più spesso per cittadini neri che per cittadini bianchi, il problema era misurabile con strumenti statistici: sensitivity, specificity, false positive rate per gruppo demografico. La giustizia algoritmica non è un problema filosofico astratto — è un problema di ottimizzazione matematica con vincoli etici. Le scelte di quali metriche ottimizzare riflettono scelte di valori.

---

## 🔍 OSSERVA

### Il caso: testa una domanda su un LLM e verifica ogni affermazione

Questo non è un caso studio teorico. È un'attività che puoi fare adesso, se hai accesso a un LLM.

**Il protocollo:**
1. Scegli una domanda factual su un argomento che conosci abbastanza da valutare la risposta: la storia di un evento, il funzionamento di un processo, le caratteristiche di un materiale, la biografia di una persona.

Esempio: *"Descrivi il processo di produzione dell'alluminio dalla bauxite, includendo i processi Bayer e Hall-Héroult, le temperature coinvolte e il consumo energetico tipico per tonnellata."*

2. Poni la domanda al LLM (ChatGPT, Gemini, o altro disponibile).

3. Registra la risposta integralmente.

4. Verifica ogni affermazione fattuale contenuta nella risposta su almeno una fonte esterna (enciclopedia, sito istituzionale, manuale tecnico). Usa la tabella qui sotto.

| Affermazione nella risposta del LLM | Verificata su quale fonte | Corretta? | Se no, qual è il dato corretto? |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

5. Conta: quante affermazioni erano corrette? Quante erano parzialmente corrette (approssimate)? Quante erano errate?

6. Scrivi 5-8 righe di valutazione critica: il sistema è stato utile per questo compito? Come useresti la risposta che ha dato? Quali parti accetteresti senza verifica, se dovessi scegliere?

Questo esercizio non ha l'obiettivo di "smontare" i LLM — ha l'obiettivo di sviluppare il tuo giudizio su quando e come usarli.

---

> **⚠️ Errore comune — "L'IA non ha opinioni, quindi è neutrale e obiettiva":**
> Nessun sistema IA è neutrale. Ogni scelta di design — quali dati usare, quale funzione ottimizzare, quale architettura scegliere — riflette le preferenze e i valori di chi ha costruito il sistema. Un LLM addestrato su testo prevalentemente in inglese dà risposte migliori su argomenti ben rappresentati nella cultura anglofona. Un sistema di raccomandazione ottimizzato per il "tempo di sessione" dell'utente imparerà a mostrargli contenuti che lo tengono incollato allo schermo — non necessariamente contenuti che gli fanno bene. La neutralità dell'IA è un mito utile per chi ha interesse a presentare i propri sistemi come oggettivi.

---

### 🔬 Chi lavora con questa competenza nel 2030?

**AI ethicist, responsabile IA, data scientist**

L'AI ethicist valuta i sistemi di IA prima del loro deployment per identificare bias, rischi di discriminazione, violazioni della privacy e implicazioni sociali. Non è necessariamente un tecnico di deep learning: deve capire sia la statistica sia il diritto, sia l'ingegneria del software sia le scienze sociali. È una delle professioni in più rapida crescita nel settore tecnologico — ogni grande azienda tech e ogni ente pubblico che usa sistemi IA deve avere processi di valutazione etica.

Il data scientist costruisce i modelli, analizza i dati, valuta le prestazioni dei sistemi. Lavora con Python, librerie di ML (scikit-learn, TensorFlow, PyTorch), e strumenti statistici. La combinazione di competenze tecniche e pensiero critico sui dati è fondamentale.

Dove lavorano: aziende tecnologiche, banche e assicurazioni, sanità, pubblica amministrazione, organizzazioni internazionali (ONU, Commissione Europea), think tank, università.

Competenze chiave che inizia a costruire da qui: pensiero critico sui dati · comprensione del machine learning · etica algortimica · valutazione dei rischi · comunicazione delle limitazioni

*"La cosa più pericolosa nell'IA non è la macchina che sbaglia. È la macchina che sbaglia e nessuno se ne accorge."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in 🌍 AGISCI.**

---

### ● BASE — Identifico applicazioni IA nella vita quotidiana con guida

**Obiettivo:** identificare e classificare 5 applicazioni di IA presenti nella vita quotidiana, usando il vocabolario tecnico introdotto in 📖 ESPLORA.

**Elenco applicazioni da cui scegliere 5:**
Spotify (raccomandazione musicale), Google Maps (previsione tempi di percorrenza), Instagram/TikTok (ordinamento del feed), Gmail (filtro spam), autocomplete della tastiera dello smartphone, Face ID dello smartphone, Google Translate, Siri/Assistente Google, un sistema di riconoscimento facciale nei negozi, il sistema di raccomandazione di Netflix.

Per ogni applicazione:
1. Qual è il suo obiettivo? (cosa predice o classifica)
2. Che tipo di apprendimento usa probabilmente? (supervisionato/non supervisionato/per rinforzo)
3. Che dati usa per apprendere?
4. Quale potrebbe essere un suo errore tipico?
5. Quale bias potrebbe avere?

Usa questa tabella (compilala con frasi brevi, non serve scrivere paragrafi):

| App/Sistema | Obiettivo | Tipo di ML | Dati di addestramento | Errore tipico | Possibile bias |
|---|---|---|---|---|---|
| | | | | | |

---

### ●● INTERMEDIO — Analisi critica di un caso di bias algoritmico

**Scenario:** leggi il riassunto del caso COMPAS (descritto in 📖 ESPLORA). Poi risponde alle domande seguendo l'ordine.

**1. Descrizione del sistema:**
COMPAS è un sistema di machine learning usato in alcuni tribunali americani per stimare la probabilità che un imputato commetta un nuovo reato (recidiva). Il punteggio viene usato come input nelle decisioni di libertà vigilata e condanna.

**2. Il problema rilevato:**
ProPublica ha analizzato 7.000 casi in Florida (2016) e trovato che il sistema classificava i cittadini neri come "ad alto rischio" erroneamente quasi il doppio delle volte rispetto ai cittadini bianchi (28% vs 16% di falsi positivi).

**Domande:**
1. Che tipo di machine learning probabilmente usa COMPAS? (supervisionato, non supervisionato, per rinforzo) — Argomenta la tua risposta.
2. Da dove potrebbero venire i bias che ProPublica ha documentato? Identifica almeno 2 possibili fonti nel processo di addestramento.
3. Chi è responsabile di questo errore? L'algoritmo? Gli ingegneri che lo hanno costruito? I giudici che lo hanno usato? L'azienda che lo ha venduto? Il sistema giudiziario che lo ha acquistato senza valutarlo?
4. Come si potrebbe correggere? Proponi almeno una modifica tecnica e una modifica al processo di uso del sistema.
5. Questo sistema dovrebbe essere vietato, riformato, o mantenuto com'è? Argomenta la tua posizione in 5-7 righe.

---

### ●●● AVANZATO — Progetta un sistema IA con analisi etica integrata

**Brief:** la biblioteca della tua scuola vuole un sistema di raccomandazione che suggerisca libri agli studenti in base ai libri che hanno già letto. L'obiettivo è aumentare il numero di libri letti per studente e diversificare i generi e gli autori letti.

**Il tuo compito:**

**1. Definizione del problema:**
- Cosa deve predire il sistema? (il prossimo libro che lo studente leggerà? Il libro che gli piacerà di più? Il libro più educativamente utile?)
- Come si misura il successo? (lo studente legge il libro? Lo finisce? Lo valuta positivamente?)
- Sono queste definizioni di successo compatibili con l'obiettivo di diversificare le letture?

**2. Dataset necessario:**
- Di quali dati hai bisogno per addestrare il sistema?
- Chi ha accesso a questi dati?
- Quali dati sarebbe problematico raccogliere (privacy, consenso)?
- Come si gestisce il cold start problem: uno studente nuovo che non ha ancora letto nulla?

**3. Tipo di apprendimento:**
- Quale tipo di ML useresti? Argomenta.
- Quali sono i rischi di un sistema basato su apprendimento supervisionato (impara dalle preferenze passate) per l'obiettivo di diversificare le letture?

**4. Analisi dei rischi di bias:**
- Un sistema che impara dalle preferenze passate tende a raccomandare sempre più dello stesso tipo. Come eviti il "bubble effect" (bolla di filter)?
- Se gli autori classici nel dataset sono prevalentemente europei bianchi maschi, come assicuri che il sistema raccomandi anche autori di altri generi, etnie, culture?
- Chi ha il controllo finale sulla lista di libri raccomandabili?

**5. Proposta di governance:**
- Chi ha accesso ai dati di lettura degli studenti? Solo il bibliotecario? I docenti? Il preside?
- Come si garantisce che i dati non vengano usati per altri scopi (es. valutazione degli studenti)?
- Come puoi permettere agli studenti di ignorare il sistema senza penalizzazioni?

**Consegna:** relazione di 2-3 pagine strutturata secondo le 5 sezioni. Non è richiesto codice — è richiesto pensiero progettuale e critico.

---

## 🌍 SPERIMENTA — avanzato

### Esperimento reale: testa un LLM e costruisci la tua valutazione

**Il protocollo completo:**

**Fase 1 — Setup:** scegli un LLM accessibile (ChatGPT, Gemini, Claude, o altro). Scegli un dominio di verifica che conosci bene o su cui hai fonti affidabili (storia italiana, biologia, fisica, musica — qualunque argomento su cui puoi verificare i fatti).

**Fase 2 — Poni 5 domande factual** al LLM, di difficoltà crescente:
- 2 domande su fatti ben noti (es. "Chi ha composto la Nona Sinfonia?")
- 2 domande su fatti meno noti (es. "Quanti soldati italiani morirono nella Prima Guerra Mondiale?")
- 1 domanda su un argomento di nicchia che conosci bene

**Fase 3 — Verifica sistematica:** per ogni risposta, verifica ogni affermazione fattuale. Usa almeno due fonti indipendenti. Compila la tabella di verifica (come in 🔍 OSSERVA).

**Fase 4 — Test di allucinazione deliberata:** poni una domanda su un evento o una persona immaginaria che suona plausibile (es. "Qual è stato il contributo dello scienziato italiano Marco Bertoni alla teoria della relatività?"). Osserva cosa fa il sistema.

**Fase 5 — Test di bias:** poni la stessa domanda in due versioni diverse che differiscono solo nel genere o nell'etnia del soggetto (es. "Elenca 5 grandi architetti del XX secolo" — poi "Elenca 5 grandi architetti donne del XX secolo" — poi "Elenca 5 grandi architetti africani del XX secolo"). Confronta le risposte. Cosa osservi?

**Relazione finale (1-2 pagine):** quantifica gli errori trovati, descrivi il pattern di allucinazione se presente, analizza i differenziali di risposta nel test di bias. Conclude con: per quale tipo di compiti useresti questo LLM? Per quali non lo useresti mai? Come modificheresti il tuo workflow di studio o lavoro per integrarl0 in modo critico?

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | ● Base — Sufficiente | ●● Intermedio — Buono | ●●● Avanzato — Ottimo | ●●●● Eccellente |
|---|---|---|---|---|
| **1. Comprensione dei principi IA** | Descrive correttamente almeno 2 concetti (ML, bias, allucinazione) | Usa correttamente almeno 4 concetti con esempi specifici dell'app analizzata | Spiega come i meccanismi tecnici (addestramento, dataset, parametri) producono i comportamenti osservati | Collega i meccanismi tecnici alle implicazioni etiche e sociali con argomentazione causale precisa |
| **2. Capacità di verifica** | Identifica 1-2 affermazioni dell'app/IA da verificare | Verifica sistematicamente le affermazioni e documenta il processo | Verifica le affermazioni, classifica gli errori per tipo (allucinazione, approssimazione, bias) e valuta la gravità | Costruisce un metodo replicabile di verifica critica adattato all'app specifica, con spiegazione di perché certi errori sono più gravi di altri |
| **3. Analisi dei bias** | Nomina che i bias esistono in modo generico | Identifica un bias specifico nell'app analizzata con un esempio concreto | Analizza come il bias si è generato (dataset, design, obiettivo ottimizzato) e chi ne è danneggiato | Propone una misura concreta e fattibile per ridurre il bias identificato, con consapevolezza dei trade-off |
| **4. Posizione argomentata** | Esprime una valutazione ("l'IA è buona/cattiva") senza argomentazione | Esprime una valutazione con almeno un argomento a supporto e uno contrario | Costruisce una posizione argomentata che distingue tra usi accettabili e problematici dello stesso sistema | La posizione è supportata da evidenze specifiche, considera le prospettive di stakeholder diversi, e propone condizioni concrete di utilizzo responsabile |

---

### Lo scenario

Sei un consulente di una piccola associazione che promuove l'uso critico della tecnologia nelle scuole. Ti è stato chiesto di preparare una **scheda di analisi critica** per tre applicazioni IA comuni tra studenti — da distribuire come materiale didattico.

---

### La consegna

**Scegli 3 app con IA che usi (o che conosci) nella vita quotidiana.** Per ciascuna, compila una scheda critica strutturata.

Esempi di app: Spotify, TikTok, Instagram, Google Maps, Google Translate, Snapchat (filtri), un assistente vocale (Alexa, Siri, Google Assistant), ChatGPT o altri LLM, un sistema di autocomplete del testo, un filtro di contenuto delle piattaforme social.

**Per ogni app, compila questa scheda:**

---

**SCHEDA APP N.° ____**

**Nome dell'app:** ___________________________________
**Funzione principale:** ________________________________

**1. Cosa impara l'IA da te?**
Che dati raccoglie, come li usa per migliorare le sue previsioni su di te.
*(2-3 frasi)*

**2. Quale decisione prende per te?**
Che cosa l'IA sceglie o filtra o ordina — e come influenza il tuo comportamento.
*(2-3 frasi)*

**3. Hai verificato un'affermazione o raccomandazione di questa app?**
Descrivi un caso concreto in cui hai (o potresti) verificare se quello che l'app ti propone è accurato o neutrale.
*(2-3 frasi)*

**4. Quale bias potrebbe avere questo sistema?**
Chi è favorito e chi è svantaggiato dalle sue raccomandazioni? Cosa manca nel dataset di addestramento?
*(2-3 frasi)*

**5. Rischio etico principale:**
Privacy? Manipolazione? Discriminazione? Dipendenza?
*(1 frase precisa con spiegazione)*

**6. Condizioni per un uso responsabile:**
A quali condizioni useresti questa app senza preoccupazioni? A quali condizioni la eviteresti?
*(2-3 frasi)*

---

*(Ripeti per tutte e 3 le app)*

**Conclusione (10-15 righe):** dopo aver analizzato le tre app, esprimi una posizione argomentata: l'IA che usi ogni giorno è complessivamente a tuo vantaggio o a tuo svantaggio? Distingui tra vantaggi per te come individuo e rischi per la società. Includi almeno un'azione concreta che potresti fare per ridurre la tua esposizione ai rischi che hai identificato.

---

### Materiali che ti servono

- Le app da analizzare (già sul tuo telefono o computer)
- Questa scheda (stampabile dal QR code → o fotocopiabile dal libro)
- Accesso a internet per verificare le affermazioni factual
- Facoltativo: accesso a un LLM per testare direttamente le allucinazioni

---

### 🎯 Badge SDG 9, 10, 16 — Innovazione, Uguaglianza, Giustizia

Analizzare criticamente le app IA che usi ogni giorno significa esercitare concretamente la cittadinanza digitale in relazione a tre SDG:
- SDG 9 (innovazione): comprendere come funziona la tecnologia che usi.
- SDG 10 (ridurre le disuguaglianze): identificare come i sistemi IA possono amplificare le disuguaglianze esistenti.
- SDG 16 (pace, giustizia, istituzioni solide): capire come le decisioni algoritmiche impattano la giustizia.

---

### 🤖 Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona per chiedere all'AI Coach: *"Cosa sono i token in un LLM?"*, *"Come funziona il reinforcement learning?"*, *"Qual è la differenza tra bias nei dati e bias nell'algoritmo?"*

**Importante per questa MC:** verifica sempre le risposte dell'AI Coach. Se il sistema dice qualcosa che non corrisponde a quello che hai letto qui o che non riesci a verificare altrove, è una buona occasione per segnalarlo. Identificare le allucinazioni di un sistema IA mentre studi i sistemi IA è un esercizio meta-cognitivo molto utile.

---

### 🪞 Metacognizione — Rifletti sul tuo lavoro

**1. Sorpresa**
C'è un'app che usi ogni giorno e su cui le tue idee su come funziona sono cambiate dopo questa MC? Descrivi cosa pensavi prima e cosa pensi adesso.

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Difficoltà nella verifica**
Hai trovato difficile verificare un'affermazione dell'app analizzata? Quali fonti hai cercato? Come hai valutato l'affidabilità delle fonti che hai trovato?

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa — obbligatorio**
Hai trovato un caso in cui il sistema IA che analizzavi aveva torto in modo evidente? Oppure un caso in cui sembrava avere ragione ma la risposta era parziale o fuorviante? Descrivi cosa hai trovato, come lo hai verificato e cosa cambia nel tuo uso di quella app.

*Se scrivi "non ho trovato errori" significa che non hai fatto una verifica sistematica — questa domanda richiede che tu abbia cercato attivamente almeno un caso di errore o imprecisione.*

*Scrivi 3-4 righe:* ___________________________________________

---

**4. Posizione personale sull'IA**
Dopo questa MC, come descriveresti la tua posizione sull'intelligenza artificiale? Scegli tra queste (o costruisci la tua):
- "È uno strumento neutro — dipende da come la usi"
- "È pericolosa — i rischi superano i benefici"
- "È utile ma richiede consapevolezza critica per usarla bene"
- "Non so ancora — ho capito che è più complessa di quanto pensassi"

Argomenta la tua posizione in 4-5 righe con riferimento ad almeno un esempio concreto dall'analisi che hai fatto.

*Scrivi 4-5 righe:* ___________________________________________

---

### 🔗 Collegamento con UDA-3 — "Scuola Smart" e con MC-INF-3-02

Il sistema di raccomandazione della biblioteca che hai progettato in 🔬 SPERIMENTA Avanzato è un caso di studio diretto per MC-INF-3-02 (machine learning: come le macchine imparano dai dati). In quella MC svilupperai la parte tecnica del modello — addestramento su dataset reale, valutazione delle metriche, analisi delle prestazioni per sottogruppi.

L'analisi etica che hai prodotto in questa MC è il complemento necessario alla competenza tecnica di INF-3-02: costruire bene un sistema IA senza capire le sue implicazioni produce strumenti potenti ma potenzialmente dannosi. Costruire bene e pensare criticamente produce tecnologia responsabile.

---

## APPENDICE — Tech in English

| Italiano | English | Come si legge |
|---|---|---|
| intelligenza artificiale | artificial intelligence (AI) | /ˌɑːtɪˈfɪʃəl ɪnˈtelɪdʒəns/ |
| apprendimento automatico | machine learning (ML) | /məˈʃiːn ˈlɜːnɪŋ/ |
| rete neurale | neural network | /ˈnjʊərəl ˈnetwɜːk/ |
| distorsione algoritmica | algorithmic bias | /ˌælɡəˈrɪðmɪk baɪəs/ |
| allucinazione | hallucination | /həˌluːsɪˈneɪʃən/ |

> *In English we say: "Always verify the output of a generative AI system — hallucinations are frequent and hard to detect without independent sources."*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- 📖 ESPLORA: la storia dell'IA va come timeline visiva orizzontale (1950-2024) con 6 nodi principali.
- Il confronto supervised/unsupervised/reinforcement learning va in tabella a tre colonne con esempio per ognuno.
- Il Box T8 (IA critica, 4 regole) va come box prominente con bordo colorato — è obbligatorio in tutte le MC DIG livello A.
- Il caso Gender Shades e il caso COMPAS vanno come due riquadri affiancati "Caso reale".
- Zona 4b e 🌍 AGISCI: le schede di analisi app sono fotocopiabili — pagine separate.

**Per l'agente generatore asset:**
- Visual richiesto 1: mappa delle applicazioni IA quotidiane (classificate per tipo: raccomandazione, riconoscimento, generazione, predizione) con esempi concreti per categoria.
- Visual richiesto 2: schema semplificato rete neurale — input layer, hidden layers, output layer con esempio di classificazione di immagine.
- Visual richiesto 3: infografica AI Act europeo — piramide del rischio (inaccettabile / alto / limitato / minimo) con esempi per ogni livello.
- Hook audio: disponibile in MC-DIG-3-02_hook-script.md.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025)*
*Livello Advanced (A) — struttura 5 zone + Zona 4b · libro-ready*
*Box T8 (IA critica) presente e obbligatorio — conformità LINEE_GUIDA_LINGUISTICHE.md*
