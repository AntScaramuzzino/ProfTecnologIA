import re
s=open('scenes.js').read()
def rep(name, new):
    global s
    i=s.index(f"scene('{name}'"); j=s.index("\n// ", i)
    s=s[:i]+new.strip()+"\n"+s[j:]
rep('tre', r'''
scene('tre', { make: (W) => ({
  capAt: W('solo'),
  render(t, D) {
    const I = C.ink;
    let g = E(t, -0.4, card(180, 150, 1560, 660, { rot: -0.5 }), { dy: 0 });
    g += E(t, W('qualsiasi'), T(270, 280, 'QUALSIASI PROGRAMMA =', { f: 'mono', size: 30, fill: I, ls: 4, w: 700 }));
    // tre segnaposto vuoti, poi riempiti quando la voce dice "strutture"
    for (let i = 0; i < 3; i++) g += E(t, W('qualsiasi') + 0.15 + i * 0.15, `<rect x="800" y="${330 + i * 135}" width="760" height="100" rx="14" fill="none" stroke="${I}" stroke-width="3" stroke-dasharray="10 10"/>`, { dy: 10 });
    g += pop(t, W('tre'), 470, 560, T(470, 680, '3', { f: 'pop', size: 380, fill: I, a: 'middle' }));
    const rows = [['SEQUENZA', miniSeq], ['SELEZIONE', miniSel], ['ITERAZIONE', miniLoop]];
    rows.forEach(([l, f], i) => {
      const y = 400 + i * 135;
      g += E(t, W('strutture') + i * 0.25, f(830, y - 62, I) + T(960, y, l, { f: 'pop', size: 76, fill: I }), { dy: 16 });
    });
    g += E(t, W('fondamentali'), IT(270, 760, 'strutture fondamentali', { fill: I, size: 46 }));
    return lightBg() + push(g, t, D) + caption(t, W('solo'), 'Solo tre strutture', 'tre', true);
  } }) });
''')
rep('semaforo', r'''
scene('semaforo', { tail: 1.0, make: (W) => ({
  capAt: W('rosso') + 0.05,
  render(t) {
    const x = 470, y = 140, lamps = [['ROSSO', 110], ['GIALLO', 280], ['VERDE', 450]];
    const on = t >= W('giallo') ? 1 : t >= W('verde') ? 2 : t >= W('rosso') ? 0 : -1;
    let g = `<rect x="${x - 110}" y="${y}" width="220" height="560" rx="40" fill="${DIM()}" stroke="${C.line}" stroke-width="5"/>` +
      `<line x1="${x}" y1="${y + 560}" x2="${x}" y2="${y + 680}" stroke="${C.line}" stroke-width="6"/>`;
    lamps.forEach(([l, ly], i) => {
      g += `<circle cx="${x}" cy="${y + ly}" r="68" fill="${on === i ? C.line : C.bg}" stroke="${C.line}" stroke-width="4"/>`;
      g += T(x - 150, y + ly + 10, l, { f: 'mono', size: 28, fill: C.line, a: 'end', ls: 3, w: on === i ? 700 : 500 });
    });
    let s = E(t, -0.4, g, { dy: 0 });
    // accendi + attendi (la durata non è nella fonte: valore lasciato vuoto)
    const bx = 1000, by = 150, step = 96, tw0 = [W('rosso'), W('verde'), W('giallo')];
    ['rosso', 'verde', 'giallo'].forEach((c, i) => {
      s += E(t, tw0[i] - 0.15, block(bx, by + 2 * i * step, 600, 'accendi ' + c, { h: 78, size: 36 }), { dy: 10 });
      s += E(t, tw0[i] + 0.1, block(bx, by + (2 * i + 1) * step, 600, '', { h: 78 }) + inl(bx + 28, by + (2 * i + 1) * step + 52, ['attendi', { oval: '…' }, 'secondi'], { size: 34 }), { dy: 10 });
    });
    if (on >= 0) {
      const k = { 0: 0, 2: 1, 1: 2 }[on];
      s += `<path d="M${bx - 100},${by + 39 + 2 * k * step - 24} l40,24 l-40,24 z" fill="${C.coral}"/>`;
    }
    s += E(t, W('sequenza'), lbl(bx + 300, by + 6 * step + 50, '= UNA SEQUENZA', { size: 30 }));
    return s + caption(t, W('rosso') + 0.05, 'Rosso, verde, giallo', '');
  } }) });
''')
rep('incrocio', r'''
scene('incrocio', { tail: 0.85, make: (W) => ({
  capAt: W('coordinare'),
  render(t, D) {
    const I = C.ink, tp = W('coordinare');
    let g = E(t, -0.4, card(150, 140, 1620, 700, { rot: 0.4 }), { dy: 0 });
    g += E(t, 0.0, pillTag(220, 225, 'ESEMPIO IMMAGINARIO', I, C.cream));
    // fasi illustrative (unità 11), con due brevi tratti tutto-rosso
    const U = 72, NU = 11, x0 = 900, rows = [['SEMAFORO A', [['VERDE', 0, 3], ['GIALLO', 3, 4.5], ['ROSSO', 4.5, 11]], 440], ['SEMAFORO B', [['ROSSO', 0, 5.5], ['VERDE', 5.5, 8.5], ['GIALLO', 8.5, 10], ['', 10, 11]], 600]];
    const ph = t > tp ? ((t - tp) * 1.6) % NU : 0;
    const aOn = t > tp && ph < 3, bOn = t > tp && ph >= 5.5 && ph < 8.5;
    const mx = 540, my = 520;
    let m = `<rect x="${mx - 300}" y="${my - 60}" width="600" height="120" fill="${mix(C.cream, I, 0.06)}" stroke="none"/><rect x="${mx - 60}" y="${my - 230}" width="120" height="460" fill="${mix(C.cream, I, 0.06)}" stroke="none"/>`;
    m += poly([[mx - 300, my - 60], [mx - 60, my - 60], [mx - 60, my - 230]], I, 3) + poly([[mx + 60, my - 230], [mx + 60, my - 60], [mx + 300, my - 60]], I, 3);
    m += poly([[mx - 300, my + 60], [mx - 60, my + 60], [mx - 60, my + 230]], I, 3) + poly([[mx + 60, my + 230], [mx + 60, my + 60], [mx + 300, my + 60]], I, 3);
    m += arrow(mx - 280, my, mx + 280, my, I, aOn ? 7 : 3) + arrow(mx, my + 210, mx, my - 210, I, bOn ? 7 : 3);
    m += T(mx - 280, my - 80, 'A', { f: 'pop', size: 44, fill: I }) + T(mx + 24, my + 220, 'B', { f: 'pop', size: 44, fill: I });
    m += `<circle cx="${mx}" cy="${my}" r="34" fill="none" stroke="${C.coral}" stroke-width="6"/>`;
    g += E(t, W('incrocio') - 0.1, m, { dy: 0 });
    rows.forEach(([name, segs, y], r) => {
      let row = T(x0, y - 50, name, { f: 'mono', size: 26, fill: I, ls: 3, w: 700 });
      segs.forEach(([l, a, b]) => {
        const v = l === 'VERDE';
        row += `<rect x="${x0 + a * U}" y="${y - 20}" width="${(b - a) * U}" height="74" fill="${v ? I : C.cream}" stroke="${I}" stroke-width="3"/>`;
        if (l) row += T(x0 + (a + b) / 2 * U, y + 26, l, { f: 'mono', size: 24, fill: v ? C.cream : I, a: 'middle', w: 700 });
      });
      g += E(t, (r ? W('due') : W('sequenze')) - 0.1, row, { dy: 12 });
    });
    if (t > tp) { const px = x0 + ph * U; g += E(t, tp, [440, 600].map(y => `<path d="M${px - 13},${y - 44} h26 l-13,20 z" fill="${I}"/><path d="M${px - 13},${y + 78} h26 l-13,-20 z" fill="${I}"/>`).join(''), { dy: 0 }); }
    g += E(t, W('verde') - 0.1, T(x0 + 5.5 * U, 770, 'MAI VERDE INSIEME', { f: 'mono', size: 30, fill: I, a: 'middle', ls: 4, w: 700 }));
    return lightBg() + push(g, t, D) + caption(t, W('coordinare'), 'Sequenze da coordinare', '', true);
  } }) });
''')
rep('quiz', r'''
scene('quiz', { tail: 0.65, make: (W) => ({
  capAt: W('corretta'),
  render(t, D) {
    const I = C.ink, x = 250, y = 190, w = 1000, SL = C.cream;
    let g = E(t, -0.4, card(160, 140, 1600, 710, { rot: -0.4 }), { dy: 0 });
    const head = inl(x + 28, y + 56, ['se', { hex: 'risposta = corretta' }, 'allora'], { ink: I, slot: SL, size: 34 });
    const armA = 200, armB = 200;
    g += E(t, W('se') - 0.1, cblock(x, y, w, head, [{ h: armA, label: 'altrimenti', bar: 70 }, { h: armB }], { st: I, fill: mix(C.cream, I, 0.06), hh: 90, tc: I, size: 34 }), { dy: 10 });
    const ia = y + 90 + 18, ib = y + 90 + armA + 70 + 18;
    g += E(t, W('aggiungi') - 0.1, block(x + 34, ia, 640, '', { h: 76, st: I, fill: C.cream }) + inl(x + 62, ia + 50, ['cambia', { drop: 'punteggio' }, 'di', { oval: '1' }], { ink: I, slot: mix(C.cream, I, 0.06), size: 30 }), { dy: 8 });
    g += E(t, W('vai') - 0.1, block(x + 34, ia + 88, 640, 'vai alla prossima domanda', { h: 76, st: I, fill: C.cream, tc: I, size: 32 }), { dy: 8 });
    g += E(t, W('mostra') - 0.1, block(x + 34, ib, 640, 'mostra il feedback', { h: 76, st: I, fill: C.cream, tc: I, size: 32 }), { dy: 8 });
    g += E(t, W('riprova') - 0.1, block(x + 34, ib + 88, 640, 'riprova', { h: 76, st: I, fill: C.cream, tc: I, size: 32 }), { dy: 8 });
    g += E(t, W('avanti') - 0.1, T(x + 420, ib + 88 + 50, 'o vai avanti', { f: 'serif', it: true, size: 42, fill: I }));
    const hiA = t >= W('corretta') && t < W('altrimenti') - 0.1, hiB = t >= W('altrimenti') - 0.1;
    if (hiA || hiB) {
      const yy = hiA ? ia - 10 : ib - 10;
      g += `<rect x="${x + 20}" y="${yy}" width="680" height="190" rx="14" fill="none" stroke="${C.coral}" stroke-width="6"/>`;
    }
    const sx = 1320;
    if (t >= W('corretta') - 0.1) {
      const ok = !hiB;
      g += E(t, ok ? W('corretta') - 0.1 : W('altrimenti') - 0.1,
        T(sx, 360, 'RISPOSTA', { f: 'mono', size: 28, fill: I, ls: 4, w: 700 }) + T(sx, 450, ok ? 'corretta' : 'sbagliata', { f: 'pop', size: 76, fill: I }) +
        (ok ? `<path d="M${sx + 10},${560} l40,40 l80,-90" fill="none" stroke="${I}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`
          : `<path d="M${sx + 20},${520} l80,80 M${sx + 100},${520} l-80,80" fill="none" stroke="${I}" stroke-width="10" stroke-linecap="round"/>`), { dy: 10 });
    }
    g += E(t, W('dipende'), IT(sx, 700, 'dipende dal gioco', { fill: I, size: 46 }));
    return lightBg() + push(g, t, D) + caption(t, W('corretta'), 'Se corretta… altrimenti', '', true);
  } }) });
''')
rep('modi', r'''
scene('modi', { make: (W) => ({
  capAt: W('fisso'),
  render(t, D) {
    const I = C.ink, SL = C.cream, FILL = mix(C.cream, I, 0.06), top = 270;
    const cols = [
      [180, W('numero') - 0.1, 90, [[56, ['ripeti', { oval: '10' }, 'volte']]], 'NUMERO FISSO', 44],
      [730, W('finché') - 0.1, 140, [[52, ['ripeti fino a quando']], [108, [{ hex: 'risposte finite' }]]], 'CONDIZIONE', 44],
      [1280, W('sempre') - 0.15, 90, [[56, ['per sempre']]], 'PER SEMPRE', 26],
    ];
    let g = E(t, -0.4, card(140, 150, 1640, 680, { rot: 0.4 }), { dy: 0 });
    cols.forEach(([x, t0, hh, lines, l, ft]) => {
      let c = T(x + 230, 228, l, { f: 'mono', size: 26, fill: I, a: 'middle', ls: 3, w: 700 });
      const head = lines.map(([by, parts]) => inl(x + 28, top + by, parts, { ink: I, slot: SL, size: 30 })).join('');
      c += cblock(x, top, 460, head, [{ h: 120 }], { st: I, fill: FILL, hh, tc: I, ft });
      c += block(x + 34, top + hh + 20, 340, 'istruzioni', { h: 80, st: I, fill: C.cream, tc: I, size: 32 });
      g += E(t, t0, c, { dy: 14 });
    });
    g += E(t, W('dieci'), IT(410, 680, 'per esempio 10', { fill: I, size: 42, a: 'middle' }));
    g += E(t, W('domande') - 0.2, IT(960, 680, 'tutte le domande del quiz', { fill: I, size: 42, a: 'middle' }));
    g += E(t, W('principale'), IT(1510, 680, 'il ciclo principale', { fill: I, size: 42, a: 'middle' }) + IT(1510, 730, 'di un videogioco', { fill: I, size: 42, a: 'middle' }));
    return lightBg() + push(g, t, D) + captionAt(t, [['Fisso,', W('fisso')], ['finché,', W('finché')], ['per', W('per', 1)], ['sempre', W('sempre')]], 'sempre', true);
  } }) });
''')
rep('sintesi', r'''
scene('sintesi', { tail: 0.5, make: (W) => ({
  capAt: W('combinandole'),
  render(t) {
    let s = '';
    const sx = 150, sy = 300;
    s += E(t, -0.15, lbl(sx + 170, 220, 'SEQUENZA', { size: 28 }) + [0, 1, 2].map(i => block(sx, sy + i * 92, 340, 'istruzione', { h: 74, size: 30 })).join(''), { dy: 10 });
    // selezione: i due rami si riuniscono (M) prima del ciclo
    const dx = 800, dy = 430, mxp = 1150;
    s += E(t, W('selezione') - 0.1, lbl(dx, 220, 'SELEZIONE', { size: 28 }) + diamond(dx, dy, 150, 90, C.line, DIM()) + T(dx, dy + 10, 'SE…?', { f: 'mono', size: 28, fill: C.line, a: 'middle', w: 700 }) +
      poly([[dx + 150, dy], [mxp, dy]], C.line, 4) + poly([[dx, dy + 90], [dx, 620], [mxp, 620]], C.line, 4) + arrow(mxp, 620, mxp, dy + 14, C.line, 4) +
      `<circle cx="${mxp}" cy="${dy}" r="9" fill="${C.line}"/>` +
      lbl(dx + 200, dy - 18, 'VERO', { size: 24 }) + lbl(dx + 20, dy + 140, 'FALSO', { size: 24, a: 'start' }), { dy: 10 });
    const lx = 1290, ly = 300;
    const loopHead = inl(lx + 28, ly + 52, ['ripeti', { oval: '10' }, 'volte'], { size: 32 });
    s += E(t, W('iterazione') - 0.1, lbl(lx + 230, 220, 'ITERAZIONE', { size: 28 }) + cblock(lx, ly, 470, loopHead, [{ h: 200 }], { hh: 80 }) +
      block(lx + 34, ly + 80 + 16, 380, 'istruzione', { h: 74, size: 30 }) + block(lx + 34, ly + 80 + 102, 380, 'istruzione', { h: 74, size: 30 }) +
      arrow(mxp, dy, mxp, 340, C.line, 0.01).slice(0, 0) + poly([[mxp, dy], [mxp, ly + 40]], C.line, 4) + arrow(mxp, ly + 40, lx - 6, ly + 40, C.line, 4), { dy: 10 });
    s += E(t, W('combinandole') - 0.2, arrow(sx + 360, sy + 130, dx - 165, dy, C.line, 4), { dy: 0 });
    const t0 = W('combinandole');
    if (t > t0) {
      const P = [[sx - 30, sy + 10], [sx - 30, sy + 230], [sx + 360, sy + 130], [dx - 150, dy], [dx, dy - 90], [dx + 150, dy], [mxp, dy], [mxp, ly + 40], [lx + 18, ly + 40]];
      const tot = 2.6, q = (t - t0) / tot;
      let p;
      if (q < 1) p = along(P, eio(q));
      else { const r = ((t - t0 - tot) % 1.4) / 1.4; p = along([[lx + 18, ly + 40], [lx + 18, ly + 300], [lx + 500, ly + 300], [lx + 500, ly + 40], [lx + 18, ly + 40]], r); }
      s += token(p[0], p[1]);
    }
    s += E(t, W('qualsiasi'), IT(960, 800, '= qualsiasi programma', { a: 'middle', size: 52 }));
    return s + caption(t, W('combinandole'), 'Tre strutture combinate', '');
  } }) });
''')
s=s.replace("cblock(x, y, w, 'ripeti', [{ h: 230 }], { hh: 90, size: 38 })","cblock(x, y, w, 'per sempre', [{ h: 230 }], { hh: 90, size: 38 })")
s=s.replace("cblock(x, y, 560, 'ripeti 1000 volte', [{ h: 120 }], { hh: 90, size: 36, outline: C.coral })","cblock(x, y, 560, inl(x + 28, y + 57, ['ripeti', { oval: '1000' }, 'volte'], { size: 34 }), [{ h: 120 }], { hh: 90, size: 36, outline: C.coral })")
s=s.replace("L: 0.5, tail: 3.1","L: 0.5, tail: 3.4")
s=s.replace("s += E(t, W('programma') + 0.3, `<line x1=\"760\"","s += E(t, 0.3, `<line x1=\"760\"")
open('scenes.js','w').write(s)
