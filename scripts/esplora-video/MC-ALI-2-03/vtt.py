import json, re
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{s:06.3f}"
J = lambda toks: ' '.join(toks).replace('pi acca', 'pH')
def lines2(toks):  # miglior divisione in <=2 righe da <=42, preferendo dopo virgola e righe bilanciate
    if len(J(toks)) <= 42: return [J(toks)]
    best = None
    for k in range(1, len(toks)):
        a, b = J(toks[:k]), J(toks[k:])
        if len(a) > 42 or len(b) > 42: continue
        sc_ = abs(len(a) - len(b)) - (15 if toks[k-1].endswith(',') else 0)
        if best is None or sc_ < best[0]: best = (sc_, [a, b])
    return best[1] if best else None
def split(idx, toks):
    if lines2([toks[i] for i in idx]): return [idx]
    cands = [k for k in range(1, len(idx)) if toks[idx[k-1]].endswith((',', ':'))] or list(range(1, len(idx)))
    k = min(cands, key=lambda k: abs(len(J([toks[i] for i in idx[:k]])) - len(J([toks[i] for i in idx[k:]]))))
    return split(idx[:k], toks) + split(idx[k:], toks)
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; toks = s['voce'].split(); w = s['parole']
    assert len(toks) == len(w)
    sent, cur = [], []
    for i, tk in enumerate(toks):
        cur.append(i)
        if re.search(r'[.?!]$', tk): sent.append(cur); cur = []
    if cur: sent.append(cur)
    for se in sent:
        for g in split(se, toks):
            cues.append([base + w[g[0]][1], base + w[g[-1]][2] + 0.3, '\n'.join(lines2([toks[i] for i in g]))])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
open('out2/par-01.vtt', 'w').write("\n".join(out)); print("\n".join(out))
