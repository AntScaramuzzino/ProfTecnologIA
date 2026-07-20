# Indice prompt slide deck NotebookLM

Generato: 2026-07-12 · 58 MC · da `_generate_slide_prompts.py`

Ogni file contiene un prompt pronto da incollare in NotebookLM (Studio → Slide deck → ✏️ personalizza) per generare un deck basato ESCLUSIVAMENTE sulla zona ESPLORA della MC, con immagini fotorealistiche coerenti con la palette dell'area.

## Flusso operativo

1. Crea un notebook NotebookLM per la MC (o riusa quello dell'area).
2. Carica come fonte il testo `08_TESTI/.../MC-XXX-Y-NN_completa.md` indicato nel file prompt.
3. Studio → Slide deck → ✏️ → incolla il prompt → Genera.
4. Scarica il deck (PPTX consigliato: testo editabile) e salvalo come `MC-XXX-Y-NN_deck.pptx` in questa cartella.

In alternativa usa la CLI `notebooklm` (comandi pronti in coda a ogni file prompt).

## Convenzioni di stile

- Immagini: fotografia editoriale fotorealistica (NO flat illustration — scelta deliberata, diversa dalle immagini ESPLORA del libro).
- Coerenza col design system: palette area per accenti/chip, etichette italiane ≤3 parole, sfondo chiaro, contrasto WCAG AA.
- Contenuti: SOLO zona ESPLORA (vincolo rigido nel prompt). Struttura: COPERTINA → 1 slide per sezione H3 di ESPLORA (il primo H3 con ≥3 sotto-sezioni H4 viene espanso: intro + 1 slide per H4) → SINTESI.

| MC | Titolo | Area | Classe | Slide ESPLORA | Prompt |
|----|--------|------|--------|---------------|--------|
| MC-DIG-1-01 | Orientarsi nell'ambiente digitale | 💻 Digitale / Coding / AI | 1ª | 9 | [MC-DIG-1-01_slide_prompt.md](MC-DIG-1-01_slide_prompt.md) |
| MC-DIG-1-02 | Ricerca e valutazione delle fonti online | 💻 Digitale / Coding / AI | 1ª | 10 | [MC-DIG-1-02_slide_prompt.md](MC-DIG-1-02_slide_prompt.md) |
| MC-DIG-1-03 | Pensiero computazionale e algoritmi di base | 💻 Digitale / Coding / AI | 1ª | 6 | [MC-DIG-1-03_slide_prompt.md](MC-DIG-1-03_slide_prompt.md) |
| MC-DIS-1-01 | Basi del disegno e costruzioni geometriche | 📐 Disegno Tecnico | 1ª | 6 | [MC-DIS-1-01_slide_prompt.md](MC-DIS-1-01_slide_prompt.md) |
| MC-DIS-1-02 | Scale di rappresentazione e quotatura di base | 📐 Disegno Tecnico | 1ª | 8 | [MC-DIS-1-02_slide_prompt.md](MC-DIS-1-02_slide_prompt.md) |
| MC-INF-1-01 | Il linguaggio binario: bit, byte e rappresentazione dei dati | 🖥️ Informatica | 1ª | 5 | [MC-INF-1-01_slide_prompt.md](MC-INF-1-01_slide_prompt.md) |
| MC-INF-1-02 | Algoritmi e pensiero computazionale: dare istruzioni precise | 🖥️ Informatica | 1ª | 6 | [MC-INF-1-02_slide_prompt.md](MC-INF-1-02_slide_prompt.md) |
| MC-MAT-1-01 | Classificare i materiali per proprietà | 🪨 Materiali e Rifiuti | 1ª | 6 | [MC-MAT-1-01_slide_prompt.md](MC-MAT-1-01_slide_prompt.md) |
| MC-MAT-1-02 | Ciclo di vita dei materiali e cicli tecnologici | 🪨 Materiali e Rifiuti | 1ª | 4 | [MC-MAT-1-02_slide_prompt.md](MC-MAT-1-02_slide_prompt.md) |
| MC-MAT-1-03 | Materiali innovativi e sostenibili | 🪨 Materiali e Rifiuti | 1ª | 5 | [MC-MAT-1-03_slide_prompt.md](MC-MAT-1-03_slide_prompt.md) |
| MC-MAT-1-04 | Rifiuti, riciclaggio e smaltimento | 🪨 Materiali e Rifiuti | 1ª | 6 | [MC-MAT-1-04_slide_prompt.md](MC-MAT-1-04_slide_prompt.md) |
| MC-MAT-1-05 | Scegliere il materiale giusto per un progetto | 🪨 Materiali e Rifiuti | 1ª | 10 | [MC-MAT-1-05_slide_prompt.md](MC-MAT-1-05_slide_prompt.md) |
| MC-MAT-1-06 | Biomateriali e bioplastiche: il futuro dei materiali | 🪨 Materiali e Rifiuti | 1ª | 6 | [MC-MAT-1-06_slide_prompt.md](MC-MAT-1-06_slide_prompt.md) |
| MC-ALI-2-01 | Tecniche agronomiche e coltivazioni | 🌾 Alimentazione | 2ª | 10 | [MC-ALI-2-01_slide_prompt.md](MC-ALI-2-01_slide_prompt.md) |
| MC-ALI-2-02 | Industria alimentare e tecniche di conservazione | 🌾 Alimentazione | 2ª | 5 | [MC-ALI-2-02_slide_prompt.md](MC-ALI-2-02_slide_prompt.md) |
| MC-ALI-2-03 | Educazione alimentare e stili di vita | 🌾 Alimentazione | 2ª | 8 | [MC-ALI-2-03_slide_prompt.md](MC-ALI-2-03_slide_prompt.md) |
| MC-ALI-2-04 | La filiera alimentare e l'etichetta | 🌾 Alimentazione | 2ª | 8 | [MC-ALI-2-04_slide_prompt.md](MC-ALI-2-04_slide_prompt.md) |
| MC-ALI-2-05 | Sprechi alimentari e sostenibilità | 🌾 Alimentazione | 2ª | 6 | [MC-ALI-2-05_slide_prompt.md](MC-ALI-2-05_slide_prompt.md) |
| MC-ALI-2-06 | Cibo, cultura e biodiversità | 🌾 Alimentazione | 2ª | 8 | [MC-ALI-2-06_slide_prompt.md](MC-ALI-2-06_slide_prompt.md) |
| MC-AMB-2-01 | Strutture edilizie e tecniche costruttive | 🏗️ Abitazione · Città · Territorio | 2ª | 7 | [MC-AMB-2-01_slide_prompt.md](MC-AMB-2-01_slide_prompt.md) |
| MC-AMB-2-02 | Impianti domestici e risparmio energetico | 🏗️ Abitazione · Città · Territorio | 2ª | 8 | [MC-AMB-2-02_slide_prompt.md](MC-AMB-2-02_slide_prompt.md) |
| MC-AMB-2-03 | Città, servizi urbani e pianificazione | 🏗️ Abitazione · Città · Territorio | 2ª | 8 | [MC-AMB-2-03_slide_prompt.md](MC-AMB-2-03_slide_prompt.md) |
| MC-AMB-2-04 | Materiali da costruzione e sostenibilità | 🏗️ Abitazione · Città · Territorio | 2ª | 10 | [MC-AMB-2-04_slide_prompt.md](MC-AMB-2-04_slide_prompt.md) |
| MC-AMB-2-05 | Smart city e tecnologie per la città intelligente | 🏗️ Abitazione · Città · Territorio | 2ª | 8 | [MC-AMB-2-05_slide_prompt.md](MC-AMB-2-05_slide_prompt.md) |
| MC-AMB-2-06 | Rischio idrogeologico e prevenzione | 🏗️ Abitazione · Città · Territorio | 2ª | 8 | [MC-AMB-2-06_slide_prompt.md](MC-AMB-2-06_slide_prompt.md) |
| MC-DIG-2-01 | Coding con linguaggi a blocchi | 💻 Digitale / Coding / AI | 2ª | 9 | [MC-DIG-2-01_slide_prompt.md](MC-DIG-2-01_slide_prompt.md) |
| MC-DIG-2-02 | Dati, privacy e identità digitale | 💻 Digitale / Coding / AI | 2ª | 9 | [MC-DIG-2-02_slide_prompt.md](MC-DIG-2-02_slide_prompt.md) |
| MC-DIG-2-03 | Il sistema operativo: come il computer gestisce le risorse | 💻 Digitale / Coding / AI | 2ª | 8 | [MC-DIG-2-03_slide_prompt.md](MC-DIG-2-03_slide_prompt.md) |
| MC-DIG-2-04 | Cifratura, sicurezza informatica e identità in rete | 💻 Digitale / Coding / AI | 2ª | 9 | [MC-DIG-2-04_slide_prompt.md](MC-DIG-2-04_slide_prompt.md) |
| MC-DIG-2-05 | Benessere digitale e cittadinanza responsabile | 💻 Digitale / Coding / AI | 2ª | 7 | [MC-DIG-2-05_slide_prompt.md](MC-DIG-2-05_slide_prompt.md) |
| MC-DIS-2-01 | Proiezioni ortogonali e sezioni | 📐 Disegno Tecnico | 2ª | 9 | [MC-DIS-2-01_slide_prompt.md](MC-DIS-2-01_slide_prompt.md) |
| MC-DIS-2-02 | Assonometria cavaliera e isometrica | 📐 Disegno Tecnico | 2ª | 7 | [MC-DIS-2-02_slide_prompt.md](MC-DIS-2-02_slide_prompt.md) |
| MC-INF-2-01 | Il sistema operativo: chi gestisce le risorse del computer | 🖥️ Informatica | 2ª | 4 | [MC-INF-2-01_slide_prompt.md](MC-INF-2-01_slide_prompt.md) |
| MC-INF-2-02 | Crittografia e sicurezza digitale: proteggere le informazioni | 🖥️ Informatica | 2ª | 5 | [MC-INF-2-02_slide_prompt.md](MC-INF-2-02_slide_prompt.md) |
| MC-COM-3-01 | Telecomunicazioni e reti | 📡 Comunicazioni e Trasporti | 3ª | 10 | [MC-COM-3-01_slide_prompt.md](MC-COM-3-01_slide_prompt.md) |
| MC-COM-3-02 | Produzione di contenuti digitali responsabili | 📡 Comunicazioni e Trasporti | 3ª | 9 | [MC-COM-3-02_slide_prompt.md](MC-COM-3-02_slide_prompt.md) |
| MC-COM-3-03 | Sistemi di trasporto e mobilità sostenibile | 📡 Comunicazioni e Trasporti | 3ª | 9 | [MC-COM-3-03_slide_prompt.md](MC-COM-3-03_slide_prompt.md) |
| MC-COM-3-04 | Automazione, domotica e Industria 4.0 | 📡 Comunicazioni e Trasporti | 3ª | 10 | [MC-COM-3-04_slide_prompt.md](MC-COM-3-04_slide_prompt.md) |
| MC-COM-3-05 | Reti globali, internet e infrastrutture | 📡 Comunicazioni e Trasporti | 3ª | 9 | [MC-COM-3-05_slide_prompt.md](MC-COM-3-05_slide_prompt.md) |
| MC-COM-3-06 | Media digitali, pubblicità e pensiero critico | 📡 Comunicazioni e Trasporti | 3ª | 8 | [MC-COM-3-06_slide_prompt.md](MC-COM-3-06_slide_prompt.md) |
| MC-DIG-3-01 | Robotica educativa e pensiero computazionale avanzato | 💻 Digitale / Coding / AI | 3ª | 8 | [MC-DIG-3-01_slide_prompt.md](MC-DIG-3-01_slide_prompt.md) |
| MC-DIG-3-02 | Intelligenza Artificiale: concetti, etica e applicazioni | 💻 Digitale / Coding / AI | 3ª | 8 | [MC-DIG-3-02_slide_prompt.md](MC-DIG-3-02_slide_prompt.md) |
| MC-DIG-3-03 | Raccolta dati da sensori e sistemi IoT | 💻 Digitale / Coding / AI | 3ª | 6 | [MC-DIG-3-03_slide_prompt.md](MC-DIG-3-03_slide_prompt.md) |
| MC-DIG-3-04 | Accessibilità, usabilità e inclusione digitale | 💻 Digitale / Coding / AI | 3ª | 6 | [MC-DIG-3-04_slide_prompt.md](MC-DIG-3-04_slide_prompt.md) |
| MC-DIS-3-01 | Assonometria, prospettiva e progettazione | 📐 Disegno Tecnico | 3ª | 10 | [MC-DIS-3-01_slide_prompt.md](MC-DIS-3-01_slide_prompt.md) |
| MC-DIS-3-02 | Disegno CAD e progettazione digitale | 📐 Disegno Tecnico | 3ª | 8 | [MC-DIS-3-02_slide_prompt.md](MC-DIS-3-02_slide_prompt.md) |
| MC-ENE-3-01 | Macchine semplici e principi di meccanica | ⚡ Energia e Macchine | 3ª | 10 | [MC-ENE-3-01_slide_prompt.md](MC-ENE-3-01_slide_prompt.md) |
| MC-ENE-3-02 | Fonti energetiche non rinnovabili | ⚡ Energia e Macchine | 3ª | 7 | [MC-ENE-3-02_slide_prompt.md](MC-ENE-3-02_slide_prompt.md) |
| MC-ENE-3-03 | Fonti rinnovabili e transizione energetica | ⚡ Energia e Macchine | 3ª | 9 | [MC-ENE-3-03_slide_prompt.md](MC-ENE-3-03_slide_prompt.md) |
| MC-ENE-3-04 | Elettricità e circuiti | ⚡ Energia e Macchine | 3ª | 7 | [MC-ENE-3-04_slide_prompt.md](MC-ENE-3-04_slide_prompt.md) |
| MC-ENE-3-05 | Macchine termiche e motori | ⚡ Energia e Macchine | 3ª | 8 | [MC-ENE-3-05_slide_prompt.md](MC-ENE-3-05_slide_prompt.md) |
| MC-ENE-3-06 | Accumulo energetico e smart grid | ⚡ Energia e Macchine | 3ª | 7 | [MC-ENE-3-06_slide_prompt.md](MC-ENE-3-06_slide_prompt.md) |
| MC-INF-3-01 | Internet delle Cose: quando gli oggetti si connettono | 🖥️ Informatica | 3ª | 5 | [MC-INF-3-01_slide_prompt.md](MC-INF-3-01_slide_prompt.md) |
| MC-INF-3-02 | Machine learning e intelligenza artificiale: come imparano le macchine | 🖥️ Informatica | 3ª | 5 | [MC-INF-3-02_slide_prompt.md](MC-INF-3-02_slide_prompt.md) |
| MC-SIS-3-01 | Sistemi economici e processi produttivi | ⚙️ Sistemi · Economia · Lavoro | 3ª | 8 | [MC-SIS-3-01_slide_prompt.md](MC-SIS-3-01_slide_prompt.md) |
| MC-SIS-3-02 | Economia globale, lavoro e sostenibilità | ⚙️ Sistemi · Economia · Lavoro | 3ª | 7 | [MC-SIS-3-02_slide_prompt.md](MC-SIS-3-02_slide_prompt.md) |
| MC-SIS-3-03 | Imprenditorialità e innovazione tecnologica | ⚙️ Sistemi · Economia · Lavoro | 3ª | 7 | [MC-SIS-3-03_slide_prompt.md](MC-SIS-3-03_slide_prompt.md) |
| MC-SIS-3-04 | Processi produttivi, qualità e certificazioni | ⚙️ Sistemi · Economia · Lavoro | 3ª | 7 | [MC-SIS-3-04_slide_prompt.md](MC-SIS-3-04_slide_prompt.md) |
