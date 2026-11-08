import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
PREFIX = sys.argv[1]; OUT = os.environ.get('OUT', 'out')
tl = json.load(open('timeline.json'))
# sottotitoli
sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{s:06.3f}"
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']
    toks = s['voce'].split(); words = s['parole']
    assert len(toks) == len(words), (t['id'], len(toks), len(words))
    # segmenti: si chiude a ogni segno di punteggiatura, o prima di superare 42 caratteri
    segs, cur = [], []
    for k, tok in enumerate(toks):
        if cur and len(' '.join(toks[j] for j in cur + [k])) > 42:
            segs.append(cur); cur = []
        cur.append(k)
        if re.search(r'[.,;:?!]$', tok): segs.append(cur); cur = []
    if cur: segs.append(cur)
    # unisci segmenti brevi nella stessa riga (<= 42) e fino a 2 righe per cue, senza scavalcare la fine frase
    lines = []
    for sg in segs:
        if lines and not re.search(r'[.?!]$', toks[lines[-1][-1]]) and len(' '.join(toks[j] for j in lines[-1] + sg)) <= 42:
            lines[-1] = lines[-1] + sg
        else:
            lines.append(sg)
    groups, g = [], []
    for ln in lines:
        g.append(ln)
        if len(g) == 2 or re.search(r'[.?!]$', toks[ln[-1]]): groups.append(g); g = []
    if g: groups.append(g)
    for g in groups:
        first, last = g[0][0], g[-1][-1]
        a = words[first][1]; b2 = words[last][2] + 0.25
        cues.append([base + a, base + b2, '\n'.join(' '.join(toks[j] for j in ln) for ln in g)])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
open(f'{OUT}/{PREFIX}.vtt', 'w').write("\n".join(out))
