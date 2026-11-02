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
const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap">';

function page(head, body) {
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
  write(id, page(src.slice(0, cut), src.slice(cut)));
  ids.push(id);
}

const cfgDir = join(here, "cfg");
if (existsSync(cfgDir)) {
  for (const f of readdirSync(cfgDir).filter((n) => n.endsWith(".js")).sort()) {
    const id = "MC-" + f.replace(".js", "").toUpperCase();
    const cfg = readFileSync(join(cfgDir, f), "utf8");
    const title = (cfg.match(/titolo:\s*"([^"]+)"/) || [, id])[1];
    const head = `<title>${title}</title>\n${FONTS}\n<style>\n${css}\n${ecss}\n</style>\n`;
    const body = `<script>\n${ejs}\n</script>\n<script>\n${cfg}\n</script>\n<script>\n${js}\n</script>\n`;
    write(id, page(head, body));
    ids.push(id);
  }
}
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
