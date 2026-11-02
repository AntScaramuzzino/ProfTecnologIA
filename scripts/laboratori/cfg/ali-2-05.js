LABENGINE.run({
  id: "MC-ALI-2-05", area: "ALI", classe: 2, titolo: "Packaging sotto la lente", archetipo: "Comparatore",
  hook: "L'imballaggio non è solo una scatola: protegge, conserva, informa, trasporta, vende. Ma quando è troppo, diventa lui il problema. Impara a leggerlo e a ridisegnarlo.",
  levels: [
    { brief: "Sugli imballaggi trovi sigle e numeri che indicano il materiale. Abbina ogni codice al materiale.",
      blocks: [
        { type: "sort", categories: [["pet", "Plastica PET"], ["hd", "Plastica HDPE"], ["pp", "Plastica PP"], ["pap", "Carta e cartone"], ["alu", "Alluminio"], ["gl", "Vetro"], ["comp", "Poliaccoppiato carta-plastica-alluminio"]],
          items: [["1 · PET", "pet", "Bottiglie d'acqua e bibite."], ["2 · HDPE", "hd", "Flaconi di detersivi e del latte."], ["5 · PP", "pp", "Vasetti dello yogurt, tappi."], ["20 · PAP", "pap", "Cartone ondulato."], ["41 · ALU", "alu", "Lattine e vaschette."], ["70 · GL", "gl", "Vetro incolore."], ["84 · C/PAP", "comp", "Il cartone per bevande: strati diversi da separare in impianto."]] },
        { type: "quiz", questions: [["Il simbolo con tre frecce che si inseguono (anello di Möbius) significa…", ["che l'imballaggio è già stato riciclato", "che il materiale è riciclabile, in teoria", "che va nella plastica"], 1, "Indica che il materiale si può riciclare, non che verrà riciclato né in quale contenitore va: per quello conta il regolamento del tuo Comune."]] } ],
      reflect: "Hai trovato un imballaggio senza simbolo? Come hai deciso dove buttarlo?" },
    { brief: "Due bottiglie d'acqua da 0,5 litri: una in PET, una in vetro. Pesa i criteri: quale è migliore dipende da come la usi.",
      blocks: [
        { type: "compare", criteria: [["peso", "Leggerezza (trasporto)"], ["ric", "Riciclo ripetibile"], ["en", "Poca energia per produrla"], ["nat", "Danno se dispersa nell'ambiente"], ["riuso", "Si può riusare"]],
          alts: [{ name: "PET 0,5 L", v: { peso: 5, ric: 3, en: 4, nat: 1, riuso: 1 }, note: "Leggera; il riciclo degrada un po' il materiale; nell'ambiente si frammenta in microplastiche." }, { name: "Vetro 0,5 L", v: { peso: 1, ric: 5, en: 2, nat: 3, riuso: 5 }, note: "Pesante; si ricicla senza perdere qualità; per fonderlo serve molta energia; si può lavare e riempire." }],
          scale: "Punteggi indicativi, da verificare con le ricerche che chiede il libro.",
          verdict: (sc, w) => w.riuso >= 4 ? ["ok", "Se la bottiglia di vetro viene riusata molte volte (vuoto a rendere), il suo peso e l'energia di produzione si dividono su tanti usi."] : ["ok", `Con i tuoi pesi vince <strong>${sc[0][0]}</strong>. Prova ad alzare il peso del riuso: cambia qualcosa?`] } ],
      reflect: "Ci sono situazioni in cui il PET è la scelta migliore? E altre in cui lo è il vetro?" },
    { label: "Scenario · i biscotti biologici", brief: "Oggi i biscotti stanno in una scatola di cartone plastificato, dentro un vassoio di plastica rigida, e ognuno degli 8 biscotti è avvolto nel cellophane. Il cliente vuole ridurre l'impatto del 50%, con la stessa durata di 12 mesi. Ridisegna la confezione.",
      note: "I pesi dei componenti sono valori d'esempio per un pacco da 200 g di biscotti: sostituiscili con quelli che misuri.",
      blocks: [
        { type: "sim", params: [{ id: "sc", label: "Scatola", options: [["pl", "Cartone plastificato (30 g)"], ["c", "Cartone semplice (25 g)"], ["no", "Nessuna scatola"]], value: "pl" }, { id: "va", label: "Vassoio", options: [["pl", "Plastica rigida (12 g)"], ["c", "Cartoncino (8 g)"], ["no", "Nessun vassoio"]], value: "pl" }, { id: "inc", label: "Incarto dei biscotti", options: [["sing", "8 incarti singoli (8 g)"], ["4", "2 sacchetti da 4 (4 g)"], ["uno", "Un sacchetto barriera unico (3 g)"]], value: "sing" }],
          outputs: [{ key: "g", label: "Peso dell'imballaggio", f: (p) => ({ pl: 30, c: 25, no: 0 }[p.sc] + { pl: 12, c: 8, no: 0 }[p.va] + { sing: 8, 4: 4, uno: 3 }[p.inc]), unit: "g" }, { key: "rid", label: "Riduzione rispetto a oggi", f: (p, o) => (1 - o.g / 50) * 100, unit: "%" }, { key: "mono", label: "Materiali da separare", f: (p) => [p.sc === "pl" ? "cartone plastificato" : p.sc === "c" ? "cartone" : null, p.va === "pl" ? "plastica rigida" : p.va === "c" ? "cartoncino" : null, "film plastico"].filter(Boolean).length }],
          bars: (p, o) => [["Oggi", 50], ["La tua proposta", o.g]], barsUnit: "g",
          note: (p, o) => p.sc === "no" ? ["warn", "Senza scatola i biscotti si rompono e non c'è spazio per le informazioni obbligatorie: la protezione è una funzione necessaria."] : o.rid >= 50 ? ["ok", `Hai ridotto il peso del ${LABENGINE.fmt(o.rid)}%. Controlla che il sacchetto mantenga i 12 mesi di durata: protegge da aria e umidità?`] : ["warn", `Riduzione del ${LABENGINE.fmt(o.rid)}%: non basta ancora per l'obiettivo del 50%.`] } ],
      reflect: "Quali funzioni della confezione erano davvero necessarie e quali erano over-packaging?" }],
  bridge: "Monitora gli sprechi alimentari in casa per una settimana: pesa o stima il cibo buttato ogni giorno, classificalo per tipo e proponi come ridurlo.",
});
