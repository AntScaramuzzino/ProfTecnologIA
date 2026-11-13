"""Rigenera la copia «libro» del proiettore ortogonale (public/embeds/proiettore/).

L'originale vive su https://proiettore-ortogonale.vercel.app/ ed è un progetto a parte.
Questa copia aggiunge solo ciò che serve al libro (apertura da indirizzo, modalità esercizio,
pagina incorporata, LIM): l'elenco completo è nell'intestazione di proiettore.js.

Quando l'originale cambia, per riallineare la copia:

    python3 scripts/proiettore/aggiorna-proiettore.py            # scarica l'originale dal sito
    python3 scripts/proiettore/aggiorna-proiettore.py --da DIR   # oppure lo prende da una cartella locale

La cartella locale deve contenere index.html (o page.html), proiettore.js, styles.css e
vendor/three.module.min.js. Ogni sostituzione deve trovare il testo originale esattamente
il numero di volte atteso: se l'originale è cambiato in quel punto lo script si ferma e
dice quale modifica va rivista, senza scrivere una copia a metà.
"""
import pathlib
import shutil
import sys
import tempfile
import urllib.request

ORIGINE = "https://proiettore-ortogonale.vercel.app/"
FILE_ORIGINALI = {"page.html": "", "proiettore.js": "proiettore.js", "styles.css": "styles.css",
                  "vendor/three.module.min.js": "vendor/three.module.min.js"}
REPO = pathlib.Path(__file__).resolve().parents[2]
dst = REPO / "public" / "embeds" / "proiettore"

if "--da" in sys.argv:
    src = pathlib.Path(sys.argv[sys.argv.index("--da") + 1])
    if not (src / "page.html").exists() and (src / "index.html").exists():
        shutil.copy(src / "index.html", src / "page.html")
else:
    src = pathlib.Path(tempfile.mkdtemp(prefix="proiettore-"))
    (src / "vendor").mkdir()
    for locale, remoto in FILE_ORIGINALI.items():
        richiesta = urllib.request.Request(ORIGINE + remoto, headers={"User-Agent": "Mozilla/5.0 (aggiorna-proiettore)"})
        with urllib.request.urlopen(richiesta, timeout=60) as risposta:
            (src / locale).write_bytes(risposta.read())
    print("originale scaricato in", src)

# le sostituzioni si provano tutte in memoria: i file si scrivono solo alla fine, se sono andate tutte a buon fine
scritture = {}


def sostituisci(testo, vecchio, nuovo, quante=1, dove=""):
    n = testo.count(vecchio)
    if n != quante:
        sys.exit(f"[{dove}] atteso {quante} volte, trovato {n}: {vecchio[:70]!r}")
    return testo.replace(vecchio, nuovo)


# ───────────────────────────── proiettore.js ──
js = (src / "proiettore.js").read_text(encoding="utf-8")

js = sostituisci(js, """import * as THREE from 'three';""", """import * as THREE from 'three';

/* ── COPIA PER BOOK PROFTECNOLOGIA ─────────────────────────────────────────
   Uguale all'originale (proiettore-ortogonale.vercel.app) tranne i punti
   segnati «LIBRO»:
   1. apertura da indirizzo: solido, misure in cm, rotazione, opzioni di vista
   2. modalità esercizio: solido e misure bloccati, riquadro con la consegna
   3. inclinazione fino a 90° esatti (prima si fermava a 88,8°)
   4. «Azzera rotazione» torna alla posizione di partenza data dall'indirizzo
   5. le proiezioni sul triedro si aggiornano nello stesso fotogramma del solido
   6. sul triedro uno spigolo nascosto che coincide con uno in vista non lo copre più
   7. nomi dei piani sul triedro in chiaro (prima erano scuri su fondo scuro)
   8. sulle lastre i piani si chiamano PV, PL, PO, come sul triedro e nelle tavole (prima P.V., P.L., P.O.)
   9. blocco a L: lo spessore dei due bracci si può dare dall'indirizzo (?sp=<cm>), uguale per tutti e due
   Rigenerata da scripts/proiettore/aggiorna-proiettore.py: le modifiche vanno fatte lì, non in questo file.
   ─────────────────────────────────────────────────────────────────────── */""", dove="intestazione")

