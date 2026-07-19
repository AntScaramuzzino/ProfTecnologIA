/* global GGBApplet */

(function () {
  "use strict";

  const SLUG = "MC-DIS-1-01_bisettrice-angolo";
  const ANGLE_DEGREES = 58;

  const STEPS = [
    {
      kicker: "Prima di iniziare",
      title: "Osserva l’angolo",
      description:
        "Hai due semirette con vertice in O. L’obiettivo è tracciare la retta che divide l’angolo in due parti uguali, senza usare il rapportatore.",
      equality: "",
      tip: "Cerca il vertice O: da lì partirà anche la bisettrice.",
    },
    {
      kicker: "Passo 1 · Arco da O",
      title: "Segna A e B sui lati",
      description:
        "Punta il compasso in O e traccia un arco. L’arco incontra i lati dell’angolo in A e B: sono alla stessa distanza dal vertice.",
      equality: "OA = OB",
      tip: "L’apertura è libera, ma deve restare la stessa mentre segni A e B.",
    },
    {
      kicker: "Passo 2 · Arco da A",
      title: "Traccia un arco nell’interno",
      description:
        "Aumenta un po’ l’apertura del compasso. Punta in A e traccia un arco dentro l’angolo.",
      equality: "apertura > AB ÷ 2",
      tip: "Serve un’apertura abbastanza grande perché i due archi successivi si incontrino.",
    },
    {
      kicker: "Passo 3 · Stessa apertura",
      title: "Ripeti l’arco da B",
      description:
        "Senza cambiare apertura, punta in B. Il nuovo arco incontra il precedente nel punto C.",
      equality: "AC = BC",
      tip: "La stessa apertura rende C equidistante da A e da B.",
    },
    {
      kicker: "Passo 4 · Righello",
      title: "Unisci O e C",
      description:
        "Traccia la retta che passa per O e C. Hai costruito la bisettrice: i due angoli ottenuti sono uguali.",
      equality: "∠AOC = ∠COB",
      tip: "Ora puoi mostrare la dimostrazione con i due triangoli congruenti.",
    },
  ];

  const OBJECTS = {
    helper: [
      "d", "e", "theta", "halfTheta", "s", "t1", "t2", "t3", "t4",
      "arcOEnd", "AarcStart", "AarcEnd", "BarcStart", "BarcEnd", "Q",
    ],
    base: ["O", "rayOA", "rayOB", "angAOB"],
    step1: ["arcoO", "A", "B", "segOA", "segOB"],
    step2: ["arcoA"],
    step3: ["arcoB", "C"],
    step4: ["segmentoOC", "rettaOC", "angAOC", "angCOB", "labelAngleLeft", "labelAngleRight"],
    proof: ["triOAC", "triOBC", "segAC", "segBC", "segOCproof"],
  };

  let api = null;
  let currentStep = 0;
  let currentProgress = 1;
  let isPlaying = false;
  let proofVisible = false;
  let animationToken = 0;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const APPLET_ASPECT_RATIO = 820 / 520;

  const elements = {
    loading: document.getElementById("loading-state"),
    stepKicker: document.getElementById("step-kicker"),
    stepTitle: document.getElementById("step-title"),
    stepDescription: document.getElementById("step-description"),
    stepEquality: document.getElementById("step-equality"),
    stepTip: document.getElementById("step-tip"),
    stepChips: Array.from(document.querySelectorAll("[data-step]")),
    first: document.getElementById("first-button"),
    previous: document.getElementById("previous-button"),
    next: document.getElementById("next-button"),
    last: document.getElementById("last-button"),
    play: document.getElementById("play-button"),
    playIcon: document.querySelector(".play-icon"),
    playLabel: document.querySelector(".play-label"),
    stepCounter: document.getElementById("step-counter"),
    speed: document.getElementById("animation-speed"),
    protocolToggle: document.getElementById("protocol-toggle-button"),
    protocolSteps: document.getElementById("protocol-steps"),
    proofPanel: document.getElementById("proof-panel"),
    proof: document.getElementById("proof-button"),
    reset: document.getElementById("reset-button"),
    download: document.getElementById("download-button"),
  };

  function setVisible(names, visible) {
    names.forEach((name) => {
      if (api.exists(name)) api.setVisible(name, visible);
    });
  }

  function styleConstruction() {
    api.setAxesVisible(false, false);
    api.setGridVisible(false);
    setEqualScaleCoordSystem([-1.1, 7.2, -0.9, 5.2]);
    api.setErrorDialogsActive(false);

    Object.values(OBJECTS).flat().forEach((name) => {
      if (api.exists(name)) api.setFixed(name, true, false);
    });

    ["rayOA", "rayOB"].forEach((name) => {
      api.setColor(name, 71, 85, 105);
      api.setLineThickness(name, 4);
      api.setLabelVisible(name, false);
    });

    api.setColor("angAOB", 148, 163, 184);
    api.setFilling("angAOB", 0.18);
    api.setLineThickness("angAOB", 2);
    api.setLabelVisible("angAOB", false);

    ["arcoO", "arcoA", "arcoB"].forEach((name) => {
      api.setColor(name, 217, 119, 6);
      api.setLineThickness(name, 5);
    });

    ["segOA", "segOB"].forEach((name) => {
      api.setColor(name, 71, 85, 105);
      api.setLineThickness(name, 2);
      api.setLineStyle(name, 2);
    });

    ["segmentoOC", "rettaOC"].forEach((name) => {
      api.setColor(name, 0, 0, 0);
      api.setLineStyle(name, 0);
      api.setLineThickness(name, name === "rettaOC" ? 6 : 7);
    });

    ["segAC", "segBC", "segOCproof"].forEach((name) => {
      api.setColor(name, 15, 118, 110);
      api.setLineThickness(name, 3);
      api.setLineStyle(name, 1);
    });

    api.setColor("O", 220, 38, 38);
    api.setColor("A", 29, 78, 216);
    api.setColor("B", 29, 78, 216);
    api.setColor("C", 126, 34, 206);
    ["O", "A", "B", "C"].forEach((name) => {
      api.setPointSize(name, 6);
      api.setLabelVisible(name, true);
    });

    api.setCaption("segOA", "OA");
    api.setCaption("segOB", "OB");
    api.setCaption("segAC", "AC");
    api.setCaption("segBC", "BC");
    api.setCaption("rettaOC", "bisettrice OC");
    ["segOA", "segOB", "segAC", "segBC", "rettaOC"].forEach((name) => api.setLabelStyle(name, 3));

    api.setColor("triOAC", 37, 99, 235);
    api.setFilling("triOAC", 0.13);
    api.setColor("triOBC", 139, 92, 246);
    api.setFilling("triOBC", 0.13);

    ["angAOC", "angCOB"].forEach((name) => {
      api.setColor(name, 5, 150, 105);
      api.setFilling(name, 0.34);
      api.setLineThickness(name, 3);
      api.setLabelVisible(name, false);
    });

    ["labelAngleLeft", "labelAngleRight"].forEach((name) => {
      api.setColor(name, 4, 120, 87);
      api.setFixed(name, true, false);
    });
  }

  function verifyConstruction() {
    const expected = [
      "O", "A", "B", "C", "rayOA", "rayOB", "arcoO", "arcoA", "arcoB",
      "segmentoOC", "rettaOC", "segOA", "segOB", "segAC", "segBC",
      "triOAC", "triOBC", "angAOC", "angCOB",
    ];
    const missing = expected.filter((name) => !api.exists(name));
    if (missing.length > 0) {
      throw new Error(`Oggetti GeoGebra mancanti: ${missing.join(", ")}`);
    }

    const left = api.getValue("angAOC");
    const right = api.getValue("angCOB");
    const expectedHalf = (ANGLE_DEGREES * Math.PI) / 360;
    const difference = Math.abs(left - right);
    const isHalf = Math.abs(left - expectedHalf) <= 1e-6 && Math.abs(right - expectedHalf) <= 1e-6;
    if (!Number.isFinite(difference) || difference > 1e-6 || !isHalf) {
      throw new Error(`Bisettrice non verificata: angoli ${left} e ${right}`);
    }
  }

  function setEqualScaleCoordSystem(bounds) {
    const [xMin, xMax, yMin, yMax] = bounds;
    const xCenter = (xMin + xMax) / 2;
    const yCenter = (yMin + yMax) / 2;
    let xRange = xMax - xMin;
    let yRange = yMax - yMin;
    const currentRatio = xRange / yRange;

    if (currentRatio < APPLET_ASPECT_RATIO) {
      xRange = yRange * APPLET_ASPECT_RATIO;
    } else {
      yRange = xRange / APPLET_ASPECT_RATIO;
    }

    api.setCoordSystem(
      xCenter - xRange / 2,
      xCenter + xRange / 2,
      yCenter - yRange / 2,
      yCenter + yRange / 2
    );
  }

  function buildConstruction(ggbApi) {
    api = ggbApi;
    api.setPerspective("G");
    api.setRepaintingActive(false);

    const construction = [
      "d=3.2",
      "e=3.4",
      `theta=${ANGLE_DEGREES}°`,
      "halfTheta=theta/2",
      "s=d*cos(halfTheta)+sqrt(e^2-d^2*sin(halfTheta)^2)",
      "t1=0",
      "t2=0",
      "t3=0",
      "t4=0",
      "O=(0,0)",
      "A=(d,0)",
      "B=(d*cos(theta),d*sin(theta))",
      "C=(s*cos(halfTheta),s*sin(halfTheta))",
      "rayOA=Ray(O,A)",
      "rayOB=Ray(O,B)",
      "arcOEnd=Rotate(A,theta*t1,O)",
      "arcoO=CircularArc(O,A,arcOEnd)",
      "AarcStart=Rotate(C,-34°,A)",
      "AarcEnd=Rotate(AarcStart,68°*t2,A)",
      "arcoA=CircularArc(A,AarcStart,AarcEnd)",
      "BarcStart=Rotate(C,-34°,B)",
      "BarcEnd=Rotate(BarcStart,68°*t3,B)",
      "arcoB=CircularArc(B,BarcStart,BarcEnd)",
      "Q=O+t4*(C-O)",
      "segmentoOC=Segment(O,Q)",
      "rettaOC=Line(O,C)",
      "segOA=Segment(O,A)",
      "segOB=Segment(O,B)",
      "segAC=Segment(A,C)",
      "segBC=Segment(B,C)",
      "segOCproof=Segment(O,C)",
      "triOAC=Polygon(O,A,C)",
      "triOBC=Polygon(O,B,C)",
      "angAOB=Angle(A,O,B)",
      "angAOC=Angle(A,O,C)",
      "angCOB=Angle(C,O,B)",
      "labelAngleLeft=Text(\"29°\",(1.15,0.27))",
      "labelAngleRight=Text(\"29°\",(0.96,0.72))",
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
    elements.first.disabled = !enabled || currentStep === 0;
    elements.previous.disabled = !enabled || currentStep === 0;
    elements.next.disabled = !enabled || currentStep === STEPS.length - 1;
    elements.last.disabled = !enabled || currentStep === STEPS.length - 1;
    elements.protocolToggle.disabled = !enabled;
  }

  function applyStage(stage, progress) {
    if (!api) return;
    currentStep = stage;
    currentProgress = progress;

    api.setRepaintingActive(false);
    api.setValue("t1", stage > 1 ? 1 : stage === 1 ? progress : 0);
    api.setValue("t2", stage > 2 ? 1 : stage === 2 ? progress : 0);
    api.setValue("t3", stage > 3 ? 1 : stage === 3 ? progress : 0);
    api.setValue("t4", stage > 4 ? 1 : stage === 4 ? progress : 0);

    setVisible(OBJECTS.base, true);
    setVisible(OBJECTS.step1, stage >= 1);
    setVisible(OBJECTS.step2, stage >= 2);
    setVisible(OBJECTS.step3, stage >= 3);
    setVisible(OBJECTS.step4, stage >= 4);
    setVisible(OBJECTS.proof, proofVisible && stage >= 4);

    api.setVisible("rettaOC", stage >= 4 && progress >= 1);
    api.setVisible("labelAngleLeft", stage >= 4 && progress >= 1);
    api.setVisible("labelAngleRight", stage >= 4 && progress >= 1);

    api.setRepaintingActive(true);
    api.refreshViews();
    updateInterface();
  }

  function updateInterface() {
    const step = STEPS[currentStep];
    elements.stepKicker.textContent = step.kicker;
    elements.stepTitle.textContent = step.title;
    elements.stepDescription.textContent = step.description;
    elements.stepTip.innerHTML = `<span aria-hidden="true">🎯</span> ${step.tip}`;

    if (step.equality) {
      elements.stepEquality.textContent = step.equality;
      elements.stepEquality.hidden = false;
    } else {
      elements.stepEquality.hidden = true;
    }

    elements.stepChips.forEach((button, index) => {
      button.classList.toggle("is-active", index === currentStep);
      button.classList.toggle("is-complete", index < currentStep || (index === currentStep && currentProgress >= 1));
      if (index === currentStep) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });

    elements.previous.disabled = !api || isPlaying || currentStep === 0;
    elements.next.disabled = !api || isPlaying || currentStep === STEPS.length - 1;
    elements.first.disabled = !api || isPlaying || currentStep === 0;
    elements.last.disabled = !api || isPlaying || currentStep === STEPS.length - 1;
    elements.stepCounter.textContent = `${currentStep + 1} / ${STEPS.length}`;
    updateProtocolList();
    elements.proofPanel.hidden = currentStep < 4;
    elements.proof.setAttribute("aria-pressed", String(proofVisible));
    elements.proof.textContent = proofVisible ? "Nascondi la dimostrazione LLL" : "Mostra la dimostrazione LLL";
    elements.playIcon.textContent = isPlaying ? "■" : "▶";
    elements.playLabel.textContent = isPlaying ? "Stop" : "Avvia";
  }

  function getAnimationDuration(step) {
    const seconds = Number(elements.speed.value);
    const safeSeconds = Number.isFinite(seconds) ? Math.min(4, Math.max(0.5, seconds)) : 1.5;
    return step === 4 ? safeSeconds * 740 : safeSeconds * 1000;
  }

  function animateStep(step, token) {
    if (reduceMotion) {
      applyStage(step, 1);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const start = performance.now();
      const duration = getAnimationDuration(step);

      function frame(now) {
        if (token !== animationToken) {
          resolve();
          return;
        }
        const linear = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - linear, 3);
        applyStage(step, eased);
        if (linear < 1) requestAnimationFrame(frame);
        else resolve();
      }

      requestAnimationFrame(frame);
    });
  }

  function goToStep(step, animate) {
    if (!api || step < 0 || step >= STEPS.length) return;
    const token = ++animationToken;
    setPlaying(false);
    if (animate) animateStep(step, token);
    else applyStage(step, 1);
  }

  async function playAll() {
    if (!api) return;
    if (isPlaying) {
      animationToken += 1;
      setPlaying(false);
      return;
    }

    const token = ++animationToken;
    setPlaying(true);
    proofVisible = false;
    applyStage(0, 1);

    for (let step = 1; step < STEPS.length; step += 1) {
      if (token !== animationToken) return;
      await animateStep(step, token);
    }

    if (token === animationToken) setPlaying(false);
  }

  function setPlaying(value) {
    isPlaying = value;
    elements.playIcon.textContent = value ? "■" : "▶";
    elements.playLabel.textContent = value ? "Ferma animazione" : "Avvia tutta la costruzione";
    elements.play.setAttribute("aria-pressed", String(value));
  }

  function toggleProof() {
    proofVisible = !proofVisible;
    applyStage(currentStep, currentProgress);
  }

  function buildProtocolList() {
    elements.protocolSteps.innerHTML = "";
    STEPS.forEach((step, index) => {
      const item = document.createElement("li");
      item.textContent = `${index + 1}. ${step.kicker}`;
      elements.protocolSteps.appendChild(item);
    });
  }

  function updateProtocolList() {
    Array.from(elements.protocolSteps.children).forEach((item, index) => {
      item.classList.toggle("is-active", index === currentStep);
      item.classList.toggle("is-complete", index < currentStep);
    });
  }

  function toggleProtocolList() {
    const willOpen = elements.protocolSteps.hidden;
    elements.protocolSteps.hidden = !willOpen;
    elements.protocolToggle.setAttribute("aria-expanded", String(willOpen));
  }

  function downloadGgb() {
    if (!api) return;
    api.getBase64((base64) => {
      const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/vnd.geogebra.file" });
      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement("a"), {
        href: url,
        download: `${SLUG}.ggb`,
      });
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }

  function showError(message) {
    elements.loading.classList.add("is-error");
    elements.loading.textContent = message;
  }

  function init() {
    buildProtocolList();
    elements.stepChips.forEach((button) => {
      button.disabled = true;
      button.addEventListener("click", () => {
        const step = Number(button.dataset.step);
        goToStep(step, true);
      });
    });

    elements.first.addEventListener("click", () => goToStep(0, false));
    elements.previous.addEventListener("click", () => goToStep(currentStep - 1, false));
    elements.next.addEventListener("click", () => goToStep(currentStep + 1, true));
    elements.last.addEventListener("click", () => goToStep(STEPS.length - 1, true));
    elements.play.addEventListener("click", playAll);
    elements.protocolToggle.addEventListener("click", toggleProtocolList);
    elements.proof.addEventListener("click", toggleProof);
    elements.reset.addEventListener("click", () => {
      proofVisible = false;
      goToStep(0, false);
    });
    elements.download.addEventListener("click", downloadGgb);

    window.addEventListener("message", (event) => {
      if (event.data === "tecnologia:ggb:height") {
        document.documentElement.style.minHeight = "0";
      }
    });

    if (typeof GGBApplet === "undefined") {
      showError("GeoGebra non è disponibile. Controlla la connessione a Internet oppure consenti il caricamento da geogebra.org.");
      return;
    }

    const applet = new GGBApplet({
      id: "bisettrice_angolo_applet",
      appName: "geometry",
      width: 820,
      height: 520,
      appletOnLoad: buildConstruction,
      showToolBar: false,
      showMenuBar: false,
      showAlgebraInput: false,
      showAnimationButton: true,
      showZoomButtons: true,
      showFullscreenButton: true,
      enableRightClick: false,
      enableLabelDrags: false,
      errorDialogsActive: false,
      language: "it",
      scaleContainerClass: "ggb-frame",
      autoHeight: true,
    }, true);

    applet.inject("ggb-element");
  }

  window.addEventListener("DOMContentLoaded", init);
})();
