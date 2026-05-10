import Link from "next/link";
import { notFound } from "next/navigation";
import MCCard from "@/components/MCCard";
import { AREA_META, getAllMCs, getMCsByArea } from "@/lib/mc-loader";
import { areaAccent, cx, levelBadge } from "@/lib/ui";

export async function generateStaticParams() {
  return Object.keys(AREA_META).map((area) => ({ area }));
}

interface PageProps {
  params: Promise<{ area: string }>;
}

export default async function AreaPage({ params }: PageProps) {
  const { area } = await params;
  const areaUpper = area.toUpperCase();
  if (!AREA_META[areaUpper]) notFound();

  const mcs = getMCsByArea(areaUpper);
  if (mcs.length === 0) notFound();

  const meta = AREA_META[areaUpper];
  const byAnno = [1, 2, 3]
    .map((anno) => ({ anno, mcs: mcs.filter((mc) => mc.anno === anno) }))
    .filter((group) => group.mcs.length > 0);
  const levels = [...new Set(mcs.map((mc) => mc.outputApp.livelloDigComp))];
  const otherAreas = Object.entries(AREA_META)
    .filter(([code]) => code !== areaUpper && getAllMCs().some((mc) => mc.area === code));

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <nav className="border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="font-semibold hover:text-slate-900">ProfTecnologIA</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{meta.label}</span>
        </div>
      </nav>

      <header className={cx("border-b bg-gradient-to-br", areaAccent[areaUpper])}>
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-5xl">{meta.emoji}</div>
              <p className="mt-4 font-mono text-sm font-black text-slate-500">{areaUpper}</p>
              <h1 className="mt-1 text-4xl font-black tracking-tight">{meta.label}</h1>
              <p className="mt-3 max-w-2xl leading-8 text-slate-600">
                {mcs.length} micro-competenze con progressione verticale, visuali generate e attività autentiche.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <span key={level} className={`rounded-full border px-3 py-1 text-sm font-bold ${levelBadge[level]}`}>
                  DigComp {level}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-10">
        {byAnno.map(({ anno, mcs: yearMcs }) => (
          <section key={anno}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">{anno}ª media</h2>
                <p className="text-sm text-slate-500">{yearMcs.length} MC in questa area</p>
              </div>
              <Link href={`/anno/${anno}`} className="text-sm font-bold text-emerald-700 hover:text-emerald-900">
                Vedi anno
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {yearMcs.map((mc) => <MCCard key={mc.id} mc={mc} />)}
            </div>
          </section>
        ))}

        <section className="border-t border-slate-200 pt-8">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">Altre aree</p>
          <div className="flex flex-wrap gap-2">
            {otherAreas.map(([code, item]) => (
              <Link key={code} href={`/area/${code}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-400">
                {item.emoji} {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
