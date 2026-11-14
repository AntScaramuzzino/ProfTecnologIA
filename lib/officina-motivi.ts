// Officina dei motivi modulari (MC-DIS-1-01): generatore di motivi da ridisegnare su carta.
// Pagina autonoma in public/embeds/officina-motivi/index.html (un solo file, senza dipendenze).
// Le tavole GeoGebra collegate sono le costruzioni 34+ del registro lib/geogebra-costruzioni.ts (categoria "moti").
export const MC_OFFICINA = "MC-DIS-1-01";

export const OFFICINA_MOTIVI = {
  titolo: "Officina dei motivi modulari",
  descrizione:
    "Scegli un motivo (greche, piastrelle, Optical Art, stelle, rosoni, tassellature, fregi, frattali, labirinti), regolalo e leggi i passi e le misure per ridisegnarlo sul foglio. Con «Guarda come si disegna» una matita traccia la costruzione passo per passo. Puoi anche disegnare tu, con gli specchi oppure modellando un tassello a incastro. In più scegli il reticolo, guardi il modulo quotato e scarichi la tavola A4. Nella scheda «Pavimento» vedi la composizione in prospettiva; nelle Piastrellature puoi partire da una foto e scaricare un timbro da stampare in 3D.",
  famiglie: 18,
};

export function officinaSrc(): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/embeds/officina-motivi/index.html`;
}
