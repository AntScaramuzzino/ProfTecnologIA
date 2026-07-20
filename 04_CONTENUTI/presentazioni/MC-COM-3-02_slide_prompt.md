# Prompt slide deck NotebookLM — MC-COM-3-02

**MC:** Produzione di contenuti digitali responsabili
**Area:** 📡 Comunicazioni e Trasporti · Classe 3ª · Palette #283593 / #E8EAF6
**Fonte da caricare nel notebook:** `08_TESTI/classe_3/COM/MC-COM-3-02_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-COM-3-02_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 3ª, sulla micro-competenza «Produzione di contenuti digitali responsabili» (MC-COM-3-02).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-COM-3-02.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (8 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «I contenuti digitali: da cosa sono fatti e come funzionano»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «I contenuti digitali: da cosa sono fatti e come funzionano» — un solo concetto, UN esempio concreto
3. «Tipi di contenuti digitali» — un solo concetto, UN esempio concreto · callout suggeriti: Testo / Immagine / Audio
4. «Compressione: come si riduce un file senza perdere (troppo)» — un solo concetto, UN esempio concreto · callout suggeriti: PNG / FLAC / ZIP
5. «Diritto d'autore: come funziona in Italia e quanto dura» — un solo concetto, UN esempio concreto · callout suggeriti: diritto d'autore / Legge n. 633 del 22 aprile 1941 / Durata
6. «Plagio vs. citazione: la differenza pratica» — un solo concetto, UN esempio concreto · callout suggeriti: Citare / testo / fotografia o immagine
7. «Le licenze Creative Commons: cosa puoi fare con ogni licenza» — un solo concetto, UN esempio concreto · callout suggeriti: Creative Commons (CC / CC0 / CC BY
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
notebooklm create "TecnologIA — MC-COM-3-02"
notebooklm source add "08_TESTI/classe_3/COM/MC-COM-3-02_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-COM-3-02_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-COM-3-02_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
