// Dati simulati: temperatura di un'aula, 5 giorni, ore 8-17
const ORE = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const GG = [["Lun", 18.2], ["Mar", 18.8], ["Mer", 19.5], ["Gio", 19.1], ["Ven", 18.5]];
const temp = (base, h) => +(base + 2.6 * Math.sin(((h - 8) / 9) * Math.PI) + (h >= 11 && h <= 12 ? 0.6 : 0)).toFixed(1);
const PM = [9, 11, 14, 22, 31, 27, 18, 12, 10, 16, 24, 35, 29, 15];
LABENGINE.run({
  id: "MC-DIG-3-03", area: "DIG", classe: 3, titolo: "Grafici che parlano (e che mentono)", archetipo: "Laboratorio dati",
  hook: "Un sensore trasforma il mondo fisico in numeri. Ma i numeri, da soli, non dicono niente: lo fa il grafico. E lo stesso dato, con un asse diverso, può raccontare due storie opposte.",
  footer: "I dati di temperatura e di PM2.5 sono simulati a scopo didattico. Per dati reali: sensor.community o l'agenzia ambientale (ARPA) della tua regione.",
  levels: [
    { brief: "Temperatura di un'aula, misurata ogni ora dalle 8 alle 17, in cinque giorni. Leggi il grafico.",
      blocks: [
        { type: "chart", kind: "line", d: 1, xlabel: "ora", ylabel: "°C", zero: true,
          series: GG.slice(0, 3).map(([g, b]) => ({ name: g, data: ORE.map((h) => [String(h), temp(b, h)]) })),
          note: (zero) => zero ? ["ok", "Con l'asse da zero le variazioni sembrano piccole: in effetti sono di 2-3 °C."] : ["warn", "Senza lo zero, le stesse variazioni sembrano enormi. Nessuno dei due grafici è falso, ma il secondo enfatizza."] },
        { type: "quiz", questions: [
          ["Che cosa c'è sull'asse orizzontale?", ["La temperatura", "L'ora del giorno", "I giorni"], 1, ""],
          ["In quale fascia oraria l'aula è più calda?", ["Alle 8", "Fra le 12 e le 13", "Alle 17"], 1, "Il sole e la presenza degli studenti scaldano l'aula verso metà giornata."],
          ["Quale giorno è più caldo in media?", ["Lunedì", "Mercoledì"], 1, "La curva di mercoledì sta sopra le altre per tutto il giorno."]] } ],
      reflect: "Spegni e riaccendi «Asse verticale da zero». Quale versione useresti per convincere qualcuno che l'aula è troppo calda?" },
    { brief: "Gli stessi dati in forme diverse. Scegli il grafico giusto per ogni domanda.",
      blocks: [
        { type: "chart", title: "Media giornaliera", kind: "bar", toggles: true, d: 1, xlabel: "giorno", ylabel: "°C media", series: [{ name: "Media", data: GG.map(([g, b]) => [g, +(ORE.reduce((s, h) => s + temp(b, h), 0) / ORE.length).toFixed(1)]) }],
          note: (zero) => zero ? null : ["warn", "Colonne che non partono da zero: le differenze fra i giorni sembrano molto più grandi. Con le colonne, lo zero va sempre mostrato."] },
        { type: "quiz", questions: [
          ["Vuoi mostrare come cambia la temperatura durante una giornata.", ["Grafico a linee", "Grafico a torta", "Colonne per giorno"], 0, "La linea mostra un andamento nel tempo."],
          ["Vuoi confrontare la media di ogni giorno.", ["Grafico a linee", "Colonne", "Torta"], 1, "Le colonne confrontano valori fra categorie."],
          ["Vuoi mostrare le percentuali di tempo trascorso sopra i 22 °C, fra 20 e 22, sotto i 20.", ["Torta o barre in percentuale", "Linea", "Dispersione"], 0, "Sono parti di un intero: somma 100%."],
          ["Un grafico a colonne con l'asse verticale che parte da 18 °C invece che da 0…", ["È sempre corretto", "Esagera le differenze tra le colonne", "Riduce le differenze"], 1, "L'altezza delle colonne deve essere proporzionale al valore."]] } ],
      reflect: "Hai mai visto un grafico ingannevole in pubblicità o nelle notizie? Che trucco usava?" },
    { label: "Scenario · PM2.5 dalla stazione di quartiere", brief: "Quattordici giorni di media giornaliera di PM2.5 da una centralina di quartiere (dati simulati). L'Organizzazione Mondiale della Sanità indica 15 µg/m³ come valore guida per la media di 24 ore (linee guida 2021).",
      blocks: [
        { type: "chart", kind: "bar", d: 0, xlabel: "giorno", ylabel: "PM2.5 µg/m³", series: [{ name: "PM2.5", data: PM.map((v, i) => [String(i + 1), v]) }, { name: "Valore guida OMS", data: PM.map((v, i) => [String(i + 1), 15]) }] },
        { type: "quiz", questions: [
          ["In quanti giorni su 14 il PM2.5 supera il valore guida di 15?", ["5", "8", "11"], 1, "Giorni 4, 5, 6, 7, 10, 11, 12 e 13. Il giorno 14 è esattamente 15: non lo supera."],
          ["I picchi sono raggruppati. Che cosa potresti verificare?", ["Il meteo di quei giorni (vento, pioggia) e il traffico", "Niente, è un caso", "Che il sensore è rotto"], 0, "Correlare i dati con altre fonti è il passo successivo dell'analisi."],
          ["Una centralina in un cortile privato registra ogni minuto. Che cosa potrebbe rivelare, oltre all'aria?", ["Nulla", "Abitudini delle persone: quando accendono il camino, quando escono", "La password del Wi-Fi"], 1, "Anche i dati ambientali possono diventare dati personali, se sono abbastanza dettagliati e collegati a una casa."]] } ],
      reflect: "Pubblicheresti i dati della tua centralina come open data? A quale livello di dettaglio, per rispettare la privacy?" }],
  bridge: "Realizza una stazione di monitoraggio per la tua aula con micro:bit o Arduino: raccogli temperatura e luminosità per una settimana e costruisci i grafici dei dati.",
});
