"use client";

/**
 * MCPageClient — orchestratore client-side del template MC refactored (v2)
 *
 * Struttura:
 *  ┌─────────────────────────────────────────────────────┐
 *  │  MCNavigator (5 tab sticky)                         │
 *  │  ┌────────────────────────────────────────────────┐ │
 *  │  │  INNESCA  │  ESPLORA  │  OSSERVA  │  ...       │ │
 *  │  └────────────────────────────────────────────────┘ │
 *  │  <pannello attivo>                                   │
 *  │                                                      │
 *  │  [dopo i 5 tab] APPENDICE — sempre visibile          │
 *  └─────────────────────────────────────────────────────┘
 *
 * P0.1 — MCNavigator 5 tab
 * P0.2 — AccordionSection in ESPLORA (sottosezioni ### collassabili)
 * P0.3 — LevelTabs in SPERIMENTA (BASE / INTERMEDIO / AVANZATO)
 * P0.4 — CalloutBox (@@CALLOUT: → semanticamente colorati)
 * P0.5 — RubricaDrawer (estrae tabella rubrica da AGISCI a runtime)
 */

import { useMemo, useCallback, useState, useEffect } from "react";
import { MCNavigator, type NavigatorTab } from "@/components/mc/MCNavigator";
import { AccordionSection, type AccordionItem } from "@/components/mc/AccordionSection";
import { LevelTabs, type DigCompLevel } from "@/components/mc/LevelTabs";
import { CalloutBoxFromText } from "@/components/mc/CalloutBox";
import { RubricaDrawer } from "@/components/mc/RubricaDrawer";
import AudioPlayer from "@/components/mc/AudioPlayer";
import FlippedVideos from "@/components/mc/FlippedVideos";
import QuizWidget from "@/components/mc/QuizWidget";
import FlashcardDeck from "@/components/mc/FlashcardDeck";
import VideoGallery from "@/components/mc/VideoGallery";
import MCVisual from "@/components/MCVisual";
import { cx } from "@/lib/ui";
import { ResourcesPanel, type ResourcesSummary } from "@/components/mc/ResourcesPanel";
import ProfessioneCard from "@/components/mc/ProfessioneCard";
import type { MCTextContent, VisualAsset, VideoItem, QuizQuestion, FlashcardItem, MicrolearningInteractives } from "@/lib/content-loader";
import type { MC } from "@/lib/mc-loader";

// ── Tipi ────────────────────────────────────────────────────────────────────

interface MCPageClientProps {
  mc: MC;
  areaHex?: string;
  text: MCTextContent | null;
  hookAudioSrc: string | null;
  hookTranscript: string | null;
  quizData: QuizQuestion[] | null;
  flashcards: FlashcardItem[];
  videoPlaylist: VideoItem[];
  visuals: VisualAsset[];
  microlearningData?: MicrolearningInteractives | null;
}

// ── Mapping sezione MD → tab ID ──────────────────────────────────────────────

const ZONE_TABS: NavigatorTab[] = [
  { id: "INNESCA",    label: "INNESCA",    emoji: "⚡" },
  { id: "ESPLORA",    label: "ESPLORA",    emoji: "📖" },
  { id: "OSSERVA",    label: "OSSERVA",    emoji: "🔍" },
  { id: "SPERIMENTA", label: "SPERIMENTA", emoji: "🔬" },
  { id: "AGISCI",     label: "AGISCI",     emoji: "🌍" },
  { id: "RIPASSA",    label: "RIPASSA",    emoji: "🃏" },
];

function sectionToTabId(title: string): string | null {
  const t = title.toUpperCase();
  if (/INNESCA/.test(t))    return "INNESCA";
  if (/ESPLORA/.test(t))    return "ESPLORA";
  if (/OSSERVA/.test(t))    return "OSSERVA";
  if (/SPERIMENTA/.test(t)) return "SPERIMENTA";
  if (/AGISCI/.test(t))     return "AGISCI";
  return null;
}

// ── Splitta il body di SPERIMENTA in 3 livelli ───────────────────────────────

