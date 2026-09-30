import React, { useState, useEffect } from 'react';
import { Student, RaceState, ViewRole } from '../types/game';
import { F1CircuitTrack } from './F1CircuitTrack';
import { F1Lights } from './F1Lights';
import { F1ThemePlayer } from './F1ThemePlayer';
import { soundManager } from '../utils/audio';
import { FormulaCheatSheetModal } from './FormulaCheatSheetModal';
import { PodiumFinishModal } from './PodiumFinishModal';
import { ReportModal } from './ReportModal';
import { exportStudentsToCSV } from '../utils/export';

interface TeacherControlViewProps {
  students: Student[];
  raceState: RaceState;
  onStartRaceCountdown: () => void;
  onResetRace: () => void;
  onClearStudents: () => void;
  onNavigate: (view: ViewRole) => void;
  onFinishRace: () => void;
  onLogoutTeacher: () => void;
}

export const TeacherControlView: React.FC<TeacherControlViewProps> = ({
  students,
  raceState,
  onStartRaceCountdown,
  onResetRace,
  onClearStudents,
  onNavigate,
  onFinishRace,
  onLogoutTeacher,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [showPodiumModal, setShowPodiumModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Stop F1 theme music when unmounting teacher view
  useEffect(() => {
    return () => {
      soundManager.stopF1Theme();
    };
  }, []);

  // Sorted leaderboard based on genuine real-time progress
  const sortedLeaderboard = [...students].sort((a, b) => {
    if (a.isFinished && !b.isFinished) return -1;
    if (!a.isFinished && b.isFinished) return 1;
    if (a.isFinished && b.isFinished) return (a.finishRank || 99) - (b.finishRank || 99);
    return b.progress - a.progress;
  });

  const filteredLeaderboard = sortedLeaderboard.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || String(s.carNumber).includes(q) || s.teamName.toLowerCase().includes(q);
  });

  const totalStudents = students.length;
  const readyStudents = students.filter((s) => s.isReady).length;
  const finishedStudents = students.filter((s) => s.isFinished || s.correctCount >= 10);
  const finishedCount = finishedStudents.length;
  const allReady = totalStudents > 0 && readyStudents === totalStudents;

  useEffect(() => {
    if (raceState.status === 'finished' || (finishedCount >= 10 && raceState.status === 'racing')) {
      setShowPodiumModal(true);
    }
  }, [raceState.status, finishedCount]);

  const handleStartRaceClick = () => {
    if (totalStudents === 0) {
      alert('Belum ada siswa yang bergabung di ruang tunggu. Minta siswa membuka aplikasi di perangkat masing-masing dan mengklik SIAP!');
      return;
    }
    soundManager.playRedLightBeep();
    onStartRaceCountdown();
  };

  const handleDirectDownload = () => {
    if (students.length === 0) {
      alert('Belum ada data siswa untuk di-download.');
      return;
    }
    exportStudentsToCSV(students, raceState.roomCode);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 p-4 md:p-8 racing-grid flex flex-col items-center">
      {/* Top Header Bar */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('role_select')}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm btn-press cursor-pointer"
            title="Kembali ke Pemilihan Peran"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h1 className="text-xl md:text-2xl font-black text-slate-950 font-racing">
                RUANG KENDALI GURU (RACE CONTROL CENTER)
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Sinkronisasi Real-Time Siswa Aktif · Format 1 Lap (10 Soal) · Terautentikasi: <strong className="text-emerald-700">Race Director (Guru)</strong>
            </p>
          </div>
        </div>

        {/* Room Code & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span>KODE KELAS:</span>
            <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              {raceState.roomCode}
            </span>
          </div>

          {/* Download & Report Buttons */}
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition-colors font-racing shadow-sm btn-press cursor-pointer flex items-center gap-1.5"
            title="Lihat & Cetak Laporan Rekap Nilai Siswa"
          >
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>REKAP NILAI</span>
          </button>

          <button
            onClick={handleDirectDownload}
            disabled={totalStudents === 0}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black font-racing shadow-sm transition-all btn-press cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            title="Download Hasil Rekap Nilai Siswa (.CSV / Excel)"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>DOWNLOAD HASIL (.CSV)</span>
          </button>

          <button
            onClick={() => setShowFormulaModal(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors font-racing shadow-sm btn-press cursor-pointer"
          >
            RUMUS
          </button>

          {totalStudents > 0 && (
            <button
              onClick={onClearStudents}
              className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors font-racing btn-press cursor-pointer"
              title="Kosongkan daftar siswa untuk sesi kelas baru"
            >
              KOSONGKAN KELAS
            </button>
          )}

          {/* Logout button */}
          <button
            onClick={onLogoutTeacher}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold font-racing transition-colors btn-press cursor-pointer flex items-center gap-1"
            title="Kunci Ruang Guru (Logout)"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>KELUAR</span>
          </button>
        </div>
      </div>

      {/* F1 Theme Audio Soundtrack Player Bar */}
      <div className="w-full max-w-7xl mb-5">
        <F1ThemePlayer autoPlay={true} />
      </div>

      {/* Main Teacher Dashboard Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Circuit Track & Race Controls (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Status & Control Panel Bar */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Dynamic Real-time Status Indicator for genuinely joined students */}
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl border ${
                allReady
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : totalStudents > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}>
                <div className="text-[10px] font-bold font-racing uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>SISWA AKTIF REAL-TIME</span>
                </div>
                <div className="text-xl md:text-2xl font-black font-racing flex items-baseline gap-1 mt-0.5">
                  <span>{readyStudents}/{totalStudents}</span>
                  <span className="text-xs font-bold text-slate-500">Siap (Maks 50)</span>
                </div>
              </div>

              {/* Finisher Counter Pill */}
              <div className="p-3 rounded-2xl border bg-purple-50 border-purple-200 text-purple-900">
                <div className="text-[10px] font-bold font-racing uppercase tracking-wider">
                  TOP 10 FINISHER
                </div>
                <div className="text-xl md:text-2xl font-black font-racing flex items-baseline gap-1 mt-0.5">
                  <span className="text-purple-700">{finishedCount} / 10</span>
                  <span className="text-xs font-bold text-purple-600">SELESAI</span>
                </div>
              </div>
            </div>

            {/* Glowing Main Control Button 'MULAI BALAPAN' */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap justify-end">
              {raceState.status === 'racing' ? (
                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  <div className="px-4 py-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-black font-racing flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                    <span>BALAPAN SEDANG BERLANGSUNG</span>
                  </div>
                  <button
                    onClick={() => setShowPodiumModal(true)}
                    className="px-3.5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold font-racing transition-colors btn-press cursor-pointer"
                  >
                    PODIUM
                  </button>
                  <button
                    onClick={onResetRace}
                    className="px-3 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold font-racing transition-colors btn-press cursor-pointer"
                  >
                    RESET
                  </button>
                </div>
              ) : raceState.status === 'countdown' ? (
                <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl shadow-xl">
                  <F1Lights lightsOnCount={5 - raceState.countdownValue} size="sm" />
                  <span className="font-black font-racing text-sm text-amber-400">
                    START DALAM {raceState.countdownValue}s
                  </span>
                </div>
              ) : raceState.status === 'finished' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPodiumModal(true)}
                    className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black font-racing rounded-xl shadow-lg btn-press cursor-pointer text-xs"
                  >
                    🏆 PODIUM JUARA (TOP 10)
                  </button>
                  <button
                    onClick={handleDirectDownload}
                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-racing rounded-xl btn-press cursor-pointer text-xs"
                  >
                    DOWNLOAD CSV
                  </button>
                  <button
                    onClick={onResetRace}
                    className="px-3 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold font-racing rounded-xl btn-press cursor-pointer text-xs"
                  >
                    RESTART
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartRaceClick}
                  disabled={totalStudents === 0}
                  className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-sm font-racing tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer transform hover:scale-[1.02] btn-press btn-shockwave ${
                    totalStudents > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-4 ring-emerald-400/40 shadow-emerald-600/40 animate-pulse-subtle'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>MULAI BALAPAN (START RACE)</span>
                </button>
              )}
            </div>
          </div>

          {/* F1 Circuit Multi-Curve Track Canvas (Strictly 1 Lap) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm min-h-[460px] flex flex-col">
            <F1CircuitTrack
              students={students}
              currentLap={1}
              totalLaps={1}
              highlightedStudentId={selectedStudentId}
              onSelectStudent={(id) => setSelectedStudentId(id)}
            />
          </div>
        </div>

        {/* Right: Live Real-time Leaderboard (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col h-full min-h-[500px]">
            {/* Header & Search Filter */}
            <div className="border-b border-slate-100 pb-3 mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-600 transform -skew-x-12" />
                  <h3 className="text-sm font-bold text-slate-900 font-racing">
                    LEADERBOARD SISWA REAL-TIME
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                  {totalStudents} Siswa
                </span>
              </div>

              {/* Search input for large class size */}
              {totalStudents > 6 && (
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama siswa atau no. mobil..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                  />
                  <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              )}
            </div>

            {totalStudents === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 animate-pulse">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 font-racing">Menunggu Siswa Masuk...</h4>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
                    Buka aplikasi di HP/Laptop siswa, masukkan nama dan klik tombol <strong className="text-emerald-700">SIAP</strong> untuk masuk ke sirkuit secara langsung.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[500px]">
                {filteredLeaderboard.map((student, rankIdx) => {
                  const isFinished = student.isFinished || student.correctCount >= 10;
                  const isSelected = student.id === selectedStudentId;

                  return (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 shadow-sm ring-1 ring-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Left: Rank & Car Circle Avatar */}
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 text-center font-racing font-black text-xs ${
                          student.finishRank
                            ? 'text-amber-500 font-bold'
                            : rankIdx < 3
                            ? 'text-rose-600'
                            : 'text-slate-400'
                        }`}>
                          {student.finishRank ? `P${student.finishRank}` : `P${rankIdx + 1}`}
                        </span>

                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold font-racing text-[9px] shadow-sm shrink-0"
                          style={{ backgroundColor: student.carColor || '#E10600' }}
                        >
                          #{student.carNumber}
                        </div>

                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-slate-900 truncate font-racing max-w-[130px]">
                            {student.name}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <span>{student.correctCount || 0}/10 Soal</span>
                            <span>·</span>
                            <span>{student.score} Pts</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Progress or Finish Badge */}
                      <div className="text-right shrink-0">
                        {isFinished ? (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-racing border border-amber-300 animate-pulse">
                            🏁 FINISH
                          </span>
                        ) : raceState.status === 'racing' ? (
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-600">
                              {Math.round(student.progress)}%
                            </span>
                            <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${student.progress}%`,
                                  backgroundColor: student.carColor || '#10B981',
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-racing ${
                            student.isReady
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {student.isReady ? 'READY' : 'STANDBY'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <button
                onClick={handleDirectDownload}
                className="text-emerald-700 font-bold hover:underline font-racing flex items-center gap-1 cursor-pointer"
              >
                <span>📥 Export CSV/Excel</span>
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="text-blue-600 font-bold hover:underline font-racing btn-press cursor-pointer"
              >
                Lihat Rekap Nilai →
              </button>
            </div>
          </div>
        </div>

      </div>

      <FormulaCheatSheetModal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
      />

      <PodiumFinishModal
        isOpen={showPodiumModal}
        onClose={() => setShowPodiumModal(false)}
        onRestart={onResetRace}
        students={students}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        students={students}
        roomCode={raceState.roomCode}
      />
    </div>
  );
};
