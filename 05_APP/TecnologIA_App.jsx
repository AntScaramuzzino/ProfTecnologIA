import { useState } from "react";
import { BookOpen, Zap, ChevronRight, Home, CheckCircle, Circle,
  Volume2, Eye, Beaker, Target, Award, RotateCcw, ArrowLeft,
  Star, Lock, Play, ChevronLeft } from "lucide-react";

// ── PALETTE PER AREA ────────────────────────────────────────────────────────
const AREA_CONFIG = {
  MAT: { label: "Materiali e Rifiuti", emoji: "🪨", color: "amber",
    bg: "bg-amber-50", border: "border-amber-300", badge: "bg-amber-100 text-amber-800",
    btn: "bg-amber-500 hover:bg-amber-600", light: "bg-amber-100", ring: "ring-amber-400" },
  DIS: { label: "Disegno Tecnico", emoji: "📐", color: "blue",
    bg: "bg-blue-50", border: "border-blue-300", badge: "bg-blue-100 text-blue-800",
    btn: "bg-blue-500 hover:bg-blue-600", light: "bg-blue-100", ring: "ring-blue-400" },
  DIG: { label: "Competenze Digitali", emoji: "💻", color: "purple",
    bg: "bg-purple-50", border: "border-purple-300", badge: "bg-purple-100 text-purple-800",
    btn: "bg-purple-500 hover:bg-purple-600", light: "bg-purple-100", ring: "ring-purple-400" },
  INF: { label: "Informatica", emoji: "🔢", color: "indigo",
    bg: "bg-indigo-50", border: "border-indigo-300", badge: "bg-indigo-100 text-indigo-800",
    btn: "bg-indigo-500 hover:bg-indigo-600", light: "bg-indigo-100", ring: "ring-indigo-400" },
  ALI: { label: "Alimentazione", emoji: "🌾", color: "green",
    bg: "bg-green-50", border: "border-green-300", badge: "bg-green-100 text-green-800",
    btn: "bg-green-500 hover:bg-green-600", light: "bg-green-100", ring: "ring-green-400" },
  AMB: { label: "Abitazione e Città", emoji: "🏗️", color: "teal",
    bg: "bg-teal-50", border: "border-teal-300", badge: "bg-teal-100 text-teal-800",
    btn: "bg-teal-500 hover:bg-teal-600", light: "bg-teal-100", ring: "ring-teal-400" },
  ENE: { label: "Energia e Macchine", emoji: "⚡", color: "yellow",
    bg: "bg-yellow-50", border: "border-yellow-300", badge: "bg-yellow-100 text-yellow-800",
    btn: "bg-yellow-500 hover:bg-yellow-600", light: "bg-yellow-100", ring: "ring-yellow-400" },
  COM: { label: "Comunicazioni e Trasporti", emoji: "📡", color: "sky",
    bg: "bg-sky-50", border: "border-sky-300", badge: "bg-sky-100 text-sky-800",
    btn: "bg-sky-500 hover:bg-sky-600", light: "bg-sky-100", ring: "ring-sky-400" },
  SIS: { label: "Sistemi ed Economia", emoji: "⚙️", color: "slate",
    bg: "bg-slate-50", border: "border-slate-300", badge: "bg-slate-100 text-slate-800",
    btn: "bg-slate-500 hover:bg-slate-600", light: "bg-slate-100", ring: "ring-slate-400" },
};

const ANNO_AREE = {
  1: ["MAT", "DIS", "DIG"],
  2: ["ALI", "AMB", "DIS", "DIG", "INF"],
  3: ["ENE", "COM", "SIS", "DIS", "DIG", "INF"],
};

