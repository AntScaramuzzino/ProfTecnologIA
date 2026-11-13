import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import TavolaProiezioneClient from "@/components/mc/TavolaProiezioneClient";
import {
  MC_PROIEZIONI,
  TAVOLE_PO_PRONTE,
  activityTavolaPO,
  costruzioneSrc,
  getTavolaPO,
  hrefTavolaPO,
  proiettoreSrc,
} from "@/lib/geogebra-proiezioni";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return TAVOLE_PO_PRONTE.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = getTavolaPO(slug);
  if (!t) return {};
  return {
    title: `${t.titolo} — Proiezioni ortogonali`,
    description: t.proiettore
      ? `Tavola guidata di proiezioni ortogonali. ${t.titolo}: il solido da ruotare nel proiettore e la costruzione delle tre viste passo per passo.`
      : `Tavola guidata di proiezioni ortogonali. ${t.titolo}: la costruzione passo per passo con GeoGebra.`,
  };
}

export default async function TavolaProiezionePage({ params }: Props) {
  const { slug } = await params;
  const t = getTavolaPO(slug);
  if (!t) notFound();

  const indice = TAVOLE_PO_PRONTE.findIndex((x) => x.slug === t.slug);
  const precedente = TAVOLE_PO_PRONTE[indice - 1];
  const successiva = TAVOLE_PO_PRONTE[indice + 1];

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb
        items={[
          { label: "Book ProfTecnologIA", href: "/" },
          { label: MC_PROIEZIONI, href: `/mc/${MC_PROIEZIONI}`, emoji: "📐", color: "#1A3A7A" },
          { label: "Proiezioni ortogonali", href: "/proiezioni-ortogonali", color: "#1A3A7A" },
          { label: `Tavola ${t.numero}`, color: "#1A3A7A" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-7 max-w-3xl">
          <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-800">
            {MC_PROIEZIONI} · Classe 2ª · Proiezioni ortogonali · Tavola {t.numero} · Fondamentale
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{t.titolo}</h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">{t.intro}</p>
          <a
            href={costruzioneSrc(t, true)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-bold text-slate-600 underline underline-offset-4"
          >
            Apri la costruzione alla LIM ↗
          </a>
        </div>

        <TavolaProiezioneClient
          titolo={t.titolo}
          activity={activityTavolaPO(t)}
          proiettoreSrc={t.proiettore ? proiettoreSrc({ preset: t.proiettore, titolo: t.titolo, modo: "embed" }) : undefined}
          proiettoreLimSrc={t.proiettore ? proiettoreSrc({ preset: t.proiettore, titolo: t.titolo, modo: "lim" }) : undefined}
        />

        <div className="mt-7 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
          <p className="font-black">{t.proiettore ? "3 · Prova tu" : "Prova tu"}</p>
          <p className="mt-1">{t.provaTu}</p>
          {t.controlli && t.controlli.length > 0 && (
            <>
              <p className="mt-3 font-black">Controlla da solo</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {t.controlli.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          )}
          {t.proiettoreProva && (
            <p className="mt-3">
              Hai finito? Confronta il tuo foglio con le tre viste del proiettore:{" "}
              <a
                href={proiettoreSrc({ preset: t.proiettoreProva, titolo: "Prova tu", modo: "lim" })}
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-blue-800 underline underline-offset-4"
              >
                apri il solido della prova ↗
              </a>
              . Il proiettore mostra la forma delle viste, non le distanze dai piani.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-black text-blue-800">
            {precedente && (
              <Link href={hrefTavolaPO(precedente)} className="underline underline-offset-4">
                ← {precedente.numero}. {precedente.titolo}
              </Link>
            )}
            {successiva && (
              <Link href={hrefTavolaPO(successiva)} className="underline underline-offset-4">
                {successiva.numero}. {successiva.titolo} →
              </Link>
            )}
            <Link href="/proiezioni-ortogonali" className="underline underline-offset-4">
              Tutte le tavole
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
