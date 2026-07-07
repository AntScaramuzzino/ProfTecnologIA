"""
Agente Curatore — Ricerca video YouTube per ogni MC
Fonti prioritarie (in ordine):
  1. Case Editrici scolastiche (Mondadori, Rizzoli, Zanichelli, Lattes)
  2. Geopop
  3. Insegnanti di Tecnologia SSIG (Prof. Falanga, Fabio Macchia, ProduttivaMENTE, HLModTech...)
  4. Grandi aziende e consorzi (Enel, ENI, Comieco, Corepla...)

Canali YouTube verificati:
  Mondadori Education  → youtube.com/user/MondadoriEducation
  Rizzoli Education    → youtube.com/c/RizzoliEducation
  Zanichelli           → youtube.com/user/zanichellieditore
  Lattes Editori       → youtube.com/user/LattesEditori
  Prof. Falanga        → youtube.com/c/ProfFalangainsegna  (ID: UClalALIsNbD8iSyv4xmHGUg)
  Fabio Macchia        → youtube.com/c/FabioMacchia
  ProduttivaMENTE      → youtube.com/c/ProduttivaMENTE
  HLMod Tech           → youtube.com/c/HLModTech
  Il Prof. Tecnologia  → youtube.com/channel/UCzdLuWgw-x3fVDZNBnaBRYA
  Video Mat. Didattici → youtube.com/channel/UCPgZjzVn8NqGpsb36ZZ6-6w

Siti non-YouTube (estratti video embed):
  tecnologia.annibalepinotti.it
  iltechnologico.it
  educazionetecnicaonline.com
  michelamassei.blogspot.com

Uso:
  python search_videos.py --mc MC-MAT-1-01 --dry-run
  python search_videos.py --all
  python search_videos.py --all --backend youtube  # con YOUTUBE_API_KEY
"""

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

SCRIPT_DIR   = Path(__file__).parent
PROJECT_ROOT = (SCRIPT_DIR / "../../").resolve()
MC_ROOT      = PROJECT_ROOT / "01_MATRICE_MC"
APP_ROOT     = PROJECT_ROOT / "05_APP/tecnologia-sito-web"
OUTPUT_DIR   = APP_ROOT / "data/videos"

# ── FONTI PRIORITARIE CON CANALI VERIFICATI ───────────────────────────────────

# Struttura: (priorità, label, lista_canali_youtube, lista_query_aggiuntive)
# Per backend 'youtube' si cerca per channelId; per 'search' si usa il nome nel query.

