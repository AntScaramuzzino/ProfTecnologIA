import json,subprocess,sys,os
from PIL import Image
out=sys.argv[1]; tl=json.load(open('timeline.json'))
st={s['id']:s for s in tl['scenes']}
ts=[float(x) for x in sys.argv[2:]] if len(sys.argv)>2 else []
subprocess.run(['node','shots.js',out]+[f'{t:.2f}' for t in ts],check=True,stdout=subprocess.DEVNULL)
fs=sorted(os.listdir(out),key=lambda f:float(f[2:-4]))
ims=[Image.open(f'{out}/{f}').resize((640,360)) for f in fs]
cols=4; rows=(len(ims)+cols-1)//cols; S=Image.new('RGB',(cols*640,rows*360))
for i,im in enumerate(ims): S.paste(im,((i%cols)*640,(i//cols)*360))
S.save(f'{out}/sheet.jpg',quality=85); print(len(ims))
