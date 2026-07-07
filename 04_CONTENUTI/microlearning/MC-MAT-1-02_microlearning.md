# Modulo Microlearning — MC-MAT-1-02
## Ciclo di vita dei materiali e cicli tecnologici

> **Pipeline:** Interview Agent → DigComp Engine → Coassemble Builder → DigComp Validator  
> **Data produzione:** 2026-05-10  
> **Versione:** v1.0  
> **Stato:** ✅ APPROVATO — Score 94/100

---

## FASE A — Course Brief

```json
{
  "course_brief": {
    "target": "Studenti di classe 1ª, scuola secondaria I grado",
    "contesto": "MAT — Ciclo di vita dei materiali e cicli tecnologici (MC-MAT-1-02)",
    "obiettivo_operativo": "Tracciare il 'passaporto tecnologico' di un oggetto: mappare le 7 fasi del ciclo tecnologico, identificare i soggetti responsabili per ogni fase e il principale impatto ambientale, individuare dove può intervenire il consumatore",
    "livello_digcomp": "F — Foundation (livelli 1–2)",
    "competenza_dc": "1.3 Gestire dati, informazioni e contenuti digitali — Livello F",
    "durata_target": "5–8 min (target Foundation; modulo attuale ~8–10 min per ricchezza di contenuto)",
    "tipo_apprendimento": "misto — concettuale (7 fasi del ciclo) + procedurale (mappatura strutturata)",
    "esempi_disponibili": "Hook: una felpa di cotone e il suo viaggio di 40.000 km. Scenario: confronto tra due felpe con filiere diverse.",
    "criteri_successo": "Lo studente è in grado di compilare autonomamente il passaporto tecnologico di un oggetto a scelta, indicando fasi, responsabili e impatti"
  }
}
```

---

## FASE B — DigComp Engine: Diagnosis

```json
{
  "diagnosis": {
    "course_type": "misto",
    "level": "1–2",
    "bloom_primary": "comprendere",
    "bloom_secondary": "applicare",
    "common_mistakes": [
      "Credere che il ciclo tecnologico finisca con la vendita al consumatore — uso e fine vita sono fasi centrali, spesso ignorate",
      "Attribuire la responsabilità di ogni fase genericamente 'all'azienda' senza distinguere i soggetti specifici (estrattore, trasportatore, distributore, consumatore, raccoglitore)",
      "Confondere ciclo di vita (LCA, prospettiva ambientale) con ciclo tecnologico (sistema produttivo completo con attori e valore)"
    ],
    "pattern_selezionato": "P1 — Step-by-Step (primario) con integrazione P5 — Mito/Errore → Correzione (per i 3 errori tipici in Accordion)",
    "recommended_backbone": [
      "Text and Image — Hook",
      "Slideshow — 7 fasi del ciclo tecnologico",
      "Process — ciclo con attori responsabili",
      "Accordion — debunking 3 misconcezioni",
      "Checklist — passaporto tecnologico (interattivo)",
      "Quiz — 3 MCQ + scenario",
      "Reflection — piano di azione personale"
    ],
    "modello_microlearning": "Procedure Training (7 step sequenziali + verifica + riflessione)",
    "durata_stimata_min": 9
  }
}
```

---

## FASE C — Layout Coassemble

### Il viaggio segreto della tua felpa — Ciclo tecnologico e ciclo di vita

Il modulo parte dal dato sorprendente dei 40.000 km di una felpa per introdurre le 7 fasi del ciclo tecnologico. Lo studente impara a distinguere i soggetti responsabili per fase, corregge le misconcezioni più comuni attraverso un Accordion di debunking, e applica il modello compilando il passaporto tecnologico del proprio oggetto. Il modulo si chiude con una riflessione sul ruolo del consumatore.

- **Durata stimata:** 9 min
- **Modello microlearning:** Procedure Training
- **Pattern:** P1 — Step-by-Step (+ integrazione P5)
- **Livello DigComp:** Foundation (1–2)
- **MC di riferimento:** MC-MAT-1-02

---

### Layout Coassemble

---

