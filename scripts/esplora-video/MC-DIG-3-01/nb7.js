// 7 — evento 2: tocco (scuro). La palla toccata rotola via durante l'attesa, poi il robot riparte davvero.
scene('ev2', { make: (W) => {
  const tP = W('premuto'), tWait = W('aspetta'), tGo = tWait + 2.0;
  return {
    capAt: W('evento'), last: tGo + 0.4,
    render(t) {
      let s = floor(); const st = C.line;
      let x = t < tP ? lerp(980, 1140, eio(clamp(t / tP))) : 1140; const y = 600;
      if (t > tGo) x = 1140 + 200 * eo((t - tGo) / 1.6);
      const touching = t >= tP && t < tWait + 0.15;
      const press = touching ? eo((t - tP) / 0.2) : 0;
      // palla: ferma, poi rotola via verso destra durante l'attesa
      const roll = eio((t - tWait) / 1.6), bx = 1362 + 400 * roll, rot = roll * 400;
      s += `<g transform="translate(${bx.toFixed(1)},${y}) rotate(${rot.toFixed(1)})"><circle r="60" fill="${DIM()}" stroke="${st}" stroke-width="5"/>` +
        `<path d="M-60,0 A60,60 0 0 0 60,0" fill="none" stroke="${st}" stroke-width="3"/><line x1="0" y1="-60" x2="0" y2="60" stroke="${st}" stroke-width="3"/></g>`;
      if (roll > 0.05 && roll < 0.98) s += `<g opacity="${(1 - roll).toFixed(2)}">${[0, 1, 2].map(k => `<line x1="${bx - 90 - k * 26}" y1="${y - 30 + k * 30}" x2="${bx - 70 - k * 26}" y2="${y - 30 + k * 30}" stroke="${st}" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
      s += robot(x, y, 0, st, { coralBump: true, press, spin: t < tP || t > tGo ? t * 120 : 0 });
      s += E(t, W('tocco'), lbl(1250, 800, 'SENSORE DI TOCCO'), { dy: 0 });
      if (t > W('avviso') && t < tGo) for (let k = 0; k < 3; k++) {
        const p = ((t - W('avviso')) * 1.4 + k / 3) % 1;
        s += `<path d="M${x - 40 - 50 * p},${y - 140 - 40 * p} Q${x},${y - 190 - 70 * p} ${x + 40 + 50 * p},${y - 140 - 40 * p}" fill="none" stroke="${st}" stroke-width="4" stroke-linecap="round" opacity="${(1 - p).toFixed(2)}"/>`;
      }
      s += E(t, tWait, clock(1650, 300, 90, clamp((t - tWait) / 2.0), st) + T(1650, 450, '2 s', { f: 'pop', size: 56, a: 'middle' }), { dy: 10 });
      s += steps(t, 120, 250, [[W('ferma'), 'FERMATI'], [W('avviso'), 'AVVISO SONORO'], [tWait, 'ASPETTA 2 S'], [tGo, 'RIPRENDI']], st);
      return s + caption(t, W('evento'), 'Evento 2', '');
    } };
} });

// 8 — evento 3: pulsante A, esplorazione (scuro)
scene('ev3', { make: (W) => {
  const tA = W('a'), tR = W('ruota');
  return {
    capAt: W('evento'), last: W('caso'),
    render(t) {
      let s = floor(); const st = C.line;
      const rx = 760, ry = 520, ang = 120 * eio((t - tR) / 0.9);
      s += robot(rx, ry, ang, st, { spin: t > tR ? t * 120 : 0 });
      // ingrandimento del pulsante A (unico corallo), pressione sulla parola "A"
      const fade = 1 - clamp((t - tR) / 0.4);
      if (fade > 0) {
        const pr = t > tA ? 1 - 0.14 * Math.sin(Math.PI * clamp((t - tA) / 0.35)) : 1;
        s += E(t, W('pulsante') - 0.05, `<g opacity="${fade.toFixed(2)}"><circle cx="${rx - 82}" cy="${ry}" r="30" fill="none" stroke="${st}" stroke-width="3"/>` +
          `<line x1="${rx - 112}" y1="${ry}" x2="440" y2="${ry}" stroke="${st}" stroke-width="3" stroke-dasharray="10 8"/>` +
          `<circle cx="330" cy="${ry}" r="110" fill="${C.bg}" stroke="${st}" stroke-width="4"/>` +
          `<circle cx="330" cy="${ry}" r="${(62 * pr).toFixed(1)}" fill="${DIM()}" stroke="${C.coral}" stroke-width="8"/>` +
          T(330, ry + 22, 'A', { f: 'pop', size: 64, a: 'middle' }) + lbl(330, ry + 170, 'PULSANTE A') + '</g>', { dy: 10 });
      }
      s += E(t, W('esplorazione') - 0.05, lbl(rx, 270, 'MODALITÀ ESPLORAZIONE'), { dy: 0 });
      const sx = 1180, ex = 1740, sy = 620;
      s += E(t, W('esplorazione'), `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${sy}" stroke="${st}" stroke-width="4"/>` +
        [0, 3, 6, 9].map((v, i) => { const xx = sx + 40 + i * 160, a = [-20, 110, 30, 200][i] * Math.PI / 180;
          return `<line x1="${xx}" y1="${sy - 14}" x2="${xx}" y2="${sy + 14}" stroke="${st}" stroke-width="4"/>` + T(xx, sy + 60, `${v} s`, { f: 'mono', size: 28, a: 'middle', w: 600 }) +
            arrow(xx, sy - 90, xx + 46 * Math.cos(a), sy - 90 + 46 * Math.sin(a), st, 5) + `<circle cx="${xx}" cy="${sy - 90}" r="8" fill="${st}"/>`; }).join('') +
        pillTag((sx + ex) / 2, sy + 150, 'ESEMPIO', st, C.bg, 'middle'), { dy: 12 });
      s += E(t, W('caso'), IT((sx + ex) / 2, 420, 'a caso, ogni 3 secondi', { size: 46, a: 'middle' }), { dy: 8 });
      return s + caption(t, W('evento'), 'Evento 3', '');
    } };
} });

