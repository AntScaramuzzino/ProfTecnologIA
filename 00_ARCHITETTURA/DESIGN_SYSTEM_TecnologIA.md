# Design System — TecnologIA
**Filosofia visiva e sistema grafico del libro**
Versione 2.0 — Maggio 2026

> **Note di versione 2.0:** allineamento alle decisioni di design reali emerse durante la produzione dei template Foundation / Intermediate / Advanced e del mockup completo MC-MAT-1-02. Le sezioni modificate rispetto alla v1.0 sono segnalate con `[rev 2.0]`.

---

## Movimento: "Precision Signal"

Il libro non è un oggetto neutro. È uno strumento di pensiero — costruito per chi deve capire come funziona il mondo fisico nell'era dei dati. Il design non illustra questa idea: la incarna.

---

## Filosofia visiva

**Struttura come linguaggio.** La griglia A4 è divisa in zone precise, non decorative. Ogni millimetro di margine, ogni colonna, ogni banda cromatica ha una funzione. La struttura comunica prima ancora che il testo venga letto. Lo studente impara dove guardare: non cerca, trova. Il layout è la prima competenza trasferita.

**Colore come codice.** Le nove aree tematiche hanno ciascuna un colore segnale — saturo, distinto, inequivocabile. Il colore non abbellisce: classifica. Una banda laterale colorata, un'etichetta di area, un badge SDG: bastano tre elementi cromatici per orientare lo studente in qualsiasi punto del libro. La palette è progettata con contrasti WCAG AA per accessibilità piena, anche in versione stampata in scala di grigi.

**Tipografia ad architettura variabile.** Due famiglie tipografiche: una geometrica e sans-serif per titoli, ID, etichette tecniche (Montserrat); una umanista e ampia per il corpo testo, pensata per DSA e alta leggibilità (Source Sans Pro). Il peso, la dimensione e il colore del testo sono codificati: non c'è variazione arbitraria. Ogni livello gerarchico ha il suo stile e lo mantiene in tutto il volume.

**Spazio come respiro cognitivo — adattivo per livello. `[rev 2.0]`** Lo spazio bianco non è fisso: si adatta al livello DigComp della MC. Le MC Foundation hanno il maggiore respiro (nessuna sidebar, font più grande, zone più ariose). Le MC Advanced sono più dense perché lo studente è pronto a gestire più informazioni. Il layout non è uguale per tutte le MC: è calibrato sul carico cognitivo appropriato per il livello.

**Iconografia minima e sistematica.** Un set di icone lineari e monocromatiche accompagna elementi ricorrenti: il QR audio, i tre livelli di difficoltà (●, ●●, ●●●), il badge SDG, il coach AI, la professione del futuro. Le icone non decorano: segnalano. Sono identiche in tutto il libro. La consistenza è il messaggio.

---

## Sistema cromatico

### Colori brand

| Nome | Ruolo | Hex |
|------|-------|-----|
| Notte | Sfondo copertina, titoli primari, folio | `#0D1B2A` |
| Segnale | Accent elementi interattivi: QR, AI Coach, link digitali | `#00B4D8` |
| Carta | Sfondo pagine interne | `#FAFAFA` |
| Testo | Corpo testo principale | `#2D2D2D` |
| Testo secondario | Didascalie, note, testo de-enfatizzato | `#4A4A4A` |
| Grigio separatore | Linee, bordi zona, card inattive | `#E0E0E0` |
| Grigio note | Testo folio, etichette secondarie | `#8A8A8A` |
| Grigio disattivato | Testo card livello non corrente | `#B8B8B8` |

### Colori area tematica

| Codice | Area | Colore | Hex | Tono scuro header `[rev 2.0]` |
|--------|------|--------|-----|-------------------------------|
| MAT | Materiali e Rifiuti | Terracotta | `#E07A5F` | `#C96040` |
| DIS | Disegno Tecnico | Ardesia blu | `#457B9D` | `#35607D` |
| DIG | Competenze Digitali | Ciano elettrico | `#0096C7` | `#0076A8` |
| INF | Informatica | Viola profondo | `#6B4FA2` | `#523A82` |
| ALI | Alimentazione | Verde salvia | `#52B788` | `#3D9A6E` |
| AMB | Abitazione / Città | Sabbia calda | `#C89B6E` | `#A87B50` |
| ENE | Energia e Macchine | Giallo solare | `#F2C14E` | `#D4A030` |
| COM | Comunicazioni | Ametista | `#9B5DE5` | `#7C40C8` |
| SIS | Sistemi / Economia | Teal profondo | `#1B7F7F` | `#106060` |

