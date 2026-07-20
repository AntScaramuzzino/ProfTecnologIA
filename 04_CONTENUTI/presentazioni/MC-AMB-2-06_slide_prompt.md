# Prompt slide deck NotebookLM — MC-AMB-2-06

**MC:** Rischio idrogeologico e prevenzione
**Area:** 🏗️ Abitazione · Città · Territorio · Classe 2ª · Palette #00695C / #E0F2F1
**Fonte da caricare nel notebook:** `08_TESTI/classe_2/AMB/MC-AMB-2-06_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-AMB-2-06_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 2ª, sulla micro-competenza «Rischio idrogeologico e prevenzione» (MC-AMB-2-06).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-AMB-2-06.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (8 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Una smart city non è un videogioco»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Una smart city non è un videogioco» — un solo concetto, UN esempio concreto · callout suggeriti: scelta urbanistica e politica
3. «I sensori urbani: cosa misurano e perché» — un solo concetto, UN esempio concreto · callout suggeriti: Sensori per il traffico / Spire induttive / Telecamere con computer vision
4. «Gli open data urbani: i dati che le città pubblicano» — un solo concetto, UN esempio concreto · callout suggeriti: trasparenza dei dati / open data / Comune di Milano
5. «La partecipazione civica digitale: segnalare e decidere» — un solo concetto, UN esempio concreto · callout suggeriti: partecipazione civica digitale / App per segnalare problemi / 6 milioni
6. «La mobilità condivisa: dati e impatto reale» — un solo concetto, UN esempio concreto · callout suggeriti: Positivi / Negativi
7. «"Smartness" non è solo tecnologia: la lezione di Copenhagen» — un solo concetto, UN esempio concreto · callout suggeriti: 33% degli spostamenti quotidiani / 390 km / 20 km
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
- Soggetti dell'area: house construction sites and wall insulation layers, green roofs with vegetation, solar panels on tilted roofs, neighborhood streets with low buildings and trees, architectural scale models.
- Persone (quando presenti): an architect with a scale model, construction workers, students on an urban field trip; contesto scolastico italiano, studenti 11-14 anni.
- Box testuali semi-trasparenti effetto vetro satinato, angoli arrotondati, ombre leggere, testo sans serif moderno in grigio scuro.
- Frecce, linee di quota, callout tecnici, cornici sottili e piccoli elementi HUD in ciano e arancione.
- Palette: tonalità naturali del soggetto, crema, grigio chiaro, ciano tecnico e ambra; accento d'area #00695C per titoli e chip.
- Composizione pulita ma ricca; color grading coerente su tutto il deck: le slide devono sembrare un unico prodotto editoriale.
- Nessuna frase lunga renderizzata dentro l'immagine; eventuali etichette in-image in italiano, max 3 parole. MAI testo in inglese dentro le immagini.
```

## Generazione via CLI (alternativa)

```bash
notebooklm create "TecnologIA — MC-AMB-2-06"
notebooklm source add "08_TESTI/classe_2/AMB/MC-AMB-2-06_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-AMB-2-06_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-AMB-2-06_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
