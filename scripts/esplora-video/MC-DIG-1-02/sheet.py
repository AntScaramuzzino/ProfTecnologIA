import sys,glob
from PIL import Image, ImageDraw
fs=sorted(glob.glob(sys.argv[1]+'/f_*.jpg'),key=lambda f:float(f.split('_')[-1][:-4]))
W,H=640,360;cols=4;rows=(len(fs)+cols-1)//cols
sh=Image.new('RGB',(W*cols,H*rows),'gray')
for i,f in enumerate(fs):
    im=Image.open(f).resize((W,H));d=ImageDraw.Draw(im);d.text((8,8),f.split('_')[-1][:-4],fill='yellow')
    sh.paste(im,((i%cols)*W,(i//cols)*H))
sh.save(sys.argv[2],quality=85)
