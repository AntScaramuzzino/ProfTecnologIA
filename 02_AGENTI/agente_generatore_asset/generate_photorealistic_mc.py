"""
Genera una immagine AI fotorealistica JPG per ogni MC.

Modello: Higgsfield GPT Image 2 (`gpt_image_2`)

Uso:
    python3 generate_photorealistic_mc.py --mc MC-MAT-1-01
    python3 generate_photorealistic_mc.py --all
    python3 generate_photorealistic_mc.py --all --limit 5
    python3 generate_photorealistic_mc.py --all --dry-run

Output:
    04_CONTENUTI/visual/<MC-ID>/<MC-ID>_ai-fotorealistica.jpg
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import re
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Any

try:
    import requests
except ImportError:
    requests = None


SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = (SCRIPT_DIR / "../../").resolve()
MC_ROOT = PROJECT_ROOT / "01_MATRICE_MC"
TESTI_ROOT = PROJECT_ROOT / "08_TESTI"
OUTPUT_ROOT = PROJECT_ROOT / "04_CONTENUTI/visual"
GENERIC_SCRIPT = SCRIPT_DIR / "generate_images.py"

CLI_ENV = {
    **os.environ,
    "PATH": f"{Path.home()}/.local/bin:{Path.home()}/.npm/bin:/usr/local/bin:/usr/bin:/bin",
}

MODEL = "gpt_image_2"
ASPECT_RATIO = "16:9"
RESOLUTION = "1k"
QUALITY = "high"


def load_generic_module():
    spec = importlib.util.spec_from_file_location("generate_images", GENERIC_SCRIPT)
    if not spec or not spec.loader:
        raise RuntimeError("Impossibile caricare generate_images.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


GENERIC = load_generic_module()


def md_path_for(mc_id: str) -> Path:
    _, area, anno, _ = mc_id.split("-")
    return TESTI_ROOT / f"classe_{anno}" / area / f"{mc_id}_completa.md"


def load_text(mc_id: str) -> str | None:
    p = md_path_for(mc_id)
    return p.read_text(encoding="utf-8") if p.exists() else None


def title_from_md(text: str, fallback: str) -> str:
    for line in text.splitlines():
        clean = line.strip()
        if clean.startswith("#"):
            return clean.lstrip("#").strip()
    return fallback


def fallback_mc_from_md(mc_id: str) -> dict[str, Any]:
    _, area, anno, _ = mc_id.split("-")
    text = load_text(mc_id) or ""
    title = title_from_md(text, mc_id)
    return {
        "id": mc_id,
        "area": area,
        "anno": int(anno),
        "titolo": title,
        "tags": [area.lower(), title.lower()],
        "outputApp": {"livelloDigComp": "I"},
        "hook_audio": {"oggetto_reale": title},
        "esempio": {"testo": title},
    }


def load_mc(mc_id: str) -> dict[str, Any]:
    try:
        return GENERIC.load_mc(mc_id)
    except FileNotFoundError:
        return fallback_mc_from_md(mc_id)


def all_mc_ids() -> list[str]:
    json_ids = {p.stem for p in MC_ROOT.rglob("MC-*.json")}
    md_ids = {p.name.replace("_completa.md", "") for p in TESTI_ROOT.rglob("MC-*_completa.md")}
    return sorted(json_ids | md_ids)


def find_url(value: Any) -> str | None:
    if isinstance(value, str):
        match = re.search(r"https?://\\S+", value)
        return match.group(0).rstrip('",]') if match else None
    if isinstance(value, list):
        for item in value:
            found = find_url(item)
            if found:
                return found
    if isinstance(value, dict):
        preferred = [
            "result_url",
            "image_url",
            "media_url",
            "url",
            "output_url",
            "download_url",
        ]
        for key in preferred:
            if key in value:
                found = find_url(value[key])
                if found:
                    return found
        for item in value.values():
            found = find_url(item)
            if found:
                return found
    return None


def run_higgsfield(prompt: str) -> str:
    cmd = [
        "higgsfield",
        "generate",
        "create",
        MODEL,
        "--prompt",
        prompt,
        "--aspect_ratio",
        ASPECT_RATIO,
        "--resolution",
        RESOLUTION,
        "--quality",
        QUALITY,
        "--wait",
        "--wait-timeout",
        "15m",
        "--json",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, env=CLI_ENV, timeout=20 * 60)
    if result.returncode != 0:
        raise RuntimeError((result.stderr or result.stdout).strip())
    try:
        payload = json.loads(result.stdout)
        url = find_url(payload)
    except json.JSONDecodeError:
        url = find_url(result.stdout)
    if not url:
        raise RuntimeError("URL immagine non trovato nella risposta del generatore")
    return url


def download(url: str, tmp_path: Path) -> None:
    if requests:
        response = requests.get(url, timeout=90)
        response.raise_for_status()
        tmp_path.write_bytes(response.content)
    else:
        subprocess.run(["curl", "-fsSL", url, "-o", str(tmp_path)], check=True, timeout=90)


def convert_to_jpg(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["sips", "-s", "format", "jpeg", str(source), "--out", str(destination)],
        check=True,
        capture_output=True,
        text=True,
    )


def prompt_for(mc_id: str) -> str:
    mc = load_mc(mc_id)
    text = load_text(mc_id)
    prompt = GENERIC.build_prompts(mc, text).get("img1_soggetto", "")
    return (
        prompt
        + " High-fidelity realistic educational photography, accurate real-world materials, "
        + "no fantasy, no cartoon style, no readable text, no watermark."
    )


def process(mc_id: str, dry_run: bool = False, skip_existing: bool = True) -> dict[str, Any]:
    out_dir = OUTPUT_ROOT / mc_id
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f"{mc_id}_ai-fotorealistica.jpg"
    prompt_file = out_dir / f"{mc_id}_ai-fotorealistica_prompt.txt"
    prompt = prompt_for(mc_id)
    prompt_file.write_text(prompt, encoding="utf-8")

    if skip_existing and out_file.exists():
        return {"mc_id": mc_id, "status": "skipped", "image": str(out_file.relative_to(PROJECT_ROOT))}

    if dry_run:
        return {"mc_id": mc_id, "status": "dry_run", "prompt": str(prompt_file.relative_to(PROJECT_ROOT))}

    url = run_higgsfield(prompt)
    with tempfile.TemporaryDirectory() as td:
        raw = Path(td) / f"{mc_id}-raw"
        download(url, raw)
        convert_to_jpg(raw, out_file)

    return {"mc_id": mc_id, "status": "completed", "image": str(out_file.relative_to(PROJECT_ROOT))}


def main() -> None:
    ap = argparse.ArgumentParser(description="Genera immagini fotorealistiche JPG per MC via GPT Image 2")
    ap.add_argument("--mc", help="ID MC singola")
    ap.add_argument("--all", action="store_true", help="Genera per tutte le MC note")
    ap.add_argument("--limit", type=int, default=None, help="Limita il numero di MC da elaborare")
    ap.add_argument("--dry-run", action="store_true", help="Crea solo i prompt")
    ap.add_argument("--overwrite", action="store_true", help="Rigenera anche immagini gia presenti")
    args = ap.parse_args()

    if args.mc:
        ids = [args.mc]
    elif args.all:
        ids = all_mc_ids()
    else:
        ap.print_help()
        sys.exit(1)

    if args.limit:
        ids = ids[: args.limit]

    results = []
    for idx, mc_id in enumerate(ids, 1):
        print(f"[{idx}/{len(ids)}] {mc_id}")
        try:
            result = process(mc_id, dry_run=args.dry_run, skip_existing=not args.overwrite)
        except Exception as exc:
            result = {"mc_id": mc_id, "status": "error", "error": str(exc)}
            print(f"  ERRORE: {exc}")
            if "not_enough_credits" in str(exc):
                print("  Crediti insufficienti: interrompo il batch.")
                results.append(result)
                break
        results.append(result)
        print(f"  {result['status']}")

    report = OUTPUT_ROOT / f"photorealistic_generation_report_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
    report.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Report: {report.relative_to(PROJECT_ROOT)}")


if __name__ == "__main__":
    main()
