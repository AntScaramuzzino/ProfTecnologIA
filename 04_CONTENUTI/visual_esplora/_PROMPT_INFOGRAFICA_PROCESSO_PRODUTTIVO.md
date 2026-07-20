# Prompt master — Infografica processo produttivo

## Uso previsto

Questo prompt serve per creare una tavola ESPLORA ad alto impatto visivo a partire da una MC TecnologIA. Va usato per processi produttivi, filiere, trasformazioni di materiali, alimenti, energia, oggetti tecnici o sistemi industriali.

Prima di generare l'immagine finale:

1. Recupera la MC JSON e il testo narrativo completo.
2. Estrai: titolo, descrizione, compito di realtà, prerequisiti, SDG, professione futura, livello DigComp, visual previsto.
3. Verifica se esistono visual, prompt o manifest già generati in `04_CONTENUTI/visual/{MC-ID}/`.
4. Integra una breve ricerca online su dati tecnici aggiornati, innovazioni, criticità ambientali e specificità distintive del processo.
5. Se un dato non è verificato, non inserirlo come valore numerico: usa formulazioni qualitative o segnala la necessità di verifica.

## Prompt immagine

Crea un'infografica editoriale visivamente ricca su **[PROCESSO PRODUTTIVO]**, per studenti della scuola secondaria di primo grado, collegata alla micro-competenza **[MC-ID] — [TITOLO MC]**.

La tavola deve funzionare come un'illustrazione grafica d'impatto, non come una pagina a sezioni generiche. Al centro inserisci un **elemento caratteristico del processo**, dettagliato e fotorealistico, trattato come punto focale: **[SOGGETTO CENTRALE]**. Il soggetto deve avere materia, texture, profondità, piccoli dettagli tecnici e luce da studio editoriale.

Attorno al soggetto centrale costruisci una composizione stratificata con diagrammi, frecce, callout annotati, miniature tecniche e campiture di colore. Usa uno sfondo pulito, chiaro e professionale. Mescola fotorealismo e grafica forte: forme geometriche, icone semplici, linee tecniche, etichette brevi, micro-diagrammi e campioni di materiale.

## Contenuti da visualizzare

Mostra il processo come una sequenza leggibile di **5-7 passaggi**, ciascuno con un micro-callout di massimo 8 parole:

1. **[FASE 1]** — [principio o trasformazione]
2. **[FASE 2]** — [principio o trasformazione]
3. **[FASE 3]** — [principio o trasformazione]
4. **[FASE 4]** — [principio o trasformazione]
5. **[FASE 5]** — [principio o trasformazione]
6. **[FASE 6 opzionale]** — [principio o trasformazione]
7. **[FASE 7 opzionale]** — [principio o trasformazione]

Inserisci almeno **4 callout strutturati**, non box generici:

- **Materia prima:** [origine, proprietà, variabile decisiva]
- **Trasformazione chiave:** [macchina, energia, temperatura, pressione, reazione o algoritmo]
- **Controllo qualità:** [misura, test, sensore, etichetta o norma]
- **Impatto e innovazione:** [risparmio, riciclo, tracciabilità, automazione, riduzione sprechi]

Inserisci un piccolo elemento “osserva da vicino” con un dettaglio tecnico ingrandito: **[DETTAGLIO MACRO]**.

Inserisci un micro-diagramma laterale che renda visibile la relazione:

**input → trasformazione → output → uso → fine vita / riciclo**

## Stile visivo

Formato orizzontale 16:9, qualità editoriale, aspetto da manuale scolastico contemporaneo. Composizione densa ma ordinata. Fotorealismo pulito nel soggetto centrale; grafica vettoriale netta nei callout. Palette tecnica con 3 colori dominanti scelti in base al processo: **[COLORE 1]**, **[COLORE 2]**, **[COLORE 3]**, più grigi neutri. Contrasto alto, gerarchia chiara, nessun effetto decorativo gratuito.

Usa:

- frecce sottili e leggibili;
- icone tecniche coerenti;
- texture materiche dove servono;
- etichette brevi in italiano;
- pochi numeri, solo se verificati;
- spazi bianchi per non soffocare la lettura.

Evita:

- sezioni generiche tipo “introduzione”, “vantaggi”, “svantaggi”;
- lunghi paragrafi;
- testo troppo piccolo;
- loghi, marchi, watermark;
- dati normativi non verificati;
- composizione piatta o solo decorativa.

## Output richiesto

Genera una tavola infografica con:

- titolo breve: **[TITOLO INFOGRAFICA]**;
- soggetto centrale fotorealistico;
- sequenza del processo;
- callout tecnici annotati;
- dettaglio macro;
- mini-schema input → trasformazione → output;
- nota finale di cittadinanza o sostenibilità collegata a **[SDG / COMPITO DI REALTA]**.

## Esempio compilato — MC-ALI-2-02

Crea un'infografica editoriale visivamente ricca su **lavorazione e conservazione del latte**, per studenti della scuola secondaria di primo grado, collegata alla micro-competenza **MC-ALI-2-02 — Industria alimentare e tecniche di conservazione**.

Al centro inserisci una **confezione di latte neutra con bicchiere trasparente, tubazioni in acciaio, piastra di scambio termico e campione da laboratorio**, dettagliata e fotorealistica. Attorno costruisci callout e frecce su: raccolta refrigerata, analisi, filtrazione e scrematura, pastorizzazione o UHT, confezionamento asettico, conservazione e consumo.

Mostra la sequenza:

1. Stalla — latte raccolto e raffreddato
2. Cisterna — trasporto a temperatura controllata
3. Laboratorio — analisi microbiologica
4. Centrifuga — separazione e standardizzazione
5. Calore — pastorizzazione o UHT
6. Confezione — barriera a luce e aria
7. Frigo o dispensa — shelf life diversa

Callout strutturati:

- **Freddo controllato:** rallenta i microrganismi.
- **Scambio termico:** il calore lavora per pochi secondi.
- **Asepsi:** confezione pulita, aria controllata.
- **Spreco ridotto:** conservare bene evita cibo buttato.

Dettaglio macro: piastra dello scambiatore con latte che passa in canali sottili.

Nota finale: scegliere e conservare correttamente il latte collega tecnologia alimentare, sicurezza e riduzione dello spreco.

Fonti tecniche da verificare prima della versione finale:

- EFSA Journal 2021, pasteurizzazione del latte: 72 °C per 15 s o 63 °C per 30 min come requisiti minimi equivalenti.
- Dairy Processing Handbook, prodotti lattiero-caseari a lunga conservazione: UHT/ultra-pasteurizzazione e confezionamento asettico.
- Studi e documenti su shelf life secondaria del latte UHT dopo apertura: usare solo dati coerenti con etichetta e normativa locale.
- Documenti su packaging alimentare e spreco: il packaging va presentato come protezione del cibo, non solo come rifiuto.
