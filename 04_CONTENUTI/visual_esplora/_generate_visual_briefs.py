#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generatore di visual brief ESPLORA per TecnologIA — v2.

Differenze rispetto alla v1:
- Sceglie la tipologia immagine in base a pattern semantici del titolo/contenuto, non a una rotazione.
- Estrae etichette curate dalla struttura H4 + grassetti significativi (filtri anti-garbage).
- Per ogni tipologia genera un prompt descrittivo di scena, NON un template astratto.
- Non mette mai il titolo italiano lungo dentro l'immagine come testo da renderizzare.
- Inietta oggetti/scenari specifici dell'area (sensori, leve, fabbriche, ecc.).

Input:  08_TESTI/classe_{1,2,3}/{AREA}/MC-{AREA}-{N}-{NN}_completa.md
Output: 04_CONTENUTI/visual_esplora/MC-{AREA}-{N}-{NN}_visual_brief.md  (+ _INDEX.md)
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path
from typing import Optional

# ────────────────────────────────────────────────────────────────────
# 1. CONFIGURAZIONE AREE
# ────────────────────────────────────────────────────────────────────

AREA_META: dict[str, dict] = {
    "MAT": {
        "label": "🪨 Materiali e Rifiuti",
        "anni": [1],
        "color_primary": "#6D4C41",
        "color_bg": "#EFEBE9",
        "scene_objects": (
            "rough mineral chunks, a coil of natural fiber, a wooden plank, "
            "a small metal ingot, a stack of plastic pellets, a green recycling triangle symbol"
        ),
        "scene_characters": "a young student inspector with a magnifying glass examining materials",
        "scene_setting": "a clean workshop bench with sorted material samples in shallow trays",
        "stem_link": "chemistry of materials, density and hardness, environmental sciences",
    },
    "DIS": {
        "label": "📐 Disegno Tecnico",
        "anni": [1, 2, 3],
        "color_primary": "#1565C0",
        "color_bg": "#E3F2FD",
        "scene_objects": (
            "a 30-60-90 set square, a compass, a sharpened pencil, a sheet of A4 graph paper, "
            "a simple geometric solid (cube or cylinder) shown both as 3D isometric and as three "
            "orthographic views (top, front, side)"
        ),
        "scene_characters": "two hands holding a ruler and pencil over the drawing",
        "scene_setting": "a tidy drafting table with a pale grid paper sheet",
        "stem_link": "geometry, spatial reasoning, technical communication",
    },
    "DIG": {
        "label": "💻 Digitale / Coding / AI",
        "anni": [1, 2, 3],
        "color_primary": "#006064",
        "color_bg": "#E0F7FA",
        "scene_objects": (
            "a micro:bit board with its 5×5 LED matrix glowing, an Arduino Uno, a small breadboard "
            "with jumper wires, an HC-SR04 ultrasonic sensor, a tiny robot chassis with two wheels, "
            "a laptop showing colored block-code"
        ),
        "scene_characters": "a middle-school student in casual clothes pointing at the laptop screen",
        "scene_setting": "a classroom makerspace bench with components neatly arranged",
        "stem_link": "computational thinking, electronics, mathematics",
    },
    "ALI": {
        "label": "🌾 Alimentazione",
        "anni": [2],
        "color_primary": "#558B2F",
        "color_bg": "#F1F8E9",
        "scene_objects": (
            "a wooden cutting board with fresh vegetables (tomato, carrot, leaf of basil), "
            "a glass milk bottle, a loaf of bread, a packaged food container with a clear "
            "nutritional label panel visible, a small fridge thermometer"
        ),
        "scene_characters": "a young person reading a food label",
        "scene_setting": "a sunlit kitchen counter or a school canteen tray",
        "stem_link": "biology, food chemistry, nutrition science",
    },
    "AMB": {
        "label": "🏗️ Abitazione · Città · Territorio",
        "anni": [2],
        "color_primary": "#00695C",
        "color_bg": "#E0F2F1",
        "scene_objects": (
            "a small house cross-section with windows facing south, a compass-rose with sun "
            "trajectories drawn for summer and winter, red and blue thermal-flow arrows through "
            "a wall, a green-roof slice with vegetation, a row of solar panels on a tilted roof"
        ),
        "scene_characters": "an architect figure standing next to a 3D foam model of a small building",
        "scene_setting": "a neighborhood street with low buildings and trees",
        "stem_link": "physics of heat transfer, geography, urban planning",
    },
    "ENE": {
        "label": "⚡ Energia e Macchine",
        "anni": [3],
        "color_primary": "#E65100",
        "color_bg": "#FFF3E0",
        "scene_objects": (
            "a wooden lever with a pivot triangle, a pulley with a hanging weight, two meshing "
            "gear wheels, a tilted photovoltaic panel, a three-blade wind turbine in the background, "
            "a battery cell with + and − terminals, an orange lightning-bolt icon"
        ),
        "scene_characters": "an engineer in a hard hat holding a wrench, looking thoughtful",
        "scene_setting": "an open workshop with mechanical parts on the bench and a wind farm visible through a window",
        "stem_link": "Newtonian mechanics, energy conservation, electrical engineering",
    },
    "COM": {
        "label": "📡 Comunicazioni e Trasporti",
        "anni": [3],
        "color_primary": "#283593",
        "color_bg": "#E8EAF6",
        "scene_objects": (
            "a satellite dish antenna, a coil of glowing fibre-optic cable, a smartphone "
            "displaying full signal bars, a high-speed train silhouette, a cargo container ship, "
            "a Wi-Fi router with concentric wave rings, a tall radio tower emitting curved waves"
        ),
        "scene_characters": "a network technician with headphones at a small console",
        "scene_setting": "an aerial-view city skyline at dusk with transport corridors lit up",
        "stem_link": "electromagnetic waves, logistics, transportation engineering",
    },
    "SIS": {
        "label": "⚙️ Sistemi · Economia · Lavoro",
        "anni": [3],
        "color_primary": "#4527A0",
        "color_bg": "#EDE7F6",
        "scene_objects": (
            "a chain of icons (factory → truck → store → home), a small stack of gold-coloured "
            "coins, a rising bar chart with three bars, a globe with curved trade routes drawn "
            "across it, a balance scale, a contract document with a signature line"
        ),
        "scene_characters": "an entrepreneur in business-casual clothes holding a tablet",
        "scene_setting": "a modern office wall covered with sticky-notes and a world map",
        "stem_link": "economics, statistics, social systems",
    },
    "INF": {
        "label": "🖥️ Informatica",
        "anni": [1, 2, 3],
        "color_primary": "#0277BD",
        "color_bg": "#E1F5FE",
        "scene_objects": (
            "a stylised desktop window with a folder hierarchy on the left and a code editor on the "
            "right, a stream of 0/1 binary digits flowing through a wire, an encryption key icon, "
            "a server-rack silhouette, a mouse pointer hovering on a button"
        ),
        "scene_characters": "a student typing at a school laptop, screen visible",
        "scene_setting": "a school computer lab with two screens visible in soft focus",
        "stem_link": "algorithms, data structures, computer architecture",
    },
}

