# MC-AMB-2-06 — Una città può essere intelligente? E intelligente per chi?
**Area:** Abitazione, Città, Territorio · **Anno:** 2ª · **Livello DigComp:** Intermediate (I)
**SDG:** 11 — Città e comunità sostenibili · 9 — Innovazione e infrastrutture · **Fonte:** originale
**Struttura:** 4 pagine (MC avanzata) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il semaforo che ti conosce"**
> 🎧 *Ascolta prima di leggere. Durata: 41 sec.*

**Script del podcast:**

Immagina di stare andando in bicicletta verso scuola. Quando arrivi all'incrocio principale, il semaforo diventa verde prima del solito — non per caso, ma perché un sensore sotto l'asfalto ha rilevato che sei in bici, e l'algoritmo della città ha deciso di darti priorità rispetto alle auto.

Due isolati più avanti, un cassonetto dei rifiuti ha un sensore di riempimento. Questa mattina ha mandato un messaggio al centro di controllo: è pieno all'85%, conviene passarlo a svuotare nel giro di mille pomeriggio. Nessuno lo ha controllato fisicamente — lo sa il sistema.

A scuola, le finestre dell'aula si aprono automaticamente perché un sensore di CO₂ ha rilevato che la concentrazione nell'aria ha superato i 1.000 ppm — il livello oltre il quale la capacità di concentrazione degli studenti comincia a calare.

Tutto questo accade adesso, in alcune città europee. Non è fantascienza. Ma solleva una domanda che merita risposta: chi decide come funzionano questi sistemi? Chi ha accesso ai dati che raccolgono? E una città più "efficiente" è automaticamente più giusta?

**Domanda di avvio:**
Pensa al quartiere della tua scuola. Qual è il problema più fastidioso che vedi ogni giorno — il traffico, la spazzatura abbandonata, le luci spente di notte, i marciapiedi rotti? Esiste già una tecnologia che potrebbe risolverlo? E chi dovrebbe pagarla?

---

## 📖 ESPLORA

### Una smart city non è un videogioco

Il termine "smart city" (città intelligente) è diventato così di moda da perdere quasi significato. Lo usano i marketing manager delle aziende tecnologiche per vendere prodotti. Lo usano i politici per promettere futuro. Lo usano i consulenti per giustificare consulenze.

Dietro la retorica, c'è un'idea precisa: **una città che usa dati per migliorare i servizi ai propri cittadini**. Non la tecnologia per sé stessa. Non le app per le app. I dati come strumento per prendere decisioni migliori su come gestire il traffico, i rifiuti, l'energia, i trasporti, la sicurezza.

Ma questa definizione apre immediatamente una domanda che non è tecnica: migliori per chi? Più efficiente per chi? I dati sono raccolti su tutti i cittadini, ma le decisioni prese con quei dati non necessariamente avvantaggiano tutti allo stesso modo.

Questa MC esplora la smart city come **scelta urbanistica e politica**, non come catalogo di gadget tecnologici. La tecnologia IoT (Internet of Things) — i sensori, i dispositivi connessi, le reti di trasmissione dati — è trattata in dettaglio in MC-INF-3-01. Qui ci concentriamo su cosa quelle tecnologie fanno alla città e alle persone che ci vivono.

---

### I sensori urbani: cosa misurano e perché

Una smart city è pervasa di sensori — dispositivi che misurano grandezze fisiche e trasmettono i dati a sistemi centrali. Ecco i principali e cosa fanno:

**Sensori per il traffico:**
- **Spire induttive:** bobine di filo metallico nello strato superficiale dell'asfalto. Quando un veicolo metallico passa sopra, altera il campo magnetico e il sensore lo rileva. Usato per contare i veicoli e misurare la velocità media. Costo: basso. Limite: non distingue il tipo di veicolo (auto? moto? camion?).
- **Telecamere con computer vision:** riconoscono il tipo di veicolo, la targa (per il calcolo dei tempi di percorrenza), la velocità. Molto più informative delle spire, ma richiedono potenza di calcolo e sollevano questioni di privacy.
- **Sensori Bluetooth/Wi-Fi:** rilevano i segnali degli smartphone dei passanti (anonimi) per calcolare i flussi pedonali e il tempo di permanenza in un'area.

