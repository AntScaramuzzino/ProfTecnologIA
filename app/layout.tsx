import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import { Analytics } from "@vercel/analytics/next";

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
  metadataBase: new URL("https://book.proftecnologia.it"),
  title: "Book ProfTecnologIA — Libro di Tecnologia",
  applicationName: "Book ProfTecnologIA",
  description: "Percorso didattico interattivo per la scuola secondaria di primo grado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    // suppressHydrationWarning: prima dell'idratazione uno script può aggiungere a <html> l'attributo
    // data-mc-rail (colonna laterale delle pagine MC nascosta dall'utente, components/mc/MCRailToggle.tsx)
    <html lang="it" className={`h-full antialiased ${atkinson.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        {/* Skip link — WCAG 2.4.1: consente agli utenti di tastiera di saltare la navigazione */}
        <a href="#main-content" className="skip-link">
          Vai al contenuto principale
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
