// Registro delle tavole di assonometria (MC-DIS-2-02: cavaliera e isometrica; MC-DIS-3-01: monometrica).
// Ogni tavola unisce due strumenti, come le proiezioni ortogonali:
//  - l'Assonometro (public/embeds/assonometro/): il solido disegnato in assonometria, con gli assi, le misure e le tre viste;
//  - la costruzione GeoGebra passo per passo (public/embeds/geogebra/costruzioni-base/tavole-ass.js).
// Per aggiungere una tavola: definiscila in tavole-ass.js con la chiave `ass-<slug>`, salva l'anteprima in
// public/assets/assonometrie/<slug>.webp, poi qui metti `pronta: true` e compila intro, provaTu e assonometro.

export const MC_ASSONOMETRIE = "MC-DIS-2-02";
export const MC_MONOMETRICA = "MC-DIS-3-01";

export type TipoAssonometria = "cavaliera" | "monometrica" | "planometrica" | "militare" | "isometrica" | "dimetrica" | "trimetrica";

export const NOME_TIPO: Record<TipoAssonometria, string> = {
  cavaliera: "Cavaliera",
  monometrica: "Monometrica",
  planometrica: "Monometrica a 45°",
  militare: "Militare",
  isometrica: "Isometrica",
  dimetrica: "Dimetrica",
  trimetrica: "Trimetrica",
};

/** Apertura dell'Assonometro sul solido della tavola: stessi solidi e stesse chiavi del proiettore ortogonale, misure in cm. */
export interface PresetAssonometro {
  tipo: TipoAssonometria;
  /** id del solido: parallelepipedo, cubo, elle, prismatri, esagonale, piramide, cilindropieno, cono… */
  solido: string;
  /** chiavi del proiettore (L, H, P, lato, r, alt, larg, prof); per il blocco a L anche `sp`, lo spessore dei bracci */
  misure: Record<string, number>;
  /** rotazione di partenza in gradi attorno all'asse verticale (0 se manca) */
  alfa?: number;
  /** testo delle misure mostrato nello strumento */
  etichetta: string;
}

export interface TavolaAss {
  /** posizione nel percorso */
  numero: number;
  /** pagina /laboratori/assonometrie/<slug>; la chiave del motore GeoGebra è `ass-<slug>` */
  slug: string;
  tipo: TipoAssonometria;
  /** micro-competenza a cui la tavola è collegata */
  mc: typeof MC_ASSONOMETRIE | typeof MC_MONOMETRICA;
  titolo: string;
  /** una riga per l'elenco */
  descrizione: string;
  /** false = prevista dal percorso ma non ancora costruita */
  pronta: boolean;
  /** due o tre frasi per l'apertura della pagina */
  intro?: string;
  /** solido da guardare nell'Assonometro */
  assonometro?: PresetAssonometro;
  /** consegna «Prova tu», con misure diverse da quelle della tavola */
  provaTu?: string;
  /** controlli che l'alunno può fare da solo sul suo foglio */
  controlli?: string[];
  /** lo stesso solido della prova, da aprire nell'Assonometro per confrontare il disegno */
  assonometroProva?: PresetAssonometro;
}

