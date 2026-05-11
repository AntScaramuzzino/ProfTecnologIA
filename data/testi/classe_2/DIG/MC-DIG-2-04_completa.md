# MC-DIG-2-04 — Sicurezza digitale pratica e identità online
**Area:** Digitale · **Anno:** 2ª · **Livello DigComp:** Intermediate (I)
**SDG:** 16 — Pace, giustizia e istituzioni solide · **Fonte:** originale
**Struttura:** 4 pagine (spread avanzato) · Versione contenuto completo per editing

> **Nota editoriale DIG/INF:** questa MC tratta la stessa area tematica di MC-INF-2-02 (cifratura e crittografia) ma da una prospettiva opposta. INF-2-02 spiega *come funziona* la crittografia: cifrari, chiavi simmetriche e asimmetriche, HTTPS. Questa MC insegna a *comportarsi in sicurezza* online: riconoscere un tentativo di phishing, scegliere una password forte, attivare il 2FA, gestire la propria reputazione digitale. Sono competenze distinte. Puoi capire perfettamente come funziona un lucchetto senza essere bravo a non lasciare la porta aperta.

---

## ⚡ INNESCA

**Scenario:**

Giovedì mattina, Luca apre il telefono e trova 47 notifiche. I suoi amici gli chiedono chi ha mandato loro uno strano link su Instagram. Apre l'app: il suo profilo ha pubblicato messaggi in arabo e cinese, sta seguendo 300 account che non conosce, e ha inviato a tutta la sua lista contatti un link che porta a un sito di truffe.

Il suo account è stato preso da qualcuno.

Luca non ricorda di aver cliccato nulla di strano. Ma due giorni prima aveva ricevuto un messaggio da quello che sembrava il profilo ufficiale di Instagram: *"Abbiamo rilevato un accesso sospetto al tuo account. Clicca qui entro 24 ore per confermare la tua identità e non perdere l'accesso."* Il link portava a una pagina identica a quella di Instagram. Luca aveva inserito email e password.

Quel sito non era Instagram. Era una copia perfetta creata da qualcuno che voleva esattamente quei dati. In meno di un'ora, qualcuno dall'altra parte del mondo aveva usato la sua password per entrare nel suo account.

Luca ha impiegato tre giorni per riprendere il controllo del profilo. I suoi contatti lo evitavano per il sito di truffe che aveva "promosso". La sua reputazione online ne ha risentito.

Questa storia accade ogni giorno a milioni di persone. Non solo agli adulti. Non solo a chi è "ingenuo". Accade a chiunque non sappia cosa cercare.

**Domanda di avvio:**
Se ricevessi adesso un messaggio urgente che ti dice che il tuo account è in pericolo, cosa faresti? Come faresti a capire se è vero?

---

## 📖 ESPLORA

### Sicurezza digitale: non è paranoia, è igiene

La sicurezza digitale non è una questione riservata agli esperti di informatica o alle grandi aziende. È una competenza quotidiana, come lavarsi le mani: semplice da praticare, ma efficace solo se la pratichi sempre e non solo quando ci pensi.

Il punto di partenza è cambiare prospettiva: la maggior parte degli attacchi informatici non sfrutta vulnerabilità tecnologiche sofisticate. Sfrutta l'errore umano. La password debole. Il link cliccato senza guardare l'URL. Il file scaricato da una fonte sconosciuta. I criminali digitali sono più bravi a manipolare le persone che a bucare i sistemi.

Questa MC copre sei aree: i tipi di attacchi che riguardano utenti normali, come riconoscere un'email di phishing, come scegliere una password forte, cos'è il 2FA e come funziona, cosa fare se sei vittima di un attacco, e come gestire la propria reputazione e identità digitale. Alla fine c'è un box su come l'IA sta cambiando il campo — in entrambe le direzioni.

---

### 1. I tipi di attacchi che riguardano te

Non tutti gli attacchi informatici sono hacker in felpa nera che bucan sistemi militari. La maggior parte degli attacchi che colpiscono persone normali — studenti, famiglie, insegnanti — usa tecniche molto più semplici ma altrettanto efficaci.

**Phishing** (pronuncia: "fishing", come "pescare"). L'attaccante ti manda un messaggio — email, SMS, o messaggio su app social — che sembra provenire da una fonte affidabile (la tua banca, Instagram, Netflix, la tua scuola) e ti chiede di fare qualcosa: cliccare un link, inserire una password, scaricare un file. Il link porta a una pagina falsa che imita quella reale. Appena inserisci i dati, li riceve l'attaccante.

Il nome "phishing" è un gioco di parole con "fishing" (pescare): l'attaccante lancia un'esca e aspetta che qualcuno abbocchi. Le esche sono costruite per sembrare credibili: loghi reali, testi simili a quelli ufficiali, senso di urgenza ("entro 24 ore", "subito", "rischio di perdere l'accesso").

**Varianti del phishing:**
- *Smishing*: phishing via SMS. Più difficile da riconoscere perché i telefoni mostrano meno informazioni sul mittente rispetto all'email.
- *Vishing*: phishing via telefono. Qualcuno ti chiama fingendo di essere la tua banca o il supporto tecnico di Apple/Microsoft.
- *Spear phishing*: phishing mirato a una persona specifica, con informazioni personalizzate prese dai tuoi social (nome, città, scuola, amici) per sembrare ancora più credibile.

