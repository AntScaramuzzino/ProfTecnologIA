import Link from "next/link";
import { notFound } from "next/navigation";
import MCCard from "@/components/MCCard";
import { AREA_META, getMCsByAnno } from "@/lib/mc-loader";
import { levelBadge } from "@/lib/ui";

export async function generateStaticParams() {
  return [{ anno: "1" }, { anno: "2" }, { anno: "3" }];
}

interface PageProps {
  params: Promise<{ anno: string }>;
}

export default async function AnnoPage({ params }: PageProps) {
  const { anno } = await params;
  const annoNum = Number.parseInt(anno, 10);
  if (![1, 2, 3].includes(annoNum)) notFound();

  const mcs = getMCsByAnno(annoNum as 1 | 2 | 3);
  const byArea = Object.entries(AREA_META)
    .map(([area, meta]) => ({
      area,
      meta,
      mcs: mcs.filter((mc) => mc.area === area),
    }))
    .filter((group) => group.mcs.length > 0);
  const levelCounts = mcs.reduce<Record<string, number>>((acc, mc) => {
    const level = mc.outputApp.livelloDigComp;
    acc[level] = (acc[level] ?? 0) + 1;
    return acc;
  }, {});
  const yearLabel = ["Prima", "Seconda", "Terza"][annoNum - 1];

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <nav className="border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="font-semibold hover:text-slate-900">ProfTecnologIA</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{yearLabel} media</span>
        </div>
      </nav>

      <header className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Percorso annuale</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">{yearLabel} media</h1>
        <p className="mt-3 max-w-2xl leading-8 text-slate-600">
          {mcs.length} micro-competenze organizzate per area tematica, con testi, immagini,
          compiti di realtà e livelli DigComp progressivi.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {Object.entries(levelCounts).map(([level, count]) => (
            <span key={level} className={`rounded-full border px-3 py-1 text-sm font-bold ${levelBadge[level]}`}>
              {count} livello {level}
            </span>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-12 px-6 pb-14">
        {byArea.map(({ area, meta, mcs: areaMcs }) => (
          <section key={area}>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-3xl">{meta.emoji}</span>
              <div>
                <h2 className="text-2xl font-black">{meta.label}</h2>
                <p className="text-sm text-slate-500">{areaMcs.length} micro-competenze</p>
              </div>
              <Link href={`/area/${area}`} className="ml-auto text-sm font-bold text-emerald-700 hover:text-emerald-900">
                Vedi area
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {areaMcs.map((mc) => <MCCard key={mc.id} mc={mc} />)}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
