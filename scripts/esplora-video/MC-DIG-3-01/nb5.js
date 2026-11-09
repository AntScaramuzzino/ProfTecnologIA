// 5 — il programma del robot (chiaro): ciclo principale separato dai gestori di eventi
scene('programma', { make: (W) => ({
  capAt: W('ciclo'), last: W('velocità'),
  render(t) {
    let s = lightBg(); const ink = C.ink;
    s += E(t, -0.35, card(150, 160, 1620, 660), { dy: 0 });
    s += E(t, -0.2, robot(340, 330, 0, ink, { s: 0.62, fill: C.ivory, bg: C.cream }) + T(340, 470, 'ROBOT', { f: 'mono', size: 28, fill: ink, a: 'middle', ls: 3, w: 600 }), { dy: 10 });
    // ciclo principale (contorno corallo, unico corallo)
    s += E(t, W('programma') - 0.1, `<rect x="560" y="210" width="1130" height="240" rx="18" fill="${C.ivory}" stroke="${C.coral}" stroke-width="6"/>` +
      T(600, 272, 'CICLO PRINCIPALE', { f: 'mono', size: 30, fill: ink, ls: 2, w: 700 }), { dy: 12 });
    const cp = eo((t - W('ciclo')) / 0.4);
    if (cp > 0) s += `<g opacity="${cp}" transform="rotate(${((t - W('ciclo')) * 90 % 360).toFixed(1)} 1630 262)"><path d="M1630,232 A30,30 0 1 1 1600,262" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><path d="M1630,220 L1648,232 L1630,246 z" fill="${ink}"/></g>` +
      E(t, W('ciclo'), T(1570, 274, 'SI RIPETE SEMPRE', { f: 'mono', size: 28, fill: ink, a: 'end', ls: 2, w: 600 }), { dy: 0 });
    s += E(t, W('vai'), `<rect x="600" y="315" width="1050" height="96" rx="12" fill="${C.cream}" stroke="${ink}" stroke-width="3"/>` +
      T(640, 378, 'vai avanti', { f: 'pop', size: 44, fill: ink }), { dy: 10 });
    s += E(t, W('velocità'), T(1610, 378, 'velocità 50', { f: 'pop', size: 44, fill: ink, a: 'end' }), { dy: 10 });
    // gestori di eventi: separati, con fulmine
    s += E(t, W('robot') + 0.1, T(560, 520, 'GESTORI DI EVENTI', { f: 'mono', size: 28, fill: ink, ls: 3, w: 700 }) +
      `<line x1="930" y1="511" x2="1690" y2="511" stroke="${ink}" stroke-width="2" stroke-dasharray="6 10"/>`, { dy: 8 });
    [1, 2, 3].forEach((n, i) => {
      const x = 560 + i * 385;
      s += E(t, W('robot') + 0.2 + i * 0.12, `<rect x="${x}" y="550" width="360" height="220" rx="18" fill="${C.ivory}" stroke="${ink}" stroke-width="4"/>` +
        bolt(x + 44, 608, 0.45, C.cream, ink) + T(x + 80, 620, `EVENTO ${n}`, { f: 'mono', size: 30, fill: ink, ls: 2, w: 700 }) +
        `<rect x="${x + 30}" y="650" width="300" height="40" rx="8" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="10 8"/>` +
        `<rect x="${x + 30}" y="706" width="220" height="40" rx="8" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="10 8"/>`, { dy: 12 });
    });
    return s + caption(t, W('ciclo'), 'Il ciclo continuo', '', true);
  } }) });

