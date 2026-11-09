# Immagini e infografiche del libro — report di controllo (v1.1)

9 novembre 2026 · 58 micro-competenze · Controllo fatto sul sito costruito dal repository aggiornato: tutte le zone di ogni pagina MC aperte una per una, immagini raccolte dal DOM, confronto dei file byte per byte e per somiglianza visiva (hash percettivo). Le sezioni 1-6 descrivono la situazione prima delle correzioni; la sezione «Correzioni applicate» dice che cosa è stato sistemato.

## In sintesi

- **Duplicati dovuti al codice (in tutte le 58 MC).** La «Galleria visuale» di ESPLORA ripete la copertina della pagina, le immagini dei paragrafi già mostrate nel testo e le immagini della professione già mostrate in PROFESSIONI.
- **Stessa immagine in due formati** (.svg e .webp, entrambi in galleria): **58 MC**.
- **Più versioni della stessa infografica in OSSERVA:** **3 MC** (MC-ALI-2-02, MC-DIS-3-02, MC-ENE-3-05).
- **La stessa foto usata per MC diverse:** 44 file in 13 gruppi. Il caso più grave: **una sola foto generica (ragazzo al portatile) fa da immagine di contesto in 17 MC** di Digitale, Disegno ed Energia.
- **Infografica del processo mancante in OSSERVA: 33 MC su 58.** In 32 di queste non c'è nessuna infografica fra i file.
- **Immagine del compito di realtà mancante in AGISCI:** 6 MC (MC-INF-1-01, MC-INF-1-02, MC-INF-2-01, MC-INF-2-02, MC-INF-3-01, MC-INF-3-02).

## Correzioni applicate il 9 novembre 2026 (v1.1)

Verificate rifacendo lo stesso controllo su tutte le 58 MC dopo le modifiche.

| Problema | Correzione | Esito del nuovo controllo |
|---|---|---|
| Copertina ripetuta nella Galleria visuale | La galleria esclude la copertina | 0 casi (prima 58) |
| Immagini dei paragrafi ripetute in galleria | In galleria vanno solo le immagini non già mostrate nel testo | 0 casi |
| Immagini della professione in galleria | Restano solo nella scheda PROFESSIONI | 0 casi (prima 58 MC) |
| Stesso schema in .svg e .webp | Un solo formato per immagine (WebP, poi PNG/JPG, poi SVG) | 0 casi (prima 58 MC) |
| Più versioni dell'infografica in OSSERVA | Si mostra solo la versione più recente (v2 su v1, raster su SVG) | 0 casi (prima 3) |
| Foto segnaposto identiche in più MC (17 + 3 + 2 + 2) e copertina = contesto in MC-DIG-1-03 | Al momento della build il sito confronta i file: una foto identica a quella di un'altra MC, o a un'altra della stessa MC, non viene mostrata (la copertina resta) | 0 foto identiche fra MC diverse sulle pagine |
| MC-MAT-1-01: infografica nella galleria | Ogni infografica va in OSSERVA | ora in OSSERVA |
| File doppi con lo spazio nel nome (DIS-1-01, MAT-1-04, MAT-1-06) | Rimossi (restano nella storia del repository) | — |

Il pannello «Materiali» di INNESCA ora conta l'infografica di OSSERVA e la galleria senza ripetizioni.

**Precisazione sulle immagini della professione.** Le immagini `img4-professione` identiche fra due MC sono quasi sempre la **stessa professione** presente in entrambe (es. *Vertical Farmer* in ALI-2-02 e ALI-2-04, *Predictive Maintenance Analyst* in ENE-3-01, ENE-3-04, MAT-1-05, SIS-3-04): il riuso è corretto e resta. Sono invece **da verificare** tre casi in cui la stessa immagine illustra professioni diverse: MAT-1-03 (*Waste Blockchain Auditor*) = MAT-1-04 (*Decarbonization Consultant*); MAT-1-04 (*Carbon Footprint Analyst*) = MAT-1-06 (*Textile Designer*); DIS-1-01 (*Product Designer*) = MAT-1-06 (*Fashion and Textile Designer*).

