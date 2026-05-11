import Link from "next/link";
import { notFound } from "next/navigation";
import MCCard from "@/components/MCCard";
import MCVisual from "@/components/MCVisual";
import QuizWidget from "@/components/mc/QuizWidget";
import AudioPlayer from "@/components/mc/AudioPlayer";
import VideoGallery from "@/components/mc/VideoGallery";
import FlippedVideos from "@/components/mc/FlippedVideos";
import FlashcardDeck from "@/components/mc/FlashcardDeck";
import FormulaCard from "@/components/mc/FormulaCard";
import ProcedureList from "@/components/mc/ProcedureList";
import Breadcrumb from "@/components/Breadcrumb";
import { AREA_META, getAllMCs, getMCById, getPrerequisiteChain } from "@/lib/mc-loader";
import { getMCTextContent, getVisualAssets, getMCHookAudio, getMCHookTranscript, getMCQuizData, getMCFlashcards, getVideoPlaylist } from "@/lib/content-loader";
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
  const hookAudioSrc    = getMCHookAudio(mc.id);
  const hookTranscript  = getMCHookTranscript(mc.id);
  const quizData        = getMCQuizData(mc.id);
  const flashcards      = getMCFlashcards(mc.id);
  const videoPlaylist   = getVideoPlaylist(mc.id);
  const prereqs         = getPrerequisiteChain(mc.id);
  const related = getAllMCs()
    .filter((item) => item.area === mc.area && item.id !== mc.id)
    .slice(0, 3);
  const level = mc.outputApp.livelloDigComp;

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb items={[
        { label: "ProfTecnologIA", href: "/" },
        { label: area?.label ?? mc.area, href: `/area/${mc.area.toLowerCase()}`, emoji: area?.emoji, color: area?.hex },
        { label: mc.titolo, color: area?.hex },
      ]} />

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

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6 sm:space-y-8">
          <section className="rounded-lg border border-amber-200 bg-[#fff7dd] p-4 sm:p-6">
            <p className="text-sm font-black text-amber-800">Compito di realtà</p>
            <p className="mt-2 text-base font-bold leading-7 text-amber-950 sm:mt-3 sm:text-xl sm:leading-9">{mc.compito_realta}</p>
          </section>

          {text && (
            <section className="min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-6 shadow-sm sm:px-5 sm:py-7 md:px-8">
              {text.intro && <ReadableText value={text.intro} />}
              <div className={cx("divide-y divide-slate-200", text.intro ? "mt-6 sm:mt-7" : "")}>
                {text.sections.map((section) => {
                  const isInnesca = /innesca/i.test(section.title);
                  const isEsplora = /esplora/i.test(section.title);
                  const isSperimenta = /sperimenta/i.test(section.title);
                  const domanda   = isInnesca ? mc.hook_audio?.domanda_avvio : null;
                  const hookTitle = mc.hook_audio?.titolo ?? `Hook audio — ${mc.titolo}`;
                  const hookMin   = mc.hook_audio?.durata_min;

                  // 3 video flipped classroom: posizionati DOPO INNESCA e PRIMA di ESPLORA
                  const flippedVideos = videoPlaylist.slice(0, 3);

                  return (
                    <article key={section.title} className="py-6 first:pt-0 last:pb-0 sm:py-8">
                      <h2 className="text-xl font-black leading-tight text-slate-950 sm:text-2xl">{section.title}</h2>

                      {/* Player audio hook con trascrizione (CARBLE-CDD criterio L) */}
                      {isInnesca && hookAudioSrc && (
                        <AudioPlayer
                          src={hookAudioSrc}
                          titolo={hookTitle}
                          durata={hookMin}
                          transcript={hookTranscript ?? undefined}
                        />
                      )}

                      {/* Domanda stimolo in giallo */}
                      {domanda && (
                        <p className="mt-3 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-base font-bold leading-snug text-yellow-900 sm:mt-4 sm:text-lg">
                          💬 {domanda}
                        </p>
                      )}

                      <ReadableText value={section.body} className="mt-3 sm:mt-4" compactOperational={isSperimenta} />

                      {/* 3 video flipped classroom — dopo INNESCA, prima di ESPLORA */}
                      {isInnesca && flippedVideos.length > 0 && (
                        <FlippedVideos videos={flippedVideos} />
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {visuals.length > 1 && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Galleria visuale</p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {visuals.slice(1).map((asset) => (
                  <MCVisual key={asset.src} asset={asset} alt={`${asset.label} per ${mc.titolo}`} />
                ))}
              </div>
            </section>
          )}

          {/* Gallery video YouTube — 9 video dopo la galleria visuale */}
          {videoPlaylist.length > 3 && (
            <VideoGallery
              videos={videoPlaylist.slice(3, 12)}
              mcTitolo={mc.titolo}
            />
          )}

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm font-black text-slate-500">Asset app previsti</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <AssetBox title="Quiz" body={mc.outputApp.quiz} />
              <AssetBox title="Microlearning" body={mc.outputApp.microlearning} />
              <AssetBox title="Visual" body={mc.outputApp.visual} />
            </div>
          </section>

          <QuizWidget
            mcId={mc.id}
            livello={(level === "H" ? "A" : level) as "F" | "I" | "A"}
            quizData={quizData ?? undefined}
          />
        </div>

        <aside className="min-w-0 space-y-5">
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

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-slate-500">Framework</p>
            <div className="mt-4 space-y-3">
              {Object.entries(mc.frameworks).map(([key, fw]) => (
                fw ? (
                  <div key={key} className="rounded-lg bg-slate-50 p-3">
                    <div className="mb-1 font-mono text-xs font-black text-slate-500">{key}</div>
                    <p className="text-sm font-semibold leading-6 text-slate-800">{fw.traguardo ?? fw.ref}</p>
                    {fw.nota && <p className="mt-1 text-xs leading-5 text-slate-500">{fw.nota}</p>}
                  </div>
                ) : null
              ))}
            </div>
          </section>

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

          {prereqs.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black text-slate-500">Prerequisiti</p>
              <div className="mt-3 space-y-2">
                {prereqs.map((item) => (
                  <Link key={item.id} href={`/mc/${item.id}`} className="block rounded-lg border border-slate-100 p-3 text-sm font-bold hover:bg-slate-50">
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

      {/* Flashcard — sistema di ripasso a fine MC */}
      {flashcards.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FlashcardDeck cards={flashcards} mcTitolo={mc.titolo} />
        </div>
      )}

      {/* Formula trasparenza AI — Protocollo CARBLE-CDD */}
      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <p className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-400">
          🤖 Questo materiale è stato realizzato da{" "}
          <span className="font-semibold text-slate-500">Prof. Ing. Antonio Scaramuzzino</span>{" "}
          con il supporto di strumenti AI (Claude, GPT Image, edge-tts) e validato secondo il{" "}
          <Link href="/credits" className="underline hover:text-slate-700">Protocollo CARBLE-CDD v1.0</Link>.
          I video appartengono ai rispettivi autori YouTube.
        </p>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12">
          <h2 className="mb-4 text-2xl font-black">Altre MC dell&apos;area</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => <MCCard key={item.id} mc={item} />)}
          </div>
        </section>
      )}
    </main>
  );
}

function AssetBox({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <h3 className="text-sm font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-xs leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function ReadableText({
  value,
  className = "",
  compactOperational = false,
}: {
  value: string;
  className?: string;
  compactOperational?: boolean;
}) {
  const blocks = value
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className={cx("reading-flow min-w-0 overflow-hidden text-slate-700", className)}>
      {blocks.map((block, index) => {
        if (isTableBlock(block)) {
          return <ReadableTable key={index} block={block} />;
        }

        // Blocchi codice Arduino/tecnici (@@CODE:)
        if (block.startsWith("@@CODE:")) {
          const code = block.replace(/^@@CODE:/, "").trim();
          return (
            <pre key={index}>
              <code>{code}</code>
            </pre>
          );
        }

        // Callout dai blockquote (@@CALLOUT:) — box visivi colorati
        if (block.startsWith("@@CALLOUT:") || block.includes("\n@@CALLOUT:")) {
          const text = block.replace(/@@CALLOUT:/g, "").trim();
          // Rileva tipo dal contenuto per colorazione semantica
          const isSafety = /⚠️|sicurezza|attenzione|pericolo|non toccare/i.test(text);
          const isPhysics = /⚡|fisica|legge|formula|ohm|corrente|tensione/i.test(text);
          const isError   = /errore comune|sbaglio|attenzione:|spesso si sbaglia/i.test(text);
          const isQuestion = /^(\*\*)?domanda aperta/i.test(text);
          const borderColor = isQuestion ? "#0ea5e9" : isSafety ? "#ef4444" : isPhysics ? "#3b82f6" : isError ? "#eab308" : "#f59e0b";
          const bgColor     = isQuestion ? "#f0f9ff" : isSafety ? "#fef2f2" : isPhysics ? "#eff6ff" : isError ? "#fefce8" : "#fffbeb";
          const textColor   = isQuestion ? "#0c4a6e" : isSafety ? "#3f0000" : isPhysics ? "#1e3a8a" : isError ? "#3f3000" : "#3f2f05";
          return (
            <blockquote key={index} style={{ borderColor, background: bgColor, color: textColor }}>
              {renderInlineMarkdown(text)}
            </blockquote>
          );
        }

        if (block.startsWith("@@SUBHEAD:")) {
          const heading = block.replace(/^@@SUBHEAD:/, "").trim();
          if (compactOperational && isOperationalTitle(heading)) {
            return (
              <h3 key={index} className="operational-heading">
                {renderInlineMarkdown(heading)}
              </h3>
            );
          }

          return (
            <h3 key={index} className="mt-7 max-w-3xl text-xl font-black leading-snug text-slate-950 first:mt-0">
              {renderInlineMarkdown(heading)}
            </h3>
          );
        }

        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        if (compactOperational && isOperationalBlock(lines)) {
          return <OperationalBox key={index} lines={lines} />;
        }

        if (lines.length > 1 && lines.every((line) => line.startsWith("• "))) {
          return (
            <ul key={index} className="mt-4 list-disc space-y-2 pl-6 marker:text-emerald-700">
              {lines.map((line) => <li key={line}>{renderInlineMarkdown(line.replace(/^•\s+/, ""))}</li>)}
            </ul>
          );
        }

        if (lines.length > 1 && lines.every((line) => /^\d+\.\s+/.test(line))) {
          return (
            <ol key={index} className="mt-4 list-decimal space-y-2 pl-6 marker:font-bold marker:text-emerald-700">
              {lines.map((line) => <li key={line}>{renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>)}
            </ol>
          );
        }

        return <FormattedParagraph key={index} value={block} compactOperational={compactOperational} />;
      })}
    </div>
  );
}

function OperationalBox({ lines }: { lines: string[] }) {
  const rawTitle = lines[0]
    .replace(/\*+/g, "")
    .replace(/:$/, "")
    .trim();
  const rawItems = lines.slice(1);
  const listLike = rawItems.length > 0 && rawItems.every((line) => /^(•|\d+\.)\s+/.test(line));
  const items = rawItems.map((line) => line.replace(/^(•|\d+\.)\s+/, "").trim()).filter(Boolean);

  return (
    <section className="operational-box">
      <h4>{renderInlineMarkdown(rawTitle)}</h4>
      {items.length > 0 && (
        listLike ? (
          <ul>
            {items.map((item) => (
              <li key={item}>{renderInlineMarkdown(item)}</li>
            ))}
          </ul>
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <p key={item}>{renderInlineMarkdown(item)}</p>
            ))}
          </div>
        )
      )}
    </section>
  );
}

function PromptBox({ title, body }: { title: string; body: string }) {
  return (
    <section className="question-prompt">
      <h4>{renderInlineMarkdown(title.replace(/:$/, ""))}</h4>
      {body && <p>{renderInlineMarkdown(body)}</p>}
    </section>
  );
}

function FormattedParagraph({
  value,
  compactOperational = false,
}: {
  value: string;
  compactOperational?: boolean;
}) {
  const numberedOpenQuestion =
    value.match(/^\d+\.\s+\*\*(Domanda aperta[^*\n:]*):\*\*\s+([\s\S]+)$/i) ??
    value.match(/^\d+\.\s+(Domanda aperta[^:\n]{0,80}):\s+([\s\S]+)$/i);
  if (numberedOpenQuestion) {
    return <PromptBox title={numberedOpenQuestion[1]} body={numberedOpenQuestion[2]} />;
  }

  const standaloneOpenQuestion = value.match(/^\*\*(\d+\.\s+Domanda aperta[^*\n]{0,90})\*\*$/i);
  if (standaloneOpenQuestion) {
    return (
      <h3 className="operational-heading">
        {renderInlineMarkdown(standaloneOpenQuestion[1])}
      </h3>
    );
  }

  const standaloneOperational = value.match(/^\*\*([^*\n:]{3,64}):\*\*$/);
  if (compactOperational && standaloneOperational && isOperationalTitle(standaloneOperational[1])) {
    return (
      <h3 className="operational-heading">
        {renderInlineMarkdown(standaloneOperational[1])}
      </h3>
    );
  }

  const titleMatch =
    value.match(/^\*\*([^*\n:]{3,64})([.:])\*\*\s+([\s\S]+)$/) ??
    value.match(/^([^.\n:]{3,64})([.:])\s+([\s\S]+)$/);

  if (titleMatch) {
    // Rimuove asterischi orfani che si generano quando il bold marker (**Testo:**)
    // viene spezzato dalla regex sul separatore : o .
    const lead = titleMatch[1].replace(/\*+/g, "").trim();
    const rest = titleMatch[3].replace(/^\*+\s*/, "");

    if (compactOperational && isOperationalTitle(lead)) {
      return <OperationalBox lines={[lead, rest]} />;
    }

    if (isOpenQuestionTitle(lead)) {
      return <PromptBox title={lead} body={rest} />;
    }

    if (!shouldPromoteParagraphLead(titleMatch[1])) {
      return <p className="whitespace-pre-line">{renderInlineMarkdown(value)}</p>;
    }

    return (
      <p className="whitespace-pre-line">
        <strong className="font-black text-slate-950">{lead}{titleMatch[2]}</strong>{" "}
        {renderInlineMarkdown(rest)}
      </p>
    );
  }

  return <p className="whitespace-pre-line">{renderInlineMarkdown(value)}</p>;
}

function isOperationalBlock(lines: string[]): boolean {
  if (lines.length < 2) return false;
  const first = lines[0].replace(/\*+/g, "").replace(/:$/, "").trim();
  const rest = lines.slice(1);
  return isOperationalTitle(first) && rest.every((line) => /^(•|\d+\.)\s+/.test(line));
}

function isOperationalTitle(value: string): boolean {
  const clean = value.replace(/\*+/g, "").replace(/:$/, "").trim();
  return /^(materiali(?:\s+che\s+ti\s+servono)?|procedura(?:\s+passo\s+per\s+passo)?|come procedere(?:,\s*passo\s+per\s+passo)?|la procedura|scenario|lo scenario|consegna|la consegna|criteri di valutazione|rubrica di valutazione)$/i.test(clean);
}

function isFormulaLabel(value: string): boolean {
  const clean = value.replace(/\*+/g, "").replace(/:$/, "").trim();
  return /^(formula|legge di\s+.+)$/i.test(clean);
}

function isOpenQuestionTitle(value: string): boolean {
  const clean = value.replace(/\*+/g, "").replace(/:$/, "").trim();
  return /^(\d+\.\s*)?domanda aperta(?:\s+avanzata)?(?:\s+[—-].+)?$/i.test(clean);
}

function shouldPromoteParagraphLead(value: string): boolean {
  const clean = value.replace(/\*+/g, "").trim();
  if (clean.length > 64) return false;
  if (/^(primo|secondo|terzo|obiettivo|materiali|procedura|scenario|consegna|esempio|attenzione)$/i.test(clean)) return true;
  if (/^(fase\s+\d+|domanda di avvio|discarica|incenerimento|termovalorizzazione|riciclo|riuso|riparazione|compostaggio)$/i.test(clean)) return true;
  return /^[A-ZÀ-Ú][A-Za-zÀ-ÿ0-9\s’’()/-]{2,}$/.test(clean) && clean.split(/\s+/).length <= 7;
}

function renderInlineMarkdown(value: string) {
  const nodes: React.ReactNode[] = [];
  // Non attraversa i newline: evita match su span multiparagrafo
  const pattern = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      // Rimuove asterischi non accoppiati nel testo tra i match
      nodes.push(value.slice(lastIndex, match.index).replace(/\*+/g, ""));
    }
    const token = match[0];
    const strong = token.startsWith("**");
    const text = strong ? token.slice(2, -2) : token.slice(1, -1);
    nodes.push(
      strong ? (
        <strong key={`${match.index}-${text}`} className="font-black text-slate-950">{text}</strong>
      ) : (
        <em key={`${match.index}-${text}`} className="text-slate-800">{text}</em>
      )
    );
    lastIndex = match.index + token.length;
  }

  // Rimuove asterischi non accoppiati nel testo rimanente
  if (lastIndex < value.length) nodes.push(value.slice(lastIndex).replace(/\*+/g, ""));
  return nodes;
}