PRIORITY_CHANNELS = [

    # ── 1. CASE EDITRICI ──────────────────────────────────────────────────────
    (1, "Mondadori Education", {
        "channel_name":  "Mondadori Education",
        "channel_handle": "MondadoriEducation",
        "channel_id":    None,  # aggiungere se trovato
        "site":          "mondadorieducation.it",
    }),
    (1, "Rizzoli Education", {
        "channel_name":  "Rizzoli Education",
        "channel_handle": "RizzoliEducation",
        "channel_id":    None,
        "site":          None,
    }),
    (1, "Zanichelli", {
        "channel_name":  "Zanichelli editore",
        "channel_handle": "zanichellieditore",
        "channel_id":    None,
        "site":          "zanichelli.it",
    }),
    (1, "Lattes Editori", {
        "channel_name":  "Lattes Editori",
        "channel_handle": "LattesEditori",
        "channel_id":    None,
        "site":          "latteseditori.it",
    }),

    # ── 2. GEOPOP ─────────────────────────────────────────────────────────────
    (2, "Geopop", {
        "channel_name":  "Geopop",
        "channel_handle": "GeopodcastIT",
        "channel_id":    "UCpDNBnmKEZIBLFCCohpBcow",
        "site":          None,
    }),

    # ── 3. INSEGNANTI DI TECNOLOGIA SSIG ─────────────────────────────────────
    (3, "Prof. Falanga insegna", {
        "channel_name":  "Prof. Falanga insegna",
        "channel_handle": "ProfFalangainsegna",
        "channel_id":    "UClalALIsNbD8iSyv4xmHGUg",
        "site":          None,
    }),
    (3, "Fabio Macchia", {
        "channel_name":  "Fabio Macchia tecnologia disegno",
        "channel_handle": "FabioMacchia",
        "channel_id":    None,
        "site":          None,
    }),
    (3, "ProduttivaMENTE", {
        "channel_name":  "ProduttivaMENTE tecnologia",
        "channel_handle": "ProduttivaMENTE",
        "channel_id":    None,
        "site":          None,
    }),
    (3, "HLMod Tech", {
        "channel_name":  "HLMod Tech tecnologia scuola",
        "channel_handle": "HLModTech",
        "channel_id":    None,
        "site":          None,
    }),
    (3, "Il Prof. di Tecnologia", {
        "channel_name":  "Il Prof di Tecnologia",
        "channel_handle": None,
        "channel_id":    "UCzdLuWgw-x3fVDZNBnaBRYA",
        "site":          None,
    }),
    (3, "Video Materiali Didattici", {
        "channel_name":  "Video Materiali Didattici tecnologia",
        "channel_handle": None,
        "channel_id":    "UCPgZjzVn8NqGpsb36ZZ6-6w",
        "site":          None,
    }),
    (3, "Annibale Pinotti", {
        "channel_name":  "tecnologia annibalepinotti scuola media",
        "channel_handle": None,
        "channel_id":    None,
        "site":          "tecnologia.annibalepinotti.it",
    }),
    (3, "Il Technologico", {
        "channel_name":  "iltechnologico tecnologia scuola media",
        "channel_handle": None,
        "channel_id":    None,
        "site":          "iltechnologico.it",
    }),
    (3, "Educazione Tecnica Online", {
        "channel_name":  "educazionetecnicaonline scuola media",
        "channel_handle": None,
        "channel_id":    None,
        "site":          "educazionetecnicaonline.com",
    }),
    (3, "Michela Massei", {
        "channel_name":  "Michela Massei tecnologia scuola media",
        "channel_handle": None,
        "channel_id":    None,
        "site":          "michelamassei.blogspot.com",
    }),
    (3, "Marco Torella", {
        "channel_name":  "Marco Torella tecnologia scuola media",
        "channel_handle": None,
        "channel_id":    None,
        "site":          "marcotorella.com",
    }),
    (3, "Zoomiamo il Mondo", {
        "channel_name":  "Zoomiamo il mondo tecnologia scuola",
        "channel_handle": None,
        "channel_id":    None,
        "site":          "zoomiamoilmondo.blogspot.com",
    }),
    (3, "Pelli Prof Tecnologia", {
        "channel_name":  "Pelli prof tecnologia scuola media",
        "channel_handle": None,
        "channel_id":    None,
        "site":          "pelliproftecnologia.blogspot.com",
    }),
]

# ── AZIENDE E CONSORZI PER AREA ───────────────────────────────────────────────

AREA_COMPANIES = {
    "MAT": ["Comieco riciclo carta", "Corepla plastica riciclo", "Conai packaging sostenibile"],
    "DIS": ["Autodesk education disegno 3D", "CAD scuola disegno tecnico"],
    "DIG": ["Microsoft Education digitale", "Google Education scuola"],
    "INF": ["Microsoft Education coding", "Google informatica scuola"],
    "ALI": ["Barilla educational alimentazione", "AIDEPI industria alimentare scuola", "Coldiretti agricoltura"],
    "AMB": ["Legambiente città sostenibile scuola", "ANCE costruzioni edilizia"],
    "ENE": ["Enel energia rinnovabile scuola", "ENI educational energia", "GSE gestore servizi energetici"],
    "COM": ["TIM digital education", "Trenitalia trasporti scuola", "Autostrade infrastrutture"],
    "SIS": ["Confindustria economia scuola", "Unioncamere sistema economico"],
}

# ── CARICAMENTO MC ────────────────────────────────────────────────────────────

def load_mc(mc_id: str) -> dict:
    parts = mc_id.split("-")
    area, anno = parts[1], parts[2]
    p = MC_ROOT / f"classe_{anno}" / area / f"{mc_id}.json"
    if not p.exists():
        raise FileNotFoundError(f"MC non trovata: {p}")
    return json.loads(p.read_text(encoding="utf-8"))

def load_all_mc_ids() -> list:
    return sorted(p.stem for p in MC_ROOT.rglob("MC-*.json"))

def load_mc_ids_by_area(area: str) -> list:
    return [m for m in load_all_mc_ids() if f"-{area.upper()}-" in m]

