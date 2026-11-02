const COMB = [["bianco", "bianco", "dritto"], ["nero", "bianco", "sinistra"], ["bianco", "nero", "destra"], ["nero", "nero", "stop"]];
const AZ = [["dritto", "Vai dritto"], ["sinistra", "Ruota a sinistra"], ["destra", "Ruota a destra"], ["stop", "Fermati (incrocio)"]];
LABENGINE.run({
  id: "MC-DIG-3-01", area: "DIG", classe: 3, titolo: "Robot segui-linea", archetipo: "Programmatore",
  hook: "Un robot ha organi di senso (i sensori) e muscoli (gli attuatori). In mezzo c'è un programma che reagisce agli eventi. Quando sbaglia, il debugging è un metodo, non un colpo di fortuna.",
  levels: [
    { brief: "Il micro:bit e il suo robot hanno sensori e attuatori. Classifica i componenti, poi ricostruisci il programma dell'allarme della biblioteca.",
      blocks: [
        { type: "sort", categories: [["sen", "Sensore", "percepisce"], ["att", "Attuatore", "agisce"]],
          items: [["Microfono", "sen", ""], ["Display a LED", "att", ""], ["Accelerometro", "sen", "Misura inclinazione e scosse."], ["Altoparlante (buzzer)", "att", ""], ["Sensore di luce", "sen", ""], ["Motori delle ruote", "att", ""], ["Fotoriflettore a infrarossi per la linea", "sen", "Distingue il nero (assorbe) dal bianco (riflette)."], ["Pulsanti A e B", "sen", "Anche un pulsante è un sensore: rileva la pressione."]] },
        { type: "order", title: "L'allarme della biblioteca", items: [["Evento: quando il microfono rileva un suono forte", "La programmazione a eventi reagisce a ciò che succede."], ["Mostra un'icona sul display", ""], ["Suona un breve avviso", ""], ["Aspetta 2 secondi", "Senza pausa l'allarme suonerebbe in continuazione."], ["Cancella il display", ""]] } ],
      reflect: "Come sceglieresti la soglia di «suono forte» per una biblioteca? Come la verificheresti?" },
    { brief: "Programma il robot segui-linea: per ogni combinazione dei due sensori scegli l'azione. La tabella mostra come si comporta sul percorso di prova.",
      blocks: [
        { type: "sim", params: COMB.map(([l, r], i) => ({ id: "a" + i, label: `Sinistro ${l}, destro ${r}`, options: AZ, value: i === 0 ? "dritto" : i === 1 ? "destra" : i === 2 ? "destra" : "dritto" })),
          outputs: [{ key: "ok", label: "Regole corrette", f: (p) => COMB.filter((c, i) => p["a" + i] === c[2]).length + " su 4" }],
          draw: (p) => `<div class="scroll-x"><table><thead><tr><th>Sensore sinistro</th><th>Sensore destro</th><th>Che cosa vuol dire</th><th>Il tuo robot</th></tr></thead><tbody>${COMB.map(([l, r, a], i) => `<tr><td>${l}</td><td>${r}</td><td>${["la linea è in mezzo", "la linea è a sinistra", "la linea è a destra", "linea trasversale: incrocio o arrivo"][i]}</td><td style="font-weight:700;color:var(${p["a" + i] === a ? "--ok" : "--ko"})">${AZ.find((x) => x[0] === p["a" + i])[1]}</td></tr>`).join("")}</tbody></table></div>`,
          note: (p) => p.a1 === "destra" ? ["ko", "Bug: con il sensore sinistro sul nero la linea si è spostata a sinistra, ma il robot gira a destra e la perde. Documentalo nel registro di debug."] : COMB.every((c, i) => p["a" + i] === c[2]) ? ["ok", "Il robot segue la linea e si ferma all'incrocio."] : ["warn", "Qualche combinazione non è ancora giusta: immagina dove si trova la linea rispetto ai sensori."] },
        { type: "canvas", title: "Registro di debug", fields: [["sint", "Sintomo osservato", "es. in curva il robot esce dalla linea"], ["ipo", "Ipotesi sulla causa", ""], ["test", "Test fatto per verificarla", ""], ["fix", "Correzione e risultato", ""]],
          checks: [["Ipotesi e test sono separati", (v) => v.ipo.length > 10 && v.test.length > 10]], out: (v) => `REGISTRO DI DEBUG\nSintomo: ${v.sint}\nIpotesi: ${v.ipo}\nTest: ${v.test}\nCorrezione: ${v.fix}` } ],
      reflect: "In curva stretta il robot esce comunque. Che cosa cambieresti: la velocità, la posizione dei sensori o il programma?" },
    { label: "Scenario · il corridoio affollato", brief: "Il preside vuole sapere in tempo reale se il corridoio è libero, affollato o sovraffollato, senza telecamere e senza internet. Un sensore conta chi entra e chi esce dalla porta. Imposta le soglie.",
      blocks: [
        { type: "sim", params: [{ id: "ent", label: "Persone entrate", min: 0, max: 200, step: 1, value: 64 }, { id: "usc", label: "Persone uscite", min: 0, max: 200, step: 1, value: 20 }, { id: "s1", label: "Soglia «affollato» da", min: 10, max: 80, step: 5, value: 30, unit: "persone" }, { id: "s2", label: "Soglia «sovraffollato» da", min: 20, max: 120, step: 5, value: 60, unit: "persone" }],
          outputs: [{ key: "n", label: "Persone nel corridoio", f: (p) => Math.max(0, p.ent - p.usc) }, { key: "st", label: "Stato sul display", f: (p, o) => p.s2 <= p.s1 ? "soglie da correggere" : o.n >= p.s2 ? "SOVRAFFOLLATO" : o.n >= p.s1 ? "AFFOLLATO" : "LIBERO" }],
          note: (p) => p.usc > p.ent ? ["ko", "Più uscite che entrate: il contatore ha perso qualcuno (due persone insieme? una che torna indietro?). È un caso da gestire nel programma."] : p.s2 <= p.s1 ? ["ko", "La soglia di sovraffollamento deve essere più alta di quella di affollamento."] : null },
        { type: "check", key: "rob", items: ["Il sistema non usa telecamere né riconoscimento facciale", "Funziona senza connessione internet", "Gestisce il caso di due persone che passano insieme", "Si azzera a ogni cambio dell'ora o su comando", "Ho documentato le soglie scelte e perché", "Ho testato il prototipo con almeno 3 prove reali"],
          result: (n, t) => n === t ? ["ok", "<strong>Progetto completo.</strong>"] : ["warn", `${n} requisiti su ${t}.`] } ],
      reflect: "Quale errore del sensore è più grave: contare una persona in più o una in meno? Perché?" }],
  bridge: "Progetta un robot che risolve un problema reale della scuola (rumore in corridoio, posti in mensa…): scegli sensori e attuatori, scrivi il programma e documenta i test.",
});
