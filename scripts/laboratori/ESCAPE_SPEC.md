# Escape room per micro-competenza — specifica per chi scrive le configurazioni

Ogni MC del libro ProfTecnologIA (scuola secondaria di primo grado, Tecnologia) ha già un laboratorio interattivo
(`scripts/laboratori/cfg/<mc>.js` o i pilota `*.src.html`). L'escape room è un'attività **nuova e diversa**: un gioco
narrativo con 5 lucchetti in sequenza. Ogni lucchetto è un problema che si risolve solo usando i contenuti della MC.

## File da scrivere

`scripts/laboratori/escape/<area>-<classe>-<nn>.js` (minuscolo, es. `mat-1-04.js` per MC-MAT-1-04).
Esempio completo e approvato: `scripts/laboratori/escape/ene-3-01.js`. **Leggilo prima di iniziare.**

```js
ESCAPE.run({
  id: "MC-XXX-n-nn", area: "XXX", classe: n, titolo: "Titolo breve e evocativo (2-5 parole)",
  ambientazione: "2-3 frasi: dove sei chiuso e perché. Concreto, credibile, legato al tema. La PRIMA frase va anche nell'indice del sito.",
  missione: "1-2 frasi: che cosa devi fare.",
  lucchetti: [ /* esattamente 5 */ ],
  porta: "Inserisci i cinque simboli nell'ordine in cui li hai trovati.",
  vittoria: "1-2 frasi: che cosa hai dimostrato di saper fare (le competenze della MC).",
  fonte: "facoltativo: nota a piè di pagina, es. dati semplificati o inventati a scopo didattico",
});
```

### Campi comuni a ogni lucchetto
- `titolo`: 2-5 parole. `testo`: HTML semplice (`<p>`, `<strong>`, `<table>`), la situazione e la domanda.
- `tipo`: uno di `numero`, `parola`, `scelta`, `ordine`, `coppie`. **Usa almeno 3 tipi diversi** nei 5 lucchetti.
- `indizi`: 1-2 stringhe, dal generico al quasi-risolutivo. `spiegazione`: perché la risposta è giusta (1-2 frasi).
- `errore` (facoltativo): messaggio mirato quando si sbaglia.
- `simbolo`: UNA lettera maiuscola o UNA cifra. I 5 simboli formano il codice della porta (es. `L5C7A`): scegline di vari, possibilmente legati al lucchetto (iniziale di una parola chiave, cifra del risultato).

### Tipi
- `numero`: `risposta` (numero), `tolleranza` (assoluta, es. 0.5), `etichetta` (es. "VM ="), `unita` (es. "N"). Lo studente può scrivere la virgola. Usa calcoli che si fanno a mano o con la calcolatrice in 1-2 passaggi, con numeri realistici.
- `parola`: `risposte`: array di forme accettate (maiuscole, accenti e spazi non contano). Solo per parole univoche e brevi (un termine tecnico, una parola decifrata). Includi le varianti ragionevoli (singolare/plurale).
- `scelta`: `opzioni` (3-4), `corretta` (indice da 0). Distrattori plausibili, basati su errori tipici; niente opzioni assurde. Preferisci situazioni/applicazioni alle definizioni a memoria.
- `ordine`: `elementi` (4-7) **nell'ordine corretto** (il motore li mescola). Solo se l'ordine è univoco (fasi di un processo, sequenza di un algoritmo, ordinamento per grandezza).
- `coppie`: `coppie`: `[[sinistra, destra], ...]` 3-6 coppie; i valori di destra tutti diversi.

## Regole di contenuto (obbligatorie — il lavoro sarà validato con il Protocollo CARBLE-CDD)
1. **Fonte**: leggi il testo della MC in `data/testi/classe_<n>/<AREA>/MC-...._completa.md` e usa SOLO contenuti, dati e formule coerenti con esso. Puoi guardare anche `data/quiz/<MC>_quiz.json` e il laboratorio esistente `scripts/laboratori/cfg/<mc>.js` per capire che cosa è già coperto: **non copiare le loro domande**, inventa problemi nuovi.
2. **Correttezza**: ogni numero deve tornare. Ricalcola ogni risposta. Niente statistiche reali non presenti nel testo; se inventi dati per un problema, sono plausibili e lo scenario lo rende chiaro (es. "la ditta del racconto").
3. **Livello**: studenti di 11-14 anni (classe 1ª, 2ª o 3ª della MC). Frasi brevi, lessico concreto, termini tecnici spiegati dal contesto. Progressione: lucchetti 1-2 riconoscere/capire, 3-4 applicare/calcolare, 5 ragionare/valutare.
4. **Stereotipi**: se usi persone, nomi italiani e non, maschili e femminili bilanciati, nessun ruolo legato al genere o all'origine.
5. **Etica**: niente marchi reali imitati, niente dati personali, niente pericoli suggeriti. Per temi digitali usa nomi di servizi inventati.
6. **Narrazione**: ambientazione coerente dall'inizio alla fine; ogni lucchetto è un oggetto/luogo dentro la storia. Tono vivace ma non infantile. Italiano corretto, niente emoji nel testo.
7. **Diversità di gioco**: non ripetere lo schema del laboratorio esistente; varia i tipi.
8. Stringhe JS tra doppi apici: attenzione agli apici interni (usa ’ o \" se serve; l'apostrofo ' va bene dentro "…").

## Verifica (obbligatoria prima di consegnare)
```bash
cd /home/claude/proftecnologia
npm run labs >/dev/null 2>&1          # genera public/embeds/escape/<MC>/index.html
AXE_PATH=/tmp/claude-0/-home-claude/3676f48c-6351-5b08-b81f-60bd9284c336/scratchpad/axe/node_modules/axe-core/axe.min.js \
  node scripts/laboratori/check-escape.cjs MC-XXX-n-nn MC-...   # solo le tue MC
```
Deve stampare `✓` per ogni MC. Il controllo gioca la partita intera, prova risposte sbagliate e verifica regole, accessibilità e larghezza smartphone. Correggi finché è tutto verde.

**Non modificare** `escape.js`, `escape.css`, `build-labs.mjs`, `check-escape.cjs` né file fuori da `scripts/laboratori/escape/`. Non fare commit. Altri agenti lavorano in parallelo su altre MC: `npm run labs` rigenera tutto ed è innocuo.
