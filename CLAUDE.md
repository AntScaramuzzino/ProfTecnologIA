# CLAUDE.md — Istruzioni operative per il progetto TecnologIA

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
├── CLAUDE.md                          ← questo file
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

## 6. I 5 AGENTI — RUOLI E CONFINI

### AGENTE CURATORE
- **Cosa fa:** monitora e raccoglie nuove fonti (articoli, video, paper) e le aggiunge ai notebook NotebookLM appropriati. Ricerca video YouTube da fonti prioritarie (case editrici, Geopop, insegnanti SSIG, aziende e consorzi) per ogni MC.
- **Non fa:** sintetizza, non genera contenuti didattici.
- **Trigger:** periodico (settimanale) o su richiesta esplicita.
- **Output:** lista di fonti aggiunte (NB-TESTI | NB-VIDEO | NB-ARTICOLI) + file `data/videos/[MC-ID].json`.

### AGENTE SINTETIZZATORE
- **Cosa fa:** interroga NotebookLM in modalità asincrona, estrae output (brief, quiz, mappe, flashcard) e li formatta secondo lo schema MC.
- **Non fa:** non crea infografiche, non interagisce con lo studente.
- **Modalità:** NotebookLM NON ha API in tempo reale — opera sempre in batch/asincrono.
- **Output:** asset JSON strutturati depositati in `04_CONTENUTI/`.

### AGENTE GENERATORE DI ASSET
- **Cosa fa:** produce immagini AI (6 tipologie per MC con GPT Image 2 / Higgsfield), audio hook podcast (edge-tts voce it-IT-IsabellaNeural), script hook narrativi, quiz situazionali.
- **Strumenti:** Claude API + GPT Image 2 (OpenAI) + Higgsfield + edge-tts Microsoft.
- **Non fa:** non gestisce fonti, non interagisce con il profilo studente.
- **Output:** PNG in `04_CONTENUTI/visual/`, MP3 + trascrizioni in `04_CONTENUTI/microlearning/hook/`.

### AGENTE CARBLE-CDD *(nuovo — quality assurance)*
- **Cosa fa:** valida ogni CDD prodotto dagli altri agenti secondo il Protocollo CARBLE-CDD v1.0 (I.C. Nicotera Costabile, 13/05/2026). Applica i 7 criteri: **D** Disegno didattico · **C** Correttezza · **A** Adeguatezza · **R** Bias · **B** Fonti/licenze · **L** Linguaggio/accessibilità · **E** Etica/sicurezza.
- **Non fa:** non genera contenuti, non modifica direttamente i file — produce un parere istruttorio. La decisione finale spetta all'autore umano.
- **Trigger:** dopo ogni produzione di CDD (testo, immagine, audio, quiz, video playlist) e prima di ogni pubblicazione sul sito.
- **Soglie:** ✅ Tutti Conformi → pubblica · ⚠️ Da rivedere → notifica autore · 🚫 Non conforme → blocca.
- **Output:** scheda JSON di validazione + report Markdown in `04_CONTENUTI/validazione/`.
- **Riferimento:** `02_AGENTI/agente_carble_cdd/prompt.md` + `00_ARCHITETTURA/Protocollo_CARBLE_CDD_v1.0.md`.

### AGENTE PERSONALIZZATORE
- **Cosa fa:** legge il profilo e i progressi dello studente, seleziona le MC appropriate, sequenzia i contenuti (prerequisiti → MC target), aggiorna il percorso.
- **Non fa:** non genera contenuti, non raccoglie fonti.
- **Output:** percorso JSON personalizzato per studente con MC ordinate e livello DigComp attuale.

### Pipeline degli agenti

```
Agente Curatore         → fonti, video YouTube per MC
        ↓
Agente Sintetizzatore   → asset JSON strutturati
        ↓
Agente Generatore Asset → immagini AI, audio, quiz, script
        ↓
Agente CARBLE-CDD       → validazione (D-C-A-R-B-L-E)
        ↓              [correzioni manuali autore se necessario]
Agente Personalizzatore → percorso personalizzato studente
```

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