js = sostituisci(js, """    zoom: 1,           /* ingrandimento della vista assonometrica */   /* angoli congelati quando le proiezioni sono sganciate */
  };
""", """    zoom: 1,           /* ingrandimento della vista assonometrica */   /* angoli congelati quando le proiezioni sono sganciate */
  };

  /* ── LIBRO · apertura da indirizzo ───────────────────────────────────────
     ?solido=<id>                 apre su quel solido (id dei pulsanti: prismatri, piramide…)
     ?<misura>=<cm>               misure reali in centimetri, con le chiavi di MISURE (r, alt, lato, L, H, P…);
                                  vanno date tutte quelle del solido, altrimenti restano le misure standard
     ?sp=<cm>                     solo per il blocco a L (solido=elle), insieme a larg, alt e prof:
                                  spessore dei due bracci; senza, lo spessore segue le proporzioni standard
     ?alfa=<gradi>&beta=<gradi>   rotazione di partenza
     ?esercizio=1                 tavola guidata: solido e misure bloccati
     ?titolo=…&misure=…           testi del riquadro dell'esercizio
     ?aggancio=1 · ?facce=1 · ?iso=0   opzioni di vista
     ?embed=1 · ?lim=1            pagina incorporata e lavagna (index.html + styles.css) */
  const PAR = new URLSearchParams(location.search);
  const parNum = k => { const v = parseFloat((PAR.get(k) || '').replace(',', '.')); return Number.isFinite(v) ? v : null; };
  const GRADO = Math.PI / 180;
  const RAGGIO_SCENA = 2.2;            /* ingombro che la scena inquadra bene in tutte e due le viste 3D */
  const partenza = { yaw: 0, pitch: 0, data: false };
  const esercizio = { attivo: PAR.get('esercizio') === '1', solidoId: null, cm: null };
  if (SOLIDI[PAR.get('solido')]) stato.solidoId = PAR.get('solido');
  {
    const sch = MISURE[stato.solidoId] || {};
    const chiavi = Object.keys(sch);
    if (chiavi.length && chiavi.every(k => parNum(k) > 0)) {
      /* misure in cm → unità di scena: stesse proporzioni, ingombro costante */
      const cm = {};
      chiavi.forEach(k => { cm[k] = parNum(k); });
      if (stato.solidoId === 'elle' && parNum('sp') > 0) cm.sp = parNum('sp');
      const f = RAGGIO_SCENA / SOLIDI[stato.solidoId](cm).raggio;
      const interne = {};
      Object.keys(cm).forEach(k => { interne[k] = cm[k] * f; });
      stato.misure[stato.solidoId] = interne;
      esercizio.solidoId = stato.solidoId;
      esercizio.cm = cm;
    }
    stato.solido = SOLIDI[stato.solidoId](stato.misure[stato.solidoId]);
  }
  if (parNum('alfa') !== null || parNum('beta') !== null) {
    partenza.yaw = (parNum('alfa') || 0) * GRADO;
    partenza.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, (parNum('beta') || 0) * GRADO));
    partenza.data = true;
    stato.yaw = partenza.yaw; stato.pitch = partenza.pitch;
  }
  if (PAR.get('aggancio') === '1') stato.snap = true;
  if (PAR.get('facce') === '1') stato.facce = true;
  if (PAR.get('iso') === '0') stato.ribaltato = false;
  const cmTesto = v => (Math.round(v * 100) / 100).toString().replace('.', ',') + ' cm';
""", dove="parametri")

# blocco a L: con ?sp= i due bracci hanno lo spessore dato (uguale), invece delle proporzioni standard
js = sostituisci(js, """  elle: conMisure('elle', m => { const s = prismaDaProfilo(stira(PROFILO_ELLE, m.larg / 3.0, m.alt / 3.0), m.prof); s.nome = 'Blocco a L'; return preparaSolido(s); }),""",
                 """  elle: conMisure('elle', m => {
    /* LIBRO · m.sp arriva solo dall'indirizzo (?sp=): spessore uguale per i due bracci */
    const sp = m.sp > 0 ? Math.min(m.sp, m.larg * 0.9, m.alt * 0.9) : 0;
    const profilo = sp ? [[0, 0], [m.larg, 0], [m.larg, sp], [sp, sp], [sp, m.alt], [0, m.alt]] : stira(PROFILO_ELLE, m.larg / 3.0, m.alt / 3.0);
    const s = prismaDaProfilo(profilo, m.prof); s.nome = 'Blocco a L'; return preparaSolido(s);
  }),""", dove="blocco a L")

