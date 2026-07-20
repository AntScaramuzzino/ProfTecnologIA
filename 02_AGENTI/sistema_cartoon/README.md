# Sistema Cartoon — architettura agentica (3 agenti)

Sistema per generare i **cartoon didattici delle MC** (modello "Sabellone STEM Cartoon" di Mauro Sabella, adattato a TecnologIA). Il cartoon è l'asset della zona **INNESCA**: non spiega, innesca una domanda.

**Versione:** 1.0 — Luglio 2026 · **Stato:** progettato, in test (Scena 1 MC-MAT-1-02 validata in Google Vids con Veo 3.1)
**Lingua di destinazione:** italiano.

---

## 1. Vincolo di lingua (verificato sul campo)

Dal test reale in Google Vids / Veo 3.1 (15 luglio 2026):

- Veo 3.1 accetta **prompt solo in inglese** ("Al momento non ci sono altre lingue supportate") e genera audio/parlato in inglese.
- Le clip durano **8 secondi**.
- Veo tende al **fotorealismo**, non al cartoon piatto: lo stile va forzato nel prompt.
- Veo **inserisce testo finto** in scena anche quando non richiesto: va vietato esplicitamente.

**Conseguenza architetturale:** si separano due tracce.

| Traccia | Lingua | Chi la produce |
|---|---|---|
| Visual (clip 8s) | prompt in **inglese**, **senza parlato** | Veo, pilotato dall'Agente 2 |
| Voce narrante | **italiano** | TTS italiano (edge-tts `it-IT-IsabellaNeural`, coerente con gli hook audio esistenti) o "Voce fuori campo" di Vids, montata sopra il visual |

Il narratore in scena **non parla** (bocca chiusa, sorriso, gesti): così la voce italiana si sovrappone senza problemi di lip-sync.

---

## 2. I tre agenti

```
        ┌─────────────────────────┐
        │  MC JSON (01_MATRICE_MC) │
        └────────────┬────────────┘
                     ▼
   ┌──────────────────────────────────┐
   │ AGENTE 1 — Sceneggiatore & Testi  │  concetto/scena, voce narrata IT,
   │                                    │  domande INNESCA, glossario, CTA
   └───────────────┬───────────────────┘
                   │  storyboard.json (beats + testi IT)   ⇅  collaborazione iterativa
                   ▼
   ┌──────────────────────────────────┐
   │ AGENTE 2 — Regista mov. macchina  │  inquadrature, movimenti camera,
   │                                    │  VFX/SFX, prompt Veo EN, coerenza personaggio
   └───────────────┬───────────────────┘
                   │  storyboard.json completo (regia + prompt Veo)
                   ▼
   ┌──────────────────────────────────┐
   │ AGENTE 3 — Verificatore (QA)      │  coerenza serie, fluidità, sync voce/durata,
   │                                    │  no-testo, CARBLE-CDD → verdetto
   └───────────────┬───────────────────┘
        APPROVED ───┼─── FLAGGED/BLOCKED → torna ad Agente 1/2
                   ▼
        Generazione in Vids (Veo, scena per scena) + VO IT + montaggio → export
```

Ruoli sintetici (prompt completi in `agente_1_sceneggiatore/`, `agente_2_regista/`, `agente_3_verificatore/`):

- **Agente 1 — Sceneggiatore & Testi.** Legge il JSON MC. Sceglie il narratore (= `professione_futura`), decide quali 3–5 concetti mostrare (non tutti), scrive per ogni scena: concetto, **voce narrata in italiano** dimensionata al budget 8s (≤ ~20 parole), e i testi INNESCA (impalcatura di domande) e la call to action da `compito_realta`. Non decide la regia. Passa `storyboard.json`.
- **Agente 2 — Regista dei movimenti macchina.** Riceve i beat dell'Agente 1 e li traduce in linguaggio cinematografico: inquadratura, movimento camera, VFX/SFX, ritmo. Scrive il **prompt Veo in inglese** per ogni scena rispettando le regole ferree (no parlato, no testo, style lock cartoon, 8s) e garantisce la **coerenza del personaggio** tra scene tramite reference image. Collabora con l'Agente 1 se un beat non è "girabile" (chiede di riformularlo).
- **Agente 3 — Verificatore.** QA prima della generazione: coerenza di serie, fluidità delle transizioni, sincronia voce IT/durata scena, assenza di testo in scena, e i 7 criteri **CARBLE-CDD** (D-C-A-R-B-L-E). Emette verdetto **APPROVED / FLAGGED / BLOCKED** e rimanda ad Agente 1 (testi) o Agente 2 (regia) le correzioni.

---

## 3. Artefatto di handoff — `storyboard.json`

