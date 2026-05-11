# MC-DIS-2-01 — Come si disegna un oggetto in modo che chiunque, ovunque, lo costruisca uguale?
**Area:** Disegno Tecnico · **Anno:** 2ª · **Livello DigComp:** Intermediate (I)
**SDG:** 4 — Istruzione di qualità · **Fonte:** Paci 2014
**Struttura:** 4 pagine (MC avanzata) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "IKEA parla senza parole"**
> *Ascolta prima di leggere. Durata: 2 min 22 sec.*
> *(Script completo: MC-DIS-2-01_hook-script.md)*

**Domanda di avvio:**
Hai mai montato un mobile IKEA? Le istruzioni non contengono una sola parola scritta — solo disegni. Eppure milioni di persone in 60 paesi diversi le seguono senza problemi.

Quelle istruzioni usano lo stesso linguaggio tecnico degli ingegneri che progettano aerei e ponti. Adesso imparerai a leggerlo — e a scriverlo.

---

## 📖 ESPLORA

### Una sola forma, tre sguardi diversi

Prendi in mano una tazza. Guardala di fronte: vedi una forma rettangolare. Guardala dall'alto: vedi un cerchio. Guardala di lato: vedi ancora una forma rettangolare, ma stavolta con l'ansa. Tre viste diverse, una sola tazza.

Questo è il problema fondamentale del disegno tecnico: come si rappresenta un oggetto tridimensionale su un foglio di carta che ha solo due dimensioni? Non puoi girare la carta per mostrare l'altro lato. Non puoi far alzare chi legge dal foglio per guardare dall'alto. Devi trovare un sistema che mostri tutto in una volta, in modo preciso, senza ambiguità.

La risposta si chiama **proiezione ortogonale**, ed è il sistema su cui si basa tutto il disegno tecnico industriale nel mondo.

---

### Cos'è una proiezione — e perché "ortogonale"

Immagina una torcia puntata perpendicolarmente su un oggetto contro un muro. L'ombra che si forma sul muro è una **proiezione**. Quella proiezione ha una proprietà importante: ogni punto dell'ombra corrisponde esattamente a un punto dell'oggetto, e le distanze vengono mantenute in scala.

"Ortogonale" significa che i raggi di proiezione sono perpendicolari al piano su cui si proietta. In parole semplici: la torcia è sempre perfettamente di fronte all'oggetto, mai inclinata.

Questo è diverso da quello che succede quando guardi un oggetto reale: la prospettiva li fa sembrare più piccoli man mano che si allontanano, le linee parallele sembrano convergere verso un punto all'orizzonte. La proiezione ortogonale elimina questa distorsione. Ogni dimensione viene mantenuta esatta, indipendentemente da dove si trova nell'oggetto. Per questo è lo strumento della precisione tecnica: quando un ingegnere quota 120 mm su un disegno ortogonale, il costruttore sa con certezza che quella dimensione è 120 mm nell'oggetto reale.

---

### Tre sistemi di rappresentazione: quando si usa quale

Prima di entrare nel dettaglio della proiezione ortogonale, è utile capire perché esistono più sistemi di rappresentazione e quando si sceglie ciascuno.

**Proiezione ortogonale (viste multiple):** la più precisa. Mostra l'oggetto in più viste separate, ognuna ripresa da una direzione perpendicolare. Non si vede la forma tridimensionale in modo intuitivo, ma ogni dimensione è misurabile. Si usa nei disegni di costruzione, nelle tavole tecniche per la produzione industriale, nelle specifiche per i fornitori. Chi deve costruire l'oggetto ha bisogno di questo.

**Assonometria (studiata nella MC-DIS-2-02):** proietta l'oggetto in modo da mostrare tre facce contemporaneamente su un solo piano. Mantiene le misure ma dà un'impressione tridimensionale. Si usa per disegni esplicativi, manuali d'uso, presentazioni. Chi deve capire la forma generale ha bisogno di questo.

**Prospettiva:** simula come l'occhio umano vede davvero. Le linee parallele convergono, le dimensioni si riducono in lontananza. Usata in architettura e design per comunicare l'impatto visivo di un progetto a chi non è tecnico. Non è misurabile, ma è la più intuitiva.

