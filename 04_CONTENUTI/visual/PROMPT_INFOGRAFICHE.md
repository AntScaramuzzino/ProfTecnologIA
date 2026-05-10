# Prompt Infografiche — TecnologIA Design System
**Versione 1.0 — Maggio 2026**
**Autore:** Claude per conto di Antonio Scaramuzzino

Questo documento contiene i template di prompt per generare le infografiche del libro TecnologIA.
Ogni tipologia ha due versioni: un prompt per **generatori di immagini AI** (Midjourney, DALL·E, Flux)
e un **brief strutturato** per l'Agente Generatore (Claude API + Canva API).

---

## Istruzioni d'uso

### Variabili globali da sostituire
| Variabile | Significato | Esempio |
|---|---|---|
| `[MC_ID]` | Codice MC | `MC-MAT-1-02` |
| `[TITOLO]` | Titolo della MC | `Ciclo di vita dei materiali` |
| `[AREA]` | Area tematica | `MAT` |
| `[AREA_EMOJI]` | Emoji dell'area | `🪨` |
| `[AREA_COLOR]` | Codice esadecimale colore area | `#6D4C41` |
| `[ZONA_COLOR]` | Colore zona di destinazione | `#1565C0` (zona 2) |
| `[ANNO]` | Anno scolastico | `1` |
| `[LIVELLO]` | Livello DigComp | `F` |
| `[CONCETTO_1]` | Primo elemento/nodo principale | `Naturali` |
| `[CONCETTO_2]` | Secondo elemento/nodo | `Sintetici` |
| `[CONCETTO_N]` | N-esimo elemento | ... |
| `[AZIONE_VERBO]` | Verbo del compito di realtà | `Analizza` |
| `[SDG_NUM]` | Numero SDG collegato | `12` |

### Schema colori globale (da design-tokens.json)
```
Brand navy:    #1A2B4A   Accent teal:  #00C4A7   Energy orange: #FF6834
INNESCA Hook:   #5E35B1   ESPLORA Conc:  #1565C0   OSSERVA Esem:   #E65100
SPERIMENTA Lab:    #00695C   AGISCI Task:  #F57F17
Area MAT:      #6D4C41   Area DIS:     #1A3A7A   Area DIG:      #006064
Area ALI:      #558B2F   Area AMB:     #BF360C   Area ENE:      #E65100
Area COM:      #6A1B9A   Area SIS:     #1B5E7A
```

### Note per l'Agente Generatore
- Formato output: SVG (preferito per scalabilità) o PNG 2x @1200px wide
- Font: Inter o system sans-serif — mai font decorativi
- Contrasto minimo: WCAG AA (4.5:1 per testo su sfondo)
- Mai usare il rosso come colore informativo primario (area AMB lo usa già)
- Ogni infografica ha un titolo visibile, una fonte/nota dati se contiene numeri, e il chip `[MC_ID]` in basso a destra

---

## PROMPT MASTER — INFOGRAFICA RICCA CON SOGGETTO CENTRALE

**Quando usare:** oggetti, processi produttivi, sistemi tecnici, macchine, alimenti, materiali o concetti che beneficiano di un forte punto focale visivo e di callout annotati. È il pattern consigliato per infografiche dense da libro, apertura di unità, poster di laboratorio e tavole visuali di impatto.

### Prompt base

```text
Crea un'infografica visivamente ricca su [OGGETTO / CONCETTO / PROCESSO].

Prima fase: trova online un soggetto, caso reale o esempio concreto adatto alla fascia 11-14 anni, poi fai ricerche di approfondimento su funzionamento, fasi, dati essenziali, materiali, rischi, impatti e lessico tecnico. Usa solo informazioni verificabili e sintetizzale in brevi callout.

Composizione: imposta l'infografica come un'illustrazione grafica d'impatto. Metti al centro il soggetto dettagliato e fotorealistico come punto focale. Attorno al soggetto costruisci diagrammi, frecce, sezioni esplose, callout numerati, micro-dati, icone e brevi testi annotati. Non usare sezioni generiche separate: ogni blocco informativo deve puntare a una parte del soggetto o a una fase precisa del processo.

Stile visivo: sfondo pulito, composizione stratificata, mix di fotorealismo ed elementi grafici forti. Usa forme nette, icone tecniche, campiture di colore, linee di richiamo, texture materiche leggere e gerarchia tipografica professionale. Deve sembrare una tavola editoriale scientifica moderna, non una slide scolastica.

Densità: includi molte informazioni, ma organizza la lettura in livelli: titolo forte, soggetto centrale, 6-10 callout brevi, 3-5 micro-dati, una mini-sequenza o timeline, un box "perché è importante" e un aggancio al compito di realtà.

Vincoli: testi brevi e leggibili, nessun testo inventato o deformato, nessun logo commerciale, nessun watermark, nessuna immagine stock generica, nessuna decorazione senza funzione. Se lo strumento di generazione immagini non gestisce bene il testo, genera il soggetto e lo sfondo senza testo e aggiungi callout e testi in SVG o Canva.
```

### Adattamento per TecnologIA

```text
Contesto editoriale: libro TecnologIA per scuola secondaria di I grado.
MC: [MC_ID] — [TITOLO]
Classe: [ANNO]
Livello DigComp: [LIVELLO]
Area: [AREA]
SDG: [SDG_NUM]
Compito di realtà: [COMPITO_REALTA]

Output richiesto:
- formato preferito: SVG editabile con eventuale soggetto raster centrale;
- titolo chiaro;
- chip MC in basso a destra;
- font sans-serif leggibile;
- contrasto WCAG AA;
- nota fonti se contiene dati numerici;
- massimo 12 parole per callout;
- testi in italiano, seconda persona solo se l'asset parla direttamente allo studente.
```

### Regola operativa

Per asset con molto testo, non affidare tutto a un generatore raster. Usa una pipeline a due livelli:

