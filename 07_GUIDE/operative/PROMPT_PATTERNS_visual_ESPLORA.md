# Prompt Patterns — Visual ESPLORA

Versione: 1.0 · Data: 2026-05-12 · Owner: Antonio Scaramuzzino
Riferimento codice: `04_CONTENUTI/visual_esplora/_generate_visual_briefs.py`

---

## 1. Scopo

Definire le regole con cui ProfTecnologIA produce i prompt per le immagini ESPLORA delle MC. Le immagini ESPLORA accompagnano il testo narrativo del libro: una immagine per ogni sotto-sezione H3 della zona ESPLORA. I prompt devono essere **descrittivi di scena**, non template astratti, e devono produrre output coerenti col design system del libro.

Questa guida è prescrittiva per il generatore e per qualunque revisione manuale. Se modifichi un brief a mano, segui questi pattern: la coerenza visiva tra MC è una proprietà non negoziabile del prodotto editoriale.

## 2. Il problema che risolvono questi pattern

I prompt v1 (prima versione del generatore) avevano cinque difetti strutturali:

1. **Estrazione concetti rotta** — la lista «Key concepts» pescava frammenti casuali dal testo (parole grammaticali, frammenti di formula, nomi propri spezzati), perché la regex sui grassetti catturava anche il testo fra due grassetti consecutivi.
2. **Tipologia di immagine scelta a rotazione**, non in base al contenuto: una formula fisica veniva resa come timeline storica, un caso studio reale come concept map.
3. **Nessuna descrizione di scena**: il prompt era 95% boilerplate identico per tutte le MC.
4. **Titolo italiano lungo renderizzato dentro l'immagine** — antipattern per i modelli image-gen, produce testo deformato.
5. **Nessuna iconografia di area**: l'immagine non «sapeva» se stava illustrando materiali, energia o alimentazione.

I pattern v2 risolvono tutti e cinque i punti.

## 3. Regole non negoziabili

Queste regole valgono per ogni tipologia di immagine.

`R1` Il **titolo italiano lungo della sezione** non va mai renderizzato dentro l'immagine. È metadato che serve a chi gestisce il file, non contenuto visivo. Se servono titoli, scriverli sopra l'immagine in markdown, non dentro l'immagine.

`R2` Le **etichette dentro l'immagine** devono essere brevi (idealmente ≤3 parole, max 36 caratteri). Le frasi vanno fuori dall'immagine come didascalia.