# ────────────────────────────────────────────────────────────────────
# 2. LIBRERIA TIPOLOGIE IMMAGINE
# ────────────────────────────────────────────────────────────────────

# Mappa: tipo → ( etichetta italiana, formato W×H )
TIPI: dict[str, tuple[str, tuple[int, int]]] = {
    "timeline": ("Timeline storica", (1400, 600)),
    "flowchart": ("Diagramma di flusso", (1400, 700)),
    "comparison": ("Confronto affiancato", (1400, 700)),
    "anatomy": ("Schema tecnico / anatomia", (1400, 800)),
    "taxonomy": ("Tassonomia / albero categoriale", (1200, 800)),
    "formula": ("Schema didattico di formula", (1200, 700)),
    "scene": ("Illustrazione narrativa di scena", (1400, 800)),
    "case": ("Caso studio illustrato", (1400, 800)),
    "diagram": ("Diagramma schematico", (1200, 700)),
    "map": ("Mappa concettuale", (1100, 700)),
}

# Filtri parole grammaticali italiane (stop-words) per pulire le etichette
STOP_LABELS = {
    "adesso", "allora", "anche", "ancora", "ancora", "appena", "avere", "bene", "casa",
    "chi", "che", "ciò", "ci", "ce", "con", "cosa", "così", "dei", "del", "della", "delle",
    "dello", "di", "dove", "due", "essere", "esempio", "ecco", "fa", "fare", "fine", "fino",
    "fra", "già", "giorno", "gli", "grande", "ha", "hai", "hanno", "ho", "il", "la", "le", "li",
    "lo", "loro", "ma", "me", "mi", "mio", "mai", "meglio", "molto", "ne", "nel", "nella",
    "nei", "nelle", "non", "nostro", "noi", "non", "o", "ora", "ogni", "oltre", "per", "però",
    "piu", "più", "poi", "primo", "prima", "proprio", "qua", "qui", "qualche", "quale", "quali",
    "quando", "quasi", "quella", "quelle", "quelli", "quello", "questa", "queste", "questi",
    "questo", "sé", "sempre", "senza", "si", "sì", "solo", "sopra", "sotto", "su", "suo", "sua",
    "sue", "suoi", "te", "ti", "tra", "tre", "tu", "tuo", "tua", "tue", "tuoi", "tuo",
    "un", "una", "uno", "verso", "vi", "voi", "vostro",
    "we", "they", "the", "this", "that", "these", "those",
    "vediamole", "vediamo", "vedi", "viene", "vita", "lavoro",
}

