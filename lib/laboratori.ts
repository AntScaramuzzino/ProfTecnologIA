// Registro dei laboratori interattivi (piano: 00_ARCHITETTURA/PIANO_LABORATORI_INTERATTIVI_v1.0.md)
// Le pagine sono generate da scripts/laboratori/ in public/embeds/lab/<MC-ID>/index.html (npm run labs).

export type ArchetipoLab =
  | "Simulatore"
  | "Smistatore"
  | "Ispettore"
  | "Tavolo grafico"
  | "Programmatore";

export interface LaboratorioInterattivo {
  mcId: string;
  titolo: string;
  archetipo: ArchetipoLab;
  descrizione: string;
  classe: 1 | 2 | 3;
  areaColor: string;
}

export const LABORATORI: LaboratorioInterattivo[] = [
  {
    mcId: "MC-MAT-1-04",
    titolo: "Differenzia!",
    archetipo: "Smistatore",
    descrizione:
      "Smista i rifiuti, ispeziona i contenitori di una classe e costruisci il piano di miglioramento per il Comune.",
    classe: 1,
    areaColor: "#6D4C41",
  },
  {
    mcId: "MC-DIG-1-03",
    titolo: "Il robot della colazione",
    archetipo: "Programmatore",
    descrizione:
      "Riconosci sequenze, condizioni e cicli, scrivi un algoritmo testato su quattro mattine e progetta le regole di un docente automatico.",
    classe: 1,
    areaColor: "#006064",
  },
  {
    mcId: "MC-DIG-2-04",
    titolo: "Casella sotto attacco",
    archetipo: "Ispettore",
    descrizione:
      "Trova i segnali di phishing in una casella simulata, metti alla prova password inventate e scopri che cosa cambia con l'IA.",
    classe: 2,
    areaColor: "#006064",
  },
  {
    mcId: "MC-DIS-2-01",
    titolo: "Tre sguardi",
    archetipo: "Tavolo grafico",
    descrizione:
      "Proiezioni ortogonali con il metodo europeo: solidi 3D da ruotare, foro passante con linee nascoste, ricostruzione del pezzo dalle tre viste.",
    classe: 2,
    areaColor: "#1A3A7A",
  },
  {
    mcId: "MC-ENE-3-01",
    titolo: "Banco delle leve",
    archetipo: "Simulatore",
    descrizione:
      "Classifica le macchine semplici, simula una leva e porta una pietra da 500 kg in cima a una torre medievale.",
    classe: 3,
    areaColor: "#E65100",
  },
];

export function getLaboratorio(mcId: string): LaboratorioInterattivo | undefined {
  return LABORATORI.find((l) => l.mcId === mcId);
}

export function labSrc(mcId: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/embeds/lab/${mcId}/index.html`;
}
