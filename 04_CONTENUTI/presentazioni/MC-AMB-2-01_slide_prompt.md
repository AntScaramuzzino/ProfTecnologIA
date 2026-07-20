# Prompt slide deck NotebookLM — MC-AMB-2-01

**MC:** Strutture edilizie e tecniche costruttive
**Area:** 🏗️ Abitazione · Città · Territorio · Classe 2ª · Palette #00695C / #E0F2F1
**Fonte da caricare nel notebook:** `08_TESTI/classe_2/AMB/MC-AMB-2-01_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-AMB-2-01_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 2ª, sulla micro-competenza «Strutture edilizie e tecniche costruttive» (MC-AMB-2-01).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-AMB-2-01.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (12 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Ogni edificio è una macchina per sopportare forze»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Ogni edificio è una macchina per sopportare forze» — un solo concetto, UN esempio concreto
3. «Le quattro forze che agiscono sulle strutture» — slide introduttiva: quadro d'insieme
4. «Compressione — la forza che schiaccia» — un solo concetto, UN esempio concreto · callout suggeriti: pietra / mattoni / calcestruzzo
5. «Trazione — la forza che tira» — un solo concetto, UN esempio concreto · callout suggeriti: acciaio / fibre di carbonio / corde e funi
6. «Flessione — la forza che piega» — un solo concetto, UN esempio concreto · callout suggeriti: flessione
7. «Taglio — la forza che scorre» — un solo concetto, UN esempio concreto · callout suggeriti: taglio
8. «I sistemi strutturali principali» — un solo concetto, UN esempio concreto
9. «Le fondazioni — il collegamento con il suolo» — un solo concetto, UN esempio concreto
10. «Materiali da costruzione — dalle origini ai nuovi materiali» — un solo concetto, UN esempio concreto
11. «Strutture antisismiche — come un edificio sopravvive a un terremoto» — un solo concetto, UN esempio concreto
12. SINTESI — 3 box "da ricordare" (solo contenuti ESPLORA) + una domanda aperta finale

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
notebooklm create "TecnologIA — MC-AMB-2-01"
notebooklm source add "08_TESTI/classe_2/AMB/MC-AMB-2-01_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-AMB-2-01_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-AMB-2-01_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
