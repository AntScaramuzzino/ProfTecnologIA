# MC-ENE-3-04 — Come funziona un circuito elettrico?
**Area:** Energia e Macchine · **Anno:** 3ª · **Livello DigComp:** Intermediate (I)
**SDG:** 9 — Industria, innovazione e infrastrutture · **Fonte:** Paci 2014 + Hypertech 2020
**Struttura:** 4 pagine (doppio spread espanso) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il filo che muove il mondo"**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 20 sec.*

**Domanda di avvio:**
Hai presente quando tocchi una maniglia di metallo in inverno e senti una piccola scossa?
Oppure quando strofini un maglione di lana e poi avvicini il dito alla porta del frigorifero?

Quella non è magia. È elettrostatica — la forma più primitiva dell'elettricità.
La stessa forza che ti dà quella piccola scossa fa girare i motori degli aerei, illumina le città e alimenta il telefono nella tua tasca.

Nelle prossime pagine impari a dominarla — almeno un po'.

---

## 📖 ESPLORA

### L'elettricità: cos'è davvero?

Ogni materiale è fatto di atomi. Ogni atomo ha un nucleo con protoni (carica positiva) e intorno al nucleo orbitano elettroni (carica negativa). Nella maggior parte dei materiali, protoni ed elettroni si bilanciano: l'atomo è neutro.

In alcuni materiali — i **conduttori**, come il rame — gli elettroni degli strati più esterni dell'atomo sono "liberi": si spostano facilmente da un atomo all'altro. È questo movimento collettivo di elettroni liberi che chiamiamo **corrente elettrica**.

Per far scorrere la corrente elettrica serve però qualcosa che "spinga" gli elettroni in una direzione precisa. Quel qualcosa è la **differenza di potenziale**, che chiamiamo comunemente **tensione** e misuriamo in **volt (V)**.

Pensa a un tubo pieno d'acqua: la corrente elettrica è come il flusso d'acqua nel tubo, e la tensione è come la pressione che fa scorrere l'acqua. Senza pressione l'acqua non scorre. Senza tensione gli elettroni non si muovono in modo ordinato.

---

### Le tre grandezze fondamentali

#### Tensione — V (volt)

La tensione è la "spinta" che mette in movimento gli elettroni. Si misura in **volt (V)**, in onore del fisico italiano Alessandro Volta, che costruì la prima pila elettrica nel 1800.

Valori di riferimento utili:
- Pila AA stilo: 1,5 V
- Pila da 9V (quadrata): 9 V
- Batteria di un'auto: 12 V
- Caricatore del telefono: 5 V (in uscita)
- Rete elettrica domestica italiana: 230 V (pericolosa — non sperimentare MAI)
- Rete elettrica dei treni ad alta velocità: 25.000 V

#### Corrente — I (ampere)

La corrente elettrica è la quantità di cariche elettriche (elettroni) che attraversa una sezione del conduttore in un secondo. Si misura in **ampere (A)**, in onore del fisico francese André-Marie Ampère.

Valori di riferimento:
- LED di segnalazione: 0,02 A (20 mA)
- Lampadina LED da 10W a 5V: 2 A
- Forno da cucina: 10–13 A
- Automobile in partenza (motorino avviamento): 100–200 A
- Fulmine: 20.000–300.000 A per pochi microsecondi

> ⚠️ **Box sicurezza — DA LEGGERE:** Già 10 milliampere (0,01 A) possono causare una contrazione muscolare involontaria. 100 milliampere (0,1 A) possono essere letali se attraversano il cuore. La corrente della rete domestica (230V) è **pericolosissima**. Non aprire MAI prese o apparecchi elettrici, non inserire oggetti metallici nelle prese, non usare apparecchi elettrici vicino all'acqua. Tutto quello che farai in questo laboratorio usa tensioni sicure: massimo 9V da batteria.

#### Resistenza — R (ohm)

Ogni materiale oppone una certa resistenza al passaggio della corrente. Questa opposizione si chiama **resistenza elettrica** e si misura in **ohm (Ω)**, in onore del fisico tedesco Georg Simon Ohm.

I materiali si dividono in base alla loro resistenza:
- **Conduttori**: resistenza bassissima — argento, rame, alluminio, oro
- **Semiconduttori**: resistenza variabile (può essere modificata) — silicio, germanio
- **Isolanti**: resistenza altissima — plastica, gomma, ceramica, vetro, aria secca, legno secco

