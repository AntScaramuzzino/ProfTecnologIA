const { chromium } = require('playwright'); const { spawn } = require('child_process');
(async () => {
  const [,, a, b, fps, out] = process.argv; const FPS = +fps;
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + __dirname + '/index.html'); await p.waitForFunction('window.READY===true');
  for (let f = +a; f < +b; f++) {
    await p.evaluate(x => render(x), f / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  await br.close(); ff.stdin.end(); await new Promise(r => ff.on('close', r));
})();
