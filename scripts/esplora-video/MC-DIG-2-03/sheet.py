from PIL import Image,ImageDraw;import glob,sys,os
d=sys.argv[1]
fs=sorted(glob.glob(d+'/f_*.jpg'),key=lambda f:float(os.path.basename(f)[2:-4]))
W,H=640,360;cols=4;rows=(len(fs)+cols-1)//cols
sh=Image.new('RGB',(W*cols,H*rows))
for i,f in enumerate(fs):
    im=Image.open(f).resize((W,H));ImageDraw.Draw(im).text((5,5),os.path.basename(f),fill='yellow');sh.paste(im,((i%cols)*W,(i//cols)*H))
sh.save(sys.argv[2],quality=85);print(len(fs))
