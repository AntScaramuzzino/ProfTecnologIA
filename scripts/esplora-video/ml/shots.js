const { chromium } = require('playwright');
(async () => {
  const [,, out, ...times] = process.argv;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + __dirname + '/index.html'); await p.waitForFunction('window.READY===true', null, { timeout: 15000 }).catch(e => errs.push('notready'));
  const tl = await p.evaluate(() => window.TIMELINE); console.log(JSON.stringify(tl));
  for (const t of times) { await p.evaluate(x => render(x), +t); await p.screenshot({ path: `${out}/f_${(+t).toFixed(2)}.jpg`, quality: 80, type: 'jpeg' }); }
  console.log('ERR', JSON.stringify(errs)); await b.close();
})();
