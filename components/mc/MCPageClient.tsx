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
import { useProgress } from "@/lib/useProgress";
import { MCNavigator, type NavigatorTab } from "@/components/mc/MCNavigator";
import { AccordionSection, type AccordionItem } from "@/components/mc/AccordionSection";
import { LevelTabs, type DigCompLevel } from "@/components/mc/LevelTabs";
import ChecklistWidget from "@/components/mc/ChecklistWidget";
import ProcessWidget from "@/components/mc/ProcessWidget";
import { CalloutBoxFromText } from "@/components/mc/CalloutBox";
import { RubricaDrawer } from "@/components/mc/RubricaDrawer";
import AudioPlayer from "@/components/mc/AudioPlayer";
import FlippedVideos from "@/components/mc/FlippedVideos";
import QuizWidget from "@/components/mc/QuizWidget";
import FlashcardDeck from "@/components/mc/FlashcardDeck";
import VideoGallery from "@/components/mc/VideoGallery";
import MCVisual from "@/components/MCVisual";
import MCImageCarousel from "@/components/mc/MCImageCarousel";
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
  /** Slide della presentazione (deck NotebookLM → immagini) per il carosello in apertura di ESPLORA */
  deckSlides?: VisualAsset[];
}

// ── Mapping sezione MD → tab ID ──────────────────────────────────────────────

