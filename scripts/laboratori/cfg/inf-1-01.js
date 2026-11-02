const BIT = [128, 64, 32, 16, 8, 4, 2, 1];
LABENGINE.run({
  id: "MC-INF-1-01", area: "INF", classe: 1, titolo: "Bit-lab", archetipo: "Simulatore",
  hook: "Tutto quello che il computer «vede» è un numero, e ogni numero è fatto di 0 e 1. Una lettera, un colore, una foto: accendi e spegni otto interruttori e scopri come.",
  levels: [
    { brief: "Ogni interruttore è un bit e vale una potenza di 2. Accendi quelli giusti per scrivere le lettere del tuo nome in codice ASCII (le maiuscole vanno da 65 = A a 90 = Z).",
      blocks: [
        { type: "sim", title: "Un byte: 8 interruttori", params: BIT.map((v, i) => ({ id: "b" + i, label: `Bit da ${v}`, options: [[0, "0 · spento"], [1, "1 · acceso"]], value: [0, 1, 0, 0, 0, 0, 0, 1][i] })),
          outputs: [{ key: "bin", label: "Codice binario", f: (p) => BIT.map((v, i) => p["b" + i]).join("") }, { key: "dec", label: "Numero decimale", f: (p) => BIT.reduce((s, v, i) => s + v * p["b" + i], 0) }, { key: "ch", label: "Lettera ASCII", f: (p, o) => o.dec >= 65 && o.dec <= 90 ? String.fromCharCode(o.dec) : (o.dec >= 97 && o.dec <= 122 ? String.fromCharCode(o.dec) + " (minuscola)" : "—") }],
          challenges: [["Scrivi la lettera M (77)", (p, o) => o.dec === 77, "77 = 64 + 8 + 4 + 1.", "01001101."], ["Scrivi la lettera Z (90)", (p, o) => o.dec === 90, "90 = 64 + 16 + 8 + 2.", "01011010."], ["Scrivi il numero più grande possibile con un byte", (p, o) => o.dec === 255, "Accendi tutti gli interruttori.", "11111111 = 255: per questo un byte rappresenta 256 valori, da 0 a 255."]] },
        { type: "quiz", questions: [["Perché i computer usano proprio due cifre?", ["Perché è più facile da insegnare", "Perché un circuito distingue con sicurezza due stati: corrente sì o no", "Perché 2 è un numero primo"], 1, "Due stati ben separati (acceso/spento) sono difficili da confondere, anche con disturbi elettrici."]] } ],
      reflect: "Quanti byte servono per scrivere il tuo nome in ASCII?" },
    { brief: "Dalle cifre alle dimensioni dei file. Imposta il tipo di file e guarda quanto spazio occupa senza compressione.",
      blocks: [
        { type: "quiz", title: "Conversioni del libro", questions: [
          ["13 in binario è…", ["1101", "1011", "1110"], 0, "8 + 4 + 1 = 13."],
          ["42 in binario è…", ["101010", "110010", "100110"], 0, "32 + 8 + 2 = 42."],
          ["10110 in decimale è…", ["22", "26", "12"], 0, "16 + 4 + 2 = 22."],
          ["11111111 in decimale è…", ["128", "255", "256"], 1, "128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255."]] },
        { type: "sim", title: "Quanto pesa un file", params: [{ id: "t", label: "Tipo di file", options: [["txt", "Testo ASCII"], ["img", "Foto non compressa (RGB)"], ["vid", "Video non compresso"]], value: "img" }, { id: "n", label: "Caratteri (testo) o megapixel (foto)", min: 1, max: 1000, step: 1, value: 8 }, { id: "s", label: "Secondi di video (Full HD, 30 fotogrammi/s)", min: 1, max: 120, step: 1, value: 60, unit: "s" }],
          outputs: [{ key: "B", label: "Byte", f: (p) => p.t === "txt" ? p.n : p.t === "img" ? p.n * 1e6 * 3 : 1920 * 1080 * 3 * 30 * p.s, hidden: true }, { key: "kb", label: "Kilobyte", f: (p, o) => o.B / 1000, d: 1 }, { key: "mb", label: "Megabyte", f: (p, o) => o.B / 1e6, d: 1 }, { key: "gb", label: "Gigabyte", f: (p, o) => o.B / 1e9, d: 2 }],
          note: (p, o) => p.t === "vid" ? ["warn", `Un video Full HD non compresso occupa circa ${LABENGINE.fmt(1920 * 1080 * 3 * 30 / 1e6, 0)} MB al secondo. Per questo i video si comprimono sempre.`] : p.t === "img" ? ["ok", "Ogni pixel ha 3 byte: uno per il rosso, uno per il verde, uno per il blu."] : ["ok", "Un carattere ASCII occupa 1 byte."] } ],
      reflect: "Perché un file di testo di una pagina pesa così poco rispetto a una foto?" },
    { label: "Scenario · il sensore di temperatura", brief: "Un sensore misura la temperatura tra −40 °C e +60 °C con precisione 0,5 °C e la invia 100 volte al secondo su una connessione lenta. Quanti bit servono per ogni misura? Quanto traffico produce?",
      blocks: [
        { type: "sim", params: [{ id: "lo", label: "Temperatura minima", min: -60, max: 0, step: 5, value: -40, unit: "°C" }, { id: "hi", label: "Temperatura massima", min: 20, max: 120, step: 5, value: 60, unit: "°C" }, { id: "pr", label: "Precisione", options: [[1, "1 °C"], [0.5, "0,5 °C"], [0.1, "0,1 °C"]], value: 0.5 }, { id: "hz", label: "Misure al secondo", min: 1, max: 200, step: 1, value: 100 }, { id: "bit", label: "Bit che usi per ogni misura", options: [[7, "7 bit"], [8, "8 bit"], [10, "10 bit"], [12, "12 bit"], [16, "16 bit"], [32, "32 bit"]], value: 8 }],
          outputs: [{ key: "val", label: "Valori distinti", f: (p) => Math.round((p.hi - p.lo) / p.pr) + 1 }, { key: "min", label: "Bit minimi necessari", f: (p, o) => Math.ceil(Math.log2(o.val)) }, { key: "bs", label: "Bit al secondo", f: (p) => p.bit * p.hz }, { key: "day", label: "MB al giorno", f: (p) => p.bit * p.hz * 86400 / 8 / 1e6, d: 1 }],
          note: (p, o) => p.bit < o.min ? ["ko", `Con ${p.bit} bit rappresenti solo ${2 ** p.bit} valori, ma te ne servono ${o.val}: alcune temperature non si possono scrivere.`] : p.bit > o.min ? ["warn", `Funziona, ma sprechi ${p.bit - o.min} bit per misura: ${LABENGINE.fmt((p.bit - o.min) * p.hz * 86400 / 8 / 1e6, 1)} MB in più al giorno.`] : ["ok", `Scelta ottimale: ${p.bit} bit bastano per ${o.val} valori (2^${p.bit} = ${2 ** p.bit}).`] } ],
      reflect: "Perché non si usano sempre 32 bit, «per stare tranquilli»? Quando invece conviene?" }],
  bridge: "Calcola lo spazio per archiviare l'archivio fotografico della scuola: scegli una risoluzione di scansione, calcola il peso di una foto e poi dell'intero archivio.",
});
