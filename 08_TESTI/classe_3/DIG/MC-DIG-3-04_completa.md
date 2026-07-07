# MC-DIG-3-04 — Il web è per tutti? Accessibilità digitale e inclusione
**Area:** Digitale · **Anno:** 3ª · **Livello DigComp:** Advanced (A)
**SDG:** 10 — Ridurre le disuguaglianze; 16 — Pace, giustizia e istituzioni solide
**Fonte:** originale · **Struttura:** 4 pagine (MC avanzata) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "Navigare al buio: come usa internet chi non vede"**
> 🎧 *Ascolta prima di leggere. Durata: 3 min.*

**Domanda di avvio:**
Hai mai provato a usare il computer con gli occhi chiusi — e a capire cosa c'è sullo schermo solo dall'audio?

Prova adesso. Chiudi gli occhi. Apri una qualsiasi app o pagina web. Premi il tasto Tab sulla tastiera. Cosa succede?

In molte pagine: niente di utile. Il cursore salta a caso, o non si sposta affatto. Non capisci dove sei. Non sai dove cliccare.

Questo è l'esperienza quotidiana di circa 350.000 persone con disabilità visiva grave in Italia. E di circa 100 milioni di persone in Europa che incontrano barriere digitali ogni giorno — per disabilità motoria, cognitiva, uditiva, o semplicemente per età avanzata.

Il web non è rotto per queste persone. È stato progettato senza di loro.

---

## 📖 ESPLORA

### Accessibilità digitale: cos'è e perché esiste

Quando si parla di accessibilità fisica si pensa ai gradini di un palazzo senza ascensore, alle strade senza rampe per le carrozzine, alle stazioni senza annunci sonori. La logica è semplice: uno spazio inaccessibile esclude chi ha certe caratteristiche fisiche. Non è una scelta dell'escluso — è un difetto del progetto.

L'**accessibilità digitale** funziona esattamente con la stessa logica, applicata agli spazi digitali: siti web, app, documenti, interfacce. Un sito web che usa solo colori per distinguere elementi importanti — rosso = errore, verde = ok — è inaccessibile per circa il 4,5% della popolazione maschile (8% in alcune etnie) che ha una qualche forma di daltonismo. Non è colpa del daltonico: è un difetto del progetto.

Il termine tecnico internazionale per descrivere le regole che rendono un prodotto digitale accessibile è **WCAG** — Web Content Accessibility Guidelines. Sono prodotte dal W3C (World Wide Web Consortium), l'ente internazionale che definisce gli standard del web. La versione attuale è la WCAG 2.1; la 2.2 è entrata in vigore nel 2023.

---

### I quattro principi WCAG

Le WCAG 2.1 organizzano tutti i requisiti di accessibilità intorno a quattro principi fondamentali, identificati dall'acronimo **POUR**:

**P — Percepibile (Perceivable).** Il contenuto deve poter essere percepito da tutti i sensi disponibili. Se un'immagine contiene informazioni importanti, deve avere un **testo alternativo** (alt text) che uno screen reader può leggere ad alta voce a chi non vede. Se c'è un video con audio, deve avere i sottotitoli per chi non sente. Il testo deve avere **contrasto sufficiente** rispetto allo sfondo (rapporto minimo 4,5:1 per il testo normale) per essere leggibile con bassa visione o in condizioni di luce difficili.

**O — Operabile (Operable).** L'interfaccia deve poter essere usata con qualsiasi periferica di input. La **navigazione da tastiera** è il test minimo: ogni funzione raggiungibile con il mouse deve essere raggiungibile anche solo con Tab, Invio, Spazio e le frecce direzionali. Chi ha tremori alle mani non può usare il mouse con precisione. Chi ha lesioni agli arti superiori usa uno switch esterno o il controllo vocale. Se un'azione richiede obbligatoriamente il trascinamento con il mouse, è inaccessibile.