// ── DATI MC REALI (classe 1) + STUB (classe 2-3) ───────────────────────────
const MC_DATABASE = {
  // ── CLASSE 1 — MAT ──────────────────────────────────────────────────────
  "MC-MAT-1-01": {
    id: "MC-MAT-1-01", area: "MAT", anno: 1,
    titolo: "Classificare i materiali per proprietà",
    descrizione: "Sai classificare materiali di uso comune (legno, plastica, metallo, vetro, tessuto) in base a proprietà fisiche e meccaniche osservabili, e collegare ogni proprietà alla funzione dell'oggetto in cui il materiale è impiegato.",
    fonte: "Paci 2014 + Hypertech 2020",
    livelloDigComp: "F",
    sdg: [12],
    prerequisiti: [],
    hook: {
      titolo: "Perché la pentola è di metallo e la bottiglia di plastica?",
      domanda: "Hai mai pensato perché gli oggetti che usi ogni giorno sono fatti di materiali diversi?",
      durata: "3 min",
    },
    concetto: "I materiali si classificano in base alle loro **proprietà fisiche** (durezza, peso, trasparenza, conduttività termica ed elettrica) e **meccaniche** (resistenza, elasticità, plasticità). Ogni oggetto è costruito con il materiale più adatto alla sua funzione: la pentola è metallica perché il metallo conduce il calore; la bottiglia è di plastica perché è leggera e modellabile.",
    esempio: {
      testo: "Prendi in mano uno smartphone: il vetro del display è duro e trasparente per proteggerti e farti vedere; l'alluminio della scocca è resistente e leggero; la plastica dei componenti interni è isolante elettrica. Tre materiali, tre funzioni diverse — stesso oggetto.",
      professione: { titolo: "Materials Engineer", orizzonte: "2030", note: "Progetta materiali su misura per prodotti ad alte prestazioni: dall'aeronautica ai dispositivi medici." },
    },
    lab: {
      base: "Usa la scheda fornita: abbina i 5 materiali (legno, plastica, metallo, vetro, tessuto) alle proprietà elencate. Poi collega ogni materiale a un oggetto di casa.",
      intermedio: "Prendi 5 oggetti dalla tua borsa o dalla classe. Per ciascuno identifica il materiale principale, scrivi 2 proprietà osservabili e spiega perché quel materiale è stato scelto.",
      avanzato: "Scegli un oggetto complesso (es. borraccia, zaino, matita). Smontalo concettualmente: quanti materiali diversi contiene? Per ciascuno scrivi le proprietà e la funzione specifica. Poi rispondi: si potrebbe costruire con un solo materiale? Perché no?",
    },
    compito_realta: "Analizza 5 oggetti di casa: per ognuno identifica la materia prima principale, come è stata lavorata e come va smaltita a fine vita. Presenta la tua analisi con una tabella.",
    quiz: {
      base: [
        { domanda: "Quale proprietà dei materiali indica la capacità di condurre calore?", opzioni: ["Elasticità", "Conduttività termica", "Trasparenza", "Durezza"], corretta: 1, feedback: "La conduttività termica misura quanto bene un materiale trasmette calore. Ecco perché le padelle sono di metallo!" },
        { domanda: "Perché le bottiglie d'acqua sono spesso di plastica invece che di vetro?", opzioni: ["Perché la plastica è più trasparente", "Perché la plastica è più leggera e resistente agli urti", "Perché la plastica costa di più", "Perché il vetro non è riciclabile"], corretta: 1, feedback: "La plastica è leggera (bassa densità) e non si rompe se cade, caratteristiche utili per un contenitore portatile. Il vetro sarebbe troppo pesante e fragile." },
        { domanda: "Quale di questi materiali è un buon isolante elettrico?", opzioni: ["Rame", "Alluminio", "Plastica", "Ferro"], corretta: 2, feedback: "La plastica non conduce l'elettricità — per questo i cavi elettrici hanno il filo di rame (conduttore) avvolto in plastica (isolante)." },
      ],
      intermedio: [
        { domanda: "Un architetto deve scegliere il materiale per una finestra. Quali due proprietà sono ENTRAMBE essenziali?", opzioni: ["Durezza e conduttività elettrica", "Trasparenza e resistenza meccanica", "Elasticità e peso elevato", "Magnetismo e plasticità"], corretta: 1, feedback: "Una finestra deve lasciar passare la luce (trasparenza) e resistere al vento e ai colpi (resistenza meccanica). Il vetro ha entrambe queste proprietà." },
        { domanda: "Un oggetto è 'elastico'. Cosa significa esattamente?", opzioni: ["Si può rompere facilmente", "Ritorna alla forma originale dopo una deformazione", "Conduce bene l'elettricità", "Ha una superficie dura"], corretta: 1, feedback: "Elasticità = capacità di recuperare la forma originale dopo una forza. La gomma è elastica; la plastilina è plastica (cambia forma senza tornare indietro)." },
        { domanda: "Perché i cavi elettrici sono fatti di rame avvolto in plastica?", opzioni: ["Per renderli più pesanti", "Il rame conduce, la plastica isola: funzioni complementari", "Perché il rame da solo non conduce", "Per puro motivo estetico"], corretta: 1, feedback: "Ogni materiale fa la sua parte: il rame (ottimo conduttore) trasporta l'elettricità; la plastica (isolante) protegge dall'elettricità chi tocca il cavo." },
      ],
      avanzato: [
        { domanda: "In quale caso NON si usa il metallo nonostante la sua alta resistenza?", opzioni: ["Quando serve leggerezza (es. aeronautica di precisione)", "Quando serve conduttività termica", "Quando serve resistenza agli urti", "Quando serve durezza superficiale"], corretta: 0, feedback: "Resistenza e peso sono spesso in conflitto. In aeronautica si usano leghe speciali o materiali compositi (fibra di carbonio) per ottenere resistenza senza pesare troppo." },
        { domanda: "Cosa significa 'proprietà meccanica' di un materiale?", opzioni: ["Come reagisce alle forze fisiche (trazione, compressione, flessione)", "Come conduce il calore", "Il suo colore e aspetto esteriore", "Come reagisce all'elettricità"], corretta: 0, feedback: "Le proprietà meccaniche descrivono il comportamento sotto l'azione di forze: resistenza a trazione, compressione, flessione, durezza, fragilità. Sono fondamentali in ingegneria strutturale." },
        { domanda: "Un designer vuole un oggetto 'bioresorbibile' (si dissolve nel corpo). Quale area di ricerca sui materiali è coinvolta?", opzioni: ["Metallurgia tradizionale", "Biomateriali e materiali biocompatibili", "Ceramica industriale", "Polimeri termoplastici rigidi"], corretta: 1, feedback: "I biomateriali sono progettati per interagire con i sistemi biologici. Un impianto bioresorbibile si dissolve nel tempo nel corpo umano — nessun secondo intervento chirurgico necessario." },
      ],
    },
  },

  "MC-MAT-1-02": {
    id: "MC-MAT-1-02", area: "MAT", anno: 1,
    titolo: "Ciclo di vita dei materiali e cicli tecnologici",
    descrizione: "Sai descrivere le fasi del ciclo di vita di un materiale (estrazione, lavorazione, uso, smaltimento/riciclo) e le inserisci nel contesto del ciclo tecnologico completo.",
    fonte: "Paci 2014 + Hypertech 2020",
    livelloDigComp: "F",
    sdg: [12, 15],
    prerequisiti: ["MC-MAT-1-01"],
    hook: {
      titolo: "Il viaggio segreto della tua felpa: 40.000 km prima del tuo armadio",
      domanda: "Hai mai pensato a quante persone, paesi e chilometri ci sono stati dietro prima che quella felpa finisse nel tuo armadio?",
      durata: "3 min",
    },
    concetto: "Il **ciclo tecnologico** completo di un prodotto ha 7 fasi: estrazione delle materie prime → lavorazione → produzione → logistica → distribuzione → uso → fine vita. Ogni fase ha un impatto ambientale e un soggetto responsabile. Capire questo ciclo ti permette di fare scelte di consumo più consapevoli.",
    esempio: {
      testo: "Una felpa di cotone percorre circa 40.000 km prima di arrivare sullo scaffale: cotone dal Texas, filatura in India, tessitura in Bangladesh, tintura in Vietnam, assemblaggio in Cambogia, spedizione in Europa. E quando la butti? Il viaggio non è finito.",
      professione: { titolo: "Supply Chain Sustainability Manager", orizzonte: "2030", note: "Ottimizza le catene di fornitura per ridurre emissioni e garantire condizioni di lavoro etiche lungo tutto il ciclo tecnologico." },
    },
    lab: {
      base: "Completa la tabella del ciclo di vita di una bottiglia di plastica: le 7 fasi sono già nominate, tu descrivi brevemente cosa succede e chi è responsabile.",
      intermedio: "Scegli un oggetto di uso quotidiano (telefono, scarpa, libro). Mappa le 7 fasi del suo ciclo tecnologico e indica, per ciascuna, il principale impatto ambientale.",
      avanzato: "Confronta il ciclo tecnologico di una maglia di cotone biologico locale vs. fast fashion importata. Stima l'impronta di carbonio per fase e argomenta quale è preferibile, tenendo conto di prezzo, impatto e condizioni di lavoro.",
    },
    compito_realta: "Traccia il 'passaporto tecnologico' di un oggetto: scegli un oggetto di casa, mappa le 7 fasi del ciclo tecnologico, indica chi è responsabile di ciascuna e il principale impatto ambientale. Indica dove puoi intervenire tu come consumatore.",
    quiz: {
      base: [
        { domanda: "Qual è la prima fase del ciclo di vita di un prodotto?", opzioni: ["Uso", "Distribuzione", "Estrazione delle materie prime", "Smaltimento"], corretta: 2, feedback: "Tutto parte dall'estrazione: minerali dalla terra, piante dai campi, petrolio dal sottosuolo. Prima ancora di essere lavorato, il materiale deve essere estratto." },
        { domanda: "Cosa significa 'riciclo' nel ciclo di vita?", opzioni: ["Buttare l'oggetto nella spazzatura", "Trasformare il materiale usato in nuovo materiale riutilizzabile", "Riparare l'oggetto rotto", "Vendere l'oggetto di seconda mano"], corretta: 1, feedback: "Il riciclo trasforma un materiale a fine vita in materia prima seconda: la bottiglia di plastica diventa fibra sintetica, il vetro viene fuso e rimodellato." },
        { domanda: "Quante fasi ha il ciclo tecnologico completo?", opzioni: ["3", "5", "7", "10"], corretta: 2, feedback: "Le 7 fasi sono: estrazione → lavorazione → produzione → logistica → distribuzione → uso → fine vita. Ogni fase conta!" },
      ],
      intermedio: [
        { domanda: "In quale fase del ciclo tecnologico sei coinvolto direttamente come consumatore?", opzioni: ["Estrazione", "Logistica", "Uso e fine vita", "Produzione"], corretta: 2, feedback: "Come consumatore agisci soprattutto nell'uso (quanto dura, come lo usi) e nel fine vita (differenziata, riuso, discarica). Queste sono le fasi su cui hai più potere." },
        { domanda: "Cosa si intende con 'logistica' nel ciclo tecnologico?", opzioni: ["La fase di estrazione delle materie prime", "Il trasporto e la movimentazione del prodotto lungo la filiera", "La progettazione del prodotto", "Il momento dell'acquisto da parte del consumatore"], corretta: 1, feedback: "La logistica comprende trasporto, stoccaggio e distribuzione fisica del prodotto tra una fase e l'altra. È spesso la fase con maggiore impronta di carbonio per prodotti importati." },
        { domanda: "Perché un prodotto fabbricato localmente ha in genere un impatto ambientale minore?", opzioni: ["Perché costa di meno", "Perché la fase logistica è più corta e produce meno emissioni", "Perché i materiali locali sono sempre biologici", "Perché non ha fase di smaltimento"], corretta: 1, feedback: "La distanza percorsa incide direttamente sulle emissioni di CO₂. Un prodotto locale riduce la fase logistica, che è spesso la più energivora dopo la produzione." },
      ],
      avanzato: [
        { domanda: "L'economia circolare si distingue dall'economia lineare perché...", opzioni: ["Produce più velocemente", "Elimina la fase di smaltimento reintroducendo i materiali nel ciclo", "Usa solo materiali naturali", "È più economica per le aziende"], corretta: 1, feedback: "L'economia lineare è 'estrai→produci→usa→butta'. Quella circolare chiude il loop: il fine vita diventa nuova materia prima, eliminando il concetto di rifiuto." },
        { domanda: "Cos'è la LCA (Life Cycle Assessment)?", opzioni: ["Un metodo per calcolare il prezzo di un prodotto", "Un'analisi dell'impatto ambientale lungo tutte le fasi del ciclo di vita", "Una norma ISO sulla sicurezza dei prodotti", "Un database di materiali riciclabili"], corretta: 1, feedback: "La LCA (Analisi del Ciclo di Vita) misura tutti gli impatti ambientali di un prodotto dalla culla alla tomba (o alla culla, nell'economia circolare). È lo strumento standard per valutare la sostenibilità." },
        { domanda: "Un'azienda sostiene che il suo prodotto è 'green' perché usa packaging riciclato, ma la produzione avviene in fabbrica alimentata a carbone. Questo è un esempio di...", opzioni: ["Economia circolare genuina", "Greenwashing parziale", "Certificazione ISO 14001", "Produzione sostenibile"], corretta: 1, feedback: "Il greenwashing è comunicare un'immagine ecologica parziale o fuorviante. Guardare solo il packaging ignora la fase di produzione, che può essere molto più impattante." },
      ],
    },
  },

  "MC-MAT-1-03": {
    id: "MC-MAT-1-03", area: "MAT", anno: 1,
    titolo: "Materiali innovativi e sostenibili",
    descrizione: "Conosci le caratteristiche principali di materiali innovativi (bioplastiche, materiali riciclati, compositi) e sai valutare la loro sostenibilità rispetto ai materiali tradizionali.",
    fonte: "Hypertech 2020",
    livelloDigComp: "F",
    sdg: [9, 12],
    prerequisiti: ["MC-MAT-1-02"],
    hook: {
      titolo: "Scarpe fatte da bottiglie di plastica: fantascienza o realtà?",
      domanda: "Sapevi che alcune delle scarpe sportive più famose al mondo sono fatte in parte con plastica raccolta dall'oceano?",
      durata: "2 min",
    },
    concetto: "I **materiali innovativi** nascono per rispondere a problemi che i materiali tradizionali non risolvono bene. Le **bioplastiche** sono derivate da fonti vegetali e si degradano più facilmente. I **materiali compositi** combinano due o più materiali per ottenere proprietà superiori (es. fibra di carbonio = fibra + resina: leggero e rigidissimo). I **materiali riciclati** riducono il bisogno di nuove materie prime.",
    esempio: {
      testo: "La fibra di carbonio nelle bici da competizione è un materiale composito: è 5 volte più resistente dell'acciaio ma pesante quanto la plastica. Le bioplastiche di mais si usano nei bicchieri dei festival: si degradano in 90 giorni in compostaggio industriale.",
      professione: { titolo: "Materials Innovation Scientist", orizzonte: "2030", note: "Sviluppa nuovi materiali per settori come medicina, aerospazio, sport — il lavoro inizia in laboratorio e finisce negli oggetti che usi ogni giorno." },
    },
    lab: {
      base: "Osserva 3 prodotti che dichiarano di usare materiali innovativi (puoi cercare online). Per ciascuno: nome del materiale, da cosa è fatto, vantaggio principale rispetto al materiale tradizionale.",
      intermedio: "Cerca un'azienda italiana che produce materiali riciclati o bioplastiche. Descrivi il materiale, come viene prodotto e a cosa serve. Valuta se è davvero più sostenibile (usa la LCA come criterio).",
      avanzato: "Progetta un oggetto di uso scolastico (astuccio, righello, borraccia) usando solo materiali innovativi. Giustifica ogni scelta con le proprietà del materiale e stima l'impatto ambientale rispetto alla versione tradizionale.",
    },
    compito_realta: "Crea una 'scheda tecnica di sostenibilità' per un materiale innovativo a tua scelta: nome, composizione, proprietà chiave, applicazioni, vantaggi e limiti rispetto al materiale tradizionale, impatto ambientale stimato.",
    quiz: {
      base: [
        { domanda: "Cosa sono le bioplastiche?", opzioni: ["Plastiche di colore verde", "Plastiche derivate da fonti vegetali rinnovabili", "Plastiche molto dure", "Plastiche riciclate dal mare"], corretta: 1, feedback: "Le bioplastiche sono prodotte da risorse vegetali (mais, canna da zucchero, alghe) invece che dal petrolio. Alcune sono anche biodegradabili, ma non tutte!" },
        { domanda: "Cosa rende speciale un materiale composito?", opzioni: ["È fatto da un solo elemento chimico puro", "Combina due o più materiali per ottenere proprietà superiori ai singoli", "È sempre biodegradabile", "È sempre più economico dei materiali tradizionali"], corretta: 1, feedback: "Il composito sfrutta il meglio di ciascun componente: la fibra di carbonio è rigidissima, la resina la tiene insieme e protegge. Il risultato è più performante di entrambi presi separatamente." },
        { domanda: "Quale vantaggio principale offrono i materiali riciclati?", opzioni: ["Costano sempre meno", "Riducono la necessità di estrarre nuove materie prime", "Sono sempre più resistenti", "Non hanno limiti di utilizzo"], corretta: 1, feedback: "Usare materiale riciclato significa non dover estrarre, trasportare e lavorare nuove materie prime — riducendo energia consumata e impatto ambientale nella fase iniziale del ciclo." },
      ],
      intermedio: [
        { domanda: "Una bioplastica biodegradabile è sempre ecologica? Perché?", opzioni: ["Sì, sempre: si degrada da sola", "Non necessariamente: spesso richiede impianti di compostaggio industriale specifici", "Sì, se è di colore verde", "No, perché è fatta di petrolio"], corretta: 1, feedback: "Molte bioplastiche 'biodegradabili' si degradano solo in impianti di compostaggio industriale a temperature di 60°C+. Nell'ambiente naturale o in discarica restano intatte per anni." },
        { domanda: "La fibra di carbonio è leggera e resistentissima. Qual è il suo principale svantaggio?", opzioni: ["Non è resistente all'acqua", "È difficile e costosa da riciclare a fine vita", "Non si usa in aeronautica", "È più pesante dell'acciaio"], corretta: 1, feedback: "La fibra di carbonio è un composito termoindurente: una volta polimerizzata, non può essere rifondata e riciclata come i metalli. Il fine vita è ancora un problema aperto della ricerca." },
        { domanda: "Quale settore ha introdotto per primo su larga scala i materiali compositi a fibra di carbonio?", opzioni: ["Industria alimentare", "Aeronautica e spaziale", "Industria tessile", "Edilizia residenziale"], corretta: 1, feedback: "L'aeronautica ha spinto lo sviluppo dei compositi dagli anni '70: la necessità di ridurre il peso degli aerei (= meno carburante) ha giustificato i costi elevati di produzione." },
      ],
      avanzato: [
        { domanda: "Perché la graphene (grafene) è considerato un 'super-materiale' del futuro?", opzioni: ["È economico e abbondante in natura", "Ha proprietà elettriche, termiche e meccaniche eccezionali in uno strato monoatomico", "Si degrada rapidamente nell'ambiente", "È visibile a occhio nudo"], corretta: 1, feedback: "Il grafene è un singolo strato di atomi di carbonio: conduce l'elettricità meglio del rame, è più resistente dell'acciaio e quasi completamente trasparente. La sfida attuale è produrlo in quantità industriali a basso costo." },
        { domanda: "Cos'è il 'cradle-to-cradle' (dalla culla alla culla)?", opzioni: ["Un metodo di produzione industriale più veloce", "Un modello di design dove ogni materiale è pensato per diventare nutrimento per un nuovo ciclo", "Un tipo di bioplastica compostabile", "Una norma europea sui rifiuti elettronici"], corretta: 1, feedback: "Cradle-to-cradle (C2C) ridisegna il prodotto dall'inizio: ogni materiale è classificato come 'nutriente biologico' (rientra in natura) o 'nutriente tecnico' (rientra in produzione). Zero rifiuti per design." },
        { domanda: "Un'azienda sviluppa un materiale da alghe marine che si degrada in acqua salata in 6 settimane. Qual è il rischio principale da valutare prima di commercializzarlo?", opzioni: ["Il colore del materiale", "L'impatto degli additivi chimici usati nella lavorazione sull'ecosistema marino", "Il peso eccessivo del materiale", "Il brevetto dei concorrenti"], corretta: 1, feedback: "Un materiale che si scioglie in mare deve essere innocuo per gli ecosistemi marini. Anche se la base è naturale, i processi di lavorazione possono introdurre sostanze chimiche tossiche che si liberano durante la degradazione." },
      ],
    },
  },

  // ── CLASSE 1 — DIS ──────────────────────────────────────────────────────
  "MC-DIS-1-01": {
    id: "MC-DIS-1-01", area: "DIS", anno: 1,
    titolo: "Basi del disegno e costruzioni geometriche",
    descrizione: "Sai usare correttamente gli strumenti del disegno tecnico per eseguire costruzioni geometriche fondamentali (perpendicolari, parallele, poligoni regolari, divisione di angoli) rispettando le convenzioni grafiche.",
    fonte: "Paci 2014",
    livelloDigComp: "F",
    sdg: [4],
    prerequisiti: [],
    hook: {
      titolo: "Come hanno costruito le cattedrali gotiche senza calcolatrice?",
      domanda: "Come facevano gli architetti medievali a disegnare archi perfetti e guglie precise senza strumenti digitali?",
      durata: "2 min",
    },
    concetto: "Il **disegno tecnico** usa strumenti precisi (riga, squadra, compasso, matita) e regole condivise per comunicare idee progettuali in modo universale. Una **costruzione geometrica** è una procedura passo-passo che produce forme esatte usando solo riga e compasso.",
    esempio: {
      testo: "Per costruire un esagono regolare: 1) disegna un cerchio, 2) senza cambiare l'apertura del compasso, porta la punta sul cerchio e traccia un arco che interseca il cerchio, 3) ripeti 6 volte. Hai usato la proprietà che il raggio si 'stacca' 6 volte sulla circonferenza.",
      professione: { titolo: "CAD Designer / BIM Specialist", orizzonte: "2030", note: "Progetta edifici, oggetti e impianti con software 3D — ma le basi geometriche sono le stesse di riga e compasso." },
    },
    lab: {
      base: "Sul foglio pre-impostato con cornice e cartiglio, esegui: una retta perpendicolare a un segmento dato, un triangolo equilatero con lato 5 cm, un esagono regolare iscritto in un cerchio di raggio 3 cm.",
      intermedio: "Disegna la pianta semplificata di un oggetto a tua scelta (borraccia, astuccio) usando almeno 3 costruzioni geometriche. Usa matita H per costruzioni e HB per linee definitive.",
      avanzato: "Ricerca la 'sezione aurea' (proporzione 1:1,618) e costruiscila geometricamente. Trova 3 oggetti di design famosi che la usano e spiega perché questa proporzione risulta esteticamente piacevole.",
    },
    compito_realta: "Disegna in scala 1:20 la tua aula: misura le dimensioni reali con un metro, converti in scala e riproduci la pianta su foglio A4 con strumenti tecnici. Aggiungi cartiglio con nome, data e scala.",
    quiz: {
      base: [
        { domanda: "Quale strumento usi per tracciare una linea retta di lunghezza precisa?", opzioni: ["Compasso", "Riga graduata", "Squadra", "Curvilinee"], corretta: 1, feedback: "La riga graduata ha le misure in millimetri e ti permette di tracciare segmenti di lunghezza esatta. La squadra serve per angoli retti, il compasso per archi e cerchi." },
        { domanda: "Per costruire un cerchio di raggio 4 cm, come imposti il compasso?", opzioni: ["Apri il compasso quanto vuoi", "Misuri 4 cm sulla riga e imposti quella distanza tra punta e grafite", "Misuri il diametro 8 cm e dividi per 2 con la riga", "Non serve il compasso, usi la squadra"], corretta: 1, feedback: "Il compasso va impostato esattamente sul raggio desiderato (4 cm) misurando sulla riga. La punta resta ferma al centro, la grafite traccia il cerchio." },
        { domanda: "Quante volte il raggio 'si stacca' sulla circonferenza di un cerchio?", opzioni: ["4 volte", "5 volte", "6 volte", "8 volte"], corretta: 2, feedback: "Proprietà fondamentale: il raggio si stacca esattamente 6 volte sulla circonferenza. Questo è il principio che permette di costruire facilmente l'esagono regolare con il solo compasso." },
      ],
      intermedio: [
        { domanda: "Qual è la differenza tra una linea 'continua fine' e una 'continua grossa' nel disegno tecnico?", opzioni: ["Nessuna differenza, è solo estetica", "La grossa indica i contorni visibili dell'oggetto, la fine le quote e le assi", "La fine è per costruzioni, la grossa per il testo", "La grossa indica parti nascoste"], corretta: 1, feedback: "Il disegno tecnico usa tipi di linea standardizzati (ISO 128): grossa continua = contorni visibili; fine continua = quote, assi, retini; tratteggiata = parti nascoste." },
        { domanda: "Come si biseca (dimezza) un angolo con riga e compasso?", opzioni: ["Si misura con il goniometro e si divide per 2", "Si tracciano due archi dai lati dell'angolo e si unisce il vertice all'intersezione", "Si usa la squadra a 45°", "Non è possibile senza calcolatrice"], corretta: 1, feedback: "Bisezione di un angolo: 1) arco dal vertice che interseca i lati, 2) due archi uguali dai due punti di intersezione, 3) linea dal vertice all'intersezione dei due archi. Procedura esatta, senza misure." },
        { domanda: "In un disegno tecnico, cosa si trova nel 'cartiglio'?", opzioni: ["Solo il disegno principale", "Informazioni identificative: nome, data, scala, materiale, numero tavola", "Le istruzioni di montaggio", "La lista dei materiali usati"], corretta: 1, feedback: "Il cartiglio è il 'documento d'identità' del disegno: contiene chi l'ha fatto, quando, in quale scala, e tutte le informazioni necessarie per interpretarlo correttamente." },
      ],
      avanzato: [
        { domanda: "La norma ISO che regola i tipi di linea nel disegno tecnico è la...", opzioni: ["ISO 9001", "ISO 128", "ISO 14001", "ISO 31000"], corretta: 1, feedback: "ISO 128 (Technical drawings – General principles of presentation) definisce tipi di linea, spessori e utilizzi nel disegno tecnico a livello internazionale." },
        { domanda: "Perché si usa ancora il disegno manuale a riga e compasso nell'era del CAD?", opzioni: ["Perché il CAD non esiste ancora in Italia", "Perché sviluppa il ragionamento spaziale e la comprensione delle relazioni geometriche", "Perché è più veloce del CAD", "Perché il CAD non può fare costruzioni geometriche"], corretta: 1, feedback: "Disegnare a mano sviluppa la comprensione geometrica profonda che il CAD non può sostituire: capisci perché le forme funzionano così, non solo come farle apparire. È fondamento cognitivo prima che tecnico." },
        { domanda: "Cosa significa che un poligono è 'inscritto' in un cerchio?", opzioni: ["Il cerchio è disegnato dentro il poligono", "Tutti i vertici del poligono toccano la circonferenza", "Il poligono è disegnato fuori dal cerchio", "Il poligono ha lo stesso numero di lati del raggio"], corretta: 1, feedback: "Poligono inscritto: tutti i suoi vertici giacciono sulla circonferenza. Poligono circoscritto: tutti i lati sono tangenti alla circonferenza. Due relazioni fondamentali in geometria euclidea." },
      ],
    },
  },

  "MC-DIS-1-02": {
    id: "MC-DIS-1-02", area: "DIS", anno: 1,
    titolo: "Scale di rappresentazione e quotatura di base",
    descrizione: "Comprendi il concetto di scala di rappresentazione, sai scegliere la scala adatta al foglio disponibile e applicare le convenzioni di quotatura di base per comunicare le dimensioni reali di un oggetto rappresentato.",
    fonte: "Paci 2014",
    livelloDigComp: "F",
    sdg: [4],
    prerequisiti: ["MC-DIS-1-01"],
    hook: {
      titolo: "Come rappresentiamo un palazzo di 30 metri su un foglio A4?",
      domanda: "Se l'edificio è alto 30 metri e il foglio è alto 29 cm, come fa l'architetto a disegnarlo in modo preciso?",
      durata: "2 min",
    },
    concetto: "La **scala di rappresentazione** è il rapporto tra le misure nel disegno e le misure reali. Scala 1:20 = 1 cm sul foglio corrisponde a 20 cm nella realtà. La **quotatura** indica le misure reali dell'oggetto sul disegno, usando linee di quota, frecce e numeri secondo convenzioni internazionali (ISO).",
    esempio: {
      testo: "Una porta larga 90 cm disegnata in scala 1:20 occupa 4,5 cm sul foglio (90÷20=4,5). Se invece uso la scala 1:50, occupa 1,8 cm (90÷50=1,8). Scelgo la scala in base allo spazio disponibile e al livello di dettaglio necessario.",
      professione: { titolo: "Architetto / Tecnico edile", orizzonte: "2030", note: "Usa scale diverse per elaborati diversi: 1:200 per planimetrie di edificio, 1:20 per dettagli costruttivi, 1:1 per particolari di giunzioni." },
    },
    lab: {
      base: "Con la scala già calcolata (1:10), disegna un cubo con lato reale 15 cm: quanto misura il lato nel disegno? Quota il disegno con le misure reali.",
      intermedio: "Misura il tuo astuccio in tutti e tre i sensi (L×l×h). Scegli la scala adatta per farlo stare su un foglio A4 con margini. Disegnane la pianta e i prospetti quotati.",
      avanzato: "Disegna lo stesso oggetto in due scale diverse (es. 1:5 e 1:10). Confronta: quale scala permette più dettaglio? Quale occupa meno spazio? Quando useresti ciascuna in un vero progetto?",
    },
    compito_realta: "Scegli un oggetto della tua scrivania (libro, astuccio, borraccia), misuralo con precisione in mm e disegnane la pianta quotata alla scala più adatta per un foglio A4. Cartiglio obbligatorio.",
    quiz: {
      base: [
        { domanda: "Una stanza è larga 400 cm. In scala 1:50, quanto misura sul foglio?", opzioni: ["8 cm", "4 cm", "2 cm", "20 cm"], corretta: 0, feedback: "400 ÷ 50 = 8 cm. La formula è: misura foglio = misura reale ÷ denominatore della scala. Scala 1:50 = tutto diviso 50." },
        { domanda: "La scala 1:1 significa...", opzioni: ["Il disegno è 10 volte più piccolo del reale", "Il disegno ha le stesse dimensioni dell'oggetto reale", "Il disegno è 100 volte più grande del reale", "Non esiste questa scala"], corretta: 1, feedback: "Scala 1:1 = rapporto 1 a 1. Il disegno è identico all'oggetto reale. Si usa per oggetti piccoli da rappresentare a grandezza naturale (viti, connettori, piccoli componenti)." },
        { domanda: "A cosa serve la 'linea di quota' nel disegno tecnico?", opzioni: ["A delimitare il bordo del foglio", "A indicare la misura reale di un elemento dell'oggetto", "A disegnare i contorni dell'oggetto", "A indicare le sezioni nascoste"], corretta: 1, feedback: "La linea di quota è parallela alla dimensione che si vuole misurare, con frecce agli estremi e il numero (misura reale) al centro. Dice all'osservatore quanto è grande l'oggetto nella realtà." },
      ],
      intermedio: [
        { domanda: "Stai disegnando un corridoio lungo 12 metri. Vuoi che occupi circa 24 cm sul foglio. Quale scala usi?", opzioni: ["1:2", "1:50", "1:20", "1:100"], corretta: 1, feedback: "1200 cm ÷ 50 = 24 cm. Formula inversa: denominatore scala = misura reale ÷ misura foglio = 1200 ÷ 24 = 50. Quindi scala 1:50." },
        { domanda: "Nel disegno tecnico, le quote si riferiscono sempre a...", opzioni: ["Le dimensioni del disegno sul foglio", "Le dimensioni reali dell'oggetto, indipendentemente dalla scala", "La scala usata per il disegno", "Le misure in pollici"], corretta: 1, feedback: "Regola fondamentale: le quote indicano SEMPRE le misure reali. Se cambi scala, le quote restano identiche. Un lettore di un disegno tecnico legge le quote senza bisogno di calcoli." },
        { domanda: "Quale scala è più indicata per disegnare il dettaglio di un gancio lungo 3 cm?", opzioni: ["1:100", "1:50", "5:1 (ingrandimento)", "1:200"], corretta: 2, feedback: "Un oggetto piccolo (3 cm) va ingrandito per mostrare i dettagli: scala 5:1 = ogni cm del reale diventa 5 cm sul foglio. Le scale di ingrandimento (>1:1) si usano per oggetti piccoli o dettagli minuscoli." },
      ],
      avanzato: [
        { domanda: "In un progetto architettonico, quale scala si usa tipicamente per la planimetria generale di un edificio?", opzioni: ["1:1", "1:5", "1:100 o 1:200", "1:1000"], corretta: 2, feedback: "Per edifici interi si usano 1:100 o 1:200 per far stare tutto su un foglio formato A1 o A0. I dettagli costruttivi di nodi o giunzioni si disegnano a 1:5 o 1:2." },
        { domanda: "Qual è la norma ISO che regola le convenzioni di quotatura?", opzioni: ["ISO 9001", "ISO 129", "ISO 31000", "ISO 14001"], corretta: 1, feedback: "ISO 129 (Technical drawings – Indication of dimensions and tolerances) definisce le regole internazionali di quotatura: tipi di linee, frecce, posizione dei numeri, tolleranze." },
        { domanda: "Cosa indica la 'tolleranza' in una quota?", opzioni: ["L'errore fatto dal disegnatore", "L'intervallo di variazione ammissibile della dimensione reale durante la produzione", "La scala del disegno", "Il tipo di materiale usato"], corretta: 1, feedback: "La tolleranza (es. 50 ±0,1 mm) dice al costruttore che la dimensione può variare tra 49,9 e 50,1 mm. Più stretta è la tolleranza, più costosa è la lavorazione. È il linguaggio tra progettista e produttore." },
      ],
    },
  },

  // ── CLASSE 1 — DIG ──────────────────────────────────────────────────────
  "MC-DIG-1-01": {
    id: "MC-DIG-1-01", area: "DIG", anno: 1,
    titolo: "Orientarsi nell'ambiente digitale",
    descrizione: "Sai navigare in un sistema operativo (cartelle, file, applicazioni), conosci i principali componenti hardware e comprendi la differenza tra hardware e software.",
    fonte: "Hypertech 2020",
    livelloDigComp: "F",
    sdg: [4, 9],
    prerequisiti: [],
    hook: {
      titolo: "Cosa c'è dentro il tuo smartphone? Un viaggio nell'hardware",
      domanda: "Hai mai aperto un dispositivo elettronico e visto cosa c'è dentro? Cosa pensi ci sia?",
      durata: "2 min",
    },
    concetto: "L'**hardware** è tutto ciò che puoi toccare fisicamente in un computer: CPU (il processore, il 'cervello'), RAM (memoria di lavoro), SSD (memoria di archiviazione), scheda madre, monitor, tastiera. Il **software** è tutto ciò che non puoi toccare: sistema operativo, applicazioni, dati. Il sistema operativo (Windows, macOS, Linux) è il software che gestisce l'hardware e su cui girano tutte le app.",
    esempio: {
      testo: "Quando avvii il computer: 1) l'hardware si accende, 2) il sistema operativo si carica nella RAM, 3) il desktop appare. Quando salvi un file: i dati vanno da RAM all'SSD. La RAM è velocissima ma si svuota quando spengi; l'SSD è più lento ma conserva tutto.",
      professione: { titolo: "IT Support Specialist / System Administrator", orizzonte: "2030", note: "Gestisce infrastrutture IT, risolve problemi hardware e software, configura reti aziendali." },
    },
    lab: {
      base: "Guarda lo schema fornito dell'anatomia di un computer. Abbina le 5 componenti (CPU, RAM, SSD, scheda madre, monitor) alla loro funzione dalla lista.",
      intermedio: "Apri il 'Gestione attività' (Windows) o 'Monitor attività' (Mac). Osserva quanta RAM e CPU stanno usando le applicazioni aperte. Annota i valori e spiega cosa succede quando apri molte app.",
      avanzato: "Costruisci un glossario personale di 10 termini hardware con immagine trovata online e una spiegazione con parole tue. Poi rispondi: cosa cambia tra uno smartphone e un PC dal punto di vista hardware? E dal punto di vista software?",
    },
    compito_realta: "Smonta virtualmente un vecchio dispositivo: cerca le foto di disassemblaggio del tuo modello di smartphone, identifica 5 componenti interni e spiega la funzione di ciascuno in max 2 righe.",
    quiz: {
      base: [
        { domanda: "Qual è la funzione principale della CPU?", opzioni: ["Memorizzare i dati permanentemente", "Elaborare le istruzioni e i calcoli del computer", "Visualizzare le immagini sul monitor", "Connettere tutti i componenti fisici"], corretta: 1, feedback: "CPU = Central Processing Unit = unità di elaborazione centrale. È il 'cervello' del computer: esegue le istruzioni dei programmi, fa i calcoli, coordina tutto il sistema." },
        { domanda: "Cosa succede ai dati nella RAM quando spengi il computer?", opzioni: ["Rimangono salvati per sempre", "Vengono automaticamente salvati nell'SSD", "Vengono cancellati perché la RAM è memoria volatile", "Vengono inviati al cloud"], corretta: 2, feedback: "La RAM è 'volatile': funziona solo con il computer acceso. Quando spengi, si svuota. Per questo devi salvare i file nell'SSD (o su cloud) prima di spegnere!" },
        { domanda: "Qual è la differenza tra hardware e software?", opzioni: ["Hardware è gratis, software a pagamento", "Hardware si può toccare fisicamente, software no", "Hardware è più importante del software", "Non c'è differenza pratica"], corretta: 1, feedback: "Hardware = componenti fisici (puoi toccarlo). Software = programmi e dati (non puoi toccarlo). Entrambi sono indispensabili: senza hardware il software non gira, senza software l'hardware è inutile." },
      ],
      intermedio: [
        { domanda: "Perché un computer con 16 GB di RAM è più veloce di uno con 4 GB?", opzioni: ["Perché ha un monitor migliore", "Perché può tenere più programmi in esecuzione contemporaneamente senza rallentare", "Perché ha più spazio di archiviazione", "Perché la batteria dura di più"], corretta: 1, feedback: "La RAM è la 'scrivania di lavoro' del computer: più è grande, più 'carte' (programmi) puoi tenere aperte contemporaneamente. Con poca RAM, il computer deve usare l'SSD come scrivania temporanea (molto più lento)." },
        { domanda: "Cosa fa il sistema operativo?", opzioni: ["Solo riproduce musica e video", "Gestisce le risorse hardware e offre un'interfaccia per le applicazioni", "È un tipo di processore avanzato", "Memorizza solo i documenti dell'utente"], corretta: 1, feedback: "Il SO è il 'gestore condominiale' del computer: alloca la RAM tra le app, gestisce i file nell'SSD, controlla l'accesso all'hardware, offre le API che le app usano per funzionare." },
        { domanda: "Cosa significa che un file è nella 'cartella radice' del disco?", opzioni: ["Il file è molto importante", "Il file si trova al livello più alto della struttura di cartelle, fuori da qualsiasi sottocartella", "Il file è nascosto", "Il file è di sistema e non modificabile"], corretta: 1, feedback: "La struttura di cartelle è ad albero: la 'radice' (root) è il livello più alto (es. C:\\ su Windows). Ogni cartella può contenere sottocartelle, creando una gerarchia per organizzare i file." },
      ],
      avanzato: [
        { domanda: "Cosa si intende con 'architettura a 64 bit' di un processore?", opzioni: ["Il processore ha 64 core", "Il processore elabora 64 bit di dati per ciclo, gestendo RAM sopra i 4 GB", "Il processore funziona a 64 GHz", "Il computer ha 64 GB di RAM"], corretta: 1, feedback: "Un processore a 64 bit elabora 64 bit per ciclo (vs. 32 del precedente) e può indirizzare oltre 4 GB di RAM (2^64 indirizzi possibili). I processori a 32 bit erano limitati a 4 GB di RAM massima." },
        { domanda: "Qual è la differenza tra SSD e HDD?", opzioni: ["L'SSD usa dischi magnetici rotanti, l'HDD no", "L'SSD usa memoria flash senza parti meccaniche, l'HDD usa dischi magnetici rotanti — SSD è molto più veloce", "L'HDD è sempre più veloce dell'SSD", "Non c'è differenza di velocità, solo di prezzo"], corretta: 1, feedback: "HDD (Hard Disk Drive) = piatti magnetici che ruotano meccanicamente (lenti, fragili agli urti). SSD (Solid State Drive) = chip di memoria flash senza parti in movimento (3-10x più veloce, più resistente, ma storicamente più costoso)." },
        { domanda: "Cos'è il 'kernel' di un sistema operativo?", opzioni: ["L'interfaccia grafica del desktop", "Il nucleo del SO che gestisce direttamente l'hardware e le risorse di sistema", "Il browser web integrato", "Il programma di aggiornamento automatico"], corretta: 1, feedback: "Il kernel è il cuore del sistema operativo: gira con i massimi privilegi, gestisce memoria, CPU, I/O e sicurezza. Le app non accedono direttamente all'hardware: devono passare attraverso il kernel." },
      ],
    },
  },

  "MC-DIG-1-02": {
    id: "MC-DIG-1-02", area: "DIG", anno: 1,
    titolo: "Ricerca e valutazione delle fonti online",
    descrizione: "Sai formulare query di ricerca efficaci, distingui fonti attendibili da inattendibili usando criteri verificabili, e sai citare correttamente una fonte digitale.",
    fonte: "Hypertech 2020",
    livelloDigComp: "F",
    sdg: [4, 16],
    prerequisiti: ["MC-DIG-1-01"],
    hook: {
      titolo: "Come fanno le fake news a sembrare vere?",
      domanda: "Hai mai condiviso una notizia e poi scoperto che era falsa? Come fai a capire se una fonte è affidabile?",
      durata: "2 min",
    },
    concetto: "Per valutare una fonte online usa il metodo **CRAAP**: **C**urrency (è aggiornata?), **R**elevance (è pertinente?), **A**uthority (chi l'ha scritta? ha competenza?), **A**ccuracy (è verificabile? cita le fonti?), **P**urpose (perché è stata scritta? vende qualcosa? fa propaganda?). Una query di ricerca efficace usa virgolette per frasi esatte, - per escludere parole, site: per cercare in un sito specifico.",
    esempio: {
      testo: "Query inefficace: 'riscaldamento globale'. Query efficace: 'riscaldamento globale' -negazionismo site:gov OR site:edu — cerca solo su siti governativi o universitari, escludendo contenuti negazionisti. Il risultato cambia radicalmente.",
      professione: { titolo: "Information Literacy Specialist / Fact-Checker", orizzonte: "2030", note: "Verifica l'attendibilità delle informazioni per media, organizzazioni e aziende nell'era della disinformazione." },
    },
    lab: {
      base: "Valuta 3 fonti fornite sullo stesso argomento usando la checklist CRAAP pre-stampata. Assegna un punteggio da 1 a 5 per ogni criterio. Quale fonte è più affidabile?",
      intermedio: "Cerca 3 fonti sullo stesso argomento (es. vantaggi del riciclaggio). Sceglile tu autonomamente. Applica CRAAP, confronta i punteggi e spiega in un paragrafo quale sceglieresti e perché.",
      avanzato: "Analizza una notizia virale sui social (fornita dal docente). Risali alla fonte originale usando il fact-checking inverso (cerca il titolo + 'fact check'). Documenta il percorso: quante fonti ti ha portato a visitare prima di trovare quella primaria?",
    },
    compito_realta: "Confronta 3 fonti sullo stesso argomento: valutale con la checklist CRAAP, identifica le differenze tra loro e scegli quella più attendibile motivando la scelta con argomenti specifici (non solo 'è più famosa').",
    quiz: {
      base: [
        { domanda: "Cosa valuta la 'A' di Authority nel metodo CRAAP?", opzioni: ["Se il sito ha molte pubblicità", "La competenza e le credenziali di chi ha scritto il contenuto", "Se il sito ha molti follower sui social", "Se il testo è lungo e dettagliato"], corretta: 1, feedback: "Authority = autorevolezza. Chi ha scritto? Ha competenze certificate nell'argomento? È un ente riconosciuto? Un articolo medico su un sito universitario pesa più di uno su un blog senza autore." },
        { domanda: "Quale estensione di dominio indica generalmente un sito universitario italiano?", opzioni: [".com", ".it", ".edu o .unibo.it", ".org"], corretta: 2, feedback: "In Italia le università usano domini come .unibo.it, .uniroma1.it, .polimi.it. In USA usano .edu. Questi domini indicano istituzioni accademiche — generalmente più affidabili per contenuti scientifici." },
        { domanda: "Perché le virgolette in una query di ricerca sono utili?", opzioni: ["Per cercare il traduttore automatico", "Per trovare pagine che contengono esattamente quella frase nell'ordine indicato", "Per escludere parole dalla ricerca", "Per cercare immagini"], corretta: 1, feedback: "\"ciclo di vita dei materiali\" con virgolette trova pagine con quella frase esatta. Senza virgolette, il motore cerca pagine con quelle parole in qualsiasi ordine e posizione — risultati molto più dispersi." },
      ],
      intermedio: [
        { domanda: "Una notizia è pubblicata il 15 marzo da un giornale noto. Il 16 marzo viene smentita dallo stesso giornale. Cosa devi controllare prima di condividerla?", opzioni: ["Se ha molti like", "La data di pubblicazione e se esistono aggiornamenti o smentite successive", "Se è scritta in italiano corretto", "Se il giornale ha un sito web professionale"], corretta: 1, feedback: "La 'C' di Currency (aggiornamento) è cruciale: le notizie evolvono. Prima di condividere, controlla se ci sono aggiornamenti o smentite — spesso basta aggiungere 'aggiornamento' o 'smentita' nella query." },
        { domanda: "Cosa indica il parametro 'site:' in una query Google?", opzioni: ["Cerca siti con molte immagini", "Limita la ricerca a un dominio specifico (es. site:wikipedia.org)", "Cerca solo in italiano", "Ordina i risultati per data"], corretta: 1, feedback: "site:dominio.it limita i risultati a quel sito specifico. Esempio: 'effetto serra site:nasa.gov' cerca solo sul sito NASA. Utile per trovare informazioni da fonti autorevoli specifiche." },
        { domanda: "Cosa si intende con 'cherry-picking' delle informazioni?", opzioni: ["Selezionare solo le informazioni che confermano la tesi, ignorando quelle contrarie", "Citare troppe fonti in un testo", "Usare solo fonti in inglese", "Copiare testo da Wikipedia"], corretta: 0, feedback: "Il cherry-picking (raccogliere le ciliegie migliori) è una distorsione cognitiva: si selezionano solo i dati favorevoli, ignorando quelli contraddittori. È tecnicamente non falso, ma manipolatorio." },
      ],
      avanzado: [
        { domanda: "Cos'è il 'bias di conferma' e come influisce sulla ricerca online?", opzioni: ["Un errore tecnico nei motori di ricerca", "La tendenza a cercare e credere informazioni che confermano le proprie convinzioni preesistenti", "Un tipo di spam nei risultati di ricerca", "La preferenza dei motori di ricerca per i siti a pagamento"], corretta: 1, feedback: "Il bias di conferma ci porta a formulare query che già implicano la risposta ('prove che X fa male') e a ignorare risultati contrari. I motori di ricerca amplificano questo con l'algoritmo di personalizzazione." },
        { domanda: "Come funziona il fact-checking inverso (reverse fact-checking)?", opzioni: ["Si chiede a un esperto di verificare la notizia", "Si cerca la notizia su motori di fact-checking (Snopes, Bufale.net) e si risale alla fonte primaria originale", "Si traduce la notizia in un'altra lingua e si controlla", "Si conta il numero di condivisioni per valutare l'affidabilità"], corretta: 1, feedback: "Il reverse fact-checking parte dalla notizia sospetta e risale alla fonte primaria: chi l'ha pubblicata per primo? Cosa diceva realmente? Spesso le notizie virali sono decontestualizzate o modificate lungo la catena di condivisione." },
        { domanda: "Perché un articolo con molte citazioni bibliografiche non è automaticamente affidabile?", opzioni: ["Perché le citazioni rallentano la lettura", "Perché le citazioni potrebbero essere mal interpretate, fuori contesto, o tratte da fonti non peer-reviewed", "Perché gli articoli con citazioni sono pagati", "Perché solo Wikipedia può citare fonti"], corretta: 1, feedback: "La quantità non garantisce qualità. Le citazioni vanno verificate: il paper citato dice davvero quello che afferma l'articolo? È peer-reviewed? È una singola ricerca o c'è consenso? Il citation washing è una tecnica di pseudoscienza." },
      ],
    },
  },

  // ── STUB PER CLASSE 2 ────────────────────────────────────────────────────
  "MC-ALI-2-01": { id:"MC-ALI-2-01", area:"ALI", anno:2, titolo:"La filiera alimentare", descrizione:"Conosci le fasi dalla produzione agricola alla tavola.", fonte:"Hypertech 2020", livelloDigComp:"F", sdg:[2], prerequisiti:[], hook:{titolo:"Da dove viene il tuo cibo?",domanda:"Quanti passaggi fa un pomodoro prima di finire nel tuo piatto?",durata:"2 min"}, concetto:"La filiera alimentare comprende produzione → trasformazione → distribuzione → consumo → smaltimento.", esempio:{testo:"Il pomodoro: coltivato in Sicilia, trasformato in salsa a Parma, distribuito da un centro logistico lombardo, acquistato al supermercato.",professione:{titolo:"Food Supply Chain Manager",orizzonte:"2030",note:"Ottimizza la filiera alimentare per ridurre sprechi e garantire sicurezza."}}, lab:{base:"Mappa la filiera di un alimento semplice.",intermedio:"Confronta la filiera di un prodotto locale e uno importato.",avanzato:"Calcola l'impronta idrica e di carbonio di un pasto tipo."}, compito_realta:"Traccia la filiera completa di un pasto della tua mensa scolastica.", quiz:{base:[{domanda:"Qual è la prima fase della filiera alimentare?",opzioni:["Distribuzione","Trasformazione","Produzione agricola","Consumo"],corretta:2,feedback:"La filiera parte dalla produzione agricola: coltivazione, allevamento, pesca."},{domanda:"Cosa si intende per 'km 0'?",opzioni:["Cibo gratuito","Cibo prodotto localmente, vicino al luogo di consumo","Cibo senza calorie","Cibo congelato"],corretta:1,feedback:"Km 0 = prodotto e consumato nello stesso territorio: meno trasporti, meno emissioni, più fresco."},{domanda:"Cosa studia l'etichetta nutrizionale?",opzioni:["Il prezzo del prodotto","I valori energetici e i nutrienti presenti","La data di scadenza","Il produttore"],corretta:1,feedback:"L'etichetta nutrizionale riporta calorie, grassi, carboidrati, proteine, sale — obbligatoria in EU dal 2016."}],intermedio:[{domanda:"Cosa causa lo 'spreco alimentare'?",opzioni:["Solo il consumatore finale","Ogni fase della filiera: produzione, trasformazione, distribuzione, consumo",  "Solo la grande distribuzione","Solo la stagionalità"],corretta:1,feedback:"Lo spreco avviene in ogni fase: 20-30% in campo (raccolta), in lavorazione, nei magazzini, nella distribuzione e a casa."},{domanda:"Cosa significa 'stagionalità' di un prodotto?",opzioni:["Il prodotto è disponibile tutto l'anno","Il prodotto è disponibile solo in certi periodi dell'anno nel suo ambiente naturale","Il prodotto è di stagione per motivi fiscali","Il prodotto viene venduto solo d'estate"],corretta:1,feedback:"I prodotti stagionali maturano naturalmente in certi periodi. Fuori stagione si coltivano in serra o si importano — più energia consumata, meno gusto."},{domanda:"Cosa garantisce il marchio DOP?",opzioni:["Il prodotto costa di meno","Il prodotto è stato integralmente prodotto e trasformato in una zona geografica specifica con metodo tradizionale","Il prodotto è biologico","Il prodotto è stato testato in laboratorio"],corretta:1,feedback:"DOP = Denominazione di Origine Protetta. Certifica che produzione, trasformazione e elaborazione avvengono in una zona specifica secondo un disciplinare preciso."}],avanzato:[{domanda:"Cosa si intende con 'food system resilience'?",opzioni:["La capacità di un sistema alimentare di resistere agli shock (clima, crisi, pandemia) e riprendersi rapidamente","La qualità nutrizionale degli alimenti","La velocità della distribuzione alimentare","Il numero di prodotti disponibili"],corretta:0,feedback:"Un sistema alimentare resiliente non si blocca davanti a crisi: diversifica le fonti, riduce le dipendenze da filiere lunghe, mantiene riserve strategiche."},{domanda:"L'acquaponics combina quali due sistemi?",opzioni:["Agricoltura verticale e idroponica","Acquacoltura (pesci) e idroponica (piante): i rifiuti dei pesci nutrono le piante",  "Pesca e agricoltura tradizionale","Allevamento bovino e cerealicoltura"],corretta:1,feedback:"In acquaponica i pesci producono ammoniaca → batteri la convertono in nitrati → le piante li assorbono come fertilizzante → l'acqua purificata torna ai pesci. Sistema chiuso, zero fertilizzanti."},{domanda:"Perché la biodiversità agricola è a rischio?",opzioni:["Perché i contadini vogliono coltivare meno specie","Perché l'agricoltura industriale predilige poche varietà ad alta resa, abbandonando migliaia di varietà tradizionali","Perché il clima è troppo stabile","Perché le piante moderne resistono alle malattie"],corretta:1,feedback:"Il 75% della diversità genetica delle colture è andata perduta dal 1900. L'agricoltura industriale seleziona poche varietà ad alta resa e resistenza agli erbicidi, rendendo i sistemi agricoli vulnerabili a nuovi parassiti."}]},
  },

  "MC-AMB-2-01": { id:"MC-AMB-2-01", area:"AMB", anno:2, titolo:"La città sostenibile", descrizione:"Conosci i principi dell'urbanistica sostenibile e sai analizzare il tuo territorio.", fonte:"Paci 2014", livelloDigComp:"I", sdg:[11], prerequisiti:[], hook:{titolo:"Perché alcune città respirano meglio di altre?",domanda:"Cosa rende una città più vivibile e sostenibile?",durata:"2 min"}, concetto:"Una città sostenibile bilancia densità abitativa, verde urbano, mobilità, efficienza energetica degli edifici e servizi pubblici.", esempio:{testo:"Copenhagen: 62% degli spostamenti in bici, obiettivo carbon neutral 2025, tetti verdi obbligatori nelle nuove costruzioni.",professione:{titolo:"Urban Planner Sostenibile",orizzonte:"2030",note:"Progetta spazi urbani che integrano verde, mobilità e qualità della vita."}}, lab:{base:"Analizza una cartina del tuo comune: conta parchi, piste ciclabili, fermate bus.",intermedio:"Proponi 3 interventi migliorativi per il tuo quartiere con motivazione.",avanzato:"Disegna la planimetria di un isolato eco-sostenibile."}, compito_realta:"Elabora un 'piano di miglioramento' per un'area del tuo comune con proposta grafica.", quiz:{base:[{domanda:"Cosa si intende per 'isola di calore urbana'?",opzioni:["Un parco molto soleggiato","Il fenomeno per cui le città sono più calde delle aree rurali circostanti","Un quartiere con molte piscine","Una zona industriale ad alta temperatura"],corretta:1,feedback:"Il cemento e l'asfalto assorbono calore durante il giorno e lo rilasciano di notte: le città sono 2-5°C più calde delle campagne circostanti. Il verde urbano mitiga questo effetto."},{domanda:"Cosa fa una 'pista ciclabile protetta'?",opzioni:["Permette solo ai bambini di usare la bici","Separa fisicamente i ciclisti dal traffico motorizzato con cordoli o verde","Accelera il traffico delle auto","È una pista solo su carta"],corretta:1,feedback:"La 'protezione' fisica (cordoli, aiuole, parcheggi come buffer) riduce gli incidenti e aumenta l'uso della bici anche da parte di chi non si sente sicuro tra le macchine."},{domanda:"Quale SDG riguarda le città sostenibili?",opzioni:["SDG 3","SDG 7","SDG 11","SDG 15"],corretta:2,feedback:"SDG 11: Città e comunità sostenibili. Obiettivo: rendere le città inclusive, sicure, resilienti e sostenibili entro il 2030."}],intermedio:[{domanda:"Cosa si intende con 'città dei 15 minuti'?",opzioni:["Una città molto piccola","Un modello urbano dove ogni servizio essenziale è raggiungibile a piedi o in bici in 15 minuti da casa","Una città con traffico limitato","Una città con molti fast food"],corretta:1,feedback:"Il modello '15 minuti' (proposto dall'urbanista Carlos Moreno) ridisegna i quartieri per mettere lavoro, scuola, sanità, cultura e verde a distanza pedonale o ciclabile da ogni abitazione."},{domanda:"Cosa fa un 'tetto verde' su un edificio?",opzioni:["Rende l'edificio più alto","Isola termicamente, riduce il deflusso delle acque piovane e crea biodiversità urbana","Produce energia solare","Riduce i costi di costruzione"],corretta:1,feedback:"I tetti verdi (green roofs) hanno 3 funzioni: isolamento termico (meno riscaldamento e raffrescamento), gestione delle acque piovane (assorbimento), e creazione di habitat per insetti e uccelli."},{domanda:"Qual è il principale vantaggio del trasporto pubblico rispetto all'auto privata per la città?",opzioni:["È sempre più veloce","Occupa meno spazio per persona trasportata e inquina meno","Costa meno a tutti","Non causa mai ritardi"],corretta:1,feedback:"Un autobus occupa lo spazio di 3 auto ma ne trasporta 50 passeggeri. Un tram occupa lo spazio di 2 auto ma trasporta 200. La città ha spazio limitato: il trasporto pubblico è molto più efficiente."}],avanzato:[{domanda:"Cosa si intende con 'densification' in urbanistica?",opzioni:["Aumentare il numero di alberi in città","Aumentare la densità abitativa in zone già urbanizzate invece di espandere la città su nuovo suolo","Ridurre il numero di abitanti","Costruire grattacieli invece di case basse"],corretta:1,feedback:"La densification (densificazione) è la strategia opposta allo sprawl: si costruisce di più nelle aree già urbanizzate invece di consumare nuovo suolo agricolo o naturale. Riduce mobilità, infrastrutture, consumi."},{domanda:"Cos'è il 'Piano Regolatore Generale' (PRG)?",opzioni:["Il piano del sindaco per le elezioni","Lo strumento urbanistico che regola l'uso del suolo nel territorio comunale","Il bilancio comunale","Il piano delle strade comunali"],corretta:1,feedback:"Il PRG definisce: dove si può costruire, cosa (residenziale, commerciale, industriale, verde), a quale densità. È il 'contratto' tra il comune e i suoi cittadini sull'uso del territorio."},{domanda:"Perché l''approccio Nature-Based Solutions' (NbS) è rilevante per le città?",opzioni:["Perché elimina il bisogno di infrastrutture","Perché usa processi naturali (verde, acqua, suolo) per risolvere sfide urbane (calore, alluvioni, biodiversità) con co-benefici multipli","Perché è sempre meno costoso delle soluzioni tecniche","Perché non richiede pianificazione"],corretta:1,feedback:"Le NbS usano la natura come infrastruttura: una fascia boscata riduce rumore e inquinamento; un parco fluviale gestisce le alluvioni; un'area umida filtra l'acqua. Multifunzionali e auto-mantenute nel tempo."}]},
  },

  // ── STUB PER CLASSE 3 ────────────────────────────────────────────────────
  "MC-ENE-3-01": { id:"MC-ENE-3-01", area:"ENE", anno:3, titolo:"Fonti di energia e conversioni", descrizione:"Conosci le principali fonti di energia (rinnovabili e non) e i principi di conversione energetica.", fonte:"Paci 2014", livelloDigComp:"I", sdg:[7], prerequisiti:[], hook:{titolo:"Perché le luci si accendono quando schiocchi un interruttore?",domanda:"Sai quante trasformazioni di energia ci sono tra il carbone di una centrale e la luce della tua lampada?",durata:"3 min"}, concetto:"L'energia si trasforma ma non si crea né si distrugge (1° principio della termodinamica). Le fonti si dividono in rinnovabili (sole, vento, acqua, geotermia, biomasse) e non rinnovabili (carbone, petrolio, gas, nucleare).", esempio:{testo:"Una turbina eolica: energia cinetica del vento → rotazione del rotore → generatore elettrico → elettricità in rete. Efficienza tipica: 35-45%.",professione:{titolo:"Energy Engineer / Renewable Energy Specialist",orizzonte:"2030",note:"Progetta e gestisce impianti di energia rinnovabile: fotovoltaico, eolico, idroelettrico."}}, lab:{base:"Classifica 10 fonti di energia in rinnovabili e non rinnovabili.",intermedio:"Calcola il risparmio energetico di sostituire le lampadine di casa con LED.",avanzato:"Progetta l'impianto fotovoltaico per la tua scuola: calcola la superficie necessaria e l'energia producibile."}, compito_realta:"Analizza la bolletta elettrica di casa: identifica consumo, fascia oraria, costo per kWh e proponi 3 azioni per ridurre il consumo.", quiz:{base:[{domanda:"Quale fonte di energia è rinnovabile?",opzioni:["Carbone","Petrolio","Energia solare","Gas naturale"],corretta:2,feedback:"L'energia solare è rinnovabile perché il Sole continuerà a emettere luce per altri 5 miliardi di anni. Carbone, petrolio e gas si esauriscono."},{domanda:"Cosa fa un generatore elettrico?",opzioni:["Converte elettricità in luce","Converte energia meccanica (movimento) in energia elettrica","Immagazzina energia","Converte luce in calore"],corretta:1,feedback:"Il generatore (principio di Faraday) converte il movimento rotatorio in corrente elettrica. È il cuore di ogni centrale: termoelettrica, idroelettrica, eolica."},{domanda:"Quale fonte produce più CO₂ per kWh prodotto?",opzioni:["Fotovoltaico","Eolico","Carbone","Nucleare"],corretta:2,feedback:"Il carbone produce circa 820 g CO₂/kWh. Il gas ~490 g. Il nucleare e il fotovoltaico producono <50 g/kWh nel ciclo di vita completo."}],intermedio:[{domanda:"Cos'è l'efficienza energetica di un impianto?",opzioni:["La quantità di energia prodotta","Il rapporto tra energia utile prodotta e energia totale consumata, espresso in percentuale","Il costo dell'energia prodotta","La potenza massima dell'impianto"],corretta:1,feedback:"Efficienza = energia utile / energia totale × 100%. Una lampadina tradizionale è efficiente al 5% (il 95% diventa calore). Un LED è efficiente al 30-40%."},{domanda:"Cosa si intende con 'mix energetico'?",opzioni:["Un tipo di carburante per auto","La combinazione di diverse fonti energetiche usate in un paese o sistema","Un programma di risparmio energetico","Un tipo di batteria per auto elettriche"],corretta:1,feedback:"Il mix energetico descrive la proporzione di ciascuna fonte nel totale della produzione elettrica nazionale. L'Italia ha un mix con gas, rinnovabili e importazioni."},{domanda:"Perché l'energia eolica e solare non sono 'programmabili'?",opzioni:["Perché costano troppo","Perché producono quando le condizioni naturali lo permettono, non necessariamente quando c'è domanda","Perché non sono abbastanza potenti","Perché richiedono troppa manutenzione"],corretta:1,feedback:"Il vento non soffia e il sole non splende sempre quando vogliamo elettricità. Questo 'problema di intermittenza' richiede sistemi di accumulo (batterie) o fonti di backup programmabili (gas, idroelettrico)."}],avanzato:[{domanda:"Cos'è la 'grid parity' nelle energie rinnovabili?",opzioni:["La parità di potenza tra rete elettrica e impianto","Il momento in cui il costo del kWh da fonte rinnovabile eguaglia quello da fonte fossile senza sussidi","La distribuzione uniforme dell'energia sulla rete","La capacità massima della rete elettrica"],corretta:1,feedback:"La grid parity è il punto di svolta economico: solare e eolico hanno raggiunto la grid parity in molti mercati, rendendo conveniente installarli senza incentivi statali."},{domanda:"Cos'è l'effetto Joule e quando è un problema?",opzioni:["La produzione di elettricità dal calore","La dispersione di energia come calore quando la corrente attraversa un conduttore con resistenza","L'accumulo di carica in un condensatore","La riflessione della luce su un pannello solare"],corretta:1,feedback:"Effetto Joule: I²R. Ogni metro di cavo elettrico perde energia come calore per via della resistenza. Le linee ad alta tensione (kV) trasmettono a bassa corrente (I piccola → I²R piccolo) per ridurre queste perdite."},{domanda:"Perché i sistemi di accumulo energetico (batterie) sono considerati la chiave della transizione energetica?",opzioni:["Perché sostituiscono le centrali nucleari","Perché risolvono il problema dell'intermittenza delle rinnovabili, permettendo di usare l'energia quando serve","Perché sono più economici del fotovoltaico","Perché producono energia direttamente"],corretta:1,feedback:"Le batterie (e altri sistemi di accumulo: idrogeno, pompaggi idroelettrici) disaccoppiano produzione e consumo: si accumula quando le rinnovabili producono di più del consumo, si scarica quando producono meno."}]},
  },
};

