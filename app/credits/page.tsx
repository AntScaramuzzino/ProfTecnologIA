import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credits — ProfTecnologIA",
  description: "Fonti, crediti e dichiarazione sull'uso dell'intelligenza artificiale nel progetto ProfTecnologIA.",
};

const SOURCE_SECTIONS = [
  {
    title: "Case Editrici scolastiche",
    emoji: "📚",
    description: "Video didattici prodotti dalle principali case editrici italiane di libri scolastici.",
    sources: [
      { name: "Mondadori Education", url: "https://www.youtube.com/user/MondadoriEducation", type: "YouTube" },
      { name: "Rizzoli Education", url: "https://www.youtube.com/c/RizzoliEducation", type: "YouTube" },
      { name: "Zanichelli Editore", url: "https://www.youtube.com/user/zanichellieditore", type: "YouTube" },
      { name: "Lattes Editori", url: "https://www.youtube.com/user/LattesEditori", type: "YouTube" },
      { name: "Lattes — Video settori produttivi", url: "https://www.latteseditori.it/contenuti/video-settori-produttivi", type: "Web" },
    ],
  },
  {
    title: "Divulgazione scientifica",
    emoji: "🔬",
    description: "Canali di divulgazione scientifica e culturale in italiano.",
    sources: [
      { name: "Geopop", url: "https://www.youtube.com/c/GeopodcastIT", type: "YouTube" },
    ],
  },
  {
    title: "Insegnanti di Tecnologia — Canali YouTube",
    emoji: "🎬",
    description: "Docenti di Tecnologia della Scuola Secondaria di I Grado che condividono le loro lezioni su YouTube.",
    sources: [
      { name: "Prof. Falanga insegna", url: "https://www.youtube.com/c/ProfFalangainsegna", type: "YouTube" },
      { name: "Fabio Macchia — Disegno e Tecnologia", url: "https://www.youtube.com/c/FabioMacchia", type: "YouTube" },
      { name: "ProduttivaMENTE", url: "https://www.youtube.com/c/ProduttivaMENTE", type: "YouTube" },
      { name: "HLMod Tech", url: "https://www.youtube.com/c/HLModTech", type: "YouTube" },
      { name: "Il Prof. di Tecnologia", url: "https://www.youtube.com/channel/UCzdLuWgw-x3fVDZNBnaBRYA", type: "YouTube" },
      { name: "Video Materiali Didattici", url: "https://www.youtube.com/channel/UCPgZjzVn8NqGpsb36ZZ6-6w", type: "YouTube" },
    ],
  },
  {
    title: "Insegnanti di Tecnologia — Siti Web",
    emoji: "🌐",
    description: "Blog e siti di docenti che producono risorse didattiche per la Tecnologia nella scuola secondaria.",
    sources: [
      { name: "Annibale Pinotti — Tecnologia per la scuola media", url: "https://tecnologia.annibalepinotti.it/", type: "Web" },
      { name: "Il Technologico", url: "https://iltechnologico.it/", type: "Web" },
      { name: "Educazione Tecnica Online", url: "https://www.educazionetecnicaonline.com/", type: "Web" },
      { name: "Michela Massei — Blog Tecnologia", url: "https://michelamassei.blogspot.com/", type: "Web" },
      { name: "Marco Torella", url: "https://www.marcotorella.com/", type: "Web" },
      { name: "Zoomiamo il Mondo", url: "https://zoomiamoilmondo.blogspot.com/", type: "Web" },
      { name: "Pelli Prof Tecnologia", url: "https://pelliproftecnologia.blogspot.com/", type: "Web" },
    ],
  },
];