### Che cosa resta da produrre (contenuti, non codice)
- **Infografica del processo in OSSERVA: 32 MC** (elenco nella sezione 4, esclusa MC-MAT-1-01).
- **Immagini di contesto:** le 20 MC che usavano una foto segnaposto ora non la mostrano; se si vuole una seconda foto in galleria va generata sul tema della MC.
- **Area INF:** immagine del compito di realtà (6 MC) e seconda immagine della professione (6 MC).
- Le tre immagini della professione da verificare qui sopra.

## 1. Duplicati dovuti al codice — valgono per tutte le MC

| Dove li vedi | Che cosa succede | Causa nel codice |
|---|---|---|
| Galleria visuale (ESPLORA) | La prima immagine della galleria è la copertina già in cima alla pagina (58 MC) | La galleria prende tutti i file di `public/assets/visual/<MC>/` tranne sketchnote, compito e infografiche di processo: la copertina non è esclusa |
| Galleria visuale (ESPLORA) | Le immagini dei paragrafi compaiono due volte: dentro il paragrafo e di nuovo in galleria (58 MC) | `galleriaConEsplora` aggiunge in coda tutte le immagini del manifest ESPLORA |
| Galleria visuale (ESPLORA) e PROFESSIONI | Le immagini `img4-professione` sono sia in galleria sia nella scheda PROFESSIONI (58 MC) | Le immagini della professione non sono escluse dalla galleria |
| Galleria visuale (ESPLORA) | `immagine_da_md.svg` e `immagine_da_md.webp` (stesso schema) uno dopo l'altro | La regola «preferisci WebP» scarta solo il PNG, non l'SVG con lo stesso nome |
| OSSERVA | Tutte le infografiche di processo trovate sono mostrate una sotto l'altra, anche se sono versioni dello stesso disegno | Nessuna scelta della versione più recente |

**Correzione proposta (codice, una volta per tutte):** escludere dalla galleria la copertina, le immagini dei paragrafi già nel testo e quelle della professione; per lo stesso nome scegliere un solo formato (WebP, poi SVG); in OSSERVA mostrare solo la versione più recente dell'infografica (v2 > v1, con le altre in archivio).

## 2. Il caso MC-ALI-2-02 (Conservazione degli alimenti)

- **ESPLORA, Galleria visuale:** copertina (già in alto) · `soggetto_latte_centrale` · `ai-contesto` (**identica** a quella di MC-ALI-2-01 e alla copertina di MC-SIS-3-04) · `immagine_da_md` in .svg **e** .webp · due immagini della professione (già in PROFESSIONI) · mappa mentale · 5 immagini dei paragrafi (già nel testo).
- **OSSERVA:** tre versioni della stessa infografica sul latte, una sotto l'altra: `infografica_latte_playground_v1`, `infografica_latte_playground_v2`, `infografica_lavorazione-latte.svg`.
- File non usati: `ripassa-sketchnote.svg` e `.webp` (RIPASSA mostra solo la versione «densa»).

## 3. Stessa immagine in MC diverse (file identici)

