//@@intro
scene('intro', { make: (W) => ({
  capAt: W('due'), last: W('asimmetrica') + 0.3,
  render(t) {
    let s = words(t, -0.2, 960, 250, 'La crittografia moderna', { f: 'pop', size: 84, a: 'middle' });
    s += E(t, W('simmetrica') - 0.1, padlock(560, 470, 1.3, C.line, DIM()) + key(560, 690, 1.15, C.line, DIM(), 2), { dy: 18 });
    s += E(t, W('simmetrica'), lbl(560, 830, 'SIMMETRICA', { size: 30 }), { dy: 10 });
    s += E(t, W('asimmetrica') - 0.15, padlock(1360, 470, 1.3, C.line, DIM()) + key(1230, 680, 1.0, C.line, DIM(), 0) + lbl(1230, 750, 'CHIUDE', { size: 24 }), { dy: 18 });
    s += E(t, W('asimmetrica') + 0.15, key(1500, 680, 1.0, C.ivory, C.coral, 1) + lbl(1500, 750, 'APRE', { size: 24 }), { dy: 18 });
    s += E(t, W('asimmetrica'), lbl(1360, 830, 'ASIMMETRICA', { size: 30 }), { dy: 10 });
    return s + caption(t, W('due'), 'Due grandi famiglie', '');
  } }) });

//@@tragitto
scene('tragitto', { make: (W) => ({
  capAt: W('tragitto'), last: W('intercetti') + 0.3,
  render(t) {
    const st = C.line;
    let s = E(t, -0.3, person(280, 400, 1.15, st, DIM()) + lbl(280, 550, 'CHI MANDA'), { dy: 0 });
    s += E(t, W('destinatario') - 0.15, person(1640, 400, 1.15, st, DIM()) + lbl(1640, 550, 'DESTINATARIO'), { dy: 12 });
    s += E(t, -0.2, `<line x1="420" y1="400" x2="1500" y2="400" stroke="${C.lineDim}" stroke-width="4" stroke-dasharray="4 14" stroke-linecap="round"/>`, { dy: 0, blur: 0 });
    const t0 = W('sapere'), t1 = W('tragitto') + 1.0, p = clamp((t - t0) / (t1 - t0)), kx = lerp(470, 1180, p);
    if (t > t0 - 0.2) s += E(t, t0 - 0.2, key(kx, 400, 1.25, st, C.bg, 2), { dy: 0, blur: 6 });
    s += E(t, W('qualcuno') - 0.1, person(960, 690, 1.05, st, DIM()) + lbl(960, 820, 'QUALCUNO?'), { dy: 14 });
    const ti = W('intercetti') - 0.05;
    if (t > ti) { const g = eo((t - ti) / 0.4); s += `<path d="M935,612 L${lerp(935, kx - 30, g)},${lerp(612, 440, g)} M985,612 L${lerp(985, kx + 30, g)},${lerp(612, 440, g)}" stroke="${C.coral}" stroke-width="5" stroke-dasharray="6 10" stroke-linecap="round"/>`; }
    return s + caption(t, W('tragitto'), 'Nel tragitto', '');
  } }) });

//@@crolla
scene('crolla', { make: (W) => ({
  capAt: W('sicurezza'), last: W('crolla'),
  render(t) {
    const st = C.line, oc = clamp((t - W('crolla')) / 0.35);
    let s = E(t, -0.3, envelope(300, 360, 230, st, DIM()) + key(300, 375, 0.75, st, C.bg, 2) + lbl(300, 480, 'EMAIL'), { dy: 12 });
    s += E(t, W('email') - 0.1, arrow(440, 360, 1020, 360, C.lineDim, 4), { dy: 0, blur: 0 });
    s += E(t, W('email'), person(1130, 360, 1.05, st, DIM()) + lbl(1130, 500, 'DESTINATARIO'), { dy: 12 });
    s += E(t, -0.1, `<g opacity="${t > W('crolla') - 0.05 ? 0 : 1}">${padlock(1600, 640, 1.2, st, DIM(), 0)}</g>` + lbl(1600, 800, 'MESSAGGI CIFRATI'), { dy: 12 });
    const ic = W('intercettata');
    s += E(t, ic - 0.1, arrow(730, 370, 730, 560, st, 4) + person(730, 700, 0.95, st, DIM()), { dy: 0 });
    s += E(t, ic + 0.3, key(930, 690, 0.95, st, DIM(), 2) + lbl(930, 790, 'COPIA'), { dy: 10 });
    s += E(t, W('sicurezza') - 0.1, `<path d="M1030,690 C1200,700 1320,670 1500,660" fill="none" stroke="${st}" stroke-width="4" stroke-dasharray="6 10" stroke-linecap="round"/>`, { dy: 0, blur: 0 });
    if (t > W('crolla') - 0.05) s += E(t, W('crolla') - 0.05, padlock(1600, 640, 1.2, C.coral, C.bg, oc), { dy: 0, blur: 4, d: 0.3 });
    return s + caption(t, W('sicurezza'), 'La sicurezza crolla', '');
  } }) });

