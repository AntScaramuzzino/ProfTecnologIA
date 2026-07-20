# MC-ENE-3-06 — Come si conserva l'energia? Batterie, idrogeno e reti intelligenti.
**Area:** Energia e Macchine · **Anno:** 3ª · **Livello DigComp:** Advanced (A)
**SDG:** 7 — Energia pulita e accessibile · 9 — Innovazione e infrastrutture · 13 — Azione per il clima
**Fonte:** originale · **Struttura:** 6 pagine (doppio spread espanso, livello Advanced) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Alle tre di notte, il vento soffia — ma la città dorme"**
> 🎧 *Ascolta prima di leggere. Durata: 56 sec.*

**Domanda di avvio:**
Immagina un campo eolico in Danimarca a dicembre. Sono le tre di notte. Il vento soffia forte — perfetto per produrre energia. Le turbine girano a piena potenza e producono più elettricità di quanta la Danimarca riesca ad assorbire in quel momento.

Cosa succede a quell'energia?

La si butta via. Letteralmente. Le turbine vengono rallentate artificialmente, il vento viene sprecato, i produttori vengono pagati (sì, pagati) per *non* produrre.

Questo fenomeno si chiama **curtailment** — taglio della produzione — ed è uno dei problemi più grandi della transizione energetica. Non la mancanza di rinnovabili. Il problema opposto: troppa energia nel momento sbagliato e nessun modo per spostarla nel tempo.

Risolvere questo problema — immagazzinare energia quando è abbondante e rilasciarla quando serve — è forse la sfida ingegneristica più importante del XXI secolo.

Nelle prossime pagine impari perché è così difficile, e cosa l'umanità sta facendo per riuscirci.

---

## 📖 ESPLORA

### Il problema dell'intermittenza: la risorsa che non si controlla

Le fonti rinnovabili principali — solare e eolico — hanno una caratteristica che le distingue fondamentalmente dal carbone, dal gas o dal nucleare: **non si accendono e spengono su richiesta**. Producono energia quando il sole splende e il vento soffia — non necessariamente quando la gente ne ha bisogno.

Il fotovoltaico produce il picco di energia a mezzogiorno, quando il sole è alto. Ma il picco di consumo elettrico nelle città italiane è tra le 18 e le 21 — quando le persone tornano a casa, accendono luci, forni, tv, lavatrice. Il sole nel frattempo è già tramontato.

L'energia eolica è ancora più imprevedibile: a volte soffia di notte, a volte per giorni interi non soffia affatto.

Una rete elettrica deve bilanciare **in ogni istante** la produzione con il consumo. Se si producono 1.000 MW e ne vengono consumati 800, i 200 MW eccedenti causano una sovrafrequenza che può danneggiare i trasformatori e le apparecchiature industriali. Se ne vengono consumati 1.200 invece di 1.000, c'è un deficit di frequenza e le centrali di backup devono entrare in funzione in pochi secondi.

Tradizionalmente, questo bilanciamento lo facevano le centrali termoelettriche: si alzava o abbassava la fiamma delle turbine a gas in base alla domanda. Con le rinnovabili che coprono sempre più quota della produzione, queste centrali non bastano più — sono troppo lente e inquinanti per fare solo da "tampone".

La soluzione è l'**accumulo energetico**: immagazzinare l'energia quando è abbondante (e magari a basso costo), rilasciarla quando è scarsa (e cara). L'accumulo trasforma le rinnovabili intermittenti in una fonte controllabile.

---

### Le batterie agli ioni di litio: come funzionano davvero

La batteria del tuo telefono, del laptop, dell'auto elettrica — tutte usano la stessa tecnologia fondamentale: le **celle agli ioni di litio**.

Il principio chimico è quello di una **cella elettrochimica**: due elettrodi (anodo e catodo) immersi in un elettrolita (liquido che permette il movimento degli ioni). Quando la batteria si scarica, gli ioni di litio migrano dall'anodo al catodo attraverso l'elettrolita, e questo movimento genera una corrente elettrica nel circuito esterno. Quando si ricarica, la corrente esterna spinge gli ioni nella direzione opposta.

**Il litio:** perché proprio il litio? Perché è l'elemento metallico più leggero (peso atomico 6,94), ha una densità di energia elevatissima, e il potenziale elettrochimico del litio è tra i più alti degli elementi. Risultato: batterie leggere e ad alta capacità.

**Dove si trova il litio?** Il "triangolo del litio" (Argentina, Bolivia, Cile) contiene oltre il 50% delle riserve mondiali di litio. L'estrazione avviene da laghi salati (salari) con un processo che usa enormi quantità di acqua — problema serio in zone già aride. L'Australia estrae litio da rocce dure (spodumene). L'Europa quasi non ne ha: dipende al 97% dalle importazioni, principalmente da Cile e Australia.