> 💡 **La regola pratica:** proiezione ortogonale per costruire, assonometria per spiegare, prospettiva per convincere.

---

### Il metodo europeo di Monge: le tre viste fondamentali

Il sistema di proiezione ortogonale più usato in Europa (e in Italia) si chiama **metodo di Monge**, dal nome del matematico francese Gaspard Monge che lo sistematizzò nel 1795. È anche chiamato metodo del primo diedro o metodo europeo.

Dal punto di vista geometrico rigoroso, le proiezioni ortogonali sono **proiezioni parallele** nelle quali si immagina che il punto di proiezione si trovi a distanza infinita dall'oggetto — così le linee di proiezione risultano tra loro parallele e perpendicolari al piano di proiezione. Questo le distingue dalla prospettiva, dove il punto di proiezione è vicino e le linee convergono. *(Fonte: SEI, ISBN 9788805079292, p.494)*

In pratica, si collocano tre piani di proiezione perpendicolari tra loro a formare il cosiddetto **triedro**:
- **Piano orizzontale (PO):** la pianta dell'oggetto si proietta qui (vista dall'alto).
- **Piano verticale (PV):** il prospetto si proietta qui (vista frontale).
- **Piano laterale (PL):** il fianco si proietta qui (vista laterale).

I tre piani si intersecano sulle **linee di terra** (LT), che restano visibili sul foglio finale come riferimento per l'allineamento delle viste. *(Fonte: SEI, ISBN 9788805079292, p.526)*

Immagina di mettere l'oggetto all'interno di una scatola trasparente. Le sei pareti della scatola sono sei possibili piani di proiezione. Quando proietti l'oggetto su ogni parete, ottieni sei viste. Poi apri la scatola come una croce e distendi tutto su un foglio piano.

In pratica si usano sempre tre viste fondamentali:

**Vista frontale (prospetto):** l'oggetto visto di fronte. È la vista principale, quella che mostra meglio la forma caratteristica dell'oggetto. Sul foglio si trova al centro-sinistra.

**Vista laterale destra (fianco):** l'oggetto visto dal lato destro. Sul foglio si trova a destra della vista frontale, sulla stessa linea orizzontale.

**Vista dall'alto (pianta):** l'oggetto visto dall'alto, come se guardassi giù su un piano di lavoro. Sul foglio si trova sotto la vista frontale, allineata verticalmente.

> 💡 **Perché usare le proiezioni ortogonali se non mostrano l'oggetto nel suo insieme?** Perché consentono di rappresentare qualsiasi oggetto dettagliatamente, **senza deformazioni** — ogni dimensione è misurabile direttamente sul foglio. Le linee visibili si disegnano con **linea continua**, quelle nascoste (che esistono ma non si vedono dalla direzione della vista) con **linea tratteggiata**. *(Fonte: SEI, ISBN 9788805079292, p.494 e p.525)*

---

### Come si dispongono le viste sul foglio: la regola delle posizioni

La disposizione non è casuale — è una convenzione internazionale che chiunque, in qualsiasi paese europeo, riconosce immediatamente.

```
              ┌─────────────────┐
              │                 │
              │   VISTA ALTO    │
              │    (pianta)     │
              └────────┬────────┘
                       │ allineata verticalmente
┌────────────┐  ┌──────┴───────┐  ┌────────────┐
│            │  │              │  │            │
│ VISTA LAT. │  │ VISTA FRONT. │  │ VISTA LAT. │
│  SINISTRA  │  │  (prospetto) │  │   DESTRA   │
│            │  │              │  │            │
└────────────┘  └──────────────┘  └────────────┘
                       │ allineata verticalmente
              ┌────────┴────────┐
              │                 │
              │  VISTA BASSO    │
              │                 │
              └─────────────────┘
```

La regola fondamentale: **le viste devono essere allineate tra loro**. La vista laterale è sulla stessa linea orizzontale della vista frontale. La vista dall'alto è sulla stessa linea verticale. Questo allineamento non è decorativo: serve a leggere le corrispondenze tra le viste, che è il cuore della competenza.

