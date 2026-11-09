# Brief — Rigenerazione asset delle 9 MC riallineate al testo

**Data:** 9 novembre 2026 · **Autore:** Ing. Antonio Scaramuzzino · **Stato:** asset nascosti dal sito, in attesa di rigenerazione

## 1. Perché serve

In 9 MC il testo pubblicato tratta un tema diverso dalla scheda JSON originale. Il 9 novembre è stato deciso che vale il testo: i JSON sono stati riallineati, ma immagini con contenuto e hook audio erano stati generati sul vecchio tema. Gli hook sono già stati rifatti; le immagini sono nascoste dal sito in attesa di rigenerazione.

| MC | Vecchio tema (asset attuali) | Tema del testo (da illustrare) |
|----|------------------------------|--------------------------------|
| MC-ALI-2-05 | Sprechi alimentari | Packaging alimentare e sostenibilità |
| MC-ALI-2-06 | Cibo, cultura e biodiversità | Innovazione alimentare e nuove tecnologie |
| MC-AMB-2-04 | Materiali da costruzione | Architettura bioclimatica ed efficienza energetica |
| MC-AMB-2-05 | Smart city | Il ciclo artificiale dell'acqua |
| MC-AMB-2-06 | Rischio idrogeologico | Smart city: sensori, dati aperti e partecipazione |
| MC-DIG-2-03 | Il sistema operativo | Organizzare il computer: file, backup e privacy |
| MC-MAT-1-05 | Scegliere il materiale giusto | I metalli: proprietà, lavorazione e riciclo |
| MC-MAT-1-06 | Biomateriali e bioplastiche | Fibre, plastiche e compositi |
| MC-SIS-3-04 | Qualità e certificazioni | Orientamento al futuro professionale |

In più, l'infografica di **MC-DIG-2-04** è nascosta perché presenta il lucchetto HTTPS come difesa dal phishing (vedi §5).

## 2. Cosa è nascosto e come rimetterlo online

Per ognuna delle 9 MC il sito non mostra:

| Asset | Nome file | Dove compariva |
|-------|-----------|----------------|
| Sketchnote di ripasso | `MC-XXX_ripassa-sketchnote-playground-densa.webp` (+ `ripassa-sketchnote.*`) | RIPASSA |
| Immagine del compito | `MC-XXX_compito_realta_playground_v1.webp` | AGISCI |
| Infografica di processo | `MC-XXX_infografica_processo_playground_v1.webp` | OSSERVA (solo ALI-2-05, AMB-2-06, DIG-2-03, MAT-1-06, SIS-3-04) |
| Mappa concettuale | `MC-XXX_mindmap.webp` | Galleria ESPLORA |
| Tavola da testo | `MC-XXX_immagine_da_md.svg/.webp` | Galleria ESPLORA |

Restano visibili copertina (`ai-fotorealistica`), foto di contesto e ritratti delle professioni.

**Per ripubblicare** un asset rigenerato: salvarlo con lo stesso nome file nella cartella `public/assets/visual/MC-XXX/` (o `audio/`), poi togliere la MC dall'elenco `MC_ASSET_FUORI_TEMA` in `lib/asset-fuori-tema.ts`. Se si ripubblicano solo alcuni tipi, restringere `TIPI_CONTENUTO` per quella MC.

**Mappa concettuale e tavola da testo** non vanno riscritte a mano: sono prodotte da un generatore che legge il JSON della MC, ora corretto. Basta rilanciarlo (il generatore non è nel repository del sito).

**Già fatto:** gli hook audio delle 9 MC sono stati riscritti sul tema del testo e rigenerati con edge-tts (v2.0, 9 novembre): MP3, trascrizioni e durate nel JSON sono aggiornati e l'audio è di nuovo online. La copertina di AMB-2-05 (plastico di smart city, senza testo) è stata copiata come copertina di AMB-2-06. AMB-2-05 resta con quella copertina finché non se ne genera una sull'acqua.

## 3. Specifiche di stile comuni

Formato **16:9, 1672 × 941 px**, WebP. Tutti i testi in italiano, da controllare lettera per lettera prima della pubblicazione: le v1 di ALI-2-02 ("Cenfezione") ed ENE-3-05 ("marchina") sono uscite con refusi.

