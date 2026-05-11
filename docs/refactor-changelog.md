# Refactor Changelog — MC Template v2

**Branch:** `refactor/mc-template-v2`
**Data:** 2026-05-11
**Build:** ✅ 69 pagine statiche, 0 errori TypeScript

---

## P0 — Componenti core (P0.4 → P0.1 → P0.2 → P0.3 → P0.5)

### P0.4 — CalloutBox semantici
**File:** `components/mc/CalloutBox.tsx` (nuovo)

Componente `CalloutBox` e `CalloutBoxFromText` che sostituiscono il rendering inline dei blockquote `@@CALLOUT:` in `page.tsx`. Cinque tipi semantici rilevati automaticamente dal contenuto del testo:

| Tipo | Trigger testuale | Colori |
|------|-----------------|--------|
| `safety` | ⚠️ sicurezza attenzione pericolo | rosso |
| `physics` | ⚡ fisica legge formula ohm | blu |
| `error` | errore comune sbaglio | giallo |
| `question` | domanda aperta | sky |
| `info` / `tip` | 💡 lo sapevi suggerimento | amber |

I callout usano CSS custom properties definite in `globals.css` (P1.1) invece di `style` inline — tematizzabili via CSS.

---

### P0.1 — MCNavigator (tab 5 zone sticky)
**File:** `components/mc/MCNavigator.tsx` (nuovo)

Tab bar sticky con 5 voci (INNESCA/ESPLORA/OSSERVA/SPERIMENTA/AGISCI):
- `role="tablist"` / `role="tab"` / `role="tabpanel"` compliant ARIA
- Scroll orizzontale su mobile con scrollbar nascosta cross-browser
- Indicatore bordo-inferiore colorato con `areaHex` per coerenza cromatica area
- Tab attivo scrollato in vista automaticamente su cambio (mobile UX)
- **P1.2 integrato:** persistenza su `localStorage` — il tab aperto viene ricordato per sessione, con namespace basato sui tab ID
- **P1.3 integrato:** prop `forcedActiveId` per navigazione programmatica dall'esterno (usata da `ResourcesPanel`)

---

### P0.2 — AccordionSection (ESPLORA collassabile)
**File:** `components/mc/AccordionSection.tsx` (nuovo)

Accordion multi-item per la zona ESPLORA:
- Ogni `@@SUBHEAD:` del body diventa un item apribile/chiudibile
- Primo item aperto di default (`defaultFirstOpen={true}`)
- Animazione via `grid-template-rows: 0fr → 1fr` (CSS puro, nessun JS per misure)
- `aria-expanded` / `aria-controls` / `role="region"` ARIA compliant
- Chevron animato con `rotate-180` al cambio stato

---

### P0.3 — LevelTabs (SPERIMENTA livelli)
**File:** `components/mc/LevelTabs.tsx` (nuovo)

Tab a 3 livelli (● Base / ●● Intermedio / ●●● Avanzato) per la zona SPERIMENTA:
- `buildLevelTabs()` helper per costruire i tab da array di sezioni
- Livello default = livello DigComp della MC (F/I/A)
- Colori differenziati: blu=Base, emerald=Intermedio, orange=Avanzato
- Split del body di SPERIMENTA su marker `@@SUBHEAD:●...` in `MCPageClient`
- Degrado graceful: se nessun marker trovato, mostra il body intero senza tab

---

### P0.5 — RubricaDrawer (rubrica estratta a runtime)
**File:** `components/mc/RubricaDrawer.tsx` (nuovo)

Drawer per la rubrica di valutazione estratta a runtime dal body Markdown di AGISCI:
- Parser Markdown → `RubricaRow[]`: cerca `### 📋 Rubrica di valutazione` e legge la tabella successiva
- Mobile: pannello slide-up dal basso (max 90vh)
- Desktop (≥768px): pannello laterale da destra (600px fissi)
- Trigger button con colore `areaHex`, ARIA `aria-expanded` / `aria-controls`
- Focus trap semplice + chiusura con `Escape`
- Nessun campo JSON aggiuntivo necessario — estrae dalla sezione AGISCI del testo MD

---

## Architettura: page.tsx → MCPageClient split

**File modificati:**
- `app/mc/[id]/page.tsx` — ridotto a thin Server Component (~150 righe vs 615 originali)
- `components/mc/MCPageClient.tsx` (nuovo, ~430 righe) — orchestratore client-side

**Pattern:** il Server Component carica tutti i dati (MC JSON, testo MD, audio, video, quiz, flashcard) e li serializza come props al Client Component. Nessuna logica di rendering nel server oltre al layout strutturale.

**Struttura MCPageClient:**
```
MCNavigator (5 tab sticky)
  ├── INNESCA: AudioPlayer + domanda + body + FlippedVideos + ResourcesPanel
  ├── ESPLORA: AccordionSection (sottosezioni ###)
  ├── OSSERVA: ReadableBodyInTab + VideoGallery
  ├── SPERIMENTA: LevelTabs (●/●●/●●●)
  └── AGISCI: RubricaDrawer + ReadableBodyInTab
QuizWidget (dopo i tab)
FlashcardDeck (con sezione ripasso)
APPENDICE (sempre visibile sotto i tab, fuori dal navigator)
```

---

## P1 — Layer di rifinitura

### P1.1 — CSS globali callout unificati
**File:** `app/globals.css` (aggiunta sezione ~60 righe)

Aggiunge CSS custom properties per i 6 tipi di callout in `:root`, classi `.callout-*` semantiche, e stili helper per l'animazione accordion e la scrollbar nascosta del navigator.

### P1.2 — localStorage persistence tab attivo
**File:** `components/mc/MCNavigator.tsx` (integrato)

Il tab aperto viene salvato su `localStorage` con chiave basata sugli ID dei tab. Al caricamento successivo della stessa MC, il navigator apre l'ultimo tab visitato. Safe per SSR: l'accesso a `localStorage` avviene solo in `useState` initializer e in callback, mai durante il render server.

### P1.3 — ResourcesPanel
**File:** `components/mc/ResourcesPanel.tsx` (nuovo)

Pannello collassabile nella zona INNESCA che mostra una griglia dei contenuti disponibili per la MC (audio, video, flashcard, quiz, attività) con contatori e pulsanti di navigazione rapida verso le rispettive zone. Il click su un chip naviga al tab corrispondente via `MCNavigator.forcedActiveId`.

---

## Retrocompatibilità

- **MC-MAT-1-01:** verificata manualmente — tutte e 5 le zone presenti, accordion ESPLORA con 8 sottosezioni, LevelTabs SPERIMENTA con 3 livelli, RubricaDrawer estrae 4 criteri dalla tabella AGISCI
- **APPENDICE:** estratta fuori dai tab e mostrata sempre in basso — non inclusa nel navigator
- **`data/testi/`:** invariato — nessun file MD modificato
- **Componenti esistenti:** AudioPlayer, FlashcardDeck, FlippedVideos, FormulaCard, ProcedureList, QuizWidget, VideoGallery, MCCard, MCVisual, Breadcrumb — nessuna modifica