1. genera o reperisci il soggetto centrale come immagine fotorealistica o illustrazione tecnica;
2. costruisci sopra la parte informativa in SVG/Canva con callout, icone, frecce e testi verificabili.

---

## TIPOLOGIA 1 — INFOGRAFICA RADIALE
**Pattern:** elemento centrale circondato da raggi/settori con proprietà o categorie

**Quando usare:** classificazioni con un soggetto principale e attributi multipli equivalenti, senza gerarchia tra i rami

**MC di riferimento:** MC-MAT-1-01 (materiali per proprietà), MC-MAT-1-06 (bioplastica vs convenzionale)

**Variabili specifiche:**
- `[CENTRO]` — il soggetto centrale (es. "Legno")
- `[RAGGIO_1..N]` — le proprietà/categorie sui raggi (3–8 raggi)
- `[VALORE_1..N]` — i valori o esempi per ogni raggio
- `[N_RAGGI]` — numero di raggi (ottimale: 5–7)

---

### 1A — Prompt Image AI (Midjourney / DALL·E / Flux)

```
Flat design educational infographic, radial spoke diagram.
Central circle labeled "[CENTRO]" in bold white text on [AREA_COLOR] background.
[N_RAGGI] spokes radiating outward, each spoke ending in a rounded card.
Spoke colors: alternating between [AREA_COLOR] and a 30% lighter tint.
Card 1: "[RAGGIO_1]" with icon and example "[VALORE_1]"
Card 2: "[RAGGIO_2]" with icon and example "[VALORE_2]"
[...repeat for each raggio...]
Typography: Inter bold for labels, Inter regular for examples.
Clean white background #F6F7FA. Thin connector lines 2px.
Bottom right: small chip "[MC_ID]" in #1A2B4A.
Style: modern Italian school textbook illustration, vector flat design,
no gradients, no shadows except subtle drop shadow on cards.
High contrast, WCAG AA compliant.
--ar 4:3 --style raw --v 6
```

**Negative prompt:** `photorealistic, 3D render, complex textures, serif fonts, decorative borders, clipart style, busy background, drop shadows heavy`

---

### 1B — Brief Strutturato (Agente Generatore / Canva API)

```json
{
  "tipologia": "RADIALE",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 1200, "height": 900, "unit": "px" },
  "sfondo": "#F6F7FA",
  "elemento_centrale": {
    "testo": "[CENTRO]",
    "forma": "circle",
    "diametro": 180,
    "bg_color": "[AREA_COLOR]",
    "text_color": "#FFFFFF",
    "font": "Inter Bold 22px",
    "posizione": "center"
  },
  "raggi": [
    {
      "indice": 1,
      "etichetta": "[RAGGIO_1]",
      "valore": "[VALORE_1]",
      "icona": "[emoji o nome icona]",
      "colore_spoke": "[AREA_COLOR]",
      "colore_card": "[AREA_BG_COLOR]",
      "angolo_gradi": 0
    }
    // ripeti per ogni raggio, distribuendo uniformemente 360°/N_RAGGI
  ],
  "connettori": { "tipo": "line", "colore": "[AREA_COLOR]", "spessore": 2, "opacita": 0.6 },
  "footer": {
    "mc_chip": "[MC_ID]",
    "nota_dati": null
  },
  "note_agente": "Distribuire i raggi uniformemente. Se N_RAGGI è pari, ruotare di 90° per avere raggi ortogonali. Etichetta del raggio in bold sopra la card, valore in regular sotto l'icona."
}
```

---

## TIPOLOGIA 2 — CICLO / CIRCOLARE
**Pattern:** fasi disposte in cerchio con frecce direzionali — indica un processo continuo o reversibile

**Quando usare:** cicli di vita, processi produttivi circolari, catene chiuse di trasformazione

**MC di riferimento:** MC-MAT-1-02 (ciclo tecnologico), MC-ALI-2-04 (filiera alimentare circolare)

**Variabili specifiche:**
- `[FASE_1..N]` — nome di ogni fase (max 6 fasi per leggibilità)
- `[ATTORE_N]` — soggetto responsabile della fase (es. "Produttore", "Consumatore")
- `[ICONA_N]` — icona per ogni fase
- `[IMPATTO_N]` — nota sull'impatto ambientale/sociale (opzionale)
- `[DIREZIONE]` — `clockwise` o `counterclockwise`

---

### 2A — Prompt Image AI

```
Flat design circular cycle diagram for educational use, Italian middle school textbook style.
[N_FASI] phases arranged in a circle, connected by curved arrows indicating [DIREZIONE] flow.
Each phase: rounded rectangle with icon, bold label "[FASE_N]", subtext "[ATTORE_N]".
Phase colors: [AREA_COLOR] for primary phases, lighter tints #CCCCCC alternating.
Arrows: thick 4px curved, same [AREA_COLOR], with arrowhead.
Center of circle: title "[TITOLO]" in [AREA_COLOR], font Inter Bold 20px.
Small SDG badge bottom-left: circle with number [SDG_NUM], color per official SDG palette.
White background. No gradients. Each phase icon is a simple line icon.
Chip "[MC_ID]" bottom-right, small, #1A2B4A on white, rounded corners.
--ar 1:1 --style raw --v 6
```

**Negative prompt:** `complex backgrounds, 3D, photo elements, decorative clipart, too many colors, crowded layout`

---

### 2B — Brief Strutturato

