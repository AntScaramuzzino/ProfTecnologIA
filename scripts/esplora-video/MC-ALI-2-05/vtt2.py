import json, re
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
def ts(x): return f"{int(x//3600):02d}:{int(x%3600//60):02d}:{x%60:06.3f}"
def txt(ix, toks): return ' '.join(toks[j] for j in ix)
def balance(ix, toks):
    if len(txt(ix, toks)) <= 42: return [ix]
    best = None
    for k in range(1, len(ix)):
        a, b = txt(ix[:k], toks), txt(ix[k:], toks)
        if len(a) <= 42 and len(b) <= 42:
            sc_ = abs(len(a) - len(b)) - (12 if re.search(r'[,:;]$', toks[ix[k-1]]) else 0)
            if best is None or sc_ < best[0]: best = (sc_, k)
    return [ix[:best[1]], ix[best[1]:]] if best else None
def chunks(ix, toks):
    if balance(ix, toks): return [ix]
    # spezza alla virgola/due punti più centrale
    cands = [k for k in range(1, len(ix)) if re.search(r'[,:;]$', toks[ix[k-1]])]
    k = min(cands, key=lambda k: abs(k - len(ix)/2))
    return chunks(ix[:k], toks) + chunks(ix[k:], toks)
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; toks = s['voce'].split(); w = s['parole']
    assert len(toks) == len(w)
    sent, cur = [], []
    for k, tok in enumerate(toks):
        cur.append(k)
        if re.search(r'[.?!]$', tok): sent.append(cur); cur = []
    if cur: sent.append(cur)
    for se in sent:
        for ch in chunks(se, toks):
            cues.append([base + w[ch[0]][1], base + w[ch[-1]][2] + 0.25, '\n'.join(txt(l, toks) for l in balance(ch, toks))])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i+1][0] - 0.02)
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
open('out2/par-03.vtt', 'w').write("\n".join(out))