**Infografica di processo (stile "playground").** Sfondo chiaro. Titolo grande blu scuro in alto a sinistra, sotto il codice MC con barretta gialla. A sinistra 4 riquadri con icona e testo breve ("Parola chiave: spiegazione"). Al centro un oggetto fotorealistico protagonista. Intorno 6-7 passaggi numerati in cerchi fotografici collegati da frecce. A destra un riquadro di dettaglio o legenda. In basso un banner con spunta e il messaggio chiave, più una catena di icone.

**Sketchnote di ripasso.** Disegno a pennarello su fondo bianco, accenti verde acqua, arancio e rosso. Etichetta "RIPASSA" in alto a sinistra, titolo al centro in un riquadro, 10 nodi numerati con disegnini ed etichette brevi in stampatello, uno studente disegnato. In basso la fascia "CHE COSA DEVO RICORDARE?" con 5 icone e frasi brevi. In un angolo "ID SCHEDA: MC-XXX".

**Immagine del compito.** Scena fotorealistica di scrivania con i materiali del compito. Titolo grande in alto a sinistra, sotto "MC-XXX — titolo MC". A sinistra i riquadri "Scenario" (3 punti con icona) e "Materiali". A destra "Passaggi" (4 icone numerate) e "Criteri" (checklist). In basso la catena dei 4 passaggi.

**Copertina.** Foto o plastico fotorealistico, luce morbida, **nessun testo e nessun marchio**.


## 4. Brief per MC

### MC-ALI-2-05 — Packaging alimentare e sostenibilità

**Copertina.** Still life su piano chiaro: bottiglia di vetro, lattina, brick in cartone, vaschetta di plastica trasparente, sacchetto di carta, busta di patatine gonfia. Nessuna etichetta leggibile.

**Infografica — "Il viaggio di una confezione".** Passaggi: 1 Progetto · 2 Materiale · 3 Riempimento e chiusura · 4 Trasporto · 5 Scaffale ed etichetta · 6 Uso · 7 Raccolta e riciclo. Riquadri a sinistra: *Protegge: dagli urti* · *Conserva: barriera contro aria, umidità, microbi* · *Informa: ingredienti, allergeni, scadenza* · *Convince: colori e scritte*. A destra una tabella pro/contro di plastica, vetro, metallo, carta e cartone. Banner: "Una confezione fa cinque lavori: sceglila con la testa".

**Sketchnote.** Titolo "PACKAGING ALIMENTARE E SOSTENIBILITÀ". Nodi:
1. cinque lavori della confezione
2. protegge (le uova)
3. conserva: barriera e atmosfera protettiva
4. informa: ingredienti, allergeni, scadenza, peso, produttore
5. convince: "naturale" non ha una definizione di legge
6. facilita il trasporto
7. i materiali e i loro limiti
8. over-packaging
9. alternative: bioplastiche (compostabili solo in impianto), packaging edibile, riciclato, riutilizzabile con deposito
10. simboli e codici di riciclo

Fascia finale: leggo i simboli · scelgo meno strati · separo i materiali · "bio" non vuol dire che si degrada ovunque · preferisco il riutilizzabile.

**Compito — "Audit del packaging".** Scenario: audit degli imballaggi della mensa, con prima una prova individuale su un pasto. Materiali: imballaggi del pasto, scheda audit, guida alla differenziata del comune, penna. Passaggi: Raccogli → Classifica il materiale → Verifica riciclabilità e smaltimento → Proponi alternative. Criteri: completezza, materiali e simboli corretti, over-packaging riconosciuto, proposte realistiche.


### MC-ALI-2-06 — Innovazione alimentare e nuove tecnologie

**Copertina.** Laboratorio-cucina luminoso: insalate in una vertical farm sotto LED viola, barattolo di farina di grillo, piccola stampante 3D alimentare, tablet con la mappa di un campo ripreso da drone.

**Sketchnote.** Titolo "INNOVAZIONE ALIMENTARE". Nodi:
1. quasi 10 miliardi di persone, terra coltivabile già occupata
2. agricoltura di precisione: sensori, droni, dati
3. vertical farming: LED, meno acqua e suolo
4. fermentazione moderna
5. carne coltivata
6. insetti come proteine
7. stampa 3D alimentare
8. tracciabilità: QR code e blockchain
9. come valutare: benefici, limiti, costi, accettazione
10. nessuna tecnologia miracolosa

