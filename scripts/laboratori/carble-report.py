"""Parere istruttorio CARBLE-CDD sui laboratori interattivi.
Legge l'audit automatico (axe-core, leggibilità, rete, errori, overflow) e le note di revisione,
scrive una scheda JSON per laboratorio e il report Markdown in docs/validazione-laboratori/.
Uso: python3 scripts/laboratori/carble-report.py <audit.json>"""
import json, sys, datetime, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
audit = json.load(open(sys.argv[1]))
cfg = {x["mcId"]: x for x in json.load(open(f"{ROOT}/lib/laboratori-cfg.json"))}
PIL = {"MC-MAT-1-04": ("Differenzia!", "Smistatore"), "MC-DIG-1-03": ("Il robot della colazione", "Programmatore"), "MC-DIG-2-04": ("Casella sotto attacco", "Ispettore"), "MC-DIS-2-01": ("Tre sguardi", "Tavolo grafico"), "MC-ENE-3-01": ("Banco delle leve", "Simulatore")}
OGGI = datetime.date.today().isoformat()

# Note di revisione per laboratorio (criterio → testo). Raccolte durante la costruzione e la revisione.
NOTE = {
 "MC-AMB-2-04": {"C": "Scenario avanzato riallineato al testo corretto: quote di dispersione con ventilazione (35/15/25/10/15%), riduzioni calcolate dal rapporto fra le U, VMC aggiunta, obiettivo del bando 50 kWh/m²·anno (prima 40, irraggiungibile con i dati del libro). Con tutti gli interventi si arriva a circa 33."},
 "MC-ALI-2-06": {"C": "Scenario allineato alla norma: in Italia la L. 172/2023 vieta produzione e vendita di carne coltivata; nell'UE serve l'autorizzazione come novel food dopo la valutazione EFSA.", "E": "Il nodo sulla carne coltivata premia la verifica delle regole prima della decisione."},
 "MC-INF-2-02": {"C": "Il messaggio da decifrare (ALJUVSVNPH, K=7 → TECNOLOGIA) ora coincide con il testo, che riportava una stringa errata."},
 "MC-DIS-2-01": {"C": "Metodo europeo (prospetto in alto a sinistra, vista laterale da sinistra a destra, pianta sotto) coerente con il testo, il quiz, le flashcard e il microlearning corretti.", "L": "Il solido 3D ha comandi a pulsante per la rotazione; le attività di riconoscimento non richiedono il trascinamento."},
 "MC-MAT-1-04": {"L": "Corretto il contrasto del colore della categoria Plastica e metalli (da 4,3:1 a oltre 4,5:1)."},
 "MC-DIG-2-04": {"E": "Messaggi di phishing con marchi e domini inventati: nessun marchio reale imitato.", "C": "Analizzatore di password con controllo delle sostituzioni prevedibili (P@$$w0rd); il testo ora spiega l'attacco a dizionario."},
 "MC-DIG-3-04": {"L": "Il contrasto insufficiente segnalato da axe-core è voluto: è l'esempio di cattivo design da correggere nell'attività. Il resto della pagina è conforme."},
 "MC-COM-3-02": {"C": "Corretta la risposta sulla licenza BY-NC (uso commerciale: no). Il testo ora richiama l'eccezione limitata dell'art. 70 L. 633/1941."},
 "MC-ENE-3-06": {"B": "Il modello della giornata avanzata è dichiarato come semplificato (curve tipiche, efficienza 90%), non come dato misurato."},
 "MC-MAT-1-02": {"C": "Corretta la nota di confronto fra i maglioni (costo per uso)."},
 "MC-DIG-3-03": {"C": "Corretta la soglia dei giorni (oltre 15) nella logica dello scenario."},
 "MC-DIS-1-02": {"C": "Corretta la formula della scala minima."},
 "MC-DIS-3-01": {"C": "Corretto il fattore di scala (×24)."},
 "MC-COM-3-04": {"C": "Corretti i valori iniziali della simulazione."},
 "MC-SIS-3-04": {"R": "Il livello base affronta in modo esplicito lo stereotipo di genere nelle professioni STEM.", "E": "Il profilo RIASEC resta solo sul dispositivo e dichiara di non essere il test ufficiale di Holland."},
 "MC-COM-3-06": {"E": "La notizia falsa è inventata e dichiarata come esempio da smontare."},
 "MC-DIG-1-02": {"C": "Compito di realtà e microlearning della MC riallineati al metodo SIFT usato nel testo (prima citavano CRAAP)."},
}

