# PROGETTO: Libro di Tecnologia + Sistema Agenti + App Personalizzata
**Documento di architettura — versione 2.2**
Data: Aprile 2026 — revisione maggiore Maggio 2026
Autore: Antonio Scaramuzzino

> **Nota di versione 2.0:** questa revisione integra l'analisi comparata dei 14 libri di tecnologia indicizzati nel brain (9.879 chunk). Ogni scelta editoriale è motivata da uno o più punti di forza identificati nei testi esistenti. Le sezioni 1–5 e 7–11 sono aggiornate; la sezione 12 (Sintesi punti di forza) e la sezione 2.5 (DNA editoriale) sono nuove.
> **Nota di versione 2.1:** aggiunta la sezione 14 (Modello linguistico e allineamento IN2025), l'analisi estesa a 19 testi, e aggiornato il backlog con le priorità linguistiche. Il documento normativo di riferimento per il linguaggio è `00_ARCHITETTURA/LINEE_GUIDA_LINGUISTICHE.md`.
> **Nota di versione 2.2:** aggiornate le sezioni 6.3 (Layer 3 — App), 6.4 (Agenti), 7 (Output App), 8 (Stack tecnologico), 9 (Prossimi passi), 10 (Stato workspace). Aggiunte le sezioni 15 (Architettura App Template MC v2) e 16 (Protocollo CARBLE-CDD). Riflette lo stato realizzato al 2026-05-12: 50 MC JSON, 56 testi narrativi, app Next.js buildata e deployabile, quiz e flashcard per 50 MC, hook audio TTS per 50 MC.

---

## 1. VISIONE GENERALE

Costruire un **ecosistema integrato** composto da:
1. Un **libro di Tecnologia** per la scuola secondaria di I grado (triennio) con syllabus per competenze — organizzato attorno alle micro-competenze (MC) come unità minima di apprendimento
2. Un **sistema agenti AI** che alimenta il libro con fonti strutturate (NotebookLM)
3. Una **app/sito per studenti** con apprendimento personalizzato (quiz adattativi, microlearning, mappe, podcast)

Il libro non è un testo tradizionale: **è la versione cartacea di un sistema digitale.** Ogni MC è un modulo autosufficiente con struttura fissa, tre livelli di profondità, aggancio a una professione del futuro e a un compito di realtà autentico.

---

## 2. DECISIONI ARCHITETTURALI (già prese)

### 2.1 Struttura del libro

| Dimensione | Scelta |
|---|---|
| **Target** | Scuola secondaria I grado — triennio completo (classi 1ª-2ª-3ª) |
| **Progressione tematica** | Per aree tematiche per anno (non trasversale) |
| **1ª classe** | Materiali + Rifiuti + Disegno base + Digitale base |
| **2ª classe** | Alimentazione + Abitazione/Città + Disegno tecnico + Coding |
| **3ª classe** | Energia + Comunicazioni + Trasporti + Economia + Disegno progettuale + AI/Robotica |
| **Granularità** | Micro-competenza (massima granularità) |
| **Tipo di matrice** | Opzione C — Matrice originale con codifica propria per intersezione tra framework |

### 2.2 Framework incrociati

| Sigla | Framework | Versione |
|---|---|---|
| **IN** | Indicazioni Nazionali MIM | D.M. n. 221, 9 dicembre 2025 (sostituisce D.M. n. 254/2012) |
| **DC** | DigComp | 3.0 |
| **EC** | EntreComp | — |
| **LC** | LifeComp | — |
| **EV** | Educazione Civica / Agenda 2030 | L. 92/2019 |

> **Aggiornamento v1.2 — maggio 2026:** Le Indicazioni Nazionali di riferimento sono ora le IN 2025 (D.M. n. 221/2025), che sostituiscono le IN 2012 (D.M. n. 254/2012) a partire dall'a.s. 2026/2027 per la classe 1ª e dall'a.s. 2028/2029 per la classe 3ª. Il progetto è allineato alle nuove IN — **deadline critica: adozione in classe 1ª da settembre 2026.**

### 2.3 Fonti bibliografiche principali

| Fonte | Editore | Anno | Ruolo |
|---|---|---|---|
| Paci, Paci — *Idea, progetto, innovazione* (Guida docente) | Zanichelli | 2014 | Struttura disciplinare + competenze IN |
| *Hypertech PRO Arduino* (Guida docente) | Lattes | 2020 | Struttura 10 aree + coding + Agenda 2030 + compiti di realtà |

> **Nota v1.1:** l'edizione fisicamente disponibile nel workspace è *Hypertech PRO Arduino* pubblicata da **Lattes**, non da DeAgostini come indicato nella v1.0.

### 2.4 Fonti integrative disponibili localmente

Oltre alle due fonti primarie, il workspace contiene materiali già pronti all'uso. Catalogo completo in `03_NOTEBOOKLM/NB-TESTI/CATALOGO_LIBRI.md`.

| Risorsa | Percorso | Utilità per il progetto |
|---------|----------|------------------------|
| Compiti di realtà AR1-AR7 (Hypertech/Arduino) | `08_TESTI/Altri Testi/Arduino/Compiti di realtà/` | Alimentano direttamente il campo `compito_realta` nelle MC |
| Compiti di realtà ZR3-ZR9 (Rosano/Zanichelli) | `08_TESTI/Altri Testi/Rosano, Zanichelli/` | Compiti per area ENE, ALI, COM |
| Hypertech — capitoli metodologici (6 PDF) | `08_TESTI/Altri Testi/Arduino/Hypertech -Arduino/` | Didattica per competenze, BES, Educazione Civica |
| ARCHITECH — Rosanò (Zanichelli) | `08_TESTI/TESTI/Zanichelli/ARCHITECH Rosanò/` | Fonte primaria area DIS |
| Informaticamente — Vol.1 e Vol.2 | `08_TESTI/Altri Testi/Informaticamente/` | Sequenza coding per area DIG |
| Coding Scratch — 9 progetti | `08_TESTI/Altri Testi/Upgrade App.../Coding Progetti Scratch/` | Asset pronti per MC-DIG-2-01 |
| Come funziona il disegno (2 vol.) | `08_TESTI/Altri Testi/Come funziona/` | Riferimento tecnico area DIS |
| Come funziona l'informatica | `08_TESTI/Altri Testi/Come funziona/` | Riferimento tecnico area DIG |
| Douglas Scotti — La sostenibilità | `08_TESTI/Altri Testi/Douglas Scotti.../` | Area AMB/ENE sostenibilità |
| Idee per Insegnare — Zanichelli (3 PDF) | `08_TESTI/Altri Testi/Zanichelli/Idee per Insegnare/` | Energia (ENE), Riciclo (MAT), metodologia |
| Sfide Disegno (app HTML interattiva) | `08_TESTI/Altri Testi/Sfide/Disegno/` | Esercizi interattivi area DIS |
| 13 Guide docenti | `07_GUIDE/docenti/` | Fonte metodologica per tutti i layer |

### 2.5 DNA editoriale del nuovo libro (NUOVO in v2.0)

Queste sono le scelte editoriali fondanti che differenziano il libro da tutti i 14 concorrenti analizzati:

| Principio | Descrizione | Fonte di ispirazione |
|---|---|---|
| **MC come unità atomica** | Il libro è fisicamente strutturato attorno alle MC, non ai capitoli. Ogni doppia pagina = una MC. | Originale (nessun concorrente lo fa) |
| **Struttura fissa delle 5 zone** | Ogni MC segue sempre le stesse 5 zone visive (vedi §2.6). Lo studente sa sempre dove si trova. | Rielaborazione da Paci (Zanichelli 9788808899798) |
| **Hook narrativo audio** | Ogni MC apre con una storia/podcast di 2-3 min su un oggetto reale legato al concetto. | Zanichelli 9788808899798 — "Storie Straordinarie di Oggetti Comuni" |
| **AI Coach integrato** | Il libro digitale ha un coach AI che risponde a domande sulla MC corrente, genera varianti del quiz e suggerisce il percorso successivo. | Atlas 9788826824376 — SMARTY Digital Coach |
| **Professione del futuro** | Ogni MC ha una sidebar con una professione emergente collegata. | SEI 9788805079742 — rubriche professioni 2030 |
| **Flipped Classroom by default** | Il testo espositivo è opzionale; la sequenza standard è: audio a casa → laboratorio a scuola. | DeAgostini 9788851128050 — Flipped Classroom strutturale |
| **DSA First** | Alta leggibilità, carattere OpenDyslexic per versione digitale, sintesi schematica a fine MC, mappe pre-compilate. Non è un adattamento: è il design base. | Raffaello 9788847241206 + Mondadori 9788829861521 |
| **Edu Civica embedded** | Ogni MC ha un SDG di ancoraggio esplicito. Non c'è un capitolo separato di Educazione Civica. | Mondadori 9788829861521 + SEI 9788805079742 |
| **UDA interdisciplinari** | Ogni area ha almeno 1 UDA che collega le MC di quell'area a discipline diverse (Matematica, Scienze, Arte). | Zanichelli 9788808720153 — Progetti Didattici Interdisciplinari |
| **Metacognizione esplicita** | Ogni compito di realtà termina con domande di riflessione sulla collaborazione e sul processo. | Pearson/Sanoma 9788839564078 — "Com'è andata?" |
| **Oggetti reali come case study** | Le MC partono sempre da un oggetto fisico concreto noto allo studente, non da una definizione. | Zanichelli 9788808720153 — "Impara dalla realtà: lo skateboard, il violino" |
| **CLIL minimo** | Ogni area ha almeno una MC con glossario tecnico in inglese (3-5 termini chiave). | SEI 9788805079742 — CLIL Tech in English |
| **STEM hook di area** | Ogni area tematica apre con un hook interdisciplinare che mostra la connessione con Matematica, Scienze, Arte o Geo-storia. Non è un MC: è un'apertura di capitolo che prepara lo sguardo STEM. | IN2025 — educazione integrata matematico-scientifico-tecnologica |
| **Area INF separata da DIG** | L'Informatica (scienza dei dati, algoritmi, sistemi automatici) è un'area distinta dalla competenza digitale (uso degli strumenti). IN2025 lo richiede esplicitamente. | IN2025 D.M. n. 221/2025 — distinzione competenze digitali vs. informatiche |