> **Box Fisica — Energia immagazzinata in una batteria:**
>
> L'energia di una batteria si misura in **wattora (Wh)**: quanti watt puoi erogare per quante ore.
>
> Formula: E (Wh) = V (volt) × Ah (ampereora)
>
> Una batteria da 12V e 100Ah immagazzina: E = 12 × 100 = 1.200 Wh = **1,2 kWh**
>
> Per confronto:
> - Batteria smartphone: 0,015 kWh (15 Wh)
> - Batteria laptop: 0,05–0,1 kWh
> - Powerwall Tesla (accumulo domestico): 13,5 kWh
> - Batteria Tesla Model 3 Long Range: 82 kWh
> - Batteria grande impianto in rete (utility scale): 100.000 kWh = 100 MWh
>
> *Questa formula è valida per qualsiasi tipo di batteria. La userai nel laboratorio e nel compito di realtà.*

**Il costo delle batterie litio è crollato:**
Nel 1991, Sony lanciò la prima batteria agli ioni di litio commerciale: costava circa 3.000 dollari per kWh di capacità.
Nel 2010: 1.200 dollari/kWh.
Nel 2020: 137 dollari/kWh.
Nel 2024: circa 90–100 dollari/kWh.
Nel 2030 (previsione BloombergNEF): sotto i 60 dollari/kWh.

Una riduzione del **97% in 30 anni**. Nessuna altra tecnologia energetica ha mai visto un calo di costi così rapido e sostenuto — nemmeno il fotovoltaico (che ha "solo" calato del 90% in 15 anni).

**Il riciclo:** le batterie agli ioni di litio contengono litio, cobalto, nichel, manganese — metalli preziosi e difficili da estrarre. Riciclarle è sia un imperativo ambientale sia economicamente conveniente. La direttiva europea sulle batterie 2023/1542 impone che le batterie vendute in Europa dal 2027 abbiano percentuali minime di materiali riciclati. Il riciclo è però ancora tecnologicamente complesso: le celle vengono tritate, trattate chimicamente, separate. Il tasso di recupero del litio è al momento dell'70–80%.

---

### Batterie a flusso (flow batteries): per impianti grandi

Le batterie agli ioni di litio vanno bene per auto e per accumuli domestici, ma per impianti di grandi dimensioni (da 100 MWh a 10 GWh) hanno un problema: crescere di dimensione aumenta proporzionalmente sia il costo sia il rischio (un pacco batterie grande è anche una grande riserva di energia che può prendere fuoco se mal gestita — l'incidente di 2021 all'impianto di stoccaggio di McMicken in Arizona ne è un esempio).

Le **batterie a flusso vanadio-redox** usano un approccio completamente diverso: l'energia è immagazzinata in due serbatoi di liquido (elettroliti a base di ioni di vanadio), separati da una membrana. Quando si carica, la reazione chimica avviene tra i due liquidi. Quando si scarica, la reazione è invertita.

Vantaggi: la capacità dipende dalla dimensione dei serbatoi (puoi aggiungere più liquido), la sicurezza è alta (i liquidi non bruciano), la durata è lunghissima (più di 20.000 cicli di carica/scarica, contro i 1.500–3.000 del litio). Svantaggi: densità di energia bassa (occupa molto spazio), costo elevato, tecnologia ancora matura ma non di massa.

---

### Accumulo con idrogeno verde: la soluzione stagionale

L'idrogeno è l'elemento più abbondante nell'universo. Sulla Terra non esiste quasi mai da solo, ma è ovunque combinato con altri elementi — principalmente nell'acqua (H₂O) e negli idrocarburi.

Per usare l'idrogeno come vettore energetico si parte dalla **elettrolisi dell'acqua**: si passa corrente elettrica attraverso l'acqua e si separano idrogeno (H₂) e ossigeno (O₂). Se la corrente usata viene da fonti rinnovabili, l'idrogeno prodotto si chiama **idrogeno verde** — nessuna emissione durante la produzione.

L'idrogeno verde viene poi immagazzinato (in forma compressa a 700 bar, o liquefatta a −253°C, o legato a composti chimici solidi) e rilasciato attraverso una **cella a combustibile (fuel cell)**: l'inverso dell'elettrolisi, dove H₂ e O₂ si ricombinano producendo acqua e corrente elettrica.

**Perché l'idrogeno è interessante per l'accumulo stagionale?**
Le batterie sono eccellenti per l'accumulo giornaliero (carica di giorno, scarica di sera) e settimanale. Ma per l'accumulo stagionale (estate → inverno) richiederebbero quantità enormi di batterie. L'idrogeno si può immagazzinare in grandi quantità a costo relativamente basso: un gasdotto riconvertito, un serbatoio sotterraneo, una caverna salina.

