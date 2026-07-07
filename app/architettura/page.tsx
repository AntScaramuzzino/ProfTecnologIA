import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllMCs } from "@/lib/mc-loader";

export const metadata: Metadata = {
  title: "Architettura semantica — ProfTecnologIA",
  description: "La struttura del sistema ProfTecnologIA: agenti AI, pipeline di produzione, micro-competenze e framework didattici.",
};

const PIPELINE = [
  { nome: "Agente Curatore", emoji: "🔍", colore: "#1B4F72", bg: "#EBF5FB",
    cosa: "Monitora e raccoglie fonti (articoli, video, paper). Ricerca video YouTube da fonti prioritarie per ogni MC.",
    non: "Non sintetizza, non genera contenuti.",
    output: "Fonti classificate · file data/videos/[MC-ID].json",
    trigger: "Settimanale o su richiesta" },
  { nome: "Agente Sintetizzatore", emoji: "🧬", colore: "#0B6E4F", bg: "#E9F7EF",
    cosa: "Interroga i knowledge repository (NotebookLM) in modalità batch. Estrae contenuti strutturati per ogni MC.",
    non: "Non crea infografiche, non interagisce con gli studenti.",
    output: "Asset JSON strutturati in 04_CONTENUTI/",
    trigger: "Batch/asincrono — NotebookLM non ha API real-time" },
  { nome: "Agente Generatore Asset", emoji: "🎨", colore: "#7D3C98", bg: "#F5EEF8",
    cosa: "Produce 7 tipologie di immagini AI (GPT Image 2): fotorealistica, contesto, mindmap, professione (×2), immagine_da_md, infografica. Script hook audio (5 blocchi), MP3 con edge-tts voce Isabella.",
    non: "Non gestisce fonti, non interagisce con il profilo studente.",
    output: "PNG in 04_CONTENUTI/visual/ · MP3 + trascrizioni in 04_CONTENUTI/microlearning/hook/",
    trigger: "Dopo ogni definizione o aggiornamento di MC" },
  { nome: "Agente CARBLE-CDD", emoji: "✅", colore: "#E74C3C", bg: "#FDEDEC",
    cosa: "Valida ogni CDD secondo il Protocollo CARBLE-CDD v1.0 (I.C. Nicotera Costabile). Applica 7 criteri: D·C·A·R·B·L·E.",
    non: "Non genera contenuti. Produce parere istruttorio — la decisione finale spetta all'autore.",
    output: "Scheda JSON validazione · report Markdown in 04_CONTENUTI/validazione/",
    trigger: "Dopo ogni produzione CDD · prima di ogni pubblicazione",
    soglie: "✅ Tutti Conformi → pubblica · ⚠️ Da rivedere → notifica · 🚫 Non conforme → blocca" },
  { nome: "Agente Personalizzatore", emoji: "🧭", colore: "#884EA0", bg: "#F5EEF8",
    cosa: "Legge il profilo e i progressi dello studente. Seleziona le MC appropriate, sequenzia il percorso rispettando la catena prerequisiti.",
    non: "Non genera contenuti, non raccoglie fonti.",
    output: "Percorso JSON personalizzato per studente con MC ordinate e livello DigComp",
    trigger: "Ogni accesso studente / aggiornamento progressi" },
];

const ZONE = [
  { emoji: "⚡", nome: "INNESCA", desc: "Hook audio 2–3 min su un oggetto reale (edge-tts Isabella). Domanda stimolo in evidenza. 3 video flipped classroom.", colore: "#E67E22", bg: "#FEF9E7" },
  { emoji: "📖", nome: "ESPLORA", desc: "Testo espositivo con accordion per le sottosezioni. Galleria visual AI (ai-fotorealistica, mindmap, infografica).", colore: "#2980B9", bg: "#EBF5FB" },
  { emoji: "🔍", nome: "OSSERVA", desc: "Case study su oggetto concreto. 2 Professioni del Futuro 2030 ciascuna con immagine AI, testo narrativo e competenze chiave CLIL.", colore: "#27AE60", bg: "#E9F7EF" },
  { emoji: "🔬", nome: "SPERIMENTA", desc: "Attività pratiche su 3 livelli DigComp selezionabili: ● Base · ●● Intermedio · ●●● Avanzato.", colore: "#8E44AD", bg: "#F5EEF8" },
  { emoji: "🌍", nome: "AGISCI", desc: "Compito di realtà autentico. Rubrica di valutazione accessibile via drawer sticky. Metacognizione.", colore: "#16A085", bg: "#E8F8F5" },
  { emoji: "🃏", nome: "RIPASSA", desc: "Processo interattivo (4-7 step), checklist di verifica, quiz 18 domande (6F+6I+6A) con feedback, 18 flashcard.", colore: "#6366F1", bg: "#EEF2FF" },
];

