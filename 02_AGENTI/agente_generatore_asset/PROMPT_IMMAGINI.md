# SISTEMA DI PROMPT IMMAGINI — Agente Artefice
**Versione:** 2.0 — Maggio 2026  
**Integrazione:** Higgsfield AI / GPT Image 2 (OpenAI)  
**Scope:** 7 immagini per ogni MC del progetto TecnologIA (52 MC × 7 = 364 immagini totali)

---

## Architettura del sistema

Ogni MC genera esattamente **7 immagini** mappate sulle zone del libro:

| # | ID | Nome | Zona | Uso | Modello | Aspect ratio |
|---|---|------|------|-----|---------|--------------|
| 1 | `img1-innesca` | **INNESCA** | ⚡ INNESCA | Illustrazione evocativa — oggetto reale dell'hook | soul_cinematic | 16:9 |
| 2 | `img2-esplora` | **ESPLORA** | 📖 ESPLORA | Illustrazione del concetto principale | gpt_image_2 | 4:3 |
| 3 | `img3-osserva` | **OSSERVA** | 🔍 OSSERVA | Caso studio documentaristico reale | cinematic_studio_2_5 | 4:3 |
| 4 | `img4-sperimenta` | **SPERIMENTA** | 🔬 SPERIMENTA | Scena attività pratica studenti | gpt_image_2 | 16:9 |
| 5 | `img5-infografica` | **INFOGRAFICA** | 📖 ESPLORA | Infografica densa di dati e annotazioni | gpt_image_2 | 1:1 |
| 6 | `img6-mappa` | **MAPPA** | Trasversale | Mappa concettuale relazioni tra concetti | gpt_image_2 | 1:1 |
| 7 | `img7-professione` | **PROFESSIONE** | 🔍 OSSERVA (sidebar) | Illustrazione simbolica Professione del Futuro 2030 | gpt_image_2 | 3:4 |

---

## Principi di costruzione dei prompt

### Regola 1 — Il testo guida il visual
Prima di costruire un prompt, l'agente deve leggere:
1. Il campo `hook_audio.oggetto_reale` (o `hook.oggetto_reale`) dalla MC JSON
2. Il campo `esempio.testo` per il contesto reale
3. Il campo `professione_futura.titolo` (o `esempio.prof.titolo`)
4. I primi 200 caratteri di `## 🔍 OSSERVA` dal file `_completa.md`

Il prompt deve rispecchiare l'oggetto e il contesto **specifici di quella MC**, non una generica rappresentazione del tema.

### Regola 2 — Complessità visiva = livello DigComp
| Livello | Complessità visiva | Indicazione stilistica |
|---------|--------------------|-----------------------|
| F (Foundation) | Semplice, un solo concetto | `clean, minimal, single focal point` |
| I (Intermediate) | Moderatamente dettagliata | `moderately detailed, multiple elements clearly organized` |
| A (Advanced) | Ricca, relazioni tra elementi | `rich composition, multiple relationships visible, expert-level detail` |

### Regola 3 — Palette cromatica per area
Ogni immagine deve avere un accento cromatico coerente con l'area tematica:

| Area | Colore primario | Colore secondario | Uso nel prompt |
|------|-----------------|-------------------|----------------|
| MAT 🪨 | `#C4622D` terracotta | `#F0DFC8` sabbia | `warm earthy terracotta accent` |
| DIS 📐 | `#1B2A4A` blu notte | `#A8C8E8` azzurro | `deep navy and sky blue accent` |
| DIG 💻 | `#00C896` verde elettrico | `#1E1E1E` grigio | `electric green digital accent, dark background` |
| INF 🔢 | `#3B3B9E` indaco | `#C8D4F5` lavanda | `indigo and lavender accent` |
| ALI 🌾 | `#6B8C42` verde oliva | `#F5E6A3` giallo grano | `olive green and warm wheat accent` |
| AMB 🏗️ | `#7A7A7A` cemento | `#FF6B35` arancio | `concrete grey with orange accent` |
| ENE ⚡ | `#FFD600` giallo | `#2D2D2D` antracite | `energetic yellow on dark anthracite` |
| COM 📡 | `#6C3FC8` viola | `#B8D4F0` celeste | `digital violet and light blue accent` |
| SIS ⚙️ | `#2B5FA6` blu acciaio | `#C0C0C0` argento | `steel blue and silver industrial accent` |

