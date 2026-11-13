// Registro delle tavole di proiezioni ortogonali (MC-DIS-2-01).
// Ogni tavola unisce due strumenti:
//  - il proiettore ortogonale (public/embeds/proiettore/): il solido in 3D e le sue tre viste dal vivo;
//  - la costruzione GeoGebra passo per passo (public/embeds/geogebra/costruzioni-base/tavole-po.js).
// Per aggiungere una tavola: definiscila in tavole-po.js con la chiave `po-<slug>`, salva l'anteprima in
// public/assets/proiezioni/<slug>.webp, poi qui metti `pronta: true` e compila intro, provaTu e proiettore.

export const MC_PROIEZIONI = "MC-DIS-2-01";

/** Apertura del proiettore sul solido della tavola. Le misure sono in centimetri, con le chiavi del proiettore. */
export interface PresetProiettore {
  /** id del solido nel proiettore: prismatri, piramide, parallelepipedo, cubo, esagonale, cilindropieno, cono, elle… */
  solido: string;
  /** chiavi del proiettore (r, alt, lato, L, H, P, larg, prof); per il blocco a L anche `sp`, lo spessore dei bracci */
  misure: Record<string, number>;
  /** rotazione di partenza in gradi: alfa attorno all'asse verticale, beta inclinazione */
  alfa: number;
  beta: number;
  /** testo delle misure mostrato nel proiettore */
  etichetta: string;
}

export interface TavolaPO {
  /** posizione nel percorso dei fondamentali */
  numero: number;
  /** pagina /laboratori/proiezioni/<slug>; la chiave del motore GeoGebra è `po-<slug>` */
  slug: string;
  titolo: string;
  /** una riga per l'elenco */
  descrizione: string;
  /** false = prevista dal percorso ma non ancora costruita */
  pronta: boolean;
  /** due frasi per l'apertura della pagina */
  intro?: string;
  /** solido da guardare nel proiettore (manca per il punto; una figura piana è un prisma sottile: SPESSORE_CARTONCINO) */
  proiettore?: PresetProiettore;
  /** consegna «Prova tu», con misure diverse da quelle della tavola */
  provaTu?: string;
  /** controlli che l'alunno può fare da solo sul suo foglio */
  controlli?: string[];
  /** lo stesso solido della prova, da aprire nel proiettore per confrontare le viste */
  proiettoreProva?: PresetProiettore;
}

export interface TemaApprofondimento {
  lettera: string;
  titolo: string;
  descrizione: string;
}

const R_TRIANGOLO = (lato: number) => Number((lato / Math.sqrt(3)).toFixed(4)); // raggio della circonferenza circoscritta
/** Una figura piana, nel proiettore, è un prisma alto 2 mm: un cartoncino. */
const SPESSORE_CARTONCINO = 0.2;

