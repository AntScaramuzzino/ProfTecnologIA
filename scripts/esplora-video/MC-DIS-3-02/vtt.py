import json, re, sys
OUT = sys.argv[1] if len(sys.argv) > 1 else 'out'
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
FW = set('di a al il la le i e è un una che da su tra del della alla ha con per lo gli ogni ma si non nel in o più'.split())
KEEP = [('file','stl'),('file','g-code'),('nido',"d'ape"),('piano','riscaldato'),('compostaggio','industriale'),('altri','filamenti'),('strati','sottili'),('buon','progettista'),('volume','interno'),('senza','niente'),('niente','sotto'),('può','depositare')]
def ts(x): return f"{int(x//3600):02d}:{int(x%3600//60):02d}:{x%60:06.3f}"
def ok_break(toks, k):
    a, b = toks[k-1].lower().strip(',.:;'), toks[k].lower().strip(',.:;')
    if a in FW or (a, b) in KEEP: return False
    return k >= 2 and len(toks) - k >= 2
def lines2(toks):
    s = ' '.join(toks)
    if len(s) <= 42: return [s]
    best = None
    for k in range(1, len(toks)):
        l1, l2 = ' '.join(toks[:k]), ' '.join(toks[k:])
        if len(l1) > 42 or len(l2) > 42 or not ok_break(toks, k): continue
        v = max(len(l1), len(l2)) - (8 if re.search(r'[,:;]$', toks[k-1]) else 0)
        if best is None or v < best[0]: best = (v, k)
    return None if best is None else [' '.join(toks[:best[1]]), ' '.join(toks[best[1]:])]
def chunk(sg, toks):
    if lines2([toks[j] for j in sg]): return [sg]
    for punct in (True, False):
        cand = [i for i in range(2, len(sg) - 1) if (bool(re.search(r'[,:;]$', toks[sg[i-1]])) if punct else ok_break([toks[j] for j in sg], i))]
        cand.sort(key=lambda i: (0 if re.search(r'[:;]$', toks[sg[i-1]]) else 1, abs(i - len(sg) / 2)))
        for i in cand:
            a, b = chunk(sg[:i], toks), chunk(sg[i:], toks)
            if a and b: return a + b
    return None
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; W = s['parole']; toks = [w[0] for w in W]
    sents, cur = [], []
    for k, tok in enumerate(toks):
        cur.append(k)
        if re.search(r'[.?!]$', tok): sents.append(cur); cur = []
    if cur: sents.append(cur)
    for sg in sents:
        for p in chunk(sg, toks):
            cues.append([base + W[p[0]][1], base + W[p[-1]][2] + 0.3, '\n'.join(lines2([toks[j] for j in p]))])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
for i, (a, b, x) in enumerate(cues): assert b > a and (i == 0 or a > cues[i-1][1]); assert all(len(l.split()) > 1 for l in x.split('\n')[1:]), x
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
open(f'{OUT}/par-05.vtt', 'w').write("\n".join(out)); print("\n".join(out))
