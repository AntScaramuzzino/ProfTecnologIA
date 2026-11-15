// Calendario scolastico usato dalla «Lezione della settimana» in home.
// Modulo puro (niente fs): si può importare anche dai componenti client.
//
// A.S. 2026/27 — Regione Calabria (decreto del Presidente della Giunta regionale, aprile 2026):
// lezioni da martedì 15 settembre 2026 a martedì 8 giugno 2027.
// Gli adattamenti deliberati dal singolo istituto (ponti, festa del patrono) NON sono inclusi:
// se servono, aggiungerli a `sospensioni`.
// A ogni nuovo anno scolastico basta aggiornare questo oggetto.

export const ANNO_SCOLASTICO = {
  etichetta: "2026/27",
  regione: "Calabria",
  inizio: "2026-09-15",
  fine: "2027-06-08",
  sospensioni: [
    { da: "2026-11-02", a: "2026-11-02", nome: "Commemorazione dei defunti" },
    { da: "2026-12-07", a: "2026-12-08", nome: "Ponte dell’Immacolata" },
    { da: "2026-12-23", a: "2027-01-06", nome: "Vacanze di Natale" },
    { da: "2027-03-25", a: "2027-03-30", nome: "Vacanze di Pasqua" },
    { da: "2027-06-02", a: "2027-06-02", nome: "Festa della Repubblica" },
  ],
};

/** Una settimana conta come «di lezione» se ha almeno questi giorni di scuola (lun–ven). */
const GIORNI_MINIMI = 3;

export interface SettimanaScolastica {
  /** Lunedì della settimana, AAAA-MM-GG. */
  lunedi: string;
  /** Venerdì della settimana, AAAA-MM-GG. */
  venerdi: string;
  /** Giorni di scuola (lun–ven) nella settimana. */
  giorni: number;
  /** Numero progressivo fra le settimane di lezione (1, 2, …); null se la settimana è di pausa. */
  numero: number | null;
  /** Perché non è una settimana di lezione (vacanze, ultimi giorni…). */
  motivo?: string;
}

// Le date sono stringhe AAAA-MM-GG e i conti si fanno in UTC: niente sorprese con fusi e ora legale.
function aGiorni(iso: string): number {
  const [a, m, g] = iso.split("-").map(Number);
  return Math.round(Date.UTC(a, m - 1, g) / 86400000);
}
function daGiorni(n: number): string {
  return new Date(n * 86400000).toISOString().slice(0, 10);
}
function giornoSettimana(n: number): number {
  return new Date(n * 86400000).getUTCDay(); // 0 = domenica
}
function lunediDi(n: number): number {
  return n - ((giornoSettimana(n) + 6) % 7);
}

function sospensioneDel(n: number) {
  return ANNO_SCOLASTICO.sospensioni.find((s) => n >= aGiorni(s.da) && n <= aGiorni(s.a));
}

function costruisciSettimane(): SettimanaScolastica[] {
  const inizio = aGiorni(ANNO_SCOLASTICO.inizio);
  const fine = aGiorni(ANNO_SCOLASTICO.fine);
  const settimane: SettimanaScolastica[] = [];
  let numero = 0;
  for (let lun = lunediDi(inizio); lun <= fine; lun += 7) {
    let giorni = 0;
    let motivo: string | undefined;
    for (let d = lun; d < lun + 5; d++) {
      if (d < inizio || d > fine) continue;
      const s = sospensioneDel(d);
      if (s) motivo = motivo ?? s.nome;
      else giorni++;
    }
    const didattica = giorni >= GIORNI_MINIMI;
    if (didattica) numero++;
    settimane.push({
      lunedi: daGiorni(lun),
      venerdi: daGiorni(lun + 4),
      giorni,
      numero: didattica ? numero : null,
      motivo: didattica ? undefined : lun + 4 > fine ? "Ultimi giorni di scuola" : motivo ?? "Settimana corta",
    });
  }
  return settimane;
}

/** Tutte le settimane dell'anno scolastico, dal lunedì della prima a quello dell'ultima. */
export const SETTIMANE: SettimanaScolastica[] = costruisciSettimane();

/** Quante settimane di lezione ha l'anno. */
export const SETTIMANE_DI_LEZIONE = SETTIMANE.filter((s) => s.numero !== null).length;

/**
 * Posizione di una data nell'anno scolastico.
 * Di sabato e domenica si guarda già alla settimana che sta per cominciare.
 * Ritorna l'indice in SETTIMANE, oppure -1 (prima dell'inizio) o SETTIMANE.length (dopo la fine).
 */
export function indiceSettimana(oggi: Date): number {
  let n = Math.round(Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()) / 86400000);
  const gs = giornoSettimana(n);
  if (gs === 6) n += 2;
  if (gs === 0) n += 1;
  const lun = daGiorni(lunediDi(n));
  if (lun < SETTIMANE[0].lunedi) return -1;
  const i = SETTIMANE.findIndex((s) => s.lunedi === lun);
  return i === -1 ? SETTIMANE.length : i;
}

const MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

/** «16–20 novembre 2026», «28 settembre – 2 ottobre 2026». */
export function etichettaSettimana(s: SettimanaScolastica): string {
  const [a1, m1, g1] = s.lunedi.split("-").map(Number);
  const [a2, m2, g2] = s.venerdi.split("-").map(Number);
  if (m1 === m2) return `${g1}–${g2} ${MESI[m1 - 1]} ${a2}`;
  return `${g1} ${MESI[m1 - 1]}${a1 !== a2 ? ` ${a1}` : ""} – ${g2} ${MESI[m2 - 1]} ${a2}`;
}
