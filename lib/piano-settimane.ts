// Prepara per i componenti client il piano della «Lezione della settimana»:
// risolve titoli, aree e immagini delle MC. Solo lato server (usa il filesystem).

import { getPrimaryVisual } from "./content-loader";
import { PIANO_LEZIONI, type VoceLezione } from "./lezione-settimanale";
import { getAllMCs } from "./mc-loader";
import type { Binario, PianoSettimane, VoceSettimana } from "./piano-docente";

export function costruisciPianoSettimane(): PianoSettimane {
  const allMCs = getAllMCs();
  const voce = (v: VoceLezione, binario: Binario): VoceSettimana => {
    const mc = v.mc ? allMCs.find((m) => m.id === v.mc) : undefined;
    const area = mc?.area ?? (binario === "pratica" ? "DIS" : "");
    return {
      ...v,
      mcTitolo: mc?.titolo,
      area: mc?.area,
      tipo: binario === "teoria" ? "Teoria" : area === "DIS" ? "Disegno" : "Coding",
      // Le settimane con le tavole mostrano le anteprime delle tavole; le altre l'immagine della lezione.
      immagine: mc && !v.tavole?.length ? getPrimaryVisual(mc.id)?.src : undefined,
    };
  };
  return Object.fromEntries(
    Object.entries(PIANO_LEZIONI).map(([classe, p]) => [
      classe,
      { teoria: p.teoria.map((v) => voce(v, "teoria")), pratica: p.pratica.map((v) => voce(v, "pratica")) },
    ])
  );
}
