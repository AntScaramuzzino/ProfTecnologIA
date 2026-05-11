# MC-INF-1-01 — Come fa una macchina a capire una foto?
**Area:** Informatica · **Anno:** 1ª · **Livello DigComp:** Foundation (F)
**SDG:** 4 — Istruzione di qualità · **Fonte:** Hypertech 2020 + originale
**Struttura:** 4 pagine (doppio spread espanso) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Dodici milioni di pixel"**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 20 sec.*
> *(Script completo: MC-INF-1-01_hook-script.md)*

**Domanda di avvio:**
Quanti materiali diversi pensi che ci siano in una fotografia digitale?

Non colori — numeri. Ogni foto sul tuo telefono è una sequenza di numeri. Solo numeri.
Scopri come funziona — e perché due cifre bastano per tutto.

---

## 📖 ESPLORA

### Tutto quello che il computer "vede" è un numero.

Pensa a una foto che hai scattato di recente. Sembra un'immagine — un momento, un ricordo. In realtà, dentro al tuo telefono, quella foto è una sequenza lunghissima di numeri. Solo numeri. Nient'altro.

Il computer non vede immagini. Non sente suoni. Non legge parole. Capisce solo numeri — e li rappresenta usando un sistema molto particolare: il **sistema binario**, cioè un sistema di numerazione che usa solo due cifre: **0** e **1**.

Questo è il punto di partenza di tutta l'informatica. Capirlo non è difficile — basta sapere da dove viene e perché funziona.

---

### Perché proprio 0 e 1?

Prendi un interruttore della luce. Può stare in due posizioni: spento o acceso. Non esiste una posizione "a metà". Non esiste "quasi acceso". Solo due stati: **0** (spento) e **1** (acceso).

I circuiti elettronici dentro un computer funzionano esattamente così. Ogni componente, chiamato **transistor**, cioè un minuscolo interruttore elettronico, può essere in due stati: corrente che passa (1) o corrente che non passa (0). Un processore moderno ne contiene miliardi — e li accende e spegne miliardi di volte al secondo.

Due stati. Due cifre. Un linguaggio semplice che, combinato in sequenze molto lunghe, riesce a rappresentare qualsiasi cosa.

---

### Il sistema binario: contare con due sole cifre

Nel sistema decimale che usi ogni giorno, hai dieci cifre: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. Quando arrivi a 9 e vuoi andare avanti, metti uno 0 e aggiungi 1 a sinistra: ottieni 10.

Nel sistema **binario** hai solo due cifre: 0 e 1. Quando arrivi a 1 e vuoi andare avanti, metti uno 0 e aggiungi 1 a sinistra: ottieni 10 — ma in binario questo vale **due**, non dieci.

Ecco i primi numeri a confronto:

| Decimale | Binario |
|----------|---------|
| 0 | 0 |
| 1 | 1 |
| 2 | 10 |
| 3 | 11 |
| 4 | 100 |
| 5 | 101 |
| 8 | 1000 |
| 10 | 1010 |

Ogni cifra binaria si chiama **bit** — abbreviazione di *binary digit*, cioè cifra binaria. Un bit è la più piccola unità di informazione possibile: o è 0 o è 1.

Con 1 bit puoi rappresentare 2 valori (0 oppure 1).
Con 2 bit puoi rappresentare 4 valori (00, 01, 10, 11).
Con 8 bit puoi rappresentare 256 valori (da 0 a 255).

8 bit si chiamano **byte**. Il byte è l'unità base con cui il computer misura le informazioni: un carattere di testo occupa tipicamente 1 byte (8 bit).

> 💡 **Lo sapevi?** Il matematico Gottfried Wilhelm Leibniz ha descritto il sistema binario nel 1703, a Lipsia, in un articolo chiamato *Explication de l'Arithmétique Binaire*. All'epoca non esisteva nessun computer. Aveva solo capito che due simboli bastano per rappresentare qualsiasi numero. Tre secoli dopo, la sua idea è dentro ogni dispositivo digitale del pianeta.

