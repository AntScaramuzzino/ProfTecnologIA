import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TecnologIA — Libro di Tecnologia",
  description: "Percorso didattico interattivo per la scuola secondaria di primo grado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
