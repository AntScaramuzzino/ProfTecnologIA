const shift = (s, k) => s.toUpperCase().replace(/[ÀÁ]/g, "A").replace(/[ÈÉ]/g, "E").replace(/[ÌÍ]/g, "I").replace(/[ÒÓ]/g, "O").replace(/[ÙÚ]/g, "U").replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k) % 26 + 26) % 26 + 65));
const SEGRETO = shift("LA TECNOLOGIA E UNA FORZA CHE DIPENDE DA CHI LA USA E DA COME VIENE PROGETTATA", 11);
const freq = (s) => { const f = {}; for (const c of s) if (/[A-Z]/.test(c)) f[c] = (f[c] || 0) + 1; return Object.entries(f).sort((a, b) => b[1] - a[1]); };
LABENGINE.run({
  id: "MC-INF-2-02", area: "INF", classe: 2, titolo: "Cripto-lab", archetipo: "Simulatore",
  hook: "Ogni segreto digitale è matematica. Giulio Cesare spostava le lettere di tre posti; oggi i siti usano numeri primi enormi. Prova a cifrare, poi a rompere un cifrario, e capirai perché il lucchetto del browser conta.",
  levels: [
    { brief: "Cifrario di Cesare: ogni lettera si sposta di K posizioni nell'alfabeto inglese di 26 lettere (dopo la Z si ricomincia dalla A). Scrivi un messaggio e scegli la chiave.",
      blocks: [
        { type: "sim", params: [{ id: "m", label: "Messaggio in chiaro", kind: "text", value: "TECNOLOGIA È POTERE" }, { id: "k", label: "Chiave K", min: 1, max: 25, step: 1, value: 3 }],
          outputs: [{ key: "c", label: "Messaggio cifrato", f: (p) => shift(p.m, p.k) }, { key: "d", label: "Ridecifrato con −K", f: (p, o) => shift(o.c, -p.k) }] },
        { type: "sim", title: "Decifra", params: [{ id: "c", label: "Messaggio cifrato", kind: "text", value: "ALJUVSVNPH" }, { id: "k", label: "Chiave che provi", min: 0, max: 25, step: 1, value: 0 }],
          outputs: [{ key: "d", label: "Messaggio decifrato", f: (p) => shift(p.c, -p.k) }],
          challenges: [["Trova la parola nascosta in ALJUVSVNPH", (p, o) => o.d === "TECNOLOGIA", "Prova le chiavi una alla volta: al massimo sono 25.", "La chiave era 7. Hai appena fatto un attacco a forza bruta."]] },
        { type: "quiz", questions: [["Senza conoscere la chiave, quanti tentativi servono al massimo per rompere il cifrario di Cesare?", ["25", "26 × 26", "infiniti"], 0, "Le chiavi utili sono solo 25 (K = 26 riporta il messaggio uguale). È il punto debole fondamentale."]] } ],
      reflect: "Il cifrario di Cesare protegge un messaggio da un compagno curioso? E da un computer?" },
    { brief: "Analisi delle frequenze: in italiano alcune lettere (E, A, I, O) compaiono molto più spesso delle altre. Nel testo cifrato le lettere più frequenti tradiscono la chiave. Prova!",
      blocks: [
        { type: "sim", params: [{ id: "k", label: "Chiave che provi", min: 0, max: 25, step: 1, value: 0 }],
          outputs: [{ key: "c", label: "Testo intercettato", f: () => SEGRETO }, { key: "top", label: "Lettere più frequenti nel cifrato", f: () => freq(SEGRETO).slice(0, 4).map((x) => x[0]).join(", ") }, { key: "d", label: "Testo con la tua chiave", f: (p) => shift(SEGRETO, -p.k) }],
          bars: () => freq(SEGRETO).slice(0, 8).map(([l, n]) => [l, n]), barsTitle: "Frequenza delle lettere nel testo cifrato",
          challenges: [["Decifra il messaggio", (p) => p.k === 11, "Ipotizza che la lettera più frequente del cifrato corrisponda a una vocale frequente come A o E, e calcola lo spostamento.", "Chiave 11: la lettera più frequente nel cifrato corrispondeva a una vocale comune."]] },
        { type: "sort", title: "Crittografia simmetrica o asimmetrica?", categories: [["sim", "Simmetrica", "una chiave sola"], ["asi", "Asimmetrica", "chiave pubblica + chiave privata"]],
          items: [["Cesare: la stessa chiave cifra e decifra", "sim", ""], ["Chiunque può cifrare un messaggio per te con la tua chiave pubblica, ma solo tu lo apri con la privata", "asi", ""], ["Il problema è scambiarsi la chiave in modo sicuro", "sim", "Se qualcuno intercetta la chiave, legge tutto."], ["HTTPS usa questo metodo all'inizio della connessione per accordarsi su una chiave", "asi", "Poi la connessione prosegue con una chiave simmetrica, più veloce."]] } ],
      reflect: "Perché un testo lungo è più facile da rompere con l'analisi delle frequenze di una parola sola?" },
    { label: "Scenario · l'app della biblioteca", brief: "Gli studenti accedono a prestiti, prenotazioni e libri digitali. I dati comprendono nome, classe e storico di lettura. Progetta la sicurezza.",
      blocks: [
        { type: "quiz", questions: [
          ["Come vanno salvate le password nel database?", ["In chiaro, così si possono recuperare", "Cifrate con una chiave salvata accanto", "Come hash con salt: un'impronta da cui non si risale alla password"], 2, "L'hash è a senso unico. Il salt (un valore casuale diverso per ogni utente) impedisce di usare tabelle di hash già calcolate."],
          ["Uno studente dimentica la password. Che cosa fa un sistema sicuro?", ["Gliela invia per email", "Gli invia un link temporaneo per crearne una nuova", "La comunica al bibliotecario"], 1, "Se il sistema potesse inviare la password, vorrebbe dire che la conosce: non dovrebbe."],
          ["Lo storico di lettura è un dato…", ["da proteggere: può rivelare interessi e convinzioni personali", "pubblico", "irrilevante"], 0, "Raccogli solo i dati che servono e decidi per quanto tempo conservarli."]] },
        { type: "canvas", fields: [["min", "5 rischi di sicurezza (modello di minaccia)", "password rubata, account condiviso, dispositivo lasciato aperto…"], ["auth", "Il sistema di accesso", "password, 2FA, recupero"], ["dati", "Quali dati conservi e per quanto tempo", ""]],
          checks: [["Almeno 5 rischi", (v) => v.min.split(/[\n,;]/).filter((x) => x.trim()).length >= 5], ["Prevedi un secondo fattore o un recupero sicuro", (v) => /2fa|due fattori|secondo fattore|link|codice/i.test(v.auth)], ["Indichi un tempo di conservazione", (v) => /\d|anno|mesi|fine/i.test(v.dati)]],
          out: (v) => `SICUREZZA DELL'APP DELLA BIBLIOTECA\n\nRischi:\n${v.min}\n\nAccesso:\n${v.auth}\n\nDati e conservazione:\n${v.dati}` } ],
      reflect: "Qual è il rischio più probabile nella tua scuola: un attacco informatico o un account lasciato aperto?" }],
  bridge: "Analizza la sicurezza di tre siti che usi: verifica HTTPS, leggi le informazioni del certificato digitale e scrivi una breve valutazione di ciascuno.",
});
