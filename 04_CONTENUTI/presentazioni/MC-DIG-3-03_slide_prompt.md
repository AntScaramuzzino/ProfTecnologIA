# Prompt slide deck NotebookLM — MC-DIG-3-03

**MC:** Raccolta dati da sensori e sistemi IoT
**Area:** 💻 Digitale / Coding / AI · Classe 3ª · Palette #006064 / #E0F7FA
**Fonte da caricare nel notebook:** `08_TESTI/classe_3/DIG/MC-DIG-3-03_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-DIG-3-03_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 3ª, sulla micro-competenza «Raccolta dati da sensori e sistemi IoT» (MC-DIG-3-03).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-DIG-3-03.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (8 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Dal mondo fisico al numero: cos'è un dato»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Dal mondo fisico al numero: cos'è un dato» — un solo concetto, UN esempio concreto · callout suggeriti: dato grezzo / dato contestualizzato / usare i dati raccolti
3. «Cosa raccolgono i sensori che ti circondano» — un solo concetto, UN esempio concreto · callout suggeriti: Temperatura e umidità / Qualità dell'aria / Posizione GPS
4. «Come si visualizzano i dati: scegliere il grafico giusto» — un solo concetto, UN esempio concreto · callout suggeriti: Grafico a linee / Grafico a barre / Grafico a dispersione (scatter plot
5. «Come i grafici possono ingannare» — un solo concetto, UN esempio concreto · callout suggeriti: L'asse troncato / Scala logaritmica non dichiarata / 950 milioni
6. «Privacy e dati IoT: chi raccoglie cosa, e perché» — un solo concetto, UN esempio concreto · callout suggeriti: Dove vanno i dati? / Cosa dice la legge / Citizen science
7. «Caso studio: visualizza 30 giorni di temperatura nella tua stanza — cosa puoi capire?» — un solo concetto, UN esempio concreto · callout suggeriti: l'andamento nel tempo / 19°C / 20°C
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
notebooklm create "TecnologIA — MC-DIG-3-03"
notebooklm source add "08_TESTI/classe_3/DIG/MC-DIG-3-03_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-DIG-3-03_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-DIG-3-03_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
