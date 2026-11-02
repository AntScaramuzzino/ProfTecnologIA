const APPS = [["os", "Sistema operativo", 2.0], ["br", "Browser con 10 schede", 2.5], ["vid", "Videochiamata", 1.0], ["gioco", "Videogioco", 4.0], ["foto", "Programma di fotoritocco", 2.0], ["musica", "App di musica", 0.3], ["chat", "App di messaggistica", 0.4]];
LABENGINE.run({
  id: "MC-INF-2-01", area: "INF", classe: 2, titolo: "Sei il sistema operativo", archetipo: "Simulatore",
  hook: "Senza sistema operativo il computer è un blocco di silicio. È lui che decide quale programma usa il processore, quanta memoria riceve ciascuno, dove finiscono i file e chi può aprirli.",
  footer: "I consumi di memoria delle app sono valori d'esempio: osserva quelli reali nel gestore attività del tuo dispositivo.",
  levels: [
    { brief: "Il sistema operativo ha cinque compiti principali. Abbina ogni situazione al compito che la risolve.",
      blocks: [
        { type: "sort", categories: [["proc", "Gestione dei processi", "chi usa la CPU"], ["mem", "Gestione della memoria", "RAM"], ["fs", "File system", "file e cartelle"], ["per", "Periferiche", "driver"], ["sic", "Sicurezza e utenti", "permessi"]],
          items: [["Ascolti musica mentre scrivi: entrambi i programmi sembrano funzionare insieme", "proc", "La CPU passa da un processo all'altro così velocemente che sembra parallelo."], ["Apri un'app nuova e il sistema le assegna una parte della RAM", "mem", ""], ["Il file si trova in /Utenti/marco/Documenti/scuola", "fs", "È il percorso nell'albero delle cartelle."], ["Colleghi una stampante e funziona subito", "per", "Il driver traduce i comandi per quella periferica."], ["Un compagno non può aprire la tua cartella personale", "sic", ""], ["Il computer chiede la password all'accensione", "sic", ""]] },
        { type: "quiz", questions: [["Interfaccia grafica o riga di comando?", ["Sono due modi diversi di dare ordini allo stesso sistema operativo", "La riga di comando è un altro sistema operativo", "L'interfaccia grafica è più potente"], 0, "Cliccare un'icona o scrivere un comando produce lo stesso risultato: cambia solo il modo."]] } ],
      reflect: "Qual è il percorso completo della cartella delle foto sul tuo dispositivo?" },
    { brief: "Apri le app e guarda la memoria. Quando la RAM finisce, il sistema sposta dati sul disco (memoria virtuale): funziona, ma tutto rallenta.",
      blocks: [
        { type: "sim", params: [{ id: "ram", label: "RAM installata", options: [[4, "4 GB"], [8, "8 GB"], [16, "16 GB"]], value: 8 }, ...APPS.slice(1).map(([id, l]) => ({ id, label: l, options: [[0, "Chiusa"], [1, "Aperta"]], value: id === "br" || id === "chat" ? 1 : 0 }))],
          outputs: [{ key: "used", label: "Memoria richiesta", f: (p) => APPS.reduce((s, [id, , g]) => s + (id === "os" ? g : p[id] * g), 0), unit: "GB", d: 1 }, { key: "pct", label: "RAM occupata", f: (p, o) => Math.min(100, (o.used / p.ram) * 100), unit: "%" }, { key: "swap", label: "Spostata sul disco", f: (p, o) => Math.max(0, o.used - p.ram), unit: "GB", d: 1 }],
          bars: (p) => APPS.filter(([id]) => id === "os" || p[id]).map(([, l, g]) => [l, g]), barsUnit: "GB", barsD: 1, barsMax: 16, barsTitle: "Chi occupa la memoria",
          note: (p, o) => o.swap > 0 ? ["ko", `Servono ${LABENGINE.fmt(o.used, 1)} GB ma ce ne sono ${p.ram}: ${LABENGINE.fmt(o.swap, 1)} GB finiscono sul disco, che è molto più lento della RAM. Il computer «arranca».`] : o.pct > 85 ? ["warn", "Quasi pieno: aprire un'altra app potrebbe rallentare tutto."] : ["ok", "C'è memoria a sufficienza: tutto fila liscio."] } ],
      reflect: "Nel gestore attività del tuo dispositivo, quale processo occupa più RAM? Ti aspettavi che fosse quello?" },
    { label: "Scenario · il server della redazione", brief: "15 giornalisti, 3 fotografi, 2 editor video. Requisiti: cartella personale privata per ciascuno, articoli in lavorazione condivisi, archivio in sola lettura, foto per anno/mese e per fotografo, video separati, backup a parte. Progetta l'albero e i permessi.",
      blocks: [
        { type: "sort", title: "Che permesso serve?", categories: [["rw", "Lettura e scrittura per tutti"], ["r", "Sola lettura per tutti"], ["priv", "Solo il proprietario"], ["adm", "Solo l'amministratore"]],
          items: [["/redazione/in-lavorazione", "rw", "Tutti devono poter modificare gli articoli in corso."], ["/redazione/archivio-pubblicati", "r", "Nessuno deve poter cambiare un articolo già uscito."], ["/redazione/personali/rossi", "priv", ""], ["/redazione/backup", "adm", "I backup non devono essere toccati per errore."], ["/redazione/foto/2026/11/bianchi", "rw", "I fotografi caricano, i giornalisti scelgono: si può anche limitare la scrittura ai soli fotografi."]] },
        { type: "canvas", fields: [["albero", "L'albero delle cartelle", "una riga per cartella, con rientri"], ["perm", "Permessi di ogni cartella principale", ""], ["bk", "Come funzionano i backup automatici", ""]],
          checks: [["Cartelle personali", (v) => /personal|utent|home/i.test(v.albero)], ["Foto organizzate per anno e mese", (v) => /\d{4}|anno/i.test(v.albero)], ["Video separati dai testi", (v) => /video/i.test(v.albero)], ["Archivio in sola lettura", (v) => /sola lettura|read.?only|solo lettura/i.test(v.perm)]],
          out: (v) => `FILE SYSTEM DELLA REDAZIONE\n\n${v.albero}\n\nPermessi:\n${v.perm}\n\nBackup:\n${v.bk}` } ],
      reflect: "Che cosa succederebbe se tutti avessero permesso di scrittura sull'archivio?" }],
  bridge: "Progetta la struttura di file system per la cartella condivisa della tua classe (25 studenti, 4 materie, materiali di tipo diverso): disegna l'albero e definisci chi può leggere e chi può modificare.",
});