const FRAMEWORK = [
  { sigla: "IN", nome: "Indicazioni Nazionali", vers: "D.M. n. 221, 9 dicembre 2025", colore: "#1A5276" },
  { sigla: "DC", nome: "DigComp 3.0", vers: "Commissione Europea 2022", colore: "#0B6E4F" },
  { sigla: "EC", nome: "EntreComp", vers: "Commissione Europea", colore: "#7D3C98" },
  { sigla: "LC", nome: "LifeComp", vers: "Commissione Europea", colore: "#884EA0" },
  { sigla: "EV", nome: "Educazione Civica / Agenda 2030", vers: "L. 92/2019 · SDG ONU", colore: "#1E8449" },
];

const TECH_STACK = [
  { cat: "Sito", items: ["Next.js 16.2.2 (App Router, SSG)", "TypeScript · Tailwind CSS 4", "71 pagine statiche · 0 errori TS", "Glossario 297 competenze · 13 macro-categorie"] },
  { cat: "Deploy", items: ["Vercel (primario) · vercel.json framework null", "Netlify · netlify.toml", "GitHub Pages · Actions workflow auto-deploy"] },
  { cat: "Generazione immagini", items: ["GPT Image 2 (OpenAI) — gpt_image_2", "7 tipologie: ai-fotorealistica · ai-contesto · mindmap · immagine_da_md · img4-professione · img4-professione-2 · img2-infografica"] },
  { cat: "Audio TTS", items: ["edge-tts 7.2.8 (Microsoft Neural TTS)", "Voce: it-IT-IsabellaNeural", "50 MP3 con durate reali nel JSON MC"] },
  { cat: "Knowledge base", items: ["Pinecone brain-tecnologia (9.879 chunk)", "multilingual-e5-large embeddings", "20 libri di Tecnologia indicizzati"] },
  { cat: "AI Generativa", items: ["Claude Sonnet 4.6 / Opus 4.6 (testi, quiz, microlearning)", "GPT Image 2 (visual didattici)", "NotebookLM (sintesi bibliografica)"] },
  { cat: "Validazione", items: ["Protocollo CARBLE-CDD v1.0", "I.C. Nicotera Costabile, 13/05/2026", "7 criteri D·C·A·R·B·L·E"] },
];

