/* Mini-laboratori dell'esplorazione «Il motore a quattro tempi».
   Ogni laboratorio: titolo nelle tre lingue e mount(contenitore, {lang, calm}) che restituisce la funzione di chiusura. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const h = (tag, cls, text, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (parent) parent.appendChild(e); return e; };
  const fmt = (n, lang, d = 0) => n.toLocaleString(lang === 'en' ? 'en-GB' : lang === 'fr' ? 'fr-FR' : 'it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });

  /* ---------------- il ciclo a quattro tempi ---------------- */
  const T4 = {
    it: {
      intro: "Guarda che cosa succede in un cilindro durante un ciclo. Il disegno è uno schema: le proporzioni non sono quelle di un motore vero.",
      phases: [
        ['1. Aspirazione', "Il pistone scende e la valvola di aspirazione è aperta: nel cilindro entra la miscela di aria e benzina."],
        ['2. Compressione', "Le due valvole sono chiuse. Il pistone sale e comprime la miscela in uno spazio piccolo. Un attimo prima che arrivi in cima, la candela fa scoccare la scintilla."],
        ['3. Scoppio', "La miscela accesa dalla scintilla brucia: i gas caldi si espandono e spingono giù il pistone. È l'unico tempo che produce lavoro."],
        ['4. Scarico', "Il pistone risale e la valvola di scarico è aperta: i gas bruciati escono verso il tubo di scarico."],
      ],
      play: 'Avvia', pause: 'Pausa', speed: 'Velocità', angle: 'Rotazione dell\'albero motore',
      turn: (a) => `${a}° · ${a < 360 ? 'primo giro' : 'secondo giro'}`,
      note: "Un ciclo completo dura due giri dell'albero motore. Nel disegno le valvole si aprono e si chiudono esattamente all'inizio e alla fine del loro tempo; nei motori veri si aprono un po' prima e si chiudono un po' dopo.",
      labels: { in: 'aspirazione', ex: 'scarico', plug: 'candela', piston: 'pistone', rod: 'biella', crank: 'albero motore' },
    },
    en: {
      intro: 'Watch what happens in one cylinder during a cycle. The drawing is a diagram: its proportions are not those of a real engine.',
      phases: [
        ['1. Intake', 'The piston moves down and the intake valve is open: the mixture of air and petrol flows into the cylinder.'],
        ['2. Compression', 'Both valves are closed. The piston moves up and squeezes the mixture into a small space. Just before it reaches the top, the spark plug makes a spark.'],
        ['3. Power', 'The mixture, lit by the spark, burns: the hot gases expand and push the piston down. This is the only stroke that does work.'],
        ['4. Exhaust', 'The piston moves up again and the exhaust valve is open: the burnt gases are pushed out into the exhaust pipe.'],
      ],
      play: 'Start', pause: 'Pause', speed: 'Speed', angle: 'Crankshaft rotation',
      turn: (a) => `${a}° · ${a < 360 ? 'first turn' : 'second turn'}`,
      note: 'A full cycle takes two turns of the crankshaft. In the drawing the valves open and close exactly at the start and end of their stroke; in real engines they open a little earlier and close a little later.',
      labels: { in: 'intake', ex: 'exhaust', plug: 'spark plug', piston: 'piston', rod: 'connecting rod', crank: 'crankshaft' },
    },
    fr: {
      intro: "Regarde ce qui se passe dans un cylindre pendant un cycle. Le dessin est un schéma : ses proportions ne sont pas celles d'un vrai moteur.",
      phases: [
        ['1. Admission', "Le piston descend et la soupape d'admission est ouverte : le mélange d'air et d'essence entre dans le cylindre."],
        ['2. Compression', "Les deux soupapes sont fermées. Le piston monte et comprime le mélange dans un petit espace. Juste avant qu'il arrive en haut, la bougie produit une étincelle."],
        ['3. Explosion', "Le mélange, allumé par l'étincelle, brûle : les gaz chauds se dilatent et poussent le piston vers le bas. C'est le seul temps qui produit du travail."],
        ['4. Échappement', "Le piston remonte et la soupape d'échappement est ouverte : les gaz brûlés sortent vers le tuyau d'échappement."],
      ],
      play: 'Démarrer', pause: 'Pause', speed: 'Vitesse', angle: 'Rotation du vilebrequin',
      turn: (a) => `${a}° · ${a < 360 ? 'premier tour' : 'deuxième tour'}`,
      note: "Un cycle complet dure deux tours du vilebrequin. Dans le dessin, les soupapes s'ouvrent et se ferment exactement au début et à la fin de leur temps ; dans les vrais moteurs, elles s'ouvrent un peu avant et se ferment un peu après.",
      labels: { in: 'admission', ex: 'échappement', plug: 'bougie', piston: 'piston', rod: 'bielle', crank: 'vilebrequin' },
    },
  };

  function quattrotempi(box, ctx) {
    const t = T4[ctx.lang] || T4.it;
    h('p', 'lab-note', t.intro, box);
    const grid = h('div', 'lab-grid', null, box);
    const fig = h('div', 'lab-fig', null, grid);
    const ctl = h('div', 'lab-ctl', null, grid);
    const W = 320, H = 440, CX = 160, CY = 360, R = 42, L = 132, TOP = 118;
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': t.phases.map((p) => p[0]).join(', ') }, fig);
    // testata e cilindro
    el('rect', { x: 92, y: 58, width: 136, height: 60, rx: 6, fill: '#c9ced3' }, svg);
    el('rect', { x: 92, y: 118, width: 14, height: 200, fill: '#9aa3ab' }, svg);
    el('rect', { x: 214, y: 118, width: 14, height: 200, fill: '#9aa3ab' }, svg);
    const gas = el('rect', { x: 106, y: TOP, width: 108, height: 50, fill: '#8fd3ff' }, svg);
    // condotti
    el('path', { d: 'M20 76 H112 V112', fill: 'none', stroke: '#7b858e', 'stroke-width': 14 }, svg);
    el('path', { d: 'M300 76 H208 V112', fill: 'none', stroke: '#7b858e', 'stroke-width': 14 }, svg);
    const flowIn = el('path', { d: 'M24 76 H112 V112', fill: 'none', stroke: '#2b8be0', 'stroke-width': 6, 'stroke-dasharray': '8 8' }, svg);
    const flowEx = el('path', { d: 'M208 112 V76 H296', fill: 'none', stroke: '#6b6b6b', 'stroke-width': 6, 'stroke-dasharray': '8 8' }, svg);
    // valvole
    const vIn = el('g', {}, svg), vEx = el('g', {}, svg);
    for (const [g, x] of [[vIn, 122], [vEx, 198]]) {
      el('rect', { x: x - 3, y: 30, width: 6, height: 84, fill: '#55606a' }, g);
      el('rect', { x: x - 15, y: 112, width: 30, height: 6, rx: 2, fill: '#55606a' }, g);
    }
    // candela e scintilla
    el('rect', { x: 153, y: 20, width: 14, height: 40, rx: 3, fill: '#f2f2f2', stroke: '#888' }, svg);
    el('rect', { x: 156, y: 58, width: 8, height: 60, fill: '#888' }, svg);
    const spark = el('path', { d: 'M160 118 l-8 10 l10 2 l-8 12', fill: 'none', stroke: '#ffd400', 'stroke-width': 4, 'stroke-linejoin': 'round' }, svg);
    // pistone, biella, manovella
    const piston = el('g', {}, svg);
    el('rect', { x: 108, y: 0, width: 104, height: 46, rx: 4, fill: '#b9c0c6', stroke: '#6d767e' }, piston);
    for (const yy of [8, 16, 24]) el('line', { x1: 108, x2: 212, y1: yy, y2: yy, stroke: '#6d767e' }, piston);
    const rod = el('line', { stroke: '#4a525a', 'stroke-width': 12, 'stroke-linecap': 'round' }, svg);
    el('circle', { cx: CX, cy: CY, r: R + 14, fill: 'none', stroke: '#d5d9dd', 'stroke-width': 2, 'stroke-dasharray': '4 6' }, svg);
    const arm = el('line', { stroke: '#2f363c', 'stroke-width': 16, 'stroke-linecap': 'round' }, svg);
    el('circle', { cx: CX, cy: CY, r: 8, fill: '#2f363c' }, svg);
    const pin = el('circle', { r: 6, fill: '#fff' }, svg);
    const lab = (x, y, s, a = 'middle') => { const e = el('text', { x, y, 'text-anchor': a, 'font-size': 13, fill: '#33404a' }, svg); e.textContent = s; return e; };
    lab(20, 64, t.labels.in, 'start'); lab(300, 64, t.labels.ex, 'end'); lab(178, 16, t.labels.plug, 'start');
    lab(CX, H - 8, t.labels.crank);
    const pl = lab(86, 0, t.labels.piston, 'end');
    lab(232, 300, t.labels.rod, 'start');
    // comandi
    const phase = h('p', 'lab-phase', '', ctl);
    const desc = h('p', null, '', ctl);
    const btns = h('div', 'lab-btns', null, ctl);
    const play = h('button', null, t.play, btns); play.type = 'button';
    t.phases.forEach((p, i) => { const b = h('button', null, p[0].replace(/^\d\.\s*/, ''), btns); b.type = 'button'; b.addEventListener('click', () => { run = false; set(i * 180 + 1); }); });
    h('label', null, t.angle, ctl).htmlFor = 'lab4ang';
    const ang = h('input', null, null, ctl); Object.assign(ang, { type: 'range', min: 0, max: 719, step: 1, id: 'lab4ang' });
    const angv = h('span', 'val', '', ctl);
    h('label', null, t.speed, ctl).htmlFor = 'lab4spd';
    const spd = h('input', null, null, ctl); Object.assign(spd, { type: 'range', min: 10, max: 240, value: 60, id: 'lab4spd' });
    h('p', 'lab-note', t.note, ctl);
    let a = 0, run = !ctx.calm, last = 0, raf = 0;
    function set(v) {
      a = ((v % 720) + 720) % 720;
      const th = a * Math.PI / 180, ph = Math.floor(a / 180);
      const pinY = CY - (R * Math.cos(th) + Math.sqrt(L * L - R * R * Math.sin(th) ** 2));
      const pTop = pinY - 22;
      piston.setAttribute('transform', `translate(0 ${pTop})`); pl.setAttribute('y', pTop + 28);
      const cxp = CX + R * Math.sin(th), cyp = CY - R * Math.cos(th);
      rod.setAttribute('x1', CX); rod.setAttribute('y1', pinY); rod.setAttribute('x2', cxp); rod.setAttribute('y2', cyp);
      arm.setAttribute('x1', CX); arm.setAttribute('y1', CY); arm.setAttribute('x2', cxp); arm.setAttribute('y2', cyp);
      pin.setAttribute('cx', cxp); pin.setAttribute('cy', cyp);
      gas.setAttribute('height', Math.max(2, pTop - TOP));
      const k = (a % 180) / 180;
      const col = ph === 0 ? '#8fd3ff' : ph === 1 ? `rgb(${Math.round(143 - 80 * k)},${Math.round(211 - 90 * k)},255)` : ph === 2 ? `rgb(255,${Math.round(120 + 100 * k)},${Math.round(40 + 120 * k)})` : `rgb(${Math.round(150 + 40 * k)},${Math.round(150 + 40 * k)},${Math.round(150 + 40 * k)})`;
      gas.setAttribute('fill', col);
      vIn.setAttribute('transform', `translate(0 ${ph === 0 ? 14 * Math.sin(k * Math.PI) : 0})`);
      vEx.setAttribute('transform', `translate(0 ${ph === 3 ? 14 * Math.sin(k * Math.PI) : 0})`);
      flowIn.style.display = ph === 0 ? '' : 'none';
      flowEx.style.display = ph === 3 ? '' : 'none';
      flowIn.setAttribute('stroke-dashoffset', -a); flowEx.setAttribute('stroke-dashoffset', -a);
      spark.style.display = (a >= 345 && a < 375) ? '' : 'none';
      phase.textContent = t.phases[ph][0];
      desc.textContent = t.phases[ph][1];
      ang.value = Math.round(a); angv.textContent = t.turn(Math.round(a));
      play.textContent = run ? t.pause : t.play; play.setAttribute('aria-pressed', String(run));
    }
    function loop(ts) {
      if (run && last) set(a + (ts - last) / 1000 * Number(spd.value));
      last = ts; raf = requestAnimationFrame(loop);
    }
    play.addEventListener('click', () => { run = !run; set(a); });
    ang.addEventListener('input', () => { run = false; set(Number(ang.value)); });
    set(0); raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }

  /* ---------------- calcola la cilindrata ---------------- */
  const TC = {
    it: {
      intro: "La cilindrata è il volume che i pistoni «spazzano» scendendo dal punto più alto al più basso, sommato per tutti i cilindri. Dipende dal diametro del cilindro (alesaggio), dalla corsa del pistone e dal numero di cilindri.",
      bore: 'Alesaggio (diametro del cilindro)', stroke: 'Corsa del pistone', cyl: 'Numero di cilindri',
      one: 'Un cilindro', tot: 'Cilindrata totale', formula: 'cilindrata = π × (alesaggio ÷ 2)² × corsa × numero di cilindri',
      note: "Molte utilitarie hanno tre o quattro cilindri, con alesaggio e corsa tra 65 e 90 mm circa: la loro cilindrata va da circa 1.000 a 1.600 cm³, cioè «1.0», «1.2», «1.6» litri. 1.000 cm³ sono 1 litro.",
      d: 'alesaggio', c: 'corsa',
    },
    en: {
      intro: 'Engine displacement is the volume the pistons ‘sweep’ as they move from the highest to the lowest point, added up for all the cylinders. It depends on the cylinder diameter (bore), the piston stroke and the number of cylinders.',
      bore: 'Bore (cylinder diameter)', stroke: 'Piston stroke', cyl: 'Number of cylinders',
      one: 'One cylinder', tot: 'Total displacement', formula: 'displacement = π × (bore ÷ 2)² × stroke × number of cylinders',
      note: 'Many small cars have three or four cylinders, with bore and stroke of about 65 to 90 mm: their displacement is about 1,000 to 1,600 cm³, that is ‘1.0’, ‘1.2’, ‘1.6’ litres. 1,000 cm³ is 1 litre.',
      d: 'bore', c: 'stroke',
    },
    fr: {
      intro: "La cylindrée est le volume que les pistons « balaient » en descendant du point le plus haut au plus bas, additionné pour tous les cylindres. Elle dépend du diamètre du cylindre (alésage), de la course du piston et du nombre de cylindres.",
      bore: 'Alésage (diamètre du cylindre)', stroke: 'Course du piston', cyl: 'Nombre de cylindres',
      one: 'Un cylindre', tot: 'Cylindrée totale', formula: 'cylindrée = π × (alésage ÷ 2)² × course × nombre de cylindres',
      note: "Beaucoup de petites voitures ont trois ou quatre cylindres, avec un alésage et une course d'environ 65 à 90 mm : leur cylindrée va d'environ 1 000 à 1 600 cm³, c'est-à-dire « 1.0 », « 1.2 », « 1.6 » litre. 1 000 cm³, c'est 1 litre.",
      d: 'alésage', c: 'course',
    },
  };
  function cilindrata(box, ctx) {
    const t = TC[ctx.lang] || TC.it, L = ctx.lang;
    h('p', 'lab-note', t.intro, box);
    const grid = h('div', 'lab-grid', null, box);
    const fig = h('div', 'lab-fig', null, grid);
    const ctl = h('div', 'lab-ctl', null, grid);
    const svg = el('svg', { viewBox: '0 0 320 300', role: 'img', 'aria-label': t.bore + ', ' + t.stroke }, fig);
    const wallL = el('rect', { fill: '#9aa3ab' }, svg), wallR = el('rect', { fill: '#9aa3ab' }, svg);
    const swept = el('rect', { fill: '#8fd3ff', opacity: 0.8 }, svg);
    const pTop = el('rect', { fill: '#b9c0c6', stroke: '#6d767e', rx: 3 }, svg), pBot = el('rect', { fill: 'none', stroke: '#6d767e', 'stroke-dasharray': '5 4', rx: 3 }, svg);
    const dimD = el('line', { stroke: '#0d6b63', 'stroke-width': 2 }, svg), dimC = el('line', { stroke: '#c0392b', 'stroke-width': 2 }, svg);
    const tD = el('text', { 'font-size': 13, fill: '#0d6b63', 'text-anchor': 'middle' }, svg), tC = el('text', { 'font-size': 13, fill: '#c0392b' }, svg);
    const mk = (lab, id, min, max, val) => { h('label', null, lab, ctl).htmlFor = id; const r = h('input', null, null, ctl); Object.assign(r, { type: 'range', min, max, value: val, id }); const v = h('span', 'val', '', ctl); return [r, v]; };
    const [d, dv] = mk(t.bore, 'labcd', 50, 110, 76), [c, cv] = mk(t.stroke, 'labcc', 50, 110, 88);
    h('label', null, t.cyl, ctl);
    const cb = h('div', 'lab-btns', null, ctl); let n = 4;
    const nb = [1, 2, 3, 4, 6, 8].map((k) => { const b = h('button', null, String(k), cb); b.type = 'button'; b.addEventListener('click', () => { n = k; upd(); }); return [k, b]; });
    const out = h('div', 'lab-out', null, ctl);
    h('p', 'lab-note', t.formula, ctl); h('p', 'lab-note', t.note, ctl);
    function upd() {
      const D = Number(d.value), C = Number(c.value);
      const v1 = Math.PI * (D / 20) ** 2 * (C / 10);   // cm³
      dv.textContent = `${D} mm`; cv.textContent = `${C} mm`;
      nb.forEach(([k, b]) => b.setAttribute('aria-pressed', String(k === n)));
      out.textContent = '';
      h('span', null, `${t.one}: ${fmt(v1, L)} cm³`, out);
      h('b', null, `${t.tot}: ${fmt(v1 * n, L)} cm³`, out);
      h('span', null, `≈ ${fmt(v1 * n / 1000, L, 1)} L`, out);
      const s = 1.6, w = D * s, x = 160 - w / 2, y0 = 40, cs = C * s;
      wallL.setAttribute('x', x - 12); wallL.setAttribute('y', y0); wallL.setAttribute('width', 12); wallL.setAttribute('height', cs + 70);
      wallR.setAttribute('x', x + w); wallR.setAttribute('y', y0); wallR.setAttribute('width', 12); wallR.setAttribute('height', cs + 70);
      swept.setAttribute('x', x); swept.setAttribute('y', y0); swept.setAttribute('width', w); swept.setAttribute('height', cs);
      pTop.setAttribute('x', x + 2); pTop.setAttribute('y', y0 + cs); pTop.setAttribute('width', w - 4); pTop.setAttribute('height', 30);
      pBot.setAttribute('x', x + 2); pBot.setAttribute('y', y0); pBot.setAttribute('width', w - 4); pBot.setAttribute('height', 30);
      dimD.setAttribute('x1', x); dimD.setAttribute('x2', x + w); dimD.setAttribute('y1', y0 + cs / 2); dimD.setAttribute('y2', y0 + cs / 2);
      tD.setAttribute('x', 160); tD.setAttribute('y', y0 + cs / 2 - 6); tD.textContent = `${t.d} ${D} mm`;
      dimC.setAttribute('x1', x + w + 22); dimC.setAttribute('x2', x + w + 22); dimC.setAttribute('y1', y0); dimC.setAttribute('y2', y0 + cs);
      tC.setAttribute('x', 160); tC.setAttribute('y', y0 + cs + 52); tC.setAttribute('text-anchor', 'middle'); tC.textContent = `${t.c} ${C} mm`;
    }
    d.addEventListener('input', upd); c.addEventListener('input', upd); upd();
    return null;
  }

  window.ESPLORAZIONE_LAB = {
    quattrotempi: { titolo: { it: 'Il ciclo a quattro tempi', en: 'The four-stroke cycle', fr: 'Le cycle à quatre temps' }, mount: quattrotempi },
    cilindrata: { titolo: { it: 'Calcola la cilindrata', en: 'Work out the displacement', fr: 'Calcule la cylindrée' }, mount: cilindrata },
  };
})();
