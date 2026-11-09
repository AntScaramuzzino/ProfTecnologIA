const { chromium } = require('playwright');
(async () => {
  const [,, a, b, fps] = process.argv; const FPS = +fps;
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + __dirname + '/index.html'); await p.waitForFunction('window.READY===true');
  for (let f = +a; f < +b; f++) {
    await p.evaluate(x => render(x), f / FPS);
    await p.screenshot({ path: `${process.env.FRAMES||'frames'}/${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  await br.close();
})();