//@@idea
scene('idea', { make: (W) => ({
  capAt: W('due', 1), last: W('matematicamente'),
  render(t) {
    const st = C.line;
    let s = E(t, W('millenovecentosettantasei') - 0.1, T(960, 330, '1976', { f: 'pop', size: 150, a: 'middle' }), { dy: 20 });
    s += E(t, W('crittografi') - 0.15, person(560, 300, 0.85, st, DIM()), { dy: 14 });
    s += E(t, W('crittografi') - 0.05, person(1360, 300, 0.85, st, DIM()), { dy: 14 });
    s += E(t, W('crittografi'), lbl(960, 190, 'DUE CRITTOGRAFI'), { dy: 8 });
    s += E(t, W('rivoluzionaria') - 0.1, IT(960, 430, "un'idea rivoluzionaria", { size: 60, a: 'middle' }));
    s += E(t, W('due', 1) - 0.1, key(640, 610, 1.6, st, DIM(), 0), { dy: 14 });
    s += E(t, W('diverse') - 0.15, key(1300, 610, 1.6, C.ivory, C.coral, 1), { dy: 14 });
    s += E(t, W('collegate') - 0.1, `<line x1="770" y1="610" x2="1150" y2="610" stroke="${st}" stroke-width="5" stroke-dasharray="6 12" stroke-linecap="round"/>`, { dy: 0, blur: 0 });
    s += E(t, W('matematicamente') - 0.1, IT(960, 740, 'collegate matematicamente', { size: 48, a: 'middle' }), { dy: 10 });
    return s + caption(t, W('due', 1), 'Due chiavi diverse', '');
  } }) });

//@@solo
scene('solo', { make: (W) => ({
  capAt: W('solo'), last: W('stessa') + 0.4,
  render(t) {
    const st = C.line;
    let s = E(t, -0.3, esempio(96, 190, st, C.bg), { dy: 0 });
    s += E(t, -0.3, doc(220, 560, 220, 140, st, DIM(), 'CIAO') + lbl(220, 670, 'MESSAGGIO'), { dy: 12 });
    // l'unica chiave pubblica: quella del destinatario
    s += E(t, W('cifrato') - 0.15, key(510, 330, 1.1, st, DIM(), 0) + lbl(490, 222, 'CHIAVE PUBBLICA', { size: 24 }) + lbl(490, 256, 'DEL DESTINATARIO', { size: 24 }) +
      `<line x1="510" y1="370" x2="510" y2="530" stroke="${st}" stroke-width="3" stroke-dasharray="5 9"/>`, { dy: 12 });
    s += E(t, W('cifrato') - 0.05, arrow(340, 560, 660, 560, st, 4) + lbl(500, 610, 'CIFRA'), { dy: 0 });
    s += E(t, W('pubblica') - 0.05, doc(780, 560, 220, 140, st, DIM(), 'Q#9Z') + lbl(780, 670, 'CIFRATO'), { dy: 12 });
    // ramo basso: chiave privata del destinatario
    s += E(t, W('privata') - 0.15, arrow(900, 600, 1010, 700, st, 4) + key(1150, 720, 1.1, C.ivory, C.coral, 1) + lbl(1140, 810, 'CHIAVE PRIVATA', { size: 24 }) + lbl(1140, 844, 'DEL DESTINATARIO', { size: 24 }), { dy: 12 });
    s += E(t, W('corrispondente') - 0.1, arrow(1260, 720, 1340, 720, st, 4) + doc(1460, 720, 210, 130, st, DIM(), 'CIAO') + lbl(1460, 820, 'DECIFRATO', { size: 24 }), { dy: 12 });
    s += E(t, W('corrispondente') + 0.15, person(1740, 710, 0.75, st, DIM()) + lbl(1740, 800, 'DESTINATARIO', { size: 24 }), { dy: 12 });
    // ramo alto: la STESSA chiave pubblica non decifra
    s += E(t, W('non') - 0.1, arrow(900, 520, 1060, 370, st, 4) + `<path d="M620,330 H1080" stroke="${st}" stroke-width="3" stroke-dasharray="5 9"/><circle cx="1090" cy="340" r="9" fill="${st}"/>`, { dy: 0, blur: 0 });
    s += E(t, W('stessa') - 0.1, arrow(1110, 345, 1290, 345, st, 4) + doc(1420, 345, 210, 130, st, DIM(), 'Q#9Z') +
      `<line x1="1325" y1="400" x2="1515" y2="290" stroke="${st}" stroke-width="6" stroke-linecap="round"/>` + lbl(1420, 450, 'ILLEGGIBILE', { size: 24 }), { dy: 8 });
    return s + caption(t, W('solo'), 'Solo la privata decifra', '');
  } }) });

