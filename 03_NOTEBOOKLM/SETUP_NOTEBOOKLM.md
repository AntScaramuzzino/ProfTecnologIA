# Setup NotebookLM — Guida operativa TecnologIA

**Stato sessione:** I cookie Google scadono periodicamente. Quando `notebooklm list` restituisce `403 Forbidden`, riesegui il login con `notebooklm login` da terminale Claude Code.

---

## PRE-REQUISITI

```bash
pip install notebooklm-py httpx[socks] socksio
notebooklm login          # aggiorna i cookie
notebooklm auth check     # verifica
notebooklm list           # deve mostrare i notebook
```

---

## NOTEBOOK 1 — NB-TESTI (fonti bibliografiche)

### Crea il notebook

```bash
notebooklm create "TecnologIA — NB-TESTI"
# prendi nota dell'ID restituito, es: nb_abc123
notebooklm use nb_abc123
```

### Carica le fonti in ordine di priorità

**⭐⭐⭐ PRIORITÀ MASSIMA — Fonti primarie del progetto**

```bash
notebooklm source add "07_GUIDE/docenti/Guida Hypertech.pdf"
notebooklm source add "08_TESTI/TESTI/Zanichelli/TECNOLOGIA.VERDE 2ED Paci/9788808899798_Tecnologia.pdf"
notebooklm source add "07_GUIDE/docenti/Paci_Idea_progetto_innovazione_Idee_per_insegnare.pdf"
notebooklm source add "08_TESTI/TESTI/Lattes/Hypertech PRO Arduino/9788869175978_Competenze.pdf"
```

**⭐⭐ PRIORITÀ ALTA — Materiali metodologici Hypertech + compiti di realtà**

```bash
# Capitoli metodologici Hypertech
notebooklm source add "08_TESTI/TESTI/Lattes/Hypertech PRO Arduino/9788869175978_Guida-Utilizzo.pdf"
notebooklm source add "08_TESTI/TESTI/Lattes/Hypertech PRO Arduino/9788869175978_Settori-Produttivi-Parte2.pdf"

# Compiti di realtà Arduino (AR1-AR7)
ARDUINO_DIR="08_TESTI/Altri Testi/Arduino/Compiti di realtà"
for f in "$ARDUINO_DIR"/*.pdf; do notebooklm source add "$f"; done

# Compiti di realtà Rosano/Zanichelli (ZR3-ZR9)
ROSANO_DIR="08_TESTI/Altri Testi/Rosano, Zanichelli"
for f in "$ROSANO_DIR"/*.pdf; do notebooklm source add "$f"; done
```

**⭐ PRIORITÀ STANDARD — Tutti gli altri PDF testi**

```bash
# Testi principali (ordine editoriale)
for f in "08_TESTI/TESTI"/**/*.pdf; do notebooklm source add "$f"; done

# Guide docenti aggiuntive
for f in "07_GUIDE/docenti"/*.pdf; do notebooklm source add "$f"; done
```

**Nota su 3 guide con editore non identificato** (da verificare prima del caricamento):
- `Guida_Leonardo_rid.pdf` — editore sconosciuto
- `Guida_Tecnoidea.pdf` — editore sconosciuto
- `Guida_iTech.pdf` — editore sconosciuto

### Verifica caricamento

```bash
notebooklm source list
# attendi che tutte le fonti abbiano status=READY
notebooklm source list --json | python3 -c "import json,sys; s=json.load(sys.stdin)['sources']; print(f'Ready: {sum(1 for x in s if x[\"status\"]==\"ready\")}/{len(s)}')"
```

---

## NOTEBOOK 2 — NB-VIDEO (fonti YouTube)

### Crea il notebook

```bash
notebooklm create "TecnologIA — NB-VIDEO"
notebooklm use nb_VIDEO_ID
```

### URL YouTube selezionati per area MC

Carica questi URL nell'ordine indicato:

**Area MAT — Materiali e Rifiuti**
```bash
notebooklm source add "https://www.youtube.com/watch?v=W0_1xFdsuNs"  # Ciclo di vita plastica
notebooklm source add "https://www.youtube.com/watch?v=iFP0bOoOEzw"  # Raccolta differenziata
notebooklm source add "https://www.youtube.com/watch?v=RSgXcez--Ck"  # Bioplastiche
```

**Area ALI — Alimentazione**
```bash
notebooklm source add "https://www.youtube.com/watch?v=s4GsaFX3RD8"  # Industria alimentare
notebooklm source add "https://www.youtube.com/watch?v=oFHKSKXoEeE"  # Spreco alimentare FAO
```