In pratica, su quasi tutti i disegni tecnici si usano le tre viste fondamentali (frontale, laterale destra, dall'alto). Le altre tre si aggiungono solo quando l'oggetto ha caratteristiche particolari che non si vedono nelle prime tre.

---

### Le linee del disegno tecnico: un codice grafico preciso

In un disegno tecnico, non tutte le linee sono uguali. Il tipo di linea comunica informazioni diverse, e usarle in modo sbagliato è come scrivere una parola con le lettere sbagliate.

**Linea continua grossa (0,5–0,7 mm):** contorno visibile dell'oggetto, gli spigoli che si vedono dalla direzione di osservazione di quella vista. È la linea più importante.

**Linea continua sottile (0,18–0,25 mm):** linee ausiliarie, linee di quota, assi di simmetria, tratteggio delle sezioni.

**Linea tratteggiata (0,25–0,35 mm):** spigoli e superfici nascosti, non visibili dalla direzione di osservazione di quella vista ma presenti nell'oggetto. Sono fondamentali per rappresentare fori, cavità, passaggi interni senza dover fare una sezione.

**Linea mista (tratto-punto):** asse di simmetria o asse di un elemento circolare (come un foro). Indica che l'oggetto è simmetrico rispetto a quella linea o che lì c'è un asse.

> **Collegamento STEM — Matematica:**
> La proiezione ortogonale è una funzione matematica nel senso preciso del termine. Prende un punto nello spazio tridimensionale (x, y, z) e lo trasforma in un punto su un piano bidimensionale. La proiezione sul piano frontale XZ elimina la coordinata Y: il punto (x, y, z) diventa (x, z). La proiezione sul piano orizzontale XY elimina la coordinata Z: il punto (x, y, z) diventa (x, y). È una funzione da ℝ³ a ℝ² — e come ogni funzione, non è invertibile: da una sola vista non puoi risalire all'oggetto 3D. Hai bisogno di almeno due viste per recuperare tutte e tre le coordinate.

---

### Come si legge un disegno a viste multiple: risalire dalla 2D alla 3D

Leggere un disegno ortogonale significa fare il percorso inverso: partire dalle viste bidimensionali e ricostruire mentalmente la forma tridimensionale. È una competenza che si acquisisce con la pratica, ma ci sono strategie precise.

**Strategia delle corrispondenze:** ogni punto visibile in una vista deve avere la sua corrispondenza nelle altre viste. Se nella vista frontale c'è uno spigolo verticale a 30 mm dal bordo sinistro, nella vista dall'alto ci sarà una linea a 30 mm dal bordo sinistro (stessa distanza orizzontale). Se nella vista frontale c'è un dettaglio a 40 mm dall'alto, nella vista laterale ci sarà lo stesso dettaglio a 40 mm dall'alto (stessa quota verticale).

**Procedura passo per passo:**
1. Guarda la vista frontale: capisce la forma generale dell'altezza e della larghezza.
2. Guarda la vista dall'alto: capisce la profondità e la larghezza.
3. Guarda la vista laterale: capisce l'altezza e la profondità.
4. Cerca le corrispondenze tra le tre viste per identificare ogni parte dell'oggetto.
5. Disegna mentalmente (o su carta) la forma 3D che rispetta tutte e tre le viste contemporaneamente.

**Il test della coerenza:** se le tre viste sono corrette, ogni dimensione deve comparire in almeno due viste. Se trovi una linea in una sola vista senza corrispondenze nelle altre, c'è un errore nel disegno.

---

### Le sezioni: vedere l'interno senza smontare

Un oggetto può avere cavità, fori, passaggi interni che non si vedono dall'esterno. Le linee tratteggiate li indicano, ma se l'interno è complesso, il disegno diventa illeggibile.

La soluzione è la **sezione**: un piano di taglio immaginario che "taglia" l'oggetto per mostrarne l'interno. Non si tratta di tagliare davvero l'oggetto — è una convenzione grafica.

**Come si indica una sezione:**
1. Si traccia il **piano di taglio** (o piano di sezione) con una linea mista grossa, interrotta nei punti mediani e rafforzata agli estremi.
2. Si aggiungono due frecce perpendicolari al piano di taglio, che indicano la direzione di osservazione della sezione (verso quale lato guardo dopo il taglio).
3. Si etichetta il piano con due lettere uguali: A-A, B-B, C-C... Se ci sono più sezioni, ognuna ha la sua coppia di lettere.
4. Si disegna la vista in sezione in un'altra posizione sul foglio, etichettandola "SEZIONE A-A" o con le frecce corrispondenti.

**Il tratteggio UNI:** la parte dell'oggetto che è stata "tagliata" dal piano di sezione viene riempita con un **tratteggio** — linee sottili parallele inclinate a 45° rispetto all'asse orizzontale. Lo standard UNI (norma UNI 8187) definisce il passo del tratteggio in base alle dimensioni della sezione.

Se la sezione mostra parti di due componenti diversi in contatto (es. un bullone dentro un foro), i tratteggi dei due componenti devono avere inclinazioni diverse (es. 45° e 135°, oppure passo diverso) per distinguerli visivamente.

**Linee che non si sezionano mai:** per convenzione, alcuni elementi non vengono mai sezionati anche se il piano di taglio li attraversa: bulloni, chiodi, alberi, razze di ruote. Vengono sempre disegnati interi.

**Sezione totale:** il piano di taglio attraversa tutto l'oggetto da parte a parte.

**Sezione parziale (o a strappo):** il piano di taglio attraversa solo una parte dell'oggetto. La linea di confine tra la parte sezionata e la parte non sezionata è una linea a mano libera irregolare (non una linea retta con strumenti).

**Semisezione:** usata su oggetti simmetrici. Si mostra metà dell'oggetto in vista esterna e metà in sezione, con l'asse di simmetria come linea di confine. Permette di comunicare contemporaneamente la forma esterna e quella interna sullo stesso disegno.

---

### Le convenzioni grafiche complete: il linguaggio visivo del tecnico

**Linee di simmetria:** indicate dall'asse misto (tratto-punto sottile), segnalano che l'oggetto è simmetrico rispetto a quell'asse. Non è necessario disegnare entrambi i lati di un oggetto simmetrico: basta disegnare metà con l'asse di simmetria, e chi legge capisce che l'altro lato è speculare.

**Raccordi e smussi:** quando due superfici si incontrano con un angolo arrotondato (raccordo) o con una piccola faccia inclinata (smusso), questo deve essere indicato esplicitamente. Un raccordo si indica con la lettera R seguita dal raggio (es. R5 = raccordo di raggio 5 mm). Uno smusso si indica con la misura dell'altezza per la misura della larghezza o con l'angolo (es. 2×45°).

**La quotatura (approfondita in MC-DIS-2-02):** le quote (misure) sono indicate con linee di quota parallele alla dimensione misurata, linee di riferimento perpendicolari all'oggetto, e il valore numerico al centro della linea di quota. Il cartiglio in basso a destra del foglio riporta il nome del progettista, la data, la scala, il titolo del disegno, il materiale.

---

> **Caso studio — Come Apple comunica ai fornitori**
>
> Quando Apple progetta un nuovo iPhone, ogni singolo componente viene disegnato in proiezione ortogonale con quote precise. Questi disegni tecnici vengono inviati ai fornitori in Cina, Giappone, Corea e Taiwan che devono produrre le singole parti.
>
> La custodia in alluminio, per esempio, ha una tavola tecnica con decine di viste, sezioni e quote. Ogni quota ha una tolleranza: la custodia del modello recente deve rispettare dimensioni con tolleranze di ±0,01 mm — un centesimo di millimetro. Quella precisione è possibile solo perché il disegno tecnico è un linguaggio condiviso, con regole uguali in tutti i paesi che firmano le norme ISO.
>
> Senza la proiezione ortogonale, Apple non potrebbe far costruire pezzi in fabbrica in Cina che poi si montano perfettamente in un'altra fabbrica in Irlanda. Il linguaggio universale del disegno tecnico è letteralmente ciò che rende possibile la produzione industriale globale.

---

## 🔍 OSSERVA

### Il caso: leggere le tavole tecniche di un connettore USB-C

Scegli un oggetto piccolo e comune: il connettore USB-C. È il connettore che si usa per caricare smartphone, laptop, tablet. Sembra semplice dall'esterno — un piccolo rettangolo arrotondato — ma la sua tavola tecnica è un documento di diversi fogli con decine di viste, sezioni e quote.

**Perché è interessante per capire le proiezioni ortogonali:**

Il connettore USB-C è stato progettato per essere reversibile: funziona sia inserito in un verso che nell'altro. Questa simmetria deve essere comunicata nel disegno. La vista frontale mostra la forma esterna. La sezione longitudinale (A-A) mostra i contatti interni e la geometria della guida. La sezione trasversale (B-B) mostra la forma del canale di inserimento.

Solo leggendo tutte le viste insieme si capisce perché il connettore funziona in entrambi i versi: internamente, la struttura è simmetrica rispetto a un piano orizzontale. Questa simmetria si vede chiaramente nella sezione trasversale — e non si potrebbe intuire guardando solo l'esterno dell'oggetto.

**Cosa succede quando il disegno è sbagliato:**

Nel 2014, la specifica tecnica del connettore USB-C fu pubblicata in una versione che conteneva un ambiguità nella quotatura. Alcuni produttori la interpretarono in modo diverso da altri. Il risultato: cavi USB-C prodotti da un fornitore non funzionavano con i dispositivi di un altro. Basta un millimetro di differenza nella posizione dei contatti interni per rendere un connettore inutile — o peggio, per bruciare il dispositivo a cui è collegato.

---

> **Errore comune:**
> "Se disegno bene la vista frontale, le altre vengono da sé." Sbagliato. Le viste non sono indipendenti — devono essere coerenti tra loro. Un errore in una vista genera errori a catena nelle altre. La procedura corretta è disegnare tutte e tre le viste contemporaneamente, tracciando prima le linee di corrispondenza che le collegano, e verificando l'allineamento dopo ogni tratto significativo.

---

### Chi lavora con questa competenza nel 2030?

**Progettista meccanico CAD**

Il progettista meccanico crea le tavole tecniche degli oggetti che verranno prodotti. Oggi quasi sempre lavora con software CAD 3D (Autodesk Inventor, SolidWorks, Catia) che generano automaticamente le viste ortogonali dal modello tridimensionale. Ma per impostare correttamente il modello, scegliere le viste, definire le sezioni giuste e verificare la correttezza delle quote, deve conoscere a fondo le regole della proiezione ortogonale.

Un progettista che non conosce le basi del disegno tecnico non riesce a interpretare i risultati del software, non sa riconoscere un errore nelle viste generate automaticamente, e non sa comunicare con i fornitori che producono le parti fisiche.

Dove lavora: studi di ingegneria, uffici tecnici di aziende manifatturiere, studi di design industriale, aziende di automotive, elettronica di consumo, medicale.

Competenze che inizia a costruire da qui: proiezioni ortogonali · quotatura UNI/ISO · lettura di tavole tecniche · software CAD 2D e 3D

*"Il disegno tecnico è il contratto tra chi progetta e chi costruisce. Se il contratto è ambiguo, il risultato non funziona."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in 🌍 AGISCI.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### BASE — Leggo e riconosco le tre viste

**Obiettivo:** saper collegare le tre viste ortogonali di un solido semplice e riconoscere la corrispondenza tra le viste.

**Materiali che ti servono:** matita, righello, questa pagina. (Opzionale: una scatola di cartone piccola o un gomma da cancellare come modello fisico.)

**Attività:**

Osserva il parallelepipedo rettangolo qui sotto (disegnato in tre viste). Le dimensioni sono: larghezza 60 mm, altezza 40 mm, profondità 30 mm.

```
        [VISTA DALL'ALTO]
        ┌──────────────────────┐
        │                      │  ← 60 mm
        └──────────────────────┘
                30 mm

[VISTA FRONTALE]         [VISTA LATERALE DX]
┌──────────────────────┐  ┌──────────────┐
│                      │  │              │
│                      │  │              │  ← 40 mm
│                      │  │              │
└──────────────────────┘  └──────────────┘
        60 mm                  30 mm
```

**Domande guida:**

1. La vista frontale mostra quali due dimensioni? (larghezza e altezza / larghezza e profondità / altezza e profondità?)

2. La vista dall'alto mostra quali due dimensioni?

3. La vista laterale mostra quali due dimensioni?

4. Perché la vista frontale e la vista laterale devono essere alla stessa altezza sul foglio?

5. Disegna (a mano libera o con righello, a scelta) le tre viste di un cubo con lato 40 mm. Usa la stessa disposizione.

> ⚠️ **Suggerimento:** se hai difficoltà a immaginare la forma, prendi un oggetto rettangolare (gomma, libro piccolo, astuccio) e guardalo nelle tre direzioni tenendolo fisso sul banco.

> 💡 **Linee tratteggiate:** in questo esercizio non ci sono superfici nascoste, quindi non servono linee tratteggiate. Le vedremo nell'esercizio successivo.

---

### INTERMEDIO — Disegno le tre viste di un solido con foro

**Obiettivo:** saper disegnare le tre viste di un solido non elementare, usando correttamente le linee tratteggiate per le superfici nascoste.

**Materiali che ti servono:** foglio A4, matita, righello, compasso.

**Il solido:**

Un parallelepipedo di 80×50×30 mm con un foro cilindrico passante (che attraversa da parte a parte) di diametro 20 mm, centrato sulla faccia frontale, asse orizzontale parallelo alla profondità.

**Procedura passo per passo:**

1. Scegli la disposizione delle viste sul foglio (segui le posizioni standard).

2. Inizia dalla vista frontale: disegna il rettangolo esterno (80×50 mm). Aggiungi il cerchio del foro (⌀20 mm, centrato sul rettangolo). Aggiungi l'asse di simmetria del cerchio (linea mista sottile).

3. Passa alla vista dall'alto: il parallelepipedo appare come un rettangolo (80×30 mm). Il foro non è visibile da sopra — ma la sua presenza si vede come due linee tratteggiate orizzontali (i bordi del cilindro visti dall'alto). Le tratteggiate sono allineate verticalmente con il cerchio della vista frontale.

