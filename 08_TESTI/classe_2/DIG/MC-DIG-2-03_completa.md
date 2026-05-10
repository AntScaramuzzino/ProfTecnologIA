# MC-DIG-2-03 — Organizzare il computer: usarlo bene ogni giorno
**Area:** Digitale · **Anno:** 2ª · **Livello DigComp:** Intermediate (I)
**SDG:** 9 — Industria, innovazione e infrastrutture · **Fonte:** originale
**Struttura:** 4 pagine (spread avanzato) · Versione contenuto completo per editing

> **Nota editoriale DIG/INF:** questa MC tratta la stessa area tematica di MC-INF-2-01 (il sistema operativo) ma da una prospettiva opposta. INF-2-01 spiega *come funziona* il sistema operativo: processi, memoria, kernel. Questa MC insegna a *usarlo bene*: come organizzare i file, gestire i programmi, configurare la privacy, fare backup. Sono competenze diverse. Puoi avere un meccanico esperto che non sa guidare, e un pilota esperto che non sa smontare il motore. Qui impari a guidare bene.

---

## ⚡ INNESCA

**Scenario:**

Marco, 13 anni, deve consegnare la relazione di scienze domani mattina. Apre il computer e cerca il file. Non lo trova. Cerca ancora. Apre la cartella "Documenti": ci sono 47 file, tutti con nomi come "relazione", "relazione2", "relazione DEFINITIVA", "relazione DEFINITIVA vera", "relazione DEFINITIVA vera2 usare questa". Non ricorda quale sia l'ultima versione. Apre il primo: è di ottobre. Apre il quarto: è di novembre ma mancano tre sezioni. Cerca anche sul desktop: 23 file sparsi, nessuno con una data nel nome. Prova a cercare nella cartella dei download: altri 11 file con nomi simili.

Passa venti minuti a cercare prima di trovare il file giusto. Ma non è finita: apre il documento e si accorge che l'ultima modifica risale a due giorni fa. Nel frattempo aveva continuato a lavorare su un altro file — quello sbagliato.

Questa storia non è un caso estremo. È la norma. Se hai mai perso un file, avuto il computer lento senza sapere perché, o temuto che si rompesse e perdessi tutto il lavoro — questa MC è per te.

**Domanda di avvio:**
Quanti file hai sul desktop in questo momento? Se il tuo computer si rompesse stasera, cosa perderesti per sempre?

---

## 📖 ESPLORA

### Usare bene il computer: una competenza che si impara

Aprire un'applicazione e cliccare su "salva" è usare il computer. Ma usarlo *bene* è un'altra cosa. Significa che i tuoi file sono trovabili in 10 secondi, che non perdi mai un lavoro importante, che il computer funziona velocemente anche dopo anni d'uso, che sai cosa stai condividendo e con chi. Queste non sono abilità che si acquisiscono automaticamente: si imparano, si praticano, si migliorano.

Questa MC è organizzata attorno a sei aree pratiche: organizzare i file, nominare i file in modo intelligente, fare backup, gestire i programmi installati, usare il cloud in modo consapevole, e configurare la privacy del browser. Ognuna risolve un problema reale.

---

### 1. Organizzare i file: la struttura che ti fa trovare tutto

Il file system del tuo computer è come una biblioteca. Se i libri sono ammucchiati a caso sul pavimento, puoi avere anche centomila libri — non troverai mai quello che cerchi. Se invece sono organizzati per argomento, autore e anno, trovare il libro giusto richiede trenta secondi.

La struttura di cartelle che funziona meglio per uno studente di seconda media segue questo schema:

```
Documenti/
├── Scuola/
│   ├── 2025-2026/
│   │   ├── Italiano/
│   │   ├── Matematica/
│   │   ├── Scienze/
│   │   ├── Tecnologia/
│   │   └── Storia/
│   └── 2024-2025/  (archivio anno precedente)
├── Progetti personali/
├── Download-da-ordinare/  (cartella temporanea, si svuota ogni settimana)
└── Archivio/
```

Il principio è semplice: ogni file deve avere *un posto solo* in cui puoi trovarlo, e quel posto deve essere prevedibile. Se metti le cose sempre nello stesso posto, dopo un po' non devi nemmeno pensarci: la mano va lì automaticamente.

Tre regole che cambiano tutto:

**Regola 1 — Un posto per ogni cosa.** Non tenere mai file "temporaneamente" sul desktop o nella cartella Download. Il temporaneo diventa permanente in ventiquattro ore. Usa una cartella "Download-da-ordinare" come punto di transito: ogni settimana la svuoti, spostando i file nelle cartelle giuste o cancellando quello che non serve.

