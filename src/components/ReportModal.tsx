import React from 'react';
import { Student } from '../types/game';
import { exportStudentsToCSV } from '../utils/export';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  roomCode: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  students,
  roomCode,
}) => {
  if (!isOpen) return null;

  const sorted = [...students].sort((a, b) => {
    if (a.isFinished && !b.isFinished) return -1;
    if (!a.isFinished && b.isFinished) return 1;
    if (a.isFinished && b.isFinished) return (a.finishRank || 99) - (b.finishRank || 99);
    return b.score - a.score;
  });

  const totalStudents = students.length;
  const finishedCount = students.filter((s) => s.isFinished).length;
  const avgScore = totalStudents > 0
    ? Math.round(students.reduce((acc, s) => acc + (s.score || 0), 0) / totalStudents)
    : 0;
  
  const totalCorrect = students.reduce((acc, s) => acc + (s.correctCount || 0), 0);
  const totalAttempted = students.reduce((acc, s) => acc + (s.correctCount || 0) + (s.wrongCount || 0), 0);
  const classAccuracy = totalAttempted > 0
    ? ((totalCorrect / totalAttempted) * 100).toFixed(1)
    : '0.0';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white border-2 border-slate-300 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
              📊
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 font-racing">
                REKAP HASIL PENGERJAAN LOGARACING GP
              </h2>
              <p className="text-xs text-slate-500">
                Laporan Nilai Kelas · Kode Room: <strong className="font-mono text-rose-600">{roomCode}</strong> · Kapasitas Maksimal 50 Siswa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quick Class Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-slate-100/70 border-b border-slate-200">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 font-racing block">TOTAL SISWA</span>
            <p className="text-xl font-black text-slate-900 font-racing mt-0.5">{totalStudents} / 50</p>
            <span className="text-[10px] text-emerald-600 font-medium">{finishedCount} Siswa Finish</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 font-racing block">RATA-RATA SKOR</span>
            <p className="text-xl font-black text-blue-600 font-racing mt-0.5">{avgScore} Pts</p>
            <span className="text-[10px] text-slate-500">Skor Kelas</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 font-racing block">AKURASI KELAS</span>
            <p className="text-xl font-black text-emerald-600 font-racing mt-0.5">{classAccuracy}%</p>
            <span className="text-[10px] text-slate-500">{totalCorrect} Soal Terjawab Benar</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 font-racing block">CHAMPION P1</span>
            <p className="text-sm font-black text-amber-600 font-racing mt-1 truncate">
              {sorted[0]?.name || '-'}
            </p>
            <span className="text-[10px] text-slate-500">{sorted[0]?.score || 0} Pts</span>
          </div>
        </div>

        {/* Student Score Table */}
        <div className="flex-1 overflow-y-auto p-5">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-racing uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Pembalap / Siswa</th>
                <th className="py-2.5 px-3">Tim Balap</th>
                <th className="py-2.5 px-3 text-center">Benar / Salah</th>
                <th className="py-2.5 px-3 text-center">Akurasi</th>
                <th className="py-2.5 px-3 text-right">Skor Akhir</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sorted.map((s, idx) => {
                const totalAttemptedStudent = (s.correctCount || 0) + (s.wrongCount || 0);
                const acc = totalAttemptedStudent > 0
                  ? ((s.correctCount / totalAttemptedStudent) * 100).toFixed(0)
                  : '0';

                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-racing font-bold text-slate-700">
                      {s.finishRank ? `P${s.finishRank}` : `P${idx + 1}`}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold font-racing"
                          style={{ backgroundColor: s.carColor || '#E10600' }}
                        >
                          #{s.carNumber}
                        </div>
                        <strong className="text-slate-900 font-racing">{s.name}</strong>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-[120px]">
                      {s.teamName}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      <span className="text-emerald-600 font-bold">{s.correctCount || 0}</span> / <span className="text-rose-600">{s.wrongCount || 0}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                      {acc}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {s.score} Pts
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-racing ${
                        s.isFinished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {s.isFinished ? 'FINISH' : 'DALAM LINTASAN'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {students.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              Belum ada data siswa di sesi ini.
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Format file: Microsoft Excel / CSV UTF-8 Compatible
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold font-racing btn-press cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>CETAK / PRINT PDF</span>
            </button>

            <button
              onClick={() => exportStudentsToCSV(students, roomCode)}
              disabled={students.length === 0}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black font-racing shadow-lg shadow-emerald-600/30 btn-press btn-shockwave cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>DOWNLOAD CSV / EXCEL (.CSV)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
