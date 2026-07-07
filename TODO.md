# TODO — ProfTecnologIA
**Ultimo aggiornamento:** 12 maggio 2026  
**Stato progetto:** Sito online su Netlify · GitHub Pages configurato · 50 MC complete · Pipeline agenti operativa

---

## 🔴 Alta priorità

### Contenuti MC
- [x] ~~21 hook script mancanti~~ — **completato 11/05/2026**
- [x] ~~10 MC con campo `prerequisiti` vuoto~~ — **completato 11/05/2026**
- [~] **CARBLE-CDD: fonti primarie per i dati numerici negli hook** — fonti verificate in 11 script (MAT-1-02, ALI-2-01/02/03, AMB-2-02/03, COM-3-01/02/03, DIG-1-02, DIG-2-02). **Rimanenti: ~45 script**
- [x] ~~Quiz reali per tutte le MC~~ — **completato** · 50/50 MC · struttura 18 domande (6F+6I+6A) con feedback per ogni opzione · 900 domande totali — `data/quiz/`
- [x] ~~Flashcard JSON dedicate~~ — **completato** · 50/50 MC — `data/flashcards/`

### Sito / App
- [ ] **Generare 7 immagini per MC** con il nuovo sistema (img1-innesca…img7-professione illustrazione simbolica) — batch 50 MC. Richiede crediti OpenAI o Higgsfield
- [x] ~~Quiz adattivi reali nel sito~~ — QuizWidget con badge "✓ Validato". **Completo: 50/50 MC con quiz reali** (18 domande 6F+6I+6A)
- [ ] **Mockup doppia pagina formato stampato** — layout visivo del libro fisico richiesto dagli editori

---

## 🟡 Media priorità

### Matrice MC
- [ ] **6 JSON MC-INF da creare** in `01_MATRICE_MC/` — testi in `08_TESTI/` per INF-1-01/02, INF-2-01/02, INF-3-01/02. ⚡ Decisione editoriale aperta: rientrano nel target 52?
- [ ] **Campi v2.0 mancanti** (`clil_termini`, `uda_collegata`) nelle 39 MC ancora senza
- [ ] **Identificare 2 MC mancanti per target 52** — DIS o SIS candidati

### Sito
- [ ] **Pagina Architettura semantica** — descrive la struttura del sistema per editori e docenti
- [ ] **Rigenerare video gallery con channel ID verificati** (`--overwrite`) — Prof. Falanga `UClalALIsNbD8iSyv4xmHGUg`, Geopop, ecc.
- [ ] **Audit WCAG AA** — contrasto colori, focus visibile, Lighthouse/axe
- [ ] **GitHub Pages** — workflow deployato, verificare che il sito sia raggiungibile su `https://antscaramuzzino.github.io/ProfTecnologIA/`

### CARBLE-CDD (azioni residue)
- [ ] **Revisione umana 157 immagini AI** per bias visivi — da fare manualmente
- [ ] **DPIA semplificata** per Higgsfield e edge-tts (AI Act classification)
- [ ] **Nota metacognitiva sull'AI** nella Zona 5 AGISCI di ogni MC

---

## 🟢 Bassa priorità (versione 2.0)

### Contenuti
- [ ] **Asset in `04_CONTENUTI/compiti_realta/`, `flashcard/`** — cartelle ancora vuote
- [ ] **Applicare 8 integrazioni brain residue** — `RAPPORTO_INTEGRAZIONI_brain_v1.0.md`
- [ ] **2 UDA interdisciplinari bonus** per anno nell'Indice
- [ ] **Espandere 12 MC Advanced** da 4 a 6 pagine nell'Indice

### Sistema agenti
- [ ] **Caricare Paci + Hypertech su NB-TESTI** NotebookLM
- [ ] **Creare NB-VIDEO** con i 492 URL YouTube raccolti
- [ ] **Connettore verso Notion** (Layer 2)
- [ ] **Sistema tracciamento progressi studente** nell'app

