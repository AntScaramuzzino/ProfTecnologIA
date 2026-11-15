import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import {
  MC_ASSONOMETRIE,
  MC_MONOMETRICA,
  NOME_TIPO,
  TAVOLE_ASS,
  TAVOLE_ASS_PRONTE,
  assonometroSrc,
  costruzioneAssSrc,
  hrefTavolaAss,
} from "@/lib/geogebra-assonometrie";

export const metadata: Metadata = {
  title: "Assonometrie — Book ProfTecnologIA",
  description:
    "Tavole guidate di assonometria cavaliera, isometrica e monometrica: il solido nell’assonometro, con assi e misure, e la costruzione passo per passo con GeoGebra.",
};

const COME_SI_USA = [
  { nome: "Guarda", testo: "Nell’assonometro vedi il solido come viene sul foglio, con i tre assi, le misure e le tre viste da cui parti." },
  { nome: "Costruisci", testo: "Segui la costruzione un passo alla volta e ripeti ogni passo sul tuo foglio." },
  { nome: "Controlla", testo: "Fai la prova con misure nuove e controlla il tuo foglio con l’elenco «Controlla da solo»." },
];

const TIPI = [
  { nome: "Cavaliera", famiglia: "Obliqua", assi: "x orizzontale, y a 45°, z verticale", misure: "x e z vere, y a metà", quando: "La faccia di fronte resta com’è nel prospetto. È la più rapida da disegnare." },
  { nome: "Monometrica a 30° e 60°", famiglia: "Obliqua", assi: "x a 30°, y a 60°, z verticale", misure: "vere lungo i tre assi", quando: "La base resta com’è nella pianta. Si usa per stanze ed edifici visti dall’alto." },
  { nome: "Monometrica a 45°", famiglia: "Obliqua", assi: "x e y a 45°, z verticale", misure: "vere lungo i tre assi", quando: "La base resta com’è nella pianta, girata di 45°. Il solido sembra più alto di quanto è." },
  { nome: "Militare", famiglia: "Obliqua", assi: "x e y a 45°, z verticale", misure: "x e y vere, z a metà", quando: "Detta anche aerea: come la monometrica a 45°, ma con l’altezza dimezzata. Per piante di edifici e quartieri." },
  { nome: "Isometrica", famiglia: "Ortogonale", assi: "x e y a 30°, z verticale", misure: "vere lungo i tre assi", quando: "Mostra le tre facce allo stesso modo. Molti programmi di disegno 3D la usano come vista pronta." },
  { nome: "Dimetrica", famiglia: "Ortogonale", assi: "x e y a 40°, z verticale", misure: "x e y vere, z circa 0,59", quando: "Nei libri, con x e y che scendono da O, gli assi formano due angoli di 130° e uno di 100°. Serve il goniometro." },
  { nome: "Trimetrica", famiglia: "Ortogonale", assi: "x a 20°, y a 40°, z verticale", misure: "x vera, y circa 0,81, z circa 0,94", quando: "Nei libri gli assi formano tre angoli diversi (110°, 130° e 120°) e hanno tre rapporti diversi. Serve il goniometro." },
];

const LEGENDA = [
  { colore: "#475569", nome: "Grigio scuro sottile", testo: "i tre assi x, y e z" },
  { colore: "#64748B", nome: "Grigio sottile", testo: "le linee della scatola" },
  { colore: "#1E40AF", nome: "Blu", testo: "le linee della figura mentre la costruisci" },
  { colore: "#EF4444", nome: "Rosso", testo: "i punti con il nome" },
  { colore: "#C2410C", nome: "Arancione", testo: "le misure" },
  { colore: "#94A3B8", nome: "Grigio chiaro tratteggiato", testo: "la linea orizzontale da cui si misurano gli angoli" },
  { colore: "#16A34A", nome: "Verde", testo: "gli angoli degli assi" },
  { colore: "#111827", nome: "Nero", testo: "gli spigoli da ripassare; tratteggiati se sono nascosti" },
  { colore: "#93C5FD", nome: "Azzurro, giallo, rosa", testo: "le facce, con i colori di PV, PO e PL" },
];