def build_topic(mc: dict) -> str:
    """Parole chiave dal titolo della MC per la query."""
    titolo = mc.get("titolo", "")
    words  = [w for w in titolo.split() if len(w) > 3][:5]
    return " ".join(words)


# ── ESTRAZIONE VIDEO ID ───────────────────────────────────────────────────────

_YT_ID_RE = re.compile(
    r'(?:"videoId"|/watch\?v=|youtu\.be/|/embed/)[":\s/]*([A-Za-z0-9_-]{11})'
)

def _parse_yt_page(html: str, max_results: int = 8) -> list[dict]:
    """Estrae video ID e titoli dall'HTML di una pagina YouTube."""
    titles: dict[str, str] = {}

    # Pattern principale: videoId + text nelle vicinanze
    for m in re.finditer(
        r'"videoId":"([A-Za-z0-9_-]{11})"[^{]{0,300}?"text":"([^"]{5,120})"',
        html, re.DOTALL
    ):
        vid_id, title = m.group(1), m.group(2)
        if vid_id not in titles:
            titles[vid_id] = title

    # Pattern alternativo
    for m in re.finditer(
        r'"text":"([^"]{5,120})"[^{]{0,200}?"videoId":"([A-Za-z0-9_-]{11})"',
        html, re.DOTALL
    ):
        title, vid_id = m.group(1), m.group(2)
        if vid_id not in titles:
            titles[vid_id] = title

    ids_ordered = list(dict.fromkeys(_YT_ID_RE.findall(html)))
    results = []
    for vid_id in ids_ordered:
        if len(vid_id) == 11 and vid_id not in ("shorts", "embed", "watch"):
            results.append({
                "id":        vid_id,
                "title":     titles.get(vid_id, ""),
                "thumbnail": f"https://img.youtube.com/vi/{vid_id}/mqdefault.jpg",
            })
            if len(results) >= max_results:
                break
    return results


# ── BACKEND YOUTUBE API ───────────────────────────────────────────────────────

def _yt_search_api(yt, query: str, channel_id: str | None = None,
                   max_results: int = 5) -> list[dict]:
    params = dict(
        part="snippet", q=query, type="video",
        videoEmbeddable="true", relevanceLanguage="it",
        maxResults=max_results, safeSearch="strict",
    )
    if channel_id:
        params["channelId"] = channel_id
    try:
        resp = yt.search().list(**params).execute()
        return [
            {
                "id":        item["id"]["videoId"],
                "title":     item["snippet"]["title"],
                "thumbnail": f"https://img.youtube.com/vi/{item['id']['videoId']}/mqdefault.jpg",
            }
            for item in resp.get("items", [])
        ]
    except Exception as e:
        print(f"    ⚠️  API: {e}")
        return []


# ── BACKEND WEB SEARCH ────────────────────────────────────────────────────────

def _yt_search_web(query: str, channel_handle: str | None = None,
                   max_results: int = 5) -> list[dict]:
    try:
        import requests
    except ImportError:
        return []

    # Costruisce l'URL di ricerca YouTube
    full_query = f"{query}"
    if channel_handle:
        full_query = f"{query}"  # Il nome canale è già nel query
    search_url = (
        f"https://www.youtube.com/results"
        f"?search_query={requests.utils.quote(full_query)}"
        f"&sp=EgIQAQ%3D%3D"
    )
    try:
        r = requests.get(search_url, timeout=15, headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 Chrome/124 Safari/537.36"
            ),
            "Accept-Language": "it-IT,it;q=0.9",
        })
        return _parse_yt_page(r.text, max_results)
    except Exception as e:
        print(f"    ⚠️  Web: {e}")
        return []


def _channel_search_web(topic: str, source: dict,
                        max_results: int = 5) -> list[dict]:
    """
    Cerca video in un canale specifico.
    Se ha channel_id: cerca su youtube.com/channel/{id}/search?query=...
    Altrimenti: aggiunge il channel_name alla query normale.
    """
    try:
        import requests
    except ImportError:
        return []

    channel_id = source.get("channel_id")
    channel_name = source.get("channel_name", "")

    if channel_id:
        # Ricerca diretta nel canale
        url = (
            f"https://www.youtube.com/channel/{channel_id}/search"
            f"?query={requests.utils.quote(topic)}"
        )
        try:
            r = requests.get(url, timeout=15, headers={
                "User-Agent": (
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 Chrome/124 Safari/537.36"
                ),
                "Accept-Language": "it-IT,it;q=0.9",
            })
            results = _parse_yt_page(r.text, max_results)
            if results:
                return results
        except Exception:
            pass

    # Fallback: ricerca YouTube normale con nome canale nel query
    return _yt_search_web(f"{topic} {channel_name}", max_results=max_results)