**Area AMB — Abitazione e Città**
```bash
notebooklm source add "https://www.youtube.com/watch?v=pPVXGMUo_nM"  # Smart city spiegata
notebooklm source add "https://www.youtube.com/watch?v=kT7l5-oJOVg"  # Efficienza energetica edifici
```

**Area ENE — Energia**
```bash
notebooklm source add "https://www.youtube.com/watch?v=1kUE0BZtTRc"  # Fonti rinnovabili
notebooklm source add "https://www.youtube.com/watch?v=zaXBVYr9Ij0"  # Come funziona fotovoltaico
notebooklm source add "https://www.youtube.com/watch?v=cAkSRXnVHOg"  # Transizione energetica
```

**Area COM — Comunicazioni e Trasporti**
```bash
notebooklm source add "https://www.youtube.com/watch?v=x3c1ih2NJEg"  # Come funziona Internet
notebooklm source add "https://www.youtube.com/watch?v=0oSCtO4GVuE"  # Auto elettrica
```

**Area DIG — Digitale e AI**
```bash
notebooklm source add "https://www.youtube.com/watch?v=aircAruvnKk"  # Neural networks 3B1B
notebooklm source add "https://www.youtube.com/watch?v=R9OHn5ZF4Uo"  # IA spiegata ai ragazzi
```

**Area DIS — Disegno Tecnico**
```bash
notebooklm source add "https://www.youtube.com/watch?v=tD8cqKFoFME"  # Proiezioni ortogonali
notebooklm source add "https://www.youtube.com/watch?v=lhvU2fhL02M"  # Assonometria isometrica
```

**⚠️ NOTA:** Gli URL YouTube sopra sono esempi plausibili ma non verificati. Prima di caricare, verifica che siano ancora attivi e in italiano (o sottotitolabili). Usa la ricerca su YouTube con query:
- `"raccolta differenziata" scuola media filiera`
- `"fonti rinnovabili" spiegazione ragazzi`
- `"proiezioni ortogonali" disegno tecnico tutorial`

---

## NOTEBOOK 3 — NB-ARTICOLI (articoli e sostenibilità)

### Crea il notebook

```bash
notebooklm create "TecnologIA — NB-ARTICOLI"
notebooklm use nb_ARTICOLI_ID
```

### Fonti da caricare

**PDF locali — Sostenibilità e innovazione**
```bash
notebooklm source add "08_TESTI/Altri Testi/Douglas Scotti/La sostenibilità.pdf"  # se presente
notebooklm source add "08_TESTI/Altri Testi/Zanichelli/Idee per Insegnare/Idee_x_Insegnare_energia.pdf"
notebooklm source add "08_TESTI/Altri Testi/Zanichelli/Idee per Insegnare/Idee_x_Insegnare_riciclo.pdf"
notebooklm source add "07_GUIDE/docenti/Zanichelli_Rosano_TecAmb_Idee_per_insegnare.pdf"
```

**URL articoli innovazione e tecnologia didattica**
```bash
# Agenda 2030 / SDGs
notebooklm source add "https://unric.org/it/agenda-2030/"
notebooklm source add "https://www.istruzione.it/alternanza/allegati/MIUR_Edu_civica.pdf"

# DigComp 3.0
notebooklm source add "https://publications.jrc.ec.europa.eu/repository/handle/JRC128415"

# Tecnologia didattica
notebooklm source add "https://www.indire.it/ricerca/apprendimento-per-competenze/"
```

---

## WORKFLOW POST-SETUP: generare asset per una MC

Una volta che i notebook sono pronti (status=READY su tutte le fonti), usa questo workflow per ogni MC:

```bash
# Esempio per MC-MAT-1-01
notebooklm use nb_TESTI_ID

# 1. Brief strutturato
notebooklm ask "Crea un brief didattico su 'Classificare i materiali per proprietà' per studenti di 1ª media. Include: concetti chiave, esempi quotidiani, 3 attività pratiche." --save-as-note

# 2. Quiz
notebooklm generate quiz --difficulty medium
notebooklm artifact wait <quiz_id>
notebooklm download quiz ./04_CONTENUTI/quiz/MC-MAT-1-01_quiz.json

# 3. Flashcard
notebooklm generate flashcards
notebooklm artifact wait <flashcard_id>
notebooklm download flashcards ./04_CONTENUTI/flashcard/MC-MAT-1-01_cards.json
```

---

## IDs NOTEBOOK (da compilare dopo il setup)

```
NB-TESTI ID:    _______________
NB-VIDEO ID:    _______________
NB-ARTICOLI ID: _______________
```

Salvare questi ID anche in `03_NOTEBOOKLM/NB-TESTI/notebook_id.txt` ecc.

---

*Ultimo aggiornamento: Aprile 2026 — rieseguire notebooklm login se auth scade*
