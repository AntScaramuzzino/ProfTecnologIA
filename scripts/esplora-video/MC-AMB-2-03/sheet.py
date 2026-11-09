import sys,glob,os
from PIL import Image,ImageDraw
d=sys.argv[1]; out=sys.argv[2]
fs=sorted(glob.glob(d+'/f_*.jpg'),key=lambda f:float(os.path.basename(f)[2:-4]))
cols=4; w,h=640,360; rows=(len(fs)+cols-1)//cols
S=Image.new('RGB',(cols*w,rows*(h+30)),'white'); dr=ImageDraw.Draw(S)
for i,f in enumerate(fs):
    im=Image.open(f).resize((w,h)); x=(i%cols)*w; y=(i//cols)*(h+30)
    S.paste(im,(x,y+30)); dr.text((x+8,y+8),os.path.basename(f),fill='black')
S.save(out,quality=85)
