# MC-INF-3-01 — Quando gli oggetti parlano: sensori, dati e Internet delle Cose
**Area:** Informatica · **Anno:** 3ª · **Livello DigComp:** Advanced (A)
**SDG:** 9 — Imprese, innovazione e infrastrutture · **Fonte:** originale
**Struttura:** 6 pagine (layout Advanced) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il pacemaker testimone"**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 40 sec.*
> *(Script completo: MC-INF-3-01_hook-script.md)*

**Domanda di avvio:**
In questo momento, quanti dispositivi intorno a te stanno raccogliendo dati?

Non solo il tuo telefono. Il termostato, il router, il rilevatore di fumo, la TV, il braccialetto fitness di qualcuno in famiglia... Nel 2024, i dispositivi IoT attivi nel mondo hanno superato i 17 miliardi. Più del doppio della popolazione terrestre. E ognuno di loro produce dati, continuamente, anche quando non lo sai.

---

## 📖 ESPLORA

### Il mondo fisico parla digitale — se sai ascoltarlo.

Nel 2008 è accaduta una cosa silenziosa ma storica: per la prima volta, il numero di dispositivi connessi a internet ha superato il numero di esseri umani sul pianeta. Non è stata una notizia di prima pagina. Ma da quel momento, internet non è più solo una rete di computer e telefoni — è diventata una rete che include oggetti fisici: lampadine, automobili, sensori industriali, pacemaker, reti elettriche, campi coltivati.

Questa rete si chiama **IoT — Internet of Things**, Internet delle Cose. Il principio è semplice: qualsiasi oggetto fisico dotato di un sensore, una connessione e un po' di logica computazionale può essere parte della rete — misurare grandezze del mondo reale, trasmettere dati, ricevere istruzioni e agire di conseguenza.

---

### Cos'è un sensore: dalla grandezza fisica al dato digitale

Un **sensore** è un dispositivo che rileva una grandezza fisica — temperatura, pressione, luminosità, accelerazione, umidità, frequenza cardiaca, qualità dell'aria — e la converte in un segnale elettrico misurabile.

Il processo ha due fasi:

**1. Trasduzione:** il sensore converte la grandezza fisica in un segnale elettrico analogico. Un sensore di temperatura come il termistore varia la propria resistenza elettrica in funzione della temperatura. Più è caldo, più cambia la resistenza — e la variazione di resistenza si traduce in una variazione di tensione misurabile.

**2. Conversione analogico-digitale (ADC):** il segnale elettrico analogico — una grandezza continua che può assumere infiniti valori — viene convertito in un numero digitale — una grandezza discreta con un numero finito di valori. Questa operazione si chiama campionamento.

Il campionamento ha due parametri fondamentali:
- **Frequenza di campionamento:** quante volte al secondo il sensore misura il valore. Un sensore che campiona 100 volte al secondo produce 100 misure per secondo.
- **Risoluzione:** quanti bit usa per rappresentare ogni misura. Con 8 bit si hanno 256 livelli di precisione; con 12 bit si hanno 4096 livelli; con 16 bit si hanno 65536 livelli.

La scelta di questi parametri determina la qualità del dato e la quantità di dati prodotta.

---

### Architettura di un sistema IoT

Un sistema IoT completo ha quattro strati.

**Strato 1 — I dispositivi fisici (Things)**
I sensori e gli attuatori. I sensori *misurano* (temperatura, pressione, movimento). Gli attuatori *agiscono* (accendono una luce, aprono una valvola, inviano un allarme). Un dispositivo può avere sia sensori che attuatori.

**Strato 2 — La connettività**
Come i dispositivi comunicano. Le opzioni sono molte, con compromessi diversi:

| Protocollo | Raggio | Consumo energetico | Uso tipico |
|------------|--------|-------------------|-----------|
| Bluetooth Low Energy (BLE) | ~10 m | Molto basso | Braccialetti fitness, cuffie |
| Wi-Fi | ~50 m (interno) | Medio-alto | Termostati, telecamere domestiche |
| Zigbee/Z-Wave | ~100 m | Basso | Domotica |
| LoRaWAN | ~15 km | Bassissimo | Sensori agricoltura, città |
| 4G/5G | Illimitato | Alto | Veicoli, dispositivi mobili |
| NB-IoT | Nazionale | Bassissimo | Contatori gas/acqua, sensori smart city |

