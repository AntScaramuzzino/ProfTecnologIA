/**
 * Prebuild script: genera public/mc-data.json
 * Chiamato da: npm run prebuild → npm run build
 * Legge i JSON da 01_MATRICE_MC/ e crea un file JSON statico
 * usato dal client per filtri e ricerche senza server.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MC_ROOT  = path.resolve(__dirname, "../../../01_MATRICE_MC");
const OUT_PATH = path.resolve(__dirname, "../public/mc-data.json");

function walkDir(dir, results = []) {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory non trovata: ${dir}`);
    return results;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, results);
    } else if (entry.name.endsWith(".json") && !entry.name.startsWith("schema")) {
      try {
        const data = JSON.parse(fs.readFileSync(full, "utf-8"));
        if (data.id && data.id.startsWith("MC-")) results.push(data);
      } catch (e) {
        console.warn(`⚠️  Skipping ${entry.name}: ${e.message}`);
      }
    }
  }
  return results;
}

if (!fs.existsSync(MC_ROOT)) {
  console.log(`ℹ️  01_MATRICE_MC non trovata — uso mc-data.json esistente.`);
  process.exit(0);
}

const mcs = walkDir(MC_ROOT);
mcs.sort((a, b) => {
  if (a.anno !== b.anno) return a.anno - b.anno;
  return a.id.localeCompare(b.id);
});

fs.writeFileSync(OUT_PATH, JSON.stringify({ total: mcs.length, mcs }, null, 2));
console.log(`✅ mc-data.json → ${mcs.length} MC scritte in ${OUT_PATH}`);