**Le sfide:**
L'efficienza del ciclo elettrolisi → stoccaggio → fuel cell è bassa: circa il 25–35% dell'energia elettrica iniziale torna come elettricità. Cioè: per immagazzinare 100 kWh devi usarne 100, e quando li recuperi ne ottieni solo 25–35. Confronta con le batterie al litio: efficienza del ciclo 85–90%.

L'idrogeno verde è oggi 4–5 volte più costoso dell'idrogeno da gas naturale. Servono grandi riduzioni di costo degli elettrolizzatori (macchine che fanno l'elettrolisi) per renderlo competitivo. Il progetto REPowerEU prevede 10 milioni di tonnellate di idrogeno verde all'anno in Europa entro il 2030 — un obiettivo ambizioso.

---

### Accumulo pompato: il gigante invisibile

Il sistema di accumulo energetico più usato al mondo non usa batterie, né idrogeno. Usa l'**acqua**.

Il **pumped-storage hydropower** (accumulo idroelettrico pompato) funziona così:
1. Quando c'è energia in eccesso (es. di notte, quando il consumo è basso), si usano pompe elettriche per spingere acqua da un bacino a valle verso un bacino in quota
2. L'acqua sale, accumula **energia potenziale gravitazionale** (mgh, dove m è la massa, g la gravità, h l'altezza)
3. Quando serve energia, l'acqua scorre di nuovo verso il basso, le pompe si trasformano in turbine, e si produce elettricità

Efficienza del ciclo: 70–85%. Capacità mondiale installata: oltre 170 GW. In Italia ci sono diversi impianti di questo tipo nelle Alpi.

Il limite: serve un sito geografico con due bacini a quote diverse e abbastanza vicini. Non si può costruire ovunque.

---

### Volani e supercondensatori: l'accumulo dei millisecondi

Per alcune applicazioni — stabilizzare la frequenza di rete nei primi secondi prima che le centrali di backup entrino in funzione, alimentare grandi carichi industriali per periodi brevissimi — servono sistemi di accumulo che rilasciano energia in frazioni di secondo.

**Volani (flywheel):** un disco pesante che gira a velocità altissima (fino a 60.000 giri al minuto) in un ambiente sottovuoto per ridurre gli attriti. L'energia cinetica immagazzinata si converte in elettricità rallentando il disco. Efficienza alta, risposta istantanea, durata praticamente illimitata. Limite: non si può immagazzinare energia per ore o giorni.

**Supercondensatori (ultracapacitors):** come i condensatori normali ma con capacità enormemente maggiore. Carica e scarica in millisecondi. Usati nelle auto Formula E per recuperare l'energia frenata e rilasciarla in frenata-riaccelera. Limite: densità di energia molto inferiore alle batterie — non adatti per accumuli di grandi quantità.

---

### Smart grid: la rete elettrica intelligente

Una **smart grid** (rete elettrica intelligente) non è solo una rete elettrica con più tecnologia. È un cambio di paradigma: da una rete "unidirezionale" (le centrali producono, i consumatori consumano) a una rete **bidirezionale** (tutti possono produrre, consumare, immagazzinare, cedere energia).

**Gli elementi fondamentali di una smart grid:**

**Contatori intelligenti (smart meter):**
Ogni utente ha un contatore che comunica in tempo reale con il gestore di rete. Può misurare il consumo ora per ora, segnalare guasti, e ricevere segnali di prezzo dinamici. In Italia dal 2017 è in corso l'installazione di 35 milioni di contatori 2G (seconda generazione).

**Gestione attiva della domanda (Demand Response):**
Quando la rete è sotto stress (troppo consumo, troppo poco vento), il gestore invia segnali agli utenti industriali e domestici per ridurre il consumo. Un grande stabilimento industriale può spegnere temporaneamente macchinari non critici. Una lavatrice "smart" può posticipare il lavaggio di un'ora. In cambio: riduzione della bolletta.

**Vehicle-to-Grid (V2G):**
L'auto elettrica è, tra le altre cose, una batteria su ruote: può avere 50–100 kWh di capacità. Il 94% del tempo, un'auto è parcheggiata. Con il V2G, la batteria dell'auto è collegata alla rete quando è parcheggiata e può **cedere energia** alla rete nelle ore di picco, ricaricarsi nelle ore di basso consumo. L'auto diventa un nodo attivo della rete.

