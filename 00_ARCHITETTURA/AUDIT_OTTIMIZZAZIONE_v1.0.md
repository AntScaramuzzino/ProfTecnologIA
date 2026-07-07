# AUDIT_OTTIMIZZAZIONE — Sistema, architettura, design, esperienza utente

**Progetto:** TecnologIA / ProfTecnologIA
**Data audit:** 2026-07-08
**Metodo:** analisi diretta del filesystem (00–O9, app, repo git) con tre passate parallele: architettura+agenti, app Next.js, coerenza dati. Tutti i numeri citati sono misurati su disco alla data dell'audit, non stimati. Dove un'affermazione è un'inferenza e non un fatto misurato, è segnalata come tale.

---

## 1. Sintesi esecutiva

Il progetto è in uno stato molto più avanzato di quanto la sua stessa documentazione racconti: la base contenuti è solida (52 MC JSON tutte conformi v2.0, zero riferimenti prerequisiti pendenti, catena completa JSON→testo→quiz→flashcard→microlearning→visual per tutte le 52). I problemi reali stanno altrove, e si riassumono in tre categorie:

1. **Peso morto fisico** — ~15 GB di duplicati e binari in git che rallentano tutto e creano rischio copyright.
2. **Documentazione aspirazionale** — i documenti descrivono una pipeline (NotebookLM → Sintetizzatore → Notion) che non è mai esistita; i contenuti reali sono nati per altra via. Contatori e versioni divergono tra CLAUDE.md, AGENTS.md, architettura e INDICE.
3. **App "catalogo" invece che app "personalizzata"** — la promessa fondante (percorsi personalizzati) ha zero implementazione: il tracciamento progressi esiste ma nessuno lo scrive, non c'è ricerca, non c'è dashboard studente.

### Top 10 interventi per rapporto impatto/sforzo

| # | Intervento | Impatto | Sforzo | Sezione |
|---|-----------|---------|--------|---------|
| 1 | Convertire le 273 PNG in WebP ridimensionate (503 MB → stima <30 MB) | Enorme (LCP, deploy, dati studenti) | Basso (script batch) | §5 |
| 2 | Pulizia repo: worktree abbandonati (14 GB), `.next_old` (516 MB), binari editoriali fuori da git | Enorme (disco, clone, copyright) | Basso | §2 |
| 3 | Eleggere `05_APP/.../data/` come unica fonte di verità; deprecare i doppioni in `04_CONTENUTI/` | Alto (elimina rischio di modifica sulla copia sbagliata) | Basso | §4 |
| 4 | Decisione editoriale DIG/INF (blocca 6 JSON, 3 MC duplicate, stima pagine libro) | Alto | Solo decisione | §4 |
| 5 | Collegare `useProgress` in scrittura + pagina progressi studente | Alto (da catalogo ad app) | Medio | §6 |
| 6 | Ricerca globale MC (il dato `mc-data.json` esiste già, inutilizzato) | Alto (UX con 52 MC) | Basso | §6 |
| 7 | Correzioni accessibilità: dark mode incoerente, tastiera su **LevelTabs**, `aria-live` quiz, skip link | Alto (target dichiarato BES/DSA) | Basso-medio | §7 |
| 8 | Consolidare la documentazione: ritirare AGENTS.md, registro agenti unico, contatori corretti | Medio (ma abilita tutto il resto) | Basso | §3 |
| 9 | Sostituire il parser markdown a regex con `remark` + struttura in frontmatter | Medio (robustezza editoriale) | Medio-alto | §8 |
| 10 | Completare **MC-DIG-1-03** e **MC-DIG-2-05** (transcript, video, `note_didattiche`) | Medio | Basso | §4 |

---

## 2. Igiene del repository (prima di tutto il resto)

Questa sezione viene prima perché costa poco e sblocca tutto: backup, clone, ricerche, deploy.

### 2.1 Quindici gigabyte recuperabili subito

`.claude/worktrees/` contiene **3 copie complete del progetto** (brave-franklin, cranky-jemison, crazy-ritchie, ~4,5 GB ciascuna) per un totale di **14 GB**. Sono worktree git abbandonati: ogni ricerca full-text trova ogni documento 4 volte. In più, dentro l'app: `.next_old` (516 MB), `.next_mac_backup` (9,4 MB), cartelle vuote `anno 2`, `area 2` ecc. in `out/`. Rimedio: `git worktree prune` / rimozione manuale, poi cancellare i backup di build.

