import type { Metadata } from "next";
import { getAllMCs } from "@/lib/mc-loader";
import { normalizeSdgList } from "@/lib/sdg-badges";
import ProgressiClient from "./ProgressiClient";

export const metadata: Metadata = {
  title: "Progressi — ProfTecnologIA",
  description: "Traccia i tuoi progressi nelle 52 micro-competenze di Tecnologia",
};

/**
 * Pagina progressi — server component.
 * Costruisce l'indice MC lato server e lo passa al client component ProgressiClient
 * che legge localStorage per mostrare i dati di tracciamento dello studente.
 */
export default function ProgressiPage() {
  const mcIndex = getAllMCs().map((mc) => ({
    id:     mc.id,
    titolo: mc.titolo,
    area:   mc.area,
    anno:   mc.anno as number,
    tags:   mc.tags ?? [],
    sdg:    normalizeSdgList(mc.sdg),
  }));

  return <ProgressiClient mcIndex={mcIndex} />;
}
