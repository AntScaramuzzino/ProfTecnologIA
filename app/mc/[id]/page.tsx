import Link from "next/link";
import { notFound } from "next/navigation";
import MCCard from "@/components/MCCard";
import MCVisual from "@/components/MCVisual";
import QuizWidget from "@/components/mc/QuizWidget";
import { AREA_META, getAllMCs, getMCById, getPrerequisiteChain } from "@/lib/mc-loader";
import { getMCTextContent, getVisualAssets } from "@/lib/content-loader";
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
  const prereqs = getPrerequisiteChain(mc.id);
  const related = getAllMCs()
    .filter((item) => item.area === mc.area && item.id !== mc.id)
    .slice(0, 3);
  const level = mc.outputApp.livelloDigComp;

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <nav className="border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm font-bold text-slate-500">
          <Link href="/" className="font-semibold hover:text-slate-900">ProfTecnologIA</Link>
          <span>/</span>
          <Link href={`/area/${mc.area}`} className="hover:text-slate-900">{area?.emoji} {mc.area}</Link>
          <span>/</span>
          <span className="font-mono text-slate-800">{mc.id}</span>
        </div>
      </nav>

      <section className={cx("border-b bg-gradient-to-br", areaAccent[mc.area] ?? "from-white to-slate-50")}>
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/85 px-3 py-1 text-sm font-bold text-slate-800 shadow-sm">
                {area?.emoji} {area?.label}
              </span>
              <span className="rounded-full bg-white/85 px-3 py-1 font-mono text-sm font-bold text-slate-700 shadow-sm">
                {mc.id}
              </span>
              <span className={cx("rounded-full border px-3 py-1 text-sm font-bold", levelBadge[level])}>
                DigComp {level}
              </span>
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              {mc.titolo}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-slate-700">
              {mc.descrizione}
            </p>
          </div>
          <MCVisual asset={primaryVisual} alt={`Visuale per ${mc.titolo}`} className="min-h-80" />
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <section className="rounded-lg border border-amber-200 bg-[#fff7dd] p-6">
            <p className="text-sm font-black text-amber-800">Compito di realtà</p>
            <p className="mt-3 max-w-4xl text-xl font-bold leading-9 text-amber-950">{mc.compito_realta}</p>
          </section>

          {text && (
            <section className="rounded-lg border border-slate-200 bg-white px-5 py-7 shadow-sm md:px-8">
              {text.intro && <ReadableText value={text.intro} />}
              <div className={cx("divide-y divide-slate-200", text.intro ? "mt-7" : "")}>
                {text.sections.map((section) => (
                  <article key={section.title} className="py-8 first:pt-0 last:pb-0">
                    <h2 className="max-w-3xl text-2xl font-black leading-tight text-slate-950">{section.title}</h2>
                    <ReadableText value={section.body} className="mt-4" />
                  </article>
                ))}
              </div>
            </section>
          )}

          {visuals.length > 1 && (
            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Galleria visuale</p>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                {visuals.slice(1).map((asset) => (
                  <MCVisual key={asset.src} asset={asset} alt={`${asset.label} per ${mc.titolo}`} />
                ))}
              </div>
            </section>
          )}

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-black text-slate-500">Asset app previsti</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <AssetBox title="Quiz" body={mc.outputApp.quiz} />
              <AssetBox title="Microlearning" body={mc.outputApp.microlearning} />
              <AssetBox title="Visual" body={mc.outputApp.visual} />
            </div>
          </section>

          <QuizWidget mcId={mc.id} livello={(level === "H" ? "A" : level) as "F" | "I" | "A"} />
        </div>

        <aside className="space-y-5">
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

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-12">
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

function ReadableText({ value, className = "" }: { value: string; className?: string }) {
  const blocks = value
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className={cx("reading-flow text-slate-700", className)}>
      {blocks.map((block, index) => {
        if (isTableBlock(block)) {
          return <ReadableTable key={index} block={block} />;
        }

        if (block.startsWith("@@SUBHEAD:")) {
          return (
            <h3 key={index} className="mt-7 max-w-3xl text-xl font-black leading-snug text-slate-950 first:mt-0">
              {renderInlineMarkdown(block.replace(/^@@SUBHEAD:/, ""))}
            </h3>
          );
        }

        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
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

        return <FormattedParagraph key={index} value={block} />;
      })}
    </div>
  );
}

function FormattedParagraph({ value }: { value: string }) {
  const titleMatch = value.match(/^([^.\n:]{3,64})([.:])\s+([\s\S]+)$/);

  if (titleMatch && shouldPromoteParagraphLead(titleMatch[1])) {
    // Rimuove asterischi orfani che si generano quando il bold marker (**Testo:**)
    // viene spezzato dalla regex sul separatore : o .
    const lead = titleMatch[1].replace(/\*+/g, "").trim();
    const rest = titleMatch[3].replace(/^\*+\s*/, "");
    return (
      <p className="whitespace-pre-line">
        <strong className="font-black text-slate-950">{lead}{titleMatch[2]}</strong>{" "}
        {renderInlineMarkdown(rest)}
      </p>
    );
  }

  return <p className="whitespace-pre-line">{renderInlineMarkdown(value)}</p>;
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
  return lines.length >= 3 && lines[0].startsWith("|") && lines[1].includes("---");
}

function ReadableTable({ block }: { block: string }) {
  const rows = block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && !/^\|?[\s:-]+\|[\s|:-]+$/.test(line))
    .map((line) => line.split("|").map((cell) => cell.trim()).filter(Boolean));

  const [head, ...body] = rows;

  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full border-collapse text-left text-sm leading-6">
        <thead className="bg-slate-100 text-slate-900">
          <tr>
            {head?.map((cell) => (
              <th key={cell} className="border-b border-slate-200 px-4 py-3 font-black">{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-white even:bg-slate-50">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="border-b border-slate-100 px-4 py-3 align-top text-slate-700">
                  {renderInlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
