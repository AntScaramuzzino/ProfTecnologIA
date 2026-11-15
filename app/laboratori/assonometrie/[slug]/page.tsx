import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import TavolaProiezioneClient from "@/components/mc/TavolaProiezioneClient";
import {
  MC_ASSONOMETRIE,
  NOME_TIPO,
  TAVOLE_ASS_PRONTE,
  activityTavolaAss,
  assonometroSrc,
  costruzioneAssSrc,
  getTavolaAss,
  hrefTavolaAss,
} from "@/lib/geogebra-assonometrie";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return TAVOLE_ASS_PRONTE.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = getTavolaAss(slug);
  if (!t) return {};
  return {
    title: `${t.titolo} — Assonometrie`,
    description: `Tavola guidata di assonometria ${NOME_TIPO[t.tipo].toLowerCase()}. ${t.titolo}: il solido nell’assonometro, con assi e misure, e la costruzione passo per passo.`,
  };
}

const SCHEDE = {
  guarda: { nome: "Guarda il disegno", sotto: "Assi, misure e le tre viste da cui parti" },
  costruisci: { nome: "Costruisci la tavola", sotto: "Un passo alla volta, con riga e squadre" },
};
const STRUMENTO = {
  occhiello: "Assonometro",
  nome: "Assonometro",
  didascalia:
    "Nel riquadro «Foglio» il solido come viene sul tuo foglio, nel riquadro «Le tre viste» le viste da cui prendi le misure. Tocca un vertice per vedere come si trova partendo da O: lungo x, poi in parallelo all’asse y, poi in verticale.",
};

export default async function TavolaAssonometriaPage({ params }: Props) {
  const { slug } = await params;
  const t = getTavolaAss(slug);
  if (!t) notFound();

  const indice = TAVOLE_ASS_PRONTE.findIndex((x) => x.slug === t.slug);
  const precedente = TAVOLE_ASS_PRONTE[indice - 1];
  const successiva = TAVOLE_ASS_PRONTE[indice + 1];
  const classe = t.mc === MC_ASSONOMETRIE ? "2ª" : "3ª";

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb
        items={[
          { label: "Book ProfTecnologIA", href: "/" },
          { label: t.mc, href: `/mc/${t.mc}`, emoji: "📐", color: "#1A3A7A" },
          { label: "Assonometrie", href: "/assonometrie", color: "#1A3A7A" },
          { label: `Tavola ${t.numero}`, color: "#1A3A7A" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-7 max-w-3xl">
          <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-800">
            {t.mc} · Classe {classe} · Assonometria {NOME_TIPO[t.tipo].toLowerCase()} · Tavola {t.numero}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{t.titolo}</h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">{t.intro}</p>
          <a
            href={costruzioneAssSrc(t, true)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-bold text-slate-600 underline underline-offset-4"
          >
            Apri la costruzione alla LIM ↗
          </a>
        </div>

        <TavolaProiezioneClient
          titolo={t.titolo}
          activity={activityTavolaAss(t)}
          proiettoreSrc={t.assonometro ? assonometroSrc({ preset: t.assonometro, titolo: t.titolo, modo: "embed" }) : undefined}
          proiettoreLimSrc={t.assonometro ? assonometroSrc({ preset: t.assonometro, titolo: t.titolo, modo: "lim" }) : undefined}
          schede={SCHEDE}
          strumento={STRUMENTO}
        />

        <div className="mt-7 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
          <p className="font-black">3 · Prova tu</p>
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
          {t.assonometroProva && (
            <p className="mt-3">
              Hai finito? Confronta il tuo foglio con il disegno dell’assonometro:{" "}
              <a
                href={assonometroSrc({ preset: t.assonometroProva, titolo: "Prova tu", modo: "lim" })}
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-blue-800 underline underline-offset-4"
              >
                apri il solido della prova ↗
              </a>
              . Sullo schermo ogni quadretto vale 1 cm del tuo foglio.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-black text-blue-800">
            {precedente && (
              <Link href={hrefTavolaAss(precedente)} className="underline underline-offset-4">
                ← {precedente.numero}. {precedente.titolo}
              </Link>
            )}
            {successiva && (
              <Link href={hrefTavolaAss(successiva)} className="underline underline-offset-4">
                {successiva.numero}. {successiva.titolo} →
              </Link>
            )}
            <Link href="/assonometrie" className="underline underline-offset-4">
              Tutte le tavole
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