**Regola 2 — Niente cartelle nidificate oltre il terzo livello.** Se devi cliccare più di tre volte per arrivare a un file, la struttura è troppo profonda. Documenti → Scuola → Tecnologia è già tre livelli: aggiungere sottocartelle per ogni compito è eccessivo.

**Regola 3 — Archivia regolarmente.** A fine anno scolastico, sposta la cartella dell'anno in "Archivio". Non cancellare — non sai mai se ti servirà di nuovo. Ma non tenerla in primo piano dove distrae dalla ricerca dei file attuali.

---

### 2. Nominare i file: la convenzione che ti salva la vita

Il nome di un file è la prima informazione che hai su quel file. Se il nome è "documento1", non hai nessuna informazione. Se il nome è "2026-03-15_tecnologia_relazione-energia_v02", sai esattamente quando è stato creato, a quale materia appartiene, di cosa tratta, e che è la seconda versione.

La convenzione di naming professionale segue questo formato:

```
[ANNO-MESE-GIORNO]_[materia]_[argomento]_[versione opzionale]
```

Esempi concreti:

- `2026-03-15_tecnologia_relazione-energia_v01.docx`
- `2026-03-15_tecnologia_relazione-energia_v02.docx`
- `2026-03-20_scienze_tesina-fotosintesi.docx`
- `2026-04-01_matematica_esercizi-frazioni.pdf`

Perché la data va per prima, nel formato ANNO-MESE-GIORNO? Perché così i file si ordinano automaticamente in ordine cronologico quando li visualizzi per nome. "2026-03" viene prima di "2026-04". "2025-11" viene prima di "2026-01". Se scrivi la data come "15-03-2026", il file finisce in mezzo a "15-01-2026" e "15-04-2026" — ordine inutile.

Perché usare il trattino basso tra le sezioni e il trattino normale all'interno? Perché il trattino basso è visivamente distinto e fa da separatore tra blocchi di informazione. "relazione-energia" è un'unica unità di significato; "tecnologia_relazione-energia" mostra chiaramente dove finisce la materia e inizia l'argomento.

Tre cose da non fare mai nel nome di un file:

- Non usare spazi (su alcuni sistemi creano problemi nei percorsi file)
- Non usare caratteri speciali come `/ \ : * ? " < > |` (sono riservati dal sistema operativo)
- Non usare "finale", "definitivo", "usare questo" — tra sei mesi non ricorderai finale rispetto a cosa

> **Il problema del "documento finale VERO DEFINITIVO 3"** è talmente comune da avere un nome tra i programmatori: si chiama "final syndrome". Succede quando si modifica un file senza avere un sistema di versioning. La soluzione è semplice: usa sempre `_v01`, `_v02`, `_v03`. Quando sei davvero soddisfatto della versione finale, rinominala togliendo il numero di versione — o aggiungi `_CONSEGNATO` con la data della consegna.

---

### 3. Backup: la regola 3-2-1

Ogni anno, migliaia di studenti perdono settimane di lavoro perché il computer si è rotto, è caduto nell'acqua, è stato rubato, o ha avuto un problema tecnico. Non è una questione di "se succederà" — è una questione di "quando succederà". I dischi rigidi si rompono. I computer vengono rubati. I file vengono cancellati per errore.

La **regola 3-2-1** è lo standard professionale per non perdere mai nulla di importante:

