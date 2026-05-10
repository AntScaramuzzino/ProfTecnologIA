# Agente Microlearning — Guida Operativa

**Versione:** 1.0 — Maggio 2026  
**Prompt principale:** `PROMPT_AGENTE_MICROLEARNING.md`

---

## Cosa fa questo agente

L'Agente Microlearning riceve in input una micro-competenza (MC) del progetto TecnologIA — o conduce un'intervista guidata — e produce un **modulo microlearning completo** pronto per la piattaforma Coassemble, allineato al framework DigComp 3.0.

Non genera contenuti in modo spontaneo. Applica una pipeline pedagogica a 4 fasi che garantisce coerenza tra obiettivi, attività e verifica.

---

## Pipeline operativa

```
Fase A: Analisi / Intervista   →  course_brief JSON
Fase B: DigComp Engine         →  profilo diagnostico (tipo, livello, pattern, backbone)
Fase C: Coassemble Builder     →  layout modulo in markdown
Fase D: DigComp Validator      →  score 0–100 + APPROVATO / DA RIVEDERE
                               →  Scheda Evidenza
```

---

## Come usarlo

### Modalità 1 — Da MC esistente (consigliata)

Incolla il prompt operativo come system prompt, poi invia il JSON della MC che vuoi trasformare in modulo. Esempio:

```
[system: contenuto di PROMPT_AGENTE_MICROLEARNING.md]

[user:]
Crea un modulo microlearning per questa MC:

{
  "id": "MC-DIG-1-01",
  "area": "Digitale",
  "anno": 1,
  "titolo": "Cos'è un algoritmo",
  "descrizione": "...",
  "frameworks": {
    "DC": { "ref": "1.3", "livello": "F" }
  },
  "outputApp": {
    "livelloDigComp": "F"
  },
  "compito_realta": "Analizza la sequenza di istruzioni che usi ogni mattina per prepararti..."
}
```

### Modalità 2 — Da zero (intervista)

Incolla il prompt operativo come system prompt, poi scrivi semplicemente:

```
[user:]
Voglio creare un modulo microlearning per una classe seconda sul tema della sicurezza online.
```

L'agente avvierà l'intervista con massimo 8 domande guidate.

---

## Output atteso

Per ogni modulo approvato l'agente produce:

1. **Layout Coassemble** in markdown strutturato (titolo, elementi numerati con tipo, contenuto, scopo)
2. **Quiz finale** con 3 MCQ (base/intermedio/avanzato) + 1 scenario, feedback formativo per ogni risposta
3. **Sezione Competenze attivate** (DigComp, Bloom, Learning Outcomes)
4. **Score di coerenza** (0–100) con eventuale lista correzioni
5. **Scheda Evidenza** pronta per tracciabilità e certificazione

---

## Adattamenti TecnologIA

Il prompt è calibrato per il contesto scolastico italiano (11–14 anni):

| Variabile | Valore adottato |
|---|---|
| Livelli DigComp | F=classe 1ª, I=classe 2ª, A=classe 3ª |
| Voce narrativa | Seconda persona singolare ("tu", "il tuo") |
| Hook | Sempre ancorato al `compito_realta` della MC |
| Differenziazione | 3 livelli nel Quiz (base / intermedio / avanzato) |
| Accessibilità | Elementi Foundation accessibili anche con BES lievi |

---

## File in questa cartella

| File | Descrizione |
|---|---|
| `PROMPT_AGENTE_MICROLEARNING.md` | Prompt operativo completo da usare come system prompt |
| `README.md` | Questo file |

---

## Relazione con gli altri agenti

Questo agente è **indipendente** dagli altri 4 agenti del sistema TecnologIA (Curatore, Sintetizzatore, Generatore Asset, Personalizzatore). Può però ricevere in input:

- MC JSON prodotte o aggiornate dall'**Agente Sintetizzatore**
- Profilo studente dall'**Agente Personalizzatore** (per selezionare il livello DigComp corretto)

Il suo output (layout modulo + scheda evidenza) confluisce in `04_CONTENUTI/microlearning/`.
