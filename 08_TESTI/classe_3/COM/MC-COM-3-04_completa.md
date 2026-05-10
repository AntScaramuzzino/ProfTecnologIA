# MC-COM-3-04 — Automazione, domotica e Industria 4.0
**Area:** Comunicazioni · **Anno:** 3ª · **Livello DigComp:** Advanced (A)
**SDG:** 9 — Industria, innovazione e infrastrutture · **Fonte:** Hypertech 2020
**Struttura:** 4 pagine (doppio spread + espansione avanzata) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "3.000 robot. Zero senso dell'orientamento."**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 35 sec.*
> *(Script completo: MC-COM-3-04_hook-script.md)*

**Domanda di avvio:**
Un magazzino Amazon gestisce 750.000 articoli diversi, spostati da 3.000 robot che si muovono senza fermarsi — 25 chilometri al giorno ciascuno.

Nessuno di loro sa dove si trova.

Come è possibile? E cosa ci dice questo sui sistemi automatici che ti circondano ogni giorno?

---

## 📖 ESPLORA

### Dalle macchine a vapore ai sistemi intelligenti: storia dell'automazione

L'automazione non è nata con i computer. Nasce nel 1764 in un mulino tessile del Lancashire, in Inghilterra, quando James Hargreaves inventa la "Spinning Jenny": una macchina che sostituisce il lavoro manuale di otto filatrici con il lavoro di una sola persona. In quel momento inizia qualcosa che non si fermerà più.

La Prima Rivoluzione Industriale (1760–1840) porta le macchine a vapore nelle fabbriche: il muscolo umano viene sostituito dall'energia termica. La Seconda Rivoluzione (1870–1914) porta l'elettricità e la produzione in serie. Henry Ford nel 1913 inventa la catena di montaggio: ogni operaio fa un'unica operazione ripetuta all'infinito — non perché sia più bravo così, ma perché è più rapido, più economico e più controllabile. La Terza Rivoluzione (anni '70–'80 del Novecento) porta l'elettronica e i computer: le macchine possono ora "ricordare" istruzioni, adattarsi a variabili, essere riprogrammate senza smontarle.

Oggi viviamo nella **Quarta Rivoluzione Industriale** — chiamata **Industria 4.0** — in cui le macchine non solo eseguono istruzioni, ma comunicano tra loro, analizzano dati in tempo reale e prendono decisioni autonome entro certi limiti.

---

### Automazione rigida e automazione flessibile

Prima di entrare nell'Industria 4.0, è importante capire la distinzione tra due tipi di automazione.

L'**automazione rigida** è progettata per fare una sola cosa, sempre allo stesso modo. Un imbottigliatrice in una fabbrica di acqua minerale è automazione rigida: riempie bottiglie da 1,5 litri alla velocità di 40.000 al giorno. Non sa fare altro. Se vuoi passare alle bottiglie da 0,5 litri, devi fermare la linea, cambiare i meccanismi, ricalibrarla. L'automazione rigida è imbattibile per volumi alti e prodotto costante.

L'**automazione flessibile** è progettata per adattarsi. Un braccio robotico programmabile può avvitare una vite su un'auto, poi essere riprogrammato per saldare una scocca diversa, poi per applicare una guarnizione. È più lento di una macchina dedicata, ma può cambiare compito senza essere fisicamente smontato. Quando i mercati cambiano spesso e i prodotti si moltiplicano, l'automazione flessibile vince.

La tendenza dell'Industria 4.0 è verso l'automazione flessibile estrema: sistemi che si auto-riconfigurano in base agli ordini in arrivo, senza intervento umano.

---

### I robot industriali: come funzionano davvero

Un **robot industriale** è un sistema meccanico a più giunti comandato da un computer, in grado di compiere movimenti precisi e ripetibili nello spazio tridimensionale. La sua descrizione tecnica si basa su tre parametri principali.

**Gli assi di movimento** — ogni giunzione rotante è un asse. Un robot a 6 assi può muoversi come il braccio umano (spalla, gomito, polso) con tre gradi di libertà aggiuntivi. Più assi = più libertà di movimento = più versatilità. Un semplice robot a 3 assi può avvitare; un robot a 6 assi può fare saldatura in tutte le direzioni, verniciatura, assemblaggio delicato.

**Il payload** — il carico massimo che il robot può sollevare e spostare mantenendo la precisione. Un piccolo robot da assemblaggio elettronico ha un payload di 2–5 kg. Un robot da fonderia per sollevare pezzi di motori arriva a 1.000 kg. Il payload non è solo il peso che può reggere: è il peso con cui può ancora essere preciso.

**La ripetibilità** — la precisione con cui torna esattamente allo stesso punto ogni volta. I migliori robot industriali hanno una ripetibilità di ±0,01 mm. Per confronto, la mano umana ha una ripetibilità di circa ±0,5 mm. Un chirurgo esperto con anni di pratica arriva a ±0,1 mm. Il robot è cinque volte più preciso, e non si stanca.

**La programmazione** dei robot industriali avviene in due modi. Il metodo classico è il **teach pendant**: un operatore muove fisicamente il braccio del robot in tutti i punti della traiettoria desiderata, il robot memorizza quei punti, poi li ripete autonomamente. Il metodo moderno è la **programmazione offline** su simulatore 3D: il programma viene scritto e testato in un gemello digitale (ne parliamo tra poco), poi caricato sul robot reale solo quando è già verificato. Questo riduce i fermi macchina.

---

