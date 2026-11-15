"""Applica evidenziazioni ==...== ai testi ESPLORA. Uso: python3 applica.py lista.json
lista.json: {"MC-ID": ["frase esatta", ...]} — ogni frase deve comparire una sola volta nella sezione ESPLORA."""
import json, re, sys, glob, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
dati = json.load(open(sys.argv[1]))
for mc, frasi in dati.items():
    files = glob.glob(f"{ROOT}/05_APP/tecnologia-sito-web/data/testi/*/*/{mc}_completa.md") + \
            glob.glob(f"{ROOT}/08_TESTI/*/*/{mc}_completa.md")
    for f in files:
        t = open(f).read()
        m = re.search(r"\n## [^\n]*ESPLORA[^\n]*\n.*?(?=\n## )", t, re.S)
        a, b = m.span()
        sez = t[a:b]
        ok = miss = 0
        for fr in frasi:
            if "==" + fr + "==" in sez:
                ok += 1; continue
            n = sez.count(fr)
            if n != 1:
                miss += 1
                print(f"  {'MANCA' if n == 0 else 'DOPPIA'} [{os.path.relpath(f, ROOT)}]: {fr[:70]}")
                continue
            sez = sez.replace(fr, "==" + fr + "==")
            ok += 1
        open(f, "w").write(t[:a] + sez + t[b:])
        print(f"{os.path.relpath(f, ROOT)}: {ok} evidenziate, {miss} non trovate")