export const TAVOLE_PO: TavolaPO[] = [
  { numero: 1, slug: "foglio", pronta: true, titolo: "Il foglio e i tre piani",
    descrizione: "Linea di terra, asse verticale, PO, PV e PL: come si prepara il foglio.",
    intro: "Tutte le tavole di proiezioni ortogonali cominciano dallo stesso foglio. Prima guarda nel proiettore un cubo tra i tre piani, con le sue tre viste. Poi prepara il foglio: linea di terra, asse verticale, nomi dei piani e arco di compasso.",
    proiettore: { solido: "cubo", misure: { lato: 4 }, alfa: 0, beta: 0, etichetta: "Cubo di lato 4 cm" },
    provaTu: "Prepara un foglio nuovo: traccia la LT e l’asse verticale, poi scrivi PV, PO e PL nei tre riquadri. Segna sull’asse verticale due punti, uno 3 cm sotto O e uno 6 cm sotto O, e portali sulla LT con due archi di compasso.",
    controlli: [
      "LT e asse verticale formano quattro angoli retti: controlla con la squadra.",
      "I due archi hanno il centro in O e arrivano sulla LT a 3 cm e a 6 cm da O, verso destra.",
      "Nel riquadro in basso a destra ci sono solo i due archi.",
    ] },
  { numero: 2, slug: "punto", pronta: true, titolo: "Proiezioni ortogonali di un punto",
    descrizione: "Tre distanze dai piani, tre proiezioni: A′, A″ e A‴.",
    intro: "Un punto nello spazio si riconosce da tre distanze: dal PO, dal PV e dal PL. Guarda come queste tre misure diventano tre punti sul foglio, collegati dalle linee di proiezione e da un arco di compasso. Poi ripeti la tavola sul tuo foglio.",
    provaTu: "Disegna le proiezioni del punto B, che sta a 4 cm dal PO, a 2 cm dal PV e a 6 cm dal PL.",
    controlli: [
      "B′ e B″ stanno sulla stessa linea verticale.",
      "B″ e B‴ stanno alla stessa altezza: 4 cm dalla LT.",
      "B‴ sta a 2 cm dall’asse verticale.",
    ] },
  { numero: 3, slug: "triangolo-parallelo-po", pronta: true, titolo: "Triangolo equilatero parallelo al PO",
    descrizione: "Una figura piana si vede intera su un piano e di taglio sugli altri due.",
    intro: "Una figura piana non ha spessore: nel proiettore la vedi come un cartoncino sottile. Osserva che cosa diventa dall’alto, di fronte e di fianco. Poi segui la costruzione: parti dal PO, dove il triangolo si vede intero.",
    proiettore: { solido: "prismatri", misure: { r: R_TRIANGOLO(7), alt: SPESSORE_CARTONCINO }, alfa: 180, beta: 0, etichetta: "Triangolo equilatero di lato 7 cm, come un cartoncino sottile" },
    provaTu: "Ripeti la tavola con un triangolo equilatero ABC di lato 6 cm, parallelo al PO, 4 cm più in alto. Il lato AB è parallelo alla LT, a 7 cm dal PV; B dista 3 cm dal PL; C è rivolto verso la LT.",
    controlli: [
      "Nel PV il triangolo è un segmento lungo 6 cm, a 4 cm dalla LT.",
      "Nel PL è un segmento lungo circa 5,2 cm, alla stessa altezza.",
      "C′ sta a circa 1,8 cm dalla LT; A‴ e B‴ cadono nello stesso punto.",
    ],
    proiettoreProva: { solido: "prismatri", misure: { r: R_TRIANGOLO(6), alt: SPESSORE_CARTONCINO }, alfa: 180, beta: 0, etichetta: "Triangolo equilatero di lato 6 cm, come un cartoncino sottile" } },
  { numero: 4, slug: "esagono-parallelo-pv", pronta: true, titolo: "Esagono parallelo al PV",
    descrizione: "Cambia il piano di partenza: la figura intera adesso sta nel PV.",
    intro: "Questo esagono è parallelo al PV: è di fronte che si vede intero. Guardalo nel proiettore, come un cartoncino sottile. Poi segui la costruzione, che questa volta comincia dal PV.",
    proiettore: { solido: "esagonale", misure: { r: 3.5, alt: SPESSORE_CARTONCINO }, alfa: 90, beta: 90, etichetta: "Esagono regolare di lato 3,5 cm, come un cartoncino sottile" },
    provaTu: "Ripeti la tavola con un esagono regolare ABCDEF di lato 3 cm, parallelo al PV, a 2 cm di distanza. Il centro sta 4 cm sopra il PO e a 5 cm dal PL; A e D sono alla stessa altezza del centro.",
    controlli: [
      "Nel PO l’esagono è un segmento lungo 6 cm, 2 cm sotto la LT.",
      "Nel PL è un segmento verticale lungo circa 5,2 cm, a 2 cm dall’asse verticale.",
      "Nel PO i punti sono quattro: A′, B′ ≡ F′, C′ ≡ E′ e D′.",
    ],
    proiettoreProva: { solido: "esagonale", misure: { r: 3, alt: SPESSORE_CARTONCINO }, alfa: 90, beta: 90, etichetta: "Esagono regolare di lato 3 cm, come un cartoncino sottile" } },
  { numero: 5, slug: "parallelepipedo", pronta: true, titolo: "Parallelepipedo appoggiato sul PO",
    descrizione: "Il primo solido: tre rettangoli, tre coppie di misure.",
    intro: "Il parallelepipedo è il solido più semplice da proiettare: ogni vista è un rettangolo. Guardalo nel proiettore nella posizione di partenza e osserva quali due misure compaiono in ogni vista; poi ruotalo. Infine segui la costruzione.",
    proiettore: { solido: "parallelepipedo", misure: { L: 6, H: 8, P: 4 }, alfa: 0, beta: 0, etichetta: "Base 6 × 4 cm · altezza 8 cm" },
    provaTu: "Ripeti la tavola con un parallelepipedo con la base di 7 × 3 cm, alto 5 cm, appoggiato sul PO, con i lati di 7 cm paralleli alla LT. Dista 2 cm dal PV e 4 cm dal PL.",
    controlli: [
      "Nel PO il rettangolo misura 7 × 3 cm, nel PV 7 × 5 cm, nel PL 3 × 5 cm.",
      "Nel PV e nel PL il rettangolo è appoggiato sulla LT.",
      "Nel PL il rettangolo comincia a 2 cm dall’asse verticale e finisce a 5 cm.",
    ],
    proiettoreProva: { solido: "parallelepipedo", misure: { L: 7, H: 5, P: 3 }, alfa: 0, beta: 0, etichetta: "Base 7 × 3 cm · altezza 5 cm" } },
  { numero: 6, slug: "prisma-triangolare", pronta: true, titolo: "Prisma triangolare con la base sul PO",
    descrizione: "Dal triangolo di base ai due rettangoli, con il primo spigolo nascosto.",
    intro: "Prima ruota il prisma nel proiettore e osserva che cosa diventa da ciascun punto di vista. Poi segui la costruzione: parti dal triangolo sul PO, sali nel PV e con il compasso arrivi al PL.",
    proiettore: { solido: "prismatri", misure: { r: R_TRIANGOLO(6), alt: 8 }, alfa: 180, beta: 0, etichetta: "Lato di base 6 cm · altezza 8 cm" },
    provaTu: "Ripeti la tavola con un prisma triangolare di lato 5 cm, alto 7 cm, appoggiato sul PO. Come nella tavola, il lato BC è parallelo alla LT, 7 cm più in basso, C sta a 3 cm dall’asse verticale e il vertice A è rivolto verso la LT.",
    controlli: [
      "Nel PV il rettangolo è largo 5 cm e alto 7 cm, con lo spigolo di mezzo tratteggiato.",
      "Nel PL il rettangolo è alto 7 cm e largo circa 4,3 cm: è l’altezza del triangolo di base.",
      "Le tre viste sono allineate: stessa larghezza tra PO e PV, stessa altezza tra PV e PL.",
    ],
    proiettoreProva: { solido: "prismatri", misure: { r: R_TRIANGOLO(5), alt: 7 }, alfa: 180, beta: 0, etichetta: "Lato di base 5 cm · altezza 7 cm" } },
  { numero: 7, slug: "prisma-esagonale", pronta: true, titolo: "Prisma esagonale con la base parallela al PO",
    descrizione: "Un solido sollevato da terra: nel PV e nel PL non tocca la LT.",
    intro: "Guarda il prisma nel proiettore nella posizione di partenza e conta le facce che vedi di fronte e di fianco; poi ruotalo. Nella costruzione questo prisma non è appoggiato sul PO: sta 1,5 cm più in alto, e sul foglio lo riconosci perché il rettangolo non tocca la LT.",
    proiettore: { solido: "esagonale", misure: { r: 3.5, alt: 7.5 }, alfa: 90, beta: 0, etichetta: "Lato di base 3,5 cm · altezza 7,5 cm" },
    provaTu: "Ripeti la tavola con un prisma esagonale regolare di lato 3 cm, alto 7 cm. La base è parallela al PO, 2 cm più in alto, con due lati paralleli alla LT. Il centro della base dista 4 cm dal PV e 5 cm dal PL.",
    controlli: [
      "Nel PV il rettangolo è largo 6 cm e alto 7 cm: va da 2 cm a 9 cm sopra la LT.",
      "Nel PL il rettangolo è largo circa 5,2 cm, con uno spigolo nel mezzo.",
      "Nel PV vedi tre facce, nel PL due.",
    ],
    proiettoreProva: { solido: "esagonale", misure: { r: 3, alt: 7 }, alfa: 90, beta: 0, etichetta: "Lato di base 3 cm · altezza 7 cm" } },
  { numero: 8, slug: "piramide-quadrata", pronta: true, titolo: "Piramide quadrata con la base parallela al PO",
    descrizione: "Un solido staccato dai tre piani: dove cade il vertice?",
    intro: "Prima ruota la piramide nel proiettore: da sopra è un quadrato con le diagonali, di fronte e di fianco un triangolo. Poi segui la costruzione e scopri dove vanno a finire il vertice e le distanze dai piani.",
    proiettore: { solido: "piramide", misure: { lato: 6, alt: 7 }, alfa: 0, beta: 0, etichetta: "Lato di base 6 cm · altezza 7 cm" },
    provaTu: "Ripeti la tavola con una piramide a base quadrata di lato 5 cm, alta 6 cm, con il vertice sopra il centro della base. La base è parallela al PO, 1 cm più in alto, con due lati paralleli alla LT; la piramide dista 3 cm dal PV e 2 cm dal PL.",
    controlli: [
      "V″ sta a 7 cm dalla LT: 1 cm della base più 6 cm di altezza.",
      "V′ è nel punto in cui si incrociano le diagonali del quadrato.",
      "I triangoli nel PV e nel PL sono uguali: base di 5 cm e altezza di 6 cm.",
    ],
    proiettoreProva: { solido: "piramide", misure: { lato: 5, alt: 6 }, alfa: 0, beta: 0, etichetta: "Lato di base 5 cm · altezza 6 cm" } },
  { numero: 9, slug: "cilindro", pronta: true, titolo: "Cilindro con la base sul PO",
    descrizione: "Un cerchio dall’alto, due rettangoli di fronte e di fianco.",
    intro: "Il cilindro è rotondo: dall’alto è un cerchio. E di fronte? E di fianco? Ruotalo nel proiettore, poi segui la costruzione. Qui incontri un tipo di linea nuovo: l’asse, a tratto-punto.",
    proiettore: { solido: "cilindropieno", misure: { r: 3, alt: 7 }, alfa: 0, beta: 0, etichetta: "Raggio di base 3 cm · altezza 7 cm" },
    provaTu: "Ripeti la tavola con un cilindro di raggio 2,5 cm, alto 6 cm, appoggiato sul PO. Il centro della base dista 4 cm dal PV e 5 cm dal PL.",
    controlli: [
      "Nel PV e nel PL il rettangolo è largo 5 cm e alto 6 cm.",
      "Nel PL il rettangolo va da 1,5 cm a 6,5 cm dall’asse verticale.",
      "Ci sono assi a tratto-punto in tutte e tre le viste: due che si incrociano nel centro del cerchio nel PO, uno verticale nel PV e uno verticale nel PL.",
    ],
    proiettoreProva: { solido: "cilindropieno", misure: { r: 2.5, alt: 6 }, alfa: 0, beta: 0, etichetta: "Raggio di base 2,5 cm · altezza 6 cm" } },
  { numero: 10, slug: "cono", pronta: true, titolo: "Cono con la base sul PO",
    descrizione: "Un cerchio con il centro segnato, due triangoli.",
    intro: "Il cono ha una base rotonda e una punta: il vertice. Ruotalo nel proiettore e cerca il vertice in ogni vista. Poi segui la costruzione: dall’alto il vertice cade sul centro della base.",
    proiettore: { solido: "cono", misure: { r: 3.5, alt: 8 }, alfa: 0, beta: 0, etichetta: "Raggio di base 3,5 cm · altezza 8 cm" },
    provaTu: "Ripeti la tavola con un cono di raggio 3 cm, alto 7 cm, appoggiato sul PO, con il vertice sopra il centro della base. Il centro della base dista 4 cm dal PV e 5 cm dal PL.",
    controlli: [
      "V′ è il centro della circonferenza.",
      "Nel PV e nel PL il triangolo ha la base di 6 cm sulla LT e l’altezza di 7 cm.",
      "V″ e V‴ sono alla stessa altezza: 7 cm dalla LT.",
    ],
    proiettoreProva: { solido: "cono", misure: { r: 3, alt: 7 }, alfa: 0, beta: 0, etichetta: "Raggio di base 3 cm · altezza 7 cm" } },
  { numero: 11, slug: "prisma-base-pv", pronta: true, titolo: "Prisma triangolare con la base parallela al PV",
    descrizione: "Il solido si corica: adesso si parte dal PV.",
    intro: "È lo stesso prisma triangolare della tavola 6, ma coricato: le basi sono parallele al PV. Guardalo nel proiettore nella posizione di partenza e confronta le tre viste con quelle della tavola 6; poi ruotalo. La costruzione questa volta comincia dal PV.",
    proiettore: { solido: "prismatri", misure: { r: R_TRIANGOLO(6), alt: 8 }, alfa: 0, beta: -90, etichetta: "Lato di base 6 cm · lunghezza 8 cm" },
    provaTu: "Ripeti la tavola con un prisma triangolare coricato: basi a triangolo equilatero di lato 5 cm, parallele al PV; lunghezza 7 cm. È appoggiato sul PO con una faccia, comincia a 2 cm dal PV e dista 3 cm dal PL.",
    controlli: [
      "Nel PO il rettangolo è largo 5 cm e lungo 7 cm, con lo spigolo di mezzo.",
      "Nel PL il rettangolo è lungo 7 cm e alto circa 4,3 cm: è l’altezza del triangolo.",
      "Nel PL il rettangolo comincia a 2 cm dall’asse verticale e finisce a 9 cm.",
    ],
    proiettoreProva: { solido: "prismatri", misure: { r: R_TRIANGOLO(5), alt: 7 }, alfa: 0, beta: -90, etichetta: "Lato di base 5 cm · lunghezza 7 cm" } },
  { numero: 12, slug: "blocco-a-l", pronta: true, titolo: "Blocco a L",
    descrizione: "Il primo pezzo «vero»: quali spigoli si vedono e quali no.",
    intro: "Un pezzo a forma di L non si capisce da una vista sola. Guardalo nel proiettore nella posizione di partenza e osserva che cosa mostra ogni vista; poi ruotalo. Nella costruzione, nel PL c’è una linea nascosta, da disegnare tratteggiata.",
    proiettore: { solido: "elle", misure: { larg: 8, alt: 6, prof: 4, sp: 2 }, alfa: 0, beta: 0, etichetta: "Larghezza 8 cm · altezza 6 cm · profondità 4 cm · bracci spessi 2 cm" },
    provaTu: "Ripeti la tavola con un blocco a L largo 7 cm, alto 5 cm e profondo 3 cm, con i bracci spessi 2 cm e il braccio alto a sinistra. È appoggiato sul PO, a 4 cm dal PV e a 1 cm dal PL.",
    controlli: [
      "Nel PV la L è larga 7 cm e alta 5 cm.",
      "Nel PO il rettangolo misura 7 × 3 cm, con uno spigolo in vista a 2 cm dal lato sinistro.",
      "Nel PL il rettangolo misura 3 × 5 cm e comincia a 4 cm dall’asse verticale, con una linea tratteggiata a 2 cm di altezza.",
    ],
    proiettoreProva: { solido: "elle", misure: { larg: 7, alt: 5, prof: 3, sp: 2 }, alfa: 0, beta: 0, etichetta: "Larghezza 7 cm · altezza 5 cm · profondità 3 cm · bracci spessi 2 cm" } },
];