```json
{
  "tipologia": "CICLO",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 1000, "height": 1000, "unit": "px" },
  "sfondo": "#FFFFFF",
  "centro": {
    "testo": "[TITOLO]",
    "dimensione": 160,
    "font": "Inter Bold 18px",
    "colore": "[AREA_COLOR]"
  },
  "fasi": [
    {
      "indice": 1,
      "nome": "[FASE_1]",
      "attore": "[ATTORE_1]",
      "icona": "[emoji o nome icona]",
      "impatto": "[IMPATTO_1 o null]",
      "bg_color": "[AREA_COLOR]",
      "text_color": "#FFFFFF",
      "angolo_gradi": 0
    }
    // distribuire 360°/N_FASI — prima fase alle 12:00
  ],
  "frecce": {
    "tipo": "curved_arc",
    "direzione": "[DIREZIONE]",
    "colore": "[AREA_COLOR]",
    "opacita": 0.7,
    "spessore": 4
  },
  "badge_sdg": { "numero": "[SDG_NUM]", "posizione": "bottom-left" },
  "footer": { "mc_chip": "[MC_ID]" },
  "note_agente": "Se N_FASI > 5, ridurre il testo di ogni fase a max 2 righe. Includere freccia 'Energia in ingresso' o 'Rifiuto generato' se rilevante per il ciclo."
}
```

---

## TIPOLOGIA 3 — FLOWCHART / DIAGRAMMA DI FLUSSO
**Pattern:** sequenza di blocchi con frecce e nodi decisionali (rombi)

**Quando usare:** processi lineari con decisioni, algoritmi, procedure step-by-step, percorsi condizionali

**MC di riferimento:** MC-MAT-1-04 (dal bidone al riciclo), MC-DIG-3-01 (dal problema al robot), MC-COM-3-02 (albero decisionale licenze)

**Variabili specifiche:**
- `[PASSO_1..N]` — nome del passo/blocco rettangolare
- `[DECISIONE_N]` — testo del nodo decisionale (domanda sì/no)
- `[RAMO_SI_N]` / `[RAMO_NO_N]` — cosa succede nei due rami
- `[INIZIO]` / `[FINE]` — testo del blocco ovale di apertura/chiusura

---

### 3A — Prompt Image AI

```
Clean flat-design flowchart diagram, educational Italian textbook style.
Start oval: "[INIZIO]", fill [AREA_COLOR], white text.
Process steps: rectangles with rounded corners, fill #FFFFFF, border 2px [AREA_COLOR].
Decision nodes: diamond shapes, fill [AREA_COLOR] at 20% opacity, border [AREA_COLOR].
End oval: "[FINE]", fill #1A2B4A, white text.
Arrows: 2px solid [AREA_COLOR] with small arrowheads. "Sì" label on right branch, "No" label on left.
Vertical flow top to bottom. Maximum width 3 parallel branches.
Font: Inter 14px regular for steps, Inter 12px bold for decision text.
Background: #F6F7FA. Shadow: none. Spacing generous (48px between blocks).
Chip "[MC_ID]" bottom-right.
--ar 3:4 --style raw --v 6
```

**Negative prompt:** `complex nested flows, 3D blocks, colored backgrounds, shadowed boxes, decorative elements`

---

### 3B — Brief Strutturato

```json
{
  "tipologia": "FLOWCHART",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 900, "height": 1200, "unit": "px" },
  "sfondo": "#F6F7FA",
  "nodi": [
    {
      "id": "start",
      "tipo": "ovale",
      "testo": "[INIZIO]",
      "bg_color": "[AREA_COLOR]",
      "text_color": "#FFFFFF"
    },
    {
      "id": "p1",
      "tipo": "rettangolo",
      "testo": "[PASSO_1]",
      "bg_color": "#FFFFFF",
      "border_color": "[AREA_COLOR]",
      "text_color": "#1A1C24"
    },
    {
      "id": "d1",
      "tipo": "rombo",
      "testo": "[DECISIONE_1]",
      "bg_color": "[AREA_BG_COLOR]",
      "border_color": "[AREA_COLOR]"
    }
    // aggiungere nodi fino alla fine
  ],
  "archi": [
    { "da": "start", "a": "p1", "etichetta": null },
    { "da": "p1", "a": "d1", "etichetta": null },
    { "da": "d1", "a": "p2", "etichetta": "Sì" },
    { "da": "d1", "a": "p3", "etichetta": "No" }
  ],
  "footer": { "mc_chip": "[MC_ID]" },
  "note_agente": "Flusso verticale top-down. Rami decisionali: Sì → destra, No → sinistra oppure down/right. Max 8 nodi per mantenere leggibilità. Se il flusso è lungo, usare formato portrait 900×1400."
}
```

---

## TIPOLOGIA 4 — TIMELINE STORICA
**Pattern:** asse orizzontale (o verticale) con tappe cronologiche, icone e brevi testi

**Quando usare:** evoluzione storica, progressi tecnologici, tappe di un processo nel tempo

**MC di riferimento:** MC-ALI-2-02 (conservazione del cibo), MC-COM-3-05 (storia delle comunicazioni)

**Variabili specifiche:**
- `[DATA_1..N]` — anno o periodo (es. "1850", "Preistoria", "Oggi")
- `[EVENTO_N]` — nome breve dell'evento/invenzione
- `[DESC_N]` — descrizione 1 riga (max 12 parole)
- `[ICONA_N]` — emoji o nome icona per ogni tappa
- `[N_TAPPE]` — numero totale tappe (ottimale: 5–8)

---

### 4A — Prompt Image AI

```
Horizontal timeline infographic, flat design, educational Italian middle school style.
Thick horizontal line in [AREA_COLOR] with [N_TAPPE] milestone markers.
Each milestone: circular dot in [AREA_COLOR] on the line.
Above line: [DATA_N] in Inter Bold 16px [AREA_COLOR].
Below line alternating: icon + "[EVENTO_N]" in Inter Bold 14px + "[DESC_N]" in Inter Regular 12px.
First tapa icon: ancient/primitive symbol. Last tapa: modern/digital symbol.
Gradient arrow at the right end indicating "oggi → futuro".
Background: white. Timeline sits at vertical center.
Color progression: first tapa muted #999, last tapa vivid [AREA_COLOR].
Chip "[MC_ID]" bottom-right. No heavy shadows.
--ar 16:9 --style raw --v 6
```

**Negative prompt:** `vertical layout, crowded text, photos, decorative ornaments, complex backgrounds`

