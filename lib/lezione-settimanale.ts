// Piano della «Lezione della settimana» (home del libro).
// Per ogni classe due binari paralleli, uno per ciascuna delle due ore settimanali di Tecnologia:
//   - teoria          → le MC delle aree tematiche;
//   - disegno/coding  → le MC di Disegno Tecnico, poi Coding e Informatica.
// Ogni binario è un elenco di blocchi; ogni blocco occupa una o più settimane di lezione.
// La somma delle settimane deve dare SETTIMANE_DI_LEZIONE (lib/calendario-scolastico.ts): oggi 35.
// Per cambiare il ritmo basta spostare o ridimensionare i blocchi qui sotto.
//
// Questo file si importa solo lato server (app/page.tsx): al client arriva il piano già espanso.

import { SETTIMANE_DI_LEZIONE } from "./calendario-scolastico";
import { CATEGORIE_COSTRUZIONI, COSTRUZIONI_GEOGEBRA, hrefCostruzione, type CategoriaCostruzione } from "./geogebra-costruzioni";
import { TAVOLE_PO_PRONTE, hrefTavolaPO } from "./geogebra-proiezioni";

export interface LinkLezione {
  href: string;
  label: string;
}

/** La proposta di una settimana su un binario. */
export interface VoceLezione {
  /** MC di riferimento; assente nelle settimane di avvio, ripasso e chiusura. */
  mc?: string;
  /** Che cosa si fa: titolo breve. */
  titolo: string;
  /** Che cosa si fa: una o due frasi. */
  cosa: string;
  /** Tavole, laboratori e pagine da aprire. */
  link?: LinkLezione[];
}

export interface PianoClasse {
  teoria: VoceLezione[];
  pratica: VoceLezione[];
}

// ── Fasi standard di una MC, distribuite su n settimane ──────────────────────────────────────────
const FASE = {
  avvio: { titolo: "Innesca ed Esplora", cosa: "Si parte dalla domanda di «Innesca», poi il nucleo di «Esplora» con le immagini e l’«In breve»." },
  osserva: { titolo: "Osserva", cosa: "Il caso di «Osserva» e gli approfondimenti di «Esplora» che servono alla classe." },
  osservaSperimenta: { titolo: "Osserva e Sperimenta", cosa: "Il caso di «Osserva», poi l’attività di «Sperimenta» al livello adatto (base, intermedio o avanzato)." },
  sperimenta: { titolo: "Sperimenta", cosa: "L’attività di «Sperimenta» al livello adatto: base, intermedio o avanzato." },
  base: { titolo: "Sperimenta · livello base", cosa: "L’attività guidata di «Sperimenta», passo per passo." },
  intermedio: { titolo: "Sperimenta · livello intermedio", cosa: "L’attività di livello intermedio di «Sperimenta», con meno guida." },
  avanzato: { titolo: "Sperimenta · livello avanzato", cosa: "La sfida di livello avanzato di «Sperimenta»: si progetta in autonomia." },
  agisci: { titolo: "Agisci e verifica", cosa: "Il compito di realtà di «Agisci» con la rubrica letta prima; quiz e flashcard per il ripasso." },
  tutto: { titolo: "Nucleo e attività", cosa: "«Innesca», il nucleo di «Esplora» e un’attività di «Sperimenta»; il compito di «Agisci» si assegna per casa." },
  avvioSperimenta: { titolo: "Innesca, Esplora e Osserva", cosa: "La domanda di «Innesca», il nucleo di «Esplora» e il caso di «Osserva»." },
  sperimentaAgisci: { titolo: "Sperimenta e Agisci", cosa: "L’attività di «Sperimenta» al livello adatto, poi il compito di realtà di «Agisci»." },
};

const SCHEMI: Record<number, (keyof typeof FASE)[]> = {
  1: ["tutto"],
  2: ["avvioSperimenta", "sperimentaAgisci"],
  3: ["avvio", "osservaSperimenta", "agisci"],
  4: ["avvio", "osserva", "sperimenta", "agisci"],
  6: ["avvio", "osserva", "base", "intermedio", "avanzato", "agisci"],
};

