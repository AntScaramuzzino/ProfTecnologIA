"""
Agente Artefice — Generatore audio hook podcast con edge-tts
Completamente gratuito, senza API key, senza limiti di caratteri.

Uso:
    python generate_audio.py --mc MC-MAT-1-02        # singola MC
    python generate_audio.py --area MAT               # un'area
    python generate_audio.py --all                    # tutte le 52 MC
    python generate_audio.py --all --voice it-IT-IsabellaNeural

Voci italiane disponibili:
    it-IT-ElsaNeural      — femminile, chiara, educativa (default)
    it-IT-IsabellaNeural  — femminile, espressiva
    it-IT-DiegoNeural     — maschile

Pre-requisiti:
    pip install edge-tts --break-system-packages

Output:
    04_CONTENUTI/microlearning/hook/[MC-ID]_hook-audio.mp3
"""

import argparse
import asyncio
import json
import re
import sys
from pathlib import Path

try:
    import edge_tts
    HAS_EDGE_TTS = True
except ImportError:
    HAS_EDGE_TTS = False

# ── PATH ──────────────────────────────────────────────────────────────────────

SCRIPT_DIR   = Path(__file__).parent
PROJECT_ROOT = (SCRIPT_DIR / "../../").resolve()
MC_ROOT      = PROJECT_ROOT / "01_MATRICE_MC"
HOOK_DIR     = PROJECT_ROOT / "04_CONTENUTI/microlearning/hook"
OUTPUT_DIR   = PROJECT_ROOT / "04_CONTENUTI/microlearning/hook"

DEFAULT_VOICE = "it-IT-ElsaNeural"

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

# ── ESTRAZIONE TESTO PER TTS ──────────────────────────────────────────────────

# Righe da saltare nello script (metadati, header, marcatori)
_SKIP_PATTERNS = re.compile(
    r"^(#|\*\*\[BLOCCO|---|\*\*Titolo:|"
    r"\*\*MC:|\*\*Classe:|\*\*Durata|\*\*Oggetto|\*\*SDG|## SCRIPT|"
    r">\s*🎧|\*\*\[NOTA|\*Script completo)",
    re.IGNORECASE
)

def _clean_script_line(line: str) -> str:
    """Pulisce una riga di script per il TTS."""
    line = line.strip()
    if not line or _SKIP_PATTERNS.match(line):
        return ""
    # Rimuovi markdown bold/italic
    line = re.sub(r"\*{1,2}", "", line)
    # [PAUSA] → pausa naturale con virgola o punto
    line = re.sub(r"\[PAUSA\]", ",", line)
    # [ENFASI] → rimuovi marcatore
    line = re.sub(r"\[ENFASI\]", "", line)
    # Rimuovi > blockquote
    line = re.sub(r"^\s*>\s*", "", line)
    # Rimuovi link markdown
    line = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", line)
    # Rimuovi parentesi editoriali es. (max 15 sec)
    line = re.sub(r"\(\s*(max|min|sec|durata)[^)]*\)", "", line, flags=re.IGNORECASE)
    return line.strip()


def extract_script_from_file(hook_script_path: Path) -> str:
    """Estrae il testo parlato da un file hook-script.md."""
    raw = hook_script_path.read_text(encoding="utf-8")

    # Prendi solo la sezione ## SCRIPT in poi
    script_match = re.search(r"## SCRIPT\s*\n(.*)", raw, re.DOTALL)
    content = script_match.group(1) if script_match else raw

    lines = []
    for line in content.split("\n"):
        cleaned = _clean_script_line(line)
        if cleaned:
            lines.append(cleaned)

    # Unisci le righe: riga vuota → pausa (nuova frase)
    text = " ".join(lines)
    # Normalizza spazi multipli e virgole consecutive
    text = re.sub(r",{2,}", ",", text)
    text = re.sub(r"\s{2,}", " ", text)
    text = re.sub(r",\s*\.", ".", text)
    return text.strip()


def build_text_from_json(mc: dict) -> str:
    """
    Per MC senza hook-script.md, costruisce un testo TTS dai campi JSON.
    Struttura: domanda apertura → descrizione competenza → compito realtà → chiusura.
    """
    hook = mc.get("hook_audio", {}) or mc.get("hook", {})
    titolo = mc.get("titolo", "questa competenza")
    domanda = hook.get("domanda_avvio", "") or hook.get("domanda", "")
    descrizione = mc.get("descrizione", "")
    compito = mc.get("compito_realta", "")
    oggetto = hook.get("oggetto_reale", "")

    parts = []

    # Apertura con domanda
    if domanda:
        parts.append(domanda)

    # Breve aggancio all'oggetto reale
    if oggetto:
        parts.append(f"Pensa a {oggetto}. C'è molto più di quello che vedi.")

    # Descrizione della competenza (semplificata)
    if descrizione:
        # Prendi le prime due frasi
        frasi = [f.strip() for f in descrizione.split(".") if len(f.strip()) > 20]
        if frasi:
            parts.append(". ".join(frasi[:2]) + ".")

    # Invito al compito di realtà
    if compito:
        prima_frase = compito.split(".")[0].strip()
        if len(prima_frase) > 20:
            parts.append(f"Oggi ti chiediamo di fare una cosa concreta: {prima_frase.lower()}.")

    # Chiusura standard
    parts.append(
        f"Sei pronto? Apri il libro alla sezione {titolo.lower()} e inizia da lì."
    )

    return " ".join(parts)