4. Passa alla vista laterale: il parallelepipedo appare come un rettangolo (30×50 mm). Vedi il foro passante: l'entrata e l'uscita del cilindro sono indicate da due linee tratteggiate verticali allineate con il cerchio della vista frontale.

5. Verifica l'allineamento: traccia linee leggere di corrispondenza tra le viste per controllare che ogni elemento sia nella posizione corretta.

**Domanda di riflessione:** perché il foro appare come cerchio nella vista frontale, ma come linee tratteggiate nelle viste dall'alto e laterale? Scrivi una risposta in 2-3 righe.

---

### AVANZATO — Tavola tecnica completa con sezione

**Scenario:** sei il tecnico disegnatore di una piccola azienda. Il progettista ti consegna un oggetto fisico (o la sua descrizione precisa) e ti chiede di produrre la tavola tecnica completa, comprensiva di sezione, per inviarlo al fornitore che deve produrlo in serie.

**Il solido da disegnare:**

Un prisma a base quadrata (40×40 mm di base, 60 mm di altezza) con un foro cilindrico cieco (non passante) di ⌀24 mm, profondo 35 mm, centrato sulla faccia superiore e con asse verticale. Tutti i bordi superiori sono smussati di 3 mm (smusso 3×45°).

**Il tuo compito:**

