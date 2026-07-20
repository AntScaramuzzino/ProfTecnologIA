# Prompt slide deck NotebookLM — MC-DIG-1-01

**MC:** Orientarsi nell'ambiente digitale
**Area:** 💻 Digitale / Coding / AI · Classe 1ª · Palette #006064 / #E0F7FA
**Fonte da caricare nel notebook:** `08_TESTI/classe_1/DIG/MC-DIG-1-01_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-DIG-1-01_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 1ª, sulla micro-competenza «Orientarsi nell'ambiente digitale» (MC-DIG-1-01).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-DIG-1-01.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (13 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Un ambiente che non si vede. Ma che usi ogni giorno»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Un ambiente che non si vede. Ma che usi ogni giorno» — un solo concetto, UN esempio concreto · callout suggeriti: ambiente digitale
3. «La differenza fondamentale: hardware e software» — un solo concetto, UN esempio concreto · callout suggeriti: Hardware / Software
4. «I componenti di un computer: cosa fa ciascuno» — slide introduttiva: quadro d'insieme
5. «La CPU — il processore» — un solo concetto, UN esempio concreto · callout suggeriti: CPU / transistor / GHz
6. «La RAM — la memoria di lavoro» — un solo concetto, UN esempio concreto · callout suggeriti: RAM / volatile
7. «La ROM e lo storage — la memoria permanente» — un solo concetto, UN esempio concreto · callout suggeriti: ROM / firmware / storage
8. «La GPU — la scheda grafica» — un solo concetto, UN esempio concreto · callout suggeriti: GPU / 2 milioni / 120 milioni
9. «La scheda madre — il sistema nervoso» — un solo concetto, UN esempio concreto · callout suggeriti: scheda madre / BIOS / UEFI
10. «Il sistema operativo: cos'è e perché esiste» — un solo concetto, UN esempio concreto · callout suggeriti: sistema operativo / Windows / macOS
11. «I tipi di software: applicazioni, web app, app mobile» — un solo concetto, UN esempio concreto · callout suggeriti: Applicazioni desktop / Web app / App mobile
12. «Internet e il web: due cose diverse» — un solo concetto, UN esempio concreto · callout suggeriti: Internet
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
notebooklm create "TecnologIA — MC-DIG-1-01"
notebooklm source add "08_TESTI/classe_1/DIG/MC-DIG-1-01_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-DIG-1-01_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-DIG-1-01_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
