# Scheda di Validazione CARBLE-CDD — ProfTecnologIA
**Protocollo di riferimento:** CARBLE-CDD v1.0 — I.C. Nicotera Costabile (13 maggio 2026)  
**Data validazione:** 11 maggio 2026  
**Validatore:** Prof. Ing. Antonio Scaramuzzino (autore + responsabile)  
**Livello di validazione:** **Formale** (CDD con valore istituzionale, pubblico e replicabile)

---

## Anagrafica del CDD

| Campo | Valore |
|---|---|
| **Titolo CDD** | ProfTecnologIA — Ecosistema didattico digitale |
| **Tipologia CDD** | Libro digitale + App + Audio + Immagini AI + Video gallery + Sito web |
| **Disciplina** | Tecnologia — Scuola Secondaria di I Grado |
| **Classe/target** | 1ª, 2ª, 3ª media (età 11-14) + docenti di Tecnologia |
| **Obiettivo didattico** | Sviluppo delle 52 micro-competenze definite dalla MC-TECH-2025 lungo il triennio |
| **Competenza attesa** | Progressione DigComp 3.0 Foundation → Intermediate → Advanced |
| **Conoscenza essenziale** | 9 aree tematiche allineate a IN 2025 D.M. n. 221/2025 |
| **Strumenti AI usati** | Claude Sonnet/Opus, GPT Image 2, Cinematic Studio 2.5, Soul V2, edge-tts Isabella, Pinecone, NotebookLM |
| **Dati personali trattati** | No — nessun dato personale di studenti reali |
| **Uso con studenti minori** | Sì — scuola secondaria di I grado (11-14 anni) |
| **Fonti principali** | Paci 2014 (Zanichelli), Hypertech 2020 (Lattes), IN 2025 D.M. 221/2025, DigComp 3.0 |
| **Dichiarazione d'uso IA** | Sì — pagina Credits dedicata sul sito |
| **DPIA/FRIA richiesta** | Da valutare (vedere criterio E) |

---

## Valutazione CARBLE + D

---

### D — Disegno Didattico ✅ CONFORME

> *Criterio preliminare: il CDD è didatticamente fondato, coerente con gli obiettivi e capace di attivare processi cognitivi significativi?*

**Giudizio:** Conforme

**Evidenze positive:**
- Struttura a **5 zone fisse** per ogni MC (INNESCA → ESPLORA → OSSERVA → SPERIMENTA → AGISCI) che attiva processi cognitivi diversi: narrazione, concettualizzazione, esempio, laboratorio, compito autentico
- **Flipped classroom by default**: 3 video selezionati tra INNESCA ed ESPLORA (guarda a casa → lavora in classe)
- **Hook audio** con domanda stimolo per attivare la curiosità (metacognizione pre-lettura)
- **Compito di realtà autentico** in 🌍 AGISCI con scenario → consegna → rubrica → SDG → metacognizione
- **Differenziazione visibile** su 3 livelli (● Base / ●● Intermedio / ●●● Avanzato) in ogni MC
- **Progressione DigComp** verticale F→I→A non retrogressiva (documentata in PROGRESSIONE_VERTICALE_DIG_DIS.md)
- **Catena prerequisiti** documentata in 40/50 MC (80%)

**Criticità minori:**
- Campo `professione_futura` presente solo in 11/50 MC (22%) — la sidebar "Chi lavora con questa competenza nel 2030?" manca in 39 MC
- **QuizWidget** sul sito usa domande demo (non le domande reali per MC) — segnalato in backlog
- `note_didattiche.intermedio` non presente nello schema v1.x (solo base + avanzato)

**Azioni raccomandate:**
- [ ] Completare `professione_futura` nelle 39 MC mancanti
- [ ] Sostituire quiz demo con le 3 domande reali per livello (già definite in `outputApp.quiz`)
- [ ] Aggiungere livello Intermedio alle note didattiche

---

### C — Correttezza e Accuratezza ⚠️ DA RIVEDERE

> *Il contenuto può essere usato senza trasmettere errori agli studenti?*