# Parole che indicano frammento di formula/codice da scartare
FORMULA_FRAGMENTS = {"=", "+", "−", "-", "*", "×", "/", "%", "²", "³", "kw", "kwh", "j", "n", "m"}


# ────────────────────────────────────────────────────────────────────
# 3. UTILITY
# ────────────────────────────────────────────────────────────────────

def slugify_filename(mc_id: str) -> str:
    return f"{mc_id}_visual_brief.md"


def clean_label(text: str) -> str:
    """Normalizza una candidata etichetta: rimuove virgolette finali, due-punti, ecc."""
    text = text.strip().strip(":：·—–-").strip()
    # rimuovi enfasi residue
    text = re.sub(r"\*+", "", text)
    text = re.sub(r"\s+", " ", text)
    # Rimuovi parentesi residue
    text = text.strip("()[]")
    return text


def is_garbage_label(label: str) -> bool:
    """True se l'etichetta è un frammento grammaticale o troppo corta/frammentaria."""
    if not label or len(label) < 3:
        return True
    # etichette che iniziano con emoji decorative (es. "🔢 Collegamento STEM")
    if label and ord(label[0]) > 0x2600:
        return True
    # etichette che contengono "Collegamento STEM" o simili meta-annotazioni didattiche
    if "Collegamento STEM" in label or "Geo-storia" in label or "CLIL" in label:
        return True
    lower = label.lower().strip().rstrip(".,:;!?")
    # frammento di formula
    if lower in FORMULA_FRAGMENTS:
        return True
    # tutta in stop-words?
    tokens = re.findall(r"[a-zàèéìòù]+", lower)
    if not tokens:
        return True
    if all(t in STOP_LABELS for t in tokens):
        return True
    # se è una sola parola e è una stop-word
    if len(tokens) == 1 and tokens[0] in STOP_LABELS:
        return True
    # frammenti di unità di misura tipo "(J)" o "(N)"
    if re.fullmatch(r"\([A-Z]{1,3}\)", label):
        return True
    # caratteri strani
    if re.search(r"[\n\r\t]", label):
        return True
    # troppo lunga (probabile frase intera)
    if len(label) > 60:
        return True
    return False


def truncate_label(label: str, max_chars: int = 36) -> str:
    if len(label) <= max_chars:
        # pulizia: parentesi orfane
        if label.count("(") > label.count(")"):
            label = label.split("(")[0].rstrip()
        if label.count(")") > label.count("("):
            label = label.replace(")", "")
        return label.strip(" ,;:—–-")
    # tronca a parola
    cut = label[:max_chars].rsplit(" ", 1)[0]
    cut = cut.rstrip(".,:;!?—–- ")
    # parentesi orfane post-troncatura
    if cut.count("(") > cut.count(")"):
        cut = cut.split("(")[0].rstrip()
    return cut + "…"


# ────────────────────────────────────────────────────────────────────
# 4. PARSING TESTO MC
# ────────────────────────────────────────────────────────────────────

@dataclass
class EsploraSection:
    title: str
    body: str
    h4_subs: list[tuple[str, str]] = field(default_factory=list)  # (sotto-titolo, sotto-corpo)


def parse_mc_text(md: str) -> tuple[str, list[EsploraSection]]:
    """Estrae titolo principale e tutte le H3 di ESPLORA (con i loro H4 figli)."""
    # Titolo principale (riga H1)
    h1 = re.search(r"^#\s+(.+)$", md, re.M)
    titolo = ""
    if h1:
        line = h1.group(1).strip()
        # togli prefisso "MC-XXX-Y-NN — "
        line = re.sub(r"^MC-[A-Z]+-\d-\d+\s*[—–-]\s*", "", line)
        titolo = line

    # Trova il blocco ESPLORA (tra "## 📖 ESPLORA" e la prossima H2)
    m = re.search(
        r"##\s*(?:📖\s*)?ESPLORA(.*?)(?=^##\s|\Z)",
        md,
        re.M | re.S,
    )
    if not m:
        return titolo, []
    esplora = m.group(1)

    # Split in sezioni H3 (non H4)
    h3_pattern = re.compile(r"^###\s+(.+)$", re.M)
    matches = list(h3_pattern.finditer(esplora))
    sections: list[EsploraSection] = []
    for i, mat in enumerate(matches):
        start = mat.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(esplora)
        section_body = esplora[start:end].strip()
        section_title = mat.group(1).strip()

        # estrai H4 figli
        h4_subs: list[tuple[str, str]] = []
        h4_pattern = re.compile(r"^####\s+(.+)$", re.M)
        h4_matches = list(h4_pattern.finditer(section_body))
        for j, h4m in enumerate(h4_matches):
            h4_start = h4m.end()
            h4_end = h4_matches[j + 1].start() if j + 1 < len(h4_matches) else len(section_body)
            h4_subs.append((h4m.group(1).strip(), section_body[h4_start:h4_end].strip()))

        sections.append(EsploraSection(title=section_title, body=section_body, h4_subs=h4_subs))
    return titolo, sections


