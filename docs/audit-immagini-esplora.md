# Audit didattico delle immagini ESPLORA

*ProfTecnologIA – book.proftecnologia.it · 8 novembre 2026*

## Sintesi

Le 432 immagini generate con Canva sono state classificate in base alla loro funzione didattica rispetto al paragrafo che accompagnano.

| Esito | Immagini | Cosa fare |
|---|---|---|
| Tieni | 396 | Restano come sono |
| Trova l'errore | 11 | Contengono un errore di contenuto: si sostituiscono con uno schema corretto, oppure si usano in un'attività esplicita di verifica |
| Sostituisci con schema | 14 | Non sbagliate, ma non mostrano il concetto: serve uno schema didattico |
| Decorativa | 11 | Concetto astratto o giuridico: l'immagine non aggiunge nulla, meglio tabella o esempio |

Ogni manifest (`public/assets/esplora/MC-*/manifest.json`) ha ora, per ogni immagine, un campo `audit` con `esito` e `nota`. Il sito non lo mostra: serve per le prossime modifiche.

## Metodo e limiti

- I paragrafi sono stati divisi in due gruppi.
  - Gruppo a rischio (156): concetti tecnici, formule, processi, oggetti tecnici. Ho controllato ogni immagine a piena risoluzione confrontandola con il titolo del paragrafo.
  - Contesto e aperture (276): luoghi, persone, casi studio. Le ho viste solo in miniatura durante la generazione, senza un controllo di dettaglio.
- Il controllo è fatto sul titolo e sul tema del paragrafo, non sul testo completo. Dove il testo dà numeri o classificazioni specifiche (per esempio le "sei famiglie di materiali" o le percentuali della filiera), va verificata la coerenza con il testo.
- Le scritte generate dall'IA (numeri, etichette) sono la fonte più frequente di errore: un'immagine che contiene numeri va sempre controllata.

## 1. Immagini con errori di contenuto (11)