function isTableBlock(block: string): boolean {
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  // Tabella valida: almeno 2 righe, prima inizia con |, una riga contiene ---
  if (lines.length < 2) return false;
  const hasHeader = lines[0].startsWith("|");
  const hasSeparator = lines.some((l) => /^\|?[\s:-]+\|[\s|:-]+$/.test(l));
  return hasHeader && hasSeparator;
}

function _cleanCell(raw: string): string {
  // Rimuove bold/italic markdown e citazioni bibliografiche dalle celle
  return raw
    .replace(/\*{1,2}([^*\n]+)\*{1,2}/g, "$1")
    .replace(/\s*\(Fonti?\s+convergenti[^)]+\)/gi, "")
    .replace(/\s*\(ISBN\s+978\d{10}[^)]*\)/gi, "")
    .replace(/\s*\(p\.\s*\d+[^)]*\)/gi, "")
    .trim();
}

function ReadableTable({ block }: { block: string }) {
  const allLines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Separa righe dati da righe separatore (|---|---|)
  const dataLines = allLines.filter(
    (line) => line.startsWith("|") && !/^\|?[\s:-]+\|[\s|:-]+$/.test(line)
  );

  const rows = dataLines.map((line) =>
    line.split("|").map((cell) => _cleanCell(cell)).filter((cell) => cell !== "")
  );

  const [head, ...body] = rows;
  if (!head) return null;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm leading-6">
          <thead className="bg-slate-100 text-slate-900">
            <tr>
              {head.map((cell, i) => (
                <th key={i} className="border-b border-slate-200 px-3 py-2.5 font-black whitespace-nowrap sm:px-4 sm:py-3">
                  {renderInlineMarkdown(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-white even:bg-slate-50">
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`} className="border-b border-slate-100 px-3 py-2.5 align-top text-slate-700 sm:px-4 sm:py-3">
                    {renderInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
