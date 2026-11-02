LABENGINE.run({
  id: "MC-DIG-1-02", area: "DIG", classe: 1, titolo: "Detective delle fonti", archetipo: "Ispettore",
  hook: "Internet ha un sacco di informazioni, ma non tutte sono vere. Un buon detective non si fida del titolo: guarda chi scrive, quando, su quali prove, e controlla altrove.",
  footer: "Le pagine sono simulate: siti, autori e titoli sono inventati.",
  levels: [
    { brief: "Apri le tre pagine simulate e tocca gli elementi che ti aiutano a valutare l'affidabilità (in bene o in male). Poi decidi quanto ti fideresti.",
      blocks: [
        { type: "inspect", tags: { sito: "Nome del sito", aut: "Autore", data: "Data", fonti: "Fonti citate", tit: "Titolo sensazionale", tono: "Tono di parte" },
          docs: [
            { title: "Enciclopedia", sub: "it.enciclopedia-libera.org/wiki/Fotosintesi", parts: [["Enciclopedia libera", "sito"], " · Fotosintesi · ", ["ultima modifica: 3 marzo 2026", "data"], ". La fotosintesi è il processo con cui le piante trasformano luce, acqua e anidride carbonica in zuccheri e ossigeno. ", ["Note: [1] manuale universitario di botanica; [2] pagina didattica di un dipartimento universitario di biologia.", "fonti"]],
              verdict: ["Quanto ti fideresti?", ["Molto", "Abbastanza, ma controllo", "Poco"], 1], why: "Data, fonti e sito noto sono buoni segnali. Chiunque può modificare la pagina: controlla le note." },
            { title: "Notizia di cronaca", sub: "www.giornale-quotidiano.it/scienza/…", parts: [["Il Quotidiano Nazionale", "sito"], " · ", ["di Laura Bianchi", "aut"], " · ", ["12 ottobre 2026", "data"], ". Plastica riciclata: in Italia cresce la raccolta. Secondo ", ["il rapporto annuale del consorzio nazionale per gli imballaggi", "fonti"], ", la quantità raccolta è aumentata rispetto all'anno precedente."],
              verdict: ["Quanto ti fideresti?", ["Molto", "Abbastanza, ma controllo", "Poco"], 0], why: "Testata nota, autore, data e fonte dichiarata. Puoi comunque verificare il rapporto citato." },
            { title: "Sito di salute", sub: "www.salute-segreta-naturale.biz", parts: [["SALUTE SEGRETA", "sito"], " · ", ["I MEDICI NON VOGLIONO CHE TU LO SAPPIA: questa bevanda scioglie il grasso in 3 giorni!", "tit"], " Migliaia di persone l'hanno provata. ", ["Le grandi aziende farmaceutiche nascondono la verità.", "tono"], " Ordina subito il kit."],
              verdict: ["Quanto ti fideresti?", ["Molto", "Abbastanza, ma controllo", "Poco"], 2], why: "Nessun autore, nessuna data, nessuna fonte; titolo che punta all'emozione; e alla fine ti vende qualcosa." }] } ],
      reflect: "Quale segnale ti ha fatto dubitare per primo? L'avresti notato senza la lista?" },
    { brief: "Cerca meglio: scegli l'operatore giusto per ogni ricerca, poi metti in ordine le mosse del metodo SIFT.",
      blocks: [
        { type: "quiz", title: "Operatori di ricerca", questions: [
          ["Vuoi solo pagine di siti governativi italiani sulle energie rinnovabili.", ["energie rinnovabili site:gov.it", "\"energie rinnovabili\"", "energie rinnovabili -gov"], 0, "site: limita la ricerca a un dominio."],
          ["Vuoi la frase esatta «zucchero e salute dei ragazzi».", ["zucchero salute ragazzi", "\"zucchero e salute dei ragazzi\"", "zucchero OR salute"], 1, "Le virgolette cercano le parole in quell'ordine esatto."],
          ["Cerchi «riciclo plastica» ma senza risultati di negozi.", ["riciclo plastica -negozio", "riciclo plastica site:negozio", "\"riciclo plastica negozio\""], 0, "Il segno meno esclude una parola."]] },
        { type: "order", title: "Le quattro mosse SIFT", items: [["S · Fermati: che emozione ti provoca? Non condividere subito.", "Le notizie false puntano spesso su rabbia o paura."], ["I · Indaga sulla fonte: chi l'ha pubblicata? Che cosa sai di lei?", "Cerca il nome del sito o dell'autore."], ["F · Trova una copertura migliore: altre fonti affidabili dicono lo stesso?", "È la lettura laterale: apri altre schede."], ["T · Risali all'origine: da dove viene davvero l'informazione, la foto, la citazione?", "Spesso una foto vera è usata nel contesto sbagliato."]] } ],
      reflect: "Quale operatore userai la prossima volta che cerchi qualcosa per la scuola?" },
    { label: "Scenario · la redazione di fact-checking", brief: "Circola la storia «I delfini tornano nei canali di Venezia» (lockdown 2020). Il libro rivela che le immagini erano di Cagliari. Documenta l'analisi passo per passo, come per il blog della scuola.",
      blocks: [
        { type: "canvas", fields: [["s", "S · Che reazione ti ha suscitato la storia? Era pensata per farlo?", ""], ["i", "I · Chi l'ha diffusa per primo? Che cosa sai di questa fonte?", ""], ["f", "F · Che cosa dicono altre fonti affidabili?", "indica almeno due siti"], ["t", "T · Da dove vengono davvero le immagini?", ""], ["v", "Verdetto: vera, falsa o fuorviante? Perché?", ""]],
          checks: [["Tutte e 4 le mosse documentate", (v) => ["s", "i", "f", "t"].every((k) => v[k].length > 15)], ["Almeno due fonti indicate", (v) => (v.f.match(/http|www|\.it|\.org|\.com/gi) || []).length >= 2], ["Verdetto motivato", (v) => v.v.length > 30]],
          out: (v) => `ANALISI DI FACT-CHECKING\nStoria: «I delfini tornano nei canali di Venezia»\n\nS — ${v.s}\nI — ${v.i}\nF — ${v.f}\nT — ${v.t}\n\nVerdetto: ${v.v}` } ],
      reflect: "Una foto vera usata nel posto sbagliato è una notizia falsa? Come la chiameresti?" }],
  bridge: "Confronta 3 fonti sullo stesso argomento con il metodo SIFT: valutale, individua le differenze e scegli quella più affidabile, motivando la scelta.",
});