export default function ArchitetturaPage() {
  const allMCs = getAllMCs();
  const totale = allMCs.length;

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "ProfTecnologIA", href: "/" },
        { label: "Architettura semantica" },
      ]} />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 space-y-16">

        {/* Header */}
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-emerald-700">Sistema</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Architettura semantica
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            ProfTecnologIA è un ecosistema didattico integrato: un libro strutturato su micro-competenze,
            un sistema di 5 agenti AI per la produzione dei contenuti, e un sito Next.js per la fruizione digitale.
            Ogni MC ha 6 zone di apprendimento, 2 professioni del futuro 2030, quiz 18 domande, 18 flashcard,
            microlearning Process + Checklist, e un glossario di 297 competenze in 13 macro-categorie.
            Questa pagina documenta la struttura del sistema per editori, docenti e ricercatori.
          </p>
        </div>

        {/* Numeri chiave */}
        <section>
          <h2 className="mb-5 text-xl font-black text-slate-950">Numeri del sistema</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { v: totale.toString(), l: "Micro-competenze" },
              { v: "9", l: "Aree tematiche" },
              { v: "3", l: "Anni di scuola" },
              { v: "6", l: "Zone per MC" },
              { v: "50", l: "Audio hook MP3" },
              { v: "297", l: "Competenze 2030" },
            ].map(({ v, l }) => (
              <div key={l} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <div className="text-2xl font-black text-emerald-700">{v}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Le 5 zone */}
        <section>
          <h2 className="mb-2 text-xl font-black text-slate-950">Le 6 zone di ogni MC</h2>
          <p className="mb-5 text-sm text-slate-500">Struttura fissa. Lo studente sa sempre dove si trova. Navigazione a tab sticky con colore area.</p>
          <div className="space-y-3">
            {ZONE.map((z, i) => (
              <div key={z.nome} className="flex items-start gap-4 rounded-xl border p-4"
                style={{ borderColor: z.colore + "44", background: z.bg }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl font-black text-white"
                  style={{ background: z.colore }}>
                  {i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{z.emoji}</span>
                    <span className="font-black text-slate-900">{z.nome}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{z.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pipeline 5 agenti */}
        <section>
          <h2 className="mb-2 text-xl font-black text-slate-950">Pipeline dei 5 agenti AI</h2>
          <p className="mb-5 text-sm text-slate-500">
            Ogni agente ha ruolo e output definiti. La decisione editoriale finale resta sempre all'autore.
          </p>
          {/* Frecce pipeline */}
          <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold">
            {PIPELINE.map((a, i) => (
              <>
                <span key={a.nome} className="rounded-full px-3 py-1 text-white text-xs" style={{ background: a.colore }}>
                  {a.emoji} {a.nome}
                </span>
                {i < PIPELINE.length - 1 && <span key={`arr-${i}`} className="text-slate-400">→</span>}
              </>
            ))}
          </div>
          <div className="space-y-4">
            {PIPELINE.map((a) => (
              <div key={a.nome} className="rounded-xl border p-5" style={{ borderColor: a.colore + "55", background: a.bg }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{a.emoji}</span>
                  <h3 className="font-black text-lg" style={{ color: a.colore }}>{a.nome}</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400 mb-1">Cosa fa</p>
                    <p className="text-slate-700">{a.cosa}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400 mb-1">Output</p>
                    <p className="text-slate-700">{a.output}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400 mb-1">Non fa</p>
                    <p className="text-slate-500">{a.non}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400 mb-1">Trigger</p>
                    <p className="text-slate-700">{a.trigger}</p>
                    {a.soglie && <p className="mt-1 text-xs text-slate-500">{a.soglie}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Schema MC JSON */}
        <section>
          <h2 className="mb-2 text-xl font-black text-slate-950">Schema dati di una MC</h2>
          <p className="mb-5 text-sm text-slate-500">
            Ogni micro-competenza è un oggetto JSON con campi obbligatori e opzionali (v2.0).
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["Campo", "Tipo", "Obbligatorio", "Descrizione"].map((h) => (
                    <th key={h} className="border-b border-slate-200 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["id", "string", "✅", "MC-[AREA]-[ANNO]-[NN] — es. MC-MAT-1-01"],
                  ["area", "string", "✅", "MAT · DIS · DIG · INF · ALI · AMB · ENE · COM · SIS"],
                  ["anno", "1|2|3", "✅", "Anno di scuola secondaria di I grado"],
                  ["titolo", "string", "✅", "Titolo breve della competenza"],
                  ["descrizione", "string", "✅", "Descrizione completa in 2ª persona"],
                  ["fonte", "string", "✅", "Paci 2014 | Hypertech 2020 | originale"],
                  ["frameworks", "object", "✅", "IN · DC · EC · LC · EV con ref e traguardo"],
                  ["outputApp", "object", "✅", "quiz, microlearning, visual, livelloDigComp"],
                  ["prerequisiti", "string[]", "✅", "Lista ID MC prerequisiti ([] per le prime)"],
                  ["tags", "string[]", "✅", "Parole chiave per la ricerca"],
                  ["compito_realta", "string", "✅", "Compito autentico con verbo d'azione"],
                  ["sdg", "number[]", "✅", "Numeri SDG collegati (1-17)"],
                  ["hook_audio", "object", "v2.0", "titolo, oggetto_reale, domanda_avvio, durata_min"],
                  ["professioni_future", "object[]", "v2.1", "Array di 2 professioni: titolo, orizzonte, descrizione_breve, competenze_chiave (campo attuale)"],
                  ["professione_futura", "object", "legacy", "Singola professione — mantenuto per compatibilità, rimpiazzato da professioni_future"],
                  ["clil_termini", "object[]", "v2.0", "italiano, inglese, pronuncia_ipa — 4 termini chiave"],
                  ["uda_collegata", "string", "v2.0", "ID dell'UDA interdisciplinare collegata"],
                  ["note_didattiche", "object", "✅", "base e avanzato (testi differenziati)"],
                ].map(([campo, tipo, obbl, desc]) => (
                  <tr key={campo} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-indigo-700">{campo}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{tipo}</td>
                    <td className="px-4 py-2.5 text-center text-xs">{obbl}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Framework incrociati */}
        <section>
          <h2 className="mb-5 text-xl font-black text-slate-950">Framework incrociati</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FRAMEWORK.map((f) => (
              <div key={f.sigla} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 inline-flex rounded-lg px-3 py-1 text-sm font-black text-white" style={{ background: f.colore }}>
                  {f.sigla}
                </div>
                <p className="font-bold text-slate-900">{f.nome}</p>
                <p className="mt-0.5 text-xs text-slate-500">{f.vers}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stack tecnologico */}
        <section>
          <h2 className="mb-5 text-xl font-black text-slate-950">Stack tecnologico</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TECH_STACK.map((s) => (
              <div key={s.cat} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-xs font-black uppercase tracking-wide text-emerald-700">{s.cat}</p>
                <ul className="space-y-1.5">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Progressione DigComp */}
        <section>
          <h2 className="mb-2 text-xl font-black text-slate-950">Progressione DigComp per anno</h2>
          <p className="mb-5 text-sm text-slate-500">Non retrogressiva — F → I → A in ogni area trasversale (DIG, DIS).</p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["Area", "Classe 1ª", "Classe 2ª", "Classe 3ª"].map((h) => (
                    <th key={h} className="border-b border-slate-200 px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["🪨 MAT","Foundation (F)","—","—"],
                  ["📐 DIS","Foundation (F)","Intermediate (I)","Advanced (A)"],
                  ["💻 DIG","Foundation (F)","Intermediate (I)","Advanced (A)"],
                  ["🔢 INF","Foundation (F)","Intermediate (I)","Advanced (A)"],
                  ["🌾 ALI","—","F → Intermediate","—"],
                  ["🏗️ AMB","—","F → Intermediate","—"],
                  ["⚡ ENE","—","—","I → Advanced"],
                  ["📡 COM","—","—","I → Advanced"],
                  ["⚙️ SIS","—","—","Intermediate (I)"],
                ].map(([a, y1, y2, y3]) => (
                  <tr key={a} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-bold text-slate-900">{a}</td>
                    {[y1, y2, y3].map((v, i) => (
                      <td key={i} className={`px-4 py-2.5 text-sm ${v === "—" ? "text-slate-300" : "text-slate-700"}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Link utili */}
        <section className="rounded-2xl bg-slate-950 p-6 sm:p-8">
          <h2 className="mb-4 text-xl font-black text-white">Documenti di riferimento</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Protocollo CARBLE-CDD v1.0", desc: "I.C. Nicotera Costabile, 13/05/2026", href: "/credits", external: false },
              { label: "Pagina Credits e fonti", desc: "Dichiarazione uso AI · fonti video · bibliografiche", href: "/credits", external: false },
              { label: "INDICE_ProfTecnologIA_v1.0", desc: "Blueprint editoriale — 52 MC, 3 anni, appendici", href: "/docs/INDICE_ProfTecnologIA_v1.0.md", external: true },
              { label: "Architettura v2.2", desc: "Documento architetturale completo del progetto", href: "/docs/architettura_v2.2.md", external: true },
            ].map((d) => (
              d.external ? (
                <a key={d.label} href={d.href} target="_blank" rel="noopener noreferrer"
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-emerald-700 transition block">
                  <p className="font-bold text-white text-sm">{d.label} ↗</p>
                  <p className="mt-0.5 text-xs text-slate-400">{d.desc}</p>
                </a>
              ) : (
                <Link key={d.label} href={d.href}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-emerald-700 transition">
                  <p className="font-bold text-white text-sm">{d.label}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{d.desc}</p>
                </Link>
              )
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500">
            © 2026 Prof. Ing. Antonio Scaramuzzino · ProfTecnologIA ·{" "}
            <a href="https://www.proftecnologia.it" className="text-emerald-400 hover:text-emerald-300">proftecnologia.it</a>
          </p>
        </section>

      </div>
    </main>
  );
}
