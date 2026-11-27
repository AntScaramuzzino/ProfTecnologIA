import Link from "next/link";
import MCCard from "@/components/MCCard";
import UiIcon from "@/components/UiIcon";
import AreaIcon from "@/components/AreaIcon";
import LezioneSettimana from "@/components/LezioneSettimana";
import { costruisciPianoSettimane } from "@/lib/piano-settimane";
import { AREA_META, getAllMCs, type MC } from "@/lib/mc-loader";
import { areaAccent, cx } from "@/lib/ui";
import { ESPLORAZIONI } from "@/lib/esplorazioni";
import { LABORATORI, ESCAPE_ROOMS } from "@/lib/laboratori";
import { GLOSSARIO } from "@/lib/competenze-glossario";
import { getMCEsploraImages } from "@/lib/content-loader";
import { COSTRUZIONI_GEOGEBRA } from "@/lib/geogebra-costruzioni";
import { TAVOLE_PO_PRONTE } from "@/lib/geogebra-proiezioni";
import { TAVOLE_ASS_PRONTE } from "@/lib/geogebra-assonometrie";

/** Tavole GeoGebra pubblicate: costruzioni geometriche + proiezioni ortogonali + assonometrie (si aggiorna da solo) */
const tavoleGeoGebra = COSTRUZIONI_GEOGEBRA.length + TAVOLE_PO_PRONTE.length + TAVOLE_ASS_PRONTE.length;

