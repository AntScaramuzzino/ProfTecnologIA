import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import AtlanteIndice from "@/components/atlante/AtlanteIndice";
import { ATLANTE } from "@/lib/atlante";
import { AREA_META } from "@/lib/mc-loader";

export const metadata: Metadata = {
  title: "Atlante «Com'è fatto» — Book ProfTecnologIA",
  description:
    "Tavole isometriche interattive, una per oggetto: si guarda dentro, si prova, si stampa. Con poster, tavola muta e tavola tecnica in PDF A4.",
};

export default function AtlantePage() {
  const aree = Object.keys(AREA_META)
    .filter((codice) => ATLANTE.some((t) => t.area === codice))
    .map((codice) => ({ codice, nome: AREA_META[codice].label }));

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb
        items={[
          { label: "Book ProfTecnologIA", href: "/" },
          { label: "Laboratori", href: "/laboratori" },
          { label: "Atlante «Com'è fatto»", color: "#0D3C78" },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Atlante «Com&apos;è fatto»</h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Un oggetto per tavola, disegnato in assonometria con tutte le sue parti numerate. Lo guardi dentro e lo fai
            funzionare con i comandi sotto la figura. Ogni tavola si stampa in A4: poster,
            tavola muta per la verifica, tavola tecnica e scheda «Come funziona».
          </p>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Le trovi anche nella scheda OSSERVA della micro-competenza e nella pagina{" "}
            <Link href="/laboratori" className="font-bold text-brand-600 underline underline-offset-4">
              Laboratori
            </Link>
            .
          </p>
        </div>

        <AtlanteIndice tavole={ATLANTE} aree={aree} />
      </div>
    </div>
  );
}
