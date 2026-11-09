const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
 const errs=[]; p.on('pageerror', e => errs.push(e.message));
 await p.goto('file://' + __dirname + '/index.html'); await p.waitForFunction('window.READY===true',null,{timeout:15000}).catch(()=>errs.push('notready'));
 const tl = await p.evaluate(() => window.TIMELINE); const f = await p.evaluate(()=>window.FONTS);
 require('fs').writeFileSync('timeline.json', JSON.stringify(tl)); console.log(JSON.stringify(f)); console.log(tl.total, tl.scenes.map(s=>s.id+':'+s.start.toFixed(2)+'+'+s.D.toFixed(2)).join(' ')); console.log('ERR',errs); await b.close(); })();
