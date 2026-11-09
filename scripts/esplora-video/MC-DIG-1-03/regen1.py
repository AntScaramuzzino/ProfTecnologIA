import json, subprocess, sys, asyncio, certifi
certifi.where=lambda:"/root/.ccr/ca-bundle.crt"
import edge_tts
sid, text = sys.argv[1], sys.argv[2]
s=json.load(open('scaletta.json'))
i=[k for k,x in enumerate(s['scene']) if x['id']==sid][0]; sc=s['scene'][i]
sc['voce']=text
raw=f"voce/{i:02d}-{sid}.raw.mp3"; out=f"voce/{i:02d}-{sid}.wav"
subprocess.run(["python3","tts.py",text,raw,"it-IT-IsabellaNeural","+12%"],check=True)
subprocess.run(["ffmpeg","-y","-v","error","-i",raw,"-af","silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse","-ar","48000","-ac","1",out],check=True)
sc['voce_dur']=round(float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",out])),3)
async def wb(text):
    c=edge_tts.Communicate(text,"it-IT-IsabellaNeural",rate="+12%",boundary="WordBoundary"); ws=[]
    async for ch in c.stream():
        if ch["type"]=="WordBoundary": ws.append([ch["text"],ch["offset"]/1e7,(ch["offset"]+ch["duration"])/1e7])
    return ws
ws=asyncio.run(wb(text)); o=ws[0][1]
sc['parole']=[[w,round(a-o,2),round(b-o,2)] for w,a,b in ws]
assert len(sc['parole'])==len(text.split()), (len(sc['parole']), len(text.split()))
print(sc['voce_dur'],' '.join(f'{w}@{a}' for w,a,b in sc['parole']))
json.dump(s,open('scaletta.json','w'),ensure_ascii=False,indent=1)
open('data.js','w').write('const SC = '+json.dumps(s['scene'],ensure_ascii=False)+';')
