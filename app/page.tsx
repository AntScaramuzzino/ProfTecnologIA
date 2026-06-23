import Link from "next/link";
import MCCard from "@/components/MCCard";
import { AREA_META, getAllMCs } from "@/lib/mc-loader";
import { areaAccent, cx } from "@/lib/ui";

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
  const featured = [
    "MC-ALI-2-02", "MC-MAT-1-02", "MC-DIG-3-02",
    "MC-ENE-3-04", "MC-AMB-2-05", "MC-COM-3-03",
  ]
    .map((id) => allMCs.find((mc) => mc.id === id))
    .filter(Boolean);

  const stats = [
    { value: allMCs.length.toString(), label: "Micro-competenze" },
    { value: "9",   label: "Aree tematiche" },
    { value: "3",   label: "Anni di scuola" },
    { value: "5",   label: "Zone per MC" },
    { value: "IN 2025", label: "D.M. n. 221/2025" },
    { value: "DC 3.0",  label: "DigComp" },
  ];

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        {/* Sfondo decorativo */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-50 opacity-70" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-50 opacity-50" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">

            {/* Testo hero */}
            <div>
              {/* Badge autore */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-800 sm:text-sm">
                  Prof. Ing. Antonio Scaramuzzino · ProfTecnologia
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Prof<span className="text-emerald-600">TecnologIA</span>
              </h1>

              <p className="mt-2 text-base font-semibold text-slate-500 sm:text-lg">
                Il primo libro di Tecnologia nativamente progettato sulle IN 2025
              </p>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {allMCs.length} micro-competenze strutturate in 5 zone didattiche,
                testi narrativi, immagini AI, hook audio, video e compiti di realtà
                per la scuola secondaria di I grado.
              </p>

              {/* Framework allineati */}
              <div className="mt-5 flex flex-wrap gap-2">
                {["IN 2025 · D.M. 221/2025", "DigComp 3.0", "EntreComp", "Agenda 2030", "DSA First"].map((f) => (
                  <span key={f} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {f}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#catalogo"
                  className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-800"
                >
                  Esplora il catalogo
                </Link>
                <Link
                  href="/anno/1"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-slate-500"
                >
                  Inizia dalla 1ª media →
                </Link>
                <a
                  href="https://eduwiki-tecnologia.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-blue-300 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                >
                  EduWiki didattico →
                </a>
              </div>
            </div>

            {/* Card anni */}
            <div className="grid grid-cols-3 gap-3">
              {years.map(({ anno, mcs }) => (
                <Link
                  key={anno}
                  href={`/anno/${anno}`}
                  className="group rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 text-center transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md sm:p-6"
                >
                  <div className="text-3xl font-black text-slate-950 sm:text-4xl">{anno}<span className="text-lg font-bold text-slate-400">ª</span></div>
                  <div className="mt-0.5 text-xs font-semibold text-slate-500">media</div>
                  <div className="mt-4 text-2xl font-black text-emerald-700">{mcs.length}</div>
                  <div className="text-xs font-medium text-slate-500">MC</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="grid grid-cols-3 gap-px bg-slate-800 sm:grid-cols-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-slate-950 px-4 py-4 text-center">
                <div className="text-xl font-black text-emerald-400 sm:text-2xl">{value}</div>
                <div className="mt-0.5 text-xs font-medium text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AREE TEMATICHE ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">9 aree tematiche</p>
          <h2 className="text-2xl font-black sm:text-3xl">Il percorso triennale</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {areas.map(({ code, meta, count }) => (
            <Link
              key={code}
              href={`/area/${code}`}
              className={cx(
                "group rounded-xl border bg-gradient-to-br p-4 transition hover:-translate-y-0.5 hover:shadow-md",
                areaAccent[code]
              )}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{meta.emoji}</span>
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
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Vetrina</p>
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
                <h2 className="text-xl font-black sm:text-2xl">{anno}ª media</h2>
                <Link href={`/anno/${anno}`} className="text-sm font-bold text-emerald-700 hover:text-emerald-900">
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
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">Il progetto</p>
              <h2 className="text-3xl font-black sm:text-4xl">
                Prof<span className="text-emerald-400">TecnologIA</span>
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
                  className="rounded-full border border-emerald-700 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-900"
                >
                  🌐 www.proftecnologia.it
                </a>
                <a
                  href="https://eduwiki-tecnologia.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-blue-700 px-4 py-2 text-xs font-bold text-blue-400 hover:bg-blue-900"
                >
                  📚 EduWiki didattico
                </a>
                <a
                  href="mailto:antonio.scaramuzzino@coopinrete.it"
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-400 hover:border-slate-500"
                >
                  ✉️ Contatto editori
                </a>
              </div>
            </div>

            {/* Card autore */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">L'autore</p>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xl font-black text-white">
                  AS
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Prof. Ing. Antonio Scaramuzzino</h3>
                  <p className="mt-0.5 text-sm font-semibold text-emerald-400">
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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-emerald-400">ProfTecnologIA</span>
              <span className="rounded-full border border-emerald-800 px-2 py-0.5 font-mono text-xs font-bold text-emerald-500">
                v0.1
              </span>
              <span className="text-slate-700">·</span>
              <span className="text-xs text-slate-500">
                © 2026 Prof. Ing. Antonio Scaramuzzino
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Allineato alle IN 2025 · D.M. n. 221/2025</span>
              <span className="text-slate-700">·</span>
              <span>DigComp 3.0</span>
              <span className="text-slate-700">·</span>
              <Link href="/architettura" className="hover:text-slate-300">Architettura</Link>
              <span className="text-slate-700">·</span>
              <Link href="/credits" className="hover:text-slate-300">Credits</Link>
              <span className="text-slate-700">·</span>
              <a
                href="https://eduwiki-tecnologia.vercel.app"
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
                className="hover:text-slate-300"
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
