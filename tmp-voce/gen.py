# genera con VoiceStudio tutti i file di jobs.json.gz in out\<esplorazione>\<nome>.mp3
import json, gzip, base64, os, subprocess, sys, time, urllib.request
D=os.path.dirname(os.path.abspath(__file__)); FF=r'C:\Program Files\ImageMagick-7.0.11-Q16-HDRI\ffmpeg.exe'
U='http://127.0.0.1:3900/mcp/'; H={'Content-Type':'application/json','Accept':'application/json, text/event-stream','X-OmniVoice-Client-Id':'claude-code'}
def post(body,sid=None):
    h=dict(H)
    if sid: h['Mcp-Session-Id']=sid
    r=urllib.request.urlopen(urllib.request.Request(U,json.dumps(body).encode(),h),timeout=900)
    t=r.read().decode('utf-8')
    if 'data:' in t: t='\n'.join(l[5:].strip() for l in t.splitlines() if l.startswith('data:'))
    return r.headers.get('Mcp-Session-Id'),t
def init():
    s,_=post({'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-03-26','capabilities':{},'clientInfo':{'name':'claude-code','version':'1'}}})
    post({'jsonrpc':'2.0','method':'notifications/initialized'},s); return s
jobs=json.load(gzip.open(os.path.join(D,'jobs.json.gz'),'rt',encoding='utf-8'))
log=open(os.path.join(D,'gen.log'),'a',encoding='utf-8'); sid=init(); t0=time.time(); n=0
for name,text in jobs:
    mp3=os.path.join(D,'out',*name.split('/'))+'.mp3'
    if os.path.exists(mp3): continue
    os.makedirs(os.path.dirname(mp3),exist_ok=True)
    for tent in range(3):
        try:
            _,t=post({'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':'generate_speech','arguments':{'text':text,'language':'it','profile_id':'9768a163','steps':32,'speed':1.0}}},sid)
            r=json.loads(json.loads(t)['result']['content'][0]['text'])
            wav=mp3[:-4]+'.wav'; open(wav,'wb').write(base64.b64decode(r['wav_base64']))
            subprocess.run([FF,'-y','-loglevel','error','-i',wav,'-ac','1','-b:a','40k',mp3],check=True); os.remove(wav)
            n+=1; log.write(f'{time.time()-t0:.0f}s {n} {name} {r["audio_duration_s"]}\n'); log.flush(); break
        except Exception as e:
            log.write(f'ERR {name} {e!r}\n'); log.flush(); time.sleep(5)
            try: sid=init()
            except Exception: pass
log.write('FINE\n'); log.close()
