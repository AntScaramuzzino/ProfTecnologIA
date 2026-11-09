import re
s=open('scenes.js').read()
def block(start,end,new):
    global s
    i=s.index(start); j=s.index(end)
    s=s[:i]+new+s[j:]
def R(a,b):
    global s
    assert s.count(a)==1,(a,s.count(a)); s=s.replace(a,b)
# 7: hook, fascia libera dietro la pillola
R("const P = [[300, 420], [520, 520], [760, 430], [1000, 540], [1240, 440], [1480, 530], [1700, 420], [380, 680], [640, 740], [900, 690], [1160, 760], [1420, 690], [1660, 740]];",
  "const P = [[300, 400], [540, 460], [780, 400], [1020, 460], [1260, 400], [1500, 460], [1720, 400], [380, 760], [640, 810], [900, 760], [1160, 810], [1420, 760], [1660, 810]];")
# 3 + 4: crawler multipli, legenda, linee sotto le schede
block("// 3 — i crawler", "// 5 — la pagina", r'''// 3 — i crawler, i "ragni": più programmi in parallelo (uno solo corallo)
const V1 = 260, OFF = [0, 0.6, 1.2];
function spiders(t, tt, v, show) {
  let s = '';
  GPATHS.forEach((P, k) => { if (!show(k)) return; const q = crawlPos(tt - OFF[k] * 0, v, P); s += spider(q.x, q.y, k ? 13 : 16, t + k, k ? C.line : C.coral); });
  return s;
}
scene('crawler', { make: (W) => ({
  capAt: W('crawler'),
  render(t) {
    let s = webGraph(t, -0.4);
    s += words(t, W('programmi'), 96, 300, 'programmi', { f: 'pop', size: 64 });
    s += words(t, W('automatici'), 96, 376, 'automatici', { f: 'pop', size: 64 });
    s += E(t, W('crawler'), T(96, 520, 'crawler', { f: 'pop', size: 104 }));
    s += E(t, W('ragni'), IT(100, 596, 'cioè «ragni»', { size: 54 }));
    if (t > W('crawler') - 0.1) s += E(t, W('crawler') - 0.1, spiders(t, t - W('girano'), V1, k => k === 0 || t > W('girano') - 0.1 + 0.15 * k), { dy: 0, blur: 6 });
    return s + caption(t, W('crawler'), 'Crawler: i ragni', '');
  } }) });

// 4 — seguono i link; le pagine vengono lette, ma non tutte finiscono nell'indice
const V2 = 520, NOIDX = [3, 8, 10];
scene('link', { make: (W) => {
  const t0 = 0.1, VT = GPATHS.map(P => visitTimes(V2, P));
  const vt = i => Math.min(...VT.map(v => v[i] ?? 1e9));
  return {
    capAt: W('ma'),
    render(t) {
      const ti = W('ma');
      // link già percorsi: disegnati sotto le schede
      let under = '';
      GPATHS.forEach(P => {
        const q = crawlPos(t - t0, V2, P);
        for (let i = 0; i < Math.min(q.seg, P.length - 1); i++) { const A = GN[P[i]], B = GN[P[i + 1]]; under += `<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${C.line}" stroke-width="4"/>`; }
        if (q.seg < P.length - 1) { const A = GN[P[q.seg]]; under += `<line x1="${A[0]}" y1="${A[1]}" x2="${q.x}" y2="${q.y}" stroke="${C.line}" stroke-width="4"/>`; }
      });
      let s = webGraph(t, -0.6, {
        under,
        visited: i => t - t0 >= vt(i),
        state: i => t >= ti && t - t0 >= vt(i) ? (NOIDX.includes(i) ? 'no' : 'yes') : null,
      });
      s += spiders(t, t - t0, V2, () => true);
      s += words(t, W('seguono'), 96, 300, 'seguono i link', { f: 'pop', size: 64 });
      s += E(t, W('pagina'), IT(100, 376, 'da una pagina all’altra', { size: 48 }));
      s += E(t, W('lette'), `<rect x="100" y="478" width="48" height="38" rx="5" fill="${mix(C.bg, C.line, 0.24)}" stroke="${C.line}" stroke-width="3"/>` + lbl(168, 510, 'VISITATA E LETTA', { a: 'start', size: 28 }));
      s += E(t, ti, check(124, 580, 24, C.line, C.bg) + lbl(168, 590, 'INDICIZZATA', { a: 'start', size: 28 }));
      s += E(t, ti + 0.2, cross(124, 660, 24, C.line, C.bg) + lbl(168, 670, 'NON INDICIZZATA', { a: 'start', size: 28 }));
      return s + caption(t, W('ma'), 'Non tutte indicizzate', '');
    } };
} });

''')
s=s.replace("fill: vis ? mix(C.bg, C.line, 0.24) : C.bg","fill: vis ? mix(C.bg, C.line, 0.24) : C.bg")
# 3: catalogo
R("scene('catalogo', { tail: 0.6,","scene('catalogo', { tail: 1.4,")
R("s += E(t, -0.2, dbSVG(dx, dy, dw, dh, C.line, DIM())","s += E(t, -0.2, dbSVG(dx, dy, dw, dh, C.line, DIM(), false)")
R("s += E(t, W('aggiunta'), arrow(px + pw + 60, 500, dx - 40, 500, C.line, 4));","s += E(t, W('aggiunta'), arrow(px + pw + 60, 760, dx - 40, 760, C.line, 4));")
R("const x0 = px + 70, y0 = py + 160 + i * 110, x1 = dx + 60, y1 = dy + 70 + i * 110;","const x0 = px + pw + 40, y0 = py + 160 + i * 110, x1 = dx + dw / 2, y1 = dy + 140 + i * 100;")
R("s += pillTag(x, y, g.toUpperCase(), C.line, C.bg);","s += pillTag(x, y, g.toUpperCase(), C.line, C.bg, 'middle');")
R("const x = lerp(x0, x1, p), y = lerp(y0, y1, p) - Math.sin(p * Math.PI) * 60;","const x = lerp(x0, x1, p), y = lerp(y0, y1, p);")
R("s += E(t, W('aggiunta') + 0.6, pillTag(dx + dw / 2, dy - 110,","s += E(t, W('aggiunta') + 0.1, pillTag(dx + dw / 2, dy - 110,")
# 4 + 9: ranking
R("const to = W('ordina'), p = eio((t - to) / 0.9);","const to = W('ordina'), p = eio((t - to) / 0.6);")
R("const scat = [[260, 520, -6], [620, 330, 4], [520, 690, 7], [200, 330, -3], [760, 560, -5]];",
  "const scat = [[300, 290, -0.6], [220, 406, 0.5], [320, 522, -0.4], [240, 638, 0.6], [290, 754, -0.5]];")