`R3` Le **etichette in italiano**, non in inglese. Il prompt è in inglese (perché i modelli image-gen capiscono meglio l'inglese descrittivo), ma le label da renderizzare nell'immagine sono in italiano.

`R4` La **palette è quella dell'area**, non scelta dal modello. Ogni area ha un colore primario e un background tenue, definiti in `_generate_visual_briefs.py → AREA_META`.

`R5` Lo **sfondo è bianco puro** (`#FFFFFF`), non un colore di area. Il colore di area è per accenti, bordi, fill di chip, headline. Mai sfondo intero colorato.

`R6` Il **contrasto delle label deve essere WCAG AA** (≥4.5:1 per testo normale). Per questo le label sono in slate scuro `#1A1A1A`, non nel colore primario di area.

`R7` Il **prompt deve descrivere una scena concreta**, non chiedere un'astrazione generica. «A boy programming on a laptop next to a micro:bit board» è meglio di «An educational tech illustration».

## 4. Tipologie di immagine

Il generatore sceglie una di queste 10 tipologie in base a pattern semantici nel titolo della sezione H3 (vedere `choose_tipo()` per le regole esatte). Ogni tipologia ha un suo template di prompt e un suo formato.

### 4.1 Timeline storica

Usata per sezioni con titolo del tipo *«Breve storia di X»*, *«Dalle origini di Y»*, *«Evoluzione storica»*. La regola è stretta: «storia» da sola non basta (può essere metaforico, come «ogni materiale ha una storia»), serve un trigger esplicito di progressione storica.

Output atteso: barra orizzontale, 4-7 tacche con anno + label + pictogramma d'epoca.

### 4.2 Diagramma di flusso

Usata per sezioni che descrivono cicli, fasi, sequenze procedurali: *«Le sette fasi del ciclo tecnologico»*, *«La catena del freddo»*, *«Filiera del»*. Nodi rettangolari connessi da frecce. Se il contenuto descrive un ciclo chiuso, l'ultima freccia ritorna al primo nodo.

Output atteso: 4-7 nodi sequenziali, ogni nodo ha icona + label corta.

### 4.3 Confronto affiancato (comparison)

Usata per *«X vs Y»*, *«X contro Y»*, *«Differenza tra X e Y»*. Due colonne speculari con riga di header colorata, icona centrale per ciascuna colonna, 3-4 attributi a confronto in righe parallele.

Output atteso: due colonne, divisore verticale, banda riassuntiva in basso.

### 4.4 Schema tecnico / anatomia

Usata per sezioni che descrivono componenti interni: *«Anatomia di una scarpa»*, *«Sensori e attuatori»*, *«Come è fatto un microcontrollore»*. Un oggetto centrale (l'«eroe») con linee di chiamata che etichettano i suoi componenti.

Output atteso: oggetto hero al centro, 5-7 chip etichetta in cerchio attorno con linee di leader.

### 4.5 Tassonomia / albero categoriale

Usata per classificazioni: *«Le sei famiglie di materiali»*, *«I tre settori dell'economia»*, *«Tipi di pile»*. Radice in alto, rami che si diramano verso le categorie.

Output atteso: radice + 4-7 rami con icona + label.

### 4.6 Schema didattico di formula

Usata quando il titolo contiene una formula matematica (rilevata via regex `[A-Za-z]\s*=\s*[A-Za-z]`) o le parole «formula», «joule». La formula è al centro grande, attorno ci sono chip che spiegano ogni variabile.

Output atteso: formula centrale, 4-6 chip di spiegazione delle variabili, scenetta di applicazione in basso a destra.

### 4.7 Caso studio illustrato

Usata per sezioni che iniziano con *«Il caso:»*, *«Caso studio:»*, *«L'esempio di»*. Illustrazione narrativa di scena con personaggio e oggetti. NON un diagramma. Lo scopo è far visualizzare un evento reale.

Output atteso: scena coerente con personaggio + setting + oggetti + 4-6 annotazioni a chip.

### 4.8 Illustrazione narrativa di scena (default)

Fallback quando nessun altro pattern matcha. Usa il vocabolario visivo dell'area (oggetti, personaggio, ambientazione definiti in `AREA_META[area].scene_objects/characters/setting`) per costruire una scena che evoca il concetto astratto della sezione, con chip annotativi per le label estratte.

Questa tipologia copre ~70% delle immagini. È preferibile alla concept map astratta perché:
- Dà al lettore un'ancora visiva concreta a cui collegare il concetto.
- Riusa il vocabolario visivo dell'area, creando coerenza tra MC della stessa area.
- I modelli image-gen producono risultati migliori su scene concrete che su grafi astratti.

### 4.9 Diagramma schematico

Usata per concetti astratti che non sono né processi né classificazioni: *«Che cos'è un sistema economico»*. Concetto centrale + nodi satellite, connessioni con verbo etichettato.

### 4.10 Mappa concettuale

Tipologia di **ultima istanza**. Da evitare quando possibile. Solo per concetti talmente astratti che nessuna scena è plausibile.

## 5. Vocabolario visivo per area

Ogni area ha:

| Campo | Cosa contiene |
|-------|---------------|
| `scene_objects` | 5-8 oggetti concreti che l'image-gen può disegnare e che il lettore della MC riconosce come «cose dell'area» |
| `scene_characters` | Un personaggio stilizzato (chi lavora con o studia questa competenza) |
| `scene_setting` | L'ambiente dove la scena si svolge |
| `color_primary` | Colore di accento (bordi, frecce, headline) |
| `color_bg` | Colore di fill tenue dei chip |

Esempio per ENE (Energia e Macchine):

```
scene_objects:    lever with pivot, pulley with weight, meshing gear wheels,
                  tilted photovoltaic panel, wind turbine, battery cell,
                  lightning-bolt icon
scene_characters: engineer in hard hat holding a wrench
scene_setting:    open workshop with wind farm visible through window
color_primary:    #E65100
color_bg:         #FFF3E0
```

Quando aggiungi una nuova MC in un'area esistente, **non modificare il vocabolario** se l'area è già definita. Modificarlo in corsa romperebbe la coerenza visiva delle MC già pubblicate.

Quando aggiungi una nuova area, definiscila in `AREA_META` con questi cinque campi e una palette presa da `06_SYLLABUS/.../design-tokens.json`.

## 6. Estrazione etichette curate

L'algoritmo è gerarchico: prova ogni fonte in ordine e si ferma quando ha 6-8 etichette pulite.

1. **H4 figli**: i sotto-titoli `####` nella sezione H3 — la fonte più affidabile, sono già concetti curati dall'autore.
2. **Grassetti seguiti da due-punti**: `**Termine forte:** definizione...` — pattern di definizione.
3. **Grassetti seguiti da parentesi**: `**joule** (J)` — pattern di unità di misura o sigla.
4. **Altri grassetti** (con look-around per evitare la cattura di testo fra grassetti consecutivi): `**lavoro**`.
5. **Corsivi**: `*Sensore di prossimità*`.
6. **Fallback nomi propri e date**: estratti se le fonti precedenti non bastano.
7. **Ultima istanza**: parole lunghe dal titolo della sezione.

Vengono **sempre filtrate** queste classi di garbage:
- Parole grammaticali italiane (`il`, `la`, `che`, `quando`, `adesso`, ecc.)
- Frammenti < 3 char
- Etichette che iniziano con emoji decorative (`🔢`, `🔬`)
- Etichette contenenti meta-annotazioni didattiche («Collegamento STEM», «Geo-storia», «CLIL»)
- Parentesi non chiuse (es. `Sensore di colore (TCS34725` → diventa `Sensore di colore`)
- Etichette che iniziano con verbi/preposizioni italiane (`è il lavoro`, `in fisica`, ecc.)

Vengono **sempre troncate** a 36 char con pulizia delle parentesi orfane.

## 7. Esempi prima/dopo

### 7.1 Caso 1 — Una formula fisica

Sezione H3: *«Il lavoro meccanico: W = F × s»* (MC-ENE-3-01)

**Prima (v1):**
```
Horizontal timeline: "Il lavoro meccanico: W = F × s".
Events/milestones: "lavoro", "W = F × s", "è il lavoro, misurato in",
"(J)\n-", "è la forza applicata, misurata in", "(N)\n-".
Timeline bar in #E65100; event dots in white...
```

Problemi: tipologia sbagliata (non è una timeline storica), etichette spazzatura (frasi tagliate a metà, frammenti di unità di misura).

**Dopo (v2):**
```
Educational didactic diagram of a physics/maths formula explained,
about «Il lavoro meccanico: W = F × s».
Center a large formula in mathematical typography
(use real math symbols, e.g. F, =, ×, /, ², ³).
Around the formula, draw 5 call-out chips, each pointing to one
symbol/variable in the formula and labelling it in Italian with:
[symbol] + [1–3 word meaning] + [unit in parentheses].
Use these conceptual labels: "joule", "newton", "metri", "W = F × s", "Dato".
At the bottom-right of the canvas, draw a small concrete real-world scene
illustrating the formula being applied — chosen from: a wooden lever with
a pivot triangle, a pulley with a hanging weight, two meshing gear wheels...
```

### 7.2 Caso 2 — Una sezione tassonomica

Sezione H3: *«Le sei famiglie di materiali»* (MC-MAT-1-01)

**Prima (v1):**
```
Concept map: "Le sei famiglie di materiali" — topic overview.
Central hub "Le sei famiglie di materiali" in #6D4C41 with white text;
5–7 child concept nodes in #EFEBE9. Key concepts: "famiglia", "metalli",
"plastiche", "Quando", "Esempio", "Adesso"...
```

Problemi: concept map astratta, etichette mescolate (alcune vere, altre garbage).

**Dopo (v2):**
```
Hierarchical taxonomy tree illustration about «Le sei famiglie di materiali».
A single root node at the top in #6D4C41 with a short Italian label.
Below, 6 branch nodes fan out, each as a #EFEBE9-filled rounded rectangle
with #6D4C41 stroke, containing a small icon + 1–3 word Italian label.
Use these branch labels: "Il legno", "I metalli", "Le plastiche",
"Le ceramiche e il vetro", "I tessuti", "I materiali compositi".
For each branch, draw a tiny distinguishing pictogram inspired by:
rough mineral chunks, a coil of natural fiber, a wooden plank,
a small metal ingot, a stack of plastic pellets...
```

### 7.3 Caso 3 — Un caso studio

Sezione H3: *«Il caso: la scuola Copernico di Torino — CasaClima A4 nel 2018»* (MC-AMB-2-04)

**Prima (v1):**
- Tipologia: concept map → produce un grafo di parole astratte
- Etichette: frammenti come "Cappotto", "Nel", "L'edificio"

**Dopo (v2):**
- Tipologia: caso studio illustrato → produce una scena reale
- Etichette: "anni '60, scuola, Copernico, Torino, CasaClima"
- Scena: «Architect figure standing next to a 3D foam model of a small building, in a neighborhood street with low buildings and trees»

## 8. Come modificare i pattern

Il file da modificare è `04_CONTENUTI/visual_esplora/_generate_visual_briefs.py`.

| Cosa cambiare | Dove |
|---------------|------|
| Vocabolario visivo di un'area | `AREA_META[<area>]` |
| Aggiungere una nuova area | nuova entry in `AREA_META` + ridefinizione di `find_all_mcs` se necessario |
| Cambiare quando viene scelto «timeline» vs «scene» | `choose_tipo()` |
| Aggiungere una nuova tipologia di immagine | nuova entry in `TIPI` + nuovo branch in `render_prompt()` |
| Migliorare l'estrazione etichette | `extract_labels()` |
| Stop-words da filtrare | `STOP_LABELS` |
| Style block comune | `base_style_block()` |

Dopo ogni modifica, rigenera tutti i brief con:

```bash
python3 04_CONTENUTI/visual_esplora/_generate_visual_briefs.py
```

Lo script sovrascrive sempre i 56 file output e l'`_INDEX.md`. Le tue modifiche manuali ai brief vengono perse: se devi sovrascrivere un singolo prompt, conservalo in una nota separata e ripristinalo dopo la rigenerazione, oppure aggiorna il generatore in modo che produca quel risultato a regime.

## 9. Come usare i prompt con un modello image-gen

I prompt sono ottimizzati per modelli che capiscono inglese descrittivo (GPT Image 2, Higgsfield, Midjourney v6+, FLUX). Per ciascun prompt:

1. Copia il blocco dentro i triple-backtick.
2. Imposta il formato esatto indicato in tabella (`PNG 1400×800` ecc.).
3. Genera 3-4 varianti, scegli quella con etichette più leggibili.
4. Se il modello non rende correttamente il testo italiano (problema noto), genera senza label e aggiungile in post-produzione con Figma/Affinity Designer usando i token in `06_SYLLABUS/.../design-tokens.json`.

Per i caso studio (`case`) e le scene narrative (`scene`), accetta il fatto che i modelli image-gen producano figure umane stilizzate ma non perfette: l'obiettivo è l'ancora visiva, non il fotorealismo.

## 10. Manutenzione

| Compito | Frequenza |
|---------|-----------|
| Rigenerare i brief dopo l'edit di un testo `_completa.md` | ad ogni modifica del testo sorgente |
| Aggiornare `AREA_META` quando aggiungi una MC in una area nuova | una tantum per area |
| Revisione manuale di un brief (override) | solo per immagini-chiave del libro |
| Audit etichette garbage | trimestrale, grep su `Etichette curate` cercando token sospetti |

## 11. Cosa NON fare

- Non scrivere prompt che chiedano al modello di renderizzare un titolo italiano lungo come testo nell'immagine.
- Non usare la concept map come default «sicuro». È quasi sempre la scelta peggiore.
- Non mescolare emoji nelle label da renderizzare nell'immagine.
- Non passare i prompt per le immagini di copertina, di sezione, di hook audio — questo documento copre solo le immagini ESPLORA.
- Non considerare il generatore «finito»: ogni nuova area, ogni nuova tipologia di sezione, è un'occasione per aggiungere una regola in `choose_tipo()` e migliorare il fallback dell'illustrazione narrativa.
