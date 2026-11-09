import re, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
s = open('scenes.js').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (a[:60], s.count(a)); s = s.replace(a, b)

# --- icone nuove: libro aperto, studenti, foto generiche
rep("// ---- 1 — aggancio", r'''function book(cx, cy, st, k = 1, sw = 5) {
  const p = (x, y) => `${(cx + x * k).toFixed(1)},${(cy + y * k).toFixed(1)}`;
  return `<path d="M${p(0, -34)} C${p(-20, -46)} ${p(-50, -46)} ${p(-64, -38)} L${p(-64, 40)} C${p(-50, 32)} ${p(-20, 32)} ${p(0, 44)} C${p(20, 32)} ${p(50, 32)} ${p(64, 40)} L${p(64, -38)} C${p(50, -46)} ${p(20, -46)} ${p(0, -34)} Z M${p(0, -34)} L${p(0, 44)}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>` +
    `<path d="M${p(-50, -18)} L${p(-14, -14)} M${p(-50, 2)} L${p(-14, 6)} M${p(14, -14)} L${p(50, -18)} M${p(14, 6)} L${p(50, 2)}" stroke="${st}" stroke-width="${sw * 0.6}" stroke-linecap="round"/>`;
}
function student(cx, cy, st) {
  return `<circle cx="${cx}" cy="${cy - 70}" r="38" fill="none" stroke="${st}" stroke-width="5"/>` +
    `<path d="M${cx - 70},${cy + 60} C${cx - 70},${cy - 10} ${cx - 40},${cy - 22} ${cx},${cy - 22} C${cx + 40},${cy - 22} ${cx + 70},${cy - 10} ${cx + 70},${cy + 60}" fill="none" stroke="${st}" stroke-width="5" stroke-linecap="round"/>`;
}
// ---- 1 — aggancio''')
rep('''  if (v === 2) s +=''', '''  if (v === 3) s += `<path d="M${x + w * 0.08},${y + h * 0.84} L${x + w * 0.38},${y + h * 0.42} L${x + w * 0.56},${y + h * 0.66} L${x + w * 0.7},${y + h * 0.5} L${x + w * 0.92},${y + h * 0.84}" fill="none" stroke="${st}" stroke-width="3" stroke-linejoin="round"/><circle cx="${x + w * 0.76}" cy="${y + h * 0.26}" r="${h * 0.1}" fill="none" stroke="${st}" stroke-width="2.5"/>`;
  if (v === 4) s += `<circle cx="${x + w * 0.5}" cy="${y + h * 0.38}" r="${h * 0.15}" fill="none" stroke="${st}" stroke-width="3"/><path d="M${x + w * 0.28},${y + h * 0.9} C${x + w * 0.28},${y + h * 0.62} ${x + w * 0.72},${y + h * 0.62} ${x + w * 0.72},${y + h * 0.9}" fill="none" stroke="${st}" stroke-width="3"/>`;
  if (v === 5) s += book(x + w / 2, y + h / 2 + 4, st, h / 140, 3);
  if (v === 2) s +=''')

# --- punto 3 e 4: minimo, PRIMA a sinistra
a = s.index("scene('minimo'"); b = s.index("// ---- 4 — il ciclo")
s = s[:a] + r'''scene('minimo', { make: (W) => ({
  capAt: W('costruisci'), last: W('rischiose'),
  render(t) {
    // DOPO (a destra): prodotto completo, entra con la prima parola
    let s = E(t, W('prima') - 0.05, bigApp(1120, 220, C.line, '12 10') + lbl(1430, 800, 'PRODOTTO COMPLETO'), { dy: 12 });
    s += E(t, W('completo') - 0.1, pillTag(1430, 190, 'DOPO', C.line, C.bg, 'middle'), { dy: 6 });
    // PRIMA (a sinistra): prodotto minimo, una pagina sola, corallo
    s += E(t, W('minimo') - 0.15, browser(270, 330, 300, 360, C.coral, { sw: 5 }) +
      `<rect x="300" y="400" width="240" height="110" rx="8" fill="none" stroke="${C.line}" stroke-width="3.5"/><path d="M300,550 H540 M300,590 H470 M300,630 H510" stroke="${C.line}" stroke-width="3.5" stroke-linecap="round"/>` +
      lbl(420, 750, 'PRODOTTO MINIMO'), { dy: 12 });
    s += E(t, W('costruisci') - 0.1, pillTag(420, 290, 'PRIMA', C.line, C.bg, 'middle'), { dy: 6 });
    // freccia del tempo: prima -> dopo
    const pa = ss((t - W('minimo') - 0.3) / 0.6);
    if (pa > 0) s += `<line x1="640" y1="510" x2="${640 + 400 * pa}" y2="510" stroke="${C.line}" stroke-width="5" stroke-linecap="round" stroke-dasharray="14 12"/>` + (pa > 0.95 ? arrowHead(1060, 510, 0, C.line) : '');
    s += E(t, W('testare') - 0.1, lbl(420, 810, 'TESTA LE IPOTESI') + lbl(420, 850, 'PIÙ RISCHIOSE'), { dy: 6 });
    return s + caption(t, W('costruisci'), 'Prima il prodotto minimo', '');
  } }) });

''' + s[b:]

