# Prompt slide deck NotebookLM — MC-MAT-1-02

**MC:** Ciclo di vita dei materiali e cicli tecnologici
**Area:** 🪨 Materiali e Rifiuti · Classe 1ª · Palette #6D4C41 / #EFEBE9
**Fonte da caricare nel notebook:** `08_TESTI/classe_1/MAT/MC-MAT-1-02_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-MAT-1-02_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 1ª, sulla micro-competenza «Ciclo di vita dei materiali e cicli tecnologici» (MC-MAT-1-02).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-MAT-1-02.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (13 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Un oggetto non nasce sullo scaffale del negozio»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Un oggetto non nasce sullo scaffale del negozio» — un solo concetto, UN esempio concreto · callout suggeriti: ciclo di vita / life cycle
3. «Le sette fasi del ciclo tecnologico» — slide introduttiva: quadro d'insieme · callout suggeriti: ciclo tecnologico
4. «Fase 1 — Estrazione delle materie prime» — un solo concetto, UN esempio concreto · callout suggeriti: estrazione / tenore del minerale
5. «Fase 2 — Lavorazione e trasformazione» — un solo concetto, UN esempio concreto · callout suggeriti: trasformata / altoforno / riciclo
6. «Fase 3 — Produzione del bene» — un solo concetto, UN esempio concreto · callout suggeriti: produzione / catena di fornitura / supply chain
7. «Fase 4 — Logistica e distribuzione» — un solo concetto, UN esempio concreto · callout suggeriti: logistica / filiera corta / 40.000 km
8. «Fase 5 — Uso» — un solo concetto, UN esempio concreto · callout suggeriti: uso / durata
9. «Fase 6 — Fine vita: le strade che un oggetto può prendere» — un solo concetto, UN esempio concreto · callout suggeriti: fine vita / Discarica / Riciclo
10. «Fase 7 — Recupero e chiusura del ciclo» — un solo concetto, UN esempio concreto · callout suggeriti: economia circolare
11. «La catena del valore: chi è responsabile di cosa?» — un solo concetto, UN esempio concreto · callout suggeriti: attori / catena del valore / value chain
12. «Dalla culla alla tomba, e oltre» — un solo concetto, UN esempio concreto · callout suggeriti: Dalla culla alla tomba / Dalla culla alla culla / Cradle to Cradle Certified
13. SINTESI — 3 box "da ricordare" (solo contenuti ESPLORA) + una domanda aperta finale

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
- Soggetti dell'area: raw material samples (mineral chunks, natural fiber coils, wooden planks, metal ingots, plastic pellets), recycling bins and sorting facilities, workshop benches with sorted material trays.
- Persone (quando presenti): middle-school students examining material samples, factory and recycling-plant workers; contesto scolastico italiano, studenti 11-14 anni.
- Box testuali semi-trasparenti effetto vetro satinato, angoli arrotondati, ombre leggere, testo sans serif moderno in grigio scuro.
- Frecce, linee di quota, callout tecnici, cornici sottili e piccoli elementi HUD in ciano e arancione.
- Palette: tonalità naturali del soggetto, crema, grigio chiaro, ciano tecnico e ambra; accento d'area #6D4C41 per titoli e chip.
- Composizione pulita ma ricca; color grading coerente su tutto il deck: le slide devono sembrare un unico prodotto editoriale.
- Nessuna frase lunga renderizzata dentro l'immagine; eventuali etichette in-image in italiano, max 3 parole. MAI testo in inglese dentro le immagini.
```

## Generazione via CLI (alternativa)

```bash
notebooklm create "TecnologIA — MC-MAT-1-02"
notebooklm source add "08_TESTI/classe_1/MAT/MC-MAT-1-02_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-MAT-1-02_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-MAT-1-02_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