- **17 MC:** MC-DIG-2-01_ai-contesto.webp, MC-DIG-2-02_ai-contesto.webp, MC-DIG-2-03_ai-contesto.webp, MC-DIG-2-04_ai-contesto.webp, MC-DIG-3-01_ai-contesto.webp, MC-DIG-3-02_ai-contesto.webp, MC-DIG-3-03_ai-contesto.webp, MC-DIG-3-04_ai-contesto.webp, MC-DIS-1-01_ai-contesto.webp, MC-DIS-1-02_ai-contesto.webp, MC-DIS-2-01_ai-contesto.webp, MC-DIS-2-02_ai-contesto.webp, MC-DIS-3-01_ai-contesto.webp, MC-DIS-3-02_ai-contesto.webp, MC-ENE-3-01_ai-contesto.webp, MC-ENE-3-02_ai-contesto.webp, MC-ENE-3-03_ai-contesto.webp
- **4 MC:** MC-ENE-3-01_img4-professione-2.webp, MC-ENE-3-04_img4-professione-2.webp, MC-MAT-1-05_img4-professione-2.webp, MC-SIS-3-04_img4-professione-2.webp
- **3 MC:** MC-ALI-2-01_ai-contesto.webp, MC-ALI-2-02_ai-contesto.webp, MC-SIS-3-04_ai-fotorealistica.webp
- **2 MC:** MC-ALI-2-02_img4-professione-2.webp, MC-ALI-2-04_img4-professione-2.webp
- **2 MC:** MC-AMB-2-02_img4-professione-2.webp, MC-MAT-1-02_img4-professione-2.webp
- **2 MC:** MC-AMB-2-04_img4-professione-2.webp, MC-ENE-3-06_img4-professione-2.webp
- **2 MC:** MC-COM-3-04_ai-contesto.webp, MC-COM-3-05_ai-contesto.webp
- **2 MC:** MC-DIG-1-01_ai-contesto.webp, MC-DIG-1-02_ai-contesto.webp
- **2 MC:** MC-DIG-1-02_img4-professione-2.webp, MC-DIG-2-03_img4-professione-2.webp
- **2 MC:** MC-DIS-1-01_img4-professione-2.webp, MC-MAT-1-06_img4-professione.webp
- **2 MC:** MC-ENE-3-02_img4-professione-2.webp, MC-ENE-3-05_img4-professione-2.webp
- **2 MC:** MC-MAT-1-03_img4-professione.webp, MC-MAT-1-04_img4-professione-2.webp
- **2 MC:** MC-MAT-1-04_img4-professione.webp, MC-MAT-1-06_img4-professione-2.webp

Le immagini `ai-contesto` e `img4-professione-2` sono state evidentemente riusate come segnaposto: vanno rigenerate sul tema di ogni MC o tolte.

## 4. Infografiche mancanti

**Senza infografica del processo in OSSERVA (33):** MC-ALI-2-03, MC-ALI-2-06, MC-AMB-2-03, MC-AMB-2-04, MC-AMB-2-05, MC-COM-3-02, MC-COM-3-03, MC-COM-3-05, MC-DIG-1-01, MC-DIG-1-02, MC-DIG-1-03, MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-05, MC-DIG-3-02, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-ENE-3-01, MC-ENE-3-04, MC-INF-1-01, MC-INF-1-02, MC-INF-2-01, MC-INF-2-02, MC-INF-3-01, MC-INF-3-02, MC-MAT-1-01, MC-MAT-1-03, MC-MAT-1-05, MC-SIS-3-02.

Di queste, **senza nessuna infografica fra i file (32):** MC-ALI-2-03, MC-ALI-2-06, MC-AMB-2-03, MC-AMB-2-04, MC-AMB-2-05, MC-COM-3-02, MC-COM-3-03, MC-COM-3-05, MC-DIG-1-01, MC-DIG-1-02, MC-DIG-1-03, MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-05, MC-DIG-3-02, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-ENE-3-01, MC-ENE-3-04, MC-INF-1-01, MC-INF-1-02, MC-INF-2-01, MC-INF-2-02, MC-INF-3-01, MC-INF-3-02, MC-MAT-1-03, MC-MAT-1-05, MC-SIS-3-02.

MC-MAT-1-01 ha un'infografica (`img2-infografica`) che il codice non riconosce come «di processo» e finisce nella galleria di ESPLORA invece che in OSSERVA.

## 5. Altre anomalie

