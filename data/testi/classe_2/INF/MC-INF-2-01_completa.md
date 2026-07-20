# MC-INF-2-01 — Chi organizza tutto quello che succede dentro al computer?
**Area:** Informatica · **Anno:** 2ª · **Livello DigComp:** Intermediate (I)
**SDG:** 9 — Imprese, innovazione e infrastrutture · **Fonte:** Hypertech 2020 + originale
**Struttura:** 4 pagine (doppio spread espanso) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il bibliotecario invisibile"**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 30 sec.*
> *(Script completo: MC-INF-2-01_hook-script.md)*

**Domanda di avvio:**
In questo momento, mentre leggi questo testo, quante cose sta facendo contemporaneamente il tuo computer o il tuo telefono?

Non è una domanda retorica. Conta: il sistema operativo, il browser o l'app, la connessione Wi-Fi, le notifiche, la sincronizzazione cloud, il controllo della batteria, il monitoraggio della temperatura del processore... Decine di programmi. Un solo processore. Chi decide chi va prima?

---

## 📖 ESPLORA

### Senza sistema operativo, il computer è un blocco di silicio inutile.

Quando accendi un computer — qualsiasi computer — la prima cosa che succede non è che si apre il browser o la tua app preferita. La prima cosa che succede è che parte un programma enorme e invisibile chiamato **sistema operativo** (in inglese *Operating System*, abbreviato **OS**).

Il sistema operativo è il programma che gestisce tutto il resto. Senza di lui, nessun'altra applicazione potrebbe funzionare. Ogni app che usi chiede al sistema operativo di accedere alla memoria, di leggere un file, di inviare dati in rete, di disegnare qualcosa sullo schermo. Il sistema operativo decide quando e come concedere queste risorse — a volte accettando, a volte rimandando, a volte rifiutando.

Lo studente Gary Kildall, ingegnere informatico di Pacific Grove, California, ha creato il primo sistema operativo commerciale per microcomputer nel 1974: si chiamava CP/M. Senza quel lavoro, ogni programma avrebbe dovuto reimplementare da zero tutte le funzioni di base. Kildall ha capito che ci voleva uno strato intermedio tra l'hardware e i programmi applicativi — uno strato che gestisse la complessità e nascondesse i dettagli hardware ai programmatori.

---

### Le funzioni principali del sistema operativo

Un sistema operativo moderno svolge quattro funzioni fondamentali.

**1. Gestione dei processi**

Un **processo** è un programma in esecuzione. Ogni volta che apri un'app, il sistema operativo crea un processo. Quando chiudi l'app, il processo viene terminato.

Il problema è che un processore fisico può eseguire solo un processo alla volta. Se apri 20 applicazioni, il sistema operativo deve simulare l'esecuzione parallela assegnando a ciascun processo brevi frazioni di tempo del processore — ogni pochi millisecondi, cambia il processo attivo. Questa tecnica si chiama **multitasking** ed è così veloce da sembrare simultanea.

Il sistema operativo decide anche le *priorità*: un processo di sistema critico ha più priorità di un'app musicale in background. Se la CPU è sotto pressione, l'app musicale si mette in pausa.

**2. Gestione della memoria**

La RAM è condivisa tra tutti i processi attivi. Il sistema operativo tiene traccia di quali zone di memoria sono occupate e da chi, assegna nuovi blocchi quando un processo ne ha bisogno e li libera quando il processo termina.

Cosa succede se la RAM è piena? Il sistema operativo usa una parte dello storage (SSD o HDD) come memoria virtuale aggiuntiva — una zona chiamata **swap** o *file di paging*. È molto più lenta della RAM, ma permette di continuare a lavorare. Ecco perché il computer si rallenta quando la RAM è esaurita: sta leggendo e scrivendo su disco invece che sulla RAM.

**3. Gestione del file system**

