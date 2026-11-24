/*
 * Effetti delle tavole animate (prova: si accendono con &effetti=1 nell'indirizzo, oppure con `effetti: true`
 * nella tavola). Lavorano su tutte le tavole senza toccarle, leggendo gli oggetti che creaTavola già prepara.
 *
 *   1. Strumenti visibili: mentre un arco si traccia compare il compasso (ago nel centro, mina sulla punta
 *      che si muove); mentre un segmento si traccia compare il righello con la matita.
 *   2. Fuoco sul passo: le linee di costruzione dei passi già fatti si schiariscono; il punto appena trovato
 *      si ingrandisce per un attimo.
 *   3. Ripasso finale: all'ultimo passo, quando compare il risultato, le linee di costruzione si schiariscono
 *      ancora e restano in evidenza solo la figura e i punti.
 *
 * Gli strumenti sono oggetti GeoGebra creati una sola volta (punti liberi spostati da qui); il compasso è
 * visto dall'alto, con la testa sempre a sinistra del verso che va dall'ago alla mina, così non si ribalta.
 */
(() => {
  "use strict";

  const COSTRUZIONE = /^(circle|arc|line|ray|diam|c[1-5])/;   // linee leggere che si schiariscono
  const CHIARO = 0.62;                                          // quanto schiarire verso il bianco (0–1)
  const CHIARISSIMO = 0.8;

  window.GGB_EFFETTI = function (api, activity, opzioni) {
    const th = opzioni.th;
    const [xMin, xMax] = activity.coord || [-6, 6];
    const u = (xMax - xMin) / 12;                                 // unità di misura degli strumenti
    const exists = (n) => api.exists(n);
    const nascondi = (...nomi) => nomi.forEach((n) => exists(n) && api.setVisible(n, false));
    const mostra = (...nomi) => nomi.forEach((n) => exists(n) && api.setVisible(n, true));
    const sposta = (n, p) => { api.setValue(`${n}X`, p[0]); api.setValue(`${n}Y`, p[1]); };
    const xy = (n) => [api.getXcoord(n), api.getYcoord(n)];

    // ── colori originali, per poterli schiarire e ripristinare ──────────────────────────────────────────
    const originale = {};
    const tutti = activity.groups.flat();
    tutti.forEach((n) => {
      if (!exists(n) || !COSTRUZIONE.test(n)) return;
      const hex = api.getColor(n) || "#000000";
      originale[n] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    });
    const tinta = (n, quanto) => {
      const c = originale[n];
      if (!c) return;
      const m = c.map((v) => Math.round(v + (255 - v) * quanto));
      api.setColor(n, m[0], m[1], m[2]);
    };

    // ── strumenti ───────────────────────────────────────────────────────────────────────────────────────
    const cmd = (s) => api.evalCommand(s);
    // Punti dipendenti da due numeri: si spostano con setValue e non si possono trascinare con il mouse.
    const mobili = ["EfAgo", "EfMina", "EfTesta", "EfManico", "EfR1", "EfR2", "EfR3", "EfR4", "EfMatita"];
    mobili.forEach((n) => { cmd(`${n}X=0`); cmd(`${n}Y=0`); cmd(`${n}=(${n}X,${n}Y)`); });
    mobili.forEach((n) => { api.setVisible(`${n}X`, false); api.setVisible(`${n}Y`, false); });
    cmd("EfGambaAgo=Segment(EfTesta,EfAgo)");
    cmd("EfGambaMina=Segment(EfTesta,EfMina)");
    cmd("EfImpugnatura=Segment(EfTesta,EfManico)");
    cmd("EfCerniera=Circle(EfTesta," + (0.16 * u).toFixed(4) + ")");
    cmd("EfRiga=Polygon({EfR1,EfR2,EfR3,EfR4})");
    const compasso = ["EfGambaAgo", "EfGambaMina", "EfImpugnatura", "EfCerniera", "EfAgo", "EfMina", "EfTesta"];
    const righello = ["EfRiga", "EfMatita"];
    const strumenti = [...compasso, ...righello, "EfR1", "EfR2", "EfR3", "EfR4", "EfManico"];
    strumenti.forEach((n) => {
      if (!exists(n)) return;
      api.setFixed(n, true, false);
      api.setLabelVisible(n, false);
      api.setLayer(n, 8);
    });
    [["EfGambaAgo", 71, 85, 105, 7], ["EfGambaMina", 71, 85, 105, 7], ["EfImpugnatura", 51, 65, 85, 9]].forEach(([n, r, g, b, s]) => {
      api.setColor(n, r, g, b); api.setLineThickness(n, th(s));
    });
    api.setColor("EfCerniera", 51, 65, 85); api.setFilling("EfCerniera", 1); api.setLineThickness("EfCerniera", th(2));
    api.setColor("EfAgo", 51, 65, 85); api.setPointSize("EfAgo", 3);
    api.setColor("EfMina", 217, 119, 6); api.setPointSize("EfMina", 4);
    api.setPointSize("EfTesta", 1); api.setPointSize("EfManico", 1);
    api.setColor("EfRiga", 148, 163, 184); api.setFilling("EfRiga", 0.3); api.setLineThickness("EfRiga", th(2));
    api.setColor("EfMatita", 15, 23, 42); api.setPointSize("EfMatita", 4);
    ["EfR1", "EfR2", "EfR3", "EfR4"].forEach((n) => api.setVisible(n, false));
    nascondi(...strumenti);

    function mettiCompasso(c, p) {
      const dx = p[0] - c[0]; const dy = p[1] - c[1];
      const r = Math.hypot(dx, dy) || 1e-6;
      const nx = -dy / r; const ny = dx / r;                       // a sinistra del verso ago → mina
      const h = Math.max(0.7 * u, Math.min(2.4 * u, 0.55 * r));
      const testa = [(c[0] + p[0]) / 2 + nx * h, (c[1] + p[1]) / 2 + ny * h];
      sposta("EfAgo", c); sposta("EfMina", p); sposta("EfTesta", testa);
      sposta("EfManico", [testa[0] + nx * 0.7 * u, testa[1] + ny * 0.7 * u]);
      mostra(...compasso, "EfManico");
    }

    function mettiRighello(a, q, b) {
      const dx = b[0] - a[0]; const dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1e-6;
      const ux = dx / l; const uy = dy / l;
      const nx = -uy; const ny = ux;
      const e = 0.6 * u; const w = 0.42 * u; const g = 0.05 * u;  // sporgenza, larghezza, distacco dalla linea
      const p1 = [a[0] - ux * e - nx * g, a[1] - uy * e - ny * g];
      const p2 = [b[0] + ux * e - nx * g, b[1] + uy * e - ny * g];
      sposta("EfR1", p1); sposta("EfR2", p2);
      sposta("EfR3", [p2[0] - nx * w, p2[1] - ny * w]); sposta("EfR4", [p1[0] - nx * w, p1[1] - ny * w]);
      sposta("EfMatita", q);
      mostra(...righello);
    }

    // Per ogni segmento animato serve l'altro estremo: lo leggo una volta portando il tratto a 1.
    const fine = {};
    const inizio = {};
    Object.entries(activity.anim || {}).forEach(([n, cfg]) => {
      if (!exists(`HQ${n}`) || !exists(cfg.param)) return;
      const prima = api.getValue(cfg.param);
      api.setValue(cfg.param, 1); fine[n] = xy(`HQ${n}`);
      api.setValue(cfg.param, 0); inizio[n] = xy(`HQ${n}`);
      api.setValue(cfg.param, prima);
    });

    const puntoBase = {};
    Object.keys(activity.appearAt || {}).forEach((n) => {
      if (exists(n) && api.getObjectType(n) === "point") puntoBase[n] = api.getPointSize(n);
    });

    const gruppoDi = {};
    activity.groups.forEach((g, i) => g.forEach((n) => { gruppoDi[n] = i; }));
    const ultimo = activity.steps.length - 1;

    return function applica(stage, progress) {
      // 1 · strumento attivo: il primo tratto del passo che si sta ancora disegnando
      nascondi(...strumenti);
      // Le tavole che muovono già riga e squadre (squadre.js) tengono i loro strumenti.
      if (progress < 1 && !(activity.moti && activity.moti.length)) {
        const attivi = Object.entries(activity.anim || {})
          .filter(([n, cfg]) => gruppoDi[n] === stage && progress > cfg.from && progress < cfg.to && exists(n));
        const arco = attivi.find(([n]) => exists(`HC${n}`) && exists(`HE${n}`));
        const tratto = attivi.find(([n]) => fine[n]);
        if (arco) mettiCompasso(xy(`HC${arco[0]}`), xy(`HE${arco[0]}`));
        else if (tratto) mettiRighello(inizio[tratto[0]], xy(`HQ${tratto[0]}`), fine[tratto[0]]);
      }

      // 2 · fuoco: schiarisci le linee di costruzione dei passi già fatti; 3 · ripasso finale
      const ripasso = stage === ultimo && progress >= 0.95;
      Object.keys(originale).forEach((n) => {
        const g = gruppoDi[n];
        if (ripasso) tinta(n, CHIARISSIMO);
        else if (g < stage) tinta(n, CHIARO);
        else tinta(n, 0);
      });

      // 2 · il punto appena comparso si ingrandisce per un attimo
      Object.entries(activity.appearAt || {}).forEach(([n, at]) => {
        if (puntoBase[n] === undefined || gruppoDi[n] !== stage) return;
        const d = progress - at;
        const base = puntoBase[n];
        api.setPointSize(n, d >= 0 && d < 0.12 && progress < 1 ? base + 3 : base);
      });
    };
  };
})();
