# MC-DIG-3-01 — Il robot che impara dal mondo: robotica, sensori e pensiero computazionale avanzato
**Area:** Digitale/Coding · **Anno:** 3ª · **Livello DigComp:** Advanced (A)
**SDG:** 4 — Istruzione di qualità · 9 — Innovazione · **Fonte:** Hypertech 2020
**Struttura:** 4 pagine (MC Advanced) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il robot che non sa dove si trova"**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 38 sec.*
> *(Script completo: MC-DIG-3-01_hook-script.md)*

**Domanda di avvio:**
Il Roomba evita i muri, copre tutta la stanza, torna alla base — ma non ha una mappa della tua casa. Non sa dove si trova. Costruisce ogni secondo una stima probabilistica di dove potrebbe essere.

Questa non è magia. È un algoritmo. E capire la differenza tra "sembra intelligente" e "è programmato per comportarsi in modo intelligente" è esattamente quello che studierai in questa MC.

---

## 📖 ESPLORA

### Pensiero computazionale avanzato: oltre le istruzioni semplici

Nei due anni precedenti hai imparato le basi del pensiero computazionale: sequenze, cicli, condizioni, funzioni. Adesso aggiungi la complessità reale. I problemi del mondo fisico non sono come gli esercizi sul libro: hanno input incerti, condizioni che cambiano, errori imprevisti, e richiedono sistemi che rispondono in tempo reale all'ambiente.

Il pensiero computazionale avanzato si articola in quattro operazioni mentali che si applicano in modo integrato:

**Decomposizione:** scomporre un problema complesso in sottoproblemi indipendenti o poco accoppiati. Un robot che deve navigare in un corridoio può essere decomposto in: (1) rilevamento ostacoli, (2) calcolo della direzione, (3) controllo dei motori, (4) aggiornamento della posizione stimata. Ogni sottoproblema può essere risolto e testato indipendentemente.

**Riconoscimento di pattern:** identificare strutture ricorrenti che si ripetono in problemi diversi. Un robot che evita ostacoli e un termostato che controlla la temperatura hanno lo stesso pattern: sensore → condizione → azione → verifica. Una volta riconosciuto il pattern, la soluzione si trasferisce da un dominio all'altro.

**Astrazione:** ignorare i dettagli irrilevanti e concentrarsi sulle proprietà essenziali del problema. Quando programmi il comportamento di un robot, non ti interessa la tensione esatta dei motori: ti interessa la velocità risultante. L'astrazione ti permette di lavorare a un livello di complessità gestibile.

**Algoritmo:** tradurre la soluzione del problema in una sequenza precisa e completa di istruzioni, senza ambiguità. Un algoritmo non è "il robot va avanti fino a quando c'è un ostacolo" — è "il robot si muove in avanti a 20 cm/s; se il sensore di prossimità frontale rileva una distanza < 15 cm, si ferma, ruota di 90° in senso orario, verifica nuovamente la distanza frontale; se > 15 cm riprende il movimento in avanti."

La differenza tra Foundation e Advanced nel pensiero computazionale non è la conoscenza delle strutture — è la capacità di applicarle a problemi con input incerti, sistemi fisici, e requisiti che cambiano durante l'esecuzione.

---

### Robot educativi: tre strumenti, tre filosofie

Nel panorama della robotica educativa esistono decine di piattaforme. Tre sono le più diffuse nelle scuole italiane e mondiali, e rappresentano tre filosofie diverse.

**micro:bit (Micro Bit Foundation, UK, 2015):** una scheda elettronica delle dimensioni di un francobollo — 4 × 5 cm — con processore ARM, accelerometro, bussola, termometro, sensore di luce, radio Bluetooth, e una griglia di 25 LED. Non è un robot: è una piattaforma di computing fisico. Puoi collegare sensori e attuatori esterni via pin di espansione, costruire robot con chassis aggiuntivi (Kitronik, Bit:bot), o usarla come controller per altri sistemi. Si programma con MakeCode (blocchi o JavaScript) direttamente nel browser. Philosophia: **semplicità di accesso, apertura massima**. Adatto per chi vuole capire come funziona l'hardware al livello più elementare.

**LEGO Mindstorms EV3 (LEGO, 2013):** un kit robotico completo con mattoncini LEGO, sensori (ultrasuoni, colore, tocco, giroscopio), motori servomotori e un "brick" programmabile con schermo LCD. Si programma con LEGO Mindstorms (blocchi grafici) o Python, MicroPython, e persino in C++. L'approccio costruttivo — costruire prima la struttura fisica del robot, poi programmarla — è fondamentale: la forma del robot cambia il suo comportamento, e un robot mal costruito non funzionerà anche con il codice perfetto. Philosophia: **costruzione + programmazione integrate**. Adatto per chi vuole progettare sistemi fisici complessi.