### Sito
- [ ] **Versione italiano L2** per MC-DIG-1-02 (Ricerca fonti online)
- [ ] **Accesso con credenziali** per la versione studenti (valutare GDPR minori)
- [ ] **FormulaCard automatiche** per MC con testi che contengono formule (ENE, DIG, DIS) — verificare che il rilevamento @@FORMULA: funzioni sul testo reale
- [ ] **ProcedureList automatiche** per la Zona SPERIMENTA delle MC con procedure di laboratorio

---

## ✅ Completato in questa sessione (11 maggio 2026)

### Infrastruttura e deploy
- [x] Sito Next.js deployato su Netlify (github.com/AntScaramuzzino/ProfTecnologIA)
- [x] GitHub Pages configurato con GitHub Actions workflow (NEXT_PUBLIC_BASE_PATH=/ProfTecnologIA)
- [x] Pitch editori v3 aggiornato (Agente CARBLE-CDD, audio, video, validazione, 3 nuove righe stato)

### Contenuti MC
- [x] 50 SVG infografiche generate per tutte le MC standard
- [x] 157 immagini PNG AI generate (Higgsfield + ChatGPT Image 2)
- [x] 50 audio hook MP3 con `it-IT-IsabellaNeural` (edge-tts) — 51 MB totali
- [x] 56 trascrizioni testuali disponibili nel player audio (toggle "Leggi la trascrizione")
- [x] 21 hook script generati (struttura 5 blocchi) + audio rigenerato
- [x] Prerequisiti completati in tutte le 50 MC
- [x] `professione_futura` completata in tutte le 50 MC (era 11/50)
- [x] Fonti primarie CARBLE-CDD in 11 hook script con dati numerici a rischio
- [x] Quiz reali tutte le 50 MC — 18 domande 6F+6I+6A con feedback (900 domande totali)
- [x] 492 video YouTube da 17 fonti prioritarie (50 MC × ~10 video) — commit su GitHub

### Sito — componenti didattici
- [x] **FlashcardDeck** — flip 3D, saputo/da ripassare, rimescola, risultati — a fine ogni pagina MC
- [x] **FormulaCard** — card blu con formula monospazio rilevata da @@FORMULA:
- [x] **ProcedureList** — checklist interattiva per procedure laboratorio
- [x] **Blocchi codice Arduino** recuperati — @@CODE: → `<pre>` scuro
- [x] **Callout colorati** dai blockquote — @@CALLOUT: → box rosso/blu/giallo semantico
- [x] Domanda stimolo INNESCA in evidenza gialla
- [x] Player audio con trascrizione collapsibile
- [x] 3 video flipped classroom tra INNESCA ed ESPLORA + gallery 9 video
- [x] Formula di trasparenza AI (CARBLE-CDD criterio E) su ogni pagina MC
- [x] Sottotitoli YouTube abilitati di default
- [x] Rimosse citazioni bibliografiche inline (Fonti convergenti: Atlas ISBN...)
- [x] Tabelle markdown corrette + overflow scroll mobile
- [x] CSS leggibilità manuale tecnico (clamp tipografia, JetBrains Mono, spaziatura ottimizzata)

### Architettura e qualità
- [x] Validazione CARBLE-CDD v1.0 — esito: Validabile con modifiche — report archiviato
- [x] Agente CARBLE-CDD creato (5° agente nella pipeline)
- [x] Sistema prompt immagini v2.0 con 7 tipologie (img1-innesca…img7-professione)
- [x] Script `search_videos.py` con 17 fonti verificate + channel ID
- [x] Script `generate_audio.py` batch TTS
- [x] Pagina Credits con dichiarazione AI e fonti video
- [x] Homepage redesign — sezione autore, stats strip, footer copyright
- [x] Ottimizzazione mobile completa
- [x] Prototipo app React con 7 MC reali (in `05_APP/TecnologIA_App.jsx`)

---

*Aggiorna questo file dopo ogni sessione di lavoro.*
