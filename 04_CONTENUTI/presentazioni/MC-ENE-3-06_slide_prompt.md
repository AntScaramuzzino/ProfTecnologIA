# Prompt slide deck NotebookLM — MC-ENE-3-06

**MC:** Accumulo energetico e smart grid
**Area:** ⚡ Energia e Macchine · Classe 3ª · Palette #E65100 / #FFF3E0
**Fonte da caricare nel notebook:** `08_TESTI/classe_3/ENE/MC-ENE-3-06_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-ENE-3-06_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 3ª, sulla micro-competenza «Accumulo energetico e smart grid» (MC-ENE-3-06).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-ENE-3-06.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (8 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Il problema dell'intermittenza: la risorsa che non si controlla»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Il problema dell'intermittenza: la risorsa che non si controlla» — un solo concetto, UN esempio concreto · callout suggeriti: accumulo energetico
3. «Le batterie agli ioni di litio: come funzionano davvero» — un solo concetto, UN esempio concreto · callout suggeriti: celle agli ioni di litio / cella elettrochimica / Dove si trova il litio?
4. «Batterie a flusso (flow batteries): per impianti grandi» — un solo concetto, UN esempio concreto · callout suggeriti: batterie a flusso vanadio-redox
5. «Accumulo con idrogeno verde: la soluzione stagionale» — un solo concetto, UN esempio concreto · callout suggeriti: elettrolisi dell'acqua / idrogeno verde / cella a combustibile (fuel cell
6. «Accumulo pompato: il gigante invisibile» — un solo concetto, UN esempio concreto · callout suggeriti: acqua / pumped-storage hydropower / energia potenziale gravitazionale
7. «Volani e supercondensatori: l'accumulo dei millisecondi» — un solo concetto, UN esempio concreto · callout suggeriti: Volani (flywheel / Supercondensatori (ultracapacitors
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
- Soggetti dell'area: levers, pulleys and meshing gears on workshop benches, photovoltaic panels and wind turbines, battery cells, power lines at sunset, engine rooms.
- Persone (quando presenti): an engineer in a hard hat inspecting machinery, students experimenting with simple machines; contesto scolastico italiano, studenti 11-14 anni.
- Box testuali semi-trasparenti effetto vetro satinato, angoli arrotondati, ombre leggere, testo sans serif moderno in grigio scuro.
- Frecce, linee di quota, callout tecnici, cornici sottili e piccoli elementi HUD in ciano e arancione.
- Palette: tonalità naturali del soggetto, crema, grigio chiaro, ciano tecnico e ambra; accento d'area #E65100 per titoli e chip.
- Composizione pulita ma ricca; color grading coerente su tutto il deck: le slide devono sembrare un unico prodotto editoriale.
- Nessuna frase lunga renderizzata dentro l'immagine; eventuali etichette in-image in italiano, max 3 parole. MAI testo in inglese dentro le immagini.
```

## Generazione via CLI (alternativa)

```bash
notebooklm create "TecnologIA — MC-ENE-3-06"
notebooklm source add "08_TESTI/classe_3/ENE/MC-ENE-3-06_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-ENE-3-06_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-ENE-3-06_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