---

### La Legge di Ohm — il cuore dell'elettronica

Nel 1827, Georg Simon Ohm scoprì una relazione precisa tra tensione, corrente e resistenza. Questa relazione è la legge più usata in tutta l'elettronica:

**V = R × I**

La tensione (V) è uguale alla resistenza (R) moltiplicata per la corrente (I).

Si può riscrivere in tre forme equivalenti:
- **V = R × I** — se conosci R e I, calcoli la tensione
- **I = V / R** — se conosci V e R, calcoli la corrente
- **R = V / I** — se conosci V e I, calcoli la resistenza

**Esempio passo per passo — Problema 1:**
Hai una resistenza da 100 Ω collegata a una batteria da 9V. Quanta corrente scorre?

Formula: I = V / R
Dati: V = 9V, R = 100Ω
Calcolo: I = 9 / 100 = **0,09 A = 90 mA**

**Esempio passo per passo — Problema 2:**
Vuoi che nel tuo LED scorra 20 mA (0,02 A) e lo alimenti con una batteria da 5V. Quale resistore devi mettere in serie?

Formula: R = V / I
Dati: V = 5V, I = 0,02A
Calcolo: R = 5 / 0,02 = **250 Ω**

Nella pratica userai il resistore da 270 Ω (il valore standard più vicino disponibile) — va bene comunque.

---

### La potenza elettrica

Quanta energia consuma (o produce) un dispositivo elettrico in un secondo? Questo lo dice la **potenza**, misurata in **watt (W)**:

**P = V × I**

La potenza è uguale alla tensione moltiplicata per la corrente.

Dalla legge di Ohm, si può anche scrivere come:
**P = R × I²**

**Esempio:**
Una lampadina LED alimentata a 5V con una corrente di 0,4A:
P = 5 × 0,4 = **2W**

Confronto pratico: una lampadina a incandescenza da 60W consumava 30 volte di più per una luminosità simile.

La potenza si misura in un istante. Per sapere quanta **energia** consuma un dispositivo nel tempo, si usa il **kilowattora (kWh)**:

**Energia (kWh) = Potenza (kW) × Tempo (ore)**

Una lavatrice da 2.000 W (= 2 kW) che gira per 1,5 ore consuma 3 kWh. In bolletta, ogni kWh costa circa 0,25 € in Italia (2024). Quella lavatrice ti è costata 0,75 €.

> 💡 **Lo stand-by ha un costo reale:** quasi tutti gli elettrodomestici consumano energia anche quando sembrano spenti — la lucina rossa del televisore, il caricatore collegato alla presa senza telefono, il decoder in attesa. È stato calcolato che se nell'Unione Europea tutti gli utenti spegnessero il comando di stand-by del proprio televisore, si risparmierebbe l'equivalente di diversi miliardi di kWh all'anno. A livello di singola famiglia, il costo annuo dello stand-by è stimato tra 50 e 100 €. Il rimedio è semplice: spegni dalla presa, non dal telecomando. *(Fonte: Mondadori Education, ISBN 9788829861521, p.346)*

> **Box Fisica — Corrente alternata (AC) vs corrente continua (DC)**
>
> Le batterie forniscono corrente **continua (DC — Direct Current)**: gli elettroni scorrono sempre nella stessa direzione, dal polo negativo al polo positivo.
>
> La rete elettrica domestica (230V, 50 Hz) usa invece corrente **alternata (AC — Alternating Current)**: gli elettroni invertono la direzione 50 volte al secondo (50 hertz).
>
> Perché la rete usa la corrente alternata? Perché si può trasportare facilmente a tensioni altissime (centinaia di migliaia di volt) con poche perdite, e poi abbassarla con i **trasformatori** prima di arrivare nelle case. Inventata e promossa da Nikola Tesla e George Westinghouse, vinse il cosiddetto "guerra delle correnti" contro la corrente continua di Thomas Edison alla fine dell'800.
>
> I tuoi dispositivi digitali — telefono, laptop, Arduino — usano DC. I caricatori convertono la AC della presa in DC per il dispositivo.

---

### Circuiti in serie e in parallelo

