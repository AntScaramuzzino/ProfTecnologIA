import json,sys,subprocess,os
from PIL import Image
tl=json.load(open('timeline.json')); out=sys.argv[1]; os.makedirs(out,exist_ok=True)
ts=[]
for s in tl['scenes']:
    ts += [s['start']+s['D']*0.5, s['start']+s['D']-0.15]
ts=[round(x,2) for x in ts]
subprocess.run(['node','shots.js',out]+[str(x) for x in ts],check=True)
for k in range(2):
    sh=Image.new('RGB',(2560,1440))
    for i,t in enumerate(ts[k*16:(k+1)*16]):
        im=Image.open(f'{out}/f_{t:.2f}.jpg').resize((640,360)); sh.paste(im,((i%4)*640,(i//4)*360))
    sh.save(f'{out}/sheet{k+1}.jpg',quality=85)
print(ts)
