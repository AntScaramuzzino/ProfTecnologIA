#!/usr/bin/env python3
"""
Agente Sintetizzatore — TecnologIA v1.0
Interroga NotebookLM via notebooklm-py, mappa gli output sullo schema MC
e deposita gli asset strutturati in 04_CONTENUTI/.

DIPENDENZE:
    pip install notebooklm-py anthropic notion-client python-dotenv

CONFIGURAZIONE (.env nella root del progetto):
    NOTEBOOKLM_AUTH_JSON=...  (esportato da notebooklm login)
    ANTHROPIC_API_KEY=...
    NOTION_TOKEN=...
    NOTION_DATABASE_ID=...
"""

import json
import os
import subprocess
import time
import argparse
from pathlib import Path
from datetime import datetime
from typing import Optional

# ── COSTANTI ────────────────────────────────────────────────────────────────

ROOT = Path(__file__).parent.parent.parent  # /TecnologIA/
MC_DIR = ROOT / "01_MATRICE_MC"
CONTENUTI_DIR = ROOT / "04_CONTENUTI"
NB_TESTI_ID_FILE = ROOT / "03_NOTEBOOKLM" / "NB-TESTI" / "notebook_id.txt"

CONTENT_TYPES = ["quiz", "microlearning", "flashcard", "compiti_realta"]


# ── UTILITIES ────────────────────────────────────────────────────────────────

def run_notebooklm(args: list[str], check=True) -> subprocess.CompletedProcess:
    """Esegue un comando notebooklm e restituisce il risultato."""
    cmd = ["python3", "-m", "notebooklm"] + args
    result = subprocess.run(cmd, capture_output=True, text=True)
    if check and result.returncode != 0:
        raise RuntimeError(f"notebooklm error: {result.stderr}")
    return result


def load_mc(mc_id: str) -> dict:
    """Carica il file JSON di una MC dato il suo ID."""
    # Cerca nella struttura clase_X/AREA/MC-ID.json
    for path in MC_DIR.rglob(f"{mc_id}.json"):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    raise FileNotFoundError(f"MC non trovata: {mc_id}")


def load_all_mcs() -> list[dict]:
    """Carica tutte le MC dall'albero 01_MATRICE_MC/."""
    mcs = []
    for path in sorted(MC_DIR.rglob("MC-*.json")):
        if "schema_MC" in str(path):
            continue
        with open(path, encoding="utf-8") as f:
            mcs.append(json.load(f))
    return mcs


def get_notebook_id() -> str:
    """Legge l'ID del notebook NB-TESTI dal file di configurazione."""
    if not NB_TESTI_ID_FILE.exists():
        raise FileNotFoundError(
            f"ID notebook non trovato in {NB_TESTI_ID_FILE}.\n"
            "Esegui prima il setup NotebookLM: vedi 03_NOTEBOOKLM/SETUP_NOTEBOOKLM.md"
        )
    return NB_TESTI_ID_FILE.read_text().strip()


def save_asset(mc_id: str, asset_type: str, content: dict) -> Path:
    """Salva un asset in 04_CONTENUTI/<tipo>/<MC_ID>_<tipo>.json."""
    out_dir = CONTENUTI_DIR / asset_type
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{mc_id}_{asset_type}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    print(f"  ✅ Salvato: {out_path.relative_to(ROOT)}")
    return out_path


# ── PROMPT TEMPLATES ─────────────────────────────────────────────────────────

def build_brief_prompt(mc: dict) -> str:
    """Costruisce il prompt per il brief didattico da inviare a NotebookLM."""
    return f"""Crea un brief didattico strutturato per la micro-competenza:

**ID:** {mc['id']}
**Titolo:** {mc['titolo']}
**Anno scolastico:** {mc['anno']}ª secondaria I grado
**Descrizione:** {mc['descrizione']}

Il brief deve includere:
1. Concetti chiave (3-5 concetti essenziali, max 2 righe ciascuno)
2. Esempi quotidiani collegati alla vita degli studenti di quella età
3. Misconcezioni comuni da evitare
4. Collegamento al compito di realtà: {mc['compito_realta']}
5. Differenziazione: come semplificare per BES e come estendere per eccellenza

Usa un linguaggio diretto, concreto, adatto alla progettazione didattica.
Rispondi in italiano."""


