"use client";

/**
 * MappaConcettuale — Mappa visiva dei concetti chiave di una MC
 *
 * Layout: concetto centrale → rami principali → foglie
 *
 *           [tag1]      [tag2]
 *              \          /
 *         [AREA] ─ [TITOLO] ─ [SDG]
 *              /          \
 *           [tag3]      [tag4]
 */

import type { MC } from "@/lib/mc-loader";
import { AREA_META } from "@/lib/mc-loader";

interface MappaConcettualeProps {
  mc: MC;
  areaHex?: string;
}

interface Nodo {
  label: string;
  tipo: "centro" | "ramo" | "foglia";
  colore?: string;
}

export default function MappaConcettuale({ mc, areaHex }: MappaConcettualeProps) {
  const accent = areaHex ?? "#10B981";
  const area = AREA_META[mc.area];

  // Costruisce i nodi principali dal JSON della MC
  const tags = mc.tags
    .filter((t) => !["classe-1", "classe-2", "classe-3", "foundation", "intermediate", "advanced"].includes(t.toLowerCase()))
    .slice(0, 6);

  const rami = [
    { label: `${area?.emoji ?? ""} ${area?.label ?? mc.area}`, colore: accent },
    { label: `SDG ${mc.sdg?.[0] ?? ""}`, colore: "#f59e0b" },
    { label: `DigComp ${mc.outputApp.livelloDigComp}`, colore: "#6366f1" },
    mc.professione_futura ? { label: mc.professione_futura.titolo, colore: "#10b981" } : null,
  ].filter(Boolean) as { label: string; colore: string }[];

  return (
    <div
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{ borderColor: `${accent}40` }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-3"
        style={{ backgroundColor: `${accent}15`, borderBottom: `1px solid ${accent}30` }}
      >
        <span className="text-base" aria-hidden="true">🗺️</span>
        <span className="text-xs font-black uppercase tracking-widest text-slate-500">
          Mappa concettuale
        </span>
      </div>

      {/* Mappa SVG */}
      <div className="p-5">
        <svg
          viewBox="0 0 700 380"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          role="img"
          aria-label={`Mappa concettuale di ${mc.titolo}`}
        >
          {/* ── Nodo centrale ── */}
          <g>
            <rect x="230" y="155" width="240" height="70" rx="12"
              fill={accent} />
            <text x="350" y="185" textAnchor="middle" fill="white"
              fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">
              {mc.titolo.length > 35 ? mc.titolo.slice(0, 32) + "…" : mc.titolo}
            </text>
            <text x="350" y="205" textAnchor="middle" fill="white"
              fontSize="9" fontFamily="system-ui, sans-serif" opacity="0.85">
              {mc.id}
            </text>
          </g>

          {/* ── Rami principali (sinistra) ── */}
          {rami.slice(0, 2).map((ramo, i) => {
            const x = 40, y = i === 0 ? 120 : 230;
            return (
              <g key={`ramo-sx-${i}`}>
                <line x1={x + 140} y1={y + 16} x2={230} y2={i === 0 ? 175 : 200}
                  stroke={ramo.colore} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
                <rect x={x} y={y} width="140" height="32" rx="8"
                  fill={`${ramo.colore}20`} stroke={ramo.colore} strokeWidth="1.5" />
                <text x={x + 70} y={y + 20} textAnchor="middle" fill={ramo.colore}
                  fontSize="9.5" fontWeight="700" fontFamily="system-ui, sans-serif">
                  {ramo.label.length > 22 ? ramo.label.slice(0, 20) + "…" : ramo.label}
                </text>
              </g>
            );
          })}

          {/* ── Rami principali (destra) ── */}
          {rami.slice(2, 4).map((ramo, i) => {
            const x = 520, y = i === 0 ? 120 : 230;
            return (
              <g key={`ramo-dx-${i}`}>
                <line x1={x} y1={y + 16} x2={470} y2={i === 0 ? 175 : 200}
                  stroke={ramo.colore} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
                <rect x={x} y={y} width="140" height="32" rx="8"
                  fill={`${ramo.colore}20`} stroke={ramo.colore} strokeWidth="1.5" />
                <text x={x + 70} y={y + 20} textAnchor="middle" fill={ramo.colore}
                  fontSize="9.5" fontWeight="700" fontFamily="system-ui, sans-serif">
                  {ramo.label.length > 22 ? ramo.label.slice(0, 20) + "…" : ramo.label}
                </text>
              </g>
            );
          })}

          {/* ── Tag / foglie (in alto e in basso) ── */}
          {tags.slice(0, 3).map((tag, i) => {
            const positions = [
              { x: 150, y: 30 }, { x: 290, y: 20 }, { x: 430, y: 30 },
            ];
            const pos = positions[i];
            return (
              <g key={`tag-top-${i}`}>
                <line x1={pos.x + 60} y1={pos.y + 18} x2={280 + i * 70} y2={155}
                  stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                <rect x={pos.x} y={pos.y} width="120" height="26" rx="6"
                  fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                <text x={pos.x + 60} y={pos.y + 17} textAnchor="middle"
                  fill="#475569" fontSize="8.5" fontFamily="system-ui, sans-serif">
                  {tag.length > 17 ? tag.slice(0, 15) + "…" : tag}
                </text>
              </g>
            );
          })}

          {tags.slice(3, 6).map((tag, i) => {
            const positions = [
              { x: 150, y: 330 }, { x: 290, y: 340 }, { x: 430, y: 330 },
            ];
            const pos = positions[i];
            return (
              <g key={`tag-bot-${i}`}>
                <line x1={pos.x + 60} y1={pos.y} x2={280 + i * 70} y2={225}
                  stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                <rect x={pos.x} y={pos.y} width="120" height="26" rx="6"
                  fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                <text x={pos.x + 60} y={pos.y + 17} textAnchor="middle"
                  fill="#475569" fontSize="8.5" fontFamily="system-ui, sans-serif">
                  {tag.length > 17 ? tag.slice(0, 15) + "…" : tag}
                </text>
              </g>
            );
          })}

          {/* ── Legenda ── */}
          <g opacity="0.7">
            <rect x="10" y="355" width="10" height="10" rx="2" fill={accent} />
            <text x="25" y="364" fill="#64748b" fontSize="8" fontFamily="system-ui, sans-serif">
              Area tematica
            </text>
            <rect x="130" y="355" width="10" height="10" rx="2" fill="#f1f5f9"
              stroke="#cbd5e1" />
            <text x="145" y="364" fill="#64748b" fontSize="8" fontFamily="system-ui, sans-serif">
              Concetti chiave
            </text>
          </g>
        </svg>

        {/* Connessioni testuali — per screen reader e stampa */}
        <div className="sr-only">
          <h3>Mappa concettuale: {mc.titolo}</h3>
          <p>Area: {area?.label}</p>
          <p>Concetti chiave: {tags.join(", ")}</p>
          <p>Livello DigComp: {mc.outputApp.livelloDigComp}</p>
          {mc.sdg?.[0] && <p>SDG collegato: {mc.sdg?.[0]}</p>}
        </div>
      </div>
    </div>
  );
}