def get_tts_text(mc_id: str, mc: dict) -> tuple[str, str]:
    """
    Restituisce (testo_tts, fonte) dove fonte è 'script' o 'json'.
    """
    script_path = HOOK_DIR / f"{mc_id}_hook-script.md"
    if script_path.exists():
        return extract_script_from_file(script_path), "script"
    return build_text_from_json(mc), "json"


# ── GENERAZIONE AUDIO ─────────────────────────────────────────────────────────

async def generate_audio_async(text: str, voice: str, output_path: Path) -> bool:
    """Genera il file MP3 via edge-tts."""
    try:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(str(output_path))
        return True
    except Exception as e:
        print(f"  ❌ edge-tts error: {e}")
        return False


def process_mc(mc_id: str, voice: str, dry_run: bool = False,
               overwrite: bool = False) -> dict:
    print(f"\n{'─'*52}")
    print(f"🎙️  {mc_id}")

    # Controlla se già esiste
    out_path = OUTPUT_DIR / f"{mc_id}_hook-audio.mp3"
    if out_path.exists() and not overwrite:
        print(f"  ⏭️  già presente — usa --overwrite per rigenerare")
        return {"mc_id": mc_id, "status": "skipped", "path": str(out_path)}

    try:
        mc = load_mc(mc_id)
    except FileNotFoundError as e:
        print(f"  ❌ {e}")
        return {"mc_id": mc_id, "status": "error", "error": str(e)}

    text, fonte = get_tts_text(mc_id, mc)

    words = len(text.split())
    print(f"  📄 Fonte: {fonte} · {words} parole · ~{words // 130 + 1} min")

    if dry_run:
        print(f"  💬 Testo: {text[:200]}…")
        return {"mc_id": mc_id, "status": "dry_run", "words": words}

    # Genera
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"  ⏳ Generazione con {voice}…")
    success = asyncio.run(generate_audio_async(text, voice, out_path))

    if success:
        size_kb = out_path.stat().st_size // 1024
        print(f"  ✅ {out_path.name} ({size_kb} KB)")
        return {"mc_id": mc_id, "status": "ok", "path": str(out_path),
                "size_kb": size_kb, "fonte": fonte}
    return {"mc_id": mc_id, "status": "error"}


# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(
        description="Generatore audio hook podcast con edge-tts (gratuito)"
    )
    ap.add_argument("--mc",        help="ID MC singola")
    ap.add_argument("--area",      help="Genera per un'area (es. MAT)")
    ap.add_argument("--all",       action="store_true", help="Tutte le MC")
    ap.add_argument("--voice",     default=DEFAULT_VOICE,
                    help=f"Voce edge-tts (default: {DEFAULT_VOICE})")
    ap.add_argument("--dry-run",   action="store_true",
                    help="Mostra testo senza generare")
    ap.add_argument("--overwrite", action="store_true",
                    help="Rigenera anche se MP3 già esiste")
    ap.add_argument("--list-voices", action="store_true",
                    help="Elenca voci italiane disponibili")
    args = ap.parse_args()

    if args.list_voices:
        print("Voci italiane edge-tts:")
        print("  it-IT-ElsaNeural      — femminile, chiara")
        print("  it-IT-IsabellaNeural  — femminile, espressiva")
        print("  it-IT-DiegoNeural     — maschile, neutro")
        return

    if not HAS_EDGE_TTS and not args.dry_run:
        print("❌ edge-tts non installato:")
        print("   pip install edge-tts --break-system-packages")
        sys.exit(1)

    if not (args.mc or args.area or args.all):
        ap.print_help(); sys.exit(1)

    if args.mc:
        mc_ids = [args.mc]
    elif args.area:
        mc_ids = load_mc_ids_by_area(args.area)
        print(f"📋  {len(mc_ids)} MC per area {args.area.upper()}")
    else:
        mc_ids = load_all_mc_ids()
        print(f"📋  {len(mc_ids)} MC totali")

    # Stima tempo
    if not args.dry_run:
        print(f"🎙️  Voce: {args.voice}")
        print(f"⏱️  Tempo stimato: ~{len(mc_ids) * 20 // 60 + 1} min")
        print(f"📁  Output: {OUTPUT_DIR.relative_to(PROJECT_ROOT)}")

    results = []
    for i, mc_id in enumerate(mc_ids, 1):
        print(f"\n[{i}/{len(mc_ids)}]", end="")
        r = process_mc(mc_id, args.voice, dry_run=args.dry_run,
                       overwrite=args.overwrite)
        results.append(r)

    # Riepilogo
    print(f"\n{'='*52}")
    ok      = sum(1 for r in results if r.get("status") == "ok")
    skipped = sum(1 for r in results if r.get("status") == "skipped")
    errors  = sum(1 for r in results if r.get("status") == "error")
    print(f"✅ Generati  : {ok}")
    if skipped: print(f"⏭️  Saltati   : {skipped}  (già esistenti)")
    if errors:  print(f"❌ Errori    : {errors}")

    total_kb = sum(r.get("size_kb", 0) for r in results)
    if total_kb:
        print(f"💾 Totale    : {total_kb // 1024} MB")


if __name__ == "__main__":
    main()
