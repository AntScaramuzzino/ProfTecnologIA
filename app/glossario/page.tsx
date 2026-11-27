import type { Metadata } from "next";
import GlossarioClient from "./GlossarioClient";

export const metadata: Metadata = {
  alternates: { canonical: "/glossario/" },
  title: "Glossario competenze — Book ProfTecnologIA",
  description:
    "Tutte le competenze delle professioni del futuro presenti nel libro ProfTecnologIA: definizioni, esempi concreti e area tematica.",
};

export default function GlossarioPage() {
  return <GlossarioClient />;
}
