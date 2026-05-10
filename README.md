# ProfTecnologIA — App studenti

Sito statico Next.js per il progetto ProfTecnologIA.

## Deploy su Netlify (5 minuti)

### 1. Carica il repo su GitHub

```bash
# Dalla cartella TecnologIA/ (la root del progetto)
git init
git add .
git commit -m "ProfTecnologIA v1.0"
git remote add origin https://github.com/TUO-USERNAME/proftecnologia.git
git push -u origin main
```

### 2. Connetti a Netlify

1. Vai su netlify.com → Add new site → Import an existing project
2. Scegli GitHub e seleziona il tuo repository
3. Netlify legge automaticamente netlify.toml nella root:
   - Base directory: 05_APP/tecnologia-sito-web
   - Build command: npm run build
   - Publish directory: out
4. Clicca Deploy site

Il primo deploy richiede ~3 minuti.

## Sviluppo locale

```bash
cd 05_APP/tecnologia-sito-web
npm install
npm run dev
```

## Stack

- Next.js 16 con App Router, TypeScript
- Tailwind CSS 4
- Output statico (output: 'export') — zero costi su Netlify free tier
