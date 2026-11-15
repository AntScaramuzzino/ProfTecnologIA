"""Applica le scelte: python3 scegli.py "MC-ID:1,4,7" "MC-ID2:2,3" ...  (numeri da candidate_<MC>.json)"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sel = {}
for arg in sys.argv[1:]:
    mc, ids = arg.split(":")
    c = json.load(open(f"{HERE}/candidate_{mc}.json"))
    sel[mc] = [c[i.strip()] for i in ids.split(",") if i.strip()]
path = f"{HERE}/scelte_tmp.json"
json.dump(sel, open(path, "w"), ensure_ascii=False)
subprocess.run([sys.executable, f"{HERE}/applica.py", path])
