# MC-INF-2-02 — Come si protegge un segreto nell'era digitale?
**Area:** Informatica · **Anno:** 2ª · **Livello DigComp:** Intermediate (I)
**SDG:** 16 — Pace, giustizia e istituzioni solide · **Fonte:** originale
**Struttura:** 4 pagine (doppio spread espanso) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il matematico che salvò milioni di vite"**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 35 sec.*
> *(Script completo: MC-INF-2-02_hook-script.md)*

**Domanda di avvio:**
Guarda un lucchetto. Puoi chiuderlo anche senza la chiave — ma per aprirlo la chiave è indispensabile.
Questa asimmetria è il principio che protegge ogni messaggio che mandi oggi.
Come funziona? E puoi davvero fidarti di quell'icona del lucchetto verde nel browser?

---

## 📖 ESPLORA

### Ogni segreto digitale è matematica.

Ogni volta che invii un messaggio su WhatsApp, fai un pagamento online, accedi a un sito con password, accade qualcosa che non vedi: i tuoi dati vengono trasformati in una sequenza incomprensibile che solo chi ha la chiave giusta riesce a leggere. Questo processo si chiama **crittografia** — letteralmente, "scrittura nascosta".

La crittografia non è un'invenzione del digitale. Esiste da millenni. Il problema che risolve è sempre lo stesso: come comunicare un'informazione riservata in modo che solo il destinatario possa leggerla, anche se il messaggio viene intercettato?

Giulio Cesare usava già nel 50 a.C. un metodo elementare: sostituiva ogni lettera del messaggio con quella che si trova 3 posizioni dopo nell'alfabeto. A diventava D, B diventava E, e così via. Se un nemico intercettava il messaggio, vedeva solo una sequenza di lettere senza senso. Se conosceva il numero 3 (la "chiave"), poteva decifrarlo.

Questo schema si chiama ancora oggi **cifrario di Cesare**. È banale da rompere — bastano 25 tentativi per provare tutte le possibili traslazioni. Ma il principio che incarna — trasformare un messaggio originale in un testo cifrato usando una chiave — è ancora la base di tutta la crittografia moderna.

---

### Due tipi di crittografia: simmetrica e asimmetrica

La crittografia moderna si divide in due grandi famiglie.

**Crittografia simmetrica**

La stessa chiave serve per cifrare e per decifrare. Chi manda il messaggio e chi lo riceve devono entrambi conoscere la chiave segreta.

Vantaggio: è velocissima computazionalmente.
Problema: come fai a far sapere la chiave al destinatario senza che qualcuno la intercetti nel tragitto? Se mandi la chiave per email, e quella email viene intercettata, tutta la sicurezza crolla.

Questo problema si chiama **problema della distribuzione delle chiavi** — ed è rimasto irrisolto per millenni. La macchina Enigma dei nazisti durante la Seconda Guerra Mondiale usava crittografia simmetrica: ogni giorno la chiave cambiava, e le istruzioni per la chiave del giorno venivano distribuite fisicamente. Quella vulnerabilità — la necessità di distribuire fisicamente le chiavi — era il punto debole che permise ad Alan Turing e al team di Bletchley Park di decifrarla.

**Crittografia asimmetrica (a chiave pubblica)**

Nel 1976, i crittografi Whitfield Diffie e Martin Hellman pubblicarono un'idea rivoluzionaria: si possono usare *due chiavi diverse* matematicamente collegate. Una chiave pubblica che chiunque può conoscere, e una chiave privata che solo il proprietario conosce.

Il meccanismo: quello che viene cifrato con la chiave pubblica può essere decifrato *solo* con la chiave privata corrispondente. Non con la stessa chiave pubblica.

È come una cassetta delle lettere con una fessura aperta: chiunque può infilare un messaggio (usa la chiave pubblica per cifrare), ma solo il proprietario ha la chiave per aprire la cassetta e leggere i messaggi (usa la chiave privata per decifrare).