### 2.2 Git appesantito e con esposizione copyright

Il `.git` di root pesa **6,3 GB** per ~600 file tracciati. Cause: `08_TESTI/Altri Testi/PlaneT.zip` (**1,3 GB** in history), 65 PDF di editori commerciali in `08_TESTI/TESTI/` (2,2 GB: Zanichelli, Lattes, DeA, Le Monnier…), 186 file binari tracciati. Oltre al peso, **committare testi editoriali completi in un repo è un'esposizione legale** se il repo diventasse mai remoto/pubblico. Rimedio: spostare il materiale di consultazione fuori da git (cartella esterna o storage dedicato), riscrivere la history per rimuovere lo zip, aggiungere i pattern a `.gitignore`.

### 2.3 Errori di configurazione verificati

`.gitignore` punta a `05_APP/tecnologia-app/` ma l'app reale è `05_APP/tecnologia-sito-web/` — quindi `.next/`, `out/` e `node_modules` **non sono ignorati**. L'app è inoltre un repo git annidato (proprio `.git` da 423 MB) registrato come gitlink senza `.gitmodules`: chi clona il root ottiene una cartella vuota. Otto file duplicati macOS con suffisso " 2" sono **tracciati in git** (tra cui `competenze-glossario 2.ts`, che è una copia divergente, non identica — la più pericolosa delle due). Infine la cartella `O9_INDICAZIONI_NAZIONALI` usa la lettera O al posto dello zero, rompendo la convenzione 00–08 e i glob numerici.

Rimedi puntuali: correggere il path in `.gitignore`; assorbire l'app nel repo root (o formalizzare il submodule); cancellare tutti i file " 2" e `next.config.ts.bak`; rinominare in `09_INDICAZIONI_NAZIONALI` aggiornando le mappe in CLAUDE.md.

---

## 3. Architettura: allineare i documenti alla realtà

Il tema dominante emerso dall'audit architetturale: la documentazione descrive il progetto come *doveva essere*, non come *è*. Questo non è cosmetico — le regole operative in CLAUDE.md ordinano a qualsiasi agente di comportarsi secondo un mondo che non esiste.

### 3.1 La pipeline documentata è fittizia

I tre layer fondanti dichiarati non esistono: **NotebookLM** ha solo `NB-TESTI/CATALOGO_LIBRI.md` (NB-VIDEO e NB-ARTICOLI non hanno neppure la cartella; gli ID notebook in `SETUP_NOTEBOOKLM.md` sono in bianco); **Notion (Layer 2)** è dichiarato in CLAUDE.md §9 "punto di verità per i contenuti strutturati" ma non è mai stato costruito; il **Personalizzatore** ha solo un prompt, e la sua cartella output `05_APP/percorsi/` non esiste. `sintetizzatore.py` richiede credenziali NotebookLM+Notion e quindi non è mai stato eseguibile.

I 52 quiz, flashcard e microlearning reali sono stati prodotti via Claude API in batch, direttamente in `05_APP/.../data/` — non attraverso la pipeline Curatore→NotebookLM→Sintetizzatore descritta ovunque.

Raccomandazione: documentare la **pipeline reale** ("Claude API batch → `data/` → build Next.js") come pipeline ufficiale v1, e retrocedere NotebookLM/Notion a "estensioni future opzionali". Eliminare da CLAUDE.md la regola "il Layer 2 è il punto di verità": oggi è falsa e dannosa. Questo è l'intervento architetturale con il miglior rapporto costo/beneficio dell'intero audit: costa un pomeriggio di editing e rende ogni documento di nuovo affidabile.

### 3.2 Quanti agenti esistono? Quattro, cinque o sette

Le cartelle reali in `02_AGENTI/` sono **7**: curatore, sintetizzatore, generatore_asset, carble_cdd, microlearning, personalizzatore, **video_cinematico**. CLAUDE.md §2 dice "4 agenti", §6 titola "I 5 AGENTI", l'architettura §6.4 ne elenca 5 diversi; `agente_video_cinematico` non è censito in nessun documento. Il confine del microlearning è conteso (l'architettura lo assegna al Generatore, ma esiste un agente dedicato), e coesistono due validatori sovrapposti (DigComp Validator interno al microlearning + CARBLE-CDD) senza gerarchia dichiarata.

