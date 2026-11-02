const pre = (s) => `<pre class="out" style="font-family:var(--mono);font-size:14px">${s}</pre>`;
LABENGINE.run({
  id: "MC-DIG-2-01", area: "DIG", classe: 2, titolo: "Caccia al bug in Scratch", archetipo: "Programmatore",
  hook: "Prima del codice viene il pensiero computazionale. In Scratch costruisci un quiz con i blocchi, ma i blocchi devono stare nell'ordine giusto, e le variabili vanno azzerate. Qui leggi gli script come un programmatore e trovi i bug prima del gatto.",
  levels: [
    { brief: "Ricostruisci lo script del mini-quiz: il gatto saluta, fa la domanda, controlla la risposta con SE… ALTRIMENTI.",
      blocks: [
        { type: "order", items: [["quando si clicca sulla bandiera verde", "Ogni script parte da un evento."], ["dire «Benvenuto al quiz!» per 2 secondi", ""], ["chiedi «Quale macronutriente dà più energia per grammo?» e attendi", "Il blocco «chiedi e attendi» salva quello che scrivi in «risposta»."], ["se risposta = «grassi» allora: dire «Esatto! 9 kcal per grammo»", "La condizione confronta la risposta con quella corretta."], ["altrimenti: dire «No, la risposta è grassi»", ""]] },
        { type: "sort", title: "Che struttura è?", categories: [["seq", "Sequenza"], ["sel", "Selezione"], ["cic", "Ciclo"], ["ev", "Evento"]],
          items: [["quando si clicca sulla bandiera verde", "ev", "Avvia lo script quando succede qualcosa."], ["se … allora … altrimenti", "sel", ""], ["ripeti 5 volte", "cic", ""], ["dire … poi chiedi … poi dire …", "seq", "Azioni una dopo l'altra."], ["quando ricevo «fine quiz»", "ev", "È il broadcast: un messaggio fra sprite."], ["ripeti fino a quando punteggio = 5", "cic", ""]] } ],
      reflect: "Che cosa succede se lo studente scrive «Grassi» con la maiuscola? Come lo verificheresti?" },
    { brief: "Ogni script ha un bug. Leggilo e scegli la correzione giusta.",
      blocks: [
        { type: "quiz", questions: [
          [pre("quando si clicca sulla bandiera verde\nripeti 5 volte\n  chiedi (elemento n di domande)\n  se risposta = (elemento n di risposte)\n    cambia punteggio di 1") + "Al secondo giro il punteggio parte da quello della partita precedente. Perché?", ["Manca «porta punteggio a 0» all'inizio", "Il ciclo è troppo corto", "La lista è vuota"], 0, "Le variabili ricordano l'ultimo valore: vanno azzerate all'avvio."],
          [pre("porta n a 1\nripeti 5 volte\n  chiedi (elemento n di domande)\n  se risposta = (elemento n di risposte)\n    cambia punteggio di 1") + "Il quiz ripete sempre la prima domanda. Perché?", ["Manca «cambia n di 1» dentro il ciclo", "Serve un altro sprite", "Il ciclo dovrebbe essere «per sempre»"], 0, "Senza far avanzare l'indice, si legge sempre l'elemento 1 della lista."],
          [pre("se punteggio > 4 allora dire «Bravissimo!»\nse punteggio > 2 allora dire «Bene»\nse punteggio < 3 allora dire «Ripassa»") + "Con 5 punti il gatto dice due messaggi. Perché?", ["Le condizioni si sovrappongono: 5 è sia > 4 sia > 2", "Il punteggio è sbagliato", "Manca un broadcast"], 0, "Usa SE… ALTRIMENTI annidati, oppure intervalli che non si sovrappongono."]] } ],
      reflect: "Fai due prove complete: una tutta giusta e una con almeno 3 errori. Il quiz si comporta come previsto in entrambi i casi?" },
    { label: "Scenario · il quiz adattivo", brief: "Le prime 3 domande sono medie. Se ne indovini almeno 2, le ultime 2 sono avanzate; altrimenti sono di rinforzo, con un suggerimento. Simula la logica.",
      blocks: [
        { type: "sim", params: [{ id: "c", label: "Risposte corrette nel primo blocco (su 3)", min: 0, max: 3, step: 1, value: 2 }, { id: "c2", label: "Risposte corrette nel secondo blocco (su 2)", min: 0, max: 2, step: 1, value: 1 }],
          outputs: [{ key: "lista", label: "Lista usata per le ultime 2", f: (p) => p.c >= 2 ? "domande_avanzate" : "domande_base" }, { key: "tot", label: "Punteggio finale", f: (p) => p.c + p.c2 }, { key: "msg", label: "Messaggio finale", f: (p) => p.c + p.c2 === 5 ? "Livello superato!" : p.c >= 2 ? "Ottimo lavoro sul livello avanzato" : "Ripassa e riprova" }],
          note: (p) => ["ok", `Pseudocodice: <span class="mono">se risposte_corrette_blocco1 ≥ 2 allora usa domande_avanzate altrimenti usa domande_base</span>. In questo caso il programma sceglie <strong>${p.c >= 2 ? "domande_avanzate" : "domande_base"}</strong>.`] },
        { type: "quiz", questions: [["Per far funzionare la scelta, la variabile risposte_corrette_blocco1 deve…", ["essere azzerata all'inizio e aumentata solo nelle prime 3 domande", "contare tutte e 5 le domande", "essere una lista"], 0, "Deve misurare solo il primo blocco: è il dato su cui decide il programma."]] } ],
      reflect: "Il tuo quiz adattivo è giusto per chi sbaglia la prima domanda per distrazione? Come potresti renderlo più equo?" }],
  bridge: "Crea in Scratch un quiz interattivo sull'alimentazione: almeno 5 domande, punteggio, feedback per risposta corretta e sbagliata, schermata finale con il risultato.",
});