**Sensori per la qualità dell'aria:**
- Misurano PM2.5 e PM10 (particolato), NO₂ (biossido di azoto — emesso dai motori diesel), O₃ (ozono troposferico), CO (monossido di carbonio). Quando i livelli superano le soglie EU, il sistema può attivare semafori adattativi che rallentano il traffico, inviare allerte agli utenti vulnerabili (bambini, anziani, asmatici), o bloccare l'accesso a zone di bassa emissione (ZTL "dinamiche").

**Sensori per l'illuminazione pubblica:**
- Le lampade "smart" sono dotate di sensori di presenza e luminosità. Di notte, in assenza di pedoni o veicoli, si dimezzano in intensità. Quando rilevano movimento, tornano alla piena potenza. Risparmio energetico medio: 30-50% rispetto all'illuminazione tradizionale non controllata. In una città come Roma, con circa 300.000 punti luce, il risparmio è nell'ordine di decine di milioni di euro l'anno.

**Sensori per i rifiuti:**
- Cassonetti con sensori di riempimento ultrasonici: trasmettono il livello di riempimento in tempo reale alla centrale operativa. I camion raccoglitori non seguono più percorsi fissi — seguono una "mappa di priorità" aggiornata ogni ora. Risparmio: meno chilometri percorsi dai camion, meno emissioni, meno rumore. In alcune città (Barcellona, Amsterdam) il sistema riduce i percorsi del 20-30%.

---

### Gli open data urbani: i dati che le città pubblicano

Una componente spesso dimenticata della smart city è la **trasparenza dei dati**. Una città "smart" non è solo una città che raccoglie dati — è una città che condivide quei dati con i cittadini.

Gli **open data** (dati aperti) sono dataset pubblicati dalle pubbliche amministrazioni in formato liberamente accessibile e riutilizzabile (file CSV, JSON, API). Non richiedono registrazione. Non costano nulla. Chiunque — ricercatori, giornalisti, sviluppatori di app, associazioni, studenti — può scaricarli e usarli.

Esempi di open data urbani già disponibili in molte città italiane:

- **Comune di Milano:** fermate e orari del trasporto pubblico in tempo reale, stazioni di bike sharing e disponibilità biciclette, qualità dell'aria per quartiere, pozzi piezometrici (livello della falda), dati di utilizzo dei parchi pubblici.
- **Comune di Roma:** telecamere di traffico (posizioni), incidenti stradali per quartiere e ora, dati sull'uso dei parcheggi in struttura.
- **ARPA (Agenzia Regionale Protezione Ambiente):** dati di qualità dell'aria per stazione di rilevamento, storico degli episodi di inquinamento.

Come li trovi: il portale nazionale **dati.gov.it** aggrega gli open data di migliaia di enti pubblici italiani. Il portale europeo **data.europa.eu** fa lo stesso per i dati di tutti i Paesi UE.

