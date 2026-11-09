"""WebVTT con cue scritti a mano (righe separate da |), tempi dalle parole TTS."""
import json, sys
PREFIX, OUT = sys.argv[1], sys.argv[2]
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
CUES = {
 'hook': ["In una famiglia italiana,", "il riscaldamento consuma|dal sessanta al settanta per cento", "dell'energia totale.", "Come funziona?"],
 'circuito': ["Nel sistema più diffuso,", "la caldaia scalda l'acqua|tra sessanta e ottanta gradi,", "e una pompa la fa circolare nei tubi,|fino ai radiatori di ogni stanza."],
 'radiatori': ["I radiatori cedono il calore all'aria,|per irraggiamento e convezione."],
 'ritorno': ["Poi l'acqua, raffreddata,", "torna alla caldaia|per essere riscaldata di nuovo."],
 'termostato': ["Il termostato misura la temperatura|dell'aria nella stanza", "e comanda la caldaia."],
 'onoff': ["Quando la temperatura scende|sotto il valore impostato,", "la caldaia si accende.", "Quando lo raggiunge, si spegne."],
 'duegradi': ["Abbassare il termostato|da ventidue a venti gradi", "riduce la bolletta|di circa il dodici per cento."],
 'valvole': ["Le valvole termostatiche regolano|l'acqua calda di ogni radiatore:", "così le stanze già calde|non continuano a essere riscaldate.", "Risparmio medio:|dal dieci al venti per cento."],
 'pdc': ["La pompa di calore non brucia nulla:", "con l'energia elettrica sposta il calore|dall'esterno all'interno,", "come un frigorifero al contrario."],
 'cop': ["Con un COP di tre,", "per ogni kilowattora|di elettricità consumata,", "produce tre kilowattora di calore."],
 'costi': ["Per mille kilowattora di calore:", "stufa elettrica, trecento euro;|caldaia a gas, centoventisei;", "pompa di calore, cento."],
 'finale': ["Capire come funziona il riscaldamento", "aiuta a capire dove vanno|i soldi della bolletta."],
}
def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; toks = s['voce'].split(); W = s['parole']; k = 0
    assert len(toks) == len(W)
    for c in CUES[t['id']]:
        n = len(c.replace('|', ' ').split()); assert ' '.join(toks[k:k + n]) == c.replace('|', ' '), (c, toks[k:k + n])
        lines = c.split('|'); assert len(lines) <= 2 and all(len(l) <= 42 for l in lines) and all(len(l.split()) > 1 for l in lines), c
        cues.append([base + W[k][1], base + W[k + n - 1][2] + 0.3, '\n'.join(lines)]); k += n
    assert k == len(toks), t['id']
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
for i, c in enumerate(cues): assert c[1] > c[0] + 0.6 and (i == 0 or c[0] >= cues[i - 1][1]), c
out = ['WEBVTT', '']
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f'{ts(a)} --> {ts(b)}', x, '']
open(f'{OUT}/{PREFIX}.vtt', 'w').write('\n'.join(out)); print(len(cues), 'cue', max(len(l) for c in cues for l in c[2].split('\n')))
