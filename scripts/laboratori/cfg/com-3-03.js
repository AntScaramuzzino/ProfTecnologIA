const FE = { auto1: ["Auto, 1 occupante", 130], auto2: ["Auto, 2 occupanti", 65], bus: ["Autobus urbano (pieno)", 65], moto: ["Moto", 90], bici: ["Bicicletta", 0], piedi: ["A piedi", 0] };
LABENGINE.run({
  id: "MC-COM-3-03", area: "COM", classe: 3, titolo: "Il tragitto casa-scuola", archetipo: "Calcolatore",
  hook: "Tutto si muove: persone, merci, informazioni. Il viaggio più ripetuto della tua vita, per ora, è quello fra casa e scuola. Quanto pesa sul clima, e quanto potrebbe pesare di meno?",
  footer: "Fattori di emissione in grammi di CO₂ per chilometro e per passeggero, dalla tabella del testo della MC.",
  levels: [
    { brief: "Misura su Google Maps la distanza fra casa e scuola. Imposta mezzo e giorni: il laboratorio calcola le emissioni di un anno scolastico.",
      blocks: [
        { type: "sim", params: [{ id: "km", label: "Distanza casa-scuola (solo andata)", min: 0.2, max: 30, step: 0.1, value: 3, unit: "km" }, { id: "m", label: "Mezzo", options: Object.entries(FE).map(([k, v]) => [k, v[0]]), value: "auto1" }, { id: "g", label: "Giorni di scuola all'anno", min: 150, max: 220, step: 1, value: 200 }],
          outputs: [{ key: "gg", label: "Al giorno (andata e ritorno)", f: (p) => p.km * 2 * FE[p.m][1], unit: "g CO₂" }, { key: "y", label: "In un anno scolastico", f: (p) => (p.km * 2 * FE[p.m][1] * p.g) / 1000, unit: "kg CO₂", d: 1 }],
          bars: (p) => Object.values(FE).map(([l, f]) => [l, (p.km * 2 * f * p.g) / 1000]), barsUnit: "kg/anno", barsD: 1, barsTitle: "Lo stesso tragitto con mezzi diversi",
          note: (p) => p.km <= 2 && (p.m === "auto1" || p.m === "auto2") ? ["warn", "Meno di 2 km: a piedi sono circa 25 minuti, in bici meno di 10."] : null } ],
      reflect: "Quale alternativa sarebbe davvero praticabile per te? Che cosa te lo impedisce?" },
    { brief: "Risultati del sondaggio di una classe di 24 studenti (dati d'esempio). Inserisci i tuoi dati reali al posto di questi e leggi dove pesa di più.",
      blocks: [
        { type: "sim", params: [{ id: "auto1", label: "In auto da soli con un genitore", min: 0, max: 30, step: 1, value: 9 }, { id: "auto2", label: "In auto con un fratello o un compagno", min: 0, max: 30, step: 1, value: 4 }, { id: "bus", label: "In autobus", min: 0, max: 30, step: 1, value: 5 }, { id: "bici", label: "In bici o monopattino", min: 0, max: 30, step: 1, value: 2 }, { id: "piedi", label: "A piedi", min: 0, max: 30, step: 1, value: 4 }, { id: "km", label: "Distanza media (solo andata)", min: 0.5, max: 15, step: 0.5, value: 3.5, unit: "km" }],
          outputs: [{ key: "tot", label: "Emissioni della classe in un anno (200 giorni)", f: (p) => ["auto1", "auto2", "bus", "bici", "piedi"].reduce((s, k) => s + p[k] * p.km * 2 * FE[k][1] * 200, 0) / 1000, unit: "kg CO₂" }, { key: "auto", label: "Quota dovuta alle auto", f: (p, o) => o.tot ? ((p.auto1 * 130 + p.auto2 * 65) * p.km * 2 * 200 / 1000 / o.tot) * 100 : 0, unit: "%" }],
          bars: (p) => [["Auto (1 occupante)", p.auto1 * p.km * 2 * 130 * 200 / 1000], ["Auto (2 occupanti)", p.auto2 * p.km * 2 * 65 * 200 / 1000], ["Autobus", p.bus * p.km * 2 * 65 * 200 / 1000], ["Bici e piedi", 0]], barsUnit: "kg/anno" } ],
      reflect: "Quanti compagni hanno risposto che potrebbero cambiare mezzo? Che cosa li aiuterebbe?" },
    { label: "Scenario · il Piano di mobilità della scuola", brief: "Simula l'effetto delle azioni del tuo piano su una scuola di 400 studenti che oggi arrivano per metà in auto da soli (distanza media 3,5 km, 200 giorni).",
      blocks: [
        { type: "sim", params: [{ id: "car", label: "Car pooling: studenti che passano da 1 a 2 occupanti", min: 0, max: 200, step: 10, value: 40 }, { id: "pb", label: "Piedibus e bicibus: studenti che lasciano l'auto", min: 0, max: 200, step: 10, value: 30 }, { id: "bus", label: "Abbonamento scolastico: studenti che passano all'autobus", min: 0, max: 200, step: 10, value: 30 }],
          outputs: [{ key: "pr", label: "Emissioni oggi", f: () => 200 * 3.5 * 2 * 130 * 200 / 1e6, unit: "t CO₂", d: 1 }, { key: "do", label: "Con il piano", f: (p) => { const resto = Math.max(0, 200 - p.car - p.pb - p.bus); return (resto * 130 + Math.min(p.car, 200) * 65 + p.bus * 65) * 3.5 * 2 * 200 / 1e6; }, unit: "t CO₂", d: 1 }, { key: "r", label: "Riduzione", f: (p, o) => (1 - o.do / o.pr) * 100, unit: "%" }],
          bars: (p, o) => [["Oggi", o.pr], ["Con il piano", o.do]], barsUnit: "t CO₂", barsD: 1,
          note: (p) => p.car + p.pb + p.bus > 200 ? ["ko", "Hai spostato più studenti di quelli che vengono in auto (200): ricontrolla i numeri."] : null },
        { type: "canvas", fields: [["dati", "Dati raccolti (almeno 100 risposte)", ""], ["azioni", "Azioni proposte, con chi le realizza", ""], ["mis", "Come misurerete i risultati", ""]],
          checks: [["Almeno tre azioni", (v) => v.azioni.split(/[\n;]/).filter((x) => x.trim()).length >= 3], ["Indicatore misurabile", (v) => /\d|%|kg|percentual/i.test(v.mis)]],
          out: (v) => `PIANO DI MOBILITÀ SOSTENIBILE\n\nDati: ${v.dati}\n\nAzioni:\n${v.azioni}\n\nMonitoraggio: ${v.mis}` } ],
      reflect: "Quale azione costa meno e rende di più? Quale coinvolge le famiglie?" }],
  bridge: "Progetta il piano di mobilità sostenibile della scuola: somministra un sondaggio ai compagni, analizza i dati, calcola le emissioni e proponi azioni concrete.",
});
