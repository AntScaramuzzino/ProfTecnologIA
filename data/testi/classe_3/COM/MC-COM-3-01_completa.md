# MC-COM-3-01 — Come arriva un messaggio dall'altra parte del mondo?
**Area:** Comunicazioni e Trasporti · **Anno:** 3ª · **Livello DigComp:** Intermediate (I)
**SDG:** 9 — Industria, innovazione e infrastrutture · **Fonte:** Paci 2014 + Hypertech 2020
**Struttura:** 4 pagine (MC livello Intermedio, contenuto espanso) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "200 millisecondi. Roma-Tokyo."**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 38 sec.*
> *(Script completo: MC-COM-3-01_hook-script.md)*

**Domanda di avvio:**
Mandi un messaggio da Roma a Tokyo: 9.200 chilometri.
Arriva in 200 millisecondi — un quinto di secondo.

Come è possibile? E cosa succederebbe se qualcuno tagliasse il cavo sbagliato?

---

## 📖 ESPLORA

### L'infrastruttura invisibile: come funziona la comunicazione a distanza

Ogni volta che mandi un messaggio, fai una videochiamata, guardi un video in streaming o cerchi qualcosa su Google, stai usando un'infrastruttura fisica che copre il pianeta intero. Non è magia — è ingegneria. E per capirla, devi partire dall'inizio: da come nasce un segnale.

---

### Dal fuoco al fotone: una storia brevissima delle telecomunicazioni

"Telecomunicazione" significa letteralmente comunicare a distanza. Gli esseri umani lo fanno da millenni: fuochi sui colli per segnalare attacchi, tamburi per trasmettere messaggi nelle foreste, torri di segnalazione lungo le coste. Ma la distanza percorribile era limitata e la quantità di informazione trasmissibile era quasi nulla — un segnale binario: fuoco acceso o spento.

La svolta arriva nel 1837, quando Samuel Morse inventa il **telegrafo elettrico**. Per la prima volta, è possibile trasmettere messaggi complessi attraverso fili conduttori usando impulsi di corrente elettrica. Nel 1858, il primo cavo telegrafico transatlantico viene posato tra l'Irlanda e Terranova: funziona per soli 27 giorni prima di bruciare, ma dimostra che è possibile.

Nel 1876, Alexander Graham Bell inventa il **telefono**: il segnale sonoro viene trasformato in segnale elettrico, trasmesso via filo e riconvertito in suono dall'altra parte. Nel 1895, Guglielmo Marconi realizza la prima trasmissione radio senza fili: l'informazione può viaggiare nell'aria, senza cavi. Nel 1920 nascono le prime stazioni radio commerciali. Nel 1936, la BBC inaugura il primo servizio televisivo regolare.

Poi arriva Internet. Il progetto ARPANET, finanziato dal Dipartimento della Difesa americano, collega nel 1969 quattro università. Nel 1991, Tim Berners-Lee inventa il World Wide Web — il sistema di pagine ipertestuali che trasforma Internet da strumento accademico a infrastruttura globale. Negli anni 2000 arriva la banda larga. Negli anni 2010, lo smartphone porta Internet in tasca a miliardi di persone. Nel 2024, il 5G promette velocità fino a 100 volte superiori al 4G.

In meno di 200 anni, la specie umana ha compresso la distanza fino a renderla irrilevante. Questo è uno dei salti tecnologici più radicali della storia.

---

### Segnali analogici e digitali: la differenza che cambia tutto

Qualsiasi comunicazione trasmette informazione attraverso un segnale che varia nel tempo. Il problema fondamentale è distinguere due tipi di variazione.

Un **segnale analogico** varia in modo continuo: ogni valore è possibile, senza interruzioni. La tua voce al telefono analogico produceva un segnale elettrico che seguiva esattamente le variazioni di pressione dell'aria prodotte dalla tua voce. La radio AM e FM trasmette segnali analogici modulati — cioè modificati in frequenza o ampiezza per portare informazione.

Un **segnale digitale** usa solo due valori: 0 e 1 (spento e acceso, basso e alto, assente e presente). Qualsiasi informazione — voce, immagine, video, testo — viene convertita in una sequenza di 0 e 1 prima di essere trasmessa. Questo processo si chiama **digitalizzazione** e avviene in due fasi:

- **Campionamento:** il segnale continuo viene misurato a intervalli regolari (es. 44.100 volte al secondo per un file audio CD). Ogni misura è un "campione".
- **Quantizzazione:** ogni campione viene approssimato al valore digitale più vicino in una scala finita (es. 65.536 livelli per un audio a 16 bit).

Il risultato è una perdita di informazione — la rappresentazione digitale non è mai perfettamente identica all'originale analogico. Ma il vantaggio è enorme: il segnale digitale può essere **copiato senza degrado**, **compresso**, **crittografato**, **ritrasmesso milioni di volte** senza che gli errori si accumulino.

