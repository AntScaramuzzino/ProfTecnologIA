import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import SiteFooter from "@/components/SiteFooter";
import { VERSIONI, VERSIONE_ATTUALE } from "@/lib/versioni";

export const metadata: Metadata = {
  alternates: { canonical: "/novita/" },
  title: "Novità — Book ProfTecnologIA",
  description: "Che cosa è cambiato in ogni versione del Book ProfTecnologIA, dalla prima edizione online a oggi.",
};

/** Testo con le parti tra **doppi asterischi** in grassetto */
function TestoNovita({ testo }: { testo: string }) {
  const parti = testo.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parti.map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i} className="font-black text-slate-900">{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export default function NovitaPage() {
  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <Breadcrumb items={[{ label: "Book ProfTecnologIA", href: "/" }, { label: "Novità" }]} />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Novità</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Il libro cresce: qui trovi che cosa è cambiato in ogni versione, dalla prima edizione online a oggi.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-300 bg-white px-3 py-1 text-sm font-bold text-brand-800">
            Versione attuale
            <span className="font-mono">v{VERSIONE_ATTUALE}</span>
          </p>
        </header>

        <ol className="relative border-l-2 border-brand-200 pl-6 sm:pl-8">
          {VERSIONI.map((v, idx) => {
            const attuale = idx === 0;
            return (
              <li key={v.numero} id={`v${v.numero}`} className="relative mb-10 scroll-mt-24 last:mb-0">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-2 sm:-left-[41px] ${
                    attuale ? "border-brand-700 bg-brand-600" : "border-brand-300 bg-white"
                  }`}
                />
                <article
                  className={`rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${
                    attuale ? "border-brand-300" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-brand-300 px-2 py-0.5 font-mono text-xs font-bold text-brand-700">
                      v{v.numero}
                    </span>
                    {attuale && (
                      <span className="rounded-full bg-brand-700 px-2 py-0.5 text-xs font-bold text-white">
                        Versione attuale
                      </span>
                    )}
                    <span className="text-sm text-slate-500">{v.date}</span>
                  </div>
                  <h2 className="mt-2 text-xl font-black leading-snug text-slate-950 sm:text-2xl">{v.nome}</h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-slate-700 marker:text-brand-600">
                    {v.novita.map((n, i) => (
                      <li key={i}>
                        <TestoNovita testo={n.testo} />
                        {n.href && (
                          <>
                            {" "}
                            <Link
                              href={n.href}
                              className="whitespace-nowrap font-bold text-brand-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                            >
                              Vai <span aria-hidden="true">→</span>
                            </Link>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      <SiteFooter />
    </main>
  );
}