**Elemento 1 — Text and Image**
- Fase: Aggancio (Hook)
- Scopo: Catturare l'attenzione con il dato sorprendente del viaggio di 40.000 km; stabilire la rilevanza pratica del ciclo tecnologico
- Contenuto:

  **Titolo:** La tua felpa ha percorso 40.000 km per arrivare nel tuo armadio

  **Testo (78 parole):**
  Hai mai pensato a quello che c'è dietro una semplice felpa? Prima che tu la indossassi, ha viaggiato dall'Asia centrale all'India, dall'India al Bangladesh, fino all'Europa. Quarantamila chilometri. Decine di persone. Tre continenti. E quando la butterai? Il viaggio non finisce: potrebbe ricominciare, oppure fermarsi in una discarica. Il **ciclo tecnologico** è il nome di questo viaggio. In questo modulo scopri come funziona — e dove puoi fare la differenza.

  **Immagine suggerita:** mappa del mondo stilizzata con frecce colorate che tracciano il percorso di una felpa dai campi di cotone alla discarica europea; colori distinti per ogni fase.

---

**Elemento 2 — Slideshow**
- Fase: Spiegazione
- Scopo: Introdurre le 7 fasi del ciclo tecnologico una per volta, con il soggetto responsabile e l'impatto principale per ciascuna
- Contenuto (7 slide, max 60 parole per slide):

  **Slide 1 — ESTRAZIONE**
  Le materie prime vengono estratte dalla terra o coltivate: il cotone dai campi, i metalli dalle miniere, il petrolio dai pozzi.
  → Chi lo fa: aziende estrattive e agricole.
  → Impatto: consumo di suolo, acqua e biodiversità.

  **Slide 2 — LAVORAZIONE**
  La materia grezza viene trasformata: il cotone diventa filato, il petrolio diventa plastica, il minerale diventa acciaio.
  → Chi lo fa: industrie chimiche e manifatturiere.
  → Impatto: energia, scarti industriali, sostanze chimiche.

  **Slide 3 — PRODUZIONE**
  I componenti vengono assemblati nel prodotto finale. La felpa viene cucita, stampata, confezionata.
  → Chi lo fa: stabilimenti produttivi (spesso in paesi a basso costo del lavoro).
  → Impatto: condizioni di lavoro, energia, acqua.

  **Slide 4 — LOGISTICA**
  Il prodotto finito viaggia per il mondo: container, navi, camion, aerei.
  → Chi lo fa: aziende di trasporto e spedizione.
  → Impatto: emissioni di CO₂ (questa fase da sola può pesare il 20–30% dell'impronta totale).

  **Slide 5 — DISTRIBUZIONE**
  Il prodotto arriva nei magazzini, nei negozi fisici e online.
  → Chi lo fa: distributori, piattaforme e-commerce, negozi.
  → Impatto: packaging, resi, sprechi da invenduto.

  **Slide 6 — USO**
  Il prodotto è nelle tue mani. Lo usi, lo lavi, lo ripari — o lo dimentichi in fondo all'armadio.
  → Chi lo fa: tu, il consumatore.
  → Impatto: acqua ed energia per i lavaggi, durata d'uso reale.

  **Slide 7 — FINE VITA**
  Il prodotto viene buttato, riciclato, rivenduto o smaltito in modo non corretto.
  → Chi lo fa: tu + sistema di raccolta differenziata.
  → Impatto: rifiuti oppure — se fatto bene — materia prima per un nuovo ciclo.

---

**Elemento 3 — Process**
- Fase: Applicazione
- Scopo: Visualizzare il ciclo come sistema integrato; associare ogni fase al soggetto responsabile; far emergere le interdipendenze
- Contenuto (7 step con titolo + attore + domanda attiva):

  **Step 1 — Estrazione**
  Attore: Azienda estrattiva
  Domanda: *Cosa succederebbe se chiedessimo materie prime certificate?*

  **Step 2 — Lavorazione**
  Attore: Industria chimica/manifatturiera
  Domanda: *Esistono processi di lavorazione meno inquinanti?*

  **Step 3 — Produzione**
  Attore: Fabbrica (spesso in Asia o Africa)
  Domanda: *Come posso sapere se i lavoratori sono stati pagati equamente?*

  **Step 4 — Logistica**
  Attore: Azienda di trasporto
  Domanda: *Perché un prodotto "Made in Italy" può avere un'impronta logistica enorme?*

  **Step 5 — Distribuzione**
  Attore: Negozio / piattaforma online
  Domanda: *Perché comprare locale può ridurre questa fase?*

  **Step 6 — Uso**
  Attore: Tu — il consumatore
  Domanda: *Quante volte usi davvero quello che compri?*

  **Step 7 — Fine vita**
  Attore: Tu + sistema di raccolta
  Domanda: *Sai dove portare questo oggetto quando non lo vuoi più?*

---

**Elemento 4 — Accordion**
- Fase: Approfondimento (con integrazione P5 — debunking)
- Scopo: Correggere le 3 misconcezioni più frequenti sul ciclo tecnologico
- Contenuto (3 tab espandibili):

  **Tab 1 — "Il ciclo finisce quando compro il prodotto"**
  Falso. Uso e fine vita sono fasi del ciclo tecnologico tanto quanto produzione e logistica. Anzi, come consumatore hai un peso diretto su entrambe: come usi l'oggetto (quante volte lo lavi, quanto dura) e come lo smaltisci (differenziata, riuso, discarica) determinano una parte significativa del suo impatto totale.

  **Tab 2 — "La colpa è sempre dell'azienda"**
  Dipende dalla fase. Ogni fase ha un attore con responsabilità diverse. Nella logistica, l'impatto è del trasportatore. Nella fase d'uso, sei tu. Il ciclo tecnologico ti aiuta a capire *chi* può agire su *cosa* — e questo include le tue scelte di acquisto, uso e smaltimento.

  **Tab 3 — "Ciclo di vita e ciclo tecnologico sono la stessa cosa"**
  Simili, ma con prospettive diverse. Il **ciclo di vita** (LCA — Life Cycle Assessment) misura l'impatto ambientale totale di un prodotto, fase per fase. Il **ciclo tecnologico** descrive il sistema produttivo: chi fa cosa, come si crea valore, quali risorse si trasformano. Il secondo è il contesto; il primo è la misura.

---

**Elemento 5 — Checklist**
- Fase: Coinvolgimento (interattivo + metacognitivo)
- Scopo: Far applicare concretamente il ciclo tecnologico a un oggetto reale; strutturare il compito di realtà
- Contenuto:

  **Titolo:** Compila il passaporto tecnologico del tuo oggetto

  **Istruzione (max 40 parole):** Scegli un oggetto che hai a casa — una felpa, una bottiglia, uno zaino. Usa questa checklist per tracciarne il ciclo tecnologico completo. Ogni spunta corrisponde a un passo del "passaporto".

  ☐ Ho identificato la materia prima principale dell'oggetto
  ☐ Ho mappato le 7 fasi del ciclo tecnologico per questo oggetto
  ☐ Ho indicato chi è il soggetto responsabile per ogni fase
  ☐ Ho individuato il principale impatto ambientale di almeno 3 fasi
  ☐ Ho identificato almeno 1 fase in cui posso intervenire io come consumatore
  ☐ So dove smaltire correttamente questo oggetto a fine vita

---

**Elemento 6 — Quiz finale**
- Fase: Verifica
- Scopo: Verificare la comprensione delle 7 fasi, la capacità di associare responsabili e applicare il modello in un contesto reale

  **MCQ 1 [livello: base]**
  Domanda: Quante fasi comprende il ciclo tecnologico completo?
  A) 4 — dalla produzione al negozio
  B) 5 — dalla materia prima al consumatore
  C) 7 — dall'estrazione al fine vita
  D) 3 — produzione, vendita, uso
  Risposta corretta: C
  Feedback corretto: "Esatto! Le 7 fasi sono: estrazione, lavorazione, produzione, logistica, distribuzione, uso e fine vita. Ricordalo: il ciclo non si ferma alla vendita."
  Feedback errore più comune (B): "Quasi, ma mancano due fasi fondamentali. Il ciclo non termina quando il prodotto arriva al consumatore: include anche l'uso quotidiano e il fine vita. Sono proprio le ultime due fasi quelle su cui puoi fare la differenza."

  **MCQ 2 [livello: intermedio]**
  Domanda: Nella fase di logistica, chi è il soggetto principalmente responsabile delle emissioni di CO₂?
  A) Il consumatore finale
  B) L'azienda produttrice
  C) Le aziende di trasporto (navi, camion, aerei)
  D) I negozi distributori
  Risposta corretta: C
  Feedback corretto: "Corretto! Navi, camion e aerei che spostano i prodotti in tutto il mondo generano una quota significativa delle emissioni. Scegliere prodotti a filiera corta è uno dei modi per ridurre questa fase."
  Feedback errore più comune (B): "Non esatto. L'azienda produttrice è responsabile della fase di produzione (Step 3), non della logistica. La logistica è gestita da aziende di trasporto separate. Nel ciclo tecnologico, ogni fase ha il suo attore specifico."

  **MCQ 3 [livello: avanzato]**
  Domanda: Una maglia con etichetta "Made in Italy" potrebbe avere un impatto ambientale maggiore di una prodotta in Bangladesh. Qual è la ragione più probabile?
  A) Le fabbriche italiane consumano più energia per le normative ambientali
  B) Il cotone usato può provenire dall'Asia, anche se la cucitura è italiana — la logistica delle materie prime è enorme
  C) I negozi italiani sono geograficamente lontani dai consumatori europei
  D) Un prezzo più alto implica più materiali utilizzati nella produzione
  Risposta corretta: B
  Feedback corretto: "Esatto! 'Made in Italy' indica solo dove il prodotto è stato assemblato (fase di produzione), non l'origine delle materie prime. Il cotone potrebbe venire dall'Uzbekistan o dal Texas, percorrendo migliaia di km prima ancora di essere lavorato. Bisogna guardare l'intero ciclo, non solo l'etichetta."
  Feedback errore più comune (A): "Non necessariamente. Le normative europee rendono spesso le fabbriche italiane più efficienti in termini energetici. Il punto critico è l'origine delle materie prime nelle fasi di estrazione e logistica pre-produzione — che restano nascoste nell'etichetta finale."

  **Scenario applicativo:**
  Situazione: "Martina deve comprare una felpa. Sullo scaffale ne trova due identiche per stile. La prima costa €15, è prodotta in Bangladesh con cotone del Pakistan. La seconda costa €45, è prodotta in Portogallo con cotone biologico coltivato in Portogallo. Martina vuole scegliere quella con l'impatto ambientale minore."
  Domanda: Quale consiglio daresti a Martina applicando il modello del ciclo tecnologico?
  Risposta corretta: La seconda (€45), perché cotone e produzione sono entrambi locali → la fase di logistica è minima per entrambe le materie prime e il prodotto finito; il cotone biologico riduce l'impatto nelle fasi di estrazione/coltivazione (meno pesticidi, meno acqua); la filiera corta garantisce maggiore trasparenza su tutte le fasi.
  Perché è corretta: Il ciclo tecnologico completo mostra che le fasi di estrazione + logistica sono spesso le più impattanti. Una filiera corta con materie prime locali riduce entrambe contemporaneamente — anche se il prezzo finale è più alto.
  Errore tipico: Pensare che il prezzo più basso sia sempre la scelta peggiore per l'ambiente (non necessariamente), o che il prezzo più alto garantisca automaticamente minor impatto. Serve sempre analizzare l'intera catena, non un singolo indicatore.