Raccomandazione: un **registro agenti** unico (una tabella: nome, stato attivo/prompt-only/sperimentale, input, output, codice presente sì/no), referenziato da CLAUDE.md e architettura invece di tre elenchi divergenti. Decidere: microlearning → agente dedicato; DigComp Validator = controllo interno di fase, CARBLE-CDD = gate finale pre-pubblicazione.

### 3.3 AGENTS.md è un fossile che compete con CLAUDE.md

AGENTS.md (v1.1, maggio 2026) dichiara 4 agenti, target 48 MC, app "prototipo", strumenti "Codex API + Canva API", e apre con "leggilo prima di qualsiasi operazione" — tutto superato. Due file di istruzioni con pari autorità e contenuti divergenti sono peggio di nessuno. Raccomandazione: ridurre AGENTS.md a un puntatore di una riga verso CLAUDE.md, o eliminarlo.

### 3.4 Deriva dei contatori (verificata su disco)

| Claim nei documenti | Realtà misurata | Dove correggere |
|---------------------|-----------------|------------------|
| "56 testi _completa.md, 2 da produrre" | **58** (52 standard + 6 INF; i 2 "da produrre" esistono già) | CLAUDE.md r.281 |
| "navigator 8 tab" (r.281) vs "6 tab" (r.365) | **6 tab** nel codice (`MCNavigator.tsx`) | CLAUDE.md r.281 |
| "sdg_principale 11/50" (r.311) vs "52/52" (r.313) | **52/52** | CLAUDE.md r.311 |
| Header "v1.2" vs footer "v1.3" | — | CLAUDE.md r.5 |
| Architettura §4: matrice a 24/48 MC; §10: app e syllabus "da creare" | 52 MC, app buildata, syllabus fatti | Architettura §4, §10 |
| TODO.md: "50 MC", "clil_termini mancanti in 39 MC" | 52 MC, 52/52 con clil_termini | Ritirare o rigenerare TODO.md |
| Dimensione brain: 9.879 chunk/14 libri vs 12.906 vettori/19 testi | da fissare un dato ufficiale unico | Architettura §12 vs RAPPORTO_INTEGRAZIONI |
| Strumenti Generatore: Canva+ElevenLabs (prompt) / GPT Image 2+edge-tts (arch.) / +Higgsfield (CLAUDE.md) / Codex+Canva (AGENTS.md) | codice reale: GPT Image 2 + edge-tts | `agente_generatore_asset/prompt.md` |
| Spec quiz: 3 domande (microlearning) / 5–10 (sintetizzatore) / 18 reali | **18 (6F+6I+6A)** | tutti i prompt agente |

### 3.5 CARBLE-CDD: claim di validazione non sostenuto da artefatti

CLAUDE.md ripete "validati CARBLE-CDD", ma la cartella output prevista `04_CONTENUTI/validazione/` **non esiste**; esiste un solo documento olistico manuale che peraltro esita "⚠️ DA RIVEDERE" sul criterio C. Due opzioni oneste: (a) generare davvero le schede per-MC, magari con uno script che applichi i 7 criteri in batch; (b) riformulare il claim in "revisione qualità di ecosistema, maggio 2026". L'opzione (a) è preferibile perché il protocollo è il pezzo più originale e spendibile del progetto verso l'esterno (scuole, bandi).

---

## 4. Dati: una sola fonte di verità

### 4.1 Il doppione `04_CONTENUTI/` vs `05_APP/.../data/`

Stato misurato: `04_CONTENUTI/quiz` = 5 file prototipo di maggio; `05_APP/.../data/quiz` = **52** aggiornati a luglio. `compiti_realta/` e `flashcard/` in 04 sono vuote. I visual sono duplicati byte-identici in due alberi (~450 MB ciascuno) che stanno già divergendo; gli audio hook esistono in entrambi; gli script hook vivono in tre posti. I prompt degli agenti dichiarano output in `04_CONTENUTI/`, ma l'app legge da `data/`.

Raccomandazione: dichiarare in CLAUDE.md che la fonte canonica dei contenuti consumati dall'app è `05_APP/tecnologia-sito-web/data/` + `public/assets/`, e che `04_CONTENUTI/` conserva solo i **master di generazione** (prompt txt/json, sorgenti immagine ad alta risoluzione) da cui una build deriva le copie per l'app. Cancellare i 5 quiz stantii e le cartelle vuote. Aggiornare i prompt agente di conseguenza. In alternativa, invertire la scelta — ma va scelta una direzione sola.

