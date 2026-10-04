# 08_TESTI — Testi del libro di Tecnologia

Questa cartella contiene i testi narrativi e didattici del libro, organizzati per classe e area tematica. Sono il cuore editoriale del progetto. I file `*_completa.md` sono sorgenti espansi per editing: contengono spiegazioni, laboratori e compiti di realtà, da selezionare e impaginare per la versione destinata agli studenti.

---

## Struttura

```
08_TESTI/
├── classe_1/
│   ├── MAT/    ← Materiali e Rifiuti
│   ├── DIS/    ← Disegno Tecnico (1ª)
│   ├── DIG/    ← Digitale base (1ª)
│   └── INF/    ← Informatica (1ª)
├── classe_2/
│   ├── ALI/    ← Alimentazione
│   ├── AMB/    ← Abitazione, Città, Territorio
│   ├── DIS/    ← Disegno Tecnico (2ª)
│   ├── DIG/    ← Coding e Privacy (2ª)
│   └── INF/    ← Informatica (2ª)
└── classe_3/
    ├── ENE/    ← Energia e Macchine
    ├── COM/    ← Comunicazioni e Trasporti
    ├── SIS/    ← Sistemi ed Economia
    ├── DIS/    ← Disegno progettuale (3ª)
    ├── DIG/    ← AI e Robotica (3ª)
    └── INF/    ← Informatica (3ª)
```

---

## Struttura di ogni testo (per MC)

Ogni unità completa corrisponde a una MC e segue le cinque zone dell’architettura v2:

1. **INNESCA** — domanda o scenario iniziale, con richiamo al copione audio.
2. **ESPLORA** — spiegazioni, concetti, esempi e indicazioni per i visual.
3. **OSSERVA** — caso concreto e collegamento alle professioni.
4. **SPERIMENTA** — attività su livelli base, intermedio e avanzato.
5. **AGISCI** — compito di realtà, valutazione e riflessione.

Questa struttura dei sorgenti non implica che tutto il contenuto debba comparire in una sola pagina o in una singola microlearning card.

---

## Naming convention

```
[MC-ID]_completa.md       ← sorgente completo per editing
[MC-ID]_hook-script.md    ← copione audio, quando disponibile
[MC-ID]_zona2_testo.md    ← eventuale estratto breve, con versione e livello espliciti
```

Ogni file vive nella cartella della propria area e classe, per esempio `08_TESTI/classe_1/MAT/MC-MAT-1-01_completa.md`.

---

## Regole editoriali

- **Lunghezza:** distinguere i sorgenti completi per editing dai testi finali di pagina. Le 250-400 parole del formato precedente non sono un limite per l’intero file `*_completa.md`; la sintesi di ESPLORA per il layout a cinque zone segue il riferimento architetturale (§2.6: massimo 200 parole).
- **Persona:** seconda persona singolare ("tu scopri", "pensa a", "immagina che").
- **Frasi:** brevi, al massimo 20-25 parole. Nessuna subordinata tripla.
- **Tecnicismi:** ogni termine nuovo va spiegato alla prima occorrenza tra parentesi o in una frase dedicata.
- **Tono:** non enciclopedico, non scolastico-burocratico. Più "documentario" che "manuale".
- **Immagini suggerite:** usare le note per visual e impaginazione del sorgente, oppure un commento `<!-- VISUAL: descrizione dell’immagine suggerita -->`. I visual indicati non sono necessariamente già disponibili.

---

## Livelli di differenziazione

Le attività nei sorgenti completi distinguono i livelli base, intermedio e avanzato. Il livello della MC resta quello dichiarato nella sua intestazione. Eventuali estratti o adattamenti separati devono indicare il livello, la versione e il rapporto con il sorgente completo; non vanno trattati come duplicati intercambiabili.

---

## Relazione con gli altri layer

| Questo testo... | ...alimenta |
|---|---|
| INNESCA e copione audio | Hook audio e `outputApp.microlearning` (prima card del deck) |
| ESPLORA | NB-TESTI (fonte per NotebookLM) |
| Note per visual e dati verificati | `outputApp.visual` |
| AGISCI | `compito_realta` nella MC JSON |


## Tracciabilità delle fonti e stato degli audio

Le intestazioni «Fonte: Paci 2014», «Hypertech 2020» e le citazioni con ISBN indicano attribuzioni editoriali. Non attestano, da sole, che il passaggio sia stato confrontato con l’originale. Al controllo del 4 ottobre 2026, nelle cartelle `TESTI` e `Altri Testi` non risultano disponibili i libri necessari al confronto: la fedeltà alle pagine citate resta da verificare. Per completarla servono titolo, edizione, volume e pagine pertinenti; non dedurre il volume dal solo ISBN della confezione.

Le durate dei copioni sono stime. Una durata indicata nel testo completo va verificata sul file audio; per i copioni revisionati va prima ricalcolata e poi misurata sulla nuova registrazione. Le correzioni dei copioni non aggiornano automaticamente gli audio già prodotti.
