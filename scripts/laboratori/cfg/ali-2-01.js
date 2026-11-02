LABENGINE.run({
  id: "MC-ALI-2-01", area: "ALI", classe: 2, titolo: "Dal seme alla mensa", archetipo: "Simulatore",
  hook: "Il cibo inizia dal suolo, e il suolo non è scontato. Prima di arrivare nel piatto, una pianta ha bisogno di acqua, luce, nutrienti e di tecniche agronomiche scelte bene. E l'acqua è la risorsa più contesa di tutte.",
  levels: [
    { brief: "Stai osservando un fagiolo che germina nel barattolo. Rimetti in ordine le fasi del ciclo della pianta, poi rispondi sulle condizioni che servono.",
      blocks: [
        { type: "order", items: [["Il seme assorbe acqua e si gonfia", "È l'imbibizione: senza acqua il seme resta inattivo."], ["Esce la radicola, la prima radice", "Cresce verso il basso, seguendo la gravità."], ["Spunta il fusticino con i cotiledoni", "I cotiledoni nutrono la piantina con le riserve del seme."], ["Si aprono le prime foglie vere e inizia la fotosintesi", "Da qui la pianta si nutre da sola, con la luce."], ["La pianta cresce e fiorisce", ""], ["Dai fiori impollinati nascono i frutti con i nuovi semi", "Il ciclo ricomincia."]] },
        { type: "quiz", questions: [
          ["Per germinare, il fagiolo ha bisogno soprattutto di…", ["luce forte", "acqua, aria e una temperatura adatta", "concime"], 1, "Il seme ha già le sue riserve. La luce serve dopo, quando le foglie iniziano la fotosintesi."],
          ["Perché il cotone deve essere umido ma non gocciolante?", ["Perché l'acqua in eccesso toglie aria al seme e può farlo marcire", "Perché il vetro si appanna", "Non ha importanza"], 0, "Anche il seme respira: ha bisogno di ossigeno."]] } ],
      reflect: "Nel tuo barattolo, quanti giorni sono serviti perché uscisse la radicola? Tutti i semi hanno germinato insieme?" },
    { brief: "L'agricoltura usa il 70% dell'acqua dolce prelevata nel mondo (dato del libro). Guarda quanta acqua serve per un kg di alimento, poi ordina i sistemi di irrigazione dal meno al più efficiente.",
      blocks: [
        { type: "chart", title: "Impronta idrica: litri d'acqua per 1 kg", kind: "bar", toggles: false, d: 0, xlabel: "alimento", ylabel: "litri per kg",
          series: [{ name: "Litri per kg", data: [["Manzo", 15000], ["Riso", 2500], ["Pomodori", 180], ["Insalata", 130]] }], source: "Fonte: valori riportati nel testo della MC (impronta idrica, tutte le fasi di produzione).",
          note: () => ["ok", "Un kg di manzo richiede circa 115 volte l'acqua di un kg di insalata. Conoscere questi numeri non vuol dire smettere di mangiare carne, ma capire le conseguenze delle scelte."] },
        { type: "order", title: "Sistemi di irrigazione: dal meno efficiente al più efficiente", items: [["Scorrimento o sommersione: l'acqua allaga il campo", "Molta acqua evapora o finisce in profondità senza essere usata."], ["A pioggia: ugelli che spruzzano dall'alto", "Meglio della sommersione, ma una parte evapora o cade fuori."], ["A goccia: l'acqua arriva direttamente alle radici", "Si spreca pochissimo: è il sistema più efficiente."]] } ],
      reflect: "Nel tuo mini-orto quale sistema di irrigazione useresti? Perché?" },
    { label: "Scenario · il basilico per la mensa", brief: "Il Comune ha 5.000 € per uno spazio di coltivazione a scuola, che fornisca basilico alla mensa. Orto in terra o idroponica al chiuso? Dati del libro: 5 g di basilico per pasto; ogni pianta dà circa 30 g di foglie a settimana; in terra 1 litro d'acqua per pianta a settimana, in idroponica 0,3 litri.",
      blocks: [
        { type: "sim", params: [{ id: "pasti", label: "Pasti a settimana", min: 50, max: 600, step: 10, value: 200 }, { id: "g", label: "Basilico per pasto", min: 2, max: 10, step: 1, value: 5, unit: "g" }, { id: "sett", label: "Settimane di attività all'anno", min: 20, max: 52, step: 1, value: 52 }],
          outputs: [{ key: "pi", label: "Piante necessarie", f: (p) => Math.ceil((p.pasti * p.g) / 30) }, { key: "t", label: "Acqua in terra (all'anno)", f: (p, o) => o.pi * 1 * p.sett, unit: "litri" }, { key: "h", label: "Acqua in idroponica (all'anno)", f: (p, o) => o.pi * 0.3 * p.sett, unit: "litri" }, { key: "r", label: "Risparmio con l'idroponica", f: (p, o) => o.t - o.h, unit: "litri" }],
          bars: (p, o) => [["In terra", o.t], ["Idroponica", o.h]], barsUnit: "litri", barsTitle: "Acqua all'anno" },
        { type: "compare", criteria: [["vel", "Velocità di crescita"], ["acq", "Risparmio d'acqua"], ["inst", "Costo di installazione basso"], ["gest", "Costo di gestione basso"], ["did", "Valore didattico all'aperto"]],
          alts: [{ name: "Orto in terra", v: { vel: 3, acq: 2, inst: 5, gest: 4, did: 5 }, note: "Economico, ma dipende dalle stagioni e consuma più acqua." }, { name: "Idroponica al chiuso", v: { vel: 5, acq: 5, inst: 2, gest: 2, did: 3 }, note: "Cresce tutto l'anno e risparmia acqua, ma richiede luci, pompe ed energia elettrica." }],
          scale: "Punteggi indicativi: il libro ti chiede di argomentare ognuno con un dato o un'osservazione dal tuo esperimento.",
          verdict: (sc) => ["ok", `Con i tuoi pesi conviene <strong>${sc[0][0]}</strong>. Nella relazione scrivi anche un limite che la scuola dovrà gestire.`] } ],
      reflect: "Il compagno che preferisce l'altro sistema che argomento userebbe? Sapresti rispondergli?" }],
  bridge: "Coltiva una piantina in classe: documenta con foto e misurazioni settimanali per 3 settimane, registra i dati in una tabella e costruisci il grafico della crescita.",
});
