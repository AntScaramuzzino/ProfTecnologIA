// 2 — un codice della rete, inserito nella pagina, salva nel browser un cookie di terze parti
scene('cookie', { make: (W) => ({
  capAt: W('cookie'),
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, win(140, 150, 1640, 700, { light: true, st: C.ink, url: 'negozio.esempio' }), { dy: 0 });
    s += E(t, -0.2, shoe(220, 330, 2.2, C.ink, 'none', 5) + lbl(200, 290, 'PAGINA DEL PRODOTTO', { a: 'start', fill: C.ink }) + bars(220, 600, 440, 4, C.ink), { dy: 10 });
    // codice della rete inserito nella pagina
    s += E(t, W('codice') - 0.1, `<rect x="740" y="400" width="360" height="130" rx="12" fill="${C.cream}" stroke="${C.ink}" stroke-width="3.5"/>` +
      T(920, 455, 'CODICE', { f: 'mono', size: 28, fill: C.ink, a: 'middle', w: 700, ls: 3 }) + T(920, 497, 'DELLA RETE', { f: 'mono', size: 28, fill: C.ink, a: 'middle', w: 700, ls: 3 }), { dy: 12 });
    s += E(t, W('inserito') - 0.1, lbl(920, 570, 'NELLA PAGINA', { fill: C.ink }), { dy: 6 });
    // memoria del browser
    s += E(t, W('browser') - 0.15, `<rect x="1200" y="240" width="520" height="570" rx="16" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="12 10"/>` +
      lbl(1460, 292, 'MEMORIA DEL BROWSER', { fill: C.ink }), { dy: 0 });
    const t0 = W('salva');
    if (t > t0) {
      const p = eio((t - t0) / 1.0), x = lerp(860, 1400, p), y = lerp(380, 330, p) - Math.sin(p * Math.PI) * 80;
      s += E(t, t0, cookieFile(x, y, C.ink, C.coral, { ink: C.ink }), { dy: 0, blur: 6 });
    }
    s += E(t, W('cookie'), lbl(1460, 530, 'COOKIE', { fill: C.ink, size: 30 }), { dy: 8 });
    s += E(t, W('terze'), pillTag(1460, 610, 'DI TERZE PARTI', C.ink, C.cream, 'middle'), { dy: 8 });
    s += E(t, W('cioè') - 0.05, lbl(1460, 690, '= DELLA RETE,', { fill: C.ink, size: 28 }) + lbl(1460, 740, 'NON DEL NEGOZIO', { fill: C.ink, size: 28 }), { dy: 8 });
    return s + caption(t, W('cookie'), 'Cookie di terze parti', '', true);
  } }) });

// 3 — il browser contatta la rete e le rimanda il cookie: parte il segnale
scene('rete', { make: (W) => ({
  capAt: W('segnale'),
  render(t) {
    let s = '';
    s += E(t, -0.4, win(120, 260, 620, 460, { url: 'negozio.esempio' }) + shoe(170, 380, 1.4, C.line, 'none', 4) + bars(170, 560, 220, 3, C.line, 32, 11) +
      `<rect x="460" y="360" width="240" height="300" rx="12" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="10 8"/>` + cookieFile(520, 400, C.line, DIM(), { ink: C.line }) + lbl(580, 600, 'COOKIE'), { dy: 0 });
    s += E(t, W('rete') - 0.1, rack(1330, 300, 380, C.line, t) + lbl(1520, 610, 'RETE PUBBLICITARIA'), { dy: 12 });
    s += E(t, W('contatta') - 0.1, dash(744, 450, 1320, 400, C.line, t) + lbl(744, 240, 'BROWSER', { a: 'end' }), { dy: 0 });
    // il segnale: parte dal browser e porta con sé il cookie
    const pk = `<rect x="-40" y="-26" width="80" height="52" rx="10" fill="${C.coral}"/><path d="M-14,-15 H6 L14,-7 V15 H-14 Z" fill="none" stroke="${C.ivory}" stroke-width="3" stroke-linejoin="round"/>`;
    s += travel(t, W('rimanda') - 0.1, 790, 446, 1290, 403, pk, 0.65);
    s += E(t, W('questo') - 0.1, `<rect x="780" y="560" width="520" height="190" rx="14" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` +
      T(810, 615, 'QUESTO BROWSER', { f: 'mono', size: 28, ls: 3, w: 600 }) + T(810, 665, 'HA VISITATO LA PAGINA', { f: 'mono', size: 28, ls: 3, w: 600 }) +
      T(810, 715, 'DEL PRODOTTO', { f: 'mono', size: 28, ls: 3, w: 600 }), { dy: 14 });
    return s + caption(t, W('segnale'), 'Il segnale alla rete', '');
  } }) });

