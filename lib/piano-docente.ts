// Classi del docente (fino a nove), ciascuna con le sue modifiche alla proposta della «Lezione della settimana».
// Modulo puro, usato dai componenti client (home e pagina /docenti).
// Il piano si salva nel browser (localStorage): resta su quel dispositivo e si può esportare in un file.

export interface VoceSettimana {
  mc?: string;
  mcTitolo?: string;
  /** Codice area (MAT, ALI…) per l'icona. */
  area?: string;
  /** «Teoria», «Disegno» o «Coding». */
  tipo: string;
  titolo: string;
  cosa: string;
  link?: { href: string; label: string }[];
  /** Immagine della lezione (quando non ci sono anteprime di tavole). */
  immagine?: string;
  /** Anteprime delle tavole della settimana. */
  tavole?: { src: string; href: string }[];
  /** Nota del docente (solo nel piano personale). */
  nota?: string;
}

export type Binario = "teoria" | "pratica";
export const BINARI: Binario[] = ["teoria", "pratica"];
export const NOME_BINARIO: Record<Binario, string> = { teoria: "Teoria", pratica: "Disegno o coding" };

/** La proposta del libro: per ogni classe e binario, una voce per settimana di lezione. */
export type PianoSettimane = Record<number, Record<Binario, VoceSettimana[]>>;

/** Una settimana del piano personale. */
export interface Slot {
  /** Indice della voce della proposta; null = settimana libera (recupero, verifica, uscita…). */
  base: number | null;
  /** Titolo scritto dal docente per una settimana libera. */
  titolo?: string;
  nota?: string;
  fatto?: boolean;
}

/** Una classe del docente (per esempio «1A»): segue la proposta del suo anno, con le sue modifiche. */
export interface ClasseDocente {
  id: string;
  /** Nome scelto dal docente: «1A», «2 C»… */
  nome: string;
  /** Anno di corso: 1, 2 o 3. */
  anno: number;
  /** Presenti solo se diversi dalla proposta. */
  teoria?: Slot[];
  pratica?: Slot[];
}

/** Un docente di Tecnologia ha due ore per classe: al massimo nove classi. */
export const MAX_CLASSI = 9;
export const MAX_NOME_CLASSE = 12;

const CHIAVE = "tecnologia_app_classi_docente_v1";

export function slotPredefiniti(n: number): Slot[] {
  return Array.from({ length: n }, (_, i) => ({ base: i }));
}

export const MAX_TITOLO = 80;
export const MAX_NOTA = 300;

/** Controlla le settimane lette da localStorage o da un file e le riporta alla forma attesa; null se non valgono. */
function slotNormalizzati(valore: unknown, n: number): Slot[] | null {
  if (!Array.isArray(valore) || valore.length !== n) return null;
  const slots: Slot[] = [];
  for (const s of valore) {
    if (!s || typeof s !== "object") return null;
    const { base, titolo, nota, fatto } = s as Record<string, unknown>;
    if (base !== null && !(typeof base === "number" && Number.isInteger(base) && base >= 0 && base < n)) return null;
    const slot: Slot = { base: base as number | null };
    if (base === null && typeof titolo === "string" && titolo) slot.titolo = titolo.slice(0, MAX_TITOLO);
    if (typeof nota === "string" && nota) slot.nota = nota.slice(0, MAX_NOTA);
    if (fatto === true) slot.fatto = true;
    slots.push(slot);
  }
  return slots;
}

/** Tiene solo ciò che è coerente con la proposta attuale (anni esistenti, stesso numero di settimane). */
export function ripulisciClassi(valore: unknown, proposta: PianoSettimane): ClasseDocente[] {
  if (!Array.isArray(valore)) return [];
  const classi: ClasseDocente[] = [];
  for (const dati of valore) {
    if (classi.length >= MAX_CLASSI) break;
    if (!dati || typeof dati !== "object") continue;
    const { id, nome, anno } = dati as Record<string, unknown>;
    if (typeof id !== "string" || typeof nome !== "string" || typeof anno !== "number" || !proposta[anno]) continue;
    if (classi.some((c) => c.id === id)) continue;
    const classe: ClasseDocente = { id, nome: nome.trim().slice(0, MAX_NOME_CLASSE) || `${anno}ª`, anno };
    for (const b of BINARI) {
      const slots = slotNormalizzati((dati as Record<string, unknown>)[b], proposta[anno][b].length);
      if (slots && personalizzato(slots)) classe[b] = slots;
    }
    classi.push(classe);
  }
  return classi;
}

export function leggiClassi(proposta: PianoSettimane): ClasseDocente[] {
  try {
    return ripulisciClassi(JSON.parse(localStorage.getItem(CHIAVE) ?? "null"), proposta);
  } catch {
    return []; // localStorage non disponibile o dati rovinati
  }
}

export function salvaClassi(classi: ClasseDocente[]): boolean {
  try {
    if (classi.length === 0) localStorage.removeItem(CHIAVE);
    else localStorage.setItem(CHIAVE, JSON.stringify(classi));
    return true;
  } catch {
    return false;
  }
}

export function nuovoId(): string {
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Le settimane di un binario: quelle della classe se le ha modificate, altrimenti la proposta dell'anno. */
export function slotDi(classe: ClasseDocente | undefined, proposta: PianoSettimane, anno: number, binario: Binario): Slot[] {
  return classe?.[binario] ?? slotPredefiniti(proposta[anno][binario].length);
}

/** true se il binario è diverso dalla proposta (ordine, settimane libere, note o lezioni segnate come fatte). */
export function personalizzato(slots: Slot[]): boolean {
  return slots.some((s, i) => s.base !== i || !!s.nota || !!s.fatto || !!s.titolo);
}

/** La voce da mostrare per una settimana del piano personale. */
export function risolvi(proposta: PianoSettimane, anno: number, binario: Binario, slot: Slot): VoceSettimana {
  if (slot.base !== null) {
    const voce = proposta[anno][binario][slot.base];
    return slot.nota ? { ...voce, nota: slot.nota } : voce;
  }
  return {
    tipo: NOME_BINARIO[binario],
    titolo: slot.titolo?.trim() || "Settimana libera",
    cosa: "Nessuna lezione del libro in programma: recupero, verifica o un’altra attività.",
    nota: slot.nota,
  };
}

/** true se la settimana porta qualcosa scritto dal docente (nota, titolo o «fatta») che andrebbe perso scartandola. */
export function haAppunti(slot: Slot): boolean {
  return !!slot.nota || !!slot.titolo || !!slot.fatto;
}

/**
 * Rimanda di una settimana la lezione i e tutte le successive: la settimana i diventa libera.
 * L'ultima settimana esce dal calendario: chi chiama controlla prima che non abbia appunti (haAppunti).
 */
export function rimanda(slots: Slot[], i: number): Slot[] {
  return [...slots.slice(0, i), { base: null }, ...slots.slice(i, -1)];
}

/** Toglie la settimana i e anticipa di una settimana tutte le successive: l'ultima resta libera. */
export function anticipa(slots: Slot[], i: number): Slot[] {
  return [...slots.slice(0, i), ...slots.slice(i + 1), { base: null }];
}

/** Indici delle voci della proposta che nel piano personale non compaiono più. */
export function fuoriCalendario(slots: Slot[]): number[] {
  const presenti = new Set(slots.map((s) => s.base));
  return slots.map((_, i) => i).filter((i) => !presenti.has(i));
}
