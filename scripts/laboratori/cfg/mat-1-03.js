LABENGINE.run({
  id: "MC-MAT-1-03", area: "MAT", classe: 1, titolo: "Materiali del futuro", archetipo: "Comparatore",
  hook: "I materiali tradizionali non bastano più: sono troppi, durano troppo o costano troppo al pianeta. Funghi, mais e vecchie bottiglie stanno diventando materiali nuovi. Ma un materiale innovativo è davvero più sostenibile?",
  levels: [
    { brief: "Tre materiali innovativi dal libro: PLA (bioplastica da mais), micelio di fungo e tessuto da bottiglie PET riciclate. Abbina ogni affermazione al materiale giusto.",
      blocks: [
        { type: "sort", categories: [["pla", "PLA", "bioplastica da mais"], ["mic", "Micelio", "filamenti di fungo su scarti agricoli"], ["rep", "Tessuto da PET riciclato", "fibra da bottiglie usate"]],
          items: [["Sostituisce il polistirolo nelle scatole", "mic", "È leggero e rigido: protegge gli oggetti negli imballaggi."], ["Si composta in 2-4 settimane", "mic", "È il suo vantaggio principale."], ["Teme l'umidità e costa ancora più del polistirolo", "mic", "Sono i suoi limiti principali."], ["È fatto con gli zuccheri del mais", "pla", "Gli zuccheri vengono fermentati e polimerizzati."], ["Si composta solo in un impianto industriale", "pla", "In casa o in natura non si biodegrada senza condizioni specifiche."], ["Si usa come filamento per la stampa 3D", "pla", "È una delle sue applicazioni più diffuse."], ["Risparmia il 45% di energia rispetto al poliestere vergine", "rep", "Riusa un materiale già prodotto invece di estrarre petrolio nuovo."], ["Al lavaggio rilascia microplastiche", "rep", "Come ogni tessuto sintetico."], ["Sembra identico al poliestere normale", "rep", "Chimicamente è lo stesso polimero."]] },
        { type: "quiz", title: "Quale materiale tradizionale sostituisce?", questions: [
          ["PLA", ["PET delle bottiglie", "Polistirolo", "Poliestere vergine"], 0, "È trasparente e rigido come il PET."],
          ["Micelio", ["PET delle bottiglie", "Polistirolo", "Poliestere vergine"], 1, "Leggero e protettivo, come il polistirolo espanso (EPS)."],
          ["Tessuto da bottiglie riciclate", ["PET delle bottiglie", "Polistirolo", "Poliestere vergine"], 2, "È poliestere ottenuto da PET già usato."]] } ],
      reflect: "Quale dei tre limiti ti sembra più difficile da risolvere? Perché?" },
    { brief: "Valuta la sostenibilità con tre domande per ogni fase: da dove viene la materia prima, come si produce, come finisce. Classifica ogni dato nella fase giusta, poi leggi il giudizio.",
      blocks: [
        { type: "sort", title: "Le tre fasi della valutazione", categories: [["mp", "Materia prima", "rinnovabile o esauribile?"], ["pr", "Produzione", "energia, sostanze pericolose"], ["fv", "Fine vita", "si ricicla? si biodegrada?"]],
          items: [["Il PHA è prodotto da batteri che si nutrono di zuccheri", "pr", "È un processo di fermentazione."], ["Gli aggregati riciclati vengono da edifici demoliti", "mp", "Il calcestruzzo usa scarti invece di ghiaia di cava."], ["Il PLA richiede un impianto di compostaggio industriale", "fv", "Se finisce nella plastica normale, la contamina."], ["Il mais del PLA occupa terreno agricolo", "mp", "Una materia prima rinnovabile non è per forza a impatto zero."], ["La fibra dai fondi di caffè usa uno scarto dei bar", "mp", "Valorizza un rifiuto."], ["Il cemento si cuoce in forni a temperature altissime", "pr", "Per questo produce molta CO₂."], ["Un tessuto misto non si separa a fine vita", "fv", "Le fibre diverse restano unite: il riciclo è quasi impossibile."]] },
        { type: "canvas", title: "La tua scheda di valutazione", fields: [["mat", "Materiale innovativo scelto", "PHA, calcestruzzo riciclato, tessuto da caffè"], ["trad", "Materiale tradizionale che sostituisce", ""], ["meglio", "È meglio in…", ""], ["peggio", "È peggio in…", ""], ["giud", "Il tuo giudizio: è davvero più sostenibile? In quali condizioni?", "4-6 righe"], ["fonti", "Due fonti affidabili (indirizzi)", "università, riviste scientifiche, organizzazioni ambientali"]],
          checks: [["Hai scritto un pregio e un difetto", (v) => v.meglio.length > 3 && v.peggio.length > 3], ["Il giudizio indica una condizione (se, quando, solo…)", (v) => /\b(se|quando|solo|purché|a patto)\b/i.test(v.giud)], ["Hai indicato due fonti", (v) => (v.fonti.match(/http|www|\.it|\.org|\.edu|\.com/gi) || []).length >= 2]],
          out: (v) => `SCHEDA DI VALUTAZIONE\nMateriale: ${v.mat}\nSostituisce: ${v.trad}\nMeglio in: ${v.meglio}\nPeggio in: ${v.peggio}\n\nGiudizio: ${v.giud}\n\nFonti: ${v.fonti}` } ],
      reflect: "Perché il libro ti chiede di evitare le fonti delle aziende che vendono quel materiale?" },
    { label: "Scenario · il succo per le mense", brief: "Un'azienda serve 300 succhi di mela al giorno a 5 mense scolastiche, oggi in tetrapak da 200 ml (circa 0,08 € l'uno, vuoto). Il nuovo imballaggio può costare al massimo il 30% in più. Pesa i criteri e confronta le tre alternative del libro.",
      blocks: [
        { type: "info", html: "<p>Budget massimo per unità: <strong class=\"mono\">0,08 € × 1,30 = 0,104 €</strong>. Il tetrapak unisce carta, plastica e alluminio: per riciclarlo bisogna separare gli strati.</p>" },
        { type: "compare", criteria: [["costo", "Costo entro il budget"], ["racc", "Compatibile con la differenziata delle scuole"], ["fine", "Fine vita reale (non teorico)"], ["mat", "Materia prima"]],
          alts: [
            { name: "Bottiglia rPET", v: { costo: 4, racc: 5, fine: 4, mat: 3 }, note: "Monomateriale, va nella plastica ed è molto riciclata; nasce comunque da petrolio, già usato una volta." },
            { name: "Bottiglia PLA", v: { costo: 3, racc: 1, fine: 2, mat: 4 }, note: "Compostabile solo in impianto industriale: nella plastica la contamina, nell'organico spesso non è accettata." },
            { name: "Vetro riutilizzabile (10 usi)", v: { costo: 2, racc: 3, fine: 5, mat: 4 }, note: "Va ritirato, lavato e riempito: serve un sistema di vuoto a rendere con la mensa." }],
          scale: "Punteggi indicativi da discutere: per il costo reale cerca i prezzi online, come chiede il libro.",
          verdict: (sc) => ["ok", `Con i tuoi pesi vince <strong>${sc[0][0]}</strong>. Nella relazione indica una condizione necessaria perché funzioni davvero (per esempio il sistema di raccolta del Comune).`] } ],
      reflect: "Un materiale «bio» è sempre la scelta migliore? Che cosa ti ha insegnato il caso del PLA?" }],
  bridge: "Progetta un packaging sostenibile per un prodotto alimentare: scegli il materiale, giustificalo con almeno 2 proprietà e confrontalo con l'imballaggio attuale.",
});