# ────────────────────────────────────────────────────────────────────
# 5. SCELTA TIPOLOGIA IMMAGINE
# ────────────────────────────────────────────────────────────────────

def choose_tipo(title: str, body: str) -> str:
    t = title.lower()
    b = body.lower()

    # 1. Formule (segno =, parole come "formula")
    if re.search(r"\b[A-Za-z]\s*=\s*[A-Za-z]", title) or "formula" in t or "joule" in t:
        return "formula"
    # 1b. Anche match veloci sul body se il titolo contiene una formula del tipo W = F × s
    if re.search(r"\b[A-Z]\s*=\s*[A-Z]", title):
        return "formula"

    # 2. Confronti (vs, contro, "X o Y", "differenza")
    if any(s in t for s in [" vs", " vs.", "contro ", "rispetto a", "differenza", " o ", "confronto"]):
        return "comparison"

    # 3. Storia / timeline — pattern stretti per evitare falsi positivi su "una storia" metaforico
    if any(s in t for s in [
        "breve storia", "storia dei ", "storia delle ", "storia della tecnologia",
        "storia compatta", "una storia breve", "dall'antichità",
        "dalla preistoria", "dalle origini", "dall'invenzione", "evoluzione storica",
        "evoluzione del", "evoluzione della",
    ]):
        return "timeline"
    if re.search(r"\bdal\s+\d{3,4}\b", t) or re.search(r"\b\d{3,4}\s*[-–—]\s*\d{3,4}\b", t):
        return "timeline"

    # 4. Tassonomie / classificazioni
    if any(s in t for s in [
        "famiglie", "tipi di", "categorie", "classificazione", "tassonomia",
        "tre tipi", "quattro tipi", "i metodi", "i sistemi", "una panoramica",
    ]):
        return "taxonomy"

    # 5. Caso studio / illustrazione di scena
    if t.startswith("il caso") or t.startswith("caso studio") or "caso studio" in t:
        return "case"
    if t.startswith("l'esempio") or t.startswith("esempio"):
        return "case"

    # 6. Flowchart (fasi, ciclo, passi, sequenza)
    if any(s in t for s in [
        "le fasi", "le sette fasi", "le tre fasi", "ciclo", "fasi del", "passi",
        "sequenza", "flusso", "filiera", "catena del valore", "catena del freddo",
        "viaggio del", "dal produttore",
    ]):
        return "flowchart"

    # 7. Anatomia / schema tecnico (descrive componenti interni di un oggetto)
    if any(s in t for s in [
        "anatomia", "componenti", "come è fatto", "come è fatta", "come funziona",
        "parti di", "struttura di", "organi", "muscoli", "il muro che",
    ]):
        return "anatomy"

    # 8. Mappa concettuale come fallback per concetti astratti
    if any(s in t for s in [
        "che cos'è", "cos'è", "che cosa", "definizione",
    ]):
        return "diagram"

    # Default: illustrazione narrativa/scena (più ricca di una mappa concettuale)
    return "scene"


# ────────────────────────────────────────────────────────────────────
# 6. ESTRAZIONE ETICHETTE CURATA
# ────────────────────────────────────────────────────────────────────

