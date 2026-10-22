'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, AlertCircle, HelpCircle, Sparkles } from 'lucide-react';
import { QuizQuestion, RoadSign } from '@/types/sign';
import { OFFICIAL_RTO_QUIZ_QUESTIONS } from '@/data/quizQuestions';
import { SignSvg } from '@/components/SignSvg';
import { sounds } from '@/utils/audio';
import { CertificateModal } from './CertificateModal';

interface QuizRunnerProps {
  signs: RoadSign[];
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ signs }) => {
  // Sign map for showing SVG preview in questions
  const signMap = useMemo(() => {
    const map = new Map<string, RoadSign>();
    signs.forEach((s) => map.set(s.id, s));
    return map;
  }, [signs]);

  // Quiz configuration
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('Indian Road Learner');

  // Active quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [wrongQuestions, setWrongQuestions] = useState<{ question: QuizQuestion; userAnswer: number }[]>([]);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);

  // Start new quiz
  const startQuiz = (reviewOnly = false) => {
    sounds.playClick();
    if (reviewOnly && wrongQuestions.length > 0) {
      setQuestions(wrongQuestions.map((w) => w.question));
      setIsReviewMode(true);
    } else {
      let pool = [...OFFICIAL_RTO_QUIZ_QUESTIONS];
      if (selectedDifficulty !== 'all') {
        pool = pool.filter((q) => q.difficulty === selectedDifficulty);
      }
      // Shuffle pool
      pool.sort(() => Math.random() - 0.5);
      setQuestions(pool.slice(0, questionCount));
      setIsReviewMode(false);
      setWrongQuestions([]);
    }

    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizStarted(true);
    setIsQuizFinished(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    sounds.playClick();
    setSelectedAnswer(idx);
  };

  const currentQ = questions[currentIndex];
  const associatedSign = currentQ ? signMap.get(currentQ.signId) : null;

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedAnswer === currentQ.correctIndex;
    if (isCorrect) {
      sounds.playSuccess();
      setScore((s) => s + 1);
    } else {
      sounds.playViolation();
      setWrongQuestions((prev) => [...prev, { question: currentQ, userAnswer: selectedAnswer }]);
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizFinished(true);
    }
  };

  // Start screen
  if (!isQuizStarted) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-6">
        <div className="glass-panel-elevated p-8 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-xl shadow-sky-500/20">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">RTO Driving Rules & Signs Quiz</h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-md mt-2">
            Test your knowledge of Indian road signs, right-of-way rules, and Motor Vehicles Act penalties.
          </p>

          <div className="w-full max-w-md flex flex-col gap-4 mt-6 text-left">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Your Name (for Certificate):</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Questions:</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions (Full Exam)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Difficulty:</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => startQuiz(false)}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-all shadow-xl shadow-sky-600/25 active:scale-95 mt-2"
            >
              Start Practice Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Finished Results Screen
  if (isQuizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPassed = percentage >= 60;

    return (
      <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-6">
        <div className="glass-panel-elevated p-8 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col items-center text-center">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-4 shadow-2xl ${
              isPassed ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            {isPassed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white">
            {isPassed ? 'Congratulations! Test Passed' : 'Test Incomplete — More Practice Needed'}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Passing threshold is 60% as required by the Regional Transport Office (RTO).
          </p>

          <div className="flex items-center justify-center gap-6 my-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 w-full max-w-sm">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Score</span>
              <span className={`text-2xl font-black ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {score} / {questions.length}
              </span>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Percentage</span>
              <span className={`text-2xl font-black ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {percentage}%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
            {isPassed && (
              <button
                onClick={() => setShowCertificate(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View Road Safety Certificate</span>
              </button>
            )}

            {wrongQuestions.length > 0 && (
              <button
                onClick={() => startQuiz(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Review Mistakes ({wrongQuestions.length})</span>
              </button>
            )}

            <button
              onClick={() => setIsQuizStarted(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Back to Quiz Setup
            </button>

            {/* Tap to WhatsApp Attribution & Support */}
            <div className="w-full pt-3 mt-1 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <a
                href="https://wa.me/918730063275?text=Hello%20Zomuana%20Sailo,%20I%20completed%20the%20RTO%20Driving%20Quiz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                title="Design and Developed By Zomuana Sailo - Tap to redirect to WhatsApp"
              >
                Design and Developed By Zomuana Sailo
              </a>
              <a
                href="https://wa.me/918730063275?text=Hello%20Zomuana%20Sailo,%20I%20need%20support%20for%20the%20RTO%20Quiz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold transition-all"
                title="Support: 918730063275 - Tap to redirect to WhatsApp"
              >
                Support: 918730063275
              </a>
            </div>
          </div>
        </div>

        {showCertificate && (
          <CertificateModal
            studentName={studentName}
            score={score}
            totalQuestions={questions.length}
            passingScore={Math.ceil(questions.length * 0.6)}
            dateStr={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </div>
    );
  }

  // Active Question Card
  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-4">
      {/* Quiz Progress & Question Counter */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-slate-800 text-xs font-bold text-slate-400">
        <span className="font-mono text-white">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-3">
          <span>Score: <strong className="text-emerald-400">{score}</strong></span>
          <button
            onClick={() => setIsQuizStarted(false)}
            className="text-slate-500 hover:text-slate-300"
          >
            Exit Quiz
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-sky-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Main Card */}
      <div className="glass-panel-elevated p-6 md:p-8 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col gap-6 text-slate-100">
        {/* Top: Sign SVG if attached */}
        {associatedSign && (
          <div className="w-full flex justify-center py-2">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-center shadow-inner">
              <SignSvg svgType={associatedSign.svgType} params={associatedSign.svgParams} className="w-full h-full drop-shadow-lg" />
            </div>
          </div>
        )}

        {/* Question Text */}
        <h3 className="text-base md:text-lg font-bold text-white text-center leading-snug">
          {currentQ.question}
        </h3>

        {/* Multiple Choice Options */}
        <div className="flex flex-col gap-2.5">
          {currentQ.options.map((opt, idx) => {
            let stateClass = 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-200';

            if (isAnswerSubmitted) {
              if (idx === currentQ.correctIndex) {
                stateClass = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold';
              } else if (idx === selectedAnswer) {
                stateClass = 'bg-rose-950/50 border-rose-500 text-rose-200 font-bold';
              }
            } else if (idx === selectedAnswer) {
              stateClass = 'bg-sky-950/60 border-sky-400 text-white font-semibold ring-1 ring-sky-400';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswerSubmitted}
                className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm flex items-center justify-between gap-3 transition-all active:scale-[0.99] ${stateClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800/80 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isAnswerSubmitted && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswerSubmitted && idx === selectedAnswer && idx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Banner after submission */}
        {isAnswerSubmitted && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs space-y-1.5 animate-fade-in">
            <span className="font-bold text-sky-400 uppercase text-[10px] tracking-wider block">
              Official Indian Road Rule & Explanation:
            </span>
            <p className="text-slate-200 leading-relaxed">{currentQ.explanation}</p>
            {currentQ.fineInfo && (
              <p className="text-rose-300 font-semibold pt-1">
                <strong>Penalty:</strong> {currentQ.fineInfo}
              </p>
            )}
          </div>
        )}

        {/* Action Button: Submit or Next */}
        <div className="flex justify-end pt-2">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`py-3 px-6 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                selectedAnswer === null
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-1.5 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg active:scale-95"
            >
              <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
