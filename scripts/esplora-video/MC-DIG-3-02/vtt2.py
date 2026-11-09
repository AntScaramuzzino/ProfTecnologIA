import json, re, sys
PREFIX, OUT = sys.argv[1], sys.argv[2]
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
CH = {
'hook': ["Fai una domanda a un chatbot:", "la risposta compare un pezzo alla volta.", "Come viene costruita?"],
'llm': ["Dietro c'è un LLM:", "una rete neurale addestrata\nsu enormi quantità di testo", "per predire il token successivo."],
'token': ["Il testo non viene elaborato\nparola per parola,", "ma scomposto in token:", "unità che possono essere\npiù piccole di una parola."],
'bio': ["Tecnologia potrebbe essere\nun solo token.", "Biotecnologia potrebbe essere due:\nbio più tecnologia."],
'prob': ["Dato un prompt, il modello calcola,", "per ogni possibile token successivo,", "la probabilità che compaia\nin quella posizione."],
'sceglie': ["Poi sceglie un token\ncon alta probabilità,", "lo aggiunge al testo\ne ripete il processo."],
'volta': ["Così la risposta nasce\nun token alla volta,", "ognuno condizionato\nda tutti i token precedenti."],
'bassa': ["Il parametro temperature regola\nquanto è casuale la scelta.", "Vicina a zero: quasi sempre\nil token più probabile,", "risposte prevedibili."],
'alta': ["Vicina a uno: più casualità.", "Risposte più creative,\nma meno accurate."],
'capisce': ["Ma il modello non capisce.", "Impara correlazioni statistiche\ntra token,", "e non ha un modello interno del mondo."],
'roma': ["Non sa che Roma è in Italia\ncome lo sai tu:", "sa che Roma e Italia compaiono\nspesso insieme nei testi.", "Per questo può inventare\nfatti che suonano credibili."],
'finale': ["Un LLM non capisce:\npredice il token successivo."],
}
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{s:06.3f}"
norm = lambda x: re.sub(r"[^\w]", '', x.lower())
cues = []
for t in tl['scenes']:
    s = sc[t['id']]; base = t['start'] + t['L']; P = s['parole']
    assert norm(' '.join(CH[t['id']])) == norm(s['voce']), t['id']
    k = 0
    for c in CH[t['id']]:
        target = norm(c); acc = ''; i0 = k
        while acc != target: acc += norm(P[k][0]); k += 1; assert len(acc) <= len(target), (t['id'], c)
        for ln in c.split('\n'): assert len(ln) <= 42, ln; assert len(ln.split()) >= 2, ln
        cues.append([base + P[i0][1], base + P[k - 1][2] + 0.3, c])
    assert k == len(P)
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
out = ["WEBVTT", ""]
for i, (a, b, x) in enumerate(cues, 1): out += [str(i), f"{ts(a)} --> {ts(b)}", x, ""]
open(f'{OUT}/{PREFIX}.vtt', 'w').write("\n".join(out)); print(len(cues), 'cues, max', max(b - a for a, b, _ in cues))
