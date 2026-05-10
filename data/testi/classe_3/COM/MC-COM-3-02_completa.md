# MC-COM-3-02 — Cosa significa produrre un contenuto digitale responsabile?
**Area:** Comunicazioni e Trasporti · **Anno:** 3ª · **Livello DigComp:** Intermediate (I)
**SDG:** 16 — Pace, giustizia e istituzioni solide · **Fonte:** Hypertech 2020
**Struttura:** 4 pagine (MC livello Intermedio, contenuto espanso) · Versione contenuto completo per editing

---

## ⚡ INNESCA

> **QR CODE AUDIO → "500 ore al minuto. Quanto vale il tuo video?"**
> 🎧 *Ascolta prima di leggere. Durata: 2 min 35 sec.*
> *(Script completo: MC-COM-3-02_hook-script.md)*

**Domanda di avvio:**
Ogni minuto del 2024 vengono caricati su YouTube 500 ore di video.
Se guardassero tutto quello che viene caricato oggi, ci vorrebbero 82 anni senza mai dormire.

Di tutto questo, quanta parte è accurata? Quanta parte rispetta i diritti di chi ha creato le risorse usate? E quando pubblichi qualcosa — anche con un pubblico piccolo — di che cosa sei responsabile?

---

## 📖 ESPLORA

### I contenuti digitali: da cosa sono fatti e come funzionano

Ogni cosa che vedi online è un contenuto digitale: un testo, una foto, un video, un audio, un'animazione, un modello 3D, un'esperienza in realtà aumentata. Tutti questi tipi di contenuto hanno due caratteristiche in comune: sono codificati in bit (0 e 1) e possono essere copiati, modificati e distribuiti a costo quasi nullo. Questa seconda caratteristica — la riproducibilità a costo zero — è ciò che rende la produzione e distribuzione di contenuti digitali così diversa da qualsiasi altra forma di comunicazione nella storia.

---

### Tipi di contenuti digitali

**Testo:** la forma più elementare di contenuto digitale. Un carattere in UTF-8 occupa da 1 a 4 byte. Un articolo di giornale di 1.000 parole occupa circa 6 KB — pochi secondi di download anche con una connessione lentissima. Il testo è il formato più accessibile (non richiede hardware speciale) e il più indicizzabile dai motori di ricerca.

**Immagine:** una fotografia digitale è una griglia di pixel, ognuno dei quali ha un valore di colore espresso in tre canali (rosso, verde, blu — RGB). Una foto a 12 megapixel (tipica di uno smartphone) ha 12 milioni di pixel; se non compressa, occuperebbe circa 36 MB. Ecco perché si usano formati compressi.

**Audio:** un file audio digitale è una sequenza di campioni — misure della pressione sonora prese a intervalli regolari. La qualità CD usa 44.100 campioni al secondo (44,1 kHz) con 16 bit per campione. Un minuto di audio non compresso occupa circa 10 MB.

**Video:** è semplicemente una sequenza di immagini (frame) con audio sincronizzato. A 24 frame al secondo, un minuto di video in Full HD (1920×1080 pixel) non compresso occuperebbe circa 90 GB. Ecco perché la compressione è fondamentale.

**3D, AR/VR:** modelli tridimensionali (mesh di poligoni con texture) e ambienti immersivi richiedono potenza di calcolo per il rendering. Sono i formati in più rapida crescita ma ancora meno diffusi per la produzione amatoriale.

---

### Compressione: come si riduce un file senza perdere (troppo)

Il problema della compressione è questo: come si può rappresentare la stessa informazione usando meno bit?

Esistono due strategie fondamentali:

**Compressione lossless (senza perdita):** il file viene compresso in modo che sia possibile ricostruire esattamente l'originale. Non si perde nessuna informazione. Funziona cercando ridondanze nel file — sequenze che si ripetono — e sostituendole con rappresentazioni più corte.

Esempi:
- **PNG** per le immagini: perfetto per immagini con aree uniformi (loghi, screenshot, grafici). Una vasta zona di blu uniforme si comprime molto bene.
- **FLAC** per l'audio: qualità identica al CD, file più piccoli del 50-60%.
- **ZIP** per qualsiasi tipo di file: compressione generica, molto usata per distribuire insiemi di file.

**Compressione lossy (con perdita):** si scartano informazioni che l'occhio o l'orecchio umano percepisce meno. La ricostruzione non è identica all'originale — ma la differenza è difficile o impossibile da percepire a valori di compressione moderati.

Esempi:
- **JPEG** per le fotografie: elimina i dettagli fini che l'occhio non distingue facilmente. A compressione moderata (qualità 80-90/100) la differenza dalla foto originale è quasi impercettibile. A compressione alta (qualità 30-40/100) compaiono gli "artefatti" — blocchi quadrati visibili, soprattutto lungo i bordi nitidi.
- **MP3** per l'audio: elimina frequenze che l'orecchio umano percepisce meno (molto alte, molto basse, suoni mascherati da suoni più forti). A 256 kbit/s la differenza dal FLAC è difficile da sentire per la maggior parte delle persone.
- **H.264, H.265, AV1** per il video: comprimono sfruttando il fatto che tra un frame e il successivo cambiano solo piccole aree dell'immagine. Invece di memorizzare ogni frame completo, memorizzano solo le differenze.

