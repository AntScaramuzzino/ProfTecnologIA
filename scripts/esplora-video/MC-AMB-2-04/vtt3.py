"""WebVTT: cue spezzati su virgole/fine frase, max 2 righe da 42, coppie inseparabili, tempi hh:mm:ss.mmm crescenti."""
import json, re, sys
PREFIX, OUT = sys.argv[1], sys.argv[2]
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
KEEP = [('della', 'finestra'), ('di', 'latitudine'), ('solstizio', "d'estate"), ('solstizio', "d'inverno"), ('la', 'latitudine'), ('la', 'declinazione'), ('controllo', 'climatico'), ('climatico', 'passivo'), ('in', 'profondità'), ('giusta', 'profondità'), ('del', 'tetto'), ('la', 'finestra'), ('a', 'memoria'), ('il', 'principio'), ('geometria', 'solare'), ('quasi', 'verticale'), ('quasi', 'orizzontale'), ('molto', 'basso'), ('di', 'differenza'), ('ventuno', 'marzo'), ('ventuno', 'settembre'), ('ventuno', 'dicembre'), ('ventuno', 'giugno'), ('forme', 'geometriche'), ('profilo', 'nutrizionale'), ('con', 'i'), ('i', 'nutrienti'), ('stampa', '3D'), ('3D', 'alimentare'), ('3D', 'tradizionale'), ('di', 'massa'), ('a', 'mano'), ('a', 'deglutire'), ('al', 'ragù')]
REPL = [(p.split(), r) for p, r in [('quarantadue gradi', '42°'), ('settantuno gradi e mezzo', '71,5°'), ('quarantotto gradi', '48°'), ('ventiquattro gradi e mezzo', '24,5°'),
  ('novanta gradi', '90°'), ('più ventitré e mezzo', '+23,5°'), ('meno ventitré e mezzo', '−23,5°'), ('quarantacinque gradi', '45°'), ('sessantotto gradi e mezzo', '68,5°'),
  ('ventuno e mezzo', '21,5°'), ('Quarantasette gradi', '47°'), ('ventuno giugno', '21 giugno'), ('ventuno marzo', '21 marzo'), ('ventuno settembre', '21 settembre'), ('ventuno dicembre', '21 dicembre')]]
def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"
def L(toks, ix): return len(' '.join(toks[j] for j in ix))
def split_line(toks, ix):  # spezza un gruppo troppo lungo nel punto più centrale consentito
    if L(toks, ix) <= 42: return [ix]
    best = None
    for c in range(1, len(ix)):
        a, b = toks[ix[c - 1]].strip(',.:;?!'), toks[ix[c]]
        if (a, b) in KEEP: continue
        l1, l2 = L(toks, ix[:c]), L(toks, ix[c:])
        if l1 <= 42 and l2 <= 42 and (best is None or abs(l1 - l2) < best[0]): best = (abs(l1 - l2), c)
    if best: return [ix[:best[1]], ix[best[1]:]]
    # serve più di 2 righe: prima riga la più lunga possibile (consentita), poi ricorsione
    for c in range(len(ix) - 1, 0, -1):
        if L(toks, ix[:c]) <= 42 and (toks[ix[c - 1]].strip(',.:;?!'), toks[ix[c]]) not in KEEP: return [ix[:c]] + split_line(toks, ix[c:])
    raise AssertionError(' '.join(toks[j] for j in ix))
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; toks = s['voce'].split(); W = s['parole']
    assert len(toks) == len(W), t['id']
    W = [list(x) for x in W]
    for ph, rep in REPL:
        n = len(ph); k = 0
        while k + n <= len(toks):
            if [x.strip(',.:;?!') for x in toks[k:k + n]] == ph:
                tail = toks[k + n - 1][len(ph[-1]):]
                toks[k:k + n] = [rep + tail]; W[k:k + n] = [[rep, W[k][1], W[k + n - 1][2]]]
            k += 1
    # frasi -> chunk sulle virgole/due punti
    chunks, cur = [], []
    for k, tok in enumerate(toks):
        cur.append(k)
        if re.search(r'[,:;.?!]$', tok): chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    # unisci chunk molto brevi (<= 12 car.) al successivo se ci stanno in una riga
    merged = []
    for ch in chunks:
        if merged and L(toks, merged[-1]) <= 12 and not re.search(r'[.?!]$', toks[merged[-1][-1]]) and L(toks, merged[-1] + ch) <= 42: merged[-1] = merged[-1] + ch
        else: merged.append(ch)
    groups, g = [], []
    for ch in merged:
        lines = split_line(toks, ch)
        if g and (len(g) + len(lines) > 2 or re.search(r'[.?!]$', toks[g[-1][-1]])): groups.append(g); g = []
        g += lines
        while len(g) > 2: groups.append(g[:2]); g = g[2:]
    if g: groups.append(g)
    for g in groups:
        a = base + W[g[0][0]][1]; b = base + W[g[-1][-1]][2] + 0.25
        cues.append([a, b, '\n'.join(' '.join(toks[j] for j in ln) for ln in g)])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
for i, c in enumerate(cues):
    assert c[1] > c[0] and (i == 0 or c[0] >= cues[i - 1][1]), c
    assert all(len(x) <= 42 for x in c[2].split('\n')) and c[2].count('\n') <= 1, c
out = ['WEBVTT', '']
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f'{ts(a)} --> {ts(b)}', x, '']
open(f'{OUT}/{PREFIX}.vtt', 'w').write('\n'.join(out)); print(len(cues), 'cue')
