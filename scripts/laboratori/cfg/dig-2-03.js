LABENGINE.run({
  id: "MC-DIG-2-03", area: "DIG", classe: 2, titolo: "Desktop in ordine", archetipo: "Smistatore",
  hook: "Usare bene il computer è una competenza che si impara. «Relazione finale VERO definitivo 3.docx» è il sintomo di un problema: niente cartelle, niente regole per i nomi, niente backup. Rimettiamo ordine.",
  levels: [
    { brief: "La cartella Download è piena. Sposta ogni file nella cartella giusta della struttura «Scuola».",
      blocks: [
        { type: "sort", categories: [["tec", "Scuola / Tecnologia"], ["mat", "Scuola / Matematica"], ["sci", "Scuola / Scienze"], ["pers", "Personale"], ["del", "Da eliminare", "duplicati e file inutili"]],
          items: [["2026-03-15_tecnologia_relazione-energia_v02.docx", "tec", "Il nome dice tutto: data, materia, argomento, versione."], ["2026-04-01_matematica_esercizi-frazioni.pdf", "mat", ""], ["2026-03-20_scienze_tesina-fotosintesi.docx", "sci", ""], ["foto_compleanno_nonna.jpg", "pers", ""], ["relazione-energia (1).docx", "del", "È un duplicato scaricato due volte: tieni la versione con il nome corretto."], ["setup_installer_vecchio.exe", "del", "Gli installatori già usati occupano spazio."], ["2026-02-10_tecnologia_disegno-scala.pdf", "tec", ""], ["Documento senza titolo.docx", "del", "Aprilo prima di eliminarlo: se serve, rinominalo."]] },
        { type: "quiz", questions: [["Quale nome segue la convenzione [data]_[materia]_[argomento]?", ["Relazione finale definitiva.docx", "15-03-26 tecnologia relazione.docx", "2026-03-15_tecnologia_relazione-energia_v01.docx"], 2, "Data ANNO-MESE-GIORNO, trattino basso fra i blocchi, trattino dentro i blocchi, versione _v01. Niente spazi."],
          ["Perché la data va per prima, in formato anno-mese-giorno?", ["Perché è più corta", "Perché i file si ordinano da soli in ordine cronologico", "Perché lo chiede il sistema operativo"], 1, "«2026-03» viene prima di «2026-04» anche nell'ordine alfabetico."]] } ],
      reflect: "Quanti file ci sono nella cartella principale dei tuoi Documenti? Quanti «finale» o «definitivo» hai trovato?" },
    { brief: "La regola 3-2-1 del backup: 3 copie, su 2 supporti diversi, 1 fuori casa. Valuta i piani di backup di quattro studenti.",
      blocks: [
        { type: "sort", categories: [["ok", "Rispetta la 3-2-1"], ["no", "Non la rispetta"]],
          items: [["Computer + chiavetta USB + cartella sul cloud", "ok", "3 copie, 2 supporti fisici diversi, 1 fuori sede."], ["Computer + seconda cartella sullo stesso computer", "no", "Se si rompe il disco, perdi entrambe le copie."], ["Computer + chiavetta tenuta nello zaino insieme al computer", "no", "Mancano la terza copia e la copia fuori sede: se perdi lo zaino, perdi tutto."], ["Solo il cloud", "no", "Una copia sola, su un solo supporto: se perdi l'accesso all'account, non hai altro."], ["Tablet + disco esterno a casa + cloud", "ok", ""]] },
        { type: "sort", title: "Caratteri vietati nei nomi", categories: [["si", "Va bene nel nome"], ["no", "Da evitare"]],
          items: [["trattino basso _", "si", ""], ["trattino -", "si", ""], ["spazio", "no", "Su alcuni sistemi crea problemi nei percorsi."], ["barra /", "no", "È riservata al sistema operativo per separare le cartelle."], ["due punti :", "no", ""], ["punto interrogativo ?", "no", ""]] } ],
      reflect: "Il tuo lavoro scolastico più importante, in questo momento, quante copie ha?" },
    { label: "Scenario · il progetto di gruppo", brief: "Quattro studenti, due mesi, una relazione, una presentazione, un video e delle immagini. Devono lavorare insieme, sapere sempre qual è l'ultima versione e non perdere nulla. Scrivi le regole del gruppo.",
      blocks: [
        { type: "canvas", fields: [["str", "Struttura delle cartelle", "es. 01_relazione / 02_presentazione / 03_video / 04_immagini / 00_archivio"], ["nomi", "Convenzione dei nomi per ogni tipo di file", ""], ["ver", "Come si gestiscono le versioni", "_v01, _v02… chi decide la versione finale?"], ["bk", "Piano di backup", "regola 3-2-1"], ["resp", "Chi è responsabile di che cosa", ""]],
          checks: [["La convenzione usa la data anno-mese-giorno", (v) => /aaaa|anno|\d{4}-\d{2}/i.test(v.nomi)], ["Le versioni sono numerate", (v) => /v0?\d|versione/i.test(v.ver)], ["Il backup ha almeno una copia fuori sede o cloud", (v) => /cloud|drive|fuori|esterno/i.test(v.bk)], ["Ogni membro ha un compito", (v) => v.resp.split(/[\n,;]/).filter((x) => x.trim()).length >= 4]],
          out: (v) => `REGOLE DEL GRUPPO\n\nCartelle: ${v.str}\nNomi dei file: ${v.nomi}\nVersioni: ${v.ver}\nBackup: ${v.bk}\nResponsabilità: ${v.resp}` } ],
      reflect: "Quale regola sarà più difficile da far rispettare a tutti e quattro? Come la renderesti semplice?" }],
  bridge: "Apri il gestore attività (o Monitoraggio attività su Mac) durante una sessione di lavoro: individua i 5 processi che consumano più RAM e CPU e scopri a che cosa servono.",
});
