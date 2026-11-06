// Genera le pagine dei laboratori interattivi in public/embeds/lab/<MC-ID>/index.html
// Due tipi di sorgente:
//  - <mc>.src.html  → laboratori scritti a mano (i 5 pilota) + base comune (base.css, base.js)
//  - cfg/<mc>.js    → laboratori su motore comune (engine.js, engine.css) descritti da una configurazione
// Uso: npm run labs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "..", "public", "embeds", "lab");
const css = readFileSync(join(here, "base.css"), "utf8");
const js = readFileSync(join(here, "base.js"), "utf8");
const ecss = readFileSync(join(here, "engine.css"), "utf8");
const ejs = readFileSync(join(here, "engine.js"), "utf8");
const vcss = readFileSync(join(here, "verifica.css"), "utf8");
const vjs = readFileSync(join(here, "verifica.js"), "utf8");
const quizDir = join(here, "..", "..", "data", "quiz");
// Domande di verifica per livello (F/I/A) dal quiz della MC: [testo, opzioni, indice corretta, spiegazione, feedback per opzione]
function verifica(id) {
  const f = join(quizDir, `${id}_quiz.json`);
  if (!existsSync(f)) return "";
  const d = JSON.parse(readFileSync(f, "utf8"));
  const v = { id, F: [], I: [], A: [] };
  for (const q of d.domande || []) {
    const ops = q.opzioni || []; const a = ops.findIndex((o) => o.corretto || o.corretta);
    if (a < 0 || !v[q.livello]) continue;
    v[q.livello].push([q.domanda, ops.map((o) => o.testo), a, q.spiegazione || ops[a].feedback || "", ops.map((o) => o.feedback || "")]);
  }
  const json = JSON.stringify(v).replace(/</g, "\\u003c");
  return `<style>\n${vcss}</style>\n<script>\nwindow.LABVERIFICA=${json};\n${vjs}</script>\n`;
}
// Font self-hosted (public/embeds/lab/_fonts, licenza SIL OFL): nessuna richiesta a server esterni
const FONTS = "";

const limcss = readFileSync(join(here, "lim.css"), "utf8");
const limjs = readFileSync(join(here, "lim.js"), "utf8");
function page(head, body) {
  body += `<style>\n${limcss}</style>\n<script>\n${limjs}</script>\n`;
  return `<!doctype html>
<html lang="it" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="robots" content="noindex">
${head}</head>
<body>
${body}</body>
</html>
`;
}
function write(id, html) {
  mkdirSync(join(out, id), { recursive: true });
  writeFileSync(join(out, id, "index.html"), html);
}
const ids = [];

for (const f of readdirSync(here).filter((n) => n.endsWith(".src.html"))) {
  const id = "MC-" + f.replace(".src.html", "").toUpperCase();
  const src = readFileSync(join(here, f), "utf8")
    .replace("/*BASE_CSS*/", css)
    .replace("/*BASE_JS*/", js)
    .replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, "");
  const cut = src.indexOf('<div class="wrap">');
  write(id, page(src.slice(0, cut), src.slice(cut) + verifica(id)));
  ids.push(id);
}

const cfgDir = join(here, "cfg");
if (existsSync(cfgDir)) {
  for (const f of readdirSync(cfgDir).filter((n) => n.endsWith(".js")).sort()) {
    const id = "MC-" + f.replace(".js", "").toUpperCase();
    const cfg = readFileSync(join(cfgDir, f), "utf8");
    const title = (cfg.match(/titolo:\s*"([^"]+)"/) || [, id])[1];
    const head = `<title>${title}</title>\n<style>\n${css}\n${ecss}\n</style>\n`;
    const body = `<script>\n${ejs}\n</script>\n<script>\n${cfg}\n</script>\n<script>\n${js}\n</script>\n`;
    write(id, page(head, body + verifica(id)));
    ids.push(id);
  }
}
// Escape room (scripts/laboratori/escape/<mc>.js → public/embeds/escape/<MC-ID>/index.html)
const escDir = join(here, "escape");
const escOut = join(here, "..", "..", "public", "embeds", "escape");
const escManifest = [];
if (existsSync(escDir)) {
  const escss = readFileSync(join(here, "escape.css"), "utf8");
  const esjs = readFileSync(join(here, "escape.js"), "utf8");
  for (const f of readdirSync(escDir).filter((n) => n.endsWith(".js")).sort()) {
    const id = "MC-" + f.replace(".js", "").toUpperCase();
    const cfg = readFileSync(join(escDir, f), "utf8");
    const title = (cfg.match(/titolo:\s*"([^"]+)"/) || [, id])[1];
    const head = `<title>${title}</title>\n<style>\n${css}\n${ecss}\n${vcss}\n${escss}\n</style>\n`;
    const body = `<script>\n${esjs}\n</script>\n<script>\n${cfg}\n</script>\n`;
    mkdirSync(join(escOut, id), { recursive: true });
    writeFileSync(join(escOut, id, "index.html"), page(head, body).replace(/\.\.\/_fonts\//g, "../../lab/_fonts/"));
    const amb = (cfg.match(/ambientazione:\s*"([^"]+)"/) || [, ""])[1];
    escManifest.push({ mcId: id, titolo: title, descrizione: (amb.match(/^.*?[.!?](\s|$)/) || [amb])[0].trim() });
  }
}
writeFileSync(join(here, "..", "..", "lib", "escape-cfg.json"), JSON.stringify(escManifest, null, 2) + "\n");
console.log(escManifest.length, "escape room");
// Elenco per l'app (lib/laboratori-cfg.json): solo i laboratori su motore comune; i pilota sono in lib/laboratori.ts
const manifest = [];
if (existsSync(cfgDir)) {
  for (const f of readdirSync(cfgDir).filter((n) => n.endsWith(".js")).sort()) {
    const cfg = readFileSync(join(cfgDir, f), "utf8");
    const get = (k) => (cfg.match(new RegExp(k + ':\\s*"([^"]+)"')) || [, ""])[1];
    const hook = get("hook");
    const first = (hook.match(/^.*?[.!?](\s|$)/) || [hook])[0].trim();
    manifest.push({ mcId: get("id"), titolo: get("titolo"), archetipo: get("archetipo"), area: get("area"), classe: +((cfg.match(/classe:\s*(\d)/) || [, 0])[1]), descrizione: first });
  }
}
writeFileSync(join(here, "..", "..", "lib", "laboratori-cfg.json"), JSON.stringify(manifest, null, 2) + "\n");
ids.sort().forEach((id) => console.log("✓", id));
console.log(ids.length, "laboratori");