Questo risolve il problema della distribuzione: puoi pubblicare la tua chiave pubblica ovunque — su un sito web, in una email, su un cartello. Non importa chi la conosce. Solo chi ha la tua chiave privata può leggere i messaggi cifrati con quella pubblica.

---

### Perché è difficile da rompere: i numeri primi enormi

La sicurezza della crittografia asimmetrica moderna (algoritmo **RSA**, inventato nel 1977 da Rivest, Shamir e Adleman) si basa su un fatto matematico: **moltiplicare due numeri primi enormi è facile; fattorizzare il loro prodotto è enormemente difficile**.

Esempio semplificato:
- Scelgo due numeri primi: 17 e 19.
- Il loro prodotto è 323.
- Quanto tempo ci vuole per trovare che 323 = 17 × 19? Poco.
- Adesso prova con due numeri primi di 600 cifre ciascuno. Il loro prodotto ha 1200 cifre. Per trovare i due fattori originali, con i computer più veloci oggi esistenti, ci vorrebbero più anni di quanti ne ha l'universo.

Le chiavi RSA usate nelle comunicazioni bancarie hanno tipicamente 2048 o 4096 bit — producono numeri con centinaia di cifre. Non è sicura perché "nessuno ci ha provato": è sicura perché la matematica garantisce che ci vorrebbe tempo cosmologico per romperla con i metodi attuali.

> 💡 **Attenzione futura:** i computer quantistici potrebbero, in linea teorica, rompere RSA in tempi ragionevoli usando un algoritmo chiamato algoritmo di Shor. Per questo motivo, dal 2022 il NIST (ente USA per gli standard tecnologici) sta standardizzando algoritmi di crittografia *post-quantistica* — progettati per resistere anche ai computer quantistici.

---

### HTTPS: il lucchetto verde nel browser

Quando nel browser vedi `https://` invece di `http://`, sta succedendo questo:

1. Il tuo browser chiede al sito il suo **certificato digitale** — un documento che contiene la sua chiave pubblica e una firma di un'autorità di certificazione fidata (CA — *Certificate Authority*), che garantisce che la chiave pubblica appartiene davvero a quel sito.

2. Il browser verifica la firma del certificato usando la chiave pubblica della CA (pre-installata nel sistema operativo).

3. Browser e server si scambiano chiavi temporanee usando crittografia asimmetrica, per concordare una **chiave simmetrica di sessione** — che sarà poi usata per tutto il traffico (perché è più veloce).

4. Tutto il traffico della sessione è cifrato con quella chiave simmetrica.

Questo protocollo si chiama **TLS** (*Transport Layer Security*). Il vecchio nome era SSL.

> ⚠️ **Attenzione:** il lucchetto verde garantisce che la comunicazione è cifrata e che il sito è chi dice di essere. Non garantisce che il sito sia onesto o legale. Un sito di phishing può avere il lucchetto verde — basta che abbia un certificato valido, che si ottiene facilmente e gratuitamente. Il lucchetto protegge dal *come* i dati viaggiano, non da *chi* li riceve.

---

### Identità digitale e autenticazione

Come dimostra il sistema che sei chi dici di essere online? Attraverso l'**autenticazione**.

**Password**: il metodo più vecchio. Hai un segreto (la password) che solo tu conosci. Il sistema verifica che il segreto sia corretto. Il problema: le password possono essere rubate, indovinate, o intercettate se trasmesse in chiaro.

**Autenticazione a due fattori (2FA)**: oltre alla password, serve un secondo elemento — un codice temporaneo inviato via SMS, generato da un'app, o prodotto da un token fisico. Anche se qualcuno ruba la password, non può accedere senza il secondo fattore.

**Biometria**: impronta digitale, riconoscimento facciale, scansione dell'iride. Il tuo corpo è la chiave. Vantaggio: non puoi dimenticarla. Svantaggio: non puoi cambiarla se viene compromessa — non puoi cambiare le tue impronte digitali come cambi una password.

