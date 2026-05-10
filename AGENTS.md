# AGENTS.md — Istruzioni operative per il progetto TecnologIA

**Progetto:** Libro di Tecnologia + Sistema Agenti + App Personalizzata
**Autore:** Antonio Scaramuzzino
**Versione:** 1.1 — Maggio 2026

---

## 1. IDENTITÀ DI PROGETTO

Questo workspace è il sistema operativo del progetto **TecnologIA**: un ecosistema didattico per la scuola secondaria di primo grado composto da un libro di Tecnologia, un sistema di agenti AI e un'app per studenti.

Il documento di riferimento architetturale è `00_ARCHITETTURA/PROGETTO_LIBRO_TECNOLOGIA_architettura.md`. Leggilo se non l'hai già fatto prima di qualsiasi operazione non triviale.

---

## 2. MAPPA DEL WORKSPACE

```
TecnologIA/
├── AGENTS.md                          ← questo file
├── 00_ARCHITETTURA/                   ← decisioni architetturali, documenti di progetto
├── 01_MATRICE_MC/                     ← micro-competenze codificate (MC-TECH-2025)
│   ├── schema_MC.json                 ← struttura dati canonica di ogni MC
│   ├── classe_1/  → MAT · DIS · DIG
│   ├── classe_2/  → ALI · AMB · DIS · DIG
│   └── classe_3/  → ENE · COM · SIS · DIS · DIG
├── 02_AGENTI/                         ← prompt e logica dei 4 agenti AI
│   ├── agente_curatore/
│   ├── agente_sintetizzatore/
│   ├── agente_generatore_asset/
│   └── agente_personalizzatore/
├── 03_NOTEBOOKLM/                     ← gestione dei 3 knowledge repo
│   ├── NB-TESTI/
│   ├── NB-VIDEO/
│   └── NB-ARTICOLI/
├── 04_CONTENUTI/                      ← asset didattici generati dagli agenti
│   ├── quiz/ · microlearning/ · visual/ · flashcard/ · compiti_realta/
├── 05_APP/                            ← frontend React/Next.js per studenti
├── 06_SYLLABUS/                       ← syllabus annuali (docenti, studenti, famiglie)
│   ├── classe_1/ · classe_2/ · classe_3/
├── 07_GUIDE/                          ← guide operative e didattiche per destinatario
│   ├── docenti/                       ← metodologia, differenziazione, valutazione
│   ├── studenti/                      ← uso app, percorsi, compiti di realtà
│   ├── famiglie/                      ← presentazione progetto, glossario semplificato
│   └── operative/                     ← configurazione sistema, agenti, NotebookLM
├── 08_TESTI/                          ← testi narrativi del libro per classe e area
│   ├── classe_1/  → MAT · DIS · DIG
│   ├── classe_2/  → ALI · AMB · DIS · DIG
│   └── classe_3/  → ENE · COM · SIS · DIS · DIG
└── O9_INDICAZIONI_NAZIONALI/          ← Nuove IN 2025 (D.M. n. 221/2025) + analisi delta
```

### Distinzione chiave tra cartelle simili

| Cartella | Contiene | Non contiene |
|----------|----------|--------------|
| `01_MATRICE_MC/` | Schema JSON di ogni MC (struttura dati) | Testo narrativo per studenti |
| `04_CONTENUTI/` | Asset generati dagli agenti (quiz, visual, card) | Testi del libro |
| `06_SYLLABUS/` | Pianificazione annuale per unità didattica | Guide metodologiche |
| `07_GUIDE/` | Guide per usare il sistema e la didattica | Contenuti per studenti |
| `08_TESTI/` | Testi narrativi del libro (250-400 parole per MC) | JSON, slide, quiz |

---

## 3. SISTEMA DI CODIFICA MC-TECH-2025

Ogni micro-competenza (MC) ha un ID univoco con questa sintassi:

```
MC-[AREA]-[ANNO]-[NN]
```

### Aree e anni di riferimento

| Codice | Area | Emoji | Anno |
|--------|------|-------|------|
| MAT | Materiali e Rifiuti | 🪨 | 1ª |
| DIS | Disegno Tecnico | 📐 | 1ª · 2ª · 3ª |
| DIG | Digitale / Coding / AI | 💻 | 1ª · 2ª · 3ª |
| ALI | Alimentazione | 🌾 | 2ª |
| AMB | Abitazione, Città, Territorio | 🏗️ | 2ª |
| ENE | Energia e Macchine | ⚡ | 3ª |
| COM | Comunicazioni e Trasporti | 📡 | 3ª |
| SIS | Sistemi / Economia e Lavoro | ⚙️ | 3ª |

### Progressione DigComp trasversale

| Area | 1ª | 2ª | 3ª |
|------|----|----|-----|
| DIG | Foundation (F) | Intermediate (I) | Advanced (A) |
| DIS | Foundation (F) | Intermediate (I) | Advanced (A) |
| MAT | Foundation (F) | — | — |
| ALI | — | F → I | — |
| AMB | — | F → I | — |
| ENE | — | — | I → A |
| COM | — | — | I → A |
| SIS | — | — | I |

