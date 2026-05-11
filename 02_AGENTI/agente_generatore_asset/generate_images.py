"""
Agente Artefice — Generatore di immagini per MC
6 immagini per MC, prompt ad alto dettaglio estratti dal testo narrativo.

Struttura immagini per MC:
  img1-innesca     Evocativa/narrativa — non fotorealistica, illustrazione editoriale
  img2-esplora     Concetto principale — dalla sezione 📖 ESPLORA
  img3-osserva     Caso studio reale   — dalla sezione 🔍 OSSERVA
  img4-sperimenta  Attività pratica    — dalla sezione 🔬 SPERIMENTA
  img5-infografica Densa di dati       — riassunto visivo dell'intera MC
  img6-mappa       Mappa concettuale   — schema delle relazioni tra concetti

Backend:
  higgsfield  (default) — CLI autenticato
  openai                — OPENAI_API_KEY richiesta

Uso:
  python generate_images.py --mc MC-MAT-1-02
  python generate_images.py --all --backend openai
  python generate_images.py --area ENE --dry-run
"""

import argparse
import asyncio
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Optional

try:
    import requests as _requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False

try:
    from openai import OpenAI as _OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

# ── PATH ──────────────────────────────────────────────────────────────────────

SCRIPT_DIR   = Path(__file__).parent
PROJECT_ROOT = (SCRIPT_DIR / "../../").resolve()
MC_ROOT      = PROJECT_ROOT / "01_MATRICE_MC"
TESTI_ROOT   = PROJECT_ROOT / "08_TESTI"
OUTPUT_ROOT  = PROJECT_ROOT / "04_CONTENUTI/visual"

CLI_ENV = {**os.environ,
           "PATH": f"{Path.home()}/.local/bin:{Path.home()}/.npm/bin:/usr/local/bin:/usr/bin:/bin"}

# ── IMMAGINI: TIPI, MODELLI, ASPECT RATIO ────────────────────────────────────

# 7 tipi di immagine per MC (img7-professione aggiunta)
IMAGE_TYPES = ["img1-innesca", "img2-esplora", "img3-osserva",
               "img4-sperimenta", "img5-infografica", "img6-mappa",
               "img7-professione"]

HIGGSFIELD_MODELS = {
    "img1-innesca":     "soul_cinematic",       # illustrazione evocativa narrativa
    "img2-esplora":     "gpt_image_2",          # concetto illustrato
    "img3-osserva":     "cinematic_studio_2_5", # fotorealismo documentaristico
    "img4-sperimenta":  "gpt_image_2",          # scena d'azione editoriale
    "img5-infografica": "gpt_image_2",          # infografica densa di dati
    "img6-mappa":       "gpt_image_2",          # mappa concettuale
    "img7-professione": "gpt_image_2",          # illustrazione simbolica professione 2030
}

ASPECT_RATIOS = {
    "img1-innesca":     "16:9",
    "img2-esplora":     "4:3",
    "img3-osserva":     "4:3",
    "img4-sperimenta":  "16:9",
    "img5-infografica": "1:1",
    "img6-mappa":       "1:1",
    "img7-professione": "3:4",   # verticale — sidebar Professione del Futuro
}

MODEL_EXTRA = {
    "cinematic_studio_2_5": {"resolution": "2k"},
    "gpt_image_2":          {"quality": "high", "resolution": "2k"},
    "soul_cinematic":       {},
    "text2image_soul_v2":   {"quality": "2k"},
}

OPENAI_SIZES_DALLE3 = {
    "16:9": "1792x1024", "4:3": "1024x1024",
    "1:1":  "1024x1024", "3:4": "1024x1792",
}
OPENAI_SIZES_GPT_IMAGE = {
    "16:9": "1536x1024", "4:3": "1024x1024",
    "1:1":  "1024x1024", "3:4": "1024x1536",
}

# ── PALETTE ───────────────────────────────────────────────────────────────────