const AI_TOOLS = [
  {
    nome: "Claude (Anthropic)",
    versione: "claude-sonnet-4-6 / claude-opus-4",
    uso: "Generazione dei testi narrativi per tutte le 52 MC (Zone 1-5), strutturazione della matrice MC, produzione degli script hook audio, generazione dei prompt per immagini.",
    url: "https://anthropic.com",
  },
  {
    nome: "GPT Image 2 (OpenAI via Higgsfield)",
    versione: "gpt_image_2",
    uso: "Generazione delle infografiche e immagini didattiche per le MC (img2-infografica, img5-infografica densa).",
    url: "https://higgsfield.ai",
  },
  {
    nome: "Cinematic Studio 2.5 (Higgsfield)",
    versione: "cinematic_studio_2_5",
    uso: "Generazione delle immagini soggetto (img1-innesca) e contesto reale (img3-osserva).",
    url: "https://higgsfield.ai",
  },
  {
    nome: "Higgsfield Soul V2",
    versione: "text2image_soul_v2",
    uso: "Generazione ritratti professionali 'Professione del futuro 2030' (img4-professione).",
    url: "https://higgsfield.ai",
  },
  {
    nome: "Microsoft Edge TTS (edge-tts)",
    versione: "7.2.8 · Voce: it-IT-IsabellaNeural",
    uso: "Sintesi vocale di tutti gli 50 hook audio podcast (Zone 1 — INNESCA). Generazione gratuita, voce neurale Microsoft.",
    url: "https://github.com/rany2/edge-tts",
  },
  {
    nome: "Pinecone (brain-tecnologia)",
    versione: "multilingual-e5-large · 9.879 chunk",
    uso: "Knowledge base semantica: indicizzazione di 14 libri di Tecnologia per il mercato italiano. Utilizzato per l'analisi comparata e l'allineamento editoriale alle IN 2025.",
    url: "https://pinecone.io",
  },
  {
    nome: "NotebookLM (Google)",
    versione: "—",
    uso: "Interrogazione semantica delle fonti bibliografiche (NB-TESTI, NB-VIDEO, NB-ARTICOLI) in modalità batch per la costruzione della matrice MC.",
    url: "https://notebooklm.google.com",
  },
];

