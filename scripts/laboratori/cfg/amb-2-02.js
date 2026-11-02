const APP = [["frigo", "Frigorifero", 40, 24], ["lav", "Lavatrice", 1800, 0.3], ["tv", "TV + decoder", 100, 4], ["luci", "Illuminazione", 80, 5], ["forno", "Forno elettrico", 2000, 0.5], ["carica", "Caricabatterie smartphone", 10, 2], ["sb", "Stand-by totale", 50, 24], ["risc", "Riscaldamento elettrico (inverno)", 1500, 6]];
LABENGINE.run({
  id: "MC-AMB-2-02", area: "AMB", classe: 2, titolo: "La bolletta di casa", archetipo: "Calcolatore",
  hook: "Una casa non è solo muri e tetto: è un sistema di impianti. Acqua, luce, gas, calore arrivano da fuori e passano da contatori e quadri. La bolletta racconta quanto usi, e dove puoi risparmiare.",
  footer: "Potenze e ore d'uso tipiche dalla tabella del testo; prezzo d'esempio 0,30 €/kWh, come nel libro.",
  levels: [
    { brief: "Leggi la bolletta semplificata del libro e fai i primi calcoli. Formula: kWh = kW × ore × giorni.",
      blocks: [
        { type: "chart", kind: "bar", toggles: false, d: 0, xlabel: "mese", ylabel: "kWh", series: [{ name: "Consumo", data: [["Ottobre", 210], ["Novembre", 265], ["Dicembre", 310]] }] },
        { type: "quiz", questions: [
          ["Consumo medio giornaliero di dicembre?", ["10 kWh", "31 kWh", "3,1 kWh"], 0, "310 kWh ÷ 31 giorni = 10 kWh al giorno."],
          ["Un frigorifero da 40 W acceso 24 ore per 31 giorni consuma…", ["29,76 kWh", "960 kWh", "1,24 kWh"], 0, "0,04 kW × 24 h × 31 giorni = 29,76 kWh."],
          ["A 0,30 €/kWh, quanto costa il frigorifero a dicembre?", ["circa 8,93 €", "circa 29,76 €", "circa 0,89 €"], 0, "29,76 × 0,30 ≈ 8,93 €."],
          ["Perché il consumo sale da ottobre a dicembre?", ["Giornate più corte e più freddo: più luci accese e più riscaldamento", "Il prezzo dell'energia aumenta", "Il contatore si guasta"], 0, "Il consumo dipende da come e quanto usi gli apparecchi, che cambia con le stagioni."]] } ],
      reflect: "Quali apparecchi di casa tua lavorano anche quando nessuno li usa?" },
    { brief: "Dove passano luce, acqua e gas in casa tua? Metti ogni elemento nel suo impianto e ordina il percorso dell'elettricità.",
      blocks: [
        { type: "sort", categories: [["el", "Impianto elettrico"], ["idr", "Impianto idraulico"], ["gas", "Impianto del gas"], ["risc", "Riscaldamento"]],
          items: [["Quadro elettrico con interruttore differenziale (salvavita)", "el", "Stacca la corrente se c'è una dispersione verso terra: protegge le persone."], ["Contatore dell'acqua", "idr", ""], ["Scarico del lavandino con sifone", "idr", "Il sifone trattiene un po' d'acqua che blocca i cattivi odori."], ["Valvola di intercettazione vicino al fornello", "gas", "Si chiude per isolare l'apparecchio."], ["Termostato", "risc", "Accende e spegne la caldaia in base alla temperatura."], ["Radiatore", "risc", ""], ["Presa con messa a terra", "el", ""], ["Contatore del gas", "gas", ""]] },
        { type: "order", title: "Il viaggio dell'elettricità", items: [["Rete di distribuzione in strada", ""], ["Contatore", "Misura i kWh che usi."], ["Quadro elettrico con interruttori", "Protegge l'impianto e le persone."], ["Linee che corrono nei muri", ""], ["Prese e punti luce di ogni stanza", ""]] } ],
      reflect: "Sai dov'è il quadro elettrico di casa tua? E la valvola generale del gas?" },
    { label: "Scenario · il consumo di casa tua", brief: "Imposta potenza e ore d'uso di ogni apparecchio (valori tipici del libro). Trova i tre più energivori e prova a ridurli.",
      blocks: [
        { type: "sim", params: [...APP.map(([id, l, w, h]) => ({ id, label: `${l} · ore al giorno (${w} W)`, min: 0, max: 24, step: 0.1, value: h, unit: "h" })), { id: "pr", label: "Prezzo dell'energia", min: 0.15, max: 0.5, step: 0.01, value: 0.3, unit: "€/kWh" }],
          outputs: [{ key: "kwh", label: "Consumo al mese", f: (p) => APP.reduce((s, [id, , w]) => s + (w / 1000) * p[id] * 30, 0), unit: "kWh" }, { key: "eur", label: "Costo al mese", f: (p, o) => o.kwh * p.pr, unit: "€", d: 2 }, { key: "top", label: "I tre più energivori", f: (p) => APP.map(([id, l, w]) => [l, (w / 1000) * p[id] * 30]).sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]).join(", ") }],
          bars: (p) => APP.map(([id, l, w]) => [l, (w / 1000) * p[id] * 30]).sort((a, b) => b[1] - a[1]), barsUnit: "kWh/mese",
          note: (p) => p.sb > 0 ? ["warn", `Lo stand-by da solo consuma ${LABENGINE.fmt(0.05 * p.sb * 30, 1)} kWh al mese: una ciabatta con interruttore lo azzera.`] : ["ok", "Stand-by azzerato: è il risparmio più facile."] } ],
      reflect: "Quale intervento di risparmio costa zero e quale richiede un investimento? Quale proporresti per primo?" }],
  bridge: "Disegna lo schema semplificato degli impianti di casa tua: dove entra l'acqua, dove arriva l'elettricità, dove sono i principali punti di sicurezza.",
});
