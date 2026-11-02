LABENGINE.run({
  id: "MC-AMB-2-03", area: "AMB", classe: 2, titolo: "Il quartiere sotto la lente", archetipo: "Costruttore",
  hook: "Una città non si forma per caso: è il risultato di scelte. Dove mettere scuole, parchi, fermate e parcheggi lo decide un piano. E la legge fissa quanti metri quadrati di spazio pubblico spettano a ogni abitante.",
  levels: [
    { brief: "Sulla mappa del quartiere colori le zone funzionali. Classifica ogni edificio o area.",
      blocks: [
        { type: "sort", categories: [["res", "Residenziale", "giallo"], ["com", "Commerciale", "arancione"], ["ind", "Produttivo", "grigio"], ["ver", "Verde", "verde"], ["ser", "Servizio pubblico"]],
          items: [["Condominio di 6 piani", "res", ""], ["Supermercato", "com", ""], ["Officina meccanica", "ind", ""], ["Parco giochi", "ver", ""], ["Farmacia", "com", "È un'attività commerciale che offre un servizio sanitario: sulla mappa merita anche il simbolo ✚."], ["Scuola primaria", "ser", ""], ["Villette a schiera", "res", ""], ["Capannone di un magazzino", "ind", ""], ["Ufficio postale", "ser", ""], ["Giardino pubblico", "ver", ""]] },
        { type: "quiz", questions: [["Che cos'è il Piano Regolatore?", ["Una mappa turistica", "Lo strumento con cui il Comune decide come si usa ogni area del territorio", "Il regolamento del traffico"], 1, "Stabilisce dove si può costruire, dove vanno servizi e verde, e con quali regole."]] } ],
      reflect: "Nel tuo quartiere prevale una funzione? Che cosa manca, secondo te?" },
    { brief: "Il D.M. 1444/1968, ancora in vigore, fissa dotazioni minime per abitante: verde 9 m², parcheggi 2,5 m², scuole 4,5 m², attrezzature generali 2 m² (18 m² in tutto). Misura con Google Maps le superfici del quartiere e confrontale.",
      blocks: [
        { type: "sim", params: [{ id: "ab", label: "Abitanti del quartiere", min: 500, max: 30000, step: 100, value: 6000 }, { id: "v", label: "Verde pubblico misurato", min: 0, max: 200000, step: 500, value: 30000, unit: "m²" }, { id: "pa", label: "Parcheggi pubblici", min: 0, max: 60000, step: 500, value: 18000, unit: "m²" }, { id: "sc", label: "Aree per le scuole", min: 0, max: 80000, step: 500, value: 25000, unit: "m²" }, { id: "at", label: "Attrezzature di interesse generale", min: 0, max: 40000, step: 500, value: 9000, unit: "m²" }],
          outputs: [{ key: "vv", label: "Verde per abitante (min 9)", f: (p) => p.v / p.ab, unit: "m²", d: 1 }, { key: "pp", label: "Parcheggi per abitante (min 2,5)", f: (p) => p.pa / p.ab, unit: "m²", d: 1 }, { key: "ss", label: "Scuole per abitante (min 4,5)", f: (p) => p.sc / p.ab, unit: "m²", d: 1 }, { key: "aa", label: "Attrezzature per abitante (min 2)", f: (p) => p.at / p.ab, unit: "m²", d: 1 }],
          bars: (p, o) => [["Verde", (o.vv / 9) * 100], ["Parcheggi", (o.pp / 2.5) * 100], ["Scuole", (o.ss / 4.5) * 100], ["Attrezzature", (o.aa / 2) * 100]], barsUnit: "% del minimo", barsMax: 200, barsTitle: "Rispetto allo standard (100% = minimo di legge)",
          note: (p, o) => { const m = []; if (o.vv < 9) m.push("verde"); if (o.pp < 2.5) m.push("parcheggi"); if (o.ss < 4.5) m.push("scuole"); if (o.aa < 2) m.push("attrezzature"); return m.length ? ["ko", "Sotto il minimo di legge: " + m.join(", ") + ". Questo è un dato da portare nella tua proposta."] : ["ok", "Il quartiere rispetta tutti gli standard minimi."]; } },
        { type: "quiz", questions: [["Una scuola primaria dovrebbe essere raggiungibile a piedi entro circa…", ["500 m (6-7 minuti)", "2 km", "5 km"], 0, "È lo standard di distanza pedonale citato nel testo."]] } ],
      reflect: "Il dato che ti ha sorpreso di più è sopra o sotto il minimo? Quanta superficie mancherebbe per raggiungerlo?" },
    { label: "Scenario · il bando per la vivibilità", brief: "Il Comune cerca proposte per migliorare un quartiere. Prepara la tua: problema misurato, persone coinvolte, soluzione, costi e tempi.",
      blocks: [
        { type: "sort", title: "Chi vuole che cosa?", text: "Prima di proporre, ascolta gli interessi di chi vive l'area.", categories: [["res", "Residenti"], ["comm", "Commercianti"], ["fra", "Bambini e anziani"], ["aut", "Automobilisti"]],
          items: [["Più verde e meno rumore", "res", ""], ["Clienti che arrivano facilmente", "comm", ""], ["Marciapiedi larghi e panchine", "fra", ""], ["Parcheggi vicini", "aut", ""], ["Attraversamenti sicuri davanti alla scuola", "fra", ""], ["Vetrine visibili dalla strada", "comm", ""]] },
        { type: "canvas", fields: [["area", "Area scelta e problema principale", "con dati e misure"], ["std", "Confronto con lo standard di legge", "es. 4,2 m² di verde per abitante contro 9"], ["sol", "La tua soluzione", ""], ["chi", "Chi ci guadagna e chi potrebbe opporsi", ""], ["tempi", "Costi e tempi stimati", ""]],
          checks: [["Il problema contiene un dato numerico", (v) => /\d/.test(v.area + v.std)], ["Hai considerato chi potrebbe opporsi", (v) => v.chi.length > 20]],
          out: (v) => `PROPOSTA PER IL BANDO\nArea e problema: ${v.area}\nStandard: ${v.std}\nSoluzione: ${v.sol}\nStakeholder: ${v.chi}\nCosti e tempi: ${v.tempi}` } ],
      reflect: "La tua proposta toglie qualcosa a qualcuno (per esempio parcheggi)? Come gestiresti il conflitto?" }],
  bridge: "Analizza il quartiere della scuola con Google Maps: individua le zone funzionali, conta i servizi presenti e proponi un miglioramento motivato.",
});
