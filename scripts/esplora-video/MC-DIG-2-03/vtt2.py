import json, re
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
FW = set('di a al il la le i e è un una che da su tra dello del alla ha con per lo come non ma ogni tutti quando qui si fa'.split())
KEEP = [('fuori','sede'),('dischi','rigidi'),('supporti','diversi'),('disco','interno'),('disco','esterno'),('chiavetta','usb'),('sistemi','operativi'),('venti','minuti'),('tempo','reale'),('pochi','secondi'),('al','massimo'),('un','giorno'),('settimane','di'),('di','lavoro'),('per','errore'),('prima','o'),('o','poi'),('tre','copie'),('due','supporti'),('una','copia'),('sistema','operativo'),('scheda','madre'),('parti','meccaniche'),('full','hd'),('più','veloce'),('volte','più'),('cicli','al'),('milioni','di'),('memoria','di'),('quattro','cervelli'),('altre','parti'),('centoventi','milioni'),('due','milioni'),('tre','miliardi'),('ognuna','ha'),('calcoli','semplici')]
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
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; toks = s['voce'].split(); W = s['parole']
    assert len(toks) == len(W)
    # frasi
    sents, cur = [], []
    for k, tok in enumerate(toks):
        cur.append(k)
        if re.search(r'[.?!]$', tok): sents.append(cur); cur = []
    if cur: sents.append(cur)
    for sg in sents:
        parts = chunk(sg, toks)
        for p in parts:
            cues.append([base + W[p[0]][1], base + W[p[-1]][2] + 0.3, [toks[j] for j in p], t['id'], base, W, p])
need = lambda c: 1.0 + 0.3 * len(c[2])
i = 0
while i < len(cues) - 1:
    c, n = cues[i], cues[i + 1]
    short = len(c[2]) <= 4 or len(' '.join(c[2])) / (c[1] - c[0]) > 17
    endsent = bool(re.search(r'[.?!]$', c[2][-1]))
    if short and c[1] - c[0] < need(c) and c[3] == n[3] and (not endsent or len(c[2]) <= 2) and lines2(c[2] + n[2]):
        cues[i] = [c[0], n[1], c[2] + n[2], c[3], c[4], c[5], c[6] + n[6]]; del cues[i + 1]; continue
    if short and not endsent and c[1] - c[0] < need(c) - 0.3 and c[3] == n[3]:  # sposta parole dal cue successivo
        for k in range(1, len(n[6]) - 1):
            p1, p2 = c[6] + n[6][:k], n[6][k:]; base, Wd = c[4], c[5]
            t1 = c[2] + n[2][:k]; t2 = n[2][k:]
            a1, b1 = base + Wd[p1[0]][1], base + Wd[p1[-1]][2] + 0.3; a2, b2 = base + Wd[p2[0]][1], base + Wd[p2[-1]][2] + 0.3
            if lines2(t1) and lines2(t2) and re.search(r'[,:;.?!]$', t1[-1]) and (b1 - a1 >= 1 + 0.3 * len(p1) - 0.3 or len(' '.join(t1)) / (b1 - a1) <= 19):
                cues[i] = [a1, b1, t1, c[3], base, Wd, p1]; cues[i + 1] = [a2, b2, t2, c[3], base, Wd, p2]; break
    i += 1
for i in range(len(cues) - 1):
    if cues[i][1] - cues[i][0] < need(cues[i]): cues[i][1] = max(cues[i][1], min(cues[i][0] + need(cues[i]), cues[i + 1][0] - 0.02))
    cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
for c in cues:
    if c[1] - c[0] < need(c): print('CORTO', round(c[1]-c[0],2), round(need(c),2), ' '.join(c[2]))
cues = [[c[0], c[1], '\n'.join(lines2(c[2]))] for c in cues]
for a, b, x in cues: assert b > a
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
import sys
open(sys.argv[1], 'w').write("\n".join(out)); print("\n".join(out))