| Formato | Tipo | Uso principale | Trade-off |
|---------|------|---------------|-----------|
| PNG | Lossless | Loghi, screenshot, grafica | File più grande di JPEG |
| JPEG | Lossy | Fotografie | Artefatti ad alta compressione |
| FLAC | Lossless | Musica alta qualità | File 3-5× più grande di MP3 |
| MP3 | Lossy | Musica streaming, podcast | Perdita udibile a bassa qualità |
| H.264 | Lossy | Video streaming, YouTube | Standard ancora molto diffuso |
| H.265 | Lossy | Video 4K, streaming avanzato | Compressione doppia di H.264 |
| AV1 | Lossy | YouTube, Netflix moderni | Open source, altissima qualità a bassa dimensione |

> 💡 **Perché non usare sempre il lossless?** Dimensioni. Una raccolta di 5.000 fotografie di vacanze in JPEG occupa circa 15 GB. Le stesse foto in RAW (lossless) occuperebbero 75-150 GB. Per la pubblicazione online, la compressione lossy moderata è il giusto compromesso. Per l'archiviazione professionale o il fotoritocco, si preferisce il lossless.

---

### Diritto d'autore: come funziona in Italia e quanto dura

Quando crei qualcosa di originale — un testo, una fotografia, una canzone, un video — quella creazione è protetta automaticamente dal **diritto d'autore** (copyright). Non serve registrare nulla: il diritto nasce nel momento in cui l'opera viene creata e fissata su un supporto.

In Italia, il diritto d'autore è regolato dalla **Legge n. 633 del 22 aprile 1941** (L.D.A.), più volte aggiornata per adeguarsi alle direttive europee. I punti chiave:

**Durata:** la protezione dura per tutta la vita dell'autore più **70 anni** dalla sua morte. Un'opera diventa di **dominio pubblico** — liberamente usabile da tutti — solo dopo questo periodo. Questo significa che le opere di Giacomo Puccini (morto nel 1924) sono di dominio pubblico; le opere di Italo Calvino (morto nel 1985) saranno di dominio pubblico solo nel 2056.

**Cosa protegge:** l'espressione originale, non l'idea. Non puoi copiare il testo di un romanzo; puoi scrivere un romanzo sullo stesso tema. Non puoi usare la fotografia di qualcun altro; puoi fotografare lo stesso soggetto tu stesso.

**Cosa non protegge:** fatti e notizie (non si può avere copyright su "oggi è piovuto a Milano"), titoli semplici, idee astratte, dati statistici.

**Il simbolo ©** non è obbligatorio per proteggere un'opera: la protezione esiste anche senza. Il simbolo serve solo a ricordare a chi vede l'opera che è protetta.

**Usare il contenuto di qualcun altro senza permesso è plagio.** Il plagio non è solo copiare un testo parola per parola: è anche riprendere la struttura originale senza citazione, usare un'immagine senza autorizzazione, sottotitolare un video con la colonna sonora di un film senza licenza. Le conseguenze sono sanzioni civili (risarcimento del danno) e, in certi casi, penali.

---

### Plagio vs. citazione: la differenza pratica

**Citare** una fonte è legale e necessario. Ecco le regole pratiche per citare correttamente in un lavoro scolastico o in un contenuto online:

Per un **testo:** indica sempre il nome dell'autore, il titolo dell'opera, l'anno di pubblicazione, e — se disponibile — il numero di pagina o l'URL. Una citazione testuale diretta va tra virgolette. Non usare più di qualche decina di parole da un testo senza permesso esplicito.

Per una **fotografia o immagine:** indica sempre il nome del fotografo/autore, la fonte (sito o pubblicazione), e la licenza. Non basta scrivere "immagine da Google" — Google non è autore di nessuna immagine; ne mostra solo l'anteprima.

Per un **video o audio:** indica autore, titolo, piattaforma, e URL. Per la musica di sottofondo in un video: usa solo musica con licenza esplicita che permette l'uso in video.

**Regola pratica:** se non sai chi ha fatto qualcosa e con quali diritti, non usarla.

---

### Le licenze Creative Commons: cosa puoi fare con ogni licenza

Il diritto d'autore tradizionale è "tutti i diritti riservati" — non puoi fare nulla senza permesso. Le licenze **Creative Commons (CC)** sono un sistema di licenze standard che permettono agli autori di concedere alcuni diritti mantenendone altri.

Le licenze CC si costruiscono combinando quattro elementi:

| Sigla | Nome | Significato |
|-------|------|------------|
| **BY** | Attribuzione | Devi citare l'autore originale. È presente in quasi tutte le licenze CC. |
| **SA** | ShareAlike (Condividi allo stesso modo) | Se modifichi l'opera, devi distribuire il risultato con la stessa licenza. |
| **NC** | NonCommercial (Non Commerciale) | Non puoi usare l'opera per scopi commerciali. |
| **ND** | NoDerivs (Non opere derivate) | Non puoi modificare l'opera — solo distribuirla integralmente. |

Le sei licenze principali:

| Licenza | Simbolo | Cosa puoi fare |
|---------|---------|----------------|
| **CC0** | CC Zero | Opera in dominio pubblico. Puoi fare qualsiasi cosa, anche senza citare. |
| **CC BY** | Attribuzione | Puoi usare, modificare, distribuire, anche commercialmente. Devi citare l'autore. |
| **CC BY-SA** | Attribuzione + Condividi allo stesso modo | Come CC BY, ma le tue opere derivate devono avere la stessa licenza. Wikipedia usa questa licenza. |
| **CC BY-NC** | Attribuzione + Non Commerciale | Puoi usare e modificare, ma non per scopi commerciali. Devi citare. |
| **CC BY-NC-SA** | Attrib. + Non Comm. + Condividi | Uso non commerciale, opere derivate con stessa licenza, citazione obbligatoria. |
| **CC BY-ND** | Attribuzione + Nessuna modifica | Puoi distribuire solo l'opera intatta, non modificarla. Devi citare. |

**Dove trovare contenuti con licenza CC:**
- Freesound.org: suoni e musica CC (ottimo per podcast)
- Unsplash.com e Pixabay.com: fotografie (la maggior parte CC0 o CC BY)
- Wikimedia Commons: immagini e media in varie licenze CC
- ccmixter.org: musica CC per remix
- Archive.org: testi, audio e video in dominio pubblico o CC

> ⚠️ **Attenzione:** verificare sempre la licenza specifica del singolo file, non solo della piattaforma. Su Freesound, la maggior parte dei suoni è CC, ma alcuni hanno licenze diverse. Non assumere mai — controlla.

---

### Produzione podcast: dalla struttura alla distribuzione

Il podcast è il formato audio più democratico del decennio: chiunque può produrne uno con un telefono, un microfono economico e un software gratuito. Ma fare un podcast che qualcuno voglia ascoltare — e che rispetti le regole — richiede metodo.

**Struttura di un episodio podcast:**

1. **Intro:** massimo 30 secondi. Nome del podcast, episodio, presentazione del tema. Musica di apertura con licenza CC — la stessa in ogni episodio (crea riconoscibilità).

2. **Hook narrativo:** i primi 60-90 secondi sono decisivi. Se l'ascoltatore non è agganciato, smette. Inizia con un fatto sorprendente, una domanda, una storia breve — non con "oggi parleremo di...".

3. **Corpo:** sviluppa il tema in sequenze logiche di 3-5 minuti ognuna. Usa transizioni ("passiamo ora a...", "ma c'è un aspetto che molti ignorano...") per guidare l'ascolto.

4. **Conclusione:** riassumi in 2-3 frasi i punti principali. Call to action (es. "prova questo a casa", "cerca questa fonte", "lascia un commento").

5. **Outro:** musica di chiusura (CC), saluto, eventuali ringraziamenti alle fonti usate.

**Registrazione:**
- Microfono vicino alla bocca (15-20 cm) per ridurre il rumore di fondo.
- Stanza con assorbimento acustico — anche improvvisato: registrare in un armadio pieno di vestiti è molto meglio che in una stanza vuota con eco.
- App gratuite: Audacity (desktop), GarageBand (iOS/macOS), Anchor/Spotify for Podcasters (mobile).

**Editing:**
- Taglia i silenzi troppo lunghi (sopra 1 secondo).
- Normalizza il volume (portare il livello medio a -16 LUFS per podcast, -14 LUFS per musica).
- Rimuovi i rumori di fondo con il denoiser (integrato in Audacity).
- Aggiungi la musica CC in un layer separato, abbassata a -20 dB sotto la voce.

**Documento di accompagnamento (show notes):** per ogni episodio, pubblica un documento con: titolo, data, nomi degli autori, riassunto, lista di tutte le fonti usate con titolo e URL, crediti per la musica con licenza e fonte.

---

### Produzione video: inquadrature, audio, montaggio

La differenza tra un video "amatoriale" e uno che si guarda volentieri raramente dipende dalla fotocamera — quasi sempre dipende da tre elementi: luce, audio, stabilità.

**Luce:** la fonte di luce deve essere davanti al soggetto (o di lato), non dietro. Una finestra dietro di te crea il tuo viso scuro su sfondo chiaro — l'errore più comune. Se filmi una persona, posizionala di fronte alla finestra.

**Audio:** il microfono del telefono è sufficiente se il soggetto è vicino (massimo 50 cm) e la stanza è silenziosa. Qualsiasi rumore di fondo — ventilatore, traffico, refrigeratore — viene amplificato a distanza. Un microfono lavalier da 10-15 euro collegato al telefono migliora drasticamente la qualità audio.