export const TAVOLE_ASS: TavolaAss[] = [
  { numero: 1, slug: "parallelepipedo-cavaliera", tipo: "cavaliera", mc: MC_ASSONOMETRIE, pronta: true,
    titolo: "Parallelepipedo in assonometria cavaliera",
    descrizione: "La faccia di fronte resta vera, la profondità va a 45° e si dimezza.",
    intro: "È il parallelepipedo della tavola 5 delle proiezioni ortogonali: ora lo disegni tutto insieme, con tre facce in vista. Guardalo nell’assonometro: osserva i tre assi e come cambia la misura della profondità. Poi segui la costruzione.",
    assonometro: { tipo: "cavaliera", solido: "parallelepipedo", misure: { L: 6, H: 8, P: 4 }, etichetta: "Base 6 × 4 cm · altezza 8 cm" },
    provaTu: "Disegna in assonometria cavaliera un parallelepipedo con la base di 7 × 3 cm, alto 5 cm. La larghezza è 7 cm, la profondità 3 cm.",
    controlli: [
      "La faccia di fronte è un rettangolo di 7 × 5 cm, con quattro angoli retti.",
      "Gli spigoli in profondità sono lunghi 1,5 cm e inclinati di 45°.",
      "Dal punto più a sinistra al punto più a destra il disegno è largo circa 8,1 cm.",
    ],
    assonometroProva: { tipo: "cavaliera", solido: "parallelepipedo", misure: { L: 7, H: 5, P: 3 }, etichetta: "Base 7 × 3 cm · altezza 5 cm" } },
  { numero: 2, slug: "prisma-triangolare-cavaliera", tipo: "cavaliera", mc: MC_ASSONOMETRIE, pronta: false,
    titolo: "Prisma triangolare in assonometria cavaliera",
    descrizione: "Una base che non è un rettangolo: i vertici si trovano uno alla volta, con le loro misure." },
  { numero: 3, slug: "blocco-a-l-cavaliera", tipo: "cavaliera", mc: MC_ASSONOMETRIE, pronta: true,
    titolo: "Blocco a L in assonometria cavaliera",
    descrizione: "Il metodo della scatola: prima il parallelepipedo che contiene il pezzo, poi il pezzo.",
    intro: "È il blocco a L della tavola 12 delle proiezioni ortogonali. Un pezzo così non si disegna in una volta sola: prima si disegna la scatola che lo contiene, poi dentro la scatola si trova il blocco. Guardalo nell’assonometro con la scatola accesa, poi segui la costruzione.",
    assonometro: { tipo: "cavaliera", solido: "elle", misure: { larg: 8, alt: 6, prof: 4, sp: 2 }, etichetta: "Larghezza 8 cm · profondità 4 cm · altezza 6 cm · bracci spessi 2 cm" },
    provaTu: "Disegna in assonometria cavaliera un blocco a L largo 7 cm, profondo 3 cm e alto 5 cm, con i bracci spessi 2 cm e il braccio alto a sinistra. Parti dalla scatola.",
    controlli: [
      "Di fronte la L è larga 7 cm e alta 5 cm, come nel prospetto.",
      "Tutti gli spigoli in profondità sono lunghi 1,5 cm e inclinati di 45°.",
      "Il piano di sopra del braccio basso è lungo 5 cm, perché 7 − 2 = 5. La parete del gradino è alta 3 cm, perché 5 − 2 = 3.",
    ],
    assonometroProva: { tipo: "cavaliera", solido: "elle", misure: { larg: 7, alt: 5, prof: 3, sp: 2 }, etichetta: "Larghezza 7 cm · profondità 3 cm · altezza 5 cm · bracci spessi 2 cm" } },
  { numero: 4, slug: "parallelepipedo-isometrica", tipo: "isometrica", mc: MC_ASSONOMETRIE, pronta: true,
    titolo: "Parallelepipedo in assonometria isometrica",
    descrizione: "Due assi a 30° e tutte le misure vere: nessuna faccia resta un rettangolo.",
    intro: "Lo stesso parallelepipedo della tavola 1, con altre regole: gli assi x e y salgono di 30° e nessuna misura si riduce. Nell’assonometro passa da «Cavaliera» a «Isometrica» e guarda che cosa cambia. Poi segui la costruzione.",
    assonometro: { tipo: "isometrica", solido: "parallelepipedo", misure: { L: 6, H: 8, P: 4 }, etichetta: "Base 6 × 4 cm · altezza 8 cm" },
    provaTu: "Disegna in assonometria isometrica un parallelepipedo con la base di 7 × 3 cm, alto 5 cm. La larghezza è 7 cm, la profondità 3 cm.",
    controlli: [
      "Gli spigoli lungo x misurano 7 cm, quelli lungo y 3 cm, quelli verticali 5 cm: nessuna misura è ridotta.",
      "Dal punto più basso al punto più alto il disegno è alto 10 cm.",
      "Dal punto più a sinistra al punto più a destra il disegno è largo circa 8,7 cm.",
    ],
    assonometroProva: { tipo: "isometrica", solido: "parallelepipedo", misure: { L: 7, H: 5, P: 3 }, etichetta: "Base 7 × 3 cm · altezza 5 cm" } },
  { numero: 5, slug: "prisma-esagonale-isometrica", tipo: "isometrica", mc: MC_ASSONOMETRIE, pronta: false,
    titolo: "Prisma esagonale in assonometria isometrica",
    descrizione: "La base si costruisce dentro il suo rettangolo, poi si alzano gli spigoli." },
  { numero: 6, slug: "piramide-isometrica", tipo: "isometrica", mc: MC_ASSONOMETRIE, pronta: false,
    titolo: "Piramide in assonometria isometrica",
    descrizione: "Il vertice si trova salendo dal centro della base." },
  { numero: 7, slug: "solido-composto-isometrica", tipo: "isometrica", mc: MC_ASSONOMETRIE, pronta: false,
    titolo: "Solido composto in assonometria isometrica",
    descrizione: "Il metodo della scatola in isometrica, con misure scelte perché gli spigoli non cadano uno sull’altro." },
  { numero: 8, slug: "cerchio-isometrica", tipo: "isometrica", mc: MC_ASSONOMETRIE, pronta: false,
    titolo: "Il cerchio in assonometria",
    descrizione: "Un cerchio diventa un’ellisse: si disegna dentro il quadrato che lo contiene." },
  { numero: 9, slug: "cilindro-isometrica", tipo: "isometrica", mc: MC_ASSONOMETRIE, pronta: false,
    titolo: "Cilindro in assonometria isometrica",
    descrizione: "Due ellissi e due spigoli di contorno." },
  { numero: 10, slug: "parallelepipedo-monometrica", tipo: "monometrica", mc: MC_MONOMETRICA, pronta: true,
    titolo: "Parallelepipedo in assonometria monometrica",
    descrizione: "Assi a 30° e a 60°: la base resta un rettangolo vero, come nella pianta.",
    intro: "Ancora lo stesso parallelepipedo, nella terza assonometria. Qui gli assi x e y formano un angolo retto: la base si disegna con la sua vera forma, come nel PO. Nell’assonometro confronta «Isometrica» e «Monometrica». Poi segui la costruzione.",
    assonometro: { tipo: "monometrica", solido: "parallelepipedo", misure: { L: 6, H: 8, P: 4 }, etichetta: "Base 6 × 4 cm · altezza 8 cm" },
    provaTu: "Disegna in assonometria monometrica un parallelepipedo con la base di 7 × 3 cm, alto 5 cm. La larghezza è 7 cm, la profondità 3 cm.",
    controlli: [
      "La base è un rettangolo vero di 7 × 3 cm: controlla i quattro angoli retti con la squadra.",
      "La diagonale della base, da O al vertice opposto, misura circa 7,6 cm.",
      "Gli spigoli verticali misurano tutti 5 cm.",
    ],
    assonometroProva: { tipo: "monometrica", solido: "parallelepipedo", misure: { L: 7, H: 5, P: 3 }, etichetta: "Base 7 × 3 cm · altezza 5 cm" } },
  { numero: 11, slug: "stanza-monometrica", tipo: "monometrica", mc: MC_MONOMETRICA, pronta: false,
    titolo: "Una stanza in assonometria monometrica",
    descrizione: "Dalla pianta di una stanza al suo volume, con i muri e un mobile." },
  { numero: 12, slug: "parallelepipedo-militare", tipo: "militare", mc: MC_MONOMETRICA, pronta: true,
    titolo: "Parallelepipedo in assonometria militare",
    descrizione: "Assi a 45° e a 45°: la base resta vera, l’altezza si dimezza.",
    intro: "L’ultima delle assonometrie oblique dei libri. Come nella monometrica la base resta un rettangolo vero, ma girato di 45°, e l’altezza si disegna a metà. Nell’assonometro confronta «Monometrica 45°» e «Militare»: cambia solo l’altezza. Poi segui la costruzione.",
    assonometro: { tipo: "militare", solido: "parallelepipedo", misure: { L: 6, H: 8, P: 4 }, etichetta: "Base 6 × 4 cm · altezza 8 cm" },
    provaTu: "Disegna in assonometria militare un parallelepipedo con la base di 7 × 3 cm, alto 5 cm. La larghezza è 7 cm, la profondità 3 cm.",
    controlli: [
      "La base è un rettangolo vero di 7 × 3 cm: controlla i quattro angoli retti con la squadra.",
      "Gli spigoli verticali misurano tutti 2,5 cm, la metà di 5 cm.",
      "Dal punto più basso al punto più alto il disegno è alto circa 9,6 cm.",
    ],
    assonometroProva: { tipo: "militare", solido: "parallelepipedo", misure: { L: 7, H: 5, P: 3 }, etichetta: "Base 7 × 3 cm · altezza 5 cm" } },
];

