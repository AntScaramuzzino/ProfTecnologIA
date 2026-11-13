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
  /** solido da guardare nel proiettore (manca per punto e figure piane, che il proiettore non mostra) */
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

export const TAVOLE_PO: TavolaPO[] = [
  { numero: 1, slug: "foglio", pronta: false, titolo: "Il foglio e i tre piani",
    descrizione: "Linea di terra, asse verticale, PO, PV e PL: come si prepara il foglio." },
  { numero: 2, slug: "punto", pronta: true, titolo: "Proiezioni ortogonali di un punto",
    descrizione: "Tre distanze dai piani, tre proiezioni: A′, A″ e A‴.",
    intro: "Un punto nello spazio si riconosce da tre distanze: dal PO, dal PV e dal PL. Guarda come queste tre misure diventano tre punti sul foglio, collegati dalle linee di proiezione e da un arco di compasso. Poi ripeti la tavola sul tuo foglio.",
    provaTu: "Disegna le proiezioni del punto B, che sta a 4 cm dal PO, a 2 cm dal PV e a 6 cm dal PL.",
    controlli: [
      "B′ e B″ stanno sulla stessa linea verticale.",
      "B″ e B‴ stanno alla stessa altezza: 4 cm dalla LT.",
      "B‴ sta a 2 cm dall’asse verticale.",
    ] },
  { numero: 3, slug: "triangolo-parallelo-po", pronta: false, titolo: "Triangolo equilatero parallelo al PO",
    descrizione: "Una figura piana si vede intera su un piano e di taglio sugli altri due." },
  { numero: 4, slug: "esagono-parallelo-pv", pronta: false, titolo: "Esagono parallelo al PV",
    descrizione: "Cambia il piano di partenza: la figura intera adesso sta nel PV." },
  { numero: 5, slug: "parallelepipedo", pronta: false, titolo: "Parallelepipedo appoggiato sul PO",
    descrizione: "Il primo solido: tre rettangoli, tre coppie di misure." },
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
  { numero: 7, slug: "prisma-esagonale", pronta: false, titolo: "Prisma esagonale con la base parallela al PO",
    descrizione: "Un solido sollevato da terra: nel PV e nel PL non tocca la LT." },
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
  { numero: 9, slug: "cilindro", pronta: false, titolo: "Cilindro con la base sul PO",
    descrizione: "Un cerchio dall’alto, due rettangoli di fronte e di fianco." },
  { numero: 10, slug: "cono", pronta: false, titolo: "Cono con la base sul PO",
    descrizione: "Un cerchio con il centro segnato, due triangoli." },
  { numero: 11, slug: "prisma-base-pv", pronta: false, titolo: "Prisma triangolare con la base parallela al PV",
    descrizione: "Il solido si corica: adesso si parte dal PV." },
  { numero: 12, slug: "blocco-a-l", pronta: false, titolo: "Blocco a L",
    descrizione: "Il primo pezzo «vero»: quali spigoli si vedono e quali no." },
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