### 4.2 La decisione DIG/INF non è più rinviabile

È l'unica decisione editoriale bloccante aperta. Stato: 6 testi **MC-INF-\*** completi in 08_TESTI, **0 JSON** in matrice, 0 quiz/flashcard/pagine app; INDICE §5.2 raccomanda di eliminare **MC-DIG-2-03/04** e **MC-DIG-3-03** perché "sovrappongono esattamente" le INF; la matrice ha fatto l'opposto (i DIG esistono, le INF no). Finché resta aperta: il target "52" è ambiguo (52 o 58?), la stima pagine dell'INDICE è inaffidabile, e le stesse competenze (sistema operativo, cifratura, IoT) esistono scritte due volte.

Le due opzioni, con costi espliciti: **(A) INF dentro** → creare 6 JSON, 6 quiz, 6 flashcard, 6 microlearning, integrare nell'app, eliminare o rifondere le 3 DIG sovrapposte; libro a ~52 MC effettive ma rimappate. **(B) INF fuori** → spostare i 6 testi in un'area "materiale escluso/futuro", correggere INDICE §5.2, target dichiarato 52 senza asterischi. L'opzione B costa un'ora; l'opzione A una-due giornate di generazione. Entrambe sono meglio dello stato attuale.

### 4.3 Rifiniture di schema (tutte verificate)

Otto MC prime-di-area hanno `prerequisiti: []` dove lo schema impone `null` (violazione della regola dichiarata nello stesso `schema_MC.json`). `stem_connections` è presente solo in 8/52; `immagine_esplora` in **0/52** nonostante sia documentato nello schema, il componente `WikiImage.tsx` esista e 76 immagini sorgente siano pronte in `visual_esplora/` — una feature completa, codificata e mai cablata (vedi §6). Le due MC aggiunte per ultime (**MC-DIG-1-03**, **MC-DIG-2-05**) sono le uniche senza `note_didattiche`, senza transcript e senza video (per questo `data/videos` = 50 e `transcripts` = 56). Raccomandazione: normalizzare gli 8 `[]`→`null`, completare le 2 MC nuove, e per `stem_connections`/`immagine_esplora` decidere: o si popolano su tutte le 52, o si tolgono dallo schema. Un campo documentato ma vuoto al 100% è una promessa non mantenuta verso chiunque legga lo schema.

---

## 5. App: performance

### 5.1 Le immagini sono il problema, tutto il resto è rumore

Misurato: `public/` = **523 MB**, di cui 273 PNG (419 MB) e **0 WebP**; la più pesante (`MC-ALI-2-01_img1-soggetto.png`) supera gli 11 MB; l'export statico `out/` pesa 464 MB. Il JavaScript invece è già sano (~1 MB in `out/_next`): il collo di bottiglia non è il codice, sono i pixel. Con `output: "export"` e `images.unoptimized: true`, Next non ottimizza nulla, e i componenti usano `<img>` puro senza `width/height` né `loading="lazy"` sulla hero e sulla galleria (`MCVisual.tsx`).

Su una connessione scolastica o mobile, una pagina MC con hero da 3–11 MB più galleria caricata eagerly è inutilizzabile. Rimedio in due mosse: (1) script batch con `sharp` che converte tutto in WebP max ~1600 px, target <200 KB a immagine (stima: 503 MB → <30 MB, riduzione ~95%); (2) aggiungere `width`/`height`, `loading="lazy"` e `decoding="async"` in `MCVisual`. Questo singolo intervento vale più di tutti gli altri interventi tecnici del report messi insieme.

### 5.2 Payload e lavoro inutile

`public/mc-data.json` (225 KB) viene generato a ogni build "per filtri e ricerche" ma **nessun componente lo consuma** — la ricerca per cui era nato non esiste (vedi §6.1). La pagina MC è un unico componente client di 854 righe (`MCPageClient.tsx`): l'intera pipeline markdown gira nel browser su contenuto statico, e 23 componenti su 24 portano `"use client"` inclusi renderer puramente presentazionali. Rimedio: spostare il parsing lato server/build, lasciare client solo le foglie interattive (quiz, flashcard, drawer, tabs).

---

## 6. App: esperienza utente

L'app oggi è un ottimo *catalogo sfogliabile*. Per diventare l'app promessa dall'architettura servono tre cose, tutte con le fondamenta già presenti nel codice.

### 6.1 Ricerca: la feature più economica con il massimo ritorno