---

### Da bit a immagine: come funziona davvero una foto

Una foto da 12 megapixel contiene 12 milioni di pixel. Ogni pixel — cioè ogni singolo puntino dell'immagine — ha un colore.

I colori digitali si costruiscono mescolando tre componenti: **rosso** (Red), **verde** (Green) e **blu** (Blue). Questo sistema si chiama **RGB**. Ogni componente ha un valore da 0 a 255 — cioè un numero che occupa 1 byte (8 bit).

Per ogni pixel servono quindi 3 byte: uno per il rosso, uno per il verde, uno per il blu.

12.000.000 pixel × 3 byte = 36.000.000 di byte di dati per una sola foto. Trentasei milioni di numeri. Tutti scritti in binario. Tutto con 0 e 1.

> Guarda l'infografica accanto: mostra un pixel ingrandito con i suoi tre valori RGB. Cambia uno solo dei tre valori — e il colore cambia completamente.

---

### Le unità di misura dell'informazione

I byte si raggruppano in unità più grandi. Ecco la scala che usi ogni giorno senza saperlo:

| Unità | Simbolo | Quanto vale |
|-------|---------|-------------|
| bit | b | 1 cifra binaria (0 o 1) |
| byte | B | 8 bit |
| kilobyte | KB | 1.000 byte (circa) |
| megabyte | MB | 1.000.000 byte (circa) |
| gigabyte | GB | 1.000.000.000 byte (circa) |
| terabyte | TB | 1.000.000.000.000 byte (circa) |

Quando dici che il tuo telefono ha 128 GB di memoria, stai dicendo che può contenere circa 128 miliardi di byte — cioè circa 1.024 miliardi di bit di informazione.

> **⬛ Box INF/DIG:** la competenza digitale è sapere che i file occupano spazio e che lo spazio si misura in byte. La competenza informatica è capire perché: come il computer costruisce un file in binario, come lo comprime, come lo recupera. Questa MC costruisce quella seconda competenza.

---

> **🔢 Collegamento STEM — Matematica:**
> Il sistema binario è un sistema di numerazione in base 2. Per convertire un numero binario in decimale, moltiplica ogni cifra per la potenza di 2 corrispondente alla sua posizione. Esempio: il numero binario 1011 vale 1×8 + 0×4 + 1×2 + 1×1 = 11 in decimale. Stai usando le potenze di 2: 2⁰=1, 2¹=2, 2²=4, 2³=8, 2⁴=16...

---

## 🔍 OSSERVA

### Caso studio: una lettera dentro al computer

Il testo che stai leggendo adesso, stampato su questa pagina, è stato scritto su un computer. Ogni lettera — ogni "A", ogni "B", ogni spazio — è stata convertita in un numero binario prima di essere salvata.

Come funziona questa conversione? Attraverso una tabella standard chiamata **ASCII** (*American Standard Code for Information Interchange*), adottata come standard internazionale nel 1963. Ogni carattere ha il suo numero.

Qualche esempio:

| Carattere | Numero decimale | Numero binario |
|-----------|----------------|----------------|
| A | 65 | 01000001 |
| B | 66 | 01000010 |
| Z | 90 | 01011010 |
| a | 97 | 01100001 |
| 0 | 48 | 00110000 |
| spazio | 32 | 00100000 |

La parola "CIAO" occupa quindi 4 byte:
- C = 67 = 01000011
- I = 73 = 01001001
- A = 65 = 01000001
- O = 79 = 01001111

Quattro lettere. Quattro byte. Trentadue bit. Trentadue 0 e 1 in fila.

---

**Il limite di ASCII e la nascita di Unicode**

ASCII funzionava bene per l'inglese: aveva 128 caratteri, sufficienti per lettere latine, numeri e punteggiatura. Ma non aveva la "à", la "è", la "ü", i caratteri cinesi, gli emoji.