---

### 4B — Brief Strutturato

```json
{
  "tipologia": "TIMELINE",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 1600, "height": 600, "unit": "px" },
  "sfondo": "#FFFFFF",
  "asse": {
    "colore": "[AREA_COLOR]",
    "spessore": 4,
    "freccia_finale": true
  },
  "tappe": [
    {
      "indice": 1,
      "data": "[DATA_1]",
      "evento": "[EVENTO_1]",
      "descrizione": "[DESC_1]",
      "icona": "[emoji]",
      "posizione_testo": "sopra",
      "colore_marker": "[AREA_COLOR] al 40%"
    }
    // alternare sopra/sotto per le tappe dispari/pari per evitare sovrapposizioni
  ],
  "footer": { "mc_chip": "[MC_ID]" },
  "note_agente": "Tappe dispari: testo sopra la linea. Tappe pari: testo sotto. Prima tappa a 80px dal bordo sinistro, ultima a 80px dal bordo destro. Se le date non sono uniformi, usare la scala temporale reale."
}
```

---

## TIPOLOGIA 5 — ANATOMIA / CALLOUT
**Pattern:** immagine o schema di un oggetto/sistema con frecce e didascalie esplicative

**Quando usare:** descrizione dei componenti interni di un oggetto, sistema fisico o interfaccia digitale

**MC di riferimento:** MC-DIG-1-01 (anatomia computer), MC-DIG-2-04 (anatomia phishing email), MC-DIS-2-02 (tavola quotata)

**Variabili specifiche:**
- `[OGGETTO]` — cosa viene sezionato/analizzato
- `[COMPONENTE_1..N]` — nome del componente
- `[FUNZIONE_N]` — cosa fa quel componente (max 8 parole)
- `[N_CALLOUT]` — numero di frecce/etichette (max 8 per leggibilità)

---

### 5A — Prompt Image AI

```
Educational flat-design anatomy diagram of "[OGGETTO]".
Central illustration: clean technical-style flat drawing of "[OGGETTO]", viewed from [prospettiva: front/side/top/exploded].
[N_CALLOUT] labeled callout lines pointing to different components.
Each callout: thin line from component to text box outside the object.
Text box: rounded rectangle, border [AREA_COLOR] 1.5px, white bg.
Inside text box: "[COMPONENTE_N]" in Inter Bold 13px [AREA_COLOR] + "[FUNZIONE_N]" in Inter Regular 12px #3F4354.
Main object fill: light grey #E8EDF2 with details in [AREA_COLOR].
Background: white or #F6F7FA.
Title "[TITOLO]" top-left, Inter Bold 20px [AREA_COLOR].
No crowded overlapping labels. Generous whitespace.
Chip "[MC_ID]" bottom-right.
--ar 4:3 --style raw --v 6
```

**Negative prompt:** `photorealistic, 3D render, watercolor, vintage illustration, overlapping labels, decorative border`

---

### 5B — Brief Strutturato

```json
{
  "tipologia": "ANATOMIA",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 1200, "height": 900, "unit": "px" },
  "sfondo": "#F6F7FA",
  "oggetto_centrale": {
    "descrizione": "[OGGETTO]",
    "prospettiva": "[front|side|top|exploded]",
    "stile": "flat vector, technical drawing style",
    "colore_base": "#E8EDF2",
    "colore_dettagli": "[AREA_COLOR]",
    "posizione": "center",
    "dimensione_relativa": "60% del canvas"
  },
  "callout": [
    {
      "id": 1,
      "componente": "[COMPONENTE_1]",
      "funzione": "[FUNZIONE_1]",
      "posizione_freccia_origine": "top-right del componente",
      "posizione_label": "right"
    }
    // max 8 callout per infografica
  ],
  "stile_callout": {
    "linea": { "colore": "[AREA_COLOR]", "spessore": 1.5, "tipo": "straight con angolo 45°" },
    "box_label": { "bg": "#FFFFFF", "border": "[AREA_COLOR]", "border_radius": 6 }
  },
  "footer": { "mc_chip": "[MC_ID]" },
  "note_agente": "Distribuire i callout in modo che le frecce non si incrocino. Oggetti con componenti principalmente verticali: usare prospettiva laterale. Oggetti digitali (interfacce): usare screenshot stilizzato flat."
}
```

---

## TIPOLOGIA 6 — SCHEMA A STRATI / SEZIONE
**Pattern:** stack verticale o orizzontale di strati sovrapposti con etichette e frecce di flusso

**Quando usare:** architetture a livelli (hardware/software), strutture edilizie, strati geologici, gerarchia di sistema

**MC di riferimento:** MC-DIG-2-03 (SO a strati), MC-AMB-2-01 (sezione edificio), MC-AMB-2-02 (impianti casa)

**Variabili specifiche:**
- `[STRATO_1..N]` — nome di ogni strato (dal basso in alto o dall'esterno all'interno)
- `[DESC_STRATO_N]` — breve descrizione del ruolo dello strato
- `[COLORE_STRATO_N]` — colore assegnato
- `[FRECCIA_FLUSSO]` — descrizione del flusso tra strati (es. "istruzioni ↕ risorse")

---

### 6A — Prompt Image AI

```
Flat design layered stack diagram, educational style, Italian textbook.
[N_STRATI] horizontal layers stacked vertically, each with distinct flat color fill.
Bottom layer "[STRATO_1]": color [COLORE_STRATO_1], most foundational.
...
Top layer "[STRATO_N]": color [COLORE_STRATO_N], most abstract/user-facing.
Each layer: full-width rectangle, height proportional to complexity, label left-aligned in white Inter Bold 16px.
Right side of each layer: small description in Inter Regular 12px [text matching layer contrast].
Between layers: thin separator line 1px white.
Vertical double-headed arrow on the right: "[FRECCIA_FLUSSO]", [AREA_COLOR].
Background: white. Title "[TITOLO]" top-left.
Chip "[MC_ID]" bottom-right.
--ar 3:4 --style raw --v 6
```

