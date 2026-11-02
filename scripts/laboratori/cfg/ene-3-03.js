LABENGINE.run({
  id: "MC-ENE-3-03", area: "ENE", classe: 3, titolo: "Fotovoltaico per la scuola", archetipo: "Simulatore",
  hook: "Una fonte è rinnovabile quando si ricarica alla stessa velocità con cui la usiamo. Sole, vento, acqua, calore della Terra: ognuna ha un carattere diverso. Il sole è gratuito, ma non c'è di notte.",
  footer: "Dati tecnici ed economici dal testo della MC (Italia centrale, tetto a sud inclinato di 25°).",
  levels: [
    { brief: "Alcune rinnovabili sono intermittenti (dipendono dal meteo), altre dispacciabili o programmabili (si possono accendere quando serve). Classifica con la tabella del libro.",
      blocks: [
        { type: "sort", categories: [["int", "Intermittente"], ["disp", "Dispacciabile o programmabile"]],
          items: [["Solare fotovoltaico · fattore di carico 13-15%", "int", "Niente di notte, poco con le nuvole."], ["Eolico a terra · 20-25%", "int", ""], ["Eolico in mare · 35-45%", "int", "Più vento e più costante, ma sempre variabile."], ["Idroelettrico · 40-50%", "disp", "L'acqua nel bacino si fa scendere quando serve."], ["Geotermico · 80-90%", "disp", "Il calore della Terra è continuo."], ["Biogas · 60-70%", "disp", "Si accumula e si brucia quando serve."]] },
        { type: "quiz", questions: [["Che cos'è il fattore di carico?", ["Il peso dei pannelli", "La percentuale di energia prodotta in un anno rispetto a quella che l'impianto darebbe lavorando sempre al massimo", "Il prezzo dell'energia"], 1, "Un fotovoltaico al 14% produce in un anno come se lavorasse a piena potenza per circa il 14% delle ore."]] } ],
      reflect: "Quale rinnovabile è più adatta al territorio dove vivi? Perché?" },
    { brief: "Dimensiona l'impianto della scuola. Dati del libro: 1.250 kWh all'anno per ogni kWp, 8 m² di tetto per kWp, 1.200 € per kWp installato, energia a 0,20 €/kWh, consumo della scuola 25.000 kWh all'anno.",
      blocks: [
        { type: "sim", params: [{ id: "tetto", label: "Tetto disponibile", min: 50, max: 600, step: 10, value: 300, unit: "m²" }, { id: "kwp", label: "Potenza che installi", min: 1, max: 75, step: 1, value: 20, unit: "kWp" }, { id: "cons", label: "Consumo annuo della scuola", min: 5000, max: 80000, step: 1000, value: 25000, unit: "kWh" }],
          outputs: [{ key: "max", label: "Potenza massima sul tetto", f: (p) => Math.floor(p.tetto / 8), unit: "kWp" }, { key: "prod", label: "Produzione annua", f: (p) => p.kwp * 1250, unit: "kWh" }, { key: "cop", label: "Copertura del fabbisogno", f: (p, o) => Math.min(100, (o.prod / p.cons) * 100), unit: "%" }, { key: "cost", label: "Costo dell'impianto", f: (p) => p.kwp * 1200, unit: "€" }],
          note: (p, o) => p.kwp > o.max ? ["ko", `Non ci stanno: sul tetto entrano al massimo ${o.max} kWp (${p.kwp * 8} m² richiesti).`] : o.prod > p.cons ? ["warn", "Produci più di quanto consumi: il surplus va in rete. Ma attenzione a quando produci: d'estate la scuola è chiusa."] : ["ok", `Copri il ${LABENGINE.fmt(o.cop)}% del fabbisogno annuo.`] } ],
      reflect: "Se copri il 100% del fabbisogno in un anno, la scuola è indipendente dalla rete? Che cosa succede alle 18 di un giorno di gennaio?" },
    { label: "Scenario · conviene davvero?", brief: "L'energia autoconsumata vale 0,20 €/kWh; il libro prevede una detrazione fiscale del 50% in 10 anni. Il punto chiave è l'autoconsumo: quanta energia prodotta la scuola usa nel momento in cui viene prodotta.",
      blocks: [
        { type: "sim", params: [{ id: "kwp", label: "Potenza installata", min: 5, max: 37, step: 1, value: 20, unit: "kWp" }, { id: "auto", label: "Quota di autoconsumo", min: 20, max: 100, step: 5, value: 55, unit: "%", help: "La scuola usa energia soprattutto dalle 8 alle 17 nei giorni feriali, da settembre a giugno." }, { id: "det", label: "Detrazione fiscale", options: [[1, "Sì, 50% in 10 anni"], [0, "No"]], value: 1 }],
          outputs: [{ key: "prod", label: "Produzione", f: (p) => p.kwp * 1250, unit: "kWh/anno" }, { key: "ris", label: "Risparmio in bolletta", f: (p, o) => o.prod * (p.auto / 100) * 0.2, unit: "€/anno" }, { key: "net", label: "Costo al netto della detrazione", f: (p) => p.kwp * 1200 * (p.det ? 0.5 : 1), unit: "€" }, { key: "pb", label: "Si ripaga in", f: (p, o) => o.ris ? LABENGINE.fmt(o.net / o.ris, 1) + " anni" : "—" }],
          line: { from: 20, to: 100, steps: 16, xlabel: "autoconsumo (%)", ylabel: "anni per ripagarsi", series: [{ name: "Anni di ritorno", f: (p, x) => (p.kwp * 1200 * (p.det ? 0.5 : 1)) / (p.kwp * 1250 * (x / 100) * 0.2) }], marker: (p) => [p.auto, "la tua scuola"] },
          note: () => ["ok", "Più energia si usa mentre il sole c'è, prima l'impianto si ripaga. Spostare i consumi nelle ore centrali (o accumulare) conta quanto aggiungere pannelli. L'energia ceduta alla rete ha anche un valore, qui non conteggiato."] } ],
      reflect: "Quali attività della scuola si potrebbero spostare nelle ore di sole per aumentare l'autoconsumo?" }],
  bridge: "Progetta il piano energetico della scuola: stima il consumo annuo, dimensiona un impianto fotovoltaico sul tetto e calcola produzione, risparmio e tempo di ritorno.",
});
