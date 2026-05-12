# Refactor Plan — MC Template v2
**Branch target:** `refactor/mc-template-v2`
**Data discovery:** 2026-05-11
**Stato:** in attesa di approvazione prima di modificare codice

---

## 1. Mappa percorsi esatti — tutti i file coinvolti

### File principali da modificare

| File | Ruolo | Tipo modifica |
|------|-------|---------------|
| `app/mc/[id]/page.tsx` | Server component — rendering MC, zona-detection, orchestrazione | Aggiungere ZoneNavigator, LevelSelector, RubricaDrawer; adattare sezione text.sections.map() |
| `lib/content-loader.ts` | Parser Markdown → struttura dati | Aggiungere logica accordion (@@ACCORDION_START/END) per @@SUBHEAD: con pattern costruzione/fase |
| `app/globals.css` | Stili globali | Aggiungere CSS custom properties fasi, 5 stili callout unificati, stili ZoneNavigator/accordion |

### Nuovi componenti da creare

| File | Tipo | Descrizione |
|------|------|-------------|
| `components/mc/ZoneNavigator.tsx` | "use client" | Tab 5 fasi — sticky desktop, stepper mobile, localStorage |
| `components/mc/LevelSelector.tsx` | "use client" | Tab ● / ●● / ●●● per SPERIMENTA |
| `components/mc/ResourcesPanel.tsx` | "use client" | P1.3 — pannello risorse aggregato (audio, video, flashcard, quiz) |

### Componenti esistenti — nessuna modifica prevista

`AudioPlayer.tsx`, `FlashcardDeck.tsx`, `FlippedVideos.tsx`, `FormulaCard.tsx`, `ProcedureList.tsx`, `QuizWidget.tsx`, `VideoGallery.tsx`, `MCCard.tsx`, `MCVisual.tsx`, `Breadcrumb.tsx`

### Dati — solo lettura, mai modificati

`data/testi/**/*_completa.md` — invariati per vincolo esplicito del task.
`data/mc/**/*.json` — nessun campo `rubrica` (vedi §5).

### Librerie di supporto

`lib/mc-loader.ts`, `lib/ui.ts`, `lib/useProgress.ts` — nessuna modifica prevista.

---

## 2. Zona-detection in page.tsx — riga esatta e meccanismo

**Riga 90–93** (file `app/mc/[id]/page.tsx`):

```tsx
const isInnesca    = /innesca/i.test(section.title);
const isEsplora    = /esplora/i.test(section.title);
const isSperimenta = /sperimenta/i.test(section.title);
```

La rilevazione avviene dentro `text.sections.map()` che inizia alla **riga 90**. Non esiste una funzione `parseZone` separata. Le sezioni sono già separate per `##` da `getMCTextContent()` in `content-loader.ts` (righe 103–115): ogni `## ⚡ INNESCA`, `## 📖 ESPLORA` ecc. diventa un elemento di `sections[]` con `.title` e `.body`.

Il titolo che arriva nel componente è già pulito da `stripMarkdown()` e dal replace `/^zona\s+\d+\s*[—-]\s*/i` — quindi le emoji (⚡ 📖 🔍 🔬 🌍) **rimangono** nel title. Le regex di zona matchano sul nome testuale, non sull'emoji.

