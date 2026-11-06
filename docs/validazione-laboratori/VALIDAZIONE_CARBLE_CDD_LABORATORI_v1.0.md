# Validazione CARBLE-CDD dei laboratori interattivi

**Parere istruttorio e decisione dell'autore** · 58 laboratori · 2026-11-06 · Protocollo CARBLE-CDD v1.0 (I.C. Nicotera Costabile)

Parere istruttorio dell'Agente CARBLE-CDD, confermato dall'autore. Le schede JSON per ogni laboratorio sono in `schede/`.

## Esito in sintesi

- **Esito: 58 laboratori su 58 validati.** Il parere istruttorio (stessa data) li dava *validabili con modifiche* solo per la formula di trasparenza sull'IA; l'autore ha confermato il parere e la formula è stata inserita nel piè di pagina di tutti i laboratori.
- Decisione finale: Ing. Antonio Scaramuzzino, 2026-11-06.
- Criteri conformi su 58 laboratori: **D** 58 · **C** 58 · **A** 58 · **R** 58 · **B** 58 · **L** 58 · **E** 58.
- Accessibilità: nessuna violazione WCAG 2.1 A/AA rilevata da axe-core, a parte il contrasto voluto nell'esempio di cattivo design di MC-DIG-3-04. Corretto il contrasto di una categoria in MC-MAT-1-04.
- Privacy: i laboratori non fanno richieste a server esterni. Font e three.js sono ospitati sul sito; i dati restano nel browser.
- Leggibilità (indice Gulpease): consegne fra 60 e 88, tutte ≥60; laboratorio intero fra 52 e 70. Sotto 60 i testi informativi vanno letti con il docente.

## Metodo

| Criterio | Che cosa è stato controllato | Come |
|---|---|---|
| **D** Disegno didattico | Obiettivo per livello, azione dello studente, feedback, verifica, collegamento al compito di realtà | Struttura della pagina; banco domande per livello dal quiz della MC |
| **C** Correttezza | Coerenza di dati e calcoli con il testo della MC; assenza di risultati non numerici | Revisione dei 58 config; test automatici sui valori minimi, medi e massimi di ogni parametro; correzione dei testi sorgente |
| **A** Adeguatezza | Classe, graduazione F/I/A, leggibilità, uso su smartphone | Indice Gulpease su consegne e testo; test a 360 px |
| **R** Bias e stereotipi | Nomi, ruoli, esempi | Conteggio dei nomi per genere; revisione dei contenuti |
| **B** Fonti e licenze | Origine dei contenuti, licenze di codice e font | Piè di pagina; inventario delle risorse caricate |
| **L** Linguaggio e accessibilità | WCAG 2.1 A/AA, tastiera, screen reader | axe-core 4.10 su ognuna delle tre schede; schede WAI-ARIA |
| **E** Etica e sicurezza | Dati personali, richieste esterne, trasparenza IA | Monitoraggio delle richieste di rete in Playwright |

**Limiti.** Il controllo C verifica la coerenza con il testo della MC, non rifà la verifica delle fonti del libro. Il controllo R non sostituisce la lettura di un revisore umano.

## Tabella dei laboratori

