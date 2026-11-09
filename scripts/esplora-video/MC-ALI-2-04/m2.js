const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('file://' + __dirname + '/index.html'); await p.waitForFunction('window.READY===true');
console.log(await p.evaluate(() => { render(62.9); return JSON.stringify([...document.querySelectorAll('text')].filter(x=>x.textContent==='Prodotto').map(x=>[x.outerHTML, x.parentNode.outerHTML.slice(0,300), getComputedStyle(x).fontFamily, getComputedStyle(x).letterSpacing]))}));
await p.screenshot({path:'chk/m2.png',clip:{x:0,y:960,width:700,height:80}}); await b.close(); })();