### 2.6 Struttura fissa delle 5 zone per ogni MC (NUOVO in v2.0)

Ogni MC occupa una doppia pagina (o 4 pagine per MC avanzate) organizzata sempre in questo ordine:

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ INNESCA — QR code audio/podcast + domanda di avvio   │
│ "Hai mai sentito la storia del legno e delle battaglie   │
│  navali?" → 2-3 min di narrazione audio                  │
├─────────────────────────────────────────────────────────┤
│ 📖 ESPLORA — testo espositivo + visual                  │
│ Max 200 parole. Un concetto principale. Un'infografica.  │
├─────────────────────────────────────────────────────────┤
│ 🔍 OSSERVA — esempio reale + professione del futuro     │
│ Oggetto concreto come case study.                        │
│ Sidebar: "Chi lavora con questa competenza nel 2030?"    │
├─────────────────────────────────────────────────────────┤
│ 🔬 SPERIMENTA — laboratorio su 3 livelli                │
│ ●base  ●●intermedio  ●●●avanzato — per livello DigComp. │
├─────────────────────────────────────────────────────────┤
│ 🌍 AGISCI — compito di realtà + SDG + metacognizione    │
│ Scenario autentico → consegna → criteri → riflessione.   │
│ Badge SDG collegato. QR code AI Coach per dubbi.         │
└─────────────────────────────────────────────────────────┘
```

**Versione digitale (app):** le stesse 5 sezioni ma interattive. INNESCA è un player audio; SPERIMENTA genera quiz adattivi; AGISCI registra il progresso e sblocca la MC successiva.

---

## 3. SISTEMA DI CODIFICA MC-TECH-2025

```
MC-[AREA]-[ANNO]-[NUMERO]
```

### Aree

| Codice | Area tematica | Emoji | Anno | Fonte primaria | Fonti integrative locali |
|---|---|---|---|---|---|
| **MAT** | Materiali e Rifiuti | 🪨 | 1ª | Paci + Hypertech A.2 | AR4 (leggio), Idee x Insegnare (riciclo carta) |
| **DIS** | Disegno Tecnico | 📐 | 1ª-2ª-3ª | Paci + Hypertech Dis. · ARCHITECH (Rosanò) | Come funziona il disegno (2 vol.), Sfide/Disegno (app HTML) |
| **DIG** | Competenze Digitali (uso critico e sicuro) | 💻 | 1ª-2ª-3ª | Hypertech Quaderno | Informaticamente (vol.1-2), 9 progetti Scratch, Sfide/Informatica |
| **INF** | Informatica (scienza dei dati e dei sistemi) | 🔢 | 1ª-2ª-3ª | IN2025 D.M. 221/2025 | Informaticamente (vol.1-2), Come funziona l'informatica |
| **ALI** | Alimentazione | 🌾 | 2ª | Paci + Hypertech A.3-4 | AR3 (ricettario), ZR3 (menu festa scuola) |
| **AMB** | Abitazione, Città, Territorio | 🏗️ | 2ª | Paci + Hypertech A.5 | Douglas Scotti — La sostenibilità |
| **ENE** | Energia e Macchine | ⚡ | 3ª | Paci + Hypertech A.6-8 | ZR5 (auto basso impatto), ZR7 (articolo), ZR8 (fotovoltaico), ZR9 (impianto), Idee x Insegnare (energia) |
| **COM** | Comunicazioni e Trasporti | 📡 | 3ª | Paci + Hypertech A.7-9 | ZR6 (organizzare vacanza) |
| **SIS** | Sistemi / Economia e Lavoro | ⚙️ | 3ª | Paci + Hypertech A.10 | — |

> **Nota sulla distinzione DIG / INF (IN2025):** le Indicazioni Nazionali 2025 distinguono esplicitamente tra competenze digitali (uso efficace, sicuro e consapevole degli strumenti) e competenze informatiche (comprensione di dati, algoritmi, rappresentazione numerico-simbolica, funzionamento dei sistemi automatici). DIG copre la prima; INF copre la seconda. Questa distinzione deve essere esplicitata nel testo ogni volta che si introduce uno strumento: *"usare bene un'app è competenza digitale; capire come raccoglie i dati è competenza informatica."*

### Struttura dati di ogni MC

Schema canonico completo in `01_MATRICE_MC/schema_MC.json`. Versione sintetica:

```json
{
  "id": "MC-[AREA]-[ANNO]-[NN]",
  "area": "string",
  "anno": 1,
  "titolo": "string",
  "descrizione": "string",
  "fonte": "string (Paci 2014 | Hypertech 2020 | originale)",
  "frameworks": {
    "IN": { "ref": "string", "traguardo": "string" },
    "DC": { "ref": "string", "livello": "F|I|A|H", "nota": "string" },
    "EC": { "ref": "string", "nota": "string" },
    "LC": { "ref": "string", "nota": "string" },
    "EV": { "ref": "string", "nota": "string" }
  },
  "outputApp": {
    "quiz": "string (tipo e formato)",
    "microlearning": "string (formato e durata)",
    "visual": "string (tipo di asset visivo)",
    "livelloDigComp": "F|I|A|H"
  },
  "prerequisiti": ["MC-ID-1"],
  "tags": ["array", "di", "parole", "chiave"],
  "compito_realta": "string",
  "note_didattiche": { "base": "string", "avanzato": "string" },
  "hook_audio": "string (titolo del podcast/storia di apertura)",
  "professione_futura": "string (es. 'Ingegnere dei materiali circolari, 2030')",
  "sdg_principale": "integer (numero SDG 1-17)",
  "clil_termini": ["array", "di", "termini", "in", "inglese"],
  "uda_collegata": "string (ID UDA se questa MC fa parte di un'UDA interdisciplinare)"
}
```

> **Nota v2.0:** rispetto alla v1.1, sono stati aggiunti i campi `hook_audio`, `professione_futura`, `sdg_principale`, `clil_termini`, `uda_collegata`. Questi campi alimentano direttamente le Zone 1, 3 e 5 della struttura fissa delle MC (vedi §2.6).

---

## 4. MATRICE COMPLETA — 24 MICRO-COMPETENZE (v1.0 — da portare a 48)

### CLASSE 1ª — Materiali + Disegno + Digitale

#### Area MAT — Materiali e Rifiuti

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-MAT-1-01 | Classificare i materiali per proprietà | F | Analizza 5 oggetti di casa: materia prima, lavorazione, smaltimento |
| MC-MAT-1-02 | Ciclo di vita dei materiali | F | Traccia il 'passaporto' di un oggetto dalla culla alla tomba |
| MC-MAT-1-03 | Materiali innovativi e sostenibili | F | Progetta un packaging sostenibile: quale materiale e perché? |
| MC-MAT-1-04 | Rifiuti, riciclaggio e smaltimento | F | Analizza la raccolta differenziata della scuola |

**Framework attivi MAT:** IN · DC · EC · LC · EV
**SDG collegati:** 9, 11, 12, 15

#### Area DIS — Disegno Tecnico (1ª)

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-DIS-1-01 | Basi del disegno e costruzioni geometriche | F | Disegna in scala 1:20 la tua aula |

**Framework attivi DIS-1:** IN · DC · LC · EC

#### Area DIG — Digitale (1ª)

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-DIG-1-01 | Orientarsi nell'ambiente digitale | F | Smonta virtualmente un vecchio dispositivo |
| MC-DIG-1-02 | Ricerca e valutazione delle fonti online | F | Confronta 3 fonti sullo stesso argomento |

**Framework attivi DIG-1:** IN · DC · LC · EV

---

### CLASSE 2ª — Alimentazione + Abitazione + Disegno + Coding

#### Area ALI — Alimentazione

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-ALI-2-01 | Tecniche agronomiche e coltivazioni | F | Coltiva una piantina in classe e documenta il processo |
| MC-ALI-2-02 | Industria alimentare e conservazione | I | Nel frigo o nella dispensa? Classifica 10 alimenti |
| MC-ALI-2-03 | Educazione alimentare e stili di vita | I | Tieni un diario alimentare per 3 giorni |

**Framework attivi ALI:** IN · DC · EC · LC · EV
**SDG collegati:** 2, 3, 12, 15

#### Area AMB — Abitazione, Città, Territorio

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-AMB-2-01 | Strutture edilizie e tecniche costruttive | F | Costruisci una struttura con spaghetti e marshmallow |
| MC-AMB-2-02 | Impianti domestici e risparmio energetico | I | Disegna lo schema degli impianti della tua casa |
| MC-AMB-2-03 | Città, servizi urbani e pianificazione | I | Analizza il quartiere della scuola |

**Framework attivi AMB:** IN · DC · EC · LC · EV
**SDG collegati:** 7, 11, 13

#### Area DIS — Disegno Tecnico (2ª)

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-DIS-2-01 | Proiezioni ortogonali e sezioni | I | Disegna in proiezione ortogonale un oggetto progettato |

#### Area DIG — Digitale (2ª)

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-DIG-2-01 | Coding con linguaggi a blocchi | I | Crea un quiz interattivo in Scratch sull'alimentazione |
| MC-DIG-2-02 | Dati, privacy e identità digitale | I | Mappa la tua impronta digitale in una settimana |

---

### CLASSE 3ª — Energia + Comunicazioni + Economia + Disegno + AI

#### Area ENE — Energia e Macchine

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-ENE-3-01 | Macchine semplici e principi di meccanica | I | Identifica 5 macchine semplici in casa |
| MC-ENE-3-02 | Fonti energetiche non rinnovabili | I | Calcola l'impronta di carbonio della tua famiglia |
| MC-ENE-3-03 | Fonti rinnovabili e transizione energetica | A | Progetta il piano energetico della scuola |
| MC-ENE-3-04 | Elettricità e circuiti | I | Costruisci una lampada intelligente con Arduino/micro:bit |

**Framework attivi ENE:** IN · DC · EC · LC · EV
**SDG collegati:** 7, 13

#### Area COM — Comunicazioni e Trasporti

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-COM-3-01 | Telecomunicazioni e reti | I | Mappa la copertura wifi della scuola |
| MC-COM-3-02 | Produzione di contenuti digitali responsabili | I | Produci un podcast rispettando licenze CC |
| MC-COM-3-03 | Sistemi di trasporto e mobilità sostenibile | I | Progetta il piano di mobilità sostenibile per la scuola |
| MC-COM-3-04 | Automazione, domotica e Industria 4.0 | A | Progetta una casa domotica per un anziano solo |

**Framework attivi COM:** IN · DC · EC · LC · EV
**SDG collegati:** 8, 9, 11, 13

#### Area SIS — Sistemi / Economia

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-SIS-3-01 | Sistemi economici e produzione | I | Analizza il sistema economico della tua città |
| MC-SIS-3-02 | Economia globale, lavoro e sostenibilità | I | Organizza un Gruppo di Acquisto Solidale virtuale |

#### Area DIS — Disegno Tecnico (3ª)

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-DIS-3-01 | Assonometria, prospettiva e progettazione | A | Progetta e disegna un oggetto utile per la tua camera |

#### Area DIG — Digitale (3ª)

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-DIG-3-01 | Robotica educativa e pensiero computazionale avanzato | A | Progetta un robot che risolve un problema reale della scuola |
| MC-DIG-3-02 | Intelligenza Artificiale — concetti, etica e applicazioni | A | Analizza 3 app IA che usi ogni giorno |

**Framework attivi DIG-3:** IN · DC · EC · LC · EV
**SDG collegati:** 9, 10

---

#### Area INF — Informatica (1ª)

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-INF-1-01 | Informazione, bit e sistemi di numerazione | F | Codifica il tuo nome in binario e in ASCII |
| MC-INF-1-02 | Algoritmi e istruzioni: pensare come una macchina | F | Scrivi le istruzioni per fare un panino — poi trova il bug |

**Framework attivi INF-1:** IN · DC · EC · LC
**Collegamento STEM:** Matematica (sistemi di numerazione, potenze di 2), Scienze (segnali, informazione)

---

#### Area INF — Informatica (2ª)

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-INF-2-01 | Sistema operativo, file system e processi | I | Mappa l'organizzazione del tuo computer come uno scaffale bibliotecario |
| MC-INF-2-02 | Cifratura, sicurezza e identità in rete | I | Cifra un messaggio con il cifrario di Cesare e analizza quanto è sicuro |

**Framework attivi INF-2:** IN · DC · LC · EV
**Collegamento STEM:** Matematica (crittografia, moduli, funzioni), Storia (cifrari storici: Enigma, Cesare)

---

#### Area INF — Informatica (3ª)

| ID | Titolo | DigComp livello | Compito di realtà |
|---|---|---|---|
| MC-INF-3-01 | Sensori, dati e sistemi IoT | A | Progetta un sistema sensoristico per monitorare il consumo energetico della scuola |
| MC-INF-3-02 | Machine learning: come le macchine imparano dai dati | A | Addestra un classificatore semplice su un dataset di immagini — poi trova un suo errore |

**Framework attivi INF-3:** IN · DC · EC · LC · EV
**Collegamento STEM:** Matematica (statistica, probabilità, grafici), Scienze (misure, sensori fisici), Fisica (corrente, tensione nei sensori)

---

### STEM HOOK DI AREA — definizione e posizione

Lo STEM hook non è una MC. È un'**apertura di area** (mezza pagina) che precede la prima MC di ogni area tematica. Ha la funzione di mostrare allo studente che la Tecnologia non è isolata: è Matematica applicata, Scienze in azione, Arte che incontra l'ingegneria.

**Struttura fissa dello STEM hook:**
```
DOMANDA PONTE
"Qual è il problema matematico/scientifico che questa area risolve?"
(1-2 frasi che nominano esplicitamente la disciplina STEM collegata)