**U — Comprensibile (Understandable).** Il contenuto deve poter essere compreso. Questo include il linguaggio (formule complesse, gergo tecnico non spiegato, frasi troppo lunghe mettono in difficoltà chi ha dislessia o disturbi cognitivi), ma anche il comportamento dell'interfaccia: se clicco un bottone, mi aspetto che accada qualcosa di prevedibile. Se la pagina cambia in modo inaspettato dopo un click, chi ha problemi cognitivi può disorientarsi.

**R — Robusto (Robust).** Il contenuto deve funzionare con tecnologie attuali e future, incluse le **tecnologie assistive** (screen reader, ingranditori, tastiere alternative, display Braille). Questo principio si traduce in pratica nell'usare HTML semantico corretto: i titoli devono essere veri tag `<h1>`, `<h2>`, `<h3>` (non solo testo grande in grassetto), i bottoni devono essere veri `<button>` (non `<div>` con stile cliccabile), i form devono avere etichette `<label>` collegate agli input. Lo screen reader legge la struttura semantica, non l'aspetto visivo.

---

### Chi beneficia dell'accessibilità

Si pensa spesso che l'accessibilità riguardi solo le persone con disabilità permanenti e severe. È una visione parziale.

L'**Universal Design** — un principio nato nell'architettura negli anni '70 — dice che progettare per chi ha le esigenze più diverse beneficia tutti. Il classico esempio fisico: le rampe per le carrozzine vengono usate ogni giorno anche da persone con passeggini, con valigie a rotelle, con biciclette. Non sono un adattamento speciale: sono un miglioramento del design per tutti.

In digitale funziona allo stesso modo. I sottotitoli dei video, nati per le persone sorde, vengono usati da centinaia di milioni di persone in ambienti rumorosi, in lingue straniere, o semplicemente perché preferiscono leggere mentre guardano. Il testo alternativo delle immagini aiuta chi non vede, ma è anche il testo che i motori di ricerca leggono per indicizzare l'immagine. Il contrasto alto aiuta chi ha bassa visione, ma anche chiunque guardi lo schermo alla luce diretta del sole.

**Chi beneficia concretamente:**
- Persone con disabilità visive (cecità, bassa visione, daltonismo): circa 2,2 miliardi di persone nel mondo hanno qualche forma di compromissione visiva (OMS, 2023).
- Persone con disabilità motorie: chi non può usare il mouse, chi usa tastiere alternative, chi usa il controllo vocale.
- Persone con disabilità cognitive o di apprendimento: dislessia, ADHD, autismo — il linguaggio semplice e la struttura chiara riducono il carico cognitivo per tutti.
- Anziani: la disabilità può essere acquisita gradualmente. La dimensione del carattere, il contrasto, la chiarezza della navigazione diventano essenziali con l'età.
- Utenti con connessione lenta o dispositivi datati: le pagine con troppo JavaScript pesante possono essere inutilizzabili su una connessione EDGE o un dispositivo da 150 euro.
- Chiunque si trovi in condizioni difficili: mano occupata, rumore, stanchezza visiva.

Il numero comunemente citato è **1 miliardo di persone nel mondo con una qualche forma di disabilità** (OMS). Ma il numero di persone che beneficia di un design accessibile è molto più alto.

---

### Gli strumenti per testare l'accessibilità

Non devi essere uno specialista per valutare l'accessibilità di base di un sito web. Esistono strumenti gratuiti che chiunque può usare in pochi minuti.

**WAVE (wave.webaim.org).** Estensione del browser o sito web. Analizza qualsiasi pagina e mostra visivamente ogni problema: errori gravi (rosso), avvisi (giallo), elementi strutturali corretti (verde). Indica quante immagini non hanno alt text, quanti moduli non hanno etichette, se il contrasto del testo è sufficiente. Il report è comprensibile anche senza formazione tecnica.

**Lighthouse di Chrome.** Strumento integrato nelle DevTools di Chrome (tasto F12 → scheda Lighthouse → seleziona "Accessibility" → Genera report). Dà un punteggio da 0 a 100 e lista i problemi con spiegazione e link alla documentazione. È lo stesso strumento usato da Google per valutare la qualità delle pagine web.

