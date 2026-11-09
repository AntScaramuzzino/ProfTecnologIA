import json, re
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
def ts(x): m = int(x // 60); return f"00:{m:02d}:{x % 60:06.3f}"
L = lambda ws: len(' '.join(ws))
def two_lines(ws):  # divisione bilanciata in max 2 righe
    if L(ws) <= 42: return [ws]
    best = min(range(1, len(ws)), key=lambda k: (max(L(ws[:k]), L(ws[k:])) > 44, abs(L(ws[:k]) - L(ws[k:])) - (8 if re.search(r'[,:;]$', ws[k-1]) else 0)))
    return [ws[:best], ws[best:]]
def chunks(idx, toks):  # frase troppo lunga: spezza alla virgola/due punti più centrale
    if L([toks[i] for i in idx]) <= 86: return [idx]
    cands = [k for k in range(1, len(idx)) if re.search(r'[,:;]$', toks[idx[k-1]])] or list(range(1, len(idx)))
    k = min(cands, key=lambda k: abs(L([toks[i] for i in idx[:k]]) - L([toks[i] for i in idx[k:]])))
    return chunks(idx[:k], toks) + chunks(idx[k:], toks)
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; toks = s['voce'].split(); W = s['parole']
    assert len(toks) == len(W)
    sent, cur = [], []
    for i, tk in enumerate(toks):
        cur.append(i)
        if re.search(r'[.?!]$', tk): sent.append(cur); cur = []
    if cur: sent.append(cur)
    for se in sent:
        for ch in chunks(se, toks):
            ws = [toks[i] for i in ch]
            cues.append([base + W[ch[0]][1], base + W[ch[-1]][2] + 0.25, '\n'.join(' '.join(l) for l in two_lines(ws))])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
open(__import__('os').environ.get('OUT','out')+'/par-05.vtt', 'w').write("\n".join(out))
print("\n".join(out))
for a,b,x in cues: assert all(len(l)<=46 for l in x.split('\n')) and x.count('\n')<=1 and b>a, x