**Mercato elettrico europeo e prezzi negativi:**
L'elettricità in Europa è scambiata su un mercato all'ingrosso dove il prezzo varia ora per ora. Nei giorni di forte vento e poco consumo, il prezzo può diventare **negativo**: i produttori pagano i consumatori per assorbire l'eccesso. Nel 2024 in Germania ci sono stati oltre 400 ore di prezzi negativi — ore in cui producevano più rinnovabili di quante ne potessero usare. È il segnale più chiaro dell'urgenza dell'accumulo.

---

> **Dati:**
> Il costo delle batterie al litio è sceso del 97% in circa 30 anni (da ~3.000 $/kWh nel 1991 a ~90 $/kWh nel 2024). Fonte: BloombergNEF Battery Price Survey 2024.
>
> Nel 2024, le rinnovabili (solare + eolico + idroelettrico) hanno coperto il 47% della produzione elettrica dell'Unione Europea (Ember Climate, 2025).
>
> L'accumulo pompato rappresenta il 90% di tutta la capacità di accumulo energetico installata nel mondo — circa 170 GW. Fonte: IEA Hydropower Special Report 2023.

---

## 🔍 OSSERVA

### Caso studio: la Gigafactory di Tesla in Nevada

Nel 2014, Elon Musk annunciò la costruzione di una fabbrica di batterie senza precedenti nel deserto del Nevada, vicino a Sparks: la **Gigafactory 1**.

Perché è importante?

Nel 2013, la produzione mondiale di batterie agli ioni di litio era di circa 28 GWh all'anno — per tutti i produttori del mondo messi insieme. Tesla voleva costruire, da sola, una fabbrica da 35 GWh all'anno. Solo questa fabbrica avrebbe praticamente raddoppiato la produzione mondiale.

La logica era semplice: le batterie costavano troppo per rendere le auto elettriche competitive. L'unico modo per ridurre il costo era produrre a scala enorme — economie di scala, ottimizzazione dei processi, integrazione verticale. Costruire la fabbrica più grande del mondo sarebbe stato il catalizzatore.

**Risultati effettivi:**
- Aperta nel 2016 (parzialmente), capacità progressivamente espansa
- Nel 2023: circa 70 GWh/anno di produzione di celle
- Ha contribuito al calo del costo delle batterie del 35% tra il 2015 e il 2020

**Perché è rilevante per la transizione energetica:**
La Gigafactory non produce solo batterie per auto. Produce anche il **Powerwall** (accumulo domestico, 13,5 kWh) e il **Megapack** (accumulo utility-scale, 3,9 MWh ciascuno, installati a centinaia in impianti come quello di Moss Landing in California — il più grande impianto di accumulo al mondo con oltre 3 GWh di capacità).

**La catena del valore:**
Tesla non estrae litio, ma ha stipulato accordi di fornitura con miniere in Australia e nel triangolo del litio sudamericano. I "catodi" (parte chiave della cella) vengono prodotti in Nevada. Le celle vengono assemblate in pacchi batteria. I pacchi vengono installati nei veicoli o negli impianti di stoccaggio.

**La sfida del cobalto:**
Il cobalto è un elemento presente in molte celle ai ioni di litio (nelle chimiche NMC e NCA). Circa il 70% del cobalto mondiale viene estratto nella Repubblica Democratica del Congo, spesso con condizioni di lavoro gravissime e, in alcune aree, con utilizzo di lavoro minorile. Tesla e altri produttori stanno lavorando attivamente per ridurre o eliminare il cobalto dalle loro celle (batterie LFP — litio ferro fosfato — non usano cobalto e sono già usate nei Powerwall e in alcuni veicoli).

---

> **Errore comune — il mito del "problema della batteria":**
> "Le batterie delle auto elettriche durano poco e il loro smaltimento è disastroso per l'ambiente." Questa affermazione è parzialmente vera ma molto esagerata. Le batterie di un'auto elettrica sono progettate per durare 10–15 anni o 200.000+ km. I dati di Tesla mostrano che le batterie della Model S perdono in media meno del 10% di capacità dopo 300.000 km. Lo smaltimento è un problema reale ma già parzialmente risolto: le batterie "esaurite" (con meno dell'80% della capacità originale) vengono riusate come sistemi di accumulo stazionario prima di essere riciclate. Il tasso di recupero dei materiali è in crescita costante.

---


### 🏡 Chi lavora con questa competenza nel 2030?

**Energy Efficiency Advisor**

Ottimizza impianti elettrici e domotici per ridurre i consumi negli edifici, progettando soluzioni di smart home e certificando le prestazioni energetiche secondo normativa.

Dove lavora: aziende di facility management, property company, strutture ricettive e alberghiere, grandi aziende con patrimoni immobiliari estesi.

Competenze chiave che inizia a costruire da qui: domotica avanzata · normativa CEI · auditing energetico · smart home · certificazioni APE

