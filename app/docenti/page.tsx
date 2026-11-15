import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import PianoDocente from "@/components/PianoDocente";
import SiteFooter from "@/components/SiteFooter";
import { costruisciPianoSettimane } from "@/lib/piano-settimane";

export const metadata: Metadata = {
  title: "Docenti: pianifica l’anno — Book ProfTecnologIA",
  description:
    "Il piano annuale di Tecnologia settimana per settimana, per le tre classi: una lezione di teoria e una di disegno o coding, da adattare al ritmo della propria classe.",
};

export default function DocentiPage() {
  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <div className="print:hidden">
        <Breadcrumb items={[{ label: "Book ProfTecnologIA", href: "/" }, { label: "Docenti: pianifica l’anno" }]} />
      </div>
      <PianoDocente proposta={costruisciPianoSettimane()} />
      <div className="print:hidden">
        <SiteFooter />
      </div>
    </div>
  );
}