**Negative prompt:** `3D layers, perspective view, gradient fills, complex textures, decorative borders`

---

### 6B — Brief Strutturato

```json
{
  "tipologia": "STRATI",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 900, "height": 1100, "unit": "px" },
  "sfondo": "#FFFFFF",
  "orientamento": "verticale_dal_basso",
  "strati": [
    {
      "indice": 1,
      "nome": "[STRATO_1]",
      "descrizione": "[DESC_STRATO_1]",
      "bg_color": "[COLORE_STRATO_1]",
      "text_color": "#FFFFFF",
      "altezza_px": 120,
      "icone": ["[emoji_1]"]
    }
    // strati in ordine ascendente: strato 1 = base, strato N = top
  ],
  "freccia_flusso": {
    "testo": "[FRECCIA_FLUSSO]",
    "direzione": "bidirezionale",
    "colore": "[AREA_COLOR]",
    "posizione": "destra"
  },
  "footer": { "mc_chip": "[MC_ID]" },
  "note_agente": "Per architetture software: usare gradiente da blu scuro (hardware) a colori chiari (UI). Per edifici: usare colori materici (grigio cemento, rosso mattone, bianco isolante). Indicare sempre la direzione della dipendenza."
}
```

---

## TIPOLOGIA 7 — MAPPA CONCETTUALE
**Pattern:** nodi ellittici/rettangolari collegati da archi con etichette relazionali

**Quando usare:** relazioni tra concetti, sistemi complessi senza sequenza temporale, reti di dipendenze

**MC di riferimento:** MC-AMB-2-03 (città come sistema), MC-AMB-2-05 (smart city), MC-DIG-3-02 (applicazioni IA)

**Variabili specifiche:**
- `[NODO_CENTRALE]` — concetto principale
- `[NODO_1..N]` — concetti collegati
- `[RELAZIONE_A_B]` — etichetta sull'arco tra nodo A e nodo B
- `[CLUSTER]` — gruppi tematici di nodi (se presenti)

---

### 7A — Prompt Image AI

```
Flat design concept map / mind map, educational infographic style.
Central node "[NODO_CENTRALE]": large oval, [AREA_COLOR] fill, white Inter Bold 18px text.
Secondary nodes: medium ovals, [AREA_BG_COLOR] fill, [AREA_COLOR] text Inter Bold 14px.
Tertiary nodes (if any): small rounded rectangles, white fill, #767C96 border, dark text 12px.
Connecting lines: [AREA_COLOR] 2px, with small directional arrows where relevant.
Relationship labels: small text boxes on the lines, Inter Italic 11px #5A5F76.
Node layout: organic radial from center — no rigid grid.
If clusters present: use subtle dashed border grouping nodes by theme.
Background: white. No heavy drop shadows.
Chip "[MC_ID]" bottom-right.
--ar 4:3 --style raw --v 6
```

**Negative prompt:** `grid layout, boxes instead of ovals, complex crossing lines, gradient backgrounds, photorealistic icons`

---

### 7B — Brief Strutturato

```json
{
  "tipologia": "MAPPA_CONCETTUALE",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 1400, "height": 1000, "unit": "px" },
  "sfondo": "#FFFFFF",
  "nodo_centrale": {
    "testo": "[NODO_CENTRALE]",
    "forma": "ellisse_grande",
    "bg_color": "[AREA_COLOR]",
    "text_color": "#FFFFFF",
    "font": "Inter Bold 20px"
  },
  "nodi": [
    {
      "id": "n1",
      "testo": "[NODO_1]",
      "livello": "secondario",
      "cluster": "[CLUSTER_1 o null]",
      "bg_color": "[AREA_BG_COLOR]",
      "text_color": "[AREA_COLOR]"
    }
  ],
  "archi": [
    {
      "da": "centro",
      "a": "n1",
      "etichetta": "[RELAZIONE]",
      "tipo": "diretto"
    }
  ],
  "cluster": [
    {
      "nome": "[CLUSTER_1]",
      "colore_bordo": "[CLUSTER_COLOR]",
      "nodi": ["n1", "n2", "n3"]
    }
  ],
  "footer": { "mc_chip": "[MC_ID]" },
  "note_agente": "Layout organico — non usare griglia rigida. Nodi con più connessioni in posizione centrale. Cluster (se presenti) separati da spazio bianco, non da linee rigide. Max 15 nodi totali per leggibilità scolastica."
}
```

---

## TIPOLOGIA 8 — TABELLA COMPARATIVA / MATRICE
**Pattern:** griglia con righe (soggetti/opzioni) e colonne (criteri/parametri) con valutazioni visive

**Quando usare:** confronto multi-criterio tra alternative, matrici decisionali, analisi pro/contro

**MC di riferimento:** MC-MAT-1-03 (materiali innovativi), MC-AMB-2-04 (materiali costruzione), MC-MAT-1-05 (matrice decisionale)

**Variabili specifiche:**
- `[RIGA_1..N]` — soggetti/opzioni sulle righe (es. materiali, soluzioni)
- `[COL_1..M]` — criteri sulle colonne (es. costo, impatto, durabilità)
- `[VALORE_N_M]` — valore della cella (testo, numero, o simbolo ●○◐)
- `[SCALA]` — tipo di scala: `testo`, `numerico`, `stelle`, `punti`, `colore_gradiente`

---

### 8A — Prompt Image AI

