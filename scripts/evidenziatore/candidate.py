"""Propone frasi candidate da evidenziare nella sezione ESPLORA di una o più MC.
Uso: python3 candidate.py MC-ID [MC-ID ...]  → stampa le candidate e salva candidate_<MC>.json"""
import json, re, sys, glob, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../.."))
KEY = re.compile(r"si chiam|significa|si definisce|vuol dire|cioè|è il |è la |è un |è una |sono i |sono le |serve a|servono a|per questo|quindi|in altre parole|il principio|la regola|dipende|permette|più important|fondamental|essenziale|il segreto|la differenza", re.I)
def sentences(line):
    return [s for s in re.split(r"(?<=[.!?])\s+(?=[A-ZÀ-Ý«\"*])", line) if s.strip()]
for mc in sys.argv[1:]:
    f = glob.glob(f"{ROOT}/data/testi/*/*/{mc}_completa.md")[0]
    t = open(f).read()
    m = re.search(r"\n## [^\n]*ESPLORA[^\n]*\n(.*?)(?=\n## )", t, re.S)
    sez = m.group(1)
    blocks = re.split(r"\n(?=#{3,4} )", sez)
    out = {}; k = 0
    print(f"=== {mc} ({len(sez.split())} parole)")
    for b in blocks:
        head = b.split("\n", 1)[0] if b.startswith("#") else "(apertura)"
        title = head.lstrip("# ").strip()
        if mc == "MC-DIS-1-01" and re.search(r"Costruzione\s+\d+", title): continue
        if re.search(r"in tre righe", title, re.I): continue
        cands = []
        skip = False
        for line in b.split("\n"):
            L = line.strip()
            if re.match(r"\*\*In tre righe", L, re.I): skip = True; continue
            if skip and (L.startswith("**") or L.startswith("#")) and not L.startswith("- "): skip = False
            if skip or not L or L.startswith(("#", ">", "|", "@@", "```", "!", "<")): continue
            if re.fullmatch(r"\*\*[^*]+\*\*:?", L): continue
            L = re.sub(r"^(\d+\.|[-•])\s+", "", L)
            for s in sentences(L):
                s = s.strip()
                w = len(s.split())
                if w < 6 or w > 32 or "*" in re.sub(r"\*\*[^*]+\*\*|\*[^*]+\*", "", s) or "==" in s or "](" in s: continue
                if s.count(s) != 1 or sez.count(s) != 1: continue
                sc = (3 if KEY.search(s) else 0) + (2 if "**" in s else 0) + (1 if w <= 20 else 0)
                cands.append((sc, s))
        if not cands: continue
        nmax = min(6, max(3, len(b.split()) // 80)); top = sorted(range(len(cands)), key=lambda i: -cands[i][0])[:nmax]
        print(f"-- {title[:60]} ({len(b.split())}p)")
        for i in sorted(top):
            k += 1; out[k] = cands[i][1]
            print(f"{k}: {cands[i][1]}")
    json.dump(out, open(f"{HERE}/candidate_{mc}.json", "w"), ensure_ascii=False)
