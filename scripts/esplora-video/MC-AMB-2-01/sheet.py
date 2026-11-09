import sys, glob
from PIL import Image, ImageDraw
fs = sorted(glob.glob(sys.argv[1] + '/f_*.jpg')); W, H = 640, 360; cols = 4
im = Image.new('RGB', (cols * W, ((len(fs) + cols - 1) // cols) * H), 'gray')
for i, f in enumerate(fs):
    x = Image.open(f).resize((W, H)); ImageDraw.Draw(x).text((8, 8), f.split('_')[-1], fill='yellow'); im.paste(x, ((i % cols) * W, (i // cols) * H))
im.save(sys.argv[2], quality=85)
