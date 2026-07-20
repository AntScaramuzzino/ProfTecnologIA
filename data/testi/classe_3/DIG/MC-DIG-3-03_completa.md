# MC-DIG-3-03 — I dati del mondo: cosa ti raccontano i sensori intorno a te?
**Area:** Digitale · **Anno:** 3ª · **Livello DigComp:** Advanced (A)
**SDG:** 11 — Città e comunità sostenibili; 13 — Azione per il clima
**Fonte:** originale · **Struttura:** 4 pagine (MC avanzata) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Il tuo quartiere respira — ma lo sai quanto bene?"**
> 🎧 *Ascolta prima di leggere. Durata: 3 min.*

**Domanda di avvio:**
Sai quanta CO₂ c'è adesso nell'aria della tua aula — e se è abbastanza per stare svegli e concentrati?

Forse pensi che l'aria sia invisibile e incontrollabile. Invece, in questo momento, centinaia di sensori nell'edificio della tua scuola, nel tuo quartiere, nella tua città, raccolgono dati su temperatura, umidità, qualità dell'aria, consumo elettrico, traffico. Quei dati esistono. Il problema non è raccoglierli — è capire cosa ti stanno dicendo.

---

## 📖 ESPLORA

### Dal mondo fisico al numero: cos'è un dato

Un sensore fa una cosa sola, ma la fa in modo straordinario: trasforma una grandezza fisica — calore, luce, pressione, posizione, suono — in un numero. Quel numero è un **dato grezzo**. Non dice ancora nulla da solo: è il punto di partenza.

La temperatura nell'aula adesso è 21,3°C. Questo è un dato grezzo. Ma 21,3°C alle ore 11:00 di un martedì di novembre, dopo due ore di lezione con 25 studenti, con la finestra chiusa — questo è un **dato contestualizzato**. Ed è molto più utile, perché puoi confrontarlo: è più calda del solito? È cambiata rispetto a ieri alla stessa ora?

La differenza tra un dato e un'informazione è sempre il contesto. Un dato senza contesto è rumore. Un dato con contesto è conoscenza.

Questa MC non ti insegna come funziona tecnicamente un sensore — quella è competenza informatica (vedi MC-INF-3-01). Qui ti insegni a **usare i dati raccolti**: a capirli, a visualizzarli bene, a non farti ingannare da come vengono presentati, e a proteggere la tua privacy quando sei tu il sensore.

---

### Cosa raccolgono i sensori che ti circondano

Nella vita di tutti i giorni sei costantemente circondato da sistemi che raccolgono dati su di te e sull'ambiente. Conoscerli è il primo passo per usarli in modo consapevole.

**Temperatura e umidità.** I sensori più comuni. Li trovi nei termostati smart, nelle stazioni meteo, nelle serre automatizzate, nei data center dove l'umidità può danneggiare i circuiti. Un sensore di umidità nell'aula potrebbe rivelare che l'aria secca (umidità sotto il 30%) aumenta il disagio respiratorio e la predisposizione ai virus stagionali.

**Qualità dell'aria.** I sensori di CO₂ misurano la concentrazione di anidride carbonica nell'aria, espressa in ppm (parti per milione). Valore di riferimento: l'aria esterna è circa 420 ppm. Nelle aule scolastiche non ventilate, dopo due ore di lezione, può superare i 2.000 ppm. La soglia raccomandata per il benessere cognitivo è 800 ppm. Sopra 1.200 ppm iniziano stanchezza e difficoltà di concentrazione. Questo è verificabile con un sensore da 25 euro.

**Posizione GPS.** Il modulo GPS di uno smartphone calcola la posizione triangolando i segnali di almeno quattro satelliti. La precisione tipica è di 3-5 metri in campo aperto. Ogni app che installi e a cui concedi i permessi di localizzazione sa dove sei stato, quando, per quanto tempo, con quale frequenza.

**Battito cardiaco e dati biometrici.** Gli smartwatch e i fitness tracker raccolgono in continuo battito cardiaco, saturazione dell'ossigeno nel sangue, qualità del sonno, livello di attività fisica. Sono dati medici a tutti gli effetti — anche se vengono chiamati "dati fitness".