- **3 copie** del file (l'originale + 2 backup)
- **2 supporti diversi** (es. il disco interno del computer + un disco esterno)
- **1 copia fuori sede** (es. su cloud, così se brucia la casa non perdi tutto)

Per uno studente di seconda media, una versione praticabile della regola 3-2-1 è:

1. File sul computer (copia principale)
2. File su una chiavetta USB o disco esterno (copia locale)
3. File su Google Drive, iCloud o OneDrive (copia remota)

Il backup deve essere *automatico* o non viene fatto. Se devi ricordarti manualmente di copiare i file ogni sera, lo dimenticherai esattamente la sera prima che il computer si rompa. I sistemi operativi moderni hanno strumenti di backup integrati:

- **Windows:** "Cronologia file" (File History) — fa backup automatico su disco esterno ogni ora
- **macOS:** Time Machine — stessa cosa, ancora più semplice da configurare
- **Cloud automatico:** Google Drive e OneDrive hanno app desktop che sincronizzano automaticamente una cartella scelta

La configurazione richiede venti minuti la prima volta. Poi funziona da sola.

> **Quanto spesso fare backup?** Dipende da quanto lavori riesci a permetterti di perdere. Se lavori un'ora al giorno e fai backup settimanale, nel caso peggiore perdi cinque giorni di lavoro. Se fai backup giornaliero automatico, perdi al massimo un giorno. Per i file importanti (tesi, progetti lunghi), il cloud in tempo reale è la scelta migliore: ogni modifica viene salvata in remoto entro pochi secondi.

---

### 4. Gestire i programmi: installazione, aggiornamenti e pulizia

Ogni programma che installi sul computer occupa spazio sul disco, consuma risorse (anche quando non è aperto, spesso parte in background), e può rallentare il sistema.

**Installare un programma:** scarica sempre i programmi dal sito ufficiale del produttore o dall'app store del sistema operativo (Microsoft Store su Windows, App Store su macOS). Non scaricare mai programmi da siti di "download gratuiti" che offrono versioni "craccate" di software a pagamento: il 90% dei casi il programma contiene malware che si installa silenziosamente insieme al software che volevi.

Prima di installare qualcosa, chiediti: lo uso davvero? Un programma installato e non usato è solo un peso. La regola pratica: se non l'hai usato nei tre mesi successivi all'installazione, probabilmente non ti serve — disinstallalo.

**Aggiornare i programmi:** gli aggiornamenti non servono solo ad aggiungere funzionalità nuove. La maggior parte degli aggiornamenti corregge *vulnerabilità di sicurezza* — falle che i criminali informatici possono usare per entrare nel tuo computer. Rimandare gli aggiornamenti per settimane è come lasciare una finestra rotta nel tuo appartamento: prima o poi qualcuno ci entra.

Attiva gli aggiornamenti automatici dove possibile. Il sistema operativo, il browser e l'antivirus sono i più critici da tenere aggiornati.

**Disinstallare programmi:** non basta trascinare l'icona nel cestino. Su Windows, usa "Aggiungi o rimuovi programmi" nelle impostazioni (o il pannello di controllo). Su macOS, usa il tasto destro sull'app nella cartella Applicazioni e scegli "Sposta nel cestino" — oppure usa un'app apposita come AppCleaner che rimuove anche i file di configurazione residui.

> **Box DIG↔INF: usare bene vs. capire come funziona**
>
> Sai già che il sistema operativo gestisce i processi in background, alloca la memoria RAM alle applicazioni, e organizza i file nel file system — se hai studiato MC-INF-2-01, conosci questi meccanismi dal punto di vista informatico.
>
> Qui stiamo imparando qualcosa di diverso: *cosa fare* concretamente per sfruttare bene queste capacità. Sapere che il SO gestisce i processi (INF) ti dà le basi per capire *perché* aprire troppe applicazioni contemporaneamente rallenta il computer — e quindi *decidere* di chiudere quelle che non usi (DIG). Sapere che il SO usa un file system gerarchico (INF) ti dà le basi per costruire una struttura di cartelle efficiente (DIG).
>
> Le due competenze si potenziano a vicenda: più capisci come funziona il sistema, meglio riesci a usarlo. Ma sono competenze distinte — un esperto utente non è necessariamente un informatico, e un informatico non è necessariamente un esperto utente.

---

### 5. Cloud storage: comodità e rischi

Il cloud storage — Google Drive, iCloud, OneDrive, Dropbox — è uno degli strumenti più utili per uno studente moderno. I tuoi file sono accessibili da qualsiasi dispositivo, si aggiornano automaticamente, e funzionano da backup. Ma vale la pena capire come funziona davvero — non solo come usarlo.

**Come funziona:** quando carichi un file su Google Drive, quel file non è nel tuo computer. È nei server di Google, in data center distribuiti in tutto il mondo. Quando apri Drive da un altro dispositivo, stai scaricando una copia di quel file da quei server. La "sincronizzazione" significa che ogni modifica che fai sul computer viene inviata ai server e poi propagata agli altri dispositivi collegati.

**Differenze pratiche tra i servizi principali:**

| Servizio | Spazio gratuito | Integrato con | Problema principale |
|----------|----------------|---------------|---------------------|
| Google Drive | 15 GB | Google Docs, Gmail | Google ha accesso ai tuoi file per pubblicità mirata |
| iCloud | 5 GB (poi a pagamento) | Apple devices | Funziona bene solo nell'ecosistema Apple |
| OneDrive | 5 GB | Microsoft 365 | Si integra meglio con Windows |
| Dropbox | 2 GB | Qualsiasi sistema | Poco spazio gratuito |

**Una domanda importante: cosa succede ai tuoi file se chiudi l'account?**

Se elimini il tuo account Google, tutti i file su Drive vengono cancellati entro un tempo variabile (di solito qualche settimana). Se Google chiude un servizio o cambia i termini (è già successo con Google Photos, Google+, molti altri), le tue opzioni dipendono da quanto tempo hai per scaricare i dati.

La lezione pratica è questa: il cloud è ottimo per la comodità e per i backup, ma non deve essere l'*unica* copia dei tuoi file importanti. La regola 3-2-1 vale anche per i file su cloud: mantieni sempre almeno una copia locale sul tuo computer o su un disco esterno.

**Condivisione consapevole:** quando condividi un file su Drive con "chiunque abbia il link", quel file diventa accessibile a chiunque ottenga quel link — anche chi non conosci. Per i compiti scolastici, preferisci sempre la condivisione con persone specifiche (tramite email) piuttosto che il link pubblico.

---

### 6. Privacy del browser: cosa traccia e cosa no

Il browser — Chrome, Firefox, Safari, Edge — è probabilmente il programma che usi di più. Capire cosa registra e come funzionano le impostazioni di privacy ti permette di fare scelte consapevoli.

**I cookie** sono piccoli file di testo che i siti web salvano nel tuo browser per ricordare informazioni su di te: che sei già loggato, cosa hai messo nel carrello, quali preferenze hai impostato. Sono utili — senza cookie dovresti fare login ogni volta che riapri un sito. Ma esistono anche i **cookie di terze parti** (third-party cookies): file salvati da aziende diverse dal sito che stai visitando, che ti seguono su siti diversi per costruire un profilo dei tuoi interessi e mostrarti pubblicità mirata. Il sito di notizie che stai leggendo può contenere cookie di venti aziende pubblicitarie diverse che tracciano ogni pagina che visiti.

Chrome e Safari stanno progressivamente eliminando i cookie di terze parti. Firefox li blocca già di default. Puoi verificare e gestire i cookie nelle impostazioni del browser (cerca "Cookie e altri dati dei siti" in Chrome, "Privacy e sicurezza" in Firefox).

**La cronologia** è l'elenco di tutti i siti che hai visitato. È salvata localmente sul tuo computer. Non è accessibile a Google o ad altri (a meno che tu non sia loggato in Chrome con il tuo account Google, in quel caso la cronologia viene sincronizzata). Chi usa lo stesso computer può vedere la tua cronologia. Se vuoi che una navigazione non sia registrata, usa la **modalità privata** (o modalità in incognito).

**Cosa fa la modalità privata — e cosa non fa:**

La modalità privata (Ctrl+Shift+N in Chrome, Ctrl+Shift+P in Firefox):
- Non salva la cronologia di navigazione sul dispositivo
- Non salva i cookie dopo aver chiuso la finestra
- Non salva le password inserite
- Non salva i file che hai scaricato nella cronologia download

La modalità privata *non* ti rende anonimo. Il tuo fornitore di rete (il provider internet di casa, la rete scolastica) vede comunque quali siti visiti. I siti che visiti vedono il tuo indirizzo IP. Se sei loggato su un account Google o Facebook, quelle aziende tracciano comunque la tua attività.

**Impostazioni di accessibilità del browser:** se fai fatica a leggere il testo su schermo, puoi aumentare la dimensione base del testo del browser (impostazioni → Aspetto → Dimensione carattere) senza dover fare zoom su ogni pagina. Puoi anche aumentare il contrasto o attivare una modalità ad alto contrasto nelle impostazioni di accessibilità del sistema operativo. Queste impostazioni non cambiano solo la tua esperienza: ricordano che progettare per l'accessibilità aiuta tutti — anche chi non ha disabilità, ma legge in condizioni di luce difficile o su schermo piccolo.

---

### Caso studio: Giulia e il professionista

Giulia, seconda media, ha questa struttura di file:

```
Desktop: 34 file sparsi
Documenti: 2 cartelle ("roba" e "cose importanti")
Download: 847 file (mai svuotata)
Foto: 3.200 foto non organizzate
Ultima volta che ha fatto backup: mai
```

Quando deve trovare un file, Giulia usa il motore di ricerca del sistema operativo e prega che funzioni.

Marco Ferretti, graphic designer professionista, ha questa struttura:

```
Documenti/
├── Clienti/
│   ├── 2026/
│   │   ├── AziendaAlpha/
│   │   │   ├── brief/
│   │   │   ├── lavori/
│   │   │   │   ├── 2026-03-10_logo_v01.ai
│   │   │   │   ├── 2026-03-12_logo_v02.ai
│   │   │   │   └── 2026-03-15_logo_CONSEGNATO.ai
│   │   │   └── fatture/
│   └── 2025/ (archivio)
└── Personale/
```

Backup: Time Machine su disco esterno (automatico ogni ora) + iCloud Drive (automatico in tempo reale).

Trovare un file: 15 secondi al massimo.

La differenza non è che Marco è più bravo con i computer. È che ha imparato un sistema — e lo usa sempre. Giulia non ha mai imparato il sistema. Il risultato è la "relazione DEFINITIVA vera2 usare questa".

Cosa cambia davvero tra i due approcci? Tre cose:
1. **Il tempo perso** — Giulia perde in media 15-20 minuti a sessione cercando file. In un anno scolastico sono ore.
2. **Lo stress** — sapere dove sono le cose abbassa l'ansia da consegna.
3. **La sicurezza** — Marco non perderà mai un progetto, perché ha tre copie. Giulia potrebbe perdere tutto stanotte.

---

> **Collegamento STEM — Matematica:**
> La struttura a cartelle del file system è un **albero** nel senso matematico: una struttura gerarchica in cui ogni nodo (cartella) ha un solo nodo padre e può avere zero o più nodi figli (sottocartelle o file). La profondità di un file si misura contando i livelli dall'alto: Documenti/Scuola/Tecnologia/relazione.docx ha profondità 3. Gli algoritmi di ricerca nel file system sono gli stessi usati per esplorare alberi matematici: prima in profondità (depth-first) o prima in ampiezza (breadth-first).

> **Collegamento STEM — Scienze:**
> I dischi SSD (Solid State Drive) che troviamo nei computer moderni non hanno parti meccaniche mobili: memorizzano i dati come cariche elettriche in celle di silicio. I vecchi HDD (Hard Disk Drive) usavano un piatto magnetico rotante: un braccio meccanico si spostava per leggere e scrivere i dati, esattamente come il braccio di un giradischi. Gli SSD sono più veloci, più silenziosi e resistono meglio alle cadute — ma si consumano: ogni cella può essere scritta e cancellata un numero limitato di volte (tipicamente tra 1.000 e 10.000 cicli).

---

## 🔍 OSSERVA

### Il caso: come un'azienda gestisce i file rispetto a come lo fai tu

Un'azienda di dieci persone ha esattamente gli stessi problemi di Giulia — moltiplicati per dieci. Tutti creano file, tutti li modificano, a volte più persone lavorano sullo stesso documento contemporaneamente. Senza un sistema, il caos è garantito.

La soluzione professionale si chiama **controllo di versione** (version control). Il sistema più usato al mondo si chiama **Git**. Git registra ogni modifica a ogni file, chi l'ha fatta, quando, e perché. Puoi tornare indietro a qualsiasi versione precedente di qualsiasi file, confrontare due versioni, e capire esattamente cosa è cambiato e perché.

Per i file di testo e codice, Git è la soluzione standard. Per i file di Office (Word, Excel, PowerPoint), Google Docs ha una versione integrata: clicca su "File → Cronologia versioni" e vedi tutte le versioni precedenti del documento, chi ha fatto cosa e quando.

La gestione professionale dei file non è un'ossessione per l'ordine: è una necessità economica. Un'azienda che perde dati o non riesce a trovare un documento importante perde denaro. Un freelance che consegna "la versione sbagliata" del progetto perde un cliente.

Le competenze che stai imparando qui — naming dei file, struttura delle cartelle, backup, versioning — sono le stesse che useranno i tuoi colleghi quando lavorerai, qualunque professione sceglierai.

---

> **Chi lavora con questa competenza nel 2030?**

**DevOps Engineer**

Un DevOps engineer non lavora solo con il codice: lavora con i *sistemi* che fanno funzionare le applicazioni. Gestisce i server (che sono computer come il tuo, ma molto più potenti), automatizza i processi di backup e aggiornamento, si assicura che quando un server si rompe i dati non vadano persi e il servizio riparta in pochi minuti.

Concretamente: configura sistemi di backup automatici per dati critici di aziende con milioni di utenti, gestisce la struttura dei file sui server, automatizza gli aggiornamenti dei sistemi operativi per garantire che le vulnerabilità vengano corrette senza interruzioni di servizio.

Le competenze che inizia a costruire da qui: organizzazione dei file system, comprensione del SO, backup e ridondanza dei dati, gestione dei permessi.

*"La differenza tra un sistema che funziona e uno che crolla non è quasi mai il codice — è la gestione dell'infrastruttura."*

Dove lavora: aziende tech, startup, banche, ospedali — ovunque ci siano sistemi digitali critici.
Livello di domanda nel 2030 in Europa: altissimo (carenza stimata di 500.000 profili).

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### BASE — Organizzo e controllo

**Obiettivo:** analizzare la situazione attuale del computer (o di un dispositivo che usi) e identificare almeno tre problemi concreti di organizzazione.

**Cosa fare:**

1. Apri la cartella "Documenti" (o "Download") del computer che usi. Conta quanti file ci sono direttamente nella cartella principale, senza aprire sottocartelle.

2. Trova il file più vecchio presente nella cartella. Quando è stato creato? Serve ancora?

3. Cerca nella cartella un file con "finale" o "definitivo" nel nome. Quante versioni esistono?

4. Apri il browser che usi. Cerca nelle impostazioni la sezione "Cookie" o "Privacy". Quanti cookie ci sono salvati in questo momento?

5. Compila questa scheda diagnostica:

| Voce | Cosa hai trovato | Problema identificato |
|------|------------------|-----------------------|
| File nella cartella principale | (numero) | |
| File più vecchio | (data) | |
| Versioni dello stesso file | (numero trovato) | |
| Cookie salvati | (numero approssimativo) | |
| Ultimo backup fatto | (data o "mai") | |

6. Scegli *uno* dei problemi identificati. Scrivi in 3-4 righe come lo risolveresti, usando le informazioni di questa MC.

> **Attenzione:** non cancellare nulla senza avere certezza che non serva. L'obiettivo di questo livello è analizzare, non modificare.

---

### INTERMEDIO — Costruisco il mio sistema

**Obiettivo:** progettare e implementare una struttura di cartelle funzionale per il proprio lavoro scolastico, e applicare la convenzione di naming a file esistenti.

**Parte A — Struttura cartelle:**

1. Crea sul computer (o su Drive, se preferisci lavorare su cloud) la struttura di cartelle descritta nella Zona 2, adattata alla tua situazione reale: inserisci le materie che studi veramente, aggiungi cartelle per attività extra-scolastiche se le hai.

2. Sposta almeno 10 file esistenti nelle cartelle appropriate. Per ogni file spostato, verifica che il nome rispetti la convenzione [data]_[materia]_[argomento]. Rinomina quelli che non la rispettano.

3. Crea un file di testo chiamato `00_README.txt` nella cartella principale "Scuola". Scrivi dentro una descrizione della tua struttura in 5-6 righe: spiega come è organizzata, quali criteri hai usato, e dove va un file se non sai esattamente in quale cartella metterlo.

**Parte B — Piano di backup:**

4. Rispondi a queste domande per iscritto (3-4 righe per risposta):
   - Qual è il file più importante che hai sul computer in questo momento? Perché?
   - Se il computer si rompesse stasera, cosa perderesti?
   - Qual è la soluzione di backup più pratica per la tua situazione? (considera: hai un disco esterno? Quant'è il piano gratuito di Drive che usi?)

5. Configura *almeno uno* strumento di backup automatico: Google Drive con sincronizzazione automatica, o Time Machine su Mac, o Cronologia file su Windows. Documenta i passaggi che hai seguito con uno screenshot.

> **Verifica:** chiedi a un compagno di trovare un file specifico nella tua struttura di cartelle, partendo dalla cartella principale. Ci riesce in meno di un minuto senza il tuo aiuto?

---

### AVANZATO — Analizzo, confronto, miglioro

**Scenario:** sei il responsabile tecnico di un gruppo di quattro studenti che sta lavorando a un progetto pluridisciplinare lungo due mesi. Il gruppo deve produrre: una relazione scritta, una presentazione, un video di due minuti, e una serie di immagini. Devono poter lavorare contemporaneamente, sapere sempre qual è la versione più aggiornata di ogni file, e non perdere nulla.

**Il tuo compito:**

1. **Progetta il sistema di gestione file del gruppo.** Crea la struttura di cartelle su Google Drive (o equivalente), definisci le convenzioni di naming per ogni tipo di file (documento, presentazione, video, immagine), e scrivi un documento "Regole del gruppo" di una pagina che spiega il sistema a tutti i membri.

2. **Analizza un sistema che non funziona.** Guarda questa situazione reale:
   - Riccardo lavora su "relazione.docx" sul suo computer
   - Sofia lavora su "relazione_mia_versione.docx" sul suo computer
   - Entrambi mandano la loro versione su WhatsApp al gruppo
   - Marco prende la versione di Riccardo e aggiunge sezioni, salva come "relazione_aggiornata.docx"
   - A fine settimana esistono sei versioni diverse. Nessuno sa quale sia la più completa.
   
   Identifica almeno tre problemi specifici in questo scenario e proponi una soluzione concreta per ognuno.

3. **Privacy browser — analisi pratica.** Apri il browser che usi. Vai nelle impostazioni avanzate della privacy. Rispondi a queste domande con dati reali (non "dovrebbe essere così"):
   - Quanti siti hanno accesso alla tua posizione?
   - Quanti siti hanno accesso alla fotocamera o al microfono?
   - Quanti cookie di terze parti sono salvati? Da quali domini?
   - La modalità Do Not Track è attivata? Sai cosa fa effettivamente?

4. **Relazione critica.** Scrivi una relazione di 15-20 righe che risponda a questa domanda: "Quali abitudini digitali devo cambiare per gestire meglio il mio computer? Cosa ho scoperto che non sapevo?" La relazione deve includere almeno tre azioni concrete che intendi intraprendere, con una data di scadenza per ognuna.

> **Sfida aperta:** esiste un sistema di backup ancora più robusto della regola 3-2-1? Cercalo. Si chiama RAID — scopri cos'è e perché le aziende lo usano.

---

## 🌍 AGISCI

---

### Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | Base — Sufficiente | Intermedio — Buono | Avanzato — Ottimo |
|----------|-------------------|-------------------|--------------------|
| **1. Diagnosi della situazione** | Identifica almeno 2 problemi concreti nella gestione attuale dei file del proprio dispositivo, con esempi specifici | Identifica 4 o più problemi, li classifica per impatto (alta/media/bassa priorità), e spiega perché ogni problema è un problema | Produce una diagnosi completa collegando ogni problema a un rischio concreto (perdita di dati, tempo sprecato, privacy compromessa) con stima dell'impatto in ore o dati potenzialmente persi |
| **2. Progettazione del sistema** | Propone una struttura di cartelle funzionale con almeno 3 livelli, usando i principi della MC | Propone struttura completa, applica la convenzione di naming a file reali, giustifica ogni scelta con il principio corrispondente | Progetta un sistema scalabile che funziona per diversi anni scolastici e tipi di progetto, con regole esplicite per i casi limite ("dove va un file se non so in quale materia metterlo") |
| **3. Piano di backup** | Descrive almeno un metodo di backup applicabile alla propria situazione | Applica la regola 3-2-1, identifica gli strumenti concreti disponibili, stima quanto lavoro perderebbe senza backup | Configura effettivamente uno strumento di backup automatico, documenta la configurazione, e calcola la finestra di perdita massima dati in caso di guasto |
| **4. Consapevolezza privacy** | Sa distinguere cosa fa la modalità privata del browser da cosa non fa | Identifica cookie di terze parti presenti nel suo browser, sa come rimuoverli e prevenirli | Analizza le impostazioni di privacy del browser con dati reali (numero di siti con permessi, cookie presenti), propone modifiche concrete e spiega l'impatto di ogni impostazione |

---

### Lo scenario

La scuola ha deciso di creare una "guida pratica alla gestione del computer" per gli studenti del prossimo anno. Ti chiedono di contribuire con una sezione basata sulla tua esperienza reale — non su teoria astratta, ma su quello che hai imparato facendo.

---

### La consegna

Produci un documento di 1-2 pagine (o una presentazione di 6-8 slide) che contenga:

**Sezione 1 — La mia situazione prima:** descrivi onestamente com'era organizzato il tuo computer prima di questa MC. Quanti file avevi sul desktop? Avevi mai fatto un backup? Sapevi cosa erano i cookie di terze parti? Sii specifico: i numeri sono più utili delle descrizioni generiche.

**Sezione 2 — Il sistema che ho costruito:** descrivi la struttura di cartelle che hai creato o che applicherai. Mostra un esempio di come nomineresti tre file reali del tuo lavoro scolastico usando la convenzione imparata.

**Sezione 3 — Il mio piano di backup:** quale strumento hai configurato o configurerai? Con quale frequenza? Cosa succederebbe se il computer si rompesse domani — cosa perderesti ancora?

**Sezione 4 — Un consiglio a chi inizia:** qual è la *prima* cosa che faresti se dovessi spiegare a un compagno come migliorare la gestione del computer? Perché proprio quella?

---

### Materiali che ti servono

- Il computer che usi normalmente (o accesso a un computer scolastico)
- Questa MC come riferimento
- Accesso a Google Drive o equivalente per la parte cloud (opzionale per il livello base)

---

### Badge SDG 9 — Industria, innovazione e infrastrutture

Gestire bene le risorse digitali è una competenza infrastrutturale. Il 9° Obiettivo di Sviluppo Sostenibile riguarda la costruzione di infrastrutture resilienti — e la tua infrastruttura digitale personale (file organizzati, backup, sistemi aggiornati) è il punto di partenza. Un sistema digitale che non funziona è uno spreco di risorse: tempo perso, lavoro rifatto, dati perduti. Un sistema ben organizzato è un'infrastruttura efficiente.

---

### Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona e chiedi all'AI Coach:
- *"Come rinomino rapidamente molti file in una volta sola su Windows/Mac?"*
- *"Qual è il modo migliore per sincronizzare Drive con il mio computer?"*
- *"Come faccio a vedere quali siti hanno accesso alla mia fotocamera su Chrome?"*

L'AI Coach risponde solo su questa MC. Verifica sempre le informazioni tecniche che fornisce: le impostazioni dei sistemi operativi e dei browser cambiano spesso.

---

### Metacognizione — Rifletti sul tuo lavoro

Rispondi dopo aver consegnato il compito.

**1. La scoperta**
Qual è la cosa che hai scoperto su come usi il computer che ti ha sorpreso di più — nel senso che non ne eri consapevole? Non deve essere necessariamente qualcosa di negativo.

*Scrivi 2-3 righe:* ___________________________________________

---

**2. La resistenza**
C'è un'abitudine che sai che dovresti cambiare ma che fai fatica a cambiare? Qual è? Perché pensi sia difficile cambiarla?

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa**
Hai fatto un errore mentre svolgevi le attività di questa MC — magari hai cancellato un file per sbaglio, o hai rinominato un file in modo sbagliato? Racconta cosa è successo e come l'hai risolto. Se non hai fatto errori, descrivi un errore che hai fatto in passato con i file e cosa avresti dovuto fare.

*Cosa ti ha insegnato quell'errore? Come eviteresti di rifarlo?*

*Scrivi 2-3 righe:* ___________________________________________

---

**4. Connessione con la tua vita futura**
Pensa a un lavoro che ti piacerebbe fare da adulto. Come si usano i file e i dati in quel lavoro? (Se non lo sai, ipotizza — poi cerca online per verificare.) Le abitudini che stai costruendo ora ti serviranno in quel contesto?

*Scrivi 2-3 righe:* ___________________________________________

---

### Collegamento con UDA-2 — "Progetto Città Futura"

Le competenze di questa MC sono strumenti trasversali per l'UDA interdisciplinare dell'anno: tutta la documentazione del progetto — schizzi, relazioni, presentazioni, foto — deve essere gestita con il sistema che hai imparato. Organizza una cartella dedicata al progetto sin dall'inizio. Ogni file con la convenzione di naming. Backup attivo. Quando il progetto finisce, avrai anche un archivio ordinato del percorso fatto.

---

## APPENDICE — Tech in English

**Termini tecnici di questa MC in inglese**

| Italiano | English | Come si legge |
|----------|---------|---------------|
| cartella | folder | /ˈfəʊldər/ |
| backup | backup | /ˈbækʌp/ |
| sistema operativo | operating system | /ˈɒpəreɪtɪŋ ˈsɪstəm/ |
| modalità privata | private browsing / incognito mode | /ˈprɪvɪt ˈbraʊzɪŋ/ |
| cookie | cookie | /ˈkʊki/ |
| controllo di versione | version control | /ˈvɜːʃən kənˈtrəʊl/ |

> *In English we say: "Always use version control for important files" — usa sempre il controllo di versione per i file importanti.*
>
> *"My backup failed — I lost three days of work" — il mio backup non ha funzionato, ho perso tre giorni di lavoro.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- Zona 2: distribuire su 2 colonne. I blocchi di codice (struttura cartelle) vanno in font monospace su sfondo grigio chiaro.
- Il box DIG↔INF è un riquadro evidenziato con bordo laterale colorato — colore diverso dai box "Lo sapevi" per distinguerli.
- La tabella comparativa dei servizi cloud va in pagina separata o come infografica laterale.
- Le istruzioni della Zona 4 Intermedio/Avanzato vanno come schede separabili.

**Per l'agente generatore asset:**
- Visual richiesto 1: schema ad albero della struttura cartelle raccomandata — formato PNG 1200×900 + SVG.
- Visual richiesto 2: infografica "Regola 3-2-1 del backup" con 3 livelli visivi (computer → disco esterno → cloud).
- Visual richiesto 3: confronto "prima/dopo" organizzazione file — due screenshot simulati affiancati.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025)*
*Livello DigComp: Intermediate (I) · DC 2.1 — Interagire con le tecnologie digitali*
*Contenuto espanso su indicazione editoriale — tutte e 5 le zone libro-ready*