**Regola critica:** non retrocedere mai il livello DigComp nel triennio. La progressione è sempre F → I → A, mai il contrario.

---

## 4. FRAMEWORK INCROCIATI

Ogni MC può essere allineata a uno o più di questi framework. Usa le sigle esatte:

| Sigla | Framework | Versione |
|-------|-----------|---------|
| IN | Indicazioni Nazionali MIM | D.M. n. 221, 9 dicembre 2025 |
| DC | DigComp | 3.0 |
| EC | EntreComp | — |
| LC | LifeComp | — |
| EV | Educazione Civica / Agenda 2030 | L. 92/2019 |

---

## 5. SCHEMA DATI CANONICO DI UNA MC

Quando crei o modifichi una MC, usa sempre questa struttura JSON (file in `01_MATRICE_MC/schema_MC.json`):

```json
{
  "id": "MC-[AREA]-[ANNO]-[NN]",
  "area": "string",
  "anno": 1,
  "titolo": "string",
  "descrizione": "string",
  "fonte": "string (Paci 2014 | Hypertech 2020 | altro)",
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
  "prerequisiti": ["MC-ID-1", "MC-ID-2"],
  "tags": ["array", "di", "parole", "chiave"],
  "compito_realta": "string"
}
```

I campi `prerequisiti` e `compito_realta` sono obbligatori nelle MC dalla versione 2.0 in poi.

---

## 6. I 4 AGENTI — RUOLI E CONFINI

### AGENTE CURATORE
- **Cosa fa:** monitora e raccoglie nuove fonti (articoli, video, paper) e le aggiunge ai notebook NotebookLM appropriati.
- **Non fa:** sintetizza, non genera contenuti didattici.
- **Trigger:** periodico (settimanale) o su richiesta esplicita.
- **Output:** lista di fonti aggiunte con notebook di destinazione (NB-TESTI | NB-VIDEO | NB-ARTICOLI).

### AGENTE SINTETIZZATORE
- **Cosa fa:** interroga NotebookLM in modalità asincrona, estrae output (brief, quiz, mappe, flashcard) e li formatta secondo lo schema MC.
- **Non fa:** non crea infografiche, non interagisce con lo studente.
- **Modalità:** NotebookLM NON ha API in tempo reale — opera sempre in batch/asincrono.
- **Output:** asset JSON strutturati depositati in `04_CONTENUTI/`.

### AGENTE GENERATORE DI ASSET
- **Cosa fa:** produce infografiche, mappe concettuali, microlearning card, quiz situazionali da compiti di realtà.
- **Strumenti:** Codex API + Canva API.
- **Non fa:** non gestisce fonti, non interagisce con il profilo studente.
- **Output:** file visivi o card in `04_CONTENUTI/{visual|quiz|microlearning}`.

### AGENTE PERSONALIZZATORE
- **Cosa fa:** legge il profilo e i progressi dello studente, seleziona le MC appropriate, sequenzia i contenuti (prerequisiti → MC target), aggiorna il percorso.
- **Non fa:** non genera contenuti, non raccoglie fonti.
- **Output:** percorso JSON personalizzato per studente con MC ordinate e livello DigComp attuale.

---

## 7. TONO E STILE PER I CONTENUTI DIDATTICI

### Per gli studenti (classi 1ª-3ª secondaria I grado)
- Linguaggio diretto, concreto, senza tecnicismi non spiegati.
- Ogni concetto nuovo va ancorato a un oggetto, un'esperienza o un problema reale che lo studente conosce.
- Usa la seconda persona singolare ("tu", "il tuo", "prova a...").
- Le spiegazioni seguono questa sequenza: **hook** (domanda o scenario reale) → **concetto** → **esempio** → **applicazione**.
- Evita il tono enciclopedico. Non è Wikipedia.
- I compiti di realtà devono sempre iniziare con un verbo d'azione (Analizza, Progetta, Costruisci, Documenta, Calcola...).

### Per i docenti (syllabus, guide, progettazione)
- Tono professionale ma non burocratico.
- Struttura sempre con obiettivi → metodologia → valutazione.
- Sii esplicito sui framework allineati e sui traguardi IN.
- Distingui chiaramente i tre livelli di differenziazione: base, intermedio, avanzato.

### Per le famiglie
- Linguaggio accessibile, nessuna sigla senza spiegazione.
- Enfatizza il collegamento tra ciò che il figlio impara e la vita quotidiana.
- Massimo 3-4 punti chiave per documento.

---

## 8. REGOLE DI FORMATTAZIONE OUTPUT

### File Markdown (documentazione, syllabus, guide)
- Titoli H1 solo per il nome del documento.
- H2 per sezioni principali, H3 per sottosezioni.
- Tabelle per confronti e matrici.
- Liste puntate solo per elementi non ordinati e non gerarchici.
- Nessun grassetto decorativo — usa il grassetto solo per termini tecnici e ID.

