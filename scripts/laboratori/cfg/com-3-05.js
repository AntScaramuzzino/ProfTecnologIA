LABENGINE.run({
  id: "MC-COM-3-05", area: "COM", classe: 3, titolo: "Internet non è una nuvola", archetipo: "Flussi",
  hook: "La chiamiamo «cloud», ma internet è fatta di antenne, centrali, data center e cavi posati sul fondo degli oceani. Ogni messaggio fa un viaggio fisico, e nessuno da solo decide le regole del viaggio.",
  levels: [
    { brief: "Il viaggio di un messaggio dal tuo telefono a un server in un altro continente. Rimetti in ordine le tappe fisiche.",
      blocks: [
        { type: "order", items: [["Il telefono invia il messaggio via radio all'antenna o al Wi-Fi", ""], ["La centrale dell'operatore lo instrada sulla sua rete in fibra", ""], ["Un punto di interscambio collega le reti di operatori diversi", "Gli operatori si scambiano il traffico."], ["Un cavo sottomarino lo porta oltre il mare", "La spina dorsale fisica dei collegamenti intercontinentali."], ["Arriva al data center dove si trova il server", ""]] },
        { type: "sort", title: "Chi fa che cosa?", categories: [["icann", "ICANN", "nomi a dominio"], ["ietf", "IETF", "standard tecnici"], ["op", "Operatori", "reti e cavi"], ["leg", "Legislatori", "leggi UE e nazionali"]],
          items: [["Coordina il sistema dei nomi a dominio, come .it e .com", "icann", ""], ["Scrive gli standard aperti dei protocolli, come TCP/IP", "ietf", ""], ["Posa e gestisce i cavi in fibra", "op", ""], ["Approva il regolamento sulla neutralità della rete", "leg", ""]] } ],
      reflect: "Nel raggio di 5 km dalla scuola quante antenne, centrali o data center hai trovato sulla mappa?" },
    { label: "Scenario · la legge sui video stranieri", brief: "Un paese dell'Unione Europea vuole obbligare gli operatori a rallentare i video delle piattaforme straniere che non pagano una tariffa nazionale. Valuta la proposta.",
      blocks: [
        { type: "quiz", questions: [
          ["Questa misura sarebbe legale nell'Unione Europea?", ["Sì, ogni Stato decide", "No: il Regolamento (UE) 2015/2120 sulla neutralità della rete vieta di rallentare o discriminare il traffico in base al contenuto o al fornitore", "Sì, se la tariffa è bassa"], 1, "Gli operatori devono trattare il traffico allo stesso modo; sono ammesse solo misure ragionevoli di gestione tecnica della rete."],
          ["Chi ci guadagnerebbe con il rallentamento?", ["Le piattaforme nazionali concorrenti e lo Stato, con la tariffa", "Gli utenti", "Nessuno"], 0, "Per questo la neutralità protegge anche la concorrenza: senza, chi paga di più arriva prima."],
          ["Chi ci perderebbe?", ["Gli utenti e le piccole piattaforme che non possono pagare", "Gli operatori", "Nessuno"], 0, "Una nuova piattaforma senza soldi per la tariffa partirebbe svantaggiata."]] },
        { type: "canvas", fields: [["pro", "L'argomento migliore di chi sostiene la legge", ""], ["contro", "L'argomento migliore di chi si oppone", ""], ["tu", "La tua posizione, con il riferimento alla norma", ""]],
          checks: [["Hai considerato entrambe le parti", (v) => v.pro.length > 20 && v.contro.length > 20], ["Citi il regolamento", (v) => /2015\/2120|neutralit/i.test(v.tu)]],
          out: (v) => `Pro: ${v.pro}\n\nContro: ${v.contro}\n\nLa mia posizione: ${v.tu}` } ],
      reflect: "La neutralità della rete conviene sempre agli utenti? Prova a trovare un caso in cui dare priorità a un traffico ha senso (per esempio le chiamate d'emergenza)." },
    { brief: "Prima di lanciare traceroute, prevedi il ritardo minimo. Nella fibra la luce viaggia a circa 200.000 km/s, e i cavi non seguono la linea più breve. Confronta la previsione con le tue misure.",
      blocks: [
        { type: "sim", params: [{ id: "d", label: "Distanza in linea d'aria", min: 100, max: 20000, step: 100, value: 9900, unit: "km" }, { id: "f", label: "Allungamento del percorso dei cavi", min: 1, max: 2, step: 0.1, value: 1.4, unit: "×" }, { id: "h", label: "Router attraversati (hop)", min: 3, max: 30, step: 1, value: 15 }, { id: "ms", label: "Ritardo per ogni router", min: 0, max: 2, step: 0.1, value: 0.5, unit: "ms" }],
          presets: [["Roma → Tokyo (circa 9.900 km)", { d: 9900 }], ["Roma → Londra (circa 1.400 km)", { d: 1400 }], ["Roma → New York (circa 6.900 km)", { d: 6900 }]],
          outputs: [{ key: "km", label: "Percorso stimato del cavo", f: (p) => p.d * p.f, unit: "km" }, { key: "prop", label: "Tempo di propagazione andata e ritorno", f: (p, o) => (2 * o.km / 200000) * 1000, unit: "ms" }, { key: "rtt", label: "Ritardo totale stimato", f: (p, o) => o.prop + p.h * p.ms * 2, unit: "ms" }],
          note: (p, o) => ["ok", `Anche con una rete perfetta, ${LABENGINE.fmt(p.d)} km non si possono percorrere andata e ritorno in meno di ${LABENGINE.fmt((2 * p.d / 200000) * 1000)} ms: è il limite fisico della velocità della luce nella fibra.`] },
        { type: "canvas", fields: [["out", "Incolla qui il risultato di traceroute (o tracert)", ""], ["paesi", "In quali paesi passano gli hop? Dove c'è il salto di ritardo più grande?", "usa un servizio di geolocalizzazione degli IP"]],
          checks: [["Hai individuato il salto maggiore", (v) => /ms/.test(v.paesi) || /\d/.test(v.paesi)]], out: (v) => `Traceroute\n${v.out}\n\nAnalisi: ${v.paesi}` } ],
      reflect: "Il salto più grande nel tuo traceroute corrisponde all'attraversamento di un mare o di un oceano?" }],
  bridge: "Con uno strumento di traceroute, traccia il percorso di un pacchetto verso tre destinazioni lontane: conta i salti, misura i tempi e individua dove passa un cavo sottomarino.",
});