# ── RACCOLTA VIDEO CON PRIORITÀ ───────────────────────────────────────────────

def collect_videos(mc: dict, backend: str, api_key: str = "",
                   target: int = 12) -> list[dict]:
    """
    Raccoglie fino a `target` video unici rispettando le priorità.
    Ordine: P1 editrici → P2 geopop → P3 insegnanti → P4 aziende → P5 generale
    """
    topic     = build_topic(mc)
    area      = mc.get("area", "MAT")
    seen_ids: set[str] = set()
    collected: list[dict] = []

    # Raggruppa le fonti per priorità
    from collections import defaultdict
    by_priority: dict[int, list] = defaultdict(list)
    for (priority, label, source) in PRIORITY_CHANNELS:
        by_priority[priority].append((label, source))

    yt = None
    if backend == "youtube" and api_key:
        try:
            from googleapiclient.discovery import build
            yt = build("youtube", "v3", developerKey=api_key)
        except Exception:
            pass

    def _add_results(results: list[dict], label: str):
        new = 0
        for v in results:
            if v["id"] not in seen_ids and len(collected) < target:
                seen_ids.add(v["id"])
                v["_source_label"] = label
                if not v.get("title"):
                    v["title"] = f"{topic} — {label}"
                collected.append(v)
                new += 1
        if new:
            print(f"    [{label}]: +{new}")
        return new

    # ── Priorità 1: Case Editrici ─────────────────────────────────────────
    for label, source in by_priority[1]:
        if len(collected) >= target:
            break
        if yt and source.get("channel_id"):
            res = _yt_search_api(yt, topic, source["channel_id"], max_results=4)
        else:
            res = _channel_search_web(topic, source, max_results=4)
        _add_results(res, label)
        time.sleep(1)

    # Prova anche query generica per editrici
    if len(collected) < 4:
        res = _yt_search_web(f"{topic} Zanichelli OR Mondadori OR Lattes scuola media", 4)
        _add_results(res, "Case Editrici (generica)")
        time.sleep(1)

    # ── Priorità 2: Geopop ────────────────────────────────────────────────
    if len(collected) < target:
        for label, source in by_priority[2]:
            res = _channel_search_web(topic, source, max_results=3)
            _add_results(res, label)
            time.sleep(1)

    # ── Priorità 3: Insegnanti di Tecnologia ─────────────────────────────
    for label, source in by_priority[3]:
        if len(collected) >= target:
            break
        if yt and source.get("channel_id"):
            res = _yt_search_api(yt, topic, source["channel_id"], max_results=3)
        else:
            res = _channel_search_web(topic, source, max_results=3)
        _add_results(res, label)
        time.sleep(1)

    # ── Priorità 4: Aziende e Consorzi ───────────────────────────────────
    if len(collected) < target:
        companies = AREA_COMPANIES.get(area, [])[:2]
        for company in companies:
            if len(collected) >= target:
                break
            res = _yt_search_web(f"{topic} {company}", max_results=3)
            _add_results(res, f"Aziende ({company.split()[0]})")
            time.sleep(1)

    # ── Priorità 5: Fallback generale ────────────────────────────────────
    if len(collected) < target:
        res = _yt_search_web(f"{topic} scuola media tecnologia", max_results=6)
        _add_results(res, "Generale")

    return collected


# ── PIPELINE MC ───────────────────────────────────────────────────────────────