//@@cassetta
scene('cassetta', { make: (W) => ({
  capAt: W('chiunque'), last: W('proprietario') + 1.5 + 0.9,
  render(t) {
    const st = C.line, X0 = 800, X1 = 1120, Y0 = 240, Y1 = 780;
    const tk = W('proprietario') - 0.1, tin = tk + 1.4, top = tin + 0.5;
    const op = eio((t - top) / 0.6);
    let s = '';
    let box = `<rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="16" fill="url(#hatch)" stroke="${st}" stroke-width="5"/>` +
      `<rect x="${X0 + 22}" y="${Y0 + 22}" width="${X1 - X0 - 44}" height="${Y1 - Y0 - 44}" rx="8" fill="${C.bg}" stroke="${st}" stroke-width="3"/>`;
    box += `<rect x="880" y="314" width="160" height="20" rx="6" fill="${C.bg}" stroke="${st}" stroke-width="4"/>`;
    if (op > 0) box += [0, 1, 2].map(i => envelope(930 + (i - 1) * 14, 690 - i * 32, 140, st, DIM(), 3)).join('');
    const sx = 1 - 0.85 * op;
    box += `<g transform="translate(840,0) scale(${sx.toFixed(3)},1) translate(-840,0)"><rect x="840" y="420" width="200" height="320" rx="8" fill="${DIM()}" stroke="${st}" stroke-width="4"/></g>`;
    // serratura sul telaio (resta ferma quando lo sportello si apre)
    box += `<rect x="1054" y="540" width="42" height="70" rx="6" fill="${C.bg}" stroke="${st}" stroke-width="4"/><circle cx="1075" cy="568" r="8" fill="${st}"/><rect x="1072" y="570" width="6" height="18" rx="2" fill="${st}"/>`;
    s += E(t, -0.4, box, { dy: 0 });
    [['chiunque', 640], ['infilare', 960], ['messaggio', 1280]].forEach(([w, x0], i) => {
      const t0 = W(w) - 0.15, p = eio((t - t0) / 0.8);
      if (p <= 0) return;
      const x = lerp(x0, 960, p), y = lerp(140, 380, p), rot = lerp((i - 1) * 25, 90, p);
      s += `<clipPath id="cl${i}"><rect x="0" y="0" width="1920" height="324"/></clipPath><g clip-path="url(#cl${i})" opacity="${clamp(p * 3)}"><g transform="rotate(${rot} ${x} ${y})">${envelope(x, y, 120, st, C.bg, 3)}</g></g>`;
    });
    s += E(t, W('fessura') - 0.1, `<line x1="760" y1="324" x2="870" y2="324" stroke="${st}" stroke-width="3"/>` + lbl(740, 334, 'FESSURA', { a: 'end' }) + IT(740, 390, 'chiave pubblica: cifrare', { size: 40, a: 'end' }), { dy: 8 });
    // chiave del proprietario: compare, resta ferma, entra e rimane inserita
    const pk = eio((t - tin) / 0.45), kx = lerp(1420, 1075 + 66 * 1.1, pk);
    if (t > tk) s += E(t, tk, key(kx, 575, 1.1, C.ivory, C.coral, 1, 180), { dy: 0 });
    s += E(t, W('proprietario') - 0.1, `<line x1="1180" y1="470" x2="1090" y2="536" stroke="${st}" stroke-width="3"/>` + lbl(1190, 470, 'SERRATURA', { a: 'start' }) + IT(1190, 420, 'chiave privata: decifrare', { size: 40 }), { dy: 8 });
    return s + caption(t, W('chiunque'), 'Chiunque può infilare', '');
  } }) });