Con 52 MC, l'unico percorso per lo studente è Home → anno/area → card → MC. Non esiste ricerca né salto rapido; l'unico filtro è nel glossario. Il dato per costruirla (`mc-data.json`: id, titolo, area, tag) è già generato a ogni build. Una search nel `SiteHeader` (anche una semplice command-palette client-side) trasforma la navigazione.

### 6.2 Progressi: la scrittura è morta, quindi tutto è sempre a zero

`useProgress.ts` espone `recordQuizResult` e `markVisited`, ma nessun componente li chiama mai: l'unico consumatore (`Recommender.tsx`) legge contatori permanentemente vuoti. Rimedio minimo (poche righe): chiamare `recordQuizResult` alla fine del quiz e `markVisited` al mount della pagina MC. Rimedio pieno: una pagina "I miei progressi" (per classe: MC visitate, quiz superati per livello F/I/A) — che è anche il primo passo concreto e onesto verso la "personalizzazione" promessa, senza backend.

### 6.3 Attriti puntuali verificati

Su mobile l'aside con **Framework, Tag e Prerequisiti** è `hidden lg:block`: gli studenti da telefono perdono proprio la navigazione per prerequisiti (backlog P3.5). La home hardcoda i contatori ("9 Aree", "5 Zone") e 6 MC in evidenza anziché derivarli dai dati. Il `QuizWidget` contiene un quiz demo cablato di 67 righe (i quiz veri esistono per tutte le 52) e in empty-state mostra a un dodicenne il messaggio interno "Genera prima gli asset con l'Agente Sintetizzatore". La feature immagine-wiki in ESPLORA è codificata e ha 76 sorgenti pronte, ma 0/52 JSON la popolano e `public/images/wiki/` contiene solo `.gitkeep`: cablarla o rimuovere il codice morto.

---

## 7. App: accessibilità (qui il target BES/DSA si gioca la credibilità)

Il progetto dichiara che i contenuti Foundation "devono essere accessibili anche a studenti con BES lievi" e sceglie il font Atkinson Hyperlegible — ottime premesse che il resto dell'app non mantiene ancora.

| Problema verificato | Dove | Rimedio |
|---------------------|------|---------|
| Dark mode dichiarato ma incoerente: `prefers-color-scheme` inverte solo le variabili di sfondo, zero varianti `dark:` nei componenti → su OS scuro, chrome scuro con contenuti chiari | `globals.css` r.16 | Rimuovere la media query oppure implementare theming reale con toggle |
| Nessun controllo dimensione testo / interlinea, nessun rispetto di `prefers-reduced-motion` | globale | Toggle A+/A– e guard sulle transizioni — per un'app DSA-first è dovuto, non opzionale |
| Nessun link "salta al contenuto", `{children}` non incapsulato in `<main>` a livello layout (WCAG 2.4.1) | `app/layout.tsx` | Skip-link nascosto + landmark |
| `LevelTabs` dichiara `role="tab"` ma non gestisce le frecce (violazione pattern WAI-ARIA); `MCNavigator` invece lo fa correttamente | `LevelTabs.tsx` | Riusare il gestore tastiera di MCNavigator |
| Quiz senza `aria-live` sul feedback, opzioni non raggruppate come radio, barre progresso senza `role="progressbar"` | `QuizWidget.tsx` | Semantica ARIA di base |
| Pannelli accordion chiusi restano focusabili (niente `inert`/`hidden`) | `AccordionSection.tsx` | `inert` quando chiuso |
| `RubricaDrawer` è `aria-modal` senza vero focus trap né blocco scroll del body | `RubricaDrawer.tsx` | Trap del Tab + `inert` sullo sfondo |

Nessuna di queste correzioni richiede refactoring strutturale; insieme costituiscono una "onda a11y" da una-due giornate. Un audit di contrasto WCAG AA (già a backlog) chiude il cerchio.

---

## 8. Codice: robustezza e manutenibilità

