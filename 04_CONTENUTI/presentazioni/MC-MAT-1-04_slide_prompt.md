# Prompt slide deck NotebookLM — MC-MAT-1-04

**MC:** Rifiuti, riciclaggio e smaltimento
**Area:** 🪨 Materiali e Rifiuti · Classe 1ª · Palette #6D4C41 / #EFEBE9
**Fonte da caricare nel notebook:** `08_TESTI/classe_1/MAT/MC-MAT-1-04_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-MAT-1-04_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 1ª, sulla micro-competenza «Rifiuti, riciclaggio e smaltimento» (MC-MAT-1-04).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-MAT-1-04.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (16 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Ogni oggetto che butti non scompare. Diventa qualcos'altro»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Ogni oggetto che butti non scompare. Diventa qualcos'altro» — un solo concetto, UN esempio concreto · callout suggeriti: 29 milioni / 490 kg
3. «Cos'è un rifiuto? La definizione legale» — un solo concetto, UN esempio concreto · callout suggeriti: rifiuto
4. «Le categorie dei rifiuti» — un solo concetto, UN esempio concreto · callout suggeriti: rifiuti urbani / rifiuti speciali
5. «La gerarchia dei rifiuti: le 5 R» — slide introduttiva: quadro d'insieme · callout suggeriti: gerarchia / Rifiuta / Riduci
6. «Rifiuta (la R più potente)» — un solo concetto, UN esempio concreto · callout suggeriti: Esempio concreto / 5 miliardi
7. «Riduci» — un solo concetto, UN esempio concreto · callout suggeriti: sistemi di deposito cauzionale
8. «Riusa» — un solo concetto, UN esempio concreto · callout suggeriti: mercatini del riuso
9. «Ricicla» — un solo concetto, UN esempio concreto
10. «Come funziona il riciclo della carta e del cartone» — un solo concetto, UN esempio concreto · callout suggeriti: pulper / sospensione di fibre di cellulosa / pasta di carta
11. «Come funziona il riciclo del vetro» — un solo concetto, UN esempio concreto · callout suggeriti: cullet / 1500°C
12. «Come funziona il riciclo dei metalli» — un solo concetto, UN esempio concreto · callout suggeriti: Acciaio / Alluminio / 1600°C
13. «Come funziona il riciclo della plastica» — un solo concetto, UN esempio concreto · callout suggeriti: flakes / Contaminazione / Degradazione della qualità
14. «La discarica: non è la fine, è un parcheggio lungo» — un solo concetto, UN esempio concreto · callout suggeriti: discarica / percolato / biogas
15. «Il sistema di raccolta differenziata in Italia» — un solo concetto, UN esempio concreto · callout suggeriti: Raccolta stradale / Raccolta porta a porta / Ecosportelli / Ecocentri
16. SINTESI — 3 box "da ricordare" (solo contenuti ESPLORA) + una domanda aperta finale

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
- Soggetti dell'area: raw material samples (mineral chunks, natural fiber coils, wooden planks, metal ingots, plastic pellets), recycling bins and sorting facilities, workshop benches with sorted material trays.
- Persone (quando presenti): middle-school students examining material samples, factory and recycling-plant workers; contesto scolastico italiano, studenti 11-14 anni.
- Box testuali semi-trasparenti effetto vetro satinato, angoli arrotondati, ombre leggere, testo sans serif moderno in grigio scuro.
- Frecce, linee di quota, callout tecnici, cornici sottili e piccoli elementi HUD in ciano e arancione.
- Palette: tonalità naturali del soggetto, crema, grigio chiaro, ciano tecnico e ambra; accento d'area #6D4C41 per titoli e chip.
- Composizione pulita ma ricca; color grading coerente su tutto il deck: le slide devono sembrare un unico prodotto editoriale.
- Nessuna frase lunga renderizzata dentro l'immagine; eventuali etichette in-image in italiano, max 3 parole. MAI testo in inglese dentro le immagini.
```

## Generazione via CLI (alternativa)

```bash
notebooklm create "TecnologIA — MC-MAT-1-04"
notebooklm source add "08_TESTI/classe_1/MAT/MC-MAT-1-04_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-MAT-1-04_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-MAT-1-04_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
