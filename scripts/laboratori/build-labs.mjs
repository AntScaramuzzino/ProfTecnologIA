// Genera le pagine dei laboratori interattivi in public/embeds/lab/<MC-ID>/index.html
// Sorgenti: un file <mc>.src.html per laboratorio + base comune (base.css, base.js).
// Uso: npm run labs
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "..", "public", "embeds", "lab");
const css = readFileSync(join(here, "base.css"), "utf8");
const js = readFileSync(join(here, "base.js"), "utf8");

for (const f of readdirSync(here).filter((n) => n.endsWith(".src.html"))) {
  const id = "MC-" + f.replace(".src.html", "").toUpperCase();
  const src = readFileSync(join(here, f), "utf8")
    .replace("/*BASE_CSS*/", css)
    .replace("/*BASE_JS*/", js)
    .replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, "");
  const cut = src.indexOf('<div class="wrap">');
  const head = src.slice(0, cut);
  const body = src.slice(cut);
  const html = `<!doctype html>
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
  mkdirSync(join(out, id), { recursive: true });
  writeFileSync(join(out, id, "index.html"), html);
  console.log("✓", id);
}
