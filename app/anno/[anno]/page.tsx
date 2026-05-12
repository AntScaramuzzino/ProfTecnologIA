import Link from "next/link";
import { notFound } from "next/navigation";
import MCCard from "@/components/MCCard";
import Breadcrumb from "@/components/Breadcrumb";
import SiteFooter from "@/components/SiteFooter";
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
      <Breadcrumb items={[
        { label: "ProfTecnologIA", href: "/" },
        { label: `${yearLabel} media` },
      ]} />

      <header className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700 sm:text-sm">Percorso annuale</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">{yearLabel} media</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
          {mcs.length} micro-competenze organizzate per area tematica, con testi, immagini,
          compiti di realtà e livelli DigComp progressivi.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
          {Object.entries(levelCounts).map(([level, count]) => (
            <span key={level} className={`rounded-full border px-2.5 py-1 text-xs font-bold sm:px-3 sm:text-sm ${levelBadge[level]}`}>
              {count} livello {level}
            </span>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-10 px-4 pb-10 sm:space-y-12 sm:px-6 sm:pb-14">
        {byArea.map(({ area, meta, mcs: areaMcs }) => (
          <section key={area}>
            <div className="mb-4 flex items-center gap-2 sm:mb-5 sm:gap-3">
              <span className="text-2xl sm:text-3xl">{meta.emoji}</span>
              <div className="min-w-0">
                <h2 className="text-xl font-black sm:text-2xl">{meta.label}</h2>
                <p className="text-xs text-slate-500 sm:text-sm">{areaMcs.length} micro-competenze</p>
              </div>
              <Link href={`/area/${area}`} className="ml-auto shrink-0 text-sm font-bold text-emerald-700 hover:text-emerald-900">
                Vedi area
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {areaMcs.map((mc) => <MCCard key={mc.id} mc={mc} />)}
            </div>
          </section>
        ))}
      </div>
      <SiteFooter />
    </main>
  );
}
