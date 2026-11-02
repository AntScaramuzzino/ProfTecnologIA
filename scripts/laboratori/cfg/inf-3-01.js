// Dati simulati: temperatura di un'aula ogni ora per 24 ore, con due anomalie
const T24 = [16.1, 15.9, 15.8, 15.6, 15.5, 15.5, 15.7, 16.4, 18.2, 19.6, 20.4, 3.0, 21.3, 21.6, 21.1, 20.2, 19.0, 18.1, 17.5, 17.0, 45.0, 16.6, 16.4, 16.2];
LABENGINE.run({
  id: "MC-INF-3-01", area: "INF", classe: 3, titolo: "Internet delle Cose", archetipo: "Costruttore",
  hook: "Il mondo fisico parla digitale, se sai ascoltarlo. Un sensore trasforma una grandezza in un numero, una rete lo trasporta, un server lo conserva, un'app lo mostra. Ogni anello della catena può sbagliare o essere attaccato.",
  footer: "Il dataset di temperatura è simulato a scopo didattico.",
  levels: [
    { brief: "Ricostruisci l'architettura di un sistema IoT, dal sensore allo schermo. Poi classifica gli oggetti intorno a te.",
      blocks: [
        { type: "order", items: [["Sensore: misura una grandezza fisica (temperatura, luce, CO₂)", ""], ["Microcontrollore: converte la misura in un dato digitale", ""], ["Rete: Wi-Fi, Bluetooth o LoRa trasportano il dato", "La scelta dipende da distanza, consumo e quantità di dati."], ["Gateway o router: collega i dispositivi a internet", ""], ["Cloud o server: conserva ed elabora i dati", ""], ["Dashboard o app: mostra i dati alle persone", ""]] },
        { type: "sort", title: "Che cosa misura?", categories: [["temp", "Temperatura"], ["mov", "Movimento o presenza"], ["luce", "Luce"], ["pos", "Posizione"], ["aria", "Qualità dell'aria"]],
          items: [["Termostato intelligente", "temp", ""], ["Lampione con sensore", "luce", ""], ["Smartwatch che conta i passi", "mov", "Usa l'accelerometro."], ["Antifurto con sensore a infrarossi", "mov", ""], ["Localizzatore attaccato alle chiavi", "pos", ""], ["Rilevatore di CO₂ in aula", "aria", ""]] } ],
      reflect: "Quanti dispositivi IoT ci sono in casa tua? Quanti di questi c'erano dieci anni fa?" },
    { brief: "Un sensore in aula ha misurato la temperatura ogni ora per 24 ore. Leggi il grafico: ci sono due valori anomali.",
      blocks: [
        { type: "chart", kind: "line", d: 1, xlabel: "ora", ylabel: "°C", zero: true, series: [{ name: "Temperatura", data: T24.map((v, h) => [String(h), v]) }] },
        { type: "quiz", questions: [
          ["Quali valori sono anomali?", ["3,0 °C alle 11 e 45,0 °C alle 20", "21,6 °C alle 13", "15,5 °C alle 4"], 0, "Un'aula non passa da 20 a 3 °C in un'ora, né arriva a 45 °C la sera."],
          ["Il valore delle 11 potrebbe essere reale?", ["Sì, se il sensore era vicino a una finestra aperta d'inverno; ma 3 °C resta poco plausibile per tutta l'aula", "No, mai"], 0, "Per distinguere un'anomalia reale da un errore si confronta con altri sensori o con quello che è successo in aula."],
          ["Calcolando la media, che cosa fai con i valori anomali?", ["Li tengo senza dirlo", "Li segnalo e calcolo la media con e senza", "Li cancello senza dirlo"], 1, "Escludere dati è lecito solo se lo dichiari e lo motivi."]] } ],
      reflect: "Quali informazioni sul contesto (finestre, orari, termosifoni) ti servirebbero per spiegare i dati?" },
    { label: "Scenario · aria pulita in aula", brief: "La scuola vuole misurare CO₂, temperatura e umidità nelle aule. Un riferimento molto usato indica di aerare quando la CO₂ supera circa 1.000 ppm. Dimensiona la raccolta dati e i costi (prezzi d'esempio, da verificare online).",
      blocks: [
        { type: "sim", params: [{ id: "aule", label: "Aule", min: 1, max: 60, step: 1, value: 20 }, { id: "min", label: "Una misura ogni", min: 1, max: 60, step: 1, value: 5, unit: "min" }, { id: "b", label: "Byte per ogni messaggio", min: 10, max: 200, step: 10, value: 40 }, { id: "costo", label: "Costo di un nodo con sensore di CO₂", min: 30, max: 300, step: 10, value: 80, unit: "€" }],
          outputs: [{ key: "msg", label: "Messaggi al giorno (tutte le aule)", f: (p) => p.aule * (1440 / p.min) }, { key: "mb", label: "Dati in un anno", f: (p, o) => (o.msg * p.b * 365) / 1e6, unit: "MB", d: 1 }, { key: "eur", label: "Costo dei sensori", f: (p) => p.aule * p.costo, unit: "€" }],
          note: (p) => p.min > 15 ? ["warn", "Una misura ogni più di 15 minuti rischia di non vedere quando la CO₂ sale durante una lezione."] : ["ok", "I dati sono pochi: il problema di un sistema IoT di solito non è lo spazio, ma la sicurezza e la manutenzione."] },
        { type: "canvas", fields: [["req", "Che cosa misuri, quanto spesso, con quale precisione", ""], ["arch", "Architettura: sensori → rete → server → chi vede i dati", ""], ["sic", "Sicurezza e privacy: che cosa può andare storto?", "password predefinite, aggiornamenti, chi accede ai dati"]],
          checks: [["Hai previsto di cambiare le password predefinite o aggiornare i dispositivi", (v) => /password|aggiorn|firmware/i.test(v.sic)], ["Hai indicato chi può vedere i dati", (v) => /docent|dirigen|student|pubblic|accesso/i.test(v.sic + v.arch)]],
          out: (v) => `SISTEMA IOT PER LA QUALITÀ DELL'ARIA\n\nRequisiti: ${v.req}\n\nArchitettura: ${v.arch}\n\nSicurezza e privacy: ${v.sic}` } ],
      reflect: "Se i dati mostrassero che un'aula supera spesso i 1.000 ppm, che cosa cambieresti nella giornata scolastica?" }],
  bridge: "Progetta un sistema IoT per monitorare i consumi energetici della scuola: individua i sensori, descrivi l'architettura e spiega come i dati aiuterebbero a risparmiare.",
});
