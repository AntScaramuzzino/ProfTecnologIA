LABENGINE.run({
  id: "MC-DIG-1-01", area: "DIG", classe: 1, titolo: "Dentro il dispositivo", archetipo: "Costruttore",
  hook: "Un ambiente che non si vede, ma che usi ogni giorno. Dentro il telefono e il computer lavorano processore, memoria e archivio, ognuno con un compito preciso. Impara a riconoscerli e a leggere le specifiche come un tecnico.",
  levels: [
    { brief: "Abbina ogni componente alla sua funzione. Poi classifica le periferiche: portano informazioni dentro il computer, fuori, o tutte e due le cose?",
      blocks: [
        { type: "sort", title: "Componente → funzione", categories: [["cpu", "Esegue i calcoli e le istruzioni"], ["ram", "Tiene i dati usati in questo momento"], ["ssd", "Salva i dati in modo permanente"], ["mb", "Collega tutti i componenti"], ["gpu", "Prepara le immagini per lo schermo"]], shuffle: true,
          items: [["CPU (processore)", "cpu", "È il «cervello»: esegue le istruzioni dei programmi."], ["RAM", "ram", "È veloce ma si svuota quando spegni."], ["SSD o disco rigido", "ssd", "Conserva file e programmi anche a dispositivo spento."], ["Scheda madre", "mb", "È la piastra su cui sono montati e collegati tutti i componenti."], ["GPU (scheda grafica)", "gpu", "Calcola le immagini; il monitor poi le mostra."]] },
        { type: "sort", title: "Input, output o entrambi?", categories: [["in", "Input", "dati verso il computer"], ["out", "Output", "dati verso di te"], ["io", "Input e output"]],
          items: [["Tastiera", "in", "Trasforma i tasti premuti in dati."], ["Monitor", "out", "Riceve le immagini dalla GPU e le mostra."], ["Microfono", "in", "Trasforma la voce in dati."], ["Stampante", "out", "Porta i dati su carta."], ["Touchscreen", "io", "Mostra le immagini e riceve il tocco."], ["Cuffie con microfono", "io", "Ascolti e parli con lo stesso oggetto."], ["Mouse", "in", "Invia movimenti e clic."], ["Casse", "out", "Trasformano i dati in suoni."]] } ],
      reflect: "Il monitor è una periferica di input, di output o entrambe? E lo schermo del tuo telefono?" },
    { brief: "Ecco la scheda tecnica di uno smartphone d'esempio. Leggila come faresti con quella del tuo dispositivo (Impostazioni → Informazioni) e rispondi.",
      blocks: [
        { type: "info", title: "Scheda tecnica d'esempio", html: "<div class=\"scroll-x\"><table><tbody><tr><td>Processore</td><td>8 core, fino a 2,4 GHz</td></tr><tr><td>RAM</td><td class=\"mono\">6 GB</td></tr><tr><td>Archivio totale</td><td class=\"mono\">128 GB</td></tr><tr><td>Archivio disponibile</td><td class=\"mono\">23 GB</td></tr><tr><td>Sistema operativo</td><td>Android 14</td></tr></tbody></table></div>" },
        { type: "quiz", questions: [
          ["Quanta memoria di archivio stai già usando?", ["23 GB", "105 GB", "128 GB"], 1, "Totale meno disponibile: 128 − 23 = 105 GB."],
          ["Hai 20 app aperte e il telefono rallenta. Quale componente è probabilmente pieno?", ["La RAM", "L'archivio", "Lo schermo"], 0, "Le app aperte stanno nella RAM. Quando è piena, il sistema deve chiudere o spostare dati, e tutto rallenta."],
          ["Cancelli 10 GB di video. Che cosa cambia?", ["Aumenta la RAM", "Aumenta l'archivio disponibile", "Il processore diventa più veloce"], 1, "I video sono file salvati nell'archivio permanente."],
          ["«Android 14» è…", ["un componente hardware", "il sistema operativo", "un'app"], 1, "È il software che gestisce l'hardware e fa funzionare le app."]] },
        { type: "canvas", title: "La scheda del tuo dispositivo", fields: [["cpu", "Processore (nome o modello)", ""], ["ram", "RAM (GB)", ""], ["tot", "Archivio totale e disponibile (GB)", ""], ["os", "Sistema operativo e versione", ""], ["cosa", "Che cosa occupa più spazio?", "foto, video, app…"]],
          checks: [["Hai indicato la RAM con un numero", (v) => /\d/.test(v.ram)], ["Hai indicato totale e disponibile", (v) => (v.tot.match(/\d+/g) || []).length >= 2]],
          out: (v) => `Il mio dispositivo\nProcessore: ${v.cpu}\nRAM: ${v.ram}\nArchivio: ${v.tot}\nSistema operativo: ${v.os}\nOccupa più spazio: ${v.cosa}` } ],
      reflect: "Dopo aver letto le specifiche, ti spieghi meglio quando e perché il tuo dispositivo rallenta?" },
    { label: "Scenario · il laboratorio di informatica", brief: "La scuola compra 25 dispositivi per un nuovo laboratorio. Ci sono tre opzioni. Calcola quanto costano davvero all'anno, poi pesa i criteri.",
      blocks: [
        { type: "sim", title: "Il costo vero: quanto spendi per ogni anno di vita", params: [{ id: "n", label: "Numero di dispositivi", min: 10, max: 30, step: 1, value: 25 }],
          outputs: [{ key: "a", label: "A · desktop: spesa iniziale", f: (p) => p.n * 480, unit: "€" }, { key: "b", label: "B · laptop: spesa iniziale", f: (p) => p.n * 350, unit: "€" }, { key: "c", label: "C · tablet: spesa iniziale", f: (p) => p.n * 280, unit: "€" }],
          bars: (p) => [["A · desktop (9 anni)", p.n * 480 / 9], ["B · laptop (6 anni)", p.n * 350 / 6], ["C · tablet (4 anni)", p.n * 280 / 4]], barsUnit: "€/anno", barsTitle: "Spesa per anno di vita (durata media dal libro)",
          note: () => ["ok", "L'opzione che costa meno alla cassa non è quella che costa meno all'anno: il desktop dura il doppio del tablet. Questo si chiama costo totale di possesso."] },
        { type: "compare", criteria: [["prest", "Prestazioni (CPU, RAM)"], ["dur", "Durata"], ["port", "Portabilità"], ["costo", "Costo all'anno"], ["arch", "Archivio"]],
          alts: [
            { name: "A · Desktop", v: { prest: 5, dur: 5, port: 1, costo: 4, arch: 5 }, note: "Core i5 a 4 core, 8 GB RAM, 256 GB SSD, 480 €, 8-10 anni, fisso." },
            { name: "B · Laptop", v: { prest: 3, dur: 3, port: 5, costo: 3, arch: 3 }, note: "Core i3 a 2 core, 4 GB RAM, 128 GB SSD, 350 €, 5-7 anni." },
            { name: "C · Tablet", v: { prest: 2, dur: 1, port: 5, costo: 2, arch: 1 }, note: "Processore ARM, 4 GB RAM, 64 GB, 280 €, 3-5 anni." }],
          scale: "Punteggi ricavati dalla tabella del libro.",
          verdict: (sc) => ["ok", `Con i tuoi criteri vince <strong>${sc[0][0]}</strong>. Nella proposta usa il linguaggio dei componenti: «8 GB di RAM permettono di…».`] } ],
      reflect: "Quale criterio hai messo al primo posto per un laboratorio scolastico, e perché?" }],
  bridge: "Smonta virtualmente un vecchio dispositivo: cerca le foto di disassemblaggio del tuo modello, identifica 5 componenti interni e spiega che cosa fa ciascuno.",
});