> **Regola `[rev 2.0]`:** ogni area usa due toni dello stesso colore. Il tono base (`hex`) è usato per banda laterale, pill zone, bordi card attive, cerchi badge. Il tono scuro è usato esclusivamente nel blocco decorativo dell'header (sezione destra della fascia MC).

### Colori livello DigComp `[rev 2.0]`

Questi colori sono indipendenti dal colore area e si applicano globalmente ai badge e alle card di Zona 4.

| Livello | Pallino | Colore bordo/pill | Hex | Sfondo card | Hex sfondo |
|---------|---------|-------------------|-----|-------------|------------|
| Foundation (F) | ● | Grigio neutro | `#B0BEC5` | Grigio chiaro | `#F4F4F4` |
| Intermediate (I) | ●● | Ambra acceso | `#E07A5F` | Bianco rosato | `#FFF3F0` |
| Advanced (A) | ●●● | Marrone scuro | `#8B3E2F` | Bianco pesca | `#FFF0EA` |

> Il colore Intermediate coincide con il colore MAT — è una coincidenza del mockup pilota. In produzione, verificare che su MC di altre aree il colore Intermediate rimanga `#E07A5F` (indipendente dall'area) per coerenza globale del sistema di livelli.

### Colori SDG `[rev 2.0]`

I badge SDG usano i colori ufficiali UN, non i colori area. Esempi usati:

| SDG | Hex |
|-----|-----|
| SDG 4 — Istruzione | `#0096C7` |
| SDG 7 — Energia | `#F2C14E` |
| SDG 12 — Consumo responsabile | `#BF8B2E` |
| SDG 15 — Vita sulla terra | `#56842B` |

---

## Sistema tipografico

### Famiglie

| Famiglia | Ruolo | Pesi usati |
|----------|-------|-----------|
| **Montserrat** | Titoli MC, titolo copertina, etichette header | Bold (700), SemiBold (600) |
| **Source Sans Pro** | Corpo testo, descrizioni, istruzioni laboratorio | Regular (400), SemiBold (600) |
| **Courier / JetBrains Mono** | ID MC (es. `MC-MAT-1-02`), termini CLIL, snippet codice | Regular (400) |

> **Nota implementativa:** nei PDF generati con ReportLab si usano Helvetica (→ Montserrat), Helvetica-Bold e Courier come sostituti metricamente equivalenti. In produzione editoriale sostituire con i font nominati.

### Scala tipografica A4 `[rev 2.0]`

| Elemento | Font | F (Foundation) | I (Intermediate) | A (Advanced) | Colore |
|----------|------|---------------|-----------------|-------------|--------|
| Titolo libro (copertina) | Montserrat Bold | 62 pt | — | — | Bianco |
| Titolo MC (header) | Montserrat Bold | 16 pt | 16 pt | 16 pt | Bianco |
| ID MC | Courier | 7.5 pt | 7.5 pt | 7.5 pt | `#FFD0C0` su area |
| Titolo zona (pill) | Montserrat Bold | 6.2 pt | 6.2 pt | 6.2 pt | Bianco |
| Titolo sezione interna | Montserrat Bold | 9.5 pt | 9.5 pt | 9.5 pt | Area o Notte |
| Corpo testo | Source Sans Pro | **9.5 pt** | **9 pt** | **8.5 pt** | `#2D2D2D` |
| Testo secondario | Source Sans Pro | 8.5 pt | 8 pt | 8 pt | `#4A4A4A` |
| Etichette badge/pill | Montserrat Bold | 7.5 pt | 7.5 pt | 7.5 pt | Area o Bianco |
| Didascalie, note, folio | Source Sans Pro | 5.5–6 pt | 5.5–6 pt | 5.5–6 pt | `#8A8A8A` |
| Termini CLIL strip | Courier | 5.5 pt | 5.5 pt | 5.5 pt | `#8B5000` |

> **Regola chiave `[rev 2.0]`:** il corpo testo diminuisce al crescere del livello. Foundation ha il font più grande (9.5 pt) e il massimo spazio bianco. Advanced ha il font più piccolo (8.5 pt) e la maggiore densità informativa.

---

## Struttura pagina A4 `[rev 2.0]`

### Griglia base

- **Formato:** A4 (210 × 297 mm)
- **Banda area laterale:** 6–7 mm (sinistra), colore area pieno. Segni di sezione bianchi a 25%, 50%, 75% dell'altezza (tacche 1.6 pt di altezza).
- **Header MC:** 22–24 mm. Bicolore: blocco base (colore area) + blocco scuro decorativo a destra (tono scuro area, ~55 mm di larghezza).
- **Margine sinistro:** banda + 6 mm
- **Margine destro:** 6 mm
- **Margine folio in basso:** 10 mm (linea separatrice a 9 mm, testo folio a 5 mm)

### Sidebar — adattiva per livello `[rev 2.0]`

La sidebar **non è fissa**. La sua larghezza dipende dal livello DigComp della MC:

| Livello | Larghezza sidebar | Contenuto sidebar |
|---------|-------------------|-------------------|
| Foundation (F) | **0% — nessuna sidebar** | Tutto il corpo occupa la larghezza piena. La professione del futuro è integrata in Zona 3 come sezione bicolore. |
| Intermediate (I) | **~20% (40 mm)** | Professione del futuro · SDG badge · CLIL termini · AI Coach QR |
| Advanced (A) | **~25% (46 mm)** | Professione del futuro · SDG badge · CLIL bilingue (EN+IT) · UDA collegata · AI Coach QR |

> **Perché:** la sidebar a larghezza fissa (28%, v1.0) comprimeva eccessivamente la colonna principale nelle MC Foundation, dove il testo deve respirare. La soluzione adattiva ottimizza lo spazio disponibile per il carico cognitivo di ogni livello.

### Le 5 zone — struttura visiva

Ogni zona è introdotta da una **pill numerata** (rettangolo arrotondato, colore area, 5–5.5 mm di altezza, ~50 mm di larghezza) posizionata sopra la zona stessa con offset di 5 mm.

```
┌─ BANDA (7mm, colore area) ──────────────────────────────────────────────┐
│  HEADER MC (22–24mm bicolore)                                           │
│  [ID MC in Courier]  [TITOLO in Montserrat Bold 16pt]   [Badge livello] │
├─────────────────────────────────────────────────────────────────────────┤
│ [PILL: 1 🎙 HOOK]                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ QR simulato (20×20mm) │ Testo hook reale · Titolo 9.5pt Bold    │   │
│  │ Durata podcast        │ 4 righe corpo · Domanda avvio in Bold    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│ [PILL: 2 📖 CONCETTO]                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Infografica (sinistra, ~65mm)  │ Testo 9–9.5pt (destra)         │   │
│  │                                │ Box "Lo sapevi?" o dati        │   │
│  └─────────────────────────────────────────────────────────────────┘    │
│ [PILL: 3 🔍 ESEMPIO REALE]                                              │
│  ┌─────────────────────────── BICOLORE ───────────────────────────┐    │
│  │ Case study (55%, sfondo chiaro area) │ Professione 2030 (45%)   │   │
│  └─────────────────────────────────────────────────────────────────┘    │
│ [PILL: 4 🔬 LABORATORIO]                                                │
│  ┌─── Card BASE ─────────────────────────────────────────────────┐      │
│  │ ● pallino colorato │ LIVELLO │ Testo attività                  │      │
│  └───────────────────────────────────────────────────────────────┘      │
│  ┌─── Card INTER ─────────────────────── [attiva/disattivata] ──┐       │
│  └──────────────────────────────────────────────────────────────┘       │
│  ┌─── Card AVANZ ─────────────────────── [attiva/disattivata] ──┐       │
│  └──────────────────────────────────────────────────────────────┘       │
│ [PILL: 5 🎯 COMPITO DI REALTÀ]                                          │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ Scenario + Consegna (55%) │ Tabella / Rubrica (45%)           │      │
│  │                           │ Badge SDG ·  Metacognizione       │      │
│  │ ─────────────────────────────────────────────────────────── │       │
│  │ [STRIP CLIL: Courier 5.5pt, sfondo arancio chiaro]           │       │
│  └──────────────────────────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────────────────────────┤
│ Linea folio · TecnologIA · Area · Classe · Fonte · Numero pagina        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Elementi ricorrenti `[rev 2.0]`

### Header MC (fascia superiore)

- **Altezza:** 22–24 mm (da 12 mm della v1.0 — aumentato per leggibilità)
- **Struttura bicolore:** blocco principale (colore area) + sezione destra geometrica (tono scuro area, ~55 mm di larghezza)
- **Contenuto sinistro:** ID MC in Courier 7.5pt `#FFD0C0` · Titolo MC Montserrat Bold 16pt bianco
- **Contenuto destra:** badge livello DigComp (pill `#C05030` o tono scuro area, testo bianco 7pt) · etichetta area+classe 6.5pt `#FFD0C0`

### Pill zona

- **Dimensioni:** ~50 mm larghezza × 5–5.5 mm altezza
- **Forma:** rettangolo con raggio 2.5
- **Colore sfondo:** colore area pieno
- **Testo:** `[Numero zona]  [Emoji]  [NOME ZONA]` — Montserrat Bold 6.2pt bianco
- **Posizione:** appena sopra il bordo superiore della zona, staccata di 5 mm dalla zona precedente

### Card livello (Zona 4) `[rev 2.0]`

Ogni livello è una card orizzontale con altezza fissa di 13–15 mm e bordo arrotondato (r=4).

**Card attiva:**
- Sfondo: colore livello (F=`#F4F4F4`, I=`#FFF3F0`, A=`#FFF0EA`)
- Bordo: colore livello (F=`#B0BEC5`, I=`#E07A5F`, A=`#8B3E2F`) con lw=1.2–1.5
- Pallino: cerchio pieno 5.5mm raggio, colore livello, con simbolo ● bianco al centro
- Etichetta livello: Montserrat Bold 7.5pt, colore livello
- Testo attività: Source Sans Pro 8.5–9pt, `#2D2D2D`

**Card disattivata (livelli non correnti):**
- Sfondo: `#F4F4F4`
- Bordo: `#E0E0E0` lw=0.4
- Testo etichetta e attività: `#B8B8B8` — visibile ma chiaramente secondario

**Logica di attivazione per livello MC:**
- Foundation: solo BASE attiva · INTER e AVANZ disattivate
- Intermediate: BASE disattivata · INTER attiva · AVANZ attiva (bordo leggero)
- Advanced: tutte e tre attive con colore pieno crescente

### QR simulato `[rev 2.0]`

- **Dimensioni:** ~20 × 20 mm (hook audio) · 14 × 12 mm (AI Coach in sidebar)
- **Struttura:** griglia di quadratini (2.2 pt) su sfondo bianco, bordo colore area o Segnale
- **Etichetta superiore:** "🎧 Podcast" o "AI COACH" — Montserrat Bold 5.5–6pt, colore area/Segnale
- **Etichetta inferiore:** durata (es. "2min 20sec") o "Hai dubbi?" — Source Sans 5pt grigio
- **Alternativa no-phone (Foundation e Intermediate):** testo "→ oppure leggi qui sotto" in 5pt grigio sotto il QR

### Strip CLIL (Zona 5, fondo) `[rev 2.0]`

Striscia orizzontale di 3.5 mm di altezza, posizionata come ultimo elemento di Zona 5 (sopra il folio).

- **Sfondo:** `#FFF3E0` · Bordo: `#FFB74D` lw=0.3 · Raggio: 2
- **Testo:** `Tech English:  [termine EN] /IPA/  ·  [termine EN] /IPA/  ·  …`
- **Font:** Courier 5.5pt · Colore: `#8B5000`
- **Contenuto:** 3–5 termini tecnici dalla JSON MC campo `clil_termini`

### Zona 3 bicolore `[rev 2.0]`

In Foundation (senza sidebar), Zona 3 è divisa orizzontalmente in due sezioni:
- **Sinistra (55%):** case study — sfondo `#F0F7FF` o `#FFF3F0` secondo area
- **Destra (45%):** Professione del futuro — sfondo `#FFF3F0` o tono chiaro area

In Intermediate e Advanced la professione del futuro è nella sidebar; Zona 3 occupa la larghezza piena della colonna principale.

### Badge SDG `[rev 2.0]`

- **Forma:** cerchio pieno, colore ufficiale SDG, raggio 7mm (sidebar) · 7mm (compito)
- **Testo:** "SDG [N]" — Montserrat Bold 5.5–8pt bianco, centrato
- **Posizione principale:** angolo in basso a destra di Zona 5
- **Posizione sidebar:** elemento indipendente nella sidebar, con titolo SDG in 6pt sotto il cerchio
- **Multipli SDG:** se la MC ha più SDG (es. 12 + 15), mostrare due cerchi affiancati nella stessa zona

### AI Coach QR (Zona 5) `[rev 2.0]`

In Foundation (senza sidebar), il QR AI Coach è posizionato nell'angolo in basso a destra di Zona 5, dimensioni ~19 × 13 mm con sfondo `#E3F4F9` e bordo Segnale. Non occupa una zona separata.

### Folio `[rev 2.0]`

- **Linea separatrice:** a 9 mm dal basso, lw=0.4, colore `#E0E0E0`, da margine sinistro a destra
- **Testo sinistro:** `TecnologIA  ·  [Nome area]  ·  [N]ª classe` — Source Sans 5.5pt `#8A8A8A`
- **Testo centro:** `[Fonte: Paci 2014 + Hypertech 2020  ·  IN 2025 (D.M. n. 221/2025)]` — Source Sans 5.5pt `#8A8A8A`
- **Testo destro:** numero pagina — Montserrat Bold 8pt `#8A8A8A`

---

## Regole assolute `[rev 2.0]`

1. **Non usare mai più di due colori area nella stessa pagina.** Ogni MC appartiene a un'area sola.
2. **Il corpo testo non va mai sotto 8.5 pt stampato.** Accessibilità DSA. Foundation: mai sotto 9.5 pt.
3. **Le 5 zone seguono sempre lo stesso ordine.** Non invertire, non saltare.
4. **Il colore Segnale (`#00B4D8`) è riservato agli elementi interattivi/digitali:** QR AI Coach, link app, badge connettività. Non usarlo come colore area.
5. **Nessun elemento esce dai margini.** Testo, infografiche e card rispettano sempre la gabbia.
6. **La sidebar è adattiva, non fissa.** Foundation = 0%. Intermediate = 20%. Advanced = 25%. Non invertire o uniformare tra livelli.
7. **Zona 4: le card disattivate rimangono visibili, non spariscono.** Lo studente deve vedere che i livelli superiori esistono — ma non deve sentire pressione a raggiungerli immediatamente.
8. **Il box "Professione del futuro" appare sempre** — in sidebar (I, A) o in Zona 3 bicolore (F). Non si omette mai.
9. **La strip CLIL appare solo se la MC ha `clil_termini` compilati nel JSON.** Se il campo è vuoto, lo spazio è omesso (non sostituito con bordo vuoto).
10. **Il badge livello DigComp nell'header usa il colore UN dei badge (pastello), non il colore area:** Foundation → `#90CAF9` · Intermediate → `#FFCC80` · Advanced → `#EF9A9A`.

---

## Changelog

| Versione | Data | Modifiche principali |
|----------|------|---------------------|
| 1.0 | Maggio 2026 | Prima versione — struttura base, palette, tipografia, griglia fissa |
| 2.0 | Maggio 2026 | Sidebar adattiva per livello · Card Zone 4 con stati attivo/disattivato · Pill zona numerata · Header bicolore · Corpo testo adattivo per livello · Strip CLIL · QR simulato con durata · Zona 3 bicolore (Foundation) · Badge SDG con colori UN · Folio dettagliato · Colori livello DigComp codificati |

---

*Design System TecnologIA v2.0 — Antonio Scaramuzzino — Maggio 2026*
*Prodotto in iterazione con i template Foundation (MC-MAT-1-02), Intermediate (MC-DIG-2-01), Advanced (MC-ENE-3-01) e il mockup completo MC-MAT-1-02.*
