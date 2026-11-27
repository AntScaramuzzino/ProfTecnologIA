// Registro delle tavole dell'Atlante «Com'è fatto» (piano: Brain Tecnologia/atlante-com-e-fatto/2026-11-27_piano-editoriale-atlante.md)
// Ogni tavola è una pagina HTML autonoma (skill anatomy) servita come file statico da public/embeds/atlante/<slug>/:
// - <slug>.html: la tavola interattiva, offline (JS e CSS inline, solo Google Fonts)
// - <slug>-poster-a4.pdf, -drawing-a4.pdf, -detailed-a4.pdf, -muta-poster-a4.pdf: le stampe A4
// - poster.webp (A4 verticale, 636×900) e copertina.webp (960×540, la figura ritagliata dal poster)
// La cartella e i nomi dei file non vanno cambiati: la tavola della batteria punta a ../atl-ene-3-06b/ e ai PDF accanto.
// La riga fa comparire la tavola nell'indice /atlante/, nella pagina /atlante/<slug>/, nella scheda OSSERVA della MC
// collegata e nella pagina Laboratori.

export interface TavolaAtlante {
  slug: string;
  codice: string;
  mcId: string;
  titolo: string;
  sottotitolo: string;
  descrizione: string;
  classe: number;
  area: string;
  /** Che cosa si fa nella tavola, in una riga */
  interazione: string;
}

export const ATLANTE: TavolaAtlante[] = [
  {
    slug: "atl-dis-1-02",
    codice: "ATL-DIS-1-02",
    mcId: "MC-DIS-1-02",
    titolo: "Il calibro a corsoio",
    sottotitolo: "Misurare al decimo di millimetro, con dieci tacche in nove millimetri",
    descrizione:
      "La scala fissa dà i millimetri interi, il nonio i decimi. Si trascina il cursore su tre pezzi diversi e si legge la misura con la lente.",
    classe: 1,
    area: "DIS",
    interazione: "Cursore da trascinare, lente sul nonio, disegno quotato ed esercizio di lettura.",
  },
  {
    slug: "atl-mat-1-04",
    codice: "ATL-MAT-1-04",
    mcId: "MC-MAT-1-04",
    titolo: "L'impianto di selezione della differenziata",
    sottotitolo: "Dove va la bottiglia dopo il bidone giallo: sei stazioni, sei uscite",
    descrizione:
      "Sei stazioni in fila, ognuna riconosce un materiale da una sua proprietà: grandezza, magnetismo, luce assorbita, conducibilità. La plastica nera sfugge al lettore ottico e finisce nello scarto.",
    classe: 1,
    area: "MAT",
    interazione: "Stazioni da spegnere, nastro lento o veloce, un oggetto da buttare e seguire fino al suo cassone.",
  },
  {
    slug: "atl-ene-3-06",
    codice: "ATL-ENE-3-06",
    mcId: "MC-ENE-3-06",
    titolo: "La batteria agli ioni di litio",
    sottotitolo: "Due elettrodi, un foglio poroso e un viaggio di ioni avanti e indietro",
    descrizione:
      "Una cella sezionata sul banco prova: in carica gli ioni passano dal catodo all'anodo, in scarica tornano indietro, mentre gli elettroni girano nei cavi.",
    classe: 3,
    area: "ENE",
    interazione: "Carica e scarica, corrente 0,5C–2C, cella nuova, usata o vecchia.",
  },
  {
    slug: "atl-ene-3-06b",
    codice: "ATL-ENE-3-06b",
    mcId: "MC-ENE-3-06",
    titolo: "Il modulo: sei celle in serie",
    sottotitolo: "Le tensioni si sommano, ma la cella più debole decide per tutte",
    descrizione:
      "Sei celle collegate in serie con il loro BMS: le tensioni si sommano, e basta una cella invecchiata per fermare tutto il modulo prima del tempo.",
    classe: 3,
    area: "ENE",
    interazione: "Carica e scarica, celle da invecchiare, bilanciamento acceso o spento.",
  },
];

export const STAMPE_ATLANTE = [
  { suffisso: "poster-a4", nome: "Poster", testo: "la figura con i nomi delle parti, da appendere in classe" },
  { suffisso: "muta-poster-a4", nome: "Tavola muta", testo: "solo i numeri: i nomi delle parti si scrivono a mano" },
  { suffisso: "drawing-a4", nome: "Tavola tecnica", testo: "elenco delle parti, dati tecnici e dettagli, con cartiglio" },
  { suffisso: "detailed-a4", nome: "Come funziona", testo: "il poster e i passaggi illustrati, su due pagine" },
] as const;

function cartella(slug: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/embeds/atlante/${slug}`;
}

export function atlanteSrc(slug: string): string {
  return `${cartella(slug)}/${slug}.html`;
}

export function atlantePoster(slug: string): string {
  return `${cartella(slug)}/poster.webp`;
}

export function atlanteCopertina(slug: string): string {
  return `${cartella(slug)}/copertina.webp`;
}

export function atlantePdf(slug: string, suffisso: string): string {
  return `${cartella(slug)}/${slug}-${suffisso}.pdf`;
}

/** Pagina del libro della tavola (rotta /atlante/<slug>/) */
export function hrefTavolaAtlante(slug: string): string {
  return `/atlante/${slug}`;
}

export function getTavolaAtlante(slug: string): TavolaAtlante | undefined {
  return ATLANTE.find((t) => t.slug === slug);
}

/** Tavole collegate a una MC (la batteria ne ha due: la cella e il modulo) */
export function getTavoleAtlante(mcId: string): TavolaAtlante[] {
  return ATLANTE.filter((t) => t.mcId === mcId);
}
