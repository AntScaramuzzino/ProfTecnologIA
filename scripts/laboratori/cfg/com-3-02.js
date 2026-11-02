LABENGINE.run({
  id: "MC-COM-3-02", area: "COM", classe: 3, titolo: "Studio di registrazione", archetipo: "Simulatore",
  hook: "Un podcast, un video, una foto: i contenuti digitali sono numeri, e i numeri pesano. Prima di pubblicare devi sapere quanto spazio occupano, come si comprimono e con quale licenza puoi usare la musica degli altri.",
  levels: [
    { brief: "Le licenze Creative Commons dicono che cosa puoi fare con l'opera di un altro. Leggi ogni caso e rispondi.",
      blocks: [
        { type: "quiz", questions: [
          ["Un suono su Freesound è CC0. Puoi usarlo nel podcast pubblicato su internet senza citare l'autore?", ["Sì", "No"], 0, "CC0 vuol dire dominio pubblico: puoi fare qualsiasi cosa. Citare resta comunque una buona pratica."],
          ["Una musica è CC BY-NC. Puoi usarla nello spot di un negozio?", ["Sì, se citi l'autore", "No: NC vieta l'uso commerciale"], 1, "NC sta per «non commerciale»."],
          ["Una foto è CC BY-ND. Puoi ritagliarla e aggiungere una scritta?", ["Sì, citando l'autore", "No: ND vieta le modifiche"], 1, "ND sta per «nessuna opera derivata»: solo l'opera intatta."],
          ["Modifichi un'immagine CC BY-SA. Con quale licenza devi pubblicare il risultato?", ["Quella che vuoi", "CC BY-SA", "CC0"], 1, "SA, «condividi allo stesso modo»: le opere derivate tengono la stessa licenza. È quella di Wikipedia."],
          ["Una canzone famosa trovata online, senza nessuna licenza indicata.", ["È libera: è su internet", "È protetta da diritto d'autore: serve un permesso"], 1, "Se non è indicata una licenza aperta, valgono tutti i diritti riservati."]] } ],
      reflect: "Come si scrive una citazione corretta per un suono CC BY? Prova: titolo, autore, fonte, licenza." },
    { brief: "Quanto pesa il tuo podcast? Imposta durata e qualità e confronta l'audio non compresso (WAV) con l'MP3 compresso.",
      blocks: [
        { type: "sim", params: [{ id: "min", label: "Durata", min: 1, max: 60, step: 1, value: 3, unit: "min" }, { id: "sr", label: "Campioni al secondo", options: [[22050, "22,05 kHz"], [44100, "44,1 kHz (qualità CD)"], [48000, "48 kHz"]], value: 44100 }, { id: "bit", label: "Bit per campione", options: [[16, "16 bit"], [24, "24 bit"]], value: 16 }, { id: "ch", label: "Canali", options: [[1, "Mono"], [2, "Stereo"]], value: 2 }, { id: "mp3", label: "Bitrate MP3", options: [[64, "64 kbps"], [128, "128 kbps"], [192, "192 kbps"], [320, "320 kbps"]], value: 128 }],
          outputs: [{ key: "wav", label: "WAV non compresso", f: (p) => (p.sr * p.bit * p.ch * p.min * 60) / 8 / 1e6, unit: "MB", d: 1 }, { key: "mp", label: "MP3", f: (p) => (p.mp3 * 1000 * p.min * 60) / 8 / 1e6, unit: "MB", d: 1 }, { key: "r", label: "Rapporto di compressione", f: (p, o) => o.wav / o.mp, d: 1 }],
          bars: (p, o) => [["WAV", o.wav], ["MP3", o.mp]], barsUnit: "MB", barsD: 1,
          note: (p, o) => ["ok", `L'MP3 occupa circa ${LABENGINE.fmt(o.r, 0)} volte meno. È una compressione con perdita: elimina i suoni che l'orecchio percepisce meno. Il WAV è più adatto al montaggio, l'MP3 alla pubblicazione.`] },
        { type: "sort", title: "Con perdita o senza perdita?", categories: [["lossy", "Con perdita (lossy)"], ["lossless", "Senza perdita (lossless)"]],
          items: [["MP3", "lossy", ""], ["ZIP", "lossless", "Si ricostruisce esattamente l'originale."], ["JPEG", "lossy", ""], ["PNG", "lossless", ""], ["FLAC", "lossless", "Audio compresso senza perdere nulla."]] } ],
      reflect: "Per il tuo podcast di 3 minuti, quale formato useresti durante il montaggio e quale per pubblicarlo?" },
    { label: "Scenario · il podcast della classe", brief: "Pubblicherete il podcast online. Scegli la licenza rispondendo a due domande, poi controlla che tutti i materiali che usate siano compatibili.",
      blocks: [
        { type: "sim", params: [{ id: "c", label: "Vuoi permettere usi commerciali?", options: [["si", "Sì"], ["no", "No"]], value: "no" }, { id: "m", label: "Vuoi permettere modifiche?", options: [["si", "Sì"], ["sa", "Sì, ma con la stessa licenza"], ["no", "No"]], value: "sa" }],
          outputs: [{ key: "l", label: "La vostra licenza", f: (p) => "CC BY" + (p.c === "no" ? "-NC" : "") + (p.m === "sa" ? "-SA" : p.m === "no" ? "-ND" : "") }],
          note: (p, o) => ["ok", `Con <strong>${o.l}</strong> chi riusa il podcast deve citarvi${p.c === "no" ? " e non può usarlo per guadagnare" : ""}${p.m === "sa" ? ", e se lo modifica deve usare la stessa licenza" : p.m === "no" ? ", e non può modificarlo" : ""}.`] },
        { type: "sort", title: "Questi materiali si possono usare in un podcast CC BY-SA pubblicato online?", categories: [["si", "Sì"], ["no", "No"]],
          items: [["Musica di sottofondo CC0", "si", ""], ["Effetto sonoro CC BY, citato", "si", ""], ["Jingle CC BY-NC", "no", "La licenza CC BY-SA del podcast permette ad altri anche usi commerciali: un materiale NC non è compatibile."], ["Canzone famosa senza licenza", "no", "Serve il permesso di chi detiene i diritti."], ["Intervista registrata a un compagno, con il suo consenso scritto", "si", "Per la voce di una persona serve il consenso; per un minore, anche quello dei genitori."], ["Brano CC BY-ND, tagliato e remixato", "no", "ND vieta le modifiche."]] } ],
      reflect: "Perché il libro dice che «uso scolastico» non vuol dire automaticamente «uso libero»?" }],
  bridge: "Produci un podcast di 3 minuti su un tema tecnologico: scrivi lo script, registra, aggiungi musica con licenza CC e cita tutte le fonti.",
});
