# Proposta — Pagina «Versioni» del Book ProfTecnologIA

Versione della proposta: 1.0 · 16 novembre 2026 · da approvare prima della pubblicazione

## Cosa propongo

- Una nuova pagina **/versioni** con il titolo «Le versioni del libro». Ci si arriva cliccando il badge di versione nell'intestazione e nel piè di pagina, e c'è anche un link nel piè di pagina.
- Il badge passa da **v0.1** a **v0.5**.
- La storia è ricostruita dai 316 commit del sito, dal 10 maggio al 15 novembre 2026, raggruppati in cinque versioni per tema.
- I dati stanno in un solo file, `lib/versioni.ts`. Badge e pagina li leggono da lì: per una nuova versione si aggiorna solo quel file.

## Come si numerano le versioni

| Numero | Quando cambia | Esempio |
|--------|---------------|---------|
| 0.**x** | Arriva un insieme nuovo di funzioni: una nuova area del sito o un nuovo tipo di attività | 0.4 → esplorazioni immersive |
| 0.x.**y** | Correzioni e piccoli miglioramenti | 0.5.1 → correzione dell'evidenziatore sulle formule |
| **1.0** | Lo decidi tu: il libro diventa l'edizione ufficiale per l'anno scolastico | da decidere |

Le versioni 0.x.y non hanno una scheda propria sulla pagina. Restano nella storia dei commit su GitHub.

### Una scelta da fare: restare sotto 1.0 o no

- **A (consigliata): versione attuale 0.5.** La 1.0 si tiene per un traguardo che decidi tu, per esempio dopo il controllo completo di accessibilità e una prova con le classi. Il vantaggio è che la 1.0 ha un significato preciso.
- **B: versione attuale 1.3.** La 1.0 coincide con il nuovo nome «Book ProfTecnologIA» (31 ottobre). Comunica che il libro è già in uso, ma la 1.0 cadrebbe su un cambio di nome e non su un traguardo didattico.

## Le versioni: testo della pagina

Le versioni compaiono dalla più recente alla più vecchia. Quella attuale ha l'etichetta «Versione attuale». Ogni voce porta, dove c'è, alla pagina della funzione.

### v0.5 — Disegno, GeoGebra e strumenti per la classe · 13–15 novembre 2026 · Versione attuale

- **Costruzioni geometriche**: 114 tavole GeoGebra da seguire passo per passo, raccolte in una pagina dedicata e utilizzabili anche dal telefono e sulla LIM.
- **Proiezioni ortogonali**: il proiettore ortogonale e 18 tavole guidate, anche nella versione «foglio tecnico».
- **Assonometrie**: l'Assonometro (cavaliera, isometrica, monometrica, militare, dimetrica, trimetrica) e 6 tavole guidate. Il docente può assegnare un esercizio con un codice o un QR.
- **Officina dei motivi modulari**: 17 tavole, la costruzione animata e la stanza in 3D.
- **Riga e squadre che si muovono** nelle tavole, come sul foglio.
- **Lezione della settimana** in home, secondo il calendario scolastico: teoria + disegno o coding.
- **Pagina Docenti** per pianificare l'anno, fino a 9 classi.
- **«Segui il joule»**: un libro 3D sull'energia in 5 lezioni.
- **Evidenziatore giallo** sui concetti chiave dei testi ESPLORA, in tutte le 58 MC.

### v0.4 — Esplorazioni immersive · 10–13 novembre 2026