*"Una casa efficiente non rinuncia al comfort. Consuma meno per dare di più."*


**Urban Sensor Network Manager**

Gestisce il sistema nervoso di un edificio intelligente: centinaia di sensori che misurano consumi elettrici, temperatura, presenza nelle stanze e qualità dell'aria, tutti collegati al building management system, il software che governa impianti e automazioni. Con questi dati regola luci, riscaldamento e ricarica delle batterie, spostando i consumi nelle ore in cui la rete offre energia più pulita ed economica — così l'edificio dialoga con la smart grid invece di subirla.

Dove lavora: società di facility management, grandi complessi direzionali e ospedali, campus universitari, aziende di domotica e building automation, utility energetiche.

Competenze chiave che inizia a costruire da qui: IoT building · domotica · data visualization · reti di sensori · building management system (BMS)

*"Un edificio produce dati ogni secondo: sprecarli costa quanto lasciare le finestre aperte d'inverno."*

---

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**

---

### ● BASE — Analizzo e calcolo l'energia di diversi sistemi di accumulo

**Obiettivo:** capire le differenze di scala tra sistemi di accumulo diversi, usando la formula E = V × Ah.

**Strumenti:** calcolatrice, foglio di carta

**Tabella da completare:**

Usa la formula E (Wh) = V (volt) × Ah (amperaora) per calcolare i Wh, poi converti in kWh dividendo per 1.000.

| Sistema di accumulo | Tensione (V) | Capacità (Ah) | Energia (Wh) | Energia (kWh) |
|---------------------|-------------|---------------|-------------|---------------|
| Batteria smartphone | 3,7 V | 4 Ah | ? | ? |
| Batteria bici elettrica | 36 V | 13 Ah | ? | ? |
| Powerwall Tesla domestico | 50 V | 270 Ah | ? | ? |
| Batteria auto elettrica media | 350 V | 200 Ah | ? | ? |
| Impianto utility-scale piccolo | 800 V | 12.500 Ah | ? | ? |

*Nota: i valori di tensione e Ah sono semplificati per il calcolo.*

**Poi rispondi:**
1. Quante batterie per smartphone servirebbero per avere la stessa energia di una batteria d'auto?
2. Quante batterie d'auto servirebbero per un impianto utility-scale?
3. Perché l'impianto utility-scale non usa semplicemente tante batterie per auto?

---

### ●● INTERMEDIO — Progetto un sistema di accumulo domestico

**Scenario:** una famiglia ha un impianto fotovoltaico da 6 kW sul tetto. In estate, produce 30 kWh al giorno ma la famiglia ne consuma solo 10 kWh nelle ore diurne. Di notte consuma 8 kWh (luci, frigorifero, TV). Vuole accumulare l'energia prodotta di giorno per usarla di notte.

**I tuoi calcoli:**

1. Quanta energia è disponibile per l'accumulo al giorno? (produzione − consumo diurno)

2. Considerando un'efficienza del ciclo della batteria del 90%, quanta energia devi effettivamente immagazzinare per avere 8 kWh disponibili di notte?

3. Il Powerwall Tesla ha una capacità utile di 13,5 kWh. È sufficiente? Quanti Powerwall servono?

