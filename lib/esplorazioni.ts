// Registro delle esplorazioni immersive: pagine a zoom progressivo in public/embeds/esplorazioni/<slug>/
// - index.html: motore comune (uguale per tutte), dati.js: scene, testi e punti, img/: una immagine per scena
// - anteprima.webp: scena di partenza a 640×360, usata nella scheda della pagina Laboratori
// Per aggiungerne una: copiare la cartella, riscrivere dati.js, sostituire le immagini e aggiungere una riga qui.
// - slug è il nome della cartella e deve coincidere con il campo id di dati.js: i progressi si agganciano a quello
// - scene è il numero di scene (nodi) di dati.js: è il totale mostrato nei progressi
// La riga fa comparire l'esplorazione nella pagina Laboratori e in cima alla scheda OSSERVA della MC collegata.

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
    slug: "impianto-di-selezione",
    mcId: "MC-MAT-1-04",
    titolo: "L'impianto di selezione dei rifiuti",
    classe: 1,
    area: "MAT",
    scene: 12,
    descrizione:
      "Che cosa succede agli imballaggi dopo la raccolta differenziata: vaglio rotante, calamite, correnti parassite, telecamere a infrarossi e pressa.",
  },
  {
    slug: "casa-e-impianti",
    mcId: "MC-AMB-2-02",
    titolo: "La casa e i suoi impianti",
    classe: 2,
    area: "AMB",
    scene: 12,
    descrizione:
      "Corrente, acqua, gas e calore dentro le pareti di casa: contatori, quadro elettrico e salvavita, sifone, fornello, caldaia, termostato e pompa di calore.",
  },
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
    slug: "centrale-termoelettrica",
    mcId: "MC-ENE-3-02",
    titolo: "La centrale termoelettrica",
    classe: 3,
    area: "ENE",
    scene: 12,
    descrizione:
      "Una centrale a gas a ciclo combinato: turbina a gas, caldaia a recupero, turbina a vapore, condensatore, torri di raffreddamento e stazione elettrica.",
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

/** Indirizzo per l'inserimento in una pagina del libro: rotella e scorrimento verticale restano alla pagina */
export function esplorazioneEmbedSrc(slug: string): string {
  return `${cartella(slug)}/index.html?incorporata=1`;
}

/** Esplorazioni collegate a una MC (di norma una sola) */
export function getEsplorazioni(mcId: string): EsplorazioneImmersiva[] {
  return ESPLORAZIONI.filter((e) => e.mcId === mcId);
}
