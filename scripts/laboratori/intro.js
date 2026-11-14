// Infografica di presentazione del laboratorio: si costruisce dalla pagina stessa
// (titolo, archetipo, consegne dei tre livelli, attività, verifiche, ponte verso il compito di realtà)
// e si inserisce fra l'intestazione e le schede dei livelli. Si può ridurre (preferenza salvata per laboratorio).
(function () {
  const wrap = document.querySelector(".wrap"); const head = document.querySelector(".lab-head"); const tabs = document.querySelector(".tabs");
  if (!wrap || !head || !tabs || document.querySelector(".intro")) return;
  const chip = head.querySelector(".chip")?.textContent || ""; const ID = (chip.match(/MC-[A-Z]{3}-\d-\d\d/) || [""])[0];
  const arch = ((head.querySelector(".chip.lab")?.textContent || "").split("·")[1] || "").trim();
  const KEY = ID + ":intro-chiusa";
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const mk = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const get = (k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  // Icone (tratto 2, 24×24)
  const P = {
    sim: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    sort: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17.5h7M17.5 14v7"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>',
    order: '<path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
    compare: '<path d="M12 3v18M5 7l-3 6a3 3 0 0 0 6 0L5 7zM19 7l-3 6a3 3 0 0 0 6 0l-3-6zM5 7h14"/>',
    scenario: '<path d="M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9"/>',
    inspect: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6M11 8v6"/>',
    canvas: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    chart: '<path d="M3 3v18h18M7 15l4-4 3 3 5-6"/>',
    check: '<path d="M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    build: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M21 7l-9 5-9-5"/>',
    calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h4"/>',
    code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
    draw: '<path d="M3 21l6-6M14 4l6 6-9 9H5v-6z"/>',
    flow: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M6 9v3a3 3 0 0 0 3 3h6"/>',
    gauge: '<path d="M12 14l4-4M3.3 19a10 10 0 1 1 17.4 0"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    medal: '<circle cx="12" cy="15" r="6"/><path d="M8.5 10.5L6 2h4l2 4 2-4h4l-2.5 8.5M12 13v4"/>',
  };
  // Quadrante d'orologio: lo spicchio colorato mostra i minuti su un'ora intera (impatto visivo: «è poco»)
  const pie = (min, size) => {
    const a = Math.min(59.9, min) / 60 * 2 * Math.PI, r = 10, x = 12 + r * Math.sin(a), y = 12 - r * Math.cos(a);
    return `<svg class="intro-pie" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" class="pie-face"/>${[0, 1, 2, 3].map((q) => `<line x1="12" y1="2.2" x2="12" y2="4" class="pie-tick" transform="rotate(${q * 90} 12 12)"/>`).join("")}<path d="M12 12 L12 2 A10 10 0 ${a > Math.PI ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z" class="pie-slice"/><circle cx="12" cy="12" r="1.3" class="pie-dot"/></svg>`;
  };
  const icon = (k, cls) => `<svg class="${cls || "ic"}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k] || P.info}</svg>`;
  const KIND = { sim: "Simulazione", sort: "Smista", quiz: "Domande", order: "Metti in ordine", compare: "Confronta", scenario: "Scenario a bivi", inspect: "Ispeziona", canvas: "Progetta e scrivi", chart: "Leggi i dati", check: "Lista di controllo", info: "Scheda", build: "Costruisci" };
  const ARCH = {
    "Simulatore": ["sim", "Cambi i parametri e osservi subito l'effetto, come in un esperimento."],
    "Banco prova": ["gauge", "Metti alla prova materiali e oggetti, leggi i risultati dei test e scegli il più adatto."],
    "Costruttore": ["build", "Componi un sistema pezzo per pezzo e verifichi se funziona."],
    "Calcolatore": ["calc", "Usi le formule del libro su dati concreti e confronti i risultati."],
    "Smistatore": ["sort", "Riconosci e classifichi oggetti, materiali e casi concreti."],
    "Ispettore": ["inspect", "Osservi con attenzione, trovi le parti sospette o sbagliate e scopri perché."],
    "Scenario": ["scenario", "Prendi decisioni in una situazione realistica e ne vedi le conseguenze."],
    "Programmatore": ["code", "Metti in ordine le istruzioni di un algoritmo e lo segui passo per passo, come farebbe una macchina."],
    "Tavolo grafico": ["draw", "Leggi e confronti rappresentazioni tecniche e applichi le regole del disegno."],
    "Flussi": ["flow", "Segui un processo dall'inizio alla fine: ingressi, fasi e uscite."],
    "Laboratorio dati": ["chart", "Leggi grafici e tabelle, trovi tendenze e tiri conclusioni."],
    "Canvas": ["canvas", "Progetti un'idea tua su una traccia guidata e ne valuti la qualità."],
    "Comparatore": ["compare", "Confronti alternative con criteri chiari e scegli la migliore."],
  };
  const PILOTI = {
    "MC-DIG-1-03": [["sort"], ["order", "sim"], ["canvas", "sim"]],
    "MC-DIG-2-04": [["inspect"], ["sim", "check"], ["canvas"]],
    "MC-DIS-2-01": [["sim", "quiz"], ["sim", "quiz"], ["build"]],
    "MC-ENE-3-01": [["sort"], ["sim", "quiz"], ["scenario"]],
    "MC-MAT-1-04": [["sort"], ["inspect"], ["canvas"]],
  };
  // Obiettivi scritti a mano dove la consegna non comincia con un'azione chiara
  const GOALS = {"MC-ALI-2-01": {"3": "Con 5.000 € del Comune, scegli fra orto in terra e idroponica per dare basilico alla mensa."}, "MC-ALI-2-03": {"2": "Leggi il grafico del diario alimentare di Luca e rispondi alle domande."}, "MC-ALI-2-06": {"3": "Nel comitato etico della scuola vota tre prodotti food-tech per la mensa e guarda come cambiano sicurezza, ambiente e fiducia."}, "MC-AMB-2-03": {"3": "Prepara una proposta per migliorare un quartiere: problema misurato, persone coinvolte, soluzione, costi e tempi."}, "MC-AMB-2-04": {"2": "Confronta due appartamenti di Milano, degli anni '70 e del 2022: quanto calore passa da pareti e finestre?", "3": "Scegli il pacchetto di interventi per portare una scuola degli anni '60 sotto i 50 kWh/m² all'anno."}, "MC-AMB-2-05": {"3": "Con 50 milioni di euro, componi il pacchetto di interventi per una città costiera minacciata dalla siccità."}, "MC-AMB-2-06": {"3": "Progetta un sistema civic tech per il quartiere: dati aperti, niente dati personali, 50.000 € di budget."}, "MC-COM-3-05": {"2": "Valuta la proposta di legge che rallenterebbe i video delle piattaforme straniere.", "3": "Prevedi il ritardo minimo di una connessione lontana e confrontalo con le misure di traceroute."}, "MC-DIG-2-02": {"3": "Per una settimana un'app ti chiede qualcosa ogni giorno: scegli e guarda l'equilibrio fra privacy e comodità."}, "MC-DIG-2-04": {"1": "Apri i messaggi della casella simulata, trova le parti sospette e decidi: phishing o legittimo?", "3": "Prepara 15 minuti di formazione anti-phishing: componi un messaggio simulato e scopri che cosa cambia con l'IA."}, "MC-DIG-2-05": {"2": "Nel gruppo della classe compare lo screenshot di una conversazione privata: decidi che cosa fai."}, "MC-DIG-3-02": {"2": "Leggi i dati sugli errori di COMPAS, un algoritmo usato nei tribunali statunitensi, e valuta se è equo."}, "MC-DIG-3-03": {"1": "Leggi il grafico della temperatura di un'aula, misurata ogni ora dalle 8 alle 17 per tre giorni.", "3": "Analizza quattordici giorni di PM2.5 di una centralina di quartiere e confrontali con il valore guida dell'OMS."}, "MC-DIS-3-01": {"2": "Rispondi alle domande su assonometria e prospettiva, poi riordina le fasi del design thinking.", "3": "Progetta un porta-matite che risolva problemi veri, entro i vincoli dell'azienda."}, "MC-ENE-3-01": {"1": "Riconosci la macchina semplice nascosta in ogni oggetto.", "3": "Solleva una pietra da 500 kg a 4 metri d'altezza con 10 operai, scegliendo le macchine semplici giuste."}, "MC-ENE-3-02": {"3": "Attiva tre scenari per la tua famiglia (auto elettrica, fotovoltaico, isolamento) e confronta CO₂ risparmiata e costo."}, "MC-ENE-3-03": {"3": "Calcola se il fotovoltaico della scuola conviene davvero: il punto chiave è l'autoconsumo."}, "MC-ENE-3-04": {"1": "Cambia resistenza, tensione e colore del LED e trova il resistore che lo fa lavorare intorno ai 20 mA."}, "MC-ENE-3-06": {"2": "Calcola se alla famiglia del libro conviene una batteria per il fotovoltaico."}, "MC-INF-1-01": {"1": "Accendi gli interruttori giusti per scrivere il tuo nome in codice ASCII.", "3": "Calcola quanti bit servono per le misure di un sensore di temperatura e quanto traffico produce."}, "MC-INF-1-02": {"1": "Rimetti in ordine i passi di un algoritmo perché una macchina possa eseguirlo alla lettera.", "2": "Traccia a mano l'esecuzione di un algoritmo su una lista di numeri."}, "MC-INF-3-02": {"2": "Analizza le ammissioni di un'università inventata: la differenza dipende dalla provenienza o da altro?"}, "MC-MAT-1-01": {"3": "Pesa i criteri e scegli il materiale per 200 nuove panchine del parco."}, "MC-MAT-1-05": {"1": "Con la prova della calamita e il colore, riconosci il metallo di 8 oggetti.", "3": "Scegli il materiale per 40 paline del centro storico, secondo il capitolato del Comune."}, "MC-MAT-1-06": {"1": "Dai risultati dei test e dalle etichette, decidi se la fibra è naturale o sintetica."}, "MC-SIS-3-02": {"3": "Un'azienda chiude uno stabilimento: prendi il punto di vista di ogni attore e guarda come cambiano gli indicatori."}, "MC-SIS-3-04": {"1": "Classifica le competenze richieste negli annunci di lavoro: tecniche o trasversali?"}};
  const LV = [["F", "Base", "●"], ["I", "Intermedio", "●●"], ["A", "Avanzato", "●●●"]];

  // Che cosa si fa nel livello: la prima frase della consegna che comincia con un verbo all'imperativo
  const IMP = /^(Poi,?\s+)?(Scegli|Classifica|Leggi|Abbina|Usa|Confronta|Imposta|Calcola|Progetta|Tocca|Ricostruisci|Prova|Pesa|Scrivi|Devi|Rimetti|Cambia|Sposta|Guarda|Valuta|Apri|Dimensiona|Analizza|Raccogli|Metti|Misura|Prepara|Inserisci|Simula|Programma|Fai|Costruisci|Parti|Mettili|Stima|Ridisegna|Riconoscile|Trova|Colora|Proponi|Rendi|Regola|Leggila|Cerca|Documenta|Aggiungi|Leggilo|Premi|Inizia|Ispeziona|Disegna|Osserva|Segna|Ordina|Componi|Collega|Verifica|Spunta)\b/;
  const goalOf = (text, max) => {
    // frasi: si spezza solo su . ! ? seguiti da spazio e maiuscola (non dentro i numeri come 5.000)
    const ss = text.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+(?=[A-ZÀ-Ü«"])/).map((x) => x.trim()).filter(Boolean);
    const k = ss.findIndex((x) => IMP.test(x));
    let g = k >= 0 ? ss[k] : ss[0] || "";
    if (k > 0 && (g.length < 28 || /\b(quale|quello|quella|quelli|Mettili|Riconoscile|Leggila|Leggilo)\b/.test(g))) g = ss[k - 1] + " " + g; // frase troppo corta: si aggiunge il contesto
    g = g.replace(/^Poi,?\s+(\S)/, (m, c) => c.toUpperCase());
    return g.length > max ? g.slice(0, max).replace(/\s+\S*$/, "") + "…" : g;
  };
  const firstSentence = (s, max) => { s = s.replace(/\s+/g, " ").trim(); const m = s.match(/^.*?[.!?](\s|$)/); let r = (m ? m[0] : s).trim(); if (r.length > max) r = r.slice(0, max).replace(/\s+\S*$/, "") + "…"; return r; };
  const levels = LV.map(([code, name, dots], i) => {
    const p = document.getElementById("p" + (i + 1)); if (!p) return null;
    const brief = p.querySelector(".brief"); const lbl = brief?.querySelector(".lbl")?.textContent.trim() || "";
    const text = brief ? [...brief.querySelectorAll("p")].map((x) => x.textContent).join(" ") : "";
    let titolo = /·/.test(lbl) ? lbl.split("·").slice(1).join("·").trim() : "";
    titolo = titolo.charAt(0).toUpperCase() + titolo.slice(1);
    let kinds = [...p.querySelectorAll(":scope > .bench[data-kind]")].map((b) => b.dataset.kind);
    if (!kinds.length && PILOTI[ID]) kinds = PILOTI[ID][i];
    kinds = [...new Set(kinds)];
    const nAtt = Math.max(1, p.querySelectorAll(":scope > .bench").length);
    const nq = (window.LABVERIFICA && window.LABVERIFICA[code] && window.LABVERIFICA[code].length) ? Math.min(4, window.LABVERIFICA[code].length) : 0;
    const best = get(`${ID}:verifica:${code}`);
    return { i, code, name, dots, titolo, goal: (GOALS[ID] && GOALS[ID][i + 1]) || goalOf(text, 150), kinds, min: Math.max(5, Math.round((nAtt * 4 + (nq ? 2 : 0)) / 5) * 5), nq, best };
  }).filter(Boolean);
  if (levels.length !== 3) return;
  const [aIc, aTxt] = ARCH[arch] || ["target", "Impari facendo, con un riscontro immediato su ogni scelta."];
  const totMin = levels.reduce((s, l) => s + l.min, 0);
  const bridge = document.querySelector(".bridge p")?.textContent.trim() || "";

  const sec = mk("section", "intro"); sec.setAttribute("aria-label", "Presentazione del laboratorio");
  const top = mk("div", "intro-top", `
    <div class="intro-badge">${icon(aIc, "ic-xl")}</div>
    <div class="intro-what">
      <span class="intro-k">Il laboratorio in breve${arch ? " · " + esc(arch) : ""}</span>
      <p>${esc(aTxt)}</p>
      <ul class="intro-facts">
        <li>${icon("target")}<span><b>3 livelli</b> dal guidato alla sfida</span></li>
        <li>${pie(totMin, 22)}<span>circa <b>${totMin} minuti</b> in tutto</span></li>
        <li>${icon("medal")}<span><b>verifica</b> di 4 domande a ogni livello</span></li>
      </ul>
    </div>`);
  const path = mk("ol", "intro-path");
  levels.forEach((l) => {
    const passed = l.best && l.best.total && l.best.score / l.best.total >= 0.7;
    const li = mk("li", "intro-step" + (passed ? " done" : ""));
    li.innerHTML = `
      <button type="button" class="intro-card" data-tab="${l.i + 1}" aria-label="Vai al livello ${l.name}">
        <span class="intro-lv"><span class="intro-dots" aria-hidden="true">${l.dots}</span>${l.name}${passed ? '<span class="intro-ok">✓ superato</span>' : ""}</span>
        ${l.titolo ? `<span class="intro-t">${esc(l.titolo)}</span>` : ""}
        <span class="intro-g">${esc(l.goal)}</span>
        <span class="intro-kinds">${l.kinds.map((k) => `<span class="intro-kind">${icon(k)}${esc(KIND[k] || "Attività")}</span>`).join("")}</span>
        <span class="intro-foot">${pie(l.min, 22)} <b class="intro-min">${l.min} min</b>${l.nq ? ` · ${icon("medal")} verifica ${l.nq} domande` : ""}${l.best ? ` · record ${l.best.score}/${l.best.total}` : ""}</span>
      </button>`;
    path.appendChild(li);
  });
  const bar = mk("div", "intro-time", `<span class="intro-k">Il tempo</span>
    <div class="intro-bar" role="img" aria-label="Tempo stimato: ${levels.map((l) => `${l.name} ${l.min} minuti`).join(", ")}; in tutto circa ${totMin} minuti">
      ${levels.map((l) => `<span class="intro-seg s${l.i + 1}" style="flex:${l.min}"><b>${l.min}′</b><span>${l.name}</span></span>`).join("")}
    </div>
    <p>Circa <b>${totMin} minuti</b> in tutto: puoi fare un livello per volta, anche in giorni diversi.</p>`);
  const goal = bridge ? mk("div", "intro-goal", `${icon("target", "ic-lg")}<div><span class="intro-k">Dove ti porta</span><p>${esc(firstSentence(bridge, 220))}</p></div>`) : null;
  const act = mk("div", "intro-act");
  const go = mk("button", "btn", "Inizia dal livello Base"); go.type = "button";
  const hide = mk("button", "intro-hide", "Riduci la presentazione"); hide.type = "button"; hide.setAttribute("aria-expanded", "true");
  act.append(go, hide);
  sec.append(top, path, bar); if (goal) sec.appendChild(goal); sec.appendChild(act);
  const mini = mk("button", "intro-mini", `${icon(aIc)}<span>Presentazione del laboratorio · ${levels.map((l) => l.name).join(" → ")}</span><span aria-hidden="true">▾</span>`); mini.type = "button"; mini.setAttribute("aria-expanded", "false");
  head.after(sec); sec.after(mini);

  const openTab = (n) => { const t = document.getElementById("t" + n); if (t) { t.click(); t.focus(); tabs.scrollIntoView({ behavior: "smooth", block: "start" }); } };
  path.querySelectorAll(".intro-card").forEach((b) => (b.onclick = () => openTab(+b.dataset.tab)));
  go.onclick = () => openTab(1);
  const show = (open) => { sec.hidden = !open; mini.hidden = open; set(KEY, !open); };
  hide.onclick = () => { show(false); mini.focus(); };
  mini.onclick = () => { show(true); sec.querySelector(".intro-card")?.focus(); };
  show(!get(KEY));
})();
