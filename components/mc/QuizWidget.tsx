"use client";

import { useState, useEffect } from "react";

interface QuizOption {
  id: string;
  testo: string;
  feedback_errato?: string;
}

interface QuizDomanda {
  id: string;
  domanda: string;
  opzioni: QuizOption[];
  risposta_corretta: string;
  livello: "F" | "I" | "A";
  spiegazione?: string;
}

interface QuizData {
  mc_id: string;
  domande: QuizDomanda[];
}

// Struttura quiz reali (da content-loader getMCQuizData)
interface RealQuizOption {
  id: string;
  testo: string;
  corretto?: boolean;
  feedback?: string;
}
interface RealQuizQuestion {
  livello: "F" | "I" | "A";
  domanda: string;
  opzioni: RealQuizOption[];
  spiegazione?: string;
}

interface QuizWidgetProps {
  mcId: string;
  livello: "F" | "I" | "A";
  quizData?: RealQuizQuestion[]; // quiz reali validati — se assenti usa demo
}

const LEVEL_LABELS: Record<string, string> = {
  F: "Base",
  I: "Intermedio",
  A: "Avanzato",
};

const LEVEL_COLORS: Record<string, string> = {
  F: "bg-green-100 text-green-800 border-green-200",
  I: "bg-blue-100 text-blue-800 border-blue-200",
  A: "bg-purple-100 text-purple-800 border-purple-200",
};

// Demo quiz data — in production this is loaded from 04_CONTENUTI/quiz/
function buildDemoQuiz(mcId: string, livello: "F" | "I" | "A"): QuizData {
  const byLevel: Record<"F" | "I" | "A", QuizDomanda[]> = {
    F: [
      {
        id: "q1",
        domanda: `Quale delle seguenti è la descrizione più corretta per la competenza "${mcId}"?`,
        opzioni: [
          { id: "a", testo: "Saper riconoscere e denominare il concetto principale" },
          { id: "b", testo: "Saper ignorare il contesto" },
          { id: "c", testo: "Saper applicare formule senza capirle", feedback_errato: "Applicare senza capire non è una competenza reale." },
          { id: "d", testo: "Nessuna delle precedenti", feedback_errato: "Rileggi la scheda della competenza." },
        ],
        risposta_corretta: "a",
        livello: "F",
        spiegazione: "Il primo passo è sempre riconoscere e saper nominare correttamente un concetto.",
      },
      {
        id: "q2",
        domanda: "In quale momento della giornata usi di più le tecnologie digitali?",
        opzioni: [
          { id: "a", testo: "Al mattino a scuola" },
          { id: "b", testo: "Nel pomeriggio a casa" },
          { id: "c", testo: "Sempre, continuamente" },
          { id: "d", testo: "Mai, non le uso", feedback_errato: "Se stai usando questa app, stai già usando tecnologia digitale!" },
        ],
        risposta_corretta: "b",
        livello: "F",
        spiegazione: "Non esiste una risposta 'sbagliata' qui — l'importante è essere consapevoli del proprio uso.",
      },
    ],
    I: [
      {
        id: "q3",
        domanda: "Quale strategia applicheresti per risolvere un problema legato a questa competenza?",
        opzioni: [
          { id: "a", testo: "Cerco la soluzione online senza valutarla", feedback_errato: "Le fonti online vanno sempre valutate criticamente." },
          { id: "b", testo: "Applico i passaggi appresi e verifico il risultato" },
          { id: "c", testo: "Chiedo sempre all'insegnante prima di provare", feedback_errato: "L'autonomia è parte della competenza intermedia." },
          { id: "d", testo: "Ignoro il problema se è difficile", feedback_errato: "Affrontare la difficoltà è fondamentale per crescere." },
        ],
        risposta_corretta: "b",
        livello: "I",
        spiegazione: "A livello intermedio sai applicare procedimenti e verificare autonomamente i risultati.",
      },
    ],
    A: [
      {
        id: "q4",
        domanda: "Come adatteresti questa competenza a una situazione completamente nuova e complessa?",
        opzioni: [
          { id: "a", testo: "Seguirei esattamente i passaggi già noti", feedback_errato: "Le situazioni nuove richiedono adattamento, non sola ripetizione." },
          { id: "b", testo: "Rifiuterei di affrontarla perché è troppo difficile", feedback_errato: "Il livello avanzato include la capacità di affrontare l'incertezza." },
          { id: "c", testo: "Analizzi il contesto, trasferisci principi noti, valuti l'impatto" },
          { id: "d", testo: "Chiederei a un esperto di fare tutto al posto mio", feedback_errato: "L'autonomia esperta include sapere quando collaborare, non delegare tutto." },
        ],
        risposta_corretta: "c",
        livello: "A",
        spiegazione: "A livello avanzato sai trasferire competenze tra contesti, analizzare l'impatto e gestire l'incertezza.",
      },
    ],
  };

  return {
    mc_id: mcId,
    domande: byLevel[livello],
  };
}

