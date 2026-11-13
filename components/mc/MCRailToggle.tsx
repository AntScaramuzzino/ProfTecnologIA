"use client";

import { useEffect } from "react";

/**
 * Colonna laterale della pagina MC (assistente AI, badge, scheda della micro-competenza).
 * Da desktop si può nascondere per dare tutta la larghezza al contenuto: lo stato vive in
 * <html data-mc-rail="off"> (regole in app/globals.css, «Pagina MC: colonna laterale»)
 * e resta salvato su questo dispositivo. Lo script in app/mc/[id]/page.tsx lo applica
 * prima del primo disegno; qui lo si riallinea dopo una navigazione interna.
 */
const KEY = "proftec-mc-rail";

function storedOff(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "off";
  } catch {
    return false;
  }
}

function apply(off: boolean) {
  const root = document.documentElement;
  if (off) root.setAttribute("data-mc-rail", "off");
  else root.removeAttribute("data-mc-rail");
}

/** Il blocco di contenuto più piccolo che attraversa la parte alta della finestra, sotto header e barra delle sezioni */
function readingAnchor(): Element | null {
  const panel = document.querySelector<HTMLElement>(".mc-layout [role='tabpanel']");
  if (!panel) return null;
  const box = panel.getBoundingClientRect();
  if (box.top >= 0) return null; // non si è ancora scesi nel contenuto: niente da tenere fermo
  let best: Element | null = null;
  let bestHeight = Infinity;
  for (const y of [140, 175, 210, 245]) {
    const el = document.elementFromPoint(box.left + 48, y);
    if (!el || el === panel || !panel.contains(el)) continue;
    const h = el.getBoundingClientRect().height;
    if (h > 0 && h < bestHeight) {
      best = el;
      bestHeight = h;
    }
  }
  return best;
}

function setRail(off: boolean) {
  // Il contenuto cambia larghezza, quindi altezza: si tiene fermo il punto in cui si stava leggendo
  const anchor = readingAnchor();
  const before = anchor?.getBoundingClientRect().top ?? 0;
  apply(off);
  try {
    if (off) window.localStorage.setItem(KEY, "off");
    else window.localStorage.removeItem(KEY);
  } catch {
    /* archivio non disponibile: la scelta vale fino alla chiusura della pagina */
  }
  if (anchor) {
    const delta = anchor.getBoundingClientRect().top - before;
    if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: "instant" });
  }
  // Il pulsante premuto sparisce: il fuoco passa a quello opposto
  document.querySelector<HTMLElement>(`[data-mc-rail-btn="${off ? "show" : "hide"}"]`)?.focus({ preventScroll: true });
}

export default function MCRailToggle({ action }: { action: "hide" | "show" }) {
  useEffect(() => {
    apply(storedOff());
  }, []);

  const hide = action === "hide";
  return (
    <button
      type="button"
      data-mc-rail-btn={action}
      onClick={() => setRail(hide)}
      title={
        hide
          ? "Nasconde questa colonna: il contenuto usa tutta la larghezza della pagina. La scelta resta salvata su questo dispositivo."
          : "Riporta a destra la colonna con assistente AI, badge e scheda della micro-competenza."
      }
      className={
        hide
          ? "ml-auto flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-bold text-slate-500 transition-colors hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          : "mc-rail-show mr-3 items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      }
    >
      {!hide && <RailIcon open />}
      <span>{hide ? "Nascondi colonna" : "Mostra colonna"}</span>
      {hide && <RailIcon />}
    </button>
  );
}

/** Finestra con la colonna di destra: piena se la colonna c'è e si può chiudere, tratteggiata se va riaperta */
function RailIcon({ open = false }: { open?: boolean }) {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M15 4.5v15" strokeDasharray={open ? "2.5 2.5" : undefined} />
      <path d={open ? "M11 9.5 8.5 12l2.5 2.5" : "M8.5 9.5 11 12l-2.5 2.5"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
