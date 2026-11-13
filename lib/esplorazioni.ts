// Registro delle esplorazioni immersive: pagine a zoom progressivo (dal macro al micro, fino a 5-6 livelli) in public/embeds/esplorazioni/<slug>/
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
    scene: 20,
    descrizione:
      "Il ciclo artificiale dell'acqua visto dai suoi impianti: opera di presa, filtri a sabbia, serbatoio, fognatura e vasche del depuratore. Si scende fino ai granelli di sabbia, ai batteri e al DNA.",
  },
  {
    slug: "bicicletta",
    mcId: "MC-ENE-3-01",
    titolo: "La bicicletta",
    classe: 3,
    area: "ENE",
    scene: 16,
    descrizione:
      "Le macchine semplici dentro una bicicletta: pedivella, catena e pignoni, leva del freno, ruota e viti. Si scende fino alle sfere dei cuscinetti e all'attrito visto al microscopio.",
  },
  {
    slug: "dove-vive-internet",
    mcId: "MC-COM-3-05",
    titolo: "Dove vive Internet",
    classe: 3,
    area: "COM",
    scene: 15,
    descrizione:
      "I luoghi fisici di Internet: cavo sottomarino, stazione di approdo, data center e antenna. Si scende fino alla luce dentro una fibra ottica e al processore di un server.",
  },
  {
    slug: "scheletro-edificio",
    mcId: "MC-AMB-2-01",
    titolo: "Lo scheletro dell'edificio",
    classe: 2,
    area: "AMB",
    scene: 15,
    descrizione:
      "Il percorso del peso dentro un edificio in costruzione: solaio, trave, pilastro, fondazioni e terreno. Si scende fino alla barra d'acciaio, ai cristalli del cemento e ai granelli del suolo.",
  },
  {
    slug: "acciaieria",
    mcId: "MC-MAT-1-05",
    titolo: "L'acciaieria",
    classe: 1,
    area: "MAT",
    scene: 15,
    descrizione:
      "Dal minerale di ferro alla bobina di lamiera: parco minerali, altoforno, convertitore, colata continua e laminatoio. Si scende fino ai grani e agli atomi dell'acciaio, e si torna indietro con il rottame e il forno elettrico.",
  },
  {
    slug: "frantoio",
    mcId: "MC-ALI-2-04",
    titolo: "Il frantoio",
    classe: 2,
    area: "ALI",
    scene: 15,
    descrizione:
      "Dall'oliveto alla tavola: raccolta, lavaggio, frangitura, gramolatura e decanter, fino alla bottiglia. Si scende dentro l'oliva, fino alle cellule della polpa e alle molecole dell'olio, e si scopre che cosa diventa la sansa.",
  },
  {
    slug: "motore",
    mcId: "MC-ENE-3-05",
    titolo: "Il motore a quattro tempi",
    classe: 3,
    area: "ENE",
    scene: 15,
    descrizione:
      "Sotto il cofano di un'auto a benzina: blocco, pistone e biella, albero motore, testata con valvole e candela, radiatore e scarico. Si scende fino alla scintilla tra gli elettrodi, alle molecole della benzina e al nido d'ape del catalizzatore.",
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
    scene: 18,
    descrizione:
      "Dalla diga alla presa di casa: condotte forzate, turbina Pelton, alternatore, trasformatore e linee ad alta tensione. Si scende fino ai cristalli dell'acciaio e agli elettroni nel rame.",
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
