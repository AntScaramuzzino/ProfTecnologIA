const filiera = { benz: [["Estrazione e raffinazione", 0.96], ["Trasporto al distributore", 0.98], ["Motore a benzina", 0.30]], gas: [["Estrazione e trasporto del gas", 0.95], ["Centrale termoelettrica a gas", 0.55], ["Rete di trasmissione", 0.94], ["Carica e scarica della batteria", 0.90], ["Motore elettrico e inverter", 0.92]], sole: [["Pannello fotovoltaico", 0.20], ["Inverter solare", 0.97], ["Rete di trasmissione", 0.94], ["Carica e scarica della batteria", 0.90], ["Motore elettrico", 0.92]] };
LABENGINE.run({
  id: "MC-ENE-3-05", area: "ENE", classe: 3, titolo: "Dove va l'energia", archetipo: "Flussi",
  hook: "Il calore è energia, ma trasformarlo in movimento costa caro: un motore a benzina scalda molto più di quanto spinge. Un diagramma di Sankey lo fa vedere a colpo d'occhio.",
  footer: "Valori di rendimento ipotetici forniti dal testo della MC.",
  levels: [
    { brief: "Parti da 100 unità di energia e segui dove finiscono, con i numeri del libro. Le barre sono come le frecce di un diagramma di Sankey: più sono lunghe, più energia trasportano.",
      blocks: [
        { type: "sim", params: [{ id: "m", label: "Motore", options: [["b", "A benzina"], ["e", "Elettrico"]], value: "b" }],
          outputs: [{ key: "u", label: "Energia utile alle ruote", f: (p) => p.m === "b" ? 100 - 35 - 30 - 5 - 5 : 100 - 5 - 3 - 2, unit: "unità" }, { key: "r", label: "Rendimento", f: (p, o) => o.u, unit: "%" }],
          bars: (p) => p.m === "b" ? [["Calore dal motore", 35, "var(--energy)"], ["Raffreddamento", 30, "var(--energy)"], ["Scarico", 5, "var(--energy)"], ["Attriti", 5, "var(--energy)"], ["Utile alle ruote", 25, "var(--lab)"]] : [["Perdite nel motore", 5, "var(--energy)"], ["Perdite nell'inverter", 3, "var(--energy)"], ["Attriti", 2, "var(--energy)"], ["Utile alle ruote", 90, "var(--lab)"]], barsMax: 100, barsUnit: "unità", barsTitle: "Dove vanno 100 unità di energia",
          note: (p) => p.m === "b" ? ["warn", "Tre quarti dell'energia della benzina diventano calore. Per lo stesso lavoro ti servono 90 ÷ 25 = 3,6 volte l'energia che userebbe il motore elettrico."] : ["ok", "Il motore elettrico converte in movimento circa il 90% dell'energia che riceve."] },
        { type: "order", title: "Il motore a 4 tempi", items: [["Aspirazione: il pistone scende ed entra la miscela aria-benzina", ""], ["Compressione: il pistone sale e comprime la miscela", ""], ["Scoppio ed espansione: la candela accende la miscela, i gas spingono giù il pistone", "È l'unico tempo che produce lavoro."], ["Scarico: il pistone risale e spinge fuori i gas combusti", ""]] } ],
      reflect: "Dove finisce, in un'auto a benzina, il calore che non diventa movimento? Lo si potrebbe usare?" },
    { brief: "Il rendimento di una filiera è il prodotto dei rendimenti di ogni passaggio. Confronta le tre filiere del libro.",
      blocks: [
        { type: "sim", params: [{ id: "f", label: "Filiera", options: [["benz", "Auto a benzina (dal pozzo alla ruota)"], ["gas", "Auto elettrica con elettricità da gas"], ["sole", "Auto elettrica con elettricità dal sole"]], value: "benz" }],
          outputs: [{ key: "tot", label: "Rendimento totale", f: (p) => filiera[p.f].reduce((s, x) => s * x[1], 1) * 100, unit: "%", d: 1 }],
          bars: (p) => { let e = 100; return [["Energia iniziale", 100], ...filiera[p.f].map(([n, r]) => { e *= r; return ["dopo: " + n, e]; })]; }, barsMax: 100, barsD: 1, barsUnit: "unità",
          note: (p) => p.f === "sole" ? ["warn", "Rendimento basso perché il pannello converte solo il 20% della luce. Ma la luce del sole è gratuita e non emette CO₂: il rendimento da solo non dice quale filiera inquina meno."] : null },
        { type: "quiz", questions: [["Puoi dire quale filiera emette meno gas serra guardando solo i rendimenti?", ["Sì, quella con il rendimento più alto", "No: servono anche i consumi per chilometro e i fattori di emissione delle fonti"], 1, "Un rendimento alto con una fonte fossile può emettere più di un rendimento basso con una fonte rinnovabile."]] } ],
      reflect: "Perché considerare l'intera filiera descrive meglio la realtà del solo motore?" },
    { label: "Scenario · lo scooter della posta interna", brief: "Il Comune vuole uno scooter elettrico per la posta fra gli uffici: 40 km al giorno, 15 fermate, da −5 °C in inverno a +35 °C in estate. Dimensiona la batteria con le ipotesi del libro.",
      blocks: [
        { type: "sim", params: [{ id: "km", label: "Chilometri al giorno", min: 10, max: 80, step: 1, value: 40, unit: "km" }, { id: "wh", label: "Consumo", min: 10, max: 30, step: 1, value: 15, unit: "Wh/km" }, { id: "fer", label: "Perdite per fermate e ripartenze", min: 0, max: 15, step: 1, value: 5, unit: "%" }, { id: "fr", label: "Perdita di capacità al freddo (−5 °C)", min: 0, max: 30, step: 1, value: 25, unit: "%" }, { id: "v", label: "Tensione nominale", options: [[48, "48 V"], [60, "60 V"], [72, "72 V"]], value: 72 }],
          outputs: [{ key: "e", label: "Energia necessaria al giorno", f: (p) => p.km * p.wh * (1 + p.fer / 100), unit: "Wh" }, { key: "cap", label: "Capacità minima (uso fra 20% e 80%)", f: (p, o) => o.e / 0.6, unit: "Wh" }, { key: "inv", label: "Capacità per l'inverno", f: (p, o) => o.cap / (1 - p.fr / 100), unit: "Wh" }, { key: "ah", label: "In amperora", f: (p, o) => o.inv / p.v, unit: "Ah", d: 1 }],
          note: (p, o) => ["ok", `Lavorando solo fra il 20% e l'80% si usa il 60% della batteria: la vita della batteria si allunga, ma serve una capacità di ${LABENGINE.fmt(o.cap)} Wh, e di ${LABENGINE.fmt(o.inv)} Wh per non restare a piedi d'inverno.`] } ],
      reflect: "Lo scooter a benzina equivalente consuma 2 litri ogni 100 km. Che dati ti servono per confrontare davvero i due mezzi?" }],
  bridge: "Confronta il motore a scoppio di un'auto con un motore elettrico: cerca i rendimenti tipici, costruisci il diagramma di Sankey di entrambi e trai le conclusioni.",
});