Come vengono organizzati i file sullo storage? Attraverso il **file system** — un sistema di organizzazione gerarchica a **struttura ad albero**: cartelle che contengono altre cartelle, che contengono file.

Ogni file system ha una **radice** (in Windows è `C:\`, in Linux e macOS è `/`). Da lì si ramificano tutte le cartelle. Ogni file ha un **percorso** — una sequenza di cartelle che indica dove si trova: `C:\Utenti\Giulia\Documenti\relazione.docx` è un percorso in Windows.

I file system mantengono anche i **metadati** di ogni file: nome, dimensione, data di creazione, data di ultima modifica, permessi di accesso (chi può leggere, chi può scrivere, chi può eseguire).

**4. Gestione delle periferiche (driver)**

Ogni periferica — stampante, tastiera, mouse, scheda di rete, USB — ha il suo linguaggio proprietario. Il sistema operativo usa piccoli programmi specializzati chiamati **driver** per tradurre tra il linguaggio di ogni periferica e il linguaggio standard che le applicazioni usano. Quando colleghi una nuova periferica, il sistema operativo cerca il driver giusto (o te lo chiede) e installa il traduttore.

---

### I sistemi operativi più diffusi

| OS | Produttore | Uso principale | Note |
|----|-----------|----------------|------|
| Windows 11 | Microsoft | Computer desktop/laptop | ~72% dei PC desktop mondiali |
| macOS | Apple | Computer Mac | Integrato con ecosistema Apple |
| Linux (varie distro) | Open source (Linus Torvalds, 1991) | Server, programmatori, embedded | Base del 96% dei server mondiali |
| Android | Google | Smartphone/tablet | ~72% degli smartphone mondiali |
| iOS | Apple | iPhone/iPad | Sistema chiuso, app solo da App Store |

> 💡 **Lo sapevi?** Il sistema operativo più usato al mondo per i server — quelle macchine che gestiscono internet, i servizi cloud, le banche — è Linux. È gratuito, open source (il codice è pubblico e chiunque può modificarlo) e gira su quasi tutto: dai supercomputer agli smartwatch ai router di casa.

---

### Interfaccia grafica vs. riga di comando

I sistemi operativi moderni offrono due modi per interagire:

**Interfaccia grafica (GUI — *Graphical User Interface*)**: finestre, icone, menu, mouse. Quella che usi normalmente. È intuitiva ma limitata: puoi fare solo quello che i menu permettono.

**Riga di comando (CLI — *Command Line Interface*)**: si scrivono comandi testuali. In Windows si chiama PowerShell o Prompt dei comandi, in Linux/macOS si chiama Terminale. È meno intuitiva ma molto più potente: puoi automatizzare operazioni ripetitive, accedere a funzioni nascoste, gestire server remoti.

Esempio: per rinominare 500 file aggiungendo la data a tutti i nomi, con la GUI dovresti farlo uno per uno. Con la riga di comando, basta una sola istruzione che gira su tutti.

---

> **⬛ Box DIG/INF:** la competenza digitale ti insegna a usare il file system per organizzare i tuoi file efficacemente — cartelle con nomi logici, struttura coerente, backup regolari. La competenza informatica ti insegna come funziona il file system internamente: come il sistema operativo sa dove si trovano i dati sullo storage, come gestisce i permessi, cosa succede quando un file viene "eliminato" (spesso non viene davvero cancellato subito — viene marcato come spazio disponibile, e i dati rimangono finché un altro file li sovrascrive).

---

> **🔢 Collegamento STEM — Matematica:**
> La struttura ad albero del file system è una struttura dati fondamentale in matematica e informatica. Un albero è un grafo connesso senza cicli: ogni nodo (cartella) può avere un solo nodo padre e zero o più nodi figli. La profondità di un percorso è il numero di nodi dalla radice al file. Queste strutture appaiono ovunque: nell'organizzazione di dati, nei motori di ricerca, nelle reti neurali.

---

## 🔍 OSSERVA

### Caso studio: cosa succede in 3 secondi all'avvio di Windows

Quando premi il pulsante di accensione, non succede niente di magico. Succede una sequenza di passi precisissimi.

**0–0,1 secondi — POST (Power-On Self-Test):**
Il firmware UEFI (il successore del BIOS) controlla che tutti i componenti hardware siano presenti e funzionanti: CPU, RAM, storage, scheda grafica. Se qualcosa non va, si ferma con un codice di errore.

**0,1–0,5 secondi — Boot loader:**
Il firmware trova il boot loader del sistema operativo (un piccolo programma nello storage) e gli passa il controllo.

**0,5–1,5 secondi — Caricamento del kernel:**
Il kernel — il nucleo del sistema operativo — viene caricato in memoria. Il kernel inizializza la gestione dei processi, della memoria e delle periferiche. In Linux, il kernel è scritto da Linus Torvalds e contribuenti da tutto il mondo: è uno dei programmi con più righe di codice mai scritti (~27 milioni di righe nel 2023).

**1,5–3 secondi — Avvio dei servizi:**
Il sistema operativo avvia i processi di sistema fondamentali in background: il gestore della rete, il motore audio, i servizi di sincronizzazione, il gestore delle notifiche. Ognuno di questi è un processo separato.

**3 secondi — Login:**
Compare la schermata di login. Da questo momento, sei tu a controllare — ma il sistema operativo non si ferma mai: continua a gestire centinaia di processi in background mentre lavori.

---

> ⚠️ **Problema che nessuno ti dice:** quando "cancelli" un file nel cestino e poi svuoti il cestino, i dati del file rimangono fisicamente sullo storage fino a quando un altro file non li sovrascrive. Esistono programmi forensi usati dalla polizia per recuperare dati "cancellati" anche dopo mesi. Per cancellare davvero un file in modo irrecuperabile bisogna usare strumenti di sovrascrittura sicura. Questo ha implicazioni importanti sulla privacy — specialmente quando vendi o butti un dispositivo usato.

---

### 👨‍💻 Chi lavora con questa competenza nel 2030?

**Amministratore di sistemi (SysAdmin) e Site Reliability Engineer (SRE)**

Gestisce l'infrastruttura informatica di un'azienda: server, reti, sistemi operativi, backup, sicurezza. Il SysAdmin moderno lavora con comandi da terminale, automatizza le operazioni con script, monitora le prestazioni dei sistemi e interviene quando qualcosa si rompe — spesso nel mezzo della notte. L'SRE è la versione più moderna del SysAdmin: usa software engineering per rendere i sistemi più affidabili e scalabili.

Dove lavora: aziende tecnologiche, banche, ospedali, enti pubblici, cloud provider.

*"Il sistema operativo è come il sistema circolatorio di un organismo digitale: non lo vedi, ma se si ferma, si ferma tutto."*


**Cloud Infrastructure Engineer**

Applica i principi del sistema operativo su scala planetaria. Invece di gestire un solo computer, progetta e controlla migliaia di server virtuali sulle piattaforme cloud (AWS, Google Cloud, Azure): decide come distribuire processi, memoria e archiviazione tra data center in continenti diversi, automatizza tutto con il codice e fa in modo che un'app resti online anche quando un intero data center va in blackout.

Dove lavora: cloud provider, aziende tecnologiche, banche, pubblica amministrazione digitale, startup in crescita.

Competenze chiave che inizi a costruire qui: cloud computing · virtualizzazione · container e orchestrazione · DevOps

*"Gestisco migliaia di server che non ho mai toccato: il mio terminale è la sala macchine del mondo."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica in Zona 5.**

---

### ● BASE — Esploro il file system del mio dispositivo

**Obiettivo:** navigare il file system e comprendere la struttura ad albero.

**Come procedere:**

Su **Windows:** apri Esplora file → premi sull'unità C: → esplora le cartelle principali.
Su **Mac:** apri Finder → menu Vai → Computer.
Su **smartphone Android:** apri Gestione file.
Su **smartphone iPhone:** apri l'app File.

**Compiti:**
1. Disegna su carta una mappa della struttura di cartelle del tuo dispositivo — almeno 3 livelli di profondità a partire dalla radice. Usa la struttura ad albero (nodi e rami).

2. Trova la cartella dove vengono salvate le foto. Qual è il percorso completo (es. `/Users/nome/Pictures`)?

3. Trova una cartella di sistema che non puoi aprire o che richiede permessi speciali. Qual è? Perché secondo te è protetta?

4. Quanti file ci sono nella tua cartella Documenti (o equivalente)? E quante sottocartelle?

---

### ●● INTERMEDIO — Analizzo i processi in esecuzione

**Obiettivo:** osservare i processi attivi e capire come il sistema operativo gestisce le risorse.

**Come procedere:**

Su **Windows:** premi Ctrl+Shift+Esc per aprire il Task Manager → scheda Processi.
Su **Mac:** apri Monitoraggio Attività (cerca in Spotlight).
Su **Linux:** usa il comando `top` o `htop` nel terminale.
Su **Android:** Impostazioni → Gestione applicazioni → App in esecuzione.

**Compiti:**

1. Quanti processi sono attivi in questo momento sul tuo dispositivo? Elencane almeno 10 con il loro nome.

2. Quale processo usa più CPU in questo momento? Quale usa più RAM?

3. Trova un processo che non sai cosa fa. Cerca il suo nome online e scopri a quale applicazione appartiene.

4. Apri un'app pesante (es. browser con molte schede). Come cambia l'uso della RAM? Come cambia l'uso della CPU?

5. Termina (kill) un processo non critico. Cosa succede all'applicazione corrispondente? Riesci a riaprirla normalmente?

**Attenzione:** non terminare processi di sistema (quelli con nomi come *svchost*, *kernel*, *systemd*) — potresti instabilizzare il sistema.

---

### ●●● AVANZATO — Progetto la struttura di un file system

**Scenario:** sei il responsabile IT di una redazione giornalistica con 15 giornalisti, 3 fotografi e 2 editor video. Devono condividere file su un server comune. Devi progettare la struttura del file system.

**Requisiti:**
- Ogni giornalista deve avere una cartella personale inaccessibile agli altri.
- Ci deve essere una cartella condivisa per gli articoli in lavorazione, accessibile a tutti in lettura/scrittura.
- Ci deve essere un archivio storico degli articoli pubblicati, accessibile a tutti in sola lettura.
- Le foto devono essere organizzate per data (anno/mese) e per fotografo.
- I video devono essere separati dai materiali testuali.
- I backup automatici devono andare in una cartella separata.

**Il tuo compito:**

1. Disegna l'albero completo della struttura di cartelle (almeno 4 livelli).

2. Per ogni cartella principale, specifica i permessi: chi può leggere, chi può scrivere, chi può eliminare.

3. Scrivi una policy di denominazione dei file per gli articoli (es. `AAAA-MM-GG_autore_titolo-breve.docx`). Motiva ogni scelta.

4. Quale struttura usi per i backup? Con quale frequenza? Come gestisci le versioni precedenti degli articoli?

5. Scrivi un documento di 10-12 righe che spiega le tue scelte al direttore della redazione, senza usare gergo tecnico.

---

## 🌍 AGISCI

### 📋 Rubrica di valutazione

| Criterio | ● Base | ●● Intermedio | ●●● Avanzato |
|----------|--------|---------------|--------------|
| **1. Funzioni OS** | Descrive almeno 2 funzioni del sistema operativo con un esempio concreto. | Descrive tutte e 4 le funzioni principali con esempi precisi. | Spiega le interazioni tra le funzioni (es. come gestione memoria e processi sono collegate) con un caso reale. |
| **2. File system** | Naviga il file system e trova file/cartelle specificati. | Costruisce un albero della struttura di cartelle e spiega la logica di organizzazione. | Progetta un file system per un caso d'uso complesso con requisiti di permessi, backup e policy di naming. |
| **3. Processi** | Identifica alcuni processi attivi e li associa alle applicazioni. | Analizza l'uso di CPU e RAM dei processi e interpreta i dati del task manager. | Spiega il multitasking, la memoria virtuale e le priorità dei processi con esempi verificabili. |
| **4. Pensiero sistemico** | Capisce che il sistema operativo è un intermediario tra hardware e software. | Spiega perché senza OS ogni programma dovrebbe reimplementare le funzioni di base. | Discute i compromessi tra sistemi OS aperti (Linux) e chiusi (iOS) in termini di sicurezza, libertà e manutenibilità. |

---

### Lo scenario

La tua classe deve gestire una cartella condivisa su Google Drive (o un server scolastico) per il progetto interdisciplinare di fine anno. Ci sono 25 studenti, 4 materie coinvolte, materiali di tipo diverso (testi, foto, video, presentazioni) e la necessità che ogni gruppo possa lavorare sui propri file senza interferire con gli altri.

---

### La consegna

1. Progetta la struttura di cartelle per il progetto. Disegnala come albero e spiega la logica.

2. Definisci le regole di denominazione dei file (esempio: `materia_gruppo_data_versione.estensione`).

3. Identifica i rischi principali (perdita di file, sovrascrittura accidentale, accessi indesiderati) e proponi come gestirli.

4. Scrivi un mini-manuale di 8-10 righe per i tuoi compagni che spiega come usare correttamente la cartella condivisa.

---

### 🎯 Badge SDG 9

Progettare un'infrastruttura digitale ben organizzata è la base di qualsiasi sistema informatico funzionante — dalla piccola redazione scolastica al server che gestisce milioni di utenti. Capire come funziona il sistema operativo è la competenza che permette di diagnosticare problemi, prendere decisioni informate sugli strumenti da usare e costruire sistemi affidabili.

---

### 🤖 AI Coach

**[QR CODE]**

- *"Qual è la differenza tra RAM e memoria virtuale?"*
- *"Cosa succede quando un processo va in crash?"*
- *"Come funziona il multitasking su un processore con un solo core?"*

---

### 🪞 Metacognizione

1. Prima di questa MC, sapevi che il tuo dispositivo aveva decine di processi in esecuzione contemporaneamente? Come cambia il modo in cui lo vedi adesso?

2. Hai mai perso un file perché non sapevi dove era salvato? Adesso che sai come funziona il file system, come organizzeresti diversamente i tuoi file?

3. Qual è la funzione del sistema operativo che ti ha sorpreso di più? Perché?

4. Il tuo sistema operativo è aperto (Linux/Android) o chiuso (Windows/iOS/macOS)? Quali vantaggi e svantaggi hai identificato nella tua scelta?

---

### 🔗 Collegamento con MC-INF-2-02

Ora che sai come il sistema operativo gestisce i processi e i file, la domanda diventa: come si protegge tutto questo da chi vuole accedere senza autorizzazione? È il tema della crittografia e della sicurezza — MC-INF-2-02.

---

## APPENDICE — Tech in English

| Italiano | English |
|----------|---------|
| sistema operativo | operating system (OS) |
| processo | process |
| file system | file system |
| driver | driver |
| multitasking | multitasking |
| memoria virtuale | virtual memory / swap |
| interfaccia grafica | GUI (Graphical User Interface) |
| riga di comando | CLI (Command Line Interface) |
| percorso | path |
| permessi | permissions |

---

*MC versione 1.0 — Maggio 2026 · Fonte: Hypertech 2020 + originale · Allineata IN 2025*
