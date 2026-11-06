LABENGINE.run({
  id: "MC-ALI-2-06", area: "ALI", classe: 2, titolo: "Il comitato del cibo futuro", archetipo: "Scenario",
  hook: "La tecnologia al servizio del cibo non è una novità: il pane lievitato e il formaggio lo sono da millenni. Oggi le novità si chiamano vertical farm, farina di grillo, carne coltivata. Vanno valutate con la testa, non con la pancia.",
  levels: [
    { brief: "Ogni tecnologia del libro risponde a un problema. Abbina la tecnologia al problema che vuole risolvere.",
      blocks: [
        { type: "sort", categories: [["acq", "Usare meno acqua e suolo"], ["prot", "Trovare nuove fonti di proteine"], ["trac", "Sapere da dove viene il cibo"], ["prec", "Usare meno concimi e pesticidi"]],
          items: [["Vertical farming: coltivare su più piani al chiuso", "acq", "Le piante crescono in verticale, spesso senza terra e con acqua ricircolata."], ["Farina di insetti", "prot", "Gli insetti trasformano il mangime in proteine in modo efficiente."], ["Carne coltivata da cellule", "prot", "Produce carne senza allevare l'animale intero."], ["QR code e blockchain sulla confezione", "trac", "Registrano ogni passaggio della filiera."], ["Agricoltura di precisione con sensori e droni", "prec", "Si dà acqua e concime solo dove serve."], ["Fermentazione di precisione", "prot", "Microrganismi producono proteine come quelle del latte."]] },
        { type: "sort", title: "Tecnologia antica o recente?", categories: [["ant", "Esiste da secoli"], ["new", "Recente"]],
          items: [["Fermentazione del formaggio", "ant", "Una delle più antiche tecnologie alimentari."], ["Stampa 3D di alimenti", "new", ""], ["Essiccazione al sole", "ant", ""], ["Tracciabilità con blockchain", "new", ""]] } ],
      reflect: "Ti aspettavi che la fermentazione fosse una tecnologia? Perché la chiamiamo così?" },
    { brief: "Confronta un hamburger di manzo con uno di micoproteina o di farina di grillo. Raccogli i dati dalle fonti indicate dal libro (siti dei produttori, studi universitari, rapporti FAO) e compila la scheda.",
      blocks: [
        { type: "canvas", fields: [["alt", "Alternativa scelta", "micoproteina o farina di grillo"], ["prot", "Proteine per 100 g (manzo / alternativa)", ""], ["co2", "CO₂ equivalente per 100 g (manzo / alternativa)", ""], ["acq", "Acqua (litri) e terra (m²) per 100 g", ""], ["fonti", "Fonti di ogni dato", "nome dell'ente o dello studio, indirizzo"], ["giu", "Quale ha l'impatto minore? Su quale criterio la differenza è più grande?", ""]],
          checks: [["Valori numerici per proteine e CO₂", (v) => /\d/.test(v.prot) && /\d/.test(v.co2)], ["Almeno due fonti", (v) => (v.fonti.match(/http|www|\.org|\.it|\.com|FAO|universit/gi) || []).length >= 2], ["Hai notato chi ha pubblicato il dato", (v) => /aziend|produttor|indipendent|universit|FAO/i.test(v.fonti)]],
          out: (v) => `Confronto: hamburger di manzo vs ${v.alt}\nProteine: ${v.prot}\nCO₂: ${v.co2}\nAcqua e terra: ${v.acq}\nFonti: ${v.fonti}\n\nGiudizio: ${v.giu}` },
        { type: "quiz", questions: [["Un dato ambientale pubblicato sul sito dell'azienda che vende il prodotto…", ["è falso", "va confrontato con fonti indipendenti", "è sempre il più affidabile"], 1, "Non è per forza sbagliato, ma l'azienda ha interesse a mostrarsi bene: cerca una conferma indipendente."]] } ],
      reflect: "Su quale criterio l'alternativa è peggiore del manzo? Hai trovato un dato che non ti aspettavi?" },
    { label: "Scenario · il comitato etico della scuola", brief: "Un'azienda food-tech propone tre prodotti per la mensa. Il comitato vota uno per uno. Le scelte cambiano tre indicatori: sicurezza, ambiente, fiducia delle famiglie.",
      blocks: [
        { type: "scenario", meters: [["sic", "Sicurezza", 6], ["amb", "Ambiente", 5], ["fid", "Fiducia delle famiglie", 6]],
          nodes: {
            start: { t: "<strong>Prodotto 1 · Pasta con il 5% di farina di grillo.</strong> Nell'Unione Europea la polvere di grillo parzialmente sgrassata è autorizzata come nuovo alimento. Chi è allergico a crostacei o acari potrebbe reagire.",
              c: [["Approvo così com'è", "p2", { amb: 2, sic: -2, fid: -2 }, ["warn", "L'ambiente ci guadagna, ma senza informare le famiglie sugli allergeni rischi la sicurezza e la fiducia."]], ["Approvo con etichetta chiara degli allergeni e un menu alternativo", "p2", { amb: 2, sic: 1, fid: 1 }, ["ok", "Informare e lasciare scegliere è la strada che tiene insieme sicurezza e fiducia."]], ["Rinvio: prima un assaggio facoltativo e un incontro con le famiglie", "p2", { fid: 2, amb: 0 }, ["ok", "Più lento, ma costruisce fiducia."]]] },
            p2: { t: "<strong>Prodotto 2 · Insalata da vertical farm indoor certificata.</strong> Cresce al chiuso con poca acqua e senza pesticidi, ma usa molta energia elettrica per le luci.",
              c: [["Approvo", "p3", { amb: 1, sic: 1 }, ["ok", "Bene, se l'energia viene da fonti rinnovabili: è la domanda da fare al fornitore."]], ["Preferisco l'insalata di un'azienda agricola vicina", "p3", { amb: 1, fid: 1 }, ["ok", "Filiera corta e stagionalità sono un'alternativa valida, almeno in parte dell'anno."]]] },
            p3: { t: "<strong>Prodotto 3 · Hamburger di pollo da carne coltivata.</strong> Nello scenario la propone l'azienda. Ma in Italia la legge n. 172 del 2023 vieta di produrre e vendere carne coltivata, e nell'UE dovrebbe prima essere autorizzata come nuovo alimento dopo la valutazione dell'EFSA.",
              c: [["Approvo", "end1", { sic: -3, fid: -3 }, ["ko", "Nella realtà italiana non si potrebbe: un comitato deve verificare prima le regole in vigore."]], ["Non posso approvarlo: verifico le norme e chiedo il parere dell'autorità sanitaria", "end2", { sic: 2, fid: 1 }, ["ok", "È la decisione corretta: prima le regole e la sicurezza, poi il dibattito."]]] },
            end1: { t: "Il comitato ha chiuso il voto. Rileggi gli indicatori: dove avete perso di più?", end: "<strong>Votazione conclusa.</strong> Ricomincia e prova a tenere alti tutti e tre gli indicatori.", kind: "warn" },
            end2: { t: "Il comitato ha chiuso il voto con una relazione motivata per ogni prodotto.", end: "<strong>Votazione conclusa.</strong> Scrivi la relazione: sicurezza, ambiente, impatto sociale e accettazione per ogni prodotto." } } } ],
      reflect: "Quale prodotto è stato più difficile da valutare? Che informazione ti mancava per decidere?" }],
  bridge: "Intervista un familiare o un anziano su un piatto tradizionale: documenta la ricetta, gli ingredienti locali e la tecnologia che usavano per prepararlo e conservarlo.",
});