| MC | Laboratorio | Archetipo | D | C | A | R | B | L | E | Gulpease consegne | Esito |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MC-ALI-2-01 | Dal seme alla mensa | Simulatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 70 | ✅ Validabile senza modifiche |
| MC-ALI-2-02 | Laboratorio della conservazione | Smistatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 71 | ✅ Validabile senza modifiche |
| MC-ALI-2-03 | Il piatto equilibrato | Calcolatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 67 | ✅ Validabile senza modifiche |
| MC-ALI-2-04 | Il viaggio del cibo | Flussi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 75 | ✅ Validabile senza modifiche |
| MC-ALI-2-05 | Packaging sotto la lente | Comparatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 77 | ✅ Validabile senza modifiche |
| MC-ALI-2-06 | Il comitato del cibo futuro | Scenario | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 71 | ✅ Validabile senza modifiche |
| MC-AMB-2-01 | Forze in gioco | Costruttore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 67 | ✅ Validabile senza modifiche |
| MC-AMB-2-02 | La bolletta di casa | Calcolatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 80 | ✅ Validabile senza modifiche |
| MC-AMB-2-03 | Il quartiere sotto la lente | Costruttore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 78 | ✅ Validabile senza modifiche |
| MC-AMB-2-04 | Sole e casa | Simulatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 78 | ✅ Validabile senza modifiche |
| MC-AMB-2-05 | Il viaggio dell'acqua | Flussi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 82 | ✅ Validabile senza modifiche |
| MC-AMB-2-06 | Cruscotto della città | Laboratorio dati | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 72 | ✅ Validabile senza modifiche |
| MC-COM-3-01 | Mappa del Wi-Fi | Flussi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 82 | ✅ Validabile senza modifiche |
| MC-COM-3-02 | Studio di registrazione | Simulatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 68 | ✅ Validabile senza modifiche |
| MC-COM-3-03 | Il tragitto casa-scuola | Calcolatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 72 | ✅ Validabile senza modifiche |
| MC-COM-3-04 | Casa domotica per Carmelo | Costruttore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 78 | ✅ Validabile senza modifiche |
| MC-COM-3-05 | Internet non è una nuvola | Flussi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 65 | ✅ Validabile senza modifiche |
| MC-COM-3-06 | Virale o vero? | Ispettore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 77 | ✅ Validabile senza modifiche |
| MC-DIG-1-01 | Dentro il dispositivo | Costruttore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 70 | ✅ Validabile senza modifiche |
| MC-DIG-1-02 | Detective delle fonti | Ispettore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 71 | ✅ Validabile senza modifiche |
| MC-DIG-1-03 | Il robot della colazione (pilota) | Programmatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 76 | ✅ Validabile senza modifiche |
| MC-DIG-2-01 | Caccia al bug in Scratch | Programmatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 76 | ✅ Validabile senza modifiche |
| MC-DIG-2-02 | Le tracce che lasci | Ispettore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 76 | ✅ Validabile senza modifiche |
| MC-DIG-2-03 | Desktop in ordine | Smistatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 76 | ✅ Validabile senza modifiche |
| MC-DIG-2-04 | Casella sotto attacco (pilota) | Ispettore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 82 | ✅ Validabile senza modifiche |
| MC-DIG-2-05 | Benessere digitale | Scenario | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 76 | ✅ Validabile senza modifiche |
| MC-DIG-3-01 | Robot segui-linea | Programmatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 70 | ✅ Validabile senza modifiche |
| MC-DIG-3-02 | IA: che cosa fa, chi decide | Smistatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 67 | ✅ Validabile senza modifiche |
| MC-DIG-3-03 | Grafici che parlano (e che mentono) | Laboratorio dati | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 74 | ✅ Validabile senza modifiche |
| MC-DIG-3-04 | Il sito senza barriere | Ispettore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 77 | ✅ Validabile senza modifiche |
| MC-DIS-1-01 | Riga e compasso | Tavolo grafico | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 72 | ✅ Validabile senza modifiche |
| MC-DIS-1-02 | Lo scalatore | Simulatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 80 | ✅ Validabile senza modifiche |
| MC-DIS-2-01 | Tre sguardi (pilota) | Tavolo grafico | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 74 | ✅ Validabile senza modifiche |
| MC-DIS-2-02 | Cavaliera o isometrica? | Tavolo grafico | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 67 | ✅ Validabile senza modifiche |
| MC-DIS-3-01 | Punto di fuga | Tavolo grafico | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 71 | ✅ Validabile senza modifiche |
| MC-DIS-3-02 | Dal CAD alla stampa 3D | Tavolo grafico | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 71 | ✅ Validabile senza modifiche |
| MC-ENE-3-01 | Banco delle leve (pilota) | Simulatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 88 | ✅ Validabile senza modifiche |
| MC-ENE-3-02 | L'impronta di carbonio di casa | Calcolatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 71 | ✅ Validabile senza modifiche |
| MC-ENE-3-03 | Fotovoltaico per la scuola | Simulatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 72 | ✅ Validabile senza modifiche |
| MC-ENE-3-04 | Breadboard virtuale | Simulatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 76 | ✅ Validabile senza modifiche |
| MC-ENE-3-05 | Dove va l'energia | Flussi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 74 | ✅ Validabile senza modifiche |
| MC-ENE-3-06 | La rete in 24 ore | Simulatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 80 | ✅ Validabile senza modifiche |
| MC-INF-1-01 | Bit-lab | Simulatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 73 | ✅ Validabile senza modifiche |
| MC-INF-1-02 | Gara di ricerca | Programmatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 72 | ✅ Validabile senza modifiche |
| MC-INF-2-01 | Sei il sistema operativo | Simulatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 68 | ✅ Validabile senza modifiche |
| MC-INF-2-02 | Cripto-lab | Simulatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 76 | ✅ Validabile senza modifiche |
| MC-INF-3-01 | Internet delle Cose | Costruttore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 70 | ✅ Validabile senza modifiche |
| MC-INF-3-02 | Addestra il classificatore | Laboratorio dati | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 70 | ✅ Validabile senza modifiche |
| MC-MAT-1-01 | Banco dei materiali | Banco prova | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 67 | ✅ Validabile senza modifiche |
| MC-MAT-1-02 | Passaporto tecnologico | Flussi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 77 | ✅ Validabile senza modifiche |
| MC-MAT-1-03 | Materiali del futuro | Comparatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 69 | ✅ Validabile senza modifiche |
| MC-MAT-1-04 | Differenzia! (pilota) | Smistatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 68 | ✅ Validabile senza modifiche |
| MC-MAT-1-05 | Banco dei metalli | Banco prova | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 67 | ✅ Validabile senza modifiche |
| MC-MAT-1-06 | Fibre, plastiche e compositi | Banco prova | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 68 | ✅ Validabile senza modifiche |
| MC-SIS-3-01 | Dove vanno i tuoi soldi | Flussi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 66 | ✅ Validabile senza modifiche |
| MC-SIS-3-02 | Gruppo d'acquisto solidale | Comparatore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 67 | ✅ Validabile senza modifiche |
| MC-SIS-3-03 | Business Model Canvas | Canvas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 69 | ✅ Validabile senza modifiche |
| MC-SIS-3-04 | Bussola delle professioni | Canvas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 60 | ✅ Validabile senza modifiche |