### File JSON (MC, schemi dati, percorsi agenti)
- Indentazione a 2 spazi.
- Tutti i campi obbligatori sempre presenti (anche se vuoti con `null` o `""`).
- Gli ID seguono sempre il formato MC-TECH-2025 senza variazioni.
- Nessun campo aggiuntivo non previsto dallo schema senza aggiornare prima `schema_MC.json`.

### Asset didattici
- **Quiz:** ogni domanda ha 4 opzioni, una sola corretta, e un feedback per risposta sbagliata che spiega perché è sbagliata (non solo "risposta errata").
- **Microlearning card:** max 80 parole, un solo concetto per card, immagine suggerita descritta in testo.
- **Flashcard:** fronte = domanda o termine, retro = risposta in max 2 righe.
- **Compito di realtà:** struttura fissa: scenario → consegna → materiali → criteri di valutazione → estensione avanzata.

---

## 9. REGOLE DI COMPORTAMENTO DI Codex IN QUESTO PROGETTO

### Prima di qualsiasi operazione non triviale
1. Leggi `00_ARCHITETTURA/PROGETTO_LIBRO_TECNOLOGIA_architettura.md`.
2. Identifica l'area tematica, l'anno scolastico e il livello DigComp coinvolti.
3. Verifica che l'ID MC che stai per usare non esista già in `01_MATRICE_MC/`.

### Quando generi una MC
- Non inventare framework non presenti nel documento architetturale.
- Il campo `fonte` deve riferirsi a Paci 2014 o Hypertech 2020, o indicare "originale" se non derivato da nessuna delle due.
- Il compito di realtà deve essere autentico, realizzabile in contesto scolastico italiano, con risorse disponibili a costo zero o quasi.

### Quando generi contenuti didattici
- Parte sempre dal `compito_realta` della MC come ancora progettuale.
- Differenzia sempre su almeno tre livelli (base / intermedio / avanzato).
- I contenuti di livello Avanzato (A) possono includere pensiero critico, scenari aperti, progettazione autonoma.
- I contenuti di livello Foundation (F) devono essere accessibili anche a studenti con BES lievi.

### Vincoli tecnici da non violare
- NotebookLM non è interrogabile via API in tempo reale. Opera sempre in modalità batch.
- Il Layer 2 (Notion o Airtable) è il punto di verità per i contenuti strutturati — non il file system.
- Non aggiungere MC oltre le 48 previste senza prima aggiornare il documento architetturale.
- Non modificare la progressione tematica per anno (1ª = Materiali, 2ª = Alimentazione+Città, 3ª = Energia+Comunicazioni) — è una scelta editoriale di Antonio Scaramuzzino.

### Quando non sai qualcosa
Dì esplicitamente "Non ho dati verificati su questo" e proponi come trovare l'informazione corretta. Non inventare riferimenti normativi, SDG, o traguardi IN.

---

## 10. BACKLOG PRIORITIZZATO (stato attuale)

| Priorità | Task | Stato |
|----------|------|-------|
| 0 | Aggiornare ref IN 2012→2025 in tutte le MC esistenti | ⬜ Da fare |
| 0 | Aggiungere MC-DIG-2-03 (Sistema operativo) e MC-DIG-2-04 (Cifratura/sicurezza) | ⬜ Da fare |
| 0 | Aggiornare MC-MAT-1-02 con Cicli tecnologici completi (IN 2025) | ⬜ Da fare |
| 1 | Portare le MC da 24 a 48 (6 per area) — includendo MC da IN 2025 | ⬜ Da fare |
| 1 | Aggiungere campo `prerequisiti` a ogni MC | ⬜ Da fare |
| 1 | Documentare progressione verticale DIG e DIS | ⬜ Da fare |
| 1 | Aggiungere MC-MAT-1-05 (Metalli) e MC-MAT-1-06 (Fibre/compositi) | ⬜ Da fare |
| 2 | Creare NB-TESTI e caricare Paci + Hypertech | ⬜ Da fare |
| 2 | Creare NB-VIDEO con URL YouTube selezionati | ⬜ Da fare |
| 2 | Creare NB-ARTICOLI con feed innovazione | ⬜ Da fare |
| 3 | Script Python Agente Sintetizzatore | ⬜ Da fare |
| 3 | Parser NotebookLM → schema MC | ⬜ Da fare |
| 3 | Connettore verso Notion (Layer 2) | ⬜ Da fare |
| 4 | Prototipo app React con navigazione MC | ⬜ Da fare |
| 4 | Sistema tracciamento progressi studente | ⬜ Da fare |
| 4 | Quiz adattivi (3 livelli per MC) | ⬜ Da fare |
| 5 | Syllabus annuale dettagliato per docenti | ⬜ Da fare |
| 5 | Versione syllabus per studenti e famiglie | ⬜ Da fare |
| 5 | Pacchetto visuale pilota MC-MAT-1-02 (illustrazione + diagramma + manifest) | ✅ Fatto — 2026-05-09 |

Aggiorna questo backlog ad ogni sessione di lavoro.

---

*Ultima modifica: Maggio 2026*

## Imported Claude Cowork project instructions
