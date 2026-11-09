"""Render completo + musica + voce + mix + MP4 + poster + VTT."""
import json, math, os, subprocess, re, wave, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
PREFIX = sys.argv[1]  # es. par-05
tl = json.load(open('timeline.json')); TOT = math.ceil((tl['total'] + 0.2) * 30)
FR = os.environ.get('FRAMES', 'frames'); OUT = os.environ.get('OUT', 'out')
os.makedirs(FR, exist_ok=True); os.makedirs(OUT, exist_ok=True)
W = 3; step = (TOT + W - 1) // W
procs = [] if os.environ.get('SKIP') else [subprocess.Popen(['node', 'render.js', str(i * step), str(min(TOT, (i + 1) * step)), '30']) for i in range(W)]
subprocess.run(['python3', 'score.py'], check=True)
# voce
SR = 48000; N = int((tl['total'] + 0.2) * SR); v = np.zeros(N)
files = sorted(f for f in os.listdir('voce') if f.endswith('.wav'))
for s, f in zip(tl['scenes'], files):
    assert s['id'] in f, (s['id'], f)
    with wave.open('voce/' + f) as w: a = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768
    i = int((s['start'] + s['L']) * SR); v[i:i + len(a)] += a[:N - i]
with wave.open('voce.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(v, -1, 1) * 32767).astype(np.int16).tobytes())
D = f"{N / SR:.3f}"
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'voce.wav', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,aformat=channel_layouts=stereo', '-t', D, 'voce_n.wav'], check=True)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'voce_n.wav', '-i', 'musica.wav', '-filter_complex',
                f'[0:a]apad=whole_dur={D},asplit[v1][v2];[1:a]volume=0.55[m];[m][v2]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[md];[v1][md]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.95',
                '-t', D, 'mix.wav'], check=True)
for p in procs: p.wait()
n = len([f for f in os.listdir(FR) if f.endswith('.jpg')]); assert n >= TOT, (n, TOT)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-framerate', '30', '-i', FR + '/%05d.jpg', '-i', 'mix.wav', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
                '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', 'nosub.mp4'], check=True)
# poster
from PIL import Image
pf = int(float(sys.argv[2]) * 30) if len(sys.argv) > 2 else TOT // 2
Image.open(f'{FR}/{pf:05d}.jpg').resize((1280, 720)).save(f'{OUT}/{PREFIX}-poster.webp', quality=82)
subprocess.run(['python3','vtt.py',f'{OUT}/{PREFIX}.vtt'],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i','nosub.mp4','-i',f'{OUT}/{PREFIX}.vtt','-map','0','-map','1','-c:v','copy','-c:a','copy','-c:s','mov_text',
                '-metadata:s:s:0','language=ita','-metadata:s:s:0','title=Italiano','-disposition:s:0','0','-movflags','+faststart',f'{OUT}/{PREFIX}.mp4'],check=True)
print(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration,size', '-of', 'default=nw=1', f'{OUT}/{PREFIX}.mp4']).decode())
