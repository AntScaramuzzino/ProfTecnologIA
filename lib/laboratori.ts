// Registro dei laboratori interattivi (piano: 00_ARCHITETTURA/PIANO_LABORATORI_INTERATTIVI_v1.0.md)
// Le pagine sono generate da scripts/laboratori/ in public/embeds/lab/<MC-ID>/index.html (npm run labs).
// - 5 laboratori pilota scritti a mano (elencati qui sotto)
// - gli altri su motore comune, elencati in laboratori-cfg.json (generato da npm run labs)
import { COSTRUZIONI_GEOGEBRA, MC_COSTRUZIONI, hrefCostruzione } from "./geogebra-costruzioni";
import { MC_PROIEZIONI, TAVOLE_PO_PRONTE, hrefTavolaPO } from "./geogebra-proiezioni";
import cfgLabs from "./laboratori-cfg.json";
import escapeRooms from "./escape-cfg.json";

export interface LaboratorioInterattivo {
  mcId: string;
  titolo: string;
  archetipo: string;
  descrizione: string;
  classe: number;
  area: string;
}

export const AREA_COLOR: Record<string, string> = {
  MAT: "#6D4C41", DIS: "#1A3A7A", DIG: "#006064", ALI: "#4E7A26", AMB: "#BF360C",
  ENE: "#C24010", COM: "#6A1B9A", SIS: "#1B5E7A", INF: "#37474F",
};

const PILOTI: LaboratorioInterattivo[] = [
  { mcId: "MC-MAT-1-04", titolo: "Differenzia!", archetipo: "Smistatore", classe: 1, area: "MAT",
    descrizione: "Smista i rifiuti, ispeziona i contenitori di una classe e costruisci il piano di miglioramento per il Comune." },
  { mcId: "MC-DIG-1-03", titolo: "Il robot della colazione", archetipo: "Programmatore", classe: 1, area: "DIG",
    descrizione: "Riconosci sequenze, condizioni e cicli, scrivi un algoritmo testato su quattro mattine e progetta le regole di un docente automatico." },
  { mcId: "MC-DIG-2-04", titolo: "Casella sotto attacco", archetipo: "Ispettore", classe: 2, area: "DIG",
    descrizione: "Trova i segnali di phishing in una casella simulata, metti alla prova password inventate e scopri che cosa cambia con l'IA." },
  { mcId: "MC-DIS-2-01", titolo: "Tre sguardi", archetipo: "Tavolo grafico", classe: 2, area: "DIS",
    descrizione: "Proiezioni ortogonali con il metodo europeo: solidi 3D da ruotare, foro passante con linee nascoste, ricostruzione del pezzo dalle tre viste." },
  { mcId: "MC-ENE-3-01", titolo: "Banco delle leve", archetipo: "Simulatore", classe: 3, area: "ENE",
    descrizione: "Classifica le macchine semplici, simula una leva e porta una pietra da 500 kg in cima a una torre medievale." },
];

export const LABORATORI: LaboratorioInterattivo[] = [...PILOTI, ...(cfgLabs as LaboratorioInterattivo[])].sort(
  (a, b) => a.classe - b.classe || a.mcId.localeCompare(b.mcId),
);

export function getLaboratorio(mcId: string): LaboratorioInterattivo | undefined {
  return LABORATORI.find((l) => l.mcId === mcId);
}

export function labSrc(mcId: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/embeds/lab/${mcId}/index.html`;
}

// Escape room: una per MC (scripts/laboratori/escape/<mc>.js → public/embeds/escape/<MC-ID>/index.html)
export interface EscapeRoom {
  mcId: string;
  titolo: string;
  descrizione: string;
}

export const ESCAPE_ROOMS: EscapeRoom[] = escapeRooms as EscapeRoom[];

export function getEscapeRoom(mcId: string): EscapeRoom | undefined {
  return ESCAPE_ROOMS.find((e) => e.mcId === mcId);
}

export function escapeSrc(mcId: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/embeds/escape/${mcId}/index.html`;
}

// Costruzioni GeoGebra: l'elenco completo sta in lib/geogebra-costruzioni.ts (qui serve all'indice di ricerca)
export const GEOGEBRA = [
  ...COSTRUZIONI_GEOGEBRA.map((c) => ({
    href: hrefCostruzione(c),
    titolo: c.titolo,
    mcId: MC_COSTRUZIONI,
    descrizione: c.descrizione,
  })),
  // Tavole di proiezioni ortogonali (lib/geogebra-proiezioni.ts)
  ...TAVOLE_PO_PRONTE.map((t) => ({
    href: hrefTavolaPO(t),
    titolo: t.titolo,
    mcId: MC_PROIEZIONI,
    descrizione: `${t.descrizione} Proiezioni ortogonali, proiettore.`,
  })),
];
