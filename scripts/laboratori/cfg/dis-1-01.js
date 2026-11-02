LABENGINE.run({
  id: "MC-DIS-1-01", area: "DIS", classe: 1, titolo: "Riga e compasso", archetipo: "Tavolo grafico",
  hook: "Euclide costruiva figure perfette con un righello senza tacche e un compasso, 2.300 anni fa. Le stesse procedure funzionano ancora oggi. Il segreto è l'ordine dei passi.",
  levels: [
    { brief: "Rimetti in ordine i passi delle due costruzioni. Poi provale con le animazioni GeoGebra e sul tuo foglio.",
      blocks: [
        { type: "order", title: "Costruzione 1 · Perpendicolare a una retta r in un punto P", items: [["Punta in P: arco che taglia r in A e B", "Ora PA = PB."], ["Apri un po' di più il compasso. Punta in A: arco sopra la retta", "L'apertura deve superare metà di AB."], ["Stessa apertura, punta in B: altro arco, che incontra il primo in C", "Non cambiare apertura tra un arco e l'altro."], ["Unisci P e C con il righello", "PC è perpendicolare a r."]] },
        { type: "order", title: "Costruzione 2 · Bisettrice di un angolo con vertice O", items: [["Punta in O: arco che taglia i due lati in A e B", "Ora OA = OB."], ["Punta in A: arco all'interno dell'angolo", "Apertura maggiore di metà AB."], ["Stessa apertura, punta in B: arco che incontra il primo in C", ""], ["Unisci O e C: è la bisettrice", "Divide l'angolo in due parti uguali."]] },
        { type: "info", title: "Guarda le costruzioni animate", html: "<p><a href=\"/laboratori/perpendicolare/\" target=\"_top\">Perpendicolare con GeoGebra →</a><br><a href=\"/laboratori/bisettrice-angolo/\" target=\"_top\">Bisettrice con GeoGebra →</a></p>" } ],
      reflect: "Hai provato la perpendicolare sul foglio? Con la squadra, l'angolo era davvero di 90°?" },
    { brief: "Il disegno tecnico ha un vocabolario: ogni linea dice una cosa precisa. Classifica gli usi, poi rispondi sul perché le costruzioni funzionano.",
      blocks: [
        { type: "sort", categories: [["cg", "Continua grossa", "0,5-0,7 mm"], ["cf", "Continua fine", "0,25-0,35 mm"], ["tr", "Tratteggiata", "tratti di 3-5 mm"], ["mi", "Mista (tratto-punto)", "fine"]],
          items: [["Contorno visibile dell'oggetto", "cg", "I bordi che vedi guardando nella direzione del disegno."], ["Linee di quota", "cf", "Indicano le misure senza far parte del contorno."], ["Fondo di una scatola vista dall'alto", "tr", "Esiste ma non si vede: è un contorno nascosto."], ["Asse di simmetria di un oggetto", "mi", "Si usa per assi e centri."], ["Profilo esterno di un pezzo", "cg", "È il contorno principale."], ["Linee di costruzione rimaste nel disegno", "cf", "Ausiliarie: sottili per non confondersi con i contorni."], ["Centro di un foro", "mi", "Gli assi dei fori si indicano con la linea mista."]] },
        { type: "quiz", title: "Perché funziona?", questions: [
          ["Nella perpendicolare, i triangoli APC e BPC sono congruenti perché…", ["hanno tre lati uguali (LLL)", "hanno un angolo retto", "sono disegnati con il righello"], 0, "PA = PB, AC = BC (stessa apertura), PC in comune: caso lato-lato-lato."],
          ["I due angoli in P sono uguali e insieme fanno 180°. Quindi ciascuno misura…", ["45°", "90°", "180°"], 1, "180° ÷ 2 = 90°: la retta è perpendicolare."],
          ["Hai disegnato un angolo di 70° e la sua bisettrice. Misurando, devi trovare due angoli di…", ["70°", "35°", "140°"], 1, "La bisettrice divide l'angolo a metà: 35° ± 1° è accettabile."]] } ],
      reflect: "Perché è importante non cambiare l'apertura del compasso tra i due archi?" },
    { label: "Scenario · la pianta dell'astuccio", brief: "Devi disegnare pianta e vista frontale del tuo astuccio su un foglio A4 con cartiglio, applicando tutte le norme. Usa la lista di controllo mentre lavori.",
      blocks: [
        { type: "check", key: "tav", items: ["Ho misurato lunghezza, larghezza e altezza dell'oggetto", "Ho scelto una scala che lascia spazio a due viste e ai margini", "Ho tracciato il cartiglio 10 × 2,5 cm in basso a destra (titolo, scala, data, nome)", "I contorni visibili sono in linea continua grossa", "Le parti nascoste sono tratteggiate, iniziando e finendo con un tratto", "Gli assi di simmetria sono in linea mista", "Le linee di costruzione sono sottili (matita H)", "La vista frontale è allineata con la pianta"],
          result: (n, t) => n === t ? ["ok", "<strong>Tavola completa.</strong> Confrontala con un compagno: riconoscete le stesse linee?"] : ["warn", `${n} punti su ${t}. Completa quelli mancanti prima di consegnare.`] } ],
      reflect: "Quale norma ti è costata più attenzione? Perché credi che esista?" }],
  bridge: "Disegna in scala 1:20 la tua aula: misura le dimensioni reali, convertile in scala e riproduci la pianta su un foglio A4 con gli strumenti tecnici.",
});