**Simulatori di daltonismo.** Browser come Firefox e Edge hanno strumenti integrati per simulare come appare la pagina a chi ha protanopia (rosso-verde), deuteranopia, tritanopia (blu-giallo) o visione in scala di grigi. Identifica immediatamente se stai usando solo il colore per trasmettere informazioni importanti.

**Screen reader.** NVDA (NonVisual Desktop Access) è gratuito per Windows. VoiceOver è integrato in MacOS e iOS. TalkBack è integrato in Android. Usare uno screen reader su una pagina web rivela immediatamente se la struttura semantica è corretta — perché lo screen reader non vede i colori, non vede la posizione degli elementi, legge solo la struttura HTML.

---

### Accessibilità come obbligo legale

L'accessibilità digitale non è solo una buona pratica — è un requisito legale in molti contesti.

In Italia, la **Legge Stanca (L. 4/2004)** obbliga le pubbliche amministrazioni a rendere accessibili i propri siti e servizi digitali. A livello europeo, la **Direttiva 2016/2102** estende questo obbligo a tutti i siti e le app mobile del settore pubblico.

Il passo più importante è il **European Accessibility Act (Direttiva EU 2019/882)**, in vigore in Italia dal giugno 2025. Questo atto estende l'obbligo di accessibilità anche alle aziende private con più di 10 dipendenti o con fatturato superiore a 2 milioni di euro — una platea enormemente più ampia. I prodotti e servizi digitali — app, siti di e-commerce, sportelli bancari online, biglietterie digitali, e-book — devono essere accessibili. Chi non si adegua rischia sanzioni.

La base giuridica più profonda è la **Convenzione ONU sui Diritti delle Persone con Disabilità (CRPD)**, ratificata dall'Italia nel 2009. L'articolo 9 (Accessibilità) e l'articolo 21 (Libertà di espressione e di informazione) stabiliscono che l'accesso alle tecnologie dell'informazione e della comunicazione è un diritto fondamentale.

Un sito inaccessibile non è solo scomodo: viola un diritto.

---

### Universal Design: progettare per tutti dall'inizio, non adattare dopo

L'Universal Design non è un insieme di correzioni da aggiungere alla fine. È un approccio progettuale che considera la diversità umana come punto di partenza, non come caso d'eccezione da gestire.

Nel mondo fisico, la differenza si vede: una porta troppo stretta per una carrozzina fu costruita pensando a una persona tipo che non include chi usa la carrozzina. Aggiungere una rampa laterale dopo è più costoso, meno efficace, e spesso esprime ancora l'idea che la persona con disabilità debba usare l'ingresso secondario.

In digitale, l'Universal Design significa che il team che progetta un'app discute di accessibilità nella prima riunione di progetto — non dopo che il prodotto è finito. Significa testare con utenti reali che usano screen reader durante lo sviluppo — non dopo. Significa che il contrasto del colore è scelto anche in funzione della leggibilità in bassa visione — non solo dell'estetica.

Il risultato non è un prodotto meno bello o meno performante. Al contrario: i prodotti progettati con i principi di Universal Design tendono ad essere più chiari, più semplici, più rapidi da usare — per tutti.

> **Collegamento con MC-DIG-1-02 — Informazione e fonti:**
> In prima media hai imparato che una fonte inaccessibile non è una buona fonte — anche se il contenuto fosse corretto. Un sito web inaccessibile produce esattamente lo stesso risultato: l'informazione esiste, ma non è disponibile per una larga parte della popolazione. L'accessibilità è prerequisito dell'informazione equa.

> **Collegamento STEM — Informatica:**
> La struttura semantica dell'HTML — tag `<h1>`, `<nav>`, `<main>`, `<button>`, `<label>` — non è solo una convenzione di stile. È il vocabolario che i browser, i motori di ricerca e le tecnologie assistive usano per capire il significato della pagina. Scrivere HTML semantico corretto è sia una buona pratica di sviluppo sia il fondamento tecnico dell'accessibilità.

---

## 🔍 OSSERVA

### Il caso: audit di accessibilità del sito della tua scuola