AREA_PALETTES = {
    "MAT": {"hex1": "#C4622D", "hex2": "#F0DFC8", "name": "warm terracotta and sand"},
    "DIS": {"hex1": "#1B2A4A", "hex2": "#A8C8E8", "name": "deep navy and sky blue"},
    "DIG": {"hex1": "#00C896", "hex2": "#1E1E1E", "name": "electric green on dark"},
    "INF": {"hex1": "#3B3B9E", "hex2": "#C8D4F5", "name": "indigo and lavender"},
    "ALI": {"hex1": "#6B8C42", "hex2": "#F5E6A3", "name": "olive green and warm wheat"},
    "AMB": {"hex1": "#7A7A7A", "hex2": "#FF6B35", "name": "concrete grey with orange"},
    "ENE": {"hex1": "#FFD600", "hex2": "#2D2D2D", "name": "energetic yellow on anthracite"},
    "COM": {"hex1": "#6C3FC8", "hex2": "#B8D4F0", "name": "digital violet and sky blue"},
    "SIS": {"hex1": "#2B5FA6", "hex2": "#C0C0C0", "name": "steel blue and silver"},
}

DIGCOMP_COMPLEXITY = {
    "F": "clean minimal layout, single main concept",
    "I": "moderately complex, multiple connected elements",
    "A": "rich layered composition, dense information, expert detail",
    "H": "highly sophisticated, systemic complexity",
}

ANNO_ETA = {1: "11-12", 2: "12-13", 3: "13-14"}

# ── CARICAMENTO DATI ──────────────────────────────────────────────────────────

def load_mc(mc_id: str) -> dict:
    parts = mc_id.split("-")
    area, anno = parts[1], parts[2]
    p = MC_ROOT / f"classe_{anno}" / area / f"{mc_id}.json"
    if not p.exists():
        raise FileNotFoundError(f"MC non trovata: {p}")
    return json.loads(p.read_text(encoding="utf-8"))

def load_mc_text(mc_id: str) -> Optional[str]:
    parts = mc_id.split("-")
    area, anno = parts[1], parts[2]
    p = TESTI_ROOT / f"classe_{anno}" / area / f"{mc_id}_completa.md"
    return p.read_text(encoding="utf-8") if p.exists() else None

def load_all_mc_ids() -> list:
    return sorted(p.stem for p in MC_ROOT.rglob("MC-*.json"))

def load_mc_ids_by_area(area: str) -> list:
    return [m for m in load_all_mc_ids() if f"-{area.upper()}-" in m]

# ── ESTRAZIONE TESTO DAL NARRATIVO ────────────────────────────────────────────

