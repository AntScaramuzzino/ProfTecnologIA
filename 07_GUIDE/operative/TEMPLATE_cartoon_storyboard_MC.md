# Template Storyboard — Cartoon didattico per MC (TecnologIA)

Adattamento del modello "Sabellone STEM Cartoon" di Mauro Sabella (*SeFaccioImparo*) alla struttura delle Micro-Competenze di TecnologIA. Il glossario tecnico in coda deriva dal materiale di Sabella ed è citato come fonte.

**Versione:** 1.1 — Luglio 2026 (aggiornata dopo il test reale in Google Vids / Veo 3.1)
**Collocazione nel modello MC:** il cartoon è l'asset della zona **INNESCA**. Non è una lezione: è un gancio che apre una domanda e spinge lo studente dentro ESPLORA e SPERIMENTA.
**Narratore:** la figura di `professione_futura` della MC (varia per ogni MC). Il cartoon diventa così anche un micro-momento di orientamento.
**Sistema di produzione:** vedi `02_AGENTI/sistema_cartoon/` (3 agenti: Sceneggiatore & Testi · Regista movimenti macchina · Verificatore).

---

## 0. Vincoli reali di generazione (Veo 3.1, verificati il 15/07/2026)

Emersi dal test in Google Vids sulla Scena 1 di MC-MAT-1-02:

- **Lingua di destinazione = italiano**, ma Veo accetta **prompt solo in inglese** e genera parlato in inglese. Perciò: il **visual** si genera con prompt EN (senza parlato); la **voce narrante italiana** si aggiunge a parte (edge-tts `it-IT-IsabellaNeural` o "Voce fuori campo" di Vids), sovrapposta al video.
- **Clip da 8 secondi** (non 6): il cartoon standard = 7 scene × 8s ≈ 56s.
- **Il narratore non parla in scena** (bocca chiusa, sorriso, gesti) — così la voce IT non ha problemi di lip-sync.
- **Vietare il testo in scena** esplicitamente nel prompt: Veo tende a inserirne di finto.
- **Style lock semi-fotorealistico** (scelta autore, target 12–14): forzare "semi-photorealistic 3D animated style, cinematic warm lighting, slightly stylized realistic characters and environments". Lo stile flat 2D cartoon è stato scartato.
- **Coerenza del personaggio** tra scene: **obbligatoria** una **reference image** fissa del narratore, allegata come ingrediente Veo in ogni scena col narratore (procedura in `02_AGENTI/sistema_cartoon/narratore_reference.md`). Veo non ricorda il personaggio tra generazioni: senza reference il volto cambia (verificato nel test MC-MAT-1-02, Scena 1 ≠ Scena 7).

I prompt Veo di esempio nella §6 sono in inglese e rispettano queste regole. La voce narrata italiana è indicata a parte.

---

## 1. Principio guida

Il cartoon non spiega l'argomento: lo *innesca*. Vale la regola di Sabella — "non una lezione, ma una domanda". Quattro funzioni:

- Scintilla di coinvolgimento: aggancia prima di ESPLORA.
- Ponte STEM: mostra il concetto dentro un contesto reale e interdisciplinare (usa `stem_connections.frase_ponte`).
- Visualizzazione dell'astratto: traduce il concetto della MC in scene concrete.
- Domanda finale aperta: consegna allo studente cosa osservare in ESPLORA/SPERIMENTA (aggancia il `compito_realta`).

Vincolo di durata: **6–8 scene da ~6 secondi = 40–48 secondi totali**. Formato **16:9**, **nessun testo scritto nell'immagine** (il testo introduce errori di generazione ed è ridondante con la voce narrata).

---

## 2. Mappatura campi MC → storyboard

