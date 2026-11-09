/**
 * Immagini con contenuto che non corrispondono più al testo pubblicato della MC.
 *
 * Contesto (2026-11-09): in 9 MC il testo è stato riscritto su un tema diverso da quello
 * della scheda JSON originale; il JSON è stato riallineato al testo (decisione autore:
 * vale il testo). Le immagini generate dal vecchio tema restano nella cartella ma non
 * vengono mostrate finché non sono rigenerate.
 *
 * Si nascondono solo le immagini che portano contenuto (sketchnote di RIPASSA, immagine
 * del compito di realtà, mappa concettuale, tavola da testo, infografica di processo).
 * Restano visibili le foto decorative (copertina, contesto) e i ritratti delle professioni,
 * che corrispondono già al testo.
 *
 * L'hook audio di queste 9 MC è stato riscritto e rigenerato il 2026-11-09 (v2.0)
 * e non è più nascosto.
 *
 * Quando un asset viene rigenerato con lo stesso nome file, togliere la MC (o il tipo)
 * da questo elenco. Brief: BRIEF_rigenerazione_asset_9MC (2026-11-09).
 */

const TIPI_CONTENUTO = [
  "ripassa-sketchnote",
  "compito_realta",
  "mindmap",
  "immagine_da_md",
  "infografica",
];

/** MC con testo su un tema diverso dalle immagini generate in origine. */
export const MC_ASSET_FUORI_TEMA: Record<string, string> = {
  "MC-ALI-2-05": "immagini sugli sprechi alimentari, testo sul packaging",
  "MC-ALI-2-06": "immagini su cibo, cultura e biodiversità, testo sull'innovazione alimentare",
  "MC-AMB-2-04": "immagini sui materiali da costruzione, testo sull'architettura bioclimatica",
  "MC-AMB-2-05": "immagini sulla smart city, testo sul ciclo artificiale dell'acqua",
  "MC-AMB-2-06": "immagini sul rischio idrogeologico, testo sulla smart city",
  "MC-DIG-2-03": "immagini sul sistema operativo, testo sull'organizzazione del computer",
  "MC-MAT-1-05": "immagini sulla scelta dei materiali, testo sui metalli",
  "MC-MAT-1-06": "immagini su biomateriali e bioplastiche, testo su fibre, plastiche e compositi",
  "MC-SIS-3-04": "immagini su qualità e certificazioni, testo sull'orientamento professionale",
};

export function isVisualFuoriTema(mcId: string, fileName: string): boolean {
  return mcId in MC_ASSET_FUORI_TEMA && TIPI_CONTENUTO.some((t) => fileName.includes(t));
}
