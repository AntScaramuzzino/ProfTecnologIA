"use client";

/**
 * SintesiCornell — Sintesi in stile Cornell per il ripasso
 *
 * Struttura classica Cornell Note-Taking:
 * ┌─────────────────────────┬──────────────────────────────┐
 * │  Colonna cue            │  Corpo principale (note)     │
 * │  (parole chiave,        │  Punti chiave estratti dal   │
 * │   domande guida)        │  contenuto ESPLORA           │
 * ├─────────────────────────┴──────────────────────────────┤
 * │  Riepilogo (Summary) — 2-3 frasi sintetiche            │
 * └────────────────────────────────────────────────────────┘
 */

import type { MC } from "@/lib/mc-loader";
import type { MCTextContent } from "@/lib/content-loader";

interface SintesiCornellProps {
  mc: MC;
  text: MCTextContent | null;
  areaHex?: string;
}

/** Estrae i punti chiave dal body ESPLORA — prende le prime frasi di ogni paragrafo */
function estraiPuntiChiave(body: string, max = 6): string[] {
  const punti: string[] = [];
  const paragrafi = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  for (const p of paragrafi) {
    if (punti.length >= max) break;
    // Salta intestazioni, code block, tabelle, immagini
    if (/^#{1,4}\s|^```|^\|/.test(p)) continue;
    // Estrai il testo rimuovendo markdown
    const testo = p
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
      .replace(/`[^`]+`/g, "")
      .replace(/^[-*>]\s+/, "")
      .trim();
    // Prendi solo la prima frase (fino al punto)
    const primafrase = testo.split(/[.!?]/)[0]?.trim();
    if (primafrase && primafrase.length > 20 && primafrase.length < 200) {
      punti.push(primafrase + ".");
    }
  }
  return punti;
}

/** Genera le domande guida dai tag della MC */
function generaDomande(mc: MC): string[] {
  const domande: string[] = [];
  // Domanda principale dal titolo
  domande.push(`Cosa significa "${mc.titolo}"?`);
  // Dal compito di realtà
  if (mc.compito_realta) {
    const verbo = mc.compito_realta.split(" ").slice(0, 3).join(" ");
    domande.push(`Come si fa a ${verbo.toLowerCase()}...?`);
  }
  // Dai tag
  const tagUtili = mc.tags.filter(
    (t) => !["classe-1", "classe-2", "classe-3", "foundation", "MAT", "DIS", "DIG", "ALI", "AMB", "ENE", "COM", "SIS", "INF"].includes(t)
  );
  for (const tag of tagUtili.slice(0, 3)) {
    domande.push(`Che cos'è ${tag}?`);
  }
  return domande.slice(0, 5);
}

export default function SintesiCornell({ mc, text, areaHex }: SintesiCornellProps) {
  // Estrai body ESPLORA
  const esploraSection = text?.sections.find((s) => /ESPLORA/i.test(s.title));
  const puntiChiave = estraiPuntiChiave(esploraSection?.body ?? "");
  const domande = generaDomande(mc);

  const accent = areaHex ?? "#10B981";
  const accentLight = `${accent}15`;
  const accentBorder = `${accent}40`;

  return (
    <div
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{ borderColor: accentBorder }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-3"
        style={{ backgroundColor: accentLight, borderBottom: `1px solid ${accentBorder}` }}
      >
        <span className="text-base" aria-hidden="true">📝</span>
        <span className="text-xs font-black uppercase tracking-widest text-slate-500">
          Sintesi Cornell
        </span>
        <span className="ml-auto text-xs text-slate-400">
          Usa questo schema per ripassare
        </span>
      </div>

      {/* Griglia Cornell — colonna cue + corpo */}
      <div className="grid sm:grid-cols-[220px_1fr]">
        {/* Colonna sinistra — domande guida */}
        <div
          className="border-b border-slate-100 px-4 py-5 sm:border-b-0 sm:border-r"
          style={{ borderColor: accentBorder }}
        >
          <p
            className="mb-3 text-[10px] font-black uppercase tracking-widest"
            style={{ color: accent }}
          >
            Domande guida
          </p>
          <ol className="space-y-2.5">
            {domande.map((d, i) => (
              <li key={i} className="flex gap-2">
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
                  style={{ backgroundColor: accent }}
                >
                  {i + 1}
                </span>
                <span className="text-xs leading-5 text-slate-600">{d}</span>
              </li>
            ))}
          </ol>

          {/* Parole chiave */}
          <div className="mt-5">
            <p
              className="mb-2 text-[10px] font-black uppercase tracking-widest"
              style={{ color: accent }}
            >
              Parole chiave
            </p>
            <div className="flex flex-wrap gap-1">
              {mc.tags
                .filter((t) => !["classe-1", "classe-2", "classe-3", "foundation"].includes(t))
                .slice(0, 8)
                .map((tag) => (
                  <span
                    key={tag}
                    className="rounded border px-1.5 py-0.5 font-mono text-[10px] text-slate-600"
                    style={{ borderColor: accentBorder, backgroundColor: accentLight }}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Corpo — punti chiave */}
        <div className="px-5 py-5">
          <p
            className="mb-3 text-[10px] font-black uppercase tracking-widest"
            style={{ color: accent }}
          >
            Punti principali
          </p>
          {puntiChiave.length > 0 ? (
            <ul className="space-y-2.5">
              {puntiChiave.map((punto, i) => (
                <li key={i} className="flex gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: accent }}
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-6 text-slate-700">{punto}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-slate-400">
              Leggi la sezione ESPLORA per estrarre i punti principali.
            </p>
          )}

          {/* Compito come ancoraggio pratico */}
          {mc.compito_realta && (
            <div
              className="mt-5 rounded-lg border px-4 py-3"
              style={{ borderColor: accentBorder, backgroundColor: accentLight }}
            >
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Applicazione pratica
              </p>
              <p className="text-xs leading-5 text-slate-700">{mc.compito_realta}</p>
            </div>
          )}
        </div>
      </div>

      {/* Riepilogo Cornell — fascia inferiore */}
      <div
        className="border-t px-5 py-4"
        style={{ borderColor: accentBorder, backgroundColor: `${accent}08` }}
      >
        <p
          className="mb-2 text-[10px] font-black uppercase tracking-widest"
          style={{ color: accent }}
        >
          Riepilogo in 3 righe
        </p>
        <p className="text-sm leading-6 text-slate-700">
          {mc.descrizione}
        </p>
        {mc.frameworks?.EV?.nota && (
          <p className="mt-2 text-xs leading-5 text-slate-500 italic">
            SDG {mc.sdg?.[0]} — {mc.frameworks.EV.nota}
          </p>
        )}
      </div>
    </div>
  );
}