**Compito — "Scheda blog: la tecnologia che nutre il futuro".** Passaggi: Scegli una tecnologia → Informati su fonti affidabili → Scrivi (titolo-domanda, cos'è, com'è oggi, perché è utile, limiti) → Rivedi (max 300 parole). Criteri: chiarezza, dati verificati, equilibrio tra benefici e limiti, linguaggio accessibile.


### MC-AMB-2-04 — Architettura bioclimatica ed efficienza energetica degli edifici

**Copertina.** Plastico in sezione di una casa orientata a sud: grandi finestre a sud, sporto del tetto, tetto verde, muri spessi. Due raggi di luce: sole estivo alto (fermato dallo sporto) e sole invernale basso (che entra).

**Sketchnote.** Titolo "ARCHITETTURA BIOCLIMATICA". Nodi:
1. costruire con il clima
2. orientamento: finestre a sud
3. sole estivo alto, sole invernale basso: lo sporto
4. massa termica
5. isolamento: trasmittanza U e ponti termici
6. ventilazione naturale: effetto camino e ventilazione incrociata
7. tetti e facciate verdi
8. conduzione, convezione, irraggiamento
9. certificazioni LEED, BREEAM, CasaClima
10. caso: scuola Copernico di Torino, CasaClima A4

**Compito — "Analisi bioclimatica della mia scuola".** Materiali: bussola o app, pianta della scuola, scheda di analisi, smartphone per le foto. Passaggi: Orienta → Osserva l'involucro (finestre, muri, tetto) → Valuta ventilazione e verde → Proponi tre interventi. Criteri: orientamento corretto, osservazioni documentate, interventi motivati e realistici.


### MC-AMB-2-05 — Il ciclo artificiale dell'acqua

**Copertina.** Plastico in sezione: sorgente e pozzo, impianto di potabilizzazione, serbatoio sopraelevato, tubature sotto la strada fino a una casa, fognatura, depuratore che restituisce l'acqua al fiume.

**Infografica (facoltativa) — "Dal rubinetto al depuratore".** Le sei fasi del testo: 1 Captazione · 2 Potabilizzazione (sedimentazione, filtrazione, disinfezione) · 3 Distribuzione · 4 Uso (circa 220 litri a persona al giorno) · 5 Fognatura e raccolta · 6 Depurazione e restituzione. Riquadro di dettaglio: perdite di rete.

**Sketchnote.** Titolo "IL CICLO ARTIFICIALE DELL'ACQUA". Nodi:
1. due cicli, naturale e artificiale
2. captazione
3. potabilizzazione
4. distribuzione e torri dell'acqua
5. uso, circa 220 L a testa al giorno
6. fognatura
7. depuratore
8. perdite di rete
9. acque piovane e pavimenti drenanti
10. impronta idrica e scarsità (Cape Town 2018)

**Compito — "Dossier acqua della mia scuola".** Quattro parti: 1 L'acqua che usiamo (stima del consumo annuo) · 2 Dove sprechiamo · 3 L'acqua che consumiamo a casa · 4 La proposta. Materiali: scheda dossier, calcolatrice, eventuale bolletta della scuola, smartphone per documentare gli sprechi.


### MC-AMB-2-06 — Smart city: sensori, dati aperti e partecipazione

**Copertina.** Già sostituita con il plastico di smart city che prima era la copertina di AMB-2-05.

**Infografica — "Dal sensore al servizio, e per chi?".** Passaggi: 1 Sensore (traffico, aria, lampioni, cassonetti) · 2 Dato · 3 Centrale di controllo · 4 Open data pubblicati · 5 Servizio migliore · 6 Partecipazione dei cittadini (app di segnalazione, bilancio partecipativo). Riquadri: *Sensori: misurano la città* · *Open data: dati di tutti* · *Partecipazione: i cittadini decidono* · *Equità: chi resta fuori?*. Banner: "Una città è intelligente se lo è per tutti".

**Sketchnote.** Titolo "SMART CITY: PER CHI?". Nodi:
1. definizione
2. sensori urbani
3. semafori sul traffico vero
4. lampioni con sensore
5. cassonetti che segnalano
6. open data (dati.gov.it)
7. app di segnalazione
8. bilancio partecipativo
9. mobilità condivisa
10. chi resta escluso: senza smartphone, senza internet, anziani

Esempi: Copenhagen, Milano con la ZTL.