## Correzioni ai laboratori (costruzione e validazione)

- **MC-ALI-2-06 · C** — Scenario allineato alla norma: in Italia la L. 172/2023 vieta produzione e vendita di carne coltivata; nell'UE serve l'autorizzazione come novel food dopo la valutazione EFSA.
- **MC-ALI-2-06 · E** — Il nodo sulla carne coltivata premia la verifica delle regole prima della decisione.
- **MC-AMB-2-04 · C** — Scenario avanzato riallineato al testo corretto: quote di dispersione con ventilazione (35/15/25/10/15%), riduzioni calcolate dal rapporto fra le U, VMC aggiunta, obiettivo del bando 50 kWh/m²·anno (prima 40, irraggiungibile con i dati del libro). Con tutti gli interventi si arriva a circa 33.
- **MC-COM-3-02 · C** — Corretta la risposta sulla licenza BY-NC (uso commerciale: no). Il testo ora richiama l'eccezione limitata dell'art. 70 L. 633/1941.
- **MC-COM-3-04 · C** — Corretti i valori iniziali della simulazione.
- **MC-COM-3-06 · E** — La notizia falsa è inventata e dichiarata come esempio da smontare.
- **MC-DIG-1-02 · C** — Compito di realtà e microlearning della MC riallineati al metodo SIFT usato nel testo (prima citavano CRAAP).
- **MC-DIG-2-04 · E** — Messaggi di phishing con marchi e domini inventati: nessun marchio reale imitato.
- **MC-DIG-2-04 · C** — Analizzatore di password con controllo delle sostituzioni prevedibili (P@$$w0rd); il testo ora spiega l'attacco a dizionario.
- **MC-DIG-3-03 · C** — Corretta la soglia dei giorni (oltre 15) nella logica dello scenario.
- **MC-DIG-3-04 · L** — Il contrasto insufficiente segnalato da axe-core è voluto: è l'esempio di cattivo design da correggere nell'attività. Il resto della pagina è conforme.
- **MC-DIS-1-02 · C** — Corretta la formula della scala minima.
- **MC-DIS-2-01 · C** — Metodo europeo (prospetto in alto a sinistra, vista laterale da sinistra a destra, pianta sotto) coerente con il testo, il quiz, le flashcard e il microlearning corretti.
- **MC-DIS-2-01 · L** — Il solido 3D ha comandi a pulsante per la rotazione; le attività di riconoscimento non richiedono il trascinamento.
- **MC-DIS-3-01 · C** — Corretto il fattore di scala (×24).
- **MC-ENE-3-06 · B** — Il modello della giornata avanzata è dichiarato come semplificato (curve tipiche, efficienza 90%), non come dato misurato.
- **MC-INF-2-02 · C** — Il messaggio da decifrare (ALJUVSVNPH, K=7 → TECNOLOGIA) ora coincide con il testo, che riportava una stringa errata.
- **MC-MAT-1-02 · C** — Corretta la nota di confronto fra i maglioni (costo per uso).
- **MC-MAT-1-04 · L** — Corretto il contrasto del colore della categoria Plastica e metalli (da 4,3:1 a oltre 4,5:1).
- **MC-SIS-3-04 · R** — Il livello base affronta in modo esplicito lo stereotipo di genere nelle professioni STEM.
- **MC-SIS-3-04 · E** — Il profilo RIASEC resta solo sul dispositivo e dichiara di non essere il test ufficiale di Holland.

