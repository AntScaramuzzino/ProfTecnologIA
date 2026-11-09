"""Render completo + musica + voce + mix + MP4 + poster + VTT."""
import json, math, os, subprocess, re, wave, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
PREFIX = sys.argv[1]  # es. par-05
tl = json.load(open('timeline.json')); TOT = math.ceil(tl['total'] * 30)
FR = os.environ.get('FRAMES', 'frames'); OUT = os.environ.get('OUT', 'out')
os.makedirs(FR, exist_ok=True); os.makedirs(OUT, exist_ok=True)
W = 3; step = (TOT + W - 1) // W
procs = []
pass
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
print(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration,size', '-of', 'default=nw=1', f'{OUT}/{PREFIX}.mp4']).decode())