### I robot collaborativi (cobot): lavorare fianco a fianco

La robotica industriale tradizionale mette i robot in gabbie di sicurezza: sono veloci, precisi, e pericolosi per un essere umano che si avvicina. Per questo le grandi linee di produzione separano fisicamente le zone robotizzate da quelle umane.

Negli anni 2000 nasce una categoria nuova: i **robot collaborativi**, detti **cobot** (da *collaborative robots*). Sono progettati per operare nello stesso spazio degli esseri umani, senza gabbie di protezione.

Come è possibile? I cobot hanno sensori di forza distribuiti su tutti i giunti: se il robot tocca qualcosa di inaspettato — una mano di un operaio, un ostacolo — si ferma immediatamente. Non solo: se viene spinto, cede. La velocità di un cobot è molto inferiore a quella di un robot industriale tradizionale, ma è intenzionale: la sicurezza è la priorità.

Il produttore di automobili **BMW** ha introdotto i cobot nello stabilimento di Dingolfing (Germania) per compiti che richiedono sia la forza di una macchina che la destrezza di un essere umano. Un esempio specifico: montare le guarnizioni nelle portiere. Le guarnizioni sono flessibili e devono essere inserite in una scanalatura precisa seguendo un percorso curvo irregolare. Il robot fa la forza; l'operaio guida la traiettoria. Insieme producono in modo che nessuno dei due potrebbe fare da solo.

Questo modello si chiama **collaborazione uomo-robot** ed è molto diverso dall'immagine cinematografica dei robot che "sostituiscono" gli umani. Nei cobot, la macchina fa quello che sa fare meglio (forza, ripetibilità, resistenza alla fatica) e l'umano fa quello che sa fare meglio (adattamento a variabili impreviste, giudizio, creatività).

---

### La stampa 3D industriale: fabbricare senza stampi

La **stampa 3D** — tecnicamente chiamata **manifattura additiva** — è una tecnologia che costruisce oggetti aggiungendo materiale strato per strato a partire da un file digitale. È l'opposto della lavorazione tradizionale, dove il materiale viene sottratto (torni, frese, trapani).

Esistono tre processi principali con caratteristiche molto diverse.

**FDM — Fused Deposition Modeling** (deposizione di filamento fuso): è il processo delle stampanti 3D economiche che forse hai già visto. Un filamento di materiale termoplastico (solitamente PLA o ABS) viene fuso e depositato strato per strato. I costi di macchina sono bassi (da 200 a 2.000 euro per le versioni hobbyiste, da 10.000 a 100.000 euro per quelle industriali). Limite principale: la superficie ha le "linee" degli strati visibili; la resistenza meccanica non è uniforme in tutte le direzioni.

**SLA — Stereolithography** (stereolitografia): usa un laser ultravioletto per solidificare resina liquida fotosensibile punto per punto. Produce superfici lisce e dettagli molto fini — usato per gioielleria, prototipi dentali, componenti medici. Limite: le resine sono costose e alcune sono tossiche durante la lavorazione.

**SLS — Selective Laser Sintering** (sinterizzazione laser selettiva): usa un laser potente per fondere polveri di nylon, metallo o ceramica. Produce pezzi con resistenza meccanica equivalente a quelli stampati o forgiati tradizionalmente. È il processo usato nell'industria aerospaziale per componenti di motori a reazione. Airbus usa la stampa SLS in metallo per 1.000 parti diverse del modello A350 XWB — pezzi che in 2D non si potrebbero produrre perché hanno geometrie interne impossibili da realizzare con frese o stampi. Limite: le macchine industriali SLS costano da 300.000 euro in su.

Cosa cambia con la stampa 3D rispetto alla produzione tradizionale? Quattro cose fondamentali:

**Nessuno stampo.** Produrre un pezzo in plastica con iniezione tradizionale richiede uno stampo che costa tra 10.000 e 100.000 euro. Conviene solo se produci migliaia di pezzi identici. Con la stampa 3D, puoi produrne uno solo allo stesso costo di mille.

**Geometrie impossibili.** Puoi costruire un cubo con una sfera cava all'interno. Puoi creare canali di raffreddamento a spirale dentro una componente metallica, impossibili da forare dall'esterno. Puoi creare strutture a nido d'ape ottimizzate per il peso, impossibili da fresare.

**Personalizzazione di massa.** Ogni pezzo può essere diverso dal precedente senza costi aggiuntivi. Protesi ortopediche personalizzate su misura del paziente. Pezzi di ricambio prodotti su richiesta invece di essere stoccati in magazzino.

**Riduzione del materiale.** Si usa solo il materiale del pezzo finito, più il supporto di stampa (che viene rimosso). La lavorazione tradizionale per asportazione può sprecare l'80% del blocco di materiale di partenza.

---

### Le quattro tecnologie chiave dell'Industria 4.0

Il termine "Industria 4.0" (in tedesco **Industrie 4.0**) è stato coniato nel 2011 in Germania come strategia industriale nazionale. Descrive l'integrazione di quattro tecnologie che, prese singolarmente, esistevano già da decenni, ma che insieme creano qualcosa di radicalmente nuovo.

**1. IoT — Internet of Things (Internet delle Cose)**
Ogni macchina, sensore, componente in una fabbrica moderna è connesso a internet e trasmette dati in tempo reale. Una macchina utensile trasmette: temperatura del mandrino, vibrazione degli utensili, consumo energetico, numero di pezzi prodotti, deviazioni dalla tolleranza. Questi dati vengono raccolti in modo continuo — non ogni ora, non ogni giorno: ogni secondo o ogni millisecondo. Quando un sensore di vibrazione inizia a segnalare un'anomalia, il sistema lo sa prima che l'operatore se ne accorga.

