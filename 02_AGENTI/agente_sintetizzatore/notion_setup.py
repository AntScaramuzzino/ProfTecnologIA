#!/usr/bin/env python3
"""
Notion Setup — TecnologIA
Crea il database Notion per le MC e verifica la connessione.

UTILIZZO:
    pip install notion-client python-dotenv
    python3 notion_setup.py --create-db      # crea il database
    python3 notion_setup.py --check          # verifica connessione
    python3 notion_setup.py --sync-all       # importa tutte le 46 MC

CONFIGURAZIONE (.env):
    NOTION_TOKEN=secret_xxx
    NOTION_PAGE_ID=xxx   # ID della pagina Notion dove creare il database
"""

import json
import os
import argparse
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).parent.parent.parent
MC_DIR = ROOT / "01_MATRICE_MC"


def get_client():
    from notion_client import Client
    from dotenv import load_dotenv
    load_dotenv(ROOT / ".env")
    token = os.getenv("NOTION_TOKEN")
    if not token:
        raise ValueError("NOTION_TOKEN non trovato in .env")
    return Client(auth=token)


def check_connection():
    """Verifica la connessione a Notion."""
    client = get_client()
    me = client.users.me()
    print(f"✅ Connesso a Notion come: {me.get('name', 'utente')}")
    return True


def create_mc_database(parent_page_id: str) -> str:
    """
    Crea il database Notion per le MC con tutte le proprietà necessarie.
    Restituisce l'ID del database creato.
    """
    client = get_client()

    db = client.databases.create(
        parent={"type": "page_id", "page_id": parent_page_id},
        title=[{"type": "text", "text": {"content": "TecnologIA — Matrice MC"}}],
        properties={
            # Identificatori
            "Titolo": {"title": {}},
            "MC_ID": {"rich_text": {}},
            "Area": {
                "select": {
                    "options": [
                        {"name": "MAT", "color": "brown"},
                        {"name": "DIS", "color": "blue"},
                        {"name": "DIG", "color": "purple"},
                        {"name": "ALI", "color": "green"},
                        {"name": "AMB", "color": "yellow"},
                        {"name": "ENE", "color": "orange"},
                        {"name": "COM", "color": "pink"},
                        {"name": "SIS", "color": "gray"},
                    ]
                }
            },
            "Anno": {
                "select": {
                    "options": [
                        {"name": "1ª", "color": "blue"},
                        {"name": "2ª", "color": "green"},
                        {"name": "3ª", "color": "red"},
                    ]
                }
            },
            # Framework
            "Livello_DigComp": {
                "select": {
                    "options": [
                        {"name": "F", "color": "blue"},
                        {"name": "I", "color": "green"},
                        {"name": "A", "color": "orange"},
                        {"name": "H", "color": "red"},
                    ]
                }
            },
            "Fonte": {"rich_text": {}},
            "SDG": {"multi_select": {}},
            # Contenuto
            "Compito_realta": {"rich_text": {}},
            "Prerequisiti": {"rich_text": {}},
            "Tags": {"multi_select": {}},
            # Asset generati
            "Asset_generati": {
                "multi_select": {
                    "options": [
                        {"name": "quiz", "color": "blue"},
                        {"name": "flashcard", "color": "green"},
                        {"name": "microlearning", "color": "purple"},
                        {"name": "brief", "color": "yellow"},
                        {"name": "visual", "color": "orange"},
                    ]
                }
            },
            # Stato
            "Stato": {
                "select": {
                    "options": [
                        {"name": "Da generare", "color": "gray"},
                        {"name": "In lavorazione", "color": "yellow"},
                        {"name": "Completata", "color": "green"},
                        {"name": "Revisione", "color": "orange"},
                    ]
                }
            },
            "Ultimo_aggiornamento": {"date": {}},
        }
    )

    db_id = db["id"]
    print(f"✅ Database creato: {db_id}")
    print(f"   URL: https://notion.so/{db_id.replace('-', '')}")

    # Salva l'ID in .env
    env_path = ROOT / ".env"
    if env_path.exists():
        content = env_path.read_text()
        if "NOTION_DATABASE_ID" not in content:
            with open(env_path, "a") as f:
                f.write(f"\nNOTION_DATABASE_ID={db_id}\n")
            print(f"   NOTION_DATABASE_ID aggiunto a .env")

    return db_id


