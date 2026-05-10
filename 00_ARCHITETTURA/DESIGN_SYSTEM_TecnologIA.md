# Design System — TecnologIA
**Filosofia visiva e sistema grafico del libro**
Versione 1.0 — Maggio 2026

---

## Movimento: "Precision Signal"

Il libro non è un oggetto neutro. È uno strumento di pensiero — costruito per chi deve capire come funziona il mondo fisico nell'era dei dati. Il design non illustra questa idea: la incarna.

---

## Filosofia visiva

**Struttura come linguaggio.** La griglia A4 è divisa in zone precise, non decorative. Ogni millimetro di margine, ogni colonna, ogni banda cromatica ha una funzione. La struttura comunica prima ancora che il testo venga letto. Lo studente impara dove guardare: non cerca, trova. Il layout è la prima competenza trasferita.

**Colore come codice.** Le nove aree tematiche hanno ciascuna un colore segnale — saturo, distinto, inequivocabile. Il colore non abbellisce: classifica. Una banda laterale colorata, un'etichetta di area, un badge SDG: bastano tre elementi cromatici per orientare lo studente in qualsiasi punto del libro. La palette è progettata con contrasti WCAG AA per accessibilità piena, anche in versione stampata in scala di grigi.

**Tipografia ad architettura variabile.** Due famiglie tipografiche: una geometrica e sans-serif per titoli, ID, etichette tecniche (Montserrat); una umanista e ampia per il corpo testo, pensata per DSA e alta leggibilità (Source Sans Pro). Il peso, la dimensione e il colore del testo sono codificati: non c'è variazione arbitraria. Ogni livello gerarchico ha il suo stile e lo mantiene in tutto il volume.

**Spazio come respiro cognitivo.** Ogni MC ha zone di bianco intenzionale. Non è spazio vuoto: è pausa tra un carico cognitivo e il successivo. I blocchi di laboratorio sono separati visivamente dalla teoria. Le sidebar sono contenute. Il margine interno delle doppie pagine è generoso — il libro deve poter essere tenuto aperto senza perdere testo nella rilegatura.

**Iconografia minima e sistematica.** Un set di icone lineari e monocromatiche accompagna elementi ricorrenti: il QR audio, i tre livelli di difficoltà (●, ●●, ●●●), il badge SDG, il coach AI, la professione del futuro. Le icone non decorano: segnalano. Sono identiche in tutto il libro. La consistenza è il messaggio.

---

## Sistema cromatico

### Colori brand

| Nome | Ruolo | Hex |
|------|-------|-----|
| Notte | Sfondo copertina, titoli primari | `#0D1B2A` |
| Segnale | Accent principale, line decorative, QR badge | `#00B4D8` |
| Bianco carta | Sfondo pagine interne | `#FAFAFA` |
| Grigio testo | Corpo testo | `#2D2D2D` |
| Grigio sottile | Linee separatore, bordi zone | `#E0E0E0` |

### Colori area tematica

| Codice | Area | Colore | Hex | Uso |
|--------|------|--------|-----|-----|
| MAT | Materiali e Rifiuti | Ambra caldo | `#E07A5F` | Banda laterale, header MC |
| DIS | Disegno Tecnico | Ardesia blu | `#457B9D` | Banda laterale, header MC |
| DIG | Competenze Digitali | Ciano elettrico | `#0096C7` | Banda laterale, header MC |
| INF | Informatica | Viola profondo | `#6B4FA2` | Banda laterale, header MC |
| ALI | Alimentazione | Verde salvia | `#52B788` | Banda laterale, header MC |
| AMB | Abitazione / Città | Sabbia calda | `#C89B6E` | Banda laterale, header MC |
| ENE | Energia e Macchine | Giallo solare | `#F2C14E` | Banda laterale, header MC |
| COM | Comunicazioni | Ametista | `#9B5DE5` | Banda laterale, header MC |
| SIS | Sistemi / Economia | Teal profondo | `#1B7F7F` | Banda laterale, header MC |

---

## Sistema tipografico

### Famiglie

| Famiglia | Ruolo | Pesi usati |
|----------|-------|-----------|
| **Montserrat** | Titoli, ID MC, etichette zone, header | Bold (700), SemiBold (600), Regular (400) |
| **Source Sans Pro** | Corpo testo, descrizioni, istruzioni laboratorio | Regular (400), SemiBold (600) |
| **JetBrains Mono** | ID codice MC, riferimenti framework, snippet | Regular (400) |

