import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = "/Users/antonioscaramuzzino/Documents/Cowork/TecnologIA";
const VISUAL_ROOT = path.join(ROOT, "04_CONTENUTI/visual");
const SITE_ROOT = path.join(ROOT, "05_APP/tecnologia-sito-web/public/assets/visual");
const DOWNLOADS = path.join(process.env.HOME, "Downloads");

function argValue(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1];
}

const area = argValue("--area");
const limit = Number(argValue("--limit") || 6);
const suffix = argValue("--suffix") || "ai-fotorealistica";
const promptSuffix = argValue("--prompt-suffix") || suffix;

function osa(js) {
  const script = `tell application "Google Chrome"\nactivate\nreturn execute active tab of front window javascript ${JSON.stringify(js)}\nend tell`;
  return execFileSync("osascript", ["-e", script], { encoding: "utf8" }).trim();
}

function latestImage() {
  const raw = osa(`JSON.stringify(Array.from(document.images).filter(img=>img.naturalWidth>1000&&img.naturalHeight>600).map(img=>({src:img.src,w:img.naturalWidth,h:img.naturalHeight,alt:img.alt})).at(-1)||null)`);
  return raw ? JSON.parse(raw) : null;
}

function hasStopButton() {
  return osa(`String(!!document.querySelector('[data-testid="stop-button"]'))`) === "true";
}

function mcIds() {
  return fs
    .readdirSync(VISUAL_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("MC-"))
    .map((entry) => entry.name)
    .sort()
    .filter((id) => !area || id.startsWith(`MC-${area}-`))
    .filter((id) => fs.existsSync(path.join(VISUAL_ROOT, id, `${id}_${promptSuffix}_prompt.txt`)))
    .filter((id) => !fs.existsSync(path.join(VISUAL_ROOT, id, `${id}_${suffix}.png`)))
    .slice(0, limit);
}

function submitPrompt(prompt) {
  const js = `(()=>{const text=${JSON.stringify(prompt)}; const inputs=[...document.querySelectorAll('textarea'),...document.querySelectorAll('[contenteditable="true"]')].filter(el=>el.offsetParent!==null||el===document.activeElement); const el=inputs[inputs.length-1]; if(!el)return 'NO_INPUT'; el.focus(); if(el.tagName==='TEXTAREA'){el.value=text; el.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:text}));}else{document.execCommand('selectAll',false,null); document.execCommand('insertText',false,text);} setTimeout(()=>{const buttons=[...document.querySelectorAll('button')].filter(b=>!b.disabled&&b.offsetParent!==null); const send=buttons.find(b=>/send|invia/i.test((b.getAttribute('aria-label')||'')+' '+(b.getAttribute('data-testid')||'')))||buttons.find(b=>String(b.className).includes('composer-submit'))||buttons.at(-1); if(send)send.click();},500); return 'OK';})()`;
  const out = osa(js);
  if (out !== "OK") throw new Error(out);
}

function waitForNewImage(previousSrc, timeout = 10 * 60 * 1000) {
  const start = Date.now();
  let sawGeneration = false;
  while (Date.now() - start < timeout) {
    const image = latestImage();
    const running = hasStopButton();
    sawGeneration = sawGeneration || running;
    if (image?.src && image.src !== previousSrc && !running) return image;
    if (image?.src && sawGeneration && !running && Date.now() - start > 45 * 1000) return image;
    if (image?.src && !running && Date.now() - start > 90 * 1000) return image;
    process.stdout.write(".");
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10000);
  }
  throw new Error("timeout attesa immagine");
}

function downloadLatest(id) {
  const before = Date.now();
  osa(`(async()=>{const img=Array.from(document.images).filter(img=>img.naturalWidth>1000&&img.naturalHeight>600).at(-1); if(!img)return 'NO_IMAGE'; const r=await fetch(img.src,{credentials:'include'}); if(!r.ok)return 'FETCH_'+r.status; const b=await r.blob(); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=${JSON.stringify(`${id}_${suffix}.png`)}; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},5000); return 'DOWNLOAD_'+b.size;})()`);

  let downloaded = null;
  for (let i = 0; i < 30; i += 1) {
    const candidates = fs
      .readdirSync(DOWNLOADS)
      .map((name) => path.join(DOWNLOADS, name))
      .filter((file) => !file.endsWith(".crdownload"))
      .map((file) => ({ file, stat: fs.statSync(file) }))
      .filter((item) => item.stat.mtimeMs >= before - 1000)
      .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
    if (candidates[0]) {
      downloaded = candidates[0].file;
      break;
    }
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
  }

  if (!downloaded) throw new Error("download non trovato");

  const contentDest = path.join(VISUAL_ROOT, id, `${id}_${suffix}.png`);
  const siteDest = path.join(SITE_ROOT, id, `${id}_${suffix}.png`);
  fs.mkdirSync(path.dirname(contentDest), { recursive: true });
  fs.mkdirSync(path.dirname(siteDest), { recursive: true });
  fs.renameSync(downloaded, contentDest);
  fs.copyFileSync(contentDest, siteDest);
  return contentDest;
}

const ids = mcIds();
console.log(`Batch: ${ids.join(", ") || "nessuna MC"}`);

for (const id of ids) {
  console.log(`\n${id}`);
  const promptPath = path.join(VISUAL_ROOT, id, `${id}_${promptSuffix}_prompt.txt`);
  const prompt = fs.readFileSync(promptPath, "utf8").trim();
  const previousSrc = latestImage()?.src || "";
  submitPrompt(prompt);
  const image = waitForNewImage(previousSrc);
  console.log(`\n  immagine ${image.w}x${image.h}`);
  console.log(`  salvata ${downloadLatest(id)}`);
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3000);
}
