# Prompt slide deck NotebookLM — MC-AMB-2-03

**MC:** Città, servizi urbani e pianificazione
**Area:** 🏗️ Abitazione · Città · Territorio · Classe 2ª · Palette #00695C / #E0F2F1
**Fonte da caricare nel notebook:** `08_TESTI/classe_2/AMB/MC-AMB-2-03_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-AMB-2-03_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 2ª, sulla micro-competenza «Città, servizi urbani e pianificazione» (MC-AMB-2-03).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-AMB-2-03.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (12 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Una città non si forma per caso. È il risultato di scelte»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Una città non si forma per caso. È il risultato di scelte» — un solo concetto, UN esempio concreto · callout suggeriti: pianificazione urbanistica
3. «Da dove nasce una città — dalla storia alla metropoli moderna» — slide introduttiva: quadro d'insieme
4. «L'accampamento romano — la griglia ortogonale» — un solo concetto, UN esempio concreto · callout suggeriti: cardo / decumano / foro
5. «La città medievale — crescita organica attorno al castello» — un solo concetto, UN esempio concreto · callout suggeriti: piazza del mercato / piazza della cattedrale
6. «La rivoluzione industriale — esplosione demografica e primo piano regolatore» — un solo concetto, UN esempio concreto · callout suggeriti: epidemiologia spaziale / boulevards / 6,7 milioni
7. «La città moderna — zoning e piano regolatore» — un solo concetto, UN esempio concreto · callout suggeriti: piano regolatore / zoning / zonizzazione
8. «Il Piano Regolatore — cos'è, chi lo fa, cosa stabilisce» — un solo concetto, UN esempio concreto · callout suggeriti: Piano Regolatore Generale (PRG / Chi lo fa / Consiglio Comunale
9. «Le infrastrutture urbane — la rete invisibile che fa funzionare la città» — un solo concetto, UN esempio concreto · callout suggeriti: Rete stradale e mobilità / Strade urbane principali (arterie / Strade di distribuzione
10. «La mobilità urbana — chi occupa lo spazio della città» — un solo concetto, UN esempio concreto · callout suggeriti: sprawl urbano / consumo di suolo
11. «Come si decide dove mettere i servizi urbani» — un solo concetto, UN esempio concreto · callout suggeriti: servizi pubblici / accessibili / Standard urbanistici
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
notebooklm create "TecnologIA — MC-AMB-2-03"
notebooklm source add "08_TESTI/classe_2/AMB/MC-AMB-2-03_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-AMB-2-03_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-AMB-2-03_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