**2. Big Data e Analytics**
Il volume di dati prodotti da una fabbrica IoT è enorme — milioni di misurazioni al secondo da centinaia di sensori. Nessun essere umano può analizzarli in tempo reale. I sistemi di **analytics industriale** cercano pattern: correlazioni tra variabili che predicono un guasto prima che accada. Questo si chiama **manutenzione predittiva** (o *predictive maintenance*): invece di aspettare che una macchina si rompa (manutenzione reattiva) o di fermarla ogni tot ore per verificarla (manutenzione preventiva), il sistema dice "questa macchina si guasterà tra 48 ore con probabilità dell'87%" — e la fai fermare prima, durante un momento programmato.

**3. Intelligenza Artificiale nella produzione**
L'IA in fabbrica non ragiona come noi la immaginiamo. Non "pensa". Applica modelli statistici addestrati su milioni di esempi per classificare, predire, ottimizzare. Un sistema di visione artificiale ispeziona 200 pezzi al minuto cercando difetti superficiali invisibili all'occhio umano — rilevazione di microcricche su componenti aeronautici, variazioni di colore nelle vernici, imperfezioni di 0,05 mm su componenti medici. Un sistema di ottimizzazione della produzione ricalcola l'ordine di lavorazione ogni volta che arriva un nuovo ordine urgente, bilanciando 50 macchine simultaneamente.

**4. Cloud manufacturing**
I dati di produzione non vengono più solo archiviati localmente: vanno nel cloud. Questo permette di analizzare i dati di 50 stabilimenti contemporaneamente per confrontarli, di accedere da remoto alle macchine per diagnosi e aggiornamenti software, di condividere programmi di lavorazione tra stabilimenti in paesi diversi in tempo reale. Ma crea anche vulnerabilità: una fabbrica connessa al cloud è esposta ad attacchi informatici.

---

### Il digital twin: costruire prima di costruire

Uno dei concetti più potenti dell'Industria 4.0 è il **gemello digitale** (in inglese *digital twin*): una replica virtuale esatta di un oggetto, impianto o processo fisico, aggiornata in tempo reale con i dati del sistema reale.

Come funziona? Una turbina eolica reale ha centinaia di sensori che misurano continuamente temperatura, vibrazione, velocità del vento, potenza generata, usura dei cuscinetti. Questi dati alimentano un modello virtuale della turbina stessa, esatto fino ai dettagli fisici delle pale, dei cuscinetti, del generatore. Il modello digitale si comporta nello stesso modo della turbina reale — non perché sia una simulazione generica, ma perché è calibrato con i dati reali di quella turbina specifica.

Cosa ci puoi fare? Tre cose fondamentali.

Prima: **simulare prima di costruire.** Quando si progetta un nuovo impianto, il gemello digitale permette di testare tutte le configurazioni possibili in simulazione, prima di spendere un euro in acciaio e cemento. Si scoprono i colli di bottiglia, le inefficienze, i rischi di guasto — senza conseguenze reali.

Seconda: **manutenzione predittiva avanzata.** Il gemello digitale calcola in tempo reale lo stato di usura di ogni componente basandosi sui carichi effettivamente subiti — non su una stima media. Sa che quella turbina specifica ha lavorato in condizioni particolarmente dure per tre settimane e anticipa il guasto con maggiore precisione.

Terza: **ottimizzazione continua.** Se si scopre in simulazione che abbassare la temperatura di lavorazione del 10% riduce l'usura del 30% con solo il 5% in meno di produttività, il sistema può implementare la modifica su tutte le macchine di quel tipo in tutti gli stabilimenti del mondo contemporaneamente.

---

### La domotica: la fabbrica entra in casa

La **domotica** (da *domus*, casa in latino) applica i principi dell'automazione industriale all'abitazione. Sensori, attuatori, logica di controllo: la stessa architettura di una fabbrica, in scala ridotta e ottimizzata per il comfort e la sicurezza di chi vive in casa.

I sistemi domotici moderni si basano su **protocolli di comunicazione** che permettono ai dispositivi di parlare tra loro. I tre principali oggi sono:

**Zigbee** — protocollo aperto, basso consumo energetico, distanza massima di 10–75 metri per nodo, ma i dispositivi possono formare una rete a maglia (*mesh network*) dove ogni nodo amplifica il segnale per quelli vicini. Adatto per sensori a batteria che devono durare anni.

**Z-Wave** — protocollo proprietario (gestito da Silicon Labs), anch'esso mesh, frequenza 868 MHz in Europa. Più standardizzato di Zigbee: i dispositivi Z-Wave di produttori diversi sono certificati per funzionare insieme.

**Matter** — il protocollo più recente (introdotto nel 2022), sostenuto da Apple, Google, Amazon, Samsung. L'obiettivo è risolvere il problema della compatibilità: un termostato Matter funziona con qualsiasi sistema domotico Matter, indipendentemente dalla marca. È basato su IP (Internet Protocol) — lo stesso standard di internet — quindi lavora su rete Wi-Fi e Thread. Matter è ancora in fase di adozione, ma è destinato a diventare lo standard dominante.