**Stabilità:** un video tremante stanca l'occhio. Usa sempre un supporto (treppiede, libro, banco) — non tenere mai il telefono in mano libera per riprese statiche.

**Le inquadrature fondamentali:**

- **Piano totale (long shot):** si vede il soggetto intero nel contesto ambientale. Serve per mostrare "dove siamo".
- **Piano americano:** dal busto in su. Equilibrio tra contesto e dettaglio del soggetto.
- **Primo piano:** il viso. Trasmette emozioni.
- **Dettaglio (close-up):** una mano, un oggetto, un testo. Usato per sottolineare un elemento specifico.

**Regola dei terzi:** non mettere il soggetto al centro dell'inquadratura. Immagina una griglia 3×3 sulla tua immagine. Il soggetto va posizionato su una delle linee o ai loro incroci. Quasi tutti i nostri occhi trovano questa composizione più dinamica e interessante.

**Montaggio base:**
- Taglia ogni ripresa al minimo necessario: nessuna ripresa dovrebbe durare più di quanto necessario a comunicare l'informazione.
- Varia la lunghezza delle inquadrature per il ritmo.
- Aggiungi titoli/testi con font leggibile (minimo 28pt) e contrasto sufficiente.
- Musica CC come sottofondo: mantieni il volume della musica almeno 15 dB sotto la voce parlante.

---

### Fake video e deepfake: come si riconoscono

I **deepfake** sono video o audio generati da intelligenza artificiale che mostrano persone dire o fare cose che non hanno mai detto o fatto. La tecnologia, nata in ambito cinematografico, è diventata accessibile a chiunque nel 2023-2024 grazie a strumenti gratuiti online.

**Come funzionano:** un modello di IA viene addestrato su molte fotografie o video reali di una persona. Una volta addestrato, è in grado di sovrapporre il volto di quella persona su un altro video, sincronizzando i movimenti labiali. I sistemi più avanzati possono clonare la voce con pochi secondi di audio reale.

**Come si riconoscono (segnali da cercare):**

- **Bordi del viso** incoerenti — l'IA fatica a ricreare fedelmente i capelli, le orecchie, i bordi del viso nella luce laterale.
- **Occhi** che non battono le palpebre in modo naturale, o che non seguono correttamente la direzione dello sguardo.
- **Denti** sfumati o incoerenti — spesso poco dettagliati.
- **Riflessi** negli occhi che non corrispondono all'illuminazione della scena.
- **Inconsistenza audio-video:** le labbra non sincronizzate perfettamente, voce con qualità diversa dal video.
- **Contesto incoerente:** metadati che non corrispondono (data, luogo), fonti non verificabili.

**Strumenti di verifica:**
- **FotoForensics (fotoforensics.com):** analisi dell'errore di livello (ELA) — mostra le aree di un'immagine che potrebbero essere state modificate digitalmente.
- **Google Reverse Image Search / TinEye:** cerca la stessa immagine online — se è stata usata in contesti diversi da quello in cui ti è presentata, è probabile che sia decontestualizzata.
- **InVID/WeVerify (plugin browser):** strumento professionale per la verifica di video online, usato da giornalisti.
- **Snopes.com, Fact Check.org, Pagella Politica (Italia):** fact-checker professionali.

> 🤖 **Box T8 — IA critica.** Come funziona un deepfake? Un sistema di intelligenza artificiale chiamato GAN (Generative Adversarial Network) è composto da due reti neurali che lavorano insieme: una *generatrice* che produce immagini false, e una *discriminatrice* che cerca di distinguere le false dalle reali. Le due si addestrano a vicenda — la generatrice migliora cercando di ingannare la discriminatrice; la discriminatrice migliora cercando di non essere ingannata. Il risultato dopo milioni di iterazioni è un modello capace di produrre immagini difficilissime da distinguere da quelle reali. La stessa IA che produce deepfake è anche quella che può rilevarli — ma la corsa agli armamenti tra produttori e rilevatori è continua. **Regola pratica:** davanti a un video che mostra qualcosa di sorprendente o scandaloso, cerca sempre la fonte originale prima di condividerlo. La sorpresa e lo scandalo sono esattamente i meccanismi emotivi che fanno abbassare la guardia critica.

---