function splitSperimentaByLevel(body: string): { level: DigCompLevel; title: string; body: string }[] {
  // Pattern: @@SUBHEAD: ● BASE ... oppure ### ● BASE ...
  const levelPattern = /(?:@@SUBHEAD:|(?:^|\n)#{2,3}\s*)([●]+\s*(?:BASE|INTERMEDIO|AVANZATO)[^\n]*)/gi;
  const matches: { index: number; level: DigCompLevel; title: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = levelPattern.exec(body)) !== null) {
    const raw = m[1].trim();
    const level: DigCompLevel = /AVANZATO/i.test(raw) ? "A" : /INTERMEDIO/i.test(raw) ? "I" : "F";
    matches.push({ index: m.index, level, title: raw.replace(/^[●\s]+/, "").trim() });
  }
  if (matches.length === 0) return [{ level: "F", title: "Attività", body }];

  return matches.map((match, i) => ({
    level: match.level,
    title: match.title,
    body: body.slice(
      match.index + match.title.length + 15, // salta l'header
      matches[i + 1]?.index ?? body.length,
    ).trim(),
  }));
}

// ── Splitta il body di ESPLORA in sottosezioni ###  ──────────────────────────

function splitEsploraIntoAccordion(body: string): { id: string; title: string; body: string }[] {
  // Divide su @@SUBHEAD: (già normalizzato da cleanMarkdownForReading)
  const parts = body.split(/\n@@SUBHEAD:([^\n]+)\n/);
  if (parts.length <= 1) return [{ id: "esplora-0", title: "Leggi", body }];

  const result: { id: string; title: string; body: string }[] = [];
  // parts[0] = testo prima del primo @@SUBHEAD (può essere vuoto)
  if (parts[0].trim()) {
    result.push({ id: "esplora-intro", title: "Introduzione", body: parts[0].trim() });
  }
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i]?.trim() ?? "";
    const content = parts[i + 1]?.trim() ?? "";
    if (title && content) {
      result.push({ id: `esplora-${i}`, title, body: content });
    }
  }
  return result.length > 0 ? result : [{ id: "esplora-0", title: "Leggi", body }];
}

// ── Estrae la sezione "Professione del Futuro" dal body di OSSERVA ───────────
// Restituisce { professioneText, bodyWithout } per evitare duplicazione

