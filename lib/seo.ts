import { AREA_META, type MC } from "@/lib/mc-loader";

export const BOOK_URL = "https://book.proftecnologia.it";
const BOOK_ID = `${BOOK_URL}/#book`;
const AUTHOR_ID = "https://www.proftecnologia.it/#antonio";

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Book ProfTecnologIA — il libro di Tecnologia per la scuola secondaria di primo grado",
};

const author = {
  "@type": "Person",
  "@id": AUTHOR_ID,
  name: "Antonio Scaramuzzino",
  url: "https://www.proftecnologia.it/",
};

export function jsonLdHtml(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export function homeSchema(mcCount: number) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BOOK_URL}/#website`,
        url: `${BOOK_URL}/`,
        name: "Book ProfTecnologIA",
        inLanguage: "it-IT",
        publisher: { "@id": AUTHOR_ID },
      },
      {
        "@type": "Book",
        "@id": BOOK_ID,
        name: "Book ProfTecnologIA",
        url: `${BOOK_URL}/`,
        description: `Libro di Tecnologia per la scuola secondaria di primo grado, progettato sulle Indicazioni Nazionali 2025: ${mcCount} micro-competenze con testo, video, laboratorio interattivo, escape room e compito di realtà.`,
        inLanguage: "it",
        bookFormat: "https://schema.org/EBook",
        isAccessibleForFree: true,
        educationalLevel: "Scuola secondaria di primo grado",
        about: "Tecnologia",
        author,
      },
      author,
    ],
  };
}

export function mcSchema(mc: MC) {
  const url = `${BOOK_URL}/mc/${mc.id}/`;
  const areaLabel = AREA_META[mc.area]?.label ?? mc.area;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        "@id": url,
        url,
        name: mc.titolo,
        description: mc.descrizione,
        identifier: mc.id,
        inLanguage: "it",
        isAccessibleForFree: true,
        educationalLevel: `Scuola secondaria di primo grado, classe ${mc.anno}ª`,
        learningResourceType: "Lezione",
        about: areaLabel,
        keywords: mc.tags.join(", "),
        isPartOf: { "@id": BOOK_ID },
        author: { "@id": AUTHOR_ID },
      },
    ],
  };
}