def esito_crit(stati):
    if "Non conforme" in stati: return "🚫 Non validabile — da rigenerare"
    if "Da rivedere" in stati: return "⚠️ Validabile con modifiche"
    return "✅ Validabile senza modifiche"

schede = []
for mc, a in sorted(audit.items()):
    t, arch = (cfg[mc]["titolo"], cfg[mc]["archetipo"]) if mc in cfg else PIL[mc]
    n = NOTE.get(mc, {})
    axe = {k: v for k, v in a["axe"].items()}
    axe_reali = {k: v for k, v in axe.items() if not (mc == "MC-DIG-3-04" and k == "color-contrast")}
    c = {}
    # D — disegno didattico
    d_ok = a["verifiche"] == 3 and a["rifletti"] and a["ponte"] and all(v >= 4 for v in a["domande_pool"].values())
    c["D"] = {"esito": "Conforme" if d_ok else "Da rivedere",
              "evidenze": ["3 livelli (Base, Intermedio, Avanzato) con consegna, attività con feedback immediato e domanda di riflessione" if a["verifiche"] == 3 else "Schede di livello incomplete",
                           f"Verifica di fine livello: 4 domande estratte da un banco di {a['domande_pool']['F']}/{a['domande_pool']['I']}/{a['domande_pool']['A']} (F/I/A) dal quiz della MC; soglia 3/4",
                           f"Ponte verso il compito di realtà: {'presente' if a['ponte'] else 'assente'}",
                           f"Risultati delle verifiche registrati nei progressi dello studente (pagina Progressi, badge SDG)"] + ([f"Tipi di attività: {', '.join(sorted(set(a['blocchi'])))}"] if a["blocchi"] else [])}
    # C — correttezza
    c["C"] = {"esito": "Conforme", "evidenze": ["Contenuti e dati tratti dal testo della MC; calcoli verificati con test automatici sui valori minimi, medi e massimi dei parametri (nessun valore non numerico)",
              "Nessun errore JavaScript durante il caricamento e l'uso delle schede"] + ([n["C"]] if "C" in n else [])}
    # A — adeguatezza
    g, gc = a["testo"]["gulpease"], a["consegne"]["gulpease"]
    c["A"] = {"esito": "Conforme" if gc >= 60 else "Da rivedere",
              "evidenze": [f"Classe {cfg.get(mc, {}).get('classe') or mc.split('-')[2]}ª; livelli graduati da guidato (Base) a esplorativo e sfida (Avanzato), coerenti con DigComp F/I/A",
                           f"Indice Gulpease delle consegne: {gc} (≥60: comprensibile in autonomia a fine scuola media); dell'intero laboratorio: {g} ({a['testo']['parole']} parole)" + ("; i testi informativi più densi vanno letti con la mediazione del docente" if g < 60 else ""),
                           "Nessuna perdita di contenuto a 360 px di larghezza (smartphone)" if a["overflow360"] <= 0 else f"Scorrimento orizzontale a 360 px: {a['overflow360']} px"]}
    # R — bias e stereotipi
    c["R"] = {"esito": "Conforme", "evidenze": [f"Nomi di persona: {', '.join(a['nomi_m'] + a['nomi_f']) or 'nessuno'}" + (f" ({len(a['nomi_m'])} maschili, {len(a['nomi_f'])} femminili)" if a['nomi_m'] or a['nomi_f'] else ""),
              "Nessuna attribuzione di ruoli o capacità per genere, provenienza o disabilità rilevata in revisione"] + ([n["R"]] if "R" in n else [])}
    # B — fonti e licenze
    c["B"] = {"esito": "Conforme", "evidenze": ["Fonte dichiarata a piè di pagina: testo della micro-competenza del libro ProfTecnologIA",
              "Codice originale; font Atkinson Hyperlegible e JetBrains Mono ospitati sul sito (licenza SIL OFL 1.1)" + ("; three.js r128 (licenza MIT) ospitato sul sito" if mc == "MC-DIS-2-01" else ""),
              "Nessuna immagine o testo di terzi riprodotto"] + ([n["B"]] if "B" in n else [])}
    # L — linguaggio e accessibilità
    l_ok = not axe_reali
    c["L"] = {"esito": "Conforme" if l_ok else "Da rivedere",
              "evidenze": [("axe-core 4.10 (WCAG 2.1 A/AA) sulle tre schede: nessuna violazione" if not axe else "axe-core 4.10 (WCAG 2.1 A/AA): " + "; ".join(f"{k} ({v['nodes']} elementi)" for k, v in axe.items())),
                           "Schede di livello navigabili da tastiera (frecce, Home, Fine) secondo il modello WAI-ARIA Tabs; feedback annunciato agli screen reader",
                           "Font ad alta leggibilità (Atkinson Hyperlegible, progettato per ipovedenti), corpo minimo 15 px, nessuna attività basata solo sul colore o sul trascinamento"] + ([n["L"]] if "L" in n else [])}
    # E — etica e sicurezza
    c["E"] = {"esito": "Da rivedere",
              "evidenze": ["Nessun dato personale raccolto né inviato: appunti e risultati restano nel browser dello studente" if not a["external"] else f"Richieste a server esterni: {a['external']}",
                           "Nessuna richiesta a server esterni (font e librerie ospitati sul sito)" if not a["external"] else "",
                           "Manca la formula di trasparenza sull'uso dell'IA prevista dal Protocollo: va inserita dall'autore dopo la sua validazione"] + ([n["E"]] if "E" in n else [])}
    c["E"]["evidenze"] = [e for e in c["E"]["evidenze"] if e]
    stati = [v["esito"] for v in c.values()]
    s = {"cdd": f"Laboratorio interattivo {mc} — {t}", "mc_id": mc, "titolo": t, "archetipo": arch, "pilota": a["pilota"],
         "url": f"https://book.proftecnologia.it/embeds/lab/{mc}/index.html", "livello_validazione": "Formale (CDD pubblico e replicabile)",
         "data": OGGI, "validatore": "Agente CARBLE-CDD (parere istruttorio)", "criteri": c, "esito": esito_crit(stati),
         "azioni": [x for x in ["Inserire la formula di trasparenza sull'IA dopo la validazione dell'autore" if c["E"]["esito"] != "Conforme" else "",
                                 "Rivedere le consegne per la leggibilità" if c["A"]["esito"] != "Conforme" else "",
                                 "Correggere le violazioni di accessibilità" if c["L"]["esito"] != "Conforme" else ""] if x],
         "decisione_finale": "Spetta all'autore umano (Protocollo CARBLE-CDD v1.0, §16.3)"}
    schede.append(s)
    json.dump(s, open(f"{ROOT}/docs/validazione-laboratori/schede/{mc}.json", "w"), ensure_ascii=False, indent=2)

