import Link from "next/link";
import { AREA_META, type MC } from "@/lib/mc-loader";
import { getPrimaryVisual } from "@/lib/content-loader";
import { areaAccent, cx, levelBadge } from "@/lib/ui";

export default function MCCard({ mc }: { mc: MC }) {
  const area = AREA_META[mc.area];
  const visual = getPrimaryVisual(mc.id);
  const level = mc.outputApp.livelloDigComp;

  return (
    <Link
      href={`/mc/${mc.id}`}
      className="group grid overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
    >
      {/* Immagine — aspect 16/9 fisso per coerenza tra larghezze */}
      <div className={cx("relative aspect-video overflow-hidden bg-gradient-to-br", areaAccent[mc.area] ?? "from-slate-100 to-white")}>
        {visual ? (
          <img src={visual.src} alt="" className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">{area?.emoji ?? "📘"}</div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {area?.emoji} {mc.area}
        </div>
      </div>

      {/* Contenuto testuale */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-slate-400">{mc.id}</span>
          <span className={cx("rounded-full border px-2 py-0.5 text-xs font-semibold", levelBadge[level])}>
            {level}
          </span>
        </div>
        <h3 className="text-sm font-bold leading-snug text-slate-900 group-hover:text-emerald-800">
          {mc.titolo}
        </h3>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">
          {mc.descrizione}
        </p>
      </div>
    </Link>
  );
}