def _strip_md(text: str) -> str:
    """Rimuove markdown, tabelle, blockquote, intestazioni di zona."""
    text = re.sub(r"^\|.*\|$", "", text, flags=re.MULTILINE)  # tabelle
    text = re.sub(r"^\s*>.*$", "", text, flags=re.MULTILINE)  # blockquote
    text = re.sub(r"\*{1,2}([^*\n]+)\*{1,2}", r"\1", text)   # bold/italic
    text = re.sub(r"#{1,6}\s+[●▸🔴🟡🟢•◦➤→]*\s*", "", text)  # headings
    text = re.sub(r"^\s*[-•●▸]\s+", "", text, flags=re.MULTILINE)  # bullets
    text = re.sub(r"\[PAUSA\]|\[ENFASI\]|\[NOTA[^\]]*\]", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

def _extract_section(full_text: str, zone_emoji_or_name: str,
                     max_chars: int = 600) -> str:
    """Estrae il corpo di una sezione dal _completa.md."""
    pattern = rf"##\s+[^\n]*{re.escape(zone_emoji_or_name)}[^\n]*\n(.*?)(?=\n##\s+|\Z)"
    m = re.search(pattern, full_text, re.DOTALL | re.IGNORECASE)
    if not m:
        return ""
    raw = _strip_md(m.group(1))
    # Prende i paragrafi più lunghi (i più informativi)
    paras = [p.strip() for p in raw.split("\n\n") if len(p.strip()) > 40]
    result = " ".join(paras)[:max_chars]
    return result

def _key_facts(text: str, n: int = 3) -> list[str]:
    """Estrae frasi chiave con dati numerici o nomi propri."""
    sentences = re.split(r"[.!?]+", text)
    # Preferisci frasi con numeri o parole geografiche/tecniche
    scored = []
    for s in sentences:
        s = s.strip()
        if len(s) < 20:
            continue
        score = len(re.findall(r"\d+", s)) * 2  # numeri = alta priorità
        score += len(re.findall(r"[A-Z][a-z]+", s))  # nomi propri
        scored.append((score, s))
    scored.sort(key=lambda x: -x[0])
    return [s for _, s in scored[:n]]


# ── COSTRUZIONE PROMPT ────────────────────────────────────────────────────────

def build_prompts(mc: dict, text: Optional[str]) -> dict:
    area    = mc.get("area", "MAT")
    anno    = mc.get("anno", 1)
    titolo  = mc.get("titolo", "")
    livello = mc.get("outputApp", {}).get("livelloDigComp", "F")
    palette = AREA_PALETTES.get(area, AREA_PALETTES["MAT"])
    cplx    = DIGCOMP_COMPLEXITY.get(livello, DIGCOMP_COMPLEXITY["F"])
    eta     = ANNO_ETA.get(anno, "11-14")

    hook     = mc.get("hook_audio", {}) or {}
    oggetto  = hook.get("oggetto_reale", "") or titolo.lower()
    domanda  = hook.get("domanda_avvio", "") or ""
    titolo_hook = hook.get("titolo", "") or ""

    tags     = [t for t in mc.get("tags", []) if "-" not in t][:5]
    concetti_str = ", ".join(tags) if tags else titolo

    prof_info = mc.get("professione_futura", {}) or {}
    professione = prof_info.get("titolo", "").split(" —")[0][:50]

    # Testo delle sezioni (se disponibile)
    innesca_text  = _extract_section(text, "INNESCA", 400)  if text else ""
    esplora_text  = _extract_section(text, "ESPLORA", 500)  if text else ""
    osserva_text  = _extract_section(text, "OSSERVA", 500)  if text else ""
    sperimenta_text = _extract_section(text, "SPERIMENTA", 400) if text else ""

    # Fatti chiave per prompt arricchiti
    esplora_facts  = _key_facts(esplora_text or mc.get("descrizione", ""))
    osserva_facts  = _key_facts(osserva_text or mc.get("descrizione", ""))

    # ── IMG 1 — INNESCA (evocativa, NON fotorealistica) ──────────────────────
    # Stile illustrativo/editoriale, contestualizzato all'hook
    innesca_detail = innesca_text[:200] if innesca_text else domanda[:150]
    img1 = (
        f"Evocative editorial illustration, NOT photorealistic, "
        f"inspired by: {titolo_hook or oggetto}, "
        f"visual concept: '{domanda[:120]}', "
        f"illustrative storytelling style, "
        f"thematic context: {innesca_detail[:150]}, "
        f"{palette['name']} color palette ({palette['hex1']}, {palette['hex2']}), "
        f"Italian middle school textbook opening illustration, "
        f"cinematic composition, no text, 16:9"
    )

    # ── IMG 2 — ESPLORA (concetto principale illustrato) ─────────────────────
    esplora_snippet = esplora_text[:250] if esplora_text else mc.get("descrizione", "")[:200]
    key1 = esplora_facts[0] if esplora_facts else concetti_str
    img2 = (
        f"Educational concept illustration: {titolo}, "
        f"showing: {esplora_snippet[:200]}, "
        f"key visual element: {key1[:120]}, "
        f"concepts: {concetti_str}, "
        f"{palette['name']} color scheme, "
        f"{cplx}, "
        f"Italian school textbook explanatory visual, "
        f"4:3 landscape, no photographic elements"
    )

    # ── IMG 3 — OSSERVA (caso studio documentaristico) ───────────────────────
    osserva_snippet = osserva_text[:250] if osserva_text else mc.get("descrizione", "")[:200]
    key2 = osserva_facts[0] if osserva_facts else f"{oggetto} in use"
    img3 = (
        f"Documentary editorial photograph or realistic illustration: "
        f"{osserva_snippet[:200]}, "
        f"specific detail: {key2[:120]}, "
        f"authentic Italian context for {anno}th grade students age {eta}, "
        f"natural lighting, {palette['name']} color accent, "
        f"high quality editorial photography style, "
        f"no text overlays, 4:3 landscape"
    )

    # ── IMG 4 — SPERIMENTA (attività pratica) ────────────────────────────────
    sperimenta_snippet = sperimenta_text[:200] if sperimenta_text else \
        mc.get("compito_realta", "")[:150]
    img4 = (
        f"Action scene illustration: Italian middle school students (age {eta}) "
        f"engaged in: {sperimenta_snippet[:180]}, "
        f"hands-on learning activity, collaborative group work, "
        f"classroom or lab setting, tools and materials visible, "
        f"{palette['name']} color accent, "
        f"positive and dynamic educational atmosphere, "
        f"editorial illustration style, 16:9 landscape"
    )

    # ── IMG 5 — INFOGRAFICA (densa di informazioni) ──────────────────────────
    all_facts = (esplora_facts + osserva_facts)[:4]
    facts_str = "; ".join(all_facts) if all_facts else concetti_str
    img5 = (
        f"Dense educational infographic: {titolo}, "
        f"rich with data and annotations, "
        f"key facts and data points: {facts_str[:250]}, "
        f"concepts: {concetti_str}, "
        f"multiple visual elements: diagrams, icons, numbers, arrows, callouts, "
        f"{palette['name']} color scheme ({palette['hex1']} and {palette['hex2']}), "
        f"clean white background, Italian labels, "
        f"Italian school textbook information design, "
        f"dense layout with high information density, "
        f"square 1:1 format"
    )

    # ── IMG 6 — MAPPA CONCETTUALE ─────────────────────────────────────────────
    prereqs = mc.get("prerequisiti", []) or []
    prereqs_str = ", ".join(prereqs[:3]) if prereqs else "prerequisiti di base"
    img6 = (
        f"Clean concept map / mind map diagram: central node '{titolo}', "
        f"connected to concepts: {concetti_str}, "
        f"prerequisite connections: {prereqs_str}, "
        f"branching relationships shown with labeled arrows, "
        f"{palette['name']} node colors, "
        f"white background, clean typography, Italian labels, "
        f"educational mind map style for Italian middle school, "
        f"square 1:1 format, no decorative elements"
    )

    # ── IMG 7 — PROFESSIONE DEL FUTURO (illustrazione simbolica) ─────────────
    # NON un ritratto fotografico: illustrazione editoriale che visualizza
    # gli strumenti, le competenze e l'ambiente della professione del futuro.
    prof_info    = mc.get("professione_futura", {}) or {}
    prof_titolo  = prof_info.get("titolo", f"Professional of the future in {titolo.lower()}")
    prof_desc    = prof_info.get("descrizione_breve", "")
    prof_comp    = prof_info.get("competenze_chiave", [])[:4]
    prof_orizzonte = prof_info.get("orizzonte", "2030")

    # Costruisce lista di elementi visivi dalle competenze
    tools_visual = (
        ", ".join(prof_comp) if prof_comp
        else f"tools and skills of {prof_titolo.lower()}"
    )

    # Ambientazione metaforica basata sulla descrizione
    ambiente = prof_desc[:120] if prof_desc else f"modern workspace for {prof_titolo}"

    img7 = (
        f"Flat editorial illustration: symbolic visual metaphor for "
        f"'{prof_titolo}' profession in {prof_orizzonte}, "
        f"NOT a portrait — visual composition of professional tools and symbols: "
        f"{tools_visual}, "
        f"metaphorical scene: {ambiente[:100]}, "
        f"key objects arranged in an evocative poster-like composition, "
        f"{palette['name']} color scheme ({palette['hex1']} dominant, {palette['hex2']} accent), "
        f"detailed flat design illustration style, "
        f"inspiring and forward-looking mood for Italian middle school students, "
        f"no human figures, no text, no labels, "
        f"3:4 vertical portrait format"
    )

    return {
        "img1-innesca":     img1,
        "img2-esplora":     img2,
        "img3-osserva":     img3,
        "img4-sperimenta":  img4,
        "img5-infografica": img5,
        "img6-mappa":       img6,
        "img7-professione": img7,
    }


# ── HIGGSFIELD CLI ────────────────────────────────────────────────────────────

def cli_create_job(model: str, prompt: str, aspect_ratio: str) -> Optional[str]:
    extra = MODEL_EXTRA.get(model, {})
    cmd = ["higgsfield", "generate", "create", model,
           "--prompt", prompt, "--aspect_ratio", aspect_ratio]
    for k, v in extra.items():
        cmd += [f"--{k}", str(v)]
    r = subprocess.run(cmd, capture_output=True, text=True, env=CLI_ENV, timeout=30)
    job_id = r.stdout.strip()
    if not job_id or len(job_id) < 10:
        print(f"  ❌ {r.stderr.strip()[:100]}")
        return None
    return job_id

def cli_poll_job(job_id: str, max_wait: int = 360) -> Optional[str]:
    start = time.time()
    attempt = 0
    while time.time() - start < max_wait:
        attempt += 1
        time.sleep(6)
        try:
            r = subprocess.run(
                ["higgsfield", "generate", "get", job_id, "--json"],
                capture_output=True, text=True, env=CLI_ENV, timeout=15)
            data = json.loads(r.stdout)
            status = data.get("status", "")
            url = data.get("result_url", "")
            if status == "completed" and url:
                return url
            if status in ("failed", "error", "cancelled"):
                print(f"  ❌ Job {status}")
                return None
            if attempt % 5 == 0:
                print(f"  ⏳ {status} ({int(time.time()-start)}s)…")
        except Exception as e:
            print(f"  ⚠️  {e}")
    print(f"  ❌ Timeout")
    return None

def download_image(url: str) -> Optional[bytes]:
    if HAS_REQUESTS:
        try:
            r = _requests.get(url, timeout=60)
            r.raise_for_status()
            return r.content
        except Exception as e:
            print(f"  ❌ Download: {e}")
            return None
    r = subprocess.run(["curl", "-s", url], capture_output=True, env=CLI_ENV, timeout=60)
    return r.stdout if r.returncode == 0 else None


# ── OPENAI BACKEND ────────────────────────────────────────────────────────────

def generate_image_openai(prompt: str, img_type: str,
                          model: str = "gpt-image-1") -> Optional[bytes]:
    if not HAS_OPENAI:
        print("  ❌ openai non installato")
        return None
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("  ❌ OPENAI_API_KEY mancante")
        return None

    ratio = ASPECT_RATIOS.get(img_type, "1:1")
    size  = (OPENAI_SIZES_GPT_IMAGE if model == "gpt-image-1"
             else OPENAI_SIZES_DALLE3).get(ratio, "1024x1024")

    try:
        client = _OpenAI(api_key=api_key)
        if model == "dall-e-3":
            q = "hd" if img_type in ("img5-infografica", "img6-mappa") else "standard"
            resp = client.images.generate(model="dall-e-3", prompt=prompt,
                                          size=size, quality=q, n=1)  # type: ignore
        else:
            q = "high" if img_type in ("img5-infografica", "img6-mappa") else "medium"
            resp = client.images.generate(model="gpt-image-1", prompt=prompt,
                                          size=size, quality=q, n=1)  # type: ignore

        img_data = resp.data[0]
        if hasattr(img_data, "b64_json") and img_data.b64_json:
            import base64
            return base64.b64decode(img_data.b64_json)
        elif hasattr(img_data, "url") and img_data.url:
            return download_image(img_data.url)
        return None
    except Exception as e:
        print(f"  ❌ OpenAI: {e}")
        return None


# ── PIPELINE MC ───────────────────────────────────────────────────────────────

def process_mc(mc_id: str, dry_run: bool = False,
               backend: str = "higgsfield",
               openai_model: str = "gpt-image-1",
               overwrite: bool = False) -> dict:
    print(f"\n{'─'*54}")
    print(f"🖼️  {mc_id}  [{backend}]")

    try:
        mc   = load_mc(mc_id)
        text = load_mc_text(mc_id)
    except FileNotFoundError as e:
        print(f"  ❌ {e}")
        return {"mc_id": mc_id, "status": "error", "error": str(e)}

    prompts = build_prompts(mc, text)

    # Salva prompt JSON
    out_dir = OUTPUT_ROOT / mc_id
    out_dir.mkdir(parents=True, exist_ok=True)
    pf = out_dir / f"{mc_id}_image-prompts.json"
    pf.write_text(json.dumps({
        "mc_id": mc_id, "generated_at": datetime.now().isoformat(),
        "backend": backend, "prompts": prompts,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  💾 6 prompt salvati")

    if dry_run:
        for k, v in prompts.items():
            print(f"  [{k}]\n  {v[:160]}…\n")
        return {"mc_id": mc_id, "status": "dry_run"}

    results: dict[str, Optional[str]] = {}

    if backend == "openai":
        print(f"  🚀 OpenAI ({openai_model}) — 6 immagini sequenziali…")
        for img_type, prompt in prompts.items():
            out_path = out_dir / f"{mc_id}_{img_type}.png"
            if out_path.exists() and not overwrite:
                print(f"  ⏭️  {img_type} già presente")
                results[img_type] = str(out_path)
                continue
            print(f"  ⏳ {img_type}…", end="", flush=True)
            data = generate_image_openai(prompt, img_type, model=openai_model)
            if data:
                out_path.write_bytes(data)
                print(f" ✅ {len(data)//1024} KB")
                results[img_type] = str(out_path.relative_to(PROJECT_ROOT))
            else:
                print(" ❌")
                results[img_type] = None
            time.sleep(2)

    else:  # higgsfield
        print(f"  🚀 Sottomissione 6 job Higgsfield…")
        jobs: dict[str, str] = {}
        for img_type, prompt in prompts.items():
            out_path = out_dir / f"{mc_id}_{img_type}.png"
            if out_path.exists() and not overwrite:
                print(f"  ⏭️  {img_type} già presente")
                results[img_type] = str(out_path)
                continue
            model = HIGGSFIELD_MODELS[img_type]
            ratio = ASPECT_RATIOS[img_type]
            job_id = cli_create_job(model, prompt, ratio)
            if job_id:
                jobs[img_type] = job_id
                print(f"  ✅ {img_type} → {job_id[:8]}…")
            else:
                print(f"  ⚠️  {img_type} non creato")

        for img_type, job_id in jobs.items():
            url = cli_poll_job(job_id)
            if not url:
                results[img_type] = None
                continue
            data = download_image(url)
            if not data:
                results[img_type] = None
                continue
            out_path = out_dir / f"{mc_id}_{img_type}.png"
            out_path.write_bytes(data)
            print(f"  🖼️  {out_path.name} ({len(data)//1024} KB)")
            results[img_type] = str(out_path.relative_to(PROJECT_ROOT))

    done = sum(1 for v in results.values() if v)
    print(f"  {'✅' if done == 6 else '⚠️ '} {done}/6 immagini")
    return {"mc_id": mc_id, "status": "completed", "images": results}


# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(
        description="Agente Artefice — 6 immagini per MC (innesca, esplora, osserva, sperimenta, infografica, mappa)")
    ap.add_argument("--mc")
    ap.add_argument("--area")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--backend", default="higgsfield", choices=["higgsfield", "openai"])
    ap.add_argument("--openai-model", default="gpt-image-1", choices=["dall-e-3", "gpt-image-1"])
    ap.add_argument("--overwrite", action="store_true")
    args = ap.parse_args()

    if not (args.mc or args.area or args.all):
        ap.print_help(); sys.exit(1)

    if args.backend == "openai" and not args.dry_run:
        if not HAS_OPENAI:
            print("❌ pip install openai --break-system-packages"); sys.exit(1)
        if not os.environ.get("OPENAI_API_KEY"):
            print("❌ export OPENAI_API_KEY='sk-...'"); sys.exit(1)

    if args.mc:
        mc_ids = [args.mc]
    elif args.area:
        mc_ids = load_mc_ids_by_area(args.area)
        print(f"📋  {len(mc_ids)} MC per area {args.area.upper()}")
    else:
        mc_ids = load_all_mc_ids()
        print(f"📋  {len(mc_ids)} MC · {len(mc_ids)*6} immagini totali")

    if not mc_ids:
        print("❌ Nessuna MC"); sys.exit(1)

    if args.backend == "openai" and not args.dry_run:
        n = len(mc_ids) * 6
        cost = n * 0.042
        print(f"💰  Costo stimato: ~${cost:.2f} ({n} img × $0.042 gpt-image-1 medium)")

    all_results = []
    for i, mc_id in enumerate(mc_ids, 1):
        print(f"\n[{i}/{len(mc_ids)}]", end="")
        r = process_mc(mc_id, dry_run=args.dry_run, backend=args.backend,
                       openai_model=args.openai_model, overwrite=args.overwrite)
        all_results.append(r)
        if not args.dry_run and i < len(mc_ids):
            time.sleep(3)

    print(f"\n{'='*54}")
    completed = sum(1 for r in all_results if r.get("status") == "completed")
    errors    = sum(1 for r in all_results if r.get("status") == "error")
    print(f"✅ Completate: {completed}/{len(mc_ids)}")
    if errors: print(f"❌ Errori:    {errors}")

    ts = datetime.now().strftime("%Y%m%d_%H%M")
    rp = OUTPUT_ROOT / f"generation_report_{ts}.json"
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    rp.write_text(json.dumps(all_results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"📊 Report: {rp.relative_to(PROJECT_ROOT)}")


if __name__ == "__main__":
    main()