def process_mc(mc_id: str, backend: str = "search",
               api_key: str = "", dry_run: bool = False,
               overwrite: bool = False) -> dict:
    print(f"\n{'─'*52}")
    print(f"🎬  {mc_id}")

    out_path = OUTPUT_DIR / f"{mc_id}.json"
    if out_path.exists() and not overwrite:
        n = len(json.loads(out_path.read_text()).get("videos", []))
        print(f"  ⏭️  già presente ({n} video)")
        return {"mc_id": mc_id, "status": "skipped"}

    try:
        mc = load_mc(mc_id)
    except FileNotFoundError as e:
        print(f"  ❌ {e}")
        return {"mc_id": mc_id, "status": "error"}

    topic = build_topic(mc)

    if dry_run:
        print(f"  🔍 Topic: {topic}")
        print(f"  Fonti in ordine: {[s[1] for s in PRIORITY_CHANNELS[:6]]}...")
        return {"mc_id": mc_id, "status": "dry_run"}

    print(f"  🔍 {topic}")
    videos = collect_videos(mc, backend=backend, api_key=api_key)

    if not videos:
        print(f"  ⚠️  Nessun video trovato")
        return {"mc_id": mc_id, "status": "empty"}

    # Salva JSON (rimuovi campi interni)
    clean = [{k: v for k, v in vid.items() if not k.startswith("_")} for vid in videos]
    fonti = list(dict.fromkeys(v.get("_source_label", "") for v in videos))

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    data = {
        "mc_id":  mc_id,
        "titolo": mc.get("titolo", ""),
        "topic":  topic,
        "fonti":  fonti,
        "videos": clean,
    }
    out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  ✅ {len(clean)} video | fonti: {', '.join(fonti[:4])}")
    return {"mc_id": mc_id, "status": "ok", "n": len(clean)}


# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(
        description="Ricerca video YouTube prioritizzati per MC",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Priorità fonti:
  1. Mondadori Education · Rizzoli Education · Zanichelli · Lattes Editori
  2. Geopop
  3. Prof. Falanga · Fabio Macchia · ProduttivaMENTE · HLMod Tech
     Il Prof. di Tecnologia · Annibale Pinotti · Il Technologico
     Educazione Tecnica Online · Michela Massei
     Marco Torella · Zoomiamo il Mondo · Pelli Prof Tecnologia
  4. Aziende e Consorzi (Enel, ENI, Comieco, Corepla...)
  5. Generale (fallback)
"""
    )
    ap.add_argument("--mc")
    ap.add_argument("--area")
    ap.add_argument("--all",       action="store_true")
    ap.add_argument("--dry-run",   action="store_true")
    ap.add_argument("--overwrite", action="store_true")
    ap.add_argument("--backend",   default="search", choices=["youtube", "search"])
    args = ap.parse_args()

    if not (args.mc or args.area or args.all):
        ap.print_help(); sys.exit(1)

    api_key = os.environ.get("YOUTUBE_API_KEY", "")
    if args.backend == "youtube" and not api_key:
        print("⚠️  YOUTUBE_API_KEY non trovata — passo a 'search'")
        args.backend = "search"

    if args.mc:
        mc_ids = [args.mc]
    elif args.area:
        mc_ids = load_mc_ids_by_area(args.area)
        print(f"📋  {len(mc_ids)} MC per area {args.area.upper()}")
    else:
        mc_ids = load_all_mc_ids()
        print(f"📋  {len(mc_ids)} MC totali")

    if not args.overwrite:
        existing = {p.stem for p in OUTPUT_DIR.glob("*.json")}
        pending  = [m for m in mc_ids if m not in existing]
        if len(pending) < len(mc_ids):
            print(f"⏭️  {len(mc_ids)-len(pending)} già presenti — elaboro {len(pending)} rimanenti")
        mc_ids = pending if not args.overwrite else mc_ids

    if not mc_ids:
        print("✅ Tutti i video già presenti. Usa --overwrite per rigenerare.")
        return

    results = []
    for i, mc_id in enumerate(mc_ids, 1):
        print(f"\n[{i}/{len(mc_ids)}]", end="")
        r = process_mc(mc_id, backend=args.backend, api_key=api_key,
                       dry_run=args.dry_run, overwrite=args.overwrite)
        results.append(r)
        if not args.dry_run and i < len(mc_ids):
            time.sleep(3)

    print(f"\n{'='*52}")
    ok = sum(1 for r in results if r.get("status") == "ok")
    print(f"✅ Completati: {ok}/{len(results)}")
    if ok:
        print(f"\nPer aggiornare il sito:")
        print(f"  cd 05_APP/tecnologia-sito-web && git add data/videos/ && git commit -m 'feat: video gallery' && git push")


if __name__ == "__main__":
    main()
