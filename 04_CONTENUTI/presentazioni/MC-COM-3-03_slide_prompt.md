# Prompt slide deck NotebookLM — MC-COM-3-03

**MC:** Sistemi di trasporto e mobilità sostenibile
**Area:** 📡 Comunicazioni e Trasporti · Classe 3ª · Palette #283593 / #E8EAF6
**Fonte da caricare nel notebook:** `08_TESTI/classe_3/COM/MC-COM-3-03_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-COM-3-03_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 3ª, sulla micro-competenza «Sistemi di trasporto e mobilità sostenibile» (MC-COM-3-03).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-COM-3-03.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (12 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Tutto si muove: una storia breve dei sistemi di trasporto»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Tutto si muove: una storia breve dei sistemi di trasporto» — un solo concetto, UN esempio concreto
3. «Dalla ruota al treno superveloce: storia compatta» — un solo concetto, UN esempio concreto · callout suggeriti: macchina a vapore / motore a combustione interna / trasporto aereo
4. «I sistemi di trasporto: una panoramica comparata» — slide introduttiva: quadro d'insieme · callout suggeriti: velocità / capacità / costo
5. «Trasporto stradale» — un solo concetto, UN esempio concreto · callout suggeriti: Occupazione del suolo / 40 tonnellate / 30 litri
6. «Trasporto ferroviario» — un solo concetto, UN esempio concreto · callout suggeriti: 800 km
7. «Trasporto aereo» — un solo concetto, UN esempio concreto · callout suggeriti: 1.000 km / 6.900 km / 250 kg
8. «Trasporto marittimo» — un solo concetto, UN esempio concreto · callout suggeriti: 45 milioni
9. «Trasporto merci vs. passeggeri: la logistica globale» — un solo concetto, UN esempio concreto · callout suggeriti: 21.000 km
10. «Mobilità urbana: il problema del XXI secolo» — un solo concetto, UN esempio concreto · callout suggeriti: Dati sulla mobilità urbana / domanda indotta
11. «Veicoli elettrici: stato attuale» — un solo concetto, UN esempio concreto · callout suggeriti: Autonomia reale / Ricarica / Emissioni dell'intero ciclo di vita
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
- Soggetti dell'area: satellite dishes and radio towers, glowing fibre-optic cables, smartphones in use, high-speed trains, cargo container ships and ports, city skylines at dusk with transport corridors lit up.
- Persone (quando presenti): a network technician at a console, travellers and logistics workers; contesto scolastico italiano, studenti 11-14 anni.
- Box testuali semi-trasparenti effetto vetro satinato, angoli arrotondati, ombre leggere, testo sans serif moderno in grigio scuro.
- Frecce, linee di quota, callout tecnici, cornici sottili e piccoli elementi HUD in ciano e arancione.
- Palette: tonalità naturali del soggetto, crema, grigio chiaro, ciano tecnico e ambra; accento d'area #283593 per titoli e chip.
- Composizione pulita ma ricca; color grading coerente su tutto il deck: le slide devono sembrare un unico prodotto editoriale.
- Nessuna frase lunga renderizzata dentro l'immagine; eventuali etichette in-image in italiano, max 3 parole. MAI testo in inglese dentro le immagini.
```

## Generazione via CLI (alternativa)

```bash
notebooklm create "TecnologIA — MC-COM-3-03"
notebooklm source add "08_TESTI/classe_3/COM/MC-COM-3-03_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-COM-3-03_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-COM-3-03_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