def extract_labels(section: EsploraSection, target: int = 6, max_target: int = 8) -> list[str]:
    """Estrae 4–7 etichette pulite per l'immagine."""
    labels: list[str] = []
    seen: set[str] = set()

    def add(candidate: str):
        cand = clean_label(candidate)
        if not cand:
            return
        if is_garbage_label(cand):
            return
        key = cand.lower()
        if key in seen:
            return
        seen.add(key)
        labels.append(truncate_label(cand))

    # Priorità 1: H4 figli (sotto-titoli) — i più affidabili
    for h4_title, _ in section.h4_subs:
        # normalizza "Fase 1 — Estrazione delle materie prime" → "Estrazione materie prime"
        t = h4_title
        t = re.sub(r"^(?:fase|passo|step|punto)\s*\d+\s*[—–-]\s*", "", t, flags=re.I)
        add(t)

    # Priorità 2: pattern "**Termine forte:**" (definizioni con due-punti)
    if len(labels) < target:
        for m in re.finditer(r"\*\*([^*\n]{3,60})\*\*\s*[:：]", section.body):
            add(m.group(1))
            if len(labels) >= max_target:
                break

    # Priorità 3: pattern "**Termine forte** (parens with definition)"
    if len(labels) < target:
        for m in re.finditer(r"\*\*([^*\n]{3,60})\*\*\s*\(", section.body):
            add(m.group(1))
            if len(labels) >= max_target:
                break

    # Priorità 4: altri grassetti **...** con look-around per evitare match tra grassetti consecutivi
    if len(labels) < target:
        for m in re.finditer(r"(?<![\*\w])\*\*([^*\n]{3,40})\*\*(?![\*\w])", section.body):
            cand = m.group(1)
            # extra: scarta se inizia con verbo/preposizione italiana
            first_word = cand.lstrip().split(" ", 1)[0].lower().rstrip(".,;:")
            if first_word in {"è", "ha", "in", "di", "da", "su", "per", "con", "al", "alla", "il",
                              "la", "lo", "le", "i", "gli", "un", "una", "uno", "del", "della",
                              "dello", "dei", "degli", "delle", "ne", "ci", "ti", "mi", "si",
                              "quando", "se", "ma", "che", "chi", "cosa", "perché", "poi", "qui",
                              "qua", "non", "anche", "ancora", "deve", "puoi", "può", "viene"}:
                continue
            add(cand)
            if len(labels) >= max_target:
                break

    # Priorità 5: termini in *corsivo* con look-around stretto
    if len(labels) < target:
        for m in re.finditer(r"(?<![\*\w])\*([^*\n]{3,40})\*(?![\*\w])", section.body):
            cand = m.group(1)
            first_word = cand.lstrip().split(" ", 1)[0].lower().rstrip(".,;:")
            if first_word in {"è", "ha", "in", "di", "da", "su", "per", "con", "il", "la", "lo",
                              "del", "della", "che", "chi"}:
                continue
            add(cand)
            if len(labels) >= max_target:
                break

    # Priorità 6 (fallback se ancora poche): nomi propri / date in linea
    if len(labels) < 4:
        # estrai date espressive es. "2018", "anni '60", "1492"
        for m in re.finditer(r"\b(?:nel|nell'|anno|anni)\s+(\d{2,4}|'\d{2})\b", section.body, re.I):
            add(m.group(0))
            if len(labels) >= max_target:
                break
        # nomi propri composti (capitalizzati consecutivi)
        for m in re.finditer(r"\b([A-Z][a-zà-ù]{2,}(?:\s+[A-Z][a-zà-ù]{2,})+)\b", section.body):
            add(m.group(1))
            if len(labels) >= max_target:
                break

    # Priorità 7 (estrema): termini chiave singoli dal titolo
    if len(labels) < 3:
        for token in re.findall(r"\b([A-Za-zà-ù]{4,})\b", section.title):
            tlow = token.lower()
            if tlow in STOP_LABELS or tlow in {"caso", "studio", "esempio"}:
                continue
            add(token)
            if len(labels) >= max_target:
                break

    return labels[:max_target]


# ────────────────────────────────────────────────────────────────────
# 7. COSTRUZIONE PROMPT
# ────────────────────────────────────────────────────────────────────

def base_style_block(area: dict, anno: int) -> str:
    eta = {1: "11–12", 2: "12–13", 3: "13–14"}.get(anno, "11–14")
    return (
        f"Style: flat vector editorial illustration, no photo-realism, no 3D rendering, "
        f"clean modern infographic aesthetic. Background pure white (#FFFFFF). "
        f"Color palette: primary {area['color_primary']} for accents/keylines, soft "
        f"{area['color_bg']} for fills, white for negative space, dark slate (#1A1A1A) "
        f"only for label text. WCAG AA contrast on every label. Typography: Inter / Nunito "
        f"sans-serif, semi-bold for labels, regular for captions. Italian labels only — "
        f"do NOT render English text. Labels must be short (≤3 words each). "
        f"Do NOT render the section title in the image; the title is metadata, not visual content. "
        f"Audience: Italian secondary-school students aged {eta}."
    )


def labels_block(labels: list[str]) -> str:
    if not labels:
        return "(no labels — use generic icons only)"
    quoted = ", ".join(f'\"{lab}\"' for lab in labels)
    return quoted


