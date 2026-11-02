const FIB = { cot: ["Cotone convenzionale", 9000, 5.5, 0], cotb: ["Cotone biologico", 3000, 3.8, 0], pol: ["Poliestere", 0.001, 9.5, 1], nyl: ["Nylon", 0.001, 14.5, 1], lana: ["Lana", 500, 8.0, 0], lino: ["Lino", 0, 1.5, 0] };
LABENGINE.run({
  id: "MC-MAT-1-06", area: "MAT", classe: 1, titolo: "Fibre, plastiche e compositi", archetipo: "Banco prova",
  hook: "La tua felpa, il tuo zaino e la suola delle scarpe vengono da tre famiglie diverse: fibre, plastiche e compositi. L'etichetta e qualche prova semplice dicono da dove vengono e dove finiranno.",
  levels: [
    { brief: "Hai fatto il test dell'acqua e, in laboratorio con il docente, il test di combustione su un filo. Dai risultati, decidi se la fibra è naturale o sintetica.",
      note: "Il test di combustione si fa solo in laboratorio, con ventilazione e con il docente, su un singolo filo. Mai da soli a casa.",
      blocks: [
        { type: "sort", categories: [["nat", "Fibra naturale", "cotone, lana, lino, seta"], ["sin", "Fibra sintetica", "poliestere, nylon, acrilico"]],
          items: [["L'acqua penetra subito nel tessuto", "nat", "Il tessuto assorbe l'umidità (idrofilo): tipico delle fibre naturali."], ["L'acqua forma gocce che scorrono via", "sin", "Il tessuto respinge l'acqua (idrofobo): tipico delle sintetiche."], ["Brucia lentamente, odore di carta bruciata, cenere che si sbriciola", "nat", "È il comportamento del cotone o del lino."], ["Odore di capelli bruciati, cenere friabile", "nat", "È il comportamento della lana e della seta, fibre di origine animale."], ["Si scioglie e si arrotola sulla fiamma, lascia una pallina dura", "sin", "Le fibre sintetiche sono plastiche: fondono."], ["Odore di plastica bruciata", "sin", "Le sintetiche derivano dal petrolio."], ["Etichetta: 100% poliammide", "sin", "Poliammide è il nome tecnico del nylon."], ["Etichetta: 100% lino", "nat", "Il lino viene da una pianta."]] } ],
      reflect: "Il test dell'acqua e l'etichetta dicevano la stessa cosa? Se no, a quale credi di più?" },
    { brief: "Componi un capo come se leggessi la sua etichetta: scegli le due fibre, le percentuali e il peso. Il laboratorio stima acqua e CO₂ per produrre le fibre, con i dati del libro.",
      note: "Dati per kg di fibra, dall'estrazione alla fibra (cradle-to-gate): esclusi tintura, confezione e trasporto. Per il cotone si usa il valore centrale dell'intervallo del libro.",
      blocks: [
        { type: "sim", params: [{ id: "f1", label: "Fibra principale", options: Object.entries(FIB).map(([k, v]) => [k, v[0]]), value: "cot" }, { id: "q1", label: "Percentuale fibra principale", min: 0, max: 100, step: 5, value: 60, unit: "%" }, { id: "f2", label: "Seconda fibra", options: Object.entries(FIB).map(([k, v]) => [k, v[0]]), value: "pol" }, { id: "g", label: "Peso del capo", min: 100, max: 1000, step: 10, value: 250, unit: "g" }, { id: "y", label: "Anni in cui lo indossi", min: 1, max: 10, step: 1, value: 2, unit: "anni" }],
          presets: [["T-shirt 100% cotone", { f1: "cot", q1: 100, f2: "pol", g: 180 }], ["Felpa 60/40", { f1: "cot", q1: 60, f2: "pol", g: 450 }], ["Maglione di lana", { f1: "lana", q1: 100, f2: "pol", g: 400 }], ["Camicia di lino", { f1: "lino", q1: 100, f2: "pol", g: 200 }]],
          outputs: [{ key: "w", label: "Acqua per le fibre", f: (p) => (p.g / 1000) * (FIB[p.f1][1] * p.q1 + FIB[p.f2][1] * (100 - p.q1)) / 100, unit: "litri" }, { key: "co2", label: "CO₂ per le fibre", f: (p) => (p.g / 1000) * (FIB[p.f1][2] * p.q1 + FIB[p.f2][2] * (100 - p.q1)) / 100, unit: "kg", d: 2 }, { key: "wy", label: "Acqua per anno d'uso", f: (p, o) => o.w / p.y, unit: "litri/anno" }, { key: "mix", label: "Riciclabile?", f: (p) => p.q1 === 100 || p.f1 === p.f2 ? "Monofibra: più facile" : "Misto: quasi impossibile" }],
          note: (p) => (FIB[p.f1][3] || (p.q1 < 100 && FIB[p.f2][3])) ? ["warn", "Contiene fibre sintetiche: a ogni lavaggio rilascia da 100.000 a 700.000 microfibre (dati del libro), che non si biodegradano."] : ["ok", "Solo fibre naturali: niente microplastiche, e a fine vita si biodegrada."] } ],
      reflect: "Cambia solo gli anni d'uso: che cosa succede all'acqua per anno? Che cosa ti dice sulla durata dei vestiti?" },
    { label: "Scenario · il vasetto di miele", brief: "Un'azienda di miele vuole sostituire il vasetto di vetro con coperchio in banda stagnata ed etichetta plastificata, mantenendo le stesse funzioni e lo stesso costo (circa 0,30 € a vasetto). Pesa i criteri e confronta i candidati del libro.",
      blocks: [
        { type: "compare", criteria: [["costo", "Costo entro 0,30 €"], ["imp", "Impermeabilità"], ["rott", "Resistenza alla rottura"], ["fine", "Riciclabile o compostabile"], ["orig", "Origine rinnovabile"]],
          alts: [
            { name: "Vetro + acciaio (0,28 €)", v: { costo: 4, imp: 5, rott: 1, fine: 5, orig: 2 } },
            { name: "PET riciclato (0,08 €)", v: { costo: 5, imp: 5, rott: 5, fine: 4, orig: 3 } },
            { name: "PET bio da canna (0,14 €)", v: { costo: 5, imp: 5, rott: 5, fine: 4, orig: 4 } },
            { name: "PP + etichetta carta (0,09 €)", v: { costo: 5, imp: 5, rott: 5, fine: 3, orig: 1 } },
            { name: "Bambù composito (0,45 €)", v: { costo: 1, imp: 2, rott: 5, fine: 3, orig: 5 } }],
          scale: "Punteggi da 1 a 5 ricavati dalla tabella del libro.", notes: false,
          verdict: (sc) => ["ok", `Vince <strong>${sc[0][0]}</strong>. Ricorda che il miele va conservato a lungo: l'impermeabilità non è negoziabile.`] } ],
      reflect: "Il materiale più «naturale» è risultato il migliore? Perché sì o perché no?" }],
  bridge: "Trova un prodotto che dichiara di usare bioplastica: verifica la composizione sull'etichetta, cerca come va smaltito e valuta se la dichiarazione è corretta.",
});
