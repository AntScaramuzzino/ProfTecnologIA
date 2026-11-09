/**
 * Posizionamento delle infografiche di processo tra ESPLORA e OSSERVA.
 *
 * Default (MC non elencate qui): OSSERVA mostra una sola infografica, la versione
 * più recente ("🏭 Il processo in dettaglio") — vedi bestInfografica in MCPageClient.
 *
 * Per le MC elencate:
 *  - `esplora`: i file indicati compaiono in fondo alla sottosezione ESPLORA il cui
 *    titolo corrisponde a `section` (riepilogo visivo dopo il testo: in cima alla
 *    sezione c'è già l'immagine/video di paragrafo);
 *  - `osserva`: elenco esplicito dei file che restano in OSSERVA ([] = nessuno).
 *
 * I file sono indicati con una sottostringa univoca del nome.
 *
 * Rigenerate il 2026-11-09 sul tema del testo: ALI-2-05, AMB-2-05 (nuova), AMB-2-06,
 * DIG-2-03, SIS-3-04 → in ESPLORA; DIG-2-04 (v2, corretta sul lucchetto HTTPS) →
 * in ESPLORA; MAT-1-06 → OSSERVA (illustra proprio il caso della giacca tecnica).
 * Restano in OSSERVA (l'infografica illustra il caso): ALI-2-01, ALI-2-04,
 * ENE-3-02, MAT-1-04, MAT-1-06.
 *
 * Audit: 2026-11-09.
 */
import type { VisualAsset } from "@/lib/content-loader";

interface EsploraPlacement {
  section: RegExp;
  files: string[];
}

interface InfograficaConfig {
  esplora: EsploraPlacement[];
  osserva: string[];
}

const v1 = "infografica_processo_playground_v1";

const CONFIG: Record<string, InfograficaConfig> = {
  // Corrispondenza esatta con ESPLORA, caso OSSERVA su altro → spostate
  "MC-ALI-2-02": {
    esplora: [{ section: /metodi di conservazione moderni/i, files: ["infografica_latte_playground_v2", "infografica_lavorazione-latte"] }],
    osserva: [], // v1 scartata: refuso "Cenfezione"
  },
  "MC-AMB-2-01": { esplora: [{ section: /sistemi strutturali principali/i, files: [v1] }], osserva: [] },
  "MC-AMB-2-02": { esplora: [{ section: /sistema di impianti/i, files: [v1] }], osserva: [] },
  "MC-COM-3-06": { esplora: [{ section: /pubblicit. programmatica/i, files: [v1] }], osserva: [] },
  "MC-DIS-3-02": {
    esplora: [{ section: /dal modello 3D alla stampa 3D/i, files: [v1] }],
    osserva: ["infografica_processo_playground_v2"],
  },
  "MC-ENE-3-05": {
    esplora: [{ section: /motore a scoppio a 4 tempi/i, files: ["infografica_processo_playground_v2"] }],
    osserva: [], // v1 scartata: refuso "marchina"
  },
  "MC-ENE-3-06": { esplora: [{ section: /^smart grid/i, files: [v1] }], osserva: [] },
  "MC-SIS-3-01": { esplora: [{ section: /catena del valore/i, files: [v1] }], osserva: [] },
  "MC-SIS-3-03": { esplora: [{ section: /lean startup/i, files: [v1] }], osserva: [] },
  // Valide in entrambe le zone → una sola posizione, in ESPLORA
  "MC-COM-3-01": { esplora: [{ section: /TCP\/IP/i, files: [v1] }], osserva: [] },
  "MC-COM-3-04": { esplora: [{ section: /controllo PID/i, files: [v1] }], osserva: [] },
  "MC-DIG-3-01": { esplora: [{ section: /debugging come competenza/i, files: [v1] }], osserva: [] },
  "MC-DIG-3-03": { esplora: [{ section: /cosa raccolgono i sensori/i, files: [v1] }], osserva: [] },
  "MC-ENE-3-03": { esplora: [{ section: /smart grid e transizione/i, files: [v1] }], osserva: [] },
  // Fasi dell'immagine ≠ "Le sette fasi" del testo → solo nell'apertura
  "MC-MAT-1-02": { esplora: [{ section: /non nasce sullo scaffale/i, files: [v1] }], osserva: [] },
  //   // Rigenerate il 2026-11-09 (MC riallineate al testo)
  "MC-ALI-2-05": { esplora: [{ section: /cinque funzioni precise/i, files: [v1] }], osserva: [] },
  "MC-AMB-2-05": { esplora: [{ section: /ciclo artificiale dell.acqua in sei fasi/i, files: [v1] }], osserva: [] },
  "MC-AMB-2-06": { esplora: [{ section: /smart city non è un videogioco/i, files: [v1] }], osserva: [] },
  "MC-DIG-2-03": { esplora: [{ section: /usare bene il computer/i, files: [v1] }], osserva: [] },
  "MC-SIS-3-04": { esplora: [{ section: /costruisce un percorso professionale/i, files: [v1] }], osserva: [] },
  "MC-DIG-2-04": { esplora: [{ section: /riconoscere un.email di phishing/i, files: ["infografica_processo_playground_v2"] }], osserva: [] },
};

function pick(visuals: VisualAsset[], keys: string[]): VisualAsset[] {
  return keys
    .map((k) => visuals.find((v) => v.label === "Infografica" && v.src.includes(k)))
    .filter((v): v is VisualAsset => Boolean(v));
}

/** Infografiche da mostrare in una sottosezione ESPLORA (titolo reale del paragrafo ###). */
export function getEsploraInfographics(mcId: string, sectionTitle: string, visuals: VisualAsset[]): VisualAsset[] {
  const cfg = CONFIG[mcId];
  if (!cfg) return [];
  const placement = cfg.esplora.find((p) => p.section.test(sectionTitle.trim()));
  return placement ? pick(visuals, placement.files) : [];
}

/**
 * Infografiche per OSSERVA. `null` = MC non configurata → vale la regola di default
 * (una sola infografica, la più recente).
 */
export function getOsservaInfographics(mcId: string, visuals: VisualAsset[]): VisualAsset[] | null {
  const cfg = CONFIG[mcId];
  return cfg ? pick(visuals, cfg.osserva) : null;
}

/** Numero di infografiche collocate nei paragrafi ESPLORA (per il pannello Risorse). */
export function countEsploraInfographics(mcId: string, visuals: VisualAsset[]): number {
  const cfg = CONFIG[mcId];
  return cfg ? cfg.esplora.reduce((n, p) => n + pick(visuals, p.files).length, 0) : 0;
}

export const INFOGRAFICHE_CONFIG = CONFIG;
