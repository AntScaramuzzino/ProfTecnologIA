# Prompt slide deck NotebookLM — MC-DIG-2-03

**MC:** Il sistema operativo: come il computer gestisce le risorse
**Area:** 💻 Digitale / Coding / AI · Classe 2ª · Palette #006064 / #E0F7FA
**Fonte da caricare nel notebook:** `08_TESTI/classe_2/DIG/MC-DIG-2-03_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-DIG-2-03_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 2ª, sulla micro-competenza «Il sistema operativo: come il computer gestisce le risorse» (MC-DIG-2-03).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-DIG-2-03.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (8 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Usare bene il computer: una competenza che si impara»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Usare bene il computer: una competenza che si impara» — un solo concetto, UN esempio concreto
3. «1. Organizzare i file: la struttura che ti fa trovare tutto» — un solo concetto, UN esempio concreto · callout suggeriti: Regola 1 — Un posto per ogni cosa / Regola 3 — Archivia regolarmente
4. «2. Nominare i file: la convenzione che ti salva la vita» — un solo concetto, UN esempio concreto
5. «3. Backup: la regola 3-2-1» — un solo concetto, UN esempio concreto · callout suggeriti: regola 3-2-1 / 3 copie / 2 supporti diversi
6. «4. Gestire i programmi: installazione, aggiornamenti e pulizia» — un solo concetto, UN esempio concreto · callout suggeriti: Installare un programma / Aggiornare i programmi / Disinstallare programmi
7. «5. Cloud storage: comodità e rischi» — un solo concetto, UN esempio concreto · callout suggeriti: Condivisione consapevole
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
notebooklm create "TecnologIA — MC-DIG-2-03"
notebooklm source add "08_TESTI/classe_2/DIG/MC-DIG-2-03_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-DIG-2-03_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-DIG-2-03_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