# pannello misure: se le misure arrivano dall'indirizzo si leggono in cm, senza cursori
js = sostituisci(js, """    const m = misureCorrenti(stato.solidoId);
    let h = "";
    chiavi.forEach(k => {""", """    /* LIBRO · misure date dall'indirizzo: elenco in centimetri al posto dei cursori */
    if (esercizio.cm && esercizio.solidoId === stato.solidoId) {
      cont.innerHTML = chiavi.map(k =>
        "<p class=\\"misura misura--fissa\\"><span class=\\"misura__et\\">" + sch[k].et + "</span>" +
        "<output class=\\"mono\\">" + cmTesto(esercizio.cm[k]) + "</output></p>").join("") +
        "<button class=\\"tasto tasto--mini\\" id=\\"tastoMisureLibere\\">Cambia le misure</button>";
      $('#tastoMisureLibere').addEventListener('click', () => {
        esercizio.cm = null; esercizio.solidoId = null;
        delete stato.misure[stato.solidoId];
        costruisciPannelloMisure();
        rigeneraSolido();
      });
      return;
    }
    const m = misureCorrenti(stato.solidoId);
    let h = "";
    chiavi.forEach(k => {""", dove="pannello misure")

# inclinazione fino a 90° esatti
js = sostituisci(js, "stato.pitch = Math.max(-1.55, Math.min(1.55, stato.pitch));",
                 "stato.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, stato.pitch));   /* LIBRO · 90° esatti */",
                 quante=3, dove="limite inclinazione")

# «Azzera rotazione» torna alla posizione di partenza
js = sostituisci(js, """  $('#tastoAzzeraRot').addEventListener('click', () => {
    stato.yaw = 0; stato.pitch = 0;
    rendi();
  });""", """  $('#tastoAzzeraRot').addEventListener('click', () => {
    stato.yaw = partenza.yaw; stato.pitch = partenza.pitch;   /* LIBRO · 0° e 0° se l'indirizzo non dice altro */
    rendi();
  });""", dove="azzera rotazione")

# le proiezioni si calcolano prima di disegnare la scena (nell'originale il triedro resta indietro di un fotogramma)
js = sostituisci(js, """    applicaProiezione(iso);
    if (renderer) renderer.render(scena, camera);
    else rendi2D();
    proietta();""", """    applicaProiezione(iso);
    proietta();   /* LIBRO · prima le proiezioni, poi il disegno: così il triedro mostra subito quelle giuste */
    if (renderer) renderer.render(scena, camera);
    else rendi2D();""", dove="ordine di disegno")

# sul triedro gli spigoli in vista coprono quelli nascosti che cadono nello stesso punto (come sulle lastre)
js = sostituisci(js, """    linee(segV, new THREE.LineBasicMaterial({ color: 0x14151A }), false);
    linee(segN, new THREE.LineDashedMaterial({ color: 0x2F5FE0, dashSize: 0.09, gapSize: 0.07 }), true);""", """    /* LIBRO · prima i nascosti, poi quelli in vista: uno spigolo nascosto che coincide con uno in vista non lo tratteggia */
    linee(segN, new THREE.LineDashedMaterial({ color: 0x2F5FE0, dashSize: 0.09, gapSize: 0.07 }), true);
    linee(segV, new THREE.LineBasicMaterial({ color: 0x14151A }), false);""", dove="ordine linee triedro")

# nomi dei piani sul triedro: chiari, perché lo sfondo della scena è scuro
js = sostituisci(js, """    g.fillStyle = "#14151A"; g.textAlign = "center";""",
                 """    g.fillStyle = "#F5F7F2"; g.textAlign = "center";   /* LIBRO · testo chiaro su scena scura */""", dove="etichette triedro 1")