**Giudizio:** Da rivedere

**Evidenze positive:**
- Testi narrativi derivano da Paci 2014 e Hypertech 2020 (fonti verificate, docenti di disciplina)
- Riferimenti normativi IN 2025 e DigComp 3.0 corretti
- Media 4.533 parole per testo narrativo — contenuto sostanziale, non superficiale
- Allineamento framework (IN/DC/EC/LC/EV) verificato su tutte le 50 MC

**Criticità rilevate:**
- **Dati numerici negli hook script** non hanno citazione di fonte in-testo. Esempi rilevati:
  - "40.000 km" per la filiera della felpa (MC-MAT-1-02)
  - "80%" smaltimento smartphone (MC-MAT-1-02)
  - "7 tonnellate" emissioni CO₂ (MC-COM-3-03)
  - "25 km" zona industriale (MC-ENE-3-01)
  - "10%" efficienza lampade tradizionali (MC-DIG-2-01)
  - Diversi altri valori percentuali in MC-COM-3-03
- Dati generati da AI senza verifica esplicita di fonte primaria per ciascuno
- I testi delle MC generate da JSON (21 MC senza hook script completo) hanno contenuto molto sintetico (~86 parole) — insufficiente per una ⚡ INNESCA completa

**Azioni raccomandate:**
- [ ] **PRIORITÀ ALTA** — Aggiungere nota-fonte a ogni dato numerico negli hook script (es. "Fonte: Ellen MacArthur Foundation, 2023")
- [ ] Verificare i valori numerici negli hook con fonti primarie (report IPCC, Eurostat, ISTAT, organismi internazionali)
- [ ] Completare i 21 hook script mancanti con testo narrativo completo
- [ ] Implementare processo di fact-checking per ogni nuovo hook generato

---

### A — Adeguatezza Didattica ✅ CONFORME

> *Il contenuto è davvero adatto alle persone e alla situazione in cui sarà usato?*

**Giudizio:** Conforme

**Evidenze positive:**
- Linguaggio in seconda persona singolare ("tu", "il tuo") coerente con stile narrativo per 11-14 anni
- Sequenza HOOK → CONCETTO → ESEMPIO → APPLICAZIONE rispettata in tutti i testi
- Compiti di realtà iniziano con verbo d'azione (Analizza, Progetta, Costruisci...) come da CLAUDE.md §7
- Livello DigComp progressivo: Foundation in 1ª, Intermediate in 2ª, Advanced in 3ª — mai retrogressivo
- Differenziazione base/avanzato adeguata per BES lievi
- Durate audio hook reali: 37s-299s (media ~3min per script completo) — proporzionate

**Criticità minori:**
- 21 MC con testo hook da JSON (~86 parole) erogano un'esperienza audio molto inferiore alle 44 MC con script completo (~450 parole)
- Il criterio "max 200 parole per la 📖 ESPLORA" non è stato verificato sistematicamente
- Non è disponibile una versione semplificata per studenti con BES gravi o italiano L2 avanzato

**Azioni raccomandate:**
- [ ] Verificare word count 📖 ESPLORA su campione di 10 MC
- [ ] Prevedere adattamenti per italiano L2 (glossario multilingue) in MC-DIG-1-02 (Ricerca fonti online)

---

### R — Bias e Stereotipi ⚠️ DA RIVEDERE

> *Qualcuno potrebbe sentirsi escluso, rappresentato male o invisibile?*

**Giudizio:** Da rivedere

**Evidenze positive:**
- Prompt immagini specificano "gender-neutral, Mediterranean appearance" ✅
- Nessun riferimento a stereotipi religiosi o culturali nei testi campionati ✅
- Professioni del futuro formulate in modo neutro ("Materials Engineer", non con genere) ✅
- Contesti geografici italiani/mediterranei per le immagini documentarie ✅

