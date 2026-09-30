import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Student, ViewRole } from '../types/game';
import { LOGARITHM_QUESTIONS } from '../data/questions';
import { MathView } from './MathView';
import { soundManager } from '../utils/audio';
import { FormulaCheatSheetModal } from './FormulaCheatSheetModal';
import confetti from 'canvas-confetti';

interface StudentCockpitViewProps {
  student: Student;
  onUpdateStudent: (student: Student) => void;
  onNavigate: (view: ViewRole) => void;
  totalLaps?: number; // Strictly 1 Lap
  onStudentFinish?: (student: Student) => void;
}

export const StudentCockpitView: React.FC<StudentCockpitViewProps> = ({
  student,
  onUpdateStudent,
  onNavigate,
  totalLaps = 1,
  onStudentFinish,
}) => {
  // 10 distinct questions for the 1 lap sprint
  const questions = useMemo(() => LOGARITHM_QUESTIONS.slice(0, 10), []);

  // Question index: 0 to 9 (Soal 1 sampai 10)
  const [currentIdx, setCurrentIdx] = useState(0);
  const [clickedButtonIdx, setClickedButtonIdx] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  
  const [speed, setSpeed] = useState(student.speedKmh || 285);
  const [gear, setGear] = useState(student.gear || 7);
  const [rpm, setRpm] = useState(11500);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [drsBoost, setDrsBoost] = useState(false);

  const activeQuestion = questions[currentIdx % questions.length];

  // Dynamic engine RPM pulsing
  useEffect(() => {
    const interval = setInterval(() => {
      setRpm((prev) => 11000 + Math.floor(Math.sin(Date.now() / 250) * 1100));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleAnswerSelect = useCallback((optionIdx: number) => {
    if (selectedOption !== null || student.isFinished) return;

    setClickedButtonIdx(optionIdx);
    setSelectedOption(optionIdx);
    const isCorrect = optionIdx === activeQuestion.correctIndex;

    const nextQuestionIndex = currentIdx + 1;
    const isLastQuestion = nextQuestionIndex >= 10;

    if (isCorrect) {
      soundManager.playCorrectSound();
      setFeedbackStatus('correct');
      
      const newStreak = (student.streak || 0) + 1;
      const isDrs = newStreak >= 2;
      setDrsBoost(isDrs);
      if (isDrs) soundManager.playDrsBoost();

      const newSpeed = Math.min(355, speed + 12 + (newStreak * 4));
      const newGear = Math.min(8, Math.max(6, Math.floor(newSpeed / 42)));
      setSpeed(newSpeed);
      setGear(newGear);

      const newCorrectCount = (student.correctCount || 0) + 1;
      // Progress increases by 10% per correct answer or based on total questions completed
      const newProgress = Math.min(100, (newCorrectCount * 10));
      const isFin = isLastQuestion || newCorrectCount >= 10 || newProgress >= 100;

      if (isFin) {
        confetti({ particleCount: 140, spread: 85, origin: { y: 0.5 } });
      }

      const updated: Student = {
        ...student,
        score: (student.score || 0) + 100 + (newStreak * 20),
        correctCount: newCorrectCount,
        streak: newStreak,
        progress: newProgress,
        currentLap: 1,
        isFinished: isFin,
        speedKmh: newSpeed,
        gear: newGear,
        lastAnswerStatus: 'correct',
        lastAnswerTime: Date.now(),
      };
      onUpdateStudent(updated);
      if (isFin && onStudentFinish) {
        onStudentFinish(updated);
      }

      // Advance directly to next question without repeating loops
      setTimeout(() => {
        setSelectedOption(null);
        setClickedButtonIdx(null);
        setFeedbackStatus('idle');

        if (!isFin) {
          setCurrentIdx((prev) => prev + 1);
        }
      }, 1500);

    } else {
      // Wrong answer
      soundManager.playWrongSound();
      setFeedbackStatus('wrong');
      setDrsBoost(false);

      const penaltySpeed = Math.max(170, speed - 35);
      setSpeed(penaltySpeed);
      setGear(Math.max(4, gear - 2));

      const isFin = isLastQuestion;
      if (isFin) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      }

      const updated: Student = {
        ...student,
        wrongCount: (student.wrongCount || 0) + 1,
        streak: 0,
        isFinished: isFin,
        speedKmh: penaltySpeed,
        gear: Math.max(4, gear - 2),
        lastAnswerStatus: 'wrong',
        lastAnswerTime: Date.now(),
      };
      onUpdateStudent(updated);
      if (isFin && onStudentFinish) {
        onStudentFinish(updated);
      }

      // Advance directly to next question without repeating loop
      setTimeout(() => {
        setSelectedOption(null);
        setClickedButtonIdx(null);
        setFeedbackStatus('idle');

        if (!isFin) {
          setCurrentIdx((prev) => prev + 1);
        }
      }, 1800);
    }
  }, [
    selectedOption,
    student,
    activeQuestion,
    currentIdx,
    speed,
    gear,
    onUpdateStudent,
    onStudentFinish,
  ]);

  // Keyboard shortcut listener (1, 2, 3, 4 / A, B, C, D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', 'a', 'A'].includes(e.key)) handleAnswerSelect(0);
      if (['2', 'b', 'B'].includes(e.key)) handleAnswerSelect(1);
      if (['3', 'c', 'C'].includes(e.key)) handleAnswerSelect(2);
      if (['4', 'd', 'D'].includes(e.key)) handleAnswerSelect(3);
      if (e.key === 'h' || e.key === 'H') setShowFormulaModal((p) => !p);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswerSelect]);

  const targetQuestions = 10;
  const currentCorrect = student.correctCount || 0;

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-100 p-3 md:p-6 flex flex-col items-center justify-between select-none relative overflow-hidden">
      {/* Background Track Scenery */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-100 via-slate-100 to-slate-200 pointer-events-none" />

      {/* Top Cockpit HUD Header Bar */}
      <div className="w-full max-w-5xl z-10 flex flex-wrap items-center justify-between gap-2 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('student_garage')}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors btn-press cursor-pointer"
            title="Kembali ke Garasi"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: student.carColor || '#E10600' }}
            />
            <span className="text-xs font-bold text-slate-900 font-racing">
              {student.name || 'Pembalap'} #{student.carNumber || 33}
            </span>
          </div>
        </div>

        {/* Live Race Status Telemetry */}
        <div className="flex items-center gap-3 text-xs font-racing font-bold text-slate-700 flex-wrap">
          <div className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
            SOAL: <span className="text-rose-600 font-black">{currentIdx + 1}/{targetQuestions}</span>
          </div>

          <div className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
            SKOR: <span className="text-emerald-600 font-black">{student.score || 0}</span> ({currentCorrect} Benar)
          </div>

          {drsBoost && (
            <div className="px-2.5 py-1 bg-cyan-100 text-cyan-800 rounded-lg border border-cyan-300 animate-pulse">
              ⚡ DRS AKTIF ({student.streak}x STREAK)
            </div>
          )}

          <button
            onClick={() => setShowFormulaModal(true)}
            className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors btn-press cursor-pointer"
          >
            📻 PIT-RADIO (RUMUS) [H]
          </button>
        </div>
      </div>

      {/* Main Center Windshield HUD: Mathematical Equation Box in KaTeX */}
      <div className="w-full max-w-4xl z-10 my-2 flex flex-col items-center">
        <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl border-2 border-slate-300 shadow-2xl p-5 md:p-8 relative overflow-hidden transition-all duration-300">
          
          {/* Top Status Banner */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="text-xs font-bold text-slate-900 font-racing tracking-wider">
                SOAL #{currentIdx + 1} DARI 10 · {activeQuestion.category}
              </span>
            </div>
            
            {/* 10-Step Progress Indicator */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-2 rounded-sm transition-all duration-300 ${
                    i < currentIdx
                      ? 'bg-emerald-500 shadow-[0_0_6px_#10B981]'
                      : i === currentIdx
                      ? 'bg-rose-500 ring-2 ring-rose-300 animate-pulse'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mathematical Equation rendered in KaTeX */}
          <div className="py-4 text-center">
            <div className="text-[11px] text-slate-400 font-racing mb-2 tracking-widest uppercase">
              Selesaikan persamaan logaritma berikut untuk akselerasi mobil F1:
            </div>
            
            {/* KaTeX Main Equation Rendering */}
            <div className="text-3xl md:text-5xl font-black text-slate-950 font-racing tracking-wide drop-shadow-sm my-3 flex items-center justify-center overflow-x-auto py-2">
              <MathView
                math={activeQuestion.equationLatex || activeQuestion.plainText}
                displayMode={true}
                className="text-slate-950"
              />
            </div>
          </div>

          {/* Feedback Overlay with Formula Proof */}
          {feedbackStatus !== 'idle' && (
            <div className={`my-2 p-3.5 rounded-2xl border text-center transition-all animate-bounce ${
              feedbackStatus === 'correct'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="font-racing font-black text-sm md:text-base flex items-center justify-center gap-2">
                <span>{feedbackStatus === 'correct' ? '✓ TEPAT! AKSELERASI +10% PROGRESS LAP' : '✗ SALAH! KECEPATAN BERKURANG'}</span>
              </div>
              <div className="text-xs mt-1.5 font-mono font-semibold">
                <MathView math={activeQuestion.explanationLatex || activeQuestion.explanation} />
              </div>
            </div>
          )}

          {/* Finisher Banner */}
          {student.isFinished && (
            <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl text-center my-2 animate-pulse">
              <span className="text-xl font-black text-amber-900 font-racing">
                🏁 BALAPAN SELESAI! 10 SOAL TUNTAS
              </span>
              <p className="text-xs text-amber-800 mt-1">
                Mobil Anda telah melewati garis akhir sirkuit ({currentCorrect} jawaban benar, Skor: {student.score}).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Half: F1 Steering Wheel & 4 Animated Equation Answer Buttons (A, B, C, D) */}
      <div className="w-full max-w-4xl z-10 flex flex-col items-center">
        <div className="w-full bg-slate-900 border-4 border-slate-800 rounded-3xl p-4 md:p-5 shadow-2xl relative text-white">
          
          {/* Steering Top RPM Shift Lights Bar */}
          <div className="w-full flex items-center justify-center gap-1.5 mb-3 pb-2 border-b border-slate-800">
            {Array.from({ length: 15 }).map((_, i) => {
              const activeThreshold = (i + 1) * 800 + 10000;
              const isLit = rpm >= activeThreshold;
              let ledColor = 'bg-slate-800';
              if (isLit) {
                if (i < 5) ledColor = 'bg-emerald-400 shadow-[0_0_8px_#34d399]';
                else if (i < 10) ledColor = 'bg-amber-400 shadow-[0_0_8px_#fbbf24]';
                else ledColor = 'bg-purple-500 shadow-[0_0_10px_#a855f7] animate-pulse';
              }

              return (
                <div
                  key={i}
                  className={`w-3.5 h-3 rounded-sm transition-colors duration-75 ${ledColor}`}
                />
              );
            })}
          </div>

          {/* Central Steering Digital Telemetry Screen */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 mb-4 max-w-md mx-auto text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-400 font-racing">SPEED</span>
              <p className="text-2xl font-black text-cyan-400 font-mono-num">{speed}</p>
              <span className="text-[9px] text-slate-500">KM/H</span>
            </div>
            <div className="border-x border-slate-800">
              <span className="text-[10px] text-slate-400 font-racing">LAP / TARGET</span>
              <p className="text-xl font-black text-white font-racing">
                {currentIdx + 1}/10
              </p>
              <span className="text-[9px] text-emerald-400">1 LAP SPRINT</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-racing">RPM</span>
              <p className="text-2xl font-black text-amber-400 font-mono-num">{rpm}</p>
              <span className="text-[9px] text-slate-500">MAX 13500</span>
            </div>
          </div>

          {/* 4 Interactive Animated Racing Buttons (A, B, C, D) with KaTeX Mathematical Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {activeQuestion.options.map((option, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const buttonColors = [
                'hover:border-red-500 hover:bg-red-500/20 active:bg-red-600 focus:ring-red-500 text-red-400 border-red-500/60',
                'hover:border-blue-500 hover:bg-blue-500/20 active:bg-blue-600 focus:ring-blue-500 text-blue-400 border-blue-500/60',
                'hover:border-amber-500 hover:bg-amber-500/20 active:bg-amber-600 focus:ring-amber-500 text-amber-400 border-amber-500/60',
                'hover:border-emerald-500 hover:bg-emerald-500/20 active:bg-emerald-600 focus:ring-emerald-500 text-emerald-400 border-emerald-500/60',
              ][idx];

              const badgeColors = [
                'bg-red-600 text-white',
                'bg-blue-600 text-white',
                'bg-amber-500 text-slate-950',
                'bg-emerald-600 text-white',
              ][idx];

              const isClicked = clickedButtonIdx === idx;
              const isSelected = selectedOption === idx;
              const optLatex = activeQuestion.optionsLatex?.[idx] || option;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={selectedOption !== null || student.isFinished}
                  className={`p-4 rounded-2xl bg-slate-950/95 border-2 transition-all duration-150 flex flex-col items-center justify-center gap-2 shadow-lg cursor-pointer transform active:scale-95 disabled:cursor-not-allowed btn-press btn-shockwave ${buttonColors} ${
                    isClicked ? 'steering-hit ring-4 ring-white bg-slate-800' : ''
                  } ${isSelected ? 'ring-4 ring-white' : ''}`}
                >
                  {/* Option Badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black font-racing text-sm shadow ${badgeColors} transform group-hover:scale-110`}>
                    {letter}
                  </div>
                  
                  {/* Option KaTeX Mathematical Equation Rendering */}
                  <div className="text-xl font-black font-racing tracking-wide text-white min-h-[32px] flex items-center justify-center">
                    <MathView math={optLatex} />
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    [Tekan {idx + 1} atau {letter}]
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <FormulaCheatSheetModal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
      />
    </div>
  );
};
