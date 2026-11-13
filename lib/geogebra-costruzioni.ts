// Registro delle tavole di costruzione geometrica GeoGebra (MC-DIS-1-01).
// - Le tavole 1 e 2 hanno un embed dedicato (pagine scritte a mano).
// - Le tavole 3–8 sono definite in public/embeds/geogebra/costruzioni-base/activity.js
// - Le tavole 9+ in public/embeds/geogebra/costruzioni-base/tavole.js
// Per aggiungerne una: definiscila in tavole.js, poi aggiungi qui una riga (skill «tavole-geogebra»).

export interface CostruzioneGeoGebra {
  numero: number;
  /** slug della pagina /laboratori/costruzioni/<slug> e chiave ?activity= del motore */
  slug: string;
  titolo: string;
  /** una riga per l'elenco dei laboratori */
  descrizione: string;
  /** due frasi per l'apertura della pagina */
  intro: string;
  /** consegna «Prova tu» sotto l'animazione */
  provaTu: string;
  /** pagina dedicata scritta a mano (solo tavole 1 e 2) */
  href?: string;
}

export const MC_COSTRUZIONI = "MC-DIS-1-01";

export const COSTRUZIONI_GEOGEBRA: CostruzioneGeoGebra[] = [
  { numero: 1, slug: "perpendicolare", href: "/laboratori/perpendicolare", titolo: "Perpendicolare a una retta in un punto",
    descrizione: "Due distanze uguali e due archi: nasce l’angolo retto.", intro: "", provaTu: "" },
  { numero: 2, slug: "bisettrice-angolo", href: "/laboratori/bisettrice-angolo", titolo: "Bisettrice di un angolo",
    descrizione: "Due archi con la stessa apertura dividono l’angolo a metà.", intro: "", provaTu: "" },
  { numero: 3, slug: "divisione-segmento", titolo: "Divisione di un segmento in 5 parti uguali",
    descrizione: "Il metodo delle parallele: dividi senza fare conti.",
    intro: "Guarda come cinque distanze uguali su una semiretta, trasportate da rette parallele, dividono il segmento in parti uguali. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Ripeti la costruzione con un segmento di 9 cm diviso in 5 parti. Alla fine misura i cinque tratti: devono essere uguali entro un millimetro." },
  { numero: 4, slug: "perpendicolare-punto-esterno", titolo: "Perpendicolare da un punto esterno",
    descrizione: "Dal punto P alla retta r per la strada più corta.",
    intro: "Guarda come un arco e due archetti trovano la retta che scende da P e incontra r ad angolo retto. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Segna un punto P a 5 cm da una retta e costruisci la perpendicolare. Controlla con la squadra l’angolo nel punto d’incontro." },
  { numero: 5, slug: "triangolo-equilatero", titolo: "Triangolo equilatero dato il lato",
    descrizione: "Il compasso aperto quanto il lato trova il terzo vertice.",
    intro: "Guarda come due archi con apertura uguale al lato si incontrano nel terzo vertice. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Costruisci un triangolo equilatero di lato 6 cm. Misura i tre lati: devono essere uguali entro un millimetro." },
  { numero: 6, slug: "esagono-inscritto", titolo: "Esagono regolare inscritto",
    descrizione: "Il raggio riportato sei volte chiude il giro.",
    intro: "Guarda come il raggio della circonferenza, riportato sei volte con il compasso, diventa il lato dell’esagono. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Disegna una circonferenza di raggio 4 cm e costruisci l’esagono. L’ultimo archetto deve tornare esattamente sul primo vertice." },
  { numero: 7, slug: "quadrato-dato-lato", titolo: "Quadrato dato il lato",
    descrizione: "Due perpendicolari e la stessa misura riportata con il compasso.",
    intro: "Guarda come due perpendicolari e due archi uguali al lato completano il quadrato. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Costruisci un quadrato di lato 6 cm. Misura le due diagonali: devono essere uguali." },
  { numero: 8, slug: "pentagono-inscritto", titolo: "Pentagono regolare inscritto",
    descrizione: "Il punto medio del raggio porta alla misura del lato.",
    intro: "Guarda come dal punto medio di un raggio si ricava la misura del lato del pentagono. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Disegna una circonferenza di raggio 4 cm e costruisci il pentagono. Controlla che i cinque lati siano uguali." },
  { numero: 9, slug: "asse-segmento", titolo: "Asse di un segmento",
    descrizione: "Punto medio e perpendicolare con due soli archi.",
    intro: "Guarda come due archi con la stessa apertura trovano il punto medio di un segmento e la retta perpendicolare che ci passa. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Traccia un segmento AB di 7 cm e costruisci il suo asse. Misura AM e MB: devono essere uguali, 3,5 cm ciascuno." },
  { numero: 10, slug: "perpendicolare-estremo", titolo: "Perpendicolare in un estremo del segmento",
    descrizione: "Un angolo retto con una sola apertura del compasso.",
    intro: "Guarda come una sola apertura del compasso, usata più volte, costruisce un angolo retto nell’estremo di un segmento, senza prolungarlo. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Traccia un segmento AB di 7 cm e costruisci la perpendicolare in A. Controlla con la squadra che l’angolo sia di 90°." },
  { numero: 11, slug: "parallela-per-punto", titolo: "Parallela a una retta per un punto",
    descrizione: "Due aperture del compasso ricopiano la direzione della retta.",
    intro: "Guarda come due aperture del compasso costruiscono un parallelogramma nascosto e, con lui, la parallela che cerchi. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Traccia una retta r, segna un punto P a 4 cm di distanza e costruisci la parallela. Misura la distanza tra le due rette in due punti lontani: deve essere la stessa." },
  { numero: 12, slug: "angolo-retto-tre-parti", titolo: "Angolo retto diviso in tre parti uguali",
    descrizione: "Tre angoli da 30° senza goniometro.",
    intro: "Guarda come una sola apertura del compasso, riportata due volte, divide l’angolo retto in tre angoli da 30°. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Disegna un angolo retto con la squadra e dividilo in tre parti. Poi controlla con il goniometro: tre angoli da 30°." },
  { numero: 13, slug: "triangolo-inscritto", titolo: "Triangolo equilatero inscritto",
    descrizione: "La circonferenza divisa in tre parti uguali.",
    intro: "Guarda come un diametro e un solo arco, aperto quanto il raggio, dividono la circonferenza in tre parti uguali. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Disegna una circonferenza di raggio 4 cm e costruisci il triangolo inscritto. Misura i tre lati: devono essere uguali." },
  { numero: 14, slug: "quadrato-inscritto", titolo: "Quadrato inscritto",
    descrizione: "Due diametri perpendicolari, quattro vertici.",
    intro: "Guarda come due diametri perpendicolari dividono la circonferenza in quattro parti uguali. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Disegna una circonferenza di raggio 4 cm e costruisci il quadrato inscritto. Controlla con la squadra uno degli angoli." },
  { numero: 15, slug: "ottagono-inscritto", titolo: "Ottagono regolare inscritto",
    descrizione: "Dal quadrato all’ottagono raddoppiando i lati.",
    intro: "Guarda come, partendo dal quadrato inscritto, basta dividere a metà ogni arco per ottenere otto lati. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Parti dal quadrato inscritto in una circonferenza di raggio 4 cm e costruisci l’ottagono. Misura gli otto lati: devono essere uguali." },
  { numero: 16, slug: "ettagono-inscritto", titolo: "Ettagono inscritto",
    descrizione: "Sette lati con una costruzione approssimata ma precisa.",
    intro: "Guarda come un arco aperto quanto il raggio ti dà la misura del lato dell’ettagono. È una costruzione approssimata, ma lo scarto su ogni lato è più piccolo di un tratto di matita. Poi ripetila sul tuo foglio.",
    provaTu: "Disegna una circonferenza di raggio 4 cm e costruisci l’ettagono. Misura l’ultimo lato: di quanto è diverso dagli altri?" },
  { numero: 17, slug: "triangolo-tre-lati", titolo: "Triangolo scaleno dati i tre lati",
    descrizione: "Tre misure e due archetti per trovare il terzo vertice.",
    intro: "Guarda come due archetti, aperti quanto due dei lati, trovano il terzo vertice del triangolo. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Costruisci il triangolo con lati di 8, 6 e 7 cm. Poi prova con 8, 3 e 4 cm: che cosa succede, e perché?" },
  { numero: 18, slug: "triangolo-rettangolo", titolo: "Triangolo rettangolo dati un cateto e l’ipotenusa",
    descrizione: "Una perpendicolare e un arco con l’apertura dell’ipotenusa.",
    intro: "Guarda come la perpendicolare in un estremo del cateto, tagliata da un arco con apertura uguale all’ipotenusa, chiude il triangolo. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Costruisci il triangolo con cateto di 6 cm e ipotenusa di 7,5 cm. Misura il secondo cateto: deve venire 4,5 cm." },
  { numero: 19, slug: "ovale-asse-maggiore", titolo: "Ovale dato l’asse maggiore",
    descrizione: "Quattro archi di compasso raccordati senza spigoli.",
    intro: "Guarda come due circonferenze uguali e due archi più grandi si uniscono in una curva chiusa senza spigoli. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Costruisci un ovale con asse maggiore di 10,5 cm (tre parti da 3,5 cm). Ripassa il contorno e controlla che nei quattro punti di raccordo non ci siano spigoli." },
  { numero: 20, slug: "spirale-due-centri", titolo: "Spirale a due centri",
    descrizione: "Semicirconferenze che crescono alternando due centri.",
    intro: "Guarda come, alternando due centri sulla stessa retta, ogni semicirconferenza allarga la curva sempre della stessa quantità. Poi ripeti la costruzione sul tuo foglio.",
    provaTu: "Costruisci una spirale con passo di 1,6 cm: A e B distano 0,8 cm. Traccia almeno sei semicirconferenze e misura la distanza tra due giri vicini." },
];

export function hrefCostruzione(c: CostruzioneGeoGebra): string {
  return c.href ?? `/laboratori/costruzioni/${c.slug}`;
}

export function getCostruzione(slug: string): CostruzioneGeoGebra | undefined {
  return COSTRUZIONI_GEOGEBRA.find((c) => c.slug === slug && !c.href);
}
