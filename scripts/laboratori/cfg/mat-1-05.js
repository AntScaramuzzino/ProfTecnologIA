const MET = { al: ["Alluminio", 2.7, 90, 237, 37, 1.8], acc: ["Acciaio dolce", 7.8, 400, 50, 10, 0.7], cu: ["Rame", 8.9, 210, 385, 58, 8.5] };
LABENGINE.run({
  id: "MC-MAT-1-05", area: "MAT", classe: 1, titolo: "Banco dei metalli", archetipo: "Banco prova",
  hook: "Ferro, alluminio, rame: dominano l'industria da migliaia di anni. Una calamita, il colore e un po' di calcolo bastano per riconoscerli e per capire perché i cavi elettrici sono di rame e le finestre di alluminio.",
  levels: [
    { brief: "Hai raccolto 8 oggetti metallici. Per ognuno leggi la prova della calamita e il colore, poi scegli il metallo più probabile.",
      blocks: [
        { type: "sort", categories: [["fe", "Acciaio o ghisa", "contiene ferro"], ["al", "Alluminio", "grigio argento, leggero"], ["cu", "Rame", "rosa-arancio"], ["ott", "Ottone", "giallo oro, lega di rame e zinco"]],
          items: [["Graffetta: attratta forte, grigia, pesante", "fe", "L'acciaio contiene ferro: è ferromagnetico."], ["Lattina di bibita: non attratta, grigia, leggerissima", "al", "Leggera e non magnetica: alluminio."], ["Filo dentro un cavo elettrico: non attratto, rosa-arancio", "cu", "Il rame è il miglior conduttore tra i metalli comuni."], ["Maniglia dorata: non attratta, giallo oro", "ott", "Il giallo oro non magnetico è tipico dell'ottone."], ["Chiave di casa: non attratta, giallo chiaro", "ott", "Molte chiavi sono in ottone: si lavora bene e non arrugginisce."], ["Vecchio tombino: attratto forte, grigio scuro", "fe", "La ghisa è una lega di ferro con molto carbonio."], ["Carta stagnola: non attratta, grigio argento", "al", "La «stagnola» da cucina in realtà è alluminio."], ["Chiodo: attratto forte, grigio", "fe", "Acciaio comune."]] },
        { type: "quiz", title: "Attenzione al cucchiaino", questions: [
          ["Un cucchiaino d'acciaio inossidabile non viene attratto dalla calamita. Allora…", ["non è acciaio", "potrebbe essere comunque acciaio inossidabile", "è sicuramente alluminio"], 1, "Alcuni inox (serie 300, come quelli delle posate) sono quasi non magnetici per la loro struttura cristallina. Il test della calamita separa bene, ma non è infallibile."]] } ],
      reflect: "Quale indizio è stato più affidabile: la calamita, il colore o il peso?" },
    { brief: "Usa i dati del libro per scegliere il metallo di un cavo elettrico. Cambia metallo, lunghezza e sezione: guarda resistenza, peso e costo.",
      blocks: [
        { type: "info", title: "I dati del libro", html: "<div class=\"scroll-x\"><table><thead><tr><th>Proprietà</th><th>Alluminio</th><th>Acciaio dolce</th><th>Rame</th></tr></thead><tbody><tr><td>Densità (g/cm³)</td><td class=\"mono\">2,7</td><td class=\"mono\">7,8</td><td class=\"mono\">8,9</td></tr><tr><td>Resistenza a trazione (MPa)</td><td class=\"mono\">90</td><td class=\"mono\">400</td><td class=\"mono\">210</td></tr><tr><td>Conduttività termica W/(m·K)</td><td class=\"mono\">237</td><td class=\"mono\">50</td><td class=\"mono\">385</td></tr><tr><td>Conduttività elettrica (MS/m)</td><td class=\"mono\">37</td><td class=\"mono\">10</td><td class=\"mono\">58</td></tr><tr><td>Costo relativo (€/kg, stima 2024)</td><td class=\"mono\">1,8</td><td class=\"mono\">0,7</td><td class=\"mono\">8,5</td></tr></tbody></table></div>" },
        { type: "sim", title: "Il cavo", params: [{ id: "m", label: "Metallo", options: [["cu", "Rame"], ["al", "Alluminio"], ["acc", "Acciaio dolce"]], value: "cu" }, { id: "L", label: "Lunghezza", min: 10, max: 500, step: 10, value: 100, unit: "m" }, { id: "A", label: "Sezione del filo", min: 1, max: 10, step: 0.5, value: 2.5, unit: "mm²" }],
          outputs: [{ key: "R", label: "Resistenza elettrica", f: (p) => p.L / (MET[p.m][4] * 1e6 * p.A * 1e-6), unit: "Ω", d: 2 }, { key: "kg", label: "Massa del filo", f: (p) => MET[p.m][1] * p.L * 100 * p.A * 0.01 / 1000, unit: "kg", d: 2 }, { key: "eur", label: "Costo del metallo", f: (p, o) => o.kg * MET[p.m][5], unit: "€", d: 2 }],
          challenges: [["Cavo di 200 m con resistenza sotto 1 Ω e massa sotto 6 kg", (p, o) => p.L === 200 && o.R < 1 && o.kg < 6, "Prova l'alluminio con una sezione più grande: conduce meno del rame, ma pesa un terzo.", "Per questo le linee dell'alta tensione usano l'alluminio."], ["Cavo di 100 m con resistenza sotto 0,5 Ω spendendo meno di 15 €", (p, o) => p.L === 100 && o.R < 0.5 && o.eur < 15, "Confronta rame e alluminio a parità di resistenza: guarda il costo.", "A parità di resistenza l'alluminio costa molto meno."]],
          note: (p, o) => p.m === "acc" ? ["warn", "L'acciaio conduce poco (10 MS/m): un cavo d'acciaio scalderebbe molto e sprecherebbe energia."] : null },
        { type: "quiz", title: "Calcola con la tabella", questions: [
          ["Resistenza specifica = resistenza a trazione ÷ densità. Quale metallo ha il valore più alto?", ["Alluminio", "Acciaio dolce", "Rame"], 1, "Alluminio 90 ÷ 2,7 ≈ 33; acciaio 400 ÷ 7,8 ≈ 51; rame 210 ÷ 8,9 ≈ 24. L'acciaio è il più resistente anche a parità di peso: per questo si usa nelle strutture."],
          ["Perché le padelle di qualità hanno la base in rame e il corpo in acciaio inox?", ["Il rame distribuisce il calore, l'acciaio resiste e costa meno", "Il rame è più leggero", "L'acciaio conduce meglio il calore"], 0, "Conduttività termica: rame 385, acciaio 50. Il rame scalda in modo uniforme; il resto in inox è robusto e più economico."]] } ],
      reflect: "Hai scoperto che il metallo «migliore» cambia con la domanda. Quale criterio decide per le finestre di un edificio?" },
    { label: "Scenario · 40 paline in centro storico", brief: "Le vecchie paline in acciaio non trattato sono arrugginite dopo 8 anni. Il capitolato chiede: 20 anni senza manutenzione straordinaria, pioggia e sale invernale (Comune a 800 m), resistenza a vento e urti, aspetto neutro, massimo 350 € a palina, buon riciclo a fine vita.",
      blocks: [
        { type: "compare", criteria: [["costo", "Costo"], ["corr", "Resistenza alla corrosione"], ["mecc", "Resistenza meccanica"], ["peso", "Leggerezza"], ["fine", "Fine vita"]],
          weights: { costo: 3, corr: 5, mecc: 3, peso: 1, fine: 2 },
          alts: [
            { name: "Acciaio verniciato (80 €)", v: { costo: 5, corr: 1, mecc: 5, peso: 2, fine: 3 } },
            { name: "Acciaio Corten (140 €)", v: { costo: 4, corr: 4, mecc: 5, peso: 2, fine: 5 } },
            { name: "Inox 316 (280 €)", v: { costo: 2, corr: 5, mecc: 5, peso: 2, fine: 5 } },
            { name: "Alluminio 6060 (160 €)", v: { costo: 4, corr: 4, mecc: 3, peso: 5, fine: 5 } },
            { name: "Alluminio anodizzato (190 €)", v: { costo: 3, corr: 5, mecc: 3, peso: 5, fine: 4 } },
            { name: "Robinia trattata (60 €)", v: { costo: 5, corr: 3, mecc: 3, peso: 3, fine: 4 } }],
          scale: "Punteggi da 1 a 5 ricavati dalla tabella del libro. Il libro ti chiede pesi che sommano a 100: qui i pesi vanno da 0 a 5, il principio è lo stesso.", notes: false,
          verdict: (sc, w) => w.corr < 3 ? ["warn", "Le vecchie paline sono state distrutte dalla ruggine: se la corrosione pesa poco, rischi di ripetere lo stesso errore."] : ["ok", `Vince <strong>${sc[0][0]}</strong>. Nella relazione confrontalo con almeno un'alternativa e scrivi come gestire il suo limite.`] } ],
      reflect: "Il materiale che hai scelto rispetta tutti i requisiti del capitolato, compreso il budget? Esiste una soluzione ibrida migliore?" }],
  bridge: "Scegli il materiale per una piccola libreria da muro: confronta 3 materiali in una tabella con almeno 4 criteri e giustifica la scelta.",
});