Per risolvere questo problema è stato creato **Unicode** — uno standard che assegna un numero univoco a ogni carattere di ogni lingua del mondo, più tutti gli emoji. Unicode oggi copre oltre 140.000 caratteri in più di 150 sistemi di scrittura. Ogni emoji è un carattere Unicode: 😊 ha il codice U+1F60A.

La versione di Unicode più usata si chiama **UTF-8**: un sistema intelligente che usa 1 byte per i caratteri ASCII standard e fino a 4 byte per quelli più rari, così da non sprecare spazio.

---

**La compressione: meno bit per la stessa informazione**

36 milioni di byte per una foto non compressa sono molti. Ma le foto sul tuo telefono occupano molto meno — di solito 2-5 MB invece di 36 MB. Come?

Attraverso la **compressione**: algoritmi matematici che trovano pattern ripetuti nell'immagine e li codificano in modo più efficiente. Se in una zona dell'immagine ci sono 500 pixel dello stesso azzurro, invece di scrivere 500 volte il valore di quell'azzurro, si scrive una volta "500 pixel di questo colore". Il risultato finale contiene le stesse informazioni, ma occupa molto meno spazio.

I formati JPEG, PNG e WebP usano diversi algoritmi di compressione — con diversi compromessi tra qualità e dimensione.

> ⚠️ **Errore comune:** "più GB ha il telefono, più è veloce." Sbagliato. La memoria di archiviazione (GB) determina quanto puoi salvare, non quanto è veloce il processore. Confondere storage e velocità è uno degli errori più comuni nella scelta di un dispositivo.

---

### 👨‍💻 Chi lavora con questa competenza nel 2030?

**Sviluppatore di sistemi embedded e IoT**

I dispositivi connessi — dai termostati intelligenti ai sensori industriali ai dispositivi medici — comunicano tutti in linguaggio binario su reti con bandwidth limitata. Chi progetta questi sistemi deve capire come rappresentare l'informazione nel modo più efficiente possibile: ogni bit risparmiato è energia risparmiata, latenza ridotta, affidabilità aumentata.

Dove lavora: aziende di automazione, produttori di dispositivi medici, startup IoT, laboratori di ricerca robotica.

Competenze chiave che inizi a costruire qui: sistemi di numerazione · codifica dell'informazione · efficienza nella rappresentazione dei dati · pensiero astratto sui livelli di astrazione del computer.

*"Il codice binario non è un dettaglio tecnico: è la grammatica di tutto quello che le macchine fanno."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in 🌍 AGISCI.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### ● BASE — Decodifico il mio nome in binario

**Obiettivo:** convertire le lettere del proprio nome in codice binario usando la tabella ASCII.

**Materiali:** questa pagina del libro + carta e penna.

**Come procedere:**

Usa la tabella ASCII qui sotto per trovare il codice binario di ogni lettera del tuo nome (solo le prime 4 lettere se il nome è lungo).

**Tabella ASCII semplificata (solo le lettere maiuscole che ti servono):**

| A=65 | B=66 | C=67 | D=68 | E=69 | F=70 |
|------|------|------|------|------|------|
| 01000001 | 01000010 | 01000011 | 01000100 | 01000101 | 01000110 |

| G=71 | H=72 | I=73 | J=74 | K=75 | L=76 |
|------|------|------|------|------|------|
| 01000111 | 01001000 | 01001001 | 01001010 | 01001011 | 01001100 |

| M=77 | N=78 | O=79 | P=80 | Q=81 | R=82 |
|------|------|------|------|------|------|
| 01001101 | 01001110 | 01001111 | 01010000 | 01010001 | 01010010 |

| S=83 | T=84 | U=85 | V=86 | W=87 | Z=90 |
|------|------|------|------|------|------|
| 01010011 | 01010100 | 01010101 | 01010110 | 01010111 | 01011010 |

