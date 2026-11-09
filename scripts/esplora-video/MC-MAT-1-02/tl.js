const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+__dirname+'/index.html');await p.waitForFunction('window.READY===true');
const r=await p.evaluate(()=>({tl:window.TIMELINE,f:window.FONTS}));require('fs').writeFileSync(__dirname+'/timeline.json',JSON.stringify(r.tl));console.log(r.f,r.tl.total);await b.close();})();