/** Una MC sviluppata in n settimane con le fasi standard. */
function mc(id: string, settimane: 1 | 2 | 3 | 4 | 6): VoceLezione[] {
  return SCHEMI[settimane].map((f) => ({ mc: id, ...FASE[f] }));
}

/** Una settimana (o più) descritta a mano. */
function voce(titolo: string, cosa: string, opzioni: { mc?: string; link?: LinkLezione[]; settimane?: number } = {}): VoceLezione[] {
  const { settimane = 1, ...resto } = opzioni;
  return Array.from({ length: settimane }, (_, i) => ({
    titolo: settimane > 1 ? `${titolo} (${i + 1} di ${settimane})` : titolo,
    cosa,
    ...resto,
  }));
}

// ── Disegno 1ª: le costruzioni geometriche, una categoria alla volta ─────────────────────────────
function costruzioni(categoria: CategoriaCostruzione, settimane: number): VoceLezione[] {
  const cat = CATEGORIE_COSTRUZIONI.find((c) => c.id === categoria)!;
  const tavole = COSTRUZIONI_GEOGEBRA.filter((c) => c.categoria === categoria);
  const perSettimana = Math.ceil(tavole.length / settimane);
  return Array.from({ length: settimane }, (_, i) => {
    const gruppo = tavole.slice(i * perSettimana, (i + 1) * perSettimana);
    return {
      mc: "MC-DIS-1-01",
      titolo: settimane > 1 ? `${cat.titolo} (${i + 1} di ${settimane})` : cat.titolo,
      cosa: `${cat.descrizione} Si guarda la tavola passo per passo alla LIM, poi si ridisegna sul foglio con riga e compasso.`,
      link: [
        ...gruppo.map((c) => ({ href: hrefCostruzione(c), label: `Tavola ${c.numero} · ${c.titolo}` })),
        { href: `/costruzioni-geometriche#${categoria}`, label: "Tutte le tavole della categoria" },
      ],
    };
  });
}

// ── Disegno 2ª: le tavole di proiezioni ortogonali ───────────────────────────────────────────────
function tavolePO(numeri: number[], titolo: string, cosa: string): VoceLezione[] {
  const tavole = TAVOLE_PO_PRONTE.filter((t) => numeri.includes(t.numero));
  return [{
    mc: "MC-DIS-2-01",
    titolo,
    cosa,
    link: [
      ...tavole.map((t) => ({ href: hrefTavolaPO(t), label: `Tavola ${t.numero} · ${t.titolo}` })),
      { href: "/proiezioni-ortogonali", label: "Proiettore ortogonale e tutte le tavole" },
    ],
  }];
}

const PO = "Si segue la tavola passo per passo alla LIM, si controlla il solido nel Proiettore ortogonale e si ridisegna sul foglio.";
const LINK_PO = [{ href: "/proiezioni-ortogonali", label: "Proiettore ortogonale e tavole" }];
const LINK_COSTRUZIONI = [{ href: "/costruzioni-geometriche", label: "Costruzioni geometriche" }];

// ── Classe 1ª ────────────────────────────────────────────────────────────────────────────────────
const CLASSE_1: PianoClasse = {
  teoria: [
    ...voce("Si comincia: che cos’è la Tecnologia", "Come è fatto il libro, come si usano le sei zone di una lezione, i quiz e l’AI Coach.", { link: [{ href: "/anno/1", label: "Il percorso della classe 1ª" }] }),
    ...mc("MC-MAT-1-01", 3), ...mc("MC-MAT-1-02", 3), ...mc("MC-MAT-1-03", 3),
    ...mc("MC-MAT-1-04", 3), ...mc("MC-MAT-1-05", 3), ...mc("MC-MAT-1-06", 3),
    ...mc("MC-DIG-1-01", 4), ...mc("MC-DIG-1-02", 4), ...mc("MC-INF-1-01", 4),
    ...voce("Compiti di realtà e ripasso", "Si completano e si presentano i compiti di realtà dell’anno; ripasso con quiz, flashcard e sketchnote.", { settimane: 4, link: [{ href: "/anno/1", label: "Tutte le lezioni della classe 1ª" }] }),
  ],
  pratica: [
    ...voce("Gli strumenti del disegno", "Matite, righe, squadre e compasso: come si tengono e come si usano sul foglio.", { mc: "MC-DIS-1-01", link: LINK_COSTRUZIONI }),
    ...costruzioni("perp", 2), ...costruzioni("segm", 2), ...costruzioni("lato", 2), ...costruzioni("insc", 3),
    ...costruzioni("tria", 2), ...costruzioni("circ", 2), ...costruzioni("racc", 1), ...costruzioni("arch", 1),
    ...costruzioni("curv", 2), ...costruzioni("coni", 1), ...costruzioni("moti", 3),
    ...mc("MC-DIS-1-02", 4),
    ...mc("MC-DIG-1-03", 4),
    ...mc("MC-INF-1-02", 3),
    ...voce("Tavola libera con l’Officina dei motivi", "Ognuno sceglie un motivo modulare, lo regola nell’Officina e lo ridisegna in bella copia: è la tavola di fine anno.", { mc: "MC-DIS-1-01", settimane: 2, link: [{ href: "/costruzioni-geometriche#moti", label: "Motivi modulari" }, { href: "/laboratori", label: "Laboratori" }] }),
  ],
};