| MC | § | Paragrafo | Problema |
|---|---|---|---|
| MC-ALI-2-01 | 9 | Il ciclo biologico della pianta: dal seme al frutto | Ciclo corretto nelle fasi, ma il seme iniziale è un fagiolo e il frutto finale è un pomodoro: specie diverse nello stesso ciclo |
| MC-ALI-2-03 | 8 | Come si leggono i valori nutrizionali per fare scelte informate | Valori nutrizionali inventati e incoerenti (kcal e grammi casuali): sostituire con tabella reale |
| MC-COM-3-02 | 6 | Le licenze Creative Commons: cosa puoi fare con ogni licenza | Icone CC inventate: una icona (persona barrata) non esiste nelle licenze Creative Commons |
| MC-DIG-2-03 | 3 | 2. Nominare i file: la convenzione che ti salva la vita | I nomi dei file mostrati sono stringhe casuali tipo "f3a9b2c7…": l'opposto di una buona convenzione di denominazione |
| MC-DIS-1-02 | 3 | Come si calcola la scala: formula e procedura | Il calcolo scritto sul foglio dà "x = 5·100 = 500 cm" per una misura reale di 5 m in scala 1:100: il risultato giusto sul disegno è 5 cm (l'ologramma mostra correttamente 5 cm) |
| MC-ENE-3-01 | 4 | Il vantaggio meccanico: fare più con meno forza | Il peso grande è lontano dal fulcro quanto (o più) della forza applicata: così non c'è vantaggio meccanico, l'opposto del concetto |
| MC-ENE-3-04 | 1 | L'elettricità: cos'è davvero? | Lungo il filo si spostano interi atomi con il nucleo: nella corrente si muovono gli elettroni, i nuclei restano fermi |
| MC-ENE-3-04 | 4 | La potenza elettrica | Le barre mostrano la lampadina con potenza simile al phon: in realtà il phon assorbe da 30 a 200 volte di più |
| MC-INF-1-02 | 4 | Variabili: dove metti i dati mentre lavori | Nella stessa scatola-variabile finiscono molti numeri: una variabile contiene un solo valore alla volta |
| MC-INF-2-02 | 3 | Perché è difficile da rompere: i numeri primi enormi | Calcolo sbagliato: 9999991 × 9999967 fa 99999580000297, non 99999580000057; inoltre 9999967 non è primo |
| MC-SIS-3-03 | 3 | Il Business Model Canvas | La lavagna ha 8 riquadri disposti a griglia: il Business Model Canvas ne ha 9, con una disposizione diversa (5 in alto, 2 in basso) |

Queste immagini si prestano a un'attività di AI literacy: *"Questa immagine è stata generata da un'intelligenza artificiale a partire dal titolo del paragrafo. Dopo aver letto il testo, trova cosa non torna."* In tre casi l'errore è particolarmente adatto:
- la leva senza vantaggio meccanico (ENE-3-01 §4);
- il calcolo sbagliato con i numeri primi (INF-2-02 §3);
- la variabile che contiene molti valori (INF-1-02 §4).

Se l'immagine resta come attività, il testo deve dire esplicitamente che contiene un errore. Altrimenti va sostituita.

## 2. Immagini da sostituire con uno schema (14)

| MC | § | Paragrafo | Problema |
|---|---|---|---|
| MC-ALI-2-01 | 3 | Come le piante si nutrono: la fotosintesi e i nutrienti del suolo | Sole, radici e molecole generiche: non mostra CO2, acqua, O2 e glucosio, cioè gli elementi della fotosintesi |
| MC-ALI-2-02 | 4 | Come leggere un'etichetta alimentare: decodificare ciò che c'è scritto | Etichetta illeggibile e inventata: serve un'etichetta reale annotata |
| MC-ALI-2-05 | 5 | I simboli sul packaging: cosa significano davvero | Simboli generici, non quelli normati (Mobius loop, codici materiale, CONAI): serve tavola dei simboli reali |
| MC-AMB-2-02 | 7 | Le classi energetiche degli edifici — dalla G alla A4 | Frecce colorate senza lettere G–A4: la scala delle classi non si legge |
| MC-AMB-2-02 | 8 | Come si legge una bolletta elettrica | Bolletta illeggibile: serve fac-simile reale annotato |
| MC-AMB-2-04 | 2 | L'orientamento solare: perché le finestre a sud non sono casuali | Rosa dei venti ambigua: non si capisce l'orientamento a sud delle vetrate |
| MC-AMB-2-04 | 4 | La massa termica: il muro che accumula calore | Mostra il calore che attraversa il muro, non l'accumulo e il rilascio ritardato (sfasamento) tipici della massa termica |
| MC-AMB-2-05 | 2 | Il ciclo artificiale dell'acqua in sei fasi | Sequenza di impianti senza fasi riconoscibili: serve schema delle sei fasi |
| MC-COM-3-02 | 3 | Compressione: come si riduce un file senza perdere (troppo) | Metafora della morsa fuorviante: la compressione elimina ridondanza, non "schiaccia" i dati |
| MC-DIG-2-01 | 4 | Scratch: l'ambiente di programmazione a blocchi | Interfaccia simil-Scratch con blocchi inventati: meglio uno screenshot reale dell'editor |
| MC-DIS-1-02 | 4 | I formati dei fogli: la famiglia ISO 216 | Fogli A0–A4 sovrapposti a ventaglio con dimensioni simili: non si vede che ogni formato è la metà del precedente |
| MC-DIS-2-02 | 5 | Confronto tra i due tipi: quando scegliere quale | I due pezzi a confronto sembrano quasi uguali: la differenza tra cavaliera e isometrica non si vede |
| MC-ENE-3-02 | 6 | L'effetto serra e il cambiamento climatico | Frecce che escono dalla Terra senza rinvio verso il suolo: il meccanismo dell'effetto serra non si vede |
| MC-MAT-1-03 | 4 | Il quadro comparativo | Barre senza scala né legenda: il quadro comparativo non si legge |

Per questi paragrafi lo strumento giusto è uno schema didattico (SVG o disegno controllato), non un'immagine generata: il modello non garantisce scale, proporzioni e simboli normati.

## 3. Immagini decorative (11)

| MC | § | Paragrafo | Problema |
|---|---|---|---|
| MC-ALI-2-03 | 2 | I macronutrienti: cosa sono, dove si trovano, cosa fanno | Macronutrienti: un elenco di nutrienti è meglio come tabella che come scena |
| MC-ALI-2-03 | 3 | I micronutrienti: piccole quantità, effetti enormi | Micronutrienti: concetto astratto, l'immagine resta decorativa |
| MC-AMB-2-03 | 3 | Il Piano Regolatore — cos'è, chi lo fa, cosa stabilisce | Il Piano Regolatore è un documento: meglio un estratto reale di PRG |
| MC-COM-3-02 | 4 | Diritto d'autore: come funziona in Italia e quanto dura | Diritto d'autore: concetto giuridico, immagine decorativa |
| MC-COM-3-02 | 5 | Plagio vs. citazione: la differenza pratica | Plagio vs citazione: meglio un esempio testuale affiancato |
| MC-DIG-2-01 | 9 | Caso studio: l'algoritmo di raccomandazione di YouTube, spiegato con la logica dei blocchi | Caso studio sull'algoritmo di raccomandazione: immagine decorativa |
| MC-DIG-2-02 | 3 | Il GDPR semplificato: i tuoi diritti | GDPR: concetto giuridico, meglio l'elenco dei diritti |
| MC-DIG-3-04 | 2 | I quattro principi WCAG | Principi WCAG: meglio una tabella con esempi |
| MC-INF-1-02 | 5 | Bug e debug: quando l'algoritmo sbaglia | Bug e debug: meglio un frammento di codice con l'errore |
| MC-SIS-3-01 | 6 | PIL, benessere e i limiti della misura economica | PIL e benessere: meglio un grafico con dati reali |
| MC-SIS-3-03 | 2 | Le forme giuridiche di un'impresa | Forme giuridiche: meglio una tabella comparativa |

Si possono togliere dalla sezione ESPLORA e lasciare solo nella galleria visuale, oppure sostituire con una tabella o un esempio concreto.

## 4. Osservazioni generali

- **Le immagini funzionano meglio come aggancio** (apertura di sezione, casi studio, luoghi e oggetti concreti) che come spiegazione.
- **Lo stile è uniforme** (luce calda, ologrammi ciano e ambra) su tutte le 432 immagini: dopo poche pagine perde forza. Conviene mostrarne meno, per esempio solo nei paragrafi marcati "tieni" che aprono la sezione o presentano un caso studio.
- **Dettagli da correggere senza rigenerare:**
  - INF-2-02 §4 parla di "lucchetto verde": oggi i browser non lo mostrano più colorato;
  - DIG-1-02 §5 usa il dominio .gov, che è statunitense: in classe va affiancato a .gov.it ed .edu.it.

## Prossimi passi proposti

1. Decidere, per le 11 immagini con errore, se diventano attività "trova l'errore" o se vanno sostituite.
2. Realizzare i 14 schemi, partendo da quelli di ENE e INF.
3. Togliere o spostare le 11 immagini decorative.

## Aggiornamento dell'8 novembre 2026: sostituzioni eseguite

Le 25 immagini dei gruppi 1 e 2 sono state sostituite con **schemi didattici vettoriali**, disegnati sulla base del testo di ciascun paragrafo:
- 11 immagini con errori di contenuto;
- 14 immagini che non mostravano il concetto.

- Nel sito, la didascalia di queste immagini dice «Schema didattico (disegno vettoriale, non generato con IA)». In galleria compare la motivazione della sostituzione.
- Nei manifest, `fonte` vale `"schema"` e `audit.esito` vale `"sostituita-con-schema"`. Il prompt dell'immagine sostituita resta in `prompt_precedente`.
- I sorgenti SVG e gli script che li generano sono in `scripts/esplora-immagini/schemi/`.

Le 11 immagini decorative (gruppo 3) non sono state toccate.
