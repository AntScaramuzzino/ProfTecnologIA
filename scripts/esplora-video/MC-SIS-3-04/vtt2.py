import json, re, sys
PREFIX, OUT = sys.argv[1], sys.argv[2]
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
CH = {
'hook': ["Che lavoro farai?", "Parti da un'altra domanda:\nche cosa ti interessa?"],
'riasec': ["Il modello RIASEC,", "sviluppato tra gli anni\nCinquanta e Settanta,", "è uno dei sistemi di orientamento\npiù usati al mondo."],
'sei': ["Descrive gli interessi delle persone\ncon sei tipi:", "uno per ogni lettera."],
'r': ["Realistico: attività\npratiche e concrete,", "con oggetti, macchine e strumenti,", "come il meccanico\no la tecnica elettronica."],
'i': ["Investigativo: analizzare,\nricercare, risolvere problemi,", "come la scienziata\no l'analista di dati."],
'a': ["Artistico: creatività,\nespressione, originalità,", "in ambienti non strutturati,", "come il designer o la musicista."],
's': ["Sociale: lavorare con le persone,", "insegnare, aiutare, curare,", "come l'insegnante o la psicologa."],
'e': ["Intraprendente: guidare,\npersuadere, organizzare, vendere,", "come la manager o l'imprenditore."],
'c': ["Convenzionale: ambienti strutturati,\nprocedure chiare, precisione,", "come la contabile o l'archivista."],
'codice': ["Ogni persona è una combinazione\ndi questi tipi.", "Il codice è una tripletta,\ni tre tipi più forti in ordine:", "per esempio Investigativo,\nSociale, Artistico."],
'strumento': ["Lo strumento non decide\nla tua professione:", "ti aiuta a capire in quali ambienti\nti senti più a tuo agio", "e quali attività ti motivano."],
'finale': ["Il modello RIASEC:\nsei tipi di interessi per orientarti."],
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
