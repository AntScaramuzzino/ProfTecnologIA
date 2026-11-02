// Disegno di un parallelepipedo in assonometria: restituisce un SVG
function axo(W, H, D, tipo) {
  const c30 = Math.cos(Math.PI / 6), s30 = 0.5, k = tipo === "cav1" ? 1 : 0.5;
  const P = (x, y, z) => tipo === "iso" ? [(x - y) * c30, z + (x + y) * s30] : [x + k * y * Math.SQRT1_2, z + k * y * Math.SQRT1_2];
  const V = []; for (const x of [0, W]) for (const y of [0, D]) for (const z of [0, H]) V.push([x, y, z]);
  const hid = tipo === "iso" ? [W, D, 0] : [0, D, 0];
  const E = [];
  V.forEach((a, i) => V.forEach((b, j) => { if (j <= i) return; const d = [0, 1, 2].filter((q) => a[q] !== b[q]); if (d.length === 1) E.push([a, b]); }));
  const pts = V.map((v) => P(...v)); const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
  const pad = 20, sc = Math.min(560 / (maxx - minx || 1), 300 / (maxy - miny || 1));
  const T = ([x, y]) => [pad + (x - minx) * sc, pad + (maxy - y) * sc];
  const isH = (v) => v[0] === hid[0] && v[1] === hid[1] && v[2] === hid[2];
  let s = `<svg viewBox="0 0 ${(maxx - minx) * sc + 2 * pad} ${(maxy - miny) * sc + 2 * pad}" style="width:100%;max-width:600px;display:block" role="img" aria-label="Parallelepipedo in assonometria">`;
  E.forEach(([a, b]) => { const [x1, y1] = T(P(...a)), [x2, y2] = T(P(...b)); const h = isH(a) || isH(b); s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:var(--fg)" stroke-width="${h ? 1.2 : 2.4}" ${h ? 'stroke-dasharray="6 4" opacity=".6"' : ""}/>`; });
  return s + "</svg>";
}
LABENGINE.run({
  id: "MC-DIS-2-02", area: "DIS", classe: 2, titolo: "Cavaliera o isometrica?", archetipo: "Tavolo grafico",
  hook: "Le proiezioni ortogonali sono precise, ma chi non le sa leggere non capisce la forma. L'assonometria mostra l'oggetto in un solo disegno, in tre dimensioni, e resta misurabile.",
  levels: [
    { brief: "Disegna il parallelepipedo del libro (80 × 50 × 60 mm) nei due sistemi. Cambia misure e tipo di assonometria e osserva come cambiano gli assi.",
      blocks: [
        { type: "sim", params: [{ id: "t", label: "Tipo di assonometria", options: [["cav", "Cavaliera: asse y a 45°, riduzione 0,5"], ["cav1", "Cavaliera senza riduzione"], ["iso", "Isometrica: assi a 30°, nessuna riduzione"]], value: "cav" }, { id: "W", label: "Larghezza (asse x)", min: 20, max: 150, step: 5, value: 80, unit: "mm" }, { id: "H", label: "Altezza (asse z)", min: 20, max: 150, step: 5, value: 50, unit: "mm" }, { id: "D", label: "Profondità (asse y)", min: 20, max: 150, step: 5, value: 60, unit: "mm" }],
          draw: (p) => axo(p.W, p.H, p.D, p.t),
          outputs: [{ key: "dy", label: "Profondità sul foglio", f: (p) => p.t === "cav" ? p.D * 0.5 : p.D, unit: "mm" }, { key: "ang", label: "Inclinazione degli assi", f: (p) => p.t === "iso" ? "x e y a 30°" : "x orizzontale, y a 45°" }],
          note: (p) => p.t === "cav1" ? ["warn", "Senza riduzione la profondità sembra troppo lunga: per questo nella cavaliera si dimezza l'asse y."] : null },
        { type: "order", title: "La procedura della cavaliera", items: [["Segna il punto O, angolo anteriore in basso a sinistra", ""], ["Traccia gli assi: x orizzontale, z verticale, y a 45° con la squadra", ""], ["Riporta 80 mm su x e 50 mm su z: disegni la faccia frontale in vera forma", "Nella cavaliera la faccia frontale non si deforma."], ["Riporta la profondità ridotta (60 × 0,5 = 30 mm) sulle oblique a 45°", ""], ["Unisci i punti e ripassa in linea grossa i contorni visibili; cancella le linee guida", ""]] } ],
      reflect: "In quale dei due sistemi la faccia frontale resta in vera forma? Perché è comodo?" },
    { brief: "Lo stesso oggetto nei due metodi ha vantaggi diversi. Scegli il sistema giusto per ogni situazione.",
      blocks: [
        { type: "quiz", questions: [
          ["Devi disegnare a mano velocemente un oggetto con molti dettagli sulla faccia frontale (per esempio una presa elettrica).", ["Cavaliera", "Isometrica"], 0, "La faccia frontale resta in vera forma: i dettagli si disegnano come in un prospetto."],
          ["Vuoi un disegno equilibrato, in cui le tre facce visibili hanno la stessa importanza.", ["Cavaliera", "Isometrica"], 1, "Nell'isometrica i tre assi formano angoli uguali di 120°: nessuna faccia è privilegiata."],
          ["Nell'isometrica, un cerchio disegnato su una faccia diventa…", ["un cerchio", "un'ellisse", "un quadrato"], 1, "Si costruisce partendo dal quadrato che lo contiene, disegnato in assonometria: il quadrato diventa un rombo, il cerchio un'ellisse."],
          ["Il metodo del box per i solidi composti consiste nel…", ["disegnare prima il parallelepipedo che contiene tutto, poi togliere le parti", "disegnare ogni pezzo separatamente", "partire dai dettagli"], 0, "Il box dà le misure d'ingombro e l'allineamento di tutte le parti."]] } ],
      reflect: "Nel tuo disegno del gradino, quale metodo ti è sembrato più chiaro? E più veloce?" },
    { label: "Scenario · il supporto per smartphone", brief: "Base 100 × 80 × 20 mm, colonna cilindrica ⌀ 40 × 60 mm, supporto 90 × 30 × 10 mm. Devi comunicare la forma al marketing (che non legge le proiezioni) e le misure alla produzione. Usa la lista di controllo mentre disegni l'isometrica.",
      blocks: [
        { type: "sim", title: "Il box d'ingombro", params: [{ id: "t", label: "Tipo", options: [["iso", "Isometrica"], ["cav", "Cavaliera"]], value: "iso" }],
          draw: (p) => axo(100, 90, 80, p.t),
          outputs: [{ key: "h", label: "Altezza totale", f: () => 20 + 60 + 10, unit: "mm" }, { key: "box", label: "Box d'ingombro", f: () => "100 × 80 × 90 mm" }] },
        { type: "check", key: "supp", items: ["Ho disegnato il box d'ingombro 100 × 80 × 90 mm in linee sottili", "Ho disegnato la base 100 × 80 × 20 mm", "Ho costruito le due ellissi del cilindro dal quadrato di lato 40 mm", "Ho unito le ellissi con le due tangenti verticali", "Ho centrato il supporto 90 × 30 × 10 mm sulla colonna", "Ho ripassato in linea grossa solo i contorni visibili", "Ho preparato anche le viste quotate per la produzione"],
          result: (n, t) => n === t ? ["ok", "<strong>Pronto per marketing e produzione.</strong>"] : ["warn", `${n} passi su ${t}.`] } ],
      reflect: "Perché il marketing preferisce l'assonometria e la produzione le proiezioni quotate?" }],
  bridge: "Disegna in assonometria cavaliera e isometrica lo stesso oggetto che hai proiettato ortogonalmente nella MC-DIS-2-01: confronta i due metodi e spiega quale preferisci e perché.",
});