Un sistema domotico completo integra: **rilevazione** (sensori di movimento, apertura porte/finestre, temperatura, umidità, fumo, monossido di carbonio, consumo energetico), **attuazione** (luci, serrature, tapparelle, termostato, prese comandate) e **logica di controllo** (regole del tipo "se il sensore di movimento non rileva nulla per 30 minuti, spegni tutte le luci"; "se la temperatura scende sotto 18°C e siamo in orario di casa, accendi il riscaldamento").

---

### L'intelligenza dei sistemi automatici: sensori, feedback e controllo PID

Ogni sistema automatico — da un termostato a un robot — funziona su un principio fondamentale: il **loop di controllo a feedback**. Il sistema misura continuamente la differenza tra lo stato attuale e lo stato desiderato, e corregge di conseguenza.

Il **controllo PID** (Proporzionale-Integrale-Derivativo) è il metodo matematico più usato nell'automazione per implementare questo loop. Non è necessario capire la matematica completa per capire il concetto:

**P — Proporzionale:** la correzione applicata è proporzionale all'errore attuale. Se la temperatura è 5°C sotto il target, applico una correzione grande; se è 0,5°C sotto, applico una correzione piccola.

**I — Integrale:** tiene conto degli errori accumulati nel tempo. Se il sistema ha avuto una deriva costante per ore, la componente integrale compensa l'errore sistematico che la sola componente proporzionale non correggeva completamente.

**D — Derivativo:** anticipa il comportamento futuro. Se la temperatura sta salendo rapidamente verso il target, la componente derivativa riduce la correzione prima di arrivarci — evitando di "superare" il valore desiderato per inerzia.

Il tuo termostato di casa usa una versione semplificata di questo principio. Il cruise control dell'automobile usa PID pieno. I bracci robotici industriali usano PID con ritardo di risposta inferiore al millisecondo. La stabilizzazione di un drone usa sei PID simultanei (tre assi rotazionali e tre traslazionali).

---

> **📦 Box T8 — IA critica: automazione ≠ intelligenza artificiale**
>
> È il momento di fare una distinzione che molti confondono.
>
> L'**automazione** segue regole fisse definite da un programmatore. "Se la temperatura supera 80°C, apri la valvola di raffreddamento." Questa regola vale sempre, in qualsiasi situazione. Il sistema non impara nulla. Funziona perfettamente finché le condizioni rientrano in quelle previste. Crolla se succede qualcosa fuori dai parametri del programma.
>
> L'**intelligenza artificiale** apprende dai dati. Non segue regole scritte esplicitamente: individua pattern statistici in milioni di esempi e generalizza. Un sistema di visione artificiale non dice "cerca un cerchio di raggio 5 mm". Dice: "ho visto 500.000 immagini di pezzi difettosi — adesso riconosco i difetti anche in modi che non ho mai visto prima."
>
> Nella pratica industriale, quasi tutti i sistemi che vedi nelle fabbriche reali sono **automazione** — non IA. I robot Kiva di Amazon? Automazione pura, basata su QR code e regole fisse. I termostati intelligenti? Automazione con qualche euristica. Solo i sistemi di ispezione visiva, previsione della domanda, e ottimizzazione energetica stanno iniziando a usare vera IA basata su machine learning.
>
> La distinzione è importante perché ha implicazioni pratiche: un sistema automatico fa solo quello per cui è stato programmato e lo fa bene; un sistema IA può sorprendere — in positivo (riconosce situazioni nuove) o in negativo (prende decisioni sbagliate per bias nei dati di addestramento). Capire quale stai usando è il primo passo per capirne i limiti.

---

### Caso studio: visita virtuale allo stabilimento Lamborghini di Sant'Agata Bolognese

Lo stabilimento Automobili Lamborghini di Sant'Agata Bolognese (Bologna) è uno degli esempi più documentati di Industria 4.0 in Italia. Produce circa 10.000 auto all'anno — pochissimo rispetto ai milioni di Volkswagen o Toyota — ma con un livello di personalizzazione unico: ogni auto è configurata su misura dell'acquirente. Non ci sono due Lamborghini identiche nella stessa settimana di produzione.

Come si fa a produrre su misura senza perdere efficienza?

**La linea di produzione digitale.** Ogni auto in produzione ha un gemello digitale che la segue durante tutta la lavorazione. Quando l'auto arriva a una stazione di assemblaggio, il sistema sa esattamente quale configurazione sta montando — quale colore, quale tipo di interni, quali optional — e mostra all'operaio le istruzioni specifiche per quella configurazione. Non c'è un "manuale universale": il sistema genera le istruzioni giuste in tempo reale.

**I cobot nella carrozzeria.** La struttura in fibra di carbonio delle Lamborghini è assemblata in parte da cobot e in parte da operai. La fibra di carbonio è un materiale composito con direzioni di resistenza precise: i cobot posizionano ogni strato con un angolo esatto (±0,5°) che un operaio faticherebbe a mantenere per ore consecutive. Gli operai invece fanno i controlli visivi e le operazioni che richiedono giudizio e adattamento.

**La sartoria e l'artigianalità.** Il reparto interni è fatto quasi interamente a mano da artigiani della lavorazione della pelle. Nessun robot. Qui Lamborghini ha fatto una scelta deliberata: il valore del prodotto è nell'unicità artigianale, e quella unicità non è replicabile automaticamente. L'Industria 4.0 non ha eliminato l'artigianato — ha definito dove ha senso usarla e dove no.

