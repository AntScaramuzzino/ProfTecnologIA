// Pubblicità su misura — MC-DIG-2-02 §"Tracciamento online: come funziona la pubblicità personalizzata". render(t) puro.
const SCENES = [];
function scene(id, o) {
  const sc = SC.find(s => s.id === id), L = o.L ?? 0.35;
  const W = (w, n = 0) => { const m = sc.parole.filter(p => p[0].toLowerCase().replace(/[^\p{L}\d']/gu, '') === w.toLowerCase()); if (!m[n]) throw new Error(id + ': ' + w); return L + m[n][1]; };
  const def = o.make(W, L);
  const nWords = sc.didascalia ? sc.didascalia.split(' ').length : 0;
  let D = L + sc.voce_dur + (o.tail ?? 0.4);
  if (def.capAt != null) D = Math.max(D, def.capAt + 1.0 + 0.3 * nWords + 0.1);
  SCENES.push({ id, sc, L, D, light: sc.registro === 'chiaro', cap: sc.cap, render: def.render });
}
const DEFS = `<defs><linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="peach"><stop offset="0" stop-color="${C.coral}" stop-opacity="0.30"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></radialGradient></defs>`;
const IT = (x, y, s, o = {}) => T(x, y, s, { f: 'serif', it: true, size: o.size || 46, fill: o.fill || C.line, a: o.a || 'start' });
// pacchetto che scorre lungo un segmento (ciclico)
function travel(t, t0, x1, y1, x2, y2, inner, sp = 0.8) {
  if (t < t0) return ''; const p = eio(((t - t0) * sp) % 1);
  return `<g transform="translate(${lerp(x1, x2, p).toFixed(1)},${lerp(y1, y2, p).toFixed(1)})">${inner}</g>`;
}
const dash = (x1, y1, x2, y2, c, t, sp = 40) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3.5" stroke-dasharray="10 10" stroke-dashoffset="${(-t * sp).toFixed(1)}"/>`;
// spazio pubblicitario (riquadro tratteggiato)
function adSlot(x, y, w, h, st, lab = true) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="none" stroke="${st}" stroke-width="4" stroke-dasharray="14 10"/>` +
    (lab ? lbl(x + w / 2, y - 18, 'PUBBLICITÀ', { fill: st, size: 24 }) : '');
}

// 1 — aggancio: lo stesso prodotto ritrovato su altri siti
scene('hook', { make: (W) => ({
  capAt: W('non'),
  render(t) {
    let s = '';
    s += E(t, -0.4, win(120, 170, 820, 640, { url: 'negozio.esempio' }), { dy: 0 });
    s += E(t, W('prodotto') - 0.1, shoe(250, 320, 2.8, C.coral, 'none', 5) + bars(250, 650, 420, 2, C.line) + lbl(170, 290, 'PAGINA DEL PRODOTTO', { a: 'start' }));
    const sites = [[1040, 170, 'notizie.esempio'], [1100, 400, 'meteo.esempio'], [1040, 630, 'ricette.esempio']];
    sites.forEach(([x, y, u], i) => {
      s += E(t, W('ritrovi') + i * 0.35, win(x, y, 760, 200, { url: u, bh: 54, fill: C.bg }) + bars(x + 30, y + 90, 300, 3, C.line, 30, 11) +
        adSlot(x + 430, y + 100, 290, 86, C.line, true) + shoe(x + 505, y + 102, 0.72, C.line, 'none', 3.5), { dy: 14 });
    });
    return s + caption(t, W('non'), 'Non è magia', '');
  } }) });

// 2 — il sito installa un cookie di terze parti nel browser
scene('cookie', { make: (W) => ({
  capAt: W('cookie'),
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, win(140, 160, 1640, 680, { light: true, st: C.ink, url: 'negozio.esempio' }), { dy: 0 });
    s += E(t, -0.2, shoe(230, 330, 2.6, C.ink, 'none', 5) + lbl(210, 290, 'PAGINA DEL PRODOTTO', { a: 'start', fill: C.ink }) + bars(230, 640, 460, 3, C.ink), { dy: 10 });
    // memoria del browser
    s += E(t, W('browser') - 0.15, `<rect x="1180" y="260" width="520" height="500" rx="16" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="12 10"/>` +
      lbl(1440, 312, 'MEMORIA DEL BROWSER', { fill: C.ink }), { dy: 0 });
    // il cookie: parte dalla pagina e si deposita nella memoria
    const t0 = W('installa');
    if (t > t0) {
      const p = eio((t - t0) / 1.0), x = lerp(760, 1380, p), y = lerp(560, 440, p) - Math.sin(p * Math.PI) * 90;
      s += E(t, t0, cookieFile(x, y, C.ink, C.coral, { ink: C.ink }), { dy: 0, blur: 6 });
    }
    s += E(t, W('cookie'), lbl(1440, 640, 'COOKIE', { fill: C.ink, size: 30 }), { dy: 8 });
    s += E(t, W('terze'), pillTag(1440, 708, 'DI TERZE PARTI', C.ink, C.cream, 'middle'), { dy: 8 });
    return s + caption(t, W('cookie'), 'Cookie di terze parti', '', true);
  } }) });

// 3 — il cookie è collegato a una rete pubblicitaria: parte il segnale
scene('rete', { make: (W) => ({
  capAt: W('segnale'),
  render(t) {
    let s = '';
    s += E(t, -0.4, win(120, 260, 620, 460, { url: 'negozio.esempio' }) + shoe(170, 380, 1.4, C.line, 'none', 4) + bars(170, 560, 220, 3, C.line, 32, 11) +
      `<rect x="460" y="360" width="240" height="300" rx="12" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="10 8"/>` + cookieFile(520, 400, C.line, DIM(), { ink: C.line }) + lbl(580, 600, 'COOKIE'), { dy: 0 });
    s += E(t, W('rete') - 0.1, rack(1330, 300, 380, C.line, t) + lbl(1520, 610, 'RETE PUBBLICITARIA'), { dy: 12 });
    s += E(t, W('collegato'), dash(700, 470, 1320, 400, C.line, t), { dy: 0 });
    // il segnale: un pacchetto corallo che va dal browser alla rete
    const pk = `<rect x="-34" y="-22" width="68" height="44" rx="10" fill="${C.coral}"/>`;
    s += travel(t, W('segnale'), 720, 466, 1300, 404, pk, 0.7);
    // contenuto del segnale
    s += E(t, W('questo') - 0.1, `<rect x="760" y="560" width="520" height="190" rx="14" fill="${C.bg}" stroke="${C.line}" stroke-width="3"/>` +
      T(790, 615, 'QUESTO BROWSER', { f: 'mono', size: 28, ls: 3, w: 600 }) + T(790, 665, 'HA VISITATO LA PAGINA', { f: 'mono', size: 28, ls: 3, w: 600 }) +
      T(790, 715, 'DEL PRODOTTO', { f: 'mono', size: 28, ls: 3, w: 600 }), { dy: 14 });
    return s + caption(t, W('segnale'), 'Il segnale alla rete', '');
  } }) });

// 4 — il profilo anonimo, riconosciuto dal codice del cookie o dall'impronta del browser
scene('profilo', { tail: 0.9, make: (W) => ({
  capAt: W('profilo'),
  render(t) {
    let s = lightBg();
    const px = 960, py = 170, pw = 780, ph = 620;
    s += E(t, -0.4, card(px, py, pw, ph) + T(px + 50, py + 100, 'Profilo', { f: 'pop', size: 72, fill: C.ink }) +
      T(px + 50, py + 160, 'ID 7F3A-91C2', { f: 'mono', size: 30, fill: C.ink, w: 700, ls: 2 }) + T(px + 330, py + 160, '(ESEMPIO)', { f: 'mono', size: 24, fill: C.ink, ls: 2 }) +
      `<line x1="${px + 50}" y1="${py + 200}" x2="${px + pw - 50}" y2="${py + 200}" stroke="${C.ink}" stroke-width="2.5"/>`, { dy: 0 });
    // la nuova informazione aggiunta
    const r0 = W("l'informazione");
    s += E(t, r0, `<rect x="${px + 50}" y="${py + 240}" width="${pw - 100}" height="96" rx="12" fill="${C.coral}"/>` +
      T(px + 80, py + 302, 'HA VISITATO: PRODOTTO', { f: 'mono', size: 30, fill: C.ivory, w: 700, ls: 2 }), { dy: 18 });
    s += E(t, W('anonimo'), pillTag(px + 50, py + 420, 'ANONIMO', C.ink, C.cream), { dy: 10 });
    // riconosciuto da: codice del cookie / impronta del browser
    s += E(t, W('codice') - 0.1, cookieFile(150, 210, C.ink, C.cream, { ink: C.ink, w: 100, h: 125 }) + T(290, 270, 'CODICE', { f: 'mono', size: 28, fill: C.ink, w: 700, ls: 3 }) +
      T(290, 310, 'DEL COOKIE', { f: 'mono', size: 28, fill: C.ink, w: 700, ls: 3 }) + arrow(640, 290, px - 30, 360, C.ink), { dy: 12 });
    s += E(t, W('o') - 0.05, IT(150, 470, 'oppure', { fill: C.ink, size: 52 }), { dy: 10 });
    s += E(t, W("dall'impronta") - 0.1, fingerprint(205, 640, 62, C.ink) + T(290, 620, 'IMPRONTA', { f: 'mono', size: 28, fill: C.ink, w: 700, ls: 3 }) +
      T(290, 660, 'DEL BROWSER', { f: 'mono', size: 28, fill: C.ink, w: 700, ls: 3 }) + arrow(640, 640, px - 30, 520, C.ink), { dy: 12 });
    return s + caption(t, W('profilo'), 'Un profilo anonimo', '', true);
  } }) });

// 5 — un altro sito, con pubblicità della stessa rete
scene('altro', { tail: 0.6, make: (W) => ({
  capAt: W('altro'),
  render(t) {
    let s = '';
    s += E(t, -0.3, win(160, 160, 1100, 680, { url: 'notizie.esempio' }) + `<rect x="210" y="270" width="520" height="40" rx="10" fill="${C.line}"/>` + bars(210, 360, 520, 9, C.line, 40, 12), { dy: 0 });
    s += E(t, -0.1, adSlot(800, 300, 400, 400, C.coral) , { dy: 10 });
    s += E(t, W('stessa') - 0.2, rack(1420, 330, 360, C.line, t) + lbl(1600, 636, 'STESSA RETE') + dash(1210, 500, 1410, 470, C.line, t), { dy: 12 });
    return s + caption(t, W('altro'), 'Un altro sito', '');
  } }) });

// 6 — la rete invia la pubblicità più rilevante: il prodotto visitato
scene('annuncio', { make: (W) => ({
  capAt: W('più'),
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, win(120, 160, 1100, 680, { light: true, st: C.ink, url: 'notizie.esempio' }) + `<rect x="170" y="270" width="520" height="40" rx="10" fill="${C.ink}"/>` + bars(170, 360, 520, 9, C.ink, 40, 12) +
      adSlot(760, 300, 400, 400, C.ink), { dy: 0 });
    s += E(t, -0.2, rack(1420, 300, 360, C.ink, t, C.cream) + lbl(1600, 606, 'RETE PUBBLICITARIA', { fill: C.ink }), { dy: 0 });
    // l'annuncio viaggia dalla rete al browser
    const t0 = W('invia');
    if (t > t0 && t < W('proprio')) {
      const p = eio(((t - t0) * 0.9) % 1);
      s += `<g transform="translate(${lerp(1410, 1170, p)},${lerp(440, 500, p)})"><rect x="-40" y="-28" width="80" height="56" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/><path d="M-40,-28 L0,4 L40,-28" fill="none" stroke="${C.ink}" stroke-width="3"/></g>`;
    }
    s += E(t, t0 - 0.1, dash(1410, 440, 1170, 500, C.ink, t), { dy: 0 });
    s += E(t, W('rilevante'), pillTag(960, 770, 'PIÙ RILEVANTE PER IL PROFILO', C.ink, C.cream, 'middle'), { dy: 8 });
    s += pop(t, W('proprio'), 960, 500, shoe(800, 410, 1.6, C.coral, 'none', 5));
    return s + caption(t, W('più'), 'La più rilevante', '', true);
  } }) });

// 7 — l'asta in tempo reale
scene('asta', { tail: 1.0, make: (W) => ({
  capAt: W("un'asta"),
  render(t) {
    let s = '';
    const t0 = W("un'asta");
    let ang = 24;
    if (t > t0) { const x = clamp((t - t0) / 0.3); ang = x < 1 ? lerp(24, 0, x * x) : 2.5 * Math.exp(-(t - t0 - 0.3) * 7) * Math.sin((t - t0 - 0.3) * 28); }
    s += E(t, -0.4, `<rect x="220" y="672" width="300" height="56" rx="12" fill="${DIM()}" stroke="${C.line}" stroke-width="4"/>` + gavel(690, 560, ang, C.line), { dy: 0 });
    if (t > t0 + 0.25 && t < t0 + 0.85) { const k = (t - t0 - 0.25) / 0.6; [[-1, 0], [1, 0]].forEach(([d]) => { for (let i = 0; i < 2; i++) s += `<line x1="${370 + d * (170 + i * 10)}" y1="${700 - i * 36}" x2="${370 + d * (200 + i * 20 + k * 30)}" y2="${690 - i * 50 - k * 16}" stroke="${C.line}" stroke-width="4" stroke-linecap="round" opacity="${(1 - k).toFixed(2)}"/>`; }); }
    s += E(t, W('tempo') - 0.1, `<circle cx="1320" cy="400" r="150" fill="none" stroke="${C.line}" stroke-width="5"/>` +
      Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${1320 + 128 * Math.cos(a)}" y1="${400 + 128 * Math.sin(a)}" x2="${1320 + 142 * Math.cos(a)}" y2="${400 + 142 * Math.sin(a)}" stroke="${C.line}" stroke-width="4"/>`; }).join('') +
      `<line x1="1320" y1="400" x2="${1320 + 115 * Math.sin(t * 4)}" y2="${400 - 115 * Math.cos(t * 4)}" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/><circle cx="1320" cy="400" r="10" fill="${C.line}"/>` +
      `<rect x="1295" y="222" width="50" height="28" rx="6" fill="${C.line}"/>`, { dy: 12 });
    s += E(t, W('realtime') - 0.1, IT(1320, 690, 'Real-Time Bidding', { a: 'middle', size: 72 }) + lbl(1320, 750, 'IN INGLESE'), { dy: 14 });
    return s + caption(t, W("un'asta"), 'Asta in tempo reale', 'reale');
  } }) });

