import json, numpy as np, wave, glob, re, subprocess
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
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", "voce.wav", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,aformat=channel_layouts=stereo", "-t", str(D), "voce_n.wav"], check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", "voce_n.wav", "-i", "musica.wav", "-filter_complex",
                f"[0:a]apad=whole_dur={D},asplit[v1][v2];[1:a]volume=0.55[m];[m][v2]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[md];[v1][md]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.95",
                "-t", str(D), "mix.wav"], check=True)
# sottotitoli per frase, senza sovrapposizioni
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{s:06.3f}"
cues = []
def wrap(txt):
    if len(txt) <= 42: return txt
    ws = txt.split(); best = None
    for k in range(1, len(ws)):
        l1, l2 = ' '.join(ws[:k]), ' '.join(ws[k:])
        if len(l1) <= 46 and len(l2) <= 46:
            sc = abs(len(l1) - len(l2)) - (30 if l1[-1] in ',:;' else 0) - (10 if ws[k] in ('e', 'o', 'ma') else 0)
            if best is None or sc < best[0]: best = (sc, l1 + '\n' + l2)
    return best[1] if best else txt
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; words = s['parole']
    toks = s['voce'].split()  # token di testo allineati alle parole del TTS
    assert len(toks) == len(words), (t['id'], len(toks), len(words))
    phrases, cur = [], []
    for i, tk in enumerate(toks):
        cur.append(i)
        if tk[-1] in ',.;:?!' or i == len(toks) - 1: phrases.append(cur); cur = []
    groups, g = [], []
    for ph in phrases:
        cand = g + ph
        if g and len(' '.join(toks[j] for j in cand)) > 84: groups.append(g); g = list(ph)
        else: g = cand
        if toks[ph[-1]][-1] in '.?!': groups.append(g); g = []
    if g: groups.append(g)
    for gi in groups:
        a0 = words[gi[0]][1]; last = gi[-1]
        b0 = words[last + 1][1] - 0.15 if last + 1 < len(words) else s['voce_dur'] + 0.4
        cues.append([base + a0, base + b0, wrap(' '.join(toks[j] for j in gi))])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
open("out2/par-02.vtt", "w").write("\n".join(out))
print("ok", D, len(cues))
