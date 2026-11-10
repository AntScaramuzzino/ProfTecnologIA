// Ricerca globale del Book: tipi e punteggio, condivisi tra l'indice (app/indice-ricerca.json) e la palette (SiteHeader).
// L'indice è un file statico generato al build e scaricato solo quando si apre la ricerca.

export type TipoRisultato =
  | "mc"
  | "laboratorio"
  | "escape"
  | "esplorazione"
  | "scena"
  | "geogebra"
  | "glossario"
  | "pagina";

export interface VoceIndice {
  tipo: TipoRisultato;
  titolo: string;
  /** Riga sotto il titolo: MC collegata, classe, esplorazione di appartenenza… */
  sotto: string;
  /** Testo in cui cercare oltre al titolo (descrizioni, tag, parti, termini CLIL…) */
  testo: string;
  /** Percorso interno senza basePath. Se `statico`, è un file in public/ (embed) e si apre con navigazione piena. */
  href: string;
  statico?: boolean;
  area?: string;
}

export const TIPI: { id: TipoRisultato | "tutto"; label: string; emoji: string }[] = [
  { id: "tutto", label: "Tutto", emoji: "" },
  { id: "mc", label: "Lezioni", emoji: "📚" },
  { id: "laboratorio", label: "Laboratori", emoji: "🔬" },
  { id: "escape", label: "Escape room", emoji: "🔐" },
  { id: "esplorazione", label: "Esplorazioni", emoji: "🔭" },
  { id: "glossario", label: "Glossario", emoji: "📖" },
  { id: "pagina", label: "Pagine", emoji: "🧭" },
];

export const EMOJI_TIPO: Record<TipoRisultato, string> = {
  mc: "📚",
  laboratorio: "🔬",
  escape: "🔐",
  esplorazione: "🔭",
  scena: "🔭",
  geogebra: "📐",
  glossario: "📖",
  pagina: "🧭",
};

export const ETICHETTA_TIPO: Record<TipoRisultato, string> = {
  mc: "Lezione",
  laboratorio: "Laboratorio",
  escape: "Escape room",
  esplorazione: "Esplorazione",
  scena: "Scena",
  geogebra: "GeoGebra",
  glossario: "Glossario",
  pagina: "Pagina",
};

/** Filtro a chip → tipi inclusi (le scene stanno con le esplorazioni, GeoGebra con i laboratori) */
export function tipoNelFiltro(tipo: TipoRisultato, filtro: TipoRisultato | "tutto"): boolean {
  if (filtro === "tutto") return true;
  if (filtro === "esplorazione") return tipo === "esplorazione" || tipo === "scena";
  if (filtro === "laboratorio") return tipo === "laboratorio" || tipo === "geogebra";
  return tipo === filtro;
}

/** Minuscole senza accenti: «proprietà» trova «proprieta» e viceversa */
export function normalizza(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export interface VocePronta extends VoceIndice {
  nTitolo: string;
  nTesto: string;
}

export function preparaIndice(voci: VoceIndice[]): VocePronta[] {
  return voci.map((v) => ({ ...v, nTitolo: normalizza(v.titolo), nTesto: normalizza(`${v.sotto} ${v.testo}`) }));
}

const PESO_TIPO: Record<TipoRisultato, number> = {
  mc: 8, laboratorio: 6, esplorazione: 6, escape: 4, geogebra: 4, pagina: 4, scena: 2, glossario: 0,
};

/** La parola compare all'inizio di una parola del testo (non a metà) */
function iniziaParola(testo: string, token: string): boolean {
  const esc = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${esc}`).test(testo);
}

/** Punteggio: tutte le parole della ricerca devono comparire nel titolo o nel testo; 0 = nessun risultato */
export function punteggio(voce: VocePronta, query: string): number {
  const q = normalizza(query.trim());
  if (!q) return 0;
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;
  for (const t of tokens) {
    const inTitolo = voce.nTitolo.includes(t);
    const inTesto = voce.nTesto.includes(t);
    if (!inTitolo && !inTesto) return 0;
    // Inizio di parola conta molto più di un pezzo dentro una parola («leva» non deve premiare «telerilevamento»)
    if (inTitolo && iniziaParola(voce.nTitolo, t)) score += 30;
    else if (iniziaParola(voce.nTesto, t)) score += 8;
    else if (inTitolo) score += 6;
    else score += 2;
  }
  if (voce.nTitolo === q) score += 100;
  else if (voce.nTitolo.startsWith(q)) score += 50;
  return score + PESO_TIPO[voce.tipo];
}

/** Brano del testo attorno alla prima parola trovata, per i risultati che non combaciano nel titolo */
export function estratto(voce: VocePronta, query: string, larghezza = 90): string | null {
  const tokens = normalizza(query.trim()).split(/\s+/).filter(Boolean);
  if (tokens.every((t) => voce.nTitolo.includes(t))) return null;
  const t = tokens.find((tok) => !voce.nTitolo.includes(tok)) ?? tokens[0];
  const originale = voce.testo;
  const norm = normalizza(originale);
  const i = norm.indexOf(t);
  if (i < 0) return null;
  // mappa l'indice normalizzato sull'originale contando i caratteri base
  let base = 0;
  let pos = 0;
  for (; pos < originale.length && base < i; pos++) {
    base += normalizza(originale[pos]).length;
  }
  let inizio = Math.max(0, pos - Math.floor(larghezza / 3));
  if (inizio > 0) {
    const spazio = originale.indexOf(" ", inizio);
    if (spazio >= 0 && spazio < pos) inizio = spazio + 1;
  }
  let fine = Math.min(originale.length, inizio + larghezza);
  if (fine < originale.length) {
    const spazio = originale.lastIndexOf(" ", fine);
    if (spazio > pos) fine = spazio;
  }
  return `${inizio > 0 ? "…" : ""}${originale.slice(inizio, fine).trim()}${fine < originale.length ? "…" : ""}`;
}