Un **circuito elettrico** è un percorso chiuso attraverso cui scorre la corrente. Deve essere chiuso: se c'è un'interruzione (un interruttore aperto, un filo rotto), la corrente non scorre.

#### Circuito in serie

In un circuito in serie, i componenti sono collegati uno dopo l'altro, lungo un unico percorso. La corrente deve attraversarli tutti.

**Proprietà fondamentali:**
- La corrente è la stessa in ogni punto del circuito: **I_tot = I_1 = I_2 = I_3**
- La tensione totale si divide tra i componenti: **V_tot = V_1 + V_2 + V_3**
- Le resistenze si sommano: **R_eq = R_1 + R_2 + R_3**

**Esempio numerico:**
Tre resistenze in serie da 10Ω, 20Ω e 30Ω, alimentate con 12V.
- Resistenza equivalente: R_eq = 10 + 20 + 30 = 60Ω
- Corrente nel circuito: I = V / R_eq = 12 / 60 = **0,2 A**
- Caduta di tensione su ogni resistenza:
  - V_1 = R_1 × I = 10 × 0,2 = 2V
  - V_2 = R_2 × I = 20 × 0,2 = 4V
  - V_3 = R_3 × I = 30 × 0,2 = 6V
  - Verifica: 2 + 4 + 6 = 12V ✓

**Problema pratico delle luci di Natale in serie:**
Le vecchie luci di Natale erano collegate in serie. Se si bruciava una sola lampadina, il circuito si interrompeva e tutte le luci si spegnevano. Hai presente? Devi controllare ogni lampadina una per una per trovare quella bruciata.

#### Circuito in parallelo

In un circuito in parallelo, i componenti sono collegati su rami separati, ciascuno connesso direttamente ai due terminali della sorgente.

**Proprietà fondamentali:**
- La tensione è la stessa su tutti i rami: **V_tot = V_1 = V_2 = V_3**
- La corrente si divide tra i rami: **I_tot = I_1 + I_2 + I_3**
- Le resistenze equivalenti si calcolano con la formula: **1/R_eq = 1/R_1 + 1/R_2 + 1/R_3**
- (per solo 2 resistenze: R_eq = (R_1 × R_2) / (R_1 + R_2))

**Esempio numerico:**
Due resistenze in parallelo da 60Ω e 30Ω, alimentate con 12V.
- R_eq = (60 × 30) / (60 + 30) = 1800 / 90 = **20Ω**
- Corrente totale: I_tot = 12 / 20 = **0,6 A**
- Corrente su ogni ramo:
  - I_1 = 12 / 60 = 0,2 A
  - I_2 = 12 / 30 = 0,4 A
  - Verifica: 0,2 + 0,4 = 0,6 A ✓

**Le luci di Natale moderne in parallelo:**
Le luci LED moderne sono collegate in parallelo. Se si rompe una lampadina, solo quella si spegne — le altre restano accese. In più, ogni lampadina riceve la tensione piena: funzionano alla loro potenza ottimale.

**L'impianto elettrico di casa tua è in parallelo:** ogni presa, ogni interruttore, ogni lampadina è su un ramo separato. Puoi spegnere la luce della tua camera senza spegnere quella del corridoio. Se si brucia un fusibile di un circuito, gli altri continuano a funzionare.

---

### Componenti base dell'elettronica

Costruire circuiti vuol dire scegliere i componenti giusti. Questi sono quelli che incontrerai più spesso:

**Resistore**
Il componente più semplice: oppone resistenza al flusso di corrente. Si usa per limitare la corrente, per creare divisori di tensione, per proteggere altri componenti (come i LED). Il valore si legge dal codice a colori stampato sul corpo del componente.

**LED (Light Emitting Diode)**
Un diodo che emette luce quando lo percorre corrente nel verso corretto. Ha una **polarità**: il terminale più lungo è l'anodo (+), quello più corto il catodo (−). Collegato al contrario non funziona e non si rompe, ma collegato senza resistore in serie si brucia in pochi secondi. Tensione di lavoro tipica: 1,8–3,3V. Corrente di lavoro: 10–30 mA.

**Condensatore**
Accumula cariche elettriche e le rilascia rapidamente. Funziona come una piccola "riserva" di energia. Usato per filtrare oscillazioni nella tensione, per creare timer, per stabilizzare l'alimentazione dei circuiti digitali.

