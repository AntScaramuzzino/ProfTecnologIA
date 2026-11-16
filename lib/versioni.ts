/**
 * Versioni del Book ProfTecnologIA — fonte unica per il badge (intestazione e piè di pagina)
 * e per la pagina /novita.
 *
 * Numerazione:
 *  - 0.x   → un insieme nuovo di funzioni (nuova area del sito o nuovo tipo di attività): nuova voce qui sotto
 *  - 0.x.y → correzioni e piccoli miglioramenti: si aggiorna solo VERSIONE_ATTUALE, senza nuova voce
 *  - 1.0   → la decide l'autore (edizione ufficiale per l'anno scolastico)
 *
 * La prima voce di VERSIONI è la più recente. Testi per studenti, famiglie e docenti: niente gergo tecnico.
 */

export interface Novita {
  /** Testo della novità; le parti tra **doppi asterischi** vengono rese in grassetto */
  testo: string;
  /** Pagina del sito a cui porta la novità, se c'è */
  href?: string;
}

export interface Versione {
  numero: string;
  nome: string;
  date: string;
  novita: Novita[];
}

export const VERSIONE_ATTUALE = "0.5";

export const VERSIONI: Versione[] = [
  {
    numero: "0.5",
    nome: "Disegno, GeoGebra e strumenti per la classe",
    date: "13–16 novembre 2026",
    novita: [
      { testo: "**Costruzioni geometriche**: 114 tavole GeoGebra da seguire passo per passo, raccolte in una pagina dedicata e utilizzabili anche dal telefono e sulla LIM.", href: "/costruzioni-geometriche/" },
      { testo: "**Proiezioni ortogonali**: il proiettore ortogonale e 18 tavole guidate, anche nella versione «foglio tecnico».", href: "/proiezioni-ortogonali/" },
      { testo: "**Assonometrie**: l'Assonometro (cavaliera, isometrica, monometrica, militare, dimetrica, trimetrica) e 6 tavole guidate. Il docente può assegnare un esercizio con un codice o un QR.", href: "/assonometrie/" },
      { testo: "**Officina dei motivi modulari**: 17 tavole, la costruzione animata e la stanza in 3D.", href: "/laboratori/" },
      { testo: "**Riga e squadre che si muovono** nelle tavole, come sul foglio." },
      { testo: "**Lezione della settimana** in home, secondo il calendario scolastico: teoria + disegno o coding.", href: "/" },
      { testo: "**Pagina Docenti** per pianificare l'anno, fino a 9 classi.", href: "/docenti/" },
      { testo: "**«Segui il joule»**: un libro 3D sull'energia in 5 lezioni.", href: "/laboratori/" },
      { testo: "**Nuova esplorazione immersiva**: «Lo stabilimento del latte».", href: "/laboratori/#esplorazioni" },
      { testo: "**Evidenziatore giallo** sui concetti chiave dei testi ESPLORA, in tutte le 58 MC." },
    ],
  },
  {
    numero: "0.4",
    nome: "Esplorazioni immersive",
    date: "10–13 novembre 2026",
    novita: [
      { testo: "**11 esplorazioni immersive**: centrale idroelettrica, centrale termoelettrica, impianto di selezione dei rifiuti, la casa e i suoi impianti, dalla sorgente al depuratore, la bicicletta, dove vive Internet, lo scheletro dell'edificio, l'acciaieria, il frantoio, il motore a quattro tempi.", href: "/laboratori/#esplorazioni" },
      { testo: "Dentro ogni esplorazione si scende di livello in livello, con un menu ad albero." },
      { testo: "**Tre lingue** (italiano, inglese, francese), lettura ad alta voce (in italiano con la voce dell'autore) e visita guidata." },
      { testo: "**Condividi**: link, codice per incorporare e QR." },
      { testo: "Le scene visitate compaiono nella pagina Progressi.", href: "/progressi/" },
      { testo: "**Ricerca globale** su lezioni, laboratori, escape room, esplorazioni, glossario e pagine." },
      { testo: "Colonna laterale più compatta, che si può nascondere." },
    ],
  },
  {
    numero: "0.3",
    nome: "Book ProfTecnologIA: laboratori, video e immagini",
    date: "31 ottobre – 9 novembre 2026",
    novita: [
      { testo: "Nuovo nome e nuovo indirizzo: **book.proftecnologia.it**." },
      { testo: "**Un laboratorio interattivo per ogni MC (58)**, con verifiche di fine livello e modalità LIM a passi.", href: "/laboratori/" },
      { testo: "**Escape room** per tutte le 58 MC.", href: "/laboratori/" },
      { testo: "**58 video animati** con voce narrante, dal canale YouTube ProfTecnologIA, dentro i paragrafi di ESPLORA." },
      { testo: "**Un'immagine per ogni paragrafo** di ESPLORA (circa 440). Dove un'immagine non bastava, ci sono schemi didattici disegnati." },
      { testo: "Testi riorganizzati: il nucleo «In breve» è sempre aperto, gli approfondimenti si aprono a richiesta." },
      { testo: "Compiti di realtà con un destinatario reale; quiz con le risposte in ordine casuale." },
      { testo: "Collegamenti diretti alle schede di una MC (#esplora, #sperimenta, #agisci, #ripassa)." },
      { testo: "Testo più leggibile sul telefono." },
    ],
  },
  {
    numero: "0.2",
    nome: "Il libro completo",
    date: "5–20 luglio 2026",
    novita: [
      { testo: "Nuova grafica, con un carattere ad alta leggibilità (Atkinson Hyperlegible)." },
      { testo: "**58 MC**: arrivano Pensiero computazionale, Benessere digitale e le 6 MC di Informatica." },
      { testo: "**8 schede per MC**: si aggiungono PROFESSIONI (due professioni per MC, ognuna con il suo racconto) e CLIL (lessico italiano–inglese)." },
      { testo: "**Presentazioni a slide** in apertura di ESPLORA per tutte le 58 MC." },
      { testo: "**Badge dell'Agenda 2030** e pagina Progressi, con le sessioni degli studenti.", href: "/progressi/" },
      { testo: "Ricerca rapida e **glossario delle competenze**.", href: "/glossario/" },
      { testo: "Infografiche di processo, sketchnote nel ripasso, immagini dei compiti di realtà, QR dell'assistente IA." },
      { testo: "Immagini più leggere: le pagine si caricano più in fretta." },
      { testo: "Prime costruzioni GeoGebra: la perpendicolare e le prime costruzioni animate." },
    ],
  },
  {
    numero: "0.1",
    nome: "Prima edizione online",
    date: "10–16 maggio 2026",
    novita: [
      { testo: "**50 MC** con le 6 schede: INNESCA, ESPLORA, OSSERVA, SPERIMENTA, AGISCI, RIPASSA." },
      { testo: "**Audio dell'aggancio** in forma di podcast, con trascrizione." },
      { testo: "**Video YouTube** selezionati per ogni MC (492 in tutto)." },
      { testo: "**Quiz da 18 domande** su tre livelli, flashcard e microlearning." },
      { testo: "Immagini per ogni MC e pagina Credits, con la dichiarazione sull'uso dell'IA.", href: "/credits/" },
      { testo: "Accessibilità secondo le WCAG 2.2 AA." },
    ],
  },
];