1. Disegna le tre viste ortogonali standard (frontale, laterale destra, pianta) rispettando le convenzioni sulle linee (continue per visibili, tratteggiate per nascosti, assi misti per i cerchi).

2. Esegui la sezione A-A passante per l'asse verticale del foro. Indica il piano di sezione sulla vista frontale con le frecce e l'etichetta corrette. Disegna la vista in sezione con il tratteggio UNI a 45°.

3. Compila un cartiglio semplice (angolo in basso a destra del foglio) con: titolo del disegno, data, tuo nome, scala (1:1 se disegni in scala reale, o la scala che scegli con indicazione), materiale (suggerito: alluminio).

4. **Domanda aperta:** perché per questo solido la sezione è più informativa delle sole viste? Cosa si vede nella sezione che non si riuscirebbe a comunicare con le sole linee tratteggiate?

> **Per chi vuole andare oltre:** usa LibreCAD (software gratuito e open source) per riprodurre lo stesso disegno in digitale. Confronta la tavola manuale con quella digitale: quali errori hai trovato passando da una all'altra?

---

## 🌍 AGISCI

---

### Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | Base — Sufficiente | Intermedio — Buono | Avanzato — Ottimo |
|----------|-------------------|-------------------|------------------|
| **1. Disposizione e allineamento delle viste** | Le tre viste sono presenti sul foglio nella posizione approssimativamente corretta | Le tre viste sono nella posizione standard con allineamento verificato tra frontale, laterale e pianta | Le tre viste sono perfettamente allineate; le linee di corrispondenza sono tracciate o verificabili; eventuali viste aggiuntive sono correttamente posizionate |
| **2. Correttezza delle linee** | Usa linee continue per i contorni visibili; tenta di usare linee tratteggiate per i nascosti | Usa correttamente linee continue per visibili, tratteggiate per nascosti, linea mista per assi | Usa tutti i tipi di linea con spessori differenziati (grossa/sottile); la sezione è tratteggiata secondo UNI; non ci sono linee superflue |
| **3. Sezione** | La sezione è presente con il piano di taglio indicato, anche se la rappresentazione ha imprecisioni | La sezione è corretta con piano di taglio etichettato A-A, frecce di direzione, tratteggio presente | La sezione è corretta e completa; il tratteggio segue le norme UNI; la vista in sezione è posta nella posizione corretta rispetto al piano di taglio |
| **4. Leggibilità e completezza del disegno** | Il disegno comunica la forma dell'oggetto, anche se mancano alcuni elementi del cartiglio | Il disegno è leggibile, il cartiglio è compilato con nome, data e scala | Il disegno è professionale: cartiglio completo, dimensioni chiaramente leggibili, il foglio è ordinato e il disegno è centrato |