export default function AssonometriePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
      <Breadcrumb
        items={[
          { label: "Book ProfTecnologIA", href: "/" },
          { label: MC_ASSONOMETRIE, href: `/mc/${MC_ASSONOMETRIE}`, emoji: "📐", color: "#1A3A7A" },
          { label: "Assonometrie", color: "#1A3A7A" },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-800">
            Disegno tecnico · Classi 2ª e 3ª · {MC_ASSONOMETRIE} e {MC_MONOMETRICA}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Assonometrie</h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Tavole guidate per passare dalle tre viste di un solido a un solo disegno che lo mostra tutto insieme.
            Prima guardi il solido nell’assonometro, poi costruisci il foglio un passo alla volta e alla fine controlli
            il tuo disegno.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
            <p className="font-black">Come si usa una tavola</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              {COME_SI_USA.map((p) => (
                <li key={p.nome}>
                  <strong>{p.nome}.</strong> {p.testo}
                </li>
              ))}
            </ol>
            <p className="mt-2">
              Alla LIM: i link «LIM» aprono assonometro e costruzione a schermo intero, con testo e pulsanti grandi.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
            <p className="font-black text-slate-950">I colori delle tavole</p>
            <ul className="mt-2 space-y-1.5">
              {LEGENDA.map((l) => (
                <li key={l.nome} className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-1.5 w-10 shrink-0 rounded-full" style={{ backgroundColor: l.colore }} />
                  <span>
                    <strong className="text-slate-950">{l.nome}:</strong> {l.testo}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2">Ti servono: matita, righello e due squadre.</p>
          </div>
        </div>

        <section aria-labelledby="titolo-tipi" className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 id="titolo-tipi" className="text-xl font-black tracking-tight text-slate-950">
            Sette assonometrie, sette regole
          </h2>
          {/* Sul telefono una scheda per tipo; da 640 px in su la tabella */}
          <ul className="mt-3 space-y-3 sm:hidden">
            {TIPI.map((t) => (
              <li key={t.nome} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <p className="text-base font-black text-slate-950">
                  {t.nome} <span className="text-xs font-bold uppercase tracking-wide text-slate-500">· {t.famiglia}</span>
                </p>
                <p className="mt-1"><strong className="text-slate-950">Assi:</strong> {t.assi}</p>
                <p><strong className="text-slate-950">Misure:</strong> {t.misure}</p>
                <p className="mt-1">{t.quando}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[36rem] text-left text-sm leading-6 text-slate-700">
              <thead>
                <tr className="border-b border-slate-300 font-mono text-xs uppercase tracking-widest text-slate-500">
                  <th scope="col" className="py-2 pr-4">Tipo</th>
                  <th scope="col" className="py-2 pr-4">Assi sul foglio</th>
                  <th scope="col" className="py-2 pr-4">Misure</th>
                  <th scope="col" className="py-2">Quando conviene</th>
                </tr>
              </thead>
              <tbody>
                {TIPI.map((t) => (
                  <tr key={t.nome} className="border-b border-slate-200 align-top">
                    <th scope="row" className="py-2 pr-4 font-black text-slate-950">
                      {t.nome}
                      <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">{t.famiglia}</span>
                    </th>
                    <td className="py-2 pr-4">{t.assi}</td>
                    <td className="py-2 pr-4">{t.misure}</td>
                    <td className="py-2">{t.quando}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Nella colonna degli assi gli angoli si misurano dalla linea orizzontale; valori come 130° o 120° sono invece gli
            angoli tra un asse e l’altro, come li disegnano i libri. Nelle oblique i raggi che proiettano il solido sul foglio sono
            inclinati, nelle ortogonali sono perpendicolari al foglio. In tutte gli spigoli che nel solido sono paralleli
            restano paralleli nel disegno. Nella scuola media si disegnano soprattutto cavaliera, monometrica, militare e isometrica;
            dimetrica e trimetrica si guardano nell’assonometro.
          </p>
        </section>

        <section
          aria-labelledby="titolo-assonometro"
          className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-900 bg-slate-900 p-5 text-slate-100"
        >
          <div className="max-w-2xl">
            <h2 id="titolo-assonometro" className="text-xl font-black tracking-tight text-white">
              L’assonometro
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-200">
              Dodici solidi da disegnare in sette assonometrie: cavaliera, monometrica a 30° e 60° e a 45°, militare,
              isometrica, dimetrica e trimetrica. Scegli le misure, gira il
              solido, accendi la scatola e tocca un vertice per vedere come si trova, una misura alla volta. Accanto ci
              sono le tre viste. Puoi usarlo anche da solo, senza una tavola.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              <span className="font-black text-white">Per il docente:</span> apri l’assonometro con «Apri
              l’assonometro» e, in fondo ai comandi, usa il riquadro «Per il docente · codice e QR». Lì prepari un
              esercizio (tipo, solido, misure, posizione, titolo e consegna, anche con il disegno nascosto) e ottieni un
              codice, un link e un QR da dare alla classe.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-black">
            <a
              href={assonometroSrc()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white px-4 py-2.5 text-slate-950 hover:bg-amber-200"
            >
              Apri l’assonometro ↗
            </a>
            <a
              href={assonometroSrc({ modo: "lim" })}
              target="_blank"
              rel="noopener noreferrer"
              className="self-center text-white underline underline-offset-4"
            >
              LIM ↗
            </a>
          </div>
        </section>

        <section id="tavole" aria-labelledby="titolo-tavole" className="mt-10 scroll-mt-28">
          <h2 id="titolo-tavole" className="text-2xl font-black tracking-tight text-slate-950">
            Le tavole{" "}
            <span className="text-base font-bold text-slate-500">
              · {TAVOLE_ASS_PRONTE.length} pronte su {TAVOLE_ASS.length}
            </span>
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-700">
            Si comincia dallo stesso parallelepipedo disegnato nei tre modi, per vedere che cosa cambia. I solidi sono
            quelli delle tavole di{" "}
            <Link href="/proiezioni-ortogonali" className="font-bold text-blue-800 underline underline-offset-4">
              proiezioni ortogonali
            </Link>
            : le misure si prendono dalle tre viste.
          </p>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TAVOLE_ASS.map((t) =>
              t.pronta ? (
                <li key={t.slug} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  {/* L'immagine è un secondo accesso alla stessa pagina: il link con il nome è sotto */}
                  <Link href={hrefTavolaAss(t)} tabIndex={-1} aria-hidden="true" className="block border-b border-slate-100 bg-white">
                    <img
                      src={`${basePath}/assets/assonometrie/${t.slug}.webp`}
                      alt=""
                      width={640}
                      height={498}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[640/498] w-full object-contain"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-blue-900">
                      Tavola {t.numero} · {NOME_TIPO[t.tipo]}
                      {t.mc === MC_MONOMETRICA ? " · classe 3ª" : ""}
                    </p>
                    <h3 className="text-lg font-black leading-snug tracking-tight text-slate-950">{t.titolo}</h3>
                    <p className="text-sm leading-6 text-slate-700">{t.descrizione}</p>
                    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm font-bold">
                      <Link href={hrefTavolaAss(t)} className="text-blue-800 underline underline-offset-4">
                        Apri la tavola →
                      </Link>
                      <a
                        href={costruzioneAssSrc(t, true)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 underline underline-offset-4"
                      >
                        LIM ↗
                      </a>
                    </div>
                  </div>
                </li>
              ) : (
                <li
                  key={t.slug}
                  className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5"
                >
                  <p className="font-mono text-xs font-black uppercase tracking-widest text-slate-500">
                    Tavola {t.numero} · {NOME_TIPO[t.tipo]} · in preparazione
                  </p>
                  <h3 className="text-lg font-black leading-snug tracking-tight text-slate-700">{t.titolo}</h3>
                  <p className="text-sm leading-6 text-slate-600">{t.descrizione}</p>
                </li>
              ),
            )}
          </ol>
        </section>

        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
          <Link href={`/mc/${MC_ASSONOMETRIE}`} className="text-blue-800 underline underline-offset-4">
            Torna alla micro-competenza {MC_ASSONOMETRIE} →
          </Link>
          <Link href={`/mc/${MC_MONOMETRICA}`} className="text-blue-800 underline underline-offset-4">
            {MC_MONOMETRICA}: assonometria e prospettiva →
          </Link>
        </p>
      </div>
    </div>
  );
}