**Criticità rilevate:**
- **Immagini AI non sottoposte a revisione umana individuale per bias** — le 157 immagini generate sono state prodotte in batch senza review visiva sistematica
- Campo `professione_futura` presente in 11/50 MC — le restanti 39 MC non mostrano prospettive lavorative, rischio di limitare la visione di futuro degli studenti
- I testi narrativi usano prevalentemente esempi di consumo occidentale (felpa fast fashion, smartphone, auto elettrica) — presenza minoritaria di prospettive del Sud del mondo, pur citando supply chain globali
- Nessuna MC include esplicitamente prospettive di disabilità o neurodiversità tra le professioni del futuro

**Azioni raccomandate:**
- [ ] **PRIORITÀ MEDIA** — Revisione umana sistematica delle 157 immagini generate per bias visivi
- [ ] Completare `professione_futura` in tutte le 50 MC con diversità di genere/provenienza
- [ ] In almeno 2-3 MC per area, includere esempio del Sud del mondo nella supply chain
- [ ] Aggiungere in 1-2 MC una professione del futuro esercitata da persona con disabilità

---

### B — Fonti, Licenze e Citabilità ⚠️ DA RIVEDERE

> *Se qualcuno mi chiede da dove viene questa informazione, posso rispondere con chiarezza?*

**Giudizio:** Da rivedere

**Evidenze positive:**
- Fonti bibliografiche primarie documentate (Paci 2014, Hypertech 2020) ✅
- IN 2025 D.M. 221/2025 citato correttamente ✅
- DigComp 3.0 (Commissione Europea) citato ✅
- Pagina Credits sul sito con lista strumenti AI e fonti video ✅
- Campo `fonte` in ogni MC JSON ("Paci 2014", "Hypertech 2020", "originale") ✅

**Criticità rilevate:**
- **Licenza immagini AI (Higgsfield)**: le immagini generate con GPT Image 2, Cinematic Studio 2.5 e Soul V2 sono soggette ai Termini di Servizio Higgsfield. Non verificato se uso educativo/editoriale è consentito per pubblicazione
- **Licenza edge-tts**: la voce `it-IT-IsabellaNeural` è un servizio Microsoft. I ToS di Microsoft Edge TTS per uso educativo/commerciale in pubblicazioni non sono esplicitamente verificati
- **Video YouTube**: i video nelle gallery sono contenuti di terzi. L'embedding è tecnicamente permesso da YouTube ma i diritti d'autore restano agli autori — nessuna licenza CC garantita
- **Dati numerici negli hook**: dati come "40.000 km" non hanno citazione primaria in-testo

**Azioni raccomandate:**
- [ ] **PRIORITÀ ALTA** — Verificare i ToS Higgsfield per uso educativo/editoriale delle immagini generate
- [ ] **PRIORITÀ ALTA** — Verificare i ToS Microsoft per edge-tts in pubblicazioni educational
- [ ] Aggiungere footer/nota in ogni pagina MC con formula: "Immagini generate con AI (Higgsfield/GPT Image). Audio sintetizzato con Microsoft edge-tts."
- [ ] Per i video YouTube: aggiungere disclaimer "I video appartengono ai rispettivi autori"
- [ ] Verificare fonte primaria per ogni dato numerico negli hook

---

### L — Linguaggio, Accessibilità e Inclusività ⚠️ DA RIVEDERE

> *Il contenuto è comprensibile anche da chi parte più indietro o apprende in modo diverso?*

**Giudizio:** Da rivedere

**Evidenze positive:**
- Font **Atkinson Hyperlegible** nel sito (progettato per DSA) ✅
- Registro "tu" diretto e colloquiale ✅
- Esempi concreti da oggetti quotidiani ✅
- Audio hook (50 MP3) offrono canale alternativo alla lettura ✅
- Player audio con controlli accessibili (aria-label, bottoni chiari) ✅
- Domanda stimolo in evidenza gialla (contrasto verificabile) ✅