# --- punto 2: ciclo completo insieme, icona libro per Impara
rep("bulb(x, y + 2, st, 4, 0.62)", "book(x, y + 2, st, 0.8, 4.5)")
rep("T(n.lx, n.ly + 40, n.en, { f: 'mono', size: 26,", "T(n.lx, n.ly + 42, n.en, { f: 'mono', size: 28,")
rep("  s += arcSeg(-90, 30, (t - at[1] + 0.3) / 0.5, C.line);\n  s += arcSeg(30, 150, (t - at[2] + 0.3) / 0.5, C.line);\n  s += arcSeg(150, 270, (t - at[2] - 0.3) / 0.6, C.line);",
    "  s += arcSeg(-90, 30, (t - at[1] + 0.3) / 0.5, C.line);\n  s += arcSeg(30, 150, (t - at[2] + 0.3) / 0.4, C.line);\n  s += arcSeg(150, 270, (t - at[2] + 0.3) / 0.4, C.line);")
rep("capAt: W('costruisci'), last: W('impara'),", "capAt: W('costruisci'), last: W('impara') + 0.2,")

# --- MVP: etichetta 28
rep("lbl(254, 420, 'MINIMUM VIABLE PRODUCT', { a: 'start', fill: C.ink })", "lbl(254, 424, 'MINIMUM VIABLE PRODUCT', { a: 'start', fill: C.ink, size: 28 })")

# --- punti 1,5,8,9: esempio inventato con ipotesi
a = s.index("scene('esempio'"); b = s.index("// ---- 8 — misura")
s = s[:a] + r'''scene('esempio', { make: (W) => ({
  capAt: W('semplice'), last: W('davvero'),
  render(t) {
    let s = E(t, 0.05, IT(140, 200, 'Esempio inventato', { size: 56 }), { dy: 8 });
    s += E(t, 0.15, pillTag(1690, 214, 'ESEMPIO', C.line, C.bg, 'middle'), { dy: 6 });
    const tP = W('pagina') - 0.15;
    if (t < tP) {  // pittogramma: ripetizioni fra studenti
      s += E(t, W('ripetizioni') - 0.15, student(760, 470, C.line) + student(1160, 470, C.line) +
        `<path d="M600,560 H1320" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>` + book(960, 500, C.line, 0.9, 4.5) +
        lbl(960, 680, 'RIPETIZIONI FRA STUDENTI'), { dy: 12 });
    } else {
      s += E(t, tP, browser(140, 240, 760, 560, C.line, { sw: 5 }) + lbl(520, 222, 'UNA PAGINA WEB'), { dy: 12 });
      [3, 4, 5].forEach((v, i) => { s += E(t, W('foto') - 0.15 + i * 0.15, photo(172 + i * 240, 310, 216, 150, C.line, v), { dy: 10 }); });
      s += E(t, W('foto') + 0.2, lbl(520, 508, 'QUALCHE FOTO'), { dy: 6 });
      s += E(t, W('modulo') - 0.15,
        `<rect x="172" y="556" width="440" height="50" rx="8" fill="none" stroke="${C.line}" stroke-width="3.5"/><rect x="172" y="622" width="440" height="50" rx="8" fill="none" stroke="${C.line}" stroke-width="3.5"/>` +
        `<rect x="172" y="694" width="180" height="56" rx="28" fill="${C.line}"/><path d="M246,708 L292,722 L246,736 Z" fill="${C.bg}"/>` +
        lbl(756, 640, 'MODULO', {}) + lbl(756, 680, 'DI CONTATTO', {}), { dy: 10 });
    }
    // funzioni assenti
    s += E(t, W('senza') - 0.15, lbl(1010, 268, 'SENZA:', { a: 'start' }), { dy: 6 });
    GH.forEach(([lab, w], i) => {
      const x = 1110 + i * 280, y = 360, t0 = W(w) - 0.15;
      s += E(t, t0, ghostIcon(i, x, y, C.line) + lbl(x, y + 96, lab), { dy: 8 });
      s += cross(x, y, 56, C.line, (t - t0 - 0.25) / 0.45, 8);
    });
    // l'ipotesi che la pagina deve testare (unico elemento corallo)
    s += E(t, W('ipotesi') - 0.15, `<rect x="1000" y="540" width="790" height="250" rx="18" fill="none" stroke="${C.coral}" stroke-width="5"/>` +
      lbl(1395, 610, 'IPOTESI DA TESTARE'), { dy: 10 });
    s += E(t, W('qualcuno') - 0.1, IT(1395, 712, 'Qualcuno pagherà davvero?', { size: 62, a: 'middle' }), { dy: 8 });
    return s + caption(t, W('semplice'), 'Una semplice pagina web', '');
  } }) });

''' + s[b:]

