"""Render completo + musica + voce + mix + MP4 + poster + VTT."""
import json, math, os, subprocess, re, wave, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
PREFIX = sys.argv[1]  # es. par-05
tl = json.load(open('timeline.json')); TOT = math.ceil(tl['total'] * 30)
FR = os.environ.get('FRAMES', 'frames'); OUT = os.environ.get('OUT', 'out')
os.makedirs(FR, exist_ok=True); os.makedirs(OUT, exist_ok=True)
W = 3; step = (TOT + W - 1) // W
procs = [subprocess.Popen(['node', 'render.js', str(i * step), str(min(TOT, (i + 1) * step)), '30']) for i in range(W)]
subprocess.run(['python3', 'score.py'], check=True)
# voce
SR = 48000; N = int((tl['total'] + 0.5) * SR); v = np.zeros(N)
files = sorted(f for f in os.listdir('voce') if f.endswith('.wav'))
for s, f in zip(tl['scenes'], files):
    assert s['id'] in f, (s['id'], f)
    with wave.open('voce/' + f) as w: a = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768
    i = int((s['start'] + s['L']) * SR); v[i:i + len(a)] += a[:N - i]
with wave.open('voce.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(v, -1, 1) * 32767).astype(np.int16).tobytes())
D = f"{N / SR:.3f}"
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'voce.wav', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,aformat=channel_layouts=stereo', '-t', D, 'voce_n.wav'], check=True)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'voce_n.wav', '-i', 'musica.wav', '-filter_complex',
                f'[0:a]apad=whole_dur={D},asplit[v1][v2];[1:a]volume=0.55[m];[m][v2]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[md];[v1][md]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.95',
                '-t', D, 'mix.wav'], check=True)
for p in procs: p.wait()
n = len([f for f in os.listdir(FR) if f.endswith('.jpg')]); assert n >= TOT, (n, TOT)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-framerate', '30', '-i', FR + '/%05d.jpg', '-i', 'mix.wav', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
                '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', f'{OUT}/{PREFIX}.mp4'], check=True)
# poster
from PIL import Image
pf = int(float(sys.argv[2]) * 30) if len(sys.argv) > 2 else TOT // 2
Image.open(f'{FR}/{pf:05d}.jpg').resize((1280, 720)).save(f'{OUT}/{PREFIX}-poster.webp', quality=82)
# sottotitoli
sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
FW = set('di a al il la le i e è un una che da su tra dello del alla ha con per lo come non ma ogni tutti quando qui si fa senza tu debba'.split())
KEEP = [('fisso','di'),('sistema','operativo'),('prossima','domanda'),('ciclo','principale'),('numero','fisso'),('mille','volte'),('tre','strutture'),('strutture','fondamentali'),('stesse','istruzioni'),('due','semafori'),('il','verde'),('modo','diverso'),('situazioni','diverse'),('quale','ramo'),('una','condizione'),('vai','avanti'),('sistema','operativo'),('scheda','madre'),('parti','meccaniche'),('full','hd'),('più','veloce'),('volte','più'),('cicli','al'),('milioni','di'),('memoria','di'),('quattro','cervelli'),('altre','parti'),('centoventi','milioni'),('due','milioni'),('tre','miliardi'),('ognuna','ha'),('calcoli','semplici')]
def ts(x): return f"{int(x//3600):02d}:{int(x%3600//60):02d}:{x%60:06.3f}"
def ok_break(toks, k):  # break after toks[k-1]
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
            cues.append([base + W[p[0]][1], base + W[p[-1]][2] + 0.3, '\n'.join(lines2([toks[j] for j in p]))])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
for a, b, x in cues: assert b > a
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
open(f'{OUT}/{PREFIX}.vtt', 'w').write("\n".join(out))

print(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration,size', '-of', 'default=nw=1', f'{OUT}/{PREFIX}.mp4']).decode())
