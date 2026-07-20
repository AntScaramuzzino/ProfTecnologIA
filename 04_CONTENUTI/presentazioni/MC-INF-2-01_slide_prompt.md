# Prompt slide deck NotebookLM — MC-INF-2-01

**MC:** Il sistema operativo: chi gestisce le risorse del computer
**Area:** 🖥️ Informatica · Classe 2ª · Palette #0277BD / #E1F5FE
**Fonte da caricare nel notebook:** `08_TESTI/classe_2/INF/MC-INF-2-01_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-INF-2-01_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 2ª, sulla micro-competenza «Il sistema operativo: chi gestisce le risorse del computer» (MC-INF-2-01).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-INF-2-01.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (6 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Senza sistema operativo, il computer è un blocco di silicio inutile»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Senza sistema operativo, il computer è un blocco di silicio inutile» — un solo concetto, UN esempio concreto · callout suggeriti: sistema operativo
3. «Le funzioni principali del sistema operativo» — un solo concetto, UN esempio concreto · callout suggeriti: 1. Gestione dei processi / processo / multitasking
4. «I sistemi operativi più diffusi» — un solo concetto, UN esempio concreto
5. «Interfaccia grafica vs. riga di comando» — un solo concetto, UN esempio concreto
6. SINTESI — 3 box "da ricordare" (solo contenuti ESPLORA) + una domanda aperta finale

LAYOUT DI OGNI SLIDE
1. Titolo forte in alto o in un box laterale (max 6 parole).
2. Sottotitolo esplicativo breve.
3. Immagine/render principale a pieno schermo.
4. 2-4 callout collegati alle parti dell'immagine (parti dai "callout suggeriti" della slide).
5. Frecce o linee tecniche ciano/arancio.
6. Una frase chiave finale o "risultato" (max 15 parole).
- Una sola idea per slide; tutto il testo in italiano.
- Nei callout/HUD usa i numeri e i dati REALI presenti in ESPLORA (percentuali, km, kWh, litri…): mai inventarli.

STILE VISIVO — infografica tecnico-fotorealistica (16:9)
- Grande render realistico del materiale/oggetto come elemento centrale, texture molto dettagliate, luce naturale morbida. NO cartoon, NO flat illustration.
- Soggetti dell'area: school computer labs, code editors and folder hierarchies on screens, server racks with blinking lights, close-ups of keyboards and cables.
- Persone (quando presenti): a student typing at a school laptop, an IT technician in a server room; contesto scolastico italiano, studenti 11-14 anni.
- Box testuali semi-trasparenti effetto vetro satinato, angoli arrotondati, ombre leggere, testo sans serif moderno in grigio scuro.
- Frecce, linee di quota, callout tecnici, cornici sottili e piccoli elementi HUD in ciano e arancione.
- Palette: tonalità naturali del soggetto, crema, grigio chiaro, ciano tecnico e ambra; accento d'area #0277BD per titoli e chip.
- Composizione pulita ma ricca; color grading coerente su tutto il deck: le slide devono sembrare un unico prodotto editoriale.
- Nessuna frase lunga renderizzata dentro l'immagine; eventuali etichette in-image in italiano, max 3 parole. MAI testo in inglese dentro le immagini.
```

## Generazione via CLI (alternativa)

```bash
notebooklm create "TecnologIA — MC-INF-2-01"
notebooklm source add "08_TESTI/classe_2/INF/MC-INF-2-01_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-INF-2-01_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-INF-2-01_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