// 8 — circa 50 millisecondi, mentre si carica la pagina
scene('tempo', { tail: 0.6, make: (W) => ({
  capAt: W('circa'),
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, card(260, 170, 1400, 650), { dy: 0 });
    s += E(t, W('circa') - 0.05, IT(960, 330, 'circa', { a: 'middle', size: 70, fill: C.ink }), { dy: 10 });
    s += E(t, W('cinquanta'), T(960, 560, '50 ms', { f: 'pop', size: 240, fill: C.coral, a: 'middle' }), { dy: 20 });
    const t0 = W('mentre') - 0.1;
    if (t > t0) {
      const p = eo((t - t0) / 1.4);
      s += E(t, t0, `<rect x="460" y="640" width="1000" height="36" rx="18" fill="none" stroke="${C.ink}" stroke-width="3"/>` +
        `<rect x="466" y="646" width="${(988 * p).toFixed(1)}" height="24" rx="12" fill="${C.ink}"/>` +
        lbl(460, 740, 'LA PAGINA SI CARICA', { a: 'start', fill: C.ink }) + lbl(1460, 740, 'AL RALLENTATORE', { a: 'end', fill: C.ink }), { dy: 8 });
    }
    return s + caption(t, W('circa'), 'Circa 50 millisecondi', '', true);
  } }) });

