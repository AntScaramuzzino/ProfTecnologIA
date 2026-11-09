import json, sys, subprocess, os
from PIL import Image
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
tl = json.load(open('timeline.json'))
ts = []
for s in tl['scenes']:
    ts += [s['start'] + s['D'] * 0.55, s['start'] + s['D'] - 0.1]
subprocess.run(['node', 'shots.js', out] + [f'{x:.2f}' for x in ts], check=True)
ims = [Image.open(f'{out}/f_{x:.2f}.jpg').resize((640, 360)) for x in ts]
cols = 4; rows = (len(ims) + cols - 1) // cols
sh = Image.new('RGB', (cols * 640, rows * 360))
for i, im in enumerate(ims): sh.paste(im, ((i % cols) * 640, (i // cols) * 360))
sh.save(f'{out}/sheet.jpg', quality=85); print(sh.size)
