const SCALE = [1, 2, 5, 10, 20, 50, 100, 200, 500];
LABENGINE.run({
  id: "MC-DIS-1-02", area: "DIS", classe: 1, titolo: "Lo scalatore", archetipo: "Simulatore",
  hook: "Come si disegna un appartamento su un foglio A4? Riducendo tutto nella stessa proporzione. La scala è la regola che lega il foglio alla realtà.",
  levels: [
    { brief: "Usa le due formule: misura sul disegno = misura reale ÷ n; misura reale = misura sul disegno × n. Prova il convertitore, poi risolvi gli esercizi del libro.",
      blocks: [
        { type: "sim", title: "Il convertitore", params: [{ id: "r", label: "Misura reale", min: 1, max: 1000, step: 1, value: 180, unit: "cm" }, { id: "n", label: "Scala 1:n", options: SCALE.map((s) => [s, "1:" + s]), value: 20 }],
          outputs: [{ key: "d", label: "Misura sul disegno", f: (p) => p.r / p.n, unit: "cm", d: 2 }, { key: "mm", label: "In millimetri", f: (p, o) => o.d * 10, unit: "mm", d: 1 }] },
        { type: "quiz", questions: [
          ["Un tavolo lungo 180 cm, in scala 1:20, sul disegno misura…", ["9 cm", "36 cm", "3600 cm"], 0, "180 ÷ 20 = 9 cm."],
          ["Una porta larga 90 cm, in scala 1:50, sul disegno misura…", ["4,5 cm", "1,8 cm", "45 cm"], 1, "90 ÷ 50 = 1,8 cm."],
          ["Sul disegno in scala 1:10 un bullone misura 3,6 cm. Nella realtà misura…", ["0,36 cm", "36 cm", "3,6 cm"], 1, "3,6 × 10 = 36 cm."]] } ],
      reflect: "Quando un disegno è in scala 1:1? E 2:1? In quali casi si ingrandisce invece di ridurre?" },
    { brief: "Scegli la scala giusta per il tuo oggetto: deve entrare nell'area utile del foglio insieme alle viste e ai margini. Prova i formati e le scale normalizzate.",
      blocks: [
        { type: "sim", params: [{ id: "L", label: "Lunghezza reale dell'oggetto", min: 5, max: 2000, step: 5, value: 260, unit: "mm" }, { id: "W", label: "Larghezza reale", min: 5, max: 2000, step: 5, value: 190, unit: "mm" }, { id: "f", label: "Formato del foglio", options: [["a4", "A4 (210 × 297 mm)"], ["a3", "A3 (297 × 420 mm)"]], value: "a4" }, { id: "n", label: "Scala 1:n", options: SCALE.map((s) => [s, "1:" + s]), value: 2 }],
          presets: [["Libro di Tecnologia", { L: 260, W: 190 }], ["Astuccio", { L: 200, W: 80 }], ["Banco di scuola", { L: 700, W: 500 }]],
          outputs: [{ key: "dl", label: "Lunghezza sul foglio", f: (p) => p.L / p.n, unit: "mm", d: 1 }, { key: "dw", label: "Larghezza sul foglio", f: (p) => p.W / p.n, unit: "mm", d: 1 },
            { key: "area", label: "Spazio per ogni vista", f: (p) => p.f === "a4" ? "≈ 170 × 115 mm" : "≈ 250 × 170 mm" },
            { key: "min", label: "Scala minima che entra", f: (p) => { const [aw, ah] = p.f === "a4" ? [170, 115] : [250, 170]; const need = Math.max(Math.max(p.L, p.W) / aw, Math.min(p.L, p.W) / ah); const s = SCALE.find((x) => x >= need) || 1000; return "1:" + s; } }],
          note: (p) => { const [aw, ah] = p.f === "a4" ? [170, 115] : [250, 170]; const l = Math.max(p.L, p.W) / p.n, w = Math.min(p.L, p.W) / p.n; return l <= aw && w <= ah ? (l < aw * 0.35 ? ["warn", "Entra, ma è molto piccolo: prova una scala più grande (n più basso) per leggere bene i dettagli."] : ["ok", "Entra nello spazio della vista, con margini e cartiglio. Scrivi la scala nel cartiglio."]) : ["ko", "Non entra: scegli una scala con n più grande, oppure un foglio più grande."]; } },
        { type: "info", html: "<p class=\"src\">Lo spazio per vista è una stima: un foglio diviso in due zone, tolti margini e cartiglio. Le scale proposte sono quelle normalizzate del disegno tecnico.</p>" } ],
      reflect: "Hai scelto la scala più grande possibile o quella più comoda da calcolare? Perché?" },
    { label: "Scenario · l'appartamento dell'arch. Ferrara", brief: "Appartamento di 10 × 7 m, muri perimetrali di 30 cm, tramezzi di 15 cm. Va disegnato in scala 1:50 su un A4. Usa il calcolatore per ogni misura, poi controlla le risposte.",
      blocks: [
        { type: "sim", params: [{ id: "r", label: "Misura reale", min: 10, max: 1200, step: 5, value: 1000, unit: "cm" }],
          presets: [["Larghezza totale 10 m", { r: 1000 }], ["Profondità 7 m", { r: 700 }], ["Muro perimetrale 30 cm", { r: 30 }], ["Tramezzo 15 cm", { r: 15 }], ["Porta d'ingresso 90 cm", { r: 90 }], ["Soggiorno 5 m", { r: 500 }]],
          outputs: [{ key: "d", label: "Sul disegno in scala 1:50", f: (p) => p.r / 50, unit: "cm", d: 1 }, { key: "mm", label: "In millimetri", f: (p) => p.r / 5, unit: "mm", d: 0 }] },
        { type: "quiz", questions: [
          ["L'intero appartamento sul foglio misura…", ["20 × 14 cm: entra in un A4", "50 × 35 cm: serve un A2", "2 × 1,4 cm"], 0, "1000 ÷ 50 = 20 cm; 700 ÷ 50 = 14 cm. Su un A4 (21 × 29,7) entra con poco margine sul lato corto: orienta il foglio in orizzontale."],
          ["Un tramezzo da 15 cm, in scala 1:50, diventa…", ["3 mm", "1,5 cm", "0,3 mm"], 0, "15 ÷ 50 = 0,3 cm = 3 mm: due linee vicine, ma ancora disegnabili."],
          ["Sul disegno una stanza misura 7 cm × 8 cm. Nella realtà è…", ["3,5 × 4 m", "7 × 8 m", "35 × 40 cm"], 0, "7 × 50 = 350 cm; 8 × 50 = 400 cm: è la camera grande."]] } ],
      reflect: "Perché gli architetti usano proprio la scala 1:50 per le piante degli appartamenti?" }],
  bridge: "Scegli un oggetto della scrivania, misuralo in tutti e tre i sensi e disegnane la pianta quotata alla scala più adatta su un foglio A4.",
});
