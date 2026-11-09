// 4 — stomaco: acido cloridrico (pH 1–2) e pepsina sulle proteine
scene('stomaco', { tail: 0.8, make: (W) => ({ capAt: W('attaccano'), render(t, D) {
  let g = '';
  // contorno: esofago aperto in alto, piloro e moncone di duodeno a sinistra
  const OUT = 'M380,232 C520,150 820,200 830,420 C840,640 640,780 450,760 C360,750 300,720 250,700 L215,700';
  const INN = 'M215,650 L250,650 C330,640 400,560 390,450 C385,360 330,300 330,232';
  const FILLP = 'M380,232 C520,150 820,200 830,420 C840,640 640,780 450,760 C360,750 300,720 250,700 L215,700 L215,650 L250,650 C330,640 400,560 390,450 C385,360 330,300 330,232 Z';
  let st = `<path d="${FILLP}" fill="${C.bg}"/>`;
  st += `<path d="${OUT}" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/><path d="${INN}" fill="none" stroke="${C.line}" stroke-width="5" stroke-linejoin="round"/>`;
  st += `<path d="M330,232 L330,140 M380,232 L380,140" stroke="${C.line}" stroke-width="5"/>`; // esofago, si ferma sul contorno
  st += `<path d="M215,650 L170,650 Q130,650 130,700 L130,800 M215,700 L190,700 Q180,700 180,720 L180,800" fill="none" stroke="${C.line}" stroke-width="5"/>`; // moncone di duodeno
  st += `<rect x="236" y="650" width="16" height="16" fill="${C.line}"/><rect x="236" y="684" width="16" height="16" fill="${C.line}"/>`; // sfintere del piloro
  g += E(t, -0.4, st, { dy: 0 });
  g += E(t, 0.3, label(355, 125, 'ESOFAGO') + `<line x1="240" y1="642" x2="240" y2="600" stroke="${C.line}" stroke-width="2"/>` + label(240, 590, 'PILORO') + label(155, 840, 'DUODENO'), { dy: 0 });
  // liquido acido (ritagliato dentro il contorno)
  const lv = 470 + 4 * Math.sin(t * 2);
  g += E(t, W("l'acido") - 0.2, `<clipPath id="stc"><path d="${FILLP}"/></clipPath><g clip-path="url(#stc)"><rect x="200" y="${lv}" width="700" height="400" fill="${liq}"/>` +
    [0, 1, 2, 3, 4, 5].map(i => { const y = 740 - ((t * 40 + i * 50) % 260); return `<circle cx="${430 + i * 65}" cy="${y}" r="7" fill="none" stroke="${C.line}" stroke-width="2"/>`; }).join('') + `</g>`, { dy: 0 });
  g += E(t, W("l'acido"), pill(560, 830, 'ACIDO CLORIDRICO', C.line, C.bg, 'middle'), { dy: 10 });
  // proteina: catena di perle che si spezza in frammenti, tutta dentro lo stomaco
  const s0 = W('attaccano'), sp = eo((t - s0) / 1.4), groups = [[0, 1, 2], [3, 4], [5, 6, 7, 8], [9, 10, 11]];
  const bead = [];
  for (let i = 0; i < 12; i++) { const gi = groups.findIndex(gr => gr.includes(i)); bead.push([470 + i * 26 + (gi - 1.5) * 24 * sp, 570 + 14 * Math.sin(i * 1.1) + (gi % 2 ? 26 : -18) * sp, gi]); }
  let pr = '';
  for (let i = 0; i < 11; i++) if (bead[i][2] === bead[i + 1][2] || sp < 0.05) pr += `<line x1="${bead[i][0]}" y1="${bead[i][1]}" x2="${bead[i + 1][0]}" y2="${bead[i + 1][1]}" stroke="${C.line}" stroke-width="4"/>`;
  bead.forEach(([x, y]) => pr += `<circle cx="${x}" cy="${y}" r="13" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>`);
  g += E(t, 0.15, pr + label(615, 515, 'PROTEINA'), { dy: 0 });
  g += E(t, W('pepsina'), pill(600, 330, 'PEPSINA', C.line, C.bg, 'middle'), { dy: 10 });
  g += E(t, W('spezzandole') - 0.2, serifI(600, 700, 'spezzata in frammenti', C.line, 'middle', 36));
  // scala del pH: il tratto 1–2 è l'unico elemento corallo
  const X = v => 1000 + v * 50, py = 520;
  let ph = `<rect x="${X(0)}" y="${py}" width="${X(14) - X(0)}" height="40" rx="8" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  for (let v = 0; v <= 14; v++) ph += `<line x1="${X(v)}" y1="${py + 40}" x2="${X(v)}" y2="${py + (v % 7 ? 52 : 62)}" stroke="${C.line}" stroke-width="2"/>`;
  [0, 7, 14].forEach(v => ph += T(X(v), py + 100, String(v), { f: 'mono', size: 28, fill: C.line, a: 'middle' }));
  ph += T(X(14), py - 24, 'SCALA DEL pH', { f: 'mono', size: 24, fill: C.line, ls: 3, a: 'end' });
  g += E(t, W('pi') - 0.6, ph, { dy: 0 });
  const hp = eo((t - W('uno')) / 0.6);
  if (hp > 0) g += `<rect x="${X(1)}" y="${py + 3}" width="${(X(2) - X(1)) * hp}" height="34" rx="4" fill="${C.coral}"/>` + `<path d="M${X(1.5)},${py - 6} L${X(1.5)},${py - 70}" stroke="${C.line}" stroke-width="2" opacity="${hp}"/>`;
  g += E(t, W('uno'), T(X(1.5) + 20, 400, 'pH 1–2', { f: 'pop', size: 84, fill: C.line }));
  return push(t, D, 960, 500, g) + caption(t, W('attaccano'), 'Proteine spezzate', '') + mapInset(2, false);
} }) });

// 5 — duodeno: bile → microgoccioline; il pancreas versa i succhi che completano la digestione
scene('duodeno', { tail: 1.45, make: (W) => ({ capAt: W('microgoccioline'), render(t, D) {
  let s = lightBg(), g = '';
  const shade = mix(C.ivory, C.ink, 0.25);
  g += E(t, -0.4, card(160, 150, 1440, 690, { rot: 0.6 }), { dy: 0 });
  g += E(t, -0.3, T(230, 245, 'Nel duodeno', { f: 'serif', size: 58, fill: C.ink }), { dy: 0 });
  // fegato con cistifellea e bile
  const lv = `<g transform="translate(205,300) scale(0.6) translate(-720,-268)"><path d="${LIVER}" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/><ellipse cx="892" cy="490" rx="16" ry="24" fill="${shade}" stroke="${C.ink}" stroke-width="5"/></g>`;
  g += E(t, 0.1, lv + T(330, 470, 'FEGATO', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3 }), { dy: 8 });
  g += E(t, W('bile'), pill(330, 500, 'BILE', C.ink, C.cream, 'middle') + arrow(400, 525, 548, 525, C.ink, 4), { dy: 6 });
  // tratto di duodeno (pareti) con la goccia di grasso dentro
  g += E(t, 0.0, `<path d="M560,345 L910,345 M560,655 L910,655" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` + T(735, 330, 'DUODENO', { f: 'mono', size: 24, fill: C.ink, a: 'middle', ls: 3 }), { dy: 0 });
  const e0 = W('emulsiona'), ep = eo((t - e0) / 1.6), cx = 735, cy = 500;
  let fat = '';
  if (ep < 0.15) fat += `<circle cx="${cx}" cy="${cy}" r="${110 * (1 - ep)}" fill="${shade}" stroke="${C.ink}" stroke-width="3"/>`;
  else for (let i = 0; i < 34; i++) {
    const a = rnd(i) * Math.PI * 2, rr = 30 + rnd(i + 7) * 110;
    fat += `<circle cx="${cx + Math.cos(a) * rr * ep * 1.2}" cy="${cy + Math.sin(a) * rr * ep}" r="${11 + rnd(i + 2) * 5}" fill="${shade}" stroke="${C.ink}" stroke-width="2.5"/>`;
  }
  g += E(t, 0.2, fat, { dy: 0 });
  g += E(t, 0.3, T(cx, 700, 'GRASSI', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 4, w: 700 }), { dy: 0 });
  g += E(t, W('microgoccioline') - 0.1, serifI(cx, 745, 'in microgoccioline'));
  // pancreas → succhi pancreatici
  const bx = 1040, by = 420;
  g += E(t, 0.2, `<g transform="translate(${1080 - 875},${300 - 598})"><path d="${PANC}" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/></g>` + T(1290, 330, 'PANCREAS', { f: 'mono', size: 24, fill: C.ink, ls: 3 }), { dy: 6 });
  g += E(t, W('succhi') - 0.1, arrow(1170, 342, 1170, by - 6, C.ink, 4), { dy: 0 });
  g += E(t, W('succhi'), `<rect x="${bx}" y="${by}" width="470" height="320" rx="14" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>` +
    T(bx + 235, by + 52, 'SUCCHI PANCREATICI', { f: 'mono', size: 26, fill: C.ink, a: 'middle', ls: 3, w: 700 }) + T(bx + 235, by + 95, 'completano la digestione di', { f: 'serif', size: 34, fill: C.ink, a: 'middle', it: true }));
  ['carboidrati', 'proteine', 'grassi'].forEach((n, i) => {
    const y = by + 160 + i * 62;
    g += E(t, W('completano') + i * 0.15, `<rect x="${bx + 60}" y="${y - 34}" width="44" height="44" rx="8" fill="${C.ivory}" stroke="${C.ink}" stroke-width="3"/>` +
      `<path d="M${bx + 70},${y - 12} l10,12 l18,-24" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` + T(bx + 130, y, n, { f: 'popm', size: 38, fill: C.ink }), { dy: 8 });
  });
  s += push(t, D, 880, 490, g) + mapInset(3, true);
  return s + caption(t, W('microgoccioline'), 'Grassi in microgoccioline', 'microgoccioline', true);
} }) });

