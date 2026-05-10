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
    "MC-ALI-2-02",
    "MC-MAT-1-02",
    "MC-DIG-3-02",
    "MC-ENE-3-04",
    "MC-AMB-2-05",
    "MC-COM-3-03",
  ]
    .map((id) => allMCs.find((mc) => mc.id === id))
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-emerald-700 sm:mb-4 sm:text-sm">
              Libro di Tecnologia · Sistema agenti · App studenti
            </p>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              ProfTecnologIA
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
              Il libro digitale del progetto TecnologIA: 50 micro-competenze, testi narrativi,
              immagini generate, compiti di realtà e percorsi DigComp per la scuola secondaria di primo grado.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
              <Link href="#catalogo" className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 sm:px-5 sm:py-3">
                Esplora il catalogo
              </Link>
              <Link href="/anno/1" className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:border-slate-500 sm:px-5 sm:py-3">
                Inizia dalla 1ª media
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {years.map(({ anno, mcs }) => (
              <Link
                key={anno}
                href={`/anno/${anno}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
              >
                <div className="text-2xl font-black text-slate-950 sm:text-3xl">{anno}ª</div>
                <div className="mt-0.5 text-xs font-semibold text-slate-600 sm:mt-1 sm:text-sm">media</div>
                <div className="mt-3 text-xl font-black text-emerald-700 sm:mt-5 sm:text-2xl">{mcs.length}</div>
                <div className="text-xs text-slate-500">MC</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map(({ code, meta, count }) => (
            <Link
              key={code}
              href={`/area/${code}`}
              className={cx("rounded-lg border bg-gradient-to-br p-4 transition hover:-translate-y-0.5 hover:shadow-sm", areaAccent[code])}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{meta.emoji}</span>
                <span className="font-mono text-xs font-bold text-slate-500">{code}</span>
              </div>
              <h2 className="mt-3 text-sm font-black text-slate-900">{meta.label}</h2>
              <p className="mt-1 text-xs text-slate-600">{count} MC disponibili</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm">Vetrina</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Contenuti e immagini integrate</h2>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-500">
            {allMCs.length} MC totali
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {featured.map((mc) => mc && <MCCard key={mc.id} mc={mc} />)}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          {years.map(({ anno, mcs }) => (
            <div key={anno} className="mb-8 last:mb-0 sm:mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black sm:text-2xl">{anno}ª media</h2>
                <Link href={`/anno/${anno}`} className="text-sm font-bold text-emerald-700 hover:text-emerald-900">
                  Vedi anno
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
    </main>
  );
}
