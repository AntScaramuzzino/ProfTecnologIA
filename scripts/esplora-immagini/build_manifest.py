"""Costruisce WebP + manifest.json di una MC dalle JPG esportate da Canva.

Uso: python3 build_manifest.py spec.json dir_jpg
spec.json: {"mc": "...", "design": "D...", "items": [{"paragrafo","subject","alt"}, ...]}
dir_jpg contiene p01.jpg, p02.jpg ... nello stesso ordine degli items.
"""
import json, sys, os
from PIL import Image
STYLE = ("Immagine per il libro, sullo stile visivo delle presentazioni (foto realistica, luce calda "
         "naturale, sovrapposizioni olografiche ciano e ambra stile HUD, nessun testo né scritte), "
         "in base al testo del paragrafo \"{t}\": {s}")
def prompt(item): return item.get("prompt") or STYLE.format(t=item["paragrafo"], s=item["subject"])
if __name__ == "__main__":
    spec = json.load(open(sys.argv[1], encoding="utf-8")); src = sys.argv[2]
    root = os.path.join(os.path.dirname(__file__), "..", "..", "public", "assets", "esplora", spec["mc"])
    os.makedirs(root, exist_ok=True)
    out = []
    for i, it in enumerate(spec["items"], 1):
        jpg = os.path.join(src, f"p{i:02d}.jpg")
        if not os.path.exists(jpg): continue
        Image.open(jpg).convert("RGB").save(os.path.join(root, f"par-{i:02d}.webp"), "WEBP", quality=80)
        out.append({"paragrafo": it["paragrafo"], "file": f"par-{i:02d}.webp", "alt": it["alt"], "prompt": prompt(it)})
    m = {"mc": spec["mc"], "fonte": f"Immagini generate con Canva AI (design {spec.get('design','')}), stile visivo delle presentazioni MC", "immagini": out}
    json.dump(m, open(os.path.join(root, "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(spec["mc"], len(out), "immagini")