### Regola 4 — Contesto culturale e inclusività
- Ogni immagine con persone deve rappresentare studenti o professionisti **italiani o mediterranei**, età coerente con la scuola secondaria I grado (11-14 anni) o professionisti giovani (25-35 anni).
- Rappresentazione **gender-neutral** per default — specificare solo se il contesto narrativo della MC lo richiede.
- Niente uniformi scolastiche, niente gadget con loghi di brand riconoscibili.

---

## Template dei 4 prompt

### PROMPT 1 — SOGGETTO (⚡ INNESCA)

**Scopo:** L'immagine di impatto che lo studente vede aprendo la MC. Deve evocare curiosità sull'oggetto reale descritto nell'hook audio.

**Template:**
```
Cinematic close-up of [OGGETTO_REALE], photorealistic ultra-detailed material texture,
[DETTAGLIO_SPECIFICO_DAL_HOOK], dramatic studio lighting with [COLORE_ACCENTO_AREA] color accent,
isolated on clean neutral background, shallow depth of field,
[COMPLESSITA_VISIVA] composition, Italian middle school educational book hero image,
no text, no labels, 16:9 landscape
```

**Variabili da sostituire:**
- `[OGGETTO_REALE]` → dal campo `hook_audio.oggetto_reale` della MC JSON
- `[DETTAGLIO_SPECIFICO_DAL_HOOK]` → 1 elemento visivo estratto dal testo `hook_audio.note_script` (es. "showing cross-section of materials", "with visible wear patterns")
- `[COLORE_ACCENTO_AREA]` → dalla palette dell'area
- `[COMPLESSITA_VISIVA]` → dal livello DigComp della MC

**Esempi concreti:**

*MC-MAT-1-01 — Classificare i materiali per proprietà:*
```
Cinematic close-up of a well-worn sneaker showing multiple distinct materials —
rubber sole, polyester fabric, foam padding, visible steel reinforcement ring,
photorealistic ultra-detailed material texture, cross-section view revealing layers,
dramatic studio lighting with warm terracotta (#C4622D) color accent,
isolated on clean white background, shallow depth of field,
clean single focal point composition, Italian middle school educational book hero image,
no text, no labels, 16:9 landscape
```

*MC-MAT-1-02 — Ciclo di vita dei materiali:*
```
Cinematic aerial view of a cotton hoodie surrounded by raw cotton plants, spinning machinery,
shipping containers, and a recycling bin arranged in a circular timeline flow,
photorealistic, objects connected by subtle dotted path lines,
warm terracotta (#C4622D) color accent on the hoodie, clean white background,
moderately detailed composition showing multiple elements clearly organized,
Italian middle school educational book hero image, no text, 16:9 landscape
```

*MC-DIG-1-01 — Orientarsi nell'ambiente digitale:*
```
Cinematic close-up of a smartphone being carefully disassembled on a white table,
components arranged around it — CPU chip, RAM module, battery, screen,
photorealistic ultra-detailed electronic components texture, electric green (#00C896) LED accent lights,
dramatic studio lighting, dark background, shallow depth of field,
clean minimal composition, Italian middle school educational book hero image,
no text, no labels, 16:9 landscape
```

---

### PROMPT 2 — INFOGRAFICA (📖 ESPLORA)

**Scopo:** Visualizzazione del concetto principale della MC. Stile flat design, leggibile su doppia pagina del libro stampato.

