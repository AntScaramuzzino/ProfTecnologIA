function prosp(p) {
  const W = 600, H = 340, oy = H - p.oriz * H / 100, vx = p.pf * W / 100;
  const x0 = 120, y0 = H - 40, w = p.w * 24, h = p.h * 24, t = p.prof / 100;
  const F = [[x0, y0], [x0 + w, y0], [x0 + w, y0 - h], [x0, y0 - h]];
  const B = F.map(([x, y]) => [x + (vx - x) * t, y + (oy - y) * t]);
  const L = (a, b, st) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke:var(--fg)" ${st || 'stroke-width="2.2"'}/>`;
  const G = (a) => `<line x1="${a[0]}" y1="${a[1]}" x2="${vx}" y2="${oy}" style="stroke:var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>`;
  const vis = (i) => !((i === 0 && vx > x0 && oy < y0) || (i === 1 && vx < x0 + w && oy < y0) || (i === 3 && vx > x0 && oy > y0 - h) || (i === 2 && vx < x0 + w && oy > y0 - h));
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:640px;display:block" role="img" aria-label="Scatola in prospettiva centrale">`;
  s += `<line x1="0" y1="${oy}" x2="${W}" y2="${oy}" style="stroke:var(--area)" stroke-width="1.5"/><text x="6" y="${oy - 6}" font-size="12" style="fill:var(--area)" font-family="Inter,sans-serif">linea d'orizzonte</text><circle cx="${vx}" cy="${oy}" r="5" style="fill:var(--energy)"/><text x="${vx + 8}" y="${oy - 8}" font-size="12" style="fill:var(--energy)" font-family="Inter,sans-serif">PF</text>`;
  F.forEach((a) => (s += G(a)));
  for (let i = 0; i < 4; i++) { s += L(B[i], B[(i + 1) % 4], 'stroke-width="1.4" stroke-dasharray="6 4" opacity=".7"'); s += vis(i) ? L(F[i], B[i]) : L(F[i], B[i], 'stroke-width="1.4" stroke-dasharray="6 4" opacity=".7"'); }
  for (let i = 0; i < 4; i++) s += L(F[i], F[(i + 1) % 4]);
  return s + "</svg>";
}
LABENGINE.run({
  id: "MC-DIS-3-01", area: "DIS", classe: 3, titolo: "Punto di fuga", archetipo: "Tavolo grafico",
  hook: "Dal segno al volume: la prospettiva rappresenta le cose come le vede l'occhio, con le linee che si incontrano all'orizzonte. Il design parte da qui, ma poi passa per un metodo: capire chi userà l'oggetto.",
  levels: [
    { brief: "Costruisci una scatola in prospettiva centrale: la faccia frontale resta un rettangolo, le linee di profondità vanno tutte al punto di fuga (PF). Sposta orizzonte e PF.",
      blocks: [
        { type: "sim", params: [{ id: "oriz", label: "Altezza della linea d'orizzonte", min: 10, max: 95, step: 1, value: 67, unit: "%" }, { id: "pf", label: "Posizione del punto di fuga", min: 0, max: 100, step: 1, value: 60, unit: "%" }, { id: "w", label: "Larghezza della faccia frontale", min: 2, max: 18, step: 0.5, value: 4, unit: "cm" }, { id: "h", label: "Altezza della faccia frontale", min: 2, max: 11, step: 0.5, value: 3, unit: "cm" }, { id: "prof", label: "Profondità (verso il PF)", min: 5, max: 80, step: 1, value: 35, unit: "%" }],
          draw: prosp, outputs: [{ key: "vista", label: "Che cosa vedi della scatola", f: (p) => (p.oriz > 12 ? "la faccia superiore" : "la faccia inferiore") + (p.pf > 45 ? " e il lato destro" : p.pf < 25 ? " e il lato sinistro" : "") }],
          note: (p) => p.oriz < 12 ? ["warn", "Orizzonte sotto la scatola: la guardi dal basso, come un grattacielo visto dalla strada."] : null },
        { type: "order", title: "La costruzione sul foglio", items: [["Traccia la linea d'orizzonte a circa 2/3 dell'altezza del foglio", ""], ["Segna il punto di fuga sull'orizzonte", ""], ["Disegna la faccia frontale: un rettangolo 4 × 3 cm", "In prospettiva centrale la faccia frontale non si deforma."], ["Dai quattro angoli traccia linee leggere verso il PF", ""], ["Scegli la profondità e chiudi la faccia posteriore con linee parallele a quelle frontali", ""], ["Ripassa i contorni visibili e cancella le linee di costruzione", ""]] } ],
      reflect: "Prova a mettere il punto di fuga dietro la scatola: che cosa succede alla faccia superiore? E al lato?" },
    { brief: "Assonometria e prospettiva hanno usi diversi. Poi riordina le fasi del design thinking, il metodo che userai nel progetto.",
      blocks: [
        { type: "quiz", questions: [
          ["Quale delle due conserva le misure, così che si possano leggere sul disegno?", ["L'assonometria", "La prospettiva"], 0, "Nell'assonometria le linee parallele restano parallele e le misure si riportano sugli assi; in prospettiva gli oggetti lontani rimpiccioliscono."],
          ["Quale delle due è più vicina a come vede l'occhio?", ["L'assonometria", "La prospettiva"], 1, "Per questo si usa nei render e nelle presentazioni ai clienti."],
          ["La prospettiva accidentale ha…", ["un punto di fuga", "due punti di fuga sull'orizzonte", "nessun punto di fuga"], 1, "L'oggetto è ruotato rispetto a chi guarda: le due direzioni orizzontali fuggono verso due punti diversi."]] },
        { type: "order", title: "Design thinking in cinque mosse", items: [["Empatizza: osserva e intervista chi userà l'oggetto", ""], ["Definisci il problema in una frase", ""], ["Genera idee, tante, senza giudicarle subito", ""], ["Costruisci un prototipo veloce", "Cartone, nastro adesivo, un modello 3D grezzo."], ["Testa con gli utenti e torna indietro se serve", "Il processo è un ciclo, non una linea retta."]] } ],
      reflect: "Hai disegnato la scatola da scarpe nei due modi. Quale mostreresti a un cliente? Quale a chi la deve produrre?" },
    { label: "Scenario · il porta-matite", brief: "Un'azienda di cancelleria chiede un porta-matite che risolva problemi veri: matite che rotolano, pennarelli che restano aperti, forbici senza posto sicuro. Vincoli: altezza massima 15 cm, ingombro massimo 12 × 12 cm, realizzabile in stampa 3D o compensato.",
      blocks: [
        { type: "canvas", fields: [["ric", "Ricerca: 3 problemi osservati su scrivanie reali", ""], ["def", "Il problema in una frase", "Come potremmo…"], ["idee", "Tre idee diverse", ""], ["scelta", "Idea scelta: misure e materiale", "es. 11 × 11 × 14 cm, compensato da 4 mm"], ["erg", "Ergonomia: come si prende una matita con una mano sola?", ""]],
          checks: [["Tre problemi osservati", (v) => v.ric.split(/[\n;]/).filter((x) => x.trim()).length >= 3], ["Misure dichiarate", (v) => /\d+\s*[×x]\s*\d+/.test(v.scelta)], ["Rispetta 15 cm di altezza e 12 × 12 di ingombro", (v) => { const n = (v.scelta.match(/\d+(?:[.,]\d+)?/g) || []).map((x) => +x.replace(",", ".")); return n.length >= 3 && n[0] <= 12 && n[1] <= 12 && n[2] <= 15; }], ["Hai pensato all'uso con una mano sola", (v) => v.erg.length > 20]],
          out: (v) => `BRIEF DI PROGETTO: PORTA-MATITE\n\nRicerca:\n${v.ric}\n\nProblema: ${v.def}\n\nIdee:\n${v.idee}\n\nSoluzione scelta: ${v.scelta}\n\nErgonomia: ${v.erg}` } ],
      reflect: "Che cosa hai cambiato dopo aver fatto provare il prototipo a un compagno?" }],
  bridge: "Progetta e disegna un oggetto utile per la tua camera: prima le 3 viste ortogonali quotate, poi l'assonometria isometrica e infine uno schizzo in prospettiva.",
});