**Il sistema di tracciabilità totale.** Ogni singolo componente — dal bullone alla scocca — è tracciato con un codice univoco. Se tra cinque anni si scopre un difetto su un tipo specifico di bullone prodotto in un certo periodo, il sistema sa esattamente su quali auto quel bullone è stato montato — e dove si trovano quelle auto nel mondo. Questo è possibile solo perché ogni dato di produzione è stato registrato in tempo reale e archiviato.

Lamborghini è un caso studio interessante perché mostra che l'Industria 4.0 non è "tutto automatizzato". È l'integrazione intelligente tra macchine, dati e competenze umane — dove ogni elemento fa quello che sa fare meglio.

---

> **🔢 Collegamento STEM — Matematica:**
> Il controllo PID usa equazioni differenziali — concetti che studierai al liceo. Ma il principio intuitivo lo puoi già capire adesso. Il termine "derivativo" misura la *velocità di cambiamento* dell'errore: quanto velocemente ci stiamo avvicinando al target. Se la temperatura sta salendo di 5°C al secondo, stiamo per superare il target — meglio frenare adesso. Questo è il ragionamento dietro la derivata, spiegato con parole invece che con simboli.

> **🌐 Collegamento Geo-Storia:**
> L'Industria 4.0 è emersa in Germania nel 2011, in un paese la cui economia è costruita su manifattura di alta qualità (Siemens, BASF, Bosch, Volkswagen). La risposta tedesca alla concorrenza dei paesi a basso costo del lavoro non è stata abbassare i salari — è stata rendere le fabbriche talmente smart da essere irreplicabili. Oggi "Industria 4.0" è un programma di politica industriale in Italia, USA, Cina, Giappone. Ogni paese lo implementa diversamente, riflettendo la propria struttura economica.

---

## 🔍 OSSERVA

### Il caso: la smart home per nonno Carmelo

Carmelo ha 78 anni, vive da solo a Napoli dopo la morte della moglie, e vuole rimanere nella sua casa il più a lungo possibile. Ha una mobilità ridotta dopo un'operazione al ginocchio, prende 5 farmaci diversi a orari precisi, e la famiglia — tre figli, otto nipoti — vive in tre città diverse.

Come può la domotica aiutare Carmelo a vivere in sicurezza e con più autonomia?

Non si tratta di "tecnologia per la tecnologia": si tratta di identificare esigenze reali e trovare la tecnologia minima sufficiente per risolverle.

---

**Esigenza 1 — Sicurezza notturna:** Carmelo si sveglia spesso la notte per andare in bagno. Il corridoio è buio, c'è il rischio di cadere.

*Soluzione:* sensori di movimento sotto-pavimento (o nelle targhette delle porte) collegati a strisce LED a bassa luminosità lungo il corridoio. Quando Carmelo si muove di notte, le luci si accendono automaticamente al 10% — abbastanza per vedere, non abbastanza per svegliarlo del tutto. Costo: 80–150 euro di installazione. Protocollo: Zigbee, batterie cambiate ogni 2 anni.

**Esigenza 2 — Promemoria farmaci:** Carmelo dimentica a volte di prendere i farmaci, soprattutto quelli pomeridiani.

*Soluzione:* dispenser automatico di farmaci con alert. Esistono dispositivi dedicati (da 80 a 300 euro) che suonano all'orario programmato e aprono lo scomparto con la dose giusta. Se Carmelo non risponde entro 15 minuti, il sistema manda un SMS alla famiglia. Non è un sistema domotico "smart home" classico, ma si integra nella logica di automazione domestica.

**Esigenza 3 — Rilevazione emergenze:** se Carmelo cadesse in casa e non potesse rialzarsi, come potrebbe chiedere aiuto?

*Soluzione:* braccialetto SOS con rilevazione automatica della caduta. I sensori inerziali (accelerometro + giroscopio) riconoscono il pattern di una caduta e inviano automaticamente una notifica ai contatti salvati, anche se Carmelo è incosciente. I modelli di fascia medio-alta integrano GPS per localizzazione.

**Esigenza 4 — Efficienza energetica:** la bolletta del gas è alta perché Carmelo, per comodità, lascia il riscaldamento a 22°C tutto il giorno anche quando dorme o è fuori.

*Soluzione:* termostato intelligente con rilevazione di presenza. Il termostato impara le abitudini di Carmelo (entra in dormitorio alle 22, si alza alle 7, esce il martedì e giovedì mattina) e regola il riscaldamento di conseguenza. Se rileva che Carmelo è in soggiorno, scalda il soggiorno. Se rileva assenza, abbassa. Risparmio medio documentato dai produttori (Nest, Ecobee): 10–15% sulla bolletta annuale.

**Esigenza 5 — Connessione con la famiglia:** i nipoti vogliono "vedere" nonno Carmelo senza che lui si senta controllato o invaso nella privacy.

*Soluzione:* questa è la più delicata. Non videocamere di sorveglianza — Carmelo le rifiuterebbe, giustamente. Ma un sistema che monitora i pattern di vita normale senza video: "il frigorifero è stato aperto alle ore 8.15" (sensore di apertura), "la tv è accesa" (presa comandata), "Carmelo è uscito alle 10:30 ed è rientrato alle 12:00" (sensore porta di ingresso). Se il sistema non registra nessuna attività entro una certa finestra oraria, manda un alert silenzioso alla famiglia. Si chiama **sistemi di monitoraggio del benessere** ed è un settore in crescita.

Questo esempio mostra che progettare un sistema domotico reale richiede partire dalle esigenze — non dalla tecnologia. Prima "cosa serve?", poi "con quale tecnologia e a quale costo?". E soprattutto: chi decide? Carmelo, non i nipoti.

