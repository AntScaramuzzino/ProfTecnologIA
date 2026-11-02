const TRAIN = [["Questo film è bellissimo", "P"], ["Ottimo servizio, tornerò", "P"], ["Prodotto fantastico, lo raccomando", "P"], ["Esperienza meravigliosa", "P"], ["Molto soddisfatto dell'acquisto", "P"], ["Pessimo, non funziona niente", "N"], ["Terribile esperienza, mai più", "N"], ["Prodotto difettoso, deluso", "N"], ["Servizio orribile, ore di attesa", "N"], ["Completamente inutile, rimandato", "N"]];
const tok = (s) => s.toLowerCase().replace(/[.,!?;:"«»]/g, " ").replace(/dell'/g, "").split(/\s+/).filter(Boolean);
const CNT = { P: {}, N: {} }, TOT = { P: 0, N: 0 };
TRAIN.forEach(([s, l]) => tok(s).forEach((w) => { CNT[l][w] = (CNT[l][w] || 0) + 1; TOT[l]++; }));
const score = (s, l) => tok(s).reduce((a, w) => a + (CNT[l][w] || 0) / TOT[l], 0);
LABENGINE.run({
  id: "MC-INF-3-02", area: "INF", classe: 3, titolo: "Addestra il classificatore", archetipo: "Laboratorio dati",
  hook: "Le macchine non pensano: ottimizzano. Un classificatore impara dagli esempi che gli dai, compresi i loro difetti. Costruiscine uno con dieci frasi e scopri dove sbaglia, e perché.",
  footer: "Classificatore e dataset del livello base sono quelli del testo della MC; i dati del livello intermedio sono inventati.",
  levels: [
    { brief: "Il modello ha imparato da 10 frasi del libro (5 positive, 5 negative). Per ogni parola calcola P(parola | classe) = volte che compare in quella classe ÷ parole totali della classe, e somma. Vince la classe con la somma più alta. Scrivi una frase e guarda come decide.",
      blocks: [
        { type: "sim", params: [{ id: "s", label: "Frase da classificare", kind: "text", value: "Servizio bellissimo, molto soddisfatto" }],
          presets: [["Frase di test 1", { s: "Servizio bellissimo, molto soddisfatto" }], ["Frase di test 2", { s: "Prodotto pessimo, esperienza terribile" }], ["Frase di test 3", { s: "Ottimo ma difettoso in alcuni punti" }], ["Parole mai viste", { s: "La pizza era fredda" }]],
          outputs: [{ key: "p", label: "Punteggio positivo", f: (p) => score(p.s, "P"), d: 3 }, { key: "n", label: "Punteggio negativo", f: (p) => score(p.s, "N"), d: 3 }, { key: "c", label: "Classe scelta", f: (p, o) => o.p > o.n ? "Positivo" : o.n > o.p ? "Negativo" : "Pari: il modello non sa decidere" }],
          draw: (p) => `<div class="scroll-x"><table><thead><tr><th>Parola</th><th>Volte nelle positive (su ${TOT.P})</th><th>Volte nelle negative (su ${TOT.N})</th></tr></thead><tbody>${tok(p.s).map((w) => `<tr><td>${w}</td><td class="mono">${CNT.P[w] || 0}</td><td class="mono">${CNT.N[w] || 0}</td></tr>`).join("")}</tbody></table></div>`,
          note: (p, o) => o.p === 0 && o.n === 0 ? ["warn", "Nessuna parola della frase compare negli esempi: il modello non ha niente su cui basarsi. Servono più dati."] : /ottimo.*difettoso|difettoso.*ottimo/i.test(p.s) ? ["warn", "«Ottimo» spinge verso positivo, «difettoso» verso negativo: il modello somma le parole e non capisce il «ma». Non conosce il significato della frase."] : null } ],
      reflect: "Perché il modello sbaglia o esita sulla terza frase? Che cosa gli manca rispetto a una persona?" },
    { brief: "Un'università inventata ha ricevuto 200 candidature. Le ammissioni sembrano diverse per provenienza. Ma la differenza dipende dalla provenienza o da altro?",
      blocks: [
        { type: "chart", title: "Tasso di ammissione per provenienza", kind: "bar", toggles: false, d: 0, xlabel: "provenienza", ylabel: "% ammessi", series: [{ name: "Tutti i candidati", data: [["Nord", 55], ["Sud", 40], ["Estero", 30]] }, { name: "Solo con voto di diploma ≥ 90", data: [["Nord", 80], ["Sud", 80], ["Estero", 75]] }] },
        { type: "info", html: "<div class=\"scroll-x\"><table><thead><tr><th>Provenienza</th><th>Candidati</th><th>Ammessi</th><th>Con voto ≥ 90</th><th>Ammessi fra questi</th></tr></thead><tbody><tr><td>Nord</td><td class=\"mono\">120</td><td class=\"mono\">66</td><td class=\"mono\">50</td><td class=\"mono\">40</td></tr><tr><td>Sud</td><td class=\"mono\">60</td><td class=\"mono\">24</td><td class=\"mono\">20</td><td class=\"mono\">16</td></tr><tr><td>Estero</td><td class=\"mono\">20</td><td class=\"mono\">6</td><td class=\"mono\">4</td><td class=\"mono\">3</td></tr></tbody></table></div>" },
        { type: "quiz", questions: [
          ["Qual è il tasso di ammissione complessivo?", ["48%", "41%", "55%"], 0, "(66 + 24 + 6) ÷ 200 = 96 ÷ 200 = 48%."],
          ["A parità di voto alto, le differenze fra Nord e Sud…", ["restano uguali", "quasi spariscono"], 1, "80% e 80%: gran parte della differenza dipende da quanti candidati con voto alto ci sono in ogni gruppo."],
          ["Allora non c'è nessun problema di equità?", ["Esatto, nessuno", "Non è detto: perché al Sud ci sono meno voti alti? I dati spostano la domanda, non la chiudono"], 1, "Un tasso diverso non prova da solo una discriminazione, ma nemmeno la esclude: va cercata la causa."],
          ["Un modello addestrato su queste ammissioni passate imparerebbe…", ["a essere imparziale", "a ripetere gli stessi schemi del passato"], 1, "Il modello riproduce i dati da cui impara."]] } ],
      reflect: "Quali altri dati vorresti avere prima di giudicare se il sistema di ammissione è equo?" },
    { label: "Scenario · i cassieri del supermercato", brief: "Una catena vuole un algoritmo che preveda l'afflusso ora per ora e decida quanti cassieri attivare, aggiornato ogni settimana. Progetta un sistema responsabile.",
      blocks: [
        { type: "order", title: "La pipeline del machine learning", items: [["Definire il problema e come misurare il successo", ""], ["Raccogliere e pulire i dati", "Scontrini per ora, giorni festivi, meteo, eventi in città…"], ["Addestrare il modello su una parte dei dati", ""], ["Testarlo su dati che non ha mai visto", "Altrimenti si misura solo quanto ha memorizzato."], ["Metterlo in uso e monitorare errori e conseguenze", ""], ["Aggiornarlo con dati nuovi, controllando che non peggiori", ""]] },
        { type: "canvas", fields: [["dati", "Dati necessari, e quali potrebbero mancare o essere sbagliati", ""], ["bias", "Dove sarà meno preciso (giorni, orari, eventi)?", ""], ["lav", "Conseguenze per i lavoratori: turni, preavviso, ore", ""], ["uomo", "Chi controlla le decisioni e può correggerle", ""]],
          checks: [["Hai considerato eventi rari (festività, scioperi, partite)", (v) => /fest|evento|sciopero|partit|natale|pasqua/i.test(v.bias)], ["Hai pensato ai lavoratori", (v) => v.lav.length > 20], ["C'è una persona che supervisiona", (v) => /responsab|manager|direttor|umano|persona|supervis/i.test(v.uomo)]],
          out: (v) => `SISTEMA DI IA RESPONSABILE\n\nDati: ${v.dati}\nLimiti e bias: ${v.bias}\nLavoratori: ${v.lav}\nSupervisione umana: ${v.uomo}` } ],
      reflect: "Se il modello sbaglia una domenica di dicembre, chi ne paga le conseguenze? Come lo eviteresti?" }],
  bridge: "Analizza tre algoritmi di raccomandazione che usi (musica, video, social): descrivi come funzionano, individua un possibile bias e proponi come renderli più trasparenti.",
});
