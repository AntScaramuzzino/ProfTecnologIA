// Verifica di fine livello: 4 domande estratte dal quiz della micro-competenza (data/quiz, livelli F/I/A)
// in fondo a ogni scheda livello. Il risultato migliore resta sul dispositivo e, se il laboratorio è
// incorporato nella pagina della MC, viene inviato alla pagina (postMessage) che lo registra nei progressi.
(function () {
  const V = window.LABVERIFICA; if (!V) return;
  const LV = ["F", "I", "A"], NOMI = { F: "Base", I: "Intermedio", A: "Avanzato" }, N = 4;
  const key = (l) => V.id + ":verifica:" + l;
  const get = (l) => { try { return JSON.parse(localStorage.getItem(key(l)) || "null"); } catch (e) { return null; } };
  const put = (l, v) => { try { localStorage.setItem(key(l), JSON.stringify(v)); } catch (e) {} };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const shuf = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  function send(l, score, total) {
    try { if (window.parent !== window) window.parent.postMessage({ type: "proftec-lab-result", mcId: V.id, level: l, score, total }, location.origin); } catch (e) {}
  }
  function box(l, panel) {
    const pool = V[l] || []; if (!pool.length) return;
    const wrap = el("section", "verif"); wrap.setAttribute("aria-label", "Verifica di fine livello " + NOMI[l]);
    const head = el("div", "verif-head", `<span class="lbl">Verifica di fine livello · ${NOMI[l]}</span><p>${Math.min(N, pool.length)} domande dal quiz della micro-competenza. Conta la prima risposta; con 3 su 4 il livello è superato.</p>`);
    const best = el("p", "verif-best"); const body = el("div", "verif-body"); const foot = el("div", "row");
    const again = el("button", "btn ghost", "Nuove domande"); again.type = "button"; const sc = el("span", "score"); const msg = el("span", "verif-msg"); msg.setAttribute("aria-live", "polite");
    foot.append(again, sc, msg); wrap.append(head, best, body, foot); panel.appendChild(wrap);
    function showBest() { const b = get(l); best.textContent = b ? `Miglior risultato: ${b.score}/${b.total}${b.score / b.total >= 0.7 ? " · livello superato" : ""}` : ""; best.hidden = !b; }
    function start() {
      body.innerHTML = ""; sc.textContent = ""; msg.textContent = ""; let answered = 0, right = 0;
      const qs = shuf(pool).slice(0, N);
      qs.forEach((q, qi) => {
        const [text, opts, a, why, fbs] = q; const d = el("div", "vq");
        const id = `vq-${l}-${qi}`; d.appendChild(el("p", "vq-q", `<span class="vq-n">${qi + 1}</span><span id="${id}">${esc(text)}</span>`));
        const g = el("div", "vq-opts"); g.setAttribute("role", "group"); g.setAttribute("aria-labelledby", id);
        const f = el("div"); f.hidden = true; let done = false;
        shuf(opts.map((o, j) => [o, j])).forEach(([o, j]) => {
          const b = el("button", null, esc(o)); b.type = "button";
          b.onclick = () => {
            if (done) return; done = true; answered++; if (j === a) right++;
            [...g.children].forEach((y) => { y.disabled = true; });
            b.classList.add(j === a ? "ok" : "ko"); b.setAttribute("aria-pressed", "true");
            if (j !== a) [...g.children].forEach((y) => { if (+y.dataset.j === a) y.classList.add("ok"); });
            const msg = j === a ? why : (fbs && fbs[j] ? fbs[j] : why);
            f.className = "fb " + (j === a ? "ok" : "ko"); f.innerHTML = (j === a ? "<strong>Giusto.</strong> " : "<strong>Non proprio.</strong> ") + esc(msg); f.hidden = false;
            sc.textContent = `${right}/${answered}`;
            if (answered === qs.length) {
              const prev = get(l); const r = { score: right, total: qs.length, at: new Date().toISOString() };
              if (!prev || right / qs.length >= prev.score / prev.total) put(l, r);
              send(l, right, qs.length); showBest();
              msg.textContent = right / qs.length >= 0.7 ? "Livello superato." : "Rileggi le spiegazioni e riprova con nuove domande.";
            }
          };
          b.dataset.j = j; g.appendChild(b);
        });
        d.append(g, f); body.appendChild(d);
      });
    }
    again.onclick = start; showBest(); start();
  }
  LV.forEach((l, i) => { const p = document.getElementById("p" + (i + 1)); if (p) box(l, p); });
})();
