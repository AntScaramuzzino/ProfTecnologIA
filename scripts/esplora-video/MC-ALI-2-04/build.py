import json, math, os, subprocess, re, wave, sys
import numpy as np
os.chdir(os.path.dirname(os.path.abspath(__file__)))
PREFIX = sys.argv[1]; POSTER_T = float(sys.argv[2])
tl = json.load(open('timeline.json')); TOT = math.ceil(tl['total'] * 30)
W = 3; step = (TOT + W - 1) // W
procs = [subprocess.Popen(['node', 'render.js', str(i * step), str(min(TOT, (i + 1) * step)), '30']) for i in range(W)]
subprocess.run(['python3', 'score.py'], check=True)
SR = 48000; N = int((tl['total'] + 0.5) * SR); v = np.zeros(N)
sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
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
                f'[0:a]apad=whole_dur={D},asplit[v1][v2];[1:a]apad=whole_dur={D},volume=0.55[m];[m][v2]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[md];[v1][md]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.95',
                '-t', D, 'mix.wav'], check=True)
for p in procs: p.wait()
n = len([f for f in os.listdir('frames') if f.endswith('.jpg')]); assert n >= TOT, (n, TOT)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-framerate', '30', '-i', 'frames/%05d.jpg', '-i', 'mix.wav', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
                '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', f'out2/{PREFIX}.mp4'], check=True)
from PIL import Image
Image.open(f'frames/{int(POSTER_T * 30):05d}.jpg').resize((1280, 720), Image.LANCZOS).save(f'out2/{PREFIX}-poster.webp', quality=85)
# VTT: una frase per cue, max 2 righe da ~42
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{s:06.3f}"
def wrap(txt, n=42):
    lines = ['']
    for w in txt.split():
        if lines[-1] and len(lines[-1]) + 1 + len(w) > n: lines.append(w)
        else: lines[-1] = (lines[-1] + ' ' + w).strip()
    return lines
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; words = s['parole']; wi = 0
    for sent in [x for x in re.split(r'(?<=[.?!])\s+', s['voce']) if x]:
        parts, cur = [], ''
        for piece in re.split(r'(?<=[,:])\s+', sent):
            cand = (cur + ' ' + piece).strip()
            if cur and len(wrap(cand)) > 2: parts.append(cur); cur = piece
            else: cur = cand
        parts.append(cur)
        for part in parts:
            nw = len(re.findall(r"[\wàèéìòù'’]+", part))
            a = words[wi][1]; last = min(wi + nw, len(words)) - 1; wi = last + 1
            b = words[last][2] + 0.3
            cues.append([base + a, base + b, part])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1):
    L = wrap(x); assert len(L) <= 2 and all(len(l) <= 46 for l in L), x
    out += [str(i), f"{ts(a)} --> {ts(b)}", *L, ""]
open(f'out2/{PREFIX}.vtt', 'w').write("\n".join(out))
print(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,duration', '-of', 'csv=p=0', f'out2/{PREFIX}.mp4']).decode())