Il sito web della tua scuola è, tecnicamente, un servizio pubblico. Come tutti i siti della pubblica amministrazione italiana, è soggetto alla Legge Stanca del 2004 e alla Direttiva Europea del 2016. Deve avere una "dichiarazione di accessibilità" pubblicata. Deve essere conforme alle WCAG 2.1 livello AA.

Apri il sito della tua scuola e vai su wave.webaim.org. Inserisci l'URL. Premi analizza.

Quello che probabilmente troverai: decine di errori. Immagini senza alt text (il logo della scuola, le foto degli eventi, le immagini nel menu). Testo con contrasto insufficiente (grigi chiari su sfondi bianchi). Link che dicono solo "clicca qui" o "leggi di più" (uno screen reader che legge tutti i link della pagina sente solo "clicca qui, clicca qui, clicca qui" — senza capire dove conducono). Moduli di contatto senza etichette.

Questi non sono difetti tecnici astratti. Sono barriere concrete per studenti, insegnanti o genitori con disabilità visiva, per persone anziane, per chiunque usi tecnologie assistive.

I siti scolastici italiani sono mediamente tra i meno accessibili del settore pubblico — non per malevolenza, ma perché chi li gestisce spesso non sa cosa sono le WCAG, e i contratti con le software house che li costruiscono raramente includono test di accessibilità.

La buona notizia: molti degli errori più comuni si correggono in pochi minuti. Aggiungere l'alt text a un'immagine in un CMS richiede 30 secondi. Cambiare il colore di un testo da grigio chiaro a grigio scuro è una modifica di un valore esadecimale. Riscrivere "clicca qui" in "Scarica il modulo iscrizione" è solo buona comunicazione.

---

> **⚠️ Errore comune — "L'accessibilità è per pochi casi rari"**
>
> Stima reale: il 15% della popolazione mondiale ha una qualche forma di disabilità (OMS). In Italia sono circa 9 milioni di persone. A questi si aggiungono gli anziani (circa 14 milioni di over 65 in Italia, molti dei quali incontrano barriere digitali anche senza una disabilità formale), chi usa il telefono in condizioni difficili (luce solare diretta, guanti, mano singola), chi legge in una lingua straniera.
>
> La vera domanda non è "quante persone hanno una disabilità riconosciuta". È "quante persone stanno cercando di usare questo sito in condizioni diverse da quelle in cui è stato progettato". La risposta è: quasi sempre, molte più di quanto si pensi.

---


### 📊 Chi lavora con questa competenza nel 2030?

**Data Scientist**

Estrae conoscenza dai big data applicando statistica, machine learning e visualizzazione dati per supportare decisioni aziendali basate sull'evidenza in ogni settore.

Dove lavora: grandi aziende data-driven (finanza, retail, salute), startup analitiche, istituti di ricerca, enti pubblici con open data.

Competenze chiave che inizia a costruire da qui: Python / R · SQL · machine learning · data visualization · statistica inferenziale

*"I dati raccontano sempre una storia. Il mio lavoro è capire se la storia è vera."*

---

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### ● BASE — Identifico le barriere in un sito già analizzato

**Obiettivo:** riconoscere i tipi di barriere digitali più comuni e collegarli al tipo di utente che escludono.

**Materiali:** il report WAVE di un sito fornito dal docente (screenshot del report già fatto) oppure, se hai accesso a internet, il sito della tua scuola analizzato con WAVE (wave.webaim.org).

**Procedura:**

1. Osserva il report WAVE. Gli errori rossi sono i problemi più gravi. Conta quanti sono nella pagina analizzata.

2. Per ogni tipo di errore elencato, collega il problema all'utente che viene escluso. Usa questa guida:

| Errore WAVE | Chi viene escluso |
|-------------|-------------------|
| Immagine senza alt text | Persone che usano screen reader (ciechi, ipovedenti gravi) |
| Contrasto del testo insufficiente | Persone con bassa visione, daltonici, chiunque in condizioni di luce difficile |
| Modulo senza etichetta | Persone che usano screen reader (non sanno cosa scrivere nel campo) |
| Link vuoto o non descrittivo ("clicca qui") | Persone che navigano da tastiera o screen reader |
| Struttura di titoli assente o errata | Persone che navigano per titoli con screen reader, persone con difficoltà cognitive |

