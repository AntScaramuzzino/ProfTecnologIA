# Deploy su GitHub + Netlify

Guida passo-passo per pubblicare il sito **ProfTecnologIA** online.

---

## Cosa viene pubblicato

Il sito è un'app Next.js 16 con export statico (`output: "export"`).
Netlify esegue `npm run build` → produce la cartella `out/` → la serve come sito statico.

**Non serve un server**: hosting gratuito, zero costi fissi.

---

## Prerequisiti

- Account [GitHub](https://github.com) (gratuito)
- Account [Netlify](https://netlify.com) (gratuito — collegalo con GitHub)
- Git installato sul Mac ([scarica qui](https://git-scm.com/download/mac) o usa `xcode-select --install`)

Verifica che Git sia installato aprendo il Terminale e digitando:
```bash
git --version
```

---

## Passo 1 — Crea la repository su GitHub

1. Vai su [github.com/new](https://github.com/new)
2. Impostazioni consigliate:
   - **Repository name**: `tecnologia-sito-web` (o `profteconologia`)
   - **Visibility**: Private (puoi renderla pubblica in seguito)
   - **NON** spuntare "Add a README file" né ".gitignore" né "license"
3. Clicca **Create repository**
4. Copia l'URL della repo (es. `https://github.com/tuoutente/tecnologia-sito-web.git`)

---

## Passo 2 — Inizializza Git e fai il primo push

Apri il **Terminale** (o usa il terminale integrato in VS Code), poi:

```bash
# Entra nella cartella del sito
cd "/Users/antonioscaramuzzino/Documents/Cowork/TecnologIA/05_APP/tecnologia-sito-web"

# Inizializza il repository Git locale
git init

# Aggiungi tutti i file (esclusi quelli nel .gitignore)
git add .

# Primo commit
git commit -m "feat: primo deploy ProfTecnologIA — 50 MC, sito statico Next.js"

# Collega al repository GitHub (sostituisci URL con il tuo)
git remote add origin https://github.com/TUOUTENTE/tecnologia-sito-web.git

# Pubblica
git push -u origin main
```

> Se Git chiede le credenziali, usa il tuo username GitHub e un **Personal Access Token**
> (non la password). Crealo su: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.

### Cosa viene incluso nella repo

| Cartella/File | Incluso | Note |
|---|---|---|
| `app/`, `components/`, `lib/` | ✅ | Codice sorgente Next.js |
| `data/mc/` | ✅ | 50 JSON delle micro-competenze (292 KB) |
| `data/testi/` | ✅ | 56 testi narrativi _completa.md (2 MB) |
| `public/assets/visual/` | ✅ | 54 SVG delle infografiche (420 KB) |
| `public/mc-data.json` | ✅ | Dati pre-generati per il client |
| `scripts/`, `netlify.toml` | ✅ | Config build e deploy |
| `node_modules/` | ❌ | Escluso da .gitignore (Netlify lo installa) |
| `.next/` | ❌ | Cache locale, Netlify la rigenera |
| `out/` | ❌ | Netlify la genera durante il build |

---

## Passo 3 — Crea il sito su Netlify

1. Vai su [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Scegli **GitHub** come provider → autorizza Netlify ad accedere ai tuoi repo
3. Seleziona la repo `tecnologia-sito-web`
4. Netlify legge in automatico il `netlify.toml` — non toccare nulla:

   | Campo | Valore (rilevato automaticamente) |
   |---|---|
   | Branch to deploy | `main` |
   | Base directory | *(lascia vuoto)* |
   | Build command | `npm run build` |
   | Publish directory | `out` |

5. Clicca **Deploy site**

Il primo build richiede ~2-3 minuti. Al termine Netlify ti dà un URL tipo:
`https://amazing-name-123456.netlify.app`

---

## Passo 4 (opzionale) — Dominio personalizzato

In Netlify: **Site settings** → **Domain management** → **Add custom domain**.
Puoi usare un dominio che possiedi già o comprarne uno direttamente da Netlify.

---

## Aggiornare il sito dopo modifiche

Ogni volta che aggiorni contenuti o codice, dal Terminale:

```bash
cd "/Users/antonioscaramuzzino/Documents/Cowork/TecnologIA/05_APP/tecnologia-sito-web"

git add .
git commit -m "aggiornamento: descrivi cosa hai cambiato"
git push
```

Netlify rileva il push e pubblica automaticamente la nuova versione (~2 min).

### Quando aggiornare i dati nella repo

| Evento | Cosa fare |
|---|---|
| Hai modificato/aggiunto MC JSON in `01_MATRICE_MC/` | Riesegui: `node scripts/sync-data.sh` (vedi sezione sotto) |
| Hai modificato/aggiunto testi `_completa.md` in `08_TESTI/` | Stessa cosa |
| Hai aggiunto nuovi SVG in `04_CONTENUTI/visual/` | Copia i nuovi file in `public/assets/visual/` |

---

## Script di sincronizzazione dati

Quando aggiorni le MC nel workspace, usa questo comando dal Terminale per sincronizzare i dati nella cartella del sito prima di fare push:

```bash
cd "/Users/antonioscaramuzzino/Documents/Cowork/TecnologIA/05_APP/tecnologia-sito-web"

# Sincronizza MC JSON
rsync -av --delete \
  "../../01_MATRICE_MC/classe_1/" "data/mc/classe_1/" \
  "../../01_MATRICE_MC/classe_2/" "data/mc/classe_2/" \
  "../../01_MATRICE_MC/classe_3/" "data/mc/classe_3/"

# Sincronizza testi _completa.md
find "../../08_TESTI" -name "*_completa.md" | while read f; do
  rel=$(echo "$f" | sed 's|.*/08_TESTI/||')
  dest="data/testi/$rel"
  mkdir -p "$(dirname $dest)"
  cp "$f" "$dest"
done

# Rigenera mc-data.json
node scripts/generate-data.mjs

echo "✅ Dati sincronizzati. Ora fai git add . && git commit && git push"
```

---

## Verifica del deploy

Dopo il primo deploy, controlla che funzionino:

- `https://tuo-sito.netlify.app/` → Homepage con 50 MC
- `https://tuo-sito.netlify.app/anno/1` → Tutte le MC della 1ª media
- `https://tuo-sito.netlify.app/area/MAT` → Area Materiali
- `https://tuo-sito.netlify.app/mc/MC-MAT-1-01` → Dettaglio prima MC con testo e visual

Se qualcosa non funziona, vai su **Netlify → Deploys → [ultimo deploy] → Deploy log** per leggere l'errore.

---

## Riepilogo architettura deploy

```
GitHub repo (tecnologia-sito-web)
  ├── app/           ← codice Next.js
  ├── data/mc/       ← 50 MC JSON (292 KB)
  ├── data/testi/    ← 56 testi markdown (2 MB)
  ├── public/        ← SVG + mc-data.json (5 MB)
  └── netlify.toml   ← config build

     ↓ push su main

Netlify (build automatico)
  npm run build
    → prebuild: genera public/mc-data.json
    → Next.js SSG: 50 pagine MC + 9 aree + 3 anni
    → output: cartella out/ (HTML/CSS/JS statici, ~31 MB)
  
  Risultato: sito statico servito dalla CDN Netlify
  → https://tuo-sito.netlify.app
```

---

*Ultima modifica: 2026-05-10*
