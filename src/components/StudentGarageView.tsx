import React, { useState, useEffect } from 'react';
import { Student, CAR_COLORS, ViewRole } from '../types/game';
import { soundManager } from '../utils/audio';
import { FormulaCheatSheetModal } from './FormulaCheatSheetModal';
import { F1Lights } from './F1Lights';

interface StudentGarageViewProps {
  currentStudent: Student | null;
  onSaveStudent: (student: Student) => void;
  onToggleReady: (isReady: boolean) => void;
  onNavigate: (view: ViewRole) => void;
  raceStatus: 'waiting' | 'countdown' | 'racing' | 'finished';
  countdownValue?: number;
  roomCode: string;
}

export const StudentGarageView: React.FC<StudentGarageViewProps> = ({
  currentStudent,
  onSaveStudent,
  onToggleReady,
  onNavigate,
  raceStatus,
  countdownValue = 5,
  roomCode,
}) => {
  const [activeTab, setActiveTab] = useState<'garage' | 'dashboard'>('garage');
  const [name, setName] = useState(currentStudent?.name || '');
  const [selectedColorId, setSelectedColorId] = useState(
    CAR_COLORS.find((c) => c.primary === currentStudent?.carColor)?.id || 'ferrari'
  );
  const [carNumber, setCarNumber] = useState(currentStudent?.carNumber || Math.floor(Math.random() * 89) + 10);
  const [isReady, setIsReady] = useState(currentStudent?.isReady || false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const selectedPreset = CAR_COLORS.find((c) => c.id === selectedColorId) || CAR_COLORS[0];

  // Auto-navigate to cockpit when race starts or if student is ready during ongoing race
  useEffect(() => {
    if (raceStatus === 'racing' && isReady) {
      soundManager.playGreenGoBeep();
      onNavigate('student_cockpit');
    }
  }, [raceStatus, isReady, onNavigate]);

  const handleSaveIdentity = (newName: string, newNumber: number, newPresetId: string, readyState: boolean) => {
    const preset = CAR_COLORS.find((c) => c.id === newPresetId) || selectedPreset;
    const studentId = currentStudent?.id || `student_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const updatedStudent: Student = {
      id: studentId,
      name: newName.trim() || 'Pembalap F1',
      carColor: preset.primary,
      secondaryColor: preset.accent,
      carNumber: newNumber,
      teamName: preset.teamName,
      isReady: readyState,
      progress: currentStudent?.progress || 0,
      currentLap: 1,
      isFinished: false,
      score: currentStudent?.score || 0,
      correctCount: currentStudent?.correctCount || 0,
      wrongCount: currentStudent?.wrongCount || 0,
      streak: currentStudent?.streak || 0,
      speedKmh: 0,
      gear: 1,
      rpm: 3500,
      lastAnswerStatus: 'idle',
    };

    onSaveStudent(updatedStudent);
    return updatedStudent;
  };

  const handleToggleReady = () => {
    if (!name.trim()) {
      alert('Silakan masukkan nama Anda terlebih dahulu sebelum mengklik SIAP!');
      return;
    }

    const nextState = !isReady;
    setIsReady(nextState);

    handleSaveIdentity(name, carNumber, selectedColorId, nextState);
    onToggleReady(nextState);

    if (nextState) {
      soundManager.playCorrectSound();
      // If race is already underway (Guru sudah memulai balapan), langsung izinkan bergabung ke lintasan!
      if (raceStatus === 'racing') {
        soundManager.playGreenGoBeep();
        setTimeout(() => {
          onNavigate('student_cockpit');
        }, 500);
      }
    } else {
      soundManager.playRedLightBeep();
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 p-4 md:p-8 racing-grid flex flex-col items-center relative">
      {/* 5-SECOND F1 STARTING LIGHTS COUNTDOWN OVERLAY ON STUDENT SCREEN */}
      {raceStatus === 'countdown' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-lg p-6 animate-fadeIn text-center">
          <div className="max-w-xl w-full flex flex-col items-center">
            {/* Top Gantry Label */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
              <span className="text-xs font-bold text-rose-500 font-racing tracking-widest uppercase">
                F1 START GANTRY · BALAPAN DIMULAI DALAM
              </span>
            </div>

            {/* F1 5 Lights Bar */}
            <div className="my-6 scale-125 origin-center">
              <F1Lights lightsOnCount={5 - countdownValue} size="lg" />
            </div>

            {/* Countdown Number & Lights Out text */}
            <div className="my-4">
              <span className="text-7xl md:text-9xl font-black text-white font-racing font-mono-num tracking-tight animate-bounce">
                {countdownValue}
              </span>
              <p className="text-base md:text-lg font-black text-amber-400 font-racing mt-2 tracking-wider uppercase">
                {countdownValue > 0 ? 'BERSIAP DI KOKPIT...' : '🏁 LIGHTS OUT AND AWAY WE GO!'}
              </p>
            </div>

            <div className="mt-4 p-4 bg-white/10 rounded-2xl border border-white/20 text-slate-300 text-xs font-medium max-w-md">
              Soal logaritma akan terbuka otomatis begitu lampu merah padam. Siapkan jarimu untuk menekan jawaban A, B, C, D!
            </div>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Tab Selector */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
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
            <h1 className="text-xl md:text-2xl font-black text-slate-950 font-racing">
              GARASI & PADDOCK TIM SISWA
            </h1>
            <p className="text-xs text-slate-500">
              Kustomisasi mobil balap logaritma dan klik tombol SIAP untuk tampil di layar guru secara real-time.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('garage')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all font-racing cursor-pointer ${
              activeTab === 'garage'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GARASI & LOGIN
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all font-racing cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            DASHBOARD SISWA
          </button>
        </div>
      </div>

      {/* Main Garage Content */}
      <div className="w-full max-w-5xl">
        {activeTab === 'garage' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Setup (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Input Nama & Nomor */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 font-racing tracking-wide flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-600 inline-block transform -skew-x-12" />
                    IDENTITAS PEMBALAP
                  </span>
                  <span className="text-xs text-slate-500 font-mono">ROOM: {roomCode}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-racing">
                    MASUKKAN NAMAMU <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ketik nama lengkap Anda di sini..."
                    maxLength={28}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:border-rose-500 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-racing">
                      NOMOR MOBIL (#)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={carNumber}
                      onChange={(e) => setCarNumber(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-bold text-sm font-mono focus:border-rose-500 focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-racing">
                      NAMA TIM BALAP
                    </label>
                    <div className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs truncate">
                      {selectedPreset.teamName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Palet Pemilihan Warna Mobil */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 font-racing tracking-wide flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-600 inline-block transform -skew-x-12" />
                    PALET WARNA & LIVERY TIM F1
                  </span>
                  <span className="text-xs text-slate-500">Pilih skema warna lingkaran balapmu</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {CAR_COLORS.map((preset) => {
                    const isSelected = preset.id === selectedColorId;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedColorId(preset.id);
                          soundManager.playRedLightBeep();
                        }}
                        className={`p-3 rounded-xl border-2 transition-all text-left flex flex-col items-center gap-2 cursor-pointer btn-press ${
                          isSelected
                            ? 'border-slate-950 bg-slate-50 shadow-md ring-2 ring-rose-500/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="relative w-8 h-8 rounded-full shadow-inner flex items-center justify-center" style={{ backgroundColor: preset.primary }}>
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                          {isSelected && (
                            <div className="absolute inset-0 rounded-full border-2 border-white animate-pulse" />
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 text-center truncate w-full font-racing">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Visual Preview & READY Toggle Button (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              {/* Car Visual Preview */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <span className="text-xs font-bold text-slate-900 font-racing">
                    PRATINJAU REPRESENTASI LINTASAN
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    #{carNumber}
                  </span>
                </div>

                {/* SVG Vector F1 Car & Circular Racer Representation */}
                <div className="my-4 py-4 w-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200/80 p-6 relative">
                  {/* Circular Racer Representation as on track */}
                  <div className="relative mb-4 flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                      style={{ backgroundColor: selectedPreset.primary }}
                    >
                      <span className="text-white font-black font-racing text-xl">
                        {carNumber}
                      </span>
                    </div>
                    {/* Floating Name Badge */}
                    <div className="mt-2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold font-racing shadow">
                      {name || 'Nama Siswa'} #{carNumber}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      (Tampilan marker di sirkuit guru)
                    </span>
                  </div>

                  {/* F1 Silhouette Art */}
                  <div className="w-full max-w-[200px] h-12 flex items-center justify-center opacity-85">
                    <svg viewBox="0 0 200 60" className="w-full h-full">
                      <rect x="10" y="15" width="25" height="6" fill="#1E293B" rx="1" />
                      <rect x="20" y="21" width="5" height="15" fill="#64748B" />
                      <path
                        d="M 25 35 L 70 30 L 120 28 L 155 35 L 185 45 L 25 45 Z"
                        fill={selectedPreset.primary}
                      />
                      <path d="M 90 28 Q 105 18 120 28 Z" fill="#0F172A" />
                      <path d="M 40 40 L 150 40 L 140 42 L 35 42 Z" fill={selectedPreset.accent} />
                      <rect x="160" y="44" width="35" height="4" fill="#1E293B" rx="1" />
                      <circle cx="45" cy="46" r="10" fill="#0F172A" stroke="#475569" strokeWidth="2" />
                      <circle cx="155" cy="46" r="10" fill="#0F172A" stroke="#475569" strokeWidth="2" />
                      <circle cx="45" cy="46" r="4" fill="#CBD5E1" />
                      <circle cx="155" cy="46" r="4" fill="#CBD5E1" />
                    </svg>
                  </div>
                </div>

                <div className="w-full text-left space-y-1.5 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pembalap:</span>
                    <strong className="text-slate-900">{name || '-'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tim:</span>
                    <strong className="text-slate-900">{selectedPreset.teamName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Warna Sirkuit:</span>
                    <strong className="font-mono" style={{ color: selectedPreset.primary }}>
                      {selectedPreset.name}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Luminous Glowing READY Status Button */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center">
                <div className="text-center mb-3">
                  <span className="text-xs font-bold text-slate-500 tracking-wider font-racing block">
                    STATUS KESIAPAN BALAPAN
                  </span>
                  <span className={`text-sm font-black font-racing mt-0.5 block ${
                    isReady ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {isReady ? '● STATUS: SUDAH SIAP (READY TO RACE)' : '○ STATUS: BELUM SIAP (STANDBY)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleReady}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-base font-racing tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-3 cursor-pointer transform hover:scale-[1.02] btn-press btn-shockwave ${
                    isReady
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-4 ring-emerald-400/40 shadow-emerald-600/40 animate-pulse-subtle'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-4 ring-amber-300/40 shadow-amber-500/30'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${isReady ? 'bg-white animate-ping' : 'bg-slate-900'}`} />
                  <span>{isReady ? 'SAYA SUDAH SIAP! (READY)' : 'KLIK UNTUK SIAP (SET READY)'}</span>
                </button>

                {/* Locked / Ongoing Race info message */}
                <div className="w-full mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {raceStatus === 'racing' ? (
                      <span className="text-emerald-700 font-bold">
                        🏎️ Balapan sedang berlangsung di lintasan! Klik SIAP untuk langsung bergabung memacu mobilmu ke soal.
                      </span>
                    ) : isReady ? (
                      '✓ Nama & mobil Anda telah masuk ke layar sirkuit Guru secara real-time. Bersiap di kokpit!'
                    ) : (
                      'Pastikan nama sudah diisi, lalu tekan tombol SIAP di atas agar muncul di dashboard Guru.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Student Dashboard Tab */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 font-racing">TOTAL BALAPAN</span>
                <p className="text-2xl font-black text-slate-900 font-racing mt-1">14 GP</p>
                <span className="text-[11px] text-emerald-600 font-medium">Musim 2026</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 font-racing">AKURASI LOGARITMA</span>
                <p className="text-2xl font-black text-emerald-600 font-racing mt-1">88.5%</p>
                <span className="text-[11px] text-slate-500">Tinggi (Tier Master)</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 font-racing">BEST LAP TIME</span>
                <p className="text-2xl font-black text-purple-600 font-racing mt-1">1:18.420</p>
                <span className="text-[11px] text-slate-500">Sirkuit Logaritma GP</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 font-racing">DRS COMBO TERBAIK</span>
                <p className="text-2xl font-black text-amber-500 font-racing mt-1">7x Streak</p>
                <span className="text-[11px] text-slate-500">+350 km/h Top Speed</span>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-racing flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-600 transform -skew-x-12" />
                  PANDUAN PIT-WALL (RUMUS & SIFAT)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Buka lembar contekan resmi sifat-sifat logaritma untuk mempertajam insting balapmu sebelum balapan dimulai.
                </p>
                <button
                  type="button"
                  onClick={() => setShowFormulaModal(true)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-racing transition-colors cursor-pointer btn-press"
                >
                  BUKA PANDUAN RUMUS LOGARITMA
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-racing flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 transform -skew-x-12" />
                  INFO BALAPAN LOGARACING
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Format 1 lap sprint dengan 10 soal logaritma. Balapan akan dimulai serentak saat Guru menekan Mulai Balapan, dan siswa yang baru masuk tetap dapat bergabung langsung ke perlombaan selama belum ada 10 pemenang.
                </p>
                <div className="px-4 py-2.5 bg-slate-100 rounded-xl text-xs font-bold font-racing text-slate-700">
                  STATUS ROOM: {raceStatus === 'racing' ? 'BALAPAN SEDANG BERLANGSUNG' : 'MENUNGGU START GURU'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <FormulaCheatSheetModal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
      />
    </div>
  );
};