js = sostituisci(js, """g.fillStyle = "#3A3F4A"; g.fillText(riga2, 384, 172);""",
                 """g.fillStyle = "#C9CFDA"; g.fillText(riga2, 384, 172);""", dove="etichette triedro 2")

# allineamento dei comandi allo stato iniziale + riquadro dell'esercizio
js = sostituisci(js, """  costruisciPannelloMisure();
  /* ISO-DEFAULT */""", """  /* LIBRO · i comandi mostrano lo stato letto dall'indirizzo */
  $$('#sceltaSolido .chip').forEach(c => {
    const attivo = c.dataset.solido === stato.solidoId;
    c.classList.toggle('is-active', attivo);
    c.setAttribute('aria-pressed', attivo);
  });
  $('#cartiglioSolido').textContent = stato.solido.nome;
  $('#tastoSnap').setAttribute('aria-pressed', stato.snap);
  $('#tastoRibalta').setAttribute('aria-pressed', stato.ribaltato);
  $('#tastoFacce').setAttribute('aria-pressed', String(stato.facce));
  if (partenza.data) $('#tastoAzzeraRot').textContent = 'Posizione di partenza';
  {
    const box = $('#esercizioBox');
    if (box && esercizio.attivo) {
      const sch = MISURE[stato.solidoId] || {};
      $('#esercizioTitolo').textContent = PAR.get('titolo') || stato.solido.nome;
      $('#esercizioMisure').textContent = PAR.get('misure') ||
        (esercizio.cm ? Object.keys(sch).map(k => sch[k].et + ' ' + cmTesto(esercizio.cm[k])).join(' · ') : '');
      box.hidden = false;
    }
  }

  costruisciPannelloMisure();
  /* ISO-DEFAULT */""", dove="stato iniziale")

scritture["proiettore.js"] = js

# ───────────────────────────── index.html ──
html = (src / "page.html").read_text(encoding="utf-8")

html = sostituisci(html, "<title>TECNORAMA - Proiettore ortogonale</title>",
                   "<title>Proiettore ortogonale — Book ProfTecnologIA</title>", dove="title")
html = sostituisci(html,
                   '<meta name="description" content="Atlante interattivo della Tecnologia per la scuola secondaria: materiali, disegno tecnico con proiezioni ortogonali dal vivo, energia e collaudo finale.">',
                   '<meta name="description" content="Proiettore ortogonale: un solido in tre dimensioni da ruotare e le sue tre viste — prospetto, pianta e vista laterale — disegnate in tempo reale con il metodo europeo.">\n'
                   '<!-- LIBRO · le classi vanno messe prima del primo disegno della pagina -->\n'
                   "<script>(function(){var p=new URLSearchParams(location.search),c=document.documentElement.classList;"
                   "if(p.get('embed')==='1')c.add('is-embed');if(p.get('lim')==='1')c.add('lim');"
                   "if(p.get('esercizio')==='1')c.add('is-esercizio');})();</script>",
                   dove="meta")
html = sostituisci(html, '<a href="./index.html">Torna all atlante</a>',
                   '<a href="../../proiezioni-ortogonali/">← Tavole di proiezioni ortogonali</a>', dove="nav")
html = sostituisci(html, """    <div class="proiettore__comandi" role="group" aria-label="Comandi del proiettore">
""", """    <div class="proiettore__comandi" role="group" aria-label="Comandi del proiettore">
      <div class="esercizio" id="esercizioBox" hidden>
        <p class="esercizio__titolo" id="esercizioTitolo"></p>
        <p class="esercizio__misure mono" id="esercizioMisure"></p>
        <p class="esercizio__nota">Ruota il solido e guarda come cambiano le tre viste. Con «Posizione di partenza» torni alla posizione della tavola.</p>
      </div>
""", dove="riquadro esercizio")

# nomi dei piani scritti come nelle tavole e come sul triedro: PV, PL, PO
html = sostituisci(html, "P.V. · PROSPETTO", "PV · PROSPETTO", dove="lastra PV")
html = sostituisci(html, "P.L. · VISTA LATERALE SIN.", "PL · VISTA LATERALE SIN.", dove="lastra PL")
html = sostituisci(html, "P.O. · PIANTA", "PO · PIANTA", dove="lastra PO")

scritture["index.html"] = html

