import json, subprocess, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
s = json.load(open('scaletta.json')); tot = 0
for i, sc in enumerate(s['scene']):
    raw = f"voce/{i:02d}-{sc['id']}.raw.mp3"; out = f"voce/{i:02d}-{sc['id']}.wav"
    subprocess.run(["python3", "tts.py", sc["voce"], raw, "it-IT-IsabellaNeural", "+12%"], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af",
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                    "-ar", "48000", "-ac", "1", out], check=True)
    sc['voce_dur'] = round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out])), 3)
    tot += sc['voce_dur']; print(sc['id'], sc['voce_dur'])
print('tot', round(tot, 1))
json.dump(s, open('scaletta.json', 'w'), ensure_ascii=False, indent=1)
subprocess.run(["python3", "words.py"], check=True, stdout=subprocess.DEVNULL)
s = json.load(open('scaletta.json'))
open('data.js', 'w').write('const SC = ' + json.dumps(s['scene'], ensure_ascii=False) + ';')
for x in s['scene']:
    print(x['id'], ' '.join(f'{w}@{a}' for w, a, b in x['parole']))
