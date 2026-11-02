const MAGLIA = [["Coltivazione del cotone", 0.25], ["Filatura e tessitura", 0.4], ["Taglio e cucito", 0.6], ["Tintoria e finissaggi", 0.3], ["Logistica e distribuzione", 0.45], ["Importazione e ingrosso", 0.4], ["Marketing e marchio", 1.0], ["Negozio", 1.51], ["IVA (22%)", 1.08]];
LABENGINE.run({
  id: "MC-SIS-3-01", area: "SIS", classe: 3, titolo: "Dove vanno i tuoi soldi", archetipo: "Flussi",
  hook: "Un sistema economico decide che cosa produrre, come e per chi. Dietro una maglietta da 5,99 € c'è una catena di campi, fabbriche, navi, uffici e negozi. Chi prende quale parte del prezzo?",
  footer: "La scomposizione del prezzo della maglietta è quella, ipotetica e didattica, del testo della MC: non descrive una filiera reale.",
  levels: [
    { brief: "Classifica le attività nei settori dell'economia, poi le imprese per dimensione (definizione europea: micro sotto i 10 dipendenti, piccola sotto i 50, media sotto i 250).",
      blocks: [
        { type: "sort", categories: [["pri", "Primario", "agricoltura, pesca, estrazione"], ["sec", "Secondario", "industria, artigianato"], ["ter", "Terziario", "servizi"], ["qua", "Quaternario", "informazione, ricerca, conoscenza"]],
          items: [["Uliveto in Calabria", "pri", ""], ["Frantoio che produce olio", "sec", ""], ["Supermercato", "ter", ""], ["Azienda che sviluppa app", "qua", ""], ["Peschereccio", "pri", ""], ["Fabbrica di biciclette", "sec", ""], ["Ospedale", "ter", ""], ["Laboratorio di ricerca universitario", "qua", ""]] },
        { type: "sort", title: "Quanto è grande l'impresa?", categories: [["mic", "Microimpresa"], ["pic", "Piccola"], ["med", "Media"], ["gra", "Grande"]],
          items: [["Panificio con 4 dipendenti", "mic", ""], ["Officina meccanica con 35 dipendenti", "pic", ""], ["Azienda alimentare con 180 dipendenti", "med", ""], ["Catena di supermercati con 12.000 dipendenti", "gra", ""]] } ],
      reflect: "Le imprese del tuo comune appartengono soprattutto a quale settore? E di che dimensione sono?" },
    { brief: "La maglietta da 5,99 €, voce per voce. Guarda quanto pesa ogni fase del prezzo.",
      blocks: [
        { type: "sim", params: [{ id: "pr", label: "Prezzo finale della maglietta", min: 3, max: 30, step: 0.5, value: 5.99, unit: "€", d: 2 }],
          outputs: [{ key: "cuc", label: "Taglio e cucito", f: (p) => (0.6 / 5.99) * p.pr, unit: "€", d: 2 }, { key: "pct", label: "Quota di taglio e cucito", f: () => (0.6 / 5.99) * 100, unit: "%", d: 1 }, { key: "mk", label: "Marketing, marchio e negozio insieme", f: () => ((1.0 + 1.51) / 5.99) * 100, unit: "%", d: 1 }],
          bars: (p) => MAGLIA.map(([n, v]) => [n, (v / 5.99) * p.pr]), barsUnit: "€", barsD: 2, barsTitle: "Scomposizione didattica del prezzo (proporzioni fisse)",
          note: () => ["ok", "Attenzione: ogni quota comprende costi e margini, non è il guadagno di chi lavora. Il cotone, il cucito e la tintoria insieme valgono meno di marchio e negozio."] },
        { type: "quiz", questions: [["Se il prezzo sale a 15 € ma le proporzioni restano uguali, chi ci guadagna di più in euro?", ["Chi ha la quota più grande: negozio e marchio", "In egual misura tutti", "Chi cuce"], 0, "In proporzione tutti uguali, ma in euro guadagna di più chi ha la fetta più grande. Nella realtà, poi, le proporzioni cambiano con il potere di mercato."]] } ],
      reflect: "Perché il marchio può avere una quota così alta? Che cosa compri, quando compri un marchio?" },
    { label: "Scenario · grande impresa e PMI nel tuo territorio", brief: "Confronta una grande impresa o multinazionale presente nel tuo territorio con una PMI locale dello stesso settore. Usa fonti verificabili (bilanci, siti istituzionali, articoli di stampa).",
      blocks: [
        { type: "compare", criteria: [["occ", "Posti di lavoro locali"], ["filiera", "Acquisti da fornitori locali"], ["stab", "Radicamento nel territorio"], ["innov", "Capacità di investire e innovare"], ["prezzi", "Prezzi bassi per i consumatori"]],
          alts: [{ name: "Grande impresa", v: { occ: 4, filiera: 2, stab: 2, innov: 5, prezzi: 5 } }, { name: "PMI locale", v: { occ: 3, filiera: 4, stab: 5, innov: 2, prezzi: 3 } }],
          scale: "Punteggi d'esempio, tipici ma non validi per ogni caso: sostituiscili con quello che trovi sulle due imprese che hai scelto.", notes: false,
          verdict: (sc) => ["ok", `Con i tuoi pesi prevale <strong>${sc[0][0]}</strong>. Nella relazione distingui i fatti che hai verificato dalle opinioni.`] },
        { type: "canvas", fields: [["g", "Grande impresa: dipendenti in Italia, sede fiscale, dove produce", ""], ["p", "PMI: dipendenti, fondazione, fornitori", ""], ["fonti", "Fonti", ""]],
          checks: [["Numeri di dipendenti per entrambe", (v) => /\d/.test(v.g) && /\d/.test(v.p)], ["Almeno due fonti", (v) => (v.fonti.match(/http|www|bilancio|camera di commercio|\.it/gi) || []).length >= 2]],
          out: (v) => `CONFRONTO\nGrande impresa: ${v.g}\nPMI: ${v.p}\nFonti: ${v.fonti}` } ],
      reflect: "Il territorio ha bisogno di entrambe? Che cosa succede se ne manca una?" }],
  bridge: "Analizza il sistema economico della tua città: individua 5 aziende di settori diversi, classificale per tipo e dimensione e descrivi il loro ruolo nel territorio.",
});
