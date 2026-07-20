# Prompt slide deck NotebookLM — MC-DIS-3-02

**MC:** Disegno CAD e progettazione digitale
**Area:** 📐 Disegno Tecnico · Classe 3ª · Palette #1565C0 / #E3F2FD
**Fonte da caricare nel notebook:** `08_TESTI/classe_3/DIS/MC-DIS-3-02_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-DIS-3-02_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 3ª, sulla micro-competenza «Disegno CAD e progettazione digitale» (MC-DIS-3-02).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-DIS-3-02.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (8 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Storia del CAD: dal tavolo da disegno al cloud»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Storia del CAD: dal tavolo da disegno al cloud» — un solo concetto, UN esempio concreto · callout suggeriti: CAD (Computer-Aided Design / AutoCAD / Anni 1980 — CAD 2D
3. «CAD 2D vs CAD 3D: quando usare quale» — un solo concetto, UN esempio concreto · callout suggeriti: CAD 2D / CAD 3D / Tinkercad
4. «Tinkercad: l'ambiente e la logica» — un solo concetto, UN esempio concreto · callout suggeriti: piano di lavoro / forme primitive / barra degli strumenti
5. «Workflow base in Tinkercad: costruire un oggetto passo per passo» — un solo concetto, UN esempio concreto · callout suggeriti: Passo 4 — Allineamento / Passo 5 — Raggruppamento / Passo 6 — Base piena
6. «Dal modello 3D alla stampa 3D: il percorso del file» — un solo concetto, UN esempio concreto · callout suggeriti: slicer / Cosa fa lo slicer / Ultimaker Cura
7. «Prototipazione rapida: la rivoluzione silenziosa della manifattura» — un solo concetto, UN esempio concreto · callout suggeriti: prototipazione rapida / Prima della prototipazione rapida / Dopo la prototipazione rapida
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
- Soggetti dell'area: drafting tables with set squares, compasses and graph paper, hands drawing precise lines, geometric solids and orthographic-view sketches, CAD screens.
- Persone (quando presenti): students drawing at a drafting table, a designer reviewing technical drawings; contesto scolastico italiano, studenti 11-14 anni.
- Box testuali semi-trasparenti effetto vetro satinato, angoli arrotondati, ombre leggere, testo sans serif moderno in grigio scuro.
- Frecce, linee di quota, callout tecnici, cornici sottili e piccoli elementi HUD in ciano e arancione.
- Palette: tonalità naturali del soggetto, crema, grigio chiaro, ciano tecnico e ambra; accento d'area #1565C0 per titoli e chip.
- Composizione pulita ma ricca; color grading coerente su tutto il deck: le slide devono sembrare un unico prodotto editoriale.
- Nessuna frase lunga renderizzata dentro l'immagine; eventuali etichette in-image in italiano, max 3 parole. MAI testo in inglese dentro le immagini.
```

## Generazione via CLI (alternativa)

```bash
notebooklm create "TecnologIA — MC-DIS-3-02"
notebooklm source add "08_TESTI/classe_3/DIS/MC-DIS-3-02_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-DIS-3-02_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-DIS-3-02_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
