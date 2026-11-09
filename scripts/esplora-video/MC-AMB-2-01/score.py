import json, numpy as np, wave
tl = json.load(open('timeline.json')); TOT = tl['total'] + 0.5; SR = 48000
N = int(TOT * SR); out = np.zeros(N); t = np.arange(N) / SR
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def env(n, a, r):
    e = np.ones(n); ai = int(a * SR); ri = int(r * SR)
    e[:ai] = np.linspace(0, 1, ai); e[-ri:] *= np.linspace(1, 0, ri); return e
def add(start, sig):
    i = int(start * SR)
    if i >= N: return
    j = min(N, i + len(sig)); out[i:j] += sig[:j - i]
BAR = 60 / 92 * 4  # 92 bpm, 4/4
chords = [[53, 57, 60, 64], [50, 57, 60, 65], [46, 53, 57, 62], [48, 55, 60, 64]]  # Fmaj7, Dm7, Bbmaj7(sus), C
nb = int(TOT / BAR) + 1
starts = {s['id']: s['start'] for s in tl['scenes']}
drum_a, drum_b = starts['isolatori'] + 1.0, starts['finale']
for b in range(nb):
    c = chords[b % 4]; t0 = b * BAR; n = int((BAR + 1.2) * SR); tt = np.arange(n) / SR
    pad = sum(np.sin(2 * np.pi * midi(m + 12) * tt * d) for m in c for d in (0.997, 1.003)) / 8
    add(t0, pad * env(n, 1.0, 1.4) * 0.16)
    bass = np.sin(2 * np.pi * midi(c[0] - 12) * tt) + 0.3 * np.sin(4 * np.pi * midi(c[0] - 12) * tt)
    add(t0, bass * env(n, 0.05, 1.5) * np.exp(-tt * 0.6) * 0.14)
    # piano elettrico: arpeggio in crome
    for k in range(8):
        m = c[[0, 2, 1, 3, 2, 3, 1, 2][k]] + 24; nn = int(1.2 * SR); x = np.arange(nn) / SR
        ep = (np.sin(2 * np.pi * midi(m) * x) + 0.25 * np.sin(4 * np.pi * midi(m) * x) * np.exp(-x * 6)) * np.exp(-x * 3.2)
        add(t0 + k * BAR / 8, ep * env(nn, 0.004, 0.2) * (0.05 if k % 2 else 0.065))
    # batteria leggera solo al centro
    for k in range(4):
        tb = t0 + k * BAR / 4
        if drum_a <= tb < drum_b:
            if k in (0, 2):
                nn = int(0.35 * SR); x = np.arange(nn) / SR
                add(tb, np.sin(2 * np.pi * (45 + 60 * np.exp(-x * 25)) * x) * np.exp(-x * 9) * 0.22)
            nn = int(0.06 * SR); rng = np.random.default_rng(b * 4 + k)
            add(tb + BAR / 8, rng.standard_normal(nn) * np.exp(-np.arange(nn) / SR * 60) * 0.025)
# accordo pieno sul cartello finale
fin = starts['finale'] + 0.3; n = int((TOT - fin) * SR); tt = np.arange(n) / SR
full = sum(np.sin(2 * np.pi * midi(m) * tt) for m in [41, 53, 57, 60, 64, 65, 69]) / 7
add(fin, full * env(n, 0.3, 2.5) * 0.22)
# effetti morbidi sui tagli: un "tick" di campanella a ogni cambio scena
for s in tl['scenes'][1:]:
    nn = int(0.5 * SR); x = np.arange(nn) / SR
    add(s['start'], np.sin(2 * np.pi * 1760 * x) * np.exp(-x * 14) * 0.03)
# dissolvenza finale
fo = int(2.0 * SR); out[-fo:] *= np.linspace(1, 0, fo)
out = out / np.max(np.abs(out)) * 0.6
st = np.stack([out, out], 1)
with wave.open('musica.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print('ok', TOT)