**Consumo elettrico.** I contatori smart (installati in quasi tutte le case italiane dopo il 2018) registrano il consumo elettrico ogni 15 minuti. Un algoritmo può dedurre da quei dati quando sei in casa, quando sei a letto, se usi la lavatrice la notte, se hai ospiti. Il consumo elettrico di una casa racconta le abitudini di chi ci abita con sorprendente precisione.

**Dati di traffico e mobilità.** I sistemi di navigazione come Google Maps raccolgono dati di posizione e velocità da miliardi di utenti in tempo reale per calcolare il traffico. Ogni volta che usi Maps con la localizzazione attiva, stai contribuendo al dataset globale di dati di mobilità che Google usa per i suoi modelli.

---

### Come si visualizzano i dati: scegliere il grafico giusto

Un grafico non è decorazione. È uno strumento per mostrare una struttura nei dati che il testo non riesce a comunicare. Scegliere il grafico sbagliato non è solo un errore estetico: può nascondere informazioni importanti o crearne di false.

**Grafico a linee** — per dati che cambiano nel tempo su una scala continua. Se vuoi mostrare l'andamento della temperatura dell'aula nel corso di una giornata, il grafico a linee è quello giusto: mostra chiaramente tendenze, picchi, cali graduali. Dove sbagliare: usarlo per confrontare categorie non ordinate (es. temperatura media per paese — lì ci vuole il grafico a barre).

**Grafico a barre** — per confrontare valori tra categorie distinte. Confronto dei consumi elettrici di cinque classi diverse: grafico a barre. L'asse verticale dovrebbe sempre partire da zero — se parte da un valore diverso, la differenza visiva tra le barre viene distorta.

**Grafico a dispersione (scatter plot)** — per mostrare la relazione tra due variabili continue. Se vuoi capire se c'è correlazione tra temperatura dell'aula e valori di CO₂, metti temperatura sull'asse X e CO₂ sull'asse Y, con un punto per ogni misurazione. Se i punti formano una nuvola con tendenza verso l'alto, c'è correlazione positiva.

**Heatmap** — per visualizzare dati su due dimensioni in forma di intensità di colore. Una heatmap che mostra la temperatura dell'aula ora per ora, giorno per giorno, in una settimana, permette di vedere subito i pattern: le mattine sono sempre più fredde, il venerdì pomeriggio è il momento più caldo.

**Torta (pie chart)** — uno dei grafici più abusati. Funziona bene solo con poche categorie (massimo 4-5) il cui totale ha senso come 100%. Dove sbagliare: confrontare due torte per mostrare un cambiamento nel tempo — gli occhi umani confrontano angoli e aree con molta difficoltà. In quel caso, usa due barre affiancate.

---

### Come i grafici possono ingannare

Saper leggere un grafico non basta. Devi saper riconoscere quando un grafico è costruito per ingannare — anche involontariamente.

**L'asse troncato.** Se l'asse verticale di un grafico a barre non parte da zero, la differenza visiva tra le barre sembra molto più grande di quello che è. Un'azienda che mostra i suoi profitti trimestrali con asse che parte da 950 milioni invece di zero fa sembrare un aumento da 955 a 970 milioni (1,5% di crescita) come se i profitti fossero raddoppiati. Regola pratica: guarda sempre dove inizia l'asse Y.