function extractProfessioneSection(body: string): { professioneText: string; bodyWithout: string } {
  // Cerca @@SUBHEAD: che contiene "chi lavora", "professione", "2030", "futuro"
  const pattern = /\n@@SUBHEAD:([^\n]*(chi lavora|professione|2030|futuro)[^\n]*)\n([\s\S]*?)(?=\n@@SUBHEAD:|\n---|\s*$)/i;
  const match = body.match(pattern);
  if (!match) return { professioneText: "", bodyWithout: body };

  const fullMatch = match[0];
  const professioneText = match[1].trim() + "\n" + match[3].trim(); // titolo + corpo
  const bodyWithout = body.replace(fullMatch, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return { professioneText, bodyWithout };
}

// ── Estrae il body grezzo di AGISCI per il RubricaDrawer ────────────────────

function getAgisciRawBody(text: MCTextContent | null): string {
  if (!text) return "";
  const section = text.sections.find((s) => /AGISCI/i.test(s.title));
  return section?.body ?? "";
}

// ── Rimuove la sezione Rubrica dal body AGISCI (già esposta dal RubricaDrawer) ──

function stripRubricaFromBody(body: string): string {
  // Rimuove: heading "Rubrica di valutazione" + tabella Markdown che segue
  return body
    // Rimuove la riga heading della rubrica (es: "### 📋 Rubrica di valutazione")
    .replace(/\n?(?:#{1,4}\s*)?📋\s*Rubrica[^\n]*\n?/gi, "\n")
    // Rimuove il blocco tabella Markdown (righe che iniziano con |)
    .replace(/\n(\|[^\n]+\n)+/g, "\n")
    .trim();
}

// ── Renderer inline Markdown (bold/italic) — senza dipendenze ────────────────

function renderInline(value: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(value.slice(lastIndex, match.index).replace(/\*+/g, ""));
    }
    const token = match[0];
    const strong = token.startsWith("**");
    const text = strong ? token.slice(2, -2) : token.slice(1, -1);
    nodes.push(
      strong
        ? <strong key={match.index} className="font-black text-slate-950">{text}</strong>
        : <em key={match.index} className="text-slate-800">{text}</em>,
    );
    lastIndex = match.index + token.length;
  }
  if (lastIndex < value.length) nodes.push(value.slice(lastIndex).replace(/\*+/g, ""));
  return nodes;
}

// ── ReadableBodyInTab — renderer semplificato del body dentro i pannelli ─────

function ReadableBodyInTab({ body, compact = false }: { body: string; compact?: boolean }) {
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="reading-flow min-w-0 overflow-hidden text-slate-700">
      {blocks.map((block, idx) => {
        // Callout
        if (block.startsWith("@@CALLOUT:") || block.includes("\n@@CALLOUT:")) {
          const text = block.replace(/@@CALLOUT:/g, "").trim();
          return (
            <CalloutBoxFromText
              key={idx}
              text={text}
              renderInline={renderInline}
            />
          );
        }
        // Codice
        if (block.startsWith("@@CODE:")) {
          return <pre key={idx}><code>{block.replace(/^@@CODE:/, "").trim()}</code></pre>;
        }
        // Subhead — già consumati come titoli accordion in ESPLORA; qui passthrough
        if (block.startsWith("@@SUBHEAD:")) {
          return (
            <h3 key={idx} className="mt-6 text-lg font-black text-slate-950 first:mt-0">
              {renderInline(block.replace(/^@@SUBHEAD:/, "").trim())}
            </h3>
          );
        }

        // Tabella Markdown inline
        if (isTableBlock(block)) {
          return <ReadableTable key={idx} block={block} />;
        }

        // Bullet list (• )
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length > 1 && lines.every((l) => l.startsWith("• "))) {
          return (
            <ul key={idx} className="mt-4 list-disc space-y-2 pl-6 marker:text-emerald-700">
              {lines.map((l, li) => <li key={li}>{renderInline(l.replace(/^•\s+/, ""))}</li>)}
            </ul>
          );
        }
        // Ordered list
        if (lines.length > 1 && lines.every((l) => /^\d+\.\s+/.test(l))) {
          return (
            <ol key={idx} className="mt-4 list-decimal space-y-2 pl-6 marker:font-bold marker:text-emerald-700">
              {lines.map((l, li) => <li key={li}>{renderInline(l.replace(/^\d+\.\s+/, ""))}</li>)}
            </ol>
          );
        }

        return (
          <p key={idx} className="whitespace-pre-line">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}

// ── isTableBlock / ReadableTable (copie ridotte dalla page originale) ─────────

function isTableBlock(block: string): boolean {
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return false;
  return lines[0].startsWith("|") && lines.some((l) => /^\|?[\s:-]+\|[\s|:-]+$/.test(l));
}

function ReadableTable({ block }: { block: string }) {
  const allLines = block.split("\n").map((l) => l.trim()).filter(Boolean);
  const dataLines = allLines.filter(
    (l) => l.startsWith("|") && !/^\|?[\s:-]+\|[\s|:-]+$/.test(l),
  );
  const rows = dataLines.map((line) =>
    line.split("|").map((c) => c.replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1").trim()).filter((c) => c !== ""),
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
                  {renderInline(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} className="odd:bg-white even:bg-slate-50">
                {row.map((cell, ci) => (
                  <td key={`${ri}-${ci}`} className="border-b border-slate-100 px-3 py-2.5 align-top text-slate-700 sm:px-4 sm:py-3">
                    {renderInline(cell)}
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

// ── ZonePanel — render di ogni singola zona ───────────────────────────────────

function ZonePanel({
  tabId,
  section,
  mc,
  hookAudioSrc,
  hookTranscript,
  videoPlaylist,
  visuals,
  agisciRawBody,
  areaHex,
  resourcesSummary,
  onNavigate,
  text,
  quizData,
  flashcards,
}: {
  tabId: string;
  section: { title: string; body: string } | undefined;
  mc: MC;
  hookAudioSrc: string | null;
  hookTranscript: string | null;
  videoPlaylist: VideoItem[];
  visuals: VisualAsset[];
  agisciRawBody: string;
  areaHex?: string;
  /** P1.3 — risorse aggregate per ResourcesPanel in INNESCA */
  resourcesSummary?: ResourcesSummary;
  /** P1.3 — naviga programmaticamente ad altra zona */
  onNavigate?: (zoneId: string) => void;
  text?: MCTextContent | null;
  quizData?: QuizQuestion[] | null;
  flashcards?: FlashcardItem[];
}) {
  // ── RIPASSA — non dipende da sezione MD, render sempre ───────────────────
  if (tabId === "RIPASSA") {
    return (
      <div className="space-y-8 px-4 py-6 sm:px-6">
        {/* Quiz interattivo */}
        {quizData && quizData.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
              🎯 Quiz di autovalutazione
            </p>
            <QuizWidget
              mcId={mc.id}
              livello={mc.outputApp.livelloDigComp === "H" ? "A" : mc.outputApp.livelloDigComp as "F" | "I" | "A"}
              quizData={quizData}
            />
          </div>
        )}

        {/* Flashcard deck */}
        {flashcards && flashcards.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
              🃏 Flashcard
            </p>
            <FlashcardDeck cards={flashcards} mcTitolo={mc.titolo} />
          </div>
        )}

        {(!quizData || quizData.length === 0) && (!flashcards || flashcards.length === 0) && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm text-slate-500">
              Quiz e flashcard per questa MC saranno disponibili prossimamente.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (!section) {
    return (
      <div className="px-4 py-10 text-center text-slate-400 sm:px-6">
        <p className="text-sm">Contenuto non ancora disponibile.</p>
      </div>
    );
  }

  const body = section.body;

  // ── INNESCA ──────────────────────────────────────────────────────────────
  if (tabId === "INNESCA") {
    const hookTitle = mc.hook_audio?.titolo ?? `Hook audio — ${mc.titolo}`;
    const domanda = mc.hook_audio?.domanda_avvio;
    const flippedVideos = videoPlaylist.slice(0, 3);

    return (
      <div className="space-y-5 px-4 py-6 sm:px-6">
        {hookAudioSrc && (
          <AudioPlayer
            src={hookAudioSrc}
            titolo={hookTitle}
            durata={mc.hook_audio?.durata_min}
            transcript={hookTranscript ?? undefined}
          />
        )}
        {domanda && (
          <p className="rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-base font-bold leading-snug text-yellow-900 sm:text-lg">
            💬 {domanda}
          </p>
        )}
        <ReadableBodyInTab body={body} />
        {flippedVideos.length > 0 && <FlippedVideos videos={flippedVideos} />}
        {/* P1.3 — Resources Panel */}
        {resourcesSummary && (
          <ResourcesPanel
            summary={resourcesSummary}
            onNavigate={onNavigate}
            areaHex={areaHex}
            className="mt-2"
          />
        )}
      </div>
    );
  }

  // ── ESPLORA — AccordionSection ────────────────────────────────────────────
  if (tabId === "ESPLORA") {
    const accordionItems = splitEsploraIntoAccordion(body);
    const items: AccordionItem[] = accordionItems.map((ai) => ({
      id: ai.id,
      title: ai.title,
      children: <ReadableBodyInTab body={ai.body} />,
    }));

    return (
      <div className="px-4 py-4 sm:px-6">
        <AccordionSection items={items} defaultFirstOpen areaHex={areaHex} />
        {/* Galleria visual aggiuntiva dopo ESPLORA */}
        {visuals.length > 1 && (
          <div className="mt-8">
            <p className="mb-4 text-xs font-black uppercase tracking-wide text-slate-500">Galleria visuale</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {visuals.slice(1).map((asset) => (
                <MCVisual key={asset.src} asset={asset} alt={`${asset.label} per ${mc.titolo}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── OSSERVA ───────────────────────────────────────────────────────────────
  if (tabId === "OSSERVA") {
    const { professioneText, bodyWithout } = extractProfessioneSection(body);

    return (
      <div className="px-4 py-6 sm:px-6">
        {/* Testo OSSERVA senza la sezione professione (evita duplicazione) */}
        <ReadableBodyInTab body={bodyWithout} />

        {/* Professione del Futuro — immagine + testo narrativo dal MD + dati JSON */}
        {mc.professione_futura?.titolo && (
          <ProfessioneCard
            professione={mc.professione_futura as { titolo: string; orizzonte?: string; descrizione_breve?: string; competenze_chiave?: string[] }}
            professioneText={professioneText}
            mcId={mc.id}
            areaHex={areaHex}
          />
        )}

        {/* Gallery video YouTube — 9 video */}
        {videoPlaylist.length > 3 && (
          <div className="mt-8">
            <VideoGallery videos={videoPlaylist.slice(3, 12)} mcTitolo={mc.titolo} />
          </div>
        )}
      </div>
    );
  }

  // ── SPERIMENTA — LevelTabs ────────────────────────────────────────────────
  if (tabId === "SPERIMENTA") {
    const levelSections = splitSperimentaByLevel(body);
    const mcLevel = mc.outputApp.livelloDigComp === "H" ? "A" : (mc.outputApp.livelloDigComp as DigCompLevel);
    const dotsMap: Record<DigCompLevel, string> = { F: "●", I: "●●", A: "●●●" };

    const levelTabs = levelSections.map((ls) => ({
      level: ls.level,
      label: LEVEL_LABEL[ls.level],
      dots: dotsMap[ls.level],
      children: <ReadableBodyInTab body={ls.body} compact />,
    }));

    return (
      <div className="px-4 py-6 sm:px-6">
        {levelTabs.length > 1 ? (
          <LevelTabs tabs={levelTabs} defaultLevel={mcLevel} />
        ) : (
          <ReadableBodyInTab body={body} compact />
        )}
      </div>
    );
  }

  // ── AGISCI ────────────────────────────────────────────────────────────────
  if (tabId === "AGISCI") {
    // Rimuove la rubrica dal body inline: è già accessibile tramite il drawer
    const bodyWithoutRubrica = stripRubricaFromBody(body);
    return (
      <div className="px-4 py-6 sm:px-6">
        {/* Rubrica — solo bottone, si apre in drawer */}
        <div className="mb-6">
          <RubricaDrawer agisciBody={agisciRawBody} areaHex={areaHex} />
        </div>
        <ReadableBodyInTab body={bodyWithoutRubrica} />
      </div>
    );
  }

  // Fallback
  return (
    <div className="px-4 py-6 sm:px-6">
      <ReadableBodyInTab body={body} />
    </div>
  );
}

const LEVEL_LABEL: Record<DigCompLevel, string> = {
  F: "Base",
  I: "Intermedio",
  A: "Avanzato",
};

// ── Componente principale ────────────────────────────────────────────────────

export function MCPageClient({
  mc,
  areaHex,
  text,
  hookAudioSrc,
  hookTranscript,
  quizData,
  flashcards,
  videoPlaylist,
  visuals,
  microlearningData,
}: MCPageClientProps) {
  // Pre-computa la sezione APPENDICE (fuori dai 5 tab)
  const appendiceSection = useMemo(() => {
    if (!text) return null;
    return text.sections.find((s) => /APPENDICE/i.test(s.title)) ?? null;
  }, [text]);

  // Mappa le sezioni per tabId — esclude APPENDICE e NOTE DI EDITING
  const sectionMap = useMemo(() => {
    if (!text) return new Map<string, { title: string; body: string }>();
    const map = new Map<string, { title: string; body: string }>();
    for (const s of text.sections) {
      const tabId = sectionToTabId(s.title);
      if (tabId) map.set(tabId, s);
    }
    return map;
  }, [text]);

  // Tab con contenuto MD + RIPASSA (sempre presente, non dipende dal Markdown)
  const ALWAYS_VISIBLE = new Set(["RIPASSA"]);
  const availableTabs = ZONE_TABS.filter((tab) => sectionMap.has(tab.id) || ALWAYS_VISIBLE.has(tab.id));
  const tabs = availableTabs.length > 0 ? availableTabs : ZONE_TABS;

  const agisciRawBody = getAgisciRawBody(text);
  const mcLevel = mc.outputApp.livelloDigComp === "H" ? "A" : (mc.outputApp.livelloDigComp as DigCompLevel);

  // Scroll al top ad ogni apertura di pagina MC
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [mc.id]);

  // P1.3 — stato navigazione condiviso per ResourcesPanel.onNavigate
  const [forcedTab, setForcedTab] = useState<string | null>(null);
  const navigateToTab = useCallback((tabId: string) => setForcedTab(tabId), []);

  // Contatori risorse per ResourcesPanel
  const resourcesSummary = useMemo(() => ({
    hasAudio: !!hookAudioSrc,
    videoCount: videoPlaylist.length,
    flashcardCount: flashcards.length,
    quizCount: quizData ? quizData.length : 0,
    visualCount: visuals.length,
  }), [hookAudioSrc, videoPlaylist, flashcards, quizData, visuals]);

  return (
    <div className="flex flex-col">
      {/* ── 5-zone navigator ── */}
      <MCNavigator tabs={tabs} areaHex={areaHex} forcedActiveId={forcedTab} onForcedTabConsumed={() => setForcedTab(null)}>
        {(activeId) => (
          <ZonePanel
            tabId={activeId}
            section={sectionMap.get(activeId)}
            mc={mc}
            hookAudioSrc={hookAudioSrc}
            hookTranscript={hookTranscript}
            videoPlaylist={videoPlaylist}
            visuals={visuals}
            agisciRawBody={agisciRawBody}
            areaHex={areaHex}
            resourcesSummary={resourcesSummary}
            onNavigate={navigateToTab}
            text={text}
            quizData={quizData}
            flashcards={flashcards}
          />
        )}
      </MCNavigator>

      {/* ── APPENDICE — fuori dai tab, sempre visibile ── */}
      {appendiceSection && (
        <section className="border-t border-slate-200 bg-slate-50 px-4 py-8 sm:px-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-600">
              📎 Appendice
            </span>
            <span className="text-sm font-semibold text-slate-500">{appendiceSection.title.replace(/APPENDICE\s*[—-]?\s*/i, "")}</span>
          </div>
          <ReadableBodyInTab body={appendiceSection.body} />
        </section>
      )}
    </div>
  );
}
