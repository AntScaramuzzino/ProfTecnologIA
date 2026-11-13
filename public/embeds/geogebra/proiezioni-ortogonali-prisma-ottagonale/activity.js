/* global GGBApplet */

(function () {
  "use strict";

  const SLUG = "proiezioni-ortogonali-prisma-ottagonale";
  const STEPS = [
    {
      short: "Osserva",
      kicker: "Prima di disegnare",
      title: "Leggi forma e misure",
      description: "Osserva e ruota il prisma grande al centro del foglio. È retto: il suo asse è perpendicolare al piano orizzontale. La base è un ottagono regolare inscritto in una circonferenza di raggio 4 cm; l’altezza è 7 cm.",
      rule: "Base: R = 4 cm  ·  Altezza: H = 7 cm",
      question: "Su quale piano riconosci la vera forma della base?",
      options: ["Piano orizzontale (PO)", "Piano verticale (PV)", "Piano laterale (PL)"],
      correct: 0,
      success: "Esatto: guardando dall’alto vedi l’ottagono senza deformazioni.",
      wrong: "Riprova: cerca il piano parallelo alla base del prisma.",
    },
    {
      short: "Pianta",
      kicker: "Passo 1 · Piano orizzontale",
      title: "Costruisci la pianta",
      description: "Il prisma si riduce e si sposta di lato. Traccia la circonferenza di raggio 4 cm e dividila in otto parti uguali. Unendo i punti ottieni la vera forma della base.",
      rule: "PIANTA = larghezza + profondità",
      question: "Quale misura NON compare nella pianta?",
      options: ["Larghezza", "Profondità", "Altezza"],
      correct: 2,
      success: "Giusto: l’altezza è perpendicolare al PO e qui si riduce a un punto.",
      wrong: "Osserva la vista dall’alto: puoi leggere solo le due direzioni del piano.",
    },
    {
      short: "Prospetto",
      kicker: "Passo 2 · Piano verticale",
      title: "Proietta il prospetto",
      description: "Porta verso l’alto i vertici della pianta con proiettanti perpendicolari alla linea di terra. Parti a 1 cm dalla LT, poi riporta l’altezza del prisma.",
      rule: "PROSPETTO = larghezza + H · distanza da LT = 1 cm",
      question: "Quanto deve misurare l’altezza del prospetto?",
      options: ["4 cm", "7 cm", "8 cm"],
      correct: 1,
      success: "Esatto: il prospetto conserva l’altezza reale di 7 cm.",
      wrong: "Il raggio della base è 4 cm; cerca invece la misura H del prisma.",
    },
    {
      short: "Fianco",
      kicker: "Passo 3 · Piano laterale",
      title: "Trasferisci il fianco",
      description: "Porta le profondità della pianta fino alla LP. Ribaltale con archi di 90° centrati nell’intersezione LT–LP, poi proietta dal PV la base e la sommità.",
      rule: "FIANCO = profondità ribaltate con archi + altezze dal PV · distanza da LT = 1 cm",
      question: "Che cosa conservano gli archi di ribaltamento?",
      options: ["La profondità letta sul PO", "La metà dell’altezza", "Il raggio del prisma"],
      correct: 0,
      success: "Perfetto: ogni arco riporta sul PL la stessa profondità letta nella pianta.",
      wrong: "Osserva il raggio dell’arco: parte dalla quota di profondità sul PO e la conserva durante il ribaltamento.",
    },
    {
      short: "Verifica",
      kicker: "Passo 4 · Tavola completa",
      title: "Controlla le corrispondenze",
      description: "Pulisci le linee di costruzione e confronta le viste. Le larghezze si allineano tra pianta e prospetto; le altezze coincidono tra prospetto e fianco.",
      rule: "H prospetto = H fianco = 7 cm · distanza da LT = 1 cm",
      question: "Quale controllo rivela subito un errore?",
      options: ["Le due altezze sono uguali", "La pianta è sopra il prospetto", "Il fianco è un ottagono"],
      correct: 0,
      success: "Controllo corretto: uno stesso spigolo reale deve mantenere la stessa misura nelle viste collegate.",
      wrong: "Confronta le dimensioni condivise: una di queste deve coincidere in prospetto e fianco.",
    },
  ];

  const ISO_SIDE_EDGES = Array.from({ length: 8 }, (_, index) => `isoSide${index + 1}`);
  const ISO_BASE_EDGES = Array.from({ length: 8 }, (_, index) => `isoBaseEdge${index + 1}`);
  const ISO_TOP_EDGES = Array.from({ length: 8 }, (_, index) => `isoTopEdge${index + 1}`);
  const ISO_GROUP = [
    "isoBase", "isoTop", ...ISO_BASE_EDGES, ...ISO_TOP_EDGES, ...ISO_SIDE_EDGES,
    "isoLabel", "isoMeasure",
  ];
  const SHEET_GROUP = ["sheetOuter", "sheetFrame", "sheetFormatLabel", "sheetScaleLabel"];
  const TITLEBLOCK_GROUP = ["sheetTitleblock", "titleblockTitle"];
  const PAPER_GRID = [
    "paperMinorV", "paperMinorH", "paperHalfV", "paperHalfH",
    "paperCentimeterV", "paperCentimeterH",
  ];
  const LOWER_VERTEX_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const UPPER_VERTEX_NAMES = ["I", "J", "K", "L", "M", "N", "O", "P"];
  const PO_VERTEX_LABEL_SPECS = LOWER_VERTEX_NAMES.map((name, index) => ({
    object: `vertexPO${name}${UPPER_VERTEX_NAMES[index]}`,
    text: `${name} ≡ ${UPPER_VERTEX_NAMES[index]}`,
    point: `P${index + 1}`,
    angle: 22.5 + index * 45,
  }));
  const PV_VERTEX_LABEL_SPECS = [
    { object: "vertexPVLowerDE", text: "D′ ≡ E′", point: "P4", labelY: 0.42 },
    { object: "vertexPVLowerCF", text: "C′ ≡ F′", point: "P3", labelY: 0.08 },
    { object: "vertexPVLowerBG", text: "B′ ≡ G′", point: "P2", labelY: 0.42 },
    { object: "vertexPVLowerAH", text: "A′ ≡ H′", point: "P1", labelY: 0.08 },
    { object: "vertexPVUpperLM", text: "L′ ≡ M′", point: "P4", labelY: 8.2 },
    { object: "vertexPVUpperKN", text: "K′ ≡ N′", point: "P3", labelY: 8.58 },
    { object: "vertexPVUpperJO", text: "J′ ≡ O′", point: "P2", labelY: 8.2 },
    { object: "vertexPVUpperIP", text: "I′ ≡ P′", point: "P1", labelY: 8.58 },
  ];
  const PL_VERTEX_LABEL_SPECS = [
    { object: "vertexPLLowerBC", text: "B″ ≡ C″", point: "P2", labelY: 0.42 },
    { object: "vertexPLLowerAD", text: "A″ ≡ D″", point: "P1", labelY: 0.08 },
    { object: "vertexPLLowerEH", text: "E″ ≡ H″", point: "P5", labelY: 0.42 },
    { object: "vertexPLLowerFG", text: "F″ ≡ G″", point: "P6", labelY: 0.08 },
    { object: "vertexPLUpperJK", text: "J″ ≡ K″", point: "P2", labelY: 8.2 },
    { object: "vertexPLUpperIL", text: "I″ ≡ L″", point: "P1", labelY: 8.58 },
    { object: "vertexPLUpperMP", text: "M″ ≡ P″", point: "P5", labelY: 8.2 },
    { object: "vertexPLUpperNO", text: "N″ ≡ O″", point: "P6", labelY: 8.58 },
  ];
  const VERTEX_LABELS_PO = PO_VERTEX_LABEL_SPECS.map(({ object }) => object);
  const VERTEX_LABELS_PV = PV_VERTEX_LABEL_SPECS.map(({ object }) => object);
  const VERTEX_LABELS_PL = PL_VERTEX_LABEL_SPECS.map(({ object }) => object);
  const VERTEX_LABELS = [...VERTEX_LABELS_PO, ...VERTEX_LABELS_PV, ...VERTEX_LABELS_PL];
  const PLAN_POINTS = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];
  const FOLD_SOURCE_POINTS = ["P2", "P1", "P5", "P6"];
  const SIDE_FOLD_ARCS = FOLD_SOURCE_POINTS.map((_, index) => `sideFoldArc${index + 1}`);
  const PLAN_TRACES = ["planArc", "drawPlan1", "drawPlan2", "drawPlan3", "drawPlan4", "drawPlan5", "drawPlan6", "drawPlan7", "drawPlan8"];
  const PLAN_FINAL = ["polyPlan", "planRadiusSegment", "planLabel", "radiusLabel"];
  const FRONT_GUIDES = ["frontGuide1", "frontGuide2", "frontGuide3", "frontGuide4", "frontGuide5", "frontGuide6", "frontGuide7", "frontGuide8"];
  const FRONT_FINAL = ["frontBottom", "frontTop", "frontLeft", "frontInnerLeft", "frontInnerRight", "frontRight", "frontLabel", "heightLabelFront"];
  const FRONT_EDGES = ["frontBottom", "frontTop", "frontLeft", "frontInnerLeft", "frontInnerRight", "frontRight"];
  const SIDE_TRANSFER = [
    "sideAcross1", "sideAcross2", "sideAcross3", "sideAcross4",
    "sideAcross5", "sideAcross6", "sideAcross7", "sideAcross8", ...SIDE_FOLD_ARCS, "sideUp1",
    "sideUp2", "sideUp3", "sideUp4", "sideUp5", "sideUp6", "sideUp7", "sideUp8",
  ];
  const SIDE_HEIGHT_GUIDES = ["sideHeightBottomGuide", "sideHeightTopGuide"];
  const SIDE_FINAL = ["sideBottom", "sideTop", "sideLeft", "sideInnerLeft", "sideInnerRight", "sideRight", "sideLabel", "heightLabelSide"];
  const SIDE_EDGES = ["sideBottom", "sideTop", "sideLeft", "sideInnerLeft", "sideInnerRight", "sideRight"];
  const BASE_GROUP = ["lineOfGround", "groundLabel"];
  const PROFILE_REFERENCE = ["profileReference", "profileReferenceLabel"];
  const LT_OFFSET = ["ltOffsetDimension", "ltOffsetTickA", "ltOffsetTickB", "ltOffsetLabel"];
  const TECHNICAL_HELPERS = [
    "tPlan", "tFront", "tSide", "tAcross", "tArc", "tUp", "PlanArcEnd",
    "C", "R", "frontHeight", "sideHeight", "radiusCheck", "heightDifference",
    "octagonDifference", "transferDifference", "ltOffsetCheck", "LtDimA", "LtDimB",
    "profileShift", "profileAxisX", "profileShiftCheck", "profilePerpendicularCheck",
    "profileAlignmentCheck", "isoShiftCheck", "ProfileOrigin", "ProfileBottom", "ProfileTop",
    "sheetWidthCheck", "sheetHeightCheck", "squadraturaCheck", "titleblockRise", "titleblockRiseCheck",
    "SheetA", "SheetB", "SheetC", "SheetD", "FrameA", "FrameB", "FrameC", "FrameD",
    "SideHeightBottomEnd", "SideHeightTopEnd", "heightProjectionDifference",
    "foldRadiusDifference", "foldAngleDifference",
    ...Array.from({ length: 8 }, (_, index) => `PlanEnd${index + 1}`),
    ...Array.from({ length: 8 }, (_, index) => `FrontGuideEnd${index + 1}`),
    ...Array.from({ length: 8 }, (_, index) => `Q${index + 1}`),
    ...Array.from({ length: 8 }, (_, index) => `Rib${index + 1}`),
    ...Array.from({ length: 8 }, (_, index) => `AcrossEnd${index + 1}`),
    ...Array.from({ length: 8 }, (_, index) => `UpEnd${index + 1}`),
    ...Array.from({ length: 4 }, (_, index) => `FoldArcEnd${index + 1}`),
    ...Array.from({ length: 8 }, (_, index) => `I${index + 1}`),
    ...Array.from({ length: 8 }, (_, index) => `J${index + 1}`),
    "IsoC", "rotA", "rotB", "isoLayout", "isoScale", "isoHalfHeight", "isoShift",
    "isoSideX", "isoSideY", "isoVerticalExtent", "IsoLabelAnchor", "IsoMeasureAnchor",
    "FB1", "FB2", "FB3", "FB4", "FT1", "FT2", "FT3", "FT4",
    "SB1", "SB2", "SB3", "SB4", "ST1", "ST2", "ST3", "ST4",
  ];

  let api = null;
  let currentStep = 0;
  let currentProgress = 1;
  let animationToken = 0;
  let isPlaying = false;
  let rotationAlpha = 0;
  let rotationBeta = 30;
  let snapRotation = true;
  let projectionGuidesVisible = false;
  let paperGridVisible = true;
  let vertexLabelsVisible = false;
  let dragState = null;
  const solvedSteps = new Set();
  const selectedOptions = new Map();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Telefono (schermo stretto): il foglio 48 × 33 cm intero sarebbe largo 7 px per centimetro.
  //    Si mostra una metà del foglio alla volta, in un riquadro verticale (24 × 33 cm): due volte più grande.
  //    L'inquadratura segue il passo; l'alunno può cambiarla con i pulsanti sopra il foglio.
  const NARROW_QUERY = window.matchMedia("(max-width: 700px)");
  const NARROW = NARROW_QUERY.matches;
  NARROW_QUERY.addEventListener?.("change", () => window.location.reload());
  const TOUCH = window.matchMedia("(pointer: coarse)").matches;
  const SHEET_VIEWS = {
    centro: { label: "Solido", x: [-12, 12], y: [-16.5, 16.5] },
    sinistra: { label: "PV e PO", x: [-24, 0], y: [-16.5, 16.5] },
    destra: { label: "PL e solido", x: [0, 24], y: [-16.5, 16.5] },
    tutto: { label: "Foglio intero", x: [-24, 24], y: [-33, 33] },
  };
  const AUTO_VIEW = ["centro", "sinistra", "sinistra", "destra", "tutto"];
  let sheetView = NARROW ? "centro" : null;
  let viewStep = -1;

  const elements = {
    nav: document.getElementById("step-nav"),
    loading: document.getElementById("loading-state"),
    kicker: document.getElementById("step-kicker"),
    title: document.getElementById("step-title"),
    description: document.getElementById("step-description"),
    rule: document.getElementById("step-rule"),
    challengeTitle: document.getElementById("challenge-title"),
    challengeOptions: document.getElementById("challenge-options"),
    challengeFeedback: document.getElementById("challenge-feedback"),
    score: document.getElementById("score-badge"),
    first: document.getElementById("first-button"),
    previous: document.getElementById("previous-button"),
    play: document.getElementById("play-button"),
    next: document.getElementById("next-button"),
    last: document.getElementById("last-button"),
    counter: document.getElementById("step-counter"),
    speed: document.getElementById("animation-speed"),
    protocolToggle: document.getElementById("protocol-toggle-button"),
    protocolSteps: document.getElementById("protocol-steps"),
    checkPanel: document.getElementById("check-panel"),
    geometryCheck: document.getElementById("geometry-check"),
    reset: document.getElementById("reset-button"),
    download: document.getElementById("download-button"),
    rotateLeft: document.getElementById("rotate-left-button"),
    rotateRight: document.getElementById("rotate-right-button"),
    tiltDown: document.getElementById("tilt-down-button"),
    tiltUp: document.getElementById("tilt-up-button"),
    snap: document.getElementById("snap-button"),
    frontView: document.getElementById("front-view-button"),
    sideView: document.getElementById("side-view-button"),
    topView: document.getElementById("top-view-button"),
    paperGrid: document.getElementById("paper-grid-button"),
    vertexLabels: document.getElementById("vertex-labels-button"),
    projectionToolbar: document.getElementById("projection-toolbar"),
    projectors: document.getElementById("projectors-button"),
    zeroRotation: document.getElementById("zero-rotation-button"),
    rotationReadout: document.getElementById("rotation-readout"),
    rotationSurface: document.getElementById("rotation-surface"),
  };

  function buildNavigation() {
    STEPS.forEach((step, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "step-chip";
      button.disabled = true;
      button.dataset.step = String(index);
      button.innerHTML = `<span>${index}</span>${step.short}`;
      button.addEventListener("click", () => goToStep(index, true));
      elements.nav.appendChild(button);

      const item = document.createElement("li");
      item.textContent = `${step.title}: ${step.description}`;
      elements.protocolSteps.appendChild(item);
    });
  }

  function buildConstruction(ggbApi) {
    api = ggbApi;
    api.setPerspective("G");
    api.setAxesVisible(false, false);
    api.setGridVisible(false);
    if (NARROW) applySheetView(sheetView);
    else api.setCoordSystem(-24, 24, -16.5, 16.5);
    api.setErrorDialogsActive(false);

    const commands = [
      "tPlan=0",
      "tFront=0",
      "tSide=0",
      "tAcross=Min(1,3*tSide)",
      "tArc=Min(1,Max(0,3*tSide-1))",
      "tUp=Min(1,Max(0,3*tSide-2))",
      "profileShift=-0.3",
      "profileAxisX=1+profileShift",
      "SheetA=(-24,-16.5)",
      "SheetB=(24,-16.5)",
      "SheetC=(24,16.5)",
      "SheetD=(-24,16.5)",
      "FrameA=(-23,-15.5)",
      "FrameB=(23,-15.5)",
      "FrameC=(23,15.5)",
      "FrameD=(-23,15.5)",
      "sheetOuter=Polygon(SheetA,SheetB,SheetC,SheetD)",
      "sheetFrame=Polygon(FrameA,FrameB,FrameC,FrameD)",
      "sheetFormatLabel=Text(\"FOGLIO 48 × 33 cm · SQUADRATURA 1 cm\",(-22.5,14.7))",
      "sheetScaleLabel=Text(\"SCALA 1:1\",(18.2,14.7))",
      "paperMinorV=Sequence(Segment((k/10,-15.5),(k/10,15.5)),k,-230,230)",
      "paperMinorH=Sequence(Segment((-23,k/10),(23,k/10)),k,-155,155)",
      "paperHalfV=Sequence(Segment((k/2,-15.5),(k/2,15.5)),k,-46,46)",
      "paperHalfH=Sequence(Segment((-23,k/2),(23,k/2)),k,-31,31)",
      "paperCentimeterV=Sequence(Segment((k,-15.5),(k,15.5)),k,-23,23)",
      "paperCentimeterH=Sequence(Segment((-23,k),(23,k)),k,-15,15)",
      "titleblockRise=0.5",
      "sheetTitleblock=Polygon((9.5,-15.5+titleblockRise),(20.5,-15.5+titleblockRise),(20.5,-14+titleblockRise),(9.5,-14+titleblockRise))",
      "titleblockTitle=Text(\"TAV.02 · PRISMA OTTAGONALE\",(9.8,-14.95+titleblockRise))",
      "C=(-10,-7.5)",
      "R=4",
      "P1=(x(C)+R*cos(22.5°),y(C)+R*sin(22.5°))",
      "P2=Rotate(P1,45°,C)",
      "P3=Rotate(P2,45°,C)",
      "P4=Rotate(P3,45°,C)",
      "P5=Rotate(P4,45°,C)",
      "P6=Rotate(P5,45°,C)",
      "P7=Rotate(P6,45°,C)",
      "P8=Rotate(P7,45°,C)",
      ...PO_VERTEX_LABEL_SPECS.map(({ object, text, point, angle }) => `${object}=Text(\"${text}\",(x(${point})+0.58*cos(${angle}°),y(${point})+0.58*sin(${angle}°)))`),
      ...PV_VERTEX_LABEL_SPECS.map(({ object, text, point, labelY }) => `${object}=Text(\"${text}\",(x(${point})+0.06,${labelY}))`),
      ...PL_VERTEX_LABEL_SPECS.map(({ object, text, point, labelY }) => `${object}=Text(\"${text}\",(profileAxisX-y(${point})+0.06,${labelY}))`),
      "lineOfGround=Segment((-23,0),(23,0))",
      "groundLabel=Text(\"LT\",(-22.6,0.35))",
      "ProfileOrigin=(profileAxisX,0)",
      "ProfileBottom=(profileAxisX,-15.5)",
      "ProfileTop=(profileAxisX,15.5)",
      "profileReference=Segment(ProfileBottom,ProfileTop)",
      "profileReferenceLabel=Text(\"LP ⟂ LT\",(profileAxisX+0.2,0.35))",
      "LtDimA=(-16,0)",
      "LtDimB=(-16,1)",
      "ltOffsetDimension=Segment(LtDimA,LtDimB)",
      "ltOffsetTickA=Segment((-16.2,0),(-15.8,0))",
      "ltOffsetTickB=Segment((-16.2,1),(-15.8,1))",
      "ltOffsetLabel=Text(\"1 cm\",(-15.75,0.38))",
      "PlanArcEnd=Rotate(P1,0.01°+359.98°*tPlan,C)",
      "planArc=CircularArc(C,P1,PlanArcEnd)",
      ...PLAN_POINTS.map((point, index) => {
        const next = PLAN_POINTS[(index + 1) % PLAN_POINTS.length];
        return `PlanEnd${index + 1}=(x(${point})+tPlan*(x(${next})-x(${point})),y(${point})+tPlan*(y(${next})-y(${point})))`;
      }),
      ...PLAN_POINTS.map((point, index) => `drawPlan${index + 1}=Segment(${point},PlanEnd${index + 1})`),
      "polyPlan=Polygon(P1,P2,P3,P4,P5,P6,P7,P8)",
      "planRadiusSegment=Segment(C,P1)",
      "planLabel=Text(\"P.O. · PIANTA\",(-14.3,-13.1))",
      "radiusLabel=Text(\"R = 4 cm\",(-11.4,-6.85))",
      ...PLAN_POINTS.map((point, index) => `FrontGuideEnd${index + 1}=(x(${point}),y(${point})+tFront*(8-y(${point})))`),
      ...PLAN_POINTS.map((point, index) => `frontGuide${index + 1}=Segment(${point},FrontGuideEnd${index + 1})`),
      "FB1=(x(P4),1)",
      "FB2=(x(P3),1)",
      "FB3=(x(P2),1)",
      "FB4=(x(P1),1)",
      "FT1=(x(P4),8)",
      "FT2=(x(P3),8)",
      "FT3=(x(P2),8)",
      "FT4=(x(P1),8)",
      "frontBottom=Segment(FB1,FB4)",
      "frontTop=Segment(FT1,FT4)",
      "frontLeft=Segment(FB1,FT1)",
      "frontInnerLeft=Segment(FB2,FT2)",
      "frontInnerRight=Segment(FB3,FT3)",
      "frontRight=Segment(FB4,FT4)",
      "frontLabel=Text(\"P.V. · PROSPETTO\",(-14.3,10))",
      "heightLabelFront=Text(\"H = 7 cm\",(-5.6,4.5))",
      ...PLAN_POINTS.map((point, index) => `Q${index + 1}=(profileAxisX,y(${point}))`),
      ...PLAN_POINTS.map((point, index) => `Rib${index + 1}=(profileAxisX-y(${point}),0)`),
      ...PLAN_POINTS.map((point, index) => `AcrossEnd${index + 1}=(x(${point})+tAcross*(x(Q${index + 1})-x(${point})),y(${point}))`),
      ...PLAN_POINTS.map((point, index) => `sideAcross${index + 1}=Segment(${point},AcrossEnd${index + 1})`),
      ...FOLD_SOURCE_POINTS.map((point, index) => {
        const planIndex = PLAN_POINTS.indexOf(point) + 1;
        return `FoldArcEnd${index + 1}=Rotate(Q${planIndex},0.01°+89.98°*tArc,ProfileOrigin)`;
      }),
      ...FOLD_SOURCE_POINTS.map((point, index) => {
        const planIndex = PLAN_POINTS.indexOf(point) + 1;
        return `sideFoldArc${index + 1}=CircularArc(ProfileOrigin,Q${planIndex},FoldArcEnd${index + 1})`;
      }),
      ...PLAN_POINTS.map((point, index) => `UpEnd${index + 1}=(x(Rib${index + 1}),8*tUp)`),
      ...PLAN_POINTS.map((point, index) => `sideUp${index + 1}=Segment(Rib${index + 1},UpEnd${index + 1})`),
      "SB1=(profileAxisX-y(P3),1)",
      "SB2=(profileAxisX-y(P4),1)",
      "SB3=(profileAxisX-y(P5),1)",
      "SB4=(profileAxisX-y(P6),1)",
      "ST1=(profileAxisX-y(P3),8)",
      "ST2=(profileAxisX-y(P4),8)",
      "ST3=(profileAxisX-y(P5),8)",
      "ST4=(profileAxisX-y(P6),8)",
      "SideHeightBottomEnd=(x(FB4)+tUp*(x(SB4)-x(FB4)),1)",
      "SideHeightTopEnd=(x(FT4)+tUp*(x(ST4)-x(FT4)),8)",
      "sideHeightBottomGuide=Segment(FB4,SideHeightBottomEnd)",
      "sideHeightTopGuide=Segment(FT4,SideHeightTopEnd)",
      "sideBottom=Segment(SB1,SB4)",
      "sideTop=Segment(ST1,ST4)",
      "sideLeft=Segment(SB1,ST1)",
      "sideInnerLeft=Segment(SB2,ST2)",
      "sideInnerRight=Segment(SB3,ST3)",
      "sideRight=Segment(SB4,ST4)",
      "sideLabel=Text(\"P.L. · FIANCO\",(3.1,10))",
      "heightLabelSide=Text(\"H = 7 cm\",(12.2,4.5))",
      "rotA=0°",
      "rotB=30°",
      "isoLayout=0",
      "isoScale=1.5-0.75*isoLayout",
      "isoHalfHeight=3.5",
      "isoShift=9",
      "isoSideX=profileAxisX-y(C)+isoShift",
      "isoSideY=-8.2",
      "IsoC=(isoLayout*isoSideX,isoLayout*isoSideY)",
      ...Array.from({ length: 8 }, (_, index) => {
        const phi = 22.5 + index * 45;
        return `I${index + 1}=(x(IsoC)+isoScale*(R*cos(${phi}°+rotA)),y(IsoC)+isoScale*(sin(rotB)*R*sin(${phi}°+rotA)-cos(rotB)*isoHalfHeight))`;
      }),
      ...Array.from({ length: 8 }, (_, index) => {
        const phi = 22.5 + index * 45;
        return `J${index + 1}=(x(IsoC)+isoScale*(R*cos(${phi}°+rotA)),y(IsoC)+isoScale*(sin(rotB)*R*sin(${phi}°+rotA)+cos(rotB)*isoHalfHeight))`;
      }),
      "isoBase=Polygon(I1,I2,I3,I4,I5,I6,I7,I8)",
      "isoTop=Polygon(J1,J2,J3,J4,J5,J6,J7,J8)",
      ...Array.from({ length: 8 }, (_, index) => `isoBaseEdge${index + 1}=Segment(I${index + 1},I${(index + 1) % 8 + 1})`),
      ...Array.from({ length: 8 }, (_, index) => `isoTopEdge${index + 1}=Segment(J${index + 1},J${(index + 1) % 8 + 1})`),
      ...Array.from({ length: 8 }, (_, index) => `isoSide${index + 1}=Segment(I${index + 1},J${index + 1})`),
      "isoVerticalExtent=isoScale*(abs(sin(rotB))*R+abs(cos(rotB))*isoHalfHeight)",
      "IsoLabelAnchor=(x(IsoC)-4.3*isoScale,y(IsoC)+isoVerticalExtent+2)",
      "IsoMeasureAnchor=(x(IsoC)-4*isoScale,y(IsoC)-isoVerticalExtent-1.2)",
      "isoLabel=Text(\"ASSONOMETRIA 3D\",IsoLabelAnchor)",
      "isoMeasure=Text(\"R = 4 cm   ·   H = 7 cm\",IsoMeasureAnchor)",
      "frontHeight=Distance(FB1,FT1)",
      "sideHeight=Distance(SB1,ST1)",
      "radiusCheck=Distance(C,P1)",
      "heightDifference=abs(frontHeight-sideHeight)",
      "octagonDifference=abs(Distance(P1,P2)-Distance(P2,P3))",
      "transferDifference=abs(x(SB2)-(profileAxisX-y(P4)))",
      "ltOffsetCheck=Distance(LtDimA,LtDimB)",
      "profileShiftCheck=abs(profileShift+0.3)",
      "profilePerpendicularCheck=abs(Angle(profileReference,lineOfGround)-90°)",
      "profileAlignmentCheck=abs((x(SB1)+x(SB4))/2+isoShift-isoSideX)",
      "isoShiftCheck=abs(isoShift-9)",
      "heightProjectionDifference=abs(y(FB4)-y(SB4))+abs(y(FT4)-y(ST4))",
      "foldRadiusDifference=abs(Distance(ProfileOrigin,Q2)-Distance(ProfileOrigin,Rib2))",
      "foldAngleDifference=abs(Angle(Q2,ProfileOrigin,Rib2)-90°)",
      "sheetWidthCheck=Distance(SheetA,SheetB)",
      "sheetHeightCheck=Distance(SheetB,SheetC)",
      "squadraturaCheck=abs(x(FrameA)-x(SheetA)-1)+abs(y(FrameA)-y(SheetA)-1)",
      "titleblockRiseCheck=abs(titleblockRise-0.5)",
    ];

    const ok = api.evalCommand(commands.join("\n"));
    const expected = [
      "C", "P1", "P8", "polyPlan", "frontBottom", "frontTop", "frontLeft",
      "sideBottom", "sideTop", "sideLeft", "sideFoldArc1", "frontHeight",
      "sideHeight", "heightDifference", "octagonDifference", "transferDifference",
      "sheetOuter", "sheetFrame", "sheetTitleblock", "I1", "J1", "rotA", "rotB",
      "isoLabel", "isoMeasure", "IsoLabelAnchor", "IsoMeasureAnchor",
      "isoBaseEdge1", "isoBaseEdge8", "isoTopEdge1", "isoTopEdge8",
      "paperMinorV", "paperCentimeterH", "ltOffsetDimension", "ltOffsetCheck",
      "profileReference", "profileShiftCheck", "profilePerpendicularCheck", "profileAlignmentCheck",
      "sideHeightBottomGuide", "sideHeightTopGuide", "heightProjectionDifference",
      "foldRadiusDifference", "foldAngleDifference",
      "sheetWidthCheck", "sheetHeightCheck", "squadraturaCheck",
      ...VERTEX_LABELS,
    ];
    const missing = expected.filter((name) => !api.exists(name));
    if (!ok || missing.length > 0) {
      const detail = missing.length ? ` Oggetti mancanti: ${missing.join(", ")}.` : "";
      showError(`GeoGebra non è riuscito a creare la tavola.${detail}`);
      return;
    }

    styleConstruction();
    setControlsEnabled(true);
    elements.loading.hidden = true;
    setRotation(rotationAlpha, rotationBeta, false);
    applyStage(0, 1);
    validateGeometry();
  }

  function styleConstruction() {
    ["paperMinorV", "paperMinorH"].forEach((name) => styleLine(name, 244, 248, 250, 1, 0));
    ["paperHalfV", "paperHalfH"].forEach((name) => styleLine(name, 226, 236, 242, 1, 0));
    ["paperCentimeterV", "paperCentimeterH"].forEach((name) => styleLine(name, 196, 214, 224, 2, 0));
    PAPER_GRID.forEach((name) => api.setLayer(name, 1));
    styleLine("sheetOuter", 100, 116, 139, 2, 0);
    styleLine("sheetFrame", 15, 23, 42, 4, 0);
    ["sheetOuter", "sheetFrame"].forEach((name) => api.setFilling(name, 0));
    api.setLayer("sheetOuter", 0);
    api.setLayer("sheetFrame", 7);
    ["sheetFormatLabel", "sheetScaleLabel"].forEach((name) => {
      api.setColor(name, 71, 85, 105);
      api.setFixed(name, true, false);
      api.setLayer(name, 8);
    });
    styleLine("sheetTitleblock", 15, 23, 42, 3, 0);
    api.setFilling("sheetTitleblock", 0.92);
    api.setColor("sheetTitleblock", 255, 255, 255);
    api.setLayer("sheetTitleblock", 7);
    ["titleblockTitle"].forEach((name) => {
      api.setColor(name, 15, 23, 42);
      api.setFixed(name, true, false);
      api.setLayer(name, 9);
      if (typeof api.setFontSize === "function") api.setFontSize(name, 11);
    });
    BASE_GROUP.forEach((name) => styleLine(name, 15, 23, 42, 3, 0));
    styleLine("profileReference", 0, 0, 0, 3, 0);
    ["ltOffsetDimension", "ltOffsetTickA", "ltOffsetTickB"].forEach((name) => styleLine(name, 217, 119, 6, 2, 0));
    api.setColor("ltOffsetLabel", 180, 83, 9);
    api.setFixed("ltOffsetLabel", true, false);
    PLAN_TRACES.forEach((name) => styleLine(name, name === "planArc" ? 217 : 29, name === "planArc" ? 119 : 78, name === "planArc" ? 6 : 216, 4, 0));
    FRONT_GUIDES.forEach((name) => styleLine(name, 148, 163, 177, 2, 0));
    SIDE_HEIGHT_GUIDES.forEach((name) => {
      styleLine(name, 125, 139, 153, 3, 0);
      api.setLayer(name, 6);
    });
    SIDE_TRANSFER.filter((name) => !SIDE_FOLD_ARCS.includes(name)).forEach((name) => styleLine(name, 148, 163, 177, 2, 0));
    SIDE_FOLD_ARCS.forEach((name) => {
      styleLine(name, 217, 119, 6, 3, 0);
      api.setLayer(name, 6);
    });
    [...FRONT_FINAL, ...SIDE_FINAL].forEach((name) => styleLine(name, 15, 23, 42, 5, 0));
    ["polyPlan", "planRadiusSegment"].forEach((name) => styleLine(name, 15, 23, 42, 5, 0));
    api.setFilling("polyPlan", 0.08);
    api.setColor("polyPlan", 29, 78, 216);
    api.setColor("planRadiusSegment", 217, 119, 6);
    api.setLineThickness("planRadiusSegment", 3);
    styleFinalEdges(false);

    ["isoBase", "isoTop"].forEach((name) => {
      api.setColor(name, 192, 68, 26);
      api.setFilling(name, name === "isoTop" ? 0.24 : 0.12);
      api.setLineThickness(name, 0);
    });
    styleIsoHiddenEdges();

    const textObjects = ["groundLabel", "profileReferenceLabel", "planLabel", "radiusLabel", "frontLabel", "heightLabelFront", "sideLabel", "heightLabelSide", "isoLabel", "isoMeasure"];
    textObjects.forEach((name) => {
      if (!api.exists(name)) return;
      api.setColor(name, 30, 58, 95);
      api.setFixed(name, true, false);
    });
    api.setColor("profileReferenceLabel", 0, 0, 0);
    VERTEX_LABELS_PO.forEach((name) => api.setColor(name, 29, 78, 216));
    VERTEX_LABELS_PV.forEach((name) => api.setColor(name, 180, 83, 9));
    VERTEX_LABELS_PL.forEach((name) => api.setColor(name, 14, 116, 144));
    VERTEX_LABELS.forEach((name) => {
      api.setFixed(name, true, false);
      if (typeof api.setFontSize === "function") api.setFontSize(name, 6);
      setVisible(name, false);
    });

    PLAN_POINTS.forEach((name) => {
      api.setPointSize(name, 4);
      api.setColor(name, 29, 78, 216);
      api.setLabelVisible(name, false);
      api.setFixed(name, true, false);
    });
    TECHNICAL_HELPERS.forEach((name) => setVisible(name, false));
    api.getAllObjectNames().forEach((name) => {
      if (api.getObjectType(name) === "point" && !PLAN_POINTS.includes(name)) setVisible(name, false);
    });

    const allVisibleObjects = [...SHEET_GROUP, ...TITLEBLOCK_GROUP, ...PAPER_GRID, ...BASE_GROUP, ...PROFILE_REFERENCE, ...LT_OFFSET, ...ISO_GROUP, ...PLAN_TRACES, ...PLAN_FINAL, ...FRONT_GUIDES, ...FRONT_FINAL, ...SIDE_TRANSFER, ...SIDE_HEIGHT_GUIDES, ...SIDE_FINAL];
    allVisibleObjects.forEach((name) => {
      if (api.exists(name)) api.setFixed(name, true, false);
    });
  }

  function styleLine(name, red, green, blue, thickness, style) {
    if (!api.exists(name)) return;
    api.setColor(name, red, green, blue);
    api.setLineThickness(name, thickness);
    api.setLineStyle(name, style);
  }

  function styleFinalEdges(isVerification) {
    const color = isVerification ? [0, 0, 0] : [15, 23, 42];
    const thickness = isVerification ? 8 : 5;
    [...FRONT_EDGES, ...SIDE_EDGES].forEach((name) => styleLine(name, ...color, thickness, 0));
    styleLine("polyPlan", ...(isVerification ? [0, 0, 0] : [29, 78, 216]), thickness, 0);
    api.setFilling("polyPlan", isVerification ? 0.02 : 0.08);
  }

  function styleIsoHiddenEdges() {
    const betaRadians = rotationBeta * Math.PI / 180;
    const visibilityTolerance = 0.01;
    const styleEdge = (name, hidden) => {
      styleLine(name, ...(hidden ? [112, 99, 92, 3, 2] : [60, 38, 28, 4, 0]));
    };
    const sideFaceIsVisible = (faceIndex) => {
      const midpointAngle = (45 + faceIndex * 45 + rotationAlpha) * Math.PI / 180;
      const faceDepth = Math.sin(midpointAngle) * Math.cos(betaRadians);
      return faceDepth <= visibilityTolerance;
    };
    const topFaceIsVisible = Math.sin(betaRadians) > visibilityTolerance;
    const bottomFaceIsVisible = Math.sin(betaRadians) < -visibilityTolerance;

    ISO_SIDE_EDGES.forEach((name, index) => {
      const previousFace = (index + 7) % 8;
      const hidden = !sideFaceIsVisible(previousFace) && !sideFaceIsVisible(index);
      styleEdge(name, hidden);
    });

    ISO_BASE_EDGES.forEach((name, index) => {
      const hidden = !bottomFaceIsVisible && !sideFaceIsVisible(index);
      styleEdge(name, hidden);
    });

    ISO_TOP_EDGES.forEach((name, index) => {
      const hidden = !topFaceIsVisible && !sideFaceIsVisible(index);
      styleEdge(name, hidden);
    });
  }

  // Zona del solido sul foglio (cm): al centro e grande nel passo 0, nel quadrante in basso a destra dal passo 1.
  function solidZone(p) {
    return { x0: -12 + 24 * p, x1: 12 + 12 * p, y0: -16.5, y1: 16.5 - 16.5 * p };
  }

  function currentFrame() {
    if (!NARROW) return { x: [-24, 24], y: [-16.5, 16.5] };
    return SHEET_VIEWS[sheetView];
  }

  function placeRotationSurface(visible, p) {
    const frame = currentFrame();
    const zone = solidZone(p);
    const w = frame.x[1] - frame.x[0];
    const h = frame.y[1] - frame.y[0];
    const left = Math.max(zone.x0, frame.x[0]);
    const right = Math.min(zone.x1, frame.x[1]);
    const bottom = Math.max(zone.y0, frame.y[0]);
    const top = Math.min(zone.y1, frame.y[1]);
    const inView = right - left > 1 && top - bottom > 1;
    const surface = elements.rotationSurface;
    surface.hidden = !visible || !inView;
    surface.classList.toggle("is-small", p > 0.5);
    if (!inView) return;
    surface.style.left = `${((left - frame.x[0]) / w) * 100}%`;
    surface.style.width = `${((right - left) / w) * 100}%`;
    surface.style.bottom = `${((bottom - frame.y[0]) / h) * 100}%`;
    surface.style.height = `${((top - bottom) / h) * 100}%`;
  }

  function applySheetView(name) {
    if (!NARROW) return;
    sheetView = name;
    const view = SHEET_VIEWS[name];
    if (api) api.setCoordSystem(view.x[0], view.x[1], view.y[0], view.y[1]);
    document.querySelectorAll(".view-switch button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.view === name));
    });
  }

  function buildViewSwitch() {
    if (!NARROW) return;
    const frame = document.querySelector(".ggb-frame");
    const bar = document.createElement("div");
    bar.className = "view-switch";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Parte del foglio da guardare");
    Object.entries(SHEET_VIEWS).forEach(([name, view]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tool-button";
      button.dataset.view = name;
      button.textContent = view.label;
      button.setAttribute("aria-pressed", String(name === sheetView));
      button.addEventListener("click", () => {
        applySheetView(name);
        applyStage(currentStep, currentProgress);
      });
      bar.appendChild(button);
    });
    frame.parentNode.insertBefore(bar, frame);
  }

  function setVisible(name, value) {
    if (api && api.exists(name)) api.setVisible(name, value);
  }

  function setGroupVisibility(group, value) {
    group.forEach((name) => setVisible(name, value));
  }

  function applyStage(step, progress) {
    if (!api) return;
    currentStep = step;
    currentProgress = Math.max(0, Math.min(1, progress));

    api.setRepaintingActive(false);
    api.setValue("tPlan", step > 1 ? 1 : step === 1 ? currentProgress : 0);
    api.setValue("tFront", step > 2 ? 1 : step === 2 ? currentProgress : 0);
    api.setValue("tSide", step > 3 ? 1 : step === 3 ? currentProgress : 0);
    const isoLayoutProgress = step === 0 ? 0 : step === 1 ? currentProgress : 1;
    api.setValue("isoLayout", isoLayoutProgress);

    const solidVisible = true;
    const planFinalVisible = step > 1 || (step === 1 && currentProgress >= 0.98);
    const frontFinalVisible = step > 2 || (step === 2 && currentProgress >= 0.92);
    const sideFinalVisible = step > 3 || (step === 3 && currentProgress >= 0.96);

    setGroupVisibility(PAPER_GRID, paperGridVisible);
    setGroupVisibility(SHEET_GROUP, true);
    setGroupVisibility(TITLEBLOCK_GROUP, true);
    setGroupVisibility(ISO_GROUP, solidVisible);
    setGroupVisibility(BASE_GROUP, step >= 1);
    setGroupVisibility(PROFILE_REFERENCE, step >= 1);
    setGroupVisibility(LT_OFFSET, step >= 2);
    setGroupVisibility(PLAN_POINTS, step === 1 && currentProgress < 0.98);
    setGroupVisibility(PLAN_TRACES, step === 1);
    setGroupVisibility(PLAN_FINAL, planFinalVisible);
    setGroupVisibility(VERTEX_LABELS_PO, vertexLabelsVisible && step >= 1);
    setGroupVisibility(FRONT_GUIDES, step === 2 || (projectionGuidesVisible && step >= 3));
    setGroupVisibility(FRONT_FINAL, frontFinalVisible);
    setGroupVisibility(VERTEX_LABELS_PV, vertexLabelsVisible && step >= 2);
    setGroupVisibility(SIDE_TRANSFER, step === 3 || (projectionGuidesVisible && step >= 4));
    setGroupVisibility(SIDE_HEIGHT_GUIDES, step === 3 || (projectionGuidesVisible && step >= 4));
    setGroupVisibility(SIDE_FINAL, sideFinalVisible);
    setGroupVisibility(VERTEX_LABELS_PL, vertexLabelsVisible && step >= 3);
    styleFinalEdges(step === 4);
    if (NARROW && step !== viewStep) {
      viewStep = step;
      applySheetView(AUTO_VIEW[step] || "tutto");
    }
    placeRotationSurface(solidVisible, isoLayoutProgress);

    TECHNICAL_HELPERS.forEach((name) => setVisible(name, false));
    api.setRepaintingActive(true);
    api.refreshViews();
    updateInterface();
  }

  function updateInterface() {
    const step = STEPS[currentStep];
    elements.kicker.textContent = step.kicker;
    elements.title.textContent = step.title;
    elements.description.textContent = step.description;
    elements.rule.textContent = step.rule;
    elements.counter.textContent = `${currentStep + 1} / ${STEPS.length}`;
    elements.checkPanel.hidden = currentStep !== STEPS.length - 1;

    Array.from(elements.nav.children).forEach((button, index) => {
      button.classList.toggle("is-active", index === currentStep);
      button.classList.toggle("is-complete", index < currentStep || solvedSteps.has(index));
      if (index === currentStep) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    Array.from(elements.protocolSteps.children).forEach((item, index) => item.classList.toggle("is-current", index === currentStep));

    elements.first.disabled = currentStep === 0;
    elements.previous.disabled = currentStep === 0;
    elements.next.disabled = currentStep === STEPS.length - 1;
    elements.last.disabled = currentStep === STEPS.length - 1;
    const solidControlsEnabled = true;
    [
      elements.rotateLeft, elements.rotateRight, elements.tiltDown, elements.tiltUp,
      elements.snap, elements.frontView, elements.sideView, elements.topView,
      elements.zeroRotation,
    ].forEach((button) => { button.disabled = !solidControlsEnabled; });
    elements.vertexLabels.disabled = currentStep < 1;
    elements.projectionToolbar.hidden = currentStep < 3;
    elements.projectors.disabled = currentStep < 3;
    renderChallenge();
  }

  function renderChallenge() {
    const step = STEPS[currentStep];
    const selected = selectedOptions.get(currentStep);
    const solved = solvedSteps.has(currentStep);
    elements.challengeTitle.textContent = step.question;
    elements.challengeOptions.innerHTML = "";
    elements.challengeFeedback.textContent = "Scegli una risposta: puoi riprovare se sbagli.";
    elements.challengeFeedback.className = "challenge__feedback";

    step.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "challenge-option";
      button.textContent = option;
      button.disabled = solved;
      if (selected === index) button.classList.add(index === step.correct ? "is-correct" : "is-wrong");
      if (solved && index === step.correct) button.classList.add("is-correct");
      button.addEventListener("click", () => answerChallenge(index));
      elements.challengeOptions.appendChild(button);
    });

    if (selected !== undefined) {
      const correct = selected === step.correct;
      elements.challengeFeedback.textContent = correct ? step.success : step.wrong;
      elements.challengeFeedback.classList.add(correct ? "is-correct" : "is-wrong");
    }
  }

  function answerChallenge(optionIndex) {
    const step = STEPS[currentStep];
    selectedOptions.set(currentStep, optionIndex);
    if (optionIndex === step.correct) solvedSteps.add(currentStep);
    elements.score.textContent = `${solvedSteps.size} / ${STEPS.length} sfide`;
    renderChallenge();
    updateNavigationCompletion();
  }

  function updateNavigationCompletion() {
    Array.from(elements.nav.children).forEach((button, index) => {
      button.classList.toggle("is-complete", index < currentStep || solvedSteps.has(index));
    });
  }

  function getAnimationDuration() {
    const seconds = Number(elements.speed.value);
    return Number.isFinite(seconds) ? Math.min(4, Math.max(0.5, seconds)) * 1000 : 2500;
  }

  function animateStep(step, token) {
    if (reduceMotion || step === 0 || step === 4) {
      applyStage(step, 1);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const start = performance.now();
      const duration = getAnimationDuration();
      function frame(now) {
        if (token !== animationToken) return resolve();
        const linear = Math.min(1, (now - start) / duration);
        applyStage(step, 1 - Math.pow(1 - linear, 3));
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
    applyStage(0, 1);
    for (let step = 1; step < STEPS.length; step += 1) {
      if (token !== animationToken) return;
      await animateStep(step, token);
    }
    if (token === animationToken) setPlaying(false);
  }

  function setPlaying(value) {
    isPlaying = value;
    const icon = elements.play.querySelector(".play-icon");
    const label = elements.play.querySelector(".play-label");
    if (icon) icon.textContent = value ? "■" : "▶";
    if (label) label.textContent = value ? "Ferma" : "Avvia";
    elements.play.setAttribute("aria-pressed", String(value));
  }

  function normalizeAngle(value) {
    const normalized = value % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  }

  function setRotation(alpha, beta, applySnap) {
    rotationAlpha = normalizeAngle(applySnap ? Math.round(alpha / 15) * 15 : alpha);
    rotationBeta = normalizeAngle(applySnap ? Math.round(beta / 15) * 15 : beta);
    if (api) {
      api.setValue("rotA", rotationAlpha * Math.PI / 180);
      api.setValue("rotB", rotationBeta * Math.PI / 180);
      styleIsoHiddenEdges();
      api.refreshViews();
    }
    elements.rotationReadout.textContent = `ROTAZIONE α ${Math.round(rotationAlpha)}° · β ${Math.round(rotationBeta)}°`;
    updateOrthogonalViewButtons();
  }

  function adjustRotation(delta) {
    setRotation(rotationAlpha + delta, rotationBeta, snapRotation);
  }

  function adjustTilt(delta) {
    setRotation(rotationAlpha, rotationBeta + delta, snapRotation);
  }

  function isAngleNear(value, target) {
    const difference = Math.abs(normalizeAngle(value) - normalizeAngle(target));
    return Math.min(difference, 360 - difference) < 0.5;
  }

  function updateOrthogonalViewButtons() {
    elements.frontView.setAttribute("aria-pressed", String(isAngleNear(rotationAlpha, 0) && isAngleNear(rotationBeta, 0)));
    elements.sideView.setAttribute("aria-pressed", String(isAngleNear(rotationAlpha, 90) && isAngleNear(rotationBeta, 0)));
    elements.topView.setAttribute("aria-pressed", String(isAngleNear(rotationBeta, 90)));
  }

  function setOrthogonalView(view) {
    const presets = {
      front: [0, 0],
      side: [90, 0],
      top: [0, 90],
    };
    const [alpha, beta] = presets[view];
    setRotation(alpha, beta, false);
  }

  function toggleSnap() {
    snapRotation = !snapRotation;
    elements.snap.setAttribute("aria-pressed", String(snapRotation));
    elements.snap.textContent = snapRotation ? "Aggancio 15°" : "Rotazione libera";
    if (snapRotation) setRotation(rotationAlpha, rotationBeta, true);
  }

  function toggleProjectionGuides() {
    projectionGuidesVisible = !projectionGuidesVisible;
    elements.projectors.setAttribute("aria-pressed", String(projectionGuidesVisible));
    elements.projectors.textContent = projectionGuidesVisible
      ? "Nascondi proiettanti PO–PV–PL"
      : "Mostra tutte le proiettanti PO–PV–PL";
    applyStage(currentStep, currentProgress);
  }

  function togglePaperGrid() {
    paperGridVisible = !paperGridVisible;
    elements.paperGrid.setAttribute("aria-pressed", String(paperGridVisible));
    elements.paperGrid.textContent = paperGridVisible
      ? "Nascondi carta millimetrata"
      : "Mostra carta millimetrata";
    applyStage(currentStep, currentProgress);
  }

  function toggleVertexLabels() {
    vertexLabelsVisible = !vertexLabelsVisible;
    elements.vertexLabels.setAttribute("aria-pressed", String(vertexLabelsVisible));
    elements.vertexLabels.textContent = vertexLabelsVisible
      ? "Nascondi lettere A–P"
      : "Mostra lettere A–P";
    elements.vertexLabels.setAttribute(
      "aria-label",
      vertexLabelsVisible
        ? "Nascondi le lettere dei vertici sui piani PO, PV e PL"
        : "Mostra le lettere dei vertici sui piani PO, PV e PL",
    );
    applyStage(currentStep, currentProgress);
  }

  function startRotationDrag(event) {
    if (!api) return;
    event.preventDefault();
    elements.rotationSurface.setPointerCapture?.(event.pointerId);
    dragState = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      alpha: rotationAlpha,
      beta: rotationBeta,
    };
    elements.rotationSurface.classList.add("is-dragging");
  }

  function moveRotationDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    event.preventDefault();
    setRotation(
      dragState.alpha + (event.clientX - dragState.x) * 0.45,
      dragState.beta - (event.clientY - dragState.y) * 0.25,
      false,
    );
  }

  function endRotationDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    elements.rotationSurface.releasePointerCapture?.(event.pointerId);
    dragState = null;
    elements.rotationSurface.classList.remove("is-dragging");
    if (snapRotation) setRotation(rotationAlpha, rotationBeta, true);
  }

  function handleRotationKeys(event) {
    const actions = {
      ArrowLeft: () => adjustRotation(-15),
      ArrowRight: () => adjustRotation(15),
      ArrowUp: () => adjustTilt(15),
      ArrowDown: () => adjustTilt(-15),
    };
    if (!actions[event.key]) return;
    event.preventDefault();
    actions[event.key]();
  }

  function setControlsEnabled(enabled) {
    Array.from(elements.nav.children).forEach((button) => { button.disabled = !enabled; });
    [
      elements.play, elements.reset, elements.download, elements.protocolToggle,
      elements.rotateLeft, elements.rotateRight, elements.tiltDown, elements.tiltUp,
      elements.snap, elements.frontView, elements.sideView, elements.topView,
      elements.projectors, elements.paperGrid, elements.vertexLabels, elements.zeroRotation,
    ].forEach((button) => { button.disabled = !enabled; });
    if (enabled) updateInterface();
  }

  function toggleProtocol() {
    const willOpen = elements.protocolSteps.hidden;
    elements.protocolSteps.hidden = !willOpen;
    elements.protocolToggle.setAttribute("aria-expanded", String(willOpen));
  }

  function validateGeometry() {
    if (!api) return;
    const checks = {
      radius: Math.abs(api.getValue("radiusCheck") - 4),
      height: Math.abs(api.getValue("frontHeight") - 7),
      sharedHeight: api.getValue("heightDifference"),
      lineOfGroundOffset: Math.abs(api.getValue("ltOffsetCheck") - 1),
      profileShift: api.getValue("profileShiftCheck"),
      profilePerpendicular: api.getValue("profilePerpendicularCheck"),
      profileAndSolidAlignment: api.getValue("profileAlignmentCheck"),
      isometricShift: api.getValue("isoShiftCheck"),
      projectedHeights: api.getValue("heightProjectionDifference"),
      octagon: api.getValue("octagonDifference"),
      transfer: api.getValue("transferDifference"),
      foldRadius: api.getValue("foldRadiusDifference"),
      foldAngle: api.getValue("foldAngleDifference"),
      sheetWidth: Math.abs(api.getValue("sheetWidthCheck") - 48),
      sheetHeight: Math.abs(api.getValue("sheetHeightCheck") - 33),
      squadratura: api.getValue("squadraturaCheck"),
      titleblockRise: api.getValue("titleblockRiseCheck"),
    };
    const valid = Object.values(checks).every((value) => Number.isFinite(value) && value < 1e-6);
    elements.geometryCheck.textContent = valid ? "✓ Geometria verificata" : "⚠ Controlla la costruzione";
    elements.geometryCheck.style.color = valid ? "#065f46" : "#991b1b";
    if (!valid) console.error("Verifica geometrica non superata", checks);
  }

  function downloadGgb() {
    if (!api) return;
    api.getBase64((base64) => {
      const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/vnd.geogebra.file" });
      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement("a"), { href: url, download: `${SLUG}.ggb` });
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  function showError(message) {
    elements.loading.classList.add("is-error");
    elements.loading.textContent = message;
  }

  function init() {
    buildNavigation();
    elements.first.addEventListener("click", () => goToStep(0, false));
    elements.previous.addEventListener("click", () => goToStep(currentStep - 1, false));
    elements.play.addEventListener("click", playAll);
    elements.next.addEventListener("click", () => goToStep(currentStep + 1, true));
    elements.last.addEventListener("click", () => goToStep(STEPS.length - 1, false));
    elements.reset.addEventListener("click", () => {
      solvedSteps.clear();
      selectedOptions.clear();
      projectionGuidesVisible = false;
      paperGridVisible = true;
      vertexLabelsVisible = false;
      snapRotation = true;
      elements.projectors.setAttribute("aria-pressed", "false");
      elements.projectors.textContent = "Mostra tutte le proiettanti PO–PV–PL";
      elements.paperGrid.setAttribute("aria-pressed", "true");
      elements.paperGrid.textContent = "Nascondi carta millimetrata";
      elements.vertexLabels.setAttribute("aria-pressed", "false");
      elements.vertexLabels.textContent = "Mostra lettere A–P";
      elements.vertexLabels.setAttribute("aria-label", "Mostra le lettere dei vertici sui piani PO, PV e PL");
      elements.snap.setAttribute("aria-pressed", "true");
      elements.snap.textContent = "Aggancio 15°";
      elements.score.textContent = `0 / ${STEPS.length} sfide`;
      setRotation(0, 30, false);
      goToStep(0, false);
    });
    elements.download.addEventListener("click", downloadGgb);
    elements.protocolToggle.addEventListener("click", toggleProtocol);
    elements.rotateLeft.addEventListener("click", () => adjustRotation(-15));
    elements.rotateRight.addEventListener("click", () => adjustRotation(15));
    elements.tiltDown.addEventListener("click", () => adjustTilt(-15));
    elements.tiltUp.addEventListener("click", () => adjustTilt(15));
    elements.snap.addEventListener("click", toggleSnap);
    elements.frontView.addEventListener("click", () => setOrthogonalView("front"));
    elements.sideView.addEventListener("click", () => setOrthogonalView("side"));
    elements.topView.addEventListener("click", () => setOrthogonalView("top"));
    elements.projectors.addEventListener("click", toggleProjectionGuides);
    elements.paperGrid.addEventListener("click", togglePaperGrid);
    elements.vertexLabels.addEventListener("click", toggleVertexLabels);
    elements.zeroRotation.addEventListener("click", () => setRotation(0, 30, false));
    elements.rotationSurface.addEventListener("pointerdown", startRotationDrag);
    elements.rotationSurface.addEventListener("pointermove", moveRotationDrag);
    elements.rotationSurface.addEventListener("pointerup", endRotationDrag);
    elements.rotationSurface.addEventListener("pointercancel", endRotationDrag);
    elements.rotationSurface.addEventListener("keydown", handleRotationKeys);
    window.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "f" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName ?? "")) toggleFullscreen();
    });

    window.render_game_to_text = () => JSON.stringify({
      coordinateSystem: "Foglio 48 × 33 cm; asse x verso destra, asse y verso l’alto. LT coincide con y=0.",
      mode: isPlaying ? "playing" : "paused",
      step: currentStep,
      stepTitle: STEPS[currentStep].title,
      progress: Number(currentProgress.toFixed(3)),
      visibleViews: {
        solid: true,
        plan: currentStep > 1 || (currentStep === 1 && currentProgress >= 0.98),
        elevation: currentStep > 2 || (currentStep === 2 && currentProgress >= 0.92),
        side: currentStep > 3 || (currentStep === 3 && currentProgress >= 0.96),
      },
      solidRotation: {
        alphaDegrees: Number(rotationAlpha.toFixed(1)),
        betaDegrees: Number(rotationBeta.toFixed(1)),
        snap15Degrees: snapRotation,
      },
      solidLayout: {
        transitionProgress: currentStep === 0 ? 0 : currentStep === 1 ? Number(currentProgress.toFixed(3)) : 1,
        initialPosition: "centro del foglio, scala 1.50",
        workingPosition: "quadrante destro, scala 0.75",
      },
      projectionGuidesVisible,
      projectorsVisible: projectionGuidesVisible,
      paperGridVisible,
      vertexLabelsVisible,
      profileLayout: {
        verticalReferenceX: 0.7,
        lateralAndSolidShiftCm: -0.3,
        lateralAndSolidShiftMm: -3,
      },
      sheet: { widthCm: 48, heightCm: 33, squadraturaCm: 1, scale: "1:1" },
      challenge: {
        question: STEPS[currentStep].question,
        selectedOption: selectedOptions.get(currentStep) ?? null,
        solved: solvedSteps.has(currentStep),
      },
      score: solvedSteps.size,
      totalChallenges: STEPS.length,
    });
    window.advanceTime = (milliseconds) => {
      const duration = getAnimationDuration();
      applyStage(currentStep, Math.min(1, currentProgress + Math.max(0, milliseconds) / duration));
    };

    if (typeof GGBApplet === "undefined") {
      showError("GeoGebra non è disponibile. Controlla la connessione a Internet e ricarica la pagina.");
      return;
    }

    buildViewSwitch();
    if (TOUCH) {
      const hint = elements.rotationSurface.querySelector("span");
      if (hint) hint.textContent = "Trascina con il dito per ruotare";
      elements.rotationSurface.setAttribute("aria-label", "Solido tridimensionale interattivo: trascina con il dito per ruotare");
    }

    const applet = new GGBApplet({
      id: `${SLUG.replace(/-/g, "_")}_applet`,
      appName: "geometry",
      // Sul telefono il riquadro è verticale (24 × 33 cm): metà foglio alla volta, vedi SHEET_VIEWS.
      width: NARROW ? 720 : 1152,
      height: NARROW ? 990 : 792,
      appletOnLoad: buildConstruction,
      showToolBar: false,
      showMenuBar: false,
      showAlgebraInput: false,
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
