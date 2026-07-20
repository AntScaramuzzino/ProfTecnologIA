# Prompt slide deck NotebookLM — MC-SIS-3-02

**MC:** Economia globale, lavoro e sostenibilità
**Area:** ⚙️ Sistemi · Economia · Lavoro · Classe 3ª · Palette #4527A0 / #EDE7F6
**Fonte da caricare nel notebook:** `08_TESTI/classe_3/SIS/MC-SIS-3-02_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-SIS-3-02_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 3ª, sulla micro-competenza «Economia globale, lavoro e sostenibilità» (MC-SIS-3-02).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-SIS-3-02.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (8 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Globalizzazione: cos'è, cosa ha cambiato, cosa ha promesso e cosa non ha mantenuto»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Globalizzazione: cos'è, cosa ha cambiato, cosa ha promesso e cosa non ha mantenuto» — un solo concetto, UN esempio concreto · callout suggeriti: globalizzazione / 30 anni
3. «Commercio internazionale: chi vende cosa, chi controlla le regole» — un solo concetto, UN esempio concreto · callout suggeriti: commercio internazionale / vantaggi comparati / WTO (World Trade Organization
4. «Delocalizzazione: perché le aziende spostano la produzione» — un solo concetto, UN esempio concreto · callout suggeriti: delocalizzazione / reshoring
5. «Economia circolare: dall'usa-e-getta al ciclo continuo» — un solo concetto, UN esempio concreto · callout suggeriti: lineare / economia circolare / cradle-to-cradle
6. «Il lavoro: tipologie, diritti, storia» — un solo concetto, UN esempio concreto · callout suggeriti: lavoro / Lavoro dipendente / Lavoro autonomo
7. «Green economy: i lavori che crescono con la transizione ecologica» — un solo concetto, UN esempio concreto · callout suggeriti: 30 milioni
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
- Soggetti dell'area: factories, delivery trucks, shops and homes as a supply chain, world maps with trade routes, modern offices with sticky-note walls, market stalls, coins and charts.
- Persone (quando presenti): an entrepreneur with a tablet, workers across the three economic sectors; contesto scolastico italiano, studenti 11-14 anni.
- Box testuali semi-trasparenti effetto vetro satinato, angoli arrotondati, ombre leggere, testo sans serif moderno in grigio scuro.
- Frecce, linee di quota, callout tecnici, cornici sottili e piccoli elementi HUD in ciano e arancione.
- Palette: tonalità naturali del soggetto, crema, grigio chiaro, ciano tecnico e ambra; accento d'area #4527A0 per titoli e chip.
- Composizione pulita ma ricca; color grading coerente su tutto il deck: le slide devono sembrare un unico prodotto editoriale.
- Nessuna frase lunga renderizzata dentro l'immagine; eventuali etichette in-image in italiano, max 3 parole. MAI testo in inglese dentro le immagini.
```

## Generazione via CLI (alternativa)

```bash
notebooklm create "TecnologIA — MC-SIS-3-02"
notebooklm source add "08_TESTI/classe_3/SIS/MC-SIS-3-02_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-SIS-3-02_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-SIS-3-02_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
