import Link from "next/link";

/**
 * Footer condiviso — versione sito + link essenziali.
 * Usato in area, anno, mc e credits page.
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-black text-slate-600">ProfTecnologIA</span>
          <span className="rounded-full border border-slate-300 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-500">
            v0.1
          </span>
          <span>· © 2026 Prof. Ing. Antonio Scaramuzzino</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <span>·</span>
          <Link href="/credits" className="hover:text-slate-700">Credits</Link>
          <span>·</span>
          <a
            href="https://github.com/AntScaramuzzino/ProfTecnologIA"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-700"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