### Scala tipografica (A4)

| Livello | Font | Dimensione | Peso | Colore |
|---------|------|-----------|------|--------|
| Titolo libro (copertina) | Montserrat | 48 pt | 700 | Bianco |
| Titolo MC (H1) | Montserrat | 22 pt | 700 | Colore area |
| Titolo zona (H2) | Montserrat | 13 pt | 600 | Grigio scuro |
| Corpo testo | Source Sans Pro | 10 pt | 400 | `#2D2D2D` |
| Didascalia / etichetta | Montserrat | 7.5 pt | 600 | Colore area o grigio |
| ID MC / codice | JetBrains Mono | 8 pt | 400 | Colore area |
| Note, riferimenti | Source Sans Pro | 8 pt | 400 | `#777777` |

---

## Struttura pagina A4

### Griglia base

- **Formato:** A4 (210 × 297 mm)
- **Margini:** 18 mm top/bottom, 20 mm esterno, 15 mm interno (cucitura)
- **Banda area laterale:** 8 mm, colore area, bordo sinistro pagina sinistra / destro pagina destra
- **Colonne:** 1 colonna principale + 1 sidebar (rapporto 68% / 28%, gap 4%)
- **Gutter sidebar:** 6 mm

### Le 5 zone (struttura per ogni MC)

```
┌─ BANDA AREA (8mm, colore area) ─────────────────────────────────────┐
│ [ID MC]  [TITOLO MC]                            [ICONA AREA] [ANNO] │
├─────────────────────────────────────────────────────────────────────┤
│ ZONA 1 — HOOK                                   │ SIDEBAR           │
│ QR audio + domanda di avvio                     │                   │
│ "Hai mai visto come..."                         │ PROFESSIONE       │
├─────────────────────────────────────────────────┤ DEL FUTURO        │
│ ZONA 2 — CONCETTO                               │                   │
│ Testo espositivo (max 200 parole)               │ [Job title 2030]  │
│ + Infografica                                   │ [Descrizione]     │
├─────────────────────────────────────────────────┤                   │
│ ZONA 3 — ESEMPIO REALE                          │ SDG BADGE         │
│ Oggetto concreto come case study                │ [numero SDG]      │
│                                                 │ [titolo]          │
├─────────────────────────────────────────────────┤                   │
│ ZONA 4 — LABORATORIO                            │                   │
│ ● Base  ●● Intermedio  ●●● Avanzato             │ AI COACH          │
│                                                 │ [QR code]         │
├─────────────────────────────────────────────────┤                   │
│ ZONA 5 — COMPITO DI REALTÀ + METACOGNIZIONE     │                   │
│ Scenario → Consegna → Criteri → Riflessione     │                   │
└─────────────────────────────────────────────────┴───────────────────┘
```

---

## Elementi ricorrenti

### Intestazione MC
- Banda colorata in alto (12 mm) con colore area
- ID MC in JetBrains Mono (es. `MC-MAT-1-02`) — bianco su banda
- Titolo MC in Montserrat Bold — bianco su banda
- Icona area + numero classe — in alto a destra

### Badge livello DigComp
- ● Foundation (F) — contorno grigio
- ●● Intermediate (I) — contorno area
- ●●● Advanced (A) — pieno, colore area

### Badge SDG
- Cerchio con numero SDG in Montserrat Bold
- Colore ufficiale SDG (seguire palette UN)
- Titolo SDG in Source Sans sotto il cerchio

### QR Code
- Bordo sottile colore area
- Etichetta sotto: "Ascolta il podcast" o "AI Coach"
- Dimensione: 18 × 18 mm

---

## Regole assolute

1. **Non usare mai più di due colori area nella stessa pagina.** Ogni MC appartiene a un'area sola.
2. **Il corpo testo non va mai sotto 9 pt stampato.** Accessibilità DSA.
3. **Le 5 zone seguono sempre lo stesso ordine.** Non invertire, non saltare.
4. **Il colore segnale (`#00B4D8`) è riservato agli elementi interattivi/digitali** (QR, badge AI Coach, link). Non usarlo come colore area.
5. **Nessun elemento esce dai margini.** Testo, immagini e grafici rispettano sempre la gabbia.

---

*Design System TecnologIA — Antonio Scaramuzzino — Maggio 2026*
