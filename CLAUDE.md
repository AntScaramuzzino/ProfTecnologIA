# CLAUDE.md — Istruzioni operative per il progetto TecnologIA

**Progetto:** Libro di Tecnologia + Sistema Agenti + App Personalizzata
**Autore:** Antonio Scaramuzzino
**Versione:** 1.4 — Luglio 2026

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
│   └── visual_esplora/                ← 56 brief con prompt descrittivi per immagini ESPLORA + generatore Python
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
└── 09_INDICAZIONI_NAZIONALI/          ← Nuove IN 2025 (D.M. n. 221/2025) + analisi delta
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

### AGENTE CURATORE *(futuro opzionale — non operativo)*
- **Cosa fa (progettato):** monitora e raccoglie nuove fonti (articoli, video, paper) e le aggiunge ai notebook NotebookLM appropriati. Ricerca video YouTube da fonti prioritarie per ogni MC.
- **Stato attuale:** NB-VIDEO e NB-ARTICOLI non esistono; NB-TESTI ha solo `CATALOGO_LIBRI.md` senza contenuti caricati. I PDF editoriali (Paci, Hypertech) non sono stati indicizzati in NotebookLM.
- **Output (se operativo):** lista di fonti + file `data/videos/[MC-ID].json`.

### AGENTE SINTETIZZATORE *(futuro opzionale — non eseguibile)*
- **Cosa fa (progettato):** interroga NotebookLM in modalità asincrona, estrae output (brief, quiz, mappe, flashcard) e li formatta secondo lo schema MC.
- **Stato attuale:** `sintetizzatore.py` richiede credenziali NotebookLM + Notion che non esistono. Non è mai stato eseguito. I quiz, le flashcard e il microlearning delle 52 MC sono stati prodotti via **Claude API in batch direttamente in `05_APP/tecnologia-sito-web/data/`** — non attraverso questa pipeline.
- **Modalità futura:** NotebookLM NON ha API in tempo reale — opererebbe sempre in batch/asincrono.
- **Output (se operativo):** asset JSON strutturati depositati in `04_CONTENUTI/`.

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

### Pipeline reale v1 (operativa — luglio 2026)

Questa è la pipeline effettivamente in produzione. Qualsiasi documento che descriva altro è superato.

```
Claude API (batch interattivo con autore)
        ↓
05_APP/tecnologia-sito-web/data/
   ├── mc/           ← 52 JSON MC (fonte canonica strutturata)
   ├── quiz/         ← 52 × 18 domande
   ├── flashcards/   ← 52 × 18 card
   └── microlearning/← 52 × process + checklist
        ↓
next build → static export (out/)
        ↓
GitHub Pages / Vercel / Netlify
```

**Fonte canonica (SSOT):** `05_APP/tecnologia-sito-web/data/` + `public/assets/` — non Notion, non Airtable, non NotebookLM.

### Pipeline aspirazionale v2 (futura — non implementata)

