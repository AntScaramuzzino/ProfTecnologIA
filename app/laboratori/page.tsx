import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { LABORATORI, AREA_COLOR, labSrc, escapeSrc, getEscapeRoom } from "@/lib/laboratori";

export const metadata: Metadata = {
  title: "Laboratori interattivi — Book ProfTecnologIA",
  description:
    "Laboratori interattivi collegati alle micro-competenze: simulatori, smistatori, ispettori di artefatti, tavoli grafici 3D e programmatori, su tre livelli.",
};

const GEOGEBRA = [
  {
    href: "/laboratori/perpendicolare",
    titolo: "Perpendicolare a una retta in un punto",
    mcId: "MC-DIS-1-01",
    descrizione: "Costruzione animata con righello e compasso, passo per passo.",
  },
  {
    href: "/laboratori/bisettrice-angolo",
    titolo: "Bisettrice di un angolo",
    mcId: "MC-DIS-1-01",
    descrizione: "Costruzione animata con righello e compasso, passo per passo.",
  },
];

export default function LaboratoriPage() {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb
        items={[
          { label: "Book ProfTecnologIA", href: "/" },
          { label: "Laboratori", color: "#00695C" },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 max-w-3xl">
          <p className="font-mono text-xs font-black uppercase tracking-widest text-teal-800">Zona SPERIMENTA</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Laboratori interattivi</h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Ogni laboratorio porta una micro-competenza dal libro allo schermo, su tre livelli: base, intermedio e
            avanzato. Accanto c'è un'escape room: cinque lucchetti da aprire con i contenuti della MC. Li trovi
            anche nella scheda SPERIMENTA della MC. Con «LIM» si aprono a schermo intero, con testo e pulsanti grandi
            per la lavagna interattiva.
          </p>
        </div>

        {[1, 2, 3].map((cl) => (
          <section key={cl} className="mb-10" aria-labelledby={`classe-${cl}`}>
            <h2 id={`classe-${cl}`} className="mb-4 text-2xl font-black tracking-tight text-slate-950">
              Classe {cl}ª <span className="text-base font-bold text-slate-500">· {LABORATORI.filter((l) => l.classe === cl).length} laboratori</span>
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {LABORATORI.filter((l) => l.classe === cl).map((l) => {
                const color = AREA_COLOR[l.area] ?? "#00695C";
                return (
                  <li
                    key={l.mcId}
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    style={{ borderTopColor: color, borderTopWidth: 4 }}
                  >
                    <p className="font-mono text-xs font-black uppercase tracking-widest" style={{ color }}>
                      {l.mcId} · {l.archetipo}
                    </p>
                    <h3 className="text-xl font-black tracking-tight text-slate-950">{l.titolo}</h3>
                    <p className="text-sm leading-6 text-slate-700">{l.descrizione}</p>
                    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
                      <Link href={`/mc/${l.mcId}`} className="text-teal-800 underline underline-offset-4">
                        Apri nella MC →
                      </Link>
                      <a href={`${labSrc(l.mcId)}?lim=1`} target="_blank" rel="noopener noreferrer" className="text-slate-600 underline underline-offset-4">
                        Laboratorio alla LIM ↗
                      </a>
                    </div>
                    {getEscapeRoom(l.mcId) && (
                      <p className="border-t border-slate-100 pt-3 text-sm text-slate-700">
                        <span className="font-bold text-orange-800">Escape room:</span> {getEscapeRoom(l.mcId)!.titolo} ·{" "}
                        <a href={`${escapeSrc(l.mcId)}?lim=1`} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-600 underline underline-offset-4">
                          alla LIM ↗
                        </a>
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <h2 className="mt-12 text-xl font-black tracking-tight text-slate-950">Costruzioni GeoGebra</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {GEOGEBRA.map((g) => (
            <li key={g.href} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-900">{g.mcId}</p>
              <h3 className="mt-1 text-lg font-black text-slate-950">{g.titolo}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-700">{g.descrizione}</p>
              <Link href={g.href} className="mt-3 inline-block text-sm font-bold text-blue-800 underline underline-offset-4">
                Apri →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