export const TAVOLE_ASS_PRONTE = TAVOLE_ASS.filter((t) => t.pronta);

export function getTavolaAss(slug: string): TavolaAss | undefined {
  return TAVOLE_ASS_PRONTE.find((t) => t.slug === slug);
}

export function hrefTavolaAss(t: TavolaAss): string {
  return `/laboratori/assonometrie/${t.slug}`;
}

/** Chiave ?activity= della tavola nel motore GeoGebra. */
export function activityTavolaAss(t: TavolaAss): string {
  return `ass-${t.slug}`;
}

export function costruzioneAssSrc(t: TavolaAss, lim = false): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/embeds/geogebra/costruzioni-base/index.html?activity=${activityTavolaAss(t)}${lim ? "&lim=1" : ""}`;
}

/** Indirizzo dell'Assonometro: libero (senza preset) oppure aperto sul solido di una tavola. */
export function assonometroSrc(opzioni: { preset?: PresetAssonometro; titolo?: string; modo?: "embed" | "lim" | "pagina" } = {}): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const { preset, titolo, modo = "pagina" } = opzioni;
  const q = new URLSearchParams();
  if (modo === "embed") q.set("embed", "1");
  if (modo === "lim") q.set("lim", "1");
  if (preset) {
    q.set("esercizio", "1");
    q.set("tipo", preset.tipo);
    q.set("solido", preset.solido);
    Object.entries(preset.misure).forEach(([chiave, valore]) => q.set(chiave, String(valore)));
    if (preset.alfa) q.set("alfa", String(preset.alfa));
    if (titolo) q.set("titolo", titolo);
    q.set("misure", preset.etichetta);
  }
  const query = q.toString();
  return `${basePath}/embeds/assonometro/index.html${query ? `?${query}` : ""}`;
}
