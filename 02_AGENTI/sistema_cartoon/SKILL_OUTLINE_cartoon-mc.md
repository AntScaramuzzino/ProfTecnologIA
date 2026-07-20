# Outline skill `cartoon-mc` (da costruire dopo la validazione)

Scheletro per `skill-creator`. **Non ancora implementata**: si costruisce quando il sistema a 3 agenti avrà prodotto e validato almeno un cartoon completo. Analoga a `presentazioni-mc`.

## Scopo
Dal JSON di una MC produce il cartoon didattico INNESCA: storyboard + testi IT → regia + prompt Veo → verifica → generazione in Google Vids (visual Veo + voce IT) → export MP4 → inserimento nel carosello RIPASSA dell'app.

## Trigger (description della skill)
Attivare quando l'utente chiede di: "genera/fai il cartoon della MC-XXX", "storyboard cartoon", "monta il cartoon in Vids", "voce italiana sul cartoon", o passa una MC chiedendo un video d'apertura. Anche batch ("i cartoon di tutta la 1ª") e implicito ("alla MC-… manca il video INNESCA").

## Flusso (fasi)
1. **Input**: risolve `MC-ID` → carica `01_MATRICE_MC/**/MC-ID.json` + testo ESPLORA da `08_TESTI` + eventuale hook audio esistente.
2. **Agente 1 — Sceneggiatore & Testi**: genera la parte narrativa di `storyboard.json` (concetti, voce narrata IT, domande INNESCA, CTA, versione Foundation).
3. **Agente 2 — Regista**: completa la regia e i `prompt_veo_en` (regole §0 del template).
4. **Agente 3 — Verificatore**: coerenza/fluidità/CARBLE-CDD → verdetto. Se FLAGGED/BLOCKED, ciclo di revisione con 1/2.
5. **Voce IT**: genera la traccia con edge-tts `it-IT-IsabellaNeural` (o riusa l'hook audio), una per scena.
6. **Reference image narratore**: genera una volta `narratore_ref.png` (prompt-ritratto in `narratore_reference.md`) e, nelle scene col narratore, la allega come **ingrediente** Veo per la coerenza del volto.
7. **Generazione (browser)**: pilota Google Vids via Chrome — pattern affidabile: **"+" scena vuota → prompt EN in Veo (+ ingrediente reference nelle scene narratore) → Genera → Inserisci**; poi voce IT via "Voce fuori campo AI" → "Tutte le scene" → "Inserisci tutte le voci"; export MP4.
7. **Pubblicazione**: converte anteprima in WebP e inserisce nel carosello RIPASSA (come `presentazioni-mc`), rebuild del sito.

## Output
- `storyboard.json` (fonte del cartoon).
- Lista `prompt_veo_en` per scena.
- Traccia/e voce IT.
- MP4 finale + WebP anteprima.
- Report CARBLE-CDD in `04_CONTENUTI/validazione/`.

## Dipendenze / vincoli
- Chrome collegato + Google Vids accessibile (login utente).
- Veo consuma crediti: la skill chiede conferma prima di generare in batch.
- Nessuna API pubblica di montaggio Vids confermata → il montaggio passa dalla UI (browser). Da riconfermare in fase di build.

## Cosa serve validare PRIMA di costruire la skill
1. Coerenza del personaggio tra scene con reference image ("Ingredienti").
2. Efficacia dello style lock cartoon (drift verso realismo).
3. Assenza di testo in scena col divieto nel prompt.
4. Buon allineamento voce IT ↔ durata clip 8s.
5. Fattibilità del montaggio automatico voce+clip in Vids via browser.

Quando questi 5 punti sono verdi su un cartoon completo, passare l'outline a `skill-creator`.
