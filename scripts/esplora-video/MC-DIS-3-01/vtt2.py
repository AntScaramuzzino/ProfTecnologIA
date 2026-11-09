import json
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
# per scena: cue = lista di righe (testo esatto della voce, in ordine)
CUES = {
 'hook': [["Perché i binari sembrano unirsi?"], ["Nella prospettiva gli oggetti lontani", "sembrano più piccoli,"], ["e le rette parallele sembrano convergere", "verso un punto."]],
 'misure': [["È la rappresentazione più naturale,", "ma non è fedele alle misure reali."]],
 'confronto': [["Nell'assonometria le misure si conservano,", "o si riducono con un fattore costante."], ["Nella prospettiva vengono deformate,", "per simulare la percezione visiva."]],
 'centrale': [["Nella prospettiva centrale, le rette", "parallele alla direzione di vista"], ["convergono in un unico punto di fuga,", "sulla linea d'orizzonte."]],
 'c12': [["Si parte dalla linea d'orizzonte,", "all'altezza degli occhi;"], ["sulla linea, il punto di fuga."]],
 'c34': [["Disegna la faccia frontale: un rettangolo,", "l'unica faccia con le proporzioni reali."], ["Dai quattro angoli,", "traccia le linee di fuga."]],
 'c56': [["Scegli la profondità, chiudi", "con un rettangolo parallelo al primo,"], ["ed elimina le linee in eccesso."]],
 'accid': [["Per un oggetto visto da un angolo,", "la prospettiva accidentale"], ["usa due punti di fuga:", "uno a destra, uno a sinistra."], ["Solo le verticali restano verticali."]],
 'a13': [["Traccia l'orizzonte e i due punti di fuga."], ["Poi lo spigolo verticale frontale:", "l'unico segmento con la misura reale."]],
 'a46': [["Dai suoi estremi, linee verso i due punti."], ["Segna la profondità, alza", "gli spigoli laterali e chiudi le facce."]],
 'finale': [["Uno o due punti di fuga: così il disegno", "mostra gli oggetti come li vede l'occhio."]],
}
def ts(x): return f"{int(x//3600):02d}:{int(x%3600//60):02d}:{x%60:06.3f}"
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; toks = s['voce'].split(); w = s['parole']; k = 0
    assert len(toks) == len(w)
    for c in CUES[t['id']]:
        n = sum(len(l.split()) for l in c)
        assert ' '.join(toks[k:k+n]) == ' '.join(c), (t['id'], ' '.join(toks[k:k+n]), c)
        for l in c: assert len(l) <= 42 and len(l.split()) > 1, l
        cues.append([base + w[k][1], base + w[k+n-1][2] + 0.3, '\n'.join(c)]); k += n
    assert k == len(toks), t['id']
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i+1][0] - 0.05)
for a, b, _ in cues: assert b > a
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
import os; open(os.environ.get('OUT', 'out') + '/par-03.vtt', 'w').write("\n".join(out)); print(len(cues))
