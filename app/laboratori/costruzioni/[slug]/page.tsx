import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import GeoGebraConstructionEmbed from "@/components/mc/GeoGebraConstructionEmbed";
import {
  COSTRUZIONI_GEOGEBRA,
  MC_COSTRUZIONI,
  getCostruzione,
  hrefCostruzione,
} from "@/lib/geogebra-costruzioni";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return COSTRUZIONI_GEOGEBRA.filter((c) => !c.href).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCostruzione(slug);
  if (!c) return {};
  return {
    title: `${c.titolo} — Laboratorio GeoGebra`,
    description: `Tavola animata con righello e compasso, passo per passo: ${c.titolo.toLowerCase()}.`,
  };
}

export default async function CostruzionePage({ params }: Props) {
  const { slug } = await params;
  const c = getCostruzione(slug);
  if (!c) notFound();

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const limSrc = `${basePath}/embeds/geogebra/costruzioni-base/index.html?activity=${c.slug}&lim=1`;
  const indice = COSTRUZIONI_GEOGEBRA.findIndex((x) => x.slug === c.slug);
  const precedente = COSTRUZIONI_GEOGEBRA[indice - 1];
  const successiva = COSTRUZIONI_GEOGEBRA[indice + 1];

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb
        items={[
          { label: "Book ProfTecnologIA", href: "/" },
          { label: MC_COSTRUZIONI, href: `/mc/${MC_COSTRUZIONI}`, emoji: "📐", color: "#1A3A7A" },
          { label: "Laboratorio GeoGebra", color: "#1A3A7A" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-7 max-w-3xl">
          <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-800">
            {MC_COSTRUZIONI} · Classe 1ª · Costruzione {c.numero}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{c.titolo}</h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">{c.intro}</p>
          <a
            href={limSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-bold text-slate-600 underline underline-offset-4"
          >
            Apri alla LIM ↗
          </a>
        </div>

        <GeoGebraConstructionEmbed
          activity={c.slug}
          title={c.titolo}
          iframeTitle={`Animazione GeoGebra: ${c.titolo.toLowerCase()}`}
        />

        <div className="mt-7 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
          <p className="font-black">Prova tu</p>
          <p className="mt-1">{c.provaTu}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-black text-blue-800">
            {precedente && (
              <Link href={hrefCostruzione(precedente)} className="underline underline-offset-4">
                ← {precedente.numero}. {precedente.titolo}
              </Link>
            )}
            {successiva && (
              <Link href={hrefCostruzione(successiva)} className="underline underline-offset-4">
                {successiva.numero}. {successiva.titolo} →
              </Link>
            )}
            <Link href="/laboratori#costruzioni-geogebra" className="underline underline-offset-4">
              Tutte le tavole
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