**Criticità rilevate:**
- **Assenza di sottotitoli/trascrizioni per gli audio hook** — gli studenti con deficit uditivo o difficoltà di ascolto non hanno accesso alternativo ai 50 podcast
- **Alt text immagini**: MCCard usa `alt=""` per le thumbnail (decorativo — accettabile), ma nelle pagine MC le immagini AI non hanno alt text descrittivo
- **Contrasto colori**: non verificato sistematicamente su tutti i componenti del sito (verifica WCAG AA richiede audit)
- **Video senza sottotitoli forzati**: i video YouTube nella gallery dipendono dai sottotitoli del canale originale (non garantiti)
- **Nessuna versione in CAA** (Comunicazione Aumentativa Alternativa) per studenti con disabilità gravi

**Azioni raccomandate:**
- [ ] **PRIORITÀ ALTA** — Aggiungere trascrizioni testuali per ogni audio hook (i testi degli hook script esistono già in `04_CONTENUTI/microlearning/hook/`)
- [ ] Aggiungere alt text descrittivi alle immagini AI nelle pagine MC
- [ ] Effettuare audit WCAG AA con strumento automatico (es. axe, Lighthouse)
- [ ] Attivare sottotitoli YouTube automatici come default nella VideoGallery

---

### E — Etica, Sicurezza e Valori Educativi ⚠️ DA RIVEDERE

> *Il contenuto rispetta la dignità delle persone, tutela gli studenti e mantiene chiara la responsabilità umana?*

**Giudizio:** Da rivedere

**Evidenze positive:**
- **Nessun dato personale di studenti** nei prompt AI o nei contenuti generati ✅
- **Nessuna immagine/audio/video riconducibile a studenti reali** ✅
- Pagina Credits con **dichiarazione esplicita dell'uso AI** ✅
- Audio generati senza input di dati personali ✅
- Immagini generate con prompt che escludono dati sensibili ✅
- Contenuti strutturati per promuovere **autonomia, senso critico e cittadinanza** (🌍 AGISCI metacognizione) ✅
- SDG embedded in ogni MC (Agenda 2030) ✅

**Criticità rilevate:**
- **Formula di trasparenza sull'uso dell'IA assente nelle singole pagine MC** del sito — solo nella pagina Credits globale. Il Protocollo CARBLE-CDD richiede trasparenza sul singolo CDD
- **QuizWidget con domande demo**: il componente quiz usa domande generiche non validate sul contenuto specifico della MC — rischio di fuorviare la valutazione
- **Nessun DPIA/FRIA** effettuata per gli strumenti AI usati (Higgsfield, edge-tts) — da valutare in base ai ToS e alla loro classificazione AI Act
- **Manca nota di metacognizione per studenti sull'uso AI**: le pagine non invitano esplicitamente gli studenti a riflettere sul fatto che i contenuti siano stati prodotti con IA
- Il sito è pubblico e indicizzato — i contenuti sono accessibili a chiunque senza registrazione (considerare se appropriato per materiale pensato per minori)

**Azioni raccomandate:**
- [ ] **PRIORITÀ ALTA** — Aggiungere micro-banner in ogni pagina MC: "Contenuto prodotto dall'autore con supporto AI e validato secondo Protocollo CARBLE-CDD"
- [ ] **PRIORITÀ MEDIA** — Effettuare DPIA semplificata per Higgsfield e edge-tts
- [ ] Sostituire quiz demo con domande validate specifiche per ogni MC
- [ ] Aggiungere in 🌍 AGISCI una domanda di riflessione critica sull'uso dell'AI nel libro stesso
- [ ] Valutare se aggiungere un accesso con credenziali per la versione destinata agli studenti

---

## Sintesi dei 7 criteri

| Criterio | Esito | Priorità azioni |
|---|---|---|
| **D** Disegno didattico | ✅ Conforme | Bassa |
| **C** Correttezza | ⚠️ Da rivedere | **Alta** |
| **A** Adeguatezza | ✅ Conforme | Bassa |
| **R** Bias | ⚠️ Da rivedere | Media |
| **B** Fonti/Licenze | ⚠️ Da rivedere | **Alta** |
| **L** Linguaggio | ⚠️ Da rivedere | **Alta** |
| **E** Etica/Sicurezza | ⚠️ Da rivedere | **Alta** |