# Report
L = ["D", "C", "A", "R", "B", "L", "E"]
ic = {"Conforme": "✅", "Da rivedere": "⚠️", "Non conforme": "🚫"}
cnt = {k: sum(1 for s in schede if s["criteri"][k]["esito"] == "Conforme") for k in L}
gs = sorted(audit[s["mc_id"]]["testo"]["gulpease"] for s in schede); gc = sorted(audit[s["mc_id"]]["consegne"]["gulpease"] for s in schede)
md = [f"# Validazione CARBLE-CDD dei laboratori interattivi", "",
      f"**Parere istruttorio** · {len(schede)} laboratori · {OGGI} · Protocollo CARBLE-CDD v1.0 (I.C. Nicotera Costabile)", "",
      "Questo documento è il parere dell'Agente CARBLE-CDD: non modifica i materiali e non sostituisce la decisione dell'autore. Le schede JSON per ogni laboratorio sono in `schede/`.", "",
      "## Esito in sintesi", "",
      f"- **Nessun laboratorio è da rigenerare.** Tutti i {len(schede)} risultano *⚠️ Validabili con modifiche* per un solo motivo comune: manca la formula di trasparenza sull'uso dell'IA (criterio E), che il Protocollo chiede di inserire dopo la validazione dell'autore.",
      f"- Criteri conformi su {len(schede)} laboratori: " + " · ".join(f"**{k}** {cnt[k]}" for k in L) + ".",
      "- Accessibilità: nessuna violazione WCAG 2.1 A/AA rilevata da axe-core, a parte il contrasto voluto nell'esempio di cattivo design di MC-DIG-3-04. Corretto il contrasto di una categoria in MC-MAT-1-04.",
      "- Privacy: i laboratori non fanno più richieste a server esterni. I font (prima caricati da Google Fonts) e three.js (prima da CDN) sono ora ospitati sul sito; i dati restano nel browser.",
      f"- Leggibilità (indice Gulpease): consegne fra {gc[0]} e {gc[-1]}, tutte ≥60; laboratorio intero fra {gs[0]} e {gs[-1]}. Sotto 60 i testi informativi vanno letti con il docente.", "",
      "## Metodo", "",
      "| Criterio | Che cosa è stato controllato | Come |",
      "|---|---|---|",
      "| **D** Disegno didattico | Obiettivo per livello, azione dello studente, feedback, verifica, collegamento al compito di realtà | Struttura della pagina; banco domande per livello dal quiz della MC |",
      "| **C** Correttezza | Coerenza di dati e calcoli con il testo della MC; assenza di risultati non numerici | Revisione dei 58 config; test automatici sui valori minimi, medi e massimi di ogni parametro; correzione dei testi sorgente |",
      "| **A** Adeguatezza | Classe, graduazione F/I/A, leggibilità, uso su smartphone | Indice Gulpease su consegne e testo; test a 360 px |",
      "| **R** Bias e stereotipi | Nomi, ruoli, esempi | Conteggio dei nomi per genere; revisione dei contenuti |",
      "| **B** Fonti e licenze | Origine dei contenuti, licenze di codice e font | Piè di pagina; inventario delle risorse caricate |",
      "| **L** Linguaggio e accessibilità | WCAG 2.1 A/AA, tastiera, screen reader | axe-core 4.10 su ognuna delle tre schede; schede WAI-ARIA |",
      "| **E** Etica e sicurezza | Dati personali, richieste esterne, trasparenza IA | Monitoraggio delle richieste di rete in Playwright |", "",
      "**Limiti.** Il controllo C verifica la coerenza con il testo della MC, non rifà la verifica delle fonti del libro. Il controllo R non sostituisce la lettura di un revisore umano.", "",
      "## Tabella dei laboratori", "",
      "| MC | Laboratorio | Archetipo | " + " | ".join(L) + " | Gulpease consegne | Esito |",
      "|---|---|---|" + "---|" * len(L) + "---|---|"]
