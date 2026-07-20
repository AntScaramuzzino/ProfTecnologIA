# Prompt slide deck NotebookLM — MC-ALI-2-06

**MC:** Cibo, cultura e biodiversità
**Area:** 🌾 Alimentazione · Classe 2ª · Palette #558B2F / #F1F8E9
**Fonte da caricare nel notebook:** `08_TESTI/classe_2/ALI/MC-ALI-2-06_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-ALI-2-06_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 2ª, sulla micro-competenza «Cibo, cultura e biodiversità» (MC-ALI-2-06).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-ALI-2-06.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (8 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «La tecnologia al servizio del cibo: non è una novità»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «La tecnologia al servizio del cibo: non è una novità» — un solo concetto, UN esempio concreto · callout suggeriti: fermentazione / pastorizzazione / inscatolamento
3. «Tecnologia 1: Agricoltura di precisione» — un solo concetto, UN esempio concreto · callout suggeriti: agricoltura tradizionale / agricoltura di precisione / Sensori nel suolo
4. «Tecnologia 2: Vertical farming e agricoltura indoor» — un solo concetto, UN esempio concreto · callout suggeriti: vertical farming
5. «Tecnologia 3: La fermentazione moderna — da vecchia tecnica a biotecnologia avanzata» — un solo concetto, UN esempio concreto · callout suggeriti: fermentazione moderna / Proteine vegetali fermentate / Enzimi per la produzione alimentare
6. «Tecnologia 4: La carne coltivata (cell-cultivated meat)» — un solo concetto, UN esempio concreto · callout suggeriti: Stato attuale / L'impatto potenziale
7. «Tecnologia 5: Insetti come fonte proteica» — un solo concetto, UN esempio concreto · callout suggeriti: Perché gli insetti? / Stato attuale in Europa / Barriera culturale
8. SINTESI — 3 box "da ricordare" (solo contenuti ESPLORA) + una domanda aperta finale

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
- Soggetti dell'area: fresh vegetables on wooden cutting boards, food labels being read in a supermarket, school canteen trays, cold-chain trucks and fridges, wheat fields and food factories.
- Persone (quando presenti): a young person reading a nutritional label, farmers and food technologists at work; contesto scolastico italiano, studenti 11-14 anni.
- Box testuali semi-trasparenti effetto vetro satinato, angoli arrotondati, ombre leggere, testo sans serif moderno in grigio scuro.
- Frecce, linee di quota, callout tecnici, cornici sottili e piccoli elementi HUD in ciano e arancione.
- Palette: tonalità naturali del soggetto, crema, grigio chiaro, ciano tecnico e ambra; accento d'area #558B2F per titoli e chip.
- Composizione pulita ma ricca; color grading coerente su tutto il deck: le slide devono sembrare un unico prodotto editoriale.
- Nessuna frase lunga renderizzata dentro l'immagine; eventuali etichette in-image in italiano, max 3 parole. MAI testo in inglese dentro le immagini.
```

## Generazione via CLI (alternativa)

```bash
notebooklm create "TecnologIA — MC-ALI-2-06"
notebooklm source add "08_TESTI/classe_2/ALI/MC-ALI-2-06_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-ALI-2-06_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-ALI-2-06_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