**Strato 3 — Il cloud / edge computing**
I dati arrivano a server remoti (cloud) o vengono elaborati direttamente sul dispositivo o su un nodo intermedio (edge computing). Il vantaggio dell'edge è la latenza: se un sensore in una fabbrica rileva un'anomalia pericolosa, non può aspettare che il dato arrivi al cloud e torni — deve reagire in millisecondi.

**Strato 4 — Le applicazioni**
I dati vengono analizzati, visualizzati e usati per prendere decisioni: dashboard di monitoraggio, sistemi di allerta, algoritmi di machine learning che trovano anomalie, interfacce utente.

---

### Dati: volumi, velocità, varietà

I sistemi IoT producono quantità di dati senza precedenti. Nel 2025, si stima che i dispositivi IoT producano circa 73 zettabyte di dati all'anno — un numero che raddoppia ogni due anni.

Questo pone sfide concrete:
- **Volume:** dove si immagazzinano tutti questi dati? Non si può salvare tutto — bisogna decidere cosa tenere, per quanto tempo, con quale granularità.
- **Velocità:** i dati in tempo reale richiedono architetture di elaborazione diverse dai dati storici.
- **Varietà:** dati strutturati (temperature, numeri) coesistono con dati non strutturati (immagini da telecamere, audio da microfoni).
- **Veridicità:** un sensore difettoso produce dati sbagliati. Un'applicazione che si fida ciecamente di questi dati prende decisioni sbagliate. Come si verifica l'affidabilità di un sensore?

---

### Sicurezza e privacy nell'IoT

I dispositivi IoT sono notoriamente il punto debole più vulnerabile delle reti informatiche. Molti hanno firmware non aggiornabile, password di default mai cambiate, connessioni non cifrate.

Nel 2016, la botnet Mirai ha sfruttato milioni di telecamere di sicurezza e router domestici con le password di fabbrica mai cambiate, usandoli per lanciare uno degli attacchi DDoS più grandi della storia, abbattendo temporaneamente Netflix, Twitter e gran parte dell'internet americano.

La privacy è una questione altrettanto seria. Ogni sensore che ti monitora — per proteggerti, per farti risparmiare energia, per migliorare la tua salute — produce dati che esistono da qualche parte, per qualcuno. Nel 2017, in un processo penale nel Connecticut, i dati di un pacemaker sono stati usati come prove in tribunale: il dispositivo registrava frequenza cardiaca, passi e attività fisica. Quei dati contraddicevano la versione dell'imputato.

La domanda non è "il mio dispositivo mi spia?". La domanda è: **chi ha accesso ai miei dati, per quanto tempo, per quali scopi, con quale base legale?**

---

> **🌍 Box Tecnologia e Società:**
> L'IoT crea asimmetrie di potere. Le aziende che costruiscono i dispositivi raccolgono dati comportamentali a scala massiccia. Gli utenti difficilmente comprendono cosa viene raccolto e come viene usato. Il GDPR europeo impone consenso esplicito e minimizzazione dei dati — ma molti dispositivi IoT, prodotti fuori dall'UE, non rispettano questi standard. Scegliere dispositivi IoT responsabilmente è una questione di consapevolezza digitale e di diritti civili.

---

> **🔢 Collegamento STEM — Fisica e Matematica:**
> La conversione analogico-digitale è fisica e matematica applicata. Il teorema di Nyquist-Shannon (1928/1949) stabilisce che per ricostruire fedelmente un segnale continuo, la frequenza di campionamento deve essere almeno il doppio della frequenza massima del segnale. Per l'audio (voce umana fino a ~20 kHz), la frequenza minima di campionamento è quindi 40 kHz — ecco perché i CD usano 44.100 Hz. Capire questo teorema è capire perché la qualità audio digitale ha un limite fisico preciso.

---

## 🔍 OSSERVA

### Caso studio: la rete di sensori di una smart city

Barcellona è stata una delle prime città al mondo a implementare una rete IoT urbana su larga scala, a partire dal 2012. Il sistema, chiamato Sentilo, gestisce sensori in tutta la città.