# --- misura: etichette 28
rep("lbl(bx + 95, by + 34, '1° USO', { size: 24 }) + lbl(bx + 245, by + 34, 'RITORNO', { size: 24 })", "lbl(bx + 95, by + 36, '1° USO', { size: 28 }) + lbl(bx + 245, by + 36, 'RITORNO', { size: 28 })")

# --- impara: icona libro + ritorno a Costruisci
rep("bulb(170 + 70, 230, C.line, 4, 0.55) + T(300, 250,", "book(236, 228, C.line, 0.75, 4.5) + T(300, 250,")
rep("    const p4 = ss((t - W('oppure') + 0.05) / 0.5);", r'''    // il ciclo ricomincia: dal pivot di nuovo a Costruisci
    const pr = ss((t - W('cambia') + 0.05) / 0.5);
    if (pr > 0) s += `<line x1="1420" y1="524" x2="${1420 + 140 * pr}" y2="524" stroke="${C.line}" stroke-width="3.5" stroke-linecap="round"/>` + (pr > 0.95 ? arrowHead(1580, 524, 0, C.line, 18) : '');
    s += E(t, W('cambia') + 0.3, `<circle cx="1680" cy="520" r="62" fill="none" stroke="${C.line}" stroke-width="4"/>` + hammer(1683, 527, C.line, 0.68) +
      lbl(1680, 626, 'DI NUOVO:') + lbl(1680, 662, 'COSTRUISCI'), { dy: 8 });
    const p4 = ss((t - W('oppure') + 0.05) / 0.5);''')

# --- pivot: PARTENZA e NUOVA DIREZIONE
rep("T(mx + 140, my + 520, 'PARTENZA', { f: 'mono', size: 24, fill: C.ink, ls: 2, w: 600 })", "T(mx + 110, my + 530, 'PARTENZA', { f: 'mono', size: 26, fill: C.ink, ls: 2, w: 600, a: 'middle' })")
rep("T(mx + 660, my + 340, 'NUOVA DIREZIONE', { f: 'mono', size: 24, fill: C.ink, ls: 2, w: 600, a: 'middle' })",
    "T(mx + 660, my + 158, 'NUOVA', { f: 'mono', size: 26, fill: C.ink, ls: 2, w: 600, a: 'middle' }) + T(mx + 660, my + 192, 'DIREZIONE', { f: 'mono', size: 26, fill: C.ink, ls: 2, w: 600, a: 'middle' })")
# lean: IL METODO 28
rep("lbl(960, 260, 'IL METODO', { fill: C.ink })", "lbl(960, 260, 'IL METODO', { fill: C.ink, size: 28 })")
open('scenes.js', 'w').write(s)
print('ok')
