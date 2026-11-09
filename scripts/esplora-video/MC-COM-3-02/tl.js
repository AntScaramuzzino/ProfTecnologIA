// stampa timeline senza browser
global.document={createElement:()=>({getContext:()=>({measureText:s=>({width:s.length*20})})}),getElementById:()=>({})};global.window=global;
eval(require('fs').readFileSync(__dirname+'/data.js','utf8').replace('const SC','global.SC')+';'+require('fs').readFileSync(__dirname+'/kit.js','utf8')+';'+require('fs').readFileSync(__dirname+'/scenes.js','utf8')+';require("fs").writeFileSync(__dirname+"/timeline.json",JSON.stringify(TIMELINE));console.log(TIMELINE.total.toFixed(2));TIMELINE.scenes.forEach(s=>console.log(s.id,s.start.toFixed(2),s.D.toFixed(2)))');