export default function QuizWidget({ mcId, livello, quizData }: QuizWidgetProps) {
  const [selectedLevel, setSelectedLevel] = useState<"F" | "I" | "A">(livello);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const isReal = !!quizData && quizData.length > 0;

  useEffect(() => {
    // Usa quiz reali validati se disponibili, altrimenti demo
    let data: QuizData;
    if (isReal) {
      // Converte il formato RealQuizQuestion → QuizDomanda interno
      const domande: QuizDomanda[] = quizData!
        .filter((q) => q.livello === selectedLevel)
        .map((q, i) => ({
          id: `q${i}`,
          domanda: q.domanda,
          livello: q.livello,
          spiegazione: q.spiegazione,
          risposta_corretta: q.opzioni.find((o) => o.corretto)?.id ?? "a",
          opzioni: q.opzioni.map((o) => ({
            id: o.id,
            testo: o.testo,
            feedback_errato: o.corretto ? undefined : o.feedback,
          })),
        }));
      data = { mc_id: mcId, domande };
    } else {
      data = buildDemoQuiz(mcId, selectedLevel);
    }
    setQuiz(data);
    setCurrentQ(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
    setAnswers({});
  }, [mcId, selectedLevel]);

  if (!quiz || quiz.domande.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
        Nessuna domanda disponibile per questo livello. Genera prima gli asset con l&apos;Agente Sintetizzatore.
      </div>
    );
  }

  const domanda = quiz.domande[currentQ];
  const isCorrect = selected === domanda.risposta_corretta;
  const wrongOption = confirmed && !isCorrect
    ? domanda.opzioni.find((o) => o.id === selected)
    : null;

  function handleConfirm() {
    if (!selected || confirmed) return;
    setConfirmed(true);
    if (selected === domanda.risposta_corretta) {
      setScore((s) => s + 1);
    }
    setAnswers((prev) => ({ ...prev, [domanda.id]: selected }));
  }

  function handleNext() {
    if (currentQ + 1 >= quiz!.domande.length) {
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setConfirmed(false);
    }
  }

  function handleRestart() {
    setCurrentQ(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
    setAnswers({});
  }

  const totalQ = quiz.domande.length;
  const pct = Math.round((score / totalQ) * 100);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Quiz interattivo</span>
          {isReal && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
              ✓ Validato
            </span>
          )}
        </div>
        <div className="flex gap-1.5 sm:gap-2">
          {(["F", "I", "A"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLevel(l)}
              aria-pressed={selectedLevel === l}
              aria-label={`Livello ${LEVEL_LABELS[l]}`}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 sm:px-3 ${
                selectedLevel === l
                  ? LEVEL_COLORS[l]
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              {LEVEL_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {finished ? (
          /* Results screen */
          <div className="text-center space-y-4">
            <div className="text-4xl">
              {pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}
            </div>
            <p className="text-lg font-semibold text-gray-800">
              Hai risposto correttamente a {score} domande su {totalQ}
            </p>
            <div className="mx-auto h-3 w-48 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-yellow-400" : "bg-red-400"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{pct}%</p>
            {pct < 80 && (
              <p className="text-sm text-gray-600">
                Rileggi la scheda della competenza e riprova — puoi farcela!
              </p>
            )}
            <button
              onClick={handleRestart}
              className="mt-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Riprova
            </button>
          </div>
        ) : (
          /* Question screen */
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-400 transition-all"
                  style={{ width: `${((currentQ) / totalQ) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{currentQ + 1}/{totalQ}</span>
            </div>

            {/* Question */}
            <p className="text-base font-medium text-gray-800 leading-snug">
              {domanda.domanda}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {domanda.opzioni.map((opt) => {
                let cls =
                  "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ";
                if (!confirmed) {
                  cls +=
                    selected === opt.id
                      ? "border-indigo-400 bg-indigo-50 text-indigo-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50";
                } else {
                  if (opt.id === domanda.risposta_corretta) {
                    cls += "border-green-400 bg-green-50 text-green-800";
                  } else if (opt.id === selected) {
                    cls += "border-red-300 bg-red-50 text-red-700";
                  } else {
                    cls += "border-gray-100 bg-white text-gray-400";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => !confirmed && setSelected(opt.id)}
                    className={cls}
                    disabled={confirmed}
                  >
                    <span className="font-medium mr-2 uppercase">{opt.id}.</span>
                    {opt.testo}
                  </button>
                );
              })}
            </div>

            {/* Feedback after confirm */}
            {confirmed && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  isCorrect
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {isCorrect ? (
                  <>
                    <span className="font-semibold">✓ Corretto!</span>{" "}
                    {domanda.spiegazione}
                  </>
                ) : (
                  <>
                    <span className="font-semibold">✗ Non corretto.</span>{" "}
                    {wrongOption?.feedback_errato || "Rileggi la scheda e riprova."}{" "}
                    {domanda.spiegazione && (
                      <span className="block mt-1 text-red-700">{domanda.spiegazione}</span>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-1">
              {!confirmed ? (
                <button
                  onClick={handleConfirm}
                  disabled={!selected}
                  aria-disabled={!selected}
                  className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Conferma
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  {currentQ + 1 >= totalQ ? "Vedi risultati" : "Prossima →"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
