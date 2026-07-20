# Prompt slide deck NotebookLM — MC-ALI-2-04

**MC:** La filiera alimentare e l'etichetta
**Area:** 🌾 Alimentazione · Classe 2ª · Palette #558B2F / #F1F8E9
**Fonte da caricare nel notebook:** `08_TESTI/classe_2/ALI/MC-ALI-2-04_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-ALI-2-04_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 2ª, sulla micro-competenza «La filiera alimentare e l'etichetta» (MC-ALI-2-04).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-ALI-2-04.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (11 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Il cibo non appare per magia: ha una storia»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Il cibo non appare per magia: ha una storia» — un solo concetto, UN esempio concreto · callout suggeriti: filiera alimentare
3. «Gli attori della filiera: chi c'è lungo il filo?» — slide introduttiva: quadro d'insieme
4. «1. Il produttore primario: agricoltore o allevatore» — un solo concetto, UN esempio concreto
5. «2. Il trasformatore: l'industria alimentare» — un solo concetto, UN esempio concreto · callout suggeriti: trasformazione alimentare / Conservazione / Aggiunta di valore
6. «3. Il distributore: la logistica del cibo» — un solo concetto, UN esempio concreto · callout suggeriti: distributore / catena del freddo
7. «La catena del freddo: cosa succede se si spezza?» — un solo concetto, UN esempio concreto · callout suggeriti: catena del freddo / 4°C / 8°C
8. «Food miles: quanto cammina il tuo cibo?» — un solo concetto, UN esempio concreto · callout suggeriti: Food miles / mezzo di trasporto / 6.000 km
9. «Filiera lunga vs. filiera corta» — un solo concetto, UN esempio concreto · callout suggeriti: filiera corta / Vendita diretta in azienda agricola / Mercati contadini (farmers market
10. «Il commercio equo e solidale: quando la filiera globale è anche giusta» — un solo concetto, UN esempio concreto · callout suggeriti: commercio equo e solidale / prezzo minimo garantito / premio sociale
11. SINTESI — 3 box "da ricordare" (solo contenuti ESPLORA) + una domanda aperta finale

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
notebooklm create "TecnologIA — MC-ALI-2-04"
notebooklm source add "08_TESTI/classe_2/ALI/MC-ALI-2-04_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-ALI-2-04_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-ALI-2-04_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
