import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { LABORATORI, AREA_COLOR, labSrc, escapeSrc, getEscapeRoom, labCover } from "@/lib/laboratori";
import { ESPLORAZIONI, esplorazioneSrc, esplorazioneAnteprima } from "@/lib/esplorazioni";
import { COSTRUZIONI_GEOGEBRA, MC_COSTRUZIONI } from "@/lib/geogebra-costruzioni";
import { MC_PROIEZIONI, TAVOLE_PO_PRONTE } from "@/lib/geogebra-proiezioni";
import { MC_OFFICINA, OFFICINA_MOTIVI, officinaSrc } from "@/lib/officina-motivi";

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
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
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

        <nav aria-label="Sezioni della pagina" className="sticky top-[57px] z-30 -mx-4 mb-8 flex gap-2 overflow-x-auto bg-[#f7f8f5]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {[
            ["#classe-1", "Classe 1ª"],
            ["#classe-2", "Classe 2ª"],
            ["#classe-3", "Classe 3ª"],
            ["#esplorazioni", "Esplorazioni"],
            ["#altri-strumenti", "Disegno e GeoGebra"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-bold text-slate-800 hover:border-teal-700 hover:text-teal-800"
            >
              {label}
            </a>
          ))}
        </nav>

        {[1, 2, 3].map((cl) => (
          <section key={cl} id={`classe-${cl}`} className="mb-12 scroll-mt-32" aria-labelledby={`classe-${cl}-titolo`}>
            <h2 id={`classe-${cl}-titolo`} className="mb-4 text-2xl font-black tracking-tight text-slate-950">
              Classe {cl}ª <span className="text-base font-bold text-slate-600">· {LABORATORI.filter((l) => l.classe === cl).length} laboratori</span>
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {LABORATORI.filter((l) => l.classe === cl).map((l) => {
                const color = AREA_COLOR[l.area] ?? "#00695C";
                const cover = labCover(l.mcId);
                const esc = getEscapeRoom(l.mcId);
                return (
                  <li
                    key={l.mcId}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    style={{ borderTopColor: color, borderTopWidth: 4 }}
                  >
                    {/* L'immagine è un secondo accesso alla stessa pagina: il link con il nome è sotto */}
                    <Link href={`/mc/${l.mcId}#sperimenta`} tabIndex={-1} aria-hidden="true" className="relative block overflow-hidden bg-slate-100">
                      {cover ? (
                        <img
                          src={cover.src}
                          alt=""
                          width={640}
                          height={360}
                          loading="lazy"
                          decoding="async"
                          className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="aspect-video w-full" style={{ background: `${color}22` }} />
                      )}
                      <span
                        className="absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[11px] font-black uppercase tracking-widest text-white shadow"
                        style={{ background: color }}
                      >
                        {l.archetipo}
                      </span>
                    </Link>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="font-mono text-xs font-black uppercase tracking-widest" style={{ color }}>
                        {l.mcId}
                      </p>
                      <h3 className="text-lg font-black leading-snug tracking-tight text-slate-950">
                        <Link href={`/mc/${l.mcId}#sperimenta`} className="hover:underline hover:underline-offset-4">
                          {l.titolo}
                        </Link>
                      </h3>
                      <p className="line-clamp-3 text-sm leading-6 text-slate-700">{l.descrizione}</p>
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-2 text-[13px] font-bold">
                        <Link
                          href={`/mc/${l.mcId}#sperimenta`}
                          className="rounded-lg px-2.5 py-1.5 text-white"
                          style={{ background: color }}
                          aria-label={`${l.titolo}: apri il laboratorio nella MC`}
                        >
                          Apri nella MC →
                        </Link>
                        <a
                          href={`${labSrc(l.mcId)}?lim=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border px-2.5 py-1.5"
                          style={{ borderColor: `${color}66`, color }}
                          aria-label={`${l.titolo}: laboratorio alla LIM, si apre in una nuova scheda`}
                        >
                          LIM ↗
                        </a>
                        {esc && (
                          <a
                            href={`${escapeSrc(l.mcId)}?lim=1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-orange-300 bg-orange-50 px-2.5 py-1.5 text-orange-900"
                            title={esc.titolo}
                            aria-label={`Escape room «${esc.titolo}» alla LIM, si apre in una nuova scheda`}
                          >
                            Escape room ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <section className="mt-12 scroll-mt-32" id="esplorazioni" aria-labelledby="esplorazioni-titolo">
          <h2 id="esplorazioni-titolo" className="text-2xl font-black tracking-tight text-slate-950">
            Esplorazioni immersive{" "}
            <span className="text-base font-bold text-slate-600">· {ESPLORAZIONI.length} esplorazioni</span>
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Si parte da una veduta d'insieme, si tocca un punto e si entra nel dettaglio, fino a tre livelli. Ogni
            scena ha un testo breve e i nomi delle parti. Si aprono a schermo intero, quindi vanno bene anche alla LIM.
          </p>
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <p className="font-mono text-xs font-black uppercase tracking-widest" style={{ color }}>
                      {e.mcId} · Esplorazione · Classe {e.classe}ª
                    </p>
                    <h3 className="text-lg font-black leading-snug tracking-tight text-slate-950">{e.titolo}</h3>
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

        <section id="altri-strumenti" className="mt-12 scroll-mt-32" aria-labelledby="altri-strumenti-titolo">
          <h2 id="altri-strumenti-titolo" className="mb-4 text-2xl font-black tracking-tight text-slate-950">Disegno e GeoGebra</h2>
          <div className="grid gap-5 lg:grid-cols-3">
        <div id="costruzioni-geogebra" className="scroll-mt-32 flex flex-col rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-xl font-black tracking-tight text-slate-950">
            Costruzioni geometriche <span className="text-base font-bold text-slate-600">· {COSTRUZIONI_GEOGEBRA.length} tavole GeoGebra</span>
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-800">
            Tavole animate con righello e compasso, un passaggio alla volta, collegate a {MC_COSTRUZIONI}: perpendicolari
            e parallele, poligoni, triangoli, ovali e spirali, motivi modulari. Hanno una pagina tutta loro.
          </p>
          <Link href="/costruzioni-geometriche" className="mt-auto pt-3 inline-block text-sm font-black text-blue-800 underline underline-offset-4">
            Apri le costruzioni geometriche →
          </Link>
        </div>

        <div id="officina-motivi" className="scroll-mt-32 flex flex-col rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-xl font-black tracking-tight text-slate-950">
            {OFFICINA_MOTIVI.titolo}{" "}
            <span className="text-base font-bold text-slate-600">
              · {OFFICINA_MOTIVI.famiglie} tipi di motivo · 2 modi per disegnare tu · {COSTRUZIONI_GEOGEBRA.filter((c) => c.categoria === "moti").length} tavole GeoGebra
            </span>
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-800">
            {OFFICINA_MOTIVI.descrizione} Collegata a {MC_OFFICINA}.
          </p>
          <div className="mt-auto pt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-black">
            <a href={officinaSrc()} target="_blank" rel="noopener noreferrer" className="text-blue-800 underline underline-offset-4">
              Apri l’officina (anche alla LIM) ↗
            </a>
            <Link href={`/mc/${MC_OFFICINA}#sperimenta`} className="text-slate-700 underline underline-offset-4">
              Apri nella MC →
            </Link>
            <Link href="/costruzioni-geometriche" className="text-slate-700 underline underline-offset-4">
              Tavole GeoGebra dei motivi →
            </Link>
          </div>
        </div>

        <div id="proiezioni-ortogonali" className="scroll-mt-32 flex flex-col rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-xl font-black tracking-tight text-slate-950">
            Proiezioni ortogonali <span className="text-base font-bold text-slate-600">· {TAVOLE_PO_PRONTE.length} tavole guidate</span>
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-800">
            Il proiettore ortogonale mostra un solido in tre dimensioni e le sue tre viste dal vivo; le tavole GeoGebra
            costruiscono le viste sul foglio, un passaggio alla volta. Collegate a {MC_PROIEZIONI}. Hanno una pagina
            tutta loro.
          </p>
          <Link href="/proiezioni-ortogonali" className="mt-auto pt-3 inline-block text-sm font-black text-blue-800 underline underline-offset-4">
            Apri le proiezioni ortogonali →
          </Link>
        </div>
          </div>
        </section>
      </div>
    </div>
  );
}