**Arduino Uno (Arduino LLC, 2005):** un microcontroller open source con cui puoi costruire qualsiasi dispositivo elettronico programmabile. Non è un robot ma un controller universale: può pilotare motori, leggere sensori, controllare display, comunicare via WiFi. Si programma in C/C++ (linguaggio testuale, non a blocchi) con l'IDE Arduino. La curva di apprendimento è più ripida, ma la potenza e la flessibilità sono massime. Arduino è usato in prototipazione industriale, ricerca, arte interattiva, domotica. Philosophia: **massima flessibilità, massima potenza**. Adatto per chi è pronto a programmare in un linguaggio reale.

**Quando scegliere quale:** micro:bit per chi inizia e vuole capire l'hardware; EV3 per chi vuole costruire robot fisici complessi; Arduino per chi è pronto per il linguaggio testuale e i progetti open-ended.

---

### Sensori e attuatori: gli organi di senso e i muscoli del robot

Un robot è, nella sua essenza, un sistema che legge il mondo (sensori), elabora le informazioni (microcontroller + programma), e agisce sul mondo (attuatori). Senza sensori è cieco; senza attuatori è paralizzato; senza programma è vuoto.

**Sensori — gli organi di senso:**

*Sensore di prossimità a ultrasuoni (HC-SR04):* emette un impulso sonoro a 40 kHz (ultrasuoni, inaudibili all'orecchio umano) e misura il tempo impiegato dall'eco per tornare. Distanza = (tempo × velocità del suono) / 2. Range tipico: 2-400 cm, precisione ±3 mm. Usato per evitare ostacoli, misurare livelli in contenitori, rilevare la presenza di persone.

*Sensore di colore (TCS34725):* un fotodiodo sensibile alle lunghezze d'onda della luce visibile, con filtri per separare rosso, verde, blu (RGB). Legge il colore della superficie di fronte a sé. Usato nei robot segui-linea (rilevano il contrasto bianco/nero), nei sistemi di smistamento industriale (separano prodotti per colore).

*Sensore di temperatura e umidità (DHT22):* misura temperatura (-40 a +80°C, precisione ±0,5°C) e umidità relativa (0-100%, precisione ±2%). Usato in sistemi di monitoraggio ambientale, serre automatizzate, controllo del clima.

*Accelerometro (come quello nel micro:bit):* misura l'accelerazione in tre assi (x, y, z). Se il dispositivo è fermo, l'accelerometro misura la gravità (9,8 m/s²) e calcola l'inclinazione. Se il dispositivo si muove, misura le accelerazioni del movimento. Usato negli smartphone per capire l'orientamento dello schermo, nei sistemi di stabilizzazione, nei contapassi.

*Sensore di luminosità (LDR — Light Dependent Resistor):* la resistenza elettrica del componente cambia in modo inversamente proporzionale alla luce che lo colpisce. Più luce → meno resistenza → più corrente. Usato per azionare luci automaticamente, nei sistemi fotovoltaici per orientare i pannelli verso il sole.

**Attuatori — i muscoli:**

*Motori DC:* convertono energia elettrica in movimento rotativo continuo. La velocità dipende dalla tensione; il senso di rotazione dipende dalla polarità. Usati per muovere le ruote di un robot.

*Servomotori:* motori DC con un sistema di controllo interno che permette di specificare un angolo di posizione preciso (0-180° o 0-360°). Usati per girare la direzione di un veicolo, muovere le giunture di un braccio robotico.

*LED e display:* attuatori luminosi. Un LED acceso/spento è il più semplice segnale di output. Una matrice di LED (come i 25 del micro:bit) permette di mostrare numeri, lettere, icone. Un display LCD o OLED permette testo e grafica.

*Buzzer:* genera suoni a frequenze diverse — dal bip di allerta al segnale morse. Semplice ma efficace per segnalare stati del robot all'utente.

---

### Programmazione event-driven: il robot che risponde

La programmazione **event-driven** (guidata dagli eventi) è diversa dalla programmazione sequenziale che conosci. In un programma sequenziale, le istruzioni si eseguono dall'alto in basso, una dopo l'altra, in ordine fisso. In un programma event-driven, le istruzioni si eseguono quando accade qualcosa — un evento.

Un evento può essere: il sensore rileva una distanza < 15 cm, il pulsante A viene premuto, passano 5 secondi dall'ultima lettura, la temperatura supera 30°C.

Nel linguaggio MakeCode di micro:bit, ogni blocco "on event X" è un gestore di eventi: il codice dentro quel blocco viene eseguito ogni volta che l'evento X si verifica, indipendentemente da quello che sta facendo il resto del programma.

Esempio di robot event-driven:
- **Evento principale (loop continuo):** vai avanti a velocità 50.
- **Evento 1:** se sensore ultrasuoni < 15 cm → fermati → ruota destra 90° → riprendi.
- **Evento 2:** se sensore tocco premuto → fermati → emetti suono di avviso → aspetta 2 secondi → riprendi.
- **Evento 3:** se pulsante A premuto → entra in modalità "esplorazione": ruota casualmente ogni 3 secondi.

Il vantaggio dell'event-driven: il robot può rispondere a eventi multipli contemporaneamente senza che uno blocchi l'altro. Il rischio: se due eventi si verificano allo stesso momento, il sistema deve gestire la priorità — quale risposta prevale?

---

### Debugging come competenza: trovare gli errori in modo sistematico

Il **debugging** — trovare e correggere gli errori nel codice — è una competenza trasversale. Un bug è qualsiasi comportamento del programma che non corrisponde all'intenzione del progettista. Può essere un errore di logica (il robot gira nella direzione sbagliata), un errore di valori (la soglia del sensore è 15 quando dovrebbe essere 30), un errore di sequenza (controlla la distanza dopo aver già colpito il muro), o un errore hardware (il sensore è collegato al pin sbagliato).

**Strategie sistematiche di debugging:**

**1. Riproduci il bug:** prima di cercare la causa, assicurati di capire esattamente in quali condizioni il comportamento sbagliato si verifica. "A volte il robot si blocca" non è sufficiente. "Il robot si blocca quando il sensore rileva una superficie a meno di 5 cm e il pulsante A è tenuto premuto" è un punto di partenza.

**2. Isola il componente:** spezza il sistema in parti e testa ogni parte da sola. Il sensore funziona correttamente in isolamento? Il motore si muove nella direzione corretta quando riceve il segnale? La logica di controllo funziona con valori di test simulati?

**3. Aggiungi output di debug:** inserisci istruzioni che mostrano il valore delle variabili in momenti critici del programma — sul display del micro:bit, sulla porta seriale, con LED che cambiano stato. Spesso il bug si trova non dove pensi ma dove stai guardando i dati grezzi.

**4. Ragiona sull'algoritmo, non sul codice:** se non capisci perché il codice non funziona, torna all'algoritmo ad alto livello. Descrivi a parole cosa dovrebbe succedere, passo per passo. Poi verifica che il codice corrisponda esattamente a quella descrizione.

**5. Chiedi a qualcun altro:** il fenomeno del "rubber duck debugging" (spiegare il problema a un oggetto inanimato) funziona perché costringerti a spiegare il codice a qualcun altro ti obbliga a verbalizzare assunzioni implicite — e spesso l'errore emerge mentre spieghi.

Il debugging non è un segno di fallimento: è la parte normale del processo. I programmatori professionisti trascorrono il 50-70% del loro tempo a fare debugging. La differenza tra un programmatore esperto e uno principiante non è che l'esperto fa meno errori: è che li trova più velocemente.

---

### L'intelligenza dei robot: programmato vs. apprendimento

Un robot obbedisce sempre a regole scritte da qualcuno. Ma esistono due modi fondamentalmente diversi di scrivere quelle regole.

**Comportamento programmato esplicitamente:** il progettista specifica ogni risposta possibile a ogni condizione possibile. "Se distanza < 15 cm, ruota destra. Se sensore colore = nero, fermati. Se temperatura > 30°C, attiva ventola." Questo approccio funziona bene per ambienti controllati e problemi ben definiti. Il robot del Roomba classico funziona così: le sue regole di navigazione sono progettate in modo che il comportamento risultante sembri intelligente, ma ogni risposta è stata definita esplicitamente da un ingegnere.

**Apprendimento automatico (Machine Learning):** invece di specificare le regole, il progettista fornisce molti esempi (dati) e un algoritmo che impara le regole dai dati. Un robot aspirapolvere con ML non ha regole di navigazione hardcoded: viene esposto a migliaia di mappe di case diverse e impara da solo quali traiettorie sono più efficienti. Il risultato può essere più efficiente delle regole manuali, ma meno prevedibile e più difficile da correggere quando sbaglia.

La differenza è importante: un robot programmato esplicitamente fa esattamente quello che gli hai detto di fare (anche se quello che gli hai detto non era quello che intendevi). Un robot con ML fa quello che ha imparato dai dati (che può non corrispondere a quello che speravi).

> **📦 Box T8 — IA critica: il robot obbedisce, non pensa**
>
> È fondamentale capire questa distinzione: un robot, anche il più sofisticato, non "pensa". Esegue istruzioni — scritte esplicitamente da un ingegnere (nel caso classico) o apprese da dati di addestramento (nel caso del machine learning).
>
> Quando un robot sembra "scegliere" di fare qualcosa, sta eseguendo una ramificazione logica (if-then-else) basata su dati sensoriali. Quando sembra "capire" una situazione, sta classificando pattern statistici che ha visto durante l'addestramento.
>
> Questo non sminuisce la tecnologia — è straordinaria. Ma capire come funziona realmente è fondamentale per due ragioni:
> 1. Quando un robot sbaglia, bisogna trovare l'errore nel codice o nei dati, non nella sua "intenzione".
> 2. Attribuire "intelligenza" a un sistema che segue regole porta a fidarsi di esso in modo acritico — con conseguenze che possono essere gravi.
>
> Un robot chirurgico da Vinci esegue movimenti con precisione sub-millimetrica. Ma la responsabilità della diagnosi e della decisione chirurgica è sempre del chirurgo umano. Sempre.

---

### Robotica nella realtà: tre sistemi che cambiano il mondo

**Robot chirurgico da Vinci (Intuitive Surgical, 1999):** sistema telemanipolato — non autonomo — per chirurgia mini-invasiva. Il chirurgo siede a una console e muove joystick; il robot traduce e scala i movimenti in azioni precise su strumenti inseriti nel corpo del paziente attraverso piccole incisioni. Vantaggi: precisione oltre le capacità umane, eliminazione del tremore naturale della mano, possibilità di operare a distanza. Il robot non decide nulla: è un'estensione amplificata delle mani del chirurgo.

**Robot warehouse Amazon (Amazon Robotics, 2012):** nei magazzini Amazon, migliaia di robot Kiva (ora Proteus) spostano scaffalature intere portandole agli addetti umani, invece che far camminare gli addetti tra gli scaffali. Ogni robot naviga autonomamente usando marker a QR code sul pavimento, comunica via WiFi con un sistema centrale che coordina migliaia di robot contemporaneamente evitando collisioni. Risultato: velocità di prelievo 3-4 volte superiore ai magazzini tradizionali. Costo sociale: riduzione significativa della manodopera umana nei magazzini.

**Veicoli autonomi (livello 2-3, 2024):** le auto a guida autonoma esistenti usano una combinazione di sensori (lidar, radar, telecamere) e algoritmi di machine learning per rilevare e classificare oggetti nella scena di guida (pedoni, veicoli, segnali stradali), pianificare traiettorie sicure, e controllare sterzo, acceleratore e freni. Al livello 3 (come la Mercedes EQS con Drive Pilot), l'auto può gestire autonomamente la guida in autostrada con traffico scorrevole fino a 130 km/h, ma il conducente deve poter riprendere il controllo entro 10 secondi se il sistema lo richiede.

---

### Caso studio: Deep Blue vs. AlphaGo — due modi diversi di "battere" un campione umano

**Deep Blue (IBM, 1997):** nel 1997, il computer Deep Blue di IBM sconfisse il campione del mondo di scacchi Garry Kasparov in un match a sei partite. Deep Blue valutava 200 milioni di posizioni al secondo usando regole scritte esplicitamente da ingegneri e Grandmaster di scacchi. Non "imparava" dagli scacchi: cercava nella sua libreria di mosse e valutava posizioni con funzioni costruite a mano. La sua intelligenza era la somma dell'intelligenza degli esseri umani che l'avevano programmato.

**AlphaGo (DeepMind, 2016):** nel 2016, AlphaGo di DeepMind sconfisse Lee Sedol, campione del mondo di Go, in un match a cinque partite. Go ha circa 10^170 posizioni possibili — miliardi di volte più del numero di atomi nell'universo osservabile. Nessun sistema di ricerca esaustiva come Deep Blue avrebbe potuto funzionare. AlphaGo usava una combinazione di apprendimento supervisionato (partendo da milioni di partite umane) e apprendimento per rinforzo (giocando milioni di partite contro se stesso, imparando dalle vittorie e dalle sconfitte). Nella quarta partita, alla mossa 78, Sedol giocò una mossa così inaspettata che AlphaGo — che non l'aveva mai vista nell'addestramento — perse la partita. Sedol disse che era "una mossa che solo un essere umano poteva fare, perché solo un essere umano avrebbe potuto pensare in modo così creativo in quel momento."

**Cosa ci dice questo confronto:** Deep Blue era intelligente come la somma delle conoscenze degli scacchi di chi l'aveva programmato. AlphaGo aveva imparato modelli strategici dai dati in modo che nessun essere umano aveva specificato esplicitamente. Entrambi vincevano contro i campioni umani — ma per ragioni completamente diverse. Nessuno dei due "capiva" il gioco nel senso in cui lo capirebbe un essere umano.

> **🔢 Collegamento STEM — Matematica:**
> Un robot che rileva la distanza con ultrasuoni sta risolvendo un problema di cinematica: distanza = velocità × tempo / 2. Il fattore 2 perché il suono deve fare l'andata e il ritorno. Se il robot misura un tempo di eco di 5,8 ms e la velocità del suono nell'aria è 343 m/s: distanza = 343 × 0,0058 / 2 = 0,995 m ≈ 1 m. Questa è la fisica implementata nell'hardware del sensore. Il microcontroller legge un numero intero e lo converte in centimetri — ma sotto c'è un'equazione fisica.

---

## 🔍 OSSERVA

### Il caso: come un robot aiuta gli studenti con disabilità visiva a orientarsi

In alcune scuole superiori americane ed europee stanno sperimentando piccoli robot navigatori che accompagnano studenti non vedenti o ipovedenti nei corridoi dell'istituto. Non sono robot umanoidi sofisticati: sono piattaforme su ruote grandi quanto uno zaino, con sensori di prossimità laterali e frontali, un buzzer per segnalare direzioni e un'interfaccia con pulsanti per scegliere la destinazione.

Il sistema funziona così: il robot conosce la mappa dell'edificio (pre-programmata). Lo studente seleziona la destinazione (aula 3B, mensa, bagni) tramite pulsanti. Il robot guida usando suoni: un tono continuo significa "vai dritto", un tono intermittente a destra significa "svolta a destra tra 5 passi". I sensori laterali rilevano persone o oggetti e fanno rallentare il robot avvisando lo studente.

Questo sistema non richiede hardware sofisticato: micro:bit, motori DC, sensori HC-SR04, un modulo audio — tutto disponibile per meno di 50 euro. Quello che richiede è progettazione algoritmica accurata e, soprattutto, comprensione dei bisogni dell'utente reale. Un robot che si muove troppo veloce per un adolescente non vedente è inutile o pericoloso. Un robot che emette suoni troppo simili ai suoni dell'ambiente scolastico produce confusione. Il 90% del lavoro è design centrato sull'utente, non programmazione.

---

> **⚠️ Errore comune — "Più complesso il codice, meglio funziona il robot":**
> La tendenza naturale dei principianti è aggiungere funzionalità finché il codice non diventa ingestibile. Un robot che funziona in modo semplice e affidabile è molto più utile di un robot con cento funzionalità che fallisce imprevedibilmente. Il principio KISS (Keep It Simple, Stupid) — enunciato dagli ingegneri della Marina americana negli anni 1960 — vale nel codice come in ingegneria: la soluzione più semplice che funziona è quasi sempre la migliore.

---

### 🤖 Chi lavora con questa competenza nel 2030?

**Ingegnere di sistemi robotici e automation specialist**

L'ingegnere di sistemi robotici progetta robot e sistemi automatizzati per applicazioni industriali, mediche, agricole, logistiche. Non scrive solo codice: deve capire l'hardware (sensori, attuatori, strutture meccaniche), il software (algoritmi di controllo, interfacce), e il contesto (chi userà il robot, in quale ambiente, con quali vincoli di sicurezza).

L'automation specialist progetta sistemi automatizzati in ambienti industriali: linee di montaggio, magazzini, sistemi di qualità. In Italia, l'Industria 4.0 ha creato una domanda crescente di questi professionisti: migliaia di PMI manifatturiere stanno automatizzando processi che erano manuali.

Dove lavorano: aziende manifatturiere, aziende logistiche, settore sanitario, agroalimentare, aziende di automazione (ABB, FANUC, Comau).

Competenze chiave che inizia a costruire da qui: programmazione event-driven · debug sistematico · sensori e attuatori · progettazione algoritmica · documentazione tecnica

*"Un robot non è mai finito. Ogni deployment rivela un bug che il laboratorio non aveva previsto."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in 🌍 AGISCI.**

---

### ● BASE — Costruisco un robot con comportamento pre-definito e guida

**Obiettivo:** programmare un micro:bit (o simulatore) per riprodurre un comportamento specifico usando strutture di controllo base.

**Scenario:** vuoi costruire un "sistema di allerta" per la biblioteca: un dispositivo che emette un suono e mostra un simbolo sul display quando rileva che qualcuno parla troppo ad alta voce (livello di rumore elevato).

*Nota: il micro:bit ha un microfono integrato (versione 2) o può usare un sensore di suono esterno.*

**Fasi:**
1. Apri l'editor MakeCode a browser (makecode.microbit.org).
2. Usa il blocco "on loud sound" (evento: suono alto rilevato): mostra un simbolo ❌ sul display, emetti un suono con buzzer.
3. Usa il blocco "on quiet sound": mostra un simbolo ✓ sul display.
4. Aggiungi un contatore: ogni volta che viene rilevato rumore elevato, incrementa una variabile `infrazioni` di 1. Mostra il valore sul display quando premi il pulsante A.
5. Testa nel simulatore (o su hardware reale).

**Domanda:** come cambieresti il programma per distinguere tra rumore "accettabile" (conversazione normale) e rumore "eccessivo" (grida)? Quale valore soglia useresti e come lo determineresti?

---

### ●● INTERMEDIO — Progetto un robot segui-linea con debugging documentato

**Obiettivo:** progettare, costruire (o simulare) e debuggare un robot che segue una linea nera su superficie bianca.

**Piattaforma:** micro:bit con Bit:bot XL o equivalente + 2 sensori di linea (fotoriflettori IR) — o simulatore equivalente.

**Algoritmo base da implementare:**
```
Mentre il robot è acceso:
  leggi sensore sinistro → valore 0 (bianco) o 1 (nero)
  leggi sensore destro → valore 0 (bianco) o 1 (nero)
  
  SE entrambi leggono bianco → vai dritto
  SE sinistro legge nero, destro legge bianco → ruota leggermente sinistra
  SE sinistro legge bianco, destro legge nero → ruota leggermente destra
  SE entrambi leggono nero → fermati (sei alla fine della linea)
```

**Fasi del lavoro:**
1. Traduci l'algoritmo in blocchi MakeCode.
2. Testa su una linea retta. Funziona? Documenta nel taccuino.
3. Testa su una curva. Il robot rimane sulla linea? Se no, identifica quale condizione non gestisce correttamente.
4. Aggiungi la gestione dell'incrocio: cosa deve fare il robot quando incontra un incrocio a T?
5. Documenta almeno 2 bug che hai trovato e come li hai corretti.

**Tabella di debugging:**

| Bug osservato | Condizione in cui si verifica | Causa identificata | Soluzione applicata |
|---|---|---|---|
| | | | |
| | | | |

---

### ●●● AVANZATO — Progetto robotico open-ended con documentazione completa

**Brief:** il tuo istituto ha un corridoio che può diventare pericolosamente affollato durante il cambio dell'ora. Il preside vuole un sistema che misuri il numero di persone che entrano e escono da una porta e mostri in tempo reale se il corridoio è "libero", "affollato" o "sovraffollato".

**Vincoli:**
- Budget hardware massimo: componenti disponibili in laboratorio (micro:bit, sensori ultrasuoni o IR).
- Nessuna telecamera o riconoscimento facciale (privacy).
- Il sistema deve funzionare anche se la connessione internet non è disponibile.

**Processo obbligatorio da documentare:**

**1. Analisi del problema:**
- Quali input ha il sistema? (cosa misura)
- Quali output deve produrre? (cosa mostra/segnala)
- Quali sono i casi limite? (cosa succede se due persone passano insieme, se qualcuno si ferma nella porta...)

**2. Algoritmo ad alto livello (in pseudocodice o diagramma di flusso):**
Scrivi l'algoritmo prima di toccare il codice. Il diagramma deve coprire tutti i casi identificati nell'analisi.

**3. Implementazione:**
Traduci l'algoritmo in codice MakeCode o MicroPython. Ogni funzione deve avere un nome che descrive cosa fa e un commento che spiega come.

**4. Test sistematico:**
Definisci almeno 5 scenari di test con risultato atteso e risultato ottenuto. Documenta in una tabella.

**5. Debugging documentato:**
Almeno 2 bug trovati durante il test con descrizione precisa e soluzione.

**6. Relazione tecnica (1-2 pagine):**
- Descrizione del sistema e del suo funzionamento
- Scelte algoritmiche principali e alternative considerate
- Limiti attuali del sistema (cosa non gestisce)
- Possibili miglioramenti nella versione 2.0
- Implicazioni etiche: questo sistema raccoglie dati sul movimento delle persone — chi ha accesso a questi dati? Come potrebbero essere usati impropriamente?

---

## 🌍 SPERIMENTA — avanzato

### La sfida dei sistemi distribuiti: più micro:bit che comunicano

I sistemi robotici reali raramente sono composti da un unico dispositivo. Sono reti di sensori e attuatori che comunicano e coordinano le loro azioni.

Il micro:bit supporta comunicazione radio (Bluetooth/radio proprietaria) tra dispositivi diversi. Con due o più micro:bit puoi costruire sistemi distribuiti:

**Proposta di progetto:** un sistema di guida per il corridoio con due micro:bit. Il primo è posizionato all'entrata del corridoio e conta le persone che entrano (usando un sensore IR di attraversamento). Il secondo è posizionato all'uscita e conta le persone che escono. I due si comunicano via radio il proprio conteggio ogni 5 secondi. Un terzo micro:bit (o lo stesso) calcola il numero di persone nel corridoio in tempo reale e attiva un LED verde (< 10 persone), giallo (10-20), rosso (> 20).

Questo progetto richiede: programmazione della radio micro:bit, sincronizzazione dei messaggi, gestione degli errori di comunicazione (cosa succede se un messaggio viene perso?), e progettazione del sistema fisico (dove posizionare i sensori per contare correttamente).

Documenta il processo con il formato della 🔬 SPERIMENTA Avanzato.

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | ● Base — Sufficiente | ●● Intermedio — Buono | ●●● Avanzato — Ottimo | ●●●● Eccellente |
|---|---|---|---|---|
| **1. Correttezza algoritmica** | Il programma funziona per il caso semplice senza casi limite | Il programma gestisce correttamente i casi principali con logica event-driven | Il programma gestisce tutti i casi identificati nell'analisi, con struttura modulare (funzioni) | Il programma include gestione degli errori esplicita e comportamento definito per ogni condizione anomala documentata |
| **2. Qualità del debugging** | Riconosce che c'è un problema ma non documenta il processo | Documenta il bug osservato e la soluzione applicata | Documenta bug osservato, condizione di occorrenza, causa identificata, e soluzione con verifica | Usa un metodo di debugging sistematico con isolamento progressivo del componente difettoso |
| **3. Documentazione** | Codice funzionante senza documentazione | Codice con commenti sulle sezioni principali e pseudocodice iniziale | Analisi del problema + pseudocodice + codice commentato + tabella di test | Documentazione completa con relazione tecnica, riflessioni sui limiti, proposta di versione 2.0 |
| **4. Pensiero critico sulle implicazioni** | Non affronta implicazioni etiche o sociali | Nomina un'implicazione etica del sistema progettato | Analizza almeno 2 implicazioni etiche con argomentazione | Propone misure concrete per mitigare i rischi identificati e distingue tra usi legittimi e usi problematici dei dati raccolti |

---

### Lo scenario

La tua scuola ha partecipato a un bando regionale: **"Robotica per l'inclusione."** Il finanziamento copre l'acquisto di 10 kit micro:bit. Spetta a te e al tuo gruppo progettare quale problema reale della scuola può essere risolto con questo hardware.

---

### La consegna

**Progetta un robot o sistema automatizzato che risolve un problema reale della tua scuola,** preferibilmente legato all'inclusione o all'accessibilità (ma non obbligatoriamente).

**Fase 1 — Identificazione del problema (individuale o di coppia):**
Osserva la tua scuola per un giorno. Identifica almeno 3 problemi che potrebbero essere risolti con un sistema automatizzato. Valutali in base a: fattibilità con il materiale disponibile, importanza per la comunità scolastica, implicazioni etiche.

**Fase 2 — Proposta:**
Scegli il problema più promettente. Scrivi una proposta di 1 pagina che include:
- Descrizione del problema con dati (quante persone è coinvolta, quanto spesso si verifica)
- Soluzione proposta
- Hardware necessario
- Algoritmo ad alto livello (diagramma di flusso o pseudocodice)
- Implicazioni etiche: questo sistema raccoglie dati su persone? Chi ha accesso a questi dati?

**Fase 3 — Implementazione:**
Costruisci un prototipo funzionante (su hardware reale se disponibile, su simulatore altrimenti). Documenta il processo con la struttura della 🔬 SPERIMENTA Avanzato.

**Fase 4 — Test e presentazione:**
Testa il sistema con almeno 3 scenari diversi. Presenta il progetto alla classe in 5 minuti: descrivi il problema, la soluzione, come funziona, e i suoi limiti.

---

### 🎯 Badge SDG 4 e 9 — Istruzione e Innovazione

Usare la robotica per risolvere problemi reali della scuola è applicazione concreta degli SDG 4 (istruzione di qualità) e 9 (innovazione). Un sistema che funziona — anche semplice — è un contributo reale, non un esercizio simulato.

---

### 🤖 Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

L'AI Coach risponde su questa MC. Puoi chiedere: *"Come faccio a far comunicare due micro:bit?"*, *"Qual è la differenza tra un ciclo while e un gestore di evento?"*, *"Come scrivo un diagramma di flusso?"*
Ricorda: verifica sempre le risposte che ricevi.

---

### 🪞 Metacognizione — Rifletti sul tuo lavoro

**1. Il momento del "finalmente funziona"**
C'è stato un momento in cui il robot ha fatto esattamente quello che volevi per la prima volta? Descrivi cosa avevi cambiato nell'ultima iterazione e cosa ti aveva portato a fare quella modifica.

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Debugging: il bug più difficile**
Qual è stato il bug più difficile da trovare? Perché era difficile? Quale strategia hai usato per isolarlo?

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa — obbligatorio**
Descrivi un momento in cui il tuo algoritmo era logicamente sbagliato — non un errore di codice, ma un errore di ragionamento. Come lo hai scoperto? Il robot ti ha insegnato qualcosa sull'algoritmo che non avevi visto sulla carta?

*Se scrivi "non ho fatto errori di logica" vuol dire che hai costruito qualcosa di troppo semplice per questa MC.*

*Scrivi 3-4 righe:* ___________________________________________

---

**4. Etica e dati**
Il sistema che hai progettato raccoglie informazioni su persone (movimenti, comportamenti, presenza)? Chi ha accesso a questi dati? Come potresti modificare il sistema per raccogliere solo i dati strettamente necessari alla funzione, senza raccogliere informazioni aggiuntive? (Questo principio si chiama "data minimization" — minimizzazione dei dati — ed è parte del GDPR europeo.)

*Scrivi 3-4 righe:* ___________________________________________

---

### 🔗 Collegamento con UDA-3 — "Scuola Smart"

Questa MC è parte dell'UDA interdisciplinare del terzo anno *"Scuola Smart"*: progettare un sistema automatizzato per la scuola integrando robotica (questa MC), dati e sensori (MC-INF-3-01), e comunicazione digitale (MC-COM-3-04). Il prototipo che hai costruito può diventare la base del progetto UDA — ma richiede la collaborazione con i compagni che lavorano sulle altre MC.

---

## APPENDICE — Tech in English

| Italiano | English | Come si legge |
|---|---|---|
| sensore | sensor | /ˈsensə/ |
| attuatore | actuator | /ˈæktʃueɪtə/ |
| debugging | debugging | /dɪˈbʌɡɪŋ/ |
| pensiero computazionale | computational thinking | /ˌkɒmpjuˈteɪʃənl ˈθɪŋkɪŋ/ |
| gestione degli eventi | event handling | /ɪˈvent ˈhændlɪŋ/ |

> *In English we say: "The sensor triggers an event that the event handler processes."*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- 📖 ESPLORA: il confronto tra i tre robot educativi (micro:bit, EV3, Arduino) va in tabella comparativa a piena larghezza.
- Il Box T8 (IA critica) va come box separato con bordo colorato — è obbligatorio per tutte le MC DIG livello A.
- Il caso studio Deep Blue vs. AlphaGo va come doppio riquadro affiancato con immagine dei due sistemi.
- 🔬 SPERIMENTA Avanzato: la tabella di debug e la relazione tecnica sono fotocopiabili.

**Per l'agente generatore asset:**
- Visual richiesto 1: diagramma di flusso del robot segui-linea (🔬 SPERIMENTA Intermedio) con notazione standard.
- Visual richiesto 2: infografica sensori e attuatori — schema hardware con etichette e descrizione funzionale.
- Visual richiesto 3: mappa concettuale pensiero computazionale avanzato (decomposizione → pattern → astrazione → algoritmo) con esempi per ciascuno.
- Hook audio: disponibile in MC-DIG-3-01_hook-script.md.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: Hypertech 2020 · Allineata IN 2025 (D.M. n. 221/2025)*
*Livello Advanced (A) — struttura 5 zone + Zona 4b · libro-ready*
