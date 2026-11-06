// Motore delle escape room ProfTecnologIA — una stanza per micro-competenza.
// Cinque lucchetti in sequenza: ognuno è un problema da risolvere con i contenuti della MC.
// Ogni lucchetto aperto rivela un simbolo; i simboli in ordine formano il codice della porta finale.
// Tipi di lucchetto: numero · parola · scelta · ordine · coppie
(function () {
  const AREA = {
    MAT: ["#6D4C41", "#EFEBE9", "Materiali e Rifiuti"], DIS: ["#1A3A7A", "#E8EFF9", "Disegno Tecnico"],
    DIG: ["#006064", "#E0F7FA", "Digitale"], ALI: ["#4E7A26", "#F1F8E9", "Alimentazione"],
    AMB: ["#BF360C", "#FBE9E7", "Abitazione, Città, Territorio"], ENE: ["#C24010", "#FFF3E0", "Energia e Macchine"],
    COM: ["#6A1B9A", "#F3E5F5", "Comunicazioni e Trasporti"], SIS: ["#1B5E7A", "#E1F0F8", "Sistemi, Economia e Lavoro"],
    INF: ["#37474F", "#ECEFF1", "Informatica"],
  };
  const $c = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
  const num = (s) => parseFloat(String(s).replace(/\s/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
  const shuf = (a, seed) => { const r = [...a]; let s = seed || 11; for (let i = r.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  let ID = "escape";
  const store = { get(k) { try { return JSON.parse(localStorage.getItem(ID + ":" + k) || "null"); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(ID + ":" + k, JSON.stringify(v)); } catch (e) {} } };
  const PEN_HINT = 10, PEN_ERR = 5;

  /* Ogni builder ritorna { el, check() → true/false/null (null = risposta incompleta) } */
  const TYPES = {
    numero(l, id) {
      const w = $c("div", "es-in"); const lab = $c("label", null, l.etichetta || "Risposta"); lab.htmlFor = id;
      const i = $c("input"); i.id = id; i.inputMode = "decimal"; i.autocomplete = "off"; w.append(lab, i); if (l.unita) w.appendChild($c("span", "es-u", esc(l.unita)));
      return { el: w, input: i, check: () => { const v = num(i.value); if (!isFinite(v)) return null; return Math.abs(v - l.risposta) <= (l.tolleranza || 0) + 1e-9; } };
    },
    parola(l, id) {
      const w = $c("div", "es-in"); const lab = $c("label", null, l.etichetta || "Risposta"); lab.htmlFor = id;
      const i = $c("input"); i.id = id; i.autocomplete = "off"; i.spellcheck = false; w.append(lab, i);
      return { el: w, input: i, check: () => { const v = norm(i.value); if (!v) return null; return l.risposte.some((r) => norm(r) === v); } };
    },
    scelta(l, id) {
      const g = $c("div", "es-opts"); g.setAttribute("role", "radiogroup"); g.setAttribute("aria-labelledby", id + "-q"); let sel = null;
      shuf(l.opzioni.map((o, j) => [o, j]), l.opzioni.length * 7).forEach(([o, j]) => {
        const b = $c("button", null, esc(o)); b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false");
        b.onclick = () => { sel = j; [...g.children].forEach((x) => x.setAttribute("aria-checked", String(x === b))); }; g.appendChild(b);
      });
      return { el: g, check: () => (sel === null ? null : sel === l.corretta) };
    },
    ordine(l) {
      const w = $c("div", "es-ord"); let cur = shuf(l.elementi.map((_, j) => j), l.elementi.length * 13);
      if (cur.every((v, k) => v === k)) cur.reverse();
      const ol = $c("ol"); w.appendChild(ol);
      function draw(focus) {
        ol.innerHTML = "";
        cur.forEach((j, k) => {
          const li = $c("li"); li.appendChild($c("span", "es-t", esc(l.elementi[j])));
          const up = $c("button", "es-mv", "↑"); up.type = "button"; up.setAttribute("aria-label", `Sposta su: ${l.elementi[j]}`); up.disabled = k === 0;
          const dn = $c("button", "es-mv", "↓"); dn.type = "button"; dn.setAttribute("aria-label", `Sposta giù: ${l.elementi[j]}`); dn.disabled = k === cur.length - 1;
          up.onclick = () => { [cur[k - 1], cur[k]] = [cur[k], cur[k - 1]]; draw([j, "up"]); };
          dn.onclick = () => { [cur[k + 1], cur[k]] = [cur[k], cur[k + 1]]; draw([j, "dn"]); };
          li.append(up, dn); ol.appendChild(li);
          if (focus && focus[0] === j) setTimeout(() => (focus[1] === "up" && !up.disabled ? up : dn.disabled ? up : dn).focus(), 0);
        });
      }
      draw(); return { el: w, check: () => cur.every((v, k) => v === k) };
    },
    coppie(l, id) {
      const w = $c("div", "es-pairs"); const right = shuf(l.coppie.map((p) => p[1]), l.coppie.length * 5); const sels = [];
      l.coppie.forEach(([a], k) => {
        const r = $c("div", "es-pair"); const lab = $c("label", null, esc(a)); const s = $c("select"); s.id = `${id}-${k}`; lab.htmlFor = s.id;
        s.appendChild($c("option", null, "— scegli —")).value = ""; right.forEach((b) => { const o = $c("option", null, esc(b)); o.value = b; s.appendChild(o); });
        r.append(lab, s); w.appendChild(r); sels.push(s);
      });
      return { el: w, check: () => (sels.some((s) => !s.value) ? null : sels.every((s, k) => s.value === l.coppie[k][1])) };
    },
  };

  function run(cfg) {
    window.ESCAPE.cfg = cfg; ID = cfg.id + ":escape"; const [ac, abg, al] = AREA[cfg.area] || AREA.DIG;
    document.documentElement.style.setProperty("--area", ac); document.documentElement.style.setProperty("--area-bg", abg);
    document.title = cfg.titolo;
    const L = cfg.lucchetti; const codice = L.map((l) => String(l.simbolo)).join("");
    const wrap = $c("div", "wrap es");
    wrap.appendChild($c("header", "lab-head", `<div class="chips"><span class="chip">${cfg.id} · ${esc(al)} · ${cfg.classe}ª</span><span class="chip lab">Escape room</span></div><h1>${esc(cfg.titolo)}</h1><p class="hook">${cfg.ambientazione}</p>`));
    const mission = $c("div", "brief", `<span class="lbl">Missione</span><p>${cfg.missione}</p><p class="muted">Apri i ${L.length} lucchetti in ordine: ognuno rivela un simbolo del codice della porta. Gli indizi aiutano ma costano ${PEN_HINT} punti; ogni risposta sbagliata ne costa ${PEN_ERR}.</p>`);
    wrap.appendChild(mission);
    const bar = $c("div", "es-bar"); const locks = $c("ol", "es-locks"); locks.setAttribute("aria-label", "Lucchetti");
    const hud = $c("div", "es-hud"); const pts = $c("span", "score"); const tm = $c("span", "muted"); hud.append(pts, tm); bar.append(locks, hud); wrap.appendChild(bar);
    const stage = $c("section", "es-stage"); stage.setAttribute("aria-live", "polite"); wrap.appendChild(stage);
    const best = $c("p", "verif-best"); wrap.appendChild(best);
    wrap.appendChild($c("footer", "lab-foot", `ProfTecnologIA · Escape room v1.0 · ${cfg.fonte || "Contenuti tratti dal testo della micro-competenza."}<br>Questo materiale è stato realizzato con il supporto di strumenti IA e successivamente controllato, adattato e validato secondo il Protocollo CARBLE-CDD.`));
    document.body.prepend(wrap);

    let st, t0, timer;
    function showBest() { const b = store.get("best"); best.textContent = b ? `Il tuo record: ${b.punti} punti · ${"★".repeat(b.stelle)}${"☆".repeat(3 - b.stelle)} · ${b.tempo}` : ""; best.hidden = !b; }
    const clock = () => { const s = Math.floor((Date.now() - t0) / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
    function hudDraw() {
      pts.textContent = `${st.punti} punti`;
      locks.innerHTML = "";
      L.forEach((l, k) => { const li = $c("li", k < st.i ? "open" : k === st.i ? "cur" : "", k < st.i ? `<span aria-hidden="true">🔓</span><b>${esc(l.simbolo)}</b>` : `<span aria-hidden="true">🔒</span><b>?</b>`); li.setAttribute("aria-label", `Lucchetto ${k + 1}: ${k < st.i ? "aperto, simbolo " + l.simbolo : "chiuso"}`); locks.appendChild(li); });
      const fin = $c("li", st.i >= L.length ? "cur door" : "door", `<span aria-hidden="true">🚪</span>`); fin.setAttribute("aria-label", "Porta finale"); locks.appendChild(fin);
    }
    function start() {
      st = { i: 0, punti: 100, hint: 0, err: 0 }; t0 = Date.now(); clearInterval(timer); timer = setInterval(() => (tm.textContent = "⏱ " + clock()), 1000); tm.textContent = "⏱ 0:00";
      hudDraw(); showLock();
    }
    function showLock() {
      hudDraw(); stage.innerHTML = "";
      if (st.i >= L.length) return showDoor();
      const l = L[st.i]; const id = `es-${st.i}`;
      const card = $c("div", "bench es-card");
      card.appendChild($c("h2", "blk-h", `<span class="es-n">Lucchetto ${st.i + 1} di ${L.length}</span> ${esc(l.titolo)}`));
      const q = $c("div", "es-q", l.testo); q.id = id + "-q"; card.appendChild(q);
      const t = TYPES[l.tipo](l, id); card.appendChild(t.el);
      const row = $c("div", "row"); const go = $c("button", "btn", "Prova ad aprire"); go.type = "button";
      const hb = $c("button", "btn ghost", "Indizio"); hb.type = "button"; row.append(go, hb); card.appendChild(row);
      const hints = $c("div", "es-hints"); const f = $c("div"); f.hidden = true; card.append(hints, f);
      let used = 0; const H = l.indizi || [];
      hb.disabled = !H.length;
      hb.onclick = () => { if (used >= H.length) return; hints.appendChild($c("p", "fb warn", `<strong>Indizio ${used + 1}.</strong> ${H[used]}`)); used++; st.punti = Math.max(0, st.punti - PEN_HINT); st.hint++; pts.textContent = `${st.punti} punti`; if (used >= H.length) hb.disabled = true; };
      const tryOpen = () => {
        const r = t.check();
        if (r === null) { f.className = "fb warn"; f.innerHTML = "Completa la risposta prima di provare."; f.hidden = false; return; }
        if (!r) { st.punti = Math.max(0, st.punti - PEN_ERR); st.err++; pts.textContent = `${st.punti} punti`; f.className = "fb ko"; f.innerHTML = `<strong>Il lucchetto non si apre.</strong> ${l.errore || "Ricontrolla e riprova, oppure chiedi un indizio."}`; f.hidden = false; return; }
        go.disabled = true; hb.disabled = true; card.querySelectorAll("input,select,.es-opts button,.es-mv").forEach((x) => (x.disabled = true));
        f.className = "fb ok"; f.innerHTML = `<strong>Clic! Lucchetto aperto: il simbolo è «${esc(l.simbolo)}».</strong> ${l.spiegazione || ""}`; f.hidden = false;
        const nx = $c("button", "btn", st.i + 1 < L.length ? "Avanti, al prossimo lucchetto" : "Vai alla porta"); nx.type = "button"; nx.onclick = () => { st.i++; showLock(); stage.querySelector("h2")?.focus(); };
        const r2 = $c("div", "row"); r2.appendChild(nx); card.appendChild(r2); nx.focus();
      };
      go.onclick = tryOpen; if (t.input) t.input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryOpen(); });
      stage.appendChild(card); const h = card.querySelector("h2"); h.tabIndex = -1;
    }
    function showDoor() {
      const card = $c("div", "bench es-card es-door");
      card.appendChild($c("h2", "blk-h", "La porta"));
      card.appendChild($c("p", "es-q", cfg.porta || "Inserisci i simboli dei lucchetti, nell'ordine in cui li hai aperti."));
      const w = $c("div", "es-in"); const lab = $c("label", null, "Codice"); lab.htmlFor = "es-code"; const i = $c("input"); i.id = "es-code"; i.autocomplete = "off"; i.maxLength = codice.length + 4; w.append(lab, i); card.appendChild(w);
      const go = $c("button", "btn", "Apri la porta"); go.type = "button"; const row = $c("div", "row"); row.appendChild(go); card.appendChild(row); const f = $c("div"); f.hidden = true; card.appendChild(f);
      const tryDoor = () => {
        if (norm(i.value) !== norm(codice)) { f.className = "fb ko"; f.innerHTML = "Il codice non è giusto. Guarda i simboli in alto, da sinistra a destra."; f.hidden = false; return; }
        clearInterval(timer); const tempo = clock(); const stelle = st.punti >= 85 ? 3 : st.punti >= 60 ? 2 : 1;
        const prev = store.get("best"); if (!prev || st.punti > prev.punti) store.set("best", { punti: st.punti, stelle, tempo, at: new Date().toISOString() });
        try { if (window.parent !== window) window.parent.postMessage({ type: "proftec-escape-result", mcId: cfg.id, punti: st.punti, stelle }, location.origin); } catch (e) {}
        stage.innerHTML = "";
        const win = $c("div", "bench es-card es-win", `<p class="es-stars" aria-label="${stelle} stelle su 3">${"★".repeat(stelle)}<span>${"☆".repeat(3 - stelle)}</span></p><h2 class="blk-h">Sei fuori!</h2><p>${cfg.vittoria || ""}</p><p class="muted">${st.punti} punti · tempo ${tempo} · indizi usati ${st.hint} · tentativi sbagliati ${st.err}</p>`);
        const again = $c("button", "btn ghost", "Rigioca"); again.type = "button"; again.onclick = start; const r = $c("div", "row"); r.appendChild(again); win.appendChild(r);
        stage.appendChild(win); hudDraw(); locks.lastChild.className = "door open"; showBest();
      };
      go.onclick = tryDoor; i.addEventListener("keydown", (e) => { if (e.key === "Enter") tryDoor(); });
      stage.appendChild(card);
    }
    showBest(); start();
  }
  window.ESCAPE = { run };
})();
