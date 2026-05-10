# Deploy ProfTecnologIA su Netlify
**Guida passo-passo — Maggio 2026**

Tempo stimato: 10 minuti. Nessun costo — Netlify free tier è sufficiente.

---

## Prerequisiti

- Account GitHub (gratuito) → [github.com](https://github.com)
- Account Netlify (gratuito) → [netlify.com](https://netlify.com)
- Git installato sul Mac (già presente su macOS)

---

## Passo 1 — Crea il repository su GitHub

1. Vai su [github.com/new](https://github.com/new)
2. Nome del repository: `proftecnologia` (o come preferisci)
3. Visibilità: **Private** (consigliato — i tuoi contenuti sono tutelati)
4. **Non** aggiungere README né .gitignore (li abbiamo già)
5. Clicca **Create repository**

---

## Passo 2 — Carica i file su GitHub

Apri il Terminale (Applicazioni → Utility → Terminale) e incolla questi comandi **uno alla volta**:

```bash
# Vai nella cartella del progetto
cd "/Users/antonioscaramuzzino/Documents/Cowork/TecnologIA"

# Inizializza git
git init

# Aggiungi tutti i file
git add .

# Primo commit
git commit -m "ProfTecnologIA v1.0 — 50 MC, design system, app Next.js"

# Collega al tuo repo GitHub
# Sostituisci TUO-USERNAME con il tuo nome utente GitHub
git remote add origin https://github.com/TUO-USERNAME/proftecnologia.git

# Carica
git branch -M main
git push -u origin main
```

GitHub chiederà le credenziali al primo push — inserisci username e password (o token).

> **Nota:** la cartella `node_modules` e `.next` sono nel `.gitignore` e non vengono caricate. Solo i sorgenti vengono trasferiti (~50 MB stimati con PDF e SVG inclusi).

---

## Passo 3 — Connetti a Netlify

1. Vai su [netlify.com](https://netlify.com) e accedi
2. Clicca **Add new site** → **Import an existing project**
3. Scegli **GitHub** → autorizza Netlify ad accedere ai tuoi repository
4. Cerca e seleziona `proftecnologia`
5. Netlify rileva automaticamente il file `netlify.toml` e configura:

| Impostazione | Valore |
|-------------|--------|
| Base directory | `05_APP/tecnologia-sito-web` |
| Build command | `npm run build` |
| Publish directory | `out` |

6. Clicca **Deploy site**

Il build richiede ~3 minuti la prima volta (installa npm, genera i dati, compila Next.js).

---

## Passo 4 — Il sito è online

Netlify assegna un URL del tipo:
```
https://luminous-stardust-abc123.netlify.app
```

Puoi cambiarlo in **Site settings → General → Site name** → es. `proftecnologia.netlify.app`.

---

## Aggiornamenti futuri

Ogni volta che modifichi i contenuti del progetto:

```bash
cd "/Users/antonioscaramuzzino/Documents/Cowork/TecnologIA"
git add .
git commit -m "Aggiornamento contenuti"
git push
```

Netlify rileva il push automaticamente e pubblica la nuova versione in ~2 minuti.

---

## Struttura del build

Quando Netlify esegue il build, succede questo:

1. **`npm run prebuild`** → genera `public/mc-data.json` con tutti i 50 MC
2. **`npm run build`** → Next.js legge i JSON da `01_MATRICE_MC/`, i testi da `08_TESTI/`, e genera HTML statico per ogni pagina
3. La cartella `out/` contiene il sito completo — Netlify la pubblica

Tutto avviene sul server di Netlify: non devi installare nulla in più sul Mac.

---

## Risoluzione problemi

**Il build fallisce con errore sui file:**
Verifica che i JSON in `01_MATRICE_MC/` siano validi con:
```bash
cd "/Users/antonioscaramuzzino/Documents/Cowork/TecnologIA/05_APP/tecnologia-sito-web"
node scripts/generate-data.mjs
```

**"Repository non trovato" su Netlify:**
Assicurati che il repo GitHub sia impostato come "Public" o che Netlify abbia accesso ai repo privati.

**Aggiornamento credenziali GitHub:**
Su macOS, le credenziali sono nel Portachiavi. Se scadono, usa `git credential-osxkeychain erase` e inseriscile di nuovo.
