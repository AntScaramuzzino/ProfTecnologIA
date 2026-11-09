const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('file://' + __dirname + '/index.html'); await p.waitForFunction('window.READY===true');
console.log(await p.evaluate(() => { render(62.9); const r=[...document.querySelectorAll('text')].filter(x=>['Prodotto','scartato'].includes(x.textContent)).map(x=>[x.textContent,x.getAttribute('x'),x.getComputedTextLength(),x.getBBox().width,x.getBoundingClientRect().width,x.getAttribute('font-size'),x.parentNode.getAttribute('transform')]); return JSON.stringify(r)})); await b.close(); })();
