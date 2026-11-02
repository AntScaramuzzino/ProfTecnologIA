const F = { gas: 0.202, el: 0.233, benz: 0.21, dies: 0.17, bus: 0.089, treno: 0.041 };
const base = (p) => ({ risc: p.gas * F.gas, el: p.el * F.el, tr: p.km * (p.al === "dies" ? F.dies : F.benz) + p.bus * F.bus });
LABENGINE.run({
  id: "MC-ENE-3-02", area: "ENE", classe: 3, titolo: "L'impronta di carbonio di casa", archetipo: "Calcolatore",
  hook: "Nei combustibili fossili c'è energia accumulata in milioni di anni, che noi liberiamo in un attimo. Insieme all'energia esce CO₂. Quanta ne produce ogni mese una famiglia, e dove si può tagliare?",
  footer: "Fattori di emissione e dati medi dalle tabelle del testo della MC (elettricità: rete italiana 2023).",
  levels: [
    { brief: "Confronta le fonti non rinnovabili con la tabella del libro: CO₂ prodotta per ogni gigajoule (GJ) di energia, valori centrali degli intervalli.",
      blocks: [
        { type: "chart", kind: "bar", toggles: false, d: 1, xlabel: "fonte", ylabel: "kg CO₂ per GJ", series: [{ name: "CO₂ per GJ", data: [["Carbone", 92.5], ["Petrolio", 72.5], ["Gas naturale", 52.5], ["Uranio (in funzione)", 0]] }] },
        { type: "quiz", questions: [
          ["Quale fonte fossile produce più CO₂ a parità di energia?", ["Gas naturale", "Petrolio", "Carbone"], 2, "Circa 90-95 kg per GJ: quasi il doppio del gas."],
          ["Per questo il gas è chiamato il fossile «più pulito». Vuol dire che non inquina?", ["Sì", "No: produce comunque CO₂, solo meno degli altri fossili"], 1, "Le perdite di metano lungo i gasdotti, poi, sono un problema climatico serio."],
          ["Il nucleare non produce CO₂ durante il funzionamento. Vuol dire che non ha impatti?", ["Sì, nessuno", "No: estrazione dell'uranio, costruzione delle centrali e scorie radioattive sono impatti da considerare"], 1, "«Zero CO₂ in funzione» non è uguale a «zero impatto»."]] } ],
      reflect: "Il libro dice che petrolio e gas durerebbero circa 50 anni ai ritmi attuali. Che cosa cambia se i consumi crescono? E se calano?" },
    { brief: "Calcola le emissioni mensili di una famiglia. Se non hai le bollette usa i dati medi del libro: 100 kWh di gas al mese in mezza stagione (1 m³ ≈ 10 kWh) e 250 kWh di elettricità.",
      blocks: [
        { type: "sim", params: [{ id: "gas", label: "Gas per riscaldamento e cucina", min: 0, max: 2000, step: 10, value: 100, unit: "kWh/mese" }, { id: "el", label: "Elettricità", min: 50, max: 800, step: 10, value: 250, unit: "kWh/mese" }, { id: "km", label: "Km in auto", min: 0, max: 3000, step: 50, value: 800, unit: "km/mese" }, { id: "al", label: "Alimentazione dell'auto", options: [["benz", "Benzina"], ["dies", "Diesel"]], value: "benz" }, { id: "bus", label: "Km in autobus (tutta la famiglia)", min: 0, max: 1000, step: 10, value: 100, unit: "km/mese" }],
          outputs: [{ key: "r", label: "Riscaldamento e cucina", f: (p) => base(p).risc, unit: "kg CO₂", d: 1 }, { key: "e", label: "Elettricità", f: (p) => base(p).el, unit: "kg CO₂", d: 1 }, { key: "t", label: "Trasporti", f: (p) => base(p).tr, unit: "kg CO₂", d: 1 }, { key: "tot", label: "Totale al mese", f: (p) => { const b = base(p); return b.risc + b.el + b.tr; }, unit: "kg CO₂", d: 1 }],
          bars: (p) => { const b = base(p); return [["Riscaldamento", b.risc], ["Elettricità", b.el], ["Trasporti", b.tr]]; }, barsUnit: "kg CO₂", barsD: 1 } ],
      reflect: "Quale settore pesa di più nella tua famiglia? Ti aspettavi questo risultato?" },
    { label: "Scenario · tre strade per ridurre", brief: "Parti dai valori della tua famiglia e attiva gli scenari del libro: A auto elettrica (0,047 kg CO₂/km), B fotovoltaico da 3 kWp (circa 300 kWh/mese), C isolamento (−30% di gas). Confronta CO₂ risparmiata e costo.",
      blocks: [
        { type: "sim", params: [{ id: "gas", label: "Gas", min: 0, max: 2000, step: 10, value: 600, unit: "kWh/mese" }, { id: "el", label: "Elettricità", min: 50, max: 800, step: 10, value: 250, unit: "kWh/mese" }, { id: "km", label: "Km in auto a benzina", min: 0, max: 3000, step: 50, value: 800, unit: "km/mese" }, { id: "A", label: "A · Auto elettrica (circa 30.000 €)", options: [[0, "No"], [1, "Sì"]], value: 0 }, { id: "B", label: "B · Fotovoltaico 3 kWp (circa 6.000 €)", options: [[0, "No"], [1, "Sì"]], value: 0 }, { id: "C", label: "C · Isolamento termico (circa 20.000 €)", options: [[0, "No"], [1, "Sì"]], value: 0 }],
          outputs: [{ key: "pr", label: "Oggi", f: (p) => p.gas * F.gas + p.el * F.el + p.km * F.benz, unit: "kg CO₂/mese", d: 1 },
            { key: "do", label: "Con gli scenari", f: (p) => p.gas * (p.C ? 0.7 : 1) * F.gas + Math.max(0, p.el + (p.A ? p.km * 0.2 : 0) - (p.B ? 300 : 0)) * F.el + (p.A ? 0 : p.km * F.benz), unit: "kg CO₂/mese", d: 1 },
            { key: "ris", label: "Risparmio in 10 anni", f: (p, o) => (o.pr - o.do) * 120, unit: "kg CO₂" },
            { key: "eur", label: "Euro spesi per kg di CO₂ evitato", f: (p, o) => { const c = p.A * 30000 + p.B * 6000 + p.C * 20000; const r = (o.pr - o.do) * 120; return c && r > 0 ? +(c / r).toFixed(2) : "—"; }, d: 2 }],
          bars: (p, o) => [["Oggi", o.pr], ["Con gli scenari", o.do]], barsUnit: "kg/mese", barsD: 1,
          note: (p) => p.A && !p.B ? ["warn", "Con l'auto elettrica i chilometri si pagano in elettricità (0,2 kWh/km): l'auto emette meno, ma tramite la rete. Con il fotovoltaico, una parte di quell'energia diventa a emissioni zero."] : null } ],
      reflect: "Quale scenario ha il miglior rapporto fra euro spesi e CO₂ evitata? Come cambierebbe se la rete elettrica fosse tutta rinnovabile?" }],
  bridge: "Calcola l'impronta di carbonio della tua famiglia per un mese: somma le emissioni di riscaldamento, trasporti ed elettricità con i fattori di emissione del libro.",
});