| Campo MC (JSON / _completa.md) | Uso nello storyboard |
|---|---|
| `professione_futura.titolo` + `descrizione_breve` | Character design del **narratore** ricorrente della MC |
| `hook_audio.domanda_avvio` | Voce narrata della **Scena 1** (apertura) |
| `hook_audio.oggetto_reale` | Oggetto concreto protagonista delle prime scene |
| ESPLORA — "le tappe" / sottotitoli | Una scena per ogni tappa chiave (max 4–5 concetti) |
| `clil_termini[0]` | Termine mostrato/pronunciato una sola volta, con naturalezza |
| `compito_realta` (verbo d'azione) | **Call to action** della scena finale |
| `sdg_principale` / `frameworks.EV` | Mood e chiusura valoriale (senza moralismo) |
| `note_didattiche.base` | Versione ridotta (meno scene) per BES / livello Foundation |

Regola anti-sovraccarico: **un solo concetto per scena**. Se la MC ha 7 fasi, il cartoon ne mostra 3–4 e lascia le altre a ESPLORA.

---

## 3. Struttura di una scena (blocco prompt)

Ogni scena si scrive con questi campi fissi. Sono i campi che uno strumento IA (Veo/Vids o generatore immagini) e il montaggio in Google Vids consumano direttamente.

```
SCENA [n] — [titolo interno]
Durata: [~6 sec]
Formato: 16:9, nessun testo nell'immagine
Personaggio (narratore): [professione_futura + descrizione look fisso]
Visual: [ambiente, oggetto, azione, atmosfera]
Inquadratura: [campo lungo | primo piano | dettaglio]
Movimento camera: [dolly in | dolly out | pan | tilt | zoom | fisso]
VFX/SFX: [effetti visivi + suoni ambientali]
Voce narrata (≤ 6 sec): "[testo]"
Transizione: [stacco netto | dissolvenza]
```

Coerenza di serie (non negoziabile): stesso `character design` del narratore, stessa palette e stesso `tono educativo` in tutte le scene e in tutte le MC della stessa area. Usa una **reference image** del narratore riutilizzata a ogni generazione.

---

## 4. Impalcatura di domande (INNESCA in app)

Riprende la scaffolding di Sabella, adattata alle 4 famiglie. Vanno nel testo INNESCA della MC, prima del video.

1. **Far emergere l'idea iniziale** — attiva preconcetti sull'`oggetto_reale`.
2. **Domande sulle tappe** — una per concetto mostrato nel cartoon.
3. **Ragionare come [professione_futura]** — domande che chiedono di distinguere, misurare, confrontare (pensiero da esperto del campo).
4. **Domanda di lancio del video** — chiude l'INNESCA e diventa la consegna d'osservazione: *"Durante il video osserva ..."*.

---

## 5. Regole tecniche (checklist di generazione)

- 16:9, nessun testo in scena, 6–8 scene × ~6 s.
- Narratore identico in tutte le scene (reference image).
- Una CLIL word al massimo, pronunciata correttamente.
- Voce narrata ≤ 6 s per scena, tono educativo (far capire, non stupire).
- Chiusura = call to action legata al `compito_realta`.
- Validazione **CARBLE-CDD** prima della pubblicazione: correttezza scientifica (C), adeguatezza età (A), assenza bias (R), fonti/licenze delle immagini generate (B), linguaggio/accessibilità (L), etica/sicurezza (E). Il cartoon "deve partire da dati e indizi", non da fantasia pura.

---

## 6. Esempio completo — MC-MAT-1-02

**Titolo MC:** Ciclo di vita dei materiali e cicli tecnologici
**Narratore:** *Supply Chain Sustainability Manager* (orizzonte 2030) — figura professionale che analizza le filiere per ridurre emissioni e sprechi. Look fisso: adulto in giacca tecnica leggera, tablet in mano con mappa-mondo delle rotte, tono curioso e concreto.
**Oggetto reale:** una felpa di cotone. **CLIL:** *life cycle* /laɪf ˈsaɪkəl/. **Call to action:** *traccia il passaporto tecnologico di un oggetto di casa*.
**SDG:** 12 — Consumo e produzione responsabili.

### Impalcatura di domande (INNESCA)

- *Idea iniziale:* Quando compri una felpa, dove pensi sia "nata"? In negozio?
- *Tappe:* Quante mani e quanti paesi tocca un oggetto prima di arrivare a te? Dove finisce quando lo butti?
- *Ragionare come Supply Chain Manager:* Se dovessi ridurre l'impronta di questa felpa, su quale fase interverresti per prima?
- *Lancio del video:* Durante il video osserva **quante fasi** attraversa la felpa — e in quale di queste puoi intervenire tu.

### Storyboard (7 scene · ~56 s · clip da 8 s)

> **Due tracce.** La riga *Voce narrata (IT)* è la traccia audio italiana (aggiunta a parte). La riga *Prompt Veo (EN)* è ciò che si incolla in Veo per il visual (senza parlato, senza testo). Qui sotto la Scena 1 è mostrata completa nelle due tracce; le Scene 2–7 riportano la voce narrata IT e la regia — i prompt Veo EN corrispondenti li produce l'Agente 2 secondo le regole della §0.

```
SCENA 1 — Apertura: il narratore e la felpa
Durata: ~8 sec · Formato: 16:9
Inquadratura: primo piano sul narratore che mostra la felpa.
Movimento camera: dolly in leggero.
VFX/SFX: rotte sulla mappa che si accendono una a una; chime ambientale soft.
Voce narrata (IT): "Questa felpa ha viaggiato più di te. Vuoi sapere quanto?"
Prompt Veo (EN): "Semi-photorealistic 3D animated style, cinematic warm lighting, richly detailed and slightly stylized characters and environments, friendly educational documentary tone suitable for students aged 12-14, 16:9. A friendly adult man, a supply chain sustainability manager, wearing a light blue technical jacket, holding a tablet showing a world map and a grey cotton hoodie, standing in a bright studio; behind him a large clean world map where glowing shipping routes light up one by one across continents. He gestures warmly toward the map. The narrator does NOT speak, calm closed-mouth smile, only gestures, no dialogue, no lip movement. Camera slowly dollies in. Soft ambient studio music and a gentle chime as the routes illuminate. Absolutely no on-screen text, no letters, no writing anywhere in the frame."
Transizione: dissolvenza.

SCENA 2 — Estrazione (il campo di cotone)
Durata: ~8 sec
Personaggio: narratore come voce guida (fuori campo o piccolo, a lato).
Visual: campo di cotone assolato, mani che raccolgono; cartello geografico stilizzato "Texas".
Inquadratura: campo lungo → dettaglio sul batuffolo di cotone.
Movimento camera: pan orizzontale sul campo.
VFX/SFX: vento tra le piante, luce calda.
Voce narrata (IT): "Tutto comincia da un campo, dall'altra parte del mondo."
Transizione: stacco netto.

SCENA 3 — Lavorazione e produzione (le fabbriche)
Durata: ~8 sec
Visual: filatura e cucitura in stabilimento; icone-tappa India → Bangladesh → Vietnam.
Inquadratura: dettaglio su filato → campo medio sulla catena di produzione.
Movimento camera: dolly out per rivelare la scala della fabbrica.
VFX/SFX: rumore ritmico di macchine, scintille di luce sui macchinari.
Voce narrata (IT): "Filata, tessuta, tinta, cucita: quattro paesi, un solo capo."
Transizione: dissolvenza.

SCENA 4 — Logistica (il viaggio)
Durata: ~8 sec
Visual: nave portacontainer e camion; linea tratteggiata che disegna 40.000 km su mappa.
Inquadratura: campo lungo aereo della nave.
Movimento camera: tilt dall'oceano alla mappa.
VFX/SFX: onde, sirena lontana; contatore chilometri che sale.
Voce narrata (IT): "Quarantamila chilometri prima di arrivare nel tuo armadio."
Transizione: stacco netto.

SCENA 5 — Uso (a casa tua)
Durata: ~8 sec
Visual: ragazzo che indossa la felpa in cameretta; atmosfera quotidiana.
Inquadratura: primo piano sul capo indossato.
Movimento camera: fisso, con leggero zoom.
VFX/SFX: musica leggera, luce domestica.
Voce narrata (IT): "Questa è l'unica parte della storia che di solito vediamo."
Transizione: dissolvenza.

SCENA 6 — Fine vita (il bivio)
Durata: ~8 sec
Visual: la felpa a un bivio: a sinistra una discarica, a destra un cassonetto del riciclo tessile che riavvia il ciclo.
Inquadratura: dettaglio sul bivio, poi campo medio.
Movimento camera: dolly in verso il cassonetto del riciclo.
VFX/SFX: due atmosfere contrapposte (grigia vs. verde); tintinnio.
Voce narrata (IT): "E quando la butti, il viaggio ricomincia o finisce qui?"
Transizione: stacco netto.

SCENA 7 — Call to action (il narratore torna)
Durata: ~8 sec
Personaggio: Supply Chain Sustainability Manager, di nuovo in primo piano con il tablet.
Visual: sul tablet compare l'icona di un "passaporto" dell'oggetto (senza testo leggibile).
Inquadratura: primo piano.
Movimento camera: dolly out lento.
VFX/SFX: la mappa alle spalle si spegne dolcemente.
Voce narrata (IT): "Adesso tocca a te: traccia il passaporto di un oggetto che hai in casa. Il suo life cycle."
Transizione: fine.
```

**Versione Foundation/BES** (`note_didattiche.base`): 4 scene (1 → 4 → 6 → 7), oggetto già nominato, voce narrata più lenta.

---

## 7. Verso la pipeline agentica (Vids)

Mappatura sui tuoi agenti, se si costruisce il sistema che genera e monta i cartoon:

- **Generatore Asset** → produce prompt scena-per-scena da questo template leggendo il JSON MC, genera clip (Veo / Vids) + voce narrata (edge-tts, coerente con l'hook audio già in uso), fornisce reference image del narratore.
- **CARBLE-CDD** → valida ogni scena prima del montaggio (blocco su errori scientifici, bias, licenze immagini generate).
- **Montaggio in Google Vids** → assembla scene + voce + SFX secondo l'ordine dello storyboard; export 16:9.
- **Personalizzatore** → serve la versione integrale o la versione Foundation in base al profilo studente.

Nota di fattibilità [INFERITO]: Google Vids **non** espone oggi un'API pubblica di montaggio programmatico documentata. Un "monta direttamente usando Vids" completamente automatico va verificato: probabile passaggio semi-manuale (l'agente prepara scene + storyboard, l'umano assembla in Vids), oppure montaggio automatico via ffmpeg fuori da Vids. Da confermare prima di progettare l'agente.

---

## 8. Glossario tecnico

*Fonte: glossario del cartoon didattico di Mauro Sabella (SeFaccioImparo — Sabellone STEM Cartoon).*

Storyboard · Scena · Sequenza · Concept · Hook (gancio iniziale) · Call to action · Prompt / Prompting · Reference image · Character design · Narratore esterno · Mediatore didattico · Linea narrativa · Ritmo narrativo · Climax · Mood · Tono educativo · Inquadratura (campo lungo, primo piano, dettaglio) · Movimento macchina (dolly in/out, pan, tilt, zoom) · Transizione (stacco netto, dissolvenza) · Audio ambientale · Voce narrata · Dialogo · SFX · VFX · Post-produzione · Iterazione · Output · Formato 16:9 · Durata scena.

---

*Riferimenti: Sabellone STEM Cartoon — https://sites.google.com/view/sefaccioimparo/intelligenza-artificiale/sabellone-stem-cartoon · schema MC v2.0 (`01_MATRICE_MC/schema_MC.json`) · Protocollo CARBLE-CDD v1.0.*
