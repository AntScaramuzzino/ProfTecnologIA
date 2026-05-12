"use client";

/**
 * ProfessioneCard — Professione del Futuro 2030
 * Usa <img> plain (stessa strategia di MCVisual) per compatibilità GitHub Pages / static export.
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export interface ProfessioneFutura {
  titolo: string;
  orizzonte?: string;
  descrizione_breve?: string;
  competenze_chiave?: string[];
}

interface ProfessioneCardProps {
  professione: ProfessioneFutura;
  mcId: string;
  areaHex?: string;
}

export default function ProfessioneCard({ professione, mcId, areaHex }: ProfessioneCardProps) {
  const imgSrc = `${BASE_PATH}/assets/visual/${mcId}/${mcId}_img4-professione.png`;

  return (
    <div
      className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      style={{ borderTopColor: areaHex ?? "#10B981", borderTopWidth: 3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 bg-slate-50 px-5 py-3">
        <span className="text-base">🚀</span>
        <span className="text-xs font-black uppercase tracking-widest text-slate-500">
          Professione del Futuro
        </span>
        {professione.orizzonte && (
          <span
            className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-black text-white"
            style={{ backgroundColor: areaHex ?? "#10B981" }}
          >
            {professione.orizzonte}
          </span>
        )}
      </div>

      {/* Immagine + contenuto */}
      <div className="flex flex-col sm:flex-row">
        {/* Immagine */}
        <div className="h-56 w-full shrink-0 overflow-hidden sm:h-auto sm:w-64 lg:w-72">
          <img
            src={imgSrc}
            alt={`Professione del futuro: ${professione.titolo}`}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.display = "none";
            }}
          />
        </div>

        {/* Testo */}
        <div className="flex flex-col justify-center gap-3 p-5 sm:gap-4">
          <h3 className="text-lg font-black leading-tight text-slate-950 sm:text-xl">
            {professione.titolo}
          </h3>

          {professione.descrizione_breve && (
            <p className="text-sm leading-6 text-slate-600">
              {professione.descrizione_breve}
            </p>
          )}

          {professione.competenze_chiave && professione.competenze_chiave.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
                Competenze chiave
              </p>
              <div className="flex flex-wrap gap-1.5">
                {professione.competenze_chiave.map((comp) => (
                  <span
                    key={comp}
                    className="rounded-full border px-2.5 py-0.5 text-xs font-semibold text-slate-700"
                    style={{
                      borderColor: areaHex ? `${areaHex}55` : "#d1d5db",
                      backgroundColor: areaHex ? `${areaHex}0D` : "#f8fafc",
                    }}
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
