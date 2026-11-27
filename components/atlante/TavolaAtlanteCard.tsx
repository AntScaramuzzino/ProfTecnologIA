import Link from "next/link";
import { atlanteCopertina, hrefTavolaAtlante, type TavolaAtlante } from "@/lib/atlante";
import { AREA_COLOR } from "@/lib/laboratori";

/** Scheda di una tavola dell'Atlante: figura, titolo, due righe e «Apri la tavola» (indice /atlante/, OSSERVA, Laboratori) */
export default function TavolaAtlanteCard({
  tavola,
  etichetta,
  headingLevel = 3,
}: {
  tavola: TavolaAtlante;
  /** Riga sopra il titolo; di norma codice della tavola e MC */
  etichetta?: string;
  headingLevel?: 2 | 3;
}) {
  const color = AREA_COLOR[tavola.area] ?? "#0D3C78";
  const href = hrefTavolaAtlante(tavola.slug);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      style={{ borderTopColor: color, borderTopWidth: 4 }}
    >
      {/* L'immagine è un secondo accesso alla stessa pagina: il link con il nome è sotto */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block overflow-hidden border-b border-slate-100 bg-[#fbfbfa]">
        <img
          src={atlanteCopertina(tavola.slug)}
          alt=""
          width={960}
          height={540}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand-700 px-2.5 py-1 text-xs font-bold text-white shadow">
          Atlante «Com&apos;è fatto»
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-mono text-xs font-bold" style={{ color }}>
          {etichetta ?? `${tavola.codice} · ${tavola.mcId}`}
        </p>
        <Heading className="text-lg font-black leading-snug tracking-tight text-slate-950">
          <Link href={href} className="hover:underline hover:underline-offset-4">
            {tavola.titolo}
          </Link>
        </Heading>
        <p className="line-clamp-3 text-sm leading-6 text-slate-700">{tavola.descrizione}</p>
        <div className="mt-auto pt-2">
          <Link
            href={href}
            className="inline-flex min-h-11 items-center rounded-lg bg-brand-700 px-3.5 py-2 text-sm font-bold text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            aria-label={`Apri la tavola «${tavola.titolo}»`}
          >
            Apri la tavola →
          </Link>
        </div>
      </div>
    </article>
  );
}
