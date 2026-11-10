// Registro delle esplorazioni immersive: pagine a zoom progressivo in public/embeds/esplorazioni/<slug>/
// - index.html: motore comune (uguale per tutte), dati.js: scene, testi e punti, img/: una immagine per scena
// - anteprima.webp: scena di partenza a 640×360, usata nella scheda della pagina Laboratori
// Per aggiungerne una: copiare la cartella, riscrivere dati.js, sostituire le immagini e aggiungere una riga qui.

export interface EsplorazioneImmersiva {
  slug: string;
  mcId: string;
  titolo: string;
  descrizione: string;
  classe: number;
  area: string;
  scene: number;
}

export const ESPLORAZIONI: EsplorazioneImmersiva[] = [
  {
    slug: "acquedotto-e-depuratore",
    mcId: "MC-AMB-2-05",
    titolo: "Dalla sorgente al depuratore",
    classe: 2,
    area: "AMB",
    scene: 13,
    descrizione:
      "Il ciclo artificiale dell'acqua visto dai suoi impianti: opera di presa, filtri a sabbia, serbatoio, fognatura e vasche del depuratore.",
  },
  {
    slug: "centrale-idroelettrica",
    mcId: "MC-ENE-3-03",
    titolo: "La centrale idroelettrica",
    classe: 3,
    area: "ENE",
    scene: 13,
    descrizione:
      "Dalla diga alla presa di casa: condotte forzate, turbina Pelton, alternatore, trasformatore e linee ad alta tensione.",
  },
];

function cartella(slug: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/embeds/esplorazioni/${slug}`;
}

export function esplorazioneSrc(slug: string): string {
  return `${cartella(slug)}/index.html`;
}

export function esplorazioneAnteprima(slug: string): string {
  return `${cartella(slug)}/anteprima.webp`;
}
