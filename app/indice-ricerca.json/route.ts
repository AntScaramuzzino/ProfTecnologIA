// Indice della ricerca globale: generato al build come file statico /indice-ricerca.json (output: "export").
// La palette in SiteHeader lo scarica solo quando si apre la ricerca, così non pesa sulle pagine.
import fs from "fs";
import path from "path";
import vm from "vm";
import { getAllMCs, AREA_META } from "@/lib/mc-loader";
import { LABORATORI, ESCAPE_ROOMS, GEOGEBRA } from "@/lib/laboratori";
import { ESPLORAZIONI } from "@/lib/esplorazioni";
import { GLOSSARIO } from "@/lib/competenze-glossario";
import type { VoceIndice } from "@/lib/search";

export const dynamic = "force-static";

const unisci = (...parti: (string | string[] | undefined | null | false)[]) =>
  parti.flat().filter(Boolean).join(" · ");

/** I JSON delle MC non sono uniformi: un campo può essere array, oggetto singolo o mancare */
function lista<T>(x: unknown): T[] {
  if (Array.isArray(x)) return x as T[];
  return x && typeof x === "object" ? [x as T] : [];
}

interface NodoEsplorazione {
  titolo?: string;
  testo?: string;
  punti?: { etichetta?: string }[];
  note?: { etichetta?: string }[];
}

function leggiEsplorazione(slug: string): { radice: string; nodi: Record<string, NodoEsplorazione> } | null {
  try {
    const file = path.join(process.cwd(), "public/embeds/esplorazioni", slug, "dati.js");
    const ctx: { window: { ESPLORAZIONE?: { radice: string; nodi: Record<string, NodoEsplorazione> } } } = { window: {} };
    vm.runInNewContext(fs.readFileSync(file, "utf-8"), ctx, { timeout: 1000 });
    return ctx.window.ESPLORAZIONE ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  const mcs = getAllMCs();
  const titoloMC = new Map(mcs.map((m) => [m.id, m.titolo]));
  const voci: VoceIndice[] = [];

  for (const m of mcs) {
    voci.push({
      tipo: "mc",
      titolo: m.titolo,
      sotto: `${m.id} · Classe ${m.anno}ª · ${AREA_META[m.area]?.label ?? m.area}`,
      testo: unisci(
        m.descrizione,
        lista<string>(m.tags).filter((t) => typeof t === "string"),
        lista<{ titolo?: string }>(m.professioni_future ?? m.professione_futura).map((p) => p?.titolo ?? ""),
        lista<{ italiano?: string; inglese?: string }>(m.clil_termini).map((c) => `${c?.italiano ?? ""} ${c?.inglese ?? ""}`.trim()),
      ),
      href: `/mc/${m.id}/`,
      area: m.area,
    });
  }

  for (const l of LABORATORI) {
    voci.push({
      tipo: "laboratorio",
      titolo: l.titolo,
      sotto: `${l.archetipo} · ${l.mcId} ${titoloMC.get(l.mcId) ?? ""}`.trim(),
      testo: l.descrizione,
      href: `/mc/${l.mcId}/#sperimenta`,
      area: l.area,
    });
  }

  for (const e of ESCAPE_ROOMS) {
    voci.push({
      tipo: "escape",
      titolo: e.titolo,
      sotto: `${e.mcId} ${titoloMC.get(e.mcId) ?? ""}`.trim(),
      testo: e.descrizione,
      href: `/mc/${e.mcId}/#sperimenta`,
      area: e.mcId.split("-")[1],
    });
  }

  for (const g of GEOGEBRA) {
    voci.push({
      tipo: "geogebra",
      titolo: g.titolo,
      sotto: `Costruzione con righello e compasso · ${g.mcId}`,
      testo: unisci(g.descrizione, "geogebra righello compasso costruzione"),
      href: `${g.href}/`,
      area: "DIS",
    });
  }

  for (const e of ESPLORAZIONI) {
    voci.push({
      tipo: "esplorazione",
      titolo: e.titolo,
      sotto: `Classe ${e.classe}ª · ${e.scene} scene`,
      testo: unisci(e.descrizione, e.mcId, titoloMC.get(e.mcId)),
      href: `/embeds/esplorazioni/${e.slug}/index.html`,
      statico: true,
      area: e.area,
    });
    const dati = leggiEsplorazione(e.slug);
    if (!dati) continue;
    for (const [id, n] of Object.entries(dati.nodi)) {
      if (id === dati.radice || !n.titolo) continue;
      voci.push({
        tipo: "scena",
        titolo: n.titolo,
        sotto: `dentro «${e.titolo}»`,
        testo: unisci(n.testo, (n.punti ?? []).map((p) => p.etichetta ?? ""), (n.note ?? []).map((p) => p.etichetta ?? "")),
        href: `/embeds/esplorazioni/${e.slug}/index.html#${encodeURIComponent(id)}`,
        statico: true,
        area: e.area,
      });
    }
  }

  for (const [nome, g] of Object.entries(GLOSSARIO)) {
    voci.push({
      tipo: "glossario",
      titolo: nome.charAt(0).toUpperCase() + nome.slice(1),
      sotto: g.categoria,
      testo: g.definizione,
      href: `/glossario/?q=${encodeURIComponent(nome)}`,
      area: g.area_correlata,
    });
  }

  const pagine: VoceIndice[] = [
    ...[1, 2, 3].map((n) => ({
      tipo: "pagina" as const,
      titolo: `Classe ${n}ª`,
      sotto: "Tutte le lezioni dell'anno",
      testo: `${["prima", "seconda", "terza"][n - 1]} anno`,
      href: `/anno/${n}/`,
    })),
    ...Object.entries(AREA_META).map(([id, a]) => ({
      tipo: "pagina" as const,
      titolo: a.label,
      sotto: `Area tematica ${id}`,
      testo: `area ${id}`,
      href: `/area/${id}/`,
      area: id,
    })),
    { tipo: "pagina", titolo: "Laboratori interattivi", sotto: "Laboratori, escape room ed esplorazioni immersive", testo: "sperimenta lim simulatori", href: "/laboratori/" },
    { tipo: "pagina", titolo: "Esplorazioni immersive", sotto: "Impianti da guardare dentro, un dettaglio dopo l'altro", testo: "zoom scene", href: "/laboratori/#esplorazioni" },
    { tipo: "pagina", titolo: "Glossario delle competenze", sotto: "Le competenze delle professioni del futuro", testo: "definizioni professioni", href: "/glossario/" },
    { tipo: "pagina", titolo: "I miei progressi", sotto: "Badge, quiz e laboratori completati", testo: "progressi badge punteggi", href: "/progressi/" },
    { tipo: "pagina", titolo: "Architettura del libro", sotto: "Come è costruito il Book", testo: "framework struttura", href: "/architettura/" },
    { tipo: "pagina", titolo: "Crediti", sotto: "Autori, fonti e licenze", testo: "credits licenze autori", href: "/credits/" },
  ];
  voci.push(...pagine);

  return Response.json(voci);
}