// ── Classe 2ª ────────────────────────────────────────────────────────────────────────────────────
const CLASSE_2: PianoClasse = {
  teoria: [
    ...voce("Si riparte: il percorso della seconda", "Che cosa si studia quest’anno e ripasso veloce dei materiali della prima.", { link: [{ href: "/anno/2", label: "Il percorso della classe 2ª" }] }),
    ...mc("MC-ALI-2-01", 2), ...mc("MC-ALI-2-02", 2), ...mc("MC-ALI-2-03", 2),
    ...mc("MC-ALI-2-04", 2), ...mc("MC-ALI-2-05", 2), ...mc("MC-ALI-2-06", 2),
    ...mc("MC-AMB-2-01", 2), ...mc("MC-AMB-2-02", 2), ...mc("MC-AMB-2-03", 2),
    ...mc("MC-AMB-2-04", 2), ...mc("MC-AMB-2-05", 2), ...mc("MC-AMB-2-06", 2),
    ...mc("MC-DIG-2-02", 2), ...mc("MC-DIG-2-03", 2), ...mc("MC-DIG-2-04", 2), ...mc("MC-DIG-2-05", 2),
    ...voce("Compiti di realtà e ripasso", "Si completano e si presentano i compiti di realtà dell’anno; ripasso con quiz, flashcard e sketchnote.", { settimane: 2, link: [{ href: "/anno/2", label: "Tutte le lezioni della classe 2ª" }] }),
  ],
  pratica: [
    ...voce("Ripasso: strumenti e costruzioni di base", "Perpendicolari, parallele e poligoni regolari: servono per tutte le tavole dell’anno.", { mc: "MC-DIS-1-01", link: LINK_COSTRUZIONI }),
    ...tavolePO([1, 2], "Proiezioni ortogonali: i tre piani e il punto", PO),
    ...tavolePO([3, 4], "Proiezioni ortogonali: figure piane", PO),
    ...tavolePO([5, 6], "Proiezioni ortogonali: parallelepipedo e prisma triangolare", PO),
    ...tavolePO([7, 8], "Proiezioni ortogonali: prisma esagonale e piramide", PO),
    ...tavolePO([9, 10], "Proiezioni ortogonali: cilindro e cono", PO),
    ...tavolePO([11, 12], "Proiezioni ortogonali: prisma con la base parallela al PV e blocco a L", PO),
    ...tavolePO([13, 14], "Proiezioni ortogonali: solidi sovrapposti", PO),
    ...tavolePO([15], "Sezioni: la piramide tagliata", PO),
    ...tavolePO([16, 17], "Sezioni: prisma e cilindro tagliati da un piano inclinato", PO),
    ...voce("Proiezioni ortogonali: tavola di verifica", "Ognuno sceglie un solido nel Proiettore ortogonale e ne disegna le tre viste senza guida.", { mc: "MC-DIS-2-01", link: LINK_PO }),
    ...voce("Assonometria cavaliera: il parallelepipedo", "Gli assi della cavaliera e il primo solido: è l’attività di livello base di «Sperimenta».", { mc: "MC-DIS-2-02" }),
    ...voce("Assonometria cavaliera: altri solidi", "Altri solidi in cavaliera, partendo dalle proiezioni ortogonali già disegnate.", { mc: "MC-DIS-2-02", link: LINK_PO }),
    ...voce("Assonometria isometrica: gli assi", "I tre assi isometrici con la squadra a 30° e 60° e il primo parallelepipedo.", { mc: "MC-DIS-2-02" }),
    ...voce("Assonometria isometrica: altri solidi", "Gli stessi solidi della cavaliera, ora in isometrica.", { mc: "MC-DIS-2-02", link: LINK_PO }),
    ...voce("Solidi composti: il metodo della scatola", "Si chiude il solido in una scatola, la si disegna in assonometria e si toglie ciò che non serve.", { mc: "MC-DIS-2-02", settimane: 2 }),
    ...voce("Cavaliera e isometrica a confronto", "Lo stesso oggetto disegnato nei due modi: quando conviene l’uno e quando l’altro (livello intermedio di «Sperimenta»).", { mc: "MC-DIS-2-02" }),
    ...voce("I cerchi in assonometria", "Come un cerchio diventa un’ellisse e come si disegna un solido con una parte cilindrica in isometrica (livello avanzato di «Sperimenta»).", { mc: "MC-DIS-2-02" }),
    ...mc("MC-DIG-2-01", 6),
    ...mc("MC-INF-2-01", 3),
    ...mc("MC-INF-2-02", 3),
    ...voce("Progetto libero di coding", "Ognuno progetta e realizza un programma a blocchi suo, partendo da ciò che ha imparato.", { mc: "MC-DIG-2-01", settimane: 2 }),
    ...voce("Tavola finale e raccolta dei lavori", "Una tavola a scelta in bella copia e la cartella con i disegni e i programmi dell’anno.", { settimane: 2, link: LINK_PO }),
  ],
};