- **11 esplorazioni immersive**: centrale idroelettrica, centrale termoelettrica, impianto di selezione dei rifiuti, la casa e i suoi impianti, dalla sorgente al depuratore, la bicicletta, dove vive Internet, lo scheletro dell'edificio, l'acciaieria, il frantoio, il motore a quattro tempi.
- Dentro ogni esplorazione si scende di livello in livello, con un menu ad albero.
- **Tre lingue** (italiano, inglese, francese), **lettura ad alta voce** (in italiano con la voce dell'autore) e **visita guidata**.
- Pulsante **Condividi**: link, codice per incorporare e QR.
- Le scene visitate compaiono nella pagina **Progressi**.
- **Ricerca globale** su lezioni, laboratori, escape room, esplorazioni, glossario e pagine.
- Colonna laterale più compatta, che si può nascondere.

### v0.3 — Book ProfTecnologIA: laboratori, video e immagini · 31 ottobre – 9 novembre 2026

- Nuovo nome e nuovo indirizzo: **book.proftecnologia.it**.
- **Un laboratorio interattivo per ogni MC (58)**, con verifiche di fine livello e modalità LIM a passi.
- **Escape room** per tutte le 58 MC.
- **58 video animati** con voce narrante, dal canale YouTube ProfTecnologIA, dentro i paragrafi di ESPLORA.
- **Un'immagine per ogni paragrafo** di ESPLORA (circa 440). Dove un'immagine non bastava, ci sono schemi didattici disegnati.
- Testi riorganizzati: il nucleo «In breve» è sempre aperto, gli approfondimenti si aprono a richiesta.
- Compiti di realtà con un destinatario reale; quiz con le risposte in ordine casuale.
- Collegamenti diretti alle schede di una MC (#esplora, #sperimenta, #agisci, #ripassa).
- Testo più leggibile sul telefono.

### v0.2 — Il libro completo · 5–20 luglio 2026

- Nuova grafica, con un carattere ad alta leggibilità (Atkinson Hyperlegible).
- **58 MC**: arrivano Pensiero computazionale, Benessere digitale e le 6 MC di Informatica.
- **8 schede per MC**: si aggiungono PROFESSIONI (due professioni per MC, ognuna con il suo racconto) e CLIL (lessico italiano–inglese).
- **Presentazioni a slide** in apertura di ESPLORA per tutte le 58 MC.
- **Badge dell'Agenda 2030** e pagina **Progressi**, con le sessioni degli studenti.
- Ricerca rapida e **glossario delle competenze** (503 voci).
- Infografiche di processo, sketchnote nel ripasso, immagini dei compiti di realtà, QR dell'assistente IA.
- Immagini più leggere: le pagine si caricano più in fretta.
- Prime costruzioni GeoGebra: la perpendicolare e le prime costruzioni animate.

### v0.1 — Prima edizione online · 10–16 maggio 2026

- **50 MC** con le 6 schede: INNESCA, ESPLORA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA.
- **Audio dell'aggancio** in forma di podcast, con trascrizione.
- **Video YouTube** selezionati per ogni MC (492 in tutto).
- **Quiz da 18 domande** su tre livelli, **flashcard** e **microlearning**.
- Immagini per ogni MC e pagina **Credits**, con la dichiarazione sull'uso dell'IA.
- Accessibilità secondo le WCAG 2.2 AA.

## Come appare la pagina

- In alto il titolo, una riga di presentazione («Il libro cresce: qui trovi che cosa è cambiato in ogni versione») e il numero della versione attuale.
- Sotto, una linea del tempo verticale con una scheda per ogni versione: numero, nome, date e da 5 a 9 novità.
- Tutto con i colori e i caratteri già usati nel sito, leggibile dal telefono.
- Niente codici di commit e niente termini tecnici: la pagina è scritta per studenti, famiglie e docenti.

## Cosa cambia nel codice

| File | Modifica |
|------|----------|
| `lib/versioni.ts` | nuovo: elenco delle versioni e versione attuale |
| `app/versioni/page.tsx` | nuovo: la pagina |
| `components/SiteHeader.tsx`, `components/SiteFooter.tsx` | il badge legge la versione da `lib/versioni.ts` e porta a /versioni |
| `app/indice-ricerca.json/route.ts` | la pagina entra nella ricerca |
| `CLAUDE.md` | regola: a ogni gruppo di novità si aggiorna `lib/versioni.ts` |

## Da decidere prima di pubblicare

1. Numerazione: **A** (v0.5, consigliata) o **B** (v1.3)?
2. Il nome della pagina: «Le versioni del libro» oppure «Novità»?
3. Va aggiunto qualcosa che manca, o va tolto qualcosa che non vuoi mostrare?