**Social engineering.** Tecnica più sofisticata del phishing: l'attaccante costruisce una relazione nel tempo prima di chiedere qualcosa. Un "amico" conosciuto online che dopo settimane chiede un favore urgente — magari di cliccare un link, o di passargli informazioni su qualcuno. Il social engineering sfrutta la fiducia, l'empatia, l'urgenza emotiva.

**Malware scaricato inconsapevolmente.** Scarichi quello che sembra un gioco gratuito, una versione "craccata" di un software, un file da un link in un messaggio. Insieme al file che volevi, si installa silenziosamente un programma che può: registrare i tasti che premi (keylogger), cifrar i tuoi file e chiedere un riscatto (ransomware), usare il tuo computer per attaccare altri sistemi (botnet), rubare le password salvate nel browser.

**Account takeover.** Qualcuno prende il controllo di un tuo account — come nel caso di Luca. Può succedere in tre modi: phishing (come nell'esempio), indovinare la password (soprattutto se è semplice o uguale a quella di un altro servizio che è stato violato), oppure acquistare le tue credenziali in un database di password rubate che vengono vendute sul dark web.

---

### 2. Come riconoscere un'email di phishing: sette segnali

Il 90% dei messaggi di phishing ha almeno tre di questi sette segnali. Impara a riconoscerli e diventano quasi sempre visibili.

**Segnale 1 — URL sospetto.** Prima di cliccare qualsiasi link, passa il cursore sopra senza cliccare (su computer). Guarda l'indirizzo che appare in basso. Un link di Instagram dovrebbe portare a `instagram.com`. Se vedi `instagram-support.net`, `instagram.accounts-verify.com`, o qualcosa del genere, è una truffa. I truffatori registrano domini che *assomigliano* a quelli reali ma non lo sono. Regola: l'unica parte che conta è prima del primo `/` dopo il doppio punto — `instagram.com/qualcosa` è Instagram; `qualcosa.instagram-login.com` non lo è.

**Segnale 2 — Urgenza artificiale.** I messaggi di phishing spingono sempre ad agire subito, senza pensare: "Il tuo account sarà eliminato entro 24 ore", "Azione immediata richiesta", "Sei stato selezionato — rispondi entro oggi". L'urgenza serve a impedire che tu ti fermi a ragionare. Le comunicazioni legittime di aziende serie danno sempre tempo sufficiente per verificare.

**Segnale 3 — Richiesta di password o dati sensibili.** Nessuna azienda legittima ti chiederà mai la password via email, SMS o messaggio. Mai. Apple non ti chiede la password di iCloud. Instagram non ti chiede quella di Instagram. La tua banca non ti chiede il PIN. Se un messaggio chiede questi dati, è sempre una truffa.

**Segnale 4 — Mittente sospetto.** Guarda l'indirizzo email del mittente — non solo il nome visualizzato. Il nome può essere "Instagram Support" ma l'email può essere `support@instagram-noreply.co`. Le aziende reali usano i loro domini ufficiali: `@instagram.com`, `@apple.com`, `@google.com`. Qualsiasi variazione è sospetta.

**Segnale 5 — Errori grammaticali e ortografici.** I messaggi di phishing sono spesso tradotti automaticamente da altre lingue o scritti in fretta. Errori come "Ciao utente, il tuo conto ha necessita di verifica" o punteggiatura strana sono campanelli d'allarme. Le aziende serie hanno uffici di comunicazione che correggono ogni messaggio prima di inviarlo.

**Segnale 6 — Allegati non richiesti.** Un'email non attesa con un allegato — anche se sembra provenire da qualcuno che conosci — è sospetta. Il malware si diffonde spesso tramite allegati Word, PDF, o file ZIP. Se non aspettavi quell'allegato, verifica con il mittente (chiamandolo, non rispondendo all'email) prima di aprirlo.

**Segnale 7 — Saluto generico.** "Caro cliente", "Gentile utente", "Ciao amico" — le aziende a cui sei davvero iscritto conoscono il tuo nome e lo usano. I truffatori mandano milioni di messaggi identici: non sanno chi sei.

> **Test rapido:** guarda questo messaggio simulato:
>
> *"Caro utente di Instagram, abbiamo rilevato un accesso sospetto dal paese Romania. Per proteggere il suo account clicchi subito il link: www.instagram-accounts-security.net/verify. Ha 12 ore. Instagram Security Team."*
>
> Quanti segnali identifichi? (Risposta: almeno 5 — URL sbagliato, urgenza artificiale, saluto generico, assenza del tuo nome, grammatica leggermente anomala, e nessuna email ufficiale come mittente.)

---

### 3. Password forti: la lunghezza batte la complessità

La password più sicura non è `P@$$w0rd!2026`. È `il mio gatto si chiama Biscotto ed è arancione`.

Perché? Perché la lunghezza conta più della complessità. Un computer che tenta password a caso (attacco a forza bruta) ci impiega:

| Password | Tempo stimato per romperla |
|----------|---------------------------|
| `password` | meno di 1 secondo |
| `P@$$word` | circa 5 minuti |
| `P@$$w0rd!2026` | circa 3 anni |
| `il mio gatto si chiama Biscotto` | più di un miliardo di anni |

La frase è più lunga, ma è anche più facile da ricordare. Questo è il principio delle **passphrase**: usare una frase invece di una parola con simboli.

**Le tre regole delle password:**

**Regola 1 — Lunga.** Almeno 12 caratteri. Meglio 16 o più.

**Regola 2 — Unica.** Password diversa per ogni account. Questo è il punto più importante e il meno rispettato. Se usi la stessa password su cinque siti e uno di quei siti viene violato, l'attaccante proverà la tua password su tutti gli altri siti (attacco chiamato *credential stuffing*). Se ogni account ha una password diversa, la violazione di uno non compromette gli altri.

**Regola 3 — Non ovvia.** Niente data di nascita, niente nome del gatto, niente "123456". Queste password vengono provate per prime in qualsiasi attacco.

**Il problema pratico:** se ogni account deve avere una password lunga e unica, come fai a ricordarle tutte? La risposta onesta è: non puoi. Un adulto medio ha 70-100 account digitali. Nessuno ricorda 100 password diverse di 16 caratteri.

La soluzione è un **password manager** — un programma che ricorda tutte le tue password al posto tuo, cifrate con un'unica password maestra che conosci solo tu. I password manager più affidabili sono Bitwarden (gratuito, open source), 1Password (a pagamento), e il gestore password integrato nei browser (quello di Chrome o Safari — pratico ma meno sicuro perché legato a un singolo browser). Con un password manager, devi ricordare solo una password — quella maestra — e il programma compila automaticamente tutte le altre.

---

### 4. Autenticazione a due fattori (2FA): la seconda serratura

Anche una password forte può essere rubata — tramite phishing, o se il sito su cui la usi viene violato. La **2FA** (Two-Factor Authentication, autenticazione a due fattori) aggiunge un secondo livello di verifica: anche se qualcuno conosce la tua password, non può accedere al tuo account senza il secondo fattore.

Il principio è semplice: per aprire la porta hai bisogno sia della chiave (qualcosa che sai — la password) sia di un badge fisico (qualcosa che hai — il tuo telefono).

**Come funziona in pratica:**

1. Inserisci email e password come di solito.
2. Il sistema ti chiede una seconda verifica: un codice di 6 cifre che viene inviato al tuo telefono via SMS, o generato da un'app come Google Authenticator o Authy.
3. Inserisci il codice. Accedi.

Il codice cambia ogni 30 secondi, quindi è inutile rubarlo dopo che l'hai usato.

**Dove attivare il 2FA:** quasi tutti i servizi importanti lo offrono. Vai nelle impostazioni dell'account → sicurezza → autenticazione a due fattori. I servizi che dovresti proteggere con certezza: email (è la chiave di recupero di tutti gli altri account), Instagram e altri social, account Google o Apple, eventuali conti bancari o PayPal.

**Quale tipo di 2FA usare:** ci sono tre metodi principali, in ordine di sicurezza:
- **App di autenticazione** (Authy, Google Authenticator) — il più sicuro, il codice è generato sul tuo dispositivo e non viaggia via rete
- **SMS** — pratico ma meno sicuro: i criminali possono in alcuni casi intercettare SMS o clonare le SIM
- **Email** — il meno sicuro se la tua email è già compromessa

> **Cosa succede se perdi il telefono?** Ogni servizio con 2FA ti dà dei *codici di backup* quando lo attivi: sono codici monouso da usare se non puoi accedere al tuo secondo fattore. Salvali da qualche parte sicura (non solo sul telefono — se lo perdi, li perdi anche quelli). Stampali e mettili in un posto sicuro a casa.

---

### 5. Se vieni attaccato: cosa fare

Se sospetti che un tuo account sia stato compromesso, ogni minuto conta. Ecco la sequenza di azioni nell'ordine giusto:

**Passo 1 — Cambia la password immediatamente.** Accedi all'account dal sito ufficiale (non dal link nell'email sospetta) e cambia la password. Se non riesci ad accedere perché l'attaccante ha già cambiato la password, usa la funzione "recupera account" con la tua email.

**Passo 2 — Cambia la password dell'email.** L'email è la chiave di recupero di tutti gli altri account. Se è compromessa, tutto il resto è a rischio. Cambia la password dell'email per prima cosa, o in parallelo.

**Passo 3 — Controlla le sessioni attive.** La maggior parte dei servizi (Instagram, Google, Facebook) ti permette di vedere tutti i dispositivi da cui sei attualmente connesso. Vai in impostazioni → sicurezza → sessioni attive e disconnetti tutto eccetto il tuo dispositivo attuale.

**Passo 4 — Attiva il 2FA.** Se non lo avevi, attivalo adesso. Chiudi la porta dopo che il ladro è entrato — ma almeno la chiudi per la prossima volta.

**Passo 5 — Avvisa i tuoi contatti.** Se il tuo account ha inviato link o messaggi sospetti ai tuoi contatti, avvisali — che non clicchino, e che non si trattava di te. Fallo velocemente, prima che anche loro cadano nella trappola.

**Passo 6 — Segnala.** La maggior parte delle piattaforme ha un sistema per segnalare account compromessi. Su Instagram: impostazioni → assistenza → Account compromesso. Se pensi di essere vittima di un reato (furto di dati sensibili, estorsione), puoi segnalarlo alla Polizia Postale (poliziapostale.it) che è l'organo competente per i crimini informatici in Italia.

**Passo 7 — Controlla gli altri account.** Se usavi la stessa password su altri servizi (non dovresti, ma se l'hai fatto), cambia immediatamente quelle password. Il credential stuffing è automatico: quando un database di password viene rubato, software automatici le provano su centinaia di altri siti in pochi minuti.

> **Il sito "haveibeenpwned.com"** (in italiano: "sei stato violato?") raccoglie database di credenziali rubate da violazioni note. Puoi inserire la tua email e scoprire se è presente in qualche fuga di dati conosciuta. Se la tua email compare, cambia subito la password di quell'account — e di tutti gli account in cui usavi la stessa password.

---

### 6. Reputazione online e identità digitale

Tutto quello che pubblichi online esiste. Anche quando pensi di averlo cancellato.

I motori di ricerca indicizzano le pagine. Le persone fanno screenshot. I server delle piattaforme conservano copie anche dopo che hai cancellato il post. Il **diritto all'oblio** — il diritto di richiedere la rimozione di informazioni su di sé dai risultati di ricerca — esiste nel diritto europeo (GDPR, 2016) ma è complicato da esercitare: richiede una richiesta formale a Google o agli altri motori di ricerca, e viene accettata solo in determinate condizioni.

La regola pratica è più semplice: prima di pubblicare qualcosa, chiediti se ti andrebbe bene che lo vedesse il tuo futuro datore di lavoro, un familiare che non vedi spesso, o il tuo insegnante preferito. Se la risposta è no, non pubblicarlo.

**Identità digitale multipla:** online hai probabilmente più profili — quello scolastico (Google account della scuola), uno o più account social, forse un account per i giochi online, forse un'email personale. Queste identità sembrano separate, ma in molti casi sono collegate o collegabili:

- Se usi la stessa foto profilo su più piattaforme, è facile associarle
- Se usi lo stesso username in posti diversi, una ricerca Google mostra tutto
- Se accedi a siti con "Continua con Google" o "Continua con Facebook", stai dando a quei siti informazioni sul tuo account principale e permettendo a Google/Facebook di sapere quali siti visiti

Questo non significa che dovresti usare identità false — oltre ad essere sconsigliabile, per i minorenni è anche rischiosa. Significa che dovresti essere consapevole di come le tue identità digitali sono collegate e fare scelte intenzionali su cosa condividere dove.

**Norme legali per minorenni in Italia:**

Il **GDPR** (General Data Protection Regulation, regolamento europeo sulla privacy entrato in vigore nel 2018) stabilisce che i minori di 14 anni non possono creare account sui social media senza il consenso dei genitori. In Italia la soglia è fissata a 14 anni. I social network richiedono l'età alla registrazione — ma non la verificano davvero. Questo crea una zona grigia legale e pratica.

Il **cyberbullismo** è disciplinato in Italia dalla Legge 71/2017 ("Disposizioni a tutela dei minori per la prevenzione ed il contrasto del fenomeno del cyberbullismo"). Non è solo un problema etico: è una questione legale. Pubblicare foto o video di altri senza consenso, diffondere notizie false su qualcuno, escludere sistematicamente una persona da gruppi online, o inviare messaggi offensivi ripetuti sono comportamenti che possono avere conseguenze legali anche per i minorenni.

Se sei vittima di cyberbullismo o testimone, puoi segnalare alla Polizia Postale, al dirigente scolastico (che ha obblighi specifici dalla legge 71/2017), o usare il numero di aiuto 19696 (linea antiviolenza e stalking) o il servizio Telefono Azzurro (19696).

---

### Box T8 — L'IA e il phishing: arma a doppio taglio

L'intelligenza artificiale sta cambiando il campo della sicurezza digitale in modo profondo — e in entrambe le direzioni.

**Come l'IA aiuta a difendersi:**

I filtri antispam moderni usano modelli di machine learning addestrati su milioni di email per riconoscere schemi tipici del phishing: mittenti anomali, URL sospetti, combinazioni di parole frequenti nelle truffe. Gmail blocca automaticamente il 99,9% dei messaggi di phishing prima che arrivino nella tua casella. Le banche usano sistemi AI per rilevare transazioni anomale (acquisti da paesi insoliti, pattern diversi dal solito) e bloccarle in tempo reale.

**Come l'IA aiuta gli attaccanti:**

Fino a pochi anni fa, un'email di phishing era spesso riconoscibile dagli errori grammaticali — il testo era scritto da non madrelingua o tradotto automaticamente in modo approssimativo. Con i modelli linguistici avanzati disponibili oggi, chiunque può generare un testo perfettamente grammaticale, nello stile di un'azienda specifica, con riferimenti personalizzati presi dai profili social della vittima. Il phishing sta diventando molto più difficile da riconoscere.

Esistono già tecnologie di **deepfake vocale** — sistemi che, con pochi minuti di audio di qualcuno, possono generare messaggi vocali con la sua voce. Sono stati usati in casi reali per imitare la voce di dirigenti aziendali al telefono e convincere dipendenti a fare bonifici urgenti. Questa tecnica si chiama *vishing con deepfake*.

La conseguenza pratica per te: la regola "se è grammaticalmente corretto e sembra autentico, è autentico" non funziona più. Le regole che rimangono valide anche in un mondo con phishing generato da AI sono quelle strutturali: controlla sempre l'URL, non fornire mai la password via email o messaggio, usa sempre il 2FA. Queste regole non dipendono da quanto è "convincente" il messaggio.

---

### Caso studio: anatomia di un attacco di phishing riuscito

Marco ha 14 anni. Giovedì pomeriggio riceve questa notifica sul telefono:

*"Ciao Marco, il tuo account Netflix è stato temporaneamente sospeso a causa di un problema con il pagamento. Per evitare l'interruzione del servizio, aggiorna i tuoi dati entro 24 ore: [link]"*

Il messaggio arriva via SMS. Il mittente è mostrato come "Netflix".

**Passo 1 — Il setup:** il numero del mittente è falso. Gli SMS possono avere mittenti alfanumerici personalizzati (come "Netflix") — non è difficile da falsificare. Marco non lo sa.

**Passo 2 — L'urgenza:** "entro 24 ore" — la pressione temporale impedisce di ragionare con calma. Marco pensa che se aspetta perderà l'accesso a Netflix. Non aspetta.

**Passo 3 — Il link:** Marco clicca il link. Si apre una pagina identica a Netflix — logo, colori, font. L'URL nella barra del browser è `netflix-payment-update.com`. Marco non la guarda.

**Passo 4 — I dati:** la pagina chiede email e password per "verificare l'identità". Marco le inserisce. Poi chiede i dati della carta di credito "per aggiornare il pagamento". Marco inserisce quelli di sua madre (sa dove stanno).

**Passo 5 — La truffa:** nessun errore appare. La pagina dice "Grazie, l'account è stato ripristinato." Marco chiude il browser convinto di aver risolto.

**Passo 6 — Le conseguenze:** in meno di un'ora, l'attaccante ha la password di Netflix di Marco (e di tutti gli altri siti dove la usa), l'email associata, e i dati della carta di credito di sua madre. Tre ore dopo compaiono addebiti non autorizzati sul conto.

**Come si sarebbe potuto evitare:**

- **Passo 2:** l'urgenza è un segnale. Fermarsi e ragionare.
- **Passo 3:** guardare l'URL prima di interagire con la pagina. `netflix-payment-update.com` non è Netflix.
- **Passo 4:** Netflix non chiede la password per aggiornare il pagamento. Nessun sito chiede la password per "verificare l'identità" — sei già loggato, l'identità è già verificata.
- **Alternativa corretta:** aprire una nuova scheda del browser, andare direttamente su `netflix.com` digitandolo a mano, e controllare se c'è davvero un problema con il pagamento. Se sì, risolvere dall'interno del sito ufficiale.

---

> **Collegamento STEM — Scienze:**
> La crittografia che protegge le tue password salvate in un password manager usa funzioni matematiche chiamate *funzioni hash crittografiche*. Una funzione hash trasforma qualsiasi input (la tua password) in una stringa di lunghezza fissa che sembra casuale — e non è invertibile: dato l'hash, non puoi risalire alla password originale. Quando il sito verifica la tua password, calcola l'hash di quello che hai inserito e lo confronta con l'hash memorizzato. Le password non vengono mai salvate in chiaro. Per questo, quando hai dimenticato una password, il sito non può "mandarti la password" ma solo resettarla: non la conosce.

> **Collegamento STEM — Matematica:**
> La robustezza di una password si misura in "bit di entropia": quanta informazione è contenuta nella scelta. Una password di 8 caratteri che usa solo lettere minuscole ha 26⁸ ≈ 200 miliardi di possibilità. Una passphrase di 4 parole scelte da un dizionario di 2000 parole comuni ha 2000⁴ = 16.000 miliardi di possibilità — ottanta volte di più, con qualcosa di molto più facile da ricordare. Il calcolo mostra perché la lunghezza (e l'imprevedibilità) batte la complessità.

---

## 🔍 OSSERVA

### Il caso: come funziona un attacco reale di credential stuffing

Nel 2024, un database contenente circa 10 miliardi di username e password è stato pubblicato online (era la più grande raccolta di credenziali rubate mai trovata, chiamata "RockYou2024"). Proveniva dall'aggregazione di centinaia di violazioni di dati degli anni precedenti — dal sito di giochi, dalla catena di supermercati, dall'app di fitness, dal forum di cucina.

Non tutte quelle credenziali erano attuali. Ma molte lo erano — perché le persone usano la stessa password per anni e su più siti.

Il credential stuffing funziona così: un software automatico prende le coppie email/password dal database e le prova su centinaia di siti diversi in parallelo — Gmail, Instagram, banche, Amazon. Se il 2% delle coppie funziona ancora da qualche parte, su 10 miliardi di record significano 200 milioni di account compromessi.

La difesa individuale è semplice: password diverse per ogni sito + 2FA. La difesa collettiva è più complessa: richiede che le aziende proteggano meglio i loro database, rilevino automaticamente gli attacchi di credential stuffing (che generano pattern anomali di tentativi di login), e avvisino gli utenti quando il loro account viene attaccato.

Tu puoi controllare solo la tua parte — ma la tua parte è anche la più importante.

---

> **Chi lavora con questa competenza nel 2030?**

**Cybersecurity Analyst**

Un cybersecurity analyst protegge sistemi e dati aziendali da attacchi. Analizza i tentativi di intrusione, studia le vulnerabilità dei sistemi, progetta difese, risponde agli incidenti. Quando un'azienda viene attaccata, è il cybersecurity analyst che capisce cosa è successo, come è entrato l'attaccante, e come evitare che succeda di nuovo.

Concretamente: simula attacchi per trovare vulnerabilità prima che le trovino i criminali (penetration testing), configura sistemi di rilevamento degli accessi anomali, forma i dipendenti a riconoscere il phishing, risponde agli incidenti di sicurezza in tempo reale.

Le competenze che inizia a costruire da qui: comprensione degli attacchi (come funziona il phishing, il malware, il social engineering), pensiero critico applicato ai sistemi, conoscenza dei protocolli di sicurezza (2FA, crittografia, HTTPS).

*"Il 95% degli attacchi informatici riesce a causa di errori umani. Il mio lavoro è fare in modo che le persone smettano di essere il punto debole."*

Dove lavora: banche, ospedali, aziende tecnologiche, pubblica amministrazione, forze dell'ordine (Polizia Postale).
Livello di domanda nel 2030 in Europa: critico (carenza stimata di 3,5 milioni di profili a livello mondiale).

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in 🌍 AGISCI.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

> **Nota di sicurezza:** nessuna attività di questo laboratorio richiede di inserire password reali o dati personali. Se un'attività chiede di controllare le password, usa password inventate come esempi. Non usare mai password reali durante un'attività scolastica.

---

### BASE — Riconosco e classifico

**Obiettivo:** imparare a identificare i segnali di phishing in messaggi simulati, e classificare il tipo di attacco.

**Materiali:** i tre messaggi simulati qui sotto.

**Come procedere:**

1. Leggi ogni messaggio simulato.

2. Per ognuno, compila la tabella identificando: quanti segnali di phishing contiene, quali specificamente, e cosa faresti se ricevessi quel messaggio.

---

**Messaggio simulato A:**

*"Caro cliente, il tuo account Postepay è stato bloccato per attività sospetta. Per sbloccare il tuo account clicca subito: www.postepay-sicurezza-account.it. Il tuo codice di sblocco scade tra 2 ore. Assistenza Postepay"*

---

**Messaggio simulato B:**

*"Ciao! Sono la prof.ssa Morelli. Ho dimenticato la password della piattaforma scolastica. Puoi mandarmi la tua per un momento così accedo e sistemo il registro? Poi te la rimando subito. Grazie"*

---

**Messaggio simulato C:**

*"Ti ricordiamo che la tua iscrizione al servizio Premium scadrà tra 3 giorni. Per rinnovarla o disdirla clicca qui: www.servizio-premium.it/rinnovo. Se non vuoi ricevere altri promemoria rispondi STOP a questo SMS."*

---

| Messaggio | N° segnali identificati | Segnali specifici | Cosa faresti |
|-----------|------------------------|-------------------|--------------|
| A | | | |
| B | | | |
| C | | | |

3. Il messaggio C è phishing? (Attenzione: non tutti i messaggi con link sono phishing. Ragiona prima di rispondere.)

4. Scrivi in 3-4 righe: qual è il messaggio che ti sembra più difficile da riconoscere come truffa, e perché?

> **Nota:** il messaggio B è un esempio di *social engineering* che sfrutta il ruolo di autorità. La prof.ssa non ha dimenticato la password — una persona reale in quella posizione userebbe il sistema di recupero password ufficiale. Nessuno ha mai una ragione legittima per chiederti la tua password.

---

### INTERMEDIO — Costruisco la mia sicurezza

**Obiettivo:** valutare la propria situazione di sicurezza reale e costruire un piano di miglioramento concreto.

**Parte A — Audit della sicurezza (senza usare password reali):**

1. Pensa agli account che usi regolarmente (non scriverli — tienili in mente). Per ognuno, rispondi mentalmente a queste domande, poi compila la tabella con stime aggregate:

| Domanda | Risposta |
|---------|---------|
| Quanti account usi regolarmente? | |
| Per quanti usi la stessa password o varianti simili? | |
| Per quanti hai il 2FA attivo? | |
| Per quanti usi l'email come password di recupero, ma l'email non ha il 2FA? | |

2. Usando il sito `haveibeenpwned.com`, inserisci la tua email principale. Quante violazioni note ha trovato? Per ogni violazione trovata, descrivi cosa dovresti fare.

**Parte B — Piano di sicurezza:**

3. Sulla base dell'audit, identifica le 3 azioni più urgenti per migliorare la tua sicurezza digitale. Per ognuna scrivi:
   - Cosa devi fare concretamente
   - Quanto tempo richiede (realistica stima)
   - Entro quando lo farai

4. Scegli il servizio più importante che usi (email, Instagram, account scolastico). Vai nelle impostazioni → sicurezza → sessioni attive. Quanti dispositivi sono connessi? Li riconosci tutti? Se c'è qualcosa di strano, cosa faresti?

5. Valuta questa password: `Tecnologia2026!` — è forte? Usa i criteri della MC per la tua analisi.

**Parte C — Phishing test:**

6. Costruisci tu una versione simulata di un messaggio di phishing (senza link reali, solo testo) che cercasse di colpire uno studente della tua scuola. Includi almeno 4 dei 7 segnali descritti nella MC — poi annota quali hai usato e perché credi che potrebbero funzionare. Obiettivo: capire la logica dell'attaccante per difendersi meglio.

> **Riflessione obbligatoria (3-4 righe):** dopo aver costruito il messaggio di phishing, cosa pensi di questo esercizio? Ti ha cambiato il modo in cui guardi i messaggi che ricevi?

---

### AVANZATO — Analisi critica e proposta

**Scenario:** sei stato incaricato dalla scuola di preparare una breve formazione anti-phishing per i tuoi compagni di classe che non hanno ancora studiato questa MC. Hai 15 minuti.

**Il tuo compito:**

1. **Progetta la formazione.** Decidi: cosa è assolutamente necessario che sappiano? Cosa taggeresti o escluderesti per stare nei 15 minuti? Struttura un outline con titoli e durata stimata di ogni sezione.

2. **Crea il materiale.** Produci almeno uno dei seguenti:
   - Una serie di 5-6 esempi di messaggi (email, SMS, notifiche app) che mostrano un gradiente da "chiaramente phishing" a "molto difficile da riconoscere" — con annotazioni che spiegano ogni segnale
   - Un quiz di 5 domande a scelta multipla con 4 opzioni e feedback per ogni risposta sbagliata (seguendo il formato standard della MC)
   - Una checklist stampabile "Prima di cliccare, controlla questi 5 punti"

3. **Analisi AI e sicurezza.** Partendo dal box T8, scrivi un testo di 15-20 righe che risponda a questa domanda: "Se l'IA rende il phishing indistinguibile dai messaggi legittimi, i 'segnali di riconoscimento' che abbiamo studiato diventano inutili? O rimane qualcosa su cui possiamo fare affidamento?" Argomenta la tua risposta.

4. **Caso legale.** Cerca online un caso reale di cyberbullismo in Italia (ce ne sono documentati nei comunicati della Polizia Postale) che abbia avuto conseguenze legali. Descrivilo in 8-10 righe includendo: cosa è successo, quanti anni avevano i coinvolti, quali norme legali sono state applicate, e qual è la tua riflessione.

> **Domanda aperta:** esistono situazioni in cui un governo o un'azienda potrebbe avere interesse a facilitare l'accesso degli attaccanti ai dati degli utenti? Come si chiama questo tipo di "porta sul retro" intenzionale nei sistemi di sicurezza? (Cerca: "backdoor crittografia" e "going dark debate".)

---

## 🌍 AGISCI

---

### Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | Base — Sufficiente | Intermedio — Buono | Avanzato — Ottimo |
|----------|-------------------|-------------------|--------------------|
| **1. Riconoscimento degli attacchi** | Identifica almeno 3 segnali di phishing nei messaggi simulati e li denomina correttamente | Identifica tutti i segnali presenti, spiega per ognuno la logica psicologica che sfrutta (urgenza, autorità, paura), e li ordina per efficacia dell'inganno | Analizza i messaggi come farebbe un esperto di sicurezza: per ogni segnale, spiega come i truffatori potrebbero renderlo meno visibile usando AI o personalizzazione |
| **2. Valutazione della propria sicurezza** | Identifica almeno 2 aree di debolezza della propria sicurezza digitale con esempi concreti | Produce un audit completo (password, 2FA, sessioni attive, email di recupero) con un piano di azioni prioritizzate | Produce un piano strutturato con scadenze, stima del rischio attuale ("se fossi attaccato adesso, cosa perdo?"), e verifica dell'implementazione con documentazione |
| **3. Azioni di miglioramento** | Descrive almeno 1 azione concreta già realizzata o che realizzerà entro una settimana | Descrive e documenta (screenshot) almeno 2 azioni realizzate: attivazione 2FA su un servizio e controllo sessioni attive | Attiva 2FA su almeno 3 servizi importanti, usa haveibeenpwned per verificare l'email, documenta tutto con screenshot e una riflessione su ciò che ha trovato |
| **4. Consapevolezza identità digitale** | Sa spiegare cosa significa "reputazione online" e perché è difficile cancellare contenuti già pubblicati | Collega reputazione online, identità multipla, e norme legali (GDPR, legge 71/2017) in un ragionamento coerente | Produce una "politica personale di pubblicazione" — un insieme di 3-5 regole auto-imposte che seguirà per gestire la propria identità digitale, con motivazione per ognuna |

---

### Lo scenario

La tua scuola ha subito un tentativo di phishing: qualcuno ha mandato email a studenti e famiglie fingendo di essere la segreteria, chiedendo di accedere a un link per aggiornare i dati di iscrizione. Tre famiglie hanno cliccato il link prima che la scuola riuscisse ad avvisare tutti.

Il dirigente scolastico ti chiede di preparare un "kit di prima risposta" per aiutare le famiglie colpite e prevenire attacchi futuri.

---

### La consegna

Produci un documento di 1-2 pagine (o una presentazione di 6-8 slide) strutturato in due parti:

**Parte 1 — Per le famiglie colpite:** una lista di azioni immediate da fare, nell'ordine giusto, con istruzioni chiare (non tecnicismi). Scrivi come se la stessi spiegando a un genitore di 45 anni che usa il computer solo per lavoro.

**Parte 2 — Per prevenire in futuro:** 5 regole pratiche per riconoscere comunicazioni scolastiche false. Includi: come verificare che una comunicazione venga davvero dalla scuola, cosa fare prima di cliccare qualsiasi link, chi avvisare se si sospetta una truffa.

---

### Materiali che ti servono

- Questa MC come riferimento
- Accesso al sito `poliziapostale.it` per eventuali informazioni su come segnalare
- Accesso a `haveibeenpwned.com` (facoltativo — per la verifica dell'email)
- Nessun dato personale richiesto in nessuna parte del compito

---

### Badge SDG 16 — Pace, giustizia e istituzioni solide

La sicurezza digitale non è solo una questione individuale. È una questione civica. Il 16° Obiettivo di Sviluppo Sostenibile dell'Agenda 2030 chiede di costruire istituzioni solide, trasparenti e affidabili. Quando proteggi il tuo account, proteggi anche i tuoi contatti — che non riceveranno truffe dal tuo profilo compromesso. Quando segnali un tentativo di phishing alle autorità, contribuisci a fermare attaccanti che colpiscono migliaia di persone. La sicurezza digitale individuale è infrastruttura civica collettiva.

---

### Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona e chiedi all'AI Coach:
- *"Come attivo il 2FA su Instagram/Gmail/account scolastico?"*
- *"Questo messaggio che ho ricevuto è phishing? [descrivi il messaggio]"*
- *"Come faccio a vedere se la mia email è stata violata in qualche database?"*

L'AI Coach risponde solo su questa MC. Per i messaggi sospetti che ricevi nella vita reale, la verifica più affidabile rimane sempre andare direttamente al sito ufficiale del servizio — non attraverso il link nel messaggio.

---

### Metacognizione — Rifletti sul tuo lavoro

Rispondi dopo aver consegnato il compito.

**1. La presa di coscienza**
Prima di studiare questa MC, quali abitudini avevi riguardo alle password e alla sicurezza online? Ora che sai quello che sai, come valuteresti quelle abitudini? Sii onesto — nessuno giudica.

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Il momento di incertezza**
C'è stato un punto in questa MC in cui non eri sicuro di cosa fare — un messaggio simulato che ti sembrava legittimo, o una regola che non capivi perché era importante? Descrivilo. Come hai risolto l'incertezza?

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa**
Hai mai cliccato su qualcosa di sospetto nel passato — un link, un allegato, una finestra pop-up — e solo dopo hai capito che era pericoloso? (Se non ti è mai successo, descrivi una situazione che conosci — di un amico, di un familiare, di una notizia.) Cosa è successo? Cosa avresti dovuto fare? Cosa farai diversamente d'ora in poi?

*Scrivi 2-3 righe:* ___________________________________________

---

**4. La responsabilità condivisa**
La sicurezza digitale riguarda solo te, o riguarda anche gli altri? Pensa ai tuoi contatti — ai tuoi amici, alla tua famiglia. Come le tue abitudini di sicurezza (o la mancanza di abitudini) possono influenzare anche loro? Cosa potresti fare concretamente per migliorare la sicurezza digitale anche di chi ti sta vicino?

*Scrivi 2-3 righe:* ___________________________________________

---

### Collegamento con UDA-2 — "Progetto Città Futura"

La sicurezza digitale è una componente infrastrutturale della città del futuro. Nel progetto pluridisciplinare dell'anno, ogni gruppo gestirà dati e documenti condivisi online: le competenze di questa MC si applicano direttamente alla protezione di quei materiali. Configura il 2FA sugli account che userete per il progetto, e stabilisci con il tuo gruppo una politica chiara su chi può accedere ai file condivisi e come.

---

## APPENDICE — Tech in English

**Termini tecnici di questa MC in inglese**

| Italiano | English | Come si legge |
|----------|---------|---------------|
| phishing | phishing | /ˈfɪʃɪŋ/ |
| autenticazione a due fattori | two-factor authentication (2FA) | /tuː ˈfæktər ɔːˌθentɪˈkeɪʃən/ |
| malware | malware | /ˈmælweər/ |
| furto di identità | identity theft | /aɪˈdentɪti θeft/ |
| password manager | password manager | /ˈpɑːswɜːd ˈmænɪdʒər/ |
| crittografia | encryption | /ɪnˈkrɪpʃən/ |

> *In English we say: "Enable two-factor authentication on all your important accounts" — attiva l'autenticazione a due fattori su tutti i tuoi account importanti.*
>
> *"If you receive a suspicious message, go directly to the official website — don't click the link" — se ricevi un messaggio sospetto, vai direttamente al sito ufficiale — non cliccare il link.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- 📖 ESPLORA: il box "Test rapido" va in evidenza grafica (riquadro colorato con sfondo diverso).
- Il box T8 (IA e sicurezza) va come riquadro a larghezza piena, con icona AI in evidenza — elemento visivo riconoscibile per distinguerlo dai box informativi standard.
- La tabella "tempo per rompere una password" va in formato infografica orizzontale con barra di lunghezza proporzionale al tempo.
- I messaggi simulati della 🔬 SPERIMENTA Base vanno in formato "screenshot simulato" — stile bolla di messaggio o finestra email, non testo normale.
- La 🔬 SPERIMENTA Avanzato contiene la "domanda aperta" sul backdoor: va in evidenza come "per chi vuole andare oltre".

**Per l'agente generatore asset:**
- Visual richiesto 1: infografica "Anatomia di un'email di phishing" — email simulata annotata con frecce e spiegazioni dei 7 segnali.
- Visual richiesto 2: comparazione "password debole vs. passphrase" — rappresentazione visiva del tempo per romperle (scala logaritmica).
- Visual richiesto 3: diagramma di flusso "cosa fare se sei attaccato" — i 7 passi con branching decisionale.
- Hook audio: già disponibile nel JSON (script sulla storia del cifrario di Cesare + phishing moderno).

---

*MC versione 1.0 — Maggio 2026*
*Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025)*
*Livello DigComp: Intermediate (I) · DC 4.1 — Proteggere i dispositivi digitali*
*Contenuto espanso su indicazione editoriale — tutte e 5 le zone libro-ready*
