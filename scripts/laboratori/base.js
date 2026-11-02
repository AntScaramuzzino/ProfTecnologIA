// Motore comune: schede livello accessibili (WAI-ARIA Tabs) + utilità
(function(){
  const tabs=[...document.querySelectorAll('.tab')];
  function select(t,focus){
    tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;
      document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});
    if(focus)t.focus();
    try{localStorage.setItem('lab-level-'+document.title,t.id)}catch(e){}
  }
  tabs.forEach((t,i)=>{
    t.addEventListener('click',()=>select(t));
    t.addEventListener('keydown',e=>{
      let j=null;if(e.key==='ArrowRight')j=(i+1)%tabs.length;if(e.key==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;
      if(e.key==='Home')j=0;if(e.key==='End')j=tabs.length-1;
      if(j!==null){e.preventDefault();select(tabs[j],true);}
    });
  });
  let saved=null;try{saved=localStorage.getItem('lab-level-'+document.title)}catch(e){}
  select(document.getElementById(saved)||tabs[0]);
  window.LAB={
    fb(el,kind,html){el.className='fb '+kind;el.innerHTML=html;el.hidden=false;},
    fmt(n,d=0){return n.toLocaleString('it-IT',{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:'always'});},
    copy(btn,text){
      const done=()=>{const o=btn.textContent;btn.textContent='Copiato';setTimeout(()=>btn.textContent=o,1500)};
      try{navigator.clipboard.writeText(text).then(done,()=>{})}catch(e){}
    }
  };
})();