// 4 — il profilo: senza nome, ma legato al codice del cookie o all'impronta del browser
function miniBrowser(x, y, st) {
  return `<rect x="${x}" y="${y}" width="120" height="100" rx="10" fill="none" stroke="${st}" stroke-width="3.5"/><line x1="${x}" y1="${y + 24}" x2="${x + 120}" y2="${y + 24}" stroke="${st}" stroke-width="3"/>` +
    [0, 1, 2].map(i => `<circle cx="${x + 14 + i * 13}" cy="${y + 12}" r="4" fill="none" stroke="${st}" stroke-width="2"/>`).join('') +
    [0, 1, 2].map(i => `<rect x="${x + 14}" y="${y + 40 + i * 18}" width="${[90, 70, 80][i]}" height="8" rx="4" fill="${st}" opacity="0.8"/>`).join('');
}
scene('profilo', { tail: 0.9, make: (W) => ({
  capAt: W('senza'),
  render(t) {
    let s = lightBg();
    const px = 960, py = 170, pw = 780, ph = 620;
    s += E(t, -0.4, card(px, py, pw, ph) + T(px + 50, py + 100, 'Profilo', { f: 'pop', size: 72, fill: C.ink }) +
      T(px + 50, py + 160, 'ID 7F3A-91C2', { f: 'mono', size: 30, fill: C.ink, w: 700, ls: 2 }) + T(px + 320, py + 160, '(ESEMPIO)', { f: 'mono', size: 28, fill: C.ink, ls: 2, w: 600 }) +
      `<line x1="${px + 50}" y1="${py + 200}" x2="${px + pw - 50}" y2="${py + 200}" stroke="${C.ink}" stroke-width="2.5"/>`, { dy: 0 });
    s += E(t, W("l'informazione"), `<rect x="${px + 50}" y="${py + 240}" width="${pw - 100}" height="96" rx="12" fill="${C.coral}"/>` +
      T(px + 80, py + 302, 'HA VISITATO: PRODOTTO', { f: 'mono', size: 30, fill: C.ivory, w: 700, ls: 2 }), { dy: 18 });
    s += E(t, W('senza'), pillTag(px + 50, py + 420, 'NOME: NESSUNO', C.ink, C.cream), { dy: 10 });
    s += E(t, W('legato') - 0.1, T(px + 50, py + 520, 'ma legato al browser', { f: 'serif', it: true, size: 50, fill: C.ink }), { dy: 10 });
    s += E(t, W('legato') - 0.1, lbl(150, 215, 'LEGATO A:', { a: 'start', fill: C.ink, size: 28 }), { dy: 8 });
    s += E(t, W('codice') - 0.1, cookieFile(160, 250, C.ink, C.cream, { ink: C.ink, w: 100, h: 125 }) + T(300, 305, 'CODICE', { f: 'mono', size: 28, fill: C.ink, w: 700, ls: 3 }) +
      T(300, 345, 'DEL COOKIE', { f: 'mono', size: 28, fill: C.ink, w: 700, ls: 3 }) + arrow(640, 325, px - 30, 400, C.ink), { dy: 12 });
    s += E(t, W('o') - 0.05, IT(160, 470, 'oppure', { fill: C.ink, size: 52 }), { dy: 10 });
    s += E(t, W("all'impronta") - 0.1, miniBrowser(160, 540, C.ink) + T(300, 570, 'IMPRONTA', { f: 'mono', size: 28, fill: C.ink, w: 700, ls: 3 }) +
      T(300, 610, 'DEL BROWSER', { f: 'mono', size: 28, fill: C.ink, w: 700, ls: 3 }) +
      T(160, 700, 'SCHERMO · LINGUA', { f: 'mono', size: 24, fill: C.ink, w: 600, ls: 2 }) + T(160, 740, 'FONT · FUSO ORARIO', { f: 'mono', size: 24, fill: C.ink, w: 600, ls: 2 }) +
      arrow(640, 590, px - 30, 540, C.ink), { dy: 12 });
    return s + caption(t, W('senza'), 'Profilo senza nome', '', true);
  } }) });