**Scrivi:**
- Le lettere del tuo nome (maiuscole): ___  ___  ___  ___
- Il codice decimale di ciascuna: ___  ___  ___  ___
- Il codice binario di ciascuna: ________________  ________________  ________________  ________________
- Quanti bit hai usato in totale? ___

**Domanda finale:** se il tuo nome avesse 10 lettere, quanti byte occuperebbe in memoria?

---

### ●● INTERMEDIO — Converto numeri e misuro le dimensioni

**Obiettivo:** convertire numeri tra sistemi decimale e binario, e calcolare le dimensioni di file reali.

**Parte 1 — Conversioni**

Converti questi numeri dal sistema decimale al sistema binario (usa la tabella delle potenze di 2: 128, 64, 32, 16, 8, 4, 2, 1):

1. 13 → ________
2. 25 → ________
3. 42 → ________
4. 100 → ________

Converti questi numeri dal sistema binario al sistema decimale:

5. 0101 → ___
6. 1100 → ___
7. 10110 → ___
8. 11111111 → ___

**Parte 2 — Calcola le dimensioni**

Rispondi a queste domande con un calcolo scritto:

a) Un file di testo con 500 caratteri (solo lettere ASCII) occupa quanti byte? Quanti KB approssimativamente?

b) Una foto da 8 megapixel non compressa (RGB, 3 byte per pixel) occupa quanti MB? (Arrotonda a una cifra decimale)

c) Un video Full HD (1920×1080 pixel) a 30 fotogrammi al secondo, non compresso, occupa quanti MB al secondo? Quanti GB per un minuto di video?

**Parte 3 — Riflessione**

Guarda le dimensioni dei video che hai calcolato. Poi cerca online quanto occupa un minuto di video su YouTube o TikTok (cerca "quanto pesa un video YouTube 1080p 1 minuto"). Il risultato è molto diverso da quello che hai calcolato? Perché?

---

### ●●● AVANZATO — Progetto un sistema di codifica

**Scenario:** sei un ingegnere del software. Devi trasmettere dati di temperatura da un sensore ambientale a un server cloud, 100 volte al secondo, tramite una connessione a bassa banda. La temperatura varia tra -40°C e +60°C, con precisione di 0,5°C.

**Il tuo compito:**

**Passo 1 — Analisi del range**
Quanti valori distinti devi poter rappresentare? (Considera che la temperatura può essere -40,0 / -39,5 / -39,0 ... +59,5 / +60,0 — ogni mezzo grado è un valore distinto.)

**Passo 2 — Scelta del numero di bit**
Quanti bit servono per rappresentare quel numero di valori? Usa la formula: il numero di valori rappresentabili con N bit è 2^N. Trova il N minimo che basta.

**Passo 3 — Calcolo del traffico dati**
Con il tuo schema di codifica, quanti bit trasmetti al secondo? Quanti byte al minuto? Quanti MB al giorno?

**Passo 4 — Confronto con alternative**
Calcola cosa succederebbe se usassi:
- 8 bit per ogni campione
- 16 bit per ogni campione
- Un float a 32 bit IEEE 754 (standard per i numeri decimali)

Quale scelta minimizza il traffico senza perdere informazione?

**Passo 5 — Risposta scritta**
Scrivi una proposta tecnica di 8-10 righe che spiega: quanti bit hai scelto, perché, quale traffico dati produce, e se c'è un compromesso che hai dovuto fare.

