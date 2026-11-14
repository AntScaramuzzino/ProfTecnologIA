// Officina dei motivi modulari (MC-DIS-1-01): generatore di motivi da ridisegnare su carta.
// Pagina autonoma in public/embeds/officina-motivi/index.html (un solo file, senza dipendenze).
// Le tavole GeoGebra collegate sono le costruzioni 34+ del registro lib/geogebra-costruzioni.ts (categoria "moti").
export const MC_OFFICINA = "MC-DIS-1-01";

export const OFFICINA_MOTIVI = {
  titolo: "Officina dei motivi modulari",
  descrizione:
    "Scegli un motivo (greche, piastrelle, Optical Art, stelle, rosoni, tassellature, fregi, frattali, labirinti), regolalo e leggi i passi e le misure per ridisegnarlo sul foglio. Puoi scegliere il reticolo, vedere il modulo quotato e scaricare la tavola A4.",
  famiglie: 18,
};

export function officinaSrc(): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/embeds/officina-motivi/index.html`;
}