> **Collegamento STEM — Matematica:**
> La compressione audio MP3 funziona eliminando le frequenze che l'orecchio percepisce meno bene. L'orecchio umano è meno sensibile a frequenze sopra i 15.000 Hz e a suoni "mascherati" da suoni più forti. L'algoritmo calcola per ogni istante temporale quali componenti frequenziali sono sotto la soglia percettiva e le elimina. A 128 kbit/s, un MP3 scarta circa il 90% dell'informazione originale — eppure la maggior parte delle persone non sente differenza in un ascolto normale. La psicoacustica (la scienza di come l'orecchio percepisce il suono) è matematica applicata alla biologia.

> **Collegamento STEM — Informatica:**
> Il formato JPEG divide l'immagine in blocchi di 8×8 pixel e applica a ogni blocco la DCT (Discrete Cosine Transform) — una trasformazione matematica che converte i valori di colore in frequenze spaziali. Le frequenze alte (dettagli fini) vengono compresse più aggressivamente perché l'occhio le percepisce meno. Questo è lo stesso principio matematico usato per la compressione audio e video. La matematica delle trasformate — Fourier, coseno, wavelet — è il cuore di quasi tutti i codec moderni.

---

## 🔍 OSSERVA

### Il caso: un podcast prodotto da studenti, dall'idea alla pubblicazione

Il Liceo Scientifico "Archimede" di una città italiana ha prodotto nel 2025 un podcast di 8 episodi sulla storia della tecnologia nella propria città — industrie locali, inventori dimenticati, oggetti che hanno cambiato la vita quotidiana. Ogni episodio è stato prodotto interamente dalla classe: ricerca, script, registrazione, editing, distribuzione.

**Fase 1 — Idea e struttura:** la classe ha scelto il tema votando tra tre proposte. Poi ha definito la struttura: 8 episodi di 5 minuti ciascuno, un episodio per settimana. Ogni episodio tratta un oggetto tecnologico o un'invenzione locale. Rubrica fissa: hook narrativo (60 sec) + sviluppo storico (180 sec) + professione attuale collegata (60 sec).

**Fase 2 — Ricerca e verifica delle fonti:** ogni gruppo di 3-4 studenti ha ricercato un episodio usando biblioteca scolastica, Wikisource, archivi storici locali (spesso accessibili online), interviste a esperti o anziani. Ogni fatto dichiarato nel podcast ha una fonte verificabile nel documento di accompagnamento.

**Fase 3 — Script e revisione:** lo script scritto in anticiso è stato revisionato in classe. Ogni frase è stata testata ad alta voce — le frasi troppo lunghe o con parole difficili da pronunciare sono state riscritte. Durata target per episodio: 5 minuti = circa 750 parole (una persona parla a circa 150 parole al minuto).

**Fase 4 — Registrazione:** registrato con due smartphone in modo "a doppia protezione" — se uno fallisce, l'altro è il backup. Stanza: aula vuota con i banchi spostati lungo le pareti e zaini appesi sui muri per assorbimento acustico improvvisato.

**Fase 5 — Editing:** Audacity (gratuito). Operazioni: taglio delle pause lunghe, normalizzazione volume, aggiunta musica CC (da freesound.org), dissolvenza in apertura e chiusura. Tempo medio di editing per episodio: 45 minuti.

**Fase 6 — Pubblicazione:** Internet Archive (archive.org) — piattaforma gratuita, open source, senza algoritmi pubblicitari. Ogni episodio è stato caricato con licenza CC BY-SA (gli ascoltatori possono usare e modificare, ma devono citare la fonte e mantenere la stessa licenza). Il documento di accompagnamento (show notes) include: tutti i nomi degli autori, tutte le fonti usate, i crediti per la musica.

**Risultato:** 8 episodi, 400 ascolti nei primi tre mesi, una segnalazione da una biblioteca locale che ha incluso il podcast nella propria raccolta digitale.

*Questo è un contenuto digitale responsabile: originale, verificato, trasparente sulle fonti, con licenza che rispetta il lavoro degli autori e invita alla condivisione.*

---

> **Errore comune:**
> "Posso usare qualsiasi musica in un video scolastico perché non è per scopi commerciali." Non è vero. Il diritto d'autore non ha un'eccezione automatica per uso educativo o non commerciale in Italia — a differenza degli USA (dove esiste il concetto di "fair use"). Per pubblicare un video online con musica protetta da copyright, anche senza guadagnarci un centesimo, sei potenzialmente soggetto a un reclamo. YouTube rimuove automaticamente video con musica coperta da Content ID. La soluzione: usa solo musica con licenza CC esplicita che permette l'uso in video (es. CC BY o CC0).

---

### Chi lavora con questa competenza nel 2030?

**Content Strategist con specializzazione etica**

Produrre contenuti digitali non è solo una questione tecnica — è una questione di strategia e responsabilità. Il Content Strategist decide cosa produrre, per chi, con quale obiettivo, su quali piattaforme, con quali risorse. Nel 2030, la componente etica del ruolo è diventata centrale: con la proliferazione di contenuti AI-generated, la capacità di produrre contenuti autentici, verificati e dichiaratamente umani diventa un valore differenziale.

Attività quotidiane: scrivere brief editoriali, supervisionare team di produzione, verificare le fonti, gestire le licenze, monitorare come i contenuti si diffondono e vengono modificati online, rispondere a reclami di copyright.

Dove lavora: testate giornalistiche, agenzie di comunicazione, organizzazioni non profit, istituzioni pubbliche (enti locali, scuole, musei), aziende con forte identità comunicativa.

Competenze chiave che inizia a costruire da qui: scrittura verificata · diritto d'autore · licenze CC · produzione podcast/video · media literacy · storytelling basato su dati

*"Non mi interessa solo che il contenuto funzioni. Mi interessa che sia vero, che sia mio, e che rispetti il lavoro degli altri."*

---

## 🔬 SPERIMENTA

> **Prima di iniziare, leggi la rubrica di valutazione in Zona 5.**
> Sai già quali criteri vengono valutati: organizza il tuo lavoro di conseguenza.

---

### BASE — Identifico le licenze e cito correttamente

**Obiettivo:** riconoscere il tipo di licenza di un contenuto digitale e capire cosa è permesso fare con esso.

**Materiali che ti servono:** il browser del computer o del tablet. Nient'altro.

**Come procedere:**

Vai su Freesound.org. Cerca un suono (ad esempio "rain" o "city street"). Clicca su uno dei risultati. Osserva:
- Il nome dell'autore
- Il tipo di licenza (CC0, CC BY, CC BY-NC, ecc.)
- La data di caricamento

Ripeti per 4 suoni diversi.

Poi compila questa tabella:

| N° | Nome del suono | Autore | Licenza | Posso usarlo in un video scolastico non pubblicato online? | Posso pubblicarlo su YouTube? | Devo citare l'autore? |
|----|--------------|--------|---------|-------------------------------------------------------|------------------------------|----------------------|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |

> 💡 **Aiuto per compilare la tabella:** CC0 = sì a tutto, nessuna citazione obbligatoria. CC BY = sì a tutto, cita l'autore. CC BY-NC = sì per uso non commerciale, cita l'autore. CC BY-ND = puoi usare solo il file intatto, cita l'autore. Se hai dubbi su cosa significa "commerciale" nel contesto scolastico, la risposta sicura è: un video pubblicato online è sempre trattato come potenzialmente commerciale dai sistemi automatici delle piattaforme.

---

### INTERMEDIO — Produco il mio podcast in 5 step

**Obiettivo:** produrre un episodio podcast di 3 minuti su un tema tecnologico, rispettando la struttura, le regole sulle fonti e le licenze CC.

**Materiali che ti servono:** smartphone o computer con microfono, app Audacity (gratuita, audacityteam.org) o GarageBand (iOS/macOS), accesso a Freesound.org per la musica CC.

**I cinque step:**

**Step 1 — Scegli il tema:** scegli un argomento tecnologico che ti interessa veramente. Esempi: come funziona il GPS, la storia del transistor, l'impatto ambientale dello streaming, come si produce un chip. Scrivi in una riga cosa vuoi che l'ascoltatore impari in 3 minuti.

**Step 2 — Ricerca e verifica:** cerca almeno 3 fonti diverse sull'argomento scelto. Per ogni fonte, annota: autore, titolo, URL, data di pubblicazione. Verifica che le informazioni siano coerenti tra le fonti — se una fonte dice qualcosa di diverso dalle altre due, approfondisci.

**Step 3 — Scrivi lo script:** 3 minuti = circa 450 parole (parla lentamente). Struttura: hook (60 sec) + sviluppo (120 sec) + conclusione (60 sec). Leggi lo script ad alta voce prima di registrare — elimina le frasi che ti fanno inciampare.

**Step 4 — Registra e monta:** registra in un posto tranquillo. Monta con Audacity: taglia le pause lunghe, normalizza il volume, aggiungi musica CC da Freesound.org come sottofondo (abbassa la musica a -20 dB sotto la voce).

**Step 5 — Documento di accompagnamento:** crea un documento (anche solo un foglio di testo) con: titolo dell'episodio, nomi degli autori (tuoi!), data, tema, riassunto in 2-3 righe, tutte le fonti usate con titolo e URL, crediti per la musica (nome autore, titolo, link Freesound, tipo di licenza CC).

> ⚠️ **Sicurezza e privacy:** non registrare né pubblicare informazioni personali — nome completo, scuola, indirizzo. Per il compito scolastico, usa uno pseudonimo o solo il nome di battesimo.

---

### AVANZATO — Produco, pubblico e analizo

**Scenario:** la tua classe vuole lasciare una traccia digitale del suo lavoro sulla Tecnologia. Decidete di produrre un podcast pubblico — pubblicato online, accessibile a chiunque — sulla tecnologia nella vostra città o sul tema del libro.

**Il tuo compito:**

1. **Pre-produzione:** definisci il concept del podcast (titolo, tagline, tema generale, struttura degli episodi, pubblico target), scegli la licenza CC con cui pubblicarlo e giustifica la scelta in 3-5 righe.

2. **Produzione di un episodio completo:** segui i 5 step dell'attività Intermedio, ma con standard più alti: la registrazione deve avere qualità professionale (niente eco, niente rumori di fondo), il montaggio deve includere dissolvenze in apertura/chiusura, e il documento di accompagnamento deve essere completo e formattato.

3. **Pubblicazione su Internet Archive:** carica il file audio su archive.org (gratuito, senza algoritmi). Compila correttamente tutti i metadati: titolo, autori, licenza, descrizione, tag.

4. **Analisi critica:** dopo la pubblicazione, rifletti per iscritto (1 pagina): qual è il rischio principale di pubblicare questo contenuto? Come hai verificato i fatti? Qualcuno potrebbe usarlo male — come? Cosa faresti diversamente se dovessi rifarlo?

5. **Verifica deepfake (bonus):** prendi un video di notizia recente (da un telegiornale o un canale YouTube di informazione) e sottoponilo all'analisi con lo strumento InVID/WeVerify. Descrivi cosa ha trovato l'analisi e come interpreti il risultato.

> **Domanda aperta:** la tua classe ha prodotto un podcast con licenza CC BY. Un anno dopo, scopri che qualcuno ha usato il vostro audio in un video su YouTube senza citarvi. Cosa fareste? Cosa sareste legalmente autorizzati a fare? Cerca la risposta con fonti precise.

---

## 🌍 AGISCI

---

### Rubrica di valutazione — leggila PRIMA di iniziare il compito

| Criterio | Base — Sufficiente | Intermedio — Buono | Avanzato — Ottimo |
|----------|-------------------|-------------------|------------------|
| **1. Rispetto delle licenze** | Usa musica CC0 o CC BY e lo dichiara nel documento di accompagnamento | Usa musica CC con la licenza corretta per lo scopo (pubblica/privata), cita l'autore con nome, titolo e link | Sceglie la licenza CC della propria opera in modo motivato, spiega perché quella licenza e non un'altra |
| **2. Qualità dello script e delle fonti** | Lo script ha una struttura riconoscibile (inizio-sviluppo-fine), usa almeno 2 fonti citate | Lo script segue la struttura hook-corpo-conclusione, le fonti sono 3+ con autore e URL verificato, i fatti dichiarati sono verificati | Lo script ha un hook narrativo efficace, ogni affermazione è verificabile, le fonti sono diverse per tipo (testo + video + articolo), il documento di accompagnamento è completo |
| **3. Qualità tecnica dell'audio** | L'audio è comprensibile, anche se con qualche rumore di fondo o volume irregolare | L'audio è pulito (poco rumore di fondo), volume normalizzato, musica CC aggiunta correttamente | Audio professionale: nessun rumore rilevante, volume bilanciato, dissolvenze presenti, timing preciso rispetto allo script |
| **4. Documento di accompagnamento** | Documento con titolo, autori, fonti principali | Documento con tutti i metadati (titolo, autori, data, tema), fonti complete con URL, crediti musica | Documento completo con licenza scelta e motivata, note di produzione, link all'episodio pubblicato (se presente) |

---

### Lo scenario

La tua classe vuole produrre una serie podcast sulla tecnologia — breve, verificata, con musica originale o in licenza libera. Ogni studente (o gruppo di 2) produce un episodio da 3 minuti su un tema tecnologico scelto.

Il risultato non è un compito "per il cassetto": è un contenuto che potrebbe essere pubblicato online e usato da altri. Questo significa che ogni scelta — di fonti, di licenze, di parole — ha conseguenze reali.

---

### La consegna

**Produci un episodio podcast di 3 minuti** su un tema tecnologico a tua scelta (deve essere un argomento trattato in questo libro o in qualsiasi area del corso di tecnologia).

Consegna:
1. Il file audio (MP3 o WAV)
2. Lo script completo (file testo o PDF)
3. Il documento di accompagnamento con: titolo, autori, data, tema, riassunto, fonti complete con URL, crediti per la musica (autore + link Freesound + tipo licenza CC)
4. (Facoltativo per il livello avanzato) Il link all'episodio pubblicato su Internet Archive

---

### Materiali che ti servono

- Smartphone o computer con microfono
- Audacity (gratuito) o GarageBand (gratuito su iOS/macOS)
- Freesound.org per la musica CC (gratuito, registrazione gratuita)
- Connessione a Internet per la ricerca delle fonti
- Nessun costo aggiuntivo

> **Suggerimento:** il modo più rapido per rovinare un podcast è non avere lo script. Scrivi prima tutto quello che vuoi dire, leggilo ad alta voce almeno due volte prima di registrare, poi registra. Scoprirai che le frasi che "sembrano bene" sulla carta spesso non funzionano ad alta voce — è normale, ed è per questo che lo script si riscrive.

---

### Badge SDG 16 — Pace, giustizia e istituzioni solide

Completando questo compito stai mettendo in pratica il 16° Obiettivo di Sviluppo Sostenibile: *promuovere società pacifiche e inclusive per lo sviluppo sostenibile, fornire accesso alla giustizia per tutti.*

Rispettare il diritto d'autore, citare correttamente le fonti e produrre contenuti verificabili sono atti di cittadinanza digitale: contribuiscono a un ecosistema informativo più onesto e giusto. Ogni contenuto falso o plagiato che non entra online è un contributo — piccolo ma reale — all'integrità dell'informazione pubblica.

---

### Dubbi? Chiedi all'AI Coach di ProfTecnologIA

**[QR CODE AI COACH]**

Scansiona e chiedi all'AI Coach:
- *"Posso usare questa canzone nel mio podcast se la licenza è CC BY-NC?"*
- *"Come si cita correttamente un sito web?"*
- *"Come si fa a riconoscere se un video è un deepfake?"*

L'AI Coach risponde solo su questa MC. Se fa un errore, segnalalo: è esattamente su questo tipo di valutazione critica che si costruisce la tua competenza digitale.

---

### Metacognizione — Rifletti sul tuo lavoro

Rispondi a queste domande **dopo** aver consegnato il podcast. Non c'è una risposta giusta: l'obiettivo è capire come hai ragionato, non solo cosa hai prodotto.

**1. Sorpresa**
C'è un fatto che hai trovato durante la ricerca che non ti aspettavi? Una statistica, una storia, una connessione tra cose diverse? Descrivi cosa hai trovato e come ti ha cambiato l'approccio allo script.

*Scrivi 2-3 righe:* ___________________________________________

---

**2. Difficoltà e soluzione**
C'è stata una parte del processo che ti ha bloccato — trovare fonti affidabili, tenere le frasi corte, editare l'audio, citare correttamente? Descrivi il problema e come l'hai risolto.

*Scrivi 2-3 righe:* ___________________________________________

---

**3. L'errore come risorsa**
C'è qualcosa che hai detto nel podcast e che, dopo averlo ascoltato, avresti voluto cambiare — una parola sbagliata, un fatto non verificato abbastanza, una frase confusa? Racconta cosa hai notato e come lo correggeresti in un secondo episodio.

*Cosa ti ha fatto accorgere dell'errore? Riascoltandoti? Un commento del docente o di un compagno? Una fonte nuova che contraddiceva quello che avevi detto?*

*Scrivi 2-3 righe:* ___________________________________________

---

**4. Connessione con la tua vita**
Hai mai condiviso online qualcosa — un video, una notizia, un'immagine — senza verificarne la fonte? Dopo questa MC, come cambieresti quel comportamento? Cosa faresti diversamente la prossima volta prima di cliccare "condividi"?

*Scrivi 2-3 righe:* ___________________________________________

---

### Collegamento con UDA-3 — "La scuola come sistema tecnologico"

Questa MC è parte dell'UDA interdisciplinare del terzo anno: *"La scuola come sistema tecnologico"*.

Il podcast che hai prodotto diventa un asset del progetto: se la classe decide di pubblicarlo su Internet Archive, sarà un contributo alla documentazione pubblica del percorso didattico. In quel caso, le scelte di licenza e il documento di accompagnamento non sono formalità — sono la differenza tra un contenuto usabile da altri e uno che finisce nel dimenticatoio.

---

## APPENDICE — Tech in English

**Termini tecnici di questa MC in inglese**

| Italiano | English | Come si legge |
|----------|---------|---------------|
| diritto d'autore | copyright | /ˈkɒpɪraɪt/ |
| licenza | license | /ˈlaɪsəns/ |
| compressione | compression | /kəmˈpreʃən/ |
| podcast | podcast | /ˈpɒdkɑːst/ |
| deepfake | deepfake | /ˈdiːpfeɪk/ |
| montaggio | editing | /ˈɛdɪtɪŋ/ |

> *In English we say: "This audio is released under a Creative Commons Attribution licence — you can use it as long as you credit the author" — questa traccia audio è rilasciata con una licenza Creative Commons Attribution — puoi usarla purché tu citi l'autore.*
>
> *"Always check the licence before using any digital content you find online" — controlla sempre la licenza prima di usare qualsiasi contenuto digitale che trovi online.*

---

## NOTE DI EDITING

**Per l'impaginatore:**
- Zona 2: distribuire su 3 pagine. La tabella dei formati di compressione va in evidenza grafica. La tabella delle licenze CC va come infografica con icone CC ufficiali.
- Il box T8 (IA critica) va evidenziato con bordo colorato — è un elemento di progetto editoriale ricorrente.
- Le tabelle della Zona 4 (Base) vanno come scheda fotocopiabile.
- Il box "Errore comune" in Zona 3 va in evidenza grafica.

**Per l'agente generatore asset:**
- Visual richiesto: albero decisionale "Posso usare questo contenuto?" — diagramma a scelte per ogni tipo di licenza CC. Formato: PNG 1200×900 + SVG.
- Secondo visual: infografica comparativa formati (PNG vs JPEG, FLAC vs MP3) con esempi visivi di artefatti da compressione.
- Terzo visual: struttura di un episodio podcast (timeline grafica con le 5 sezioni).
- Hook audio: già disponibile in MC-COM-3-02_hook-script.md.

---

*MC versione 1.0 — Maggio 2026*
*Fonte: Hypertech 2020 · Allineata IN 2025 (D.M. n. 221/2025)*
*Contenuto espanso su indicazione editoriale — tutte e 5 le zone libro-ready*