---

### Lo scenario

Il laboratorio di tecnologia della tua scuola ha ricevuto una commissione insolita: la bidella ha trovato in un cassetto un oggetto di cui nessuno conosce la funzione o le misure — probabilmente era il componente di qualcosa, forse una guida o un supporto. Il preside vuole che venga documentato tecnicamente: se un giorno si rompe, bisogna poterlo rifare.

Il tuo compito è produrre la tavola tecnica di quell'oggetto — o di un oggetto semplice di tua scelta — come se dovesse essere inviata a un'officina per essere riprodotta.

---

### La consegna

**Scegli un oggetto semplice e geometrico** di dimensioni non superiori a 15×10×10 cm. Buone scelte: una gomma da cancellare, una scatola di cartoncino, il tappo di un pennarello, un gessetto, un dado metallico.

Evita oggetti con forme curve complesse o con molti dettagli piccoli — le complicazioni geometriche vanno oltre questa MC.

**Produzione della tavola tecnica:**

1. Misura l'oggetto con un righello o un calibro. Annota le dimensioni su una scheda di misura prima di disegnare.

2. Scegli la scala appropriata: se l'oggetto è piccolo, puoi disegnarlo in scala 2:1 (ingrandito al doppio). Se è grande, in scala 1:2 (ridotto a metà). Indica la scala nel cartiglio.