> **Domanda aperta:** cosa succede se la temperatura deve avere precisione di 0,1°C invece di 0,5°C? Quanti bit servirebbero? Come cambierebbe il traffico?

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | ● Base — Sufficiente | ●● Intermedio — Buono | ●●● Avanzato — Ottimo |
|----------|---------------------|----------------------|----------------------|
| **1. Comprensione del sistema binario** | Sa che il computer usa 0 e 1. Riconosce un numero binario semplice. | Converte numeri decimali piccoli in binario e viceversa. Spiega il concetto di bit e byte. | Converte numeri con più di 4 bit, applica la formula 2^N, e spiega perché il binario è il sistema naturale per i circuiti elettronici. |
| **2. Codifica dell'informazione** | Sa che testi, immagini e suoni sono rappresentati come numeri nel computer. | Spiega come funziona ASCII e calcola lo spazio occupato da una stringa di testo. | Spiega la differenza tra ASCII e Unicode, calcola le dimensioni di immagini non compresse, e discute il ruolo della compressione. |
| **3. Calcolo delle unità di misura** | Distingue bit, byte, KB, MB, GB e le relazioni tra loro. | Applica le conversioni tra unità per calcolare dimensioni di file reali. | Usa le unità per progettare un sistema di trasmissione dati con vincoli di banda, giustificando ogni scelta. |
| **4. Precisione del linguaggio** | Usa correttamente almeno 4 termini della MC (bit, byte, binario, pixel, ASCII). | Usa tutti i termini chiave in modo corretto e nel contesto giusto. | Usa i termini tecnici con precisione, introduce almeno un termine trovato autonomamente, e corregge spontaneamente usi imprecisi. |

---

### Lo scenario

La tua scuola vuole creare un archivio digitale delle fotografie storiche del quartiere. Avete ricevuto 200 foto in formato fisico che devono essere scansionate e salvate. Prima di iniziare, il preside vuole sapere quanto spazio servirà sul server.

Sei tu a fare i calcoli.

---

### La consegna

**Scegli una delle tre opzioni di scansione:**

| Opzione | Risoluzione | Profondità colore | Formato |
|---------|-------------|-------------------|---------|
| A — Qualità minima | 600 dpi, immagine 10×15 cm | 8 bit (scala di grigi) | PNG non compresso |
| B — Qualità standard | 1200 dpi, immagine 10×15 cm | 24 bit (RGB) | JPEG compresso (fattore 10:1) |
| C — Qualità archivio | 2400 dpi, immagine 10×15 cm | 48 bit (RGB alta profondità) | TIFF non compresso |