// ── MAPPA AREA → MC PER ANNO ────────────────────────────────────────────────
const AREA_MC_MAP = {};
Object.values(MC_DATABASE).forEach(mc => {
  const key = `${mc.anno}-${mc.area}`;
  if (!AREA_MC_MAP[key]) AREA_MC_MAP[key] = [];
  AREA_MC_MAP[key].push(mc);
});

// ── COMPONENTI UI BASE ──────────────────────────────────────────────────────
const Badge = ({ children, className = "" }) => (
  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${className}`}>{children}</span>
);

const Pill = ({ label, active, onClick, className = "" }) => (
  <button onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${active
      ? "bg-gray-900 text-white shadow-sm"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200"} ${className}`}>
    {label}
  </button>
);

const ProgressRing = ({ pct, size = 48, stroke = 4 }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#10b981" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        className="rotate-90 fill-gray-700 text-xs font-bold" style={{fontSize:11, transform:`rotate(90deg) translate(-${size/2}px, -${size/2}px)`}}>
        {pct}%
      </text>
    </svg>
  );
};

// ── VISTA: QUIZ ─────────────────────────────────────────────────────────────
function QuizView({ mc, livello, onClose, onComplete }) {
  const domande = mc.quiz[livello] || [];
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [corrette, setCorrette] = useState(0);

  const d = domande[idx];

  const handleAnswer = (i) => {
    if (revealed) return;
    setSel(i);
    setRevealed(true);
    if (i === d.corretta) setCorrette(c => c + 1);
  };

  const next = () => {
    if (idx < domande.length - 1) {
      setIdx(i => i + 1);
      setSel(null);
      setRevealed(false);
    } else {
      onComplete(corrette + (sel === d.corretta ? 0 : 0), domande.length);
    }
  };

  const livelloLabel = { base: "● Base", intermedio: "●● Intermedio", avanzato: "●●● Avanzato" }[livello];
  const cfg = AREA_CONFIG[mc.area];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <span className={`text-sm font-semibold ${cfg.badge} px-3 py-1 rounded-full`}>{livelloLabel}</span>
          <span className="text-sm text-gray-500">{idx + 1} / {domande.length}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
          <div className={`h-1.5 rounded-full transition-all ${cfg.btn.split(" ")[0]}`}
            style={{ width: `${((idx + 1) / domande.length) * 100}%` }} />
        </div>

        <p className="text-base font-semibold text-gray-800 mb-5 leading-relaxed">{d.domanda}</p>

        <div className="space-y-3 mb-6">
          {d.opzioni.map((op, i) => {
            let cls = "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ";
            if (!revealed) cls += "border-gray-200 hover:border-gray-400 hover:bg-gray-50 cursor-pointer";
            else if (i === d.corretta) cls += "border-green-500 bg-green-50 text-green-800";
            else if (i === sel && i !== d.corretta) cls += "border-red-400 bg-red-50 text-red-700";
            else cls += "border-gray-200 text-gray-400 cursor-not-allowed";
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                <span className="inline-block w-5 text-gray-400">{["A","B","C","D"][i]}.</span> {op}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className={`rounded-xl p-4 mb-4 ${sel === d.corretta ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
            <p className="text-sm text-gray-700">{d.feedback}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Esci</button>
          {revealed && (
            <button onClick={next} className={`flex-1 py-2 rounded-xl text-white text-sm font-semibold ${cfg.btn}`}>
              {idx < domande.length - 1 ? "Prossima →" : "Fine quiz 🎉"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── VISTA: DETTAGLIO MC ─────────────────────────────────────────────────────
function MCDetailView({ mc, progress, onBack, onUpdateProgress }) {
  const [zona, setZona] = useState(0);
  const [quizLivello, setQuizLivello] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const cfg = AREA_CONFIG[mc.area];

  const zone = [
    { icon: Volume2, label: "Hook", color: "text-orange-500" },
    { icon: Eye, label: "Concetto", color: "text-blue-500" },
    { icon: Star, label: "Esempio", color: "text-amber-500" },
    { icon: Beaker, label: "Laboratorio", color: "text-purple-500" },
    { icon: Target, label: "Compito", color: "text-green-500" },
  ];

  const livelli = ["base", "intermedio", "avanzato"];

  const handleQuizComplete = (corrette, tot) => {
    const score = Math.round((corrette / tot) * 100);
    setQuizResult({ corrette, tot, score });
    setQuizLivello(null);
    onUpdateProgress(mc.id, { quizDone: true, quizScore: score, zoneVisited: progress?.zoneVisited || 0 });
  };

  const markZonaVisited = (z) => {
    setZona(z);
    const prev = progress?.zoneVisited || 0;
    if (z + 1 > prev) onUpdateProgress(mc.id, { zoneVisited: z + 1, quizDone: progress?.quizDone, quizScore: progress?.quizScore });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {quizLivello && (
        <QuizView mc={mc} livello={quizLivello}
          onClose={() => setQuizLivello(null)}
          onComplete={handleQuizComplete} />
      )}

      {/* Header */}
      <div className={`${cfg.bg} border-b ${cfg.border}`}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3">
            <ArrowLeft size={16} /> Torna alle MC
          </button>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge className={cfg.badge}>{mc.id}</Badge>
              <h1 className="text-xl font-bold text-gray-900 mt-1 leading-tight">{mc.titolo}</h1>
              <p className="text-sm text-gray-600 mt-1">{mc.descrizione}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <ProgressRing pct={Math.round(((progress?.zoneVisited || 0) / 5 + (progress?.quizDone ? 0.2 : 0)) * 100 * 5 / 6)} />
              <span className="text-xs text-gray-500">completato</span>
            </div>
          </div>

          {/* SDG badges */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {mc.sdg?.map(s => <Badge key={s} className="bg-blue-100 text-blue-700">🎯 SDG {s}</Badge>)}
            <Badge className="bg-gray-100 text-gray-600">DigComp {mc.livelloDigComp}</Badge>
          </div>
        </div>
      </div>

      {/* Zone tabs */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-4 overflow-x-auto">
          {zone.map((z, i) => {
            const Icon = z.icon;
            const visited = (progress?.zoneVisited || 0) > i;
            return (
              <button key={i} onClick={() => markZonaVisited(i)}
                className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg transition-all min-w-0 ${zona === i ? `${cfg.light} ${cfg.ring.replace("ring","border").replace("400","200")} border` : "hover:bg-gray-50"}`}>
                <div className="relative">
                  <Icon size={16} className={zona === i ? z.color : "text-gray-400"} />
                  {visited && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />}
                </div>
                <span className={`text-xs mt-0.5 font-medium truncate w-full text-center ${zona === i ? "text-gray-800" : "text-gray-400"}`}>{z.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contenuto zona */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
          {zona === 0 && (
            <div>
              <div className={`flex items-center gap-3 ${cfg.light} rounded-xl p-4 mb-4`}>
                <div className="text-3xl">🎙️</div>
                <div>
                  <p className="font-bold text-gray-800">{mc.hook.titolo}</p>
                  <p className="text-sm text-gray-500">Podcast · {mc.hook.durata}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 mb-4">
                <Play size={20} className="text-gray-400 flex-shrink-0" />
                <p className="text-gray-600 italic text-sm">"{mc.hook.domanda}"</p>
              </div>
              <p className="text-sm text-gray-500">🎧 Ascolta la storia prima di proseguire con il concetto.</p>
            </div>
          )}

          {zona === 1 && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Eye size={16} className="text-blue-500" /> Concetto</h3>
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">{mc.concetto}</p>
              <div className={`mt-4 ${cfg.light} rounded-xl p-3`}>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Fonte</p>
                <p className="text-sm text-gray-700">{mc.fonte}</p>
              </div>
            </div>
          )}

          {zona === 2 && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Star size={16} className="text-amber-500" /> Esempio reale</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-4">{mc.esempio.testo}</p>
              <div className="border border-dashed border-gray-200 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">👔 Professione del futuro · {mc.esempio.professione.orizzonte}</p>
                <p className="font-semibold text-gray-800 text-sm">{mc.esempio.professione.titolo}</p>
                <p className="text-xs text-gray-500 mt-1">{mc.esempio.professione.note}</p>
              </div>
            </div>
          )}

          {zona === 3 && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Beaker size={16} className="text-purple-500" /> Laboratorio</h3>
              {["base", "intermedio", "avanzato"].map((lv, li) => (
                <div key={lv} className="mb-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{"●".repeat(li+1)} {lv.charAt(0).toUpperCase() + lv.slice(1)}</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{mc.lab[lv]}</p>
                </div>
              ))}
            </div>
          )}

          {zona === 4 && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Target size={16} className="text-green-500" /> Compito di realtà</h3>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">{mc.compito_realta}</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1 font-medium">Criteri di valutazione</p>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  <li>● Completezza dell'analisi</li>
                  <li>●● Precisione e uso dei concetti</li>
                  <li>●●● Originalità e collegamento a esperienze reali</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Quiz section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
          <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2"><Zap size={16} className="text-yellow-500" /> Quiz adattivi</h3>
          <p className="text-xs text-gray-500 mb-4">3 domande per livello · Scegli il tuo livello di sfida</p>

          {quizResult && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-center gap-3">
              <Award size={20} className="text-emerald-500" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">{quizResult.corrette}/{quizResult.tot} corrette · {quizResult.score}%</p>
                <p className="text-xs text-emerald-600">{quizResult.score === 100 ? "Perfetto! 🏆" : quizResult.score >= 67 ? "Ben fatto! Riprova per il punteggio pieno." : "Rileggi il concetto e riprova!"}</p>
              </div>
              <button onClick={() => setQuizResult(null)} className="ml-auto text-emerald-500 hover:text-emerald-700"><RotateCcw size={14}/></button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {livelli.map((lv, li) => (
              <button key={lv} onClick={() => setQuizLivello(lv)}
                className={`p-3 rounded-xl border-2 text-center transition-all hover:shadow-sm ${cfg.border} hover:${cfg.bg}`}>
                <p className="text-lg mb-0.5">{"●".repeat(li+1)}</p>
                <p className="text-xs font-semibold text-gray-700 capitalize">{lv}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Prerequisiti */}
        {mc.prerequisiti?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Prerequisiti</p>
            <div className="flex flex-wrap gap-2">
              {mc.prerequisiti.map(p => (
                <Badge key={p} className="bg-gray-100 text-gray-600">{p}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── VISTA: LISTA MC ─────────────────────────────────────────────────────────
function MCListView({ anno, area, progress, onSelectMC, onBack }) {
  const cfg = AREA_CONFIG[area];
  const mcs = AREA_MC_MAP[`${anno}-${area}`] || [];

  const getCompletionPct = (mcId) => {
    const p = progress[mcId];
    if (!p) return 0;
    return Math.min(100, Math.round(((p.zoneVisited || 0) / 5 + (p.quizDone ? 0.2 : 0)) * 100 * 5 / 6));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${cfg.bg} border-b ${cfg.border}`}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2">
            <ArrowLeft size={16} /> Dashboard
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{cfg.emoji}</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{cfg.label}</h1>
              <p className="text-sm text-gray-500">{mcs.length} micro-competenz{mcs.length === 1 ? "a" : "e"} · Classe {anno}ª</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {mcs.length === 0 && (
          <div className="text-center py-12">
            <Lock size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Contenuti in arrivo per questa area.</p>
          </div>
        )}
        {mcs.map((mc, i) => {
          const pct = getCompletionPct(mc.id);
          const started = pct > 0;
          const completed = pct >= 95;
          return (
            <button key={mc.id} onClick={() => onSelectMC(mc)}
              className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {completed ? <CheckCircle size={20} className="text-green-500" /> :
                    started ? <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center"><div className="w-2 h-2 bg-amber-400 rounded-full" /></div> :
                    <Circle size={20} className="text-gray-300" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={cfg.badge}>{mc.id}</Badge>
                    <Badge className="bg-gray-100 text-gray-500">DC {mc.livelloDigComp}</Badge>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm leading-snug">{mc.titolo}</p>
                  {started && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-100 rounded-full h-1">
                        <div className="bg-green-400 h-1 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── VISTA: DASHBOARD ────────────────────────────────────────────────────────
function DashboardView({ anno, setAnno, progress, onSelectArea }) {
  const aree = ANNO_AREE[anno];
  const totalMC = Object.values(MC_DATABASE).filter(mc => mc.anno === anno).length;
  const doneMC = Object.values(MC_DATABASE).filter(mc => mc.anno === anno && (progress[mc.id]?.zoneVisited || 0) >= 5).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} className="text-indigo-600" />
            <span className="font-bold text-indigo-600 text-sm tracking-wide">TecnologIA</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Il tuo percorso</h1>
          <p className="text-sm text-gray-500">{doneMC}/{totalMC} MC completate · Classe {anno}ª</p>

          {totalMC > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.round((doneMC / totalMC) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* Selezione anno */}
        <div className="flex gap-2 mb-5">
          {[1,2,3].map(a => (
            <Pill key={a} label={`Classe ${a}ª`} active={anno === a} onClick={() => setAnno(a)} />
          ))}
        </div>

        {/* Griglia aree */}
        <div className="grid grid-cols-2 gap-3">
          {aree.map(area => {
            const cfg = AREA_CONFIG[area];
            const mcs = AREA_MC_MAP[`${anno}-${area}`] || [];
            const done = mcs.filter(mc => (progress[mc.id]?.zoneVisited || 0) >= 5).length;
            const hasContent = mcs.length > 0;

            return (
              <button key={area} onClick={() => hasContent && onSelectArea(area)}
                className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4 text-left transition-all ${hasContent ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : "opacity-60 cursor-default"}`}>
                <div className="text-3xl mb-2">{cfg.emoji}</div>
                <p className="font-bold text-gray-800 text-sm leading-snug">{cfg.label}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {hasContent ? `${mcs.length} MC · ${done} completate` : "In arrivo"}
                </p>
                {hasContent && mcs.length > 0 && (
                  <div className="mt-2 w-full bg-white bg-opacity-60 rounded-full h-1">
                    <div className={`${cfg.btn.split(" ")[0]} h-1 rounded-full transition-all`}
                      style={{ width: `${Math.round((done / mcs.length) * 100)}%` }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Statistiche */}
        <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">I tuoi progressi</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "MC avviate", val: Object.keys(progress).filter(k => (progress[k]?.zoneVisited || 0) > 0).length },
              { label: "Quiz fatti", val: Object.keys(progress).filter(k => progress[k]?.quizDone).length },
              { label: "Score medio", val: (() => { const scores = Object.values(progress).filter(p => p?.quizScore).map(p => p.quizScore); return scores.length ? Math.round(scores.reduce((a,b) => a+b,0)/scores.length)+"%" : "—"; })() },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-gray-800">{s.val}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [anno, setAnno] = useState(1);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedMC, setSelectedMC] = useState(null);
  const [progress, setProgress] = useState({});

  const updateProgress = (mcId, data) => {
    setProgress(prev => ({ ...prev, [mcId]: { ...(prev[mcId] || {}), ...data } }));
  };

  const handleSelectArea = (area) => { setSelectedArea(area); setSelectedMC(null); };
  const handleBack = () => { if (selectedMC) setSelectedMC(null); else setSelectedArea(null); };

  if (selectedMC) {
    return <MCDetailView mc={selectedMC} progress={progress[selectedMC.id]}
      onBack={handleBack} onUpdateProgress={updateProgress} />;
  }
  if (selectedArea) {
    return <MCListView anno={anno} area={selectedArea} progress={progress}
      onSelectMC={setSelectedMC} onBack={handleBack} />;
  }
  return <DashboardView anno={anno} setAnno={setAnno} progress={progress}
    onSelectArea={handleSelectArea} />;
}