3. Scegli i 3 errori che ti sembrano più gravi — non necessariamente quelli più numerosi, ma quelli che causano il maggiore impatto sull'esperienza dell'utente escluso. Spiega il motivo della tua scelta in 2-3 righe per ciascuno.

4. Per ognuno dei 3 errori scelti, proponi la correzione in linguaggio semplice (non serve sapere programmare: es. "aggiungere una descrizione testuale a ogni immagine che spieghi cosa mostra").

---

### ●● INTERMEDIO — Testo la navigazione da tastiera e confronto due siti

**Obiettivo:** sperimentare direttamente la navigazione da tastiera e confrontare l'accessibilità di due siti reali.

**Materiali:** computer con browser (Chrome, Firefox o Edge), due URL da analizzare (il sito della tua scuola + un sito di tua scelta).

**Test 1 — Navigazione da tastiera:**

1. Apri il sito della tua scuola. Metti le mani sulla tastiera. Non toccare il mouse per i prossimi 5 minuti.

2. Premi Tab ripetutamente. Un "focus indicator" (bordo colorato o sottolineatura) dovrebbe evidenziare ogni elemento interattivo (link, bottone, campo di testo) uno per volta.

3. Registra su un foglio:
   - Riesci a raggiungere il menu principale solo con Tab?
   - Riesci ad aprire un link della sezione "Circolari" o "News" solo con Invio?
   - Il focus indicator è visibile chiaramente, o scompare in alcuni punti?
   - Ci sono elementi "trappola" — punti dove il Tab rimane bloccato e non riesci ad uscire?

4. Assegna al sito un punteggio da 1 a 5 per la navigabilità da tastiera. Spiega il punteggio.

**Test 2 — Confronto con un secondo sito:**

5. Ripeti il test su un secondo sito a tua scelta (suggerimento: prova gov.uk, il sito del governo britannico, che è un esempio riconosciuto internazionalmente di accessibilità). Confronta i due siti sulla stessa scala.

6. Scrivi una breve relazione (6-8 righe) che risponda: qual è la differenza principale tra i due siti nella navigazione da tastiera? Cosa ha fatto di diverso il sito più accessibile?

---

### ●●● AVANZATO — Audit completo e proposta di correzione tecnica

**Scenario:** sei stato/a incaricato/a di preparare un report tecnico di accessibilità da consegnare al responsabile del sito della tua scuola (o del sito del tuo comune). Il tuo report deve essere professionale, motivato e propositivo — non una lista di lamentele, ma un documento d'azione.

**Procedura:**

1. Analizza il sito con WAVE e con Lighthouse (F12 → Lighthouse → Accessibilità). Registra il punteggio Lighthouse e il numero di errori WAVE.

2. Testa la navigazione da tastiera (segui le istruzioni del livello Intermedio). Testa anche il contrasto dei colori principali usando il Color Contrast Checker di WebAIM (webaim.org/resources/contrastchecker/).

3. Identifica i **5 problemi più critici** — combinando gravità tecnica (errore WAVE) e impatto sull'utente reale.

4. Per ogni problema, scrivi:
   - Descrizione del problema (cosa non funziona)
   - Quale utente viene escluso e in che modo (concretamente)
   - La correzione tecnica (per ogni correzione, indica se è semplice da implementare o richiede sviluppo)
   - Il riferimento WCAG corrispondente (es. "WCAG 2.1 — Criterio 1.1.1 Non-text Content")

5. Aggiungi una sezione "Priorità di intervento": quali 2 correzioni faresti immediatamente (basso costo, alto impatto) e quale richiederebbe invece un intervento più strutturato?

6. Scrivi il report in forma di lettera formale indirizzata al dirigente scolastico o al responsabile del sito. Tono: professionale, costruttivo, non accusatorio. Lunghezza: 1 pagina (circa 250-300 parole + tabella problemi).

