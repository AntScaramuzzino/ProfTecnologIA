LABENGINE.run({
  id: "MC-MAT-1-01", area: "MAT", classe: 1, titolo: "Banco dei materiali", archetipo: "Banco prova",
  hook: "Tutto ha un materiale, e ogni materiale ha una storia. Prima di scegliere di che cosa fare un oggetto, un tecnico osserva, tocca e prova. Qui fai lo stesso con le sei famiglie di materiali.",
  levels: [
    { brief: "Ogni oggetto della tua cartella è fatto soprattutto di un materiale. Tocca un oggetto, poi la famiglia a cui appartiene la sua parte principale.",
      note: "Se un oggetto ha più materiali, scegli quello della parte che fa il lavoro: per le forbici, le lame.",
      blocks: [
        { type: "sort", categories: [["legno", "Legno", "dal tronco degli alberi"], ["met", "Metalli", "lucidi, freddi al tatto"], ["pla", "Plastiche", "dal petrolio, leggere"], ["cer", "Ceramiche e vetro", "dure, fragili"], ["tes", "Tessuti", "fibre intrecciate"], ["comp", "Compositi", "più materiali uniti"]],
          items: [["Matita", "legno", "Il corpo della matita è in legno dolce, facile da temperare."], ["Lame delle forbici", "met", "L'acciaio è duro e resta affilato."], ["Righello trasparente", "pla", "Plastica rigida: trasparente e leggera."], ["Tazza", "cer", "La ceramica è dura, isolante e resiste al calore, ma è fragile."], ["Felpa", "tes", "Fibre intrecciate: morbide e flessibili."], ["Gomma da cancellare", "pla", "Le gomme moderne sono in plastica morbida o gomma sintetica."], ["Finestra", "cer", "Il vetro è trasparente e duro, ma si rompe con un urto."], ["Telaio di una bici da corsa in carbonio", "comp", "Fibre di carbonio in una resina: leggerezza del polimero e resistenza della fibra insieme."], ["Moneta", "met", "Le monete sono leghe metalliche: dure e durature."], ["Zaino", "tes", "Tessuto sintetico robusto, spesso impermeabilizzato."], ["Banco di scuola (piano)", "legno", "Spesso è un pannello derivato dal legno, come il truciolato."], ["Casco da bici", "comp", "Guscio in plastica e interno in polistirolo espanso: due materiali con compiti diversi."]] },
        { type: "quiz", title: "Naturale o artificiale?", questions: [
          ["Il legno di una matita è…", ["naturale", "artificiale"], 0, "Esiste in natura: viene dagli alberi. La lavorazione non lo rende artificiale."],
          ["La plastica del righello è…", ["naturale", "artificiale"], 1, "È creata dall'industria a partire dal petrolio: in natura non esiste."],
          ["Il vetro della finestra è…", ["naturale", "artificiale"], 1, "Si fa fondendo sabbia e altri minerali: le materie prime sono naturali, il vetro è artificiale."]] } ],
      reflect: "Quale proprietà hai usato di più per riconoscere i materiali: l'aspetto, il peso o la sensazione al tatto?" },
    { brief: "Fai i tre test del libro su materiali diversi, prima facendo una previsione. Scegli il risultato che ti aspetti, poi leggi che cosa succede davvero.",
      blocks: [
        { type: "quiz", title: "Test 1 · Durezza: strofini il bordo di una moneta", questions: [
          ["Sul legno di pino resta un segno?", ["Sì, resta un segno", "No, nessun segno"], 0, "Il pino è un legno dolce: la moneta è più dura e lo segna."],
          ["Sul vetro di un barattolo resta un segno?", ["Sì, resta un segno", "No, nessun segno"], 1, "Il vetro è più duro della moneta: non si riga."],
          ["Sulla plastica morbida di una bottiglia resta un segno?", ["Sì, resta un segno", "No, nessun segno"], 0, "Le plastiche morbide si rigano facilmente."]] },
        { type: "quiz", title: "Test 2 · Impermeabilità: tre gocce d'acqua per 20 secondi", questions: [
          ["Sul cartone l'acqua…", ["forma gocce che scivolano", "si allarga e viene assorbita", "resta ferma in superficie"], 1, "La carta è idrofila: le fibre assorbono l'acqua."],
          ["Sulla plastica di un astuccio l'acqua…", ["forma gocce che scivolano", "si allarga e viene assorbita", "resta ferma in superficie"], 0, "La plastica è impermeabile (idrofoba): l'acqua forma gocce tonde."],
          ["Sul legno grezzo, non verniciato, l'acqua…", ["forma gocce che scivolano", "viene assorbita lentamente", "rimbalza via"], 1, "Il legno è poroso: assorbe l'umidità. Per questo all'esterno si vernicia."]] },
        { type: "quiz", title: "Test 3 · Conduttività: tieni l'oggetto in mano per 30 secondi", questions: [
          ["Tutti gli oggetti sono nella stessa stanza. Perché il metallo sembra più freddo del legno?", ["Perché è davvero più freddo", "Perché porta via il calore della mano più in fretta", "Perché il legno produce calore"], 1, "Sono alla stessa temperatura. Il metallo è un buon conduttore: sottrae calore alla pelle velocemente, e lo senti come freddo."],
          ["Dopo 30 secondi, quale oggetto si è scaldato alla temperatura della mano?", ["Il cucchiaino di metallo", "Il righello di plastica"], 1, "La plastica è un isolante: il calore resta in superficie e la scalda presto. Il metallo lo distribuisce in tutto l'oggetto."]] } ],
      reflect: "Hai ottenuto un risultato diverso dalla tua previsione? Quale, e come lo spieghi?" },
    { label: "Scenario · le panchine del parco", brief: "Il Comune deve sostituire 200 panchine di legno trattato, rovinate dopo 12 anni. Vuole che durino almeno 25 anni, resistano al tempo, inquinino poco e chiedano poca manutenzione, con un budget fisso. Pesa i criteri come pensi sia giusto e guarda quale materiale vince.",
      blocks: [
        { type: "compare", criteria: [["costo", "Costo basso"], ["durata", "Durata"], ["manut", "Poca manutenzione"], ["amb", "Impatto ambientale basso"]],
          alts: [
            { name: "Pino trattato", v: { costo: 5, durata: 1, manut: 1, amb: 4 }, note: "Durata 10-15 anni; va verniciato ogni 2-3 anni. Naturale e rinnovabile." },
            { name: "Acciaio inox", v: { costo: 1, durata: 5, manut: 4, amb: 4 }, note: "Durata oltre 30 anni; riciclabile al 100%." },
            { name: "Plastica riciclata (HDPE)", v: { costo: 3, durata: 5, manut: 5, amb: 3 }, note: "Durata 25-50 anni; nasce da rifiuti ma è difficile riciclarla di nuovo." },
            { name: "Cemento con aggregati riciclati", v: { costo: 5, durata: 5, manut: 5, amb: 1 }, note: "Durata oltre 50 anni; molta CO₂ in produzione, difficile da riciclare." }],
          scale: "Punteggi da 1 a 5 ricavati dalla tabella del libro (costo, durata, manutenzione, origine e fine vita). Puoi discuterli in classe.",
          verdict: (sc, w) => w.durata < 3 ? ["warn", "Il Comune chiede almeno 25 anni: se la durata pesa poco, rischi di proporre un materiale che non rispetta la richiesta."] : ["ok", `Con i tuoi pesi vince <strong>${sc[0][0]}</strong>. Nella relazione scrivi anche il suo limite principale.`] },
        { type: "canvas", fields: [["scelta", "Materiale che proponi", "es. plastica riciclata"], ["ragioni", "Tre ragioni, usando le proprietà", "durabilità, impermeabilità…"], ["limite", "Un limite che il Comune deve considerare", ""]],
          checks: [["Hai indicato un materiale", (v) => v.scelta.length > 2], ["Le ragioni usano almeno una proprietà (durevole, impermeabile, resistente…)", (v) => /durev|imperme|resist|isolant|ricicl|rinnov|manuten/i.test(v.ragioni)], ["Hai scritto un limite", (v) => v.limite.length > 10]],
          out: (v) => `Relazione tecnica per il Comune\n\nProposta: ${v.scelta || "[materiale]"}\n\nMotivazioni: ${v.ragioni || "[tre ragioni]"}\n\nLimite da considerare: ${v.limite || "[limite]"}` } ],
      reflect: "Esiste un materiale fuori da questa lista che potrebbe fare meglio? Che cosa cercheresti online per scoprirlo?" }],
  bridge: "Analizza 5 oggetti di casa: per ognuno trova la materia prima principale, una proprietà che lo rende adatto alla sua funzione e come va smaltito.",
});
