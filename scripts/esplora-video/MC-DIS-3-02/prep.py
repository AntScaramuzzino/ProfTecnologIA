"""Scaletta -> voce (tts) -> tempi parole -> data.js.
Sintassi voce: token normali separati da spazi; {mostrato=detto} per token con pronuncia diversa
(il lato 'mostrato' puo' contenere spazi: e' un solo token di sottotitolo)."""
import json, re, subprocess, os, asyncio, sys, certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
os.chdir(os.path.dirname(os.path.abspath(__file__)))
CAPS = ['SLICER', 'LAYER', 'INFILL', 'SUPPORTI', 'MATERIALE']
S = [
 dict(id='hook', cap=0, registro='scuro', didascalia='Solo il primo passo', corallo='',
      voce="Il file {STL=esse-ti-elle} è solo il primo passo: prima di stampare, passa da un software chiamato {slicer=slàiser}."),
 dict(id='affetta', cap=1, registro='scuro', didascalia='Centinaia di strati sottili', corallo='',
      voce="{Slicer=Slàiser} vuol dire affettatore: taglia il modello in centinaia o migliaia di strati sottili."),
 dict(id='gcode', cap=1, registro='scuro', didascalia='Istruzioni per la testina', corallo='',
      voce="Per ogni strato genera le istruzioni di movimento della testina: il file {G-code=gi-coud}."),
 dict(id='layer', cap=2, registro='chiaro', didascalia='Liscio ma lento', corallo='',
      voce="L'altezza del {layer=lèier} è lo spessore di ogni strato. Con {0,1 mm=zero virgola uno} è molto liscio, ma serve molto più tempo."),
 dict(id='layer2', cap=2, registro='chiaro', didascalia='0,2 mm: il compromesso', corallo='',
      voce="Con {0,3 mm=zero virgola tre} è più veloce, ma si vedono le rigature. Per oggetti funzionali, {0,2 mm=zero virgola due} è spesso il compromesso."),
 dict(id='infill', cap=3, registro='scuro', didascalia='100%: solido, pesante', corallo='',
      voce="{L'infill=L'ìnfil} è la percentuale di volume interno riempita. Al {100%=cento per cento} l'oggetto è solido, ma pesante, e usa molto materiale."),
 dict(id='infill2', cap=3, registro='scuro', didascalia='20%: molto più leggero', corallo='',
      voce="Al {20%=venti per cento} è molto più leggero, con una buona resistenza: dentro c'è una griglia o un nido d'ape."),
 dict(id='matite', cap=3, registro='chiaro', didascalia='Porta-matite: 15-20%', corallo='',
      voce="Per un porta-matite, senza carichi pesanti, basta il {15-20%=quindici-venti per cento}."),
 dict(id='overhang', cap=4, registro='scuro', didascalia='Niente sotto: overhang', corallo='',
      voce="Le parti che sporgono senza niente sotto si chiamano {overhang=overèng}: il filamento non si può depositare in aria."),
 dict(id='supporti', cap=4, registro='scuro', didascalia='Supporti temporanei', corallo='',
      voce="Lo {slicer=slàiser} genera supporti temporanei, da togliere dopo la stampa. Ma un buon progettista riduce gli {overhang=overèng}."),
 dict(id='pla', cap=5, registro='chiaro', didascalia='PLA: 190-220 °C', corallo='',
      voce="A scuola si usa soprattutto il {PLA=pi-elle-a}: è economico, si stampa tra {190=centonovanta} e {220 °C=duecentoventi gradi} e non serve il piano riscaldato."),
 dict(id='pla2', cap=5, registro='chiaro', didascalia='Sopra 60 °C si deforma', corallo='',
      voce="È biodegradabile nel compostaggio industriale. Sopra i {60 °C=sessanta gradi} si deforma, ma è più facile da gestire di altri filamenti."),
 dict(id='finale', cap=0, registro='chiaro', didascalia='', corallo='',
      voce="Strati, riempimento, supporti e materiale."),
]
TOK = re.compile(r'\{([^=}]*)=([^}]*)\}([^\s]*)|(\S+)')
def parse(v):
    disp, tts, mp = [], [], []
    for m in TOK.finditer(v):
        if m.group(4):
            d = m.group(4); t = [d]
        else:
            d = m.group(1) + m.group(3); t = m.group(2).split(); t[-1] += m.group(3)
        mp.append((d, len(tts), len(tts) + len(t) - 1)); disp.append(d); tts += t
    return ' '.join(disp), ' '.join(tts), mp
async def wb(text):
    c = edge_tts.Communicate(text, "it-IT-IsabellaNeural", rate="+12%", boundary="WordBoundary")
    ws = []
    async for ch in c.stream():
        if ch["type"] == "WordBoundary": ws.append([ch["text"], ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7])
    return ws
only = sys.argv[1:]
old = {}
if os.path.exists('scaletta.json'): old = {x['id']: x for x in json.load(open('scaletta.json'))['scene']}
os.makedirs('voce', exist_ok=True); tot = 0
for i, sc in enumerate(S):
    src = sc['voce']; sc['voce'], sc['voce_tts'], mp = parse(src)
    if only and sc['id'] not in only and sc['id'] in old and old[sc['id']]['voce'] == sc['voce']:
        sc.update(voce_dur=old[sc['id']]['voce_dur'], parole=old[sc['id']]['parole']); tot += sc['voce_dur']; continue
    raw = f"voce/{i:02d}-{sc['id']}.raw.mp3"; out = f"voce/{i:02d}-{sc['id']}.wav"
    subprocess.run(["python3", "tts.py", sc["voce_tts"], raw, "it-IT-IsabellaNeural", "+12%"], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af",
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                    "-ar", "48000", "-ac", "1", out], check=True)
    sc['voce_dur'] = round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out])), 3)
    ws = asyncio.run(wb(sc['voce_tts'])); o = ws[0][1]
    tt = sc['voce_tts'].split()
    assert len(ws) == len(tt), (sc['id'], len(ws), len(tt), [w[0] for w in ws])
    sc['parole'] = [[d, round(ws[a][1] - o, 2), round(ws[b][2] - o, 2)] for d, a, b in mp]
    tot += sc['voce_dur']
    print(sc['id'], sc['voce_dur'], ' '.join(f"{w}@{a}" for w, a, b in sc['parole']))
print('voce tot', round(tot, 1))
json.dump({'caps': CAPS, 'scene': S}, open('scaletta.json', 'w'), ensure_ascii=False, indent=1)
open('data.js', 'w').write('const CAPS = ' + json.dumps(CAPS) + ';\nconst SC = ' + json.dumps(S, ensure_ascii=False) + ';')