def build_quiz_prompt(mc: dict) -> str:
    """Prompt per la generazione di quiz a 3 livelli."""
    return f"""Genera 12 domande per un quiz sulla micro-competenza:
Titolo: {mc['titolo']}
Descrizione: {mc['descrizione']}
Compito di realtà: {mc['compito_realta']}

Struttura:
- 4 domande LIVELLO BASE (riconoscimento, definizione, abbinamento semplice)
- 4 domande LIVELLO INTERMEDIO (applicazione, analisi, scenario guidato)
- 4 domande LIVELLO AVANZATO (valutazione critica, progettazione, transfer)

Per ogni domanda:
{{
  "id": "Q01",
  "livello": "base|intermedio|avanzato",
  "tipo": "multipla|vero_falso|scenario|ordinamento",
  "testo": "...",
  "opzioni": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "risposta_corretta": "A",
  "feedback_errato": "Spiegazione del perché le altre opzioni sono sbagliate",
  "feedback_corretto": "Rinforzo del concetto chiave"
}}

Rispondi in italiano con JSON valido."""


def build_flashcard_prompt(mc: dict) -> str:
    return f"""Genera 10 flashcard per la micro-competenza: {mc['titolo']}

Per ogni flashcard:
{{
  "id": "F01",
  "fronte": "Termine o domanda (max 10 parole)",
  "retro": "Definizione o risposta (max 2 righe)",
  "categoria": "definizione|processo|esempio|formula|principio"
}}

Le flashcard devono coprire i concetti chiave di:
{mc['descrizione']}

Rispondi in italiano con JSON valido."""


def build_microlearning_prompt(mc: dict) -> str:
    return f"""Crea 5 slide di microlearning per: {mc['titolo']}

Anno: {mc['anno']}ª media — Livello DigComp: {mc['outputApp']['livelloDigComp']}

Per ogni slide:
{{
  "slide": 1,
  "titolo": "...",
  "testo_principale": "max 60 parole, linguaggio diretto per 12-14 anni",
  "esempio_concreto": "esempio dalla vita quotidiana dello studente",
  "immagine_suggerita": "descrizione dettagliata dell'immagine da illustrare",
  "domanda_riflessione": "domanda per attivare il pensiero (opzionale)"
}}

Inizia con una slide hook (scenario/domanda che cattura l'attenzione).
Finisci con una slide di sintesi.
Rispondi in italiano con JSON valido."""


# ── CORE: INTERROGAZIONE NOTEBOOKLM ──────────────────────────────────────────

def query_notebooklm(notebook_id: str, prompt: str, wait_seconds: int = 10) -> str:
    """Invia una domanda a NotebookLM e restituisce la risposta testuale."""
    # Imposta il contesto
    run_notebooklm(["use", notebook_id])

    # Invia la domanda
    result = run_notebooklm(["ask", prompt])
    return result.stdout.strip()


def generate_and_download_quiz(notebook_id: str, mc_id: str, difficulty: str = "medium") -> Optional[dict]:
    """Genera un quiz tramite NotebookLM e restituisce il JSON scaricato."""
    run_notebooklm(["use", notebook_id])

    print(f"  Generando quiz ({difficulty}) per {mc_id}...")
    result = run_notebooklm(["generate", "quiz", "--difficulty", difficulty, "--json"])

    try:
        data = json.loads(result.stdout)
        artifact_id = data.get("id") or data.get("artifact_id")
    except (json.JSONDecodeError, KeyError):
        print(f"  ⚠️  Impossibile ottenere artifact_id per quiz {mc_id}")
        return None

    # Attendi completamento
    print(f"  Attendo completamento artifact {artifact_id}...")
    run_notebooklm(["artifact", "wait", artifact_id])

    # Scarica
    tmp_path = f"/tmp/{mc_id}_quiz.json"
    run_notebooklm(["download", "quiz", tmp_path])
    with open(tmp_path, encoding="utf-8") as f:
        return json.load(f)


# ── PIPELINE PRINCIPALE ───────────────────────────────────────────────────────