def render_prompt(
    tipo: str,
    section: EsploraSection,
    area: dict,
    anno: int,
    mc_titolo: str,
    labels: list[str],
) -> str:
    """Genera un prompt descrittivo specifico alla tipologia."""
    base = base_style_block(area, anno)
    color = area["color_primary"]
    bg = area["color_bg"]
    objs = area["scene_objects"]
    chars = area["scene_characters"]
    setting = area["scene_setting"]
    L = labels_block(labels)
    n_lab = max(4, min(len(labels), 7))

    # Snippet di "scenografia di area" da usare in molti pattern
    area_scenography = (
        f"Visual vocabulary of this Italian middle-school topic «{mc_titolo}»: "
        f"include subtle iconography drawn from {objs}. "
    )

    if tipo == "timeline":
        return (
            f"Horizontal historical timeline illustration about «{section.title}». "
            f"A single straight timeline bar runs left-to-right across the lower third of the canvas, "
            f"drawn in {color} with white inner highlight and tick marks. "
            f"Place {n_lab} event dots (filled white with {color} 3px stroke) at irregular but balanced "
            f"intervals along the bar. Above each dot, a short bold YEAR or DATE in {color}; "
            f"below each dot, a 1–3 word Italian label and a tiny pictogram icon evoking that event. "
            f"Use these event labels in order: {L}. "
            f"For each event, draw a small contextual icon: tools, machines, people, vehicles, or "
            f"objects appropriate to the era. "
            f"{area_scenography}"
            f"Composition: clean and airy, generous padding. Format 1400×600. {base}"
        )

    if tipo == "flowchart":
        return (
            f"Process flow diagram illustration about «{section.title}». "
            f"Draw {n_lab} sequential rounded-rectangle nodes connected left-to-right (or top-to-bottom "
            f"if the topic implies a closed loop — in which case curve the last arrow back to the first). "
            f"Each node has a small contextual icon on the left and a 1–3 word Italian label on the right. "
            f"Use these step labels in order: {L}. "
            f"Node fill: {bg} with {color} 2px stroke; first/last node may be filled {color} with white text. "
            f"Arrows between nodes are {color}, sharp triangular heads. "
            f"{area_scenography}"
            f"Include 1–2 contextual scene fragments in the background corners (very low opacity) "
            f"from this list: {objs}. "
            f"Composition: balanced, no overlap. Format 1400×700. {base}"
        )

    if tipo == "comparison":
        return (
            f"Two-column side-by-side comparison illustration about «{section.title}». "
            f"Two equal columns separated by a thin {color} vertical divider. "
            f"Each column has: a header strip in {color} with a single-word Italian label on top; "
            f"a large central icon representing one of the two contrasted things (drawn from real objects "
            f"in {objs}); 3–4 small comparison rows beneath, each row being [tiny attribute icon] + "
            f"[1–3 word Italian label]. "
            f"Suggested labels to distribute between the two columns: {L}. "
            f"At the bottom, a thin summary band in {bg} with one short take-away sentence in Italian "
            f"(max 8 words). "
            f"{area_scenography}"
            f"Format 1400×700. {base}"
        )

    if tipo == "anatomy":
        return (
            f"Exploded technical-anatomy diagram about «{section.title}». "
            f"Draw a single hero object at the center, technically accurate but stylized as flat vector. "
            f"The hero object is one of these (pick the one most relevant to «{section.title}»): {objs}. "
            f"Draw {n_lab} call-out lines radiating from specific points on the hero object to small "
            f"labelled chips placed around the perimeter. Each chip = [icon] + [1–3 word Italian label]. "
            f"Use these component labels: {L}. "
            f"Call-out lines are thin {color} with a small filled dot at the object-end and a chip at the "
            f"label-end. Chips are {bg} rounded rectangles with {color} stroke. "
            f"{area_scenography}"
            f"Composition: hero object dominates 60% of canvas; chips arranged in a balanced ring. "
            f"Format 1400×800. {base}"
        )

    if tipo == "taxonomy":
        return (
            f"Hierarchical taxonomy tree illustration about «{section.title}». "
            f"A single root node at the top in {color} with a short Italian label (≤2 words capturing the "
            f"category being classified). Below, {n_lab} branch nodes fan out, each as a {bg}-filled "
            f"rounded rectangle with {color} stroke, containing a small icon + 1–3 word Italian label. "
            f"Use these branch labels: {L}. "
            f"Connection lines are clean {color} curves tapering from root to branches. "
            f"For each branch, draw a tiny distinguishing pictogram inspired by: {objs}. "
            f"{area_scenography}"
            f"Composition: balanced tree, ample whitespace, no text crowding. Format 1200×800. {base}"
        )

    if tipo == "formula":
        return (
            f"Educational didactic diagram of a physics/maths formula explained, about «{section.title}». "
            f"Center a large formula in mathematical typography (use real math symbols, e.g. F, =, ×, /, ², ³). "
            f"Around the formula, draw {n_lab} call-out chips, each pointing to one symbol/variable in the "
            f"formula and labelling it in Italian with: [symbol] + [1–3 word meaning] + [unit in parentheses]. "
            f"Use these conceptual labels (some may already be in the formula): {L}. "
            f"At the bottom-right of the canvas, draw a small concrete real-world scene illustrating the "
            f"formula being applied — chosen from: {objs}. The scene is small (≤25% canvas) and stylized. "
            f"{area_scenography}"
            f"Use {color} for the formula and the call-out lines; {bg} for chip fills. Format 1200×700. "
            f"{base}"
        )

    if tipo == "case":
        # Caso studio: illustrazione narrativa di una scena concreta
        return (
            f"Editorial illustration of a real-world case study scene about «{section.title}». "
            f"Compose a single coherent scene (no diagrams, no boxes) showing the case in action. "
            f"Use the scene setting: {setting}. Include {chars}. Foreground objects drawn from: {objs}. "
            f"Lightly annotate {n_lab} key elements of the scene with small {color}-stroked chips on "
            f"{bg} background, each containing a 1–3 word Italian label, connected to the element by a "
            f"thin leader line. Suggested annotation labels: {L}. "
            f"Mood: warm and narrative; the scene should feel like a non-fiction editorial spread for "
            f"young readers, with slight depth via two-tone layering (still flat vector, no gradients). "
            f"{base} Format 1400×800."
        )

    if tipo == "scene":
        # Illustrazione narrativa concettuale
        return (
            f"Concept illustration scene about «{section.title}». "
            f"Compose a single illustrative scene (not a diagram) where the abstract idea of "
            f"«{section.title}» is shown through concrete objects and a human figure. "
            f"Setting: {setting}. Character: {chars}. "
            f"Hero objects in the scene: {objs}. "
            f"Add {n_lab} small {bg} chips with {color} stroke positioned next to the scene's key "
            f"elements, each chip containing a 1–3 word Italian label. Suggested labels: {L}. "
            f"Mood: warm, inviting, uncluttered. {base} Format 1400×800."
        )

    if tipo == "diagram":
        return (
            f"Schematic concept diagram about «{section.title}». "
            f"A clear central concept node (rounded square, {color} filled, white short Italian label "
            f"of max 2 words) surrounded by {n_lab} satellite chips in {bg}/{color}-stroke, each holding "
            f"a 1–3 word Italian label and a small relevant pictogram. "
            f"Use these satellite labels: {L}. "
            f"Connections are short straight or gently curved {color} lines, optionally with a single "
            f"verb-label in Italian on the line (e.g. «richiede», «produce», «misura»). "
            f"In the bottom-left corner, place a low-opacity scene fragment drawn from: {objs}. "
            f"{base} Format 1200×700."
        )

    if tipo == "map":
        return (
            f"Light concept map about «{section.title}». "
            f"A central hub circle in {color} with white short Italian label (≤2 words). Around it, "
            f"{n_lab} child nodes in {bg} with {color} stroke, each holding a 1–3 word Italian label "
            f"and a small icon. "
            f"Use these node labels: {L}. "
            f"Curved connecting lines in {color}. Layout radial, balanced. "
            f"{area_scenography}"
            f"{base} Format 1100×700."
        )

    raise ValueError(f"Tipo immagine non noto: {tipo}")


