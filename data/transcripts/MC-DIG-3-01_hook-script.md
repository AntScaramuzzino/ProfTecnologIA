# Hook audio — MC-DIG-3-01
**Titolo:** "Il robot che non sa dove si trova"
**MC:** MC-DIG-3-01 — Robotica educativa e pensiero computazionale avanzato
**Classe:** 3ª media · Livello Advanced
**Durata stimata:** 2 min 38 sec
**Oggetto reale:** un aspirapolvere robot (Roomba)
**SDG principale:** 9 — Industria, innovazione e infrastrutture

---

## SCRIPT

---

**[BLOCCO 1 — APERTURA CON OGGETTO · 18 sec]**

Il Roomba — l'aspirapolvere robot — sembra sapere dove si trova. [PAUSA]

Evita i muri. Copre tutta la stanza. Torna alla base. [PAUSA]

Ma non ha una mappa della tua casa. [PAUSA]

Non sa dove si trova. [ENFASI] [PAUSA]

Costruisce una stima probabilistica di dove potrebbe essere. [PAUSA]

Ogni secondo.

---

**[BLOCCO 2 — LA STORIA · 90 sec]**

Il Roomba fu lanciato da iRobot nel 2002 — [PAUSA]

fondata da Rodney Brooks e Colin Angle del MIT di Boston. [PAUSA]

Il problema da risolvere era: come fa un robot a navigare in un ambiente sconosciuto [PAUSA]

senza una mappa preesistente? [PAUSA]

La soluzione si chiama SLAM — Simultaneous Localization and Mapping. [PAUSA]

In italiano: localizzazione e mappatura simultanea. [PAUSA]

Il robot non conosce la casa. [PAUSA]

Ma ha sensori che misurano distanze, angoli, urti. [PAUSA]

Ogni volta che si sposta, aggiorna la sua stima della propria posizione — [PAUSA]

e aggiorna la mappa parziale che sta costruendo in tempo reale. [PAUSA]

È come trovare la strada in una città buia, senza cartina, [PAUSA]

contando i passi e ricordando ogni svolta. [PAUSA]

Il modello matematico dietro SLAM fu sviluppato negli anni '80-'90 [PAUSA]

da ricercatori di robotica e probabilità statistica — [PAUSA]

in particolare da Dieter Fox, Sebastian Thrun e Wolfram Burgard dell'Università di Bonn.

---

**[BLOCCO 3 — COLPO DI SCENA · 27 sec]**

Eccola, la cosa che nessuno ti dice. [PAUSA]

Il Roomba non "sa" dove si trova. [ENFASI] [PAUSA]

Mantiene una distribuzione di probabilità su tutte le posizioni possibili — [PAUSA]

e aggiorna quella distribuzione ad ogni nuovo dato sensoriale. [PAUSA]

Quando la distribuzione converge su una posizione con alta probabilità, il robot "decide" dove si trova. [PAUSA]

È la stessa logica che useranno i robot chirurgici, le auto autonome, i droni da esplorazione. [PAUSA]

Non certezza. Probabilità gestita.

---

**[BLOCCO 4 — AGGANCIO AL CONCETTO · 25 sec]**

Il pensiero computazionale avanzato non è saper programmare in un linguaggio specifico. [PAUSA]

È saper scomporre problemi complessi — come "dove mi trovo?" — [PAUSA]

in algoritmi gestibili, con input incerti, output probabilistici. [PAUSA]

È il modo in cui i sistemi robotici reali affrontano il mondo reale. [PAUSA]

Questo è esattamente quello che studierai adesso.

---

**[BLOCCO 5 — CALL TO ACTION · 14 sec]**

Se a casa hai un Roomba o un robot aspirapolvere — osservalo. [PAUSA]

Se no, cerca online un video del suo movimento. [PAUSA]

Riesci a dedurre l'algoritmo che usa solo guardandolo? [PAUSA]

Tieni quella ipotesi in testa — ti servirà.

---

## METADATI

```json
{
  "mc_id": "MC-DIG-3-01",
  "titolo_hook": "Il robot che non sa dove si trova",
  "oggetto_reale": "aspirapolvere robot (Roomba)",
  "durata_stimata_sec": 158,
  "livello_digcomp": "A",
  "dati_verificabili": [
    "iRobot fondata nel 1990 da Rodney Brooks, Colin Angle e Helen Greiner al MIT; Roomba lanciato nel 2002",
    "SLAM (Simultaneous Localization and Mapping) sviluppato tra gli anni '80-'90 da ricercatori inclusi Thrun, Fox, Burgard (Università di Bonn, Carnegie Mellon)",
    "Il filtro di particelle (Particle Filter) è uno degli algoritmi principali usati in SLAM probabilistico"
  ],
  "collegamento_geografico": ["MIT, Boston, USA", "Università di Bonn, Germania"],
  "sdg_principale": 9,
  "data_creazione": "2026-05-09",
  "versione": "1.0"
}
```

---

## NOTE DI REGIA

- **Tono generale:** tecnico ma accessibile, con curiosità genuina. Livello A.
- **[PAUSA]:** pausa di 0,5 sec.
- **[ENFASI]:** più lento, volume +10%.
- **Blocco 1:** tono di capovolgimento — l'oggetto familiare nasconde un paradosso.
- **Blocco 2:** tono di narrazione tecnica — la metafora della città buia è il punto centrale.
- **Blocco 3:** tono di concettualizzazione matematica — "distribuzione di probabilità" va detto con calma.
- **Blocco 4:** tono di ridefinizione della competenza — non codice, ma pensiero.