R("s += E(t, tf + 0.4, arrow(1340, 560, 1215, 560, C.line, 4));",
  "s += E(t, tf + 0.4, `<path d=\"M1236,290 h22 V866 h-22\" fill=\"none\" stroke=\"${C.line}\" stroke-width=\"4\" stroke-linejoin=\"round\"/>` + arrow(1345, 578, 1272, 578, C.line, 4), { dy: 0 });")
# 11: fattori card
R("['COMPORTAMENTO DEGLI UTENTI', ['quante persone', 'ci cliccano'], icoCursor, W('persone')],",
  "['COMPORTAMENTO DEGLI UTENTI', ['chi cerca la stessa cosa:', 'ci clicca? ci resta?'], icoCursor, W('persone')],")
# 2 + 10: verita
R("const x = px + 80 + i * 90, y = py + 200 + 60 * hsh(i)","const x = px + 100 + i * 115, y = py + 220 + 70 * i")
R("if (t > W('popolarità') - 0.1) for (let i = 0; i < 4; i++) {","if (t > W('popolarità') - 0.1) for (let i = 0; i < 3; i++) {")
R("T(900 + tw('Vera o falsa', 'pop', 84) + 14, 300, '?'","T(900 + tw('Vera o falsa', 'pop', 84) + 2, 300, '?'")
R("(ok ? lbl(1640, y, 'VALUTATA', { a: 'end', size: 28 })","(ok ? lbl(1640, y, i === 0 ? 'VALUTATI' : 'VALUTATA', { a: 'end', size: 28 })")
# 12: finale
R("scene('finale', { L: 0.5, tail: 3.2,","scene('finale', { L: 0.5, tail: 3.7,")
open('scenes.js','w').write(s)