**Template:**
```
Educational flat design infographic illustration: [TITOLO_MC],
key concepts arranged as [STRUTTURA_VISIVA]: [CONCETTI_CHIAVE_3_5],
[PALETTE_AREA] color scheme ([HEX_PRIMARIO] and [HEX_SECONDARIO]),
clean white background, geometric minimal icons, clear Italian label spaces,
[COMPLESSITA_VISIVA] layout with [N_ELEMENTI] visual elements,
modern Italian school textbook illustration style,
no photographic elements, vector-style, square 1:1 format
```

**Strutture visive disponibili** — scegliere la più adatta al tipo di concetto:
- `radial diagram with central concept` — per classificazioni attorno a un tema centrale
- `linear timeline flow with arrows` — per processi sequenziali (cicli, fasi)
- `comparison grid 2×N` — per confronti tra elementi
- `hierarchical tree structure` — per tassonomie e dipendenze
- `circular loop diagram` — per cicli chiusi (ciclo di vita, economia circolare)
- `layered cross-section` — per strutture interne o stratificate

**Esempi concreti:**

*MC-MAT-1-01:*
```
Educational flat design infographic: Material Properties Classification,
radial diagram with central concept: 5 materials (wood, plastic, metal, glass, fabric)
as spokes, each connected to property icons (hardness, conductivity, transparency, elasticity, weight),
warm earthy terracotta (#C4622D) and sand (#F0DFC8) color scheme,
clean white background, geometric minimal icons, Italian label spaces,
clean single focal point layout with 10 visual elements,
modern Italian school textbook illustration style, no photos, vector-style, 1:1 square
```

*MC-ENE-3-01 — Fonti di energia:*
```
Educational flat design infographic: Energy Sources and Conversions,
comparison grid showing renewable vs non-renewable sources in two columns,
solar, wind, hydro vs coal, oil, gas, each with conversion chain icons,
energetic yellow (#FFD600) and dark anthracite (#2D2D2D) color scheme,
clean white background, geometric minimal icons, Italian label spaces,
rich layout with multiple relationships visible, 12 visual elements,
modern Italian school textbook illustration style, no photos, vector-style, 1:1 square
```

---

### PROMPT 3 — CONTESTO (🔍 OSSERVA)

**Scopo:** Fotografia documentaristica che mostra l'esempio reale citato nella MC. Nessun testo sovrapposto — l'immagine deve parlare da sola.

**Template:**
```
Documentary editorial photograph: [SOGGETTO_ESEMPIO_REALE],
[SETTING_GEOGRAFICO_O_CONTESTUALE] setting, natural daylight,
showing [CONCETTO_MC] in practice in an authentic Italian everyday context,
suitable for [ANNO]th grade Italian students (age [ETA]),
high quality editorial magazine photography style,
no text overlays, no labels, [COMPLESSITA_VISIVA] scene,
photorealistic, 4:3 landscape
```

**Esempi concreti:**

*MC-MAT-1-02 — Ciclo di vita:*
```
Documentary editorial photograph: sorting line at an Italian textile recycling facility,
industrial setting with warm natural light through skylights,
showing circular economy in practice — workers sorting cotton garments into bins,
bales of recovered fabric visible in background, authentic Italian industrial context,
suitable for 6th grade Italian students age 11,
high quality editorial magazine photography style, no text overlays,
clean moderately detailed scene, photorealistic, 4:3 landscape
```

*MC-DIG-1-02 — Ricerca e valutazione delle fonti:*
```
Documentary editorial photograph: Italian middle school student at desk
comparing three different websites on laptop screen and smartphone simultaneously,
natural classroom daylight, notebook open with handwritten notes,
showing critical media literacy in practice, authentic Italian school context,
suitable for 6th grade students age 11-12,
high quality editorial photography style, no text overlays,
clean minimal scene, photorealistic, 4:3 landscape
```

*MC-ENE-3-01 — Fonti di energia:*
```
Documentary editorial photograph: rooftop solar panels on a typical Italian apartment building
in a Mediterranean city, golden hour lighting, technician in orange vest inspecting panels,
city skyline visible in background, showing renewable energy transition in Italian urban context,
suitable for 9th grade students age 14,
high quality editorial magazine photography style, no text overlays,
rich detailed scene with multiple elements, photorealistic, 4:3 landscape
```