CONNESSIONE VISIVA
Infografica o schema che mostra il link:
[concetto scientifico] ←→ [applicazione tecnologica] ←→ [MC dell'area]

FRASE GUIDA
Una frase che lo studente porta con sé durante tutta l'area:
es. "Mentre studi i materiali, ricorda: ogni proprietà fisica ha una legge matematica dietro."
```

**STEM hook per area:**

| Area | Disciplina STEM collegata | Frase guida |
|---|---|---|
| MAT | Chimica + Matematica (proprietà fisiche, percentuali) | Ogni materiale obbedisce a leggi fisiche che puoi misurare. |
| DIS | Geometria euclidea + Matematica (scale, proporzioni, proiezioni) | Il disegno tecnico è geometria applicata alla costruzione. |
| DIG | Logica booleana + Matematica (algoritmi, funzioni) | Ogni programma è matematica trasformata in istruzioni. |
| INF | Matematica (sistemi di numerazione, algebra booleana, statistica) | L'informatica è matematica che parla alle macchine. |
| ALI | Biologia + Chimica (nutrizione, fermentazione, conservazione) | Mangiare è chimica — e la tecnologia la controlla. |
| AMB | Fisica (resistenza strutturale, termica, idraulica) | Ogni edificio è una soluzione a equazioni fisiche. |
| ENE | Fisica (lavoro, potenza, rendimento, legge di Ohm) | L'energia obbedisce a leggi fisiche immutabili. |
| COM | Matematica (segnali, bande, frequenze, probabilità) | Ogni comunicazione è un segnale matematico codificato. |
| SIS | Matematica (economia, statistiche, modelli predittivi) | I sistemi economici sono modelli matematici con variabili umane. |

**File degli STEM hook:** `04_CONTENUTI/microlearning/hook/STEM-[AREA]_hook.md`

---

## 4.bis MC CANDIDATE DA IN 2025 (delta rispetto alla v1.0)

Le IN 2025 introducono contenuti obbligatori non coperti dalle 24 MC attuali. Le seguenti MC candidate vanno aggiunte nel passaggio da 24 a 48 MC totali.

### Priorità alta — contenuti esplicitamente nuovi nelle IN 2025

| ID proposto | Area | Anno | Titolo | Motivazione IN 2025 |
|---|---|---|---|---|
| MC-DIG-2-03 | DIG | 2ª | Sistema operativo e organizzazione dei dati | OSA IN 2025: SO, processi, memoria, file system |
| MC-DIG-2-04 | DIG | 2ª | Cifratura, sicurezza informatica e identità digitale | OSA IN 2025: cifrari, attacchi informatici, identità in rete |
| MC-MAT-1-05 | MAT | 1ª | Metalli: proprietà, produzione e lavorazione | Conoscenze IN 2025: ferro/altoforno, rame, alluminio |
| MC-MAT-1-06 | MAT | 1ª | Fibre tessili, plastiche e materiali compositi | Conoscenze IN 2025: fibre tessili, compositi |

### Priorità media — contenuti da potenziare

| ID proposto | Area | Anno | Titolo | Motivazione IN 2025 |
|---|---|---|---|---|
| MC-DIG-3-03 | DIG | 3ª | Raccolta dati da sensori e sistemi IoT | OSA IN 2025: raccolta dati da sensori |
| MC-DIG-3-04 | DIG | 3ª | Accessibilità, usabilità e inclusione digitale | Conoscenze IN 2025: accessibilità applicazioni informatiche |
| MC-MAT-1-02 | MAT | 1ª | *Ciclo di vita + Cicli tecnologici* (aggiornamento MC esistente) | IN 2025 aggiunge logistica, catena del valore |

---

## 5. PROGRESSIONE DIGCOMP PER AREA TRASVERSALE

| Area | 1ª | 2ª | 3ª |
|---|---|---|---|
| DIG | Foundation (F) | Intermediate (I) | Advanced (A) |
| DIS | Foundation (F) | Intermediate (I) | Advanced (A) |
| MAT | Foundation (F) | — | — |
| ALI | — | Foundation → Intermediate | — |
| AMB | — | Foundation → Intermediate | — |
| ENE | — | — | Intermediate → Advanced |
| COM | — | — | Intermediate → Advanced |
| SIS | — | — | Intermediate |

---

## 6. ARCHITETTURA DEL SISTEMA AGENTI

### 6.0 Layer 0 — Repository locale PDF

Prima di NotebookLM, esiste un repository fisico di 63 PDF già disponibili nel workspace, organizzati per categoria in `08_TESTI/` e `07_GUIDE/`. Questo è il punto di ingestion per NB-TESTI.

| Cartella locale | Contenuto | Destinazione NotebookLM |
|----------------|-----------|------------------------|
| `08_TESTI/TESTI/` | 49 PDF dei libri studente, organizzati per editore | NB-TESTI |
| `07_GUIDE/docenti/` | 14 guide docenti (incluse Paci e Hypertech) | NB-TESTI |
| `08_TESTI/Altri Testi/` | Compiti di realtà, coding, metodologia, serie didattiche | NB-TESTI + NB-ARTICOLI |

Catalogo completo con priorità di caricamento: `03_NOTEBOOKLM/NB-TESTI/CATALOGO_LIBRI.md`.

### 6.1 Layer 1 — Knowledge Repositories (NotebookLM)

Tre notebook distinti con ruoli editoriali separati:

| Notebook | Tipo fonti | Output generati | Stato |
|---|---|---|---|
| **NB-TESTI** | PDF libri, capitoli, documenti | Brief strutturati, glossari, mappe concettuali | ⬜ Da creare — 63 PDF pronti |
| **NB-VIDEO** | URL YouTube, trascrizioni | Sintesi microlearning, quiz da video | ⬜ Da creare — URL da raccogliere |
| **NB-ARTICOLI** | URL web, articoli innovazione | Aggiornamenti trend, approfondimenti | ⬜ Da creare |

> **Nota critica:** NotebookLM non espone API per query in tempo reale. Funziona in **modalità asincrona**.

### 6.2 Layer 2 — Knowledge Base strutturata

Database/CMS centrale dove confluisce il materiale elaborato.

- **Strumento consigliato:** Notion (già connesso) o Airtable
- **Struttura:** `MC-ID → tipo contenuto → asset`
- **Tag di personalizzazione:** livello DigComp, area, anno, stile di apprendimento

### 6.3 Layer 3 — App/Sito per studenti

L'app è un'applicazione **Next.js + React + TypeScript** (v16.2.2 / React 19) con output statico (SSG), deployata su GitHub Pages, Netlify e Vercel. Percorso: `05_APP/tecnologia-sito-web/`.

**Template MC v2** — ogni micro-competenza è una pagina con 6 tab sticky organizzati attorno alle 5 zone del libro + una zona dedicata al ripasso:

| Tab | Emoji | Contenuto principale |
|---|---|---|
| INNESCA | ⚡ | AudioPlayer + trascrizione accessibile + domanda stimolo in giallo + FlippedVideos (3 video) + ResourcesPanel |
| ESPLORA | 📖 | AccordionSection: sottosezioni `###` del testo MD collassabili, primo item aperto di default |
| OSSERVA | 🔍 | ReadableBody + ProfessioneCard (immagine `img4-professione` + testo narrativo estratto da MD + CompetenzaTag interattivi) |
| SPERIMENTA | 🔬 | LevelTabs: ●Base / ●●Intermedio / ●●●Avanzato — livello default dal campo DigComp MC |
| AGISCI | 🌍 | RubricaDrawer sticky + ReadableBody — rubrica estratta a runtime dalla sezione AGISCI del MD |
| RIPASSA | 🃏 | ProcessWidget (4-7 step) + ChecklistWidget (5-6 voci) + QuizWidget (18 domande 6F+6I+6A) + FlashcardDeck (18 card) |

**Componenti core realizzati:**

- `MCNavigator` — tab bar sticky con `role="tablist"` ARIA, scroll orizzontale mobile, indicatore bordo colorato con `areaHex`, persistenza su `localStorage`, navigazione programmatica via `forcedActiveId`
- `AccordionSection` — animazione CSS pura `grid-template-rows: 0fr → 1fr`, `aria-expanded`/`aria-controls` compliant
- `LevelTabs` — split del body SPERIMENTA su marker `@@SUBHEAD:●`, degrado graceful se assenti
- `CalloutBox` — 5 tipi semantici rilevati automaticamente dal testo: `safety` (rosso), `physics` (blu), `error` (giallo), `question` (sky), `info` (amber); CSS custom properties in `globals.css`
- `RubricaDrawer` — parser Markdown che cerca `### 📋 Rubrica di valutazione` e legge la tabella; slide-up su mobile, pannello laterale 600px su desktop; focus trap + chiusura `Escape`
- `ResourcesPanel` — pannello collassabile in INNESCA con griglia asset disponibili e navigazione rapida verso le zone
- `ProfessioneCard` — immagine `img4-professione` + testo narrativo + `CompetenzaTag` interattivi (glossario CLIL)
- `MCPageClient` — orchestratore Client Component (~430 righe); separato dal Server Component `page.tsx` (~150 righe) che gestisce `generateStaticParams()` e `generateMetadata()`

**SEO e accessibilità:**
- `generateMetadata()` produce titolo dinamico formato `"ProfTecnologIA {Area} — {Titolo MC}"`
- Breadcrumb con JSON-LD strutturato e colori area
- `SiteFooter` con versione `v0.1`

**Build:** ✅ 69 pagine statiche, 0 errori TypeScript (2026-05-11)

### 6.4 I 5 Agenti

```
AGENTE CURATORE
├── Monitora fonti (nuovi articoli, video, paper)
├── Aggiunge fonti ai notebook NotebookLM appropriati
├── Ricerca video YouTube per ogni MC (case editrici, Geopop, SSIG, consorzi)
└── Trigger: periodico o su richiesta

AGENTE SINTETIZZATORE
├── Interroga NotebookLM (modalità asincrona/batch — nessuna API in tempo reale)
├── Estrae output (quiz, brief, flashcard, mappe)
├── Formatta secondo schema MC v2.0 (inclusi campi hook_audio, professione_futura, sdg_principale, clil_termini, uda_collegata)
└── Deposita nel Layer 2 (Notion/database)

AGENTE GENERATORE DI ASSET
├── Produce immagini AI: 4 tipologie (ai-fotorealistica, ai-contesto, img4-professione, mindmap) via GPT Image 2 (OpenAI)
├── Genera hook audio (MP3 2-3 min) con edge-tts v7.2.8 voce it-IT-IsabellaNeural
├── Crea microlearning JSON (Process + Checklist) e quiz situazionali
├── Genera script hook narrativi e playlist video YouTube per ogni MC
└── Output: PNG in `04_CONTENUTI/visual/`, MP3 in `public/assets/audio/`, JSON in `data/`

AGENTE CARBLE-CDD  ← NUOVO (quality assurance)
├── Valida ogni CDD secondo 7 criteri D-C-A-R-B-L-E:
│   ├── D — Disegno didattico (obiettivo, azione studente, verifica, evidenza)
│   ├── C — Correttezza e accuratezza (dati, definizioni, riferimenti normativi)
│   ├── A — Adeguatezza didattica, curricolare e contestuale (età, prerequisiti, BES)
│   ├── R — Rilevamento di bias e stereotipi (genere, cultura, disabilità)
│   ├── B — Fonti, licenze e citabilità (fonti verificabili, licenze CC)
│   ├── L — Linguaggio inclusivo e accessibile (leggibilità, consegne chiare, DSA)
│   └── E — Etica, sicurezza e valori educativi (tutela minori, trasparenza IA)
├── Soglie di esito: ✅ Validabile → pubblica · ⚠️ Da rivedere → notifica autore · 🚫 Non validabile → blocca
├── Produce parere istruttorio (non modifica direttamente i file) — la decisione finale spetta all'autore umano
├── Output: scheda JSON + report Markdown in `04_CONTENUTI/validazione/`
└── Riferimento: `00_ARCHITETTURA/Protocollo_CARBLE_CDD_v1.0.md`

AGENTE PERSONALIZZATORE
├── Legge profilo studente e progressi
├── Seleziona MC appropriate per livello
├── Sequenzia contenuti (prerequisiti → MC target)
├── Aggiorna percorso dopo ogni interazione
└── Output: percorso JSON personalizzato con MC ordinate e livello DigComp attuale
```

**Pipeline degli agenti:**

```
Agente Curatore         → fonti, video YouTube per MC
        ↓
Agente Sintetizzatore   → asset JSON strutturati (batch/asincrono)
        ↓
Agente Generatore Asset → immagini AI, audio TTS, microlearning, quiz, script
        ↓
Agente CARBLE-CDD       → validazione D-C-A-R-B-L-E
        ↓              [correzioni manuali autore se necessario]
Agente Personalizzatore → percorso personalizzato studente
```

---

## 7. STRUTTURA OUTPUT APP PER OGNI MC

Ogni micro-competenza produce i seguenti asset (stato al 2026-05-12):

| Tipo asset | Formato | Strumento | Stato |
|---|---|---|---|
| **Hook audio** | MP3 2-3 min, voce neurale italiana | edge-tts v7.2.8, voce it-IT-IsabellaNeural | ✅ 50 MC |
| **Trascrizione audio** | MD accessibile con script completo | Generata insieme all'audio | ✅ 50 MC |
| **Quiz** | 18 domande (6F + 6I + 6A) con feedback specifico per risposta errata e riferimenti IN/DC | Claude API batch | ✅ 50 MC |
| **Microlearning** | Process (4-7 step) + Checklist (5-6 voci) in JSON | Claude API batch + validazione CARBLE-CDD | ✅ 50 MC |
| **Flashcard** | 18 card con tag livello (F/I/A), layout griglia verticale | Generato da dati quiz/MC | ✅ 50 MC |
| **Visual** | 4 tipologie per MC: `ai-fotorealistica`, `ai-contesto`, `img4-professione`, `mindmap` | GPT Image 2 (OpenAI) | ✅ 50 MC |
| **Playlist video** | 3 video flipped classroom + galleria video area; JSON con metadati | Agente Curatore | ✅ 50 MC |
| **Professione del futuro** | Card con immagine `img4-professione` + testo narrativo MD + CompetenzaTag CLIL | Claude API + JSON MC | ✅ 50 MC |
| **Glossario CLIL** | 7 termini IT/EN con pronuncia IPA, CompetenzaTag interattivi nel tab OSSERVA | Claude API, campo `clil_termini` nel JSON MC | ✅ 50 MC |
| **Testo narrativo 5 zone** | File MD con sezioni INNESCA/ESPLORA/OSSERVA/SPERIMENTA/AGISCI (250-400 parole per zona) | Autore + Claude API | ✅ 56 file (50 standard + 6 INF) |
| **Visual brief ESPLORA** | Brief con 423 prompt descrittivi di scena, 10 tipologie immagine, per generazione immagini AI | Generatore Python | ✅ 56 brief |

**Struttura dei file dati per ogni MC nell'app:**

```
data/mc/classe_N/AREA/MC-ID.json          ← metadati MC (JSON schema v2.0)
data/testi/classe_N/AREA/MC-ID_completa.md ← testo narrativo 5 zone
data/quiz/MC-ID_quiz.json                  ← 18 domande (6F+6I+6A) con feedback e riferimenti
data/flashcards/MC-ID.json                 ← 18 flashcard con tag livello
data/microlearning/MC-ID.json             ← Process + Checklist (validato CARBLE-CDD)
data/transcripts/MC-ID_hook-script.md     ← trascrizione audio accessibile
data/videos/MC-ID.json                    ← playlist YouTube (3 flipped + galleria)
public/assets/audio/MC-ID_hook-audio.mp3  ← hook audio TTS (durata nel JSON)
public/assets/visual/MC-ID/               ← immagini AI (4 tipologie)
```

---

## 8. STACK TECNOLOGICO

Stack effettivamente utilizzato al 2026-05-12:

| Layer | Strumento | Versione / Dettaglio | Stato |
|---|---|---|---|
| **App frontend** | Next.js + React + TypeScript | Next.js 16.2.2, React 19 | ✅ In produzione |
| **CSS** | Tailwind CSS | v4.3 | ✅ |
| **Audio TTS** | edge-tts (Microsoft Neural TTS) | v7.2.8, voce `it-IT-IsabellaNeural` | ✅ 50 MC |
| **Immagini AI** | GPT Image 2 (OpenAI) | `gpt_image_2` | ✅ |
| **Knowledge base** | Pinecone (`brain-tecnologia`) | namespace `tecnologia-libro`, modello `multilingual-e5-large`, ~9.879 chunk | ✅ |
| **AI Engine** | Claude API | `claude-sonnet-4-6` / `claude-opus-4-6` | ✅ |
| **Deploy GitHub Pages** | GitHub Actions | `.github/workflows/deploy.yml`, auto-deploy su push | ✅ |
| **Deploy Netlify** | netlify.toml | `output: export → out/` | ✅ |
| **Deploy Vercel** | vercel.json | `framework: null`, `outputDirectory: out` | ✅ |
| **Knowledge repo** | NotebookLM (3 notebook) | NB-TESTI / NB-VIDEO / NB-ARTICOLI — modalità asincrona | ⬜ Da creare |
| **Database Layer 2** | Notion o Airtable | Layer 2 strutturato (connettore da costruire) | ⬜ Da fare |
| **Coding lab** | Scratch, micro:bit, Tinkercad | Attività pratiche in laboratorio | — |

---

## 9. PROSSIMI PASSI (backlog prioritizzato)

> **Stato al 2026-07-19:** 58 MC JSON in matrice · app Next.js buildata · template MC v2 · primo laboratorio GeoGebra embeddabile per MC-DIS-1-01.

### Completati ✅

- ✅ Portare le MC da 24 a 50 JSON (matrice completa)
- ✅ Aggiungere `hook_audio`, `professione_futura`, `sdg_principale`, `clil_termini`, `uda_collegata`, `prerequisiti` a ogni MC
- ✅ Documentare progressione verticale DIG e DIS — `01_MATRICE_MC/PROGRESSIONE_VERTICALE_DIG_DIS.md`
- ✅ Testi narrativi 5 zone per tutte le MC (56 file `_completa.md`, incluse 6 INF)
- ✅ Hook audio TTS (50 MC) — edge-tts it-IT-IsabellaNeural
- ✅ Quiz 18 domande (6F+6I+6A con feedback e riferimenti) per 50 MC
- ✅ Microlearning JSON (Process + Checklist) per 50 MC — validati CARBLE-CDD
- ✅ Flashcard JSON per 50 MC
- ✅ Immagini AI (4 tipologie per MC) via GPT Image 2
- ✅ App Next.js con template MC v2 (6 tab sticky, build 69 pagine, 0 errori TypeScript)
- ✅ Syllabus annuali (docenti, studenti, famiglie) per tutte e 3 le classi
- ✅ Design system + design tokens (`TecnologIA_Design_System.html`)
- ✅ Agente CARBLE-CDD — protocollo v1.0 in `00_ARCHITETTURA/Protocollo_CARBLE_CDD_v1.0.md`
- ✅ Visual brief ESPLORA v2 — generatore Python + 56 brief + 423 prompt di scena
- ✅ Configurazioni deploy (GitHub Pages, Netlify, Vercel)
- ✅ Agente Sintetizzatore — script Python `sintetizzatore.py` + `notion_setup.py` (da testare in produzione)
- ✅ Laboratorio GeoGebra MC-DIS-1-01 — perpendicolare in P, animazione in 4 passi + dimostrazione LLL + download `.ggb`
- ✅ Skill Codex `create-geogebra-drawings` — generazione, animazione, embed web, validazione e download `.ggb` (2026-07-19)

### Priorità 1 — Matrice MC (gap residui)

> **Aggiornamento 2026-07-12:** target MC definitivo **58 = 52 standard + 6 INF** (decisione editoriale — le MC-INF rientrano nel conteggio totale, non sono extratarget). I 6 JSON MC-INF risultano già presenti in `01_MATRICE_MC/classe_{1,2,3}/INF/` (MC-INF-1-01/02, MC-INF-2-01/02, MC-INF-3-01/02). Restano da produrre per le 6 MC-INF: quiz, flashcard, microlearning JSON, hook audio TTS e slide deck NotebookLM (già prodotti invece per le 52 MC standard). Vedi anche CLAUDE.md §10 per lo stato consolidato.

- [x] Creare 6 JSON MC-INF in `01_MATRICE_MC/` — fatto, verificato 2026-07-12
- [ ] Completare `sdg_principale` nelle MC mancanti (verificare stato aggiornato — CLAUDE.md riporta completamento per le 52 MC standard al 2026-07-07)
- [x] Raggiungere target 58 MC JSON (52 standard + 6 INF) — target ridefinito e raggiunto
- [x] Decidere se le 6 MC-INF rientrano nel target — deciso: sì, incluse (target 58)
- [ ] Allineare i JSON MC-INF allo schema v2.0 (`clil_termini` usa chiavi `{it,en,def}` invece di `{italiano,inglese,pronuncia_ipa}`; campo extra `professioni_future` non previsto da `schema_MC.json`)
- [ ] Produrre quiz, flashcard, microlearning JSON e hook audio per le 6 MC-INF (attualmente assenti in `05_APP/tecnologia-sito-web/data/`)

### Priorità 2 — Infrastruttura agenti e NotebookLM

- [ ] Creare NB-TESTI — caricare Paci (`9788808899798`) + Hypertech PRO (`9788869175978`) + guide docenti
- [ ] Creare NB-VIDEO — playlist YouTube già raccolte in `data/videos/` come punto di partenza
- [ ] Creare NB-ARTICOLI — La sostenibilità (Douglas Scotti), Idee per Insegnare (3 PDF)
- [ ] Parser NotebookLM → schema MC v2.0 (Agente Sintetizzatore)
- [ ] Connettore verso Notion/Airtable (Layer 2)
- [ ] Guida operativa Agente Curatore (config NB-* + ricerca video)
- [ ] Guida operativa Agente CARBLE-CDD (workflow validazione + report)

### Priorità 2 — App studenti (backlog P2/P3 da refactor)

- [ ] **P2.1** Stepper mobile progress indicator sopra i tab (viewport < 480px)
- [ ] **P2.2** Keyboard navigation MCNavigator (ArrowLeft/ArrowRight) — WCAG WAI-ARIA Tabs
- [ ] **P2.3** Focus management al cambio tab (WCAG 2.4.3)
- [ ] **P2.4** Scroll-to-top del pannello al cambio tab (UX mobile)
- [ ] **P2.5** AccordionSection: opzione "espandi tutti"
- [ ] **P2.6** RubricaDrawer: versione stampabile (`@media print`)
- [ ] Deploy Netlify definitivo (guida in `DEPLOY_NETLIFY.md`)

### Priorità 3 — Feature app e debt tecnico

- [ ] **P3.1** Progress tracker per zona (collegare `useProgress.ts` al MCNavigator)
- [ ] **P3.2** URL hash sync per deep-link zona (`#innesca`, `#esplora`, ecc.)
- [ ] **P3.3** LevelTabs: memoria del livello selezionato su localStorage per MC
- [ ] **P3.5** Aside mobile — Framework/Tag/Prerequisiti su pannello espandibile
- [ ] **D1** Unificare `ReadableBodyInTab` / `ReadableText` in `lib/readable-text.tsx`
- [ ] Audit WCAG AA contrasti + focus visibili
- [ ] Audit performance immagini AI (WebP + srcset + lazy loading)
- [ ] Sistema AI Coach integrato per ogni MC

### Priorità 4 — Contenuti e sincronizzazione

- [ ] Sincronizzare asset in `04_CONTENUTI/compiti_realta/`, `flashcard/`, `quiz/` con quelli in `05_APP/data/`
- [ ] Applicare integrazioni brain residue (vedi `00_ARCHITETTURA/RAPPORTO_INTEGRAZIONI_brain_v1.0.md`)
- [ ] Espandere MC Advanced da 4 a 6 pagine nell'Indice (12 MC interessate)
- [ ] Aggiungere 2 UDA interdisciplinari bonus all'Indice

---

## 10. STATO ATTUALE DEL WORKSPACE (v2.2 — 2026-05-12)

| Elemento | Stato | Percorso |
|---|---|---|
| Documento architettura | ✅ v2.2 | `00_ARCHITETTURA/` |
| Schema MC canonico | ✅ v2.0 con tutti i campi | `01_MATRICE_MC/schema_MC.json` |
| Matrice MC JSON | ✅ 52 MC standard con campi v2.0 completi | `01_MATRICE_MC/` |
| Matrice MC JSON — area INF | ✅ 6/6 JSON presenti (target 58 raggiunto, 2026-07-12) — schema v2.0 non perfettamente allineato (vedi §9) | `01_MATRICE_MC/classe_*/INF/` |
| Testi narrativi (ESPLORA) | ✅ 56 file `_completa.md` (50 std + 6 INF) | `08_TESTI/` |
| Progressione verticale DIG/DIS | ✅ Documentata | `01_MATRICE_MC/PROGRESSIONE_VERTICALE_DIG_DIS.md` |
| SDG principale nelle MC | ⚠️ Parziale — 11/50 compilati | `01_MATRICE_MC/` |
| Prompt 5 agenti | ✅ CARBLE-CDD aggiunto · microlearning separato | `02_AGENTI/*/prompt.md` |
| Repository PDF locali | ✅ 63 PDF | `08_TESTI/` + `07_GUIDE/` |
| Catalogo libri | ✅ Aggiornato | `03_NOTEBOOKLM/NB-TESTI/CATALOGO_LIBRI.md` |
| NotebookLM NB-TESTI | ⬜ Da creare | — |
| NotebookLM NB-VIDEO | ⬜ Da creare | — |
| NotebookLM NB-ARTICOLI | ⬜ Da creare | — |
| Syllabus annuali | ⬜ Da creare | `06_SYLLABUS/` |
| Guide docenti / studenti / famiglie | ⬜ Da creare | `07_GUIDE/` |
| App React studenti | ⬜ Da creare | `05_APP/` |

---

## 11. ENTRATA IN VIGORE IN 2025 — CALENDARIO

| Anno scolastico | Classe | Stato per il progetto |
|---|---|---|
| **2026/2027** | Classe 1ª (prima adozione) | **Deadline libro — da rispettare** |
| 2027/2028 | Classi 1ª-2ª | Estensione progressiva |
| 2028/2029 | Triennio completo | IN 2012 cessa di avere efficacia per secondaria I grado |

---

## 12. SINTESI PUNTI DI FORZA DEI 14 LIBRI ANALIZZATI (NUOVO in v2.0)

Fonte: analisi semantica dei 9.879 chunk indicizzati nel brain (brain-tecnologia, namespace tecnologia-libro).

| ISBN | Editore | Punto di forza principale | Dove è integrato nel nuovo libro |
|---|---|---|---|
| 9788800360043 | Mondadori Education | Compiti di realtà con rubriche di valutazione esplicite per il docente | Struttura AGISCI (criteri di valutazione) |
| 9788805079292 | SEI (Volume unico) | Disegno tecnico + integrazione CAD (SketchUp), trasporti/economia | Area DIS + campo `clil_termini` |
| 9788805079742 | SEI | Professioni del futuro per ogni area, CLIL Tech in English, rubrica Cittadini verso il 2030 | OSSERVA (sidebar professioni), `professione_futura`, `clil_termini` |
| 9788805081080 | SEI (Volume) | Struttura per aree tematiche coerente, compiti di realtà con costruzione fisica (turbina a vapore) | Conferma struttura aree MC |
| 9788808699466 | Zanichelli | Sezione Coding integrata, dashboard Scratch guidata passo-passo, orientamento | Area DIG, MC-DIG-2-01 |
| 9788808720153 | Zanichelli (Pianeta) | UDA interdisciplinari strutturate, casi studio su oggetti reali (skateboard, violino), economia circolare | `uda_collegata`, OSSERVA (oggetto reale) |
| 9788808899798 | Zanichelli (Paci) | Podcast "Storie Straordinarie di Oggetti Comuni" a ogni unità, audiobook, Genially interattivi | **INNESCA (hook audio)** — ispirazione diretta |
| 9788826812885 | Atlas (Vol. B) | Laboratorio competenze esplicito, trasporti/abitazione ben strutturati | SPERIMENTA (laboratorio) |
| 9788826824376 | Atlas (Materiali) | SMARTY coach digitale AI integrato, sintesi strutturate per ogni capitolo | **AI Coach**, AGISCI (QR code coach) |
| 9788829861521 | Mondadori (Progettare il futuro) | Edu civica + Agenda 2030 embedded nativamente, didattica inclusiva by design, test Google Moduli | `sdg_principale`, DSA First design |
| 9788839564078 | Pearson/Sanoma | Compiti di realtà tematici e narrativi (es. "Spiagge pulite", "Voglio fare l'influencer"), metacognizione esplicita post-compito | AGISCI (metacognizione), titoli compiti |
| 9788847241206 | Raffaello | Alta leggibilità DSA, sintesi a fine unità con carattere dedicato, presentazioni multimediali IA-generate | DSA First design, sintesi MC |
| 9788851128050 | DeAgostini (Vol. A) | Flipped Classroom strutturale ("Tiriamo le fila!"), sequenza rovesciata pratica→teoria | **Flipped Classroom by default** |
| 9788851159344 | DeAgostini | 100 esercizi autocorrettivi, 50 presentazioni disegno, DEA LINK (AR su pagine libro) | SPERIMENTA (esercizi interattivi), app AR |

---

## 13. NOTE E VINCOLI TECNICI

- **NotebookLM non è un database interrogabile via API in tempo reale.** Va usato in modalità asincrona dagli agenti.
- **La progressione tematica è editoriale** (non imposta da Paci/Hypertech): 1ª = Materiali, 2ª = Alimentazione+Città, 3ª = Energia+Comunicazioni. Scelta di Antonio Scaramuzzino.
- **L'area SIS (Economia)** è intenzionalmente leggera (2 MC): Paci e Hypertech la trattano in modo limitato per la secondaria I grado.
- **Il Digitale (DIG) è trasversale** al triennio per scelta progettuale, anche se ogni anno ha un focus specifico (orientamento → coding/privacy → AI/robotica).
- **I compiti di realtà** derivano principalmente da Hypertech (2020) e Pearson/Sanoma (9788839564078). Le serie AR e ZR sono già disponibili localmente.
- **Hypertech PRO Arduino** è pubblicato da Lattes, non da DeAgostini. La versione di riferimento è quella Lattes fisicamente presente in `08_TESTI/TESTI/Lattes/Hypertech PRO Arduino/`.
- **63 PDF locali** sono già disponibili nel workspace e rappresentano il Layer 0 di ingestion per NotebookLM.
- **Tre guide (Leonardo, Tecnoidea, iTech)** in `07_GUIDE/docenti/` hanno editore non identificato — da verificare prima del caricamento su NotebookLM.
- **L'AI Coach** non è un agente autonomo: è un'interfaccia sul Layer 2 (Notion/Airtable) che recupera i chunk della MC corrente e risponde nel contesto. Non va confuso con l'Agente Personalizzatore.

---

---

## 14. MODELLO LINGUISTICO E ALLINEAMENTO IN2025

Il modello linguistico del libro è definito in dettaglio in `00_ARCHITETTURA/LINEE_GUIDA_LINGUISTICHE.md`. Questa sezione riassume i punti architetturalmente rilevanti.

### 14.1 Identità del libro

Il libro non è un manuale descrittivo. È un **manuale-laboratorio** che accompagna lo studente a osservare, progettare, sperimentare, valutare e agire responsabilmente. La voce è quella di una guida esperta che cammina accanto, non di un enciclopedia.

**Frase guida:**
> La Tecnologia non studia solo come sono fatti gli oggetti: studia le scelte con cui gli esseri umani trasformano il mondo — e insegna a farle meglio.

### 14.2 Dodici trend linguistici operativi

| # | Trend | Applicazione nel libro |
|---|---|---|
| T1 | Linguaggio laboratoriale | Verbi attivi (osserva, progetta, verifica) — mai aprire con una definizione |
| T2 | Linguaggio delle conseguenze | Box "Rischi e conseguenze" + domande AGISCI |
| T3 | Lessico tecnico a scalini | Ogni termine tecnico nuovo: "cioè" + esempio + controesempio |
| T4 | Titoli in forma di domanda | Tutti i titoli MC sono domande o frasi con verbo attivo |
| T5 | Linguaggio visuale | Ogni visual attivato nel testo con "Guarda il punto X..." |
| T6 | Linguaggio della sostenibilità | Da dove viene? Quanto dura? Si può riparare? in ogni AGISCI |
| T7 | Cittadinanza digitale | Box "IA e dati" + lessico critico obbligatorio nell'area DIG |
| T8 | IA critica, non magica | Mai descrivere l'IA senza: errore, limite, verifica, controllo |
| T9 | Errore come risorsa | Domanda di revisione obbligatoria nella metacognizione AGISCI |
| T10 | Linguaggio inclusivo UDL | 3 livelli visibili + consegne multimodali + sintesi DSA-friendly |
| T11 | Sicurezza | Box ⚠️ Sicurezza obbligatorio in MC con attività fisiche |
| T12 | Valutazione trasparente | Rubrica con criteri espliciti e osservabili PRIMA del compito |

### 14.3 Allineamento con le IN2025 — impatto sul libro

Le Nuove Indicazioni Nazionali (D.M. n. 221/2025) introducono o rafforzano i seguenti principi che hanno impatto diretto sul linguaggio e sulla struttura del libro:

- **Approccio STEM integrato:** ogni MC ha un campo `uda_collegata` per i progetti trasversali.
- **Distinzione competenze digitali vs. informatiche:** esplicitata nel testo DIG ogni volta che si introduce uno strumento digitale.
- **Uso critico dell'IA:** lessico obbligatorio (bias, allucinazione, verifica) in tutte le MC di area DIG livello A.
- **Didattica laboratoriale:** SPERIMENTA può essere strutturata come "sfida prima del testo" (flipped a livello di pagina).
- **Valutazione autentica:** rubrica con criteri visibili prima del compito in ogni AGISCI.
- **UDL:** tre livelli di attività visibili + consegne multimodali in ogni MC.
- **Deadline critica:** classe 1ª adotta IN2025 da settembre 2026 — il libro deve essere pronto.

### 14.4 Profilo linguistico per livello DigComp

| Livello | Lunghezza max frase | Struttura | Lessico | Domande |
|---|---|---|---|---|
| F (Foundation) | 16 parole | Una info per frase, bullets brevi | Termine + "cioè" + esempio quotidiano | Chiuse o a scelta |
| I (Intermediate) | 22 parole | Paragrafo + bullet | Termine + esempio + controesempio | Aperte con vincoli |
| A (Advanced) | 30 parole | Paragrafo continuo + dati | Termini tecnici senza spiegazione se già introdotti | Aperte, scenario complesso |

### 14.5 Documento normativo di riferimento

**`00_ARCHITETTURA/LINEE_GUIDA_LINGUISTICHE.md`** è il riferimento obbligatorio per:
- Tutti i testi prodotti dagli agenti AI.
- Tutti i testi scritti o revisionati da autori umani.
- La verifica editoriale finale.

La checklist in §6 di quel documento è lo strumento di quality check su ogni testo prima dell'approvazione.

---

## 15. ARCHITETTURA APP — TEMPLATE MC v2

Documentazione tecnica dell'app Next.js realizzata in `05_APP/tecnologia-sito-web/`.

### 15.1 Pattern Server/Client Component

```
app/mc/[id]/page.tsx                  ← Server Component (~150 righe)
│   generateStaticParams()            ← SSG per tutti gli ID MC
│   generateMetadata()                ← titolo "ProfTecnologIA {Area} — {Titolo MC}"
│   carica: MC JSON + testo MD + audio + video + quiz + flashcard + microlearning
└── <MCPageClient {...props} />       ← serializza tutto come props

components/mc/MCPageClient.tsx        ← Client Component (~430 righe)
    MCNavigator                       ← 6 tab sticky con colore areaHex
    ├── ⚡ INNESCA
    │   ├── AudioPlayer (src: hook-audio.mp3)
    │   ├── Domanda stimolo (box giallo)
    │   ├── ReadableBody (testo zona INNESCA del MD)
    │   ├── FlippedVideos (3 video flipped)
    │   └── ResourcesPanel (griglia asset + navigazione rapida)
    ├── 📖 ESPLORA
    │   └── AccordionSection (sottosezioni ### del MD, primo item aperto)
    ├── 🔍 OSSERVA
    │   ├── ReadableBody (testo zona OSSERVA del MD)
    │   └── ProfessioneCard
    │       ├── Immagine img4-professione
    │       ├── Testo narrativo professione (estratto dal MD)
    │       └── CompetenzaTag[] (glossario CLIL interattivo)
    ├── 🔬 SPERIMENTA
    │   └── LevelTabs
    │       ├── ● Base (testo livello Foundation)
    │       ├── ●● Intermedio (testo livello Intermediate)
    │       └── ●●● Avanzato (testo livello Advanced)
    ├── 🌍 AGISCI
    │   ├── RubricaDrawer (estrae tabella rubrica da MD a runtime)
    │   └── ReadableBody (testo zona AGISCI del MD)
    └── 🃏 RIPASSA
        ├── ProcessWidget (4-7 step da microlearning JSON)
        ├── ChecklistWidget (5-6 voci da microlearning JSON)
        ├── QuizWidget (18 domande 6F+6I+6A con feedback)
        └── FlashcardDeck (18 card con tag livello, layout griglia)

    [APPENDICE — fuori dai tab, sempre visibile sotto il navigator]
    SiteFooter (versione v0.1)
```

### 15.2 Marker di parsing nel testo MD

Il Server Component e i componenti client usano marker testuali per segmentare il file `_completa.md`:

| Marker | Effetto |
|---|---|
| `## ⚡ INNESCA` | Delimita la zona INNESCA |
| `## 📖 ESPLORA` | Delimita la zona ESPLORA |
| `## 🔍 OSSERVA` | Delimita la zona OSSERVA |
| `## 🔬 SPERIMENTA` | Delimita la zona SPERIMENTA |
| `## 🌍 AGISCI` | Delimita la zona AGISCI |
| `### titolo` | In ESPLORA: crea item accordion · In SPERIMENTA: demarca i livelli |
| `@@SUBHEAD:●...` | In SPERIMENTA: separatore livello Base/Intermedio/Avanzato |
| `@@CALLOUT: tipo | testo` | Genera `CalloutBox` semantico (safety/physics/error/question/info) |
| `### 📋 Rubrica di valutazione` | In AGISCI: tabella MD letta da `RubricaDrawer` |

### 15.3 Componenti UI disponibili

| Componente | File | Funzione |
|---|---|---|
| `MCNavigator` | `components/mc/MCNavigator.tsx` | 6 tab sticky con aria, localStorage, colore area |
| `AccordionSection` | `components/mc/AccordionSection.tsx` | Accordion collassabile per ESPLORA |
| `LevelTabs` | `components/mc/LevelTabs.tsx` | Tab 3 livelli per SPERIMENTA |
| `CalloutBox` | `components/mc/CalloutBox.tsx` | 5 callout semantici |
| `RubricaDrawer` | `components/mc/RubricaDrawer.tsx` | Drawer rubrica (mobile slide-up, desktop laterale) |
| `ResourcesPanel` | `components/mc/ResourcesPanel.tsx` | Pannello asset + navigazione rapida zone |
| `ProfessioneCard` | `components/mc/ProfessioneCard.tsx` | Card professione del futuro |
| `CompetenzaTag` | `components/mc/CompetenzaTag.tsx` | Tag CLIL interattivi |
| `AudioPlayer` | `components/mc/AudioPlayer.tsx` | Player audio con trascrizione |
| `FlippedVideos` | `components/mc/FlippedVideos.tsx` | 3 video flipped classroom |
| `VideoGallery` | `components/mc/VideoGallery.tsx` | Galleria video area |
| `QuizWidget` | `components/mc/QuizWidget.tsx` | Quiz interattivo 18 domande |
| `FlashcardDeck` | `components/mc/FlashcardDeck.tsx` | Deck flashcard con spaced repetition |
| `ProcessWidget` | `components/mc/ProcessWidget.tsx` | Sequenza passaggi microlearning |
| `ChecklistWidget` | `components/mc/ChecklistWidget.tsx` | Checklist punti chiave |
| `FormulaCard` | `components/mc/FormulaCard.tsx` | Card formula con rendering LaTeX/testo |
| `ProcedureList` | `components/mc/ProcedureList.tsx` | Lista procedura numerata |
| `MCPageClient` | `components/mc/MCPageClient.tsx` | Orchestratore Client Component |

### 15.4 Debt tecnico noto

| ID | Problema | File | Urgenza |
|---|---|---|---|
| D1 | `ReadableBodyInTab` in MCPageClient duplica logica da `ReadableText` — unificare in `lib/readable-text.tsx` | `MCPageClient.tsx` | Media |
| D2 | `splitSperimentaByLevel` usa offset fisso (+15) per saltare l'header — fragile | `MCPageClient.tsx` | Media |
| D3 | Parser rubrica cerca `📋 Rubrica` ma alcune MC potrebbero mancare l'emoji — aggiungere fallback | `RubricaDrawer.tsx` | Bassa |
| D4 | `.fuse_hidden` in FUSE impedisce `npm run build` in place — build deve avvenire in `/tmp` | `next.config.ts` | Bassa |
| D5 | `MCNavigator` usa chiave localStorage basata sui tab ID — usare `mcId` come namespace | `MCNavigator.tsx` | Bassa |

---

## 16. PROTOCOLLO CARBLE-CDD

Il Protocollo CARBLE-CDD (I.C. Nicotera Costabile, v1.0 — 13 maggio 2026) è la procedura standardizzata per la progettazione, costruzione, validazione e archiviazione dei Contenuti Didattici Digitali (CDD), anche quando prodotti con IA generativa.

Documento completo: `00_ARCHITETTURA/Protocollo_CARBLE_CDD_v1.0.md`

### 16.1 I 7 criteri (acronimo D-C-A-R-B-L-E)

| Lettera | Criterio | Domanda guida |
|---|---|---|
| **D** | Disegno didattico | Il CDD ha un obiettivo chiaro, un'azione dello studente, una modalità di verifica? |
| **C** | Correttezza e accuratezza | Questo contenuto può essere usato senza trasmettere errori agli studenti? |
| **A** | Adeguatezza didattica, curricolare e contestuale | È adatto all'età, al livello, al contesto e ai prerequisiti? |
| **R** | Rilevamento di bias e stereotipi | Qualcuno potrebbe sentirsi escluso o rappresentato male? |
| **B** | Fonti, licenze e citabilità | Se mi chiedono da dove viene, posso rispondere con chiarezza? |
| **L** | Linguaggio inclusivo, accessibile e comprensibile | È comprensibile anche da chi parte più indietro o apprende in modo diverso? |
| **E** | Etica, sicurezza e valori educativi | Rispetta la dignità delle persone, tutela gli studenti, mantiene chiara la responsabilità umana? |

### 16.2 Livelli di validazione

| Livello | Quando si usa |
|---|---|
| Informale | Materiali personali del docente: appunti, bozze, prompt preparatori |
| Base | CDD usati in una singola classe: schede, esercizi, quiz, presentazioni brevi |
| Formale | CDD con valore istituzionale, valutativo, pubblico o replicabile |

### 16.3 Esiti possibili

| Esito | Significato | Azione |
|---|---|---|
| ✅ Validabile senza modifiche | Tutti i criteri Conformi | Pubblicazione consentita |
| ⚠️ Validabile con modifiche | Uno o più criteri "Da rivedere" | Revisione autore prima della pubblicazione |
| 🚫 Non validabile — da rigenerare | Uno o più criteri "Non conforme" | Blocco — rigenerazione obbligatoria |

### 16.4 Integrazione nel progetto ProfTecnologIA

- Tutti i microlearning JSON (Process + Checklist) per le 50 MC sono stati prodotti con validazione CARBLE-CDD.
- L'Agente CARBLE-CDD (§6.4) applica il protocollo in modo sistematico prima della pubblicazione di ogni asset.
- La formula di trasparenza obbligatoria: *"Questo materiale è stato realizzato con il supporto di strumenti IA e successivamente controllato, adattato e validato secondo il Protocollo CARBLE-CDD."*
- Riferimento normativo: AI Act (UE) 2024/1689, DM 166/2025, IN 2025 (D.M. n. 221/2025).

---

*Documento originale generato in sessione Claude — Aprile 2026*
*v1.1: catalogazione 63 PDF locali e 14 guide docenti — Aprile 2026*
*v1.2: allineamento alle Nuove Indicazioni Nazionali D.M. n. 221/2025 — Maggio 2026*
*v2.0: revisione maggiore — analisi comparata 14 libri, DNA editoriale, struttura 5 zone, AI Coach, DSA First, Flipped Classroom by default — Maggio 2026*
*v2.1: modello linguistico IN2025, analisi estesa a 19 testi, aggiornamento backlog e agenti — Maggio 2026*
*v2.2: app Next.js template MC v2 (6 tab), Agente CARBLE-CDD, stack tecnologico reale, stato workspace aggiornato, sezioni 15 e 16 — Maggio 2026*
