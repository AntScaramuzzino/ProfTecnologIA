import json, numpy as np, wave, glob, re, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
tl = json.load(open('timeline.json')); SR = 48000; N = int((tl['total'] + 0.5) * SR)
sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
v = np.zeros(N)
files = sorted(glob.glob('voce/*.wav'))
for s, f in zip(tl['scenes'], files):
    assert s['id'] in f, (s['id'], f)
    with wave.open(f) as w: a = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768
    i = int((s['start'] + s['L']) * SR); v[i:i + len(a)] += a[:N - i]
with wave.open('voce.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(v, -1, 1) * 32767).astype(np.int16).tobytes())
D = N / SR
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'voce.wav', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,aformat=channel_layouts=stereo', '-t', str(D), 'voce_n.wav'], check=True)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'voce_n.wav', '-i', 'musica.wav', '-filter_complex',
                f'[0:a]apad=whole_dur={D},asplit[v1][v2];[1:a]volume=0.55[m];[m][v2]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[md];[v1][md]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.95',
                '-t', str(D), 'mix.wav'], check=True)
# sottotitoli
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{s:06.3f}"
def wrap(txt, n=42):
    ws = txt.split(); lines = ['']
    for w in ws:
        if lines[-1] and len(lines[-1]) + 1 + len(w) > n: lines.append(w)
        else: lines[-1] = (lines[-1] + ' ' + w).strip()
    return lines
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']
    words = s['parole']; wi = 0
    sents = [x for x in re.split(r'(?<=[.?!])\s+', s['voce']) if x]
    for sent in sents:
        # spezza le frasi lunghe alle virgole/due punti in blocchi da ≤ 2 righe
        parts, cur = [], ''
        for piece in re.split(r'(?<=[,:])\s+', sent):
            cand = (cur + ' ' + piece).strip()
            if cur and len(wrap(cand)) > 2: parts.append(cur); cur = piece
            else: cur = cand
        parts.append(cur)
        for part in parts:
            nw = len(re.findall(r"[\wàèéìòù'’]+", part))
            a = words[wi][1]; wi = min(wi + nw, len(words))
            b = words[wi][1] - 0.15 if wi < len(words) else s['voce_dur'] + 0.4
            cues.append([base + a, base + b, part])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1):
    L = wrap(x); assert len(L) <= 2 and all(len(l) <= 46 for l in L), x
    out += [str(i), f"{ts(a)} --> {ts(b)}", *L, ""]
open('out2/par-02.vtt', 'w').write("\n".join(out))
print('ok', D, len(cues))
