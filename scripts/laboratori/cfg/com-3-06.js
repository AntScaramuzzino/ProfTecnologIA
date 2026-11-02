LABENGINE.run({
  id: "MC-COM-3-06", area: "COM", classe: 3, titolo: "Virale o vero?", archetipo: "Ispettore",
  hook: "Nell'economia dell'attenzione il prodotto è il tuo tempo. Gli algoritmi premiano ciò che fa reagire, non ciò che è vero. Prima di condividere, servono metodo e un po' di sangue freddo.",
  footer: "L'articolo del livello intermedio è inventato a scopo didattico.",
  levels: [
    { brief: "Ogni contenuto ha un tipo, una fonte e qualcuno che ha interesse a diffonderlo. Classifica.",
      blocks: [
        { type: "sort", categories: [["not", "Notizia"], ["opi", "Opinione"], ["pub", "Pubblicità"], ["sat", "Satira"], ["mar", "Contenuto di marca", "pubblicità mascherata"]],
          items: [["«Approvato il bilancio del Comune: 2 milioni alle scuole» con fonte e data", "not", ""], ["«Secondo me il nuovo stadio è inutile»", "opi", ""], ["Video di un influencer che «per caso» usa sempre la stessa bibita, con #adv", "mar", "L'etichetta #adv o «adv» segnala un accordo commerciale."], ["Banner «Sconto 50% solo oggi!»", "pub", ""], ["«Il ministro annuncia: da domani la scuola dura 26 ore al giorno»", "sat", "Esagerazione evidente, pensata per far ridere o riflettere."], ["Articolo «sponsorizzato» su una crema solare dentro un sito di notizie", "mar", ""]] },
        { type: "sort", title: "Che tipo di disturbo dell'informazione?", categories: [["dis", "Disinformazione", "falsa e diffusa apposta"], ["mis", "Misinformazione", "falsa ma condivisa in buona fede"], ["mal", "Malinformazione", "vera ma usata per nuocere"]],
          items: [["Un sito inventa una notizia per guadagnare con i clic", "dis", ""], ["Tua zia condivide una catena falsa per mettere in guardia gli amici", "mis", ""], ["Qualcuno pubblica l'indirizzo vero di una persona per farla attaccare", "mal", ""]] } ],
      reflect: "Fra i contenuti che hai visto negli ultimi due giorni, ce n'era uno di cui non hai trovato la fonte originale?" },
    { brief: "Circola il titolo: «Studio rivela che gli smartphone causano un calo del QI del 15% nei ragazzi». Analizza l'articolo inventato: tocca le parti che servono al fact-checking.",
      blocks: [
        { type: "inspect", tags: { tit: "Titolo più forte del contenuto", fonte: "Fonte primaria vaga", num: "Numero senza contesto", caus: "Correlazione presentata come causa", aut: "Autore e data" },
          docs: [{ title: "SMARTPHONE, ALLARME QI: -15% IN 5 ANNI", sub: "www.notizie-shock.example · articolo inventato", parts: [["SMARTPHONE, ALLARME QI: -15% IN 5 ANNI", "tit"], " ", ["Pubblicato da Redazione, senza data.", "aut"], " ", ["Uno studio di alcuni ricercatori stranieri", "fonte"], " ha osservato che i ragazzi che passano più tempo al telefono ottengono in media punteggi più bassi in alcuni test. ", ["Il calo arriverebbe al 15%", "num"], ", anche se l'articolo non dice su quanti ragazzi né rispetto a cosa. ", ["Dunque è lo smartphone a rendere meno intelligenti", "caus"], ". Condividi per avvisare tutti i genitori!"],
            verdict: ["Il titolo è…", ["confermato dal testo", "più forte di quello che il testo riporta", "falso con certezza"], 1], why: "Il testo parla di un'associazione osservata, non di una causa dimostrata, e non cita lo studio: senza la fonte primaria (rivista, autori, campione) non si può verificare." }] } ],
      reflect: "Quali tre informazioni ti servirebbero per trovare lo studio originale?" },
    { label: "Scenario · campagna per le classi prime", brief: "La scuola finanzia un progetto di media literacy per le prime. Progetta la campagna: obiettivi, attività, materiali, come misurare se funziona.",
      blocks: [
        { type: "canvas", fields: [["target", "Che cosa sanno già i ragazzi di prima (con una fonte)", "cerca indagini sulla media literacy dei ragazzi"], ["ob", "Tre obiettivi concreti", "es. riconoscere un contenuto sponsorizzato"], ["att", "Le attività, con tempi", ""], ["mat", "I materiali che produrrete", "quiz, poster, video, gioco…"], ["mis", "Come misurerete i risultati", "test prima e dopo, sondaggio…"]],
          checks: [["Tre obiettivi", (v) => v.ob.split(/[\n;]/).filter((x) => x.trim()).length >= 3], ["Misura prima e dopo", (v) => /prima.*dopo|pre.*post|confront/i.test(v.mis)], ["Fonte per il punto di partenza", (v) => /http|www|indagin|rapporto|ricerca/i.test(v.target)]],
          out: (v) => `CAMPAGNA DI MEDIA LITERACY\n\nPunto di partenza: ${v.target}\n\nObiettivi:\n${v.ob}\n\nAttività:\n${v.att}\n\nMateriali: ${v.mat}\n\nValutazione: ${v.mis}` },
        { type: "quiz", questions: [["Un algoritmo di raccomandazione ti mostra soprattutto contenuti simili a quelli che hai già guardato. Che effetto può avere?", ["Nessuno", "Una bolla: vedi sempre più conferme delle tue idee e sempre meno punti di vista diversi", "Ti mostra solo notizie vere"], 1, "È la filter bubble. Si contrasta cercando volontariamente fonti diverse."]] } ],
      reflect: "Quale attività della tua campagna coinvolgerebbe di più un ragazzo di prima? Perché?" }],
  bridge: "Scegli un contenuto virale che ti è sembrato dubbio: applica il metodo SIFT completo, documenta ogni passo e stabilisci se è affidabile, falso o fuorviante.",
});