---

> **⚠️ Errore comune:**
> "L'automazione rende tutto più semplice da usare." Non necessariamente. Un sistema domotico mal progettato è più complicato di uno interruttore della luce. La complessità dell'automazione è nella progettazione, non nell'uso — ma solo se la progettazione è stata fatta bene. Se installi un sistema domotico che richiede di aprire tre app diverse per spegnere una luce, hai reso tutto più complicato. Il principio guida: l'utente non dovrebbe mai dover "pensare" per usare un sistema automatico. Se ci pensa, il sistema è mal progettato.

---

### 🧑‍💻 Chi lavora con questa competenza nel 2030?

**Systems Integration Engineer — Industria 4.0**

Non è il programmatore che scrive codice. Non è l'elettricista che stende i cavi. È la persona che fa funzionare insieme sistemi diversi — robot, sensori, software, protocolli — in modo coerente e affidabile.

Lavora su: come connettere una macchina CNC del 1995 (che non ha protocollo IoT) all'infrastruttura digitale di una fabbrica moderna. Come fare parlare un robot Fanuc con un sistema MES (Manufacturing Execution System) SAP. Come gestire la sicurezza informatica in una fabbrica in cui 2.000 dispositivi sono connessi a internet.

Dove lavora: integratori di sistemi industriali, reparti IT/OT (Operational Technology) di grandi manifatturieri, startup di automazione.

Competenze chiave che inizia a costruire da qui: comprensione dei sistemi di controllo · protocolli di comunicazione industriale (OPC-UA, MQTT) · sicurezza informatica OT · project management tecnico.

*"La mia professione non esiste nei libri di testo. Ho imparato che ogni sistema è diverso — e che la vera competenza è saper capire velocemente qualcosa che non hai mai visto prima."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### ● BASE — Identifico i componenti di un sistema automatico

**Obiettivo:** riconoscere i tre elementi fondamentali di qualsiasi sistema automatico (sensore → controllo → attuatore) in esempi della vita quotidiana.

**Materiali:** questo testo, un foglio, una penna.

**Come procedere:**

Ogni sistema automatico che ci circonda ha sempre tre componenti:
1. **Sensore** — misura qualcosa (temperatura, movimento, luce, peso, pressione)
2. **Logica di controllo** — confronta la misura con il valore desiderato e decide cosa fare
3. **Attuatore** — fa succedere qualcosa (apre una valvola, accende una luce, avvia un motore)

Completa questa tabella per i sei sistemi elencati:

| Sistema | Che cosa sente? (sensore) | Che cosa decide? (logica) | Che cosa fa? (attuatore) |
|---------|--------------------------|--------------------------|--------------------------|
| Lavatrice con programma automatico | | | |
| Cancello automatico del condominio | | | |
| Lampione a LED che si accende al buio | | | |
| Distributore automatico di bibite | | | |
| Ascensore | | | |
| Termostato del riscaldamento | | | |

Dopo aver completato la tabella, rispondi: c'è uno di questi sistemi che, secondo te, usa vera intelligenza artificiale? Quale, e perché?

---

### ●● INTERMEDIO — Progetto il sistema domotico per una stanza

**Obiettivo:** progettare un sistema domotico per una stanza specifica, scegliendo tecnologie appropriate per ogni esigenza.

**Scenario:** la classe ha deciso di rendere "smart" l'aula scolastica. Hai un budget immaginario di 500 euro e devi scegliere quali automazioni installare, come si connettono tra loro, e quali benefici producono.

**Fasi del lavoro:**

1. **Identifica 4 esigenze reali** dell'aula — problemi concreti che un sistema automatico potrebbe risolvere (efficienza energetica, sicurezza, comfort, monitoraggio). Scrivi ogni esigenza come problema: "Le luci rimangono accese anche quando l'aula è vuota."

2. **Per ogni esigenza**, proponi:
   - Il tipo di sensore necessario
   - Il tipo di attuatore
   - Il protocollo di comunicazione (Zigbee / Z-Wave / Wi-Fi)
   - Il costo stimato (cerca online ordine di grandezza)

3. **Disegna uno schema** dell'aula con i dispositivi posizionati. Usa frecce per indicare i flussi di dati (sensore → controller → attuatore).

4. **Calcola il budget** totale e verifica che non superi i 500 euro.

5. **Domanda critica:** quale delle 4 automazioni produce il maggiore beneficio per il costo più basso? Giustifica la scelta.

> ⚠️ **Sicurezza:** questo è un esercizio di progettazione su carta. Non installare o modificare nessun dispositivo elettrico reale senza supervisione di un adulto qualificato.

---

### ●●● AVANZATO — Progetta e simula una logica di controllo

**Obiettivo:** progettare la logica di controllo di un sistema domotico complesso usando un diagramma di flusso, e simularne il comportamento su casi reali.

**Scenario:** il sistema domotico della casa di Carmelo (presentato nella Zona 3) deve essere programmato. Hai deciso di costruire la logica per il **sistema di sicurezza notturna** (luci nel corridoio).

**Fase 1 — Analisi dei requisiti**

