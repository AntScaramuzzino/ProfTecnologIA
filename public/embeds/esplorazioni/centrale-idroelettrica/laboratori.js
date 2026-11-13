/* Mini-laboratori dell'esplorazione «La centrale idroelettrica».
   Ogni laboratorio: titolo nelle tre lingue e mount(contenitore, {lang, calm}) che restituisce la funzione di chiusura. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const h = (tag, cls, text, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (parent) parent.appendChild(e); return e; };
  const loc = (lang) => (lang === 'en' ? 'en-GB' : lang === 'fr' ? 'fr-FR' : 'it-IT');
  const fmt = (n, lang, d = 0) => n.toLocaleString(loc(lang), { minimumFractionDigits: d, maximumFractionDigits: d });
  const G = 9.81, RHO = 1000, ETA = 0.85;

  /* ---------------- quanta potenza? ---------------- */
  const TP = {
    it: {
      intro: "La potenza di una centrale idroelettrica dipende da due cose: da quanto in alto parte l'acqua (il salto) e da quanta acqua scende ogni secondo (la portata). Prova a cambiarle.",
      h: 'Salto (dislivello tra bacino e turbina)', q: 'Portata (acqua che scende ogni secondo)',
      qv: (q, L) => `${fmt(q, L, q < 10 ? 1 : 0)} m³/s · ${fmt(q * 1000, L)} litri al secondo`,
      p: 'Potenza elettrica', eq: (n, L) => `come ${fmt(n, L)} asciugacapelli da 2 kW accesi insieme`,
      formula: "potenza = densità dell'acqua × g × portata × salto × rendimento (1.000 kg/m³ × 9,81 m/s² × Q × h × 0,85 → watt)",
      note: "Il rendimento di 0,85 tiene conto delle perdite nelle condotte, nella turbina e nell'alternatore: è un valore tipico, non quello di una centrale precisa. Raddoppiando il salto o la portata, la potenza raddoppia.",
      basin: 'bacino', turb: 'turbina',
    },
    en: {
      intro: 'The power of a hydroelectric plant depends on two things: how far the water falls (the head) and how much water flows down each second (the flow rate). Try changing them.',
      h: 'Head (height difference between reservoir and turbine)', q: 'Flow rate (water flowing down each second)',
      qv: (q, L) => `${fmt(q, L, q < 10 ? 1 : 0)} m³/s · ${fmt(q * 1000, L)} litres per second`,
      p: 'Electrical power', eq: (n, L) => `like ${fmt(n, L)} hairdryers (2 kW each) switched on together`,
      formula: 'power = water density × g × flow rate × head × efficiency (1,000 kg/m³ × 9.81 m/s² × Q × h × 0.85 → watts)',
      note: 'The efficiency of 0.85 accounts for the losses in the pipes (penstocks), the turbine and the generator: it is a typical value, not that of a specific plant. Double the head or the flow rate and the power doubles.',
      basin: 'reservoir', turb: 'turbine',
    },
    fr: {
      intro: "La puissance d'une centrale hydroélectrique dépend de deux choses : de la hauteur d'où part l'eau (la chute) et de la quantité d'eau qui descend chaque seconde (le débit). Essaie de les changer.",
      h: 'Hauteur de chute (entre le lac et la turbine)', q: "Débit (eau qui descend chaque seconde)",
      qv: (q, L) => `${fmt(q, L, q < 10 ? 1 : 0)} m³/s · ${fmt(q * 1000, L)} litres par seconde`,
      p: 'Puissance électrique', eq: (n, L) => `comme ${fmt(n, L)} sèche-cheveux de 2 kW allumés ensemble`,
      formula: "puissance = masse volumique de l'eau × g × débit × chute × rendement (1 000 kg/m³ × 9,81 m/s² × Q × h × 0,85 → watts)",
      note: "Le rendement de 0,85 tient compte des pertes dans les conduites, la turbine et l'alternateur : c'est une valeur typique, pas celle d'une centrale précise. Si tu doubles la chute ou le débit, la puissance double.",
      basin: 'lac', turb: 'turbine',
    },
  };
  const watt = (w, L) => (w >= 1e6 ? `${fmt(w / 1e6, L, w < 1e7 ? 1 : 0)} MW` : `${fmt(w / 1e3, L)} kW`);
  function potenza(box, ctx) {
    const t = TP[ctx.lang] || TP.it, L = ctx.lang;
    h('p', 'lab-note', t.intro, box);
    const grid = h('div', 'lab-grid', null, box);
    const fig = h('div', 'lab-fig', null, grid);
    const ctl = h('div', 'lab-ctl', null, grid);
    const svg = el('svg', { viewBox: '0 0 340 260', role: 'img', 'aria-label': t.h + ', ' + t.q }, fig);
    el('rect', { x: 0, y: 0, width: 340, height: 260, fill: '#eaf4f7' }, svg);
    const hill = el('path', { fill: '#9fb58a' }, svg);
    const lake = el('rect', { fill: '#3d8fd1' }, svg);
    const pipe = el('path', { fill: 'none', stroke: '#5b6670', 'stroke-linecap': 'round' }, svg);
    const water = el('path', { fill: 'none', stroke: '#7cc4ff', 'stroke-linecap': 'round', 'stroke-dasharray': '10 10' }, svg);
    el('rect', { x: 270, y: 214, width: 50, height: 34, rx: 4, fill: '#c56b3c' }, svg);
    const hl = el('line', { stroke: '#c0392b', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, svg);
    const ht = el('text', { 'font-size': 13, fill: '#c0392b' }, svg);
    const tl = (x, y, s, a) => { const e = el('text', { x, y, 'font-size': 12, fill: '#22303a', 'text-anchor': a || 'start' }, svg); e.textContent = s; return e; };
    tl(295, 210, t.turb, 'middle'); const bl = tl(20, 20, t.basin);
    // controlli: salto su scala logaritmica 10–1000 m
    h('label', null, t.h, ctl).htmlFor = 'labph';
    const hs = h('input', null, null, ctl); Object.assign(hs, { type: 'range', min: 0, max: 100, value: 60, id: 'labph' });
    const hv = h('span', 'val', '', ctl);
    h('label', null, t.q, ctl).htmlFor = 'labpq';
    const qs = h('input', null, null, ctl); Object.assign(qs, { type: 'range', min: 0, max: 100, value: 40, id: 'labpq' });
    const qv = h('span', 'val', '', ctl);
    const out = h('div', 'lab-out', null, ctl);
    h('p', 'lab-note', t.formula, ctl); h('p', 'lab-note', t.note, ctl);
    let off = 0, raf = 0;
    const hOf = () => Math.round(10 * 100 ** (hs.value / 100));          // 10 … 1000 m
    const qOf = () => { const q = 0.5 * 200 ** (qs.value / 100); return q < 10 ? Math.round(q * 10) / 10 : Math.round(q); };   // 0,5 … 100 m³/s
    function upd() {
      const H = hOf(), Q = qOf(), P = RHO * G * Q * H * ETA;
      hv.textContent = `${fmt(H, L)} m`; qv.textContent = t.qv(Q, L);
      out.textContent = '';
      h('span', null, t.p, out); h('b', null, watt(P, L), out); h('span', null, t.eq(Math.round(P / 2000), L), out);
      const top = 230 - 30 - (hs.value / 100) * 170;                      // quota del bacino nel disegno
      hill.setAttribute('d', `M0 260 L0 ${top + 10} L70 ${top + 10} L270 248 L340 248 L340 260 Z`);
      lake.setAttribute('x', 0); lake.setAttribute('y', top - 4); lake.setAttribute('width', 70); lake.setAttribute('height', 16);
      bl.setAttribute('y', top - 10);
      const w = 3 + (qs.value / 100) * 13;
      const d = `M60 ${top + 8} L272 228`;
      pipe.setAttribute('d', d); pipe.setAttribute('stroke-width', w + 4);
      water.setAttribute('d', d); water.setAttribute('stroke-width', w);
      hl.setAttribute('x1', 40); hl.setAttribute('x2', 40); hl.setAttribute('y1', top + 4); hl.setAttribute('y2', 228);
      ht.setAttribute('x', 46); ht.setAttribute('y', (top + 232) / 2); ht.textContent = `h = ${fmt(H, L)} m`;
    }
    function loop() { off -= 1 + Math.sqrt(hOf()) / 6; water.setAttribute('stroke-dashoffset', off); raf = requestAnimationFrame(loop); }
    hs.addEventListener('input', upd); qs.addEventListener('input', upd); upd();
    if (!ctx.calm) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }

  /* ---------------- la velocità del getto ---------------- */
  const TG = {
    it: {
      intro: "Più è alto il salto, più l'acqua esce veloce dall'ugello. Senza attriti la velocità dipende solo dal salto: è la stessa che avrebbe un oggetto lasciato cadere da quell'altezza.",
      h: 'Salto', v: "Velocità del getto all'uscita dell'ugello", kmh: (n, L) => `${fmt(n, L)} km/h`,
      cmp: (k, L) => k >= 1.05 ? `circa ${fmt(k, L, 1)} volte la velocità di un'auto in autostrada (130 km/h)` : k > 0.95 ? `più o meno come un'auto in autostrada (130 km/h)` : `meno veloce di un'auto in autostrada (130 km/h)`,
      formula: 'velocità = √(2 × g × salto)',
      note: "È la velocità ideale, senza perdite: nella realtà l'attrito nelle condotte e nell'ugello la riduce un po'. Le turbine Pelton si usano per i salti più grandi: da circa cento metri fino a quasi duemila metri.",
      nozzle: 'ugello', wheel: 'ruota Pelton',
    },
    en: {
      intro: 'The higher the head, the faster the water leaves the nozzle. Without friction the speed depends only on the head: it is the same speed an object would have if dropped from that height.',
      h: 'Head', v: 'Jet speed at the nozzle outlet', kmh: (n, L) => `${fmt(n, L)} km/h`,
      cmp: (k, L) => k >= 1.05 ? `about ${fmt(k, L, 1)} times the speed of a car on the motorway (130 km/h)` : k > 0.95 ? 'about as fast as a car on the motorway (130 km/h)' : 'slower than a car on the motorway (130 km/h)',
      formula: 'speed = √(2 × g × head)',
      note: 'This is the ideal speed, without losses: in reality friction in the penstocks and in the nozzle reduces it a little. Pelton turbines are used for the largest heads: from about a hundred metres up to almost two thousand metres.',
      nozzle: 'nozzle', wheel: 'Pelton wheel',
    },
    fr: {
      intro: "Plus la chute est haute, plus l'eau sort vite de l'injecteur. Sans frottements, la vitesse ne dépend que de la chute : c'est la même que celle d'un objet qu'on laisse tomber de cette hauteur.",
      h: 'Hauteur de chute', v: "Vitesse du jet à la sortie de l'injecteur", kmh: (n, L) => `${fmt(n, L)} km/h`,
      cmp: (k, L) => k >= 1.05 ? `environ ${fmt(k, L, 1)} fois la vitesse d'une voiture sur l'autoroute (130 km/h)` : k > 0.95 ? "à peu près aussi vite qu'une voiture sur l'autoroute (130 km/h)" : "moins vite qu'une voiture sur l'autoroute (130 km/h)",
      formula: 'vitesse = √(2 × g × chute)',
      note: "C'est la vitesse idéale, sans pertes : en réalité, les frottements dans les conduites et dans l'injecteur la réduisent un peu. Les turbines Pelton sont utilisées pour les plus grandes chutes : d'environ cent mètres jusqu'à près de deux mille mètres.",
      nozzle: 'injecteur', wheel: 'roue Pelton',
    },
  };
  function getto(box, ctx) {
    const t = TG[ctx.lang] || TG.it, L = ctx.lang;
    h('p', 'lab-note', t.intro, box);
    const grid = h('div', 'lab-grid', null, box);
    const fig = h('div', 'lab-fig', null, grid);
    const ctl = h('div', 'lab-ctl', null, grid);
    const svg = el('svg', { viewBox: '0 0 340 200', role: 'img', 'aria-label': t.v }, fig);
    el('rect', { x: 0, y: 0, width: 340, height: 200, fill: '#eef2f5' }, svg);
    el('path', { d: 'M10 42 H60 L84 50 V62 L60 70 H10 Z', fill: '#5b6670' }, svg);
    const jet = el('line', { x1: 84, y1: 56, y2: 56, stroke: '#4aa8f0', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-dasharray': '14 6' }, svg);
    const wheel = el('g', { transform: 'translate(290 100)' }, svg);
    el('circle', { r: 44, fill: 'none', stroke: '#8b949c', 'stroke-width': 4 }, wheel);
    for (let i = 0; i < 12; i++) el('path', { d: 'M-6 -44 q6 -14 12 0', fill: '#a9b2ba', transform: `rotate(${i * 30})` }, wheel);
    el('circle', { r: 8, fill: '#5b6670' }, wheel);
    const tl = (x, y, s) => { const e = el('text', { x, y, 'font-size': 12, fill: '#22303a', 'text-anchor': 'middle' }, svg); e.textContent = s; };
    tl(40, 32, t.nozzle); tl(290, 168, t.wheel);
    h('label', null, t.h, ctl).htmlFor = 'labgh';
    const hs = h('input', null, null, ctl); Object.assign(hs, { type: 'range', min: 50, max: 1500, step: 10, value: 500, id: 'labgh' });
    const hv = h('span', 'val', '', ctl);
    const out = h('div', 'lab-out', null, ctl);
    h('p', 'lab-note', t.formula, ctl); h('p', 'lab-note', t.note, ctl);
    let rot = 0, off = 0, raf = 0, v = 0;
    function upd() {
      const H = Number(hs.value); v = Math.sqrt(2 * G * H);
      hv.textContent = `${fmt(H, L)} m`;
      out.textContent = '';
      h('span', null, t.v, out); h('b', null, `${fmt(v, L)} m/s`, out);
      h('span', null, `${t.kmh(Math.round(v * 3.6), L)} · ${t.cmp(v * 3.6 / 130, L)}`, out);
      jet.setAttribute('x2', 290);
      jet.setAttribute('stroke-width', 8);
    }
    function loop() { off -= v / 8; rot += v / 40; jet.setAttribute('stroke-dashoffset', off); wheel.setAttribute('transform', `translate(290 100) rotate(${rot})`); raf = requestAnimationFrame(loop); }
    hs.addEventListener('input', upd); upd();
    if (!ctx.calm) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }

  window.ESPLORAZIONE_LAB = {
    potenza: { titolo: { it: 'Quanta potenza?', en: 'How much power?', fr: 'Quelle puissance ?' }, mount: potenza },
    getto: { titolo: { it: 'La velocità del getto', en: 'The speed of the jet', fr: 'La vitesse du jet' }, mount: getto },
  };
})();