// 9 — le offerte: vince chi offre di più
scene('offerte', { tail: 0.7, make: (W) => ({
  capAt: W('vince'),
  render(t) {
    let s = '';
    const vals = [0.55, 0.9, 0.7], names = ['AZIENDA A', 'AZIENDA B', 'AZIENDA C'];
    s += E(t, -0.3, adSlot(1400, 280, 360, 360, C.line) + lbl(1580, 690, 'SPAZIO NEL TUO BROWSER', { size: 24 }), { dy: 0 });
    const tv = W('vince');
    names.forEach((n, i) => {
      const y = 290 + i * 150;
      s += E(t, W('aziende') + i * 0.15, lbl(160, y + 10, n, { a: 'start' }) + `<rect x="420" y="${y - 22}" width="760" height="44" rx="10" fill="none" stroke="${C.line}" stroke-width="2.5"/>`, { dy: 10 });
      const p = eo((t - W("un'offerta") - i * 0.2) / 0.9);
      if (p > 0) s += `<rect x="426" y="${y - 16}" width="${(748 * vals[i] * p).toFixed(1)}" height="32" rx="7" fill="${i === 1 && t > tv ? C.coral : C.line}"/>`;
    });
    s += E(t, W("un'offerta") + 0.2, lbl(420, 230, 'OFFERTA (ESEMPIO)', { a: 'start' }), { dy: 0 });
    s += E(t, tv, lbl(1200, 450, 'VINCE', { a: 'start', size: 30 }) + arrow(1320, 440, 1390, 440, C.line), { dy: 0 });
    return s + caption(t, tv, "Vince l'offerta più alta", '');
  } }) });

