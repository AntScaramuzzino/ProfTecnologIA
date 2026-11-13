import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { LABORATORI, AREA_COLOR, labSrc, escapeSrc, getEscapeRoom } from "@/lib/laboratori";
import { ESPLORAZIONI, esplorazioneSrc, esplorazioneAnteprima } from "@/lib/esplorazioni";
import { COSTRUZIONI_GEOGEBRA, MC_COSTRUZIONI, hrefCostruzione } from "@/lib/geogebra-costruzioni";

export const metadata: Metadata = {
  title: "Laboratori interattivi — Book ProfTecnologIA",
  description:
    "Laboratori interattivi collegati alle micro-competenze: simulatori, smistatori, ispettori di artefatti, tavoli grafici 3D e programmatori, su tre livelli.",
};

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
          <p className="mt-3 text-base leading-7 text-slate-700">
            In fondo alla pagina ci sono anche le{" "}
            <a href="#esplorazioni" className="font-bold text-teal-800 underline underline-offset-4">
              esplorazioni immersive
            </a>
            : impianti da guardare dentro, un dettaglio dopo l'altro.
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

        <section className="mt-12 scroll-mt-28" id="esplorazioni" aria-labelledby="esplorazioni-titolo">
          <h2 id="esplorazioni-titolo" className="text-2xl font-black tracking-tight text-slate-950">
            Esplorazioni immersive{" "}
            <span className="text-base font-bold text-slate-500">· {ESPLORAZIONI.length} esplorazioni</span>
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Si parte da una veduta d'insieme, si tocca un punto e si entra nel dettaglio, fino a tre livelli. Ogni
            scena ha un testo breve e i nomi delle parti. Si aprono a schermo intero, quindi vanno bene anche alla LIM.
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {ESPLORAZIONI.map((e) => {
              const color = AREA_COLOR[e.area] ?? "#00695C";
              return (
                <li
                  key={e.slug}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  style={{ borderTopColor: color, borderTopWidth: 4 }}
                >
                  {/* L'immagine è un secondo accesso alla stessa pagina: il link con il nome è sotto */}
                  <a href={esplorazioneSrc(e.slug)} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                    <img
                      src={esplorazioneAnteprima(e.slug)}
                      alt=""
                      width={640}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      className="aspect-video w-full object-cover"
                    />
                  </a>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <p className="font-mono text-xs font-black uppercase tracking-widest" style={{ color }}>
                      {e.mcId} · Esplorazione · Classe {e.classe}ª
                    </p>
                    <h3 className="text-xl font-black tracking-tight text-slate-950">{e.titolo}</h3>
                    <p className="text-sm leading-6 text-slate-700">
                      {e.descrizione} {e.scene} scene.
                    </p>
                    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
                      <a href={esplorazioneSrc(e.slug)} target="_blank" rel="noopener noreferrer" className="text-teal-800 underline underline-offset-4">
                        Apri l'esplorazione ↗
                      </a>
                      <Link href={`/mc/${e.mcId}#osserva`} className="text-slate-600 underline underline-offset-4">
                        MC collegata →
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <h2 id="costruzioni-geogebra" className="mt-12 scroll-mt-24 text-xl font-black tracking-tight text-slate-950">
          Costruzioni GeoGebra <span className="text-base font-bold text-slate-500">· {COSTRUZIONI_GEOGEBRA.length} tavole</span>
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
          Tavole animate con righello e compasso, un passaggio alla volta, collegate a {MC_COSTRUZIONI}. Ogni tavola
          spiega perché la costruzione funziona e si può scaricare come file .ggb.
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COSTRUZIONI_GEOGEBRA.map((g) => (
            <li key={g.slug} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-900">Costruzione {g.numero}</p>
              <h3 className="mt-1 text-lg font-black text-slate-950">{g.titolo}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-700">{g.descrizione}</p>
              <Link href={hrefCostruzione(g)} className="mt-auto inline-block pt-3 text-sm font-bold text-blue-800 underline underline-offset-4">
                Apri →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