def sync_mc_to_notion(mc: dict, client, database_id: str):
    """Crea o aggiorna una pagina Notion per una MC."""
    mc_id = mc["id"]

    # Prepara le proprietà
    props = {
        "Titolo": {"title": [{"text": {"content": mc["titolo"]}}]},
        "MC_ID": {"rich_text": [{"text": {"content": mc_id}}]},
        "Area": {"select": {"name": mc["area"]}},
        "Anno": {"select": {"name": f"{mc['anno']}ª"}},
        "Livello_DigComp": {"select": {"name": mc["outputApp"]["livelloDigComp"]}},
        "Fonte": {"rich_text": [{"text": {"content": mc["fonte"]}}]},
        "Compito_realta": {"rich_text": [{"text": {"content": mc.get("compito_realta", "")[:2000]}}]},
        "Stato": {"select": {"name": "Da generare"}},
        "Ultimo_aggiornamento": {"date": {"start": datetime.now().date().isoformat()}},
    }

    # Tags
    if mc.get("tags"):
        props["Tags"] = {"multi_select": [{"name": t[:100]} for t in mc["tags"][:5]]}

    # SDG
    if mc.get("sdg"):
        props["SDG"] = {"multi_select": [{"name": f"SDG {s}"} for s in mc["sdg"]]}

    # Prerequisiti
    prereqs = mc.get("prerequisiti")
    if prereqs:
        props["Prerequisiti"] = {"rich_text": [{"text": {"content": ", ".join(prereqs)}}]}

    # Controlla se esiste già
    query = client.databases.query(
        database_id=database_id,
        filter={"property": "MC_ID", "rich_text": {"equals": mc_id}}
    )

    if query["results"]:
        page_id = query["results"][0]["id"]
        client.pages.update(page_id=page_id, properties=props)
        print(f"  🔄 Aggiornato: {mc_id}")
    else:
        # Aggiungi contenuto come blocchi nella pagina
        children = [
            {
                "object": "block",
                "type": "heading_2",
                "heading_2": {"rich_text": [{"text": {"content": "Descrizione"}}]}
            },
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {"rich_text": [{"text": {"content": mc["descrizione"]}}]}
            },
            {
                "object": "block",
                "type": "heading_2",
                "heading_2": {"rich_text": [{"text": {"content": "Compito di realtà"}}]}
            },
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {"rich_text": [{"text": {"content": mc.get("compito_realta", "")}}]}
            },
        ]

        # Aggiungi note didattiche se presenti
        nd = mc.get("note_didattiche", {})
        if nd:
            children.append({
                "object": "block",
                "type": "heading_2",
                "heading_2": {"rich_text": [{"text": {"content": "Note didattiche"}}]}
            })
            if nd.get("base"):
                children.append({
                    "object": "block",
                    "type": "callout",
                    "callout": {
                        "rich_text": [{"text": {"content": f"🔵 Base: {nd['base']}"}}],
                        "icon": {"emoji": "🔵"}
                    }
                })
            if nd.get("avanzato"):
                children.append({
                    "object": "block",
                    "type": "callout",
                    "callout": {
                        "rich_text": [{"text": {"content": f"🔴 Avanzato: {nd['avanzato']}"}}],
                        "icon": {"emoji": "🔴"}
                    }
                })

        client.pages.create(
            parent={"database_id": database_id},
            properties=props,
            children=children
        )
        print(f"  ✅ Creato: {mc_id}")


def sync_all_mcs():
    """Importa tutte le 46 MC nel database Notion."""
    from dotenv import load_dotenv
    load_dotenv(ROOT / ".env")
    database_id = os.getenv("NOTION_DATABASE_ID")
    if not database_id:
        raise ValueError("NOTION_DATABASE_ID non trovato in .env. Esegui prima --create-db.")

    client = get_client()

    # Carica tutte le MC
    mcs = []
    for path in sorted(MC_DIR.rglob("MC-*.json")):
        if "schema_MC" in str(path):
            continue
        with open(path, encoding="utf-8") as f:
            mcs.append(json.load(f))

    print(f"Sincronizzando {len(mcs)} MC su Notion...")
    for i, mc in enumerate(mcs, 1):
        print(f"[{i}/{len(mcs)}] {mc['id']}", end="  ")
        try:
            sync_mc_to_notion(mc, client, database_id)
        except Exception as e:
            print(f"❌ Errore: {e}")

    print(f"\n✅ Sincronizzazione completata.")


def main():
    parser = argparse.ArgumentParser(description="Notion Setup per TecnologIA")
    parser.add_argument("--check", action="store_true", help="Verifica connessione Notion")
    parser.add_argument("--create-db", type=str, metavar="PAGE_ID",
                        help="Crea il database MC nella pagina Notion specificata")
    parser.add_argument("--sync-all", action="store_true",
                        help="Importa tutte le MC nel database Notion")
    args = parser.parse_args()

    if args.check:
        check_connection()
    elif args.create_db:
        create_mc_database(args.create_db)
    elif args.sync_all:
        sync_all_mcs()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