// 10 — ognuna offre in base a quanto vale il profilo per quel prodotto
function gauge(cx, cy, r, v, st, lab) {
  let s = `<path d="M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}" fill="none" stroke="${st}" stroke-width="5"/>`;
  for (let i = 0; i <= 6; i++) { const a = Math.PI + i * Math.PI / 6; s += `<line x1="${cx + (r - 6) * Math.cos(a)}" y1="${cy + (r - 6) * Math.sin(a)}" x2="${cx + (r - 22) * Math.cos(a)}" y2="${cy + (r - 22) * Math.sin(a)}" stroke="${st}" stroke-width="3"/>`; }
  const a = Math.PI + v * Math.PI;
  s += `<line x1="${cx}" y1="${cy}" x2="${cx + (r - 30) * Math.cos(a)}" y2="${cy + (r - 30) * Math.sin(a)}" stroke="${st}" stroke-width="6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="11" fill="${st}"/>`;
  return s + lbl(cx, cy + 56, lab, { fill: st });
}
scene('valore', { tail: 0.8, make: (W) => ({
  capAt: W('valuta'),
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, card(150, 220, 600, 470) + T(200, 310, 'Profilo', { f: 'pop', size: 60, fill: C.ink }) + T(200, 365, 'ID 7F3A-91C2', { f: 'mono', size: 28, fill: C.ink, w: 700, ls: 2 }) +
      `<line x1="200" y1="400" x2="700" y2="400" stroke="${C.ink}" stroke-width="2.5"/>`, { dy: 0 });
    // riga del prodotto: diventa corallo su "quel prodotto"
    const hot = t > W('quel') - 0.05;
    s += E(t, -0.2, `<rect x="200" y="430" width="500" height="84" rx="12" fill="${hot ? C.coral : 'none'}" stroke="${hot ? C.coral : C.ink}" stroke-width="3"/>` +
      T(228, 485, 'HA VISITATO: PRODOTTO', { f: 'mono', size: 26, fill: hot ? C.ivory : C.ink, w: 700, ls: 1 }), { dy: 0 });
    const vals = [0.35, 0.8, 0.55];
    ['AZIENDA A', 'AZIENDA B', 'AZIENDA C'].forEach((n, i) => {
      const cy = 330 + i * 0;
      const t0 = W('ognuna') + i * 0.2, p = eo((t - W('valuta') - i * 0.15) / 1.0);
      s += E(t, t0, gauge(1000 + i * 300, 520, 120, vals[i] * Math.max(0, p), C.ink, n), { dy: 10 });
    });
    s += E(t, W('valuta') - 0.1, lbl(1300, 300, 'QUANTO VALE IL PROFILO (ESEMPIO)', { fill: C.ink }) + arrow(770, 455, 860, 455, C.ink), { dy: 8 });
    return s + caption(t, W('valuta'), 'Quanto vale il profilo', '', true);
  } }) });