export default function HomePage() {
  const allMCs = getAllMCs();
  const years = [1, 2, 3].map((anno) => ({
    anno,
    mcs: allMCs.filter((mc) => mc.anno === anno),
  }));
  const areas = Object.entries(AREA_META)
    .map(([code, meta]) => ({
      code,
      meta,
      count: allMCs.filter((mc) => mc.area === code).length,
    }))
    .filter((area) => area.count > 0);
  // Una MC rappresentativa per area (prima della lista), max 6 in vetrina
  const featured = areas
    .flatMap(({ code }) => allMCs.filter((mc) => mc.area === code).slice(0, 1))
    .slice(0, 6) as MC[];

  const pianoSettimane = costruisciPianoSettimane();

  // «Nel libro trovi»: tutti i numeri si calcolano dai dati, nessuno è scritto a mano
  const videoAnimati = allMCs.reduce(
    (n, mc) => n + getMCEsploraImages(mc.id).filter((img) => !!img.video).length,
    0,
  );
  const nelLibro = [
    { value: LABORATORI.length, label: "laboratori interattivi", href: "/laboratori/" },
    { value: ESCAPE_ROOMS.length, label: "escape room", href: "/laboratori/" },
    { value: videoAnimati, label: "video animati", href: undefined },
    { value: ESPLORAZIONI.length, label: "esplorazioni immersive", href: "/laboratori/#esplorazioni" },
    { value: tavoleGeoGebra, label: "tavole GeoGebra", href: "/costruzioni-geometriche/" },
    { value: Object.keys(GLOSSARIO).length, label: "voci del glossario", href: "/glossario/" },
  ];

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">

            {/* Testo hero */}
            <div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Book Prof<span className="text-brand-600">TecnologIA</span>
              </h1>
              <p className="mt-2 text-sm text-slate-600">di Prof. Ing. Antonio Scaramuzzino</p>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-800 sm:text-xl">
                Il primo libro di Tecnologia nativamente progettato sulle Indicazioni Nazionali 2025 e arricchito con esperienze interattive con il supporto dell’IA.
              </p>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {allMCs.length} micro-competenze per la scuola secondaria di I grado. Per ognuna: testo con i concetti chiave, video animato, laboratorio interattivo, escape room e compito di realtà.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#catalogo"
                  className="rounded-full bg-brand-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-800"
                >
                  Esplora il catalogo
                </Link>
                <a
                  href="https://eduwiki.proftecnologia.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-brand-600"
                >
                  EduWiki didattico →
                </a>
              </div>
            </div>

            {/* Colonna destra: classi + «Nel libro trovi» */}
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 text-base font-bold text-slate-900">Scegli la classe</h2>
                <div className="grid grid-cols-3 gap-3">
                  {years.map(({ anno, mcs }) => (
                    <Link
                      key={anno}
                      href={`/anno/${anno}`}
                      className="group rounded-xl border border-slate-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:p-6"
                    >
                      <div className="text-sm text-slate-600">Classe</div>
                      <div className="text-3xl font-black text-slate-950 sm:text-4xl">{anno}<span className="text-lg font-bold text-slate-500">ª</span></div>
                      <div className="mt-3 text-sm text-slate-600">{mcs.length} lezioni</div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-base font-bold text-slate-900">Nel libro trovi anche</h2>
                <ul className="grid gap-x-6 gap-y-2 text-sm text-slate-700 sm:grid-cols-2">
                  {nelLibro.map(({ value, label, href }) => (
                    <li key={label}>
                      {href ? (
                        <Link href={href} className="underline decoration-slate-300 underline-offset-4 hover:text-brand-700 hover:decoration-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                          <span className="font-bold tabular-nums">{value}</span> {label}
                        </Link>
                      ) : (
                        <><span className="font-bold tabular-nums">{value}</span> {label}</>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEZIONE DELLA SETTIMANA ──────────────────────────────────────── */}
      <LezioneSettimana piano={pianoSettimane} />

      {/* ── AREE TEMATICHE ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-5">
          <h2 className="text-2xl font-black sm:text-3xl">Le {areas.length} aree del triennio</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {areas.map(({ code, meta, count }) => (
            <Link
              key={code}
              href={`/area/${code}`}
              className={cx(
                "group rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                areaAccent[code]
              )}
            >
              <div className="flex items-start justify-between">
                <AreaIcon area={code} size={28} className="text-slate-800" />
                <span className="rounded-full bg-white/60 px-2 py-0.5 font-mono text-xs font-bold text-slate-600">{code}</span>
              </div>
              <h3 className="mt-3 text-sm font-black text-slate-900">{meta.label}</h3>
              <p className="mt-1 text-xs text-slate-600">{count} MC disponibili</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── VETRINA MC ───────────────────────────────────────────────────── */}
      <section id="catalogo" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">MC con testi, immagini e audio</h2>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-500">
            {allMCs.length} MC totali
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {featured.map((mc) => mc && <MCCard key={mc.id} mc={mc} />)}
        </div>
      </section>

      {/* ── CATALOGO PER ANNO ────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          {years.map(({ anno, mcs }) => (
            <div key={anno} className="mb-10 last:mb-0">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black sm:text-2xl">Classe {anno}ª</h2>
                <Link href={`/anno/${anno}`} className="text-sm font-bold text-brand-700 hover:text-brand-900">
                  Vedi tutto →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {mcs.slice(0, 8).map((mc) => (
                  <MCCard key={mc.id} mc={mc} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AUTORE ───────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-16">

            {/* Brand + identità */}
            <div>
              <h2 className="text-3xl font-black sm:text-4xl">
                Book Prof<span className="text-brand-400">TecnologIA</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Un ecosistema didattico integrato per la Tecnologia nella scuola secondaria di I grado:
                libro strutturato sulle micro-competenze, sistema di agenti AI per la produzione dei contenuti,
                app per studenti con AI Coach integrato.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://www.proftecnologia.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-brand-700 px-4 py-2 text-xs font-bold text-brand-400 hover:bg-brand-900"
                >
                  <UiIcon name="web" size={14} className="mr-1.5" />www.proftecnologia.it
                </a>
                <a
                  href="https://eduwiki.proftecnologia.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-blue-700 px-4 py-2 text-xs font-bold text-blue-400 hover:bg-blue-900"
                >
                  <UiIcon name="wiki" size={14} className="mr-1.5" />EduWiki didattico
                </a>
                <a
                  href="mailto:antonio.scaramuzzino@coopinrete.it"
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-400 hover:border-slate-500"
                >
                  <UiIcon name="mail" size={14} className="mr-1.5" />Contatto editori
                </a>
              </div>
            </div>

            {/* Card autore */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xl font-black text-white">
                  AS
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Prof. Ing. Antonio Scaramuzzino</h3>
                  <p className="mt-0.5 text-sm font-semibold text-brand-400">
                    Docente di Tecnologia · Classe A060
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm leading-6 text-slate-400">
                <p>
                  Ingegnere Gestionale (Unical, 1999) e docente di Tecnologia nella scuola secondaria
                  di I grado di ruolo dal 2015.
                </p>
                <p>
                  Membro dell'Équipe Formativa Territoriale Calabria del MIM, in esonero per le azioni
                  del PNRR e del Piano Nazionale Scuola Digitale.
                </p>
                <p>
                  Già Esperto Formatore Mondadori Education e Rizzoli Education.
                  Coautore di 6 MOOC nazionali su Scuola Futura.
                  Microsoft Innovative Educator Expert per 5 anni consecutivi.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {["STEM", "DigComp 3.0", "AI Education", "Coding & Robotica", "Flipped Classroom", "PNRR"].map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* Riga brand + copyright */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-black text-brand-400">Book ProfTecnologIA</span>
              <span className="text-slate-700">·</span>
              <span>© 2026 Prof. Ing. Antonio Scaramuzzino</span>
              <span className="text-slate-700">·</span>
              <span className="text-slate-600">IN 2025 · DigComp 3.0</span>
            </div>

            {/* Riga link navigazione */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <Link href="/docenti" className="transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400">Docenti</Link>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <Link href="/architettura" className="transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400">Architettura</Link>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <Link href="/glossario" className="transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400">Glossario</Link>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <Link href="/credits" className="transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400">Credits</Link>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <a
                href="https://eduwiki.proftecnologia.it"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 text-blue-500"
              >
                EduWiki
              </a>
              <span className="text-slate-700">·</span>
              <a
                href="https://github.com/AntScaramuzzino/ProfTecnologIA"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