---

**Elemento 7 — Reflection**
- Fase: Consolidamento (metacognitivo)
- Scopo: Connettere il ciclo tecnologico all'esperienza quotidiana; stimolare un piano d'azione personale; aprire alla prospettiva professionale
- Contenuto:

  **Titolo:** Dove puoi intervenire tu?

  **Testo (68 parole):**
  Ora conosci le 7 fasi del ciclo tecnologico. Una domanda per te: su quale fase pensi di poter fare la differenza? Come consumatore, agisci direttamente nelle fasi di **uso** e **fine vita**. Ma le tue scelte d'acquisto influenzano anche produzione e logistica — decidendo cosa compri, da chi e perché. Quale piccola abitudine potresti cambiare a partire da domani?

  **Domanda riflessiva:** Scrivi (o pensa a) una cosa concreta che potresti fare diversamente in una delle 7 fasi.

  **Connessione professione futura:** Se questo tema ti appassiona, esiste una professione che si chiama *Supply Chain Sustainability Manager*: analizza e ottimizza le catene di fornitura per ridurre emissioni e garantire condizioni di lavoro etiche lungo tutto il ciclo tecnologico.

---

### Competenze attivate

- **DigComp:** Area 1 — Alfabetizzazione su informazioni e dati — 1.3 Gestire dati, informazioni e contenuti digitali — Livello Foundation (1–2)
- **Bloom:** primario: comprendere | secondario: applicare
- **Tipo apprendimento:** misto (concettuale + procedurale)
- **Learning Outcomes:**
  - LO1: Lo studente è in grado di **identificare** le 7 fasi del ciclo tecnologico di un oggetto di uso quotidiano, elencandole nella sequenza corretta
  - LO2: Lo studente è in grado di **associare** ciascuna fase del ciclo tecnologico al soggetto responsabile principale (azienda estrattiva, industria, trasportatore, consumatore, raccoglitore)
  - LO3: Lo studente è in grado di **organizzare** in una mappa strutturata (passaporto tecnologico) le fasi, i responsabili e i principali impatti ambientali di un prodotto a scelta