**Compito — "Soluzione smart per il quartiere".** Scenario: bando comunale "Smart School for Smart City", 3.000 € al progetto vincitore. Passaggi: Problema → Dati → Tecnologia → Benefici e costi. Criteri: problema reale e documentato, soluzione fattibile, costi stimati, attenzione a chi ne beneficia.
*Nota:* l'attuale immagine del compito di AMB-2-05 ("Soluzione smart per il quartiere") ha già questo contenuto, ma riporta stampato il codice MC-AMB-2-05: va rigenerata con il codice giusto.


### MC-DIG-2-03 — Organizzare il computer: file, backup e privacy

**Copertina.** La copertina attuale (scrivania con monitor) è neutra e può restare. Alternativa: scrivania con computer che mostra cartelle ordinate, chiavetta e disco esterno.

**Infografica — "Dalla cartella caotica al sistema ordinato".** Passaggi:
1. desktop caotico ("relazione DEFINITIVA vera2")
2. albero delle cartelle (Scuola › anno › materie; Archivio)
3. nome del file `2026-03-15_tecnologia_relazione-energia_v02`
4. backup 3-2-1: tre copie, due supporti, un altro luogo
5. aggiornamenti e pulizia dei programmi
6. cloud: comodità e rischi
7. privacy del browser: cookie di terze parti

Banner: "Il computer in ordine non è talento, è metodo".

**Sketchnote.** Titolo "ORGANIZZARE IL COMPUTER". Nodi:
1. un posto per ogni cosa
2. massimo tre clic
3. desktop e Download si svuotano
4. nome = data_materia_argomento_versione
5. regola 3-2-1
6. backup automatico
7. aggiornamenti
8. disinstallare ciò che non serve
9. cloud: fa da backup ma non deve essere l'unica copia
10. cookie e modalità privata

**Compito — "Guida pratica: il mio computer in ordine".** Passaggi: Fotografa la situazione di partenza → Costruisci cartelle e nomi → Configura il backup → Scrivi un consiglio per chi inizia. Criteri: situazione descritta con numeri, sistema coerente, piano di backup realistico.


### MC-MAT-1-05 — I metalli: proprietà, lavorazione e riciclo

**Copertina.** Still life di metalli: lamiera d'acciaio, foglio d'alluminio, tubo e filo di rame, bullone in ottone, pezzo arrugginito, tubo di telaio da bicicletta.

**Sketchnote.** Titolo "I METALLI". Nodi:
1. perché dominano l'industria
2. dalla roccia all'oggetto: minerale (ematite, bauxite) e altoforno
3. ghisa, ferro, acciaio
4. alluminio: leggero ma costoso in energia
5. rame: il conduttore
6. leghe: acciaio inossidabile, bronzo, ottone
7. corrosione
8. trattamenti termici: tempra
9. riciclo quasi infinito dell'acciaio
10. proprietà tecnologiche: come si lavorano