- **MC-DIS-1-01:** file doppio con uno spazio nel nome (img4-professione 2.webp ≈ img4-professione-2.webp (distanza 0)).
- **MC-MAT-1-04:** file doppio con uno spazio nel nome (img4-professione 2.webp ≈ img4-professione-2.webp (distanza 0)).
- **MC-MAT-1-06:** file doppio con uno spazio nel nome (img4-professione 2.webp ≈ img4-professione-2.webp (distanza 0)).
- **MC-DIG-1-03:** copertina e immagine di contesto sono lo stesso file (ai-fotorealistica.webp = ai-contesto.webp).
- **Area INF (6 MC):** la scheda PROFESSIONI cerca `img4-professione-2.webp`, che non esiste; il riquadro si nasconde da solo, ma la seconda immagine manca.

## 6. Situazione per MC

| MC | Infografica OSSERVA | Formati doppi in galleria | Foto condivise con altre MC | Note |
|---|---|---|---|---|
| MC-ALI-2-01 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-ALI-2-02, MC-SIS-3-04 | — |
| MC-ALI-2-02 | infografica_latte_playground_v1.webp, infografica_latte_playground_v2.webp, infografica_lavorazione-latte.svg ⚠️ più versioni | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-ALI-2-01, MC-SIS-3-04; img4-professione-2.webp identica a MC-ALI-2-04 | — |
| MC-ALI-2-03 | **manca** | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-ALI-2-04 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | img4-professione-2.webp identica a MC-ALI-2-02 | — |
| MC-ALI-2-05 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-ALI-2-06 | **manca** | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-AMB-2-01 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-AMB-2-02 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | img4-professione-2.webp identica a MC-MAT-1-02 | — |
| MC-AMB-2-03 | **manca** | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-AMB-2-04 | **manca** | immagine_da_md.svg, immagine_da_md.webp | img4-professione-2.webp identica a MC-ENE-3-06 | — |
| MC-AMB-2-05 | **manca** | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-AMB-2-06 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-COM-3-01 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-COM-3-02 | **manca** | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-COM-3-03 | **manca** | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-COM-3-04 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-COM-3-05 | — |
| MC-COM-3-05 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-COM-3-04 | — |
| MC-COM-3-06 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-DIG-1-01 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-1-02 | — |
| MC-DIG-1-02 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-1-01; img4-professione-2.webp identica a MC-DIG-2-03 | — |
| MC-DIG-1-03 | **manca** | immagine_da_md.svg, immagine_da_md.webp; mindmap.svg, mindmap.webp | — | copertina = contesto |
| MC-DIG-2-01 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-DIG-2-02 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-DIG-2-03 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03; img4-professione-2.webp identica a MC-DIG-1-02 | — |
| MC-DIG-2-04 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-DIG-2-05 | **manca** | mindmap.svg, mindmap.webp; immagine_da_md.jpg, immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-DIG-3-01 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-DIG-3-02 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-DIG-3-03 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-DIG-3-04 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-DIS-1-01 | **manca** | immagine_da_md.svg, immagine_da_md.webp; esplora-img01_svg.svg, esplora-img01_svg.webp; esplora-img04_svg.svg, esplora-img04_svg.webp; esplora-img03_svg.svg, esplora-img03_svg.webp; esplora-img02_svg.svg, esplora-img02_svg.webp; esplora-img05_svg.svg, esplora-img05_svg.webp; esplora-img06_svg.svg, esplora-img06_svg.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03; img4-professione-2.webp identica a MC-MAT-1-06 | file con spazio nel nome |
| MC-DIS-1-02 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-DIS-2-01 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-DIS-2-02 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-DIS-3-01 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-DIS-3-02 | infografica_processo_playground_v1.webp, infografica_processo_playground_v2.webp ⚠️ più versioni | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-ENE-3-01, MC-ENE-3-02, MC-ENE-3-03 | — |
| MC-ENE-3-01 | **manca** | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-02, MC-ENE-3-03; img4-professione-2.webp identica a MC-ENE-3-04, MC-MAT-1-05, MC-SIS-3-04 | — |
| MC-ENE-3-02 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-03; img4-professione-2.webp identica a MC-ENE-3-05 | — |
| MC-ENE-3-03 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | ai-contesto.webp identica a MC-DIG-2-01, MC-DIG-2-02, MC-DIG-2-03, MC-DIG-2-04, MC-DIG-3-01, MC-DIG-3-02, MC-DIG-3-03, MC-DIG-3-04, MC-DIS-1-01, MC-DIS-1-02, MC-DIS-2-01, MC-DIS-2-02, MC-DIS-3-01, MC-DIS-3-02, MC-ENE-3-01, MC-ENE-3-02 | — |
| MC-ENE-3-04 | **manca** | immagine_da_md.svg, immagine_da_md.webp | img4-professione-2.webp identica a MC-ENE-3-01, MC-MAT-1-05, MC-SIS-3-04 | — |
| MC-ENE-3-05 | infografica_processo_playground_v1.webp, infografica_processo_playground_v2.webp ⚠️ più versioni | immagine_da_md.svg, immagine_da_md.webp | img4-professione-2.webp identica a MC-ENE-3-02 | — |
| MC-ENE-3-06 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | img4-professione-2.webp identica a MC-AMB-2-04 | — |
| MC-INF-1-01 | **manca** | immagine_da_md.svg, immagine_da_md.webp; mindmap.svg, mindmap.webp | — | manca immagine compito; manca professione-2 |
| MC-INF-1-02 | **manca** | immagine_da_md.svg, immagine_da_md.webp; mindmap.svg, mindmap.webp | — | manca immagine compito; manca professione-2 |
| MC-INF-2-01 | **manca** | immagine_da_md.svg, immagine_da_md.webp; mindmap.svg, mindmap.webp | — | manca immagine compito; manca professione-2 |
| MC-INF-2-02 | **manca** | immagine_da_md.svg, immagine_da_md.webp; mindmap.svg, mindmap.webp | — | manca immagine compito; manca professione-2 |
| MC-INF-3-01 | **manca** | mindmap.svg, mindmap.webp; immagine_da_md.svg, immagine_da_md.webp | — | manca immagine compito; manca professione-2 |
| MC-INF-3-02 | **manca** | immagine_da_md.svg, immagine_da_md.webp; mindmap.svg, mindmap.webp | — | manca immagine compito; manca professione-2 |
| MC-MAT-1-01 | **manca** | ripassa-pilota.svg, ripassa-pilota.webp; immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-MAT-1-02 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | img4-professione-2.webp identica a MC-AMB-2-02 | — |
| MC-MAT-1-03 | **manca** | immagine_da_md.svg, immagine_da_md.webp | img4-professione.webp identica a MC-MAT-1-04 | — |
| MC-MAT-1-04 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | img4-professione-2.webp identica a MC-MAT-1-03; img4-professione.webp identica a MC-MAT-1-06 | file con spazio nel nome |
| MC-MAT-1-05 | **manca** | immagine_da_md.svg, immagine_da_md.webp | img4-professione-2.webp identica a MC-ENE-3-01, MC-ENE-3-04, MC-SIS-3-04 | — |
| MC-MAT-1-06 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | img4-professione.webp identica a MC-DIS-1-01; img4-professione-2.webp identica a MC-MAT-1-04 | file con spazio nel nome |
| MC-SIS-3-01 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-SIS-3-02 | **manca** | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-SIS-3-03 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | — | — |
| MC-SIS-3-04 | infografica_processo_playground_v1.webp | immagine_da_md.svg, immagine_da_md.webp | img4-professione-2.webp identica a MC-ENE-3-01, MC-ENE-3-04, MC-MAT-1-05; ai-fotorealistica.webp identica a MC-ALI-2-01, MC-ALI-2-02 | — |

## Metodo

Sito costruito in locale dall'ultima versione di `main`; per ogni MC sono state aperte tutte le zone (con i paragrafi espansi) e raccolte le immagini mostrate. I file sono stati confrontati con MD5 (identici) e con hash percettivi pHash/dHash (quasi uguali, soglia 10 su 64 bit; gli schemi SVG chiari danno falsi positivi e sono stati esclusi dal report). Le miniature del carosello e le anteprime dei video YouTube non sono contate come duplicati.