**Scala logaritmica non dichiarata.** In una scala logaritmica, ogni intervallo rappresenta un moltiplicatore (es. 1, 10, 100, 1.000). È utile per dati che cambiano su ordini di grandezza diversi (es. diffusione di un'epidemia nella fase esponenziale). Ma se non è dichiarata esplicitamente, una curva che sembra crescere linearmente in realtà sta crescendo in modo esponenziale — il che è molto più allarmante.

**La correlazione che sembra causalità.** Questo è il tranello più pericoloso. Due variabili che crescono insieme non si causano necessariamente a vicenda. C'è una correlazione statistica fortissima tra il numero di film di Nicolas Cage usciti ogni anno e il numero di annegamenti nelle piscine americane. Ovviamente, Nicolas Cage non causa annegamenti. Le due variabili si muovono insieme per ragioni statistiche casuali (in inglese: spurious correlation).

> **Box T8 — Come l'IA usa i dati IoT: potente e fallibile**
>
> Un sistema di intelligenza artificiale addestrato su dati IoT può fare previsioni che sembrano quasi magiche: un condizionatore che anticipa il tuo arrivo a casa, un impianto di irrigazione che predice il fabbisogno d'acqua di una settimana. Ma si basa sempre su un'assunzione: *il futuro assomiglia al passato*.
>
> Se i dati di addestramento erano raccolti in una stazione di monitoraggio urbana che funzionava male nei mesi estivi, il modello non saprà gestire le ondate di calore fuori dalla norma — esattamente quelle che sarebbero più importanti da prevedere.
>
> Correlazione non è causalità. Un'IA che ha imparato che la temperatura nelle case scende sempre quando si abbassa la luminosità esterna potrebbe dedurre che oscurare le finestre raffredda la stanza — confondendo una correlazione (entrambe scendono di notte) con una causalità (l'oscurità causa raffreddamento). L'errore sembra banale; in un sistema automatizzato che controlla impianti di riscaldamento di un edificio scolastico può tradursi in spreco energetico o discomfort.
>
> Regola d'oro: prima di fidarti di una previsione prodotta da un sistema IA, chiediti sempre su quali dati è stato addestrato, in quale periodo, in quale contesto. Se non riesci a rispondere a queste domande, la previsione è opaca — e un sistema opaco non è verificabile.

---

### Privacy e dati IoT: chi raccoglie cosa, e perché

Il tuo smartwatch sa quando dormi, quanto il tuo cuore batte durante un litigio, quanti passi fai il venerdì sera rispetto al lunedì mattina. La tua app di navigazione sa dove vai, quanto spesso, con chi. Il tuo contatore elettrico sa quando sei in casa.

Questi dati vengono raccolti, trasmessi e — quasi sempre — venduti o utilizzati per profilazione commerciale.

**Chi raccoglie i dati della tua smartwatch?** Dipende dal produttore. Apple dichiara che i dati di salute restano sul dispositivo e non vengono condivisi con Apple senza consenso esplicito. Fitbit (ora Google) ha politiche meno restrittive: i dati aggregati possono essere usati per ricerche di terze parti e pubblicità. La differenza non è tecnica — è contrattuale. E sta nei termini di servizio che quasi nessuno legge.

**Dove vanno i dati?** Il percorso tipico è: sensore → dispositivo locale (es. smartwatch) → app sullo smartphone → server del produttore (spesso negli Stati Uniti o in Irlanda per il GDPR europeo) → possibile condivisione con partner commerciali. In ogni passaggio, i dati possono essere aggregati con dati di altri utenti e usati per costruire profili comportamentali.