**Cosa misurano i sensori:**
- Livello dei cestini della spazzatura (per ottimizzare i percorsi di raccolta)
- Disponibilità dei parcheggi (ogni posto ha un sensore magnetico nel manto stradale)
- Qualità dell'aria (CO₂, PM2.5, NO₂, ozono)
- Consumo energetico degli edifici pubblici in tempo reale
- Temperatura e umidità nelle strade (per attivare l'irrigazione intelligente dei parchi)
- Portata delle fognature (per prevenire allagamenti)

**I risultati misurati (dati pubblici della città di Barcellona):**
- Riduzione del 25% nel consumo d'acqua per l'irrigazione
- Riduzione del 30% nell'illuminazione pubblica
- Risparmio stimato di 42 milioni di euro all'anno
- Riduzione del 15% nel traffico nelle zone monitorate

**Le tensioni:**
- Il sistema raccoglie dati sul comportamento dei cittadini nello spazio pubblico. Chi controlla questi dati? Per quanto tempo vengono conservati?
- Alcuni sensori di "parcheggio" registrano anche le targhe dei veicoli. Questo è lecito?
- Cosa succede quando i sensori si guastano? Le decisioni di gestione urbana che dipendono da dati sbagliati possono essere peggiori di nessuna decisione.

---

### 👨‍💻 Chi lavora con questa competenza nel 2030?

**Ingegnere IoT e Architect di sistemi embedded**

Progetta l'hardware e il software dei dispositivi IoT: sceglie i sensori, progetta i circuiti, scrive il firmware (il software che gira direttamente sul chip), definisce i protocolli di comunicazione, dimensiona l'architettura cloud. Lavora a cavallo tra elettronica, informatica e data engineering.

**Data Engineer per sistemi in tempo reale**

Costruisce le pipeline che raccolgono, puliscono e distribuiscono i flussi di dati provenienti dai sensori. Usa strumenti come Apache Kafka (per la gestione di stream di dati) e Apache Flink (per l'elaborazione in tempo reale).

*"I dati del sensore sono rumorosi, ritardati e incompleti per definizione. Il tuo sistema deve funzionare lo stesso."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica in Zona 5.**

---

### ● BASE — Mappa i sensori intorno a me

**Obiettivo:** identificare i dispositivi IoT nell'ambiente quotidiano e capire cosa misurano.

**Come procedere:**
Scegli un ambiente che conosci bene (casa, scuola, negozio, palestra). Conduci un'ispezione sistematica e compila la tabella.

| Dispositivo trovato | Grandezza misurata | Protocollo di connessione (se riconosci) | Dove vanno i dati? | Chi li usa? |
|--------------------|--------------------|------------------------------------------|-------------------|-------------|
| (es.) Termostato Nest | Temperatura | Wi-Fi | Google Cloud | Azienda + tu |
| ... | ... | ... | ... | ... |

**Trova almeno 10 dispositivi.**

Poi rispondi:
1. Quanti di questi dispositivi erano presenti in questo stesso ambiente 10 anni fa?
2. Per ognuno: i dati rimangono nel dispositivo, o vengono inviati a un server esterno?
3. Hai trovato dispositivi che trasmettono dati senza che il proprietario lo sapesse chiaramente?

---

### ●● INTERMEDIO — Analizzo dati da un sensore reale

**Obiettivo:** lavorare con dati reali di sensori e identificare pattern, anomalie e limiti.

Il dataset seguente contiene 24 ore di misurazioni di un sensore di temperatura in un'aula scolastica (una misura ogni 15 minuti — 96 misure totali). Usa i valori che il docente ti fornirà, oppure accedi al dataset pubblico tramite il QR code.

**Compiti:**

1. Calcola: temperatura media, massima e minima nelle 24 ore. A che ora è il picco?

2. Identifica almeno 2 anomalie nei dati (valori che sembrano sbagliati o incoerenti con il contesto).

3. Come distingui un'anomalia reale (la finestra è stata aperta) da un errore del sensore (il sensore ha avuto un malfunzionamento temporaneo)? Che informazioni aggiuntive ti servirebbero?

4. Il sistema di riscaldamento dovrebbe attivarsi quando la temperatura scende sotto 18°C e spegnersi quando supera 22°C. Scrivi l'algoritmo di controllo in pseudocodice.

5. Se campionassi ogni ora invece che ogni 15 minuti, cosa perderesti? Usa i tuoi dati per rispondere concretamente.

---

### ●●● AVANZATO — Progetto un sistema IoT per la scuola

**Scenario:** la tua scuola vuole installare un sistema di monitoraggio della qualità dell'aria nelle aule (CO₂, temperatura, umidità) per migliorare le condizioni di apprendimento. Il budget è limitato.

**Il tuo compito:**

**1. Analisi dei requisiti**
Definisci: cosa misuri (e perché queste grandezze specifiche), con quale frequenza, con quale precisione, in quante aule.

**2. Scelta dei sensori**
Ricerca online almeno 3 sensori di CO₂ disponibili sul mercato. Per ognuno documenta: prezzo, accuratezza, protocollo di comunicazione, consumo energetico, durata di vita stimata.

**3. Architettura del sistema**
Disegna l'architettura: come comunicano i sensori? Usi Wi-Fi, Zigbee, o altro? Dove vengono elaborati i dati (sul dispositivo, su un Raspberry Pi locale, su cloud)? Come si accede ai dati?

**4. Privacy e sicurezza**
Elenca i dati che il sistema raccoglie. I dati di CO₂ e temperatura sono personali ai sensi del GDPR? Cosa succede se qualcuno riesce ad accedere al sistema? Come lo proteggi?

**5. Dashboard**
Progetta su carta una dashboard che un docente possa leggere a colpo d'occhio: quali informazioni mostra? Quali soglie attivano un allarme? Come si attiva la ventilazione automatica?

**6. Analisi costi-benefici**
Calcola il costo totale di installazione (sensori + connettività + server). Confrontalo con i benefici attesi (produttività degli studenti, riduzione dei consumi energetici). Il sistema vale l'investimento? Motiva con dati.

---

## 🌍 AGISCI

### 📋 Rubrica di valutazione

| Criterio | ●● Intermedio | ●●● Avanzato | ●●●● Eccellente |
|----------|--------------|--------------|-----------------|
| **1. Comprensione tecnica** | Spiega correttamente il processo di campionamento e conversione ADC. | Applica il teorema di Nyquist, calcola requisiti di banda e storage. | Valuta i compromessi tra frequenza, risoluzione, consumo e costo in un progetto reale. |
| **2. Architettura di sistema** | Identifica i 4 strati di un sistema IoT e i protocolli principali. | Progetta un'architettura IoT completa con scelte giustificate. | Ottimizza l'architettura considerando latenza, banda, costo e affidabilità. |
| **3. Analisi dei dati** | Calcola statistiche di base su un dataset di sensori. Identifica anomalie evidenti. | Distingue anomalie reali da errori di sensore. Progetta algoritmi di controllo basati sui dati. | Valuta la qualità dei dati, propone strategie di validazione e gestisce la perdita di dati. |
| **4. Dimensione etica** | Riconosce che i dati IoT sollevano questioni di privacy. | Applica i principi del GDPR a un sistema IoT reale e identifica le responsabilità. | Analizza le asimmetrie di potere create dai sistemi IoT e propone meccanismi di governance. |

---

### Lo scenario

Il Comune della tua città ha lanciato un bando per installare sensori di qualità dell'aria in 5 punti strategici (vicino a scuole, ospedali, parchi). I dati saranno pubblici. La tua classe ha deciso di partecipare con una proposta.

---

### La consegna

1. Scrivi la proposta tecnica (15-20 righe): cosa misurate, dove, con quale tecnologia, a quale costo.

2. Disegna lo schema dell'architettura del sistema.

3. Prepara una presentazione pubblica (5 slide) per i cittadini del quartiere: spiega cosa fanno i sensori, chi accede ai dati, per quanto tempo vengono conservati, e cosa succede se i dati vengono usati per scopi diversi da quelli dichiarati.

4. Scrivi 3 domande che un cittadino preoccupato per la privacy potrebbe farti — e le risposte che daresti.

---

### 🎯 Badge SDG 9

L'IoT è infrastruttura del futuro: rende le città più efficienti, l'agricoltura più sostenibile, la medicina più precisa. Ma costruirla bene richiede competenze tecniche, consapevolezza etica e capacità di progettare sistemi che rispettino la dignità e la privacy delle persone.

---

### 🤖 AI Coach

**[QR CODE]**

- *"Qual è la differenza tra edge computing e cloud computing per l'IoT?"*
- *"Come funziona LoRaWAN?"*
- *"Cosa significa che un dato è 'rumoroso'?"*

---

### 🪞 Metacognizione

1. Prima di questa MC, sapevi quanti dispositivi intorno a te raccolgono dati? Come cambia la tua relazione con gli oggetti dopo questa MC?

2. Qual è il confine tra un sistema IoT utile e un sistema di sorveglianza? Esiste una risposta oggettiva, o dipende dal contesto e dai valori?

3. Il caso del pacemaker-testimone ti sembra un uso legittimo dei dati raccolti da un dispositivo medico? E se invece quei dati fossero stati usati da una compagnia assicurativa per negarti una polizza?

4. Se dovessi scegliere tra un termostato intelligente che ti fa risparmiare il 20% di energia ma invia i tuoi dati comportamentali al produttore, e un termostato tradizionale che non risparmia niente ma non raccoglie dati, quale sceglieresti? Motiva.

---

*MC versione 1.0 — Maggio 2026 · Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025)*