> 💡 **Cosa puoi fare con gli open data?** Mapparli (un foglio Google con latitudine e longitudine → mappa interattiva con Google Maps API), analizzarli (trovare correlazioni tra qualità dell'aria e flusso di traffico), usarli per un progetto scolastico, o semplicemente capire la tua città meglio di quanto la conosca la maggior parte degli adulti.

---

### La partecipazione civica digitale: segnalare e decidere

Una smart city non è solo fatta di sensori e algoritmi calati dall'alto. Le versioni più efficaci includono strumenti di **partecipazione civica digitale** — sistemi in cui i cittadini interagiscono attivamente con la gestione della città.

**App per segnalare problemi:** applicazioni come "Municipium", "FixMyStreet", "Segnalami" permettono ai cittadini di fotografare un problema (una buca, un cassonetto che trabocca, un lampione rotto, un graffito) e mandare automaticamente la segnalazione all'ufficio competente del Comune, con geolocalizzazione. Alcune città hanno ridotto i tempi di risposta da settimane a ore per problemi segnalati via app.

**Il bilancio partecipativo:** alcune città (Lisbona è il caso europeo più citato, con 6 milioni di euro all'anno) permettono ai cittadini di proporre e votare progetti da finanziare con fondi pubblici. A Lisbona le proposte vincitrici degli anni scorsi includono: foreste urbane, percorsi ciclistici, riqualificazione di piazze di quartiere, giardini comunitari. Il processo è interamente digitale — si propone, si discute, si vota online.

**I limiti della partecipazione digitale:** chi non ha uno smartphone, chi non parla la lingua dominante, chi non ha accesso a internet in casa, chi non ha tempo perché lavora tre turni — queste persone sono sistematicamente escluse dai processi di partecipazione digitale. Una smart city che usa solo strumenti digitali per la partecipazione civica rischia di raccogliere solo le opinioni dei cittadini già avvantaggiati.

---

### La mobilità condivisa: dati e impatto reale

Il car sharing, il bike sharing e lo scooter sharing sono spesso citati come esempi di smart city. Funzionano raccogliendo dati in tempo reale (dove sono i veicoli, chi li usa, per quanto tempo, da dove a dove) e permettono di ottimizzare la flotta in base alla domanda.

I dati sull'impatto sono misti:

**Positivi:**
- In media, un'auto condivisa sostituisce tra 4 e 15 auto private (dati variano molto a seconda del contesto).
- Riduce il numero di auto in sosta che occupano spazio pubblico.
- Nei centri urbani densamente serviti, può ridurre le emissioni del trasporto privato.

**Negativi:**
- Studi mostrano che molti utenti del car sharing hanno *aggiunto* spostamenti in auto che prima facevano a piedi o in bici, non *sostituito* l'auto privata.
- Lo scooter sharing a flusso libero ha creato problemi di decoro urbano (scooter abbandonati sui marciapiedi, davanti alle rampe per disabili, sulle piste ciclabili).
- I servizi si concentrano dove c'è domanda solvibile — di solito i quartieri centrali e benestanti. Le periferie popolari restano spesso scoperte.

---

### "Smartness" non è solo tecnologia: la lezione di Copenhagen

La città più "smart" d'Europa, per molti indicatori (qualità della vita, sostenibilità, mobilità), è Copenhagen. Non per i suoi sensori o le sue app — ma per la sua bici.

Il **33% degli spostamenti quotidiani** a Copenhagen avviene in bicicletta. Non perché ci siano app speciali, ma perché negli ultimi quarant'anni la città ha progressivamente spostato spazio stradale dalle auto alle bici: 390 km di piste ciclabili separate dalla carreggiata, semafori calibrati sulla velocità media della bici (20 km/h — "onde verdi per ciclisti"), strade residenziali senza parcheggi laterali che liberano spazio ai pedoni.

Il risultato: meno emissioni, meno rumore, meno incidenti, meno stress, meno spesa sanitaria per malattie legate alla sedentarietà, meno costo per infrastrutture (una pista ciclabile costa cent'odiante volte meno di una corsia autostradale).

La "smartness" di Copenhagen non è tecnologica. È politica: scelte sistematiche e continuate per decenni su come usare lo spazio pubblico. La tecnologia aiuta — ma da sola non basta.

> 💡 **Il paradosso della smart city:**
> Molte smart city investono milioni in sistemi di gestione del traffico intelligente. Ma il traffico che devono gestire esiste perché la città ha costruito strade larghe, parcheggi grandi, quartieri a bassa densità che obbligano all'uso dell'auto. La tecnologia gestisce i sintomi. La pianificazione urbana cura le cause. Le città più vivibili al mondo non hanno solo tecnologia in più — hanno auto in meno.

---

### Esempi mondiali: Amsterdam, Barcellona, Songdo

**Amsterdam — Smart City come progetto partecipativo:**
Amsterdam è la città che più ha evitato la trappola della smart city come prodotto venduto da grandi aziende. Il suo programma "Amsterdam Smart City" (dal 2009) è gestito da una fondazione no-profit e si concentra su: sperimentazione di soluzioni energetiche nei quartieri, co-design con i cittadini, e condivisione aperta dei risultati (tutti i progetti pubblicano i dati). La caratteristica principale: la velocità non è prioritaria. Si testa su scala ridotta, si valuta l'impatto reale, si scala solo quello che funziona davvero.

**Barcellona — Superillas e gestione dei dati:**
Barcellona è famosa per le "Superilles" (Supermanzanos): isolati di edifici dove il traffico di attraversamento è vietato, creando spazi pedonali e ciclabili all'interno. Ma ha anche un sistema di gestione dei dati urbani — la piattaforma "Sentilo" — che raccoglie dati da sensori di traffico, qualità dell'aria, umidità dei giardini, occupazione dei parcheggi. La caratteristica di Barcellona: ha esplicitamente discusso la proprietà dei dati — decidendo che i dati raccolti nello spazio pubblico appartengono ai cittadini, non alle aziende che gestiscono i sensori.

**Songdo — La smart city costruita da zero (e il suo fallimento):**
Songdo, in Corea del Sud, è stata costruita dal 2003 su un'isola artificiale come "smart city perfetta" — progettata interamente dall'inizio con sensori in ogni edificio, pneumatici per la raccolta dei rifiuti, uffici con controllo ambientale automatico. Risultato: nel 2023 è ancora solo al 40% della capacità prevista. Poche persone vogliono viverci davvero. Perché? Manca la "città accidentale" — gli spazi informali, i negozietti irregolari, i mercati spontanei, le piazze non progettate che rendono le città vive e imprevedibili. Le città non funzionano come i software: non si progettano dall'alto verso il basso.

---

### Caso studio: come Milano usa i dati del traffico per gestire le ZTL

Milano ha una delle Zone a Traffico Limitato più grandi d'Europa (Area B — 72 km² di superficie). Dal 2012 gestisce anche Area C (il centro storico, a pagamento). Entrambe usano telecamere con lettura automatica delle targhe ai varchi di accesso: ogni giorno vengono letti circa 800.000 passaggi.

I dati raccolti permettono di:
1. **Identificare in tempo reale** i veicoli non autorizzati e notificare automaticamente le sanzioni.
2. **Analizzare i flussi** per capire dove si crea congestione e in quali fasce orarie.
3. **Calibrare le tariffe** di Area C in base alla domanda (in futuro: pedaggi variabili — più caro nelle ore di punta, gratis o ridotto di notte).
4. **Misurare l'impatto** delle politiche: dopo l'istituzione di Area C, il traffico nel centro è calato del 30%, le emissioni di PM10 del 18%.

Ma il sistema ha anche suscitato critiche: i dati di passaggio conservati possono essere usati per ricostruire i movimenti di qualsiasi veicolo. Chi ha accesso a questi dati? Per quanto tempo vengono conservati? Il Garante Privacy ha imposto limitazioni, ma il dibattito è aperto.

> 🔬 **Collegamento STEM — Geografia:**
> La distribuzione spaziale delle infrastrutture smart in una città non è casuale. Mappa i sensori di qualità dell'aria di Milano (disponibili su dati aperti ARPA): dove sono concentrati? Nei quartieri centrali o periferici? Nei quartieri con reddito medio alto o nelle zone popolari? Questa domanda — chi misura cosa, dove e perché — è una domanda geografica prima ancora che tecnologica. La scienza dei dati richiede sempre di chiedersi: chi ha prodotto questo dataset, con quale obiettivo, e chi non è rappresentato?

---

## 🔍 OSSERVA

### Il caso: la scuola di Torino che ha smesso di sprecare

Nel quartiere Barriera di Milano a Torino — una delle zone a maggiore densità immigrata e a più basso reddito medio della città — un istituto comprensivo ha sperimentato dal 2019 un sistema di monitoraggio ambientale low-cost.

Sette classi sono state dotate di sensori Arduino collegati a display visibili agli studenti: CO₂, temperatura, umidità relativa. I dati vengono trasmessi a un dashboard consultabile anche da casa. Ogni classe ha imparato a interpretarli: quando il CO₂ sale, si apre la finestra (anche d'inverno, per 5 minuti). Quando la temperatura scende sotto i 18°C, si segnala all'ufficio tecnico.

Risultato dopo tre anni: consumo energetico degli edifici calato del 14% (meno aperture prolungate delle finestre con il riscaldamento acceso — aprire e chiudere è meglio che lasciare aperto), qualità dell'aria nelle aule misurata e migliorata, studenti con competenze pratiche di misura e analisi dati.

Il costo totale per sette classi: 1.400 € in hardware (200 € per classe). Le bollette del riscaldamento risparmiate nei primi tre anni: circa 8.000 €. Il ritorno dell'investimento: sette mesi.

Ma la cosa più interessante non sono i dati — sono i ragazzi. Sanno leggere un grafico di CO₂. Sanno spiegare perché la qualità dell'aria peggiora verso la fine dell'ora. Sanno che aprire la finestra per 5 minuti è più efficace di lasciarla socchiusa per tutta l'ora. Questa è competenza informatica (raccogliere e interpretare dati da sensori) intrecciata con competenza digitale (usare un sistema di monitoraggio) intrecciata con educazione ambientale (agire in base ai dati).

---

> **⚠️ Errore comune:**
> "Le smart city risolvono i problemi delle città." Le smart city, nella migliore delle versioni, migliorano l'efficienza operativa di servizi già esistenti. Non risolvono problemi di disuguaglianza, di qualità degli alloggi, di accesso al lavoro, o di esclusione sociale. Una città in cui i cassonetti vengono svuotati in modo ottimizzato ma in cui migliaia di persone non hanno una casa stabile non è "smart" in nessun senso significativo. La tecnologia è uno strumento: utile se usato per risolvere i problemi giusti, inutile o controproducente se usato come sostituto della politica urbana.

---


### 🌍 Chi lavora con questa competenza nel 2030?

**Geo-engineer Ambientale**

Analizza dati geospaziali e caratteristiche del territorio per pianificare interventi di tutela ambientale, prevenzione del rischio geologico e ripristino degli ecosistemi.

Dove lavora: agenzie ambientali regionali (ARPA), studi di geologia e ingegneria ambientale, parchi naturali, protezione civile.

Competenze chiave che inizia a costruire da qui: geologia · GIS e telerilevamento · ingegneria ambientale · analisi geospaziale · modellazione territoriale

*"Il territorio racconta la sua storia. Il mio lavoro è capirla prima che diventi un'emergenza."*


**Climate Risk Analyst**

Studia come il cambiamento del clima può minacciare un territorio: frane, alluvioni, siccità. Il Climate Risk Analyst raccoglie enormi quantità di dati — piogge, temperature, mappe del suolo — e costruisce modelli al computer per prevedere quali zone rischiano di più e quando. I suoi calcoli aiutano comuni e aziende a decidere dove non costruire, quali argini rinforzare e come proteggere case e strade. È un mestiere che unisce lo studio del clima alla capacità di trasformare i numeri in scelte che salvano vite.

Dove lavora: società di consulenza ambientale, compagnie di assicurazione, enti di protezione civile, banche e fondi con criteri ESG, centri di ricerca sul clima.

Competenze chiave che inizia a costruire da qui: climatologia · risk analysis · ESG · data science · modellazione climatica

*"Non prevedo il futuro: calcolo dove la prossima alluvione farà più danni, così possiamo fermarla in tempo."*

---

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### ● BASE — Mappo la mia città con i dati aperti

**Obiettivo:** trovare e leggere almeno un dataset open data della propria città, capire cosa rappresenta e cosa si può fare con quell'informazione.

**Materiali che ti servono:** un dispositivo con accesso a internet.

**Come procedere:**

1. Vai su **dati.gov.it** (il portale degli open data italiani). Cerca il nome del tuo Comune o della tua Regione.

2. Sfoglia i dataset disponibili. Trovane almeno uno che ti sembra interessante (puoi cercare per tema: "trasporti", "ambiente", "rifiuti", "energia").

3. Scarica o apri il dataset (di solito in formato CSV o Excel). Conta quante righe ha (= quante "osservazioni" o "misure" contiene).

4. Compila questa scheda:

| Campo | Risposta |
|-------|---------|
| Nome del dataset | |
| Ente che lo pubblica | |
| Quante righe di dati contiene? | |
| Che cosa misura? (una frase) | |
| Con che frequenza viene aggiornato? | |
| C'è una mappa o un grafico associato? | |

5. In 3-4 righe, descrivi: cosa potresti fare con questo dataset? A quale problema della tua città potrebbe aiutare a rispondere?

> 💡 **Se il tuo Comune non pubblica open data:** usa i dati del Comune capoluogo della tua provincia. Oppure usa i dati di ARPA della tua Regione (qualità dell'aria).

---

### ●● INTERMEDIO — Analizzo un problema urbano del mio quartiere

**Obiettivo:** identificare un problema reale nel quartiere della scuola, raccogliere informazioni, e proporre una soluzione che usi dati o tecnologie smart.

**Materiali che ti servono:** smartphone (per fotografare), internet, questo libro.

**Fase 1 — Osservazione (da fare in 15-20 minuti nel quartiere della scuola):**

Scegli un problema visibile nel quartiere della scuola tra questi:
- Traffico all'uscita di scuola
- Qualità dell'aria (percepita)
- Rifiuti abbandonati o cassonetti traboccanti
- Illuminazione insufficiente in alcune strade
- Parcheggio selvaggio sui marciapiedi o sulle piste ciclabili
- Assenza o cattivo stato di piste ciclabili

Fotografa almeno 3 evidenze del problema. Prendi nota di: dove si trova (via, piazza), quando è più grave (mattina? uscita da scuola? fine settimana?), chi è principalmente coinvolto (auto? pedoni? residenti? studenti?).

**Fase 2 — Ricerca:**

Cerca se il tuo Comune ha già dati su questo problema (es. incidenti stradali, dati di traffico, segnalazioni ricevute). Cerca anche se esiste già una tecnologia smart che viene usata in altre città italiane o europee per questo problema.

**Fase 3 — Proposta:**

Scrivi una proposta in 10-12 righe che includa:
1. Il problema identificato (con dati o osservazioni concrete)
2. La soluzione tecnologica proposta (con un esempio di città che la usa)
3. I dati che servirebbe raccogliere
4. Chi ne beneficereste (cittadini in generale, studenti, anziani, ciclisti, ecc.)
5. Un possibile rischio o svantaggio della soluzione

---

### ●●● AVANZATO — Progetto una campagna di open data per il mio quartiere

**Scenario:** il tuo Comune ha deciso di lanciare un piano di "civic tech" (tecnologia civica) per il quartiere della tua scuola. Ha un budget limitato (50.000 €) e vuole coinvolgere i cittadini nella raccolta e nell'uso dei dati. Ti chiede di progettare un sistema che risponda a queste tre domande:

1. Quali dati raccogliere?
2. Come raccoglierli?
3. Come usarli per migliorare qualcosa di concreto?

**Vincoli del progetto:**
- Deve coinvolgere attivamente gli studenti della scuola.
- I dati devono essere pubblicati come open data (liberamente accessibili).
- Il sistema deve rispettare la privacy (no raccolta di dati personali, no riconoscimento facciale).
- Deve essere sostenibile economicamente dopo il primo anno (costo di gestione < 5.000 €/anno).

**Come strutturare la risposta:**

**Parte A — Analisi dei bisogni (4-5 righe):**
Quali sono i 3 problemi più urgenti nel quartiere che potrebbero essere migliorati con dati? (Basati sull'osservazione diretta del quartiere o su open data già esistenti.)

**Parte B — Sistema di raccolta dati:**
Progetta un sistema che includa:
- Almeno un tipo di sensore fisso (specificare cosa misura, dove, costo indicativo)
- Almeno uno strumento di segnalazione cittadina (app esistente? modulo Google Forms? altro?)
- Il ruolo degli studenti nella raccolta o validazione dei dati

**Parte C — Uso dei dati:**
Come verranno usati i dati? Chi li può consultare? Come vengono presentati (dashboard pubblica? report mensile? mappa interattiva?)?

**Parte D — Riflessione etica:**
Identificate almeno due rischi legati alla raccolta dei dati che avete progettato. Come li mitigate? Chi decide cosa fare con i dati?

**Parte E — Documento finale:**
Scrivi un documento di 18-22 righe per il Comune, strutturato con: obiettivi, descrizione del sistema, vantaggi, rischi e misure di mitigazione, budget dettagliato, piano di comunicazione ai cittadini.

> **Domanda aperta:** se il Comune avesse da scegliere tra spendere 50.000 € in sensori smart o in alberi e sedute nel quartiere, cosa scegliereste? Argomentate.

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | ● Base — Sufficiente | ●● Intermedio — Buono | ●●● Avanzato — Ottimo |
|----------|---------------------|----------------------|----------------------|
| **1. Identificazione del problema urbano** | Descrive un problema osservato nel quartiere con almeno 2 dettagli concreti (dove, quando, chi è coinvolto) | Fornisce evidenze multiple del problema (osservazioni + dati aperti o segnalazioni), descrive la distribuzione spaziale e temporale | Quantifica il problema (es. "ho contato X auto in doppia fila in Y minuti") e lo colloca in un contesto più ampio (dato cittadino, dato nazionale) |
| **2. Conoscenza della smart city** | Descrive correttamente almeno 2 tecnologie smart esistenti e il loro funzionamento | Descrive 3 o più tecnologie con dati di efficacia, e distingue tra usi che migliorano i servizi pubblici e usi che raccolgono dati personali | Analizza criticamente almeno una tecnologia smart citando sia i benefici che i rischi, con esempi concreti da città reali |
| **3. Proposta di soluzione** | Propone una soluzione tecnologica esistente applicata al problema identificato | Propone una soluzione specificando: tecnologia, dati raccolti, costi indicativi, soggetti coinvolti, e almeno un rischio | Propone una soluzione completa con analisi costi-benefici, piano di comunicazione ai cittadini, e discussione della governance dei dati |
| **4. Riflessione sui diritti e la governance** | Indica che i dati raccolti sollevano questioni di privacy | Distingue tra dati aggregati/anonimi e dati personali, e indica una norma o principio che regola la raccolta di dati nello spazio pubblico | Discute il trade-off tra efficienza urbana e diritti individuali con riferimento a un caso reale, e propone criteri concreti per decidere quando è accettabile raccogliere dati |

---

### Lo scenario

Il tuo Comune ha pubblicato un bando rivolto alle scuole secondarie: "Smart School for Smart City". Ogni istituto può presentare un progetto per rendere il proprio quartiere scolastico più intelligente, sostenibile e partecipato usando dati e tecnologia. Il progetto vincitore riceverà un contributo di 3.000 € per realizzarlo.

---

### La consegna

Lavorate in gruppi di 3-4 persone. Ogni gruppo deve produrre un **progetto completo** per il bando, strutturato in queste sezioni:

---

**SEZIONE 1 — Il problema che vogliamo risolvere** *(max 10 righe)*

Descrivete un problema reale nel quartiere della scuola. Includete:
- Dove si trova e quando è più evidente
- Chi ne è colpito principalmente
- Perché è importante risolverlo (impatto sulla qualità della vita, sulla sicurezza, sull'ambiente)
- Se ci sono già dati aperti che lo documentano (link al dataset se trovato)

---

**SEZIONE 2 — La soluzione tecnologica** *(max 15 righe)*

Descrivete la tecnologia che usereste. Includete:
- Tipo di sensore o strumento digitale
- Dati che raccoglierebbe
- Come i dati verrebbero visualizzati o usati
- Esempio di una città che già usa questa soluzione (con risultati)
- Costo stimato (ricercate online prezzi di sensori Arduino, Raspberry Pi, o sistemi commerciali simili)

---

**SEZIONE 3 — Il ruolo dei cittadini e degli studenti** *(max 8 righe)*

- Come verranno coinvolti gli studenti nella raccolta o nell'interpretazione dei dati?
- Come verranno informati i residenti del quartiere?
- I dati saranno pubblicati come open data? Come?

---

**SEZIONE 4 — Rischi e governance** *(max 8 righe)*

- Quali dati raccogliete? Sono dati personali o aggregati?
- Chi avrà accesso ai dati raccolti?
- Quali misure adottate per proteggere la privacy?
- Chi decide cosa fare con i dati se si trovano risultati inaspettati?

---

**SEZIONE 5 — Budget** *(tabella)*

| Voce di spesa | Costo stimato |
|---------------|--------------|
| Hardware (sensori, cavi, alimentatori) | |
| Software / piattaforma dati | |
| Comunicazione e materiali | |
| Formazione (workshop per studenti) | |
| **Totale** | max 3.000 € |

---

### Materiali che ti servono

- Questo libro e le note della Zona 2
- Internet per ricercare prezzi di hardware e casi studio
- Eventuali open data del tuo Comune (dati.gov.it)
- Carta per schizzare la mappa del quartiere

---

### 🎯 Badge SDG 11 e 9 — Città sostenibili e innovazione

Le città ospitano più della metà della popolazione mondiale e producono più del 70% delle emissioni globali di CO₂. Renderle più efficienti, più partecipate e più giuste è forse la sfida tecnologica e politica più importante dei prossimi decenni. Questa MC ti ha dato gli strumenti per capire dove la tecnologia aiuta, dove non basta, e dove può fare danni. Usali.

---

### 🤖 Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Puoi chiedere all'AI Coach:
- *"Come funziona un sensore di qualità dell'aria?"*
- *"Dove trovo gli open data del mio Comune?"*
- *"Che differenza c'è tra dati aggregati e dati personali?"*
- *"Cosa dice il GDPR sulla raccolta di dati nello spazio pubblico?"*

Ricorda che le domande che riguardano i diritti e la governance dei dati non hanno risposte tecniche — richiedono riflessione politica e giuridica. L'AI Coach può darti informazioni, ma le decisioni sono tue.

---

### 🪞 Metacognizione — Rifletti sul tuo lavoro

**1. Sorpresa**
C'è qualcosa che hai scoperto sulla tua città in questa MC — o durante la ricerca degli open data — che non sapevi e che ti ha sorpreso?

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Il dato e il contesto**
Hai trovato un dato (un numero, una percentuale, una statistica) che ti sembrava chiaro all'inizio ma che dopo averlo analizzato ti ha fatto capire che era più complicato da interpretare di quanto sembrasse? Quale?

*Cosa mancava per interpretarlo correttamente?*

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa**
Durante il lavoro di gruppo, hai cambiato idea su un aspetto della soluzione che avevate proposto — forse perché un compagno ha sollevato un rischio che non avevate considerato? Descrivi.

*Cosa ti ha convinto a cambiare idea? Era un argomento tecnico, etico, o pratico?*

*Scrivi 2-3 righe:* ___________________________________________

---

**4. Connessione con la tua vita**
Ci sono app o servizi digitali che usi ogni giorno (mappe, trasporto pubblico, previsioni del tempo) che raccolgono dati sulla tua posizione o sui tuoi spostamenti? Ora che conosci i principi della smart city, hai una visione diversa di questi servizi?

*Scrivi 2-3 righe:* ___________________________________________

---

### 🔗 Collegamento con MC-INF-3-01 — Sensori, dati e sistemi IoT

Questa MC ti ha dato la visione urbanistica e politica delle smart city: cosa significano per le persone che ci vivono, chi decide come funzionano, e cosa fare con i dati che producono. MC-INF-3-01 (3ª superiore) entrerà nel dettaglio tecnico: come funzionano i sensori, come comunicano i dati, come si costruisce un sistema IoT. Le due MC sono le due facce della stessa medaglia: il "perché" e il "come".

---

## APPENDICE — Tech in English

**Termini tecnici di questa MC in inglese**

| Italiano | English | Come si legge |
|----------|---------|---------------|
| città intelligente | smart city | /smɑːt ˈsɪti/ |
| dati aperti | open data | /ˈəʊpən ˈdeɪtə/ |
| sensore urbano | urban sensor | /ˈɜːbən ˈsensə/ |
| partecipazione civica | civic participation | /ˈsɪvɪk pɑːˌtɪsɪˈpeɪʃən/ |
| governance dei dati | data governance | /ˈdeɪtə ˈɡʌvənəns/ |

> *In English we say: "Open data allows citizens to monitor how their city uses public resources" — i dati aperti permettono ai cittadini di monitorare come la propria città usa le risorse pubbliche.*
>
> *"A smart city uses sensors and data to improve public services — but the key question is: for whom?" — una città intelligente usa sensori e dati per migliorare i servizi pubblici — ma la domanda chiave è: per chi?*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- Zona 2: la sezione sui sensori urbani va formattata con icone per ogni tipo di sensore (piccole icone illustrative a bordo paragrafo).
- Il box "Il paradosso della smart city" (Copenhagen) va in evidenza grafica — è uno dei messaggi centrali della MC.
- Il box "Collegamento STEM — Geografia" va come sidebar nella sezione caso studio Milano.
- Le attività della Zona 4 (Intermedio e Avanzato) vanno su pagine separate come schede di lavoro.
- Il progetto della Zona 5 va come documento separato da 2 pagine (fotocopiabile / scaricabile con QR).

**Per l'agente generatore asset:**
- Visual richiesto 1: mappa concettuale smart city — al centro "dati", ai vertici: traffico, rifiuti, aria, illuminazione, partecipazione, mobilità — con frecce bidirezionali verso "servizi ai cittadini" e verso "rischi/privacy".
- Visual richiesto 2: confronto infografico tra Copenhagen (% bici, % auto, emissioni) e una media europea — stile "due città a confronto".
- Visual richiesto 3: schema del ciclo di open data — raccolta → elaborazione → pubblicazione → uso civico → feedback → politiche pubbliche.
- Hook audio: script podcast disponibile in Zona 1 di questo file.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025)*
*Livello DigComp: Intermediate (I) · SDG 9 e 11*
*Contenuto espanso su indicazione editoriale — tutte e 5 le zone libro-ready*