# ────────────────────────────────────────────────────────────────────
# 8. GENERAZIONE BRIEF MARKDOWN PER UNA MC
# ────────────────────────────────────────────────────────────────────

def caption_for(tipo: str, section_title: str) -> str:
    captions = {
        "timeline": f"Nel tempo: come si è evoluto «{section_title}».",
        "flowchart": f"Passo dopo passo: la sequenza di «{section_title}».",
        "comparison": f"A confronto: «{section_title}».",
        "anatomy": f"Come è fatto: i componenti di «{section_title}».",
        "taxonomy": f"Le famiglie / categorie di «{section_title}».",
        "formula": f"La formula spiegata: «{section_title}».",
        "case": f"Caso reale: «{section_title}».",
        "scene": f"La scena di «{section_title}»: cosa succede davvero.",
        "diagram": f"Lo schema di «{section_title}».",
        "map": f"Mappa concettuale di «{section_title}».",
    }
    return captions.get(tipo, section_title)


def generate_brief_for_mc(mc_path: Path, mc_id: str, area_code: str, anno: int) -> Optional[str]:
    """Restituisce il contenuto markdown del brief per la MC, o None se manca il testo."""
    if not mc_path.exists():
        return None

    text = mc_path.read_text(encoding="utf-8")
    mc_titolo, sections = parse_mc_text(text)
    if not sections:
        return None

    area = AREA_META[area_code]
    livello_digcomp = {1: "F", 2: "I", 3: "A"}.get(anno, "F")

    today = date.today().isoformat()

    lines: list[str] = []
    lines.append(f"# Visual Brief ESPLORA — {mc_id}")
    lines.append(f"## {mc_titolo}")
    lines.append("")
    lines.append("| Campo | Valore |")
    lines.append("|-------|--------|")
    lines.append(f"| **Area** | {area['label']} |")
    lines.append(f"| **Anno** | {anno}ª media |")
    lines.append(f"| **Livello DigComp** | {livello_digcomp} |")
    lines.append(f"| **Colore area** | `{area['color_primary']}` |")
    lines.append(f"| **Generato** | {today} |")
    lines.append(f"| **Immagini totali** | {len(sections)} |")
    lines.append("")
    lines.append("> ⚠️ I prompt sono **descrittivi di scena**, non template astratti. ")
    lines.append("> Il titolo italiano della sezione non va renderizzato nell'immagine: ")
    lines.append("> è solo metadato. Le etichette in figura sono brevi (≤3 parole).")
    lines.append("")
    lines.append("---")
    lines.append("")

    for idx, section in enumerate(sections, start=1):
        tipo_key = choose_tipo(section.title, section.body)
        tipo_label, (w, h) = TIPI[tipo_key]
        labels = extract_labels(section)
        caption = caption_for(tipo_key, section.title)
        prompt = render_prompt(tipo_key, section, area, anno, mc_titolo, labels)

        snippet = re.sub(r"\s+", " ", section.body)[:260].strip()
        if len(section.body) > 260:
            snippet += "…"

        lines.append(f"## Immagine {idx:02d} — {section.title}")
        lines.append("")
        lines.append("| Campo | Valore |")
        lines.append("|-------|--------|")
        lines.append(f"| **Tipo** | {tipo_label} |")
        lines.append(f"| **Formato** | PNG {w}×{h} |")
        lines.append(f"| **Legenda** | {caption} |")
        lines.append(f"| **Posizione** | Dopo la sezione «{section.title}» |")
        lines.append(f"| **Etichette curate** | {', '.join(labels) if labels else '—'} |")
        lines.append("")
        if section.h4_subs:
            h4_titles = " · ".join(t for t, _ in section.h4_subs)
            lines.append(f"> _Sotto-sezioni interne: {h4_titles}_")
            lines.append("")
        lines.append("**Testo di riferimento:**")
        lines.append(f"> {snippet}")
        lines.append("")
        lines.append("**Prompt:**")
        lines.append("```")
        # Spezza il prompt in righe ~110 char per leggibilità
        wrapped = []
        for paragraph in prompt.split("\n"):
            words = paragraph.split(" ")
            line = ""
            for w_ in words:
                if line and len(line) + 1 + len(w_) > 110:
                    wrapped.append(line)
                    line = w_
                else:
                    line = (line + " " + w_).strip()
            if line:
                wrapped.append(line)
        lines.extend(wrapped)
        lines.append("```")
        lines.append("")
        lines.append("---")
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