## Correzioni ai testi delle MC (repository `data/`)

- **MC-DIS-2-01** — disposizione delle viste secondo il metodo europeo e orientamento delle linee nascoste (testo, quiz, flashcard, microlearning).
- **MC-INF-2-02** — messaggio cifrato K=7 corretto in `ALJUVSVNPH`.
- **MC-INF-3-02** — etichette dei livelli SPERIMENTA riportate a Base / Intermedio / Avanzato.
- **MC-AMB-2-04** — esercizio avanzato ricostruito: quote di dispersione, riduzioni coerenti con le U, obiettivo raggiungibile, riferimento corretto alla direttiva UE 2024/1275.
- **MC-MAT-1-04** — il deposito cauzionale in Italia è in discussione in Parlamento, non già introdotto.
- **MC-COM-3-02** — eccezione didattica limitata dell'art. 70 L. 633/1941.
- **MC-ENE-3-06** — sostituito il consumo medio non verificabile con l'uso dei dati reali delle bollette.
- **MC-ALI-2-06** — stato normativo della carne coltivata (L. 172/2023, novel food UE).
- **MC-DIG-2-04** — tolto il dato non documentato sul 90%, marchio inventato nel messaggio simulato, nota sugli attacchi a dizionario.
- **MC-DIG-1-02** — compito di realtà e microlearning allineati al metodo SIFT.

## Manutenzione

- Ogni modifica a un laboratorio richiede di rifare l'audit automatico e di rigenerare questo report (`python3 scripts/laboratori/carble-report.py docs/validazione-laboratori/audit-automatico.json`).
- La formula di trasparenza è nel motore comune (`scripts/laboratori/engine.js`) e nel piè di pagina dei 5 laboratori pilota.