Prima di progettare, definisci i requisiti in modo preciso:
- Quando si attiva? (orario? rilevazione buio? combinazione?)
- Quali eventi lo triggherano? (movimento nel corridoio? apertura della porta del letto?)
- Come si comporta? (quanta luminosità? per quanto tempo? si spegne se non c'è più movimento?)
- Quali eccezioni prevedi? (e se Carmelo vuole leggere di notte? e se c'è un ospite?)

**Fase 2 — Diagramma di flusso**

Scrivi la logica di controllo come diagramma di flusso formale, usando:
- Rettangoli per azioni ("Accendi le luci al 10%")
- Rombi per decisioni ("È tra le 22:00 e le 7:00?", "Il sensore ha rilevato movimento?")
- Frecce etichettate con "SÌ" / "NO"
- Simboli di inizio e fine

Il tuo diagramma deve gestire almeno 3 scenari diversi: a) Carmelo si sveglia alle 3 di notte, b) Carmelo rimane sveglio a leggere fino all'1, c) arriva un ospite che non conosce la casa.

**Fase 3 — Test su carta (dry run)**

Prendi il tuo diagramma e "eseguilo" manualmente su ogni scenario. Segui il flusso freccia per freccia, come se fossi il microcontrollore. Documenta ogni decisione e ogni azione. Il sistema si comporta come volevi? Se no, torna al diagramma e correggilo.

**Fase 4 — Analisi dei limiti**

Ogni sistema ha casi in cui fallisce. Scrivi almeno due situazioni in cui il tuo sistema domotico potrebbe prendere decisioni sbagliate o essere insufficiente, e proponi come mitigarle.

> **Estensione avanzata:** se la scuola ha kit Arduino o micro:bit, implementa la logica del sistema di sicurezza notturna su un prototipo fisico con un sensore PIR, un LED e una resistenza. La programmazione può essere in MicroPython o Arduino C — la logica è identica al diagramma di flusso che hai disegnato.

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione — leggila PRIMA di iniziare il compito

Questa tabella ti dice esattamente come viene valutato il tuo lavoro. Tienila aperta mentre lavori.

| Criterio | ● Base — Sufficiente | ●● Intermedio — Buono | ●●● Avanzato — Ottimo |
|----------|---------------------|----------------------|----------------------|
| **1. Analisi delle esigenze** | Identifica le esigenze da un elenco fornito; descrive brevemente cosa risolve ogni tecnologia | Identifica autonomamente le esigenze, le ordina per priorità con una ragione, distingue bisogno primario da comfort | Identifica esigenze, le gerarchizza con criteri espliciti (sicurezza > salute > comfort > economia), anticipa conflitti tra esigenze |
| **2. Scelta e giustificazione tecnologica** | Sceglie una tecnologia per ogni esigenza dalla lista suggerita; indica il sensore o l'attuatore | Giustifica la scelta tecnologica con almeno una caratteristica tecnica rilevante; confronta con un'alternativa | Giustifica con dati (costo, consumo, distanza, affidabilità), analizza i limiti della tecnologia scelta, propone piano di manutenzione |
| **3. Integrazione del sistema** | Descrive i dispositivi come liste separate; non mostra le connessioni tra loro | Mostra le connessioni principali tra i dispositivi con uno schema; identifica il controller centrale | Produce uno schema completo con flussi di dati, protocolli, punti di vulnerabilità e piano di contingenza per guasti |
| **4. Rispetto delle esigenze dell'utente** | Considera le esigenze tecniche ma non quelle personali (privacy, autonomia, preferenze) | Bilancia tecnologia e autonomia dell'utente; nomina almeno una scelta che rispetta la preferenza dell'utente | Analizza il trade-off tra sicurezza/monitoraggio e privacy/autonomia; giustifica ogni scelta in base al benessere dell'utente, non solo all'efficienza tecnica |

---

### Lo scenario

Il Comune della tua città ha lanciato un progetto pilota: rendere "smart" la casa di dieci anziani soli del quartiere, per permettere loro di vivere in modo più autonomo e sicuro senza doversi trasferire in una struttura di cura.

Il progetto ha un budget di 1.500 euro per appartamento. Hai tre mesi di tempo. Ogni anziano ha esigenze diverse.

Ti viene assegnato il caso di **Giuseppina, 81 anni**: vive al terzo piano di un condominio senza ascensore, ha la vista ridotta (ma non è cieca), prende farmaci la sera, ha una grande paura delle cadute dopo che una sua amica si è rotta il femore, parla spesso al telefono con i nipoti, e tiene molto alla sua privacy.

---

### La consegna

**Progetta il sistema domotico per la casa di Giuseppina.**

La consegna si articola in quattro parti:

**Parte 1 — Analisi delle esigenze (1 pagina)**
Identifica 5 esigenze specifiche di Giuseppina (sicurezza, salute, comunicazione, comfort, risparmio energetico). Per ogni esigenza, scrivi: qual è il problema, cosa potrebbe succedere se non viene risolto, e perché è prioritaria per Giuseppina in particolare — non per una persona anziana generica.

**Parte 2 — Scelte tecnologiche (1 pagina + schema)**
Per ogni esigenza, proponi una tecnologia specifica (nomina il tipo di dispositivo, il protocollo, il costo stimato). Disegna uno schema della casa con tutti i dispositivi posizionati nelle stanze appropriate. Indica le connessioni tra i dispositivi e il controller centrale.

**Parte 3 — Verifica del budget (calcolo)**
Verifica che il costo totale del sistema non superi 1.500 euro. Se lo supera, rivedi le priorità: quale esigenza puoi rimandare a una seconda fase? Quale tecnologia può essere sostituita con una meno costosa?

