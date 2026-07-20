#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generatore di prompt slide deck NotebookLM per TecnologIA — v1.

Per ogni MC della matrice produce un file prompt pronto da incollare in
NotebookLM (Studio → Slide deck → ✏️ personalizza) per generare una
presentazione ~12 slide con immagini FOTOREALISTICHE coerenti con la
palette e il vocabolario visivo dell'area.

Differenze rispetto ai visual brief ESPLORA:
- Le immagini richieste sono fotografiche/editoriali, NON illustrazione flat.
  La coerenza col design system è garantita da palette area (accenti, chip),
  etichette italiane brevi e struttura didattica del libro
  (hook → concetto → esempio → applicazione).
- Il prompt è in italiano (contenuto/struttura) + blocco VISUAL STYLE in
  inglese (i modelli image-gen rispondono meglio all'inglese descrittivo).

Input:  01_MATRICE_MC/classe_{1,2,3}/{AREA}/MC-{AREA}-{N}-{NN}.json
        08_TESTI/classe_{1,2,3}/{AREA}/MC-{AREA}-{N}-{NN}_completa.md
Output: 04_CONTENUTI/presentazioni/MC-{AREA}-{N}-{NN}_slide_prompt.md  (+ _INDEX.md)
"""

from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MATRICE = ROOT / "01_MATRICE_MC"
TESTI = ROOT / "08_TESTI"
OUT = Path(__file__).resolve().parent

# ────────────────────────────────────────────────────────────────────
# 1. VOCABOLARIO VISIVO PER AREA (allineato a visual_esplora/AREA_META,
#    riformulato in chiave fotografica)
# ────────────────────────────────────────────────────────────────────

AREA_META: dict[str, dict] = {
    "MAT": {
        "label": "🪨 Materiali e Rifiuti",
        "color_primary": "#6D4C41",
        "color_bg": "#EFEBE9",
        "photo_world": (
            "raw material samples (mineral chunks, natural fiber coils, wooden planks, "
            "metal ingots, plastic pellets), recycling bins and sorting facilities, "
            "workshop benches with sorted material trays"
        ),
        "photo_people": "middle-school students examining material samples, factory and recycling-plant workers",
    },
    "DIS": {
        "label": "📐 Disegno Tecnico",
        "color_primary": "#1565C0",
        "color_bg": "#E3F2FD",
        "photo_world": (
            "drafting tables with set squares, compasses and graph paper, hands drawing "
            "precise lines, geometric solids and orthographic-view sketches, CAD screens"
        ),
        "photo_people": "students drawing at a drafting table, a designer reviewing technical drawings",
    },
    "DIG": {
        "label": "💻 Digitale / Coding / AI",
        "color_primary": "#006064",
        "color_bg": "#E0F7FA",
        "photo_world": (
            "micro:bit boards with glowing LED matrices, Arduino boards and breadboards with "
            "jumper wires, small wheeled robots, laptops showing block code, classroom makerspaces"
        ),
        "photo_people": "middle-school students coding together at a makerspace bench, a mentor pointing at a screen",
    },
    "ALI": {
        "label": "🌾 Alimentazione",
        "color_primary": "#558B2F",
        "color_bg": "#F1F8E9",
        "photo_world": (
            "fresh vegetables on wooden cutting boards, food labels being read in a supermarket, "
            "school canteen trays, cold-chain trucks and fridges, wheat fields and food factories"
        ),
        "photo_people": "a young person reading a nutritional label, farmers and food technologists at work",
    },
    "AMB": {
        "label": "🏗️ Abitazione · Città · Territorio",
        "color_primary": "#00695C",
        "color_bg": "#E0F2F1",
        "photo_world": (
            "house construction sites and wall insulation layers, green roofs with vegetation, "
            "solar panels on tilted roofs, neighborhood streets with low buildings and trees, "
            "architectural scale models"
        ),
        "photo_people": "an architect with a scale model, construction workers, students on an urban field trip",
    },
    "ENE": {
        "label": "⚡ Energia e Macchine",
        "color_primary": "#E65100",
        "color_bg": "#FFF3E0",
        "photo_world": (
            "levers, pulleys and meshing gears on workshop benches, photovoltaic panels and "
            "wind turbines, battery cells, power lines at sunset, engine rooms"
        ),
        "photo_people": "an engineer in a hard hat inspecting machinery, students experimenting with simple machines",
    },
    "COM": {
        "label": "📡 Comunicazioni e Trasporti",
        "color_primary": "#283593",
        "color_bg": "#E8EAF6",
        "photo_world": (
            "satellite dishes and radio towers, glowing fibre-optic cables, smartphones in use, "
            "high-speed trains, cargo container ships and ports, city skylines at dusk with "
            "transport corridors lit up"
        ),
        "photo_people": "a network technician at a console, travellers and logistics workers",
    },
    "SIS": {
        "label": "⚙️ Sistemi · Economia · Lavoro",
        "color_primary": "#4527A0",
        "color_bg": "#EDE7F6",
        "photo_world": (
            "factories, delivery trucks, shops and homes as a supply chain, world maps with "
            "trade routes, modern offices with sticky-note walls, market stalls, coins and charts"
        ),
        "photo_people": "an entrepreneur with a tablet, workers across the three economic sectors",
    },
    "INF": {
        "label": "🖥️ Informatica",
        "color_primary": "#0277BD",
        "color_bg": "#E1F5FE",
        "photo_world": (
            "school computer labs, code editors and folder hierarchies on screens, server racks "
            "with blinking lights, close-ups of keyboards and cables"
        ),
        "photo_people": "a student typing at a school laptop, an IT technician in a server room",
    },
}

ORDINALI = {1: "1ª", 2: "2ª", 3: "3ª"}

# ────────────────────────────────────────────────────────────────────
# 2. PARSING DEL TESTO _completa.md
# ────────────────────────────────────────────────────────────────────

EMOJI_RE = re.compile(
    "[\U0001F000-\U0001FAFF☀-➿⬀-⯿️‍●]+"
)


def clean_title(s: str) -> str:
    s = EMOJI_RE.sub("", s).strip()
    s = re.sub(r"\s{2,}", " ", s)
    return s.rstrip(".").strip()


# H4 "callout" da NON trasformare in slide (sono approfondimenti a margine)
H4_SKIP = re.compile(
    r"collegamento\s+stem|lo sapevi|errore comune|geo-storia|attenzione|curiosit", re.I
)

# ── Estrazione callout dai body di sezione ───────────────────────────
BOLD_RE = re.compile(r"\*\*([^*\n]{3,36}?)\*\*")
NUM_RE = re.compile(
    r"\b\d[\d.,]*\s?(?:%|km|kg|kWh|kilowattora|litri|°C|anni|metri|tonnellate|miliardi|milioni)\b"
)
CALLOUT_STOP = {
    "esempio", "attenzione", "nota", "importante", "ricorda", "in sintesi",
    "domanda", "risposta", "vediamole", "adesso", "quindi", "infine",
}
CALLOUT_BAD_START = re.compile(
    r"^(?:il|lo|la|i|gli|le|un|una|uno|di|da|in|con|su|per|tra|fra|è|e|che|se|non|come|quando)\s",
    re.I,
)


def extract_callouts(body: str, max_n: int = 3) -> list[str]:
    """Termini in grassetto + dati numerici reali della sezione → callout suggeriti."""
    seen, out = set(), []

    def push(term: str) -> None:
        term = EMOJI_RE.sub("", term).strip().strip(".,;:()«»\"'").strip()
        key = term.lower()
        if re.match(r"geo-storia|collegamento|lo sapevi|errore comune|in english", key):
            return
        if (
            len(term) >= 3
            and key not in seen
            and key not in CALLOUT_STOP
            and not CALLOUT_BAD_START.match(term)
            and not term.startswith(("#", "!", "["))
        ):
            seen.add(key)
            out.append(term)

    for m in BOLD_RE.finditer(body):
        push(m.group(1))
        if len(out) >= max_n:
            return out
    for m in NUM_RE.finditer(body):
        push(m.group(0))
        if len(out) >= max_n:
            break
    return out


def parse_completa(md_path: Path) -> dict:
    """Struttura della SOLA zona ESPLORA: H3 (+H4 figli), ciascuno col proprio body."""
    out = {"esplora": []}  # [{"title", "body", "children": [{"title", "body"}]}]
    if not md_path.exists():
        return out
    text = md_path.read_text(encoding="utf-8")
    zone, current, child = None, None, None
    for line in text.splitlines():
        if line.startswith("## "):
            zone = "esplora" if "ESPLORA" in line[3:].upper() else None
            current, child = None, None
            continue
        if zone != "esplora":
            continue
        if line.startswith("### "):
            title = clean_title(line[4:])
            child = None
            if title:
                current = {"title": title, "body": [], "children": []}
                out["esplora"].append(current)
        elif line.startswith("#### ") and current is not None:
            title = clean_title(line[5:])
            if title and not H4_SKIP.search(title):
                child = {"title": title, "body": []}
                current["children"].append(child)
            else:
                child = None  # il body dei callout-H4 non va nei suggerimenti
        elif current is not None:
            if line.lstrip().startswith(">"):
                continue  # i blockquote sono note a margine: fuori dai callout
            (child["body"] if child is not None else current["body"]).append(line)
    # join dei body
    for sec in out["esplora"]:
        sec["body"] = "\n".join(sec["body"])
        for ch in sec["children"]:
            ch["body"] = "\n".join(ch["body"])
    return out


def truncate_sentence(s: str, max_len: int = 300) -> str:
    s = " ".join(s.split())
    if len(s) <= max_len:
        return s
    cut = s[:max_len]
    for sep in (". ", "; ", ": "):
        pos = cut.rfind(sep)
        if pos > max_len // 2:
            return cut[: pos + 1].strip()
    return cut.rsplit(" ", 1)[0].strip() + "…"


# ────────────────────────────────────────────────────────────────────
# 3. COSTRUZIONE DEL PROMPT
# ────────────────────────────────────────────────────────────────────


def build_prompt(mc: dict, sections: dict) -> str:
    area = mc["area"]
    meta = AREA_META[area]
    anno = ORDINALI.get(mc.get("anno", 1), "1ª")

    esplora = sections["esplora"][:6]
    if not esplora:
        esplora = [{"title": mc.get("titolo", "Concetti chiave"), "body": "", "children": []}]

    # ── struttura slide: SOLO contenuti della zona ESPLORA ──────────────
    # 1 slide per H3; il primo H3 con ≥3 H4 figli viene espanso: intro + 1 slide per H4.
    def slide_line(n: int, title: str, body: str, intro: bool = False) -> str:
        role = (
            "slide introduttiva: quadro d'insieme"
            if intro
            else "un solo concetto, UN esempio concreto"
        )
        callouts = extract_callouts(body)
        suffix = f" · callout suggeriti: {' / '.join(callouts)}" if callouts else ""
        return f"{n}. «{title}» — {role}{suffix}"

    lines = []
    n = 2  # la 1 è la copertina
    expanded_done = False
    for sec in esplora:
        children = sec["children"][:8]
        if not expanded_done and len(children) >= 3:
            lines.append(slide_line(n, sec["title"], sec["body"], intro=True))
            n += 1
            for child in children:
                lines.append(slide_line(n, child["title"], child["body"]))
                n += 1
            expanded_done = True
        else:
            lines.append(slide_line(n, sec["title"], sec["body"]))
            n += 1
    lines.append(
        f"{n}. SINTESI — 3 box \"da ricordare\" (solo contenuti ESPLORA) + una domanda aperta finale"
    )
    slide_lines = "\n".join(lines)
    tot = n  # totale slide inclusa copertina e sintesi

    primo_concetto = esplora[0]["title"]

    prompt = f"""Crea una presentazione didattica in ITALIANO per studenti di scuola secondaria di primo grado (11-14 anni), classe {anno}, sulla micro-competenza «{mc['titolo']}» ({mc['id']}).

FONTE (vincolo rigido)
- Usa ESCLUSIVAMENTE i contenuti della zona «ESPLORA» (sezione "📖 ESPLORA") del testo della MC {mc['id']}.
- IGNORA tutte le altre zone del testo (INNESCA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA, APPENDICE/Tech in English) e ogni altra fonte del notebook.
- Non aggiungere contenuti che non siano presenti in ESPLORA.

PUBBLICO E TONO
- Rivolgiti allo studente con il "tu". Linguaggio diretto e concreto, zero tono enciclopedico.
- Ogni concetto va ancorato a un oggetto o a un'esperienza quotidiana dello studente.
- Sequenza per ogni slide: concetto → esempio concreto.

STRUTTURA ({tot} slide)
1. COPERTINA — titolo breve e d'impatto della MC + sottotitolo di una frase che anticipa «{primo_concetto}»; render fotorealistico del soggetto, senza testo dentro l'immagine
{slide_lines}

LAYOUT DI OGNI SLIDE
1. Titolo forte in alto o in un box laterale (max 6 parole).
2. Sottotitolo esplicativo breve.
3. Immagine/render principale a pieno schermo.
4. 2-4 callout collegati alle parti dell'immagine (parti dai "callout suggeriti" della slide).
5. Frecce o linee tecniche ciano/arancio.
6. Una frase chiave finale o "risultato" (max 15 parole).
- Una sola idea per slide; tutto il testo in italiano.
- Nei callout/HUD usa i numeri e i dati REALI presenti in ESPLORA (percentuali, km, kWh, litri…): mai inventarli.

STILE VISIVO — infografica tecnico-fotorealistica (16:9)
- Grande render realistico del materiale/oggetto come elemento centrale, texture molto dettagliate, luce naturale morbida. NO cartoon, NO flat illustration.
- Soggetti dell'area: {meta['photo_world']}.
- Persone (quando presenti): {meta['photo_people']}; contesto scolastico italiano, studenti 11-14 anni.
- Box testuali semi-trasparenti effetto vetro satinato, angoli arrotondati, ombre leggere, testo sans serif moderno in grigio scuro.
- Frecce, linee di quota, callout tecnici, cornici sottili e piccoli elementi HUD in ciano e arancione.
- Palette: tonalità naturali del soggetto, crema, grigio chiaro, ciano tecnico e ambra; accento d'area {meta['color_primary']} per titoli e chip.
- Composizione pulita ma ricca; color grading coerente su tutto il deck: le slide devono sembrare un unico prodotto editoriale.
- Nessuna frase lunga renderizzata dentro l'immagine; eventuali etichette in-image in italiano, max 3 parole. MAI testo in inglese dentro le immagini."""
    return prompt


# ────────────────────────────────────────────────────────────────────
# 4. RENDER DEL FILE PER MC
# ────────────────────────────────────────────────────────────────────


def render_file(mc: dict, sections: dict, testo_rel: str) -> str:
    meta = AREA_META[mc["area"]]
    anno = ORDINALI.get(mc.get("anno", 1), "1ª")
    prompt = build_prompt(mc, sections)
    deck_name = f"{mc['id']}_deck.pptx"

    return f"""# Prompt slide deck NotebookLM — {mc['id']}

**MC:** {mc['titolo']}
**Area:** {meta['label']} · Classe {anno} · Palette {meta['color_primary']} / {meta['color_bg']}
**Fonte da caricare nel notebook:** `{testo_rel}`
**Output:** deck fotorealistico · scaricare come **{deck_name}** in `04_CONTENUTI/presentazioni/`

---

## Come usarlo (web UI)

1. Apri/crea il notebook della MC e carica la fonte indicata sopra.
2. Studio → **Slide deck** → ✏️ (personalizza) → incolla il prompt qui sotto → Genera.
3. Scarica in PPTX/PDF e salva con il nome file indicato sopra.

## Prompt

```text
{prompt}
```

## Generazione via CLI (alternativa)

```bash
notebooklm create "TecnologIA — {mc['id']}"
notebooklm source add "{testo_rel}"
notebooklm generate slide-deck "$(sed -n '/^```text$/,/^```$/p' {mc['id']}_slide_prompt.md | sed '1d;$d')" --format detailed --language it
notebooklm artifact list   # attendi status=completed
notebooklm download slide-deck ./{deck_name} --format pptx
```

---

*Generato da `_generate_slide_prompts.py` · {date.today().isoformat()} · stile: fotorealistico + palette area (vedi `07_GUIDE/operative/PROMPT_PATTERNS_visual_ESPLORA.md` per il razionale palette/etichette)*
"""


# ────────────────────────────────────────────────────────────────────
# 5. MAIN
# ────────────────────────────────────────────────────────────────────


def main() -> int:
    mc_files = sorted(MATRICE.glob("classe_*/*/MC-*.json"))
    if not mc_files:
        print("ERRORE: nessun JSON MC trovato in", MATRICE)
        return 1

    rows = []
    warnings = []
    for jf in mc_files:
        mc = json.loads(jf.read_text(encoding="utf-8"))
        mc_id = mc["id"]
        area, anno = mc["area"], mc.get("anno", 1)
        testo = TESTI / f"classe_{anno}" / area / f"{mc_id}_completa.md"
        testo_rel = testo.relative_to(ROOT).as_posix()
        sections = parse_completa(testo)
        if not testo.exists():
            warnings.append(f"{mc_id}: testo _completa.md mancante ({testo_rel})")
        if not sections["esplora"]:
            warnings.append(f"{mc_id}: nessuna sezione H3 ESPLORA trovata — struttura generica")
        out_file = OUT / f"{mc_id}_slide_prompt.md"
        out_file.write_text(render_file(mc, sections, testo_rel), encoding="utf-8")
        rows.append((mc_id, mc["titolo"], area, anno, len(sections["esplora"])))

    # _INDEX.md
    lines = [
        "# Indice prompt slide deck NotebookLM",
        "",
        f"Generato: {date.today().isoformat()} · {len(rows)} MC · da `_generate_slide_prompts.py`",
        "",
        "Ogni file contiene un prompt pronto da incollare in NotebookLM "
        "(Studio → Slide deck → ✏️ personalizza) per generare un deck basato "
        "ESCLUSIVAMENTE sulla zona ESPLORA della MC, con immagini fotorealistiche "
        "coerenti con la palette dell'area.",
        "",
        "## Flusso operativo",
        "",
        "1. Crea un notebook NotebookLM per la MC (o riusa quello dell'area).",
        "2. Carica come fonte il testo `08_TESTI/.../MC-XXX-Y-NN_completa.md` indicato nel file prompt.",
        "3. Studio → Slide deck → ✏️ → incolla il prompt → Genera.",
        "4. Scarica il deck (PPTX consigliato: testo editabile) e salvalo come "
        "`MC-XXX-Y-NN_deck.pptx` in questa cartella.",
        "",
        "In alternativa usa la CLI `notebooklm` (comandi pronti in coda a ogni file prompt).",
        "",
        "## Convenzioni di stile",
        "",
        "- Immagini: fotografia editoriale fotorealistica (NO flat illustration — scelta deliberata, "
        "diversa dalle immagini ESPLORA del libro).",
        "- Coerenza col design system: palette area per accenti/chip, etichette italiane ≤3 parole, "
        "sfondo chiaro, contrasto WCAG AA.",
        "- Contenuti: SOLO zona ESPLORA (vincolo rigido nel prompt). Struttura: COPERTINA → "
        "1 slide per sezione H3 di ESPLORA (il primo H3 con ≥3 sotto-sezioni H4 viene espanso: "
        "intro + 1 slide per H4) → SINTESI.",
        "",
        "| MC | Titolo | Area | Classe | Slide ESPLORA | Prompt |",
        "|----|--------|------|--------|---------------|--------|",
    ]
    for mc_id, titolo, area, anno, n_esp in rows:
        lines.append(
            f"| {mc_id} | {titolo} | {AREA_META[area]['label']} | {ORDINALI[anno]} | {n_esp} | "
            f"[{mc_id}_slide_prompt.md]({mc_id}_slide_prompt.md) |"
        )
    if warnings:
        lines += ["", "## ⚠️ Avvisi", ""] + [f"- {w}" for w in warnings]
    (OUT / "_INDEX.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"OK: {len(rows)} prompt generati in {OUT}")
    for w in warnings:
        print("AVVISO:", w)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