```
Agente Curatore         → fonti, video YouTube per MC
        ↓
Agente Sintetizzatore   → asset JSON strutturati (richiede NB + Notion)
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
- **SSOT:** la fonte canonica di tutti i contenuti consumati dall'app è `05_APP/tecnologia-sito-web/data/`. Notion, Airtable e NotebookLM non sono attivi come sistemi di verità — non esistono come layer strutturati in questo progetto. Non fare riferimento a "Layer 2" come punto di verità: è un'architettura progettata, non costruita.
- NotebookLM non è interrogabile via API in tempo reale. Se mai venisse implementato, opererebbe sempre in modalità batch/asincrona.
- Non aggiungere MC oltre le 58 previste (52 standard + 6 INF — target definitivo deciso il 2026-07-12, vedi §10) senza prima aggiornare il documento architetturale.
- Non modificare la progressione tematica per anno (1ª = Materiali, 2ª = Alimentazione+Città, 3ª = Energia+Comunicazioni) — è una scelta editoriale di Antonio Scaramuzzino.

### Quando non sai qualcosa
Dì esplicitamente "Non ho dati verificati su questo" e proponi come trovare l'informazione corretta. Non inventare riferimenti normativi, SDG, o traguardi IN.

---

## 10. BACKLOG PRIORITIZZATO (stato attuale)

> **Target MC definitivo: 58** (52 standard + 6 INF) — decisione editoriale presa il 2026-07-12: le MC-INF rientrano nel target totale, non sono extratarget. Sostituisce ogni riferimento precedente a "target 52".
> **Stato al 2026-07-12:** **58 MC JSON in matrice** (52 standard + 6 MC-INF, tutte già presenti in `01_MATRICE_MC/classe_*/INF/`) · 56 testi _completa.md invariato (50 standard + 6 INF, copertura testi già completa) · app Next.js buildata (69 pagine statiche, 0 errori TS) · syllabus completi · design system ✅ · template MC v2 (navigator **8 tab**: INNESCA/ESPLORA/OSSERVA/SPERIMENTA/AGISCI/RIPASSA + PROFESSIONI + CLIL) ✅ · microlearning JSON (52 MC × Process + Checklist) ✅ · quiz 18 domande (52 MC × 6F+6I+6A) ✅ · flashcard 18 card (52 MC) ✅ · Analisi allineamento IN2025 completata ✅ (`00_ARCHITETTURA/ANALISI_IN2025_aggiornamento_MC.md`) · 6 MC aggiornate con riferimenti DM 183/2024 ✅ · quiz+flashcard rigenerati per 6 MC con DM 183/2024 EV (D1/D2/D3) ✅ · Pagina /glossario app ✅ · Sistema tracciamento progressi studente ✅ (useStudentSession + useProgress per-student localStorage + SDG badge system + ProgressiClient challenge guide) · **Presentazioni WebP committate: 58/58 MC — copertura completa (2026-07-19)** ✅
> **Risoluzione DIG/INF:** MC-DIG-2-03/04 e MC-DIG-3-03/04 coesistono in matrice. Area INF (Informatica) è separata e ha ora JSON completo in matrice (6/6) — vedi decisione target 58 sopra. Quiz/flashcard/microlearning prodotti e committati per tutte e 6 le MC-INF (2026-07-18) ✅. Hook script già presenti in 08_TESTI ✅. MP3 hook audio (edge-tts it-IT-IsabellaNeural) generati e committati (2026-07-19) ✅. data/mc/classe_*/INF/ sincronizzati con durate reali ✅. Presentazioni WebP: tutte e 6 le MC-INF ✅ (INF-3-01/02 completate 2026-07-19, commit d922d28). Area INF completa su tutti i fronti.
> **Allineamento DM 183/2024:** EV framework aggiornato in MC-DIG-1-02, MC-DIG-2-02, MC-DIG-2-04, MC-DIG-3-02, MC-COM-3-06, MC-COM-3-02 con riferimenti espliciti ai Traguardi D1/D2/D3 di Cittadinanza digitale.

### Architettura e indice

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | Creare INDICE_ProfTecnologIA_v1.0.md (blueprint editoriale volume unico triennio) | ✅ Fatto — 2026-05-09 |
| ✅ | Validare 15 MC [◆] nuove contro IN 2025, Paci, Hypertech | ✅ Fatto — 2026-05-09 |
| ✅ | Pacchetto visuale pilota MC-MAT-1-02 (illustrazione + diagramma + manifest) | ✅ Fatto — 2026-05-09 |
| ✅ | Aggiornare ref IN 2012→2025 in tutte le MC esistenti | ✅ Fatto — tutte le 50 MC usano già "IN 2025 (D.M. n. 221/2025)" |
| ✅ | Aggiornare MC-MAT-1-02 con Cicli tecnologici (IN 2025) | ✅ Fatto — campo IN aggiornato con "Cicli tecnologici" |
| ⚠️ | ~~Aggiungere MC-DIG-2-03/04 (Sistema operativo, Cifratura)~~ | ⚠️ Ridefinito — DIG-2-03/04 e DIG-3-03/04 esistono in matrice; INF-2-01/02 coprono il versante informatico. |
| ✅ | Analisi allineamento IN2025 e DM 183/2024 → 50 MC esistenti | ✅ Fatto — 2026-07-07 · `00_ARCHITETTURA/ANALISI_IN2025_aggiornamento_MC.md` |
| ✅ | Aggiungere MC-DIG-1-03 (Pensiero computazionale) e MC-DIG-2-05 (Benessere digitale) | ✅ Fatto — 2026-07-07 · target 52 raggiunto |
| ✅ | Aggiornare EV framework in 6 MC con riferimenti DM 183/2024 Traguardi D1/D2/D3 | ✅ Fatto — 2026-07-07 |
| ✅ | ⚡ **Decidere target definitivo MC**: il target 52 include o esclude le 6 MC-INF? | ✅ Deciso — 2026-07-12: target definitivo **58** (52 standard + 6 INF), le MC-INF sono incluse nel conteggio totale |
| 1 | Espandere MC Advanced da 4 a 6 pagine nell'Indice (12 MC interessate) | ⬜ Da fare |
| 1 | Aggiungere 2 UDA interdisciplinari bonus all'Indice (sezione conclusiva per anno) | ⬜ Da fare |

### Matrice MC

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | Portare le MC a 52 JSON (target) | ✅ Fatto — 52 MC JSON in 01_MATRICE_MC (2026-07-07) |
| ✅ | MC-MAT-1-05 (Metalli) e MC-MAT-1-06 (Fibre/compositi) come JSON | ✅ Fatto |
| ✅ | Documentare progressione verticale DIG/DIS come file dedicato | ✅ Fatto — `01_MATRICE_MC/PROGRESSIONE_VERTICALE_DIG_DIS.md` |
| ✅ | Campo `prerequisiti` in ogni MC (struttura catena dipendenze) | ✅ Fatto — 42/50 compilati; 8 vuoti sono le MC-*-01 di ogni area (primo della sequenza, nessun prerequisito per design) |
| ✅ | Campi v2.0 (`hook_audio`, `professione_futura`, `clil_termini`, `uda_collegata`) | ✅ Fatto — 50/50 MC aggiornate |
| ✅ | Campo v2.0 `sdg_principale` | ✅ Parziale — 11/50 MC; 39 ancora senza |
| ✅ | Creare 6 JSON MC-INF in `01_MATRICE_MC/` (testi già pronti in 08_TESTI) | ✅ Fatto — 6/6 presenti in `01_MATRICE_MC/classe_{1,2,3}/INF/` (verificato 2026-07-12; nota: `clil_termini` usa chiavi `{it,en,def}` invece di `{italiano,inglese,pronuncia_ipa}` e alcuni file hanno un campo extra `professioni_future` non previsto da `schema_MC.json` — da allineare quando si aggiorna lo schema) |
| ✅ | Completare `sdg_principale` nelle 39 MC mancanti | ✅ Fatto — 2026-07-07 · tutte le 52 MC hanno `sdg_principale` come intero |
| ✅ | Raggiungere target 52 MC JSON | ✅ Fatto — MC-DIG-1-03 + MC-DIG-2-05 (2026-07-07) |
| ✅ | Creare testi _completa.md per MC-DIG-1-03 e MC-DIG-2-05 | ✅ Fatto — 2026-07-07 · `08_TESTI/classe_1/DIG/MC-DIG-1-03_completa.md` (Pensiero computazionale) · `08_TESTI/classe_2/DIG/MC-DIG-2-05_completa.md` (Benessere digitale) |

### Struttura editoriale e contenuti

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | Testi narrativi (ESPLORA) per tutte le MC | ✅ Fatto — 56 _completa.md (50 standard + 6 INF) |
| ✅ | Hook audio (script podcast) per tutte le MC | ✅ Fatto — 56 hook presenti (50 standard + 6 INF), copertura completa |
| ✅ | SVG visual per tutte le MC standard | ✅ Fatto — SVG generati per tutte le 50 MC |
| ✅ | Visual brief ESPLORA v2 — generatore + 56 file con 423 prompt descrittivi di scena | ✅ Fatto — 2026-05-12 · `04_CONTENUTI/visual_esplora/_generate_visual_briefs.py` + `_INDEX.md` · 10 tipologie immagine (timeline, flowchart, comparison, anatomy, taxonomy, formula, case, scene, diagram, map) · vocabolario visivo per area · etichette italiane curate con filtro garbage |
| ✅ | Brain integration (RAPPORTO_INTEGRAZIONI_brain_v1.0.md) | ✅ Fatto — 14 integrazioni applicate su 12 MC; ~8 integrazioni residue raccomandate |
| 2 | Applicare integrazioni brain residue (vedi `00_ARCHITETTURA/RAPPORTO_INTEGRAZIONI_brain_v1.0.md`) | ⬜ Da fare |
| ✅ | Quiz (52 MC × 18 domande 6F+6I+6A con feedback) e Flashcard JSON (52 MC) | ✅ Fatto — 2026-05-11 · aggiornato 2026-07-07 · in `05_APP/data/quiz/` e `05_APP/data/flashcards/` |
| ✅ | Prompt slide deck NotebookLM per 52 MC — v3: SOLO zona ESPLORA, stile infografica tecnico-fotorealistica (render + box vetro satinato + HUD ciano/arancio), callout suggeriti estratti da grassetti e dati del testo | ✅ Fatto — 2026-07-08 · `04_CONTENUTI/presentazioni/` · generatore `_generate_slide_prompts.py` + 52 prompt + `_INDEX.md` · master PDF/PPTX in `04_CONTENUTI/presentazioni/` · WebP committati in `public/assets/presentazioni/` per **30/52 MC**: MAT(6) + ALI(6) + AMB(6) + COM(6) + ENE(6) · mancano DIG(12) + DIS(?) + SIS(4) → workflow NotebookLM in corso |
| ✅ | Generare deck per tutte le MC (workflow NotebookLM) | ✅ Fatto — 2026-07-19 · **58/58 MC con deck WebP** · ultime due: MC-INF-3-01/02 (commit d922d28) |
| 3 | Creare asset in `04_CONTENUTI/compiti_realta/`, `flashcard/`, `quiz/` (cartelle ancora vuote) | ⬜ Da fare — sincronizzare con quelli già generati in `05_APP/data/` |

### Syllabus

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | Syllabus annuale dettagliato per docenti (tutte e 3 le classi) | ✅ Fatto |
| ✅ | Versione syllabus per studenti e famiglie (tutte e 3 le classi) | ✅ Fatto |

### Guide operative

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | Guida prompt patterns visual ESPLORA v1.0 | ✅ Fatto — 2026-05-12 · `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` · regole non negoziabili, 10 tipologie, vocabolario per area, esempi prima/dopo, manutenzione |
| 2 | Guida operativa per Agente Curatore (config NB-* + ricerca video) | ⬜ Da fare |
| 2 | Guida operativa per Agente CARBLE-CDD (workflow validazione + report) | ⬜ Da fare |
| 3 | Guida operativa NotebookLM (set-up 3 notebook + ingestion) | ⬜ Da fare |

### Sistema agenti e NotebookLM *(pipeline v2 — futuro opzionale, non prioritario)*

> **Nota (luglio 2026):** i contenuti delle 52 MC sono stati prodotti via Claude API batch e risiedono in `05_APP/tecnologia-sito-web/data/`. NotebookLM e Notion non sono operativi. Le task qui sotto si attivano solo se si decide di implementare la pipeline v2.

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | Agente microlearning — prompt e README | ✅ Fatto — `02_AGENTI/agente_microlearning/` |
| ⏸️ | Script Python Agente Sintetizzatore | ⏸️ Non eseguibile — `sintetizzatore.py` presente ma richiede credenziali NB + Notion mai configurate |
| ⏸️ | NB-TESTI catalogo libri | ⏸️ Parziale — `CATALOGO_LIBRI.md` presente; caricamento Paci + Hypertech bloccato (PDF editoriali rimossi da git per copyright) |
| F | Caricare Paci + Hypertech su NB-TESTI | 🔮 Futuro opzionale |
| F | Creare NB-VIDEO con URL YouTube selezionati per area | 🔮 Futuro opzionale |
| F | Creare NB-ARTICOLI con feed innovazione | 🔮 Futuro opzionale |
| F | Parser NotebookLM → schema MC v2.0 | 🔮 Futuro opzionale |
| F | Connettore verso Notion | 🔮 Futuro opzionale — Notion non è e non è mai stato il Layer 2 attivo |

### App studenti

| Priorità | Task | Stato |
|----------|------|-------|
| ✅ | App Next.js con navigazione MC (struttura per anno/area/MC) | ✅ Fatto — `05_APP/tecnologia-sito-web/` buildata, 69 pagine statiche, 0 errori TypeScript |
| ✅ | Design system + design tokens | ✅ Fatto — `TecnologIA_Design_System.html` + `design-tokens.json` |
| ✅ | Template MC v2 — navigator **6 tab** sticky (INNESCA/ESPLORA/OSSERVA/SPERIMENTA/AGISCI/RIPASSA) | ✅ Fatto — 2026-05-11 · `MCNavigator`, `AccordionSection`, `LevelTabs`, `MCPageClient` |
| ✅ | Callout semantici (5 tipi: safety, physics, error, question, info) + CSS custom properties | ✅ Fatto — 2026-05-11 · `CalloutBox.tsx` + `globals.css` |
| ✅ | RubricaDrawer — estrazione rubrica a runtime da AGISCI, drawer mobile/desktop | ✅ Fatto — 2026-05-11 · `RubricaDrawer.tsx` |
| ✅ | ResourcesPanel — pannello risorse aggregate (audio, video, quiz, flashcard) in INNESCA | ✅ Fatto — 2026-05-11 · `ResourcesPanel.tsx` |
| ✅ | ProfessioneCard — card professione con img4-professione + testo MD + CompetenzaTag CLIL | ✅ Fatto — `ProfessioneCard.tsx` + `CompetenzaTag.tsx` |
| ✅ | Tab RIPASSA — ProcessWidget + ChecklistWidget + QuizWidget + FlashcardDeck unificati | ✅ Fatto — 2026-05-11 |
| ✅ | Microlearning JSON (52 MC × Process + Checklist) | ✅ Fatto — `data/microlearning/` · validati CARBLE-CDD |
| ✅ | Fix breadcrumb area link (case-sensitive GitHub Pages) + generateMetadata titolo dinamico | ✅ Fatto — 2026-05-11 · titolo formato "ProfTecnologIA {Area} — {Titolo MC}" |
| ✅ | Quiz reali (52 MC × 18 domande, 6F+6I+6A con feedback e riferimenti) | ✅ Fatto — `data/quiz/` · 6 MC DM 183/2024 rigenerate 2026-07-07 |
| ✅ | Flashcard JSON (52 MC × 18 card con tag livello) | ✅ Fatto — `data/flashcards/` · 6 MC DM 183/2024 rigenerate 2026-07-07 |
| ✅ | SiteFooter con versione v0.1 | ✅ Fatto |
| ✅ | Configurazioni deploy GitHub Pages + Netlify + Vercel | ✅ Fatto — `.github/workflows/deploy.yml` + `netlify.toml` + `vercel.json` (framework: null per static export) |
| ✅ | FlashcardDeck layout verticale a griglia — card espandibili, no 3D flip | ✅ Fatto — 2026-05-13 |
| ✅ | Durate audio reali da MP3 — aggiornate in tutti i 50 JSON MC | ✅ Fatto — 2026-05-13 |
| ✅ | Durate hook audio verificate e corrette in tutti i _completa.md (42 file) | ✅ Fatto — 2026-07-07 · estratte da JSON (`durata_secondi`/`durata_sec`), range 36 sec – 4 min 46 sec |
| ✅ | CSS RIPASSA: ProcessWidget + FlashcardDeck — text-xs → text-sm per etichette, titoli step, bottoni | ✅ Fatto — 2026-07-07 |
| ✅ | Transcript hook: rimosso blocco METADATI/JSON/NOTE DI REGIA | ✅ Fatto — 2026-05-13 · `content-loader.ts` |
| ✅ | professione_futura.titolo allineato al testo OSSERVA (44 MC corrette) | ✅ Fatto — 2026-05-13 |
| ✅ | professione_futura.testo compilato da _completa.md per tutte le 52 MC | ✅ Fatto — 2026-07-08 · estratto dalla sezione OSSERVA canonica · 4 misplacement corretti (MAT-1-03, ALI-2-05, DIS-3-01, SIS-3-04) |
| ✅ | Schede narrative per TUTTE le professioni (2ª card "Chi lavora" in 58 MC) | ✅ Fatto — 2026-07-20 · 56 nuove schede in 08_TESTI+data/testi · 4 MC con sezione duplicata in ESPLORA riunificate in OSSERVA · MCPageClient estrazione multi-professione (professioneBlocks, match per titolo) |
| ✅ | Glossario competenze completo (definizioni cliccabili nelle card professioni) | ✅ Fatto — 2026-07-20 · `lib/competenze-glossario.json` 297 → 503 voci · copertura 100% delle competenze_chiave citate · titoli professioni_future INF allineati ai testi narrati |
| ✅ | Documenti architettura serviti in public/docs/ (INDICE + architettura v2.2) | ✅ Fatto — 2026-05-13 |
| ✅ | Pagina architettura: link funzionanti a INDICE e architettura v2.2 | ✅ Fatto — 2026-05-13 |
| 2 | Deploy Netlify definitivo | ⬜ Da fare — guida pronta in `DEPLOY_NETLIFY.md` |
| 2 | Stepper progress indicator mobile — P2.1 (`refactor-backlog.md`) | ⬜ Da fare |
| ✅ | Keyboard navigation MCNavigator (ArrowLeft/ArrowRight/Home/End) — WCAG WAI-ARIA Tabs — P2.2 | ✅ Fatto — già implementato (2026-05-11) · confermato 2026-07-08 |
| 2 | Focus management al cambio tab — WCAG 2.4.3 — P2.3 | ⬜ Da fare |
| ✅ | Scroll-to-top pannello al cambio tab (UX mobile) — P2.4 | ✅ Fatto — 2026-07-08 · `MCNavigator.tsx` · `panelRef` + `isFirstMount` guard |
| 2 | AccordionSection: opzione "espandi tutti" — P2.5 | ⬜ Da fare |
| 2 | RubricaDrawer: versione stampabile @media print — P2.6 | ⬜ Da fare |
| 3 | URL hash sync per deep link zona (#innesca, #esplora...) — P3.2 | ⬜ Da fare |
| ✅ | Aside mobile P3.5 — Framework/Tag/Prerequisiti su `<details>` collassabili | ✅ Fatto — 2026-07-08 · `app/mc/[id]/page.tsx` · `block lg:hidden` |
| 3 | Audit WCAG AA contrasti + focus visibili | ⬜ Da fare — vedi `docs/refactor-backlog.md` |
| 3 | Audit performance immagini AI (WebP + srcset + lazy loading) | ⬜ Da fare |
| 3 | Unificare ReadableBodyInTab / ReadableText in `lib/readable-text.tsx` (debt D1) | ⬜ Da fare |
| 4 | Sistema tracciamento progressi studente per MC (useProgress.ts già in lib/) | ⬜ Da collegare al MCNavigator |
| 4 | Sistema AI Coach integrato per ogni MC | ⬜ Da fare |

Aggiorna questo backlog ad ogni sessione di lavoro.

---

*Ultima modifica: 2026-07-20 — Sessione 11: schede professioni complete — ogni MC narra ENTRAMBE le professioni del tab PROFESSIONI (56 nuove schede "Chi lavora"; 4 MC con sezione duplicata in ESPLORA riunificate in OSSERVA: MAT-1-03, ALI-2-05, DIS-3-01, SIS-3-04) ✅ · glossario competenze 297→503 voci, copertura 100% ✅ · MCPageClient: estrazione multi-professione con match per titolo ✅ · titoli professioni_future INF allineati ai testi ✅ · build 0 errori · CLAUDE.md v2.1*