3. Disegna le tre viste ortogonali standard rispettando le posizioni e le convenzioni sulle linee.

4. Se l'oggetto ha una cavità o un foro, esegui una sezione A-A per mostrarne l'interno.

5. Compila il cartiglio con almeno: titolo, data, tuo nome, scala, materiale (osservato o stimato).

**Materiali che ti servono:** foglio A3 o A4 (se l'oggetto è piccolo), matita, righello, compasso (se ci sono elementi circolari), gomma, eventualmente righello a T o squadra.

---

### Badge SDG 4 — Istruzione di qualità

Il disegno tecnico è un linguaggio universale che non ha barriere linguistiche: un ingegnere in Italia e uno in Giappone leggono la stessa tavola tecnica perché entrambi conoscono le norme ISO. Imparare a produrlo e a leggerlo è accedere a un sistema di comunicazione condiviso da milioni di professionisti nel mondo — ed è questo che significa istruzione di qualità nel senso dell'SDG 4.

---

### Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona e chiedi all'AI Coach:
- *"Come disegno un foro cilindrico nella vista dall'alto?"*
- *"In che direzione va il tratteggio di una sezione?"*
- *"Come faccio a sapere se le mie viste sono allineate correttamente?"*

L'AI Coach risponde solo su questa MC. Se fa un errore, segnalalo: verificare le risposte di un sistema AI è competenza digitale.

---

### Metacognizione — Rifletti sul tuo lavoro

Rispondi a queste domande **dopo** aver consegnato il disegno. Non c'è una risposta giusta.

**1. Sorpresa**
Mentre misuravi l'oggetto e cercavi di disegnarlo, hai trovato qualcosa che non riuscivi a rappresentare con le tre viste? Una forma curva, un angolo strano, un dettaglio troppo piccolo? Come hai risolto?

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Difficoltà e soluzione**
Quale delle tre viste è stata più difficile da disegnare? Perché pensi sia stata quella? Hai cambiato qualcosa nel tuo approccio durante il lavoro?

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa**
C'è stato un momento in cui hai disegnato una linea e poi l'hai cancellata perché non era quella giusta? Descrivi che tipo di linea era e come hai capito che era sbagliata — era una linea nel posto sbagliato, del tipo sbagliato, o nella vista sbagliata?

*Cosa ti ha fatto capire che avevi sbagliato? Come hai corretto?*

*Scrivi 2-3 righe:* ___________________________________________

---

**4. Connessione con la tua vita**
Hai visto in casa, sui mobili, sugli elettrodomestici o sulle istruzioni di qualcosa un disegno tecnico che adesso riesci a riconoscere come proiezione ortogonale? Descrivilo: quante viste aveva? C'era una sezione?

*Scrivi 2-3 righe:* ___________________________________________

---

### Collegamento con MC-DIS-2-02 — Quotatura

La tavola tecnica che hai prodotto adesso manca di un elemento essenziale: le quote. Un artigiano che guardasse il tuo disegno vedrebbe la forma dell'oggetto, ma non saprebbe le dimensioni esatte. Nella prossima MC imparerai le regole della quotatura UNI: dove mettere i numeri, come evitare ambiguità, e come fare in modo che il tuo disegno sia davvero un documento tecnico completo.

Conserva il disegno che hai fatto qui: lo utilizzerai nella MC-DIS-2-02 per aggiungere la quotatura corretta.

---

## APPENDICE — Tech in English

**Termini tecnici di questa MC in inglese**

| Italiano | English | Come si legge |
|----------|---------|---------------|
| proiezione ortogonale | orthographic projection | /ˌɔːθəˈɡræfɪk prəˈdʒekʃən/ |
| vista frontale | front view / elevation | /frʌnt vjuː/ |
| pianta (vista dall'alto) | top view / plan view | /tɒp vjuː/ |
| sezione | cross-section | /ˈkrɒs ˌsekʃən/ |
| tratteggio | hatching | /ˈhætʃɪŋ/ |
| cartiglio | title block | /ˈtaɪtl blɒk/ |

> *In English we say: "The front view shows the height and width of the object" — la vista frontale mostra l'altezza e la larghezza dell'oggetto.*
>
> *"The cross-section reveals the internal geometry" — la sezione mostra la geometria interna.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- 📖 ESPLORA: il diagramma delle posizioni delle viste va come infografica a tutta colonna con sfondo colorato tenue.
- La tabella dei tipi di linea va come sidebar con esempi grafici reali delle linee.
- Il caso studio Apple va come box evidenziato con sfondo scuro.
- 🔬 SPERIMENTA: le istruzioni del livello Avanzato includono riferimento al software LibreCAD — aggiungere QR code al sito di download.
- La rubrica in 🌍 AGISCI va su pagina separata (fotocopiabile / scaricabile con QR).

**Per l'agente generatore asset:**
- Visual richiesto 1: schema animato della "scatola che si apre" (metodo di Monge) — cubo trasparente con l'oggetto dentro, piani che si aprono nelle tre viste. Formato PNG 1200×900 + GIF animata per l'app.
- Visual richiesto 2: tabella dei tipi di linea con esempi grafici (continua grossa, continua sottile, tratteggiata, mista). Formato PNG.
- Visual richiesto 3: esempio di sezione A-A con piano di taglio, frecce, tratteggio e vista in sezione affiancati. Formato PNG.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: Paci 2014 · Allineata IN 2025 (D.M. n. 221/2025)*
*Contenuto espanso su indicazione editoriale — tutte e 5 le zone libro-ready*
