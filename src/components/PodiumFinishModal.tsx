import React, { useEffect } from 'react';
import { Student } from '../types/game';
import confetti from 'canvas-confetti';

interface PodiumFinishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  students: Student[];
}

export const PodiumFinishModal: React.FC<PodiumFinishModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  students,
}) => {
  // Sort finishers first by finishRank or progress
  const finishers = [...students]
    .filter((s) => s.isFinished || s.correctCount >= 10)
    .sort((a, b) => (a.finishRank || 99) - (b.finishRank || 99));

  // Fallback if less than 10 finished, sort by score/progress
  const top10 = finishers.length >= 3
    ? finishers.slice(0, 10)
    : [...students].sort((a, b) => b.score - a.score).slice(0, 10);

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.6 },
        });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const p1 = top10[0];
  const p2 = top10[1];
  const p3 = top10[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white border-2 border-slate-300 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto overflow-x-hidden p-6 md:p-8 flex flex-col">
        {/* Podium Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold font-racing mb-2">
            🏁 CHECKERED FLAG · 10 PEMBALAP PERTAMA FINISH!
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 font-racing">
            PODIUM JUARA LOGARACING GP
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Selamat kepada 10 siswa yang berhasil menuntaskan 10 soal logaritma dengan 100% lap progress!
          </p>
        </div>

        {/* 3D-Style Podium Stand for Top 3 */}
        <div className="grid grid-cols-3 gap-3 my-4 items-end text-center max-w-xl mx-auto w-full">
          {/* P2: Silver Podium */}
          {p2 && (
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full border-4 border-slate-300 shadow-md flex items-center justify-center text-white font-black font-racing text-sm mb-2"
                style={{ backgroundColor: p2.carColor || '#00A19B' }}
              >
                #{p2.carNumber}
              </div>
              <span className="text-xs font-bold text-slate-900 font-racing truncate max-w-[90px]">
                {p2.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{p2.score} Pts</span>
              <div className="w-full h-24 bg-gradient-to-t from-slate-300 to-slate-200 border-2 border-slate-400 rounded-t-2xl flex flex-col items-center justify-center shadow-inner mt-2">
                <span className="text-2xl font-black font-racing text-slate-700">P2</span>
                <span className="text-[10px] font-bold text-slate-600">SILVER</span>
              </div>
            </div>
          )}

          {/* P1: Gold Podium Champion */}
          {p1 && (
            <div className="flex flex-col items-center -mt-6">
              <div className="text-2xl mb-1 animate-bounce">👑</div>
              <div
                className="w-16 h-16 rounded-full border-4 border-amber-400 shadow-xl flex items-center justify-center text-white font-black font-racing text-lg mb-2 ring-4 ring-amber-300/50"
                style={{ backgroundColor: p1.carColor || '#E10600' }}
              >
                #{p1.carNumber}
              </div>
              <span className="text-sm font-black text-slate-950 font-racing truncate max-w-[110px]">
                {p1.name}
              </span>
              <span className="text-xs font-bold text-amber-700 font-mono">{p1.score} Pts</span>
              <div className="w-full h-32 bg-gradient-to-t from-amber-400 to-amber-300 border-2 border-amber-500 rounded-t-2xl flex flex-col items-center justify-center shadow-xl mt-2">
                <span className="text-3xl font-black font-racing text-amber-950">P1</span>
                <span className="text-xs font-black text-amber-900 font-racing">CHAMPION</span>
              </div>
            </div>
          )}

          {/* P3: Bronze Podium */}
          {p3 && (
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full border-4 border-amber-700 shadow-md flex items-center justify-center text-white font-black font-racing text-sm mb-2"
                style={{ backgroundColor: p3.carColor || '#FF8000' }}
              >
                #{p3.carNumber}
              </div>
              <span className="text-xs font-bold text-slate-900 font-racing truncate max-w-[90px]">
                {p3.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{p3.score} Pts</span>
              <div className="w-full h-18 bg-gradient-to-t from-amber-700/70 to-amber-600/70 border-2 border-amber-800 rounded-t-2xl flex flex-col items-center justify-center shadow-inner mt-2">
                <span className="text-2xl font-black font-racing text-amber-100">P3</span>
                <span className="text-[10px] font-bold text-amber-200">BRONZE</span>
              </div>
            </div>
          )}
        </div>

        {/* Top 10 Finisher Table */}
        <div className="my-4 bg-slate-50 rounded-2xl border border-slate-200 p-4 max-h-52 overflow-y-auto">
          <span className="text-xs font-bold text-slate-700 font-racing block mb-2">
            DAFTAR 10 BESAR FINISHER (10 JAWABAN BENAR)
          </span>
          <div className="space-y-1.5 text-xs font-medium">
            {top10.map((s, idx) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-racing font-bold text-slate-600 w-6">
                    P{idx + 1}
                  </span>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold font-racing"
                    style={{ backgroundColor: s.carColor || '#E10600' }}
                  >
                    #{s.carNumber}
                  </div>
                  <span className="font-bold text-slate-900 font-racing">{s.name}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-mono">
                  <span>10/10 Soal</span>
                  <strong className="text-slate-900">{s.score} Pts</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold font-racing btn-press"
          >
            LIHAT SIRKUIT
          </button>
          <button
            onClick={() => {
              onClose();
              onRestart();
            }}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black font-racing shadow-lg shadow-rose-600/30 btn-press"
          >
            BALAPAN LAGI (RESTART GP)
          </button>
        </div>
      </div>
    </div>
  );
};