**Cosa dice la legge.** Il GDPR (Regolamento Generale sulla Protezione dei Dati, in vigore nell'Unione Europea dal 2018) stabilisce che i dati biometrici e di salute sono "categorie speciali" che richiedono consenso esplicito. L'utente ha il diritto di sapere quali dati vengono raccolti, di richiederne la cancellazione, di ricevere una copia dei propri dati. Nella pratica, esercitare questi diritti è spesso difficile — ma esistono.

**Open data: l'altra faccia della medaglia.** Non tutti i dati IoT sono privati. Molti enti pubblici italiani ed europei pubblicano open data liberamente accessibili: dati di qualità dell'aria di ARPA (Agenzia Regionale per la Protezione Ambientale), dati meteo di ISPRA, dati di traffico delle città. Gli open data sono usati da ricercatori, giornalisti, studenti, chiunque voglia capire come funziona il proprio territorio.

**Citizen science.** Alcuni progetti raccolgono dati ambientali attraverso reti di cittadini con sensori low-cost. Il progetto Sensor.Community (ex Luftdaten) permette a chiunque di installare un sensore di polveri sottili fatto in casa (con un Raspberry Pi e un sensore SDS011, costo: circa 35 euro) e contribuire a una mappa globale della qualità dell'aria. In Italia ci sono centinaia di stazioni attive. Il dato di un singolo sensore ha valore limitato; la rete di migliaia di sensori costruisce una mappa ad altissima risoluzione spaziale impossibile da ottenere con le reti ufficiali.

---

### Caso studio: visualizza 30 giorni di temperatura nella tua stanza — cosa puoi capire?

Supponi di avere i dati di temperatura della tua stanza rilevati ogni 30 minuti per 30 giorni (1.440 misurazioni). Prima di fare qualsiasi grafico, chiediti: *cosa voglio capire?*

Se vuoi capire **l'andamento nel tempo**, usi un grafico a linee con data sull'asse X e temperatura sull'asse Y. Puoi subito vedere se ci sono giorni eccezionalmente caldi o freddi, se la temperatura è aumentata nella seconda metà del mese, se ci sono oscillazioni giornaliere regolari.

Se vuoi capire **i pattern giornalieri**, crei una heatmap: ore del giorno sull'asse X, giorni del mese sull'asse Y, colore per la temperatura. In pochi secondi vedi i pattern: le notti sono sempre le più fredde, il pomeriggio le più calde, il weekend ha un profilo diverso dai giorni scolastici.

Se vuoi capire **la distribuzione dei valori**, usi un istogramma: quante ore nel mese la temperatura era tra 18-19°C? Tra 19-20°C? Questo ti dice qual è la temperatura "tipica" della tua stanza.

Cosa **non puoi** capire solo dai dati di temperatura: perché si verificano certi picchi (finestra aperta? riscaldamento acceso? sole diretto?), se la temperatura che registri è percepita come confortevole (dipende dall'umidità, dall'abbigliamento, dall'attività), se i tuoi dati hanno errori (sensore mal posizionato vicino a una fonte di calore diretta). I dati ti fanno domande; le risposte le cerchi combinando dati e osservazione del contesto reale.

> **Collegamento STEM — Matematica:**
> La media aritmetica di 1.440 valori di temperatura ti dice qual è il valore "centrale" del mese. Ma la media può nascondere molto: una stanza che alterna 15°C e 25°C ha la stessa media di una stanza stabile a 20°C, ma un comfort completamente diverso. Per capire la variabilità, hai bisogno della **deviazione standard** — che misura quanto i valori si discostano dalla media. Una deviazione standard alta significa alta variabilità; una bassa significa stabilità. Nel grafico a linee, la deviazione standard si traduce nell'ampiezza delle oscillazioni che vedi.

> **Collegamento con MC-DIG-1-02 — Fonti e informazione:**
> Nella prima media hai imparato a verificare le fonti di informazione scritte. Adesso puoi applicare lo stesso principio ai dati numerici: chi ha raccolto questi dati? Con quale strumento? Con quale frequenza? I dati sono stati modificati prima di essere pubblicati? Un dato non verificabile è tanto inaffidabile quanto un articolo senza fonte.

---

## 🔍 OSSERVA

### Il caso: la rete Sensor.Community e la qualità dell'aria nella tua città

Nel 2015, un gruppo di attivisti della privacy e appassionati di elettronica a Stoccarda, in Germania, decise di misurare la qualità dell'aria del proprio quartiere senza aspettare i dati ufficiali delle autorità locali — che erano disponibili solo per poche centraline fisse, spesso nei luoghi meno problematici della città.

Costruirono sensori artigianali con componenti da meno di 40 euro: un Raspberry Pi Zero, un sensore di polveri sottili SDS011, un sensore di temperatura e umidità DHT22, una scatola impermeabile stampata in 3D. Il sensore si collega alla rete WiFi di casa e trasmette i dati ogni 2,5 minuti a un server centrale. I dati sono pubblici, visualizzabili su mappa, scaricabili in formato CSV.

Oggi Sensor.Community ha più di 15.000 sensori attivi in 79 paesi. In Italia ci sono stazioni attive in quasi tutte le città medie e grandi. La mappa mostra differenze enormi tra quartieri della stessa città — tra una zona trafficata vicino a un'arteria principale e un parco urbano a 500 metri di distanza i valori di PM2.5 (polveri sottili) possono differire del 300%.

Cosa è successo dopo? In alcune città tedesche e olandesi, i dati di Sensor.Community sono stati usati da comitati di quartiere per portare evidenze alle amministrazioni locali e ottenere modifiche ai piani di traffico. I dati erano verificabili, geograficamente precisi, raccolti su periodi lunghi — non erano aneddoti ma evidenze.

Questo è l'IoT civico: dati raccolti da cittadini, per cittadini, con scopi pubblici e verificabili. L'opposto dei dati raccolti da piattaforme commerciali — opachi, privati, usati per profitto.

---

> **⚠️ Errore comune — "Correlazione positiva tra due variabili significa che una causa l'altra"**
>
> Nel progetto di monitoraggio dell'aula potresti trovare che la CO₂ sale quando sale anche la temperatura. Questo non significa che la temperatura alta produca più CO₂ — molto probabilmente entrambe salgono perché entrano più studenti, che respirano (producono CO₂) e emanano calore. La causa comune è la presenza di persone, non una relazione diretta tra le due variabili. Prima di concludere che A causa B, chiediti sempre: c'è una terza variabile C che causa sia A che B?

---


### 🔓 Chi lavora con questa competenza nel 2030?

**Esperto in Cybersecurity**

Protegge infrastrutture critiche da attacchi informatici usando crittografia avanzata, ethical hacking e metodologie di incident response per garantire continuità e conformità normativa.

Dove lavora: red team di grandi aziende, CERT nazionali e agenzie di cybersicurezza, banche e infrastrutture critiche, forze dell'ordine specializzate.

Competenze chiave che inizia a costruire da qui: crittografia avanzata · ethical hacking · normative GDPR/NIS2 · penetration testing · analisi del rischio

*"Attaccare è la mia professione. Per difendere davvero, devo pensare esattamente come chi vuole entrare."*


**Cyber Intelligence Analyst**

Lavora come un investigatore digitale: raccoglie indizi da fonti aperte — siti, social, forum, perfino il dark web — e li trasforma in dati ordinati da analizzare, proprio come si fa con le misure di un sensore. Il suo scopo è anticipare gli attacchi informatici: capire chi potrebbe colpire, come e quando. In un mondo dove miliardi di oggetti connessi trasmettono dati, il suo lavoro protegge ospedali, aziende e servizi pubblici prima che il danno accada.

Dove lavora: centri operativi di sicurezza di grandi aziende, società di threat intelligence, agenzie governative, operatori di telecomunicazioni, società di consulenza informatica.

Competenze chiave che inizia a costruire da qui: OSINT · threat detection · cyber intelligence · dark web analysis · sicurezza informatica

*"Il segnale di un attacco c'è quasi sempre, settimane prima. Io lo cerco nel rumore."*

---

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### ● BASE — Leggo e interpreto un grafico già fatto

**Obiettivo:** imparare a leggere un grafico di dati ambientali, identificarne gli elementi strutturali e rispondere a domande specifiche sui dati.

**Materiali:** il grafico fornito dal docente (dati di temperatura di un'aula, 5 giorni scolastici, misurazioni ogni ora dalle 8:00 alle 17:00) oppure un grafico di dati meteo scaricato da openweathermap.org o da ARPA della tua regione.

**Procedura:**

1. Identifica gli assi: cosa rappresenta l'asse X? Cosa rappresenta l'asse Y? Quale unità di misura è usata?

2. Individua il valore massimo e il valore minimo nel grafico. A che ora e in quale giorno si verificano?

3. Descrivi il pattern generale: la temperatura sale durante la giornata e scende di notte? C'è un giorno che sembra diverso dagli altri?

4. Rispondi a questa domanda: alla luce di quello che sai sulla vita scolastica, sai spiegare *perché* la temperatura segue questo andamento? (Es.: perché c'è un picco alla terza ora? Perché scende il venerdì pomeriggio?)

5. Identifica un momento nel grafico in cui i dati potrebbero essere stati influenzati da qualcosa di esterno (es. finestra aperta, riscaldamento guasto, evento speciale). Come lo riconosci?

> ⚠️ **Attenzione:** la tua spiegazione non deve essere certa — deve essere plausibile e motivata. Scrivi "potrebbe essere perché..." non "è sicuramente perché...". La differenza tra ipotesi e certezza è una competenza scientifica fondamentale.

---

### ●● INTERMEDIO — Costruisco e confronto grafici diversi sugli stessi dati

**Obiettivo:** costruire tre tipi diversi di grafico a partire dagli stessi dati e confrontare quali informazioni emergono in ciascuno.

**Materiali:** dataset di 30 valori di temperatura (fornito dal docente o scaricato da un sensore reale); foglio di calcolo (Google Sheets, LibreOffice Calc o equivalente).

**Procedura:**

1. Inserisci il dataset nel foglio di calcolo con data/ora in colonna A e temperatura in colonna B.

2. Costruisci tre grafici sugli stessi dati:
   - Grafico a linee (andamento temporale)
   - Grafico a barre raggruppate per giorno (media giornaliera)
   - Istogramma della distribuzione (quante rilevazioni per ogni fascia di temperatura)

3. Per ogni grafico, scrivi: **cosa emerge di più evidente in questo grafico** che negli altri due è meno visibile?

4. Quale dei tre grafici useresti se dovessi comunicare "questa aula ha un problema di surriscaldamento pomeridiano"? Quale invece se volessi comunicare "le temperature sono generalmente nella norma"?

5. Cambia il punto di partenza dell'asse Y di uno dei grafici a barre: parti da 15°C invece che da 0°C. Cosa succede all'aspetto visivo del grafico? Perché questo è un problema etico oltre che tecnico?

> **Domanda di riflessione:** hai mai visto grafici sui media o sui social che potrebbero avere usato questo trucco dell'asse troncato? Prova a ricordare un esempio — o cercane uno online con la query "misleading graph examples".

---

### ●●● AVANZATO — Analisi critica di dati IoT reali con questione di privacy

**Scenario:** hai accesso a un dataset pubblico reale: i dati di qualità dell'aria di una stazione di Sensor.Community nel tuo comune o in una città italiana. I dati sono scaricabili in formato CSV dal sito sensor.community (seleziona stazione, scarica 30 giorni di dati).

**Parte 1 — Analisi dei dati:**

1. Importa il CSV in un foglio di calcolo. Identifica le colonne: data/ora, PM2.5, PM10, temperatura, umidità.

2. Costruisci una heatmap di PM2.5 (ore del giorno sull'asse X, giorni del mese sull'asse Y) usando la formattazione condizionale del foglio di calcolo. Usa la scala verde-giallo-rosso.

3. Identifica i 5 momenti con i valori più alti di PM2.5. Riesci a spiegare perché in quei momenti specifici i valori erano alti? (Es.: orario di punta del traffico, mattina con nebbia, un evento specifico in città)

4. Calcola la correlazione visiva tra PM2.5 e umidità: quando l'umidità è alta, il PM2.5 tende ad essere alto o basso? Questo è causa o correlazione? Spiega.

**Parte 2 — Questione di privacy:**

5. Il sensore Sensor.Community che hai usato è installato in una casa privata. Chi lo gestisce ha scelto di rendere pubblici i dati. Rispondi a queste domande:
   - Quali informazioni sulla vita del proprietario si potrebbero dedurre dall'analisi di lunga durata di questi dati?
   - Se il proprietario si trasferisce, dovrebbe cancellare i dati storici? Perché?
   - Come è diverso questo caso dai dati raccolti da Google Maps o da un contatore smart? (Chi decide di rendere i dati pubblici? Chi beneficia?)

6. Scrivi una conclusione di 8-10 righe che risponda alla domanda: "La raccolta di dati ambientali da parte di cittadini è sempre un bene, o ci sono rischi da considerare?"

> **Domanda aperta:** cerca se nella tua città esiste già una rete di sensori civici attiva (Sensor.Community, AirQino, o reti di ARPA). Se sì, cosa mostrano i dati sulla qualità dell'aria nel tuo quartiere rispetto al centro della città?

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | ● Base — Sufficiente | ●● Intermedio — Buono | ●●● Avanzato — Ottimo |
|----------|---------------------|----------------------|----------------------|
| **1. Lettura e interpretazione del grafico** | Identifica valori massimi/minimi e descrive l'andamento generale | Spiega il pattern con riferimento al contesto reale (es. orario scolastico, stagione) | Identifica anomalie nei dati e formula ipotesi verificabili per spiegarle |
| **2. Scelta e costruzione del grafico** | Costruisce il tipo di grafico richiesto con dati corretti sull'asse giusto | Sceglie autonomamente il tipo di grafico più adatto all'informazione da comunicare e motiva la scelta | Costruisce grafici multipli sugli stessi dati e spiega cosa emerge in ciascuno che negli altri non si vede |
| **3. Analisi critica (correlazione vs causalità, grafici ingannevoli)** | Riconosce quando un grafico ha l'asse Y che non parte da zero | Sa spiegare perché un grafico con asse troncato distorce la percezione, con un esempio | Identifica una correlazione spuriosa nei dati analizzati e spiega qual è la probabile causa comune |
| **4. Consapevolezza della privacy** | Sa nominare almeno un tipo di dato IoT raccolto su di sé e chi lo raccoglie | Descrive il percorso di un dato dal sensore al server e sa indicare a quale punto la privacy è a rischio | Mette in relazione diritti GDPR, pratiche reali delle piattaforme e proprie scelte di gestione dei permessi |

---

### Lo scenario

L'amministrazione della tua scuola vuole capire se le condizioni ambientali nelle aule influenzano il benessere e la concentrazione degli studenti. Ti chiede di contribuire alla raccolta e all'analisi dei dati.

Non hai bisogno di hardware: puoi usare dati già disponibili. La rete ARPA della tua regione pubblica dati di temperatura, umidità e qualità dell'aria in formato aperto. Sensor.Community ha probabilmente una stazione nel tuo comune. Anche i dati meteo storici da openmeteo.com sono gratuiti e liberamente scaricabili.

---

### La consegna

**Scegli un dataset** tra quelli disponibili online (ARPA, Sensor.Community, OpenMeteo) relativo alla tua città o provincia. Scarica almeno 7 giorni di dati.

**Analizza e visualizza** i dati costruendo almeno due grafici diversi (tipo di grafico a tua scelta, motivando la scelta).

**Scrivi una relazione breve** (max 15 righe) che risponda a queste tre domande:
1. Cosa ti dicono i dati? (descrizione dei pattern principali)
2. Cosa NON ti dicono i dati? (limiti del dataset, domande a cui non puoi rispondere solo con questi numeri)
3. Chi ha raccolto questi dati, con quale scopo e chi può accedervi?

**Materiali che ti servono:**
- Accesso a internet per scaricare i dati
- Un foglio di calcolo (Google Sheets, LibreOffice Calc)
- Questa scheda

> **Suggerimento:** la terza domanda — chi raccoglie, perché, chi accede — è spesso la più difficile. Per i dati ARPA, cerca la sezione "Open Data" sul sito della tua regione e leggi la licenza. Per Sensor.Community, cerca la pagina "Data Policy" del progetto.

---

### 🎯 Badge SDG 11 — Città e comunità sostenibili

Quando monitori i dati ambientali del tuo quartiere e li usi per fare domande concrete alla tua scuola o alla tua città, stai praticando l'11° Obiettivo di Sviluppo Sostenibile: costruire città e comunità sostenibili attraverso informazione fondata su dati.

Il monitoraggio civico non sostituisce le istituzioni — le affianca con dati che altrimenti non esisterebbero. È una forma concreta di partecipazione democratica che usa la tecnologia come strumento, non come fine.

---

### 🤖 Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona e chiedi all'AI Coach:
- *"Qual è la differenza tra correlazione e causalità? Fammi un esempio con i dati IoT."*
- *"Come si costruisce una heatmap in Google Sheets?"*
- *"Quali sono i miei diritti GDPR sui dati raccolti dal mio smartwatch?"*

Se l'AI Coach fa un errore o ti dà una risposta che sembra inventata, segnalalo: verificare le risposte dell'AI è parte del tuo apprendimento.

---

### 🪞 Metacognizione — Rifletti sul tuo lavoro

**1. Sorpresa**
C'è un dato nei tuoi grafici che ti ha sorpreso — un valore più alto o più basso di quello che ti aspettavi, o un pattern che non avresti previsto? Descrivi cosa hai visto e come hai provato a spiegarlo.

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Difficoltà e soluzione**
Quale è stata la parte più difficile del lavoro? Costruire il grafico correttamente? Scegliere il tipo di grafico? Rispondere alla domanda sulla privacy? Come hai affrontato la difficoltà?

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa**
Hai commesso un errore durante l'analisi — magari hai costruito prima un tipo di grafico sbagliato per i dati che avevi, o hai confuso correlazione con causalità in una prima lettura? Descrivi l'errore e come te ne sei accorto.

*Cosa ti ha aiutato a capire che avevi sbagliato? Il confronto con un compagno? Il feedback del docente? Rileggendo le istruzioni?*

*Scrivi 2-3 righe:* ___________________________________________

---

**4. Connessione con la tua vita**
Quali dati su di te vengono raccolti ogni giorno che non sapevi fossero raccolti — o a cui non avevi mai pensato? Dopo questa MC, hai cambiato qualcosa nelle impostazioni del tuo telefono o nelle autorizzazioni delle app? Perché sì, o perché no?

*Scrivi 2-3 righe:* ___________________________________________

---

### 🔗 Collegamento con MC-DIG-3-02 — Intelligenza Artificiale

I dati che hai analizzato in questa MC sono esattamente il carburante dei sistemi IA che hai studiato in MC-DIG-3-02. Un modello IA non impara dal nulla: impara da dataset di dati storici. Più capisci come i dati vengono raccolti, puliti e interpretati, più capisci perché certi sistemi IA sbagliano — e in quali condizioni.

---

## APPENDICE — Tech in English

| Italiano | English | Come si legge |
|----------|---------|---------------|
| dato grezzo | raw data | /rɔː ˈdeɪtə/ |
| visualizzazione dei dati | data visualization | /ˈdeɪtə ˌvɪʒuəlaɪˈzeɪʃən/ |
| flusso di dati | data stream | /ˈdeɪtə striːm/ |
| campionamento | sampling | /ˈsɑːmplɪŋ/ |
| correlazione spuria | spurious correlation | /ˈspjʊəriəs ˌkɒrəˈleɪʃən/ |

> *In English we say: "Raw data needs context to become information" — i dati grezzi hanno bisogno di contesto per diventare informazione.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- Zona 2: distribuire su 2 colonne. I box "correlazione vs causalità" e "T8 — IA e dati IoT" vanno come sidebar con colore di sfondo diverso.
- La tabella "tipi di grafico" va come infografica visuale con esempi mini-grafico per ogni tipo.
- Le due note STEM e il collegamento MC-DIG-1-02 vanno come riquadri laterali.
- La rubrica di Zona 5 va su pagina separata o come scheda fotocopiabile.

**Per l'agente generatore asset:**
- Visual richiesto 1: schema "dato grezzo → contesto → informazione" con esempio pratico (temperatura 21.3°C → quando, dove, confronto).
- Visual richiesto 2: guida visiva "quale grafico per quale dato" con mini-esempi dei 5 tipi principali.
- Visual richiesto 3: infografica "percorso del dato IoT" (sensore → dispositivo → app → server → terze parti) con indicazione dei punti di rischio privacy.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025)*
*Livello DigComp: Advanced (A) · Contenuto espanso su indicazione editoriale — tutte e 5 le zone libro-ready*