# ────────────────────────────────────────────────────────────────────
# 9. ENTRY POINT
# ────────────────────────────────────────────────────────────────────

def find_all_mcs(testi_root: Path) -> list[tuple[str, str, int, Path]]:
    """Trova tutti i MC-XXX-Y-NN_completa.md. Ritorna (mc_id, area, anno, path)."""
    results: list[tuple[str, str, int, Path]] = []
    pattern = re.compile(r"^MC-([A-Z]+)-(\d)-(\d+)$")
    for p in testi_root.rglob("MC-*_completa.md"):
        stem = p.stem.replace("_completa", "")
        m = pattern.match(stem)
        if not m:
            continue
        area = m.group(1)
        anno = int(m.group(2))
        if area not in AREA_META:
            continue
        results.append((stem, area, anno, p))
    results.sort()
    return results


def main():
    repo = Path(__file__).resolve().parents[2]  # → TecnologIA/
    testi_root = repo / "08_TESTI"
    out_dir = repo / "04_CONTENUTI" / "visual_esplora"
    out_dir.mkdir(parents=True, exist_ok=True)

    mcs = find_all_mcs(testi_root)
    if not mcs:
        print("ERRORE: nessun MC trovato in 08_TESTI/", file=sys.stderr)
        sys.exit(1)

    written = 0
    index_rows: list[tuple[str, str, int, int]] = []

    for mc_id, area, anno, path in mcs:
        brief_md = generate_brief_for_mc(path, mc_id, area, anno)
        if brief_md is None:
            print(f"[SKIP] {mc_id}: testo non parsabile")
            continue
        out_path = out_dir / slugify_filename(mc_id)
        out_path.write_text(brief_md, encoding="utf-8")
        # conta le immagini = numero di "## Immagine"
        n_img = brief_md.count("\n## Immagine ")
        index_rows.append((mc_id, area, anno, n_img))
        written += 1
        print(f"[OK] {mc_id} → {out_path.name} ({n_img} immagini)")

    # Scrivi _INDEX.md
    today = date.today().isoformat()
    index_lines = [
        "# Indice Visual Brief ESPLORA — TecnologIA",
        f"*Generato: {today}*",
        "",
        "| MC | Area | Anno | File | Immagini |",
        "|----|------|------|------|----------|",
    ]
    for mc_id, area, anno, n_img in sorted(index_rows):
        area_label = AREA_META[area]["label"]
        index_lines.append(
            f"| [{mc_id}]({mc_id}_visual_brief.md) | {area_label} | {anno}ª | "
            f"{mc_id}_visual_brief.md | {n_img} |"
        )
    (out_dir / "_INDEX.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")

    print(f"\nTotale brief scritti: {written}")


if __name__ == "__main__":
    main()