---

### PROMPT 7 — PROFESSIONE DEL FUTURO (🔍 OSSERVA sidebar — OSSERVA)

**Scopo:** Illustrazione simbolica per la sidebar "Chi lavora con questa competenza nel 2030?". **Non un ritratto fotografico** — una composizione editoriale che visualizza gli strumenti, le competenze chiave e l'ambiente della professione come metafora visiva. Lo studente deve capire *cosa fa* quella professione guardando gli oggetti, non guardando una persona.

**Principio guida:** gli oggetti parlano meglio dei volti. Una composizione di attrezzi, dati, simboli e ambienti evoca la professione in modo più universale e inclusivo di un ritratto.

**Template:**
```
Flat editorial illustration: symbolic visual metaphor for '[TITOLO_PROFESSIONE]' profession in [ORIZZONTE],
NOT a portrait — visual composition of professional tools and symbols:
[COMPETENZE_CHIAVE come oggetti: es. "molecular models, material samples, LCA diagram"],
metaphorical scene: [DESCRIZIONE_BREVE_PROFESSIONE visualizzata come composizione],
objects arranged in an inspiring poster-like composition,
[PALETTE_AREA] color scheme ([HEX1] dominant, [HEX2] accent),
detailed flat design illustration style,
inspiring and forward-looking mood for Italian middle school students,
no human figures, no text, no labels,
3:4 vertical portrait format
```

**Variabili da sostituire:**
- `[TITOLO_PROFESSIONE]` → `professione_futura.titolo` dal JSON MC
- `[ORIZZONTE]` → `professione_futura.orizzonte` (es. "2030")
- `[COMPETENZE_CHIAVE]` → `professione_futura.competenze_chiave[]` tradotte in oggetti visivi
- `[DESCRIZIONE_BREVE]` → `professione_futura.descrizione_breve` riformulata come scena

**Traduzione competenze → oggetti visivi (esempi):**

| Competenza | Elemento visivo |
|---|---|
| analisi LCA | circular lifecycle diagram with arrows |
| economia circolare | circular arrows with recycling symbols |
| machine learning | neural network nodes with flowing data |
| logistica sostenibile | world map with green supply chain lines |
| fotovoltaico | solar panel array with energy flow |
| BIM modeling | 3D building wireframe exploded view |
| sicurezza alimentare | laboratory flasks with colorful food ingredients |
| pianificazione urbana | bird's eye city map with green areas |
| analisi ciclo di vita | product lifecycle timeline with icons |

**Esempi concreti:**

*MC-MAT-1-02 — Supply Chain Sustainability Manager:*
```
Flat editorial illustration: symbolic visual metaphor for 'Supply Chain Sustainability Manager' profession in 2030,
NOT a portrait — visual composition of professional tools and symbols:
circular lifecycle arrows, world map with green supply chain routes,
ESG report chart, carbon footprint calculator, factory with solar panels,
metaphorical scene: optimizing global material flows to minimize environmental impact,
objects arranged in an inspiring poster-like composition,
warm earthy terracotta (#C4622D) and sand (#F0DFC8) color scheme,
detailed flat design illustration style,
inspiring forward-looking mood for Italian middle school students,
no human figures, no text, no labels,
3:4 vertical portrait format
```

*MC-DIG-1-01 — IT Support Specialist / System Administrator:*
```
Flat editorial illustration: symbolic visual metaphor for 'IT Support Specialist' profession in 2030,
NOT a portrait — visual composition of professional tools and symbols:
server rack silhouette, network topology diagram, shield with lock (cybersecurity),
monitoring dashboard with green metrics, interconnected devices,
metaphorical scene: protecting and managing the digital infrastructure of an organization,
objects arranged in an inspiring poster-like composition,
electric green (#00C896) on dark background color scheme,
detailed flat design illustration style,
inspiring forward-looking mood for Italian middle school students,
no human figures, no text, no labels,
3:4 vertical portrait format
```