---

## FASE D — DigComp Validator

### Checklist di conformità

- [x] Elementi nel range 4–8: **7 elementi** ✓
- [x] Almeno 1 elemento interattivo: **Checklist (E5) + Process (E3)** ✓
- [x] Almeno 1 elemento metacognitivo: **Reflection (E7) + Checklist come autoregolazione (E5)** ✓
- [x] Coerenza obiettivo → attività → quiz: LO1 → E2+E3 → MCQ1 ✓ | LO2 → E3+E4 → MCQ2+Scenario ✓ | LO3 → E5 → MCQ3 ✓
- [x] Carico cognitivo controllato: testi max ~80 parole per elemento ✓
- [x] Linguaggio e tono: seconda persona singolare, concreto, 11–14 anni ✓
- [x] Quiz: 3 MCQ (base/intermedio/avanzato) + 1 scenario + feedback formativo ✓
- [x] Tracciabilità DigComp: area, competenza, livello, LO esplicitati ✓
- [x] Hook agganciato al compito_realta della MC (passaporto tecnologico) ✓
- [x] Nessun tono enciclopedico ✓

### Scoring — 7 Dimensioni

| Dimensione | Max | Score | Note |
|---|---|---|---|
| D1 — Allineamento DigComp | 20 | 18 | LO con verbi Bloom coerenti con F; codice DC esplicito; LO3 "organizzare" è al limite superiore di Foundation ma giustificato dal compito di realtà |
| D2 — Coerenza LO → Attività → Quiz | 20 | 19 | Tutti gli LO coperti; catena obiettivo→pratica→verifica integra. MCQ3 copre LO3 con scenario realistico |
| D3 — Adeguatezza del Livello | 15 | 13 | Livello F rispettato; MCQ3 sfida in modo appropriato senza violare Foundation; durata ~9 min supera leggermente il target 5–8 min |
| D4 — Evidenze di Apprendimento | 20 | 20 | 3 MCQ + scenario; feedback formativo esplicito per ogni errore; tutti gli LO verificati |
| D5 — Interattività | 10 | 10 | Process (cliccabile) + Checklist; interattività funzionale all'obiettivo |
| D6 — Metacognizione | 10 | 10 | Reflection screen esplicito + Checklist come autoregolazione |
| D7 — Struttura Microlearning | 5 | 4 | Screen Grammar rispettata; 7 elementi ✓; durata stimata 9 min leggermente sopra target Foundation (5–8 min) |
| **TOTALE LORDO** | **100** | **94** | |