**Sezioni effettive di MC-DIS-1-01** (nell'ordine in cui arrivano a page.tsx):
1. `⚡ INNESCA`
2. `📖 ESPLORA`
3. `🔍 OSSERVA`
4. `🔬 SPERIMENTA`
5. `🌍 AGISCI`
6. `APPENDICE — Tech in English` *(presente, non corrisponde a nessuna zona)*

La sezione `NOTE DI EDITING` viene filtrata da content-loader (riga 115: `/^(note di editing|metadati)$/i`). `APPENDICE` non è filtrata — **rischio da gestire** (vedi §7).

---

## 3. Struttura reale del contenuto SPERIMENTA in MC-DIS-1-01

### Come sono separati i livelli nel Markdown sorgente

Nel file `.md` i tre livelli sono `### ` headings (h3) dentro la sezione `## 🔬 SPERIMENTA`:

```
### ● BASE — Costruisco con guida
### ●● INTERMEDIO — Costruzioni autonome
### ●●● AVANZATO — Progetto con norme grafiche
```

### Cosa produce il content-loader

`cleanMarkdownForReading()` in `lib/content-loader.ts` trasforma **sia** `###` (h3) **che** `####` (h4) con la stessa regex alla riga 80:

```ts
.replace(/^#{3,6}\s+(.+)$/gm, "\n@@SUBHEAD:$1\n")
```

Quindi nel `body` della sezione SPERIMENTA i livelli diventano:

```
@@SUBHEAD:● BASE — Costruisco con guida
...testo base...
@@SUBHEAD:●● INTERMEDIO — Costruzioni autonome
...testo intermedio...
@@SUBHEAD:●●● AVANZATO — Progetto con norme grafiche
...testo avanzato...
```

### Pattern marker per LevelSelector (P0.3)

I marker sono già prodotti uniformemente da content-loader. Il regex da usare in `LevelSelector.tsx` per splittare il body:

```ts
const LEVEL_RE = /@@SUBHEAD:●{1,3}[^@]+/g;
// Oppure più preciso:
/@@SUBHEAD:(●{1,3})\s*(BASE|INTERMEDIO|AVANZATO)[^@]*/gi
```

Questo pattern è **presente in tutti e 46 i file testati** (100% consistenza su DIS-1-01 e MAT-1-01 verificati). Il fallback se non trovato: mostrare tutto il body come unico blocco.

---

## 4. Struttura reale di ESPLORA — subheads e accordion

### Headings presenti in MC-DIS-1-01 ESPLORA

La sezione `## 📖 ESPLORA` contiene due livelli di heading:

**`### ` (h3) — sottoargomenti narrativi** — diventano `@@SUBHEAD:`:
- `@@SUBHEAD:Il disegno tecnico: parlare con le forme`
- `@@SUBHEAD:Una storia lunga 5.000 anni`
- `@@SUBHEAD:Gli strumenti del disegno tecnico`
- `@@SUBHEAD:Le linee: il vocabolario del disegno tecnico`
- `@@SUBHEAD:Le costruzioni geometriche fondamentali`
- `@@SUBHEAD:Il caso studio: l'arco romano e la geometria applicata`

**`#### ` (h4) — costruzioni procedurali** — anch'esse `@@SUBHEAD:`:
- `@@SUBHEAD:La matita`
- `@@SUBHEAD:Il righello`
- `@@SUBHEAD:Le squadre`
- `@@SUBHEAD:Il compasso`
- `@@SUBHEAD:Il rapportatore`
- `@@SUBHEAD:Linea continua grossa (spessore: 0,5–0,7 mm)`
- `@@SUBHEAD:Linea continua fine (spessore: 0,25–0,35 mm)`
- `@@SUBHEAD:Linea tratteggiata (spessore: 0,35 mm, tratti di 3–5 mm con spazi di 2 mm)`
- `@@SUBHEAD:Linea mista (linea-punto, spessore: 0,25 mm)`
- `@@SUBHEAD:Costruzione 1 — Perpendicolare a una retta in un punto P su di essa`
- `@@SUBHEAD:Costruzione 2 — Bisettrice di un angolo`
- `@@SUBHEAD:Costruzione 3 — Divisione di un segmento in n parti uguali (metodo delle parallele)`
- `@@SUBHEAD:Costruzione 4 — Perpendicolare da un punto P esterno a una retta r`
- `@@SUBHEAD:Costruzione 5 — Triangolo equilatero dato il lato`
- `@@SUBHEAD:Costruzione 6 — Esagono regolare inscritto in una circonferenza`
- `@@SUBHEAD:Costruzione 7 — Quadrato dato il lato`
- `@@SUBHEAD:Costruzione 8 — Pentagono regolare dato il raggio della circonferenza circoscritta`

### Target accordion P0.2

Il task specifica il pattern: `/^(costruzione|fase|passo|step|esercizio|attività)\s+\d+/i`

Questo corrisponde esattamente ai subhead `Costruzione N — ...` che compaiono in ESPLORA di MC-DIS-1-01. Sono 8 costruzioni, tutte con il formato `Costruzione N —`.

**In MAT-1-01 ESPLORA** i `####` hanno pattern diverso (nomi propri: "Il legno", "I metalli", ecc.) — non matchano il pattern accordion. Degrado graceful corretto: vengono mostrati come `@@SUBHEAD:` normali.

### Implementazione P0.2 in content-loader.ts

Attualmente tutta la logica si svolge in `cleanMarkdownForReading()`. Il transform accordion va aggiunto **dopo** la riga 80 che genera `@@SUBHEAD:`, oppure come post-processing separato sulla stringa risultante. Approccio raccomandato: post-processing separato sulla stringa, per non complicare la pipeline esistente:

```ts
// Dopo il replace @@SUBHEAD:
.replace(
  /@@SUBHEAD:((?:costruzione|fase|passo|step|esercizio|attività)\s+\d+[^\n]*)/gi,
  "\n@@ACCORDION_START:$1\n"
)
// Poi riconoscere la chiusura: ogni @@ACCORDION_START si chiude al prossimo @@SUBHEAD: o fine sezione
```

**Problema architetturale:** il marker `@@ACCORDION_END:` deve essere inserito prima di ogni successivo `@@ACCORDION_START:` o `@@SUBHEAD:`. La stringa è piatta — non c'è DOM. Soluzione: usare una passata regex con `replace` a callback che tiene stato, oppure (più pulito) fare una passata sulle righe con uno state machine. Questo è il punto più delicato dell'implementazione.

**Alternativa più semplice:** non aggiungere `@@ACCORDION_END:` al testo, ma gestire la chiusura direttamente in `ReadableText` in `page.tsx`: quando si incontra un `@@ACCORDION_START:`, si accumulano i blocchi fino al prossimo `@@ACCORDION_START:` o fine array.

---

## 5. Campo rubrica nel JSON MC — risultato verifica

**MC-DIS-1-01.json** — chiavi presenti:
`id, area, anno, titolo, descrizione, fonte, frameworks, outputApp, prerequisiti, tags, compito_realta, sdg, note_didattiche, hook_audio, professione_futura, clil_termini, uda_collegata`

**Campo `rubrica`: ASSENTE** in MC-DIS-1-01.json.

**MC-MAT-1-01.json** — chiavi presenti (un campo in più):
`id, area, anno, titolo, titolo_libro, descrizione, fonte, frameworks, outputApp, prerequisiti, tags, compito_realta, sdg, sdg_principale, note_didattiche, hook_audio, professione_futura, clil_termini, uda_collegata, stem_connections`

**Campo `rubrica`: ASSENTE** anche in MC-MAT-1-01.json.

La rubrica **esiste nel testo Markdown** come tabella dentro `## 🌍 AGISCI`, sezione `### 📋 Rubrica di valutazione`, ma non è strutturata come dato JSON nel file MC.

**Implicazione per P0.5:** l'approccio drawer con dati JSON è impraticabile senza dato strutturato. Due alternative:
- **A (raccomandata):** parsare la tabella rubrica dal body di AGISCI a runtime nel componente `RubricaDrawer` — la tabella Markdown è già convertita da `ReadableTable` in page.tsx, quindi è riconoscibile.
- **B:** skippa P0.5, documenta nel changelog che il dato JSON non esiste.

**Decisione richiesta all'autore:** quale approccio preferisci per P0.5?

---

## 6. Approccio React proposto per ciascun P0

### P0.1 — ZoneNavigator

**Componente:** `components/mc/ZoneNavigator.tsx` — `"use client"`

**Input props:**
```tsx
interface ZoneNavigatorProps {
  mcId: string;
  zones: { id: string; emoji: string; label: string }[];
  activeZone: string;
  onZoneChange: (id: string) => void;
}
```

**Logica:**
- Desktop (`min-width: 768px`): barra tab orizzontale sticky sotto il breadcrumb, `position: sticky; top: 0; z-index: 40`. Ogni tab ha emoji + label + indicatore progresso.
- Mobile (`< 768px`): stepper verticale collassabile. Solo la zona attiva è espansa, le altre mostrano solo il titolo cliccabile.
- `localStorage` key: `mc-zone-{mcId}` — persiste la zona attiva tra sessioni.
- Deep link: `useEffect` all'mount legge `window.location.hash` e attiva la zona corrispondente (es. `#esplora` → attiva `esplora`).

**Integrazione in page.tsx:** il componente wrappa `text.sections.map()` oppure lo precede come nav separata. Dato che page.tsx è un Server Component, ZoneNavigator riceve le zone come prop e gestisce lo stato client-side. Il contenuto delle sezioni rimane renderizzato server-side (no SSR loss) — ZoneNavigator nasconde/mostra le section con CSS (`display: none` / `display: block`) tramite data attribute, non smontando i nodi.

**Punto di inserimento in page.tsx:** subito prima del `<div className="mx-auto grid max-w-7xl ...">` alla riga 79, dentro `<main>`.

### P0.2 — Accordion ESPLORA

**Modifica:** `lib/content-loader.ts` — aggiungere post-processing in `cleanMarkdownForReading()`.

**Modifica:** `page.tsx` — `ReadableText` aggiunge gestione `@@ACCORDION_START:`.

**Logica render:**
```tsx
if (block.startsWith("@@ACCORDION_START:")) {
  const title = block.replace(/^@@ACCORDION_START:/, "").trim();
  // Raccoglie i blocchi successivi fino al prossimo @@ACCORDION_START: o fine array
  // Stato locale: isOpen (default false), localStorage key: mc-accordion-{mcId}-{index}
  return <AccordionItem key={index} title={title} isOpenDefault={false} />;
}
```

`AccordionItem` è un sub-componente `"use client"` inline in page.tsx o estratto in `components/mc/AccordionItem.tsx`.

### P0.3 — LevelSelector SPERIMENTA

**Componente:** `components/mc/LevelSelector.tsx` — `"use client"`

**Input props:**
```tsx
interface LevelSelectorProps {
  body: string;  // il body grezzo della sezione SPERIMENTA con @@SUBHEAD:● markers
  mcId: string;
}
```

**Logica split:**
```ts
// Split by @@SUBHEAD:●+ markers
const LEVEL_MARKER = /(?=@@SUBHEAD:●)/;
const parts = body.split(LEVEL_MARKER);
// parts[0] = eventuale intro (es. box "Prima di iniziare...")
// parts[1..3] = ● BASE, ●● INTERMEDIO, ●●● AVANZATO
```

Ogni parte viene passata a `ReadableText` (che già esiste come funzione in page.tsx — va estratta o duplicata in un file separato condiviso).

**Tab:** ● Base / ●● Intermedio / ●●● Avanzato con colori differenziati (blu / arancio / viola).

**Degrado:** se il split non trova marker ●, mostra tutto il body senza tab.

### P0.4 — Callout unificati

**Modifica:** `app/globals.css` — aggiungere 5 CSS custom properties in `:root` e 5 varianti `.callout-*`.

**Modifica:** `page.tsx` `ReadableText` — nel blocco `@@CALLOUT:` esistente (riga 324–338), sostituire la detection per emoji con classi CSS invece di `style` inline. Aggiungere detection per le 5 emoji target.

**Mappatura:**
```
💡 → .callout-insight   (amber)
⚠️ → .callout-warning   (red)
🏛️ → .callout-history   (sepia/warm)
🔢 → .callout-stem      (blue)
💬 → .callout-voice     (slate)
```

L'attuale codice usa `style={{ borderColor, background, color }}` inline — da sostituire con `className="callout callout-{type}"`.

### P0.5 — Rubrica accessibile

Dipende dalla decisione su §5. Se si sceglie l'alternativa A (parse dal MD):

**Componente:** `components/mc/RubricaDrawer.tsx` — `"use client"`

**Logica:** il componente riceve il body di AGISCI come prop. Al mount fa parsing della tabella Markdown con `isTableBlock()` + `ReadableTable` (entrambe già in page.tsx). Il pulsante sticky `📋 Rubrica` è posizionato `fixed bottom-4 right-4`.

---

## 7. Lista rischi retrocompatibilità

### R1 — Sezione APPENDICE non filtrata
**Problema:** `MC-DIS-1-01` ha `## APPENDICE — Tech in English` che viene inclusa in `sections[]`. Con ZoneNavigator, questa sezione apparirebbe come una sesta zona senza emoji e senza corrispondenza nel nav.
**Mitigazione:** aggiungere filtro in `content-loader.ts`: `!/^(note di editing|metadati|appendice)/i`. Oppure in ZoneNavigator: mostrare solo le sezioni che matchano le 5 zone note.
**Azione richiesta:** aggiungere al filtro esistente in content-loader riga 115.

### R2 — ReadableText è una funzione in page.tsx, non un componente esportabile
**Problema:** `ReadableText` è definita come funzione locale in `app/mc/[id]/page.tsx`. `LevelSelector` e `AccordionItem` sono `"use client"` ma devono chiamare `ReadableText` che contiene logica server-side (nessuna, in realtà — è puro rendering JSX senza API). Il problema è che non può essere importata da un file `"use client"` senza rompersi con Next.js App Router.
**Mitigazione:** estrarre `ReadableText` (e le sue sotto-funzioni: `renderInlineMarkdown`, `ReadableTable`, `FormattedParagraph`, ecc.) in `lib/readable-text.tsx` come componente React condiviso. Non deve essere `"use client"` — è puro JSX senza hooks.
**Impatto:** refactor moderato (~200 righe estratte), nessuna modifica funzionale.

### R3 — localStorage non disponibile in SSR/SSG
**Problema:** Next.js App Router con `output: "export"` fa SSG. I componenti `"use client"` con `localStorage` devono usare `useEffect` — nessun accesso a `localStorage` fuori da `useEffect` o callback.
**Mitigazione:** standard pattern `useEffect(() => { const saved = localStorage.getItem(...) }, [])`. Già necessario per ZoneNavigator, LevelSelector, AccordionItem.

### R4 — sticky ZoneNavigator e layout grid esistente
**Problema:** la riga 79 di page.tsx ha `<div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 ... lg:grid-cols-[minmax(0,1fr)_340px]">`. Il nav sticky deve stare **fuori** da questo grid (altrimenti lo sticky si applica allo scroll interno del grid, non alla pagina).
**Mitigazione:** ZoneNavigator va inserito tra il `</section>` dell'hero (riga 77) e il `<div className="mx-auto grid...">` (riga 79), a livello di `<main>`.

### R5 — Test su MC senza tutte e 5 le zone
**Problema:** alcune MC potrebbero non avere tutte e 5 le sezioni (es. MC con solo 3 zone). ZoneNavigator deve gestire questo caso.
**Mitigazione:** `zones` prop costruita dinamicamente da `text.sections` in page.tsx — solo le sezioni effettivamente presenti vengono passate.

### R6 — APPENDICE nella sezione Tech in English
**Problema specifico:** la tabella CLIL in APPENDICE (es. riga 663-679 di MC-DIS-1-01) è già resa da `ReadableTable`. Con ZoneNavigator nasconde/mostra le section, la sezione APPENDICE va esclusa dal nav ma inclusa nel contenuto (o esclusa del tutto).
**Decisione richiesta:** mostrare APPENDICE sempre in fondo (fuori dal nav) o nasconderla del tutto nella versione web?

### R7 — `compactOperational` flag in SPERIMENTA
**Problema:** `ReadableText` riceve `compactOperational={isSperimenta}` (riga 122 page.tsx). Se LevelSelector prende il `body` di SPERIMENTA e lo passa a ReadableText internamente, deve passare anche `compactOperational={true}`.
**Mitigazione:** LevelSelector riceve anche `compactOperational?: boolean` come prop.

---

## 8. Note architetturali aggiuntive

### Stack confermato
- Next.js 16.2.2 con `output: "export"` (SSG statico puro)
- Tailwind CSS v4 (`@import "tailwindcss"` in globals.css — nuova sintassi v4)
- TypeScript — build deve passare senza errori

### Branch di lavoro
Creare `refactor/mc-template-v2` da `main` prima di qualsiasi modifica.

### Sequenza di implementazione raccomandata
1. Creare branch
2. Estrarre `ReadableText` in `lib/readable-text.tsx` (prerequisito per R2)
3. Aggiungere filtro APPENDICE in content-loader (R1)
4. Implementare P0.4 (callout CSS) — modifica minima, zero rischi
5. Implementare P0.3 LevelSelector — modifica isolata
6. Implementare P0.2 accordion in content-loader + AccordionItem
7. Implementare P0.1 ZoneNavigator — modifica più complessa
8. Implementare P0.5 (dipende da decisione §5)
9. Verificare su MC-MAT-1-01
10. `npm run build`

---

*Autore discovery: Claude (agent) · Data: 2026-05-11 · In attesa di approvazione*