**Certificati digitali e firma digitale**: la firma digitale permette di dimostrare che un documento è stato creato da una persona specifica e non è stato modificato dopo. Usa la crittografia asimmetrica: il mittente cifra un'impronta del documento (hash) con la propria chiave privata. Chi riceve verifica con la chiave pubblica del mittente. Se l'impronta coincide, il documento è autentico e integro.

---

> **⬛ Box INF/DIG — Cittadinanza digitale (T7):**
> Il GDPR (Regolamento Generale sulla Protezione dei Dati, entrato in vigore nel 2018) impone a tutte le aziende che operano nell'UE di proteggere i dati personali con misure adeguate, inclusa la crittografia. Se un'azienda subisce una violazione di dati (data breach) e i dati non erano cifrati, deve notificarlo alle autorità e agli utenti. La crittografia non è un optional tecnico — è un requisito legale. Capire come funziona ti permette di valutare se i servizi che usi la implementano correttamente.

---

> **🔢 Collegamento STEM — Matematica:**
> La crittografia moderna è matematica applicata. Il cifrario di Cesare usa l'aritmetica modulare (resto della divisione). RSA usa la teoria dei numeri primi e il teorema di Eulero. La crittografia ellittica (ECC, usata nelle app di messaggistica moderne) usa la geometria algebrica. Studiare questi argomenti in matematica non è teoria astratta: è la base della sicurezza di ogni comunicazione digitale.

---

## 🔍 OSSERVA

### Caso studio: come Alan Turing ruppe Enigma

La macchina Enigma, usata dall'esercito tedesco durante la Seconda Guerra Mondiale, era considerata inviolabile. Ogni giorno la chiave cambiava — una combinazione di rotori, cablaggio e impostazioni che produceva circa 158 quintilioni di configurazioni possibili.

Il punto debole non era matematico, era umano:

- **I meteorologi**: ogni giorno, il primo messaggio cifrato inviato dalle stazioni meteorologiche tedesche iniziava quasi sempre con la parola "WETTER" (tempo meteo). Turing e il team usavano questa informazione nota per ridurre lo spazio delle possibili chiavi.

- **La ripetizione**: per motivi di sicurezza, la chiave giornaliera veniva comunicata cifrandola due volte all'inizio di ogni messaggio. Questa ridondanza, pensata per evitare errori di trasmissione, creava invece un pattern sfruttabile.

- **Le abitudini degli operatori**: alcuni operatori usavano sequenze prevedibili per le impostazioni iniziali (es. le iniziali del nome, la data). Questi schemi umani riducevano enormemente lo spazio di ricerca.

La lezione: un sistema crittografico è sicuro quanto il suo anello più debole. Spesso quell'anello più debole non è l'algoritmo — è il comportamento umano.

Gli storici stimano che il lavoro di Bletchley Park abbia accorciato la guerra di 2-4 anni e salvato tra 14 e 21 milioni di vite. Alan Turing, il matematico che progettò la soluzione, fu condannato nel 1952 per la sua omosessualità e sottoposto a castrazione chimica. Morì nel 1954. La Gran Bretagna gli ha riconosciuto la grazia reale postuma nel 2013. Il suo viso è sulla banconota britannica da 50 sterline dal 2021.

---

> ⚠️ **Phishing — il vero rischio nel 2026:**
> La crittografia protegge i messaggi in transito. Non protegge da te stesso. Il phishing — l'arte di ingannare le persone affinché rivelino volontariamente credenziali o dati sensibili — è la forma di attacco informatico più diffusa. Non serve rompere la crittografia se riesci a convincere l'utente a consegnare la password. Le email di phishing moderne sono indistinguibili da quelle legittime. L'unica difesa è la consapevolezza: verificare sempre il mittente, non cliccare su link in email urgenti, usare 2FA.

---