*MC-ENE-3-01 — Renewable Energy Engineer:*
```
Flat editorial illustration: symbolic visual metaphor for 'Renewable Energy Engineer' profession in 2030,
NOT a portrait — visual composition of professional tools and symbols:
solar panel array, wind turbine schematic, energy storage battery,
power grid diagram with renewable sources, efficiency percentage chart,
metaphorical scene: designing clean energy systems for a sustainable city,
objects arranged in an inspiring poster-like composition,
energetic yellow (#FFD600) on anthracite (#2D2D2D) color scheme,
detailed flat design illustration style,
inspiring forward-looking mood for Italian middle school students,
no human figures, no text, no labels,
3:4 vertical portrait format
```

---

## Naming convention output

```
04_CONTENUTI/visual/[MC-ID]/
    [MC-ID]_img1-innesca.png       ← ⚡ INNESCA   — illustrazione evocativa oggetto reale
    [MC-ID]_img2-esplora.png       ← 📖 ESPLORA   — concetto principale illustrato
    [MC-ID]_img3-osserva.png       ← 🔍 OSSERVA   — caso studio documentaristico
    [MC-ID]_img4-sperimenta.png    ← 🔬 SPERIMENTA — attività pratica studenti
    [MC-ID]_img5-infografica.png   ← 📖 ESPLORA   — infografica densa di dati
    [MC-ID]_img6-mappa.png         ← Trasversale  — mappa concettuale
    [MC-ID]_img7-professione.png   ← 🔍 OSSERVA   — illustrazione simbolica professione 2030
    [MC-ID]_image-prompts.json     ← Prompt usati (per audit CARBLE-CDD e rigenerazione)
```

---

## Integrazione Higgsfield

### MCP Server (raccomandato in Cowork mode)
Higgsfield espone un MCP server che consente all'agente di generare immagini direttamente:

```
MCP Server URL: https://mcp.higgsfield.ai
Autenticazione: account Higgsfield (no API key manuale)
Crediti: stesso sistema della piattaforma
```

**Modelli raccomandati per progetto TecnologIA:**  
*(nomi verificati con `higgsfield model list`)*

| Immagine | Model ID | Nome | Motivo |
|----------|----------|------|--------|
| IMG 1 — SOGGETTO | `cinematic_studio_2_5` | Cinematic Studio 2.5 | Qualità fotografica cinematica |
| IMG 2 — INFOGRAFICA | `gpt_image_2` | GPT Image 2 | Eccellente per flat design e infografiche |
| IMG 3 — CONTESTO | `cinematic_studio_2_5` | Cinematic Studio 2.5 | Fotorealismo documentaristico |
| IMG 4 — PROFESSIONE | `text2image_soul_v2` | Higgsfield Soul V2 | Ritratti naturali e realistici |

**Altri modelli disponibili per test:**
- `seedream_v4_5` — Seedream 4.5 (stile illustrativo)
- `nano_banana_2` — Nano Banana Pro (veloce, buona qualità)
- `soul_cinematic` — Soul Cinematic (mix fotorealistico/artistico)
- `imagegen_2_0` — GPT Image 2 (alias alternativo)

### API HTTP (per batch generation autonoma)
Vedi script `generate_images.py` nella stessa cartella.

---

## Checklist qualità pre-pubblicazione

Prima di approvare un'immagine generata, verifica:

- [ ] Il soggetto corrisponde all'oggetto reale specifico della MC (non generico)
- [ ] I colori rispecchiano la palette dell'area tematica
- [ ] Nessun testo illeggibile o distorto nell'immagine
- [ ] Nessun logo o brand riconoscibile
- [ ] L'immagine è appropriata per studenti 11-14 anni
- [ ] La rappresentazione è inclusiva (nessun stereotipo visibile)
- [ ] Il formato/aspect ratio è corretto per la zona di destinazione
- [ ] Il file è salvato nella cartella `04_CONTENUTI/visual/[MC-ID]/` con naming corretto

---

*Ultima modifica: 2026-05-10*
