LABENGINE.run({
  id: "MC-AMB-2-05", area: "AMB", classe: 2, titolo: "Il viaggio dell'acqua", archetipo: "Flussi",
  hook: "L'acqua ha due cicli: uno naturale e uno costruito da noi. Dal fiume al rubinetto, e dal WC al depuratore, passa per tubi, pompe e impianti. Lungo la strada una parte si perde.",
  levels: [
    { brief: "Rimetti in ordine le sei fasi del ciclo artificiale dell'acqua.",
      blocks: [
        { type: "order", items: [["Captazione: si preleva l'acqua da fiume, lago, falda o sorgente", ""], ["Potabilizzazione: sedimentazione, filtrazione e disinfezione", "L'acqua grezza non è bevibile."], ["Distribuzione: la rete di tubi porta l'acqua fino ai contatori", "È qui che avvengono le perdite."], ["Uso: bere, cucinare, lavarsi, scaricare il WC", ""], ["Fognatura: l'acqua usata scorre in una rete separata", ""], ["Depurazione e restituzione: l'acqua pulita torna nell'ambiente", "Il ciclo si chiude."]] },
        { type: "canvas", title: "L'acqua della tua città", text: "Cerca sul sito del gestore idrico del tuo Comune.", fields: [["gest", "Gestore idrico", ""], ["fonte", "Da dove viene l'acqua", "sorgenti, pozzi, lago, fiume"], ["perd", "Percentuale di perdite dichiarata", ""], ["url", "Fonte (indirizzo del documento)", ""]],
          checks: [["Hai indicato la fonte del dato", (v) => /http|www|\.it/i.test(v.url)]], out: (v) => `Gestore: ${v.gest}\nFonte dell'acqua: ${v.fonte}\nPerdite: ${v.perd}\nFonte: ${v.url}` } ],
      reflect: "Sapevi da dove arriva l'acqua del tuo rubinetto? Che cosa ti ha sorpreso?" },
    { brief: "Calcola la tua impronta idrica di un giorno: l'acqua diretta (quella che vedi) e l'acqua virtuale (quella nascosta nel cibo). Valori medi dal libro.",
      blocks: [
        { type: "sim", params: [{ id: "doc", label: "Docce da 5 minuti (50 L)", min: 0, max: 3, step: 1, value: 1 }, { id: "wc", label: "Scarichi del WC (circa 7,5 L)", min: 0, max: 10, step: 1, value: 5 }, { id: "den", label: "Denti con il rubinetto aperto (12 L)", min: 0, max: 3, step: 1, value: 2 }, { id: "mani", label: "Lavaggi delle mani (1 L)", min: 0, max: 15, step: 1, value: 6 },
          { id: "pasta", label: "Porzioni di pasta (170 L)", min: 0, max: 3, step: 1, value: 1 }, { id: "uova", label: "Uova (200 L)", min: 0, max: 4, step: 1, value: 1 }, { id: "pizza", label: "Pizze (1.260 L)", min: 0, max: 2, step: 1, value: 0 }, { id: "mela", label: "Mele (125 L)", min: 0, max: 4, step: 1, value: 1 }, { id: "lat", label: "Lattine di bibita (200 L)", min: 0, max: 3, step: 1, value: 1 }],
          outputs: [{ key: "dir", label: "Acqua diretta", f: (p) => p.doc * 50 + p.wc * 7.5 + p.den * 12 + p.mani * 1, unit: "L" }, { key: "vir", label: "Acqua virtuale", f: (p) => p.pasta * 170 + p.uova * 200 + p.pizza * 1260 + p.mela * 125 + p.lat * 200, unit: "L" }, { key: "rap", label: "Virtuale ÷ diretta", f: (p, o) => o.dir ? o.vir / o.dir : 0, d: 1 }],
          bars: (p, o) => [["Diretta", o.dir], ["Virtuale", o.vir]], barsUnit: "L",
          note: (p) => p.den > 0 ? ["warn", `Chiudendo il rubinetto mentre ti lavi i denti risparmi circa ${LABENGINE.fmt(p.den * 11.9, 0)} litri al giorno: ${LABENGINE.fmt(p.den * 11.9 * 365, 0)} in un anno.`] : ["ok", "Rubinetto chiuso mentre ti lavi i denti: ottimo."] } ],
      reflect: "Qual è il rapporto fra acqua virtuale e diretta? Quale scelta conta di più: la doccia più corta o cosa metti nel piatto?" },
    { label: "Scenario · la città costiera e la siccità", brief: "200.000 abitanti, 40.000 m³ d'acqua al giorno, il 90% da un solo bacino di montagna. Perdite di rete al 45%. Nel 2050 serviranno circa 47.000 m³ al giorno, con meno pioggia. Hai 50 milioni di euro: componi il pacchetto (costi medi dal libro).",
      blocks: [
        { type: "sim", params: [{ id: "ret", label: "Ristrutturazione rete: perdite dal 45% al 20% (20 M€, +10.000 m³/g)", options: [[0, "No"], [1, "Sì"]], value: 0 }, { id: "dis", label: "Dissalatori da 20.000 m³/g (circa 17,5 M€ l'uno)", options: [[0, "Nessuno"], [1, "Uno"], [2, "Due"]], value: 0 }, { id: "riu", label: "Riuso acque reflue per irrigazione (6,5 M€, 8.000 m³/g non potabili)", options: [[0, "No"], [1, "Sì"]], value: 0 }, { id: "fal", label: "Pozzi in falda (4 M€, 5.000 m³/g)", options: [[0, "No"], [1, "Sì"]], value: 0 }, { id: "pio", label: "Bacini per l'acqua piovana (4 M€, 2.000 m³/g di media)", options: [[0, "No"], [1, "Sì"]], value: 0 }],
          outputs: [{ key: "cost", label: "Spesa", f: (p) => p.ret * 20 + p.dis * 17.5 + p.riu * 6.5 + p.fal * 4 + p.pio * 4, unit: "M€", d: 1 },
            { key: "disp", label: "Acqua disponibile in siccità (bacino al 50%)", f: (p) => 40000 * 0.9 * 0.5 + 40000 * 0.1 + p.ret * 10000 + p.dis * 20000 + p.riu * 8000 + p.fal * 5000 + p.pio * 2000, unit: "m³/g" },
            { key: "cop", label: "Copertura del fabbisogno 2050", f: (p, o) => (o.disp / 47000) * 100, unit: "%" }],
          bars: (p, o) => [["Disponibile in siccità", o.disp], ["Fabbisogno 2050", 47000]], barsUnit: "m³/g",
          note: (p, o) => o.cost > 50 ? ["ko", `Fuori budget: ${LABENGINE.fmt(o.cost, 1)} M€ su 50.`] : o.cop >= 100 ? ["ok", `Fabbisogno coperto anche in siccità, con ${LABENGINE.fmt(o.cost, 1)} M€.${p.dis ? " Ricorda: un dissalatore consuma 3-4 kWh per m³: da dove viene quell'energia?" : ""}`] : ["warn", `Copri il ${LABENGINE.fmt(o.cop)}% del fabbisogno: non basta in caso di siccità.`] },
        { type: "quiz", questions: [["Oggi, con perdite del 45%, quanta acqua si perde ogni giorno nella rete?", ["18.000 m³", "4.500 m³", "45.000 m³"], 0, "45% di 40.000 = 18.000 m³ al giorno: quasi la metà di quella prelevata."]] } ],
      reflect: "Perché ridurre le perdite è spesso la prima mossa, prima di cercare nuove fonti?" }],
  bridge: "Progetta una soluzione smart per un problema reale del quartiere della scuola (traffico, rifiuti, illuminazione): descrivi i sensori, i dati raccolti e come verrebbero usati.",
});