Il debito più strategico è il **parser markdown fatto in casa**: ~20 regex concatenate in `content-loader.ts` che emettono sentinelle custom (`@@CODE:`, `@@SUBHEAD:`…) ri-parsate da `ReadableBodyInTab`; estrattori accoppiati al lessico dei contenuti (`extractProfessioneSection` cerca "chi lavora|professione|2030|futuro"; la rubrica dipende dall'emoji 📋 nel titolo; `splitSperimentaByLevel` usa un offset magico di +15 caratteri). Conseguenza: un redattore che riformula un titolo rompe silenziosamente la UI. Rimedio strutturale: adottare `remark`/`react-markdown` con un piccolo plugin per i callout, e spostare la struttura (livelli, rubrica, sezione professione) in frontmatter/JSON invece di ri-derivarla dalla prosa.

Puntuali: `getPrerequisiteChain` (`mc-loader.ts`) è ricorsione senza guardia sui cicli — un ciclo A→B→A manda in stack overflow la build (oggi il grafo è pulito, ma è una bomba a orologeria); token di design frammentati (hex hardcoded, **MAT** ed **ENE** condividono lo stesso `#B45309`, scala `gray-*` nel quiz vs `slate-*` altrove, due sfondi pagina quasi identici `#f6f8f7`/`#f7f8f5`, `!important` nei callout); doppia configurazione deploy (`netlify.toml` + `vercel.json`) con route API morta; `competenze-glossario.ts` da 2.106 righe che sarebbe meglio come JSON; `05_APP/TecnologIA_App.jsx` (91 KB, prototipo legacy) da archiviare.

---

## 9. Cosa NON fare

Altrettanto importante delle azioni: gli investimenti da evitare adesso.

**Non costruire il connettore Notion/Layer 2.** Il filesystem + `data/` funziona, è versionato e alimenta la build. Aggiungere Notion ora significherebbe due fonti di verità di nuovo. Riconsiderarlo solo se entrerà un secondo autore non tecnico.

**Non implementare l'export Coassemble/SCORM** dell'agente microlearning: l'app non lo consuma, e la dipendenza non è documentata nello stack. Riscrivere l'agente sul formato reale (Process + Checklist JSON).

**Non aggiungere MC oltre le 52** prima della decisione INF (§4.2), e non avviare l'espansione delle MC Advanced a 6 pagine finché i contatori dei documenti non sono riallineati: costruire su documentazione sbagliata moltiplica gli errori.

**Non riscrivere l'app.** La struttura regge; i problemi sono immagini, parsing e rifiniture. Una riscrittura brucerebbe il vantaggio accumulato (69 pagine, 0 errori TS).

---

## 10. Roadmap proposta

| Onda | Contenuto | Stima | Dipendenze |
|------|-----------|-------|------------|
| **1 — Meccanica** (subito) | WebP batch + lazy loading (§5.1) · pulizia 15 GB (§2.1) · fix `.gitignore` + file " 2" + rinomina `09_` (§2.3) · binari editoriali fuori da git (§2.2) · correzione contatori CLAUDE.md/TODO.md (§3.4) · ritiro AGENTS.md (§3.3) · empty-state quiz + rimozione demo (§6.3) | 1–2 giornate | nessuna |
| **2 — Decisioni + quick wins** | Decisione DIG/INF ed esecuzione (§4.2) · SSOT dati 04 vs 05 (§4.1) · completamento MC-DIG-1-03/2-05 (§4.3) · ricerca globale (§6.1) · `useProgress` in scrittura + pagina progressi (§6.2) · onda a11y (§7) · registro agenti + pipeline reale documentata (§3.1–3.2) | 3–5 giornate | Onda 1 per i contatori |
| **3 — Strutturale** | Parser `remark` + struttura in frontmatter (§8) · server components per la pagina MC (§5.2) · dark mode reale + controlli testo DSA (§7) · CARBLE-CDD per-MC con script batch (§3.5) · cablaggio `immagine_esplora` (§6.3) · guide studenti/famiglie in 07_GUIDE + docx syllabus classi 2–3 (gap verificato) · deploy definitivo su un solo host | 1–2 settimane | Onda 2 |

Il criterio della sequenza: prima si rende il terreno affidabile (onda 1), poi si prendono le decisioni che sbloccano i contenuti e si consegna valore visibile agli studenti (onda 2), infine si paga il debito strutturale che rende sostenibile la crescita verso il libro completo (onda 3).

---

*Audit condotto il 2026-07-08 su filesystem reale. Tutti i conteggi (52 JSON, 58 testi, 523 MB public, 14 GB worktrees, 0 WebP, 0 JSON INF, quiz 5 vs 52, videos 50, transcripts 56, gitignore errato) verificati con misurazione diretta prima della stesura. Le stime di riduzione peso immagini (~95%) sono inferenze da rapporti di compressione tipici PNG→WebP, non misure.*
