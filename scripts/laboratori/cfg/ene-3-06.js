// Modello didattico di una giornata: produzione FV a campana fra le 7 e le 19, consumi di una scuola nei giorni feriali
const fv = (kwp, h) => (h <= 7 || h >= 19 ? 0 : kwp * 0.75 * Math.sin(((h - 7) / 12) * Math.PI));
const cons = (h) => (h >= 8 && h < 17 ? 22 : h >= 17 && h < 19 ? 8 : 3);
function giorno(p) { let soc = 0, aut = 0, rete = 0, prod = 0, uso = 0; const capU = p.bat; const serie = { soc: [], net: [] };
  for (let h = 0; h < 24; h++) { const P = fv(p.kwp, h), C = cons(h); prod += P; uso += C; let diretto = Math.min(P, C); aut += diretto; let surplus = P - diretto, def = C - diretto;
    const car = Math.min(surplus, capU - soc); soc += car * 0.9; surplus -= car; const sc = Math.min(def, soc); soc -= sc; aut += sc; def -= sc; rete += def; serie.soc.push([h, soc]); }
  return { prod, uso, aut, rete, autoc: prod ? Math.min(100, (Math.min(aut, prod) / prod) * 100) : 0, coper: (aut / uso) * 100 }; }
LABENGINE.run({
  id: "MC-ENE-3-06", area: "ENE", classe: 3, titolo: "La rete in 24 ore", archetipo: "Simulatore",
  hook: "Il problema dell'intermittenza: il sole c'è quando c'è, non quando servirebbe. Le batterie spostano l'energia nel tempo, dal mezzogiorno alla sera. Ma quanta batteria serve, e quanto costa?",
  footer: "La giornata del livello avanzato è un modello didattico semplificato (curve tipiche, efficienza di carica del 90%), non un dato misurato.",
  levels: [
    { brief: "Energia accumulata = tensione × capacità: E (Wh) = V × Ah. Calcola i sistemi della tabella del libro e confronta le scale.",
      blocks: [
        { type: "sim", params: [{ id: "v", label: "Tensione", min: 1, max: 400, step: 0.1, value: 3.7, unit: "V" }, { id: "ah", label: "Capacità", min: 1, max: 300, step: 1, value: 4, unit: "Ah" }],
          presets: [["Smartphone (3,7 V · 4 Ah)", { v: 3.7, ah: 4 }], ["Bici elettrica (36 V · 13 Ah)", { v: 36, ah: 13 }], ["Accumulo domestico (50 V · 270 Ah)", { v: 50, ah: 270 }], ["Auto elettrica (350 V · 200 Ah)", { v: 350, ah: 200 }]],
          outputs: [{ key: "wh", label: "Energia", f: (p) => p.v * p.ah, unit: "Wh", d: 1 }, { key: "kwh", label: "In kWh", f: (p) => (p.v * p.ah) / 1000, unit: "kWh", d: 2 }, { key: "tel", label: "Ricariche di smartphone equivalenti", f: (p) => (p.v * p.ah) / 14.8 }] },
        { type: "sort", title: "Quale accumulo per quale scala di tempo?", categories: [["ms", "Millisecondi o secondi"], ["ore", "Ore"], ["stag", "Settimane o stagioni"]],
          items: [["Supercondensatori e volani", "ms", "Stabilizzano la rete negli istanti."], ["Batterie agli ioni di litio", "ore", "Dal giorno alla sera."], ["Pompaggio idroelettrico", "ore", "Pompa acqua in alto quando c'è energia in più e la fa scendere quando serve: può coprire molte ore."], ["Idrogeno verde", "stag", "Si può conservare a lungo: l'estate per l'inverno, con perdite elevate."]] } ],
      reflect: "Quante ricariche di smartphone ci sono in una batteria d'auto elettrica? Ti aspettavi un numero così grande?" },
    { brief: "La famiglia del libro: fotovoltaico da 6 kW che d'estate produce 30 kWh al giorno; ne consuma 10 di giorno e 8 di notte. Efficienza della batteria 90%. Un accumulo da 13,5 kWh utili costa circa 12.000 € installato; l'energia di rete costa 0,30 €/kWh.",
      blocks: [
        { type: "sim", params: [{ id: "prod", label: "Produzione giornaliera", min: 5, max: 40, step: 1, value: 30, unit: "kWh" }, { id: "gio", label: "Consumo di giorno", min: 2, max: 30, step: 1, value: 10, unit: "kWh" }, { id: "not", label: "Consumo di notte", min: 2, max: 20, step: 1, value: 8, unit: "kWh" }, { id: "costo", label: "Costo dell'accumulo installato", min: 4000, max: 15000, step: 500, value: 12000, unit: "€" }, { id: "gg", label: "Giorni all'anno in cui la batteria si riempie", min: 100, max: 365, step: 5, value: 365, unit: "giorni" }],
          outputs: [{ key: "disp", label: "Energia disponibile da accumulare", f: (p) => Math.max(0, p.prod - p.gio), unit: "kWh" }, { key: "serve", label: "Da immagazzinare per avere la notte coperta", f: (p) => p.not / 0.9, unit: "kWh", d: 1 }, { key: "ris", label: "Risparmio annuo", f: (p, o) => Math.min(p.not, o.disp * 0.9, 13.5 * 0.9) * p.gg * 0.3, unit: "€" }, { key: "pb", label: "Si ripaga in", f: (p, o) => o.ris ? LABENGINE.fmt(p.costo / o.ris, 1) + " anni" : "—" }],
          note: (p, o) => p.gg >= 360 ? ["warn", "Il libro calcola su 365 giorni, ma in inverno il fotovoltaico produce molto meno: prova 200-250 giorni e guarda quanto cambia il tempo di ritorno."] : ["ok", "È conveniente se la batteria dura più del tempo che serve a ripagarla (di solito si parla di 10-15 anni di vita)."] } ],
      reflect: "Da quali fattori dipende la convenienza? Quale di questi cambierà di più nei prossimi anni?" },
    { label: "Scenario · la scuola fotovoltaica", brief: "Un giorno feriale di primavera in una scuola: consumo alto dalle 8 alle 17, basso la sera e la notte. Scegli potenza dell'impianto e capacità della batteria e guarda quanta energia la scuola usa davvero dal proprio tetto.",
      blocks: [
        { type: "sim", params: [{ id: "kwp", label: "Impianto fotovoltaico", min: 5, max: 80, step: 1, value: 30, unit: "kWp" }, { id: "bat", label: "Batteria (capacità utile)", min: 0, max: 150, step: 5, value: 0, unit: "kWh" }],
          outputs: [{ key: "prod", label: "Prodotta nella giornata", f: (p) => giorno(p).prod, unit: "kWh" }, { key: "uso", label: "Consumata", f: (p) => giorno(p).uso, unit: "kWh" }, { key: "cop", label: "Consumi coperti dal sole", f: (p) => giorno(p).coper, unit: "%" }, { key: "rete", label: "Presa dalla rete", f: (p) => giorno(p).rete, unit: "kWh" }],
          line: { from: 0, to: 23, steps: 23, xlabel: "ora del giorno", ylabel: "kW", series: [{ name: "Produzione FV", f: (p, x) => fv(p.kwp, x) }, { name: "Consumo scuola", f: (p, x) => cons(x) }] },
          note: (p) => { const g = giorno(p); return p.bat === 0 ? ["warn", `Senza batteria il sole copre il ${LABENGINE.fmt(g.coper)}% dei consumi: la sera e la notte si compra tutto dalla rete.`] : ["ok", `Con ${p.bat} kWh di batteria il sole copre il ${LABENGINE.fmt(g.coper)}% dei consumi della giornata.`]; } } ],
      reflect: "Oltre una certa capacità, aggiungere batteria non aiuta più. Perché? Che cosa servirebbe allora: più pannelli o meno consumi?" }],
  bridge: "Progetta il sistema di accumulo per una scuola con fotovoltaico: usa dati di produzione e consumo, dimensiona la batteria e valuta costi e benefici.",
});
