/*
 * Riga e squadre che si muovono sul foglio — per le tavole di proiezioni ortogonali (tavole-po.js) e di
 * assonometria (tavole-ass.js). Come nei libri di testo: una riga (o una squadra) sta ferma come appoggio,
 * l'altra squadra ci scorre sopra; la matita segue il lato della squadra.
 *
 *   const S = window.GGB_SQUADRE(k, t);         // dentro creaFoglio / creaAssonometria
 *   S.strumento(nome, tipo, da, a, finestra, { via })
 *     tipo      "riga" | "45" (squadra a 45°) | "3060" (squadra a 30° e 60°)
 *     da, a     posizioni { o: [x, y], ang: gradi, specchio: bool }: all'inizio e alla fine del movimento
 *               (se `a` manca lo strumento sta fermo). La posizione si legge così, prima dello specchio e della
 *               rotazione: riga con il bordo di lavoro sull'asse x, da o verso destra, e il corpo sotto;
 *               squadra con l'angolo retto in o, un cateto verso destra e l'altro verso l'alto
 *               (nella 30°/60° il cateto lungo è quello verso destra: l'angolo di 30° sta in fondo a lui).
 *               `specchio` ribalta lo strumento rispetto al lato verso destra, prima di girarlo di `ang`.
 *     finestra  [da, a] del passo in corso in cui lo strumento si muove; compare all'inizio della finestra
 *     via       momento del passo in cui lo strumento sparisce (se manca: alla fine del passo)
 *
 * Gli strumenti sono aree «lista» con il bordo, che spariscono (activity.js: `fino`, `via`, `bordo`, `moti`).
 * Il passo in corso è quello non ancora chiuso: t.groups.length.
 */
(() => {
  "use strict";

  const num = (v) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(4);
  const T30 = Math.tan(Math.PI / 6);

  // Forme in centimetri: contorno e foro interno (le squadre vere hanno un foro triangolare al centro).
  const FORME = {
    riga: { contorno: [[0, 0], [26, 0], [26, -1.5], [0, -1.5]], foro: null },
    45: { contorno: [[0, 0], [11, 0], [0, 11]], foro: [[1.7, 1.7], [6.9, 1.7], [1.7, 6.9]] },
    3060: { contorno: [[0, 0], [14, 0], [0, 14 * T30]], foro: [[1.8, 1.5], [9.2, 1.5], [1.8, 1.5 + 7.4 * T30]] },
  };
  const COLORI = {
    riga: { color: [148, 163, 184], filling: 0.32 },
    45: { color: [14, 165, 233], filling: 0.24 },
    3060: { color: [20, 184, 166], filling: 0.22 },
  };
  const LIVELLO = 6;            // sopra la costruzione e i nomi: lo strumento si appoggia sul foglio

  window.GGB_SQUADRE = function (k, t) {
    t.areas = t.areas || [];
    t.styles = t.styles || {};
    t.moti = t.moti || [];
    let conta = 0;

    /** Punto del foglio, come espressione GeoGebra, di un vertice (lx, ly) dello strumento nella posizione p(param). */
    const vertice = (lx, ly, da, a, param) => {
      const sy = da.specchio ? -1 : 1;
      const y = ly * sy;
      const ox = a ? `(${num(da.o[0])}+${param}*${num(a.o[0] - da.o[0])})` : num(da.o[0]);
      const oy = a ? `(${num(da.o[1])}+${param}*${num(a.o[1] - da.o[1])})` : num(da.o[1]);
      const ang = a ? `(${num(da.ang || 0)}+${param}*${num((a.ang || 0) - (da.ang || 0))})°` : `${num(da.ang || 0)}°`;
      return `(${ox}+cos(${ang})*${num(lx)}-sin(${ang})*${num(y)},${oy}+sin(${ang})*${num(lx)}+cos(${ang})*${num(y)})`;
    };

    return {
      strumento(nome, tipo, da, a, finestra = [0.04, 0.2], opzioni = {}) {
        const forma = FORME[tipo];
        const passo = t.groups.length;
        const param = `tSq${nome}${++conta}`;
        if (a) {
          t.commands.push(`${param}=0`);
          t.helpers.push(param);
          t.moti.push({ param, step: passo, from: finestra[0], to: finestra[1] });
        }
        const area = (suffisso, punti, stile) => {
          const n = `area${nome}${suffisso}`;
          t.areas.push({
            name: n, points: [`{${punti.map(([x, y]) => vertice(x, y, da, a, param)).join(",")}}`],
            step: passo, at: finestra[0], fino: passo, via: opzioni.via, lista: true, bordo: true,
          });
          t.styles[n] = { ...stile, layer: LIVELLO };
        };
        const c = COLORI[tipo];
        area("C", forma.contorno, { color: c.color, filling: c.filling, thickness: 2, lineStyle: 0 });
        if (forma.foro) area("F", forma.foro, { color: c.color, filling: 0, thickness: 2, lineStyle: 0 });
        return nome;
      },
      /** Posizione di una squadra a 30°/60° con l'angolo di 30° nel punto p e l'ipotenusa che sale verso destra. */
      trenta(p) { return { o: [p[0] + 14, p[1]], ang: 180, specchio: true }; },
      /** Come sopra, ma con l'ipotenusa che sale verso sinistra (30° sopra la linea, dalla parte sinistra). */
      trentaSinistra(p) { return { o: [p[0] - 14, p[1]], ang: 0 }; },
      /** Squadra appoggiata sulla riga nel punto p, in piedi: il cateto lungo sale in verticale lungo x = p[0], il corpo sta a destra. */
      verticale(p) { return { o: p, ang: 90, specchio: true }; },
      /** Riga orizzontale con il bordo di lavoro all'altezza y, da x = da verso destra (il corpo sta sotto il bordo). */
      riga(y, da = -13) { return { o: [da, y], ang: 0 }; },
    };
  };
})();