// 11 — tutto questo accade ogni volta che carichi una pagina con pubblicità
scene('sempre', { tail: 0.6, make: (W) => ({
  capAt: W('ogni'),
  render(t) {
    let s = '';
    for (let i = 0; i < 8; i++) {
      const c = i % 4, r = Math.floor(i / 4), x = 150 + c * 420, y = 180 + r * 330, t0 = -0.2 + i * 0.45;
      if (t < t0) continue;
      let g = win(x, y, 380, 280, { url: '', bh: 46 }) + bars(x + 24, y + 80, 170, 5, C.line, 34, 11);
      const filled = t > t0 + 0.6;
      g += filled ? `<rect x="${x + 222}" y="${y + 76}" width="134" height="180" rx="10" fill="${DIM()}" stroke="${C.line}" stroke-width="3"/>` + shoe(x + 236, y + 140, 0.53, C.line, 'none', 3)
        : `<rect x="${x + 222}" y="${y + 76}" width="134" height="180" rx="10" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="10 8"/>`;
      s += E(t, t0, g, { dy: 12 });
    }
    return s + caption(t, W('ogni'), 'Ogni pagina con pubblicità', 'Ogni');
  } }) });

// 12 — cartello finale
scene('finale', { L: 0.5, tail: 3.2, make: (W) => ({
  capAt: null,
  render(t) {
    let s = lightBg();
    s += E(t, -0.4, T(960, 420, 'Pubblicità su misura', { f: 'pop', size: 120, fill: C.ink, a: 'middle' }), { dy: 0 });
    s += words(t, W('cookie') - 0.1, 960, 560, 'Cookie, profilo, asta: ogni volta che carichi una pagina.', { f: 'serif', size: 64, fill: C.ink, a: 'middle', it: true, key: 'asta' });
    s += E(t, W('funziona'), `<line x1="760" y1="640" x2="1160" y2="640" stroke="${C.ink}" stroke-width="3"/>` + T(960, 700, 'PROFTECNOLOGIA · MC DIG-2-02', { f: 'mono', size: 28, fill: C.ink, a: 'middle', ls: 5, w: 600 }));
    return s;
  } }) });

// ---- timeline ----
let acc = 0; const TL = SCENES.map(s => { const o = { id: s.id, start: acc, D: s.D, L: s.L, voce: s.sc.voce_dur }; acc += s.D; return o; });
window.TIMELINE = { total: acc, scenes: TL };
window.render = function (T0) {
  let i = TL.findIndex(x => T0 < x.start + x.D); if (i < 0) i = TL.length - 1;
  const S = SCENES[i], t = T0 - TL[i].start;
  let body = S.light ? '' : `<rect width="1920" height="1080" fill="${C.bg}"/>`;
  let inner = S.render(t, S.D);
  if (!S.light) inner = `<g transform="translate(960,540) scale(${1 + 0.025 * t / S.D}) translate(-960,-540)">${inner}</g>`;
  body += inner;
  if (S.id !== 'finale') body += chapterBar(t, S.cap, S.light);
  document.getElementById('stage').innerHTML = DEFS + body;
};
