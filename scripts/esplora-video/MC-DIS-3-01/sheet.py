import json, subprocess, sys, os
from PIL import Image, ImageDraw
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
tl = json.load(open('timeline.json'))
times = []
for s in tl['scenes']:
    times += [round(s['start'] + s['D'] * 0.45, 2), round(s['start'] + s['D'] - 0.25, 2)]
r = subprocess.run(['node', 'shots.js', out] + [str(x) for x in times], capture_output=True, text=True); print(r.stdout[-300:], r.stderr[-500:])
ims = [Image.open(f'{out}/f_{x:.2f}.jpg').resize((640, 360)) for x in times]
cols = 4; rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * 640, rows * 380), 'white'); d = ImageDraw.Draw(S)
for i, (im, x) in enumerate(zip(ims, times)):
    S.paste(im, ((i % cols) * 640, (i // cols) * 380 + 20)); d.text(((i % cols) * 640 + 5, (i // cols) * 380 + 3), f'{x:.2f}', fill='black')
S.save(f'{out}/sheet.jpg', quality=85); print(S.size)
