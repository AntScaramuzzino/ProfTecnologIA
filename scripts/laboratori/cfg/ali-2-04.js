LABENGINE.run({
  id: "MC-ALI-2-04", area: "ALI", classe: 2, titolo: "Il viaggio del cibo", archetipo: "Flussi",
  hook: "Il cibo non appare per magia: ha una storia. Fra il campo e il tuo piatto ci sono agricoltori, industrie, camion, navi e negozi. E ogni chilometro pesa.",
  levels: [
    { brief: "Ecco gli attori della filiera di un pacco di pasta. Mettili al loro posto, poi rimetti in ordine il viaggio.",
      blocks: [
        { type: "sort", categories: [["pri", "Produttore primario", "campo, allevamento"], ["tra", "Trasformatore", "industria"], ["dis", "Distributore", "logistica"], ["det", "Dettagliante", "punto vendita"]],
          items: [["Azienda agricola che coltiva grano duro", "pri", "La materia prima nasce qui."], ["Mulino che macina il grano in semola", "tra", "Prima trasformazione."], ["Pastificio che impasta, trafila ed essicca", "tra", "Seconda trasformazione: nasce il prodotto."], ["Corriere con i camion", "dis", "Porta la pasta ai magazzini."], ["Centro di distribuzione della catena", "dis", "Smista la merce verso i negozi."], ["Supermercato sotto casa", "det", "Dove la compri."], ["Bottega del paese", "det", ""]] },
        { type: "quiz", questions: [["Sull'etichetta leggi «Paese di coltivazione del grano: Italia e altri Paesi UE e non UE». Che cosa sai dell'origine?", ["Che è tutto italiano", "Che il grano viene in parte dall'estero, senza sapere quanto", "Niente"], 1, "L'indicazione dice che il grano è di più provenienze, ma non in che proporzione."]] } ],
      reflect: "Il tuo prodotto di casa è fatto con ingredienti italiani o stranieri? Come l'hai capito?" },
    { brief: "Food miles = peso della merce × distanza. Il libro usa le tonnellate-chilometro (t·km). Prova gli esempi e guarda che conta anche il mezzo di trasporto.",
      blocks: [
        { type: "sim", params: [{ id: "kg", label: "Peso della confezione", min: 0.1, max: 5, step: 0.05, value: 0.75, unit: "kg" }, { id: "km", label: "Distanza", min: 10, max: 15000, step: 10, value: 900, unit: "km" }, { id: "m", label: "Mezzo principale", options: [["nave", "Nave container"], ["camion", "Camion"], ["aereo", "Aereo cargo"]], value: "camion" }],
          presets: [["Olio pugliese a Milano", { kg: 0.75, km: 900, m: "camion" }], ["Olio di palma da Giacarta", { kg: 0.75, km: 12000, m: "nave" }], ["Fagiolini dal Kenya", { kg: 0.2, km: 6000, m: "aereo" }], ["Mele del Trentino a Roma", { kg: 1, km: 600, m: "camion" }]],
          outputs: [{ key: "tkm", label: "Food miles", f: (p) => (p.kg / 1000) * p.km, unit: "t·km", d: 3 }, { key: "km0", label: "È km0? (meno di 70 km)", f: (p) => p.km < 70 ? "Sì" : "No" }],
          note: (p) => p.m === "aereo" ? ["ko", "L'aereo cargo è il mezzo più inquinante per kg trasportato: pochi chilometri in aereo pesano più di molti in nave."] : p.m === "nave" ? ["warn", "Molti chilometri, ma la nave porta migliaia di tonnellate insieme: le emissioni per tonnellata-chilometro sono basse."] : ["ok", "Il camion sta in mezzo: emette più della nave per tonnellata-chilometro, molto meno dell'aereo."] },
        { type: "quiz", questions: [["Più food miles vuol dire sempre più impatto ambientale?", ["Sì, sempre", "No: contano anche il mezzo e come si produce nel luogo d'origine", "No, i chilometri non contano"], 1, "Un prodotto locale coltivato in serra riscaldata può inquinare più di uno importato in nave."]] } ],
      reflect: "Fra olio italiano e olio di palma, quale ha più food miles? E quale altri impatti ha, nel luogo in cui si produce?" },
    { label: "Scenario · la mensa a filiera corta", brief: "Un Comune di 5.000 abitanti vuole più prodotti locali in mensa, spendendo al massimo il 10% in più dei prezzi della grande distribuzione. Stima il beneficio sul trasporto e prepara la proposta.",
      blocks: [
        { type: "sim", params: [{ id: "t", label: "Merce per la mensa all'anno", min: 1, max: 50, step: 1, value: 12, unit: "t" }, { id: "km", label: "Distanza media attuale", min: 100, max: 3000, step: 50, value: 800, unit: "km" }, { id: "q", label: "Quota di prodotti che diventa km0", min: 0, max: 100, step: 5, value: 50, unit: "%" }, { id: "kml", label: "Distanza media dei prodotti locali", min: 5, max: 70, step: 5, value: 30, unit: "km" }],
          outputs: [{ key: "pr", label: "Food miles prima", f: (p) => p.t * p.km, unit: "t·km" }, { key: "do", label: "Food miles dopo", f: (p) => p.t * (1 - p.q / 100) * p.km + p.t * (p.q / 100) * p.kml, unit: "t·km" }, { key: "rid", label: "Riduzione", f: (p, o) => (1 - o.do / o.pr) * 100, unit: "%" }],
          bars: (p, o) => [["Prima", o.pr], ["Dopo", o.do]], barsUnit: "t·km" },
        { type: "canvas", fields: [["cat", "Le 5 categorie di prodotti della mensa", "pasta, verdure, carne, pane, frutta"], ["alt", "Per ogni categoria: alternativa locale e produttore", "cerca i mercati contadini della tua zona"], ["costo", "Costo comparato: quanto in più?", "deve stare entro il 10%"], ["ben", "Beneficio stimato (dai calcoli)", ""]],
          checks: [["5 categorie indicate", (v) => v.cat.split(/[,;\n]/).filter((x) => x.trim()).length >= 5], ["Costo confrontato con un numero", (v) => /\d/.test(v.costo)]],
          out: (v) => `Proposta per la mensa a filiera corta\n\nCategorie: ${v.cat}\n\nAlternative locali: ${v.alt}\n\nCosti: ${v.costo}\n\nBeneficio: ${v.ben}` } ],
      reflect: "La filiera corta aiuta anche i produttori della tua zona. Quali vantaggi non si misurano in chilometri?" }],
  bridge: "Analizza l'etichetta di 3 prodotti alimentari: trova paese d'origine, additivi e certificazioni (bio, IGP, DOP) e valuta quale offre più garanzie.",
});