È il contratto dati tra i tre agenti. Agente 1 compila `concetto`/`voce_narrata_it`; Agente 2 compila `regia`; Agente 3 compila `verifica`.

```json
{
  "mc_id": "MC-MAT-1-02",
  "titolo_mc": "Ciclo di vita dei materiali e cicli tecnologici",
  "lingua_voce": "it-IT",
  "narratore": {
    "ruolo": "Supply Chain Sustainability Manager",
    "look_fisso": "adulto, giacca tecnica leggera, tablet con mappa-mondo; sorriso calmo",
    "reference_image": "public/assets/cartoon/MC-MAT-1-02/narratore_ref.png"
  },
  "stile_serie": "flat 2D educational cartoon, thick clean outlines, flat bright colors",
  "durata_totale_sec": 56,
  "scene": [
    {
      "n": 1,
      "titolo": "Apertura: il narratore e la felpa",
      "concetto": "Un oggetto comune ha un viaggio globale nascosto",          // Agente 1
      "voce_narrata_it": "Questa felpa ha viaggiato più di te. Vuoi sapere quanto?",  // Agente 1 (≤ ~20 parole)
      "durata_sec": 8,
      "regia": {                                                                 // Agente 2
        "inquadratura": "primo piano sul narratore",
        "movimento_camera": "dolly in lento",
        "vfx_sfx": "rotte luminose che si accendono sulla mappa; chime soft",
        "prompt_veo_en": "Flat 2D educational cartoon, 16:9, absolutely no on-screen text... the narrator does NOT speak, calm closed-mouth smile...",
        "coerenza": "usa narratore_ref.png come reference/ingrediente"
      },
      "verifica": {                                                              // Agente 3
        "coerenza_personaggio": "ok",
        "fluidita_transizione": "dissolvenza verso scena 2",
        "sync_voce_durata": "12 parole / 8s → ok",
        "no_testo_in_scena": "ok",
        "carble_cdd": { "C": "ok", "A": "ok", "R": "ok", "B": "ok", "L": "ok", "E": "ok", "D": "ok" },
        "verdetto": "APPROVED"
      }
    }
  ]
}
```

---

## 4. Collocazione nella pipeline TecnologIA

- **Input canonico:** `01_MATRICE_MC/**/MC-*.json` (SSOT).
- **Riuso:** hook audio esistenti (`04_CONTENUTI/microlearning/hook/`) come traccia voce IT già pronta per la Scena 1.
- **QA:** l'Agente 3 applica il Protocollo **CARBLE-CDD v1.0** già in uso nel progetto.
- **Output:** clip generate + VO IT montate in Google Vids → export MP4 → carosello/tab **RIPASSA** dell'app (stesso punto d'uso delle presentazioni), oppure asset INNESCA.
- **Esecuzione della generazione:** via automazione browser su Google Vids (nessuna API pubblica di montaggio programmatico Vids confermata — vedi §6).

---

## 5. Verso la skill `cartoon-mc`

Da costruire **dopo** aver validato il sistema su un cartoon completo. Analoga a `presentazioni-mc`:

- **Trigger:** "genera il cartoon della MC-XXX", "fai lo storyboard cartoon", "monta il cartoon in Vids".
- **Flusso:** MC JSON → Agente 1 → Agente 2 → Agente 3 (verdetto) → `storyboard.json` → generazione Vids scena-per-scena via Chrome → VO IT → export → inserimento in RIPASSA.
- **Output:** `storyboard.json` + lista prompt Veo + MP4 + eventuale WebP anteprima.
- **Modalità batch:** intera classe/area ("fai i cartoon di tutta la 1ª").

---

## 6. Limiti noti e da verificare

- **Coerenza del personaggio** tra scene: Veo non ricorda il narratore tra generazioni. Mitigazione: reference image via funzione "Ingredienti"/Avatar. Da testare quanto regge.
- **Stile cartoon:** Veo tende al realismo; lo style lock nel prompt va tarato iterativamente (compito dell'Agente 3 segnalare drift).
- **Montaggio programmatico Vids [INFERITO/DA VERIFICARE]:** non risulta un'API pubblica; il pattern realistico è automazione del browser (dimostrata sulla Scena 1). Un agente "headless" puro non è confermato.
- **Testo in scena:** il divieto nel prompt riduce ma non azzera il rischio; l'Agente 3 lo controlla.

---

*Riferimenti: `07_GUIDE/operative/TEMPLATE_cartoon_storyboard_MC.md` · `01_MATRICE_MC/schema_MC.json` · Protocollo CARBLE-CDD v1.0 · modello Sabellone STEM Cartoon (SeFaccioImparo).*