def process_mc(mc: dict, notebook_id: str, asset_types: list[str]) -> dict:
    """
    Processa una singola MC generando tutti gli asset richiesti.
    Restituisce un dizionario con i risultati per tipo di asset.
    """
    mc_id = mc["id"]
    results = {"mc_id": mc_id, "timestamp": datetime.now().isoformat(), "assets": {}}

    print(f"\n🔄 Processing {mc_id}: {mc['titolo']}")

    if "quiz" in asset_types:
        try:
            # Strategia 1: genera quiz con prompt personalizzato via ask
            prompt = build_quiz_prompt(mc)
            raw_response = query_notebooklm(notebook_id, prompt)

            # Parsing risposta JSON embedded nella risposta testuale
            quiz_data = extract_json_from_response(raw_response)
            if quiz_data:
                asset = {
                    "mc_id": mc_id,
                    "tipo": "quiz",
                    "livelloDigComp": mc["outputApp"]["livelloDigComp"],
                    "domande": quiz_data,
                    "generato": datetime.now().isoformat(),
                    "fonte": "NotebookLM + prompt sintetizzatore"
                }
                save_asset(mc_id, "quiz", asset)
                results["assets"]["quiz"] = "ok"
            else:
                print(f"  ⚠️  Parsing quiz fallito per {mc_id}")
                results["assets"]["quiz"] = "parse_error"
        except Exception as e:
            print(f"  ❌ Quiz error: {e}")
            results["assets"]["quiz"] = f"error: {e}"

    if "flashcard" in asset_types:
        try:
            prompt = build_flashcard_prompt(mc)
            raw_response = query_notebooklm(notebook_id, prompt)
            card_data = extract_json_from_response(raw_response)
            if card_data:
                asset = {
                    "mc_id": mc_id,
                    "tipo": "flashcard",
                    "cards": card_data,
                    "generato": datetime.now().isoformat()
                }
                save_asset(mc_id, "flashcard", asset)
                results["assets"]["flashcard"] = "ok"
        except Exception as e:
            print(f"  ❌ Flashcard error: {e}")
            results["assets"]["flashcard"] = f"error: {e}"

    if "microlearning" in asset_types:
        try:
            prompt = build_microlearning_prompt(mc)
            raw_response = query_notebooklm(notebook_id, prompt)
            slides = extract_json_from_response(raw_response)
            if slides:
                asset = {
                    "mc_id": mc_id,
                    "tipo": "microlearning",
                    "slides": slides,
                    "formato": mc["outputApp"]["microlearning"],
                    "generato": datetime.now().isoformat()
                }
                save_asset(mc_id, "microlearning", asset)
                results["assets"]["microlearning"] = "ok"
        except Exception as e:
            print(f"  ❌ Microlearning error: {e}")
            results["assets"]["microlearning"] = f"error: {e}"

    if "brief" in asset_types:
        try:
            prompt = build_brief_prompt(mc)
            raw_response = query_notebooklm(notebook_id, prompt)
            asset = {
                "mc_id": mc_id,
                "tipo": "brief",
                "contenuto": raw_response,
                "generato": datetime.now().isoformat()
            }
            save_asset(mc_id, "microlearning", asset)  # brief va in microlearning/
            results["assets"]["brief"] = "ok"
        except Exception as e:
            print(f"  ❌ Brief error: {e}")
            results["assets"]["brief"] = f"error: {e}"

    return results


def extract_json_from_response(text: str) -> Optional[list | dict]:
    """
    Estrae un blocco JSON da una risposta testuale di NotebookLM.
    Supporta JSON grezzo, JSON in ```json ... ``` e JSON in elenchi puntati.
    """
    import re

    # Prova 1: cerca blocco ```json ... ```
    match = re.search(r"```json\s*([\s\S]*?)\s*```", text)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Prova 2: cerca array JSON diretto
    match = re.search(r"(\[[\s\S]*\])", text)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Prova 3: cerca oggetto JSON diretto
    match = re.search(r"(\{[\s\S]*\})", text)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    return None


# ── CONNETTORE NOTION ─────────────────────────────────────────────────────────

