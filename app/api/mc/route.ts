// Nota: questa route API non viene inclusa nell'export statico (output: 'export').
// I dati sono già embedded nelle pagine statiche generate da Next.js al build time.
// Per query client-side, usare il file /mc-data.json generato durante il build.
// Manteniamo il file per compatibilità con ambienti non-statico (dev, futura versione SSR).

import { NextRequest, NextResponse } from "next/server";
import { getAllMCs } from "@/lib/mc-loader";

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area");
  const anno = searchParams.get("anno");

  let mcs = getAllMCs();
  if (area) mcs = mcs.filter((mc) => mc.area === area.toUpperCase());
  if (anno) mcs = mcs.filter((mc) => mc.anno === parseInt(anno) as 1 | 2 | 3);

  return NextResponse.json({ total: mcs.length, mcs });
}