const ZONE_TABS: NavigatorTab[] = [
  { id: "INNESCA",      label: "INNESCA",      emoji: "⚡" },
  { id: "ESPLORA",      label: "ESPLORA",      emoji: "📖" },
  { id: "OSSERVA",      label: "OSSERVA",      emoji: "🔍" },
  { id: "SPERIMENTA",   label: "SPERIMENTA",   emoji: "🔬" },
  { id: "AGISCI",       label: "AGISCI",       emoji: "🌍" },
  { id: "RIPASSA",      label: "RIPASSA",      emoji: "🃏" },
  { id: "PROFESSIONE",  label: "PROFESSIONI",  emoji: "💼" },
  { id: "CLIL",         label: "CLIL",         emoji: "📎" },
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
  microlearningData,
  deckSlides = [],
  professioneText,
  appendiceSection,
  onQuizComplete,
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
  microlearningData?: MicrolearningInteractives | null;
  /** Slide della presentazione (deck NotebookLM → immagini) mostrate in apertura di ESPLORA */
  deckSlides?: VisualAsset[];
  /** Testo narrativo "Professione del Futuro" estratto dal body OSSERVA */
  professioneText?: string;
  /** Sezione APPENDICE — mostrata solo dentro il tab CLIL */
  appendiceSection?: { title: string; body: string } | null;
  /** Callback al termine del quiz — forwarded a useProgress.recordQuizResult */
  onQuizComplete?: (score: number, total: number, level: "F" | "I" | "A") => void;
}) {
  // ── RIPASSA — non dipende da sezione MD, render sempre ───────────────────
  if (tabId === "RIPASSA") {
    // Seleziona la migliore sketchnote: preferisce playground-densa, poi ripassa-sketchnote base
    const sketchnoteAssets = visuals.filter((v) => v.label === "Ripassa");
    const bestSketchnote =
      sketchnoteAssets.find((v) => v.src.includes("playground-densa")) ??
      sketchnoteAssets[0] ??
      null;

    return (
      <div className="space-y-8 px-4 py-6 sm:px-6">

        {/* Sketchnote di ripasso — visual sintetica degli elementi chiave */}
        {bestSketchnote && (
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
              🖊️ Sketchnote di ripasso
            </p>
            <MCVisual asset={bestSketchnote} alt={`Sketchnote di ripasso — ${mc.titolo}`} />
          </div>
        )}

        {/* Process — passi chiave del concetto */}
        {microlearningData?.process && (
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
              🔄 Processo
            </p>
            <ProcessWidget
              titolo={microlearningData.process.titolo}
              steps={microlearningData.process.steps}
              areaHex={areaHex}
            />
          </div>
        )}

        {/* Checklist — attività di verifica pratica */}
        {microlearningData?.checklist && (
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
              ✅ Checklist
            </p>
            <ChecklistWidget
              titolo={microlearningData.checklist.titolo}
              istruzione={microlearningData.checklist.istruzione}
              voci={microlearningData.checklist.voci}
              areaHex={areaHex}
            />
          </div>
        )}

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
              onComplete={onQuizComplete}
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

        {!bestSketchnote && !microlearningData && (!quizData || quizData.length === 0) && (!flashcards || flashcards.length === 0) && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm text-slate-500">Contenuti di ripasso in arrivo.</p>
          </div>
        )}
      </div>
    );
  }

  // ── PROFESSIONI DEL FUTURO — tab dedicato dopo RIPASSA ─────────────────
  if (tabId === "PROFESSIONE") {
    // Usa professioni_future (array) se presente, altrimenti fallback su professione_futura
    const profList = mc.professioni_future?.length
      ? mc.professioni_future
      : mc.professione_futura?.titolo
        ? [mc.professione_futura as { titolo: string; orizzonte?: string; descrizione_breve?: string; competenze_chiave?: string[] }]
        : [];

    if (profList.length === 0) {
      return (
        <div className="px-4 py-6 sm:px-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm text-slate-500">Dati professione non disponibili.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 py-6 sm:px-6 space-y-2">
        {/* Intro header */}
        <div className="mb-2">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            🚀 Professioni del Futuro — orizzonte 2030
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {profList.length > 1
              ? `${profList.length} ruoli professionali collegati a questa micro-competenza`
              : "Ruolo professionale collegato a questa micro-competenza"}
          </p>
        </div>

        {profList.map((prof, idx) => (
          <ProfessioneCard
            key={idx}
            professione={prof}
            professioneText={idx === 0 ? (professioneText ?? "") : ""}
            mcId={mc.id}
            areaHex={areaHex}
            imageIndex={idx}
          />
        ))}
      </div>
    );
  }

  // ── CLIL — AppendiceTech in English (vocabulario + Appendice MD) ──────────
  if (tabId === "CLIL") {
    const terms = mc.clil_termini ?? [];
    return (
      <div className="px-4 py-6 sm:px-6 space-y-8">
        {/* Vocabolario CLIL */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              📎 Tech Vocabulary
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Key technical terms for this unit — Italian · English · IPA pronunciation.
            </p>
          </div>

          {terms.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {terms.map((t, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Fascia colore area */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: areaHex ?? "#94a3b8" }}
                  />
                  <div className="p-4">
                    {/* Italiano */}
                    <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      IT
                    </p>
                    <p className="text-sm font-semibold text-slate-600">{t.italiano}</p>

                    {/* English + IPA */}
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        EN
                      </p>
                      <p
                        className="text-lg font-black leading-tight"
                        style={{ color: areaHex ?? "#1e293b" }}
                      >
                        {t.inglese}
                      </p>
                      {t.pronuncia_ipa && (
                        <p className="mt-1 font-mono text-xs text-slate-500">
                          {t.pronuncia_ipa}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-8 text-center">
              <p className="text-sm text-slate-500">No CLIL terms available for this unit.</p>
            </div>
          )}
        </div>

        {/* AppendiceTech in English — solo qui dentro il tab CLIL */}
        {appendiceSection && (
          <div className="border-t border-slate-200 pt-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-600">
                📖 AppendiceTech in English
              </span>
              <span className="text-sm font-semibold text-slate-500">
                {appendiceSection.title.replace(/APPENDICE\s*[—-]?\s*/i, "")}
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-5">
              <ReadableBodyInTab body={appendiceSection.body} />
            </div>
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
        {/* Presentazione — deck NotebookLM come carosello di slide, in apertura di ESPLORA */}
        {deckSlides.length > 0 && (
          <div className="mb-8">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
              📽️ Presentazione — esplora con le slide
            </p>
            <MCImageCarousel visuals={deckSlides} mcTitolo={mc.titolo} />
          </div>
        )}
        <AccordionSection items={items} defaultFirstOpen areaHex={areaHex} />
        {/* Galleria visual con carosello e zoom — esclude sketchnote (stanno in RIPASSA) */}
        {visuals.filter((v) => v.label !== "Ripassa").length > 0 && (
          <div className="mt-8">
            <p className="mb-4 text-xs font-black uppercase tracking-wide text-slate-500">Galleria visuale</p>
            <MCImageCarousel visuals={visuals.filter((v) => v.label !== "Ripassa")} mcTitolo={mc.titolo} />
          </div>
        )}
      </div>
    );
  }

  // ── OSSERVA ───────────────────────────────────────────────────────────────
  if (tabId === "OSSERVA") {
    return (
      <div className="px-4 py-6 sm:px-6">
        {/* Il body arriva già senza la sezione Professione (estratta in MCPageClient) */}
        <ReadableBodyInTab body={body} />

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
    const bodyWithoutRubrica = stripRubricaFromBody(body);
    // Supporta sia un singolo compito_realta (stringa) sia l'array compiti_realta
    const compiti: string[] = mc.compiti_realta?.length
      ? mc.compiti_realta
      : mc.compito_realta
        ? [mc.compito_realta]
        : [];

    return (
      <div className="space-y-6 px-4 py-6 sm:px-6">

        {/* ── Compito/i di Realtà ─────────────────────────────────────────── */}
        {compiti.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
              🎯 {compiti.length > 1 ? "Compiti di Realtà" : "Compito di Realtà"}
            </p>
            <div className="space-y-3">
              {compiti.map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-amber-200 bg-amber-50 p-4"
                  style={{ borderLeftColor: areaHex ?? "#f59e0b", borderLeftWidth: 4 }}
                >
                  {compiti.length > 1 && (
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-amber-500">
                      Compito {i + 1}
                    </p>
                  )}
                  <p className="text-sm font-bold leading-6 text-amber-950">{c}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Differenziazione ────────────────────────────────────────────── */}
        {mc.note_didattiche && (
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
              ⚖️ Differenziazione
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600">
                  ● Base
                </p>
                <p className="text-sm leading-6 text-blue-900">{mc.note_didattiche.base}</p>
              </div>
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-orange-600">
                  ●●● Avanzato
                </p>
                <p className="text-sm leading-6 text-orange-900">{mc.note_didattiche.avanzato}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Rubrica + corpo AGISCI dal markdown ─────────────────────────── */}
        <div>
          <div className="mb-6">
            <RubricaDrawer agisciBody={agisciRawBody} areaHex={areaHex} />
          </div>
          <ReadableBodyInTab body={bodyWithoutRubrica} />
        </div>
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
  deckSlides = [],
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

  // Estrae il blocco "Professione del Futuro" da OSSERVA e lo rimuove dal body:
  // il blocco viene spostato nella sezione standalone sotto il navigator.
  const { professioneText, sectionMapClean } = useMemo(() => {
    const osserva = sectionMap.get("OSSERVA");
    if (!osserva?.body || !mc.professione_futura?.titolo) {
      return { professioneText: "", sectionMapClean: sectionMap };
    }
    const extracted = extractProfessioneSection(osserva.body);
    const map = new Map(sectionMap);
    map.set("OSSERVA", { ...osserva, body: extracted.bodyWithout });
    return { professioneText: extracted.professioneText, sectionMapClean: map };
  }, [sectionMap, mc.professione_futura]);

  // Tab con contenuto MD + tab speciali (non dipendono dal Markdown)
  const availableTabs = ZONE_TABS.filter((tab) => {
    if (tab.id === "RIPASSA") return true;
    if (tab.id === "PROFESSIONE") return !!(mc.professioni_future?.length || mc.professione_futura?.titolo);
    if (tab.id === "CLIL") return (mc.clil_termini?.length ?? 0) > 0 || !!appendiceSection;
    return sectionMapClean.has(tab.id);
  });
  const tabs = availableTabs.length > 0 ? availableTabs : ZONE_TABS;

  const agisciRawBody = getAgisciRawBody(text);
  const mcLevel = mc.outputApp.livelloDigComp === "H" ? "A" : (mc.outputApp.livelloDigComp as DigCompLevel);

  // ── Tracking progressi studente ──────────────────────────────────────────
  const { markVisited, recordQuizResult } = useProgress();

  // Segna la MC come visitata al primo caricamento
  useEffect(() => {
    markVisited(mc.id, mcLevel);
  }, [mc.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleQuizComplete = useCallback(
    (score: number, total: number, level: "F" | "I" | "A") => {
      recordQuizResult(mc.id, score, total, level);
    },
    [mc.id, recordQuizResult],
  );

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
    deckSlideCount: deckSlides.length,
  }), [hookAudioSrc, videoPlaylist, flashcards, quizData, visuals, deckSlides]);

  return (
    <div className="flex flex-col">
      {/* ── 5-zone navigator ── */}
      <MCNavigator tabs={tabs} areaHex={areaHex} forcedActiveId={forcedTab} onForcedTabConsumed={() => setForcedTab(null)}>
        {(activeId) => (
          <ZonePanel
            tabId={activeId}
            section={sectionMapClean.get(activeId)}
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
            microlearningData={microlearningData}
            deckSlides={deckSlides}
            professioneText={professioneText}
            appendiceSection={appendiceSection}
            onQuizComplete={handleQuizComplete}
          />
        )}
      </MCNavigator>
    </div>
  );
}
