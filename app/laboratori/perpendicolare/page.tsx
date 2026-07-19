import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import GeoGebraPerpendicularEmbed from "@/components/mc/GeoGebraPerpendicularEmbed";

export const metadata: Metadata = {
  title: "Costruzione della perpendicolare — Laboratorio GeoGebra",
  description: "Animazione interattiva con righello e compasso per costruire la perpendicolare a una retta nel punto P.",
};

export default function PerpendicularLaboratoryPage() {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb
        items={[
          { label: "ProfTecnologIA", href: "/" },
          { label: "MC-DIS-1-01", href: "/mc/MC-DIS-1-01", emoji: "📐", color: "#1A3A7A" },
          { label: "Laboratorio GeoGebra", color: "#1A3A7A" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-7 max-w-3xl">
          <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-800">MC-DIS-1-01 · Classe 1ª · Foundation</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Perpendicolare a una retta in un punto P
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Guarda come righello e compasso trasformano due distanze uguali in un angolo retto. Poi ripeti la costruzione sul tuo foglio.
          </p>
        </div>

        <GeoGebraPerpendicularEmbed />

        <div className="mt-7 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
          <p className="font-black">Prova tu</p>
          <p className="mt-1">
            Ferma l’animazione dopo ogni passaggio e riproducilo con righello e compasso. Alla fine controlla con la squadra che l’angolo in P sia di 90°.
          </p>
          <Link href="/mc/MC-DIS-1-01" className="mt-3 inline-block font-black text-blue-800 underline underline-offset-4">
            Torna alla micro-competenza →
          </Link>
        </div>
      </div>
    </div>
  );
}