export default function CreditsPage() {
  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">

      {/* Breadcrumb */}
      <nav className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="font-semibold hover:text-slate-900">ProfTecnologIA</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Credits</span>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Credits e fonti</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            ProfTecnologIA è costruito su un ecosistema di fonti verificate e strumenti AI.
            Questa pagina documenta tutte le fonti video utilizzate, gli strumenti di intelligenza artificiale
            impiegati nella produzione e i riferimenti bibliografici del progetto.
          </p>
        </div>

        {/* ── DICHIARAZIONE USO IA ─────────────────────────────────────────── */}
        <section className="mb-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <h2 className="text-xl font-black text-emerald-900 sm:text-2xl">Dichiarazione sull'uso dell'IA</h2>
          </div>
          <p className="mb-4 text-sm leading-7 text-emerald-900">
            Il progetto ProfTecnologIA utilizza l'intelligenza artificiale come strumento di produzione,
            <strong> non come sostituto della voce dell'autore</strong>. Ogni testo narrativo rivolto agli studenti
            (📖 ESPLORA) è scritto e revisionato dal Prof. Ing. Antonio Scaramuzzino.
            Gli agenti AI operano su strutture, asset e metadati, lasciando al giudizio umano
            la qualità linguistica e la coerenza didattica.
          </p>
          <p className="text-sm leading-7 text-emerald-800">
            In conformità con le linee guida UNESCO sull'IA nell'educazione e con le raccomandazioni del MIM,
            l'uso dell'IA è documentato in questa pagina per garantire trasparenza agli editori,
            ai docenti e alle famiglie.
          </p>
        </section>

        {/* ── STRUMENTI AI USATI ───────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-black">Strumenti AI utilizzati</h2>
          <div className="space-y-4">
            {AI_TOOLS.map((tool) => (
              <div key={tool.nome} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-slate-900">{tool.nome}</h3>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-xs text-slate-500">
                        {tool.versione}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{tool.uso}</p>
                  </div>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-400"
                  >
                    Sito →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FONTI VIDEO ──────────────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="mb-2 text-2xl font-black">Fonti video</h2>
          <p className="mb-6 text-sm text-slate-500">
            I video nelle gallery di ogni MC sono selezionati da queste fonti in ordine di priorità.
            Tutti i video appartengono ai rispettivi canali e autori — ProfTecnologIA non ne rivendica la proprietà.
          </p>

          <div className="space-y-8">
            {SOURCE_SECTIONS.map((section, si) => (
              <div key={section.title}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-black text-white">
                    {si + 1}
                  </span>
                  <h3 className="text-lg font-black">{section.emoji} {section.title}</h3>
                </div>
                <p className="mb-3 text-sm text-slate-500">{section.description}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {section.sources.map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50 transition"
                    >
                      <span>{source.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        source.type === "YouTube"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {source.type}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FONTI BIBLIOGRAFICHE ─────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-black">Fonti bibliografiche principali</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                autore: "Paci, R. — Paci, N.",
                titolo: "Idea, progetto, innovazione (Guida docente)",
                editore: "Zanichelli", anno: "2014",
                ruolo: "Struttura disciplinare + competenze IN",
              },
              {
                autore: "AA.VV.",
                titolo: "Hypertech PRO Arduino (Guida docente)",
                editore: "Lattes", anno: "2020",
                ruolo: "10 aree tematiche + coding + Agenda 2030 + compiti di realtà",
              },
              {
                autore: "MIM",
                titolo: "Indicazioni Nazionali 2025",
                editore: "D.M. n. 221 del 9 dicembre 2025", anno: "2025",
                ruolo: "Riferimento normativo — sostituisce D.M. 254/2012 da settembre 2026",
              },
              {
                autore: "European Commission",
                titolo: "DigComp 3.0",
                editore: "Publications Office of the EU", anno: "2022",
                ruolo: "Framework competenze digitali — livelli F/I/A/H",
              },
            ].map((ref) => (
              <div key={ref.titolo} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{ref.autore} · {ref.anno}</p>
                <p className="mt-1 font-black text-slate-900">{ref.titolo}</p>
                <p className="mt-0.5 text-xs text-slate-500">{ref.editore}</p>
                <p className="mt-2 text-xs text-emerald-700 font-semibold">{ref.ruolo}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AUTORE E LICENZA ─────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
          <h2 className="mb-4 text-xl font-black text-white">Autore e licenza</h2>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-700 font-black text-white">
              AS
            </div>
            <div>
              <p className="font-black text-white">Prof. Ing. Antonio Scaramuzzino</p>
              <p className="text-sm text-emerald-400">Docente di Tecnologia · Classe A060 · Équipe Formativa MIM</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <a href="https://www.proftecnologia.it" target="_blank" rel="noopener noreferrer"
                   className="text-emerald-400 hover:text-emerald-300">🌐 proftecnologia.it</a>
                <span className="text-slate-700">·</span>
                <a href="mailto:antonio.scaramuzzino@coopinrete.it"
                   className="text-slate-400 hover:text-slate-300">✉️ antonio.scaramuzzino@coopinrete.it</a>
                <span className="text-slate-700">·</span>
                <a href="https://github.com/AntScaramuzzino/ProfTecnologIA" target="_blank" rel="noopener noreferrer"
                   className="text-slate-400 hover:text-slate-300">⌨️ GitHub</a>
              </div>
            </div>
          </div>
          <p className="mt-6 text-xs leading-6 text-slate-400">
            © 2026 Antonio Scaramuzzino · Proposta editoriale riservata.
            I contenuti del sito sono materiale dimostrativo del progetto ProfTecnologIA.
            I video linkati appartengono ai rispettivi autori e canali YouTube.
            Le immagini generate con AI sono prodotte per uso editoriale e didattico.
          </p>
        </section>
      </div>
    </main>
  );
}
