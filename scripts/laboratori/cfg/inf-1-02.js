LABENGINE.run({
  id: "MC-INF-1-02", area: "INF", classe: 1, titolo: "Gara di ricerca", archetipo: "Programmatore",
  hook: "Un computer fa esattamente quello che gli dici, anche quando sbagli. E se gli dai istruzioni furbe, trova un nome tra diecimila in pochi passi.",
  levels: [
    { brief: "Ecco un algoritmo preciso per prendere il quaderno di matematica dallo zaino. I passi sono mescolati: rimettili in ordine perché una macchina possa eseguirli alla lettera.",
      blocks: [
        { type: "order", items: [["Apri la cerniera dello zaino", ""], ["Cerca il quaderno di matematica tra i libri", "Una macchina non sa quale prendere: va specificato."], ["Estrai il quaderno", ""], ["Chiudi la cerniera", "Facile dimenticarlo: chi scrive l'algoritmo lo dà per scontato."], ["Metti il quaderno sul banco", ""]] },
        { type: "quiz", questions: [["L'istruzione «prendi il quaderno» è un problema per una macchina perché…", ["è troppo lunga", "è ambigua: quale quaderno? da dove?", "contiene un ciclo"], 1, "Un esecutore letterale non può indovinare quello che non è scritto."]] } ],
      reflect: "Qual è il passo che avevi dato per scontato e che invece andava scritto?" },
    { brief: "Algoritmo: per ogni numero della lista, SE numero % 3 = 0 ALLORA stampalo. Traccia l'esecuzione a mano sulla lista [9, 14, 3, 21, 7, 12, 5].",
      blocks: [
        { type: "sort", title: "Che cosa fa l'algoritmo con ogni numero?", categories: [["si", "Stampato", "resto 0"], ["no", "Saltato", "resto diverso da 0"]], shuffle: false,
          items: [["9", "si", "9 % 3 = 0."], ["14", "no", "14 % 3 = 2."], ["3", "si", "3 % 3 = 0."], ["21", "si", "21 % 3 = 0."], ["7", "no", "7 % 3 = 1."], ["12", "si", "12 % 3 = 0."], ["5", "no", "5 % 3 = 2."]] },
        { type: "quiz", questions: [
          ["Che cosa stampa l'algoritmo?", ["9, 3, 21, 12", "9, 21, 12", "14, 7, 5"], 0, "Solo i numeri con resto zero."],
          ["Ora vuoi i numeri divisibili per 3 E maggiori di 10. La condizione diventa…", ["SE numero % 3 = 0 E numero > 10", "SE numero % 3 = 0 O numero > 10", "SE numero > 10"], 0, "Con E servono entrambe le condizioni: stampa 21 e 12."],
          ["In questo algoritmo, il ciclo è…", ["SE … ALLORA", "RIPETI per ogni numero", "Stampa il numero"], 1, "Ripete gli stessi passi per ogni elemento della lista."]] } ],
      reflect: "Con la condizione O al posto di E, quali numeri verrebbero stampati?" },
    { label: "Scenario · trovare «Zucchero»", brief: "Una lista ordinata di nomi. Confronta il numero massimo di confronti con tre metodi: sequenziale (uno per uno), binario (dimezzi ogni volta), con indice (vai alla lettera giusta, poi scorri).",
      blocks: [
        { type: "sim", params: [{ id: "N", label: "Nomi nella lista", min: 100, max: 100000, step: 100, value: 10000 }],
          outputs: [{ key: "a", label: "Sequenziale (caso peggiore)", f: (p) => p.N }, { key: "b", label: "Binario: log₂(N) arrotondato", f: (p) => Math.ceil(Math.log2(p.N)) }, { key: "c", label: "Con indice (26 sezioni uguali)", f: (p) => 1 + Math.ceil(p.N / 26) }],
          line: { from: 100, to: 100000, steps: 40, xlabel: "nomi nella lista", ylabel: "confronti", series: [{ name: "Sequenziale", f: (p, x) => x }, { name: "Con indice", f: (p, x) => 1 + Math.ceil(x / 26) }, { name: "Binario", f: (p, x) => Math.ceil(Math.log2(x)) }], marker: (p) => [p.N, "la tua lista"] },
          note: (p, o) => ["ok", `Con ${LABENGINE.fmt(p.N)} nomi la ricerca binaria fa al massimo ${o.b} confronti: ${LABENGINE.fmt(o.a / o.b, 0)} volte meno di quella sequenziale. Funziona solo perché la lista è ordinata.`] },
        { type: "quiz", questions: [["La sezione «Z» del metodo con indice di solito è molto più corta delle altre. Che cosa cambia?", ["Niente", "«Zucchero» si trova prima del caso peggiore stimato", "La ricerca diventa più lenta"], 1, "La stima N ÷ 26 suppone sezioni uguali; nella realtà le lettere hanno lunghezze diverse."]] } ],
      reflect: "Se raddoppi la lista, quanti confronti in più servono alla ricerca binaria? E a quella sequenziale?" }],
  bridge: "Progetta in pseudocodice un algoritmo per ordinare alfabeticamente i 64 partecipanti a un torneo scolastico e conta il numero di confronti nel caso peggiore.",
});
