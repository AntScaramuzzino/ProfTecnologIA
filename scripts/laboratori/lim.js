// Modalità LIM: schermo intero, contenuto ingrandito per essere letto da lontano e usato col tocco.
// Si attiva con il pulsante «Schermo intero» (Fullscreen API, anche dentro l'iframe della pagina MC)
// o aprendo la pagina con ?lim=1. Nella barra: A− / A+ per regolare l'ingrandimento, Esci.
(function () {
  const root = document.documentElement;
  const DESIGN = 1250; // larghezza di progetto del contenuto, in px CSS
  const KEY = "proftec:lim-zoom";
  const param = new URLSearchParams(location.search).get("lim") === "1";
  let delta = 0; try { delta = +localStorage.getItem(KEY) || 0; } catch (e) {}
  const canFs = !!(root.requestFullscreen || root.webkitRequestFullscreen);
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  // vero anche quando è la pagina della MC a mettere a schermo intero l'iframe che ci contiene
  const fsAny = () => { if (fsEl()) return true; try { return !!window.frameElement && window.parent.document.fullscreenElement === window.frameElement; } catch (e) { return false; } };
  const mk = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };

  function zoom() {
    const z = Math.max(1, Math.min(2.4, (window.innerWidth - 48) / DESIGN + delta));
    root.style.setProperty("--limz", z.toFixed(3));
    if (lvl) lvl.textContent = Math.round(z * 100) + "%";
  }
  function set(on) {
    root.classList.toggle("lim", on);
    bar.hidden = !on; btn.hidden = on;
    btn.setAttribute("aria-pressed", String(on));
    if (on) zoom();
    window.dispatchEvent(new Event("resize")); // i grafici e il 3D si ridisegnano
  }
  async function enter() {
    if (canFs) { try { await (root.requestFullscreen ? root.requestFullscreen({ navigationUI: "hide" }) : root.webkitRequestFullscreen()); return; } catch (e) {} }
    set(true); // senza Fullscreen API (es. iPhone): solo ingrandimento
  }
  function exit() {
    if (fsEl()) return (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    // dentro la pagina della MC lo schermo intero può essere dell'iframe (aperto dalla pagina)
    try { const pd = window.parent !== window && window.parent.document; if (pd && pd.fullscreenElement) return pd.exitFullscreen(); } catch (e) {}
    if (!param) set(false);
  }

  const btn = mk("button", "lim-btn", '<span aria-hidden="true">⛶</span> Schermo intero (LIM)'); btn.type = "button";
  btn.title = "Apri a schermo intero, con testo e pulsanti grandi per la lavagna interattiva";
  btn.onclick = enter;
  const bar = mk("div", "lim-bar"); bar.setAttribute("role", "toolbar"); bar.setAttribute("aria-label", "Modalità LIM"); bar.hidden = true;
  const minus = mk("button", null, "A−"); minus.type = "button"; minus.setAttribute("aria-label", "Riduci");
  const lvl = mk("span", "lim-lvl"); lvl.setAttribute("aria-live", "polite");
  const plus = mk("button", null, "A+"); plus.type = "button"; plus.setAttribute("aria-label", "Ingrandisci");
  const out = mk("button", "lim-out", "Esci ✕"); out.type = "button";
  const step = (d) => { delta = Math.round((delta + d) * 10) / 10; try { localStorage.setItem(KEY, String(delta)); } catch (e) {} zoom(); };
  minus.onclick = () => step(-0.1); plus.onclick = () => step(0.1); out.onclick = exit;
  bar.append(minus, lvl, plus, out);

  function mount() {
    const head = document.querySelector(".lab-head .chips") || document.querySelector(".lab-head");
    if (head) head.appendChild(btn); else document.body.prepend(btn);
    document.body.appendChild(bar);
    ["fullscreenchange", "webkitfullscreenchange"].forEach((ev) => document.addEventListener(ev, () => set(fsAny() || param)));
    window.addEventListener("resize", () => { if (root.classList.contains("lim")) zoom(); });
    if (param) set(true);
    window.PROFTEC_LIM = { set, enter, exit };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