**Compito — "Scheda tecnica dei metalli attorno a me".** Passaggi: Scegli tre oggetti (uno all'esterno, uno a contatto con cibo o acqua, uno sotto sforzo) → Identifica il metallo (colore, calamita, peso) → Analizza proprietà e corrosione → Valuta il riciclo. Materiali: calamita, schede, lente, smartphone.


### MC-MAT-1-06 — Fibre, plastiche e compositi

**Copertina.** Still life: tessuti di cotone, lana e poliestere, granuli di plastica, tubo in fibra di carbonio, pezzo di vetroresina.

**Infografica — "Anatomia di una giacca tecnica"** (è il caso di OSSERVA). Strati:
1. strato esterno in nylon con trattamento DWR
2. membrana in PTFE espanso
3. fodera in poliestere microfibra
4. cerniere e cuciture nastrate
5. fine vita: materiali accoppiati, difficili da separare

Riquadro: confronto con la giacca di lana (340 g contro 1,4 kg). Banner: "Ogni materiale ha un costo nascosto: leggilo sull'etichetta".

**Sketchnote.** Titolo "FIBRE, PLASTICHE E COMPOSITI". Nodi:
1. tre famiglie di materiali
2. cotone: circa 2.700 L d'acqua per una maglietta
3. lana: l'aria intrappolata
4. lino: la fibra più leggera per l'ambiente
5. seta
6. poliestere e nylon dal petrolio
7. microplastiche al lavaggio
8. le plastiche sono polimeri
9. compositi: fibra di carbonio, vetroresina, cemento armato
10. leggere l'etichetta: "bio", "eco", "compostabile"

**Compito — "Analisi delle etichette".** Scenario: rapporto per un'associazione di consumatori. Passaggi: Leggi l'etichetta → Classifica i materiali → Verifica biodegradabilità e microplastiche → Giudica le diciture. Criteri: composizione copiata esatta, classificazione corretta, giudizio motivato sulle diciture.


### MC-SIS-3-04 — Orientamento al futuro professionale

**Copertina.** Scrivania con una mappa di orientamento disegnata a mano, post-it, tablet con annunci di lavoro e piccoli oggetti simbolo di mestieri: casco da cantiere, stetoscopio, modellino di pannello solare, tavolozza.

**Infografica — "Dalla conoscenza di sé alla scelta".** Passaggi:
1. interessi (RIASEC: Realistico, Investigativo, Artistico, Sociale, Intraprendente, Convenzionale)
2. competenze tecniche dalle MC
3. competenze trasversali
4. le quattro forze del lavoro: automazione, transizione ecologica, invecchiamento, digitalizzazione
5. offerte di lavoro reali
6. tre percorsi possibili
7. un'area di crescita

Banner: "Non serve sapere oggi che lavoro farai: serve sapere che cosa ti piace e che cosa sai fare".

**Sketchnote.** Titolo "CHE LAVORO FARAI?". Nodi:
1. quattro forze che cambiano il lavoro
2. le macchine sostituiscono compiti, non mestieri
3. compiti ripetitivi a rischio
4. compiti umani che resistono
5. professioni in crescita
6. STEM gap
7. competenze trasversali
8. modello RIASEC
9. offerte di lavoro reali
10. la mia mappa competenze → professioni

**Compito — "La mia mappa competenze → professioni".** Passaggi: Raccogli le MC del triennio → Fai il test RIASEC → Analizza tre offerte di lavoro → Disegna la mappa e presentala. Criteri: competenze con esempi concreti, percorsi coerenti, area di crescita individuata.


## 5. MC-DIG-2-04 — Infografica corretta "Dal phishing alla protezione"

**Errore da correggere.** Nella versione attuale la fila "Protezione" mostra `https://sito-sicuro.it`, "Connessione sicura" e "Certificato valido" come se garantissero un sito affidabile. È falso: la maggior parte dei siti di phishing ha un certificato valido e il lucchetto. Il riquadro sulla cifratura con chiave pubblica e privata è corretto, ma appartiene a MC-INF-2-02.

**Nuova versione.**
- **Fila "Attacco":** 1 Messaggio urgente · 2 Link a un indirizzo falso · 3 Pagina di login identica all'originale · 4 Credenziali rubate.
- **Fila "Protezione":**
  1. Fermati: l'urgenza è un segnale
  2. Controlla mittente e indirizzo
  3. Non cliccare: digita tu l'indirizzo del sito ufficiale
  4. Password diversa per ogni account (password manager)
  5. Autenticazione a due fattori
  6. Segnala
- **Riquadro di avviso:** "Il lucchetto dice solo che la connessione è cifrata, non che il sito è di chi dice di essere".
- **Banner:** "Prima di cliccare, verifica".

Rimuovere il riquadro "Come funziona la cifratura". Salvare come `MC-DIG-2-04_infografica_processo_playground_v2.webp`, poi togliere la voce `MC-DIG-2-04` da `lib/infografiche-placement.ts`. La regola di default mostra in OSSERVA la versione più recente.

## 6. Da verificare a parte

- **Riferimenti IN.** Verificati il 9 novembre sugli estratti del testo definitivo pubblicati dalle scuole (il PDF del MIM non era raggiungibile): sei MC usano formule che corrispondono a traguardi di Tecnologia; per AMB-2-06, SIS-3-04 e DIG-2-03 il riferimento è stato sostituito con il traguardo più vicino. Conviene un ultimo confronto con la copia del decreto in `09_INDICAZIONI_NAZIONALI/`.
- **Matrice.** `01_MATRICE_MC/` allineata il 9 novembre sul branch `refactor/mc-template-v2` (commit 53864a0): sul Mac basta un `git pull` di quel branch.
- **Badge SDG.** Aggiunti i badge SDG 6 (acqua pulita) e SDG 14 (vita sott'acqua): ora sono gli SDG principali di AMB-2-05 e MAT-1-06, come indicano i testi.
- **Nomi UDA.** I testi citano UDA con nomi diversi da quelli nel JSON (per esempio "Dal campo alla tavola" e "La Città che Vorrei" per UDA-2). Non è stato toccato.
