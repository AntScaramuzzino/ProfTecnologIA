import type { NextConfig } from "next";

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

  // Permette import da fuori la cartella app (per leggere i dati del progetto)
  experimental: {
    // Nessun experimental flag necessario per ora
  },
};

export default nextConfig;