4. Un Powerwall costa circa 12.000 € installato. L'elettricità dalla rete costa 0,30 €/kWh. Quanto si risparmia all'anno (considera che senza accumulo si compra dalla rete tutta l'energia notturna, 8 kWh × 365 giorni × 0,30 €/kWh)?

5. Calcola il **payback period** (tempo di ritorno dell'investimento) in anni: costo / risparmio annuo.

6. È conveniente? Dipende da quali fattori?

---

### ●●● AVANZATO — Progetto un sistema energetico per un edificio scolastico

**Obiettivo:** dimensionare un sistema di accumulo per la scuola, analizzare le opzioni disponibili, e valutare la fattibilità economica con un'analisi critica delle ipotesi.

**Dati di partenza (da ricercare/stimare):**
- Superficie del tetto della tua scuola: da misurare su Google Maps (strumento righello)
- Consumo medio di una scuola secondaria in Italia: circa 50 kWh/giorno per ogni 100 m² di edificio

**Il tuo compito — consegna in forma di relazione tecnica (4–6 pagine o presentazione equivalente):**

**Parte 1 — Dimensionamento produzione:**
- Calcola la superficie disponibile per il fotovoltaico (escludi 30% per ombre, passaggi, ecc.)
- Un pannello standard misura 1,7 × 1 m e produce 400 Wp (watt di picco). Quanti pannelli ci stanno?
- In Italia centrale, un kWp installato produce mediamente 1.200 kWh/anno. Qual è la produzione annua stimata?
- La produzione è uniforme durante l'anno? Cerca i dati di irraggiamento mensile per la tua regione (PVGIS, strumento EU gratuito online).

**Parte 2 — Dimensionamento accumulo:**
- Il consumo della scuola è concentrato nelle ore scolastiche (8-14 in inverno, 8-13). Il fotovoltaico produce anche nel pomeriggio. Quanta energia potrebbe essere accumulata ogni giorno in un giorno tipico di ottobre?
- Dimensiona un sistema di accumulo (numero di Powerwall o equivalenti) sufficiente per coprire il 100% del consumo delle ultime ore scolastiche con energia accumulata.

**Parte 3 — Analisi economica:**
- Stima il costo dell'impianto (fotovoltaico + accumulo) usando i prezzi indicativi del mercato italiano 2026
- Il conto energia (incentivi statali) non è più disponibile in quella forma, ma esiste il Superbonus/Bonus Energia per gli enti pubblici. Cerca se la tua scuola (ente pubblico) ha accesso a incentivi attuali.
- Calcola il payback period con e senza incentivi.

**Parte 4 — Analisi critica:**
- Quali ipotesi hai dovuto fare che potrebbero essere sbagliate?
- Il sistema ha senso economicamente? Se no, perché no — e cosa dovrebbe cambiare (prezzi, incentivi, consumo) per renderlo conveniente?
- La scuola potrebbe partecipare a una "comunità energetica rinnovabile" (CER — introdotte dal D.Lgs. 199/2021)? Cosa è una CER e quale vantaggio darebbe?

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione avanzata — leggila PRIMA di iniziare il compito

| Criterio | ●● Intermedio — Buono | ●●● Avanzato — Ottimo | ●●●● Eccellenza — Oltre |
|----------|----------------------|----------------------|------------------------|
| **1. Comprensione tecnica dei sistemi di accumulo** | Descrive correttamente il funzionamento di almeno tre tecnologie (litio, pompato, idrogeno) | Confronta le tre tecnologie con dati quantitativi (efficienza, densità energetica, costo/kWh, vita utile) | Identifica per ogni tecnologia il contesto applicativo ottimale e spiega perché non esiste una tecnologia "universalmente migliore" |
| **2. Calcoli energetici** | Applica la formula E = V × Ah e calcola capacità necessaria per uno scenario | Costruisce un bilancio energetico completo (produzione, perdite, accumulo, consumo) per uno scenario | Dimensiona un sistema con più componenti, include analisi di sensibilità ("cosa succede se il consumo aumenta del 20%?") |
| **3. Analisi economica** | Calcola costo totale e risparmio annuo | Calcola payback period e discute se l'investimento è conveniente | Identifica le variabili chiave (prezzo energia, incentivi, durata batteria) che determinano la convenienza, e analizza scenari ottimistico/pessimistico |
| **4. Pensiero sistemico** | Capisce che il problema dell'accumulo riguarda l'intera rete | Descrive come la smart grid integra produzione distribuita, accumulo e domanda flessibile | Analizza le implicazioni politiche e geopolitiche: dipendenza dal litio, mercato elettrico, ruolo delle comunità energetiche |
| **5. Qualità dell'argomentazione** | La relazione ha struttura chiara e risponde alle domande | La relazione cita fonti verificabili, distingue fatti da opinioni, usa i dati per supportare le conclusioni | La relazione anticipa le obiezioni principali alla propria tesi, le affronta con dati, e qualifica le conclusioni con le ipotesi su cui si basano |

---

### Lo scenario

Un piccolo Comune dell'Appennino (2.000 abitanti, 800 m di quota) vuole diventare "energeticamente indipendente" entro il 2030 — cioè produrre tanta energia rinnovabile quanta ne consuma, immagazzinarla quando è in eccesso, e non dipendere dalla rete esterna che è spesso instabile a causa di nevicate e fulmini.

Il Comune ha:
- Un piccolo torrente con portata media di 50 litri/secondo e un dislivello di 40 m (possibile mini-idroelettrico)
- Tetti di edifici pubblici per 2.000 m² di superficie orientata a sud (possibile fotovoltaico)
- Un parcheggio coperto con 30 stalli (possibile integrazione V2G con auto elettriche dei dipendenti)
- Un vecchio serbatoio dell'acqua inutilizzato a 60 m di quota (possibile accumulo pompato in miniatura)

Il Comune ti incarica di una relazione tecnica di fattibilità. Non devi risolvere ogni dettaglio ingegneristico: devi capire le opzioni, valutarle qualitativamente e quantitativamente dove possibile, e dare una raccomandazione motivata.

---

### La consegna

**Relazione tecnica di fattibilità — 4–6 pagine (o 10–12 slide)**

**Sezione 1 — Analisi del fabbisogno:**
Stima il consumo energetico annuo del Comune. Usa come riferimento: 1.200 kWh/anno per persona per consumo residenziale, più 30% per edifici pubblici e illuminazione. Quanto è il totale in kWh/anno?

**Sezione 2 — Analisi delle fonti di produzione disponibili:**

*Mini-idroelettrico:* formula P (watt) = η × ρ × g × Q × h, dove η = rendimento (0,85), ρ = densità acqua (1000 kg/m³), g = 9,81 m/s², Q = portata in m³/s, h = dislivello in m. Calcola la potenza e l'energia annua producibile.

*Fotovoltaico:* 2.000 m² di tetto, efficienza dei pannelli 20%, irraggiamento medio 1.300 kWh/m²/anno. Calcola l'energia annua producibile.

*Totale produzione:* il Comune è in grado di produrre abbastanza energia da essere indipendente?

**Sezione 3 — Analisi delle opzioni di accumulo:**
Per ciascuna delle seguenti opzioni, indica: principio di funzionamento, stima della capacità realizzabile nel contesto del Comune, efficienza, stima del costo, pro e contro:
1. Accumulo pompato con il serbatoio esistente (calcola la capacità: E = m × g × h, dove m è la massa d'acqua, stima volume del serbatoio in 500 m³)
2. Batterie agli ioni di litio utility-scale
3. Partecipazione a una Comunità Energetica Rinnovabile con i Comuni vicini

**Sezione 4 — Analisi del sistema V2G:**
Il parcheggio ha 30 stalli. Se metà delle auto dei dipendenti diventassero elettriche (15 auto), ognuna con 50 kWh di batteria, e cedessero alla rete il 30% della loro energia durante il giorno (quando la domanda è alta), quanta energia totale sarebbe disponibile? Quando converrebbe usarla (mattina o pomeriggio)?

**Sezione 5 — Raccomandazione:**
Data l'analisi, qual è la combinazione di fonti e accumuli che raccomanderesti come primo passo? Perché? Quali dati aggiuntivi servirebbero per una progettazione definitiva?

---

### Materiali che ti servono

- Calcolatrice
- Google Maps (per misurare superfici e dislivelli)
- PVGIS (photovoltaic.jrc.ec.europa.eu) — strumento EU gratuito per dati di irraggiamento solare per qualsiasi punto dell'Italia
- I dati di questa MC (efficienza sistemi, costo/kWh)

> **Suggerimento per il livello Eccellenza:** cerca online "comunità energetica rinnovabile [tuo comune o regione]" — ci sono già esperienze concrete in molte regioni italiane. Citare un caso reale rafforza l'argomentazione.

---

### 🎯 Badge SDG 7, 9, 13 — Energia, Innovazione, Clima

L'accumulo energetico non è una tecnologia interessante solo per chi vuole risparmiare sulla bolletta. È la chiave della transizione energetica globale: senza accumulo, non si può abbandonare le centrali a gas che compensano l'intermittenza delle rinnovabili. Senza accumulo, le rinnovabili non possono superare il 30-40% del mix elettrico senza creare problemi di stabilità alla rete.

Ogni progetto di accumulo che viene realizzato — anche una piccola CER in un Comune dell'Appennino — contribuisce a dimostrare che il sistema funziona, a creare competenze locali, e ad abbassare i costi attraverso l'esperienza accumulata.

---

### 🤖 Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Questa MC è al livello Advanced: le domande che puoi fare all'AI Coach possono essere più complesse.

Esempi:
- *"Qual è la differenza tra capacità della batteria in Wh e in Ah?"*
- *"Come si calcola la potenza di un mini-idroelettrico?"*
- *"Cos'è esattamente una Comunità Energetica Rinnovabile in Italia?"*

Importante: per i dati quantitativi (prezzi, rendimenti, capacità), verifica sempre le informazioni su fonti primarie (IEA, BloombergNEF, GSE per l'Italia). L'AI può avere dati aggiornati al massimo alla sua data di addestramento — il mercato delle batterie cambia rapidamente.

---

### 🪞 Metacognizione ampliata — Rifletti su più livelli

**1. Il salto di scala**
In questa MC hai lavorato con valori che vanno da 15 Wh (batteria telefono) a 1.000.000 kWh (grande impianto di accumulo). Questo salto di scala di 8 ordini di grandezza è difficile da visualizzare intuitivamente. Come hai gestito questo salto? Hai trovato analogie o metafore che ti hanno aiutato a capire? Descrivile.

*Scrivi 4-5 righe:* ___________________________________________

---

**2. La tensione tra sostenibilità e criticità dei materiali**
Le batterie agli ioni di litio sono fondamentali per la transizione energetica. Ma il litio viene estratto con alto impatto idrico nel deserto sudamericano, e il cobalto spesso con condizioni di lavoro inaccettabili in Congo. Come hai affrontato questa contraddizione nell'analisi? Pensi che la transizione energetica sia "sostenibile" anche sotto il profilo sociale e minerario?

*Scrivi 4-5 righe:* ___________________________________________

---

**3. Le ipotesi che reggono (o no) la tua analisi**
Nel compito di realtà hai fatto molte ipotesi: che il sole produca secondo la media, che il consumo rimanga costante, che i prezzi dell'energia non cambino. Quali di queste ipotesi ti sembrano più fragili — cioè quelle che, se si rivelassero errate, cambierebbero completamente le tue conclusioni? Come potresti raccogliere dati reali per sostituirle?

*Scrivi 4-5 righe:* ___________________________________________

---

**4. Dalla tecnica alla politica**
Hai capito che la smart grid e i sistemi V2G richiedono non solo tecnologia ma anche norme, incentivi, accordi tra privati e gestori di rete. In Italia, le Comunità Energetiche Rinnovabili (CER) sono state introdotte nel 2021 ma la crescita è ancora lenta. Quali ostacoli non tecnologici pensi che stiano rallentando la transizione? Come potresti contribuire, da cittadino, a ridurli?

*Scrivi 4-5 righe:* ___________________________________________

---

### 🔗 Collegamento con UDA-3 — "L'energia nella mia scuola" e MC-INF-3-01

Questa MC è il culmine tematico dell'area ENE del terzo anno. La relazione tecnica del compito di realtà — il sistema energetico del Comune — è anche la base per l'UDA-3 "L'energia nella mia scuola": il progetto interdisciplinare finale che integra i dati raccolti con i sensori di MC-INF-3-01, l'analisi con gli strumenti digitali di MC-DIG-3-01, e la presentazione con le competenze comunicative di MC-COM-3-02.

Se hai conservato i dati delle MC precedenti, hai già molto del materiale di cui hai bisogno.

---

## APPENDICE — Tech in English

**Termini tecnici di questa MC in inglese**

| Italiano | English | Come si legge |
|----------|---------|---------------|
| accumulo energetico | energy storage | /ˈenədʒi ˈstɔːrɪdʒ/ |
| batteria agli ioni di litio | lithium-ion battery | /ˈlɪθiəm ˈaɪɒn ˈbætəri/ |
| rete elettrica intelligente | smart grid | /smɑːt ɡrɪd/ |
| veicolo-to-grid | vehicle-to-grid (V2G) | /ˈviːɪkəl tə ɡrɪd/ |
| cella a combustibile | fuel cell | /ˈfjuːəl sel/ |
| accumulo pompato | pumped-storage hydropower | /pʌmpt ˈstɔːrɪdʒ ˈhaɪdrəpaʊə/ |

> *In English we say: "The intermittency of renewable energy makes energy storage essential" — l'intermittenza delle energie rinnovabili rende essenziale l'accumulo energetico.*
>
> *"V2G allows electric vehicles to supply power back to the grid" — il V2G permette ai veicoli elettrici di cedere energia alla rete.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- Questa MC è al livello Advanced: 6 pagine. La Zona 2 occupa 3 pagine, la Zona 4 e 5 2 pagine ciascuna.
- Il box "Dati" (calo costi batterie litio) va in evidenza grafica con grande numero "97%" come elemento visivo dominante.
- La tabella di confronto tra sistemi di accumulo (sezione laboratorio) va su foglio largo con colori.
- La Zona 5 (compito di realtà) ha una rubrica a 4 livelli anziché 3 — prevedere una colonna aggiuntiva nella tabella.

**Per l'agente generatore asset:**
- Visual 1: infografica "Curva di apprendimento delle batterie litio" — asse x: anni dal 1991 al 2024; asse y: costo in $/kWh (scala logaritmica). Mostrare chiaramente il calo da 3.000 a 90 $/kWh.
- Visual 2: schema smart grid — centrale rinnovabile, accumulo, rete, smart meter, auto V2G, edificio con Powerwall, scambio bidirezionale.
- Visual 3: confronto sistemi di accumulo su matrice 2x2 (asse x: efficienza ciclo, asse y: costo/kWh) — litio, pompato, flow battery, idrogeno.
- Hook audio: "Alle tre di notte, il vento soffia — ma la città dorme" — narrazione del curtailment e aggancio al problema dell'accumulo stagionale.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025)*
*Livello DigComp: A (Advanced) · SDG 7, 9, 13*