### Penalizzazioni

Nessuna penalizzazione applicata.

### Decisione

```
✅ APPROVATO — Score: 94/100

Micro-migliorie opzionali (non bloccanti):

1. [PRIORITÀ BASSA] Fondere Slideshow (E2) e Process (E3) in un unico
   elemento Process a 7 step con immagini integrate, per ridurre la durata
   stimata da ~9 min a ~7 min e rientrare nel target Foundation (5–8 min).

2. [PRIORITÀ BASSA] Prima di MCQ3 (livello avanzato), aggiungere un
   Hotspot con tabella comparativa delle due felpe per dare allo studente
   Foundation uno scaffold visivo prima della domanda più complessa.

3. [PRIORITÀ BASSA] La Checklist del passaporto tecnologico (E5) funziona
   bene come struttura. Aggiungere un campo testo libero ("impatto
   principale che hai trovato") la trasformerebbe in autentica attività
   di documentazione digitale, rafforzando DC 1.3.
```

---

## Scheda Evidenza

| Campo | Valore |
|---|---|
| ID MC di riferimento | MC-MAT-1-02 |
| Titolo modulo | Il viaggio segreto della tua felpa — Ciclo tecnologico e ciclo di vita |
| Modello microlearning | Procedure Training |
| Pattern didattico | P1 — Step-by-Step (con integrazione P5) |
| Area DigComp | Area 1 — Alfabetizzazione su informazioni e dati |
| Competenza | 1.3 Gestire dati, informazioni e contenuti digitali |
| Livello target | Foundation (1–2) |
| Anno scolastico | 1ª |
| Durata stimata | 9 min |
| Punteggio coerenza | 94/100 |
| Stato | ✅ APPROVATO |

