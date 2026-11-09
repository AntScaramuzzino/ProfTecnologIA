import json, re, sys
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
FW = set('di a al il la le i e è un una che da su tra del alla ha con per lo come non ma se o ogni sono in gli agli'.split())
KEEP = [('ordini','di'),('fase','esponenziale'),('asse','troncato'),("l'asse",'troncato'),('scala','logaritmica'),('correlazione','spuria'),('ragioni','statistiche'),("l'asse",'verticale'),('in','modo'),('modo','lineare'),('modo','esponenziale'),('luce','esterna'),('a','vicenda'),('variabili','che'),('955','a'),('a','970'),('970','milioni'),('950','milioni'),('di','notte'),('in','casa'),('due','fattori'),('sei','cifre'),('trenta','secondi'),('secondo','fattore'),('posto','sicuro'),('codici','di'),('alcuni','casi'),('secondo','livello')]
def ts(x): return f"{int(x//3600):02d}:{int(x%3600//60):02d}:{x%60:06.3f}"
def ok_break(toks, k):
    a, b = toks[k-1].lower().strip(',.:;?'), toks[k].lower().strip(',.:;?')
    if a in FW or (a, b) in KEEP: return False
    return k >= 2 and len(toks) - k >= 2
def lines2(toks):
    s = ' '.join(toks)
    if len(s) <= 42: return [s]
    best = None
    for k in range(1, len(toks)):
        l1, l2 = ' '.join(toks[:k]), ' '.join(toks[k:])
        if len(l1) > 42 or len(l2) > 42 or not ok_break(toks, k): continue
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
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; vt = s.get('voce_tts', s['voce']).split(); W = s['parole']
    # allinea i token della voce (con punteggiatura) alle parole TTS (che possono unire più token)
    toks, k = [], 0
    for w in W:
        target = re.sub(r'\W', '', w[0].lower()); acc = []
        while re.sub(r'\W', '', ' '.join(acc).lower()) != target:
            acc.append(vt[k]); k += 1
        toks.append(' '.join(acc))
    assert k == len(vt), t['id']
    if 'voce_tts' in s:  # ricompone i token letti per esteso nella forma scritta
        disp = s['voce'].split()
        for src, dst in s.get('map', []):
            seq = src.split(); n = len(seq); i = 0
            while i < len(toks):
                if toks[i:i+n] == seq:
                    toks[i:i+n] = [dst]; W = W[:i] + [[dst, W[i][1], W[i+n-1][2]]] + W[i+n:]
                i += 1
        assert toks == disp, (toks, disp)
    sents, cur = [], []
    for i, tok in enumerate(toks):
        cur.append(i)
        if re.search(r'[.?!]$', tok): sents.append(cur); cur = []
    if cur: sents.append(cur)
    for sg in sents:
        for p in chunk(sg, toks):
            cues.append([base + W[p[0]][1], base + W[p[-1]][2] + 0.3, '\n'.join(lines2([toks[j] for j in p]))])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
for a, b, x in cues: assert b > a
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
open(sys.argv[1], 'w').write("\n".join(out)); print("\n".join(out))
