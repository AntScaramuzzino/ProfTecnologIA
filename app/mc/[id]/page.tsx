import Link from "next/link";
import { notFound } from "next/navigation";
import MCCard from "@/components/MCCard";
import MCVisual from "@/components/MCVisual";
import Breadcrumb from "@/components/Breadcrumb";
import { MCPageClient } from "@/components/mc/MCPageClient";
import { AREA_META, getAllMCs, getMCById, getPrerequisiteChain } from "@/lib/mc-loader";
import {
  getMCTextContent,
  getVisualAssets,
  getMCHookAudio,
  getMCHookTranscript,
  getMCQuizData,
  getMCFlashcards,
  getVideoPlaylist,
} from "@/lib/content-loader";
import { areaAccent, cx, levelBadge } from "@/lib/ui";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllMCs().map((mc) => ({ id: mc.id }));
}

export default async function MCPage({ params }: Props) {
  const { id } = await params;
  const mc = getMCById(id);
  if (!mc) notFound();

  const area = AREA_META[mc.area];
  const visuals = getVisualAssets(mc.id);
  const primaryVisual = visuals[0] ?? null;
  const text = getMCTextContent(mc.id);
  const hookAudioSrc   = getMCHookAudio(mc.id);
  const hookTranscript = getMCHookTranscript(mc.id);
  const quizData       = getMCQuizData(mc.id);
  const flashcards     = getMCFlashcards(mc.id);
  const videoPlaylist  = getVideoPlaylist(mc.id);
  const prereqs        = getPrerequisiteChain(mc.id);
  const related = getAllMCs()
    .filter((item) => item.area === mc.area && item.id !== mc.id)
    .slice(0, 3);
  const level = mc.outputApp.livelloDigComp;
  const areaBreadcrumbLabel = (area?.label ?? mc.area).toUpperCase();
  const areaHex = area?.hex;

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb
        items={[
          { label: "ProfTecnologIA", href: "/" },
          { label: areaBreadcrumbLabel, href: `/area/${mc.area.toLowerCase()}`, emoji: area?.emoji, color: areaHex },
          { label: mc.id, color: areaHex },
        ]}
      />

      {/* ── Hero header ── */}
      <section className={cx("border-b bg-gradient-to-br", areaAccent[mc.area] ?? "from-white to-slate-50")}>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
              <span className="rounded-full bg-white/85 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm sm:px-3 sm:text-sm">
                {area?.emoji} {area?.label}
              </span>
              <span className="rounded-full bg-white/85 px-2.5 py-1 font-mono text-xs font-bold text-slate-700 shadow-sm sm:px-3 sm:text-sm">
                {mc.id}
              </span>
              <span className={cx("rounded-full border px-2.5 py-1 text-xs font-bold sm:px-3 sm:text-sm", levelBadge[level])}>
                DigComp {level}
              </span>
            </div>
            <h1 className="max-w-3xl text-2xl font-black leading-tight text-slate-950 sm:text-4xl md:text-5xl">
              {mc.titolo}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:mt-5 sm:text-lg sm:leading-9">
              {mc.descrizione}
            </p>
          </div>
          <MCVisual asset={primaryVisual} alt={`Visuale per ${mc.titolo}`} className="min-h-48 sm:min-h-72 lg:min-h-80" />
        </div>
      </section>

      {/* ── Compito di realtà — sempre visibile sopra il navigator ── */}
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <section className="rounded-lg border border-amber-200 bg-[#fff7dd] p-4 sm:p-5">
          <p className="text-sm font-black text-amber-800">Compito di realtà</p>
          <p className="mt-2 text-base font-bold leading-7 text-amber-950 sm:mt-3 sm:text-lg sm:leading-9">
            {mc.compito_realta}
          </p>
        </section>
      </div>

      {/* ── Layout principale: MCPageClient (navigator + contenuto) + aside ── */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-0 sm:gap-6 sm:px-6 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8">

        {/* Colonna sinistra: MCPageClient con navigator a 5 tab */}
        <div className="min-w-0 overflow-hidden rounded-lg border-0 bg-white sm:border sm:border-slate-200 sm:shadow-sm">
          <MCPageClient
            mc={mc}
            areaHex={areaHex}
            text={text}
            hookAudioSrc={hookAudioSrc}
            hookTranscript={hookTranscript}
            quizData={quizData}
            flashcards={flashcards}
            videoPlaylist={videoPlaylist}
            visuals={visuals}
          />
        </div>

        {/* Aside destra — stessa struttura di prima */}
        <aside className="hidden min-w-0 space-y-5 lg:block">
          {/* Asset app previsti */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-black text-slate-500">Asset app previsti</p>
            <div className="space-y-3">
              <AssetBox title="Quiz" body={mc.outputApp.quiz} />
              <AssetBox title="Microlearning" body={mc.outputApp.microlearning} />
              <AssetBox title="Visual" body={mc.outputApp.visual} />
            </div>
          </section>

          {/* Differenziazione */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-slate-500">Differenziazione</p>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-black text-blue-900">Base</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{mc.note_didattiche?.base}</p>
              </div>
              <div>
                <h3 className="text-sm font-black text-orange-900">Avanzato</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{mc.note_didattiche?.avanzato}</p>
              </div>
            </div>
          </section>

          {/* Framework */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-slate-500">Framework</p>
            <div className="mt-4 space-y-3">
              {Object.entries(mc.frameworks).map(([key, fw]) =>
                fw ? (
                  <div key={key} className="rounded-lg bg-slate-50 p-3">
                    <div className="mb-1 font-mono text-xs font-black text-slate-500">{key}</div>
                    <p className="text-sm font-semibold leading-6 text-slate-800">{fw.traguardo ?? fw.ref}</p>
                    {fw.nota && <p className="mt-1 text-xs leading-5 text-slate-500">{fw.nota}</p>}
                  </div>
                ) : null,
              )}
            </div>
          </section>

          {/* Tag */}
          {mc.tags?.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black text-slate-500">Tag</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mc.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Prerequisiti */}
          {prereqs.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black text-slate-500">Prerequisiti</p>
              <div className="mt-3 space-y-2">
                {prereqs.map((item) => (
                  <Link
                    key={item.id}
                    href={`/mc/${item.id}`}
                    className="block rounded-lg border border-slate-100 p-3 text-sm font-bold hover:bg-slate-50"
                  >
                    <span className="font-mono text-xs text-slate-400">{item.id}</span>
                    <br />
                    {item.titolo}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      {/* ── Altre MC dell'area ── */}
      {related.length > 0 && (
        <section className="border-t border-slate-200 bg-white py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">
                  {area?.emoji} {area?.label}
                </p>
                <h2 className="text-2xl font-black text-slate-900">Altre MC dell&apos;area</h2>
              </div>
              <Link
                href={`/area/${mc.area.toLowerCase()}`}
                className="rounded-full border border-emerald-200 px-4 py-1.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
              >
                Vedi tutte →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {related.map((item) => <MCCard key={item.id} mc={item} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer trasparenza AI — Protocollo CARBLE-CDD ── */}
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 sm:px-6">
        <p className="mx-auto max-w-7xl text-xs text-slate-400">
          🤖 Contenuto realizzato da{" "}
          <span className="font-semibold text-slate-500">Prof. Ing. Antonio Scaramuzzino</span>{" "}
          con il supporto di AI (Claude, GPT Image, edge-tts) · validato{" "}
          <Link href="/credits" className="underline hover:text-slate-700">
            Protocollo CARBLE-CDD v1.0
          </Link>{" "}
          · I video appartengono ai rispettivi autori YouTube.
        </p>
      </div>
    </main>
  );
}

function AssetBox({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <h3 className="text-sm font-black text-slate-900">{title}</h3>
      <p className="mt-1.5 text-xs leading-5 text-slate-600">{body}</p>
    </div>
  );
}