---

## Esito complessivo

> ### ⚠️ VALIDABILE CON MODIFICHE

Il progetto ProfTecnologIA presenta una **base didattica solida e un disegno pedagogico ben strutturato**, pienamente coerente con le IN 2025 e con DigComp 3.0. Le criticità rilevate sono reali ma tutte risolvibili senza rigenerare i contenuti.

Il sistema è **validabile come materiale dimostrativo/editoriale** nella versione attuale, a condizione che vengano applicati i correttivi ad alta priorità prima della distribuzione agli studenti in contesto scolastico.

---

## Piano d'azione prioritizzato

### 🔴 PRIORITÀ ALTA — da risolvere prima della distribuzione agli studenti

| # | Azione | Criterio | Effort |
|---|---|---|---|
| 1 | Aggiungere formula di trasparenza AI in ogni pagina MC del sito | E | Basso (1 modifica CSS/componente) |
| 2 | Aggiungere trascrizioni testuali per i 50 audio hook (testi già esistono) | L | Medio (50 file) |
| 3 | Verificare ToS Higgsfield e edge-tts per uso educativo | B | Basso (ricerca legale) |
| 4 | Aggiungere fonte primaria a ogni dato numerico negli hook script | C | Medio (44 script) |
| 5 | Aggiungere alt text descrittivi alle immagini AI nelle pagine MC | L | Medio (50 pagine) |

### 🟡 PRIORITÀ MEDIA — da completare per versione definitiva

| # | Azione | Criterio | Effort |
|---|---|---|---|
| 6 | Revisione umana delle 157 immagini AI per bias visivi | R | Medio |
| 7 | Completare `professione_futura` nelle 39 MC mancanti | D/R | Alto |
| 8 | Effettuare DPIA semplificata per strumenti AI usati | E | Medio |
| 9 | Sostituire quiz demo con domande validate per ogni MC | D/E | Alto |
| 10 | Attivare sottotitoli di default nella VideoGallery YouTube | L | Basso |

### 🟢 PRIORITÀ BASSA — miglioramenti per versione 2.0

| # | Azione | Criterio | Effort |
|---|---|---|---|
| 11 | Audit WCAG AA completo del sito | L | Medio |
| 12 | Aggiungere nota metacognitiva sull'AI nella 🌍 AGISCI | E | Medio |
| 13 | Completare i 21 hook script mancanti con testo narrativo | C/A | Alto |
| 14 | Versione semplificata per italiano L2 in MC-DIG-1-02 | A | Medio |
| 15 | Valutare accesso con credenziali per versione studenti | E | Alto |

---

## Correzioni già applicate / risorse già esistenti

| Elemento | Stato |
|---|---|
| Testi hook script (44/50) | ✅ Già presenti come `.md` — usabili come trascrizioni |
| Campo `fonte` in ogni MC | ✅ Presente |
| Pagina Credits con dichiarazione AI | ✅ Online |
| Font Atkinson Hyperlegible | ✅ Implementato |
| Player audio con controlli ARIA | ✅ Implementato |
| Domanda stimolo in evidenza gialla | ✅ Implementata |
| SDG per ogni MC | ✅ 50/50 |
| Catena prerequisiti | ✅ 40/50 |

---

## Dichiarazione finale

> Questo materiale è stato realizzato dal **Prof. Ing. Antonio Scaramuzzino** con il supporto di strumenti di Intelligenza Artificiale Generativa (Claude, GPT Image 2, edge-tts, Higgsfield) e successivamente controllato, validato e integrato dall'autore secondo il **Protocollo CARBLE-CDD v1.0**.
> La responsabilità professionale della scelta didattica, della validazione e dell'impiego del contenuto resta esclusivamente all'autore.

---

*Documento generato: 11 maggio 2026*  
*Prossima revisione raccomandata: prima della distribuzione agli studenti in contesto scolastico*  
*Archiviazione: `00_ARCHITETTURA/VALIDAZIONE_CARBLE-CDD_ProfTecnologIA_v1.0.md`*