```
Clean flat-design comparison matrix table, educational style.
Header row: "[COL_1]", "[COL_2]", "[COL_3]"... — bold Inter 14px, [AREA_COLOR] background, white text.
First column (row labels): "[RIGA_1]"... — bold Inter 14px, [AREA_BG_COLOR] background, [AREA_COLOR] text.
Data cells: white background, content centered.
Values using "[SCALA]" visual scale:
  - If "stelle": ★★★☆☆ style
  - If "punti": filled dots ●●●○○ in [AREA_COLOR]
  - If "colore_gradiente": cell background from #DCFCE7 (good) to #FEE2E2 (bad)
  - If "testo": Inter Regular 13px #1A1C24
Alternating row tint: even rows #F6F7FA, odd rows white.
Cell borders: 1px #D8DAE8. Outer border: 2px [AREA_COLOR].
Column headers sticky-style look. Optional icons in header cells.
Chip "[MC_ID]" bottom-right.
--ar 4:3 --style raw --v 6
```

**Negative prompt:** `Excel-style grid, grey backgrounds, heavy borders, colored backgrounds per cell, 3D effects`

---

### 8B — Brief Strutturato

```json
{
  "tipologia": "TABELLA_COMPARATIVA",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 1200, "height": 700, "unit": "px" },
  "sfondo": "#FFFFFF",
  "intestazione_righe": { "bg_color": "[AREA_BG_COLOR]", "text_color": "[AREA_COLOR]", "font": "Inter Bold 14px" },
  "intestazione_colonne": { "bg_color": "[AREA_COLOR]", "text_color": "#FFFFFF", "font": "Inter Bold 14px" },
  "scala": "[testo | stelle | punti | colore_gradiente]",
  "righe": ["[RIGA_1]", "[RIGA_2]", "[RIGA_N]"],
  "colonne": ["[COL_1]", "[COL_2]", "[COL_M]"],
  "dati": [
    { "riga": "[RIGA_1]", "colonna": "[COL_1]", "valore": "[VALORE]", "nota": null }
  ],
  "footer": {
    "mc_chip": "[MC_ID]",
    "nota_fonte": "[fonte dei dati o null]"
  },
  "note_agente": "Per scala 'colore_gradiente': verde (#DCFCE7) = valore alto/positivo, rosso (#FEE2E2) = basso/negativo. Per scala 'punti': usare ●●●○○ con max 5 punti. Aggiungere legenda in basso se scala non ovvia."
}
```

---

## TIPOLOGIA 9 — SCHEMA SISTEMA / ARCHITETTURA
**Pattern:** componenti distinti connessi da flussi/frecce direzionali — mostra come le parti comunicano

**Quando usare:** reti informatiche, sistemi IoT, impianti tecnologici, flussi di dati o energia

**MC di riferimento:** MC-DIG-3-03 (IoT), MC-COM-3-04 (casa domotica), MC-COM-3-01 (Internet), MC-ENE-3-04 (circuito)

**Variabili specifiche:**
- `[COMPONENTE_1..N]` — nome di ogni nodo del sistema
- `[FLUSSO_A_B]` — descrizione del flusso/segnale da A a B
- `[LAYER]` — livello logico del componente (es. "fisico", "rete", "cloud", "utente")
- `[PROTOCOLLO_N]` — protocollo di comunicazione sull'arco (opzionale)

---

### 9A — Prompt Image AI

```
Flat design system architecture diagram, educational infographic style.
[N_COMPONENTI] components as rounded rectangles with icon + label.
Component colors by layer: 
  Physical layer: [AREA_COLOR] at 80%, 
  Network layer: [AREA_COLOR] at 50%, 
  Cloud/Processing layer: [AREA_COLOR] at 30%, 
  User layer: [AREA_BG_COLOR].
Connecting arrows: directional, 3px, color matches source component layer.
Arrow labels: small rounded pill "[FLUSSO_A_B]" in Inter 11px.
Layout: left-to-right or top-to-bottom flow. 
Physical components left/bottom, abstract/user-facing right/top.
Real-world example icons below each component (small, muted).
Background: white. Grid or subtle dotted pattern optional.
Chip "[MC_ID]" bottom-right.
--ar 16:9 --style raw --v 6
```

**Negative prompt:** `UML notation, complex enterprise diagrams, Cisco-style icons, 3D isometric, dark background`

---

### 9B — Brief Strutturato

```json
{
  "tipologia": "SCHEMA_SISTEMA",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 1400, "height": 800, "unit": "px" },
  "sfondo": "#FFFFFF",
  "layer": [
    { "nome": "Fisico", "colore": "[AREA_COLOR]" },
    { "nome": "Rete", "colore": "[50% lighter AREA_COLOR]" },
    { "nome": "Cloud", "colore": "[30% lighter AREA_COLOR]" },
    { "nome": "Utente", "colore": "[AREA_BG_COLOR]" }
  ],
  "componenti": [
    {
      "id": "c1",
      "nome": "[COMPONENTE_1]",
      "icona": "[emoji]",
      "layer": "Fisico",
      "esempio_reale": "[es. 'Sensore temperatura DHT11']"
    }
  ],
  "flussi": [
    {
      "da": "c1",
      "a": "c2",
      "etichetta": "[FLUSSO]",
      "protocollo": "[PROTOCOLLO o null]",
      "tipo": "dati | energia | segnale"
    }
  ],
  "footer": { "mc_chip": "[MC_ID]" },
  "note_agente": "Usare layout sinistra→destra per flussi lineari (fisico→cloud→utente). Usare layout radiale per sistemi a hub centrale. Includere esempi reali sotto ogni componente in testo piccolo muted."
}
```

---

## TIPOLOGIA 10 — GRAFICO DATI
**Pattern:** visualizzazione di dati quantitativi reali (linee, barre, Sankey, bolle)

**Quando usare:** serie storiche, confronti quantitativi, flussi energetici, distribuzioni

**MC di riferimento:** MC-ENE-3-03 (mix energetico), MC-ENE-3-06 (schema Sankey), MC-COM-3-03 (grafico bolle trasporti)

**Variabili specifiche:**
- `[TIPO_GRAFICO]` — `barre | linee | sankey | bolle | area | torta`
- `[ASSE_X]` — etichetta asse X (es. "Anno", "Modalità di trasporto")
- `[ASSE_Y]` — etichetta asse Y (es. "GWh", "g CO₂/km")
- `[SERIE_1..N]` — nome di ogni serie di dati
- `[FONTE_DATI]` — fonte verificabile (es. "Elaborazione GSE 2024", "ISTAT 2023")

