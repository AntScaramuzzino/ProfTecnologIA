import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import { getAllMCs } from "@/lib/mc-loader";

/**
 * Caricamento font Atkinson Hyperlegible via next/font (self-hosted da Vercel/GitHub Pages).
 * DSA-first: il font è progettato specificamente per utenti con difficoltà di lettura.
 * CSS variable --font-atkinson usata in globals.css per font-sans e body.
 */
const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-atkinson",
});

export const metadata: Metadata = {
  title: "ProfTecnologIA — Libro di Tecnologia",
  description: "Percorso didattico interattivo per la scuola secondaria di primo grado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Costruisce l'indice minimale lato server (fs, nessun overhead client)
  // I dati vengono serializzati nell'HTML come prop e idratati nel client SiteHeader.
  const mcIndex = getAllMCs().map((mc) => ({
    id: mc.id,
    titolo: mc.titolo,
    area: mc.area,
    anno: mc.anno as number,
    tags: mc.tags ?? [],
  }));

  return (
    <html lang="it" className={`h-full antialiased ${atkinson.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        {/* Skip link — WCAG 2.4.1: consente agli utenti di tastiera di saltare la navigazione */}
        <a href="#main-content" className="skip-link">
          Vai al contenuto principale
        </a>
        <SiteHeader mcIndex={mcIndex} />
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