> **Estensione avanzata:** se hai accesso a un sito di test che puoi modificare (es. un sito personale, una pagina GitHub Pages), implementa almeno una delle correzioni identificate e documenta il prima/dopo con screenshot e i valori Lighthouse.

---

## 🌍 AGISCI

---

### 📋 Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | ● Base — Sufficiente | ●● Intermedio — Buono | ●●● Avanzato — Ottimo |
|----------|---------------------|----------------------|----------------------|
| **1. Identificazione delle barriere** | Nomina almeno 3 tipi di barriere digitali presenti nel sito analizzato | Collega ogni barriera al tipo di utente che esclude, con una descrizione concreta dell'impatto | Distingue tra errori tecnici (correggibili in poco tempo) e problemi strutturali (richiedono riprogettazione) |
| **2. Conoscenza dei principi WCAG** | Sa elencare i 4 principi POUR con una parola chiave per ciascuno | Spiega, per almeno 2 dei 4 principi, un requisito concreto e perché esiste | Collega ogni errore identificato al principio WCAG violato e al criterio di successo specifico |
| **3. Prospettiva dell'utente** | Descrive l'esperienza di un utente escluso in termini generali | Simula concretamente l'esperienza (es. naviga da tastiera, usa la modalità alto contrasto) e la descrive in prima persona | Ha testato il sito con un utente reale o ha condotto un test sistematico con screen reader e documenta i risultati |
| **4. Proposta di correzione** | Propone almeno una correzione comprensibile per i problemi identificati | Produce un report con problemi prioritizzati e correzioni concrete, distinguendo quelle facili da quelle complesse | Produce un report tecnico professionale con riferimenti WCAG, stima di impegno per ogni correzione e prioritizzazione motivata |

---

### Lo scenario

Il sito web della tua scuola è accessibile a tutti gli studenti, insegnanti e genitori che vogliono usarlo? Questo include chi ha disabilità visiva, chi usa un dispositivo vecchio o una connessione lenta, chi è anziano o ha difficoltà cognitive.

La risposta, probabilmente, è no — o non completamente. E questo ha conseguenze reali: un genitore con disabilità visiva non riesce a leggere le circolari. Uno studente con difficoltà motorie non riesce a compilare il modulo di assenza online. Un docente non vedente non riesce a navigare nel registro elettronico.

Puoi fare qualcosa di concreto.

---

### La consegna

**Scegli** il sito web della tua scuola, o in alternativa il sito del tuo comune.

**Esegui un audit** con WAVE (wave.webaim.org) — è gratuito, non richiede installazione, funziona direttamente nel browser.

**Produci un report** di accessibilità indirizzato al responsabile del sito. Il report deve contenere:
1. Il numero di errori critici trovati e il punteggio Lighthouse se disponibile
2. I 5 problemi più gravi con spiegazione di chi escludono
3. La proposta di correzione per almeno 3 di questi problemi
4. Una raccomandazione finale (una frase: cosa dovrebbe fare il responsabile del sito come primo passo?)

**Materiali che ti servono:**
- Accesso a internet (wave.webaim.org + il sito da analizzare)
- Un foglio di testo per scrivere il report

> **Suggerimento:** il report è più efficace se è concreto e breve. Un paragrafo di introduzione, una tabella con i problemi e le correzioni, una raccomandazione finale. Un responsabile di sito legge un report di una pagina — non legge dieci pagine.

---

### 🎯 Badge SDG 10 — Ridurre le disuguaglianze

Fare un audit di accessibilità e comunicarne i risultati è un atto concreto in favore del 10° Obiettivo di Sviluppo Sostenibile: ridurre le disuguaglianze.

Una delle disuguaglianze più invisibili è quella digitale: chi non può accedere ai servizi digitali della pubblica amministrazione — per disabilità, età, competenze o dispositivi — è sistematicamente svantaggioso rispetto a chi può. Rendere accessibili i siti pubblici non è un favore a una minoranza: è un prerequisito per la partecipazione democratica.

---

### 🤖 Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona e chiedi all'AI Coach:
- *"Come si aggiunge un alt text corretto a un'immagine su WordPress?"*
- *"Cos'è un rapporto di contrasto e come si calcola?"*
- *"Qual è la differenza tra WCAG livello A, AA e AAA?"*