## 9. REGOLE DI COMPORTAMENTO DI CLAUDE IN QUESTO PROGETTO

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
- Non aggiungere MC oltre le 52 previste (target aggiornato da 48 a 52 — vedi INDICE_ProfTecnologIA_v1.0 §5.1) senza prima aggiornare il documento architetturale.
- Non modificare la progressione tematica per anno (1ª = Materiali, 2ª = Alimentazione+Città, 3ª = Energia+Comunicazioni) — è una scelta editoriale di Antonio Scaramuzzino.

### Quando non sai qualcosa
Dì esplicitamente "Non ho dati verificati su questo" e proponi come trovare l'informazione corretta. Non inventare riferimenti normativi, SDG, o traguardi IN.

---

## 10. BACKLOG PRIORITIZZATO (stato attuale)

> **Target MC aggiornato: 52** (da 48) — vedi INDICE_ProfTecnologIA_v1.0.md §5.1 per motivazione.
> **Stato al 2026-05-10:** 50 MC JSON in matrice · 56 testi _completa.md (50 standard + 6 INF) · app Next.js buildata · syllabus completi · design system ✅
> **Risoluzione DIG/INF:** MC-DIG-2-03/04 e MC-DIG-3-03/04 coesistono in matrice. Area INF (Informatica) è separata con 6 testi in 08_TESTI ma ancora senza JSON in matrice.

### Architettura e indice

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | Creare INDICE_ProfTecnologIA_v1.0.md (blueprint editoriale volume unico triennio) | ✅ Fatto — 2026-05-09 |
| ✅ | Validare 15 MC [◆] nuove contro IN 2025, Paci, Hypertech | ✅ Fatto — 2026-05-09 |
| ✅ | Pacchetto visuale pilota MC-MAT-1-02 (illustrazione + diagramma + manifest) | ✅ Fatto — 2026-05-09 |
| ✅ | Aggiornare ref IN 2012→2025 in tutte le MC esistenti | ✅ Fatto — tutte le 50 MC usano già "IN 2025 (D.M. n. 221/2025)" |
| ✅ | Aggiornare MC-MAT-1-02 con Cicli tecnologici (IN 2025) | ✅ Fatto — campo IN aggiornato con "Cicli tecnologici" |
| ⚠️ | ~~Aggiungere MC-DIG-2-03/04 (Sistema operativo, Cifratura)~~ | ⚠️ Ridefinito — DIG-2-03/04 e DIG-3-03/04 esistono in matrice; INF-2-01/02 coprono il versante informatico. |
| 0 | ⚡ **Decidere target definitivo MC**: il target 52 include o esclude le 6 MC-INF? | ⬜ Decisione editoriale da prendere |
| 1 | Espandere MC Advanced da 4 a 6 pagine nell'Indice (12 MC interessate) | ⬜ Da fare |
| 1 | Aggiungere 2 UDA interdisciplinari bonus all'Indice (sezione conclusiva per anno) | ⬜ Da fare |

### Matrice MC

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | Portare le MC a 50 JSON (da 30) | ✅ Fatto — 50 MC JSON in 01_MATRICE_MC |
| ✅ | MC-MAT-1-05 (Metalli) e MC-MAT-1-06 (Fibre/compositi) come JSON | ✅ Fatto |
| ✅ | Documentare progressione verticale DIG/DIS come file dedicato | ✅ Fatto — `01_MATRICE_MC/PROGRESSIONE_VERTICALE_DIG_DIS.md` |
| ✅ | Campo `prerequisiti` in ogni MC (struttura catena dipendenze) | ✅ Parziale — 40/50 MC con prerequisiti compilati, 10 ancora vuoti |
| ✅ | Campi v2.0 (`hook_audio`, `professione_futura`, `sdg_principale`, `clil_termini`, `uda_collegata`) | ✅ Parziale — 11/50 MC aggiornate (MAT-1-01/02, DIG-2-03/04, DIG-3-03/04, ENE-3-05/06, COM-3-05/06, DIS-2-02) |
| 1 | Creare 6 JSON MC-INF in `01_MATRICE_MC/` (testi già pronti in 08_TESTI) | ⬜ Da fare — INF-1-01/02, INF-2-01/02, INF-3-01/02 |
| 1 | Completare prerequisiti nelle 10 MC con campo vuoto | ⬜ Da fare |
| 1 | Aggiungere campi v2.0 alle 39 MC ancora senza | ⬜ Da fare |
| 2 | Raggiungere target 52 MC JSON (mancano 2 rispetto alle 50 attuali, escluse INF) | ⬜ Da fare — identificare quali aree espandere (DIS o SIS candidati) |

