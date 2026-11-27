import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileDown } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import TavolaAtlanteViewer from "@/components/atlante/TavolaAtlanteViewer";
import TavolaAtlanteCard from "@/components/atlante/TavolaAtlanteCard";
import {
  ATLANTE,
  STAMPE_ATLANTE,
  atlantePdf,
  atlantePoster,
  getTavolaAtlante,
  getTavoleAtlante,
} from "@/lib/atlante";
import { AREA_COLOR } from "@/lib/laboratori";
import { AREA_META, getMCById } from "@/lib/mc-loader";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ATLANTE.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = getTavolaAtlante(slug);
  if (!t) return {};
  return {
    title: `${t.titolo} — Atlante «Com'è fatto»`,
    description: `${t.sottotitolo}. ${t.descrizione}`,
  };
}

/** Peso del PDF in MB, letto da public/ al momento della build */
function pesoMB(slug: string, suffisso: string): string | null {
  try {
    const byte = fs.statSync(path.join(process.cwd(), "public", "embeds", "atlante", slug, `${slug}-${suffisso}.pdf`)).size;
    return (byte / 1_000_000).toLocaleString("it-IT", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  } catch {
    return null;
  }
}

export default async function TavolaAtlantePage({ params }: Props) {
  const { slug } = await params;
  const t = getTavolaAtlante(slug);
  if (!t) notFound();

  const mc = getMCById(t.mcId);
  const color = AREA_COLOR[t.area] ?? "#0D3C78";
  const areaNome = AREA_META[t.area]?.label ?? t.area;
  const altre = getTavoleAtlante(t.mcId).filter((x) => x.slug !== t.slug);

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb
        items={[
          { label: "Book ProfTecnologIA", href: "/" },
          { label: "Atlante «Com'è fatto»", href: "/atlante" },
          { label: t.titolo, area: t.area, color },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 max-w-3xl">
          <p className="font-mono text-xs font-bold" style={{ color }}>
            {t.codice} · {areaNome} · Classe {t.classe}ª
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{t.titolo}</h1>
          <p className="mt-3 text-lg font-bold leading-7 text-slate-800 sm:text-xl">{t.sottotitolo}</p>
          <p className="mt-3 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">{t.descrizione}</p>
        </div>

        <TavolaAtlanteViewer tavola={t} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section aria-labelledby="stampe-titolo" className="min-w-0">
            <h2 id="stampe-titolo" className="text-2xl font-black tracking-tight text-slate-950">
              Da stampare in A4
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {STAMPE_ATLANTE.map((s) => {
                const peso = pesoMB(t.slug, s.suffisso);
                return (
                  <li key={s.suffisso}>
                    <a
                      href={atlantePdf(t.slug, s.suffisso)}
                      download
                      className="flex h-full min-h-11 items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-500 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                    >
                      <FileDown size={22} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-600" />
                      <span className="min-w-0">
                        <span className="block font-bold text-slate-950">
                          {s.nome} <span className="font-normal text-slate-600">· PDF{peso ? `, ${peso} MB` : ""}</span>
                        </span>
                        <span className="mt-0.5 block text-sm leading-6 text-slate-700">{s.testo}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          <aside aria-label="Poster della tavola" className="hidden lg:block">
            <a href={atlantePdf(t.slug, "poster-a4")} download tabIndex={-1} aria-hidden="true" className="block">
              <img
                src={atlantePoster(t.slug)}
                alt=""
                width={636}
                height={900}
                loading="lazy"
                decoding="async"
                className="w-full rounded-lg border border-slate-200 bg-white shadow-sm"
              />
            </a>
          </aside>
        </div>

        <section aria-labelledby="mc-titolo" className="mt-10 rounded-xl border border-brand-200 bg-brand-50 p-5">
          <h2 id="mc-titolo" className="text-lg font-black text-slate-950">
            La micro-competenza
          </h2>
          <p className="mt-1 text-base leading-7 text-slate-800">
            <Link href={`/mc/${t.mcId}#osserva`} className="font-bold text-brand-700 underline underline-offset-4">
              {t.mcId}
              {mc ? ` · ${mc.titolo}` : ""} →
            </Link>
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">La tavola è anche nella scheda OSSERVA della MC.</p>
        </section>

        {altre.length > 0 && (
          <section aria-labelledby="altre-titolo" className="mt-10">
            <h2 id="altre-titolo" className="text-2xl font-black tracking-tight text-slate-950">
              Sulla stessa micro-competenza
            </h2>
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {altre.map((x) => (
                <li key={x.slug}>
                  <TavolaAtlanteCard tavola={x} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10">
          <Link href="/atlante" className="text-base font-bold text-brand-600 underline underline-offset-4">
            ← Tutte le tavole dell&apos;Atlante
          </Link>
        </p>
      </div>
    </div>
  );
}
