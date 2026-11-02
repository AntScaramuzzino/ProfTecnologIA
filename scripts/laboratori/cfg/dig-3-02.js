LABENGINE.run({
  id: "MC-DIG-3-02", area: "DIG", classe: 3, titolo: "IA: che cosa fa, chi decide", archetipo: "Smistatore",
  hook: "L'intelligenza artificiale è già nel tuo telefono: sceglie le canzoni, filtra lo spam, completa le parole. Impara da dati raccolti da persone, e porta con sé anche i loro errori. Per questo l'Europa ha scritto regole precise.",
  levels: [
    { brief: "Ogni app con IA svolge un compito. Abbina ogni applicazione al tipo di compito.",
      blocks: [
        { type: "sort", categories: [["rac", "Raccomandazione", "che cosa ti piacerà"], ["cla", "Classificazione", "a quale gruppo appartiene"], ["ric", "Riconoscimento", "immagini, voce"], ["gen", "Generazione o traduzione", "produce testo"], ["prev", "Previsione", "che cosa succederà"]],
          items: [["Spotify ti propone canzoni nuove", "rac", ""], ["Il filtro antispam della posta", "cla", "Divide i messaggi in due gruppi: spam o no."], ["Face ID sblocca il telefono", "ric", ""], ["Google Maps stima l'ora di arrivo", "prev", ""], ["Il traduttore automatico", "gen", ""], ["Netflix ordina i film in home", "rac", ""], ["L'assistente vocale capisce la tua domanda", "ric", "Prima riconosce la voce, poi interpreta la richiesta."], ["La tastiera suggerisce la parola successiva", "gen", "È una piccola generazione di testo: prevede la parola più probabile."]] } ],
      reflect: "Quale app con IA usi di più? Che cosa impara dai tuoi dati?" },
    { label: "Caso · COMPAS", brief: "COMPAS stimava il rischio che un imputato commettesse un nuovo reato, ed era usato in alcuni tribunali statunitensi. Nel 2016 ProPublica analizzò circa 7.000 casi in Florida. Leggi il dato sugli errori.",
      blocks: [
        { type: "chart", kind: "bar", toggles: false, d: 1, xlabel: "gruppo", ylabel: "% di falsi positivi", source: "Fonte: analisi ProPublica, «Machine Bias», 2016. Falso positivo: persona classificata ad alto rischio che poi non ha commesso nuovi reati nei due anni successivi.",
          series: [{ name: "Classificati «ad alto rischio» per errore", data: [["Imputati neri", 44.9], ["Imputati bianchi", 23.5]] }] },
        { type: "quiz", questions: [
          ["Che cosa mostra il grafico?", ["Il sistema sbaglia allo stesso modo con tutti", "Fra chi non ha commesso nuovi reati, gli imputati neri erano etichettati «ad alto rischio» per errore quasi il doppio delle volte", "Gli imputati neri commettono più reati"], 1, "È un errore che pesa su un gruppo più che su un altro: si chiama bias algoritmico."],
          ["Se il sistema non usa il colore della pelle fra i dati, come può essere distorto?", ["Non può esserlo", "Altri dati (quartiere, precedenti arresti) riflettono disuguaglianze passate e fanno da sostituto", "Per un guasto"], 1, "I dati di addestramento portano dentro la storia sociale da cui provengono."],
          ["Chi dovrebbe avere l'ultima parola in una decisione così?", ["L'algoritmo", "Un giudice umano, che conosce i limiti del punteggio", "L'imputato"], 1, "Il punteggio è un input, non una sentenza."]] } ],
      reflect: "Un sistema che è «giusto in media» può essere ingiusto per un gruppo? Come si controlla?" },
    { label: "Scenario · l'AI Act e la biblioteca", brief: "Il Regolamento europeo sull'intelligenza artificiale (AI Act, 2024) classifica i sistemi per livello di rischio. Classifica gli esempi, poi progetta il consigliere di libri della biblioteca con un'analisi etica.",
      blocks: [
        { type: "sort", categories: [["inacc", "Rischio inaccettabile", "vietato"], ["alto", "Alto rischio", "obblighi severi"], ["lim", "Rischio limitato", "obbligo di trasparenza"], ["min", "Rischio minimo", "nessun obbligo specifico"]],
          items: [["Punteggio sociale dei cittadini da parte di un'autorità pubblica", "inacc", "È fra le pratiche vietate."], ["Sistema che valuta gli studenti o decide l'ammissione a una scuola", "alto", "L'istruzione è un settore ad alto rischio."], ["IA che seleziona i curriculum per un'assunzione", "alto", ""], ["Chatbot del sito di un negozio", "lim", "Devi sapere che stai parlando con una macchina."], ["Filtro antispam", "min", ""], ["Avversario controllato dall'IA in un videogioco", "min", ""], ["Immagine generata dall'IA pubblicata online", "lim", "I contenuti generati vanno resi riconoscibili."]] },
        { type: "canvas", fields: [["pred", "Che cosa predice il sistema? Come misuri il successo?", "il libro che lo studente finirà? quello che gli piacerà?"], ["dati", "Quali dati usa, e quali escludi", ""], ["rischi", "Rischi: bolle, stereotipi, privacy", ""], ["contr", "Contromisure", "es. un suggerimento su tre fuori dai generi abituali"]],
          checks: [["Hai considerato il rischio di bolla", (v) => /bolla|sempre gli stessi|generi|divers/i.test(v.rischi)], ["Hai pensato alla privacy dello storico di lettura", (v) => /privacy|dati personal|storico|consenso/i.test(v.rischi + v.dati)]],
          out: (v) => `IL CONSIGLIERE DI LIBRI\n\nObiettivo: ${v.pred}\nDati: ${v.dati}\nRischi: ${v.rischi}\nContromisure: ${v.contr}` } ],
      reflect: "Un sistema che consiglia solo libri simili a quelli già letti aiuta davvero a diversificare le letture?" }],
  bridge: "Analizza 3 app con IA che usi ogni giorno: per ciascuna individua che cosa impara dai tuoi dati, quale decisione prende e quali rischi comporta.",
});