### Struttura editoriale e contenuti

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | Testi narrativi (ESPLORA) per tutte le MC | ✅ Fatto — 56 _completa.md (50 standard + 6 INF) |
| ✅ | Hook audio (script podcast) per MC pilota | ✅ Parziale — ~34 hook presenti; mancano 22 MC (ALI-2-04/05/06, AMB-2-04/05/06, COM-3-05/06, DIG-2-03/04, DIG-3-03/04, DIS-1-02, DIS-2-02, DIS-3-02, ENE-3-04/05/06, MAT-1-05/06, SIS-3-03/04) |
| ✅ | SVG visual per tutte le MC standard | ✅ Fatto — SVG generati per tutte le 50 MC |
| ✅ | Brain integration (RAPPORTO_INTEGRAZIONI_brain_v1.0.md) | ✅ Fatto — 14 integrazioni applicate su 12 MC; ~8 integrazioni residue raccomandate |
| 2 | Completare hook script per le 22 MC mancanti | ⬜ Da fare |
| 2 | Applicare integrazioni brain residue (vedi `00_ARCHITETTURA/RAPPORTO_INTEGRAZIONI_brain_v1.0.md`) | ⬜ Da fare |
| 3 | Creare asset in `04_CONTENUTI/compiti_realta/`, `flashcard/`, `quiz/` (cartelle ancora vuote) | ⬜ Da fare |

### Syllabus

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | Syllabus annuale dettagliato per docenti (tutte e 3 le classi) | ✅ Fatto |
| ✅ | Versione syllabus per studenti e famiglie (tutte e 3 le classi) | ✅ Fatto |

### Sistema agenti e NotebookLM

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | Agente microlearning — prompt e README | ✅ Fatto — `02_AGENTI/agente_microlearning/` |
| ✅ | Script Python Agente Sintetizzatore | ✅ Fatto — `sintetizzatore.py` e `notion_setup.py` presenti (non testati in produzione) |
| ✅ | NB-TESTI catalogo libri | ✅ Parziale — `CATALOGO_LIBRI.md` presente; caricamento Paci + Hypertech ⬜ |
| 2 | Caricare Paci + Hypertech su NB-TESTI | ⬜ Da fare |
| 2 | Creare NB-VIDEO con URL YouTube selezionati per area | ⬜ Da fare |
| 2 | Creare NB-ARTICOLI con feed innovazione | ⬜ Da fare |
| 3 | Parser NotebookLM → schema MC v2.0 | ⬜ Da fare |
| 3 | Connettore verso Notion (Layer 2) | ⬜ Da fare |

### App studenti

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | App Next.js con navigazione MC (struttura per anno/area/MC) | ✅ Fatto — `05_APP/tecnologia-sito-web/` buildata e pronta per deploy Netlify |
| ✅ | Design system + design tokens | ✅ Fatto — `TecnologIA_Design_System.html` + `design-tokens.json` |
| 4 | Sistema tracciamento progressi studente per MC | ⬜ Da verificare/completare nell'app |
| 4 | Quiz adattivi (3 livelli per MC) | ⬜ Da verificare/completare nell'app |
| 4 | Deploy Netlify | ⬜ Da fare — guida pronta in `DEPLOY_NETLIFY.md` |

Aggiorna questo backlog ad ogni sessione di lavoro.

---

*Ultima modifica: 2026-05-10*