**Diodo**
Lascia passare la corrente in un solo verso. Funziona come una valvola a senso unico: se la corrente tenta di scorrere in senso contrario, il diodo la blocca. Usato nei caricatori per convertire AC in DC (raddrizzatori).

**Interruttore**
Apre o chiude un percorso nel circuito. Quando è aperto, il circuito è interrotto e la corrente non scorre. Quando è chiuso, il circuito è completo. Esistono in molte varianti: a scorrimento, a pressione (pulsante), a basculante (toggle).

**Fusibile**
Un filo sottilissimo che si rompe deliberatamente quando la corrente supera un certo valore. Protegge il circuito da sovraccarichi. Una volta bruciato va sostituito — non si ripristina da solo. Nei moderni impianti domestici i fusibili sono stati sostituiti dai **salvamotore** (interruttori automatici magnetotermici) che si possono ripristinare premendo un tasto.

**Differenziale (salvavita)**
Rileva differenze di corrente tra fase e neutro (il che indica che la corrente sta "scappando" verso terra, per esempio attraverso una persona). Si scatta in meno di 30 millisecondi. È obbligatorio per legge in tutti gli impianti domestici italiani dal 1990.

> ⚠️ **Box sicurezza — cortocircuito:**
> Un **cortocircuito** avviene quando fase e neutro entrano in contatto diretto, senza passare attraverso un carico (lampadina, motore, ecc.). La resistenza del percorso diventa quasi zero, quindi per la legge di Ohm la corrente diventa enorme (I = V/R → se R è minimo, I è massima). In pochi millisecondi il calore prodotto può fondere i fili e causare incendi. Fusibili e interruttori magnetotermici esistono per questo: interrompono il circuito prima che il danno sia irreparabile.

---

### Dai componenti discreti ai circuiti integrati

Un circuito elettronico complesso — come il processore del tuo telefono — contiene miliardi di transistor (interruttori elettronici microscopici) integrati in un unico chip di silicio delle dimensioni di un'unghia. Si chiama **circuito integrato (IC — Integrated Circuit)**.

L'invenzione del circuito integrato (Jack Kilby, Texas Instruments, 1958 — Premio Nobel 2000) ha reso possibile la miniaturizzazione dell'elettronica. Prima dei circuiti integrati, un computer occupava una stanza intera. Oggi il tuo telefono è milioni di volte più potente.

#### Arduino: il microcontrollore per tutti

Un **microcontrollore** è un circuito integrato che contiene in un unico chip: un processore, memoria, e pin di input/output. Arduino è una piattaforma open-source (hardware e software liberamente disponibili) progettata per rendere la programmazione di microcontrollori accessibile a tutti.

Come funziona Arduino:
- Ha **pin digitali** (numerati da 0 a 13 su Arduino Uno): possono leggere o scrivere valori HIGH (5V, "acceso") o LOW (0V, "spento")
- Ha **pin analogici** (da A0 a A5): possono leggere valori compresi tra 0 e 5V con una risoluzione di 1024 passi (da 0 a 1023)
- Si programma in linguaggio C++ semplificato, detto **sketch**
- Si collega al computer via USB per caricare il programma

Uno sketch Arduino ha sempre questa struttura:
```
void setup() {
  // Questo codice si esegue UNA SOLA VOLTA all'avvio
  pinMode(13, OUTPUT);  // Imposta il pin 13 come uscita
}

void loop() {
  // Questo codice si esegue IN LOOP per sempre
  digitalWrite(13, HIGH);  // Accende il LED sul pin 13
  delay(1000);              // Aspetta 1 secondo (1000 ms)
  digitalWrite(13, LOW);   // Spegne il LED
  delay(1000);              // Aspetta 1 secondo
}
```

Questo sketch fa lampeggiare il LED incorporato in Arduino una volta al secondo — è il programma "Hello World" dell'elettronica.

---

## 🔍 OSSERVA

### Caso studio: costruire una lampada LED su breadboard

Una **breadboard** (tavoletta di prototipazione) è una piastra con fori collegati elettricamente su file e colonne, che permette di montare e smontare circuiti senza saldature. È lo strumento base per chi impara a costruire circuiti.

**Problema da risolvere:** vuoi accendere un LED rosso con una batteria da 9V.

