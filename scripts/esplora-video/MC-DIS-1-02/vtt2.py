import json, re
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
FW = set('di a al il la le i e è un una che da su tra dello del alla ha con per lo come non ma ogni tutti quando qui si fa'.split())
KEEP = [('841','per'),('per','1189'),('1189','millimetri'),('594','per'),('per','841'),('841','millimetri'),('210','per'),('per','297'),('297','millimetri'),('lato','lungo'),('lato','corto'),('serie','a'),('iso','216'),('formato','a0'),('formato','a5'),('due','fogli'),('fogli','a1'),('in','scala'),('nuova','scala'),('sistema','operativo'),('scheda','madre'),('parti','meccaniche'),('full','hd'),('più','veloce'),('volte','più'),('cicli','al'),('milioni','di'),('memoria','di'),('quattro','cervelli'),('altre','parti'),('centoventi','milioni'),('due','milioni'),('tre','miliardi'),('ognuna','ha'),('calcoli','semplici')]
def ts(x): return f"{int(x//3600):02d}:{int(x%3600//60):02d}:{x%60:06.3f}"
def ok_break(toks, k):  # break after toks[k-1]
    a, b = toks[k-1].lower().strip(',.:;'), toks[k].lower().strip(',.:;')
    if a in FW or (a, b) in KEEP: return False
    return k >= 2 and len(toks) - k >= 2
def lines2(toks):
    s = ' '.join(toks)
    if len(s) <= 43: return [s]
    best = None
    for k in range(1, len(toks)):
        l1, l2 = ' '.join(toks[:k]), ' '.join(toks[k:])
        if len(l1) > 43 or len(l2) > 43 or not ok_break(toks, k): continue
        sc_ = max(len(l1), len(l2)) - (8 if re.search(r'[,:;]$', toks[k-1]) else 0)
        if best is None or sc_ < best[0]: best = (sc_, k)
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
REP = [('uno a settanta virgola sette', '1:70,7'), ('settanta virgola sette per cento', '70,7%'), ('cinquanta per cento', '50%'), ('uno a cinquanta', '1:50'), ('uno a cento', '1:100'),
       ('zero virgola settecentosette', '0,707'), ('cinquanta diviso', '50 diviso'), ('uno virgola quattrocentoquattordici', '1,414'), ('radice di due', '√2')]
def merge(toks, W):
    ot, ow, i = [], [], 0
    while i < len(toks):
        for a, b in REP:
            n = len(a.split()); seg = ' '.join(toks[i:i+n])
            if re.sub(r'[,.:;]$', '', seg) == a:
                ot.append(b + seg[len(a):]); ow.append([b, W[i][1], W[i+n-1][2]]); i += n; break
        else:
            ot.append(toks[i]); ow.append(W[i]); i += 1
    return ot, ow
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; toks = s['voce'].split(); W = s['parole']
    assert len(toks) == len(W)
    toks, W = merge(toks, W)
    # frasi
    sents, cur = [], []
    for k, tok in enumerate(toks):
        cur.append(k)
        if re.search(r'[.?!]$', tok): sents.append(cur); cur = []
    if cur: sents.append(cur)
    for sg in sents:
        parts = chunk(sg, toks)
        for p in parts:
            cues.append([base + W[p[0]][1], base + W[p[-1]][2] + 0.3, '\n'.join(lines2([toks[j] for j in p]))])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
for a, b, x in cues: assert b > a
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
REP = [('uno a settanta virgola sette', '1:70,7'), ('settanta virgola sette per cento', '70,7%'), ('cinquanta per cento', '50%'), ('uno a cinquanta', '1:50'), ('uno a cento', '1:100'),
       ('cinquanta diviso zero virgola settecentosette', '50 diviso 0,707'), ('uno virgola quattrocentoquattordici', '1,414'), ('radice di due', '√2')]
txt = "\n".join(out).replace('1:70,7: 50 diviso 0,707.', '1:70,7 (50 diviso 0,707).')
assert 'virgola' not in txt, txt
open('out2/par-04.vtt', 'w').write(txt); print(txt)
