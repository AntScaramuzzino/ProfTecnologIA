# Prompt slide deck NotebookLM — MC-DIG-3-02

**MC:** Intelligenza Artificiale: concetti, etica e applicazioni
**Area:** 💻 Digitale / Coding / AI · Classe 3ª · Palette #006064 / #E0F7FA
**Fonte da caricare nel notebook:** `08_TESTI/classe_3/DIG/MC-DIG-3-02_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-DIG-3-02_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 3ª, sulla micro-competenza «Intelligenza Artificiale: concetti, etica e applicazioni» (MC-DIG-3-02).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-DIG-3-02.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (8 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Storia dell'intelligenza artificiale: un percorso non lineare»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Storia dell'intelligenza artificiale: un percorso non lineare» — un solo concetto, UN esempio concreto · callout suggeriti: 1950 — Il test di Turing / Test di Turing / 1969-1974 — Primo inverno dell'IA
3. «Machine learning: come le macchine "imparano"» — un solo concetto, UN esempio concreto · callout suggeriti: machine learning / Apprendimento supervisionato / Apprendimento non supervisionato
4. «Reti neurali artificiali: anatomia di un cervello artificiale» — un solo concetto, UN esempio concreto · callout suggeriti: reti neurali artificiali / strato di input / strati nascosti
5. «IA generativa: come funziona un LLM» — un solo concetto, UN esempio concreto · callout suggeriti: LLM (Large Language Model / Cosa è un token / Perché il modello non "capisce
6. «Allucinazioni: quando l'IA inventa con sicurezza» — un solo concetto, UN esempio concreto · callout suggeriti: allucinazioni
7. «Bias algoritmici: quando i dati riflettono le disuguaglianze» — un solo concetto, UN esempio concreto
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
- Soggetti dell'area: micro:bit boards with glowing LED matrices, Arduino boards and breadboards with jumper wires, small wheeled robots, laptops showing block code, classroom makerspaces.
- Persone (quando presenti): middle-school students coding together at a makerspace bench, a mentor pointing at a screen; contesto scolastico italiano, studenti 11-14 anni.
- Box testuali semi-trasparenti effetto vetro satinato, angoli arrotondati, ombre leggere, testo sans serif moderno in grigio scuro.
- Frecce, linee di quota, callout tecnici, cornici sottili e piccoli elementi HUD in ciano e arancione.
- Palette: tonalità naturali del soggetto, crema, grigio chiaro, ciano tecnico e ambra; accento d'area #006064 per titoli e chip.
- Composizione pulita ma ricca; color grading coerente su tutto il deck: le slide devono sembrare un unico prodotto editoriale.
- Nessuna frase lunga renderizzata dentro l'immagine; eventuali etichette in-image in italiano, max 3 parole. MAI testo in inglese dentro le immagini.
```

## Generazione via CLI (alternativa)

```bash
notebooklm create "TecnologIA — MC-DIG-3-02"
notebooklm source add "08_TESTI/classe_3/DIG/MC-DIG-3-02_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-DIG-3-02_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-DIG-3-02_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
