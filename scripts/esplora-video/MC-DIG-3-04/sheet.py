import json,sys,subprocess,os,glob
from PIL import Image, ImageDraw
out=sys.argv[1]; os.makedirs(out,exist_ok=True)
tl=json.loads(subprocess.check_output(['node','shots.js',out,'0']).decode().split('\n')[0])
json.dump(tl,open('timeline.json','w'))
ts=[]
for s in tl['scenes']: ts += [s['start']+s['D']*0.55, s['start']+s['D']-0.12]
r=subprocess.check_output(['node','shots.js',out]+[f'{x:.2f}' for x in ts]).decode(); print(r.split('\n')[-2])
W,H=640,360; cols=4; rows=(len(ts)+cols-1)//cols
sh=Image.new('RGB',(W*cols,H*rows),'white'); d=ImageDraw.Draw(sh)
for i,x in enumerate(ts):
    im=Image.open(f'{out}/f_{float(f"{x:.2f}"):.2f}.jpg').resize((W,H)); sh.paste(im,((i%cols)*W,(i//cols)*H)); d.text(((i%cols)*W+6,(i//cols)*H+4),f'{x:.2f}',fill='yellow')
sh.save(f'{out}/sheet.jpg',quality=85)