**Learning Outcomes:**
- LO1: Lo studente è in grado di identificare le 7 fasi del ciclo tecnologico di un oggetto di uso quotidiano, elencandole nella sequenza corretta
- LO2: Lo studente è in grado di associare ciascuna fase al soggetto responsabile principale
- LO3: Lo studente è in grado di organizzare in una mappa strutturata (passaporto tecnologico) fasi, responsabili e impatti ambientali

**Attività Coassemble:**
1. Text & Image — Hook (la felpa e i 40.000 km)
2. Slideshow — 7 fasi del ciclo tecnologico (1 slide/fase)
3. Process — ciclo integrato con attori e domande attive
4. Accordion — debunking 3 misconcezioni (P5)
5. Checklist — passaporto tecnologico (interattivo)
6. Quiz — 3 MCQ + scenario applicativo
7. Reflection — piano d'azione personale + professione futura

**Evidenze raccolte:** MCQ1 (LO1), MCQ2 (LO2), MCQ3 + Scenario (LO3), Checklist (LO3 pratico)

**Criteri di successo:** Lo studente completa il passaporto tecnologico di un oggetto a scelta, indicando le 7 fasi, i responsabili e gli impatti. Score quiz ≥ 70%.

---

## Output JSON — Struttura di archiviazione

```json
{
  "module_id": "MC-MAT-1-02_nano_v1",
  "mc_ref": "MC-MAT-1-02",
  "course_brief": {
    "target": "Studenti di classe 1ª, scuola secondaria I grado",
    "contesto": "MAT — Ciclo di vita dei materiali e cicli tecnologici",
    "obiettivo_operativo": "Tracciare il passaporto tecnologico di un oggetto con 7 fasi, responsabili e impatti",
    "livello_digcomp": "F",
    "competenza_dc": "1.3 — Livello F",
    "durata_target": "5–8 min",
    "tipo_apprendimento": "misto"
  },
  "diagnosis": {
    "course_type": "misto",
    "level": "1–2",
    "bloom_primary": "comprendere",
    "common_mistakes": [
      "Credere che il ciclo finisca alla vendita",
      "Attribuire tutto genericamente all'azienda",
      "Confondere ciclo di vita (LCA) con ciclo tecnologico"
    ],
    "pattern_selezionato": "P1",
    "modello_microlearning": "Procedure Training",
    "recommended_backbone": [
      "Text and Image", "Slideshow", "Process",
      "Accordion", "Checklist", "Quiz", "Reflection"
    ]
  },
  "learning_outcomes": [
    "LO1: Lo studente è in grado di identificare le 7 fasi del ciclo tecnologico nella sequenza corretta",
    "LO2: Lo studente è in grado di associare ciascuna fase al soggetto responsabile principale",
    "LO3: Lo studente è in grado di organizzare un passaporto tecnologico strutturato per un oggetto a scelta"
  ],
  "validation": {
    "agent_version": "DigComp-Validator-v1.0",
    "timestamp": "2026-05-10",
    "digcomp_level_target": "F",
    "score_breakdown": {
      "D1_allineamento_digcomp": 18,
      "D2_coerenza_lo_attivita_quiz": 19,
      "D3_adeguatezza_livello": 13,
      "D4_evidenze_apprendimento": 20,
      "D5_interattivita": 10,
      "D6_metacognizione": 10,
      "D7_struttura_microlearning": 4
    },
    "score_lordo": 94,
    "penalizzazioni": [],
    "score_netto": 94,
    "decisione": "APPROVATO",
    "migliorie_opzionali": [
      {
        "priorita": "BASSA",
        "elemento": "E2 Slideshow + E3 Process",
        "azione": "Fondere in un unico Process a 7 step con immagini integrate",
        "motivazione": "Ridurrebbe la durata da ~9 a ~7 min, rientrando nel target Foundation"
      },
      {
        "priorita": "BASSA",
        "elemento": "Prima di MCQ3",
        "azione": "Aggiungere Hotspot con tabella comparativa delle due felpe come scaffold visivo",
        "motivazione": "Supporta lo studente Foundation prima della domanda più complessa"
      },
      {
        "priorita": "BASSA",
        "elemento": "E5 Checklist",
        "azione": "Aggiungere campo testo libero per impatto principale trovato",
        "motivazione": "Trasforma la checklist in autentica attività di documentazione digitale (DC 1.3)"
      }
    ]
  }
}
```
