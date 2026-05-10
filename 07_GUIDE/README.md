# 07_GUIDE — Guide operative e didattiche

Questa cartella raccoglie tutte le guide del progetto TecnologIA, organizzate per destinatario.

---

## Struttura

```
07_GUIDE/
├── docenti/        ← guide metodologiche, istruzioni per la didattica per competenze
├── studenti/       ← guide all'uso dell'app, come funzionano i percorsi, come leggere i quiz
├── famiglie/       ← guide accessibili per capire il progetto e supportare l'apprendimento
└── operative/      ← guide tecniche per chi gestisce il sistema (agenti, NotebookLM, Notion)
```

---

## Cosa va in ogni sottocartella

### `docenti/`
- Guide all'uso della matrice MC in classe
- Istruzioni per la differenziazione didattica (base / intermedio / avanzato)
- Come leggere e interpretare i progressi degli studenti nell'app
- Guida alla valutazione dei compiti di realtà con rubrica
- Allineamento ai framework: come spiegare DigComp, EntreComp, LifeComp ai colleghi

### `studenti/`
- Come usare l'app e navigare il percorso personale
- Cosa sono i livelli DigComp e come si avanza
- Come affrontare un compito di realtà (passo per passo)
- Guida ai quiz: come funzionano, cosa significa il feedback

### `famiglie/`
- Cos'è il progetto TecnologIA (linguaggio semplice, max 1 pagina)
- Cosa apprende il figlio in ogni anno scolastico
- Come supportare il lavoro a casa senza sostituirsi allo studente
- Glossario minimo (DigComp, micro-competenza, compito di realtà) spiegato senza tecnicismi

### `operative/`
- Come configurare i 3 notebook NotebookLM (NB-TESTI, NB-VIDEO, NB-ARTICOLI)
- Come eseguire manualmente l'Agente Curatore
- Come connettere Claude API al Layer 2 (Notion)
- Troubleshooting comune del sistema agenti

---

## Naming convention

```
[destinatario]_[argomento]_[versione].md

Esempi:
docenti_guida-valutazione-compito-realta_v1.md
famiglie_presentazione-progetto_v1.md
operative_configurazione-notebooklm_v1.md
```

---

## Tono e formattazione per destinatario

| Destinatario | Tono | Formattazione |
|---|---|---|
| Docenti | Professionale, diretto | Tabelle, elenchi numerati per sequenze operative |
| Studenti | Informale, concreto, seconda persona singolare | Domande e risposte, passi brevi |
| Famiglie | Accessibile, caldo, nessuna sigla senza spiegazione | Max 3-4 punti chiave, nessuna tabella tecnica |
| Operative | Tecnico, preciso, con esempi di codice se necessario | Blocchi di codice, screenshot referenziati |
