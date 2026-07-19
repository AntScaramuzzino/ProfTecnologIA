/* global GGBApplet */

(function () {
  "use strict";

  const STEPS = [
    {
      kicker: "Prima di iniziare",
      title: "Osserva la situazione",
      description:
        "La retta r passa per P. Il nostro obiettivo è costruire, senza usare il rapportatore, una seconda retta che formi un angolo di 90° proprio in P.",
      equality: "",
      tip: "Cerca il punto P al centro della retta.",
    },
    {
      kicker: "Passo 1 · Apertura d",
      title: "Trova due punti equidistanti",
      description:
        "Punta il compasso in P e traccia un arco. Le due intersezioni con la retta sono A e B: si trovano alla stessa distanza da P.",
      equality: "PA = PB = d",
      tip: "L’apertura d è libera: conta soltanto non cambiarla durante questo passaggio.",
    },
    {
      kicker: "Passo 2 · Apertura maggiore",
      title: "Traccia un arco con centro A",
      description:
        "Aumenta l’apertura del compasso. Punta in A e traccia un arco sopra la retta. La nuova apertura deve essere maggiore di metà AB.",
      equality: "apertura > AB ÷ 2",
      tip: "Nel disegno d = 3 ed è stata scelta un’apertura pari a 5.",
    },
    {
      kicker: "Passo 3 · Stessa apertura",
      title: "Ripeti l’arco con centro B",
      description:
        "Senza modificare il compasso, punta in B. Il nuovo arco incontra il precedente nel punto C.",
      equality: "AC = BC",
      tip: "La stessa apertura garantisce che C sia equidistante da A e da B.",
    },
    {
      kicker: "Passo 4 · Righello",
      title: "Unisci P e C",
      description:
        "Traccia la retta che passa per P e C. Hai costruito la perpendicolare a r: i due angoli in P misurano entrambi 90°.",
      equality: "PC ⟂ r",
      tip: "Ora puoi visualizzare la dimostrazione con i due triangoli congruenti.",
    },
  ];

  const OBJECTS = {
    helper: ["d", "e", "t1", "t2", "t3", "t4", "pArcEnd", "Astart", "Aend", "Bstart", "Bend", "Q"],
    base: ["r", "P"],
    step1: ["arcoP", "A", "B", "segPA", "segPB"],
    step2: ["arcoA"],
    step3: ["arcoB", "C"],
    step4: ["segmentoPC", "rettaPC", "angAPC", "angCPB", "left90", "right90"],
    proof: ["triAPC", "triBPC", "segAC", "segBC", "segPCproof"],
  };

  let api = null;
  let currentStep = 0;
  let currentProgress = 1;
  let isPlaying = false;
  let proofVisible = false;
  let animationToken = 0;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const elements = {
    loading: document.getElementById("loading-state"),
    stepKicker: document.getElementById("step-kicker"),
    stepTitle: document.getElementById("step-title"),
    stepDescription: document.getElementById("step-description"),
    stepEquality: document.getElementById("step-equality"),
    stepTip: document.getElementById("step-tip"),
    stepChips: Array.from(document.querySelectorAll("[data-step]")),
    previous: document.getElementById("previous-button"),
    next: document.getElementById("next-button"),
    play: document.getElementById("play-button"),
    playIcon: document.querySelector(".play-icon"),
    playLabel: document.querySelector(".play-label"),
    proofPanel: document.getElementById("proof-panel"),
    proof: document.getElementById("proof-button"),
    reset: document.getElementById("reset-button"),
    download: document.getElementById("download-button"),
  };

  function setVisible(names, visible) {
    names.forEach((name) => api.setVisible(name, visible));
  }

  function styleConstruction() {
    api.setAxesVisible(false, false);
    api.setGridVisible(false);
    api.setCoordSystem(-7, 7, -3.1, 6.1);
    api.setErrorDialogsActive(false);

    const fixedObjects = Object.values(OBJECTS).flat();
    fixedObjects.forEach((name) => api.setFixed(name, true, false));

    api.setColor("r", 51, 65, 85);
    api.setLineThickness("r", 4);
    api.setCaption("r", "r");
    api.setLabelStyle("r", 3);
    api.setLabelVisible("r", true);

    ["arcoP", "arcoA", "arcoB"].forEach((name) => {
      api.setColor(name, 217, 119, 6);
      api.setLineThickness(name, 5);
    });

    ["segPA", "segPB"].forEach((name) => {
      api.setColor(name, 71, 85, 105);
      api.setLineThickness(name, 2);
      api.setLineStyle(name, 2);
    });

    ["segmentoPC", "rettaPC"].forEach((name) => {
      api.setColor(name, 4, 120, 87);
      api.setLineThickness(name, name === "rettaPC" ? 4 : 7);
    });

    ["segAC", "segBC", "segPCproof"].forEach((name) => {
      api.setColor(name, 15, 118, 110);
      api.setLineThickness(name, 3);
      api.setLineStyle(name, 1);
    });

    api.setColor("P", 220, 38, 38);
    api.setColor("A", 29, 78, 216);
    api.setColor("B", 29, 78, 216);
    api.setColor("C", 126, 34, 206);
    ["P", "A", "B", "C"].forEach((name) => {
      api.setPointSize(name, 6);
      api.setLabelVisible(name, true);
    });

    api.setCaption("segPA", "PA = d");
    api.setCaption("segPB", "PB = d");
    api.setCaption("segAC", "AC");
    api.setCaption("segBC", "BC");
    api.setCaption("rettaPC", "PC ⟂ r");
    ["segPA", "segPB", "segAC", "segBC", "rettaPC"].forEach((name) => api.setLabelStyle(name, 3));

    api.setColor("triAPC", 37, 99, 235);
    api.setFilling("triAPC", 0.13);
    api.setColor("triBPC", 139, 92, 246);
    api.setFilling("triBPC", 0.13);

    ["angAPC", "angCPB"].forEach((name) => {
      api.setColor(name, 5, 150, 105);
      api.setFilling(name, 0.34);
      api.setLineThickness(name, 3);
      api.setLabelVisible(name, false);
    });

    ["left90", "right90"].forEach((name) => {
      api.setColor(name, 4, 120, 87);
      api.setFixed(name, true, false);
    });
  }

  function verifyConstruction() {
    const expected = [
      "P", "A", "B", "C", "r", "arcoP", "arcoA", "arcoB",
      "segmentoPC", "rettaPC", "segPA", "segPB", "segAC", "segBC",
      "triAPC", "triBPC", "angAPC", "angCPB",
    ];
    const missing = expected.filter((name) => !api.exists(name));
    if (missing.length > 0) {
      throw new Error(`Oggetti GeoGebra mancanti: ${missing.join(", ")}`);
    }

    const angleLeft = api.getValue("angAPC");
    const angleRight = api.getValue("angCPB");
    const angleDifference = Math.abs(angleLeft - angleRight);
    const rightAngle = Math.PI / 2;
    const isRightAngle = Math.abs(angleLeft - rightAngle) <= 1e-6 && Math.abs(angleRight - rightAngle) <= 1e-6;
    if (!Number.isFinite(angleDifference) || angleDifference > 1e-6 || !isRightAngle) {
      throw new Error(`Perpendicolarita non verificata: angoli ${angleLeft} e ${angleRight}`);
    }
  }

  function buildConstruction(ggbApi) {
    api = ggbApi;
    api.setPerspective("G");
    api.setRepaintingActive(false);

    const construction = [
      "d=3",
      "e=5",
      "t1=0",
      "t2=0",
      "t3=0",
      "t4=0",
      "P=(0,0)",
      "r=Line((-7,0),(7,0))",
      "A=(-d,0)",
      "B=(d,0)",
      "C=(0,sqrt(e^2-d^2))",
      "pArcEnd=Rotate(A,180°*t1,P)",
      "arcoP=CircularArc(P,A,pArcEnd)",
      "Astart=(x(A)+e*cos(18°),y(A)+e*sin(18°))",
      "Aend=Rotate(Astart,62°*t2,A)",
      "arcoA=CircularArc(A,Astart,Aend)",
      "Bstart=(x(B)+e*cos(100°),y(B)+e*sin(100°))",
      "Bend=Rotate(Bstart,62°*t3,B)",
      "arcoB=CircularArc(B,Bstart,Bend)",
      "Q=P+t4*(C-P)",
      "segmentoPC=Segment(P,Q)",
      "rettaPC=Line(P,C)",
      "segPA=Segment(P,A)",
      "segPB=Segment(P,B)",
      "segAC=Segment(A,C)",
      "segBC=Segment(B,C)",
      "segPCproof=Segment(P,C)",
      "triAPC=Polygon(A,P,C)",
      "triBPC=Polygon(B,P,C)",
      "angAPC=Angle(A,P,C)",
      "angCPB=Angle(C,P,B)",
      "left90=Text(\"90°\",(-1.05,0.52))",
      "right90=Text(\"90°\",(0.38,0.52))",
    ].join("\n");

    const ok = api.evalCommand(construction);
    if (!ok) {
      showError("GeoGebra non è riuscito a creare la costruzione. Ricarica la pagina e riprova.");
      return;
    }

    try {
      verifyConstruction();
    } catch (error) {
      showError(error instanceof Error ? error.message : "La verifica geometrica non è riuscita.");
      return;
    }

    styleConstruction();
    setVisible(OBJECTS.helper, false);
    setVisible(OBJECTS.proof, false);
    api.setRepaintingActive(true);
    api.refreshViews();

    elements.loading.hidden = true;
    setControlsEnabled(true);
    applyStage(0, 1);
    updateInterface();
  }

  function setControlsEnabled(enabled) {
    elements.stepChips.forEach((button) => { button.disabled = !enabled; });
    elements.play.disabled = !enabled;
    elements.reset.disabled = !enabled;
    elements.download.disabled = !enabled;
    elements.previous.disabled = !enabled || currentStep === 0;
    elements.next.disabled = !enabled || currentStep === STEPS.length - 1;
  }

  function applyStage(stage, progress) {
    if (!api) return;
    currentStep = stage;
    currentProgress = progress;

    api.setRepaintingActive(false);
    api.setValue("t1", stage > 1 ? 1 : stage === 1 ? progress : 0);
    api.setValue("t2", stage > 2 ? 1 : stage === 2 ? progress : 0);
    api.setValue("t3", stage > 3 ? 1 : stage === 3 ? progress : 0);
    api.setValue("t4", stage > 4 ? 1 : stage === 4 ? Math.max(progress, 0.001) : 0.001);

    setVisible(OBJECTS.base, true);
    api.setVisible("arcoP", stage >= 1);
    ["A", "B", "segPA", "segPB"].forEach((name) => {
      api.setVisible(name, stage > 1 || (stage === 1 && progress >= 0.7));
    });
    api.setVisible("arcoA", stage >= 2);
    api.setVisible("arcoB", stage >= 3);
    api.setVisible("C", stage > 3 || (stage === 3 && progress >= 0.7));
    api.setVisible("segmentoPC", stage === 4 && progress < 0.98);
    ["rettaPC", "angAPC", "angCPB", "left90", "right90"].forEach((name) => {
      api.setVisible(name, stage === 4 && progress >= 0.98);
    });

    const showProof = proofVisible && stage === 4 && progress >= 0.98;
    setVisible(OBJECTS.proof, showProof);
    ["segAC", "segBC"].forEach((name) => api.setLabelVisible(name, showProof));
    ["angAPC", "angCPB"].forEach((name) => api.setLabelVisible(name, false));
    api.setLabelVisible("rettaPC", stage === 4 && progress >= 0.98);

    api.setRepaintingActive(true);
    api.refreshViews();
    updateInterface();
  }

  function updateInterface() {
    const step = STEPS[currentStep];
    elements.stepKicker.textContent = step.kicker;
    elements.stepTitle.textContent = step.title;
    elements.stepDescription.textContent = step.description;
    elements.stepTip.innerHTML = `<span aria-hidden="true">🎯</span>${step.tip}`;

    if (step.equality) {
      elements.stepEquality.textContent = step.equality;
      elements.stepEquality.hidden = false;
    } else {
      elements.stepEquality.hidden = true;
      elements.stepEquality.textContent = "";
    }

    elements.stepChips.forEach((button, index) => {
      const isActive = index === currentStep;
      const isComplete = index < currentStep || (index === 4 && currentStep === 4 && currentProgress >= 0.98);
      button.classList.toggle("is-active", isActive);
      button.classList.toggle("is-complete", isComplete && !isActive);
      if (isActive) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });

    elements.previous.disabled = !api || isPlaying || currentStep === 0;
    elements.next.disabled = !api || isPlaying || currentStep === STEPS.length - 1;
    elements.proofPanel.hidden = !(currentStep === 4 && currentProgress >= 0.98);
    elements.playIcon.textContent = isPlaying ? "■" : "▶";
    elements.playLabel.textContent = isPlaying ? "Ferma animazione" : "Avvia tutta la costruzione";
    elements.proof.setAttribute("aria-pressed", String(proofVisible));
    elements.proof.textContent = proofVisible ? "Nascondi la dimostrazione" : "Mostra la dimostrazione LLL";
  }

  function animateStep(step, token) {
    if (reduceMotion) {
      applyStage(step, 1);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const duration = step === 4 ? 1150 : 1450;
      const startedAt = performance.now();

      function frame(now) {
        if (token !== animationToken) {
          resolve();
          return;
        }
        const linear = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - linear, 3);
        applyStage(step, eased);
        if (linear < 1) requestAnimationFrame(frame);
        else resolve();
      }

      requestAnimationFrame(frame);
    });
  }

  function delay(ms, token) {
    return new Promise((resolve) => {
      window.setTimeout(() => resolve(token === animationToken), ms);
    });
  }

  async function playAll() {
    if (!api) return;
    if (isPlaying) {
      animationToken += 1;
      isPlaying = false;
      updateInterface();
      return;
    }

    proofVisible = false;
    isPlaying = true;
    const token = ++animationToken;
    applyStage(0, 1);
    updateInterface();
    await delay(reduceMotion ? 80 : 350, token);

    for (let step = 1; step < STEPS.length; step += 1) {
      if (token !== animationToken) break;
      await animateStep(step, token);
      if (token !== animationToken) break;
      await delay(reduceMotion ? 120 : 520, token);
    }

    if (token === animationToken) {
      isPlaying = false;
      updateInterface();
    }
  }

  function goToStep(step, animate) {
    if (!api || isPlaying || step < 0 || step >= STEPS.length) return;
    proofVisible = false;
    animationToken += 1;
    if (animate && step > 0) animateStep(step, animationToken);
    else applyStage(step, 1);
  }

  function toggleProof() {
    if (!api || currentStep !== 4) return;
    proofVisible = !proofVisible;
    applyStage(4, 1);
  }

  function downloadGgb() {
    if (!api) return;
    api.getBase64((base64) => {
      const binary = window.atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/vnd.geogebra.file" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "MC-DIS-1-01_perpendicolare-in-P.ggb";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }

  function showError(message) {
    elements.loading.classList.add("is-error");
    elements.loading.innerHTML = message;
    setControlsEnabled(false);
  }

  function attachEvents() {
    elements.stepChips.forEach((button) => {
      button.addEventListener("click", () => goToStep(Number(button.dataset.step), true));
    });
    elements.previous.addEventListener("click", () => goToStep(currentStep - 1, false));
    elements.next.addEventListener("click", () => goToStep(currentStep + 1, true));
    elements.play.addEventListener("click", playAll);
    elements.proof.addEventListener("click", toggleProof);
    elements.reset.addEventListener("click", () => goToStep(0, false));
    elements.download.addEventListener("click", downloadGgb);
  }

  function init() {
    attachEvents();

    if (typeof GGBApplet === "undefined") {
      showError(
        "GeoGebra non è disponibile. Controlla la connessione a Internet oppure consenti il caricamento da geogebra.org."
      );
      return;
    }

    const params = {
      id: "perpendicularConstruction",
      appName: "geometry",
      width: 850,
      height: 520,
      appletOnLoad: buildConstruction,
      showToolBar: false,
      showMenuBar: false,
      showAlgebraInput: false,
      showResetIcon: false,
      showZoomButtons: true,
      showFullscreenButton: true,
      enableRightClick: false,
      enableLabelDrags: false,
      enableShiftDragZoom: true,
      enableUndoRedo: false,
      enableFileFeatures: false,
      errorDialogsActive: false,
      language: "it",
      perspective: "G",
      preventFocus: true,
      scaleContainerClass: "ggb-frame",
      autoHeight: true,
      allowUpscale: false,
      borderColor: "#dbe3ec",
      borderRadius: 14,
    };

    const applet = new GGBApplet(params, true);
    applet.inject("ggb-element");
  }

  window.addEventListener("DOMContentLoaded", init);
})();