def push_to_notion(mc: dict, assets: dict, notion_token: str, database_id: str):
    """
    Aggiorna o crea una pagina Notion per la MC con i link agli asset generati.
    Richiede: pip install notion-client
    """
    try:
        from notion_client import Client
    except ImportError:
        print("  ⚠️  notion-client non installato. Salta push Notion.")
        return

    client = Client(auth=notion_token)
    mc_id = mc["id"]

    # Cerca pagina esistente con questo MC_ID
    query = client.databases.query(
        database_id=database_id,
        filter={"property": "MC_ID", "rich_text": {"equals": mc_id}}
    )

    page_properties = {
        "MC_ID": {"rich_text": [{"text": {"content": mc_id}}]},
        "Titolo": {"title": [{"text": {"content": mc["titolo"]}}]},
        "Area": {"select": {"name": mc["area"]}},
        "Anno": {"number": mc["anno"]},
        "Livello_DigComp": {"select": {"name": mc["outputApp"]["livelloDigComp"]}},
        "Fonte": {"rich_text": [{"text": {"content": mc["fonte"]}}]},
        "Asset_generati": {
            "multi_select": [{"name": k} for k, v in assets.items() if v == "ok"]
        },
        "Ultimo_aggiornamento": {
            "date": {"start": datetime.now().isoformat()}
        },
        "Compito_realta": {
            "rich_text": [{"text": {"content": mc.get("compito_realta", "")[:2000]}}]
        }
    }

    if query["results"]:
        # Aggiorna pagina esistente
        page_id = query["results"][0]["id"]
        client.pages.update(page_id=page_id, properties=page_properties)
        print(f"  📝 Notion aggiornato: {mc_id}")
    else:
        # Crea nuova pagina
        client.pages.create(
            parent={"database_id": database_id},
            properties=page_properties
        )
        print(f"  📝 Notion creato: {mc_id}")


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Agente Sintetizzatore TecnologIA — genera asset da NotebookLM"
    )
    parser.add_argument(
        "--mc", type=str, default=None,
        help="ID della MC da processare (es. MC-MAT-1-01). Se omesso, processa tutte."
    )
    parser.add_argument(
        "--area", type=str, default=None,
        help="Filtra per area (es. MAT, DIG, ENE). Solo se --mc non specificato."
    )
    parser.add_argument(
        "--anno", type=int, default=None,
        help="Filtra per anno (1, 2, 3). Solo se --mc non specificato."
    )
    parser.add_argument(
        "--assets", type=str, default="quiz,flashcard,microlearning",
        help="Tipi di asset da generare (comma-separated). Default: quiz,flashcard,microlearning"
    )
    parser.add_argument(
        "--no-notion", action="store_true",
        help="Salta il push verso Notion."
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Mostra cosa farebbe senza eseguire nulla."
    )
    args = parser.parse_args()

    # Carica configurazione
    from dotenv import load_dotenv
    load_dotenv(ROOT / ".env")

    notion_token = os.getenv("NOTION_TOKEN")
    notion_db_id = os.getenv("NOTION_DATABASE_ID")

    asset_types = [a.strip() for a in args.assets.split(",")]

    # Ottieni ID notebook
    try:
        notebook_id = get_notebook_id()
    except FileNotFoundError as e:
        print(f"❌ {e}")
        return

    # Seleziona MC da processare
    if args.mc:
        mcs = [load_mc(args.mc)]
    else:
        mcs = load_all_mcs()
        if args.area:
            mcs = [mc for mc in mcs if mc["area"] == args.area.upper()]
        if args.anno:
            mcs = [mc for mc in mcs if mc["anno"] == args.anno]

    print(f"\n🚀 Agente Sintetizzatore TecnologIA")
    print(f"   MC da processare: {len(mcs)}")
    print(f"   Asset da generare: {', '.join(asset_types)}")
    print(f"   Notebook ID: {notebook_id}")
    print(f"   Notion: {'✗ skip' if args.no_notion else ('✓' if notion_token else '⚠️ token mancante')}")

    if args.dry_run:
        print("\n[DRY RUN] Nessuna operazione eseguita. MC selezionate:")
        for mc in mcs:
            print(f"  - {mc['id']}: {mc['titolo']}")
        return

    # Processa ogni MC
    all_results = []
    for i, mc in enumerate(mcs, 1):
        print(f"\n[{i}/{len(mcs)}]", end="")
        results = process_mc(mc, notebook_id, asset_types)
        all_results.append(results)

        # Push Notion
        if not args.no_notion and notion_token and notion_db_id:
            push_to_notion(mc, results["assets"], notion_token, notion_db_id)

        # Rate limiting: pausa tra MC per non saturare NotebookLM
        if i < len(mcs):
            time.sleep(3)

    # Report finale
    print(f"\n\n{'='*60}")
    print("REPORT FINALE")
    print(f"{'='*60}")
    ok_count = sum(
        1 for r in all_results
        for status in r["assets"].values()
        if status == "ok"
    )
    total = sum(len(r["assets"]) for r in all_results)
    print(f"Asset generati con successo: {ok_count}/{total}")

    errors = [
        f"  {r['mc_id']} → {k}: {v}"
        for r in all_results
        for k, v in r["assets"].items()
        if v != "ok"
    ]
    if errors:
        print(f"\nErrori ({len(errors)}):")
        for e in errors:
            print(e)

    # Salva report
    report_path = CONTENUTI_DIR / f"report_sintetizzatore_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
    CONTENUTI_DIR.mkdir(parents=True, exist_ok=True)
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    print(f"\nReport salvato: {report_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
