LABENGINE.run({
  id: "MC-ENE-3-04", area: "ENE", classe: 3, titolo: "Breadboard virtuale", archetipo: "Simulatore",
  hook: "Tensione, corrente, resistenza: tre grandezze legate da una legge sola, V = R × I. Con questa legge scegli la resistenza giusta per un LED, prima di bruciarlo, e progetti una lampada che si accende da sola al buio.",
  footer: "Calcoli secondo la legge di Ohm. Caduta di tensione del LED e valori della fotoresistenza sono tipici: verifica le schede tecniche dei tuoi componenti.",
  levels: [
    { brief: "Il circuito del libro: batteria da 9 V, resistore, LED rosso. Il LED «usa» circa 2 V; il resto della tensione cade sul resistore, che limita la corrente. Un LED comune lavora bene intorno ai 20 mA.",
      blocks: [
        { type: "sim", params: [{ id: "v", label: "Tensione della batteria", options: [[3, "3 V"], [4.5, "4,5 V"], [5, "5 V (USB)"], [9, "9 V"]], value: 9 }, { id: "r", label: "Resistenza", min: 47, max: 2200, step: 1, value: 330, unit: "Ω" }, { id: "vf", label: "Colore del LED", options: [[2, "Rosso (circa 2 V)"], [2.2, "Giallo (circa 2,2 V)"], [3.2, "Blu o bianco (circa 3,2 V)"]], value: 2 }],
          presets: [["330 Ω (arancio-arancio-marrone)", { r: 330 }], ["100 Ω", { r: 100 }], ["1 kΩ", { r: 1000 }]],
          outputs: [{ key: "i", label: "Corrente", f: (p) => Math.max(0, (p.v - p.vf) / p.r) * 1000, unit: "mA", d: 1 }, { key: "pr", label: "Potenza sul resistore", f: (p, o) => p.r * Math.pow(o.i / 1000, 2) * 1000, unit: "mW" }],
          note: (p, o) => p.v <= p.vf ? ["ko", "La tensione non basta ad accendere questo LED."] : o.i > 30 ? ["ko", `${LABENGINE.fmt(o.i, 1)} mA: troppi, il LED rischia di bruciarsi. Aumenta la resistenza.`] : o.i < 5 ? ["warn", "Il LED si accende appena: la resistenza è troppo alta."] : ["ok", `${LABENGINE.fmt(o.i, 1)} mA: il LED si accende bene in sicurezza.`],
          challenges: [["Trova la resistenza minima per un LED blu a 5 V senza superare 20 mA", (p, o) => p.v === 5 && p.vf === 3.2 && o.i <= 20 && o.i >= 17, "R = (V − V_LED) ÷ I = (5 − 3,2) ÷ 0,020.", "90 Ω: nella pratica si sceglie il valore commerciale subito sopra, 100 Ω."]] } ],
      reflect: "Hai verificato in Tinkercad Circuits che la corrente calcolata coincide con quella simulata?" },
    { brief: "Due resistori in serie o in parallelo: calcola la resistenza equivalente e la corrente con una batteria da 9 V.",
      blocks: [
        { type: "sim", params: [{ id: "r1", label: "R1", min: 10, max: 2000, step: 10, value: 330, unit: "Ω" }, { id: "r2", label: "R2", min: 10, max: 2000, step: 10, value: 330, unit: "Ω" }, { id: "c", label: "Collegamento", options: [["s", "In serie"], ["p", "In parallelo"]], value: "s" }],
          outputs: [{ key: "req", label: "Resistenza equivalente", f: (p) => p.c === "s" ? p.r1 + p.r2 : (p.r1 * p.r2) / (p.r1 + p.r2), unit: "Ω", d: 1 }, { key: "i", label: "Corrente totale a 9 V", f: (p, o) => (9 / o.req) * 1000, unit: "mA", d: 1 }],
          note: (p) => p.c === "s" ? ["ok", "In serie la corrente è la stessa in tutti i componenti e le resistenze si sommano: se uno si interrompe, si ferma tutto (come le vecchie lucine di Natale)."] : ["ok", "In parallelo ogni ramo ha la stessa tensione: la resistenza equivalente è minore della più piccola. È il collegamento delle prese di casa."] },
        { type: "quiz", questions: [
          ["Misuri con il multimetro la corrente nel circuito del LED. Come colleghi lo strumento?", ["In serie, interrompendo il circuito", "In parallelo al LED"], 0, "L'amperometro deve essere attraversato dalla corrente. Il voltmetro, invece, si collega in parallelo."],
          ["Il pulsante va collegato…", ["in serie, nel percorso del filo positivo", "in parallelo alla batteria"], 0, "In parallelo alla batteria creerebbe un cortocircuito quando lo premi."]] } ],
      reflect: "Sulla breadboard, la corrente misurata era uguale a quella calcolata? Se no, perché?" },
    { label: "Scenario · la lampada crepuscolare", brief: "Arduino legge la tensione nel punto fra il resistore da 10 kΩ e la fotoresistenza (LDR) collegata a massa. Al buio l'LDR ha resistenza alta, alla luce bassa. Scegli la soglia per accendere il LED.",
      blocks: [
        { type: "sim", params: [{ id: "ldr", label: "Resistenza dell'LDR adesso", min: 0.5, max: 200, step: 0.5, value: 50, unit: "kΩ", help: "Tipicamente circa 1 kΩ in piena luce, decine o centinaia di kΩ al buio." }, { id: "s", label: "Soglia nel programma (0-1023)", min: 0, max: 1023, step: 1, value: 600 }],
          outputs: [{ key: "v", label: "Tensione su A0", f: (p) => (5 * p.ldr) / (10 + p.ldr), unit: "V", d: 2 }, { key: "a", label: "Valore letto da analogRead()", f: (p, o) => Math.round((o.v / 5) * 1023) }, { key: "led", label: "LED", f: (p, o) => o.a > p.s ? "ACCESO" : "spento" }],
          line: { from: 0.5, to: 200, steps: 60, xlabel: "resistenza LDR (kΩ)", ylabel: "analogRead", series: [{ name: "Valore letto", f: (p, x) => Math.round((5 * x / (10 + x)) / 5 * 1023) }, { name: "Soglia", f: (p) => p.s }] },
          note: (p) => ["ok", `Programma: <span class="mono">if (analogRead(A0) > ${p.s}) digitalWrite(LED, HIGH); else digitalWrite(LED, LOW);</span>`] },
        { type: "quiz", questions: [["Al tramonto il LED si accende e si spegne di continuo. Come si risolve?", ["Con due soglie diverse per accendere e spegnere (isteresi)", "Cambiando colore al LED", "Togliendo il resistore"], 0, "Una soglia di accensione e una un po' più bassa di spegnimento evitano lo sfarfallio vicino al valore limite."]] } ],
      reflect: "Come sceglieresti la soglia nella tua stanza? Quali misure faresti prima?" }],
  bridge: "Costruisci una lampada intelligente con Arduino o micro:bit che si accende da sola al buio (sensore LDR) e si spegne con la luce; documenta schema, programma e prove.",
});
