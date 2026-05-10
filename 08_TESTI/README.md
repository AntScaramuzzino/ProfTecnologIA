# 08_TESTI — Testi del libro di Tecnologia

Questa cartella contiene i testi narrativi e didattici del libro, organizzati per classe e area tematica. Sono il cuore editoriale del progetto: non schede, non quiz, non slide — ma il testo vero e proprio che uno studente legge.

---

## Struttura

```
08_TESTI/
├── classe_1/
│   ├── MAT/    ← Materiali e Rifiuti
│   ├── DIS/    ← Disegno Tecnico (1ª)
│   └── DIG/    ← Digitale base (1ª)
├── classe_2/
│   ├── ALI/    ← Alimentazione
│   ├── AMB/    ← Abitazione, Città, Territorio
│   ├── DIS/    ← Disegno Tecnico (2ª)
│   └── DIG/    ← Coding e Privacy (2ª)
└── classe_3/
    ├── ENE/    ← Energia e Macchine
    ├── COM/    ← Comunicazioni e Trasporti
    ├── SIS/    ← Sistemi ed Economia
    ├── DIS/    ← Disegno progettuale (3ª)
    └── DIG/    ← AI e Robotica (3ª)
```

---

## Struttura di ogni testo (per MC)

Ogni file di testo corrisponde a una MC e segue questa sequenza obbligatoria:

1. **Hook** — una domanda, un dato sorprendente o uno scenario reale che aggancia lo studente (max 3 righe).
2. **Concetto chiave** — spiegazione del concetto principale, linguaggio diretto, nessun tecnicismo non spiegato.
3. **Come funziona** — meccanismo, processo o principio illustrato con un esempio concreto.
4. **Lo sapevi che...** — un dato, un caso reale o una curiosità che amplia la prospettiva (facoltativo ma raccomandato).
5. **Collegamento al compito di realtà** — frase di transizione che prepara lo studente all'attività pratica della MC.

---

## Naming convention

```
[MC-ID]_testo_[versione].md

Esempi:
MC-MAT-1-01_testo_v1.md
MC-DIG-3-02_testo_v1.md
MC-ENE-3-03_testo_v1.md
```

Ogni file vive nella cartella della sua area e classe: `08_TESTI/classe_1/MAT/MC-MAT-1-01_testo_v1.md`.

---

## Regole editoriali

- **Lunghezza:** 250-400 parole per testo. Non meno, non più.
- **Persona:** seconda persona singolare ("tu scopri", "pensa a", "immagina che").
- **Frasi:** brevi, al massimo 20-25 parole. Nessuna subordinata tripla.
- **Tecnicismi:** ogni termine nuovo va spiegato alla prima occorrenza tra parentesi o in una frase dedicata.
- **Tono:** non enciclopedico, non scolastico-burocratico. Più "documentario" che "manuale".
- **Immagini suggerite:** alla fine di ogni testo, una riga con `<!-- VISUAL: descrizione dell'immagine suggerita -->` per indicare all'Agente Generatore quale asset visivo produrre.

---

## Livelli di differenziazione

Ogni testo ha una versione di riferimento (livello intermedio). Da essa si derivano:

- `_base`: testo semplificato, frasi più brevi, glossario integrato — per BES lievi o livello F
- `_avanzato`: testo arricchito con dati, fonti secondarie, domande aperte — per livello A

Il file base si chiama `MC-[ID]_testo_v1.md`, le varianti `MC-[ID]_testo_base_v1.md` e `MC-[ID]_testo_avanzato_v1.md`.

---

## Relazione con gli altri layer

| Questo testo... | ...alimenta |
|---|---|
| Hook | `outputApp.microlearning` (prima card del deck) |
| Concetto chiave + Come funziona | NB-TESTI (fonte per NotebookLM) |
| Lo sapevi che... | `outputApp.visual` (dato da mettere in infografica) |
| Collegamento al compito di realtà | `compito_realta` nella MC JSON |
