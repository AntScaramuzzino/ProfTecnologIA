import type { MetadataRoute } from "next";
import { getAllMCs } from "@/lib/mc-loader";
import { BOOK_URL } from "@/lib/seo";
import { COSTRUZIONI_GEOGEBRA } from "@/lib/geogebra-costruzioni";
import { TAVOLE_PO_PRONTE } from "@/lib/geogebra-proiezioni";
import { TAVOLE_ASS_PRONTE } from "@/lib/geogebra-assonometrie";

export const dynamic = "force-static";

const SEZIONI = [
  "", "docenti", "laboratori", "costruzioni-geometriche", "proiezioni-ortogonali", "assonometrie",
  "glossario", "novita", "architettura", "credits",
  "laboratori/bisettrice-angolo", "laboratori/perpendicolare",
];

/* Niente lastModified: il sito è un export statico e la data della build non dice quando è cambiata la pagina. */
export default function sitemap(): MetadataRoute.Sitemap {
  const mcs = getAllMCs();
  const aree = [...new Set(mcs.map((mc) => mc.area))];
  const paths = [
    ...SEZIONI,
    "anno/1", "anno/2", "anno/3",
    ...aree.map((a) => `area/${a}`),
    ...mcs.map((mc) => `mc/${mc.id}`),
    ...COSTRUZIONI_GEOGEBRA.filter((c) => !c.href).map((c) => `laboratori/costruzioni/${c.slug}`),
    ...TAVOLE_PO_PRONTE.map((t) => `laboratori/proiezioni/${t.slug}`),
    ...TAVOLE_ASS_PRONTE.map((t) => `laboratori/assonometrie/${t.slug}`),
  ];
  return paths.map((p) => ({ url: p ? `${BOOK_URL}/${p}/` : `${BOOK_URL}/` }));
}
