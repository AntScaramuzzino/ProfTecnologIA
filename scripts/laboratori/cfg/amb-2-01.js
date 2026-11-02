LABENGINE.run({
  id: "MC-AMB-2-01", area: "AMB", classe: 2, titolo: "Forze in gioco", archetipo: "Costruttore",
  hook: "Ogni edificio è una macchina per sopportare forze. Spaghetti e marshmallow bastano per scoprire perché il triangolo regge e il quadrato si piega, e perché in zona sismica non si costruisce come altrove.",
  levels: [
    { brief: "Quattro forze agiscono sulle strutture: compressione, trazione, flessione, taglio. Riconoscile negli esempi, poi rispondi sull'esperimento con gli spaghetti.",
      blocks: [
        { type: "sort", categories: [["com", "Compressione", "schiaccia"], ["tra", "Trazione", "tira"], ["fle", "Flessione", "piega"], ["tag", "Taglio", "fa scorrere"]],
          items: [["Una colonna che regge il tetto", "com", "Il peso spinge dall'alto verso il basso."], ["Il cavo di un ponte sospeso", "tra", "Il cavo è tirato alle due estremità."], ["Una mensola carica di libri", "fle", "Si incurva: sopra si comprime, sotto si allunga."], ["Le forbici che tagliano un foglio", "tag", "Due forze vicine e opposte fanno scorrere una parte rispetto all'altra."], ["La catena di un lampadario", "tra", ""], ["Una trave tra due muri con un carico al centro", "fle", ""], ["Le piramidi di Giza", "com", "Lavorano tutte in compressione: la pietra la sopporta benissimo."], ["Un bullone che unisce due lamiere tirate in direzioni opposte", "tag", ""]] },
        { type: "quiz", title: "L'esperimento: piramide contro colonna", questions: [
          ["Con il libro in cima, quale struttura regge meglio?", ["La piramide a triangoli", "La colonna di 4 spaghetti paralleli"], 0, "Il triangolo è l'unica figura che non si deforma se i lati non cambiano lunghezza: è indeformabile."],
          ["La colonna di spaghetti paralleli di solito cede perché…", ["gli spaghetti si spezzano per trazione", "gli spaghetti si inflettono di lato e il quadrato si deforma", "i marshmallow si sciolgono"], 1, "Un quadrilatero senza diagonali si trasforma in rombo: per questo nelle strutture si aggiungono i controventi diagonali."]] } ],
      reflect: "Dove hai visto dei triangoli in una struttura reale? Tralicci, gru, tetti, ponti…" },
    { brief: "Sfida: la struttura più alta con 20 spaghetti e 5 marshmallow che regga un libro per 10 secondi. Usa la scheda di progetto prima e dopo la prova.",
      blocks: [
        { type: "check", key: "prog", items: ["Ho disegnato il progetto su carta prima di costruire (5 minuti)", "Ho usato forme triangolari nella base", "Ho messo i nodi dove convergono più spaghetti", "La base è più larga della cima", "Ho annotato ogni modifica fatta durante la costruzione", "Ho misurato l'altezza con il libro appoggiato per 10 secondi", "Se è crollata, ho individuato il punto di cedimento"],
          result: (n, t) => n === t ? ["ok", "<strong>Scheda completa.</strong> Confronta la tua struttura con quella più alta della classe: che cosa aveva di diverso?"] : ["warn", `${n} punti su ${t}.`] },
        { type: "canvas", fields: [["h", "Altezza raggiunta (cm)", ""], ["forma", "Forma della struttura", "piramide, torre a traliccio…"], ["ced", "Dove ha ceduto (o dove stava per cedere) e quale forza agiva lì", ""], ["mod", "Che cosa cambieresti la prossima volta", ""]],
          checks: [["Hai collegato il cedimento a una delle quattro forze", (v) => /compress|trazion|flession|taglio/i.test(v.ced)]],
          out: (v) => `SCHEDA DI PROGETTO STRUTTURALE\nAltezza: ${v.h} cm\nForma: ${v.forma}\nCedimento: ${v.ced}\nMiglioramenti: ${v.mod}` } ],
      reflect: "La struttura più alta della classe era anche la più robusta? Che compromesso c'è tra altezza e stabilità?" },
    { label: "Scenario · scuola di 3 piani in zona sismica 2", brief: "Il progettista ti chiede di confrontare tre soluzioni strutturali per una nuova scuola. Pesa i criteri e prepara la relazione.",
      blocks: [
        { type: "compare", criteria: [["sism", "Comportamento sismico"], ["costo", "Costo basso"], ["sost", "Sostenibilità"], ["fless", "Flessibilità degli spazi interni"]],
          alts: [
            { name: "A · Muratura armata", v: { sism: 3, costo: 5, sost: 3, fless: 2 }, note: "Laterizio e barre d'acciaio. Resiste bene alla compressione, meno alla trazione. Costo basso." },
            { name: "B · Telaio in c.a. con controventi", v: { sism: 4, costo: 3, sost: 2, fless: 5 }, note: "Adatto alle zone sismiche; i controventi diagonali assorbono le forze laterali. Costo medio." },
            { name: "C · Legno CLT con isolatori alla base", v: { sism: 5, costo: 1, sost: 5, fless: 4 }, note: "Comportamento sismico eccellente, basso peso, sostenibile. Costo alto." }],
          scale: "Punteggi ricavati dalla tabella del libro.",
          verdict: (sc, w) => w.sism < 4 ? ["warn", "In zona sismica, per una scuola, il comportamento al terremoto dovrebbe pesare molto: ci sono bambini dentro."] : ["ok", `Vince <strong>${sc[0][0]}</strong>. Nella relazione spiega come la soluzione gestisce le forze laterali del sisma.`] },
        { type: "quiz", questions: [
          ["Come funziona l'isolamento sismico alla base?", ["Rende l'edificio più pesante", "Separa l'edificio dal terreno con appoggi che assorbono il movimento", "Blocca il terreno"], 1, "Gli isolatori si deformano al posto della struttura: l'edificio oscilla molto meno del suolo."],
          ["Perché il legno si comporta bene nei terremoti?", ["Perché è leggero e si piega senza crollare di schianto", "Perché non brucia", "Perché è economico"], 0, "La forza sismica cresce con la massa: un edificio leggero e duttile riceve e dissipa meno energia."]] } ],
      reflect: "Il costo più alto della soluzione C è giustificato per una scuola? Come lo spiegheresti al Comune?" }],
  bridge: "Costruisci la struttura più alta possibile con 20 spaghetti e 5 marshmallow che regga un libro per 10 secondi: documenta il processo, misura il risultato e spiega perché ha retto o ceduto.",
});