Se il Coach risponde in modo tecnico incomprensibile, chiedigli di spiegarlo con un esempio pratico — è parte dell'accessibilità anche nella comunicazione.

---

### 🪞 Metacognizione — Rifletti sul tuo lavoro

**1. Sorpresa**
C'è stata una barriera digitale che hai trovato nel sito analizzato che non ti aspettavi — o un tipo di utente escluso a cui non avevi mai pensato prima? Descrivi cosa hai scoperto.

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Difficoltà e soluzione**
Quale è stata la parte più difficile del lavoro? Interpretare il report WAVE? Scrivere la proposta di correzione in modo tecnico ma comprensibile? Come hai affrontato la difficoltà?

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa**
Durante il test di navigazione da tastiera, hai commesso errori — magari hai pensato che il sito fosse navigabile e poi hai scoperto un punto di blocco che non avevi visto? O hai proposto una correzione che il docente o un compagno ti ha fatto notare essere sbagliata o incompleta? Descrivi cosa è successo e come hai corretto.

*Cosa ti ha fatto capire che c'era un problema che non avevi identificato?*

*Scrivi 2-3 righe:* ___________________________________________

---

**4. Connessione con la tua vita**
Hai mai usato una funzione pensata per l'accessibilità senza sapere che esisteva per questo scopo? (Es.: sottotitoli, lettore ad alta voce, zoom del browser, modalità notte, dark mode) Ora che conosci il concetto di Universal Design, come vedi diversamente queste funzioni?

*Scrivi 2-3 righe:* ___________________________________________

---

### 🔗 Collegamento con MC-DIG-3-02 — Intelligenza Artificiale

L'accessibilità riguarda anche l'IA. I sistemi di intelligenza artificiale che generano testo, immagini o interfacce non producono automaticamente output accessibili. Un modello IA che genera un sito web non sa che le immagini hanno bisogno di alt text — a meno che non sia stato addestrato con dati accessibili e non gli sia stato esplicitamente chiesto. La responsabilità dell'accessibilità non si delega all'IA: resta una scelta progettuale umana.

---

## APPENDICE — Tech in English

| Italiano | English | Come si legge |
|----------|---------|---------------|
| accessibilità digitale | digital accessibility | /ˈdɪdʒɪtəl əkˌsesəˈbɪlɪti/ |
| testo alternativo | alt text | /ælt tekst/ |
| lettore di schermo | screen reader | /skriːn ˈriːdər/ |
| usabilità | usability | /ˌjuːzəˈbɪlɪti/ |
| linee guida per l'accessibilità | accessibility guidelines | /əkˌsesəˈbɪlɪti ˈɡaɪdlaɪnz/ |

> *In English we say: "Accessibility is not a feature — it's a baseline" — l'accessibilità non è un optional: è un requisito di partenza.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- Zona 2: la tabella POUR (4 principi) va come infografica visuale con icona per ciascun principio. Il box "chi beneficia" va come sidebar con dato numerico in evidenza (1 miliardo).
- La tabella errori WAVE nella Zona 4 Base va su sfondo colorato per renderla una guida rapida consultabile.
- Il collegamento con MC-DIG-1-02 e il box STEM vanno come riquadri laterali in colore.
- La lettera al dirigente scolastico (livello Avanzato) va come template con riga tratteggiata per la firma.

**Per l'agente generatore asset:**
- Visual richiesto 1: infografica "4 principi POUR" con icona e esempio concreto per ciascuno.
- Visual richiesto 2: simulazione daltonismo — stessa immagine (es. logo colorato) vista con visione normale, protanopia, deuteranopia, e scala di grigi.
- Visual richiesto 3: "percorso di una pagina web attraverso uno screen reader" — mostra l'ordine di lettura degli elementi HTML da parte di NVDA.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: originale · Allineata IN 2025 (D.M. n. 221/2025)*
*Livello DigComp: Advanced (A) · Contenuto espanso su indicazione editoriale — tutte e 5 le zone libro-ready*