**Parte 4 — Riflessione etica (10 righe)**
Un sistema domotico raccoglie dati su Giuseppina 24 ore su 24. Chi può accedere a questi dati? Come si garantisce che non vengano usati per scopi che lei non ha autorizzato? Scrivi la tua posizione: cosa dovresti mettere nel contratto di utilizzo del sistema per tutelare Giuseppina?

---

### Materiali che ti servono

- Questo testo
- Un foglio A3 (o due A4) per lo schema della casa
- Una calcolatrice
- Accesso internet per cercare i prezzi dei dispositivi (siti: Ikea Smart Home, Aqara, Shelly, Amazon)

---

### 🎯 Badge SDG 9 + SDG 8 — Industria e Lavoro

Progettare sistemi domotici per anziani non è solo tecnologia: è risposta all'invecchiamento demografico dell'Europa (27% della popolazione italiana ha più di 65 anni), alla crisi delle strutture di cura, e alla domanda crescente di tecnologia inclusiva. È esattamente il tipo di innovazione che il SDG 9 (Innovazione) e il SDG 8 (Lavoro dignitoso) intendono promuovere.

---

### 🤖 Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

*"Cos'è un cobot? Come funziona il protocollo Matter? Qual è la differenza tra automazione e IA?"* — l'AI Coach risponde solo su questa MC. Se fa un errore, segnalalo: verificare le risposte dell'intelligenza artificiale è la competenza più importante che stai imparando.

---

### 🪞 Metacognizione — Rifletti sul tuo progetto

Rispondi a queste domande **dopo** aver consegnato il progetto.

**1. Complessità del sistema**
Quando hai iniziato a progettare il sistema domotico, pensavi che sarebbe stato semplice o complesso? Dopo averlo finito, qual è stata la difficoltà principale — tecnica o legata alle esigenze umane di Giuseppina?

*Scrivi 3-4 righe:* ___________________________________________

---

**2. Il trade-off sicurezza / privacy**
Hai trovato difficile bilanciare la sicurezza di Giuseppina con il rispetto della sua privacy? Descrivi un momento specifico in cui hai dovuto scegliere tra "monitorare di più" e "rispettare la sua autonomia" — e come hai deciso.

*Scrivi 3-4 righe:* ___________________________________________

---

**3. L'errore come risorsa**
C'è stato un momento in cui hai cambiato idea su una scelta tecnologica — magari hai scoperto che un dispositivo costava troppo, o che non era compatibile con un altro? Descrivi il problema e come l'hai risolto.

*Scrivi 3-4 righe:* ___________________________________________

---

**4. Domanda aperta avanzata**
Se un sistema automatico prende una decisione sbagliata — per esempio, non rileva la caduta di Giuseppina perché lei era ferma sul pavimento, non caduta — chi è responsabile? Il programmatore? Il produttore del sensore? Chi ha installato il sistema? Chi ha scelto di affidarsi a quella tecnologia? Non c'è una risposta giusta — ma ci sono risposte più argomentate di altre.

*Scrivi 5-6 righe:* ___________________________________________

---

### 🔗 Collegamento con UDA-3 — "Tecnologie per l'inclusione"

Questa MC fa parte dell'UDA interdisciplinare del terzo anno *"Tecnologie per l'inclusione"*, che integra Tecnologia, Cittadinanza e Costituzione (L. 92/2019), e Matematica (calcolo dei costi). La Parte 4 del compito di realtà (riflessione etica) contribuisce alla valutazione di Educazione Civica.

---

## APPENDICE — Tech in English

**Termini tecnici di questa MC in inglese**

| Italiano | English | Come si legge |
|----------|---------|---------------|
| automazione | automation | /ˌɔːtəˈmeɪʃən/ |
| gemello digitale | digital twin | /ˈdɪdʒɪtəl twɪn/ |
| robot collaborativo | collaborative robot / cobot | /kəˈlæbərətɪv ˈrəʊbɒt/ |
| manifattura additiva | additive manufacturing | /ˈædɪtɪv ˌmænjʊˈfæktʃərɪŋ/ |
| domotica | home automation / smart home | /həʊm ˌɔːtəˈmeɪʃən/ |

> *In English we say: "Smart home systems use sensors and actuators to automate domestic tasks" — i sistemi smart home usano sensori e attuatori per automatizzare i compiti domestici.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- Zona 2: sezione lunga — distribuire su doppio spread (4 pagine). Il Box T8 va come sidebar colorata su sfondo grigio chiaro.
- Il caso studio Lamborghini può avere un'apertura con foto dello stabilimento (Creative Commons).
- Le tabelle della Zona 4 (Intermedio e Avanzato) come schede fotocopiabili allegate.
- La Scheda Compito di Realtà (Zona 5) come pagina separata con linee per la scrittura.
- I box STEM (Matematica e Geo-Storia) come sidebar laterali.

**Per l'agente generatore asset:**
- Visual richiesto 1: diagramma architetttura sistema domotico completo — sensori, controller, attuatori, cloud, app mobile. Formato PNG 1200×900 + SVG.
- Visual richiesto 2: infografica "Le 4 tecnologie dell'Industria 4.0" (IoT, Big Data, AI, Cloud) con frecce di connessione.
- Visual richiesto 3: timeline automazione — dalla Spinning Jenny del 1764 all'Industria 4.0 del 2011.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: Hypertech 2020 · Allineata IN 2025 (D.M. n. 221/2025)*
*Livello DigComp: Advanced (A) · Struttura espansa 4 pagine · Libro-ready*
