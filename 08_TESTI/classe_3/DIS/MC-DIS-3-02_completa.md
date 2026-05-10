# MC-DIS-3-02 — Il disegno che si modifica: CAD, modellazione 3D e stampa digitale
**Area:** Disegno Tecnico · **Anno:** 3ª · **Livello DigComp:** Advanced (A)
**SDG:** 4 — Istruzione di qualità · 9 — Innovazione · **Fonte:** originale
**Struttura:** 4 pagine (MC Advanced) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **Nessun hook audio preregistrato — Zona 1 narrativa**

**Scenario di avvio:**

Sara Conte ha 28 anni e lavora come progettista per una piccola azienda che produce componenti per biciclette da corsa. Questa mattina ha ricevuto un messaggio: un team di ciclisti ha segnalato che il portaborraccia che la sua azienda produce tende a vibrare e a rilasciare la borraccia sulle strade sterrate.

Sara apre Fusion 360 sul suo computer. Seleziona il file del portaborraccia — un modello 3D che aveva progettato sei mesi fa. Modifica un parametro: il diametro dei pin di bloccaggio, da 3 mm a 3,6 mm. Il software aggiorna automaticamente tutte le parti che dipendono da quel parametro: le sedi dei pin, le tolleranze, le viti di fissaggio.

Quindici minuti dopo esporta il file in formato STL e lo manda alla stampante 3D del laboratorio. Tre ore dopo ha un prototipo fisico tra le mani.

Sei mesi fa, prima del CAD parametrico, lo stesso processo avrebbe richiesto una settimana: ridisegnare il componente a mano, produrre un modello in argilla, aspettare che il fornitore producesse il pezzo con lo stampo modificato.

Questa MC ti insegna come funziona quello che Sara usa ogni giorno.

---

## 📖 ESPLORA

### Storia del CAD: dal tavolo da disegno al cloud

Prima del 1960, ogni disegno tecnico veniva prodotto a mano su carta traslucida o carta da lucido. Un progettista trascorreva ore ad allineare righelli, a correggere con la gomma e a ricopiare intere tavole quando cambiava un'unica misura. Gli studi di progettazione tenevano archivi fisici enormi — scaffalate di tubi di cartone con rotoli di disegni tecnici che andavano recuperati fisicamente ogni volta che servivano.

Il **CAD (Computer-Aided Design)** nasce negli anni Cinquanta nei laboratori del MIT. Il progetto Whirlwind (1951) fu il primo computer a mostrare grafica in tempo reale su un monitor — un oscilloscopio militare adattato. Il vero salto commerciale arrivò nel 1982, quando John Walker e 12 co-fondatori lanciarono **AutoCAD** per il personal computer. Per la prima volta, uno studio di progettazione poteva comprare un programma CAD con meno di 1.000 dollari invece di affittare un mainframe aziendale da centinaia di migliaia.

Da allora l'evoluzione è stata continua:

**Anni 1980 — CAD 2D:** AutoCAD e i suoi concorrenti producevano disegni tecnici digitali in 2D. Il vantaggio principale era la modifica: cambiare una misura significava selezionare una linea e digitare il nuovo valore, non ricopiare il disegno da capo.

**Anni 1990 — CAD 3D solido:** SolidWorks (1993) e Pro/ENGINEER portarono il modello solido 3D: invece di disegnare linee, il progettista creava solidi matematici — sfere, cilindri, prismi — che potevano essere combinati, sottratti, intersecati. Un modello 3D generava automaticamente le proiezioni ortogonali e le sezioni.

**Anni 2000 — Parametric design:** CATIA, SolidWorks e poi Fusion 360 (2013) introdussero la vera rivoluzione: il **design parametrico**. In un modello parametrico, ogni misura è un parametro con un nome e un valore. Le relazioni tra i parametri vengono definite esplicitamente: "il raggio del foro = diametro del pin + 0,2 mm di tolleranza." Cambiare il parametro "diametro pin" aggiorna automaticamente tutti gli elementi che dipendono da esso.

**Anni 2010-oggi — CAD cloud:** Fusion 360, Onshape, Tinkercad operano interamente nel browser o nel cloud. Il file non è sul tuo computer — è su un server accessibile da qualsiasi dispositivo. Il team di progettazione può lavorare in contemporanea sullo stesso modello da città diverse.

---

### CAD 2D vs CAD 3D: quando usare quale