---

### 10A — Prompt Image AI

```
Clean flat-design [TIPO_GRAFICO] chart, educational Italian textbook data visualization style.
Chart type: [TIPO_GRAFICO].
X-axis: "[ASSE_X]" labels in Inter Regular 12px #767C96.
Y-axis: "[ASSE_Y]" in Inter Regular 12px #767C96.
Grid lines: horizontal only, 1px #E8EDF2, subtle.
Data series colors: [SERIE_1] in [AREA_COLOR], [SERIE_2] in [AREA_COLOR at 60%], etc.
Data labels on key points: Inter Bold 13px, matching series color.
Legend: right side or bottom, horizontal, Inter 12px.
Title "[TITOLO]" top-left, Inter Bold 18px #1A2B4A.
Annotation box: highlight the most important insight in a call-out bubble.
Source credit: bottom-left, Inter 10px #969CB2 "[FONTE_DATI]".
Background: white. No 3D bars/pie. Flat colors only.
Chip "[MC_ID]" bottom-right.
--ar 16:9 --style raw --v 6
```

**Negative prompt:** `3D chart, pie chart (unless specified), dark background, rainbow colors, Excel default style, cluttered grid`

---

### 10B — Brief Strutturato

```json
{
  "tipologia": "GRAFICO_DATI",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 1200, "height": 700, "unit": "px" },
  "sfondo": "#FFFFFF",
  "tipo_grafico": "[barre | linee | sankey | bolle | area | torta]",
  "asse_x": { "etichetta": "[ASSE_X]", "tipo": "categorico | temporale | numerico" },
  "asse_y": { "etichetta": "[ASSE_Y]", "unita": "[unità di misura]", "scala": "lineare | logaritmica" },
  "serie": [
    {
      "nome": "[SERIE_1]",
      "colore": "[AREA_COLOR]",
      "dati": [
        { "x": "[valore_x]", "y": "[valore_y]" }
      ]
    }
  ],
  "annotazione_chiave": {
    "testo": "[messaggio chiave — l'insight più importante]",
    "posizione": "[top-right | center | near-peak]"
  },
  "fonte": "[FONTE_DATI]",
  "footer": { "mc_chip": "[MC_ID]" },
  "note_agente": "OBBLIGATORIO: citare sempre la fonte dati verificabile. Per Sankey: flusso sinistra=input, destra=output, larghezza banda proporzionale al valore. Per grafico bolle: specificare a cosa corrisponde la dimensione della bolla."
}
```

---

## TIPOLOGIA 11 — MAPPA GEOGRAFICA
**Pattern:** mappa territoriale con dati sovrapposti (punti, aree colorate, icone geolocate)

**Quando usare:** distribuzione geografica di fenomeni, filiere globali, rischio territoriale, biodiversità locale

**MC di riferimento:** MC-ALI-2-06 (biodiversità alimentare), MC-AMB-2-06 (rischio sismico/idrogeologico), MC-SIS-3-01 (filiera smartphone)

**Variabili specifiche:**
- `[TERRITORIO]` — ambito geografico (`Italia | Europa | Mondo | Regione [nome]`)
- `[DATO_1..N]` — fenomeno da mappare per zona
- `[TIPO_OVERLAY]` — `coropleta | punti | icone | etichette`
- `[LEGENDA_VALORI]` — scala di valori e colori corrispondenti

---

### 11A — Prompt Image AI

```
Flat design educational map infographic, "[TERRITORIO]" territory.
Map outline: clean, simplified — no topographic detail. Borders 1.5px #B8BCCE.
Overlay type: [TIPO_OVERLAY].
  - If "coropleta": color gradient from [AREA_BG_COLOR] (low) to [AREA_COLOR] (high).
  - If "punti": colored circles proportional to value, [AREA_COLOR] fill, white border.
  - If "icone": emoji or simple icons placed at geographic locations.
Legend: bottom-left, clear, Inter 12px. Title "[TITOLO]" top-left Inter Bold 18px.
Water bodies: #E3F2FD light blue. Land: #F6F7FA.
Highlight 3–5 key locations with callout labels.
Data source: bottom-right, Inter 10px #969CB2.
No political commentary. Geographic accuracy approximate (educational use).
Chip "[MC_ID]" bottom-right.
--ar 16:9 --style raw --v 6
```

**Negative prompt:** `satellite imagery, topographic detail, 3D relief, dark political maps, photorealistic terrain`

---

### 11B — Brief Strutturato

```json
{
  "tipologia": "MAPPA_GEOGRAFICA",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 1400, "height": 800, "unit": "px" },
  "sfondo": "#FFFFFF",
  "territorio": "[Italia | Europa | Mondo | nome specifico]",
  "proiezione": "mercator",
  "stile_base": { "terra": "#F6F7FA", "acqua": "#E3F2FD", "bordi": "#B8BCCE" },
  "overlay": {
    "tipo": "[coropleta | punti | icone | etichette]",
    "variabile": "[DATO]",
    "colore_basso": "[AREA_BG_COLOR]",
    "colore_alto": "[AREA_COLOR]"
  },
  "punti_evidenziati": [
    { "luogo": "[nome]", "etichetta": "[testo callout]", "coordinate": "[lat, lon o null]" }
  ],
  "legenda": { "posizione": "bottom-left", "valori": ["[valore_min]", "[valore_max]"] },
  "fonte": "[FONTE_DATI]",
  "footer": { "mc_chip": "[MC_ID]" },
  "note_agente": "Per mappe scolastiche: semplificare i confini, evitare dispute territoriali. Per Italia: includere sempre Sardegna e Sicilia nel frame. Per Mondo: preferire proiezione equal-area o Robinson per non distorcere le dimensioni."
}
```