// ── Classe 3ª ────────────────────────────────────────────────────────────────────────────────────
// Disegno: ripasso delle proiezioni, poi assonometrie (testo di riferimento: MC-DIS-2-02),
// prospettiva centrale e accidentale e progettazione (MC-DIS-3-01), infine CAD (MC-DIS-3-02).
const CLASSE_3: PianoClasse = {
  teoria: [
    ...voce("Si riparte: il percorso della terza", "Che cosa si studia quest’anno e come si arriva preparati all’esame.", { link: [{ href: "/anno/3", label: "Il percorso della classe 3ª" }] }),
    ...mc("MC-ENE-3-01", 2), ...mc("MC-ENE-3-02", 2), ...mc("MC-ENE-3-03", 2),
    ...mc("MC-ENE-3-04", 2), ...mc("MC-ENE-3-05", 2), ...mc("MC-ENE-3-06", 2),
    ...mc("MC-COM-3-01", 2), ...mc("MC-COM-3-02", 2), ...mc("MC-COM-3-03", 2),
    ...mc("MC-COM-3-04", 2), ...mc("MC-COM-3-05", 2), ...mc("MC-COM-3-06", 2),
    ...mc("MC-SIS-3-01", 1), ...mc("MC-SIS-3-02", 1), ...mc("MC-SIS-3-03", 1), ...mc("MC-SIS-3-04", 1),
    ...mc("MC-DIG-3-02", 2), ...mc("MC-INF-3-02", 1), ...mc("MC-DIG-3-04", 1),
    ...voce("Verso l’esame: ripasso e collegamenti", "Ripasso con quiz, flashcard e sketchnote; si sceglie l’argomento di Tecnologia da portare al colloquio.", { settimane: 2, link: [{ href: "/anno/3", label: "Tutte le lezioni della classe 3ª" }] }),
  ],
  pratica: [
    ...voce("Ripasso: le proiezioni ortogonali", "Le tre viste di un solido: da qui partono sia l’assonometria sia la prospettiva.", { mc: "MC-DIS-2-01", link: LINK_PO }),
    ...voce("Assonometria cavaliera: solidi semplici", "Gli assi della cavaliera; parallelepipedo e prismi a partire dalle tre viste.", { mc: "MC-DIS-2-02" }),
    ...voce("Assonometria cavaliera: piramidi e solidi sovrapposti", "Si passa dalle proiezioni ortogonali all’assonometria di solidi più articolati.", { mc: "MC-DIS-2-02", link: LINK_PO }),
    ...voce("Assonometria isometrica: solidi semplici", "I tre assi isometrici con la squadra a 30° e 60°; parallelepipedo e prismi.", { mc: "MC-DIS-2-02" }),
    ...voce("Assonometria isometrica: piramidi e solidi sovrapposti", "Gli stessi solidi della cavaliera, ora in isometrica.", { mc: "MC-DIS-2-02", link: LINK_PO }),
    ...voce("Cavaliera e isometrica a confronto", "Lo stesso oggetto nei due modi: che cosa cambia e quando conviene ciascuno.", { mc: "MC-DIS-2-02" }),
    ...voce("Assonometria di solidi composti", "Il metodo della scatola: si chiude l’oggetto in una scatola e si toglie ciò che non serve.", { mc: "MC-DIS-2-02", settimane: 2 }),
    ...voce("I cerchi in assonometria", "Come un cerchio diventa un’ellisse; il cilindro e un solido composto con una parte cilindrica.", { mc: "MC-DIS-2-02" }),
    ...voce("Prospettiva centrale: orizzonte e punto di fuga", "Linea d’orizzonte, punto di fuga e la prima scatola in prospettiva (livello base di «Sperimenta»).", { mc: "MC-DIS-3-01" }),
    ...voce("Prospettiva centrale: più solidi", "Scatole sopra e sotto la linea d’orizzonte, a destra e a sinistra del punto di fuga.", { mc: "MC-DIS-3-01" }),
    ...voce("Prospettiva centrale: una stanza", "Un interno visto di fronte: pavimento, pareti, una porta e un mobile.", { mc: "MC-DIS-3-01" }),
    ...voce("Prospettiva accidentale: due punti di fuga", "Lo spigolo verticale in primo piano e le linee verso i due punti di fuga: la prima scatola vista d’angolo.", { mc: "MC-DIS-3-01" }),
    ...voce("Prospettiva accidentale: un oggetto vero", "Un mobile semplice in prospettiva a due punti di fuga.", { mc: "MC-DIS-3-01" }),
    ...voce("Prospettiva accidentale: un edificio", "Un volume semplice con porte e finestre, visto d’angolo.", { mc: "MC-DIS-3-01" }),
    ...voce("Assonometria e prospettiva a confronto", "Lo stesso oggetto in isometrica e in prospettiva accidentale, con il confronto scritto (livello intermedio di «Sperimenta»).", { mc: "MC-DIS-3-01" }),
    ...voce("Progettare un oggetto: dal brief al disegno", "Si parte dal brief, cioè la richiesta del cliente: ricerca, schizzi a mano libera, tre viste quotate e disegno finale in prospettiva (livello avanzato di «Sperimenta»).", { mc: "MC-DIS-3-01", settimane: 3 }),
    ...mc("MC-DIS-3-02", 6),
    ...mc("MC-DIG-3-01", 4),
    ...mc("MC-DIG-3-03", 3),
    ...mc("MC-INF-3-01", 1),
    ...voce("Verso l’esame: tavole e progetto", "Si sistemano le tavole migliori e il progetto dell’anno da mostrare al colloquio.", { settimane: 2 }),
  ],
};

export const PIANO_LEZIONI: Record<1 | 2 | 3, PianoClasse> = { 1: CLASSE_1, 2: CLASSE_2, 3: CLASSE_3 };

// Controllo in fase di build: ogni binario deve coprire tutte le settimane di lezione.
for (const [classe, piano] of Object.entries(PIANO_LEZIONI)) {
  for (const binario of ["teoria", "pratica"] as const) {
    if (piano[binario].length !== SETTIMANE_DI_LEZIONE) {
      console.warn(`[lezione-settimanale] classe ${classe}, ${binario}: ${piano[binario].length} settimane invece di ${SETTIMANE_DI_LEZIONE}`);
    }
  }
}
