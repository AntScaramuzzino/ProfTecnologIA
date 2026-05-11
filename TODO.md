# TODO — ProfTecnologIA
**Ultimo aggiornamento:** 11 maggio 2026  
**Stato progetto:** Sito online su Netlify · 50 MC complete · Pipeline agenti operativa

---

## 🔴 Alta priorità

### Contenuti MC
- [x] ~~21 hook script mancanti~~ (MC-ALI-2-04/05/06, AMB-2-04/05/06, COM-3-05/06, DIG-2-03/04, DIG-3-03/04, DIS-1-02, DIS-2-02, DIS-3-02, ENE-3-05/06, MAT-1-05/06, SIS-3-03/04) — **completato 11/05/2026**
- [x] ~~10 MC con campo `prerequisiti` vuoto~~ — **completato 11/05/2026**
- [~] **CARBLE-CDD: fonti primarie per i dati numerici negli hook** — sezione `## FONTI E RIFERIMENTI` aggiunta in 11 script con dati verificati (MAT-1-02, ALI-2-01/02/03, AMB-2-02/03, COM-3-01/02/03, DIG-1-02, DIG-2-02). **Rimanenti: ~45 script** da verificare con fonti primarie
- [ ] **Quiz reali per le 45 MC rimanenti** — struttura 9 domande (3F+3I+3A) con feedback, già completate: MAT-1-01/02, DIG-1-01, ALI-2-01, ENE-3-01

### Sito / App
- [ ] **Generare 7 immagini per MC** con il nuovo sistema (img1-innesca…img7-professione inclusa illustrazione simbolica) — batch completo 50 MC. Richiede crediti OpenAI o Higgsfield
- [x] ~~Quiz adattivi reali nel sito~~ — QuizWidget aggiornato, 5 MC pilota con badge "✓ Validato". **Rimanenti: 45 MC** da completare
- [ ] **Mockup doppia pagina formato stampato** — layout visivo del libro fisico richiesto dagli editori, ancora assente

---

## 🟡 Media priorità

### Matrice MC
- [ ] **6 JSON MC-INF da creare** in `01_MATRICE_MC/` — testi già pronti in `08_TESTI/` per INF-1-01/02, INF-2-01/02, INF-3-01/02. ⚡ Decisione editoriale aperta: rientrano nel target 52?
- [ ] **Campi v2.0 mancanti** (`clil_termini`, `uda_collegata`) nelle 39 MC ancora senza — `hook_audio` e `professione_futura` già completati
- [ ] **Identificare 2 MC mancanti per arrivare a 52** — DIS o SIS candidati

### Sito
- [ ] **Pagina Architettura semantica** — descrive la struttura del sistema per editori e docenti (richiesta, ancora da creare)
- [ ] **Rigenerare video gallery** con le 17 fonti prioritarie verificate e `--overwrite` — il batch attuale usa fonti generiche; i channel ID specifici (Prof. Falanga, Geopop ecc.) non sono stati ancora usati
- [ ] **Audit WCAG AA** del sito — contrasto colori, focus visibile, Lighthouse/axe

### CARBLE-CDD (azioni residue)
- [ ] **Revisione umana 157 immagini AI** per bias visivi — da fare manualmente prima della distribuzione agli studenti
- [ ] **DPIA semplificata** per Higgsfield e edge-tts (AI Act classification)
- [ ] **Nota metacognitiva sull'AI** nella Zona 5 AGISCI di ogni MC

---

## 🟢 Bassa priorità (versione 2.0)

### Contenuti
- [ ] **Asset in `04_CONTENUTI/compiti_realta/`, `flashcard/`** — cartelle ancora vuote
- [ ] **Applicare 8 integrazioni brain residue** — `RAPPORTO_INTEGRAZIONI_brain_v1.0.md` documenta le MC interessate
- [ ] **2 UDA interdisciplinari bonus** per anno nell'Indice (sezione conclusiva)
- [ ] **Espandere 12 MC Advanced** da 4 a 6 pagine nell'Indice

### Sistema agenti
- [ ] **Caricare Paci + Hypertech su NB-TESTI** NotebookLM
- [ ] **Creare NB-VIDEO** con i 492 URL YouTube raccolti
- [ ] **Connettore verso Notion** (Layer 2 — punto di verità strutturato)
- [ ] **Sistema tracciamento progressi studente** nell'app

### Sito
- [ ] **Versione semplificata per italiano L2** in MC-DIG-1-02 (Ricerca fonti online)
- [ ] **Accesso con credenziali** per la versione destinata agli studenti (valutare GDPR minori)

---

## ✅ Completato in questa sessione (11 maggio 2026)

- [x] Prototipo app studenti React con 7 MC reali, 5 zone, quiz adattivi, tracciamento progressi
- [x] Sito Next.js deployato su Netlify (github.com/AntScaramuzzino/ProfTecnologIA)
- [x] 50 SVG infografiche generate per tutte le MC standard
- [x] 157 immagini PNG AI generate (Higgsfield + ChatGPT Image 2)
- [x] Immagini integrate nel sito con ranking priorità (infografica > ai-fotorealistica > contesto > mappa)
- [x] 50 audio hook MP3 generati con `it-IT-IsabellaNeural` (edge-tts) — 51 MB
- [x] 56 trascrizioni testuali disponibili nel player audio (toggle "Leggi la trascrizione")
- [x] 21 hook script mancanti generati (struttura 5 blocchi) + audio rigenerato
- [x] Prerequisiti completati in tutte le 50 MC (erano vuoti in 10)
- [x] `professione_futura` completata in tutte le 50 MC (erano 11/50)
- [x] 492 video YouTube selezionati da fonti prioritarie (50 MC × ~10 video)
- [x] Flipped classroom: 3 video tra INNESCA ed ESPLORA + gallery 9 video
- [x] 5 quiz reali validati (MAT-1-01/02, DIG-1-01, ALI-2-01, ENE-3-01) — 9 domande con feedback
- [x] QuizWidget aggiornato con badge "✓ Validato" per MC con quiz reali
- [x] Domanda stimolo INNESCA in evidenza gialla su ogni pagina MC
- [x] Formula di trasparenza AI (CARBLE-CDD criterio E) su ogni pagina MC
- [x] Sottotitoli YouTube abilitati di default (`cc_load_policy=1`)
- [x] Rimosse citazioni bibliografiche inline dai testi (Fonti convergenti: Atlas ISBN...)
- [x] Tabelle markdown corrette nel rendering del sito
- [x] Validazione CARBLE-CDD v1.0 — esito: Validabile con modifiche — report archiviato
- [x] Agente CARBLE-CDD creato (5° agente nella pipeline)
- [x] Sistema prompt immagini v2.0 con 7 tipologie inclusa img7-professione (illustrazione simbolica)
- [x] Script `search_videos.py` con 17 fonti prioritarie verificate + channel ID
- [x] Script `generate_videos.py` con backend Higgsfield + OpenAI
- [x] Script `generate_audio.py` per batch TTS
- [x] Pagina Credits con dichiarazione AI e fonti video
- [x] Homepage redesign con sezione autore, stats strip, footer
- [x] Ottimizzazione mobile completa (heading scalati, padding, tabelle scroll, grid fix)
- [x] Pitch editori v3 aggiornato (Agente CARBLE-CDD, audio, video, validazione)

---

*Aggiorna questo file dopo ogni sessione di lavoro.*