---

## TIPOLOGIA 12 — POSTER SINTETICO
**Pattern:** composizione editoriale multi-elemento — titolo grande, testo scannable, icone, mini-schemi

**Quando usare:** sintesi visiva di una MC intera, tavole didattiche da appendere in classe, riferimento rapido

**MC di riferimento:** MC-DIS-1-01 (costruzioni geometriche), MC-ENE-3-01 (macchine semplici), MC-DIS-3-01 (tipi di proiezione)

**Variabili specifiche:**
- `[N_SEZIONI]` — numero di blocchi tematici nel poster (3–6)
- `[SEZIONE_N_TITOLO]` — titolo del blocco
- `[SEZIONE_N_CONTENUTO]` — contenuto: lista, schema mini, icona + testo
- `[FRASE_CHIAVE]` — frase memorabile da enfatizzare visivamente

---

### 12A — Prompt Image AI

```
Educational poster flat design, Italian middle school classroom wall poster style.
Format: portrait A3 equivalent.
Header: title "[TITOLO]" in Inter ExtraBold 36px white on [AREA_COLOR] band. MC chip "[MC_ID]" in header.
Body: [N_SEZIONI] grid sections, each with:
  - Section title in Inter Bold 16px [AREA_COLOR]
  - Icon (simple, 48px) in [AREA_COLOR]
  - 3–4 bullet points or mini-diagram
  - Section bordered by 1.5px [AREA_COLOR] rounded rectangle
Grid: 2-column or 3-column depending on N_SEZIONI.
Highlight band: "[FRASE_CHIAVE]" centered, Inter Bold 18px, [AREA_BG_COLOR] background.
Footer: area emoji [AREA_EMOJI], SDG badge [SDG_NUM], QR placeholder.
Background: white. Clean, generous padding. Teacher/classroom aesthetic.
--ar 2:3 --style raw --v 6
```

**Negative prompt:** `cluttered layout, too many fonts, complex backgrounds, photo elements, decorative ornaments, small unreadable text`

---

### 12B — Brief Strutturato

```json
{
  "tipologia": "POSTER_SINTETICO",
  "mc_id": "[MC_ID]",
  "titolo_visual": "[TITOLO]",
  "formato": { "width": 794, "height": 1123, "unit": "px", "equivalente": "A4 portrait print-ready" },
  "sfondo": "#FFFFFF",
  "header": {
    "titolo": "[TITOLO]",
    "bg_color": "[AREA_COLOR]",
    "text_color": "#FFFFFF",
    "font": "Inter ExtraBold 36px",
    "mc_chip": "[MC_ID]",
    "area_emoji": "[AREA_EMOJI]"
  },
  "sezioni": [
    {
      "indice": 1,
      "titolo": "[SEZIONE_1_TITOLO]",
      "icona": "[emoji]",
      "contenuto_tipo": "lista | mini_schema | icone_griglia",
      "contenuto": ["[bullet 1]", "[bullet 2]", "[bullet 3]"]
    }
  ],
  "frase_chiave": {
    "testo": "[FRASE_CHIAVE]",
    "bg_color": "[AREA_BG_COLOR]",
    "text_color": "[AREA_COLOR]",
    "font": "Inter Bold 18px"
  },
  "footer": {
    "sdg_badge": "[SDG_NUM]",
    "qr_placeholder": true,
    "mc_chip": "[MC_ID]"
  },
  "note_agente": "Poster da stampare in A4/A3 o visualizzare su LIM. Testo minimo leggibile a 1 metro di distanza = 14px. Sezioni in griglia 2×N o 3×N. Non superare 120 parole totali nel corpo del poster."
}
```

---

## Guida stile globale — TecnologIA Visual Identity

### Regole invarianti per tutte le tipologie
| Regola | Valore |
|---|---|
| Font principale | Inter (Google Fonts) |
| Font accessibilità | OpenDyslexic (versione digitale app) |
| Font codice/ID | JetBrains Mono |
| Sfondo default | `#F6F7FA` o `#FFFFFF` |
| Colore testo principale | `#1A1C24` |
| Colore testo secondario | `#5A5F76` |
| Contrasto minimo WCAG | 4.5:1 (testo normale), 3:1 (testo grande) |
| Chip ID MC | sempre in basso a destra, `#1A2B4A` su bianco, font mono 11px |
| Arrotondamento bordi card | 8px (md) o 12px (lg) |
| Padding interno card | min 16px |
| Ombra | solo `0 1px 3px rgba(0,0,0,.08)` — mai ombre pesanti |
| Formato export | SVG preferito; PNG 2x @1200px wide minimo |

### Distribuzione delle tipologie per area
| Area | Tipologie più usate |
|---|---|
| MAT | Radiale, Ciclo, Tabella comparativa, Flowchart |
| DIS | Anatomia/Callout, Poster sintetico, Schema a strati |
| DIG | Schema sistema, Mappa concettuale, Anatomia/Callout, Grafico dati |
| ALI | Timeline, Tabella comparativa, Mappa geografica |
| AMB | Schema a strati, Mappa geografica, Mappa concettuale |
| ENE | Grafico dati, Schema sistema, Flowchart, Poster sintetico |
| COM | Timeline, Mappa geografica, Schema sistema |
| SIS | Tabella comparativa, Mappa geografica, Grafico dati |

### Nota sull'accessibilità visiva
Ogni infografica deve funzionare anche in **scala di grigi** — i colori non possono essere l'unico mezzo informativo. Usare sempre: forma + colore + testo/etichetta.

Per la **versione DSA/accessibile** dell'infografica digitale: aumentare font size del 20%, aumentare spaziatura tra elementi del 30%, assicurarsi che ogni icona abbia un alt text equivalente.

---

*Documento generato da Claude — Maggio 2026*
*File companion: `prompt_infografiche.json` nella stessa cartella*
*12 tipologie · 50 visual MC coperti · 2 formati prompt per tipologia*