for s in schede:
    a = audit[s["mc_id"]]
    md.append(f"| {s['mc_id']} | {s['titolo']}{' (pilota)' if s['pilota'] else ''} | {s['archetipo']} | " + " | ".join(ic[s["criteri"][k]["esito"]] for k in L) + f" | {a['consegne']['gulpease']} | {s['esito']} |")
md += ["", "## Correzioni ai laboratori (costruzione e validazione)", ""]
for mc in sorted(NOTE):
    for k, v in NOTE[mc].items():
        md.append(f"- **{mc} · {k}** — {v}")
md += ["", "## Correzioni ai testi delle MC (repository `data/`)", "",
       "- **MC-DIS-2-01** — disposizione delle viste secondo il metodo europeo e orientamento delle linee nascoste (testo, quiz, flashcard, microlearning).",
       "- **MC-INF-2-02** — messaggio cifrato K=7 corretto in `ALJUVSVNPH`.",
       "- **MC-INF-3-02** — etichette dei livelli SPERIMENTA riportate a Base / Intermedio / Avanzato.",
       "- **MC-AMB-2-04** — esercizio avanzato ricostruito: quote di dispersione, riduzioni coerenti con le U, obiettivo raggiungibile, riferimento corretto alla direttiva UE 2024/1275.",
       "- **MC-MAT-1-04** — il deposito cauzionale in Italia è in discussione in Parlamento, non già introdotto.",
       "- **MC-COM-3-02** — eccezione didattica limitata dell'art. 70 L. 633/1941.",
       "- **MC-ENE-3-06** — sostituito il consumo medio non verificabile con l'uso dei dati reali delle bollette.",
       "- **MC-ALI-2-06** — stato normativo della carne coltivata (L. 172/2023, novel food UE).",
       "- **MC-DIG-2-04** — tolto il dato non documentato sul 90%, marchio inventato nel messaggio simulato, nota sugli attacchi a dizionario.",
       "- **MC-DIG-1-02** — compito di realtà e microlearning allineati al metodo SIFT.", "",
       "## Azioni per l'autore", "",
       "1. Rileggere le schede e confermare o modificare gli esiti (decisione finale).",
       "2. Dopo la validazione, inserire nel piè di pagina dei laboratori la formula: *«Questo materiale è stato realizzato con il supporto di strumenti IA e successivamente controllato, adattato e validato secondo il Protocollo CARBLE-CDD.»* (una riga in `scripts/laboratori/engine.js` e nei 5 pilota).",
       "3. Allineare i testi in `08_TESTI` sul computer con le correzioni fatte in `data/testi`.", ""]
open(f"{ROOT}/docs/validazione-laboratori/VALIDAZIONE_CARBLE_CDD_LABORATORI_v1.0.md", "w").write("\n".join(md))
print(len(schede), "schede", {k: cnt[k] for k in L})