export const APPROFONDIMENTI_PO: TemaApprofondimento[] = [
  { lettera: "A", titolo: "Altre posizioni", descrizione: "Prismi con la base parallela al PL, piramidi coricate, solidi appoggiati su uno spigolo." },
  { lettera: "B", titolo: "Tronchi e solidi cavi", descrizione: "Tronco di piramide, tronco di cono, cilindro forato." },
  { lettera: "C", titolo: "Un punto su un solido", descrizione: "Seguire un punto che sta su un vertice, su uno spigolo o su una faccia." },
  { lettera: "D", titolo: "Solidi ruotati", descrizione: "La base resta sul PO ma gira di 30° o di 15° rispetto al PV." },
  { lettera: "E", titolo: "Figure e solidi inclinati", descrizione: "Quando una faccia non è parallela a nessun piano." },
  { lettera: "F", titolo: "Gruppi di solidi", descrizione: "Chi sta davanti e chi sta dietro; ricavare la vista che manca." },
  { lettera: "G", titolo: "Compenetrazioni", descrizione: "Due solidi che entrano uno nell’altro." },
  { lettera: "H", titolo: "Pezzi meccanici", descrizione: "Dal disegno in tre dimensioni di un pezzo alle sue tre viste." },
];

export const TAVOLE_PO_PRONTE = TAVOLE_PO.filter((t) => t.pronta);

