import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
  getMCMicrolearningInteractives,
  getMCDeckSlides,
} from "@/lib/content-loader";
import { areaAccent, cx, levelBadge } from "@/lib/ui";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllMCs().map((mc) => ({ id: mc.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const mc = getMCById(id);
  if (!mc) return { title: "ProfTecnologIA" };
  const area = AREA_META[mc.area];
  const areaLabel = area?.label ?? mc.area;
  return {
    title: `ProfTecnologIA ${areaLabel} — ${mc.titolo}`,
    description: mc.descrizione,
    openGraph: {
      title: `ProfTecnologIA ${areaLabel} — ${mc.titolo}`,
      description: mc.descrizione,
    },
  };
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
  const quizData             = getMCQuizData(mc.id);
  const flashcards           = getMCFlashcards(mc.id);
  const videoPlaylist        = getVideoPlaylist(mc.id);
  const microlearningData    = getMCMicrolearningInteractives(mc.id);
  const deckSlides           = getMCDeckSlides(mc.id);
  const prereqs              = getPrerequisiteChain(mc.id);
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
          { label: areaBreadcrumbLabel, href: `/area/${mc.area}`, emoji: area?.emoji, color: areaHex },
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
          <MCVisual asset={primaryVisual} alt={`Visuale per ${mc.titolo}`} className="min-h-48 sm:min-h-72 lg:min-h-80" priority={true} />
        </div>
      </section>

      {/* ── Traguardo di competenza — sostituisce il Compito di realtà sopra il navigator ── */}
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <section
          className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5"
          style={{ borderLeftColor: areaHex ?? "#10B981", borderLeftWidth: 4 }}
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              📌 Cosa imparo in questa MC
            </p>
            {mc.frameworks?.DC?.ref && (
              <span
                className="ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-black text-white"
                style={{ backgroundColor: areaHex ?? "#10B981" }}
              >
                DigComp {mc.outputApp.livelloDigComp} · {mc.frameworks.DC.ref.split(" ").slice(0, 2).join(" ")}
              </span>
            )}
          </div>
          <p className="text-base leading-7 text-slate-800 sm:text-lg sm:leading-9">
            {mc.frameworks?.IN?.traguardo ?? mc.frameworks?.DC?.nota ?? mc.descrizione}
          </p>
        </section>
      </div>

      {/* ── Layout principale: MCPageClient (navigator + contenuto) + aside ── */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-0 sm:gap-6 sm:px-6 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8">

        {/* Colonna sinistra: MCPageClient con navigator a 5 tab */}
        {/* [overflow:clip] instead of overflow-hidden: clips visually (preserves rounded corners)
            but does NOT create a scroll container, so the MCNavigator sticky tab bar
            (top-14) continues to stick relative to the viewport, not this div.
            overflow:hidden would trap sticky inside this container and cause the
            tab-panel's first element (AudioPlayer) to render partially cut off. */}
        <div className="min-w-0 [overflow:clip] rounded-lg border-0 bg-white sm:border sm:border-slate-200 sm:shadow-sm">
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
            microlearningData={microlearningData}
            deckSlides={deckSlides}
          />
        </div>

        {/* Aside destra */}
        <aside className="hidden min-w-0 space-y-5 lg:block">

          {/* QR Assistente AI */}
          <section className="overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
            <div
              className="flex items-center gap-2 border-b border-emerald-100 px-4 py-2.5"
              style={{ backgroundColor: areaHex ? `${areaHex}18` : "#d1fae510" }}
            >
              <span className="text-base">🤖</span>
              <p className="text-sm font-black text-slate-700">Chiedi all&apos;Assistente AI</p>
            </div>
            <div className="flex flex-col items-center gap-3 px-4 py-4">
              <a
                href="https://chatgpt.com/g/g-r8SUrcWtt-proftecnologia"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-opacity hover:opacity-80"
                aria-label="Apri ProfTecnologIA su ChatGPT"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/qr-proftecnologia.webp"
                  alt="QR Code ProfTecnologIA Assistant"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              </a>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-600">
                  Scansiona o clicca per aprire
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  ProfTecnologIA · GPT Assistant
                </p>
              </div>
              <a
                href="https://chatgpt.com/g/g-r8SUrcWtt-proftecnologia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-center text-xs font-black text-emerald-800 transition-colors hover:bg-emerald-100"
              >
                Apri l&apos;assistente →
              </a>
            </div>
          </section>

          {/* Prerequisiti — in cima all'aside per rendere visibile il percorso */}
          {prereqs.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black text-slate-500">Prerequisiti</p>
              <div className="mt-3 space-y-2">
                {prereqs.map((item) => (
                  <Link
                    key={item.id}
                    href={`/mc/${item.id}`}
                    className="block rounded-lg border border-slate-100 p-3 text-sm font-bold transition-colors hover:bg-slate-50"
                  >
                    <span className="font-mono text-xs text-slate-400">{item.id}</span>
                    <br />
                    {item.titolo}
                  </Link>
                ))}
              </div>
            </section>
          )}

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

          {/* Asset app previsti — collassato (info tecniche per l'autore) */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <details className="group">
              <summary className="flex cursor-pointer select-none items-center justify-between px-5 py-3 text-sm font-black text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-400">
                <span>Asset app previsti</span>
                <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                <div className="space-y-3">
                  <AssetBox title="Quiz" body={mc.outputApp.quiz} />
                  <AssetBox title="Microlearning" body={mc.outputApp.microlearning} />
                  <AssetBox title="Visual" body={mc.outputApp.visual} />
                </div>
              </div>
            </details>
          </section>
        </aside>
      </div>

      {/* ── Panel mobile: Prerequisiti / Framework / Tag (P3.5) ── */}
      {/* Visibile solo su schermi < lg dove l'aside destra è hidden */}
      <div className="block lg:hidden mx-auto max-w-7xl px-4 sm:px-6 pb-6 space-y-2">

        {prereqs.length > 0 && (
          <details className="group rounded-lg border border-slate-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 text-sm font-black text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-400">
              <span>📌 Prerequisiti ({prereqs.length})</span>
              <svg className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-2">
              {prereqs.map((item) => (
                <Link
                  key={item.id}
                  href={`/mc/${item.id}`}
                  className="block rounded-lg border border-slate-100 p-3 text-sm font-bold transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <span className="font-mono text-xs text-slate-400">{item.id}</span>
                  <br />
                  {item.titolo}
                </Link>
              ))}
            </div>
          </details>
        )}

        <details className="group rounded-lg border border-slate-200 bg-white shadow-sm">
          <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 text-sm font-black text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-400">
            <span>🧩 Framework</span>
            <svg className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-2">
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
        </details>

        {mc.tags?.length > 0 && (
          <details className="group rounded-lg border border-slate-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 text-sm font-black text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-400">
              <span>🏷️ Tag</span>
              <svg className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="border-t border-slate-100 px-4 pb-4 pt-3">
              <div className="flex flex-wrap gap-2">
                {mc.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </details>
        )}
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
