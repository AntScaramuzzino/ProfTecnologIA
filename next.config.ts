import type { NextConfig } from "next";
import path from "path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Genera un sito statico puro (HTML/CSS/JS)
  // Compatibile con Netlify gratuitamente, nessuna funzione serverless necessaria
  output: "export",

  // Aggiunge trailing slash per compatibilità con hosting statici
  trailingSlash: true,

  // GitHub Pages serve spesso i siti da /nome-repo/.
  // In locale resta vuoto, quindi localhost continua a funzionare da root.
  basePath,
  assetPrefix: basePath,

  // Ottimizzazione immagini disabilitata per export statico
  images: {
    unoptimized: true,
  },

  // Evita che Turbopack risalga al workspace utente quando trova più lockfile.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
