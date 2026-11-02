const RIA = { R: ["Realistico", "fare con le mani, usare strumenti e macchine"], I: ["Investigativo", "capire come funzionano le cose, analizzare"], A: ["Artistico", "creare, immaginare, esprimersi"], S: ["Sociale", "aiutare, insegnare, prendersi cura"], E: ["Intraprendente", "guidare, convincere, avviare progetti"], C: ["Convenzionale", "organizzare, mettere ordine nei dati"] };
const ATT = [["Smontare e riparare una bicicletta", "R"], ["Costruire un prototipo in laboratorio", "R"], ["Capire perché un circuito non funziona", "I"], ["Analizzare i dati di un esperimento", "I"], ["Disegnare il logo per un evento", "A"], ["Montare un video o un podcast", "A"], ["Spiegare un esercizio a un compagno in difficoltà", "S"], ["Fare volontariato con i bambini", "S"], ["Organizzare una raccolta fondi per la classe", "E"], ["Presentare un progetto davanti a tutti", "E"], ["Tenere in ordine un archivio di file", "C"], ["Gestire la tabella dei turni o un bilancio", "C"]];
const PROF = { R: "Modellista e prototipista industriale 4.0, Microgrid system integrator, Drone logistic operator", I: "Data scientist, Machine learning engineer, Materials innovation engineer", A: "Product designer, Videomaker, Interaction designer", S: "Career coach e counselor di orientamento, Digital wellness advisor, AI-assisted educator", E: "Digital and innovation manager, Energy transition specialist, Smart city planner", C: "Data trust officer, Carbon footprint analyst, Privacy engineer" };
LABENGINE.run({
  id: "MC-SIS-3-04", area: "SIS", classe: 3, titolo: "Bussola delle professioni", archetipo: "Canvas",
  hook: "Megatrend come digitale, transizione energetica e invecchiamento della popolazione stanno cambiando il lavoro. Molte professioni di domani hanno un nome nuovo, ma si basano su interessi antichi: costruire, capire, creare, aiutare, guidare, organizzare.",
  footer: "Questa non è la versione ufficiale del test di Holland: è un'esplorazione rapida dei sei tipi RIASEC. Le professioni sono quelle citate nelle micro-competenze del libro.",
  levels: [
    { brief: "Le competenze trasversali contano quanto quelle tecniche. Negli annunci di lavoro, classifica che cosa viene richiesto.",
      blocks: [
        { type: "sort", categories: [["tec", "Competenza tecnica"], ["tra", "Competenza trasversale"]],
          items: [["Uso di software CAD", "tec", ""], ["Lavoro in gruppo", "tra", ""], ["Programmazione in Python", "tec", ""], ["Risoluzione dei problemi", "tra", ""], ["Conoscenza delle norme sulla sicurezza elettrica", "tec", ""], ["Comunicazione chiara con i clienti", "tra", ""], ["Imparare cose nuove in autonomia", "tra", "Con professioni che cambiano in fretta, è una delle più richieste."], ["Analisi dei dati con un foglio di calcolo", "tec", ""]] },
        { type: "quiz", questions: [["Perché nelle professioni STEM le ragazze sono ancora meno dei ragazzi?", ["Perché sono meno brave", "Per stereotipi, modelli che mancano e scelte orientate fin da piccoli: non per capacità", "Perché lo vogliono le aziende"], 1, "Le ricerche non mostrano differenze di capacità: contano aspettative e modelli. Conoscerlo aiuta a scegliere più liberamente."]] } ],
      reflect: "Quale competenza trasversale hai allenato di più nei laboratori di Tecnologia?" },
    { brief: "Spunta le attività che ti piacciono davvero, non quelle in cui vai meglio a scuola. Il profilo mostra quali dei sei tipi RIASEC prevalgono e le professioni del libro collegate.",
      blocks: [
        { type: "check", key: "ria", items: ATT.map((a) => a[0]),
          result: (n, t, c) => { const s = {}; Object.keys(RIA).forEach((k) => (s[k] = 0)); ATT.forEach(([, k], i) => { if (c[i]) s[k]++; }); const top = Object.entries(s).sort((a, b) => b[1] - a[1]).filter((x) => x[1] > 0).slice(0, 3);
            if (!top.length) return ["warn", "Spunta almeno tre attività per vedere il tuo profilo."];
            return ["ok", `<strong>Il tuo codice provvisorio: ${top.map((x) => x[0]).join("")}</strong><br>${top.map(([k]) => `<strong>${RIA[k][0]}</strong> (${RIA[k][1]}): ${PROF[k]}`).join("<br>")}`]; } } ],
      reflect: "Il risultato ti somiglia? Guarda anche il tipo opposto al tuo: c'è una professione che non avevi considerato?" },
    { label: "Scenario · il portfolio del triennio", brief: "Raccogli i lavori più significativi dei tre anni (almeno 5) e collega le competenze a possibili percorsi di studio. Non contano i voti più alti, ma i lavori in cui hai imparato di più.",
      blocks: [
        { type: "canvas", fields: [["lav", "5 lavori significativi (compiti di realtà, laboratori)", "una riga per lavoro"], ["comp", "Che competenze mostra ciascuno", ""], ["int", "Il tuo codice RIASEC e che cosa ne pensi", ""], ["perc", "Due percorsi di scuola superiore che vorresti esplorare, e perché", ""], ["dom", "Una domanda da fare a chi lavora nel settore che ti interessa", ""]],
          checks: [["Almeno 5 lavori", (v) => v.lav.split(/\n/).filter((x) => x.trim()).length >= 5], ["Due percorsi indicati", (v) => v.perc.split(/[\n;]|\be\b/).filter((x) => x.trim().length > 3).length >= 2]],
          out: (v) => `PORTFOLIO DELLE COMPETENZE\n\nLavori:\n${v.lav}\n\nCompetenze:\n${v.comp}\n\nProfilo: ${v.int}\n\nPercorsi da esplorare:\n${v.perc}\n\nDomanda per un professionista: ${v.dom}` } ],
      reflect: "Fra tre anni, che cosa vorresti aggiungere a questo portfolio?" }],
  bridge: "Analizza il packaging di 5 prodotti di casa: individua le certificazioni presenti, cerca che cosa significano sul sito dell'ente certificatore e valuta quali sono davvero utili.",
});
