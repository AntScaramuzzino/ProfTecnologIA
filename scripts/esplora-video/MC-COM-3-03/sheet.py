import sys, os, glob
from PIL import Image
d, out = sys.argv[1], sys.argv[2]
fs = sorted(glob.glob(d + '/f_*.jpg'), key=lambda f: float(f.split('_')[-1][:-4]))
cols = 4; w, h = 960, 540; rows = (len(fs) + cols - 1) // cols
S = Image.new('RGB', (cols * w, rows * h))
for i, f in enumerate(fs): S.paste(Image.open(f).resize((w, h)), ((i % cols) * w, (i // cols) * h))
S.save(out, quality=80); print(len(fs))
