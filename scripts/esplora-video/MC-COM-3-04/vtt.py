import json, re, sys
PREFIX = sys.argv[1]
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
NB = {'un','una','il','la','i','le','lo','gli','di','da','a','in','con','su','per','e','se','ne','numero','nell\'ordine','al','del','si','che','non','tempo','veri','dati','indirizzi'}
norm = lambda x: re.sub(r"[^\w]", '', x.lower())
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{s:06.3f}"
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']
    toks = s['voce'].split(); tt = []; k = 0
    for w, a, b in s['parole']:
        target, acc = norm(w), ''
        while acc != target:
            acc += norm(toks[k]); tt.append([a, b]); k += 1
            assert len(acc) <= len(target), (t['id'], w, acc)
    assert k == len(toks), t['id']
    # frasi
    sents, cur = [], []
    for i, tok in enumerate(toks):
        cur.append(i)
        if re.search(r'[.?!]$', tok) or i == len(toks) - 1: sents.append(cur); cur = []
    L = lambda ids: len(' '.join(toks[j] for j in ids))
    def split2(ids):  # due righe bilanciate, seconda riga >= 2 parole
        best = None
        for c in range(1, len(ids) - 1):
            a, b = ids[:c], ids[c:]
            if L(a) > 42 or L(b) > 42 or toks[a[-1]].lower() in NB or (len(a) > 1 and re.search(r'[,:;]$', toks[a[-2]])): continue
            sc_ = abs(L(a) - L(b)) - (30 if re.search(r'[,:;]$', toks[a[-1]]) else 0)
            if best is None or sc_ < best[0]: best = (sc_, a, b)
        return best
    for ids in sents:
        chunks = [ids]
        if L(ids) > 84 or (L(ids) > 42 and not split2(ids)):
            # spezza a virgola/due punti più centrale
            cand = [c for c in range(1, len(ids)) if re.search(r'[,:;]$', toks[ids[c - 1]])]
            if cand:
                c = min(cand, key=lambda c: abs(L(ids[:c]) - L(ids[c:])))
                chunks = [ids[:c], ids[c:]]
        def fit(ch):
            if L(ch) <= 42 or split2(ch): return [ch]
            cand = [c for c in range(2, len(ch) - 1) if toks[ch[c - 1]].lower() not in NB]
            ok = [c for c in cand if L(ch[:c]) <= 42 or split2(ch[:c])]
            c = max(ok, key=lambda c: L(ch[:c])) if ok else min(cand, key=lambda c: abs(L(ch[:c]) - L(ch[c:])))
            return fit(ch[:c]) + fit(ch[c:])
        chunks = [x for ch in chunks for x in fit(ch)]
        for ch in chunks:
            if L(ch) <= 42: lines = [ch]
            else:
                b = split2(ch); lines = [b[1], b[2]]
            cues.append([base + tt[ch[0]][0], base + tt[ch[-1]][1] + 0.25, '\n'.join(' '.join(toks[j] for j in ln) for ln in lines)])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
open(f'out2/{PREFIX}.vtt', 'w').write("\n".join(out)); print("\n".join(out))
