import json, re, sys
PREFIX, OUT = sys.argv[1], sys.argv[2]
tl = json.load(open('timeline.json')); sc = {s['id']: s for s in json.load(open('scaletta.json'))['scene']}
CH = {
'hook': ["Carichi una pagina web\ncon uno spazio pubblicitario.", "Chi decide quale annuncio comparirà lì?"],
'programmatica': ["Lo decide la pubblicità programmatica:", "il sistema automatizzato con cui\nsi compra e si vende", "la stragrande maggioranza\ndella pubblicità digitale."],
'slot': ["Passo uno:\nla pagina si carica nel tuo browser.", "Lo spazio pubblicitario è ancora vuoto:\nuno slot da riempire."],
'richiesta': ["Passo due: il browser invia\nuna richiesta all'ad server del sito.", "Dentro ci sono sito, orario,\ntipo di dispositivo, indirizzo IP,", "da cui si deduce la posizione,\ne soprattutto il tuo ID pubblicitario."],
'idpub': ["È un codice pseudonimo,", "che i broker di dati usano per collegare\nla tua navigazione a un profilo."],
'asta': ["Passo tre:\nl'ad server lancia un'asta in tempo reale.", "In una frazione di secondo,\ncentinaia di inserzionisti", "ricevono la scheda della tua richiesta."],
'dsp': ["Ogni inserzionista affida l'offerta\na un sistema automatico, la DSP,", "che decide quanto offrire per quello slot,\nin quel momento."],
'vince': ["Passo quattro:\nl'offerta più alta vince.", "L'annuncio viene inviato al browser\ne appare nello spazio vuoto."],
'tempo': ["Passo cinque: tutto questo avviene\ntra 100 e 200 millisecondi,", "molto prima che la pagina\nabbia finito di caricarsi."],
'broker': ["Chi conosce il tuo profilo?", "Il nodo centrale sono i data broker:", "comprano, aggregano e rivendono\ndati su di te, da centinaia di fonti."],
'finale': ["Pubblicità programmatica:\nun'asta in una frazione di secondo."],
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
