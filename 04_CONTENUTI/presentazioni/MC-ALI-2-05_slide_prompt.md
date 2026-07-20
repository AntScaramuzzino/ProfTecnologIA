# Prompt slide deck NotebookLM — MC-ALI-2-05

**MC:** Sprechi alimentari e sostenibilità
**Area:** 🌾 Alimentazione · Classe 2ª · Palette #558B2F / #F1F8E9
**Fonte da caricare nel notebook:** `08_TESTI/classe_2/ALI/MC-ALI-2-05_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-ALI-2-05_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 2ª, sulla micro-competenza «Sprechi alimentari e sostenibilità» (MC-ALI-2-05).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-ALI-2-05.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (13 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «L'imballaggio non è solo una scatola: ha cinque funzioni precise»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «L'imballaggio non è solo una scatola: ha cinque funzioni precise» — slide introduttiva: quadro d'insieme · callout suggeriti: packaging alimentare
3. «Funzione 1: Protezione meccanica» — un solo concetto, UN esempio concreto
4. «Funzione 2: Conservazione e barriera» — un solo concetto, UN esempio concreto · callout suggeriti: barriera
5. «Funzione 3: Informazione e identificazione» — un solo concetto, UN esempio concreto
6. «Funzione 4: Marketing e comunicazione» — un solo concetto, UN esempio concreto
7. «Funzione 5: Facilitazione della distribuzione» — un solo concetto, UN esempio concreto
8. «I materiali del packaging: pregi e problemi ambientali» — un solo concetto, UN esempio concreto
9. «L'over-packaging: quando l'imballaggio è il problema» — un solo concetto, UN esempio concreto · callout suggeriti: Over-packaging
10. «Packaging sostenibile: le alternative esistono» — un solo concetto, UN esempio concreto · callout suggeriti: Bioplastiche / Packaging edibile / Packaging da materiali riciclati
11. «I simboli sul packaging: cosa significano davvero» — un solo concetto, UN esempio concreto
12. «Chi lavora con questa competenza nel 2030?» — un solo concetto, UN esempio concreto · callout suggeriti: Microbiome Specialist
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
notebooklm create "TecnologIA — MC-ALI-2-05"
notebooklm source add "08_TESTI/classe_2/ALI/MC-ALI-2-05_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-ALI-2-05_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-ALI-2-05_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