### 👨‍💻 Chi lavora con questa competenza nel 2030?

**Esperto di cybersecurity e analista della sicurezza**

Progetta sistemi di sicurezza, effettua test di penetrazione (cerca intenzionalmente le vulnerabilità dei sistemi prima che lo facciano gli attaccanti), risponde agli incidenti di sicurezza, forma le persone sulle buone pratiche. La cybersecurity è uno dei settori con più offerta di lavoro e carenza di professionisti qualificati a livello globale.

Nel 2024, si stimano oltre 3,5 milioni di posizioni aperte non ricoperte nel settore della cybersecurity a livello mondiale.

*"Nel 90% dei casi, il problema di sicurezza non è il codice — è la persona davanti allo schermo."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica in Zona 5.**

---

### ● BASE — Cifro e decifro con il cifrario di Cesare

**Obiettivo:** applicare manualmente un algoritmo di cifratura e capirne i limiti.

**Parte 1 — Cifratura:**
Cifra questo messaggio con il cifrario di Cesare usando la chiave K=3 (ogni lettera si sposta di 3 posizioni in avanti nell'alfabeto):
`TECNOLOGIA È POTERE`

*(Ignora gli spazi e i caratteri speciali. A→D, B→E, Z→C per i wrap.)*

**Parte 2 — Decifratura:**
Decifra questo messaggio sapendo che è stato cifrato con K=7:
`NLUASVNPH`

**Parte 3 — Attacco a forza bruta:**
Se non conosci la chiave, quanti tentativi devi fare al massimo per decifrare un messaggio cifrato con il cifrario di Cesare sull'alfabeto inglese di 26 lettere? Perché questo numero è il punto debole fondamentale del cifrario?

---

### ●● INTERMEDIO — Analizzo la sicurezza di un sito web

**Obiettivo:** ispezionare i certificati TLS di siti reali e valutare la loro sicurezza.

**Come procedere:**
1. Apri il browser e vai su un sito che usi normalmente (es. la pagina della tua scuola, un servizio di streaming, un sito di notizie).
2. Clicca sull'icona del lucchetto nella barra degli indirizzi → "Il certificato è valido" o equivalente.

**Per ogni sito analizzato, compila questa scheda:**

| Informazione | Sito 1 | Sito 2 | Sito 3 |
|-------------|--------|--------|--------|
| Nome del sito | | | |
| Usa HTTPS? | | | |
| Nome dell'autorità di certificazione (CA) | | | |
| Data di scadenza del certificato | | | |
| Tipo di crittografia (es. TLS 1.3) | | | |

**Domande:**
1. Hai trovato un sito che usa HTTP invece di HTTPS? Se sì, quale tipo di sito è? Quali rischi comporta?
2. Chi è l'autorità di certificazione più comune tra i siti che hai analizzato?
3. Cosa succederebbe se un certificato scadesse e non venisse rinnovato?

---

### ●●● AVANZATO — Progetto un sistema di autenticazione

**Scenario:** stai progettando l'app di una biblioteca scolastica. Gli studenti devono poter accedere ai loro prestiti, alle prenotazioni e ai libri digitali. I dati includono nome, classe e storico di lettura.

**Il tuo compito:**

1. **Modello di minaccia:** identifica almeno 5 rischi di sicurezza per questo sistema (es.: password rubata, account condiviso, accesso fisico non autorizzato al dispositivo...).

2. **Sistema di autenticazione:** progetta il sistema di login. Quali fattori di autenticazione usi? Solo password? 2FA? Come gestisci i recuperi password?

3. **Gestione delle password:** le password non devono mai essere salvate in chiaro nel database. Spiega cos'è l'*hashing* con salt e perché è necessario. (Cerca "hashing con salt" se non lo conosci ancora.)

4. **Politica delle sessioni:** dopo quanto tempo una sessione inattiva dovrebbe scadere automaticamente? Diversifica la risposta per: un computer scolastico condiviso vs. il telefono personale dello studente.

5. **Risposta a un incidente:** se un attaccante riesce ad accedere al database e ottiene gli hash delle password, cosa fai nelle prossime 24 ore? Scrivi un piano di risposta.

6. Scrivi una "Privacy Policy" di 10-12 righe — leggibile da uno studente di 12 anni — che spiega quali dati raccogli, come li proteggi, per quanto tempo li conservi e chi può accedervi.

---

## 🌍 AGISCI

### 📋 Rubrica di valutazione

| Criterio | ● Base | ●● Intermedio | ●●● Avanzato |
|----------|--------|---------------|--------------|
| **1. Principi di crittografia** | Sa che la crittografia trasforma un messaggio in modo illeggibile. Applica correttamente il cifrario di Cesare. | Distingue crittografia simmetrica e asimmetrica. Spiega perché la chiave pubblica può essere pubblica. | Spiega il principio matematico di RSA (difficoltà di fattorizzazione), il protocollo TLS e le sue fasi. |
| **2. Autenticazione** | Conosce le differenze tra password, 2FA e biometria. | Valuta i pro e contro di ogni metodo di autenticazione per contesti diversi. | Progetta un sistema di autenticazione completo con analisi delle minacce e gestione degli incidenti. |
| **3. Analisi critica** | Riconosce che il lucchetto HTTPS non garantisce che un sito sia sicuro o onesto. | Ispeziona certificati TLS reali e interpreta correttamente le informazioni. | Identifica le vulnerabilità umane (phishing, social engineering) come principale vettore di attacco. |
| **4. Consapevolezza civica** | Sa che esistono leggi sulla privacy (GDPR). | Spiega cosa comporta il GDPR per le aziende e per gli utenti. | Scrive una privacy policy comprensibile che rispetta i principi del GDPR. |

---

### Lo scenario

La tua scuola usa un registro elettronico accessibile da casa. Un giorno noti che il sito usa HTTP invece di HTTPS. Il preside non è sicuro di cosa significhi e ti chiede di spiegargli il problema e di proporre una soluzione.

---

### La consegna

1. Scrivi una email al preside (10-12 righe) che spiega — senza gergo tecnico — che rischio concreto esiste con HTTP, e perché passare a HTTPS è urgente.

2. Cerca online i passi necessari per ottenere un certificato TLS gratuito (cerca "Let's Encrypt"). Riassumi il processo in 5 punti semplici.

3. Prepara un mini-volantino (digitale o cartaceo, a scelta) per gli studenti della tua classe con 5 regole per proteggere i propri account online — scritto in linguaggio accessibile, senza tecnicismi.

---

### 🎯 Badge SDG 16

La crittografia e la sicurezza digitale sono fondamentali per la democrazia nell'era digitale: proteggono il voto elettronico, le comunicazioni dei giornalisti con le loro fonti, i messaggi dei dissidenti nei paesi autoritari, i dati medici dei pazienti. Capire come funziona la sicurezza digitale è esercizio di cittadinanza attiva.

---

### 🤖 AI Coach

**[QR CODE]**

- *"Qual è la differenza tra cifratura e hashing?"*
- *"Come funziona la firma digitale?"*
- *"Cosa sono i cookie e come si collegano all'autenticazione?"*

---

### 🪞 Metacognizione

1. Dopo questa MC, guardi diversamente i siti web che usi? C'è qualcosa che verificheresti che prima ignoravi?

2. Hai mai ricevuto un'email di phishing? Adesso che sai come funziona, riesci a identificare i segnali di allarme?

3. Alan Turing è morto disonorato nonostante avesse salvato milioni di vite. Cosa pensi del modo in cui la società tratta i contributi di persone che non corrispondono alle norme del tempo?

4. Se le password non bastano più, qual è secondo te il sistema di autenticazione del futuro?

---

*MC versione 1.0 — Maggio 2026 · Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025)*
