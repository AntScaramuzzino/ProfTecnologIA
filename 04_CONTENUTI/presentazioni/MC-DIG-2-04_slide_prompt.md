# Prompt slide deck NotebookLM — MC-DIG-2-04

**MC:** Cifratura, sicurezza informatica e identità in rete
**Area:** 💻 Digitale / Coding / AI · Classe 2ª · Palette #006064 / #E0F7FA
**Fonte da caricare nel notebook:** `08_TESTI/classe_2/DIG/MC-DIG-2-04_completa.md`
**Output:** deck fotorealistico · scaricare come **MC-DIG-2-04_deck.pptx** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe 2ª, sulla micro-competenza «Cifratura, sicurezza informatica e identità in rete» (MC-DIG-2-04).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC MC-DIG-2-04.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA (8 slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «Sicurezza digitale: non è paranoia, è igiene»; render fotorealistico del soggetto, senza testo dentro l'immagine
2. «Sicurezza digitale: non è paranoia, è igiene» — un solo concetto, UN esempio concreto
3. «1. I tipi di attacchi che riguardano te» — un solo concetto, UN esempio concreto · callout suggeriti: Phishing / Varianti del phishing / Social engineering
4. «2. Come riconoscere un'email di phishing: sette segnali» — un solo concetto, UN esempio concreto · callout suggeriti: Segnale 1 — URL sospetto / Segnale 2 — Urgenza artificiale / Segnale 4 — Mittente sospetto
5. «3. Password forti: la lunghezza batte la complessità» — un solo concetto, UN esempio concreto · callout suggeriti: passphrase / Regola 1 — Lunga / Regola 2 — Unica
6. «4. Autenticazione a due fattori (2FA): la seconda serratura» — un solo concetto, UN esempio concreto · callout suggeriti: 2FA / Dove attivare il 2FA / Quale tipo di 2FA usare
7. «5. Se vieni attaccato: cosa fare» — un solo concetto, UN esempio concreto · callout suggeriti: Passo 4 — Attiva il 2FA / Passo 5 — Avvisa i tuoi contatti / Passo 6 — Segnala
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
notebooklm create "TecnologIA — MC-DIG-2-04"
notebooklm source add "08_TESTI/classe_2/DIG/MC-DIG-2-04_completa.md"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' MC-DIG-2-04_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./MC-DIG-2-04_deck.pptx --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · 2026-07-12 · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
