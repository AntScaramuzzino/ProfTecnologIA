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
  /** Chiamata al termine del quiz con punteggio finale — usata da useProgress */
  onComplete?: (score: number, total: number, level: "F" | "I" | "A") => void;
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

export default function QuizWidget({ mcId, livello, quizData, onComplete }: QuizWidgetProps) {
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
    if (!isReal || !quizData) {
      setQuiz(null);
      setCurrentQ(0);
      setSelected(null);
      setConfirmed(false);
      setScore(0);
      setFinished(false);
      setAnswers({});
      return;
    }
    // Converte il formato RealQuizQuestion → QuizDomanda interno
    const domande: QuizDomanda[] = quizData
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
    setQuiz({ mc_id: mcId, domande });
    setCurrentQ(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
    setAnswers({});
  }, [mcId, selectedLevel, quizData, isReal]);

  if (!quiz || quiz.domande.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
        Nessuna domanda disponibile per il livello selezionato.
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
      // Notifica il parent (MCPageClient → useProgress) con il punteggio finale
      onComplete?.(score, totalQ, selectedLevel);
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
              <div
                className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden"
                role="progressbar"
                aria-valuenow={currentQ}
                aria-valuemin={0}
                aria-valuemax={totalQ}
                aria-label={`Domanda ${currentQ + 1} di ${totalQ}`}
              >
                <div
                  className="h-full rounded-full bg-indigo-400 transition-all"
                  style={{ width: `${(currentQ / totalQ) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400" aria-hidden>{currentQ + 1}/{totalQ}</span>
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

            {/* Feedback after confirm — aria-live annuncia il risultato agli screen reader */}
            <div aria-live="polite" aria-atomic="true">
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
            </div>

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
