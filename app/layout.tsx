import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

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
  return (
    <html lang="it" className={`h-full antialiased ${atkinson.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