// 9 — il vantaggio (chiaro): ogni gestore risponde appena accade il suo evento; il ciclo intanto è in pausa
scene('vantaggio', { make: (W) => {
  const t0 = W('rispondere'), t1 = W('laltro') + 0.1;
  return {
    capAt: W('vantaggio'), last: t1,
    render(t) {
      let s = lightBg(); const ink = C.ink;
      s += E(t, -0.35, card(150, 170, 1620, 650), { dy: 0 });
      const lanes = ['CICLO PRINCIPALE', 'EVENTO 1', 'EVENTO 2', 'EVENTO 3'], X0 = 620, X1 = 1690;
      const ev = [[0.12, 0.34], [0.45, 0.62], [0.75, 0.92]];
      const run = [[0, 0.12], [0.34, 0.45], [0.62, 0.75], [0.92, 1]];
      const ph = eio((t - t0) / (t1 - t0)), hx = lerp(X0, X1, ph);
      const fillBar = (a, b, y, solid) => {
        const xa = lerp(X0, X1, a), xb = lerp(X0, X1, b), fx = clamp((hx - xa) / (xb - xa));
        return `<rect x="${xa}" y="${y - 30}" width="${xb - xa}" height="60" rx="12" fill="${C.ivory}" stroke="${ink}" stroke-width="3"${solid ? '' : ' stroke-dasharray="10 8"'}/>` +
          (solid && fx > 0 ? `<rect x="${xa}" y="${y - 30}" width="${((xb - xa) * fx).toFixed(1)}" height="60" rx="12" fill="${mix(C.cream, C.ink, 0.35)}"/>` : '');
      };
      lanes.forEach((ln, i) => {
        const y = 270 + i * 120;
        s += E(t, -0.2 + i * 0.1, T(200, y + 10, ln, { f: 'mono', size: 28, fill: ink, ls: 2, w: 700 }) +
          `<line x1="${X0}" y1="${y}" x2="${X1}" y2="${y}" stroke="${ink}" stroke-width="2" stroke-dasharray="6 10"/>`, { dy: 8 });
      });
      s += E(t, W('eventi') - 0.1, run.map(([a, b]) => fillBar(a, b, 270, true)).join('') + ev.map(([a, b]) => fillBar(a, b, 270, false)).join(''), { dy: 8 });
      ev.forEach(([a, b], i) => { s += E(t, W('eventi') + i * 0.12, fillBar(a, b, 390 + i * 120, true), { dy: 8 }); });
      if (t > t0) s += `<line x1="${hx.toFixed(1)}" y1="215" x2="${hx.toFixed(1)}" y2="650" stroke="${ink}" stroke-width="4"/><circle cx="${hx.toFixed(1)}" cy="215" r="9" fill="${ink}"/>`;
      s += E(t, W('eventi'), `<rect x="200" y="718" width="90" height="44" rx="10" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="10 8"/>` +
        T(310, 750, 'CICLO IN PAUSA', { f: 'mono', size: 28, fill: ink, ls: 2, w: 600 }) + pillTag(1560, 752, 'ESEMPIO', ink, C.ivory, 'middle'), { dy: 6 });
      return s + caption(t, W('vantaggio'), 'Il vantaggio', 'vantaggio', true);
    } };
} });

