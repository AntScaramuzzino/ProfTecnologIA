const MURI = { 0: 0, carton: 4, mattone: 10, cemento: 18 };
LABENGINE.run({
  id: "MC-COM-3-01", area: "COM", classe: 3, titolo: "Mappa del Wi-Fi", archetipo: "Flussi",
  hook: "L'infrastruttura invisibile: il tuo messaggio viaggia nell'aria come onda radio, poi in un cavo, poi magari sotto l'oceano. Si comincia dal Wi-Fi della scuola: dove prende bene, dove no, e perché.",
  footer: "Nel livello intermedio il segnale è calcolato con un modello semplificato di attenuazione: serve a capire le tendenze, non a sostituire le misure reali.",
  levels: [
    { brief: "Hai misurato il segnale in 8 punti della scuola. Colora ogni punto come chiede il libro: verde da −30 a −60 dBm, giallo da −60 a −75, rosso sotto −75. Ricorda: più vicino a zero è meglio.",
      blocks: [
        { type: "sort", categories: [["v", "Verde · ottimo/buono"], ["g", "Giallo · sufficiente"], ["r", "Rosso · scarso"]],
          items: [["Aula 2A, vicino all'access point: −42 dBm", "v", ""], ["Corridoio primo piano: −58 dBm", "v", ""], ["Laboratorio di scienze: −66 dBm", "g", ""], ["Palestra: −81 dBm", "r", "Sotto −80 la connessione è quasi inutilizzabile."], ["Biblioteca: −72 dBm", "g", ""], ["Aula in fondo al corridoio: −77 dBm", "r", ""], ["Segreteria: −51 dBm", "v", ""], ["Scale fra i piani: −74 dBm", "g", ""]] },
        { type: "quiz", questions: [["Perché −40 dBm è più forte di −80 dBm?", ["I dBm sono negativi: più si avvicinano a zero, più il segnale è forte", "È un errore dell'app", "Perché 40 è minore di 80"], 0, "È una scala logaritmica: ogni 10 dB in più il segnale è 10 volte più forte."]] } ],
      reflect: "Nella tua aula il segnale era verde, giallo o rosso? Dove si trova l'access point più vicino?" },
    { brief: "Sposta il punto di misura e aggiungi muri fra te e l'access point: guarda come cala il segnale. Poi scegli il canale giusto a 2,4 GHz.",
      blocks: [
        { type: "sim", params: [{ id: "d", label: "Distanza dall'access point", min: 1, max: 50, step: 1, value: 8, unit: "m" }, { id: "n", label: "Numero di muri attraversati", min: 0, max: 4, step: 1, value: 1 }, { id: "m", label: "Tipo di muro", options: [["carton", "Cartongesso"], ["mattone", "Mattoni"], ["cemento", "Cemento armato"]], value: "mattone" }],
          outputs: [{ key: "s", label: "Segnale stimato", f: (p) => -40 - 20 * Math.log10(p.d) - p.n * MURI[p.m], unit: "dBm" }, { key: "c", label: "Colore sulla mappa", f: (p, o) => o.s >= -60 ? "Verde" : o.s >= -75 ? "Giallo" : "Rosso" }],
          line: { from: 1, to: 50, steps: 49, xlabel: "distanza (m)", ylabel: "dBm", zero: false, series: [{ name: "Senza muri", f: (p, x) => -40 - 20 * Math.log10(x) }, { name: "Con i tuoi muri", f: (p, x) => -40 - 20 * Math.log10(x) - p.n * MURI[p.m] }], marker: (p) => [p.d, "tu"] },
          note: (p) => p.m === "cemento" && p.n > 0 ? ["warn", "Il cemento armato contiene ferro: è uno degli ostacoli peggiori per le onde radio."] : null },
        { type: "quiz", questions: [
          ["A 2,4 GHz in Europa ci sono i canali da 1 a 13. Quali non si sovrappongono?", ["1, 6 e 11", "1, 2 e 3", "tutti"], 0, "Gli altri si sovrappongono in parte: due reti vicine sullo stesso canale (o su canali vicini) si disturbano."],
          ["La rete della scuola è sul canale 6, come quella del negozio accanto. Che cosa proponi?", ["Spostare la rete della scuola sul canale 1 o 11", "Alzare il volume", "Spegnere la rete del negozio"], 0, "Cambiare canale riduce l'interferenza senza costi."]] } ],
      reflect: "Nel tuo edificio, quale ostacolo pesa di più: la distanza o i muri?" },
    { label: "Scenario · il report per il dirigente", brief: "Proponi un piano di miglioramento della rete. Prima ricostruisci il viaggio di una richiesta web, poi scrivi il report con i dati che hai misurato.",
      blocks: [
        { type: "order", title: "Che cosa succede quando apri un sito", items: [["Scrivi l'indirizzo del sito nel browser", ""], ["Il DNS traduce il nome nell'indirizzo IP del server", "Come una rubrica telefonica di internet."], ["Il dispositivo invia la richiesta all'access point via radio", ""], ["Il router la inoltra verso internet, pacchetto per pacchetto", "TCP/IP divide i dati in pacchetti e controlla che arrivino tutti."], ["Il server risponde e i pacchetti tornano indietro", ""], ["Il browser ricompone i pacchetti e mostra la pagina", ""]] },
        { type: "canvas", fields: [["dati", "Misure: punti, dBm, velocità di download", "almeno 10 punti"], ["crit", "Zone critiche (rosse) e possibili cause", ""], ["prop", "Interventi proposti", "access point in più, cambio canale, riposizionamento…"], ["cost", "Costi e priorità", ""]],
          checks: [["Almeno 10 valori in dBm", (v) => (v.dati.match(/-\s?\d{2}/g) || []).length >= 10], ["Hai collegato ogni zona critica a una causa", (v) => /muro|distanz|interfer|canale|ostacol/i.test(v.crit)]],
          out: (v) => `REPORT SULLA COPERTURA WI-FI\n\nMisure:\n${v.dati}\n\nZone critiche:\n${v.crit}\n\nInterventi:\n${v.prop}\n\nCosti e priorità:\n${v.cost}` } ],
      reflect: "Ci sono zone con copertura eccessiva, dove si potrebbe ridurre la potenza? Perché potrebbe essere utile?" }],
  bridge: "Mappa la copertura Wi-Fi della scuola: misura il segnale in 8 punti con un'app, costruisci la mappa di calore e proponi dove migliorare la rete.",
});