> 💡 **Perché la musica digitale non suona "uguale" al vinile.** Gli audiofili sostengono che il vinile — analogico — suona "più caldo". Dal punto di vista fisico, il vinile contiene *tutte* le frequenze del segnale originale; il digitale ne contiene solo quelle campionate. A frequenze superiori a 20.000 Hz (al limite dell'udito umano), il digitale taglia. Ma il digitale non si degrada: il vinile si consuma a ogni ascolto.

---

### Come viaggia il tuo messaggio: la trasmissione via cavo

Quando mandi un messaggio, il segnale digitale deve fisicamente spostarsi da un posto all'altro. Ci sono due grandi famiglie di trasmissione: via cavo e via radio.

**Il cavo in rame** è stato la tecnologia dominante per oltre un secolo. Il rame conduce bene l'elettricità, ed è relativamente economico. Ma il segnale elettrico si **attenua** — si indebolisce man mano che percorre il cavo. Dopo qualche chilometro, serve un amplificatore. Il cavo in rame trasmette fino a qualche centinaia di Mbit/s su brevi distanze. Le linee telefoniche tradizionali usavano rame.

> 💡 **Come funziona il modem (e perché si chiama così).** Quando un computer digitale deve comunicare attraverso le linee telefoniche tradizionali in rame — progettate per trasportare segnali analogici (la voce) — serve un dispositivo che faccia la traduzione in entrambe le direzioni. Il **modem** (da **mo**dulatore-**dem**odulatore) connesso al computer trasmittente converte i segnali digitali in segnali analogici modulati per l'invio. Una volta arrivati a destinazione, il modem ricevente esegue l'operazione inversa: riconverte il segnale analogico nel segnale digitale originale, in modo che possa essere elaborato dal computer ricevente. La connessione è bidirezionale e simmetrica: entrambi i modem fanno sia modulazione che demodulazione. Con la diffusione della fibra ottica, i modem tradizionali sono in gran parte superati — ma il principio di conversione segnale-digitale/segnale-fisico rimane lo stesso in tutte le tecnologie di trasmissione. *(Fonte: DeAgostini, ISBN 9788851128050, p.283)*

**La fibra ottica** è la rivoluzione moderna. Al posto del segnale elettrico, usa **impulsi di luce** — fotoni che viaggiano all'interno di un filo di vetro o plastica purissima, spesso meno di un capello umano. La luce si propaga nella fibra per riflessione totale interna: ogni fotone che colpisce la parete del filo viene riflesso all'interno senza uscire.

I vantaggi della fibra sono enormi: la luce viaggia a circa **200.000 km/s** nella fibra (il 67% della velocità della luce nel vuoto), l'attenuazione è minima — un segnale può percorrere decine di chilometri senza amplificazione — e la capacità è vastissima: una singola fibra può trasportare decine di Tbit/s usando fasci di luce a frequenze diverse (tecnica WDM — wavelength division multiplexing). Un singolo cavo sottomarino contiene decine di fibre parallele.

> 🔬 **Box Fisica — La velocità della luce nella fibra.** Nel vuoto, la luce viaggia a 299.792 km/s. Nella fibra ottica, rallenta a circa 200.000 km/s — due terzi della velocità nel vuoto — perché interagisce con il materiale del vetro. Questo è sufficiente per coprire i 9.200 km da Roma a Tokyo in meno di 50 millisecondi. I restanti 150 ms del ritardo che vedi nella chiamata sono dovuti all'elaborazione dei segnali nei router, alle conversioni digitali e al routing tra reti diverse.

**I cavi sottomarini** sono il pilastro fisico di Internet globale. Nel 2024 esistono circa 400 cavi sottomarini attivi, per una lunghezza totale superiore a 1,3 milioni di chilometri — tre giri e mezzo intorno alla Terra. Questi cavi — spessi quanto un tubo da giardino nel loro rivestimento esterno, ma con il nucleo ottico delle dimensioni di un bastoncino — trasportano oltre il 95% di tutto il traffico Internet mondiale.

**Caso studio: anatomia di un cavo transatlantico.** Il cavo MAREA, posato nel 2017 tra Virginia Beach (USA) e Bilbao (Spagna), è di proprietà di Microsoft e Facebook (Meta). Si estende per 6.605 km, scende fino a 3.500 metri di profondità, trasporta 200 Tbit/s ed è protetto da un involucro di acciaio nelle zone costiere poco profonde (dove potrebbe essere danneggiato da ancore o pesca) e da sola guaina leggera in acque profonde. Costa circa 160 milioni di dollari. I cavi sottomarini più importanti sono posseduti da Google, Meta, Amazon, Microsoft — le stesse aziende che gestiscono i servizi che usi ogni giorno.

*Chi possiede i cavi possiede l'infrastruttura della comunicazione globale.* Questo ha implicazioni politiche che vanno ben oltre la tecnologia.

---

### Come viaggia il tuo messaggio: la trasmissione via radio

Le onde radio sono oscillazioni del campo elettromagnetico che si propagano nello spazio a velocità della luce. A differenza dei cavi, non richiedono un mezzo fisico: possono viaggiare nel vuoto.

Le onde radio si distinguono per **frequenza** — il numero di oscillazioni al secondo, misurato in Hz. La frequenza determina le proprietà di propagazione:

- **Frequenze basse (LF, MF, HF — kHz e MHz bassi):** si propagano seguendo la curvatura della Terra, possono rimbalzare sulla ionosfera. Usate per radio AM a lunga distanza, comunicazioni marittime, radioamatori.
- **Frequenze medie (VHF, UHF — MHz alti e GHz bassi):** propagazione in linea retta, richiedono ripetitori. Usate per radio FM, televisione digitale terrestre, telefonia mobile (2G, 3G, 4G), Wi-Fi.
- **Frequenze alte (SHF, EHF — decine di GHz):** propagazione strettamente direzionale, assorbite da pioggia e nebbia. Usate per 5G, ponti radio, comunicazioni via satellite.

**Modulazione AM e FM:** per trasmettere un segnale audio (voce o musica) via radio, si usa un'onda portante ad alta frequenza che viene modificata — modulata — per portare l'informazione.
- **AM (Amplitude Modulation):** si varia l'ampiezza dell'onda portante seguendo il segnale audio. Suscettibile ai disturbi elettrici (temporali).
- **FM (Frequency Modulation):** si varia la frequenza dell'onda portante. Più resistente ai disturbi, qualità audio superiore.

**Le reti mobili: da 2G a 5G.** Le generazioni di telefonia mobile si distinguono principalmente per la velocità di trasmissione dati e la latenza:

| Generazione | Anno | Velocità tipica | Latenza | Cosa ha cambiato |
|------------|------|----------------|---------|-----------------|
| 2G (GSM) | 1991 | 9,6-384 kbit/s | 200-300 ms | SMS, dati lentissimi |
| 3G (UMTS) | 2001 | 0,4-14 Mbit/s | 100-200 ms | Internet mobile (lenta), email, mappe |
| 4G (LTE) | 2009 | 10-100 Mbit/s | 30-50 ms | Streaming video, app cloud, social media |
| 5G (NR) | 2019 | 100-1000 Mbit/s | 1-10 ms | IoT, veicoli autonomi, realtà aumentata in tempo reale |

La differenza pratica tra 4G e 5G non è solo la velocità: è la **latenza** (il ritardo). Guidare un'auto autonoma con un sistema di controllo remoto richiede una latenza inferiore a 10 ms — perché le decisioni devono avvenire in tempo reale. Il 4G non è abbastanza veloce per questo. Il 5G sì.

**Wi-Fi — due bande a confronto.** Il Wi-Fi trasmette a 2,4 GHz o 5 GHz. La differenza pratica:

| Banda | Portata | Velocità | Interferenze | Ostacoli |
|-------|---------|---------|--------------|---------|
| 2,4 GHz | Maggiore (~30 m al chiuso) | Minore (max ~600 Mbit/s) | Maggiori (forni a microonde, Bluetooth) | Penetra meglio i muri |
| 5 GHz | Minore (~15 m al chiuso) | Maggiore (max ~3,5 Gbit/s) | Minori | Assorbita più facilmente dai muri |

In pratica: usa il 5 GHz quando sei vicino al router per streaming o gaming, il 2,4 GHz quando sei lontano o vuoi coprire più stanze.

---

### TCP/IP: la lingua di Internet

Internet non è una singola rete — è una rete di reti. Per far comunicare reti diverse (la rete scolastica, la rete del tuo operatore telefonico, la rete di Google), serve un linguaggio comune: il **protocollo**.

Il protocollo fondamentale di Internet è **TCP/IP** — in realtà un insieme di due protocolli che lavorano insieme:

**IP (Internet Protocol)** assegna a ogni dispositivo connesso un indirizzo univoco — l'**indirizzo IP** — e definisce come i dati vengono suddivisi in **pacchetti** per essere trasmessi. Ogni pacchetto è un piccolo blocco di dati (tipicamente da pochi byte a 1.500 byte) che porta con sé:
- L'indirizzo IP del mittente
- L'indirizzo IP del destinatario
- Un numero d'ordine (per ricomporre i pacchetti in sequenza)
- I dati veri e propri

I pacchetti di uno stesso file possono viaggiare su percorsi diversi attraverso la rete e arrivare al destinatario non in ordine — IP li rimette insieme usando il numero d'ordine.

Un indirizzo IPv4 è formato da quattro numeri da 0 a 255 separati da punti (es. 192.168.1.1). Gli indirizzi IPv4 possibili sono circa 4,3 miliardi — esauriti nel 2011. Per questo si sta migrando verso **IPv6**, che usa 128 bit e permette 340 seguito da 36 zeri di indirizzi diversi.

**TCP (Transmission Control Protocol)** si occupa di garantire che tutti i pacchetti arrivino a destinazione e nel giusto ordine. Se un pacchetto si perde (a causa di un errore di rete), TCP si accorge della mancanza e richiede la ritrasmissione. TCP è affidabile ma introduce un po' di latenza — non adatto per il gaming in tempo reale, dove si preferisce **UDP** (User Datagram Protocol), che è più veloce ma non garantisce la consegna.

> 💡 **Come funziona concretamente.** Quando scrivi un'email di 2 MB, il tuo dispositivo la suddivide in circa 1.400 pacchetti. Ogni pacchetto prende il percorso più conveniente in quel momento — possono passare per router in paesi diversi. All'arrivo, TCP li ricompone nell'ordine corretto. Se un pacchetto si perde per strada, il destinatario invia un messaggio "ritrasmetti il pacchetto numero X" e il mittente lo rimanda. Tutto questo avviene in millisecondi, in modo completamente trasparente.

---

### Router e switch: i vigili del traffico

Una rete non è solo cavi e antenne: ha componenti fisici che gestiscono il traffico dei pacchetti.

**Uno switch** collega dispositivi all'interno della stessa rete locale (LAN — Local Area Network). Riceve pacchetti e li instrada verso il dispositivo corretto basandosi sull'indirizzo fisico (indirizzo MAC). Lo switch a casa tua distribuisce la connessione tra PC, smart TV, console.

**Un router** collega reti diverse e instrada i pacchetti tra di esse basandosi sull'indirizzo IP. Il router di casa tua connette la tua rete locale (LAN) alla rete del tuo operatore telefonico (WAN — Wide Area Network). I grandi router di backbone (la spina dorsale di Internet) gestiscono milioni di pacchetti al secondo e decidono in tempo reale quale percorso è più efficiente.

**La differenza pratica:** se mandi un file al PC del tuo compagno nella stessa rete scolastica, il pacchetto passa per lo switch e non esce dalla rete locale. Se mandi lo stesso file a qualcuno in Giappone, passa per il router, che lo spedisce verso la rete dell'operatore, poi verso i router di backbone, poi verso l'operatore giapponese, poi verso il destinatario.

---

### DNS: la rubrica telefonica di Internet

Gli indirizzi IP sono numeri — difficili da ricordare. Nessuno di noi ricorda l'indirizzo IP di Google (142.250.180.4). Per questo esiste il **DNS (Domain Name System)**: un sistema distribuito che traduce nomi di dominio leggibili dall'uomo (come google.com) in indirizzi IP.

Quando scrivi google.com nel browser:
1. Il tuo dispositivo chiede al DNS server del tuo operatore: "Qual è l'IP di google.com?"
2. Se il server DNS lo sa (ce l'ha in cache), risponde immediatamente.
3. Se non lo sa, interroga altri server DNS in una gerarchia globale fino a trovare la risposta.
4. Il tuo browser riceve l'IP e stabilisce la connessione.

Tutta questa operazione — chiamata **DNS lookup** — richiede tipicamente meno di 50 ms.

---

### Sicurezza delle reti: firewall e VPN

Una rete aperta al mondo è esposta ad attacchi. Per proteggerla esistono due strumenti fondamentali.

**Il firewall** è un sistema (hardware o software) che filtra il traffico in entrata e uscita da una rete secondo regole predefinite. La scuola usa un firewall per impedire l'accesso a siti non appropriati e per bloccare connessioni esterne non autorizzate. Il firewall controlla: da che indirizzo IP arriva la richiesta, a quale porta è diretta (porta 80 = HTTP, 443 = HTTPS, 22 = SSH, ecc.), che tipo di protocollo usa.

**La VPN (Virtual Private Network)** crea un **tunnel cifrato** tra il tuo dispositivo e un server remoto. Tutto il traffico passa per questo tunnel — crittografato — prima di uscire su Internet. La VPN serve per due scopi principali:
- **Privacy:** nasconde il tuo indirizzo IP reale e cifra il traffico all'operatore.
- **Accesso remoto sicuro:** le aziende usano VPN per permettere ai dipendenti di connettersi alla rete aziendale da casa, come se fossero in ufficio.

> ⚠️ **Attenzione al malinteso comune.** Una VPN non rende anonimi: il server VPN sa chi sei (ti ha fornito accesso). Rende più difficile — non impossibile — tracciare il tuo traffico. E una VPN gratuita spesso vende i tuoi dati per finanziarsi: è esattamente l'opposto del motivo per cui la useresti.

---

### Caso studio: i cavi sottomarini — cosa succederebbe se venissero tagliati?

Abbiamo detto che il 95% del traffico Internet globale viaggia su cavi sottomarini. Questo significa che sono l'infrastruttura critica più importante del pianeta — e una delle meno protette.

Nel 2022, durante l'eruzione del vulcano Hunga Tonga–Hunga Ha'apai nelle isole Tonga, un'onda sottomarina recise i cavi sottomarini che collegavano l'arcipelago al resto del mondo. Circa 100.000 persone rimasero isolate da Internet per cinque settimane, con gravi conseguenze per l'economia locale, i servizi sanitari e le comunicazioni di emergenza.

Nel 2024, in diverse occasioni, cavi nel Mar Baltico sono stati danneggiati — in circostanze che le autorità hanno definito "sabotaggi deliberati". Questo ha sollevato discussioni sulla vulnerabilità dell'infrastruttura di comunicazione globale a conflitti e tensioni geopolitiche.

I cavi hanno protezione fisica solo nelle zone costiere poco profonde (involucro di acciaio). In acque profonde, la protezione è minima — l'isolamento geografico è la loro principale difesa. Vengono riparati da navi specializzate (cable ships) che possono impiegare settimane o mesi per localizzare e riparare un danno a migliaia di metri di profondità.

**Chi possiede i cavi?** Sempre più, le grandi piattaforme tecnologiche americane (Google, Meta, Amazon, Microsoft) stanno sostituendo i consorzi di operatori telefonici come proprietari dei cavi sottomarini. Google possiede o ha partecipazioni in decine di cavi. Questo concentra il controllo dell'infrastruttura di comunicazione globale in poche mani private.

> 🌍 **Collegamento Geo.** Apri la mappa degli cavi sottomarini su submarinecablemap.com. Osserva la distribuzione dei punti di atterraggio: la gran parte si concentra in Europa occidentale, Nord America, Asia orientale. L'Africa subsahariana, l'Oceania rurale, il centro-sud dell'Asia hanno copertura molto inferiore. La "connettività universale" è ancora molto lontana dall'essere universale.

---

> **Collegamento STEM — Matematica:**
> La velocità di trasmissione si misura in bit al secondo (bit/s). 1 Mbit/s = 1.000.000 bit al secondo. Per scaricare un film in HD di 4 GB con una connessione a 100 Mbit/s: 4 GB = 4 × 8 = 32 Gbit = 32.000 Mbit. Tempo = 32.000 ÷ 100 = 320 secondi, circa 5 minuti. Lo stesso film con una connessione 4G a 20 Mbit/s richiederebbe 1.600 secondi — quasi 27 minuti.

> **Collegamento STEM — Fisica:**
> La fibra ottica sfrutta il principio di riflessione totale interna: quando la luce colpisce l'interfaccia tra vetro e aria con un angolo sufficientemente piccolo, viene completamente riflessa all'interno. Non fuoriesce. Questo significa che i fotoni possono percorrere distanze enormi all'interno della fibra con perdite minime. L'angolo critico dipende dall'indice di rifrazione del vetro — una proprietà ottica fondamentale.

---

## 🔍 OSSERVA

### Il caso: mappare l'invisibile — la tua scuola come sistema di reti

Sei a scuola. Intorno a te ci sono almeno tre reti che coesistono nello stesso spazio fisico:

**La rete Wi-Fi scolastica** usa frequenze a 2,4 e 5 GHz. Ha un access point (il "router Wi-Fi" sul muro o sul soffitto) ogni tot metri. La potenza del segnale dipende dalla distanza dall'access point, dai materiali delle pareti (il cemento armato assorbe il segnale molto più del vetro), dall'affollamento del canale (se ci sono troppi dispositivi sulla stessa frequenza, la velocità cala).

**La rete mobile** penetra dall'esterno attraverso le pareti. Un edificio in cemento armato può attenuare il segnale 4G anche di 20-30 dB — sufficiente a far scendere da "4 barre" a "1 barra" in alcune zone.

**Il cablaggio fisico** (se presente) corre nelle canaline a parete o sotto il pavimento flottante, collegando i router agli switch e gli switch al firewall della scuola, che a sua volta si collega alla rete dell'operatore telefonico.

**Misurare la copertura Wi-Fi** è un'operazione che i tecnici di rete svolgono regolarmente usando app che mostrano la potenza del segnale in dBm (decibel-milliwatt). Un segnale di -50 dBm è eccellente; -70 dBm è accettabile; sotto -80 dBm la connessione diventa instabile.

Ogni punto di misura, riportato sulla pianta dell'edificio, contribuisce a costruire una **mappa di calore** (heatmap) che mostra visivamente le zone ben coperte (verde) e quelle con copertura insufficiente (rosso). Questa mappa è lo strumento che un tecnico di rete usa per decidere dove aggiungere access point o dove spostare quelli esistenti.

---

> **Errore comune:**
> "Se la connessione è lenta, è colpa del Wi-Fi." Non sempre. La lentezza può dipendere da: il numero di dispositivi connessi all'access point, la saturazione della banda verso Internet (il tuo operatore non fornisce abbastanza banda), un'interferenza su un canale Wi-Fi affollato, oppure un problema sul server remoto che stai raggiungendo. Prima di incriminare il Wi-Fi, controlla la velocità con un test (speedtest.net) e separa il problema.

---

### Chi lavora con questa competenza nel 2030?

**Network Infrastructure Designer**

In un mondo in cui ogni edificio, ogni veicolo, ogni dispositivo è connesso, qualcuno deve progettare reti che funzionino in modo affidabile, sicuro ed efficiente. Il Network Infrastructure Designer non si limita a installare router: analizza le esigenze di traffico, sceglie le tecnologie, progetta la topologia della rete, verifica la sicurezza e documenta l'infrastruttura.

Con l'arrivo del 5G e dell'IoT (Internet of Things — oggetti connessi a Internet), la complessità delle reti aumenta enormemente: un'abitazione moderna ha decine di dispositivi connessi; una fabbrica 4.0 ne ha migliaia; una città intelligente ne ha milioni.

Dove lavora: aziende di telecomunicazioni, system integrator, pubblica amministrazione (smart city), ospedali (reti critiche), aziende manifatturiere con impianti 4.0.

Competenze chiave che inizia a costruire da qui: protocolli di rete · sicurezza informatica · propagazione radio · analisi del traffico · topologia delle reti

*"Non installo cavi: progetto il sistema nervoso di un edificio, di una città, di un'azienda."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### BASE — Esploro la rete della mia scuola con una mappa

**Obiettivo:** capire come è fatta fisicamente la rete Wi-Fi della scuola e dove il segnale è forte o debole.

**Materiali che ti servono:** il tuo smartphone o tablet con l'app "WiFi Analyzer" (gratuita su Android) o "Network Analyzer" (gratuita su iOS). La pianta dell'edificio scolastico (stampata o sul dispositivo — chiedi al docente).

**Come procedere, passo per passo:**

1. Apri l'app. Trova la schermata che mostra la **potenza del segnale** (Signal Strength) in dBm per la rete Wi-Fi della scuola.

2. Scegli 4 punti di misura nella tua aula o nell'edificio: ad esempio, vicino alla porta, vicino alla finestra, nell'angolo più lontano dall'access point, nel corridoio.

3. In ogni punto, aspetta 10 secondi che il valore si stabilizzi, poi annota la misura.

4. Sulla pianta dell'edificio, segna ogni punto di misura con un numero e scrivi il valore dBm misurato.

5. Colora ogni punto secondo questa scala:
   - Verde: segnale tra -30 e -60 dBm (ottimo/buono)
   - Giallo: segnale tra -60 e -75 dBm (sufficiente)
   - Rosso: segnale sotto -75 dBm (scarso)

| N° | Posizione | Segnale dBm | Colore (Ottimo/Sufficiente/Scarso) |
|----|-----------|-------------|-----------------------------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

> 💡 **Il valore in dBm è negativo:** più vicino a zero è migliore. -40 dBm è più forte di -80 dBm. Potrebbe sembrare controintuitivo, ma i dBm sono una scala logaritmica: ogni 10 dB di differenza corrisponde a un segnale 10 volte più forte o più debole.

> ⚠️ **Sicurezza digitale:** usa solo la rete Wi-Fi scolastica ufficiale. Non connetterti a reti sconosciute o non protette. Non installare app non approvate dal docente.

---

### INTERMEDIO — Mappa di calore e analisi dei canali

**Obiettivo:** costruire una mappa di calore della copertura Wi-Fi su almeno 8 punti e identificare i problemi di canale.

**Materiali che ti servono:** smartphone con app Wi-Fi analyzer, pianta dell'edificio, accesso a Google Maps (per identificare le aree esterne alla scuola se rilevante).

**La mappa di calore:**

Ripeti le misure su 8 punti dell'edificio (o del corridoio + più aule). Per ogni punto:
- Annota la potenza del segnale (-dBm)
- Annota il nome della rete Wi-Fi e il numero di canale (visibile nell'app)
- Annota il numero di reti Wi-Fi visibili in quel punto (quante reti diverse vedi?)

**Analisi dei canali:**

Il Wi-Fi a 2,4 GHz usa canali da 1 a 13 in Europa. I canali si sovrappongono parzialmente: solo i canali 1, 6 e 11 sono completamente separati. Se la tua scuola usa il canale 6 e il negozio vicino usa anche lui il canale 6, c'è interferenza — entrambe le reti rallentano.

Costruisci una tabella:

| Rete visibile | Canale | Potenza in questo punto (dBm) | Interferisce con la rete scolastica? |
|--------------|--------|------------------------------|--------------------------------------|
| Rete scuola | | | — |
| Altra rete 1 | | | |
| Altra rete 2 | | | |

**Domanda di analisi:** Guardando i tuoi dati, c'è una zona dell'edificio dove il segnale è scarso? Come spieghi questa carenza — muri spessi, distanza dall'access point, interferenze? Scrivi una ipotesi in 3-4 righe.

---

### AVANZATO — Piano di miglioramento della rete scolastica

**Scenario:** il dirigente scolastico ti ha chiesto di produrre un report tecnico sulla copertura Wi-Fi della scuola e di proporre un piano di miglioramento concreto.

**Il tuo compito:**

1. **Raccolta dati:** esegui misure su almeno 10 punti dell'edificio, coprendo tutti i piani (se presenti). Per ogni punto: potenza del segnale, velocità di download misurata (usa speedtest.net o fast.com), numero di dispositivi connessi se visibile dall'app.

2. **Mappa di calore completa:** riporta tutti i punti sulla pianta dell'edificio con colori (verde/giallo/rosso). Identifica le **zone critiche** (rosso) e le **zone di copertura eccessiva** (dove si potrebbe ridurre la potenza per limitare le interferenze).

3. **Analisi delle cause:** per ogni zona critica, proponi una spiegazione tecnica basata su quello che hai imparato (distanza, materiali, canali, numero di dispositivi).

4. **Proposta di miglioramento:** per le zone critiche, proponi dove aggiungere un access point aggiuntivo, oppure come riconfigurare quelli esistenti (canale diverso, potenza aumentata). Giustifica ogni scelta con i dati raccolti.

5. **Report finale:** scrivi un documento di 2-3 pagine con: executive summary (1 paragrafo), mappa di calore, tabella dati, analisi problemi, proposte concrete, stima del costo (cerca online il prezzo di un access point Wi-Fi professionale).

> **Domanda aperta:** se la scuola non può permettersi access point aggiuntivi, esiste un modo per migliorare la copertura senza spese? Cerca la risposta e portala in classe con le fonti.

---

## 🌍 AGISCI

---

### Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | Base — Sufficiente | Intermedio — Buono | Avanzato — Ottimo |
|----------|-------------------|-------------------|------------------|
| **1. Raccolta dati** | Misura la potenza del segnale in almeno 4 punti e la riporta correttamente sulla pianta | Misura in almeno 8 punti, usa la scala cromatica corretta (verde/giallo/rosso), annota anche il canale Wi-Fi | Misura in almeno 10 punti, include dati di velocità (speedtest), analizza i canali e le interferenze da reti vicine |
| **2. Analisi e interpretazione** | Identifica almeno una zona con copertura scarsa | Spiega la causa della copertura scarsa (distanza, muri, canali) con un'ipotesi motivata | Distingue tra cause diverse (strutturali vs. interferenze vs. sovraccarico) e confronta i dati con le aspettative teoriche |
| **3. Proposta tecnica** | Indica genericamente che serve "un router in più" | Propone la posizione di un access point aggiuntivo con motivazione tecnica (zona critica identificata dai dati) | Propone un piano completo con posizioni, configurazione dei canali, stima dei costi, e valuta alternative a costo zero |
| **4. Comunicazione del risultato** | Presenta la mappa compilata con i dati numerici leggibili | Presenta la mappa con colori + una tabella riassuntiva dei dati + un paragrafo di analisi scritto | Produce un report tecnico completo con executive summary, mappa annotata, tabella, analisi, proposte e fonti |

---

### Lo scenario

La scuola ha ricevuto fondi per migliorare la connettività interna. Prima di spendere il budget, il dirigente vuole capire qual è la situazione reale della copertura Wi-Fi: dove il segnale è buono, dove è scarso, e perché.

Il tuo compito è fare il rilievo della copertura Wi-Fi, analizzare i dati e produrre una proposta tecnica concreta.

---

### La consegna

**Mappa la copertura Wi-Fi della scuola.** Misura la potenza del segnale (in dBm) in almeno 8 punti diversi dell'edificio usando un'app di analisi Wi-Fi sul tuo smartphone.

Per ogni punto di misura:
- Annota la posizione sulla pianta dell'edificio
- Registra la potenza del segnale
- Misura la velocità di download (con speedtest.net o fast.com)
- Nota se ci sono altre reti Wi-Fi visibili che potrebbero interferire

**Costruisci una mappa di calore:** colora i punti in verde (segnale ottimo/buono), giallo (sufficiente) o rosso (scarso) sulla pianta.

**Scrivi una proposta di miglioramento:** per ogni zona rossa, proponi dove posizionare un access point aggiuntivo. Giustifica la scelta con i dati raccolti.

---

### Materiali che ti servono

- Smartphone o tablet con app Wi-Fi analyzer (gratuita, non richiede installazione di software a pagamento)
- Pianta dell'edificio scolastico (fornita dal docente o scaricabile con QR code)
- Connessione a speedtest.net per misurare la velocità
- Nessun costo aggiuntivo

> **Suggerimento:** lavora in gruppi di 2-3 persone. Dividete l'edificio in zone e confrontate i dati alla fine — avrete una mappa più completa e potrete verificare se le misure sono coerenti tra i gruppi.

---

### Badge SDG 9 — Industria, innovazione e infrastrutture

Completando questo compito stai contribuendo al 9° Obiettivo di Sviluppo Sostenibile: *costruire infrastrutture resilienti, promuovere l'industrializzazione inclusiva e sostenibile, e favorire l'innovazione.*

La connettività non è un lusso — è un'infrastruttura abilitante per l'istruzione, la sanità, il lavoro e la partecipazione democratica. Analizzare e migliorare la rete della tua scuola è un contributo concreto, locale, a quell'obiettivo.

---

### Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona e chiedi all'AI Coach:
- *"Cosa significa -70 dBm? Il segnale è buono?"*
- *"Come si fa a sapere se c'è interferenza tra due reti Wi-Fi?"*
- *"Cosa è un indirizzo IP e perché cambia ogni volta che mi connetto?"*

L'AI Coach risponde solo su questa MC. Se fa un errore, segnalalo: verificare le risposte dell'intelligenza artificiale è una competenza reale.

---

### Metacognizione — Rifletti sul tuo lavoro

Rispondi a queste domande **dopo** aver consegnato il lavoro. Non c'è una risposta giusta: l'obiettivo è capire come hai ragionato, non solo cosa hai prodotto.

**1. Sorpresa**
Hai trovato un risultato inaspettato durante le misure — una zona in cui ti aspettavi un segnale forte e invece era debole, o viceversa? Descrivi cosa hai trovato e come lo spieghi.

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Difficoltà e soluzione**
C'è stata una parte del compito che non riuscivi a fare — leggere i valori dBm, interpretare l'app, costruire la mappa? Descrivi il problema e come l'hai risolto (o cosa ti ha bloccato).

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa**
Hai misurato un punto e poi hai capito di averlo fatto male (sbagliato la posizione, letto il valore sbagliato, non aspettato abbastanza che il valore si stabilizzasse)? Racconta cosa è successo e come hai corretto.

*Cosa ti ha fatto capire che avevi sbagliato? La misura era incoerente con le altre? L'app dava un risultato diverso da quello atteso?*

*Scrivi 2-3 righe:* ___________________________________________

---

**4. Connessione con la tua vita**
Hai mai avuto problemi di connessione a casa — zone in cui il Wi-Fi non arriva o è lento? Ora che sai come funziona la propagazione del segnale, come spiegheresti quel problema ai tuoi genitori? C'è qualcosa che potresti fare per migliorare la situazione?

*Scrivi 2-3 righe:* ___________________________________________

---

### Collegamento con UDA-3 — "La scuola come sistema tecnologico"

Questa MC è parte dell'UDA interdisciplinare del terzo anno: *"La scuola come sistema tecnologico"*.

La tua mappa di copertura Wi-Fi diventerà un contributo a una mappa completa dell'infrastruttura tecnologica della scuola (impianti elettrici, rete dati, sistema di allarme, consumi energetici), integrata con le MC di Energia (MC-ENE-3-04) e Sistemi (MC-SIS-3-01).

---

## APPENDICE — Tech in English

**Termini tecnici di questa MC in inglese**

| Italiano | English | Come si legge |
|----------|---------|---------------|
| rete | network | /ˈnetwɜːk/ |
| protocollo | protocol | /ˈprəʊtəkɒl/ |
| indirizzo IP | IP address | /aɪ piː ˈædrəs/ |
| fibra ottica | optical fibre | /ˈɒptɪkəl ˈfaɪbə/ |
| banda larga | broadband | /ˈbrɔːdbænd/ |
| latenza | latency | /ˈleɪtənsi/ |

> *In English we say: "The router assigns an IP address to every device on the network" — il router assegna un indirizzo IP a ogni dispositivo sulla rete.*
>
> *"The signal strength is measured in dBm — the closer to zero, the stronger the signal" — la potenza del segnale si misura in dBm — più vicino a zero, più il segnale è forte.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- Zona 2: distribuire su 3 pagine. La tabella generazioni 2G-5G va in evidenza grafica. I due box STEM vanno come sidebar laterali.
- La tabella Wi-Fi 2,4 GHz vs 5 GHz va come riquadro visivo con icone.
- Le tabelle della Zona 4 (Intermedio e Avanzato) vanno come scheda fotocopiabile allegata.
- La pianta dell'edificio (Zona 5) è accessibile via QR code — non stampata nel libro.
- I box "Attenzione al malinteso" e "Sicurezza digitale" vanno in evidenza grafica (box colorato).

**Per l'agente generatore asset:**
- Visual richiesto: mappa anatomia di Internet (cavi sottomarini → data center → ultimo miglio → dispositivo finale). Formato: PNG 1200×800 + SVG.
- Secondo visual: infografica comparativa 2G/3G/4G/5G con velocità e casi d'uso.
- Terzo visual: schema router/switch/dispositivi in rete locale con etichette.
- Hook audio: già disponibile in MC-COM-3-01_hook-script.md.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: Paci 2014 + Hypertech 2020 · Allineata IN 2025 (D.M. n. 221/2025)*
*Contenuto espanso su indicazione editoriale — tutte e 5 le zone libro-ready*