La distinzione tra 2D e 3D non è solo tecnica — è una questione di scopo.

**CAD 2D** è utile per:
- Planimetrie architettoniche (piante di edifici, schemi di impianti)
- Circuiti elettrici
- Schemi idraulici
- Qualsiasi progetto dove la terza dimensione non aggiunge informazione utile

**CAD 3D** è necessario quando:
- Il progetto ha forme complesse che non si capiscono da una pianta
- Si vuole visualizzare l'oggetto prima di costruirlo
- Si deve verificare se due componenti si scontrano nello spazio (clash detection)
- Si vuole esportare per stampa 3D, taglio laser o fresatura CNC
- Si vuole produrre un render fotorealistico

Per questa MC usiamo **Tinkercad** — un CAD 3D cloud gratuito, accessibile da browser, sviluppato da Autodesk. È usato da milioni di studenti e maker in tutto il mondo. Non è il CAD più potente sul mercato, ma insegna i principi fondamentali che si ritrovano in tutti i CAD professionali.

---

### Tinkercad: l'ambiente e la logica

Quando apri Tinkercad, il tuo spazio di lavoro ha tre elementi principali:
- Il **piano di lavoro** (workplane) — la griglia orizzontale grigia che rappresenta il "pavimento" del tuo modello.
- Le **forme primitive** nel pannello laterale — solidi base (cubi, sfere, cilindri, coni, prismi) pronti all'uso.
- La **barra degli strumenti** in alto — per spostare, ruotare, raggruppare, quotare.

La logica di Tinkercad si basa sulla **geometria solida costruttiva (CSG, Constructive Solid Geometry)**: gli oggetti vengono costruiti combinando solidi semplici attraverso tre operazioni:
- **Unione:** due solidi che si sovrappongono diventano un unico solido (il risultato è la somma dei due volumi).
- **Sottrazione:** un solido "foro" (hole) viene sottratto da un solido pieno, scavandoci dentro. È come perforare un parallelepipedo con un cilindro per ottenere un foro.
- **Raggruppamento:** due o più solidi vengono uniti in un componente unico che si sposta e si dimensiona insieme.

---

### Workflow base in Tinkercad: costruire un oggetto passo per passo

Supponiamo di costruire un semplice porta-matite cilindrico con un foro centrale.

**Passo 1 — Piano di lavoro e orientamento:** apri un nuovo progetto. Assicurati di vedere il piano di lavoro dall'alto (vista Home → Dall'alto) per posizionare correttamente le forme.

**Passo 2 — Forma base (cilindro esterno):** trascina un cilindro dal pannello laterale sul piano di lavoro. Clicca sul cilindro e inserisci le dimensioni: raggio 30 mm, altezza 80 mm. Il cilindro rappresenta la parete esterna del porta-matite.

**Passo 3 — Forma da sottrarre (foro interno):** trascina un secondo cilindro sul piano. Dimensioni: raggio 27 mm, altezza 78 mm. Nella finestra proprietà, cambia il tipo da "Solid" a "Hole" — il cilindro diventa rosso semitrasparente. Posizionalo esattamente al centro del primo cilindro, allineato in basso.

**Passo 4 — Allineamento:** seleziona entrambi i cilindri. Usa lo strumento "Allinea" (Align) per centrarli sull'asse X e sull'asse Y. Non devono essere sfalsati.

**Passo 5 — Raggruppamento:** con entrambi selezionati, clicca "Raggruppa" (Ctrl+G). Il cilindro foro scompare e lascia una cavità nel cilindro esterno. Hai ottenuto un tubo cavo — la struttura base del porta-matite.

**Passo 6 — Base piena:** aggiungi un cilindro piatto (raggio 32 mm, altezza 5 mm) sotto il tubo per chiudere il fondo. Allinea e raggruppa.

**Passo 7 — Verifica dimensioni:** con l'oggetto selezionato, usa lo strumento "Ruler" per verificare che le misure siano corrette.

**Passo 8 — Esportazione:** File → Esporta → STL. Il file STL è pronto per la stampante 3D.

---

### Dal modello 3D alla stampa 3D: il percorso del file

Avere un file STL è solo il primo passo. Prima che la stampante 3D inizi a lavorare, il file deve passare attraverso un software chiamato **slicer** (letteralmente "affettatore").

