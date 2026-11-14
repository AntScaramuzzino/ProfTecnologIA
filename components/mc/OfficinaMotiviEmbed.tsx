import Link from "next/link";
import { COSTRUZIONI_GEOGEBRA, hrefCostruzione } from "@/lib/geogebra-costruzioni";
import { OFFICINA_MOTIVI, officinaSrc } from "@/lib/officina-motivi";

/**
 * Officina dei motivi modulari dentro la scheda SPERIMENTA di MC-DIS-1-01:
 * il generatore in un iframe e, sotto, i link alle tavole GeoGebra dei motivi (categoria "moti" del registro).
 */
export default function OfficinaMotiviEmbed({ className = "" }: { className?: string }) {
  const src = officinaSrc();
  const tavole = COSTRUZIONI_GEOGEBRA.filter((c) => c.categoria === "moti");
  return (
    <section className={className} aria-labelledby="officina-motivi-titolo">
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50/60 p-4">
        {/* Titolo e descrizione sono già nell'intestazione della pagina interna: qui restano per i lettori di schermo. */}
        <h2 id="officina-motivi-titolo" className="sr-only">
          {OFFICINA_MOTIVI.titolo}
        </h2>
        <p className="text-sm leading-6 text-slate-800">
          <strong className="text-slate-950">Progetta il tuo motivo.</strong> Scegli un tipo, regolalo, scegli il reticolo e
          segui i passi per ridisegnarlo sul foglio.
        </p>
        <div className="mb-2 mt-1 flex justify-end">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-800 underline underline-offset-4"
          >
            Apri a schermo intero (LIM) ↗
          </a>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <iframe
            src={src}
            title={OFFICINA_MOTIVI.titolo}
            className="block h-[860px] w-full border-0"
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
          />
        </div>
        {tavole.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-black text-slate-950">
              Guarda la costruzione passo per passo · {tavole.length} tavole GeoGebra
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {tavole.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={hrefCostruzione(c)}
                    className="inline-block rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold text-blue-900 hover:border-blue-700"
                  >
                    {c.numero} · {c.titolo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
