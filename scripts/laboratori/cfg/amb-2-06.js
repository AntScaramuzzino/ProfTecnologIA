LABENGINE.run({
  id: "MC-AMB-2-06", area: "AMB", classe: 2, titolo: "Cruscotto della città", archetipo: "Laboratorio dati",
  hook: "Una smart city non è un videogioco: è una città che misura e decide con i dati. Sensori nell'asfalto, nei lampioni e nei cassonetti, e dati aperti che chiunque può leggere. Ma la tecnologia da sola non basta.",
  footer: "I dati dei grafici sono simulati a scopo didattico. Per i dati reali del tuo Comune cerca su dati.gov.it.",
  levels: [
    { brief: "Ogni sensore urbano misura qualcosa e ha un limite. Abbina il sensore a ciò che misura.",
      blocks: [
        { type: "sort", categories: [["traf", "Traffico"], ["aria", "Qualità dell'aria"], ["luce", "Illuminazione"], ["rif", "Rifiuti"]],
          items: [["Spira induttiva nell'asfalto", "traf", "Conta i veicoli e la velocità media, ma non distingue un'auto da un camion."], ["Centralina per PM10, PM2.5 e NO₂", "aria", "Il biossido di azoto viene soprattutto dai motori diesel."], ["Lampione con sensore di presenza", "luce", "Di notte si abbassa se non passa nessuno: risparmio medio 30-50% secondo il libro."], ["Sensore a ultrasuoni nel cassonetto", "rif", "Comunica quanto è pieno: i camion seguono una mappa di priorità."], ["Telecamera con riconoscimento dei veicoli", "traf", "Più informativa delle spire, ma solleva questioni di privacy."], ["Sensore di luminosità", "luce", ""]] },
        { type: "quiz", questions: [["Che cosa sono gli open data?", ["Dati personali venduti alle aziende", "Dati pubblici che chiunque può scaricare e riusare liberamente", "Dati segreti del Comune"], 1, "Su dati.gov.it trovi quelli di Comuni e Regioni, spesso in formato CSV."]] } ],
      reflect: "Quale sensore ti sembra più utile per il quartiere della tua scuola? E quale potrebbe essere invadente?" },
    { brief: "Un sensore conta i veicoli davanti a una scuola, ora per ora, in un giorno feriale (dati simulati). Leggi il grafico per trovare quando il problema è più grave.",
      blocks: [
        { type: "chart", kind: "bar", d: 0, xlabel: "ora", ylabel: "veicoli all'ora",
          series: [{ name: "Veicoli", data: [["7", 180], ["8", 420], ["9", 260], ["10", 150], ["11", 140], ["12", 190], ["13", 380], ["14", 300], ["15", 170], ["16", 160], ["17", 240], ["18", 270]] }],
          note: (zero) => zero ? null : ["warn", "Hai tolto lo zero dall'asse verticale: le differenze sembrano più grandi di quanto sono. Rimettilo prima di trarre conclusioni."] },
        { type: "quiz", questions: [
          ["In quale ora il traffico è massimo?", ["7", "8", "13"], 1, "Alle 8, con l'ingresso a scuola: 420 veicoli."],
          ["Che cosa suggeriscono i picchi delle 8 e delle 13?", ["Che il traffico dipende dagli orari di scuola", "Che il sensore è guasto", "Niente di utile"], 0, "Ingresso e uscita: un dato che può giustificare una «strada scolastica» chiusa alle auto in quegli orari."],
          ["Il dato dice quante auto passano. Che cosa NON dice?", ["Quante persone vanno a scuola a piedi", "A che ora c'è più traffico", "Quanti veicoli passano alle 10"], 0, "Ogni sensore vede solo una parte del problema: servono altri dati, per esempio un sondaggio."]] } ],
      reflect: "Quali foto o osservazioni raccoglieresti tu, per completare quello che il sensore non vede?" },
    { label: "Scenario · civic tech nel quartiere", brief: "Il Comune ha 50.000 € per un sistema che raccolga e usi i dati del quartiere, coinvolgendo gli studenti. Vincoli: dati aperti, niente dati personali né riconoscimento facciale, gestione sotto i 5.000 € all'anno.",
      blocks: [
        { type: "canvas", fields: [["dati", "1 · Quali dati raccogliere", "es. rumore, PM10, traffico, segnalazioni"], ["come", "2 · Come raccoglierli", "sensori, app di segnalazione, rilevazioni degli studenti"], ["uso", "3 · Come usarli per cambiare qualcosa di concreto", ""], ["priv", "Come rispetti la privacy", ""], ["cost", "Costi: impianto e gestione annua", ""], ["stud", "Che ruolo hanno gli studenti", ""]],
          checks: [["Dichiari che i dati saranno pubblicati come open data", (v) => /open data|aperti|pubblic/i.test(v.dati + v.uso)], ["Spieghi come eviti i dati personali (anonimi, aggregati…)", (v) => /anonim|aggregat|nessun dato personale|senza dati personali/i.test(v.priv)], ["Costo di gestione indicato sotto 5.000 €", (v) => { const n = (v.cost.match(/\d[\d.]*/g) || []).map((x) => +x.replace(/\./g, "")); return n.some((x) => x > 0 && x < 5000); }], ["Gli studenti hanno un ruolo attivo", (v) => v.stud.length > 15]],
          out: (v) => `PROGETTO CIVIC TECH\n\nDati: ${v.dati}\nRaccolta: ${v.come}\nUso: ${v.uso}\nPrivacy: ${v.priv}\nCosti: ${v.cost}\nStudenti: ${v.stud}` },
        { type: "quiz", questions: [["Songdo, in Corea del Sud, è una smart city costruita da zero. Perché il libro la cita come insuccesso?", ["Perché la tecnologia non funzionava", "Perché è stata progettata senza le persone che dovevano viverci", "Perché costava poco"], 1, "Una città «intelligente» senza partecipazione resta vuota: la lezione di Copenaghen e Amsterdam è mettere al centro i cittadini."]] } ],
      reflect: "Il tuo sistema funzionerebbe anche per chi non ha uno smartphone? Come includeresti tutti?" }],
  bridge: "Verifica sul Geoportale ISPRA se il territorio del tuo Comune è a rischio idrogeologico: individua il livello di rischio, l'ultimo evento e le misure di prevenzione previste.",
});