**Cosa fa lo slicer:** legge il modello 3D solido e lo "affetta" orizzontalmente in centinaia o migliaia di strati sottili (layer). Per ogni strato genera le istruzioni di movimento della testina di stampa (il file G-code). Il slicer più usato a livello educativo è **Ultimaker Cura** — è gratuito e open source.

**I parametri principali dello slicer:**

**Layer height (altezza del layer):** lo spessore di ogni strato. Un layer di 0,1 mm produce superfici molto lisce ma richiede molto più tempo di stampa. Un layer di 0,3 mm è più veloce ma la superficie mostra le "rigature" degli strati. Per oggetti funzionali (non decorativi) 0,2 mm è spesso il buon compromesso.

**Infill (riempimento interno):** la percentuale del volume interno dell'oggetto che viene riempita di materiale. Un infill del 100% è solido ma pesante e usa molto materiale. Un infill del 20% è molto più leggero e usa meno materiale mantenendo una buona resistenza strutturale — l'interno ha una struttura a nido d'ape o a griglia. Per un porta-matite che non deve reggere carichi pesanti, 15-20% di infill è sufficiente.

**Supports (supporti):** le parti del modello che "sporgono" in orizzontale senza niente sotto (overhang) non possono essere stampate senza supporti — il filamento plastico non può essere depositato in aria. Lo slicer genera automaticamente strutture di supporto temporanee che vengono rimosse dopo la stampa. Progettare l'oggetto in modo da minimizzare gli overhang è una competenza del buon progettista CAD.

**Material (materiale):** il filamento più usato nell'educazione è il **PLA (acido polilattico)** — è economico, si stampa a basse temperature (190-220°C), non richiede un piano riscaldato, e soprattutto è biodegradabile in condizioni di compostaggio industriale. Rispetto ad altri filamenti come ABS o PETG, il PLA è meno resistente al calore (si deforma sopra i 60°C) ma è molto più facile da gestire.

---

### Prototipazione rapida: la rivoluzione silenziosa della manifattura

Il concetto di **prototipazione rapida** (rapid prototyping) nasce negli anni 1980 con l'invenzione della stereolitografia (SLA) da parte di Chuck Hull nel 1984 — la prima stampante 3D commerciale. L'idea era semplice e rivoluzionaria: invece di produrre un prototipo con metodi tradizionali (tornitura, fresatura, fusione), che richiedevano settimane e costi elevati, si costruisce direttamente dal file digitale in poche ore.

Le implicazioni sono enormi:

**Prima della prototipazione rapida:** un ingegnere Boeing che voleva testare la forma di una staffa strutturale ordinava un prototipo al reparto lavorazioni meccaniche. Tempi: 4-6 settimane. Costo: 500-2.000 euro. Poteva permettersi 2-3 iterazioni al massimo.

