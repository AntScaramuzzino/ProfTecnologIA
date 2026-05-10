# Agente Sintetizzatore — TecnologIA

Genera asset didattici (quiz, flashcard, microlearning, brief) interrogando NotebookLM e deposita i risultati in `04_CONTENUTI/` e in Notion (Layer 2).

## Setup

```bash
# 1. Installa dipendenze
pip install notebooklm-py anthropic notion-client python-dotenv httpx[socks] socksio

# 2. Configura .env nella root TecnologIA/
cat > ../../.env << 'EOF'
NOTEBOOKLM_AUTH_JSON=...      # da: notebooklm login
ANTHROPIC_API_KEY=sk-ant-...  # da: console.anthropic.com
NOTION_TOKEN=secret_...       # da: notion.so/my-integrations
NOTION_PAGE_ID=...            # ID pagina Notion dove creare il database
NOTION_DATABASE_ID=           # compilato automaticamente da notion_setup.py
EOF

# 3. Crea il database Notion
python3 notion_setup.py --create-db YOUR_NOTION_PAGE_ID

# 4. Importa tutte le MC in Notion
python3 notion_setup.py --sync-all

# 5. Configura ID notebook NotebookLM
# Dopo aver eseguito il setup in 03_NOTEBOOKLM/SETUP_NOTEBOOKLM.md:
echo "YOUR_NB_TESTI_ID" > ../../03_NOTEBOOKLM/NB-TESTI/notebook_id.txt
```

## Utilizzo

```bash
# Processa una singola MC
python3 sintetizzatore.py --mc MC-MAT-1-01

# Processa tutte le MC di un'area
python3 sintetizzatore.py --area MAT

# Processa tutte le MC di un anno
python3 sintetizzatore.py --anno 1

# Processa tutto con asset selezionati
python3 sintetizzatore.py --assets quiz,flashcard

# Dry run (mostra cosa farebbe)
python3 sintetizzatore.py --dry-run

# Senza push Notion
python3 sintetizzatore.py --mc MC-DIG-3-02 --no-notion
```

## Output

Gli asset vengono salvati in:
```
04_CONTENUTI/
├── quiz/         MC-XXX-Y-ZZ_quiz.json
├── flashcard/    MC-XXX-Y-ZZ_flashcard.json
├── microlearning/ MC-XXX-Y-ZZ_microlearning.json (include anche i brief)
└── report_sintetizzatore_YYYYMMDD_HHMM.json
```

## Schema output quiz

```json
{
  "mc_id": "MC-MAT-1-01",
  "tipo": "quiz",
  "livelloDigComp": "F",
  "domande": [
    {
      "id": "Q01",
      "livello": "base",
      "tipo": "multipla",
      "testo": "...",
      "opzioni": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "risposta_corretta": "A",
      "feedback_errato": "...",
      "feedback_corretto": "..."
    }
  ],
  "generato": "2026-04-04T..."
}
```

## Note operative

- **NotebookLM** opera in batch asincrono — non interrogare più MC in parallelo
- **Rate limit**: attendi 3 secondi tra ogni MC (già implementato nel loop)
- **Notion** viene aggiornato in tempo reale ad ogni MC processata
- Se `notebooklm` restituisce 403, riesegui `notebooklm login`