export function getTavolaPO(slug: string): TavolaPO | undefined {
  return TAVOLE_PO_PRONTE.find((t) => t.slug === slug);
}

export function hrefTavolaPO(t: TavolaPO): string {
  return `/laboratori/proiezioni/${t.slug}`;
}

/** Chiave ?activity= della tavola nel motore GeoGebra. */
export function activityTavolaPO(t: TavolaPO): string {
  return `po-${t.slug}`;
}

export function costruzioneSrc(t: TavolaPO, lim = false): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/embeds/geogebra/costruzioni-base/index.html?activity=${activityTavolaPO(t)}${lim ? "&lim=1" : ""}`;
}

/** Indirizzo del proiettore: libero (senza preset) oppure aperto sul solido di una tavola. */
export function proiettoreSrc(opzioni: { preset?: PresetProiettore; titolo?: string; modo?: "embed" | "lim" | "pagina" } = {}): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const { preset, titolo, modo = "pagina" } = opzioni;
  const q = new URLSearchParams();
  if (modo === "embed") q.set("embed", "1");
  if (modo === "lim") q.set("lim", "1");
  if (preset) {
    q.set("esercizio", "1");
    q.set("solido", preset.solido);
    Object.entries(preset.misure).forEach(([chiave, valore]) => q.set(chiave, String(valore)));
    q.set("alfa", String(preset.alfa));
    q.set("beta", String(preset.beta));
    if (titolo) q.set("titolo", titolo);
    q.set("misure", preset.etichetta);
  }
  const query = q.toString();
  return `${basePath}/embeds/proiettore/index.html${query ? `?${query}` : ""}`;
}
