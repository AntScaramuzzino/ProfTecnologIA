// Controllo delle escape room: node scripts/laboratori/check-escape.cjs [MC-ID ...]
// 1) regole sulla configurazione  2) partita completa automatica nel browser (sbagliando una volta e chiedendo un indizio)
// 3) accessibilità (axe-core, se AXE_PATH è impostato) e larghezza 360 px
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "public", "embeds", "escape");
const TIPI = ["numero", "parola", "scelta", "ordine", "coppie"];
function regole(c) {
  const e = [];
  if (!/^MC-[A-Z]{3}-[123]-0\d$/.test(c.id)) e.push("id non valido");
  for (const k of ["titolo", "ambientazione", "missione", "vittoria"]) if (!c[k] || String(c[k]).length < 10) e.push(`manca ${k}`);
  const L = c.lucchetti || [];
  if (L.length !== 5) e.push(`servono 5 lucchetti (sono ${L.length})`);
  const tipi = new Set(L.map((l) => l.tipo)); if (tipi.size < 3) e.push("usa almeno 3 tipi di lucchetto diversi");
  const sim = L.map((l) => String(l.simbolo));
  L.forEach((l, i) => {
    const n = `lucchetto ${i + 1}`;
    if (!TIPI.includes(l.tipo)) e.push(`${n}: tipo «${l.tipo}» non previsto`);
    if (!l.titolo || !l.testo) e.push(`${n}: mancano titolo o testo`);
    if (!/^[A-Z0-9]$/.test(String(l.simbolo))) e.push(`${n}: il simbolo deve essere una lettera maiuscola o una cifra`);
    if (!(l.indizi && l.indizi.length >= 1)) e.push(`${n}: serve almeno un indizio`);
    if (!l.spiegazione) e.push(`${n}: manca la spiegazione`);
    if (l.tipo === "numero" && !(typeof l.risposta === "number" && isFinite(l.risposta))) e.push(`${n}: risposta numerica mancante`);
    if (l.tipo === "parola" && !(Array.isArray(l.risposte) && l.risposte.length)) e.push(`${n}: risposte mancanti`);
    if (l.tipo === "scelta") { if (!(l.opzioni && l.opzioni.length >= 3)) e.push(`${n}: servono almeno 3 opzioni`); if (!(l.corretta >= 0 && l.corretta < (l.opzioni || []).length)) e.push(`${n}: indice corretta fuori intervallo`); }
    if (l.tipo === "ordine" && !(l.elementi && l.elementi.length >= 4 && l.elementi.length <= 7)) e.push(`${n}: l'ordine richiede 4-7 elementi`);
    if (l.tipo === "coppie") { const R = (l.coppie || []).map((p) => p[1]); if (R.length < 3 || R.length > 6) e.push(`${n}: servono 3-6 coppie`); if (new Set(R).size !== R.length) e.push(`${n}: i valori di destra devono essere tutti diversi`); }
  });
  return e;
}
(async () => {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(OUT).filter((x) => x.startsWith("MC-")).sort();
  const AXE = process.env.AXE_PATH && fs.existsSync(process.env.AXE_PATH) ? fs.readFileSync(process.env.AXE_PATH, "utf8") : null;
  const b = await chromium.launch(); let bad = 0;
  for (const id of ids) {
    const f = path.join(OUT, id, "index.html"); const probs = [];
    if (!fs.existsSync(f)) { console.log(`✗ ${id}: pagina non generata (npm run labs)`); bad++; continue; }
    const p = await b.newPage({ viewport: { width: 900, height: 900 } }); const errs = [];
    p.on("pageerror", (x) => errs.push(x.message)); p.on("console", (m) => { if (m.type() === "error" && !/ERR_FILE_NOT_FOUND|net::/.test(m.text())) errs.push(m.text()); });
    await p.goto("file://" + f);
    const cfg = await p.evaluate(() => { const c = window.ESCAPE && window.ESCAPE.cfg; return c ? JSON.parse(JSON.stringify(c)) : null; });
    if (!cfg) { console.log(`✗ ${id}: la configurazione non si carica — ${errs.join(" | ")}`); bad++; await p.close(); continue; }
    probs.push(...regole(cfg));
    if (AXE) { await p.addScriptTag({ content: AXE }); }
    for (let i = 0; i < (cfg.lucchetti || []).length; i++) {
      const l = cfg.lucchetti[i];
      if (AXE && i === 0) { const v = await p.evaluate(async () => (await axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa"] })).violations.map((x) => x.id + ":" + x.nodes.length)); if (v.length) probs.push("accessibilità: " + v.join(", ")); }
      if (i === 0) { await p.click(".es-card .btn.ghost"); }
      // prima una risposta sbagliata, quando possibile
      if (l.tipo === "numero") { await p.fill(".es-card input", String(l.risposta + 1000)); await p.click(".es-card .btn:not(.ghost)"); if (!(await p.$(".es-card .fb.ko"))) probs.push(`lucchetto ${i + 1}: accetta una risposta sbagliata`); await p.fill(".es-card input", String(l.risposta).replace(".", ",")); }
      else if (l.tipo === "parola") { await p.fill(".es-card input", "xyzzy"); await p.click(".es-card .btn:not(.ghost)"); await p.fill(".es-card input", l.risposte[0]); }
      else if (l.tipo === "scelta") { const t = l.opzioni[l.corretta]; const bs = await p.$$(".es-opts button"); for (const x of bs) if ((await x.textContent()) === t) await x.click(); }
      else if (l.tipo === "ordine") {
        for (let k = 0; k < l.elementi.length; k++) { // porta l'elemento k in posizione k
          for (let guard = 0; guard < 10; guard++) { const txt = await p.$$eval(".es-ord .es-t", (e) => e.map((x) => x.textContent)); const pos = txt.indexOf(l.elementi[k]); if (pos <= k) break; await (await p.$$(".es-ord li"))[pos].$$("button").then((bb) => bb[0].click()); }
        }
      } else if (l.tipo === "coppie") { const ss = await p.$$(".es-pair select"); for (let k = 0; k < ss.length; k++) await ss[k].selectOption(l.coppie[k][1]); }
      await p.click(".es-card .btn:not(.ghost)");
      if (!(await p.$(".es-card .fb.ok"))) { probs.push(`lucchetto ${i + 1}: la risposta corretta non apre il lucchetto`); break; }
      await p.click(".es-card .row:last-child .btn");
    }
    const code = (cfg.lucchetti || []).map((l) => l.simbolo).join("");
    if (await p.$("#es-code")) { await p.fill("#es-code", code.toLowerCase()); await p.click(".es-door .btn"); if (!(await p.$(".es-win"))) probs.push("la porta non si apre con il codice"); }
    else if (!probs.length) probs.push("porta finale non raggiunta");
    await p.setViewportSize({ width: 360, height: 800 }); await p.click(".es-win .btn").catch(() => {});
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); if (ov > 0) probs.push(`scorre in orizzontale a 360 px (${ov} px)`);
    if (errs.length) probs.push("errori JavaScript: " + errs.slice(0, 3).join(" | "));
    console.log(probs.length ? `✗ ${id}\n  - ${probs.join("\n  - ")}` : `✓ ${id} · ${cfg.titolo} · codice ${code}`); if (probs.length) bad++;
    await p.close();
  }
  await b.close(); process.exit(bad ? 1 : 0);
})();
