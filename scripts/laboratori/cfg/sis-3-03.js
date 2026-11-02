LABENGINE.run({
  id: "MC-SIS-3-03", area: "SIS", classe: 3, titolo: "Business Model Canvas", archetipo: "Canvas",
  hook: "Un'impresa nasce da un problema reale e da qualcuno disposto a pagare per risolverlo. Il Business Model Canvas mette l'idea su un foglio in nove blocchi; il metodo Lean ti insegna a verificarla prima di spendere.",
  levels: [
    { brief: "I nove blocchi del Business Model Canvas. Metti ogni elemento di una startup di consegna della spesa a domicilio dai negozi del quartiere nel blocco giusto.",
      blocks: [
        { type: "sort", categories: [["cli", "Segmenti di clienti"], ["val", "Proposta di valore"], ["can", "Canali"], ["rel", "Relazione con i clienti"], ["ric", "Flussi di ricavi"], ["ris", "Risorse chiave"], ["att", "Attività chiave"], ["par", "Partner chiave"], ["cos", "Struttura dei costi"]],
          items: [["Anziani e famiglie con poco tempo", "cli", ""], ["La spesa dei negozi vicini a casa in 2 ore", "val", ""], ["App e numero di telefono", "can", ""], ["Assistenza via chat e fattorino sempre uguale", "rel", ""], ["5 € per ogni consegna", "ric", ""], ["L'app e la flotta di bici cargo", "ris", ""], ["Raccogliere gli ordini e consegnare", "att", ""], ["I negozi del quartiere", "par", ""], ["Stipendi dei fattorini e manutenzione dell'app", "cos", ""]] } ],
      reflect: "Quale blocco è il cuore di tutto? Perché si comincia di solito dalla proposta di valore e dai clienti?" },
    { brief: "Costruisci il canvas per un'idea tua, partendo da un problema reale che hai osservato. Il laboratorio controlla la coerenza fra i blocchi.",
      blocks: [
        { type: "canvas", fields: [["prob", "Il problema (osservato da te)", "es. i compagni non sanno dove comprare libri usati"], ["cli", "Segmenti di clienti", ""], ["val", "Proposta di valore", "come risolvi il problema meglio delle alternative"], ["can", "Canali", ""], ["ric", "Ricavi: chi paga e come", ""], ["cos", "Costi principali", ""], ["par", "Partner chiave", ""], ["ip", "Le 3 ipotesi più rischiose da verificare", "es. «i genitori pagherebbero 2 € a libro»"]],
          checks: [["Il problema è concreto (almeno 8 parole)", (v) => v.prob.split(/\s+/).length >= 8], ["Il cliente ha un nome preciso, non «tutti»", (v) => v.cli.length > 5 && !/^tutti/i.test(v.cli)], ["Chi paga è indicato", (v) => /\d|€|abbonament|commission|gratis|pubblicit/i.test(v.ric)], ["Tre ipotesi da testare", (v) => v.ip.split(/[\n;]/).filter((x) => x.trim()).length >= 3]],
          out: (v) => `BUSINESS MODEL CANVAS\n\nProblema: ${v.prob}\nClienti: ${v.cli}\nProposta di valore: ${v.val}\nCanali: ${v.can}\nRicavi: ${v.ric}\nCosti: ${v.cos}\nPartner: ${v.par}\n\nIpotesi da verificare:\n${v.ip}` } ],
      reflect: "Quale delle tue ipotesi, se fosse falsa, farebbe crollare tutto il progetto?" },
    { label: "Scenario · l'intervista di validazione", brief: "Devi intervistare tre persone del tuo segmento di clienti. La regola d'oro: non chiedere «ti piacerebbe la mia idea?» (rispondono quasi tutti sì per educazione). Chiedi dei loro comportamenti passati. Scegli le domande buone.",
      blocks: [
        { type: "sort", categories: [["buona", "Domanda utile"], ["cattiva", "Domanda da evitare"]],
          items: [["L'ultima volta che hai dovuto comprare un libro scolastico, come hai fatto?", "buona", "Racconta un comportamento reale."], ["Ti piacerebbe un'app per i libri usati?", "cattiva", "Invita a dire sì per gentilezza."], ["Quanto hai speso per i libri quest'anno?", "buona", ""], ["Pagheresti 5 € al mese per questo servizio fantastico?", "cattiva", "Suggerisce la risposta e chiede di prevedere il futuro."], ["Che cosa ti ha dato più fastidio in quella situazione?", "buona", "Fa emergere il problema vero."], ["Non pensi che sarebbe utile per tutti?", "cattiva", "È una domanda che cerca conferma."]] },
        { type: "canvas", fields: [["r", "Che cosa hai scoperto dalle 3 interviste", ""], ["conf", "Quali ipotesi sono confermate e quali smentite", ""], ["piv", "Che cosa cambi nel canvas", ""]],
          checks: [["Almeno un'ipotesi smentita o da rivedere", (v) => /smentit|sbagliat|no[, ]|cambi|rivede|non conferm/i.test(v.conf)]],
          out: (v) => `VALIDAZIONE\nRisultati: ${v.r}\nIpotesi: ${v.conf}\nModifiche al canvas: ${v.piv}` } ],
      reflect: "Il fallimento di un'ipotesi è una cattiva notizia o un'informazione preziosa? Perché il libro lo chiama «una risorsa»?" }],
  bridge: "Individua un problema reale della scuola o del quartiere che la tecnologia potrebbe risolvere e compila un Business Model Canvas semplificato della tua soluzione.",
});