Il LED rosso ha una tensione di lavoro di 2V e richiede 20 mA di corrente. La batteria fornisce 9V. Se colleghi il LED direttamente alla batteria, lo bruci immediatamente: la differenza di tensione (9V − 2V = 7V) "cade" sulla resistenza interna del LED, che non è progettata per sostenerla.

**Soluzione: mettere un resistore in serie.**

Calcolo della resistenza necessaria:
- Tensione da "smaltire" sulla resistenza: 9V − 2V = 7V
- Corrente desiderata: 20 mA = 0,02 A
- Formula: R = V / I = 7 / 0,02 = **350 Ω**

Il valore standard più vicino disponibile in commercio è 330Ω o 390Ω — entrambi vanno bene.

**Come montare il circuito su breadboard:**
1. Inserisci il LED nella breadboard: anodo (+, terminale lungo) in un foro, catodo (−, terminale corto) in un foro su una colonna diversa.
2. Inserisci il resistore da 330Ω tra l'anodo del LED e il foro di alimentazione positiva.
3. Collega il filo positivo della batteria (rosso) al foro dell'alimentazione.
4. Collega il filo negativo della batteria (nero) al catodo del LED.
5. Il LED si accende.

Se non si accende: il LED potrebbe essere invertito. Prova a girarlo di 180°.

**Estensione con Arduino:**
Invece della batteria fissa, colleghi il resistore e il LED al pin 13 di Arduino. Con lo sketch di blink qui sopra, il LED lampeggia automaticamente. Ora hai un sistema programmabile.

Con un sensore LDR (Light Dependent Resistor — resistore fotosensibile), il LED può accendersi automaticamente quando è buio: quando la luce diminuisce, la resistenza dell'LDR aumenta, e questa variazione viene letta dal pin analogico di Arduino per decidere se accendere o spegnere il LED.

---

> **Errore comune:**
> "Il filo rosso è sempre positivo e il filo nero è sempre negativo." Non sempre. Questa è una convenzione usata in elettronica amatoriale e in molti kit, ma non è una legge universale. Prima di collegare qualsiasi circuito, verifica sempre la polarità con un multimetro o leggendo la documentazione del componente. Collegare un condensatore elettrolitico al contrario può farlo esplodere.

---

### 🔌 Chi lavora con questa competenza nel 2030?

**Ingegnere elettronico embedded**

I sistemi embedded sono processori incorporati in oggetti fisici: l'elettronica di controllo di un'automobile, il termostato intelligente della tua casa, il sensore di un pannello solare, il controller di un drone. L'ingegnere embedded progetta sia il circuito hardware (quale microcontrollore, quali sensori, quale schema di alimentazione) sia il software che lo fa funzionare.

Il mercato dei dispositivi IoT (Internet of Things) — oggetti fisici connessi a internet — sta crescendo rapidamente: si stima che nel 2030 ci siano oltre 25 miliardi di dispositivi connessi nel mondo. Ognuno ha bisogno di qualcuno che l'abbia progettato.