**Passo 1:** calcola la risoluzione in pixel dell'immagine per ciascuna opzione.
*(1 pollice = 2,54 cm. Un'immagine 10×15 cm a 600 dpi ha: (10/2,54)×600 × (15/2,54)×600 pixel)*

**Passo 2:** calcola le dimensioni in MB di un singolo file per ciascuna opzione.

**Passo 3:** calcola lo spazio totale per 200 foto per ciascuna opzione.

**Passo 4:** scrivi una raccomandazione motivata (6-8 righe) al preside: quale opzione sceglieresti e perché? Considera sia la qualità che il costo (circa 0,03 € per GB di storage al mese su un server cloud).

---

### Materiali che ti servono

- Calcolatrice (o smartphone)
- Carta e penna per i calcoli intermedi
- Questa scheda (scaricabile con il QR code → o fotocopiabile dal libro)

---

### 🎯 Badge SDG 4

Completando questa attività stai mettendo in pratica l'SDG 4 — Istruzione di qualità: capire come viene rappresentata l'informazione digitale è una competenza fondamentale per partecipare in modo consapevole alla società digitale. Chi non sa che "digitale" significa "basato su numeri in formato binario" non può capire i limiti, i rischi e le potenzialità degli strumenti che usa ogni giorno.

---

### 🤖 Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona e chiedi all'AI Coach tutto quello che non ti è chiaro su questa MC:
- *"Come converto 47 in binario?"*
- *"Cosa significa 'profondità di colore' di 24 bit?"*
- *"Perché i file JPEG sono più piccoli dei file PNG?"*

L'AI Coach risponde solo su questa MC. Se fa un errore, segnalalo — verificare le risposte dell'intelligenza artificiale è una competenza reale.

---

### 🪞 Metacognizione — Rifletti sul tuo lavoro

**1. Il concetto più difficile**
Qual è stata la cosa più difficile da capire in questa MC? Il sistema binario in sé? Le conversioni? Il calcolo delle dimensioni dei file? Descrivi il momento in cui "hai capito".

*Scrivi 2-3 righe:* ___________________________________________

**2. Connessione con la tua esperienza**
Hai mai visto una foto "pixelata" — dove si vedono i quadratini? Adesso sai perché succede: i pixel sono diventati visibili perché l'immagine è stata ingrandita troppo. Racconta quando l'hai vista e, adesso che sai come funziona, cosa cambieresti nella situazione in cui si trovava quell'immagine?

*Scrivi 2-3 righe:* ___________________________________________

**3. Se potessi rifare**
C'è un calcolo che hai sbagliato la prima volta? Descrivi l'errore e come l'hai corretto.

*Scrivi 2-3 righe:* ___________________________________________

**4. La domanda che non c'era**
Hai una domanda su questo argomento a cui il libro non ha risposto? Scrivila. Se vuoi, cercala online e riporta quello che hai trovato.

*Scrivi 2-3 righe:* ___________________________________________

---

### 🔗 Collegamento con MC-INF-1-02

Sai come il computer rappresenta i dati. La prossima domanda è: come sa cosa farne? Come decide quale operazione eseguire, in quale ordine, con quali dati? Questa è la questione degli algoritmi — e la affronti subito nella MC-INF-1-02.

---

## APPENDICE — Tech in English

**Termini tecnici di questa MC in inglese**

| Italiano | English | Come si legge |
|----------|---------|---------------|
| cifra binaria | bit (binary digit) | /bɪt/ |
| byte | byte | /baɪt/ |
| sistema binario | binary system | /ˈbaɪnəri ˈsɪstəm/ |
| pixel | pixel | /ˈpɪksəl/ |
| codifica | encoding | /ɪnˈkəʊdɪŋ/ |
| compressione | compression | /kəmˈprɛʃən/ |
| risoluzione | resolution | /ˌrɛzəˈluːʃən/ |
| profondità di colore | color depth / bit depth | /ˈkʌlə dɛpθ/ |

> *In English we say: "A 12-megapixel photo contains 12 million pixels, each described by 3 bytes of color data" — una foto da 12 megapixel contiene 12 milioni di pixel, ognuno descritto da 3 byte di dati colore.*
>
> *"The binary system uses only two digits: 0 and 1" — il sistema binario usa solo due cifre: 0 e 1.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- 📖 ESPLORA: colonna sinistra per il testo espositivo. Colonna destra per la tabella dei numeri decimale/binario e l'infografica pixel RGB.
- Il box "Collegamento STEM — Matematica" va come sidebar con sfondo colorato differenziato (colore matematica).
- La tabella ASCII in 🔬 SPERIMENTA livello base può essere stampata su carta separata / ritagliabile.
- 🌍 AGISCI: la tabella delle opzioni di scansione va in evidenza grafica. La scheda dei passi 1-4 va come foglio fotocopiabile separato.

**Per l'agente generatore asset:**
- Visual richiesto 1: infografica "pixel ingrandito — sistema RGB" — un pixel diviso in 3 canali R, G, B con i valori numerici e la corrispondente sequenza binaria. Formato PNG 800×600.
- Visual richiesto 2: tabella comparativa "dimensioni dei file" — testo grezzo vs compresso per foto, audio, video. Formato PNG 1000×400.
- Visual richiesto 3: timeline "da Leibniz ai transistor moderni" — 1703 → 1947 (invenzione transistor) → 1971 (primo microprocessore Intel 4004) → 2023 (3 nm). Formato PNG 1200×300.
- Hook audio: già disponibile in MC-INF-1-01_hook-script.md.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: Hypertech 2020 · originale · Allineata IN 2025 (D.M. n. 221/2025)*
*Contenuto espanso su indicazione editoriale — tutte e 5 le zone libro-ready*
