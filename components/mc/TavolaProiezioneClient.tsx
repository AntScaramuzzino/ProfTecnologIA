"use client";

import { useState } from "react";
import GeoGebraConstructionEmbed from "@/components/mc/GeoGebraConstructionEmbed";
import ProiettoreEmbed from "@/components/mc/ProiettoreEmbed";

type Scheda = "guarda" | "costruisci";

type TavolaProiezioneClientProps = {
  titolo: string;
  /** chiave ?activity= della costruzione GeoGebra */
  activity: string;
  /** indirizzi del proiettore aperto sul solido della tavola; mancano se la tavola non ha un solido */
  proiettoreSrc?: string;
  proiettoreLimSrc?: string;
};

const SCHEDE: { id: Scheda; numero: string; nome: string; sotto: string }[] = [
  { id: "guarda", numero: "1", nome: "Guarda il solido", sotto: "Ruotalo e osserva le tre viste" },
  { id: "costruisci", numero: "2", nome: "Costruisci la tavola", sotto: "Un passo alla volta, con squadre e compasso" },
];

/**
 * Le due metà di una tavola di proiezioni ortogonali: il proiettore (3D) e la costruzione GeoGebra.
 * Una scheda alla volta, a tutta larghezza: così alla LIM ogni strumento ha lo schermo per sé.
 * Una scheda già aperta resta viva anche quando è nascosta: tornando indietro si ritrova il passo a cui si era.
 */
export default function TavolaProiezioneClient({
  titolo,
  activity,
  proiettoreSrc,
  proiettoreLimSrc,
}: TavolaProiezioneClientProps) {
  const haProiettore = Boolean(proiettoreSrc && proiettoreLimSrc);
  const [scheda, setScheda] = useState<Scheda>(haProiettore ? "guarda" : "costruisci");
  const [aperte, setAperte] = useState<Scheda[]>([haProiettore ? "guarda" : "costruisci"]);

  const apri = (id: Scheda) => {
    setScheda(id);
    setAperte((prima) => (prima.includes(id) ? prima : [...prima, id]));
  };

  const costruzione = (
    <GeoGebraConstructionEmbed
      activity={activity}
      title={titolo}
      iframeTitle={`Animazione GeoGebra: ${titolo.toLowerCase()}`}
    />
  );

  if (!haProiettore) return costruzione;

  const pannello = (id: Scheda) =>
    id === scheda ? "relative" : "pointer-events-none invisible absolute left-[-200vw] top-0 w-full";

  return (
    <div>
      <div role="tablist" aria-label="Le due parti della tavola" className="grid gap-2 sm:grid-cols-2">
        {SCHEDE.map((s) => {
          const attiva = s.id === scheda;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`scheda-${s.id}`}
              aria-selected={attiva}
              aria-controls={`pannello-${s.id}`}
              onClick={() => apri(s.id)}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                attiva
                  ? "border-blue-800 bg-blue-800 text-white"
                  : "border-slate-300 bg-white text-slate-800 hover:border-blue-700"
              }`}
            >
              <span
                aria-hidden="true"
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-base font-black ${
                  attiva ? "bg-white text-blue-900" : "bg-slate-200 text-slate-700"
                }`}
              >
                {s.numero}
              </span>
              <span>
                <span className="block text-base font-black leading-tight">{s.nome}</span>
                <span className={`block text-sm ${attiva ? "text-blue-100" : "text-slate-600"}`}>{s.sotto}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative mt-5 overflow-x-clip">
        {SCHEDE.map((s) =>
          aperte.includes(s.id) ? (
            <div
              key={s.id}
              role="tabpanel"
              id={`pannello-${s.id}`}
              aria-labelledby={`scheda-${s.id}`}
              aria-hidden={s.id !== scheda}
              inert={s.id !== scheda}
              className={pannello(s.id)}
            >
              {s.id === "guarda" ? (
                <ProiettoreEmbed src={proiettoreSrc!} limSrc={proiettoreLimSrc!} title={titolo} />
              ) : (
                costruzione
              )}
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