Dove lavora: aziende di automazione industriale, automotive (i software dell'auto elettrica), domotica, dispositivi medici, robotica.

Competenze chiave che inizia a costruire da qui: legge di Ohm · circuiti digitali · programmazione C/C++ · microcontrollori · debug di circuiti

*"Il mondo fisico e il mondo digitale si parlano attraverso l'elettronica embedded. Io costruisco quella conversazione."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in 🌍 AGISCI.**

---

### ● BASE — Simulo e calcolo con Tinkercad

**Obiettivo:** simulare un circuito con LED e resistore, verificare che i calcoli della legge di Ohm siano corretti confrontandoli con la simulazione.

**Strumento:** Tinkercad Circuits (gratuito, online, nessuna installazione)
→ vai su tinkercad.com → crea un account gratuito → Circuits → "Crea nuovo circuito"

**Schema da costruire in simulazione:**
- 1 batteria da 9V
- 1 resistore da 330Ω
- 1 LED rosso
- Fili di collegamento

**Procedura:**
1. Apri Tinkercad Circuits. Trascina nella area di lavoro: una batteria, un resistore, un LED.
2. Collega i componenti come indicato nello schema (fornitogli dal docente o da questa MC nell'appendice).
3. Prima di avviare la simulazione, calcola a mano:
   - Quale tensione cade sul resistore? (9V − 2V del LED)
   - Quanta corrente scorre nel circuito? (usa la legge di Ohm)
4. Avvia la simulazione (tasto "Start Simulation"). Leggi i valori di corrente che mostra Tinkercad.
5. Confronta: il valore simulato corrisponde al tuo calcolo? Se no, dove hai sbagliato?

**Poi rispondi per iscritto:**
- Cosa succede se aumenti la resistenza a 1000Ω? La corrente aumenta o diminuisce? Perché?
- Cosa succede se metti due LED in serie invece di uno solo?

> 💡 Suggerimento: in Tinkercad puoi cliccare su un filo durante la simulazione e vedere la corrente che lo attraversa. Usa questo strumento per verificare le tue previsioni.

---

### ●● INTERMEDIO — Costruisco il circuito su breadboard

**Obiettivo:** montare fisicamente un circuito con LED, resistore e interruttore, e misurare tensione e corrente con un multimetro.

**Materiali:**
- Breadboard
- Batteria da 9V con connettore
- 1 resistore da 330Ω (colori: arancione-arancione-marrone-oro)
- 1 LED (qualsiasi colore)
- 1 interruttore a pressione (pulsante)
- Fili di collegamento (jumper wire)
- Multimetro digitale

**Procedura:**
1. Monta il circuito sulla breadboard seguendo questo ordine: batteria → filo positivo → resistore → LED → filo negativo → batteria. Aggiungi il pulsante in serie (nel percorso del filo positivo).
2. Prima di collegare la batteria: verifica visivamente che l'anodo del LED (+, terminale lungo) sia collegato al resistore e il catodo (−) al filo negativo.
3. Collega la batteria. Premi il pulsante. Il LED si accende?
4. Con il multimetro in modalità tensione DC (V⎓), misura:
   - La tensione ai capi della batteria
   - La tensione ai capi del resistore
   - La tensione ai capi del LED
   - Verifica: le tre tensioni si sommano alla tensione della batteria?
5. Con il multimetro in modalità corrente mA (metti i puntali in serie al circuito): misura la corrente totale.
6. Calcola la resistenza effettiva del LED con la formula R = V / I (usando i valori misurati).

**Domanda di riflessione:**
Il valore di resistenza che hai calcolato per il LED corrisponde a 0Ω (come teoricamente modellizzato nella legge di Ohm semplificata) oppure no? Cosa significa?

---

### ●●● AVANZATO — Progetto la lampada intelligente con Arduino

**Obiettivo:** costruire un sistema completo con sensor LDR e LED controllato da Arduino, che si accende automaticamente al buio.

**Materiali:**
- Arduino Uno (o equivalente, es. micro:bit con adattatore)
- Breadboard e fili jumper
- 1 LED (qualsiasi colore)
- 1 resistore da 330Ω (per il LED)
- 1 LDR (fotoresistore)
- 1 resistore da 10kΩ (per il divisore di tensione con l'LDR)
- USB per collegare Arduino al computer
- Arduino IDE (gratuito, scaricabile da arduino.cc)

**Schema circuito:**
Il LDR e la resistenza da 10kΩ formano un **divisore di tensione**: la tensione al punto di mezzo varia in base alla luce. Al buio il LDR ha alta resistenza → la tensione al centro è alta. Con luce il LDR ha bassa resistenza → la tensione al centro è bassa. Arduino legge questo valore dal pin analogico A0.

**Sketch da scrivere:**
```
const int ledPin = 13;
const int ldrPin = A0;
int soglia = 500;  // Valore da calibrare

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);  // Per monitorare i valori
}

void loop() {
  int valLuce = analogRead(ldrPin);
  Serial.println(valLuce);  // Stampa il valore nel monitor seriale

  if (valLuce < soglia) {
    digitalWrite(ledPin, HIGH);  // Buio → LED acceso
  } else {
    digitalWrite(ledPin, LOW);   // Luce → LED spento
  }
  delay(100);
}
```

**Calibrazione:** apri il Monitor Seriale di Arduino IDE (Ctrl+Shift+M). Osserva i valori che stampa: copri il LDR con la mano (buio) e vedi il valore salire. Regola la variabile `soglia` a un valore tra "buio" e "luce" per il tuo ambiente.

**Documenta il tuo progetto:**
- Schema del circuito (fotografato o disegnato)
- Sketch completo con commenti che spiegano ogni riga
- Tabella: valori LDR in tre condizioni (buio totale, luce artificiale, luce solare)
- Risposta scritta: come modificheresti il sistema per far variare la luminosità del LED gradualmente, non solo on/off?

> 💡 Estensione avanzata: aggiungi un secondo sensore (es. sensore di temperatura DHT11) e fai sì che il LED lampeggi più velocemente se la temperatura supera una certa soglia. Gestisci le due condizioni con logica AND nel codice.

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | ● Base — Sufficiente | ●● Intermedio — Buono | ●●● Avanzato — Ottimo |
|----------|---------------------|----------------------|----------------------|
| **1. Comprensione legge di Ohm** | Applica la formula V=RI con i dati forniti | Applica la formula in tutte e tre le forme (V=RI, I=V/R, R=V/I) e verifica il risultato | Applica la legge in un circuito misto, spiega il ragionamento a passi e identifica l'errore in un circuito non funzionante |
| **2. Serie vs. parallelo** | Sa nominare la differenza principale tra serie e parallelo | Sa calcolare la resistenza equivalente e la corrente totale per entrambe le configurazioni | Sa scegliere la configurazione corretta per un dato problema progettuale e motivarne la scelta |
| **3. Progetto circuito** | Monta il circuito con schema fornito e lo fa funzionare | Monta il circuito autonomamente, misura i valori con il multimetro e li confronta con i calcoli | Progetta un circuito originale per risolvere un problema, calcola tutti i valori, lo costruisce e lo documenta |
| **4. Sicurezza** | Conosce le regole di sicurezza elettrica di base | Le applica durante il laboratorio senza prompting | Spiega le ragioni fisiche di ogni regola di sicurezza e le trasmette a un compagno |

---

### Lo scenario

La scuola vuole installare un sistema di segnalazione luminosa nel corridoio: un LED verde che si accende quando la porta dell'aula è aperta (segnala che si può entrare senza disturbare), e un LED rosso che si accende quando la porta è chiusa (lezione in corso — non bussare).

Il sistema deve funzionare con una batteria a 9V (per autonomia senza cavi), durare almeno 30 giorni, e montarsi su una breadboard senza saldature.

---

### La consegna

**Progetta il sistema completo.** Il tuo elaborato deve contenere:

1. **Schema del circuito** (disegnato a mano o con Tinkercad): identifica ogni componente con il suo valore (quale resistenza, quanti ohm, quale LED).

2. **Calcoli**: per ogni LED, calcola la resistenza necessaria per far scorrere esattamente 15 mA. Mostra i passaggi.

3. **Analisi dell'autonomia**: un LED verde acceso consuma 15 mA. Una batteria da 9V ha una capacità tipica di 500 mAh. Quante ore può stare acceso? Quanti giorni, se rimane acceso 8 ore al giorno?

4. **Scelta della configurazione**: i due LED (verde e rosso) devono essere in serie o in parallelo? Spiega perché la configurazione sbagliata non funzionerebbe.

5. **Proposta per l'Arduino**: come potresti usare Arduino per automatizzare ulteriormente il sistema (es. contare quante volte la porta si apre in un giorno)?

---

### Materiali che ti servono

- Carta, matita, righello per lo schema
- Calcolatrice
- Accesso a Tinkercad (facoltativo per la simulazione)
- Datasheet del LED che hai usato in laboratorio (valori tipici: tensione 2V, corrente max 30mA)

---

### 🎯 Badge SDG 9 — Industria, innovazione e infrastrutture

Costruire circuiti elettronici non è solo un esercizio scolastico: è la competenza fondamentale per chi progetta le infrastrutture tecnologiche del futuro — dagli smartphone alle stazioni spaziali, dai sensori medici ai veicoli autonomi.

Il SDG 9 chiede di "costruire infrastrutture resilienti, promuovere l'industrializzazione sostenibile e favorire l'innovazione." Ogni circuito che impari a progettare è un piccolo passo in quella direzione.

---

### 🤖 Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

L'AI Coach risponde su questa MC. Esempi di domande utili:
- *"Non capisco come calcolare la resistenza equivalente in parallelo."*
- *"Il mio LED non si accende — cosa potrebbe essere andato storto?"*
- *"Qual è la differenza tra un transistor e un resistore?"*

Verifica sempre le risposte dell'AI confrontandole con il testo e con i tuoi calcoli. L'AI può sbagliare — specialmente nei numeri.

---

### 🪞 Metacognizione — Rifletti sul tuo lavoro

**1. Cosa non capivi prima e capisci adesso?**
Prima di leggere questa MC, probabilmente non sapevi spiegare perché una lampadina si accende. Adesso sai che c'è una corrente, una tensione, e una resistenza che regolano tutto. Quale dei tre concetti ti era più oscuro all'inizio? Come lo spiegheresti adesso a un compagno che non ha letto questa MC?

*Scrivi 3-4 righe:* ___________________________________________

---

**2. L'errore che hai fatto**
Nel laboratorio (base, intermedio o avanzato), quasi certamente hai fatto almeno un errore: il LED non si accendeva, i calcoli non tornavano, il sensore dava valori strani. Descrivi l'errore che hai fatto, come te ne sei accorto, e come l'hai risolto.

*Se non hai fatto errori, descrivine uno che ritieni possibile fare facilmente:* ___________________________________________

---

**3. Legge di Ohm nella vita reale**
Descrivi un dispositivo elettrico che usi ogni giorno (non menzionare il telefono — trova qualcosa di diverso). Riesci a stimare, anche molto approssimativamente, quale corrente scorre al suo interno sapendo la tensione di alimentazione e la potenza? Prova.

*Scrivi 3-4 righe:* ___________________________________________

---

**4. Connessione con le MC successive**
Questa MC introduce i circuiti come "linguaggio". Le MC-ENE-3-05 (macchine termiche) e MC-ENE-3-06 (accumulo energetico) useranno molti degli stessi concetti. Quale parte di questa MC pensi ti servirà di più per capire le macchine termiche? Perché?

*Scrivi 2-3 righe:* ___________________________________________

---

### 🔗 Collegamento con UDA-3 — "L'energia nella mia scuola"

Questa MC è parte dell'UDA interdisciplinare del terzo anno. Il sistema di monitoraggio energetico progettato in MC-ENE-3-06 userà sensori di corrente collegati ad Arduino per misurare i consumi in tempo reale — esattamente come hai imparato a fare qui.

---

## APPENDICE — Tech in English

**Termini tecnici di questa MC in inglese**

| Italiano | English | Come si legge |
|----------|---------|---------------|
| corrente elettrica | electric current | /ɪˈlektrɪk ˈkʌrənt/ |
| tensione | voltage | /ˈvəʊltɪdʒ/ |
| resistenza | resistance | /rɪˈzɪstəns/ |
| circuito in serie | series circuit | /ˈsɪəriːz ˈsɜːkɪt/ |
| circuito in parallelo | parallel circuit | /ˈpærəlel ˈsɜːkɪt/ |
| cortocircuito | short circuit | /ʃɔːt ˈsɜːkɪt/ |

> *In English we say: "Apply Ohm's law to find the current" — applica la legge di Ohm per trovare la corrente.*
>
> *"The LED is connected in series with a resistor" — il LED è collegato in serie con un resistore.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- 📖 ESPLORA: i box "Box sicurezza" vanno in evidenza grafica rossa con bordo e icona ⚠️. Sono obbligatori per le norme di sicurezza in laboratorio.
- Il box "Corrente alternata vs continua" va come sidebar laterale a colore distinto.
- I calcoli numerici vanno in font monospazio o box a sfondo grigio chiaro — devono essere chiaramente distinti dal testo narrativo.
- Schema comparativo serie/parallelo: visual obbligatorio con frecce di corrente, valori numerici colorati per ramo.

**Per l'agente generatore asset:**
- Visual 1: schema comparativo circuito serie vs. parallelo — same battery, same resistors, different connections, colors show current path.
- Visual 2: schema Tinkercad breadboard con LED e resistore — per il livello base.
- Visual 3: infografica dei componenti base (resistore, LED, condensatore, diodo, interruttore) con simbolo elettrico + foto componente reale.
- Hook audio: "Il filo che muove il mondo" — storia di Alessandro Volta e la pila, aggancio all'oggetto quotidiano (il caricatore del telefono).

---

*MC versione 1.0 — Maggio 2026*
*Fonte: Paci 2014 + Hypertech 2020 · Allineata IN 2025 (D.M. n. 221/2025)*
*Livello DigComp: I (Intermediate) · SDG 9*
