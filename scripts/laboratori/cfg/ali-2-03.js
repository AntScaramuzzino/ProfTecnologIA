// valori per 100 g dalla tabella del testo: [kcal, proteine, grassi, carboidrati, fibre]
const NUT = { pasta: ["Pasta cotta", 125, 5, 0.5, 26, 1.5], pane: ["Pane integrale", 240, 9, 2, 48, 7], pollo: ["Petto di pollo", 165, 31, 4, 0, 0], salm: ["Salmone", 180, 20, 11, 0, 0], latte: ["Latte intero", 62, 3.2, 3.5, 5, 0], mela: ["Mela", 52, 0.3, 0.2, 14, 2.4], broc: ["Broccoli cotti", 28, 2.8, 0.4, 5, 3.3], olio: ["Olio d'oliva", 884, 0, 100, 0, 0], bibita: ["Bibita gassata", 42, 0, 0, 11, 0], pat: ["Patatine fritte", 536, 4, 35, 53, 3] };
const tot = (p) => { const t = { k: 0, pr: 0, gr: 0, ca: 0, fi: 0 }; Object.keys(NUT).forEach((k) => { const g = p[k] / 100, n = NUT[k]; t.k += n[1] * g; t.pr += n[2] * g; t.gr += n[3] * g; t.ca += n[4] * g; t.fi += n[5] * g; }); return t; };
LABENGINE.run({
  id: "MC-ALI-2-03", area: "ALI", classe: 2, titolo: "Il piatto equilibrato", archetipo: "Calcolatore",
  hook: "Mangiare è chimica, e la tecnologia la controlla. La dieta mediterranea è patrimonio UNESCO perché bilancia gruppi di alimenti diversi. Qui impari a riconoscerli e a leggere i numeri di una giornata.",
  footer: "Si lavora su giornate d'esempio, non sui tuoi dati personali. Il fabbisogno di ognuno dipende da età, crescita e attività: per indicazioni personali ci si rivolge al medico.",
  levels: [
    { brief: "Ecco la giornata di Sara (personaggio d'esempio). Classifica ogni alimento nel suo gruppo, come sulla piramide mediterranea.",
      blocks: [
        { type: "sort", categories: [["cer", "Cereali e derivati"], ["fv", "Frutta e verdura"], ["leg", "Legumi"], ["prot", "Carne, pesce, uova"], ["lat", "Latte e derivati"], ["gra", "Grassi e condimenti"], ["dol", "Dolci e bibite zuccherate"]],
          items: [["Fette biscottate (colazione)", "cer", "Derivano dal grano."], ["Latte (colazione)", "lat", ""], ["Mela (spuntino)", "fv", ""], ["Pasta e ceci (pranzo)", "leg", "I ceci sono legumi: proteine vegetali e fibre. La pasta è un cereale."], ["Olio d'oliva sull'insalata", "gra", "È il grasso tipico della dieta mediterranea."], ["Insalata", "fv", ""], ["Succo di frutta zuccherato (merenda)", "dol", "Anche se c'è frutta, gli zuccheri aggiunti lo rendono simile a una bibita."], ["Merluzzo al forno (cena)", "prot", ""], ["Pane (cena)", "cer", ""], ["Yogurt", "lat", ""]] },
        { type: "quiz", questions: [["Nella giornata di Sara, quale gruppo compare una volta sola e potrebbe esserci più spesso?", ["Cereali", "Frutta e verdura", "Grassi"], 1, "Mela e insalata: le linee guida suggeriscono frutta e verdura a ogni pasto."]] } ],
      reflect: "Nella piramide mediterranea, quali gruppi stanno alla base e quali in cima? Perché?" },
    { brief: "Nel diario di 3 giorni conta quante volte compare ogni gruppo. Qui c'è il conteggio dei 3 giorni di Luca (personaggio d'esempio). Leggi il grafico e rispondi.",
      blocks: [
        { type: "chart", kind: "bar", toggles: false, d: 0, xlabel: "gruppo", ylabel: "volte in 3 giorni",
          series: [{ name: "Luca", data: [["Cereali", 9], ["Frutta", 2], ["Verdura", 3], ["Legumi", 0], ["Carne", 5], ["Pesce", 1], ["Latticini", 5], ["Dolci e bibite", 6]] }] },
        { type: "quiz", questions: [
          ["Quale gruppo manca del tutto?", ["Pesce", "Legumi", "Frutta"], 1, "Zero legumi in 3 giorni: sono una fonte di proteine vegetali e fibre."],
          ["Dolci e bibite compaiono 6 volte, la frutta 2. Che cosa suggeriresti a Luca, in modo concreto?", ["Smetti di mangiare dolci", "A merenda, alterna la bibita con un frutto o uno yogurt", "Mangia meno"], 1, "Una raccomandazione utile è specifica, fattibile e non punitiva."],
          ["Il giorno festivo spesso è diverso dagli altri. Perché il diario chiede un giorno di festa?", ["Per avere un quadro realistico della settimana", "Perché a scuola si mangia male", "Non serve"], 0, "Le abitudini cambiano con orari e compagnia: un solo giorno non basta."]] } ],
      reflect: "Guardando il tuo diario: che cosa ti ha sorpreso? Hai mangiato di fretta o in compagnia, e ha cambiato qualcosa?" },
    { label: "Scenario · il nutrizionista in formazione", brief: "Analizza una giornata d'esempio con i valori per 100 g della tabella del libro. Cambia le quantità e confronta la distribuzione delle calorie con le indicazioni LARN riportate dal testo: carboidrati 45-60%, grassi 20-35%, proteine 10-15%.",
      blocks: [
        { type: "sim", params: Object.entries(NUT).map(([k, n]) => ({ id: k, label: n[0], min: 0, max: k === "olio" ? 50 : k === "bibita" ? 660 : k === "latte" ? 500 : 300, step: k === "olio" ? 5 : 10, value: { pasta: 200, pane: 80, pollo: 120, salm: 0, latte: 250, mela: 150, broc: 150, olio: 25, bibita: 330, pat: 0 }[k], unit: "g" })),
          presets: [["Giorno scolastico", { pasta: 200, pane: 80, pollo: 120, salm: 0, latte: 250, mela: 150, broc: 150, olio: 25, bibita: 0, pat: 0 }], ["Sabato al fast food", { pasta: 0, pane: 120, pollo: 0, salm: 0, latte: 0, mela: 0, broc: 0, olio: 10, bibita: 660, pat: 200 }]],
          outputs: [{ key: "k", label: "Calorie totali", f: (p) => tot(p).k, unit: "kcal" }, { key: "c", label: "Da carboidrati", f: (p) => { const t = tot(p); return t.k ? (t.ca * 4 / t.k) * 100 : 0; }, unit: "%" }, { key: "g", label: "Da grassi", f: (p) => { const t = tot(p); return t.k ? (t.gr * 9 / t.k) * 100 : 0; }, unit: "%" }, { key: "pr", label: "Da proteine", f: (p) => { const t = tot(p); return t.k ? (t.pr * 4 / t.k) * 100 : 0; }, unit: "%" }, { key: "fi", label: "Fibre", f: (p) => tot(p).fi, unit: "g", d: 1 }],
          bars: (p, o) => [["Carboidrati", o.c], ["Grassi", o.g], ["Proteine", o.pr]], barsMax: 100, barsUnit: "%", barsTitle: "Da dove vengono le calorie",
          note: (p, o) => { const f = []; if (o.c < 45) f.push("carboidrati sotto il 45%"); if (o.c > 60) f.push("carboidrati sopra il 60%"); if (o.g > 35) f.push("grassi sopra il 35%"); if (o.g < 20) f.push("grassi sotto il 20%"); if (o.pr < 10) f.push("proteine sotto il 10%"); if (o.pr > 15) f.push("proteine sopra il 15%"); return f.length ? ["warn", "Lontano dalle indicazioni: " + f.join(", ") + ". Formula una raccomandazione specifica, come sostituire metà delle patatine con verdure al forno."] : ["ok", "La distribuzione è dentro gli intervalli indicati dal testo."]; } } ],
      reflect: "Il fabbisogno cambia con l'attività fisica. Come cambierebbe l'analisi per chi fa due ore di sport il sabato?" }],
  bridge: "Tieni un diario alimentare per 3 giorni: annota ciò che mangi, classificalo per gruppi alimentari e valuta se la dieta è equilibrata rispetto alla piramide mediterranea.",
});