**Dopo la prototipazione rapida:** lo stesso ingegnere stampa la staffa in plastica la stessa mattina in 4-6 ore. Non può fare test strutturali reali (la plastica non ha le proprietà dell'acciaio), ma può verificare l'ingombro, l'accessibilità per le viti, l'interfaccia con i componenti adiacenti. Può fare 10-15 iterazioni prima di ordinare il pezzo in metallo.

Questo cambia completamente il ciclo di sviluppo prodotto: più iterazioni in meno tempo significa prodotti migliori, meno errori costosi nelle fasi avanzate, e team di progettazione più piccoli che possono fare il lavoro di team molto più grandi.

La stampa 3D oggi non è solo uno strumento di prototipazione: in settori come le protesi mediche personalizzate, il design dentale, l'aerospazio, i componenti vengono già prodotti definitivamente in stampa 3D — non solo come prototipi.

---

### Cenno al design parametrico: cambiare un parametro cambia tutto

Nel **design parametrico**, il modello non è un insieme di misure fisse — è un insieme di relazioni. Ogni dimensione è un parametro con un nome, e tra i parametri si definiscono equazioni.

Esempio: una mensola. I parametri principali potrebbero essere:
- `lunghezza_piano = 300 mm`
- `larghezza_piano = 150 mm`
- `spessore_piano = 18 mm`
- `altezza_supporti = 200 mm`
- `raggio_foro_parete = 5 mm`

Se il cliente chiede una versione più corta, il progettista cambia `lunghezza_piano = 200 mm`. Il software aggiorna automaticamente tutto: le proporzioni, le posizioni dei fori, la distanza tra i supporti.

Il design parametrico è la norma nell'industria perché accelera enormemente le varianti di prodotto: un'azienda che produce mobili può offrire 20 misure diverse dello stesso divano senza ridisegnare nulla — cambia solo i parametri di lunghezza e altezza.

In Tinkercad questa funzionalità è limitata, ma il principio si impara qui. In Fusion 360 o FreeCAD, il design parametrico è al centro del workflow.

---

> **📦 Box Geo-Storia — Come il CAD ha trasformato l'architettura**
>
> Prima del CAD digitale, le forme architettoniche erano vincolate da un fattore invisibile: la difficoltà di calcolare strutture complesse a mano. Le cattedrali gotiche con le loro volte a crociera, i ponti di Eiffel con le travi reticolari di ferro — erano al limite delle possibilità di calcolo manuale. Forme curve complesse erano praticamente impossibili da progettare con precisione.
>
> Con il CAD parametrico degli anni 1990, tutto cambia. Zaha Hadid — la prima donna a vincere il Premio Pritzker, il Nobel dell'architettura, nel 2004 — progettava edifici con forme impossibili da definire con geometrie standard: superfici che si torcono, solai che si inclinano gradualmente, strutture che sembrano fluire. Senza software che gestisse queste forme come superfici matematiche precise e le traducesse in istruzioni per le macchine CNC che tagliavano l'acciaio, i suoi edifici non sarebbero stati costruibili.
>
> Il MAXXI di Roma (2009) — museo nazionale delle arti del XXI secolo — ha solai in cemento armato che corrono in direzioni diverse, si sovrappongono, si intrecciano. La struttura portante è invisibile perché integrata nelle forme curve. Senza il calcolo strutturale assistito da computer, sarebbe crollato in fase di costruzione.
>
> Il CAD non ha solo velocizzato il disegno: ha cambiato i limiti di ciò che è costruibile.

---

### Caso studio: progetta e modella un supporto porta-telefono per il banco — dall'idea al file STL stampabile

Questo è un esercizio reale, non una simulazione. L'obiettivo è costruire un oggetto funzionante — un supporto che tenga il tuo telefono inclinato sul banco per seguire video o fare videochiamate — partendo da zero con Tinkercad.

**Il brief:** supporto per smartphone universale (adatto a telefoni da 6 a 17 cm di altezza), inclinazione fissa a 70° rispetto al piano orizzontale, stabile senza scivolare (base larga), ingombro ridotto.

**Fase 1 — Analisi:** misura il tuo telefono. Identifica due problemi di un supporto generico (suggerimento: inclinazione giusta per guardare video e per fare videochiamate sono diverse; il telefono in orizzontale e in verticale richiede sostegni diversi).

**Fase 2 — Sketch a mano:** prima di aprire Tinkercad, disegna a mano libera 3 versioni del supporto. Indica le misure approssimative e il materiale. Scegli quella che ti sembra più fattibile.

**Fase 3 — Modellazione in Tinkercad:**
1. Costruisci la base: un parallelepipedo piatto (es. 90 × 60 × 8 mm) — più è larga, più il supporto è stabile.
2. Costruisci il sostegno posteriore: un rettangolo verticale inclinato a 70° (usa la funzione "Ruota" di Tinkercad per inclinarlo esattamente).
3. Aggiungi il fermo inferiore: un listello orizzontale nella parte bassa del sostegno che impedisce al telefono di scivolare (sottrai la forma del telefono da questo listello per creare un incavo).
4. Verifica la stabilità geometrica: il baricentro del telefono + supporto deve cadere dentro la base.
5. Raggruppa tutto e verifica le misure finali.

**Fase 4 — Slicing mentale:** prima di esportare, identifica: ci sono parti in overhang maggiore di 45°? Come li gestiresti nello slicer? Quale infill useresti per bilanciare resistenza e risparmio di filamento?

**Fase 5 — Esportazione STL:** File → Esporta → .stl. Descrivi in 3 righe cosa cambieresti nella versione 2.0 dopo aver usato il prototipo fisico (anche ipotetico).

> **🔢 Collegamento STEM — Matematica e Geometria:**
> In Tinkercad, ogni operazione geometrica corrisponde a una operazione sugli insiemi: l'unione è l'unione di insiemi (A ∪ B), la sottrazione è la differenza (A \ B), l'intersezione produce A ∩ B. La geometria solida costruttiva (CSG) è la formalizzazione matematica di quello che fai quando "scavi" un foro in un blocco. Questa è algebra degli insiemi applicata a oggetti fisici tridimensionali.

---

## 🔍 OSSERVA

### Il caso: come la NASA usa la stampa 3D per esplorare Marte

Il rover Perseverance della NASA, atterrato su Marte il 18 febbraio 2021, porta a bordo oltre 50 componenti prodotti con stampa 3D — tra cui alcune parti del sistema di propulsione del drone Ingenuity, il primo velivolo a motore a volare su un altro pianeta.

Perché la stampa 3D è critica per lo spazio? Tre ragioni:

**Peso:** ogni grammo inviato su Marte costa circa 10.000 dollari di carburante. La stampa 3D permette di ottimizzare le strutture con infill interni che riducono il peso mantenendo la resistenza.

**Geometrie impossibili:** alcuni componenti del sistema di raffreddamento di Perseverance hanno canali interni così complessi che non potrebbero essere prodotti per nessun altro metodo. La stampa 3D costruisce dall'interno verso l'esterno — può creare strutture interne impossibili per fresatura o fusione.

**Tempo:** durante la fase di progettazione, ogni componente viene iterato molte volte. La stampa 3D consente di testare fisicamente ogni versione in ore, non in settimane.

Il team di ingegneri che ha progettato Ingenuity ha usato Fusion 360 e CATIA per la modellazione 3D, software di simulazione strutturale per verificare la resistenza delle pale del rotore (che giravano a 2.537 rpm nell'atmosfera rada di Marte), e stampanti 3D industriali per i prototipi. Il processo che hai imparato in questa MC — modello 3D → slicer → file di stampa — è lo stesso che usano, scalato a materiali e tolleranze diverse.

---

> **⚠️ Errore comune — La stampa 3D produce oggetti definitivi:**
> La stampa 3D con filamento plastico (FDM) produce prototipi e oggetti funzionali in bassa resistenza. Non produce oggetti strutturali definitivi in materiali ingegneristici. Un porta-matite stampato in PLA è perfettamente funzionale. Un telaio di bicicletta stampato in PLA si romperà. La stampa 3D industriale (in titanio, acciaio, fibra di carbonio) esiste e produce componenti definitivi, ma usa macchine che costano centinaia di migliaia di euro e processo completamente diversi.

---

### 👩‍💻 Chi lavora con questa competenza nel 2030?

**Ingegnere di produzione digitale e maker educator**

Il professionista che sa tradurre un problema fisico in un modello CAD — poi in un prototipo stamapato, poi in un prodotto rifinito — lavora in quasi tutti i settori industriali, dalla moda all'aerospazio, dal medicale all'arredamento. Non è un CAD drafter (chi disegna istruzioni di altri): è qualcuno che progetta autonomamente, usa il digitale come strumento di pensiero, non solo di rappresentazione.

Il **maker educator** è la versione educativa: insegna a studenti e adulti a usare FabLab, stampanti 3D, tagliatrici laser, Arduino. È una delle professioni in più rapida crescita nel sistema educativo mondiale — la rete Fab Foundation conta oltre 2.500 FabLab in 100 paesi.

Dove lavorano: aziende manifatturiere, startup hardware, FabLab e makerspaces, scuole tecniche, ospedali (dispositivi medici personalizzati), settore aerospaziale.

Competenze chiave che inizia a costruire da qui: modellazione CAD 3D · geometria solida costruttiva · design parametrico · prototipazione rapida · pensiero iterativo

*"Il file CAD è il punto di partenza. Il prototipo fisico è il punto di arrivo. E poi si ricomincia."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**

---

### ● BASE — Riproduci un oggetto semplice con guida passo a passo

**Obiettivo:** costruire in Tinkercad un oggetto pre-definito seguendo istruzioni dettagliate, usando almeno 2 operazioni (aggiunta + sottrazione).

**Oggetto:** un dado da gioco (cubo con angoli smussati e 6 fori per i punti).

**Guida:**
1. Crea un cubo di 25 × 25 × 25 mm.
2. Crea una sfera "hole" di diametro 30 mm, posizionala al centro del cubo. Raggruppate: otterrai un cubo con le facce leggermente convesse. (*Nota: questo è un approccio semplificato — in Tinkercad usa la forma "Arrotonda" se disponibile, o usa piccoli cilindri "hole" agli spigoli.*)
3. Crea 6 cilindri "hole" di diametro 4 mm e profondità 2 mm — uno per ogni faccia nelle posizioni corrette (1 punto sulla prima faccia, 2 sulla seconda, ecc.).
4. Raggruppa tutto.
5. Verifica le misure finali: il dado deve essere 25 mm in tutte e tre le dimensioni.
6. Esporta in STL.

**Domanda:** quante operazioni booleane hai usato in totale? Conta le addizioni e le sottrazioni separatamente.

---

### ●● INTERMEDIO — Progetta un porta-cuffie da scrivania con vincoli

**Obiettivo:** progettare autonomamente un porta-cuffie da appendere al bordo del tavolo, rispettando i vincoli dati.

**Vincoli:**
- Deve reggere cuffie di peso fino a 400 g.
- Larghezza dell'aggancio al tavolo: regolabile tra 20 e 35 mm (piani di diverso spessore).
- Sporgenza dal tavolo: massimo 15 cm.
- Nessuna vite: deve aggrapparsi solo per gravità o pressione.

**Fasi del lavoro:**
1. Sketch a mano: disegna 3 possibili soluzioni. Per ogni sketch indica il principio fisico che rende l'aggancio stabile.
2. Scegli la soluzione migliore e costruiscila in Tinkercad con almeno 3 operazioni booleane.
3. Annota le misure principali nello sketch (non nel modello 3D: l'abitudine di quotare sul disegno 2D prima di costruire il 3D è corretta).
4. Esporta il file STL.
5. Scrivi 5 righe: quali sono i punti di debolezza del tuo progetto? Cosa cambieresti in una versione 2.0?

---

### ●●● AVANZATO — Brief aperto: dall'idea al file STL documentato

**Brief:** sei stato contattato dal laboratorio di scienze della tua scuola. Il docente ha bisogno di un supporto per il microscopio che permetta di tenere uno smartphone sopra all'oculare per fotografare i vetrini. Il microscopio ha un oculare di diametro 23 mm. Lo smartphone deve potersi rimuovere facilmente senza smontare il supporto.

**Il tuo processo (documenta ogni fase):**

1. **Ricerca:** misura un oculare di microscopio (o trova la misura standard online). Identifica 2 problemi che il supporto deve risolvere oltre al posizionamento (instabilità, difficoltà a centrare l'obiettivo della fotocamera...).

2. **Concept sketching:** 4 idee a mano, con indicazione del principio di aggancio per ognuna.

3. **Selezione motivata:** scegli l'idea migliore e scrivi 3 righe che spiegano perché hai scartato le altre.

4. **Modellazione Tinkercad:** costruisci il modello con almeno 4 operazioni booleane. Il modello deve essere dimensionalmente corretto — non approssimato.

5. **Proiezione ortogonale quotata:** esegui a mano (o con CAD 2D) le tre viste principali con le quote essenziali. Il disegno 2D e il modello 3D devono essere coerenti.

6. **Analisi di stampa:** identifica almeno un overhang problematico nel modello. Descrivi come lo gestiresti nello slicer (supporti, orientamento di stampa diverso, o modifica del design).

7. **Esporta STL + Relazione tecnica:** 10-15 righe che descrivono le scelte di design, le operazioni booleane usate, i problemi risolti e quelli aperti.

> **Sfida ulteriore:** produci due versioni del modello con parametri diversi (oculare 23 mm e oculare 30 mm) variando solo i parametri rilevanti — se Tinkercad non lo supporta direttamente, descrivi come lo faresti in un CAD parametrico.

---

## 🌍 SPERIMENTA — avanzato

### Dal file al prodotto: analisi del ciclo di vita di un oggetto stampato in 3D

Hai imparato a produrre un file STL. Ma cosa succede dopo — durante la vita dell'oggetto e alla sua fine?

**Mappa il ciclo di vita del tuo porta-telefono:**

1. **Materiali e produzione del filamento:** il PLA viene prodotto dall'acido polilattico derivato da amido di mais o canna da zucchero. Dove viene coltivato il mais? Quanta energia serve per trasformarlo in filamento? Chi sono i principali produttori mondiali?

2. **Stampa:** quanta energia consuma una stampante 3D FDM per 3 ore di stampa? (Un dato orientativo: 50-150 watt × 3 ore = 0,15-0,45 kWh). Confrontalo con l'energia per produrre un oggetto equivalente per stampaggio a iniezione (più alta per unità, ma si stampa in milioni di pezzi).

3. **Uso:** per quanto tempo stima durerà il tuo oggetto? Cosa succede se si rompe — si può riparare (stampo un pezzo di ricambio) o si butta tutto?

4. **Fine vita:** il PLA è biodegradabile in condizioni di compostaggio industriale (70°C, umidità controllata, microrganismi specifici). Non è biodegradabile in natura o in discarica normale. Nel tuo comune, esiste una filiera per questo tipo di rifiuto?

Scrivi una scheda di 1 pagina che risponde a queste quattro domande. Indica le fonti che hai usato per i dati.

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | ● Base — Sufficiente | ●● Intermedio — Buono | ●●● Avanzato — Ottimo | ●●●● Eccellente |
|---|---|---|---|---|
| **1. Correttezza del modello CAD** | Il modello è riconoscibile e usa almeno 2 operazioni booleane | Il modello è dimensionalmente corretto e usa almeno 3 operazioni booleane con motivazione | Il modello rispetta tutti i vincoli del brief con tolleranze corrette e il file STL è stampabile senza errori | Il modello include una riflessione sulla stampabilità (overhang, infill, orientamento) e propone almeno una modifica rispetto alla prima versione basata su considerazioni tecniche |
| **2. Documentazione del processo** | Presente almeno uno sketch iniziale | Sketch + modello CAD con note sulle operazioni eseguite | Sketch + sviluppo + proiezione ortogonale quotata + STL con coerenza tra 2D e 3D | Documentazione completa con analisi degli errori commessi e motivazione delle revisioni apportate |
| **3. Pensiero ingegneristico** | L'oggetto è una forma semplice senza evidenza di ragionamento strutturale | L'oggetto mostra almeno una scelta tecnica argomentata (es. base larga per stabilità) | L'oggetto mostra almeno 3 scelte tecniche argomentate con riferimento a proprietà fisiche o geometriche | Identifica autonomamente un problema non previsto nel brief e propone una soluzione ingegneristica documentata |
| **4. Sostenibilità e ciclo di vita** | Non affronta il tema | Indica il materiale e una considerazione generica sul riciclo | Valuta almeno due aspetti del ciclo di vita (produzione, uso, fine vita) con dati o stime | Propone una scelta di materiale o struttura che riduce l'impatto ambientale rispetto alla soluzione più immediata, con argomentazione |

---

### Lo scenario

Il **FabLab della tua città** ha avviato un progetto: raccogliere file STL di oggetti utili per le scuole della provincia, prodotti da studenti delle medie e superiori. Gli oggetti selezionati verranno stampati e donati a scuole che non hanno risorse per comprarli. Il tema: **"Accessibilità e inclusione — oggetti che rendono la scuola più facile per tutti."**

Esempi di oggetti che rispondono al tema: supporto per alzare lo schermo di un computer (riduce affaticamento del collo), guida tattile per la tastiera per studenti con disabilità visiva, porta-foglio inclinato per chi ha difficoltà motorie alle mani, amplificatore acustico senza elettronica per l'ingresso del microfono del PC, supporto per tablet per posizioni di lettura non standard.

---

### La consegna

**Progetta e modella in Tinkercad un oggetto che rende la scuola più accessibile per almeno una categoria di utenti specifica.**

Prima di iniziare, definisci:
- Chi è l'utente (es. "uno studente non vedente", "un docente con mobilità ridotta alla mano sinistra")?
- Quale problema specifico risolve l'oggetto?
- Quali sono i vincoli dimensionali concreti (dove si posiziona l'oggetto, quali misure deve rispettare)?

**Consegna:**
1. Brief di mezza pagina (utente, problema, vincoli).
2. Almeno 2 sketch del concept con annotazioni.
3. Modello 3D in Tinkercad completo e corretto.
4. File STL esportato pronto per la stampa.
5. Proiezione ortogonale quotata delle tre viste principali (può essere a mano).
6. Nota di 5 righe: materiale scelto, motivazione, e cosa succederebbe all'oggetto a fine vita.

---

### Materiali che ti servono

- Computer con accesso a internet (Tinkercad è gratuito, funziona nel browser)
- Foglio A4 e matita per gli sketch
- Righello per le misure
- Facoltativo: nastro di carta e cartoncino per un prototipo fisico rapido prima della modellazione

---

### 🎯 Badge SDG 4 e 9 — Istruzione di qualità e Innovazione

Progettare un oggetto che migliora l'accessibilità scolastica significa applicare concretamente il principio dell'SDG 4 (istruzione di qualità, inclusiva e accessibile) attraverso gli strumenti dell'SDG 9 (innovazione tecnologica). Un file STL ben progettato condiviso con licenza aperta può essere stampato in tutto il mondo — il tuo lavoro può avere un impatto reale.

---

### 🤖 Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona per chiedere all'AI Coach: *"Come si fa l'operazione di sottrazione in Tinkercad?"*, *"Qual è la differenza tra STL e OBJ?"*, *"Come si orienta un oggetto per ridurre i supporti in stampa?"*
Se la risposta è sbagliata, segnalalo: identificare gli errori dei sistemi IA è parte di questa competenza.

---

### 🪞 Metacognizione — Rifletti sul tuo lavoro

**1. Difficoltà tecnica**
Quale operazione in Tinkercad ti ha creato più difficoltà — allineamento, rotazione, subtrazione, raggruppamento? Descrivi esattamente dove ti sei bloccato e come hai risolto.

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Differenza rispetto al disegno a mano**
Hai già disegnato oggetti a mano in anni precedenti. Quali differenze hai notato tra il processo di disegno manuale e la modellazione CAD? Quale trovi più intuitivo per le fasi iniziali? Quale per la precisione finale?

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa**
Il tuo modello aveva almeno un errore che hai dovuto correggere — dimensioni sbagliate, operazione booleana che non funzionava come pensavi, oggetti non allineati. Descrivi l'errore e come lo hai identificato. Cosa ti ha insegnato?

*Questa domanda è obbligatoria. Se non hai incontrato errori, il tuo progetto era probabilmente troppo semplice.*

*Scrivi 3-4 righe:* ___________________________________________

---

**4. Il prototipo fisico**
Immagina di aver stampato fisicamente il tuo oggetto e di averlo usato per una settimana. Elenca tre cose che probabilmente cambieresti nella versione 2.0 — e per ognuna spiega se è un problema di misure, di forma, di materiale o di progettazione strutturale.

*Scrivi 3-4 righe:* ___________________________________________

---

### 🔗 Collegamento con UDA-3 — "Design for Real"

Il file STL che hai prodotto in questa MC è il punto di arrivo dell'UDA-3 se combinato con i disegni tecnici di MC-DIS-3-01 e con l'analisi materiali di MC-MAT-1-03. Il tuo oggetto ha ora una rappresentazione tridimensionale digitale pronta per la produzione. Nella fase UDA, questo file viene revisionato da un compagno (revisione tecnica tra pari) prima dell'eventuale stampa.

---

## APPENDICE — Tech in English

| Italiano | English | Come si legge |
|---|---|---|
| progettazione assistita da computer | computer-aided design (CAD) | /ˌkæd/ |
| operazione booleana | Boolean operation | /ˈbuːliən ˌɒpəˈreɪʃən/ |
| stampa 3D / fabbricazione additiva | 3D printing / additive manufacturing | /ˈædɪtɪv ˌmænjʊˈfæktʃərɪŋ/ |
| riempimento interno | infill | /ˈɪnfɪl/ |
| sporgenza non supportata | overhang | /ˈəʊvəhæŋ/ |

> *In English we say: "The STL file was exported from Tinkercad and sliced in Cura before printing."*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- Zona 2: la storia del CAD va come timeline laterale visiva (1951 → 1982 → 1993 → 2013).
- Il workflow passo per passo di Tinkercad va con screenshot o illustrazioni affiancate — una per ogni passo.
- Il box "Come il CAD ha trasformato l'architettura" va con una foto del MAXXI di Roma come visual principale.
- Zona 4 Avanzato e Zona 4b: fotocopiabili come schede separate.

**Per l'agente generatore asset:**
- Visual richiesto 1: confronto workflow manuale vs. CAD (due colonne: a sinistra il processo tradizionale, a destra il processo digitale, stesso numero di fasi).
- Visual richiesto 2: illustrazione delle 5 operazioni base in Tinkercad (aggiungi, sottrai, allinea, raggruppa, esporta) con icone e screenshot semplificati.
- Visual richiesto 3: infografica parametri di slicing (layer height, infill, supporti) con effetti visivi comparati.
- Hook audio: non disponibile — usare la narrativa della Zona 1 come testo base per produrlo.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025)*
*Livello Advanced (A) — struttura 5 zone + Zona 4b · libro-ready*