# ───────────────────────────── styles.css ──
css = (src / "styles.css").read_text(encoding="utf-8")
css += """

/* ═══════════ LIBRO · Book ProfTecnologIA ═══════════
   Aggiunte per la copia incorporata nel libro. Rigenerate da scripts/proiettore/aggiorna-proiettore.py. */

/* ---- riquadro dell'esercizio (tavola guidata, ?esercizio=1) ---- */
.esercizio{border-left:4px solid var(--minio);padding:.15rem 0 .15rem .75rem}
.esercizio[hidden]{display:none}
.esercizio__titolo{font-family:var(--d-display);font-weight:800;font-size:1.02rem;line-height:1.2}
.esercizio__misure{font-size:.74rem;margin-top:.35rem;color:var(--china)}
.esercizio__nota{font-size:.78rem;line-height:1.45;margin-top:.5rem;opacity:.8}
.is-esercizio .proiettore__solidi,.is-esercizio .proiettore__misure{display:none}
.misura--fissa{flex-direction:row;justify-content:space-between;align-items:baseline;gap:.6rem}
.misura--fissa output{font-size:.8rem;opacity:1}

/* ---- pagina incorporata (?embed=1): restano solo scena e comandi ---- */
.is-embed .commessa,.is-embed .tavola__testata,.is-embed .cartiglio,.is-embed .cad-cursor{display:none!important}
.is-embed body{min-height:0}
.is-embed .tavola{padding:.9rem}
.is-embed .proiettore__corpo{grid-template-columns:minmax(0,1fr) 250px;gap:.9rem}
.is-embed .proiettore__scena{gap:.7rem;max-width:none}
.is-embed .proiettore__comandi{top:.6rem;padding:.85rem;gap:.9rem}
.is-embed .proiettore__lettura{margin-top:.6rem}
@media(max-width:960px){
.is-embed .proiettore__corpo{grid-template-columns:1fr}
.is-embed .proiettore__opzioni{flex-direction:row;flex-wrap:wrap}
.is-embed .proiettore__opzioni .tasto{width:auto}
.is-embed .proiettore__opzioni::before{flex-basis:100%}
}
@media(max-width:700px){
/* schermo stretto: prima il solido, poi le tre viste affiancate come sul foglio */
.is-embed .proiettore__scena{grid-template-columns:1fr 1fr;grid-template-areas:"palco palco" "pv pl" "po .";gap:.5rem}
}

/* ---- lavagna (?lim=1): la scena sta tutta nello schermo, testi e pulsanti grandi ---- */
html.lim{font-size:20px}
.lim .commessa,.lim .tavola__testata,.lim .cartiglio,.lim .cad-cursor{display:none!important}
.lim body{min-height:0}
.lim .tavola{padding:.8rem 1rem}
.lim .proiettore__corpo{grid-template-columns:minmax(0,1fr) 19rem;gap:1rem;align-items:start}
.lim .proiettore__scena{gap:.6rem;width:100%;max-width:calc(100vh - 4.6rem);margin-inline:auto}
.lim .proiettore__comandi{top:.8rem;padding:1rem;gap:1rem;max-height:calc(100vh - 1.6rem)}
.lim .vetro__nome{font-size:.75rem}
.lim .chip{font-size:.8rem;padding:.5rem .3rem}
.lim .tasto{font-size:.85rem;padding:.65rem .8rem}
.lim .esercizio__titolo{font-size:1.3rem}
.lim .esercizio__misure{font-size:.9rem}
.lim .esercizio__nota{font-size:.9rem}
.lim .proiettore__lettura{font-size:.9rem;margin-top:.5rem}
.lim .palco3d__espandi{font-size:.75rem;padding:.4rem .7rem}
.lim .palco3d__hint{font-size:.62rem}
.lim .is-espansa .palco3d{min-height:calc(100vh - 3rem)}
"""
scritture["styles.css"] = css

(dst / "vendor").mkdir(parents=True, exist_ok=True)
shutil.copy(src / "vendor" / "three.module.min.js", dst / "vendor" / "three.module.min.js")
for nome, testo in scritture.items():
    (dst / nome).write_text(testo, encoding="utf-8")
print("copia rigenerata in", dst)
